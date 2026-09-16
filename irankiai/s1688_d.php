<?php
/** TEMP PS S1688 d — 4 Exclusion (18545,18548,18551,18623): T-0 partija atšaukta, likutis 0, _ps_sandelis=vf, prekės pastaba; bak opcija ps_s1688_excl_bak; VF feed šaltinis + „Intestinal/Hepatic" atitikmenys. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688d'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1688 d'); $ids=array(18545,18548,18551,18623); $bak=array();
  foreach($ids as $id){ $pr=wc_get_product($id); $pa=$wpdb->get_results($wpdb->prepare("SELECT id,kiekis_gautas,kiekis_liko FROM {$p}ps_partijos WHERE product_id=%d AND atsaukta=0",$id),ARRAY_A);
    $bak[$id]=array('stock'=>$pr->get_stock_quantity(),'sandelis'=>$pr->get_meta('_ps_sandelis'),'partijos'=>$pa);
    foreach($pa as $x) $wpdb->update($p.'ps_partijos',array('atsaukta'=>1,'pastaba'=>'Pradinis likutis T-0 — ATŠAUKTA S1688: VF prekė, ne AV'),array('id'=>$x['id']));
    $pr->set_stock_quantity(0); $pr->set_stock_status('outofstock'); $pr->update_meta_data('_ps_sandelis','vf'); $pr->save();
    wp_insert_comment(array('comment_post_ID'=>$id,'comment_type'=>'note','comment_content'=>'S1688: klaidingas AV likutis iš T-0 importo ('.$bak[$id]['stock'].' vnt.) panaikintas, partija atšaukta, sandėlis → VF. Laukia VF susiejimo.','user_id'=>0,'comment_author'=>'Claude','comment_approved'=>1));
    $pr=wc_get_product($id); $o['po'][$id]=$pr->get_sku().' stock='.$pr->get_stock_quantity().' sand='.$pr->get_meta('_ps_sandelis').' st='.$pr->get_stock_status(); }
  if(!get_option('ps_s1688_excl_bak')) add_option('ps_s1688_excl_bak',$bak,'',false);
  $o['vf_opts']=$wpdb->get_col("SELECT CONCAT(option_name,' | ',LEFT(option_value,120)) FROM {$p}options WHERE (option_name LIKE '%vf%' OR option_name LIKE '%vetfarm%') AND option_name NOT LIKE '_transient%' AND option_value LIKE '%http%' LIMIT 6");
  $u=wp_upload_dir(); foreach(glob($u['basedir'].'/{,*/,*/*/}*{vf,vetfarm,VF}*.{xml,csv,json}',GLOB_BRACE) as $f) $o['vf_files'][]=str_replace($u['basedir'],'',$f).' '.round(filesize($f)/1024).'K '.date('m-d H:i',filemtime($f));
  $o['obs_intest']=$wpdb->get_results("SELECT DISTINCT sku,title FROM {$p}vf_observer WHERE title LIKE '%Intestinal%' OR title LIKE '%Hepatic%' LIMIT 12",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
