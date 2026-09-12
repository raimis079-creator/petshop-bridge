<?php
/** TEMP PS S1678 sec — SAUGUMO AUDITAS read-only: versijos, vartotojai, wp-config, failai, snippetai, HTTP antraštės. NIEKO NEKEIČIA. */
add_action('init', function(){
  if (!isset($_GET['ps_sec8'])) return;
  global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1678 sec','laikas'=>current_time('Y-m-d H:i'));
  $wpdb->suppress_errors(true); @set_time_limit(120);
  // 1. versijos + atnaujinimai
  if(!function_exists('get_plugins')) require_once ABSPATH.'wp-admin/includes/plugin.php';
  $o['ver']=array('wp'=>get_bloginfo('version'),'php'=>PHP_VERSION,'db'=>$wpdb->db_version(),'wc'=>defined('WC_VERSION')?WC_VERSION:'?','tema'=>wp_get_theme()->get('Name').' '.wp_get_theme()->get('Version'),'parent'=>wp_get_theme()->parent()?wp_get_theme()->parent()->get('Version'):'-');
  $act=get_option('active_plugins'); $all=get_plugins(); $up=get_site_transient('update_plugins'); $o['plugins']=array();
  foreach($act as $f){ $o['plugins'][$f]=array('v'=>$all[$f]['Version']??'?','nauja'=>isset($up->response[$f])?$up->response[$f]->new_version:'');}
  $uc=get_site_transient('update_core'); $o['core_update']=isset($uc->updates[0])?$uc->updates[0]->version.' '.$uc->updates[0]->response:'?';
  $ut=get_site_transient('update_themes'); $o['theme_update']=isset($ut->response)?array_map(function($x){return $x['new_version'];},$ut->response):array();
  $o['auto_update']=array('core_const'=>defined('WP_AUTO_UPDATE_CORE')?var_export(WP_AUTO_UPDATE_CORE,true):'nedef','updater_disabled'=>defined('AUTOMATIC_UPDATER_DISABLED')?var_export(AUTOMATIC_UPDATER_DISABLED,true):'nedef','auto_plugins'=>count((array)get_site_option('auto_update_plugins',array())));
  // 2. vartotojai
  $o['vart_roles']=count_users()['avail_roles'];
  $adm=get_users(array('role'=>'administrator','fields'=>array('ID','user_login','user_email','user_registered')));
  foreach($adm as $u){ $st=get_user_meta($u->ID,'session_tokens',true); $ap=class_exists('WP_Application_Passwords')?count(WP_Application_Passwords::get_user_application_passwords($u->ID)):-1;
    $o['admin'][]=array('id'=>$u->ID,'login'=>$u->user_login,'el'=>$u->user_email,'reg'=>substr($u->user_registered,0,10),'sesijos'=>is_array($st)?count($st):0,'app_pass'=>$ap,'2fa_meta'=>(bool)($wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$p}usermeta WHERE user_id=%d AND (meta_key LIKE '%%two%%factor%%' OR meta_key LIKE '%%2fa%%' OR meta_key LIKE '%%totp%%')",$u->ID)))); }
  $o['shop_manager']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}usermeta WHERE meta_key='{$p}capabilities' AND meta_value LIKE '%shop_manager%'");
  $o['users_can_register']=get_option('users_can_register'); $o['default_role']=get_option('default_role');
  $o['login_admin_exists']=(bool)username_exists('admin');
  // saugumo pluginai
  $sk=array('two-factor','wordfence','limit-login','login-lockdown','ithemes','solid-security','sucuri','all-in-one-wp-security','wp-cerber','ninjafirewall','updraft','backwpup','duplicator','wpvivid','miniorange','wp-2fa','loginizer');
  $o['saug_pluginai']=array(); foreach(array_keys($all) as $f){ foreach($sk as $k){ if(stripos($f,$k)!==false){ $o['saug_pluginai'][$f]=in_array($f,$act)?'AKTYVUS':'neaktyvus'; } } }
  // 3. wp-config konstantos
  foreach(array('DISALLOW_FILE_EDIT','DISALLOW_FILE_MODS','WP_DEBUG','WP_DEBUG_DISPLAY','WP_DEBUG_LOG','FORCE_SSL_ADMIN','DISABLE_WP_CRON','WP_MEMORY_LIMIT','FS_METHOD','WP_ENVIRONMENT_TYPE') as $c){ $o['konst'][$c]=defined($c)?var_export(constant($c),true):'nedef'; }
  $o['salts_ok']=(defined('AUTH_KEY') && strlen(AUTH_KEY)>40 && strpos(AUTH_KEY,'put your unique')===false);
  $o['db_user']=DB_USER; $o['db_host']=DB_HOST; $o['prefix']=$p;
  $o['db_grants']=$wpdb->get_col("SHOW GRANTS"); if(is_array($o['db_grants'])) $o['db_grants']=array_map(function($g){return preg_replace('/IDENTIFIED BY.*$/i','',substr($g,0,140));},$o['db_grants']);
  $o['xmlrpc_filter']=apply_filters('xmlrpc_enabled',true);
  $o['blog_public']=get_option('blog_public');
  // 4. failai
  $root=ABSPATH; $wc=WP_CONTENT_DIR; $upl=wp_upload_dir()['basedir'];
  $o['perms']=array('wp-config'=>substr(sprintf('%o',fileperms($root.'wp-config.php')),-4),'root'=>substr(sprintf('%o',fileperms($root)),-4),'uploads'=>substr(sprintf('%o',fileperms($upl)),-4),'htaccess'=>substr(sprintf('%o',fileperms($root.'.htaccess')),-4));
  $o['wpconfig_uz_webroot']=!file_exists($root.'wp-config.php') && file_exists(dirname($root).'/wp-config.php');
  $o['readme_html']=file_exists($root.'readme.html'); $o['license_txt']=file_exists($root.'license.txt'); $o['install_php']=file_exists($root.'wp-admin/install.php');
  $o['uploads_htaccess']=file_exists($upl.'/.htaccess')?substr(file_get_contents($upl.'/.htaccess'),0,300):'NERA';
  // php failai uploads (rekursija, limit)
  $phpu=array(); $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($upl,FilesystemIterator::SKIP_DOTS)); $n=0;
  foreach($it as $f){ if(++$n>200000) break; $e=strtolower($f->getExtension()); if(in_array($e,array('php','phtml','php5','php7','phar'))) $phpu[]=str_replace($upl,'',$f->getPathname()); if(count($phpu)>30) break; }
  $o['php_uploads']=$phpu;
  // dump'ai/bak webroot šaknyje ir wp-content
  $dmp=array(); foreach(array_merge(glob($root.'*.{sql,zip,gz,tar,bak,tgz,7z,rar}',GLOB_BRACE)?:array(),glob($root.'*.php.*')?:array(),glob($wc.'/*.{sql,zip,gz,tar,bak,tgz}',GLOB_BRACE)?:array(),glob($root.'wp-config*')?:array()) as $f) $dmp[]=basename($f).' '.round(filesize($f)/1024).'KB';
  $o['dump_failai']=$dmp;
  $o['root_neiprasti']=array(); $std=array('index.php','wp-activate.php','wp-blog-header.php','wp-comments-post.php','wp-config.php','wp-config-sample.php','wp-cron.php','wp-links-opml.php','wp-load.php','wp-login.php','wp-mail.php','wp-settings.php','wp-signup.php','wp-trackback.php','xmlrpc.php','.htaccess','license.txt','readme.html','wp-admin','wp-content','wp-includes','robots.txt','.well-known','cgi-bin','.user.ini','php.ini','error_log','favicon.ico','ads.txt','sitemap.xml');
  foreach(scandir($root) as $f){ if($f=='.'||$f=='..') continue; if(!in_array($f,$std)) $o['root_neiprasti'][]=$f.(is_dir($root.$f)?'/':' '.round(filesize($root.$f)/1024).'KB'); }
  $o['senas_webroot']=is_dir(dirname($root).'/public_html-senas2019');
  $o['ps_archyvas']=is_dir(dirname($root).'/ps-archyvas')?count(scandir(dirname($root).'/ps-archyvas'))-2:'NERA';
  $o['php_error_log']=array('kelias'=>ini_get('error_log'),'uz_webroot'=>strpos((string)ini_get('error_log'),$root)===false,'display'=>ini_get('display_errors'),'disable_functions'=>substr(ini_get('disable_functions'),0,200),'expose_php'=>ini_get('expose_php'));
  // pakeisti per 7 d. (wp-content, ne cache/uploads)
  $mod=array(); $it2=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($wc,FilesystemIterator::SKIP_DOTS)); $lim=time()-7*86400; $n=0;
  foreach($it2 as $f){ if(++$n>300000) break; $pn=$f->getPathname(); if(strpos($pn,'/uploads/')!==false||strpos($pn,'/cache/')!==false||strpos($pn,'/wpo-cache')!==false||strpos($pn,'/languages/')!==false) continue; if($f->getMTime()>$lim && in_array(strtolower($f->getExtension()),array('php','js','htaccess','ini'))) $mod[]=date('m-d H:i',$f->getMTime()).' '.str_replace($wc,'',$pn); }
  rsort($mod); $o['pakeisti_7d']=array_slice($mod,0,40); $o['pakeisti_7d_viso']=count($mod);
  // mu-plugins md5
  foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $f){ $o['mu'][basename($f)]=substr(md5_file($f),0,8); }
  // .htaccess įtartinumas
  $ht=file_exists($root.'.htaccess')?file_get_contents($root.'.htaccess'):''; $o['htaccess']=array('kb'=>round(strlen($ht)/1024,1),'itartina'=>(bool)preg_match('/base64|eval|auto_prepend|RewriteCond.*HTTP_USER_AGENT.*google.*\n.*RewriteRule/i',$ht),'eilutes'=>substr_count($ht,"\n"));
  $o['user_ini']=file_exists($root.'.user.ini')?substr(file_get_contents($root.'.user.ini'),0,200):'-';
  // 5. snippetai
  $sn=$wpdb->get_results("SELECT id,name,code,active FROM {$p}snippets ORDER BY id",ARRAY_A); $o['snip']=array('viso'=>count($sn),'aktyvus'=>0,'get_raktas'=>array(),'pavojingi'=>array(),'temp_aktyvus'=>array());
  foreach($sn as $s){ if($s['active']){ $o['snip']['aktyvus']++; if(stripos($s['name'],'TEMP')===0) $o['snip']['temp_aktyvus'][]=$s['id'].' '.$s['name']; if(preg_match('/\$_(GET|REQUEST)\[/',$s['code'])) $o['snip']['get_raktas'][]=$s['id'].' '.substr($s['name'],0,50); if(preg_match('/\b(eval|system|exec|shell_exec|passthru|base64_decode|file_put_contents|unlink)\s*\(/',$s['code'],$m)) $o['snip']['pavojingi'][]=$s['id'].' '.substr($s['name'],0,40).' ['.$m[1].']'; } }
  // raktai opcijose — tik pavadinimai
  $o['raktu_opcijos']=$wpdb->get_col("SELECT option_name FROM {$p}options WHERE option_name LIKE 'ps\\_%' AND (option_name LIKE '%rakt%' OR option_name LIKE '%secret%' OR option_name LIKE '%token%' OR option_name LIKE '%_tk' OR option_name LIKE '%_mk' OR option_name LIKE '%key%')");
  // REST maršrutai ps-web
  $o['rest_ps']=array(); foreach(array_keys(rest_get_server()->get_routes()) as $r){ if(strpos($r,'/ps-web')===0||strpos($r,'/petshop')===0||strpos($r,'/ps/')===0) $o['rest_ps'][]=$r; }
  // 6. HTTP išorinės patikros (iš serverio)
  $ua=array('timeout'=>12,'redirection'=>0,'sslverify'=>false);
  $h=wp_remote_get('https://petshop.lt/',$ua); $hd=is_wp_error($h)?array():wp_remote_retrieve_headers($h)->getAll();
  $o['http']['home']=is_wp_error($h)?$h->get_error_message():wp_remote_retrieve_response_code($h);
  foreach(array('server','x-powered-by','strict-transport-security','x-frame-options','x-content-type-options','content-security-policy','referrer-policy','permissions-policy','cf-ray','x-litespeed-cache') as $k) $o['http']['antr'][$k]=$hd[$k]??'-';
  $r=wp_remote_get('http://petshop.lt/',$ua); $o['http']['http_redirect']=is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r).' '.(wp_remote_retrieve_header($r,'location')?:'');
  $r=wp_remote_post('https://petshop.lt/xmlrpc.php',array_merge($ua,array('body'=>'<?xml version="1.0"?><methodCall><methodName>system.listMethods</methodName></methodCall>'))); $o['http']['xmlrpc']=is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r).' '.(strpos(wp_remote_retrieve_body($r),'wp.getUsersBlogs')!==false?'ATVIRAS':'uzdaras/kitas');
  $r=wp_remote_get('https://petshop.lt/?rest_route=/wp/v2/users',$ua); $b=wp_remote_retrieve_body($r); $o['http']['rest_users']=is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r).' '.(preg_match('/"slug":"([^"]+)"/',$b,$m)?'ATSKLEIDZIA:'.$m[1]:'uzdaras');
  $r=wp_remote_get('https://petshop.lt/?author=1',$ua); $o['http']['author1']=is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r).' '.substr((string)wp_remote_retrieve_header($r,'location'),0,60);
  $r=wp_remote_get('https://petshop.lt/wp-json/',$ua); $o['http']['wp_json']=is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r);
  $r=wp_remote_get('https://petshop.lt/wp-content/uploads/',$ua); $o['http']['uploads_listing']=is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r).' '.(stripos(wp_remote_retrieve_body($r),'Index of')!==false?'LISTING':'ne');
  $r=wp_remote_get('https://petshop.lt/wp-login.php',$ua); $o['http']['wp_login']=is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r);
  $r=wp_remote_get('https://petshop.lt/wp-config.php.bak_s1675',$ua); $o['http']['wpconfig_bak']=is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r);
  $r=wp_remote_get('https://petshop.lt/wp-content/uploads/ps-backups/',$ua); $o['http']['ps_backups_listing']=is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r).' '.(stripos(wp_remote_retrieve_body($r),'Index of')!==false?'LISTING':'ne');
  $r=wp_remote_get('https://petshop.lt/readme.html',$ua); $o['http']['readme']=is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r);
  // 7. WC/klientai
  $o['wc']=array('klientai'=>count_users()['avail_roles']['customer']??0,'store_api_rate'=>get_option('woocommerce_store_api_rate_limit','nedef'),'guest_checkout'=>get_option('woocommerce_enable_guest_checkout'),'paysera_test'=>get_option('paysera_test_mode','-'));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
