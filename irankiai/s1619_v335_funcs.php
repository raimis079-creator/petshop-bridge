	/* ============================ v3.35: ATSIĖMIMAS AV (Raimis C, 09-05/09-06 — visas, bet IŠJUNGTAS: WC zonos „Lietuva“ `local_pickup` instancija sukurta išjungta) ============================ */

	const ATS_META        = '_ps_atsiemimas';      // v3.35: {paruosta: laikas|kas, laiskas: laikas|el, atsieme: laikas|kas}
	const ATS_LAISKAS_OPT = 'ps_dl_ats_laiskas';   // v3.35: [tema, tekstas, neapmoketa, adresas, valandos] — taisomas šablonas (kaip kreditinės)

	/** Atsiėmimo AV užsakymas — pristatymo eilutė `local_pickup` (WC kasa / darbalaukio „+ Naujas užsakymas“) arba pavadinimu „Atsiėmimas AV“. */
	protected static function atsiemimas( $o ) {
		if ( ! $o ) { return false; }
		foreach ( $o->get_items( 'shipping' ) as $sh ) { if ( 'local_pickup' === $sh->get_method_id() || false !== mb_stripos( (string) $sh->get_name(), 'Atsiėmimas AV' ) ) { return true; } }
		return false;
	}

	/** Atsiėmimo žymės: [paruosta, laiskas, atsieme] (tuščios eilutės, jei nėra). */
	protected static function ats_zymes( $o ) {
		$a = json_decode( (string) $o->get_meta( self::ATS_META ), true ); if ( ! is_array( $a ) ) { $a = array(); }
		return array_merge( array( 'paruosta' => '', 'laiskas' => '', 'atsieme' => '' ), array_map( 'strval', $a ) );
	}

	/** GET `ats_paruosta` (+`be_laisko`): surinkta → „Paruošta atsiimti“ — žymė + laiškas klientui (šablonas `ATS_LAISKAS_OPT`; varnelė „nesiųsti“). Užsakymas lieka processing, eilė „Paruošta“. */
	protected static function atsiemimas_paruosta( $o, $u, $be_laisko ) {
		if ( ! self::atsiemimas( $o ) ) { return array( 'dl_info', 'ne atsiėmimo užsakymas' ); }
		if ( ! $o->is_paid() ) { return array( 'dl_klaida', 'užsakymas neapmokėtas — pirma „Pažymėti apmokėtu“ arba „Apmokėta grynais“' ); }
		if ( ! $o->get_meta( '_ps_surinkta' ) ) { return array( 'dl_klaida', 'dar nesurinkta — pirma „Surinkti“ (lapas)' ); }
		$a = self::ats_zymes( $o ); $jau = (bool) $a['paruosta'];
		if ( ! $jau ) { $a['paruosta'] = current_time( 'mysql' ) . '|' . $u->display_name; }
		$el = $o->get_billing_email(); $laiskas = '';
		if ( $be_laisko ) { $laiskas = 'laiškas nesiųstas (varnelė)'; }
		elseif ( ! is_email( $el ) ) { $laiskas = 'el. pašto nėra — paskambink ' . $o->get_billing_phone(); }
		elseif ( $a['laiskas'] && $jau ) { $laiskas = 'klientui jau pranešta (' . substr( $a['laiskas'], 0, 16 ) . ')'; }
		else { list( $tema, $h ) = self::ats_laiskas_sudeti( $o ); $mailer = WC()->mailer(); $ok = (bool) $mailer->send( $el, $tema, $mailer->wrap_message( $tema, $h ) ); if ( $ok ) { $a['laiskas'] = current_time( 'mysql' ) . '|' . $el; } $laiskas = $ok ? 'klientui pranešta (' . $el . ')' : 'laiško išsiųsti NEPAVYKO'; }
		$o->update_meta_data( self::ATS_META, wp_json_encode( $a ) );
		$o->add_order_note( sprintf( 'Darbalaukis: paruošta atsiimti (%s) — %s.', $u->display_name, $laiskas ), false, true ); $o->save();
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'ats_paruosta', 'rezultatas' => 'ok', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'po' => array( 'laiskas' => $laiskas ), 'pastaba' => 'atsiėmimas AV: paruošta atsiimti — ' . $laiskas ) ); }
		do_action( 'ps_juosta_isvalyti' );
		return array( 'dl_info', ( $jau ? 'jau buvo paruošta — ' : 'paruošta atsiimti — ' ) . $laiskas );
	}

	/** GET `atsieme`: klientas atsiėmė → `_ps_dalys_issiusta.av` (kanalas `atsiemimas`), `_ps_uzbaigti_be_siuntu`, completed (tema — AVPN PDF; WC „užsakymas įvykdytas“ laiškas su sąskaita eina — Claude prielaida). Tik apmokėtam ir surinktam. */
	protected static function atsiemimas_atsieme( $o, $u ) {
		if ( ! self::atsiemimas( $o ) ) { return array( 'dl_info', 'ne atsiėmimo užsakymas' ); }
		if ( in_array( $o->get_status(), array( 'completed', 'cancelled', 'refunded' ), true ) ) { return array( 'dl_info', 'užsakymas jau uždarytas' ); }
		if ( ! $o->is_paid() ) { return array( 'dl_klaida', 'užsakymas NEAPMOKĖTAS — pirma „Apmokėta grynais“ (klientas moka vietoje) arba „Pažymėti apmokėtu“ (pavedimas gautas)' ); }
		if ( ! $o->get_meta( '_ps_surinkta' ) ) { return array( 'dl_klaida', 'dar nesurinkta — pirma „Surinkti“ (lapas)' ); }
		$a = self::ats_zymes( $o ); $a['atsieme'] = current_time( 'mysql' ) . '|' . $u->display_name; if ( ! $a['paruosta'] ) { $a['paruosta'] = $a['atsieme']; }
		$iss = json_decode( (string) $o->get_meta( '_ps_dalys_issiusta' ), true ); if ( ! is_array( $iss ) ) { $iss = array(); }
		foreach ( array_keys( array_filter( self::faktai( $o, array() )['dalys'] ) ) as $k ) { if ( empty( $iss[ $k ] ) ) { $iss[ $k ] = array( 'laikas' => current_time( 'mysql' ), 'kas' => $u->display_name, 'kanalas' => 'atsiemimas' ); } }
		if ( empty( $iss['av'] ) ) { $iss['av'] = array( 'laikas' => current_time( 'mysql' ), 'kas' => $u->display_name, 'kanalas' => 'atsiemimas' ); }
		$o->update_meta_data( self::ATS_META, wp_json_encode( $a ) ); $o->update_meta_data( '_ps_dalys_issiusta', wp_json_encode( $iss ) ); $o->update_meta_data( '_ps_uzbaigti_be_siuntu', '1' );
		$o->add_order_note( sprintf( 'Darbalaukis: klientas atsiėmė prekes AV (%s) — užsakymas įvykdytas be siuntos. PVM sąskaita klientui — WC „užsakymas įvykdytas“ laiškas.', $u->display_name ), false, true ); $o->save();
		$o->update_status( 'completed', '' );
		$o = wc_get_order( $o->get_id() );
		if ( 'completed' !== $o->get_status() ) { return array( 'dl_klaida', 'užbaigti nepavyko (būsena ' . $o->get_status() . ') — pakartok arba pasakyk Raimiui' ); }
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'atsieme', 'rezultatas' => 'ok', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'po' => array( 'status' => 'completed', 'avpn' => (string) $o->get_meta( '_petshop_avpn_number' ) ), 'pastaba' => 'atsiėmimas AV: klientas atsiėmė — įvykdytas' ) ); }
		do_action( 'ps_juosta_isvalyti' );
		return array( 'dl_info', 'klientas atsiėmė — užsakymas įvykdytas' . ( $o->get_meta( '_petshop_avpn_number' ) ? ', PVM sąskaita ' . $o->get_meta( '_petshop_avpn_number' ) : '' ) );
	}

	/** GET `grynais` (skydelis, neapmokėtas atsiėmimo užsakymas — klientas atvyko ir moka vietoje): `cod` „Apmokėta grynais“ + `date_paid` + processing (varikliai kaip po Paysera; B 6 — likutis nurašomas dabar). Kvitas PPK — atskirai („Suformuoti kvitą“). */
	protected static function apmoketa_grynais( $o, $u ) {
		if ( $o->is_paid() ) { return array( 'dl_info', 'užsakymas jau apmokėtas' ); }
		if ( ! in_array( $o->get_status(), array( 'pending', 'on-hold', 'failed' ), true ) ) { return array( 'dl_klaida', 'būsena ' . $o->get_status() . ' — apmokėti negalima' ); }
		$buvo = $o->get_payment_method_title();
		$o->set_payment_method( 'cod' ); $o->set_payment_method_title( 'Apmokėta grynais' ); $o->set_date_paid( time() ); $o->save();
		self::d( 'laiskai_off' ); $o->update_status( 'processing', 'Darbalaukis: apmokėta grynais vietoje (' . $u->display_name . '; buvo „' . $buvo . '“). Kvitas PPK — „Suformuoti kvitą“.', true ); self::d( 'laiskai_on' );
		$o = wc_get_order( $o->get_id() );
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'grynais', 'rezultatas' => 'ok', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'po' => array( 'status' => $o->get_status(), 'suma' => (float) $o->get_total() ), 'pastaba' => 'apmokėta grynais vietoje ' . self::eur( $o->get_total() ) . ' €' ) ); }
		do_action( 'ps_juosta_isvalyti' );
		return array( 'dl_info', 'apmokėta grynais (' . self::eur( $o->get_total() ) . ' €) — eina į darbą; kvitą (PPK) suformuok „Sąskaitos“ bloke' );
	}

	/** Numatytas laiškas „paruošta atsiimti“ (Raimis 09-06 „gerai“). Vietaženkliai: {vardas} {nr} {adresas} {valandos} {suma} {neapmoketa} (pastraipa tik neapmokėtam) {tel}. */
	protected static function ats_laisko_numatytas() {
		return array(
			'tema'       => 'Jūsų užsakymas Nr. {nr} paruoštas atsiimti — Petshop.lt',
			'tekstas'    => "Sveiki, {vardas}.\n\nJūsų užsakymas Nr. {nr} paruoštas — galite atsiimti mūsų sandėlyje: {adresas}. Darbo laikas: {valandos}. Atvykę pasakykite užsakymo numerį.\n\n{neapmoketa}\n\nUžsakymą saugome 7 dienas; jei atsiimti nepavyks — parašykite arba paskambinkite, sutarsime kitą laiką.\n\nGražios dienos,\nPetshop.lt komanda\n+370 681 87787\nterra@petshop.lt",
			'neapmoketa' => 'Suma {suma} € — apmokėti galite atsiimant grynaisiais arba iš anksto pavedimu: UAB Avesa · AB Swedbank · LT127300010124940593, paskirtis „Užsakymas Nr. {nr}“.',
			'adresas'    => 'Liucionių g. 46, Liucionys (Nemenčinės sen., Vilniaus r.)',
			'valandos'   => 'I–V 09:00–18:00, VI 10:00–15:00',
		);
	}
	protected static function ats_laisko_sablonas() { $s = get_option( self::ATS_LAISKAS_OPT ); $n = self::ats_laisko_numatytas(); return is_array( $s ) ? array_merge( $n, array_intersect_key( array_map( 'strval', $s ), $n ) ) : $n; }

	/** Šablonas → [tema, html] (kaip `kr_laiskas_sudeti`). */
	protected static function ats_laiskas_sudeti( $o ) {
		$s = self::ats_laisko_sablonas(); $vardas = trim( (string) $o->get_billing_first_name() );
		$z = array( '{vardas}' => $vardas ? $vardas : 'kliente', '{nr}' => (string) $o->get_order_number(), '{adresas}' => $s['adresas'], '{valandos}' => $s['valandos'], '{suma}' => self::eur( $o->get_total() ), '{tel}' => '+370 681 87787' );
		$ne = $o->is_paid() ? '' : strtr( $s['neapmoketa'], $z );
		$tekstas = strtr( str_replace( '{neapmoketa}', $ne, $s['tekstas'] ), $z );
		$tekstas = preg_replace( "/\n{3,}/", "\n\n", trim( $tekstas ) );
		$h = ''; foreach ( preg_split( "/\n\s*\n/", $tekstas ) as $p ) { $p = trim( $p ); if ( '' === $p ) { continue; } $h .= '<p>' . nl2br( esc_html( $p ) ) . '</p>'; }
		return array( strtr( $s['tema'], $z ), $h );
	}

	/** POST `ps_dl_ats_sablonas` (Sąskaitų lange, `manage_woocommerce`) — išsaugoti / atstatyti. */
	public static function ats_sablonas_vykdyti() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_die( 'Nepakanka teisių' ); }
		check_admin_referer( 'ps_dl_ats_sablonas' ); $atgal = admin_url( 'admin.php?page=' . self::SLUG . '&view=saskaitos' );
		if ( ! empty( $_POST['atstatyti'] ) ) { delete_option( self::ATS_LAISKAS_OPT ); wp_safe_redirect( add_query_arg( array( 'pd_ok' => 'dl_info', 'pd_nr' => rawurlencode( 'šablonas|„paruošta atsiimti“ laiško šablonas atstatytas į numatytą' ) ), $atgal ) ); exit; }
		$n = self::ats_laisko_numatytas(); $s = array();
		foreach ( array_keys( $n ) as $k ) { $v = isset( $_POST[ $k ] ) ? trim( (string) wp_unslash( $_POST[ $k ] ) ) : ''; $s[ $k ] = in_array( $k, array( 'tema', 'adresas', 'valandos' ), true ) ? sanitize_text_field( $v ) : sanitize_textarea_field( $v ); if ( '' === $s[ $k ] ) { $s[ $k ] = $n[ $k ]; } }
		update_option( self::ATS_LAISKAS_OPT, $s, false );
		wp_safe_redirect( add_query_arg( array( 'pd_ok' => 'dl_info', 'pd_nr' => rawurlencode( 'šablonas|„paruošta atsiimti“ laiško šablonas išsaugotas' ) ), $atgal ) ); exit;
	}

	/** Šablono forma Sąskaitų lange (po kreditinės šablono): tema, tekstas, neapmokėto pastraipa, adresas, darbo laikas. */
	protected static function ats_sablono_forma() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { return; }
		$s = self::ats_laisko_sablonas(); $n = self::ats_laisko_numatytas(); $keistas = $s !== $n;
		echo '<details class="dl-sabl"' . ( isset( $_GET['pd_nr'] ) && 0 === strpos( rawurldecode( (string) $_GET['pd_nr'] ), 'šablonas|„paruošta' ) ? ' open' : '' ) . '><summary>„Paruošta atsiimti“ laiško šablonas (Atsiėmimas AV)' . ( $keistas ? ' <span class="pilkas maz">(pakeistas)</span>' : ' <span class="pilkas maz">(numatytas)</span>' ) . '</summary>'
			. '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">' . wp_nonce_field( 'ps_dl_ats_sablonas', '_wpnonce', true, false ) . '<input type="hidden" name="action" value="ps_dl_ats_sablonas">'
			. '<p class="pilkas maz">Siunčia darbuotojas — skydelio „Paruošta atsiimti“ (varnelė „nesiųsti“). Vietaženkliai: {vardas} {nr} {adresas} {valandos} {suma} {neapmoketa} (pastraipa — tik neapmokėtam) {tel}. Tuščia eilutė — nauja pastraipa.</p>'
			. '<label>Tema<br><input type="text" name="tema" value="' . esc_attr( $s['tema'] ) . '"></label>'
			. '<label>Tekstas<br><textarea name="tekstas" rows="9">' . esc_textarea( $s['tekstas'] ) . '</textarea></label>'
			. '<label>Neapmokėto pastraipa ({neapmoketa})<br><textarea name="neapmoketa" rows="2">' . esc_textarea( $s['neapmoketa'] ) . '</textarea></label>'
			. '<label>Atsiėmimo adresas ({adresas})<br><input type="text" name="adresas" value="' . esc_attr( $s['adresas'] ) . '"></label>'
			. '<label>Darbo laikas ({valandos})<br><input type="text" name="valandos" value="' . esc_attr( $s['valandos'] ) . '"></label>'
			. '<div class="dl-sabl-v"><button class="v p" type="submit">Išsaugoti</button> <button class="v t" type="submit" name="atstatyti" value="1">Atstatyti numatytą</button></div></form></details>';
	}
