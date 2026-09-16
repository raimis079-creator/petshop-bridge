<?php
/** TEMP PS S1688 c — read-only: T-0 partijos (eShoprent pradinis likutis) prekėms be VF meta ir su likučiu — pagal gamintoją; Exclusion 4 su EAN → VF observer atitikmuo. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688c'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1688 c');
  $rows=$wpdb->get_results("SELECT pa.product_id id,pa.kiekis_gautas g,pa.kiekis_liko l,pa.savikaina_eur sav,(SELECT meta_value FROM {$p}postmeta WHERE post_id=pa.product_id AND meta_key='_legacy_manufacturer') gam,(SELECT meta_value FROM {$p}postmeta WHERE post_id=pa.product_id AND meta_key='_stock') st,(SELECT meta_value FROM {$p}postmeta WHERE post_id=pa.product_id AND meta_key='_ps_sandelis') sand,(SELECT COUNT(*) FROM {$p}postmeta WHERE post_id=pa.product_id AND meta_key='_vf_supplier_sku') vf FROM {$p}ps_partijos pa WHERE pa.pastaba='Pradinis likutis T-0' AND pa.atsaukta=0 AND pa.kiekis_liko>0",ARRAY_A);
  $o['t0_viso']=count($rows); $g=array(); foreach($rows as $r){ $k=($r['gam']?:'?').' | vf='.($r['vf']?'taip':'ne').' | '.$r['sand']; $g[$k]['n']=($g[$k]['n']??0)+1; $g[$k]['vnt']=($g[$k]['vnt']??0)+(int)$r['l']; $g[$k]['eur']=round(($g[$k]['eur']??0)+(float)$r['l']*(float)$r['sav']); }
  ksort($g); $o['pagal_gam']=$g;
  foreach(array(18551,18545,18548) as $id){ $ean=get_post_meta($id,'_ean',true); $sku=get_post_meta($id,'_sku',true); $o['excl'][$id]=array('sku'=>$sku,'ean'=>$ean,'vf_obs'=>$wpdb->get_results($wpdb->prepare("SELECT sku,title,decision,reason FROM {$p}vf_observer WHERE title LIKE %s ORDER BY id DESC LIMIT 3",'%'.$wpdb->esc_like(mb_substr(get_the_title($id),10,40)).'%'),ARRAY_A)); }
  $o['excl4']=$wpdb->get_results("SELECT po.ID,po.post_title,(SELECT meta_value FROM {$p}postmeta WHERE post_id=po.ID AND meta_key='_stock') st,(SELECT meta_value FROM {$p}postmeta WHERE post_id=po.ID AND meta_key='_sku') sku FROM {$p}posts po JOIN {$p}postmeta s ON s.post_id=po.ID AND s.meta_key='_ps_sandelis' AND s.meta_value='av' WHERE po.post_type='product' AND po.post_title LIKE 'Exclusion%' AND NOT EXISTS (SELECT 1 FROM {$p}postmeta v WHERE v.post_id=po.ID AND v.meta_key='_vf_supplier_sku')",ARRAY_A);
  $o['e']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
