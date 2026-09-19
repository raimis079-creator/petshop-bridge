<?php
/** TEMP PS S1694 l — Prins (19 poz.): ar yra VF/ZB feed'uose (pagal EAN/pavadinimą), dabartinė meta (_ps_sandelis, _zb_enabled, _vf_*), T-0 partijos, ps_sources. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1694l'])) return; global $wpdb; $o=array(); $p=$wpdb->prefix;
  $ids=array(16751,16745,16772,16854,16886,16881,16862,16868,16871,16876,16889,16785,16782,16776,16824,16865,16791,16779,16788);
  $in=implode(',',$ids);
  $o['prekes']=$wpdb->get_results("SELECT p.ID,p.post_status,LEFT(p.post_title,60) t,
    (SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_sku') sku,
    (SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_stock') stock,
    (SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_own_stock_qty') own,
    (SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_ps_sandelis') sandelis,
    (SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_zb_enabled') zb,
    (SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_vf_sku') vf_sku,
    (SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_vf_qty') vf_qty,
    (SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_ean') ean,
    (SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_global_unique_id') gtin
    FROM {$p}posts p WHERE p.ID IN ($in)",ARRAY_A);
  $o['partijos']=$wpdb->get_results("SELECT preke_id,COUNT(*) n,SUM(likutis) likutis,GROUP_CONCAT(DISTINCT tiekejas) tiek,GROUP_CONCAT(DISTINCT statusas) st FROM {$p}ps_partijos WHERE preke_id IN ($in) GROUP BY preke_id",ARRAY_A);
  if ($wpdb->last_error){ $o['err1']=$wpdb->last_error; $o['partijos_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_partijos",0); }
  $o['sources']=$wpdb->get_results("SELECT * FROM {$p}ps_sources WHERE product_id IN ($in) LIMIT 40",ARRAY_A);
  // VF feed
  $vf=WP_CONTENT_DIR.'/uploads/petshop-vf-cache.xml'; $o['vf_feed']=file_exists($vf)?array('dydis'=>filesize($vf),'pask'=>date('m-d H:i',filemtime($vf))):null;
  if (file_exists($vf)){ $x=@simplexml_load_file($vf); $hits=array(); if ($x){ foreach ($x->xpath('//row') as $r){ $n=(string)$r->product_name; if (stripos($n,'prins')!==false) $hits[]=array('sku'=>(string)$r->sku_id,'n'=>mb_substr($n,0,70),'ean'=>(string)$r->barcode,'qty'=>(string)$r->qty,'kaina'=>(string)$r->base_price); } } $o['vf_prins']=array('n'=>count($hits),'pvz'=>array_slice($hits,0,30)); }
  // ZB feed — kur? ieškom xml failų uploads su zb
  $o['zb_failai']=array_map(function($f){return basename($f).' '.filesize($f).' '.date('m-d H:i',filemtime($f));},array_merge(glob(WP_CONTENT_DIR.'/uploads/*zb*.xml')?:array(),glob(WP_CONTENT_DIR.'/uploads/wpallimport/files/*')?:array()));
  $o['zb_prins_prekes']=$wpdb->get_results("SELECT p.ID,p.post_status,LEFT(p.post_title,60) t,(SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_zb_qty') zb_qty FROM {$p}posts p JOIN {$p}postmeta m ON m.post_id=p.ID AND m.meta_key='_zb_enabled' AND m.meta_value='yes' WHERE p.post_title LIKE '%Prins%' LIMIT 30",ARRAY_A);
  $o['prins_visos']=$wpdb->get_results("SELECT post_status,COUNT(*) n FROM {$p}posts WHERE post_type='product' AND post_title LIKE '%Prins%' GROUP BY post_status",ARRAY_A);
  $o['prins_brand']=$wpdb->get_results("SELECT t.name,t.slug,COUNT(*) n FROM {$p}term_relationships tr JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id JOIN {$p}terms t ON t.term_id=tt.term_id WHERE tt.taxonomy='product_brand' AND t.name LIKE '%Prins%' GROUP BY t.term_id",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
