<?php
/** Plugin Name: TEMP PS S1698 404 organika recon (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1698'])||$_GET['ps_s1698']!=='1') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1698 ma'); global $wpdb; $p=$wpdb->prefix; $W="{$p}ps_web_ivykiai";
  try{
    $o['tipai']=$wpdb->get_results("SELECT tipas, COUNT(*) n FROM $W WHERE laikas>='2026-09-10' GROUP BY tipas ORDER BY n DESC",ARRAY_A);
    $o['pusl_tipai']=$wpdb->get_results("SELECT pusl_tipas, COUNT(*) n FROM $W WHERE laikas>='2026-09-10' GROUP BY pusl_tipas ORDER BY n DESC LIMIT 15",ARRAY_A);
    // 404 įvykiai su kanalu
    $o['k404_kanalai']=$wpdb->get_results("SELECT kanalas, saltinis, COUNT(*) n, COUNT(DISTINCT sesija) s FROM $W WHERE laikas>='2026-09-10' AND (pusl_tipas='404' OR tipas='404' OR tipas LIKE '%404%') GROUP BY kanalas, saltinis ORDER BY n DESC",ARRAY_A);
    $o['k404_organika']=$wpdb->get_results("SELECT url_kelias u, referer_domenas r, COUNT(*) n, COUNT(DISTINCT sesija) s, MAX(laikas) pask FROM $W WHERE laikas>='2026-09-10' AND (pusl_tipas='404' OR tipas='404' OR tipas LIKE '%404%') AND kanalas IN ('organika','referral') GROUP BY u, r ORDER BY n DESC LIMIT 80",ARRAY_A);
    $o['k404_visi_top']=$wpdb->get_results("SELECT url_kelias u, kanalas k, COUNT(*) n FROM $W WHERE laikas>='2026-09-10' AND (pusl_tipas='404' OR tipas='404' OR tipas LIKE '%404%') GROUP BY u,k ORDER BY n DESC LIMIT 40",ARRAY_A);
    // ps_seo_404 lentelė (petshop-seo) — struktūra ir top
    $t=$wpdb->get_var("SHOW TABLES LIKE '{$p}ps_seo_404'");
    if($t){ $o['seo404_cols']=$wpdb->get_col("SHOW COLUMNS FROM $t"); $o['seo404_top']=$wpdb->get_results("SELECT * FROM $t ORDER BY 1 DESC LIMIT 5",ARRAY_A); }
    // GSC 404 per petshop-ga4-serveris? — tik lentelės
    $o['lenteles']=$wpdb->get_col("SHOW TABLES LIKE '{$p}ps_seo%'");
    $o['legacy_map']=file_exists(WP_CONTENT_DIR.'/uploads/petshop-legacy-301-map.json')?'uploads':(file_exists(WP_CONTENT_DIR.'/mu-plugins/petshop-legacy-301-map.json')?'mu-plugins':'?');
    foreach(glob(WP_CONTENT_DIR.'/mu-plugins/petshop-*301*.php') as $g) $o['mu301'][]=basename($g);
    foreach(glob(WP_CONTENT_DIR.'/mu-plugins/petshop-404*.php') as $g) $o['mu404'][]=basename($g);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
