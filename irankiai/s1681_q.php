<?php
/** TEMP PS S1681 q — read-only: savos analitikos būklė — ps_web_ivykiai/ps_web_dienos kas renkama, paskutinės dienos. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681q'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1681 q');
  $s=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-analitika.php'); preg_match('/Version:\s*([\d.]+)/i',$s,$m); $o['ver']=$m[1]??''; $o['antr']=substr($s,0,700);
  $o['iv_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_web_ivykiai"); $o['d_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_web_dienos");
  $o['iv_tipai']=$wpdb->get_results("SELECT tipas,COUNT(*) n,MIN(laikas) nuo,MAX(laikas) iki FROM {$p}ps_web_ivykiai GROUP BY tipas ORDER BY n DESC LIMIT 20",ARRAY_A);
  $o['dienos']=$wpdb->get_results("SELECT * FROM {$p}ps_web_dienos ORDER BY 1 DESC LIMIT 8",ARRAY_A);
  $o['e']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
