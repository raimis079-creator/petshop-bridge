<?php
/** TEMP PS S1684 mc — READ-ONLY: vartai C — rinkodaros sutikimų būklė: WC kasa (opt-in laukas), user/order meta, Sender plugino nustatymai, istorinių klientų sutikimo žymos, ps_email_jobs/laiskai. */
add_action('init', function(){
  if (!isset($_GET['ps_s1684mc'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1684 mc'); $wpdb->suppress_errors(true);
  $o['meta_keys_order']=$wpdb->get_results("SELECT meta_key k, COUNT(*) n FROM {$p}wc_orders_meta WHERE meta_key REGEXP 'optin|opt_in|marketing|naujien|sutik|consent|subscribe|newsletter|sender' GROUP BY k",ARRAY_A);
  $o['meta_keys_user']=$wpdb->get_results("SELECT meta_key k, COUNT(*) n, SUM(meta_value IN('1','yes','true','on')) taip FROM {$p}usermeta WHERE meta_key REGEXP 'optin|opt_in|marketing|naujien|sutik|consent|subscribe|newsletter|sender' GROUP BY k",ARRAY_A);
  $o['meta_keys_post']=$wpdb->get_results("SELECT meta_key k, COUNT(*) n FROM {$p}postmeta WHERE meta_key REGEXP 'optin|opt_in|marketing|naujien|sutik|consent|subscribe|newsletter' GROUP BY k",ARRAY_A);
  $o['options']=$wpdb->get_results("SELECT option_name k, LEFT(option_value,300) v FROM {$p}options WHERE option_name REGEXP 'sender|newsletter|marketing_opt|consent|sutik|ps_laisk|ps_email|ps_kanal' AND option_name NOT LIKE '_transient%' LIMIT 40",ARRAY_A);
  $o['plugins']=array_values(array_filter((array)get_option('active_plugins'),function($x){return preg_match('/sender|mail|news|consent|cookie|gdpr/i',$x);}));
  $o['tables']=$wpdb->get_col("SHOW TABLES WHERE Tables_in_".DB_NAME." REGEXP 'sender|newsletter|subscri|sutik|consent|email|laisk|ps_ist_klient|ps_klient'");
  foreach($o['tables'] as $t){ $c=$wpdb->get_col("SHOW COLUMNS FROM $t"); $o['tbl'][$t]=array('cols'=>$c,'n'=>$wpdb->get_var("SELECT COUNT(*) FROM $t")); }
  foreach($o['tables'] as $t) if(preg_match('/ist_klient|ps_klient/',$t)){ $c=$o['tbl'][$t]['cols']; foreach($c as $col) if(preg_match('/naujien|sutik|opt|marketing|subscr/i',$col)) $o['ist_sutik'][$t.'.'.$col]=$wpdb->get_results("SELECT `$col` v, COUNT(*) n FROM $t GROUP BY v",ARRAY_A); }
  $o['ps_email_jobs']=$wpdb->get_results("SELECT tipas, COUNT(*) n FROM {$p}ps_email_jobs GROUP BY tipas",ARRAY_A);
  // kasos forma: ar yra opt-in laukas (checkout blocks / classic)
  $o['checkout_page']=$wpdb->get_var("SELECT LEFT(post_content,1500) FROM {$p}posts WHERE ID=".intval(wc_get_page_id('checkout')));
  $o['wc_marketing_optin_setting']=get_option('woocommerce_enable_marketing_optin',null);
  // privatumo/sutikimo tekstai
  $o['privacy_page']=wc_privacy_policy_page_id(); $o['terms_page']=wc_terms_and_conditions_page_id();
  $o['sender_form_shortcodes']=$wpdb->get_results("SELECT ID, post_type, post_title FROM {$p}posts WHERE post_status IN('publish','private') AND post_content LIKE '%sender%' AND post_type IN('page','wp_template','wp_template_part','wp_block') LIMIT 10",ARRAY_A);
  // unikalūs el. paštai: istorija vs dabar
  $o['emails']=array('ist_hash'=>$wpdb->get_var("SELECT COUNT(DISTINCT klientas_email_hash) FROM {$p}ps_ist_fakt_uzsakymai"),'wc_customers'=>$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_customer_lookup"),'wc_users_customer'=>$wpdb->get_var("SELECT COUNT(*) FROM {$p}usermeta WHERE meta_key='{$p}capabilities' AND meta_value LIKE '%customer%'"));
  // sender.net lentelės/ meta iš plugino
  $o['sender_user_meta']=$wpdb->get_results("SELECT meta_key k, COUNT(*) n FROM {$p}usermeta WHERE meta_key LIKE '%sender%' GROUP BY k",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
