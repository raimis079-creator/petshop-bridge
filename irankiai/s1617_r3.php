<?php
/** TEMP PS S1617 run r3 — RECON (tik skaitymas) 3: temos completed laiško šablonas (528–640), darbalaukio eilutės JSON (815–850), skydelio JS (skKlaus / kiekio forma), veiksmų dispatcheris (985–1010), admin-post registracija (288–315), grizta_is_naujo pilnas, velavimo_laiskas (laiško šablonas), kiekio forma JS, WC guest_should_verify_email, Paysera nustatymai, AV_Source::resolve parašas/nuspresta. */
add_action('init', function(){
  if (!isset($_GET['ps_r3'])) return;
  $o=array('v'=>'S1617 r3'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $grep=function($file,$pat,$max=40,$ctx=0){ if(!is_file($file)) return 'nera:'.basename($file); $L=file($file); $r=array(); foreach($L as $i=>$l){ if(preg_match($pat,$l)){ $s=''; for($k=$i;$k<=$i+$ctx&&$k<count($L);$k++) $s.=trim($L[$k]).' '; $r[]=($i+1).': '.mb_substr($s,0,400); if(count($r)>=$max) break; } } return $r; };
  $fn=function($file,$name,$len=1800){ if(!is_file($file)) return 'nera'; $c=file_get_contents($file); $i=strpos($c,'function '.$name); return $i!==false?substr($c,$i,$len):'nerasta:'.$name; };
  $lines=function($file,$a,$b){ if(!is_file($file)) return 'nera'; $L=file($file); return implode('',array_slice($L,$a-1,$b-$a+1)); };
  $mu=WPMU_PLUGIN_DIR; $wc=WP_PLUGIN_DIR.'/woocommerce'; $th=get_stylesheet_directory(); $dl=$mu.'/petshop-darbalaukis.php';
  try{
    $o['tema_528_640']=$lines($th.'/functions.php',528,640);
    $o['dl_288_316']=$lines($dl,288,316);
    $o['dl_815_850']=$lines($dl,815,850);
    $o['dl_985_1012']=$lines($dl,985,1012);
    $o['dl_grizta_is_naujo']=$lines($dl,1713,1780);
    $o['dl_grizta_atsaukti']=$fn($dl,'grizta_atsaukti',2600);
    $o['dl_velavimo_laiskas']=$fn($dl,'velavimo_laiskas( $o',2400);
    $o['dl_eur']=$fn($dl,'eur(',300); $o['dl_dl_url']=$fn($dl,'dl_url(',500); $o['dl_grazinta']=$fn($dl,'grazinta( $o',1200);
    $o['dl_js_skKlaus']=$grep($dl,'/skKlaus|skPastaba\.|data-atidaryti|dl-kk|kiekio_forma|function kiekis|kkForma/',40,0);
    $o['dl_kiekio_html']=$fn($dl,'kiekio_html',1600);
    $o['dl_kiekis_vykdyti_head']=$fn($dl,'kiekis_vykdyti',2200);
    $o['dl_js_dialog']=$grep($dl,'/data-d\b|dlDialog|function dialog|confirm\(/',12,0);
    $o['dl_klausimai_eile']=$grep($dl,'/\'klausimai\'\s*=>|eiles\[\]\s*=\s*\'klausimai\'|\'Klausimai\'/',12,0);
    $o['dl_kortele_css']=$grep($dl,'/\.dl-sumos|\.dl-veiksmai|\.dl-kk|\.kk-forma|\.kkf/',10,0);
    $o['dl_row_json_js']=$grep($dl,'/JSON\.parse|data-r=|\.dataset\.r|rowData|const r=/',12,0);
    // WC guest verify
    $o['wc_guest_verify']=$fn($wc.'/includes/shortcodes/class-wc-shortcode-checkout.php','guest_should_verify_email',2200);
    $o['wc_email_verif_filters']=$grep($wc.'/includes/shortcodes/class-wc-shortcode-checkout.php','/apply_filters\(/',20,0);
    // Paysera nustatymai
    $ps=(array)get_option('woocommerce_paysera_settings',array()); $keep=array(); foreach($ps as $k=>$v){ if(preg_match('/status|test|enabled|list|title|description|payment_/i',$k)) $keep[$k]=is_scalar($v)?mb_substr((string)$v,0,60):json_encode($v); } $o['paysera_settings']=$keep;
    $o['paysera_settings_keys']=array_keys($ps);
    // AV_Source::resolve, nuspresta
    if(class_exists('Petshop_AV_Source')){ $rc=new ReflectionClass('Petshop_AV_Source'); $o['av_source_methods']=array_map(function($m){ return $m->getName().'('.implode(',',array_map(function($pp){ return ($pp->isOptional()?'?':'').'$'.$pp->getName(); },$m->getParameters())).')'; },$rc->getMethods(ReflectionMethod::IS_PUBLIC)); $o['av_source_resolve']=$fn($mu.'/petshop-av-source.php','resolve',2200); }
    $o['av_order_nuspresta']=$fn($mu.'/petshop-av-order.php','nuspresta',500);
    $o['partijos_av_preke']=$fn($mu.'/petshop-partijos.php','av_preke',700);
    // kliento-siuntos sargai (VerificationController) + blokas
    $o['ks_45_78']=$lines($mu.'/petshop-kliento-siuntos.php',45,78);
    // WC pay page: gateways filter vietos
    $o['wc_pay_gateways']=$grep($wc.'/templates/checkout/form-pay.php','/available_payment_gateways|needs_payment/',6,0);
    $o['wc_pay_gw_in_shortcode']=$grep($wc.'/includes/shortcodes/class-wc-shortcode-checkout.php','/available_payment_gateways|set_current_gateway|form-pay/',8,0);
    $o['sekmes']=count($o);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getFile().':'.$e->getLine(); }
  $J($o);
});
