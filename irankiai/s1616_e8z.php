<?php
/** TEMP PS S1616 run e8z — Z (naujas procesas, testuotojas): per TIKRAS kortelių nuorodas — #35436 „Atšaukti tik grįžusią dalį“ (Quattro), #35434 „Atšaukti — prekės grįžo į AV“ (visas) → žymė `_ps_grazinti_rankomis` (13,01 / 33,04), pastabos, statusai, Klausimas „Grąžink klientui pinigus“ (ir atšauktam), laiškai 0; Playwright Klausimai po. Y (naujas procesas): likučiai (16727 own, 19708, 16889), meta, įvykiai. Venipak nekviestas. */
add_action('init', function(){
  if (!isset($_GET['ps_e8z'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e8z'])); $o=array('v'=>'S1616 e8z','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $bk=function($id) use ($wpdb){ $x=wc_get_order($id); $it=array(); foreach($x->get_items() as $iid=>$i){ $it[$iid]=array(mb_substr($i->get_name(),0,14),$i->get_quantity(),(string)$i->get_meta('_ps_av_reduced_qty'),(string)$i->get_meta('_reduced_stock'),(string)$i->get_meta('_ps_atsaukta')); } $nt=wc_get_order_notes(array('order_id'=>$id,'limit'=>2)); $ev=$wpdb->get_results($wpdb->prepare('SELECT veiksmas,rezultatas,kas_vardas,pastaba FROM '.Petshop_Uzsakymu_Ivykiai::t().' WHERE uzsakymas=%d ORDER BY id DESC LIMIT 2',$id),ARRAY_A);
    return array('st'=>$x->get_status(),'total'=>$x->get_total(),'griz'=>(string)$x->get_meta('_ps_siunta_grizta'),'graz'=>(string)$x->get_meta('_ps_grazinti_rankomis'),'ats'=>(string)$x->get_meta('_ps_dalys_atsaukta'),'restored'=>(string)$x->get_meta('_ps_av_restored'),'it'=>$it,'pastabos'=>array_map(function($a){ return mb_substr($a->content,0,320); },$nt),'ivykiai'=>$ev); };
  $stock=function(){ return array('16727_own'=>get_post_meta(16727,'_own_stock_qty',true),'16727_stock'=>get_post_meta(16727,'_stock',true),'19708_stock'=>get_post_meta(19708,'_stock',true),'16889_own'=>get_post_meta(16889,'_own_stock_qty',true),'16889_stock'=>get_post_meta(16889,'_stock',true)); };
  try{
  if($f==='Z'){
    add_filter('pre_wp_mail',function($r,$a){ $m=get_option('ps_e8_mail',array()); $m[]=$a['subject']; update_option('ps_e8_mail',$m,false); return true; },4,2);
    $o['dev_pastas_pries']=count((array)get_option('ps_dev_pastas_zurnalas',array())); $o['stock_pries']=$stock();
    $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; wp_set_current_user($uid); $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
    $li=wp_generate_auth_cookie($uid,$exp,'logged_in',$tok); $_COOKIE[LOGGED_IN_COOKIE]=$li;
    $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>$li)));
    $r=wp_remote_get(admin_url('admin.php?page=ps-desk&eile=klausimai'),array('cookies'=>$cs,'timeout'=>90,'sslverify'=>false)); $h=(string)wp_remote_retrieve_body($r);
    $urls=array(); if(preg_match_all('/href="([^"]*v=grizta_atsaukti[^"]*)"/',$h,$m)){ foreach($m[1] as $u){ foreach(array(35436,35434) as $id){ if(strpos($u,'id='.$id)!==false){ $urls[$id]=html_entity_decode($u); } } } } $o['urls']=array_map(function($u){ return mb_substr($u,0,120); },$urls);
    $n=wp_create_nonce('ps_dl_zurnalas');
    $sk=function($id) use ($cs,$n){ $r=wp_remote_get(admin_url('admin-ajax.php?action=ps_dl_skydelis&id='.$id.'&n='.$n),array('cookies'=>$cs,'timeout'=>60,'sslverify'=>false)); $d=(json_decode((string)wp_remote_retrieve_body($r),true)['data']??array()); return array('kl'=>$d['klausimas']??null,'kur'=>$d['kur']??null,'st'=>$d['st']??null); };
    foreach(array(35436,35434) as $id){ if(empty($urls[$id])){ $o['ats'][$id]='NUORODOS NĖRA'; continue; } $r2=wp_remote_get($urls[$id],array('cookies'=>$cs,'timeout'=>120,'sslverify'=>false,'redirection'=>0)); $o['ats'][$id]=array('code'=>wp_remote_retrieve_response_code($r2),'loc'=>urldecode((string)wp_remote_retrieve_header($r2,'location'))); $o['sk_po'][$id]=$sk($id); }
    $r=wp_remote_get(admin_url('admin.php?page=ps-desk&eile=klausimai'),array('cookies'=>$cs,'timeout'=>90,'sslverify'=>false)); $h=(string)wp_remote_retrieve_body($r);
    foreach(array(35436,35434) as $id){ $o['kortele_po'][$id]=preg_match('/<div class="dl-kortele eil" data-id="'.$id.'"(.*?)<p class="dl-veiksmai">(.*?)<\/p>/su',$h,$m)?array('tekstas'=>trim(preg_replace('/\s+/',' ',wp_strip_all_tags(html_entity_decode($m[1])))),'mygtukai'=>preg_match_all('/<(?:a|button) class="v[^"]*"[^>]*>(.*?)<\/(?:a|button)>/su',$m[2],$mm)?array_map('wp_strip_all_tags',$mm[1]):array()):'KORTELĖS NĖRA'; }
    $o['laiskai']=get_option('ps_e8_mail',array()); delete_option('ps_e8_mail'); $o['dev_pastas_po']=count((array)get_option('ps_dev_pastas_zurnalas',array()));
    wp_set_current_user(0);
    $exp2=time()+1800; $tok2=WP_Session_Tokens::get_instance($uid)->create($exp2);
    $o['cookies']=array(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp2,'secure_auth',$tok2)),array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp2,'auth',$tok2)),array('name'=>LOGGED_IN_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp2,'logged_in',$tok2)));
    $o['shots']=array(array('n'=>'s1616_e8_klausimai_po','u'=>admin_url('admin.php?page=ps-desk&eile=klausimai'),'w'=>1400,'full'=>true,'eval'=>"({korteles:[...document.querySelectorAll('.dl-kortele')].map(function(x){return x.getAttribute('data-id')+': '+x.innerText.replace(/\\s+/g,' ').slice(0,260);})})"));
  }
  if($f==='Y'){ $o['stock']=$stock(); foreach(array(35436,35434) as $id){ $o['uzs'][$id]=$bk($id); } $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=1"); }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $J($o);
},99);
