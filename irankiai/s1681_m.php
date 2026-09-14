<?php
/** TEMP PS S1681 m — read-only: GA4 Data API (per petshop-ga4-serveris token) — dienos 07-27…09-13: sesijos/pirkimai/pajamos; kanalų grupės prieš/po T-0. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681m'])) return; $o=array('v'=>'S1681 m');
  $s=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-ga4-serveris.php'); preg_match('/class\s+(\w+)/',$s,$m); $cls=$m[1]; $o['cls']=$cls;
  $r=new ReflectionMethod($cls,'token'); $r->setAccessible(true); $tok=$r->invoke(null); if(is_wp_error($tok)){ $o['tok_err']=$tok->get_error_message(); }
  else { $q=function($body) use($tok){ $x=wp_remote_post('https://analyticsdata.googleapis.com/v1beta/properties/346051580:runReport',array('timeout'=>40,'headers'=>array('Authorization'=>'Bearer '.$tok,'Content-Type'=>'application/json'),'body'=>json_encode($body))); if(is_wp_error($x)) return $x->get_error_message(); $j=json_decode(wp_remote_retrieve_body($x),true); if(!isset($j['rows'])) return $j; $out=array(); foreach($j['rows'] as $row){ $out[]=array_merge(array_map(function($d){return $d['value'];},$row['dimensionValues']),array_map(function($d){return round((float)$d['value'],1);},$row['metricValues'])); } return $out; };
    $met=array(array('name'=>'sessions'),array('name'=>'totalUsers'),array('name'=>'ecommercePurchases'),array('name'=>'purchaseRevenue'),array('name'=>'addToCarts'),array('name'=>'checkouts'));
    $o['dienos']=$q(array('dateRanges'=>array(array('startDate'=>'2026-07-27','endDate'=>'2026-09-13')),'dimensions'=>array(array('name'=>'date')),'metrics'=>$met,'orderBys'=>array(array('dimension'=>array('dimensionName'=>'date'))),'limit'=>100));
    $o['kan_pries']=$q(array('dateRanges'=>array(array('startDate'=>'2026-08-11','endDate'=>'2026-09-07')),'dimensions'=>array(array('name'=>'sessionDefaultChannelGroup')),'metrics'=>$met,'limit'=>20));
    $o['kan_po']=$q(array('dateRanges'=>array(array('startDate'=>'2026-09-09','endDate'=>'2026-09-13')),'dimensions'=>array(array('name'=>'sessionDefaultChannelGroup')),'metrics'=>$met,'limit'=>20));
    $o['irenginys_po']=$q(array('dateRanges'=>array(array('startDate'=>'2026-08-11','endDate'=>'2026-09-07'),array('startDate'=>'2026-09-09','endDate'=>'2026-09-13')),'dimensions'=>array(array('name'=>'deviceCategory'),array('name'=>'dateRange')),'metrics'=>$met,'limit'=>20));
  }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
