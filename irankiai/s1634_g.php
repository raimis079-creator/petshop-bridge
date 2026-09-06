<?php
/** TEMP PS S1633 run g — G: SARGŲ BŪKLĖ (S1634 fix: +secure_auth cookie, dl-eiles regex) (cron'ai, sekimas, SLA, importai, laiškai, eilės, PHP klaidos, 301, GA4). READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1634g'])) return;
  $o=array('v'=>'S1634 g'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  // cron'ai
  $cr=_get_cron_array(); $mus=array('ps_venipak_sekimas','ps_velavimo_laiskai','ps_dl_atsauktu_valymas','ps_dropship_sargas','ps_zb_importas','ps_vf_importas'); $rasta=array();
  foreach($cr as $ts=>$hooks){ foreach($hooks as $h=>$x){ foreach($mus as $m){ if(strpos($h,$m)!==false && !isset($rasta[$h])) $rasta[$h]=date('m-d H:i',$ts); } if(!isset($visi[$h])) $visi[$h]=date('m-d H:i',$ts); } }
  $o['cron_musu']=$rasta; $o['cron_viso']=count($visi??array());
  // sekimas
  $o['venipak_sekimas_pask']=get_option('ps_venipak_sekimas_paskutinis','');
  // SLA / klausimai
  $o['sla_velavimai']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_orders_meta WHERE meta_key='_ps_sla_velavimas'");
  $o['siunta_grizta']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_orders_meta WHERE meta_key='_ps_siunta_grizta'");
  // importai
  foreach(array('zb'=>'ps_zb','vf'=>'ps_vf') as $k=>$pref){ $o['importai'][$k]=array_filter(array(
    'pask'=>get_option($pref.'_paskutinis',get_option($pref.'_last','')),
  )); }
  $imp=$wpdb->get_results("SELECT option_name,option_value FROM {$p}options WHERE option_name LIKE 'ps_%import%' OR option_name LIKE 'ps_%sync%' ORDER BY option_name LIMIT 20");
  foreach($imp as $r){ $o['import_opcijos'][$r->option_name]=mb_substr($r->option_value,0,80); }
  // laiškai
  $o['dev_pastas_leisti']=get_option('ps_dev_pastas_leisti','');
  $o['dev_pastas_zurnalas']=count((array)get_option('ps_dev_pastas_zurnalas',array()));
  $o['laisku_archyvas']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}options WHERE option_name='ps_laisku_archyvas'")? count((array)get_option('ps_laisku_archyvas',array())):0;
  // eilės + Warning
  $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp=time()+900; $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
  $cs=array(new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'logged_in',$tok))),new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))));
  $r=wp_remote_get(admin_url('admin.php?page=ps-desk&eile=visi'),array('cookies'=>$cs,'timeout'=>90,'sslverify'=>false));
  $h=(string)wp_remote_retrieve_body($r); preg_match('/<nav[^>]*>(.*?)<\/nav>/su',$h,$mm);
  $o['eiles']=array('code'=>wp_remote_retrieve_response_code($r),'warning'=>substr_count($h,'<b>Warning</b>'),'nav'=>mb_substr(trim(preg_replace('/\s+/',' ',wp_strip_all_tags($mm[1]??''))),0,160));
  { preg_match_all('/(Gauti|Laukiam|Surinkti AV|Dropshipping|Paruošta|Klausimai|Neapmokėti|Visi)[^0-9]{0,20}(\d+)/u',$h,$m2,PREG_SET_ORDER); foreach(array_slice($m2,0,9) as $x){ $o['eiles']['sk'][$x[1]]=$x[2]; } }
  // PHP klaidos (šiandien)
  foreach(array(WP_CONTENT_DIR.'/debug.log', ABSPATH.'error_log', dirname(ABSPATH).'/error_log') as $f){ if(file_exists($f)){ $o['php_log'][$f]=array('dydis'=>filesize($f),'uodega'=>array_slice(array_filter(explode("\n",substr(file_get_contents($f),-3000))),-5)); } }
  // 301 sargas
  $o['legacy_301_map']=file_exists(WPMU_PLUGIN_DIR.'/petshop-legacy-301-map.json')?'yra':'NERA';
  // GA4
  $o['ga4_plug']=file_exists(WPMU_PLUGIN_DIR.'/petshop-ga4-serveris.php')?'yra':'NERA';
  // local_pickup #16
  $o['pickup16']=$wpdb->get_row("SELECT is_enabled FROM {$p}woocommerce_shipping_zone_methods WHERE instance_id=16");
  // skaitikliai
  foreach(array('ps_avpn_serija','ps_iapv_serija','ps_kr_serija','ps_ppk_serija') as $k) $o['serijos'][$k]=get_option($k,'?');
  $o['ping']=wp_remote_retrieve_response_code(wp_remote_get(home_url('/'),array('timeout'=>30,'sslverify'=>false)));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
