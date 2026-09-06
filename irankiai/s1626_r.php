<?php
/** TEMP PS S1626 run r — R: sveikata (TEMP valymas, darbalaukio versija/md5, ping, eilės, Warning). */
add_action('init', function(){
  if (!isset($_GET['ps_s1626r'])) return;
  $o=array('v'=>'S1626 r'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  foreach(array('petshop-darbalaukis.php','petshop-juosta.php','petshop-av-tiekimas.php','petshop-dev-pastas.php') as $f){ $fp=WPMU_PLUGIN_DIR.'/'.$f; $s=file_get_contents($fp,false,null,0,600); preg_match('/v(\d+\.\d+(?:\.\d+)?)/',$s,$m); $o['f'][$f]=array('v'=>$m[1]??'?','md5'=>md5_file($fp),'b'=>filesize($fp)); }
  $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp=time()+900; $tok=WP_Session_Tokens::get_instance($uid)->create($exp); $li=wp_generate_auth_cookie($uid,$exp,'logged_in',$tok);
  $cs=array(new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>$li)));
  $r=wp_remote_get(admin_url('admin.php?page=ps-desk&eile=visi'),array('cookies'=>$cs,'timeout'=>90,'sslverify'=>false));
  $h=(string)wp_remote_retrieve_body($r);
  $o['eiles']=array('code'=>wp_remote_retrieve_response_code($r),'nav'=>mb_substr(trim(preg_replace('/\s+/',' ',wp_strip_all_tags(preg_match('/<div class="dl-eiles">(.*?)<\/div>/su',$h,$mm)?$mm[1]:''))),0,140),'warning'=>substr_count($h,'<b>Warning</b>'));
  $o['ping']=wp_remote_retrieve_response_code(wp_remote_get(home_url('/'),array('timeout'=>30,'sslverify'=>false)));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
