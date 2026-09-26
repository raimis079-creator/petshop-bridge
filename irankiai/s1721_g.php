<?php
/** Plugin Name: TEMP PS S1721g recon read-only: skaiciuokle (svorio saugojimas, AJAX, calc API), DP meta, Flatsome loop hookai, pet profile svoris */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1721g'])) return; $f=$_GET['ps_s1721g']; $r=['v'=>'S1721g','faze'=>$f]; @set_time_limit(120); global $wpdb; $P=$wpdb->prefix; $mu=WPMU_PLUGIN_DIR; $core=is_dir(WP_PLUGIN_DIR.'/petshop-core')?WP_PLUGIN_DIR.'/petshop-core':$mu.'/petshop-core';
  $grep=function($file,$pat,$ctx=160,$max=14){ if(!is_file($file)) return 'NERA '.$file; $s=file_get_contents($file); preg_match_all('#[^\n]{0,'.$ctx.'}('.$pat.')[^\n]{0,'.$ctx.'}#',$s,$m); return array_slice(array_map(function($x){return mb_substr(trim($x),0,400);},$m[0]),0,$max); };
  try{
  if($f==='1'){
    $r['core_files']=array_map('basename',array_merge(glob($core.'/*.php'),glob($core.'/includes/*.php'),glob($core.'/assets/*.js')));
    $r['calc_php']=$grep($core.'/includes/class-product-calc.php','wp_ajax|add_action|localStorage|cookie|ps_calc|weight|Feeding_Service::|wp_enqueue_script|wp_localize|rest_route|register_rest');
    foreach(glob($core.'/assets/*calc*.js') as $js){ $r['calc_js'][basename($js)]=$grep($js,'localStorage|sessionStorage|cookie|ajax|fetch\(|action|weight|ps_calc_w|ps-calc-w'); }
    foreach(glob($core.'/assets/*.js') as $js){ $s=file_get_contents($js); if(strpos($s,'ps-calc')!==false||strpos($s,'ps_calc')!==false) $r['js_su_calc'][]=basename($js).' '.round(strlen($s)/1024).'KB'; }
    foreach(glob($core.'/includes/*.php') as $ph){ $s=file_get_contents($ph); if(preg_match('/class\s+Feeding_Service/',$s)){ $r['feeding_file']=basename($ph); preg_match_all('#public (?:static )?function (\w+)\s*\(([^)]*)\)#',$s,$m); $r['feeding_fns']=array_map(function($a,$b){return $a.'('.mb_substr($b,0,80).')';},$m[1],$m[2]); $r['calc_body']=$grep($ph,'function calc|return array|\'days|\'g_per_day|grams|duration|\'min\'|\'max\'|WEIGHT_OUT',200,20); } }
    $r['pet_profile_fns']=$grep($core.'/includes/class-pet-profile.php','public (static )?function|weight|svoris',120,25);
    $r['weight_signal']=[]; foreach(array_merge(glob($mu.'/*.php'),glob($core.'/includes/*.php')) as $ph){ $s=file_get_contents($ph); if(strpos($s,'ps_weight_signal')!==false) $r['weight_signal'][basename($ph)]=$grep($ph,'ps_weight_signal',140,6); }
    // DP meta
    foreach([36002,36003,18590] as $pid){ $r['dp'][$pid]=['_dp_base_product_id'=>get_post_meta($pid,'_dp_base_product_id',true),'_dp_pack_qty'=>get_post_meta($pid,'_dp_pack_qty',true),'pak'=>wp_get_object_terms($pid,'pa_pakuotes_dydis',['fields'=>'names']),'seima'=>get_post_meta($pid,'_ps_dydzio_seima',true),'price_html'=>wp_strip_all_tags(wc_get_product($pid)->get_price_html())]; }
    // Flatsome loop hooks
    global $wp_filter; foreach(['woocommerce_before_shop_loop_item','woocommerce_before_shop_loop_item_title','woocommerce_shop_loop_item_title','woocommerce_after_shop_loop_item_title','woocommerce_after_shop_loop_item','flatsome_product_box_after','flatsome_product_box_actions','flatsome_product_box_tools_top','woocommerce_single_product_summary'] as $hk){ if(!isset($wp_filter[$hk])) continue; foreach($wp_filter[$hk]->callbacks as $pr=>$cbs){ foreach($cbs as $cb){ $fn=$cb['function']; $r['hooks'][$hk][]=$pr.' '.(is_string($fn)?$fn:(is_array($fn)?(is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]:'closure')); } } }
    $r['flatsome_box']=$grep(get_template_directory().'/woocommerce/content-product.php','do_action|get_template_part|product-small|box-text',120,20);
    $r['dydziai_md5']=md5_file($mu.'/petshop-dydziai.php');
    $r['katalogas_seima']=$grep($mu.'/petshop-katalogas.php','_ps_dydzio_seima|Plugin Name|Version|add_action|add_filter|pre_get_posts|posts_where',160,30);
    foreach(glob($mu.'/*.php') as $ph){ $s=file_get_contents($ph); if(strpos($s,'Petshop_Weight_Filter')!==false){ $r['weight_filter'][basename($ph)]=$grep($ph,'Plugin Name|function card_badge|add_action',140,8); } }
    $r['plugin_dirs']=array_map('basename',glob(WP_PLUGIN_DIR.'/petshop-*',GLOB_ONLYDIR));
    $r['dydziai_hooks']=[]; foreach(glob($mu.'/*.php') as $ph){ $s=file_get_contents($ph); if(strpos($s,'_ps_dydzio_seima')!==false) $r['dydziai_hooks'][]=basename($ph); }
    // faktu lenteles pardavimai per preke (365 d) — greitis
    $t0=microtime(true); $r['fakt_pvz']=$wpdb->get_results("SELECT preke_id, SUM(kiekis) q FROM {$P}ps_ist_fakt_eilutes WHERE preke_id IN (18584,18590,18587,36002,36003) AND diena>='2025-09-26' GROUP BY preke_id",ARRAY_A); $r['fakt_ms']=round((microtime(true)-$t0)*1000);
    $r['ajax_url']=admin_url('admin-ajax.php'); $r['wc_ajax']=class_exists('WC_AJAX')?WC_AJAX::get_endpoint('%%endpoint%%'):null;
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
