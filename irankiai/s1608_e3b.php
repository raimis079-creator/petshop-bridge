<?php
/** TEMP PS S1608 run e3b part2 */
add_action('init', function(){
  if (!isset($_GET['ps_e3b'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e3b'])); $o=array('v'=>'run e3b part2','f'=>$f); global $wpdb; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $up=wp_upload_dir(); $bk=trailingslashit($up['basedir']).'ps-backups'; wp_mkdir_p($bk);
  $c='<B64>';
  $o['part2']=file_put_contents($bk.'/dl-v36.part2',$c);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
