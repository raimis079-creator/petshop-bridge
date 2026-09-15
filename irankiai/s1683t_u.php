<?php
/** TEMP PS S1683t u — read-only: VF katalogo lentelė — kas yra JOS0805 ir JOS0793 (pavadinimas, kaina, barcode); 21707 būklė. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683tu'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'u');
  foreach($wpdb->get_results("SHOW TABLES LIKE '%vf%'",ARRAY_N) as $t) $o['lent'][]=$t[0];
  foreach($o['lent']??array() as $t){ $c=$wpdb->get_col("SHOW COLUMNS FROM $t"); $skucol=null; foreach($c as $cc) if(preg_match('/sku|kodas|code/i',$cc)){ $skucol=$cc; break; } if(!$skucol) continue;
    $r=$wpdb->get_results("SELECT * FROM $t WHERE $skucol IN('JOS0805','JOS0793') LIMIT 4",ARRAY_A); if($r) $o['rasta'][$t]=array_map(function($x){return array_map(function($v){return substr((string)$v,0,60);},$x);},$r); }
  $pr=wc_get_product(21707); $o['p21707']=array('st'=>$pr->get_status(),'vis'=>$pr->get_catalog_visibility(),'kaina'=>$pr->get_price(),'stock'=>$pr->get_stock_quantity(),'sukurta'=>$pr->get_date_created()->date('Y-m-d'),'slug'=>$pr->get_slug(),'ean'=>$pr->get_meta('_ean'),'vf_stock'=>$pr->get_meta('_vf_stock'));
  $pr=wc_get_product(18054); $o['p18054']=array('slug'=>$pr->get_slug(),'vf_stock'=>$pr->get_meta('_vf_stock'),'_price_before'=>$pr->get_meta('_vf_price_initial'),'sales_ist'=>$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_ist_fakt_eilutes WHERE preke_id=18054 OR sku='JOS0805'"));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
