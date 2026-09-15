<?php
/** TEMP PS S1686 ml — READ-ONLY: analitikos rinkiklio serverinis įvykio įrašymas (Petshop_Analitika metodai, ps_web_ivykiai stulpeliai), product-calc.js enqueue handle ir skaičiuoklės root selektorius. */
add_action('init', function(){
  if (!isset($_GET['ps_s1686ml'])) return; global $wpdb; $o=array('v'=>'S1686 ml');
  $A=file(WPMU_PLUGIN_DIR.'/petshop-analitika.php'); foreach($A as $i=>$l) if(preg_match('/public static function|\$wpdb->insert|register_rest_route/',$l)) $o['analitika'][]=($i+1).': '.trim(mb_substr($l,0,170));
  $o['ivykiai_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$wpdb->prefix}ps_web_ivykiai");
  $o['ivykiai_pvz']=$wpdb->get_results("SELECT * FROM {$wpdb->prefix}ps_web_ivykiai WHERE tipas='skaiciuokle' ORDER BY id DESC LIMIT 2",ARRAY_A);
  $core=WP_PLUGIN_DIR.'/petshop-core';
  $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($core.'/includes')); foreach($it as $f){ if(substr($f,-4)!=='.php') continue; $L=file($f); foreach($L as $i=>$l) if(preg_match('/product-calc\.js|ps-calc-w|ps-calc-root|data-ps-calc|class="ps-calc/',$l)) $o['calc_ui'][]=basename($f).':'.($i+1).': '.trim(mb_substr($l,0,170)); }
  $J=file($core.'/assets/product-calc.js'); $o['js_12_40']=implode("\n",array_map('trim',array_slice($J,11,30)));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
