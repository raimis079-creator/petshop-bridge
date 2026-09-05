	/* ============================ v3.34: PINIGŲ PRIĖMIMO KVITAS (PPK) + telefoninio pavedimo likutis (Raimis 09-06: PPK 1–6, B 6) ============================ */

	/** Grynais apmokėtas užsakymas — `cod` (darbalaukio „Apmokėta grynais“; senesni testiniai „Apmokėta vietoje“) ir apmokėtas. Kortelių nėra (terminalo nėra — Raimis). */
	protected static function grynais( $o ) { return $o && 'cod' === $o->get_payment_method() && $o->is_paid(); }

	/** B (6): telefoninio (`_ps_telefonu`) pavedimu užsakymo likutis WC nurašomas TIK apmokėjus (processing), ne on-hold metu. WC `wc_maybe_reduce_stock_levels` (11.0): šis filtras `false` → f-ja baigia PRIEŠ `_order_stock_reduced` žymę (kitaip `woocommerce_can_reduce_order_stock` false paliktų žymę ir likutis nebūtų nurašytas ir vėliau). Kasos bacs — nekeista. */
	public static function telefonu_likutis( $trigger, $order_id ) {
		if ( ! $trigger ) { return $trigger; }
		$o = wc_get_order( (int) $order_id ); if ( ! $o || ! $o->get_meta( '_ps_telefonu' ) ) { return $trigger; }
		return ( 'on-hold' === $o->get_status() && ! $o->is_paid() ) ? false : $trigger;
	}

	/** Tas pats saugiklis tiesioginiam `wc_reduce_stock_levels( $order )` (žymės čia WC nerašo). */
	public static function telefonu_likutis_wc( $gali, $o ) {
		if ( ! $gali || ! ( $o instanceof WC_Order ) || ! $o->get_meta( '_ps_telefonu' ) ) { return $gali; }
		return ( 'on-hold' === $o->get_status() && ! $o->is_paid() ) ? false : $gali;
	}

	/** GET `kvitas` (skydelio „Sąskaitos“ → „Suformuoti kvitą“, dialogas): darbuotojas spaudžia, kai klientas MOKA grynais (Raimis: ne automatiškai). PPK numeris (sava eilė nuo 101), meta, PDF temos `base.php` `$template='receipt'`, pastaba, įvykis. Tik spausdinti — el. paštu nesiunčiamas. */
	protected static function kvitas_vykdyti( $o, $u ) {
		if ( ! self::grynais( $o ) ) { return array( 'dl_info', 'kvitas formuojamas tik grynais apmokėtam užsakymui' ); }
		$buvo = (string) $o->get_meta( '_petshop_ppk_number' ); if ( $buvo ) { return array( 'dl_info', 'kvitas ' . $buvo . ' jau suformuotas — PDF skydelio „Sąskaitos“ bloke' ); }
		$nr = self::kvitas_numeris( $o, $u ); $pdf = self::kvitas_pdf( $o );
		$o = wc_get_order( $o->get_id() );
		$o->add_order_note( sprintf( 'Darbalaukis: pinigų priėmimo kvitas %s — %s € grynais, pinigus priėmė %s%s. Kvitas tik spausdinamas (parašas ranka), klientui el. paštu NESIUNČIAMAS.', $nr, self::eur( $o->get_total() ), $u->display_name, $pdf ? '' : ' — PDF NESUGENERUOTAS' ), false, true ); $o->save();
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'kvitas', 'rezultatas' => $pdf ? 'ok' : 'klaida', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'po' => array( 'nr' => $nr, 'suma' => (float) $o->get_total(), 'pdf' => $pdf ? basename( $pdf ) : '' ), 'pastaba' => 'PPK ' . $nr . ' ' . self::eur( $o->get_total() ) . ' € grynais' ) ); }
		return array( $pdf ? 'dl_info' : 'dl_klaida', 'kvitas ' . $nr . ' (' . self::eur( $o->get_total() ) . ' €) suformuotas' . ( $pdf ? ' — atspausdink ir pasirašyk (skydelio „Sąskaitos“)' : ' — PDF NESUGENERUOTAS' ) );
	}

	/** PPK numeris — sava eilė `petshop_ppk_counter` (KITAS numeris, kaip AVPN / KR; dev'e nuo 101 → T-0 → 101). Meta: `_petshop_ppk_number`, `_petshop_ppk_date`, `_petshop_ppk_suma` (suma kvito momentu), `_petshop_ppk_kas` (pinigus priėmė). */
	protected static function kvitas_numeris( $o, $u ) {
		$nr = (string) $o->get_meta( '_petshop_ppk_number' ); if ( $nr ) { return $nr; }
		$n = max( 1, (int) get_option( self::PPK_COUNTER_OPT, 101 ) ); update_option( self::PPK_COUNTER_OPT, $n + 1, false );
		$nr = 'PPK' . str_pad( (string) $n, 6, '0', STR_PAD_LEFT );
		$o->update_meta_data( '_petshop_ppk_number', $nr ); $o->update_meta_data( '_petshop_ppk_date', current_time( 'Y-m-d' ) ); $o->update_meta_data( '_petshop_ppk_suma', number_format( (float) $o->get_total(), 2, '.', '' ) ); $o->update_meta_data( '_petshop_ppk_kas', $u->display_name ); $o->save();
		return $nr;
	}

	/** Kvito PDF — kaip `kreditine_pdf` (tas pats `$order` masyvas, logotipas, Dompdf A4), `$template='receipt'` (tema base.php v2.12 — atskira šaka, Raimis leido), `$order['receipt']` = kvito laukai. → `uploads/wcdn/receipt/Kvitas-PPK000101.pdf`, meta `_petshop_ppk_pdf`. */
	protected static function kvitas_pdf( $o ) {
		$tf = get_stylesheet_directory() . '/woocommerce-delivery-notes/base.php'; if ( ! file_exists( $tf ) || ! class_exists( 'Dompdf\\Dompdf' ) ) { return ''; }
		$nr = (string) $o->get_meta( '_petshop_ppk_number' ); if ( ! $nr ) { return ''; }
		$countries = WC()->countries ? WC()->countries->get_countries() : array(); $bc = $o->get_billing_country(); $bcn = isset( $countries[ $bc ] ) ? $countries[ $bc ] : $bc;
		$cp = trim( $o->get_billing_city() . ( $o->get_billing_postcode() ? ', ' . $o->get_billing_postcode() : '' ) );
		$suma = (float) $o->get_meta( '_petshop_ppk_suma' ); if ( $suma <= 0 ) { $suma = (float) $o->get_total(); }
		$avpn = (string) $o->get_meta( '_petshop_avpn_number' ); $vardas = trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ); $imone = trim( (string) $o->get_billing_company() ); $ik = trim( (string) $o->get_meta( '_billing_company_code' ) );
		$receipt = array( 'nr' => $nr, 'data' => (string) $o->get_meta( '_petshop_ppk_date' ), 'suma' => $suma, 'zodziais' => self::suma_zodziais( $suma ), 'paskirtis' => 'Už prekes pagal užsakymą Nr. ' . $o->get_order_number() . ( $avpn ? ', PVM sąskaita faktūra Nr. ' . $avpn : '' ), 'prieme' => (string) $o->get_meta( '_petshop_ppk_kas' ), 'moketojas' => $imone ? $imone . ( $ik ? ' (įm. k. ' . $ik . ')' : '' ) . ( $vardas ? ', ' . $vardas : '' ) : $vardas, 'kontaktas' => trim( $o->get_billing_phone() . ( $o->get_billing_email() ? ' · ' . $o->get_billing_email() : '' ) ) );
		$order = array( 'id' => $o->get_id(), 'orderNumber' => $o->get_order_number(), 'documentDate' => $receipt['data'] ? $receipt['data'] : date_i18n( 'Y-m-d' ), 'date' => $o->get_date_created() ? $o->get_date_created()->format( 'Y-m-d' ) : date( 'Y-m-d' ), 'paymentMethod' => $o->get_payment_method_title(),
			'billing' => array( 'name' => $vardas, 'address' => array_values( array_filter( array( $o->get_billing_address_1(), $o->get_billing_address_2(), $cp, $bcn ) ) ), 'phone' => $o->get_billing_phone(), 'email' => $o->get_billing_email() ), 'shipping' => array( 'name' => '', 'address' => array() ), 'receipt' => $receipt );
		$logo_url = ''; $logo_path = ''; $lid = get_theme_mod( 'site_logo' ); if ( $lid ) { $logo_url = wp_get_attachment_image_url( $lid, 'full' ); $logo_path = get_attached_file( $lid ); }
		$shop = array( 'logo' => $logo_url, 'logo_path' => $logo_path, 'name' => get_bloginfo( 'name' ) ); $settings = array( 'displayPriceInProductDetailsTable' => true ); $document = array(); $template = 'receipt'; $type = 'pdf'; $items = array(); $totals = array();
		ob_start(); include $tf; $body = ob_get_clean();
		$html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>@page{size:A4;margin:12mm 14mm;}body{margin:0;padding:0;}</style></head><body>' . $body . '</body></html>';
		$up = wp_upload_dir(); $dir = trailingslashit( $up['basedir'] ) . 'wcdn/receipt/'; wp_mkdir_p( $dir ); $file = $dir . 'Kvitas-' . $nr . '.pdf';
		try { $opt = new \Dompdf\Options(); $opt->set( 'isRemoteEnabled', true ); $opt->set( 'isHtml5ParserEnabled', true ); $opt->set( 'isFontSubsettingEnabled', true ); $opt->set( 'chroot', array( realpath( ABSPATH ), realpath( $up['basedir'] ) ) ); $d = new \Dompdf\Dompdf( $opt ); $d->loadHtml( $html, 'UTF-8' ); $d->setPaper( array( 0, 0, 595.28, 841.89 ), 'portrait' ); $d->render(); file_put_contents( $file, $d->output() ); }
		catch ( Throwable $ex ) { return ''; }
		if ( ! file_exists( $file ) ) { return ''; }
		$o->update_meta_data( '_petshop_ppk_pdf', $file ); $o->save();
		return $file;
	}

	/** Suma žodžiais (LT kvitui): 24,47 → „Dvidešimt keturi eurai 47 ct“; 1 200,00 → „Vienas tūkstantis du šimtai eurų 00 ct“. Iki 999 999,99. Galūnės: 1 → euras / tūkstantis; 2–9 (ne 12–19) → eurai / tūkstančiai; 0, 10–19, x0 → eurų / tūkstančių. */
	protected static function suma_zodziais( $v ) {
		$v = round( abs( (float) $v ), 2 ); $eur = (int) floor( $v + 0.0000001 ); $ct = (int) round( ( $v - $eur ) * 100 ); if ( $ct >= 100 ) { $eur++; $ct -= 100; }
		$vnt = array( '', 'vienas', 'du', 'trys', 'keturi', 'penki', 'šeši', 'septyni', 'aštuoni', 'devyni', 'dešimt', 'vienuolika', 'dvylika', 'trylika', 'keturiolika', 'penkiolika', 'šešiolika', 'septyniolika', 'aštuoniolika', 'devyniolika' );
		$des = array( '', '', 'dvidešimt', 'trisdešimt', 'keturiasdešimt', 'penkiasdešimt', 'šešiasdešimt', 'septyniasdešimt', 'aštuoniasdešimt', 'devyniasdešimt' );
		$trys = function ( $n ) use ( $vnt, $des ) { $z = array(); $s = intdiv( $n, 100 ); $l = $n % 100; if ( $s ) { $z[] = 1 === $s ? 'šimtas' : $vnt[ $s ] . ' šimtai'; } if ( $l < 20 ) { if ( $l ) { $z[] = $vnt[ $l ]; } } else { $z[] = $des[ intdiv( $l, 10 ) ] . ( $l % 10 ? ' ' . $vnt[ $l % 10 ] : '' ); } return implode( ' ', $z ); };
		$gal = function ( $n, $a, $b, $c ) { $l = $n % 100; $d = $n % 10; if ( 1 === $d && 11 !== $l ) { return $a; } if ( $d >= 2 && $d <= 9 && ( $l < 10 || $l > 19 ) ) { return $b; } return $c; };
		$z = array(); $t = intdiv( $eur, 1000 ); $r = $eur % 1000;
		if ( $t ) { $z[] = $trys( $t ) . ' ' . $gal( $t, 'tūkstantis', 'tūkstančiai', 'tūkstančių' ); }
		if ( $r ) { $z[] = $trys( $r ); } if ( ! $eur ) { $z[] = 'nulis'; }
		$s = implode( ' ', $z ) . ' ' . $gal( $eur, 'euras', 'eurai', 'eurų' ) . ' ' . str_pad( (string) $ct, 2, '0', STR_PAD_LEFT ) . ' ct';
		return mb_strtoupper( mb_substr( $s, 0, 1 ) ) . mb_substr( $s, 1 );
	}
