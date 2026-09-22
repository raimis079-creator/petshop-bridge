<?php
/** Plugin Name: TEMP PS S1704d kabliu eile */
add_action('init', function(){
  $f=(isset($_GET['ps_s1704d'])?$_GET['ps_s1704d']:''); if($f!=='1') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1704d');
  try{
    global $wpdb; $p=$wpdb->prefix;
    $c=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-av-order.php');
    $o['av_order_md5']=md5($c); $o['av_order_dydis']=strlen($c);
    preg_match_all("/add_(?:action|filter)\(\s*'([a-z_0-9]+)'\s*,\s*\[[^\]]*'([a-z_0-9]+)'\s*\]\s*(?:,\s*(\d+))?/i",$c,$m,PREG_SET_ORDER);
    $o['av_order_kabliai']=array_map(function($x){return $x[1].' -> '.$x[2].' prio '.(isset($x[3])?$x[3]:'10');},$m);
    // kas dar nustato _ps_source
    $dir=WPMU_PLUGIN_DIR; $rad=array();
    foreach(scandir($dir) as $fn){ if(substr($fn,-4)!=='.php') continue; $cc=@file_get_contents($dir.'/'.$fn); if($cc===false) continue;
      if(strpos($cc,"_ps_source")!==false){ $n=substr_count($cc,'_ps_source'); $rad[$fn]=$n; } }
    $o['ps_source_failai']=$rad;
    // realus kabliai gyvai
    global $wp_filter;
    foreach(array('woocommerce_payment_complete','woocommerce_order_status_processing','woocommerce_checkout_order_processed','woocommerce_order_item_quantity','woocommerce_can_reduce_order_stock') as $h){
      $l=array();
      if(isset($wp_filter[$h])) foreach($wp_filter[$h]->callbacks as $prio=>$cbs) foreach($cbs as $id=>$cb){
        $fn=$cb['function']; $nm=is_array($fn)?((is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]):(is_string($fn)?$fn:'closure');
        $l[]=$prio.' '.$nm; }
      $o['kabliai'][$h]=$l;
    }
    // uzsakymo 36091 pastabos
    $ord=wc_get_order(36091);
    if($ord){ $nt=wc_get_order_notes(array('order_id'=>36091,'limit'=>30));
      $o['pastabos_36091']=array_map(function($n){return $n->date_created->date('Y-m-d H:i:s').' | '.$n->content;},$nt);
      $o['meta_36091']=array('_ps_av_reduced'=>$ord->get_meta('_ps_av_reduced'),'_ps_av_restored'=>$ord->get_meta('_ps_av_restored'),'sukurta'=>$ord->get_date_created()->date('Y-m-d H:i:s'),'apmoketa'=>$ord->get_date_paid()?$ord->get_date_paid()->date('Y-m-d H:i:s'):null,'budas'=>$ord->get_payment_method());
    }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
