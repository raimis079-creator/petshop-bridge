<?php
/** Plugin Name: TEMP PS S1724h Cloudflare patikros. Fazes: 1 ar uzklausa ateina per CF (antrastes, real IP), 2 heartbeat/filtru 403/kasa/REST per petshop.lt is serverio, 3 SMTP testinis laiskas terra@gyvunai.lt, 4 cron/WPAI/feed busena */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1724h'])) return; $f=(string)$_GET['ps_s1724h']; $r=['v'=>'S1724h','faze'=>$f]; @set_time_limit(150); global $wpdb; $P=$wpdb->prefix; $tz=new DateTimeZone('Europe/Vilnius');
  try{
    if($f==='1'){
      foreach(['REMOTE_ADDR','PS_CF_EDGE_IP','HTTP_CF_CONNECTING_IP','HTTP_CF_RAY','HTTP_CF_IPCOUNTRY','HTTP_CF_VISITOR','HTTP_X_FORWARDED_FOR','HTTP_X_FORWARDED_PROTO','SERVER_ADDR','HTTPS','HTTP_HOST'] as $k) $r['srv'][$k]=$_SERVER[$k]??null;
      $r['per_cf']=!empty($_SERVER['HTTP_CF_RAY']); $r['cf_ip_plugin']=function_exists('ps_cf_ip_apply');
      $r['dns_a']=@dns_get_record('petshop.lt',DNS_A); $r['dns_ns']=array_map(function($x){return $x['target'];},(array)@dns_get_record('petshop.lt',DNS_NS));
      $r['laikas']=(new DateTime('now',$tz))->format('H:i:s');
    }
    if($f==='2'){
      $get=function($url,$args=[]) { $x=wp_remote_get($url,array_merge(['timeout'=>25,'sslverify'=>true,'redirection'=>0,'user-agent'=>'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ps-s1724h'],$args)); if(is_wp_error($x)) return ['ERR'=>$x->get_error_message()]; $h=wp_remote_retrieve_headers($x); return ['kodas'=>wp_remote_retrieve_response_code($x),'cf_ray'=>$h['cf-ray']??null,'server'=>$h['server']??null,'cf_cache'=>$h['cf-cache-status']??null,'loc'=>$h['location']??null,'len'=>strlen(wp_remote_retrieve_body($x))]; };
      $r['pradzia']=$get(home_url('/?ps_hb='.time()));
      $r['pradzia_kesuojama']=$get(home_url('/'));
      $r['kategorija']=$get(home_url('/kategorija/sunims/maistas-sunims/'));
      $r['filtras_be_slapuko']=$get(home_url('/kategorija/sunims/maistas-sunims/?filter_amzius=suaugusiems&ps_x=0'));
      $r['filtras_be_slapuko_be_ps']=$get(home_url('/kategorija/sunims/maistas-sunims/?filter_amzius=suaugusiems'));
      $r['filtras_su_slapuku']=$get(home_url('/kategorija/sunims/maistas-sunims/?filter_amzius=suaugusiems'),['cookies'=>[new WP_Http_Cookie(['name'=>'ps_js','value'=>'1'])]]);
      $r['kasa']=$get(home_url('/kasa/'));
      $r['rest_be_auth']=$get(rest_url('wp/v2/types'));
      $r['wc_api']=$get(home_url('/wc-api/'));
      $r['statika']=$get(includes_url('js/jquery/jquery.min.js'));
      $r['statika2']=$get(includes_url('js/jquery/jquery.min.js'));
      $r['sitemap']=$get(home_url('/sitemap_index.xml'));
      $r['robots']=$get(home_url('/robots.txt'));
      $r['laikas']=(new DateTime('now',$tz))->format('H:i:s');
    }
    if($f==='3'){
      $ok=wp_mail('terra@gyvunai.lt','[TESTAS S1724] Cloudflare — SMTP patikra '.date('H:i'),"Testinis laiškas po Cloudflare NS keitimo. Jei gavai — WP Mail SMTP per isopas.serveriai.lt veikia.\nLaikas: ".current_time('mysql'));
      $r['wp_mail']=$ok; $dbg=get_option('wp_mail_smtp_debug'); $r['smtp_debug_pask']=is_array($dbg)?array_slice($dbg,-2):null;
    }
    if($f==='4'){
      $r['wpai_hist']=$wpdb->get_results("SELECT import_id i,time_run,LEFT(summary,60) s,date FROM {$P}pmxi_history WHERE date>=UTC_TIMESTAMP()-INTERVAL 3 HOUR ORDER BY id DESC LIMIT 8",ARRAY_A);
      $r['cron_velu']=0; $now=time(); foreach(_get_cron_array() as $ts=>$hooks){ foreach($hooks as $h=>$x){ if($ts<$now-900) $r['cron_velu']++; } }
      $r['ps_web_ivykiai_10min']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$P}ps_web_ivykiai WHERE sukurta_at>=NOW()-INTERVAL 10 MINUTE");
      $r['uzsakymai_1h']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$P}wc_orders WHERE type='shop_order' AND date_created_gmt>=UTC_TIMESTAMP()-INTERVAL 1 HOUR");
      $r['php_log_tail']=[]; $lf=ini_get('error_log'); if($lf&&is_file($lf)){ $sz=filesize($lf); $h=fopen($lf,'r'); fseek($h,max(0,$sz-6000)); $tx=stream_get_contents($h); fclose($h); $r['php_log_tail']=array_slice(array_filter(explode("\n",$tx)),-6); }
      $r['sargo_klaidos_30min']=$wpdb->get_results("SELECT laikas, LEFT(zinute,120) z FROM {$P}ps_sargas_klaidos WHERE laikas>=NOW()-INTERVAL 30 MINUTE AND lygis<>'warning' ORDER BY id DESC LIMIT 8",ARRAY_A);
      $r['laikas']=(new DateTime('now',$tz))->format('H:i:s');
    }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
