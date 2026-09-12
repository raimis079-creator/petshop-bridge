<?php
/** TEMP PS S1677 k — read-only: fakt lentelių struktūra ir apimtis. */
add_action('init', function(){
  if (!isset($_GET['ps_s1677k'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1677 k');
  foreach(array('ps_fakt_uzsakymai','ps_fakt_siuntos','ps_tarifai','ps_fakt_reklama','ps_fakt_eilutes') as $t){
    $c=$wpdb->get_col("SHOW COLUMNS FROM {$p}$t"); if(!$c){ $o[$t]='NERA'; continue; }
    $r=array('stulp'=>implode(',',$c),'n'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}$t"));
    foreach(array('sukurta','data','diena','created_at','galioja_nuo') as $d) if(in_array($d,$c,true)){ $r['nuo_iki']=$wpdb->get_row("SELECT MIN($d) a,MAX($d) b FROM {$p}$t",ARRAY_A); break; }
    $o[$t]=$r; }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
