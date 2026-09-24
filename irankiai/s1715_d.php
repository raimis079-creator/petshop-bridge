<?php
/** Plugin Name: TEMP PS S1715d Wonder #17339 #17354 -> outofstock (Raimis 09-24 22:56: išparduota) (1 vykdyti / 9 atstatyti) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1715d'])) return;
  $f=$_GET['ps_s1715d']; $r=['v'=>'S1715d','faze'=>$f]; $ids=[17339,17354];
  try{
    if($f==='1'){ $bak=get_option('ps_s1715_wonder_bak',[]);
      foreach($ids as $id){ $p=wc_get_product($id); $bak[$id]=['stock_status'=>$p->get_stock_status(),'stock'=>get_post_meta($id,'_stock',true),'t'=>current_time('mysql')]; wc_update_product_stock_status($id,'outofstock'); wc_delete_product_transients($id); $p2=wc_get_product($id); $r['po'][$id]=[$p2->get_name(),$p2->get_stock_status(),$p2->is_in_stock()?'in':'out']; }
      update_option('ps_s1715_wonder_bak',$bak,false); if(function_exists('wp_cache_clear_cache')){ wp_cache_clear_cache(); $r['cache']='isvalytas'; }
      foreach($ids as $id){ $h=wp_remote_get(get_permalink($id).'?nc='.mt_rand(),['timeout'=>40,'sslverify'=>false]); $b=wp_remote_retrieve_body($h); $r['html'][$id]=['kodas'=>wp_remote_retrieve_response_code($h),'isparduota'=>preg_match('#out-of-stock|Išparduota|outofstock#i',$b)?1:0,'add_to_cart_btn'=>preg_match('#single_add_to_cart_button#',$b)?1:0,'bis_forma'=>preg_match('#ps-bis#',$b)?1:0]; }
    }
    if($f==='9'){ $bak=get_option('ps_s1715_wonder_bak',[]); foreach($bak as $id=>$b){ wc_update_product_stock_status((int)$id,$b['stock_status']); } $r['atstatyta']=count($bak); if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache(); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
