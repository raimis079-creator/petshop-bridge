<?php
/** TEMP PS S1643 I — READ-ONLY: iki kokios datos sukelta senos sistemos pardavimų istorija. */
add_action('init', function(){
  if (!isset($_GET['ps_s1643i'])) return;
  $o=array('v'=>'S1643 I'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");

  $tabs=array('ps_ist_uzsakymai','ps_ist_eilutes','ps_ist_fakt_uzsakymai','ps_ist_fakt_eilutes','ps_v_analize_uzsakymai','ps_v_analize_eilutes','ps_fakt_uzsakymai','ps_fakt_eilutes','ps_kl_suvestine','ps_dim_klientai','ps_fakt_atsargos_d','ps_ataskaitu_dienos','ps_fakt_kainos');
  foreach($tabs as $t){
    $T=$p.$t; if(!$wpdb->get_var("SHOW TABLES LIKE '$T'")) continue;
    $cols=$wpdb->get_col("SHOW COLUMNS FROM `$T`");
    $dc=null; foreach(array('data','date','sukurta','date_created','order_date','diena','dt','created_at','date_added') as $g){ foreach($cols as $c){ if(strtolower($c)===$g){ $dc=$c; break 2; } } }
    if(!$dc) foreach($cols as $c){ if(preg_match('/dat|diena|laik/i',$c)){ $dc=$c; break; } }
    $r=array('n'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM `$T`"),'stulpeliai'=>implode(',',array_slice($cols,0,14)));
    if($dc){ $r['datos_stulp']=$dc; $r['min']=$wpdb->get_var("SELECT MIN(`$dc`) FROM `$T`"); $r['max']=$wpdb->get_var("SELECT MAX(`$dc`) FROM `$T`"); }
    $nc=null; foreach($cols as $c){ if(preg_match('/^(nr|numeris|order_id|uzsakymo_nr|ext_id|saltinio_nr|isorinis)/i',$c)){ $nc=$c; break; } }
    if($nc){ $r['nr_stulp']=$nc; $r['nr_max']=$wpdb->get_var("SELECT MAX(`$nc`+0) FROM `$T`"); $r['nr_pvz']=$wpdb->get_col("SELECT `$nc` FROM `$T` ORDER BY id DESC LIMIT 5"); }
    $o[$t]=$r;
  }
  $o['ping']=wp_remote_retrieve_response_code(wp_remote_get(home_url('/'),array('timeout'=>30,'sslverify'=>false)));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
