<?php
/** TEMP PS S1680 f — read-only: kodėl checkout'e dingo LP paštomatų pasirinkimas — plugino public kabliai, nustatymai, kliento zonos, wp_options, klaidų žurnalas. */
add_action('init', function(){
  if (!isset($_GET['ps_s1680f'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1680 f');
  $d=WP_PLUGIN_DIR.'/woo-lithuaniapost-main/';
  $c=file_get_contents($d.'public/class-woo-lithuaniapost-public.php'); preg_match_all('/function\s+(\w+)\s*\(/',$c,$m); $o['public_fn']=$m[1];
  $c2=file_get_contents($d.'includes/class-woo-lithuaniapost.php'); preg_match_all('/add_(?:action|filter)\s*\(\s*[\'"]([^\'"]+)[\'"]\s*,\s*\$[\w>-]+\s*,\s*[\'"]([^\'"]+)[\'"]/',$c2,$m2); $o['hooks']=array_map(function($a,$b){return "$a→$b";},$m2[1],$m2[2]);
  preg_match_all('/if\s*\(([^)]*(module_active|is_module|active)[^)]*)\)/i',$c2,$m3); $o['module_cond']=array_slice($m3[1],0,5);
  foreach(array('woo_lithuaniapost_module_active','lpsettings_woo_lithuaniapost_address_pickup_id','lpsettings_woo_lithuaniapost_updated_version') as $k) $o['opt'][$k]=get_option($k);
  $o['lpsettings']=$wpdb->get_results("SELECT option_name n,LEFT(option_value,60) v FROM {$p}options WHERE option_name LIKE 'lpsettings%' OR option_name LIKE '%lithuaniapost%' ORDER BY 1",ARRAY_A);
  $z=WC_Shipping_Zones::get_zones(); foreach($z as $zz){ $o['zones'][]=array('z'=>$zz['zone_name'],'m'=>array_map(function($mm){return $mm->id.':'.$mm->instance_id.' '.$mm->title.' '.($mm->enabled==='yes'?'on':'OFF');},$zz['shipping_methods']));}
  $o['terminalai']=$wpdb->get_row("SELECT COUNT(*) n,MAX(updated) upd,SUM(country_code='LT') lt FROM {$p}woo_lithuaniapost_unisend_terminals",ARRAY_A); $o['e1']=$wpdb->last_error;
  if($o['e1']){ $o['term_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}woo_lithuaniapost_unisend_terminals"); }
  $o['transients']=$wpdb->get_col("SELECT option_name FROM {$p}options WHERE option_name LIKE '_transient_%lithuania%' OR option_name LIKE '_transient_%lp%terminal%' LIMIT 10");
  $log=dirname(ABSPATH).'/logs/php_error.log'; if(file_exists($log)){ $l=file($log); $o['log']=array_values(array_map(function($s){return substr($s,0,260);},array_filter(array_slice($l,-60),function($s){return stripos($s,'lithuania')!==false||stripos($s,'fatal')!==false;}))); }
  $o['cron_lp']=array(); foreach((array)_get_cron_array() as $ts=>$h){ foreach($h as $hk=>$x){ if(stripos($hk,'lithuania')!==false||stripos($hk,'lp_')!==false) $o['cron_lp'][]=date('m-d H:i',$ts).' '.$hk; } }
  $o['sargas_htaccess']=preg_grep('/RewriteRule|Deny|Require|admin-ajax|wp-json/',file(ABSPATH.'.htaccess'));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
