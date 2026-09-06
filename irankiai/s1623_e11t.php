<?php
/** TEMP PS S1623 run e11t — v3.38 / juosta v1.8 / tiekimas v1.10 patikra: T — tuščia ZB kortelė (`tiek=zb`), AJAX rinkiklis (Josera, išparduota, paieška), „Pridėti pažymėtas“ (2 prekės), eilutės kiekis/išėmimas, „Užsakyti iš VF“ be dropship (savas laiškas), Laukiam „Gauta“ su savikaina → `ps_partijos`, archyvas `view=laiskai`, juosta be Tiekimas/Laiškai. K — kadrai (rinkiklis atidarytas su Josera). */
add_action('init', function(){
  if (!isset($_GET['ps_e11'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e11'])); $o=array('v'=>'S1623 e11t','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
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
    $r=$G(admin_url('admin.php?page=ps-desk&eile=laiskai&tiek=zb'),120); $h=(string)wp_remote_retrieve_body($r); $o['zb']=array('code'=>wp_remote_retrieve_response_code($r),'h2'=>array_map('wp_strip_all_tags',preg_match_all('/<h2>.*?<\/h2>/su',substr($h,strpos($h,'dl-main')),$m2)?$m2[0]:array()),'tiek_mygtukai'=>preg_match('/<div class="dl-ats-tiek">(.*?)<\/div>/su',$h,$mt)?trim(preg_replace('/\s+/',' ',wp_strip_all_tags($mt[1]))):'','warning'=>substr_count($h,'<b>Warning</b>'),'juosta_tiekimas'=>substr_count($h,'page=ps-tiekimas'),'juosta_laiskai'=>substr_count($h,'page=ps-laiskai'),'arch_nuoroda'=>(int)preg_match('/view=laiskai/',$h),'rink'=>substr_count($h,'class="dl-rink"'));
    $jos=(int)$wpdb->get_var("SELECT t.term_id FROM {$p}terms t JOIN {$p}term_taxonomy tt ON tt.term_id=t.term_id AND tt.taxonomy='product_brand' WHERE t.name='Josera'"); $o['josera_term']=$jos;
    $aj=function($q) use($G,$n){ $r=$G(admin_url('admin-ajax.php?action=ps_dl_atsargos&n='.$n.'&'.$q),60); $j=json_decode((string)wp_remote_retrieve_body($r),true); $d=$j['data']??null; return array('n'=>is_array($d)?count($d):'?','pvz'=>is_array($d)?array_slice(array_map(function($x){return $x['n'].' | sku '.$x['sku'].' | av '.$x['av'].' | tiek '.$x['tiek'].' | sav '.$x['sav'].' | '.$x['pask'];},$d),0,3):mb_substr((string)wp_remote_retrieve_body($r),0,200)); };
    $o['ajax_josera']=$aj('src=vf&zenklas='.$jos); $o['ajax_isparduota_vf']=$aj('src=vf&isparduota=1'); $o['ajax_q']=$aj('src=vf&q=festival'); $o['ajax_zb_isp']=$aj('src=zb&isparduota=1');
    // pridėti 2 prekes į VF
    $r=$G(admin_url('admin.php?page=ps-desk&eile=laiskai&tiek=vf'),120); $h=(string)wp_remote_retrieve_body($r); $nn=$nonce($h,'vf'); $o['nonce_vf']=$nn?'yra':'NĖRA';
    $o['prideti']=$post(array('action'=>'ps_dl_tiekimas','_wpnonce'=>$nn,'tiekejas'=>'vf','partija'=>'0','ka'=>'prideti','prekes'=>array('18154'=>'2','25415'=>'1'),'ps_dl_g'=>admin_url('admin.php?page=ps-desk&eile=laiskai')));
    wp_cache_flush(); $pr=$part(); $o['partija1']=$pr; $eid=array(); foreach((array)($pr['eil']??array()) as $e){ $eid[(int)$e['product_id']]=(int)$e['id']; }
    $r=$G(admin_url('admin.php?page=ps-desk&eile=laiskai'),120); $h=(string)wp_remote_retrieve_body($r); $o['kortele_eil']=array('eil_formos'=>substr_count($h,'class="dl-eil-f"'),'qty_inputs'=>preg_match_all('/class="dl-eil-q"[^>]*/',$h,$mq)?$mq[0]:array(),'btn'=>array_map('wp_strip_all_tags',preg_match_all('/<button[^>]*type="submit"[^>]*>.*?<\/button>/su',$h,$m4)?$m4[0]:array()));
    $o['kiekis']=$post(array('action'=>'ps_dl_tiekimas','_wpnonce'=>$nn,'tiekejas'=>'vf','partija'=>'0','ka'=>'eilute','eid'=>(string)($eid[18154]??0),'qty'=>'3','ps_dl_g'=>admin_url('admin.php?page=ps-desk&eile=laiskai')));
    $o['isimti']=$post(array('action'=>'ps_dl_tiekimas','_wpnonce'=>$nn,'tiekejas'=>'vf','partija'=>'0','ka'=>'eilute','eid'=>(string)($eid[25415]??0),'trinti'=>'1','ps_dl_g'=>admin_url('admin.php?page=ps-desk&eile=laiskai')));
    wp_cache_flush(); $o['partija2']=$part();
    // užsakyti be dropship → savas laiškas
    $r=$G(admin_url('admin.php?page=ps-desk&eile=laiskai'),120); $h=(string)wp_remote_retrieve_body($r); preg_match('/<form[^>]*id="dlf_vf"[^>]*>(.*?)<\/form>/su',$h,$fm); preg_match('/name="_wpnonce"[^>]*value="([^"]+)"/',$fm[1]??'',$n2);
    $o['uzsakyti']=$post(array('action'=>'ps_dl_uzsakyti','_wpnonce'=>$n2[1]??'','tiekejas'=>'vf','uzsakymai'=>'','ids_av'=>'','ps_dl_g'=>admin_url('admin.php?page=ps-desk&eile=laiskai'),'laisk_zyme'=>'1','laisk_man'=>'1','pristatymas'=>'tiekejas','svoris'=>'','dezes'=>'1'));
    wp_cache_flush(); $pr=$part(); $o['partija3']=array('id'=>$pr['id'],'busena'=>$pr['busena']); $pid=(int)$pr['id'];
    // Laukiam: Gauta su savikaina
    $r=$G(admin_url('admin.php?page=ps-desk&eile=laukiam'),120); $h=(string)wp_remote_retrieve_body($r); $gf=null; if(preg_match_all('/<form[^>]*class="dl-tk-f"[^>]*>(.*?)<\/form>/su',$h,$gfs)){ foreach($gfs[1] as $x){ if(strpos($x,'name="partija" value="'.$pid.'"')!==false){ $gf=$x; break; } } }
    if(!$gf){ $o['STOP']='Laukiam be #'.$pid; $J($o); }
    preg_match('/name="_wpnonce"[^>]*value="([^"]+)"/',$gf,$n3); preg_match_all('/name="gauta\[(\d+)\]"[^>]*value="(\d+)"/',$gf,$gg,PREG_SET_ORDER); preg_match_all('/name="savikaina\[(\d+)\]"[^>]*value="([^"]*)"/',$gf,$ss,PREG_SET_ORDER);
    $o['gauta_forma']=array('gauta'=>count($gg),'savikaina_laukai'=>array_map(function($x){return $x[1].'='.$x[2];},$ss));
    $pav_pries=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_partijos"); $av_pries=Petshop_AV_Stock::qty(18154);
    $gb=array('action'=>'ps_dl_tiekimas','_wpnonce'=>$n3[1]??'','tiekejas'=>'vf','partija'=>(string)$pid,'ka'=>'priimti','ps_dl_g'=>admin_url('admin.php?page=ps-desk&eile=laukiam')); foreach($gg as $x){ $gb['gauta['.$x[1].']']=$x[2]; $gb['savikaina['.$x[1].']']='31.50'; $gb['galioja['.$x[1].']']='2027-06'; }
    $o['gauta']=$post($gb); wp_cache_flush();
    $o['partijos_po']=$wpdb->get_results("SELECT id,product_id,gauta,kiekis_gautas,kiekis_liko,savikaina_eur,geriausia_iki,tiekejas,tiekimas_id,LEFT(pastaba,50) pastaba FROM {$p}ps_partijos ORDER BY id DESC LIMIT 2",ARRAY_A); $o['ps_partijos_n']=array($pav_pries,(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_partijos"));
    $o['av_18154']=array($av_pries,Petshop_AV_Stock::qty(18154)); $o['cost_price_18154']=get_post_meta(18154,'_cost_price',true); $o['partija4']=array_intersect_key($part(),array('id'=>1,'busena'=>1,'gauta'=>1));
    $o['nurasymas_dry']=class_exists('Petshop_Partijos')?Petshop_Partijos::nurasyti(18154,1,true):null;
    $r=$G(admin_url('admin.php?page=ps-desk&view=laiskai'),120); $h=(string)wp_remote_retrieve_body($r); $o['archyvas']=array('code'=>wp_remote_retrieve_response_code($r),'h2'=>wp_strip_all_tags(preg_match('/<h2>.*?<\/h2>/su',substr($h,strpos($h,'dl-main')),$m5)?$m5[0]:''),'eil'=>substr_count($h,'dl-arch-atv'),'warning'=>substr_count($h,'<b>Warning</b>'));
    $z=(array)get_option('ps_dev_pastas_zurnalas',array()); $o['dev_pastas_pask']=array_map(function($e){return mb_substr($e['tema']??'',0,70);},array_slice($z,-2));
    $J($o);
  }
  if($f==='K'){ $jos=(int)$wpdb->get_var("SELECT t.term_id FROM {$p}terms t JOIN {$p}term_taxonomy tt ON tt.term_id=t.term_id AND tt.taxonomy='product_brand' WHERE t.name='Josera'"); $ck=array(); foreach($cs as $c){ $ck[]=array('name'=>$c->name,'value'=>$c->value); }
    $o['cookies']=$ck; $o['shots']=array(
      array('n'=>'s1623_e11_rinkiklis_josera','u'=>admin_url('admin.php?page=ps-desk&eile=laiskai&tiek=vf'),'w'=>1440,'h'=>1300,'click'=>'.dl-rink[data-src="vf"] .dl-rink-atv','eval'=>"(async()=>{var s=document.querySelector('.dl-rink[data-src=\"vf\"] .dl-rink-z'); s.value='".$jos."'; s.dispatchEvent(new Event('change',{bubbles:true})); await new Promise(r=>setTimeout(r,3500)); var q=document.querySelector('.dl-rink[data-src=\"vf\"] .dl-rink-q'); q.value='festival'; q.dispatchEvent(new Event('input',{bubbles:true})); await new Promise(r=>setTimeout(r,2500)); var cb=document.querySelectorAll('.dl-rink[data-src=\"vf\"] .dl-rink-cb'); if(cb.length){ cb[0].click(); } return document.querySelectorAll('.dl-rink[data-src=\"vf\"] .dl-rink-lent tr').length; })()"),
      array('n'=>'s1623_e11_laukiam_savikaina','u'=>admin_url('admin.php?page=ps-desk&eile=laukiam'),'w'=>1440,'h'=>700),
      array('n'=>'s1623_e11_archyvas','u'=>admin_url('admin.php?page=ps-desk&view=laiskai'),'w'=>1440,'h'=>900,'click'=>'.dl-arch-atv'));
    $J($o); }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
