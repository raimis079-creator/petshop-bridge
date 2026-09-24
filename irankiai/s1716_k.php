<?php
/** Plugin Name: TEMP PS S1716k kas naudoja matmenis read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1716k'])) return;
  @set_time_limit(170); global $wpdb; $r=['v'=>'S1716k'];
  try{
    $files=array_merge(glob(WPMU_PLUGIN_DIR.'/*.php'),glob(WP_PLUGIN_DIR.'/petshop-*/*.php'),glob(WP_PLUGIN_DIR.'/petshop-*/includes/*.php'),glob(get_stylesheet_directory().'/*.php'));
    foreach($files as $g){ $s=file_get_contents($g); if(preg_match('#get_length|get_width|get_height|get_dimensions|_length\b|_width\b|_height\b|matmen#i',$s)){ preg_match_all('#[^\n]{0,100}(get_length|get_width|get_height|get_dimensions|\'_length\'|\'_width\'|\'_height\'|matmen)[^\n]{0,140}#i',$s,$m); $r['naudoja'][str_replace(ABSPATH,'',$g)]=array_slice(array_map('trim',array_unique($m[0])),0,6); } }
    // LP plugino dydzio skaiciavimas — ar is matmenu
    foreach(glob(WP_PLUGIN_DIR.'/woo-lithuaniapost*/**/*.php') as $g){ $s=file_get_contents($g); if(preg_match('#get_length|get_dimensions#',$s)){ preg_match_all('#[^\n]{0,100}(get_length|get_dimensions)[^\n]{0,140}#',$s,$m); $r['lp_naudoja'][basename($g)]=array_slice(array_map('trim',array_unique($m[0])),0,4); } }
    // Venipak pickup metodo calculate_shipping (admin klase)
    $fn=WP_PLUGIN_DIR.'/wc-venipak-shipping/admin/class-woocommerce-shopup-venipak-shipping-admin-pickup.php'; $s=file_get_contents($fn); $p=strpos($s,'function calculate_shipping'); $r['pickup_calc']=substr($s,$p,4500);
    // WP All Import ZB sablonas: ar matmenys mapinami
    $o=$wpdb->get_var("SELECT options FROM {$wpdb->prefix}pmxi_imports WHERE id=1"); $u=@unserialize($o); if(is_array($u)){ foreach(['product_length','product_width','product_height','product_weight','is_update_dimensions','update_all_data','is_update_length','is_update_width'] as $k){ if(isset($u[$k])) $r['wpai1'][$k]=is_scalar($u[$k])?$u[$k]:'arr'; } preg_match_all('#[a-z_]*(length|width|height)[a-z_]*#',$o,$mm); $r['wpai1_raktai']=array_values(array_unique($mm[0])); }
    // ZB prekiu matmenu pasiskirstymas pagal svori — ar dims koreliuoja
    $r['zb_dims_pagal_kg']=$wpdb->get_results("SELECT CONCAT(l.meta_value,'x',w.meta_value,'x',h.meta_value) d, ROUND(MIN(CAST(wt.meta_value AS DECIMAL(8,2))),1) kg_min, ROUND(MAX(CAST(wt.meta_value AS DECIMAL(8,2))),1) kg_max, COUNT(*) n FROM {$wpdb->posts} p JOIN {$wpdb->postmeta} s ON s.post_id=p.ID AND s.meta_key='_ps_sandelis' AND s.meta_value='zb' JOIN {$wpdb->postmeta} l ON l.post_id=p.ID AND l.meta_key='_length' JOIN {$wpdb->postmeta} w ON w.post_id=p.ID AND w.meta_key='_width' JOIN {$wpdb->postmeta} h ON h.post_id=p.ID AND h.meta_key='_height' LEFT JOIN {$wpdb->postmeta} wt ON wt.post_id=p.ID AND wt.meta_key='_weight' WHERE p.post_type='product' AND p.post_status='publish' GROUP BY d ORDER BY n DESC LIMIT 15",ARRAY_A);
    $r['virs_ribu_zb_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} p JOIN {$wpdb->postmeta} s ON s.post_id=p.ID AND s.meta_key='_ps_sandelis' AND s.meta_value='zb' JOIN {$wpdb->postmeta} l ON l.post_id=p.ID AND l.meta_key='_length' JOIN {$wpdb->postmeta} w ON w.post_id=p.ID AND w.meta_key='_width' JOIN {$wpdb->postmeta} h ON h.post_id=p.ID AND h.meta_key='_height' WHERE p.post_type='product' AND p.post_status='publish' AND (GREATEST(CAST(l.meta_value AS DECIMAL(8,2)),CAST(w.meta_value AS DECIMAL(8,2)),CAST(h.meta_value AS DECIMAL(8,2)))>61 OR LEAST(CAST(l.meta_value AS DECIMAL(8,2)),CAST(w.meta_value AS DECIMAL(8,2)),CAST(h.meta_value AS DECIMAL(8,2)))>39.5)");
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
