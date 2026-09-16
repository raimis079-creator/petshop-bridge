<?php
/** TEMP PS S1687 b — READ-ONLY: ps_fakt_uzsakymai stulpeliai; užsakymai per dieną 09-08…09-16 (visi / su gclid / kanalas mokamas) su suma. */
add_action('init', function(){
  if (!isset($_GET['ps_s1687b'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1687 b');
  $c=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_uzsakymai"); $o['cols']=$c;
  $suma=in_array('suma_ct',$c)?'suma_ct':(in_array('bendra_suma_ct',$c)?'bendra_suma_ct':(in_array('suma_su_pvm_ct',$c)?'suma_su_pvm_ct':'0'));
  $o['suma_col']=$suma;
  $o['dienos']=$wpdb->get_results("SELECT DATE(apmoketa_at) d, COUNT(*) n, SUM(gclid IS NOT NULL AND gclid<>'') ads_gclid, SUM(kanalas_paskutinis='mokamas') mokamas, SUM(klientas_naujas=1) nauji, ROUND(SUM($suma)/100,2) eur, ROUND(SUM(CASE WHEN gclid IS NOT NULL AND gclid<>'' THEN $suma ELSE 0 END)/100,2) eur_ads FROM {$p}ps_fakt_uzsakymai WHERE testinis=0 AND apmoketa_at>=CURDATE()-INTERVAL 9 DAY GROUP BY d ORDER BY d",ARRAY_A); $o['err']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
