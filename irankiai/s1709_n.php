<?php
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1709n'])) return;
  $f=$_GET['ps_s1709n']; $fl=WP_CONTENT_DIR.'/mu-plugins/petshop-darbalaukis.php'; $bak=WP_CONTENT_DIR.'/uploads/ps-backups/petshop-darbalaukis.php.bak_s1709';
  $SENAS='00de943148216bdc32f94b17899aacce'; $NAUJAS='f1bdf09497f3786367cd2c69973550c3';
  $r=['f'=>$f,'md5_gyvas'=>md5_file($fl)];
  if($f==='1'){
    $aid=(int)($_GET['d_dl_v344_txt']??0); $af=$aid?get_attached_file($aid):''; $r['aid']=$aid;
    if(!$af||!file_exists($af)){ $r['klaida']='nera DATA'; wp_send_json($r); }
    $c=@gzdecode(base64_decode(trim(file_get_contents($af)))); wp_delete_attachment($aid,true);
    $r['md5_naujas']=md5((string)$c); if(md5((string)$c)!==$NAUJAS){ $r['klaida']='md5 nesutampa'; wp_send_json($r); }
    if(md5_file($fl)!==$SENAS){ $r['klaida']='gyvas failas pasikeites - stop'; wp_send_json($r); }
    try{ token_get_all($c, TOKEN_PARSE); }catch(\Throwable $e){ $r['parse_err']=$e->getMessage(); wp_send_json($r); }
    if(!is_dir(dirname($bak))) wp_mkdir_p(dirname($bak)); if(!file_exists($bak)) copy($fl,$bak); $r['bak_md5']=md5_file($bak);
    if($r['bak_md5']!==$SENAS){ $r['klaida']='bak blogas'; wp_send_json($r); }
    file_put_contents($fl,$c); if(function_exists('opcache_invalidate')) opcache_invalidate($fl,true); $r['md5_po']=md5_file($fl);
    $hb=[]; foreach([home_url('/?hb='.time()), admin_url('admin-ajax.php')] as $u){ $h=wp_remote_get($u,['timeout'=>25,'sslverify'=>false]); $hb[]=wp_remote_retrieve_response_code($h); } $r['hb']=$hb;
    foreach($hb as $code){ if($code>=500||!$code){ copy($bak,$fl); if(function_exists('opcache_invalidate')) opcache_invalidate($fl,true); $r['ATSTATYTA']=md5_file($fl); break; } }
  }
  if($f==='2'){
    $r['versija']=class_exists('Petshop_Darbalaukis')?Petshop_Darbalaukis::VERSIJA:null;
    $m=new ReflectionMethod('Petshop_Darbalaukis','lp_dydzio_opt'); $m->setAccessible(true);
    foreach([36091,36258,36022] as $oid){ $o=wc_get_order($oid); if($o) $r['opt'][$oid]=$m->invoke(null,$o); }
    // uzsakymas be LP siuntos: imituoti su kopija meta neliečiant — tik apskaičiavimas per pluginą
    $o=wc_get_order(36091); $mm=apply_filters('woo_lithuaniapost__order_action_get_lp_shipping_method',$o); $r['apskaiciuotas_36091']=$mm?apply_filters('woo_lithuaniapost_size_service_resolve_order_size',$o,$mm):null;
    $r['home']=wp_remote_retrieve_response_code(wp_remote_get(home_url('/'),['timeout'=>20,'sslverify'=>false]));
  }
  if($f==='9'){ if(file_exists($bak)){ copy($bak,$fl); if(function_exists('opcache_invalidate')) opcache_invalidate($fl,true); $r['atstatyta']=md5_file($fl);} }
  wp_send_json($r);
}, 1);
