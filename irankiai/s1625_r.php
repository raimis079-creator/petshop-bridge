<?php
/** TEMP PS S1625 r — RECON (tik skaitymas): (1) dev-pastas — ar yra leidimų sąrašas (`ps_dev_pastas_leisti`), žurnalo paskutiniai; (2) Venipak šiandien — užsakymai su tikrais numeriais, `venipak_shipping_order_data`, įvykiai vp_reg/lipdukas, sargo klaidos; (3) siuntėjo nustatymai (`shopup_venipak_shipping_field_sender*`) ir kur „Bulakas“ kode; (4) skydelio pastabų vieta. */
add_action('init', function(){
  if (!isset($_GET['ps_r9'])) return;
  $o=array('v'=>'S1625 r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(150);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $dp=(string)file_get_contents(WPMU_PLUGIN_DIR.'/petshop-dev-pastas.php'); $L=explode("\n",$dp); $g=array(); foreach($L as $k=>$l){ if(preg_match('/leisti|allow|petshop\.lt|host|return false|pre_wp_mail|option/i',$l)) $g[]=($k+1).': '.mb_substr(trim($l),0,200); } $o['dev_pastas_kodas']=$g; $o['ps_dev_pastas_leisti']=get_option('ps_dev_pastas_leisti');
  $z=(array)get_option('ps_dev_pastas_zurnalas',array()); $o['dev_pastas_n']=count($z); $o['dev_pastas_pask']=array_map(function($e){return ($e['laikas']??'').' '.mb_substr($e['tema']??'',0,60).' → '.($e['kam']??'');},array_slice($z,-8));
  $o['uzs_siuntos']=$wpdb->get_results("SELECT order_id,LEFT(meta_value,300) v FROM {$p}wc_orders_meta WHERE meta_key='_ps_siuntos' ORDER BY order_id",ARRAY_A);
  $o['uzs_vp_data']=$wpdb->get_results("SELECT order_id,LEFT(meta_value,300) v FROM {$p}wc_orders_meta WHERE meta_key='venipak_shipping_order_data' ORDER BY order_id",ARRAY_A);
  $o['uzs_visi']=$wpdb->get_results("SELECT id,status,date_created_gmt FROM {$p}wc_orders WHERE type='shop_order' ORDER BY id",ARRAY_A);
  $o['ivykiai_vp']=$wpdb->get_results("SELECT laikas,uzsakymas,veiksmas,rezultatas,LEFT(pastaba,120) pastaba FROM {$p}ps_uzsakymu_ivykiai WHERE veiksmas LIKE '%vp%' OR veiksmas LIKE '%lipduk%' OR rezultatas<>'ok' ORDER BY id DESC LIMIT 20",ARRAY_A);
  $o['sargas']=$wpdb->get_results("SELECT laikas,LEFT(klaida,160) k FROM {$p}ps_sargas_klaidos ORDER BY id DESC LIMIT 8",ARRAY_A);
  $o['ivykiai_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_uzsakymu_ivykiai"); $o['sargas_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_sargas_klaidos");
  $o['sender']=$wpdb->get_results("SELECT option_name,LEFT(option_value,80) v FROM {$p}options WHERE option_name LIKE 'shopup_venipak_shipping_field_sender%' OR option_name LIKE '%venipak%sender%' OR option_name LIKE '%venipak%contact%'",ARRAY_A);
  $hits=array(); foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $fp){ $c=(string)file_get_contents($fp); if(stripos($c,'Bulak')!==false||stripos($c,'sender_contact')!==false||stripos($c,'contact_person')!==false){ $L=explode("\n",$c); foreach($L as $k=>$l){ if(preg_match('/Bulak|sender_contact|contact_person|sender_name|siuntejo|siuntėjo/i',$l)) $hits[]=basename($fp).':'.($k+1).': '.mb_substr(trim($l),0,170); } } } $o['bulakas_kode']=array_slice($hits,0,25);
  $vp=WP_PLUGIN_DIR.'/wc-venipak-shipping/'; $o['vp_plugin_failai']=array_map('basename',glob($vp.'*.php')); $hits2=array(); foreach(glob($vp.'{,*/,*/*/}*.php',GLOB_BRACE) as $fp){ $c=(string)file_get_contents($fp); if(stripos($c,'contact_person')!==false||stripos($c,'sender_contact')!==false){ $L=explode("\n",$c); foreach($L as $k=>$l){ if(preg_match('/contact_person|sender_contact/i',$l)) $hits2[]=str_replace($vp,'',$fp).':'.($k+1).': '.mb_substr(trim($l),0,160); } } } $o['vp_contact_kode']=array_slice($hits2,0,20);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
