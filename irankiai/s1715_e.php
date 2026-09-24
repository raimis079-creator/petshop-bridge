<?php
/** Plugin Name: TEMP PS S1715e #12455 #12930 #34319 #34324 -> outofstock (Raimis 09-24 23:01) (1 vykdyti / 9 atstatyti) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1715e'])) return;
  $f=$_GET['ps_s1715e']; $r=['v'=>'S1715e','faze'=>$f]; $ids=[12455,12930,34319,34324];
  try{
    if($f==='1'){ $bak=get_option('ps_s1715_kitos_bak',[]); $parents=[];
      foreach($ids as $id){ $p=wc_get_product($id); if(!$p){ $r['nera'][]=$id; continue; } $bak[$id]=['stock_status'=>$p->get_stock_status(),'stock'=>get_post_meta($id,'_stock',true),'t'=>current_time('mysql')]; wc_update_product_stock_status($id,'outofstock'); wc_delete_product_transients($id); if($p->get_parent_id()) $parents[$p->get_parent_id()]=true; $p2=wc_get_product($id); $r['po'][$id]=[mb_substr($p2->get_name(),0,50),$p2->get_stock_status(),$p2->is_in_stock()?'in':'out']; }
      foreach(array_keys($parents) as $pid){ if(class_exists('WC_Product_Variable')) WC_Product_Variable::sync_stock_status($pid); wc_delete_product_transients($pid); $pp=wc_get_product($pid); $r['tevas'][$pid]=[$pp->get_stock_status(),$pp->is_in_stock()?'in':'out',count($pp->get_available_variations())]; }
      update_option('ps_s1715_kitos_bak',$bak,false); if(function_exists('wp_cache_clear_cache')){ wp_cache_clear_cache(); $r['cache']='isvalytas'; }
    }
    if($f==='9'){ $bak=get_option('ps_s1715_kitos_bak',[]); foreach($bak as $id=>$b){ wc_update_product_stock_status((int)$id,$b['stock_status']); } $r['atstatyta']=count($bak); if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache(); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
