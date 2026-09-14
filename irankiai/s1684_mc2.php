<?php
/** TEMP PS S1684 mc2 — READ-ONLY: ps_consent_log detalė, ps_marketing_consent kilmė, kasos sutikimo laukas kode. */
add_action('init', function(){
  if (!isset($_GET['ps_s1684mc2'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1684 mc2'); $wpdb->suppress_errors(true);
  $o['log_grp']=$wpdb->get_results("SELECT field, source, to_value, COUNT(*) n, MIN(changed_at) nuo, MAX(changed_at) iki FROM {$p}ps_consent_log GROUP BY field, source, to_value ORDER BY n DESC",ARRAY_A);
  $o['log_sample']=$wpdb->get_results("SELECT field, from_value, to_value, source, changed_at FROM {$p}ps_consent_log ORDER BY id DESC LIMIT 5",ARRAY_A);
  $o['consent_users']=$wpdb->get_row("SELECT COUNT(*) n, MIN(u.user_registered) nuo, MAX(u.user_registered) iki, SUM(u.user_registered<'2026-09-01') senu FROM {$p}usermeta m JOIN {$p}users u ON u.ID=m.user_id WHERE m.meta_key='ps_marketing_consent' AND m.meta_value IN('1','yes')",ARRAY_A);
  $o['users_total']=$wpdb->get_row("SELECT COUNT(*) n, SUM(user_registered<'2026-09-01') senu FROM {$p}users",ARRAY_A);
  $o['ist_email_meta']=$wpdb->get_results("SELECT meta_key k, COUNT(*) n FROM {$p}usermeta WHERE meta_key LIKE 'ps_ist%' OR meta_key LIKE '_ps_ist%' OR meta_key LIKE 'ps_migr%' GROUP BY k LIMIT 15",ARRAY_A);
  $o['suppression']=$wpdb->get_results("SELECT channel, reason, source, suppressed_at FROM {$p}ps_email_suppression",ARRAY_A);
  $o['email_content']=$wpdb->get_results("SELECT flow, version, status, subject FROM {$p}ps_email_content ORDER BY flow",ARRAY_A);
  foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $f){ $s=file_get_contents($f); if(strpos($s,'ps_marketing_consent')!==false){ $L=explode("\n",$s); $h=array(); foreach($L as $i=>$l) if(preg_match('/ps_marketing_consent|Sutinku|naujien|rinkodar/i',$l)) $h[]=($i+1).': '.trim(mb_substr($l,0,180)); $o['kodas'][basename($f)]=array_slice($h,0,25); } }
  foreach(glob(WPMU_PLUGIN_DIR.'/petshop-core/includes/*.php') as $f){ $s=file_get_contents($f); if(strpos($s,'ps_marketing_consent')!==false){ $L=explode("\n",$s); $h=array(); foreach($L as $i=>$l) if(preg_match('/ps_marketing_consent|Sutinku|naujien|rinkodar|consent_log/i',$l)) $h[]=($i+1).': '.trim(mb_substr($l,0,180)); $o['kodas']['core/'.basename($f)]=array_slice($h,0,25); } }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
