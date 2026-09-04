<?php
/** TEMP PS S1613 run e8r — R (tik skaitymas): V13 recon — Petshop_AV_Dropship::perduotos() šaltinis ir reikšmės, `_ps_dropship_sent_src` rašymas (kons „Kartu su Dropshipping“ laiškas), variklio sargas petshop-dropship-sargas.php, užsakymai su _ps_sla_velavimas */
add_action('init', function(){
  if (!isset($_GET['ps_e8r'])) return;
  $o=array('v'=>'S1613 e8r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $src=function($cls,$m,$max=3000){ try{ $r=new ReflectionMethod($cls,$m); $ls=file($r->getFileName()); $c=implode('',array_slice($ls,$r->getStartLine()-1,$r->getEndLine()-$r->getStartLine()+1)); return array('f'=>basename($r->getFileName()),'l'=>$r->getStartLine().'-'.$r->getEndLine(),'kodas'=>mb_substr($c,0,$max)); }catch(Throwable $e){ return 'ERR '.$e->getMessage(); } };
  try{
    $o['perduotos_src']=$src('Petshop_AV_Dropship','perduotos',2500);
    $o['sent_src_rasymas']=array(); foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $fi){ if(basename($fi)==='petshop-darbalaukis.php') continue; $ls=file($fi); foreach($ls as $i=>$l){ if(strpos($l,'_ps_dropship_sent_src')!==false||strpos($l,'_ps_dropship_sent')!==false&&strpos($l,'update_meta')!==false){ $o['sent_src_rasymas'][]=basename($fi).':'.($i+1).' '.mb_substr(trim($l),0,240); } } }
    $sf=WPMU_PLUGIN_DIR.'/petshop-dropship-sargas.php'; $o['sargas']=file_exists($sf)?array('dydis'=>filesize($sf),'md5'=>md5_file($sf),'antraste'=>mb_substr(file_get_contents($sf),0,1800)):'nera';
    $o['sla_uzs']=$wpdb->get_results("SELECT m.order_id id, o.status, LEFT(m.meta_value,80) v FROM {$p}wc_orders_meta m JOIN {$p}wc_orders o ON o.id=m.order_id WHERE m.meta_key='_ps_sla_velavimas' ORDER BY m.order_id DESC LIMIT 20",ARRAY_A);
    $o['sent_uzs']=$wpdb->get_results("SELECT m.order_id id, o.status, m.meta_key k, LEFT(m.meta_value,160) v FROM {$p}wc_orders_meta m JOIN {$p}wc_orders o ON o.id=m.order_id WHERE m.meta_key IN ('_ps_dropship_sent','_ps_dropship_sent_src') AND o.status='wc-processing' ORDER BY m.order_id DESC LIMIT 30",ARRAY_A);
    foreach(array(35421,35441,35418,35420) as $id){ $x=wc_get_order($id); if($x){ $o['perd'][$id]=array('st'=>$x->get_status(),'perduotos'=>Petshop_AV_Dropship::perduotos($x),'iss'=>(string)$x->get_meta('_ps_dalys_issiusta'),'sla'=>(string)$x->get_meta('_ps_sla_velavimas'),'kl'=>Petshop_Desk::klausimas($x)); } }
    $o['desk_klausimas']=$src('Petshop_Desk','klausimas',2200);
    $o['now']=current_time('mysql');
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $J($o);
},99);
