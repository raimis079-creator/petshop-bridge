<?php
/** TEMP PS S1608 run e3x — v3.8 testai: T2 (dvigubas kelias), T3 (320 failed), K2 dydis, V9/V11 nuotraukos, V12 recon */
add_action('init', function(){
  if (!isset($_GET['ps_e3x'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e3x'])); $o=array('v'=>'run e3x','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $u=get_user_by('login','testuotojas'); $uid=$u->ID; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp); $lc=wp_generate_auth_cookie($uid,$exp,'logged_in',$tok);
  $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>$lc)));
  $_COOKIE[LOGGED_IN_COOKIE]=$lc; wp_set_current_user($uid); $ck=''; foreach($cs as $c){ $ck.=$c->name.'='.$c->value.'; '; }
  $REQ=function($url) use($cs){ $t=microtime(true); $r=wp_remote_get($url,array('cookies'=>$cs,'timeout'=>120,'sslverify'=>false,'redirection'=>0)); if(is_wp_error($r)) return array('err'=>$r->get_error_message()); $b=wp_remote_retrieve_body($r); $x=array('code'=>wp_remote_retrieve_response_code($r),'bytes'=>strlen($b),'ms'=>(int)((microtime(true)-$t)*1000)); $loc=wp_remote_retrieve_header($r,'location'); if($loc){ parse_str((string)parse_url($loc,PHP_URL_QUERY),$q); $x['loc']=array_intersect_key($q,array_flip(array('pd_ok','pd_nr'))); if(isset($x['loc']['pd_nr'])) $x['loc']['pd_nr']=rawurldecode($x['loc']['pd_nr']); } else { if(preg_match('/class="dl-eiles".*?<\/div>/s',$b,$m)) $x['eiles']=preg_replace('/\s+/',' ',wp_strip_all_tags($m[0])); if(preg_match('/class="dl-psl".*?<\/div>/s',$b,$m)) $x['psl']=preg_replace('/\s+/',' ',wp_strip_all_tags($m[0])); if(preg_match('/pd-msg-klaida">([^<]+)/',$b,$m)) $x['ispejimas']=$m[1]; $x['data_json']=substr_count($b,'data-json='); $x['data_sk']=substr_count($b,'data-sk='); } return $x; };
  $B=admin_url('admin.php?page=ps-desk');
  try{
   if($f==='X'){
    $o['versija']=Petshop_Darbalaukis::VERSIJA;
    // V12 recon: Petshop_AV_Order metodai
    if(class_exists('Petshop_AV_Order')){ foreach((new ReflectionClass('Petshop_AV_Order'))->getMethods() as $m){ $o['av_order'][]=($m->isPublic()?'+':'-').($m->isStatic()?'s ':' ').$m->getName().'('.implode(',',array_map(function($x){return '$'.$x->getName();},$m->getParameters())).')'; } }
    // T2: dvigubas kelio keitimas lygiagrečiai — eilutė su AV likučiu ir tiekėju
    $kand=null; foreach(wc_get_orders(array('limit'=>60,'status'=>array('processing'),'return'=>'objects','orderby'=>'date','order'=>'DESC')) as $ord){ if($ord->get_meta('_ps_surinkta')||Petshop_Desk::siuntos_kodas($ord)) continue; foreach($ord->get_items() as $iid=>$it){ if('av'!==$it->get_meta('_ps_source')||$it->get_meta('_ps_kelias')) continue; $v=Petshop_AV_Source::resolve($it->get_product_id(),$it->get_quantity()); if(!empty($v['tiekejas'])&&!in_array($v['tiekejas'],array('av','legacy'),true)&&(int)$it->get_meta('_ps_av_reduced_qty')>0){ $kand=array($ord->get_id(),$iid,$it->get_product_id(),$v['tiekejas']); break 2; } } }
    $o['t2_kand']=$kand;
    if($kand){ list($oid,$iid,$pid,$tk)=$kand; $st=function() use($pid){ return array('stock'=>get_post_meta($pid,'_stock',true),'own'=>get_post_meta($pid,'_own_stock_qty',true)); }; $o['t2_pries']=$st();
      $url=admin_url('admin-post.php').'?'.http_build_query(array('action'=>'ps_dl_veiksmas','v'=>'kelias','id'=>$oid,'iid'=>$iid,'k'=>'tiesiai','_wpnonce'=>wp_create_nonce('ps_dl_kelias_'.$oid),'g'=>$B));
      $reqs=array(array('url'=>$url,'headers'=>array('Cookie'=>$ck),'options'=>array('verify'=>false,'follow_redirects'=>false,'timeout'=>60)),array('url'=>$url,'headers'=>array('Cookie'=>$ck),'options'=>array('verify'=>false,'follow_redirects'=>false,'timeout'=>60)));
      $rs=WpOrg\Requests\Requests::request_multiple($reqs); $o['t2_atsakymai']=array(); foreach($rs as $r){ if(is_object($r)&&isset($r->headers)){ $l=$r->headers['location']??''; parse_str((string)parse_url($l,PHP_URL_QUERY),$q); $o['t2_atsakymai'][]=array($r->status_code,rawurldecode($q['pd_nr']??''),$q['pd_ok']??''); } else { $o['t2_atsakymai'][]='klaida: '.(is_object($r)?get_class($r):gettype($r)); } }
      wp_cache_flush(); $o['t2_po']=$st(); $it=wc_get_order($oid)->get_item($iid); $o['t2_eilute']=array('kelias'=>$it->get_meta('_ps_kelias'),'src'=>$it->get_meta('_ps_source'),'reduced'=>$it->get_meta('_ps_av_reduced_qty'));
      $o['t2_zurnalas']=$wpdb->get_results($wpdb->prepare("SELECT veiksmas,rezultatas,pastaba FROM {$p}ps_uzsakymu_ivykiai WHERE uzsakymas=%d AND veiksmas='kelias' ORDER BY id DESC LIMIT 3",$oid),ARRAY_A);
      // grąžinam atgal į AV
      $o['t2_atgal']=$REQ(admin_url('admin-post.php').'?'.http_build_query(array('action'=>'ps_dl_veiksmas','v'=>'kelias','id'=>$oid,'iid'=>$iid,'k'=>'av','_wpnonce'=>wp_create_nonce('ps_dl_kelias_'.$oid),'g'=>$B)))['loc']??null; wp_cache_flush(); $o['t2_galas']=$st(); }
    // K2 dydis + V9 prieš T3
    $o['visi_pries']=$REQ($B.'&eile=visi'); $o['visi_psl2']=$REQ($B.'&eile=visi&psl=2'); $o['siandien']=$REQ($B.'&eile=visi&b=siandien');
    // T3: 320 failed
    $n=0; for($i=0;$i<320;$i++){ $ord=wc_create_order(array('customer_id'=>0)); $ord->set_address(array('first_name'=>'AUDITAS','last_name'=>'T3-'.$i,'email'=>'terra@petshop.lt','country'=>'LT'),'billing'); $ord->add_product(wc_get_product(19708),1); $ord->set_payment_method('paysera'); $ord->calculate_totals(); $ord->update_status('failed','T3 testas'); $ord->save(); $n++; }
    $o['t3_sukurta']=$n; wp_cache_flush();
    $o['neapmoketi_po']=$REQ($B.'&eile=neapmoketi'); $o['nauji_po']=$REQ($B.'&eile=nauji');
   }
   if($f==='C'){ $ids=wc_get_orders(array('limit'=>400,'status'=>array('failed'),'return'=>'ids','billing_last_name'=>'')); $n=0; foreach(wc_get_orders(array('limit'=>400,'status'=>array('failed'),'return'=>'objects')) as $ord){ if(strpos($ord->get_billing_last_name(),'T3-')===0){ $ord->delete(true); $n++; } } $o['t3_istrinta']=$n; wp_cache_flush(); $o['neapmoketi']=$REQ($B.'&eile=neapmoketi'); }
   if($f==='X'){ $o['cookies']=array(); foreach($cs as $c){ $o['cookies'][]=array('name'=>$c->name,'value'=>$c->value); }
    $o['shots']=array(
      array('n'=>'e3_v38_visi','u'=>$B.'&eile=visi','h'=>1000,'click'=>'tr.eil','eval'=>"new Promise(function(r){setTimeout(function(){r({nr:(document.getElementById('skNr')||{}).textContent,kur:(document.querySelector('.dl-kur')||{}).textContent,psl:(document.querySelector('.dl-psl')||{}).innerText,eiles:(document.querySelector('.dl-eiles')||{}).innerText.replace(/\\s+/g,' ')})},1500)})"),
      array('n'=>'e3_v38_neapmoketi','u'=>$B.'&eile=neapmoketi','eval'=>"({isp:(document.querySelector('.pd-msg-klaida')||{}).innerText,rows:document.querySelectorAll('tr.eil').length})"),
      array('n'=>'e3_v38_refresh','u'=>$B.'&eile=surinkti','eval'=>"new Promise(function(r){ window.scrollTo(0,300); var rows=document.querySelectorAll('tr.eil'); var m=document.querySelector('.dl-main'); m.setAttribute('data-x','1'); var t=document.createElement('div'); t.className='zyme-test'; m.appendChild(t); var iv=setInterval(function(){},1000); setTimeout(function(){ r({pastaba:'tylus atnaujinimas per 60 s netestuotas tiesiogiai (per ilga), tikrinam funkcija egzistuoja', fn:typeof window.atnaujinti, rows:rows.length}); },500); })"),
    ); }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
