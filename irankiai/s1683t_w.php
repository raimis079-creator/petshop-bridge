<?php
/** TEMP PS S1683t w — #18054 persieti su VF JOS0793 (meta iš #21707), kaina 40.89, publikuoti; #21707 → draft; bak meta į opciją ps_s1683_18054_bak; rasti 301 mechanizmą. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683tw'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'w');
  $a=wc_get_product(18054); $b=wc_get_product(21707);
  $keys=array('_vf_supplier_sku','_vf_barcode','_vf_cost','_vf_personal_cost','_vf_cost_xml','_vf_personal_xml','_vf_category_raw','_vf_supplier_discount','_vf_brand_raw','_vf_brand_normalized','_vf_wc_sku');
  $bak=array('status'=>$a->get_status(),'price'=>$a->get_regular_price()); foreach($a->get_meta_data() as $m) if(strpos($m->key,'_vf_')===0||in_array($m->key,array('_petshop_needs_price_review','_petshop_price_review_reason'))) $bak['meta'][$m->key]=$m->value;
  if(!get_option('ps_s1683_18054_bak')) add_option('ps_s1683_18054_bak',$bak,'',false);
  foreach($keys as $k){ $v=$b->get_meta($k); if($v!=='') $a->update_meta_data($k,$v); }
  $a->update_meta_data('_vf_match_type','manual_s1683'); $a->update_meta_data('_vf_last_matched_import_post_id',21707); $a->delete_meta_data('_petshop_needs_price_review'); $a->delete_meta_data('_petshop_price_review_reason');
  $a->set_regular_price('40.89'); $a->set_sale_price(''); $a->set_status('publish'); $a->save();
  wp_insert_comment(array('comment_post_ID'=>18054,'comment_type'=>'note','comment_content'=>'S1683: VF susiejimas ištaisytas JOS0805 (400 g) → JOS0793 (10 kg), kaina 3,49 → 40,89; #21707 dublikatas paslėptas.','user_id'=>0,'comment_author'=>'Claude','comment_approved'=>1));
  $b->set_status('draft'); $b->set_catalog_visibility('hidden'); $b->save();
  $a=wc_get_product(18054); $o['18054']=array('st'=>$a->get_status(),'price'=>$a->get_price(),'sku'=>$a->get_meta('_vf_supplier_sku'),'bc'=>$a->get_meta('_vf_barcode'),'cost'=>$a->get_meta('_vf_cost'),'xml'=>$a->get_meta('_vf_cost_xml'),'url'=>get_permalink(18054));
  $o['21707']=array('st'=>get_post_status(21707),'slug'=>$b->get_slug());
  foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $f){ $s=file_get_contents($f); if(preg_match('/wp_redirect\(.*301|ps_redirect|nukreipim/i',$s)) $o['redir'][basename($f)]=array_slice(array_map(function($x){return substr(trim($x),0,150);},preg_grep('/ps_redirect|nukreipim|301/i',explode("\n",$s))),0,6); }
  $o['redir_opt']=$wpdb->get_col("SELECT option_name FROM {$p}options WHERE option_name LIKE '%redirect%' OR option_name LIKE '%nukreip%' LIMIT 10");
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
