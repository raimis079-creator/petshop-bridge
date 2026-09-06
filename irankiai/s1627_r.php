<?php
/** TEMP PS S1627 r — RECON: rolė ps_darbuotojas (teisės), Inga #5788, juostos punktų teisių sąlygos, visi ps-* admin puslapiai su reikalaujama teise, ataskaitų puslapiai. */
add_action('init', function(){
  if (!isset($_GET['ps_r11'])) return;
  $o=array('v'=>'S1627 r'); global $wpdb,$menu,$submenu; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $r=get_role('ps_darbuotojas'); $o['role_caps']=$r?array_keys(array_filter($r->capabilities)):'NĖRA'; $u=get_userdata(5788); $o['inga']=$u?array('login'=>$u->user_login,'roles'=>$u->roles,'caps_n'=>count($u->allcaps)):null;
  $rr=get_role('shop_manager'); $o['shop_manager_caps_n']=$rr?count(array_filter($rr->capabilities)):null;
  $j=(string)file_get_contents(WPMU_PLUGIN_DIR.'/petshop-juosta.php'); $L=explode("\n",$j); $g=array(); foreach($L as $k=>$l){ if(preg_match('/current_user_can|echo \$a\(|manage_woocommerce|edit_shop_orders|ps_darbuotojas|function meniu|admin_menu|remove_menu|menu-top|adminmenu/i',$l)) $g[]=($k+1).': '.mb_substr(trim($l),0,200); } $o['juosta']=$g;
  $pg=array(); foreach(glob(WPMU_PLUGIN_DIR.'/petshop-*.php') as $fp){ $c=(string)file_get_contents($fp); if(preg_match_all('/add_(?:sub)?menu_page\(\s*([^;]{0,260})/s',$c,$mm)){ foreach($mm[1] as $x){ $x=preg_replace('/\s+/',' ',$x); if(preg_match("/'(manage_woocommerce|edit_shop_orders|manage_options|read|edit_products|ps_[a-z_]+)'/",$x,$cap)&&preg_match("/'(ps-[a-z0-9_-]+|petshop-[a-z0-9_-]+)'/",$x,$sl)){ $pg[]=basename($fp).' | '.$sl[1].' | '.$cap[1]; } } } } $o['puslapiai']=$pg;
  $o['ataskaitos_failai']=array_map('basename',glob(WPMU_PLUGIN_DIR.'/petshop-ataskait*.php'));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
