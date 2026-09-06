<?php
/** TEMP PS S1621 run e1r — RECON (tik skaitymas): prekės testui (Grancarno 400, Josera Mini Lamb 800, Josera Festival 12.5, Exclusion kiauliena 400), VF partijos, VF dropshipping laukiantys, tiekimo variklio atsargų eilučių mechanika, eilės. */
add_action('init', function(){
  if (!isset($_GET['ps_e1r'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e1r'])); $o=array('v'=>'S1621 e1r','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(250);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  try{
  if($f==='R'){
    $q=array('grancarno 400'=>"post_title LIKE '%Grancarno%' AND post_title LIKE '%400%'",'josera mini lamb'=>"post_title LIKE '%Josera%' AND post_title LIKE '%Mini%' AND post_title LIKE '%amb%'",'josera festival'=>"post_title LIKE '%Josera%' AND post_title LIKE '%Festival%'",'exclusion kiaul 400'=>"post_title LIKE '%Exclusion%' AND (post_title LIKE '%kiaul%' OR post_title LIKE '%Pork%' OR post_title LIKE '%Maiale%') AND post_title LIKE '%400%'");
    foreach($q as $k=>$w){ $ids=$wpdb->get_col("SELECT ID FROM {$p}posts WHERE post_type IN ('product','product_variation') AND post_status IN ('publish','private','draft') AND $w ORDER BY ID LIMIT 12"); $r=array();
      foreach($ids as $id){ $x=wc_get_product($id); if(!$x) continue; $r[]=array('id'=>(int)$id,'n'=>mb_substr($x->get_name(),0,70),'sku'=>$x->get_sku(),'st'=>$x->get_status(),'tipas'=>$x->get_type(),'sand'=>$x->get_meta('_ps_sandelis'),'stock'=>$x->get_stock_quantity(),'ms'=>(int)$x->get_manage_stock(),'av'=>class_exists('Petshop_AV_Stock')?Petshop_AV_Stock::qty($id):null,'vf'=>$x->get_meta('_vf_qty'),'own'=>$x->get_meta('_own_stock_qty'),'kaina'=>$x->get_price(),'svoris'=>$x->get_weight(),'tiek'=>class_exists('Petshop_AV_Source')&&method_exists('Petshop_AV_Source','tiekejas')?null:null); }
      $o['prekes'][$k]=$r; }
    $o['tiekimas']=$wpdb->get_results("SELECT id,tiekejas,busena,sukurta,uzsakyta,gauta,pristatymas,svoris,dezes,pastaba FROM {$p}ps_tiekimas ORDER BY id DESC LIMIT 12",ARRAY_A);
    $o['tiekimas_eil']=$wpdb->get_results("SELECT e.id,e.partija_id,e.product_id,e.order_id,e.qty,e.qty_gauta FROM {$p}ps_tiekimas_eil e ORDER BY e.id DESC LIMIT 15",ARRAY_A);
    $o['tiek_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_tiekimas"); $o['tiek_eil_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_tiekimas_eil");
    $t=(string)file_get_contents(WPMU_PLUGIN_DIR.'/petshop-av-tiekimas.php'); $o['tiek_dydis']=strlen($t); $L=explode("\n",$t); $g=array();
    foreach($L as $k=>$l){ if(preg_match('/admin_post|\$_POST\[|public static function|order_id\s*=>\s*0|atsarg|prideti|ideti_prek|product_id/i',$l)){ $g[]=($k+1).': '.mb_substr(trim($l),0,170); } if(count($g)>120) break; } $o['tiek_grep']=$g;
    $o['ps_tiek_laiskai']=get_option('ps_tiek_laiskai'); $o['tiek_pastai']=get_option('ps_tiek_pastai'); $o['opt_tiek']=$wpdb->get_col("SELECT option_name FROM {$p}options WHERE option_name LIKE 'ps_tiek%'");
    if(class_exists('Petshop_AV_Dropship')){ $m=new ReflectionClass('Petshop_AV_Dropship'); $o['ds_methods']=array_map(function($x){return $x->name;},$m->getMethods(ReflectionMethod::IS_STATIC)); if(method_exists('Petshop_AV_Dropship','laukiantys_perdavimo')){ $l=Petshop_AV_Dropship::laukiantys_perdavimo(); $o['ds_laukia']=is_array($l)?(isset($l['vf'])?$l:array_slice($l,0,20,true)):$l; } }
    $o['vf_pending_orders']=$wpdb->get_results("SELECT o.id,o.status FROM {$p}wc_orders o WHERE o.type='shop_order' AND o.status IN ('wc-processing') ORDER BY o.id DESC LIMIT 40",ARRAY_A);
    $tu=get_user_by('login','testuotojas'); $o['testuotojas']=$tu?$tu->ID:null; $ing=get_user_by('login','inga'); $o['inga']=$ing?$ing->ID:null;
    $o['skait']=array('avpn'=>get_option('petshop_avpn_counter'),'iapv'=>get_option('petshop_iapv_counter')); $o['dev_pastas_n']=count((array)get_option('ps_dev_pastas_zurnalas',array()));
    $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'"); $J($o);
  }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
