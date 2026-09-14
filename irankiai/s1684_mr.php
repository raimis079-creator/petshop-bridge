<?php
add_action('init', function(){ if (!isset($_GET['ps_s1684mr'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'mr');
  $o['tracking']=$wpdb->get_results("SELECT status, COUNT(*) n, MIN(predicted_empty_date) mn, MAX(predicted_empty_date) mx, MIN(created_at) c0 FROM {$p}ps_refill_tracking GROUP BY status",ARRAY_A);
  $o['tracking_pvz']=$wpdb->get_results("SELECT product_id, purchase_count, avg_interval_days, predicted_empty_date, confidence, status FROM {$p}ps_refill_tracking ORDER BY id DESC LIMIT 5",ARRAY_A);
  foreach((array)_get_cron_array() as $ts=>$hooks) foreach($hooks as $h=>$x) if(stripos($h,'refill')!==false||stripos($h,'dispatch')!==false||stripos($h,'email')!==false) $o['cron'][]=$h.' @ '.date('Y-m-d H:i',$ts);
  $f=WP_PLUGIN_DIR.'/petshop-core/includes/class-email-dispatch.php'; $L=explode("\n",file_get_contents($f)); foreach($L as $i=>$l) if(preg_match("/'service'|'marketing'|has_consent|is_marketable|TRANSACTIONAL|holdout|class_gate|flow_class|function (enqueue|can_send|gate|decide|eligib)/i",$l)) $o['dispatch'][]=($i+1).': '.trim(mb_substr($l,0,200));
  $f=WP_PLUGIN_DIR.'/petshop-core/includes/class-refill-engine.php'; $L=explode("\n",file_get_contents($f)); $o['est']=array_slice($L,248,40); foreach($L as $i=>$l) if(preg_match('/INTERVAL_SMALL|INTERVAL_MEDIUM|schedule_event|cron|add_action/i',$l)) $o['re'][]=($i+1).': '.trim(mb_substr($l,0,160));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit; });
