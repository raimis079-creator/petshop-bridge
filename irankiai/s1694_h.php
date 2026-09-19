<?php
/** TEMP PS S1694 h — refill_due job'ai (realus payload) + kur gyvena refill engine / magic login (saugi paieška). Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1694h'])) return; global $wpdb; $o=array(); $p=$wpdb->prefix; $C=WP_CONTENT_DIR;
  $o['flows']=$wpdb->get_results("SELECT flow,status,COUNT(*) n,MAX(created_at) pask FROM {$p}ps_email_jobs GROUP BY 1,2 ORDER BY 1,2",ARRAY_A);
  $o['refill_jobs']=$wpdb->get_results("SELECT id,job_key,flow,flow_class,recipient_user_id uid,status,skip_reason,block_reason,scheduled_at,sent_at,created_at,LEFT(payload,2500) payload FROM {$p}ps_email_jobs WHERE flow='refill_due' ORDER BY id DESC LIMIT 3",ARRAY_A);
  $o['klases']=array(); foreach (array('Petshop_Refill_Engine','Refill_Engine','PS_Refill_Engine','Petshop_Email_Dispatch','Magic_Login','Petshop_Magic_Login','Feeding_Service','Pet_Profile') as $c){ if (class_exists($c)){ $r=new ReflectionClass($c); $o['klases'][$c]=str_replace($C,'',$r->getFileName()); } else $o['klases'][$c]=false; }
  $o['mu_dirs']=array_map('basename',array_filter(glob("$C/mu-plugins/*"),'is_dir'));
  $o['plugins_ps']=array_map('basename',array_filter(glob("$C/plugins/petshop*"),'is_dir'));
  // grep refill engine failą pagal klasę
  foreach ($o['klases'] as $c=>$f){ if ($f && preg_match('/refill|dispatch|magic/i',$f)){ $s=file_get_contents($C.$f); preg_match_all('/[^\n]{0,120}(feedback|magic|_url|notified|days_before|notify)[^\n]{0,160}/i',$s,$m); $o['grep'][$f]=array_slice(array_values(array_unique($m[0])),0,45);} }
  if ($wpdb->last_error) $o['err']=$wpdb->last_error;
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
