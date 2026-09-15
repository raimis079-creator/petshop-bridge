<?php
/**
 * Plugin Name: Petshop Q4 plano langas (vartai E)
 * Description: S1685 (Q4 planas v1.2, vartai E — matavimas): admin.php?page=ps-planas po petshop-reports. Analitikos lango principu (skaičius + norma + verdiktas + ką daryti), ne statistika dėl statistikos. Blokai: N — nauji maisto klientai vs trajektorija; CAC — Ads išlaidos / nauji iš Ads vs €12 / €35 stop; kanalai — naujų klientų šaltiniai; R_due — refill terminų grįžimas vs 22 %; refill laiškai — išsiųsta / atidėta / konversija. Šaltiniai: ps_fakt_uzsakymai, ps_fakt_eilutes, ps_fakt_reklama, ps_refill_tracking, ps_email_jobs. Nuo T-0 (2026-09-09).
 * Version: 1.0.0
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

final class Petshop_Planas_Langas {
	const VER = '1.0.0'; const TEVAS = 'petshop-reports'; const PUSLAPIS = 'ps-planas'; const T0 = '2026-09-09';
	/** Q4 planas v1.2: bazinė N trajektorija per ketvirtį (nauji maisto klientai) ir guardrails. */
	const N_KETV = array( '2026-4' => 120, '2027-1' => 160, '2027-2' => 200, '2027-3' => 230, '2027-4' => 250 );
	const CAC_OK_CT = 1200; const CAC_STOP_CT = 3500; const R_DUE_TIKSLAS = 0.22; const R_DUE_MIN_N = 10; const R_DUE_LANGAS = 14; // d. po termino

	public static function init() { add_action( 'admin_menu', array( __CLASS__, 'meniu' ), 30 ); }
	public static function meniu() { add_submenu_page( self::TEVAS, 'Q4 planas', 'Q4 planas', 'manage_woocommerce', self::PUSLAPIS, array( __CLASS__, 'puslapis' ) ); }
	private static function eur( $ct ) { return number_format( $ct / 100, 0, ',', ' ' ) . ' €'; }
	private static function pct( $a, $b ) { return $b > 0 ? round( 100 * $a / $b ) . ' %' : '—'; }

	/** Mėnesio riba: nuo mėnesio 1 d. (rugsėjis — nuo T-0). */
	private static function men_nuo() { $m = date( 'Y-m-01' ); return $m < self::T0 ? self::T0 : $m; }
	private static function men_tikslas() { $k = (int) ceil( (int) date( 'n' ) / 3 ); $key = date( 'Y' ) . '-' . $k; $kt = isset( self::N_KETV[ $key ] ) ? self::N_KETV[ $key ] : 250; $men = $kt / 3;
		if ( date( 'Y-m' ) === '2026-09' ) { $d = (int) date( 't' ) - 8; $men = $men * $d / (int) date( 't' ); } return (int) round( $men ); }
	private static function dienos_praejo() { $nuo = strtotime( self::men_nuo() ); return max( 1, (int) floor( ( time() - $nuo ) / 86400 ) + 1 ); }
	private static function dienos_men() { $nuo = strtotime( self::men_nuo() ); $iki = strtotime( date( 'Y-m-t' ) ); return max( 1, (int) round( ( $iki - $nuo ) / 86400 ) + 1 ); }

	/** Nauji maisto klientai: klientas_naujas=1 ir užsakyme yra maisto eilutė (kategorijų kelias su „maistas"). */
	public static function nauji( $nuo, $iki = null ) {
		global $wpdb; $p = $wpdb->prefix; $iki = $iki ? $iki : gmdate( 'Y-m-d H:i:s' );
		return $wpdb->get_results( $wpdb->prepare( "SELECT u.uzsakymas_id, u.kanalas_paskutinis kan, (u.gclid<>'' AND u.gclid IS NOT NULL) gc, u.viso_ct, u.marza_ct FROM {$p}ps_fakt_uzsakymai u WHERE u.sukurta_at>=%s AND u.sukurta_at<=%s AND u.testinis=0 AND u.klientas_naujas=1 AND u.statusas_galutinis<>'cancelled' AND EXISTS (SELECT 1 FROM {$p}ps_fakt_eilutes e WHERE e.uzsakymas_id=u.uzsakymas_id AND e.kategoriju_kelias LIKE '%%maist%%')", $nuo, $iki ), ARRAY_A );
	}
	public static function ads_spend( $nuo ) { global $wpdb; $p = $wpdb->prefix; return (int) $wpdb->get_var( $wpdb->prepare( "SELECT SUM(islaidos_ct) FROM {$p}ps_fakt_reklama WHERE kanalas='google_ads' AND diena>=%s", substr( $nuo, 0, 10 ) ) ); }

	public static function blokas_n() {
		$nuo = self::men_nuo(); $n = self::nauji( $nuo ); $k = count( $n ); $t = self::men_tikslas(); $dp = self::dienos_praejo(); $dm = self::dienos_men(); $prog = (int) round( $k / $dp * $dm );
		$v = $prog >= $t ? array( 'zalia', 'Naujų maisto klientų tempas atitinka planą', '' ) : ( $prog >= 0.7 * $t ? array( 'geltona', 'Tempas kiek žemiau plano', 'Tikrinti Ads signalą ir feed-only PMax startą' ) : array( 'raudona', 'Naujų maisto klientų per mažai', 'N variklis — Ads (offline konversijos, feed-only PMax); kol signalo nėra — biudžeto nedidinti' ) );
		return array( 'verdiktas' => $v, 'kpi' => array( 'Nauji maisto klientai šį mėn.' => $k, 'Prognozė mėn. pabaigai' => $prog, 'Plano norma mėn.' => $t . ' (Q4 ' . self::N_KETV['2026-4'] . '/ketv.)', 'Nuo T-0 iš viso' => count( self::nauji( self::T0 ) ) ), 'papildomai' => array( 'Naujas = pirmas užsakymas (tikrinta ir eShoprent istorija) su maisto preke. Plano bazė: Q4 2026 120 → 2027 Q4 250 per ketvirtį.' ) );
	}
	public static function blokas_cac() {
		$nuo = self::men_nuo(); $n = self::nauji( $nuo ); $ads = 0; foreach ( $n as $r ) { if ( $r['gc'] || 'mokamas' === $r['kan'] ) $ads++; } $sp = self::ads_spend( $nuo ); $cac = $ads ? (int) round( $sp / $ads ) : 0;
		if ( $sp < 5000 || ! $ads ) $v = array( 'pilka', 'Per mažai duomenų (išlaidos ' . self::eur( $sp ) . ', nauji iš Ads ' . $ads . ')', '' );
		elseif ( $cac > self::CAC_STOP_CT ) $v = array( 'raudona', 'CAC ' . self::eur( $cac ) . ' — virš avarinės ribos €35', 'Stabdyti / mažinti kampaniją, kurios CM12/CAC < 2' );
		elseif ( $cac > self::CAC_OK_CT ) $v = array( 'geltona', 'CAC ' . self::eur( $cac ) . ' — virš €12 lubų', 'Biudžeto nedidinti; brendų CM guardrail: Exclusion/Josera €5–7, Animonda/AV €10–12' );
		else $v = array( 'zalia', 'CAC ' . self::eur( $cac ) . ' — normoje', 'Galima didinti +20–30 % žingsniu' );
		return array( 'verdiktas' => $v, 'kpi' => array( 'Ads išlaidos šį mėn.' => self::eur( $sp ), 'Nauji maisto klientai iš Ads' => $ads, 'CAC (blended new-food)' => $ads ? self::eur( $cac ) : '—', 'Lubos / stop' => '€12 / €35' ), 'papildomai' => array( 'Iš Ads = gclid arba kanalas „mokamas". Išlaidos iš Ads skripto (traukimas 02:01). CM12 tikslus tik iš ps_fakt nuo 2027 Q2.' ) );
	}
	public static function blokas_kanalai() {
		$n = self::nauji( self::T0 ); $k = array(); foreach ( $n as $r ) { $kk = ( $r['gc'] || 'mokamas' === $r['kan'] ) ? 'Ads' : ( $r['kan'] ? $r['kan'] : 'nežinoma' ); $k[ $kk ] = isset( $k[ $kk ] ) ? $k[ $kk ] + 1 : 1; } arsort( $k ); $viso = count( $n ); $kpi = array(); foreach ( $k as $kk => $c ) $kpi[ $kk ] = $c . ' (' . self::pct( $c, $viso ) . ')';
		$ads = isset( $k['Ads'] ) ? $k['Ads'] : 0; $dalis = $viso ? $ads / $viso : 0;
		$v = $dalis > 0.75 ? array( 'geltona', 'Nauji beveik vien iš Ads (' . self::pct( $ads, $viso ) . ')', 'Sklaidos svertai (Q1): skaičiuoklė, prieglaudos/veisėjai, referral' ) : array( 'zalia', 'Naujų šaltiniai išsidėstę', '' );
		return array( 'verdiktas' => $v, 'kpi' => $kpi, 'papildomai' => array( 'Nuo T-0. Istorinių kanalų (ps_ist_*) nėra — atskaitos taškas nuo rugsėjo.' ) );
	}
	public static function blokas_r_due() {
		global $wpdb; $p = $wpdb->prefix; $t = $p . 'ps_refill_tracking'; $iki = date( 'Y-m-d', time() - self::R_DUE_LANGAS * 86400 ); $nuo = date( 'Y-m-d', time() - ( 30 + self::R_DUE_LANGAS ) * 86400 );
		$rows = $wpdb->get_results( $wpdb->prepare( "SELECT rt.user_id, rt.product_id, rt.predicted_empty_date pd, rt.last_purchase_date lp, rt.purchase_count pc FROM $t rt WHERE rt.predicted_empty_date BETWEEN %s AND %s", $nuo, $iki ), ARRAY_A );
		$n = 0; $g = 0; foreach ( $rows as $r ) { $n++; $pirko = $wpdb->get_var( $wpdb->prepare( "SELECT 1 FROM {$p}ps_fakt_uzsakymai u JOIN {$p}ps_fakt_eilutes e ON e.uzsakymas_id=u.uzsakymas_id WHERE u.klientas_id=%d AND e.preke_id=%d AND u.sukurta_at>=%s AND u.sukurta_at<=%s LIMIT 1", $r['user_id'], $r['product_id'], date( 'Y-m-d', strtotime( $r['pd'] ) - 14 * 86400 ), date( 'Y-m-d 23:59:59', strtotime( $r['pd'] ) + self::R_DUE_LANGAS * 86400 ) ) ); if ( $pirko ) $g++; }
		$r_due = $n ? $g / $n : 0;
		if ( $n < self::R_DUE_MIN_N ) $v = array( 'pilka', 'R_due dar kaupiasi (' . $n . ' terminų, reikia ≥ ' . self::R_DUE_MIN_N . ')', 'Pirmi refill laiškai — spalio pradžioje' );
		elseif ( $r_due >= self::R_DUE_TIKSLAS ) $v = array( 'zalia', 'R_due ' . round( 100 * $r_due ) . ' % — virš 22 % tikslo', '' );
		elseif ( $r_due >= 0.16 ) $v = array( 'geltona', 'R_due ' . round( 100 * $r_due ) . ' % — ties istoriniu 16 %', 'Tikrinti refill laiškų pasiekiamumą (deferred/holdout) ir intervalus' );
		else $v = array( 'raudona', 'R_due ' . round( 100 * $r_due ) . ' % — žemiau istorinio 16 %', 'Laiškai neišeina arba intervalai klaidingi — auditas' );
		return array( 'verdiktas' => $v, 'kpi' => array( 'Terminai per 30 d. (iki −14 d.)' => $n, 'Grįžo ±14 d. nuo termino' => $g, 'R_due' => $n ? round( 100 * $r_due ) . ' %' : '—', 'Tikslas / istorinis' => '22 % / 16 %' ), 'papildomai' => array( 'Terminas = ps_refill_tracking.predicted_empty_date; grįžo = ta pati prekė pirkta nuo −14 iki +14 d. Scorecard R60 ≥ 20 % — atskirai.' ) );
	}
	public static function blokas_laiskai() {
		global $wpdb; $p = $wpdb->prefix; $nuo = gmdate( 'Y-m-d H:i:s', time() - 30 * 86400 );
		$j = $wpdb->get_results( $wpdb->prepare( "SELECT status, COALESCE(NULLIF(skip_reason,''),NULLIF(block_reason,''),'') pr, COUNT(*) n FROM {$p}ps_email_jobs WHERE flow='refill_due' AND created_at>=%s GROUP BY 1,2", $nuo ), ARRAY_A );
		$kpi = array(); $sent = 0; $klik = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$p}ps_email_jobs WHERE flow='refill_due' AND clicked_at IS NOT NULL AND created_at>=%s", $nuo ) );
		foreach ( $j as $r ) { $kpi[ $r['status'] . ( $r['pr'] ? ' · ' . $r['pr'] : '' ) ] = (int) $r['n']; if ( 'sent' === $r['status'] ) $sent += (int) $r['n']; }
		$uzs = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$p}wc_orders o JOIN {$p}wc_orders_meta m ON m.order_id=o.id AND m.meta_key='_ps_pakartoti_is' WHERE o.date_created_gmt>=%s AND o.status IN ('wc-processing','wc-completed')", $nuo ) );
		$kpi['Užsakymai per „Pakartoti užsakymą"'] = $uzs; $kpi['Paspaudė nuorodą'] = $klik; $kpi['Konversija (užs./išsiųsta)'] = self::pct( $uzs, $sent );
		$v = $sent ? ( $uzs / $sent >= 0.10 ? array( 'zalia', 'Refill laiškai virsta užsakymais (' . self::pct( $uzs, $sent ) . ')', '' ) : array( 'geltona', 'Refill laiškai išeina, konversija ' . self::pct( $uzs, $sent ), 'Palaukti 100+ laiškų prieš keičiant tekstą' ) ) : array( 'pilka', 'Refill laiškų dar neišsiųsta', 'Pirmi — naujiems pirkėjams nuo 09-15, terminai ~spalis' );
		return array( 'verdiktas' => $v, 'kpi' => $kpi, 'papildomai' => array( 'Per 30 d. Atidėta (deferred) = klientas be soft opt-out žymos (pirko iki 09-15) arba prekės nėra sandėlyje; holdout_10 = kontrolinė grupė.' ) );
	}

	private static function blokas( $pav, $b ) {
		$sp = array( 'zalia' => '#1f7a3a', 'geltona' => '#b8860b', 'raudona' => '#b32d2e', 'pilka' => '#777' ); $bg = array( 'zalia' => '#eaf5ee', 'geltona' => '#fdf5e6', 'raudona' => '#fbeeee', 'pilka' => '#f3f4f3' ); $k = $b['verdiktas'][0];
		echo '<section class="psp-b" style="border-left:5px solid ' . $sp[ $k ] . '"><h2>' . esc_html( $pav ) . '</h2><div class="psp-v" style="background:' . $bg[ $k ] . ';color:' . $sp[ $k ] . '"><b>' . esc_html( $b['verdiktas'][1] ) . '</b>' . ( $b['verdiktas'][2] ? '<div class="psp-do">→ ' . esc_html( $b['verdiktas'][2] ) . '</div>' : '' ) . '</div>';
		if ( $b['kpi'] ) { echo '<table class="psp-k">'; foreach ( $b['kpi'] as $l => $val ) echo '<tr><td>' . esc_html( $l ) . '</td><td><b>' . esc_html( $val ) . '</b></td></tr>'; echo '</table>'; }
		foreach ( $b['papildomai'] as $t ) echo '<p class="psp-p">' . esc_html( $t ) . '</p>'; echo '</section>';
	}
	public static function puslapis() {
		echo '<div class="wrap psp"><h1>Q4 planas — vykdymo matavimas</h1><p class="psp-p">Baseline v1.2 (užrakintas 09-14). North Star €50 k/mėn. = N × V12 × 1,25. Čia tik vykdymo KPI ir verdiktai; planas — repo dokumentai/marketingas.</p>';
		echo '<style>.psp-b{background:#fff;margin:14px 0;padding:14px 18px;max-width:900px;box-shadow:0 1px 2px rgba(0,0,0,.06)}.psp-b h2{margin:0 0 8px;font-size:17px}.psp-v{padding:8px 12px;border-radius:4px;margin-bottom:10px}.psp-do{margin-top:3px;font-weight:normal}.psp-k td{padding:3px 14px 3px 0}.psp-p{color:#555;font-size:12.5px;margin:6px 0 0}</style>';
		foreach ( array( 'N — nauji maisto klientai' => 'blokas_n', 'CAC — kiek kainuoja naujas klientas' => 'blokas_cac', 'Naujų klientų kanalai' => 'blokas_kanalai', 'R_due — grįžimas prie termino' => 'blokas_r_due', 'Refill laiškai „Pakartoti užsakymą"' => 'blokas_laiskai' ) as $pav => $fn ) { try { self::blokas( $pav, self::$fn() ); } catch ( Throwable $e ) { echo '<section class="psp-b"><h2>' . esc_html( $pav ) . '</h2><p>Klaida: ' . esc_html( $e->getMessage() ) . '</p></section>'; } }
		echo '<p class="psp-p">Atnaujinta ' . esc_html( current_time( 'Y-m-d H:i' ) ) . ' · v' . self::VER . '</p></div>';
	}
}
Petshop_Planas_Langas::init();
