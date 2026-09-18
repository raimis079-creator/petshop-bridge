<?php
/** TEMP PS S1691 a — ūkio apžvalga: Ads, užsakymai, kasa, sargai, cron, laiškai, refill, VF feed, PHP klaidos. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1691a'])) return; global $wpdb; $p=$wpdb->prefix; $o=array(); $wpdb->suppress_errors(true);
  $o['laikas']=current_time('mysql');
  // Ads 7 d. pagal dieną
  $o['ads_dienos']=$wpdb->get_results("SELECT diena, SUM(parodymai) par, SUM(paspaudimai) pasp, ROUND(SUM(islaidos_ct)/100,2) eur, SUM(konversijos) konv, ROUND(SUM(konv_verte_ct)/100) kv FROM {$p}ps_fakt_reklama WHERE diena>=CURDATE()-INTERVAL 7 DAY GROUP BY diena ORDER BY diena",ARRAY_A);
  $o['ads_kamp_3d']=$wpdb->get_results("SELECT LEFT(kampanija,30) k, ROUND(SUM(islaidos_ct)/100,2) eur, SUM(paspaudimai) pasp, SUM(konversijos) konv FROM {$p}ps_fakt_reklama WHERE diena>=CURDATE()-INTERVAL 3 DAY GROUP BY k ORDER BY eur DESC",ARRAY_A);
  $o['ads_pask_traukimas']=$wpdb->get_var("SELECT MAX(diena) FROM {$p}ps_fakt_reklama");
  // gclid užsakymai 7 d.
  $o['gclid_uzs']=$wpdb->get_results("SELECT DATE(CONVERT_TZ(o.date_created_gmt,'+00:00','+03:00')) d, COUNT(*) n, ROUND(SUM(o.total_amount)) eur FROM {$p}wc_orders o JOIN {$p}wc_orders_meta m ON m.order_id=o.id AND m.meta_key='_ps_gclid' WHERE o.type='shop_order' AND o.status IN ('wc-processing','wc-completed','wc-on-hold') AND o.date_created_gmt>=NOW()-INTERVAL 7 DAY GROUP BY d ORDER BY d",ARRAY_A);
  // Užsakymai 7 d.
  $o['uzs_dienos']=$wpdb->get_results("SELECT DATE(CONVERT_TZ(date_created_gmt,'+00:00','+03:00')) d, COUNT(*) viso, SUM(status IN ('wc-processing','wc-completed','wc-on-hold')) ok, SUM(status='wc-pending') pending, SUM(status='wc-cancelled') atsaukta, SUM(status='wc-failed') failed, ROUND(SUM(CASE WHEN status IN ('wc-processing','wc-completed','wc-on-hold') THEN total_amount END)) eur FROM {$p}wc_orders WHERE type='shop_order' AND date_created_gmt>=NOW()-INTERVAL 7 DAY GROUP BY d ORDER BY d",ARRAY_A);
  $o['uzs_siandien']=$wpdb->get_results("SELECT o.id, o.status, ROUND(o.total_amount) eur, o.payment_method pm, LEFT(o.billing_email,3) em, DATE_FORMAT(CONVERT_TZ(o.date_created_gmt,'+00:00','+03:00'),'%H:%i') t FROM {$p}wc_orders o WHERE o.type='shop_order' AND o.date_created_gmt>=CONVERT_TZ(CURDATE(),'+03:00','+00:00') ORDER BY o.id",ARRAY_A);
  $o['processing_atviri']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_orders WHERE type='shop_order' AND status='wc-processing'");
  $o['onhold_atviri']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_orders WHERE type='shop_order' AND status='wc-on-hold'");
  // Neišsiųsti: apmokėti >48 val., be siuntos fakto
  $o['neissiusti_48h']=$wpdb->get_results("SELECT o.id, DATE_FORMAT(o.date_paid_gmt,'%m-%d %H:%i') paid FROM {$p}wc_orders o WHERE o.type='shop_order' AND o.status='wc-processing' AND o.date_paid_gmt<NOW()-INTERVAL 48 HOUR AND NOT EXISTS (SELECT 1 FROM {$p}ps_fakt_siuntos s WHERE s.order_id=o.id) ORDER BY o.id LIMIT 20",ARRAY_A);
  // Kasa: paskyros priskyrimas + place-order-debug "already registered"
  $o['paskyra_priskirta']=$wpdb->get_results("SELECT m.order_id, o.status FROM {$p}wc_orders_meta m JOIN {$p}wc_orders o ON o.id=m.order_id WHERE m.meta_key='_ps_paskyra_priskirta' ORDER BY m.order_id DESC LIMIT 10",ARRAY_A);
  $reg=array(); $u=wp_upload_dir(); foreach ((array)glob($u['basedir'].'/wc-logs/place-order-debug-*.log') as $f){ if (filemtime($f)<time()-3*86400) continue; $c=@file_get_contents($f); $n=substr_count($c,'already registered'); $reg[basename($f)]=array('dydis'=>filesize($f),'already_registered'=>$n,'pask'=>date('m-d H:i',filemtime($f))); }
  $o['place_order_logs']=$reg;
  $o['fatal_logs']=array(); foreach ((array)glob($u['basedir'].'/wc-logs/fatal-errors-*.log') as $f){ if (filemtime($f)<time()-3*86400) continue; $c=@file_get_contents($f); $o['fatal_logs'][basename($f)]=array('dydis'=>filesize($f),'pask'=>date('m-d H:i',filemtime($f)),'pask_eil'=>mb_substr(trim(substr($c,-600)),-500)); }
  // PHP error log už webroot
  $pl=dirname(ABSPATH).'/logs/php_error.log'; if (!file_exists($pl)) $pl=ABSPATH.'../logs/php_error.log';
  if (file_exists($pl)){ $sz=filesize($pl); $fh=fopen($pl,'r'); fseek($fh,max(0,$sz-6000)); $t=fread($fh,6000); fclose($fh); $lines=array_filter(explode("\n",$t)); $lines=array_slice($lines,-40); $today=date('d-M-Y'); $vak=date('d-M-Y',time()-86400); $tn=0;$vn=0; foreach ($lines as $l){ if (strpos($l,$today)!==false) $tn++; if (strpos($l,$vak)!==false) $vn++; } $o['php_log']=array('dydis'=>$sz,'pask'=>date('m-d H:i',filemtime($pl)),'siandien_pask40'=>$tn,'vakar_pask40'=>$vn,'pask5'=>array_map(function($l){return mb_substr($l,0,220);},array_slice($lines,-5))); } else $o['php_log']='nerasta '.$pl;
  // Sargai
  $o['sargas_klaidos_3d']=$wpdb->get_results("SELECT * FROM {$p}ps_sargas_klaidos WHERE laikas>=NOW()-INTERVAL 3 DAY ORDER BY laikas DESC LIMIT 15",ARRAY_A);
  $o['rytas_sargas']=get_option('ps_rytas_sargas_pask');
  $o['sargas_cron_zinios']=get_option('ps_sargas_cron_zinios');
  $o['sargas_cron_laukiam']=get_option('ps_sargas_cron_laukiam');
  $o['sugrazinimas_pask']=get_option('ps_sugrazinimas_pask');
  $o['gavimo_perrus_pask']=get_option('ps_gavimo_perrus_pask');
  $o['fakt_siuntu_gyv_pask']=get_option('ps_fakt_siuntu_gyvavimas_pask');
  // Cron: pavėlavę įvykiai
  $cr=_get_cron_array(); $vel=array(); $now=time(); $ps=array(); if (is_array($cr)) foreach ($cr as $ts=>$hooks){ foreach ($hooks as $h=>$ev){ if (strpos($h,'ps_')===0 || strpos($h,'petshop')!==false){ $ps[$h]=date('m-d H:i',$ts+3*3600); } if ($ts<$now-3600) $vel[]=array('h'=>$h,'velavimas_min'=>round(($now-$ts)/60)); } }
  $o['cron_velave']=array_slice($vel,0,20); $o['cron_ps_kitas']=$ps; $o['disable_wp_cron']=defined('DISABLE_WP_CRON')?DISABLE_WP_CRON:null;
  // Laiškai
  $o['email_jobs_3d']=$wpdb->get_results("SELECT flow, status, COALESCE(skip_reason,'') sr, COUNT(*) n FROM {$p}ps_email_jobs WHERE created_at>=NOW()-INTERVAL 3 DAY GROUP BY flow,status,sr ORDER BY n DESC LIMIT 25",ARRAY_A);
  $o['email_jobs_laukia']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_email_jobs WHERE status IN ('pending','queued','scheduled') AND scheduled_at<NOW()-INTERVAL 2 HOUR");
  $o['smtp_debug_3d']=$wpdb->get_results("SELECT DATE(created_at) d, event_type, COUNT(*) n, LEFT(MAX(content),160) pvz FROM {$p}wpmailsmtp_debug_events WHERE created_at>=NOW()-INTERVAL 3 DAY GROUP BY d,event_type",ARRAY_A);
  $o['smtp_email_log_3d']=$wpdb->get_results("SELECT DATE(date_sent) d, status, COUNT(*) n FROM {$p}wpmailsmtp_emails_log WHERE date_sent>=NOW()-INTERVAL 3 DAY GROUP BY d,status",ARRAY_A);
  // Refill
  $o['refill_artimiausi']=$wpdb->get_results("SELECT status, COUNT(*) n, MIN(predicted_empty_date) min_d FROM {$p}ps_refill_tracking WHERE predicted_empty_date>=CURDATE() GROUP BY status",ARRAY_A);
  // VF feed / partijos / sources
  $vf=$u['basedir'].'/petshop-vf-cache.xml'; $o['vf_feed']=file_exists($vf)?array('dydis'=>filesize($vf),'amzius_val'=>round((time()-filemtime($vf))/3600,1)):'nerasta';
  $o['vf_observer_pask']=$wpdb->get_var("SELECT MAX(updated_at) FROM {$p}vf_observer");
  $o['ps_sources_pask']=$wpdb->get_var("SELECT MAX(updated_at) FROM {$p}ps_sources");
  $o['ps_tiekimas_atviri']=$wpdb->get_results("SELECT busena, COUNT(*) n FROM {$p}ps_tiekimas GROUP BY busena",ARRAY_A);
  // 404 / web įvykiai
  $o['seo_404_3d']=$wpdb->get_results("SELECT DATE(laikas) d, COUNT(*) n FROM {$p}ps_seo_404 WHERE laikas>=NOW()-INTERVAL 3 DAY GROUP BY d",ARRAY_A);
  $o['web_ivykiai_3d']=$wpdb->get_results("SELECT DATE(laikas) d, COUNT(*) n, COUNT(DISTINCT sesija) ses FROM {$p}ps_web_ivykiai WHERE laikas>=NOW()-INTERVAL 3 DAY GROUP BY d",ARRAY_A);
  // Prekės: publikuotos, outofstock dalis
  $o['prekes']=$wpdb->get_row("SELECT COUNT(*) publ, SUM(pm.meta_value='outofstock') nera FROM {$p}posts ps LEFT JOIN {$p}postmeta pm ON pm.post_id=ps.ID AND pm.meta_key='_stock_status' WHERE ps.post_type='product' AND ps.post_status='publish'",ARRAY_A);
  $o['wp_versija']=get_bloginfo('version'); $o['wc_versija']=defined('WC_VERSION')?WC_VERSION:null;
  $o['db_err']=$wpdb->last_error;
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
