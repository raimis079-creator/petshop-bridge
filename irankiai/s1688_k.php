<?php
/** TEMP PS S1688 k — read-only: fiktyvių T-0 likučių kandidatai — be VF meta, T-0 liko>0, vertė ≥100 €, pardavimų 365 d. = 0 (istorija ps_ist_fakt_eilutes) — top 40 pagal vertę. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688k'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1688 k');
  $o['ist_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_ist_fakt_eilutes");
  $pc=in_array('preke_id',$o['ist_cols'])?'preke_id':(in_array('product_id',$o['ist_cols'])?'product_id':null);
  $rows=$wpdb->get_results("SELECT pa.product_id id,pa.kiekis_liko l,pa.savikaina_eur sav,ROUND(pa.kiekis_liko*pa.savikaina_eur) verte,po.post_title t,(SELECT meta_value FROM {$p}postmeta WHERE post_id=pa.product_id AND meta_key='_legacy_manufacturer') gam".($pc?",(SELECT COUNT(*) FROM {$p}ps_ist_fakt_eilutes e WHERE e.$pc=pa.product_id) ist_n,(SELECT MAX(e.apmoketa_at) FROM {$p}ps_ist_fakt_eilutes e WHERE e.$pc=pa.product_id) ist_pask,(SELECT COALESCE(SUM(e.kiekis),0) FROM {$p}ps_ist_fakt_eilutes e WHERE e.$pc=pa.product_id AND e.apmoketa_at>=DATE_SUB(NOW(),INTERVAL 365 DAY)) vnt365":"")." FROM {$p}ps_partijos pa JOIN {$p}posts po ON po.ID=pa.product_id WHERE pa.pastaba LIKE 'Pradinis likutis T-0%' AND pa.atsaukta=0 AND pa.kiekis_liko>0 AND pa.kiekis_liko*pa.savikaina_eur>=100 AND NOT EXISTS (SELECT 1 FROM {$p}postmeta v WHERE v.post_id=pa.product_id AND v.meta_key='_vf_supplier_sku') ORDER BY verte DESC LIMIT 60",ARRAY_A);
  $o['e']=$wpdb->last_error; $o['rows']=$rows;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
