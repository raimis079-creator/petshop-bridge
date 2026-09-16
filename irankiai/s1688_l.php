<?php
/** TEMP PS S1688 l — Prins (visos) ir Green Petfood: T-0 partijos atšauktos, likutis 0, outofstock, prekės pastaba; bak opcija ps_s1688_prins_bak; sąrašas. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688l'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1688 l');
  $ids=$wpdb->get_col("SELECT DISTINCT pa.product_id FROM {$p}ps_partijos pa JOIN {$p}posts po ON po.ID=pa.product_id WHERE pa.pastaba LIKE 'Pradinis likutis T-0%' AND pa.atsaukta=0 AND pa.kiekis_liko>0 AND NOT EXISTS (SELECT 1 FROM {$p}postmeta v WHERE v.post_id=pa.product_id AND v.meta_key='_vf_supplier_sku') AND (po.post_title LIKE 'Prins%' OR po.post_title LIKE 'Green Petfood%' OR EXISTS (SELECT 1 FROM {$p}postmeta g WHERE g.post_id=pa.product_id AND g.meta_key='_legacy_manufacturer' AND (g.meta_value LIKE 'Prins%' OR g.meta_value LIKE 'GREENPET%')))");
  $bak=array(); foreach($ids as $id){ $pr=wc_get_product($id); if(!$pr) continue; $pa=$wpdb->get_results($wpdb->prepare("SELECT id,kiekis_liko FROM {$p}ps_partijos WHERE product_id=%d AND atsaukta=0",$id),ARRAY_A);
    $bak[$id]=array('t'=>$pr->get_name(),'stock'=>$pr->get_stock_quantity(),'partijos'=>$pa);
    foreach($pa as $x) $wpdb->update($p.'ps_partijos',array('atsaukta'=>1,'pastaba'=>'Pradinis likutis T-0 — ATŠAUKTA S1688: AV šios prekės neturi (Raimis 09-16)'),array('id'=>$x['id']));
    $pr->set_stock_quantity(0); $pr->set_stock_status('outofstock'); $pr->save();
    wp_insert_comment(array('comment_post_ID'=>$id,'comment_type'=>'note','comment_content'=>'S1688: fiktyvus AV likutis iš T-0 importo ('.$bak[$id]['stock'].' vnt.) panaikintas, partija atšaukta — Raimis: AV šios prekės neturi.','user_id'=>0,'comment_author'=>'Claude','comment_approved'=>1));
    $o['padaryta'][]=$id.' '.mb_substr($pr->get_name(),0,50).' ('.$bak[$id]['stock'].' → 0)'; }
  if(!get_option('ps_s1688_prins_bak')) add_option('ps_s1688_prins_bak',$bak,'',false); $o['n']=count($o['padaryta']??array());
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
