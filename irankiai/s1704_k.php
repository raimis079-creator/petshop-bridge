<?php
/** Plugin Name: TEMP PS S1704k kelio fiksavimas deploy+E2E */
add_action('init', function(){
  $f=(isset($_GET['ps_s1704k'])?$_GET['ps_s1704k']:''); if(!in_array($f,array('1','2','9'),true)) return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1704k','faze'=>$f);
  $B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBQZXRzaG9wIEtlbGlvIEZpa3NhdmltYXMKICogRGVzY3JpcHRpb246IHYxLjAgKFMxNzA0LCAyMDI2LTA5LTIyKSDigJQgZWlsdXTEl3Mga2VsacSFIChgX3BzX3NvdXJjZWApIGZpa3N1b2phIGphdSBLQVNPSkUsIG5lIHRpayBhcG1va8SXanVzLgogKgogKiBQUk9CTEVNQSAoUzE3MDQpOiBQYXlzZXJhIHBsdWdpbmFzIGBwcm9jZXNzX3BheW1lbnQoKWAgdmlkdWplIGt2aWXEjWlhIGB3Y19tYXliZV9yZWR1Y2Vfc3RvY2tfbGV2ZWxzKClgCiAqIGRhciBuZWFwbW9rxJdqdXMuIFR1byBtb21lbnR1IGBQZXRzaG9wX0FWX09yZGVyOjpmaWtzdW90aSgpYCBkYXIgbmVidXZvIHN1dmVpa8SZcyAoamlzIGthYm8gYW50CiAqIHBheW1lbnRfY29tcGxldGUgLyBwcm9jZXNzaW5nIC8gb24taG9sZCksIGVpbHV0xJdzIG5ldHVyxJdqbyBgX3BzX3NvdXJjZT1hdmAsIHRvZMSXbAogKiBgUGV0c2hvcF9BVl9SZWR1Y2U6OndjX2tpZWtpc2AgZmlsdHJhcyBXQyBudXJhxaF5bW8gbmVzdXN0YWJkxJcg4oaSIFdDIG51cmHFocSXIGBfc3RvY2tgLCBvIHBvIGFwbW9rxJdqaW1vCiAqIEFWIHZhcmlrbGlzIG51cmHFocSXIGFudHLEhSBrYXJ0xIUuIDEyNCBwcmVrxJdzLCA2MTMgdm50LiAoZ3J5bmFpIEFWIHByZWvEl3MsIGRhdWdpYXVzaWEgQW5pbW9uZGEpLgogKgogKiBTUFJFTkRJTUFTOiBrdmllxI1pYW0gdMSFIHBhdMSvIGBmaWtzdW90aSgpYCBhbnQgYHdvb2NvbW1lcmNlX2NoZWNrb3V0X29yZGVyX3Byb2Nlc3NlZGAgKHByaW8gNSkg4oCUCiAqIGppcyBzdXZlaWtpYSBQUklFxaAgdmFydMWzIGBwcm9jZXNzX3BheW1lbnQoKWAuIFZhcmlrbGnFsyBmYWlsYWkgbmVsaWVzdGk7IGBmaWtzdW90aSgpYCBpZGVtcG90ZW50acWha2FzLAogKiB0b2TEl2wgdsSXbGVzbmkga2FibGlhaSBhbnRyxIUga2FydMSFIG5lcGVyc2thacSNaXVvamEuIEJhY3MgdcW+c2FreW1hbXMga2VsaWFzIGlyIGFua3PEjWlhdSBidXZvIGZpa3N1b2phbWFzCiAqIHByaWXFoSBhcG1va8SXamltxIUgKG9uLWhvbGQpIOKAlCBlbGdlc3lzIHN1dmllbm9kaW5hbWFzLgogKgogKiBJxaBKVU5HVEk6IG9wY2lqYSBgcHNfa2VsaW9fZmlrc2F2aW1hc19pc2p1bmd0YWAgPSAxIChhcmJhIGnFoXRyaW50aSBmYWlsxIUpLgogKi8KaWYgKCAhIGRlZmluZWQoICdBQlNQQVRIJyApICkgeyBleGl0OyB9CgpjbGFzcyBQZXRzaG9wX0tlbGlvX0Zpa3NhdmltYXMgewoJY29uc3QgVkVSU0lKQSA9ICcxLjAnOwoKCXB1YmxpYyBzdGF0aWMgZnVuY3Rpb24gaW5pdCgpIHsKCQlhZGRfYWN0aW9uKCAnd29vY29tbWVyY2VfY2hlY2tvdXRfb3JkZXJfcHJvY2Vzc2VkJywgWyBfX0NMQVNTX18sICdrYXNvamUnIF0sIDUsIDEgKTsKCQlhZGRfYWN0aW9uKCAnd29vY29tbWVyY2Vfc3RvcmVfYXBpX2NoZWNrb3V0X29yZGVyX3Byb2Nlc3NlZCcsIFsgX19DTEFTU19fLCAna2Fzb2plJyBdLCA1LCAxICk7IC8vIGJsb2vFsyBrYXNhIChhdHNhcmdhaSkKCX0KCgkvKiogQHBhcmFtIGludHxXQ19PcmRlciAkb3JkZXJfaWQgKi8KCXB1YmxpYyBzdGF0aWMgZnVuY3Rpb24ga2Fzb2plKCAkb3JkZXJfaWQgKSB7CgkJaWYgKCBnZXRfb3B0aW9uKCAncHNfa2VsaW9fZmlrc2F2aW1hc19pc2p1bmd0YScgKSApIHsgcmV0dXJuOyB9CgkJaWYgKCAhIGNsYXNzX2V4aXN0cyggJ1BldHNob3BfQVZfT3JkZXInICkgfHwgISBtZXRob2RfZXhpc3RzKCAnUGV0c2hvcF9BVl9PcmRlcicsICdmaWtzdW90aScgKSApIHsgcmV0dXJuOyB9CgkJJG9yZGVyID0gaXNfYSggJG9yZGVyX2lkLCAnV0NfT3JkZXInICkgPyAkb3JkZXJfaWQgOiB3Y19nZXRfb3JkZXIoICRvcmRlcl9pZCApOwoJCWlmICggISAkb3JkZXIgKSB7IHJldHVybjsgfQoJCWlmICggUGV0c2hvcF9BVl9PcmRlcjo6bnVzcHJlc3RhKCAkb3JkZXIgKSApIHsgcmV0dXJuOyB9CgkJdHJ5IHsKCQkJUGV0c2hvcF9BVl9PcmRlcjo6Zmlrc3VvdGkoICRvcmRlciApOwoJCQkkb3JkZXItPnVwZGF0ZV9tZXRhX2RhdGEoICdfcHNfa2VsaWFzX2thc29qZScsIGN1cnJlbnRfdGltZSggJ215c3FsJyApICk7CgkJCSRvcmRlci0+c2F2ZSgpOwoJCX0gY2F0Y2ggKCBUaHJvd2FibGUgJGUgKSB7CgkJCWVycm9yX2xvZyggJ3BldHNob3Ata2VsaW8tZmlrc2F2aW1hczogJyAuICRlLT5nZXRNZXNzYWdlKCkgKTsKCQl9Cgl9Cn0KUGV0c2hvcF9LZWxpb19GaWtzYXZpbWFzOjppbml0KCk7Cg=='; $MD5='069e379ce342987b16de3bd4e69f0299';
  $dst=WPMU_PLUGIN_DIR.'/petshop-kelio-fiksavimas.php';
  try{
    global $wpdb; $p=$wpdb->prefix;
    if($f==='1'){
      $kodas=base64_decode($B64,true);
      if($kodas===false||md5($kodas)!==$MD5) throw new Exception('md5 nesutampa');
      if(file_exists($dst)) throw new Exception('failas jau yra: '.$dst);
      $tok=@token_get_all($kodas,TOKEN_PARSE); if(!$tok) throw new Exception('token_get_all nepavyko');
      $o['klase_uzimta']=class_exists('Petshop_Kelio_Fiksavimas');
      if($o['klase_uzimta']) throw new Exception('klase jau egzistuoja');
      if(file_put_contents($dst,$kodas)===false) throw new Exception('irasyti nepavyko');
      $o['irasyta']=$dst; $o['md5']=md5_file($dst);
      $r=wp_remote_get(home_url('/?ps_hb='.time()),array('timeout'=>20,'sslverify'=>false)); $hb=is_wp_error($r)?0:wp_remote_retrieve_response_code($r);
      $o['heartbeat']=$hb;
      if($hb>=500||$hb===0){ @unlink($dst); $o['ROLLBACK']='failas pasalintas'; }
    } elseif($f==='2'){
      add_filter('pre_wp_mail','__return_false',1);
      $o['klase']=class_exists('Petshop_Kelio_Fiksavimas');
      $o['kablys_prio']=has_action('woocommerce_checkout_order_processed',array('Petshop_Kelio_Fiksavimas','kasoje'));
      $pid=34889; $keys=array('_stock','_manage_stock','_stock_status','_ps_sandelis','_own_stock_qty');
      $bak=array('status'=>get_post_status($pid)); foreach($keys as $k) $bak[$k]=get_post_meta($pid,$k,true);
      $o['bak']=$bak;
      wp_update_post(array('ID'=>$pid,'post_status'=>'publish'));
      update_post_meta($pid,'_manage_stock','yes'); update_post_meta($pid,'_stock',10); update_post_meta($pid,'_stock_status','instock'); update_post_meta($pid,'_ps_sandelis','av'); delete_post_meta($pid,'_own_stock_qty');
      if(function_exists('ps_sources_sync_saugiai')) ps_sources_sync_saugiai($pid);
      wc_delete_product_transients($pid);
      $ord=wc_create_order(array('customer_id'=>0));
      $ord->set_billing_email('terra@gyvunai.lt'); $ord->set_billing_first_name('TESTAS'); $ord->set_billing_last_name('S1704'); $ord->set_billing_country('LT');
      $ord->add_product(wc_get_product($pid),2); $ord->set_payment_method('paysera'); $ord->calculate_totals(); $ord->save(); $oid=$ord->get_id(); $o['oid']=$oid;
      $ord->add_order_note('TESTAS S1704 — dvigubo nurasymo E2E, istrinti');
      // 1. kasa (kaip WC_Checkout)
      do_action('woocommerce_checkout_order_processed',$oid,array(),$ord);
      $ord=wc_get_order($oid); $it=current($ord->get_items());
      $o['po_kasos']=array('_ps_source'=>$it->get_meta('_ps_source'),'_ps_order_type'=>$ord->get_meta('_ps_order_type'),'_ps_kelias_kasoje'=>$ord->get_meta('_ps_kelias_kasoje'),'_stock'=>get_post_meta($pid,'_stock',true));
      // 2. Paysera process_payment imitacija
      wc_maybe_reduce_stock_levels($oid);
      $ord=wc_get_order($oid); $it=current($ord->get_items());
      $o['po_paysera']=array('_stock'=>get_post_meta($pid,'_stock',true),'_reduced_stock'=>$it->get_meta('_reduced_stock'),'_order_stock_reduced'=>$ord->get_meta('_order_stock_reduced'));
      // 3. apmokejimas
      $ord->payment_complete('TEST-S1704');
      $ord=wc_get_order($oid); $it=current($ord->get_items());
      $o['po_apmokejimo']=array('_stock'=>get_post_meta($pid,'_stock',true),'_ps_av_reduced_qty'=>$it->get_meta('_ps_av_reduced_qty'),'_reduced_stock'=>$it->get_meta('_reduced_stock'),'status'=>$ord->get_status());
      // 4. atsaukimas
      $ord->update_status('cancelled','TESTAS S1704');
      $o['po_atsaukimo']=array('_stock'=>get_post_meta($pid,'_stock',true));
      $o['pastabos']=array_map(function($n){return $n->content;},wc_get_order_notes(array('order_id'=>$oid,'limit'=>20)));
      $o['VERDIKTAS']=($o['po_kasos']['_ps_source']==='av' && (int)$o['po_paysera']['_stock']===10 && (int)$o['po_apmokejimo']['_stock']===8 && (int)$o['po_atsaukimo']['_stock']===10)?'OK':'FAIL';
      // valymas
      $ord->delete(true);
      foreach(array('ps_fakt_uzsakymai','ps_fakt_eilutes','ps_uzsakymu_ivykiai','ps_partijos_nurasymai') as $t){ if($wpdb->get_var("SHOW TABLES LIKE '{$p}{$t}'")){ $col=$wpdb->get_var("SHOW COLUMNS FROM {$p}{$t} LIKE 'order_id'"); if($col) $o['valyta'][$t]=$wpdb->query($wpdb->prepare("DELETE FROM {$p}{$t} WHERE order_id=%d",$oid)); } }
      wp_update_post(array('ID'=>$pid,'post_status'=>$bak['status']));
      foreach($keys as $k){ if($bak[$k]==='') delete_post_meta($pid,$k); else update_post_meta($pid,$k,$bak[$k]); }
      if(function_exists('ps_sources_sync_saugiai')) ps_sources_sync_saugiai($pid);
      wc_delete_product_transients($pid);
      $o['atstatyta']=array('status'=>get_post_status($pid),'_stock'=>get_post_meta($pid,'_stock',true),'_stock_status'=>get_post_meta($pid,'_stock_status',true));
    } else {
      if(file_exists($dst)){ rename($dst,$dst.'.off_s1704'); $o['isjungta']=$dst.'.off_s1704'; }
    }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
