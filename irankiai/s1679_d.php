<?php
/** TEMP PS S1679 d — DEPLOY: rinkiklis petshop-analitika.php v1.2 atstatomas, langas -> petshop-analitika-langas.php v1.0.2 (fazė D); patikra (fazė T). */
add_action('init', function(){
  if (!isset($_GET['ps_s1679d'])) return; global $wpdb; $p=$wpdb->prefix; $F=$_GET['ps_s1679d']; $o=array('v'=>'S1679 d','faze'=>$F);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $fr=WPMU_PLUGIN_DIR.'/petshop-analitika.php'; $fl=WPMU_PLUGIN_DIR.'/petshop-analitika-langas.php'; $bd=wp_upload_dir()['basedir'].'/ps-backups/'; $bk=$bd.'petshop-analitika.php.bak_s1679';
  $dec=function($k){ $mid=isset($_GET[$k])?(int)$_GET[$k]:0; $mf=$mid?get_attached_file($mid):''; $c=$mf&&file_exists($mf)?gzdecode(base64_decode(trim(file_get_contents($mf)))):false; if($mid) wp_delete_attachment($mid,true); return $c; };
  if($F==='D'){
    $o['bak_esami']=array_map('basename',array_merge(glob($bd.'petshop-analitika*'),glob(dirname(ABSPATH).'/ps-archyvas/*/petshop-analitika*')));
    $rink=$dec('d_an_rink_v12_txt'); $lang=$dec('d_an_langas_v102_txt');
    $o['gyvas_md5']=md5_file($fr); $o['rink_md5']=$rink?md5($rink):null; $o['lang_md5']=$lang?md5($lang):null; $o['langas_yra']=file_exists($fl);
    if($o['gyvas_md5']!=='b181d2b49f2750d0a57f77f1c9d3e275') $o['STOP']='gyvas ne v1.0.1';
    elseif($o['rink_md5']!=='fab5e5a8ac9c3ced15fe3a6a80eeb69c'||$o['lang_md5']!=='f170d2c234ed607123899640e45d1435') $o['STOP']='md5';
    elseif(@token_get_all($rink,TOKEN_PARSE)===false||@token_get_all($lang,TOKEN_PARSE)===false) $o['STOP']='SINTAKSE';
    else { copy($fr,$bk); file_put_contents($fl,$lang); file_put_contents($fr,$rink); $o['irasyta']=array(md5_file($fr),md5_file($fl));
      $r=wp_remote_get(home_url('/?ps_ping_s1679d='.time()),array('timeout'=>25,'sslverify'=>false)); $c=is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r); $o['ping']=$c;
      if(is_wp_error($r)||$c>=500){ copy($bk,$fr); @unlink($fl); $o['ROLLBACK']=md5_file($fr); } }
  }
  if($F==='T'){
    $o['md5']=array(md5_file($fr),file_exists($fl)?md5_file($fl):null);
    $o['klases']=array('rink'=>class_exists('Petshop_Analitika')?(new ReflectionClass('Petshop_Analitika'))->getFileName().' v'.Petshop_Analitika::VERSIJA:'NERA','lang'=>class_exists('Petshop_Analitika_Langas')?basename((new ReflectionClass('Petshop_Analitika_Langas'))->getFileName()):'NERA');
    $pries=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_web_ivykiai WHERE diena=CURDATE()");
    $r=wp_remote_post(home_url('/?rest_route=/ps-web/v1/i'),array('timeout'=>15,'sslverify'=>false,'headers'=>array('Content-Type'=>'text/plain','User-Agent'=>'Mozilla/5.0 (X11; Linux) Chrome/128 S1679test'),'body'=>json_encode(array('e'=>'page_view','u'=>'/?ps_s1679_test=1','pt'=>'other','s'=>'t_s1679|1|1|x','v'=>'s1679test'))));
    $o['rest']=is_wp_error($r)?$r->get_error_message():array(wp_remote_retrieve_response_code($r),substr(wp_remote_retrieve_body($r),0,200));
    $o['ivykiai_siandien']=array($pries,(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_web_ivykiai WHERE diena=CURDATE()"));
    $o['pask']=$wpdb->get_row("SELECT id,laikas,tipas,url_kelias FROM {$p}ps_web_ivykiai ORDER BY id DESC LIMIT 1",ARRAY_A);
    $o['menu']=has_action('admin_menu'); 
    $log=dirname(ABSPATH).'/logs/php_error.log'; $o['log_fatal']=file_exists($log)?count(array_filter(array_slice(file($log),-30),function($l){return stripos($l,'fatal')!==false||stripos($l,'redeclare')!==false;})):null;
  }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
