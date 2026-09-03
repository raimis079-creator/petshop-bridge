<?php
/** TEMP PS S1608 run e3zz — T2 dvigubas kelio keitimas lygiagrečiai (#ps_e3_oid2), po to atšaukimas */
add_action('init', function(){
  if (!isset($_GET['ps_e3zz'])) return;
  $o=array('v'=>'run e3zz'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $u=get_user_by('login','testuotojas'); $uid=$u->ID; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp); $lc=wp_generate_auth_cookie($uid,$exp,'logged_in',$tok);
  $ck=SECURE_AUTH_COOKIE.'='.wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok).'; '.AUTH_COOKIE.'='.wp_generate_auth_cookie($uid,$exp,'auth',$tok).'; '.LOGGED_IN_COOKIE.'='.$lc;
  $_COOKIE[LOGGED_IN_COOKIE]=$lc; wp_set_current_user($uid);
  $B=admin_url('admin.php?page=ps-desk'); $ordn=wc_create_order(array('customer_id'=>0)); $ordn->set_address(array('first_name'=>'AUDITAS','last_name'=>'Testas 33','email'=>'terra@petshop.lt','phone'=>'+37060000000','address_1'=>'Testų g. 33','city'=>'Vilnius','postcode'=>'01100','country'=>'LT'),'billing'); $ordn->set_address(array('first_name'=>'AUDITAS','last_name'=>'Testas 33','address_1'=>'Testų g. 33','city'=>'Vilnius','postcode'=>'01100','country'=>'LT'),'shipping'); $ordn->add_product(wc_get_product(18593),1); $sh=new WC_Order_Item_Shipping(); $sh->set_method_id('shopup_venipak_shipping_courier_method'); $sh->set_instance_id(2); $sh->set_method_title('VENIPAK Kurjeris'); $sh->set_total(3.49); $ordn->add_item($sh); $ordn->set_payment_method('bacs'); $ordn->calculate_totals(); $ordn->save(); $ordn->payment_complete('AUDITAS-T33'); $oid=$ordn->get_id(); wp_cache_flush(); $o['oid']=$oid; $ord=wc_get_order($oid); $iid=0; foreach($ord->get_items() as $k=>$it){ $iid=$k; }
  $st=function(){ wp_cache_flush(); return array('stock'=>get_post_meta(18593,'_stock',true),'own'=>get_post_meta(18593,'_own_stock_qty',true)); }; $o['pries']=$st();
  $mk=function($k) use($B,$oid,$iid,$ck){ return array('url'=>admin_url('admin-post.php').'?'.http_build_query(array('action'=>'ps_dl_veiksmas','v'=>'kelias','id'=>$oid,'iid'=>$iid,'k'=>$k,'_wpnonce'=>wp_create_nonce('ps_dl_kelias_'.$oid),'g'=>$B)),'headers'=>array('Cookie'=>$ck),'type'=>'GET'); };
  $multi=function($reqs){ $mh=curl_multi_init(); $hs=array(); foreach($reqs as $r){ $c=curl_init($r['url']); curl_setopt_array($c,array(CURLOPT_RETURNTRANSFER=>1,CURLOPT_HEADER=>1,CURLOPT_NOBODY=>0,CURLOPT_FOLLOWLOCATION=>0,CURLOPT_SSL_VERIFYPEER=>0,CURLOPT_SSL_VERIFYHOST=>0,CURLOPT_HTTPHEADER=>array('Cookie: '.$r['headers']['Cookie']),CURLOPT_TIMEOUT=>60)); curl_multi_add_handle($mh,$c); $hs[]=$c; } do{ curl_multi_exec($mh,$run); curl_multi_select($mh,1); }while($run>0); $out=array(); foreach($hs as $c){ $b=curl_multi_getcontent($c); $code=curl_getinfo($c,CURLINFO_HTTP_CODE); $loc=preg_match('/^location:\s*(.+)$/mi',(string)$b,$m)?trim($m[1]):''; parse_str((string)parse_url($loc,PHP_URL_QUERY),$q); $out[]=array($code,rawurldecode($q['pd_nr']??''),$q['pd_ok']??'',curl_error($c)); curl_multi_remove_handle($mh,$c); } curl_multi_close($mh); return $out; };
  $atk=function($rs){ $out=array(); foreach($rs as $r){ if(is_object($r)&&isset($r->headers)){ $l=(string)($r->headers['location']??''); parse_str((string)parse_url($l,PHP_URL_QUERY),$q); $out[]=array($r->status_code,rawurldecode($q['pd_nr']??''),$q['pd_ok']??''); } else { $out[]='klaida: '.(is_object($r)?$r->getMessage():gettype($r)); } } return $out; };
  try{
    $o['dvigubas_tiesiai']=$multi(array($mk('tiesiai'),$mk('tiesiai')));
    $o['po_tiesiai']=$st(); $it=wc_get_order($oid)->get_item($iid); $o['eil_po_tiesiai']=array('kelias'=>$it->get_meta('_ps_kelias'),'src'=>$it->get_meta('_ps_source'),'reduced'=>$it->get_meta('_ps_av_reduced_qty'));
    $o['dvigubas_av']=$multi(array($mk('av'),$mk('av')));
    $o['po_av']=$st(); $it=wc_get_order($oid)->get_item($iid); $o['eil_po_av']=array('kelias'=>$it->get_meta('_ps_kelias'),'src'=>$it->get_meta('_ps_source'),'reduced'=>$it->get_meta('_ps_av_reduced_qty'));
    $o['zurnalas']=$wpdb->get_results($wpdb->prepare("SELECT veiksmas,rezultatas,pastaba FROM {$p}ps_uzsakymu_ivykiai WHERE uzsakymas=%d ORDER BY id",$oid),ARRAY_A);
    // atšaukti testinį — likutis grįžta
    $r=wp_remote_get(admin_url('admin-post.php').'?'.http_build_query(array('action'=>'ps_desk_veiksmas','v'=>'atsaukti','id'=>$oid,'_wpnonce'=>wp_create_nonce('ps_desk_atsaukti_'.$oid),'g'=>$B)),array('headers'=>array('Cookie'=>$ck),'sslverify'=>false,'redirection'=>0,'timeout'=>60)); $l=wp_remote_retrieve_header($r,'location'); parse_str((string)parse_url((string)$l,PHP_URL_QUERY),$q); $o['atsaukta']=rawurldecode($q['pd_nr']??'').' ['.($q['pd_ok']??'').']';
    $o['galas']=$st(); $o['busena']=wc_get_order($oid)->get_status();
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
