<?php
/** TEMP PS S1693 a — Ads langas: ką generuoja PMax šunys / katės / brand — prieš (senoji svetainė) ir po migracijos (ps_fakt_reklama) + WC Ads užsakymų ekonomika (ps_fakt_uzsakymai). Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1693a'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1693 a','laikas'=>current_time('mysql')); $wpdb->suppress_errors(true);
  $o['reklama_periodai']=$wpdb->get_results("SELECT senoji_svetaine sena, MIN(diena) nuo, MAX(diena) iki, COUNT(DISTINCT diena) d FROM {$p}ps_fakt_reklama WHERE kanalas='google_ads' GROUP BY 1",ARRAY_A);
  $o['kamp_periodai']=$wpdb->get_results("SELECT LEFT(kampanija,30) k, senoji_svetaine sena, MIN(diena) nuo, MAX(diena) iki, COUNT(DISTINCT diena) d, SUM(parodymai) par, SUM(paspaudimai) pasp, ROUND(SUM(islaidos_ct)/100,2) eur, ROUND(SUM(konversijos),1) konv, ROUND(SUM(konv_verte_ct)/100) kv FROM {$p}ps_fakt_reklama WHERE kanalas='google_ads' GROUP BY 1,2 ORDER BY 1,2",ARRAY_A);
  $o['kamp_dienos_po']=$wpdb->get_results("SELECT diena, LEFT(kampanija,26) k, paspaudimai pasp, ROUND(islaidos_ct/100,2) eur, ROUND(konversijos,1) konv, ROUND(konv_verte_ct/100) kv FROM {$p}ps_fakt_reklama WHERE kanalas='google_ads' AND diena>='2026-09-09' ORDER BY kampanija, diena",ARRAY_A);
  $o['kamp_savaites_pries']=$wpdb->get_results("SELECT LEFT(kampanija,26) k, YEARWEEK(diena,3) sav, MIN(diena) nuo, SUM(paspaudimai) pasp, ROUND(SUM(islaidos_ct)/100,2) eur, ROUND(SUM(konversijos),1) konv, ROUND(SUM(konv_verte_ct)/100) kv FROM {$p}ps_fakt_reklama WHERE kanalas='google_ads' AND diena<'2026-09-09' GROUP BY 1,2 ORDER BY 1,2",ARRAY_A);
  $s="COUNT(*) n, ROUND(SUM(viso_ct)/100) viso, ROUND(AVG(viso_ct)/100,2) aov, ROUND(SUM(marza_ct)/100) marza, ROUND(SUM(kontribucija_ct)/100) kontrib, ROUND(AVG(kontribucija_ct)/100,2) kontrib_vid, SUM(klientas_naujas) nauji";
  $t="{$p}ps_fakt_uzsakymai WHERE testinis=0 AND statusas_galutinis NOT IN('cancelled','failed','refunded','pending')";
  $o['wc_viso_po']=$wpdb->get_row("SELECT $s FROM $t AND sukurta_at>='2026-09-09'",ARRAY_A);
  $o['wc_ads_po']=$wpdb->get_row("SELECT $s FROM $t AND sukurta_at>='2026-09-09' AND (gclid<>'' OR kanalas_paskutinis='mokamas')",ARRAY_A);
  $o['wc_ads_dienos']=$wpdb->get_results("SELECT DATE(sukurta_at) d, COUNT(*) n, ROUND(SUM(viso_ct)/100) viso, ROUND(SUM(kontribucija_ct)/100) kontrib, SUM(klientas_naujas) nauji FROM $t AND sukurta_at>='2026-09-09' AND (gclid<>'' OR kanalas_paskutinis='mokamas') GROUP BY 1 ORDER BY 1",ARRAY_A);
  $o['wc_ads_kategorijos']=$wpdb->get_results("SELECT LEFT(e.kategoriju_kelias,40) kat, COUNT(DISTINCT e.order_id) uzs, ROUND(SUM(e.suma_ct)/100) suma FROM {$p}ps_fakt_eilutes e JOIN {$p}ps_fakt_uzsakymai u ON u.order_id=e.order_id WHERE u.testinis=0 AND u.sukurta_at>='2026-09-09' AND (u.gclid<>'' OR u.kanalas_paskutinis='mokamas') GROUP BY 1 ORDER BY 2 DESC LIMIT 12",ARRAY_A);
  $o['fakt_eilutes_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_eilutes");
  $o['fakt_uzs_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_uzsakymai");
  $o['kanalai_po']=$wpdb->get_results("SELECT kanalas_paskutinis k, COUNT(*) n, ROUND(SUM(viso_ct)/100) viso, ROUND(SUM(kontribucija_ct)/100) kontrib, SUM(klientas_naujas) nauji FROM $t AND sukurta_at>='2026-09-09' GROUP BY 1 ORDER BY 2 DESC",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
