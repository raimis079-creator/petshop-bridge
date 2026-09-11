<?php
/** TEMP PS S1675 run m — class-cart-abandonment.php terminų eilutės. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_m5'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1675 m');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $ls=explode("\n",file_get_contents(WP_PLUGIN_DIR.'/petshop-core/includes/class-cart-abandonment.php'));
  foreach(array(array(41,60)) as $r){ for($i=$r[0];$i<=$r[1];$i++){ $l=trim($ls[$i-1]??''); if($l!=='' ) $o['l'][$i]=mb_substr($l,0,140); } }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
