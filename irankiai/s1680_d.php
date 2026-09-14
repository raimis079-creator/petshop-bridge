<?php
/** TEMP PS S1680 d — read-only: LP plugino order-service ir order-actions metodų kūnai (lipduko kelias). */
add_action('init', function(){
  if (!isset($_GET['ps_s1680d'])) return; $o=array('v'=>'S1680 d'); $dir=WP_PLUGIN_DIR.'/woo-lithuaniapost-main/admin/';
  $get=function($file,$names)use($dir,&$o){ $c=file_get_contents($dir.$file); $t=token_get_all($c); $n=count($t); $out=array();
    for($i=0;$i<$n;$i++){ if(is_array($t[$i])&&$t[$i][0]===T_FUNCTION){ for($j=$i+1;$j<$n&&!(is_array($t[$j])&&$t[$j][0]===T_STRING);$j++); $nm=$t[$j][1]??''; if(!in_array($nm,$names)) continue; $depth=0;$s='';$k=$j; for(;$k<$n;$k++){ $tok=is_array($t[$k])?$t[$k][1]:$t[$k]; $s.=$tok; if($tok==='{')$depth++; if($tok==='}'){$depth--; if($depth===0) break;} } $out[$nm]=preg_replace('/[ \t]+/',' ',preg_replace('/\n\s*\n/',"\n",$s)); } }
    $o[$file]=$out; };
  $get('class-woo-lithuaniapost-admin-order-service.php',array('__construct','handle_generate_stickers','handle_initiate_shipping','on_initiate_success','download_labels','is_shipping_initiated','is_ready_to_initiated','get_instance','instance'));
  $get('class-woo-lithuaniapost-admin-order-actions.php',array('__construct','process_print_label','process_create_parcel'));
  $get('api/class-woo-lithuaniapost-admin-sticker-api.php',array('get_stickers','download_stickers_pdf'));
  $c=file_get_contents($dir.'class-woo-lithuaniapost-admin-order-service.php'); preg_match('/class\s+(\w+)[^{]*/',$c,$m); $o['svc_class']=$m[0]??''; preg_match_all('/(?:private|protected|public)\s+\$(\w+)/',$c,$m2); $o['svc_props']=array_unique($m2[1]);
  $c=file_get_contents($dir.'class-woo-lithuaniapost-admin-order-actions.php'); preg_match('/class\s+(\w+)[^{]*/',$c,$m); $o['act_class']=$m[0]??'';
  $c=file_get_contents(WP_PLUGIN_DIR.'/woo-lithuaniapost-main/includes/class-woo-lithuaniapost.php'); preg_match_all('/new\s+Woo_Lithuaniapost_Admin_Order_(Service|Actions)\s*\([^;]*;/',$c,$m3); $o['new']=$m3[0];
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
