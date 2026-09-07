<?php
/** TEMP PS S1636 run k — SKUBUS READ-ONLY: kategoriju paveikslu diagnostika (img src, HTTP, thumbnail meta, debug.log, cache, modalo bukle). */
add_action('init', function(){
  if (!isset($_GET['ps_s1636k'])) return;
  $o=array('v'=>'S1636 k'); global $wpdb; $p=$wpdb->prefix; set_time_limit(120);
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  try{
  $o['wm_md5']=md5_file(WP_PLUGIN_DIR.'/petshop-core/includes/class-welcome-modal.php');
  $o['wm_opt']=get_option('petshop_welcome_modal_enabled');
  $h=(string)wp_remote_retrieve_body(wp_remote_get(home_url('/?ps_nocache='.time()),array('timeout'=>40,'sslverify'=>false)));
  $o['html_ilgis']=strlen($h); $o['psw_yra']=(int)(strpos($h,'id="psw"')!==false);
  // kategoriju blokas
  if(preg_match('/Pagrindinės kategorijos(.{0,4000})/su',$h,$m)===false){}
  $blk=''; $pos=mb_strpos($h,'Pagrindin'); if($pos!==false) $blk=mb_substr($h,$pos,5000);
  preg_match_all('/<img[^>]+>/i',$blk,$imgs);
  $o['kat_img_n']=count($imgs[0]); $o['kat_img_pvz']=array_slice(array_map(function($t){return mb_substr($t,0,300);},$imgs[0]),0,3);
  // pirmo img src HTTP
  if(preg_match('/src="([^"]+)"/',$imgs[0][0]??'',$mm)){
    $r=wp_remote_head($mm[1],array('timeout'=>20,'sslverify'=>false));
    $o['img1_src']=$mm[1]; $o['img1_http']=wp_remote_retrieve_response_code($r);
  }
  // ar lazy (data-src)?
  $o['data_src_bloke']=(int)preg_match('/data-src=/',$blk);
  // JS klaidu saltinis? paziurim ar psw script yra sveciui (neturi buti, opt=0)
  $o['psw_script']=(int)(strpos($h,'psw-ov')!==false);
  // debug.log uodega
  $dl=WP_CONTENT_DIR.'/debug.log'; $o['debug_log']=file_exists($dl)?array('dydis'=>filesize($dl),'uodega'=>array_slice(array_filter(explode("\n",(string)file_get_contents($dl))), -6)):'nera';
  // super-cache
  $o['wp_cache']=defined('WP_CACHE')?WP_CACHE:'?';
  $cd=WP_CONTENT_DIR.'/cache/supercache/'; $o['supercache_dirs']=is_dir($cd)?array_slice(scandir($cd),2,6):'nera';
  // kategoriju terminu thumbnail meta
  $ts=$wpdb->get_results("SELECT t.term_id,t.name,tm.meta_value thumb FROM {$p}terms t JOIN {$p}term_taxonomy tt ON tt.term_id=t.term_id AND tt.taxonomy='product_cat' AND tt.parent=0 LEFT JOIN {$p}termmeta tm ON tm.term_id=t.term_id AND tm.meta_key='thumbnail_id' ORDER BY t.name LIMIT 12",OBJECT);
  foreach($ts as $r){ $att=(int)$r->thumb; $url=$att?wp_get_attachment_url($att):''; $fx=$att?(int)file_exists(get_attached_file($att)):-1; $o['kat_terminai'][]=$r->name.' | thumb='.$att.' | fail_yra='.$fx.' | '.mb_substr((string)$url,-60); }
  // paskutiniai pakeisti failai uploads (ar kas trina?)
  $o['snippets_aktyvus']=$wpdb->get_col("SELECT name FROM {$p}snippets WHERE active=1 AND name LIKE 'TEMP%'");
  $J($o);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); $J($o); }
},99);
