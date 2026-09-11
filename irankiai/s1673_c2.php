<?php
/** Plugin Name: TEMP PS S1673 C2 fakt + ga4 */
add_action('init', function(){
  if(!isset($_GET['ps_c2'])||$_GET['ps_c2']!=='GO') return;
  header('Content-Type: application/json; charset=utf-8'); global $wpdb; $o=array('v'=>'S1673C2');
  try{
    $t=$wpdb->prefix.'ps_fakt_uzsakymai';
    $o['min_sukurta']=$wpdb->get_var("SELECT MIN(sukurta_at) FROM $t");
    $o['fakt']=$wpdb->get_results("SELECT DATE(sukurta_at) d, COUNT(*) n, SUM(apmoketa_at IS NOT NULL) apm, SUM(gclid<>'' AND gclid IS NOT NULL) gclid, SUM(utm_source='google') utm_g, GROUP_CONCAT(DISTINCT CONCAT(kanalas_paskutinis,'')) kan, ROUND(SUM(viso_ct)/100,2) viso FROM $t GROUP BY 1 ORDER BY 1",ARRAY_A);
    $o['kanalai']=$wpdb->get_results("SELECT kanalas_pirmas,kanalas_paskutinis,utm_source,utm_medium,COUNT(*) n FROM $t GROUP BY 1,2,3,4",ARRAY_A);
    $o['statusai']=$wpdb->get_results("SELECT statusas_galutinis,COUNT(*) n FROM $t GROUP BY 1",ARRAY_A);
    $c=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-ga4-serveris.php');
    // ga4 serverio siuntimo log/lentele?
    preg_match_all("/\\\$wpdb->prefix\s*\.\s*'([a-z_0-9]+)'|get_option\(\s*'([a-z_0-9]+)'|update_option\(\s*'([a-z_0-9]+)'/",$c,$m); $o['ga4_tables_opts']=array_values(array_unique(array_filter(array_merge($m[1],$m[2],$m[3]))));
    preg_match('/function siusti[\s\S]{0,1500}/',$c,$s); $o['ga4_siusti']=substr($s[0]??'',0,1500);
    preg_match('/function payload[\s\S]{0,2500}/',$c,$s); $o['ga4_payload']=substr($s[0]??'',0,2500);
    foreach($o['ga4_tables_opts'] as $k){ if(strpos($k,'ps_ga4')===0){ $v=get_option($k); $o['opt_'.$k]=is_scalar($v)?substr((string)$v,0,120):substr(json_encode($v,JSON_UNESCAPED_UNICODE),0,600); } }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
