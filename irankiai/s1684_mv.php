<?php
add_action('init', function(){ if (!isset($_GET['ps_s1684mv'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'mv');
  $f=WP_PLUGIN_DIR.'/petshop-core/includes/class-feeding-service.php'; $L=explode("\n",file_get_contents($f)); foreach($L as $i=>$l) if(preg_match('/^\s*(public|private|protected)?\s*static function|^\s*public function|grams_per_day|g_per_day|per_day|days_supply|\'days\'|dienu|weight_kg|current_weight/i',$l)) $o['fs'][]=($i+1).': '.trim(mb_substr($l,0,170));
  $o['fs_doc']=array_slice($L,18,40);
  $o['pets_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_pets");
  $o['pet_products_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_pet_products"); $o['pet_products_n']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_pet_products");
  $o['pets_su_svoriu']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_pets WHERE current_weight_kg>0 OR weight_kg>0");
  $f2=WP_PLUGIN_DIR.'/petshop-core/includes/class-product-calc.php'; if(file_exists($f2)){ $L2=explode("\n",file_get_contents($f2)); foreach($L2 as $i=>$l) if(preg_match('/static function|per_day|days/i',$l)) $o['pc'][]=($i+1).': '.trim(mb_substr($l,0,150)); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit; });
