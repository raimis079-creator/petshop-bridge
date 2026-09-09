<?php
/** TEMP PS S1665 c — READ-ONLY: sender-webhook handlerio kodas + external pasiekiamumas (wp-json vs rest_route). */
add_action('init', function(){
  if (!isset($_GET['ps_s1665c'])) return;
  $o=array('v'=>'S1665 c');
  // kur registruota
  foreach(array(WPMU_PLUGIN_DIR,WP_PLUGIN_DIR.'/petshop-core') as $dir){
    $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir,FilesystemIterator::SKIP_DOTS));
    foreach($it as $f){ if(substr($f,-4)!=='.php') continue; $s=file_get_contents($f);
      if(strpos($s,'sender-webhook')!==false){
        $o['failas']=str_replace(dirname($dir),'',$f);
        $ls=explode("\n",$s);
        foreach($ls as $n=>$l){ if(strpos($l,'sender-webhook')!==false){ $o['reg_eil']=$n+1;
          $o['kodas']=array_map('trim',array_slice($ls,max(0,$n-5),90)); break; } }
      } }
  }
  if(isset($o['kodas'])) $o['kodas']=array_slice($o['kodas'],0,90);
  // pasiekiamumas iš išorės (per serverį su external DNS — home_url naudoja tą patį hostą)
  foreach(array('/wp-json/petshop/v1/sender-webhook','/?rest_route=/petshop/v1/sender-webhook') as $u){
    $r=wp_remote_post(home_url($u),array('timeout'=>15,'body'=>'{}','headers'=>array('Content-Type'=>'application/json')));
    $o['pasiek'][$u]=is_wp_error($r)?'ERR '.$r->get_error_message():wp_remote_retrieve_response_code($r).' '.mb_substr(wp_remote_retrieve_body($r),0,120);
  }
  wp_send_json($o);
});
