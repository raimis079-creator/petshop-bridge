<?php
/** Plugin Name: TEMP PS S1698 404 recon 2 (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1698'])||$_GET['ps_s1698']!=='1') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1698 mb'); global $wpdb; $p=$wpdb->prefix;
  try{
    $o['legacy301_b64']=base64_encode(file_get_contents(WP_CONTENT_DIR.'/mu-plugins/petshop-legacy-301.php'));
    $o['atitikmuo_b64']=base64_encode(file_get_contents(WP_CONTENT_DIR.'/mu-plugins/petshop-404-atitikmuo.php'));
    $m=json_decode(file_get_contents(WP_CONTENT_DIR.'/mu-plugins/petshop-legacy-301-map.json'),true);
    $o['map_n']=is_array($m)?count($m):-1; $o['map_pvz']=is_array($m)?array_slice($m,0,5,true):null; $o['map_keys_pvz']=is_array($m)?array_slice(array_keys($m),0,10):null;
    foreach(array('trixie-kilimelis-purvui-surinkti-120-80-cm','automatine-serykla-kateisuniui','jaucio-ausis-ruda','checkout','placek-pet-products-s-r-o','josera-marinesse-10kg-sausas-maistas-katems') as $k){ $o['map_has'][$k]=isset($m[$k])?$m[$k]:(isset($m['/'.$k])?$m['/'.$k]:null); }
    // ps_seo_404 per 10 d.: ne botai, su referer
    $o['seo404_10d']=$wpdb->get_results("SELECT COUNT(DISTINCT kelias) keliai, SUM(hits) hits, SUM(bot_hits) bot FROM {$p}ps_seo_404 WHERE diena>='2026-09-11'",ARRAY_A);
    $o['seo404_zmones']=$wpdb->get_results("SELECT kelias, SUM(hits-bot_hits) zm, SUM(hits) h, MAX(referer) ref, MAX(paskutinis_at) pask FROM {$p}ps_seo_404 WHERE diena>='2026-09-11' GROUP BY kelias HAVING zm>0 ORDER BY zm DESC LIMIT 70",ARRAY_A);
    $o['seo404_ref_hosts']=$wpdb->get_results("SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(referer,'/',3),'/',-1) h, SUM(hits-bot_hits) zm FROM {$p}ps_seo_404 WHERE diena>='2026-09-11' AND referer<>'' GROUP BY h ORDER BY zm DESC LIMIT 15",ARRAY_A);
    // Ads: ar yra Search kampanijų/reklamų su senais URL? — offline nėra; tik pažymim gclid 404 kelius
    $o['ads404']=$wpdb->get_results("SELECT url_kelias u, COUNT(*) n, MAX(laikas) pask FROM {$p}ps_web_ivykiai WHERE tipas='error404' AND (url_kelias LIKE '%gclid%' OR url_kelias LIKE '%gad_source%') AND laikas>='2026-09-01' GROUP BY u ORDER BY n DESC LIMIT 30",ARRAY_A);
    $o['k24_404']=$wpdb->get_results("SELECT url_kelias u, COUNT(*) n, MAX(laikas) pask FROM {$p}ps_web_ivykiai WHERE tipas='error404' AND (url_kelias LIKE '%kaina24%' OR url_kelias LIKE '%kainos%' OR url_kelias LIKE '%kainoteka%') AND laikas>='2026-09-01' GROUP BY u ORDER BY n DESC LIMIT 30",ARRAY_A);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
