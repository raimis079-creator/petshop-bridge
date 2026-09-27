<?php
/** Plugin Name: TEMP PS S1728mh read-only: ką realiai rodo 20 prekių be _thumbnail_id + WPAI ryšys */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1728mh'])) return; $r=['v'=>'S1728mh']; global $wpdb; $P=$wpdb->prefix; @set_time_limit(170);
  try{
    $ids=$wpdb->get_col("SELECT p.ID FROM {$P}posts p LEFT JOIN {$P}postmeta m ON m.post_id=p.ID AND m.meta_key='_thumbnail_id' WHERE p.post_type='product' AND p.post_status='publish' AND (m.meta_value IS NULL OR m.meta_value='' OR m.meta_value='0')");
    $pmxi=$wpdb->get_var("SHOW TABLES LIKE '{$P}pmxi_posts'");
    foreach($ids as $id){ $p=wc_get_product($id); $img=$p?(int)$p->get_image_id():0;
      $r['p'][]=['id'=>(int)$id,'pav'=>mb_substr(html_entity_decode(get_the_title($id)),0,55),'tipas'=>$p?$p->get_type():'','rodo_img'=>$img,'laukas'=>get_post_meta($id,'_ps_laukas',true),'att_parent'=>$wpdb->get_col($wpdb->prepare("SELECT ID FROM {$P}posts WHERE post_type='attachment' AND post_parent=%d ORDER BY ID",$id)),'wpai'=>$pmxi?$wpdb->get_var($wpdb->prepare("SELECT import_id FROM {$P}pmxi_posts WHERE post_id=%d",$id)):null,'likutis'=>$p?$p->get_stock_status():'']; }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE); exit;
}, 1);
