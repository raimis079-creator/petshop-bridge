<?php
/** TEMP PS S1611 run e16r — pašto reputacijos recon (klausimas 8): siuntimo kelias (SMTP), Sender API (domenai/statistika/bounces), DNSBL, SPF/DKIM/DMARC */
add_action('init', function(){
  if (!isset($_GET['ps_e16r'])) return;
  $o=array('v'=>'run e16r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  try{
   // 1. Kuo siunčia wp_mail
   $o['smtp_pluginai']=array_values(array_filter((array)get_option('active_plugins'),function($x){return stripos($x,'smtp')!==false||stripos($x,'mail')!==false;}));
   foreach(array('wp_mail_smtp','fluent_smtp_settings','easy_wp_smtp','swpsmtp_options','postman_options') as $k){ $v=get_option($k); if($v){ if(is_array($v)){ array_walk_recursive($v,function(&$x,$kk){ if(preg_match('/pass|secret|key|token/i',(string)$kk)) $x='***'; }); } $o['smtp_opt'][$k]=$v; } }
   global $wp_filter; foreach(array('phpmailer_init','pre_wp_mail','wp_mail_from','wp_mail_from_name') as $h){ $o['hooks'][$h]=array(); if(!empty($wp_filter[$h])){ foreach($wp_filter[$h]->callbacks as $pr=>$cbs){ foreach($cbs as $cb){ $fn=$cb['function']; $o['hooks'][$h][]=$pr.': '.(is_array($fn)?(is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]:(is_string($fn)?$fn:'closure')); } } } }
   $o['wc_from']=array(get_option('woocommerce_email_from_name'),get_option('woocommerce_email_from_address'));
   $o['dev_pastas_zurnalas']=count((array)get_option('ps_dev_pastas_zurnalas',array()));
   // 2. Sender API
   $mt=class_exists('Petshop_Sender_Adapter')?Petshop_Sender_Adapter::get_stored_token('marketing'):''; $tt=class_exists('Petshop_Sender_Adapter')?Petshop_Sender_Adapter::get_stored_token('transactional'):'';
   $o['sender_tokenai']=array('marketing'=>strlen((string)$mt),'transactional'=>strlen((string)$tt));
   $S=function($path,$tok) { $r=wp_remote_get('https://api.sender.net/v2'.$path,array('timeout'=>30,'headers'=>array('Authorization'=>'Bearer '.$tok,'Accept'=>'application/json'))); if(is_wp_error($r)) return array('err'=>$r->get_error_message()); $c=wp_remote_retrieve_response_code($r); $b=json_decode(wp_remote_retrieve_body($r),true); return array('code'=>$c,'body'=>is_array($b)?mb_substr(json_encode($b,JSON_UNESCAPED_UNICODE),0,1200):mb_substr(wp_remote_retrieve_body($r),0,300)); };
   if($mt){ foreach(array('/domains','/senders','/account','/me','/campaigns?limit=3','/groups?limit=3','/subscribers?limit=1','/subscribers?limit=3&status=bounced','/subscribers?limit=3&status=unsubscribed','/subscribers?limit=3&status=spam','/statistics','/transactional/messages?limit=5','/message?limit=5') as $path){ $o['sender'][$path]=$S($path,$mt); } }
   if($tt){ $o['sender_tr']['/transactional/messages?limit=5']=$S('/transactional/messages?limit=5',$tt); $o['sender_tr']['/domains']=$S('/domains',$tt); }
   // 3. DNS: SPF / DMARC / DKIM / MX
   foreach(array('petshop.lt','_dmarc.petshop.lt','sender._domainkey.petshop.lt','default._domainkey.petshop.lt','s1._domainkey.petshop.lt','mail.petshop.lt','dev.avesa.lt') as $d){ $r=@dns_get_record($d,DNS_TXT); $o['dns_txt'][$d]=$r?array_map(function($x){return mb_substr($x['txt'],0,300);},$r):null; }
   $o['dns_mx']=array_map(function($x){return $x['target'].' ('.$x['pri'].')';},(array)@dns_get_record('petshop.lt',DNS_MX));
   // 4. Išeinantis IP + DNSBL
   $ip=wp_remote_retrieve_body(wp_remote_get('https://api.ipify.org',array('timeout'=>15))); $o['iseinantis_ip']=$ip;
   $ips=array_unique(array_filter(array($ip,'79.98.29.24','185.3.229.130',gethostbyname('petshop.lt'))));
   foreach($ips as $x){ if(!filter_var($x,FILTER_VALIDATE_IP,FILTER_FLAG_IPV4)) continue; $rev=implode('.',array_reverse(explode('.',$x))); foreach(array('zen.spamhaus.org','bl.spamcop.net','b.barracudacentral.org','dnsbl.sorbs.net','hostkarma.junkemailfilter.com','spam.dnsbl.sorbs.net') as $bl){ $h=$rev.'.'.$bl; $a=gethostbyname($h); $o['dnsbl'][$x][$bl]=($a===$h)?'švarus':$a; } }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
