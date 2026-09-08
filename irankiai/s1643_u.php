<?php
/** TEMP PS S1643 U — READ-ONLY: kokie uzsakymai WP DB + serijų skaitikliai. */
add_action('init', function(){
  if (!isset($_GET['ps_s1643u'])) return;
  $o=array('v'=>'S1643 U'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");

  $hpos=(int)$wpdb->get_var("SHOW TABLES LIKE '{$p}wc_orders'")?1:0;
  $o['hpos_lentele']=$hpos?1:0;
  if($wpdb->get_var("SHOW TABLES LIKE '{$p}wc_orders'")){
    $o['wc_orders']=$wpdb->get_results("SELECT id,status,date_created_gmt,total_amount FROM {$p}wc_orders ORDER BY id DESC LIMIT 30");
    $o['wc_orders_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_orders");
  }
  $o['posts_shop_order_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}posts WHERE post_type IN('shop_order','shop_order_placehold')");
  $o['posts_paskutiniai']=$wpdb->get_results("SELECT ID,post_type,post_status,post_date FROM {$p}posts WHERE post_type IN('shop_order','shop_order_placehold') ORDER BY ID DESC LIMIT 15");
  $o['refund_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}posts WHERE post_type='shop_order_refund'");
  $o['max_post_id']=(int)$wpdb->get_var("SELECT MAX(ID) FROM {$p}posts");
  $o['auto_increment_posts']=$wpdb->get_var("SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='{$p}posts'");
  if($wpdb->get_var("SHOW TABLES LIKE '{$p}wc_orders'")) $o['auto_increment_wc_orders']=$wpdb->get_var("SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='{$p}wc_orders'");

  $ops=$wpdb->get_results("SELECT option_name,option_value FROM {$p}options WHERE option_name LIKE '%counter%' OR option_name LIKE '%serij%' OR option_name LIKE 'petshop_%avpn%' OR option_name LIKE 'petshop_%iapv%' OR option_name LIKE 'petshop_%kr%' OR option_name LIKE 'petshop_%ppk%' OR option_name LIKE '%invoice%' OR option_name LIKE '%numer%'");
  $c=array(); foreach($ops as $r) $c[$r->option_name]=mb_substr((string)$r->option_value,0,60);
  $o['skaitikliai']=$c;

  $o['ps_lenteles']=array();
  foreach($wpdb->get_col("SHOW TABLES LIKE '{$p}ps\\_%'") as $t) $o['ps_lenteles'][$t]=(int)$wpdb->get_var("SELECT COUNT(*) FROM `$t`");
  $o['ping']=wp_remote_retrieve_response_code(wp_remote_get(home_url('/'),array('timeout'=>30,'sslverify'=>false)));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
