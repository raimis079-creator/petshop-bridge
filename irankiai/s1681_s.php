<?php
/** TEMP PS S1681 s — read-only: zonos 2 (EE/LV) Venipak pickup inst 5 pilni nustatymai, plugino calculate_shipping (PVM), savi siuntimo kainos filtrai, prices_include_tax. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681s'])) return; global $wpdb; $o=array('v'=>'S1681 s');
  $o['inst5']=get_option('woocommerce_shopup_venipak_shipping_pickup_method_5_settings'); $o['inst3']=get_option('woocommerce_shopup_venipak_shipping_pickup_method_3_settings'); $o['inst2']=get_option('woocommerce_shopup_venipak_shipping_courier_method_2_settings');
  $o['tax']=array('prices_include_tax'=>get_option('woocommerce_prices_include_tax'),'calc_taxes'=>get_option('woocommerce_calc_taxes'),'ship_tax_class'=>get_option('woocommerce_shipping_tax_class'),'display_cart'=>get_option('woocommerce_tax_display_cart'));
  $o['rates']=$wpdb->get_results("SELECT tax_rate_country c,tax_rate r,tax_rate_class cl,tax_rate_shipping s FROM {$wpdb->prefix}woocommerce_tax_rates",ARRAY_A);
  $f=WP_PLUGIN_DIR.'/wc-venipak-shipping/admin/class-woocommerce-shopup-venipak-shipping-admin-pickup.php'; $s=file_get_contents($f); $i=strpos($s,'function calculate_shipping'); $o['calc']=substr($s,$i,1800);
  foreach(array_merge(glob(WPMU_PLUGIN_DIR.'/*.php'),glob(WP_PLUGIN_DIR.'/petshop-*/{,*/}*.php',GLOB_BRACE)) as $f){ $s=file_get_contents($f); if(preg_match_all('/^.*(woocommerce_package_rates|woocommerce_shipping_rate_cost|min_amount_for_free_shipping|nemokam\w* pristat|free_shipping).*$/mi',$s,$m)) $o['filtrai'][str_replace(ABSPATH,'',$f)]=array_slice(array_map(function($x){return substr(trim($x),0,160);},$m[0]),0,6); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
