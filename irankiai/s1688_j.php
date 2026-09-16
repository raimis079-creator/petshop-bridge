<?php
/** TEMP PS S1688 j — #1081 vidinė pastaba (id pagal numerį) + pilnas T-0 fiktyvių likučių skenas: prekės su T-0 partija (liko>0), be VF meta, kurių gamintojas turi VF-susietų prekių arba VF feed'e yra brand'as. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688j'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1688 j');
  $id=$wpdb->get_var("SELECT order_id FROM {$p}wc_orders_meta WHERE meta_key='_ps_order_number' AND meta_value='1081'"); if(!$id){ foreach($wpdb->get_col("SELECT id FROM {$p}wc_orders WHERE type='shop_order' AND status='wc-processing'") as $i) if(wc_get_order($i)->get_order_number()=='1081'){ $id=$i; break; } }
  if($id){ $w=wc_get_order($id); $w->add_order_note('S1688: prekė INPS06 (Exclusion Intestinal 7 kg) NĖRA nei AV, nei VF — AV likutis buvo fiktyvus iš T-0 importo. Klientei rašo Raimis pats. NESIŲSTI.',false,true); $o['note']=$id; }
  $u=wp_upload_dir(); $x=simplexml_load_file($u['basedir'].'/petshop-vf-cache.xml'); $vfb=array(); $vfbc=array(); $vfn=array(); foreach($x->row as $it){ $b=mb_strtoupper(trim((string)$it->brand)); $vfb[$b]=($vfb[$b]??0)+1; $bc=preg_replace('/\D/','',(string)$it->barcode); if($bc&&$bc!=='000000000000') $vfbc[$bc]=(string)$it->sku_id.' | '.mb_substr((string)$it->product_name,0,60).' | qty '.(string)$it->qty; }
  $rows=$wpdb->get_results("SELECT pa.product_id id,pa.kiekis_liko l,pa.savikaina_eur sav,po.post_title t,po.post_status st,(SELECT meta_value FROM {$p}postmeta WHERE post_id=pa.product_id AND meta_key='_legacy_manufacturer') gam,(SELECT meta_value FROM {$p}postmeta WHERE post_id=pa.product_id AND meta_key='_ean') ean,(SELECT meta_value FROM {$p}postmeta WHERE post_id=pa.product_id AND meta_key='_ps_sandelis') sand FROM {$p}ps_partijos pa JOIN {$p}posts po ON po.ID=pa.product_id WHERE pa.pastaba LIKE 'Pradinis likutis T-0%' AND pa.atsaukta=0 AND pa.kiekis_liko>0 AND NOT EXISTS (SELECT 1 FROM {$p}postmeta v WHERE v.post_id=pa.product_id AND v.meta_key='_vf_supplier_sku')",ARRAY_A);
  foreach($rows as $r){ $g=mb_strtoupper(trim((string)$r['gam'])); $e=preg_replace('/\D/','',(string)$r['ean']); $hit=null; if($e){ foreach(array($e,substr($e,0,-1)) as $k) if(isset($vfbc[$k])){ $hit=$vfbc[$k]; break; } }
    $bv=false; foreach($vfb as $vb=>$n){ if($g && ($vb===$g || strpos($vb,$g)!==false || strpos($g,$vb)!==false)) { $bv=true; break; } }
    if($hit) $o['A_ean_vf'][]=$r['id'].' | '.mb_substr($r['t'],0,55).' | liko '.$r['l'].' | '.$r['gam'].' | VF: '.$hit;
    elseif($bv) $o['B_brand_vf'][$g][]=$r['id'].' | '.mb_substr($r['t'],0,55).' | liko '.$r['l'].' | '.round($r['l']*$r['sav']).' €'; }
  $o['A_n']=count($o['A_ean_vf']??array()); $o['B_n']=array_map('count',$o['B_brand_vf']??array()); $o['viso_be_vf']=count($rows);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
