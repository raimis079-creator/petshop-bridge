<?php
/**
 * Petshop Desk v3.24 (H219) — teisingas pranešimas po „Pažymėti apmokėtu", kai užsakymas iškrenta į Klausimus (v3.23: Išsiųsti eilė).
 *
 * KODĖL: WooCommerce sąrašas — numatytasis ekranas, į kurį penki pluginai sudėjo
 * mygtukus be užrašų. Raimis: „turi būti malonu į darbalaukį užeiti, o ne į chaosą".
 *
 * STRUKTŪRA (Raimio patvirtinta 2026-08-05, pokalbis dėl v3 maketo):
 *   Nauji · Neapmokėti · Paruošta siųsti · Klausimai · Atšaukti · Visi
 *   „Kelyje" ir „Įvykdyti" NĖRA eilės — ten nėra darbo, jie filtrai „Visuose".
 *   Prekės ir Sandėlis IŠIMTI — bus atskiras „Prekių dirbtuvės" langas.
 *
 * FILTRAI — DVI SKIRTINGOS AŠYS, niekada nemaišomos vienoje eilėje:
 *   Vykdymas    (iš kur prekės)  Sava · Dropship · Mišrūs · pagal tiekėją
 *   Pristatymas (kas veža)       Venipak kurjeris/paštomatas · LP Express
 *   Data        greitieji + intervalas
 *
 * ŠALTINIS gyvena EILUTĖS meta (s510 patvirtinta):
 *   _ps_source · _ps_carrier · _ps_source_qty · _ps_source_at · _ps_source_reason
 *
 * WooCommerce sąrašas NEIŠJUNGIAMAS — lieka atsarginiu keliu.
 * Užsakymo REDAGAVIMAS lieka WooCommerce (retas, sudėtingas darbas).
 *
 * 1 SLUOKSNIS: sąrašas · eilės · filtrai · paieška · skydelis · masiniai veiksmai.
 * 2 sluoksnis (atskirai): rytinė eiga, klausimų sprendimai, atšaukimas su kreditine.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Desk {

	const SLUG = 'ps-desk';

	/** Būsenų spalvos: [fonas, tekstas]. */
	const SPALVOS = array(
		'pending'           => array( '#FBF2DE', '#96660C' ),
		'failed'            => array( '#FAECEC', '#98262A' ),
		'on-hold'           => array( '#FBF2DE', '#96660C' ),
		'processing'        => array( '#E9F1EA', '#2D5F3F' ),
		'lp-parcel-created' => array( '#E9F1F8', '#2B5C8A' ),
		'lp-label-created'  => array( '#E9F1F8', '#2B5C8A' ),
		'lp-courier-await'  => array( '#E9F1F8', '#2B5C8A' ),
		'lp-courier-called' => array( '#E9F1F8', '#2B5C8A' ),
		'lp-parcel-await'   => array( '#FBF2DE', '#96660C' ),
		'lp-parcel-failed'  => array( '#FAECEC', '#98262A' ),
		'lp-on-the-way'     => array( '#F1F1EE', '#6B7269' ),
		'lp-delivered'      => array( '#F1F1EE', '#6B7269' ),
		'completed'         => array( '#F1F1EE', '#6B7269' ),
		'cancelled'         => array( '#FAECEC', '#98262A' ),
		'lp-cancelled'      => array( '#FAECEC', '#98262A' ),
		'refunded'          => array( '#F1ECF9', '#5B3B92' ),
	);

	/** Šaltinių žymės: [spalva, trumpinys, pilnas]. */
	const SALTINIAI = array(
		'av'          => array( '#2D5F3F', 'AV',  'Savas sandėlis' ),
		'vf'          => array( '#2B5C8A', 'VF',  'Vetfarmas' ),
		'zb'          => array( '#5B3B92', 'ZB',  'Žalioji Banga' ),
		'quattro'     => array( '#96660C', 'QUA', 'Kauno grūdai / Quattro' ),
		'prins'       => array( '#96660C', 'PRI', 'Faunas / Prins' ),
		'ambrosia'    => array( '#96660C', 'AMB', 'Ambrosia' ),
		'belcor_tofu' => array( '#96660C', 'BEL', 'Belacor' ),
	);

	/**
	 * Manifesto numeris pagal sandėlį. Venipak manifesto pavadinimas =
	 * kliento ID + data + ŠIS kodas (s544). Vienas manifestas = vienas
	 * kurjerio paėmimas iš vieno adreso, todėl sandėliai NIEKADA nemaišomi.
	 */
	const MANIFESTAI = array(
		'av'          => '001',
		'vf'          => '002',
		'zb'          => '003',
		'quattro'     => '004',
		'prins'       => '005',
		'ambrosia'    => '006',
		'belcor_tofu' => '007',
	);

	/**
	 * Iki kada užsakymas turi būti perduotas sandėliui, kad spėtų
	 * į TOS DIENOS kurjerio paėmimą. AV — kada kurjeris atvažiuoja pas mus.
	 */
	const RIBOS = array(
		'av'          => '11:00',
		'lp'          => '13:00',
		'vf'          => '13:00',
		'zb'          => '09:00',
		'prins'       => '09:00',
		'ambrosia'    => '10:00',
		'belcor_tofu' => '09:00',
		'quattro'     => '09:00',
	);

	/** Eilės: slug => [pavadinimas, paaiškinimas, spalva]. */
	const EILES = array(
		'nauji'      => array( 'Nauji',           'apmokėti, laukia surinkimo ar perdavimo', '#5FA97A' ),
		'neapmoketi' => array( 'Neapmokėti',      'laukia kliento pinigų — tik stebėti',     '#D9A62B' ),
		'paruosta'   => array( 'Paruošta siųsti', 'supakuota su lipduku, laukia kurjerio',   '#5E96C9' ),
		'laukia'     => array( 'Laukia prekių',   'tiekėjo prekės dar neatvyko į AV',        '#8E6FD0' ),
		'klausimai'  => array( 'Klausimai',       'reikia tavo sprendimo',                   '#C4595C' ),
		'issiusti'   => array( 'Išsiųsti',        'kelyje ir įvykdyti užsakymai',            '#9AA39C' ),
		'atsaukti'   => array( 'Atšaukti',        'atšaukti ir grąžinti užsakymai',          '#9AA39C' ),
		'visi'       => array( 'Visi užsakymai',  '',                                        '#9AA39C' ),
	);

	/** Statusai pagal eilę (klausimai skaičiuojami atskirai). */
	const STATUSAI = array(
		'neapmoketi' => array( 'pending', 'failed', 'on-hold', 'lp-parcel-await' ),
		'paruosta'   => array( 'lp-label-created', 'lp-parcel-created', 'lp-courier-await', 'lp-courier-called' ),
		'atsaukti'   => array( 'cancelled', 'lp-cancelled', 'refunded' ),
		'kelyje'     => array( 'lp-on-the-way' ),
		'ivykdyti'   => array( 'completed', 'lp-delivered' ),
	);

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'meniu' ) );
		add_action( 'admin_head', array( __CLASS__, 'slepti_wc' ) );
		add_action( 'admin_head', array( __CLASS__, 'chrome' ) );
		add_action( 'admin_post_ps_desk_veiksmas', array( __CLASS__, 'vykdyti_veiksma' ) );
	}

	/* ======================= VEIKSMŲ SLUOKSNIS =======================
	 * VISI darbalaukio veiksmai eina per vieną vietą: nonce, teisių patikra,
	 * įrašas į užsakymo istoriją, grįžimas atgal. Kai atsiras automatiniai
	 * siūlymai, jie kvies TĄ PATĮ vykdymą — tik su tavo patvirtinimu.
	 * ================================================================ */

	/** Laiškai klientui laikinai išjungiami (dublikatų atšaukimas ir pan.). */
	const LAISKAI = array(
		'customer_processing_order', 'customer_completed_order', 'customer_on_hold_order',
		'customer_invoice', 'customer_refunded_order', 'customer_cancelled_order',
		'cancelled_order', 'customer_partially_refunded_order',
	);

	protected static function laiskai_off() {
		foreach ( self::LAISKAI as $e ) {
			add_filter( 'woocommerce_email_enabled_' . $e, '__return_false', 999 );
		}
	}

	protected static function laiskai_on() {
		foreach ( self::LAISKAI as $e ) {
			remove_filter( 'woocommerce_email_enabled_' . $e, '__return_false', 999 );
		}
	}

	protected static function veiksmo_url( $v, $id ) {
		return wp_nonce_url(
			admin_url( 'admin-post.php?action=ps_desk_veiksmas&v=' . rawurlencode( $v ) . '&id=' . (int) $id
				. '&g=' . rawurlencode( self::url() ) ),
			'ps_desk_' . $v . '_' . (int) $id
		);
	}

	/** Galimi veiksmai užsakymui. Pirmas — pagrindinis (žalias mygtukas). */
	protected static function veiksmai( $o, $row ) {
		$id  = $o->get_id();
		$st  = $o->get_status();
		$out = array();

		$uzdaryti = array( 'cancelled', 'lp-cancelled', 'refunded' );
		$antraste = sprintf( 'Užsakymas #%s · %s',
			$o->get_order_number(), wp_strip_all_tags( $o->get_formatted_order_total() ) );

		if ( ! $o->is_paid() && ! in_array( $st, $uzdaryti, true ) ) {
			$out[] = array(
				'id'  => 'apmoketa',
				't'   => 'Pažymėti apmokėtu',
				'url' => self::veiksmo_url( 'apmoketa', $id ),
				'd'   => array(
					'antraste' => $antraste,
					'tekstas'  => 'Pažymėti kaip apmokėtą? Prekės bus nurašytos iš likučio; užsakymas keliaus į „Nauji“ (arba į „Klausimus“, jei sandėlyje trūksta).',
					'ok'       => 'Pažymėti apmokėtu',
					'opt'      => array(
						'vardas' => 'be_laisko',
						'tekstas'=> 'Nesiųsti laiško klientui',
						'def'    => 0,
					),
				),
			);
		}

		if ( ! empty( $row['klausimas'] ) ) {
			$out[] = array( 'id' => 'sprendimas', 't' => 'Spręsti', 'url' => '', 'k' => '' );
		} elseif ( 'nauji' === $row['eile'] ) {
			$ds = 'DROPSHIP' === self::vykdymas( $o )[0];
			$out[] = $ds
				? array( 'id' => 'perduoti', 't' => 'Perduoti', 'url' => self::veiksmo_url( 'perduoti', $id ), 'd' => null )
				: array( 'id' => 'lapai',    't' => 'Surinkti', 'url' => self::veiksmo_url( 'lapai', $id ),    'd' => null );
			// mišriam reikia abiejų kelių
			if ( 'MIŠRUS' === self::vykdymas( $o )[0] ) {
				$out[] = array( 'id' => 'perduoti', 't' => 'Perduoti tiekėjui', 'url' => self::veiksmo_url( 'perduoti', $id ), 'd' => null );
			}
		} elseif ( 'laukia' === $row['eile'] ) {
			$out[] = array( 'id' => 'tiekimas', 't' => 'Tiekimas',
				'url' => admin_url( 'admin.php?page=ps-tiekimas&b=laukia' ), 'd' => null );
		} elseif ( 'paruosta' === $row['eile'] ) {
			$lp = 'lp' === self::vezejas( $o );
			$out[] = array(
				'id' => 'spausdinti', 't' => 'Spausdinti lipduką', 'url' => '', 'd' => null,
				'wc' => $lp ? 'woo_lp_print_label' : 'shopup_venipak_shipping_labels',
			);
		}

		if ( ! $out ) {
			$out[] = array( 'id' => 'atidaryti', 't' => 'Atidaryti', 'url' => $o->get_edit_order_url(), 'd' => null );
		}

		if ( 'lapai' !== $out[0]['id'] ) {
			$out[] = array( 'id' => 'lapai', 't' => 'Pakavimo lapas', 'url' => self::veiksmo_url( 'lapai', $id ), 'd' => null );
		}

		if ( $o->is_paid() ) {
			$out[] = array( 'id' => 'saskaita', 't' => 'Sąskaita', 'url' => '', 'd' => null, 'wc' => 'wcdn_print_invoice' );
		}

		if ( class_exists( 'Petshop_Siuntos' ) && Petshop_Siuntos::turi( $id ) ) {
			$out[] = array( 'id' => 'sekimo', 't' => 'Sekimo laiškas',
				'url' => admin_url( 'admin.php?page=ps-siuntos-laiskas&id=' . $id ), 'd' => null );
		}

		// Atšaukimas — antrinis veiksmas, tik skydelyje.
		if ( ! in_array( $st, $uzdaryti, true ) ) {
			$out[] = array(
				'id'  => 'atsaukti',
				't'   => 'Atšaukti užsakymą',
				'url' => self::veiksmo_url( 'atsaukti', $id ),
				'pav' => 'pavojus',
				'd'   => array(
					'antraste' => $antraste,
					'tekstas'  => $o->is_paid()
						? 'Atšaukti šį APMOKĖTĄ užsakymą? Prekės grįš į likutį. Pinigai NEGRĄŽINAMI automatiškai — grąžinimą ir kreditinę tvarkysi atskirai.'
						: 'Atšaukti šį užsakymą? Prekės grįš į likutį. Klientui laiškas nesiunčiamas — patogu, kai tas pats žmogus pridarė kelis užsakymus, kol apmokėjo.',
					'ok'       => 'Atšaukti užsakymą',
					'opt'      => array(
						'vardas' => 'su_laisku',
						'tekstas'=> 'Pranešti klientui laišku',
						'def'    => 0,
					),
				),
			);
		}
		return $out;
	}

	/**
	 * Registruoja siuntų GRUPĘ vienu XML → vienas manifestas.
	 * Pluginas manifesto numerį laiko privačioje savybėje ir ima jį iš
	 * nustatymų konstruktoriuje (s545: keitimas per Reflection PAVYKO),
	 * todėl prieš kvietimą jį laikinai pakeičiam, po to grąžinam.
	 */
	protected static function venipak_registruoti( $ids, $manifesto_kodas ) {
		$cls = 'Woocommerce_Shopup_Venipak_Shipping_Admin_Dispatch';
		if ( ! class_exists( $cls ) ) { return array( 'status' => 'error', 'data' => 'Venipak pluginas neįjungtas' ); }

		global $wp_filter;
		$h   = 'handle_bulk_actions-woocommerce_page_wc-orders';
		$obj = null;
		if ( isset( $wp_filter[ $h ] ) ) {
			foreach ( $wp_filter[ $h ]->callbacks as $cbs ) {
				foreach ( $cbs as $cb ) {
					$fn = $cb['function'];
					if ( is_array( $fn ) && is_object( $fn[0] ) && get_class( $fn[0] ) === $cls ) { $obj = $fn[0]; break 2; }
				}
			}
		}
		if ( ! $obj ) { return array( 'status' => 'error', 'data' => 'Venipak tvarkyklė nerasta' ); }

		try {
			$rp = new ReflectionProperty( $cls, 'venipak_manifest' );
			$rp->setAccessible( true );
			$sena = $rp->getValue( $obj );
			$rp->setValue( $obj, $manifesto_kodas );
		} catch ( Throwable $e ) {
			return array( 'status' => 'error', 'data' => 'Manifesto nustatyti nepavyko: ' . $e->getMessage() );
		}

		// Kelių dėžių siuntoms sudedam packs[] — po vieną įrašą kiekvienai dėžei.
		$packs = false;
		$viena = ( 1 === count( $ids ) ) ? wc_get_order( reset( $ids ) ) : false;
		if ( $viena && self::reikia_pakuociu( $viena ) ) {
			$n = self::pakuociu( $viena );
			if ( $n > 1 ) {
				$sv = 0;
				foreach ( $viena->get_items() as $it ) {
					$p = $it->get_product();
					if ( $p && $p->get_weight() ) { $sv += (float) $p->get_weight() * (int) $it->get_quantity(); }
				}
				$dalis = $sv > 0 ? round( $sv / $n, 2 ) : 1;
				$packs = array();
				for ( $i = 0; $i < $n; $i++ ) {
					$packs[] = array( 'weight' => max( 0.1, $dalis ), 'width' => 0, 'height' => 0,
						'length' => 0, 'description' => '' );
				}
			}
		}

		ob_start();
		try {
			$rez = $obj->venipak_shipping_dispatch_order( array_values( array_map( 'intval', $ids ) ), $packs, false );
		} catch ( Throwable $e ) {
			$rez = array( 'status' => 'error', 'data' => $e->getMessage() );
		}
		ob_end_clean();

		$rp->setValue( $obj, $sena );
		return is_array( $rez ) ? $rez : array( 'status' => 'error', 'data' => 'Venipak negrąžino atsakymo' );
	}

	/** Manifesto PDF iš Venipak. s549: ws/print_list, laukas „code“. */
	protected static function venipak_manifesto_pdf( $kodas ) {
		$n = get_option( 'shopup_venipak_shipping_settings' );
		if ( ! is_array( $n ) ) { return new WP_Error( 'nustatymai', 'Venipak nustatymų nėra' ); }
		$resp = wp_remote_post( 'https://go.venipak.lt/ws/print_list', array(
			'timeout' => 45,
			'headers' => array( 'Referer' => 'https://woocommerce.com/' ),
			'body'    => array(
				'user' => $n['shopup_venipak_shipping_field_username'],
				'pass' => $n['shopup_venipak_shipping_field_password'],
				'code' => $kodas,
			),
		) );
		if ( is_wp_error( $resp ) ) { return $resp; }
		$b = wp_remote_retrieve_body( $resp );
		if ( '%PDF' !== substr( $b, 0, 4 ) ) {
			return new WP_Error( 'ne_pdf', wp_strip_all_tags( mb_substr( $b, 0, 200 ) ) );
		}
		return $b;
	}

	public static function vykdyti_veiksma() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }

		$v  = isset( $_GET['v'] ) ? sanitize_key( wp_unslash( $_GET['v'] ) ) : '';
		$id = isset( $_GET['id'] ) ? absint( $_GET['id'] ) : 0;
		check_admin_referer( 'ps_desk_' . $v . '_' . $id );

		$masinis = in_array( $v, array( 'lapai', 'perduoti', 'vp_reg', 'vp_manifestas' ), true );
		$o = $id ? wc_get_order( $id ) : false;
		if ( ! $o && ! $masinis ) { wp_die( 'Užsakymas nerastas' ); }

		$atgal = isset( $_GET['g'] ) ? wp_unslash( $_GET['g'] ) : '';
		$atgal = wp_validate_redirect( $atgal, admin_url( 'admin.php?page=' . self::SLUG ) );

		$zinute = 'nezinomas';

		$naudotojas = wp_get_current_user()->display_name;

		/* --- DARBO ĮRANKIAI. s524: abu priima užsakymus per transient. --- */
		$ids = array();
		if ( isset( $_GET['ids'] ) ) {
			$ids = array_filter( array_map( 'absint', explode( ',', sanitize_text_field( wp_unslash( $_GET['ids'] ) ) ) ) );
		}
		if ( ! $ids && $id ) { $ids = array( $id ); }

		if ( 'lapai' === $v && $ids ) {
			set_transient( 'ps_sheets_' . get_current_user_id(), $ids, 900 );
			wp_safe_redirect( admin_url( 'admin.php?page=ps-lapai&ps_ready=1' ) );
			exit;
		}

		if ( 'vp_reg' === $v && $ids ) {
			$sandelis = isset( $_GET['sandelis'] ) ? sanitize_key( wp_unslash( $_GET['sandelis'] ) ) : 'av';
			$kodas    = isset( self::MANIFESTAI[ $sandelis ] ) ? self::MANIFESTAI[ $sandelis ] : '001';
			$rez      = self::venipak_registruoti( $ids, $kodas );
			$ok       = ( isset( $rez['status'] ) && 'ok' === $rez['status'] );
			foreach ( $ids as $oid ) {
				$oo = wc_get_order( $oid );
				if ( $oo ) {
					$oo->add_order_note( sprintf( 'Venipak registracija darbalaukyje (%s, manifestas %s): %s',
						mb_strtoupper( $sandelis ), $kodas, $ok ? 'sėkminga' : ( 'KLAIDA — ' . ( $rez['data'] ?? '?' ) ) ), false, true );
					if ( $ok && class_exists( 'Petshop_Siuntos' ) ) {
						Petshop_Siuntos::prideti_is_plugino( $oid, $sandelis, $kodas );
					}
				}
			}
			wp_safe_redirect( add_query_arg( array(
				'pd_ok'  => $ok ? 'vp_ok' : 'vp_klaida',
				'pd_nr'  => rawurlencode( $ok ? count( $ids ) . ' · ' . mb_strtoupper( $sandelis ) : ( $rez['data'] ?? '' ) ),
			), $atgal ) );
			exit;
		}

		if ( 'klaus' === $v && $o ) {
			$t   = isset( $_GET['t'] ) ? sanitize_key( wp_unslash( $_GET['t'] ) ) : '';
			$iid = isset( $_GET['iid'] ) ? absint( $_GET['iid'] ) : 0;
			$src = isset( $_GET['src'] ) ? sanitize_key( wp_unslash( $_GET['src'] ) ) : '';
			$item = $iid ? $o->get_item( $iid ) : false;

			if ( 'laukti' === $t ) {
				$o->update_meta_data( '_ps_klaus_laukti', current_time( 'mysql' ) );
				$o->add_order_note( sprintf( 'Klausimas: pažymėta LAUKTI (%s). Jokio automatinio priminimo — grįši pats.',
					wp_get_current_user()->display_name ), false, true );
				$o->save();
				$zinute = 'kl_laukti';
			} elseif ( $item && $src && in_array( $t, array( 'siusti', 'parsivezti' ), true ) ) {
				$item->update_meta_data( '_ps_source', $src );
				$item->update_meta_data( '_ps_source_reason', 'darbalaukis: AV neužteko' );
				$item->update_meta_data( '_ps_source_at', current_time( 'mysql' ) );
				$item->save();

				$o->delete_meta_data( '_ps_klaus_laukti' );
				$o->add_order_note( sprintf( 'Klausimas išspręstas: „%s“ šaltinis pakeistas į %s (%s).',
					$item->get_name(), mb_strtoupper( $src ),
					'siusti' === $t ? 'siunčia tiekėjas' : 'parsivežam į AV' ), false, true );
				$o->save();

				if ( 'parsivezti' === $t && class_exists( 'Petshop_AV_Tiekimas' ) ) {
					wp_safe_redirect( Petshop_AV_Tiekimas::eilutes_url( $o->get_id(), $iid, 'ideti', $atgal ) );
					exit;
				}
				$zinute = 'kl_saltinis';
			}

			wp_safe_redirect( add_query_arg( array(
				'pd_ok' => $zinute, 'pd_nr' => rawurlencode( $o->get_order_number() ) ), $atgal ) );
			exit;
		}

		if ( 'pakuotes' === $v && $o ) {
			$n = isset( $_GET['n'] ) ? max( 1, min( 20, absint( $_GET['n'] ) ) ) : 1;
			$o->update_meta_data( self::META_PAK, $n );
			$o->add_order_note( sprintf( 'Darbalaukis: pakuočių skaičius nustatytas — %d.', $n ), false, true );
			$o->save();
			wp_safe_redirect( add_query_arg( array( 'pd_ok' => 'pakuotes', 'pd_nr' => $n ), $atgal ) );
			exit;
		}

		if ( 'vp_manifestas' === $v ) {
			$kodas = isset( $_GET['kodas'] ) ? sanitize_text_field( wp_unslash( $_GET['kodas'] ) ) : '';
			$pdf   = $kodas ? self::venipak_manifesto_pdf( $kodas ) : new WP_Error( 'nera', 'Manifesto kodas nenurodytas' );
			if ( is_wp_error( $pdf ) ) { wp_die( esc_html( 'Manifesto gauti nepavyko: ' . $pdf->get_error_message() ) ); }
			nocache_headers();
			header( 'Content-Type: application/pdf' );
			header( 'Content-Disposition: inline; filename="manifestas-' . $kodas . '.pdf"' );
			echo $pdf; // phpcs:ignore
			exit;
		}

		if ( 'perduoti' === $v && $ids ) {
			set_transient( 'ps_dropship_' . get_current_user_id(), $ids, 1800 );
			wp_safe_redirect( admin_url( 'admin.php?page=ps-dropship' ) );
			exit;
		}

		if ( 'apmoketa' === $v ) {
			if ( $o->is_paid() ) {
				$zinute = 'jau_apmoketa';
			} else {
				$tylus = ! empty( $_GET['be_laisko'] );
				$o->add_order_note(
					sprintf( 'Pažymėta kaip apmokėta darbalaukyje. Mokėjimo būdas: %s. Vartotojas: %s. Laiškas klientui: %s.',
						$o->get_payment_method_title() ? $o->get_payment_method_title() : '—',
						$naudotojas, $tylus ? 'NESIŲSTAS' : 'išsiųstas' ),
					false, true );
				if ( $tylus ) { self::laiskai_off(); }
				$o->payment_complete();
				if ( $tylus ) { self::laiskai_on(); }
				$zinute = $tylus ? 'apmoketa_tyliai' : 'apmoketa';

				// Sakyti TIESĄ: apmokėjus galėjo suveikti sandėlio/LP patikra —
				// tada užsakymas guli ne „Naujuose", o „Klausimuose".
				$sviezes = wc_get_order( $o->get_id() );
				$kl = $sviezes ? self::klausimas( $sviezes ) : '';
				if ( $kl ) { $zinute = 'apmoketa_klausimas'; $nr_priedas = $kl; }
			}
		}

		if ( 'atsaukti' === $v ) {
			if ( in_array( $o->get_status(), array( 'cancelled', 'lp-cancelled', 'refunded' ), true ) ) {
				$zinute = 'jau_atsaukta';
			} else {
				$su_laisku = ! empty( $_GET['su_laisku'] );
				$o->add_order_note(
					sprintf( 'Atšaukta darbalaukyje. Vartotojas: %s. Laiškas klientui: %s.',
						$naudotojas, $su_laisku ? 'išsiųstas' : 'NESIŲSTAS' ),
					false, true );
				if ( ! $su_laisku ) { self::laiskai_off(); }
				$o->update_status( 'cancelled', '' );
				if ( ! $su_laisku ) { self::laiskai_on(); }
				$zinute = $su_laisku ? 'atsaukta_laiskas' : 'atsaukta';
			}
		}

		wp_safe_redirect( add_query_arg( array(
			'pd_ok' => $zinute,
			'pd_nr' => rawurlencode( ( $o ? $o->get_order_number() : '' ) . ( isset( $nr_priedas ) ? '|' . $nr_priedas : '' ) ),
		), $atgal ) );
		exit;
	}

	public static function meniu() {
		add_menu_page( 'Petshop užsakymai', 'Petshop užsakymai', 'edit_shop_orders',
			self::SLUG, array( __CLASS__, 'puslapis' ), 'dashicons-clipboard', 2 );
	}

	/**
	 * WooCommerce užsakymų sąrašas nuimamas nuo akių, BET puslapis privalo
	 * likti veikiantis: per jį vykdomi vežėjų lipdukai ir sąskaitos (s526).
	 *
	 * s585: remove_submenu_page() puslapį uždaro visiškai — po jo wc-orders
	 * grąžino 403 ir lipdukai būtų nustoję veikti. Todėl slepiam CSS'u.
	 */
	public static function slepti_wc() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { return; }
		echo '<style>#adminmenu a[href*="page=wc-orders"]{display:none!important}</style>';
	}

	protected static function musu_puslapis() {
		return isset( $_GET['page'] ) && self::SLUG === $_GET['page'];
	}

	/** WordPress apdaras nuimamas TIK mūsų puslapyje. */
	public static function chrome() {
		if ( ! self::musu_puslapis() ) { return; }
		echo '<style>
			#adminmenumain,#wpfooter,#screen-meta,#screen-meta-links,.update-nag,.notice,#wpbody-content>.wrap>h1{display:none!important}
			#wpcontent{margin-left:0!important;padding-left:0!important}
			#wpbody-content{padding-bottom:0!important}
			html.wp-toolbar{padding-top:32px!important}
			#wpbody{margin:0!important}
		</style>';
	}

	/* ============================ DUOMENYS ============================ */

	/**
	 * Petshop_AV_Source::resolve() rezultatas su kešu.
	 * s513 patvirtinta: grąžina MASYVĄ
	 * [source, carrier, courier_only, av_qty, av_uztenka, tiekejas, reason].
	 */
	protected static function sprendimas( $pid, $qty ) {
		static $kesas = array();
		$r = (int) $pid . ':' . (int) $qty;
		if ( isset( $kesas[ $r ] ) ) { return $kesas[ $r ]; }
		$v = array();
		if ( $pid && class_exists( 'Petshop_AV_Source' ) ) {
			$x = Petshop_AV_Source::resolve( $pid, max( 1, (int) $qty ) );
			if ( is_array( $x ) ) { $v = $x; }
		}
		$kesas[ $r ] = $v;
		return $v;
	}

	/** Vienos eilutės šaltinis. Fiksuotas _ps_source visada viršesnis. */
	protected static function eilutes_saltinis( $item ) {
		$s = $item->get_meta( '_ps_source' );
		if ( is_string( $s ) && '' !== $s ) { return $s; }
		$v = self::sprendimas( $item->get_product_id(), $item->get_quantity() );
		if ( ! empty( $v['source'] ) && is_string( $v['source'] ) ) { return $v['source']; }
		return '';
	}

	/** Visi užsakyme esantys šaltiniai. */
	protected static function saltiniai( $order ) {
		$out = array();
		foreach ( $order->get_items() as $it ) {
			$s = self::eilutes_saltinis( $it );
			if ( is_string( $s ) && '' !== $s && ! in_array( $s, $out, true ) ) { $out[] = $s; }
		}
		return $out;
	}

	/** SAVA / DROPSHIP / MIŠRUS / — */
	protected static function vykdymas( $order ) {
		$s = self::saltiniai( $order );
		if ( ! $s ) { return array( '', 0 ); }
		$av = in_array( 'av', $s, true );
		$ds = count( array_diff( $s, array( 'av' ) ) ) > 0;
		if ( $av && $ds ) { return array( 'MIŠRUS', count( $s ) > 2 ? count( $s ) : 2 ); }
		return array( $av ? 'SAVA' : 'DROPSHIP', $ds ? count( array_diff( $s, array( 'av' ) ) ) : 1 );
	}

	const META_PAK = '_ps_pakuociu';

	/**
	 * Kiek dėžių šiai siuntai. Reikšmė reikalinga TIK kurjeriui —
	 * paštomate siunta visada viena.
	 * s571: Venipak priima packs[] masyvą, LP — lp_part_count lauką.
	 */
	public static function pakuociu( $o ) {
		$n = (int) $o->get_meta( self::META_PAK );
		return $n > 0 ? $n : 1;
	}

	protected static function reikia_pakuociu( $o ) {
		$v = self::vezejas( $o );
		return in_array( $v, array( 'venipak_kurjeris', 'lp' ), true )
			&& ( 'lp' !== $v || ! $o->get_meta( '_woo_lithuaniapost_lpexpress_terminal_id' ) );
	}

	/**
	 * LP dydį pluginas skaičiuoja PATS pagal bendrą svorį (s570: size-service).
	 * Mums rinktis nereikia — bet verta parodyti, iš ko jis skaičiuoja,
	 * ir įspėti, jei prekė be svorio, nes tada rezultatas melagingas.
	 */
	public static function lp_svoris( $o ) {
		$g = 0; $be = array();
		foreach ( $o->get_items() as $it ) {
			$p = $it->get_product();
			$w = $p ? (float) $p->get_weight() : 0;
			if ( $w <= 0 ) { $be[] = $it->get_name(); continue; }
			$g += $w * (int) $it->get_quantity();
		}
		$vnt = get_option( 'woocommerce_weight_unit' );
		if ( 'kg' === $vnt ) { $g = $g * 1000; }
		return array( (int) round( $g ), $be );
	}

	/** Siuntos kodai iš Venipak / LP. */
	public static function siuntos_kodas( $o ) {
		$d = $o->get_meta( 'venipak_shipping_order_data' );
		if ( is_string( $d ) && $d ) { $d = maybe_unserialize( $d ); }
		if ( is_array( $d ) && ! empty( $d['pack_numbers'] ) ) {
			$p = (array) $d['pack_numbers'];
			return array( implode( ', ', $p ), count( $p ) );
		}
		foreach ( array( '_lpexpress_tracking_number', 'lpexpress_tracking_number', '_lp_tracking' ) as $k ) {
			$v = $o->get_meta( $k );
			if ( $v ) { return array( is_array( $v ) ? implode( ', ', $v ) : $v, 1 ); }
		}
		return array( '', 0 );
	}

	/** venipak_kurjeris | venipak_pastomatas | lp | kita */
	protected static function vezejas( $order ) {
		$m = mb_strtoupper( (string) $order->get_shipping_method() );
		$lp = ( false !== mb_strpos( $m, 'UNISEND' ) || false !== mb_strpos( $m, 'LP ' ) || false !== mb_strpos( $m, 'LIETUVOS PAŠT' ) );
		$pastomatas = ( false !== mb_strpos( $m, 'PAŠTOMAT' ) || false !== mb_strpos( $m, 'ATSIĖMIM' ) || false !== mb_strpos( $m, 'PICKUP' ) );
		if ( $lp ) { return 'lp'; }
		if ( false !== mb_strpos( $m, 'VENIPAK' ) ) { return $pastomatas ? 'venipak_pastomatas' : 'venipak_kurjeris'; }
		return 'kita';
	}

	/** Ar užsakymas turi realią siuntą. */
	protected static function turi_siunta( $order ) {
		list( $k ) = self::siuntos_kodas( $order );
		return '' !== $k;
	}

	/** Kurios eilės užsakymas. */
	protected static function eile( $order ) {
		$st = $order->get_status();
		foreach ( array( 'neapmoketi', 'paruosta', 'atsaukti' ) as $e ) {
			if ( in_array( $st, self::STATUSAI[ $e ], true ) ) { return $e; }
		}
		if ( in_array( $st, self::STATUSAI['kelyje'], true ) )   { return 'kelyje'; }
		if ( in_array( $st, self::STATUSAI['ivykdyti'], true ) ) { return 'ivykdyti'; }
		if ( 'processing' === $st || 'on-hold' === $st ) {
			if ( self::turi_siunta( $order ) ) { return 'paruosta'; }
			if ( $order->get_meta( '_ps_tiekimas_laukia' ) ) { return 'laukia'; }
			return 'processing' === $st ? 'nauji' : 'kita';
		}
		return 'kita';
	}

	/**
	 * Ar užsakymas yra KLAUSIMAS. Grąžina priežastį arba ''.
	 * Tikrinami tik atviri užsakymai — įvykdytų ir atšauktų neliečiam.
	 */
	protected static function klausimas( $order ) {
		$st = $order->get_status();
		if ( in_array( $st, array( 'completed', 'lp-delivered', 'cancelled', 'lp-cancelled', 'refunded', 'checkout-draft' ), true ) ) {
			return '';
		}
		if ( 'failed' === $st )           { return 'Mokėjimas nepavyko'; }
		if ( 'lp-parcel-failed' === $st ) { return 'Siuntos sukurti nepavyko'; }

		if ( $order->get_meta( '_ps_withdrawal' ) ) { return 'Klientas atsisako sutarties'; }

		if ( $order->get_meta( '_ps_sla_velavimas' ) ) { return 'Tiekėjas vėluoja — perduota prieš 24+ val.'; }

		if ( ! $order->is_paid() ) { return ''; }

		// LP Express galimas TIK iš AV — dropship eilutė su LP pristatymu yra
		// fiziškai neįmanomas derinys, kuris kitaip išlįstų tik prie lipduko.
		if ( 'lp' === self::vezejas( $order ) ) {
			foreach ( $order->get_items() as $it ) {
				$ls = self::eilutes_saltinis( $it );
				if ( $ls && 'av' !== $ls ) { return 'LP negalimas — siuntoje ne-AV prekių'; }
			}
		}

		foreach ( $order->get_items() as $it ) {
			if ( 'av' !== self::eilutes_saltinis( $it ) ) { continue; }
			// jau nurašyta iš AV — prekė paimta, klausimo nėra
			if ( $it->get_meta( '_reduced_stock' ) || $it->get_meta( '_ps_av_reduced' ) ) { continue; }
			$pid = $it->get_product_id();
			if ( ! $pid ) { continue; }
			$fiksuota = (int) $it->get_meta( '_ps_source_qty' );
			$reikia   = $fiksuota ? $fiksuota : (int) $it->get_quantity();
			/*
			 * s589 — TIKRASIS modelis (perskaitytas AV_Source::resolve kode):
			 *   legacy prekė = AV sandėlis, likutis WooCommerce `_stock` lauke;
			 *   `_own_stock_qty` reikalingas TIK toms prekėms, kurios turi ir
			 *   tiekėją (jų katalogе vos 3).
			 * Todėl AV_Stock::qty() legacy prekėms grąžina null — remtis juo
			 * NEGALIMA. Vienintelis teisingas rodiklis yra resolve()['av_qty'].
			 */
			$v = self::sprendimas( $pid, $reikia );
			if ( $v && ! empty( $v['source'] ) && 'av' === $v['source']
				&& isset( $v['av_qty'] ) && (int) $v['av_qty'] < $reikia ) {
				return 'Trūksta sandėlyje';
			}
		}
		return '';
	}

	/**
	 * Problemiškos užsakymo eilutės su siūlomu sprendimu.
	 * Grąžina [ [iid, pavadinimas, reikia, av_turi, tiekejas, tiekejo_vardas] ]
	 */
	protected static function klausimo_eilutes( $order ) {
		$out = array();
		foreach ( $order->get_items() as $iid => $it ) {
			if ( 'av' !== self::eilutes_saltinis( $it ) ) { continue; }
			if ( $it->get_meta( '_reduced_stock' ) || $it->get_meta( '_ps_av_reduced' ) ) { continue; }
			$pid = $it->get_product_id();
			if ( ! $pid ) { continue; }
			$fix = (int) $it->get_meta( '_ps_source_qty' );
			$reikia = $fix ? $fix : (int) $it->get_quantity();
			$v    = self::sprendimas( $pid, $reikia );
			$turi = ( $v && isset( $v['av_qty'] ) ) ? (int) $v['av_qty'] : 0;
			if ( empty( $v['source'] ) || 'av' !== $v['source'] || $turi >= $reikia ) { continue; }

			$tiek = '';
			if ( ! empty( $v['tiekejas'] ) && is_string( $v['tiekejas'] ) && 'av' !== $v['tiekejas'] ) {
				$tiek = $v['tiekejas'];
			} elseif ( ! empty( $v['source'] ) && 'av' !== $v['source'] ) {
				$tiek = $v['source'];
			}

			$out[] = array(
				'iid'    => $iid,
				'pav'    => $it->get_name(),
				'reikia' => $reikia,
				'turi'   => $turi,
				'tiek'   => $tiek,
				'tiekv'  => $tiek ? ( self::SALTINIAI[ $tiek ][2] ?? mb_strtoupper( $tiek ) ) : '',
			);
		}
		return $out;
	}

	/* ============================ UŽKLAUSA ============================ */

	protected static function paieska_ids( $q ) {
		global $wpdb; $pf = $wpdb->prefix;
		$like = '%' . $wpdb->esc_like( $q ) . '%';
		$ids  = $wpdb->get_col( $wpdb->prepare(
			"SELECT DISTINCT o.id FROM {$pf}wc_orders o
			 LEFT JOIN {$pf}wc_order_addresses a ON a.order_id = o.id
			 WHERE o.type = 'shop_order' AND o.status <> 'wc-checkout-draft' AND (
			   o.id LIKE %s OR o.billing_email LIKE %s OR a.first_name LIKE %s
			   OR a.last_name LIKE %s OR a.phone LIKE %s
			   OR CONCAT(a.first_name,' ',a.last_name) LIKE %s
			   OR a.address_1 LIKE %s OR a.city LIKE %s OR a.postcode LIKE %s
			   OR a.company LIKE %s )
			 ORDER BY o.id DESC LIMIT 120",
			$like, $like, $like, $like, $like, $like, $like, $like, $like, $like ) );

		$pagal_preke = $wpdb->get_col( $wpdb->prepare(
			"SELECT DISTINCT order_id FROM {$pf}woocommerce_order_items
			 WHERE order_item_name LIKE %s ORDER BY order_id DESC LIMIT 60", $like ) );

		$pagal_siunta = $wpdb->get_col( $wpdb->prepare(
			"SELECT DISTINCT order_id FROM {$pf}wc_orders_meta
			 WHERE meta_value LIKE %s LIMIT 40", $like ) );

		return array_slice( array_unique( array_merge( $ids, $pagal_preke, $pagal_siunta ) ), 0, 150 );
	}

	/** Tikslinė paieška atskirais laukais (Raimio filtrai). AND semantika. */
	protected static function lauku_paieska( $f ) {
		if ( '' === $f['nr'] && '' === $f['klientas'] && '' === $f['tel'] && '' === $f['adresas'] ) { return null; }
		global $wpdb; $pf = $wpdb->prefix;
		$kur = array( "o.type='shop_order'", "o.status<>'wc-checkout-draft'" );
		$par = array();
		if ( '' !== $f['nr'] ) { $kur[] = 'o.id LIKE %s'; $par[] = '%' . $wpdb->esc_like( $f['nr'] ) . '%'; }
		if ( '' !== $f['klientas'] ) {
			$kur[] = "(CONCAT(a.first_name,' ',a.last_name) LIKE %s OR o.billing_email LIKE %s OR a.company LIKE %s)";
			$l = '%' . $wpdb->esc_like( $f['klientas'] ) . '%'; $par[] = $l; $par[] = $l; $par[] = $l;
		}
		if ( '' !== $f['tel'] ) { $kur[] = 'a.phone LIKE %s'; $par[] = '%' . $wpdb->esc_like( $f['tel'] ) . '%'; }
		if ( '' !== $f['adresas'] ) {
			$kur[] = '(a.address_1 LIKE %s OR a.city LIKE %s OR a.postcode LIKE %s)';
			$l = '%' . $wpdb->esc_like( $f['adresas'] ) . '%'; $par[] = $l; $par[] = $l; $par[] = $l;
		}
		return $wpdb->get_col( $wpdb->prepare(
			"SELECT DISTINCT o.id FROM {$pf}wc_orders o
			 LEFT JOIN {$pf}wc_order_addresses a ON a.order_id=o.id
			 WHERE " . implode( ' AND ', $kur ) . ' ORDER BY o.id DESC LIMIT 150', $par ) );
	}

	protected static function datos_riba( $kodas, $nuo, $iki ) {
		$tz = wp_timezone();
		$d  = new DateTime( 'now', $tz );
		switch ( $kodas ) {
			case 'siandien': return array( $d->format( 'Y-m-d' ) . ' 00:00:00', $d->format( 'Y-m-d' ) . ' 23:59:59' );
			case 'vakar':
				$v = ( clone $d )->modify( '-1 day' )->format( 'Y-m-d' );
				return array( $v . ' 00:00:00', $v . ' 23:59:59' );
			case 'savaite':
				$p = ( clone $d )->modify( 'monday this week' )->format( 'Y-m-d' );
				return array( $p . ' 00:00:00', $d->format( 'Y-m-d' ) . ' 23:59:59' );
			case 'menuo':
				return array( $d->format( 'Y-m-01' ) . ' 00:00:00', $d->format( 'Y-m-d' ) . ' 23:59:59' );
			case 'praeitas':
				$p = ( clone $d )->modify( 'first day of last month' );
				$g = ( clone $d )->modify( 'last day of last month' );
				return array( $p->format( 'Y-m-01' ) . ' 00:00:00', $g->format( 'Y-m-d' ) . ' 23:59:59' );
			case 'intervalas':
				if ( ! $nuo && ! $iki ) { return null; }
				return array( ( $nuo ? $nuo : '2000-01-01' ) . ' 00:00:00', ( $iki ? $iki : '2099-12-31' ) . ' 23:59:59' );
		}
		return null;
	}

	/** Grąžina [užsakymai, skaičiai]. */
	protected static function gauti( $eile, $f ) {
		$args = array(
			'limit'   => 200,
			'type'    => 'shop_order',
			'orderby' => 'date',
			'order'   => 'DESC',
			'return'  => 'objects',
		);

		if ( ! empty( $f['q'] ) ) {
			$ids = self::paieska_ids( $f['q'] );
			if ( ! $ids ) { return array(); }
			$args['post__in'] = $ids;
			$args['include']  = $ids;
			$args['limit']    = 150;
		}

		$lids = self::lauku_paieska( $f );
		if ( null !== $lids ) {
			if ( ! $lids ) { return array(); }
			$lids = isset( $args['include'] ) ? array_values( array_intersect( $args['include'], $lids ) ) : $lids;
			if ( ! $lids ) { return array(); }
			$args['post__in'] = $lids;
			$args['include']  = $lids;
			$args['limit']    = 150;
		}

		$riba = self::datos_riba( $f['data'], $f['nuo'], $f['iki'] );
		if ( $riba ) { $args['date_created'] = $riba[0] . '...' . $riba[1]; }

		if ( 'laukia' === $eile ) {
			$args['status'] = array( 'processing', 'on-hold' );
		} elseif ( 'atsaukti' === $eile ) {
			$args['status'] = self::STATUSAI['atsaukti'];
		} elseif ( 'issiusti' === $eile ) {
			$args['status'] = array_merge( self::STATUSAI['kelyje'], self::STATUSAI['ivykdyti'] );
		} elseif ( 'neapmoketi' === $eile ) {
			$args['status'] = self::STATUSAI['neapmoketi'];
		} elseif ( 'visi' === $eile || 'klausimai' === $eile ) {
			$args['status'] = array_keys( wc_get_order_statuses() );
			$args['status'] = array_map( function ( $s ) { return str_replace( 'wc-', '', $s ); }, $args['status'] );
			$args['status'] = array_diff( $args['status'], array( 'checkout-draft' ) );
		} else {
			$args['status'] = array( 'processing', 'on-hold', 'failed' );
			$args['status'] = array_merge( $args['status'], self::STATUSAI['paruosta'] );
		}

		$orders = wc_get_orders( $args );
		if ( ! is_array( $orders ) ) { return array(); }

		$out = array();
		foreach ( $orders as $o ) {
			if ( ! is_a( $o, 'WC_Order' ) ) { continue; }
			$kl = self::klausimas( $o );
			$e  = self::eile( $o );

			if ( 'klausimai' === $eile ) {
				if ( ! $kl ) { continue; }
			} elseif ( 'issiusti' === $eile ) {
				if ( ! in_array( $e, array( 'kelyje', 'ivykdyti' ), true ) ) { continue; }
			} elseif ( 'visi' !== $eile ) {
				if ( $e !== $eile ) { continue; }
				if ( $kl && 'klausimai' !== $eile && 'atsaukti' !== $eile ) { continue; }
			}

			if ( ! empty( $f['busena'] ) ) {
				$leidz = self::STATUSAI[ $f['busena'] ] ?? array();
				if ( 'nauji' === $f['busena'] ) {
					if ( 'nauji' !== $e ) { continue; }
				} elseif ( $leidz && ! in_array( $o->get_status(), $leidz, true ) ) { continue; }
			}

			// vykdymo filtras
			if ( ! empty( $f['vykdymas'] ) ) {
				$s   = self::saltiniai( $o );
				$v   = $f['vykdymas'];
				$av  = in_array( 'av', $s, true );
				$ds  = count( array_diff( $s, array( 'av' ) ) ) > 0;
				if ( 'sava' === $v && ( ! $av || $ds ) ) { continue; }
				if ( 'dropship' === $v && ( $av || ! $ds ) ) { continue; }
				if ( 'misrus' === $v && ! ( $av && $ds ) ) { continue; }
				if ( isset( self::SALTINIAI[ $v ] ) && ! in_array( $v, $s, true ) ) { continue; }
			}

			// pristatymo filtras
			if ( ! empty( $f['vezejas'] ) && self::vezejas( $o ) !== $f['vezejas'] ) { continue; }

			// mokėjimo filtras
			if ( ! empty( $f['mokejimas'] ) ) {
				$m = $f['mokejimas'];
				if ( 'apmoketa' === $m && ! $o->is_paid() ) { continue; }
				if ( 'neapmoketa' === $m && $o->is_paid() ) { continue; }
				if ( 'paysera' === $m && false === strpos( (string) $o->get_payment_method(), 'paysera' ) ) { continue; }
				if ( 'bacs' === $m && 'bacs' !== $o->get_payment_method() ) { continue; }
			}

			// amžiaus filtras — užstrigusiems gaudyti
			if ( ! empty( $f['amzius'] ) ) {
				$sk = $o->get_date_created();
				if ( ! $sk ) { continue; }
				$dienu = ( time() - $sk->getTimestamp() ) / DAY_IN_SECONDS;
				if ( 'd2' === $f['amzius'] && $dienu < 2 ) { continue; }
				if ( 'd3' === $f['amzius'] && $dienu < 3 ) { continue; }
				if ( 'd5' === $f['amzius'] && $dienu < 5 ) { continue; }
			}

			$out[] = array( 'o' => $o, 'eile' => $e, 'klausimas' => $kl );
		}
		return $out;
	}

	/** Eilių skaitikliai — viena praeiga per atvirus užsakymus. */
	protected static function skaiciai() {
		$c = array( 'nauji' => 0, 'neapmoketi' => 0, 'laukia' => 0, 'paruosta' => 0,
			'klausimai' => 0, 'atsaukti' => 0, 'visi' => 0 );

		$atviri = wc_get_orders( array(
			'limit'  => 200,
			'type'   => 'shop_order',
			'status' => array_merge( array( 'processing', 'on-hold', 'pending', 'failed', 'lp-parcel-await', 'lp-parcel-failed' ), self::STATUSAI['paruosta'] ),
		) );
		foreach ( (array) $atviri as $o ) {
			if ( ! is_a( $o, 'WC_Order' ) ) { continue; }
			if ( self::klausimas( $o ) ) { $c['klausimai']++; continue; }
			$e = self::eile( $o );
			if ( isset( $c[ $e ] ) ) { $c[ $e ]++; }
		}

		global $wpdb; $pf = $wpdb->prefix;
		$c['atsaukti'] = (int) $wpdb->get_var(
			"SELECT COUNT(*) FROM {$pf}wc_orders WHERE type='shop_order'
			 AND status IN ('wc-cancelled','wc-lp-cancelled','wc-refunded')" );
		$c['issiusti'] = (int) $wpdb->get_var(
			"SELECT COUNT(*) FROM {$pf}wc_orders WHERE type='shop_order'
			 AND status IN ('wc-lp-on-the-way','wc-completed','wc-lp-delivered')" );
		$c['visi'] = (int) $wpdb->get_var(
			"SELECT COUNT(*) FROM {$pf}wc_orders WHERE type='shop_order' AND status<>'wc-checkout-draft'" );
		return $c;
	}

	/* ============================ VAIZDAS ============================ */

	protected static function url( $args = array() ) {
		$b = array( 'page' => self::SLUG );
		foreach ( array( 'eile', 'q', 'data', 'nuo', 'iki', 'vykdymas', 'vezejas', 'busena' ) as $k ) {
			if ( isset( $_GET[ $k ] ) && '' !== $_GET[ $k ] ) { $b[ $k ] = sanitize_text_field( wp_unslash( $_GET[ $k ] ) ); }
		}
		foreach ( $args as $k => $v ) {
			if ( null === $v || '' === $v ) { unset( $b[ $k ] ); } else { $b[ $k ] = $v; }
		}
		return admin_url( 'admin.php?' . http_build_query( $b ) );
	}

	protected static function zyme( $s ) {
		$d = self::SALTINIAI[ $s ] ?? array( '#6B7269', mb_strtoupper( $s ), $s );
		$stilius = 'av' === $s
			? 'background:' . $d[0] . ';color:#fff'
			: 'border:1px solid ' . $d[0] . ';color:' . $d[0];
		return '<span class="pd-src" style="' . $stilius . '" title="' . esc_attr( $d[2] ) . '">' . esc_html( $d[1] ) . '</span>';
	}

	public static function puslapis() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }

		if ( isset( $_GET['view'] ) && 'rytas' === $_GET['view'] ) { self::rytas(); return; }

		$eile = isset( $_GET['eile'] ) ? sanitize_key( $_GET['eile'] ) : 'nauji';
		if ( ! isset( self::EILES[ $eile ] ) ) { $eile = 'nauji'; }

		$f = array(
			'q'        => isset( $_GET['q'] ) ? sanitize_text_field( wp_unslash( $_GET['q'] ) ) : '',
			'data'     => isset( $_GET['data'] ) ? sanitize_key( $_GET['data'] ) : '',
			'nuo'      => isset( $_GET['nuo'] ) ? sanitize_text_field( wp_unslash( $_GET['nuo'] ) ) : '',
			'iki'      => isset( $_GET['iki'] ) ? sanitize_text_field( wp_unslash( $_GET['iki'] ) ) : '',
			'vykdymas' => isset( $_GET['vykdymas'] ) ? sanitize_key( $_GET['vykdymas'] ) : '',
			'vezejas'  => isset( $_GET['vezejas'] ) ? sanitize_key( $_GET['vezejas'] ) : '',
			'busena'   => isset( $_GET['busena'] ) ? sanitize_key( $_GET['busena'] ) : '',
			'mokejimas'=> isset( $_GET['mokejimas'] ) ? sanitize_key( $_GET['mokejimas'] ) : '',
			'amzius'   => isset( $_GET['amzius'] ) ? sanitize_key( $_GET['amzius'] ) : '',
			'nr'       => isset( $_GET['nr'] ) ? sanitize_text_field( wp_unslash( $_GET['nr'] ) ) : '',
			'klientas' => isset( $_GET['klientas'] ) ? sanitize_text_field( wp_unslash( $_GET['klientas'] ) ) : '',
			'tel'      => isset( $_GET['tel'] ) ? sanitize_text_field( wp_unslash( $_GET['tel'] ) ) : '',
			'adresas'  => isset( $_GET['adresas'] ) ? sanitize_text_field( wp_unslash( $_GET['adresas'] ) ) : '',
		);

		$eilutes = self::gauti( $eile, $f );
		if ( 'klausimai' === $eile ) { $f['korteles'] = 1; }
		$c       = self::skaiciai();
		$statusai = wc_get_order_statuses();

		self::stilius();
		echo '<div class="pd">';
		self::virsus( $f );
		self::pranesimas();
		echo '<div class="pd-body">';
		self::rail( $eile, $c );
		echo '<main class="pd-main">';
		self::juosta( $eile, $f, count( $eilutes ) );
		if ( 'klausimai' === $eile && $eilutes ) {
			echo '<div class="pd-wrap">';
			self::klausimu_korteles( $eilutes );
			echo '</div>';
		} else {
			self::lentele( $eilutes, $statusai );
		}
		echo '</main></div>';
		self::skydelis();
		self::dialogas();
		self::bulk();
		self::skriptas();
		echo '</div>';
	}

	/** Rezultatas po veiksmo. */
	/* ============================ RYTINĖ EIGA ============================
	 * Šeši žingsniai vietoj rankinio rankiojimo. Partija UŽRAKINAMA pirmame
	 * žingsnyje (transient 3 val.) — kad viduryje atėję nauji užsakymai
	 * nepakeistų to, ką jau atsispausdinai.
	 *
	 * Žingsniai spaudžiami: gali šokti tiesiai į „Tiekėjams“, jei Belacor
	 * kurjeris atvažiuoja 10:00, ir grįžti prie likusio darbo vėliau.
	 *
	 * Kiekvienas darbo mygtukas atidaro NAUJĄ kortelę — eiga lieka vietoje.
	 * ==================================================================== */

	const RYTO_ZINGSNIAI = array(
		1 => 'Peržiūra',
		2 => 'Surinkimo lapai',
		3 => 'Venipak',
		4 => 'LP Express',
		5 => 'Tiekėjams',
		6 => 'Baigta',
	);

	/** Partijos sudėtis. $naujai = perskaičiuoti iš naujo. */
	protected static function ryto_partija( $naujai = false ) {
		$raktas = 'ps_rytas_' . get_current_user_id();
		if ( ! $naujai ) {
			$k = get_transient( $raktas );
			if ( is_array( $k ) && ! empty( $k['ts'] ) ) { return $k; }
		}

		$orders = wc_get_orders( array(
			'limit'  => 200,
			'type'   => 'shop_order',
			'status' => array( 'processing', 'on-hold' ),
		) );

		$p = array(
			'ts' => time(), 'visi' => array(), 'av' => array(), 'ds' => array(),
			'vp' => array(), 'lp' => array(), 'klausimai' => array(),
			'vp_grupes' => array(), 'vp_misrus' => array(),
			'tiekejai' => array(), 'eil' => array(),
		);

		foreach ( (array) $orders as $o ) {
			if ( ! is_a( $o, 'WC_Order' ) ) { continue; }
			if ( ! $o->is_paid() ) { continue; }
			$id = $o->get_id();

			if ( self::klausimas( $o ) ) { $p['klausimai'][] = $id; continue; }
			if ( 'nauji' !== self::eile( $o ) ) { continue; }

			$sal = self::saltiniai( $o );
			$av  = in_array( 'av', $sal, true );
			$ds  = array_values( array_diff( $sal, array( 'av' ) ) );
			$jau_perduota = (bool) $o->get_meta( '_ps_dropship_sent' );

			$p['visi'][] = $id;
			$p['eil'][]  = array(
				'id'  => $id,
				'nr'  => $o->get_order_number(),
				'kl'  => trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ),
				'vyk' => self::vykdymas( $o )[0],
				'vez' => self::vezejo_vardas( $o ),
				'ds'  => $ds,
				'perduota' => $jau_perduota,
			);

			if ( $av ) { $p['av'][] = $id; }

			// Venipak grupuojam PAGAL SANDĖLĮ — vienas manifestas vienam paėmimui.
			// Siuntėjas visada Avesa; skiriasi tik iš kur kurjeris paima.
			if ( 'lp' === self::vezejas( $o ) ) {
				if ( $av ) { $p['lp'][] = $id; }
			} else {
				$p['vp'][] = $id;
				if ( count( $sal ) > 1 ) {
					$p['vp_misrus'][] = $id;
				} else {
					$k = $sal ? $sal[0] : 'av';
					if ( ! isset( $p['vp_grupes'][ $k ] ) ) { $p['vp_grupes'][ $k ] = array(); }
					$p['vp_grupes'][ $k ][] = $id;
				}
			}
			if ( $ds && ! $jau_perduota ) {
				$p['ds'][] = $id;
				foreach ( $ds as $t ) {
					if ( ! isset( $p['tiekejai'][ $t ] ) ) { $p['tiekejai'][ $t ] = 0; }
					$p['tiekejai'][ $t ]++;
				}
			}
		}

		set_transient( $raktas, $p, 3 * HOUR_IN_SECONDS );
		return $p;
	}

	protected static function ryto_url( $z, $extra = array() ) {
		return admin_url( 'admin.php?' . http_build_query( array_merge(
			array( 'page' => self::SLUG, 'view' => 'rytas', 'z' => (int) $z ), $extra ) ) );
	}

	protected static function rytas() {
		$z = isset( $_GET['z'] ) ? max( 1, min( 6, absint( $_GET['z'] ) ) ) : 1;
		$p = self::ryto_partija( 1 === $z && isset( $_GET['naujai'] ) );

		self::stilius();
		echo '<div class="pd pd-rytas">';
		?>
		<header class="pd-top">
			<div class="pd-brand">Petshop <span>· rytinė eiga</span></div>
			<div class="pd-steps">
				<?php foreach ( self::RYTO_ZINGSNIAI as $n => $t ) :
					$b = $n < $z ? 'atlikta' : ( $n === $z ? 'dabar' : '' ); ?>
					<a class="pd-step <?php echo esc_attr( $b ); ?>" href="<?php echo esc_url( self::ryto_url( $n ) ); ?>">
						<span class="pd-sdot"><?php echo $n < $z ? '✓' : (int) $n; ?></span><?php echo esc_html( $t ); ?>
					</a>
					<?php if ( 6 !== $n ) { echo '<span class="pd-sarr">›</span>'; } ?>
				<?php endforeach; ?>
			</div>
			<div class="pd-top-r">
				<a class="pd-tbtn" href="<?php echo esc_url( admin_url( 'admin.php?page=' . self::SLUG ) ); ?>">✕ Išeiti</a>
			</div>
		</header>
		<div class="pd-ryt-body">
		<?php

		if ( ! $p['visi'] ) {
			echo '<div class="pd-empty" style="padding:80px 20px"><b>Nieko ruošti</b>
				<span>Apmokėtų užsakymų, laukiančių surinkimo ar perdavimo, nėra.</span></div>';
		} else {
			switch ( $z ) {
				case 1: self::ryt1( $p ); break;
				case 2: self::ryt2( $p ); break;
				case 3: self::ryt3( $p ); break;
				case 4: self::ryt4( $p ); break;
				case 5: self::ryt5( $p ); break;
				default: self::ryt6( $p );
			}
		}

		echo '</div>';
		self::ryt_kojele( $z, $p );
		self::wc_forma();
		self::ryt_skriptas();
		echo '</div>';
	}

	protected static function ryt_kojele( $z, $p ) {
		echo '<div class="pd-ryt-f">';
		if ( $z > 1 ) {
			printf( '<a class="pd-btn" href="%s">Atgal</a>', esc_url( self::ryto_url( $z - 1 ) ) );
		}
		echo '<span class="pd-ryt-hint">' . esc_html( self::ryt_uzuomina( $z ) ) . '</span>';
		if ( $z < 6 ) {
			printf( '<a class="pd-btn pd-btn-p" href="%s">%s</a>',
				esc_url( self::ryto_url( $z + 1 ) ), 1 === $z ? 'Pradėti' : 'Toliau' );
		} else {
			printf( '<a class="pd-btn pd-btn-p" href="%s">Uždaryti</a>',
				esc_url( admin_url( 'admin.php?page=' . self::SLUG ) ) );
		}
		echo '</div>';
	}

	protected static function ryt_uzuomina( $z ) {
		$u = array(
			1 => 'Partija užrakinama — vėliau atėję užsakymai jos nepakeis.',
			2 => 'A4 spausdintuvas. Atsidaro naujoje kortelėje, eiga lieka čia.',
			3 => 'Etikečių spausdintuvas 10×15. Pirma registruoti, tada spausdinti.',
			4 => 'LP siuntoms dydis renkamas formuojant lipduką.',
			5 => 'Laiškai neišeina be tavo paspaudimo perdavimo ekrane.',
			6 => '',
		);
		return $u[ $z ] ?? '';
	}

	protected static function ryt_kort( $sk, $etikete, $spalva ) {
		printf( '<div class="pd-rcard"><div class="pd-rv" style="color:%s">%d</div><div class="pd-rl">%s</div></div>',
			esc_attr( $spalva ), (int) $sk, wp_kses_post( $etikete ) );
	}

	protected static function ryt1( $p ) {
		echo '<h2 class="pd-rh2">Į rytinę partiją patenka</h2><div class="pd-rgrid">';
		self::ryt_kort( count( $p['av'] ), 'iš sandėlio (AV)<br><small>' . count( $p['vp'] ) . ' Venipak · ' . count( $p['lp'] ) . ' LP</small>', '#2D5F3F' );
		$t = array();
		foreach ( $p['tiekejai'] as $k => $n ) { $t[] = ( self::SALTINIAI[ $k ][1] ?? mb_strtoupper( $k ) ) . ' ' . $n; }
		self::ryt_kort( count( $p['ds'] ), 'tiekėjams<br><small>' . ( $t ? esc_html( implode( ' · ', $t ) ) : '—' ) . '</small>', '#5B3B92' );
		self::ryt_kort( count( $p['klausimai'] ), 'klausimai<br><small>į partiją NEPATENKA</small>', '#98262A' );
		echo '</div>';

		echo '<table class="pd-tbl pd-rtbl"><thead><tr><th>Nr.</th><th>Klientas</th><th>Kelias</th><th>Pristatymas</th><th>Tiekėjai</th></tr></thead><tbody>';
		foreach ( $p['eil'] as $e ) {
			$ts = array();
			foreach ( $e['ds'] as $t ) { $ts[] = self::zyme( $t ); }
			printf( '<tr><td class="pd-nr">#%s</td><td>%s</td><td><span class="pd-exec">%s</span></td><td>%s</td><td>%s%s</td></tr>',
				esc_html( $e['nr'] ), esc_html( $e['kl'] ), esc_html( $e['vyk'] ), esc_html( $e['vez'] ),
				implode( '', $ts ) ? implode( '', $ts ) : '—',
				$e['perduota'] ? ' <span class="pd-sent">jau perduota</span>' : '' );
		}
		echo '</tbody></table>';
		printf( '<p class="pd-rnote">Partija sudaryta %s. <a href="%s">Perskaičiuoti iš naujo</a></p>',
			esc_html( wp_date( 'H:i', $p['ts'] ) ), esc_url( self::ryto_url( 1, array( 'naujai' => 1 ) ) ) );
	}

	protected static function ryt2( $p ) {
		echo '<h2 class="pd-rh2">Surinkimo lapai</h2>';
		if ( ! $p['av'] ) {
			echo '<p class="pd-rnote">Šioje partijoje nėra prekių iš savo sandėlio — šį žingsnį praleisk.</p>';
			return;
		}
		printf( '<p class="pd-rnote">%d %s su prekėmis iš sandėlio. Lape trys blokai: bendras surinkimas, Venipak eilėmis, LP eilėmis. Dropship eilutės į lapus neįtraukiamos.</p>',
			count( $p['av'] ), esc_html( self::linksnis( count( $p['av'] ), 'užsakymas', 'užsakymai', 'užsakymų' ) ) );
		printf( '<a class="pd-btn pd-btn-p pd-rbig" target="_blank" rel="noopener" href="%s">Atidaryti surinkimo lapus →</a>',
			esc_url( self::veiksmo_url( 'lapai', 0 ) . '&ids=' . implode( ',', $p['av'] ) ) );
	}

	/**
	 * Siuntų būklė. Vežėjo pluginas apie nesėkmę nepraneša (s538), todėl
	 * po kiekvieno veiksmo pasitikrinam PATYS: ar atsirado siuntos kodas.
	 * Grąžina [eilutės[], registruota, viso].
	 */
	protected static function siuntu_bukle( $ids ) {
		$eil = array(); $ok = 0;
		foreach ( (array) $ids as $id ) {
			$o = wc_get_order( $id );
			if ( ! $o ) { continue; }
			list( $kodas, $pak ) = self::siuntos_kodas( $o );
			if ( $kodas ) { $ok++; }
			$eil[] = array(
				'nr'    => $o->get_order_number(),
				'kl'    => trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ),
				'vieta' => $o->get_meta( 'venipak_pickup_point' ),
				'vez'   => self::vezejo_vardas( $o ),
				'kodas' => $kodas,
				'pak'   => $pak,
			);
		}
		return array( $eil, $ok, count( (array) $ids ) );
	}

	protected static function siuntu_lentele( $ids, $pastomatu_tikrinti = true ) {
		list( $eil, $ok, $viso ) = self::siuntu_bukle( $ids );
		printf( '<div class="pd-rstat %s">%s</div>',
			$ok === $viso ? 'ok' : ( $ok ? 'dalis' : 'nulis' ),
			esc_html( sprintf( 'Registruota %d iš %d', $ok, $viso ) ) );

		echo '<table class="pd-tbl pd-rtbl"><thead><tr><th>Nr.</th><th>Klientas</th><th>Pristatymas</th><th>Siuntos kodas</th></tr></thead><tbody>';
		foreach ( $eil as $e ) {
			$trukumas = ( $pastomatu_tikrinti && ! $e['kodas'] && false !== mb_stripos( $e['vez'], 'paštomat' ) && ! $e['vieta'] )
				? ' <span class="pd-rbad">nenurodytas paštomatas</span>' : '';
			printf( '<tr><td class="pd-nr">#%s</td><td>%s</td><td>%s%s</td><td>%s</td></tr>',
				esc_html( $e['nr'] ), esc_html( $e['kl'] ), esc_html( $e['vez'] ), $trukumas,
				$e['kodas']
					? '<span class="pd-rok">✓ ' . esc_html( $e['kodas'] ) . ( $e['pak'] > 1 ? ' · ' . (int) $e['pak'] . ' lipdukai' : '' ) . '</span>'
					: '<span class="pd-rbad">— nėra</span>' );
		}
		echo '</tbody></table>';
		return $ok;
	}

	protected static function ryt3( $p ) {
		echo '<h2 class="pd-rh2">Venipak</h2>';
		if ( ! $p['vp'] ) { echo '<p class="pd-rnote">Venipak siuntų šioje partijoje nėra.</p>'; return; }

		echo '<p class="pd-rnote">Kiekvienas sandėlis registruojamas <b>atskirai</b> — taip gaunamas savas manifestas
			tam kurjerio paėmimui. Siuntėjas visose siuntose lieka UAB Avesa.</p>';

		$pav = array(
			'av' => 'Savas sandėlis', 'vf' => 'Vetfarmas', 'zb' => 'Žalioji Banga',
			'quattro' => 'Quattro', 'prins' => 'Prins / Faunas', 'ambrosia' => 'Ambrosia', 'belcor_tofu' => 'Belacor',
		);

		foreach ( self::MANIFESTAI as $k => $mkod ) {
			if ( empty( $p['vp_grupes'][ $k ] ) ) { continue; }
			$grupe = $p['vp_grupes'][ $k ];
			list( $eil, $ok, $viso ) = self::siuntu_bukle( $grupe );

			echo '<div class="pd-vgrp">';
			printf( '<div class="pd-vgrp-h"><b>%s</b><span class="pd-vman">manifestas %s</span>%s%s</div>',
				esc_html( $pav[ $k ] ?? mb_strtoupper( $k ) ),
				esc_html( self::manifesto_numeris( $mkod ) ),
				self::ribos_zyme( $k ),
				sprintf( '<span class="pd-rstat %s">%s</span>',
					$ok === $viso ? 'ok' : ( $ok ? 'dalis' : 'nulis' ),
					esc_html( sprintf( 'registruota %d iš %d', $ok, $viso ) ) ) );

			echo '<div class="pd-vgrp-b">';
			printf( '<a class="pd-btn pd-btn-p" href="%s">Registruoti %d %s</a>',
				esc_url( self::veiksmo_url( 'vp_reg', 0 ) . '&sandelis=' . rawurlencode( $k ) . '&ids=' . implode( ',', $grupe ) ),
				count( $grupe ), esc_html( self::linksnis( count( $grupe ), 'siuntą', 'siuntas', 'siuntų' ) ) );

			printf( '<button class="pd-btn" data-wcnew="shopup_venipak_shipping_labels" data-ids="%s">Lipdukai 10×15</button>',
				esc_attr( implode( ',', $grupe ) ) );

			$man = self::grupes_manifestas( $grupe );
			if ( $man ) {
				printf( '<a class="pd-btn" target="_blank" rel="noopener" href="%s">Manifestas PDF</a>',
					esc_url( self::veiksmo_url( 'vp_manifestas', 0 ) . '&kodas=' . rawurlencode( $man ) ) );
			}
			echo '</div>';

			echo '<table class="pd-tbl pd-rtbl"><tbody>';
			foreach ( $eil as $e ) {
				printf( '<tr><td class="pd-nr">#%s</td><td>%s</td><td>%s</td><td>%s</td></tr>',
					esc_html( $e['nr'] ), esc_html( $e['kl'] ), esc_html( $e['vez'] ),
					$e['kodas'] ? '<span class="pd-rok">✓ ' . esc_html( $e['kodas'] ) . '</span>'
						: '<span class="pd-rbad">' . esc_html( self::siuntos_klaida( $e['nr'], $grupe ) ) . '</span>' );
			}
			echo '</tbody></table></div>';
		}

		if ( ! empty( $p['vp_misrus'] ) ) {
			echo '<div class="pd-vgrp pd-vmix"><div class="pd-vgrp-h"><b>Mišrūs užsakymai</b>
				<span class="pd-vman">registruojami rankomis</span></div>
				<div class="pd-rwarn" style="margin:0 14px 12px">Šie užsakymai turi prekių iš kelių sandėlių, tad
				fiziškai iškeliauja dviem siuntomis iš skirtingų vietų. Venipak pluginas vienam užsakymui moka
				sukurti tik VIENĄ siuntą, todėl automatiškai jų neregistruojame — kitaip viena dalis atsidurtų
				ne tame manifeste.</div><table class="pd-tbl pd-rtbl"><tbody>';
			foreach ( $p['vp_misrus'] as $id ) {
				$o = wc_get_order( $id ); if ( ! $o ) { continue; }
				$z = '';
				foreach ( self::saltiniai( $o ) as $x ) { $z .= self::zyme( $x ); }
				printf( '<tr><td class="pd-nr">#%s</td><td>%s</td><td>%s</td><td><a class="pd-btn pd-btn-s" href="%s">Atidaryti</a></td></tr>',
					esc_html( $o->get_order_number() ),
					esc_html( trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ) ),
					$z, esc_url( $o->get_edit_order_url() ) );
			}
			echo '</tbody></table></div>';
		}
	}

	/**
	 * Kiek liko iki sandėlio ribos. Grąžina [būsena, tekstas] arba null.
	 * būsena: speji | skuba | praejo
	 */
	protected static function riba( $sandelis ) {
		if ( empty( self::RIBOS[ $sandelis ] ) ) { return null; }
		$laikas = self::RIBOS[ $sandelis ];
		$dabar  = (int) current_time( 'timestamp' );
		$riba   = strtotime( wp_date( 'Y-m-d', $dabar ) . ' ' . $laikas . ':00' );
		$liko   = $riba - $dabar;

		if ( $liko <= 0 ) {
			return array( 'praejo', $laikas . ' · praėjo, keliaus rytoj' );
		}
		$val = (int) floor( $liko / 3600 );
		$min = (int) floor( ( $liko % 3600 ) / 60 );
		$t   = $val ? ( $val . ' val ' . $min . ' min' ) : ( $min . ' min' );
		return array( $liko < 3600 ? 'skuba' : 'speji', $laikas . ' · liko ' . $t );
	}

	protected static function ribos_zyme( $sandelis ) {
		$r = self::riba( $sandelis );
		if ( ! $r ) { return ''; }
		return '<span class="pd-riba pd-riba-' . esc_attr( $r[0] ) . '">' . esc_html( $r[1] ) . '</span>';
	}

	/** Pilnas manifesto numeris, koks atsiras Venipake. */
	protected static function manifesto_numeris( $kodas ) {
		$n = get_option( 'shopup_venipak_shipping_settings' );
		$cid = is_array( $n ) ? ( $n['shopup_venipak_shipping_field_userid'] ?? '' ) : '';
		return $cid . wp_date( 'ymd' ) . $kodas;
	}

	/** Manifesto numeris iš jau užregistruotų grupės siuntų. */
	protected static function grupes_manifestas( $ids ) {
		foreach ( (array) $ids as $id ) {
			$o = wc_get_order( $id );
			if ( ! $o ) { continue; }
			$d = json_decode( (string) $o->get_meta( 'venipak_shipping_order_data' ), true );
			if ( ! empty( $d['manifest'] ) ) { return $d['manifest']; }
		}
		return '';
	}

	/** Venipak klaidos tekstas iš meta — pluginas jį įrašo, bet nerodo (s544). */
	protected static function siuntos_klaida( $nr, $ids ) {
		foreach ( (array) $ids as $id ) {
			$o = wc_get_order( $id );
			if ( ! $o || $o->get_order_number() !== $nr ) { continue; }
			$d = json_decode( (string) $o->get_meta( 'venipak_shipping_order_data' ), true );
			if ( ! empty( $d['error_message'] ) ) { return mb_substr( $d['error_message'], 0, 90 ); }
			if ( 'venipak_pastomatas' === self::vezejas( $o ) && ! $o->get_meta( 'venipak_pickup_point' ) ) {
				return 'nenurodytas paštomatas';
			}
			break;
		}
		return '— nėra';
	}

	protected static function ryt4( $p ) {
		echo '<h2 class="pd-rh2">LP Express</h2>';
		if ( ! $p['lp'] ) { echo '<p class="pd-rnote">LP Express siuntų šioje partijoje nėra.</p>'; return; }

		printf( '<p class="pd-rnote">%d %s. Dydį LP parenka pats pagal svorį — rinktis nereikia.
			Kurjeris atvažiuoja <b>13:00</b>. %s</p>',
			count( $p['lp'] ), esc_html( self::linksnis( count( $p['lp'] ), 'siunta', 'siuntos', 'siuntų' ) ),
			wp_kses_post( self::ribos_zyme( 'lp' ) ) );

		echo '<div class="pd-rwarn" style="margin:0 0 16px">Lipduko formavimas LP sistemoje <b>iškart išsikviečia
			kurjerį</b> — spausdink tik tada, kai siuntos tikrai keliaus šiandien.</div>';

		printf( '<button class="pd-btn pd-btn-p pd-rbig" data-wcnew="woo_lp_print_label" data-ids="%s">Spausdinti LP lipdukus</button>',
			esc_attr( implode( ',', $p['lp'] ) ) );
		printf( '<button class="pd-btn pd-rbig" data-wcnew="woo_lp_print_manifest" data-ids="%s">Kurjeris + manifestas</button>',
			esc_attr( implode( ',', $p['lp'] ) ) );

		// būklė: kodas, svoris, dėžės, ar kurjeris jau kviestas
		echo '<table class="pd-tbl pd-rtbl"><thead><tr><th>Nr.</th><th>Klientas</th><th>Kelias</th>
			<th>Svoris</th><th>Dėžių</th><th>Siuntos kodas</th></tr></thead><tbody>';
		$kviesta = '';
		foreach ( $p['lp'] as $id ) {
			$o = wc_get_order( $id );
			if ( ! $o ) { continue; }
			list( $kodas ) = self::siuntos_kodas( $o );
			list( $g, $be ) = self::lp_svoris( $o );
			$term = $o->get_meta( '_woo_lithuaniapost_lpexpress_terminal_id' );
			$kv   = $o->get_meta( '_woo_lithuaniapost_lpexpress_courier_called_date' );
			if ( $kv ) { $kviesta = $kv; }

			printf( '<tr><td class="pd-nr">#%s</td><td>%s</td><td>%s</td><td class="mono%s">%s</td><td class="mono">%s</td><td>%s</td></tr>',
				esc_html( $o->get_order_number() ),
				esc_html( trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ) ),
				$term ? 'paštomatas' : 'kurjeris',
				$be ? ' pd-rbad' : '',
				$be ? 'trūksta svorio' : esc_html( number_format_i18n( $g ) . ' g' ),
				$term ? '—' : (int) self::pakuociu( $o ),
				$kodas ? '<span class="pd-rok">✓ ' . esc_html( $kodas ) . '</span>' : '<span class="pd-rbad">— nėra</span>' );
		}
		echo '</tbody></table>';

		if ( $kviesta ) {
			printf( '<p class="pd-rnote"><b>Kurjeris jau iškviestas:</b> %s. Antro karto kviesti nereikia.</p>',
				esc_html( is_string( $kviesta ) ? $kviesta : wp_date( 'Y-m-d H:i', (int) $kviesta ) ) );
		}
		echo '<p class="pd-rnote">Dėžių skaičių kurjerio siuntoms nustatai užsakymo skydelyje sąraše —
			LP jį priima kaip <span class="mono">partCount</span>.</p>';
	}

	protected static function ryt5( $p ) {
		echo '<h2 class="pd-rh2">Perduoti tiekėjams</h2>';
		if ( ! $p['ds'] ) { echo '<p class="pd-rnote">Dropship užsakymų šioje partijoje nėra.</p>'; return; }
		// rikiuojam pagal tai, kam liko mažiausiai laiko
		$eile = $p['tiekejai'];
		uksort( $eile, function ( $a, $b ) {
			$ra = self::RIBOS[ $a ] ?? '23:59';
			$rb = self::RIBOS[ $b ] ?? '23:59';
			return strcmp( $ra, $rb );
		} );
		echo '<table class="pd-tbl pd-rtbl"><tbody>';
		foreach ( $eile as $k => $n ) {
			printf( '<tr><td><b>%s</b></td><td>%d %s</td><td>%s</td></tr>',
				esc_html( self::SALTINIAI[ $k ][2] ?? $k ), (int) $n,
				esc_html( self::linksnis( $n, 'užsakymas', 'užsakymai', 'užsakymų' ) ),
				self::ribos_zyme( $k ) );
		}
		echo '</tbody></table>';
		printf( '<a class="pd-btn pd-btn-p pd-rbig" target="_blank" rel="noopener" href="%s">Atidaryti perdavimo ekraną →</a>',
			esc_url( self::veiksmo_url( 'perduoti', 0 ) . '&ids=' . implode( ',', $p['ds'] ) ) );
		echo '<p class="pd-rwarn">Ten pamatysi kiekvieno tiekėjo kortelę su laišku ir lipdukais. Laiškas išeina tik tau paspaudus.</p>';
	}

	protected static function ryt6( $p ) {
		echo '<div class="pd-rdone"><div class="pd-rcheck">✓</div><h2>Rytas uždarytas</h2>
			<p>Prie stalo: lapai A4 ir lipdukai 10×15. Tvarka sutampa — pakuok iš eilės.</p></div>';
		echo '<div class="pd-rgrid">';
		self::ryt_kort( count( $p['av'] ), 'surinkti iš sandėlio', '#2D5F3F' );
		self::ryt_kort( count( $p['vp'] ), 'Venipak lipdukai', '#2B5C8A' );
		self::ryt_kort( count( $p['lp'] ), 'LP lipdukai', '#2B5C8A' );
		self::ryt_kort( count( $p['ds'] ), 'perduota tiekėjams', '#5B3B92' );
		echo '</div>';
		if ( $p['klausimai'] ) {
			printf( '<p class="pd-rwarn">Liko %d %s, kurių eiga nelietė — jie laukia tavo sprendimo. <a href="%s">Atidaryti →</a></p>',
				count( $p['klausimai'] ),
				esc_html( self::linksnis( count( $p['klausimai'] ), 'klausimas', 'klausimai', 'klausimų' ) ),
				esc_url( admin_url( 'admin.php?page=' . self::SLUG . '&eile=klausimai' ) ) );
		}
	}

	protected static function ryt_skriptas() {
		?>
<script>
(function(){
 var f=document.getElementById('pdWcForm');
 [].forEach.call(document.querySelectorAll('[data-wcnew]'),function(b){
  b.addEventListener('click',function(e){
   e.preventDefault();
   var box=document.getElementById('pdWcIds'); box.innerHTML='';
   (b.getAttribute('data-ids')||'').split(',').forEach(function(id){
    if(!id) return;
    ['id[]','post[]'].forEach(function(n){
     var i=document.createElement('input'); i.type='hidden'; i.name=n; i.value=id; box.appendChild(i);
    });
   });
   document.getElementById('pdWcAction').value=b.getAttribute('data-wcnew');
   f.target='_blank'; f.submit();
   b.classList.add('pd-done'); b.textContent='✓ '+b.textContent.replace(/^✓ /,'');
  });
 });
 [].forEach.call(document.querySelectorAll('.pd-rbig[target="_blank"]'),function(a){
  a.addEventListener('click',function(){ a.classList.add('pd-done'); });
 });
})();
</script>
		<?php
	}

	protected static function pranesimas() {
		if ( empty( $_GET['pd_ok'] ) ) { return; }
		$nr = isset( $_GET['pd_nr'] ) ? sanitize_text_field( wp_unslash( $_GET['pd_nr'] ) ) : '';
		$k  = sanitize_key( wp_unslash( $_GET['pd_ok'] ) );
		$t  = array(
			'apmoketa'        => array( 'ok', 'Užsakymas #%s pažymėtas apmokėtu. Prekės nurašytos, klientui išsiųstas patvirtinimas.' ),
			'apmoketa_tyliai' => array( 'ok', 'Užsakymas #%s pažymėtas apmokėtu. Prekės nurašytos. Laiškas klientui NEIŠSIŲSTAS.' ),
			'jau_apmoketa'    => array( 'info', 'Užsakymas #%s jau buvo apmokėtas — niekas nepakeista.' ),
			'apmoketa_klausimas' => array( 'info', 'Užsakymas #%s apmokėtas, bet perkeltas į KLAUSIMUS: %s. Spręsk kortelėje.' ),
			'atsaukta'        => array( 'ok', 'Užsakymas #%s atšauktas. Prekės grąžintos į likutį. Klientui nepranešta.' ),
			'atsaukta_laiskas'=> array( 'ok', 'Užsakymas #%s atšauktas. Prekės grąžintos į likutį. Klientui išsiųstas pranešimas.' ),
			'jau_atsaukta'    => array( 'info', 'Užsakymas #%s jau buvo atšauktas — niekas nepakeista.' ),
			'vp_ok'           => array( 'ok', 'Venipak: siuntos užregistruotos (%s). Manifestas paruoštas.' ),
			'vp_klaida'       => array( 'klaida', 'Venipak nepriėmė: %s' ),
			'eilute_ideta'    => array( 'ok', 'Prekė įtraukta į tiekimo lentelę — parsivešim į AV. %s' ),
			'eilute_isimta'   => array( 'ok', 'Prekė išimta iš tiekimo lentelės — keliaus dropshipu. %s' ),
			'pakuotes'        => array( 'ok', 'Pakuočių skaičius išsaugotas: %s.' ),
			'kl_saltinis'     => array( 'ok', 'Užsakymo #%s šaltinis pakeistas — klausimas išspręstas.' ),
			'kl_laukti'       => array( 'info', 'Užsakymas #%s pažymėtas laukti. Priminimų nebus — grįši pats.' ),
		);
		if ( ! isset( $t[ $k ] ) ) { return; }
		$dalys = explode( '|', $nr, 2 );
		$tekstas = ( 'apmoketa_klausimas' === $k )
			? sprintf( $t[ $k ][1], $dalys[0], $dalys[1] ?? '' )
			: sprintf( $t[ $k ][1], $nr );
		if ( 'apmoketa_klausimas' === $k ) {
			$tekstas .= ' <a href="' . esc_url( admin_url( 'admin.php?page=' . self::SLUG . '&eile=klausimai' ) ) . '">Atidaryti Klausimus</a>';
			printf( '<div class="pd-msg pd-msg-%s">%s<button class="pd-msg-x" onclick="this.parentNode.remove()">✕</button></div>',
				esc_attr( $t[ $k ][0] ), wp_kses( $tekstas, array( 'a' => array( 'href' => true ) ) ) );
			return;
		}
		printf( '<div class="pd-msg pd-msg-%s">%s<button class="pd-msg-x" onclick="this.parentNode.remove()">✕</button></div>',
			esc_attr( $t[ $k ][0] ), esc_html( $tekstas ) );
	}

	protected static function virsus( $f ) {
		?>
		<header class="pd-top">
			<div class="pd-brand">Petshop <span>· užsakymai</span></div>
			<form method="get" class="pd-search">
				<input type="hidden" name="page" value="<?php echo esc_attr( self::SLUG ); ?>">
				<input type="hidden" name="eile" value="visi">
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 14 14"/></svg>
				<input type="search" name="q" id="pdQ" value="<?php echo esc_attr( $f['q'] ); ?>"
					placeholder="Užsakymas, klientas, telefonas, adresas, prekė, siuntos kodas" autocomplete="off">
				<kbd>/</kbd>
			</form>
			<div class="pd-top-r">
				<a class="pd-tbtn pd-go" href="<?php echo esc_url( admin_url( 'admin.php?page=' . self::SLUG . '&view=rytas' ) ); ?>">▶ Rytinė eiga</a>
				<a class="pd-tbtn" href="<?php echo esc_url( admin_url( 'admin.php?page=wc-orders' ) ); ?>">WooCommerce sąrašas</a>
				<?php
				$artimiausia = null;
				foreach ( self::RIBOS as $sk => $lk ) {
					$rz = self::riba( $sk );
					if ( $rz && 'praejo' !== $rz[0] && ( ! $artimiausia || $lk < $artimiausia[1] ) ) {
						$artimiausia = array( $sk, $lk, $rz );
					}
				}
				if ( $artimiausia ) {
					printf( '<span class="pd-tr pd-tr-%s"><b>%s</b>%s</span>',
						esc_attr( $artimiausia[2][0] ),
						esc_html( self::SALTINIAI[ $artimiausia[0] ][1] ?? $artimiausia[0] ),
						esc_html( str_replace( ' · ', ' ', $artimiausia[2][1] ) ) );
				} else {
					echo '<span class="pd-tr pd-tr-praejo">ribos šiandien praėjo · nauji keliaus rytoj</span>';
				}
				?>
				<span class="pd-av"><?php
					global $wpdb;
					$n = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}postmeta WHERE meta_key='_own_stock_qty' AND meta_value>0" );
					echo 'AV sandėlis <b>' . esc_html( $n ) . '</b>';
				?></span>
			</div>
		</header>
		<?php
	}

	protected static function rail( $eile, $c ) {
		echo '<nav class="pd-rail"><div class="pd-rh">Užsakymai</div>';
		foreach ( array( 'nauji', 'neapmoketi', 'laukia', 'paruosta', 'klausimai' ) as $k ) {
			self::rail_punktas( $k, $eile, $c[ $k ] ?? 0, false );
		}
		echo '<div class="pd-sep"></div>';
		foreach ( array( 'issiusti', 'atsaukti', 'visi' ) as $k ) {
			self::rail_punktas( $k, $eile, $c[ $k ] ?? 0, true );
		}
		echo '<div class="pd-ai"><div class="pd-ai-h"><span class="pd-dot"></span>Siūlymai</div>
			<div class="pd-ai-t">Tuščia. Čia rinksis automatiniai siūlymai — kiekvieną tvirtinsi arba atmesi tu.</div></div>';
		echo '</nav>';
	}

	protected static function rail_punktas( $k, $eile, $n, $blankus ) {
		$d = self::EILES[ $k ];
		$a = $k === $eile;
		printf(
			'<a class="pd-q%s%s" href="%s" style="--qc:%s"><i></i>%s<span class="pd-n%s">%s</span></a>',
			$a ? ' on' : '', $blankus ? ' dim' : '',
			esc_url( self::url( array( 'eile' => $k, 'busena' => null ) ) ),
			esc_attr( $d[2] ), esc_html( $d[0] ),
			( $n && ! $blankus ) ? ' hot' : '', esc_html( number_format_i18n( $n ) )
		);
	}

	protected static function juosta( $eile, $f, $kiek ) {
		$d = self::EILES[ $eile ];
		echo '<div class="pd-bar"><div class="pd-h1">' . esc_html( $d[0] );
		if ( $d[1] ) { echo '<em>' . esc_html( $d[1] ) . '</em>'; }
		echo '</div>';

		echo '<div class="pd-filters">';

		// Vykdymas
		$vopt = array( '' => 'Vykdymas: visi', 'sava' => 'Sava (AV)', 'dropship' => 'Dropship', 'misrus' => 'Mišrūs' );
		foreach ( self::SALTINIAI as $k => $v ) {
			if ( 'av' === $k ) { continue; }
			$vopt[ $k ] = '— ' . $v[2];
		}
		self::select( 'vykdymas', $vopt, $f['vykdymas'] );

		// Pristatymas
		self::select( 'vezejas', array(
			''                   => 'Pristatymas: visi',
			'venipak_kurjeris'   => 'Venipak kurjeris',
			'venipak_pastomatas' => 'Venipak paštomatas',
			'lp'                 => 'LP Express',
		), $f['vezejas'] );

		// Data
		self::select( 'data', array(
			''           => 'Data: visos',
			'siandien'   => 'Šiandien',
			'vakar'      => 'Vakar',
			'savaite'    => 'Šią savaitę',
			'menuo'      => 'Šį mėnesį',
			'praeitas'   => 'Praėjusį mėnesį',
			'intervalas' => 'Intervalas…',
		), $f['data'] );

		if ( 'intervalas' === $f['data'] ) {
			echo '<form method="get" class="pd-range"><input type="hidden" name="page" value="' . esc_attr( self::SLUG ) . '">
				<input type="hidden" name="eile" value="' . esc_attr( $eile ) . '">
				<input type="hidden" name="data" value="intervalas">
				<input type="date" name="nuo" value="' . esc_attr( $f['nuo'] ) . '">
				<span>–</span><input type="date" name="iki" value="' . esc_attr( $f['iki'] ) . '">
				<button class="pd-btn">Rodyti</button></form>';
		}

		self::select( 'busena', array(
			''         => 'Būsena: visos',
			'nauji'    => 'Nauji',
			'paruosta' => 'Paruošta siųsti',
			'kelyje'   => 'Kelyje',
			'ivykdyti' => 'Įvykdyti',
			'atsaukti' => 'Atšaukti',
		), $f['busena'] );

		// Mokėjimas
		self::select( 'mokejimas', array(
			''           => 'Mokėjimas: visi',
			'apmoketa'   => 'Apmokėta',
			'neapmoketa' => 'Neapmokėta',
			'paysera'    => 'Paysera',
			'bacs'       => 'Pavedimas',
		), $f['mokejimas'] );

		// Laukiantys
		self::select( 'amzius', array(
			''   => 'Laukiantys: visi',
			'd2' => 'Laukia 2+ d.',
			'd3' => 'Laukia 3+ d.',
			'd5' => 'Laukia 5+ d.',
		), $f['amzius'] );

		$aktyvus = array_filter( array( $f['vykdymas'], $f['vezejas'], $f['data'], $f['busena'], $f['q'], $f['mokejimas'], $f['amzius'], $f['nr'], $f['klientas'], $f['tel'], $f['adresas'] ) );
		if ( $aktyvus ) {
			echo '<a class="pd-clear" href="' . esc_url( admin_url( 'admin.php?page=' . self::SLUG . '&eile=' . $eile ) ) . '">Išvalyti filtrus</a>';
		}
		echo '</div>';

		/* ANTRA EILUTĖ — atskiri paieškos laukai (Raimio filtrai). */
		echo '<form method="get" class="pd-fields">';
		printf( '<input type="hidden" name="page" value="%s"><input type="hidden" name="eile" value="%s">',
			esc_attr( self::SLUG ), esc_attr( $eile ) );
		foreach ( array( 'vykdymas', 'vezejas', 'data', 'nuo', 'iki', 'busena', 'mokejimas', 'amzius' ) as $k ) {
			if ( '' !== $f[ $k ] ) { printf( '<input type="hidden" name="%s" value="%s">', esc_attr( $k ), esc_attr( $f[ $k ] ) ); }
		}
		printf( '<input type="text" name="nr" value="%s" placeholder="Užsak. Nr." size="9">', esc_attr( $f['nr'] ) );
		printf( '<input type="text" name="klientas" value="%s" placeholder="Klientas / el. paštas / įmonė" size="24">', esc_attr( $f['klientas'] ) );
		printf( '<input type="text" name="tel" value="%s" placeholder="Telefonas" size="12">', esc_attr( $f['tel'] ) );
		printf( '<input type="text" name="adresas" value="%s" placeholder="Adresas / miestas / pašto kodas" size="24">', esc_attr( $f['adresas'] ) );
		echo '<button class="pd-btn">Filtruoti</button></form>';

		if ( 'laukia' === $eile && class_exists( 'Petshop_AV_Tiekimas' ) ) {
			$sk = Petshop_AV_Tiekimas::laukianciu_skaiciai();
			printf( '<a class="pd-btn%s" href="%s">%s</a>',
				$sk['gali'] ? ' pd-btn-p' : '',
				esc_url( admin_url( 'admin.php?page=ps-tiekimas&b=laukia' ) ),
				$sk['gali']
					? esc_html( sprintf( 'Atnaujinti likučius · %d gali judėti', $sk['gali'] ) )
					: 'Atnaujinti likučius' );
		}
		echo '<div class="pd-bar-r"><span class="pd-count">' . esc_html( $kiek ) . ' ' .
			esc_html( self::linksnis( $kiek, 'užsakymas', 'užsakymai', 'užsakymų' ) ) . '</span>';
		if ( $kiek ) { echo '<button class="pd-btn" id="pdAll">Žymėti visus</button>'; }
		echo '</div></div>';
	}

	protected static function linksnis( $n, $v, $d, $g ) {
		$n = abs( (int) $n ); $p = $n % 100; $l = $n % 10;
		if ( 1 === $l && 11 !== $p ) { return $v; }
		if ( $l >= 2 && $l <= 9 && ( $p < 11 || $p > 19 ) ) { return $d; }
		return $g;
	}

	protected static function select( $vardas, $opcijos, $reiksme ) {
		echo '<select class="pd-sel" data-k="' . esc_attr( $vardas ) . '"' . ( $reiksme ? ' data-on="1"' : '' ) . '>';
		foreach ( $opcijos as $k => $v ) {
			printf( '<option value="%s"%s>%s</option>', esc_attr( $k ), selected( $k, $reiksme, false ), esc_html( $v ) );
		}
		echo '</select>';
	}

	/** Klausimai rodomi kortelėmis su sprendimo mygtukais, ne eilute sąraše. */
	protected static function klausimu_korteles( $eilutes ) {
		foreach ( $eilutes as $row ) {
			$o      = $row['o'];
			$prob   = self::klausimo_eilutes( $o );
			$laukia = $o->get_meta( '_ps_klaus_laukti' );

			printf( '<div class="pd-kcard%s"><div class="pd-kh"><b>#%s</b><span>%s · %s</span>%s%s</div>',
				$laukia ? ' pd-kdim' : '',
				esc_html( $o->get_order_number() ),
				esc_html( trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ) ),
				wp_kses_post( $o->get_formatted_order_total() ),
				$o->is_paid() ? '<span class="pd-kpaid">apmokėta</span>' : '<span class="pd-kunpaid">neapmokėta</span>',
				$laukia ? '<span class="pd-kwait">laukiama nuo ' . esc_html( mysql2date( 'm-d', $laukia ) ) . '</span>' : '' );

			printf( '<div class="pd-kwhy">▲ %s</div>', esc_html( $row['klausimas'] ) );

			if ( 0 === strpos( $row['klausimas'], 'Klientas atsisako' ) ) {
				printf( '<div class="pd-kline"><div class="pd-kprek"><b>Gauta %s</b><span>%s</span></div><div class="pd-kbtns"><button type="button" class="pd-btn pd-btn-s" data-wc1="wcdn_print_creditnote" data-oid="%d">Kreditinė</button><span class="pd-knone">pinigai — rankinis grąžinimas (Paysera)</span></div></div>',
					esc_html( mysql2date( 'Y-m-d H:i', $o->get_meta( '_ps_withdrawal' ) ) ),
					esc_html( $o->get_meta( '_ps_withdrawal_reason' ) ?: 'priežastis nenurodyta' ),
					(int) $o->get_id() );
			}

			if ( $prob ) {
				foreach ( $prob as $p ) {
					printf( '<div class="pd-kline"><div class="pd-kprek"><b>%s</b><span>reikia %d · AV likutis %d%s</span></div><div class="pd-kbtns">',
						esc_html( $p['pav'] ), (int) $p['reikia'], (int) $p['turi'],
						$p['tiekv'] ? ' · ' . esc_html( $p['tiekv'] ) . ' turi' : '' );

					if ( $p['tiek'] ) {
						printf( '<a class="pd-btn pd-btn-p pd-btn-s" href="%s">Siųsti iš %s</a>',
							esc_url( self::veiksmo_url( 'klaus', $o->get_id() ) . '&t=siusti&iid=' . (int) $p['iid'] . '&src=' . rawurlencode( $p['tiek'] ) ),
							esc_html( self::SALTINIAI[ $p['tiek'] ][1] ?? mb_strtoupper( $p['tiek'] ) ) );
						printf( '<a class="pd-btn pd-btn-s" href="%s">Parsivežti į AV</a>',
							esc_url( self::veiksmo_url( 'klaus', $o->get_id() ) . '&t=parsivezti&iid=' . (int) $p['iid'] . '&src=' . rawurlencode( $p['tiek'] ) ) );
					} else {
						echo '<span class="pd-knone">tiekėjo, turinčio šią prekę, nėra</span>';
					}
					echo '</div></div>';
				}
			}

			echo '<div class="pd-kf">';
			if ( ! $laukia ) {
				printf( '<a class="pd-btn pd-btn-s" href="%s">Laukti</a>',
					esc_url( self::veiksmo_url( 'klaus', $o->get_id() ) . '&t=laukti' ) );
			}
			$vs = self::veiksmai( $o, $row );
			foreach ( $vs as $x ) {
				if ( 'atsaukti' !== $x['id'] ) { continue; }
				printf( '<a class="pd-btn pd-btn-s pd-btn-pav" href="%s"%s>%s</a>',
					esc_url( $x['url'] ),
					empty( $x['d'] ) ? '' : ' data-d="' . esc_attr( wp_json_encode( $x['d'] ) ) . '"',
					esc_html( $x['t'] ) );
			}
			printf( '<a class="pd-btn pd-btn-s" href="%s">WooCommerce</a>', esc_url( $o->get_edit_order_url() ) );
			echo '</div></div>';
		}
		echo '<div class="pd-khint">Kiekvienas mygtukas atlieka visą grandinę: pakeičia šaltinį, įrašo į istoriją
			ir grąžina užsakymą į darbo eilę. „Laukti“ nieko neprimena — pažymi ir tiek.</div>';
	}

	protected static function lentele( $eilutes, $statusai ) {
		if ( ! $eilutes ) {
			echo '<div class="pd-empty"><b>Nieko nėra</b><span>Čia tuščia — arba viskas padaryta, arba filtrai per siauri.</span></div>';
			return;
		}
		echo '<div class="pd-wrap"><table class="pd-tbl"><thead><tr>
			<th class="pd-stripe"></th><th class="pd-cb"><input type="checkbox" id="pdAllCb"></th>
			<th>Užsakymas</th><th>Klientas</th><th>Ką pirko</th><th>Vykdymas</th>
			<th class="pd-r">Suma</th><th>Pristatymas</th><th>Būsena</th><th></th></tr></thead><tbody>';

		$i = 0;
		foreach ( $eilutes as $row ) {
			$o  = $row['o'];
			$id = $o->get_id();
			$st = $o->get_status();
			$sp = self::SPALVOS[ $st ] ?? array( '#F1F1EE', '#6B7269' );
			$juosta = self::juostos_spalva( $row );

			list( $vyk, $siuntu ) = self::vykdymas( $o );
			list( $kodas, $pak )  = self::siuntos_kodas( $o );
			$sal = self::saltiniai( $o );

			$pastaba = '';
			foreach ( $o->get_customer_note() ? array( $o->get_customer_note() ) : array() as $n ) { $pastaba = $n; }

			$vardas = trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() );
			if ( ! $vardas ) { $vardas = $o->get_billing_email() ? $o->get_billing_email() : '—'; }

			printf( '<tr data-i="%d" data-id="%d" data-json="%s">', $i, $id,
				esc_attr( wp_json_encode( self::skydelio_duomenys( $o, $row ) ) ) );

			echo '<td class="pd-stripe"><div style="background:' . esc_attr( $juosta ) . '"></div></td>';
			echo '<td class="pd-cb"><input type="checkbox" class="pd-row-cb" value="' . esc_attr( $id ) . '"></td>';

			printf( '<td><div class="pd-nr">#%s</div><div class="pd-sub">%s</div></td>',
				esc_html( $o->get_order_number() ),
				esc_html( self::laikas( $o->get_date_created() ) ) );

			printf( '<td><div class="pd-cust" title="%s">%s</div><div class="pd-sub">%s</div></td>',
				esc_attr( $vardas . ( $o->get_billing_email() ? ' · ' . $o->get_billing_email() : '' ) ),
				esc_html( $vardas ),
				esc_html( $o->get_billing_city() ? $o->get_billing_city() : '—' ) );

			echo '<td><div class="pd-items">';
			// PREKĖS — PILNAIS pavadinimais su miniatiūromis. Pakuotojui tai darbo
			// objektas: „Gemon mini adult 3 kg" ir „…15 kg" turi skirtis iš pirmo žvilgsnio.
			foreach ( $o->get_items() as $it ) {
				$p   = $it->get_product();
				$img = $p ? get_the_post_thumbnail_url( $p->get_id(), 'thumbnail' ) : '';
				$ls  = self::eilutes_saltinis( $it );
				echo '<div class="pd-item">'
					. ( $img ? '<img class="pd-thumb" loading="lazy" src="' . esc_url( $img ) . '" alt="">' : '<span class="pd-thumb pd-thumb-e"></span>' )
					. ( $ls ? self::zyme( $ls ) : '' )
					. '<span>' . esc_html( $it->get_quantity() . '× ' . $it->get_name() ) . '</span></div>';
			}
			echo '</div>';
			if ( $row['klausimas'] ) { echo '<div class="pd-note pd-red">▲ ' . esc_html( $row['klausimas'] ) . '</div>'; }
			// KLIENTO PASTABA — PILNA, nekarpoma. Raimis: „kartais labai svarbu".
			if ( $pastaba ) { echo '<div class="pd-note pd-cnote">✎ ' . esc_html( $pastaba ) . '</div>'; }
			echo '</td>';

			echo '<td><div class="pd-exec">' . esc_html( $vyk ? $vyk : '—' );
			if ( 'MIŠRUS' === $vyk ) { echo '<small>' . esc_html( $siuntu ) . ' siuntos</small>'; }
			// riba rodoma tik ten, kur darbas dar nepadarytas
			// riba prasminga tik ŠIANDIENOS užsakymui — senam „keliaus rytoj" jau 17-a diena būtų melas
			if ( 'nauji' === $row['eile'] && $o->get_date_created()
				&& wp_date( 'Y-m-d', $o->get_date_created()->getTimestamp() ) === wp_date( 'Y-m-d' ) ) {
				foreach ( $sal as $ts ) {
					if ( 'av' !== $ts && $o->get_meta( '_ps_dropship_sent' ) ) { continue; }
					$rz = self::riba( $ts );
					if ( $rz ) { printf( '<small class="pd-riba-%s">%s %s</small>',
						esc_attr( $rz[0] ), esc_html( self::SALTINIAI[ $ts ][1] ?? $ts ), esc_html( $rz[1] ) ); }
				}
			}
			echo '</div></td>';

			printf( '<td class="pd-sum pd-r">%s<span class="pd-pay %s">%s</span></td>',
				wp_kses_post( $o->get_formatted_order_total() ),
				$o->is_paid() ? 'ok' : 'no',
				$o->is_paid() ? 'apmokėta' : 'neapmokėta' );

			echo '<td class="pd-ship"><b>' . esc_html( self::vezejo_vardas( $o ) ) . '</b>';
			if ( $kodas ) {
				echo '<span class="pd-track">' . esc_html( $kodas ) . ( $pak > 1 ? ' · ' . $pak . ' lipdukai' : '' ) . '</span>';
			}
			echo '</td>';

			$amz = '';
			$skd = $o->get_date_created();
			if ( $skd && ( in_array( $row['eile'], array( 'nauji', 'neapmoketi', 'laukia' ), true ) || $row['klausimas'] ) ) {
				$dienu = (int) floor( ( time() - $skd->getTimestamp() ) / DAY_IN_SECONDS );
				if ( 1 === $dienu ) { $amz = '<span class="pd-age">nuo vakar</span>'; }
				elseif ( $dienu >= 2 ) {
					$amz = '<span class="pd-age ' . ( $dienu >= 5 ? 'pd-age-r' : 'pd-age-w' ) . '">laukia ' . $dienu . ' d.</span>';
				}
			}
			printf( '<td><span class="pd-pill" style="background:%s;color:%s">%s</span>%s</td>',
				esc_attr( $sp[0] ), esc_attr( $sp[1] ),
				esc_html( $statusai[ 'wc-' . $st ] ?? $st ), $amz );

			echo '<td class="pd-act">';
			self::veiksmas( $o, $row );
			echo '</td></tr>';
			$i++;
		}
		echo '</tbody></table></div>';
	}

	/** Kairės briaunos spalva pagal eilę. */
	protected static function juostos_spalva( $row ) {
		if ( ! empty( $row['klausimas'] ) ) { return self::EILES['klausimai'][2]; }
		$e = isset( $row['eile'] ) ? $row['eile'] : '';
		if ( isset( self::EILES[ $e ] ) ) { return self::EILES[ $e ][2]; }
		return '#9AA39C';
	}

	protected static function vezejo_vardas( $o ) {
		$v = self::vezejas( $o );
		$m = array(
			'venipak_kurjeris'   => 'Venipak kurjeris',
			'venipak_pastomatas' => 'Venipak paštomatas',
			'lp'                 => 'LP Express',
		);
		return $m[ $v ] ?? ( $o->get_shipping_method() ? $o->get_shipping_method() : '—' );
	}

	/** Vienas kitas veiksmas pagal eilę. */
	protected static function veiksmas( $o, $row ) {
		$vs = self::veiksmai( $o, $row );
		$p  = $vs[0];
		if ( $p['url'] ) {
			printf( '<a class="pd-btn pd-btn-p pd-btn-s" href="%s"%s>%s</a>',
				esc_url( $p['url'] ),
				empty( $p['d'] ) ? '' : ' data-d="' . esc_attr( wp_json_encode( $p['d'] ) ) . '"',
				esc_html( $p['t'] ) );
		} elseif ( ! empty( $p['wc'] ) ) {
			printf( '<button class="pd-btn pd-btn-p pd-btn-s" data-wc1="%s" data-oid="%d">%s</button>',
				esc_attr( $p['wc'] ), (int) $o->get_id(), esc_html( $p['t'] ) );
		} else {
			printf( '<button class="pd-btn pd-btn-p pd-btn-s" data-act="%s">%s</button>',
				esc_attr( $p['id'] ), esc_html( $p['t'] ) );
		}
		printf( '<a class="pd-more" href="%s" title="Atidaryti WooCommerce">⋯</a>',
			esc_url( $o->get_edit_order_url() ) );
	}

	protected static function laikas( $d ) {
		if ( ! $d ) { return '—'; }
		$ts  = $d->getTimestamp();
		$now = current_time( 'timestamp' );
		$td  = wp_date( 'Y-m-d', $now );
		$dd  = wp_date( 'Y-m-d', $ts );
		if ( $dd === $td ) { return 'šiandien ' . wp_date( 'H:i', $ts ); }
		if ( $dd === wp_date( 'Y-m-d', $now - DAY_IN_SECONDS ) ) { return 'vakar ' . wp_date( 'H:i', $ts ); }
		return wp_date( 'm-d H:i', $ts );
	}

	/** Duomenys skydeliui — įdedami į eilutę, kad nereikėtų AJAX. */
	protected static function skydelio_duomenys( $o, $row ) {
		$items = array();
		foreach ( $o->get_items() as $iid => $it ) {
			$pid = $it->get_product_id();
			$s   = self::eilutes_saltinis( $it );
			$inf = '';
			if ( 'av' === $s && $pid ) {
				$sp  = self::sprendimas( $pid, $it->get_quantity() );
				$inf = 'AV likutis ' . ( isset( $sp['av_qty'] ) ? (int) $sp['av_qty'] : 0 );
				if ( class_exists( 'Petshop_AV_Expiry' ) ) {
					$dt = Petshop_AV_Expiry::data( $pid );
					if ( $dt ) { $inf .= ' · galioja ' . $dt; }
					$pb = Petshop_AV_Expiry::pastaba( $pid );
					if ( $pb ) { $inf .= ' · ✎ ' . $pb; }
				}
			} elseif ( $s ) {
				$inf = self::SALTINIAI[ $s ][2] ?? $s;
				$inf = 'dropship — ' . $inf;
			}
			// Tiekimo mygtukas — tik tiekėjo eilutėms mišriame ar dropship užsakyme
			$tiek = null;
			if ( $s && 'av' !== $s && class_exists( 'Petshop_AV_Tiekimas' ) ) {
				$b = Petshop_AV_Tiekimas::eilutes_bukle( $o->get_id(), $iid );
				if ( $b ) {
					$tiek = array(
						'yra'    => 1,
						'busena' => $b->busena,
						'tekstas'=> 'gauta' === $b->busena
							? 'gauta iš partijos #' . (int) $b->partija_id
							: ( 'uzsakyta' === $b->busena
								? 'užsakyta · partija #' . (int) $b->partija_id
								: 'tiekimo lentelėje · partija #' . (int) $b->partija_id ),
						'url'    => 'kaupiama' === $b->busena
							? Petshop_AV_Tiekimas::eilutes_url( $o->get_id(), $iid, 'istrinti', self::url() ) : '',
						'mygtukas' => 'Išimti',
					);
				} else {
					$tiek = array(
						'yra'      => 0,
						'url'      => Petshop_AV_Tiekimas::eilutes_url( $o->get_id(), $iid, 'ideti', self::url() ),
						'mygtukas' => 'Į tiekimo lentelę',
						'tekstas'  => '',
					);
				}
			}

			$items[] = array(
				'q' => $it->get_quantity(),
				'n' => $it->get_name(),
				's' => $s,
				'i' => $inf,
				'p' => strip_tags( wc_price( $it->get_total() ) ),
				'tiek' => $tiek,
			);
		}
		list( $kodas, $pak ) = self::siuntos_kodas( $o );
		$adr = $o->get_formatted_shipping_address();
		if ( ! $adr ) { $adr = $o->get_formatted_billing_address(); }

		$uzs = 0; $pries = '';
		$mail = $o->get_billing_email();
		if ( $mail ) {
			global $wpdb;
			$uzs = (int) $wpdb->get_var( $wpdb->prepare(
				"SELECT COUNT(*) FROM {$wpdb->prefix}wc_orders
				 WHERE type='shop_order' AND billing_email=%s
				   AND status IN ('wc-processing','wc-completed','wc-lp-delivered','wc-lp-on-the-way')",
				$mail ) );
			$pries = (string) $wpdb->get_var( $wpdb->prepare(
				"SELECT date_created_gmt FROM {$wpdb->prefix}wc_orders
				 WHERE type='shop_order' AND billing_email=%s AND id<>%d
				   AND status IN ('wc-processing','wc-completed','wc-lp-delivered','wc-lp-on-the-way')
				 ORDER BY id DESC LIMIT 1",
				$mail, $o->get_id() ) );
			if ( $pries ) { $pries = wp_date( 'Y-m-d', strtotime( $pries . ' UTC' ) ); }
		}

		return array(
			'id'      => $o->get_id(),
			'nr'      => $o->get_order_number(),
			'st'      => wc_get_order_statuses()[ 'wc-' . $o->get_status() ] ?? $o->get_status(),
			'laikas'  => wp_date( 'Y-m-d H:i', $o->get_date_created() ? $o->get_date_created()->getTimestamp() : 0 ),
			'mok'     => $o->get_payment_method_title(),
			'apmok'   => $o->is_paid() ? 1 : 0,
			'saskaita'=> $o->get_meta( '_petshop_avpn_number' ) ? $o->get_meta( '_petshop_avpn_number' ) : $o->get_meta( '_wcdn_invoice_number' ),
			'vardas'  => trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ),
			'tel'     => $o->get_billing_phone(),
			'mail'    => $o->get_billing_email(),
			'adresas' => wp_strip_all_tags( str_replace( '<br/>', ', ', $adr ) ),
			'items'   => $items,
			'suma'    => strip_tags( $o->get_formatted_order_total() ),
			'siunta'  => strip_tags( $o->get_shipping_total() > 0 ? wc_price( $o->get_shipping_total() ) : 'nemokamas' ),
			'vezejas' => self::vezejo_vardas( $o ),
			'vieta'   => $o->get_meta( 'venipak_pickup_point' ),
			'kodas'   => $kodas,
			'pak'     => $pak,
			'vykdymas'=> self::vykdymas( $o )[0],
			'pastaba' => $o->get_customer_note(),
			'klausimas' => $row['klausimas'],
			'uzsakymu'=> $uzs,
			'pries'   => $pries,
			'veiksmai'=> self::veiksmai( $o, $row ),
			'pak'     => self::reikia_pakuociu( $o ) ? array(
				'kiek' => self::pakuociu( $o ),
				'url'  => self::veiksmo_url( 'pakuotes', $o->get_id() ),
				'lp'   => ( 'lp' === self::vezejas( $o ) ) ? 1 : 0,
			) : null,
			'lp_info' => ( 'lp' === self::vezejas( $o ) ) ? self::lp_svoris( $o ) : null,
			'edit'    => $o->get_edit_order_url(),
		);
	}

	protected static function skydelis() {
		?>
		<aside class="pd-peek" id="pdPeek" aria-hidden="true">
			<div class="pd-peek-h">
				<div class="pd-peek-r1"><h2 id="pkNr"></h2><span class="pd-pill" id="pkSt"></span>
				<button class="pd-x" id="pkX" aria-label="Uždaryti">✕</button></div>
				<div class="pd-sub" id="pkSub"></div>
			</div>
			<div class="pd-peek-b" id="pkBody"></div>
			<div class="pd-peek-f">
				<span id="pkActs"></span>
				<a class="pd-btn" id="pkEdit" href="#">WooCommerce</a>
			</div>
		</aside>
		<?php
	}

	protected static function dialogas() {
		?>
		<div class="pd-dscrim" id="pdDScrim"></div>
		<div class="pd-dlg" id="pdDlg" role="dialog" aria-modal="true">
			<h3 id="pdDlgA"></h3>
			<p id="pdDlgT"></p>
			<label class="pd-dopt" id="pdDlgOptW"><input type="checkbox" id="pdDlgOpt"><span id="pdDlgOptT"></span></label>
			<div class="pd-dlg-f">
				<button class="pd-btn" id="pdDlgNo">Atsisakyti</button>
				<button class="pd-btn pd-btn-p" id="pdDlgYes">Patvirtinti</button>
			</div>
		</div>
		<?php
	}

	protected static function bulk() {
		?>
		<div class="pd-bulk" id="pdBulk">
			<span class="pd-bcnt" id="pdBcnt">Pažymėta 0</span>
			<button class="pd-btn" data-ba="<?php echo esc_attr( self::veiksmo_url( 'lapai', 0 ) ); ?>">Surinkimo lapai</button>
			<button class="pd-btn" data-ba="<?php echo esc_attr( self::veiksmo_url( 'perduoti', 0 ) ); ?>">Perduoti tiekėjams</button>
			<span class="pd-bsep"></span>
			<button class="pd-btn" data-wc="shopup_venipak_shipping_dispatch">Venipak registruoti</button>
			<button class="pd-btn" data-wc="shopup_venipak_shipping_labels">Venipak lipdukai</button>
			<span class="pd-bsep"></span>
			<button class="pd-btn" data-wc="woo_lp_print_label">LP lipdukai</button>
			<button class="pd-btn" data-wc="woo_lp_print_manifest">LP kurjeris + manifestas</button>
			<span class="pd-bsep"></span>
			<button class="pd-btn" data-wc="wcdn_print_invoice">Sąskaitos</button>
			<button type="button" class="pd-btn" id="pdClr">Atžymėti</button>
		</div>
		<?php
		self::wc_forma();
	}

	/** Paslėpta forma WooCommerce masiniams veiksmams (lipdukai, sąskaitos). */
	protected static function wc_forma() {
		?>
		<form id="pdWcForm" method="post" style="display:none"
			action="<?php echo esc_url( admin_url( 'admin.php?page=wc-orders' ) ); ?>">
			<?php wp_nonce_field( 'bulk-orders' ); ?>
			<input type="hidden" name="action" id="pdWcAction" value="">
			<input type="hidden" name="action2" value="-1">
			<div id="pdWcIds"></div>
		</form>
		<?php
	}

	/* ============================ STILIUS ============================ */

	protected static function stilius() {
		?>
<style>
.pd{--paper:#FAFAF8;--card:#fff;--rail:#1C2320;--rail2:#28312C;--rink:#C8D0C9;--rdim:#7E8A82;
 --ink:#1A1D1B;--ink2:#5E6661;--ink3:#8A918C;--line:#E4E4DE;--line2:#EFEFEA;
 --green:#2D5F3F;--greend:#234B32;--greent:#E9F1EA;--red:#98262A;--r:6px;--row:38px;
 position:fixed;top:32px;left:0;right:0;bottom:0;display:flex;flex-direction:column;
 background:var(--paper);color:var(--ink);font-family:"IBM Plex Sans",-apple-system,"Segoe UI",Roboto,sans-serif;
 font-size:14.5px;line-height:1.45;-webkit-font-smoothing:antialiased}
.pd *{box-sizing:border-box}
.pd button,.pd input,.pd select{font:inherit}
.pd :focus-visible{outline:2px solid var(--green);outline-offset:2px}

.pd-top{height:44px;background:var(--rail);display:flex;align-items:center;gap:14px;padding:0 12px 0 14px;color:var(--rink);flex:0 0 44px}
.pd-brand{font-weight:600;font-size:13px;color:#fff;white-space:nowrap}
.pd-brand span{color:var(--rdim);font-weight:400}
.pd-search{flex:0 1 400px;display:flex;align-items:center;gap:8px;height:28px;padding:0 10px;
 background:var(--rail2);border:1px solid #37413B;border-radius:var(--r);color:var(--rdim)}
.pd-search input[type=search]{flex:1;background:none;border:0;color:#fff;font-size:12.5px;outline:none;min-width:0}
.pd-search input::placeholder{color:var(--rdim)}
.pd kbd{font-family:"IBM Plex Mono",monospace;font-size:10.5px;padding:1px 5px;border-radius:4px;
 background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.14);color:var(--rink)}
.pd-top-r{margin-left:auto;display:flex;align-items:center;gap:12px;font-size:12px;color:var(--rdim)}
.pd-av b{color:#fff;font-weight:500}
.pd-tbtn{height:28px;padding:0 11px;border:1px solid #37413B;background:var(--rail2);border-radius:var(--r);
 color:var(--rink);font-size:12px;display:inline-flex;align-items:center;text-decoration:none}
.pd-tbtn:hover{border-color:#4A554E;color:#fff}
.pd-go{background:var(--green);border-color:var(--green);color:#fff;font-weight:500}
.pd-go:hover{background:#357049;border-color:#357049;color:#fff}

.pd-body{flex:1;display:grid;grid-template-columns:216px minmax(0,1fr);min-height:0}
.pd-rail{background:var(--rail);display:flex;flex-direction:column;overflow:auto}
.pd-rh{padding:13px 14px 5px;font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;color:var(--rdim)}
.pd-q{display:grid;grid-template-columns:3px 1fr auto;align-items:center;gap:10px;padding-right:12px;height:33px;
 color:var(--rink);font-size:13px;text-decoration:none}
.pd-q i{display:block;height:18px;border-radius:0 2px 2px 0;background:transparent}
.pd-q:hover{background:rgba(255,255,255,.05);color:var(--rink)}
.pd-q.on{background:rgba(255,255,255,.09);color:#fff;font-weight:500}
.pd-q.on i{background:var(--qc,#fff)}
.pd-q.dim{color:var(--rdim)}
.pd-n{font-family:"IBM Plex Mono",monospace;font-size:12px;color:var(--rdim)}
.pd-q.on .pd-n{color:#fff}
.pd-n.hot{background:var(--qc);color:#101512;padding:1px 6px;border-radius:9px;font-weight:600}
.pd-sep{height:1px;background:rgba(255,255,255,.09);margin:9px 12px}
.pd-ai{margin-top:auto;padding:12px;border-top:1px solid rgba(255,255,255,.09)}
.pd-ai-h{display:flex;align-items:center;gap:7px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--rdim);margin-bottom:7px}
.pd-dot{width:6px;height:6px;border-radius:50%;background:#4C5A52}
.pd-ai-t{font-size:11.5px;line-height:1.5;color:var(--rdim)}

.pd-main{display:flex;flex-direction:column;min-width:0;overflow:hidden}
.pd-bar{display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid var(--line);flex-wrap:wrap;flex:0 0 auto}
.pd-h1{font-size:15px;font-weight:600;letter-spacing:-.01em}
.pd-h1 em{font-style:normal;color:var(--ink3);font-weight:400;margin-left:8px;font-size:12.5px}
.pd-filters{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-left:6px}
.pd-sel{height:28px;border:1px solid var(--line);background:var(--card);border-radius:var(--r);
 font-size:12.5px;color:var(--ink2);padding:0 6px;cursor:pointer;max-width:210px}
.pd-sel[data-on="1"]{background:var(--ink);border-color:var(--ink);color:#fff}
.pd-sel option{background:#fff;color:#1C201D}
.pd-range{display:flex;gap:5px;align-items:center;font-size:12px;color:var(--ink3)}
.pd-range input{height:28px;border:1px solid var(--line);border-radius:var(--r);padding:0 7px;font-size:12.5px}
.pd-clear{font-size:12px;color:var(--ink3);text-decoration:underline}
.pd-bar-r{margin-left:auto;display:flex;gap:10px;align-items:center}
.pd-count{font-size:12px;color:var(--ink3)}
.pd-btn{height:28px;padding:0 11px;border:1px solid var(--line);background:var(--card);border-radius:var(--r);
 font-size:12.5px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;color:var(--ink2);
 white-space:nowrap;text-decoration:none}
.pd-btn:hover{border-color:#CFCFC7;color:var(--ink)}
.pd-btn-p{background:var(--green);border-color:var(--green);color:#fff;font-weight:500}
.pd-btn-p:hover{background:var(--greend);border-color:var(--greend);color:#fff}
.pd-btn-s{height:25px;padding:0 9px;font-size:12px}

.pd-fields{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:6px 18px 8px;border-bottom:1px solid var(--line2)}
.pd-fields input[type=text]{height:26px;padding:0 8px;border:1px solid var(--line);border-radius:var(--r);font-size:12.5px;background:var(--card)}
.pd-wrap{flex:1;overflow:auto;padding-bottom:80px}
.pd-tbl{width:100%;border-collapse:collapse}
.pd-tbl thead th{position:sticky;top:0;z-index:2;background:var(--paper);text-align:left;
 font-size:10.5px;letter-spacing:.07em;text-transform:uppercase;color:var(--ink3);font-weight:500;
 padding:7px 10px;border-bottom:1px solid var(--line);white-space:nowrap}
.pd-tbl th.pd-r,.pd-tbl td.pd-r{text-align:right}
.pd-tbl tbody tr{border-bottom:1px solid var(--line2);min-height:var(--row);cursor:pointer}
.pd-tbl tbody tr:hover{background:#F4F4F0}
.pd-tbl tbody tr.sel{background:var(--greent)}
.pd-tbl tbody tr.cur{box-shadow:inset 2px 0 0 var(--ink),inset -2px 0 0 var(--ink)}
.pd-tbl td{padding:4px 8px;vertical-align:middle}
td.pd-stripe,th.pd-stripe{width:3px;padding:0;height:inherit}
td.pd-stripe div{width:3px;height:100%;min-height:var(--row)}
td.pd-cb,th.pd-cb{width:30px;padding-left:8px}
.pd input[type=checkbox]{width:14px;height:14px;accent-color:var(--green);cursor:pointer;margin:0}
.pd-nr{font-size:13px;font-weight:600;font-family:"IBM Plex Mono",monospace}
.pd-sub{font-size:11.5px;color:var(--ink3);margin-top:1px}
.pd-cust{font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:170px}
.pd-items{font-size:12.5px;color:var(--ink2);max-width:420px;white-space:normal}
.pd-item{display:flex;align-items:center;gap:6px;padding:1px 0;line-height:1.3}
.pd-thumb{width:26px;height:26px;object-fit:cover;border-radius:4px;flex:none;border:1px solid var(--line2);background:#fff}
.pd-thumb-e{display:inline-block}
.pd-age{display:block;font-size:11px;margin-top:2px;color:var(--ink3)}
.pd-age-w{color:#96660C;font-weight:600}
.pd-age-r{color:var(--red);font-weight:600}
.pd-src{display:inline-flex;align-items:center;height:16px;padding:0 5px;border-radius:3px;
 font-family:"IBM Plex Mono",monospace;font-size:10px;font-weight:600;margin-right:3px}
.pd-exec{font-size:12.5px;font-weight:600}
.pd-exec small{display:block;font-weight:400;color:var(--ink3)}
.pd-sum{font-size:13.5px;font-weight:600;white-space:nowrap;font-family:"IBM Plex Mono",monospace}
.pd-pay{display:block;font-size:11px;font-weight:400;margin-top:1px;font-family:"IBM Plex Sans",sans-serif}
.pd-pay.ok{color:var(--green)}.pd-pay.no{color:#96660C}
.pd-ship{font-size:13px;color:var(--ink2);white-space:nowrap}
.pd-ship b{display:block;font-weight:500;color:var(--ink)}
.pd-track{font-size:11.5px;color:var(--ink3);font-family:"IBM Plex Mono",monospace}
.pd-pill{display:inline-flex;align-items:center;height:22px;padding:0 9px;border-radius:99px;
 font-size:12.5px;font-weight:500;white-space:nowrap}
td.pd-act{text-align:right;white-space:nowrap;width:1%}
.pd-more{display:inline-grid;place-items:center;width:26px;height:26px;border:1px solid transparent;
 border-radius:var(--r);color:var(--ink3);text-decoration:none;margin-left:4px}
.pd-more:hover{border-color:var(--line);color:var(--ink)}
.pd-note{font-size:12.5px;color:#96660C;margin-top:3px;white-space:normal;max-width:340px;line-height:1.35}
.pd-note.pd-red{color:var(--red);font-weight:500}
.pd-note.pd-cnote{background:#FBF2DE;border-left:2px solid #96660C;padding:3px 8px;border-radius:0 4px 4px 0;display:inline-block}
.pd-tbl tbody tr:has(.pd-cnote){height:auto}
.pd-cbox{background:#FBF2DE;border:1px solid #E7D7AE;border-left:3px solid #96660C;padding:9px 11px;
 font-size:13px;color:#6B4A08;border-radius:0 6px 6px 0;margin-bottom:12px;line-height:1.45}
.pd-cbox b{display:block;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:3px;color:#96660C}
.pd-dscrim{position:fixed;inset:0;background:rgba(22,26,23,.42);opacity:0;pointer-events:none;transition:.12s;z-index:200}
.pd-dscrim.on{opacity:1;pointer-events:auto}
.pd-dlg{position:fixed;top:50%;left:50%;transform:translate(-50%,-48%) scale(.98);width:min(430px,92vw);
 background:var(--card);border-radius:12px;box-shadow:0 22px 60px rgba(20,24,21,.32);padding:20px 22px 16px;
 opacity:0;pointer-events:none;transition:.12s;z-index:201}
.pd-dlg.on{opacity:1;pointer-events:auto;transform:translate(-50%,-50%) scale(1)}
.pd-dlg h3{margin:0 0 8px;font-size:16px;font-weight:600;font-family:"IBM Plex Mono",monospace}
.pd-dlg p{margin:0 0 14px;font-size:13.5px;color:var(--ink2);line-height:1.5}
.pd-dopt{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:var(--ink);cursor:pointer;
 background:#F4F4F0;border:1px solid var(--line);border-radius:var(--r);padding:9px 11px;margin-bottom:14px}
.pd-dopt input{margin-top:2px}
.pd-dlg-f{display:flex;gap:8px;justify-content:flex-end}
.pd-dlg-f .pd-btn{height:32px;padding:0 14px}
.pd-btn-pav{color:var(--red);border-color:#EAD2D2}
.pd-btn-pav:hover{background:#FAECEC;color:var(--red);border-color:#DDB6B6}
.pd-msg{display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:13.5px;border-bottom:1px solid var(--line)}
.pd-msg-ok{background:var(--greent);color:var(--green)}
.pd-msg-info{background:#F1F1EE;color:var(--ink2)}
.pd-msg-klaida{background:#FAECEC;color:var(--red);font-weight:500}
.pd-msg-x{margin-left:auto;border:0;background:none;cursor:pointer;color:inherit;font-size:14px;opacity:.6}
.pd-msg-x:hover{opacity:1}
.pd-empty{padding:60px 20px;text-align:center;color:var(--ink3)}
.pd-empty b{display:block;font-size:15px;color:var(--ink);margin-bottom:4px}

.pd-bulk{position:fixed;left:50%;bottom:20px;transform:translate(-50%,90px);opacity:0;pointer-events:none;
 display:flex;align-items:center;gap:8px;padding:9px 10px 9px 16px;background:var(--ink);color:#fff;
 border-radius:10px;box-shadow:0 10px 34px rgba(20,24,21,.28);transition:.16s;z-index:120;flex-wrap:wrap;max-width:94vw}
.pd-bulk.on{transform:translate(-50%,0);opacity:1;pointer-events:auto}
.pd-bcnt{font-size:12.5px;color:#CFD6D0;margin-right:4px}
.pd-bsep{width:1px;height:18px;background:rgba(255,255,255,.18)}
.pd-bulk .pd-btn{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.16);color:#fff}
.pd-bulk .pd-btn:hover{background:rgba(255,255,255,.2);color:#fff}

.pd-peek{position:fixed;top:76px;right:0;bottom:0;width:452px;background:var(--card);
 border-left:1px solid var(--line);box-shadow:-12px 0 34px rgba(20,24,21,.08);
 transform:translateX(100%);transition:.16s;display:flex;flex-direction:column;z-index:110}
.pd-peek.on{transform:none}
.pd-peek-h{padding:14px 16px 12px;border-bottom:1px solid var(--line)}
.pd-peek-r1{display:flex;align-items:center;gap:10px}
.pd-peek-r1 h2{margin:0;font-size:17px;font-weight:600;font-family:"IBM Plex Mono",monospace}
.pd-x{margin-left:auto;width:26px;height:26px;border:1px solid var(--line);background:none;
 border-radius:var(--r);cursor:pointer;color:var(--ink3)}
.pd-peek-b{flex:1;overflow:auto;padding:14px 16px 20px}
.pd-sec{margin-bottom:16px}
.pd-sec h3{margin:0 0 7px;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink3);font-weight:500}
.pd-kv{display:grid;grid-template-columns:98px 1fr;gap:3px 10px;font-size:13px;margin:0}
.pd-kv dt{color:var(--ink3)}
.pd-kv dd{margin:0}
.pd-line{display:flex;gap:9px;padding:8px 0;border-bottom:1px solid var(--line2);align-items:flex-start}
.pd-line:last-child{border-bottom:0}
.pd-q2{font-family:"IBM Plex Mono",monospace;font-size:12.5px;color:var(--ink2);min-width:26px}
.pd-t{flex:1;font-size:12.5px}
.pd-p{font-family:"IBM Plex Mono",monospace;font-size:12.5px;white-space:nowrap}
.pd-warn{background:#FBF2DE;border-left:2px solid #96660C;padding:7px 10px;font-size:12px;color:#96660C;border-radius:0 4px 4px 0;margin-bottom:8px}
.pd-alert{background:#FAECEC;border-left:2px solid var(--red);padding:7px 10px;font-size:12.5px;color:var(--red);border-radius:0 4px 4px 0;margin-bottom:8px;font-weight:500}
.pd-mem{background:#E9F1F8;border-left:2px solid #2B5C8A;padding:8px 10px;font-size:12.5px;color:#23405C;border-radius:0 4px 4px 0}
.pd-mem b{display:block;margin-bottom:2px}
.pd-tot{display:flex;justify-content:space-between;font-size:13px;padding:3px 0}
.pd-tot.big{font-size:15px;font-weight:600;border-top:1px solid var(--line);margin-top:6px;padding-top:8px}
.pd-peek-f{border-top:1px solid var(--line);padding:10px 16px;display:flex;gap:8px;flex-wrap:wrap}
#pkActs{display:flex;gap:8px}

/* ---- rytinė eiga ---- */
.pd-steps{display:flex;align-items:center;gap:2px;margin-left:6px;overflow:auto}
.pd-step{display:flex;align-items:center;gap:6px;padding:4px 9px;border-radius:99px;
 font-size:12.5px;color:var(--rdim);text-decoration:none;white-space:nowrap}
.pd-step:hover{background:rgba(255,255,255,.07);color:var(--rink)}
.pd-sdot{width:19px;height:19px;border-radius:50%;border:1.5px solid #4A554E;display:grid;place-items:center;
 font-size:10.5px;font-family:"IBM Plex Mono",monospace}
.pd-step.atlikta{color:var(--rink)}
.pd-step.atlikta .pd-sdot{background:var(--green);border-color:var(--green);color:#fff}
.pd-step.dabar{background:rgba(255,255,255,.12);color:#fff;font-weight:500}
.pd-step.dabar .pd-sdot{border-color:#fff;color:#fff}
.pd-sarr{color:#4A554E;font-size:12px}
.pd-ryt-body{flex:1;overflow:auto;padding:26px 32px 40px;max-width:1000px;width:100%;margin:0 auto}
.pd-rh2{margin:0 0 14px;font-size:19px;font-weight:600;letter-spacing:-.01em}
.pd-rgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-bottom:20px}
.pd-rcard{border:1px solid var(--line);border-radius:8px;padding:14px 16px;background:var(--card)}
.pd-rv{font-size:30px;font-weight:700;font-family:"IBM Plex Mono",monospace;letter-spacing:-.02em;line-height:1.1}
.pd-rl{font-size:12.5px;color:var(--ink3);margin-top:3px}
.pd-rl small{color:var(--ink3);font-size:11.5px}
.pd-rtbl{background:var(--card);border:1px solid var(--line);border-radius:8px;overflow:hidden}
.pd-rtbl tbody tr{cursor:default;height:42px}
.pd-rtbl tbody tr:hover{background:#F7F7F4}
.pd-rtbl thead th{background:#F5F5F1}
.pd-rnote{font-size:13.5px;color:var(--ink2);margin:0 0 16px;line-height:1.5}
.pd-rwarn{font-size:13px;color:#96660C;background:#FBF2DE;border-left:2px solid #96660C;
 padding:9px 12px;border-radius:0 4px 4px 0;margin-top:16px;line-height:1.5}
.pd-rbig{height:42px;padding:0 20px;font-size:14.5px;margin-right:10px}
.pd-done{opacity:.55}
.pd-sent{font-size:11.5px;color:var(--green);background:var(--greent);padding:1px 7px;border-radius:99px}
.pd-ryt-f{border-top:1px solid var(--line);padding:12px 32px;display:flex;gap:10px;align-items:center;background:var(--card)}
.pd-ryt-hint{font-size:12.5px;color:var(--ink3);flex:1;text-align:center}
.pd-rdone{text-align:center;padding:26px 0 22px}
.pd-rcheck{font-size:42px;line-height:1;color:var(--green);margin-bottom:6px}
.pd-rdone h2{margin:0 0 6px;font-size:20px;font-weight:600}
.pd-rdone p{margin:0;color:var(--ink2);font-size:13.5px}

.pd-rstat{display:inline-block;margin:16px 0 10px;padding:6px 13px;border-radius:99px;font-size:13.5px;font-weight:600}
.pd-rstat.ok{background:var(--greent);color:var(--green)}
.pd-rstat.dalis{background:#FBF2DE;color:#96660C}
.pd-rstat.nulis{background:#FAECEC;color:var(--red)}
.pd-rok{color:var(--green);font-family:"IBM Plex Mono",monospace;font-size:12.5px}
.pd-rbad{color:var(--red);font-size:12.5px}

.pd-vgrp{border:1px solid var(--line);border-radius:8px;background:var(--card);margin-bottom:16px;overflow:hidden}
.pd-vgrp-h{display:flex;align-items:center;gap:12px;padding:11px 14px;background:#F5F5F1;border-bottom:1px solid var(--line)}
.pd-vgrp-h b{font-size:14px}
.pd-vman{font-family:"IBM Plex Mono",monospace;font-size:12px;color:var(--ink3)}
.pd-vgrp-h .pd-rstat{margin:0 0 0 auto;font-size:12.5px;padding:4px 11px}
.pd-vgrp-b{display:flex;gap:8px;padding:12px 14px;flex-wrap:wrap}
.pd-vgrp .pd-rtbl{border:0;border-radius:0;border-top:1px solid var(--line2)}
.pd-vmix{border-color:#E7D7AE}
.pd-vmix .pd-vgrp-h{background:#FBF2DE}

.pd-riba{font-family:"IBM Plex Sans",sans-serif;font-size:12px;padding:3px 9px;border-radius:99px;font-weight:500}
.pd-riba-speji{background:var(--greent);color:var(--green)}
.pd-riba-skuba{background:#FBF2DE;color:#96660C}
.pd-riba-praejo{background:#F1F1EE;color:var(--ink3)}
small.pd-riba-speji,small.pd-riba-skuba,small.pd-riba-praejo{display:block;background:none;padding:0;font-size:11.5px;font-weight:500}
small.pd-riba-speji{color:var(--green)}
small.pd-riba-skuba{color:#96660C}
small.pd-riba-praejo{color:var(--ink3)}
/* artimiausia riba viršutinėje juostoje — ant tamsaus fono reikia plytelės */
.pd-tr{display:inline-flex;align-items:center;gap:7px;height:26px;padding:0 11px;border-radius:99px;
 font-size:12.5px;line-height:1;white-space:nowrap;border:1px solid transparent}
.pd-tr b{font-family:"IBM Plex Mono",monospace;font-size:11px;font-weight:600;letter-spacing:.04em}
.pd-tr-speji{background:rgba(126,196,150,.16);border-color:rgba(126,196,150,.3);color:#A9DCBB}
.pd-tr-speji b{color:#7EC496}
.pd-tr-skuba{background:rgba(240,200,104,.18);border-color:rgba(240,200,104,.38);color:#F3D99A;font-weight:500}
.pd-tr-skuba b{color:#F0C868}

.pd-tiek{display:flex;align-items:center;gap:8px;margin-top:6px;flex-wrap:wrap}
.pd-tiek-p{font-size:11.5px;color:var(--ink3)}
.pd-tiek-y{font-size:12px;color:var(--green);background:var(--greent);padding:3px 9px;border-radius:99px;font-weight:500}
.pd-tiek-x{font-size:11.5px;color:var(--ink3);text-decoration:underline}
.pd-tiek-x:hover{color:var(--red)}

.pd-pak{display:flex;align-items:center;gap:8px;margin-bottom:10px;background:#F4F4F0;border:1px solid var(--line);
 border-radius:var(--r);padding:9px 11px;flex-wrap:wrap}
.pd-pak label{font-size:12.5px;color:var(--ink2)}
.pd-pak input{width:62px;height:28px;border:1px solid var(--line);border-radius:4px;padding:0 8px;
 font-family:"IBM Plex Mono",monospace;text-align:right}
.pd-pak-p{font-size:11.5px;color:var(--ink3);width:100%}
.pd-lp{background:#E9F1F8;border-left:2px solid #2B5C8A;padding:8px 11px;font-size:12.5px;color:#23405C;
 border-radius:0 4px 4px 0;margin-bottom:10px}
.pd-lp-bl{background:#FBF2DE;border-color:#96660C;color:#6B4A08}
.pd-lp-w{margin-top:4px;font-weight:500}

.pd-kcard{background:var(--card);border:1px solid var(--line);border-left:3px solid var(--red);border-radius:8px;
 margin:14px 16px;overflow:hidden}
.pd-kdim{opacity:.62;border-left-color:#9AA39C}
.pd-kh{display:flex;align-items:center;gap:10px;padding:11px 14px;background:#F5F5F1;border-bottom:1px solid var(--line)}
.pd-kh b{font-family:"IBM Plex Mono",monospace;font-size:15px}
.pd-kh span{font-size:13px;color:var(--ink2)}
.pd-kpaid{background:var(--greent);color:var(--green);padding:2px 9px;border-radius:99px;font-size:11.5px;font-weight:600}
.pd-kunpaid{background:#FBF2DE;color:#96660C;padding:2px 9px;border-radius:99px;font-size:11.5px;font-weight:600}
.pd-kwait{margin-left:auto;background:#F1F1EE;color:var(--ink3);padding:2px 9px;border-radius:99px;font-size:11.5px}
.pd-kwhy{padding:10px 14px 0;color:var(--red);font-weight:500;font-size:13.5px}
.pd-kline{display:flex;align-items:center;gap:12px;padding:10px 14px;flex-wrap:wrap}
.pd-kprek b{display:block;font-size:13.5px}
.pd-kprek span{font-size:12.5px;color:var(--ink3)}
.pd-kbtns{margin-left:auto;display:flex;gap:8px;flex-wrap:wrap}
.pd-knone{font-size:12.5px;color:var(--ink3);font-style:italic}
.pd-kf{display:flex;gap:8px;padding:11px 14px;border-top:1px solid var(--line2);background:#FAFAF8;flex-wrap:wrap}
.pd-khint{margin:0 16px 20px;padding:9px 12px;background:var(--gray-t);border-radius:var(--r);
 font-size:12px;color:var(--ink2)}
@media (prefers-reduced-motion:reduce){.pd *{transition:none!important}}
</style>
		<?php
	}

	/* ============================ SKRIPTAS ============================ */

	protected static function skriptas() {
		?>
<script>
(function(){
 var T=document.querySelector('.pd-tbl'), peek=document.getElementById('pdPeek'),
     bulk=document.getElementById('pdBulk'), cur=0, sel=new Set();
 var rows=T?[].slice.call(T.querySelectorAll('tbody tr')):[];

 function d(r){ try{ return JSON.parse(r.getAttribute('data-json')); }catch(e){ return null; } }
 function esc(s){ return String(s==null?'':s).replace(/[<>&"]/g,function(c){
   return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]; }); }

 var DS=document.getElementById('pdDScrim'), DL=document.getElementById('pdDlg'), dgUrl='', dgOpt=null;
 function dlg(url,d){
  dgUrl=url; dgOpt=d.opt||null;
  document.getElementById('pdDlgA').textContent=d.antraste||'';
  document.getElementById('pdDlgT').textContent=d.tekstas||'';
  document.getElementById('pdDlgYes').textContent=d.ok||'Patvirtinti';
  var w=document.getElementById('pdDlgOptW'), c=document.getElementById('pdDlgOpt');
  if(dgOpt){ w.style.display='flex'; c.checked=!!dgOpt.def;
   document.getElementById('pdDlgOptT').textContent=dgOpt.tekstas; }
  else { w.style.display='none'; }
  DS.classList.add('on'); DL.classList.add('on');
  document.getElementById('pdDlgYes').focus();
 }
 function dlgOff(){ DS.classList.remove('on'); DL.classList.remove('on'); }
 document.getElementById('pdDlgNo').onclick=dlgOff;
 DS.onclick=dlgOff;
 document.getElementById('pdDlgYes').onclick=function(){
  var u=dgUrl;
  if(dgOpt){ u+='&'+encodeURIComponent(dgOpt.vardas)+'='+(document.getElementById('pdDlgOpt').checked?'1':'0'); }
  dlgOff(); window.location.href=u;
 };

 function mark(){
  rows.forEach(function(r,i){
   r.classList.toggle('cur', i===cur);
   r.classList.toggle('sel', sel.has(r.dataset.id));
   var cb=r.querySelector('.pd-row-cb'); if(cb) cb.checked=sel.has(r.dataset.id);
  });
  bulk.classList.toggle('on', sel.size>0);
  document.getElementById('pdBcnt').textContent='Pažymėta '+sel.size;
  var box=document.getElementById('pdWcIds'); box.innerHTML='';
  sel.forEach(function(id){
   var i=document.createElement('input'); i.type='hidden'; i.name='id[]'; i.value=id; box.appendChild(i);
   var p=document.createElement('input'); p.type='hidden'; p.name='post[]'; p.value=id; box.appendChild(p);
  });
 }

 function open(i){
  var r=rows[i]; if(!r) return; var o=d(r); if(!o) return;
  document.getElementById('pkNr').textContent='#'+o.nr;
  var st=document.getElementById('pkSt'); st.textContent=o.st;
  var sp=r.querySelector('.pd-pill');
  if(sp){ st.style.background=sp.style.background; st.style.color=sp.style.color; }
  document.getElementById('pkSub').textContent=o.laikas+' · '+(o.mok||'—')+(o.saskaita?' · '+o.saskaita:'');
  document.getElementById('pkEdit').href=o.edit;
  var box=document.getElementById('pkActs'); box.innerHTML='';
  (o.veiksmai||[]).forEach(function(v,ix){
   var el;
   if(v.url){
    el=document.createElement('a'); el.href=v.url;
    if(v.d) el.addEventListener('click',function(ev){ ev.preventDefault(); dlg(v.url,v.d); });
   } else if(v.wc){
    el=document.createElement('button');
    el.addEventListener('click',function(){ wcVienam(v.wc,o.id); });
   } else {
    el=document.createElement('button');
    el.addEventListener('click',function(){ alert('Šis veiksmas dar nepajungtas (2 sluoksnis).'); });
   }
   el.className='pd-btn'+(ix===0?' pd-btn-p':'')+(v.pav==='pavojus'?' pd-btn-pav':'');
   el.textContent=v.t; box.appendChild(el);
  });

  var h='';
  if(o.klausimas) h+='<div class="pd-alert">▲ '+esc(o.klausimas)+'</div>';
  if(o.pastaba) h+='<div class="pd-cbox"><b>Kliento pastaba</b>'+esc(o.pastaba)+'</div>';
  h+='<div class="pd-sec"><div class="pd-mem"><b>'+esc(o.vardas)+'</b>'+
     (o.uzsakymu>1?(o.uzsakymu+'-as užsakymas'+(o.pries?' · prieš tai '+esc(o.pries):''))
                  :'Pirmas užsakymas')+'</div></div>';
  h+='<div class="pd-sec"><h3>Pirkėjas</h3><dl class="pd-kv">'+
     '<dt>Telefonas</dt><dd>'+esc(o.tel||'—')+'</dd>'+
     '<dt>El. paštas</dt><dd>'+esc(o.mail||'—')+'</dd>'+
     '<dt>Adresas</dt><dd>'+esc(o.adresas||'—')+'</dd></dl></div>';
  h+='<div class="pd-sec"><h3>Eilutės</h3>';
  (o.items||[]).forEach(function(x){
   var t='';
   if(x.tiek){
    if(x.tiek.yra){
     t='<div class="pd-tiek"><span class="pd-tiek-y">✓ '+esc(x.tiek.tekstas)+'</span>'+
       (x.tiek.url?'<a class="pd-tiek-x" href="'+x.tiek.url+'">'+esc(x.tiek.mygtukas)+'</a>':'')+'</div>';
    } else {
     t='<div class="pd-tiek"><a class="pd-btn pd-btn-s" href="'+x.tiek.url+'">'+esc(x.tiek.mygtukas)+'</a>'+
       '<span class="pd-tiek-p">parsivežti į AV ir siųsti kartu</span></div>';
    }
   }
   h+='<div class="pd-line"><span class="pd-q2">'+x.q+'×</span><span class="pd-t">'+esc(x.n)+
      '<div class="pd-sub">'+esc(x.i||'')+'</div>'+t+'</span><span class="pd-p">'+esc(x.p)+'</span></div>';
  });
  h+='<div class="pd-tot"><span>Pristatymas</span><span>'+esc(o.siunta)+'</span></div>'+
     '<div class="pd-tot big"><span>Iš viso</span><span>'+esc(o.suma)+'</span></div></div>';
  h+='<div class="pd-sec"><h3>Siunta</h3>';
  if(o.pak){
   h+='<div class="pd-pak"><label>Dėžių šioje siuntoje</label>'+
      '<input type="number" min="1" max="20" value="'+o.pak.kiek+'" id="pdPakN">'+
      '<a class="pd-btn pd-btn-s" id="pdPakOk" data-u="'+o.pak.url+'">Išsaugoti</a>'+
      '<span class="pd-pak-p">kurjeriui · paštomate visada viena</span></div>';
  }
  if(o.lp_info){
   var g=o.lp_info[0], be=o.lp_info[1]||[];
   h+='<div class="pd-lp'+(be.length?' pd-lp-bl':'')+'">LP dydį parenka pats pagal svorį: <b>'+g+' g</b>'+
      (be.length?'<div class="pd-lp-w">▲ be svorio: '+esc(be.join(', '))+' — dydis bus apskaičiuotas neteisingai</div>':'')+
      '</div>';
  }
  h+='<dl class="pd-kv">'+
     '<dt>Būdas</dt><dd>'+esc(o.vezejas)+'</dd>'+
     '<dt>Vieta</dt><dd>'+esc(o.vieta||'—')+'</dd>'+
     '<dt>Kodas</dt><dd>'+esc(o.kodas||'dar nesuformuota')+(o.pak>1?' · '+o.pak+' lipdukai':'')+'</dd>'+
     '<dt>Vykdymas</dt><dd>'+esc(o.vykdymas||'—')+'</dd>'+
     (o.pak?'<dt>Dėžių</dt><dd>'+o.pak.kiek+'</dd>':'')+'</dl></div>';
  setTimeout(function(){
   var b=document.getElementById('pdPakOk');
   if(b) b.addEventListener('click',function(ev){
    ev.preventDefault();
    var n=document.getElementById('pdPakN');
    window.location.href=b.getAttribute('data-u')+'&n='+(n?n.value:1);
   });
  },0);
  document.getElementById('pkBody').innerHTML=h;
  peek.classList.add('on'); peek.setAttribute('aria-hidden','false');
 }
 function close(){ peek.classList.remove('on'); peek.setAttribute('aria-hidden','true'); }
 document.getElementById('pkX').onclick=close;

 rows.forEach(function(r,i){
  r.addEventListener('click',function(e){
   if(e.target.closest('.pd-more')) return;
   if(e.target.classList.contains('pd-row-cb')){
    sel.has(r.dataset.id)?sel.delete(r.dataset.id):sel.add(r.dataset.id); mark(); return;
   }
   var lnk=e.target.closest('a[data-d]');
   if(lnk){ e.preventDefault(); dlg(lnk.getAttribute('href'), JSON.parse(lnk.getAttribute('data-d'))); return; }
   var w1=e.target.closest('[data-wc1]');
   if(w1){ e.preventDefault(); wcVienam(w1.getAttribute('data-wc1'), w1.getAttribute('data-oid')); return; }
   if(e.target.closest('a.pd-btn')) return;
   if(e.target.closest('[data-act]')){ e.preventDefault(); alert('Šis veiksmas dar nepajungtas (2 sluoksnis).'); return; }
   cur=i; mark(); open(i);
  });
 });

 var all=document.getElementById('pdAllCb'), allb=document.getElementById('pdAll');
 function selAll(){ rows.forEach(function(r){ sel.add(r.dataset.id); }); mark(); }
 if(all) all.addEventListener('change',function(){ if(all.checked) selAll(); else { sel.clear(); mark(); } });
 if(allb) allb.addEventListener('click',selAll);
 document.getElementById('pdClr').onclick=function(){ sel.clear(); mark(); };

 function wcVienam(veiksmas,id){
  var box=document.getElementById('pdWcIds'); box.innerHTML='';
  ['id[]','post[]'].forEach(function(n){
   var i=document.createElement('input'); i.type='hidden'; i.name=n; i.value=id; box.appendChild(i);
  });
  document.getElementById('pdWcAction').value=veiksmas;
  document.getElementById('pdWcForm').submit();
 }
 document.addEventListener('click',function(ev){
  var b=ev.target.closest('[data-wc1]');
  if(!b) return;
  wcVienam(b.getAttribute('data-wc1'), b.getAttribute('data-oid'));
 });
 function pazymeti(){ return Array.from(sel).join(','); }
 [].forEach.call(bulk.querySelectorAll('[data-ba]'),function(b){
  b.addEventListener('click',function(e){
   e.preventDefault(); if(!sel.size) return;
   window.location.href=b.getAttribute('data-ba')+'&ids='+pazymeti();
  });
 });
 [].forEach.call(bulk.querySelectorAll('[data-wc]'),function(b){
  b.addEventListener('click',function(e){
   e.preventDefault(); if(!sel.size) return;
   document.getElementById('pdWcAction').value=b.getAttribute('data-wc');
   document.getElementById('pdWcForm').submit();
  });
 });

 [].forEach.call(document.querySelectorAll('.pd-sel'),function(s){
  s.addEventListener('change',function(){
   var u=new URL(window.location.href);
   if(s.value) u.searchParams.set(s.dataset.k,s.value); else u.searchParams.delete(s.dataset.k);
   if(s.dataset.k==='data'&&s.value!=='intervalas'){ u.searchParams.delete('nuo'); u.searchParams.delete('iki'); }
   window.location.href=u.toString();
  });
 });

 document.addEventListener('keydown',function(e){
  var t=e.target.tagName;
  if(t==='INPUT'||t==='SELECT'||t==='TEXTAREA'){
   if(e.key==='Escape') e.target.blur();
   return;
  }
  var k=e.key.toLowerCase();
  if(k==='/'){ e.preventDefault(); document.getElementById('pdQ').focus(); return; }
  if(!rows.length) return;
  if(k==='j'){ cur=Math.min(cur+1,rows.length-1); mark(); if(peek.classList.contains('on'))open(cur);
   rows[cur].scrollIntoView({block:'nearest'}); e.preventDefault(); }
  if(k==='k'){ cur=Math.max(cur-1,0); mark(); if(peek.classList.contains('on'))open(cur);
   rows[cur].scrollIntoView({block:'nearest'}); e.preventDefault(); }
  if(e.key==='Enter'){ open(cur); e.preventDefault(); }
  if(k==='x'){ var id=rows[cur].dataset.id; sel.has(id)?sel.delete(id):sel.add(id); mark(); e.preventDefault(); }
  if(e.key==='Escape'){
   if(DL.classList.contains('on')) dlgOff();
   else if(peek.classList.contains('on')) close();
   else { sel.clear(); mark(); }
  }
 });
 mark();
})();
</script>
		<?php
	}
}
Petshop_Desk::init();
