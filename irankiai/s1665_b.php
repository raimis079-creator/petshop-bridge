<?php
/** TEMP PS S1665 b — READ-ONLY: ar yra webhook receiver klasė + pilnas REST filtras + Sender adapterio verify_webhook. */
add_action('init', function(){
  if (!isset($_GET['ps_s1665b'])) return;
  $o=array('v'=>'S1665 b');
  $dir=WP_PLUGIN_DIR.'/petshop-core';
  $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir,FilesystemIterator::SKIP_DOTS));
  foreach($it as $f){ $b=basename($f);
    if(stripos($b,'webhook')!==false||stripos($b,'receiver')!==false||stripos($b,'sender')!==false||stripos($b,'esp')!==false||stripos($b,'suppress')!==false||stripos($b,'consent')!==false)
      $o['failai'][]=str_replace($dir,'',$f).' '.filesize($f).'B';
  }
  foreach(rest_get_server()->get_routes() as $r=>$x){ if(stripos($r,'sender')!==false||stripos($r,'webhook')!==false||stripos($r,'esp')!==false||stripos($r,'consent')!==false) $o['rest'][]=$r; }
  // adapterio verify_webhook + registracijos paieška
  foreach(array('class-sender-adapter.php','includes/class-sender-adapter.php') as $c){ $p=$dir.'/'.$c; if(file_exists($p)){ $s=file_get_contents($p);
    foreach(explode("\n",$s) as $n=>$l){ if(preg_match('/verify_webhook|register_rest_route|webhook/i',$l) && count($o['adapt']??array())<25) $o['adapt'][]=($n+1).' '.trim(mb_substr($l,0,140)); } } }
  // kur registruojamas sender webhook REST
  $it2=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir,FilesystemIterator::SKIP_DOTS));
  foreach($it2 as $f){ if(substr($f,-4)!=='.php') continue; $s=file_get_contents($f);
    if(stripos($s,'register_rest_route')!==false && (stripos($s,'sender')!==false||stripos($s,'webhook')!==false)){
      foreach(explode("\n",$s) as $n=>$l){ if(stripos($l,'register_rest_route')!==false && count($o['reg']??array())<15) $o['reg'][]=basename($f).':'.($n+1).' '.trim(mb_substr($l,0,150)); } } }
  wp_send_json($o);
});
