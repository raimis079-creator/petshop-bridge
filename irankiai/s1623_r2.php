<?php
/** TEMP PS S1623 r2 — RECON (tik skaitymas): prekių ženklo taksonomija, Prekių ataskaitos („reikia užsakyti“) duomenų laukai, Josera pavyzdys pagal tiekėją. */
add_action('init', function(){
  if (!isset($_GET['ps_r4'])) return;
  $o=array('v'=>'S1623 r2'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");

  $o['tax']=$wpdb->get_results("SELECT taxonomy,COUNT(*) n FROM {$p}term_taxonomy WHERE taxonomy LIKE '%brand%' OR taxonomy LIKE 'pa_gam%' OR taxonomy='product_brand' GROUP BY taxonomy",ARRAY_A);
  $o['josera']=$wpdb->get_results("SELECT t.name,tt.taxonomy,tt.count FROM {$p}terms t JOIN {$p}term_taxonomy tt ON tt.term_id=t.term_id WHERE t.name LIKE 'Josera%' LIMIT 6",ARRAY_A);
  $o['josera_vf']=$wpdb->get_results("SELECT p.ID,LEFT(p.post_title,60) n,m.meta_value sand,q.meta_value vf FROM {$p}posts p JOIN {$p}postmeta m ON m.post_id=p.ID AND m.meta_key='_ps_sandelis' LEFT JOIN {$p}postmeta q ON q.post_id=p.ID AND q.meta_key='_vf_qty' WHERE p.post_type='product' AND p.post_status='publish' AND p.post_title LIKE 'Josera%' ORDER BY p.post_title LIMIT 45",ARRAY_A);
  $o['josera_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}posts WHERE post_type='product' AND post_status='publish' AND post_title LIKE 'Josera%'");
  $f=WPMU_PLUGIN_DIR.'/petshop-ataskaita-prekes.php'; $L=explode("\n",(string)file_get_contents($f)); $g=array(); foreach($L as $k=>$l){ if(preg_match('/reikia|uzsakyti|parduota|greitis|dien|riba|function surinkti|function eiles|\'av\'|_ps_sandelis|brand|zenkl/i',$l)) $g[]=($k+1).': '.mb_substr(trim($l),0,150); if(count($g)>45) break; } $o['ataskaita']=$g; $o['ataskaita_dydis']=strlen(implode("\n",$L));
  $o['juosta_reikia']=get_option('ps_juosta_reikia');
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
