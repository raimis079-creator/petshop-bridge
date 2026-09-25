<?php
/** Plugin Name: TEMP PS S1719d — botų krepšeliai / robots / fatal URL, read-only (i) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1719d'])) return; $r=['v'=>'S1719d','t'=>date('Y-m-d H:i:s')];
  global $wpdb; $p=$wpdb->prefix; @set_time_limit(120);
  $q=function($sql) use($wpdb){ $wpdb->last_error=''; $x=$wpdb->get_results($sql,ARRAY_A); if($wpdb->last_error) return ['SQL_ERR'=>substr($wpdb->last_error,0,160)]; return $x; };
  try{
    $rs=wp_remote_get('https://petshop.lt/robots.txt',['timeout'=>10,'sslverify'=>false]); $r['robots']=is_wp_error($rs)?'ERR':substr(wp_remote_retrieve_body($rs),0,1200);
    $rs=wp_remote_get('https://petshop.lt/kategorija/katems/?yith_wcan=1&product_cat=tualetai-kraikai-semtuveliai,kraikai-kaciu-tualetams&query_type_product_cat=or&query_type_tipas=or&filter_tipas=atviras',['timeout'=>25,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-audit','limit_response_size'=>500]); $r['fatal_url']=is_wp_error($rs)?$rs->get_error_message():wp_remote_retrieve_response_code($rs);
    $rs=wp_remote_get('https://petshop.lt/kategorija/katems/?filter_tipas=atviras&query_type_tipas=or',['timeout'=>25,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-audit','limit_response_size'=>500]); $r['filter_url_paprastas']=is_wp_error($rs)?$rs->get_error_message():wp_remote_retrieve_response_code($rs);
    $r['sessions_24h']=$q("SELECT SUM(session_key NOT REGEXP '^[0-9]+$') svečiai,SUM(session_key NOT REGEXP '^[0-9]+$' AND session_value LIKE '%\"cart\";s:%' AND session_value NOT LIKE '%\"cart\";s:6:\"a:0:{}\"%') svečiai_su_krepšeliu,SUM(session_value LIKE '%\"customer\";s:%' AND session_value LIKE '%\"email\";s:0:%') be_email FROM {$p}woocommerce_sessions WHERE session_expiry>UNIX_TIMESTAMP()+172800-86400");
    $wi=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_web_ivykiai"); $r['web_cols']=$wi; $tc=null; foreach($wi as $c) if(preg_match('/^(tipas|ivykis|event|rusis)$/',$c)) $tc=$c;
    if($tc){ $r['web_tipai_3d']=$q("SELECT `$tc` t,COUNT(*) n FROM {$p}ps_web_ivykiai WHERE laikas>=NOW()-INTERVAL 3 DAY GROUP BY `$tc` ORDER BY n DESC LIMIT 12"); }
    $cc=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_carts"); $r['carts_cols']=$cc;
    $r['carts_pvz']=$q("SELECT * FROM {$p}ps_carts ORDER BY id DESC LIMIT 3");
    $uc=null; foreach($cc as $c) if(preg_match('/user_agent|ua$/i',$c)) $uc=$c; if($uc) $r['carts_ua']=$q("SELECT LEFT(`$uc`,70) ua,COUNT(*) n FROM {$p}ps_carts WHERE created_at>=NOW()-INTERVAL 2 DAY GROUP BY ua ORDER BY n DESC LIMIT 10");
    $ec=null; foreach($cc as $c) if(preg_match('/email|pastas/i',$c)) $ec=$c; if($ec) $r['carts_email']=$q("SELECT SUM(`$ec`<>'' AND `$ec` IS NOT NULL) su_email,COUNT(*) n FROM {$p}ps_carts WHERE created_at>=NOW()-INTERVAL 2 DAY");
    $ic=null; foreach($cc as $c) if(preg_match('/^ip|ip_/i',$c)) $ic=$c; if($ic) $r['carts_ip']=$q("SELECT `$ic` ip,COUNT(*) n FROM {$p}ps_carts WHERE created_at>=NOW()-INTERVAL 2 DAY GROUP BY ip ORDER BY n DESC LIMIT 8");
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},1);
