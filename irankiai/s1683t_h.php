<?php
/** TEMP PS S1683t h — read-only: kur gimsta „Trūksta sandėlyje" (klausimas) ir kaip skaičiuojamas. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683th'])) return; $o=array('v'=>'S1683t h');
  foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $f){ $s=file_get_contents($f); if(strpos($s,'Trūksta sandėlyje')!==false||strpos($s,'truksta_sandelyje')!==false){ $l=explode("\n",$s); $n=basename($f); $o[$n]['md5']=md5($s); foreach($l as $i=>$ln) if(preg_match('/Trūksta sandėlyje|truksta_sandelyje|function klausimas|_reduced_stock|_ps_av_reduced_qty/',$ln)) $o[$n]['eil'][]=($i+1).': '.substr(trim($ln),0,300); } }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
