<?php
add_action('init', function(){ if (!isset($_GET['ps_s1684mp'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'mp');
  $dirs=array(WPMU_PLUGIN_DIR, WP_PLUGIN_DIR.'/petshop-core'); $hits=array();
  foreach($dirs as $d){ $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($d)); foreach($it as $f){ if(substr($f,-4)!=='.php') continue; $s=file_get_contents($f); if(strpos($s,'refill_due')===false&&strpos($s,'post_purchase_14d')===false&&strpos($s,'reorder_url')===false) continue; $L=explode("\n",$s); $rel=str_replace(array(WP_PLUGIN_DIR,WPMU_PLUGIN_DIR),array('plugins','mu'),$f); foreach($L as $i=>$l) if(preg_match('/refill_due|post_purchase_14d|reorder_url|function [a-z_]*(enqueue|schedule|planuoti|create_job|add_job|queue|dispatch|consent|leidzia|gali_siusti|allowed)\w*\s*\(|interval_days|dienos_iki|ciklas/i',$l)) $hits[$rel][]=($i+1).': '.trim(mb_substr($l,0,220)); } }
  $o['hits']=$hits; $o['core_dir']=is_dir(WP_PLUGIN_DIR.'/petshop-core')?array_map('basename',glob(WP_PLUGIN_DIR.'/petshop-core/includes/*.php')):'nera';
  $o['jobs_flows']=$wpdb->get_results("SELECT flow, status, COUNT(*) n FROM {$p}ps_email_jobs GROUP BY flow,status",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit; });
