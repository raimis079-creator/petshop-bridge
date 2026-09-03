<?php
/** TEMP PS S1608 run e3d deploy */
add_action('init', function(){
  if (!isset($_GET['ps_e3d'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e3d'])); $o=array('v'=>'run e3d','f'=>$f); global $wpdb; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $up=wp_upload_dir(); $bk=trailingslashit($up['basedir']).'ps-backups'; wp_mkdir_p($bk);
  $c3='<B64>';
  $c=file_get_contents($bk.'/dl-v36.part1').file_get_contents($bk.'/dl-v36.part2').$c3;
  $code=base64_decode($c,true); $o['bytes']=strlen($code); $o['md5']=md5($code);
  if ($o['md5']!=='8f93c441606a23ab67314c4f755a15aa') { $o['STOP']='md5 nesutampa'; header('Content-Type: application/json'); echo json_encode($o); exit; }
  try { token_get_all($code, TOKEN_PARSE); $o['token']='ok'; } catch (Throwable $e) { $o['STOP']='token: '.$e->getMessage(); header('Content-Type: application/json'); echo json_encode($o); exit; }
  $t=WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'; $o['buvo']=md5_file($t); $o['buvo_bytes']=filesize($t);
  if (preg_match("/VERSIJA = '([\d.]+)'/",file_get_contents($t),$m)) $o['buvo_v']=$m[1];
  $o['backup']=copy($t,$bk.'/petshop-darbalaukis-v'.str_replace('.','',$o['buvo_v']??'x').'-BACKUP-'.date('Y-m-d').'.php');
  $o['rasyta']=file_put_contents($t,$code); $o['po']=md5_file($t);
  @unlink($bk.'/dl-v36.part1'); @unlink($bk.'/dl-v36.part2');
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
