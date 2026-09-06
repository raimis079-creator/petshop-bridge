<?php
/** TEMP PS S1622 r — RECON: Petshop_Siuntos::prideti_is_plugino kūnas, ps_web_dienos stulpeliai, wc_customer_lookup likutis, testuotojas/5787. */
add_action('init', function(){
  if (!isset($_GET['ps_r'])) return;
  $o=array('v'=>'S1622 r'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $fp){ $c=(string)file_get_contents($fp); if(strpos($c,'function prideti_is_plugino')!==false){ $L=explode("\n",$c); foreach($L as $k=>$l){ if(strpos($l,'function prideti_is_plugino')!==false){ $o['failas']=basename($fp); $o['kodas']=array_map(function($x){return mb_substr(rtrim($x),0,200);},array_slice($L,$k,40)); break; } } } }
  $o['web_dienos_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_web_dienos"); $o['web_dienos_min_max']=$wpdb->get_row("SELECT MIN(diena) a, MAX(diena) b FROM {$p}ps_web_dienos",ARRAY_N);
  $o['customer_lookup']=$wpdb->get_results("SELECT customer_id,user_id,email FROM {$p}wc_customer_lookup",ARRAY_A);
  $o['venipak_meta_pvz']=$wpdb->get_col("SELECT DISTINCT meta_key FROM {$p}postmeta WHERE meta_key LIKE '%venipak%' LIMIT 15");
  $o['inst16']=$wpdb->get_row("SELECT instance_id,is_enabled FROM {$p}woocommerce_shipping_zone_methods WHERE zone_id=1 AND method_id='local_pickup'",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
