<?php
/** Plugin Name: TEMP PS S1728mg read-only: ar buvo nuotraukos (attachmentai, istorija) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1728mg'])) return; $r=['v'=>'S1728mg']; global $wpdb; $P=$wpdb->prefix; @set_time_limit(170);
  try{
    $ids=[19089,19092,34907,34908,35074,34997,34999,34913];
    $up=wp_get_upload_dir();
    foreach($ids as $id){
      $o=['pav'=>html_entity_decode(get_the_title($id)),'sku'=>get_post_meta($id,'_sku',true),'created'=>get_post_field('post_date',$id)];
      $o['att_parent']=$wpdb->get_results($wpdb->prepare("SELECT ID,post_title,post_status,post_date,guid FROM {$P}posts WHERE post_type='attachment' AND post_parent=%d",$id),ARRAY_A);
      $o['meta']=$wpdb->get_results($wpdb->prepare("SELECT meta_key, LEFT(meta_value,150) v FROM {$P}postmeta WHERE post_id=%d AND (meta_key LIKE '%%image%%' OR meta_key LIKE '%%thumb%%' OR meta_key LIKE '%%foto%%' OR meta_key LIKE '%%img%%' OR meta_key LIKE '%%legacy%%' OR meta_key LIKE '%%eshop%%' OR meta_key LIKE '%%import%%')",$id),ARRAY_A);
      $o['revizijos']=(int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$P}posts WHERE post_parent=%d AND post_type='revision'",$id));
      // ar kas nors seka meta pokyčius (ps žurnalai)
      $r['p'][$id]=$o;
    }
    // attachmentai pagal pavadinimą
    foreach(['triu','stirn','kaktus','Seidel','Frexin'] as $q){ $r['pagal_varda'][$q]=$wpdb->get_results($wpdb->prepare("SELECT ID,post_title,post_parent,post_date FROM {$P}posts WHERE post_type='attachment' AND (post_title LIKE %s OR guid LIKE %s) ORDER BY ID DESC LIMIT 12",'%'.$q.'%','%'.$q.'%'),ARRAY_A); }
    // ar yra žurnalų lentelės/opcijų apie nuotraukų šalinimą
    $r['opcijos']=$wpdb->get_col("SELECT option_name FROM {$P}options WHERE option_name LIKE '%foto%' OR option_name LIKE '%nuotrauk%' OR option_name LIKE '%thumb%bak%' OR option_name LIKE 'ps_s17%foto%' LIMIT 40");
    // T-0 importas: eShoprent istorija — ar yra paveikslo URL lentelėse
    $tabs=$wpdb->get_col("SHOW TABLES LIKE '{$P}ps_%'"); $r['ps_lenteles']=$tabs;
    // WP senas „tik-šitas-psl" 19089 buvo su nuotrauka? — Rank Math / og cache
    $r['rm_og']=$wpdb->get_results("SELECT post_id,meta_key,LEFT(meta_value,150) v FROM {$P}postmeta WHERE post_id IN (19089,19092,34907) AND meta_key LIKE 'rank_math%image%'",ARRAY_A);
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE); exit;
}, 1);
