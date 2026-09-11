<?php
/** TEMP PS S1675 run b — AUDITAS 2: PHP log kelias, sargas, likučiai be stock, on-hold/SLA, email_jobs, lentelės. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_b5'])) return;
  global $wpdb; $p=$wpdb->prefix; $wpdb->suppress_errors(true); $o=array('v'=>'S1675 b');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  // PHP log
  $o['ini_error_log']=ini_get('error_log'); $o['log_errors']=ini_get('log_errors'); $o['display_errors']=ini_get('display_errors');
  $kand=array(ini_get('error_log'), ABSPATH.'error_log', ABSPATH.'wp-admin/error_log', ABSPATH.'wp-content/error_log', dirname(ABSPATH).'/logs/error_log', dirname(ABSPATH).'/php_errorlog', '/home/gyvunai2/domains/petshop.lt/logs/petshop.lt.error.log', '/home/gyvunai2/domains/petshop.lt/logs/petshop.lt.php.log');
  foreach(glob(dirname(ABSPATH).'/logs/*') as $g) $kand[]=$g;
  foreach($kand as $f){ if($f && file_exists($f) && is_file($f)){ $t=substr(file_get_contents($f),-60000); $ls=array_filter(explode("\n",$t)); $sk=array(); $pask='';
    foreach($ls as $l){ if(preg_match('/(Fatal|Warning|Notice|Deprecated|Error)[^:]{0,20}:\s*(.{0,120})/',$l,$m)){ $k=$m[1].': '.preg_replace('/\d{3,}/','#',$m[2]); $sk[$k]=($sk[$k]??0)+1; $pask=$l; } }
    arsort($sk); $o['log'][$f]=array('kb'=>round(filesize($f)/1024),'mtime'=>date('m-d H:i',filemtime($f)),'top'=>array_slice($sk,0,10,true),'pask'=>mb_substr($pask,0,220)); } }
  $wcl=glob(WP_CONTENT_DIR.'/uploads/wc-logs/*fatal*'); rsort($wcl); foreach(array_slice($wcl,0,2) as $f) $o['wc_fatal'][basename($f)]=array('kb'=>round(filesize($f)/1024),'uodega'=>mb_substr(substr(file_get_contents($f),-600),0,600));
  $wcl=glob(WP_CONTENT_DIR.'/uploads/wc-logs/*.log'); usort($wcl,function($a,$b){return filemtime($b)-filemtime($a);}); foreach(array_slice($wcl,0,8) as $f) $o['wc_logs_naujausi'][basename($f)]=date('m-d H:i',filemtime($f)).' '.round(filesize($f)/1024).'kb';
  // sargas
  foreach($wpdb->get_results("SELECT option_name n,option_value v FROM {$p}options WHERE option_name LIKE 'ps_sargas%'") as $r){ $v=maybe_unserialize($r->v); $o['sargas'][$r->n]=is_array($v)?array('n'=>count($v),'pvz'=>array_slice($v,-3,3,true)):mb_substr((string)$v,0,200); }
  $o['sargas_transient']=$wpdb->get_results("SELECT option_name n,LEFT(option_value,150) v FROM {$p}options WHERE option_name LIKE '_transient_ps_sarg%' OR option_name LIKE '_transient_ps_ryt%' LIMIT 8",ARRAY_A);
  // instock be likučio — pagal sandėlį
  $o['instock0_pagal_sandeli']=$wpdb->get_results("SELECT IFNULL(sd.meta_value,'(nėra)') sandelis,COUNT(*) c,SUBSTRING_INDEX(GROUP_CONCAT(s.post_id),',',6) pvz FROM {$p}postmeta s JOIN {$p}postmeta st ON st.post_id=s.post_id AND st.meta_key='_stock_status' AND st.meta_value='instock' JOIN {$p}posts po ON po.ID=s.post_id AND po.post_status='publish' AND po.post_type='product' LEFT JOIN {$p}postmeta ow ON ow.post_id=s.post_id AND ow.meta_key='_own_stock_qty' LEFT JOIN {$p}postmeta sd ON sd.post_id=s.post_id AND sd.meta_key='_ps_sandelis' LEFT JOIN {$p}postmeta ms ON ms.post_id=s.post_id AND ms.meta_key='_manage_stock' WHERE s.meta_key='_stock' AND (s.meta_value+0+IFNULL(ow.meta_value,0))<=0 AND IFNULL(ms.meta_value,'')='yes' GROUP BY sandelis",ARRAY_A);
  $o['instock0_manage_no']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}postmeta ms JOIN {$p}postmeta st ON st.post_id=ms.post_id AND st.meta_key='_stock_status' AND st.meta_value='instock' JOIN {$p}posts po ON po.ID=ms.post_id AND po.post_status='publish' AND po.post_type='product' WHERE ms.meta_key='_manage_stock' AND ms.meta_value='no'");
  $o['av_reg_vs_own_pvz']=$wpdb->get_results("SELECT r.product_id,r.stock_qty reg,m.meta_value own FROM {$p}ps_sources r JOIN {$p}postmeta m ON m.post_id=r.product_id AND m.meta_key='_own_stock_qty' WHERE r.source='av' AND r.is_active=1 AND r.stock_qty<>m.meta_value+0",ARRAY_A);
  // on-hold / SLA / neapmokėti
  foreach(array(35873,35902) as $id){ $w=wc_get_order($id); if($w){ $o['onhold'][$id]=array('nr'=>$w->get_order_number(),'metodas'=>$w->get_payment_method(),'suma'=>$w->get_total(),'sukurta'=>$w->get_date_created()->date('m-d H:i'),'meta'=>array_filter(array('primin'=>$w->get_meta('_ps_bacs_priminimas'),'dunning'=>$w->get_meta('_ps_dunning'),'iapv'=>$w->get_meta('_petshop_iapv_number'),'avpn'=>$w->get_meta('_petshop_avpn_number'),'sla'=>$w->get_meta('_ps_sla_velavimas'))),'pastabos'=>array_map(function($n){return mb_substr($n->content,0,90);},array_slice(wc_get_order_notes(array('order_id'=>$id,'limit'=>4)),0,4))); } }
  $o['sla_uzs']=$wpdb->get_results("SELECT m.order_id,o.status,m.meta_value FROM {$p}wc_orders_meta m JOIN {$p}wc_orders o ON o.id=m.order_id WHERE m.meta_key='_ps_sla_velavimas'",ARRAY_A);
  $o['processing']=$wpdb->get_results("SELECT id,date_created_gmt,payment_method,total_amount FROM {$p}wc_orders WHERE status='wc-processing' ORDER BY id",ARRAY_A);
  // email jobs / retry
  $o['email_jobs']=$wpdb->get_results("SELECT status,COUNT(*) c,MAX(created_at) pask FROM {$p}ps_email_jobs GROUP BY status",ARRAY_A);
  $o['email_jobs_stulpeliai']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_email_jobs",0);
  $o['ps_lenteles_visos']=$wpdb->get_col("SHOW TABLES LIKE '{$p}ps_%'");
  $o['retry_lent']=array_values(array_filter($o['ps_lenteles_visos'],function($t){return strpos($t,'retry')!==false||strpos($t,'partij')!==false||strpos($t,'dlq')!==false;}));
  foreach($o['retry_lent'] as $t){ $o['retry_stat'][$t]=$wpdb->get_results("SELECT COUNT(*) c FROM $t",ARRAY_A); }
  $o['as_pending']=$wpdb->get_results("SELECT hook,COUNT(*) c FROM {$p}actionscheduler_actions WHERE status='pending' GROUP BY hook",ARRAY_A);
  $o['as_past_due']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}actionscheduler_actions WHERE status='pending' AND scheduled_date_gmt<DATE_SUB(UTC_TIMESTAMP(),INTERVAL 1 HOUR)");
  $o['rs_trap']=array_map(function($x){return array('uri'=>$x['uri']??'','laikas'=>$x['laikas']??$x['t']??'');},(array)get_option('ps_rs_trap',array()));
  // sk. 404 24h keliai
  $o['e404_24h']=$wpdb->get_results("SELECT kelias,COUNT(*) c FROM {$p}ps_web_ivykiai WHERE tipas='error404' AND laikas>DATE_SUB(NOW(),INTERVAL 2 DAY) GROUP BY kelias ORDER BY c DESC LIMIT 10",ARRAY_A);
  $o['web_stulp']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_web_ivykiai",0);
  // backup'ai / disk
  $bk=glob(WP_CONTENT_DIR.'/uploads/ps-backups/*'); $o['ps_backups']=array('n'=>count($bk),'mb'=>round(array_sum(array_map('filesize',array_filter($bk,'is_file')))/1048576,1));
  $o['disk_free_gb']=round(disk_free_space(ABSPATH)/1073741824,1);
  $o['upd']=array('wp'=>get_bloginfo('version'),'wc'=>defined('WC_VERSION')?WC_VERSION:'?','php'=>PHP_VERSION,'plugin_upd'=>count((array)(get_site_transient('update_plugins')->response??array())));
  $o['cron_lock']=get_transient('doing_cron'); $o['cron_alt']=defined('ALTERNATE_WP_CRON')?1:0;
  $o['db_klaida']=$wpdb->last_error;
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
