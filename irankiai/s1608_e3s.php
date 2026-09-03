<?php
/** TEMP PS S1608 run e3s — trijų sandėlių testas (AV+ZB+VF „viską į AV“) darbuotojo paskyra per realius endpoint'us */
add_filter('pre_wp_mail', function($r,$a){ $l=(array)get_option('ps_audit_mail',array()); $att=isset($a['attachments'])?(array)$a['attachments']:array(); $l[]=array(current_time('H:i:s'),is_array($a['to'])?implode(',',$a['to']):$a['to'],$a['subject'],count($att),mb_substr(wp_strip_all_tags($a['message']),0,160)); update_option('ps_audit_mail',array_slice($l,-60),false); return true; },10,2);
add_action('init', function(){
  if (!isset($_GET['ps_e3s'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e3s'])); $o=array('v'=>'run e3s','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $u=get_user_by('login','testuotojas'); $uid=$u?$u->ID:1; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp); $lc=wp_generate_auth_cookie($uid,$exp,'logged_in',$tok);
  $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>$lc)));
  $_COOKIE[LOGGED_IN_COOKIE]=$lc; wp_set_current_user($uid);
  $txt=function($b){ if(preg_match('/<main class="dl-main".*?<\/main>/s',$b,$mm)) $b=$mm[0]; elseif(preg_match('/<div id="wpbody-content".*$/s',$b,$mm)) $b=$mm[0]; $b=preg_replace('/<script.*?<\/script>|<style.*?<\/style>/s','',$b); return trim(preg_replace('/\s+/',' ',html_entity_decode(wp_strip_all_tags($b,true)))); };
  $REQ=function($url,$post=null) use($cs,$txt){ $a=array('cookies'=>$cs,'timeout'=>120,'sslverify'=>false,'redirection'=>0); if($post!==null){ $a['body']=$post; $r=wp_remote_post($url,$a);} else $r=wp_remote_get($url,$a); if(is_wp_error($r)) return array('err'=>$r->get_error_message()); $b=wp_remote_retrieve_body($r); $x=array('code'=>wp_remote_retrieve_response_code($r)); $loc=wp_remote_retrieve_header($r,'location'); if($loc){ parse_str((string)parse_url($loc,PHP_URL_QUERY),$q); $x['loc']=array_intersect_key($q,array_flip(array('page','eile','pd_ok','pd_nr','atidaryti'))); if(isset($x['loc']['pd_nr'])) $x['loc']['pd_nr']=rawurldecode($x['loc']['pd_nr']); } else { $x['txt']=mb_substr($txt($b),0,1400); } return $x; };
  $dl=function($v,$id,$extra=array()) use($REQ){ return $REQ(admin_url('admin-post.php').'?'.http_build_query(array_merge(array('action'=>'ps_dl_veiksmas','v'=>$v,'id'=>$id,'_wpnonce'=>wp_create_nonce('ps_dl_'.$v.'_'.$id),'g'=>admin_url('admin.php?page=ps-desk&eile=laukiam')),$extra))); };
  $tk=function($ka,$src,$pid,$extra=array()) use($REQ){ return $REQ(admin_url('admin-post.php'),array_merge(array('action'=>'ps_dl_tiekimas','ka'=>$ka,'tiekejas'=>$src,'partija'=>$pid,'_wpnonce'=>wp_create_nonce('ps_dl_tiek_'.$src.'_'.$pid),'ps_dl_g'=>admin_url('admin.php?page=ps-desk&eile=laukiam')),$extra)); };
  $snap=function($id){ wp_cache_flush(); $ord=wc_get_order($id); if(!$ord) return 'nera'; $r=new ReflectionMethod('Petshop_Darbalaukis','faktai'); $r->setAccessible(true); $fx=$r->invoke(null,$ord,array()); $e=array(); foreach($fx['eil'] as $l){ $e[]=$l['q'].'x '.mb_substr($l['n'],0,22).' ['.$l['k'].'/'.$l['src'].'] '.$l['bukle'].($l['gauta']?' gauta<'.$l['gauta']:'').' lock='.$l['lock']; } $t=array(); foreach($fx['takelis'] as $x){ $t[]=$x[1].':'.$x[2]; } return array('st'=>$ord->get_status(),'rus'=>$fx['rus'],'eiles'=>$fx['eiles'],'btn'=>$fx['btn'][0]??null,'eil'=>$e,'av'=>$fx['dalys']['av'],'takelis'=>implode(' | ',$t),'shipments'=>$ord->get_meta('_ps_shipments'),'type'=>$ord->get_meta('_ps_order_type'),'notes'=>array_map(function($n){return mb_substr(wp_strip_all_tags($n->content),0,140);},wc_get_order_notes(array('order_id'=>$id,'limit'=>4)))); };
  $partijos=function() use($wpdb,$p){ return $wpdb->get_results("SELECT p.id,p.tiekejas,p.busena,p.pristatymas,p.dezes,p.venipak_pack,(SELECT GROUP_CONCAT(CONCAT(e.id,':',e.product_id,'x',e.qty,'/',IFNULL(e.qty_gauta,'-'),'#',IFNULL(e.order_id,'ats'))) FROM {$p}ps_tiekimas_eil e WHERE e.partija_id=p.id) eil FROM {$p}ps_tiekimas p WHERE p.id>=12 ORDER BY p.id",ARRAY_A); };
  $LAUK=admin_url('admin.php?page=ps-desk&eile=laukiam');
  try{
   if($f==='S'){
    $ord=wc_create_order(array('customer_id'=>0,'created_via'=>'checkout'));
    $adr=array('first_name'=>'AUDITAS','last_name'=>'Testas 31','email'=>'terra@petshop.lt','phone'=>'+37060000000','address_1'=>'Testų g. 31','city'=>'Vilnius','postcode'=>'01100','country'=>'LT');
    $ord->set_address($adr,'billing'); unset($adr['email'],$adr['phone']); $ord->set_address($adr,'shipping');
    foreach(array(19708,33902,35357) as $pid){ $ord->add_product(wc_get_product($pid),1); }
    $sh=new WC_Order_Item_Shipping(); $sh->set_method_id('shopup_venipak_shipping_courier_method'); $sh->set_instance_id(2); $sh->set_method_title('VENIPAK Kurjeris'); $sh->set_total(3.49); $ord->add_item($sh);
    $ord->set_payment_method('bacs'); $ord->set_payment_method_title('Banko pavedimas'); $ord->calculate_totals(); $ord->save();
    $oid=$ord->get_id(); update_option('ps_e3_oid',$oid,false); update_option('ps_audit_mail',array(),false);
    $ord->payment_complete('AUDITAS-T31'); $o['oid']=$oid; $o['po_apmok']=$snap($oid);
    $o['lauk_txt']=$REQ($LAUK)['txt']??null;
   }
   $oid=(int)get_option('ps_e3_oid'); $o['oid']=$oid;
   if($f==='R'){
    $ord=wc_get_order($oid); $o['pries']=$snap($oid);
    foreach($ord->get_items() as $iid=>$it){ $s=(string)$it->get_meta('_ps_source'); if($s&&$s!=='av'){ $o['kelias_'.$s]=$dl('kelias',$oid,array('iid'=>$iid,'k'=>'i_av'))['loc']??null; } }
    $o['rusiuoti']=$dl('rusiuoti',$oid)['loc']??null; $o['po']=$snap($oid);
    $o['lauk_txt']=$REQ($LAUK)['txt']??null;
   }
   if($f==='U'){ // VF: užsakyti į AV (tiekėjas atveža — be Venipak), laiškas tik man
    $o['lauk_txt_pries']=$REQ($LAUK)['txt']??null;
    $o['uzsakyti_vf']=$tk('uzsakyti','vf',0,array('ids'=>$oid,'pristatymas'=>'tiekejas','svoris'=>'','dezes'=>1,'laisk_zyme'=>1,'laisk_man'=>1));
    $o['partijos']=$partijos(); $o['po']=$snap($oid); $o['mail']=array_slice((array)get_option('ps_audit_mail',array()),-3);
    $o['lauk_txt_po']=$REQ($LAUK)['txt']??null;
   }
   if($f==='G'){ // VF gauta
    $pv=$wpdb->get_row("SELECT * FROM {$p}ps_tiekimas WHERE tiekejas='vf' AND busena='uzsakyta' ORDER BY id DESC LIMIT 1"); $o['vf_partija']=$pv?$pv->id:null;
    if($pv){ $g=array(); foreach($wpdb->get_results($wpdb->prepare("SELECT id,qty FROM {$p}ps_tiekimas_eil WHERE partija_id=%d",$pv->id)) as $e){ $g['gauta['.$e->id.']']=$e->qty; } $o['gauta_vf']=$tk('priimti','vf',(int)$pv->id,$g); }
    $o['po']=$snap($oid); $o['partijos']=$partijos(); $o['lauk_txt']=$REQ($LAUK)['txt']??null;
   }
   if($f==='Z'){ // ZB: užsakyti (rankinis) + gauta
    $o['uzsakyti_zb']=$tk('uzsakyti','zb',0,array('ids'=>$oid,'pristatymas'=>'tiekejas','svoris'=>'','dezes'=>1));
    $o['po_uzs']=$snap($oid); $o['lauk_txt_po_uzs']=$REQ($LAUK)['txt']??null;
    $pz=$wpdb->get_row("SELECT * FROM {$p}ps_tiekimas WHERE tiekejas='zb' AND busena='uzsakyta' ORDER BY id DESC LIMIT 1"); $o['zb_partija']=$pz?$pz->id:null;
    if($pz){ $g=array(); foreach($wpdb->get_results($wpdb->prepare("SELECT id,qty FROM {$p}ps_tiekimas_eil WHERE partija_id=%d",$pz->id)) as $e){ $g['gauta['.$e->id.']']=$e->qty; } $o['gauta_zb']=$tk('priimti','zb',(int)$pz->id,$g); }
    $o['po']=$snap($oid); $o['partijos']=$partijos(); $o['lauk_txt']=$REQ($LAUK)['txt']??null;
    $lap=$REQ(admin_url('admin-post.php').'?'.http_build_query(array('action'=>'ps_desk_veiksmas','v'=>'lapai','id'=>$oid,'_wpnonce'=>wp_create_nonce('ps_desk_lapai_'.$oid),'g'=>$LAUK))); $o['lapas_txt']=isset($lap['txt'])?mb_substr($lap['txt'],0,700):$lap;
    $o['zurnalas']=$wpdb->get_results($wpdb->prepare("SELECT laikas,sritis,veiksmas,rezultatas,kanalas,kas_vardas,pastaba FROM {$p}ps_uzsakymu_ivykiai WHERE uzsakymas=%d ORDER BY id",$oid),ARRAY_A);
    $B=admin_url('admin.php?page=ps-desk'); $o['cookies']=array(); foreach($cs as $c){ $o['cookies'][]=array('name'=>$c->name,'value'=>$c->value); }
    $o['shots']=array(
      array('n'=>'e3_t2_surinkti','u'=>$B.'&eile=surinkti&atidaryti='.$oid,'eval'=>"new Promise(function(r){setTimeout(function(){r({kur:(document.querySelector('.dl-kur')||{}).textContent,zing:[...document.querySelectorAll('#skEil .zingsneliai')].map(x=>x.innerText.replace(/\\s+/g,' ')),eil:[...document.querySelectorAll('tr.eil[data-id=\"".$oid."\"] td')].map(x=>x.innerText.replace(/\\s+/g,' ')).join(' || ')})},1200)})"),
      array('n'=>'e3_t2_laukiam_po','u'=>$B.'&eile=laukiam','eval'=>"({tuscia:(document.querySelector('.dl-tuscia')||{}).innerText,h2:[...document.querySelectorAll('.dl-kortele h2')].map(x=>x.innerText)})"),
    );
   }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
