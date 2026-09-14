<?php
/** TEMP PS S1684 md — READ-ONLY: ar klientas moka už pristatymą — ps_ist_fakt_uzsakymai (9,5 k) ir WC _shipping_total nuo T-0. */
add_action('init', function(){
  if (!isset($_GET['ps_s1684md'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1684 md'); $wpdb->suppress_errors(true);
  $c=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_ist_fakt_uzsakymai"); $o['prist_cols']=array_values(array_filter($c,function($x){return stripos($x,'pristat')!==false||stripos($x,'siunt')!==false;}));
  foreach($o['prist_cols'] as $col) if(preg_match('/_ct$/',$col)) $o['ist'][$col]=$wpdb->get_row("SELECT COUNT(*) n, SUM(`$col`>0) moka_n, ROUND(SUM(`$col`)/100) eur, ROUND(AVG(CASE WHEN `$col`>0 THEN `$col` END)/100,2) vid FROM {$p}ps_ist_fakt_uzsakymai WHERE apmoketa_at>='2025-09-01'",ARRAY_A);
  $o['ist_pagal_men']=$wpdb->get_results("SELECT DATE_FORMAT(apmoketa_at,'%Y-%m') m, COUNT(*) n, SUM(pristatymas_ct>0) moka_n, ROUND(AVG(viso_ct)/100,1) aov FROM {$p}ps_ist_fakt_uzsakymai WHERE apmoketa_at>='2025-09-01' GROUP BY m",ARRAY_A);
  $o['wc_shipping']=$wpdb->get_row("SELECT COUNT(*) n, SUM(o.shipping_total_amount>0) moka_n, ROUND(SUM(o.shipping_total_amount),2) eur FROM {$p}wc_orders o WHERE o.status IN('wc-processing','wc-completed') AND o.date_created_gmt>='2026-09-08'",ARRAY_A);
  $o['wc_shipping_by_method']=$wpdb->get_results("SELECT oi.order_item_name m, COUNT(*) n, ROUND(SUM(om.meta_value),2) eur FROM {$p}woocommerce_order_items oi JOIN {$p}woocommerce_order_itemmeta om ON om.order_item_id=oi.order_item_id AND om.meta_key='cost' JOIN {$p}wc_orders o ON o.id=oi.order_id WHERE oi.order_item_type='shipping' AND o.date_created_gmt>='2026-09-08' GROUP BY m",ARRAY_A);
  $o['zones']=$wpdb->get_results("SELECT zm.instance_id, zm.method_id, zm.is_enabled, z.zone_name FROM {$p}woocommerce_shipping_zone_methods zm JOIN {$p}woocommerce_shipping_zones z ON z.zone_id=zm.zone_id",ARRAY_A);
  foreach($o['zones'] as &$z){ $s=get_option('woocommerce_'.$z['method_id'].'_'.$z['instance_id'].'_settings'); $z['cost']=isset($s['cost'])?$s['cost']:null; $z['min']=isset($s['min_amount'])?$s['min_amount']:null; $z['title']=isset($s['title'])?$s['title']:null; } unset($z);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
