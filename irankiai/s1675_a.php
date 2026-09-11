<?php
/** TEMP PS S1675 run a — AUDITAS: sargai, cron, eilės, klaidos, likučiai, snippetai, mu-plugins. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_a5'])) return;
  global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1675 a','laikas'=>current_time('Y-m-d H:i'));
  $wpdb->suppress_errors(true); $o['ps_lenteles']=$wpdb->get_col("SHOW TABLES LIKE '{$p}ps_%'");
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  // snippetai
  $o['snip_aktyvus']=$wpdb->get_results("SELECT id,name FROM {$p}snippets WHERE active=1 ORDER BY id",ARRAY_A);
  $o['snip_temp_aktyvus']=$wpdb->get_results("SELECT id,name FROM {$p}snippets WHERE active=1 AND name LIKE 'TEMP%'",ARRAY_A);
  // mu-plugins + plugins
  foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $f){ $h=file_get_contents($f,false,null,0,600); preg_match('/Version:\s*([\d.]+)|v(\d+\.\d+(?:\.\d+)?)/i',$h,$m); $o['mu'][basename($f)]=array('v'=>$m[1]??$m[2]??'?','md5'=>substr(md5_file($f),0,8),'kb'=>round(filesize($f)/1024)); }
  $o['plugins_aktyvus']=get_option('active_plugins');
  // cron: visi petshop/ps_ + pavėlavę
  $cr=_get_cron_array(); $now=time(); $ps=array(); $vel=array();
  foreach($cr as $ts=>$hooks){ foreach($hooks as $h=>$x){ if(preg_match('/^(ps_|petshop)/',$h)){ if(!isset($ps[$h])) $ps[$h]=date('m-d H:i',$ts); } if($ts<$now-3600 && !isset($vel[$h])) $vel[$h]=round(($now-$ts)/3600,1).'h'; } }
  $o['cron_ps']=$ps; $o['cron_pavelave']=$vel; $o['cron_disable']=defined('DISABLE_WP_CRON')?DISABLE_WP_CRON:'nedef';
  $o['venipak_sekimas_pask']=get_option('ps_venipak_sekimas_paskutinis','');
  // Action Scheduler
  $o['as']=$wpdb->get_results("SELECT status,COUNT(*) c FROM {$p}actionscheduler_actions GROUP BY status",ARRAY_A);
  $o['as_failed_pask']=$wpdb->get_results("SELECT hook,last_attempt_gmt FROM {$p}actionscheduler_actions WHERE status='failed' ORDER BY last_attempt_gmt DESC LIMIT 5",ARRAY_A);
  // užsakymai
  $o['uzs_statusai']=$wpdb->get_results("SELECT status,COUNT(*) c FROM {$p}wc_orders WHERE type='shop_order' AND date_created_gmt>'2026-09-09' GROUP BY status",ARRAY_A);
  $o['uzs_processing_seni']=$wpdb->get_results("SELECT id,date_created_gmt FROM {$p}wc_orders WHERE status='wc-processing' AND date_created_gmt<DATE_SUB(UTC_TIMESTAMP(),INTERVAL 2 DAY) ORDER BY id",ARRAY_A);
  $o['uzs_onhold']=$wpdb->get_results("SELECT id,date_created_gmt FROM {$p}wc_orders WHERE status='wc-on-hold' ORDER BY id",ARRAY_A);
  $o['uzs_pending']=$wpdb->get_results("SELECT id,date_created_gmt,payment_method FROM {$p}wc_orders WHERE status='wc-pending' ORDER BY id",ARRAY_A);
  $o['uzs_be_ps_nr']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_orders o LEFT JOIN {$p}wc_orders_meta m ON m.order_id=o.id AND m.meta_key='_ps_order_number' WHERE o.type='shop_order' AND o.status NOT IN ('wc-checkout-draft','trash') AND o.id>35879 AND m.meta_value IS NULL");
  foreach(array('ps_avpn_serija','ps_iapv_serija','ps_kr_serija','ps_ppk_serija','petshop_order_counter') as $k) $o['serijos'][$k]=get_option($k,'?');
  $o['avpn_dubl']=$wpdb->get_results("SELECT meta_value v,COUNT(*) c FROM {$p}wc_orders_meta WHERE meta_key='_petshop_avpn_number' GROUP BY meta_value HAVING c>1",ARRAY_A);
  // sargai
  $o['rs_trap']=count((array)get_option('ps_rs_trap',array()));
  $o['retry_queue']=$wpdb->get_results("SELECT status,COUNT(*) c FROM {$p}ps_retry_queue GROUP BY status",ARRAY_A);
  $o['retry_dead_nauji']=$wpdb->get_results("SELECT id,tipas,klaida FROM {$p}ps_retry_queue WHERE status='dead' AND sukurta>'2026-09-10' ORDER BY id DESC LIMIT 5",ARRAY_A);
  $o['sender_webhook']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_sender_webhook_log");
  $o['sla_velavimai']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_orders_meta WHERE meta_key='_ps_sla_velavimas'");
  $o['sargas_pastas']=get_option('ps_sargas_pastas','');
  $o['sargas_pask']=mb_substr(json_encode(get_option('ps_sargas_paskutinis',''),JSON_UNESCAPED_UNICODE),0,400);
  foreach($wpdb->get_results("SELECT option_name n,option_value v FROM {$p}options WHERE option_name LIKE 'ps_sarg%' LIMIT 15") as $r) $o['sargo_opc'][$r->n]=mb_substr($r->v,0,120);
  // likučiai
  $o['stock_neig']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}postmeta WHERE meta_key='_stock' AND meta_value+0<0");
  $o['own_neig']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}postmeta WHERE meta_key='_own_stock_qty' AND meta_value+0<0");
  $o['instock_be_likucio']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}postmeta s JOIN {$p}postmeta st ON st.post_id=s.post_id AND st.meta_key='_stock_status' AND st.meta_value='instock' JOIN {$p}posts po ON po.ID=s.post_id AND po.post_status='publish' AND po.post_type='product' LEFT JOIN {$p}postmeta ow ON ow.post_id=s.post_id AND ow.meta_key='_own_stock_qty' WHERE s.meta_key='_stock' AND (s.meta_value+0+IFNULL(ow.meta_value,0))<=0");
  $o['av_reg_vs_own']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_sources r JOIN {$p}postmeta m ON m.post_id=r.product_id AND m.meta_key='_own_stock_qty' WHERE r.source='av' AND r.is_active=1 AND r.stock_qty<>m.meta_value+0");
  $o['partijos']=$wpdb->get_row("SELECT COUNT(*) c,SUM(kiekis) s FROM {$p}ps_partijos WHERE atsaukta=0",ARRAY_A);
  // laiškai / SMTP / paysera
  $o['dev_pastas_yra']=file_exists(WPMU_PLUGIN_DIR.'/petshop-dev-pastas.php')?'YRA':'ne';
  $o['paysera_status']=get_option('paysera_payment_status_settings');
  $o['paysera_test']=mb_substr(json_encode(get_option('paysera_payment_settings')),0,200);
  $o['blog_public']=get_option('blog_public'); $o['siteurl']=get_option('siteurl');
  $o['welcome']=get_option('petshop_welcome_modal_enabled');
  // feed'ai
  foreach(array('google','kaina24','kainos') as $f){ $ff=WP_CONTENT_DIR."/uploads/feeds/$f.xml"; $o['feed'][$f]=file_exists($ff)?date('m-d H:i',filemtime($ff)).' '.round(filesize($ff)/1024).'kb':'NERA'; }
  foreach($wpdb->get_results("SELECT option_name n,option_value v FROM {$p}options WHERE option_name LIKE 'ps_feed%' LIMIT 10") as $r) $o['feed_opc'][$r->n]=mb_substr($r->v,0,100);
  // PHP klaidos
  foreach(array(WP_CONTENT_DIR.'/debug.log', ABSPATH.'error_log', dirname(ABSPATH).'/error_log', ABSPATH.'wp-admin/error_log') as $f){ if(file_exists($f)){ $t=substr(file_get_contents($f),-40000); $ls=array_filter(explode("\n",$t)); $sk=array(); foreach($ls as $l){ if(preg_match('/(Fatal|Warning|Notice|Deprecated)[^:]*:\s*(.{0,110})/',$l,$m)){ $k=$m[1].': '.preg_replace('/\d+/','#',$m[2]); $sk[$k]=($sk[$k]??0)+1; } } arsort($sk); $o['php_log'][$f]=array('dydis'=>filesize($f),'mtime'=>date('m-d H:i',filemtime($f)),'top'=>array_slice($sk,0,12,true)); } }
  $o['wp_debug']=defined('WP_DEBUG')?WP_DEBUG:'nedef';
  // 404 per 24h
  $o['ivykiai_24h']=$wpdb->get_results("SELECT tipas,COUNT(*) c FROM {$p}ps_web_ivykiai WHERE laikas>DATE_SUB(NOW(),INTERVAL 1 DAY) GROUP BY tipas ORDER BY c DESC LIMIT 8",ARRAY_A);
  $o['fakt_uzs_max']=$wpdb->get_row("SELECT MAX(order_id) m,COUNT(*) c FROM {$p}ps_fakt_uzsakymai",ARRAY_A);
  $o['fakt_reklama_max']=$wpdb->get_var("SELECT MAX(data) FROM {$p}ps_fakt_reklama");
  $o['ping']=wp_remote_retrieve_response_code(wp_remote_get(home_url('/'),array('timeout'=>30,'sslverify'=>false)));
  $o['rest_wpjson']=wp_remote_retrieve_response_code(wp_remote_get(home_url('/wp-json/'),array('timeout'=>20,'sslverify'=>false)));
  $o['db_klaidos']=$wpdb->last_error;
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
