<?php
/** TEMP PS S1617 run r2 — RECON (tik skaitymas) „Pakartotinis užsakymas“ 2: variklių kūnai ant apmokėjimo (AV_Order::fiksuoti, AV_Reduce::mazinti, Partijos::uzsakymo_nurasymas, Faktai::rasyti/ar_testinis/surinkti_eilutes, Siuntos::uzbaigimo_sargas), desk laiškų išjungimas + STATUSAI, tema 380–530 (IAPV/AVPN kabliai), Paysera process_payment/callback/confirmOrder/isPaymentValid, WC order_received prisijungimo patikra, darbalaukio „Siunta grįžta“ kortelė/veiksmai/„Siųsti iš naujo“/laiškų siuntimas, juosta skaitikliai. */
add_action('init', function(){
  if (!isset($_GET['ps_r2'])) return;
  $o=array('v'=>'S1617 r2'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $grep=function($file,$pat,$max=40,$ctx=0){ if(!is_file($file)) return 'nera:'.basename($file); $L=file($file); $r=array(); foreach($L as $i=>$l){ if(preg_match($pat,$l)){ $s=''; for($k=$i;$k<=$i+$ctx&&$k<count($L);$k++) $s.=trim($L[$k]).' '; $r[]=($i+1).': '.mb_substr($s,0,300); if(count($r)>=$max) break; } } return $r; };
  $fn=function($file,$name,$len=1800){ if(!is_file($file)) return 'nera'; $c=file_get_contents($file); $i=strpos($c,'function '.$name); return $i!==false?substr($c,$i,$len):'nerasta:'.$name; };
  $lines=function($file,$a,$b){ if(!is_file($file)) return 'nera'; $L=file($file); return implode('',array_slice($L,$a-1,$b-$a+1)); };
  $mu=WPMU_PLUGIN_DIR; $wc=WP_PLUGIN_DIR.'/woocommerce'; $th=get_stylesheet_directory(); $dl=$mu.'/petshop-darbalaukis.php';
  try{
    $o['av_order_fiksuoti']=$fn($mu.'/petshop-av-order.php','fiksuoti',2600);
    $o['av_reduce_mazinti']=$fn($mu.'/petshop-av-reduce.php','mazinti',2400);
    $o['partijos_nurasymas']=$fn($mu.'/petshop-partijos.php','uzsakymo_nurasymas',1800);
    $o['faktai_rasyti']=$fn($mu.'/petshop-faktai.php','rasyti',2600); $o['faktai_ar_testinis']=$fn($mu.'/petshop-faktai.php','ar_testinis',900); $o['faktai_surinkti']=$fn($mu.'/petshop-faktai.php','surinkti_eilutes',3200);
    $o['siuntos_sargas']=$fn($mu.'/petshop-siuntu-laiskai.php','uzbaigimo_sargas',1800);
    $o['desk_300_325']=$lines($mu.'/petshop-desk.php',300,325); $o['desk_statusai']=$grep($mu.'/petshop-desk.php','/const STATUSAI|\'paruosta\'\s*=>|\'ivykdyti\'\s*=>|\'kelyje\'\s*=>/',8,0);
    $o['desk_klausimas']=$fn($mu.'/petshop-desk.php','klausimas',1600);
    $o['tema_380_530']=$lines($th.'/functions.php',380,530);
    $o['tema_doc_type']=$fn($th.'/functions.php','petshop_get_invoice_document_type',900);
    $o['tema_remove_inv']=$fn($th.'/functions.php','petshop_remove_invoice_from_processing_email',700);
    $pg=WP_PLUGIN_DIR.'/woo-payment-gateway-paysera/src/Entity/class-paysera-payment-gateway.php';
    $o['paysera_94_125']=$lines($pg,94,125); $o['paysera_125_225']=$lines($pg,125,225); $o['paysera_296_345']=$lines($pg,296,345);
    $o['wc_order_received']=$lines($wc.'/includes/shortcodes/class-wc-shortcode-checkout.php',262,320);
    $o['wc_order_pay_86_125']=$lines($wc.'/includes/shortcodes/class-wc-shortcode-checkout.php',86,125);
    // darbalaukis
    $o['dl_kortele_2436_2530']=$lines($dl,2436,2530);
    $o['dl_is_naujo']=$grep($dl,'/is_naujo|Siųsti iš naujo|siusti_is_naujo/',30,0);
    $o['dl_v_dispatch']=$grep($dl,'/case \'[a-z_]+\'\s*:|\'v\' === \$v|\$v === \'|\'grazinta\' ===|=== \'grazinta\'/',60,0);
    $o['dl_vykdyti_head']=$fn($dl,'vykdyti_veiksma',2600);
    $o['dl_grizta_atsaukti']=$fn($dl,'grizta_atsaukti',1400);
    $o['dl_wp_mail']=$grep($dl,'/wp_mail\(|->trigger\(|WC_Email|mailer\(\)/',30,0);
    $o['dl_consts']=$grep($dl,'/^\s*const [A-Z_]+/',40,0);
    $o['dl_d_helper']=$fn($dl,'d(',1200);
    $o['dl_faktai_head']=$fn($dl,'faktai( $o',3200);
    $o['dl_uzdarytas']=$grep($dl,'/\'uzdarytas\'\s*=>|\'paid\'\s*=>|\'grizta\'\s*=>|\'kl\'\s*=>/',12,0);
    $o['dl_velavimo']=$grep($dl,'/velavimo/',15,0);
    $o['dl_neapmoketi_use']=$grep($dl,'/neapmoketi\(\)|self::atviri\(\)|self::visi\(/',15,0);
    $o['ks_wp_mail']=$grep($mu.'/petshop-kliento-siuntos.php','/wp_mail\(|add_(action|filter)\(|function /',30,0);
    $o['juosta']=$grep($mu.'/petshop-juosta.php','/wc_get_orders|status|COUNT|pending|processing/',25,0);
    $o['dev_pastas']=$grep($mu.'/petshop-dev-pastas.php','/function |option|zurnalas|return/',20,0);
    $o['ivykiai_laiskas']=$fn($mu.'/petshop-uzsakymu-ivykiai.php','laiskas',1200);
    $o['payment_failed_pending']=$lines($mu.'/petshop-payment-failed.php',26,50);
    $o['sekmes']=count($o);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getFile().':'.$e->getLine(); }
  $J($o);
});
