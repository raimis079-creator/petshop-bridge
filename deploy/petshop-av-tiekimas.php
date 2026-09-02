<?php
/**
 * Petshop AV Tiekimas v1.9.3 (S1602, K2+K3) — PRIĖMIMAS PERKELIA EILUTĘ Į AV; PAŠTOMATO KODAS.
 *
 * K2 (auditas 2026-09-02): po partijos priėmimo užsakymo eilutė liko `_ps_source=quattro`
 * (+`_ps_konsolidacija`) → surinkimo lape jos NEBUVO, `vykdymas()` rodė „MIŠRUS 3 siuntos“,
 * `_ps_shipments`=3, nors fiziškai išeina 2. Dabar priimti(), kai užsakymui prekių užteko,
 * konsoliduotoms eilutėms rašo `_ps_source=av`, `_ps_source_reason='parsivežta partija #N'`,
 * nurašo gautą kiekį iš AV (AV_Stock::decrease — prekė iš karto rezervuota šiam užsakymui,
 * `_ps_av_reduced`), ir perskaičiuoja `_ps_groups` / `_ps_shipments` / `_ps_order_type`.
 * `_ps_konsolidacija` lieka kaip istorija (dropship ir SLA jos nebeliečia, nes šaltinis jau av).
 *
 * K3: Venipak paštomatui consignee `company_code` turi būti paštomato KODAS (300906055),
 * ne plugino vidinis ID (3648) — API atsakė „Pickup/Locker not found“. AV_PASTOMATAS papildytas `kodas`.
 *
 * Petshop AV Tiekimas v1.9.2 (H264) — vizualinis atskyrimas: kortelė su šešėliu, pristatymo
 * ir laiškų blokai ant tonuoto fono, žingsnių numeriai, spalvota tiekėjo juosta (Raimis: „viskas susilieja").
 *
 * Petshop AV Tiekimas v1.9.1 (H262) — lipdukas keliems pack'ams: pack_no[] masyvu (kableliais Venipak tyli).
 *
 * Petshop AV Tiekimas v1.9 (H261) — LAIŠKO DALIS KAIP KLIENTŲ LENTELĖ, DĖŽIŲ SKAIČIUS, BENDRAS MANIFESTAS.
 *
 * KODĖL (Raimis, H261, gavęs laišką): „tiekėjai ir taip žino mus, adresas
 * lipdukuose; svorio, manifesto Avesai nereikia — eina vienas manifestas kartu
 * su klientais; tik nurodyti, kiek reikės lipdukų iš Venipak; prekės kaip ir
 * klientams lentelėje". DABAR: laiško dalis = antraštė „UAB Avesa, Liucionių
 * g. 46" + lentelė tokia pat kaip klientų + viena eilutė apie lipdukus (arba
 * „atvešite patys"). Partija turi `dezes` (kiek lipdukų): kurjeriui — viena
 * siunta su n pack'ų, paštomatui — n siuntų po 1. Registruojama į TĄ PATĮ
 * tiekėjo manifestą (Petshop_Desk::MANIFESTAI kodas), ne atskirą.
 *
 * Petshop AV Tiekimas v1.8 (H260) — PARTIJA KELIAUJA TIEKĖJO LAIŠKE KARTU SU UŽSAKYMAIS.
 *
 * KODĖL (Raimis, H260): „užsakymą į AV sandėlį aš siųsiu tiekėjui kartu vienu
 * laišku su kitais užsakymais". Iki šiol partija turėjo SAVO laišką — tiekėjas
 * gaudavo du. DABAR uzsakyti() perskeltas: paruosti() (Venipak registracija,
 * laiško dalis, lipdukas) ir uzdaryti_po_laisko() (būsena uzsakyta, pastabos).
 * Dropship kortelė (petshop-av-dropship::kortele) rodo bloką „Į AV sandėlį —
 * partija #n" ir, pažymėjus varnelę, įdeda jį į TĄ PATĮ laišką; po sėkmingo
 * siuntimo partija uždaroma čia. Savas mygtukas Tiekime lieka išimtims.
 *
 * Petshop AV Tiekimas v1.7.1 (H250) — laiškai rašomi į bendrą archyvą
 * (Įrankiai → „Išsiųsti laiškai", petshop-av-dropship::archyvuoti).
 *
 * Petshop AV Tiekimas v1.7 (H248) — LAIŠKO ADRESATAS PASIRENKAMAS VARNELĖMIS.
 *
 * KODĖL (Raimis, H248): „laiškus aš pats išsiunčiu tiekėjams, ne sistema;
 * pradžioje bus niuansų, todėl reikia kad kopija eitų į terra@petshop.lt".
 * DABAR prie kiekvienos partijos dvi varnelės (pasirinkimas įsimenamas):
 *   [ ] Siųsti laišką tiekėjui        — numatyta IŠJUNGTA (siunti pats)
 *   [x] Siųsti man (terra@petshop.lt) — numatyta ĮJUNGTA, laiškas su lipduku
 *       ateina tau, persiunti tiekėjui pats.
 * Nuėmus abi — partija tik uždaroma, joks laiškas neišeina (lipduką visada
 * gali paimti iš „Užsakyta · laukiam" kortelės).
 *
 * Petshop AV Tiekimas v1.6 (H247) — VENIPAK SIUNTOS REGISTRACIJA IŠ PARTIJOS + LIPDUKAS.
 *
 * KODĖL (Raimis, H247): laiške tiekėjui rašėm „prekes paims Venipak kurjeris",
 * bet kurjeris niekur nebuvo užsakytas, o tiekėjas neturėjo lipduko. Srautas
 * buvo nebaigtas. DABAR paspaudus „Užsakyti iš tiekėjo":
 *   1. siunta registruojama Venipak import/send.php TAVO sutartimi — siuntėjas
 *      standartinis (UAB Avesa, iš plugino nustatymų), gavėjas = AV sandėlis arba
 *      Nemenčinės paštomatas. Kurjerį iš tiekėjo sandėlio Raimis kviečia pats
 *      Venipak sistemoje, todėl tiekėjų adresų čia nereikia (H247.2);
 *   2. pack_no rezervuojamas per patį pluginą (reserve_pack_numbers) — numeriai
 *      nesikerta su užsakymų siuntomis;
 *   3. lipdukas (print_label PDF) PRISEGAMAS prie laiško tiekėjui — kaip ir bet
 *      kurioje kitoje siuntoje; laiške tik siuntos nr., jokių papildomų aiškinimų
 *      (H247.1, Raimis: „procedūra jau suderinta, tik į AV sandėlį");
 *   4. numeris ir manifestas saugomi partijos meta, matomi „Užsakyta · laukiam"
 *      skiltyje su nuoroda „Lipdukas PDF" ir sekimo numeriu.
 * „Tiekėjas atveža pats" ir rankiniai tiekėjai (ŽB) siuntos NEREGISTRUOJA.
 *
 * Petshop AV Tiekimas v1.5 (H246) — RANKINIS UŽSAKYMO KANALAS (ŽB) + KOPIJUOJAMAS SĄRAŠAS.
 *
 * KODĖL (Raimis, H246): „ZB iš vis aš rankiniu būdu turiu suvesti prekes į jų
 * sistemą" — laiškas ŽB nereikalingas ir klaidina. DABAR: ŽB partijos mygtukas
 * „Uždaryti partiją — suvesiu ŽB sistemoje" laiško NESIUNČIA, tik uždaro partiją.
 * Prie kiekvienos užsakytos partijos („Užsakyta · laukiam") — kopijuojamas
 * sąrašas SKU + kiekis, kad suvedimas į tiekėjo B2B būtų copy-paste.
 *
 * Petshop AV Tiekimas v1.4 (H238) — PARTIJOS PRISTATYMO BŪDAS ir SVORIS.
 *
 * KODĖL (Raimis H237–H238): kaip prekės atkeliauja iš tiekėjo į AV, sprendžiama
 * NE prie užsakymo, o prie partijos — nes į vieną partiją krenta kelių užsakymų
 * prekės plius tai, ką pats prisidedi. Tik čia matai visą krūvą ir jos svorį.
 *
 * TRYS BŪDAI:
 *   paštomatas — Venipak paštomatas Nemenčinėje (AIBĖ, Švenčionių g. 72),
 *                talpa 25 kg, dėžė iki 61×39,5×41 cm;
 *   kurjeris   — pastovus AV sandėlio adresas;
 *   tiekėjas   — atveža pats savo sąskaita, termino nežadam.
 *
 * Pirmus du registruojam SAVO Venipak sutartimi (Raimis moka): siuntėjas —
 * tiekėjo sandėlis, gavėjas — mes. Trečiu atveju siunta neformuojama.
 *
 * SVORIS skaičiuojamas iš prekių, bet lieka redaguojamas — kurjeriui reikia
 * BENDRO partijos svorio, o katalogo svoriai ne visada pilni.
 *
 * v1.3 (H236) — kaupimo veiksmai iškelti į PROGRAMINĮ API:
 * `ideti_eilute()` / `isimti_eilute()`. Iki šiol įdėti eilutę galėjai tik per
 * mygtuko nuorodą (admin-post + nonce + redirect). Mišrių užsakymų sprendimo
 * kortelė turi tą patį padaryti keliom eilutėm iš karto, todėl logika perkelta
 * į vieną vietą, o `eilutes_veiksmas()` dabar tik apvalkalas su teisėmis.
 *
 * v1.2 (S567) — prekių parsivežimas iš tiekėjų sandėlių.
 *
 * KODĖL (Raimio aprašytas procesas 2026-08-06):
 * Ateina mišrus užsakymas — dalis prekių AV, dalis VF. Vietoj to, kad klientas
 * gautų dvi siuntas, VF eilutė įkrenta į TIEKIMO LENTELĘ. Per dieną tokių
 * smulkmenų susikaupia; 13:00 jos vienu užsakymu parsivežamos į AV, o iš ten
 * keliauja klientui viena tvarkinga siunta.
 *
 * KELIAS:
 *   1. mišrus užsakymas apmokamas  → tiekėjo eilutės į atvirą partiją,
 *                                     užsakymas pažymimas „laukia prekių“
 *   2. lentelė kaupiasi visą dieną → kiekius gali keisti, prekes pridėti/trinti
 *   3. „Užsakyti“                  → laiškas tiekėjui, partija UŽSAKYTA
 *   4. „Prekės gautos“             → suvedi FAKTINIUS kiekius (ne užsakytus),
 *                                     jie krinta į AV likutį su žurnalo įrašu
 *   5. užsakymai, kuriems užteko   → tampa paprasti AV
 *      kuriems neužteko            → į KLAUSIMUS, trūkumas keliauja į naują partiją
 *
 * PRINCIPAS: sistema nespėja, ką gavai. Ji siūlo užsakytą kiekį, o įrašo tik tai,
 * ką patvirtinai. Galiojimas — išskleidžiamas laukelis, kad neerzintų;
 * atsidaro pats, jei tai prekei data jau kada nors buvo įvesta.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_AV_Tiekimas {

	const SLUG      = 'ps-tiekimas';
	const DB_VER    = '1.2';
	const OPT_DB    = 'ps_tiekimas_db';
	const META_LAUK = '_ps_tiekimas_laukia';

	/** Tiekėjai, kuriems užsakymas suvedamas rankiniu būdu į jų sistemą — laiško nesiunčiam (H246). */
	const RANKINIAI = array( 'zb' );

	/** Laiško adresatų pasirinkimas — įsimenamas tarp partijų (H248). */
	public static function laisko_nust() {
		$v = (array) get_option( 'ps_tiek_laiskai', array() );
		return array(
			'tiekejui' => ! empty( $v['tiekejui'] ),
			'man'      => isset( $v['man'] ) ? ! empty( $v['man'] ) : true,
		);
	}

	public static function rankinis( $tiekejas ) {
		return in_array( (string) $tiekejas, self::RANKINIAI, true );
	}

	/** Kur prekės keliauja, kai parsivežam į AV. Gavėjas visada UAB Avesa. */
	const AV_ADRESAS   = 'UAB Avesa, Liucionių g. 46, Liucionys, Nemenčinės sen., Vilniaus r., LT-15166';
	const AV_PASTOMATAS = array(
		'id'      => 3648,
		'kodas'   => '300906055', // K3: Venipak API company_code paštomatui = jo code, ne id
		'api_vardas' => 'Venipak locker, AIBĖ Venipak paštomatas', // K3: name kaip get_pickup_points
		'vardas'  => 'Nemenčinės AIBĖ Venipak paštomatas',
		'adresas' => 'Švenčionių g. 72, Nemenčinė, LT-15168',
		'riba_kg' => 25,
	);
	const PRISTATYMAI = array(
		'pastomatas' => 'Venipak paštomatas (Nemenčinė)',
		'kurjeris'   => 'Venipak kurjeris į AV',
		'tiekejas'   => 'Tiekėjas atveža pats',
	);
	const META_PART = '_ps_tiekimas_partijos';

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'meniu' ), 20 );
		add_action( 'admin_init', array( __CLASS__, 'lenteles' ) );
		add_action( 'admin_post_ps_tiekimas', array( __CLASS__, 'veiksmas' ) );

		add_action( 'admin_post_ps_tiekimas_eilute', array( __CLASS__, 'eilutes_veiksmas' ) );
		add_action( 'admin_post_ps_tiekimas_lipdukas', array( __CLASS__, 'lipduko_atsisiuntimas' ) );
	}

	/* ============================ LENTELĖS ============================ */

	public static function t_partijos() { global $wpdb; return $wpdb->prefix . 'ps_tiekimas'; }
	public static function t_eilutes()  { global $wpdb; return $wpdb->prefix . 'ps_tiekimas_eil'; }

	public static function lenteles() {
		if ( get_option( self::OPT_DB ) === self::DB_VER ) { return; }
		global $wpdb;
		$c = $wpdb->get_charset_collate();
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		dbDelta( "CREATE TABLE " . self::t_partijos() . " (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			tiekejas VARCHAR(32) NOT NULL,
			busena VARCHAR(16) NOT NULL DEFAULT 'kaupiama',
			venipak_pack VARCHAR(255) DEFAULT NULL,
			venipak_manifest VARCHAR(64) DEFAULT NULL,
			sukurta DATETIME NOT NULL,
			uzsakyta DATETIME NULL,
			gauta DATETIME NULL,
			siuntos_kodas VARCHAR(64) NULL,
			pristatymas VARCHAR(16) NULL,
			svoris DECIMAL(8,2) NULL,
			pastaba TEXT NULL,
			dezes INT NOT NULL DEFAULT 1,
			PRIMARY KEY (id),
			KEY tiekejas_busena (tiekejas, busena)
		) $c;" );

		dbDelta( "CREATE TABLE " . self::t_eilutes() . " (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			partija_id BIGINT UNSIGNED NOT NULL,
			product_id BIGINT UNSIGNED NOT NULL,
			order_id BIGINT UNSIGNED NULL,
			qty INT NOT NULL DEFAULT 0,
			qty_gauta INT NULL,
			galiojimas VARCHAR(10) NULL,
			pastaba VARCHAR(190) NULL,
			PRIMARY KEY (id),
			KEY partija (partija_id),
			KEY preke (product_id),
			KEY uzsakymas (order_id)
		) $c;" );

		update_option( self::OPT_DB, self::DB_VER );
	}

	/* ============================ KAUPIMAS ============================ */

	/** Atvira (kaupiama) tiekėjo partija; jei nėra — sukuriama. */
	public static function atvira_partija( $tiekejas ) {
		global $wpdb;
		$id = $wpdb->get_var( $wpdb->prepare(
			'SELECT id FROM ' . self::t_partijos() . " WHERE tiekejas=%s AND busena='kaupiama' ORDER BY id DESC LIMIT 1",
			$tiekejas ) );
		if ( $id ) { return (int) $id; }
		$wpdb->insert( self::t_partijos(), array(
			'tiekejas' => $tiekejas,
			'busena'   => 'kaupiama',
			'sukurta'  => current_time( 'mysql' ),
		) );
		return (int) $wpdb->insert_id;
	}

	/**
	 * PUSIAU AUTOMATINIS KAUPIMAS (Raimio sprendimas 2026-08-06).
	 * Sistema NIEKO nesprendžia už tave: mišrus užsakymas guli „Naujuose“ kaip
	 * visi kiti, o šalia kiekvienos tiekėjo eilutės yra mygtukas
	 * „Į tiekimo lentelę“. Nepaspaudei — eilutė lieka dropshipu.
	 * Sprendimas EILUTĖS lygmens, todėl „VF siunčia pats, ZB parsivežam“
	 * gaunasi savaime, be jokių atskirų ekranų.
	 */
	public static function eilutes_veiksmas() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }

		$oid = isset( $_GET['oid'] ) ? absint( $_GET['oid'] ) : 0;
		$iid = isset( $_GET['iid'] ) ? absint( $_GET['iid'] ) : 0;
		$ka  = isset( $_GET['ka'] ) ? sanitize_key( $_GET['ka'] ) : 'ideti';
		check_admin_referer( 'ps_tiek_eil_' . $oid . '_' . $iid );

		$atgal = isset( $_GET['g'] )
			? wp_validate_redirect( wp_unslash( $_GET['g'] ), admin_url( 'admin.php?page=ps-desk' ) )
			: admin_url( 'admin.php?page=ps-desk' );

		$o = $oid ? wc_get_order( $oid ) : false;
		if ( ! $o ) { wp_die( 'Užsakymas nerastas' ); }

		global $wpdb;
		$zinute = 'klaida';

		if ( 'istrinti' === $ka ) {
			$zinute = self::isimti_eilute( $o, $iid ) ? 'eilute_isimta' : 'klaida';
		} else {
			if ( ! $o->get_item( $iid ) ) { wp_die( 'Eilutė nerasta' ); }
			$p = self::ideti_eilute( $o, $iid );
			if ( ! $p ) { wp_die( 'Ši eilutė nėra tiekėjo prekė' ); }
			$zinute = 'eilute_ideta';
		}

		wp_safe_redirect( add_query_arg( array( 'pd_ok' => $zinute ), $atgal ) );
		exit;
	}

	/**
	 * Įdeda užsakymo eilutę į kaupiamą tiekėjo partiją (parsivežam į AV).
	 *
	 * Viena tiesos vieta: naudoja ir mygtukas skydelyje, ir mišrių užsakymų
	 * sprendimo kortelė (H236). Grąžina partijos ID arba 0, jei eilutė netinka.
	 * Jei eilutė jau kaupiamoje partijoje — nieko nedaro ir grąžina tą partiją,
	 * kad pakartotinis sprendimo patvirtinimas nedubliuotų užsakymo tiekėjui.
	 */
	public static function ideti_eilute( $o, $iid, $src = '' ) {
		global $wpdb;
		$item = $o->get_item( $iid );
		if ( ! $item ) { return 0; }

		if ( ! $src ) {
			$src = $item->get_meta( '_ps_source' );
			if ( ! is_string( $src ) || '' === $src ) {
				$v = class_exists( 'Petshop_AV_Source' )
					? Petshop_AV_Source::resolve( $item->get_product_id(), $item->get_quantity() ) : array();
				$src = ( is_array( $v ) && ! empty( $v['source'] ) ) ? $v['source'] : '';
			}
		}
		if ( ! $src || 'av' === $src ) { return 0; }

		$jau = self::eilutes_bukle( $o->get_id(), (int) $iid );
		if ( $jau ) { return (int) $jau->partija_id; }

		$partija = self::atvira_partija( $src );
		$wpdb->insert( self::t_eilutes(), array(
			'partija_id' => $partija,
			'product_id' => $item->get_product_id(),
			'order_id'   => $o->get_id(),
			'qty'        => (int) $item->get_quantity(),
			'pastaba'    => 'eilutė ' . (int) $iid,
		) );

		$o->update_meta_data( self::META_LAUK, 1 );
		$o->add_order_note( sprintf( 'Tiekimas: „%s“ (%d vnt) įtraukta į %s partiją #%d — parsivežam į AV.',
			$item->get_name(), (int) $item->get_quantity(),
			self::tiekejo_vardas( $src ), $partija ), false, true );
		$o->save();

		return (int) $partija;
	}

	/**
	 * Išima eilutę iš KAUPIAMOS partijos (grįžta į dropshipą).
	 * Jau užsakytos ar gautos partijos neliečiamos — prekė tiekėjui jau užsakyta.
	 */
	public static function isimti_eilute( $o, $iid ) {
		global $wpdb;
		$n = $wpdb->query( $wpdb->prepare(
			'DELETE e FROM ' . self::t_eilutes() . ' e
			 INNER JOIN ' . self::t_partijos() . " p ON p.id=e.partija_id
			 WHERE e.order_id=%d AND e.pastaba=%s AND p.busena='kaupiama'",
			$o->get_id(), 'eilutė ' . (int) $iid ) );

		if ( $n ) {
			$o->add_order_note( 'Tiekimas: prekė išimta iš tiekimo lentelės — grįžta į dropshipą.', false, true );
		}
		self::perziuret_laukima( $o );
		return (int) $n;
	}

	/** „12,4 kg“ arba „—“. */
	public static function kg( $kg ) {
		if ( $kg <= 0 ) { return '—'; }
		return rtrim( rtrim( number_format( (float) $kg, 1, ',', ' ' ), '0' ), ',' ) . ' kg';
	}

	/** Partijos svoris iš prekių (kg) ir kiek eilučių be svorio. */
	public static function partijos_svoris( $pid ) {
		$kg = 0.0; $be = 0;
		foreach ( self::partijos_eilutes( $pid ) as $e ) {
			$pr = wc_get_product( $e->product_id );
			$w  = $pr ? (float) $pr->get_weight() : 0;
			if ( $w <= 0 ) { $be++; continue; }
			$kg += $w * (int) $e->qty;
		}
		return array( round( $kg, 2 ), $be );
	}

	/** Rodomas svoris: rankinis, jei įvestas; kitaip — iš prekių. */
	public static function svoris( $part ) {
		if ( null !== $part->svoris && '' !== $part->svoris && (float) $part->svoris > 0 ) {
			return (float) $part->svoris;
		}
		list( $kg ) = self::partijos_svoris( $part->id );
		return $kg;
	}

	/** Ar užsakymas dar ko nors laukia; jei ne — vėliavėlė nuimama. */
	protected static function perziuret_laukima( $o ) {
		global $wpdb;
		$liko = (int) $wpdb->get_var( $wpdb->prepare(
			'SELECT COUNT(*) FROM ' . self::t_eilutes() . ' e
			 INNER JOIN ' . self::t_partijos() . " p ON p.id=e.partija_id
			 WHERE e.order_id=%d AND p.busena<>'gauta'", $o->get_id() ) );
		if ( ! $liko ) { $o->delete_meta_data( self::META_LAUK ); }
		$o->save();
	}

	/**
	 * Ar ŠI užsakymo eilutė jau tiekimo lentelėje.
	 * Grąžina objektą su partija/busena/tiekeju arba null.
	 */
	public static function eilutes_bukle( $order_id, $item_id ) {
		global $wpdb;
		return $wpdb->get_row( $wpdb->prepare(
			'SELECT e.id, e.partija_id, e.qty, e.qty_gauta, p.busena, p.tiekejas
			 FROM ' . self::t_eilutes() . ' e
			 INNER JOIN ' . self::t_partijos() . ' p ON p.id=e.partija_id
			 WHERE e.order_id=%d AND e.pastaba=%s ORDER BY e.id DESC LIMIT 1',
			$order_id, 'eilutė ' . $item_id ) );
	}

	/** Nuoroda mygtukui darbalaukio skydelyje. */
	public static function eilutes_url( $order_id, $item_id, $ka = 'ideti', $grazinti = '' ) {
		return wp_nonce_url(
			admin_url( 'admin-post.php?action=ps_tiekimas_eilute&oid=' . (int) $order_id
				. '&iid=' . (int) $item_id . '&ka=' . rawurlencode( $ka )
				. ( $grazinti ? '&g=' . rawurlencode( $grazinti ) : '' ) ),
			'ps_tiek_eil_' . (int) $order_id . '_' . (int) $item_id );
	}

	/* ============================ MENIU ============================ */

	public static function meniu() {
		add_submenu_page( 'ps-desk', 'Tiekimas', 'Tiekimas', 'edit_shop_orders',
			self::SLUG, array( __CLASS__, 'puslapis' ) );
	}

	public static function tiekejo_vardas( $k ) {
		$v = array(
			'vf' => 'Vetfarmas', 'zb' => 'Žalioji Banga', 'quattro' => 'Quattro / Kauno grūdai',
			'prins' => 'Prins / Faunas', 'ambrosia' => 'Ambrosia', 'belcor_tofu' => 'Belacor',
		);
		return $v[ $k ] ?? mb_strtoupper( $k );
	}

	protected static function partijos( $busena ) {
		global $wpdb;
		return $wpdb->get_results( $wpdb->prepare(
			'SELECT * FROM ' . self::t_partijos() . ' WHERE busena=%s ORDER BY tiekejas ASC', $busena ) );
	}

	public static function partijos_eilutes( $partija_id ) {
		global $wpdb;
		return $wpdb->get_results( $wpdb->prepare(
			'SELECT * FROM ' . self::t_eilutes() . ' WHERE partija_id=%d ORDER BY id ASC', $partija_id ) );
	}

	/* ============================ PUSLAPIS ============================ */

	public static function puslapis() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		$rodyti = isset( $_GET['b'] ) ? sanitize_key( $_GET['b'] ) : 'kaupiama';
		self::stilius();
		echo '<div class="wrap ps-tk"><h1>Tiekimas</h1>';
		self::pranesimas();

		printf( '<p><a class="button" href="%s">← Petshop užsakymai</a></p>',
			esc_url( admin_url( 'admin.php?page=ps-desk' ) ) );

		echo '<h2 class="nav-tab-wrapper">';
		$sk = self::laukianciu_skaiciai();
		$tabai = array(
			'kaupiama' => 'Kaupiama',
			'uzsakyta' => 'Užsakyta · laukiam',
			'laukia'   => 'Laukia prekių' . ( $sk['viso'] ? ' (' . $sk['viso'] . ')' : '' ),
			'gauta'    => 'Gautos partijos',
		);
		foreach ( $tabai as $k => $t ) {
			printf( '<a class="nav-tab%s" href="%s">%s</a>',
				$k === $rodyti ? ' nav-tab-active' : '',
				esc_url( admin_url( 'admin.php?page=' . self::SLUG . '&b=' . $k ) ), esc_html( $t ) );
		}
		echo '</h2>';

		if ( 'laukia' === $rodyti ) { self::skiltis_laukia(); echo '</div>'; return; }

		$p = self::partijos( $rodyti );
		if ( ! $p ) {
			$t = array(
				'kaupiama' => 'Nieko nesikaupia. Mišrūs užsakymai čia atsiras patys.',
				'uzsakyta' => 'Nėra išsiųstų užsakymų tiekėjams.',
				'gauta'    => 'Dar nepriimta nė viena partija.',
			);
			echo '<div class="ps-tk-tuscia">' . esc_html( $t[ $rodyti ] ) . '</div></div>';
			return;
		}

		foreach ( $p as $part ) {
			if ( 'gauta' === $rodyti ) { self::kortele_gauta( $part ); }
			elseif ( 'uzsakyta' === $rodyti ) { self::kortele_priemimas( $part ); }
			else { self::kortele_kaupiama( $part ); }
		}
		echo '</div>';
	}

	/* ---------- 1. KAUPIAMA ---------- */

	protected static function kortele_kaupiama( $part ) {
		$eil = self::partijos_eilutes( $part->id );
		$riba = class_exists( 'Petshop_Desk' ) ? Petshop_Desk::RIBOS[ $part->tiekejas ] ?? '' : '';
		?>
		<div class="ps-tk-k">
			<div class="ps-tk-h">
				<b><?php echo esc_html( self::tiekejo_vardas( $part->tiekejas ) ); ?></b>
				<span class="ps-tk-sub">partija #<?php echo (int) $part->id; ?> · atidaryta
					<?php echo esc_html( mysql2date( 'm-d H:i', $part->sukurta ) ); ?></span>
				<?php if ( $riba ) : ?><span class="ps-tk-riba">užsakyti iki <?php echo esc_html( $riba ); ?></span><?php endif; ?>
			</div>
			<?php // H260: jei to paties tiekėjo laukia neperduoti užsakymai — vienas laiškas iš dropship kortelės.
			if ( $eil && ! self::rankinis( $part->tiekejas ) && class_exists( 'Petshop_AV_Dropship' ) ) {
				$lg = Petshop_AV_Dropship::laukiantys_perdavimo();
				if ( ! empty( $lg[ $part->tiekejas ] ) ) {
					printf( '<div class="notice notice-info inline" style="margin:8px 0"><p>%s laukia <b>%d</b> neperduot%s užsakym%s — partiją galima įdėti į <b>tą patį laišką</b>: <a class="button" href="%s">Laiškai tiekėjams → %s</a></p></div>',
						esc_html( self::tiekejo_vardas( $part->tiekejas ) ), count( $lg[ $part->tiekejas ] ),
						1 === count( $lg[ $part->tiekejas ] ) ? 'as' : 'i', 1 === count( $lg[ $part->tiekejas ] ) ? 'as' : 'ai',
						esc_url( admin_url( 'admin.php?page=ps-laiskai&b=laukia' ) ), esc_html( self::tiekejo_vardas( $part->tiekejas ) ) );
				}
			}
			?>

			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="ps_tiekimas">
				<input type="hidden" name="partija" value="<?php echo (int) $part->id; ?>">
				<?php wp_nonce_field( 'ps_tiekimas_' . $part->id ); ?>

				<table class="widefat striped ps-tk-t">
					<thead><tr><th>Prekė</th><th>SKU</th><th class="r">Kiekis</th><th>Kam</th><th></th></tr></thead>
					<tbody>
					<?php if ( ! $eil ) : ?>
						<tr><td colspan="5" class="ps-tk-tuscia2">Tuščia — pridėk prekę žemiau.</td></tr>
					<?php endif; ?>
					<?php foreach ( $eil as $e ) :
						$pr = wc_get_product( $e->product_id ); ?>
						<tr>
							<td><b><?php echo esc_html( $pr ? $pr->get_name() : '#' . $e->product_id ); ?></b></td>
							<td class="mono"><?php echo esc_html( $pr ? $pr->get_sku() : '' ); ?></td>
							<td class="r"><input type="number" min="0" name="qty[<?php echo (int) $e->id; ?>]"
								value="<?php echo (int) $e->qty; ?>" class="ps-tk-q"></td>
							<td><?php
								if ( $e->order_id ) {
									$oo = wc_get_order( $e->order_id );
									printf( '<a href="%s">#%s</a>', esc_url( $oo ? $oo->get_edit_order_url() : '#' ),
										esc_html( $oo ? $oo->get_order_number() : $e->order_id ) );
								} else { echo '<span class="ps-tk-atsargai">į atsargas</span>'; }
							?></td>
							<td><label class="ps-tk-del"><input type="checkbox" name="trinti[]" value="<?php echo (int) $e->id; ?>"> trinti</label></td>
						</tr>
					<?php endforeach; ?>
					</tbody>
				</table>

				<div class="ps-tk-pridek">
					<label>Pridėti prekę:</label>
					<input type="text" name="nauja_sku" placeholder="SKU arba prekės ID" class="ps-tk-sku">
					<input type="number" name="nauja_qty" placeholder="kiekis" min="1" value="1" class="ps-tk-q">
					<button class="button" name="ka" value="pridėti">Pridėti</button>
				</div>

				<?php
				list( $auto_kg, $be_svorio ) = self::partijos_svoris( $part->id );
				$kg   = self::svoris( $part );
				$bud  = $part->pristatymas ? $part->pristatymas : '';
				$pst  = self::AV_PASTOMATAS;
				?>
				<div class="ps-tk-prist">
					<div class="ps-tk-prist-h">Kaip prekės atkeliaus į AV</div>
					<div class="ps-tk-prist-r">
						<?php foreach ( self::PRISTATYMAI as $k => $v ) : ?>
							<label class="ps-tk-rad<?php echo $bud === $k ? ' on' : ''; ?>">
								<input type="radio" name="pristatymas" value="<?php echo esc_attr( $k ); ?>"
									<?php checked( $bud, $k ); ?>> <?php echo esc_html( $v ); ?>
							</label>
						<?php endforeach; ?>

						<label class="ps-tk-kg">Bendras svoris
							<input type="number" step="0.1" min="0" name="svoris" value="<?php echo esc_attr( $kg > 0 ? $kg : '' ); ?>"
								placeholder="<?php echo esc_attr( $auto_kg > 0 ? $auto_kg : '' ); ?>"> kg
						</label>
						<label class="ps-tk-kg">Dėžių / lipdukų
							<input type="number" step="1" min="1" max="20" name="dezes" value="<?php echo (int) max( 1, (int) ( $part->dezes ?? 1 ) ); ?>">
						</label>
					</div>

					<div class="ps-tk-prist-i">
						<?php if ( 'pastomatas' === $bud ) : ?>
							Gavėjas: <b><?php echo esc_html( $pst['vardas'] ); ?></b> ·
							<?php echo esc_html( $pst['adresas'] ); ?> · ID <?php echo (int) $pst['id']; ?>.
							<?php if ( $kg > $pst['riba_kg'] ) : ?>
								<span class="ps-tk-blogai">Paštomato riba <?php echo (int) $pst['riba_kg']; ?> kg —
									<?php echo esc_html( self::kg( $kg ) ); ?> netilps, rinkis kurjerį.</span>
							<?php endif; ?>
						<?php elseif ( 'kurjeris' === $bud ) : ?>
							Gavėjas: <b><?php echo esc_html( self::AV_ADRESAS ); ?></b>.
							Siuntą registruoji savo Venipak sutartimi, paėmimas — iš tiekėjo sandėlio.
						<?php elseif ( 'tiekejas' === $bud ) : ?>
							Tiekėjas atveža savo sąskaita — siunta neformuojama, termino nežadam.
						<?php else : ?>
							Nepasirinkta. Laiške tiekėjui bus parašyta tik tai, ką pasirinksi čia.
						<?php endif; ?>
						<?php if ( $be_svorio ) : ?>
							<span class="ps-tk-blogai"><?php echo (int) $be_svorio; ?> prekė(-ės) be svorio kataloge —
								suma nepilna, patikslink ranka.</span>
						<?php endif; ?>
					</div>
				</div>

				<?php $ln = self::laisko_nust(); ?>
				<?php if ( ! self::rankinis( $part->tiekejas ) ) : ?>
					<div class="ps-tk-laiskai">
						<input type="hidden" name="laisk_zyme" value="1">
						<b>Kam siųsti laišką užsakant:</b>
						<label><input type="checkbox" name="laisk_tiekejui" value="1"
							<?php checked( $ln['tiekejui'] ); ?>> Siųsti laišką tiekėjui</label>
						<label><input type="checkbox" name="laisk_man" value="1"
							<?php checked( $ln['man'] ); ?>> Siųsti man (terra@petshop.lt)</label>
						<span class="ps-tk-sub2">Pasirinkimas įsimenamas. Nuėmus abi — laiškas neišeis niekam.</span>
					</div>
				<?php endif; ?>

				<div class="ps-tk-f">
					<button class="button" name="ka" value="issaugoti">Išsaugoti kiekius</button>
					<?php if ( $eil && self::rankinis( $part->tiekejas ) ) : ?>
						<button class="button button-primary" name="ka" value="uzsakyti"
							onclick="return confirm('Uždaryti <?php echo esc_js( self::tiekejo_vardas( $part->tiekejas ) ); ?> partiją?\n\nLaiškas NEBUS siunčiamas — prekes suvesi tiekėjo sistemoje pats.\nPartija persikels į „Užsakyta · laukiam“, ten rasi kopijuojamą sąrašą.');">
							Uždaryti partiją — suvesiu <?php echo esc_html( self::tiekejo_vardas( $part->tiekejas ) ); ?> sistemoje</button>
					<?php elseif ( $eil ) : ?>
						<button class="button button-primary" name="ka" value="uzsakyti"
							onclick="return confirm('Išsiųsti užsakymą tiekėjui <?php echo esc_js( self::tiekejo_vardas( $part->tiekejas ) ); ?>?\n\nLaiškas keliaus el. paštu, partija bus uždaryta ir atsidarys nauja.');">
							Užsakyti iš tiekėjo →</button>
					<?php endif; ?>
				</div>
			</form>
		</div>
		<?php
	}

	/** Laukiantys užsakymai + „Atnaujinti likučius“. */
	protected static function skiltis_laukia() {
		list( $eil, $gali, $laukia ) = self::likuciu_perziura( false );
		if ( ! $eil ) {
			echo '<div class="ps-tk-tuscia">Nė vienas užsakymas nelaukia prekių.</div>';
			return;
		}
		?>
		<div class="ps-tk-k">
			<div class="ps-tk-h">
				<b>Laukia prekių</b>
				<span class="ps-tk-sub"><?php echo (int) count( $eil ); ?> užsakymai · <?php echo (int) $gali; ?> jau gali judėti</span>
			</div>
			<p class="ps-tk-pad">Kai tiekėjas atveža pats ir suvedi sąskaitą, prekės jau yra AV likutyje.
				Šis mygtukas jas paskiria laukiantiems užsakymams. <b>Kas laukia ilgiau — gauna pirmas.</b></p>

			<table class="widefat striped ps-tk-t">
				<thead><tr><th>Užsakymas</th><th>Klientas</th><th>Prekės</th><th>Būklė</th></tr></thead>
				<tbody>
				<?php foreach ( $eil as $u ) : ?>
					<tr>
						<td><b>#<?php echo esc_html( $u['nr'] ); ?></b><div class="ps-tk-sku2"><?php echo esc_html( $u['data'] ); ?></div></td>
						<td><?php echo esc_html( $u['kl'] ); ?></td>
						<td>
							<?php foreach ( $u['prekes'] as $p ) : ?>
								<div class="ps-tk-pr<?php echo $p['ok'] ? '' : ' ps-tk-truksta'; ?>">
									<?php echo esc_html( $p['preke'] ); ?>
									<span class="mono">reikia <?php echo (int) $p['reikia']; ?> · yra <?php echo (int) max( 0, $p['yra'] ); ?></span>
								</div>
							<?php endforeach; ?>
						</td>
						<td><?php
							echo $u['uztenka']
								? '<span class="ps-tk-ok">→ atlaisvinti</span>'
								: '<span class="ps-tk-lauk">trūksta — lieka laukti</span>';
						?></td>
					</tr>
				<?php endforeach; ?>
				</tbody>
			</table>

			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ps-tk-f">
				<input type="hidden" name="action" value="ps_tiekimas">
				<input type="hidden" name="partija" value="0">
				<?php wp_nonce_field( 'ps_tiekimas_0' ); ?>
				<button class="button button-primary" name="ka" value="likuciai" <?php disabled( 0, $gali ); ?>
					onclick="return confirm('Atlaisvinti <?php echo (int) $gali; ?> užsakymus?\n\nPrekės bus nurašytos iš AV likučio ir priskirtos šiems užsakymams.');">
					Vykdyti — atlaisvinti <?php echo (int) $gali; ?></button>
				<?php if ( ! $gali ) : ?>
					<span class="ps-tk-pad" style="margin:0">Nė vienam užsakymui prekių dar neužtenka.</span>
				<?php endif; ?>
			</form>
		</div>
		<?php
	}

	/* ---------- 2. PRIĖMIMAS ---------- */

	protected static function kortele_priemimas( $part ) {
		$eil = self::partijos_eilutes( $part->id );
		?>
		<div class="ps-tk-k">
			<div class="ps-tk-h">
				<b><?php echo esc_html( self::tiekejo_vardas( $part->tiekejas ) ); ?></b>
				<span class="ps-tk-sub">partija #<?php echo (int) $part->id; ?> · užsakyta
					<?php echo esc_html( mysql2date( 'm-d H:i', $part->uzsakyta ) ); ?></span>
				<?php if ( ! empty( $part->venipak_pack ) ) : ?>
					<span class="ps-tk-vp">siunta <b><?php echo esc_html( $part->venipak_pack ); ?></b>
						<a target="_blank" href="<?php echo esc_url( admin_url(
							'admin-post.php?action=ps_tiekimas_lipdukas&partija=' . (int) $part->id
							. '&_wpnonce=' . wp_create_nonce( 'ps_tiek_lip_' . $part->id ) ) ); ?>">Lipdukas PDF</a></span>
				<?php endif; ?>
			</div>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="ps_tiekimas">
				<input type="hidden" name="partija" value="<?php echo (int) $part->id; ?>">
				<?php wp_nonce_field( 'ps_tiekimas_' . $part->id ); ?>

				<?php
				// Kopijuojamas sąrašas suvedimui į tiekėjo sistemą (H246): SKU [TAB] kiekis [TAB] prekė.
				$kopija = '';
				foreach ( $eil as $e ) {
					$pr2     = wc_get_product( $e->product_id );
					$kopija .= ( $pr2 ? $pr2->get_sku() : '#' . $e->product_id ) . "\t" . (int) $e->qty
						. "\t" . ( $pr2 ? $pr2->get_name() : '' ) . "\n";
				}
				?>
				<details class="ps-tk-kopija" <?php echo self::rankinis( $part->tiekejas ) ? 'open' : ''; ?>>
					<summary>Sąrašas suvedimui į tiekėjo sistemą (SKU · kiekis)</summary>
					<textarea readonly rows="<?php echo max( 3, count( $eil ) + 1 ); ?>"
						id="ps-kop-<?php echo (int) $part->id; ?>"><?php echo esc_textarea( $kopija ); ?></textarea>
					<button type="button" class="button"
						onclick="var t=document.getElementById('ps-kop-<?php echo (int) $part->id; ?>');t.select();
							if(navigator.clipboard){navigator.clipboard.writeText(t.value);}else{document.execCommand('copy');}
							this.textContent='Nukopijuota ✓';">Kopijuoti sąrašą</button>
				</details>

				<p class="ps-tk-pad">Suvesk <b>faktinius</b> kiekius. Numatyta tai, kas užsakyta — kur sutampa, nieko keisti nereikia.</p>

				<table class="widefat striped ps-tk-t">
					<thead><tr><th>Prekė</th><th class="r">Užsakyta</th><th class="r">Gauta</th><th>Galiojimas</th><th>Kam</th></tr></thead>
					<tbody>
					<?php foreach ( $eil as $e ) :
						$pr  = wc_get_product( $e->product_id );
						$sen = class_exists( 'Petshop_AV_Expiry' ) ? Petshop_AV_Expiry::data( $e->product_id ) : '';
						?>
						<tr>
							<td><b><?php echo esc_html( $pr ? $pr->get_name() : '#' . $e->product_id ); ?></b>
								<div class="ps-tk-sku2"><?php echo esc_html( $pr ? $pr->get_sku() : '' ); ?></div></td>
							<td class="r mono"><?php echo (int) $e->qty; ?></td>
							<td class="r"><input type="number" min="0" name="gauta[<?php echo (int) $e->id; ?>]"
								value="<?php echo (int) $e->qty; ?>" class="ps-tk-q"></td>
							<td>
								<?php if ( $sen ) : ?>
									<input type="text" name="galioja[<?php echo (int) $e->id; ?>]" value=""
										placeholder="<?php echo esc_attr( $sen ); ?>" class="ps-tk-data">
									<div class="ps-tk-sena">sandėlyje: <?php echo esc_html( $sen ); ?></div>
								<?php else : ?>
									<a href="#" class="ps-tk-atid">+ galiojimas</a>
									<input type="text" name="galioja[<?php echo (int) $e->id; ?>]" value=""
										placeholder="YYYY-MM" class="ps-tk-data ps-slept">
								<?php endif; ?>
							</td>
							<td><?php
								if ( $e->order_id ) {
									$oo = wc_get_order( $e->order_id );
									printf( '<a href="%s">#%s</a>', esc_url( $oo ? $oo->get_edit_order_url() : '#' ),
										esc_html( $oo ? $oo->get_order_number() : $e->order_id ) );
								} else { echo '<span class="ps-tk-atsargai">į atsargas</span>'; }
							?></td>
						</tr>
					<?php endforeach; ?>
					</tbody>
				</table>

				<div class="ps-tk-f">
					<button class="button button-primary" name="ka" value="priimti"
						onclick="return confirm('Priimti partiją?\n\nĮvesti kiekiai bus pridėti prie AV likučių, o užsakymai, kuriems prekių užteko, keliaus į rytinę eigą.');">
						Prekės gautos — priimti →</button>
				</div>
			</form>
		</div>
		<?php
	}

	/* ---------- 3. GAUTOS ---------- */

	protected static function kortele_gauta( $part ) {
		$eil = self::partijos_eilutes( $part->id );
		echo '<div class="ps-tk-k ps-tk-gauta"><div class="ps-tk-h"><b>' .
			esc_html( self::tiekejo_vardas( $part->tiekejas ) ) . '</b><span class="ps-tk-sub">partija #' .
			(int) $part->id . ' · gauta ' . esc_html( mysql2date( 'Y-m-d H:i', $part->gauta ) ) . '</span></div>';
		echo '<table class="widefat striped ps-tk-t"><thead><tr><th>Prekė</th><th class="r">Užsakyta</th><th class="r">Gauta</th><th>Galiojimas</th></tr></thead><tbody>';
		foreach ( $eil as $e ) {
			$pr = wc_get_product( $e->product_id );
			printf( '<tr><td>%s</td><td class="r mono">%d</td><td class="r mono%s">%d</td><td>%s</td></tr>',
				esc_html( $pr ? $pr->get_name() : '#' . $e->product_id ),
				(int) $e->qty,
				( (int) $e->qty_gauta < (int) $e->qty ) ? ' ps-tk-mazai' : '',
				(int) $e->qty_gauta,
				esc_html( $e->galiojimas ? $e->galiojimas : '—' ) );
		}
		echo '</tbody></table></div>';
	}

	/* ============================ VEIKSMAI ============================ */

	/** Lipduko PDF atsisiuntimas iš partijos kortelės (H247). */
	public static function lipduko_atsisiuntimas() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		$pid = isset( $_GET['partija'] ) ? absint( $_GET['partija'] ) : 0;
		check_admin_referer( 'ps_tiek_lip_' . $pid );
		global $wpdb;
		$pack = $wpdb->get_var( $wpdb->prepare(
			'SELECT venipak_pack FROM ' . self::t_partijos() . ' WHERE id=%d', $pid ) );
		if ( ! $pack ) { wp_die( 'Šiai partijai siunta neužregistruota.' ); }
		$pdf = self::venipak_lipdukas( $pack );
		if ( ! $pdf ) { wp_die( 'Lipduko gauti nepavyko — patikrink Venipak prisijungimą.' ); }
		header( 'Content-Type: application/pdf' );
		header( 'Content-Disposition: inline; filename="lipdukas-' . $pack . '.pdf"' );
		echo $pdf; // phpcs:ignore
		exit;
	}

	public static function veiksmas() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		$pid = isset( $_POST['partija'] ) ? absint( $_POST['partija'] ) : 0;
		check_admin_referer( 'ps_tiekimas_' . $pid );
		$ka = isset( $_POST['ka'] ) ? sanitize_text_field( wp_unslash( $_POST['ka'] ) ) : '';

		global $wpdb;
		$zinute = '';

		if ( 'issaugoti' === $ka || 'pridėti' === $ka || 'uzsakyti' === $ka ) {
			if ( ! empty( $_POST['qty'] ) && is_array( $_POST['qty'] ) ) {
				foreach ( $_POST['qty'] as $eid => $q ) {
					$wpdb->update( self::t_eilutes(), array( 'qty' => max( 0, (int) $q ) ), array( 'id' => (int) $eid ) );
				}
			}
			if ( ! empty( $_POST['trinti'] ) && is_array( $_POST['trinti'] ) ) {
				foreach ( $_POST['trinti'] as $eid ) {
					$wpdb->delete( self::t_eilutes(), array( 'id' => (int) $eid ) );
				}
			}
			// Pristatymo būdas ir svoris — partijos savybės (H238).
			$pr_upd = array();
			if ( isset( $_POST['pristatymas'] ) ) {
				$b = sanitize_key( wp_unslash( $_POST['pristatymas'] ) );
				if ( isset( self::PRISTATYMAI[ $b ] ) ) { $pr_upd['pristatymas'] = $b; }
			}
			if ( isset( $_POST['svoris'] ) ) {
				$w = (float) str_replace( ',', '.', wp_unslash( $_POST['svoris'] ) );
				$pr_upd['svoris'] = $w > 0 ? round( $w, 2 ) : null;
			}
			if ( isset( $_POST['dezes'] ) ) { $pr_upd['dezes'] = max( 1, min( 20, absint( $_POST['dezes'] ) ) ); }
			if ( $pr_upd ) { $wpdb->update( self::t_partijos(), $pr_upd, array( 'id' => $pid ) ); }

			// Laiško adresatų varnelės (H248) — įsimenam prieš siunčiant.
			if ( isset( $_POST['laisk_zyme'] ) || isset( $_POST['laisk_tiekejui'] ) || isset( $_POST['laisk_man'] ) ) {
				update_option( 'ps_tiek_laiskai', array(
					'tiekejui' => ! empty( $_POST['laisk_tiekejui'] ),
					'man'      => ! empty( $_POST['laisk_man'] ),
				) );
			}

			$zinute = 'issaugota';
		}

		if ( 'pridėti' === $ka ) {
			$sku = isset( $_POST['nauja_sku'] ) ? sanitize_text_field( wp_unslash( $_POST['nauja_sku'] ) ) : '';
			$q   = isset( $_POST['nauja_qty'] ) ? max( 1, absint( $_POST['nauja_qty'] ) ) : 1;
			$prod = is_numeric( $sku ) ? wc_get_product( (int) $sku ) : false;
			if ( ! $prod && $sku ) {
				$id = wc_get_product_id_by_sku( $sku );
				if ( $id ) { $prod = wc_get_product( $id ); }
			}
			if ( $prod ) {
				$wpdb->insert( self::t_eilutes(), array(
					'partija_id' => $pid, 'product_id' => $prod->get_id(), 'order_id' => null, 'qty' => $q ) );
				$zinute = 'prideta';
			} else {
				$zinute = 'nerasta';
			}
		}

		if ( 'likuciai' === $ka ) {
			list( , $gali ) = self::likuciu_perziura( true );
			wp_safe_redirect( add_query_arg( array( 'page' => self::SLUG, 'b' => 'laukia', 'tk' => 'likuciai', 'n' => $gali ), admin_url( 'admin.php' ) ) );
			exit;
		}
		if ( 'uzsakyti' === $ka ) { $zinute = self::uzsakyti( $pid ); }
		if ( 'priimti' === $ka )  { $zinute = self::priimti( $pid ); }

		wp_safe_redirect( add_query_arg( array(
			'page' => self::SLUG,
			'p'    => $pid,
			'b'    => ( 'uzsakyti' === $ka && 'vp_klaida' !== $zinute ) ? 'uzsakyta' : ( ( 'priimti' === $ka ) ? 'gauta' : 'kaupiama' ),
			'tk'   => $zinute,
		), admin_url( 'admin.php' ) ) );
		exit;
	}

	/* ==================== VENIPAK: SIUNTA IŠ TIEKĖJO SANDĖLIO (H247) ==================== */

	protected static function venipak_nust() {
		$n = (array) get_option( 'shopup_venipak_shipping_settings', array() );
		return array(
			'user'   => $n['shopup_venipak_shipping_field_username'] ?? '',
			'pass'   => $n['shopup_venipak_shipping_field_password'] ?? '',
			'userid' => $n['shopup_venipak_shipping_field_userid'] ?? '',
			'manif'  => $n['shopup_venipak_shipping_field_manifest'] ?? '',
			'format' => $n['shopup_venipak_shipping_field_labelformat'] ?? 'sticker',
			'snd'    => array(
				'name'    => $n['shopup_venipak_shipping_field_sendername'] ?? '',
				'code'    => $n['shopup_venipak_shipping_field_sendercompanycode'] ?? '',
				'country' => $n['shopup_venipak_shipping_field_sendercountry'] ?? 'LT',
				'city'    => $n['shopup_venipak_shipping_field_sendercity'] ?? '',
				'addr'    => $n['shopup_venipak_shipping_field_senderaddress'] ?? '',
				'post'    => $n['shopup_venipak_shipping_field_senderpostcode'] ?? '',
				'person'  => $n['shopup_venipak_shipping_field_sendercontactperson'] ?? '',
				'tel'     => $n['shopup_venipak_shipping_field_sendercontacttel'] ?? '',
				'email'   => $n['shopup_venipak_shipping_field_sendercontactemail'] ?? '',
			),
		);
	}

	/** Pack numerį rezervuojam per patį pluginą — kad nesikirstų su užsakymų siuntomis. */
	protected static function pack_numeris() {
		$n = self::venipak_nust();
		global $wpdb;
		$wpdb->query( "UPDATE {$wpdb->options} SET option_value = option_value + 1 WHERE option_name = 'venipak_pack_number'" );
		wp_cache_delete( 'venipak_pack_number', 'options' );
		wp_cache_delete( 'alloptions', 'options' );
		$nr = (int) $wpdb->get_var( "SELECT option_value FROM {$wpdb->options} WHERE option_name = 'venipak_pack_number'" );
		if ( ! $nr ) { $nr = 1000001; update_option( 'venipak_pack_number', $nr ); }
		return 'V' . $n['userid'] . 'E' . str_pad( (string) $nr, 7, '0', STR_PAD_LEFT );
	}

	/**
	 * Registruoja siuntą: iš tiekėjo sandėlio → AV (kurjeris) arba → Nemenčinės paštomatas.
	 * Grąžina array( 'ok'=>bool, 'pack'=>string, 'manifest'=>string, 'klaida'=>string ).
	 */
	public static function venipak_registruoti( $part ) {
		$n   = self::venipak_nust();
		if ( empty( $n['user'] ) || empty( $n['pass'] ) ) {
			return array( 'ok' => false, 'klaida' => 'Venipak prisijungimo duomenų nėra plugino nustatymuose.' );
		}

		$kg    = max( 0.1, (float) self::svoris( $part ) );
		$dezes = max( 1, (int) ( $part->dezes ?? 1 ) );
		// H261: į TĄ PATĮ tiekėjo manifestą kaip klientų siuntos (vienas kurjerio paėmimas).
		$kodas = ( class_exists( 'Petshop_Desk' ) && isset( Petshop_Desk::MANIFESTAI[ $part->tiekejas ] ) )
			? Petshop_Desk::MANIFESTAI[ $part->tiekejas ] : $n['manif'];
		$man   = $n['userid'] . wp_date( 'ymd' ) . $kodas;
		$packs = array(); for ( $i = 0; $i < $dezes; $i++ ) { $packs[] = self::pack_numeris(); }
		$kg1   = round( $kg / $dezes, 2 ); if ( $kg1 < 0.1 ) { $kg1 = 0.1; }
		// Paštomatas: Venipak leidžia 1 dėžę siuntai → n siuntų tame pačiame manifeste. Kurjeris: 1 siunta, n pack'ų.
		$siuntu = ( 'pastomatas' === $part->pristatymas ) ? $dezes : 1;

		$d = new DOMDocument( '1.0', 'utf-8' );
		$desc = $d->createElement( 'description' );
		$desc->setAttribute( 'type', '1' );
		$d->appendChild( $desc );
		$mf = $d->createElement( 'manifest' );
		$mf->setAttribute( 'title', $man );
		$desc->appendChild( $mf );

		for ( $s = 0; $s < $siuntu; $s++ ) {
		$sh = $d->createElement( 'shipment' );
		$mf->appendChild( $sh );

		// SIUNTĖJAS — standartinis, kaip visose siuntose (plugino nustatymai).
		$snd = $n['snd'];
		$se  = $d->createElement( 'sender' );
		$sh->appendChild( $se );
		$se->appendChild( $d->createElement( 'name', $snd['name'] ) );
		$se->appendChild( $d->createElement( 'company_code', $snd['code'] ) );
		$se->appendChild( $d->createElement( 'country', $snd['country'] ) );
		$se->appendChild( $d->createElement( 'city', $snd['city'] ) );
		$se->appendChild( $d->createElement( 'address', $snd['addr'] ) );
		$se->appendChild( $d->createElement( 'post_code', preg_replace( '/\D/', '', $snd['post'] ) ) );
		$se->appendChild( $d->createElement( 'contact_person', $snd['person'] ) );
		$se->appendChild( $d->createElement( 'contact_tel', $snd['tel'] ) );
		$se->appendChild( $d->createElement( 'contact_email', $snd['email'] ) );

		// GAVĖJAS — AV sandėlis arba mūsų paštomatas.
		$co  = $d->createElement( 'consignee' );
		$sh->appendChild( $co );
		$pst = self::AV_PASTOMATAS;
		if ( 'pastomatas' === $part->pristatymas ) {
			// K3: lygiai kaip Venipak pluginas (admin-dispatch.php): company_code = paštomato `code`,
			// PIRMAS elementas, name = API `name` („Venipak locker, …“), ne display_name.
			$co->appendChild( $d->createElement( 'company_code', (string) ( $pst['kodas'] ?? $pst['id'] ) ) );
			$co->appendChild( $d->createElement( 'name', $pst['api_vardas'] ?? $pst['vardas'] ) );
			$co->appendChild( $d->createElement( 'country', 'LT' ) );
			$co->appendChild( $d->createElement( 'city', 'Nemenčinė' ) );
			$co->appendChild( $d->createElement( 'address', 'Švenčionių g. 72' ) );
			$co->appendChild( $d->createElement( 'post_code', '15168' ) );
		} else {
			$co->appendChild( $d->createElement( 'name', 'UAB Avesa' ) );
			$co->appendChild( $d->createElement( 'country', 'LT' ) );
			$co->appendChild( $d->createElement( 'city', 'Liucionys, Nemenčinės sen., Vilniaus r.' ) );
			$co->appendChild( $d->createElement( 'address', 'Liucionių g. 46' ) );
			$co->appendChild( $d->createElement( 'post_code', '15166' ) );
		}
		$co->appendChild( $d->createElement( 'contact_person', $n['snd']['person'] ) );
		$co->appendChild( $d->createElement( 'contact_tel', $n['snd']['tel'] ) );
		$co->appendChild( $d->createElement( 'contact_email', $n['snd']['email'] ) );

		$at = $d->createElement( 'attribute' );
		$sh->appendChild( $at );
		$sc = 'TIEK-' . (int) $part->id . ( $siuntu > 1 ? '-' . ( $s + 1 ) : '' );
		$at->appendChild( $d->createElement( 'shipment_code', $sc ) );
		$at->appendChild( $d->createElement( 'doc_no', $sc ) );
		if ( 'pastomatas' !== $part->pristatymas ) {
			$at->appendChild( $d->createElement( 'comment_call', '1' ) );
		}
		$at->appendChild( $d->createElement( 'comment_text',
			'Prekiu uzsakymas is tiekejo sandelio (partija #' . (int) $part->id . ')' ) );

		$sios = ( $siuntu > 1 ) ? array( $packs[ $s ] ) : $packs;
		foreach ( $sios as $pn ) {
			$pk = $d->createElement( 'pack' );
			$sh->appendChild( $pk );
			$pk->appendChild( $d->createElement( 'pack_no', $pn ) );
			$pk->appendChild( $d->createElement( 'weight', (string) $kg1 ) );
		}
		} // shipment
		$pack = implode( ',', $packs );

		$r = wp_remote_post( 'https://go.venipak.lt/import/send.php', array(
			'timeout' => 45,
			'body'    => array( 'user' => $n['user'], 'pass' => $n['pass'], 'xml_text' => $d->saveXML() ),
			'headers' => array( 'Referer' => 'https://woocommerce.com/' ),
		) );
		if ( is_wp_error( $r ) ) { return array( 'ok' => false, 'klaida' => $r->get_error_message() ); }
		$body = (string) wp_remote_retrieve_body( $r );
		if ( '' === $body ) {
			return array( 'ok' => false, 'klaida' => 'Venipak grąžino tuščią atsakymą — siunta NEUŽREGISTRUOTA.' );
		}
		if ( false === strpos( $body, 'type="ok"' ) ) {
			return array( 'ok' => false, 'klaida' => trim( wp_strip_all_tags( $body ) ) );
		}
		return array( 'ok' => true, 'pack' => $pack, 'manifest' => $man, 'klaida' => '' );
	}

	/** Lipduko PDF baitai iš Venipak (print_label). */
	public static function venipak_lipdukas( $pack ) {
		$n = self::venipak_nust();
		$r = wp_remote_post( 'https://go.venipak.lt/ws/print_label', array(
			'timeout' => 45,
			// H262: keli pack'ai — TIK masyvu (pack_no[]); kableliais Venipak grąžina tuščią atsakymą.
			'body'    => array( 'user' => $n['user'], 'pass' => $n['pass'], 'pack_no' => array_values( array_filter( explode( ',', (string) $pack ) ) ), 'format' => $n['format'] ),
		) );
		if ( is_wp_error( $r ) ) { return null; }
		$b = wp_remote_retrieve_body( $r );
		return ( $b && 0 === strpos( $b, '%PDF' ) ) ? $b : null;
	}

	/** Laiškas tiekėjui + partija uždaroma. */
	/**
	 * Atvira tiekėjo partija su eilutėmis — dropship kortelei (H260).
	 * Grąžina array(part, eilutes, svoris) arba null, jei nėra ko dėti.
	 */
	public static function atvira_su_eilutemis( $tiekejas ) {
		global $wpdb;
		$part = $wpdb->get_row( $wpdb->prepare(
			'SELECT * FROM ' . self::t_partijos() . " WHERE tiekejas=%s AND busena='kaupiama' ORDER BY id DESC LIMIT 1", $tiekejas ) );
		if ( ! $part ) { return null; }
		$eil = self::partijos_eilutes( (int) $part->id );
		if ( ! $eil ) { return null; }
		return array( 'part' => $part, 'eilutes' => $eil, 'svoris' => self::svoris( $part ) );
	}

	/**
	 * PARUOŠIMAS BE LAIŠKO (H260): Venipak registracija (jei reikia ir dar nėra),
	 * laiško dalis (kelias + lentelė), lipduko failas. Partija NEUŽDAROMA.
	 * Grąžina array( ok, klaida, html, priedas, pack, part, eilutes ).
	 */
	public static function paruosti( $pid, $dezes = 0 ) {
		global $wpdb;
		$part = $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . self::t_partijos() . ' WHERE id=%d', $pid ) );
		if ( ! $part || 'kaupiama' !== $part->busena ) { return array( 'ok' => false, 'klaida' => 'partija neatvira' ); }
		$eil = self::partijos_eilutes( $pid );
		if ( ! $eil ) { return array( 'ok' => false, 'klaida' => 'partija tuščia' ); }
		if ( $dezes > 0 && empty( $part->venipak_pack ) ) { // dėžių skaičius iš kortelės — kol siunta neregistruota
			$wpdb->update( self::t_partijos(), array( 'dezes' => max( 1, min( 20, (int) $dezes ) ) ), array( 'id' => $pid ) );
			$part->dezes = max( 1, min( 20, (int) $dezes ) );
		}

		$pack = (string) $part->venipak_pack; // jau registruota anksčiau (pvz. nepavykęs laiškas) — nekartojam
		$reikia_vp = in_array( $part->pristatymas, array( 'kurjeris', 'pastomatas' ), true ) && ! self::rankinis( $part->tiekejas );
		if ( $reikia_vp && ! $pack ) {
			$vp = self::venipak_registruoti( $part );
			if ( ! $vp['ok'] ) { return array( 'ok' => false, 'klaida' => 'Venipak: ' . $vp['klaida'] ); }
			$wpdb->update( self::t_partijos(), array( 'venipak_pack' => $vp['pack'], 'venipak_manifest' => $vp['manifest'] ), array( 'id' => $pid ) );
			$pack = $vp['pack']; $part->venipak_pack = $pack;
		}

		$html = self::laisko_dalis( $part, $eil, $pack );

		$priedas = '';
		if ( $pack ) {
			$pdf = self::venipak_lipdukas( $pack );
			if ( $pdf ) {
				$up = wp_upload_dir(); $kel = trailingslashit( $up['basedir'] ) . 'ps-lipdukai'; wp_mkdir_p( $kel );
				$fail = $kel . '/lipdukas-' . str_replace( ',', '_', $pack ) . '.pdf';
				if ( file_put_contents( $fail, $pdf ) ) { $priedas = $fail; }
			}
		}
		return array( 'ok' => true, 'klaida' => '', 'html' => $html, 'priedas' => $priedas, 'pack' => $pack, 'part' => $part, 'eilutes' => $eil );
	}

	/**
	 * Laiško dalis „UAB Avesa" (H261) — antraštė + lentelė kaip klientų + lipdukų eilutė.
	 * Naudoja ir dropship laiškas, ir savas Tiekimo laiškas — VIENA tiesos vieta.
	 */
	public static function laisko_dalis( $part, $eil, $pack = '' ) {
		$h = '<p style="margin:16px 0 6px"><b>UAB Avesa, Liucionių g. 46</b></p>';
		$h .= '<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:Arial;font-size:13px;">';
		foreach ( $eil as $e ) {
			$pr = wc_get_product( $e->product_id );
			$h .= '<tr><td>' . esc_html( $pr ? $pr->get_name() : '#' . $e->product_id )
				. ( $pr && $pr->get_sku() ? ' <span style="color:#666">' . esc_html( $pr->get_sku() ) . '</span>' : '' )
				. '</td><td align="center" style="white-space:nowrap">' . (int) $e->qty . ' vnt.</td></tr>';
		}
		$h .= '</table>';
		$dezes = max( 1, (int) ( $part->dezes ?? 1 ) );
		if ( 'tiekejas' === $part->pristatymas ) {
			$h .= '<p style="font-size:12px;color:#444">Šias prekes atsiimsime patys / atvešite Jūs — lipdukų nereikia.</p>';
		} elseif ( $pack ) {
			$n = count( array_filter( explode( ',', $pack ) ) );
			$h .= '<p style="font-size:12px;color:#444">' . ( 'pastomatas' === $part->pristatymas ? 'Į paštomatą' : 'Kurjeriui' ) . ' — ' . $n . ' lipduk' . ( 1 === $n ? 'as' : 'ai' ) . ' priede (' . esc_html( str_replace( ',', ', ', $pack ) ) . ').</p>';
		} else {
			$h .= '<p style="font-size:12px;color:#444">' . $dezes . ' dėž' . ( 1 === $dezes ? 'ė' : 'ės' ) . ' — lipdukai bus priede.</p>';
		}
		return $h;
	}

	/** UŽDARYMAS po išsiųsto laiško (H260) — būsena, pastabos užsakymuose. $kontekstas — kas siuntė. */
	public static function uzdaryti_po_laisko( $pid, $kontekstas = '' ) {
		global $wpdb;
		$part = $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . self::t_partijos() . ' WHERE id=%d', $pid ) );
		if ( ! $part || 'kaupiama' !== $part->busena ) { return false; }
		$wpdb->update( self::t_partijos(), array( 'busena' => 'uzsakyta', 'uzsakyta' => current_time( 'mysql' ) ), array( 'id' => $pid ) );
		foreach ( self::partijos_eilutes( $pid ) as $e ) {
			if ( ! $e->order_id ) { continue; }
			$oo = wc_get_order( $e->order_id );
			if ( $oo ) {
				$oo->add_order_note( sprintf( 'Tiekimas: prekės užsakytos iš %s (partija #%d%s). Kelias į AV: %s. Laukiam.',
					self::tiekejo_vardas( $part->tiekejas ), $pid, $kontekstas ? ', ' . $kontekstas : '',
					self::PRISTATYMAI[ $part->pristatymas ] ?? 'nenurodyta' ), false, true );
			}
		}
		return true;
	}

	protected static function uzsakyti( $pid ) {
		global $wpdb;
		$part = $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . self::t_partijos() . ' WHERE id=%d', $pid ) );
		if ( ! $part || 'kaupiama' !== $part->busena ) { return 'klaida'; }
		$eil = self::partijos_eilutes( $pid );
		if ( ! $eil ) { return 'tuscia'; }

		$pastai = (array) get_option( 'ps_tiekeju_pastai', array() );
		$adr    = isset( $pastai[ $part->tiekejas ] ) ? $pastai[ $part->tiekejas ] : '';

		$kg  = self::svoris( $part );
		$pst = self::AV_PASTOMATAS;

		// SIUNTOS REGISTRACIJA (H247): tik kai prekes veža Venipak. „Tiekėjas atveža pats"
		// ir rankiniai tiekėjai (ŽB) — be registracijos.
		$vp = array( 'ok' => false, 'pack' => '', 'klaida' => '' );
		$reikia_vp = in_array( $part->pristatymas, array( 'kurjeris', 'pastomatas' ), true )
			&& ! self::rankinis( $part->tiekejas );
		if ( $reikia_vp ) {
			$vp = self::venipak_registruoti( $part );
			if ( ! $vp['ok'] ) {
				// Neregistruota — partijos NEUŽDAROM, kad nedingtų be pėdsako.
				set_transient( 'ps_tiek_vp_klaida_' . $pid, $vp['klaida'], 300 );
				return 'vp_klaida';
			}
			$wpdb->update( self::t_partijos(),
				array( 'venipak_pack' => $vp['pack'], 'venipak_manifest' => $vp['manifest'] ),
				array( 'id' => $pid ) );
			$part->venipak_pack = $vp['pack'];
		}

		$tema = sprintf( 'UAB Avesa · prekių užsakymas %s', wp_date( 'Y-m-d' ) );
		$body = '<p>Laba diena,</p><p>prašome paruošti šias prekes.</p>' . self::laisko_dalis( $part, $eil, $vp['pack'] )
			. '<p>Ačiū,<br>UAB Avesa · petshop.lt<br>terra@petshop.lt</p>';

		$ok = false;
		if ( self::rankinis( $part->tiekejas ) ) {
			// ŽB ir pan.: užsakymą Raimis suveda tiesiai į tiekėjo sistemą — laiško nesiunčiam (H246).
			$ok = null;
		} else {
			// Adresatai pagal varneles (H248). Nuėmus abi — laiškas neišeina.
			$ln    = self::laisko_nust();
			$gav   = array();
			if ( $ln['tiekejui'] && $adr ) { $gav = array_map( 'trim', explode( ',', $adr ) ); }
			if ( $ln['man'] ) { $gav[] = 'terra@petshop.lt'; }
			$gav = array_values( array_unique( array_filter( $gav ) ) );

			if ( $gav ) {
				$priedai = array();
				if ( ! empty( $vp['pack'] ) ) {
					$pdf = self::venipak_lipdukas( $vp['pack'] );
					if ( $pdf ) {
						$up   = wp_upload_dir();
						$kel  = trailingslashit( $up['basedir'] ) . 'ps-lipdukai';
						wp_mkdir_p( $kel );
						$fail = $kel . '/lipdukas-' . str_replace( ',', '_', $vp['pack'] ) . '.pdf';
						if ( file_put_contents( $fail, $pdf ) ) { $priedai[] = $fail; }
					}
				}
				// Kai siunčiam tik sau — antraštėje pažymim, kad laiškas persiuntimui.
				$t2 = ( ! $ln['tiekejui'] )
					? sprintf( '[PERSIŲSTI %s] %s', self::tiekejo_vardas( $part->tiekejas ), $tema )
					: $tema;
				$ok = wp_mail( $gav, $t2, $body, array(
					'Content-Type: text/html; charset=UTF-8',
					'From: UAB Avesa <terra@petshop.lt>',
				), $priedai );
				if ( class_exists( 'Petshop_AV_Dropship' ) ) {
					Petshop_AV_Dropship::archyvuoti( $gav, $t2, $body, $priedai,
						'Tiekimo partija #' . (int) $part->id . ' · ' . self::tiekejo_vardas( $part->tiekejas ) );
				}
			} else {
				$ok = null; // niekam nesiunčiam
			}
		}

		$wpdb->update( self::t_partijos(),
			array( 'busena' => 'uzsakyta', 'uzsakyta' => current_time( 'mysql' ) ),
			array( 'id' => $pid ) );

		foreach ( $eil as $e ) {
			if ( ! $e->order_id ) { continue; }
			$oo = wc_get_order( $e->order_id );
			if ( $oo ) {
				$oo->add_order_note( sprintf( self::rankinis( $part->tiekejas )
					? 'Tiekimas: partija #%2$d uždaryta — užsakymas suvedamas rankiniu būdu į %1$s sistemą. Kelias į AV: %3$s. Laukiam.'
					: 'Tiekimas: prekės užsakytos iš %s (partija #%d). Kelias į AV: %s. Laukiam.',
					self::tiekejo_vardas( $part->tiekejas ), $pid,
					self::PRISTATYMAI[ $part->pristatymas ] ?? 'nenurodyta' ), false, true );
			}
		}

		if ( self::rankinis( $part->tiekejas ) ) { return 'uzsakyta_rankinis'; }
		$ln = self::laisko_nust();
		if ( null === $ok ) { return 'uzsakyta_be_laisko'; }
		if ( ! $ok ) { return 'laiskas_nepavyko'; }
		if ( ! $ln['tiekejui'] ) { return 'uzsakyta_man'; }
		return $vp['pack'] ? 'uzsakyta_vp' : 'uzsakyta';
	}

	/**
	 * Priėmimas: faktiniai kiekiai → AV likutis, užsakymų sprendimas.
	 * Trūkumas automatiškai keliauja į naują tos pačios tiekėjo partiją.
	 */
	protected static function priimti( $pid ) {
		global $wpdb;
		$part = $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . self::t_partijos() . ' WHERE id=%d', $pid ) );
		if ( ! $part || 'uzsakyta' !== $part->busena ) { return 'klaida'; }

		$gauta   = isset( $_POST['gauta'] ) && is_array( $_POST['gauta'] ) ? $_POST['gauta'] : array();
		$galioja = isset( $_POST['galioja'] ) && is_array( $_POST['galioja'] ) ? $_POST['galioja'] : array();

		$eil      = self::partijos_eilutes( $pid );
		$trukumas = array();
		$paliesti = array();

		foreach ( $eil as $e ) {
			$g = isset( $gauta[ $e->id ] ) ? max( 0, (int) $gauta[ $e->id ] ) : 0;
			$d = isset( $galioja[ $e->id ] ) ? sanitize_text_field( wp_unslash( $galioja[ $e->id ] ) ) : '';

			$wpdb->update( self::t_eilutes(),
				array( 'qty_gauta' => $g, 'galiojimas' => $d ? $d : null ),
				array( 'id' => $e->id ) );

			if ( $g > 0 && class_exists( 'Petshop_AV_Stock' ) ) {
				Petshop_AV_Stock::increase( $e->product_id, $g,
					sprintf( 'Tiekimas: %s partija #%d', mb_strtoupper( $part->tiekejas ), $pid ) );
			}
			if ( $d && class_exists( 'Petshop_AV_Expiry' ) ) {
				update_post_meta( $e->product_id, Petshop_AV_Expiry::META, $d );
			}
			if ( $g < (int) $e->qty ) {
				$trukumas[] = array( 'pid' => $e->product_id, 'qty' => (int) $e->qty - $g,
					'oid' => $e->order_id, 'pastaba' => $e->pastaba );
			}
			if ( $e->order_id ) { $paliesti[ $e->order_id ] = true; }
		}

		$wpdb->update( self::t_partijos(),
			array( 'busena' => 'gauta', 'gauta' => current_time( 'mysql' ) ),
			array( 'id' => $pid ) );

		// Trūkumas — į naują tos pačios tiekėjo partiją.
		if ( $trukumas ) {
			$nauja = self::atvira_partija( $part->tiekejas );
			foreach ( $trukumas as $t ) {
				$wpdb->insert( self::t_eilutes(), array(
					'partija_id' => $nauja, 'product_id' => $t['pid'],
					'order_id' => $t['oid'], 'qty' => $t['qty'],
					'pastaba' => $t['pastaba'] ) );
			}
		}

		// Užsakymai: kuriems prekių užteko — laisvi; kuriems ne — lieka laukti.
		foreach ( array_keys( $paliesti ) as $oid ) {
			$oo = wc_get_order( $oid );
			if ( ! $oo ) { continue; }
			$liko = (int) $wpdb->get_var( $wpdb->prepare(
				'SELECT COUNT(*) FROM ' . self::t_eilutes() . ' e
				 INNER JOIN ' . self::t_partijos() . " p ON p.id=e.partija_id
				 WHERE e.order_id=%d AND p.busena<>'gauta'", $oid ) );
			if ( $liko ) {
				$oo->add_order_note( sprintf( 'Tiekimas: partija #%d priimta, bet dalies prekių dar trūksta — užsakymas laukia toliau.', $pid ), false, true );
				$oo->save();
				continue;
			}
			$oo->delete_meta_data( self::META_LAUK );
			$perkelta = self::eilutes_i_av( $oo, $pid ); // K2
			$oo->add_order_note( sprintf( 'Tiekimas: visos prekės gautos (partija #%d). Užsakymas paruoštas surinkimui iš AV.%s', $pid,
				$perkelta ? ' Į AV perkeltos eilutės: ' . implode( ', ', $perkelta ) . '.' : '' ), false, true );
			$oo->save();
		}

		return 'priimta';
	}

	/**
	 * K2 (S1602): kai VISOS užsakymo tiekimo eilutės gautos — konsoliduotos eilutės tampa AV.
	 * Grąžina perkeltų eilučių pavadinimus. Užsakymo NEsaugo — kviečiantysis.
	 */
	public static function eilutes_i_av( $oo, $pid ) {
		$perkelta = array(); $grupes = array();
		foreach ( $oo->get_items() as $iid => $it ) {
			$src = (string) $it->get_meta( '_ps_source' );
			if ( $src && 'av' !== $src && $it->get_meta( '_ps_konsolidacija' ) ) {
				$qty = max( 1, (int) $it->get_quantity() );
				$it->update_meta_data( '_ps_source', 'av' );
				$it->update_meta_data( '_ps_carrier', 'any' );
				$it->update_meta_data( '_ps_source_reason', sprintf( 'parsivežta iš %s, partija #%d', mb_strtoupper( $src ), (int) $pid ) );
				$it->update_meta_data( '_ps_source_at', current_time( 'mysql' ) );
				// Gautas kiekis ką tik įrašytas į AV (increase) — iš karto rezervuojam šiam užsakymui.
				if ( ! $it->get_meta( '_ps_av_reduced' ) && class_exists( 'Petshop_AV_Stock' ) && method_exists( 'Petshop_AV_Stock', 'decrease' ) ) {
					Petshop_AV_Stock::decrease( (int) $it->get_product_id(), $qty, sprintf( 'Tiekimas: rezervuota užsakymui #%s (partija #%d)', $oo->get_order_number(), (int) $pid ) );
					$it->update_meta_data( '_ps_av_reduced', current_time( 'mysql' ) );
				}
				$it->save();
				$perkelta[] = $it->get_name();
			}
		}
		if ( ! $perkelta ) { return array(); }
		// Perskaičiuojam grupes taip pat, kaip Petshop_AV_Order::fiksuoti().
		foreach ( $oo->get_items() as $it ) {
			$s = (string) $it->get_meta( '_ps_source' ); if ( ! $s ) { continue; }
			$c = (string) $it->get_meta( '_ps_carrier' ); if ( ! $c ) { $c = 'av' === $s ? 'any' : 'venipak'; }
			if ( ! isset( $grupes[ $s ] ) ) { $grupes[ $s ] = array( 'carrier' => $c, 'eilutes' => 0, 'vienetai' => 0 ); }
			$grupes[ $s ]['eilutes']++;
			$grupes[ $s ]['vienetai'] += max( 1, (int) $it->get_quantity() );
		}
		$tipas = ( class_exists( 'Petshop_AV_Source' ) && method_exists( 'Petshop_AV_Source', 'order_type' ) )
			? Petshop_AV_Source::order_type( $grupes )
			: ( count( $grupes ) > 1 ? 'MIXED' : ( isset( $grupes['av'] ) ? 'MAIN' : 'DS' ) );
		$oo->update_meta_data( '_ps_order_type', $tipas );
		$oo->update_meta_data( '_ps_groups', wp_json_encode( $grupes ) );
		$oo->update_meta_data( '_ps_shipments', count( $grupes ) );
		// Mišraus planas (`_ps_misrus_sprendimas`) paliekamas kaip įrašytas — kons_laukia() ir
		// eile() perkeltą eilutę praleidžia, nes jos šaltinis jau av.
		return $perkelta;
	}

	/* ==================== LIKUČIŲ ATNAUJINIMAS ====================
	 * Antras kelias (Raimio sprendimas 2026-08-06): tiekėjas atveža pats,
	 * Raimis suveda sąskaitą — likučiai AV sandėlyje jau yra. Belieka
	 * susieti juos su laukiančiais užsakymais.
	 *
	 * TAISYKLĖ: kas laukia ILGIAU, tas gauna pirmas. Kitaip vienas gautų
	 * dalį, kitas dalį, ir nė vienas neišvažiuotų.
	 * ============================================================== */

	/**
	 * Ką duotų atnaujinimas. $vykdyti=false — tik peržiūra.
	 * Grąžina [eilutės[], atlaisvinta, laukia].
	 */
	public static function likuciu_perziura( $vykdyti = false ) {
		global $wpdb;

		$uzsakymai = wc_get_orders( array(
			'limit'      => 100,
			'type'       => 'shop_order',
			'status'     => array( 'processing', 'on-hold' ),
			'orderby'    => 'date',
			'order'      => 'ASC',                       // seniausi pirma
			'meta_key'   => self::META_LAUK,
			'meta_value' => 1,
		) );

		$rezervuota  = array();                          // pid => kiek jau paskirta
		$eil         = array();
		$atlaisvinti = array();

		foreach ( (array) $uzsakymai as $o ) {
			if ( ! is_a( $o, 'WC_Order' ) ) { continue; }
			$oid    = $o->get_id();
			$uztenka = true;
			$mano    = array();

			$laukia = $wpdb->get_results( $wpdb->prepare(
				'SELECT e.* FROM ' . self::t_eilutes() . ' e
				 INNER JOIN ' . self::t_partijos() . " p ON p.id=e.partija_id
				 WHERE e.order_id=%d AND p.busena<>'gauta'", $oid ) );

			// jei tiekimo lentelėje eilučių nėra, žiūrim pačias užsakymo eilutes
			if ( ! $laukia ) {
				foreach ( $o->get_items() as $iid => $it ) {
					$src = $it->get_meta( '_ps_source' );
					if ( 'av' === $src ) { continue; }
					$laukia[] = (object) array(
						'id' => 0, 'product_id' => $it->get_product_id(),
						'qty' => (int) $it->get_quantity(), 'partija_id' => 0,
					);
				}
			}

			foreach ( $laukia as $l ) {
				$pid  = (int) $l->product_id;
				$turi = class_exists( 'Petshop_AV_Stock' ) ? (int) Petshop_AV_Stock::qty( $pid ) : 0;
				$jau  = isset( $rezervuota[ $pid ] ) ? $rezervuota[ $pid ] : 0;
				$lieka = $turi - $jau;
				$reikia = (int) $l->qty;

				$ok = ( $lieka >= $reikia );
				if ( $ok ) { $rezervuota[ $pid ] = $jau + $reikia; } else { $uztenka = false; }

				$pr = wc_get_product( $pid );
				$mano[] = array(
					'preke'  => $pr ? $pr->get_name() : '#' . $pid,
					'pid'    => $pid,
					'reikia' => $reikia,
					'yra'    => $lieka,
					'ok'     => $ok,
					'eid'    => (int) $l->id,
				);
			}

			$eil[] = array(
				'oid'     => $oid,
				'nr'      => $o->get_order_number(),
				'kl'      => trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ),
				'data'    => $o->get_date_created() ? wp_date( 'm-d H:i', $o->get_date_created()->getTimestamp() ) : '',
				'prekes'  => $mano,
				'uztenka' => $uztenka,
			);
			if ( $uztenka && $mano ) { $atlaisvinti[] = $oid; }
		}

		if ( ! $vykdyti ) {
			return array( $eil, count( $atlaisvinti ), count( $eil ) - count( $atlaisvinti ) );
		}

		// VYKDOM: nurašom iš likučio ir atlaisvinam
		foreach ( $eil as $u ) {
			if ( ! $u['uztenka'] || ! $u['prekes'] ) { continue; }
			$o = wc_get_order( $u['oid'] );
			if ( ! $o ) { continue; }

			foreach ( $u['prekes'] as $p ) {
				if ( class_exists( 'Petshop_AV_Stock' ) ) {
					Petshop_AV_Stock::decrease( $p['pid'], $p['reikia'],
						sprintf( 'Tiekimas: paskirta užsakymui #%s', $u['nr'] ) );
				}
				if ( $p['eid'] ) {
					$wpdb->update( self::t_eilutes(),
						array( 'qty_gauta' => $p['reikia'] ), array( 'id' => $p['eid'] ) );
				}
			}

			// eilutes pažymim gautomis — partijos uždaromos atskirai
			$wpdb->query( $wpdb->prepare(
				'UPDATE ' . self::t_eilutes() . ' SET qty_gauta = qty WHERE order_id=%d AND qty_gauta IS NULL', $u['oid'] ) );

			$o->delete_meta_data( self::META_LAUK );
			$o->add_order_note( 'Tiekimas: prekės rastos AV likutyje ir paskirtos šiam užsakymui. Paruošta surinkimui.', false, true );
			$o->save();
		}

		return array( $eil, count( $atlaisvinti ), count( $eil ) - count( $atlaisvinti ) );
	}

	/** Kiek užsakymų laukia ir kiek jau galėtų judėti — darbalaukio skaitikliui. */
	public static function laukianciu_skaiciai() {
		list( $eil, $gali, $laukia ) = self::likuciu_perziura( false );
		return array( 'viso' => count( $eil ), 'gali' => $gali, 'laukia' => $laukia );
	}

	/* ============================ SMULKMENOS ============================ */

	protected static function pranesimas() {
		if ( empty( $_GET['tk'] ) ) { return; }
		$k = sanitize_key( wp_unslash( $_GET['tk'] ) );
		$t = array(
			'issaugota'        => array( 'success', 'Kiekiai išsaugoti.' ),
			'prideta'          => array( 'success', 'Prekė pridėta į partiją.' ),
			'nerasta'          => array( 'warning', 'Tokios prekės nerasta — patikrink SKU arba ID.' ),
			'uzsakyta'         => array( 'success', 'Užsakymas išsiųstas tiekėjui. Partija uždaryta, atsidarė nauja.' ),
			'uzsakyta_vp'      => array( 'success', 'Užsakymas išsiųstas tiekėjui, siunta užregistruota Venipak, lipdukas prisegtas prie laiško. Partija uždaryta.' ),
			'uzsakyta_man'     => array( 'success', 'Partija uždaryta. Laiškas su lipduku išsiųstas TAU (terra@petshop.lt) — persiųsk tiekėjui. Tiekėjui sistema nieko nesiuntė.' ),
			'uzsakyta_be_laisko'=> array( 'warning', 'Partija uždaryta, JOKS laiškas neišsiųstas (abi varnelės nuimtos). Lipduką rasi kortelėje.' ),
			'vp_klaida'        => array( 'error', 'Siuntos užregistruoti nepavyko — partija NEUŽDARYTA, laiškas neišsiųstas.' ),
			'uzsakyta_rankinis'=> array( 'success', 'Partija uždaryta, laiškas NESIŲSTAS. Suvesk prekes į tiekėjo sistemą — kopijuojamas sąrašas skirtuke „Užsakyta · laukiam“.' ),
			'laiskas_nepavyko' => array( 'error', 'Partija uždaryta, BET laiško išsiųsti nepavyko — užsakyk rankomis.' ),
			'nera_pasto'       => array( 'warning', 'Partija uždaryta, bet tiekėjo el. pašto nėra — užsakyk rankomis.' ),
			'priimta'          => array( 'success', 'Partija priimta. Kiekiai pridėti prie AV likučių.' ),
			'tuscia'           => array( 'warning', 'Partija tuščia — nėra ko užsakyti.' ),
			'eilute_ideta'     => array( 'success', 'Prekė įtraukta į tiekimo lentelę.' ),
			'eilute_isimta'    => array( 'success', 'Prekė išimta iš tiekimo lentelės.' ),
			'likuciai'         => array( 'success', 'Likučiai peržiūrėti. Užsakymai, kuriems prekių užteko, atlaisvinti ir keliauja į rytinę eigą.' ),
			'klaida'           => array( 'error', 'Veiksmas neįvykdytas — partijos būsena netinkama.' ),
		);
		if ( ! isset( $t[ $k ] ) ) { return; }
		if ( 'vp_klaida' === $k ) {
			$pid2 = isset( $_GET['p'] ) ? absint( $_GET['p'] ) : 0;
			$det  = $pid2 ? get_transient( 'ps_tiek_vp_klaida_' . $pid2 ) : '';
			printf( '<div class="notice notice-error"><p>%s</p>%s</div>',
				esc_html( $t[ $k ][1] ),
				$det ? '<p><b>Venipak atsakė:</b> ' . esc_html( $det ) . '</p>' : '' );
			return;
		}
		printf( '<div class="notice notice-%s is-dismissible"><p>%s</p></div>',
			esc_attr( $t[ $k ][0] ), esc_html( $t[ $k ][1] ) );
	}

	protected static function stilius() {
		?>
<style>
.ps-tk h1{margin-bottom:6px}
.ps-tk-k{background:#fff;border:1px solid #cfd3cc;border-radius:10px;margin:22px 0;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.07)}
.ps-tk-h{display:flex;align-items:center;gap:12px;padding:13px 16px;background:#e9f1ea;border-bottom:2px solid #2d5f3f;border-left:6px solid #2d5f3f}
.ps-tk-h b{font-size:17px;color:#234b32}
.ps-tk-sub{color:#787c78;font-size:12.5px}
.ps-tk-riba{margin-left:auto;background:#FBF2DE;color:#96660C;padding:3px 10px;border-radius:99px;font-size:12.5px;font-weight:600}
.ps-tk-t{border:0;border-radius:0}
.ps-tk-t th{background:#f5f5f1;text-transform:uppercase;font-size:11.5px;letter-spacing:.04em;color:#5e6661}
.ps-tk-t th,.ps-tk-t td{padding:9px 14px}
.ps-tk-t tbody tr:nth-child(even) td{background:#fafaf8}
.ps-tk-t .r{text-align:right}
.ps-tk-t .mono,.ps-tk .mono{font-family:Menlo,Consolas,monospace;font-size:12.5px}
.ps-tk-q{width:74px;text-align:right}
.ps-tk-data{width:110px}
.ps-slept{display:none}
.ps-tk-sena{font-size:11.5px;color:#96660C;margin-top:3px}
.ps-tk-sku2{font-family:Menlo,monospace;font-size:11.5px;color:#8a918c}
.ps-tk-atsargai{color:#787c78;font-style:italic}
.ps-tk-del{font-size:12px;color:#98262A}
.ps-tk-pridek{display:flex;gap:8px;align-items:center;padding:12px 16px;border-top:1px dashed #cfd3cc;background:#fff}
.ps-tk-pridek label{font-size:13px;color:#5e6661}
.ps-tk-sku{width:190px}
.ps-tk-prist{margin:14px 16px 0;padding:12px 14px;background:#f3f6f9;border:1px solid #cdd8e3;border-left:5px solid #2b5c8a;border-radius:6px}
.ps-tk-prist-h{font-size:12.5px;text-transform:uppercase;letter-spacing:.05em;color:#2b5c8a;font-weight:700;margin-bottom:9px}
.ps-tk-prist-h:before{content:'2 · ';}
.ps-tk-pridek:before{content:'1';display:inline-flex;width:20px;height:20px;border-radius:50%;background:#2d5f3f;color:#fff;font-size:12px;font-weight:700;align-items:center;justify-content:center;margin-right:2px}
.ps-tk-prist-r{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.ps-tk-rad{display:flex;align-items:center;gap:6px;border:1.5px solid #b9c4cf;border-radius:99px;
 padding:5px 14px 5px 10px;font-size:13px;cursor:pointer;background:#fff}
.ps-tk-rad.on{border-color:#2D5F3F;background:#E9F1EA;color:#234B32;font-weight:600}
.ps-tk-kg{margin-left:auto;font-size:13px;color:#5E6661;display:flex;align-items:center;gap:6px}
.ps-tk-kg input{width:88px}
.ps-tk-prist-i{font-size:12.5px;color:#5E6661;margin-top:8px;line-height:1.5}
.ps-tk-blogai{color:#98262A;font-weight:600;margin-left:6px}
.ps-tk-f{display:flex;gap:10px;align-items:center;padding:14px 16px;border-top:2px solid #e4e4de;background:#f5f5f1}
.ps-tk-f:before{content:'4 · Užsakymas';font-size:12.5px;text-transform:uppercase;letter-spacing:.05em;color:#5e6661;font-weight:700;margin-right:8px}
.ps-tk-f .button-primary{font-weight:600}
.ps-tk-laiskai{margin:12px 16px;padding:10px 14px;background:#fbf6ec;border:1px solid #e6d5b0;border-left:5px solid #96660c;border-radius:6px;font-size:13px}
.ps-tk-laiskai b:first-child:before{content:'3 · ';color:#96660c}
		.ps-tk-laiskai label{margin-left:14px;cursor:pointer}
		.ps-tk-sub2{display:block;margin-top:4px;color:#666;font-size:12px}
		.ps-tk-vp{margin-left:10px;font-size:12px;color:#1B7A3D}
		.ps-tk-vp a{margin-left:6px}
		.ps-tk-kopija{margin:10px 14px}
		.ps-tk-kopija summary{cursor:pointer;color:#2271b1}
		.ps-tk-kopija textarea{width:100%;font-family:monospace;font-size:12px;margin:6px 0}
		.ps-tk-pad{margin:12px 14px 0;color:#5e6661}
.ps-tk-tuscia{background:#fff;border:1px solid #dcdcd6;border-radius:8px;padding:40px;text-align:center;color:#8a918c;margin-top:16px}
.ps-tk-tuscia2{text-align:center;color:#8a918c;padding:18px}
.ps-tk-mazai{color:#98262A;font-weight:700}
.ps-tk-gauta{opacity:.9}
.ps-tk-pr{padding:2px 0}
.ps-tk-pr .mono{color:#787c78;margin-left:8px}
.ps-tk-truksta{color:#98262A}
.ps-tk-ok{color:#2D5F3F;font-weight:600}
.ps-tk-lauk{color:#96660C}
</style>
<script>
document.addEventListener('click',function(e){
  var a=e.target.closest('.ps-tk-atid');
  if(!a) return;
  e.preventDefault();
  var inp=a.parentNode.querySelector('.ps-tk-data');
  if(inp){ inp.classList.remove('ps-slept'); inp.focus(); a.style.display='none'; }
});
</script>
		<?php
	}
}
Petshop_AV_Tiekimas::init();
