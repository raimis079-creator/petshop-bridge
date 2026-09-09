<?php
/** TEMP PS S1665 d — READ-ONLY: kur registruotas sender-webhook (tema + visi pluginai + mu). */
add_action('init', function(){
  if (!isset($_GET['ps_s1665d'])) return;
  $o=array('v'=>'S1665 d'); set_time_limit(120);
  foreach(array('MU'=>WPMU_PLUGIN_DIR,'PL'=>WP_PLUGIN_DIR,'TH'=>get_theme_root()) as $zk=>$dir){
    $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir,FilesystemIterator::SKIP_DOTS));
    foreach($it as $f){ if(substr($f,-4)!=='.php') continue; $s=@file_get_contents($f); if($s===false) continue;
      if(strpos($s,'sender-webhook')!==false||strpos($s,'sender_webhook')!==false){
        $ls=explode("\n",$s);
        foreach($ls as $n=>$l){ if(strpos($l,'sender-webhook')!==false||strpos($l,'sender_webhook')!==false){
          $o['hits'][]=$zk.':'.str_replace($dir,'',$f).':'.($n+1).' '.trim(mb_substr($l,0,140));
          if(!isset($o['pirmas'])){ $o['pirmas']=str_replace($dir,'',$f); $o['ist']=array_map('trim',array_slice($ls,max(0,$n-3),80)); }
        } }
      } }
  }
  if(isset($o['ist'])) $o['ist']=array_slice($o['ist'],0,80);
  wp_send_json($o);
});
