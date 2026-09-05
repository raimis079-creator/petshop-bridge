	/* ============================ v3.31: KREDITINĖS LAIŠKO ŠABLONAS (Raimis 09-05 #10: tekstas taisomas, siunčia TIK darbuotojas) ============================ */

	const KR_LAISKAS_OPT = 'ps_dl_kr_laiskas'; // v3.31: [tema, tekstas, mokestis] su vietaženkliais

	/** Numatytas šablonas. Vietaženkliai: {vardas} {kr_nr} {kr_suma} {uzsakymas} {grazinama} {mokestis} (pastraipa tik kai yra 3,99 € sąskaita) {mok_suma} {mok_avpn}. Tuščia eilutė = nauja pastraipa. */
	protected static function kr_laisko_numatytas() {
		return array(
			'tema'     => 'Kreditinė sąskaita Nr. {kr_nr} už užsakymą Nr. {uzsakymas}',
			'tekstas'  => "Sveiki, {vardas}.\n\nPridedame kreditinę PVM sąskaitą faktūrą Nr. {kr_nr} ({kr_suma} €) už užsakymą Nr. {uzsakymas}.\n\n{mokestis}\n\nGrąžinama suma — {grazinama} €. Pinigus grąžinsime per 14 dienų tuo pačiu būdu, kuriuo mokėjote.\n\nGražios dienos,\nPetshop.lt komanda\n+370 681 87787\nterra@petshop.lt",
			'mokestis' => 'Siuntos grąžinimo išlaidos — {mok_suma} € (pirkimo taisyklių 6.10–6.11 p.) — PVM sąskaita faktūra Nr. {mok_avpn} pridėta; jos apmokėjimą įskaitome iš grąžinamos sumos.',
		);
	}
	protected static function kr_laisko_sablonas() { $s = get_option( self::KR_LAISKAS_OPT ); $n = self::kr_laisko_numatytas(); return is_array( $s ) ? array_merge( $n, array_intersect_key( array_map( 'strval', $s ), $n ) ) : $n; }

	/** Šablonas → [tema, html]. Pastraipos — tuščia eilutė; viena eilutė — <br>. */
	protected static function kr_laiskas_sudeti( $o, $kr, $grazinama ) {
		$s = self::kr_laisko_sablonas(); $vardas = trim( (string) $o->get_billing_first_name() );
		$z = array( '{vardas}' => $vardas ? $vardas : 'kliente', '{kr_nr}' => (string) $kr['nr'], '{kr_suma}' => self::eur( $kr['suma'] ), '{uzsakymas}' => (string) $o->get_order_number(), '{grazinama}' => self::eur( $grazinama ), '{mok_suma}' => self::eur( self::GRAZINIMO_MOKESTIS ), '{mok_avpn}' => (string) ( $kr['mok_avpn'] ?? '' ) );
		$mok = ! empty( $kr['mok_avpn'] ) ? strtr( $s['mokestis'], $z ) : '';
		$tekstas = strtr( str_replace( '{mokestis}', $mok, $s['tekstas'] ), $z );
		$tekstas = preg_replace( "/\n{3,}/", "\n\n", trim( $tekstas ) );
		$h = ''; foreach ( preg_split( "/\n\s*\n/", $tekstas ) as $p ) { $p = trim( $p ); if ( '' === $p ) { continue; } $h .= '<p>' . nl2br( esc_html( $p ) ) . '</p>'; }
		return array( strtr( $s['tema'], $z ), $h );
	}

	/** POST `ps_dl_kr_sablonas` (Sąskaitų lange, `manage_woocommerce`) — išsaugoti / atstatyti šabloną. */
	public static function kr_sablonas_vykdyti() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_die( 'Nepakanka teisių' ); }
		check_admin_referer( 'ps_dl_kr_sablonas' ); $atgal = admin_url( 'admin.php?page=' . self::SLUG . '&view=saskaitos' );
		if ( ! empty( $_POST['atstatyti'] ) ) { delete_option( self::KR_LAISKAS_OPT ); wp_safe_redirect( add_query_arg( array( 'pd_ok' => 'dl_info', 'pd_nr' => rawurlencode( 'šablonas|kreditinės laiško šablonas atstatytas į numatytą' ) ), $atgal ) ); exit; }
		$n = self::kr_laisko_numatytas(); $s = array();
		foreach ( array_keys( $n ) as $k ) { $v = isset( $_POST[ $k ] ) ? trim( (string) wp_unslash( $_POST[ $k ] ) ) : ''; $s[ $k ] = 'tema' === $k ? sanitize_text_field( $v ) : sanitize_textarea_field( $v ); if ( '' === $s[ $k ] ) { $s[ $k ] = $n[ $k ]; } }
		update_option( self::KR_LAISKAS_OPT, $s, false );
		wp_safe_redirect( add_query_arg( array( 'pd_ok' => 'dl_info', 'pd_nr' => rawurlencode( 'šablonas|kreditinės laiško šablonas išsaugotas' ) ), $atgal ) ); exit;
	}

	/** Šablono forma Sąskaitų lange (tik `manage_woocommerce`): <details>, tema, tekstas, 3,99 pastraipa, vietaženklių sąrašas, „Išsaugoti“ / „Atstatyti numatytą“. */
	protected static function kr_sablono_forma() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { return; }
		$s = self::kr_laisko_sablonas(); $n = self::kr_laisko_numatytas(); $keistas = $s !== $n;
		echo '<details class="dl-sabl"' . ( isset( $_GET['pd_nr'] ) && 0 === strpos( rawurldecode( (string) $_GET['pd_nr'] ), 'šablonas' ) ? ' open' : '' ) . '><summary>Kreditinės laiško šablonas' . ( $keistas ? ' <span class="pilkas maz">(pakeistas)</span>' : ' <span class="pilkas maz">(numatytas)</span>' ) . '</summary>'
			. '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">' . wp_nonce_field( 'ps_dl_kr_sablonas', '_wpnonce', true, false ) . '<input type="hidden" name="action" value="ps_dl_kr_sablonas">'
			. '<p class="pilkas maz">Laišką su kreditine siunčia TIK darbuotojas („siųsti klientui“ kortelėje) — automatiškai nesiunčiama. Vietaženkliai: {vardas} {kr_nr} {kr_suma} {uzsakymas} {grazinama} {mokestis} (3,99 € pastraipa — tik kai ji yra) {mok_suma} {mok_avpn}. Tuščia eilutė — nauja pastraipa.</p>'
			. '<label>Tema<br><input type="text" name="tema" value="' . esc_attr( $s['tema'] ) . '"></label>'
			. '<label>Tekstas<br><textarea name="tekstas" rows="10">' . esc_textarea( $s['tekstas'] ) . '</textarea></label>'
			. '<label>3,99 € pastraipa ({mokestis})<br><textarea name="mokestis" rows="3">' . esc_textarea( $s['mokestis'] ) . '</textarea></label>'
			. '<div class="dl-sabl-v"><button class="v p" type="submit">Išsaugoti</button> <button class="v t" type="submit" name="atstatyti" value="1">Atstatyti numatytą</button></div></form></details>';
	}

