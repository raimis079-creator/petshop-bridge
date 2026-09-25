<?php
/** Plugin Name: TEMP PS S1718t — variaciniai tėvai su tėvo lygmens manage_stock (S1715 §2). Fazės: 1 sąrašas+patikra (read-only), 2 taisyti (manage_stock=no + sync, bak ps_s1718_tevai_bak), 3 patikra, 9 atstatyti */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1718t'])) return;
  $f=$_GET['ps_s1718t']; @set_time_limit(170); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1718t','faze'=>$f]; $BAK='ps_s1718_tevai_bak';
  $tevai=function() use($wpdb){ return $wpdb->get_col("SELECT p.ID FROM {$wpdb->posts} p JOIN {$wpdb->term_relationships} tr ON tr.object_id=p.ID JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='product_type' JOIN {$wpdb->terms} tm ON tm.term_id=tt.term_id AND tm.slug='variable' JOIN {$wpdb->postmeta} ms ON ms.post_id=p.ID AND ms.meta_key='_manage_stock' AND ms.meta_value='yes' WHERE p.post_type='product' AND p.post_status='publish' ORDER BY p.ID"); };
  $cols=function($t) use($wpdb){ return $wpdb->get_col("SHOW COLUMNS FROM `$t`"); };
  $pidcol=function($c){ foreach(['product_id','prekes_id','preke_id','pid','post_id'] as $k) if(in_array($k,$c,true)) return $k; return null; };
  try{
  if($f==='1'){
    $ids=$tevai(); $r['n']=count($ids);
    $tabs=[]; foreach(['ps_partijos','ps_sources','ps_stock_watch'] as $t){ $tn=$P.$t; if($wpdb->get_var("SHOW TABLES LIKE '$tn'")===$tn){ $c=$cols($tn); $tabs[$t]=['col'=>$pidcol($c),'cols'=>implode(',',array_slice($c,0,12))]; } }
    $r['lenteles']=$tabs;
    $t0='2026-09-07 22:07:00';
    foreach($ids as $pid){ $p=wc_get_product($pid); if(!$p) continue; $ch=$p->get_children(); $varin=0; $vars=[];
      foreach($ch as $vid){ $v=wc_get_product($vid); if(!$v) continue; $q=$v->get_stock_quantity(); $st=$v->get_stock_status(); if($st==='instock') $varin++; $vars[]=$vid.':'.$st.':'.($v->get_manage_stock()?$q:'nv'); }
      $x=['t'=>mb_substr($p->get_name(),0,45),'stock'=>get_post_meta($pid,'_stock',true),'status'=>get_post_meta($pid,'_stock_status',true),'own'=>get_post_meta($pid,'_own_stock_qty',true),'sand'=>get_post_meta($pid,'_ps_sandelis',true),'var_in'=>$varin,'var_n'=>count($ch),'vars'=>implode(' ',$vars)];
      foreach($tabs as $t=>$ti){ if($ti['col']) $x[$t]=(int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM `{$P}{$t}` WHERE `{$ti['col']}`=%d",$pid)); }
      $x['uzs_be_var']=(int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$wpdb->prefix}woocommerce_order_items oi JOIN {$wpdb->prefix}woocommerce_order_itemmeta m1 ON m1.order_item_id=oi.order_item_id AND m1.meta_key='_product_id' AND m1.meta_value=%d JOIN {$wpdb->prefix}woocommerce_order_itemmeta m2 ON m2.order_item_id=oi.order_item_id AND m2.meta_key='_variation_id' AND (m2.meta_value='0' OR m2.meta_value='') WHERE oi.order_item_type='line_item'",$pid));
      $x['uzs_su_var']=(int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$wpdb->prefix}woocommerce_order_items oi JOIN {$wpdb->prefix}woocommerce_order_itemmeta m1 ON m1.order_item_id=oi.order_item_id AND m1.meta_key='_product_id' AND m1.meta_value=%d JOIN {$wpdb->prefix}woocommerce_order_itemmeta m2 ON m2.order_item_id=oi.order_item_id AND m2.meta_key='_variation_id' AND m2.meta_value<>'0' AND m2.meta_value<>'' WHERE oi.order_item_type='line_item'",$pid));
      $x['blogai']=($x['status']!=='instock' && $varin>0)?'ISPARDUOTA_NORS_VAR_TURI':(($x['status']==='instock' && $varin===0)?'TURIME_NORS_VAR_0':'');
      $r['tevai'][$pid]=$x; }
    $r['bak_yra']=(bool)get_option($BAK);
    $r['santrauka']=['blogai'=>count(array_filter($r['tevai'],function($x){return $x['blogai']!=='';})),'su_own'=>count(array_filter($r['tevai'],function($x){return (int)$x['own']>0;})),'su_partijomis'=>count(array_filter($r['tevai'],function($x){return !empty($x['ps_partijos']);})),'su_sources'=>count(array_filter($r['tevai'],function($x){return !empty($x['ps_sources']);})),'uzs_be_var'=>count(array_filter($r['tevai'],function($x){return $x['uzs_be_var']>0;}))];
  }
  if($f==='2'){
    if(get_option($BAK)){ $r['klaida']='bak jau yra'; wp_send_json($r); }
    $ids=$tevai(); $bak=['t'=>current_time('mysql'),'tevai'=>[]]; $po=[];
    foreach($ids as $pid){ $p=wc_get_product($pid); if(!$p||!$p->is_type('variable')){ $r['praleista'][]=$pid; continue; }
      $bak['tevai'][$pid]=['manage'=>get_post_meta($pid,'_manage_stock',true),'stock'=>get_post_meta($pid,'_stock',true),'status'=>get_post_meta($pid,'_stock_status',true)]; }
    update_option($BAK,$bak,false);
    foreach(array_keys($bak['tevai']) as $pid){ $p=wc_get_product($pid); $pries=get_post_meta($pid,'_stock_status',true);
      $p->set_manage_stock(false); $p->save(); WC_Product_Variable::sync_stock_status($pid); wc_delete_product_transients($pid); clean_post_cache($pid);
      $p2=wc_get_product($pid); $po[$pid]=[$pries,'→',$p2->get_stock_status(),'manage='.($p2->get_manage_stock()?'yes':'no'),'stock_meta='.get_post_meta($pid,'_stock',true)]; }
    $r['po']=$po; $r['pakeista']=count($po); $r['pasikeite_busena']=count(array_filter($po,function($x){return $x[0]!==$x[2];}));
    if(function_exists('wp_cache_clear_cache')){ wp_cache_clear_cache(); $r['cache']='isvalytas'; }
  }
  if($f==='3'){
    $ids=$tevai(); $r['dar_manage_yes']=count($ids);
    $bak=get_option($BAK); $r['bak_n']=$bak?count($bak['tevai']):0;
    if($bak) foreach(array_keys($bak['tevai']) as $pid){ $p=wc_get_product($pid); if(!$p) continue; $in=0; foreach($p->get_children() as $vid){ $v=wc_get_product($vid); if($v&&$v->get_stock_status()==='instock') $in++; }
      $st=$p->get_stock_status(); if(($st==='instock')!==($in>0)) $r['nesutampa'][$pid]=[$st,$in]; $r['busenos'][$st]=($r['busenos'][$st]??0)+1; }
    foreach([14987,15158,15161,15165,15300,15303,15582,15942,15990,15993] as $pid){ $res=wp_remote_get(get_permalink($pid).'?ps_v=6',['timeout'=>25]); $h=wp_remote_retrieve_body($res); $r['puslapiai'][$pid]=[wp_remote_retrieve_response_code($res), strpos($h,'out-of-stock')!==false?'OUT':'', strpos($h,'single_add_to_cart_button')!==false?'BTN':'', strpos($h,'variations_form')!==false?'VARFORM':'']; }
  }
  if($f==='9'){ $bak=get_option($BAK); if(!$bak){ $r['klaida']='bak nera'; wp_send_json($r); }
    foreach($bak['tevai'] as $pid=>$b){ update_post_meta((int)$pid,'_manage_stock',$b['manage']); update_post_meta((int)$pid,'_stock',$b['stock']); update_post_meta((int)$pid,'_stock_status',$b['status']); wc_delete_product_transients((int)$pid); clean_post_cache((int)$pid); }
    delete_option($BAK); $r['atstatyta']=count($bak['tevai']); if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache(); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
