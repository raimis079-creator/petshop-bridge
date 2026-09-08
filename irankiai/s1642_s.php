<?php
/** TEMP PS S1642 s — savikainos 8 kortelems (Raimio lentele, faktūrine+15%).
 * R: perziura; A: rasom _cost_price tik jei esama < nauja arba tuscia.
 * Sargas: SKU==kodas ARBA zodziu sargas pavadinime. */
add_action('init', function(){
  if (!isset($_GET['ps_s1642'])) return;
  $f=$_GET['ps_s1642'];
  $o=array('v'=>'S1642 s '.$f); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $rows=array(
    array(19145,'10110',11.80,array('Trevi')),
    array(15928,'10528',4.00,array('Sonic')),
    array(15920,'10529',4.89,array('Colosseo')),
    array(15938,'10530',2.11,array('Shuttle','45')),
    array(15935,'10533',3.04,array('Shuttle','57')),
    array(17916,'10536',3.54,array('Shuttle')),
    array(15914,'10550',1.87,array('Lettiera')),
    array(15993,'10565',5.40,array('Rocket')),
  );
  foreach($rows as $r){ list($id,$sku,$nauja,$zod)=$r;
    $pr=get_post($id); $e=array('id'=>$id,'kodas'=>$sku,'nauja'=>$nauja);
    if(!$pr || $pr->post_type!=='product'){ $e['klaida']='nera product'; $o['eil'][]=$e; continue; }
    $e['pav']=$pr->post_title; $e['status']=$pr->post_status;
    $dbsku=get_post_meta($id,'_sku',true); $e['sku_db']=$dbsku;
    $e['sandelis']=get_post_meta($id,'_ps_sandelis',true);
    $cur=get_post_meta($id,'_cost_price',true); $e['cost_dabar']=($cur===''?null:$cur);
    $vf=get_post_meta($id,'_vf_cost',true); if($vf!=='') $e['vf_cost']=$vf;
    $zb=get_post_meta($id,'_zb_cost',true); if($zb!=='') $e['zb_cost']=$zb;
    if($dbsku===$sku){ $sarg='sku'; }
    else { $ok=true; foreach($zod as $z){ if(stripos($pr->post_title,$z)===false){$ok=false;break;} } $sarg=$ok?'zodziai':''; }
    if($sarg===''){ $e['veiksmas']='SKIP sargas nepraejo'; $o['eil'][]=$e; continue; }
    $e['sargas']=$sarg;
    $curf=($cur===''||$cur===null)?null:(float)str_replace(',','.', (string)$cur);
    $rasyti=($curf===null || $curf<$nauja);
    if($f==='A'){
      if($rasyti){ update_post_meta($id,'_cost_price',number_format($nauja,4,'.','')); $e['veiksmas']='IRASYTA'; }
      else $e['veiksmas']='PALIKTA (esama >= nauja)';
      $e['cost_po']=get_post_meta($id,'_cost_price',true);
    } else { $e['veiksmas']=$rasyti?'RASYTU':'PALIKTU'; }
    $o['eil'][]=$e;
  }
  if($f==='A') wp_cache_flush();
  wp_send_json($o);
},1);
