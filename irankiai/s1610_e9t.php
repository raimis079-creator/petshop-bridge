<?php
/** TEMP PS S1610 run e9t — #5b testai: A registruotas (5787) + B svečias, VF+Prins be lipdukų; laiškas be juostos su/be paskyros nuorodos; paskyros blokas „Siuntos“ kaip klientas 5787 (Playwright) */
add_filter('pre_wp_mail', function($r,$a){ $l=(array)get_option('ps_e9_mail',array()); $l[]=array('t'=>current_time('H:i:s'),'kam'=>is_array($a['to'])?implode(',',$a['to']):$a['to'],'tema'=>$a['subject'],'html'=>$a['message'],'txt'=>mb_substr(trim(preg_replace('/\s+/',' ',wp_strip_all_tags($a['message']))),0,900)); update_option('ps_e9_mail',array_slice($l,-16),false); return true; },4,2);
add_action('init', function(){
  if (!isset($_GET['ps_e9t'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e9t'])); $o=array('v'=>'run e9t','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  if($f==='H'){ $l=(array)get_option('ps_e9_mail',array()); $i=(int)($_GET['i']??0); header('Content-Type: text/html; charset=utf-8'); echo isset($l[$i])?$l[$i]['html']:'<p>nėra laiško '.$i.'</p>'; exit; }
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $u=get_user_by('login','testuotojas'); $uid=$u?$u->ID:1; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp); $lc=wp_generate_auth_cookie($uid,$exp,'logged_in',$tok);
  $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>$lc)));
  $_COOKIE[LOGGED_IN_COOKIE]=$lc; wp_set_current_user($uid);
  $txt=function($b){ if(preg_match('/<main class="dl-main".*?<\/main>/s',$b,$mm)) $b=$mm[0]; elseif(preg_match('/<div id="wpbody-content".*$/s',$b,$mm)) $b=$mm[0]; $b=preg_replace('/<script.*?<\/script>|<style.*?<\/style>/s','',$b); return trim(preg_replace('/\s+/',' ',html_entity_decode(wp_strip_all_tags($b,true)))); };
  $REQ=function($url,$post=null) use($cs,$txt){ $a=array('cookies'=>$cs,'timeout'=>120,'sslverify'=>false,'redirection'=>0); if($post!==null){ $a['body']=$post; $r=wp_remote_post($url,$a);} else $r=wp_remote_get($url,$a); if(is_wp_error($r)) return array('err'=>$r->get_error_message()); $b=wp_remote_retrieve_body($r); $x=array('code'=>wp_remote_retrieve_response_code($r)); $loc=wp_remote_retrieve_header($r,'location'); if($loc){ parse_str((string)parse_url($loc,PHP_URL_QUERY),$q); $x['loc']=array_intersect_key($q,array_flip(array('page','eile','pd_ok','pd_nr','atidaryti'))); if(isset($x['loc']['pd_nr'])) $x['loc']['pd_nr']=rawurldecode($x['loc']['pd_nr']); } else { $x['txt']=mb_substr($txt($b),0,1500); } return $x; };
  $PAR=admin_url('admin.php?page=ps-desk&eile=paruosta');
  $dl=function($v,$id,$extra=array()) use($REQ,$PAR){ return $REQ(admin_url('admin-post.php').'?'.http_build_query(array_merge(array('action'=>'ps_dl_veiksmas','v'=>$v,'id'=>$id,'_wpnonce'=>wp_create_nonce('ps_dl_'.$v.'_'.$id),'g'=>$PAR),$extra))); };
  $snap=function($id) use($wpdb,$p){ wp_cache_flush(); $ord=wc_get_order($id); if(!$ord) return 'nera'; $r=new ReflectionMethod('Petshop_Darbalaukis','faktai'); $r->setAccessible(true); $fx=$r->invoke(null,$ord,array()); $e=array(); foreach($fx['eil'] as $l){ $e[]=$l['q'].'x '.mb_substr($l['n'],0,22).' ['.$l['k'].'/'.$l['src'].']'; }
    $ks=array_map(function($x){ return $x['n'].'/'.$x['viso'].' '.$x['dalis'].' '.$x['busena'].' '.implode(',',$x['numeriai']).' ['.count($x['prekes']).' prek.]'; },Petshop_Darbalaukis::kliento_siuntos($ord));
    $notes=array(); foreach(wc_get_order_notes(array('order_id'=>$id,'limit'=>3)) as $n){ $notes[]=mb_substr($n->content,0,200); }
    return array('st'=>$ord->get_status(),'cust'=>$ord->get_customer_id(),'eiles'=>$fx['eiles'],'btn'=>$fx['btn'][0]??null,'eil'=>$e,'kliento_siuntos'=>$ks,'dalys_issiusta'=>$ord->get_meta('_ps_dalys_issiusta'),'notes'=>$notes); };
  $mails=function($n=3){ $l=(array)get_option('ps_e9_mail',array()); $out=array(); foreach(array_slice($l,-$n) as $m){ $out[]=array('kam'=>$m['kam'],'tema'=>$m['tema'],'txt'=>$m['txt'],'juosta'=>strpos($m['html'],'Pas kurjerį')!==false,'paskyra'=>preg_match('#/paskyra/uzsakymas/\d+/#',$m['html'])?1:0,'sekti'=>strpos($m['html'],'Sekti siuntą')!==false); } return array('viso'=>count($l),'pask'=>$out); };
  $naujas=function($cust,$em,$vardas,$pav,$prins) use($snap,$dl){
    $ord=wc_create_order(array('customer_id'=>$cust,'created_via'=>'checkout'));
    $adr=array('first_name'=>$vardas,'last_name'=>$pav,'email'=>$em,'phone'=>'+37060000000','address_1'=>'Testų g. 33','city'=>'Vilnius','postcode'=>'01100','country'=>'LT');
    $ord->set_address($adr,'billing'); unset($adr['email'],$adr['phone']); $ord->set_address($adr,'shipping');
    foreach(array(35357,$prins) as $pid){ if($pid) $ord->add_product(wc_get_product($pid),1); }
    $sh=new WC_Order_Item_Shipping(); $sh->set_method_id('shopup_venipak_shipping_courier_method'); $sh->set_instance_id(2); $sh->set_method_title('VENIPAK Kurjeris'); $sh->set_total(3.49); $ord->add_item($sh);
    $ord->set_payment_method('bacs'); $ord->set_payment_method_title('Banko pavedimas'); $ord->calculate_totals(); $ord->save();
    $oid=$ord->get_id(); $ord->payment_complete('AUDITAS-T34'); $x=array('oid'=>$oid,'po_apmok'=>$snap($oid));
    $ord=wc_get_order($oid); foreach($ord->get_items() as $iid=>$it){ $s=(string)$it->get_meta('_ps_source'); if($s&&$s!=='av'){ $x['kelias_'.$s]=$dl('kelias',$oid,array('iid'=>$iid,'k'=>'tiesiai'))['loc']??null; } }
    $x['rusiuoti']=$dl('rusiuoti',$oid)['loc']??null; $x['po_rus']=$snap($oid); return $x; };
  try{
   $o['versija']=Petshop_Darbalaukis::VERSIJA; $o['md5']=md5_file(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php');
   $ids=(array)get_option('ps_e9_oids',array()); $A=(int)($ids['A']??0); $B=(int)($ids['B']??0);
   if($f==='N'){ // du nauji: A registruotas 5787, B svečias
    update_option('ps_e9_mail',array(),false);
    $prins=0; foreach(wc_get_order(35421)->get_items() as $it){ if('prins'===(string)$it->get_meta('_ps_source')){ $prins=(int)$it->get_product_id(); break; } } $o['prins_pid']=$prins;
    $o['A']=$naujas(5787,'s1609.klientas@avesa.lt','Testas','Klientas',$prins); $o['B']=$naujas(0,'terra@petshop.lt','AUDITAS','Testas 34',$prins);
    update_option('ps_e9_oids',array('A'=>$o['A']['oid'],'B'=>$o['B']['oid']),false); $o['mail']=$mails(4);
   }
   if($f==='U'){ // Užsakyti be lipdukų iš VF ir Prins (abiem)
    foreach(array($A,$B) as $oid){ foreach(array('vf','prins') as $src){ $o['uzs_'.$oid.'_'.$src]=$REQ(admin_url('admin-post.php'),array('action'=>'ps_dropship_send','tiekejas'=>$src,'uzsakymai'=>$oid,'_wpnonce'=>wp_create_nonce('ps_dropship_send'),'ps_dl_g'=>$PAR,'laisk_zyme'=>1,'be_lipduku'=>1,'laisk_man'=>1))['loc']??null; } $o['po_'.$oid]=$snap($oid); }
    $o['mail']=$mails(4); $o['par_txt']=$REQ($PAR)['txt']??null;
   }
   if($f==='I'){ // A: VF išsiuntė (1/2, su paskyros nuoroda); B: VF išsiuntė (1/2 be nuorodos) + Prins išsiuntė (2/2, įvykdytas)
    $o['A_vf']=$dl('issiusta',$A,array('dalis'=>'vf','sekimo'=>1))['loc']??null; $o['A_po']=$snap($A); $o['A_mail']=$mails(1);
    $o['B_vf']=$dl('issiusta',$B,array('dalis'=>'vf','sekimo'=>1))['loc']??null; $o['B_mail_vf']=$mails(1);
    $o['B_prins']=$dl('issiusta',$B,array('dalis'=>'prins','sekimo'=>1))['loc']??null; $o['B_po']=$snap($B); $o['B_mail_prins']=$mails(1);
    $o['dev_pastas']=count((array)get_option('ps_dev_pastas_zurnalas',array())); $l=(array)get_option('ps_e9_mail',array()); $o['mail_viso']=count($l); $o['mail_temos']=array_map(function($m){return $m['kam'].' | '.$m['tema'];},$l);
    // Playwright kaip KLIENTAS 5787
    $cu=5787; $cexp=time()+1800; $ct=WP_Session_Tokens::get_instance($cu)->create($cexp); $o['cookies']=array(); foreach(array(array(SECURE_AUTH_COOKIE,'secure_auth'),array(AUTH_COOKIE,'auth'),array(LOGGED_IN_COOKIE,'logged_in')) as $c){ $o['cookies'][]=array('name'=>$c[0],'value'=>wp_generate_auth_cookie($cu,$cexp,$c[1],$ct)); }
    $vo=wc_get_endpoint_url('view-order',$A,wc_get_page_permalink('myaccount')); $ev="({siuntos:[...document.querySelectorAll('.ps-siunta')].map(x=>x.innerText.replace(/\\s+/g,' ').trim()),sekti:[...document.querySelectorAll('.ps-siunta__sekti')].map(a=>a.href),eile:[...document.querySelectorAll('.woocommerce-MyAccount-content section, .woocommerce-MyAccount-content h2')].map(x=>x.tagName+':'+(x.className||'')+':'+x.innerText.slice(0,30)).slice(0,6)})";
    $sh=array(); foreach($l as $i=>$m){ if(stripos($m['tema'],'užsakymas')!==false&&stripos($m['tema'],'išsiųst')!==false) $sh[]=array('n'=>'e9_laiskas_'.$i,'u'=>home_url('/?ps_e9t=H&i='.$i),'w'=>760,'h'=>1000,'full'=>true); }
    $sh[]=array('n'=>'e9_paskyra_A','u'=>$vo,'full'=>true,'eval'=>$ev);
    $sh[]=array('n'=>'e9_paskyra_A_mob','u'=>$vo,'w'=>390,'h'=>900,'full'=>true,'eval'=>$ev);
    $sh[]=array('n'=>'e9_paskyra_35421','u'=>wc_get_endpoint_url('view-order',35421,wc_get_page_permalink('myaccount')),'full'=>true,'eval'=>$ev);
    $sh[]=array('n'=>'e9_paskyra_35440_mob','u'=>wc_get_endpoint_url('view-order',35440,wc_get_page_permalink('myaccount')),'w'=>390,'h'=>900,'full'=>true,'eval'=>$ev);
    $sh[]=array('n'=>'e9_uzsakymai','u'=>wc_get_endpoint_url('orders','',wc_get_page_permalink('myaccount')),'full'=>true,'eval'=>"({tekstas:(document.querySelector('.woocommerce-MyAccount-content')||document.body).innerText.replace(/\\s+/g,' ').slice(0,600)})");
    $o['shots']=$sh;
   }
   if($f==='Z'){ // A: Prins išsiuntė → 2/2, įvykdytas; paskyra abi išsiųstos
    $o['A_prins']=$dl('issiusta',$A,array('dalis'=>'prins','sekimo'=>1))['loc']??null; $o['A_po']=$snap($A); $o['A_mail']=$mails(1);
    $o['A_dublis']=$dl('issiusta',$A,array('dalis'=>'prins','sekimo'=>1))['loc']??null; $o['mail_viso_po_dublio']=$mails(1)['viso'];
    $l=(array)get_option('ps_e9_mail',array()); $o['mail_temos']=array_map(function($m){return $m['kam'].' | '.$m['tema'];},$l);
    $cu=5787; $cexp=time()+1800; $ct=WP_Session_Tokens::get_instance($cu)->create($cexp); $o['cookies']=array(); foreach(array(array(SECURE_AUTH_COOKIE,'secure_auth'),array(AUTH_COOKIE,'auth'),array(LOGGED_IN_COOKIE,'logged_in')) as $c){ $o['cookies'][]=array('name'=>$c[0],'value'=>wp_generate_auth_cookie($cu,$cexp,$c[1],$ct)); }
    $vo=wc_get_endpoint_url('view-order',$A,wc_get_page_permalink('myaccount')); $ev="({siuntos:[...document.querySelectorAll('.ps-siunta')].map(x=>x.innerText.replace(/\\s+/g,' ').trim())})";
    $sh=array(); $n=count($l); if($n) $sh[]=array('n'=>'e9_laiskas_A_2is2','u'=>home_url('/?ps_e9t=H&i='.($n-1)),'w'=>760,'h'=>1000,'full'=>true);
    $sh[]=array('n'=>'e9_paskyra_A_ivykdytas','u'=>$vo,'full'=>true,'eval'=>$ev); $sh[]=array('n'=>'e9_paskyra_A_ivykdytas_mob','u'=>$vo,'w'=>390,'h'=>900,'full'=>true,'eval'=>$ev);
    $o['shots']=$sh;
   }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
