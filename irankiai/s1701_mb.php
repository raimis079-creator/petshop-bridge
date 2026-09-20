<?php
/** Plugin Name: TEMP PS S1701 shipping/return recon (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1701'])||$_GET['ps_s1701']!=='1') return;
  header('Content-Type: application/json; charset=utf-8'); $o=array();
  foreach(WC_Shipping_Zones::get_zones() as $z){ $m=array(); foreach($z['shipping_methods'] as $sm){ $m[]=array('id'=>$sm->id,'title'=>$sm->get_title(),'enabled'=>$sm->enabled,'cost'=>$sm->get_option('cost'),'min'=>$sm->get_option('min_amount'),'req'=>$sm->get_option('requires'),'inst'=>$sm->get_instance_id()); } $o['zones'][]=array('name'=>$z['zone_name'],'loc'=>wp_list_pluck($z['zone_locations'],'code'),'methods'=>$m); }
  $o['rest']=array(); foreach(WC_Shipping_Zones::get_zone(0)->get_shipping_methods() as $sm){ $o['rest'][]=array($sm->id,$sm->get_title(),$sm->enabled,$sm->get_option('cost')); }
  // Venipak plugino tarifai
  $vo=array(); foreach(wp_load_alloptions() as $k=>$v){ if(stripos($k,'venipak')!==false) $vo[$k]=substr($v,0,200); } $o['venipak_opt']=array_slice($vo,0,15,true);
  foreach(array('pristatymas','grazinimas','taisykles','privatumo-politika','apie-mus','kontaktai') as $p){ $pg=get_page_by_path($p); $o['pages'][$p]=$pg?array($pg->ID,$pg->post_status,mb_substr(wp_strip_all_tags($pg->post_content),0,600)):null; }
  $o['rm_llms']=array(get_option('rank_math_llms_txt'), get_option('rank-math-options-general')['llms_txt']??null);
  $o['logo']=array(get_theme_mod('custom_logo'), wp_get_attachment_url((int)get_theme_mod('custom_logo')), get_option('rank-math-options-titles')['knowledgegraph_logo']??null);
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
