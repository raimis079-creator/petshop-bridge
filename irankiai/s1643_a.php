<?php
/** TEMP PS S1643 A — parduotų DELTA apply: 12 grynų AV eilučių (12099–12106). Sargai: _ps_sandelis='av', vf/zb tuščios, manage_stock=yes, laukiamas senas stock. */
add_action('init', function(){
  if (!isset($_GET['ps_s1643a'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_s1643a'])); $o=array('v'=>'S1643 A','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");

  // sku;pid;buvo;kiekis
  $D="5414365260569;15527;13;1
83722;19708;20;3
83721;19685;35;3
83967;19613;27;3
704001;18131;7;1
G378;17644;1;1
82767;19578;63;2
82765;19479;143;2
82764;19488;20;2
82741;19598;103;2
82804;19562;56;2
G377;17641;5;1";

  $r=array(); $ok=0; $skip=0; $sum=0;
  foreach(array_filter(explode("\n",$D)) as $l){
    $c=explode(';',$l); $s=trim($c[0]); $pid=(int)$c[1]; $buvo=(int)$c[2]; $q=(int)$c[3];
    $x=array('sku'=>$s,'pid'=>$pid,'q'=>$q);
    if(trim((string)get_post_meta($pid,'_sku',true))!==$s){ $x['skip']='SKU nesutampa'; $r[]=$x; $skip++; continue; }
    if(get_post_meta($pid,'_ps_sandelis',true)!=='av'){ $x['skip']='ne av'; $r[]=$x; $skip++; continue; }
    $vf=get_post_meta($pid,'_vf_qty',true); $zb=get_post_meta($pid,'_zb_qty',true);
    if($vf!=='' || $zb!==''){ $x['skip']='vf/zb yra'; $r[]=$x; $skip++; continue; }
    if(get_post_meta($pid,'_manage_stock',true)!=='yes'){ $x['skip']='manage_stock ne yes'; $r[]=$x; $skip++; continue; }
    $db=(int)get_post_meta($pid,'_stock',true);
    if($db!==$buvo){ $x['skip']='stock pasikeite: db'.$db.' lauk'.$buvo; $r[]=$x; $skip++; continue; }
    if($f==='A'){
      $pr=wc_get_product($pid); $pr->set_manage_stock(true); $pr->set_stock_quantity($db-$q); $pr->save();
      $x['po']=(int)get_post_meta($pid,'_stock',true);
    }
    $x['buvo']=$db; $x['naujas']=$db-$q; $ok++; $sum+=$q; $r[]=$x;
  }
  $o['eilutes']=$r; $o['ok']=$ok; $o['skip']=$skip; $o['nurasyta_vnt']=$sum;
  $o['db_stock_suma']=(int)$wpdb->get_var("SELECT SUM(meta_value+0) FROM {$p}postmeta WHERE meta_key='_stock'");
  $o['ping']=wp_remote_retrieve_response_code(wp_remote_get(home_url('/'),array('timeout'=>30,'sslverify'=>false)));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
