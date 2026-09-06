<?php
/** TEMP PS S1623 r — RECON (tik skaitymas): ar Tiekimo `priimti()` kuria `ps_partijos` (savikaina); ką rašo Gavimo langas; Prekių lango „užsakyti“ veiksmas; tiekimo lango unikalūs veiksmai. */
add_action('init', function(){
  if (!isset($_GET['ps_r3'])) return;
  $o=array('v'=>'S1623 r'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $g=function($file,$re,$max=40){ $L=explode("\n",(string)file_get_contents($file)); $r=array(); foreach($L as $k=>$l){ if(preg_match($re,$l)) $r[]=($k+1).': '.mb_substr(trim($l),0,170); if(count($r)>=$max) break; } return $r; };
  $tf=WPMU_PLUGIN_DIR.'/petshop-av-tiekimas.php'; $o['tiek_priimti']=$g($tf,'/function priimti|Petshop_Partij|ps_partijos|savikain|Petshop_AV_Stock::increase|likuciu_perziura|function eilutes_veiksmas|ka=|\$_POST\[.ka.\]/i');
  $gf=WPMU_PLUGIN_DIR.'/petshop-gavimas.php'; $o['gav_yra']=file_exists($gf); if($o['gav_yra']) $o['gav']=$g($gf,'/Petshop_Partij|ps_partijos|savikain|Petshop_AV_Stock|wpdb->insert|admin_post_|function /i',45);
  $pf=WPMU_PLUGIN_DIR.'/petshop-partijos.php'; $o['part_yra']=file_exists($pf); if($o['part_yra']) $o['part']=$g($pf,'/public static function|CREATE TABLE|nurasyti|trūksta|truksta/i',30);
  foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $fp){ $c=(string)file_get_contents($fp); if(strpos($c,'reikia užsakyti')!==false||strpos($c,"'ps-prekes'")!==false||strpos($c,'page=ps-prekes')!==false){ $o['prekes_failai'][]=basename($fp); } }
  if(!empty($o['prekes_failai'])){ $o['prekes']=$g(WPMU_PLUGIN_DIR.'/'.$o['prekes_failai'][0],'/tiekimo lentel|ideti_eilute|atvira_partija|admin_post_|Į užsakymą|uzsakyti/i',25); }
  $o['sandelis_meta']=$wpdb->get_results("SELECT meta_value sand,COUNT(*) n FROM {$p}postmeta WHERE meta_key='_ps_sandelis' GROUP BY meta_value",ARRAY_A);
  $o['tiekejai_prekiu']=$wpdb->get_results("SELECT meta_key,COUNT(*) n FROM {$p}postmeta WHERE meta_key IN ('_vf_qty','_zb_cost','_prins_qty','_belcor_qty','_quattro_qty','_ambrosia_qty','_ps_tiekejas') GROUP BY meta_key",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
