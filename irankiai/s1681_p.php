<?php
/** TEMP PS S1681 p — read-only: kritimo pjūvis — kanalai/nauji-grįžtantys per mėnesį (istorija+nauja) ir GA4 sesijos per mėnesį 2025-06…2026-09. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681p'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1681 p');
  $sql="SELECT DATE_FORMAT(apmoketa_at,'%%Y-%%m') m,COALESCE(NULLIF(kanalas_paskutinis,''),'?') k,COUNT(*) n FROM %s WHERE apmoketa_at>='2025-06-01' GROUP BY m,k";
  $o['ist']=$wpdb->get_results(sprintf($sql,$p.'ps_ist_fakt_uzsakymai'),ARRAY_A);
  $o['nauja']=$wpdb->get_results(sprintf($sql,$p.'ps_fakt_uzsakymai')." AND saltinis_aplinka='prod' AND testinis=0",ARRAY_A);
  $o['nauji']=$wpdb->get_results("SELECT DATE_FORMAT(apmoketa_at,'%Y-%m') m,SUM(klientas_naujas=1) nauji,COUNT(*) n,ROUND(AVG(viso_ct)/100,1) aov,SUM(is_refill=1) refill FROM {$p}ps_ist_fakt_uzsakymai WHERE apmoketa_at>='2025-06-01' GROUP BY m",ARRAY_A);
  $r=new ReflectionMethod('Petshop_GA4_Serveris','token'); $r->setAccessible(true); $tok=$r->invoke(null);
  $x=wp_remote_post('https://analyticsdata.googleapis.com/v1beta/properties/346051580:runReport',array('timeout'=>40,'headers'=>array('Authorization'=>'Bearer '.$tok,'Content-Type'=>'application/json'),'body'=>json_encode(array('dateRanges'=>array(array('startDate'=>'2025-06-01','endDate'=>'2026-09-13')),'dimensions'=>array(array('name'=>'yearMonth'),array('name'=>'sessionDefaultChannelGroup')),'metrics'=>array(array('name'=>'sessions'),array('name'=>'ecommercePurchases')),'limit'=>500))));
  $j=json_decode(wp_remote_retrieve_body($x),true); foreach($j['rows']??array() as $row) $o['ga4'][]=array($row['dimensionValues'][0]['value'],$row['dimensionValues'][1]['value'],(int)$row['metricValues'][0]['value'],(int)$row['metricValues'][1]['value']);
  $o['e']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
