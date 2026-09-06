<?php
/** TEMP PS S1620 run e13t — v3.36 testai su tikromis nuorodomis: T1 filtrai · T2 skydelio „Ištrinti“ (sargas + vienas užsakymas) · T3 „Ištrinti neapmokėtus atšauktus (N)“ · T4 cron `atsauktu_valymas()` + tvarkaraštis. */
add_action('init', function(){
  if (!isset($_GET['ps_e13t'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e13t'])); $o=array('v'=>'S1620 e13t','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp); $li=wp_generate_auth_cookie($uid,$exp,'logged_in',$tok);
  $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>$li)));
  $G=function($u,$t=90) use($cs){ return wp_remote_get(html_entity_decode($u,ENT_QUOTES),array('cookies'=>$cs,'timeout'=>$t,'sslverify'=>false,'redirection'=>0)); };
  $L=function($q) use($G){ $r=$G(admin_url('admin.php?page=ps-desk&'.$q)); $h=(string)wp_remote_retrieve_body($r); preg_match('/<main class="dl-main">(.*)<\/main>/su',$h,$m); $b=$m[1]??''; preg_match_all('/<tr[^>]*>.*?#(35\d{3})/su',$b,$ids); $nav=trim(preg_replace('/\s+/',' ',wp_strip_all_tags(preg_match('/<div class="dl-eiles">(.*?)<\/div>/su',$h,$e)?$e[1]:''))); return array('code'=>wp_remote_retrieve_response_code($r),'ids'=>array_values(array_unique($ids[1])),'nav'=>mb_substr($nav,0,120),'h'=>$h); };
  $ids_check=function($ids,$fn){ $bad=array(); foreach($ids as $id){ $x=wc_get_order((int)$id); if(!$x||!$fn($x)) $bad[]=$id; } return $bad; };
  $klik=function($u) use($G){ $r=$G($u,120); $loc=(string)wp_remote_retrieve_header($r,'location'); parse_str((string)parse_url($loc,PHP_URL_QUERY),$q); return array('code'=>wp_remote_retrieve_response_code($r),'pd_ok'=>$q['pd_ok']??null,'pd'=>$q['pd_nr']??null,'loc'=>mb_substr(str_replace(home_url(),'',$loc),0,120)); };
  $eiles=function() use($L){ return $L('eile=visi')['nav']; };
  try{
  $_COOKIE[LOGGED_IN_COOKIE]=$li; wp_set_current_user($uid); $n=wp_create_nonce('ps_dl_zurnalas');
  $sk=function($id) use($G,$n){ $r=$G(admin_url('admin-ajax.php?action=ps_dl_skydelis&id='.$id.'&n='.$n),60); return json_decode((string)wp_remote_retrieve_body($r),true)['data']??array(); };
  if($f==='T1'){
    $o['eiles']=$eiles(); $tz=wp_timezone();
    $a=$L('eile=visi&nuo=2026-09-05&iki=2026-09-05'); $o['a_nuo_iki']=array('n'=>count($a['ids']),'blogi'=>$ids_check($a['ids'],function($x) use($tz){ return $x->get_date_created()&&wp_date('Y-m-d',$x->get_date_created()->getTimestamp())==='2026-09-05'; }),'db'=>count(wc_get_orders(array('limit'=>-1,'type'=>'shop_order','return'=>'ids','status'=>array_diff(array_map(function($s){return str_replace('wc-','',$s);},array_keys(wc_get_order_statuses())),array('checkout-draft')),'date_created'=>strtotime('2026-09-05 00:00:00 Europe/Vilnius').'...'.strtotime('2026-09-05 23:59:59 Europe/Vilnius')))),'forma'=>array('nuo_val'=>(int)preg_match('/name="nuo" value="2026-09-05"/',$a['h']),'data_sel'=>(int)preg_match('/<option value="intervalas" selected/',$a['h']),'isvalyti'=>(int)(strpos($a['h'],'>išvalyti<')!==false),'riba'=>(int)(strpos($a['h'],'Rodomi 200')!==false)));
    $b=$L('eile=visi&mok=grynais'); $o['b_grynais']=array('n'=>count($b['ids']),'blogi'=>$ids_check($b['ids'],function($x){return 'cod'===$x->get_payment_method();}),'db_cod'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_orders WHERE type='shop_order' AND payment_method='cod' AND status<>'trash'"));
    $c=$L('eile=visi&st=atsauktas'); $o['c_atsaukti']=array('n'=>count($c['ids']),'blogi'=>$ids_check($c['ids'],function($x){return in_array($x->get_status(),array('cancelled','lp-cancelled'),true);}));
    $d=$L('eile=visi&suma_nuo=20&suma_iki=40'); $o['d_suma']=array('n'=>count($d['ids']),'blogi'=>$ids_check($d['ids'],function($x){$t=(float)$x->get_total();return $t>=20&&$t<=40;}));
    $e=$L('eile=visi&r=seniausi&data=menuo'); $ts=array(); foreach($e['ids'] as $id){ $x=wc_get_order((int)$id); $dd=$x->get_date_paid()?:$x->get_date_created(); $ts[]=$dd?$dd->getTimestamp():0; } $s=$ts; sort($s); $o['e_seniausi']=array('n'=>count($ts),'rikiuota'=>(int)($s===$ts),'pirmas'=>$e['ids'][0]??null,'pask'=>end($e['ids']));
    $g=$L('eile=visi&b=ivykdyti&mok=pavedimu'); $o['g_chip_plus_mok']=array('n'=>count($g['ids']),'blogi'=>$ids_check($g['ids'],function($x){return 'completed'===$x->get_status()&&'bacs'===$x->get_payment_method();}));
    $h=$L('eile=visi&b=atsaukti'); $o['h_atsaukti_chip']=array('n'=>count($h['ids']),'bulk'=>preg_match('/Ištrinti neapmokėtus atšauktus \((\d+)\)/u',$h['h'],$bm)?(int)$bm[1]:null,'bulk_href'=>(int)preg_match('/action=ps_dl_istrinti_atsauktus/',$h['h']));
    $v=$L('eile=visi'); $o['v_be_filtro']=array('n'=>count($v['ids']),'psl'=>(int)(strpos($v['h'],'class="dl-psl"')!==false),'selects'=>preg_match_all('/<select name="(mok|st|data|r|vykdymas|vezejas)"/',$v['h'],$sm)?$sm[1]:array(),'inputs'=>preg_match_all('/<input type="(date|number)" name="([a-z_]+)"/',$v['h'],$im)?$im[2]:array(),'rodyti'=>(int)(strpos($v['h'],'>Rodyti<')!==false)); $J($o);
  }
  if($f==='T2'){
    $o['eiles_pries']=$eiles(); $canc=wc_get_orders(array('limit'=>-1,'type'=>'shop_order','status'=>array('cancelled','lp-cancelled'),'return'=>'ids','orderby'=>'ID','order'=>'ASC')); $o['atsaukti_n']=count($canc); $lent=array(); $pirmas=0;
    foreach($canc as $id){ $x=wc_get_order($id); $d=$sk($id); $link=!empty($d['istrinti']); $tik=Petshop_Darbalaukis::istrinamas($x); $lent[]=array($id,$x->get_status(),(int)($x->is_paid()||$x->get_date_paid()),count($x->get_refunds()),$x->get_meta('_petshop_completed_pdf')?'pdf':'',$x->get_meta('_ps_siuntos')?'siunt':'',(int)$link,(int)$tik,$link===$tik?'OK':'NESUTAMPA'); if($tik&&!$pirmas) $pirmas=$id; }
    $o['sargas']=$lent; if(!$pirmas){ $o['STOP']='nėra trinamo'; $J($o); }
    $d=$sk($pirmas); $o['trinamas']=$pirmas; $o['klik']=$klik($d['istrinti']); wp_cache_flush(); $x=wc_get_order($pirmas); $o['po']=array('st'=>$x?$x->get_status():'NĖRA','pastaba'=>$x?mb_substr((string)($wpdb->get_var($wpdb->prepare("SELECT comment_content FROM {$p}comments WHERE comment_post_ID=%d ORDER BY comment_ID DESC LIMIT 1",$pirmas))),0,120):'','ivykis'=>$wpdb->get_row($wpdb->prepare("SELECT veiksmas,rezultatas,kas_vardas,pastaba FROM {$p}ps_uzsakymu_ivykiai WHERE uzsakymas=%d ORDER BY id DESC LIMIT 1",$pirmas),ARRAY_A),'db_status'=>$wpdb->get_var($wpdb->prepare("SELECT status FROM {$p}wc_orders WHERE id=%d",$pirmas)));
    $h=$L('eile=visi&b=atsaukti'); $o['sarase_liko']=(int)in_array((string)$pirmas,$h['ids'],true); $o['eiles_po']=$eiles();
    $o['ne_trinamas_test']=$klik(wp_nonce_url(admin_url('admin-post.php?action=ps_dl_veiksmas&v=istrinti&id=35434&g='.rawurlencode(admin_url('admin.php?page=ps-desk&eile=visi'))),'ps_dl_istrinti_35434')); $o['35434_po']=wc_get_order(35434)->get_status(); $J($o);
  }
  if($f==='T3'){
    $o['eiles_pries']=$eiles(); $h=$L('eile=visi&b=atsaukti'); preg_match('/href="([^"]*action=ps_dl_istrinti_atsauktus[^"]*)"/',$h['h'],$bm); $o['bulk_n']=preg_match('/Ištrinti neapmokėtus atšauktus \((\d+)\)/u',$h['h'],$nm)?(int)$nm[1]:null; if(empty($bm[1])){ $o['STOP']='bulk nuorodos nėra'; $J($o); }
    $pries=$wpdb->get_col("SELECT id FROM {$p}wc_orders WHERE type='shop_order' AND status IN ('wc-cancelled','wc-lp-cancelled')"); $o['klik']=$klik($bm[1]); wp_cache_flush();
    $o['trash_dabar']=$wpdb->get_col("SELECT id FROM {$p}wc_orders WHERE type='shop_order' AND status='trash'"); $o['cancelled_liko']=$wpdb->get_col("SELECT id FROM {$p}wc_orders WHERE type='shop_order' AND status IN ('wc-cancelled','wc-lp-cancelled')"); $o['liko_sargas']=array(); foreach($o['cancelled_liko'] as $id){ $x=wc_get_order((int)$id); $o['liko_sargas'][$id]=(int)Petshop_Darbalaukis::istrinamas($x); }
    $h=$L('eile=visi&b=atsaukti'); $o['bulk_po']=preg_match('/Ištrinti neapmokėtus atšauktus \((\d+)\)/u',$h['h'],$nm2)?(int)$nm2[1]:null; $o['eiles_po']=$eiles(); $J($o);
  }
  if($f==='T4'){ $o['cron_kitas']=($t=wp_next_scheduled('ps_dl_atsauktu_valymas'))?wp_date('Y-m-d H:i',$t):null; $o['ataskaita']=Petshop_Darbalaukis::atsauktu_valymas(); $o['opcija']=get_option('ps_dl_atsauktu_valymas_paskutinis'); $o['trash_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_orders WHERE type='shop_order' AND status='trash'"); $o['eiles']=$eiles(); $o['dev_pastas']=count((array)get_option('ps_dev_pastas_zurnalas',array())); $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'"); $J($o); }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
