<?php
/** Plugin Name: TEMP PS S1704f av-order kodas */
add_action('init', function(){
  $f=(isset($_GET['ps_s1704f'])?$_GET['ps_s1704f']:''); if($f!=='1') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1704f');
  try{
    $o['av_order']=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-av-order.php');
    // kada Paysera nurašo
    $pd=WP_PLUGIN_DIR;
    $rad=array();
    foreach(array('paysera-checkout-for-woocommerce','woocommerce-paysera','paysera') as $d){
      if(!is_dir($pd.'/'.$d)) continue;
      $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($pd.'/'.$d));
      foreach($it as $file){ if($file->getExtension()!=='php') continue; $c=@file_get_contents($file->getPathname()); if($c===false) continue;
        if(strpos($c,'reduce_stock_levels')!==false||strpos($c,'reduce_order_stock')!==false) $rad[]=str_replace($pd,'',$file->getPathname()); }
    }
    $o['paysera_nurasymas']=$rad;
    $o['plugins']=array_values(array_filter(scandir($pd),function($x){return $x[0]!=='.';}));
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
