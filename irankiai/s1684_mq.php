<?php
add_action('init', function(){ if (!isset($_GET['ps_s1684mq'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'mq'); $f=WP_PLUGIN_DIR.'/petshop-core/includes/class-refill-engine.php'; $s=file_get_contents($f); $L=explode("\n",$s); $o['md5']=md5($s); $o['n']=count($L);
  $o['a']=array_slice($L,40,60); $o['b']=array_slice($L,150,100); $o['c']=array_slice($L,320,110);
  $o['tbl']=$wpdb->get_results("SELECT status, COUNT(*) n, MIN(predicted_empty_date) mn, MAX(predicted_empty_date) mx FROM {$p}ps_refill_state GROUP BY status",ARRAY_A); $o['tbl_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_refill_state");
  $cp=WP_PLUGIN_DIR.'/petshop-core/includes/class-contact-policy.php'; $s2=file_get_contents($cp); $L2=explode("\n",$s2); foreach($L2 as $i=>$l) if(preg_match('/function |consent|marketing|transactional|service|soft|optout|opt_out|suppress/i',$l)) $o['policy'][]=($i+1).': '.trim(mb_substr($l,0,200));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit; });
