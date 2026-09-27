<?php
/** Plugin Name: TEMP PS S1728mn read-only: nemokamo pristatymo juosta — kaip padaryta dabar */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1728mn'])) return; $r=['v'=>'S1728mn'];
  try{
    $f=get_stylesheet_directory().'/functions.php'; $t=file($f); $r['functions_md5']=md5_file($f);
    $o=[]; foreach($t as $i=>$l){ if(stripos($l,'free_shipping_progress')!==false || stripos($l,'nemokam')!==false) $o[]=($i+1).': '.rtrim($l); } $r['eilutes']=array_slice($o,0,40);
    // funkcijos kodas
    if(function_exists('petshop_free_shipping_progress')){ $rf=new ReflectionFunction('petshop_free_shipping_progress'); $r['fn']=['nuo'=>$rf->getStartLine(),'iki'=>$rf->getEndLine(),'kodas'=>implode('',array_slice($t,$rf->getStartLine()-1,$rf->getEndLine()-$rf->getStartLine()+1))]; }
    global $wp_filter; $kur=[]; foreach($wp_filter as $h=>$w){ foreach($w->callbacks as $pr=>$cbs) foreach($cbs as $cb){ $fn=$cb['function']; if(is_string($fn) && stripos($fn,'free_shipping')!==false) $kur[]=$h.':'.$pr.':'.$fn; if(is_array($fn)){ $n=(is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]; if(stripos($n,'free')!==false||stripos($n,'juost')!==false) $kur[]=$h.':'.$pr.':'.$n; } } } $r['hooks']=$kur;
    foreach(['woocommerce_before_cart','woocommerce_before_cart_table','woocommerce_cart_totals_before_order_total','woocommerce_proceed_to_checkout','woocommerce_after_cart_totals','woocommerce_after_cart','woocommerce_widget_shopping_cart_before_buttons','woocommerce_before_mini_cart','woocommerce_cart_collaterals','woocommerce_after_cart_table','woocommerce_before_checkout_form','woocommerce_review_order_before_shipping'] as $h){ $o=[]; if(isset($wp_filter[$h])) foreach($wp_filter[$h]->callbacks as $pr=>$cbs) foreach($cbs as $cb){ $fn=$cb['function']; $n=is_array($fn)?(is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]:(is_string($fn)?$fn:'closure'); if($n==='closure'){ try{$rf=new ReflectionFunction($fn); $n='closure@'.basename($rf->getFileName()).':'.$rf->getStartLine();}catch(Throwable $e){} } $o[]=$pr.':'.$n; } $r['cart_hooks'][$h]=$o; }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE); exit;
}, 1);
