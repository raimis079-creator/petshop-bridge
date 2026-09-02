<?php
/** TEMP PS DARBUOTOJO TESTO ŠABLONAS (S1605) — sesija `testuotojas`, veiksmai per realius admin-post endpoint'us su nonce */
add_filter('pre_wp_mail', function($r,$a){ $l=(array)get_option('ps_audit_mail',array()); $att=isset($a['attachments'])?(array)$a['attachments']:array(); $l[]=array(current_time('H:i:s'),is_array($a['to'])?implode(',',$a['to']):$a['to'],$a['subject'],count($att),array_map(function($x){return basename($x).':'.(file_exists($x)?filesize($x):'?');},$att),isset($_GET['ps_tst'])?'run':'web'); update_option('ps_audit_mail',array_slice($l,-120),false); return true; },10,2);
add_action('init', function(){
  if (!isset($_GET['ps_tst'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_tst'])); $o=array(); global $wpdb; $p=$wpdb->prefix; set_time_limit(290);
  $refl=function($m,$args){ $r=new ReflectionMethod('Petshop_Desk',$m); $r->setAccessible(true); return $r->invokeArgs(null,$args); };
  $u=get_user_by('login','testuotojas'); $uid=$u?$u->ID:1; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp); $lc=wp_generate_auth_cookie($uid,$exp,'logged_in',$tok);
  $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>$lc)));
  $_COOKIE[LOGGED_IN_COOKIE]=$lc; wp_set_current_user($uid);
  $txt=function($b){ if(preg_match('/<div id="wpbody-content".*$/s',$b,$mm)) $b=$mm[0]; $b=preg_replace('/<script.*?<\/script>|<style.*?<\/style>/s','',$b); return preg_replace('/\s+/',' ',html_entity_decode(wp_strip_all_tags($b,true))); };
  $REQ=function($url,$post=null,$raw=false) use($cs,$txt){ $a=array('cookies'=>$cs,'timeout'=>90,'sslverify'=>false,'redirection'=>0); if($post!==null){ $a['body']=$post; $r=wp_remote_post($url,$a);} else $r=wp_remote_get($url,$a); if(is_wp_error($r)) return array('err'=>$r->get_error_message()); $b=wp_remote_retrieve_body($r); $x=array('code'=>wp_remote_retrieve_response_code($r),'ct'=>wp_remote_retrieve_header($r,'content-type')); $loc=wp_remote_retrieve_header($r,'location'); if($loc){ parse_str(parse_url($loc,PHP_URL_QUERY),$q); $x['loc']=array_intersect_key($q,array_flip(array('page','eile','pd_ok','pd_nr','src','b','msg','ok','klaida','view','z'))); if(isset($x['loc']['pd_nr'])) $x['loc']['pd_nr']=rawurldecode($x['loc']['pd_nr']); } if($raw){ $x['raw']=$b; } else { $x['txt']=mb_substr($txt($b),0,600); } if(strpos((string)$x['ct'],'pdf')!==false){ $x['pdf']=array('bytes'=>strlen($b),'hdr'=>substr($b,0,5),'pages'=>preg_match_all('/\/Type\s*\/Page[^s]/',$b)); unset($x['txt'],$x['raw']); } return $x; };
  $act=function($v,$id,$extra=array()) use($REQ){ $n=wp_create_nonce('ps_desk_'.$v.'_'.$id); return $REQ(admin_url('admin-post.php').'?'.http_build_query(array_merge(array('action'=>'ps_desk_veiksmas','v'=>$v,'id'=>$id,'_wpnonce'=>$n,'g'=>admin_url('admin.php?page=ps-desk')),$extra))); };
  $snap=function($id) use($refl){ $ord=wc_get_order($id); if(!$ord) return 'nera'; $row=array('st'=>$ord->get_status(),'eile'=>$refl('eile',array($ord)),'kl'=>$refl('klausimas',array($ord)),'siunta'=>Petshop_Desk::siuntos_kodas($ord),'pak'=>Petshop_Desk::pakuociu($ord),'ds_sent'=>$ord->get_meta('_ps_dropship_sent_src'),'siuntos'=>$ord->get_meta('_ps_siuntos'),'vpd'=>mb_substr((string)$ord->get_meta('venipak_shipping_order_data'),0,300),'notes'=>array()); foreach(wc_get_order_notes(array('order_id'=>$id,'limit'=>5)) as $nt){ $row['notes'][]=mb_substr(wp_strip_all_tags($nt->content),0,150);} return $row; };
  if ($f==='T') {
    // PAVYZDYS: $act('misrus',$id,array('s'=>array('vf'=>'tiesiai'))) · $act('vp_reg',0,array('sandelis'=>'av','ids'=>'1,2'))
    // $REQ(admin_url('admin.php?page=ps-desk'),null,true)['raw'] · $REQ(admin_url('admin-post.php'),array(...POST...))
    // $snap($id) — statusas, eilė (Reflection Petshop_Desk::eile), siuntos, pastabos. Prieš snap po loopback: wp_cache_flush().
    $o['pavyzdys']=$snap(35434);
  }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
