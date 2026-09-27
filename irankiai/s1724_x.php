<?php
/** Plugin Name: TEMP PS S1724x recon: 1) 2+ vnt to paties sauso maisto maiso uzsakymai (istorija + WC), 2) rinkiniai be nuotraukos read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1724x2'])) return; $f=(string)$_GET['ps_s1724x2']; $r=['v'=>'S1724x','faze'=>$f]; global $wpdb; $P=$wpdb->prefix; @set_time_limit(150);
  $q=function($sql) use($wpdb,&$r){ $x=$wpdb->get_results($sql,ARRAY_A); if($wpdb->last_error) $r['SQL_ERR'][]=mb_substr($wpdb->last_error,0,200); return $x; };
  try{
    if($f==='1'){
      $r['ist_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$P}ps_ist_fakt_eilutes"); $r['fakt_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$P}ps_fakt_eilutes");
      // istorija: eilutes su kiekiu>=2, pavadinimas su kg (sausas maistas), 365 d.
      $kg="(pavadinimas_tuo_metu REGEXP '[0-9]+([,.][0-9]+)? ?kg')";
      $r['ist_viso_eil']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$P}ps_ist_fakt_eilutes WHERE $kg");
      $r['ist_kiekis_pasisk']=$q("SELECT LEAST(kiekis,5) k, COUNT(*) n, COUNT(DISTINCT uzsakymas_id) uzs FROM {$P}ps_ist_fakt_eilutes WHERE $kg GROUP BY 1 ORDER BY 1");
      $r['ist_2plus_top']=$q("SELECT pavadinimas_tuo_metu pavadinimas, COUNT(*) n, SUM(kiekis) vnt FROM {$P}ps_ist_fakt_eilutes WHERE $kg AND kiekis>=2 GROUP BY pavadinimas_tuo_metu ORDER BY n DESC LIMIT 25");
      $r['ist_2plus_pagal_kg']=$q("SELECT CAST(REGEXP_SUBSTR(pavadinimas_tuo_metu,'[0-9]+([,.][0-9]+)? ?kg') AS CHAR) kg, COUNT(*) n FROM {$P}ps_ist_fakt_eilutes WHERE $kg AND kiekis>=2 GROUP BY 1 ORDER BY n DESC LIMIT 15");
      // WC nuo T-0
      $r['wc_kiekis_pasisk']=$q("SELECT LEAST(oi.quantity_sum,5) k, COUNT(*) n FROM (SELECT i.order_item_id, CAST(MAX(CASE WHEN m.meta_key='_qty' THEN m.meta_value END) AS UNSIGNED) quantity_sum, i.order_item_name nm FROM {$P}woocommerce_order_items i JOIN {$P}woocommerce_order_itemmeta m ON m.order_item_id=i.order_item_id WHERE i.order_item_type='line_item' GROUP BY i.order_item_id) oi WHERE oi.nm REGEXP '[0-9]+([,.][0-9]+)? ?kg' GROUP BY 1 ORDER BY 1");
      $r['wc_2plus']=$q("SELECT oi.nm, oi.quantity_sum q FROM (SELECT i.order_item_id, i.order_id, CAST(MAX(CASE WHEN m.meta_key='_qty' THEN m.meta_value END) AS UNSIGNED) quantity_sum, i.order_item_name nm FROM {$P}woocommerce_order_items i JOIN {$P}woocommerce_order_itemmeta m ON m.order_item_id=i.order_item_id WHERE i.order_item_type='line_item' GROUP BY i.order_item_id) oi WHERE oi.nm REGEXP '[0-9]+([,.][0-9]+)? ?kg' AND oi.quantity_sum>=2 ORDER BY oi.order_id DESC LIMIT 30");
      // esami DP pakai: pardavimai
      $r['dp_pakai_pard']=$q("SELECT p.ID, LEFT(p.post_title,60) t, (SELECT COUNT(*) FROM {$P}woocommerce_order_itemmeta m JOIN {$P}woocommerce_order_items i ON i.order_item_id=m.order_item_id WHERE m.meta_key='_product_id' AND m.meta_value=p.ID) pard FROM {$wpdb->posts} p JOIN {$wpdb->postmeta} d ON d.post_id=p.ID AND d.meta_key='_dp_base_product_id' WHERE p.post_status='publish' ORDER BY pard DESC");
      // seimu sausas maistas 2-10 kg nariai (kandidatai)
      $r['kandidatai_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} p JOIN {$wpdb->postmeta} s ON s.post_id=p.ID AND s.meta_key='_ps_dydzio_seima' AND s.meta_value<>'' WHERE p.post_status='publish' AND p.post_type='product' AND p.post_title REGEXP '(^|[^0-9,.])([2-9]|10)([,.][0-9]+)? ?kg' AND NOT EXISTS (SELECT 1 FROM {$wpdb->postmeta} dp WHERE dp.post_id=p.ID AND dp.meta_key='_dp_base_product_id')");
    }
    if($f==='2'){
      $mnm=$q("SELECT p.ID, LEFT(p.post_title,50) t, (SELECT meta_value FROM {$wpdb->postmeta} WHERE post_id=p.ID AND meta_key='_thumbnail_id' LIMIT 1) thumb FROM {$wpdb->posts} p JOIN {$P}term_relationships tr ON tr.object_id=p.ID JOIN {$P}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='product_type' JOIN {$P}terms t ON t.term_id=tt.term_id AND t.slug='mix-and-match' WHERE p.post_type='product' AND p.post_status='publish'");
      $be=[]; foreach($mnm as $x){ $tid=(int)$x['thumb']; $ok=false; if($tid){ $fp=get_attached_file($tid); $ok=$fp&&is_file($fp); } if(!$ok){ $img=wp_get_attachment_image_src((int)apply_filters('woocommerce_product_get_image_id',$tid,wc_get_product($x['ID'])),'thumbnail'); if(!$img) $be[]=$x['ID'].' '.$x['t'].' thumb='.$tid; } }
      $r['mnm_n']=count($mnm); $r['be_nuotraukos']=$be;
      $ry=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-rytas.php'); $r['rytas_md5']=md5($ry); $r['rytas_ver']=preg_match('#Version:\s*([\d.]+)#',$ry,$m)?$m[1]:null; $r['rink_klase']=class_exists('Petshop_Rinkiniai'); $r['rink_metodai']=class_exists('Petshop_Rinkiniai')?array_values(array_filter(get_class_methods('Petshop_Rinkiniai'),function($m){return stripos($m,'nuotr')!==false||stripos($m,'komp')!==false||stripos($m,'image')!==false||stripos($m,'thumb')!==false;})):null;
    }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
