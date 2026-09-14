<?php
/** TEMP PS S1681 ac — read-only: kas siunčia laiškus svetimiems adresams — nauji vartotojai 48 val., komentarai, ps_carts svetimi el. paštai, laiškų žurnalai, wp_mail from. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681ac'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1681 ac');
  $o['users48']=$wpdb->get_results("SELECT ID,user_login,user_email,user_registered FROM {$p}users WHERE user_registered>=DATE_SUB(NOW(),INTERVAL 48 HOUR) ORDER BY ID DESC LIMIT 30",ARRAY_A);
  $o['users_n_7d']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}users WHERE user_registered>=DATE_SUB(NOW(),INTERVAL 7 DAY)");
  $o['orange']=$wpdb->get_results("SELECT ID,user_email,user_registered FROM {$p}users WHERE user_email LIKE '%orange.fr%' OR user_email LIKE '%saintgeniest%'",ARRAY_A);
  $o['comments48']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}comments WHERE comment_date>=DATE_SUB(NOW(),INTERVAL 48 HOUR)");
  $o['carts_svetimi']=$wpdb->get_results("SELECT email,status,created_at FROM {$p}ps_carts WHERE created_at>=DATE_SUB(NOW(),INTERVAL 48 HOUR) AND email<>'' AND email NOT LIKE '%.lt' ORDER BY id DESC LIMIT 20",ARRAY_A);
  foreach($wpdb->get_results("SHOW TABLES LIKE '%mail%'",ARRAY_N) as $r) $o['mail_lent'][]=$r[0];
  foreach($wpdb->get_results("SHOW TABLES LIKE '{$p}ps_%lai%'",ARRAY_N) as $r) $o['mail_lent'][]=$r[0];
  $o['reg']=array('users_can_register'=>get_option('users_can_register'),'wc_reg_checkout'=>get_option('woocommerce_enable_signup_and_login_from_checkout'),'wc_reg_myaccount'=>get_option('woocommerce_enable_myaccount_registration'),'wc_gen_pass'=>get_option('woocommerce_registration_generate_password'));
  $o['smtp']=$wpdb->get_results("SELECT option_name n,LEFT(option_value,200) v FROM {$p}options WHERE option_name LIKE 'wp_mail_smtp%' OR option_name LIKE 'woocommerce_email_from%' OR option_name LIKE 'ps_%pasto%' OR option_name LIKE 'ps_%smtp%' LIMIT 10",ARRAY_A);
  $o['plugins']=array_values(array_filter(get_option('active_plugins'),function($x){return preg_match('/mail|smtp|log|form|captcha|spam/i',$x);}));
  $o['pending_orders']=$wpdb->get_results("SELECT id,status,billing_email,date_created_gmt FROM {$p}wc_orders WHERE type='shop_order' AND date_created_gmt>=DATE_SUB(NOW(),INTERVAL 48 HOUR) AND billing_email NOT LIKE '%.lt' LIMIT 10",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
