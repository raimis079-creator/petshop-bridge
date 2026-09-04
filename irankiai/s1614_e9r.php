<?php
/** TEMP PS S1614 run e9r — RECON (tik skaitymas): kur variklis spausdina surinkimo lapą (`v=lapai`) ir kurias eilutes įtraukia. */
add_action('init', function(){
  if (!isset($_GET['ps_e9r'])) return;
  $o=array('v'=>'S1614 e9r'); global $wpdb, $wp_filter; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  try{
    foreach($wp_filter['admin_post_ps_desk_veiksmas']->callbacks as $pr=>$cbs){ foreach($cbs as $cb){ $fn=$cb['function']; $o['hooks'][]=$pr.' '.(is_array($fn)?(is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]:(is_string($fn)?$fn:'closure')); } }
    $dir=WPMU_PLUGIN_DIR; $hits=array(); foreach(glob($dir.'/*.php') as $f){ $ls=file($f); foreach($ls as $i=>$l){ if(preg_match("/'lapai'|lapas|surinkimo/i",$l)){ $hits[]=basename($f).':'.($i+1).': '.trim(mb_substr($l,0,170)); if(count($hits)>60) break 2; } } } $o['grep']=$hits;
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
