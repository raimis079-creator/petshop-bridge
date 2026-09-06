<?php
/** TEMP PS S1628 r2 — RECON: WCDN class-frontend.php create_print_button_order_page (175–260), wcdn_settings raktai (templates / show* flags). */
add_action('init', function(){
  if (!isset($_GET['ps_r14'])) return;
  $o=array('v'=>'S1628 r2'); global $wpdb; $p=$wpdb->prefix; $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $f=WP_PLUGIN_DIR.'/woocommerce-delivery-notes/includes/frontend/class-frontend.php'; $L=explode("\n",(string)file_get_contents($f)); $r=array(); for($i=124;$i<260;$i++){ if(isset($L[$i])) $r[]=($i+1).': '.mb_substr(rtrim($L[$i]),0,190); } $o['frontend']=$r;
  $s=get_option('wcdn_settings'); $o['settings']=array(); foreach((array)$s as $k=>$v){ $o['settings'][$k]=is_scalar($v)?mb_substr((string)$v,0,60):json_encode($v,JSON_UNESCAPED_UNICODE); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
