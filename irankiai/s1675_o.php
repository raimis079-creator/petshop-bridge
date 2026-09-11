<?php
/** TEMP PS S1675 run o — užsakymų istorija nuo T-0: visi ID (incl. trash/draft), spragos, atšaukimo/trynimo mechanizmai. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_o5'])) return; global $wpdb; $p=$wpdb->prefix; $wpdb->suppress_errors(true); $o=array('v'=>'S1675 o');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $rows=$wpdb->get_results("SELECT o.id,o.type,o.status,o.payment_method pm,o.total_amount t,o.date_created_gmt dc,o.date_updated_gmt du,m.meta_value nr FROM {$p}wc_orders o LEFT JOIN {$p}wc_orders_meta m ON m.order_id=o.id AND m.meta_key='_ps_order_number' WHERE o.id>=35868 ORDER BY o.id",ARRAY_A);
  $ids=array_column($rows,'id'); $o['viso']=count($rows); $o['min_max']=array(min($ids),max($ids));
  $sp=array(); for($i=(int)min($ids);$i<=(int)max($ids);$i++) if(!in_array((string)$i,$ids,true)) $sp[]=$i; $o['spragos_id']=$sp;
  $o['sarasas']=array_map(function($r){ return $r['id'].' '.($r['nr']?'#'.$r['nr']:'').' '.substr($r['type'],5).' '.substr($r['status'],3).' '.$r['pm'].' '.round($r['t'],2).' '.substr($r['dc'],5,11); },$rows);
  $o['pagal_statusa']=$wpdb->get_results("SELECT status,COUNT(*) c FROM {$p}wc_orders WHERE id>=35868 AND type='shop_order' GROUP BY status",ARRAY_A);
  // įvykiai: trynimas/atšaukimas
  $o['iv_stulp']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_uzsakymu_ivykiai",0);
  $o['iv_atsauk']=$wpdb->get_results("SELECT uzsakymas,sritis,veiksmas,rezultatas,kas_vardas,LEFT(pastaba,80) pastaba,laikas FROM {$p}ps_uzsakymu_ivykiai WHERE veiksmas LIKE '%atsauk%' OR veiksmas LIKE '%trin%' OR veiksmas LIKE '%valym%' OR veiksmas LIKE '%cancel%' OR veiksmas LIKE '%delete%' ORDER BY id DESC LIMIT 15",ARRAY_A);
  // WC cancel hold stock nustatymas
  $o['hold_stock_min']=get_option('woocommerce_hold_stock_minutes'); $o['manage_stock']=get_option('woocommerce_manage_stock');
  $o['as_cancel']=$wpdb->get_results("SELECT status,scheduled_date_gmt,last_attempt_gmt FROM {$p}actionscheduler_actions WHERE hook='woocommerce_cancel_unpaid_orders' ORDER BY action_id DESC LIMIT 3",ARRAY_A);
  // atšauktų valymo cron kodas
  foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $f){ $c=file_get_contents($f); if(strpos($c,'ps_dl_atsauktu_valymas')!==false||strpos($c,'wp_delete_post')!==false||strpos($c,'->delete(')!==false||strpos($c,'wc_delete_shop_order_transients')!==false){ $ls=explode("\n",$c); foreach($ls as $i=>$l){ if(preg_match('/ps_dl_atsauktu_valymas|wp_delete_post|->delete\(\s*true|checkout-draft|DAY_IN_SECONDS|INTERVAL \d+ (DAY|HOUR)/',$l) && !preg_match('/^\s*(\*|\/\/)/',$l)) $o['kodas'][basename($f)][$i+1]=mb_substr(trim($l),0,150); } } }
  $o['cron_valymas']=wp_next_scheduled('ps_dl_atsauktu_valymas')?date('m-d H:i',wp_next_scheduled('ps_dl_atsauktu_valymas')):'NĖRA';
  $o['valymas_opc']=$wpdb->get_results("SELECT option_name n,LEFT(option_value,300) v FROM {$p}options WHERE option_name LIKE 'ps_dl_%valym%' OR option_name LIKE 'ps_dl_atsauk%'",ARRAY_A);
  // WC pastabos apie ištrynimą/atšaukimą pastarųjų 4 d.
  $o['notes_cancel']=$wpdb->get_results("SELECT c.comment_post_ID id,LEFT(c.comment_content,110) t,c.comment_date d FROM {$p}comments c WHERE c.comment_type='order_note' AND c.comment_date>'2026-09-09' AND (c.comment_content LIKE '%tšauk%' OR c.comment_content LIKE '%ancel%' OR c.comment_content LIKE '%nebeapmok%' OR c.comment_content LIKE '%Unpaid%') ORDER BY c.comment_ID DESC LIMIT 20",ARRAY_A);
  $o['db']=$wpdb->last_error;
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
