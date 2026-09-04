<?php
/** TEMP PS S1617 run e1d — D: deploy darbalaukis v3.21 (gzip+b64 2 dalys, md5/gzdecode/token_get_all, gyvo failo sargas v3.20, kopija v320) + juosta v1.6 (sargas v1.5) + sim „Siunta grįžta“ AV dalis #35436 (Venipak nekviestas); nuvalo ankstesnius pakartotinio testus. T1 (naujas procesas, testuotojas): versija/md5; Klausimų kortelė #35436 (forma, mygtukai); POST ps_dl_pakartotinis ka=sukurti → N1. T2: ka=nemokamai → N1 atšaukiamas, žymė; kortelė „Siųsti iš naujo“. T3: žymė nuimama, ka=sukurti → N2; apmokėjimo puslapis svečiui (Paysera tik); Neapmokėti / Klausimai be N2; juosta. P: Paysera sim (update_status processing) → N2 completed + AVPN + laiškas; kortelė. Z: „Siųsti iš naujo“ per tikrą nuorodą + Playwright. */
add_action('init', function(){
  if (!isset($_GET['ps_e1d'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e1d'])); $o=array('v'=>'S1617 e1d','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $OID=35436; $OPT='ps_s1617_test';
  $pastas=function(){ $z=(array)get_option('ps_dev_pastas_zurnalas',array()); return array('n'=>count($z),'pask'=>array_map(function($x){ return array($x['laikas']??'',mb_substr($x['kam']??'',0,30),mb_substr($x['tema']??'',0,90),$x['priedai']??$x['priedu']??null); },array_slice($z,-4))); };
  $kort=function($h,$id){ if(!preg_match('/<div class="dl-kortele eil" data-id="'.$id.'"(.*?)<\/div>\s*(?=<div class="dl-kortele|<\/)/su',$h,$m)) return 'KORTELĖS NĖRA'; $k=$m[1];
    return array('sumos'=>preg_match_all('/<p class="dl-sumos[^"]*">(.*?)<\/p>/su',$k,$s)?array_map(function($x){ return trim(preg_replace('/\s+/',' ',wp_strip_all_tags(html_entity_decode($x)))); },$s[1]):array(),'mygtukai'=>preg_match_all('/<(?:a|button) class="v[^"]*"[^>]*>(.*?)<\/(?:a|button)>/su',$k,$mm)?array_map('wp_strip_all_tags',$mm[1]):array(),'forma'=>preg_match('/<form[^>]*class="dl-pk-f"[^>]*>(.*?)<\/form>/su',$k,$ff)?array('suma'=>preg_match('/name="suma"[^>]*value="([^"]*)"/',$ff[1],$sv)?$sv[1]:null,'nonce'=>preg_match('/name="_wpnonce" value="([^"]+)"/',$ff[1],$nn)?$nn[1]:null,'g'=>preg_match('/name="g" value="([^"]+)"/',$ff[1],$gg)?html_entity_decode($gg[1]):null,'mygt'=>preg_match_all('/<button[^>]*>(.*?)<\/button>/su',$ff[1],$fb)?$fb[1]:array()):'NĖRA','nuoroda_dar'=>preg_match('/v=pakart_nuoroda[^>]*>(.*?)<\/a>/su',$k,$nd)?wp_strip_all_tags($nd[1]):'','is_naujo_url'=>preg_match('/href="([^"]*v=grizta_is_naujo[^"]*)"/su',$k,$iu)?html_entity_decode($iu[1]):''); };
  $login=function(){ $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp); $li=wp_generate_auth_cookie($uid,$exp,'logged_in',$tok); $_COOKIE[LOGGED_IN_COOKIE]=$li; wp_set_current_user($uid);
    return array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>$li))); };
  $uzs=function($id){ $x=wc_get_order($id); if(!$x) return null; $it=array(); foreach($x->get_items() as $iid=>$i){ $it[$iid]=array('n'=>$i->get_name(),'q'=>$i->get_quantity(),'sub'=>$i->get_subtotal(),'tot'=>$i->get_total(),'tax'=>$i->get_total_tax(),'pid'=>$i->get_product_id(),'src'=>(string)$i->get_meta('_ps_source')); }
    $notes=array(); foreach(wc_get_order_notes(array('order_id'=>$id,'limit'=>8)) as $n){ $notes[]=mb_substr($n->content,0,170); }
    $meta=array(); foreach($x->get_meta_data() as $m){ if(strpos($m->key,'_ps_')===0||strpos($m->key,'_petshop_')===0) $meta[$m->key]=mb_substr(is_scalar($m->value)?$m->value:json_encode($m->value,JSON_UNESCAPED_UNICODE),0,90); }
    return array('st'=>$x->get_status(),'cid'=>$x->get_customer_id(),'email'=>$x->get_billing_email(),'via'=>$x->get_created_via(),'total'=>$x->get_total(),'tax'=>$x->get_total_tax(),'paid'=>$x->is_paid(),'date_paid'=>$x->get_date_paid()?$x->get_date_paid()->date('Y-m-d H:i:s'):null,'pm'=>$x->get_payment_method(),'ship'=>$x->get_shipping_total(),'it'=>$it,'meta'=>$meta,'notes'=>$notes,'pay_url'=>$x->get_checkout_payment_url()); };
  try{
  if($f==='D'){
    $up=wp_upload_dir(); $bk=trailingslashit($up['basedir']).'ps-backups'; wp_mkdir_p($bk);
    $c2='__P2__';
    $p1=(string)@file_get_contents($bk.'/dl-v321.part1'); $o['parts']=array(1=>array(strlen($p1),md5($p1)),2=>strlen($c2));
    if(md5($p1)!=='b0c2080f6f6eb5e2402f7da9ebe60553'){ $o['STOP']='dalis 1 md5'; $J($o); }
    $gz=base64_decode($p1.$c2,true); $code=$gz===false?false:gzdecode($gz); if($code===false){ $o['STOP']='b64/gz'; $J($o); }
    $o['bytes']=strlen($code); $o['md5']=md5($code);
    if ($o['md5']!=='c6a2232b00d9399ab7b9c050e8dfc9a0') { $o['STOP']='md5 nesutampa'; $J($o); }
    try { token_get_all($code, TOKEN_PARSE); $o['token']='ok'; } catch (Throwable $e) { $o['STOP']='token: '.$e->getMessage(); $J($o); }
    $t=WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'; $o['buvo']=md5_file($t);
    if ($o['buvo']!=='f4d32aefb19a27b3db85bb464b6b82e9') { $o['STOP']='gyvas ne v3.20 ('.$o['buvo'].')'; $J($o); }
    // juosta v1.6
    $jc=base64_decode('__JB64__',true); if($jc===false||md5($jc)!=='5b0be0fdff1fe31f5212493081d94e0c'){ $o['STOP']='juosta b64/md5'; $J($o); }
    try { token_get_all($jc, TOKEN_PARSE); $o['juosta_token']='ok'; } catch (Throwable $e) { $o['STOP']='juosta token: '.$e->getMessage(); $J($o); }
    $tj=WPMU_PLUGIN_DIR.'/petshop-juosta.php'; $o['juosta_buvo']=md5_file($tj); if($o['juosta_buvo']!=='13c9a2c81bd4a036389c07d386e67a09'){ $o['STOP']='juosta gyva ne v1.5'; $J($o); }
    $o['backup']=copy($t,$bk.'/petshop-darbalaukis-v320-BACKUP-'.date('Y-m-d').'.php'); $o['juosta_backup']=copy($tj,$bk.'/petshop-juosta-v15-BACKUP-'.date('Y-m-d').'.php');
    $o['rasyta']=file_put_contents($t,$code); $o['po']=md5_file($t); @unlink($bk.'/dl-v321.part1'); $o['part_unlink']=!file_exists($bk.'/dl-v321.part1');
    $o['juosta_rasyta']=file_put_contents($tj,$jc); $o['juosta_po']=md5_file($tj);
    if(function_exists('opcache_invalidate')){ @opcache_invalidate($t,true); @opcache_invalidate($tj,true); }
    // Recon: WC filtras el. pašto patvirtinimui
    $o['wc_verif_filter']=(int)preg_match('/woocommerce_order_email_verification_required/',(string)@file_get_contents(WP_PLUGIN_DIR.'/woocommerce/src/Internal/Utilities/Users.php'));
    // Sim: #35436 AV dalis grįžta (Venipak nekviestas); pašalinam ankstesnio testo žymes (jei būtų)
    $x=wc_get_order($OID); $o['sim_pries']=array('st'=>$x->get_status(),'griz'=>(string)$x->get_meta('_ps_siunta_grizta'),'pk_id'=>(string)$x->get_meta('_ps_pakartotinis_id'),'nemok'=>(string)$x->get_meta('_ps_pakartotinis_nemokamai'));
    $x->update_meta_data('_ps_siunta_grizta',wp_json_encode(array('av'=>array('nr'=>'V07267E1000779','t'=>'grįžta siuntėjui (sim)','e'=>'','d'=>'','kada'=>current_time('mysql'))))); $x->delete_meta_data('_ps_pakartotinis_id'); $x->delete_meta_data('_ps_pakartotinis_nemokamai'); $x->save();
    update_option($OPT,array('n1'=>0,'n2'=>0),false); $o['pastas']=$pastas(); $o['juosta_pries']=class_exists('Petshop_Juosta')?(do_action('ps_juosta_isvalyti')?null:Petshop_Juosta::skaiciai()):null;
    $J($o);
  }
  $cs=$login(); $st=(array)get_option($OPT,array());
  $post=function($ka,$suma,$nonce,$g) use($cs,$OID){ $r=wp_remote_post(admin_url('admin-post.php'),array('cookies'=>$cs,'timeout'=>90,'sslverify'=>false,'redirection'=>0,'body'=>array('action'=>'ps_dl_pakartotinis','id'=>$OID,'_wpnonce'=>$nonce,'g'=>$g,'ka'=>$ka,'suma'=>$suma)));
    $loc=(string)wp_remote_retrieve_header($r,'location'); parse_str((string)parse_url($loc,PHP_URL_QUERY),$q); return array('code'=>wp_remote_retrieve_response_code($r),'pd_ok'=>$q['pd_ok']??null,'pd_nr'=>$q['pd_nr']??null,'body'=>mb_substr(wp_strip_all_tags((string)wp_remote_retrieve_body($r)),0,200)); };
  $klaus=function() use($cs,$OID,$kort){ $r=wp_remote_get(admin_url('admin.php?page=ps-desk&eile=klausimai'),array('cookies'=>$cs,'timeout'=>90,'sslverify'=>false)); $h=(string)wp_remote_retrieve_body($r); return array('code'=>wp_remote_retrieve_response_code($r),'k'=>$kort($h,$OID),'html'=>$h); };
  if($f==='T1'){
    $o['versija']=Petshop_Darbalaukis::VERSIJA; $o['md5']=md5_file(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'); $o['juosta_v']=class_exists('Petshop_Juosta')?Petshop_Juosta::VERSIJA:null; $o['juosta_md5']=md5_file(WPMU_PLUGIN_DIR.'/petshop-juosta.php');
    $k=$klaus(); $o['kortele_pries']=$k['k']; $o['klaus_code']=$k['code'];
    $n=wp_create_nonce('ps_dl_zurnalas'); $r=wp_remote_get(admin_url('admin-ajax.php?action=ps_dl_skydelis&id='.$OID.'&n='.$n),array('cookies'=>$cs,'timeout'=>60,'sslverify'=>false)); $d=(json_decode((string)wp_remote_retrieve_body($r),true)['data']??array()); $o['sk_pries']=array('kl'=>$d['klausimas']??null,'pastaba'=>$d['pastaba']??null);
    if(is_array($k['k'])&&is_array($k['k']['forma'])){ $fm=$k['k']['forma']; $o['post_sukurti']=$post('sukurti',$fm['suma'],$fm['nonce'],$fm['g']); }
    $x=wc_get_order($OID); $n1=(int)$x->get_meta('_ps_pakartotinis_id'); $st['n1']=$n1; update_option($OPT,$st,false); $o['n1']=$n1; $o['N1']=$uzs($n1); $o['orig_meta']=array('pk_id'=>(string)$x->get_meta('_ps_pakartotinis_id'),'nemok'=>(string)$x->get_meta('_ps_pakartotinis_nemokamai'));
    $o['preke']=(int)get_option('ps_pakartotinio_preke'); $pr=wc_get_product($o['preke']); $o['preke_info']=$pr?array($pr->get_name(),$pr->get_status(),$pr->get_catalog_visibility(),$pr->is_virtual(),$pr->is_purchasable(),$pr->get_tax_class(),$pr->managing_stock(),get_post_meta($o['preke'],'_ps_sandelis',true)):null;
    $k2=$klaus(); $o['kortele_po']=$k2['k']; $o['n1_klausimuose']=$n1?(int)preg_match('/data-id="'.$n1.'"/',$k2['html']):null;
    $o['pastas']=$pastas();
    $J($o);
  }
  if($f==='T2'){
    $k=$klaus(); $fm=is_array($k['k'])?$k['k']['forma']:null; $o['kortele_pries']=is_array($k['k'])?array('mygtukai'=>$k['k']['mygtukai'],'sumos'=>$k['k']['sumos']):$k['k'];
    // forma nerodoma (laukia) — nonce imam iš PHP
    $nonce=wp_create_nonce('ps_dl_pakart_'.$OID); $g=admin_url('admin.php?page=ps-desk&eile=klausimai');
    $o['post_nemokamai']=$post('nemokamai','',$nonce,$g);
    $x=wc_get_order($OID); $o['orig_meta']=array('pk_id'=>(string)$x->get_meta('_ps_pakartotinis_id'),'nemok'=>(string)$x->get_meta('_ps_pakartotinis_nemokamai')); $o['N1']=$uzs((int)$st['n1']);
    $k2=$klaus(); $o['kortele_po']=is_array($k2['k'])?array('mygtukai'=>$k2['k']['mygtukai'],'sumos'=>$k2['k']['sumos'],'forma'=>$k2['k']['forma']==='NĖRA'?'NĖRA':'yra'):$k2['k'];
    // sekančiam žingsniui: žymė nuimama
    $x->delete_meta_data('_ps_pakartotinis_nemokamai'); $x->add_order_note('TEST S1617: žymė „be mokesčio“ nuimta rankomis (testas).',false,true); $x->save();
    $o['pastas']=$pastas();
    $J($o);
  }
  if($f==='T3'){
    $k=$klaus(); $fm=is_array($k['k'])?$k['k']['forma']:null; $o['forma']=is_array($fm)?array('suma'=>$fm['suma'],'mygt'=>$fm['mygt']):$fm;
    if(is_array($fm)){ $o['post_sukurti']=$post('sukurti',$fm['suma'],$fm['nonce'],$fm['g']); }
    $x=wc_get_order($OID); $n2=(int)$x->get_meta('_ps_pakartotinis_id'); $st['n2']=$n2; update_option($OPT,$st,false); $o['n2']=$n2; $o['N2']=$uzs($n2);
    // Apmokėjimo puslapis svečiui (be slapukų)
    if($n2){ $u=wc_get_order($n2)->get_checkout_payment_url(); $r=wp_remote_get($u,array('timeout'=>90,'sslverify'=>false,'headers'=>array('User-Agent'=>'Mozilla/5.0'))); $h=(string)wp_remote_retrieve_body($r);
      $o['pay_page']=array('code'=>wp_remote_retrieve_response_code($r),'paysera'=>(int)preg_match('/payment_method_paysera|Mokėjimas internetu/u',$h),'bacs'=>(int)preg_match('/payment_method_bacs|Bankinis pavedimas/u',$h),'login_forma'=>(int)preg_match('/woocommerce-form-login|Please log in|Prisijunk/u',$h),'klaida'=>(int)preg_match('/woocommerce-error|cannot be paid/u',$h),'suma'=>preg_match('/order-total.*?<bdi>(.*?)<\/bdi>/su',$h,$sm)?wp_strip_all_tags($sm[1]):'','eilute'=>preg_match('/product-name[^>]*>(.*?)<\/td>/su',$h,$pn)?trim(wp_strip_all_tags($pn[1])):'','mygtukas'=>preg_match('/id="place_order"[^>]*>(.*?)<\/button>/su',$h,$pb)?wp_strip_all_tags($pb[1]):''); }
    // Neapmokėti / Klausimai be N2; juosta
    $r=wp_remote_get(admin_url('admin.php?page=ps-desk&eile=neapmoketi'),array('cookies'=>$cs,'timeout'=>90,'sslverig'=>false,'sslverify'=>false)); $h=(string)wp_remote_retrieve_body($r); $o['neapm_code']=wp_remote_retrieve_response_code($r); $o['n2_neapmoketuose']=$n2?(int)preg_match('/data-id="'.$n2.'"/',$h):null;
    $k2=$klaus(); $o['kortele_po']=is_array($k2['k'])?array('mygtukai'=>$k2['k']['mygtukai'],'sumos'=>$k2['k']['sumos'],'forma'=>$k2['k']['forma']==='NĖRA'?'NĖRA':'yra','nuoroda_dar'=>$k2['k']['nuoroda_dar']):$k2['k']; $o['n2_klausimuose']=$n2?(int)preg_match('/data-id="'.$n2.'"/',$k2['html']):null;
    do_action('ps_juosta_isvalyti'); $o['juosta']=class_exists('Petshop_Juosta')?Petshop_Juosta::skaiciai():null; $o['juosta_sql_pending']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_orders WHERE type='shop_order' AND status IN ('wc-pending','wc-failed')");
    $o['pastas']=$pastas();
    $J($o);
  }
  if($f==='P'){
    $n2=(int)$st['n2']; if(!$n2){ $o['STOP']='n2 nėra'; $J($o); }
    $x=wc_get_order($n2); $o['pries']=array('st'=>$x->get_status(),'paid'=>$x->is_paid());
    // Paysera sim: kaip pluginas — update_status(processing), be payment_complete
    $x->update_status('processing','TEST S1617 (Paysera sim): Callback order payment completed',true);
    $o['N2']=$uzs($n2); $x2=wc_get_order($n2); $pdf=(string)$x2->get_meta('_petshop_completed_pdf'); $o['pdf']=array('kelias'=>basename($pdf),'yra'=>$pdf&&file_exists($pdf),'dydis'=>$pdf&&file_exists($pdf)?filesize($pdf):0);
    $o['faktas']=$wpdb->get_row($wpdb->prepare("SELECT uzsakymas_id,testinis,statusas,viso_ct,prekiu_suma_ct FROM {$p}ps_fakt_uzsakymai WHERE uzsakymas_id=%d",$n2),ARRAY_A); $o['fakt_eil']=$wpdb->get_results($wpdb->prepare("SELECT preke_id,kiekis,kaina_ct,pvm_ct,sandelis,pavadinimas_tuo_metu FROM {$p}ps_fakt_eilutes WHERE uzsakymas_id=%d",$n2),ARRAY_A);
    $orig=wc_get_order($OID); $on=array(); foreach(wc_get_order_notes(array('order_id'=>$OID,'limit'=>3)) as $n){ $on[]=mb_substr($n->content,0,170); } $o['orig_notes']=$on; $o['bukle']=Petshop_Darbalaukis::pakartotinis_bukle($orig);
    $o['ivykiai']=$wpdb->get_results($wpdb->prepare("SELECT veiksmas,rezultatas,kanalas,pastaba FROM {$p}ps_uzsakymu_ivykiai WHERE uzsakymas=%d ORDER BY id DESC LIMIT 5",$OID),ARRAY_A);
    $k2=$klaus(); $o['kortele_po']=is_array($k2['k'])?array('mygtukai'=>$k2['k']['mygtukai'],'sumos'=>$k2['k']['sumos'],'forma'=>$k2['k']['forma']==='NĖRA'?'NĖRA':'yra','is_naujo'=>$k2['k']['is_naujo_url']?'yra':'nėra'):$k2['k'];
    $n=wp_create_nonce('ps_dl_zurnalas'); $r=wp_remote_get(admin_url('admin-ajax.php?action=ps_dl_skydelis&id='.$OID.'&n='.$n),array('cookies'=>$cs,'timeout'=>60,'sslverify'=>false)); $d=(json_decode((string)wp_remote_retrieve_body($r),true)['data']??array()); $o['sk_po']=array('kl'=>$d['klausimas']??null,'pastaba'=>$d['pastaba']??null);
    $o['pastas']=$pastas();
    wp_set_current_user(0); $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp2=time()+1800; $tok2=WP_Session_Tokens::get_instance($uid)->create($exp2);
    $o['cookies']=array(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp2,'secure_auth',$tok2)),array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp2,'auth',$tok2)),array('name'=>LOGGED_IN_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp2,'logged_in',$tok2)));
    $o['shots']=array(array('n'=>'s1617_e1_klausimai_apmoketa','u'=>admin_url('admin.php?page=ps-desk&eile=klausimai'),'w'=>1400,'full'=>true,'eval'=>"({k:[...document.querySelectorAll('.dl-kortele[data-id=\"35436\"] .dl-sumos')].map(function(x){return x.innerText.replace(/\\s+/g,' ');}),m:[...document.querySelectorAll('.dl-kortele[data-id=\"35436\"] .dl-veiksmai .v')].map(function(x){return x.innerText;})})"),array('n'=>'s1617_e1_skydelis_35436','u'=>admin_url('admin.php?page=ps-desk&eile=klausimai&atidaryti='.$OID),'w'=>1400,'eval'=>"({pastaba:(document.getElementById('skPastaba')||{}).innerText||''})"));
    $J($o);
  }
  if($f==='Z'){
    $k=$klaus(); $u=is_array($k['k'])?$k['k']['is_naujo_url']:''; $o['is_naujo_url']=$u?'yra':'nėra';
    if($u){ $r=wp_remote_get($u,array('cookies'=>$cs,'timeout'=>120,'sslverify'=>false,'redirection'=>0)); $loc=(string)wp_remote_retrieve_header($r,'location'); parse_str((string)parse_url($loc,PHP_URL_QUERY),$q); $o['is_naujo']=array('code'=>wp_remote_retrieve_response_code($r),'pd_ok'=>$q['pd_ok']??null,'pd_nr'=>$q['pd_nr']??null); }
    $x=wc_get_order($OID); $o['orig']=array('st'=>$x->get_status(),'griz'=>(string)$x->get_meta('_ps_siunta_grizta'),'pk_id'=>(string)$x->get_meta('_ps_pakartotinis_id'),'nemok'=>(string)$x->get_meta('_ps_pakartotinis_nemokamai'),'istorija'=>(string)$x->get_meta('_ps_pakartotiniai'),'surinkta'=>(string)$x->get_meta('_ps_surinkta'));
    $k2=$klaus(); $o['kortele_po']=is_array($k2['k'])?'DAR YRA':$k2['k'];
    $o['pastas']=$pastas(); $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'");
    // Re-sim grįžta (Venipak nekviestas) — kad ekrane matytųsi kortelė su „Pakartotinis užsakymas“ forma (testinis #35436 lieka su sim žyme — trinti 6 etape)
    $x->update_meta_data('_ps_siunta_grizta',wp_json_encode(array('av'=>array('nr'=>'V07267E1000780','t'=>'grįžta siuntėjui (sim 2)','e'=>'','d'=>'','kada'=>current_time('mysql'))))); $x->save();
    wp_set_current_user(0); $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp2=time()+1800; $tok2=WP_Session_Tokens::get_instance($uid)->create($exp2);
    $o['cookies']=array(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp2,'secure_auth',$tok2)),array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp2,'auth',$tok2)),array('name'=>LOGGED_IN_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp2,'logged_in',$tok2)));
    $o['shots']=array(array('n'=>'s1617_e1_klausimai_forma','u'=>admin_url('admin.php?page=ps-desk&eile=klausimai'),'w'=>1400,'full'=>true,'click'=>'.dl-kortele[data-id="'.$OID.'"] .dl-pk-b','eval'=>"({forma:(function(){var f=document.querySelector('.dl-kortele[data-id=\"35436\"] .dl-pk-f');return f?{display:f.style.display,suma:f.querySelector('[name=suma]').value,txt:f.innerText.replace(/\\s+/g,' ')}:null})(),m:[...document.querySelectorAll('.dl-kortele[data-id=\"35436\"] .dl-veiksmai .v')].map(function(x){return x.innerText;})})"),array('n'=>'s1617_e1_surinkti_35436','u'=>admin_url('admin.php?page=ps-desk&eile=surinkti&atidaryti='.$OID),'w'=>1400,'eval'=>"({pastaba:(document.getElementById('skPastaba')||{}).innerText||''})"));
    $J($o);
  }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getFile().':'.$e->getLine(); }
  $J($o);
},99);
