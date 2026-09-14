<?php
/** TEMP PS S1681 r — read-only: pristatymo zonos/metodai, Venipak plugino metodai ir šalys, leidžiamos šalys, nemokamo siuntimo taisyklės. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681r'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1681 r');
  $o['salys']=array('allowed'=>get_option('woocommerce_allowed_countries'),'specific'=>get_option('woocommerce_specific_allowed_countries'),'ship_to'=>get_option('woocommerce_ship_to_countries'),'ship_specific'=>get_option('woocommerce_specific_ship_to_countries'),'base'=>get_option('woocommerce_default_country'),'tax_based'=>get_option('woocommerce_tax_based_on'));
  foreach(WC_Shipping_Zones::get_zones() as $z){ $zz=array('id'=>$z['id'],'pav'=>$z['zone_name'],'loc'=>array_map(function($l){return $l->type.':'.$l->code;},$z['zone_locations']),'met'=>array()); foreach($z['shipping_methods'] as $m){ $zz['met'][]=array('inst'=>$m->instance_id,'id'=>$m->id,'pav'=>$m->title,'on'=>$m->enabled,'set'=>array_intersect_key($m->instance_settings,array_flip(array('cost','min_amount','requires','type','price','free_shipping_amount','enable_free_shipping','ignore_discounts','venipak_price','free_from','tax_status')))); } $o['zonos'][]=$zz; }
  $z0=new WC_Shipping_Zone(0); $o['zona0']=array_map(function($m){return $m->id.'#'.$m->instance_id.' '.$m->title.' on='.$m->enabled;},$z0->get_shipping_methods());
  $o['metodai']=array_keys(WC()->shipping()->get_shipping_methods());
  foreach(array_keys(WC()->shipping()->get_shipping_methods()) as $mid) if(stripos($mid,'venipak')!==false){ $m=WC()->shipping()->get_shipping_methods()[$mid]; $o['venipak'][$mid]=array('cls'=>get_class($m),'supports'=>$m->supports,'form'=>array_keys((array)$m->get_instance_form_fields())); }
  $o['venipak_opt']=$wpdb->get_results("SELECT option_name n,LEFT(option_value,300) v FROM {$p}options WHERE option_name LIKE '%venipak%' AND option_name NOT LIKE '_transient%' LIMIT 20",ARRAY_A);
  foreach(glob(WP_PLUGIN_DIR.'/*venipak*/*.php') as $f){ $s=file_get_contents($f); if(preg_match('/Plugin Name:\s*(.+)/',$s,$m)) $o['venipak_plug'][]=trim($m[1]).' '.basename(dirname($f)).' v'.(preg_match('/Version:\s*([\d.]+)/',$s,$mv)?$mv[1]:'?'); }
  foreach(glob(WP_PLUGIN_DIR.'/*venipak*/{,*/,*/*/}*.php',GLOB_BRACE) as $f){ $s=file_get_contents($f); if(preg_match_all('/^.*(\'LV\'|"LV"|\'EE\'|"EE"|countries|pickup|terminal|locker).*$/mi',$s,$m)) $o['venipak_salys'][basename($f)]=array_slice(array_unique(array_map(function($x){return substr(trim($x),0,160);},$m[0])),0,8); }
  $o['e']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
