<?php
/** TEMP PS S1692 d — Ads išlaidos pagal kampaniją ir dieną 09-10…18 (ps_fakt_reklama). Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1692d'])) return; global $wpdb; $p=$wpdb->prefix; $o=array();
  $o['kamp_dienos']=$wpdb->get_results("SELECT diena, LEFT(kampanija,26) k, parodymai par, paspaudimai pasp, ROUND(islaidos_ct/100,2) eur, konversijos konv FROM {$p}ps_fakt_reklama WHERE diena>='2026-09-10' AND kanalas='google_ads' ORDER BY kampanija, diena",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
