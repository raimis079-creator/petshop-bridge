<?php
/** TEMP PS S1676 run ae — T-0 „papildymas S1682“ partijos ≈ ZB/VF feed (±10 %) → atšaukti; AV: jei own ≥ partija → own−partija, kitaip (jau taisyta ranka) neliesti. Fazė D=dry, A=apply. Backup ps_s1676_papild_bak. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676ae'])) return; global $wpdb; $p=$wpdb->prefix; $F=$_GET['ps_s1676ae']; $o=array('v'=>'S1676 ae','faze'=>$F);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $rows=$wpdb->get_results("SELECT pa.id,pa.product_id pid,pa.kiekis_gautas k,pa.kiekis_liko liko,(SELECT meta_value FROM {$p}postmeta WHERE post_id=pa.product_id AND meta_key='_zb_qty') zb,(SELECT meta_value FROM {$p}postmeta WHERE post_id=pa.product_id AND meta_key='_vf_qty') vf,(SELECT meta_value FROM {$p}postmeta WHERE post_id=pa.product_id AND meta_key='_own_stock_qty') own,(SELECT meta_value FROM {$p}postmeta WHERE post_id=pa.product_id AND meta_key='_ps_sandelis') sand FROM {$p}ps_partijos pa WHERE pa.atsaukta=0 AND pa.pastaba LIKE '%papildymas, S1682%' ORDER BY pa.kiekis_gautas DESC",ARRAY_A);
  $o['viso']=count($rows); $plan=array(); $palikta=array();
  foreach($rows as $r){ $k=(int)$r['k']; $m=null; foreach(array('zb','vf') as $f){ $q=$r[$f]; if($q===null||$q==='') continue; $q=(int)$q; if($q>0 && abs($k-$q)<=max(1,round($q*0.10))) { $m=$f.'='.$q; break; } }
    if(!$m){ $palikta[]=$r['pid'].' k'.$k.' zb'.$r['zb'].' vf'.$r['vf']; continue; }
    $own=($r['own']===''||$r['own']===null)?null:(int)$r['own']; $naujas=null; $veiksmas='tik partija';
    if($own!==null && $own>=$k){ $naujas=$own-$k; $veiksmas='own '.$own.'→'.$naujas; } elseif($own!==null){ $veiksmas='own '.$own.' neliečiamas (jau taisyta)'; }
    $plan[]=array('id'=>(int)$r['id'],'pid'=>(int)$r['pid'],'pav'=>mb_substr(get_the_title($r['pid']),0,50),'k'=>$k,'feed'=>$m,'own'=>$own,'naujas'=>$naujas,'veiksmas'=>$veiksmas); }
  $o['keiciama']=count($plan); $o['paliekama']=count($palikta); $o['paliekama_pvz']=array_slice($palikta,0,15); $o['planas']=$plan;
  if($F==='A'){ update_option('ps_s1676_papild_bak',array('laikas'=>current_time('mysql'),'planas'=>$plan),false); $n=0;
    foreach($plan as $x){ $wpdb->query($wpdb->prepare("UPDATE {$p}ps_partijos SET atsaukta=1,kiekis_liko=0,pastaba=CONCAT(pastaba,' — ATŠAUKTA S1676: sutampa su tiekėjo feed (',%s,'), ne AV') WHERE id=%d",$x['feed'],$x['id'])); if($x['naujas']!==null){ update_post_meta($x['pid'],'_own_stock_qty',$x['naujas']); if(class_exists('Petshop_Ivykiai')) Petshop_Ivykiai::irasyti($x['pid'],'likutis',array('laukas'=>'_own_stock_qty','sena'=>(string)$x['own'],'nauja'=>(string)$x['naujas'],'op_nr'=>'S1676','pastaba'=>'T-0 papildymo partija '.$x['id'].' ('.$x['k'].' = '.$x['feed'].') atšaukta — feed kopija')); } wc_delete_product_transients($x['pid']); $n++; }
    $o['ivykdyta']=$n; }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
});
