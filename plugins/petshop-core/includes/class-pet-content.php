<?php
/**
 * Petshop_Pet_Content — "Aktualu siandien" turinio atranka (M8, S201).
 *
 * Kontekstinis augintinio informacijos sluoksnis. NE reklama.
 * Turinys is data/aktualu_siandien.json.
 *
 * Atrankos semantika (uzrakinta su konsultantu):
 *   - vieno masyvo viduje OR: species ["dog","cat"] = suo ARBA kate
 *   - skirtingos grupes AND: rusis IR sezonas IR poreikis IR etapas IR conditions
 *   - visi conditions raktai turi sutapti
 *   - tuscias masyvas/objektas = filtras netaikomas
 *   - parenkama pagal atidaryta pet_id
 *   - sezonas per metu riba: jei start<=end normalus, kitaip data>=start ARBA data<=end
 *   - cooldown per user_id+pet_id+content_id (user_meta)
 *   - shown_at fiksuojamas tik kai kortele parodyta (mark_shown)
 *   - tie-break: vienodo prioriteto -> seniausiai matytas
 *   - CTA rodomas tik kai cta_text IR cta_url netusti (sprendziama frontende)
 *   - jei niekas netinka -> null (blokas nerodomas)
 *
 * REST:
 *   GET /petshop/v1/pet-content/{pet_id}  -> viena kortele arba null
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Petshop_Pet_Content {

	const META_SEEN_PREFIX = 'ps_content_seen_'; // + content_id -> timestamp (per user; pet dedam i rakto verte)

	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
	}

	public static function register_routes() {
		register_rest_route( 'petshop/v1', '/pet-content/(?P<id>\d+)', array(
			'methods'             => 'GET',
			'callback'            => array( __CLASS__, 'handle_get' ),
			'permission_callback' => 'is_user_logged_in',
		) );
	}

	private static function data_file() {
		return dirname( __FILE__, 2 ) . '/data/aktualu_siandien.json';
	}

	private static function load_items() {
		$file = self::data_file();
		if ( ! file_exists( $file ) ) {
			return array();
		}
		$json = json_decode( file_get_contents( $file ), true );
		if ( ! is_array( $json ) || empty( $json['items'] ) ) {
			return array();
		}
		return $json['items'];
	}

	public static function handle_get( $request ) {
		$user_id = get_current_user_id();
		$pet_id = (int) $request['id'];

		if ( ! class_exists( 'Petshop_Pet_Profile' ) ) {
			return rest_ensure_response( array( 'ok' => true, 'content' => null ) );
		}
		$pet = Petshop_Pet_Profile::get_pet( $pet_id );
		if ( ! $pet || (int) $pet->user_id !== $user_id || $pet->status === 'deleted' ) {
			return new WP_Error( 'not_found', 'Augintinis nerastas.', array( 'status' => 404 ) );
		}

		$item = self::select_for_pet( $pet, $user_id );
		if ( ! $item ) {
			return rest_ensure_response( array( 'ok' => true, 'content' => null ) );
		}

		// Pazymim kaip parodyta (shown_at)
		self::mark_shown( $user_id, $pet_id, $item['id'] );

		// CTA rodomas tik kai abu netusti
		$has_cta = ! empty( $item['cta_text'] ) && ! empty( $item['cta_url'] );

		return rest_ensure_response( array(
			'ok'      => true,
			'content' => array(
				'id'        => $item['id'],
				'title'     => $item['title'],
				'text'      => $item['text'],
				'cta_text'  => $has_cta ? $item['cta_text'] : '',
				'cta_url'   => $has_cta ? $item['cta_url'] : '',
				'image_key' => $item['image_key'] ?? '',
				'image_url' => self::image_url( $item['image_key'] ?? '' ),
			),
		) );
	}

	/**
	 * Pagrindine atranka. Grazina viena item arba null.
	 */
	public static function select_for_pet( $pet, $user_id ) {
		$items = self::load_items();
		if ( empty( $items ) ) {
			return null;
		}

		$today = self::today_md();
		$candidates = array();

		foreach ( $items as $item ) {
			if ( ( $item['status'] ?? 'active' ) !== 'active' ) {
				continue;
			}
			if ( ! self::match_species( $item, $pet ) ) {
				continue;
			}
			if ( ! self::match_season( $item, $today ) ) {
				continue;
			}
			if ( ! self::match_needs( $item, $pet ) ) {
				continue;
			}
			if ( ! self::match_life_stages( $item, $pet ) ) {
				continue;
			}
			if ( ! self::match_conditions( $item, $pet ) ) {
				continue;
			}
			if ( self::in_cooldown( $item, $user_id, $pet->id ) ) {
				continue;
			}
			$candidates[] = $item;
		}

		if ( empty( $candidates ) ) {
			return null;
		}

		// Rusiavimas: aukstesnis prioritetas pirmas; vienodo prioriteto -> seniausiai matytas
		usort( $candidates, function( $a, $b ) use ( $user_id, $pet ) {
			$pa = (int) ( $a['priority'] ?? 0 );
			$pb = (int) ( $b['priority'] ?? 0 );
			if ( $pa !== $pb ) {
				return $pb - $pa; // desc
			}
			// tie-break: seniausiai matytas (mazesnis timestamp) pirmas; niekada nematytas = 0
			$sa = self::last_seen( $user_id, $pet->id, $a['id'] );
			$sb = self::last_seen( $user_id, $pet->id, $b['id'] );
			return $sa - $sb; // asc (seniausiai matytas pirmas)
		} );

		return $candidates[0];
	}

	private static function match_species( $item, $pet ) {
		$species = $item['species'] ?? array();
		if ( empty( $species ) ) {
			return true; // filtras netaikomas
		}
		if ( in_array( 'all', $species, true ) ) {
			return true;
		}
		return in_array( $pet->species, $species, true );
	}

	private static function match_season( $item, $today ) {
		$start = $item['season_start'] ?? '';
		$end = $item['season_end'] ?? '';
		if ( $start === '' || $end === '' ) {
			return true; // filtras netaikomas
		}
		// Palyginimas MM-DD kaip string veikia leksikografiskai (fiksuotas formatas)
		if ( $start <= $end ) {
			// Normalus intervalas
			return ( $today >= $start && $today <= $end );
		}
		// Per metu riba (pvz 12-20 .. 01-05)
		return ( $today >= $start || $today <= $end );
	}

	private static function match_needs( $item, $pet ) {
		$needs = $item['needs'] ?? array();
		if ( empty( $needs ) ) {
			return true;
		}
		// pet->primary_need turi buti tarp needs (OR masyve)
		return in_array( $pet->primary_need, $needs, true );
	}

	private static function match_life_stages( $item, $pet ) {
		$stages = $item['life_stages'] ?? array();
		if ( empty( $stages ) ) {
			return true;
		}
		return in_array( $pet->life_stage, $stages, true );
	}

	private static function match_conditions( $item, $pet ) {
		$conditions = $item['conditions'] ?? array();
		if ( empty( $conditions ) ) {
			return true;
		}
		// Visi raktai turi sutapti
		foreach ( $conditions as $key => $val ) {
			if ( ! isset( $pet->$key ) ) {
				return false;
			}
			if ( (string) $pet->$key !== (string) $val ) {
				return false;
			}
		}
		return true;
	}

	private static function in_cooldown( $item, $user_id, $pet_id ) {
		$cooldown = (int) ( $item['cooldown_days'] ?? 0 );
		if ( $cooldown <= 0 ) {
			return false;
		}
		$last = self::last_seen( $user_id, $pet_id, $item['id'] );
		if ( $last <= 0 ) {
			return false; // niekada nematyta
		}
		$elapsed_days = ( time() - $last ) / DAY_IN_SECONDS;
		return $elapsed_days < $cooldown;
	}

	/**
	 * Paskutinio matymo timestamp. Saugom user_meta: ps_content_seen_{content_id} = array(pet_id => ts).
	 */
	private static function last_seen( $user_id, $pet_id, $content_id ) {
		$meta = get_user_meta( $user_id, self::META_SEEN_PREFIX . $content_id, true );
		if ( ! is_array( $meta ) ) {
			return 0;
		}
		return (int) ( $meta[ $pet_id ] ?? 0 );
	}

	private static function mark_shown( $user_id, $pet_id, $content_id ) {
		$key = self::META_SEEN_PREFIX . $content_id;
		$meta = get_user_meta( $user_id, $key, true );
		if ( ! is_array( $meta ) ) {
			$meta = array();
		}
		$meta[ $pet_id ] = time();
		update_user_meta( $user_id, $key, $meta );
	}

	private static function today_md() {
		return gmdate( 'm-d' );
	}

	private static function image_url( $image_key ) {
		if ( empty( $image_key ) ) {
			return null;
		}
		$rel = 'assets/images/content-' . $image_key . '.png';
		$path = dirname( __FILE__, 2 ) . '/' . $rel;
		if ( ! file_exists( $path ) ) {
			return null; // failo dar nera -> tekstine kortele
		}
		return plugins_url( $rel, dirname( __FILE__ ) );
	}
}
