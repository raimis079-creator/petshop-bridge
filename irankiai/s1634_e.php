<?php
/** TEMP PS S1634 e2f — NAUJI TESTAI po valymo (darbuotojas `testuotojas`, tikri darbalaukio endpoint'ai; LP NENAUDOJAMAS, Venipak/Paysera API nekviečiami — siuntos numeriai rašomi per `Petshop_Siuntos::prideti_is_plugino` su fiktyviu `venipak_shipping_order_data`). Fazės: 1 grynai AV (Surinkti → lapai → lipdukas → Kurjeris paėmė → completed) · 2 grynai VF dropship (lipdukas → Užsakyti iš VF → VF išsiuntė → completed) · 3 mišrus AV+VF veža į AV + atsargos (kortelė → savas Tiekimo laiškas → Gauta → Surinkti → … → completed) · 4 Atsiėmimas AV grynais (inst #16 ON/OFF) · 5 telefoninis pavedimu (on-hold → Pažymėti apmokėtu) · Z suvestinė (eilės, dev-pastas, likučiai) + ps_web_dienos aplinka=dev valymas. */
add_action('init', function(){
  if (!isset($_GET['ps_e2f'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e2f'])); $o=array('v'=>'S1634 e2f','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(290);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp); $li=wp_generate_auth_cookie($uid,$exp,'logged_in',$tok);
  $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>$li)));
  $G=function($u,$t=90) use($cs){ return wp_remote_get(html_entity_decode($u,ENT_QUOTES),array('cookies'=>$cs,'timeout'=>$t,'sslverify'=>false,'redirection'=>0)); };
  $eiles=function() use($G){ $r=$G(admin_url('admin.php?page=ps-desk&eile=visi')); $h=(string)wp_remote_retrieve_body($r); return array('code'=>wp_remote_retrieve_response_code($r),'nav'=>mb_substr(trim(preg_replace('/\s+/',' ',wp_strip_all_tags(preg_match('/<div class="dl-eiles">(.*?)<\/div>/su',$h,$mm)?$mm[1]:''))),0,140),'warning'=>substr_count($h,'<b>Warning</b>')); };
  $_COOKIE[LOGGED_IN_COOKIE]=$li; wp_set_current_user($uid); $n=wp_create_nonce('ps_dl_zurnalas');
  $sk=function($id) use($G,$n){ $r=$G(admin_url('admin-ajax.php?action=ps_dl_skydelis&id='.$id.'&n='.$n),60); return json_decode((string)wp_remote_retrieve_body($r),true)['data']??array(); };
  $skz=function($d){ return array('kur'=>$d['kur']??null,'btn'=>$d['btn']['t']??null,'eil'=>array_map(function($e){return $e['k'].($e['bukle']?' ('.$e['bukle'].')':'');},(array)($d['eil']??array()))); };
  $klik=function($u) use($G){ $r=$G($u,150); $loc=(string)wp_remote_retrieve_header($r,'location'); parse_str((string)parse_url($loc,PHP_URL_QUERY),$q); return array('code'=>wp_remote_retrieve_response_code($r),'pd_ok'=>$q['pd_ok']??null,'pd'=>mb_substr((string)($q['pd_nr']??''),0,160)); };
  $post=function($body) use($cs){ $r=wp_remote_post(admin_url('admin-post.php'),array('cookies'=>$cs,'timeout'=>150,'sslverify'=>false,'redirection'=>0,'body'=>$body)); $loc=(string)wp_remote_retrieve_header($r,'location'); parse_str((string)parse_url($loc,PHP_URL_QUERY),$q2); return array('code'=>wp_remote_retrieve_response_code($r),'pd_ok'=>$q2['pd_ok']??null,'pd'=>mb_substr((string)($q2['pd_nr']??''),0,160),'id'=>(int)($q2['atidaryti']??0)); };
  $uz=function($id){ wp_cache_flush(); $x=wc_get_order($id); if(!$x) return 'NĖRA'; return array('st'=>$x->get_status(),'paid'=>$x->is_paid(),'total'=>$x->get_total(),'avpn'=>$x->get_meta('_petshop_avpn_number'),'iss'=>$x->get_meta('_ps_dalys_issiusta'),'siuntos'=>class_exists('Petshop_Siuntos')?Petshop_Siuntos::sarasas($id):null); };
  $nauj=function($prekes,$vardas,$pastaba) { $ord=wc_create_order(array('customer_id'=>5787,'created_via'=>'checkout')); $adr=array('first_name'=>'E2F','last_name'=>$vardas,'address_1'=>'Gedimino pr. 1','city'=>'Vilnius','postcode'=>'01103','country'=>'LT','email'=>'s1609.klientas@avesa.lt','phone'=>'+37060000099'); $ord->set_address($adr,'billing'); unset($adr['email'],$adr['phone']); $ord->set_address($adr,'shipping'); foreach($prekes as $pr){ $ord->add_product(wc_get_product($pr[0]),$pr[1]); } $sh=new WC_Order_Item_Shipping(); $sh->set_method_id('shopup_venipak_shipping_courier_method'); $sh->set_instance_id(2); $sh->set_method_title('VENIPAK Kurjeris'); $sh->set_total(3.297521); $ord->add_item($sh); $ord->set_payment_method('bacs'); $ord->set_payment_method_title('Bankinis pavedimas'); $ord->set_customer_note($pastaba); $ord->calculate_totals(); $ord->save(); $id=$ord->get_id(); $ord->payment_complete(); return $id; };
  $lipdukas=function($id,$sandelis,$nr) { $x=wc_get_order($id); $x->update_meta_data('venipak_shipping_order_data',wp_json_encode(array('pack_numbers'=>array($nr),'manifest'=>'07267260906E2F'))); $x->save(); return Petshop_Siuntos::prideti_is_plugino($id,$sandelis,'E2F'); }; // fiktyvus, Venipak nekviečiamas
  $zingsnis=function($id,$laukiu) use($sk,$skz,$klik,$uz,&$o){ wp_cache_flush(); $d=$sk($id); $z=$skz($d); if(($d['btn']['t']??'')!==$laukiu){ $o['STOP']='#'.$id.' laukiau „'.$laukiu.'“, yra „'.($d['btn']['t']??'-').'“ ('.$z['kur'].')'; return null; } $r=$klik($d['btn']['u']); wp_cache_flush(); return array('mygtukas'=>$laukiu,'r'=>$r,'po'=>$skz($sk($id)),'uzs'=>$uz($id)); };
  $forma=function($h,$id){ if(!preg_match('/<form[^>]*id="'.$id.'"[^>]*>(.*?)<\/form>/su',$h,$m)) return null; preg_match_all('/<input[^>]*name="([^"]+)"[^>]*value="([^"]*)"/u',$m[1],$ii,PREG_SET_ORDER); $in=array(); foreach($ii as $x){ $in[$x[1]]=html_entity_decode($x[2],ENT_QUOTES); } preg_match_all('/<button[^>]*>(.*?)<\/button>/su',$m[1],$bb); return array('in'=>$in,'btn'=>array_map(function($b){return trim(wp_strip_all_tags($b));},$bb[1])); };
  $kortele=function($src) use($G,$forma){ $r=$G(admin_url('admin.php?page=ps-desk&eile=laiskai'),120); $h=(string)wp_remote_retrieve_body($r); $fo=$forma($h,'dlf_'.$src); $ats=''; if(preg_match('/<form[^>]*class="dl-inl dl-ats-f"[^>]*>(.*?)<\/form>/su',substr($h,(int)strpos($h,'Užsakyti iš '.strtoupper($src))),$af)){ preg_match('/name="_wpnonce"[^>]*value="([^"]+)"/',$af[1],$nn); $ats=$nn[1]??''; } return array('forma'=>$fo,'ats_nonce'=>$ats,'antras'=>preg_match('/<p class="pastaba dl-antras">(.*?)<\/p>/su',$h,$am)?wp_strip_all_tags($am[1]):''); };
  try{
  if($f==='1'){ $o['eiles_pries']=$eiles(); $o['stock_pries']=wc_get_product(19475)->get_stock_quantity();
    $id=$nauj(array(array(19475,2)),'AV grynai','E2F-1 grynai AV'); $o['id']=$id; update_option('ps_e2f_ids',array_merge((array)get_option('ps_e2f_ids',array()),array('1'=>$id)),false);
    $o['uzs']=$uz($id); $o['sk0']=$skz($sk($id)); $o['eiles_po_uzs']=$eiles();
    $o['surinkti']=$zingsnis($id,'Surinkti'); if(!empty($o['STOP'])) $J($o);
    $o['lipdukas_fikt']=$lipdukas($id,'av','V07267E2F001'); wp_cache_flush(); $o['sk_po_lipduko']=$skz($sk($id));
    $o['paeme']=$zingsnis($id,$o['sk_po_lipduko']['btn']); $o['eiles_po']=$eiles(); $o['stock_po']=wc_get_product(19475)->get_stock_quantity(); $J($o); }
  if($f==='2'){ $o['eiles_pries']=$eiles();
    $id=$nauj(array(array(35357,1)),'VF dropship','E2F-2 grynai VF'); $o['id']=$id; update_option('ps_e2f_ids',array_merge((array)get_option('ps_e2f_ids',array()),array('2'=>$id)),false); $o['lipdukas_fikt']=$lipdukas($id,'vf','V07267E2F002');
    $o['uzs']=$uz($id); $o['sk0']=$skz($sk($id)); $o['eiles_po_uzs']=$eiles(); wp_cache_flush(); $o['sk_po_lipduko']=$skz($sk($id));
    $k=$kortele('vf'); $o['kortele']=array('btn'=>$k['forma']['btn']??null,'uzsakymai'=>$k['forma']['in']['uzsakymai']??null,'ids_av'=>$k['forma']['in']['ids_av']??null,'antras'=>$k['antras']);
    if(empty($k['forma'])){ $o['STOP']='nėra dlf_vf'; $J($o); }
    $o['siusti']=$post(array('action'=>'ps_dl_uzsakyti','_wpnonce'=>$k['forma']['in']['_wpnonce'],'tiekejas'=>'vf','uzsakymai'=>(string)$id,'ids_av'=>'','ps_dl_g'=>admin_url('admin.php?page=ps-desk&eile=laiskai'),'laisk_zyme'=>'1','laisk_man'=>'1','su_lipdukais'=>'0','pastaba'=>''));
    wp_cache_flush(); $o['sk_po_laisko']=$skz($sk($id)); $o['issiunte']=$zingsnis($id,$o['sk_po_laisko']['btn']); $o['eiles_po']=$eiles(); $J($o); }
  if($f==='3'){ $o['eiles_pries']=$eiles(); $o['av_pries']=array('18154'=>Petshop_AV_Stock::qty(18154),'25411'=>Petshop_AV_Stock::qty(25411));
    $id=$nauj(array(array(19475,1),array(25411,1)),'Mišrus į AV','E2F-3 mišrus AV+VF į AV'); $o['id']=$id; update_option('ps_e2f_ids',array_merge((array)get_option('ps_e2f_ids',array()),array('3'=>$id)),false);
    $o['uzs']=$uz($id); $d=$sk($id); $o['sk0']=$skz($d); $u_iav=''; foreach((array)($d['eil']??array()) as $e){ foreach((array)$e['keliai'] as $kk){ if('i_av'===$kk['k']&&!empty($kk['u'])) $u_iav=$kk['u']; } }
    if($u_iav){ $o['kelias']=$klik($u_iav); wp_cache_flush(); $d=$sk($id); } if(!empty($d['rusiuoti'])){ $o['rusiuota']=$klik($d['rusiuoti']); wp_cache_flush(); $d=$sk($id); } $o['sk1']=$skz($d); $o['eiles_po_rus']=$eiles();
    $k=$kortele('vf'); if(empty($k['forma'])){ $o['STOP']='nėra dlf_vf'; $J($o); }
    $o['prideti']=$post(array('action'=>'ps_dl_tiekimas','_wpnonce'=>$k['ats_nonce'],'tiekejas'=>'vf','partija'=>'0','ka'=>'prideti','nauja_sku'=>'18154','nauja_qty'=>'1','ps_dl_g'=>admin_url('admin.php?page=ps-desk&eile=laiskai')));
    $k=$kortele('vf'); $o['kortele']=array('btn'=>$k['forma']['btn']??null,'uzsakymai'=>$k['forma']['in']['uzsakymai']??null,'ids_av'=>$k['forma']['in']['ids_av']??null,'antras'=>$k['antras']);
    $o['uzsakyti']=$post(array('action'=>'ps_dl_uzsakyti','_wpnonce'=>$k['forma']['in']['_wpnonce'],'tiekejas'=>'vf','uzsakymai'=>'','ids_av'=>(string)$id,'ps_dl_g'=>admin_url('admin.php?page=ps-desk&eile=laiskai'),'laisk_zyme'=>'1','laisk_man'=>'1','pristatymas'=>'tiekejas','svoris'=>'','dezes'=>'1'));
    wp_cache_flush(); $o['sk2']=$skz($sk($id)); $o['partija']=$wpdb->get_row("SELECT id,busena,pristatymas FROM {$p}ps_tiekimas ORDER BY id DESC LIMIT 1",ARRAY_A); $o['eiles_po_uzsak']=$eiles();
    $pid=(int)($o['partija']['id']??0); $r=$G(admin_url('admin.php?page=ps-desk&eile=laukiam'),120); $h=(string)wp_remote_retrieve_body($r); $gf=null; if(preg_match_all('/<form[^>]*class="dl-tk-f"[^>]*>(.*?)<\/form>/su',$h,$gfs)){ foreach($gfs[1] as $x){ if(strpos($x,'name="partija" value="'.$pid.'"')!==false){ $gf=$x; break; } } }
    if(!$gf){ $o['STOP']='Laukiam be #'.$pid; $J($o); } preg_match('/name="_wpnonce"[^>]*value="([^"]+)"/',$gf,$nn); preg_match_all('/name="gauta\[(\d+)\]"[^>]*value="(\d+)"/',$gf,$gg,PREG_SET_ORDER); $gb=array('action'=>'ps_dl_tiekimas','_wpnonce'=>$nn[1]??'','tiekejas'=>'vf','partija'=>(string)$pid,'ka'=>'priimti','ps_dl_g'=>admin_url('admin.php?page=ps-desk&eile=laukiam')); foreach($gg as $x){ $gb['gauta['.$x[1].']']=$x[2]; }
    $o['gauta']=$post($gb); wp_cache_flush(); $o['sk3']=$skz($sk($id)); $o['eiles_po_gauta']=$eiles();
    $o['surinkti']=$zingsnis($id,'Surinkti'); if(!empty($o['STOP'])) $J($o);
    $o['lipdukas_fikt']=$lipdukas($id,'av','V07267E2F003'); wp_cache_flush(); $o['sk4']=$skz($sk($id)); $o['paeme']=$zingsnis($id,$o['sk4']['btn']); $o['eiles_po']=$eiles(); $o['av_po']=array('18154'=>Petshop_AV_Stock::qty(18154),'25411'=>Petshop_AV_Stock::qty(25411)); $J($o); }
  if($f==='4'){ $o['eiles_pries']=$eiles(); $wpdb->update("{$p}woocommerce_shipping_zone_methods",array('is_enabled'=>1),array('instance_id'=>16)); WC_Cache_Helper::get_transient_version('shipping',true);
    $pp=wc_get_product(19708); $pr=array(array('id'=>19708,'q'=>1,'kaina'=>number_format((float)wc_get_price_including_tax($pp),2,'.','')));
    $o['post']=$post(array('action'=>'ps_dl_naujas','_wpnonce'=>wp_create_nonce('ps_dl_naujas'),'kl'=>array('uid'=>'0','vardas'=>'E2F','pavarde'=>'Atsiėmimas','tel'=>'+37060000098','el'=>'e2e.atsiemimas@dev.avesa.lt','imone'=>'','adresas'=>'','miestas'=>'','kodas'=>''),'pr'=>$pr,'prist'=>'av','prist_kaina'=>'0.00','vieta'=>'','nuolaida'=>'0','nuolaida_pastaba'=>'','pastaba'=>'E2F-4 atsiėmimas grynais','mok'=>'grynais'));
    $id=$o['post']['id']; $wpdb->update("{$p}woocommerce_shipping_zone_methods",array('is_enabled'=>0),array('instance_id'=>16)); WC_Cache_Helper::get_transient_version('shipping',true); if(!$id){ $o['STOP']='nesukurtas'; $J($o); } $o['id']=$id; update_option('ps_e2f_ids',array_merge((array)get_option('ps_e2f_ids',array()),array('4'=>$id)),false);
    $o['uzs']=$uz($id); $o['sk0']=$skz($sk($id)); $o['surinkti']=$zingsnis($id,'Surinkti'); if(!empty($o['STOP'])) $J($o); $o['paruosta']=$zingsnis($id,'Paruošta atsiimti'); if(!empty($o['STOP'])) $J($o); $o['atsieme']=$zingsnis($id,'Klientas atsiėmė'); $o['eiles_po']=$eiles(); $o['inst16']=$wpdb->get_var("SELECT is_enabled FROM {$p}woocommerce_shipping_zone_methods WHERE instance_id=16"); $J($o); }
  if($f==='5'){ $o['eiles_pries']=$eiles(); $pp=wc_get_product(19475); $pr=array(array('id'=>19475,'q'=>3,'kaina'=>number_format((float)wc_get_price_including_tax($pp),2,'.','')));
    $o['post']=$post(array('action'=>'ps_dl_naujas','_wpnonce'=>wp_create_nonce('ps_dl_naujas'),'kl'=>array('uid'=>'5787','vardas'=>'E2F','pavarde'=>'Telefonu','tel'=>'+37060000099','el'=>'s1609.klientas@avesa.lt','imone'=>'','adresas'=>'Gedimino pr. 1','miestas'=>'Vilnius','kodas'=>'01103'),'pr'=>$pr,'prist'=>'venipak_kurjeris','prist_kaina'=>'3.99','vieta'=>'','nuolaida'=>'0','nuolaida_pastaba'=>'','pastaba'=>'E2F-5 telefonu pavedimu','mok'=>'pavedimu'));
    $id=$o['post']['id']; if(!$id){ $o['STOP']='nesukurtas'; $J($o); } $o['id']=$id; update_option('ps_e2f_ids',array_merge((array)get_option('ps_e2f_ids',array()),array('5'=>$id)),false);
    $o['uzs']=$uz($id); $o['stock_onhold']=wc_get_product(19475)->get_stock_quantity(); $o['sk0']=$skz($sk($id)); $o['eiles_onhold']=$eiles();
    $o['apmoketa']=$zingsnis($id,'Pažymėti apmokėtu'); $o['stock_po']=wc_get_product(19475)->get_stock_quantity(); $o['eiles_po']=$eiles(); $J($o); }
  if($f==='6'){ $ids=(array)get_option('ps_e2f_ids'); $id=(int)($ids['1']??0); $o['id']=$id; $o['eiles_pries']=$eiles(); $o['stock_pries']=wc_get_product(19475)->get_stock_quantity();
    $x=wc_get_order($id); $o['pries']=array('st'=>$x->get_status(),'siuntos'=>Petshop_Siuntos::sarasas($id));
    $gr=array('av'=>array('nr'=>'V07267E2F001','t'=>'Return to sender','e'=>'4','d'=>date('Y-m-d'),'kada'=>current_time('mysql')));
    $x->update_meta_data('_ps_siunta_grizta',wp_json_encode($gr)); $x->save(); wp_cache_flush();
    $d=$sk($id); $o['sk_grizta']=$skz($d); $o['eiles_grizta']=$eiles();
    $o['nemokamai']=$post(array('action'=>'ps_dl_pakartotinis','id'=>(string)$id,'_wpnonce'=>wp_create_nonce('ps_dl_pakart_'.$id),'g'=>admin_url('admin.php?page=ps-desk&eile=klausimai'),'ka'=>'nemokamai')); wp_cache_flush();
    $u1=wp_nonce_url(admin_url('admin-post.php?'.http_build_query(array('action'=>'ps_dl_veiksmas','v'=>'grizta_is_naujo','id'=>$id,'g'=>admin_url('admin.php?page=ps-desk&eile=klausimai')))),'ps_dl_grizta_is_naujo_'.$id);
    $o['is_naujo']=$klik($u1); wp_cache_flush(); $d=$sk($id); $o['sk_po']=$skz($d); $o['grizta_meta_po']=(string)wc_get_order($id)->get_meta('_ps_siunta_grizta');
    $o['surinkti2']=$zingsnis($id,'Surinkti'); if(!empty($o['STOP'])) $J($o);
    $o['lipdukas2']=$lipdukas($id,'av','V07267E2F006'); wp_cache_flush(); $sx=$skz($sk($id)); $o['sk_lip2']=$sx; $o['paeme2']=$zingsnis($id,$sx['btn']);
    $o['senos']=(string)wc_get_order($id)->get_meta('_ps_siuntos_senos'); $o['stock_po']=wc_get_product(19475)->get_stock_quantity(); $o['eiles_po']=$eiles(); $o['uzs_po']=$uz($id); $J($o); }
  if($f==='7'){ $ids=(array)get_option('ps_e2f_ids'); $id=(int)($ids['5']??0); $o['id']=$id; $o['eiles_pries']=$eiles(); $o['stock_pries']=wc_get_product(19475)->get_stock_quantity(); $o['kr_pries']=get_option('petshop_kravpn_counter');
    $x=wc_get_order($id); $iid=0; $qmax=0; foreach($x->get_items() as $k=>$it){ $iid=$k; $qmax=(int)$it->get_quantity(); break; }
    $o['pries']=array('st'=>$x->get_status(),'iid'=>$iid,'q'=>$qmax,'total'=>$x->get_total());
    $b=array('action'=>'ps_dl_grazinimas','id'=>(string)$id,'_wpnonce'=>wp_create_nonce('ps_dl_graz_'.$id),'g'=>admin_url('admin.php?page=ps-desk&eile=klausimai'),'priezastis'=>'atsisakymas','tinkama'=>'1','pristatymas'=>'1'); $b['q['.$iid.']']='1';
    $o['graz']=$post($b); wp_cache_flush();
    $x=wc_get_order($id); $g=json_decode((string)$x->get_meta('_ps_grazinti_rankomis'),true); $o['grazinti_rankomis']=$g?array_map(function($e){return array('suma'=>$e['suma'],'ka'=>mb_substr($e['ka'],0,90),'kr_nr'=>$e['kr']['nr']??'','pdf'=>$e['kr']['pdf']??'');},$g):null;
    $o['refundai']=array_map(function($r){return array('id'=>$r->get_id(),'suma'=>$r->get_amount(),'kreditine'=>(string)$r->get_meta('_ps_kreditine'));},$x->get_refunds());
    $o['eil_grazinta_q']=(string)($x->get_item($iid)?$x->get_item($iid)->get_meta('_ps_grazinta_q'):'');
    $d=$sk($id); $o['sk_po']=$skz($d); $o['stock_po']=wc_get_product(19475)->get_stock_quantity(); $o['kr_po']=get_option('petshop_kravpn_counter'); $o['eiles_po']=$eiles();
    $u2=wp_nonce_url(admin_url('admin-post.php?'.http_build_query(array('action'=>'ps_dl_veiksmas','v'=>'grazinta','id'=>$id,'g'=>admin_url('admin.php?page=ps-desk&eile=klausimai')))),'ps_dl_grazinta_'.$id);
    $o['grazinta_klik']=$klik($u2); wp_cache_flush(); $o['sk_gal']=$skz($sk($id)); $o['eiles_gal']=$eiles(); $J($o); }
  if($f==='8'){ $o['eiles_pries']=$eiles(); $o['ppk_pries']=get_option('petshop_ppk_counter'); $pp=wc_get_product(19708); $pr=array(array('id'=>19708,'q'=>1,'kaina'=>number_format((float)wc_get_price_including_tax($pp),2,'.','')));
    $o['post']=$post(array('action'=>'ps_dl_naujas','_wpnonce'=>wp_create_nonce('ps_dl_naujas'),'kl'=>array('uid'=>'0','vardas'=>'E2F','pavarde'=>'Grynais','tel'=>'+37060000097','el'=>'e2f.grynais@dev.avesa.lt','imone'=>'','adresas'=>'Gedimino pr. 1','miestas'=>'Vilnius','kodas'=>'01103'),'pr'=>$pr,'prist'=>'venipak_kurjeris','prist_kaina'=>'3.99','vieta'=>'','nuolaida'=>'0','nuolaida_pastaba'=>'','pastaba'=>'E2F-8 telefonu grynais + PPK','mok'=>'grynais'));
    $id=$o['post']['id']; if(!$id){ $o['STOP']='nesukurtas'; $J($o); } $o['id']=$id; update_option('ps_e2f_ids',array_merge((array)get_option('ps_e2f_ids',array()),array('8'=>$id)),false);
    $o['uzs']=$uz($id);
    $u3=wp_nonce_url(admin_url('admin-post.php?'.http_build_query(array('action'=>'ps_dl_veiksmas','v'=>'kvitas','id'=>$id,'g'=>admin_url('admin.php?page=ps-desk&eile=visi')))),'ps_dl_kvitas_'.$id);
    $o['kvitas']=$klik($u3); wp_cache_flush(); $x=wc_get_order($id);
    $o['ppk']=array('nr'=>(string)$x->get_meta('_petshop_ppk_number'),'suma'=>(string)$x->get_meta('_petshop_ppk_suma'),'kas'=>(string)$x->get_meta('_petshop_ppk_kas'),'pdf'=>basename((string)$x->get_meta('_petshop_ppk_pdf')),'pdf_yra'=>file_exists((string)$x->get_meta('_petshop_ppk_pdf'))?1:0);
    $o['ppk_po']=get_option('petshop_ppk_counter'); $o['eiles_po']=$eiles(); $J($o); }
  if($f==='9'){ $id=35827; $o['id']=$id; $o['stock_pries']=wc_get_product(19475)->get_stock_quantity();
    $o['lipdukas2']=$lipdukas($id,'av','V07267E2F006'); wp_cache_flush(); $sx=$skz($sk($id)); $o['sk_lip2']=$sx;
    $o['paeme2']=$zingsnis($id,$sx['btn']); $x=wc_get_order($id);
    $o['senos']=(string)$x->get_meta('_ps_siuntos_senos'); $o['siuntos']=Petshop_Siuntos::sarasas($id); $o['stock_po']=wc_get_product(19475)->get_stock_quantity(); $o['eiles_po']=$eiles(); $J($o); }
  if($f==='P'){ $ids=(array)get_option('ps_e2f_ids'); $up=wp_upload_dir();
    $imk=function($id,$meta) { $x=wc_get_order($id); if(!$x) return null; $f=(string)$x->get_meta($meta); if(!$f||!file_exists($f)) return array('nera'=>$meta,'v'=>basename($f)); return array('failas'=>basename($f),'b64'=>base64_encode(file_get_contents($f))); };
    $o['avpn_1']=$imk((int)($ids['1']??0),'_petshop_completed_pdf'); if(!empty($o['avpn_1']['nera'])) $o['avpn_1']=$imk((int)($ids['1']??0),'_petshop_order_pdf');
    $o['ppk_8']=$imk((int)($ids['8']??0),'_petshop_ppk_pdf');
    $x=wc_get_order((int)($ids['5']??0)); $g=$x?json_decode((string)$x->get_meta('_ps_grazinti_rankomis'),true):null; $kr=$g?($g[0]['kr']['pdf']??''):'';
    foreach(array($up['basedir'].'/wcdn/credit/'.$kr,$up['basedir'].'/wcdn/'.$kr) as $kf){ if($kr&&file_exists($kf)){ $o['kr_5']=array('failas'=>$kr,'b64'=>base64_encode(file_get_contents($kf))); break; } }
    if(empty($o['kr_5'])) { $o['kr_5']=array('nera'=>$kr); $o['wcdn_dirs']=array_map('basename',glob($up['basedir'].'/wcdn/*',GLOB_ONLYDIR)); }
    $J($o); }
  if($f==='X'){ $up=wp_upload_dir(); $kf=$up['basedir'].'/wcdn/creditnote/Kreditine-saskaita-KR-AVPN000105.pdf';
    if(file_exists($kf)) $o['kr']=array('failas'=>basename($kf),'b64'=>base64_encode(file_get_contents($kf))); else { $o['kr']='NERA'; $o['dir']=array_map('basename',(array)glob($up['basedir'].'/wcdn/creditnote/*')); }
    $z=(array)get_option('ps_dev_pastas_zurnalas',array()); $o['temos']=array_map(function($e){return mb_substr($e['tema']??'',0,80).' → '.mb_substr($e['kam']??'',0,34).' [pr:'.(is_array($e['priedai']??null)?implode(',',$e['priedai']):(string)($e['priedai']??'')).']';},array_slice($z,-18)); $J($o); }
  if($f==='K'){ $ck=array(); foreach($cs as $c){ $ck[]=array('name'=>$c->name,'value'=>$c->value); } $o['cookies']=$ck;
    $o['shots']=array(
      array('n'=>'s1634_visi','u'=>admin_url('admin.php?page=ps-desk&eile=visi'),'w'=>1440,'h'=>1200,'full'=>1),
      array('n'=>'s1634_skydelis_35831','u'=>admin_url('admin.php?page=ps-desk&eile=visi&atidaryti=35831'),'w'=>1440,'h'=>1400,'click'=>'tr.eil[data-id="35831"]'),
      array('n'=>'s1634_lapas_35832','u'=>html_entity_decode(wp_nonce_url(admin_url('admin-post.php?action=ps_desk_veiksmas&v=lapai&id=35832'),'ps_desk_lapai_35832'),ENT_QUOTES),'w'=>900,'h'=>1200,'full'=>1),
      array('n'=>'s1634_naujas','u'=>admin_url('admin.php?page=ps-desk&view=naujas'),'w'=>1440,'h'=>1200,'full'=>1)
    ); $J($o); }
  if($f==='Z'){ $o['ids']=get_option('ps_e2f_ids'); foreach((array)$o['ids'] as $k=>$id){ $o['uzs'][$k.':'.$id]=$uz($id); } $o['eiles']=$eiles();
    $z=(array)get_option('ps_dev_pastas_zurnalas',array()); $o['dev_pastas']=array('n'=>count($z),'temos'=>array_map(function($e){return mb_substr($e['tema']??'',0,70).' → '.mb_substr($e['kam']??'',0,30).' ['.(int)($e['priedai']??0).']';},$z));
    $o['archyvas']=array_map(function($l){return $l['laikas'].' '.$l['kont'];},array_slice((array)get_option('ps_laisku_archyvas',array()),0,3));
    $o['web_dienos_dev_istrinta']=$wpdb->query("DELETE FROM {$p}ps_web_dienos WHERE aplinka='dev'"); $o['web_dienos_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_web_dienos");
    $o['tiekimas']=$wpdb->get_results("SELECT id,tiekejas,busena FROM {$p}ps_tiekimas",ARRAY_A); $o['skait']=array('avpn'=>get_option('petshop_avpn_counter'),'iapv'=>get_option('petshop_iapv_counter'),'kr'=>get_option('petshop_kravpn_counter'),'ppk'=>get_option('petshop_ppk_counter'));
    $o['likuciai']=array('19475'=>wc_get_product(19475)->get_stock_quantity(),'19708'=>wc_get_product(19708)->get_stock_quantity(),'35357'=>wc_get_product(35357)->get_stock_quantity(),'18154_av'=>Petshop_AV_Stock::qty(18154),'25411_av'=>Petshop_AV_Stock::qty(25411));
    $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'"); $J($o); }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
