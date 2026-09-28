<?php
/** Plugin Name: TEMP PS S1731f be likucio valdymo: gavimas + av-limit v1.1 + juodrasciai (1 dry /2 deploy /3 patikra /4 juodrasciai /5 patikra /9 atstato) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1731f'])) return;
  $f=$_GET['ps_s1731f']; @set_time_limit(200); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1731f','faze'=>$f];
  $M=WP_CONTENT_DIR.'/mu-plugins/'; $A=dirname(rtrim(ABSPATH,'/')).'/ps-archyvas/';
  $GAV=$M.'petshop-gavimas.php'; $AVL=$M.'petshop-av-limit.php';
  $AV_OLD='e2860d11df21d968382497ed54557ee7'; $AV_NEW='80a5bc1cad6e985772335686a61dd244';
  $AV_B64='PD9waHAKLyoqCiAqIFBldHNob3AgQVYgTGltaXQgdjEuMSAoUzQ3NDsgUzE3MzEg4oCUIGJlIGxpa3XEjWlvIHZhbGR5bW8g4oaSIOKAnm7El3JhIikg4oCUIHBhcmRhdmltbyByaWJhIGnFoSBLRUxJxbIgxaFhbHRpbmnFsy4KICoKICogVFJFxIxJQVMgU0xVT0tTTklTIChSRUdJU1RSQVMgwqcxNy43LCDCpzE5KS4KICoKICogUFJPQkxFTUE6IFdvb0NvbW1lcmNlIHJpYm9qYSBwYWdhbCBgX3N0b2NrYCDigJQgVklFTk8gxaFhbHRpbmlvIGtpZWvEry4KICogUHJla8SXIGdhbGkgdHVyxJd0aSBBViAyIGlyIFZGIDc5NiwgbyBrbGllbnRhcyBuZWdhbMSXcyBudXBpcmt0aSAzLCBub3JzIHJlYWxpYWkgeXJhIDc5OC4KICoKICogVEFJU1lLTMSWIChSYWltaXMgwqcxNy40KToKICogICDigJ5LbGllbnR1aSBsaWt1xI1pbyBpxaF2aXMgbmVyZWlraWEgcm9keXRpLCBwcmluY2lwYXMgYXJiYSBwcmVrxJcgeXJhIGFyYmEgbsSXcmEsCiAqICAgIG8ga2FpIGppcyByZW5rYXNpLCBqaXMgbmVnYWxpIHBhaW10aSBtaW51c2luaW8gbGlrdcSNaW8uIgogKgogKiBLxIQgREFSTzoKICogICAtIGJlbmRyYSByaWJhID0gQVYgKyB0aWVrxJdqYXMgKHRpayB0b21zLCBrdXJpb3MgdHVyaSBBQlUpCiAqICAgLSBrbGllbnR1aSBza2FpxI1pdXMgTkVST0RPTUFTICh0aWsg4oCeeXJhIiAvIOKAnm7El3JhIikKICogICAtIEdSWU5BSSBBViBwcmVrxJdtcyBuaWVrbyBuZWtlacSNaWEg4oCUIGrFsyBgX3N0b2NrYCBpciB0YWlwIHRlaXNpbmdhcwogKgogKiBLTyBORURBUk86CiAqICAgLSBORUtFScSMSUEgYF9zdG9ja2AgcmVpa8WhbcSXcyAoc3luYyBqxIUgcGVycmHFoW8pCiAqICAgLSBORUtVUklBIHNhdm8gcmV6ZXJ2YWNpasWzIOKAlCBXb29Db21tZXJjZSBqYXUgdHVyaSAowqcxOC42KQogKgogKiBTQVVHSUtMSVM6IHZlaWtpYSBUSUsgdG9tcyBwcmVrxJdtcywga3VyaW9zIHR1cmkgYF9vd25fc3RvY2tfcXR5YCBJUiB0aWVrxJdqbwogKiDFoWFsdGluxK8uIFZpc29tcyBraXRvbXMg4oCUIFdvb0NvbW1lcmNlIGVsZ2lhc2kga2FpcCBhbmtzxI1pYXUuCiAqLwppZiAoICEgZGVmaW5lZCggJ0FCU1BBVEgnICkgKSB7IGV4aXQ7IH0KCmNsYXNzIFBldHNob3BfQVZfTGltaXQgewoKCXB1YmxpYyBzdGF0aWMgZnVuY3Rpb24gaW5pdCgpIHsKCQkvLyBiZW5kcmEgcmliYQoJCWFkZF9maWx0ZXIoICd3b29jb21tZXJjZV9wcm9kdWN0X2dldF9zdG9ja19xdWFudGl0eScsIFsgX19DTEFTU19fLCAnc3RvY2tfcXR5JyBdLCAyMCwgMiApOwoJCWFkZF9maWx0ZXIoICd3b29jb21tZXJjZV9wcm9kdWN0X3ZhcmlhdGlvbl9nZXRfc3RvY2tfcXVhbnRpdHknLCBbIF9fQ0xBU1NfXywgJ3N0b2NrX3F0eScgXSwgMjAsIDIgKTsKCQkvLyDigJ55cmEgLyBuxJdyYSIKCQlhZGRfZmlsdGVyKCAnd29vY29tbWVyY2VfcHJvZHVjdF9nZXRfc3RvY2tfc3RhdHVzJywgWyBfX0NMQVNTX18sICdzdG9ja19zdGF0dXMnIF0sIDIwLCAyICk7CgkJLy8gUzE3MzE6IHByZWvElyBiZSBsaWt1xI1pbyB2YWxkeW1vIG5lcGFyZHVvZGFtYSAobmVpIHBhcHJhc3RhLCBuZWkgdmFyaWFjaWphKQoJCWFkZF9maWx0ZXIoICd3b29jb21tZXJjZV9wcm9kdWN0X2dldF9zdG9ja19zdGF0dXMnLCBbIF9fQ0xBU1NfXywgJ2JlX3ZhbGR5bW8nIF0sIDI1LCAyICk7CgkJYWRkX2ZpbHRlciggJ3dvb2NvbW1lcmNlX3Byb2R1Y3RfdmFyaWF0aW9uX2dldF9zdG9ja19zdGF0dXMnLCBbIF9fQ0xBU1NfXywgJ2JlX3ZhbGR5bW8nIF0sIDI1LCAyICk7CgkJLy8ga2xpZW50dWkgc2thacSNaXVzIE5FUk9ET01BUwoJCWFkZF9maWx0ZXIoICd3b29jb21tZXJjZV9nZXRfYXZhaWxhYmlsaXR5X3RleHQnLCBbIF9fQ0xBU1NfXywgJ2F2YWlsYWJpbGl0eV90ZXh0JyBdLCAyMCwgMiApOwoJCWFkZF9maWx0ZXIoICd3b29jb21tZXJjZV9nZXRfc3RvY2tfaHRtbCcsIFsgX19DTEFTU19fLCAnc3RvY2tfaHRtbCcgXSwgMjAsIDIgKTsKCX0KCgkvKiogQXIgxaFpYWkgcHJla2VpIHRhaWtvbWEgZHZpZWrFsyDFoWFsdGluacWzIGxvZ2lrYS4gKi8KCXByb3RlY3RlZCBzdGF0aWMgZnVuY3Rpb24gdGFpa29tYSggJHByb2R1Y3RfaWQgKSB7CgkJaWYgKCAhIGNsYXNzX2V4aXN0cyggJ1BldHNob3BfQVZfU3RvY2snICkgKSB7IHJldHVybiBmYWxzZTsgfQoJCSRhdiA9IFBldHNob3BfQVZfU3RvY2s6OnF0eSggJHByb2R1Y3RfaWQgKTsKCQlpZiAoIG51bGwgPT09ICRhdiApIHsgcmV0dXJuIGZhbHNlOyB9ICAgICAgICAgICAgICAgLy8gQVYgbmV0dXJpIOKAlCBuaWVrbyBuZWtlacSNaWFtCgkJaWYgKCAhIGNsYXNzX2V4aXN0cyggJ1BldHNob3BfRnVsZmlsbG1lbnRfU291cmNlJyApICkgeyByZXR1cm4gZmFsc2U7IH0KCQkkcyA9IFBldHNob3BfRnVsZmlsbG1lbnRfU291cmNlOjpyZXNvbHZlKCAoaW50KSAkcHJvZHVjdF9pZCApWydzb3VyY2UnXTsKCQlyZXR1cm4gKCAnbGVnYWN5JyAhPT0gJHMgKTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdyeW5haSBBViDigJQgbmlla28gbmVrZWnEjWlhbQoJfQoKCS8qKiBCZW5kcmFzIGtpZWtpcyA9IEFWICsgdGlla8SXamFzLiAqLwoJcHVibGljIHN0YXRpYyBmdW5jdGlvbiBzdG9ja19xdHkoICRxdHksICRwcm9kdWN0ICkgewoJCWlmICggISBpc19hKCAkcHJvZHVjdCwgJ1dDX1Byb2R1Y3QnICkgKSB7IHJldHVybiAkcXR5OyB9CgkJJHBpZCA9ICRwcm9kdWN0LT5nZXRfaWQoKTsKCQlpZiAoICEgc2VsZjo6dGFpa29tYSggJHBpZCApICkgeyByZXR1cm4gJHF0eTsgfQoJCSRhdiA9IChpbnQpIFBldHNob3BfQVZfU3RvY2s6OnF0eSggJHBpZCApOwoJCSR0aWVrID0gKGludCkgJHF0eTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV0MgYF9zdG9ja2AgPSB0aWVrxJdqbyBraWVraXMKCQlyZXR1cm4gJGF2ICsgbWF4KCAwLCAkdGllayApOwoJfQoKCS8qKiDigJ55cmEiLCBqZWkgYmVudCB2aWVuYXMgxaFhbHRpbmlzIHR1cmkuICovCglwdWJsaWMgc3RhdGljIGZ1bmN0aW9uIHN0b2NrX3N0YXR1cyggJHN0YXR1cywgJHByb2R1Y3QgKSB7CgkJaWYgKCAhIGlzX2EoICRwcm9kdWN0LCAnV0NfUHJvZHVjdCcgKSApIHsgcmV0dXJuICRzdGF0dXM7IH0KCQkkcGlkID0gJHByb2R1Y3QtPmdldF9pZCgpOwoJCWlmICggISBzZWxmOjp0YWlrb21hKCAkcGlkICkgKSB7IHJldHVybiAkc3RhdHVzOyB9CgkJJGF2ID0gKGludCkgUGV0c2hvcF9BVl9TdG9jazo6cXR5KCAkcGlkICk7CgkJaWYgKCAkYXYgPiAwICkgeyByZXR1cm4gJ2luc3RvY2snOyB9CgkJcmV0dXJuICRzdGF0dXM7Cgl9CgoJLyoqCgkgKiBTMTczMSAoMjAyNi0wOS0yOCk6IHByZWvElyBiZSBsaWt1xI1pbyB2YWxkeW1vID0g4oCebsSXcmEiLgoJICogIzEyMDg6IOKAnlN0aXJub3MgYXVzaXMiIHN1a3VydGEgcGVyIEdhdmltxIUgc3UgbWFuYWdlX3N0b2NrPW5vIGlyIGJlIHBhcnRpam9zIOKAlAoJICogV29vQ29tbWVyY2UgasSFIGxhaWvElyBuZXJpYm90YWkgdHVyaW1hIGlyIHBhcmRhdsSXIDUgdm50Liwga3VyacWzIG5lYnV2by4KCSAqIEnFoWltdHlzOiBEUCBwYWthaSAobGlrdXRpcyBpxaEgYmF6aW7El3MpLCBwYXNsYXVnb3M7IHJpbmtpbmlhaS92YXJpYWNpbmlhaSB0xJd2YWkKCSAqIMSNaWEgbmVwYXRlbmthIChuZSBzaW1wbGUvdmFyaWF0aW9uIHRpcGFzKS4gScWhanVuZ3RpOiBvcGNpamEgYHBzX2JlX3ZhbGR5bW9faXNqdW5ndGFgLgoJICovCglwdWJsaWMgc3RhdGljIGZ1bmN0aW9uIGJlX3ZhbGR5bW8oICRzdGF0dXMsICRwcm9kdWN0ICkgewoJCWlmICggJ291dG9mc3RvY2snID09PSAkc3RhdHVzIHx8ICEgaXNfYSggJHByb2R1Y3QsICdXQ19Qcm9kdWN0JyApICkgeyByZXR1cm4gJHN0YXR1czsgfQoJCWlmICggISAkcHJvZHVjdC0+aXNfdHlwZSggYXJyYXkoICdzaW1wbGUnLCAndmFyaWF0aW9uJyApICkgKSB7IHJldHVybiAkc3RhdHVzOyB9CgkJaWYgKCAkcHJvZHVjdC0+Z2V0X21hbmFnZV9zdG9jaygpICkgeyByZXR1cm4gJHN0YXR1czsgfSAgICAgICAgICAvLyB0cnVlIGFyYmEgJ3BhcmVudCcKCQlpZiAoICcnICE9PSAoc3RyaW5nKSAkcHJvZHVjdC0+Z2V0X21ldGEoICdfZHBfYmFzZV9wcm9kdWN0X2lkJyApICkgeyByZXR1cm4gJHN0YXR1czsgfQoJCWlmICggJ3Bhc2xhdWdhJyA9PT0gc3RydG9sb3dlciggKHN0cmluZykgJHByb2R1Y3QtPmdldF9tZXRhKCAnX3BzX3NhbmRlbGlzJyApICkgKSB7IHJldHVybiAkc3RhdHVzOyB9CgkJaWYgKCBnZXRfb3B0aW9uKCAncHNfYmVfdmFsZHltb19pc2p1bmd0YScgKSApIHsgcmV0dXJuICRzdGF0dXM7IH0KCQlyZXR1cm4gJ291dG9mc3RvY2snOwoJfQoKCS8qKiBLbGllbnR1aSDigJQgYmUgc2thacSNaWF1cy4gKi8KCXB1YmxpYyBzdGF0aWMgZnVuY3Rpb24gYXZhaWxhYmlsaXR5X3RleHQoICR0ZXh0LCAkcHJvZHVjdCApIHsKCQlpZiAoICEgaXNfYSggJHByb2R1Y3QsICdXQ19Qcm9kdWN0JyApICkgeyByZXR1cm4gJHRleHQ7IH0KCQlpZiAoIGlzX2FkbWluKCkgJiYgISB3cF9kb2luZ19hamF4KCkgKSB7IHJldHVybiAkdGV4dDsgfQoJCWlmICggISAkcHJvZHVjdC0+aXNfaW5fc3RvY2soKSApIHsgcmV0dXJuICR0ZXh0OyB9CgkJLy8g4oCeVHVyaW1lICgxMjcpIiDihpIg4oCeVHVyaW1lIgoJCXJldHVybiBwcmVnX3JlcGxhY2UoICcvXHMqXChccypcZCtbXildKlwpXHMqJC91JywgJycsIChzdHJpbmcpICR0ZXh0ICk7Cgl9CgoJLyoqIFRhcyBwYXRzIEhUTUwgbHlnbWVueWplIOKAlCBqZWkgdGVtYSByb2RvIHNhdm8gdmFyaWFudMSFLiAqLwoJcHVibGljIHN0YXRpYyBmdW5jdGlvbiBzdG9ja19odG1sKCAkaHRtbCwgJHByb2R1Y3QgKSB7CgkJaWYgKCBpc19hZG1pbigpICYmICEgd3BfZG9pbmdfYWpheCgpICkgeyByZXR1cm4gJGh0bWw7IH0KCQlpZiAoICEgaXNfYSggJHByb2R1Y3QsICdXQ19Qcm9kdWN0JyApIHx8ICEgJHByb2R1Y3QtPmlzX2luX3N0b2NrKCkgKSB7IHJldHVybiAkaHRtbDsgfQoJCXJldHVybiBwcmVnX3JlcGxhY2UoICcvXHMqXChccypcZCtbXildKlwpL3UnLCAnJywgKHN0cmluZykgJGh0bWwgKTsKCX0KfQpQZXRzaG9wX0FWX0xpbWl0Ojppbml0KCk7Cg==';
  $RX='#\$prod->set_manage_stock\(\s*false\s*\);\s*/\* likuti valdo partijos \(FEFO\) \*/#';
  $REP="\$prod->set_manage_stock( true );       /* S1731: likutis 0 ir „nėra\", kol nepriimta partija (#1208) */\n\t\t\$prod->set_stock_quantity( 0 );\n\t\t\$prod->set_stock_status( 'outofstock' );";
  $IDS=[34908,34896,34902,20971,23804];
  $busena=function($id){ clean_post_cache($id); wc_delete_product_transients($id); $p=wc_get_product($id); if(!$p) return null; return ['st'=>get_post_status($id),'ms'=>get_post_meta($id,'_manage_stock',true),'stock'=>get_post_meta($id,'_stock',true),'ss_meta'=>get_post_meta($id,'_stock_status',true),'ss_view'=>$p->get_stock_status(),'is_in_stock'=>$p->is_in_stock()]; };
  $poveikis=function() use($wpdb,$P){ // ka naujas filtras pavers „nera" tarp publikuotu
    $ids=$wpdb->get_col("SELECT p.ID FROM {$P}posts p JOIN {$P}postmeta m ON m.post_id=p.ID AND m.meta_key='_manage_stock' AND m.meta_value='no' WHERE p.post_type IN('product','product_variation') AND p.post_status='publish'");
    $o=[]; foreach($ids as $id){ $pr=wc_get_product($id); if(!$pr||!$pr->is_type(['simple','variation'])) continue; if($pr->get_manage_stock()) continue; if($pr->get_meta('_dp_base_product_id')!=='') continue; if(strtolower((string)$pr->get_meta('_ps_sandelis'))==='paslauga') continue; if($pr->is_type('variation') && get_post_status($pr->get_parent_id())!=='publish') continue; $o[]=[(int)$id,$pr->get_type(),mb_substr($pr->get_name(),0,50),get_post_meta($id,'_stock_status',true)]; }
    return $o; };
  $hb=function(){ $x=wp_remote_get(home_url('/?ps_hb='.time()),['timeout'=>25,'sslverify'=>false]); return is_wp_error($x)?'ERR '.$x->get_error_message():wp_remote_retrieve_response_code($x); };
  try{
  if($f==='1'){
    $r['gav_md5']=md5_file($GAV); $r['gav_atitikmenu']=preg_match_all($RX,file_get_contents($GAV));
    $r['av_md5']=md5_file($AVL); $r['av_md5_ok']=($r['av_md5']===$AV_OLD); $r['av_new_md5_b64']=md5(base64_decode($AV_B64));
    $r['archyvas']=is_dir($A)&&is_writable($A);
    $r['wc_manage_stock']=get_option('woocommerce_manage_stock'); $r['notify_no_stock']=get_option('woocommerce_notify_no_stock_amount');
    $r['poveikis_publikuotoms']=$poveikis();
    foreach($IDS as $id) $r['juodr'][$id]=$busena($id);
    $r['paslauga_35790']=$busena(35790);
  }
  if($f==='2'){
    if(md5_file($AVL)!==$AV_OLD) throw new Exception('av-limit md5 nesutampa');
    $av=base64_decode($AV_B64); if(md5($av)!==$AV_NEW) throw new Exception('av-limit naujas md5 blogas');
    $g=file_get_contents($GAV); $n=0; $g2=preg_replace($RX,$REP,$g,1,$n); if($n!==1) throw new Exception('gavimas: atitikmenu '.$n);
    token_get_all($av,TOKEN_PARSE); token_get_all($g2,TOKEN_PARSE);
    if(!copy($GAV,$A.'petshop-gavimas.php.bak_s1731')||!copy($AVL,$A.'petshop-av-limit.php.bak_s1731')) throw new Exception('bak nepavyko');
    file_put_contents($AVL,$av); file_put_contents($GAV,$g2);
    if(function_exists('opcache_invalidate')){ opcache_invalidate($AVL,true); opcache_invalidate($GAV,true); }
    $h=$hb(); $r['hb']=$h;
    if(!is_int($h)||$h>=500){ copy($A.'petshop-gavimas.php.bak_s1731',$GAV); copy($A.'petshop-av-limit.php.bak_s1731',$AVL); if(function_exists('opcache_invalidate')){ opcache_invalidate($AVL,true); opcache_invalidate($GAV,true); } $r['ATSTATYTA']=true; }
    $r['gav_md5']=md5_file($GAV); $r['av_md5']=md5_file($AVL);
  }
  if($f==='3'){
    $r['av_md5']=md5_file($AVL); $r['gav_md5']=md5_file($GAV); $r['metodas']=method_exists('Petshop_AV_Limit','be_valdymo'); $r['hb']=$hb();
    $src=file($GAV); foreach($src as $i=>$l){ if(strpos($l,'S1731')!==false) $r['gav_eil'][]=($i+1).': '.trim($l); }
    foreach($IDS as $id) $r['juodr_filtras'][$id]=$busena($id);
    $r['paslauga_35790']=$busena(35790);
    $dp=(int)$wpdb->get_var("SELECT pm.post_id FROM {$P}postmeta pm JOIN {$P}posts p ON p.ID=pm.post_id AND p.post_status='publish' JOIN {$P}postmeta s ON s.post_id=pm.post_id AND s.meta_key='_stock_status' AND s.meta_value='instock' WHERE pm.meta_key='_dp_base_product_id' LIMIT 1"); $r['dp_pakas']=[$dp,$busena($dp)];
    $r['poveikis_publikuotoms']=$poveikis();
    // gavimo -> partijos kelias ant laikinos prekes
    $p=new WC_Product_Simple(); $p->set_name('TEMP S1731 testas'); $p->set_status('draft'); $p->set_manage_stock(true); $p->set_stock_quantity(0); $p->set_stock_status('outofstock'); $tid=$p->save(); update_post_meta($tid,'_ps_sandelis','av');
    $r['test_po_kurimo']=$busena($tid);
    $m=new ReflectionMethod('Petshop_Partijos','rasyti_av_likuti'); $m->setAccessible(true); $m->invoke(null,$tid,3);
    $r['test_po_partijos_3']=$busena($tid);
    $q=new WC_Product_Simple($tid); $q->set_manage_stock(false); $q->set_stock_status('instock'); $q->save();
    $r['test_be_valdymo']=$busena($tid);
    wp_delete_post($tid,true); $r['test_istrinta']=(get_post($tid)===null);
  }
  if($f==='4'){
    $bak=get_option('ps_s1731_juodr_bak'); if(!$bak){ $bak=[]; foreach($IDS as $id) $bak[$id]=['ms'=>get_post_meta($id,'_manage_stock',true),'stock'=>get_post_meta($id,'_stock',true),'ss'=>get_post_meta($id,'_stock_status',true),'st'=>get_post_status($id)]; update_option('ps_s1731_juodr_bak',$bak,false); }
    foreach($IDS as $id){ $p=wc_get_product($id); if(!$p||$p->get_manage_stock()) continue; $p->set_manage_stock(true); $p->set_stock_quantity(0); $p->set_stock_status('outofstock'); $p->save(); }
    foreach($IDS as $id) $r['juodr'][$id]=$busena($id);
  }
  if($f==='9'){
    foreach(['petshop-gavimas.php'=>$GAV,'petshop-av-limit.php'=>$AVL] as $b=>$t){ if(is_file($A.$b.'.bak_s1731')){ copy($A.$b.'.bak_s1731',$t); if(function_exists('opcache_invalidate')) opcache_invalidate($t,true); $r['atstatyta'][$b]=md5_file($t); } }
    $bak=get_option('ps_s1731_juodr_bak'); if(is_array($bak)) foreach($bak as $id=>$b){ update_post_meta($id,'_manage_stock',$b['ms']); update_post_meta($id,'_stock',$b['stock']); update_post_meta($id,'_stock_status',$b['ss']); wc_delete_product_transients($id); $r['juodr_atstatyta'][]=$id; }
    $r['hb']=$hb();
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
