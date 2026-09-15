<?php
/** TEMP PS S1683t ab — read-only: #18054 būklė po Raimio publikavimo — status, ranka žymė, likutis, matomumas, terms, Ivykiai/istorija, cache; kodėl „nerodo publikuojama". */
add_action('init', function(){
  if (!isset($_GET['ps_s1683tab'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'ab'); $id=18054; $pr=wc_get_product($id); $po=get_post($id);
  $o['post']=array('status'=>$po->post_status,'mod'=>$po->post_modified,'vis'=>$pr->get_catalog_visibility(),'stock'=>$pr->get_stock_quantity(),'st'=>$pr->get_stock_status(),'price'=>$pr->get_price(),'own'=>$pr->get_meta('_own_stock_qty'),'sandelis'=>$pr->get_meta('_ps_sandelis'),'ranka'=>$pr->get_meta('_ps_ranka_isimta'),'ranka_kada'=>$pr->get_meta('_ps_ranka_isimta_kada'),'vf_status'=>$pr->get_meta('_vf_status'),'terms_vis'=>wp_get_post_terms($id,'product_visibility',array('fields'=>'names')),'lookup'=>$wpdb->get_row("SELECT * FROM {$p}wc_product_meta_lookup WHERE product_id=$id",ARRAY_A));
  $o['ivykiai']=$wpdb->get_results("SELECT * FROM {$p}ps_ivykiai WHERE preke_id=$id ORDER BY id DESC LIMIT 8",ARRAY_A); if($wpdb->last_error){ $o['iv_e']=$wpdb->last_error; foreach($wpdb->get_results("SHOW TABLES LIKE '{$p}ps_ivyk%'",ARRAY_N) as $t) $o['iv_t'][]=$t[0]; }
  $o['front']=array('perm'=>get_permalink($id),'visible'=>$pr->is_visible(),'purchasable'=>$pr->is_purchasable(),'in_stock'=>$pr->is_in_stock());
  $s=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-katalogas.php'); preg_match_all('/^.*(publikuojama|Publikuojama|nepublikuo).*$/m',$s,$m); $o['kat_eil']=array_slice(array_map(function($x){return substr(trim($x),0,220);},$m[0]),0,12);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
