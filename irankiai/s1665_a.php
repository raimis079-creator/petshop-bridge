<?php
/** TEMP PS S1665 a — READ-ONLY: Sender webhook endpoint recon (mu-plugins + plugins + tema). */
add_action('init', function(){
  if (!isset($_GET['ps_s1665a'])) return;
  $o=array('v'=>'S1665 a');
  $dirs=array('MU'=>WPMU_PLUGIN_DIR,'PL'=>WP_PLUGIN_DIR.'/petshop-core','PX'=>WP_PLUGIN_DIR.'/petshop-xml','TH'=>get_stylesheet_directory());
  foreach($dirs as $zk=>$dir){
    $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir,FilesystemIterator::SKIP_DOTS));
    foreach($it as $f){ if(substr($f,-4)!=='.php') continue;
      $c=file_get_contents($f); if(stripos($c,'webhook')===false) continue;
      foreach(explode("\n",$c) as $n=>$l){ if(stripos($l,'webhook')!==false && count($o['hits']??array())<60)
        $o['hits'][]=$zk.':'.basename($f).':'.($n+1).' '.trim(mb_substr($l,0,150)); }
    }
  }
  // REST maršrutai
  foreach(rest_get_server()->get_routes() as $r=>$x){ if(stripos($r,'petshop')!==false||stripos($r,'sender')!==false) $o['rest'][]=$r; }
  $o['secret_len']=strlen((string)get_option('petshop_esp_sender_webhook_secret',''));
  $o['log_n']=count((array)get_option('ps_sender_webhook_log',array()));
  $o['suppression_db']=get_option('petshop_email_suppression_db','');
  wp_send_json($o);
});
