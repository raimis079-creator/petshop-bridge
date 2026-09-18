<?php
/** TEMP PS S1691 n — po perkėlimo: (1) 34889 _ps_sandelis atstatymas; (2) Super Cache išvalymas; (3) ar paslėpta prekė tikrai iškrenta iš katalogo (WC_Product_Query) ir kategorijos puslapio; (4) „Pranešti kai bus" forma paslėptos prekės puslapyje (be cache). */
add_action('init', function(){
  if (!isset($_GET['ps_s1691n'])) return; global $wpdb; $p=$wpdb->prefix; $o=array(); $wpdb->suppress_errors(true);
  delete_post_meta(34889,'_ps_sandelis'); clean_post_cache(34889); $o['t34889']=array('sandelis'=>get_post_meta(34889,'_ps_sandelis',true),'status'=>get_post_status(34889),'vis'=>wc_get_product(34889)->get_catalog_visibility());
  if (function_exists('wp_cache_clear_cache')) { wp_cache_clear_cache(); $o['supercache']='išvalyta'; } else $o['supercache']='funkcijos nėra';
  $hid=12453; $q=new WC_Product_Query(array('include'=>array($hid),'visibility'=>'catalog','limit'=>5,'return'=>'ids')); $o['wc_query_catalog']=$q->get_products();
  $q=new WC_Product_Query(array('include'=>array($hid),'visibility'=>'hidden','limit'=>5,'return'=>'ids')); $o['wc_query_hidden']=$q->get_products();
  $cats=wp_get_object_terms($hid,'product_cat'); $o['kategorija']=$cats?$cats[0]->slug:null;
  if ($cats){ $cu=get_term_link($cats[0]); $r=wp_remote_get(add_query_arg('ps_nocache',time(),$cu),array('timeout'=>25,'sslverify'=>false)); $b=is_wp_error($r)?'':wp_remote_retrieve_body($r); $o['kategorijos_pusl']=array('url'=>$cu,'http'=>is_wp_error($r)?0:wp_remote_retrieve_response_code($r),'yra_preke'=>strpos($b,'post-'.$hid)!==false||strpos($b,'eukanuba-medium-adult-visavertis')!==false); }
  $lf=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-atsargu-laukimas.php'); preg_match_all('/(id|class)="([^"]*(stock|lauk|prane)[^"]*)"/i',$lf,$m); $o['formos_zymes']=array_unique($m[2]);
  $u=get_permalink($hid); $r=wp_remote_get(add_query_arg('ps_nocache',time(),$u),array('timeout'=>25,'sslverify'=>false)); $b=is_wp_error($r)?'':wp_remote_retrieve_body($r);
  $o['preke_pusl']=array('http'=>is_wp_error($r)?0:wp_remote_retrieve_response_code($r),'dydis'=>strlen($b),'nera_sandelyje'=>stripos($b,'nėra sandėlyje')!==false||stripos($b,'out-of-stock')!==false,'zymes_rastos'=>array_values(array_filter($o['formos_zymes'],function($z) use ($b){ return strpos($b,$z)!==false; })),'noindex'=>stripos($b,'noindex')!==false);
  $o['hidden_viso']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}postmeta WHERE meta_key='_ps_dropship_paslepta' AND meta_value='1'");
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
