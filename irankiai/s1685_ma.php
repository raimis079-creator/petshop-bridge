<?php
/** TEMP PS S1685 ma — READ-ONLY: Google Ads būklė 09-15 rytas: ps_fakt_reklama paskutinės dienos pagal kampaniją, ps_ads_recon/paskutinis, offline įkėlimo žurnalas, gclid užsakymai, Ads vs WC konversijos. */
add_action('init', function(){
  if (!isset($_GET['ps_s1685ma'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1685 ma');
  foreach(array('ps_ads_paskutinis','ps_ads_recon','ps_ads_offline_paskutinis','ps_ads_offline_log','ps_ads_offline_busena') as $k) $o['opt'][$k]=get_option($k,null);
  $o['opcijos_ads']=$wpdb->get_results("SELECT option_name k, LEFT(option_value,400) v FROM {$p}options WHERE option_name LIKE 'ps_ads%' OR option_name LIKE 'ps_offline%'",ARRAY_A);
  $o['reklama_dienos']=$wpdb->get_results("SELECT diena, kampanija, islaidos_ct, paspaudimai, konversijos, konv_verte_ct FROM {$p}ps_fakt_reklama WHERE diena>='2026-09-09' ORDER BY diena, islaidos_ct DESC",ARRAY_A);
  $o['reklama_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_reklama");
  $o['wc_ads_dienos']=$wpdb->get_results("SELECT diena, COUNT(*) uzs, SUM(gclid=1) su_gclid, SUM(klientas_naujas=1) nauji, ROUND(SUM(viso_ct)/100) eur FROM {$p}ps_fakt_uzsakymai WHERE testinis=0 AND apmoketa_at IS NOT NULL AND (kanalas_pirmas='mokamas' OR kanalas_paskutinis='mokamas' OR gclid=1) GROUP BY diena ORDER BY diena",ARRAY_A);
  $o['gclid_meta']=$wpdb->get_results("SELECT meta_key k, COUNT(*) n, MAX(meta_value) pask FROM {$p}wc_orders_meta WHERE meta_key IN('_ps_gclid','_ps_ads_offline_uploaded','_ps_ads_offline_at','_ps_ads_conversion_sent') GROUP BY k",ARRAY_A);
  $o['offline_meta_all']=$wpdb->get_results("SELECT meta_key k, COUNT(*) n FROM {$p}wc_orders_meta WHERE meta_key LIKE '%offline%' OR meta_key LIKE '%ads%' GROUP BY k",ARRAY_A);
  $f=WPMU_PLUGIN_DIR.'/petshop-ads-offline.php'; if(file_exists($f)){ $L=explode("\n",file_get_contents($f)); foreach($L as $i=>$l) if(preg_match('/update_option|add_option|get_option|rest_route|register_rest_route|_ps_gclid|conversion_name|Conversion Name|update_post_meta|update_meta_data/i',$l)) $o['offline_kodas'][]=($i+1).': '.trim(mb_substr($l,0,180)); }
  $o['ads_uzklausos_log']=$wpdb->get_results("SELECT * FROM {$p}ps_ads_log ORDER BY id DESC LIMIT 5",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
