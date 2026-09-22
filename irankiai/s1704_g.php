<?php
/** Plugin Name: TEMP PS S1704g kas nurase 21:22 */
add_action('init', function(){
  $f=(isset($_GET['ps_s1704g'])?$_GET['ps_s1704g']:''); if($f!=='1') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1704g');
  try{
    $rad=array();
    $keliai=array(WPMU_PLUGIN_DIR, WP_PLUGIN_DIR, get_theme_root());
    foreach($keliai as $k){
      if(!is_dir($k)) continue;
      $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($k,FilesystemIterator::SKIP_DOTS),RecursiveIteratorIterator::SELF_FIRST);
      foreach($it as $file){
        if(!$file->isFile()||$file->getExtension()!=='php') continue;
        $pth=$file->getPathname();
        if(strpos($pth,'/woocommerce/includes/')!==false) continue;
        $c=@file_get_contents($pth); if($c===false) continue;
        foreach(array('wc_reduce_stock_levels','reduce_order_stock','wc_maybe_reduce_stock_levels') as $ndl){
          if(strpos($c,$ndl)!==false){
            foreach(explode("\n",$c) as $i=>$ln){ if(strpos($ln,$ndl)!==false) $rad[]=str_replace(WP_CONTENT_DIR,'',$pth).':'.($i+1).' '.trim(substr($ln,0,160)); }
          }
        }
      }
    }
    $o['radiniai']=array_slice($rad,0,120);
    global $wp_filter;
    foreach(array('woocommerce_new_order','woocommerce_checkout_order_created','woocommerce_order_status_pending','woocommerce_order_status_on-hold','woocommerce_checkout_order_processed','woocommerce_reduce_order_stock') as $h){
      $l=array();
      if(isset($wp_filter[$h])) foreach($wp_filter[$h]->callbacks as $prio=>$cbs) foreach($cbs as $id=>$cb){
        $fn=$cb['function']; $nm=is_array($fn)?((is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]):(is_string($fn)?$fn:'closure');
        $l[]=$prio.' '.$nm; }
      $o['kabliai'][$h]=$l;
    }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
