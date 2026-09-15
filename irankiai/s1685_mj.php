<?php
/** TEMP PS S1685 mj — RECON read-only: refill.php šablonas, variklio check_due/fire kodas, kas kuria ps_email_jobs refill_due (grep mu-plugins/petshop-core), ps_email_content refill eilutė. */
add_action('init', function(){
  if (!isset($_GET['ps_s1685mj'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1685 mj');
  $o['refill_tpl']=file_get_contents(WP_PLUGIN_DIR.'/petshop-core/templates/emails/refill.php');
  $s=file_get_contents(WP_PLUGIN_DIR.'/petshop-core/includes/class-refill-engine.php'); $i=strpos($s,'function check_due'); $o['check_due']=substr($s,$i,3000);
  $o['content']=$wpdb->get_results("SELECT id,flow,version,status,subject,preheader,LEFT(blocks_json,1500) b FROM {$p}ps_email_content WHERE flow LIKE '%refill%'",ARRAY_A);
  $hits=array(); foreach(array_merge(glob(WPMU_PLUGIN_DIR.'/*.php'),glob(WP_PLUGIN_DIR.'/petshop-core/includes/*.php')) as $f){ $c=file_get_contents($f); if(strpos($c,"'refill_due'")!==false||strpos($c,'refill.php')!==false||strpos($c,"'refill'")!==false){ preg_match_all('/.{0,120}(refill_due|refill\.php|\'refill\').{0,160}/',$c,$m); $hits[basename($f)]=array_slice(array_unique($m[0]),0,6);} }
  $o['hits']=$hits;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
