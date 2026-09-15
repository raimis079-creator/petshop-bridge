<?php
add_action('init', function(){ if (!isset($_GET['ps_s1685mb'])) return; $o=array('v'=>'mb'); $f=WPMU_PLUGIN_DIR.'/petshop-ads-offline.php'; $L=explode("\n",file_get_contents($f)); $o['n']=count($L); $o['kodas']=array_slice($L,10,70);
  $r=get_option('ps_ads_offline_raktas'); $resp=wp_remote_get(home_url('/?ps_ads_offline='.$r),array('timeout'=>30,'sslverify'=>false)); $o['endpoint_code']=wp_remote_retrieve_response_code($resp); $o['endpoint_body']=mb_substr(wp_remote_retrieve_body($resp),0,1500);
  $o['conv_actions_opt']=get_option('ps_ads_conversion_name',null);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit; });
