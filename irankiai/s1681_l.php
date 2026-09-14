<?php
/** TEMP PS S1681 l — read-only: kur GA4 API prieiga (kontrolės failas, SA raktas, property id, token funkcija). */
add_action('init', function(){
  if (!isset($_GET['ps_s1681l'])) return; $o=array('v'=>'S1681 l');
  foreach(array_merge(glob(WPMU_PLUGIN_DIR.'/*.php'),glob(WP_PLUGIN_DIR.'/petshop-*/*.php')) as $f){ $s=file_get_contents($f);
    if(preg_match('/analyticsdata|runReport|properties\/\d+|ps_kontrole_paskutinis/',$s)){ $n=str_replace(ABSPATH,'',$f); preg_match_all('/^.*(analyticsdata|runReport|properties\/|service_account|private_key|oauth2\/token|function \w*(ga4|token|jwt|gsc)\w*\().*$/mi',$s,$m); $o[$n]=array_slice(array_map(function($x){return substr(trim($x),0,200);},$m[0]),0,25); } }
  global $wpdb; $o['opts']=$wpdb->get_col("SELECT CONCAT(option_name,' | ',LEFT(option_value,80)) FROM {$wpdb->prefix}options WHERE option_name LIKE 'ps_%sa%' OR option_name LIKE 'ps_%google%' OR option_name LIKE 'ps_%property%' OR option_name LIKE 'ps_%gsc%'");
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
