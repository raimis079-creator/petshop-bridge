<?php
/** TEMP PS S1624 run e14t — prierašo patikra: T — VF kortelė: pridėti 25415×1 → „Užsakyti iš VF“ be dropship su prierašu → archyvo laiške prierašas (variklio savas laiškas v1.10.1); ZB kortelė — prierašas be laiško (rankinis). K — kadras: kortelė su prierašu ir atidaryta peržiūra. */
add_action('init', function(){
  if (!isset($_GET['ps_e14'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e14'])); $o=array('v'=>'S1624 e14t','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp); $li=wp_generate_auth_cookie($uid,$exp,'logged_in',$tok);
  $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>$li)));
  $G=function($u,$t=90) use($cs){ return wp_remote_get(html_entity_decode($u,ENT_QUOTES),array('cookies'=>$cs,'timeout'=>$t,'sslverify'=>false,'redirection'=>0)); };
  $post=function($body) use($cs){ $r=wp_remote_post(admin_url('admin-post.php'),array('cookies'=>$cs,'timeout'=>150,'sslverify'=>false,'redirection'=>0,'body'=>$body)); $loc=(string)wp_remote_retrieve_header($r,'location'); parse_str((string)parse_url($loc,PHP_URL_QUERY),$q2); return array('code'=>wp_remote_retrieve_response_code($r),'pd_ok'=>$q2['pd_ok']??null,'pd'=>mb_substr((string)($q2['pd_nr']??''),0,200)); };
  $_COOKIE[LOGGED_IN_COOKIE]=$li; wp_set_current_user($uid); $n=wp_create_nonce('ps_dl_zurnalas');
  $nonce=function($h,$src){ return preg_match('/name="_wpnonce"[^>]*value="([^"]+)"[^>]*>(?:(?!<form).)*?name="action" value="ps_dl_tiekimas"(?:(?!<form).)*?name="tiekejas" value="'.$src.'"/su',$h,$m)?$m[1]:''; };
  $part=function() use($wpdb,$p){ $pr=$wpdb->get_row("SELECT * FROM {$p}ps_tiekimas ORDER BY id DESC LIMIT 1",ARRAY_A); if($pr) $pr['eil']=$wpdb->get_results($wpdb->prepare("SELECT id,product_id,order_id,qty,qty_gauta FROM {$p}ps_tiekimas_eil WHERE partija_id=%d",$pr['id']),ARRAY_A); return $pr; };
  try{
  if($f==='T'){
    $r=$G(admin_url('admin.php?page=ps-desk&eile=laiskai&tiek=vf'),120); $h=(string)wp_remote_retrieve_body($r); $nn=$nonce($h,'vf'); $o['laukas']=array('textarea'=>(int)preg_match('/<textarea name="pastaba"/',$h),'senas_input'=>(int)preg_match('/Prierašas laiške <input/',$h),'perz_vieta'=>substr_count($h,'dl-perz-pastaba'));
    $o['prideti']=$post(array('action'=>'ps_dl_tiekimas','_wpnonce'=>$nn,'tiekejas'=>'vf','partija'=>'0','ka'=>'prideti','prekes'=>array('25415'=>'1'),'ps_dl_g'=>admin_url('admin.php?page=ps-desk&eile=laiskai')));
    $r=$G(admin_url('admin.php?page=ps-desk&eile=laiskai'),120); $h=(string)wp_remote_retrieve_body($r); preg_match('/<form[^>]*id="dlf_vf"[^>]*>(.*?)<\/form>/su',$h,$fm); preg_match('/name="_wpnonce"[^>]*value="([^"]+)"/',$fm[1]??'',$n2);
    $prier="Prašome pristatyti iki penktadienio.\nJei Festival 900 g nėra — pakeiskite 3 kg pakuote.";
    $o['uzsakyti']=$post(array('action'=>'ps_dl_uzsakyti','_wpnonce'=>$n2[1]??'','tiekejas'=>'vf','uzsakymai'=>'','ids_av'=>'','ps_dl_g'=>admin_url('admin.php?page=ps-desk&eile=laiskai'),'laisk_zyme'=>'1','laisk_man'=>'1','pristatymas'=>'tiekejas','svoris'=>'','dezes'=>'1','pastaba'=>$prier));
    wp_cache_flush(); $pr=$part(); $o['partija']=array('id'=>$pr['id'],'busena'=>$pr['busena'],'pastaba'=>$pr['pastaba']);
    $a=(array)get_option('ps_laisku_archyvas',array()); $l=$a[0]??array(); $o['laiskas']=array('laikas'=>$l['laikas']??'','tema'=>$l['tema']??'','kont'=>$l['kont']??'','prierasas_yra'=>(int)(strpos((string)($l['html']??''),'pristatyti iki penktadienio')!==false),'tekstas'=>mb_substr(trim(preg_replace('/\s+/',' ',wp_strip_all_tags(str_replace(array('</tr>','</p>'),"\n",(string)($l['html']??''))))),0,600));
    $J($o); }
  if($f==='K'){ $jos=(int)$wpdb->get_var("SELECT t.term_id FROM {$p}terms t JOIN {$p}term_taxonomy tt ON tt.term_id=t.term_id AND tt.taxonomy='product_brand' WHERE t.name='Josera'"); $ck=array(); foreach($cs as $c){ $ck[]=array('name'=>$c->name,'value'=>$c->value); }
    $o['cookies']=$ck; $o['shots']=array(
      array('n'=>'s1624_e14_prierasas','u'=>admin_url('admin.php?page=ps-desk&eile=laiskai'),'w'=>1440,'h'=>1200,'eval'=>"(async()=>{var f=document.getElementById('dlf_vf'); var t=f.querySelector('textarea[name=pastaba]'); t.value='Prašome pristatyti iki penktadienio. Jei Festival 900 g nėra — pakeiskite 3 kg pakuote.'; t.dispatchEvent(new Event('input',{bubbles:true})); f.querySelector('.dl-perz').click(); await new Promise(r=>setTimeout(r,600)); return f.querySelector('.dl-perz-pastaba').textContent.length; })()"),
      array('n'=>'s1623_e11_rinkiklis_josera','u'=>admin_url('admin.php?page=ps-desk&eile=laiskai&tiek=vf'),'w'=>1440,'h'=>1300,'click'=>'.dl-rink[data-src="vf"] .dl-rink-atv','eval'=>"(async()=>{var s=document.querySelector('.dl-rink[data-src=\"vf\"] .dl-rink-z'); s.value='".$jos."'; s.dispatchEvent(new Event('change',{bubbles:true})); await new Promise(r=>setTimeout(r,3500)); var q=document.querySelector('.dl-rink[data-src=\"vf\"] .dl-rink-q'); q.value='festival'; q.dispatchEvent(new Event('input',{bubbles:true})); await new Promise(r=>setTimeout(r,2500)); var cb=document.querySelectorAll('.dl-rink[data-src=\"vf\"] .dl-rink-cb'); if(cb.length){ cb[0].click(); } return document.querySelectorAll('.dl-rink[data-src=\"vf\"] .dl-rink-lent tr').length; })()"),
      array('n'=>'s1623_e11_laukiam_savikaina','u'=>admin_url('admin.php?page=ps-desk&eile=laukiam'),'w'=>1440,'h'=>700),
      array('n'=>'s1623_e11_archyvas','u'=>admin_url('admin.php?page=ps-desk&view=laiskai'),'w'=>1440,'h'=>900,'click'=>'.dl-arch-atv'));
    $J($o); }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
