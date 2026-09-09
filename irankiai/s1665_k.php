<?php
/** TEMP PS S1665 k — READ-ONLY: petshop-fakt-reklama.php REST kontraktas + raktas. */
add_action('init', function(){
  if (!isset($_GET['ps_s1665k'])) return;
  $o=array('v'=>'S1665 k');
  $f=WPMU_PLUGIN_DIR.'/petshop-fakt-reklama.php';
  $s=file_get_contents($f); $ls=explode("\n",$s);
  foreach($ls as $n=>$l){ if(preg_match('/register_rest_route|get_option|raktas|key|ads/i',$l) && count($o['eil']??array())<40) $o['eil'][]=($n+1).' '.trim(mb_substr($l,0,150)); }
  // rasti REST callback bloka
  $i=strpos($s,"register_rest_route");
  $o['blokas']=array_map('trim',array_slice($ls, substr_count(substr($s,0,$i),"\n"), 60));
  $o['raktas']=get_option('ps_ads_webhook_raktas', get_option('ps_fakt_ads_raktas',''));
  wp_send_json($o);
});
