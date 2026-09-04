<?php
/** TEMP PS S1612 run e9v — V: patikra naujame procese po e8d (likučiai, būsenos, Klausimai be „Siunta grįžta“, TEMP 0, cron būsena) — tik skaitymas */
add_action('init', function(){
  if (!isset($_GET['ps_e9v'])) return;
  $o=array('v'=>'run e9v'); global $wpdb; $p=$wpdb->prefix; set_time_limit(120);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0"); $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'");
  try{
    $o['versija']=Petshop_Darbalaukis::VERSIJA; $o['md5']=md5_file(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'); $o['ks']=Petshop_Kliento_Siuntos::VERSIJA;
    foreach(array(19708=>'_stock',34828=>'_own_stock_qty',19756=>'_own_stock_qty',26166=>'_own_stock_qty',18593=>'_own_stock_qty',16727=>'_own_stock_qty') as $pid=>$k){ $o['likuciai'][$pid.' '.$k]=get_post_meta($pid,$k,true); }
    foreach(array(35440,35429,35419,35441,35421) as $id){ $x=wc_get_order($id); $o['uzs'][$id]=array('st'=>$x->get_status(),'griz'=>array_keys(Petshop_Darbalaukis::grizta($x)),'senos'=>Petshop_Darbalaukis::senos($x),'kl'=>array_map(function($s){ return $s['dalis'].' '.$s['busena']; },Petshop_Darbalaukis::kliento_siuntos($x))); }
    $o['grizta_meta_kiek']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_orders_meta WHERE meta_key='_ps_siunta_grizta'");
    $o['cron']=array('kada'=>($n=wp_next_scheduled('ps_venipak_sekimas'))?gmdate('H:i:s',$n):null,'paskutinis'=>get_option('ps_venipak_sekimas_paskutinis'));
    $o['opcijos_test']=$wpdb->get_col("SELECT option_name FROM {$p}options WHERE option_name LIKE 'ps_e%_mail' OR option_name LIKE 'ps_e%_oid%'");
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
