<?php
/** Plugin Name: TEMP PS S1720f — 2.17 recon read-only (a: prekės psl. likučio tekstai/hookai; b: krepšelis/kasa/mini; c: pristatymas psl + schema + zonos) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1720f'])) return; $f=$_GET['ps_s1720f']; $r=['v'=>'S1720f','faze'=>$f];
  global $wpdb; $p=$wpdb->prefix; @set_time_limit(280);
  $grep=function($dir,$re,$ctx=350,$max=6){ $o=[]; foreach(glob($dir.'/*.php') as $fn){ $c=file_get_contents($fn); if(preg_match_all('/.{0,'.$ctx.'}(?:'.$re.').{0,'.$ctx.'}/s',$c,$m)){ $o[basename($fn)]=array_slice(array_map(function($x){return preg_replace('/\s+/',' ',$x);},$m[0]),0,$max);} } return $o; };
  try{
  $mu=WPMU_PLUGIN_DIR; $child=get_stylesheet_directory();
  if($f==='a'){
    $r['turime']=$grep($mu,'Turime|Neturime|Išparduota|availability_text|woocommerce_get_availability',300,4);
    $r['child_turime']=$grep($child,'Turime|availability|woocommerce_get_availability|single_product_summary',250,6);
    $r['hooks_summary']=$grep($mu,"woocommerce_single_product_summary|woocommerce_after_add_to_cart|woocommerce_before_add_to_cart|woocommerce_product_meta_end|woocommerce_after_single_product_summary",200,6);
    $r['fbt']=$grep($mu,'Dažnai perkama|petshop-fbt|fbt',200,3);
    $r['skaiciuokle_hook']=$grep($mu,'skaiciuokle|Skaičiuokl',150,4);
    $r['kg']=$grep($mu,'€\\/kg|eur_kg|kaina_uz_kg|price_per|\\/ kg',200,4);
    foreach([18560,35316,26340,14805] as $pid){ $pr=wc_get_product($pid); if(!$pr) continue; $av=$pr->get_availability(); $r['prekes'][$pid]=['t'=>mb_substr($pr->get_name(),0,50),'stock_status'=>$pr->get_stock_status(),'av'=>$av,'sandelis'=>get_post_meta($pid,'_ps_sandelis',true),'own'=>get_post_meta($pid,'_own_stock_qty',true),'weight'=>$pr->get_weight(),'price'=>$pr->get_price(),'src'=>$wpdb->get_row($wpdb->prepare("SELECT source,stock_qty FROM {$p}ps_sources WHERE product_id=%d ORDER BY id DESC LIMIT 1",$pid),ARRAY_A)]; }
    $rs=wp_remote_get(get_permalink(18560),['timeout'=>20,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-s1720']); $b=wp_remote_retrieve_body($rs);
    if(preg_match('#<div class="product-info summary[^"]*">(.*?)<div class="product-footer#s',$b,$m)) $r['summary_html']=mb_substr(preg_replace('/\s+/',' ',strip_tags($m[1],'<p><span><div><a><form><button><label><h1>')),0,3500);
    if(preg_match_all('/class="([^"]*(stock|availability|ps-[a-z\-]+)[^"]*)"/',$b,$m)) $r['klases']=array_values(array_unique($m[1]));
    $r['sections']=preg_match_all('/<section[^>]*class="([^"]*)"/',$b,$m)?array_values(array_unique($m[1])):[];
    if(preg_match_all('/<h[23][^>]*>([^<]{3,60})<\/h[23]>/',$b,$m)) $r['h23']=array_values(array_unique(array_map('trim',$m[1])));
  }
  if($f==='b'){
    $r['cart_hooks']=$grep($mu,'woocommerce_cart_totals_|woocommerce_review_order_|woocommerce_widget_shopping_cart|woocommerce_before_cart|woocommerce_proceed_to_checkout|woocommerce_mini_cart|checkout_before_order_review',220,5);
    $r['child_cart']=$grep($child,'woocommerce_cart_totals_|woocommerce_review_order_|woocommerce_widget_shopping_cart|mini_cart|checkout_before_order_review|shipping',200,6);
    $r['zb_matmenys']=file_exists($mu.'/petshop-zb-matmenys.php')?substr(file_get_contents($mu.'/petshop-zb-matmenys.php'),0,2500):'-';
    $r['kelias_source']=$grep($mu,'function resolve|_ps_source|kelias_pagal|Petshop_AV_Source::resolve',200,3);
    $r['mixed']=$grep($mu,'MIXED|mišr|misrus',200,4);
    $ov=[]; foreach(['cart/cart.php','cart/cart-totals.php','cart/mini-cart.php','checkout/review-order.php','checkout/form-checkout.php','single-product/add-to-cart/simple.php','single-product/price.php','single-product/stock.php','single-product/meta.php'] as $t){ $ov[$t]=[file_exists(get_template_directory().'/woocommerce/'.$t)?'flatsome':'',file_exists($child.'/woocommerce/'.$t)?'child':'']; } $r['templates']=$ov;
  }
  if($f==='c'){
    $pg=get_page_by_path('pristatymas'); $r['pristatymas']=$pg?['id'=>$pg->ID,'html'=>mb_substr(preg_replace('/\s+/',' ',strip_tags(apply_filters('the_content',$pg->post_content),'<h2><h3><li><strong>')),0,4000)]:'-';
    $r['schema_ship']=$grep($mu.'/','shippingDetails|handlingTime|deliveryTime|transitTime',400,3);
    $zones=WC_Shipping_Zones::get_zones(); foreach($zones as $z){ $r['zonos'][$z['zone_name']]=array_map(function($m){return $m->id.' '.$m->get_title().' '.($m->cost??'').' '.json_encode($m->instance_settings['cost']??null).' min '.json_encode($m->instance_settings['min_amount']??null);},$z['shipping_methods']); }
    $r['free_from']=$grep($mu,'nemokamas|Nemokamas pristatymas|30 €|nuo 30',150,4);
    $r['darbo_laikas']=$grep($mu,'darbo laik|openingHours|iki 1[0-9]:00|pirmadien',150,3);
    $r['siuntos_faktai']=$wpdb->get_results("SELECT DATE(sukurta_at) d,COUNT(*) n FROM {$p}ps_fakt_siuntos WHERE sukurta_at>=NOW()-INTERVAL 14 DAY GROUP BY 1 ORDER BY 1",ARRAY_A);
    $r['cols_siuntos']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_siuntos");
    $r['issiuntimo_greitis']=$wpdb->get_results("SELECT ROUND(AVG(TIMESTAMPDIFF(HOUR,o.date_paid_gmt,s.isvezta_at)),1) val_vid, SUM(TIMESTAMPDIFF(HOUR,o.date_paid_gmt,s.isvezta_at)<=48) iki2d, COUNT(*) n FROM {$p}ps_fakt_siuntos s JOIN {$p}wc_order_operational_data o ON o.order_id=s.order_id WHERE s.isvezta_at IS NOT NULL AND s.sukurta_at>=NOW()-INTERVAL 14 DAY",ARRAY_A);
  }
  }catch(Throwable $e){ $r['ERR']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
