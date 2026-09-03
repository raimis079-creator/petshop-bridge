<?php
/** TEMP PS S1609 run e5d — deploy darbalaukis v3.10 + recon Paruošta eilės */
add_action('init', function(){
  if (!isset($_GET['ps_e5d'])) return;
  $o=array('v'=>'run e5d'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $up=wp_upload_dir(); $bk=trailingslashit($up['basedir']).'ps-backups'; wp_mkdir_p($bk);
  $c3='<B64>';
  $p1=@file_get_contents($bk.'/dl-v310.part1'); $p2=@file_get_contents($bk.'/dl-v310.part2'); $o['parts']=array(strlen((string)$p1),strlen((string)$p2),strlen($c3));
  $code=base64_decode($p1.$p2.$c3,true); $o['bytes']=strlen((string)$code); $o['md5']=md5((string)$code);
  if ($o['md5']!=='78277b7260456a86ac0af69bd61c9bf3') { $o['STOP']='md5 nesutampa'; header('Content-Type: application/json'); echo json_encode($o); exit; }
  try { token_get_all($code, TOKEN_PARSE); $o['token']='ok'; } catch (Throwable $e) { $o['STOP']='token: '.$e->getMessage(); header('Content-Type: application/json'); echo json_encode($o); exit; }
  $t=WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'; $o['buvo']=md5_file($t); $o['buvo_bytes']=filesize($t);
  if (preg_match("/VERSIJA = '([\d.]+)'/",file_get_contents($t),$m)) $o['buvo_v']=$m[1];
  if ($o['buvo']!=='4a798693625447d91bcbcf2fcb5f2dee') { $o['STOP']='gyvas failas ne v3.9 (md5 '.$o['buvo'].')'; header('Content-Type: application/json'); echo json_encode($o); exit; }
  $o['backup']=copy($t,$bk.'/petshop-darbalaukis-v'.str_replace('.','',$o['buvo_v']??'x').'-BACKUP-'.date('Y-m-d').'.php');
  $o['rasyta']=file_put_contents($t,$code); $o['po']=md5_file($t);
  @unlink($bk.'/dl-v310.part1'); @unlink($bk.'/dl-v310.part2');
  $r=new ReflectionMethod('Petshop_Darbalaukis','atviri'); $r->setAccessible(true); $at=$r->invoke(null);
  foreach($at as $x){ if(in_array('paruosta',$x['eiles'],true)||in_array('surinkti',$x['eiles'],true)){ $d=array(); foreach($x['dalys'] as $k=>$pp){ if($pp) $d[$k]=array('nr'=>$pp['nr'],'iss'=>$pp['issiusta'],'siunta'=>$pp['siunta']??null,'perduota'=>$pp['perduota']??null); } $o['eile'][$x['id']]=array('st'=>$x['st'],'eiles'=>$x['eiles'],'vez'=>$x['vez'],'dalys'=>$d,'eil'=>count($x['eil']),'email'=>$x['o']->get_billing_email()); } }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
