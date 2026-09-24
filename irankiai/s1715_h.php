<?php
/** Plugin Name: TEMP PS S1715h variable tevai 15886/17862 manage_stock=no + sync (1 vykdyti / 9 atstatyti) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1715h'])) return;
  $f=$_GET['ps_s1715h']; global $wpdb; $r=['v'=>'S1715h','faze'=>$f]; $ids=[15886,17862];
  try{
    if($f==='1'){ $bak=get_option('ps_s1715_tevai_bak',[]);
      foreach($ids as $pid){ $p=wc_get_product($pid); if(!$p||!$p->is_type('variable')) { $r['praleista'][]=$pid; continue; }
        $bak[$pid]=['manage'=>get_post_meta($pid,'_manage_stock',true),'stock'=>get_post_meta($pid,'_stock',true),'status'=>get_post_meta($pid,'_stock_status',true),'t'=>current_time('mysql')];
        $p->set_manage_stock(false); $p->save(); WC_Product_Variable::sync_stock_status($pid); wc_delete_product_transients($pid);
        $p2=wc_get_product($pid); $r['po'][$pid]=['manage'=>$p2->get_manage_stock(),'status'=>$p2->get_stock_status(),'in'=>$p2->is_in_stock(),'raw'=>get_post_meta($pid,'_stock_status',true),'var'=>array_map(function($vid){ $v=wc_get_product($vid); return [$vid,$v->get_stock_status(),$v->get_stock_quantity()]; },$p2->get_children())]; }
      update_option('ps_s1715_tevai_bak',$bak,false); if(function_exists('wp_cache_clear_cache')){ wp_cache_clear_cache(); $r['cache']='isvalytas'; }
      // kiek dar variable tevu su manage_stock=yes ir _stock<=0, kuriu variacijos turi likuti
      $r['kiti_tevai']=$wpdb->get_results("SELECT p.ID, LEFT(p.post_title,50) t, ss.meta_value st, (SELECT COUNT(*) FROM {$wpdb->posts} v JOIN {$wpdb->postmeta} vs ON vs.post_id=v.ID AND vs.meta_key='_stock_status' AND vs.meta_value='instock' WHERE v.post_parent=p.ID AND v.post_type='product_variation' AND v.post_status='publish') var_in FROM {$wpdb->posts} p JOIN {$wpdb->term_relationships} tr ON tr.object_id=p.ID JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='product_type' JOIN {$wpdb->terms} tm ON tm.term_id=tt.term_id AND tm.slug='variable' JOIN {$wpdb->postmeta} ms ON ms.post_id=p.ID AND ms.meta_key='_manage_stock' AND ms.meta_value='yes' LEFT JOIN {$wpdb->postmeta} ss ON ss.post_id=p.ID AND ss.meta_key='_stock_status' WHERE p.post_type='product' AND p.post_status='publish'",ARRAY_A);
    }
    if($f==='9'){ $bak=get_option('ps_s1715_tevai_bak',[]); foreach($bak as $pid=>$b){ update_post_meta((int)$pid,'_manage_stock',$b['manage']); update_post_meta((int)$pid,'_stock',$b['stock']); update_post_meta((int)$pid,'_stock_status',$b['status']); wc_delete_product_transients((int)$pid); } $r['atstatyta']=count($bak); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
