<?php
/**
 * Petshop Siuntu Laiskai v1.1 (H204/H206) — kaupiamasis siuntų registras ir sekimo laiškas.
 *
 * KODĖL: Venipak pluginas visą registraciją laiko VIENAME rakte
 * `venipak_shipping_order_data` — mišriam užsakymui antra grupės registracija
 * PERRAŠO pirmos pack numerius (H202). Šis modulis po kiekvienos sėkmingos
 * registracijos nusikopijuoja rezultatą į savo kaupiamąjį `_ps_siuntos`
 * (raktas pagal sandėlį — pakartotinė to paties sandėlio registracija atnaujina,
 * ne dubliuoja) ir iš jo formuoja VIENĄ laišką klientui su VISAIS numeriais —
 * kaip senoje sistemoje, tik be rankinio rašymo.
 *
 * Papildomai: MIXED užsakymo apmokėjimo laiške — pastaba apie kelias siuntas.
 * Laiškas klientui siunčiamas TIK mygtuku (sistema paruošia — žmogus tvirtina).
 *
 * v1.1 (H206) — §18.3 užbaigimo sargas: užsakymas su keliomis siuntomis NEGALI
 * tapti „completed", kol registruotos ne visos siuntos. Sargas gali tik
 * SUSTABDYTI užbaigimą, niekada jo sukelti. Apėjimas ypatingam atvejui:
 * užsakymo meta `_ps_uzbaigti_be_siuntu` = 1.
 */

defined( 'ABSPATH' ) || exit;

class Petshop_Siuntos {

