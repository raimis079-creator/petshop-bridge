<?php
/** TEMP PS S1621 run e6t — v3.37 grandinė per VIENĄ kortelę: naujas mišrus užs. (19475×4 AV + 25411×1 VF) → „VF veža į AV“ → eilė Dropshipping → kortelėje „Pridėti“ į atsargas (18154×2, 18599×6) → „Užsakyti iš VF“ (1 dropship #35442 su lipduku + ids_av) su `pre_wp_mail` gaudykle → Laukiam → „Gauta“ → Surinkti AV. Venipak nekviestas (lipdukai/sąrašas off, tiekėjas atveža). · K: kadrai (browser=1). */
if ( get_option( 'ps_s1621b_gaudykle' ) ) {
	add_filter( 'pre_wp_mail', function( $pre, $atts ) { $a = $atts['attachments'] ?? null; $z = (array) get_option( 'ps_s1621b_laiskai', array() );
		$z[] = array( 'kam' => is_array( $atts['to'] ?? '' ) ? implode( ',', $atts['to'] ) : (string) ( $atts['to'] ?? '' ), 'tema' => mb_substr( (string) ( $atts['subject'] ?? '' ), 0, 120 ), 'failai' => is_array( $a ) ? array_map( 'basename', $a ) : $a, 'tekstas' => mb_substr( trim( preg_replace( '/\s+/', ' ', wp_strip_all_tags( str_replace( array( '</tr>', '</p>', '<br>', '<br />' ), "\n", (string) ( $atts['message'] ?? '' ) ) ) ) ), 0, 2500 ), 'uri' => mb_substr( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), 0, 100 ) );
		update_option( 'ps_s1621b_laiskai', $z, false ); return $pre; }, 4, 2 );
}
add_action('init', function(){
  if (!isset($_GET['ps_e6t'])) return;
  $fr=sanitize_key($_GET['ps_e6t']); $f=strtoupper(substr($fr,0,1)); $o=array('v'=>'S1621 e6t','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp); $li=wp_generate_auth_cookie($uid,$exp,'logged_in',$tok);
  $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>$li)));
  $G=function($u,$t=90) use($cs){ return wp_remote_get(html_entity_decode($u,ENT_QUOTES),array('cookies'=>$cs,'timeout'=>$t,'sslverify'=>false,'redirection'=>0)); };
  $eiles=function() use($G){ $r=$G(admin_url('admin.php?page=ps-desk&eile=klausimai')); $h=(string)wp_remote_retrieve_body($r); return array('code'=>wp_remote_retrieve_response_code($r),'nav'=>mb_substr(trim(preg_replace('/\s+/',' ',wp_strip_all_tags(preg_match('/<main class="dl-main">(.*?)<div class="dl-kortele/su',$h,$mm)?$mm[1]:''))),0,140)); };
  $gaud=function() use($wpdb,$p){ $v=$wpdb->get_var("SELECT option_value FROM {$p}options WHERE option_name='ps_s1621b_laiskai'"); return $v?maybe_unserialize($v):array(); };
  $forma=function($h,$id){ if(!preg_match('/<form[^>]*id="'.$id.'"[^>]*>(.*?)<\/form>/su',$h,$m)) return null; $fh=$m[1]; preg_match_all('/<input[^>]*name="([^"]+)"[^>]*value="([^"]*)"/u',$fh,$ii,PREG_SET_ORDER); $in=array(); foreach($ii as $x){ $in[$x[1]]=mb_substr(html_entity_decode($x[2],ENT_QUOTES),0,120); } preg_match_all('/<button[^>]*>(.*?)<\/button>/su',$fh,$bb); $bt=array(); foreach($bb[0] as $k=>$b){ $bt[]=trim(wp_strip_all_tags($bb[1][$k])).(stripos($b,'disabled')!==false?' [DISABLED]':'').(preg_match('/name="ka" value="([^"]+)"/',$b,$kk)?' ka='.$kk[1]:''); } preg_match_all('/<input type="(?:radio|checkbox)"[^>]*name="([^"]+)"[^>]*value="([^"]*)"([^>]*)>/u',$fh,$cc,PREG_SET_ORDER); $ck=array(); foreach($cc as $x){ $ck[]=$x[1].'='.$x[2].(stripos($x[3],'checked')!==false?'*':''); } return array('in'=>$in,'btn'=>$bt,'ck'=>$ck,'tekstas'=>mb_substr(trim(preg_replace('/\s+/',' ',wp_strip_all_tags($fh))),0,700)); };
  try{
  $_COOKIE[LOGGED_IN_COOKIE]=$li; wp_set_current_user($uid); $n=wp_create_nonce('ps_dl_zurnalas');
  $sk=function($id) use($G,$n){ $r=$G(admin_url('admin-ajax.php?action=ps_dl_skydelis&id='.$id.'&n='.$n),60); return json_decode((string)wp_remote_retrieve_body($r),true)['data']??array(); };
  $skz=function($d){ return array('kur'=>$d['kur']??null,'btn'=>$d['btn']['t']??null,'rusiuoti'=>!empty($d['rusiuoti']),'takelis'=>array_map(function($t){return $t[0].':'.$t[2];},(array)($d['takelis']??array())),'eil'=>array_map(function($e){ return array('iid'=>$e['iid'],'q'=>$e['q'],'n'=>mb_substr($e['n'],0,40),'k'=>$e['k'],'bukle'=>$e['bukle']??'','kodel'=>mb_substr((string)($e['kodel']??''),0,120),'keliai'=>array_map(function($k){return $k['k'].':'.$k['t'].($k['on']?'*':'').($k['gal']?'':' (ne: '.$k['kodel_ne'].')');},(array)$e['keliai'])); },(array)($d['eil']??array())),'zinute'=>mb_substr((string)($d['zinute']??''),0,200)); };
  $klik=function($u) use($G){ $r=$G($u,120); $loc=(string)wp_remote_retrieve_header($r,'location'); parse_str((string)parse_url($loc,PHP_URL_QUERY),$q); return array('code'=>wp_remote_retrieve_response_code($r),'pd_ok'=>$q['pd_ok']??null,'pd'=>$q['pd_nr']??null); };
  $post=function($body) use($cs){ $r=wp_remote_post(admin_url('admin-post.php'),array('cookies'=>$cs,'timeout'=>150,'sslverify'=>false,'redirection'=>0,'body'=>$body)); $loc=(string)wp_remote_retrieve_header($r,'location'); parse_str((string)parse_url($loc,PHP_URL_QUERY),$q2); return array('code'=>wp_remote_retrieve_response_code($r),'loc'=>mb_substr($loc,0,200),'q'=>$q2,'body'=>mb_substr(wp_strip_all_tags((string)wp_remote_retrieve_body($r)),0,160)); };
  $part=function() use($wpdb,$p){ $pr=$wpdb->get_row("SELECT * FROM {$p}ps_tiekimas WHERE tiekejas='vf' ORDER BY id DESC LIMIT 1",ARRAY_A); if(!$pr) return null; $pr['eil']=$wpdb->get_results($wpdb->prepare("SELECT id,product_id,order_id,qty,pastaba FROM {$p}ps_tiekimas_eil WHERE partija_id=%d",$pr['id']),ARRAY_A); return $pr; };
  if($f==='C'){ $id=(int)get_option('ps_s1621b_oid'); $o['id']=$id; $o['eiles_pries']=$eiles(); $d=$sk($id); $o['sk1']=$skz($d); $u_iav=''; foreach((array)($d['eil']??array()) as $e){ foreach((array)$e['keliai'] as $k){ if('i_av'===$k['k']&&!empty($k['u'])) $u_iav=$k['u']; } }
    $jau=false; foreach((array)($d['eil']??array()) as $e){ if('i_av'===$e['k']) $jau=true; }
    if($u_iav){ $o['kelias']=$klik($u_iav); wp_cache_flush(); $d=$sk($id); } $o['sk2']=$skz($d);
    if(!empty($d['rusiuoti'])){ $o['rusiuota']=$klik($d['rusiuoti']); wp_cache_flush(); $d=$sk($id); $o['sk3']=$skz($d); } $o['eiles_po_rus']=$eiles();
    $r=$G(admin_url('admin.php?page=ps-desk&eile=laiskai'),120); $h=(string)wp_remote_retrieve_body($r); $o['laiskai_code']=wp_remote_retrieve_response_code($r);
    $fo=$forma($h,'dlf_vf'); $o['kortele_vf']=$fo; if(!$fo){ $o['STOP']='nėra dlf_vf'; $J($o); }
    $av=array(); if(preg_match_all('/class="dl-av-cb" data-form="dlf_vf"[^>]*value="(\d+)"/',$h,$vv)) $av=$vv[1]; $o['veza_i_av_uzs']=$av; $o['musu_yra']=in_array((string)$id,$av,true);
    if(preg_match('/<form[^>]*class="dl-inl dl-ats-f"[^>]*>(.*?)<\/form>/su',substr($h,strpos($h,'Užsakyti iš VF')),$af)){ preg_match('/name="_wpnonce"[^>]*value="([^"]+)"/',$af[1],$nn); $ats_nonce=$nn[1]??''; } else { $ats_nonce=''; }
    $o['ats_nonce']=$ats_nonce?'yra':'NĖRA';
    foreach(array(array('JOS0913',2),array('18599',6)) as $pp){ $o['prideti'][]=$post(array('action'=>'ps_dl_tiekimas','_wpnonce'=>$ats_nonce,'tiekejas'=>'vf','partija'=>'0','ka'=>'prideti','nauja_sku'=>(string)$pp[0],'nauja_qty'=>(string)$pp[1],'ps_dl_g'=>admin_url('admin.php?page=ps-desk&eile=laiskai'))); }
    wp_cache_flush(); $o['partija_po_prideti']=$part();
    $r=$G(admin_url('admin.php?page=ps-desk&eile=laiskai'),120); $h=(string)wp_remote_retrieve_body($r); $fo=$forma($h,'dlf_vf'); $o['kortele_vf_po']=array('btn'=>$fo['btn'],'ck'=>$fo['ck'],'tekstas'=>$fo['tekstas']);
    if(preg_match('/<div class="dl-perz-t"[^>]*>(.*?)<\/div><\/form>/su',substr($h,strpos($h,'id="dlf_vf"')),$pm)){ $o['perziura']=mb_substr(trim(preg_replace('/\s+/',' ',wp_strip_all_tags(str_replace('</tr>',"\n",$pm[1])))),0,1200); }
    $o['antras_isp']=preg_match('/<p class="pastaba dl-antras">(.*?)<\/p>/su',$h,$am)?wp_strip_all_tags($am[1]):'';
    $J($o); }
  if($f==='T'){
    $wpdb->query("DELETE FROM {$p}options WHERE option_name IN ('ps_s1621b_gaudykle','ps_s1621b_laiskai')"); update_option('ps_s1621b_gaudykle',1,false); wp_cache_flush();
    $z0=count((array)get_option('ps_dev_pastas_zurnalas',array())); $o['eiles_pries']=$eiles(); $o['stock_pries']=array(19475=>wc_get_product(19475)->get_stock_quantity(),25411=>wc_get_product(25411)->get_stock_quantity());
    // 1. užsakymas kaip iš kasos
    $ord=wc_create_order(array('customer_id'=>5787,'created_via'=>'checkout'));
    $adr=array('first_name'=>'S1621','last_name'=>'Mišrus testas','address_1'=>'Gedimino pr. 1','city'=>'Vilnius','postcode'=>'01103','country'=>'LT','email'=>'s1609.klientas@avesa.lt','phone'=>'+37060000099');
    $ord->set_address($adr,'billing'); unset($adr['email'],$adr['phone']); $ord->set_address($adr,'shipping');
    $ord->add_product(wc_get_product(19475),4); $ord->add_product(wc_get_product(25411),1);
    $sh=new WC_Order_Item_Shipping(); $sh->set_method_id('shopup_venipak_shipping_courier_method'); $sh->set_instance_id(2); $sh->set_method_title('VENIPAK Kurjeris'); $sh->set_total(3.297521); $ord->add_item($sh);
    $ord->set_payment_method('bacs'); $ord->set_payment_method_title('Bankinis pavedimas'); $ord->set_customer_note('TEST S1621 mišrus'); $ord->calculate_totals(); $ord->save(); $id=$ord->get_id(); $ord->payment_complete(); $o['id']=$id; update_option('ps_s1621b_oid',$id,false);
    wp_cache_flush(); $x=wc_get_order($id); $o['uzs']=array('st'=>$x->get_status(),'total'=>$x->get_total(),'ship'=>$x->get_shipping_total().'+'.$x->get_shipping_tax(),'paid'=>$x->is_paid());
    $o['eiles_po_uzs']=$eiles(); $d=$sk($id); $o['sk1']=$skz($d);
    // 2. VF eilutė → veža į AV
    $u_iav=''; foreach((array)($d['eil']??array()) as $e){ foreach((array)$e['keliai'] as $k){ if('i_av'===$k['k']&&!empty($k['u'])) $u_iav=$k['u']; } }
    $jau=false; foreach((array)($d['eil']??array()) as $e){ if('i_av'===$e['k']) $jau=true; }
    if(!$u_iav && !$jau){ $o['STOP']='nėra i_av nuorodos'; $J($o); }
    if($u_iav){ $o['kelias']=$klik($u_iav); wp_cache_flush(); $d=$sk($id); } else { $o['kelias']='sistema pati pasiūlė „VF veža į AV“ (atviras užsakymas tiekėjui)'; } $o['sk2']=$skz($d);
    if(!empty($d['rusiuoti'])){ $o['rusiuota']=$klik($d['rusiuoti']); wp_cache_flush(); $d=$sk($id); $o['sk3']=$skz($d); } else { $o['rusiuota']='NĖRA mygtuko — kelio keitimas pats surūšiavo'; } $o['eiles_po_rus']=$eiles();
    $J($o); }
  if($f==='L'){ $id=(int)get_option('ps_s1621b_oid'); $o['id']=$id; $d=$sk($id); $o['sk3']=$skz($d); $o['eiles_pries']=$eiles();
    // 3. Dropshipping kortelė (v3.37 — viena kortelė)
    $r=$G(admin_url('admin.php?page=ps-desk&eile=laiskai'),120); $h=(string)wp_remote_retrieve_body($r); $o['laiskai_code']=wp_remote_retrieve_response_code($r);
    $fo=$forma($h,'dlf_vf'); $o['kortele_vf']=$fo; if(!$fo){ $o['STOP']='nėra dlf_vf'; $J($o); }
    $av=array(); if(preg_match_all('/class="dl-av-cb" data-form="dlf_vf"[^>]*value="(\d+)"/',$h,$vv)) $av=$vv[1]; $o['veza_i_av_uzs']=$av; $o['musu_yra']=in_array((string)$id,$av,true);
    if(preg_match('/<form[^>]*class="dl-inl dl-ats-f"[^>]*>(.*?)<\/form>/su',substr($h,strpos($h,'Užsakyti iš VF')),$af)){ preg_match('/name="_wpnonce"[^>]*value="([^"]+)"/',$af[1],$nn); $ats_nonce=$nn[1]??''; } else { $ats_nonce=''; }
    $o['ats_nonce']=$ats_nonce?'yra':'NĖRA';
    // 4. „Pridėti“ į atsargas — iš kortelės (ne Tiekimo langas)
    foreach(array(array('JOS0913',2),array('18599',6)) as $pp){ $o['prideti'][]=$post(array('action'=>'ps_dl_tiekimas','_wpnonce'=>$ats_nonce,'tiekejas'=>'vf','partija'=>'0','ka'=>'prideti','nauja_sku'=>(string)$pp[0],'nauja_qty'=>(string)$pp[1],'ps_dl_g'=>admin_url('admin.php?page=ps-desk&eile=laiskai'))); }
    wp_cache_flush(); $o['partija_po_prideti']=$part();
    $r=$G(admin_url('admin.php?page=ps-desk&eile=laiskai'),120); $h=(string)wp_remote_retrieve_body($r); $fo=$forma($h,'dlf_vf'); $o['kortele_vf_po']=array('btn'=>$fo['btn'],'ck'=>$fo['ck'],'tekstas'=>$fo['tekstas']);
    if(preg_match('/<div class="dl-perz-t"[^>]*>(.*?)<\/div><\/form>/su',substr($h,strpos($h,'id="dlf_vf"')),$pm)){ $o['perziura']=mb_substr(trim(preg_replace('/\s+/',' ',wp_strip_all_tags(str_replace('</tr>',"\n",$pm[1])))),0,1200); }
    $o['antras_isp']=preg_match('/<p class="pastaba dl-antras">(.*?)<\/p>/su',$h,$am)?wp_strip_all_tags($am[1]):'';
    $J($o); }
  if($f==='S'){ // siųsti per kortelę: s<uzs> → uzsakymai; ids_av = mūsų
    $id=(int)get_option('ps_s1621b_oid'); $uzs=str_replace('_',',',preg_replace('/^s/','',$fr)); $o['id']=$id; $o['uzs']=$uzs; $pr=$part(); $o['pries']=array('partija'=>$pr,'gaud_n'=>count($gaud())); $o['eiles_pries']=$eiles();
    $wpdb->query("DELETE FROM {$p}options WHERE option_name IN ('ps_s1621b_gaudykle','ps_s1621b_laiskai')"); update_option('ps_s1621b_gaudykle',1,false); wp_cache_flush();
    $r=$G(admin_url('admin.php?page=ps-desk&eile=laiskai'),120); $h=(string)wp_remote_retrieve_body($r); $fo=$forma($h,'dlf_vf'); if(!$fo){ $o['STOP']='nėra dlf_vf'; $J($o); }
    $body=array('action'=>'ps_dl_uzsakyti','_wpnonce'=>$fo['in']['_wpnonce'],'tiekejas'=>'vf','uzsakymai'=>$uzs,'ids_av'=>(string)$id,'ps_dl_g'=>admin_url('admin.php?page=ps-desk&eile=laiskai'),'laisk_zyme'=>'1','laisk_man'=>'1','pastaba'=>'','pristatymas'=>'tiekejas','svoris'=>'','dezes'=>'1');
    $o['send']=$post($body); wp_cache_flush();
    $o['laiskai']=$gaud(); $o['partija_po']=$part(); $d=$sk($id); $o['sk_po']=$skz($d); $o['eiles_po']=$eiles();
    foreach(array_filter(explode(',',$uzs)) as $oid){ $x=wc_get_order((int)$oid); $o['ds_uzs'][$oid]=$x?array('st'=>$x->get_status(),'perduota'=>$x->get_meta('_ps_dropship_sent_src')):null; }
    // 6. Laukiam → Gauta
    $r=$G(admin_url('admin.php?page=ps-desk&eile=laukiam'),120); $h=(string)wp_remote_retrieve_body($r); $pid=(int)($o['partija_po']['id']??0); $gf=null;
    if(preg_match_all('/<form[^>]*class="dl-tk-f"[^>]*>(.*?)<\/form>/su',$h,$gfs)){ foreach($gfs[1] as $x){ if(strpos($x,'name="partija" value="'.$pid.'"')!==false){ $gf=$x; break; } } }
    if($gf){ preg_match('/name="_wpnonce"[^>]*value="([^"]+)"/',$gf,$nn); preg_match_all('/name="gauta\[(\d+)\]"[^>]*value="(\d+)"/',$gf,$gg,PREG_SET_ORDER); $gb=array('action'=>'ps_dl_tiekimas','_wpnonce'=>$nn[1]??'','tiekejas'=>'vf','partija'=>(string)$pid,'ka'=>'priimti','ps_dl_g'=>admin_url('admin.php?page=ps-desk&eile=laukiam')); foreach($gg as $x){ $gb['gauta['.$x[1].']']=$x[2]; } $o['gauta_laukai']=count($gg); $o['gauta']=$post($gb); wp_cache_flush(); $o['partija_gauta']=$part(); $d=$sk($id); $o['sk_gauta']=$skz($d); $o['eiles_gauta']=$eiles(); }
    else { $o['gauta']='Laukiam kortelėje partijos #'.$pid.' forma nerasta'; $o['laukiam_tekstas']=mb_substr(trim(preg_replace('/\s+/',' ',wp_strip_all_tags(preg_match('/<main class="dl-main">(.*?)<\/main>/su',$h,$mm)?$mm[1]:''))),0,600); }
    $notes=wc_get_order_notes(array('order_id'=>$id,'limit'=>8)); $o['pastabos']=array_map(function($nn){return mb_substr($nn->content,0,160);},$notes);
    $z=(array)get_option('ps_dev_pastas_zurnalas',array()); $o['dev_pastas']=array('n'=>count($z),'pask'=>array_map(function($e){return array(mb_substr($e['tema']??'',0,90),$e['kam']??'',$e['priedai']??null);},array_slice($z,-3)));
    $o['stock_po']=array(19475=>wc_get_product(19475)->get_stock_quantity(),25411=>wc_get_product(25411)->get_stock_quantity(),'25411_av'=>Petshop_AV_Stock::qty(25411),18154=>array('stock'=>wc_get_product(18154)->get_stock_quantity(),'av'=>Petshop_AV_Stock::qty(18154)),18599=>array('stock'=>wc_get_product(18599)->get_stock_quantity(),'av'=>Petshop_AV_Stock::qty(18599)));
    $wpdb->query("DELETE FROM {$p}options WHERE option_name IN ('ps_s1621b_gaudykle','ps_s1621b_laiskai')"); wp_cache_flush(); $o['gaud_isvalyta']=1;
    $J($o);
  }
  if($f==='K'){ $id=(int)get_option('ps_s1621b_oid'); $ck=array(); foreach($cs as $c){ $ck[]=array('name'=>$c->name,'value'=>$c->value); }
    $o['cookies']=$ck; $o['shots']=array(array('n'=>'s1621_e6_dropshipping_vf','u'=>admin_url('admin.php?page=ps-desk&eile=laiskai'),'w'=>1440,'h'=>1400,'full'=>1),array('n'=>'s1621_e6_laukiam','u'=>admin_url('admin.php?page=ps-desk&eile=laukiam'),'w'=>1440,'h'=>900),array('n'=>'s1621_e6_skydelis_'.$id,'u'=>admin_url('admin.php?page=ps-desk&eile=visi&atidaryti='.$id),'w'=>1440,'h'=>1000,'click'=>'tr.eil[data-id="'.$id.'"]'));
    $J($o); }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
