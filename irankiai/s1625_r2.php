<?php
/** TEMP PS S1625 r2 — RECON: Venipak plugino nustatymai (siuntėjas), kaip mūsų variklis ima siuntėją (tiekimas $snd, dropship/desk vp_reg), ps_tiekimas venipak_pack, ps_shipments. */
add_action('init', function(){
  if (!isset($_GET['ps_r10'])) return;
  $o=array('v'=>'S1625 r2'); global $wpdb; $p=$wpdb->prefix; set_time_limit(120);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $o['vp_options']=$wpdb->get_results("SELECT option_name,LEFT(option_value,600) v FROM {$p}options WHERE option_name LIKE '%venipak%' AND option_name NOT LIKE '_transient%'",ARRAY_A);
  $L=explode("\n",(string)file_get_contents(WPMU_PLUGIN_DIR.'/petshop-av-tiekimas.php')); $r=array(); for($i=935;$i<970;$i++){ $r[]=($i+1).': '.mb_substr(rtrim($L[$i]),0,200); } $o['tiek_snd']=$r;
  $hits=array(); foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $fp){ $c=(string)file_get_contents($fp); $L=explode("\n",$c); foreach($L as $k=>$l){ if(preg_match('/sendercontactperson|sender_contact_person|get_option_by_key|shopup_venipak_shipping_field_sender|dezes|pack_count|packages/i',$l) && preg_match('/venipak|pack|dez/i',$l)) $hits[]=basename($fp).':'.($k+1).': '.mb_substr(trim($l),0,170); } } $o['sender_kode']=array_slice($hits,0,40);
  $o['tiek_vp']=$wpdb->get_results("SELECT id,tiekejas,busena,pristatymas,venipak_pack,venipak_manifest FROM {$p}ps_tiekimas",ARRAY_A); $o['ps_shipments']=$wpdb->get_results("SELECT * FROM {$p}ps_shipments ORDER BY id DESC LIMIT 5",ARRAY_A);
  $o['ivykiai_siandien']=$wpdb->get_results("SELECT laikas,uzsakymas,veiksmas,rezultatas,LEFT(pastaba,100) pastaba FROM {$p}ps_uzsakymu_ivykiai WHERE laikas>'2026-09-06 17:00' ORDER BY id DESC LIMIT 25",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
