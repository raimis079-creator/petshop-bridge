<?php
/** TEMP PS S1675 run j — 35873/35902 klientų kiti užsakymai; krepšelio priminimų būklė. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_j5'])) return; global $wpdb; $p=$wpdb->prefix; $wpdb->suppress_errors(true); $o=array('v'=>'S1675 j');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  foreach(array(35873,35902) as $id){ $w=wc_get_order($id); $e=$w->get_billing_email(); $k=$wpdb->get_results($wpdb->prepare("SELECT id,status,payment_method,total_amount,date_created_gmt FROM {$p}wc_orders WHERE billing_email=%s AND type='shop_order' AND id<>%d ORDER BY id DESC LIMIT 5",$e,$id),ARRAY_A); foreach($k as &$x){ $x['nr']=wc_get_order($x['id'])->get_order_number(); } $o[$id]=array('nr'=>$w->get_order_number(),'vardas'=>mb_substr($w->get_billing_first_name(),0,2).'***','el'=>substr($e,0,2).'***@'.substr(strrchr($e,'@'),1),'kiti'=>$k); }
  foreach(array('ps_cart_abandon_check','ps_browse_abandon_check','ps_esp_cron_process_pending','ps_email_dispatch_cron') as $h) $o['cron'][$h]=wp_next_scheduled($h)?date('m-d H:i',wp_next_scheduled($h)):'NĖRA';
  $o['carts_stulp']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_carts",0);
  $o['carts_7d']=$wpdb->get_results("SELECT status,COUNT(*) c FROM {$p}ps_carts WHERE updated_at>DATE_SUB(NOW(),INTERVAL 7 DAY) GROUP BY status",ARRAY_A);
  $o['jobs_cart']=$wpdb->get_results("SELECT flow,status,skip_reason,COUNT(*) c,MAX(created_at) pask FROM {$p}ps_email_jobs WHERE flow LIKE '%cart%' OR flow LIKE '%krep%' GROUP BY flow,status,skip_reason",ARRAY_A);
  $o['flow_opc']=$wpdb->get_results("SELECT option_name n,LEFT(option_value,200) v FROM {$p}options WHERE option_name LIKE 'ps_%cart%' OR option_name LIKE 'ps_%abandon%' OR option_name LIKE 'ps_%krep%' LIMIT 12",ARRAY_A);
  $o['db']=$wpdb->last_error;
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
