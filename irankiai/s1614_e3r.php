<?php
/** TEMP PS S1614 run e3r — RECON 2 (tik skaitymas) #2: Venipak plugino pickup funkcijos (fetch/cache, store, resolve) + dispatch adreso šaltinis; Petshop_Desk::venipak_registruoti/siuntos_klaida/siuntos_kodas; LP parcel error handling + LpOrderStatus; LP terminalų lentelės dydis; #35416 klaidos meta. */
add_action('init', function(){
  if (!isset($_GET['ps_e3r'])) return;
  $o=array('v'=>'S1614 e3r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $srcm=function($cls,$m,$max=80){ try{ $r=new ReflectionMethod($cls,$m); $f=file($r->getFileName()); $a=$r->getStartLine()-1; $n=min($max,$r->getEndLine()-$a); return array('f'=>basename($r->getFileName()).':'.$r->getStartLine().'-'.$r->getEndLine(),'src'=>array_map(function($l){ return rtrim(mb_substr($l,0,240)); },array_slice($f,$a,$n))); }catch(Throwable $e){ return 'ERR '.$e->getMessage(); } };
  $srcf=function($fn,$max=60){ try{ $r=new ReflectionFunction($fn); $f=file($r->getFileName()); $a=$r->getStartLine()-1; $n=min($max,$r->getEndLine()-$a); return array('f'=>basename($r->getFileName()).':'.$r->getStartLine().'-'.$r->getEndLine(),'src'=>array_map(function($l){ return rtrim(mb_substr($l,0,240)); },array_slice($f,$a,$n))); }catch(Throwable $e){ return 'ERR '.$e->getMessage(); } };
  $lines=function($file,$a,$b){ $f=@file($file); if(!$f) return 'nėra'; return array_map(function($l){ return rtrim(mb_substr($l,0,240)); },array_slice($f,$a-1,$b-$a+1)); };
  try{
    $vp=WP_PLUGIN_DIR.'/wc-venipak-shipping'; $lp=WP_PLUGIN_DIR.'/woo-lithuaniapost-main';
    $o['vp_fetch_funcs']=array_values(array_filter(get_defined_functions()['user'],function($f){ return strpos($f,'venipak')===0; }));
    foreach($o['vp_fetch_funcs'] as $fn){ $o['vp_fn_'.$fn]=$srcf($fn,45); }
    $o['vp_dispatch_460_570']=$lines($vp.'/admin/class-woocommerce-shopup-venipak-shipping-admin-dispatch.php',455,575);
    $o['vp_dispatch_260_340']=$lines($vp.'/admin/class-woocommerce-shopup-venipak-shipping-admin-dispatch.php',260,340);
    foreach(array('venipak_registruoti','siuntos_klaida','siuntos_kodas','siuntu_bukle') as $m){ $o['desk_'.$m]=$srcm('Petshop_Desk',$m,90); }
    $o['lp_err_970_1010']=$lines($lp.'/admin/class-woo-lithuaniapost-admin-order-service.php',960,1010);
    $o['lp_create_680_770']=$lines($lp.'/admin/class-woo-lithuaniapost-admin-order-service.php',685,770);
    $o['lp_create_800_850']=$lines($lp.'/admin/class-woo-lithuaniapost-admin-order-service.php',800,850);
    $o['lp_public_480_515']=$lines($lp.'/public/class-woo-lithuaniapost-public.php',478,515);
    $o['lp_terminalai_n']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}woo_lithuaniapost_unisend_terminals"); $o['lp_terminalai_lt']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}woo_lithuaniapost_unisend_terminals WHERE country_code='LT'"); $o['lp_terminalai_pvz']=$wpdb->get_results("SELECT terminal_id,name,address,city FROM {$p}woo_lithuaniapost_unisend_terminals WHERE country_code='LT' LIMIT 3",ARRAY_A);
    $o['lp_lpexpress_n']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}woo_lithuaniapost_lpexpress_terminals");
    $o['vp_transients']=$wpdb->get_col("SELECT option_name FROM {$p}options WHERE option_name LIKE '%transient%venipak%' OR option_name LIKE '%venipak_pickup%' LIMIT 20");
    $x=wc_get_order(35416); $o['35416']=array('st'=>$x->get_status(),'err'=>$x->get_meta('_woo_lithuaniapost_parcel_create_error'),'stv'=>$x->get_meta('_woo_lithuaniapost_shipping_status_value'),'term'=>$x->get_meta('_woo_lithuaniapost_lpexpress_terminal'),'term_id'=>$x->get_meta('_woo_lithuaniapost_lpexpress_terminal_id'),'sm_meta'=>array_map(function($s){ return $s->get_meta_data(); },$x->get_shipping_methods()));
    $x=wc_get_order(35442); $o['35442']=array('pp'=>$x->get_meta('venipak_pickup_point'),'ppd'=>$x->get_meta('venipak_pickup_point_data'),'vsod'=>$x->get_meta('venipak_shipping_order_data'),'sm_meta'=>array_map(function($s){ return $s->get_meta_data(); },$x->get_shipping_methods()));
    $x=wc_get_order(35435); $o['35435_vsod']=$x->get_meta('venipak_shipping_order_data');
    $o['darbalaukis_versija']=Petshop_Darbalaukis::VERSIJA;
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
