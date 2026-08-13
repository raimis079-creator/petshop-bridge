<?php
/**
 * Petshop Rinkiniai v1.3 (E4) — PARUOSTU RINKINIU VALDYMAS
 *
 * KAM: iki siol rinkinius buvo galima tik SUKURTI (snippet 539). Sarašo nebuvo,
 * redagavimo nebuvo, trynimo nebuvo. Norint pakeisti rinkinio kaina ar sudeti
 * reikejo eiti i WooCommerce prekes langa (415 lauku) ir taisyti ranka.
 * Del to atsirado ir tokie atvejai kaip #34196: tevinis rinkinys istrintas, o
 * seši pasleptri dydziai liko publikuoti — niekas to nemate.
 *
 * KAS CIA: vienas langas, kuriame matomi visi paruosti rinkiniai su marza,
 * savikaina ir likuciu, ir kuriame juos galima kurti, redaguoti bei istrinti.
 *
 * UNIVERSALUS MODELIS (savininko reikalavimas 2026-08-12):
 *   Rinkinys gali buti IS BET KOKIU prekiu — ne tik konservu/skanestu/kramtalu.
 *   2x Ambrosia 12,5 kg · tualetas + semtuvelis + maistas · kraikas 8 vnt ·
 *   rinkinys suniukui. Todel paieska eina per VISA kataloga (2 566 prekes) su
 *   filtrais: kategorija (medis su palikuonimis) · svoris (pa_pakuotes_dydis) ·
 *   sandelis · savikaina · tekstas.
 *
 * KAINODARA: renkant matoma prekes savikaina, pardavimo kaina ir marza.
 * Rinkinio lygmenyje — savikaina, prekiu suma, rekomenduojama kaina pagal
 * norima marza, ir gyvai persiskaiciuojanti marza keiciant kaina.
 *
 * SARGAI (ne blokuoja, bet pasako):
 *   - rinkinys brangesnis nei prekes atskirai
 *   - marza minusine
 *   - komponentas be likucio (rinkinio surinkti negalima)
 *   - keliu dropship tiekeju prekes viename rinkinyje (dvi siuntos)
 *   - norima marza nepasiekiama nevirsijant iprastos kainos
 *
 * PUBLIKAVIMAS: nauja rinkinys pagal nutylejima kuriamas JUODRASCIU. Varnele
 * „Publikuoti" ji paleidzia i parduotuve. Taip galima pirma pasiziureti, kaip
 * atrodo, ir tik tada rodyti klientams.
 *
 * DU TIPAI PAGAL SUDETI (savininko klausimas 2026-08-12):
 *   A) KELIOS SKIRTINGOS PREKES -> Mix and Match rinkinys.
 *      Likucius saugo `petshop-rinkiniu-likuciai.php` (rinkinys dingsta is
 *      prekybos, kai bent vieno komponento nebeuztenka).
 *   B) TA PATI PREKE x N -> „Daugiau=pigiau" pakas (`simple` + `_dp_base_product_id`
 *      + `_dp_pack_qty`). Ne MnM! Priezastis ne likuciai (juos tvarko snippet 567
 *      nurasydamas is bazines prekes), o VITRINA: pakas turi savo isvaizda —
 *      zenklas „xN VNT.", juosta „EKONOMISKA PAKUOTE", lentele su bendru kiekiu
 *      ir vieneto kaina (snippet 568/570/573). Sukurus toki rinkini kaip MnM,
 *      klientas gauna „PRODUCT / QUANTITY / ISVALYTI PASIRINKIMUS" — netinka.
 *      Nuotrauka DP atveju NEGENERUOJAMA: naudojama bazines prekes nuotrauka.
 *      Kategorija taip pat kita — DAUGIAU=PIGIAU (91), ne RINKINIAI (679).
 *
 * KAS LIEKA KITUR:
 *   - Susidejimo rinkiniai (klientas pats renkasi) — snippet 550/547.
 *   - Fiksuotu kiekiu rodymas vitrinoje („xN") — snippet 532.
 *   - Kategoriju auto-priskyrimas issaugant — snippet 569 (cia tik parodoma,
 *     ka jis nustatys, kad nebutu staigmenu).
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Rinkiniai {

	const VERSIJA = '1.3';
	const SLUG    = 'ps-rinkiniai';
	const META_KIEKIAI = '_petshop_component_quantities';

	/* ==================== PALEIDIMAS ==================== */

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'meniu' ), 20 );
		add_action( 'wp_ajax_ps_rink_paieska',   array( __CLASS__, 'ajax_paieska' ) );
		add_action( 'wp_ajax_ps_rink_issaugoti', array( __CLASS__, 'ajax_issaugoti' ) );
		add_action( 'wp_ajax_ps_rink_trinti',    array( __CLASS__, 'ajax_trinti' ) );
		add_filter( 'admin_body_class', array( __CLASS__, 'body_klase' ) );
	}

	public static function meniu() {
		add_submenu_page(
			'ps-katalogas', 'Rinkiniai', 'Rinkiniai', 'manage_woocommerce',
			self::SLUG, array( __CLASS__, 'puslapis' )
		);
	}

	public static function body_klase( $k ) {
		if ( isset( $_GET['page'] ) && $_GET['page'] === self::SLUG ) { $k .= ' petshop-rinkiniai'; }
		return $k;
	}

	/**
	 * Vieninga virsutine juosta — TA PATI, kaip Kataloge/Akcijose/Gavime.
	 * `Petshop_Katalogas::navigacija()` GRAZINA html (ne echo), todel ji reikia
	 * isvesti pacia — pirmoje versijoje to truko ir juostos nesimate.
	 * Jei katalogo klases nera (isjungta), rodom savo atsargini sarasa, kad
	 * langas neliktu be kelio i kitus.
	 */
	private static function navigacija() {
		$nuorodos = '';
		if ( class_exists( 'Petshop_Katalogas' ) && method_exists( 'Petshop_Katalogas', 'navigacija' ) ) {
			$nuorodos = Petshop_Katalogas::navigacija( self::SLUG );
		} else {
			$langai = array(
				'ps-katalogas' => 'Katalogas', 'ps-rinkiniai' => 'Rinkiniai',
				'ps-akcijos' => 'Akcijos', 'ps-gavimas' => 'Gavimas',
				'ps-tiekimas' => 'Tiekimas', 'ps-desk' => 'Užsakymai',
			);
			foreach ( $langai as $slug => $vardas ) {
				$nuorodos .= '<a class="' . ( $slug === self::SLUG ? 'on' : '' ) . '" href="'
					. esc_url( admin_url( 'admin.php?page=' . $slug ) ) . '">' . esc_html( $vardas ) . '</a>';
			}
		}
		echo '<div class="pskat-bar">'
			. '<div class="pskat-logo">PETSHOP</div>'
			. '<nav class="pskat-nav">' . $nuorodos . '</nav>'
			. '<form class="pskat-search" method="get" action="' . esc_url( admin_url( 'admin.php' ) ) . '">'
			. '<input type="hidden" name="page" value="' . esc_attr( self::SLUG ) . '">'
			. '<span class="lupa" aria-hidden="true">🔍</span>'
			. '<input type="search" name="q" value="' . esc_attr( isset( $_GET['q'] ) ? sanitize_text_field( wp_unslash( $_GET['q'] ) ) : '' ) . '" placeholder="Ieškoti rinkinio: pavadinimas arba SKU…">'
			. '</form>'
			. '<div class="pskat-meta">Rinkinių valdymas</div>'
			. '</div>';
	}

	/* ==================== PAGALBINES ==================== */

	/**
	 * Savikaina. Eiliskumas TOKS PAT kaip snippet 539/550 — kitaip tas pats
	 * rinkinys dviejuose languose rodytu skirtinga marza.
	 */
	public static function savikaina( $pid ) {
		foreach ( array( '_cost_price', '_vf_cost', '_zb_cost' ) as $raktas ) {
			$v = get_post_meta( $pid, $raktas, true );
			if ( $v !== '' && $v !== false && $v !== null ) { return (float) $v; }
		}
		return null;
	}

	/** Sandelis rankiniam atrinkimui (kaip 539: pozymiu nebuvimas = AV). */
	public static function sandelis( $pid ) {
		if ( get_post_meta( $pid, '_vf_enabled', true ) === 'yes' ) { return 'vf'; }
		if ( get_post_meta( $pid, '_zb_enabled', true ) === 'yes' ) { return 'zb'; }
		return 'av';
	}

	/** Kategoriju medis su palikuoniu skaiciais. Kesuojamas — 2 500 prekiu. */
	public static function medis() {
		$kesas = get_transient( 'ps_rink_medis' );
		if ( is_array( $kesas ) && isset( $kesas['v'] ) && $kesas['v'] === self::VERSIJA ) { return $kesas; }

		$terms = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false ) );
		if ( is_wp_error( $terms ) ) { $terms = array(); }

		$cats = array(); $vaikai = array();
		foreach ( $terms as $t ) {
			$cats[ $t->term_id ] = array( 'id' => $t->term_id, 'n' => $t->name, 'p' => (int) $t->parent );
			$vaikai[ (int) $t->parent ][] = $t->term_id;
		}
		/* palikuonys */
		$palik = array();
		$rasti = function( $id ) use ( &$rasti, $vaikai ) {
			$out = array( $id );
			if ( ! empty( $vaikai[ $id ] ) ) {
				foreach ( $vaikai[ $id ] as $v ) { $out = array_merge( $out, $rasti( $v ) ); }
			}
			return $out;
		};
		foreach ( $cats as $id => $c ) { $palik[ $id ] = $rasti( $id ); }

		/* prekiu skaicius su palikuoniais */
		global $wpdb; $p = $wpdb->prefix;
		$eil = $wpdb->get_results(
			"SELECT tr.object_id pid, tt.term_id tid
			   FROM {$p}term_relationships tr
			   JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
			   JOIN {$p}posts po ON po.ID = tr.object_id AND po.post_type='product' AND po.post_status='publish'
			  WHERE tt.taxonomy='product_cat'", ARRAY_A );
		$prekes = array();
		foreach ( $eil as $e ) { $prekes[ (int) $e['pid'] ][] = (int) $e['tid']; }
		$kiek = array();
		foreach ( $palik as $id => $sarasas ) {
			$rink = array_flip( $sarasas ); $n = 0;
			foreach ( $prekes as $pid => $ks ) {
				foreach ( $ks as $k ) { if ( isset( $rink[ $k ] ) ) { $n++; break; } }
			}
			$kiek[ $id ] = $n;
		}

		/* meniu tvarka: kas rodoma klientui, tas ir cia pirma */
		$meniu_top = array(); $meniu = wp_get_nav_menu_object( 'Pagrindinis meniu' );
		if ( $meniu ) {
			foreach ( (array) wp_get_nav_menu_items( $meniu->term_id ) as $it ) {
				if ( (int) $it->menu_item_parent === 0 && $it->object === 'product_cat' ) {
					$meniu_top[] = (int) $it->object_id;
				}
			}
		}
		if ( ! $meniu_top ) {
			foreach ( $cats as $id => $c ) { if ( $c['p'] === 0 && $kiek[ $id ] > 20 ) { $meniu_top[] = $id; } }
		}

		$T = array();
		$deti = function( $id, $lygis ) use ( &$deti, $cats, $vaikai, $kiek, &$T ) {
			if ( ! isset( $cats[ $id ] ) ) { return; }
			if ( $kiek[ $id ] === 0 && empty( $vaikai[ $id ] ) ) { return; }
			$T[] = array( $id, $cats[ $id ]['n'], $kiek[ $id ], $lygis );
			if ( ! empty( $vaikai[ $id ] ) ) {
				$vv = $vaikai[ $id ];
				usort( $vv, function( $a, $b ) use ( $cats ) { return strcoll( $cats[ $a ]['n'], $cats[ $b ]['n'] ); } );
				foreach ( $vv as $v ) { $deti( $v, $lygis + 1 ); }
			}
		};
		foreach ( $meniu_top as $id ) { $deti( $id, 0 ); }

		/* likusios sakniniai su prekemis — i „senos" grupe */
		$O = array();
		foreach ( $cats as $id => $c ) {
			if ( $c['p'] !== 0 || in_array( $id, $meniu_top, true ) || $kiek[ $id ] === 0 ) { continue; }
			$O[] = array( $id, $c['n'], $kiek[ $id ] );
		}
		usort( $O, function( $a, $b ) { return $b[2] - $a[2]; } );

		$rez = array( 'v' => self::VERSIJA, 'T' => $T, 'O' => $O, 'palik' => $palik,
			'vardai' => wp_list_pluck( $cats, 'n' ) );
		set_transient( 'ps_rink_medis', $rez, 6 * HOUR_IN_SECONDS );
		return $rez;
	}

	/** Svorio reiksmes, surikiuotos pagal tikra dydi (ne abecele). */
	public static function svoriai() {
		$t = get_terms( array( 'taxonomy' => 'pa_pakuotes_dydis', 'hide_empty' => true ) );
		if ( is_wp_error( $t ) ) { return array(); }
		$sar = wp_list_pluck( $t, 'name' );
		usort( $sar, function( $a, $b ) {
			$f = function( $s ) {
				if ( ! preg_match( '/^([\d,\.]+)\s*(g|kg|ml|l)?/ui', trim( $s ), $m ) ) { return 999999; }
				$v = (float) str_replace( ',', '.', $m[1] );
				$u = strtolower( $m[2] ?? '' );
				return $v * ( ( $u === 'kg' || $u === 'l' ) ? 1000 : 1 );
			};
			return $f( $a ) <=> $f( $b );
		} );
		return $sar;
	}

	/* ==================== RINKINIU SARASAS ==================== */

	/**
	 * Paruosti rinkiniai = MnM prekes, kurios NEPRIKLAUSO susidejimo rinkiniui.
	 * Susidejimo pasleptri dydziai turi `_petshop_choice_parent` — juos praleidziam,
	 * nes jie valdomi kitame lange ir cia tik triuksmautu.
	 */
	public static function rinkiniai() {
		return array_merge( self::rinkiniai_mnm(), self::rinkiniai_dp() );
	}

	/** „Daugiau=pigiau" pakai — ta pati preke x N. */
	public static function rinkiniai_dp() {
		global $wpdb; $p = $wpdb->prefix;
		$ids = $wpdb->get_col( "SELECT post_id FROM {$p}postmeta WHERE meta_key='_dp_base_product_id'" );
		$out = array();
		foreach ( (array) $ids as $pid ) {
			$pid  = (int) $pid;
			$post = get_post( $pid );
			if ( ! $post || $post->post_status === 'trash' ) { continue; }
			$bid  = (int) get_post_meta( $pid, '_dp_base_product_id', true );
			$qty  = (int) get_post_meta( $pid, '_dp_pack_qty', true );
			$baze = wc_get_product( $bid );
			$kaina = (float) get_post_meta( $pid, '_price', true );
			$sav   = $baze ? self::savikaina( $bid ) : null;
			$suma  = $baze ? (float) $baze->get_price() * $qty : 0;
			$lik   = $baze ? $baze->get_stock_quantity() : null;

			$out[] = array(
				'id' => $pid, 'pav' => $post->post_title, 'busena' => $post->post_status,
				'sku' => (string) get_post_meta( $pid, '_sku', true ),
				'kaina' => $kaina,
				'savikaina' => ( $sav === null ) ? null : $sav * $qty,
				'suma' => $suma,
				'marza' => ( $sav === null || $kaina <= 0 ) ? null : $kaina - $sav * $qty,
				'vnt' => $qty, 'fiksuota' => true, 'poz' => 1, 'truksta' => ( $sav === null ) ? 1 : 0,
				'lubos' => ( $lik === null || $qty < 1 ) ? null : (int) floor( $lik / $qty ),
				'negalimi' => ( $baze && $baze->get_stock_status() === 'instock' ) ? 0 : 1,
				'sandeliai' => $baze ? array( self::sandelis( $bid ) ) : array(),
				'kat' => wp_get_post_terms( $pid, 'product_cat', array( 'fields' => 'names' ) ),
				'tipas' => 'dp', 'baze' => $bid,
				'baze_pav' => $baze ? $baze->get_name() : '(nerasta #' . $bid . ')',
			);
		}
		return $out;
	}

	public static function rinkiniai_mnm() {
		global $wpdb; $p = $wpdb->prefix;

		$ids = $wpdb->get_col(
			"SELECT po.ID FROM {$p}posts po
			   JOIN {$p}term_relationships tr ON tr.object_id = po.ID
			   JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
			   JOIN {$p}terms t ON t.term_id = tt.term_id
			  WHERE po.post_type='product' AND po.post_status IN ('publish','draft','pending','private')
			    AND tt.taxonomy='product_type' AND t.slug='mix-and-match'
			  ORDER BY po.post_title ASC" );
		if ( ! $ids ) { return array(); }

		update_meta_cache( 'post', $ids );
		$out = array();
		foreach ( $ids as $pid ) {
			$pid = (int) $pid;
			if ( get_post_meta( $pid, '_petshop_choice_parent', true ) ) { continue; }

			$post = get_post( $pid );
			$kiekiai = json_decode( (string) get_post_meta( $pid, self::META_KIEKIAI, true ), true );
			if ( ! is_array( $kiekiai ) ) { $kiekiai = array(); }

			$vaikai = $wpdb->get_col( $wpdb->prepare(
				"SELECT product_id FROM {$p}wc_mnm_child_items WHERE container_id=%d ORDER BY menu_order", $pid ) );

			$sav = 0; $suma = 0; $truksta = 0; $vnt = 0; $lubos = null; $negalimi = array(); $sandeliai = array();
			foreach ( $vaikai as $vid ) {
				$vid = (int) $vid;
				$vp = wc_get_product( $vid );
				if ( ! $vp ) { $negalimi[] = $vid; continue; }
				$q = isset( $kiekiai[ $vid ] ) ? (int) $kiekiai[ $vid ] : 0;
				$c = self::savikaina( $vid );
				$vnt += $q;
				$suma += (float) $vp->get_price() * max( 1, $q );
				if ( $q > 0 ) {
					if ( $c === null ) { $truksta++; } else { $sav += $c * $q; }
					$lik = $vp->get_stock_quantity();
					if ( $lik !== null && $lik !== '' ) {
						$gali = (int) floor( $lik / $q );
						if ( $lubos === null || $gali < $lubos ) { $lubos = $gali; }
					}
				}
				if ( $vp->get_stock_status() !== 'instock' || $vp->get_status() !== 'publish' ) { $negalimi[] = $vid; }
				$sandeliai[ self::sandelis( $vid ) ] = true;
			}

			$kaina = (float) get_post_meta( $pid, '_price', true );
			$fiksuota = ! empty( $kiekiai );
			$marza = ( $fiksuota && ! $truksta && $kaina > 0 ) ? $kaina - $sav : null;

			$out[] = array(
				'id'        => $pid,
				'pav'       => $post->post_title,
				'busena'    => $post->post_status,
				'sku'       => (string) get_post_meta( $pid, '_sku', true ),
				'kaina'     => $kaina,
				'savikaina' => ( $fiksuota && ! $truksta ) ? $sav : null,
				'suma'      => $suma,
				'marza'     => $marza,
				'vnt'       => $fiksuota ? $vnt : (int) get_post_meta( $pid, '_mnm_min_container_size', true ),
				'fiksuota'  => $fiksuota,
				'poz'       => count( $vaikai ),
				'truksta'   => $truksta,
				'lubos'     => $lubos,
				'negalimi'  => count( array_unique( $negalimi ) ),
				'sandeliai' => array_keys( $sandeliai ),
				'kat'       => wp_get_post_terms( $pid, 'product_cat', array( 'fields' => 'names' ) ),
				'tipas'     => 'mnm',
			);
		}
		return $out;
	}

	/* ==================== PUSLAPIS ==================== */

	public static function puslapis() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_die( 'Neturite teisių.' ); }
		$veiksmas = isset( $_GET['veiksmas'] ) ? sanitize_key( $_GET['veiksmas'] ) : '';
		$id       = isset( $_GET['id'] ) ? (int) $_GET['id'] : 0;

		self::stilius();
		self::navigacija();
		echo '<div class="wrap psrink">';

		if ( $veiksmas === 'naujas' || ( $veiksmas === 'keisti' && $id ) ) {
			self::forma( $veiksmas === 'keisti' ? $id : 0 );
		} else {
			self::sarasas();
		}
		echo '</div>';
	}

	/* ==================== SARASAS ==================== */

	private static function sarasas() {
		$sar = self::rinkiniai();
		$q = isset( $_GET['q'] ) ? mb_strtolower( sanitize_text_field( wp_unslash( $_GET['q'] ) ) ) : '';
		if ( $q !== '' ) {
			$sar = array_values( array_filter( $sar, function( $r ) use ( $q ) {
				return mb_strpos( mb_strtolower( $r['pav'] . ' ' . $r['sku'] ), $q ) !== false;
			} ) );
		}
		$nauja = admin_url( 'admin.php?page=' . self::SLUG . '&veiksmas=naujas' );

		/* darbo eiles — skaiciai, ne teorija */
		$e = array( 'nefix' => 0, 'nocost' => 0, 'dead' => 0, 'juod' => 0, 'ok' => 0, 'dp' => 0 );
		foreach ( $sar as $r ) {
			$bl = self::bedos( $r );
			if ( ! $r['fiksuota'] ) { $e['nefix']++; }
			if ( $r['truksta'] ) { $e['nocost']++; }
			if ( $r['negalimi'] ) { $e['dead']++; }
			if ( $r['busena'] !== 'publish' ) { $e['juod']++; }
			if ( ( $r['tipas'] ?? '' ) === 'dp' ) { $e['dp']++; }
			if ( ! $bl ) { $e['ok']++; }
		}
		$filtras = isset( $_GET['eile'] ) ? sanitize_key( $_GET['eile'] ) : '';

		echo '<h1 class="wp-heading-inline">Rinkiniai</h1> ';
		echo '<a href="' . esc_url( $nauja ) . '" class="page-title-action">➕ Sukurti rinkinį</a>';
		echo '<p class="description">Bet kokių prekių derinys su fiksuota kaina — maistas, kraikas, aksesuarai, dovanų rinkiniai. Klientas gauna tai, ką sudėjome.</p>';
		if ( $q !== '' ) {
			echo '<p class="description">Paieška: <b>' . esc_html( $q ) . '</b> — rasta ' . count( $sar ) . '. '
				. '<a href="' . esc_url( admin_url( 'admin.php?page=' . self::SLUG ) ) . '">išvalyti</a></p>';
		}

		$eiles = array(
			''       => array( 'Visi', count( $sar ), '' ),
			'nefix'  => array( 'Kiekiai nefiksuoti', $e['nefix'], 'y' ),
			'nocost' => array( 'Be savikainos', $e['nocost'], 'y' ),
			'dead'   => array( 'Komponentas neparduodamas', $e['dead'], 'y' ),
			'dp'     => array( 'Daugiau=pigiau', $e['dp'], 'b' ),
			'juod'   => array( 'Juodraščiai', $e['juod'], 'b' ),
			'ok'     => array( 'Sutvarkyta', $e['ok'], 'g' ),
		);
		echo '<div class="psr-eiles">';
		foreach ( $eiles as $k => $v ) {
			$url = admin_url( 'admin.php?page=' . self::SLUG . ( $k ? '&eile=' . $k : '' ) );
			echo '<a class="psr-eile ' . esc_attr( $v[2] ) . ( $filtras === $k ? ' on' : '' ) . '" href="' . esc_url( $url ) . '">'
				. '<b>' . (int) $v[1] . '</b><span>' . esc_html( $v[0] ) . '</span></a>';
		}
		echo '</div>';

		echo '<table class="wp-list-table widefat fixed striped psr-lentele"><thead><tr>'
			. '<th style="width:60px">Vnt.</th><th>Rinkinys</th><th style="width:120px">Tipas</th>'
			. '<th style="width:90px" class="r">Savikaina</th><th style="width:90px" class="r">Atskirai</th>'
			. '<th style="width:90px" class="r">Kaina</th><th style="width:120px" class="r">Marža</th>'
			. '<th style="width:100px" class="r">Galima parduoti</th><th style="width:180px">Būklė</th>'
			. '</tr></thead><tbody>';

		$rodyta = 0;
		foreach ( $sar as $r ) {
			$bl = self::bedos( $r );
			if ( $filtras === 'nefix'  && $r['fiksuota'] ) { continue; }
			if ( $filtras === 'nocost' && ! $r['truksta'] ) { continue; }
			if ( $filtras === 'dead'   && ! $r['negalimi'] ) { continue; }
			if ( $filtras === 'juod'   && $r['busena'] === 'publish' ) { continue; }
			if ( $filtras === 'dp'     && ( $r['tipas'] ?? '' ) !== 'dp' ) { continue; }
			if ( $filtras === 'ok'     && $bl ) { continue; }
			$rodyta++;

			$keisti = admin_url( 'admin.php?page=' . self::SLUG . '&veiksmas=keisti&id=' . $r['id'] );
			$proc   = ( $r['marza'] !== null && $r['kaina'] > 0 ) ? round( $r['marza'] / $r['kaina'] * 100 ) : null;
			$rink   = array_values( array_filter( $r['kat'], function( $c ) { return stripos( $c, 'rinkin' ) !== false; } ) );

			echo '<tr>';
			echo '<td class="r"><b>' . ( $r['fiksuota'] ? (int) $r['vnt'] : '<span class="psr-bad">0/' . (int) $r['vnt'] . '</span>' ) . '</b></td>';
			echo '<td><strong><a href="' . esc_url( $keisti ) . '">' . esc_html( $r['pav'] ) . '</a></strong>';
			if ( $r['busena'] !== 'publish' ) { echo ' <span class="psr-z b">' . esc_html( self::busena_pav( $r['busena'] ) ) . '</span>'; }
			echo '<div class="psr-mut">#' . (int) $r['id'] . ( $r['sku'] ? ' · ' . esc_html( $r['sku'] ) : '' ) . ' · ' . (int) $r['poz'] . ' pozicijos</div>';
			echo '<div class="row-actions"><span><a href="' . esc_url( $keisti ) . '">Redaguoti</a> | </span>'
				. '<span><a href="#" class="psr-kopijuoti" data-id="' . (int) $r['id'] . '">Kopijuoti</a> | </span>'
				. '<span><a href="' . esc_url( get_permalink( $r['id'] ) ) . '" target="_blank">Peržiūrėti</a> | </span>'
				. '<span class="trash"><a href="#" class="psr-trinti" data-id="' . (int) $r['id'] . '" data-pav="' . esc_attr( $r['pav'] ) . '">Ištrinti</a></span></div>';
			echo '</td>';
			echo '<td>' . ( ( $r['tipas'] ?? 'mnm' ) === 'dp'
				? '<span class="psr-z b">Daugiau=pigiau</span><div class="psr-mut">' . esc_html( mb_substr( $r['baze_pav'], 0, 26 ) ) . '</div>'
				: '<span class="psr-z gr">Rinkinys</span><div class="psr-mut">' . esc_html( $rink ? implode( ', ', $rink ) : '—' ) . '</div>' ) . '</td>';
			echo '<td class="r">' . ( $r['savikaina'] !== null ? number_format( $r['savikaina'], 2, ',', ' ' ) . ' €' : '<span class="psr-mut">—</span>' ) . '</td>';
			echo '<td class="r psr-mut">' . number_format( $r['suma'], 2, ',', ' ' ) . ' €</td>';
			echo '<td class="r"><b>' . number_format( $r['kaina'], 2, ',', ' ' ) . ' €</b></td>';
			echo '<td class="r">' . ( $r['marza'] !== null
				? ( $r['marza'] < 0
					? '<b class="psr-bad">' . number_format( $r['marza'], 2, ',', ' ' ) . ' € (' . $proc . '%) ❌</b>'
					: '<b class="psr-ok">' . number_format( $r['marza'], 2, ',', ' ' ) . ' € (' . $proc . '%) ✅</b>' )
				: '<span class="psr-mut">—</span>' ) . '</td>';
			echo '<td class="r">' . ( $r['lubos'] !== null
				? '<b class="' . ( $r['lubos'] < 5 ? 'psr-bad' : 'psr-ok' ) . '">' . (int) $r['lubos'] . ' vnt.</b>'
				: '<span class="psr-mut">—</span>' ) . '</td>';
			echo '<td>' . ( $bl ? implode( ' ', array_map( function( $b ) {
				return '<span class="psr-z ' . esc_attr( $b[0] ) . '">' . esc_html( $b[1] ) . '</span>';
			}, $bl ) ) : '<span class="psr-z g">✓ sutvarkyta</span>' ) . '</td>';
			echo '</tr>';
		}
		if ( ! $rodyta ) {
			echo '<tr><td colspan="9" class="psr-tuscia">Pagal šį filtrą rinkinių nėra.</td></tr>';
		}
		echo '</tbody></table>';

		wp_nonce_field( 'ps_rink', 'ps_rink_nonce' );
		self::sarasas_js();
	}

	private static function bedos( $r ) {
		$b = array();
		if ( ( $r['tipas'] ?? 'mnm' ) === 'dp' && ! $r['baze_pav'] ) { $b[] = array( 'r', 'bazinė prekė nerasta' ); }
		if ( ! $r['fiksuota'] ) { $b[] = array( 'y', 'kiekiai nefiksuoti' ); }
		if ( $r['truksta'] )    { $b[] = array( 'y', $r['truksta'] . ' be savikainos' ); }
		if ( $r['marza'] !== null && $r['marza'] < 0 ) { $b[] = array( 'r', 'marža minusinė' ); }
		if ( $r['negalimi'] )   { $b[] = array( 'r', $r['negalimi'] . ' neparduodami' ); }
		if ( $r['lubos'] !== null && $r['lubos'] < 5 ) { $b[] = array( 'y', 'likutis ' . $r['lubos'] ); }
		if ( count( $r['sandeliai'] ) > 1 && ! in_array( 'av', $r['sandeliai'], true ) ) {
			$b[] = array( 'y', 'keli tiekėjai' );
		}
		return $b;
	}

	private static function busena_pav( $b ) {
		$m = array( 'draft' => 'juodraštis', 'pending' => 'laukia', 'private' => 'privatus' );
		return $m[ $b ] ?? $b;
	}

	private static function sarasas_js() {
		$nonce = wp_create_nonce( 'ps_rink' );
		$grizti = admin_url( 'admin.php?page=' . self::SLUG );
		?>
		<script>
		(function(){
			var N='<?php echo esc_js( $nonce ); ?>';
			document.querySelectorAll('.psr-trinti').forEach(function(a){
				a.addEventListener('click',function(e){
					e.preventDefault();
					var id=this.dataset.id, pav=this.dataset.pav;
					if(!confirm('Ištrinti rinkinį „'+pav+'"?\n\nPrekė bus perkelta į šiukšlinę (atstatoma). Komponentų ryšiai pašalinami.')) return;
					var fd=new FormData(); fd.append('action','ps_rink_trinti'); fd.append('nonce',N); fd.append('id',id);
					fetch(ajaxurl,{method:'POST',body:fd}).then(function(r){return r.json()}).then(function(j){
						if(j.success){ location.href='<?php echo esc_js( $grizti ); ?>'; }
						else alert('Klaida: '+(j.data||'nežinoma'));
					});
				});
			});
			document.querySelectorAll('.psr-kopijuoti').forEach(function(a){
				a.addEventListener('click',function(e){
					e.preventDefault();
					location.href='<?php echo esc_js( admin_url( 'admin.php?page=' . self::SLUG . '&veiksmas=naujas' ) ); ?>&kopija='+this.dataset.id;
				});
			});
		})();
		</script>
		<?php
	}


	/* ==================== FORMA ==================== */

	private static function forma( $id ) {
		$kopija = isset( $_GET['kopija'] ) ? (int) $_GET['kopija'] : 0;
		$saltinis = $id ? $id : $kopija;
		$dp_baze = $saltinis ? (int) get_post_meta( $saltinis, '_dp_base_product_id', true ) : 0;

		$d = array(
			'pav' => '', 'sku' => '', 'kaina' => '', 'aprasymas' => '',
			'komp' => array(), 'publikuoti' => 0, 'kat_rankiniu' => array(), 'tikslas' => 35,
		);
		if ( $saltinis ) {
			$post = get_post( $saltinis );
			if ( $post && $dp_baze ) {
				/* DP pakas: sudetis = viena bazine preke x pack_qty */
				$d['komp'][] = array( 'id' => $dp_baze, 'kiekis' => (int) get_post_meta( $saltinis, '_dp_pack_qty', true ) );
				$d['pav']   = $kopija ? $post->post_title . ' (kopija)' : $post->post_title;
				$d['sku']   = $kopija ? '' : (string) get_post_meta( $saltinis, '_sku', true );
				$d['kaina'] = (string) get_post_meta( $saltinis, '_price', true );
				$d['aprasymas'] = $post->post_excerpt;
				$d['publikuoti'] = ( ! $kopija && $post->post_status === 'publish' ) ? 1 : 0;
			} elseif ( $post ) {
				$kiekiai = json_decode( (string) get_post_meta( $saltinis, self::META_KIEKIAI, true ), true );
				if ( ! is_array( $kiekiai ) ) { $kiekiai = array(); }
				global $wpdb; $p = $wpdb->prefix;
				$vaikai = $wpdb->get_col( $wpdb->prepare(
					"SELECT product_id FROM {$p}wc_mnm_child_items WHERE container_id=%d ORDER BY menu_order", $saltinis ) );
				foreach ( $vaikai as $vid ) {
					$d['komp'][] = array( 'id' => (int) $vid, 'kiekis' => isset( $kiekiai[ (int) $vid ] ) ? (int) $kiekiai[ (int) $vid ] : 1 );
				}
				$d['pav']   = $kopija ? $post->post_title . ' (kopija)' : $post->post_title;
				$d['sku']   = $kopija ? '' : (string) get_post_meta( $saltinis, '_sku', true );
				$d['kaina'] = (string) get_post_meta( $saltinis, '_price', true );
				$d['aprasymas'] = $post->post_excerpt;
				$d['publikuoti'] = ( ! $kopija && $post->post_status === 'publish' ) ? 1 : 0;
			}
		}

		$medis  = self::medis();
		$svoriai = self::svoriai();
		$grizti = admin_url( 'admin.php?page=' . self::SLUG );

		echo '<h1 class="wp-heading-inline">' . ( $id ? '✏️ Redaguoti rinkinį' : '➕ Sukurti rinkinį' ) . '</h1> ';
		echo '<a href="' . esc_url( $grizti ) . '" class="page-title-action">← Į sąrašą</a>';
		echo '<p class="description">Bet kokios prekės, bet koks derinys, fiksuota kaina.</p>';

		echo '<div class="psr-forma" data-id="' . (int) $id . '">';

		/* ---------- KAIRE ---------- */
		echo '<div class="psr-kaire">';

		echo '<div class="psr-kort"><h3>1. Rinkinio duomenys</h3><div class="psr-vidus">';
		echo '<table class="form-table"><tbody>';
		echo '<tr><th><label>Pavadinimas *</label></th><td><input type="text" id="psr-pav" class="large-text" value="' . esc_attr( $d['pav'] ) . '" placeholder="Pvz. Startas šuniukui · maistas + skanėstai + žaislas"></td></tr>';
		echo '<tr><th><label>SKU *</label></th><td><input type="text" id="psr-sku" class="regular-text" value="' . esc_attr( $d['sku'] ) . '" placeholder="Pvz. RINK-STARTAS"></td></tr>';
		echo '<tr><th><label>Kur bus matomas</label></th><td><div id="psr-vieta"></div>';
		echo '<select id="psr-kat-rank"><option value="">+ pridėti vietą ranka…</option>';
		echo '<optgroup label="Katalogo struktūra">';
		foreach ( $medis['T'] as $t ) {
			echo '<option value="' . (int) $t[0] . '">' . esc_html( str_repeat( "\xC2\xA0\xC2\xA0\xC2\xA0", (int) $t[3] ) . $t[1] ) . '</option>';
		}
		echo '</optgroup><optgroup label="Kitos">';
		foreach ( $medis['O'] as $t ) { echo '<option value="' . (int) $t[0] . '">' . esc_html( $t[1] ) . '</option>'; }
		echo '</optgroup></select>';
		echo '<p class="description">Pilkos žymos priskiriamos automatiškai pagal pridėtas prekes. Klientas rinkinį ras šiose katalogo kategorijose.</p>';
		echo '</td></tr>';
		echo '<tr><th><label>Trumpas aprašymas</label></th><td><textarea id="psr-apr" class="large-text" rows="2">' . esc_textarea( $d['aprasymas'] ) . '</textarea></td></tr>';
		echo '</tbody></table></div></div>';

		/* ---- atranka ---- */
		echo '<div class="psr-kort"><h3>2. Prekių atranka<span class="psr-sp"></span><span class="description" id="psr-kat-info"></span></h3>';
		echo '<div class="psr-filtrai">';
		echo '<span class="psr-f"><label>Kategorija</label><select id="psr-f-kat"><option value="">— visos —</option>';
		echo '<optgroup label="Katalogo struktūra">';
		foreach ( $medis['T'] as $t ) {
			echo '<option value="' . (int) $t[0] . '">' . esc_html( str_repeat( "\xC2\xA0\xC2\xA0\xC2\xA0", (int) $t[3] ) . $t[1] ) . ' (' . (int) $t[2] . ')</option>';
		}
		echo '</optgroup><optgroup label="Senos kategorijos (ne meniu)">';
		foreach ( $medis['O'] as $t ) { echo '<option value="' . (int) $t[0] . '">' . esc_html( $t[1] ) . ' (' . (int) $t[2] . ')</option>'; }
		echo '</optgroup></select></span>';

		echo '<span class="psr-f"><label>Svoris / dydis</label><select id="psr-f-svoris"><option value="">— bet koks —</option>';
		foreach ( $svoriai as $s ) { echo '<option value="' . esc_attr( $s ) . '">' . esc_html( $s ) . '</option>'; }
		echo '</select></span>';

		echo '<span class="psr-f"><label>Sandėlis</label><span id="psr-f-sand">';
		foreach ( array( '' => 'Visi', 'av' => 'AV', 'vf' => 'VF', 'zb' => 'ZB' ) as $k => $v ) {
			echo '<button type="button" class="button psr-wh' . ( $k === '' ? ' button-primary' : '' ) . '" data-wh="' . esc_attr( $k ) . '">' . esc_html( $v ) . '</button>';
		}
		echo '</span></span>';

		echo '<span class="psr-f"><label>Savikaina</label><select id="psr-f-savik">'
			. '<option value="">— bet kokia —</option><option value="a">iki 2 €</option><option value="b">2–5 €</option>'
			. '<option value="c">5–15 €</option><option value="d">virš 15 €</option><option value="x">be savikainos</option></select></span>';

		echo '<span class="psr-f psr-f-plati"><label>Paieška</label>'
			. '<input type="text" id="psr-q" placeholder="pavadinimas arba SKU…" autocomplete="off">'
			. '<button type="button" class="button" id="psr-browse">Rodyti visus tinkamus</button>'
			. '<a href="#" id="psr-isvalyti" class="psr-mut">išvalyti</a></span>';
		echo '</div>';
		echo '<div id="psr-rez" class="psr-rez"><div class="psr-tuscia">Įrašyk bent 2 simbolius arba spausk „Rodyti visus tinkamus".</div></div>';
		echo '</div>';

		/* ---- sudetis ---- */
		echo '<div class="psr-kort"><h3>3. Rinkinio sudėtis<span class="psr-sp"></span><span class="description" id="psr-sud-info"></span></h3>';
		echo '<div id="psr-tipas"></div>';
		echo '<div id="psr-sudetis"></div></div>';

		echo '</div>'; /* /kaire */

		/* ---------- DESINE ---------- */
		echo '<div class="psr-desine">';

		echo '<div class="psr-kort psr-lipni"><h3>4. Kainodara</h3><div class="psr-vidus" id="psr-kainodara"></div></div>';

		echo '<div class="psr-kort"><h3>5. Kaip matys klientas</h3><div class="psr-vidus" id="psr-perziura"></div></div>';

		echo '</div></div>'; /* /desine /forma */

		/* ---------- APATINE JUOSTA ---------- */
		echo '<div class="psr-juosta">';
		echo '<button type="button" class="button button-primary button-large" id="psr-issaugoti" disabled>' . ( $id ? '💾 Išsaugoti pakeitimus' : 'Sukurti rinkinį' ) . '</button>';
		echo '<a href="' . esc_url( $grizti ) . '" class="button">Atšaukti</a>';
		echo '<label class="psr-varnele"><input type="checkbox" id="psr-publikuoti"' . checked( $d['publikuoti'], 1, false ) . '> <b>Publikuoti</b> <i>be varnelės rinkinys lieka juodraščiu ir parduotuvėje nematomas</i></label>';
		if ( $id ) {
			echo '<a href="' . esc_url( get_preview_post_link( $id ) ) . '" target="_blank" class="button">Peržiūrėti parduotuvėje</a>';
		}
		echo '<span class="psr-sp"></span><span class="psr-stat" id="psr-stat"></span>';
		if ( $id ) {
			echo '<button type="button" class="button psr-trink" id="psr-trinti-f" data-id="' . (int) $id . '" data-pav="' . esc_attr( $d['pav'] ) . '">Ištrinti</button>';
		}
		echo '</div>';

		self::forma_js( $id, $d, $medis, $kopija );
	}


	/* ==================== FORMOS JS ==================== */

	private static function forma_js( $id, $d, $medis, $kopija ) {
		$nonce  = wp_create_nonce( 'ps_rink' );
		$grizti = admin_url( 'admin.php?page=' . self::SLUG );
		$pradiniai = array();
		foreach ( $d['komp'] as $k ) {
			$pr = wc_get_product( $k['id'] );
			if ( ! $pr ) { continue; }
			$pradiniai[] = self::prekes_eilute( $pr, $k['kiekis'] );
		}
		?>
		<script>
		(function(){
			var N   = '<?php echo esc_js( $nonce ); ?>';
			var ID  = <?php echo (int) $id; ?>;
			var VARDAI = <?php echo wp_json_encode( $medis['vardai'] ); ?>;
			var K   = <?php echo wp_json_encode( $pradiniai ); ?>;   /* sudetis */
			var KAT_RANK = [];                                        /* rankiniu budu pridetos vietos */
			var f = { kat:'', svoris:'', sand:'', savik:'', q:'', browse:false };
			var PRADINE_KAINA = '<?php echo esc_js( str_replace( '.', ',', (string) $d['kaina'] ) ); ?>';
			var laikmatis = null, uzklausa = 0;

			var $ = function(s){ return document.querySelector(s); };
			function eur(n){ return (n===null||n===undefined||isNaN(n))?'—':Number(n).toFixed(2).replace('.',',')+' €'; }
			/* Kaina ivedama lietuviskai: 13,90. type=number tokio formato nepriima,
			   todel laukas paprastas, o cia normalizuojam abu variantus. */
			function skaicius(v){
				if(v===null||v===undefined) return 0;
				var t=String(v).replace(/\s/g,'').replace(',','.').replace(/[^0-9.\-]/g,'');
				var n=parseFloat(t);
				return isNaN(n)?0:n;
			}
			function kainaTekstu(n){ return (Math.round(n*100)/100).toFixed(2).replace('.',','); }
			function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }

			/* ---------- skaiciavimai ---------- */
			function skaiciuoti(){
				var vnt=0, sav=0, suma=0, truksta=0, lubos=null, negalimi=[], sand={};
				K.forEach(function(c){
					vnt += c.kiekis;
					suma += c.kaina * c.kiekis;
					if (c.savikaina===null) truksta++; else sav += c.savikaina*c.kiekis;
					if (c.likutis!==null){ var g=Math.floor(c.likutis/c.kiekis); if(lubos===null||g<lubos) lubos=g; }
					if (!c.yra) negalimi.push(c);
					sand[c.sandelis]=1;
				});
				var kaina = skaicius($('#psr-kaina') ? $('#psr-kaina').value : PRADINE_KAINA);
				var tikslas = parseInt($('#psr-tikslas')?$('#psr-tikslas').value:35)||35;
				var marza = (!truksta && kaina>0) ? kaina-sav : null;
				var proc  = (marza!==null && kaina>0) ? marza/kaina*100 : null;
				var rek   = (!truksta && sav>0 && tikslas<100) ? sav/(1-tikslas/100) : null;
				var maxM  = (!truksta && suma>0) ? (suma-sav)/suma*100 : null;
				var drops = Object.keys(sand).filter(function(s){return s!=='av';});
				return { vnt:vnt, sav:sav, suma:suma, truksta:truksta, kaina:kaina, tikslas:tikslas,
					marza:marza, proc:proc, rek:rek, maxM:maxM, lubos:lubos, negalimi:negalimi,
					mix: drops.length>1, sand:Object.keys(sand) };
			}

			/* ---------- vieta kataloge (atkartoja snippet 569) ---------- */
			function autoVieta(){
				var sk={}, pav=[];
				K.forEach(function(c){
					pav.push(c.pav.toLowerCase());
					(c.kat||[]).forEach(function(id){
						if ([91,679,682,683,684].indexOf(id)>=0) return;
						sk[id]=(sk[id]||0)+1;
					});
				});
				var best=null,bn=0;
				Object.keys(sk).forEach(function(id){ if(sk[id]>bn){bn=sk[id];best=parseInt(id);} });
				var res={tipas:best,porusis:null,nezinomas:false};
				if(best!==null){
					var nm=(VARDAI[best]||'').toLowerCase();
					if(nm.indexOf('konserv')>=0) res.porusis=682;
					else if(best===96) res.porusis=683;
					else if(best===95){
						var j=pav.join(' ');
						var kw=['ausis','ausys','koja','kojos','trachėj','kaul','snukis','kanop','sausgysl','kramtal','ragas','uodeg','sparn'];
						res.porusis = kw.some(function(w){return j.indexOf(w)>=0;}) ? 684 : 683;
					}
					else if(nm.indexOf('skanėst')>=0) res.porusis=683;
					else res.nezinomas=true;
				}
				return res;
			}
			function pieštiVieta(){
				var a=autoVieta(), dp=(tipas()==='dp'), h='<div class="psr-chips">';
				if(a.tipas!==null) h+='<span class="psr-chip auto">'+esc(VARDAI[a.tipas]||'')+'</span>';
				if(!dp && a.porusis) h+='<span class="psr-chip auto">'+esc(VARDAI[a.porusis]||'')+'</span>';
				h+='<span class="psr-chip auto">'+(dp?'DAUGIAU=PIGIAU':'RINKINIAI')+'</span>';
				KAT_RANK.forEach(function(id,i){
					h+='<span class="psr-chip">'+esc(VARDAI[id]||id)+'<button type="button" data-i="'+i+'">✕</button></span>';
				});
				h+='</div>';
				if(!K.length) h+='<p class="description">Pridėk prekių — vieta nustatoma pagal jas.</p>';
				else if(dp) h+='<p class="description">Pakas paveldi bazinės prekės kategorijas ir DAUGIAU=PIGIAU.</p>';
				else if(a.nezinomas||a.porusis===null) h+='<div class="psr-perspejimas y">Porūšio nustatyti nepavyko (mišrus rinkinys) — kataloge atsiras tik po RINKINIAI. Pridėk vietą ranka, jei nori kitur.</div>';
				$('#psr-vieta').innerHTML=h;
				$('#psr-vieta').querySelectorAll('button').forEach(function(b){
					b.onclick=function(){ KAT_RANK.splice(parseInt(this.dataset.i),1); pieštiVieta(); };
				});
			}

			/* ---------- sudetis ---------- */
			function pieštiSudeti(){
				var s=skaiciuoti();
				$('#psr-sud-info').textContent = K.length ? (s.vnt+' vnt. · '+K.length+' pozicijos') : '';
				if(!K.length){
					$('#psr-sudetis').innerHTML='<div class="psr-tuscia">Tuščia. Susirask prekių viršuje ir spausk „Pridėti".</div>';
					return;
				}
				var h='<table class="wp-list-table widefat striped psr-sud"><thead><tr>'
					+'<th style="width:44px"></th><th>Prekė</th><th style="width:76px">Svoris</th>'
					+'<th style="width:72px">Kiekis</th><th style="width:88px" class="r">Savikaina</th>'
					+'<th style="width:88px" class="r">Pard. kaina</th><th style="width:92px" class="r">Eilutė</th>'
					+'<th style="width:34px"></th></tr></thead><tbody>';
				K.forEach(function(c,i){
					h+='<tr'+(c.yra?'':' class="psr-neg"')+'>'
						+'<td>'+(c.foto?'<img src="'+c.foto+'" class="psr-t32">':'')+'</td>'
						+'<td>'+esc(c.pav)+(c.yra?'':' <span class="psr-z r">nėra likučio</span>')
							+'<div class="psr-mut">'+esc(c.sku||'be SKU')+' · '+c.sandelis.toUpperCase()+' · likutis '+(c.likutis===null?'∞':c.likutis)+'</div></td>'
						+'<td class="psr-mut">'+esc(c.svoris||'—')+'</td>'
						+'<td><input type="number" min="1" step="1" value="'+c.kiekis+'" class="psr-kiekis small-text" data-i="'+i+'"></td>'
						+'<td class="r">'+(c.savikaina===null?'<span class="psr-warn">nėra</span>':eur(c.savikaina))+'</td>'
						+'<td class="r">'+eur(c.kaina)+'</td>'
						+'<td class="r">'+(c.savikaina===null?'—':eur(c.savikaina*c.kiekis))+'</td>'
						+'<td><button type="button" class="psr-x" data-i="'+i+'">✕</button></td></tr>';
				});
				h+='</tbody><tfoot><tr><th colspan="4">Iš viso '+s.vnt+' vnt.</th><th colspan="2"></th>'
					+'<th class="r">'+(s.truksta?'<span class="psr-warn">nepilna</span>':eur(s.sav))+'</th><th></th></tr></tfoot></table>';
				$('#psr-sudetis').innerHTML=h;
				$('#psr-sudetis').querySelectorAll('.psr-kiekis').forEach(function(inp){
					inp.onchange=function(){ K[parseInt(this.dataset.i)].kiekis=Math.max(1,parseInt(this.value)||1); atnaujinti(); };
				});
				$('#psr-sudetis').querySelectorAll('.psr-x').forEach(function(b){
					b.onclick=function(){ K.splice(parseInt(this.dataset.i),1); atnaujinti(); };
				});
			}

			/* ---------- tipas: viena preke xN = DP pakas, kelios = MnM rinkinys ---------- */
			function tipas(){
				if(K.length===1 && K[0].kiekis>=2) return 'dp';
				return 'mnm';
			}
			function pieštiTipa(){
				var t=tipas(), h='';
				if(!K.length){
					h='<div class="psr-tipas tuscia">Tipas nustatomas pagal sudėtį: <b>ta pati prekė × N</b> → Daugiau=pigiau pakas, <b>kelios skirtingos</b> → rinkinys.</div>';
				} else if(t==='dp'){
					h='<div class="psr-tipas dp"><b>Daugiau=pigiau pakas</b> — '+esc(K[0].pav.slice(0,40))+' × '+K[0].kiekis+' vnt.'
					 +'<div class="psr-mut">Klientas matys ženklą „×'+K[0].kiekis+' VNT.\u201c, juostą „EKONOMIŠKA PAKUOTĖ\u201c ir vieneto kainą. Nuotrauka — bazinės prekės, kompozicija negeneruojama. Kategorija: DAUGIAU=PIGIAU.</div></div>';
				} else {
					h='<div class="psr-tipas mnm"><b>Rinkinys</b> — '+K.length+' skirtingos prekės'
					 +'<div class="psr-mut">Klientas matys sudėties sąrašą. Nuotrauka sugeneruojama iš komponentų. Kategorija: RINKINIAI + porūšis.</div></div>';
				}
				var el=document.getElementById('psr-tipas'); if(el) el.innerHTML=h;
			}

			/* ---------- kainodara ---------- */
			function pieštiKainodara(){
				var s=skaiciuoti();
				var kaina = $('#psr-kaina') ? $('#psr-kaina').value : PRADINE_KAINA;
				var h='<table class="psr-kn">'
					+'<tr><td>Savikaina</td><td class="r">'+(s.truksta?'<span class="psr-warn">'+s.truksta+' be savikainos</span>':'<b>'+eur(s.sav)+'</b>')+'</td></tr>'
					+'<tr><td>Prekės atskirai</td><td class="r">'+eur(s.suma)+'</td></tr>'
					+'<tr><td>Norima marža</td><td class="r"><input type="number" id="psr-tikslas" min="0" max="95" value="'+s.tikslas+'" class="small-text"> %</td></tr>'
					+'<tr class="psr-rek"><td><b>Rekomenduojama kaina</b><div class="psr-mut">pagal savikainą ir norimą maržą</div></td>'
					+'<td class="r">'+(s.rek!==null?'<b>'+eur(s.rek)+'</b><div><a href="#" id="psr-naudoti">naudoti</a></div>':'<span class="psr-mut">—</span>')+'</td></tr>'
					+'</table>';
				if(s.rek!==null && s.suma>0 && s.rek>s.suma){
					h+='<div class="psr-perspejimas y">Su '+s.tikslas+' % marža kaina išeitų brangesnė nei prekės atskirai. Didžiausia marža nekeliant kainos virš '+eur(s.suma)+' — <b>'+Math.round(s.maxM)+' %</b>. <a href="#" id="psr-lubos">taikyti</a></div>';
				}
				h+='<div class="psr-kaina-blk"><label>Rinkinio kaina (€) *</label>'
					+'<input type="text" inputmode="decimal" id="psr-kaina" value="'+esc(kaina)+'" placeholder="0,00" autocomplete="off"></div>';
				h+='<table class="psr-kn">'
					+'<tr><td>Marža</td><td class="r">'+(s.marza!==null
						?(s.marza<0?'<b class="psr-bad">'+eur(s.marza)+' ('+Math.round(s.proc)+'%) ❌</b>'
						            :'<b class="psr-ok">'+eur(s.marza)+' ('+Math.round(s.proc)+'%) ✅</b>')
						:'<span class="psr-mut">—</span>')+'</td></tr>'
					+'<tr><td>Klientas sutaupo</td><td class="r">'+((s.kaina>0&&s.suma>0)
						?(s.suma>s.kaina?'<span class="psr-ok">'+eur(s.suma-s.kaina)+' ('+Math.round((s.suma-s.kaina)/s.suma*100)+'%)</span>':'<b class="psr-bad">brangiau ❌</b>')
						:'—')+'</td></tr>'
					+'<tr><td>Galima parduoti</td><td class="r">'+(s.lubos!==null?'<b class="'+(s.lubos<5?'psr-bad':'psr-ok')+'">'+s.lubos+' vnt.</b>':'—')+'</td></tr>'
					+'</table>';
				if(s.kaina>0&&s.suma>0&&s.suma<=s.kaina) h+='<div class="psr-perspejimas r">Rinkinys brangesnis nei prekės atskirai ('+eur(s.suma)+'). Klientui tai atrodys kaip apgaulė.</div>';
				if(s.marza!==null&&s.marza<0) h+='<div class="psr-perspejimas r">Marža minusinė — parduodi žemiau savikainos.</div>';
				if(s.negalimi.length) h+='<div class="psr-perspejimas r">'+s.negalimi.length+' prekės be likučio: '+esc(s.negalimi[0].pav.slice(0,34))+(s.negalimi.length>1?'…':'')+'. Rinkinio surinkti negalima.</div>';
				if(s.mix) h+='<div class="psr-perspejimas y">Rinkinyje kelių dropship tiekėjų prekės ('+s.sand.join(', ').toUpperCase()+') — klientui išeis kelios siuntos.</div>';
				var senas=$('#psr-kaina');
				var fokusas = senas && document.activeElement===senas;
				var poz = fokusas ? senas.selectionStart : null;
				$('#psr-kainodara').innerHTML=h;
				if(fokusas){
					var nn=$('#psr-kaina');
					if(nn){ nn.focus(); try{ nn.setSelectionRange(poz,poz); }catch(e){} }
				}

				var kv=$('#psr-kaina');
				kv.oninput=function(){ pieštiKainodara(); pieštiPerziura(); tikrinti(); };
				kv.onblur=function(){
					var n=skaicius(this.value);
					if(n>0){ this.value=kainaTekstu(n); pieštiKainodara(); pieštiPerziura(); tikrinti(); }
				};
				/* Enter neturi siusti formos — tik uzbaigti ivedima. */
				kv.onkeydown=function(e){ if(e.key==='Enter'){ e.preventDefault(); this.blur(); } };
				$('#psr-tikslas').onchange=function(){ pieštiKainodara(); };
				var nd=$('#psr-naudoti');
				if(nd) nd.onclick=function(e){ e.preventDefault(); $('#psr-kaina').value=kainaTekstu(s.rek); pieštiKainodara(); pieštiPerziura(); tikrinti(); };
				var lb=$('#psr-lubos');
				if(lb) lb.onclick=function(e){ e.preventDefault(); $('#psr-tikslas').value=Math.floor(s.maxM); $('#psr-kaina').value=kainaTekstu(s.suma*0.95); pieštiKainodara(); pieštiPerziura(); tikrinti(); };
			}

			/* ---------- perziura (kaip matys klientas) ---------- */
			function pieštiPerziura(){
				var s=skaiciuoti();
				var pav=$('#psr-pav').value||'(rinkinio pavadinimas)';
				if(tipas()==='dp'){ $('#psr-perziura').innerHTML=perziuraDP(s,pav); return; }
				var foto=K.filter(function(c){return c.foto;}).map(function(c){return c.foto;});
				var uniq=[]; foto.forEach(function(f){ if(uniq.indexOf(f)<0) uniq.push(f); });
				var stulp = uniq.length<=1?1:(uniq.length<=2?2:(uniq.length<=6?3:4));
				var h='<div class="psr-perz">';
				if(uniq.length){
					h+='<div class="psr-komp" style="grid-template-columns:repeat('+stulp+',1fr)">';
					uniq.slice(0,12).forEach(function(src){ h+='<div class="psr-kt"><img src="'+src+'"></div>'; });
					h+='</div>';
				} else {
					h+='<div class="psr-komp-tuscia">Pridėk prekių — nuotrauka susidėlios pati</div>';
				}
				h+='<div class="psr-perz-pav">'+esc(pav)+'</div>';
				h+='<div class="psr-perz-kaina">'+(s.kaina>0?eur(s.kaina):'—')
					+(s.suma>s.kaina&&s.kaina>0?' <s>'+eur(s.suma)+'</s>':'')+'</div>';
				if(s.kaina>0&&s.suma>s.kaina) h+='<div class="psr-perz-taupo">Sutaupote '+eur(s.suma-s.kaina)+'</div>';
				if(K.length){
					h+='<div class="psr-perz-sud"><b>Rinkinyje rasite ('+s.vnt+' vnt.):</b><ol>';
					K.forEach(function(c){ h+='<li>'+(c.kiekis>1?c.kiekis+' × ':'')+esc(c.pav)+'</li>'; });
					h+='</ol></div>';
				}
				h+='</div><p class="description">Nuotrauka sugeneruojama automatiškai iš komponentų (GD tinklelis) ir tampa pagrindine.</p>';
				$('#psr-perziura').innerHTML=h;
			}

			function perziuraDP(s,pav){
				var c=K[0], vnt=(s.kaina>0?s.kaina/c.kiekis:0);
				var h='<div class="psr-perz psr-perz-dp">';
				h+='<div class="psr-dp-foto">'+(c.foto?'<img src="'+c.foto+'">':'<div class="psr-komp-tuscia">nėra nuotraukos</div>')
					+'<span class="psr-dp-zenklas">×'+c.kiekis+'<br>VNT.</span></div>';
				h+='<div class="psr-dp-juosta">EKONOMIŠKA PAKUOTĖ · '+c.kiekis+' × '+esc(c.svoris||'1 vnt.')+'</div>';
				h+='<div class="psr-perz-pav">'+esc(pav)+'</div>';
				h+='<div class="psr-perz-kaina">'+eur(s.kaina)+'</div>';
				h+='<table class="psr-kn" style="margin-top:8px">'
					+'<tr><td>Pakuotėje</td><td class="r"><b>'+c.kiekis+' vnt.</b></td></tr>'
					+'<tr><td>Vieneto kaina</td><td class="r"><b>'+eur(vnt)+'</b></td></tr>'
					+'<tr><td>Įprastai po vieną</td><td class="r psr-mut">'+eur(c.kaina)+'/vnt.</td></tr>'
					+(s.suma>s.kaina&&s.kaina>0?'<tr><td>Sutaupote</td><td class="r"><b class="psr-ok">'+eur(s.suma-s.kaina)+' ('+Math.round((s.suma-s.kaina)/s.suma*100)+'%)</b></td></tr>':'')
					+'</table></div>'
					+'<p class="description">Šią išvaizdą sukuria jau veikiantys vitrinos moduliai (#568, #570, #573) — pakanka teisingo tipo.</p>';
				return h;
			}
			function atnaujinti(){ pieštiSudeti(); pieštiTipa(); pieštiKainodara(); pieštiVieta(); pieštiPerziura(); tikrinti(); }

			/* ---------- validacija ---------- */
			function tikrinti(){
				var s=skaiciuoti();
				var truk=[];
				if(!$('#psr-pav').value.trim()) truk.push('pavadinimo');
				if(!$('#psr-sku').value.trim()) truk.push('SKU');
				if(!(s.kaina>0)) truk.push('kainos');
				if(!K.length) truk.push('prekių');
				var ok = truk.length===0;
				$('#psr-issaugoti').disabled = !ok;
				$('#psr-stat').innerHTML = ok
					? '<span class="psr-ok">✓ '+s.vnt+' vnt. · '+eur(s.kaina)+(s.marza!==null?' · marža '+eur(s.marza)+' ('+Math.round(s.proc)+'%)':'')+'</span>'
					: '<span class="psr-mut">Trūksta: '+truk.join(', ')+'</span>';
			}

			/* ---------- paieska ---------- */
			function ieskoti(){
				if(!f.browse && f.q.trim().length<2){
					$('#psr-rez').innerHTML='<div class="psr-tuscia">Įrašyk bent 2 simbolius arba spausk „Rodyti visus tinkamus".</div>';
					return;
				}
				var mano=++uzklausa;
				$('#psr-rez').innerHTML='<div class="psr-tuscia">Ieškoma…</div>';
				var u=new URLSearchParams({action:'ps_rink_paieska',nonce:N,q:f.q,kat:f.kat,svoris:f.svoris,
					sand:f.sand,savik:f.savik,browse:f.browse?'1':'0'});
				fetch(ajaxurl+'?'+u.toString()).then(function(r){return r.json()}).then(function(j){
					if(mano!==uzklausa) return;
					if(!j.success){ $('#psr-rez').innerHTML='<div class="psr-tuscia">Klaida: '+(j.data||'')+'</div>'; return; }
					pieštiRez(j.data.prekes, j.data.viso);
				});
			}
			function pieštiRez(sar, viso){
				var esami={}; K.forEach(function(c){esami[c.id]=1;});
				sar=sar.filter(function(p){return !esami[p.id];});
				if(!sar.length){ $('#psr-rez').innerHTML='<div class="psr-tuscia">Nerasta. Atlaisvink filtrus.</div>'; return; }
				var h='<div class="psr-rez-juosta"><label><input type="checkbox" id="psr-visi"> Pažymėti visus</label>'
					+'<button type="button" class="button button-primary" id="psr-prideti-pazymetus">➕ Pridėti pažymėtus</button>'
					+'<span class="psr-mut">'+viso+' rezultatai'+(viso>sar.length?' · rodoma '+sar.length:'')+'</span></div>';
				h+='<table class="wp-list-table widefat striped psr-rez-t"><thead><tr>'
					+'<th style="width:26px"></th><th style="width:44px"></th><th>Prekė</th><th style="width:76px">Svoris</th>'
					+'<th style="width:84px" class="r">Savikaina</th><th style="width:84px" class="r">Pard. kaina</th>'
					+'<th style="width:96px" class="r">Marža</th><th style="width:62px" class="r">Likutis</th>'
					+'<th style="width:80px"></th></tr></thead><tbody>';
				sar.forEach(function(p){
					var m=(p.savikaina!==null&&p.kaina>0)?(p.kaina-p.savikaina):null;
					var mp=(m!==null&&p.kaina>0)?Math.round(m/p.kaina*100):null;
					h+='<tr><td><input type="checkbox" class="psr-chk" value="'+p.id+'"></td>'
						+'<td>'+(p.foto?'<img src="'+p.foto+'" class="psr-t32">':'')+'</td>'
						+'<td>'+esc(p.pav)+'<div class="psr-mut">'+esc(p.sku||'be SKU')+' · '+p.sandelis.toUpperCase()+'</div></td>'
						+'<td class="psr-mut">'+esc(p.svoris||'—')+'</td>'
						+'<td class="r">'+(p.savikaina===null?'<span class="psr-warn">nėra</span>':eur(p.savikaina))+'</td>'
						+'<td class="r">'+eur(p.kaina)+'</td>'
						+'<td class="r">'+(m!==null?'<span class="'+(m<0?'psr-bad':'psr-ok')+'">'+eur(m)+' ('+mp+'%)</span>':'<span class="psr-mut">—</span>')+'</td>'
						+'<td class="r '+(p.yra?'':'psr-bad')+'">'+(p.likutis===null?'∞':p.likutis)+'</td>'
						+'<td><button type="button" class="button psr-prideti" data-p=\''+JSON.stringify(p).replace(/'/g,'&#39;')+'\'>+ Pridėti</button></td></tr>';
				});
				h+='</tbody></table>';
				$('#psr-rez').innerHTML=h;
				$('#psr-visi').onchange=function(){ var c=this.checked; $('#psr-rez').querySelectorAll('.psr-chk').forEach(function(x){x.checked=c;}); };
				$('#psr-rez').querySelectorAll('.psr-prideti').forEach(function(b){
					b.onclick=function(){ prideti(JSON.parse(this.dataset.p)); };
				});
				$('#psr-prideti-pazymetus').onclick=function(){
					var pridėta=0;
					$('#psr-rez').querySelectorAll('.psr-chk:checked').forEach(function(c){
						var b=c.closest('tr').querySelector('.psr-prideti');
						if(b){ prideti(JSON.parse(b.dataset.p), true); pridėta++; }
					});
					if(pridėta) atnaujinti();
				};
			}
			function prideti(p, tyliai){
				if(K.some(function(c){return c.id===p.id;})) return;
				p.kiekis=1; K.push(p);
				if(!tyliai) atnaujinti();
			}

			/* ---------- filtru ivykiai ---------- */
			$('#psr-f-kat').onchange=function(){ f.kat=this.value; f.browse=true; ieskoti(); };
			$('#psr-f-svoris').onchange=function(){ f.svoris=this.value; f.browse=true; ieskoti(); };
			$('#psr-f-savik').onchange=function(){ f.savik=this.value; f.browse=true; ieskoti(); };
			document.querySelectorAll('.psr-wh').forEach(function(b){
				b.onclick=function(){
					f.sand=this.dataset.wh||''; f.browse=true;
					document.querySelectorAll('.psr-wh').forEach(function(x){x.classList.remove('button-primary');});
					this.classList.add('button-primary');
					ieskoti();
				};
			});
			$('#psr-q').oninput=function(){
				f.q=this.value; f.browse=false;
				clearTimeout(laikmatis); laikmatis=setTimeout(ieskoti,300);
			};
			$('#psr-browse').onclick=function(){ f.browse=true; ieskoti(); };
			$('#psr-isvalyti').onclick=function(e){
				e.preventDefault();
				f={kat:'',svoris:'',sand:'',savik:'',q:'',browse:false};
				$('#psr-f-kat').value=''; $('#psr-f-svoris').value=''; $('#psr-f-savik').value=''; $('#psr-q').value='';
				document.querySelectorAll('.psr-wh').forEach(function(x,i){ x.classList.toggle('button-primary', i===0); });
				ieskoti();
			};
			$('#psr-kat-rank').onchange=function(){
				var v=parseInt(this.value); this.value='';
				if(v && KAT_RANK.indexOf(v)<0){ KAT_RANK.push(v); pieštiVieta(); }
			};
			$('#psr-pav').oninput=function(){ tikrinti(); pieštiPerziura(); };
			$('#psr-sku').oninput=function(){ tikrinti(); };

			/* ---------- issaugojimas ---------- */
			$('#psr-issaugoti').onclick=function(){
				var s=skaiciuoti();
				var btn=this; btn.disabled=true;
				$('#psr-stat').innerHTML='<span class="psr-mut">Saugoma…</span>';
				var fd=new FormData();
				fd.append('action','ps_rink_issaugoti');
				fd.append('nonce',N);
				fd.append('id',ID);
				fd.append('duomenys',JSON.stringify({
					pav:$('#psr-pav').value.trim(),
					sku:$('#psr-sku').value.trim(),
					kaina:s.kaina,
					aprasymas:$('#psr-apr').value,
					publikuoti:$('#psr-publikuoti').checked?1:0,
					tipas:tipas(),
					kat:KAT_RANK,
					komponentai:K.map(function(c){return {id:c.id,kiekis:c.kiekis};})
				}));
				fetch(ajaxurl,{method:'POST',body:fd}).then(function(r){return r.json()}).then(function(j){
					btn.disabled=false;
					if(!j.success){ $('#psr-stat').innerHTML='<span class="psr-bad">Klaida: '+(j.data||'nežinoma')+'</span>'; return; }
					$('#psr-stat').innerHTML='<span class="psr-ok">✓ Išsaugota</span>';
					location.href='<?php echo esc_js( $grizti ); ?>&irasyta='+j.data.id;
				}).catch(function(e){
					btn.disabled=false;
					$('#psr-stat').innerHTML='<span class="psr-bad">Ryšio klaida</span>';
				});
			};
			var tr=$('#psr-trinti-f');
			if(tr) tr.onclick=function(){
				if(!confirm('Ištrinti rinkinį „'+this.dataset.pav+'"?\n\nPrekė bus perkelta į šiukšlinę (atstatoma).')) return;
				var fd=new FormData(); fd.append('action','ps_rink_trinti'); fd.append('nonce',N); fd.append('id',this.dataset.id);
				fetch(ajaxurl,{method:'POST',body:fd}).then(function(r){return r.json()}).then(function(j){
					if(j.success) location.href='<?php echo esc_js( $grizti ); ?>';
					else alert('Klaida: '+(j.data||''));
				});
			};

			/* ---------- sargas: neirasyti pakeitimai ---------- */
			var pradzia=JSON.stringify(K);
			window.addEventListener('beforeunload',function(e){
				if(JSON.stringify(K)!==pradzia && !$('#psr-issaugoti').disabled){
					e.preventDefault(); e.returnValue='';
				}
			});

			atnaujinti();
			<?php if ( $kopija ) : ?>
			$('#psr-stat').innerHTML='<span class="psr-mut">Kopija — pakeisk pavadinimą ir SKU</span>';
			<?php endif; ?>
		})();
		</script>
		<?php
	}


	/* ==================== AJAX ==================== */

	/** Vienoda prekes eilute — ir paieskoje, ir sudetyje. */
	private static function prekes_eilute( $p, $kiekis = 1 ) {
		$pid = $p->get_id();
		$lik = $p->get_stock_quantity();
		return array(
			'id'        => $pid,
			'pav'       => $p->get_name(),
			'sku'       => (string) $p->get_sku(),
			'kaina'     => (float) $p->get_price(),
			'savikaina' => self::savikaina( $pid ),
			'likutis'   => ( $lik === null || $lik === '' ) ? null : (int) $lik,
			'yra'       => ( $p->get_stock_status() === 'instock' && $p->get_status() === 'publish' ),
			'sandelis'  => self::sandelis( $pid ),
			'svoris'    => self::svoris( $pid ),
			'foto'      => wp_get_attachment_image_url( $p->get_image_id(), 'thumbnail' ) ?: '',
			'kat'       => array_map( 'intval', wc_get_product_term_ids( $pid, 'product_cat' ) ),
			'kiekis'    => (int) $kiekis,
		);
	}

	private static function svoris( $pid ) {
		$t = wc_get_product_terms( $pid, 'pa_pakuotes_dydis', array( 'fields' => 'names' ) );
		return ( is_wp_error( $t ) || empty( $t ) ) ? '' : $t[0];
	}

	public static function ajax_paieska() {
		check_ajax_referer( 'ps_rink', 'nonce' );
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'Neturite teisių.' ); }

		$q      = sanitize_text_field( $_GET['q'] ?? '' );
		$kat    = (int) ( $_GET['kat'] ?? 0 );
		$svoris = sanitize_text_field( $_GET['svoris'] ?? '' );
		$sand   = sanitize_key( $_GET['sand'] ?? '' );
		$savik  = sanitize_key( $_GET['savik'] ?? '' );
		$browse = ( ( $_GET['browse'] ?? '' ) === '1' );

		if ( ! $browse && mb_strlen( $q ) < 2 ) { wp_send_json_success( array( 'prekes' => array(), 'viso' => 0 ) ); }

		$tax = array( array( 'taxonomy' => 'product_type', 'field' => 'slug', 'terms' => array( 'simple' ) ) );
		if ( $kat ) {
			$medis = self::medis();
			$ids   = isset( $medis['palik'][ $kat ] ) ? $medis['palik'][ $kat ] : array( $kat );
			$tax[] = array( 'taxonomy' => 'product_cat', 'field' => 'term_id', 'terms' => $ids );
		}
		if ( $svoris !== '' ) {
			$tax[] = array( 'taxonomy' => 'pa_pakuotes_dydis', 'field' => 'name', 'terms' => $svoris );
		}
		if ( count( $tax ) > 1 ) { $tax['relation'] = 'AND'; }

		/* Sandelio filtras — tas pats principas kaip 539/550: AV = nei VF, nei ZB. */
		$meta = array();
		if ( $sand === 'vf' ) { $meta[] = array( 'key' => '_vf_enabled', 'value' => 'yes' ); }
		elseif ( $sand === 'zb' ) { $meta[] = array( 'key' => '_zb_enabled', 'value' => 'yes' ); }
		elseif ( $sand === 'av' ) {
			$meta['relation'] = 'AND';
			$meta[] = array( 'relation' => 'OR',
				array( 'key' => '_vf_enabled', 'compare' => 'NOT EXISTS' ),
				array( 'key' => '_vf_enabled', 'value' => 'yes', 'compare' => '!=' ) );
			$meta[] = array( 'relation' => 'OR',
				array( 'key' => '_zb_enabled', 'compare' => 'NOT EXISTS' ),
				array( 'key' => '_zb_enabled', 'value' => 'yes', 'compare' => '!=' ) );
		}

		$args = array(
			'post_type'      => 'product',
			'post_status'    => 'publish',
			'posts_per_page' => 400,
			'orderby'        => 'title',
			'order'          => 'ASC',
			'tax_query'      => $tax,
			'no_found_rows'  => false,
		);
		if ( mb_strlen( $q ) >= 2 ) { $args['s'] = $q; }
		if ( $meta ) { $args['meta_query'] = $meta; }

		$uzk = new WP_Query( $args );
		$prekes = array();

		/* SKU tiksli atitiktis — pirma eilute (kaip 539) */
		if ( mb_strlen( $q ) >= 2 ) {
			$sku_id = wc_get_product_id_by_sku( $q );
			if ( $sku_id ) {
				$sp = wc_get_product( $sku_id );
				if ( $sp && $sp->is_type( 'simple' ) && $sp->get_status() === 'publish' ) {
					$prekes[] = self::prekes_eilute( $sp );
				}
			}
		}
		$matyti = wp_list_pluck( $prekes, 'id' );
		foreach ( $uzk->posts as $post ) {
			if ( count( $prekes ) >= 150 ) { break; }
			if ( in_array( (int) $post->ID, $matyti, true ) ) { continue; }
			$pr = wc_get_product( $post->ID );
			if ( ! $pr ) { continue; }

			if ( $savik !== '' ) {
				$c = self::savikaina( $post->ID );
				if ( $savik === 'x' && $c !== null ) { continue; }
				if ( $savik !== 'x' ) {
					if ( $c === null ) { continue; }
					if ( $savik === 'a' && ! ( $c < 2 ) ) { continue; }
					if ( $savik === 'b' && ! ( $c >= 2 && $c < 5 ) ) { continue; }
					if ( $savik === 'c' && ! ( $c >= 5 && $c < 15 ) ) { continue; }
					if ( $savik === 'd' && ! ( $c >= 15 ) ) { continue; }
				}
			}
			$prekes[] = self::prekes_eilute( $pr );
		}
		wp_reset_postdata();

		wp_send_json_success( array( 'prekes' => $prekes, 'viso' => ( $savik !== '' ? count( $prekes ) : (int) $uzk->found_posts ) ) );
	}

	/* ==================== ISSAUGOJIMAS ==================== */

	public static function ajax_issaugoti() {
		check_ajax_referer( 'ps_rink', 'nonce' );
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'Neturite teisių.' ); }

		$id = (int) ( $_POST['id'] ?? 0 );
		$d  = json_decode( wp_unslash( $_POST['duomenys'] ?? '' ), true );
		if ( ! is_array( $d ) ) { wp_send_json_error( 'Neteisingi duomenys.' ); }

		$pav   = sanitize_text_field( $d['pav'] ?? '' );
		$sku   = sanitize_text_field( $d['sku'] ?? '' );
		$kaina = (float) str_replace( ',', '.', (string) ( $d['kaina'] ?? 0 ) );
		$apr   = sanitize_textarea_field( $d['aprasymas'] ?? '' );
		$publ  = ! empty( $d['publikuoti'] );
		$kat   = array_map( 'intval', (array) ( $d['kat'] ?? array() ) );
		$komp  = (array) ( $d['komponentai'] ?? array() );

		$klaidos = array();
		if ( $pav === '' ) { $klaidos[] = 'Trūksta pavadinimo.'; }
		if ( $sku === '' ) { $klaidos[] = 'Trūksta SKU.'; }
		if ( $kaina <= 0 ) { $klaidos[] = 'Kaina turi būti teigiama.'; }
		if ( ! $komp )     { $klaidos[] = 'Pridėkite bent vieną prekę.'; }

		$sku_id = wc_get_product_id_by_sku( $sku );
		if ( $sku_id && $sku_id !== $id ) { $klaidos[] = 'SKU „' . $sku . '" jau naudojamas (prekė #' . $sku_id . ').'; }
		if ( $klaidos ) { wp_send_json_error( implode( ' ', $klaidos ) ); }

		$kiekiai = array(); $viso = 0; $pavadinimai = array();
		foreach ( $komp as $c ) {
			$cid = (int) ( $c['id'] ?? 0 );
			$k   = max( 1, (int) ( $c['kiekis'] ?? 1 ) );
			if ( $cid <= 0 ) { continue; }
			$cp = wc_get_product( $cid );
			if ( ! $cp ) { wp_send_json_error( 'Prekė #' . $cid . ' nerasta.' ); }
			$kiekiai[ $cid ] = $k;
			$viso += $k;
			$pavadinimai[] = ( $k > 1 ? $k . ' × ' : '' ) . $cp->get_name();
		}
		if ( $viso < 1 ) { wp_send_json_error( 'Kiekių suma turi būti bent 1.' ); }

		/* aprasymas — toks pat kaip 539, kad rinkiniai atrodytu vienodai */
		$turinys = '<h3>Rinkinyje rasite (' . $viso . ' vnt.):</h3>' . "\n<ol>\n";
		foreach ( $pavadinimai as $n ) { $turinys .= '  <li>' . esc_html( $n ) . "</li>\n"; }
		$turinys .= "</ol>\n";

		/* TA PATI PREKE x N -> „Daugiau=pigiau" pakas, ne MnM. Priezastis — vitrina:
		   pakas turi savo isvaizda (zenklas xN, ekonomiska pakuote, vieneto kaina),
		   o MnM klientui parodytu pasirinkimo forma, kurios cia nereikia. */
		$tipas = ( ( $d['tipas'] ?? '' ) === 'dp' || ( count( $kiekiai ) === 1 && $viso >= 2 ) ) ? 'dp' : 'mnm';
		if ( $tipas === 'dp' ) {
			return self::issaugoti_dp( $id, $pav, $sku, $kaina, $apr, $publ, $kat, $kiekiai );
		}

		try {
			$naujas = ! $id;
			$prod = $naujas ? new WC_Product_Mix_and_Match() : wc_get_product( $id );
			if ( ! $prod || ! is_a( $prod, 'WC_Product_Mix_and_Match' ) ) {
				wp_send_json_error( 'Rinkinys #' . $id . ' nerastas arba ne Mix&Match tipo.' );
			}
			$sena_busena = $naujas ? '' : $prod->get_status();

			$prod->set_name( $pav );
			$prod->set_sku( $sku );
			$prod->set_status( $publ ? 'publish' : 'draft' );
			$prod->set_catalog_visibility( 'visible' );
			$prod->set_price( $kaina );
			$prod->set_regular_price( $kaina );
			$prod->set_short_description( $apr );
			$prod->set_description( $turinys );
			$prod->set_sold_individually( false );
			$prod->set_min_container_size( $viso );
			$prod->set_max_container_size( $viso );
			$prod->update_meta_data( '_mnm_content_source', 'products' );
			$prod->update_meta_data( '_mnm_per_product_pricing', 'no' );
			$prod->update_meta_data( self::META_KIEKIAI, wp_json_encode( $kiekiai ) );
			if ( $kat ) { $prod->set_category_ids( $kat ); }
			$prod->save();
			$pid = $prod->get_id();
			if ( ! $pid ) { wp_send_json_error( 'Nepavyko išsaugoti prekės.' ); }

			/* komponentu rysiai perrasomi is naujo — jokiu likuciu nuo senos sudeties */
			global $wpdb; $p = $wpdb->prefix;
			$wpdb->delete( $p . 'wc_mnm_child_items', array( 'container_id' => $pid ), array( '%d' ) );
			$eile = 0;
			foreach ( array_keys( $kiekiai ) as $cid ) {
				$eile++;
				$wpdb->insert( $p . 'wc_mnm_child_items',
					array( 'product_id' => $cid, 'container_id' => $pid, 'menu_order' => $eile ),
					array( '%d', '%d', '%d' ) );
			}
			if ( function_exists( 'wc_delete_product_transients' ) ) { wc_delete_product_transients( $pid ); }

			/* kompozicija: naujam visada, esamam — jei pasikeite sudetis */
			$komp_rez = self::kompozicija( $pid, array_keys( $kiekiai ), $naujas );

			/* zurnalas */
			if ( class_exists( 'Petshop_Ivykiai' ) && method_exists( 'Petshop_Ivykiai', 'irasyti' ) ) {
				Petshop_Ivykiai::irasyti( $pid, $naujas ? 'rinkinys_sukurtas' : 'rinkinys_pakeistas', array(
					'saltinis' => 'Rinkinių langas',
					'reiksme'  => $viso . ' vnt. · ' . number_format( $kaina, 2, '.', '' ) . ' €',
				) );
			}

			wp_send_json_success( array(
				'id'      => $pid,
				'busena'  => $publ ? 'publish' : 'draft',
				'nuoroda' => $publ ? get_permalink( $pid ) : get_preview_post_link( $pid ),
				'kompozicija' => $komp_rez,
			) );

		} catch ( Exception $e ) {
			wp_send_json_error( 'Klaida: ' . $e->getMessage() );
		}
	}

	/**
	 * „Daugiau=pigiau" pakas: `simple` preke be savo likucio. Likutis skaiciuojamas
	 * ir nurasomas is bazines prekes (snippet 567), todel `manage_stock=no`.
	 * Nuotrauka — bazines prekes; kompozicija cia netinka (ta pati preke kartojasi).
	 */
	private static function issaugoti_dp( $id, $pav, $sku, $kaina, $apr, $publ, $kat, $kiekiai ) {
		$bid  = (int) array_key_first( $kiekiai );
		$qty  = (int) reset( $kiekiai );
		$baze = wc_get_product( $bid );
		if ( ! $baze ) { wp_send_json_error( 'Bazinė prekė #' . $bid . ' nerasta.' ); }
		if ( $qty < 2 ) { wp_send_json_error( 'Pakui reikia bent 2 vnt.' ); }

		$naujas = ! $id;
		if ( ! $naujas ) {
			$esamas = get_post( $id );
			if ( $esamas && ! get_post_meta( $id, '_dp_base_product_id', true ) ) {
				/* buvo MnM, tampa paku — senus komponentu rysius pasaliname */
				global $wpdb;
				$wpdb->delete( $wpdb->prefix . 'wc_mnm_child_items', array( 'container_id' => $id ), array( '%d' ) );
				wp_set_object_terms( $id, 'simple', 'product_type' );
			}
		}

		try {
			$prod = $naujas ? new WC_Product_Simple() : wc_get_product( $id );
			if ( ! $prod ) { wp_send_json_error( 'Prekė #' . $id . ' nerasta.' ); }
			if ( ! $naujas && ! $prod->is_type( 'simple' ) ) {
				wp_set_object_terms( $id, 'simple', 'product_type' );
				$prod = new WC_Product_Simple( $id );
			}

			$prod->set_name( $pav );
			$prod->set_sku( $sku );
			$prod->set_status( $publ ? 'publish' : 'draft' );
			$prod->set_catalog_visibility( 'visible' );
			$prod->set_price( $kaina );
			$prod->set_regular_price( $kaina );
			$prod->set_short_description( $apr );
			$prod->set_description( $baze->get_description() );
			$prod->set_manage_stock( false );          /* likutis — is bazines prekes */
			$prod->set_stock_status( 'instock' );      /* tikra busena skaiciuoja snippet 567 */
			$prod->update_meta_data( '_dp_base_product_id', $bid );
			$prod->update_meta_data( '_dp_pack_qty', $qty );

			/* kategorijos: bazines prekes + DAUGIAU=PIGIAU (91) */
			$kategorijos = wc_get_product_term_ids( $bid, 'product_cat' );
			$kategorijos[] = 91;
			if ( $kat ) { $kategorijos = array_merge( $kategorijos, $kat ); }
			$prod->set_category_ids( array_values( array_unique( array_map( 'intval', $kategorijos ) ) ) );

			$prod->save();
			$pid = $prod->get_id();
			if ( ! $pid ) { wp_send_json_error( 'Nepavyko išsaugoti pako.' ); }

			/* nuotrauka: bazines prekes, kompozicija negeneruojama */
			$img = $baze->get_image_id();
			if ( $img ) { set_post_thumbnail( $pid, $img ); }

			if ( function_exists( 'wc_delete_product_transients' ) ) { wc_delete_product_transients( $pid ); }
			if ( class_exists( 'Petshop_Ivykiai' ) && method_exists( 'Petshop_Ivykiai', 'irasyti' ) ) {
				Petshop_Ivykiai::irasyti( $pid, $naujas ? 'dp_pakas_sukurtas' : 'dp_pakas_pakeistas', array(
					'saltinis' => 'Rinkinių langas',
					'reiksme'  => $qty . ' × #' . $bid . ' · ' . number_format( $kaina, 2, '.', '' ) . ' €',
				) );
			}

			wp_send_json_success( array(
				'id' => $pid, 'tipas' => 'dp', 'busena' => $publ ? 'publish' : 'draft',
				'nuoroda' => $publ ? get_permalink( $pid ) : get_preview_post_link( $pid ),
			) );
		} catch ( Exception $e ) {
			wp_send_json_error( 'Klaida: ' . $e->getMessage() );
		}
	}

	public static function ajax_trinti() {
		check_ajax_referer( 'ps_rink', 'nonce' );
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'Neturite teisių.' ); }
		$id = (int) ( $_POST['id'] ?? 0 );
		if ( ! $id ) { wp_send_json_error( 'Nenurodytas rinkinys.' ); }
		$prod = wc_get_product( $id );
		if ( ! $prod ) { wp_send_json_error( 'Rinkinys nerastas.' ); }

		/* uzsakymu patikra — netrinam to, kas dalyvauja neivykdytuose */
		$blogi = self::uzsakymuose( $id );
		if ( $blogi ) {
			wp_send_json_error( 'Rinkinys dalyvauja neįvykdytuose užsakymuose (' . implode( ', ', $blogi ) . '). Pirma juos užbaikite.' );
		}

		global $wpdb; $p = $wpdb->prefix;
		$wpdb->delete( $p . 'wc_mnm_child_items', array( 'container_id' => $id ), array( '%d' ) );
		wp_trash_post( $id );

		if ( class_exists( 'Petshop_Ivykiai' ) && method_exists( 'Petshop_Ivykiai', 'irasyti' ) ) {
			Petshop_Ivykiai::irasyti( $id, 'rinkinys_istrintas', array( 'saltinis' => 'Rinkinių langas' ) );
		}
		delete_transient( 'ps_rink_medis' );
		wp_send_json_success( array( 'id' => $id ) );
	}

	/** Ar rinkinys yra neivykdytuose uzsakymuose. HPOS ir senas budas. */
	private static function uzsakymuose( $pid ) {
		$out = array();
		$statusai = array( 'wc-pending', 'wc-processing', 'wc-on-hold' );
		$uzs = wc_get_orders( array( 'limit' => 20, 'status' => $statusai, 'return' => 'ids' ) );
		foreach ( (array) $uzs as $oid ) {
			$o = wc_get_order( $oid );
			if ( ! $o ) { continue; }
			foreach ( $o->get_items() as $it ) {
				if ( (int) $it->get_product_id() === (int) $pid ) { $out[] = '#' . $oid; break; }
			}
			if ( count( $out ) >= 5 ) { break; }
		}
		return $out;
	}


	/* ==================== KOMPOZICIJA ==================== */

	/**
	 * Kompozicijos nuotrauka. Jei snippet 539 funkcija gyva — naudojam ja
	 * (kad rinkiniai atrodytu vienodai, nesvarbu kur sukurti). Jei ne — savo
	 * kopija su tuo paciu tinkleliu.
	 */
	private static function kompozicija( $pid, $komponentai, $priverstinai = false ) {
		if ( ! $priverstinai && get_post_thumbnail_id( $pid ) ) {
			$sena = (string) get_post_meta( $pid, '_ps_rink_komp_hash', true );
			$nauja = md5( implode( ',', $komponentai ) );
			if ( $sena === $nauja ) { return array( 'praleista' => true ); }
		}
		update_post_meta( $pid, '_ps_rink_komp_hash', md5( implode( ',', $komponentai ) ) );

		if ( function_exists( 'petshop_generate_composition' ) ) {
			$args = array();
			foreach ( $komponentai as $cid ) { $args[] = array( 'id' => $cid ); }
			return petshop_generate_composition( $pid, $args );
		}
		return self::kompozicija_vidine( $pid, $komponentai );
	}

	private static function kompozicija_vidine( $pid, $komponentai ) {
		if ( ! function_exists( 'imagecreatetruecolor' ) ) { return array( 'error' => 'GD neprieinamas' ); }
		$plytele = 380; $tarpas = 30; $krastas = 30;

		$keliai = array(); $matyti = array();
		foreach ( $komponentai as $cid ) {
			if ( isset( $matyti[ $cid ] ) ) { continue; }
			$matyti[ $cid ] = true;
			$cp = wc_get_product( $cid );
			if ( ! $cp ) { continue; }
			$img = $cp->get_image_id();
			if ( ! $img ) { continue; }
			$f = get_attached_file( $img );
			if ( $f && file_exists( $f ) ) { $keliai[] = $f; }
		}
		$n = count( $keliai );
		if ( $n < 1 ) { return array( 'error' => 'Nėra nuotraukų' ); }

		$isdest = array( 1=>array(1,1,0), 2=>array(2,1,0), 3=>array(3,1,0), 4=>array(2,2,0),
			5=>array(3,2,2), 6=>array(3,2,0), 7=>array(4,2,3), 8=>array(4,2,0),
			9=>array(3,3,0), 10=>array(4,3,2), 11=>array(4,3,3), 12=>array(4,3,0) );
		$L = isset( $isdest[ $n ] ) ? $isdest[ $n ]
			: array( (int) ceil( sqrt( $n ) ), (int) ceil( $n / ceil( sqrt( $n ) ) ), 0 );
		list( $stulp, $eil, $paskutine ) = $L;

		$pl = $stulp * $plytele + ( $stulp - 1 ) * $tarpas + $krastas * 2;
		$au = $eil   * $plytele + ( $eil   - 1 ) * $tarpas + $krastas * 2;
		$drobe = imagecreatetruecolor( $pl, $au );
		imagefilledrectangle( $drobe, 0, 0, $pl - 1, $au - 1, imagecolorallocate( $drobe, 248, 248, 248 ) );
		$baltas = imagecolorallocate( $drobe, 255, 255, 255 );

		foreach ( $keliai as $i => $kelias ) {
			$r = (int) ( $i / $stulp ); $s = $i % $stulp;
			if ( $paskutine > 0 && $r === $eil - 1 ) {
				$plotis = $paskutine * $plytele + ( $paskutine - 1 ) * $tarpas;
				$x = (int) ( ( $pl - $plotis ) / 2 ) + $s * ( $plytele + $tarpas );
			} else {
				$x = $krastas + $s * ( $plytele + $tarpas );
			}
			$y = $krastas + $r * ( $plytele + $tarpas );
			imagefilledrectangle( $drobe, $x, $y, $x + $plytele - 1, $y + $plytele - 1, $baltas );

			$info = @getimagesize( $kelias );
			if ( ! $info ) { continue; }
			$src = null;
			if ( $info['mime'] === 'image/jpeg' ) { $src = @imagecreatefromjpeg( $kelias ); }
			elseif ( $info['mime'] === 'image/png' ) { $src = @imagecreatefrompng( $kelias ); }
			elseif ( $info['mime'] === 'image/webp' && function_exists( 'imagecreatefromwebp' ) ) { $src = @imagecreatefromwebp( $kelias ); }
			if ( ! $src ) { continue; }
			$sw = imagesx( $src ); $sh = imagesy( $src );
			$k = min( $plytele / $sw, $plytele / $sh );
			$nw = (int) ( $sw * $k ); $nh = (int) ( $sh * $k );
			imagecopyresampled( $drobe, $src,
				$x + (int) ( ( $plytele - $nw ) / 2 ), $y + (int) ( ( $plytele - $nh ) / 2 ),
				0, 0, $nw, $nh, $sw, $sh );
			imagedestroy( $src );
		}

		$up = wp_upload_dir();
		$vardas = 'rink-kompozicija-' . $pid . '-' . time() . '.jpg';
		$kelias = trailingslashit( $up['path'] ) . $vardas;
		imagejpeg( $drobe, $kelias, 88 );
		imagedestroy( $drobe );
		if ( ! file_exists( $kelias ) ) { return array( 'error' => 'Nepavyko išsaugoti' ); }

		$tipas = wp_check_filetype( $vardas, null );
		$att = wp_insert_attachment( array(
			'guid'           => trailingslashit( $up['url'] ) . $vardas,
			'post_mime_type' => $tipas['type'],
			'post_title'     => sanitize_file_name( pathinfo( $vardas, PATHINFO_FILENAME ) ),
			'post_status'    => 'inherit',
		), $kelias, $pid );
		if ( is_wp_error( $att ) ) { return array( 'error' => $att->get_error_message() ); }

		require_once ABSPATH . 'wp-admin/includes/image.php';
		wp_update_attachment_metadata( $att, wp_generate_attachment_metadata( $att, $kelias ) );
		set_post_thumbnail( $pid, $att );
		return array( 'media_id' => $att, 'url' => wp_get_attachment_url( $att ) );
	}

	/* ==================== STILIUS ==================== */

	private static function stilius() {
		?>
		<style>
		/* Virsutine juosta — tie patys stiliai kaip kataloge, kad langai atrodytu
		   kaip viena sistema, o ne penki skirtingi irankiai. */
		#wpcontent{padding-left:0}
		.pskat-bar{display:flex;align-items:center;gap:18px;background:#1d2422;color:#e8ebe6;padding:10px 18px;position:sticky;top:32px;z-index:60}
		.pskat-logo{font-weight:700;letter-spacing:.06em;font-size:13px}
		.pskat-nav a{color:#a9b3ad;text-decoration:none;margin-right:16px;font-size:13px}
		.pskat-nav a.on,.pskat-nav a:hover{color:#fff}
		.pskat-search{flex:1;position:relative;display:flex;align-items:center}
		.pskat-search .lupa{position:absolute;left:12px;font-size:14px;opacity:.55;pointer-events:none}
		.pskat-search input{width:100%;max-width:560px;padding:9px 12px 9px 34px;border:1px solid #fff;border-radius:8px;background:#fff;color:#1a201e;font-size:14px}
		.pskat-meta{font-size:12px;color:#a9b3ad;white-space:nowrap}
		.psrink{margin:0 20px 60px}
		.psrink .r{text-align:right}
		.psrink .psr-mut{color:#646970;font-size:11.5px}
		.psrink .psr-ok{color:#007017}
		.psrink .psr-bad{color:#b32d2e}
		.psrink .psr-warn{color:#996800}
		.psrink .psr-sp{flex:1}
		.psrink .psr-t32{width:32px;height:32px;object-fit:contain;background:#fff;border:1px solid #eee;border-radius:2px;display:block}
		.psrink .psr-tuscia{padding:22px;text-align:center;color:#787c82}

		.psr-eiles{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}
		.psr-eile{display:block;background:#fff;border:1px solid #c3c4c7;border-left:3px solid #c3c4c7;border-radius:3px;padding:7px 12px;text-decoration:none;color:inherit;min-width:120px}
		.psr-eile:hover{box-shadow:0 1px 4px rgba(0,0,0,.08);color:inherit}
		.psr-eile b{display:block;font-size:19px;line-height:1.2}
		.psr-eile span{font-size:11.5px;color:#646970}
		.psr-eile.on{border-color:#2271b1;border-left-color:#2271b1;background:#f0f6fc}
		.psr-eile.y{border-left-color:#dba617}.psr-eile.y b{color:#996800}
		.psr-eile.r{border-left-color:#d63638}.psr-eile.r b{color:#d63638}
		.psr-eile.g{border-left-color:#00a32a}.psr-eile.g b{color:#007017}
		.psr-eile.b{border-left-color:#72aee6}.psr-eile.b b{color:#0a4b78}

		.psr-z{display:inline-block;font-size:11px;border:1px solid;border-radius:2px;padding:0 6px;white-space:nowrap;margin:0 2px 2px 0}
		.psr-z.g{background:#edfaef;border-color:#b8e6c1;color:#00622a}
		.psr-z.y{background:#fcf9e8;border-color:#e8dfa8;color:#7a5c00}
		.psr-z.r{background:#fcf0f1;border-color:#f0c3c4;color:#8a2424}
		.psr-z.b{background:#f0f6fc;border-color:#c5d9ed;color:#0a4b78}

		.psr-forma{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:16px;align-items:start;margin-top:14px}
		@media(max-width:1400px){.psr-forma{grid-template-columns:1fr}}
		.psr-kort{background:#fff;border:1px solid #c3c4c7;border-radius:3px;margin-bottom:16px;box-shadow:0 1px 1px rgba(0,0,0,.04)}
		.psr-kort>h3{margin:0;padding:10px 14px;font-size:13.5px;border-bottom:1px solid #f0f0f1;background:#f6f7f7;display:flex;align-items:center;gap:8px}
		.psr-vidus{padding:12px 14px}
		.psr-lipni{position:sticky;top:46px}
		.psr-kort .form-table th{width:150px;padding:10px 10px 10px 0}
		.psr-kort .form-table td{padding:8px 0}

		.psr-filtrai{padding:10px 14px;background:#fbfbfc;border-bottom:1px solid #f0f0f1;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center}
		.psr-f{display:flex;align-items:center;gap:6px}
		.psr-f>label{font-size:12px;color:#646970;white-space:nowrap}
		.psr-f-plati{flex:1;min-width:300px}
		.psr-f-plati input{flex:1;min-width:180px}
		.psr-rez{max-height:430px;overflow:auto}
		.psr-rez-juosta{position:sticky;top:0;z-index:2;background:#f6f7f7;border-bottom:1px solid #ddd;padding:6px 12px;display:flex;gap:14px;align-items:center;font-size:12.5px}
		.psr-rez-t{border:0;box-shadow:none}
		.psr-rez-t th{position:sticky;top:31px;background:#fff;z-index:1;font-size:11.5px}
		.psr-sud tr.psr-neg td{background:#fff5f5}
		.psr-x{border:1px solid #dcdcde;background:#fff;color:#b32d2e;border-radius:3px;width:24px;height:24px;line-height:1;cursor:pointer}
		.psr-x:hover{background:#fcf0f1;border-color:#b32d2e}

		.psr-kn{width:100%;border-collapse:collapse;font-size:12.5px}
		.psr-kn td{padding:5px 0;border-bottom:1px solid #f4f4f4}
		.psr-kn tr.psr-rek td{background:#f0f6fc;padding:7px 6px;border-bottom:1px solid #cfe2f3}
		.psr-kaina-blk{margin:12px 0;padding:10px;background:#f6f7f7;border:1px solid #dcdcde;border-radius:3px}
		.psr-kaina-blk label{display:block;font-size:12px;color:#50575e;margin-bottom:4px;font-weight:600}
		.psr-kaina-blk input{width:100%;font-size:20px;padding:6px 8px}
		.psr-perspejimas{border:1px solid;border-left-width:4px;border-radius:2px;padding:8px 10px;font-size:12px;margin:10px 0 0}
		.psr-perspejimas.y{background:#fcf9e8;border-color:#e8dfa8;border-left-color:#dba617}
		.psr-perspejimas.r{background:#fcf0f1;border-color:#f0c3c4;border-left-color:#d63638}

		.psr-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:8px;min-height:24px}
		.psr-chip{background:#f0f6fc;border:1px solid #c5d9ed;color:#0a4b78;border-radius:11px;padding:2px 6px 2px 10px;font-size:12px;display:inline-flex;align-items:center;gap:4px}
		.psr-chip.auto{background:#f6f7f7;border-color:#dcdcde;color:#50575e}
		.psr-chip button{border:0;background:none;color:inherit;cursor:pointer;font-size:12px;padding:0 2px}

		.psr-perz{border:1px solid #e5e5e5;border-radius:3px;padding:10px;background:#fff}
		.psr-komp{display:grid;gap:6px;background:#f8f8f8;padding:6px;border-radius:2px}
		.psr-kt{background:#fff;border-radius:2px;aspect-ratio:1/1;display:grid;place-items:center;padding:4px}
		.psr-kt img{max-width:100%;max-height:100%;object-fit:contain}
		.psr-komp-tuscia{background:#f8f8f8;border:1px dashed #c3c4c7;border-radius:2px;padding:24px 10px;text-align:center;color:#787c82;font-size:12.5px}
		.psr-perz-pav{font-size:15px;font-weight:600;margin:10px 0 4px}
		.psr-perz-kaina{font-size:20px;color:#007017;font-weight:600}
		.psr-perz-kaina s{font-size:14px;color:#787c82;font-weight:400;margin-left:6px}
		.psr-perz-taupo{display:inline-block;background:#edfaef;border:1px solid #b8e6c1;color:#00622a;border-radius:2px;padding:1px 7px;font-size:12px;margin-top:5px}
		.psr-perz-sud{margin-top:10px;font-size:12.5px}
		.psr-perz-sud ol{margin:5px 0 0 18px;padding:0}
		.psr-perz-sud li{margin-bottom:2px}

		.psr-juosta{position:sticky;bottom:0;background:#fff;border-top:1px solid #c3c4c7;padding:10px 16px;display:flex;gap:10px;align-items:center;margin:0 -20px -10px;box-shadow:0 -2px 6px rgba(0,0,0,.05);z-index:20;flex-wrap:wrap}
		.psr-tipas{margin:0;padding:10px 14px;border-bottom:1px solid #f0f0f1;font-size:12.5px}
		.psr-tipas.tuscia{background:#fbfbfc;color:#646970}
		.psr-tipas.dp{background:#f0f6fc;border-left:3px solid #2271b1}
		.psr-tipas.mnm{background:#edfaef;border-left:3px solid #00a32a}
		.psr-perz-dp .psr-dp-foto{position:relative;background:#fff;border:1px solid #eee;border-radius:2px;padding:8px;text-align:center}
		.psr-perz-dp .psr-dp-foto img{max-width:100%;max-height:150px;object-fit:contain}
		.psr-dp-zenklas{position:absolute;top:8px;left:8px;background:#2e5c48;color:#fff;border-radius:50%;width:44px;height:44px;display:grid;place-items:center;font-size:11px;font-weight:700;line-height:1.1}
		.psr-dp-juosta{background:#2e5c48;color:#fff;text-align:center;font-size:11px;font-weight:600;padding:4px;letter-spacing:.3px}
		.psr-z.gr{background:#f6f7f7;border-color:#dcdcde;color:#50575e}
		.psr-varnele{font-size:12.5px;display:flex;align-items:center;gap:5px}
		.psr-varnele i{color:#646970;font-style:normal;font-size:11.5px}
		.psr-trink{color:#b32d2e!important;border-color:#b32d2e!important}
		.psr-stat{font-size:12.5px}
		</style>
		<?php
	}

}

Petshop_Rinkiniai::init();
