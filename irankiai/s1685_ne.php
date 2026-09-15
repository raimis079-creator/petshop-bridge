<?php
/** TEMP PS S1685 ne — RECON read-only: iš kur 09-24 — ps_refill_tracking eilutės užsakymui 35948 (pirkimo data, intervalas, confidence, pet_id), ciklų šaltinis. */
add_action('init', function(){
  if (!isset($_GET['ps_s1685ne'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1685 ne');
  $o['rows']=$wpdb->get_results("SELECT rt.product_id, rt.pet_id, rt.last_purchase_date, rt.purchase_count, rt.avg_interval_days, rt.predicted_empty_date, rt.confidence, e.brendas_slug, e.svoris_g, e.kiekis FROM {$p}ps_refill_tracking rt LEFT JOIN {$p}ps_fakt_eilutes e ON e.uzsakymas_id=rt.last_order_id AND e.preke_id=rt.product_id WHERE rt.last_order_id=35948 ORDER BY rt.predicted_empty_date",ARRAY_A);
  $o['uzs_data']=wc_get_order(35948)->get_date_created()->date('Y-m-d');
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
