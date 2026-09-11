<?php
/** Plugin Name: TEMP PS S1673 C1 konversiju signalas */
add_action('init', function(){
  if(!isset($_GET['ps_c1'])||$_GET['ps_c1']!=='GO') return;
  header('Content-Type: application/json; charset=utf-8'); global $wpdb; $o=array('v'=>'S1673C1');
  try{
    $t=$wpdb->prefix.'ps_fakt_uzsakymai';
    $o['cols']=$wpdb->get_col("SHOW COLUMNS FROM $t");
    $o['pvz']=$wpdb->get_row("SELECT * FROM $t ORDER BY 1 DESC LIMIT 1",ARRAY_A);
    $o['viso']=$wpdb->get_var("SELECT COUNT(*) FROM $t");
    // WC uzsakymai per diena, 14 d.
    $o['wc_orders']=$wpdb->get_results("SELECT DATE(date_created_gmt) d,status,COUNT(*) n,ROUND(SUM(total_amount),2) suma FROM {$wpdb->prefix}wc_orders WHERE date_created_gmt>=DATE_SUB(NOW(),INTERVAL 14 DAY) AND type='shop_order' GROUP BY 1,2 ORDER BY 1",ARRAY_A);
    // ga4 serveris
    $o['ga4_tables']=$wpdb->get_col("SHOW TABLES LIKE '{$wpdb->prefix}ps_ga4%'");
    $o['ga4_opts']=$wpdb->get_results("SELECT option_name,LEFT(option_value,300) v FROM {$wpdb->options} WHERE option_name LIKE 'ps_ga4%' OR option_name LIKE 'ps_gtm%' OR option_name LIKE 'ps_ads%' OR option_name LIKE 'ps_consent%'",ARRAY_A);
    $f=WPMU_PLUGIN_DIR.'/petshop-ga4-serveris.php'; $c=file_get_contents($f); $o['ga4_src_len']=strlen($c);
    preg_match_all('/(function\s+\w+|add_action\([^,]+|add_filter\([^,]+|measurement_id|api_secret|purchase|conversion|awct|consent|gclid|user_data|sha256)/i',$c,$m); $o['ga4_grep']=array_count_values($m[0]);
    preg_match('/Version:\s*([\d\.]+)/',$c,$v); $o['ga4_ver']=$v[1]??null;
    // GTM snippet themeje?
    $o['gtm_in_head']=false; foreach(array(get_stylesheet_directory().'/functions.php',get_stylesheet_directory().'/header.php') as $ff){ if(file_exists($ff)&&strpos(file_get_contents($ff),'GTM-')!==false) $o['gtm_in_head']=$ff; }
    $h=wp_remote_get(home_url('/'),array('timeout'=>15)); $b=wp_remote_retrieve_body($h);
    $o['front']=array('GTM'=>substr_count($b,'GTM-MF3GZGT'),'gtag'=>substr_count($b,'gtag('),'consent_default'=>substr_count($b,"'consent'"),'AW'=>preg_match('/AW-\d+/',$b,$aw)?$aw[0]:null,'G-'=>preg_match('/G-[A-Z0-9]+/',$b,$g)?$g[0]:null,'cookieyes|complianz|cookiebot'=>preg_match('/(cookieyes|complianz|cookiebot|cmplz|cky)/i',$b,$cm)?$cm[1]:null);
    $o['plugins_consent']=array_values(array_filter(get_option('active_plugins'),function($p){return preg_match('/cook|consent|gdpr|cmp/i',$p);}));
    // ads recon opcija — paskutinis
    $r=get_option('ps_ads_recon'); $o['ads_recon']=is_array($r)?array('keys'=>array_keys($r),'v'=>$r['v']??null,'kada'=>$r['kada']??null):substr(json_encode($r),0,200);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
