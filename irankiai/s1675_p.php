<?php
/** TEMP PS S1675 run p — dingę ID 35869-70, 35877-79, 35895-35900: pėdsakai. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_p5'])) return; global $wpdb; $p=$wpdb->prefix; $wpdb->suppress_errors(true); $o=array('v'=>'S1675 p');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $ids='35869,35870,35877,35878,35879,35895,35896,35897,35898,35899,35900';
  $o['ivykiai']=$wpdb->get_results("SELECT uzsakymas,laikas,sritis,veiksmas,rezultatas,kas_vardas,LEFT(pastaba,70) pastaba FROM {$p}ps_uzsakymu_ivykiai WHERE uzsakymas IN ($ids) ORDER BY id",ARRAY_A);
  $o['fakt']=$wpdb->get_results("SELECT * FROM {$p}ps_fakt_uzsakymai WHERE order_id IN ($ids) OR uzsakymas IN ($ids) LIMIT 5",ARRAY_A);
  $o['fakt_stulp']=array_slice($wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_uzsakymai",0),0,8);
  $o['carts']=$wpdb->get_results("SELECT converted_order_id,status,updated_at FROM {$p}ps_carts WHERE converted_order_id IN ($ids)",ARRAY_A);
  $o['meta_liko']=$wpdb->get_results("SELECT order_id,COUNT(*) c FROM {$p}wc_orders_meta WHERE order_id IN ($ids) GROUP BY order_id",ARRAY_A);
  $o['items_liko']=$wpdb->get_results("SELECT order_id,COUNT(*) c FROM {$p}woocommerce_order_items WHERE order_id IN ($ids) GROUP BY order_id",ARRAY_A);
  $o['posts_liko']=$wpdb->get_results("SELECT ID,post_type,post_status,post_date FROM {$p}posts WHERE ID IN ($ids)",ARRAY_A);
  $o['notes_liko']=$wpdb->get_results("SELECT comment_post_ID id,comment_date d,LEFT(comment_content,90) t FROM {$p}comments WHERE comment_post_ID IN ($ids) ORDER BY comment_ID",ARRAY_A);
  $o['web_0911_rytas']=$wpdb->get_results("SELECT laikas,tipas,LEFT(url_kelias,40) u,LEFT(reiksme,40) r FROM {$p}ps_web_ivykiai WHERE laikas BETWEEN '2026-09-11 05:00' AND '2026-09-11 09:30' AND tipas IN ('begin_checkout','purchase','add_payment_info','add_shipping_info') ORDER BY laikas",ARRAY_A);
  $o['as_draft_cleanup']=$wpdb->get_results("SELECT hook,status,last_attempt_gmt FROM {$p}actionscheduler_actions WHERE hook LIKE '%draft%' OR hook LIKE '%cleanup_draft%' ORDER BY action_id DESC LIMIT 4",ARRAY_A);
  $o['as_0911']=$wpdb->get_results("SELECT hook,COUNT(*) c FROM {$p}actionscheduler_actions WHERE last_attempt_gmt BETWEEN '2026-09-11 03:00' AND '2026-09-11 09:30' AND status='complete' GROUP BY hook",ARRAY_A);
  $o['ivykiai_visi_0911']=$wpdb->get_results("SELECT uzsakymas,laikas,sritis,veiksmas,kas_vardas FROM {$p}ps_uzsakymu_ivykiai WHERE laikas BETWEEN '2026-09-11 05:00' AND '2026-09-11 09:30' ORDER BY id",ARRAY_A);
  $o['db']=$wpdb->last_error;
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
