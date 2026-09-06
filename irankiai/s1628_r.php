<?php
/** TEMP PS S1628 r — RECON (tik skaitymas): WCDN „print buttons“ kliento paskyroje (opcijos wcdn_*, kodas), „Atsisakyti sutarties (ES 14 d. teisė)“ šaltinis. */
add_action('init', function(){
  if (!isset($_GET['ps_r13'])) return;
  $o=array('v'=>'S1628 r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(120);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $o['wcdn_opt']=$wpdb->get_results("SELECT option_name,LEFT(option_value,160) v FROM {$p}options WHERE option_name LIKE 'wcdn%' AND option_name NOT LIKE '%template_%' ORDER BY option_name",ARRAY_A);
  $dir=WP_PLUGIN_DIR.'/woocommerce-delivery-notes/'; $o['wcdn_dir']=is_dir($dir); $hits=array();
  foreach(glob($dir.'{,*/,*/*/}*.php',GLOB_BRACE) as $fp){ $c=(string)file_get_contents($fp); if(preg_match('/print_button|my_account|view_order|wcdn_print_button|woocommerce_view_order|woocommerce_my_account_my_orders_actions|order-details|after_order_table/i',$c)){ $L=explode("\n",$c); foreach($L as $k=>$l){ if(preg_match('/add_action\(|add_filter\(|print_button|wcdn_print_button|get_option\(\s*.wcdn/i',$l)&&preg_match('/print|button|my_account|view_order|order_table|order_details|orders_actions/i',$l)){ $hits[]=str_replace($dir,'',$fp).':'.($k+1).': '.mb_substr(trim($l),0,200); } } } } $o['wcdn_kodas']=array_slice($hits,0,45);
  $th=get_stylesheet_directory(); $h2=array(); foreach(array_merge(glob($th.'/*.php')?:array(),glob($th.'/woocommerce/{,*/,*/*/}*.php',GLOB_BRACE)?:array(),glob(WPMU_PLUGIN_DIR.'/*.php')?:array()) as $fp){ $c=(string)file_get_contents($fp); if(strpos($c,'Atsisakyti sutarties')!==false||strpos($c,'14 d.')!==false||strpos($c,'Spausdinti')!==false){ $L=explode("\n",$c); foreach($L as $k=>$l){ if(preg_match('/Atsisakyti sutarties|14 d\.|Spausdinti|print_button|wcdn/i',$l)) $h2[]=basename(dirname($fp)).'/'.basename($fp).':'.($k+1).': '.mb_substr(trim($l),0,180); } } } $o['tema_mu']=array_slice($h2,0,30);
  $o['aktyvus']=array_values(array_filter((array)get_option('active_plugins'),function($x){return preg_match('/delivery|invoice|pdf|atsisak|refund|return|cancel/i',$x);}));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
