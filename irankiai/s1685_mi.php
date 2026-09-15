<?php
/** TEMP PS S1685 mi — RECON read-only: refill_due laiško šablonas/turinys (ps_email_content, templates/emails/refill_due*), kaip variklis renderina (payload, reorder_url), dispatch klasė. */
add_action('init', function(){
  if (!isset($_GET['ps_s1685mi'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1685 mi');
  $o['content_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_email_content");
  $o['content']=$wpdb->get_results("SELECT * FROM {$p}ps_email_content WHERE flow_key LIKE '%refill%' OR flow_key LIKE '%post_purchase%'",ARRAY_A);
  foreach(glob(WP_PLUGIN_DIR.'/petshop-core/templates/emails/*') as $f) $o['tpl'][]=basename($f);
  foreach(array('refill_due','refill-due') as $n){ $f=WP_PLUGIN_DIR."/petshop-core/templates/emails/$n.php"; if(file_exists($f)) $o['tpl_src'][$n]=file_get_contents($f); }
  $e=WP_PLUGIN_DIR.'/petshop-core/includes/class-refill-engine.php'; $s=file_get_contents($e); $o['engine_len']=strlen($s);
  if(preg_match('/function\s+(send_refill_notice|dispatch_refill|.*refill_due.*)\s*\(/i',$s,$m)) $o['fn']=$m[1];
  $pos=strpos($s,'refill_due'); $o['engine_ctx']=substr($s,max(0,$pos-1500),3500);
  $o['jobs']=$wpdb->get_results("SELECT flow,flow_class,status,COUNT(*) n FROM {$p}ps_email_jobs GROUP BY 1,2,3",ARRAY_A);
  $j=$wpdb->get_row("SELECT subject,payload,context_json FROM {$p}ps_email_jobs WHERE flow='refill_due' ORDER BY id DESC LIMIT 1",ARRAY_A); $o['job_pvz']=$j;
  $o['render']=array_values(array_filter(get_declared_classes(),function($c){return stripos($c,'petshop')===0&&(stripos($c,'email')!==false||stripos($c,'mail')!==false||stripos($c,'dispatch')!==false);}));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
