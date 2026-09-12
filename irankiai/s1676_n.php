<?php
/** TEMP PS S1676 run n — DP pakų recon: prekės, kur _dp_* naudojama, AV variklių resolve/reduce/grazinti šaltiniai. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676n'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 n');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $o['dp_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}postmeta pm JOIN {$p}posts ps ON ps.ID=pm.post_id WHERE pm.meta_key='_dp_base_product_id' AND ps.post_status='publish'");
  $o['dp_pvz']=$wpdb->get_results("SELECT pm.post_id pid, pm.meta_value baze, (SELECT meta_value FROM {$p}postmeta WHERE post_id=pm.post_id AND meta_key='_dp_pack_qty') q, (SELECT meta_value FROM {$p}postmeta WHERE post_id=pm.post_id AND meta_key='_stock') st, (SELECT meta_value FROM {$p}postmeta WHERE post_id=pm.post_id AND meta_key='_manage_stock') ms, (SELECT meta_value FROM {$p}postmeta WHERE post_id=pm.post_id AND meta_key='_ps_sandelis') sand, (SELECT meta_value FROM {$p}postmeta WHERE post_id=pm.meta_value AND meta_key='_stock') baze_st, (SELECT meta_value FROM {$p}postmeta WHERE post_id=pm.meta_value AND meta_key='_own_stock_qty') baze_own, (SELECT meta_value FROM {$p}postmeta WHERE post_id=pm.meta_value AND meta_key='_ps_sandelis') baze_sand FROM {$p}postmeta pm JOIN {$p}posts ps ON ps.ID=pm.post_id WHERE pm.meta_key='_dp_base_product_id' AND ps.post_status='publish' ORDER BY pm.post_id LIMIT 12",ARRAY_A);
  $o['dp_meta_raktai']=$wpdb->get_col("SELECT DISTINCT meta_key FROM {$p}postmeta WHERE meta_key LIKE '_dp_%'");
  // kur kode naudojama
  $files=array_merge(glob(WPMU_PLUGIN_DIR.'/*.php'),glob(WP_PLUGIN_DIR.'/petshop-*/*.php'),glob(WP_PLUGIN_DIR.'/petshop-*/includes/*.php'));
  foreach($files as $f){ $s=file_get_contents($f); $n=substr_count($s,'_dp_'); if($n){ preg_match("/^\s*\*\s*(.{0,90})/m",$s,$h); $o['dp_kode'][str_replace(WP_CONTENT_DIR,'',$f)]=$n; } }
  // AV varikliai: kur resolve / reduce / grazinti
  foreach(array('petshop-av-reduce.php','petshop-desk.php') as $n){ $f=WPMU_PLUGIN_DIR.'/'.$n; if(!file_exists($f)) continue; $s=file_get_contents($f); $o['engine'][$n]=array('md5'=>md5_file($f),'dydis'=>strlen($s)); preg_match_all("/^\s*(?:public|protected|private)?\s*static\s+function\s+(\w+)/m",$s,$m); $o['engine'][$n]['fn']=array_slice($m[1],0,60); }
  foreach(get_declared_classes() as $c){ if(preg_match('/^Petshop_AV_(Source|Stock|Reduce)$/',$c)){ $rc=new ReflectionClass($c); $o['av_klases'][$c]=str_replace(WP_CONTENT_DIR,'',$rc->getFileName()); foreach($rc->getMethods() as $mm){ $o['av_klases'][$c.'::'.$mm->getName()]=$mm->getStartLine().'-'.$mm->getEndLine(); } } }
  // resolve šaltinis
  if(class_exists('Petshop_AV_Source')){ $rc=new ReflectionClass('Petshop_AV_Source'); $L=explode("\n",file_get_contents($rc->getFileName())); foreach(array('resolve','av_qty','likutis') as $mn){ if($rc->hasMethod($mn)){ $m=$rc->getMethod($mn); $o['src_'.$mn]=implode("\n",array_slice($L,$m->getStartLine()-1,min(70,$m->getEndLine()-$m->getStartLine()+1))); } } }
  if(class_exists('Petshop_AV_Reduce')){ $rc=new ReflectionClass('Petshop_AV_Reduce'); $L=explode("\n",file_get_contents($rc->getFileName())); foreach($rc->getMethods() as $m){ if(preg_match('/reduce|mazint|grazint|sumaz/i',$m->getName())) $o['red_'.$m->getName()]=implode("\n",array_slice($L,$m->getStartLine()-1,min(60,$m->getEndLine()-$m->getStartLine()+1))); } }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
