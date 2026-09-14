<?php
/** TEMP PS S1681 v — read-only: telefono numerio validacija kasoje — savi pluginai, Venipak, LP, tema. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681v'])) return; $o=array('v'=>'S1681 v');
  $files=array_merge(glob(WPMU_PLUGIN_DIR.'/*.php'),glob(WP_PLUGIN_DIR.'/{petshop-*,wc-venipak-shipping,woo-lithuania*,*lpexpress*}/{,*/,*/*/}*.php',GLOB_BRACE),glob(get_stylesheet_directory().'/{,*/}*.php',GLOB_BRACE));
  foreach($files as $f){ $s=file_get_contents($f); if(preg_match_all('/^.*(billing_phone|shipping_phone|\+370|\'370|"370|8\\\\d\{8\}|telefono numer|phone.*(preg_match|regex|pattern)|(preg_match|pattern).*phone|woocommerce_checkout_process|woocommerce_after_checkout_validation).*$/mi',$s,$m)){ $l=array_values(array_unique(array_map(function($x){return substr(trim($x),0,170);},$m[0]))); if(preg_grep('/370|preg_match|pattern|regex|\\\\d/',$l)) $o[str_replace(ABSPATH,'',$f)]=array_slice($l,0,10); } }
  $o['wc_phone_val']=get_option('woocommerce_checkout_phone_field');
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
