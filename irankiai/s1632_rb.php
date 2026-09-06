<?php
/** TEMP PS S1632 run rb — RB: tiekėjo (ZB/VF) prekių ROLLBACK (Raimio sprendimas: jų likučių nekeliam):
 * _own_stock_qty atstatoma iš ps_s1632_bak, S1632 partijos toms prekėms trinamos, _cost_price perskaičiuojamas.
 * Grąžina paveiktų sąrašą Excel'iui (sandelis, sku, pavadinimas, eshoprent_q, savikaina). */
add_action('init', function(){
  if (!isset($_GET['ps_s1632rb'])) return;
  $o=array('v'=>'S1632 rb'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $bak=get_option('ps_s1632_bak',array()); $seen=get_option('ps_s1632_seen',array());
  $n=0; $sar=array(); $klaidos=array();
  foreach($bak as $pid=>$b){ if(!isset($b['o'])) continue; // tik paprastos (variacijos turi tik 's')
    $vf=get_post_meta($pid,'_vf_qty',true)!==''; $zb=get_post_meta($pid,'_zb_qty',true)!=='';
    if(!$vf && !$zb) continue;
    $sena=$b['o'];
    if($sena==='') delete_post_meta($pid,'_own_stock_qty'); else update_post_meta($pid,'_own_stock_qty',(int)$sena);
    $ist=(int)$wpdb->query($wpdb->prepare("DELETE FROM {$p}ps_partijos WHERE product_id=%d AND pastaba LIKE 'Pradinis likutis (testas S1632)%%'",$pid));
    if(class_exists('Petshop_Partijos')) Petshop_Partijos::perskaiciuoti_savikaina($pid);
    $n++;
    $q=isset($seen[$pid])?(int)$seen[$pid][0]:0; $sav=isset($seen[$pid])?(float)$seen[$pid][1]:0;
    if($sav<=0)$sav=(float)get_post_meta($pid,'_cost_price',true);
    $sar[]=array($vf?'VF':'ZB',(string)get_post_meta($pid,'_sku',true),html_entity_decode(get_the_title($pid),ENT_QUOTES),$q,$sav,($sena===''?0:(int)$sena));
  }
  $o['atstatyta']=$n; $o['sarasas']=$sar;
  $o['partiju_s1632_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_partijos WHERE pastaba LIKE 'Pradinis likutis (testas S1632)%'");
  $o['ping']=wp_remote_retrieve_response_code(wp_remote_get(home_url('/'),array('timeout'=>30,'sslverify'=>false)));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
