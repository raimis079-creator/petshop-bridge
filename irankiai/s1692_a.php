<?php
/** TEMP PS S1692 a — rytinė patikra: Ads ataskaitos (ps_fakt_reklama, offline endpoint, gclid), visi sargai/cron, vakarykščių S1691 pataisų pasekmės (log, dim, ZB excluded_brand, dropship matomumas). Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1692a'])) return; global $wpdb; $p=$wpdb->prefix; $o=array(); $wpdb->suppress_errors(true);
  $o['laikas']=current_time('mysql');
  // ADS
  $o['ads_dienos']=$wpdb->get_results("SELECT diena, SUM(paspaudimai) pasp, ROUND(SUM(islaidos_ct)/100,2) eur, SUM(konversijos) konv, ROUND(SUM(konv_verte_ct)/100) kv FROM {$p}ps_fakt_reklama WHERE diena>=CURDATE()-INTERVAL 5 DAY GROUP BY diena ORDER BY diena",ARRAY_A);
  $o['ads_pask_irasas']=$wpdb->get_row("SELECT MAX(diena) diena, MAX(sukurta_at) sukurta FROM {$p}ps_fakt_reklama",ARRAY_A);
  $o['ads_reklama_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_reklama");
  $o['gclid_uzs']=$wpdb->get_results("SELECT DATE(CONVERT_TZ(o.date_created_gmt,'+00:00','+03:00')) d, COUNT(*) n, ROUND(SUM(o.total_amount)) eur FROM {$p}wc_orders o JOIN {$p}wc_orders_meta m ON m.order_id=o.id AND m.meta_key='_ps_gclid' WHERE o.type='shop_order' AND o.status IN ('wc-processing','wc-completed','wc-on-hold') AND o.date_created_gmt>=NOW()-INTERVAL 5 DAY GROUP BY d ORDER BY d",ARRAY_A);
  $k=get_option('ps_ads_offline_raktas'); if ($k){ $r=wp_remote_get(home_url('/?ps_ads_offline='.$k.'&dienos=3'),array('timeout'=>25,'sslverify'=>false)); $b=is_wp_error($r)?'':wp_remote_retrieve_body($r); $j=json_decode($b,true); $o['offline_endpoint']=array('http'=>is_wp_error($r)?0:wp_remote_retrieve_response_code($r),'eiluciu'=>is_array($j)?count($j):null,'pvz'=>is_array($j)?array_slice($j,0,2):mb_substr($b,0,200)); }
  foreach (array('ps_ads_offline_pask','ps_fakt_reklama_pask','ps_ads_pask_traukimas') as $op) $o['opc_'.$op]=get_option($op);
  $o['cron_ads']=array(); foreach (_get_cron_array() as $ts=>$hooks) foreach ($hooks as $h=>$ev) if (stripos($h,'reklam')!==false||stripos($h,'ads')!==false) $o['cron_ads'][$h]=date('m-d H:i',$ts+3*3600);
  // UŽSAKYMAI
  $o['uzs_dienos']=$wpdb->get_results("SELECT DATE(CONVERT_TZ(date_created_gmt,'+00:00','+03:00')) d, COUNT(*) viso, SUM(status IN ('wc-processing','wc-completed','wc-on-hold')) ok, SUM(status='wc-cancelled') atsaukta, ROUND(SUM(CASE WHEN status IN ('wc-processing','wc-completed','wc-on-hold') THEN total_amount END)) eur FROM {$p}wc_orders WHERE type='shop_order' AND date_created_gmt>=NOW()-INTERVAL 3 DAY GROUP BY d ORDER BY d",ARRAY_A);
  $o['processing']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_orders WHERE type='shop_order' AND status='wc-processing'");
  $o['neissiusti_48h']=$wpdb->get_col("SELECT o.id FROM {$p}wc_orders o WHERE o.type='shop_order' AND o.status='wc-processing' AND o.date_paid_gmt<NOW()-INTERVAL 48 HOUR AND NOT EXISTS (SELECT 1 FROM {$p}ps_fakt_siuntos s WHERE s.order_id=o.id)");
  $o['paskyra_priskirta_nauji']=$wpdb->get_col("SELECT order_id FROM {$p}wc_orders_meta WHERE meta_key='_ps_paskyra_priskirta' AND order_id>36021");
  // SARGAI
  $o['rytas_sargas']=get_option('ps_rytas_sargas_pask');
  $o['sargas_klaidos_24h']=$wpdb->get_results("SELECT lygis, LEFT(zinute,80) z, COUNT(*) n FROM {$p}ps_sargas_klaidos WHERE laikas>=NOW()-INTERVAL 24 HOUR AND lygis NOT IN ('deprecated') GROUP BY lygis,z ORDER BY n DESC LIMIT 12",ARRAY_A);
  $o['sargas_cron_laukiam_n']=count((array)get_option('ps_sargas_cron_laukiam'));
  $zin=(array)get_option('ps_sargas_cron_zinios'); $vel=array(); foreach ($zin as $h=>$ts){ if (is_numeric($ts) && time()-$ts>26*3600) $vel[$h]=round((time()-$ts)/3600,1).' val.'; } $o['sargas_neatsiskaite_26h']=$vel;
  $cr=_get_cron_array(); $late=array(); foreach ($cr as $ts=>$hooks) foreach ($hooks as $h=>$ev) if ($ts<time()-3600) $late[]=$h.' ('.round((time()-$ts)/60).' min)'; $o['cron_velave']=$late;
  foreach (array('ps_sugrazinimas_pask','ps_gavimo_perrus_pask','ps_fakt_siuntu_gyvavimas_pask','ps_dropship_matomumas_pask','ps_dim_klientu_paskutinis','ps_bacs_priminimas_pask','ps_dropship_sargas_pask') as $op) $o['opc_'.$op]=get_option($op);
  $o['email_jobs_24h']=$wpdb->get_results("SELECT flow, status, COALESCE(skip_reason,'') sr, COUNT(*) n FROM {$p}ps_email_jobs WHERE created_at>=NOW()-INTERVAL 24 HOUR GROUP BY flow,status,sr ORDER BY n DESC LIMIT 15",ARRAY_A);
  $o['email_failed_24h']=$wpdb->get_results("SELECT id, flow, LEFT(COALESCE(last_error,error_message,''),120) err FROM {$p}ps_email_jobs WHERE status IN ('failed','dead','error') AND updated_at>=NOW()-INTERVAL 24 HOUR LIMIT 10",ARRAY_A);
  // S1691 PASEKMĖS
  $pl=dirname(ABSPATH).'/logs/php_error.log'; $o['php_log']=array('dydis'=>file_exists($pl)?filesize($pl):null,'pask'=>file_exists($pl)?date('m-d H:i',filemtime($pl)):null);
  if (file_exists($pl) && filesize($pl)>0){ $lines=array_filter(explode("\n",file_get_contents($pl))); $tip=array(); foreach ($lines as $ln){ $k=preg_replace('/^\[[^\]]+\]\s*/','',$ln); $k=preg_replace('/\d+/','#',$k); $k=mb_substr($k,0,100); $tip[$k]=($tip[$k]??0)+1; } arsort($tip); $o['php_log']['eiluciu']=count($lines); $o['php_log']['tipai']=array_slice($tip,0,10,true); }
  $o['dim']=$wpdb->get_row("SELECT COUNT(*) n, MAX(perskaiciuota_at) max_p, SUM(aplinka='prod') prod FROM {$p}ps_dim_klientai",ARRAY_A);
  $o['hidden_dropship']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}postmeta WHERE meta_key='_ps_dropship_paslepta' AND meta_value='1'");
  $o['hidden_be_zymes']=$wpdb->get_var("SELECT COUNT(DISTINCT tr.object_id) FROM {$p}term_relationships tr JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id JOIN {$p}terms t ON t.term_id=tt.term_id WHERE tt.taxonomy='product_visibility' AND t.slug='exclude-from-catalog' AND tr.object_id NOT IN (SELECT post_id FROM {$p}postmeta WHERE meta_key='_ps_dropship_paslepta')");
  $o['outofstock_dropship_matomi']=$wpdb->get_var("SELECT COUNT(DISTINCT ps.ID) FROM {$p}posts ps JOIN {$p}postmeta s ON s.post_id=ps.ID AND s.meta_key='_ps_sandelis' AND s.meta_value IN ('vf','zb') JOIN {$p}postmeta st ON st.post_id=ps.ID AND st.meta_key='_stock_status' AND st.meta_value='outofstock' WHERE ps.post_type='product' AND ps.post_status='publish' AND ps.ID NOT IN (SELECT post_id FROM {$p}postmeta WHERE meta_key='_ps_dropship_paslepta')");
  // ZB importo žurnalas (structured log) — excluded_brand blokai
  $u=wp_upload_dir(); $zb=array(); foreach ((array)glob($u['basedir'].'/*xml*log*') as $f) $zb['kandidatai'][]=basename($f).' '.filesize($f);
  foreach ((array)glob($u['basedir'].'/wc-logs/*petshop*xml*') as $f) $zb['wc_logs'][]=basename($f).' '.filesize($f).' '.date('m-d H:i',filemtime($f));
  foreach ((array)glob($u['basedir'].'/wc-logs/*') as $f){ if (filemtime($f)<time()-30*3600) continue; $c=@file_get_contents($f); if ($c && strpos($c,'ZB-BLOCK-CREATE')!==false){ $zb['failas']=basename($f); $zb['ZB-BLOCK-CREATE']=substr_count($c,'ZB-BLOCK-CREATE'); $zb['excluded_brand']=substr_count($c,'excluded_brand'); $zb['qty_zero']=substr_count($c,'qty_zero_new'); $zb['Array']=substr_count($c,'"Array"'); preg_match_all('/excluded_brand[^\n]{0,160}/',$c,$m); $zb['pvz']=array_slice(array_unique($m[0]),0,4); } }
  $o['zb_log']=$zb; $o['zb_opcijos']=array('petshop_xml_last_run'=>get_option('petshop_xml_last_run'),'zb_last'=>get_option('petshop_xml_zb_last_import'));
  $o['wpai_imports']=$wpdb->get_results("SELECT id, LEFT(friendly_name,30) n, last_activity, DATE_FORMAT(registered_on,'%m-%d') reg, count, imported, created, updated, skipped FROM {$p}pmxi_imports ORDER BY id",ARRAY_A);
  $o['vf_feed_amzius_val']=file_exists($u['basedir'].'/petshop-vf-cache.xml')?round((time()-filemtime($u['basedir'].'/petshop-vf-cache.xml'))/3600,1):null;
  $o['db_err']=$wpdb->last_error;
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
