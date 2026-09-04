<?php
/** TEMP PS S1616 run e5z — Z2: „Grąžinta“ #35425 per teisingą kelią (skydelio JSON neturi grazinta URL — imam iš kortelės HTML admin puslapyje kaip naršyklė; nonce toks pat kaip UI). Naujas procesas, testuotojas. */
add_action('init', function(){
  if (!isset($_GET['ps_e5z'])) return;
  $o=array('v'=>'S1616 e5z'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  try{
    add_filter('pre_wp_mail',function($r,$a){ $m=get_option('ps_e5_mail',array()); $m[]=1; update_option('ps_e5_mail',$m,false); return true; },4,2);
    $o['dev_pastas_pries']=count((array)get_option('ps_dev_pastas_zurnalas',array()));
    $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; wp_set_current_user($uid);
    $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
    $li=wp_generate_auth_cookie($uid,$exp,'logged_in',$tok); $_COOKIE[LOGGED_IN_COOKIE]=$li;
    $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>$li)));
    // 1) Kortelės HTML iš Klausimų puslapio — ištraukiam TIKRĄ „Grąžinta“ nuorodą (nonce kaip UI)
    $r=wp_remote_get(admin_url('admin.php?page=ps-desk&eile=klausimai'),array('cookies'=>$cs,'timeout'=>90,'sslverify'=>false)); $h=(string)wp_remote_retrieve_body($r);
    $o['klausimai_code']=wp_remote_retrieve_response_code($r);
    // rasti bloką su 35425 ir jame grazinta href
    $url=null; if(preg_match_all('/href="([^"]*action=ps_dl_veiksmas[^"]*v=grazinta[^"]*id=35425[^"]*)"/',$h,$m)){ $url=html_entity_decode($m[1][0]); }
    if(!$url && preg_match_all('/href="([^"]*v=grazinta[^"]*)"/',$h,$m)){ foreach($m[1] as $u){ if(strpos($u,'id=35425')!==false){ $url=html_entity_decode($u); break; } } }
    $o['grazinta_url']=$url;
    $o['graz_pries']=(string)wc_get_order(35425)->get_meta('_ps_grazinti_rankomis');
    if($url){ $r2=wp_remote_get($url,array('cookies'=>$cs,'timeout'=>90,'sslverify'=>false,'redirection'=>0)); $o['grazinta']=array('code'=>wp_remote_retrieve_response_code($r2),'loc'=>urldecode((string)wp_remote_retrieve_header($r2,'location'))); }
    $x=wc_get_order(35425); $o['graz_po']=(string)$x->get_meta('_ps_grazinti_rankomis');
    $ev=$wpdb->get_row($wpdb->prepare('SELECT veiksmas,rezultatas,kas_vardas,pastaba FROM '.Petshop_Uzsakymu_Ivykiai::t().' WHERE uzsakymas=35425 ORDER BY id DESC LIMIT 1'),ARRAY_A); $o['ivykis']=$ev;
    $nt=wc_get_order_notes(array('order_id'=>35425,'limit'=>1)); $o['pastaba']=$nt?mb_substr($nt[0]->content,0,200):null;
    // skydelis po
    $n=wp_create_nonce('ps_dl_zurnalas'); $r3=wp_remote_get(admin_url('admin-ajax.php?action=ps_dl_skydelis&id=35425&n='.$n),array('cookies'=>$cs,'timeout'=>60,'sslverify'=>false)); $d=(json_decode((string)wp_remote_retrieve_body($r3),true)['data']??array()); $o['sk_po']=array('kl'=>$d['klausimas']??null,'kur'=>$d['kur']??null);
    // pakartotinai
    if($url){ $r4=wp_remote_get($url,array('cookies'=>$cs,'timeout'=>60,'sslverify'=>false,'redirection'=>0)); $o['grazinta_2']=array('code'=>wp_remote_retrieve_response_code($r4),'loc'=>urldecode((string)wp_remote_retrieve_header($r4,'location'))); }
    $o['laiskai']=count((array)get_option('ps_e5_mail',array())); delete_option('ps_e5_mail'); $o['dev_pastas_po']=count((array)get_option('ps_dev_pastas_zurnalas',array()));
    $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=1");
    wp_set_current_user(0);
    // Playwright — skydelis su forma (palaukiam #skEil)
    $exp2=time()+1800; $tok2=WP_Session_Tokens::get_instance($uid)->create($exp2);
    $o['cookies']=array(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp2,'secure_auth',$tok2)),array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp2,'auth',$tok2)),array('name'=>LOGGED_IN_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp2,'logged_in',$tok2)));
    $evs="(async function(){ function q(s){return document.querySelector(s);} var r=q('tr.eil[data-id=\"35414\"]'); if(r) r.click(); for(var i=0;i<40;i++){ if(document.querySelector('#skEil .eilute')) break; await new Promise(function(x){setTimeout(x,250);}); } var a=q('a.dl-kk'); if(a){ a.click(); await new Promise(function(x){setTimeout(x,300);}); } return {eil:[...document.querySelectorAll('#skEil .eilute')].map(function(x){return x.innerText.replace(/\\s+/g,' ').slice(0,120);}),kk:document.querySelectorAll('a.dl-kk').length,forma:!!document.querySelector('.dl-kk-f'),laukai:[...document.querySelectorAll('.dl-kk-f input:not([type=hidden]),.dl-kk-f button,.dl-kk-f a')].map(function(x){return (x.name||x.className)+'='+((x.value||x.innerText||'')+'').slice(0,24)+(x.disabled?'(off)':'');}),klaus:(q('#skKlaus')||{innerText:''}).innerText,kur:(q('.dl-kur')||{innerText:''}).innerText}; })()";
    $o['shots']=array(array('n'=>'s1616_e5_skydelis_35414_forma','u'=>admin_url('admin.php?page=ps-desk&eile=visi&q=35414'),'w'=>1400,'eval'=>$evs));
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $J($o);
},99);