	const META    = '_ps_siuntos';
	const SIUSTA  = '_ps_sekimo_siusta';
	const PUSLAPIS = 'ps-siuntos-laiskas';

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'meniu' ) );
		add_action( 'admin_post_ps_siuntu_siusti', array( __CLASS__, 'siusti' ) );
		add_action( 'woocommerce_email_order_details', array( __CLASS__, 'mixed_pastaba' ), 5, 4 );
		add_action( 'woocommerce_before_order_object_save', array( __CLASS__, 'uzbaigimo_sargas' ), 10, 1 );
	}

	/* ------------------------------------------------------------------ */
	/* REGISTRAS                                                          */
	/* ------------------------------------------------------------------ */

	/**
	 * Po sėkmingos Venipak registracijos nusikopijuoja plugino rezultatą
	 * į kaupiamąjį sąrašą. Kviečia darbalaukio vp_reg (desk v3.15).
	 */
	public static function prideti_is_plugino( $order_id, $sandelis, $manifesto_kodas ) {
		$o = wc_get_order( $order_id );
		if ( ! $o ) { return false; }

		$raw = $o->get_meta( 'venipak_shipping_order_data' );
		$d   = is_array( $raw ) ? $raw : json_decode( (string) $raw, true );
		if ( empty( $d['pack_numbers'] ) || ! is_array( $d['pack_numbers'] ) ) { return false; }

		$sarasas = self::zalias( $o );
		$sarasas[ sanitize_key( $sandelis ) ] = array(
			'sandelis'  => sanitize_key( $sandelis ),
			'kodas'     => sanitize_text_field( $manifesto_kodas ),
			'manifest'  => sanitize_text_field( $d['manifest'] ?? '' ),
			'numeriai'  => array_map( 'sanitize_text_field', $d['pack_numbers'] ),
			'data'      => current_time( 'mysql' ),
		);
		$o->update_meta_data( self::META, wp_json_encode( $sarasas ) );
		$o->add_order_note( sprintf( 'Siuntos numeriai išsaugoti (%s): %s',
			mb_strtoupper( $sandelis ), implode( ', ', $d['pack_numbers'] ) ), false, true );
		$o->save();
		return true;
	}

	/** Žalias kaupiamasis masyvas (raktai — sandėliai). */
	protected static function zalias( $o ) {
		$s = json_decode( (string) $o->get_meta( self::META ), true );
		return is_array( $s ) ? $s : array();
	}

	/**
	 * Sąrašas laiškui. Jei kaupiamojo dar nėra (pvz., siunta registruota per
	 * WC sąrašą, aplenkiant darbalaukį), imamas plugino raktas kaip vienintelė siunta.
	 */
	public static function sarasas( $order_id ) {
		$o = wc_get_order( $order_id );
		if ( ! $o ) { return array(); }
		$s = self::zalias( $o );
		if ( $s ) { return array_values( $s ); }

		$raw = $o->get_meta( 'venipak_shipping_order_data' );
		$d   = is_array( $raw ) ? $raw : json_decode( (string) $raw, true );
		if ( ! empty( $d['pack_numbers'] ) ) {
			return array( array(
				'sandelis' => '',
				'kodas'    => '',
				'manifest' => (string) ( $d['manifest'] ?? '' ),
				'numeriai' => (array) $d['pack_numbers'],
				'data'     => '',
			) );
		}
		return array();
	}

	/** Ar užsakymas turi bent vieną siuntos numerį (darbalaukio mygtukui). */
	public static function turi( $order_id ) {
		return (bool) self::sarasas( $order_id );
	}

	/** Kiek siuntų GRUPIŲ jau registruota (kaupiamajame sąraše). */
	public static function registruota_grupiu( $o ) {
		return count( self::zalias( $o ) );
	}

	/* ------------------------------------------------------------------ */
	/* §18.3 UŽBAIGIMO SARGAS                                             */
	/* ------------------------------------------------------------------ */

	/**
	 * Blokuoja perėjimą į „completed", kol registruotos ne visos siuntos.
	 * Veikia tik užsakymams su `_ps_shipments` > 1. Statusas grąžinamas į
	 * buvusį DB (be laiškų — from==to perėjimo kabliukai nešaunа).
	 * SAUGUMO RIBA: sargas gali tik sustabdyti užbaigimą, nieko daugiau.
	 */
	public static function uzbaigimo_sargas( $order ) {
		if ( ! $order instanceof WC_Order || ! $order->get_id() ) { return; }
		$ch = $order->get_changes();
		if ( empty( $ch['status'] ) || 'completed' !== $ch['status'] ) { return; }
		if ( $order->get_meta( '_ps_uzbaigti_be_siuntu' ) ) { return; }

		$tiketasi = (int) $order->get_meta( '_ps_shipments' );
		if ( $tiketasi <= 1 ) { return; }

		$turima = self::registruota_grupiu( $order );
		if ( $turima >= $tiketasi ) { return; }

		global $wpdb;
		$db_status = (string) $wpdb->get_var( $wpdb->prepare(
			"SELECT status FROM {$wpdb->prefix}wc_orders WHERE id=%d", $order->get_id() ) );
		$orig = $db_status ? preg_replace( '/^wc-/', '', $db_status ) : 'processing';
		if ( 'completed' === $orig ) { return; }

		$order->set_status( $orig, '', false );
		$order->add_order_note( sprintf(
			'Užbaigimas sustabdytas: registruotos %d iš %d siuntų. Užbaigti galima, kai visos siuntos registruotos (apėjimas ypatingam atvejui: meta _ps_uzbaigti_be_siuntu = 1).',
			$turima, $tiketasi ), false, true );
	}

	/* ------------------------------------------------------------------ */
	/* LAIŠKAS                                                            */
	/* ------------------------------------------------------------------ */

	/** Laiško HTML turinys (be WC apvalkalo). */
	public static function laisko_turinys( $o ) {
		$siuntos = self::sarasas( $o->get_id() );
		if ( ! $siuntos ) { return ''; }

		$vardas = trim( $o->get_billing_first_name() );
		$h  = '<p>' . esc_html( $vardas ? "Sveiki, {$vardas}," : 'Sveiki,' ) . '</p>';
		$h .= '<p>' . sprintf( esc_html( 'Jūsų užsakymo Nr. %s siuntų sekimo numeriai:' ),
			esc_html( $o->get_order_number() ) ) . '</p>';
		$h .= '<ul>';
		$i  = 0;
		foreach ( $siuntos as $s ) {
			foreach ( (array) $s['numeriai'] as $nr ) {
				$i++;
				$h .= '<li>' . sprintf( esc_html( 'Siunta %d: %s' ), $i, esc_html( $nr ) ) . '</li>';
			}
		}
		$h .= '</ul>';
		if ( $i > 1 ) {
			$h .= '<p>' . esc_html( 'Siuntos gali būti pristatytos skirtingu metu.' ) . '</p>';
		}
		$h .= '<p>' . esc_html( 'Siuntas pristato Venipak — būseną galite sekti venipak.lt pagal siuntos numerį.' ) . '</p>';
		return $h;
	}

	/** admin_post — laiško siuntimas mygtuku. */
	public static function siusti() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_die( 'Teisių nėra' ); }
		check_admin_referer( 'ps_siuntu_siusti' );
		$id = isset( $_POST['order_id'] ) ? absint( $_POST['order_id'] ) : 0;
		$o  = $id ? wc_get_order( $id ) : false;
		$atgal = admin_url( 'admin.php?page=' . self::PUSLAPIS . '&id=' . $id );

		if ( ! $o || ! $o->get_billing_email() || ! self::turi( $id ) ) {
			wp_safe_redirect( add_query_arg( 'ps_ok', 'klaida', $atgal ) ); exit;
		}

		$mailer  = WC()->mailer();
		$antr    = 'Siuntų sekimo numeriai';
		$tema    = sprintf( 'Jūsų užsakymo Nr. %s siuntų sekimo numeriai', $o->get_order_number() );
		$turinys = $mailer->wrap_message( $antr, self::laisko_turinys( $o ) );
		$issiusta = $mailer->send( $o->get_billing_email(), $tema, $turinys );

		if ( $issiusta ) {
			$o->update_meta_data( self::SIUSTA, current_time( 'mysql' ) );
			$o->add_order_note( 'Sekimo numerių laiškas išsiųstas klientui: ' . $o->get_billing_email(), false, true );
			$o->save();
		}
		wp_safe_redirect( add_query_arg( 'ps_ok', $issiusta ? 'issiusta' : 'klaida', $atgal ) );
		exit;
	}

	/* ------------------------------------------------------------------ */
	/* ADMIN PUSLAPIS                                                     */
	/* ------------------------------------------------------------------ */

	public static function meniu() {
		add_submenu_page( '', 'Sekimo laiškas', 'Sekimo laiškas',
			'manage_woocommerce', self::PUSLAPIS, array( __CLASS__, 'puslapis' ) );
	}

	public static function puslapis() {
		$id = isset( $_GET['id'] ) ? absint( $_GET['id'] ) : 0;
		$o  = $id ? wc_get_order( $id ) : false;
		echo '<div class="wrap"><h1>Sekimo laiškas klientui</h1>';
		if ( ! $o ) { echo '<p>Užsakymas nerastas.</p></div>'; return; }

		$siuntos = self::sarasas( $id );
		$tiketasi = (int) $o->get_meta( '_ps_shipments' );
		$turima   = 0;
		foreach ( $siuntos as $s ) { $turima += count( (array) $s['numeriai'] ); }
		$siusta = $o->get_meta( self::SIUSTA );

		if ( isset( $_GET['ps_ok'] ) ) {
			$ok = 'issiusta' === $_GET['ps_ok'];
			printf( '<div class="notice notice-%s"><p>%s</p></div>',
				$ok ? 'success' : 'error',
				$ok ? 'Laiškas išsiųstas.' : 'Laiško išsiųsti nepavyko.' );
		}

		printf( '<p><strong>Užsakymas #%s</strong> · %s · %s</p>',
			esc_html( $o->get_order_number() ),
			esc_html( $o->get_formatted_billing_full_name() ),
			esc_html( $o->get_billing_email() ) );

		if ( $tiketasi && count( $siuntos ) < $tiketasi ) {
			printf( '<div class="notice notice-warning"><p>Registruota %d iš %d siuntų — laiške bus tik turimi numeriai.</p></div>',
				count( $siuntos ), $tiketasi );
		}
		if ( $siusta ) {
			printf( '<div class="notice notice-info"><p>Laiškas jau siųstas %s. Galima siųsti pakartotinai.</p></div>',
				esc_html( $siusta ) );
		}

		if ( ! $siuntos ) {
			echo '<p>Šis užsakymas dar neturi registruotų siuntų numerių.</p></div>'; return;
		}

		echo '<table class="widefat striped" style="max-width:640px"><thead><tr><th>Sandėlis</th><th>Manifestas</th><th>Siuntų numeriai</th><th>Registruota</th></tr></thead><tbody>';
		foreach ( $siuntos as $s ) {
			printf( '<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>',
				esc_html( $s['sandelis'] ? mb_strtoupper( $s['sandelis'] ) : '—' ),
				esc_html( $s['manifest'] ?: '—' ),
				esc_html( implode( ', ', (array) $s['numeriai'] ) ),
				esc_html( $s['data'] ?: '—' ) );
		}
		echo '</tbody></table>';

		echo '<h2 style="margin-top:1.2em">Laiško peržiūra</h2>';
		echo '<div style="max-width:640px;background:#fff;border:1px solid #ccd0d4;padding:12px 16px">'
			. wp_kses_post( self::laisko_turinys( $o ) ) . '</div>';

		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" style="margin-top:1em">';
		wp_nonce_field( 'ps_siuntu_siusti' );
		printf( '<input type="hidden" name="action" value="ps_siuntu_siusti"><input type="hidden" name="order_id" value="%d">', $id );
		printf( '<button class="button button-primary">%s</button> ',
			$siusta ? 'Siųsti dar kartą' : 'Siųsti klientui' );
		printf( '<a class="button" href="%s">Atgal į darbalaukį</a>',
			esc_url( admin_url( 'admin.php?page=ps-desk' ) ) );
		echo '</form></div>';
	}

	/* ------------------------------------------------------------------ */
	/* MIXED PASTABA APMOKĖJIMO LAIŠKE                                    */
	/* ------------------------------------------------------------------ */

	public static function mixed_pastaba( $order, $sent_to_admin = false, $plain = false, $email = null ) {
		if ( $sent_to_admin || ! $order || ! is_object( $email ) ) { return; }
		if ( ! in_array( $email->id, array( 'customer_processing_order', 'customer_on_hold_order' ), true ) ) { return; }
		if ( 'MIXED' !== $order->get_meta( '_ps_order_type' ) ) { return; }
		$n = max( 2, (int) $order->get_meta( '_ps_shipments' ) );
		$tekstas = sprintf(
			'Jūsų užsakymas bus pristatytas %d atskiromis siuntomis — jos gali atvykti skirtingomis dienomis. Visus siuntų sekimo numerius atsiųsime atskiru laišku.',
			$n );
		if ( $plain ) { echo "\n" . $tekstas . "\n\n"; return; }
		echo '<p style="margin:0 0 16px;padding:10px 12px;background:#f6f6f6;border-left:4px solid #7a9a01">'
			. esc_html( $tekstas ) . '</p>';
	}
}
Petshop_Siuntos::init();
