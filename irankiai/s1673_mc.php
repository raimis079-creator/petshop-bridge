<?php
/** Plugin Name: TEMP PS S1673 mc */
add_action('init', function(){
  $f=isset($_GET['ps_mc'])?$_GET['ps_mc']:''; if($f!=='GO') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1673','faze'=>$f);
  $p=WP_CONTENT_DIR.'/uploads/feeds/google.xml'; if(!file_exists($p)){ foreach(glob(WP_CONTENT_DIR.'/uploads/*/google.xml') as $g){$p=$g;} }
  $o['feed']=$p; $o['feed_age_min']=file_exists($p)?round((time()-filemtime($p))/60):null;
  if(file_exists($p)){ $c=file_get_contents($p); $o['items']=substr_count($c,'<item>'); $o['sw']=substr_count($c,'<g:shipping_weight>'); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
