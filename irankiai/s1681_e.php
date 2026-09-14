<?php
/** TEMP PS S1681 e — ps_sargas_cron_valandos 24 → 26 (lenktynės tarp ps_sargas_kasdien ir 04:00 dienos darbų). */
add_action('init', function(){
  if (!isset($_GET['ps_s1681e'])) return; $o=array('v'=>'S1681 e');
  $o['buvo']=get_option('ps_sargas_cron_valandos','(nenustatyta → 24)');
  update_option('ps_sargas_cron_valandos',26,false);
  $o['dabar']=get_option('ps_sargas_cron_valandos');
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
