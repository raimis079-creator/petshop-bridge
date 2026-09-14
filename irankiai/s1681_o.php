<?php
/** TEMP PS S1681 o — read-only: eShoprent istorija (ps_ist_fakt_uzsakymai) — rugsėjo 1–20 d. dienomis 2024/2025, savaitės 2026-06…09, rugsėjo 10–15 d. 2024/2025 vs 2026. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681o'])) return; global $wpdb; $p=$wpdb->prefix; $t=$p.'ps_ist_fakt_uzsakymai'; $o=array('v'=>'S1681 o');
  $o['cols']=$wpdb->get_col("SHOW COLUMNS FROM $t"); $o['range']=$wpdb->get_row("SELECT MIN(apmoketa_at) nuo,MAX(apmoketa_at) iki,COUNT(*) n FROM $t",ARRAY_A);
  $o['men']=$wpdb->get_results("SELECT DATE_FORMAT(apmoketa_at,'%Y-%m') m,COUNT(*) n,ROUND(SUM(viso_ct)/100) eur,ROUND(COUNT(*)/DAY(LAST_DAY(MIN(apmoketa_at))),1) per_d FROM $t GROUP BY m ORDER BY m",ARRAY_A);
  $o['rugs_dienos']=$wpdb->get_results("SELECT YEAR(apmoketa_at) y,DAY(apmoketa_at) d,COUNT(*) n,ROUND(SUM(viso_ct)/100) eur FROM $t WHERE MONTH(apmoketa_at)=9 AND DAY(apmoketa_at)<=20 GROUP BY y,d ORDER BY y,d",ARRAY_A);
  $o['sav2026']=$wpdb->get_results("SELECT YEARWEEK(apmoketa_at,3) sav,MIN(DATE(apmoketa_at)) nuo,COUNT(*) n,ROUND(SUM(viso_ct)/100) eur FROM $t WHERE apmoketa_at>='2026-06-01' GROUP BY sav ORDER BY sav",ARRAY_A);
  $o['e']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
