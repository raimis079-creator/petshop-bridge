<?php
add_action('init', function(){ if (!isset($_GET['ps_s1684mu'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'mu');
  foreach(array('class-refill-engine.php','class-feeding-service.php','class-pet-profile.php','class-refill-feedback.php','class-reminders.php') as $b){ $f=WP_PLUGIN_DIR.'/petshop-core/includes/'.$b; if(!file_exists($f)) continue; $L=explode("\n",file_get_contents($f)); foreach($L as $i=>$l) if(preg_match('/daily|dienos_norma|norma|grams_per_day|g_per_day|days_supply|days_left|pet_id|predicted_empty|feeding_service|Feeding_Service|refill/i',$l)&&!preg_match('/^\s*\*|^\s*\/\//',$l)) $o[$b][]=($i+1).': '.trim(mb_substr($l,0,170)); }
  $o['pets']=$wpdb->get_row("SELECT COUNT(*) n, SUM(created_at>='2026-09-08') nauji FROM {$p}ps_pets",ARRAY_A); $o['pets_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_pets");
  $o['pet_products']=$wpdb->get_col("SHOW TABLES LIKE '{$p}ps_pet%'");
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit; });
