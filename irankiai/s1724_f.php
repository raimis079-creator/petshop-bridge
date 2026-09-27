<?php
/** Plugin Name: TEMP PS S1724f DNS inventorius (Cloudflare) + valandinio Super Cache valymo kaltininkas read-only. Fazes: 1 DNS, 2 cache */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1724f'])) return;
  $f=$_GET['ps_s1724f']; @set_time_limit(120); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1724f','faze'=>$f]; $tz=new DateTimeZone('Europe/Vilnius');
  try{
  if($f==='1'){
    $dom='petshop.lt';
    foreach(['A'=>DNS_A,'AAAA'=>DNS_AAAA,'MX'=>DNS_MX,'TXT'=>DNS_TXT,'NS'=>DNS_NS,'SOA'=>DNS_SOA,'CAA'=>DNS_CAA] as $k=>$t){ $x=@dns_get_record($dom,$t); $r['dns'][$k]=$x?array_map(function($y){ unset($y['class'],$y['host']); return $y; },$x):[]; }
    $subs=['www','mail','smtp','imap','pop','pop3','webmail','ftp','dev','cpanel','autodiscover','autoconfig','_dmarc','default._domainkey','dkim._domainkey','mail._domainkey','x._domainkey','selector1._domainkey','selector2._domainkey','_acme-challenge','isopas','ns1','ns2','shop','api','cdn','static','img','blog','test','staging','old','m','app','sender._domainkey','sendgrid._domainkey','s1._domainkey','s2._domainkey','google._domainkey','_github-challenge','_mta-sts','mta-sts','_smtp._tls','_sip._tcp','_caldavs._tcp','_autodiscover._tcp','em','link','click','track','url'];
    foreach($subs as $s){ $h=$s.'.'.$dom; $x=@dns_get_record($h,DNS_A+DNS_AAAA+DNS_CNAME+DNS_TXT+DNS_MX+DNS_SRV); if($x){ $r['subs'][$s]=array_map(function($y){ unset($y['class'],$y['host'],$y['ttl']); return $y; },$x); } }
    $r['server_ip']=$_SERVER['SERVER_ADDR']??null; $r['remote_ip_pvz']=$_SERVER['REMOTE_ADDR']??null;
    $r['ssl']=[]; $ctx=stream_context_create(['ssl'=>['capture_peer_cert'=>true,'verify_peer'=>false,'verify_peer_name'=>false]]); $c=@stream_socket_client('ssl://petshop.lt:443',$en,$es,8,STREAM_CLIENT_CONNECT,$ctx); if($c){ $p=stream_context_get_params($c); $cert=openssl_x509_parse($p['options']['ssl']['peer_certificate']); $r['ssl']=['issuer'=>$cert['issuer']['O']??'','CN'=>$cert['subject']['CN']??'','SAN'=>$cert['extensions']['subjectAltName']??'','iki'=>date('Y-m-d',$cert['validTo_time_t'])]; fclose($c); }
    // WP Mail SMTP host, Paysera callback, Venipak/LP callback, cron trigeriai
    $smtp=get_option('wp_mail_smtp'); $r['smtp']=['mailer'=>$smtp['mail']['mailer']??null,'host'=>$smtp['smtp']['host']??null,'port'=>$smtp['smtp']['port']??null,'enc'=>$smtp['smtp']['encryption']??null,'from'=>$smtp['mail']['from_email']??null];
    $r['home']=home_url(); $r['site']=site_url(); $r['wc_api']=home_url('/wc-api/'); $r['rest']=rest_url();
    $r['paysera_callback_hint']=$wpdb->get_var("SELECT option_name FROM {$P}options WHERE option_name LIKE '%paysera%' LIMIT 1");
    $r['aktyvus_pluginai']=array_values(array_filter((array)get_option('active_plugins'),function($p){ return preg_match('/paysera|venipak|lithuaniapost|lp-|smtp|cache|complianz|rank|yith|feeds|wp-all-import|wpai/i',$p); }));
    $r['mc_feed_url']=[]; foreach(glob(wp_upload_dir()['basedir'].'/ps-feeds/*')?:[] as $fx) $r['mc_feed_url'][]=wp_upload_dir()['baseurl'].'/ps-feeds/'.basename($fx);
    $r['feed_opc']=$wpdb->get_results("SELECT option_name, LEFT(option_value,120) v FROM {$P}options WHERE option_name LIKE 'ps_feeds%' AND option_name NOT LIKE '%zurnal%' LIMIT 10",ARRAY_A);
    $r['laikas']=(new DateTime('now',$tz))->format('Y-m-d H:i:s');
  }
  if($f==='2'){
    // petshop-cache: kaip logina viskas_25
    $c=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-cache.php'); $L=explode("\n",$c); foreach($L as $i=>$l){ if(preg_match('/viskas_25|ps_cache_valymai|add_action|>\s*25|SLENKST|slenkst/',$l)) $r['cache_kodas'][]=($i+1).': '.mb_substr(trim($l),0,200); }
    // pilnas paskutinis viskas_25 irasas
    $cv=get_option('ps_cache_valymai'); if(is_array($cv)){ foreach(array_reverse($cv) as $e){ if(($e[1]??'')==='viskas_25'){ $r['viskas_irasas']=$e; break; } } }
    // cron hook'ai, kurie vyksta :00-:03 kas valanda
    $now=time(); $r['cron_val']=[]; foreach(_get_cron_array() as $ts=>$hooks){ $m=(int)date('i',$ts); if($m<=3||$m>=58){ foreach($hooks as $h=>$x){ foreach($x as $k=>$ev){ $r['cron_val'][]=[$h,(new DateTime('@'.$ts))->setTimezone($tz)->format('m-d H:i'),$ev['schedule']??'once',$ev['interval']??null]; } } } }
    // hourly hook'ai visi
    foreach(_get_cron_array() as $ts=>$hooks){ foreach($hooks as $h=>$x){ foreach($x as $ev){ if(($ev['schedule']??'')==='hourly'||(($ev['interval']??0)>=3000&&($ev['interval']??0)<=4000)) $r['hourly'][]=[$h,(new DateTime('@'.$ts))->setTimezone($tz)->format('H:i')]; } } }
    // kurie mu-pluginai registruoja siuos hook'us
    $hooks=array_unique(array_map(function($x){return $x[0];},array_merge($r['cron_val']??[],$r['hourly']??[]))); $r['hook_failai']=[];
    foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $fx){ $s=file_get_contents($fx); foreach($hooks as $h){ if(strpos($s,$h)!==false) $r['hook_failai'][$h][]=basename($fx); } }
    foreach(glob(WP_PLUGIN_DIR.'/petshop-*/*.php') as $fx){ $s=file_get_contents($fx); foreach($hooks as $h){ if(strpos($s,$h)!==false) $r['hook_failai'][$h][]='plugins/'.basename(dirname($fx)); } }
    // prekiu 17947,17950 post_modified ir kokie meta keiciasi (pagal wc_product_meta_lookup / post_modified)
    $r['post_mod']=$wpdb->get_results("SELECT ID, post_modified, post_type FROM {$wpdb->posts} WHERE ID IN (17947,17950,17953,17956) ",ARRAY_A);
    $r['mod_val']=$wpdb->get_results("SELECT DATE_FORMAT(post_modified,'%m-%d %H:%i') m, COUNT(*) n FROM {$wpdb->posts} WHERE post_type='product' AND post_modified>=NOW()-INTERVAL 6 HOUR GROUP BY 1 ORDER BY 1 DESC LIMIT 15",ARRAY_A);
    $r['bendra_17947']=[]; foreach($wpdb->get_results("SELECT meta_key, LEFT(meta_value,60) v FROM {$wpdb->postmeta} WHERE post_id=17947 AND meta_key IN('_ps_sandelis','_zb_enabled','_vf_sku','_ps_source','_stock','_stock_status','_ps_likutis_atn','_price','_ps_tiekejas','_own_stock_qty','_ps_kelias')",ARRAY_A) as $x) $r['bendra_17947'][$x['meta_key']]=$x['v'];
    $r['ids_bendras']=['zb'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->postmeta} WHERE meta_key='_zb_enabled' AND meta_value='yes'"),'sandelis_zb'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->postmeta} WHERE meta_key='_ps_sandelis' AND meta_value='zb'"),'vf'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->postmeta} WHERE meta_key='_vf_sku' AND meta_value<>''")];
    $r['laikas']=(new DateTime('now',$tz))->format('Y-m-d H:i:s');
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
