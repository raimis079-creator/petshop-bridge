<?php
/** TEMP PS S1609 run e5t — #5 sekimo laiškas po kiekvienos siuntos: testai darbuotojo paskyra per realius endpoint'us + laiškų gaudyklė */
add_filter('pre_wp_mail', function($r,$a){ $l=(array)get_option('ps_e5_mail',array()); $l[]=array('t'=>current_time('H:i:s'),'kam'=>is_array($a['to'])?implode(',',$a['to']):$a['to'],'tema'=>$a['subject'],'html'=>$a['message'],'txt'=>mb_substr(trim(preg_replace('/\s+/',' ',wp_strip_all_tags($a['message']))),0,900)); update_option('ps_e5_mail',array_slice($l,-12),false); return true; },4,2);
add_action('init', function(){
  if (!isset($_GET['ps_e5t'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e5t'])); $o=array('v'=>'run e5t','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  if($f==='H'){ $l=(array)get_option('ps_e5_mail',array()); $i=(int)($_GET['i']??0); header('Content-Type: text/html; charset=utf-8'); echo isset($l[$i])?$l[$i]['html']:'<p>nėra laiško '.$i.'</p>'; exit; }
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $u=get_user_by('login','testuotojas'); $uid=$u?$u->ID:1; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp); $lc=wp_generate_auth_cookie($uid,$exp,'logged_in',$tok);
  $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>$lc)));
  $_COOKIE[LOGGED_IN_COOKIE]=$lc; wp_set_current_user($uid);
  $txt=function($b){ if(preg_match('/<main class="dl-main".*?<\/main>/s',$b,$mm)) $b=$mm[0]; elseif(preg_match('/<div id="wpbody-content".*$/s',$b,$mm)) $b=$mm[0]; $b=preg_replace('/<script.*?<\/script>|<style.*?<\/style>/s','',$b); return trim(preg_replace('/\s+/',' ',html_entity_decode(wp_strip_all_tags($b,true)))); };
  $REQ=function($url,$post=null) use($cs,$txt){ $a=array('cookies'=>$cs,'timeout'=>120,'sslverify'=>false,'redirection'=>0); if($post!==null){ $a['body']=$post; $r=wp_remote_post($url,$a);} else $r=wp_remote_get($url,$a); if(is_wp_error($r)) return array('err'=>$r->get_error_message()); $b=wp_remote_retrieve_body($r); $x=array('code'=>wp_remote_retrieve_response_code($r)); $loc=wp_remote_retrieve_header($r,'location'); if($loc){ parse_str((string)parse_url($loc,PHP_URL_QUERY),$q); $x['loc']=array_intersect_key($q,array_flip(array('page','eile','pd_ok','pd_nr','atidaryti'))); if(isset($x['loc']['pd_nr'])) $x['loc']['pd_nr']=rawurldecode($x['loc']['pd_nr']); } else { $x['txt']=mb_substr($txt($b),0,1500); } return $x; };
  $PAR=admin_url('admin.php?page=ps-desk&eile=paruosta');
  $dl=function($v,$id,$extra=array()) use($REQ,$PAR){ return $REQ(admin_url('admin-post.php').'?'.http_build_query(array_merge(array('action'=>'ps_dl_veiksmas','v'=>$v,'id'=>$id,'_wpnonce'=>wp_create_nonce('ps_dl_'.$v.'_'.$id),'g'=>$PAR),$extra))); };
  $snap=function($id) use($wpdb,$p){ wp_cache_flush(); $ord=wc_get_order($id); if(!$ord) return 'nera'; $r=new ReflectionMethod('Petshop_Darbalaukis','faktai'); $r->setAccessible(true); $fx=$r->invoke(null,$ord,array()); $e=array(); foreach($fx['eil'] as $l){ $e[]=$l['q'].'x '.mb_substr($l['n'],0,22).' ['.$l['k'].'/'.$l['src'].']'; } $d=array(); foreach($fx['dalys'] as $k=>$pp){ if($pp) $d[$k]=array('nr'=>$pp['nr'],'iss'=>$pp['issiusta']); }
    $notes=array(); foreach(wc_get_order_notes(array('order_id'=>$id,'limit'=>3)) as $n){ $notes[]=mb_substr($n->content,0,220); }
    return array('st'=>$ord->get_status(),'eiles'=>$fx['eiles'],'btn'=>$fx['btn'][0]??null,'eil'=>$e,'dalys'=>$d,'dalys_issiusta'=>$ord->get_meta('_ps_dalys_issiusta'),'sekimo_siusta'=>$ord->get_meta('_ps_sekimo_siusta'),'notes'=>$notes,'ivykiai'=>$wpdb->get_results($wpdb->prepare("SELECT laikas,veiksmas,rezultatas,kanalas,kas_vardas,pastaba FROM {$p}ps_uzsakymu_ivykiai WHERE uzsakymas=%d ORDER BY id DESC LIMIT 3",$id),ARRAY_A)); };
  $mails=function($n=3){ $l=(array)get_option('ps_e5_mail',array()); $out=array(); foreach(array_slice($l,-$n) as $i=>$m){ $out[]=array('kam'=>$m['kam'],'tema'=>$m['tema'],'txt'=>$m['txt']); } return array('viso'=>count($l),'pask'=>$out); };
  try{
   $o['versija']=Petshop_Darbalaukis::VERSIJA; $o['md5']=md5_file(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php');
   if($f==='P'){ // #35421: Prins išsiuntė → „Išsiųsta 1 iš 2“
    update_option('ps_e5_mail',array(),false);
    $o['pries']=$snap(35421); $o['par_txt_pries']=$REQ($PAR)['txt']??null;
    $o['prins_issiunte']=$dl('issiusta',35421,array('dalis'=>'prins','sekimo'=>1));
    $o['po']=$snap(35421); $o['mail']=$mails(2);
    $o['dublis']=$dl('issiusta',35421,array('dalis'=>'prins','sekimo'=>1))['loc']??null; // antrą kartą — „jau pažymėta“
    $o['mail_po_dublio']=$mails(1)['viso'];
   }
   if($f==='V'){ // #35440: viena AV siunta (3 dėžės) → „Užsakymas išsiųstas“ + completed
    $o['pries']=$snap(35440);
    $o['kurjeris_paeme']=$dl('issiusta',35440,array('dalis'=>'av','sekimo'=>1));
    $o['po']=$snap(35440); $o['mail']=$mails(1);
   }
   if($f==='N'){ // naujas: VF + Prins dropship (be Venipak) — nuo atėjimo iki įvykdyto
    $prins=0; foreach(wc_get_order(35421)->get_items() as $it){ if('prins'===(string)$it->get_meta('_ps_source')){ $prins=(int)$it->get_product_id(); break; } } $o['prins_pid']=$prins;
    $ord=wc_create_order(array('customer_id'=>0,'created_via'=>'checkout'));
    $adr=array('first_name'=>'AUDITAS','last_name'=>'Testas 32','email'=>'terra@petshop.lt','phone'=>'+37060000000','address_1'=>'Testų g. 32','city'=>'Vilnius','postcode'=>'01100','country'=>'LT');
    $ord->set_address($adr,'billing'); unset($adr['email'],$adr['phone']); $ord->set_address($adr,'shipping');
    foreach(array(35357,$prins) as $pid){ if($pid) $ord->add_product(wc_get_product($pid),1); }
    $sh=new WC_Order_Item_Shipping(); $sh->set_method_id('shopup_venipak_shipping_courier_method'); $sh->set_instance_id(2); $sh->set_method_title('VENIPAK Kurjeris'); $sh->set_total(3.49); $ord->add_item($sh);
    $ord->set_payment_method('bacs'); $ord->set_payment_method_title('Banko pavedimas'); $ord->calculate_totals(); $ord->save();
    $oid=$ord->get_id(); update_option('ps_e5_oid',$oid,false); $ord->payment_complete('AUDITAS-T32'); $o['oid']=$oid; $o['po_apmok']=$snap($oid);
    $ord=wc_get_order($oid); foreach($ord->get_items() as $iid=>$it){ $s=(string)$it->get_meta('_ps_source'); if($s&&$s!=='av'){ $o['kelias_'.$s]=$dl('kelias',$oid,array('iid'=>$iid,'k'=>'tiesiai'))['loc']??null; } }
    $o['rusiuoti']=$dl('rusiuoti',$oid)['loc']??null; $o['po_rus']=$snap($oid);
   }
   $oid=(int)get_option('ps_e5_oid'); $o['oid']=$oid;
   if($f==='U'){ // Užsakyti be lipdukų iš VF ir Prins (laiškas tik man)
    foreach(array('vf','prins') as $src){ $o['uzs_'.$src]=$REQ(admin_url('admin-post.php'),array('action'=>'ps_dropship_send','tiekejas'=>$src,'uzsakymai'=>$oid,'_wpnonce'=>wp_create_nonce('ps_dropship_send'),'ps_dl_g'=>$PAR,'laisk_zyme'=>1,'be_lipduku'=>1,'laisk_man'=>1)); }
    $o['po']=$snap($oid); $o['mail']=$mails(2); $o['par_txt']=$REQ($PAR)['txt']??null;
   }
   if($f==='I'){ // VF išsiuntė → 1 iš 2 (be numerio); Prins išsiuntė → 2 iš 2 + įvykdytas
    $o['vf_issiunte']=$dl('issiusta',$oid,array('dalis'=>'vf','sekimo'=>1)); $o['po_vf']=$snap($oid); $o['mail_vf']=$mails(1);
    $o['prins_issiunte']=$dl('issiusta',$oid,array('dalis'=>'prins','sekimo'=>1)); $o['po_prins']=$snap($oid); $o['mail_prins']=$mails(1);
    $o['par_txt']=$REQ($PAR)['txt']??null;
    $o['dev_pastas']=count((array)get_option('ps_dev_pastas_zurnalas',array()));
    $l=(array)get_option('ps_e5_mail',array()); $o['mail_viso']=count($l); $o['mail_temos']=array_map(function($m){return $m['tema'];},$l);
    $B=admin_url('admin.php?page=ps-desk'); $o['cookies']=array(); foreach($cs as $c){ $o['cookies'][]=array('name'=>$c->name,'value'=>$c->value); }
    $sh=array(); foreach($l as $i=>$m){ if(strpos($m['tema'],'užsakymas')!==false||strpos($m['tema'],'Užsakymas')!==false) $sh[]=array('n'=>'e5_laiskas_'.$i,'u'=>home_url('/?ps_e5t=H&i='.$i),'w'=>760,'h'=>1000,'full'=>true); }
    $sh[]=array('n'=>'e5_paruosta','u'=>$B.'&eile=paruosta','full'=>true,'eval'=>"({pastaba:[...document.querySelectorAll('.pastaba')].map(x=>x.innerText),btn:[...document.querySelectorAll('td.d a.v')].map(x=>x.innerText.trim()).filter(Boolean)})");
    $sh[]=array('n'=>'e5_dialogas','u'=>$B.'&eile=paruosta','click'=>'tr.eil[data-id="35418"] td.d a.v.p','eval'=>"({dlg:(document.querySelector('.dl-dlg.on')||{}).innerText,opt:(document.querySelector('#dlDlgOpt')||{}).checked,href:(document.querySelector('.dl-dlg.on a.v.p')||{}).href})");
    $sh[]=array('n'=>'e5_visi','u'=>$B.'&eile=visi','eval'=>"({eil:[...document.querySelectorAll('tr.eil')].slice(0,6).map(x=>x.innerText.replace(/\\s+/g,' ').slice(0,160))})");
    $sh[]=array('n'=>'e5_istorija','u'=>$B.'&eile=visi&atidaryti='.$oid,'eval'=>"new Promise(function(r){setTimeout(function(){r({kur:(document.querySelector('.dl-kur')||{}).textContent,zing:[...document.querySelectorAll('#skEil .zingsneliai')].map(x=>x.innerText.replace(/\\s+/g,' '))})},1500)})");
    $o['shots']=$sh;
   }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
