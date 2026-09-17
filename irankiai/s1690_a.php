<?php
/** TEMP PS S1690 a — ar seni klientai gali prisijungti / kas vyksta kasoje. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1690a'])) return; global $wpdb; $p=$wpdb->prefix; $o=array(); $wpdb->suppress_errors(true);
  $T0='2026-09-07 19:07:00';
  $o['users_total']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}users");
  $o['users_pries_t0']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}users WHERE user_registered<'$T0'");
  $o['pass_formatai']=$wpdb->get_results("SELECT LEFT(user_pass,4) f, (user_registered<'$T0') senas, COUNT(*) n FROM {$p}users GROUP BY f,senas",ARRAY_A);
  $o['pass_tuscias']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}users WHERE user_pass='' OR user_pass IS NULL");
  $o['reset_raktai_po_t0']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}users WHERE user_activation_key<>'' AND SUBSTRING_INDEX(user_activation_key,':',1) REGEXP '^[0-9]+$' AND FROM_UNIXTIME(SUBSTRING_INDEX(user_activation_key,':',1))>='$T0'");
  $o['reset_raktai_dienomis']=$wpdb->get_results("SELECT DATE(FROM_UNIXTIME(SUBSTRING_INDEX(user_activation_key,':',1))) d, COUNT(*) n FROM {$p}users WHERE user_activation_key<>'' AND SUBSTRING_INDEX(user_activation_key,':',1) REGEXP '^[0-9]+$' AND FROM_UNIXTIME(SUBSTRING_INDEX(user_activation_key,':',1))>='$T0' GROUP BY d",ARRAY_A);
  $o['sesijos_aktyvios']=$wpdb->get_results("SELECT (u.user_registered<'$T0') senas, COUNT(*) n FROM {$p}usermeta m JOIN {$p}users u ON u.ID=m.user_id WHERE m.meta_key='session_tokens' GROUP BY senas",ARRAY_A);
  $o['pask_login_meta']=$wpdb->get_results("SELECT meta_key, COUNT(*) n FROM {$p}usermeta WHERE meta_key IN ('wc_last_active','last_login','_ps_last_login','ps_last_login') GROUP BY meta_key",ARRAY_A);
  $o['wc_last_active_po_t0']=$wpdb->get_results("SELECT (u.user_registered<'$T0') senas, COUNT(*) n FROM {$p}usermeta m JOIN {$p}users u ON u.ID=m.user_id WHERE m.meta_key='wc_last_active' AND m.meta_value>=UNIX_TIMESTAMP('$T0') GROUP BY senas",ARRAY_A);
  $o['uzs_po_t0_pagal_klienta']=$wpdb->get_results("SELECT CASE WHEN o.customer_id=0 THEN 'svecias' WHEN u.user_registered<'$T0' THEN 'senas_prisijunges' ELSE 'naujas_prisijunges' END k, COUNT(*) n, SUM(o.status IN ('wc-processing','wc-completed','wc-on-hold')) ok FROM {$p}wc_orders o LEFT JOIN {$p}users u ON u.ID=o.customer_id WHERE o.type='shop_order' AND o.date_created_gmt>='$T0' GROUP BY k",ARRAY_A);
  $o['sveciai_su_sena_paskyra']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_orders o JOIN {$p}users u ON u.user_email=o.billing_email WHERE o.type='shop_order' AND o.customer_id=0 AND o.date_created_gmt>='$T0' AND u.user_registered<'$T0'");
  $o['dienos_po_t0']=$wpdb->get_results("SELECT DATE(CONVERT_TZ(date_created_gmt,'+00:00','+03:00')) d, COUNT(*) n, SUM(status IN ('wc-processing','wc-completed','wc-on-hold')) ok, SUM(customer_id>0) login FROM {$p}wc_orders WHERE type='shop_order' AND date_created_gmt>='$T0' GROUP BY d",ARRAY_A);
  // WC log place-order-debug: klaidos pagal dieną
  $o['log']=$wpdb->get_results("SELECT DATE(timestamp) d, SUBSTRING_INDEX(SUBSTRING(message,1,120),'{',1) m, COUNT(*) n FROM {$p}woocommerce_log WHERE source='place-order-debug' AND message NOT LIKE '%totals calculated%' AND message NOT LIKE '%Start%' GROUP BY d,m ORDER BY d,n DESC",ARRAY_A);
  $o['log_sources_siandien']=$wpdb->get_results("SELECT source, level, COUNT(*) n FROM {$p}woocommerce_log WHERE timestamp>=CURDATE() GROUP BY source,level ORDER BY n DESC LIMIT 15",ARRAY_A);
  $f=get_stylesheet_directory().'/functions.php'; $s=file_get_contents($f); $i=strpos($s,'function petshop_account_checkbox_default');
  $o['fn']=$i!==false? substr($s,max(0,$i-300),1400):'NERA';
  $o['wc_opt']=array('guest'=>get_option('woocommerce_enable_guest_checkout'),'signup'=>get_option('woocommerce_enable_signup_and_login_from_checkout'),'gen_user'=>get_option('woocommerce_registration_generate_username'),'gen_pass'=>get_option('woocommerce_registration_generate_password'),'login'=>get_option('woocommerce_enable_checkout_login_reminder'),'hold'=>get_option('woocommerce_hold_stock_minutes'));
  $o['ads_siandien']=$wpdb->get_results("SELECT * FROM {$p}ps_fakt_reklama ORDER BY diena DESC LIMIT 3",ARRAY_A);
  $o['ivykiai_dienos']=$wpdb->get_results("SELECT diena, COUNT(DISTINCT sesija) ses, SUM(tipas='begin_checkout') chk, SUM(tipas='purchase') pur FROM {$p}ps_web_ivykiai WHERE testinis=0 AND diena>=CURDATE()-INTERVAL 7 DAY GROUP BY diena",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
