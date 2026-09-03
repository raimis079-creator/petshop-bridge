<?php
/** TEMP PS S1609 run e5r — recon sekimo laiškui (#5) */
add_action('init', function(){
  if (!isset($_GET['ps_e5r'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e5r'])); $o=array('v'=>'run e5r','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $o['host']=$_SERVER['HTTP_HOST']??''; $o['dev_pastas']=array('md5'=>md5_file(WPMU_PLUGIN_DIR.'/petshop-dev-pastas.php'),'leisti'=>get_option('ps_dev_pastas_leisti'),'zurnalas_n'=>count((array)get_option('ps_dev_pastas_zurnalas',array())));
  $t=WPMU_PLUGIN_DIR.'/petshop-siuntu-laiskai.php'; $c=file_get_contents($t); $o['sl']=array('bytes'=>strlen($c),'md5'=>md5($c),'b64'=>base64_encode($c));
  $o['dl']=array('v'=>Petshop_Darbalaukis::VERSIJA,'md5'=>md5_file(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'));
  // Venipak / LP sekimo URL
  foreach(array('venipak'=>WP_PLUGIN_DIR.'/wc-venipak-shipping','lp'=>WP_PLUGIN_DIR.'/woo-lithuaniapost-main') as $k=>$dir){ $o['track'][$k]=array(); if(!is_dir($dir)){ $o['track'][$k]='nėra '.$dir; $o['plugins']=array_map('basename',glob(WP_PLUGIN_DIR.'/*',GLOB_ONLYDIR)); continue; }
    $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir)); foreach($it as $fl){ if(substr($fl,-4)!=='.php') continue; $s=file_get_contents($fl); if(preg_match_all('/https?:\/\/[^\s\'"]*(track|sek)[^\s\'"]*/i',$s,$m)){ foreach(array_unique($m[0]) as $u) $o['track'][$k][]=str_replace(WP_PLUGIN_DIR,'',$fl).' → '.$u; } } $o['track'][$k]=array_slice(array_unique($o['track'][$k]),0,15); }
  // _ps_siuntos pavyzdžiai
  $ids=$wpdb->get_col("SELECT order_id FROM {$p}wc_orders_meta WHERE meta_key='_ps_siuntos' ORDER BY id DESC LIMIT 4");
  foreach($ids as $oid){ $oo=wc_get_order($oid); if(!$oo) continue; $o['siuntos'][$oid]=array('st'=>$oo->get_status(),'shipments'=>$oo->get_meta('_ps_shipments'),'ps_siuntos'=>$oo->get_meta('_ps_siuntos'),'dalys_issiusta'=>$oo->get_meta('_ps_dalys_issiusta'),'sekimo_siusta'=>$oo->get_meta('_ps_sekimo_siusta'),'vez'=>$oo->get_shipping_method(),'venipak_raw'=>mb_substr((string)(is_array($oo->get_meta('venipak_shipping_order_data'))?json_encode($oo->get_meta('venipak_shipping_order_data')):$oo->get_meta('venipak_shipping_order_data')),0,400)); }
  $o['dalys_iss_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_orders_meta WHERE meta_key='_ps_dalys_issiusta'");
  // faktai #35450
  $r=new ReflectionMethod('Petshop_Darbalaukis','faktai'); $r->setAccessible(true); $z=new ReflectionMethod('Petshop_Darbalaukis','zurnalas'); $z->setAccessible(true);
  foreach(array(35450) as $oid){ $oo=wc_get_order($oid); if(!$oo) continue; $fk=$r->invoke(null,$oo,$z->invoke(null,array($oid))); $e=array(); foreach($fk['eil'] as $l){ $e[]=array('iid'=>$l['iid'],'q'=>$l['q'],'n'=>mb_substr($l['n'],0,40),'src'=>$l['src'],'k'=>$l['k'],'gauta'=>$l['gauta'],'img'=>$l['img']?'yes':''); } $o['faktai'][$oid]=array('st'=>$fk['st'],'vez'=>$fk['vez'],'eiles'=>$fk['eiles'],'dalys'=>$fk['dalys'],'tiesiai'=>$fk['tiesiai'],'eil'=>$e,'email'=>$oo->get_billing_email(),'vardas'=>$oo->get_billing_first_name(),'ship'=>$oo->get_shipping_method(),'pastomatas'=>$oo->get_meta('_venipak_pickup_point')?:$oo->get_meta('venipak_pickup_point')?:''); }
  // WC email nustatymai
  $o['wc_email']=array('base'=>get_option('woocommerce_email_base_color'),'bg'=>get_option('woocommerce_email_background_color'),'body_bg'=>get_option('woocommerce_email_body_background_color'),'text'=>get_option('woocommerce_email_text_color'),'header_img'=>get_option('woocommerce_email_header_image'),'footer'=>mb_substr((string)get_option('woocommerce_email_footer_text'),0,120),'from'=>get_option('woocommerce_email_from_address'));
  // kelio meta raktai pas venipak
  $o['venipak_meta_keys']=$wpdb->get_col("SELECT DISTINCT meta_key FROM {$p}wc_orders_meta WHERE meta_key LIKE '%venipak%' OR meta_key LIKE '%lithuaniapost%' OR meta_key LIKE '%lp_%' LIMIT 30");
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
