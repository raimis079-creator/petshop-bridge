<?php
/** Plugin Name: TEMP PS S1728mj read-only: prekės puslapio struktūra (hook'ai, HTML eilė) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1728mj'])) return; $r=['v'=>'S1728mj']; @set_time_limit(120);
  try{
    global $wp_filter;
    foreach(['woocommerce_single_product_summary','woocommerce_before_add_to_cart_form','woocommerce_before_add_to_cart_button','woocommerce_after_add_to_cart_quantity','woocommerce_after_add_to_cart_button','woocommerce_after_add_to_cart_form','woocommerce_after_single_product_summary','woocommerce_product_meta_end','flatsome_product_box_after','wp_footer'] as $h){ $o=[]; if(isset($wp_filter[$h])) foreach($wp_filter[$h]->callbacks as $pr=>$cbs) foreach($cbs as $cb){ $f=$cb['function']; $n=is_array($f)?(is_object($f[0])?get_class($f[0]):$f[0]).'::'.$f[1]:(is_string($f)?$f:'closure'); if($n==='closure'){ try{ $rf=new ReflectionFunction($f); $n='closure@'.basename($rf->getFileName()).':'.$rf->getStartLine(); }catch(Throwable $e){} } $o[]=$pr.':'.$n; } $r['hooks'][$h]=$o; }
    $u=add_query_arg('ps_hb',time(),get_permalink(17978)); $x=wp_remote_get($u,['timeout'=>40,'sslverify'=>false,'cookies'=>['ps_js'=>'1'],'user-agent'=>'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148']);
    $b=wp_remote_retrieve_body($x); $r['ilgis']=strlen($b);
    // žymių eilė HTML'e
    $marks=['<form class="cart"','single_add_to_cart_button','</form>','ps-calc','petshop-fbt"','ps-primink','ps-pristatymas','sticky-add-to-cart','product-footer','woocommerce-tabs','ps-dydziai','ps-dydz','product-short-description','price-wrapper'];
    foreach($marks as $m){ $p=strpos($b,$m); $r['eile'][$m]=$p===false?null:$p; }
    asort($r['eile']);
    $s=strpos($b,'<form class="cart"'); $e=strpos($b,'petshop-fbt"');
    $r['tarp_form_ir_fbt']=$s!==false&&$e!==false? preg_replace('/\s+/',' ',substr($b,$s,min(9000,$e-$s+300))):'';
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE); exit;
}, 1);
