<?php
/** TEMP PS S1628 r3 — RECON: WCDN Utils::get_template_types (filtras?), Frontend klasės namespace/singleton, šablonų enabled opcijos. */
add_action('init', function(){
  if (!isset($_GET['ps_r15'])) return;
  $o=array('v'=>'S1628 r3'); global $wpdb; $p=$wpdb->prefix; $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $d=WP_PLUGIN_DIR.'/woocommerce-delivery-notes/includes/'; $g=array(); foreach(glob($d.'{,*/}*.php',GLOB_BRACE) as $fp){ $c=(string)file_get_contents($fp); $L=explode("\n",$c); foreach($L as $k=>$l){ if(preg_match('/^namespace |function get_template_types|apply_filters\(\s*.wcdn_template_types|apply_filters\(\s*.wcdn_(get_)?template|new Frontend|Frontend::|function instance|\$this->frontend|frontend\s*=/i',$l)) $g[]=str_replace($d,'',$fp).':'.($k+1).': '.mb_substr(trim($l),0,170); } } $o['grep']=array_slice($g,0,40);
  $u=$d.'helpers/class-utils.php'; if(file_exists($u)){ $L=explode("\n",(string)file_get_contents($u)); foreach($L as $k=>$l){ if(strpos($l,'function get_template_types')!==false){ $o['get_template_types']=array_map(function($x){return mb_substr(rtrim($x),0,170);},array_slice($L,$k,30)); break; } } }
  $o['template_opt']=$wpdb->get_results("SELECT option_name,LEFT(option_value,120) v FROM {$p}options WHERE option_name LIKE 'wcdn_template%' OR option_name LIKE 'wcdn_%enabled%' ORDER BY option_name",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
