<?php
/** TEMP PS S1694 a — augintinio anketa (Pet Profile) recon: lentelės, kiekiai, stulpeliai, pavyzdžiai. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1694a'])) return; global $wpdb; $o=array(); $p=$wpdb->prefix;
  $tabs=$wpdb->get_col("SHOW TABLES"); $hit=array();
  foreach ($tabs as $t){ if (preg_match('/pet|profil|anket|feeding|refill|weight|draft/i',$t)) $hit[]=$t; }
  foreach ($hit as $t){ $n=(int)$wpdb->get_var("SELECT COUNT(*) FROM `$t`"); $cols=$wpdb->get_col("SHOW COLUMNS FROM `$t`",0); $o['lenteles'][$t]=array('n'=>$n,'cols'=>$cols);
    if ($n>0 && $n<200000 && preg_match('/pet|profil|anket|draft/i',$t)) $o['pvz'][$t]=$wpdb->get_results("SELECT * FROM `$t` ORDER BY 1 DESC LIMIT 3",ARRAY_A); }
  // usermeta / postmeta raktai su pet
  $o['usermeta_raktai']=$wpdb->get_results("SELECT meta_key,COUNT(*) n FROM {$p}usermeta WHERE meta_key LIKE '%pet%' OR meta_key LIKE '%weight%' OR meta_key LIKE '%anket%' GROUP BY meta_key ORDER BY n DESC LIMIT 40",ARRAY_A);
  $o['postmeta_raktai']=$wpdb->get_results("SELECT meta_key,COUNT(*) n FROM {$p}postmeta WHERE meta_key LIKE '%pet%' OR meta_key LIKE '%feeding%' GROUP BY meta_key ORDER BY n DESC LIMIT 30",ARRAY_A);
  $o['post_types']=$wpdb->get_results("SELECT post_type,post_status,COUNT(*) n FROM {$p}posts WHERE post_type LIKE '%pet%' OR post_type LIKE '%profil%' GROUP BY post_type,post_status",ARRAY_A);
  $o['options']=$wpdb->get_col("SELECT option_name FROM {$p}options WHERE option_name LIKE '%pet_%' OR option_name LIKE '%anket%' OR option_name LIKE '%feeding%' LIMIT 40");
  // klasės
  foreach (array('Pet_Profile','PS_Pet_Profile','Petshop_Pet_Profile','Pet_Drafts','Feeding_Service','Refill_Engine') as $c) $o['klases'][$c]=class_exists($c);
  $f=WP_CONTENT_DIR.'/mu-plugins/petshop-core/includes/class-pet-profile.php'; $o['pet_profile_fail']=file_exists($f)?filesize($f):null;
  if (file_exists($f)){ $src=file_get_contents($f); preg_match_all('/(?:CREATE TABLE|\$wpdb->prefix\s*\.\s*[\'"])([a-z_0-9]+)/i',$src,$m); $o['pet_profile_lenteles']=array_values(array_unique($m[1])); preg_match_all('/[\'"]([a-z_]{3,30})[\'"]\s*=>/',$src,$m2); $o['pet_profile_raktai']=array_slice(array_values(array_unique($m2[1])),0,80); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
