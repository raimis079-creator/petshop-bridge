<?php
add_action('init', function(){ if (!isset($_GET['ps_s1684mo'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'mo');
  foreach(array('petshop-bacs-priminimas.php','petshop-laiskai.php','petshop-core/includes/class-refill-engine.php') as $rel){ $f=WPMU_PLUGIN_DIR.'/'.$rel; if(!file_exists($f)){ $o['nera'][]=$rel; continue; } $s=file_get_contents($f); $L=explode("\n",$s); $o[$rel]=array('md5'=>md5($s),'eil'=>count($L)); foreach($L as $i=>$l) if(preg_match('/ps_atkurti|function .*atkur|refill_due|post_purchase_14d|function (dispatch|planuoti|schedule|enqueue|queue|uzsakyti|siusti|laiskas|job)|ps_email_jobs|interval|ciklas|dienos|holdout|soft_optin|consent|optout/i',$l)) $o[$rel]['h'][]=($i+1).': '.trim(mb_substr($l,0,200)); }
  $o['jobs_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_email_jobs"); $o['content_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_email_content");
  $o['refill_draft']=$wpdb->get_row("SELECT flow,version,status,subject,preheader,LEFT(blocks_json,1200) b FROM {$p}ps_email_content WHERE flow='refill_due'",ARRAY_A);
  $o['pp14_draft']=$wpdb->get_row("SELECT flow,status,subject,LEFT(blocks_json,800) b FROM {$p}ps_email_content WHERE flow='post_purchase_14d'",ARRAY_A);
  $o['core_files']=array_map('basename',glob(WPMU_PLUGIN_DIR.'/petshop-core/includes/*.php'));
  $o['mu']=array_map('basename',glob(WPMU_PLUGIN_DIR.'/*.php'));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit; });
