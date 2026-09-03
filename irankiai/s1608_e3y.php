<?php
/** TEMP PS S1608 run e3y — T3 įspėjimas + valymas, T2 su 18593, V11 tylus atnaujinimas, V12 fiksuoti() recon */
add_action('init', function(){
  if (!isset($_GET['ps_e3y'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e3y'])); $o=array('v'=>'run e3y','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $u=get_user_by('login','testuotojas'); $uid=$u->ID; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp); $lc=wp_generate_auth_cookie($uid,$exp,'logged_in',$tok);
  $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>$lc)));
  $_COOKIE[LOGGED_IN_COOKIE]=$lc; wp_set_current_user($uid); $ck=''; foreach($cs as $c){ $ck.=$c->name.'='.$c->value.'; '; }
  $REQ=function($url) use($cs){ $r=wp_remote_get($url,array('cookies'=>$cs,'timeout'=>120,'sslverify'=>false,'redirection'=>0)); if(is_wp_error($r)) return array('err'=>$r->get_error_message()); $b=wp_remote_retrieve_body($r); $x=array('code'=>wp_remote_retrieve_response_code($r),'bytes'=>strlen($b)); $loc=wp_remote_retrieve_header($r,'location'); if($loc){ parse_str((string)parse_url($loc,PHP_URL_QUERY),$q); $x['pd']=rawurldecode($q['pd_nr']??'').' ['.($q['pd_ok']??'').']'; } else { if(preg_match('/pd-msg-klaida">([^<]+)/',$b,$m)) $x['ispejimas']=$m[1]; if(preg_match('/class="dl-eiles".*?<\/div>/s',$b,$m)) $x['eiles']=preg_replace('/\s+/',' ',wp_strip_all_tags($m[0])); } return $x; };
  $B=admin_url('admin.php?page=ps-desk');
  try{
   if($f==='Y'){
    $o['versija']=Petshop_Darbalaukis::VERSIJA;
    $o['t3_ispejimas']=$REQ($B.'&eile=neapmoketi');
    // valymas
    $n=0; foreach(wc_get_orders(array('limit'=>400,'status'=>array('failed'),'return'=>'objects')) as $ord){ if(strpos($ord->get_billing_last_name(),'T3-')===0){ $ord->delete(true); $n++; } } $o['t3_istrinta']=$n; wp_cache_flush();
    $o['po_valymo']=$REQ($B.'&eile=neapmoketi');
    // V12 recon
    $src=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-av-order.php'); $o['av_order_bytes']=strlen($src); if(preg_match('/public static function fiksuoti\(.*?\n\t\}\n/s',$src,$m)) $o['fiksuoti']=mb_substr($m[0],0,3500); if(preg_match('/public static function nuspresta\(.*?\n\t\}\n/s',$src,$m)) $o['nuspresta']=mb_substr($m[0],0,1200);
    // T2: užsakymas su 18593 (AV+tiekėjas)
    $v=Petshop_AV_Source::resolve(18593,1); $o['t2_resolve']=$v;
    $ord=wc_create_order(array('customer_id'=>0)); $ord->set_address(array('first_name'=>'AUDITAS','last_name'=>'Testas 32','email'=>'terra@petshop.lt','phone'=>'+37060000000','address_1'=>'Testų g. 32','city'=>'Vilnius','postcode'=>'01100','country'=>'LT'),'billing'); $ord->set_address(array('first_name'=>'AUDITAS','last_name'=>'Testas 32','address_1'=>'Testų g. 32','city'=>'Vilnius','postcode'=>'01100','country'=>'LT'),'shipping');
    $ord->add_product(wc_get_product(18593),1); $sh=new WC_Order_Item_Shipping(); $sh->set_method_id('shopup_venipak_shipping_courier_method'); $sh->set_instance_id(2); $sh->set_method_title('VENIPAK Kurjeris'); $sh->set_total(3.49); $ord->add_item($sh); $ord->set_payment_method('bacs'); $ord->calculate_totals(); $ord->save(); $oid=$ord->get_id(); $ord->payment_complete('AUDITAS-T32'); update_option('ps_e3_oid2',$oid,false); $o['t2_oid']=$oid;
    wp_cache_flush(); $ord=wc_get_order($oid); $iid=0; foreach($ord->get_items() as $k=>$it){ $iid=$k; $o['t2_eil_pries']=array('src'=>$it->get_meta('_ps_source'),'kelias'=>$it->get_meta('_ps_kelias'),'reduced'=>$it->get_meta('_ps_av_reduced_qty'),'rus'=>$ord->get_meta('_ps_rusiuota')); }
    $st=function(){ wp_cache_flush(); return array('stock'=>get_post_meta(18593,'_stock',true),'own'=>get_post_meta(18593,'_own_stock_qty',true)); }; $o['t2_pries']=$st();
    $url=admin_url('admin-post.php').'?'.http_build_query(array('action'=>'ps_dl_veiksmas','v'=>'kelias','id'=>$oid,'iid'=>$iid,'k'=>'tiesiai','_wpnonce'=>wp_create_nonce('ps_dl_kelias_'.$oid),'g'=>$B));
    $rq=array('url'=>$url,'headers'=>array('Cookie'=>$ck),'type'=>'GET','options'=>array('verify'=>false,'follow_redirects'=>false,'timeout'=>60));
    $rs=WpOrg\Requests\Requests::request_multiple(array($rq,$rq)); foreach($rs as $r){ if(is_object($r)&&isset($r->headers)){ $l=$r->headers['location']??''; parse_str((string)parse_url((string)$l,PHP_URL_QUERY),$q); $o['t2_atsakymai'][]=array($r->status_code,rawurldecode($q['pd_nr']??''),$q['pd_ok']??''); } else { $o['t2_atsakymai'][]='klaida: '.(is_object($r)?get_class($r).' '.$r->getMessage():gettype($r)); } }
    $o['t2_po']=$st(); $it=wc_get_order($oid)->get_item($iid); $o['t2_eil_po']=array('src'=>$it->get_meta('_ps_source'),'kelias'=>$it->get_meta('_ps_kelias'),'reduced'=>$it->get_meta('_ps_av_reduced_qty'));
    $o['t2_zurnalas']=$wpdb->get_results($wpdb->prepare("SELECT veiksmas,rezultatas,pastaba FROM {$p}ps_uzsakymu_ivykiai WHERE uzsakymas=%d AND veiksmas='kelias' ORDER BY id",$oid),ARRAY_A);
    $o['t2_atgal']=$REQ(admin_url('admin-post.php').'?'.http_build_query(array('action'=>'ps_dl_veiksmas','v'=>'kelias','id'=>$oid,'iid'=>$iid,'k'=>'av','_wpnonce'=>wp_create_nonce('ps_dl_kelias_'.$oid),'g'=>$B)))['pd']??null; $o['t2_galas']=$st();
    $o['cookies']=array(); foreach($cs as $c){ $o['cookies'][]=array('name'=>$c->name,'value'=>$c->value); }
    $o['shots']=array(
      array('n'=>'e3_v38_refresh','u'=>$B.'&eile=surinkti','eval'=>"new Promise(function(r){ window.scrollTo(0,250); var rows=document.querySelectorAll('tr.eil'); rows[1].classList.add('on'); var m=document.querySelector('.dl-main'); var f=document.createElement('div'); f.id='fake'; m.appendChild(f); var y0=window.scrollY; window.psDlAtnaujinti(); setTimeout(function(){ r({y0:y0,y1:window.scrollY,fake_liko:!!document.getElementById('fake'),rows:document.querySelectorAll('tr.eil').length,on:(document.querySelector('tr.eil.on')||{}).getAttribute?document.querySelector('tr.eil.on').getAttribute('data-id'):null, on_buvo: rows[1].getAttribute('data-id')}); },4000); })"),
      array('n'=>'e3_v38_visi2','u'=>$B.'&eile=visi&psl=2','h'=>1000,'eval'=>"({psl:(document.querySelector('.dl-psl')||{}).innerText,rows:document.querySelectorAll('tr.eil').length})"),
    );
   }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
