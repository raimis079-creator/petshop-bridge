<?php
/**
 * Petshop Analitika v1.0.1 (S1676, 2026-09-12, Raimis: „langas analitinis — jau susisteminta informacija, kad nereikėtų grįžti“)
 *
 * admin.php?page=ps-analitika (po petshop-reports). Ne skaičių lentelė, o blokai: skaičius + norma + VERDIKTAS + ką daryti.
 * Šaltiniai: ps_carts, ps_email_jobs, ps_fakt_uzsakymai, ps_fakt_reklama, ps_fakt_siuntos. Periodas 30 / 90 d.
 * Blokai: Krepšeliai · Reklama (Ads) · Klientai · Pristatymas · Laiškai. Kol duomenų mažai (n < riba) — verdiktas „dar mažai duomenų“, ne spėjimas.
 * v1.0.1: Reklamos blokas skaičiuoja tik nuo pirmo fakt užsakymo (T-0) — senos svetainės Ads išlaidos neįtraukiamos.
 * Slenksčiai (norma) — Claude pradinis nustatymas, Raimis taiso: SLENKSCIAI masyvas.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

final class Petshop_Analitika {
	const VER = '1.0.1';
	const TEVAS = 'petshop-reports';
	const PUSLAPIS = 'ps-analitika';
	const SLENKSCIAI = array(
		'krep_santykis_ok' => 4.0,  // apleisti/užsakymai — iki 4 normalu, virš 6 raudona
		'krep_santykis_bad' => 6.0,
		'krep_min' => 20,
		'ads_roas_lūžis' => 4.5,   // vidutinis lūžio ROAS (PMAX_A: 25–35 % antkainis su fulfillment ≈ 5,3–7,7; sausas maistas lūžis ~4,5 su mišriu krepšeliu)
		'ads_min_spend_ct' => 5000,
		'klientai_grizt_ok' => 0.30, // grįžtančių dalis nuo užsakymų
		'klientai_min' => 30,
		'pristatymas_dienos_ok' => 2.5,
		'pristatymas_min' => 10,
		'laiskai_consent_ok' => 0.5,
	);

	public static function init() { add_action( 'admin_menu', array( __CLASS__, 'meniu' ), 30 ); }
	public static function meniu() { add_submenu_page( self::TEVAS, 'Analitika', 'Analitika', 'manage_woocommerce', self::PUSLAPIS, array( __CLASS__, 'puslapis' ) ); }

	protected static function d() { $d = isset( $_GET['d'] ) ? (int) $_GET['d'] : 30; return in_array( $d, array( 30, 90 ), true ) ? $d : 30; }
	protected static function nuo( $d ) { return gmdate( 'Y-m-d H:i:s', time() - $d * DAY_IN_SECONDS ); }
	protected static function eur( $ct ) { return number_format( $ct / 100, 2, ',', ' ' ) . ' €'; }

	/* ---------- Duomenys ---------- */

	public static function krepseliai( $d ) {
		global $wpdb; $p = $wpdb->prefix; $nuo = self::nuo( $d ); $S = self::SLENKSCIAI;
		$r = $wpdb->get_row( $wpdb->prepare( "SELECT SUM(status IN ('abandoned','expired')) apl, SUM(status='converted') konv, SUM(status IN ('abandoned','expired') AND email<>'' AND email IS NOT NULL) su_el FROM {$p}ps_carts WHERE status_changed_at>=%s", $nuo ), ARRAY_A );
		$apl = (int) $r['apl']; $konv = (int) $r['konv']; $su_el = (int) $r['su_el'];
		$jobs = $wpdb->get_results( $wpdb->prepare( "SELECT j.id, j.sent_at, j.recipient_email, j.payload, c.converted_order_id FROM {$p}ps_email_jobs j LEFT JOIN {$p}ps_carts c ON c.cart_id=SUBSTRING_INDEX(SUBSTRING_INDEX(j.job_key,':',2),':',-1) AND c.converted_order_id IS NOT NULL AND c.status_changed_at>j.sent_at WHERE j.flow LIKE 'cart_abandoned%%' AND j.status='sent' AND j.sent_at>=%s", $nuo ), ARRAY_A );
		$siusta = count( $jobs ); $grizo = 0; $grizo_ct = 0;
		foreach ( $jobs as $j ) { if ( $j['converted_order_id'] ) { $grizo++; $grizo_ct += (int) $wpdb->get_var( $wpdb->prepare( "SELECT viso_ct FROM {$p}ps_fakt_uzsakymai WHERE uzsakymas_id=%d", $j['converted_order_id'] ) ); } }
		$praleista = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$p}ps_email_jobs WHERE flow LIKE 'cart_abandoned%%' AND status='skipped' AND skip_reason='consent_missing' AND created_at>=%s", $nuo ) );
		// top paliktos prekės
		$snaps = $wpdb->get_col( $wpdb->prepare( "SELECT snapshot_json FROM {$p}ps_carts WHERE status IN ('abandoned','expired') AND status_changed_at>=%s", $nuo ) );
		$cnt = array(); foreach ( $snaps as $s ) { $a = json_decode( $s, true ); if ( ! is_array( $a ) ) { continue; } $seen = array(); foreach ( $a as $it ) { $pid = (int) ( $it['product_id'] ?? 0 ); if ( $pid && empty( $seen[ $pid ] ) ) { $seen[ $pid ] = 1; $cnt[ $pid ] = ( $cnt[ $pid ] ?? 0 ) + 1; } } }
		arsort( $cnt ); $top = array();
		foreach ( array_slice( $cnt, 0, 8, true ) as $pid => $n ) { $pr = wc_get_product( $pid ); if ( ! $pr ) { continue; } $top[] = array( 'pid' => $pid, 'n' => $n, 'pav' => $pr->get_name(), 'kaina' => $pr->get_price(), 'yra' => $pr->is_in_stock(), 'url' => get_edit_post_link( $pid ) ); }
		$sant = $konv > 0 ? $apl / $konv : null;
		if ( $apl + $konv < $S['krep_min'] ) { $v = array( 'pilka', 'Dar mažai duomenų (' . ( $apl + $konv ) . ' krepšelių).', '' ); }
		elseif ( null === $sant || $sant > $S['krep_santykis_bad'] ) { $v = array( 'raudona', 'Apleidžiama ' . ( null === $sant ? '∞' : number_format( $sant, 1, ',', '' ) ) . '× daugiau nei perkama — virš normos.', 'Tikrinti kasą: pristatymo kaina, mokėjimo langas, klaidos mobiliame. Žr. Lankomumas → piltuvėlis.' ); }
		elseif ( $sant > $S['krep_santykis_ok'] ) { $v = array( 'geltona', 'Santykis ' . number_format( $sant, 1, ',', '' ) . ' — kiek virš normos (iki ' . $S['krep_santykis_ok'] . ').', 'Stebėti; jei auga — kasos peržiūra.' ); }
		else { $v = array( 'zalia', 'Santykis ' . number_format( $sant, 1, ',', '' ) . ' — normalu.', '' ); }
		$el_dalis = $apl ? $su_el / $apl : 0;
		$laisk = $siusta ? ( $grizo ? 'Laiškai atsiperka: ' . $grizo . ' iš ' . $siusta . ' grįžo ir pirko (' . self::eur( $grizo_ct ) . ').' : 'Iš ' . $siusta . ' laiškų nė vienas nevirto pirkimu — ' . ( $siusta >= 15 ? 'tekstą / laiką keisti arba nustoti siųsti.' : 'dar mažai laiškų, vertinti vėliau.' ) ) : 'Laiškų dar nesiųsta.';
		$consent = $praleista + $siusta > 0 ? 'Sutikimą turi ' . round( 100 * $siusta / ( $praleista + $siusta ) ) . ' % (praleista dėl sutikimo ' . $praleista . ').' . ( $siusta / max( 1, $praleista + $siusta ) < $S['laiskai_consent_ok'] ? ' → verta rinkti sutikimą kasoje matomiau.' : '' ) : '';
		return array( 'kpi' => array( 'Apleista' => $apl, 'Virto užsakymais' => $konv, 'Santykis' => null === $sant ? '—' : number_format( $sant, 1, ',', '' ) . ' (norma ≤ ' . $S['krep_santykis_ok'] . ')', 'Apleistų su el. paštu' => $apl ? round( 100 * $el_dalis ) . ' %' : '—', 'Laiškų išsiųsta / grįžo pirkti' => $siusta . ' / ' . $grizo ), 'verdiktas' => $v, 'papildomai' => array_filter( array( $laisk, $consent ) ), 'top' => $top );
	}

	public static function reklama( $d ) {
		global $wpdb; $p = $wpdb->prefix; $nuo = gmdate( 'Y-m-d', time() - $d * DAY_IN_SECONDS ); $S = self::SLENKSCIAI;
		$pirmas = $wpdb->get_var( "SELECT MIN(diena) FROM {$p}ps_fakt_uzsakymai WHERE testinis=0" ); if ( $pirmas && $pirmas > $nuo ) { $nuo = $pirmas; }
		$r = $wpdb->get_row( $wpdb->prepare( "SELECT SUM(islaidos_ct) isl, SUM(paspaudimai) kl, SUM(konversijos) konv FROM {$p}ps_fakt_reklama WHERE diena>=%s AND kanalas='google_ads'", $nuo ), ARRAY_A );
		$u = $wpdb->get_row( $wpdb->prepare( "SELECT COUNT(*) n, SUM(viso_ct) viso, SUM(marza_ct) marza, SUM(kontribucija_ct) kontr FROM {$p}ps_fakt_uzsakymai WHERE diena>=%s AND testinis=0 AND apmoketa_at IS NOT NULL AND (kanalas_pirmas='mokamas' OR kanalas_paskutinis='mokamas' OR gclid=1)", $nuo ), ARRAY_A );
		$isl = (int) $r['isl']; $viso = (int) $u['viso']; $marza = (int) $u['marza']; $n = (int) $u['n'];
		$roas = $isl ? $viso / $isl : null; $pelnas = $marza - $isl;
		$kamp = $wpdb->get_results( $wpdb->prepare( "SELECT kampanija, SUM(islaidos_ct) isl, SUM(paspaudimai) kl, SUM(konversijos) konv FROM {$p}ps_fakt_reklama WHERE diena>=%s AND kanalas='google_ads' GROUP BY kampanija HAVING isl>0 ORDER BY isl DESC", $nuo ), ARRAY_A );
		if ( $isl < $S['ads_min_spend_ct'] ) { $v = array( 'pilka', 'Išlaidų per mažai (' . self::eur( $isl ) . ') vertinti.', '' ); }
		elseif ( $pelnas < 0 ) { $v = array( 'raudona', 'Reklama NUOSTOLINGA: marža iš Ads užsakymų ' . self::eur( $marza ) . ' < išlaidos ' . self::eur( $isl ) . ' (' . self::eur( $pelnas ) . ').', 'Mažinti biudžetą arba siaurinti į pelningas grupes (PMax D). Tikrinti, ar konversijos apskritai matomos Ads (S1668 301 pamoka).' ); }
		elseif ( null !== $roas && $roas < $S['ads_roas_lūžis'] ) { $v = array( 'geltona', 'ROAS ' . number_format( $roas, 1, ',', '' ) . ' — ties lūžiu (' . $S['ads_roas_lūžis'] . '), marža dengia išlaidas, bet pelno beveik nėra.', 'Biudžeto nekelti. Ratchet tROAS.' ); }
		else { $v = array( 'zalia', 'Reklama pelninga: ROAS ' . number_format( $roas, 1, ',', '' ) . ', pelnas po išlaidų ' . self::eur( $pelnas ) . '.', 'Galima svarstyti biudžeto kėlimą pelningoms grupėms.' ); }
		return array( 'kpi' => array( 'Išlaidos' => self::eur( $isl ), 'Užsakymai iš Ads (apmokėti)' => $n, 'Pajamos iš Ads' => self::eur( $viso ), 'ROAS' => null === $roas ? '—' : number_format( $roas, 2, ',', '' ) . ' (lūžis ' . $S['ads_roas_lūžis'] . ')', 'Marža iš Ads − išlaidos' => self::eur( $pelnas ), 'Paspaudimai / Ads konversijos' => (int) $r['kl'] . ' / ' . (float) $r['konv'] ), 'verdiktas' => $v, 'papildomai' => array( 'Skaičiuojama nuo ' . $nuo . ' (naujos svetainės pradžia).', 'Kanalas nustatomas iš pirmo/paskutinio prisilietimo arba gclid (48 val. WC sesija — dalis Ads pirkėjų tampa „organic“).' ), 'kamp' => $kamp );
	}

	public static function klientai( $d ) {
		global $wpdb; $p = $wpdb->prefix; $nuo = gmdate( 'Y-m-d', time() - $d * DAY_IN_SECONDS ); $S = self::SLENKSCIAI;
		$r = $wpdb->get_row( $wpdb->prepare( "SELECT COUNT(*) n, SUM(klientas_naujas=1) nauji, SUM(klientas_naujas=0) grizt, AVG(viso_ct) vid, AVG(CASE WHEN klientas_naujas=0 THEN dienos_nuo_ankstesnio END) dienos, SUM(marza_ct) marza, SUM(viso_ct) viso FROM {$p}ps_fakt_uzsakymai WHERE diena>=%s AND testinis=0 AND apmoketa_at IS NOT NULL", $nuo ), ARRAY_A );
		$n = (int) $r['n']; $g = (int) $r['grizt']; $dalis = $n ? $g / $n : 0;
		if ( $n < $S['klientai_min'] ) { $v = array( 'pilka', 'Dar mažai užsakymų (' . $n . ').', '' ); }
		elseif ( $dalis < $S['klientai_grizt_ok'] ) { $v = array( 'geltona', 'Grįžtančių tik ' . round( 100 * $dalis ) . ' % (norma ≥ ' . round( 100 * $S['klientai_grizt_ok'] ) . ' %) — verslas laikosi ant naujų pirkėjų, o tai brangiausia.', 'Pakartotinio pirkimo kelias: papildymo priminimai (refill), post-purchase laiškai, augintinio anketa.' ); }
		else { $v = array( 'zalia', 'Grįžtančių ' . round( 100 * $dalis ) . ' % — sveika bazė.', '' ); }
		return array( 'kpi' => array( 'Apmokėtų užsakymų' => $n, 'Nauji / grįžtantys' => (int) $r['nauji'] . ' / ' . $g, 'Vidutinis krepšelis' => self::eur( (int) $r['vid'] ), 'Vid. dienų tarp grįžtančio pirkimų' => $r['dienos'] ? round( $r['dienos'] ) : '—', 'Marža (bendra)' => self::eur( (int) $r['marza'] ) . ( $r['viso'] ? ' (' . round( 100 * $r['marza'] / $r['viso'] ) . ' % nuo pajamų)' : '' ) ), 'verdiktas' => $v, 'papildomai' => array() );
	}

	public static function pristatymas( $d ) {
		global $wpdb; $p = $wpdb->prefix; $nuo = gmdate( 'Y-m-d', time() - $d * DAY_IN_SECONDS ); $S = self::SLENKSCIAI;
		$r = $wpdb->get_row( $wpdb->prepare( "SELECT COUNT(*) n, AVG(dienos_iki_pristatymo) dien, SUM(problema_kodas IS NOT NULL AND problema_kodas<>'') prob, SUM(kaina_vezejo_ct) kaina FROM {$p}ps_fakt_siuntos WHERE diena>=%s AND testinis=0", $nuo ), ARRAY_A );
		$u = $wpdb->get_row( $wpdb->prepare( "SELECT SUM(pristatymas_paimta_ct) paimta, SUM(pristatymas_savikaina_ct) sav FROM {$p}ps_fakt_uzsakymai WHERE diena>=%s AND testinis=0 AND apmoketa_at IS NOT NULL", $nuo ), ARRAY_A );
		$n = (int) $r['n']; $paimta = (int) $u['paimta']; $sav = (int) ( $u['sav'] ?: $r['kaina'] ); $skirt = $paimta - $sav;
		$vez = $wpdb->get_results( $wpdb->prepare( "SELECT vezejas, COUNT(*) n, AVG(dienos_iki_pristatymo) dien FROM {$p}ps_fakt_siuntos WHERE diena>=%s AND testinis=0 GROUP BY vezejas", $nuo ), ARRAY_A );
		if ( $n < $S['pristatymas_min'] ) { $v = array( 'pilka', 'Dar mažai siuntų (' . $n . ').', '' ); }
		elseif ( $r['dien'] && $r['dien'] > $S['pristatymas_dienos_ok'] ) { $v = array( 'geltona', 'Vidutiniškai ' . number_format( $r['dien'], 1, ',', '' ) . ' d. iki pristatymo (norma ≤ ' . $S['pristatymas_dienos_ok'] . ').', 'Žiūrėti pagal vežėją žemiau; VF dropship kelias lėčiausias.' ); }
		elseif ( $skirt < 0 && $sav > 0 ) { $v = array( 'geltona', 'Pristatymas subsidijuojamas: iš klientų paimta ' . self::eur( $paimta ) . ', vežėjams ' . self::eur( $sav ) . ' (' . self::eur( $skirt ) . ').', 'Peržiūrėti nemokamo pristatymo slenkstį / tarifus.' ); }
		else { $v = array( 'zalia', 'Pristatymas laiku' . ( $r['dien'] ? ' (' . number_format( $r['dien'], 1, ',', '' ) . ' d.)' : '' ) . ', kaina padengta.', '' ); }
		return array( 'kpi' => array( 'Siuntų' => $n, 'Vid. dienų iki pristatymo' => $r['dien'] ? number_format( $r['dien'], 1, ',', '' ) : '— (dar nepildoma)', 'Su problema' => (int) $r['prob'], 'Paimta iš klientų / vežėjams' => self::eur( $paimta ) . ' / ' . ( $sav ? self::eur( $sav ) : '— (savikaina dar nepildoma)' ) ), 'verdiktas' => $v, 'papildomai' => array(), 'vez' => $vez );
	}

	public static function laiskai( $d ) {
		global $wpdb; $p = $wpdb->prefix; $nuo = self::nuo( $d );
		$rows = $wpdb->get_results( $wpdb->prepare( "SELECT flow, SUM(status='sent') s, SUM(status='skipped') sk, SUM(status IN ('dead','failed')) d, SUM(opened_at IS NOT NULL) op FROM {$p}ps_email_jobs WHERE created_at>=%s GROUP BY flow ORDER BY s DESC", $nuo ), ARRAY_A );
		$dead = 0; foreach ( $rows as $x ) { $dead += (int) $x['d']; }
		$v = $dead ? array( 'geltona', $dead . ' laiškų nepavyko išsiųsti.', 'Žr. ps_email_jobs last_error; Sender tokenai / SMTP.' ) : array( 'zalia', 'Siuntimo klaidų nėra.', '' );
		return array( 'kpi' => array(), 'verdiktas' => $v, 'papildomai' => array( 'Užsakymų laiškai (apmokėta/išsiųsta) eina per WC ir čia nesiskaičiuoja — čia tik srautai per dispatch.' ), 'rows' => $rows );
	}

	/* ---------- UI ---------- */

	protected static function blokas( $pav, $b, $pastaba = '' ) {
		$sp = array( 'zalia' => '#1f7a3a', 'geltona' => '#b8860b', 'raudona' => '#b32d2e', 'pilka' => '#777' ); $bg = array( 'zalia' => '#eaf5ee', 'geltona' => '#fdf5e6', 'raudona' => '#fbeeee', 'pilka' => '#f3f4f3' );
		$k = $b['verdiktas'][0];
		echo '<section class="psa-b" style="border-left:5px solid ' . $sp[ $k ] . '"><h2>' . esc_html( $pav ) . '</h2>';
		echo '<div class="psa-v" style="background:' . $bg[ $k ] . ';color:' . $sp[ $k ] . '"><b>' . esc_html( $b['verdiktas'][1] ) . '</b>' . ( $b['verdiktas'][2] ? '<div class="psa-do">→ ' . esc_html( $b['verdiktas'][2] ) . '</div>' : '' ) . '</div>';
		if ( $b['kpi'] ) { echo '<table class="psa-k">'; foreach ( $b['kpi'] as $l => $val ) { echo '<tr><td>' . esc_html( $l ) . '</td><td><b>' . esc_html( $val ) . '</b></td></tr>'; } echo '</table>'; }
		foreach ( $b['papildomai'] as $t ) { echo '<p class="psa-p">' . esc_html( $t ) . '</p>'; }
		if ( ! empty( $b['top'] ) ) { echo '<h3>Dažniausiai paliekama krepšelyje</h3><table class="psa-t"><tr><th>Kartų</th><th>Prekė</th><th>Kaina</th><th>Likutis</th></tr>'; foreach ( $b['top'] as $t ) { echo '<tr><td>' . (int) $t['n'] . '</td><td><a href="' . esc_url( $t['url'] ) . '">' . esc_html( $t['pav'] ) . '</a></td><td>' . esc_html( $t['kaina'] ) . ' €</td><td>' . ( $t['yra'] ? 'yra' : '<b style="color:#b32d2e">nėra</b>' ) . '</td></tr>'; } echo '</table><p class="psa-p">Jei ta pati prekė kartojasi — tikrinti kainą / pristatymo slenkstį tai sumai; jei likučio nėra — klientas negalėjo užbaigti.</p>'; }
		if ( ! empty( $b['kamp'] ) ) { echo '<h3>Pagal kampaniją</h3><table class="psa-t"><tr><th>Kampanija</th><th>Išlaidos</th><th>Paspaud.</th><th>Ads konv.</th></tr>'; foreach ( $b['kamp'] as $k2 ) { echo '<tr><td>' . esc_html( $k2['kampanija'] ) . '</td><td>' . esc_html( self::eur( (int) $k2['isl'] ) ) . '</td><td>' . (int) $k2['kl'] . '</td><td>' . (float) $k2['konv'] . '</td></tr>'; } echo '</table>'; }
		if ( ! empty( $b['vez'] ) ) { echo '<h3>Pagal vežėją</h3><table class="psa-t"><tr><th>Vežėjas</th><th>Siuntų</th><th>Vid. d.</th></tr>'; foreach ( $b['vez'] as $k2 ) { echo '<tr><td>' . esc_html( $k2['vezejas'] ) . '</td><td>' . (int) $k2['n'] . '</td><td>' . ( $k2['dien'] ? number_format( $k2['dien'], 1, ',', '' ) : '—' ) . '</td></tr>'; } echo '</table>'; }
		if ( ! empty( $b['rows'] ) ) { echo '<table class="psa-t"><tr><th>Srautas</th><th>Išsiųsta</th><th>Praleista</th><th>Klaida</th><th>Atidaryta</th></tr>'; foreach ( $b['rows'] as $k2 ) { echo '<tr><td>' . esc_html( $k2['flow'] ) . '</td><td>' . (int) $k2['s'] . '</td><td>' . (int) $k2['sk'] . '</td><td>' . (int) $k2['d'] . '</td><td>' . (int) $k2['op'] . '</td></tr>'; } echo '</table>'; }
		if ( $pastaba ) { echo '<p class="psa-p">' . esc_html( $pastaba ) . '</p>'; }
		echo '</section>';
	}

	public static function puslapis() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { return; }
		$d = self::d(); $u = admin_url( 'admin.php?page=' . self::PUSLAPIS );
		echo '<style>.psa{max-width:1100px}.psa-b{background:#fff;border:1px solid #dcdcde;border-radius:6px;padding:14px 18px;margin:14px 0}.psa-b h2{margin:0 0 10px;font-size:17px}.psa-b h3{font-size:13px;margin:14px 0 6px;color:#555}.psa-v{padding:10px 12px;border-radius:5px;font-size:14px;margin-bottom:10px}.psa-do{margin-top:4px;font-weight:normal}.psa-k td{padding:3px 14px 3px 0;font-size:13px}.psa-t{border-collapse:collapse;font-size:13px}.psa-t th,.psa-t td{border-bottom:1px solid #eee;padding:4px 12px 4px 0;text-align:left}.psa-p{color:#666;font-size:12px;margin:6px 0}.psa-per a{margin-right:10px}.psa-per b{margin-right:10px}</style>';
		echo '<div class="wrap psa"><h1>Analitika <span style="font-size:12px;color:#888">v' . self::VER . '</span></h1>';
		echo '<p class="psa-per">Periodas: '; foreach ( array( 30, 90 ) as $x ) { echo $x === $d ? '<b>' . $x . ' d.</b>' : '<a href="' . esc_url( add_query_arg( 'd', $x, $u ) ) . '">' . $x . ' d.</a>'; } echo '</p>';
		echo '<p class="psa-p">Kiekvienas blokas: skaičiai + norma + verdiktas + ką daryti. Žalia — nieko daryti nereikia. Slenksčiai pradiniai (Claude), taisomi.</p>';
		self::blokas( 'Reklama (Google Ads)', self::reklama( $d ) );
		self::blokas( 'Krepšeliai', self::krepseliai( $d ) );
		self::blokas( 'Klientai ir marža', self::klientai( $d ) );
		self::blokas( 'Pristatymas', self::pristatymas( $d ) );
		self::blokas( 'Laiškų srautai', self::laiskai( $d ) );
		echo '</div>';
	}
}
Petshop_Analitika::init();
