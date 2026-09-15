<?php
/** TEMP PS S1683t ad — #18054: nuimti ranka žymę (Raimio nurodymu), publikuoti, SKU JOS0805→JOS0793 (21707 → JOS0793-dubl); patikra. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683tad'])) return; global $wpdb; $o=array('v'=>'ad');
  $b=wc_get_product(21707); if($b->get_sku()==='JOS0793'){ $b->set_sku('JOS0793-dubl-21707'); $b->save(); }
  foreach(array('_ps_ranka_isimta','_ps_ranka_isimta_kada','_ps_ranka_isimta_kas') as $k) delete_post_meta(18054,$k);
  $a=wc_get_product(18054); $a->set_sku('JOS0793'); $a->save();
  $r=wp_update_post(array('ID'=>18054,'post_status'=>'publish'),true); $o['upd']=is_wp_error($r)?$r->get_error_message():$r; clean_post_cache(18054); wc_delete_product_transients(18054);
  wp_insert_comment(array('comment_post_ID'=>18054,'comment_type'=>'note','comment_content'=>'S1683: publikuota Raimio nurodymu (Claude), SKU JOS0805 → JOS0793.','user_id'=>0,'comment_author'=>'Claude','comment_approved'=>1));
  $a=wc_get_product(18054); $o['po']=array('status'=>get_post_status(18054),'sku'=>$a->get_sku(),'price'=>$a->get_price(),'stock'=>$a->get_stock_quantity(),'visible'=>$a->is_visible(),'purchasable'=>$a->is_purchasable(),'url'=>get_permalink(18054),'ranka'=>get_post_meta(18054,'_ps_ranka_isimta',true));
  $o['21707_sku']=wc_get_product(21707)->get_sku();
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
