<?php
/**
 * Petshop Darbalaukis v3.6 (S1608, 3 etapas — „Laukiam iš tiekėjų“ kortelės: „Užsakyti iš [T] į AV“ ir „Gauta“ čia pat) — SĄRAŠAS KAIP MAKETE v7 + SKYDELIS SU TRIMIS KELIAIS.
 *
 * KODĖL (Raimis 2026-09-03): „paspaudus ant užsakymo, kaip makete prekės kortelė dešinėje neatsidaro“.
 * Langas daromas pagal `uzsakymai-maketas-v7.html` (suderintas maketas) + spec §3–§5 + registras:
 *  - sąrašas: eilės kaip juostelės viršuje, stulpeliai Užsakymas · Klientas · Prekės ir keliai (kelio
 *    žymė pilnu vardu „Prins → klientui“, po prekėmis takelis) · Pristatymas · Suma · Kitas žingsnis;
 *  - paspaudus eilutę — SKYDELIS dešinėje (600 px): kiekvienai prekei trys keliai (Avesa sandėlis ·
 *    [Tiekėjas] → klientui · [Tiekėjas] → Avesa sandėlį), negalimi pilki, po jais „kodėl“ ir žingsneliai;
 *    pristatymas, Avesos siunta (dėžės, visi numeriai iš `_ps_siuntos` — V4, perregistruoti), žurnalas
 *    (`Petshop_Uzsakymu_Ivykiai::html()`); apačioje „Surūšiuota — į darbą“ / kitas žingsnis · Redaguoti
 *    (5 etapas) · Sąskaita (5 etapas) · Parašyti klientui · Atšaukti;
 *  - Klausimai — kortelės su priežastimi ir veiksmais (C8: 5 priežastys).
 *
 * NAUJI VEIKSMAI (`admin_post_ps_dl_veiksmas`, nonce `ps_dl_{v}_{id}`), variklis (registras A–J) neliestas:
 *  - `kelias` (iid, k=av|tiesiai|i_av) — kelio keitimas su „LIKUTIS SEKA KELIĄ“ (spec §5, B3): Avesa→tiekėjas
 *    +q (grynai AV `_stock`, kitaip `Petshop_AV_Stock::increase`), tiekėjas→Avesa −q (jei Avesoje < q —
 *    neleidžia „Avesoje tik N“), →Avesa sandėlį +q dabar (Gauta daro +q ir −q — K2). Žymė `_ps_av_reduced_qty`
 *    eilutės lygiu; `_ps_source` = av | tiekėjas, `_ps_kelias`, `_ps_misrus_sprendimas[src]` (kad `kons`/
 *    `neperduotos()` gerbtų planą — A7, A10); `_ps_groups/_ps_shipments/_ps_order_type` perskaičiuojami kaip
 *    K2. Keičiama iki pirmo žingsnio (A8); po lipduko/laiško — užrakinta.
 *  - `rusiuoti` — „Surūšiuota“: `_ps_rusiuota` = laikas|vartotojas, keliai įrašomi kiekvienai eilutei;
 *    į partiją NEDEDA (A7) — tai atskiras „Užsakyti iš [T]“ (= esamas `kons`).
 *  - AUTO RŪŠIAVIMAS (spec 6a): `woocommerce_payment_complete` / `..._status_processing` prior. 100 — jei visos
 *    eilutės turi šaltinį ir vienu keliu (gryna Avesa su likučiu arba vienas tiekėjas) → `_ps_rusiuota=auto`.
 *  Kiekvienas veiksmas rašo `Petshop_Uzsakymu_Ivykiai::irasyti()` su prieš/po.
 *
 * v3.6.1: skydelio „kodėl“ gautai prekei — „Gauta į AV iš ZB (užsakymas tiekėjui #15) — siunčiam iš AV“ (buvo tiekėjo pasiūlymo tekstas).
 * v3.6 (3 etapas #1, STARTAS 2026-09-04): eilė „Laukiam iš tiekėjų“ = kortelės per tiekėją. A) užsakyti užsakymai tiekėjui (H1–H3) —
 *   prekių sąrašas su „Gauta“ kiekiais/galiojimu ir mygtukas „Gauta“ (variklio `priimti()`); ZB — „Kopijuoti“. B) „Užsakyti iš [T] į AV“ —
 *   kaupiama partija + dar nesudėtos „veža į AV“ eilutės, pristatymas/svoris/dėžės, adresatai, „Peržiūrėti laišką“; „Kartu su
 *   Dropshipping (n užs.)“ (G4) — sudeda į partiją ir veda į Dropshipping kortelę su varnele „+ į AV“. Savas `admin_post_ps_dl_tiekimas`
 *   sudeda eilutes (kaip variklio `kons`) ir paleidžia `admin_post_ps_tiekimas` — variklis ir žurnalas nekeisti; grįžimas per `grizti_cia()`.
 *   Tiekimo langas darbuotojui nebereikalingas (Raimiui lieka): `kons`/`tiekimas` mygtukai, skydelio nuoroda ir Rytinės eigos „Gavimai“
 *   veda į šią eilę. Žodynas: „partija“ → „užsakymas tiekėjui #n“ visur darbuotojui.
 * v3.5 (Raimis): Dropshipping kortelėje kiekvienoje eilutėje „Lipdukas“ su dialogu (dėžių skaičius tam klientui, adresas,
 *   svoris) — savas `lipdukas` veiksmas su sandelis=tiekėjas; jei pristatymas ne Venipak (pvz. flat_rate) — įspėjimas vietoj
 *   mygtuko; „+ į AV“: kai atviro užsakymo tiekėjui nėra — nuoroda į Tiekimą sukurti. Eilė pervadinta „Dropshipping“.
 * v3.4 (Raimis): prekės miniatiūra prie pavadinimo sąraše (grupei — iki 3) ir skydelyje; kliento pastaba vėl geltona dėžė (kad nepamirštų).
 * v3.3 (Raimis): „Visi“ — visa eilutė nuspalvinta pagal būseną (šviesus fonas + spalvota kairė juostelė), kad greičiau rūšiuoti akimis.
 * v3.2 (Raimis): taisyklė — pati išrūšiuoja TIK vieno sandėlio užsakymus; 2+ sandėliai (su AV ar be) → Neišrūšiuoti su
 *   sistemos pasiūlymu; eilutėje „Auto“ = surūšiuoti kaip siūlo, neatidarant (nerodomas, kai yra kliento pastaba ar trūkumas);
 *   pasiūlymas „veža į AV“, kai to tiekėjo užsakymas į AV jau atviras (kaupiama/užsakyta) — prekė atvažiuos ir taip.
 * v3.1 (Raimis, `dokumentai/ZODYNAS_DARBUOTOJUI_v1.md`): sandėliai trumpai (AV/VF/ZB/Prins/Belacor/Quattro/Ambrosia); eilės Gauti ·
 *   Neišrūšiuoti · Laukiam iš tiekėjų · Surinkti AV · Užsakyti iš tiekėjų · Paruošta siųsti · Klausimai · Neapmokėti · Visi;
 *   keliai „Iš AV · VF siunčia klientui · VF veža į AV“; mygtukai „Užsakyti iš VF (n užs.)“ (laiškas — tik peržiūra),
 *   „Užsakyti iš Prins į AV“, „Suvesti į ZB / Suvesta“, „Kurjerio sąrašas“, „Sekimo numeriai klientui“, „Istorija“; „Gauti“ =
 *   darbuotojas dar neatidarė (`_ps_matyta` per AJAX atidarius skydelį), eilutėje N + amžius „prieš 40 min / vakar / prieš 3 d.“;
 *   Visuose — būsenos žymė (Neapmokėtas · Neišrūšiuotas · Ruošiamas · Paruoštas · Išsiųstas · Įvykdytas · Atšauktas · Klausimas).
 * v3.0 (Raimis: „su 10 užsakymų — košmaras, noriu lengviau ir paprasčiau“): nuimti sluoksniai — juostos kelias paslėptas,
 *   nėra legendos, datos, filtrų (už „Filtrai ▾“), paaiškinimo apačioje, takelio sąraše (jis skydelyje); „Šiandien atėjo“ — ne
 *   siena, o pirma eilė „Šiandien (n)“ su stulpeliu „Kur dabar“; eilutė = 3 stulpeliai: Užsakymas (nr, laikas, klientas,
 *   pastaba) · Prekės pagal kelią („Avesa sandėlis · 3 prek. — Animonda…, +2“) · Kitas žingsnis. Viskas kita — skydelyje.
 * v2.4 (Raimis: „nekas neaišku, kad užsakymas įkrito, kur jis dingo — atsekamumas 0“): juosta „Šiandien atėjo (n)“ virš eilių
 *   ir rytinėje eigoje — kiekvienas šiandienos užsakymas su laiku, klientu, KUR DABAR (eilė) ir kitu žingsniu, atidaro skydelį;
 *   po kiekvieno veiksmo pranešimas sako, kur užsakymas nukeliavo („→ dabar: Laiškai tiekėjams · Laiškas Vetfarmas“);
 *   skydelio antraštėje „Dabar: …“.
 * v2.3 (Raimis: senoje Rytinėje eigoje „Mišrūs → Atidaryti“ vedė į WC): `view=rytas` dabar NAUJAS vedimas per eiles be
 *   užrakto (D1/D2): 1 Surūšiuoti · 2 Lipdukai ir laiškai tiekėjams · 3 Užsakyti iš tiekėjų · 4 Surinkti Avesoje · 5 Lipdukai
 *   Avesai · 6 Išsiųsta · 7 Gavimai · 8 Klausimai — gyvi skaičiai iš tų pačių faktų, žingsnis veda į eilę. Senas vaizdas tik su
 *   `senas=1` (LP Express lipdukams iki T-0 — J1). Iš darbuotojo lango į WC kelių nebėra.
 * v2.2: V1 — prekė be sandėlio → Klausimas „Prekė be sandėlio“, skydelyje leidžiama „Avesa sandėlis“ rankiniu būdu (be likučio,
 *   žurnale „rankinis“). V5 — `_ps_surinkta` (laikas|kas) rašoma per `admin_post_ps_desk_veiksmas` (lapai) + „Atšaukti surinkimą“
 *   skydelyje. K2 — atviri tik processing/on-hold/LP (riba 1000 + įspėjimas „rodomi ne visi“), Neapmokėti atskira užklausa
 *   (pending/failed ≤ 14 d.), žurnalas į skydelį per `wp_ajax_ps_dl_zurnalas` (data-json lengvesnis).
 * v2.1 (AUDITAS_UZSAKYMU_LANGAS_2026-09-03): K1 — po Gauta (K2 `_ps_source=av`) `_ps_kelias=i_av` nebeblokuoja: rodomas kelias
 *   = f(_ps_source, partija), i_av galioja tik kol source≠av; tiekėjas iš „parsivežta iš X“. K4 — dalies būsena
 *   `_ps_dalys_issiusta{sandelis:{laikas,kas,kanalas}}`: „Kurjeris paėmė (Avesa)“ / „[T] išsiuntė“ atskirai, `completed`
 *   + sekimo laiškas — kai visos dalys. K3+V7 — „Lipdukas“ per dialogą (dėžės, paštomatas/adresas, svoris) → savas
 *   `lipdukas` veiksmas (įrašo dėžes) → variklio `vp_reg`. V8 — „Surinkti visus (n)“ / „Lipdukai visiems (n)“. V13 — „Užsakyti iš
 *   Ambrosia ir Vetfarmas (2)“. V6 — atšaukimo dialogas įspėja apie registruotas siuntas / išsiųstus laiškus. V4/S4 — tekstai.
 *   V2 — grynai AV likutis per `wc_update_product_stock` (atominis) + užraktas veiksmui; V3 — be `wp_cache_flush`.
 * v2.0 (Raimis 2026-09-03 po darbuotojo testo: „nepalik to chaoso“): VIENA SISTEMA — darbuotojas iš šio lango neišeina:
 *   Laiškai tiekėjams = kortelės per tiekėją čia (1 Lipdukai → 2 Laiškas [T], prierašas, varnelės, peržiūra, partija į Avesą,
 *   ZB: Kopijuoti · Lipdukas · Perduota) ant esamo dropship variklio (`ps_dropship_send` / `zb_done` / `vp_reg`; grįžimas į
 *   šį langą per `wp_redirect` filtrą); Paruošta = kortelės „Avesa — laukia kurjerio“ (Lipdukas PDF, Manifestas, Išsiųsta /
 *   Kurjeris paėmė viską) ir „[T] — laiškas išsiųstas“ ([T] išsiuntė); Surinkti — lapas atsidaro naujame skirtuke, langas lieka.
 *   EILĖ = MYGTUKAS (eilėje „Surinkti“ visada Surinkti/Lipdukas, ne skubiausias globalus). NAUJI — TIK NEAIŠKŪS: auto
 *   rūšiuojama ir kai visos eilutės iš tiekėjų (keli tiekėjai tiesiai) — į Nauji tik Avesa+tiekėjas ir trūkumas. Naujas
 *   užsakymas pažymėtas „naujas“ kiekvienoje eilėje. Takelis trumpas (✓ padaryta · dabar · kitas), pilnas — skydelyje.
 *   Žodynas be AV/dropship/manifesto/perreg/„riba“; laikas „iki 09:00“. Kelias juostoje be pasikartojimų (URL valomas).
 * v1.2 (Raimis: „Uzsakymai“ pokalbio sprendimai — ne dvi sistemos, WC niekur): nuoroda „senas langas“ išimta; darbuotojo
 *   tekstuose nebėra „etapas“/„WC“; „Išsiųsta“ — savas `ps_dl_veiksmas v=issiusta` su sekimo laiško varnele (V3, I1: ON, kai
 *   visi numeriai yra; siunčia `Petshop_Siuntos::laisko_turinys()`, `edit_shop_orders` teisė), §18.3 sargas žmogaus kalba
 *   („dar neregistruota: Prins“); LP lipdukas — per Rytinę eigą (J1, iki savo endpoint'o).
 * v1.1: PATAISA — konteinerio `data-atidaryti` atributas gaudė VISUS paspaudimus (closest() rado #dl → preventDefault):
 *   eilutė neatsidarė, mygtukai nevedė. Konteineris → `data-atid`. `auto_rusiuoti()` — tuščias planas `[]` nebeblokuoja.
 * v0.1–0.3 (Run 1): perėmimas `page=ps-desk` (senas — `&senas=1` / `view=rytas`), 8 eilės, rikiavimas
 * „kas pirma degs“, filtrai, Visi su filtrais, klaviatūra, 60 s atnaujinimas, mobilus vaizdas.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Darbalaukis {

	const VERSIJA = '3.6.1';
	const SLUG    = 'ps-desk';

	/** Eilės: slug => [pavadinimas, paaiškinimas, spalva]. */
	const EILES = array(
		'siandien'   => array( 'Gauti',              'Užsakymai, kurių dar neatidarei — nesvarbu, kelių dienų. Atidarei — lieka tik savo darbo eilėje.', 'z' ),
		'nauji'      => array( 'Neišrūšiuoti',       'Reikia tavo sprendimo: dalis prekių AV, dalis pas tiekėją — siųsti atskirai ar vežti į AV? Aiškius sistema išrūšiuoja pati.', 'r' ),
		'laukiam'    => array( 'Laukiam iš tiekėjų', 'Prekės į AV: užsakyk iš tiekėjo čia pat („Užsakyti iš … į AV“), atvažiavus — „Gauta“. AV siunta nerenkama, kol visos jos prekės neatvyko.', 'g' ),
		'surinkti'   => array( 'Surinkti AV',        'Visos AV siuntos prekės vietoje — Surinkti → Lipdukas → Kurjeris paėmė.', 'z' ),
		'laiskai'    => array( 'Dropshipping',       'Tiekėjas siunčia tiesiai klientui: pirma lipdukai visiems jo užsakymams, tada užsakymas tiekėjui (laišką gali peržiūrėti).', 'm' ),
		'paruosta'   => array( 'Paruošta siųsti',    'AV siuntos laukia kurjerio — kai paėmė, spausk „Kurjeris paėmė“. Tiekėjų siuntos — kai tiekėjas praneša, kad išsiuntė.', 'z' ),
		'klausimai'  => array( 'Klausimai',          'Reikia sprendimo — kortelė sako, ką gali daryti.', 'r' ),
		'neapmoketi' => array( 'Neapmokėti',         'Laukia kliento pinigų. Gavus pavedimą — „Pažymėti apmokėtu“.', 'g' ),
		'visi'       => array( 'Visi',               'Visi užsakymai su būsena — įvykdyti, atšaukti, kelyje — filtrais.', '' ),
	);

	const KELIAI = array( 'av' => 'Iš AV', 'tiesiai' => 'siunčia klientui', 'i_av' => 'veža į AV' );

	protected static $riba_kesas = array();

	public static function init() {
		add_action( 'plugins_loaded', array( __CLASS__, 'perimti' ), 20 );
		add_action( 'admin_post_ps_dl_veiksmas', array( __CLASS__, 'vykdyti' ) );
		add_action( 'woocommerce_payment_complete', array( __CLASS__, 'auto_rusiuoti' ), 100, 1 );
		add_action( 'woocommerce_order_status_processing', array( __CLASS__, 'auto_rusiuoti' ), 100, 1 );
		add_filter( 'wp_redirect', array( __CLASS__, 'grizti_cia' ), 5, 2 );
		add_action( 'admin_post_ps_desk_veiksmas', array( __CLASS__, 'surinkta_zyme' ), 0 );
		add_action( 'wp_ajax_ps_dl_zurnalas', array( __CLASS__, 'ajax_zurnalas' ) );
		add_action( 'wp_ajax_ps_dl_matyta', array( __CLASS__, 'ajax_matyta' ) );
		add_action( 'admin_post_ps_dl_tiekimas', array( __CLASS__, 'tiekimas_vykdyti' ) );
	}

	/** V5: „Surinkti“ (lapai) — aiški užsakymo žymė `_ps_surinkta` (laikas|kas), ne tik žurnalo įrašas. */
	public static function surinkta_zyme() {
		if ( 'lapai' !== sanitize_key( $_GET['v'] ?? '' ) || ! current_user_can( 'edit_shop_orders' ) ) { return; }
		$ids = array(); if ( ! empty( $_GET['id'] ) ) { $ids[] = absint( $_GET['id'] ); } if ( ! empty( $_GET['ids'] ) ) { $ids = array_merge( $ids, array_map( 'absint', explode( ',', sanitize_text_field( wp_unslash( $_GET['ids'] ) ) ) ) ); }
		if ( ! wp_verify_nonce( $_GET['_wpnonce'] ?? '', 'ps_desk_lapai_' . absint( $_GET['id'] ?? 0 ) ) ) { return; }
		foreach ( array_unique( array_filter( $ids ) ) as $oid ) { $o = wc_get_order( $oid ); if ( $o && ! $o->get_meta( '_ps_surinkta' ) ) { $o->update_meta_data( '_ps_surinkta', current_time( 'mysql' ) . ' | ' . wp_get_current_user()->display_name ); $o->save(); } }
	}

	/** Gauti: darbuotojas atidarė skydelį — užsakymas matytas. */
	public static function ajax_matyta() {
		if ( ! current_user_can( 'edit_shop_orders' ) || ! check_ajax_referer( 'ps_dl_zurnalas', 'n', false ) ) { wp_send_json_error( 'teisės', 403 ); }
		$o = wc_get_order( absint( $_GET['id'] ?? 0 ) );
		if ( $o && ! $o->get_meta( '_ps_matyta' ) ) { $o->update_meta_data( '_ps_matyta', current_time( 'mysql' ) . ' | ' . wp_get_current_user()->display_name ); $o->save(); }
		wp_send_json_success( 1 );
	}

	/** K2: žurnalas į skydelį pagal poreikį (ne kiekvienoje eilutėje). */
	public static function ajax_zurnalas() {
		if ( ! current_user_can( 'edit_shop_orders' ) || ! check_ajax_referer( 'ps_dl_zurnalas', 'n', false ) ) { wp_send_json_error( 'teisės', 403 ); }
		$id = absint( $_GET['id'] ?? 0 );
		wp_send_json_success( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ? Petshop_Uzsakymu_Ivykiai::html( $id, 40 ) : '' );
	}

	/** Dropship variklis po laiško / ZB žymės grąžina į senus langus — jei veiksmas paleistas iš čia (`ps_dl_g`), grįžtam čia su žinute. */
	public static function grizti_cia( $location, $status ) {
		if ( empty( $_POST['ps_dl_g'] ) ) { return $location; }
		$g = wp_validate_redirect( wp_unslash( $_POST['ps_dl_g'] ), '' );
		if ( ! $g ) { return $location; }
		parse_str( (string) parse_url( $location, PHP_URL_QUERY ), $q );
		if ( isset( $q['psl_sent'] ) ) {
			$kam = rawurldecode( (string) ( $q['psl_kam'] ?? '' ) ); $n = (int) ( $q['psl_n'] ?? 0 ); $src = (string) ( $q['psl_src'] ?? '' );
			if ( '1' === (string) $q['psl_sent'] ) { return add_query_arg( array( 'pd_ok' => 'dl_laiskas', 'pd_nr' => rawurlencode( self::vardas( $src ) . '|' . $n . ' užs. → ' . $kam ) ), $g ); }
			return add_query_arg( array( 'pd_ok' => 'dl_klaida', 'pd_nr' => rawurlencode( self::vardas( $src ) . '|laiškas neišsiųstas: ' . rawurldecode( (string) ( $q['psl_err'] ?? '' ) ) ) ), $g );
		}
		if ( isset( $q['ps_zb'] ) ) { return add_query_arg( array( 'pd_ok' => 'dl_zb', 'pd_nr' => rawurlencode( 'Žalioji Banga|' . (int) $q['ps_zb'] ) ), $g ); }
		// 3 etapas: Tiekimo variklis (`ps_tiekimas`) paleistas iš „Laukiam iš tiekėjų“ kortelės — grįžtam čia darbuotojo žodžiais.
		if ( isset( $q['tk'] ) && isset( $q['page'] ) && 'ps-tiekimas' === $q['page'] ) {
			$tk = sanitize_key( $q['tk'] ); $pid = (int) ( $q['p'] ?? 0 ); $v = self::vardas( sanitize_key( $_POST['tiekejas'] ?? '' ) );
			$nr = ! empty( $_POST['ps_dl_pirmas'] ) ? '#' . absint( $_POST['ps_dl_pirmas'] ) : $v;
			$ln = class_exists( 'Petshop_AV_Tiekimas' ) ? Petshop_AV_Tiekimas::laisko_nust() : array( 'tiekejui' => false, 'man' => true );
			$pastai = (array) get_option( 'ps_tiekeju_pastai', array() ); $kam = trim( ( ! empty( $ln['tiekejui'] ) && ! empty( $pastai[ sanitize_key( $_POST['tiekejas'] ?? '' ) ] ) ? $pastai[ sanitize_key( $_POST['tiekejas'] ?? '' ) ] . ', ' : '' ) . ( ! empty( $ln['man'] ) ? 'terra@petshop.lt' : '' ), ', ' );
			$m = array(
				'uzsakyta'          => array( 'dl_uzsak_av', 'užsakyta iš ' . $v . ' į AV — užsakymas tiekėjui #' . $pid . ' (laiškas: ' . $kam . ')' ),
				'uzsakyta_vp'       => array( 'dl_uzsak_av', 'užsakyta iš ' . $v . ' į AV — užsakymas tiekėjui #' . $pid . ', siunta užregistruota, lipdukas laiške (' . $kam . ')' ),
				'uzsakyta_man'      => array( 'dl_uzsak_av', 'užsakyta iš ' . $v . ' į AV — užsakymas tiekėjui #' . $pid . '; laiškas išėjo tik man (terra@petshop.lt) — persiųsk tiekėjui' ),
				'uzsakyta_rankinis' => array( 'dl_uzsak_av', 'užsakymas tiekėjui #' . $pid . ' uždarytas — laiško nėra, sąrašą suvesk į ' . $v . ' sistemą („Kopijuoti“ kortelėje)' ),
				'uzsakyta_be_laisko'=> array( 'dl_info', 'užsakymas tiekėjui #' . $pid . ' uždarytas, bet laiškas niekam neišėjo (abi varnelės nuimtos) — parašyk tiekėjui pats' ),
				'laiskas_nepavyko'  => array( 'dl_klaida', 'laiškas ' . $v . ' NEIŠSIŲSTAS (pašto klaida) — užsakymas tiekėjui #' . $pid . ' vis tiek uždarytas; parašyk tiekėjui pats' ),
				'vp_klaida'         => array( 'dl_klaida', 'Venipak nepriėmė: ' . (string) get_transient( 'ps_tiek_vp_klaida_' . $pid ) . ' — užsakymas tiekėjui neišsiųstas, pataisyk pristatymą/svorį ir spausk dar kartą' ),
				'priimta'           => array( 'dl_gauta', 'gauta į AV iš ' . $v . ' (užsakymas tiekėjui #' . $pid . ') — likučiai papildyti' ),
				'issaugota'         => array( 'dl_info', 'prekės į AV sudėtos į užsakymą tiekėjui #' . $pid . ' — jis išeis kartu su Dropshipping užsakymais iš ' . $v . ' (varnelė „+ į AV“ kortelėje)' ),
				'tuscia'            => array( 'dl_info', 'nėra ko užsakyti iš ' . $v . ' į AV' ),
				'klaida'            => array( 'dl_klaida', 'užsakymo tiekėjui #' . $pid . ' būsena netinka šiam veiksmui — atnaujink langą' ),
			);
			$r = $m[ $tk ] ?? array( 'dl_info', $tk );
			if ( ! empty( $_POST['ps_dl_kartu'] ) && 'issaugota' === $tk ) { $g = add_query_arg( array( 'eile' => 'laiskai' ), remove_query_arg( array( 'atidaryti', 'view', 'q', 'b' ), $g ) ); }
			return add_query_arg( array( 'pd_ok' => $r[0], 'pd_nr' => rawurlencode( $nr . '|' . $r[1] ) ), $g );
		}
		return $location;
	}

	/** Perėmimas per plugins_loaded — `Petshop_Desk` įkeliamas po mūsų (abėcėlė). Variklis lieka. */
	public static function perimti() {
		if ( ! class_exists( 'Petshop_Desk' ) ) { return; }
		remove_action( 'admin_menu', array( 'Petshop_Desk', 'meniu' ) );
		remove_action( 'admin_head', array( 'Petshop_Desk', 'chrome' ) );
		remove_action( 'admin_head', array( 'Petshop_Desk', 'slepti_wc' ) );
		add_action( 'admin_menu', array( __CLASS__, 'meniu' ) );
		add_action( 'admin_head', array( __CLASS__, 'chrome' ) );
	}

	public static function meniu() {
		add_menu_page( 'Petshop užsakymai', 'Petshop užsakymai', 'edit_shop_orders', self::SLUG, array( __CLASS__, 'puslapis' ), 'dashicons-clipboard', 2 );
	}

	protected static function musu() { return is_admin() && isset( $_GET['page'] ) && self::SLUG === $_GET['page']; }
	protected static function senas() { return ! empty( $_GET['senas'] ); }
	protected static function rytas_langas() { return isset( $_GET['view'] ) && 'rytas' === $_GET['view'] && ! self::senas(); }

	public static function chrome() {
		if ( ! self::musu() ) { return; }
		if ( class_exists( 'Petshop_Desk' ) ) { Petshop_Desk::slepti_wc(); }
		if ( self::senas() ) { if ( class_exists( 'Petshop_Desk' ) ) { Petshop_Desk::chrome(); } return; }
		echo '<style>#wpfooter,#screen-meta,#screen-meta-links,.update-nag,.notice,#wpbody-content>.wrap>h1{display:none!important}
#wpcontent{padding-left:0!important}#wpbody-content{padding-bottom:0!important}html.wp-toolbar{padding-top:32px!important}body{background:#EEF1EF}.psj-2{display:none!important}</style>';
	}

	/* ============================ VARIKLIS ============================ */

	/** Protected `Petshop_Desk` metodas per ReflectionMethod. */
	protected static function d( $m ) {
		static $r = array();
		$args = func_get_args(); array_shift( $args );
		if ( ! isset( $r[ $m ] ) ) { $r[ $m ] = new ReflectionMethod( 'Petshop_Desk', $m ); $r[ $m ]->setAccessible( true ); }
		return $r[ $m ]->invokeArgs( null, $args );
	}

	/** Sandėlio riba: [k, tekstas, liko_s] (praėjo → +1 para rikiavimui). */
	protected static function riba( $s ) {
		if ( array_key_exists( $s, self::$riba_kesas ) ) { return self::$riba_kesas[ $s ]; }
		$out = null;
		if ( ! empty( Petshop_Desk::RIBOS[ $s ] ) ) {
			$dabar = (int) current_time( 'timestamp' );
			$liko  = strtotime( wp_date( 'Y-m-d', $dabar ) . ' ' . Petshop_Desk::RIBOS[ $s ] . ':00' ) - $dabar;
			$x     = self::d( 'riba', $s );
			$out   = array( $x[0], $x[1], $liko <= 0 ? $liko + DAY_IN_SECONDS : $liko );
		}
		self::$riba_kesas[ $s ] = $out;
		return $out;
	}

	/** Laikas darbuotojo kalba: „iki 09:00“ (liko / skuba) arba „po 09:00 — keliaus rytoj“. */
	protected static function riba_tekstas( $s ) {
		$r = self::riba( $s ); if ( ! $r ) { return array( '', '' ); }
		$l = Petshop_Desk::RIBOS[ $s ];
		if ( 'praejo' === $r[0] ) { return array( 'praejo', 'po ' . $l . ' — rytoj' ); }
		return array( $r[0], 'iki ' . $l . ( 'skuba' === $r[0] ? ' — liko ' . preg_replace( '/^.*liko /', '', $r[1] ) : '' ) );
	}

	/** „Kur dabar“ — eilės ir kitas žingsnis žmogaus kalba (atsekamumui). */
	protected static function kur_dabar( $f ) {
		if ( $f['uzdarytas'] ) { return in_array( $f['st'], Petshop_Desk::STATUSAI['atsaukti'], true ) ? 'atšauktas' : 'įvykdytas'; }
		if ( ! $f['eiles'] ) { return 'laukia (be veiksmo)'; }
		$e = array(); foreach ( $f['eiles'] as $k ) { $x = self::EILES[ $k ][0]; if ( 'laiskai' === $k && $f['tiesiai'] ) { $t = array(); foreach ( $f['tiesiai'] as $s ) { if ( empty( $f['dalys'][ $s ]['perduota'] ) ) { $t[] = self::vardas( $s ); } } if ( $t ) { $x .= ' (' . implode( ', ', $t ) . ')'; } } $e[] = $x; }
		return implode( ' + ', $e ) . ( $f['btn'] && ! empty( $f['btn'][0] ) ? ' · toliau: ' . $f['btn'][0] : '' );
	}

	/** Juosta „Šiandien atėjo“ — kiekvienas šiandienos užsakymas: kada, kas, kur dabar, kitas žingsnis. */
	protected static function siandien_juosta( $atviri ) {
		$n = array(); foreach ( $atviri as $r ) { if ( ! empty( $r['naujas'] ) ) { $n[] = $r; } }
		if ( ! $n ) { return; }
		usort( $n, function ( $a, $b ) { $da = $a['o']->get_date_created(); $db = $b['o']->get_date_created(); return ( $db ? $db->getTimestamp() : 0 ) <=> ( $da ? $da->getTimestamp() : 0 ); } );
		echo '<div class="dl-siand"><b>Šiandien atėjo ' . count( $n ) . '</b>';
		foreach ( $n as $r ) { $o = $r['o']; $eile = $r['eiles'] ? $r['eiles'][0] : 'visi';
			printf( '<a class="dl-siand-u" href="%s"><span class="nr">#%s</span> <span class="pilkas">%s · %s · %d prek.</span> <span class="kel %s"><i></i>%s</span></a>',
				esc_url( self::url( array( 'eile' => $eile, 'view' => null, 'q' => null, 'b' => null, 'atidaryti' => $r['id'] ) ) ), esc_html( $o->get_order_number() ), esc_html( wp_date( 'H:i', $o->get_date_created()->getTimestamp() ) ), esc_html( trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ) ), count( $r['eil'] ),
				$r['kl'] ? 'klaus' : ( 'nauji' === $eile ? 'ts' : 'sandelis' ), esc_html( self::kur_dabar( $r ) ) ); }
		echo '</div>';
	}

	/** Amžius darbuotojo kalba: „prieš 40 min“, „prieš 3 val.“, „vakar 17:41“, „prieš 3 d.“. */
	protected static function amzius( $d ) {
		if ( ! $d ) { return '—'; }
		$s = (int) current_time( 'timestamp' ) - $d->getTimestamp();
		if ( $s < 3600 ) { return 'prieš ' . max( 1, (int) floor( $s / 60 ) ) . ' min'; }
		$td = wp_date( 'Y-m-d' ); $dd = wp_date( 'Y-m-d', $d->getTimestamp() );
		if ( $dd === $td ) { return 'prieš ' . (int) floor( $s / 3600 ) . ' val.'; }
		if ( $dd === wp_date( 'Y-m-d', (int) current_time( 'timestamp' ) - DAY_IN_SECONDS ) ) { return 'vakar ' . wp_date( 'H:i', $d->getTimestamp() ); }
		$dienu = (int) floor( $s / DAY_IN_SECONDS );
		return $dienu < 14 ? 'prieš ' . $dienu . ' d.' : wp_date( 'm-d', $d->getTimestamp() );
	}

	/** Būsena „Visuose“ (spalvota žymė): [tekstas, klasė]. */
	protected static function busena( $f ) {
		if ( in_array( $f['st'], Petshop_Desk::STATUSAI['atsaukti'], true ) ) { return array( 'Atšauktas', 'b-red' ); }
		if ( in_array( $f['st'], Petshop_Desk::STATUSAI['ivykdyti'], true ) ) { return array( 'Įvykdytas', 'b-grey' ); }
		if ( in_array( $f['st'], Petshop_Desk::STATUSAI['kelyje'], true ) ) { return array( 'Išsiųstas', 'b-blue' ); }
		if ( $f['kl'] ) { return array( 'Klausimas', 'b-red' ); }
		if ( in_array( 'neapmoketi', $f['eiles'], true ) ) { return array( 'Neapmokėtas', 'b-amber' ); }
		if ( in_array( 'nauji', $f['eiles'], true ) ) { return array( 'Neišrūšiuotas', 'b-amber' ); }
		$dal = false; foreach ( $f['dalys'] as $p ) { if ( $p && ! empty( $p['issiusta'] ) ) { $dal = true; } }
		if ( $dal ) { return array( 'Išsiųsta dalis', 'b-blue' ); }
		if ( in_array( 'paruosta', $f['eiles'], true ) && ! in_array( 'surinkti', $f['eiles'], true ) && ! in_array( 'laiskai', $f['eiles'], true ) && ! in_array( 'laukiam', $f['eiles'], true ) ) { return array( 'Paruoštas', 'b-green' ); }
		return array( 'Ruošiamas', 'b-blue' );
	}

	/** Mygtukas KONKREČIAI EILEI (eilė = veiksmas): Surinkti → surinkti/lipdukas, Laukiam → užsakyti/laukiam, Paruošta → išsiųsta… */
	protected static function mygtukas_eilei( $f, $eile ) {
		$leid = array( 'nauji' => array( 'rusiuoti' ), 'surinkti' => array( 'lapai', 'lipdukas' ), 'laukiam' => array( 'kons', 'tiekimas' ), 'paruosta' => array( 'issiusta' ), 'neapmoketi' => array( 'apmoketa' ), 'klausimai' => array( 'spresti' ) );
		if ( ! isset( $leid[ $eile ] ) ) { return $f['btn']; }
		foreach ( $f['takelis'] as $t ) {
			if ( $t[4] && in_array( $t[4], $leid[ $eile ], true ) && in_array( $t[2], array( 'now', 'wait', 'bad' ), true ) ) {
				return self::mygtukas( $t, $f );
			}
		}
		return $f['btn'];
	}

	protected static function vardas( $s ) {
		$v = array( 'av' => 'AV', 'vf' => 'VF', 'zb' => 'ZB', 'quattro' => 'Quattro', 'prins' => 'Prins', 'ambrosia' => 'Ambrosia', 'belcor_tofu' => 'Belacor', 'lp' => 'LP', 'tiekejo' => 'tiekėjo' );
		return $v[ $s ] ?? mb_strtoupper( (string) $s );
	}

	/** Ar tiekėjo užsakymas į AV jau atviras (kaupiama/užsakyta) — tada siūlom „veža į AV“ (prekė atvažiuos ir taip). */
	protected static $partijos_cache = array();
	protected static function atvira_partija( $src ) {
		if ( ! isset( self::$partijos_cache[ $src ] ) ) {
			global $wpdb; $t = $wpdb->prefix . 'ps_tiekimas';
			self::$partijos_cache[ $src ] = (int) $wpdb->get_var( $wpdb->prepare( "SELECT id FROM {$t} WHERE tiekejas=%s AND busena IN ('kaupiama','uzsakyta') ORDER BY id DESC LIMIT 1", $src ) );
		}
		return self::$partijos_cache[ $src ];
	}

	/** Kelio pavadinimas pilnu vardu: „Avesa sandėlis“ / „Prins → klientui“ / „Prins → Avesa sandėlį“. */
	protected static function kelio_vardas( $k, $tiek ) {
		if ( 'av' === $k ) { return 'Iš AV'; }
		if ( '' === $k ) { return 'Nežinia iš kur'; }
		return ( $tiek ? self::vardas( $tiek ) : 'Tiekėjas' ) . ' ' . self::KELIAI[ $k ];
	}

	/** Paskutiniai žurnalo įvykiai visiems ID vienu SQL. */
	protected static function zurnalas( $ids ) {
		if ( ! class_exists( 'Petshop_Uzsakymu_Ivykiai' ) || ! $ids ) { return array(); }
		global $wpdb;
		$rows = $wpdb->get_results( 'SELECT uzsakymas, veiksmas, MAX(laikas) laikas FROM ' . Petshop_Uzsakymu_Ivykiai::t()
			. ' WHERE uzsakymas IN (' . implode( ',', array_map( 'intval', $ids ) ) . ") AND rezultatas='ok'
			   AND veiksmas IN ('lapai','nesurinkta','vp_reg','vp_bulk','issiusta','laiskas','perduota_zb','rusiuoti','kons','kelias') GROUP BY uzsakymas, veiksmas", ARRAY_A );
		$z = array();
		foreach ( (array) $rows as $r ) { $z[ (int) $r['uzsakymas'] ][ $r['veiksmas'] ] = $r['laikas']; }
		return $z;
	}

	/** `_ps_siuntos` + plugino raktas → sandelis => [numeriai]. */
	protected static function siuntos( $o, $sandeliai ) {
		$out = array();
		if ( ! class_exists( 'Petshop_Siuntos' ) ) { return $out; }
		foreach ( Petshop_Siuntos::sarasas( $o->get_id() ) as $s ) {
			$k = (string) ( $s['sandelis'] ?? '' );
			if ( '' === $k ) { $k = ( 1 === count( $sandeliai ) ) ? reset( $sandeliai ) : ( in_array( 'av', $sandeliai, true ) ? 'av' : '' ); }
			if ( '' === $k ) { continue; }
			$out[ $k ] = array_merge( $out[ $k ] ?? array(), (array) ( $s['numeriai'] ?? array() ) );
		}
		return $out;
	}

	/** Eilutės kelias ir tiekėjas: [kelias, src, tiek, bukle(objektas|null)]. */
	protected static function eilutes_kelias( $o, $iid, $it, $spr ) {
		$src = self::d( 'eilutes_saltinis', $it );
		$k   = (string) $it->get_meta( '_ps_kelias' );
		$b   = null; $tiek = '';
		if ( class_exists( 'Petshop_AV_Tiekimas' ) && $src && 'av' !== $src ) { $b = Petshop_AV_Tiekimas::eilutes_bukle( $o->get_id(), (int) $iid ); }
		if ( ! isset( self::KELIAI[ $k ] ) ) {
			if ( 'av' === $src ) { $k = 'av'; }
			elseif ( $src ) { $k = ( $it->get_meta( '_ps_konsolidacija' ) || 'av' === ( $spr[ $src ] ?? '' ) || $b || ( ! $o->get_meta( '_ps_rusiuota' ) && self::atvira_partija( $src ) ) ) ? 'i_av' : 'tiesiai'; }
			else { $k = ''; }
		}
		// K1 (auditas 09-03): rodomas kelias = f(_ps_source, partija). „→ Avesa sandėlį“ galioja tik kol prekė dar ne Avesoje;
		// po Gauta (K2 rašo `_ps_source=av`) eilutė yra Avesos — `_ps_kelias=i_av` tėra istorija (takeliui „✓ gauta“).
		$gauta = '';
		if ( 'av' === $src && ( 'i_av' === $k || $it->get_meta( '_ps_konsolidacija' ) ) ) { $k = 'av'; $gauta = preg_match( '/parsivežta iš (\w+)/iu', (string) $it->get_meta( '_ps_source_reason' ), $m ) ? strtolower( $m[1] ) : 'tiekejo'; }
		if ( 'av' === $src && 'tiesiai' === $k ) { $k = 'av'; }
		if ( $src && 'av' !== $src ) { $tiek = $src; }
		elseif ( $it->get_product_id() ) {
			$v = self::d( 'sprendimas', $it->get_product_id(), $it->get_quantity() );
			if ( ! empty( $v['tiekejas'] ) && 'av' !== $v['tiekejas'] && 'legacy' !== $v['tiekejas'] ) { $tiek = $v['tiekejas']; }
		}
		return array( $k, $src, $tiek, $b, $gauta );
	}

	/* ============================ FAKTAI ============================ */

	/** Vieno užsakymo faktai: eilutės su keliais ir žingsneliais, dalys, takelis, eilės, mygtukas, skuba. */
	protected static function faktai( $o, $z = array() ) {
		$id = $o->get_id(); $st = $o->get_status();
		$f  = array( 'o' => $o, 'id' => $id, 'st' => $st, 'paid' => $o->is_paid(), 'kl' => self::d( 'klausimas', $o ), 'vez' => self::d( 'vezejas', $o ),
			'eil' => array(), 'dalys' => array(), 'rus' => '', 'eiles' => array(), 'takelis' => array(), 'btn' => null, 'skuba' => PHP_INT_MAX, 'uzdarytas' => false, 'riba_s' => '', 'btn_s' => '', 'tiesiai' => array(), 'av_side' => false );
		$neapm  = in_array( $st, Petshop_Desk::STATUSAI['neapmoketi'], true );
		$atsauk = in_array( $st, Petshop_Desk::STATUSAI['atsaukti'], true );
		$baigta = in_array( $st, array_merge( Petshop_Desk::STATUSAI['ivykdyti'], Petshop_Desk::STATUSAI['kelyje'] ), true );
		$lp_par = in_array( $st, Petshop_Desk::STATUSAI['paruosta'], true );
		$f['uzdarytas'] = $atsauk || $baigta;
		$dp = $o->get_date_paid() ? $o->get_date_paid() : $o->get_date_created();
		$f['naujas'] = ! $f['uzdarytas'] && ! $o->get_meta( '_ps_matyta' ); // Gauti = darbuotojas dar neatidarė
		$perd = class_exists( 'Petshop_AV_Dropship' ) ? Petshop_AV_Dropship::perduotos( $o ) : array();
		$spr  = self::d( 'misrus_sprendimas', $o );
		$iss  = json_decode( (string) $o->get_meta( '_ps_dalys_issiusta' ), true ); if ( ! is_array( $iss ) ) { $iss = array(); }
		$f['dalys_issiusta'] = $iss;

		$sandeliai = array(); $av_truksta = false; $i_av_laukia = array(); $i_av_neuzs = array(); $i_av_src = array();
		foreach ( $o->get_items() as $iid => $it ) {
			list( $k, $src, $tiek, $b, $gauta ) = self::eilutes_kelias( $o, $iid, $it, $spr );
			$q = (int) $it->get_quantity(); $pid = (int) $it->get_product_id();
			$v = $pid ? self::d( 'sprendimas', $pid, $q ) : array();
			$av_qty = isset( $v['av_qty'] ) ? (int) $v['av_qty'] : null;
			$reduced = (int) $it->get_meta( '_ps_av_reduced_qty' ) > 0 || $it->get_meta( '_reduced_stock' ) || $it->get_meta( '_ps_av_reduced' );
			$av_ok = null;
			if ( 'av' === $k ) { $av_ok = $reduced ? true : ( null !== $av_qty && $av_qty >= $q ); if ( ! $av_ok ) { $av_truksta = true; } }
			$bukle = '';
			if ( 'i_av' === $k ) {
				if ( $src ) { $i_av_src[ $src ] = 1; }
				if ( ! $b ) { $bukle = 'neužsakyta'; $i_av_neuzs[ $src ] = 1; $i_av_laukia[ $src ] = 1; }
				elseif ( 'gauta' === $b->busena ) { $bukle = 'gauta · užsakymas tiekėjui #' . (int) $b->partija_id; }
				elseif ( 'uzsakyta' === $b->busena ) { $bukle = 'užsakyta · užsakymas tiekėjui #' . (int) $b->partija_id; $i_av_laukia[ $src ] = 1; }
				else { $bukle = 'užsakymas tiekėjui #' . (int) $b->partija_id . ' — dar neišsiųstas'; $i_av_neuzs[ $src ] = 1; $i_av_laukia[ $src ] = 1; }
			}
			if ( $src ) { $sandeliai[ $src ] = 1; }
			$p = $it->get_product();
			$img = $p && $p->get_image_id() ? wp_get_attachment_image_url( $p->get_image_id(), 'woocommerce_gallery_thumbnail' ) : '';
			$f['eil'][ (int) $iid ] = array( 'iid' => (int) $iid, 'q' => $q, 'n' => $it->get_name(), 'sku' => $p ? $p->get_sku() : '', 'pid' => $pid, 'src' => $src, 'k' => $k, 'tiek' => $tiek, 'img' => $img ?: '',
				'av_ok' => $av_ok, 'av_qty' => $av_qty, 'reduced' => $reduced, 'bukle' => $bukle, 'b' => $b ? array( 'busena' => $b->busena, 'partija' => (int) $b->partija_id ) : null,
				'gauta' => $gauta, 'kodel' => (string) $it->get_meta( '_ps_source_reason' ), 'galimi' => array( 'av' => 'av' === $k || '' === $k || ( null !== $av_qty && $av_qty >= $q ), 'tiesiai' => (bool) $tiek && 'lp' !== $f['vez'], 'i_av' => (bool) $tiek ), 'zing' => array(), 'lock' => '' );
		}
		$sandeliai = array_keys( $sandeliai );
		if ( ! $f['kl'] && $f['paid'] && ! $f['uzdarytas'] ) { foreach ( $f['eil'] as $e ) { if ( '' === $e['k'] ) { $f['kl'] = 'Prekė be sandėlio'; break; } } }
		$siuntos   = self::siuntos( $o, $sandeliai );
		$zz        = $z[ $id ] ?? array();

		// Surūšiuota: `_ps_rusiuota` arba mišraus planas (senas `misrus` veiksmas = rūšiavimas, spec §2).
		$rus = (string) $o->get_meta( '_ps_rusiuota' );
		if ( ! $rus && $spr ) { $rus = (string) $o->get_meta( '_ps_misrus_sprestas' ); if ( ! $rus ) { $rus = 'planas'; } }
		$f['rus'] = $rus;

		$av_side = false; $tiesiai = array();
		foreach ( $f['eil'] as $e ) { if ( 'av' === $e['k'] || 'i_av' === $e['k'] ) { $av_side = true; } if ( 'tiesiai' === $e['k'] && $e['src'] ) { $tiesiai[ $e['src'] ] = 1; } }
		$tiesiai = array_keys( $tiesiai ); $f['tiesiai'] = $tiesiai; $f['av_side'] = $av_side;
		$av_siunta = ! empty( $siuntos['av'] ) || $lp_par || ( $av_side && ! $tiesiai && self::d( 'turi_siunta', $o ) );
		$lapas     = (bool) $o->get_meta( '_ps_surinkta' ) || ( ! empty( $zz['lapai'] ) && ! isset( $zz['nesurinkta'] ) );
		$vietoje   = ! $av_truksta && ! $i_av_laukia;
		$f['dalys']['av'] = $av_side ? array( 'siunta' => $av_siunta, 'nr' => $siuntos['av'] ?? array(), 'lapas' => $lapas, 'vietoje' => $vietoje, 'issiusta' => $baigta || ! empty( $iss['av'] ) ) : null;
		foreach ( $tiesiai as $s ) { $f['dalys'][ $s ] = array( 'perduota' => ! empty( $perd[ $s ] ), 'kada' => $perd[ $s ] ?? '', 'nr' => $siuntos[ $s ] ?? array(), 'issiusta' => $baigta || ! empty( $iss[ $s ] ) ); }

		// Žingsneliai kiekvienai eilutei (maketo zingsniai()) + užraktas (A8).
		foreach ( $f['eil'] as $iid => $e ) {
			$zg = array(); $lock = '';
			if ( 'av' === $e['k'] ) {
				$zg = array( array( 'Surinkti', $lapas || $av_siunta ), array( 'Lipdukas', $av_siunta ), array( 'Kurjeris paėmė', $baigta ) );
				if ( $e['gauta'] ) { array_unshift( $zg, array( 'Užsakyta iš ' . self::vardas( $e['gauta'] ), true ), array( 'Gauta į AV', true ) ); }
				if ( $av_siunta ) { $lock = 'siunta jau užregistruota'; } elseif ( $lapas ) { $lock = 'jau surinkta'; }
			} elseif ( 'tiesiai' === $e['k'] ) {
				$t = self::vardas( $e['src'] ); $p = $f['dalys'][ $e['src'] ];
				$zg = array( array( 'Lipdukas ' . $t, (bool) $p['nr'] || $p['perduota'] ), array( 'zb' === $e['src'] ? 'Suvesti į ZB' : 'Užsakyti iš ' . $t, $p['perduota'] ), array( $t . ' išsiuntė', $baigta ) );
				if ( $p['perduota'] ) { $lock = 'jau užsakyta iš ' . $t; } elseif ( $p['nr'] ) { $lock = 'siunta jau užregistruota'; }
			} elseif ( 'i_av' === $e['k'] ) {
				$t = self::vardas( $e['src'] ); $uz = $e['b'] && 'kaupiama' !== $e['b']['busena']; $ga = $e['b'] && 'gauta' === $e['b']['busena'];
				$zg = array( array( 'Užsakyti iš ' . $t . ' į AV', $uz ), array( 'Gauta į AV', $ga ), array( 'Surinkti', $lapas || $av_siunta ), array( 'Lipdukas', $av_siunta ), array( 'Kurjeris paėmė', $baigta ) );
				if ( $uz ) { $lock = 'jau užsakyta iš ' . $t . ' (užsakymas tiekėjui #' . $e['b']['partija'] . ')'; }
			}
			$dabar = false; $zing = array();
			foreach ( $zg as $x ) { $st_ = $x[1] ? 'ok' : ( ! $dabar && $rus ? 'dabar' : '' ); if ( 'dabar' === $st_ ) { $dabar = true; } $zing[] = array( $x[0], $st_ ); }
			$f['eil'][ $iid ]['zing'] = $zing;
			$f['eil'][ $iid ]['lock'] = $f['uzdarytas'] ? 'užsakymas uždarytas' : $lock;
		}

		/* ---------- TAKELIS (maketo takelis()) + EILĖS + MYGTUKAS ---------- */
		$T = array(); $eiles = array();
		if ( $atsauk ) { $T[] = array( 'atsaukta', 'atšauktas', 'bad', '', null ); }
		elseif ( $neapm ) { $T[] = array( 'apmoketa', 'neapmokėtas', 'now', '', 'apmoketa' ); $eiles['neapmoketi'] = 1; }
		if ( $f['kl'] ) { $eiles['klausimai'] = 1; }
		if ( ! $atsauk && ! $neapm ) {
			$T[] = array( 'rus', 'auto' === $rus ? 'surūšiuota pati' : 'surūšiuota', $rus ? 'done' : 'now', '', $rus ? null : 'rusiuoti' );
			if ( ! $rus && ! $f['kl'] && ! $baigta ) { $eiles['nauji'] = 1; }
			if ( $av_side ) {
				$gauta_is = array(); foreach ( $f['eil'] as $e ) { if ( $e['gauta'] && 'av' === $e['k'] ) { $gauta_is[ $e['gauta'] ] = 1; } }
				foreach ( array_keys( $gauta_is ) as $s ) { if ( isset( $i_av_src[ $s ] ) ) { continue; } $T[] = array( 'uzs_' . $s, 'užsakyta iš ' . self::vardas( $s ), 'done', $s, null ); $T[] = array( 'gauta_' . $s, 'gauta į AV', 'done', $s, null ); }
				foreach ( array_keys( $i_av_src ) as $s ) {
					$nz = isset( $i_av_neuzs[ $s ] );
					$T[] = array( 'uzs_' . $s, ( $nz ? 'užsakyti iš ' : 'užsakyta iš ' ) . self::vardas( $s ) . ' į AV', $nz ? ( $rus ? 'now' : 'todo' ) : 'done', $s, $nz ? 'kons' : null );
					if ( isset( $i_av_laukia[ $s ] ) ) { $T[] = array( 'lauk_' . $s, 'laukiam iš ' . self::vardas( $s ), $nz ? 'todo' : 'wait', $s, $nz ? null : 'tiekimas' ); if ( $rus && ! $baigta ) { $eiles['laukiam'] = 1; } }
					else { $T[] = array( 'gauta_' . $s, 'gauta į AV', 'done', $s, null ); }
				}
				$T[] = array( 'surinkti', $lapas || $av_siunta ? 'surinkta' : 'surinkti', $lapas || $av_siunta ? 'done' : ( $vietoje && $rus ? 'now' : 'todo' ), 'av', $lapas || $av_siunta ? null : 'lapai' );
				$T[] = array( 'lipdukas', 'lp' === $f['vez'] ? 'lipdukas LP' : 'lipdukas', $av_siunta ? 'done' : ( $lapas && $rus ? 'now' : 'todo' ), 'lp' === $f['vez'] ? 'lp' : 'av', $av_siunta ? null : 'lipdukas' );
				if ( $rus && $vietoje && ! $av_siunta && ! $f['kl'] && ! $baigta ) { $eiles['surinkti'] = 1; }
				$av_iss = $f['dalys']['av']['issiusta'];
				$T[] = array( 'issiusta', 'kurjeris paėmė', $av_iss ? 'done' : ( $av_siunta ? 'now' : 'todo' ), 'av', $av_iss ? null : 'issiusta' );
				if ( $av_siunta && ! $av_iss ) { $eiles['paruosta'] = 1; }
			}
			foreach ( $tiesiai as $s ) {
				$p = $f['dalys'][ $s ];
				$T[] = array( 'vp_' . $s, 'lipdukas ' . self::vardas( $s ), $p['nr'] || $p['perduota'] ? 'done' : 'todo', $s, null );
				$T[] = array( 'laisk_' . $s, 'zb' === $s ? 'suvesta į ZB' : 'užsakyta iš ' . self::vardas( $s ), $p['perduota'] ? 'done' : ( $rus ? 'now' : 'todo' ), $s, $p['perduota'] ? null : 'laiskas' );
				if ( $rus && ! $p['perduota'] && ! $f['kl'] && ! $baigta ) { $eiles['laiskai'] = 1; }
				$T[] = array( 'iss_' . $s, self::vardas( $s ) . ' išsiuntė', $p['issiusta'] ? 'done' : ( $p['perduota'] ? 'wait' : 'todo' ), $s, $p['issiusta'] ? null : ( $p['perduota'] ? 'issiusta' : null ) );
				if ( $p['perduota'] && ! $p['issiusta'] ) { $eiles['paruosta'] = 1; }
			}
			if ( $baigta ) { $T[] = array( 'baigta', in_array( $st, Petshop_Desk::STATUSAI['kelyje'], true ) ? 'kelyje' : 'įvykdytas', 'done', '', null ); }
		}
		if ( $f['kl'] ) {
			foreach ( $T as $i => $t ) { if ( 'now' === $t[2] ) { $T[ $i ][2] = 'todo'; $T[ $i ][4] = null; } }
			$T[] = array( 'kl', $f['kl'], 'bad', '', 'spresti' );
		}
		$f['takelis'] = $T; $f['eiles'] = array_keys( $eiles );

		// Mygtukas = „dabar“ veiksmas su artimiausia riba; riba be sandėlio — artimiausia iš užsakymo sandėlių.
		$min = null; $min_s = '';
		foreach ( array_merge( $sandeliai, 'lp' === $f['vez'] ? array( 'lp' ) : array() ) as $s ) { $r = self::riba( $s ); if ( $r && ( null === $min || $r[2] < $min ) ) { $min = $r[2]; $min_s = $s; } }
		$f['riba_s'] = $min_s;
		$geriausias = null; $g_liko = PHP_INT_MAX; $g_s = '';
		foreach ( $T as $t ) {
			if ( ! $t[4] || ! in_array( $t[2], array( 'now', 'wait', 'bad' ), true ) ) { continue; }
			$rs = $t[3] ? $t[3] : $min_s; $r = $rs ? self::riba( $rs ) : null; $liko = $r ? $r[2] : 0;
			if ( 'tiekimas' === $t[4] ) { $liko = PHP_INT_MAX - 1; }
			if ( $liko < $g_liko ) { $g_liko = $liko; $geriausias = $t; $g_s = $rs; }
		}
		$f['skuba'] = $g_liko; $f['btn_s'] = $g_s;
		$f['btn'] = $geriausias ? self::mygtukas( $geriausias, $f ) : self::mygtukas( array( 'atidaryti', '', '', '', 'atidaryti' ), $f );
		return $f;
	}

	/** Mygtuko duomenys: [tekstas, url, dialogas|null, klasė, pasyvus]. Veiksmai — esami `ps_desk_veiksmas` arba skydelis. */
	protected static function mygtukas( $t, $f ) {
		$o = $f['o']; $id = $f['id']; $s = $t[3];
		$antraste = sprintf( 'Užsakymas #%s · %s', $o->get_order_number(), wp_strip_all_tags( $o->get_formatted_order_total() ) );
		switch ( $t[4] ) {
			case 'apmoketa':
				return array( 'Pažymėti apmokėtu', self::veiksmo_url( 'apmoketa', $id ), array( 'antraste' => $antraste, 'tekstas' => 'Pažymėti apmokėtu? Prekės rezervuojamos; užsakymas eina į darbą.', 'ok' => 'Pažymėti apmokėtu', 'opt' => array( 'vardas' => 'be_laisko', 'tekstas' => 'Nesiųsti laiško klientui', 'def' => 0 ) ), 'p', 0 );
			case 'rusiuoti': return array( 'Rūšiuoti', '#skydelis', null, 'p', 0 );
			case 'spresti':  return array( 'Spręsti', '#skydelis', null, 'bad', 0 );
			case 'kons':
				$vis = array(); foreach ( $f['takelis'] as $t2 ) { if ( 'kons' === $t2[4] && $t2[3] ) { $vis[ $t2[3] ] = 1; } } if ( ! $vis ) { $vis[ $s ] = 1; }
				$v = array_map( array( __CLASS__, 'vardas' ), array_keys( $vis ) );
				return array( 'Užsakyti iš ' . ( count( $v ) > 1 ? implode( ' ir ', $v ) : $v[0] ) . ' į AV', self::url( array( 'eile' => 'laukiam', 'view' => null, 'q' => null, 'b' => null ) ), null, 'p', 0 );
			case 'tiekimas': return array( 'Laukiam iš ' . self::vardas( $s ), self::url( array( 'eile' => 'laukiam', 'view' => null, 'q' => null, 'b' => null ) ), null, 'ts', 1 );
			case 'lapai':    return array( 'Surinkti', self::veiksmo_url( 'lapai', $id ), null, 'p', 0 );
			case 'lipdukas':
				if ( 'lp' === $f['vez'] ) { return array( 'Lipdukas LP — per Rytinę eigą', admin_url( 'admin.php?page=' . self::SLUG . '&view=rytas' ), null, 'ts', 1 ); }
				$sv = self::d( 'uzsakymo_svoris', $o ); $vp = (string) $o->get_meta( 'venipak_pickup_point' );
				return array( 'Lipdukas', self::dl_url( 'lipdukas', $id, array( 'sandelis' => 'av' ) ), array( 'antraste' => $antraste, 'tekstas' => 'Registruoti AV siuntą Venipak? ' . ( 'venipak_pastomatas' === $f['vez'] ? 'Paštomatas ' . $vp . ' (kiekviena dėžė — atskira siunta).' : 'Kurjeris: ' . wp_strip_all_tags( str_replace( '<br/>', ', ', $o->get_formatted_shipping_address() ) ) . '.' ) . ' Svoris ' . ( $sv > 0 ? number_format( $sv, 1, ',', '' ) . ' kg' : 'nežinomas' ) . '. Siunta registruojama iš karto ir kainuoja — atšaukti galima tik Venipak savitarnoje.', 'ok' => 'Registruoti siuntą', 'opt' => array( 'vardas' => 'n', 'tekstas' => 'Dėžių', 'def' => Petshop_Desk::pakuociu( $o ), 'tipas' => 'n' ) ), 'p', 0 );
			case 'laiskas':  return array( 'zb' === $s ? 'Suvesti į ZB' : 'Užsakyti iš ' . self::vardas( $s ), self::url( array( 'eile' => 'laiskai', 'view' => null, 'q' => null, 'b' => null ) ), null, 'p', 0 );
			case 'issiusta':
				$dalis = $s ? $s : 'av'; $tekstas = 'av' === $dalis ? 'Kurjeris paėmė' : self::vardas( $dalis ) . ' išsiuntė';
				$kitos = array(); $nrs = array(); foreach ( $f['dalys'] as $k => $p ) { if ( ! $p ) { continue; } if ( $k !== $dalis && empty( $p['issiusta'] ) ) { $kitos[] = self::vardas( $k ); } if ( ! empty( $p['nr'] ) ) { $nrs = array_merge( $nrs, $p['nr'] ); } }
				$paskutine = ! $kitos;
				return array( $tekstas, self::dl_url( 'issiusta', $id, array( 'dalis' => $dalis ) ), array( 'antraste' => $antraste, 'tekstas' => ( 'av' === $dalis ? 'Kurjeris paėmė AV siuntą' . ( ! empty( $f['dalys']['av']['nr'] ) ? ' ' . implode( ', ', $f['dalys']['av']['nr'] ) : '' ) : self::vardas( $dalis ) . ' išsiuntė savo dalį' ) . '?' . ( $paskutine ? ' Tai paskutinė dalis — užsakymas įvykdytas, klientui išeina sekimo numeriai: ' . ( $nrs ? implode( ', ', $nrs ) : 'nėra' ) . '.' : ' Dar laukiam: ' . implode( ', ', $kitos ) . ' — užsakymas lieka atviras, sekimo numeriai klientui išeis, kai išsiųstos visos dalys.' ), 'ok' => $tekstas, 'opt' => $paskutine && $nrs ? array( 'vardas' => 'sekimo', 'tekstas' => 'Siųsti klientui sekimo numerius', 'def' => 1 ) : null ), 'p', 0 );
		}
		return array( 'Atidaryti', '#skydelis', null, 's', 0 );
	}

	protected static function veiksmo_url( $v, $id, $g = '' ) {
		return wp_nonce_url( admin_url( 'admin-post.php?action=ps_desk_veiksmas&v=' . rawurlencode( $v ) . '&id=' . (int) $id . '&g=' . rawurlencode( $g ?: self::url() ) ), 'ps_desk_' . $v . '_' . (int) $id );
	}

	protected static function dl_url( $v, $id, $extra = array() ) {
		return wp_nonce_url( admin_url( 'admin-post.php?' . http_build_query( array_merge( array( 'action' => 'ps_dl_veiksmas', 'v' => $v, 'id' => (int) $id, 'g' => self::url( array( 'atidaryti' => (int) $id ) ) ), $extra ) ) ), 'ps_dl_' . $v . '_' . (int) $id );
	}

	/* ============================ SKYDELIO DUOMENYS ============================ */

	protected static function skydelis( $f ) {
		$o = $f['o']; $id = $f['id'];
		$g = self::url( array( 'atidaryti' => $id ) );
		$eil = array();
		foreach ( $f['eil'] as $e ) {
			$keliai = array();
			foreach ( array( 'av', 'tiesiai', 'i_av' ) as $k ) {
				$gal = ! empty( $e['galimi'][ $k ] ) && ! $e['lock'] && $f['paid'];
				$keliai[] = array( 'k' => $k, 't' => self::kelio_vardas( $k, $e['tiek'] ), 'on' => $k === $e['k'], 'gal' => $gal,
					'u' => $gal && $k !== $e['k'] ? self::dl_url( 'kelias', $id, array( 'iid' => $e['iid'], 'k' => $k ) ) : '',
					'kodel_ne' => empty( $e['galimi'][ $k ] ) ? ( 'av' === $k ? 'AV tik ' . (int) $e['av_qty'] . ', reikia ' . $e['q'] : ( 'tiesiai' === $k && 'lp' === $f['vez'] ? 'LP Express — tik iš AV' : 'tiekėjo nėra' ) ) : $e['lock'] );
			}
			$tiek_url = ( 'i_av' === $e['k'] && $e['b'] && 'gauta' !== $e['b']['busena'] ) ? self::url( array( 'eile' => 'laukiam', 'view' => null, 'q' => null, 'b' => null, 'atidaryti' => null ) ) : '';
			$eil[] = array( 'q' => $e['q'], 'n' => $e['n'], 'sku' => $e['sku'], 'img' => $e['img'], 'k' => $e['k'], 'keliai' => $keliai, 'kodel' => self::kodel( $e ), 'zing' => $e['zing'], 'lock' => $e['lock'], 'tiek_url' => $tiek_url, 'bukle' => $e['bukle'] );
		}
		$adr = $o->get_formatted_shipping_address(); if ( ! $adr ) { $adr = $o->get_formatted_billing_address(); }
		$nr = array(); foreach ( $f['dalys'] as $k => $p ) { if ( $p && ! empty( $p['nr'] ) ) { $nr[] = self::vardas( $k ) . ': ' . implode( ', ', $p['nr'] ); } }
		$pak = self::d( 'reikia_pakuociu', $o ) ? array( 'kiek' => Petshop_Desk::pakuociu( $o ), 'u' => self::veiksmo_url( 'pakuotes', $id, $g ) ) : null;
		$perreg = ( ! empty( $f['dalys']['av']['siunta'] ) && 'lp' !== $f['vez'] && ! $f['uzdarytas'] ) ? self::dl_url( 'lipdukas', $id, array( 'sandelis' => 'av', 'perreg' => 1 ) ) : '';
		$b = $f['btn'];
		$pastaba = ! $f['paid'] ? 'Neapmokėtas — laukiam kliento pinigų. Gavus pavedimą — „Pažymėti apmokėtu“.'
			: ( ! $f['rus'] ? 'Sistema pasiūlė, iš kur važiuos kiekviena prekė. Pataisyk, jei reikia, ir spausk „Surūšiuota“.'
			: ( 'auto' === $f['rus'] ? 'Surūšiuota pati — viskas iš vienos vietos. Keisk, jei reikia, iki lipduko.'
			: 'Surūšiuota. Kelią dar gali keisti, kol prekei nepadarytas pirmas žingsnis.' ) );
		$antraste = sprintf( 'Užsakymas #%s · %s', $o->get_order_number(), wp_strip_all_tags( $o->get_formatted_order_total() ) );
		$isp = array(); foreach ( $f['dalys'] as $k => $p ) { if ( ! $p ) { continue; } if ( ! empty( $p['nr'] ) ) { $isp[] = '⚠ siunta ' . implode( ', ', $p['nr'] ) . ' jau užregistruota Venipak — ištrink savitarnoje'; } if ( 'av' !== $k && ! empty( $p['perduota'] ) ) { $isp[] = '⚠ jau užsakyta iš ' . self::vardas( $k ) . ' ' . wp_date( 'm-d H:i', strtotime( $p['kada'] ) ) . ' — parašyk tiekėjui, kad nesiųstų'; } }
		foreach ( $f['eil'] as $e ) { if ( 'i_av' === $e['k'] && $e['b'] && 'kaupiama' !== $e['b']['busena'] ) { $isp[] = '⚠ „' . mb_substr( $e['n'], 0, 30 ) . '“ jau užsakyta iš ' . self::vardas( $e['src'] ) . ' į AV'; } }
		$atsaukti = ! $f['uzdarytas'] ? array( 'u' => self::veiksmo_url( 'atsaukti', $id, $g ), 'd' => array( 'antraste' => $antraste, 'tekstas' => ( $f['paid'] ? 'Atšaukti šį APMOKĖTĄ užsakymą? Prekės grįš į likutį. Pinigai NEGRĄŽINAMI automatiškai — grąžinimą ir kreditinę tvarkysi atskirai.' : 'Atšaukti šį užsakymą? Prekės grįš į likutį. Klientui laiškas nesiunčiamas.' ) . ( $isp ? ' ' . implode( ' ', $isp ) . '.' : '' ), 'ok' => 'Atšaukti užsakymą', 'opt' => array( 'vardas' => 'su_laisku', 'tekstas' => 'Pranešti klientui laišku', 'def' => 0 ) ) ) : null;
		$rus_gal = $f['paid'] && ! $f['rus'] && ! $f['uzdarytas'];
		if ( $b && ! empty( $b[2] ) && empty( $b[2]['opt'] ) ) { unset( $b[2]['opt'] ); }
		foreach ( $f['eil'] as $e ) { if ( ! $e['k'] ) { $rus_gal = false; } }
		return array(
			'id' => $id, 'nr' => $o->get_order_number(), 'st' => wc_get_order_statuses()[ 'wc-' . $f['st'] ] ?? $f['st'], 'uzdarytas' => $f['uzdarytas'], 'kur' => self::kur_dabar( $f ),
			'kl' => trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ), 'suma' => wp_strip_all_tags( $o->get_formatted_order_total() ), 'apmok' => ( $f['paid'] ? 'apmokėta · ' : 'neapmokėta · ' ) . $o->get_payment_method_title(),
			'tel' => $o->get_billing_phone(), 'mail' => $o->get_billing_email(), 'adresas' => wp_strip_all_tags( str_replace( '<br/>', ', ', $adr ) ),
			'vezejas' => self::d( 'vezejo_vardas', $o ), 'vieta' => (string) $o->get_meta( 'venipak_pickup_point' ), 'pastaba_kl' => $o->get_customer_note(),
			'eil' => $eil, 'pastaba' => $pastaba, 'nr_siuntos' => $nr, 'pak' => $pak, 'perreg' => $perreg,
			'klausimas' => $f['kl'],
			'rusiuoti' => $rus_gal ? self::dl_url( 'rusiuoti', $id ) : '', 'matyti' => ! empty( $f['naujas'] ) ? 1 : 0,
			'btn' => ( $b && '#skydelis' !== $b[1] ) ? array( 't' => $b[0], 'u' => $b[1], 'd' => $b[2], 'pasyvus' => $b[4] ) : null,
			'atsaukti' => $atsaukti, 'sekimo' => ( class_exists( 'Petshop_Siuntos' ) && Petshop_Siuntos::turi( $id ) ) ? admin_url( 'admin.php?page=ps-siuntos-laiskas&id=' . $id ) : '',
			'laukti' => ( $f['kl'] && ! $f['uzdarytas'] ) ? self::veiksmo_url( 'klaus', $id, $g ) . '&t=laukti' : '',
			'nesurinkta' => ( ! empty( $f['dalys']['av']['lapas'] ) && empty( $f['dalys']['av']['siunta'] ) && ! $f['uzdarytas'] ) ? self::dl_url( 'nesurinkta', $id ) : '',
			'zn' => wp_create_nonce( 'ps_dl_zurnalas' ),
		);
	}

	/** „Kodėl“ po keliais (maketo kodel()). */
	protected static function kodel( $e ) {
		$t = $e['tiek'] ? self::vardas( $e['tiek'] ) : '';
		if ( $e['gauta'] && 'av' === $e['k'] ) { $s = 'Gauta į AV iš ' . self::vardas( $e['gauta'] ) . ( preg_match( '/partija #(\d+)/', (string) $e['kodel'], $m ) ? ' (užsakymas tiekėjui #' . $m[1] . ')' : '' ) . ' — siunčiam iš AV.'; return $e['reduced'] ? $s . ' Rezervuota.' : $s; }
		if ( '' === $e['k'] ) { return 'AV nėra, tiekėjo nėra. Jei prekė yra AV — pažymėk „Iš AV“ (likutis nenurašomas); jei ne — parašyk klientui arba atšauk.'; }
		if ( null !== $e['av_qty'] && $e['av_qty'] >= $e['q'] ) { $s = 'AV yra ' . (int) $e['av_qty'] . ' — siunčiam iš AV.'; }
		elseif ( $t && 'i_av' === $e['k'] && ! $e['b'] && ( $pid = self::atvira_partija( $e['tiek'] ) ) ) { $s = 'AV ' . ( $e['av_qty'] ? 'tik ' . (int) $e['av_qty'] : 'nėra' ) . ', ' . $t . ' turi. Užsakymas tiekėjui #' . $pid . ' (' . $t . ' į AV) jau atviras — siūlom vežti į AV ir siųsti viena siunta. Jei skubu — „' . $t . ' siunčia klientui“.'; }
		elseif ( $t ) { $s = 'AV ' . ( $e['av_qty'] ? 'tik ' . (int) $e['av_qty'] : 'nėra' ) . ', ' . $t . ' turi — ' . $t . ' siunčia klientui. Jei nori vienos siuntos — „' . $t . ' veža į AV“.'; }
		else { $s = 'AV ' . ( $e['av_qty'] ? 'tik ' . (int) $e['av_qty'] : 'nėra' ) . ', reikia ' . $e['q'] . ', tiekėjo nėra. Užsakyk pats ir pažymėk „Iš AV“, kai turėsi; arba parašyk klientui / atšauk.'; }
		if ( $e['reduced'] && 'av' === $e['k'] ) { $s .= ' Rezervuota.'; }
		if ( $e['kodel'] && ( 0 === strpos( $e['kodel'], 'darbalaukis:' ) || 0 === strpos( $e['kodel'], 'parsivežta' ) ) ) { $s .= ' · ' . $e['kodel']; }
		return $s;
	}

	/* ============================ VEIKSMAI ============================ */

	public static function vykdyti() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		$v  = isset( $_GET['v'] ) ? sanitize_key( wp_unslash( $_GET['v'] ) ) : '';
		$id = isset( $_GET['id'] ) ? absint( $_GET['id'] ) : 0;
		check_admin_referer( 'ps_dl_' . $v . '_' . $id );
		$o = wc_get_order( $id );
		if ( ! $o && ! ( 'issiusta' === $v && ! empty( $_GET['ids'] ) ) ) { wp_die( 'Užsakymas nerastas' ); }
		$atgal = wp_validate_redirect( isset( $_GET['g'] ) ? wp_unslash( $_GET['g'] ) : '', admin_url( 'admin.php?page=' . self::SLUG ) );
		$u = wp_get_current_user();
		$rez = array( 'dl_klaida', 'nežinomas veiksmas' );
		$lock = 'ps_dl_lock_' . $id;
		if ( $id && get_transient( $lock ) ) { wp_safe_redirect( add_query_arg( array( 'pd_ok' => 'dl_info', 'pd_nr' => rawurlencode( $o->get_order_number() . '|veiksmas jau vykdomas — palauk sekundę' ) ), $atgal ) ); exit; }
		if ( $id ) { set_transient( $lock, 1, 20 ); }
		try {
			if ( 'kelias' === $v ) { $rez = self::keisti_kelia( $o, absint( $_GET['iid'] ?? 0 ), sanitize_key( $_GET['k'] ?? '' ), $u ); }
			elseif ( 'rusiuoti' === $v ) { $rez = self::rusiuoti( $o, $u ); }
			elseif ( 'nesurinkta' === $v ) {
				$o->delete_meta_data( '_ps_surinkta' ); $o->add_order_note( 'Darbalaukis: surinkimas atšauktas (' . $u->display_name . ') — užsakymas grįžo į „Surinkti“.', false, true ); $o->save();
				if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $id, 'sritis' => 'desk', 'veiksmas' => 'nesurinkta', 'rezultatas' => 'ok', 'kanalas' => 'web', 'pastaba' => 'surinkimas atšauktas' ) ); }
				$rez = array( 'dl_info', 'surinkimas atšauktas — grįžo į „Surinkti“' );
			}
			elseif ( 'issiusta' === $v ) {
				$dalis = isset( $_GET['dalis'] ) ? sanitize_key( $_GET['dalis'] ) : '';
				$ids = isset( $_GET['ids'] ) ? array_filter( array_map( 'absint', explode( ',', sanitize_text_field( wp_unslash( $_GET['ids'] ) ) ) ) ) : array();
				if ( $ids ) { $ok = array(); $ne = array(); foreach ( $ids as $oid ) { $oo = wc_get_order( $oid ); if ( ! $oo ) { continue; } $r = self::issiusta( $oo, $u, ! empty( $_GET['sekimo'] ), $dalis ); if ( in_array( $r[0], array( 'dl_issiusta', 'dl_dalis' ), true ) ) { $ok[] = '#' . $oo->get_order_number(); } else { $ne[] = '#' . $oo->get_order_number() . ' — ' . $r[1]; } }
					$rez = array( $ne ? 'dl_info' : 'dl_issiusta_visi', ( $ok ? 'paimta: ' . implode( ', ', $ok ) : 'nieko nepaimta' ) . ( $ne ? ' · liko: ' . implode( '; ', $ne ) : '' ) ); }
				else { $rez = self::issiusta( $o, $u, ! empty( $_GET['sekimo'] ), $dalis ); }
			}
			elseif ( 'lipdukas' === $v ) {
				$n = isset( $_GET['n'] ) ? max( 1, min( 20, absint( $_GET['n'] ) ) ) : 0;
				if ( $n && $n !== (int) $o->get_meta( Petshop_Desk::META_PAK ) ) { $o->update_meta_data( Petshop_Desk::META_PAK, $n ); $o->add_order_note( 'Darbalaukis: dėžių skaičius — ' . $n . '.', false, true ); $o->save(); }
				// Mišrus: kita dalis jau registruota (plugino raktas užimtas) — šiai daliai variklis reikalauja `perreg` (E3/H258).
				$sand = sanitize_key( $_GET['sandelis'] ?? 'av' ); $perreg = ! empty( $_GET['perreg'] );
				if ( ! $perreg && self::d( 'turi_siunta', $o ) ) { $fs = self::faktai( $o, array() ); if ( empty( $fs['dalys'][ $sand ]['nr'] ) ) { $perreg = true; } }
				$reg = $perreg ? '&perreg=1' . ( $n ? '&n=' . $n : '' ) : '';
				if ( $id ) { delete_transient( $lock ); }
				wp_safe_redirect( self::veiksmo_url( 'vp_reg', $id, $atgal ) . '&ids=' . $id . '&sandelis=' . rawurlencode( $sand ) . $reg );
				exit;
			}
		} catch ( Throwable $e ) { $rez = array( 'dl_klaida', 'klaida: ' . $e->getMessage() ); }
		if ( $id ) { delete_transient( $lock ); }
		wp_safe_redirect( add_query_arg( array( 'pd_ok' => $rez[0], 'pd_nr' => rawurlencode( ( $o ? $o->get_order_number() : '' ) . '|' . $rez[1] ) ), $atgal ) );
		exit;
	}

	/**
	 * 3 etapas: „Laukiam iš tiekėjų“ kortelė — užsakymas tiekėjui į AV ir priėmimas čia pat.
	 * Variklis (`Petshop_AV_Tiekimas::veiksmas()`, registras H1–H3) neliestas: sudedam neužsakytas „veža į AV“ eilutes
	 * į kaupiamą partiją (kaip variklio `kons`, tik šiam tiekėjui) ir paleidžiam `admin_post_ps_tiekimas` su savo pačių
	 * patvirtintu nonce — žurnalas (`petshop-uzsakymu-ivykiai`) ir grįžimas (`grizti_cia`) veikia kaip Tiekimo lange.
	 */
	public static function tiekimas_vykdyti() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		$src = sanitize_key( wp_unslash( $_POST['tiekejas'] ?? '' ) ); $pid = absint( $_POST['partija'] ?? 0 ); $ka = sanitize_key( wp_unslash( $_POST['ka'] ?? '' ) );
		check_admin_referer( 'ps_dl_tiek_' . $src . '_' . $pid );
		$atgal = wp_validate_redirect( wp_unslash( $_POST['ps_dl_g'] ?? '' ), admin_url( 'admin.php?page=' . self::SLUG . '&eile=laukiam' ) );
		$klaida = function ( $t ) use ( $atgal, $src ) { wp_safe_redirect( add_query_arg( array( 'pd_ok' => 'dl_klaida', 'pd_nr' => rawurlencode( self::vardas( $src ) . '|' . $t ) ), $atgal ) ); exit; };
		if ( ! $src || ! class_exists( 'Petshop_AV_Tiekimas' ) || ! in_array( $ka, array( 'uzsakyti', 'kartu', 'priimti' ), true ) ) { $klaida( 'nežinomas veiksmas' ); }
		$u = wp_get_current_user(); $pirmas = 0;
		if ( 'priimti' !== $ka ) {
			$pid = Petshop_AV_Tiekimas::atvira_partija( $src ); // kaupiama arba nauja
			$ids = isset( $_POST['ids'] ) ? array_filter( array_map( 'absint', explode( ',', sanitize_text_field( wp_unslash( $_POST['ids'] ) ) ) ) ) : array();
			$n = 0;
			foreach ( $ids as $oid ) {
				$o = wc_get_order( $oid ); if ( ! $o || ! $o->is_paid() ) { continue; }
				$spr = self::d( 'misrus_sprendimas', $o );
				foreach ( $o->get_items() as $iid => $it ) {
					list( $k, $s ) = self::eilutes_kelias( $o, $iid, $it, $spr );
					if ( 'i_av' !== $k || $s !== $src || Petshop_AV_Tiekimas::eilutes_bukle( $oid, (int) $iid ) ) { continue; }
					if ( Petshop_AV_Tiekimas::ideti_eilute( $o, (int) $iid, $src ) ) {
						$it->update_meta_data( '_ps_konsolidacija', 1 ); $it->save(); $n++; if ( ! $pirmas ) { $pirmas = $oid; }
						if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $oid, 'eilute' => (int) $iid, 'sritis' => 'desk', 'veiksmas' => 'kons', 'rezultatas' => 'ok', 'kanalas' => 'web', 'po' => array( 'partija' => $pid, 'tiekejas' => $src ), 'pastaba' => mb_substr( $it->get_name(), 0, 60 ) . ' → užsakymas tiekėjui #' . $pid ) ); }
					}
				}
			}
			if ( ! $pirmas ) { foreach ( Petshop_AV_Tiekimas::partijos_eilutes( $pid ) as $e ) { if ( $e->order_id ) { $pirmas = (int) $e->order_id; break; } } }
			if ( ! Petshop_AV_Tiekimas::partijos_eilutes( $pid ) ) { $klaida( 'nėra ko užsakyti į AV — prekių sąrašas tuščias' ); }
			$_POST['ka'] = 'kartu' === $ka ? 'issaugoti' : 'uzsakyti';
			if ( 'kartu' === $ka ) { $_POST['ps_dl_kartu'] = $pid; }
		} else {
			if ( ! $pid ) { $klaida( 'užsakymo tiekėjui nėra' ); }
			foreach ( Petshop_AV_Tiekimas::partijos_eilutes( $pid ) as $e ) { if ( $e->order_id ) { $pirmas = (int) $e->order_id; break; } }
		}
		$_POST['partija'] = $pid; $_POST['ps_dl_pirmas'] = $pirmas;
		$_POST['_wpnonce'] = wp_create_nonce( 'ps_tiekimas_' . $pid ); $_REQUEST['_wpnonce'] = $_POST['_wpnonce'];
		unset( $_POST['ids'] );
		do_action( 'ps_juosta_isvalyti' );
		do_action( 'admin_post_ps_tiekimas' ); // variklis + žurnalas; grįžimas per `grizti_cia()`
		exit;
	}

	/** Eilutės AV likučio judesys: +q / −q pagal prekės rūšį (grynai AV → `_stock`, AV+tiekėjas → `_own_stock_qty`). */
	protected static function likutis( $pid, $delta, $pastaba ) {
		$pid = (int) $pid;
		if ( class_exists( 'Petshop_AV_Stock' ) && null !== Petshop_AV_Stock::qty( $pid ) ) {
			return $delta > 0 ? Petshop_AV_Stock::increase( $pid, $delta, $pastaba ) : Petshop_AV_Stock::decrease( $pid, -$delta, $pastaba );
		}
		$p = wc_get_product( $pid );
		if ( ! $p ) { return new WP_Error( 'nera', 'prekės nėra' ); }
		$dabar = (int) get_post_meta( $pid, '_stock', true );
		if ( $dabar + $delta < 0 ) { return new WP_Error( 'nepakanka', 'AV tik ' . $dabar ); }
		if ( ! $p->managing_stock() ) { return $dabar + $delta; }
		$naujas = wc_update_product_stock( $p, abs( $delta ), $delta > 0 ? 'increase' : 'decrease' ); // atominis SQL (auditas V2)
		return null === $naujas ? new WP_Error( 'klaida', 'likučio įrašyti nepavyko' ) : (int) $naujas;
	}

	/** Grupių perskaičiavimas kaip `Petshop_AV_Order::fiksuoti()` / K2. */
	protected static function perskaiciuoti_grupes( $o ) {
		$grupes = array();
		foreach ( $o->get_items() as $it ) {
			$s = (string) $it->get_meta( '_ps_source' ); if ( ! $s ) { continue; }
			$c = (string) $it->get_meta( '_ps_carrier' ); if ( ! $c ) { $c = 'av' === $s ? 'any' : 'venipak'; }
			if ( ! isset( $grupes[ $s ] ) ) { $grupes[ $s ] = array( 'carrier' => $c, 'eilutes' => 0, 'vienetai' => 0 ); }
			$grupes[ $s ]['eilutes']++; $grupes[ $s ]['vienetai'] += max( 1, (int) $it->get_quantity() );
		}
		$tipas = class_exists( 'Petshop_AV_Source' ) ? Petshop_AV_Source::order_type( $grupes ) : ( count( $grupes ) > 1 ? 'MIXED' : ( isset( $grupes['av'] ) ? 'MAIN' : 'DS' ) );
		$o->update_meta_data( '_ps_order_type', $tipas ); $o->update_meta_data( '_ps_groups', wp_json_encode( $grupes ) ); $o->update_meta_data( '_ps_shipments', count( $grupes ) );
	}

	/** Mišraus planas iš eilučių kelių (kad `kons`, `kons_laukia()`, `neperduotos()` gerbtų planą — A7/A10). */
	protected static function planas_is_eiluciu( $o ) {
		$spr = array();
		foreach ( $o->get_items() as $it ) {
			$s = (string) $it->get_meta( '_ps_source' ); $k = (string) $it->get_meta( '_ps_kelias' );
			if ( ! $s || 'av' === $s ) { continue; }
			if ( 'i_av' === $k ) { $spr[ $s ] = 'av'; } elseif ( ! isset( $spr[ $s ] ) ) { $spr[ $s ] = 'tiesiai'; }
		}
		if ( $spr ) { $o->update_meta_data( '_ps_misrus_sprendimas', wp_json_encode( $spr ) ); } else { $o->delete_meta_data( '_ps_misrus_sprendimas' ); }
		return $spr;
	}

	/** Kelio keitimas su „likutis seka kelią“ (spec §5). Grąžina [pd_ok, tekstas]. */
	protected static function keisti_kelia( $o, $iid, $k, $u ) {
		if ( ! isset( self::KELIAI[ $k ] ) ) { return array( 'dl_klaida', 'blogas kelias' ); }
		$it = $o->get_item( $iid );
		if ( ! $it ) { return array( 'dl_klaida', 'eilutės nėra' ); }
		if ( ! $o->is_paid() ) { return array( 'dl_klaida', 'užsakymas neapmokėtas' ); }
		$f = self::faktai( $o, self::zurnalas( array( $o->get_id() ) ) );
		$e = $f['eil'][ (int) $iid ] ?? null;
		if ( ! $e ) { return array( 'dl_klaida', 'eilutės nėra' ); }
		if ( $e['lock'] ) { return array( 'dl_klaida', 'kelio keisti negalima — ' . $e['lock'] ); }
		if ( $k === $e['k'] ) { return array( 'dl_info', 'kelias nepakeistas — jau ' . self::kelio_vardas( $k, $e['tiek'] ) ); }
		if ( empty( $e['galimi'][ $k ] ) ) { return array( 'dl_klaida', 'negalima: ' . ( 'av' === $k ? 'AV tik ' . (int) $e['av_qty'] . ', reikia ' . $q : ( 'lp' === $f['vez'] && 'tiesiai' === $k ? 'LP Express — tik iš AV' : 'tiekėjo nėra' ) ) ); }
		$pid = $e['pid']; $q = $e['q']; $buvo = $e['k']; $tiek = $e['tiek'];
		$pries = array( 'kelias' => $buvo, 'src' => $e['src'], 'av_q' => $e['av_qty'], 'reduced' => (int) $it->get_meta( '_ps_av_reduced_qty' ) );
		$judesiai = array();

		// Likutis seka kelią.
		if ( 'av' === $buvo && 'av' !== $k ) {
			$r = (int) $it->get_meta( '_ps_av_reduced_qty' );
			if ( ! $r && $it->get_meta( '_ps_av_reduced' ) ) { $r = $q; } // K2 (`eilutes_i_av`) žymi eilutę `_ps_av_reduced` be kiekio
			if ( $r > 0 ) {
				$x = self::likutis( $pid, $r, 'kelias → ' . self::kelio_vardas( $k, $tiek ) . ', užsakymas #' . $o->get_order_number() );
				if ( is_wp_error( $x ) ) { return array( 'dl_klaida', 'likučio grąžinti nepavyko: ' . $x->get_error_message() ); }
				$judesiai[] = 'AV +' . $r . ' → ' . $x;
				$it->delete_meta_data( '_ps_av_reduced_qty' ); $it->delete_meta_data( '_ps_av_reduced' );
			}
		} elseif ( '' === $buvo && 'av' === $k ) {
			$judesiai[] = 'rankinis — likutis nenurašytas';
		} elseif ( 'av' !== $buvo && 'av' === $k ) {
			if ( null === $e['av_qty'] || $e['av_qty'] < $q ) { return array( 'dl_klaida', 'AV tik ' . (int) $e['av_qty'] . ', reikia ' . $q ); }
			$x = self::likutis( $pid, -$q, 'kelias → Avesa sandėlis, užsakymas #' . $o->get_order_number() );
			if ( is_wp_error( $x ) ) { return array( 'dl_klaida', $x->get_error_message() ); }
			$judesiai[] = 'AV −' . $q . ' → ' . $x;
			$it->update_meta_data( '_ps_av_reduced_qty', $q );
			if ( ! $o->get_meta( '_ps_av_reduced' ) ) { $o->update_meta_data( '_ps_av_reduced', current_time( 'mysql' ) ); }
			$o->delete_meta_data( '_ps_av_restored' );
		}
		// Partija: „→ Avesa sandėlį“ kaupiamoje partijoje išimama, kai kelias keičiasi (užsakyta — užrakinta aukščiau).
		if ( 'i_av' === $buvo && class_exists( 'Petshop_AV_Tiekimas' ) ) { Petshop_AV_Tiekimas::isimti_eilute( $o, (int) $iid ); $it->delete_meta_data( '_ps_konsolidacija' ); }
		// Eilutės meta.
		$it->update_meta_data( '_ps_kelias', $k );
		$it->update_meta_data( '_ps_source', 'av' === $k ? 'av' : $tiek );
		if ( '' === $buvo ) { $it->update_meta_data( '_ps_source_qty', $q ); }
		$it->update_meta_data( '_ps_carrier', 'av' === $k ? 'any' : 'venipak' );
		$it->update_meta_data( '_ps_source_at', current_time( 'mysql' ) );
		$it->update_meta_data( '_ps_source_reason', 'darbalaukis: ' . $u->display_name . ' pakeitė ' . self::kelio_vardas( $buvo, $tiek ) . ' → ' . self::kelio_vardas( $k, $tiek ) );
		$it->save();
		$o = wc_get_order( $o->get_id() );
		$o->delete_meta_data( '_ps_klaus_laukti' );
		self::planas_is_eiluciu( $o );
		self::perskaiciuoti_grupes( $o );
		$o->add_order_note( sprintf( 'Darbalaukis: „%s“ kelias %s → %s (%s).%s', $it->get_name(), self::kelio_vardas( $buvo, $tiek ), self::kelio_vardas( $k, $tiek ), $u->display_name, $judesiai ? ' Likutis: ' . implode( ', ', $judesiai ) . '.' : '' ), false, true );
		$o->save();
		wc_delete_shop_order_transients( $o ); clean_post_cache( $pid ); wc_delete_product_transients( $pid );
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) {
			Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'eilute' => (int) $iid, 'sritis' => 'desk', 'veiksmas' => 'kelias', 'rezultatas' => 'ok', 'kanalas' => 'web',
				'pries' => $pries, 'po' => array( 'kelias' => $k, 'src' => 'av' === $k ? 'av' : $tiek, 'reduced' => (int) $it->get_meta( '_ps_av_reduced_qty' ), 'zinute' => $judesiai ? 'likutis: ' . implode( ', ', $judesiai ) : 'likutis nejudėjo' ),
				'pastaba' => mb_substr( $it->get_name(), 0, 60 ) . ': ' . self::kelio_vardas( $buvo, $tiek ) . ' → ' . self::kelio_vardas( $k, $tiek ) ) );
		}
		do_action( 'ps_juosta_isvalyti' );
		return array( 'dl_kelias', $it->get_name() . ' → ' . self::kelio_vardas( $k, $tiek ) . ( $judesiai ? ' · likutis ' . implode( ', ', $judesiai ) : '' ) );
	}

	/** „Išsiųsta“ (I1, V3): completed be WC laiško; §18.3 sargas žmogaus kalba; sekimo laiškas klientui su visais numeriais, kai pažymėta. */
	protected static function issiusta( $o, $u, $sekimo, $dalis = '' ) {
		if ( in_array( $o->get_status(), array( 'completed', 'lp-delivered', 'lp-on-the-way' ), true ) ) { return array( 'dl_info', 'jau išsiųstas' ); }
		$f = self::faktai( $o, self::zurnalas( array( $o->get_id() ) ) );
		if ( $dalis && empty( $f['dalys'][ $dalis ] ) ) { return array( 'dl_klaida', 'tokios dalies nėra' ); }
		if ( $dalis && ! empty( $f['dalys'][ $dalis ]['issiusta'] ) ) { return array( 'dl_info', ( 'av' === $dalis ? 'AV dalis' : self::vardas( $dalis ) ) . ' jau pažymėta išsiųsta' ); }
		if ( $dalis && ( 'av' === $dalis ? ! $f['dalys']['av']['siunta'] : empty( $f['dalys'][ $dalis ]['perduota'] ) ) ) { return array( 'dl_klaida', ( 'av' === $dalis ? 'AV siunta dar be lipduko' : 'dar neužsakyta iš ' . self::vardas( $dalis ) ) ); }
		// K4: dalies būsena — pažymim šią dalį; kitos dalys — kaip yra.
		$iss = $f['dalys_issiusta']; $dabar = current_time( 'mysql' );
		$zym = array( $dalis ? $dalis : null ); if ( ! $dalis ) { $zym = array(); foreach ( $f['dalys'] as $k => $p ) { if ( $p ) { $zym[] = $k; } } }
		foreach ( $zym as $k ) { if ( $k ) { $iss[ $k ] = array( 'laikas' => $dabar, 'kas' => $u->display_name, 'kanalas' => 'web' ); } }
		$o->update_meta_data( '_ps_dalys_issiusta', wp_json_encode( $iss ) ); $o->save();
		$truksta = array(); foreach ( $f['dalys'] as $k => $p ) { if ( $p && empty( $iss[ $k ] ) ) { $truksta[] = self::vardas( $k ); } }
		if ( $truksta ) {
			$o->add_order_note( sprintf( 'Darbalaukis: %s išsiųsta (%s). Dar laukiam: %s.', 'av' === $dalis ? 'AV siunta' : self::vardas( $dalis ), $u->display_name, implode( ', ', $truksta ) ), false, true ); $o->save();
			if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'issiusta_dalis', 'rezultatas' => 'ok', 'kanalas' => 'web', 'po' => array( 'dalis' => $dalis, 'zinute' => 'laukiam: ' . implode( ', ', $truksta ) ) ) ); }
			do_action( 'ps_juosta_isvalyti' );
			return array( 'dl_dalis', ( 'av' === $dalis ? 'kurjeris paėmė AV siuntą' : self::vardas( $dalis ) . ' išsiuntė' ) . ' — dar laukiam: ' . implode( ', ', $truksta ) );
		}
		self::d( 'laiskai_off' );
		$o->add_order_note( sprintf( 'Pažymėta išsiųsta darbalaukyje. Vartotojas: %s. WC laiškas klientui: NESIŲSTAS.', $u->display_name ), false, true );
		$o->update_status( 'completed', '' );
		self::d( 'laiskai_on' );
		$o = wc_get_order( $o->get_id() );
		if ( 'completed' !== $o->get_status() ) {
			$reg = class_exists( 'Petshop_Siuntos' ) ? Petshop_Siuntos::registruota_grupiu( $o ) : 0;
			return array( 'dl_klaida', 'užbaigti neleido sargas — registruotos ' . (int) $reg . ' iš ' . (int) $o->get_meta( '_ps_shipments' ) . ' siuntų' );
		}
		$laiskas = '';
		if ( $sekimo && class_exists( 'Petshop_Siuntos' ) && Petshop_Siuntos::turi( $o->get_id() ) && $o->get_billing_email() ) {
			$mailer = WC()->mailer();
			$tema = sprintf( 'Jūsų užsakymo Nr. %s siuntų sekimo numeriai', $o->get_order_number() );
			$ok = $mailer->send( $o->get_billing_email(), $tema, $mailer->wrap_message( 'Siuntų sekimo numeriai', Petshop_Siuntos::laisko_turinys( $o ) ) );
			if ( $ok ) { $o->update_meta_data( '_ps_sekimo_siusta', current_time( 'mysql' ) ); $o->add_order_note( 'Sekimo numerių laiškas išsiųstas klientui: ' . $o->get_billing_email(), false, true ); $o->save(); $laiskas = 'klientui išsiųsti sekimo numeriai (' . $o->get_billing_email() . ')'; }
			else { $laiskas = 'sekimo numerių išsiųsti nepavyko'; }
		} elseif ( $sekimo ) { $laiskas = 'sekimo numeriai nesiųsti — jų nėra'; }
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) {
			Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'issiusta', 'rezultatas' => 'ok', 'kanalas' => 'web', 'po' => array( 'status' => 'completed', 'zinute' => $laiskas ?: 'be sekimo laiško' ) ) );
		}
		do_action( 'ps_juosta_isvalyti' );
		return array( 'dl_issiusta', $laiskas ?: 'be sekimo numerių' );
	}

	/** „Surūšiuota — į darbą“: keliai įrašomi, `_ps_rusiuota`; į partiją NEDEDA (A7). */
	protected static function rusiuoti( $o, $u, $auto = false ) {
		if ( ! $o->is_paid() ) { return array( 'dl_klaida', 'užsakymas neapmokėtas' ); }
		if ( $o->get_meta( '_ps_rusiuota' ) ) { return array( 'dl_info', 'jau surūšiuota' ); }
		$f = self::faktai( $o, array() );
		$keliai = array();
		foreach ( $o->get_items() as $iid => $it ) {
			$e = $f['eil'][ (int) $iid ] ?? null;
			if ( ! $e || ! $e['k'] ) { return array( 'dl_klaida', 'ne visoms prekėms parinktas kelias — „' . ( $e ? $e['n'] : $iid ) . '“' ); }
			if ( ! $it->get_meta( '_ps_kelias' ) ) { $it->update_meta_data( '_ps_kelias', $e['k'] ); $it->save(); }
			$keliai[] = mb_substr( $e['n'], 0, 40 ) . ' — ' . self::kelio_vardas( $e['k'], $e['tiek'] );
		}
		$o->update_meta_data( '_ps_rusiuota', $auto ? 'auto' : current_time( 'mysql' ) . ' | ' . $u->display_name );
		if ( ! $o->get_meta( '_ps_misrus_sprendimas' ) ) { self::planas_is_eiluciu( $o ); $o->update_meta_data( '_ps_misrus_sprestas', current_time( 'mysql' ) . ' | ' . ( $auto ? 'auto' : $u->display_name ) ); }
		$o->add_order_note( ( $auto ? 'Surūšiuota pati: ' : 'Surūšiuota (' . $u->display_name . '): ' ) . implode( '; ', $keliai ), false, true );
		$o->save();
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) {
			Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'rusiuoti', 'rezultatas' => 'ok', 'kanalas' => $auto ? 'auto' : 'web', 'kas' => $auto ? 0 : $u->ID, 'kas_vardas' => $auto ? 'sistema' : $u->display_name,
				'po' => array( 'zinute' => implode( '; ', $keliai ) ), 'pastaba' => $auto ? 'auto: visos prekės vienu keliu' : null ) );
		}
		do_action( 'ps_juosta_isvalyti' );
		return array( 'dl_rusiuota', implode( '; ', $keliai ) );
	}

	/** Auto rūšiavimas apmokėjus (spec 6a): visos eilutės su šaltiniu ir vienu keliu. Grąžina true, jei surūšiavo. */
	public static function auto_rusiuoti( $order_id ) {
		$o = is_numeric( $order_id ) ? wc_get_order( $order_id ) : $order_id;
		if ( ! $o || ! $o->is_paid() || $o->get_meta( '_ps_rusiuota' ) || ! class_exists( 'Petshop_Desk' ) || self::d( 'misrus_sprendimas', $o ) ) { return false; }
		if ( self::d( 'klausimas', $o ) ) { return false; }
		$src = array();
		foreach ( $o->get_items() as $it ) { $s = (string) $it->get_meta( '_ps_source' ); if ( ! $s ) { return false; } $src[ $s ] = 1; }
		// Raimis 09-03: pati išrūšiuoja TIK vieno sandėlio užsakymus. 2+ sandėliai → Neišrūšiuoti (siųsti atskirai ar sudėti į AV — žmogaus sprendimas, „Auto“ eilutėje).
		if ( count( $src ) > 1 ) { return false; }
		$r = self::rusiuoti( $o, wp_get_current_user(), true );
		return 'dl_rusiuota' === $r[0];
	}

	/* ============================ UŽKLAUSA ============================ */

	protected static function filtrai() {
		$g = function ( $k, $t = 'key' ) { if ( ! isset( $_GET[ $k ] ) ) { return ''; } return 'key' === $t ? sanitize_key( $_GET[ $k ] ) : sanitize_text_field( wp_unslash( $_GET[ $k ] ) ); };
		return array( 'q' => $g( 'q', 't' ), 'data' => $g( 'data' ), 'nuo' => $g( 'nuo', 't' ), 'iki' => $g( 'iki', 't' ), 'vykdymas' => $g( 'vykdymas' ), 'vezejas' => $g( 'vezejas' ),
			'busena' => '', 'mokejimas' => '', 'amzius' => '', 'nr' => '', 'klientas' => '', 'tel' => '', 'adresas' => '', 'zvilgsnis' => '', 'b' => $g( 'b' ), 'r' => $g( 'r' ) );
	}

	protected static function faktu_sarasas( $orders ) {
		$orders = array_filter( (array) $orders, function ( $o ) { return is_a( $o, 'WC_Order' ); } );
		$z = self::zurnalas( array_map( function ( $o ) { return $o->get_id(); }, $orders ) );
		$out = array(); foreach ( $orders as $o ) { $out[] = self::faktai( $o, $z ); } return $out;
	}

	const RIBA = 1000;
	protected static $ne_visi = false;

	/** Atviri = tik tie, kur reikia darbo (processing / on-hold / LP). Neapmokėti — atskirai (K2). Riba 1000 + įspėjimas. */
	protected static function atviri() {
		$orders = wc_get_orders( array( 'limit' => self::RIBA, 'type' => 'shop_order', 'orderby' => 'date', 'order' => 'DESC', 'return' => 'objects',
			'status' => array_merge( array( 'processing', 'on-hold', 'lp-parcel-await', 'lp-parcel-failed' ), Petshop_Desk::STATUSAI['paruosta'] ) ) );
		if ( count( (array) $orders ) >= self::RIBA ) { self::$ne_visi = true; }
		return self::faktu_sarasas( $orders );
	}

	protected static function neapmoketi() {
		$orders = wc_get_orders( array( 'limit' => 300, 'type' => 'shop_order', 'orderby' => 'date', 'order' => 'DESC', 'return' => 'objects', 'status' => array( 'pending', 'failed' ), 'date_created' => '>' . ( time() - 14 * DAY_IN_SECONDS ) ) );
		return self::faktu_sarasas( $orders );
	}

	protected static function visi( $f ) {
		if ( '' !== $f['q'] || $f['data'] ) { return self::faktu_sarasas( array_map( function ( $r ) { return $r['o']; }, (array) self::d( 'gauti', 'visi', $f ) ) ); }
		$args = array( 'limit' => 200, 'type' => 'shop_order', 'orderby' => 'date', 'order' => 'DESC', 'return' => 'objects' ); $b = $f['b'];
		if ( 'kelyje' === $b ) { $args['status'] = Petshop_Desk::STATUSAI['kelyje']; }
		elseif ( 'ivykdyti' === $b ) { $args['status'] = Petshop_Desk::STATUSAI['ivykdyti']; }
		elseif ( 'atsaukti' === $b ) { $args['status'] = Petshop_Desk::STATUSAI['atsaukti']; }
		elseif ( 'siandien' === $b ) { $args['status'] = array_merge( Petshop_Desk::STATUSAI['kelyje'], Petshop_Desk::STATUSAI['ivykdyti'] ); $args['date_modified'] = '>=' . strtotime( wp_date( 'Y-m-d' ) . ' 00:00:00' ); }
		else { $args['status'] = array_diff( array_map( function ( $s ) { return str_replace( 'wc-', '', $s ); }, array_keys( wc_get_order_statuses() ) ), array( 'checkout-draft' ) ); }
		return self::faktu_sarasas( wc_get_orders( $args ) );
	}

	protected static function filtruoti( $rows, $f ) {
		$riba = $f['data'] ? self::d( 'datos_riba', $f['data'], $f['nuo'], $f['iki'] ) : null;
		return array_values( array_filter( $rows, function ( $r ) use ( $f, $riba ) {
			if ( $f['vykdymas'] ) {
				$s = array_values( array_unique( array_filter( array_column( $r['eil'], 'src' ) ) ) ); $av = in_array( 'av', $s, true ); $n = count( $s ); $v = $f['vykdymas'];
				if ( 'sava' === $v && ( $n > 1 || ! $av ) ) { return false; }
				if ( 'dropship' === $v && ( $n > 1 || $av || ! $n ) ) { return false; }
				if ( 'misrus' === $v && $n < 2 ) { return false; }
				if ( isset( Petshop_Desk::SALTINIAI[ $v ] ) && ! in_array( $v, $s, true ) ) { return false; }
			}
			if ( $f['vezejas'] && $r['vez'] !== $f['vezejas'] ) { return false; }
			if ( $riba ) { $d = $r['o']->get_date_created(); if ( ! $d ) { return false; } $t = $d->getTimestamp(); $tz = wp_timezone();
				if ( $t < ( new DateTime( $riba[0], $tz ) )->getTimestamp() || $t > ( new DateTime( $riba[1], $tz ) )->getTimestamp() ) { return false; } }
			return true;
		} ) );
	}

	protected static function rikiuoti( $rows, $r ) {
		$laikas = function ( $x ) { $d = $x['o']->get_date_paid(); if ( ! $d ) { $d = $x['o']->get_date_created(); } return $d ? $d->getTimestamp() : 0; };
		usort( $rows, function ( $a, $b ) use ( $r, $laikas ) {
			switch ( $r ) {
				case 'laikas':   return $laikas( $b ) <=> $laikas( $a );
				case 'suma':     return (float) $b['o']->get_total() <=> (float) $a['o']->get_total();
				case 'klientas': return strcasecmp( $a['o']->get_billing_last_name() . $a['o']->get_billing_first_name(), $b['o']->get_billing_last_name() . $b['o']->get_billing_first_name() );
				case 'tiekejas': $ta = implode( ',', array_diff( array_unique( array_column( $a['eil'], 'src' ) ), array( 'av' ) ) ); $tb = implode( ',', array_diff( array_unique( array_column( $b['eil'], 'src' ) ), array( 'av' ) ) ); return strcmp( $ta, $tb ) ?: ( $laikas( $a ) <=> $laikas( $b ) );
			}
			return ( $a['skuba'] <=> $b['skuba'] ) ?: ( $laikas( $a ) <=> $laikas( $b ) );
		} );
		return $rows;
	}

	/* ============================ VAIZDAS ============================ */

	protected static function url( $args = array() ) {
		$b = array( 'page' => self::SLUG );
		foreach ( array( 'eile', 'q', 'data', 'nuo', 'iki', 'vykdymas', 'vezejas', 'b', 'r' ) as $k ) { if ( isset( $_GET[ $k ] ) && '' !== $_GET[ $k ] ) { $b[ $k ] = sanitize_text_field( wp_unslash( $_GET[ $k ] ) ); } }
		foreach ( $args as $k => $v ) { if ( null === $v || '' === $v ) { unset( $b[ $k ] ); } else { $b[ $k ] = $v; } }
		return admin_url( 'admin.php?' . http_build_query( $b ) );
	}

	public static function puslapis() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		if ( self::senas() ) { Petshop_Desk::puslapis(); return; }
		$eile = isset( $_GET['eile'] ) ? sanitize_key( $_GET['eile'] ) : 'nauji';
		if ( ! isset( self::EILES[ $eile ] ) ) { $eile = 'misrus' === $eile ? 'nauji' : ( 'laukia' === $eile ? 'laukiam' : ( in_array( $eile, array( 'issiusti', 'atsaukti' ), true ) ? 'visi' : 'nauji' ) ); }
		$f = self::filtrai();
		if ( '' !== $f['q'] ) { $eile = 'visi'; }
		$atviri = self::atviri(); $neapm = self::neapmoketi();
		$c = array_fill_keys( array_keys( self::EILES ), 0 );
		foreach ( array_merge( $atviri, $neapm ) as $r ) { foreach ( $r['eiles'] as $e ) { $c[ $e ]++; } if ( ! empty( $r['naujas'] ) ) { $c['siandien']++; } }
		$atviri = array_merge( $atviri, $neapm );
		global $wpdb; $c['visi'] = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}wc_orders WHERE type='shop_order' AND status<>'wc-checkout-draft'" );
		if ( self::rytas_langas() ) { self::stilius(); echo '<div class="dl" id="dl" data-eile="rytas" data-atid="0">'; self::pranesimas(); self::rytas( $atviri, $c ); self::skydelio_html(); self::dialogas(); self::skriptas(); echo '</div>'; return; }
		$rows = 'visi' === $eile ? self::visi( $f ) : array_values( array_filter( $atviri, function ( $r ) use ( $eile ) { return 'siandien' === $eile ? ! empty( $r['naujas'] ) : in_array( $eile, $r['eiles'], true ); } ) );
		$rows = self::rikiuoti( self::filtruoti( $rows, $f ), in_array( $eile, array( 'visi', 'siandien' ), true ) && ! $f['r'] ? 'laikas' : $f['r'] );
		$atid = isset( $_GET['atidaryti'] ) ? absint( $_GET['atidaryti'] ) : 0;
		if ( $atid && ! array_filter( $rows, function ( $r ) use ( $atid ) { return $r['id'] === $atid; } ) ) {
			$oa = wc_get_order( $atid ); if ( $oa ) { $x = self::faktai( $oa, self::zurnalas( array( $atid ) ) ); $x['svetimas'] = 1; $rows[] = $x; }
		}

		self::stilius();
		echo '<div class="dl" id="dl" data-eile="' . esc_attr( $eile ) . '" data-atid="' . (int) $atid . '">';
		self::pranesimas();
		if ( self::$ne_visi ) { echo '<div class="pd-msg pd-msg-klaida">Atvirų užsakymų daugiau nei ' . self::RIBA . ' — rodomi ne visi. Naudok paiešką arba filtrus.</div>'; }
		echo '<main class="dl-main">';
		if ( '' !== $f['q'] ) { echo '<h1 class="dl-h1">Paieška: „' . esc_html( $f['q'] ) . '“ <small><a href="' . esc_url( self::url( array( 'q' => null ) ) ) . '">✕ išvalyti</a></small></h1>'; }
		self::eiles( $eile, $c );
		self::filtru_juosta( $eile, $f );
		if ( 'klausimai' === $eile && $rows ) { self::klausimu_korteles( $rows ); }
		elseif ( 'laiskai' === $eile && $rows ) { self::laisku_korteles( $rows ); }
		elseif ( 'paruosta' === $eile && $rows ) { self::paruostos_korteles( $rows ); }
		elseif ( 'laukiam' === $eile && '' === $f['q'] ) { $ds = array(); foreach ( $atviri as $r ) { if ( in_array( 'laiskai', $r['eiles'], true ) ) { foreach ( $r['tiesiai'] as $s ) { if ( empty( $r['dalys'][ $s ]['perduota'] ) ) { $ds[ $s ] = ( $ds[ $s ] ?? 0 ) + 1; } } } } self::laukiam_korteles( $rows, $ds ); }
		else { self::lentele( $rows, $eile ); }
		echo '</main>';
		self::skydelio_html();
		self::dialogas();
		self::skriptas();
		echo '</div>';
	}

	protected static function pranesimas() {
		if ( empty( $_GET['pd_ok'] ) ) { return; }
		$k = sanitize_key( wp_unslash( $_GET['pd_ok'] ) );
		$nr = isset( $_GET['pd_nr'] ) ? sanitize_text_field( wp_unslash( $_GET['pd_nr'] ) ) : ''; $d = explode( '|', $nr, 2 );
		// Atsekamumas: po veiksmo — kur užsakymas dabar.
		$kur = ''; $oid = isset( $_GET['atidaryti'] ) ? absint( $_GET['atidaryti'] ) : ( preg_match( '/^#?(\d{4,})/', $d[0] ?? '', $mm ) ? (int) $mm[1] : 0 );
		if ( $oid && ( $oo = wc_get_order( $oid ) ) ) { $fx = self::faktai( $oo, self::zurnalas( array( $oid ) ) ); $kur = ' → dabar: ' . self::kur_dabar( $fx ); }
		$GLOBALS['ps_dl_kur'] = $kur;
		$var = array( 'vp_ok' => array( 'ok', 'Lipdukas: siunta užregistruota (%s).' ), 'vp_klaida' => array( 'klaida', 'Venipak nepriėmė: %s' ), 'vp_nieko' => array( 'info', '%s.' ), 'kons_ok' => array( 'ok', '#%s: %s prekė(-s) į užsakymą tiekėjui — užsakyk ir priimk „Laukiam iš tiekėjų“ eilėje.' ), 'kons_nieko' => array( 'info', '#%s: nėra ko užsakyti į AV.' ), 'apmoketa' => array( 'ok', '#%s apmokėtas. Prekės rezervuotos, klientui išsiųstas patvirtinimas.' ), 'apmoketa_tyliai' => array( 'ok', '#%s apmokėtas. Laiškas klientui nesiųstas.' ), 'atsaukta' => array( 'ok', '#%s atšauktas. Prekės grąžintos į likutį. Klientui nepranešta.' ), 'atsaukta_laiskas' => array( 'ok', '#%s atšauktas. Klientui išsiųstas pranešimas.' ), 'pakuotes' => array( 'ok', 'Dėžių: %s.' ), 'kl_laukti' => array( 'info', '#%s — laukiam; priminimo nebus.' ) );
		if ( isset( $var[ $k ] ) ) { $t0 = str_replace( array( ' · AV', ' · PRINS', ' · VF', ' · ZB', ' · QUATTRO', ' · AMBROSIA', ' · BELCOR_TOFU' ), array( ' — Avesa', ' — Prins', ' — Vetfarmas', ' — Žalioji Banga', ' — Quattro', ' — Ambrosia', ' — Belacor' ), $nr ); $d0 = explode( '|', $t0, 2 ); printf( '<div class="pd-msg pd-msg-%s">%s%s<button class="pd-msg-x" onclick="this.parentNode.remove()">✕</button></div>', esc_attr( $var[ $k ][0] ), esc_html( sprintf( $var[ $k ][1], $d0[0], $d0[1] ?? '' ) ), esc_html( $kur ) ); return; }
		if ( 0 !== strpos( $k, 'dl_' ) ) { ob_start(); self::d( 'pranesimas' ); $h = ob_get_clean(); echo $kur ? str_replace( '<button class="pd-msg-x"', esc_html( $kur ) . '<button class="pd-msg-x"', $h ) : $h; return; }
		$t = array( 'dl_kelias' => array( 'ok', '#%s — pakeista: %s' ), 'dl_issiusta' => array( 'ok', '#%s išsiųstas — įvykdytas; %s.' ), 'dl_dalis' => array( 'ok', '#%s: %s.' ), 'dl_issiusta_visi' => array( 'ok', 'Kurjeris paėmė — %2$s.' ), 'dl_laiskas' => array( 'ok', 'Užsakyta iš %s — %s → Paruošta siųsti.' ), 'dl_zb' => array( 'ok', '%s — suvesta %s užs. → Paruošta siųsti.' ), 'dl_rusiuota' => array( 'ok', '#%s surūšiuotas. %s' ), 'dl_uzsak_av' => array( 'ok', '%s: %s.' ), 'dl_gauta' => array( 'ok', '%s: %s.' ), 'dl_info' => array( 'info', '#%s: %s' ), 'dl_klaida' => array( 'klaida', '#%s: %s' ) );
		if ( ! isset( $t[ $k ] ) ) { return; }
		printf( '<div class="pd-msg pd-msg-%s">%s%s<button class="pd-msg-x" onclick="this.parentNode.remove()">✕</button></div>', esc_attr( $t[ $k ][0] ), esc_html( sprintf( $t[ $k ][1], $d[0], $d[1] ?? '' ) ), esc_html( $kur ) );
	}

	protected static function eiles( $eile, $c ) {
		echo '<div class="dl-eiles">';
		foreach ( self::EILES as $k => $e ) {
			$n = (int) ( $c[ $k ] ?? 0 );
			printf( '<a class="dl-e%s" href="%s"%s>%s <span class="sk%s">%s</span></a>', $k === $eile ? ' on' : '', esc_url( self::url( array( 'eile' => $k, 'q' => null, 'b' => null ) ) ), $e[1] ? ' title="' . esc_attr( $e[1] ) . '"' : '', esc_html( $e[0] ), $n && $e[2] ? ' ' . $e[2] : '', 'visi' === $k ? number_format( $n, 0, ',', ' ' ) : $n );
		}
		echo '</div>';
	}

	protected static function select( $vardas, $opcijos, $reiksme ) {
		$h = '<select name="' . esc_attr( $vardas ) . '" onchange="this.form.submit()">';
		foreach ( $opcijos as $k => $t ) { $h .= '<option value="' . esc_attr( $k ) . '"' . selected( $reiksme, $k, false ) . '>' . esc_html( $t ) . '</option>'; }
		return $h . '</select>';
	}

	protected static function filtru_juosta( $eile, $f ) {
		$akt = $f['vykdymas'] || $f['vezejas'] || $f['data'] || $f['r'];
		echo '<div class="dl-f-row"><a href="#" class="dl-f-tog' . ( $akt ? ' on' : '' ) . '">Filtrai ▾' . ( $akt ? ' (įjungti)' : '' ) . '</a><div class="dl-f-wrap"' . ( $akt ? '' : ' style="display:none"' ) . '>';
		if ( 'visi' === $eile ) {
			echo '<div class="dl-chips">';
			foreach ( array( '' => 'Visi', 'kelyje' => 'Kelyje', 'ivykdyti' => 'Įvykdyti', 'atsaukti' => 'Atšaukti', 'siandien' => 'Išsiųsta šiandien' ) as $k => $t ) { printf( '<a class="dl-chip%s" href="%s">%s</a>', $f['b'] === $k ? ' on' : '', esc_url( self::url( array( 'b' => $k ?: null ) ) ), esc_html( $t ) ); }
			echo '</div>';
		}
		echo '<form method="get" class="dl-f" action="' . esc_url( admin_url( 'admin.php' ) ) . '"><input type="hidden" name="page" value="' . esc_attr( self::SLUG ) . '"><input type="hidden" name="eile" value="' . esc_attr( $eile ) . '">';
		if ( '' !== $f['q'] ) { echo '<input type="hidden" name="q" value="' . esc_attr( $f['q'] ) . '">'; } if ( $f['b'] ) { echo '<input type="hidden" name="b" value="' . esc_attr( $f['b'] ) . '">'; }
		$vyk = array( '' => 'Iš kur: visi', 'sava' => 'Tik iš AV', 'dropship' => 'Tik iš tiekėjų', 'misrus' => 'AV + tiekėjas' );
		foreach ( Petshop_Desk::SALTINIAI as $k => $s ) { if ( 'av' !== $k ) { $vyk[ $k ] = 'Pagal tiekėją: ' . self::vardas( $k ); } }
		echo self::select( 'vykdymas', $vyk, $f['vykdymas'] );
		echo self::select( 'vezejas', array( '' => 'Pristatymas: visi', 'venipak_kurjeris' => 'Venipak kurjeris', 'venipak_pastomatas' => 'Venipak paštomatas', 'lp' => 'LP Express' ), $f['vezejas'] );
		echo self::select( 'data', array( '' => 'Data: visos', 'siandien' => 'Šiandien', 'vakar' => 'Vakar', 'savaite' => 'Ši savaitė', 'menuo' => 'Šis mėnuo', 'praeitas' => 'Praeitas mėnuo' ), $f['data'] );
		echo '<span class="pilkas maz">Rikiuoti:</span>' . self::select( 'r', array( '' => 'skubiausi pirmi', 'laikas' => 'naujausi pirmi', 'suma' => 'suma', 'tiekejas' => 'tiekėjas', 'klientas' => 'klientas' ), $f['r'] );
		if ( $akt ) { echo '<a class="dl-x" href="' . esc_url( self::url( array( 'vykdymas' => null, 'vezejas' => null, 'data' => null, 'r' => null ) ) ) . '">išvalyti</a>'; }
		echo '</form></div></div>';
	}

	/** Kelio žymė sąraše (maketo kelZyme): pilnas vardas. */
	protected static function zyme( $e ) {
		if ( ! $e['k'] ) { return '<span class="kel klaus"><i></i>kur?</span>'; }
		$cls = array( 'av' => 'sandelis', 'tiesiai' => 'tk', 'i_av' => 'ts' );
		return '<span class="kel ' . $cls[ $e['k'] ] . '"><i></i>' . esc_html( self::kelio_vardas( $e['k'], $e['tiek'] ) ) . '</span>';
	}

	/** Trumpas takelis: ✓ paskutinis padarytas · DABAR (visi „now“/„bad“) · kitas · (+n). Pilna grandinė — skydelyje. */
	protected static function takelis_html( $r ) {
		$done = array(); $now = array(); $wait = array(); $todo = array();
		foreach ( $r['takelis'] as $t ) { if ( 'done' === $t[2] ) { $done[] = $t[1]; } elseif ( 'now' === $t[2] || 'bad' === $t[2] ) { $now[] = $t; } elseif ( 'wait' === $t[2] ) { $wait[] = $t[1]; } else { $todo[] = $t[1]; } }
		$h = '';
		if ( $done ) { $h .= '<span class="done" title="' . esc_attr( implode( ' › ', $done ) ) . '">✓ ' . esc_html( end( $done ) ) . ( count( $done ) > 1 ? ' <small>+' . ( count( $done ) - 1 ) . '</small>' : '' ) . '</span>'; }
		foreach ( $now as $t ) { $h .= ( $h ? '<i>›</i>' : '' ) . '<span class="' . esc_attr( $t[2] ) . '">' . esc_html( $t[1] ) . '</span>'; }
		foreach ( $wait as $w ) { $h .= ( $h ? '<i>›</i>' : '' ) . '<span class="wait">' . esc_html( $w ) . '</span>'; }
		if ( $todo ) { $h .= ( $h ? '<i>›</i>' : '' ) . '<span class="todo">' . esc_html( $todo[0] ) . ( count( $todo ) > 1 ? ' <small>+' . ( count( $todo ) - 1 ) . '</small>' : '' ) . '</span>'; }
		return '<div class="takelis">' . $h . '</div>';
	}

	protected static function btn_html( $b, $cls = 'v p' ) {
		if ( ! $b ) { return ''; }
		if ( ! empty( $b[4] ) ) { return '<a class="kel ts dl-pasyvus" href="' . esc_url( $b[1] ) . '"><i></i>' . esc_html( $b[0] ) . '</a>'; }
		$c = 'bad' === $b[3] ? 'v bad' : ( 's' === $b[3] ? 'v' : $cls );
		if ( '#skydelis' === $b[1] ) { return '<button class="' . $c . '" data-atidaryti="1">' . esc_html( $b[0] ) . '</button>'; }
		$blank = ( false !== strpos( $b[1], 'v=lapai' ) ) ? ' target="_blank" data-blank="1"' : '';
		return '<a class="' . $c . '" href="' . esc_url( $b[1] ) . '"' . $blank . ( $b[2] ? ' data-d="' . esc_attr( wp_json_encode( $b[2] ) ) . '"' : '' ) . '>' . esc_html( $b[0] ) . '</a>';
	}

	protected static function lentele( $rows, $eile ) {
		if ( ! $rows ) { echo '<div class="dl-tuscia">Čia tuščia — nieko daryti nereikia.</div>'; return; }
		echo '<table class="dl-tbl dl-paprasta"><thead><tr><th>Užsakymas</th><th>Prekės</th>' . ( 'visi' === $eile ? '<th>Būsena</th>' : '' ) . ( 'siandien' === $eile || 'visi' === $eile ? '<th>Kur dabar</th>' : '' ) . '<th class="d">Toliau</th></tr></thead><tbody>';
		foreach ( $rows as $r ) {
			$o = $r['o']; $id = $r['id'];
			$sp = Petshop_Desk::SPALVOS[ $r['st'] ] ?? array( '#F1F1EE', '#6B7269' );
			$laikas = $o->get_date_paid() ? $o->get_date_paid() : $o->get_date_created();
			$vardas = trim( $o->get_shipping_first_name() . ' ' . $o->get_shipping_last_name() ); if ( ! $vardas ) { $vardas = trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ); }
			$miestas = $o->get_shipping_city() ? $o->get_shipping_city() : $o->get_billing_city();
			$rb = 'visi' === $eile ? ' dl-row-' . self::busena( $r )[1] : '';
			printf( '<tr class="eil%s%s%s" data-id="%d" tabindex="0" data-json="%s">', empty( $r['svetimas'] ) ? '' : ' dl-svetimas', empty( $r['naujas'] ) ? '' : ' dl-n', $rb, $id, esc_attr( wp_json_encode( self::skydelis( $r ), JSON_UNESCAPED_UNICODE ) ) );
			// 1 stulpelis: nr · laikas · klientas · pristatymas · pastaba
			echo '<td><span class="nr">#' . esc_html( $o->get_order_number() ) . '</span>' . ( ! empty( $r['naujas'] ) ? ' <b class="dl-nz" title="dar neatidarytas">N</b>' : '' ) . ' <span class="pilkas maz">' . esc_html( self::amzius( $laikas ) ) . '</span>';
			if ( 'processing' !== $r['st'] ) { echo ' <span class="dl-pill" style="background:' . esc_attr( $sp[0] ) . ';color:' . esc_attr( $sp[1] ) . '">' . esc_html( wc_get_order_statuses()[ 'wc-' . $r['st'] ] ?? $r['st'] ) . '</span>'; }
			echo '<br>' . esc_html( $vardas ?: '—' ) . ' <span class="pilkas maz">· ' . esc_html( self::d( 'vezejo_vardas', $o ) ) . ( $miestas ? ', ' . esc_html( $miestas ) : '' ) . ' · ' . esc_html( wp_strip_all_tags( $o->get_formatted_order_total() ) ) . ( $r['paid'] ? '' : ' · <b class="raud">neapmokėta</b>' ) . '</span>';
			if ( $o->get_meta( '_ps_klaus_laukti' ) ) { echo ' <span class="dl-pill dl-pill-e">laukia nuo ' . esc_html( wp_date( 'm-d H:i', strtotime( $o->get_meta( '_ps_klaus_laukti' ) ) ) ) . '</span>'; }
			if ( $o->get_customer_note() ) { echo '<div class="dl-note">Klientas: ' . esc_html( $o->get_customer_note() ) . '</div>'; }
			echo '</td>';
			// 2 stulpelis: prekės pagal kelią — viena eilutė kiekvienam keliui
			$gr = array(); foreach ( $r['eil'] as $e ) { $k = 'av' === $e['k'] ? 'av' : ( ( $e['k'] ?: 'kur' ) . '|' . $e['tiek'] ); $gr[ $k ][] = $e; }
			echo '<td>';
			foreach ( $gr as $k => $es ) { $e0 = $es[0]; $n = 0; foreach ( $es as $e ) { $n += $e['q']; } $bad = array(); foreach ( $es as $e ) { if ( false === $e['av_ok'] ) { $bad[] = 'Avesoje ' . (int) $e['av_qty'] . ', reikia ' . $e['q']; } }
				$pav = mb_substr( $e0['n'], 0, 42 ) . ( mb_strlen( $e0['n'] ) > 42 ? '…' : '' );
				$imgs = ''; $ii = 0; foreach ( $es as $e ) { if ( $e['img'] && $ii < 3 ) { $imgs .= '<img class="dl-img-s" src="' . esc_url( $e['img'] ) . '" alt="" title="' . esc_attr( $e['n'] ) . '">'; $ii++; } }
				echo '<div class="dl-it">' . self::zyme( $e0 ) . ' ' . $imgs . ' <b>' . $n . ' vnt.</b> <span class="pilkas">' . esc_html( $pav ) . ( count( $es ) > 1 ? ' +' . ( count( $es ) - 1 ) : '' ) . '</span>' . ( $e0['bukle'] ? ' <span class="pilkas maz">' . esc_html( $e0['bukle'] ) . '</span>' : '' ) . ( $bad ? ' <span class="raud maz">' . esc_html( implode( '; ', $bad ) ) . '</span>' : '' ) . '</div>'; }
			echo '</td>';
			if ( 'visi' === $eile ) { list( $bt, $bc ) = self::busena( $r ); echo '<td><span class="dl-b ' . esc_attr( $bc ) . '">' . esc_html( $bt ) . '</span></td>'; }
			if ( 'siandien' === $eile || 'visi' === $eile ) { echo '<td><span class="maz">' . esc_html( self::kur_dabar( $r ) ) . '</span></td>'; }
			$b = self::mygtukas_eilei( $r, $eile );
			echo '<td class="d">' . self::btn_html( $b );
			if ( 'nauji' === $eile && $r['paid'] && ! $r['rus'] && ! $r['kl'] ) {
				$siulo = array(); $gal = ! $o->get_customer_note(); foreach ( $r['eil'] as $e ) { if ( '' === $e['k'] || false === $e['av_ok'] ) { $gal = false; } $siulo[ self::kelio_vardas( $e['k'], $e['tiek'] ) ] = 1; }
				$siunt = 0; $tk = array(); foreach ( $r['eil'] as $e ) { if ( 'av' === $e['k'] || 'i_av' === $e['k'] ) { $tk['av'] = 1; } elseif ( 'tiesiai' === $e['k'] ) { $tk[ $e['tiek'] ] = 1; } } $siunt = count( $tk );
				if ( $gal ) { echo ' <a class="v" href="' . esc_url( self::dl_url( 'rusiuoti', $id ) ) . '" title="Surūšiuoti taip, kaip siūlo sistema, neatidarant">Auto</a>'; }
				echo '<br><span class="pilkas maz">siūlo: ' . esc_html( implode( ' · ', array_keys( $siulo ) ) ) . ' — ' . $siunt . ( 1 === $siunt ? ' siunta' : ' siuntos' ) . ( $gal ? '' : ' · ' . ( $o->get_customer_note() ? 'yra kliento pastaba — atidaryk' : 'trūksta — atidaryk' ) ) . '</span>';
			}
			$bs = ''; foreach ( $r['takelis'] as $t ) { if ( $b && $t[4] && self::mygtukas( $t, $r )[0] === $b[0] ) { $bs = $t[3] ? $t[3] : $r['riba_s']; break; } }
			if ( $bs && ! $r['uzdarytas'] && empty( $b[4] ) ) { list( $rk, $rt ) = self::riba_tekstas( $bs ); if ( $rt ) { echo '<br><span class="dl-riba dl-riba-' . esc_attr( $rk ) . ' maz">' . esc_html( $rt ) . '</span>'; } }
			echo '</td></tr>';
		}
		echo '</tbody></table>';
		if ( 'surinkti' === $eile ) {
			$lap = array(); $lip = array(); foreach ( $rows as $r ) { if ( empty( $r['dalys']['av']['lapas'] ) && empty( $r['dalys']['av']['siunta'] ) ) { $lap[] = $r['id']; } elseif ( ! empty( $r['dalys']['av']['lapas'] ) && empty( $r['dalys']['av']['siunta'] ) && 'lp' !== $r['vez'] && ! $r['tiesiai'] ) { $lip[] = $r['id']; } }
			echo '<div class="dl-zingsniai-k" style="margin-top:10px">';
			if ( count( $lap ) > 1 ) { echo '<a class="v p" target="_blank" data-blank="1" href="' . esc_url( self::veiksmo_url( 'lapai', 0 ) . '&ids=' . implode( ',', $lap ) ) . '">Surinkti visus (' . count( $lap ) . ')</a>'; }
			if ( count( $lip ) > 1 ) { echo '<a class="v" href="' . esc_url( self::veiksmo_url( 'vp_bulk', 0 ) . '&ids=' . implode( ',', $lip ) ) . '" data-d="' . esc_attr( wp_json_encode( array( 'antraste' => 'Lipdukai visiems', 'tekstas' => 'Registruoti Venipak ' . count( $lip ) . ' AV siuntas (surinktas)? Siuntos registruojamos iš karto ir kainuoja.', 'ok' => 'Registruoti siuntas' ) ) ) . '">Lipdukai visiems (' . count( $lip ) . ')</a>'; }
			echo '</div>';
		}
	}

	protected static function dropship_grupes( $ids ) {
		if ( ! class_exists( 'Petshop_AV_Dropship' ) || ! $ids ) { return array(); }
		$r = new ReflectionMethod( 'Petshop_AV_Dropship', 'grupuoti' ); $r->setAccessible( true );
		return $r->invoke( null, array_values( array_unique( array_map( 'intval', $ids ) ) ) );
	}

	/** Lipduko PDF nuoroda (dropship variklio endpoint'as — veikia bet kuriam užsakymui su Venipak siunta). */
	protected static function lipduko_url( $id ) {
		return wp_nonce_url( admin_url( 'admin-post.php?action=ps_dropship_lipdukas&id=' . (int) $id ), 'ps_dropship_lipdukas' );
	}

	/** LAIŠKAI TIEKĖJAMS — kortelė per tiekėją (G1–G5, C4): 1 Lipdukai (n) → 2 Laiškas [T]; ZB: Kopijuoti · Lipdukas · Perduota. */
	protected static function laisku_korteles( $rows ) {
		$g = self::dropship_grupes( array_map( function ( $r ) { return $r['id']; }, $rows ) );
		if ( ! $g ) { echo '<div class="dl-tuscia">Laiškų tiekėjams nėra — viskas išsiųsta.</div>'; return; }
		$faktai = array(); foreach ( $rows as $r ) { $faktai[ $r['id'] ] = $r; }
		$ln = class_exists( 'Petshop_AV_Dropship' ) ? Petshop_AV_Dropship::laisko_nust() : array( 'tiekejui' => false, 'man' => true );
		$pastai = (array) get_option( 'ps_tiekeju_pastai', array() );
		$cia = self::url();
		uksort( $g, function ( $a, $b ) { $ra = self::riba( $a ); $rb = self::riba( $b ); return ( $ra ? $ra[2] : PHP_INT_MAX ) <=> ( $rb ? $rb[2] : PHP_INT_MAX ); } );
		foreach ( $g as $src => $uzs ) {
			$vardas = self::vardas( $src ); list( $rk, $rt ) = self::riba_tekstas( $src );
			$be = array(); $su = array(); $perreg = array();
			foreach ( $uzs as $oid => $u ) { $fx = $faktai[ $oid ] ?? null; $nr = $fx && ! empty( $fx['dalys'][ $src ]['nr'] ) ? $fx['dalys'][ $src ]['nr'] : array(); if ( $nr ) { $su[] = $oid; } else { $be[] = $oid; if ( $fx && self::d( 'turi_siunta', $fx['o'] ) ) { $perreg[] = $oid; } } }
			$ne_vp = array(); foreach ( $be as $oid_b ) { $fb = $faktai[ $oid_b ] ?? null; if ( $fb && ! in_array( $fb['vez'], array( 'venipak_kurjeris', 'venipak_pastomatas' ), true ) ) { $ne_vp[] = $oid_b; } }
			$be_paprasti = array_diff( $be, $perreg, $ne_vp );
			echo '<div class="dl-kortele dl-tk"><h2>Užsakyti iš ' . esc_html( $vardas ) . ' <span class="pilkas">· ' . count( $uzs ) . ' užs.' . ( $rt ? ' · <span class="dl-riba-' . esc_attr( $rk ) . '">' . esc_html( $rt ) . '</span>' : '' ) . '</span></h2>';
			echo '<table class="dl-tbl dl-tbl-k"><tbody>';
			foreach ( $uzs as $oid => $u ) {
				$fx = $faktai[ $oid ] ?? null; $nr = $fx && ! empty( $fx['dalys'][ $src ]['nr'] ) ? $fx['dalys'][ $src ]['nr'] : array();
				echo '<tr class="eil" data-id="' . (int) $oid . '"' . ( $fx ? ' data-json="' . esc_attr( wp_json_encode( self::skydelis( $fx ), JSON_UNESCAPED_UNICODE ) ) . '"' : '' ) . '><td><span class="nr">#' . esc_html( $u['nr'] ) . '</span>' . ( $fx && ! empty( $fx['naujas'] ) ? ' <b class="dl-nz" title="dar neatidarytas">N</b>' : '' ) . '<br><span class="pilkas maz">' . esc_html( $u['klientas'] ) . ' · ' . esc_html( $u['metodas'] ) . '</span></td><td>';
				$tsv = '';
				foreach ( $u['eilutes'] as $e ) { echo '<div>' . (int) $e['qty'] . '× ' . esc_html( $e['pav'] ) . ( 'zb' === $src && $e['zb'] ? ' <span class="pilkas maz">ZB ' . esc_html( $e['zb'] ) . '</span>' : ( $e['sku'] ? ' <span class="pilkas maz">' . esc_html( $e['sku'] ) . '</span>' : '' ) ) . '</div>'; $tsv .= ( $e['zb'] ?: $e['sku'] ) . "\t" . $e['qty'] . "\n"; }
				echo '</td><td class="d">';
				if ( $nr ) { echo '<span class="pilkas maz">✓ lipdukas ' . esc_html( implode( ', ', $nr ) ) . '</span> <a class="v t" href="' . esc_url( self::lipduko_url( $oid ) ) . '">Lipdukas</a>'; }
				else {
					$oo_r = $fx ? $fx['o'] : wc_get_order( $oid ); $vz = $fx ? $fx['vez'] : '';
					if ( $fx && ! in_array( $vz, array( 'venipak_kurjeris', 'venipak_pastomatas' ), true ) ) { echo '<span class="kel klaus"><i></i>ne Venipak pristatymas (' . esc_html( $u['metodas'] ) . ') — lipduko nebus</span>'; }
					else { echo '<span class="kel ts"><i></i>be lipduko</span>';
						$sv = self::d( 'uzsakymo_svoris', $oo_r ); $vp = (string) $oo_r->get_meta( 'venipak_pickup_point' );
						$dlg = array( 'antraste' => 'Užsakymas #' . $u['nr'] . ' · ' . $u['klientas'], 'tekstas' => 'Registruoti ' . $vardas . ' siuntą klientui? ' . ( $vp ? 'Paštomatas ' . $vp . ' (kiekviena dėžė — atskira siunta).' : 'Kurjeris: ' . wp_strip_all_tags( str_replace( '<br/>', ', ', $oo_r->get_formatted_shipping_address() ) ) . '.' ) . ' Svoris ' . ( $sv > 0 ? number_format( $sv, 1, ',', '' ) . ' kg' : 'nežinomas' ) . '. Siunta registruojama iš karto ir kainuoja.', 'ok' => 'Registruoti siuntą', 'opt' => array( 'vardas' => 'n', 'tekstas' => 'Dėžių', 'def' => Petshop_Desk::pakuociu( $oo_r ), 'tipas' => 'n' ) );
						echo ' <a class="v t" href="' . esc_url( self::dl_url( 'lipdukas', $oid, array( 'sandelis' => $src ) ) ) . '" data-d="' . esc_attr( wp_json_encode( $dlg ) ) . '">Lipdukas</a>'; }
				}
				if ( 'zb' === $src ) { echo ' <button type="button" class="v t dl-kopijuoti" data-tsv="' . esc_attr( $tsv ) . '">Kopijuoti</button>'; }
				echo '</td></tr>';
			}
			echo '</tbody></table>';
			$ids_csv = implode( ',', array_keys( $uzs ) );
			echo '<div class="dl-zingsniai-k">';
			if ( $be_paprasti ) { echo '<span class="zn">1</span><a class="v p" href="' . esc_url( self::veiksmo_url( 'vp_reg', 0, $cia ) . '&ids=' . implode( ',', $be_paprasti ) . '&sandelis=' . rawurlencode( $src ) ) . '">Lipdukai (' . count( $be_paprasti ) . ')</a>'; }
			else { echo '<span class="zn">1</span><span class="v" style="opacity:.6">Lipdukai ✓</span>'; }
			if ( 'zb' === $src ) {
				echo '<span class="zn">2</span><span class="pilkas maz">Suvesti į ZB — „Kopijuoti“ prie kiekvieno užsakymo</span>';
				echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" class="dl-inl" onsubmit="return confirm(\'Pažymėti ' . count( $uzs ) . ' ZB užsakymus suvestais? Tik kai suvesta į ZB ir lipdukai prikabinti.\')">' . wp_nonce_field( 'ps_dropship_zb_done', '_wpnonce', true, false ) . '<input type="hidden" name="action" value="ps_dropship_zb_done"><input type="hidden" name="uzsakymai" value="' . esc_attr( $ids_csv ) . '"><input type="hidden" name="ps_dl_g" value="' . esc_url( $cia ) . '"><span class="zn">3</span><button class="v' . ( $be ? '' : ' p' ) . '">Suvesta (' . count( $uzs ) . ')</button></form>';
			} else {
				$pp = class_exists( 'Petshop_AV_Tiekimas' ) ? Petshop_AV_Tiekimas::atvira_su_eilutemis( $src ) : null;
				$perz = class_exists( 'Petshop_AV_Dropship' ) ? Petshop_AV_Dropship::laisko_html( $src, $uzs, '', '' ) : '';
				echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" class="dl-inl dl-laiskas-f">' . wp_nonce_field( 'ps_dropship_send', '_wpnonce', true, false ) . '<input type="hidden" name="action" value="ps_dropship_send"><input type="hidden" name="tiekejas" value="' . esc_attr( $src ) . '"><input type="hidden" name="uzsakymai" value="' . esc_attr( $ids_csv ) . '"><input type="hidden" name="ps_dl_g" value="' . esc_url( $cia ) . '"><input type="hidden" name="laisk_zyme" value="1">';
				echo '<span class="zn">2</span><button class="v' . ( $be ? '' : ' p' ) . '" type="submit"' . ( $be ? ' disabled title="pirma lipdukai"' : '' ) . '>Užsakyti iš ' . esc_html( $vardas ) . ' (' . count( $uzs ) . ' užs.)</button>';
				echo ' <button type="button" class="v t dl-perz">Peržiūrėti laišką</button>';
				if ( $be ) { echo ' <button class="v t" type="submit" name="be_lipduku" value="1" formnovalidate onclick="return confirm(\'Užsakyti be lipdukų? Tiekėjas neturės ko klijuoti — tik išimtiniu atveju.\')">Užsakyti be lipdukų</button>'; }
				echo '<div class="dl-laisko-nust"><label>Prierašas laiške <input type="text" name="pastaba" placeholder="pvz.: prašome pristatyti iki penktadienio"></label>';
				echo '<label><input type="checkbox" name="su_lipdukais" value="1" checked> lipdukai</label><label><input type="checkbox" name="su_manifestu" value="1" checked> kurjerio sąrašas</label>';
				echo '<label><input type="checkbox" name="laisk_tiekejui" value="1"' . checked( ! empty( $ln['tiekejui'] ), true, false ) . '> siųsti tiekėjui' . ( ! empty( $pastai[ $src ] ) ? ' (' . esc_html( $pastai[ $src ] ) . ')' : ' <span class="raud">— el. pašto nėra</span>' ) . '</label><label><input type="checkbox" name="laisk_man" value="1"' . checked( ! empty( $ln['man'] ), true, false ) . '> kopija man</label>';
				if ( $pp ) { echo '<label><input type="checkbox" name="su_partija" value="' . (int) $pp['part']->id . '" checked> + į AV (užsakymas tiekėjui #' . (int) $pp['part']->id . ', ' . count( $pp['eilutes'] ) . ' prek.) tame pačiame užsakyme</label>'; }
				else { echo '<span class="pilkas">+ į AV: iš ' . esc_html( $vardas ) . ' į AV šiuo metu nieko neužsakom (jei „Laukiam iš tiekėjų“ yra ' . esc_html( $vardas ) . ' prekių — ten „Kartu su Dropshipping“)</span>'; }
				echo '</div><div class="dl-perz-t" style="display:none">' . $perz . '</div></form>';
			}
			echo '</div>';
			if ( $be ) { echo '<p class="pastaba">Pirma lipdukai visiems šio tiekėjo užsakymams, tada vienas užsakymas tiekėjui su lipdukais.</p>'; }
			echo '</div>';
		}
	}

	/** LAUKIAM IŠ TIEKĖJŲ — kortelė per tiekėją: „Gauta“ užsakytiems užsakymams tiekėjui (H3) ir „Užsakyti iš [T] į AV“ (H1/H2, G4) čia pat. */
	protected static function laukiam_korteles( $rows, $ds = array() ) {
		global $wpdb; $tk = class_exists( 'Petshop_AV_Tiekimas' );
		$g = array(); $faktai = array();
		foreach ( $rows as $r ) { $faktai[ $r['id'] ] = $r; foreach ( $r['eil'] as $e ) { if ( 'i_av' === $e['k'] && $e['src'] ) { $g[ $e['src'] ]['uzs'][ $r['id'] ][] = $e; } } }
		$uzsak = $tk ? $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_tiekimas WHERE busena='uzsakyta' ORDER BY id" ) : array();
		foreach ( (array) $uzsak as $p ) { $g[ $p->tiekejas ]['part'][] = $p; }
		if ( ! $g ) { echo '<div class="dl-tuscia">Nieko nelaukiam iš tiekėjų — viskas AV.</div>'; return; }
		uksort( $g, function ( $a, $b ) { $ra = self::riba( $a ); $rb = self::riba( $b ); return ( $ra ? $ra[2] : PHP_INT_MAX ) <=> ( $rb ? $rb[2] : PHP_INT_MAX ); } );
		$cia = self::url(); $prist = $tk ? Petshop_AV_Tiekimas::PRISTATYMAI : array();
		$ln = $tk ? Petshop_AV_Tiekimas::laisko_nust() : array( 'tiekejui' => false, 'man' => true ); $pastai = (array) get_option( 'ps_tiekeju_pastai', array() );
		$eil_td = function ( $oid, $fx ) { $o = $fx ? $fx['o'] : wc_get_order( $oid ); return '<td><span class="nr">#' . esc_html( $o ? $o->get_order_number() : $oid ) . '</span>' . ( $fx && ! empty( $fx['naujas'] ) ? ' <b class="dl-nz" title="dar neatidarytas">N</b>' : '' ) . '<br><span class="pilkas maz">' . esc_html( $o ? trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ) : '' ) . '</span></td>'; };
		$tr_open = function ( $oid, $fx ) { return '<tr class="eil" data-id="' . (int) $oid . '"' . ( $fx ? ' data-json="' . esc_attr( wp_json_encode( self::skydelis( $fx ), JSON_UNESCAPED_UNICODE ) ) . '"' : '' ) . '>'; };
		foreach ( $g as $src => $x ) {
			$vardas = self::vardas( $src ); $rank = $tk && Petshop_AV_Tiekimas::rankinis( $src ); list( $rk, $rt ) = self::riba_tekstas( $src );
			$n_uzs = count( $x['uzs'] ?? array() );
			echo '<div class="dl-kortele dl-tk"><h2>' . esc_html( $vardas ) . ' <span class="pilkas">· ' . $n_uzs . ' užs.' . ( $rt ? ' · <span class="dl-riba-' . esc_attr( $rk ) . '">' . esc_html( $rt ) . '</span>' : '' ) . '</span></h2>';

			/* ---- A. Užsakyta — laukiam → „Gauta“ ---- */
			foreach ( $x['part'] ?? array() as $p ) {
				$eil = Petshop_AV_Tiekimas::partijos_eilutes( (int) $p->id ); if ( ! $eil ) { continue; }
				$tsv = ''; $lip = ! empty( $p->venipak_pack ) ? admin_url( 'admin-post.php?action=ps_tiekimas_lipdukas&partija=' . (int) $p->id . '&_wpnonce=' . wp_create_nonce( 'ps_tiek_lip_' . $p->id ) ) : '';
				echo '<div class="dl-tk-blk"><h3>Užsakyta ' . esc_html( mysql2date( 'm-d H:i', $p->uzsakyta ) ) . ' <span class="pilkas">· užsakymas tiekėjui #' . (int) $p->id . ( isset( $prist[ $p->pristatymas ] ) ? ' · ' . esc_html( $prist[ $p->pristatymas ] ) : '' ) . ( $p->venipak_pack ? ' · siunta ' . esc_html( str_replace( ',', ', ', $p->venipak_pack ) ) . ' <a class="v t" href="' . esc_url( $lip ) . '" target="_blank">Lipdukas</a>' : '' ) . '</span></h3>';
				echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" class="dl-tk-f" onsubmit="return confirm(\'Gauta iš ' . esc_js( $vardas ) . '? Įvesti kiekiai pridedami į AV likutį. Užsakymai, kuriems viskas atvyko, eina į „Surinkti AV“; jei kiekis mažesnis — trūkumas lieka laukti naujame užsakyme tiekėjui.\')">' . wp_nonce_field( 'ps_dl_tiek_' . $src . '_' . (int) $p->id, '_wpnonce', true, false ) . '<input type="hidden" name="action" value="ps_dl_tiekimas"><input type="hidden" name="ka" value="priimti"><input type="hidden" name="tiekejas" value="' . esc_attr( $src ) . '"><input type="hidden" name="partija" value="' . (int) $p->id . '"><input type="hidden" name="ps_dl_g" value="' . esc_url( $cia ) . '">';
				echo '<table class="dl-tbl dl-tbl-k"><tbody>';
				foreach ( $eil as $e ) {
					$pr = wc_get_product( $e->product_id ); $pav = $pr ? $pr->get_name() : '#' . $e->product_id; $sku = $pr ? $pr->get_sku() : ''; $tsv .= $sku . "\t" . (int) $e->qty . "\t" . $pav . "\n";
					$oid = (int) $e->order_id; $fx = $oid ? ( $faktai[ $oid ] ?? null ) : null;
					echo $oid ? $tr_open( $oid, $fx ) . $eil_td( $oid, $fx ) : '<tr><td><span class="pilkas">į atsargas</span></td>';
					echo '<td><div>' . (int) $e->qty . '× ' . esc_html( $pav ) . ( $sku ? ' <span class="pilkas maz">' . esc_html( $sku ) . '</span>' : '' ) . '</div></td>';
					echo '<td class="d dl-tk-gauta"><label>Gauta <input type="number" min="0" name="gauta[' . (int) $e->id . ']" value="' . (int) $e->qty . '"></label> <label class="pilkas maz">galioja iki <input type="text" name="galioja[' . (int) $e->id . ']" placeholder="YYYY-MM" pattern="\d{4}-\d{2}"></label></td></tr>';
				}
				echo '</tbody></table><div class="dl-zingsniai-k">';
				if ( $rank ) { echo '<button type="button" class="v t dl-kopijuoti" data-tsv="' . esc_attr( $tsv ) . '">Kopijuoti</button><span class="pilkas maz">sąrašas suvedimui į ' . esc_html( $vardas ) . ' sistemą</span>'; }
				echo '<button class="v p" type="submit">Gauta</button></div></form></div>';
			}

			/* ---- B. Užsakyti iš [T] į AV: kaupiama partija + dar nesudėtos „veža į AV“ eilutės ---- */
			$kaup = $tk ? Petshop_AV_Tiekimas::atvira_su_eilutemis( $src ) : null; $part = $kaup ? $kaup['part'] : null;
			$neuzs = array(); $sudeta = array();
			foreach ( $x['uzs'] ?? array() as $oid => $es ) { foreach ( $es as $e ) { if ( ! $e['b'] ) { $neuzs[ $oid ][] = $e; } elseif ( 'kaupiama' === $e['b']['busena'] ) { $sudeta[ $oid ][] = $e; } } }
			if ( $kaup || $neuzs ) {
				$ids = array_unique( array_merge( array_keys( $neuzs ), array_keys( $sudeta ) ) ); $n_prek = 0; $prev_eil = array(); $kg = 0.0; $be_svorio = 0;
				echo '<div class="dl-tk-blk"><h3>Užsakyti iš ' . esc_html( $vardas ) . ' į AV' . ( $part ? ' <span class="pilkas">· užsakymas tiekėjui #' . (int) $part->id . '</span>' : '' ) . '</h3>';
				echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" class="dl-inl dl-laiskas-f dl-tk-f">' . wp_nonce_field( 'ps_dl_tiek_' . $src . '_' . ( $part ? (int) $part->id : 0 ), '_wpnonce', true, false ) . '<input type="hidden" name="action" value="ps_dl_tiekimas"><input type="hidden" name="tiekejas" value="' . esc_attr( $src ) . '"><input type="hidden" name="partija" value="' . ( $part ? (int) $part->id : 0 ) . '"><input type="hidden" name="ids" value="' . esc_attr( implode( ',', $ids ) ) . '"><input type="hidden" name="ps_dl_g" value="' . esc_url( $cia ) . '"><input type="hidden" name="laisk_zyme" value="1">';
				echo '<table class="dl-tbl dl-tbl-k"><tbody>';
				foreach ( $ids as $oid ) {
					$fx = $faktai[ $oid ] ?? null; echo $tr_open( $oid, $fx ) . $eil_td( $oid, $fx ) . '<td>';
					foreach ( array_merge( $neuzs[ $oid ] ?? array(), $sudeta[ $oid ] ?? array() ) as $e ) { $n_prek++; $pr = wc_get_product( $e['pid'] ); $w = $pr ? (float) $pr->get_weight() : 0; if ( $w > 0 ) { $kg += $w * $e['q']; } else { $be_svorio++; } $prev_eil[] = (object) array( 'product_id' => $e['pid'], 'qty' => $e['q'] );
						echo '<div>' . (int) $e['q'] . '× ' . esc_html( $e['n'] ) . ( $e['sku'] ? ' <span class="pilkas maz">' . esc_html( $e['sku'] ) . '</span>' : '' ) . ' <span class="pilkas maz">· ' . esc_html( $e['b'] ? 'sudėta' : 'neužsakyta' ) . '</span></div>'; }
					echo '</td><td class="d"></td></tr>';
				}
				if ( $kaup ) { foreach ( $kaup['eilutes'] as $e ) { if ( $e->order_id ) { continue; } $n_prek++; $pr = wc_get_product( $e->product_id ); $w = $pr ? (float) $pr->get_weight() : 0; if ( $w > 0 ) { $kg += $w * $e->qty; } else { $be_svorio++; } $prev_eil[] = $e;
					echo '<tr><td><span class="pilkas">į atsargas</span></td><td><div>' . (int) $e->qty . '× ' . esc_html( $pr ? $pr->get_name() : '#' . $e->product_id ) . ( $pr && $pr->get_sku() ? ' <span class="pilkas maz">' . esc_html( $pr->get_sku() ) . '</span>' : '' ) . '</div></td><td class="d"></td></tr>'; } }
				echo '</tbody></table><div class="dl-zingsniai-k">';
				$bud = $part ? (string) $part->pristatymas : '';
				echo '<div class="dl-tk-prist"><span class="pilkas maz">Kaip atkeliaus į AV:</span>';
				foreach ( $prist as $k => $v ) { echo '<label><input type="radio" name="pristatymas" value="' . esc_attr( $k ) . '"' . checked( $bud, $k, false ) . ' required> ' . esc_html( $v ) . '</label>'; }
				echo '<label class="pilkas maz">svoris <input type="number" step="0.1" min="0" name="svoris" value="' . esc_attr( $part && $part->svoris > 0 ? $part->svoris : '' ) . '" placeholder="' . esc_attr( $kg > 0 ? round( $kg, 1 ) : '' ) . '"> kg' . ( $be_svorio ? ' <span class="raud">(' . (int) $be_svorio . ' be svorio kataloge)</span>' : '' ) . '</label>';
				echo '<label class="pilkas maz">dėžių <input type="number" min="1" max="20" name="dezes" value="' . (int) max( 1, (int) ( $part->dezes ?? 1 ) ) . '"></label></div>';
				$patv = $rank ? 'Užsakyti iš ' . $vardas . ' į AV (' . $n_prek . ' prek.)? Laiško nebus — sąrašą suvesi į ' . $vardas . ' sistemą („Kopijuoti“ atsiras čia, kol prekės atvažiuos).' : 'Užsakyti iš ' . $vardas . ' į AV (' . $n_prek . ' prek.)? Laiškas išeina iš karto' . ( in_array( $bud, array( 'kurjeris', 'pastomatas' ), true ) ? ', siunta registruojama Venipak ir kainuoja' : '' ) . '. Prekės liks „Laukiam“, kol spausi „Gauta“.';
				echo '<button class="v p" type="submit" name="ka" value="uzsakyti" onclick="return confirm(' . esc_attr( wp_json_encode( $patv ) ) . ')">Užsakyti iš ' . esc_html( $vardas ) . ' į AV (' . $n_prek . ' prek.)</button>';
				if ( ! $rank ) {
					echo ' <button type="button" class="v t dl-perz">Peržiūrėti laišką</button>';
					if ( ! empty( $ds[ $src ] ) ) { echo ' <button class="v t" type="submit" name="ka" value="kartu" title="Prekės į AV keliauja tame pačiame užsakyme tiekėjui su Dropshipping užsakymais — vienas laiškas">Kartu su Dropshipping (' . (int) $ds[ $src ] . ' užs.)</button>'; }
					echo '<div class="dl-laisko-nust"><label><input type="checkbox" name="laisk_tiekejui" value="1"' . checked( ! empty( $ln['tiekejui'] ), true, false ) . '> siųsti tiekėjui' . ( ! empty( $pastai[ $src ] ) ? ' (' . esc_html( $pastai[ $src ] ) . ')' : ' <span class="raud">— el. pašto nėra</span>' ) . '</label><label><input type="checkbox" name="laisk_man" value="1"' . checked( ! empty( $ln['man'] ), true, false ) . '> kopija man</label></div>';
					$prev_part = (object) array( 'pristatymas' => $bud, 'dezes' => (int) max( 1, (int) ( $part->dezes ?? 1 ) ) );
					echo '<div class="dl-perz-t" style="display:none"><p>Laba diena,</p><p>prašome paruošti šias prekes.</p>' . Petshop_AV_Tiekimas::laisko_dalis( $prev_part, $prev_eil, '' ) . '<p>Ačiū,<br>UAB Avesa · petshop.lt<br>terra@petshop.lt</p></div>';
				}
				echo '</div></form></div>';
			}
			echo '</div>';
		}
	}

	/** PARUOŠTA — Avesa laukia kurjerio (Lipdukas PDF · siuntų sąrašas · Išsiųsta / Kurjeris paėmė viską) ir tiekėjai („[T] išsiuntė“). */
	protected static function paruostos_korteles( $rows ) {
		$av = array(); $tk = array();
		foreach ( $rows as $r ) { if ( ! empty( $r['dalys']['av']['siunta'] ) && empty( $r['dalys']['av']['issiusta'] ) ) { $av[] = $r; } foreach ( $r['tiesiai'] as $s ) { if ( ! empty( $r['dalys'][ $s ]['perduota'] ) && empty( $r['dalys'][ $s ]['issiusta'] ) ) { $tk[ $s ][] = $r; } } }
		$cia = self::url();
		if ( $av ) {
			$man = array(); foreach ( $av as $r ) { foreach ( ( class_exists( 'Petshop_Siuntos' ) ? Petshop_Siuntos::sarasas( $r['id'] ) : array() ) as $s ) { if ( ( 'av' === $s['sandelis'] || '' === $s['sandelis'] ) && ! empty( $s['manifest'] ) ) { $man[ $s['manifest'] ] = 1; } } }
			echo '<div class="dl-kortele"><h2>AV — supakuota, laukia kurjerio <span class="pilkas">· ' . count( $av ) . ' siunt.</span></h2><table class="dl-tbl dl-tbl-k"><tbody>';
			$visi = array();
			foreach ( $av as $r ) { $o = $r['o']; $visi[] = $r['id']; $kitos = array(); foreach ( $r['tiesiai'] as $s ) { if ( empty( $r['dalys'][ $s ]['issiusta'] ) ) { $kitos[] = self::vardas( $s ); } }
				echo '<tr class="eil" data-id="' . (int) $r['id'] . '" data-json="' . esc_attr( wp_json_encode( self::skydelis( $r ), JSON_UNESCAPED_UNICODE ) ) . '"><td><span class="nr">#' . esc_html( $o->get_order_number() ) . '</span>' . ( ! empty( $r['naujas'] ) ? ' <b class="dl-nz" title="dar neatidarytas">N</b>' : '' ) . '<br><span class="pilkas maz">' . esc_html( trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ) ) . '</span></td><td>' . esc_html( self::d( 'vezejo_vardas', $o ) ) . '<br><span class="pilkas maz">' . esc_html( implode( ', ', $r['dalys']['av']['nr'] ) ) . ( Petshop_Desk::pakuociu( $o ) > 1 ? ' · ' . Petshop_Desk::pakuociu( $o ) . ' dėž.' : '' ) . ( $kitos ? ' · kita dalis: ' . esc_html( implode( ', ', $kitos ) ) : '' ) . '</span></td><td class="d">' . ( 'lp' !== $r['vez'] ? '<a class="v t" href="' . esc_url( self::lipduko_url( $r['id'] ) ) . '">Lipdukas</a> ' : '' ) . self::btn_html( self::mygtukas( array( 'issiusta', '', 'now', 'av', 'issiusta' ), $r ) ) . '</td></tr>'; }
			echo '</tbody></table><div class="dl-zingsniai-k">';
			echo '<a class="v p" href="' . esc_url( self::dl_url( 'issiusta', 0, array( 'ids' => implode( ',', $visi ), 'dalis' => 'av', 'sekimo' => 1 ) ) ) . '" data-d="' . esc_attr( wp_json_encode( array( 'antraste' => 'Kurjeris paėmė viską', 'tekstas' => 'Kurjeris paėmė visas ' . count( $visi ) . ' AV siuntas? Užsakymai, kurių visos dalys išsiųstos, taps įvykdyti ir klientams išeis sekimo numeriai; kiti lauks tiekėjų.', 'ok' => 'Kurjeris paėmė viską' ) ) ) . '">Kurjeris paėmė viską</a>';
			foreach ( array_keys( $man ) as $m ) { echo '<a class="v t" href="' . esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=ps_desk_veiksmas&v=vp_manifestas&id=0&kodas=' . rawurlencode( $m ) ), 'ps_desk_vp_manifestas_0' ) ) . '" target="_blank">Kurjerio sąrašas</a>'; }
			echo '</div><p class="pastaba">Kai išsiųstos visos užsakymo dalys — užsakymas įvykdytas ir klientui išeina sekimo numeriai.</p></div>';
		}
		foreach ( $tk as $s => $rs ) {
			echo '<div class="dl-kortele"><h2>' . esc_html( self::vardas( $s ) ) . ' — užsakyta, laukiam, kol išsiųs <span class="pilkas">· ' . count( $rs ) . ' užs.</span></h2><table class="dl-tbl dl-tbl-k"><tbody>';
			foreach ( $rs as $r ) { $o = $r['o']; $kitos = array(); foreach ( $r['dalys'] as $k2 => $p2 ) { if ( $p2 && $k2 !== $s && empty( $p2['issiusta'] ) ) { $kitos[] = self::vardas( $k2 ); } }
				echo '<tr class="eil" data-id="' . (int) $r['id'] . '" data-json="' . esc_attr( wp_json_encode( self::skydelis( $r ), JSON_UNESCAPED_UNICODE ) ) . '"><td><span class="nr">#' . esc_html( $o->get_order_number() ) . '</span><br><span class="pilkas maz">' . esc_html( trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ) ) . '</span></td><td><span class="pilkas maz">užsakyta ' . esc_html( wp_date( 'm-d H:i', strtotime( $r['dalys'][ $s ]['kada'] ) ) ) . ( ! empty( $r['dalys'][ $s ]['nr'] ) ? ' · ' . esc_html( implode( ', ', $r['dalys'][ $s ]['nr'] ) ) : '' ) . ( $kitos ? ' · kita dalis: ' . esc_html( implode( ', ', $kitos ) ) : '' ) . '</span></td><td class="d">' . self::btn_html( self::mygtukas( array( 'issiusta', '', 'now', $s, 'issiusta' ), $r ) ) . '</td></tr>'; }
			echo '</tbody></table><p class="pastaba">Kai tiekėjas praneša, kad išsiuntė — pažymi; klientui išeina sekimo numeris.</p></div>';
		}
		if ( ! $av && ! $tk ) { echo '<div class="dl-tuscia">Čia tuščia.</div>'; }
	}

	/** Klausimai — kortelės su priežastimi ir aiškiais veiksmais (spec §7, C8). */
	protected static function klausimu_korteles( $rows ) {
		foreach ( $rows as $r ) {
			$o = $r['o']; $id = $r['id']; $sk = self::skydelis( $r ); $kl = $r['kl'];
			$tekstas = $kl; $pastaba = ''; $veiksmai = '';
			$atsaukti = $sk['atsaukti'] ? '<a class="v t raud" href="' . esc_url( $sk['atsaukti']['u'] ) . '" data-d="' . esc_attr( wp_json_encode( $sk['atsaukti']['d'] ) ) . '">Atšaukti</a>' : '';
			$rasyti = $sk['mail'] ? '<a class="v t" href="mailto:' . esc_attr( $sk['mail'] ) . '?subject=' . rawurlencode( 'Užsakymas #' . $o->get_order_number() . ' — petshop.lt' ) . '">Parašyti klientui</a>' : '';
			$laukti = $sk['laukti'] ? '<a class="v" href="' . esc_url( $sk['laukti'] ) . '">Laukti</a>' : '';
			if ( 0 === strpos( $kl, 'Trūksta' ) ) {
				$kle = self::d( 'klausimo_eilutes', $o ); $d = array();
				foreach ( $kle as $x ) { $d[] = $x['pav'] . ' — reikia ' . $x['reikia'] . ', AV ' . ( $x['turi'] ? 'tik ' . $x['turi'] : 'nėra' ) . ( $x['tiek'] ? ', ' . self::vardas( $x['tiek'] ) . ' turi' : ', tiekėjo nėra' ); }
				$tekstas = 'Trūksta AV: ' . implode( '; ', $d ) . '.';
				$pastaba = 'Ką gali daryti: keisk kelią (tiekėjas siunčia klientui / veža į AV); užsakyk pats ir palik „Iš AV“, kai turėsi; parašyk klientui pakaitalą; arba atšauk. „Laukti“ tik pažymi — priminimo nebus.';
				$veiksmai = '<button class="v p" data-atidaryti="1">Rūšiuoti</button> ' . $laukti . ' ' . $rasyti . ' ' . $atsaukti;
			} elseif ( 0 === strpos( $kl, 'Prekė be sandėlio' ) ) {
				$be = array(); foreach ( $r['eil'] as $e ) { if ( '' === $e['k'] ) { $be[] = $e['q'] . '× ' . $e['n']; } }
				$tekstas = 'Nežinia iš kur siųsti: ' . implode( '; ', $be ) . ' — AV nėra, tiekėjo nėra.';
				$pastaba = 'Jei prekė yra AV — atidaryk ir pažymėk „Iš AV“ (likutis nenurašomas). Jei nėra — parašyk klientui pakaitalą arba atšauk.';
				$veiksmai = '<button class="v p" data-atidaryti="1">Rūšiuoti</button> ' . $rasyti . ' ' . $atsaukti;
			} elseif ( 0 === strpos( $kl, 'Mokėjimas' ) ) {
				$pastaba = 'Mokėjimas nepavyko (Paysera/bankas grąžino klaidą). Jei pinigai vis dėlto atėjo — „Pažymėti apmokėtu“; jei ne — parašyk klientui arba atšauk.';
				$veiksmai = self::btn_html( self::mygtukas( array( 'apmoketa', '', 'now', '', 'apmoketa' ), $r ) ) . ' ' . $rasyti . ' ' . $atsaukti;
			} elseif ( 0 === strpos( $kl, 'Siuntos' ) ) {
				$pastaba = 'Vežėjas siuntos nesukūrė (dažniausiai paštomatas nebegalioja arba adresas). Paštomato / adreso keitimas čia dar nepadarytas — parašyk Raimiui, po pakeitimo registruok lipduką iš naujo.';
				$veiksmai = '<button class="v p" data-atidaryti="1">Atidaryti</button> ' . $rasyti . ' ' . $atsaukti;
			} elseif ( 0 === strpos( $kl, 'Klientas atsisako' ) ) {
				$pastaba = 'Klientas pateikė sutarties atsisakymą (14 d.). Atšauk užsakymą; pinigų grąžinimą ir kreditinę tvarkysi atskirai.';
				$veiksmai = $atsaukti . ' ' . $rasyti;
			} elseif ( 0 === strpos( $kl, 'Tiekėjas vėluoja' ) ) {
				$pastaba = 'Užsakyta iš tiekėjo prieš 24+ val., siunta neišėjo. Paskambink tiekėjui; jei išsiuntė — pažymėk „[tiekėjas] išsiuntė“.';
				$veiksmai = '<button class="v p" data-atidaryti="1">Atidaryti</button> ' . $laukti . ' ' . $rasyti . ' ' . $atsaukti;
			} elseif ( 0 === strpos( $kl, 'LP negalimas' ) ) {
				$pastaba = 'LP Express galimas tik iš AV. Keisk ne-AV prekių kelią į „Iš AV“ / „veža į AV“ (pristatymo keitimas į Venipak čia dar nepadarytas — parašyk Raimiui).';
				$veiksmai = '<button class="v p" data-atidaryti="1">Rūšiuoti</button> ' . $rasyti . ' ' . $atsaukti;
			} else {
				$veiksmai = '<button class="v p" data-atidaryti="1">Atidaryti</button> ' . $laukti . ' ' . $rasyti . ' ' . $atsaukti;
			}
			printf( '<div class="dl-kortele eil" data-id="%d" data-json="%s"><h2>#%s · %s · %s <span class="kel klaus"><i></i>%s</span></h2><p>%s</p>%s<p class="dl-veiksmai">%s</p>%s</div>',
				$id, esc_attr( wp_json_encode( $sk, JSON_UNESCAPED_UNICODE ) ), esc_html( $o->get_order_number() ), esc_html( $sk['kl'] ), esc_html( $sk['suma'] ), esc_html( mb_strtolower( $kl ) ), esc_html( $tekstas ),
				$pastaba ? '<p class="pastaba">' . esc_html( $pastaba ) . '</p>' : '', $veiksmai, $o->get_meta( '_ps_klaus_laukti' ) ? '<p class="pilkas maz">Pažymėta laukti ' . esc_html( $o->get_meta( '_ps_klaus_laukti' ) ) . '</p>' : '' );
		}
	}

	protected static function skydelio_html() {
		?>
		<div class="uzdanga" id="dlUzd"></div>
		<aside class="skydas" id="dlSk" aria-hidden="true">
			<header><div><h2 id="skNr"></h2><div class="pilkas maz" id="skKl"></div></div><button class="uzdaryti" id="skUzd" title="Uždaryti (Esc)">×</button></header>
			<div class="kunas">
				<div class="pastaba" id="skPastaba"></div>
				<div class="dl-klaus" id="skKlaus" style="display:none"></div>
				<div id="skEil"></div>
				<div class="blokas"><b>Pristatymas</b><div id="skPr"></div></div>
				<div class="blokas" id="skSiunta" style="display:none"><b>AV siunta</b><div id="skSiuntaT"></div></div>
				<div class="blokas" id="skPast" style="display:none"><b>Kliento pastaba</b><div id="skPastT"></div></div>
				<div class="blokas"><b>Istorija</b><div class="zurnalas" id="skZur"></div></div>
			</div>
			<footer id="skV"></footer>
		</aside>
		<?php
	}

	/** RYTINĖ EIGA be užrakto (D1/D2, spec §7): žingsniai pagal ribas, gyvi skaičiai, kiekvienas veda į eilę. */
	protected static function rytas( $atviri, $c ) {
		global $wpdb;
		$lip_av = 0; foreach ( $atviri as $r ) { if ( in_array( 'surinkti', $r['eiles'], true ) && ! empty( $r['dalys']['av']['lapas'] ) ) { $lip_av++; } }
		$gav = class_exists( 'Petshop_AV_Tiekimas' ) ? (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}ps_tiekimas WHERE busena='uzsakyta'" ) : 0;
		$tiek = array(); foreach ( $atviri as $r ) { if ( in_array( 'laiskai', $r['eiles'], true ) ) { foreach ( $r['tiesiai'] as $s ) { if ( empty( $r['dalys'][ $s ]['perduota'] ) ) { $tiek[ $s ] = ( $tiek[ $s ] ?? 0 ) + 1; } } } }
		uksort( $tiek, function ( $a, $b ) { $ra = self::riba( $a ); $rb = self::riba( $b ); return ( $ra ? $ra[2] : PHP_INT_MAX ) <=> ( $rb ? $rb[2] : PHP_INT_MAX ); } );
		$tiek_t = array(); foreach ( $tiek as $s => $n ) { list( , $rt ) = self::riba_tekstas( $s ); $tiek_t[] = self::vardas( $s ) . ' ' . $n . ( $rt ? ' (' . $rt . ')' : '' ); }
		list( , $r_av ) = self::riba_tekstas( 'av' ); list( , $r_lp ) = self::riba_tekstas( 'lp' );
		$Z = array(
			array( 'Išrūšiuoti naujus', $c['nauji'], 'AV + tiekėjas arba trūkumas — iš kur važiuos kiekviena prekė; aiškius sistema išrūšiavo pati.', 'nauji', 'Rūšiuoti' ),
			array( 'Dropshipping — lipdukai ir užsakymai tiekėjams', $c['laiskai'], $tiek_t ? implode( ' · ', $tiek_t ) : 'kortelė per tiekėją: 1 Lipdukai → 2 Užsakyti', 'laiskai', 'Atidaryti' ),
			array( 'Užsakyti iš tiekėjų į AV', $c['laukiam'], 'kas neužsakyta — „Užsakyti iš … į AV“ čia pat; kas užsakyta — laukiam', 'laukiam', 'Atidaryti' ),
			array( 'Surinkti AV', $c['surinkti'], 'visos AV siuntos prekės vietoje — lapai (galima visus vienu lapu)', 'surinkti', 'Surinkti' ),
			array( 'Lipdukai AV siuntoms', $lip_av, 'surinkta, be lipduko · Venipak ' . $r_av . ' · LP Express ' . $r_lp . ' (LP lipdukas — dar per seną eigą, formavimas iškviečia kurjerį)', 'surinkti', 'Lipdukai' ),
			array( 'Kurjeris paėmė / tiekėjai išsiuntė', $c['paruosta'], 'klientams išeina sekimo numeriai', 'paruosta', 'Atidaryti' ),
			array( 'Gavimai', $gav, 'užsakymai tiekėjams, kurie atvažiavo — „Gauta“ eilėje „Laukiam iš tiekėjų“', 'laukiam', 'Atidaryti' ),
			array( 'Klausimai', $c['klausimai'], 'reikia tavo sprendimo', 'klausimai', 'Atidaryti' ),
		);
		echo '<main class="dl-main"><h1 class="dl-h1">Rytinė eiga <small>' . esc_html( wp_date( 'l · H:i' ) ) . ' · eik per žingsnius iš viršaus žemyn — sąrašas gyvas, nauji užsakymai atsiranda patys, užrakto nėra</small></h1><div class="dl-zs">';
		foreach ( $Z as $i => $z ) {
			$url = self::url( array( 'eile' => $z[3], 'view' => null, 'q' => null, 'b' => null ) );
			$n = (int) $z[1];
			printf( '<div class="dl-z%s"><div class="zn">%d</div><div class="zt"><b>%s</b><span class="pilkas">%s</span></div>%s</div>', $n ? '' : ' tuscias', $i + 1, esc_html( $z[0] ), esc_html( $n ? $n . ' užs. — ' . $z[2] : '✓ tuščia' ), $n ? '<a class="v p" href="' . esc_url( $url ) . '">' . esc_html( $z[4] ) . '</a>' : '' );
		}
		echo '</div><p class="dl-paaisk">Tvarka pagal laikus: ZB, Prins, Belacor, Quattro iki 09:00; Ambrosia 10:00; AV iki 11:00; VF ir LP iki 13:00. Ryte pradedi nuo viršaus; dieną grįžti į tą žingsnį, kur atsirado skaičius.</p>';
		if ( current_user_can( 'manage_woocommerce' ) ) { echo '<p class="dl-paaisk"><a href="' . esc_url( admin_url( 'admin.php?page=' . self::SLUG . '&senas=1&view=rytas' ) ) . '">Senoji eiga (LP Express lipdukai)</a> — tik iki T-0 LP testo.</p>'; }
		echo '</main>';
	}

	protected static function dialogas() {
		?>
		<div class="dl-shade" id="dlShade"></div>
		<div class="dl-dlg" id="dlDlg" role="dialog" aria-modal="true"><h3 id="dlDlgH"></h3><p id="dlDlgT"></p>
			<label id="dlDlgOptL" class="dl-opt"><input type="checkbox" id="dlDlgOpt"><input type="number" id="dlDlgN" min="1" max="20" style="display:none;width:60px;font:inherit;border:1px solid var(--linija);border-radius:5px;padding:3px 6px"> <span id="dlDlgOptT"></span></label>
			<div class="dl-dlg-b"><button class="v" id="dlDlgNo" type="button">Atšaukti</button><a class="v p" id="dlDlgOk" href="#">Gerai</a></div></div>
		<?php
	}

	protected static function stilius() {
		?>
<style id="dl-css">
.dl{--fonas:#EEF1EF;--popierius:#fff;--rasalas:#1B2620;--pilka:#66716B;--linija:#D7DDD9;--zalia:#2E7D4F;--zalia-s:#E3F1E8;--melyna:#2B5F8A;--melyna-s:#E2ECF5;--gintaras:#B9731A;--gintaras-s:#FBEFD9;--raudona:#B23A3A;--raudona-s:#F8E3E3;
 color:var(--rasalas);font:14px/1.45 "IBM Plex Sans",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.dl *{box-sizing:border-box}.dl button{font:inherit;cursor:pointer}.dl a{color:var(--melyna);text-decoration:none}.dl a:hover{text-decoration:underline}.dl :focus-visible{outline:2px solid var(--melyna);outline-offset:2px}
.dl-main{padding:14px 24px 80px;max-width:1280px}
.dl-h1{font-size:20px;font-weight:600;margin:6px 0 12px;display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}.dl-h1 small{font-weight:400;color:var(--pilka);font-size:14px}
.dl .pilkas{color:var(--pilka)}.dl .maz{font-size:12px}.dl .raud{color:var(--raudona)}.dl .nr{font-weight:600}
.dl-legenda{display:flex;gap:14px;align-items:center;margin:0 0 14px;font-size:13px;color:var(--pilka);flex-wrap:wrap}
.dl .kel{display:inline-flex;align-items:center;gap:5px;border-radius:4px;padding:2px 7px;font-size:12px;font-weight:600;white-space:nowrap}
.dl .kel.sandelis{background:var(--zalia-s);color:var(--zalia)}.dl .kel.tk{background:var(--melyna-s);color:var(--melyna)}.dl .kel.ts{background:var(--gintaras-s);color:var(--gintaras)}.dl .kel.klaus{background:var(--raudona-s);color:var(--raudona)}
.dl .kel i{width:7px;height:7px;border-radius:50%;background:currentColor;display:inline-block}
.dl-eiles{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;align-items:center}.dl-e{border:1px solid var(--linija);background:var(--popierius);border-radius:20px;padding:5px 12px;display:inline-flex;gap:7px;align-items:center;color:var(--pilka)}.dl-e:hover{text-decoration:none;border-color:var(--pilka)}.dl-e.on{border-color:var(--rasalas);color:var(--rasalas);font-weight:600}
.dl .sk{min-width:20px;height:18px;padding:0 6px;border-radius:10px;background:var(--fonas);color:var(--pilka);font-size:11px;font-weight:600;display:inline-flex;align-items:center;justify-content:center}
.dl .sk.z{background:var(--zalia-s);color:var(--zalia)}.dl .sk.m{background:var(--melyna-s);color:var(--melyna)}.dl .sk.g{background:var(--gintaras-s);color:var(--gintaras)}.dl .sk.r{background:var(--raudona-s);color:var(--raudona)}
.dl-senas{margin-left:auto;font-size:12px;color:var(--pilka)}
.dl-f-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:0 0 10px}.dl-chips{display:flex;gap:4px;flex-wrap:wrap}.dl-chip{padding:3px 10px;border:1px solid var(--linija);border-radius:14px;font-size:12px;color:var(--pilka);background:#fff}.dl-chip.on{background:var(--rasalas);color:#fff;border-color:var(--rasalas)}.dl-chip:hover{text-decoration:none}
.dl-f{display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:12px}.dl-f select{font:inherit;font-size:12px;border:1px solid var(--linija);border-radius:5px;padding:2px 6px;background:#fff;color:var(--pilka);max-width:200px;height:26px}.dl-x{font-size:12px}
.dl-tbl{width:100%;border-collapse:collapse;background:var(--popierius);border:1px solid var(--linija);border-radius:8px;overflow:hidden}
.dl-tbl th{font-weight:500;color:var(--pilka);text-align:left;padding:9px 12px;border-bottom:1px solid var(--linija);font-size:12px}.dl-tbl td{padding:10px 12px;border-bottom:1px solid var(--linija);vertical-align:top}.dl-tbl tr:last-child td{border-bottom:0}.dl-tbl tr.eil:hover td{background:#FAFBFA;cursor:pointer}.dl-tbl tr.eil.on td{background:#F3F7F4}
.dl-tbl td.d{text-align:right;white-space:nowrap}.dl-it{margin:1px 0}
.dl-pill{display:inline-block;margin-top:3px;padding:1px 7px;border-radius:10px;font-size:11px;font-weight:500}.dl-pill-e{background:var(--fonas);color:var(--pilka)}
.dl-note{margin-top:5px;font-size:12.5px;background:var(--gintaras-s);color:#7a4b00;padding:4px 8px;border-radius:5px}
.dl .v{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--linija);background:var(--popierius);border-radius:6px;padding:6px 12px;font-weight:500;white-space:nowrap;color:var(--rasalas);line-height:1.2}.dl .v.p{background:var(--zalia);border-color:var(--zalia);color:#fff}.dl .v.p:hover{background:#25683F;text-decoration:none}.dl .v:hover{border-color:var(--rasalas);text-decoration:none}.dl .v.t{border:0;color:var(--melyna);padding:6px 4px}.dl .v.bad{background:var(--raudona);border-color:var(--raudona);color:#fff}.dl .v.raud{color:var(--raudona)}.dl .v[disabled]{opacity:.45;cursor:default}
.dl td.d .v{white-space:normal;text-align:center;max-width:170px}
.dl-riba{display:inline-block;margin-top:4px;color:var(--pilka)}.dl-riba-skuba{color:var(--raudona);font-weight:600}.dl-riba-praejo{opacity:.6}
.dl .takelis{margin-top:6px;font-size:12px;display:flex;flex-wrap:wrap;align-items:center;gap:4px}.dl .takelis span{padding:1px 7px;border-radius:9px;background:var(--fonas);color:var(--pilka)}.dl .takelis span.done{background:var(--zalia-s);color:var(--zalia)}.dl .takelis span.now{background:var(--rasalas);color:#fff;font-weight:600}.dl .takelis span.wait{background:var(--gintaras-s);color:var(--gintaras)}.dl .takelis span.bad{background:var(--raudona-s);color:var(--raudona);font-weight:600}.dl .takelis i{color:var(--linija);font-style:normal}
.dl-naujas{font-size:10.5px;padding:1px 6px;vertical-align:middle}.dl-siandien{color:var(--zalia);font-weight:600}
.dl-tbl-k{border:0;border-radius:0;margin:6px 0 10px}.dl-tbl-k td{padding:8px 6px}.dl-zingsniai-k{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.dl-zingsniai-k .zn{width:22px;height:22px;border-radius:50%;background:var(--zalia-s);color:var(--zalia);display:inline-flex;align-items:center;justify-content:center;font-weight:600;font-size:12px;flex:none}
.dl-inl{display:contents}.dl-laisko-nust{flex-basis:100%;display:flex;gap:14px;flex-wrap:wrap;align-items:center;font-size:12.5px;color:var(--pilka);margin-top:4px}.dl-tk-blk{border-top:1px solid var(--linija);padding-top:10px;margin-top:10px}.dl-tk-blk h3{margin:0 0 6px;font-size:14px;font-weight:600;display:flex;gap:8px;align-items:center;flex-wrap:wrap}.dl-tk-blk .dl-tbl-k{margin-bottom:8px}
.dl-tk-prist{flex-basis:100%;display:flex;gap:12px;flex-wrap:wrap;align-items:center;font-size:12.5px;margin-bottom:4px}.dl-tk-prist input[type=number]{width:64px;font:inherit;border:1px solid var(--linija);border-radius:5px;padding:2px 6px}
.dl-tk-gauta input[type=number]{width:60px;font:inherit;border:1px solid var(--linija);border-radius:5px;padding:2px 6px}.dl-tk-gauta input[type=text]{width:86px;font:inherit;border:1px solid var(--linija);border-radius:5px;padding:2px 6px}
.dl-laisko-nust input[type=text]{font:inherit;border:1px solid var(--linija);border-radius:5px;padding:3px 8px;min-width:280px}
.dl-perz-t{flex-basis:100%;background:var(--fonas);border-radius:8px;padding:10px 14px;margin-top:8px;font-size:13px;overflow:auto;max-height:420px}.dl .takelis small{font-size:10px;opacity:.7}
.dl-zs{display:flex;flex-direction:column;gap:8px;max-width:860px}.dl-z{display:flex;gap:14px;align-items:center;background:var(--popierius);border:1px solid var(--linija);border-radius:8px;padding:12px 14px}.dl-z.tuscias{opacity:.55}.dl-z .zn{width:26px;height:26px;border-radius:50%;background:var(--zalia-s);color:var(--zalia);display:flex;align-items:center;justify-content:center;font-weight:600;flex:none}.dl-z.tuscias .zn{background:var(--fonas);color:var(--pilka)}.dl-z .zt{flex:1}.dl-z .zt b{display:block}
.dl-siand{margin:0 24px;padding:8px 12px;background:var(--zalia-s);border:1px solid #c9e2d3;border-radius:8px;display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;font-size:13px}.dl-siand>b{color:var(--zalia)}.dl-siand-u{display:inline-flex;gap:6px;align-items:center;color:var(--rasalas);padding:3px 8px;border-radius:6px;background:#fff;border:1px solid var(--linija)}.dl-siand-u:hover{text-decoration:none;border-color:var(--zalia)}.dl-kur{color:var(--zalia)}
.dl-paprasta th:first-child{width:34%}.dl-paprasta td{padding:11px 12px}.dl-f-tog{font-size:12px;color:var(--pilka)}.dl-f-tog.on{color:var(--zalia);font-weight:600}.dl-f-wrap{margin-top:6px}
.dl-n .nr{font-weight:700}.dl-nz{display:inline-block;background:var(--rasalas);color:#fff;font-size:10px;padding:0 5px;border-radius:3px;vertical-align:middle;margin-left:2px}
.dl-b{display:inline-block;padding:2px 8px;border-radius:10px;font-size:12px;font-weight:600}.b-red{background:var(--raudona-s);color:var(--raudona)}.b-amber{background:var(--gintaras-s);color:var(--gintaras)}.b-blue{background:var(--melyna-s);color:var(--melyna)}.b-green{background:var(--zalia-s);color:var(--zalia)}.b-grey{background:var(--fonas);color:var(--pilka)}
.dl-row-b-red td{background:#fbeeee}.dl-row-b-amber td{background:#fdf5e6}.dl-row-b-blue td{background:#eef3fb}.dl-row-b-green td{background:#eaf5ee}.dl-row-b-grey td{background:#f3f4f3;color:var(--pilka)}
.dl-row-b-red td:first-child{box-shadow:inset 4px 0 0 var(--raudona)}.dl-row-b-amber td:first-child{box-shadow:inset 4px 0 0 var(--gintaras)}.dl-row-b-blue td:first-child{box-shadow:inset 4px 0 0 var(--melyna)}.dl-row-b-green td:first-child{box-shadow:inset 4px 0 0 var(--zalia)}.dl-row-b-grey td:first-child{box-shadow:inset 4px 0 0 #b9bdb9}
.dl-img-s{width:28px;height:28px;object-fit:contain;border:1px solid var(--linija);border-radius:4px;background:#fff;vertical-align:middle;margin-right:1px}.dl-img{width:44px;height:44px;object-fit:contain;border:1px solid var(--linija);border-radius:5px;background:#fff;flex:none;margin-right:8px}.dl-img-n{display:inline-block;background:var(--fonas)}
.dl-tuscia{background:var(--popierius);border:1px dashed var(--linija);border-radius:8px;padding:28px;text-align:center;color:var(--pilka)}.dl-paaisk{color:var(--pilka);font-size:13px;margin-top:10px}
.dl-kortele{background:var(--popierius);border:1px solid var(--linija);border-radius:8px;padding:16px 18px;margin-bottom:14px}.dl-kortele h2{margin:0 0 6px;font-size:16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}.dl-kortele p{margin:6px 0}.dl-kortele .pastaba{color:var(--pilka);font-size:13px}.dl-veiksmai{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.pd-msg{display:flex;align-items:center;gap:10px;padding:10px 24px;font-size:13.5px;border-bottom:1px solid var(--linija);background:#fff}.pd-msg-ok{background:var(--zalia-s);color:var(--zalia)}.pd-msg-info{background:#F1F1EE;color:var(--pilka)}.pd-msg-klaida{background:var(--raudona-s);color:var(--raudona)}.pd-msg-x{margin-left:auto;border:0;background:none;cursor:pointer;color:inherit;opacity:.6}
/* skydas */
.uzdanga{position:fixed;inset:0;background:rgba(27,38,32,.25);z-index:99990;display:none}.uzdanga.on{display:block}
.skydas{position:fixed;top:32px;right:0;bottom:0;width:600px;max-width:100vw;background:var(--popierius);z-index:99991;transform:translateX(100%);transition:transform .18s ease-out;box-shadow:-8px 0 30px rgba(27,38,32,.12);display:flex;flex-direction:column;color:var(--rasalas);font:14px/1.45 "IBM Plex Sans",system-ui,sans-serif}.skydas.on{transform:none}
@media (prefers-reduced-motion:reduce){.skydas{transition:none}}
.skydas header{padding:16px 20px 12px;border-bottom:1px solid var(--linija);display:flex;gap:12px;align-items:flex-start}.skydas header h2{margin:0;font-size:18px}.uzdaryti{margin-left:auto;background:none;border:0;font-size:22px;color:var(--pilka);line-height:1;cursor:pointer}
.skydas .kunas{padding:14px 20px;overflow:auto;flex:1}.skydas .pastaba{color:var(--pilka);font-size:13px;margin-bottom:6px}
.skydas .eilute{padding:10px 0;border-bottom:1px solid var(--linija)}.skydas .eilute:last-child{border-bottom:0}.skydas .virsus{display:flex;gap:10px;align-items:baseline}.skydas .k{width:30px;text-align:right;color:var(--pilka)}.skydas .p{flex:1;font-weight:500}
.skydas .keliai{display:flex;gap:6px;margin:8px 0 6px 40px;flex-wrap:wrap}.skydas .keliai a,.skydas .keliai span.kb{border:1px solid var(--linija);background:var(--popierius);border-radius:6px;padding:5px 10px;color:var(--pilka);display:inline-flex;gap:6px;align-items:center;font-size:13px}
.skydas .keliai a:hover{text-decoration:none;border-color:var(--rasalas)}.skydas .keliai .on.sandelis{border-color:var(--zalia);background:var(--zalia-s);color:var(--zalia);font-weight:600}.skydas .keliai .on.tk{border-color:var(--melyna);background:var(--melyna-s);color:var(--melyna);font-weight:600}.skydas .keliai .on.ts{border-color:var(--gintaras);background:var(--gintaras-s);color:var(--gintaras);font-weight:600}
.skydas .keliai .ne{opacity:.4;cursor:not-allowed}.skydas .keliai i{width:7px;height:7px;border-radius:50%;background:currentColor;display:inline-block}
.skydas .zingsneliai{margin:6px 0 0 40px;display:flex;gap:6px;flex-wrap:wrap;font-size:12px}.skydas .zingsneliai span{padding:2px 8px;border-radius:10px;background:var(--fonas);color:var(--pilka)}.skydas .zingsneliai span.ok{background:var(--zalia-s);color:var(--zalia)}.skydas .zingsneliai span.dabar{background:var(--rasalas);color:#fff}
.skydas .kodel{margin-left:40px;font-size:12px;color:var(--pilka)}.skydas .lock{margin-left:40px;font-size:12px;color:var(--gintaras)}
.skydas .blokas{background:var(--fonas);border-radius:8px;padding:10px 12px;margin:10px 0}.skydas .blokas b{display:block;font-size:12px;color:var(--pilka);font-weight:500;margin-bottom:3px}
.skydas .dl-klaus{background:var(--raudona-s);color:var(--raudona);border-radius:8px;padding:8px 12px;margin:0 0 10px;font-size:13px}
.skydas footer{padding:12px 20px;border-top:1px solid var(--linija);display:flex;gap:8px;flex-wrap:wrap;align-items:center}.skydas .zurnalas{font-size:12px;color:var(--pilka)}.skydas .zurnalas ol{margin:0;padding-left:16px}.skydas .zurnalas li{padding:2px 0}.skydas .psuz-klaida{color:var(--raudona)}.skydas .pak input{width:54px;font:inherit;border:1px solid var(--linija);border-radius:5px;padding:2px 6px}
.dl-shade{display:none;position:fixed;inset:0;background:rgba(27,38,32,.45);z-index:100000}.dl-shade.on{display:block}
.dl-dlg{display:none;position:fixed;left:50%;top:38%;transform:translate(-50%,-50%);width:440px;max-width:94vw;background:#fff;border-radius:10px;padding:18px 20px;z-index:100001;box-shadow:0 20px 50px rgba(0,0,0,.25)}
.dl-dlg.on{display:block}.dl-dlg h3{margin:0 0 8px;font-size:15px}.dl-dlg p{margin:0 0 12px;color:var(--pilka);font-size:13.5px}.dl-opt{display:flex;gap:8px;align-items:center;font-size:13px;margin-bottom:14px}.dl-dlg-b{display:flex;justify-content:flex-end;gap:8px}
@media (max-width:820px){.dl-main{padding:10px 10px 60px}.dl-tbl thead{display:none}.dl-tbl,.dl-tbl tbody,.dl-tbl tr{display:block}.dl-tbl td{display:block;border:0;padding:3px 12px}.dl-tbl tr.eil{border-bottom:1px solid var(--linija);padding:8px 0 10px}.dl-tbl td.d{text-align:left;white-space:normal}.skydas{width:100vw;top:46px}.dl-legenda{display:none}}
</style>
		<?php
	}

	protected static function skriptas() {
		?>
<script id="dl-js">
(function(){
	var rows=Array.prototype.slice.call(document.querySelectorAll('.eil[data-json]')), cur=-1;
	var SK=document.getElementById('dlSk'),UZ=document.getElementById('dlUzd'),SH=document.getElementById('dlShade'),DL=document.getElementById('dlDlg'),dlgOn=false,skOn=false;
	var $=function(id){return document.getElementById(id);};
	function esc(s){ return String(s==null?'':s).replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];}); }
	function mark(i){ rows.forEach(function(r,j){ r.classList.toggle('on',j===i); }); cur=i; if(rows[i]) rows[i].scrollIntoView({block:'nearest'}); }
	/* --- dialogas --- */
	function dlg(a){ var d; try{ d=JSON.parse(a.getAttribute('data-d')); }catch(e){ return false; } if(!d) return false;
		$('dlDlgH').textContent=d.antraste||''; $('dlDlgT').textContent=d.tekstas||''; var ok=$('dlDlgOk'); ok.textContent=d.ok||'Gerai'; var url=a.getAttribute('href');
		var L=$('dlDlgOptL'),C=$('dlDlgOpt'),N=$('dlDlgN'); N.style.display='none'; C.style.display='';
		if(d.opt&&d.opt.tipas==='n'){ L.style.display='flex'; C.style.display='none'; N.style.display=''; N.value=d.opt.def||1; $('dlDlgOptT').textContent=d.opt.tekstas; N.oninput=function(){ ok.href=url+'&'+encodeURIComponent(d.opt.vardas)+'='+encodeURIComponent(N.value||1); }; N.oninput(); }
		else if(d.opt){ L.style.display='flex'; $('dlDlgOptT').textContent=d.opt.tekstas; C.checked=!!d.opt.def; C.onchange=function(){ ok.href=url+(C.checked?'&'+encodeURIComponent(d.opt.vardas)+'=1':''); }; C.onchange(); } else { L.style.display='none'; ok.href=url; }
		ok.onclick=function(){ ok.style.pointerEvents='none'; ok.style.opacity='.6'; };
		SH.classList.add('on'); DL.classList.add('on'); dlgOn=true; ok.focus(); return true; }
	function dlgOff(){ SH.classList.remove('on'); DL.classList.remove('on'); dlgOn=false; }
	$('dlDlgNo').onclick=dlgOff; SH.onclick=dlgOff;
	/* --- skydas --- */
	var KC={av:'sandelis',tiesiai:'tk',i_av:'ts'};
	function atidaryti(i){ var r=rows[i]; if(!r) return; var o; try{ o=JSON.parse(r.getAttribute('data-json')); }catch(e){ return; } mark(i);
		$('skNr').textContent='#'+o.nr+(o.uzdarytas?' · '+o.st:''); $('skKl').textContent=o.kl+' · '+o.suma+' · '+o.apmok;
		$('skPastaba').innerHTML='<b class="dl-kur">Dabar: '+esc(o.kur)+'</b><br>'+esc(o.pastaba);
		if(o.matyti){ fetch(ajaxurl+'?action=ps_dl_matyta&id='+o.id+'&n='+encodeURIComponent(o.zn),{credentials:'same-origin'}).catch(function(){}); r.classList.remove('dl-n'); var nb=r.querySelector('.dl-nz'); if(nb) nb.remove(); } var K=$('skKlaus'); if(o.klausimas){ K.style.display='block'; K.textContent='Klausimas: '+o.klausimas; } else K.style.display='none';
		$('skEil').innerHTML=o.eil.map(function(l){ return '<div class="eilute"><div class="virsus">'+(l.img?'<img class="dl-img" src="'+esc(l.img)+'" alt="">':'<span class="dl-img dl-img-n"></span>')+'<div class="k">'+l.q+'×</div><div class="p">'+esc(l.n)+(l.sku?' <span class="pilkas maz">'+esc(l.sku)+'</span>':'')+'</div></div>'
			+'<div class="keliai">'+l.keliai.map(function(k){ var c=KC[k.k]+(k.on?' on':'')+(k.gal||k.on?'':' ne'); var t='<i></i>'+esc(k.t); if(k.u) return '<a class="'+c+'" href="'+esc(k.u)+'" title="Keisti kelią">'+t+'</a>'; return '<span class="kb '+c+'"'+(k.kodel_ne&&!k.on?' title="'+esc(k.kodel_ne)+'"':'')+'>'+t+'</span>'; }).join('')+'</div>'
			+'<div class="kodel">'+esc(l.kodel)+(l.tiek_url?' <a href="'+esc(l.tiek_url)+'">Laukiam iš tiekėjų →</a>':'')+'</div>'+(l.lock?'<div class="lock">Nebekeičiama: '+esc(l.lock)+'</div>':'')
			+(l.zing.length?'<div class="zingsneliai">'+l.zing.map(function(z){ return '<span class="'+z[1]+'">'+(z[1]==='ok'?'✓ ':'')+esc(z[0])+'</span>'; }).join('')+'</div>':'')+'</div>'; }).join('');
		$('skPr').innerHTML=esc(o.vezejas)+(o.vieta?' · '+esc(o.vieta):'')+'<br><span class="pilkas maz">'+esc(o.adresas)+(o.tel?' · '+esc(o.tel):'')+(o.mail?' · '+esc(o.mail):'')+'</span>';
		var S=$('skSiunta'); if(o.pak||o.nr_siuntos.length||o.perreg){ S.style.display='block'; $('skSiuntaT').innerHTML=(o.nr_siuntos.length?'<div>'+o.nr_siuntos.map(esc).join('<br>')+'</div>':'<div class="pilkas maz">siunta dar neregistruota</div>')
			+(o.pak?'<div class="pak" style="margin-top:6px">Dėžių: <input type="number" min="1" max="20" value="'+o.pak.kiek+'" id="skPakN"> <a class="v" id="skPakSave" href="'+esc(o.pak.u)+'">Išsaugoti</a>'+(o.perreg?' <a class="v" href="'+esc(o.perreg)+'" id="skPerreg">Lipdukas iš naujo</a>':'')+'</div>':'');
			var pn=$('skPakN'),ps=$('skPakSave'); if(pn&&ps){ var base=ps.getAttribute('href'); var upd=function(){ ps.href=base+'&n='+encodeURIComponent(pn.value); var pr=$('skPerreg'); if(pr) pr.href=o.perreg+'&n='+encodeURIComponent(pn.value); }; pn.oninput=upd; pn.onkeydown=function(ev){ if(ev.key==='Enter'){ ev.preventDefault(); ps.click(); } }; upd(); } } else S.style.display='none';
		var P=$('skPast'); if(o.pastaba_kl){ P.style.display='block'; $('skPastT').textContent=o.pastaba_kl; } else P.style.display='none';
		$('skZur').innerHTML='<span class="pilkas maz">kraunama…</span>'; fetch(ajaxurl+'?action=ps_dl_zurnalas&id='+o.id+'&n='+encodeURIComponent(o.zn),{credentials:'same-origin'}).then(function(r){return r.json();}).then(function(j){ if(j&&j.success&&$('skNr').textContent.indexOf('#'+o.nr)===0) $('skZur').innerHTML=j.data; }).catch(function(){ $('skZur').textContent='žurnalo įkelti nepavyko'; });
		var f=''; if(o.rusiuoti) f+='<a class="v p" href="'+esc(o.rusiuoti)+'">Surūšiuota</a><span class="pilkas maz">peržiūrėk, iš kur važiuoja prekės, ir patvirtink</span>';
		if(o.btn&&!o.rusiuoti){ if(o.btn.pasyvus) f+='<a class="kel ts" href="'+esc(o.btn.u)+'"><i></i>'+esc(o.btn.t)+'</a>'; else f+='<a class="v p" href="'+esc(o.btn.u)+'"'+(o.btn.d?' data-d="'+esc(JSON.stringify(o.btn.d))+'"':'')+'>'+esc(o.btn.t)+'</a>'; }
		f+='<span style="margin-left:auto"></span><button class="v t" disabled title="dar nepadaryta">Redaguoti</button><button class="v t" disabled title="dar nepadaryta">Sąskaita</button>'+(o.nesurinkta?'<a class="v t" href="'+esc(o.nesurinkta)+'" title="Grąžinti į „Surinkti“">Atšaukti surinkimą</a>':'')+(o.sekimo?'<a class="v t" href="'+esc(o.sekimo)+'">Sekimo numeriai klientui</a>':'')+(o.mail?'<a class="v t" href="mailto:'+esc(o.mail)+'?subject='+encodeURIComponent('Užsakymas #'+o.nr+' — petshop.lt')+'">Parašyti klientui</a>':'')+(o.atsaukti?'<a class="v t raud" href="'+esc(o.atsaukti.u)+'" data-d="'+esc(JSON.stringify(o.atsaukti.d))+'">Atšaukti</a>':'');
		$('skV').innerHTML=f; SK.classList.add('on'); UZ.classList.add('on'); SK.setAttribute('aria-hidden','false'); skOn=true; }
	function uzdaryti(){ SK.classList.remove('on'); UZ.classList.remove('on'); SK.setAttribute('aria-hidden','true'); skOn=false; }
	$('skUzd').onclick=uzdaryti; UZ.onclick=uzdaryti;
	document.addEventListener('click',function(e){
		var a=e.target.closest('a[data-d]'); if(a){ e.preventDefault(); e.stopPropagation(); dlg(a); return; }
		var b=e.target.closest('button[data-atidaryti]'); if(b){ e.preventDefault(); e.stopPropagation(); var r=b.closest('.eil'); if(r) atidaryti(rows.indexOf(r)); return; }
		if(e.target.closest('a,button,input,select,label')) return;
		var r2=e.target.closest('.eil[data-json]'); if(r2) atidaryti(rows.indexOf(r2));
	});
	document.addEventListener('keydown',function(e){
		var tag=(e.target.tagName||'').toLowerCase(); if(tag==='input'||tag==='select'||tag==='textarea'){ if(e.key==='Escape') e.target.blur(); return; }
		if(dlgOn){ if(e.key==='Escape') dlgOff(); return; }
		if(e.key==='Escape'){ if(skOn) uzdaryti(); else { var q=$('psjQ'); if(q&&q.value) q.value=''; } return; }
		if(e.key==='j'||e.key==='ArrowDown'){ e.preventDefault(); var n=Math.min(rows.length-1,cur+1); if(skOn) atidaryti(n); else mark(n); }
		else if(e.key==='k'||e.key==='ArrowUp'){ e.preventDefault(); var p=Math.max(0,cur-1); if(skOn) atidaryti(p); else mark(p); }
		else if(e.key==='Enter'){ if(cur>=0){ e.preventDefault(); atidaryti(cur); } }
		else if(e.key==='x'){ if(skOn) uzdaryti(); mark(Math.min(rows.length-1,cur+1)); }
		else if(e.key==='/'){ var q2=$('psjQ'); if(q2){ e.preventDefault(); q2.focus(); q2.select(); } }
	});
	document.addEventListener('click',function(e){ var k=e.target.closest('.dl-kopijuoti'); if(k){ e.stopPropagation(); var t=k.getAttribute('data-tsv'); (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){ k.textContent='Nukopijuota'; setTimeout(function(){k.textContent='Kopijuoti';},1500); }).catch(function(){ window.prompt('Nukopijuok:',t); }); return; }
		var p=e.target.closest('.dl-perz'); if(p){ e.stopPropagation(); var f=p.closest('form'); var d=f&&f.querySelector('.dl-perz-t'); if(d){ d.style.display=d.style.display==='none'?'block':'none'; } return; }
		var b=e.target.closest('a[data-blank]'); if(b){ setTimeout(function(){ location.reload(); },1500); } },true);
	var ft=document.querySelector('.dl-f-tog'); if(ft){ ft.addEventListener('click',function(e){ e.preventDefault(); var w=document.querySelector('.dl-f-wrap'); if(w){ w.style.display=w.style.display==='none'?'block':'none'; } }); }
	try{ var u=new URL(location.href); if(u.searchParams.has('pd_ok')||u.searchParams.has('atidaryti')){ ['pd_ok','pd_nr','atidaryti'].forEach(function(k){u.searchParams.delete(k);}); history.replaceState(null,'',u.toString()); } }catch(e){}
	var at=parseInt(document.getElementById('dl').getAttribute('data-atid'),10)||0;
	if(at){ var i=rows.findIndex(function(r){ return parseInt(r.getAttribute('data-id'),10)===at; }); if(i>=0) atidaryti(i); }
	else if(rows.length) mark(0);
	/* Auto-atnaujinimas 60 s — tik kai langas matomas, skydelis ir dialogas uždaryti (F2). */
	setInterval(function(){ if(document.visibilityState==='visible'&&!dlgOn&&!skOn&&document.activeElement===document.body){ location.reload(); } },60000);
})();
</script>
		<?php
	}
}
Petshop_Darbalaukis::init();
