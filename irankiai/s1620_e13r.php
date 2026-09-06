<?php
/** TEMP PS S1620 run e13r — R: data nuo–iki neatitikimas (sąraše 7, DB 13) — palyginti ID ir sukūrimo laikus (tik skaitymas). */
add_action('init', function(){
  if (!isset($_GET['ps_e13r'])) return;
  $o=array('v'=>'S1620 e13r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(200);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp=time()+900; $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
  $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'logged_in',$tok))));
  try{
  $r=wp_remote_get(admin_url('admin.php?page=ps-desk&eile=visi&nuo=2026-09-05&iki=2026-09-05'),array('cookies'=>$cs,'timeout'=>90,'sslverify'=>false)); $h=(string)wp_remote_retrieve_body($r); preg_match('/<main class="dl-main">(.*)<\/main>/su',$h,$m); preg_match_all('/atidaryti=(35\d{3})/',$m[1]??'',$ids); $o['sarasas']=array_values(array_unique($ids[1])); preg_match_all('/<tr[^>]*>.*?#(35\d{3})/su',$m[1]??'',$ids2); $o['sarasas_regex_tr']=array_values(array_unique($ids2[1]));
  $rows=$wpdb->get_results("SELECT id,status,date_created_gmt FROM {$p}wc_orders WHERE type='shop_order' AND date_created_gmt BETWEEN '2026-09-04 18:00:00' AND '2026-09-06 03:00:00' ORDER BY id",ARRAY_A); foreach($rows as &$x){ $x['local']=get_date_from_gmt($x['date_created_gmt'],'Y-m-d H:i'); } $o['db']=$rows;
  $o['tz']=wp_timezone_string(); $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'");
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
