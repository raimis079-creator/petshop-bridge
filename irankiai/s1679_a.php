<?php
/** TEMP PS S1679 a — read-only: Ads būklė šiandien (reklama per dieną/kampaniją, užsakymai su gclid, offline konv.). */
add_action('init', function(){
  if (!isset($_GET['ps_s1679a'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1679 a','dabar'=>current_time('mysql'));
  $o['reklama']=$wpdb->get_results("SELECT diena,kampanija,islaidos_ct/100 isl,paspaudimai klik,rodymai,konversijos konv,konv_verte_ct/100 kv FROM {$p}ps_fakt_reklama WHERE diena>=DATE_SUB(CURDATE(),INTERVAL 5 DAY) ORDER BY diena,kampanija",ARRAY_A);
  $o['reklama_max']=$wpdb->get_var("SELECT MAX(diena) FROM {$p}ps_fakt_reklama");
  $o['uzs_dienos']=$wpdb->get_results("SELECT DATE(sukurta_at) d,COUNT(*) n,SUM(gclid<>'') ads,SUM(apmoketa_at IS NOT NULL) apm,ROUND(SUM(viso_ct)/100) viso,ROUND(SUM(IF(gclid<>'',viso_ct,0))/100) ads_viso FROM {$p}ps_fakt_uzsakymai WHERE testinis=0 AND sukurta_at>=DATE_SUB(CURDATE(),INTERVAL 5 DAY) GROUP BY 1 ORDER BY 1",ARRAY_A);
  $o['siandien']=$wpdb->get_results("SELECT uzsakymo_nr nr,statusas_galutinis s,viso_ct/100 v,gclid<>'' g,utm_source src,utm_campaign kamp,apmoketa_at FROM {$p}ps_fakt_uzsakymai WHERE testinis=0 AND sukurta_at>=CURDATE() ORDER BY sukurta_at",ARRAY_A);
  $o['offline3d']=$wpdb->get_results("SELECT DATE(apmoketa_at) d,COUNT(*) n,ROUND(SUM(viso_ct)/100) v FROM {$p}ps_fakt_uzsakymai WHERE testinis=0 AND gclid<>'' AND apmoketa_at>=DATE_SUB(NOW(),INTERVAL 3 DAY) AND statusas_galutinis IN('processing','completed') GROUP BY 1",ARRAY_A);
  $o['offline_zurnalas']=get_option('ps_ads_offline_pask');
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
