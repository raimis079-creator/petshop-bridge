<?php
/** Plugin Name: TEMP PS S1697 klaidingi atitikmenys — feed off + GTIN (Raimis daryk) */
add_action('wp_loaded', function(){
  $f=(isset($_GET['ps_s1697'])?$_GET['ps_s1697']:''); if($f!=='1'&&$f!=='2') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1697 mf','faze'=>$f); global $wpdb;
  try{
    $ids=array(16270,18036);
    if($f==='1'){
      $bak=array(); foreach($ids as $id){ $bak[$id]=array('gtin'=>get_post_meta($id,'_global_unique_id',true),'k24'=>get_post_meta($id,'_ps_feed_off_kaina24',true),'kn'=>get_post_meta($id,'_ps_feed_off_kainos',true)); }
      update_option('ps_s1697_atitikmenys_bak',$bak,false); $o['bak']=$bak;
      foreach($ids as $id){ update_post_meta($id,'_ps_feed_off_kaina24','yes'); update_post_meta($id,'_ps_feed_off_kainos','yes'); }
      update_post_meta(16270,'_global_unique_id','');
      $o['po']=array(); foreach($ids as $id){ $o['po'][$id]=array('gtin'=>get_post_meta($id,'_global_unique_id',true),'k24'=>get_post_meta($id,'_ps_feed_off_kaina24',true),'kn'=>get_post_meta($id,'_ps_feed_off_kainos',true)); }
      $t0=microtime(true); $st=ps_feeds_generuoti(array('kaina24','kainos'),false); unset($st['pvz']); $o['stat']=$st; $o['sek']=round(microtime(true)-$t0,1);
    } else {
      $up=wp_upload_dir(); foreach(array('kaina24','kainos') as $c){ $s=file_get_contents($up['basedir'].'/petshop-feeds/'.$c.'.xml'); $o[$c]=array('n'=>substr_count($s,'<product id='),'16270'=>substr_count($s,'<product id="16270">'),'18036'=>substr_count($s,'<product id="18036">'),'mtime'=>date('H:i',filemtime($up['basedir'].'/petshop-feeds/'.$c.'.xml'))); }
    }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
