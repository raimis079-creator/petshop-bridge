<?php
/** TEMP PS S1619 run e2d — tikros nuorodos (html_entity_decode — e1d 403 dėl &amp;): K1 #35807 „Suformuoti kvitą“ → meta, PDF b64, skydelis po, saskaitos t=ppk, dok_pdf; K2 #35809 (grynais, S1619 T3) kvitas; A2 #35808 (pavedimu, on-hold, likutis nenurašytas) „Pažymėti apmokėtu“ (variklio mygtukas) → processing, likutis nurašytas. */
add_action('init', function(){
  if (!isset($_GET['ps_e2d'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e2d'])); $o=array('v'=>'S1619 e2d','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp); $li=wp_generate_auth_cookie($uid,$exp,'logged_in',$tok);
  $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>$li)));
  $G=function($u,$t=90) use($cs){ return wp_remote_get($u,array('cookies'=>$cs,'timeout'=>$t,'sslverify'=>false,'redirection'=>0)); };
  $eiles=function() use($G){ $r=$G(admin_url('admin.php?page=ps-desk&eile=klausimai')); $h=(string)wp_remote_retrieve_body($r);
    return array('code'=>wp_remote_retrieve_response_code($r),'nav'=>mb_substr(trim(preg_replace('/\s+/',' ',wp_strip_all_tags(preg_match('/<main class="dl-main">(.*?)<div class="dl-kortele/su',$h,$mm)?$mm[1]:''))),0,140)); };
  $ping=function() { $r=wp_remote_get(admin_url('admin-ajax.php?action=heartbeat'),array('timeout'=>90,'sslverify'=>false)); $b=(string)wp_remote_retrieve_body($r); return array('code'=>wp_remote_retrieve_response_code($r),'fatal'=>(int)(stripos($b,'Fatal error')!==false||stripos($b,'Parse error')!==false),'err'=>is_wp_error($r)?$r->get_error_message():''); };
  try{
  $_COOKIE[LOGGED_IN_COOKIE]=$li; wp_set_current_user($uid); $n=wp_create_nonce('ps_dl_zurnalas');
  $sk=function($id) use($G,$n){ $r=$G(admin_url('admin-ajax.php?action=ps_dl_skydelis&id='.$id.'&n='.$n),60); return json_decode((string)wp_remote_retrieve_body($r),true)['data']??array(); };
  $dokz=function($d){ return array_map(function($x){ return array($x['t'],$x['nr'],$x['z'],$x['d']??'',$x['s'],$x['u']?'PDF':'',isset($x['btn'])?$x['bt']:'',$x['kas']??''); },(array)($d['dok']??array())); };
  $uz=function($id){ wp_cache_flush(); $x=wc_get_order($id); if(!$x) return 'NĖRA'; $it=array(); foreach($x->get_items() as $i){ $it[]=array('n'=>mb_substr($i->get_name(),0,30),'q'=>$i->get_quantity(),'red'=>$i->get_meta('_reduced_stock'),'av'=>$i->get_meta('_ps_av_reduced_qty'),'src'=>$i->get_meta('_ps_source')); }
    return array('st'=>$x->get_status(),'pm'=>$x->get_payment_method(),'pmt'=>$x->get_payment_method_title(),'paid'=>$x->is_paid(),'total'=>$x->get_total(),'avpn'=>$x->get_meta('_petshop_avpn_number'),'stock_reduced'=>$x->get_data_store()->get_stock_reduced($id),'ppk'=>array($x->get_meta('_petshop_ppk_number'),$x->get_meta('_petshop_ppk_date'),$x->get_meta('_petshop_ppk_suma'),$x->get_meta('_petshop_ppk_kas'),basename((string)$x->get_meta('_petshop_ppk_pdf'))),'items'=>$it); };
  $klik=function($u) use($G){ $u=html_entity_decode($u,ENT_QUOTES); $r=$G($u,120); $loc=(string)wp_remote_retrieve_header($r,'location'); parse_str((string)parse_url($loc,PHP_URL_QUERY),$q); return array('code'=>wp_remote_retrieve_response_code($r),'pd_ok'=>$q['pd_ok']??null,'pd'=>$q['pd_nr']??null,'body'=>mb_substr(wp_strip_all_tags((string)wp_remote_retrieve_body($r)),0,160)); };
  if($f==='K1'||$f==='K2'){
    $id=$f==='K1'?35807:35809; $d=$sk($id); $o['dok_pries']=$dokz($d); $btn=''; foreach((array)($d['dok']??array()) as $x){ if(!empty($x['btn'])){ $btn=$x['btn']; } }
    if(!$btn){ $o['STOP']='mygtuko nėra'; $J($o); }
    $o['klik']=$klik($btn); $o['uzs']=$uz($id); $d2=$sk($id); $o['dok_po']=$dokz($d2);
    $pdf=(string)wc_get_order($id)->get_meta('_petshop_ppk_pdf'); if($pdf&&file_exists($pdf)){ $o['pdf']=array('f'=>basename($pdf),'b'=>filesize($pdf),'b64'=>base64_encode(file_get_contents($pdf))); }
    $o['klik2']=$klik($btn);
    $notes=wc_get_order_notes(array('order_id'=>$id,'limit'=>2)); $o['pastabos']=array_map(function($nn){return mb_substr($nn->content,0,260);},$notes);
    if($f==='K1'){
      $r=$G(admin_url('admin.php?page=ps-desk&view=saskaitos&t=ppk')); $h=(string)wp_remote_retrieve_body($r); $o['saskaitos_ppk']=array('code'=>wp_remote_retrieve_response_code($r),'eil'=>preg_match_all('/<tr><td>(.*?)<\/td><td><b>(.*?)<\/b><\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td class="r">(.*?)<\/td><td>(.*?)<\/td>/su',$h,$mm,PREG_SET_ORDER)?array_map(function($m){return trim(preg_replace('/\s+/',' ',wp_strip_all_tags(implode(' | ',array_slice($m,1)))));},$mm):array(),'foot'=>preg_match('/<tfoot>(.*?)<\/tfoot>/su',$h,$ft)?trim(preg_replace('/\s+/',' ',wp_strip_all_tags($ft[1]))):'','h1'=>preg_match('/<h1 class="dl-h1">(.*?)<\/h1>/su',$h,$h1)?trim(wp_strip_all_tags($h1[1])):'');
      $r=$G(admin_url('admin.php?page=ps-desk&view=saskaitos')); $h=(string)wp_remote_retrieve_body($r); $o['saskaitos_visi']=preg_match('/<tfoot>(.*?)<\/tfoot>/su',$h,$ft)?trim(preg_replace('/\s+/',' ',wp_strip_all_tags($ft[1]))):'';
      $pu=''; foreach((array)($d2['dok']??array()) as $x){ if('ppk'===$x['t']&&!empty($x['u'])) $pu=$x['u']; } if($pu){ $r=$G(html_entity_decode($pu,ENT_QUOTES),60); $o['dok_pdf']=array('code'=>wp_remote_retrieve_response_code($r),'ct'=>wp_remote_retrieve_header($r,'content-type'),'cd'=>wp_remote_retrieve_header($r,'content-disposition'),'b'=>strlen((string)wp_remote_retrieve_body($r))); }
      $z=(array)get_option('ps_dev_pastas_zurnalas',array()); $o['dev_pastas']=count($z);
    }
    $o['ppk_counter']=get_option('petshop_ppk_counter'); $o['eiles']=$eiles(); $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'"); $J($o);
  }
  if($f==='A2'){
    $id=35808; $pid=35357; $o['pries']=$uz($id); $o['stock_pries']=wc_get_product($pid)->get_stock_quantity(); $d=$sk($id); $o['btn']=$d['btn']['t']??null;
    if(empty($d['btn']['u'])){ $o['STOP']='mygtuko nėra'; $J($o); }
    $z0=count((array)get_option('ps_dev_pastas_zurnalas',array()));
    $o['klik']=$klik($d['btn']['u'].'&be_laisko=1'); $o['po']=$uz($id); wp_cache_flush(); $o['stock_po']=wc_get_product($pid)->get_stock_quantity(); $d2=$sk($id); $o['skydelis_po']=array('kur'=>$d2['kur']??null,'apmok'=>$d2['apmok']??null,'btn'=>$d2['btn']['t']??null,'dok'=>$dokz($d2));
    $notes=wc_get_order_notes(array('order_id'=>$id,'limit'=>4)); $o['pastabos']=array_map(function($nn){return mb_substr($nn->content,0,220);},$notes);
    $z=(array)get_option('ps_dev_pastas_zurnalas',array()); $o['dev_pastas']=array('pries'=>$z0,'po'=>count($z),'nauji'=>array_map(function($e){return array(mb_substr($e['tema']??'',0,80),$e['kam']??($e['to']??''));},array_slice($z,$z0)));
    $o['eiles']=$eiles(); $J($o);
  }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
