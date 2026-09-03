<?php
/** TEMP PS S1609 run e5a part1 */
add_action('init', function(){
  if (!isset($_GET['ps_e5a'])) return;
  $o=array('v'=>'run e5 part1'); global $wpdb; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $up=wp_upload_dir(); $bk=trailingslashit($up['basedir']).'ps-backups'; wp_mkdir_p($bk);
  $c='<B64>';
  $o['part1']=file_put_contents($bk.'/dl-v310.part1',$c); $o['md5_part']=md5($c);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
