<?php
/**
 * Petshop AV Dropship v1.18 (H261) — AV BLOKAS: LIPDUKŲ SKAIČIUS, BE SVORIO, BENDRAS MANIFESTAS.
 *
 * KODĖL (Raimis, H261): laiške AV daliai nereikia adreso ir svorio, manifestas
 * vienas su klientais, tik nurodyti kiek lipdukų. DABAR: blokas „Į AV sandėlį"
 * be svorio/adreso; formoje „lipdukų [n]" (partijos dėžės) → Tiekimas::paruosti
 * (registruoja n pack'ų į tiekėjo manifestą); partijos pack'ai dedami į tą patį
 * manifesto PDF; laiško dalis — Tiekimas::laisko_dalis() (viena tiesos vieta).
 *
 * Petshop AV Dropship v1.17 (H260) — PARTIJA Į AV TAME PAČIAME LAIŠKE.
 *
 * KODĖL (Raimis, H260): „užsakymą į AV sandėlį siųsiu tiekėjui kartu vienu
 * laišku su kitais užsakymais". DABAR kortelėje blokas „Į AV sandėlį — partija
 * #n" (Tiekimo kaupiama partija su eilutėmis): pristatymo būdas, svoris,
 * varnelė „įtraukti į šį laišką" (įjungta). Siunčiant: Tiekimas::paruosti()
 * (Venipak registracija, lipdukas), laiške antra dalis „Prekės į mūsų sandėlį",
 * po sėkmingo wp_mail — Tiekimas::uzdaryti_po_laisko(). Nepavykus — partija
 * lieka atvira. Be pristatymo būdo — neįtraukiama, nuoroda į Tiekimą.
 *
 * Petshop AV Dropship v1.16 (H259) — EIGA KORTELĖJE: KAS ČIA DAROMA IR KAS BUS PO TO.
 *
 * KODĖL (Raimis, H259): „spaudi Perduoti, atsidaro langas — nu ir ką? balaganas".
 * Langas rodė lentelę ir mygtukus, bet ne KELIĄ. DABAR kiekvienos kortelės
 * viršuje — eigos juosta su būkle: 1 siunta Venipak (registruota / NE) →
 * 2 laiškas (peržiūra, prierašas) → 3 gavėjai → 4 Siųsti, ir kas įvyks po to.
 * Atėjus su vienu užsakymu, kai to paties tiekėjo laukia daugiau — pasiūlymas
 * „sudėti visus į vieną laišką". Paštomatas: dėžių laukelis grąžintas —
 * kelios dėžės = kelios siuntos tam pačiam paštomatui (desk v3.46).
 *
 * Petshop AV Dropship v1.15 (H258) — VIENA KORTELĖ ABIEM LANGAMS + DĖŽIŲ SKAIČIUS.
 *
 * KODĖL (Raimis, H258): „panaikinai laiško redagavimą; kur kopija sau; o jei
 * reikia ne vieno lipduko; vienur darai, kitur naikini". „Laukia išsiuntimo"
 * rodė tik skaitomą peržiūrą; prierašas, varnelės, siuntimas gyveno tik
 * ps-dropship ekrane. DABAR kortelė viena — `kortele()` — abiem langams.
 * Prie kiekvieno užsakymo — dėžių skaičius su „Perregistruoti" (desk vp_reg
 * perreg=1): daugiau dėžių → daugiau lipdukų.
 *
 * Petshop AV Dropship v1.14 (H257) — VIENAS LAIŠKAS TIEKĖJUI SU VISAIS UŽSAKYMAIS + TIESA PO SIUNTIMO.
 *
 * KODĖL (Raimis, H257): „kam siųsti tiekėjui po 1 laišką? kur langas paruošti
 * siųsti laiškai? sistema neišdirbta". Faktai: (1) „Laukia išsiuntimo" mygtukas
 * „Eiti perduoti X" grąžindavo į Naujų sąrašą, kur kiekviena eilutė turi savo
 * „Perduoti" — po laišką užsakymui; vieną laišką visiems reikėjo susirinkti
 * varnelėmis pačiam; (2) po sėkmingo išsiuntimo ekranas rodė „dropship prekių
 * nėra" — atrodė, kad nieko neįvyko. DABAR: „Laukia išsiuntimo" prie tiekėjo —
 * mygtukas „Perduoti X — n užsak. vienu laišku" (visi to tiekėjo neperduoti
 * užsakymai iškart perdavimo ekrane, vienas laiškas); po siuntimo grįžtama į
 * „Laukia išsiuntimo" su aiškia žinute (išsiųsta/nepavyko + wp_mail klaidos
 * tekstas); pasirinkimas išvalomas. Parametrai psl_* — `ps_src` perima senas
 * snippetas „sources-2.2" (JSON „Nezinomas veiksmas"), todėl ne ps_*.
 *
 * Petshop AV Dropship v1.13 (H255) — SIUNTOS VARTAI PRIEŠ LAIŠKĄ.
 *
 * KODĖL (H253 E2E): „Perduoti“ kelias Venipak neregistruoja, o laiškas su
 * varnele „pridėti lipdukus“ išeidavo BE lipdukų ir be jokio įspėjimo, jei
 * siunta dar neregistruota — tiekėjas gauna užsakymą, kurio negali išsiųsti.
 * DABAR: kortelėje prie tiekėjo — kiek užsakymų be registruotos siuntos; jei
 * yra, siuntimo mygtukas išjungtas, šalia „Registruoti Venipak (n)“ (desk vp_reg
 * su šio sandėlio manifestu) ir „Siųsti be lipdukų“ išimtims (sąmoningai).
 *
 * Petshop AV Dropship v1.12 (H251) — LAIŠKŲ LANGAS: „LAUKIA IŠSIUNTIMO" + „IŠSIŲSTI".
 *
 * KODĖL (Raimis, H251): „reikia lauko, kur dar neišsiųsti laiškai, jei noriu ko
 * nors pasižiūrėti". DABAR Įrankiai → „Laiškai" turi du skirtukus:
 *   • Laukia išsiuntimo — pagal tiekėją sugrupuoti NEPERDUOTI užsakymai su
 *     laiško peržiūra (tiksliai tas tekstas, kuris išeis) ir mygtuku „Perduoti";
 *     čia pat ir kaupiamos tiekimo partijos (prekės į AV).
 *   • Išsiųsti — archyvas (200 paskutinių) su pilnu tekstu.
 *
 * Petshop AV Dropship v1.11 (H250) — LAIŠKO ADRESATAI IR IŠSIŲSTŲ LAIŠKŲ ARCHYVAS.
 *
 * KODĖL (Raimis, H250): „kur visi šitie laiškai yra? sakei padarei, kad laiškas
 * ateina į terra@petshop.lt — kur?" — varnelė buvo padaryta TIK tiekimo partijų
 * lange (petshop-av-tiekimas), o šitas ekranas siuntė tiesiai tiekėjui, be
 * kopijos. DABAR čia tos pačios dvi varnelės („siųsti tiekėjui" / „kopija man"),
 * bendras nustatymas su Tiekimu (`ps_tiek_laiskai`), o kiekvienas išsiųstas
 * laiškas įrašomas į archyvą (`ps_laisku_archyvas`, 200 paskutinių) — matomas
 * skiltyje Įrankiai → „Išsiųsti laiškai" su gavėju, laiku ir pilnu tekstu.
 *
 * Petshop AV Dropship v1.10 (H240) — perdavimo ekranas priima `src` filtrą:
 * galima paleisti VIENĄ sandėlį, o kitą pasilikti, kol siuntos keliaus kartu.
 *
 * v1.9 (H239) — laiškai gerbia MIŠRAUS SPRENDIMO PLANĄ.
 *
 * Nuo H239 sprendimas kortelėje tik UŽRAŠOMAS, o vykdo Raimis atskiru mygtuku.
 * Tarp tų dviejų momentų eilutė dar nėra tiekimo lentelėje, bet jau žinoma, kad
 * ji keliaus per AV — todėl į tiekėjo laišką ji NEPATENKA. Kitaip netyčia
 * paspaudus „Perduoti tiekėjams“ prekė būtų užsakyta du kartus.
 *
 * v1.8 (H234) — 🔴 PERDAVIMO ŽYMĖ PAGAL SANDĖLĮ.
 *
 * KODĖL (H234, išmatuota su #35066 VF+PRINS): `_ps_dropship_sent` buvo VISO
 * užsakymo žymė. Perdavus VF, `grupuoti()` visą užsakymą praleisdavo — ir
 * PRINS laiško NIEKADA nebūtų gavęs (matavimas: [vf,prins] -> []). Mišrus
 * užsakymas su dviem tiekėjais prarasdavo antrąjį tyliai.
 *
 * DABAR: `_ps_dropship_sent_src` = {"vf":"2026-08-23 11:04"} — kiekvienam
 * sandėliui sava žymė. Senas raktas RAŠOMAS toliau (kiti moduliai jį skaito) ir
 * SKAITOMAS kaip atsarga: jei yra tik jis, žiūrima į `_ps_dropship_to`, o jei ir
 * to nėra — laikoma, kad perduota viskas (saugi pusė: geriau neišsiųsti antro
 * laiško, nei užsakyti prekę du kartus).
 *
 * v1.7 (H233) — KONSOLIDACIJA: eilutės, paimtos į AV (tiekimo
 * lentelė arba _ps_konsolidacija), į tiekėjų laiškus NEBEPATENKA.
 *
 * KODĖL (H233, rasta gyvai su testiniu #35066): eilutė jau gulėjo tiekimo
 * partijoje, o `grupuoti()` ją vis tiek grąžindavo į laišką. Paspaudus
 * „Perduoti tiekėjams" ta pati prekė būtų užsakyta DU kartus: tiekėjas siųstų
 * klientui, ir ta pati prekė jau keliautų į AV. Niekas eilutės nepažymėdavo.
 *
 * v1.6 (H231): gyvas prierašas peržiūroje rodomas TIKROJE vietoje (prieš linkėjimus), ne apačioje (v1.5: prierašas).
 *
 * v1.2: ZB kelias užbaigtas (§19.12 uodega). ZB kortelėje: ZB kodas iš
 * ps_sources (fallback SKU), mygtukas „Kopijuoti" (kodas TAB kiekis — įklijavimui
 * į ZB sistemą), lipduko atsisiuntimas po vieną užsakymą (Raimis prikabina ZB
 * sistemoje pats) ir „Pažymėti ZB perduotais" (laiško nėra, todėl žymė rankinė).
 *
 * KAIP DABAR DAROMA RANKOMIS (Raimio laiškas 2026-08-05, FW: užsakymas):
 *   vienas laiškas dienai iš terra@petshop.lt · lentelė Nr · vardas · prekė · kiekis
 *   priedai: lipdukai, KIEKVIENAS pavadintas „772 Simas Šimkus.pdf"
 *   plius manifestas partijai („Sender's shipment bill", A4, kurjerio parašui)
 *   Raimis: „Kiekvieną lipduką išsaugau ranka, dabar pas mus labai daug rankinio darbo."
 *
 * TECHNINIS PAGRINDAS (s501):
 *   AJAX `woocommerce_shopup_venipak_shipping_get_label_pdf` grąžina VIENO užsakymo
 *   lipduką → bendro PDF skaidyti NEREIKIA.
 *   `pack_numbers` yra MASYVAS → daugiapakuotės aptarnaujamos tuo pačiu keliu.
 *   Lipdukas 283×425 pt = 10×15 cm (Raimio etikečių spausdintuvas), laukas „1 \ 1".
 *   Manifestas: `get_manifest_pdf`.
 *
 * KODĖL NE AUTOMATINIS SIUNTIMAS: laiškas tiekėjui = užsakymas su Raimio pinigais.
 * Klaidingas kiekis ar dublikatas paaiškėtų tik atvažiavus siuntai.
 * Prie dešimčių užsakymų peržiūra kainuoja minutę, o saugo nuo realios prekės.
 * SISTEMA PARUOŠIA — RAIMIS PATVIRTINA.
 *
 * KODAI: VF ir Quattro kodai SUTAMPA su mūsų SKU. Prins ir Ambrosia atsirenka
 * pagal pavadinimą ir barkodą → jiems rodom ir EAN.
 *
 * ZB — ATSKIRA TEMA: reikia vesti į jų sistemą prisijungus, laiško nebus.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_AV_Dropship {

	const VEIKSMAS = 'ps_dropship';
	const OPT_EMAIL = 'ps_tiekeju_pastai';
	/** Paskutinė wp_mail klaida (H257) — kad po nepavykusio siuntimo būtų matomas tekstas, ne tyla. */
	public static $pasto_klaida = '';

	/** Perdavimo žymės. SENA — viso užsakymo (paliekama), NAUJA — pagal sandėlį. */
	const META_SENT     = '_ps_dropship_sent';
	const META_SENT_TO  = '_ps_dropship_to';
	const META_SENT_SRC = '_ps_dropship_sent_src';

	/** Tiekėjai. El. paštai suvedami nustatymuose (Raimis atsiųs). */
	public static function tiekejai() {
		return [
			'vf'          => [ 'Vetfarmas',      'sku' ],
			'quattro'     => [ 'Quattro / Kauno grūdai', 'sku' ],
			'prins'       => [ 'Prins Petfoods', 'sku_ean' ],
			'ambrosia'    => [ 'Ambrosia',       'sku_ean' ],
			'belcor_tofu' => [ 'Belacor',        'sku_ean' ],
			'zb'          => [ 'Žalioji Banga',  'sku' ],
		];
	}

	public static function init() {
		add_filter( 'bulk_actions-woocommerce_page_wc-orders', [ __CLASS__, 'veiksmas' ], 31 );
		add_filter( 'bulk_actions-edit-shop_order', [ __CLASS__, 'veiksmas' ], 31 );
		add_filter( 'handle_bulk_actions-woocommerce_page_wc-orders', [ __CLASS__, 'vykdyti' ], 10, 3 );
		add_filter( 'handle_bulk_actions-edit-shop_order', [ __CLASS__, 'vykdyti' ], 10, 3 );
		add_action( 'admin_menu', [ __CLASS__, 'meniu' ], 20 );
		add_action( 'admin_footer', [ __CLASS__, 'skriptas' ] );
		add_action( 'admin_post_ps_dropship_send', [ __CLASS__, 'siusti' ] );
		add_action( 'admin_post_ps_dropship_visi', [ __CLASS__, 'perduoti_visus' ] );
		add_action( 'wp_mail_failed', function ( $e ) { self::$pasto_klaida = is_wp_error( $e ) ? $e->get_error_message() : 'wp_mail klaida'; } );
		add_action( 'admin_post_ps_dropship_nust', [ __CLASS__, 'saugoti_nustatymus' ] );
		add_action( 'admin_post_ps_dropship_lipdukas', [ __CLASS__, 'lipdukas_atsisiusti' ] );
		add_action( 'admin_post_ps_dropship_zb_done', [ __CLASS__, 'zb_pazymeti' ] );
	}

	public static function veiksmas( $v ) {
		$v[ self::VEIKSMAS ] = 'Petshop: perduoti tiekėjams';
		return $v;
	}

	public static function vykdyti( $redirect, $veiksmas, $ids ) {
		if ( self::VEIKSMAS !== $veiksmas ) { return $redirect; }
		$ids = array_map( 'intval', (array) $ids );
		if ( ! $ids ) { return $redirect; }
		set_transient( 'ps_dropship_' . get_current_user_id(), $ids, 1800 );
		return add_query_arg( [ 'page' => 'ps-dropship' ], admin_url( 'admin.php' ) );
	}

	public static function meniu() {
		add_submenu_page( null, 'Perduoti tiekėjams', 'Perduoti tiekėjams',
			'edit_shop_orders', 'ps-dropship', [ __CLASS__, 'puslapis' ] );
		add_submenu_page( 'ps-desk', 'Laiškai', 'Laiškai', 'edit_shop_orders',
			'ps-laiskai', [ __CLASS__, 'archyvo_puslapis' ] );
		add_submenu_page( 'woocommerce', 'Tiekėjų el. paštai', 'Tiekėjų el. paštai',
			'manage_woocommerce', 'ps-dropship-nustatymai', [ __CLASS__, 'nustatymai' ] );
	}

	/** Sugrupuoja pažymėtus užsakymus pagal tiekėją. */
	protected static function grupuoti( array $ids ) {
		$g = [];
		foreach ( $ids as $id ) {
			$o = wc_get_order( $id );
			if ( ! $o ) { continue; }

			foreach ( $o->get_items() as $iid => $item ) {
				$src = $item->get_meta( '_ps_source' );
				if ( ! $src || 'av' === $src ) { continue; }             // AV renkam patys
				if ( self::konsoliduota( $o, $iid, $item ) ) { continue; } // parsivežam į AV — tiekėjui nerašom
				if ( self::perduota( $o, $src ) ) { continue; }            // šiam sandėliui jau išsiųsta (H234)
				$pid = (int) $item->get_product_id();
				$p   = $item->get_product();

				if ( ! isset( $g[ $src ] ) ) { $g[ $src ] = []; }
				if ( ! isset( $g[ $src ][ $id ] ) ) {
					$g[ $src ][ $id ] = [
						'nr'       => $o->get_order_number(),
						'klientas' => trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ),
						'metodas'  => $o->get_shipping_method(),
						'pakuociu' => self::pakuociu( $o ),
						'eilutes'  => [],
					];
				}
				$g[ $src ][ $id ]['eilutes'][] = [
					'pav' => $item->get_name(),
					'qty' => (int) $item->get_quantity(),
					'sku' => $p ? $p->get_sku() : '',
					'ean' => $p ? ( $p->get_meta( '_ean' ) ?: $p->get_global_unique_id() ) : '',
					'zb'  => 'zb' === $src ? self::zb_kodas( $pid, $p ? $p->get_sku() : '' ) : '',
				];
			}
		}
		return $g;
	}

	/**
	 * Kuriems sandėliams šis užsakymas jau perduotas.
	 *
	 * Grąžina masyvą sandėlis => laikas. Senus užsakymus (tik `_ps_dropship_sent`)
	 * išplečia: jei žinomas `_ps_dropship_to` — tik tam sandėliui, jei ne —
	 * visiems užsakymo tiekėjams (saugi pusė, žr. antraštę).
	 */
	public static function perduotos( $order ) {
		$m = $order->get_meta( self::META_SENT_SRC );
		$j = is_array( $m ) ? $m : json_decode( (string) $m, true );
		if ( is_array( $j ) && $j ) { return $j; }

		$sena = $order->get_meta( self::META_SENT );
		if ( ! $sena ) { return array(); }

		$kam = $order->get_meta( self::META_SENT_TO );
		if ( $kam ) { return array( $kam => $sena ); }

		$visi = array();
		foreach ( $order->get_items() as $item ) {
			$s = $item->get_meta( '_ps_source' );
			if ( $s && 'av' !== $s ) { $visi[ $s ] = $sena; }
		}
		return $visi;
	}

	/** Ar perduota konkrečiam sandėliui (arba bent vienam, jei $src tuščias). */
	public static function perduota( $order, $src = '' ) {
		$j = self::perduotos( $order );
		return '' === $src ? ! empty( $j ) : ! empty( $j[ $src ] );
	}

	/** Kurie užsakymo tiekėjai DAR neperduoti. */
	public static function neperduotos( $order ) {
		$j = self::perduotos( $order );
		$liko = array();
		foreach ( $order->get_items() as $iid => $item ) {
			$s = $item->get_meta( '_ps_source' );
			if ( ! $s || 'av' === $s ) { continue; }
			if ( self::konsoliduota( $order, $iid, $item ) ) { continue; }
			if ( empty( $j[ $s ] ) ) { $liko[ $s ] = 1; }
		}
		return array_keys( $liko );
	}

	/**
	 * Pažymi, kad ŠIS sandėlis perduotas. Užsakymo neišsaugo — kviečiantysis.
	 * Rašo ir seną raktą: jį skaito desk ir SLA sluoksnis.
	 */
	public static function zymeti_perduota( $order, $src ) {
		$dabar = current_time( 'mysql' );
		$j = self::perduotos( $order );
		$j[ $src ] = $dabar;
		$order->update_meta_data( self::META_SENT_SRC, wp_json_encode( $j ) );
		$order->update_meta_data( self::META_SENT, $dabar );
		$order->update_meta_data( self::META_SENT_TO, $src );
		return $j;
	}

	/**
	 * Ar ši eilutė paimta į AV (konsoliduojama), o ne siunčiama tiekėjo tiesiai klientui?
	 *
	 * Du požymiai, abu tinka:
	 *   1. `_ps_konsolidacija` ant eilutės — mišraus užsakymo sprendimas;
	 *   2. eilutė guli tiekimo lentelėje (Petshop_AV_Tiekimas) — senesnis kelias
	 *      per „Į tiekimo lentelę“ / „Parsivežti į AV“ Klausimuose.
	 *
	 * Bet kuriuo atveju prekę užsakome į AV patys — tiekėjui apie ją nerašom,
	 * kitaip ta pati prekė būtų užsakyta du kartus (H233).
	 */
	protected static function konsoliduota( $order, $item_id, $item ) {
		if ( $item->get_meta( '_ps_konsolidacija' ) ) { return true; }

		// Sprendimas jau priimtas, bet dar neįvykdytas — laiško vis tiek nerašom (H239).
		$m = $order->get_meta( '_ps_misrus_sprendimas' );
		$j = is_array( $m ) ? $m : json_decode( (string) $m, true );
		$src = $item->get_meta( '_ps_source' );
		if ( is_array( $j ) && $src && isset( $j[ $src ] ) && 'av' === $j[ $src ] ) { return true; }

		if ( class_exists( 'Petshop_AV_Tiekimas' ) ) {
			$b = Petshop_AV_Tiekimas::eilutes_bukle( $order->get_id(), (int) $item_id );
			if ( $b ) { return true; }
		}
		return false;
	}

	/** Laiško adresatai — bendras nustatymas su Tiekimo moduliu (H250). */
	public static function laisko_nust() {
		$v = (array) get_option( 'ps_tiek_laiskai', [] );
		return [
			'tiekejui' => ! empty( $v['tiekejui'] ),
			'man'      => isset( $v['man'] ) ? ! empty( $v['man'] ) : true,
		];
	}

	/** Įrašo išsiųstą laišką į archyvą (200 paskutinių). */
	public static function archyvuoti( $gavejai, $tema, $html, $priedai = [], $kontekstas = '' ) {
		$a = (array) get_option( 'ps_laisku_archyvas', [] );
		array_unshift( $a, [
			'laikas'  => current_time( 'mysql' ),
			'kam'     => implode( ', ', (array) $gavejai ),
			'tema'    => $tema,
			'kont'    => $kontekstas,
			'priedai' => array_map( 'basename', (array) $priedai ),
			'html'    => $html,
		] );
		update_option( 'ps_laisku_archyvas', array_slice( $a, 0, 200 ), false );
	}

	/** Išsiųstų laiškų archyvas — vienoje vietoje matai, kas kam išėjo (H250). */
	/** Visi neperduoti užsakymai (ne tik pažymėti) — sugrupuoti pagal tiekėją. */
	public static function laukiantys_perdavimo() {
		$ids = wc_get_orders( array(
			'limit'  => 200,
			'type'   => 'shop_order',
			'status' => array( 'processing' ),
			'return' => 'ids',
		) );
		$tinka = array();
		foreach ( (array) $ids as $oid ) {
			$o = wc_get_order( $oid );
			if ( $o && self::neperduotos( $o ) ) { $tinka[] = $oid; }
		}
		return $tinka ? self::grupuoti( $tinka ) : array();
	}

	public static function archyvo_puslapis() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		$a   = (array) get_option( 'ps_laisku_archyvas', [] );
		$z   = isset( $_GET['z'] ) ? absint( $_GET['z'] ) : -1;
		$sk  = isset( $_GET['b'] ) ? sanitize_key( $_GET['b'] ) : 'laukia';
		echo '<div class="wrap"><h1>Laiškai tiekėjams</h1>';
		if ( isset( $_GET['psl_sent'] ) ) { // H257: kas įvyko po siuntimo — be spėlionių.
			$t2  = self::tiekejai();
			$ss  = sanitize_key( $_GET['psl_src'] ?? '' );
			$sv  = $t2[ $ss ][0] ?? strtoupper( $ss );
			$sn  = absint( $_GET['psl_n'] ?? 0 );
			$skam = sanitize_text_field( rawurldecode( wp_unslash( $_GET['psl_kam'] ?? '' ) ) );
			$se  = sanitize_text_field( rawurldecode( wp_unslash( $_GET['psl_err'] ?? '' ) ) );
			$sp  = absint( $_GET['psl_p'] ?? 0 );
			if ( '1' === (string) $_GET['psl_sent'] ) {
				printf( '<div class="notice notice-success"><p><b>Išsiųsta:</b> %s — %d užsak. vienu laišku%s, gavėjai: %s. Užsakymai pažymėti perduotais.</p></div>',
					esc_html( $sv ), $sn, $sp ? ' + partija #' . $sp . ' į AV (uždaryta, laukiam prekių)' : '', esc_html( $skam ) );
			} elseif ( '3' === (string) $_GET['psl_sent'] ) {
				printf( '<div class="notice notice-error"><p><b>NEIŠSIŲSTA:</b> %s — partijos #%d paruošti nepavyko (%s). Laiškas neišėjo, užsakymai liko neperduoti, partija atvira.</p></div>',
					esc_html( $sv ), $sn, esc_html( $se ) );
			} elseif ( '2' === (string) $_GET['psl_sent'] ) {
				printf( '<div class="notice notice-warning"><p>%s neturi neperduotų užsakymų — nieko nesiųsta.</p></div>', esc_html( $sv ) );
			} else {
				printf( '<div class="notice notice-error"><p><b>NEIŠSIŲSTA:</b> %s — %d užsak. Laiškas nepasiekė pašto serverio%s. Užsakymai LIKO neperduoti — bandyk dar kartą arba tikrink SMTP.</p></div>',
					esc_html( $sv ), $sn, $se ? ' (' . esc_html( $se ) . ')' : '' );
			}
		}
		printf( '<p><a class="button" href="%s">← Petshop užsakymai</a></p>',
			esc_url( admin_url( 'admin.php?page=ps-desk' ) ) );

		$g = ( 'laukia' === $sk && $z < 0 ) ? self::laukiantys_perdavimo() : array();
		echo '<h2 class="nav-tab-wrapper">';
		printf( '<a class="nav-tab %s" href="%s">Laukia išsiuntimo%s</a>',
			'laukia' === $sk ? 'nav-tab-active' : '',
			esc_url( admin_url( 'admin.php?page=ps-laiskai&b=laukia' ) ),
			$g ? ' (' . count( $g ) . ')' : '' );
		printf( '<a class="nav-tab %s" href="%s">Išsiųsti (%d)</a>',
			'issiusti' === $sk ? 'nav-tab-active' : '',
			esc_url( admin_url( 'admin.php?page=ps-laiskai&b=issiusti' ) ), count( $a ) );
		echo '</h2>';

		if ( 'laukia' === $sk && $z < 0 ) {
			self::laukianciu_sarasas( $g );
			echo '</div>';
			return;
		}

		if ( ! $a ) {
			echo '<p>Kol kas nieko neišsiųsta. Čia kaupsis visi laiškai tiekėjams — kam, kada, su kokiais priedais.</p></div>';
			return;
		}
		if ( isset( $a[ $z ] ) ) {
			$l = $a[ $z ];
			printf( '<h2>%s</h2><p><b>Kam:</b> %s<br><b>Kada:</b> %s<br><b>Priedai:</b> %s</p>',
				esc_html( $l['tema'] ), esc_html( $l['kam'] ),
				esc_html( mysql2date( 'Y-m-d H:i', $l['laikas'] ) ),
				$l['priedai'] ? esc_html( implode( ', ', $l['priedai'] ) ) : '—' );
			printf( '<p><a class="button" href="%s">← Visi laiškai</a></p>',
				esc_url( admin_url( 'admin.php?page=ps-laiskai' ) ) );
			echo '<div style="background:#fff;border:1px solid #ddd;padding:16px;max-width:900px">'
				. wp_kses_post( $l['html'] ) . '</div></div>';
			return;
		}

		echo '<table class="widefat striped"><thead><tr><th style="width:140px">Kada</th><th>Kam</th>
			<th>Tema</th><th>Priedai</th><th></th></tr></thead><tbody>';
		foreach ( $a as $i => $l ) {
			printf( '<tr><td>%s</td><td>%s</td><td>%s<div style="color:#666;font-size:12px">%s</div></td>
				<td>%s</td><td><a class="button button-small" href="%s">Peržiūrėti</a></td></tr>',
				esc_html( mysql2date( 'm-d H:i', $l['laikas'] ) ),
				esc_html( $l['kam'] ),
				esc_html( $l['tema'] ),
				esc_html( $l['kont'] ?? '' ),
				$l['priedai'] ? count( $l['priedai'] ) . ' vnt.' : '—',
				esc_url( admin_url( 'admin.php?page=ps-laiskai&z=' . (int) $i ) ) );
		}
		echo '</tbody></table></div>';
	}

	/** „Laukia išsiuntimo": ką sistema paruošė, bet dar neišsiuntė. */
	protected static function laukianciu_sarasas( $g ) {
		global $wpdb;
		$t      = self::tiekejai();
		$pastai = (array) get_option( self::OPT_EMAIL, [] );
		if ( ! $g ) {
			echo '<p>Nė vienam tiekėjui laiško nelaukia — viskas perduota.</p>';
		}
		// H258: ta pati pilna kortelė kaip „Perduoti tiekėjams" — prierašas, varnelės, siuntimas čia pat.
		echo '<p class="description">Siunčiama iš <code>terra@petshop.lt</code>. AV prekės į laiškus nepatenka. Vienas laiškas — visi tiekėjo užsakymai.</p>';
		foreach ( $g as $src => $uzsakymai ) {
			self::kortele( $src, $uzsakymai, admin_url( 'admin.php?page=ps-laiskai&b=laukia' ) );
		}
		self::kortelės_stilius();

		// Kaupiamos tiekimo partijos — laiškas dar nesuformuotas.
		$p = $wpdb->get_results( "SELECT id, tiekejas FROM {$wpdb->prefix}ps_tiekimas p
			WHERE busena='kaupiama' AND EXISTS
			(SELECT 1 FROM {$wpdb->prefix}ps_tiekimas_eil e WHERE e.partija_id=p.id)" );
		if ( $p ) {
			echo '<div class="ps-tiek"><div class="ps-tiek-h"><h2>Prekės į AV sandėlį</h2>
				<span>kaupiamos partijos — laiškas išeis paspaudus „Užsakyti iš tiekėjo"</span></div>
				<table class="widefat striped"><tbody>';
			foreach ( $p as $r ) {
				printf( '<tr><td>%s</td><td>partija #%d</td><td class="ps-r"><a href="%s">Atidaryti Tiekimą →</a></td></tr>',
					esc_html( self::tiekejai()[ $r->tiekejas ][0] ?? strtoupper( $r->tiekejas ) ),
					(int) $r->id,
					esc_url( admin_url( 'admin.php?page=ps-tiekimas&b=kaupiama' ) ) );
			}
			echo '</tbody></table></div>';
		}
	}

	/** Kiek lipdukų šiam užsakymui (pack_numbers ilgis). */
	protected static function pakuociu( $order ) {
		$d = json_decode( (string) $order->get_meta( 'venipak_shipping_order_data' ), true );
		if ( is_array( $d ) && ! empty( $d['pack_numbers'] ) ) { return count( (array) $d['pack_numbers'] ); }
		return 0;
	}

	/** ZB kodas iš ps_sources (supplier_sku); atsargai — produkto SKU. */
	protected static function zb_kodas( $product_id, $fallback_sku ) {
		global $wpdb;
		static $cols = null;
		$t = $wpdb->prefix . 'ps_sources';
		if ( null === $cols ) {
			$cols = (array) $wpdb->get_col( "SHOW COLUMNS FROM {$t}" );
		}
		if ( in_array( 'product_id', $cols, true ) && in_array( 'supplier_sku', $cols, true ) ) {
			$stulp = in_array( 'source', $cols, true ) ? 'source' : ( in_array( 'supplier', $cols, true ) ? 'supplier' : ( in_array( 'saltinis', $cols, true ) ? 'saltinis' : '' ) );
			if ( $stulp ) {
				$k = $wpdb->get_var( $wpdb->prepare(
					"SELECT supplier_sku FROM {$t} WHERE product_id=%d AND {$stulp}='zb' LIMIT 1", $product_id ) );
				if ( $k ) { return (string) $k; }
			}
		}
		return (string) $fallback_sku;
	}

	/** Lipduko failo vardas — TAS PATS formatas kaip Raimio: „772 Simas Šimkus.pdf" */
	public static function lipduko_vardas( $order ) {
		$nr  = $order->get_order_number();
		$kl  = trim( $order->get_billing_first_name() . ' ' . $order->get_billing_last_name() );
		$kl  = preg_replace( '/[\/\\\\:*?"<>|]/', '', $kl );
		return trim( $nr . ' ' . $kl ) . '.pdf';
	}

	public static function puslapis() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		$ids = get_transient( 'ps_dropship_' . get_current_user_id() );
		if ( ! $ids ) {
			echo '<div class="wrap"><h1>Perduoti tiekėjams</h1><p>Nėra pasirinktų užsakymų. '
			   . 'Grįžkite į <a href="' . esc_url( admin_url( 'admin.php?page=ps-desk' ) ) . '">darbalaukį</a>.</p></div>';
			return;
		}
		$g = self::grupuoti( (array) $ids );

		// Vieno sandėlio perdavimas: mišriam užsakymui leidžia paleisti tik VF,
		// o ZB pasilikti rankoje, kol siuntos iškeliaus kartu (H240).
		$tik = isset( $_GET['src'] ) ? sanitize_key( wp_unslash( $_GET['src'] ) ) : '';
		if ( $tik ) { $g = isset( $g[ $tik ] ) ? array( $tik => $g[ $tik ] ) : array(); }
		$t = self::tiekejai();
		$pastai = (array) get_option( self::OPT_EMAIL, [] );
		?>
		<div class="wrap">
			<h1>Perduoti tiekėjams</h1>
			<p><a class="button" href="<?php echo esc_url( admin_url( 'admin.php?page=ps-desk' ) ); ?>">Atgal į darbalaukį</a></p>
			<p class="description">Čia užsakymas išeina tiekėjui: <b>vienas tiekėjas = viena kortelė = vienas laiškas</b>
			su lipdukais ir manifestu. Eiga kortelės viršuje. Siunčiama iš <code>terra@petshop.lt</code>; AV prekės į laiškus nepatenka.
			Visus laukiančius pagal tiekėją matai <a href="<?php echo esc_url( admin_url( 'admin.php?page=ps-laiskai&b=laukia' ) ); ?>">Laiškai tiekėjams → Laukia išsiuntimo</a>.</p>

			<?php if ( ! $g ) : ?>
				<div class="notice notice-info"><p>Pažymėtuose užsakymuose dropship prekių nėra
				(arba jie jau perduoti).</p></div>
			<?php endif; ?>

			<?php foreach ( $g as $src => $uzsakymai ) { self::kortele( $src, $uzsakymai, admin_url( 'admin.php?page=ps-dropship' . ( $tik ? '&src=' . $tik : '' ) ) ); } ?>
		</div>
		<?php self::kortelės_stilius();
	}

	/** Kortelės JS + CSS — abiem langams (H258). */
	protected static function kortelės_stilius() {
		?>
		<script>
		document.addEventListener('click', function(ev){
			var b = ev.target.closest('.ps-kopijuoti');
			if (!b) { return; }
			var t = b.getAttribute('data-tsv') || '';
			function ok(){ b.textContent = 'Nukopijuota'; setTimeout(function(){ b.textContent='Kopijuoti'; }, 1500); }
			if (navigator.clipboard && window.isSecureContext) {
				navigator.clipboard.writeText(t).then(ok, function(){ senas(); });
			} else { senas(); }
			function senas(){
				var ta = document.createElement('textarea');
				ta.value = t; document.body.appendChild(ta); ta.select();
				try { document.execCommand('copy'); ok(); } catch(e) {}
				document.body.removeChild(ta);
			}
		});
		</script>
		<style>
		.ps-tiek { background:#fff; border:1px solid #dcdcdc; padding:16px 20px; margin:0 0 18px; }
		.ps-tiek-h { display:flex; justify-content:space-between; align-items:baseline;
			border-bottom:2px solid #222; padding-bottom:6px; margin-bottom:12px; }
		.ps-tiek-h h2 { margin:0; font-size:16px; }
		.ps-tiek-h span { font-size:12px; color:#555; }
		.ps-tbl td, .ps-tbl th { font-size:13px; }
		.ps-c { width:60px; text-align:center; }
		.ps-kodas { color:#888; font-size:11px; margin-left:8px; }
		.ps-lip { color:#a05a00; font-size:12px; font-style:italic; }
		.ps-siusti { margin-top:12px; }
		.ps-av-blokas { margin:12px 0; padding:10px 12px; border:1px dashed #2a5a8a; background:#f3f8fc; }
		.ps-av-blokas.ps-av-ne { border-color:#c46a00; background:#fbf3e6; }
		.ps-av-h { display:flex; justify-content:space-between; margin-bottom:6px; font-size:13px; }
		.ps-av-h span { color:#555; font-size:12px; }
		.ps-av-p { margin:8px 0 0; font-size:12px; color:#333; }
		.ps-eiga { display:flex; gap:10px; margin:0 0 12px; flex-wrap:wrap; }
		.ps-eiga-z { flex:1 1 200px; padding:8px 10px; border-left:3px solid #ccc; background:#f6f6f6; font-size:12px; line-height:1.35; }
		.ps-eiga-z b { display:block; margin-bottom:2px; }
		.ps-eiga-ok { border-color:#2a7a2a; background:#eef7ee; }
		.ps-eiga-ne { border-color:#c46a00; background:#fbf3e6; }
		.ps-dez td { border-top:none !important; padding-top:0; }
		.ps-dez-f { display:inline-flex; gap:8px; align-items:center; font-size:12px; }
		.ps-siusti label { margin-left:14px; font-size:12px; }
		.notice.inline { margin:8px 0; }
		</style>
		<?php
	}

	/**
	 * VIENA tiekėjo kortelė (H258) — naudojama ir „Laukia išsiuntimo", ir „Perduoti tiekėjams".
	 * $bazine — URL, į kurį grįžtama po peržiūros perjungimo / perregistravimo.
	 */
	protected static function kortele( $src, $uzsakymai, $bazine ) {
		$t      = self::tiekejai();
		$pastai = (array) get_option( self::OPT_EMAIL, [] );
		$vardas = $t[ $src ][0] ?? strtoupper( $src );
		$rodyti_ean = ( ( $t[ $src ][1] ?? 'sku' ) === 'sku_ean' );
		$pastas = $pastai[ $src ] ?? '';
		$vnt = 0; $lip = 0;
		foreach ( $uzsakymai as $u ) { $lip += $u['pakuociu']; foreach ( $u['eilutes'] as $e ) { $vnt += $e['qty']; } }
		?>
			<div class="ps-tiek">
				<div class="ps-tiek-h">
					<h2><?php echo esc_html( $vardas ); ?></h2>
					<span><?php echo count( $uzsakymai ); ?> užsak. · <?php echo (int) $vnt; ?> vnt.
						<?php if ( $lip ) : ?> · <?php echo (int) $lip; ?> lipdukų<?php endif; ?></span>
				</div>
				<?php // H259: eigos juosta — kas čia daroma ir kas bus po to.
				$be_reg = 0; foreach ( $uzsakymai as $u ) { if ( (int) $u['pakuociu'] < 1 ) { $be_reg++; } }
				$ln0 = self::laisko_nust();
				if ( 'zb' === $src ) {
					$zingsniai = array(
						array( $be_reg ? 'ne' : 'ok', '1 · Siunta Venipak', $be_reg ? $be_reg . ' be siuntos — registruok žemiau' : 'registruota, lipdukai yra' ),
						array( 'ne', '2 · Suvesk į ZB', '„Kopijuoti" prie kiekvieno užsakymo → įklijuok į ZB sistemą' ),
						array( 'ne', '3 · Lipdukas', '„Lipdukas" → prikabink ZB užsakyme' ),
						array( 'ne', '4 · Pažymėti perduotais', 'užsakymai pereis į „Paruošta siųsti"; kai ZB išsiųs — ten spausk „Išsiųsta"' ),
					);
				} else {
					$zingsniai = array(
						array( $be_reg ? 'ne' : 'ok', '1 · Siunta Venipak', $be_reg ? $be_reg . ' be siuntos — registruok žemiau (kitaip laiške nebus lipdukų)' : 'registruota, lipdukai keliaus laiške' ),
						array( 'ok', '2 · Laiškas', '„Peržiūrėti laišką" — tiksliai tas tekstas; prierašas nebūtinas' ),
						array( ( $ln0['tiekejui'] || $ln0['man'] ) ? 'ok' : 'ne', '3 · Kam', $ln0['tiekejui'] ? ( 'tiekėjui' . ( $ln0['man'] ? ' + kopija man' : '' ) ) : ( $ln0['man'] ? 'TIK man (tiekėjui NEIŠEIS — persiųsi pats)' : 'nepažymėta' ) ),
						array( 'ne', '4 · Siųsti', 'vienas laiškas visiems šio tiekėjo užsakymams' . ( class_exists( 'Petshop_AV_Tiekimas' ) && Petshop_AV_Tiekimas::atvira_su_eilutemis( $src ) ? ' + partija į AV' : '' ) . ' → jie pereis į „Paruošta siųsti"; kai tiekėjas išsiųs — ten spausk „Išsiųsta"' ),
					);
				}
				echo '<div class="ps-eiga">';
				foreach ( $zingsniai as $z ) {
					printf( '<div class="ps-eiga-z ps-eiga-%s"><b>%s</b><span>%s</span></div>', esc_attr( $z[0] ), esc_html( $z[1] ), esc_html( $z[2] ) );
				}
				echo '</div>';
				if ( 'zb' !== $src && strpos( $bazine, 'ps-dropship' ) !== false ) {
					$visi_g = self::laukiantys_perdavimo();
					$kiti   = isset( $visi_g[ $src ] ) ? array_diff( array_keys( $visi_g[ $src ] ), array_keys( $uzsakymai ) ) : array();
					if ( $kiti ) {
						printf( '<div class="notice notice-info inline"><p>Šio tiekėjo dar laukia <b>%d</b> kit%s užsakym%s (#%s). <a class="button" href="%s">Sudėti visus į vieną laišką</a></p></div>',
							count( $kiti ), 1 === count( $kiti ) ? 'as' : 'i', 1 === count( $kiti ) ? 'as' : 'ai', esc_html( implode( ', #', $kiti ) ),
							esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=ps_dropship_visi&src=' . rawurlencode( $src ) ), 'ps_dropship_visi_' . $src ) ) );
					}
				}
				?>

				<?php if ( 'zb' === $src ) : ?>
					<div class="notice notice-warning inline"><p><b>ZB — laiškas nesiunčiamas.</b>
					Kiekvieną užsakymą suveskite į ZB sistemą („Kopijuoti" — kodas ir kiekis),
					lipduką prikabinkite iš mygtuko „Lipdukas". Pabaigoje — „Pažymėti ZB perduotais".</p></div>
				<?php elseif ( ! $pastas ) : ?>
					<div class="notice notice-error inline"><p>Nenurodytas el. paštas.
					Įrašykite <a href="<?php echo esc_url( admin_url( 'admin.php?page=ps-dropship-nustatymai' ) ); ?>">nustatymuose</a>.</p></div>
				<?php endif; ?>

				<table class="widefat striped ps-tbl">
					<thead><tr><th>Nr.</th><th>Klientas</th><th>Prekė</th><th class="ps-c">Kiek.</th></tr></thead>
					<tbody>
					<?php foreach ( $uzsakymai as $oid_r => $u ) :
						$pirma = true;
						if ( 'zb' === $src ) {
							$tsv = '';
							foreach ( $u['eilutes'] as $e ) { $tsv .= ( $e['zb'] ?: $e['sku'] ) . "\t" . $e['qty'] . "\n"; }
						}
						foreach ( $u['eilutes'] as $e ) : ?>
						<tr>
							<td><?php echo $pirma ? '<b>' . esc_html( $u['nr'] ) . '</b>' : ''; ?></td>
							<td><?php if ( $pirma ) { echo esc_html( $u['klientas'] );
								if ( 'zb' === $src ) {
									printf( ' <button type="button" class="button button-small ps-kopijuoti" data-tsv="%s">Kopijuoti</button>',
										esc_attr( $tsv ) );
									$lnk = wp_nonce_url( admin_url( 'admin-post.php?action=ps_dropship_lipdukas&id=' . $oid_r ), 'ps_dropship_lipdukas' );
									if ( $u['pakuociu'] > 0 ) {
										printf( ' <a class="button button-small" href="%s">Lipdukas</a>', esc_url( $lnk ) );
									} else {
										echo ' <span class="ps-lip">siunta neregistruota</span>';
									}
								} } ?></td>
							<td><?php echo esc_html( $e['pav'] ); ?>
								<?php if ( 'zb' === $src && $e['zb'] ) : ?><span class="ps-kodas"><b>ZB <?php echo esc_html( $e['zb'] ); ?></b></span>
								<?php elseif ( $e['sku'] ) : ?><span class="ps-kodas"><?php echo esc_html( $e['sku'] ); ?></span><?php endif; ?>
								<?php if ( $rodyti_ean && $e['ean'] ) : ?><span class="ps-kodas">EAN <?php echo esc_html( $e['ean'] ); ?></span><?php endif; ?>
							</td>
							<td class="ps-c"><?php echo (int) $e['qty']; ?> vnt.</td>
						</tr>
						<?php $pirma = false; endforeach;
						// H258: dėžių skaičius keičiamas čia pat — daugiau dėžių = daugiau lipdukų.
						$oo_d = wc_get_order( $oid_r );
						$dez  = $oo_d ? (int) $oo_d->get_meta( '_ps_pakuociu' ) : 0; if ( $dez < 1 ) { $dez = 1; }
						$perreg_laukai = array( 'action' => 'ps_desk_veiksmas', 'v' => 'vp_reg', 'id' => 0, 'perreg' => 1,
							'sandelis' => $src, 'ids' => (int) $oid_r, 'g' => $bazine, '_wpnonce' => wp_create_nonce( 'ps_desk_vp_reg_0' ) ); ?>
						<tr class="ps-dez"><td></td><td colspan="2">
							<?php $pastomatas = $oo_d && $oo_d->get_meta( 'venipak_pickup_point' ); ?>
							<form method="get" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ps-dez-f"
								onsubmit="return confirm('Perregistruoti siuntą #<?php echo esc_js( $u['nr'] ); ?> Venipak su ' + this.n.value + ' dėž.? Sena siunta lieka Venipak sistemoje nenaudojama.');">
								<?php foreach ( $perreg_laukai as $pk => $pv ) :
									printf( '<input type="hidden" name="%s" value="%s">', esc_attr( $pk ), esc_attr( $pv ) );
								endforeach; ?>
								<span class="ps-lip"><?php echo (int) $u['pakuociu']; ?> lipduk<?php echo 1 === (int) $u['pakuociu'] ? 'as' : 'ai'; ?> ·</span>
								<label>dėžių <input type="number" name="n" min="1" max="20" value="<?php echo (int) $dez; ?>" style="width:56px"></label>
								<button class="button button-small"><?php echo $u['pakuociu'] > 0 ? 'Perregistruoti Venipak' : 'Registruoti Venipak'; ?></button>
								<?php if ( $pastomatas ) : ?><span class="ps-lip">paštomatas: kiekviena dėžė — atskira siunta tam pačiam paštomatui</span><?php endif; ?>
							</form>
						</td><td></td></tr>
						<?php
					endforeach; ?>
					</tbody>
				</table>

				<?php if ( 'zb' === $src ) : ?>
				<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ps-siusti"
					onsubmit="return confirm('Pažymėti visus ZB užsakymus perduotais? Jie dings iš perdavimo sąrašo.');">
					<?php wp_nonce_field( 'ps_dropship_zb_done' ); ?>
					<input type="hidden" name="action" value="ps_dropship_zb_done">
					<input type="hidden" name="uzsakymai" value="<?php echo esc_attr( implode( ',', array_keys( $uzsakymai ) ) ); ?>">
					<button class="button button-primary">Pažymėti ZB perduotais (<?php echo count( $uzsakymai ); ?>)</button>
					<label>tik kai visi suvesti į ZB sistemą ir lipdukai prikabinti</label>
				</form>
				<?php endif; ?>

				<?php // H260: Tiekimo kaupiama partija — į tą patį laišką.
				$partija = ( 'zb' !== $src && class_exists( 'Petshop_AV_Tiekimas' ) ) ? Petshop_AV_Tiekimas::atvira_su_eilutemis( $src ) : null;
				$partija_html = ''; $gali = false; $pp = null;
				if ( $partija ) :
					$pp = $partija['part']; $gali = ! empty( $pp->pristatymas );
					$pv = Petshop_AV_Tiekimas::PRISTATYMAI[ $pp->pristatymas ] ?? '';
					if ( $gali ) { $partija_html = Petshop_AV_Tiekimas::laisko_dalis( $pp, $partija['eilutes'], (string) $pp->venipak_pack ); }
					$pp_dezes = max( 1, (int) ( $pp->dezes ?? 1 ) );
				?>
				<div class="ps-av-blokas <?php echo $gali ? '' : 'ps-av-ne'; ?>">
					<div class="ps-av-h"><b>Į AV sandėlį — partija #<?php echo (int) $pp->id; ?></b>
						<span><?php echo count( $partija['eilutes'] ); ?> poz. · <?php echo (int) array_sum( wp_list_pluck( $partija['eilutes'], 'qty' ) ); ?> vnt.</span></div>
					<table class="widefat striped ps-tbl"><tbody>
					<?php foreach ( $partija['eilutes'] as $e ) : $pr = wc_get_product( $e->product_id ); ?>
						<tr><td><?php echo esc_html( $pr ? $pr->get_name() : '#' . $e->product_id ); ?> <span class="ps-kodas"><?php echo esc_html( $pr ? $pr->get_sku() : '' ); ?></span></td>
						<td class="ps-c"><?php echo (int) $e->qty; ?> vnt.</td></tr>
					<?php endforeach; ?>
					</tbody></table>
					<?php if ( $gali ) : ?>
						<p class="ps-av-p">Pristatymas: <b><?php echo esc_html( $pv ); ?></b>
							<?php if ( 'tiekejas' === $pp->pristatymas ) : ?>· lipdukų nereikia
							<?php elseif ( $pp->venipak_pack ) : ?>· siunta registruota: <?php echo esc_html( str_replace( ',', ', ', $pp->venipak_pack ) ); ?> (<?php echo (int) $pp_dezes; ?> lipduk<?php echo 1 === $pp_dezes ? 'as' : 'ai'; ?>, tame pačiame manifeste)
							<?php else : ?>· siuntą registruos siunčiant laišką, į tą patį manifestą kaip klientų siuntos; lipdukų skaičių nurodyk prie mygtuko „Siųsti"<?php endif; ?>
							· <a href="<?php echo esc_url( admin_url( 'admin.php?page=ps-tiekimas' ) ); ?>">keisti Tiekime</a></p>
					<?php else : ?>
						<div class="notice notice-warning inline"><p><b>Nepasirinktas pristatymo būdas</b> — į laišką neįtraukiama.
							<a href="<?php echo esc_url( admin_url( 'admin.php?page=ps-tiekimas' ) ); ?>">Pasirink Tiekime</a> (paštomatas / kurjeris / tiekėjas atveža) ir grįžk.</p></div>
					<?php endif; ?>
				</div>
				<?php endif; ?>

				<?php if ( 'zb' !== $src ) :
					$perziura = isset( $_GET['perziura'] ) && $_GET['perziura'] === $src; ?>
					<p style="margin:10px 0 0">
						<a class="button" href="<?php echo esc_url( add_query_arg( array( 'perziura' => $perziura ? null : $src ), $bazine ) ); ?>">
							<?php echo $perziura ? 'Slėpti laiško peržiūrą' : 'Peržiūrėti laišką'; ?></a>
					</p>
					<?php if ( $perziura ) : ?>
						<div style="margin-top:10px;border:1px dashed #98262A;background:#fff;padding:14px 16px">
							<p style="margin:0 0 8px;font-size:11px;color:#98262A;text-transform:uppercase;letter-spacing:.06em">
								Laiško peržiūra — tema: „užsakymas <?php echo esc_html( date_i18n( 'Y-m-d' ) ); ?>" · gavėjas: <?php echo esc_html( $pastas ?: '—' ); ?></p>
							<?php
							$zyme = 'PS-GYVA-VIETA';
							$html = self::laisko_html( $src, $uzsakymai, $zyme, $partija_html );
							$gyvas = '<p class="ps-gyva" data-src="' . esc_attr( $src ) . '"'
								. ' style="display:none;margin:14px 0;padding:8px 10px;background:#FBF2DE;border-left:3px solid #96660C"></p>';
							$html = str_replace( '<p style="margin:14px 0">' . $zyme . '</p>', $gyvas, $html );
							echo wp_kses_post( $html );
							?>
						</div>
					<?php endif; ?>
				<?php endif; ?>

				<?php if ( 'zb' !== $src && $pastas ) :
					// H255: siuntos vartai — be registruotos siuntos lipdukų laiške nebus.
					$be_siuntos = array();
					foreach ( $uzsakymai as $oid_v => $u ) { if ( (int) $u['pakuociu'] < 1 ) { $be_siuntos[] = (int) $oid_v; } }
					$reg_url = '';
					if ( $be_siuntos ) {
						$reg_url = wp_nonce_url(
							admin_url( 'admin-post.php?action=ps_desk_veiksmas&v=vp_reg&id=0&sandelis=' . rawurlencode( $src )
								. '&ids=' . implode( ',', $be_siuntos )
								. '&g=' . rawurlencode( $bazine ) ),
							'ps_desk_vp_reg_0' );
					}
					if ( $be_siuntos ) : ?>
					<div class="notice notice-error inline" style="margin:10px 0"><p>
						<b>Siunta neregistruota: <?php echo esc_html( implode( ', ', array_map( function ( $x ) { return '#' . $x; }, $be_siuntos ) ) ); ?>.</b>
						Laiške lipdukų nebūtų — tiekėjas neturėtų ko klijuoti.
						<a class="button button-primary" href="<?php echo esc_url( $reg_url ); ?>">Registruoti Venipak (<?php echo count( $be_siuntos ); ?>) → manifestas <?php echo esc_html( Petshop_Desk::MANIFESTAI[ $src ] ?? '?' ); ?></a>
					</p></div>
					<?php endif; ?>
				<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ps-siusti">
					<?php wp_nonce_field( 'ps_dropship_send' ); ?>
					<input type="hidden" name="action" value="ps_dropship_send">
					<input type="hidden" name="tiekejas" value="<?php echo esc_attr( $src ); ?>">
					<input type="hidden" name="uzsakymai" value="<?php echo esc_attr( implode( ',', array_keys( $uzsakymai ) ) ); ?>">
					<p style="margin:0 0 8px">
						<label style="display:block;font-weight:600;margin-bottom:3px">Prierašas laiške (nebūtina)</label>
						<textarea name="pastaba" rows="3" style="width:100%;max-width:620px"
							data-src="<?php echo esc_attr( $src ); ?>"
							placeholder="Pvz.: prašome pristatyti iki penktadienio; prie 35048 pridėkite dovanėlę…"></textarea>
					</p>
					<?php if ( $be_siuntos ) : ?>
						<button class="button" type="submit" name="be_lipduku" value="1"
							onclick="return confirm('Siųsti BE lipdukų? Tiekėjas negalės išsiųsti, kol neatsiųsi lipdukų atskirai.');">Siųsti be lipdukų (išimtis)</button>
					<?php else : ?>
						<button class="button button-primary">Siųsti <?php echo esc_html( $vardas ); ?> (<?php echo esc_html( $pastas ); ?>)</button>
					<?php endif; ?>
					<?php if ( $partija && $gali ) : ?>
					<label><input type="checkbox" name="su_partija" value="<?php echo (int) $pp->id; ?>" checked> <b>+ partija #<?php echo (int) $pp->id; ?> į AV</b>
						<?php if ( 'tiekejas' !== $pp->pristatymas && ! $pp->venipak_pack ) : ?>· lipdukų <input type="number" name="partija_dezes" min="1" max="20" value="<?php echo (int) $pp_dezes; ?>" style="width:52px"><?php endif; ?>
						(užsidarys išsiuntus)</label>
					<?php endif; ?>
					<label><input type="checkbox" name="su_lipdukais" value="1" checked> pridėti lipdukus</label>
					<label><input type="checkbox" name="su_manifestu" value="1" checked> pridėti manifestą</label>
					<?php $ln = self::laisko_nust(); ?>
					<input type="hidden" name="laisk_zyme" value="1">
					<label><input type="checkbox" name="laisk_tiekejui" value="1" <?php checked( $ln['tiekejui'] ); ?>>
						siųsti tiekėjui</label>
					<label><input type="checkbox" name="laisk_man" value="1" <?php checked( $ln['man'] ); ?>>
						kopija man (terra@petshop.lt)</label>
				</form>
				<?php endif; ?>
			</div>
		<?php
	}

	/** Vieno užsakymo lipduko atsisiuntimas (ZB keliui — prikabinimui į jų sistemą). */
	public static function lipdukas_atsisiusti() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		check_admin_referer( 'ps_dropship_lipdukas' );
		$id = isset( $_GET['id'] ) ? absint( $_GET['id'] ) : 0;
		$o  = $id ? wc_get_order( $id ) : false;
		if ( ! $o ) { wp_die( 'Užsakymas nerastas' ); }
		$kelias = self::lipdukas( $id );
		if ( ! $kelias || ! file_exists( $kelias ) ) {
			wp_die( 'Lipduko gauti nepavyko — ar siunta registruota Venipak (3 žingsnis)?' );
		}
		nocache_headers();
		header( 'Content-Type: application/pdf' );
		header( 'Content-Disposition: attachment; filename="' . rawurlencode( basename( $kelias ) ) . '"' );
		header( 'Content-Length: ' . filesize( $kelias ) );
		readfile( $kelias );
		exit;
	}

	/** ZB užsakymų žymėjimas perduotais (laiško nėra — žymė rankinė). */
	public static function zb_pazymeti() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		check_admin_referer( 'ps_dropship_zb_done' );
		$ids = isset( $_POST['uzsakymai'] ) ? array_filter( array_map( 'absint', explode( ',', sanitize_text_field( wp_unslash( $_POST['uzsakymai'] ) ) ) ) ) : [];
		$k = 0;
		foreach ( $ids as $oid ) {
			$o = wc_get_order( $oid );
			if ( ! $o || self::perduota( $o, 'zb' ) ) { continue; }
			self::zymeti_perduota( $o, 'zb' );
			$o->add_order_note( 'Perduota ZB — suvesta į jų sistemą ranka, lipdukas prikabintas (darbalaukio žymė).', false, true );
			$o->save();
			$k++;
		}
		wp_safe_redirect( add_query_arg( [ 'page' => 'ps-dropship', 'ps_zb' => $k ], admin_url( 'admin.php' ) ) );
		exit;
	}

	/** Nustatymų puslapis — tiekėjų el. paštai. */
	public static function nustatymai() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_die( 'Nepakanka teisių' ); }
		$p = (array) get_option( self::OPT_EMAIL, [] );
		?>
		<div class="wrap">
			<h1>Tiekėjų el. paštai</h1>
			<p class="description">Adresai, kuriais siunčiami dropship užsakymai.
			Kelis adresus atskirkite kableliu. Siunčiama iš <code>terra@petshop.lt</code>.</p>
			<?php if ( isset( $_GET['ps_ok'] ) ) : ?>
				<div class="notice notice-success"><p>Išsaugota.</p></div>
			<?php endif; ?>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<?php wp_nonce_field( 'ps_dropship_nust' ); ?>
				<input type="hidden" name="action" value="ps_dropship_nust">
				<table class="form-table">
				<?php foreach ( self::tiekejai() as $k => $t ) : ?>
					<tr>
						<th scope="row"><?php echo esc_html( $t[0] ); ?></th>
						<td>
							<input type="text" name="pastai[<?php echo esc_attr( $k ); ?>]" class="regular-text"
								value="<?php echo esc_attr( $p[ $k ] ?? '' ); ?>"
								<?php echo 'zb' === $k ? 'disabled placeholder="ZB — laiškai nesiunčiami"' : ''; ?>>
							<?php if ( 'sku_ean' === $t[1] ) : ?>
								<p class="description">Laiške rodomas ir EAN (atsirenka pagal pavadinimą ir barkodą).</p>
							<?php endif; ?>
						</td>
					</tr>
				<?php endforeach; ?>
				</table>
				<?php submit_button( 'Išsaugoti' ); ?>
			</form>
		</div>
		<?php
	}

	public static function saugoti_nustatymus() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_die( 'Nepakanka teisių' ); }
		check_admin_referer( 'ps_dropship_nust' );
		$in = (array) ( $_POST['pastai'] ?? [] );
		$out = [];
		foreach ( $in as $k => $v ) {
			$k = sanitize_key( $k );
			$adresai = array_filter( array_map( 'trim', explode( ',', (string) wp_unslash( $v ) ) ) );
			$geri = [];
			foreach ( $adresai as $a ) { if ( is_email( $a ) ) { $geri[] = sanitize_email( $a ); } }
			if ( $geri ) { $out[ $k ] = implode( ',', $geri ); }
		}
		update_option( self::OPT_EMAIL, $out );
		wp_safe_redirect( admin_url( 'admin.php?page=ps-dropship-nustatymai&ps_ok=1' ) );
		exit;
	}

	/** Išsiunčia laišką vienam tiekėjui. */
	/** Gyvas prierašo atspindys peržiūroje. */
	public static function skriptas() {
		if ( ! isset( $_GET['page'] ) || ! in_array( $_GET['page'], array( 'ps-dropship', 'ps-laiskai' ), true ) ) { return; }
		?>
		<script>
		document.addEventListener('input', function (ev) {
			var t = ev.target;
			if (t.tagName !== 'TEXTAREA' || !t.name || t.name !== 'pastaba') { return; }
			var p = document.querySelector('.ps-gyva[data-src="' + t.dataset.src + '"]');
			if (!p) { return; }
			p.textContent = t.value;
			p.style.display = t.value.trim() ? 'block' : 'none';
		});
		</script>
		<?php
	}

	/** Laiško tiekėjui HTML — VIENA tiesos vieta siuntimui ir peržiūrai. */
	public static function laisko_html( $src, $uzsakymai, $pastaba = '', $partija_html = '' ) {
		$t = self::tiekejai();
		$rodyti_ean = ( ( $t[ $src ][1] ?? 'sku' ) === 'sku_ean' );

		// LENTELĖ — tokia pat struktūra kaip Raimio rankiniuose laiškuose
		$h  = '<p>Laba diena,</p><p>šiandienai</p>';
		$h .= '<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:Arial;font-size:13px;">';
		foreach ( $uzsakymai as $u ) {
			$n = count( $u['eilutes'] ) + ( $u['pakuociu'] > 1 ? 1 : 0 );
			$pirma = true;
			foreach ( $u['eilutes'] as $e ) {
				$h .= '<tr>';
				if ( $pirma ) {
					$h .= '<td rowspan="' . $n . '" valign="top"><b>' . esc_html( $u['nr'] ) . '</b></td>';
					$h .= '<td rowspan="' . $n . '" valign="top">' . esc_html( $u['klientas'] ) . '</td>';
				}
				$h .= '<td>' . esc_html( $e['pav'] );
				if ( $e['sku'] ) { $h .= ' <span style="color:#666">' . esc_html( $e['sku'] ) . '</span>'; }
				if ( $rodyti_ean && $e['ean'] ) { $h .= '<br><span style="color:#666;font-size:11px">EAN ' . esc_html( $e['ean'] ) . '</span>'; }
				$h .= '</td><td align="center" style="white-space:nowrap">' . (int) $e['qty'] . ' vnt.</td></tr>';
				$pirma = false;
			}
			if ( $u['pakuociu'] > 1 ) {
				$h .= '<tr><td colspan="2"><i>' . (int) $u['pakuociu'] . ' lipdukai</i></td></tr>';
			}
		}
		$h .= '</table>';
		$pastaba = trim( (string) $pastaba );
		if ( '' !== $pastaba ) {
			$h .= '<p style="margin:14px 0">' . nl2br( esc_html( $pastaba ) ) . '</p>';
		}
		if ( '' !== $partija_html ) { // H260: prekės į AV sandėlį — tame pačiame laiške
			$h .= $partija_html;
		}
		$h .= '<p>Linkėjimai,<br>UAB Avesa<br>terra@petshop.lt</p>';
		return $h;
	}

	/** „Laukia išsiuntimo" → visi tiekėjo neperduoti užsakymai į perdavimo ekraną (H257). */
	public static function perduoti_visus() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		$src = isset( $_GET['src'] ) ? sanitize_key( wp_unslash( $_GET['src'] ) ) : '';
		check_admin_referer( 'ps_dropship_visi_' . $src );
		$g   = self::laukiantys_perdavimo();
		$ids = isset( $g[ $src ] ) ? array_map( 'intval', array_keys( $g[ $src ] ) ) : array();
		if ( ! $src || ! $ids ) {
			wp_safe_redirect( admin_url( 'admin.php?page=ps-laiskai&b=laukia&psl_sent=2&psl_src=' . rawurlencode( $src ) ) );
			exit;
		}
		set_transient( 'ps_dropship_' . get_current_user_id(), $ids, 1800 );
		wp_safe_redirect( add_query_arg( [ 'page' => 'ps-dropship', 'src' => $src ], admin_url( 'admin.php' ) ) );
		exit;
	}

	public static function siusti() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		check_admin_referer( 'ps_dropship_send' );

		$src = sanitize_key( $_POST['tiekejas'] ?? '' );
		$ids = array_filter( array_map( 'intval', explode( ',', (string) ( $_POST['uzsakymai'] ?? '' ) ) ) );
		if ( ! $src || ! $ids ) { wp_safe_redirect( admin_url( 'admin.php?page=ps-dropship' ) ); exit; }

		$t      = self::tiekejai();
		$vardas = $t[ $src ][0] ?? strtoupper( $src );
		$pastai = (array) get_option( self::OPT_EMAIL, [] );
		$pastas = $pastai[ $src ] ?? '';
		if ( ! $pastas ) { wp_die( 'Nenurodytas tiekėjo el. paštas' ); }

		$g = self::grupuoti( $ids );
		$uzsakymai = $g[ $src ] ?? [];
		if ( ! $uzsakymai ) { wp_die( 'Nėra ką siųsti' ); }

		$pastaba = isset( $_POST['pastaba'] ) ? sanitize_textarea_field( wp_unslash( $_POST['pastaba'] ) ) : '';

		// H260: Tiekimo partija tame pačiame laiške — paruošiam (Venipak, lipdukas), uždarom tik po sėkmės.
		$pid = isset( $_POST['su_partija'] ) ? absint( $_POST['su_partija'] ) : 0;
		$partija_html = ''; $partija_priedas = ''; $partija_packs = array();
		if ( $pid && class_exists( 'Petshop_AV_Tiekimas' ) ) {
			$pr = Petshop_AV_Tiekimas::paruosti( $pid, isset( $_POST['partija_dezes'] ) ? absint( $_POST['partija_dezes'] ) : 0 );
			if ( empty( $pr['ok'] ) ) {
				wp_safe_redirect( add_query_arg( [ 'page' => 'ps-laiskai', 'b' => 'laukia', 'psl_sent' => 3, 'psl_src' => $src, 'psl_n' => $pid,
					'psl_err' => rawurlencode( mb_substr( (string) $pr['klaida'], 0, 200 ) ) ], admin_url( 'admin.php' ) ) );
				exit;
			}
			$partija_html = $pr['html']; $partija_priedas = $pr['priedas'];
			$partija_packs = array_filter( explode( ',', (string) $pr['pack'] ) );
		}
		$h = self::laisko_html( $src, $uzsakymai, $pastaba, $partija_html );
		$data = date_i18n( 'Y-m-d' );

		// PRIEDAI
		$priedai = [];
		if ( ! empty( $_POST['su_lipdukais'] ) ) {
			foreach ( array_keys( $uzsakymai ) as $oid ) {
				$f = self::lipdukas( $oid );
				if ( $f ) { $priedai[] = $f; }
			}
		}
		if ( ! empty( $_POST['su_manifestu'] ) ) {
			$m = self::manifestas( array_keys( $uzsakymai ), $partija_packs ); // H261: partijos pack'ai tame pačiame manifeste
			if ( $m ) { $priedai[] = $m; }
		}
		if ( $partija_priedas ) { $priedai[] = $partija_priedas; }

		$antraste = [
			'Content-Type: text/html; charset=UTF-8',
			'From: UAB Avesa <terra@petshop.lt>',
			'Reply-To: terra@petshop.lt',
		];
		// Adresatai pagal varneles (H250).
		if ( isset( $_POST['laisk_zyme'] ) ) {
			update_option( 'ps_tiek_laiskai', [
				'tiekejui' => ! empty( $_POST['laisk_tiekejui'] ),
				'man'      => ! empty( $_POST['laisk_man'] ),
			] );
		}
		$ln  = self::laisko_nust();
		$gav = [];
		if ( $ln['tiekejui'] ) { $gav[] = $pastas; }
		if ( $ln['man'] ) { $gav[] = 'terra@petshop.lt'; }
		$gav = array_values( array_unique( array_filter( $gav ) ) );
		if ( ! $gav ) { wp_die( 'Nepažymėta, kam siųsti — uždėk bent vieną varnelę.' ); }

		$tema = $ln['tiekejui'] ? 'užsakymas ' . $data : '[PERSIŲSTI ' . $vardas . '] užsakymas ' . $data;
		$ok   = wp_mail( $gav, $tema, $h, $antraste, $priedai );

		self::archyvuoti( $gav, $tema, $h, $priedai,
			'Perdavimas tiekėjui: ' . $vardas . ' · ' . count( $uzsakymai ) . ' užsak.' . ( $pid ? ' + partija #' . $pid . ' į AV' : '' ) );
		if ( $ok && $pid && class_exists( 'Petshop_AV_Tiekimas' ) ) {
			Petshop_AV_Tiekimas::uzdaryti_po_laisko( $pid, 'laiške kartu su užsakymais' );
		}

		if ( $ok ) {
			foreach ( array_keys( $uzsakymai ) as $oid ) {
				$o = wc_get_order( $oid );
				if ( ! $o ) { continue; }
				self::zymeti_perduota( $o, $src );
				$o->save();
				$o->add_order_note( 'Perduota tiekėjui ' . $vardas . ' — laiškas: ' . implode( ', ', $gav ) );
			}
		}
		foreach ( $priedai as $f ) { @unlink( $f ); }

		// H257: pasirinkimas išvalomas; grįžtama į „Laukia išsiuntimo" su aiškia žinute.
		delete_transient( 'ps_dropship_' . get_current_user_id() );
		wp_safe_redirect( add_query_arg( [
			'page'    => 'ps-laiskai',
			'b'       => 'laukia',
			'psl_sent' => $ok ? 1 : 0,
			'psl_src'  => $src,
			'psl_n'    => count( $uzsakymai ),
			'psl_p'    => $pid,
			'psl_kam'  => rawurlencode( implode( ', ', $gav ) ),
			'psl_err'  => $ok ? '' : rawurlencode( mb_substr( self::$pasto_klaida, 0, 200 ) ),
		], admin_url( 'admin.php' ) ) );
		exit;
	}

	/** Paima Venipak lipduką ir išsaugo laikinai teisingu vardu. */
	protected static function lipdukas( $order_id ) {
		$o = wc_get_order( $order_id );
		if ( ! $o ) { return null; }
		$d = json_decode( (string) $o->get_meta( 'venipak_shipping_order_data' ), true );
		if ( empty( $d['pack_numbers'] ) ) { return null; }

		$n = get_option( 'shopup_venipak_shipping_settings', [] );
		$u = $n['shopup_venipak_shipping_field_username'] ?? '';
		$p = $n['shopup_venipak_shipping_field_password'] ?? '';
		$f = $n['shopup_venipak_shipping_field_labelformat'] ?? 'sticker';
		if ( ! $u ) { return null; }

		$atsakymas = wp_remote_post( 'https://go.venipak.lt/ws/print_label', [
			'timeout' => 45,
			'body'    => [ 'user' => $u, 'pass' => $p, 'pack_no' => implode( ',', (array) $d['pack_numbers'] ), 'format' => $f ],
		] );
		if ( is_wp_error( $atsakymas ) ) { return null; }
		$turinys = wp_remote_retrieve_body( $atsakymas );
		if ( strlen( $turinys ) < 500 || 0 !== strpos( $turinys, '%PDF' ) ) { return null; }

		$dir = get_temp_dir() . 'ps-dropship/';
		if ( ! is_dir( $dir ) ) { wp_mkdir_p( $dir ); }
		$kelias = $dir . self::lipduko_vardas( $o );
		file_put_contents( $kelias, $turinys );
		return $kelias;
	}

	/** Manifestas partijai. */
	protected static function manifestas( array $order_ids, array $papildomi = array() ) {
		$packs = array_values( $papildomi );
		foreach ( $order_ids as $id ) {
			$o = wc_get_order( $id );
			if ( ! $o ) { continue; }
			$d = json_decode( (string) $o->get_meta( 'venipak_shipping_order_data' ), true );
			if ( ! empty( $d['pack_numbers'] ) ) { $packs = array_merge( $packs, (array) $d['pack_numbers'] ); }
		}
		if ( ! $packs ) { return null; }
		$n = get_option( 'shopup_venipak_shipping_settings', [] );
		$u = $n['shopup_venipak_shipping_field_username'] ?? '';
		$p = $n['shopup_venipak_shipping_field_password'] ?? '';
		if ( ! $u ) { return null; }

		$a = wp_remote_post( 'https://go.venipak.lt/ws/print_manifest', [
			'timeout' => 45,
			'body'    => [ 'user' => $u, 'pass' => $p, 'pack_no' => implode( ',', $packs ) ],
		] );
		if ( is_wp_error( $a ) ) { return null; }
		$c = wp_remote_retrieve_body( $a );
		if ( strlen( $c ) < 500 || 0 !== strpos( $c, '%PDF' ) ) { return null; }
		$dir = get_temp_dir() . 'ps-dropship/';
		if ( ! is_dir( $dir ) ) { wp_mkdir_p( $dir ); }
		$kelias = $dir . 'manifestas-' . date_i18n( 'Y-m-d' ) . '.pdf';
		file_put_contents( $kelias, $c );
		return $kelias;
	}
}
Petshop_AV_Dropship::init();
