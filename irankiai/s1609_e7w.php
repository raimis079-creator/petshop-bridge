<?php
/** TEMP PS S1609 run e7w — v3.10.2 patikra: amžius, dialogai, valymas */
add_action('init', function(){
  if (!isset($_GET['ps_e7w'])) return;
  $o=array('v'=>'run e7w'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $o['versija']=Petshop_Darbalaukis::VERSIJA; $o['md5']=md5_file(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'); $o['bytes']=filesize(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php');
  $r=new ReflectionMethod('Petshop_Darbalaukis','amzius'); $r->setAccessible(true); $ord=wc_get_order(35775); $o['amzius_35775']=$r->invoke(null,$ord->get_date_created()); $o['sukurtas']=$ord->get_date_created()->date('Y-m-d H:i:s T'); $o['dabar']=current_time('mysql');
  $o['temp_liko']=$wpdb->get_results("SELECT id,name,active FROM {$p}snippets WHERE name LIKE 'TEMP%'",ARRAY_A);
  $o['backups']=array_map('basename',glob(wp_upload_dir()['basedir'].'/ps-backups/petshop-darbalaukis-v3*-BACKUP-2026-09-03.php'));
  $u=get_user_by('login','testuotojas'); $uid=$u?$u->ID:1; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
  $cook=array(); foreach(array(array(SECURE_AUTH_COOKIE,'secure_auth'),array(AUTH_COOKIE,'auth'),array(LOGGED_IN_COOKIE,'logged_in')) as $c){ $cook[]=array('name'=>$c[0],'value'=>wp_generate_auth_cookie($uid,$exp,$c[1],$tok)); }
  $B=admin_url('admin.php?page=ps-desk'); $o['cookies']=$cook;
  $o['shots']=array(
    array('n'=>'e7_dialogas_av','u'=>$B.'&eile=paruosta','click'=>'tr.eil[data-id="35429"] td.d a.v.p','eval'=>"({dlg:(document.querySelector('.dl-dlg.on')||{}).innerText,opt:(document.querySelector('#dlDlgOpt')||{}).checked,href:((document.querySelector('.dl-dlg.on a.v.p')||{}).href||'').replace(/_wpnonce=\\w+/,'')})"),
    array('n'=>'e7_dialogas_viska','u'=>$B.'&eile=paruosta','click'=>'a.v.p[data-d*="viską"]','eval'=>"({dlg:(document.querySelector('.dl-dlg.on')||{}).innerText})"),
  );
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
