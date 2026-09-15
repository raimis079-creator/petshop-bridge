<?php
/** TEMP PS S1686 mq — READ-ONLY: auditorijos šaltinis — usermeta _ps_ist_* raktai, el. pašto hash algoritmas (istorijos adapteris), gyvunas reikšmės, consent usermeta, suppression lentelė. */
add_action('init', function(){
  if (!isset($_GET['ps_s1686mq'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1686 mq');
  $o['ist_meta']=$wpdb->get_results("SELECT meta_key k, COUNT(*) n FROM {$p}usermeta WHERE meta_key LIKE '\_ps\_ist%' OR meta_key IN('ps_marketing_consent','ps_transactional_only','ps_soft_optin_eligible','ps_similar_optout') GROUP BY k",ARRAY_A);
  $A=file(WPMU_PLUGIN_DIR.'/petshop-istorijos-adapteris.php'); foreach($A as $i=>$l) if(preg_match('/hash\(|sha256|md5\(|email_hash/i',$l)) $o['hash_kodas'][]=($i+1).': '.trim(mb_substr($l,0,180));
  $F=glob(WPMU_PLUGIN_DIR.'/petshop-faktai*.php'); foreach($F as $f){ $L=file($f); foreach($L as $i=>$l) if(preg_match('/email_hash|hash\(\s*.sha256/i',$l)) $o['hash_faktai'][]=basename($f).':'.($i+1).': '.trim(mb_substr($l,0,180)); }
  $o['gyvunas']=$wpdb->get_results("SELECT gyvunas, COUNT(*) n FROM {$p}ps_ist_fakt_eilutes WHERE kategoriju_kelias LIKE '%maist%' GROUP BY gyvunas",ARRAY_A);
  $o['kelias_pvz']=$wpdb->get_col("SELECT DISTINCT kategoriju_kelias FROM {$p}ps_ist_fakt_eilutes WHERE kategoriju_kelias LIKE '%maist%' LIMIT 12");
  $u=get_user_by('email','terra@gyvunai.lt'); $o['terra_meta']=$u?array_filter(get_user_meta($u->ID),function($k){return strpos($k,'_ps_ist')===0;},ARRAY_FILTER_USE_KEY):null;
  $o['hash_test']=array('sha256_lower'=>hash('sha256','terra@gyvunai.lt'),'yra_ist'=>$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$p}ps_ist_fakt_uzsakymai WHERE klientas_email_hash=%s",hash('sha256','terra@gyvunai.lt'))),'hash_pvz'=>$wpdb->get_var("SELECT klientas_email_hash FROM {$p}ps_ist_fakt_uzsakymai LIMIT 1"));
  $o['suppr_tbl']=$wpdb->get_var("SHOW TABLES LIKE '{$p}ps_email_suppression%'"); if($o['suppr_tbl']) $o['suppr_n']=$wpdb->get_results("SELECT channel, COUNT(*) n FROM {$o['suppr_tbl']} GROUP BY channel",ARRAY_A);
  $o['wp_users_ist']=(int)$wpdb->get_var("SELECT COUNT(DISTINCT user_id) FROM {$p}usermeta WHERE meta_key='_ps_ist_n'");
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
