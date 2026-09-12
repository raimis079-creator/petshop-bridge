<?php
/** TEMP PS S1677 e — read-only: užsakymų ekonomika iš ps_fakt_* (kontribucija, Ads išlaidos, tarifai). */
add_action('init', function(){
  if (!isset($_GET['ps_s1677e'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1677 e');
  $s="COUNT(*) n, ROUND(SUM(viso_ct)/100,2) viso, ROUND(SUM(prekiu_suma_ct)/100,2) prekes, ROUND(SUM(savikaina_ct)/100,2) savik, ROUND(SUM(pristatymas_paimta_ct)/100,2) prist_paimta, ROUND(SUM(pristatymas_savikaina_ct)/100,2) prist_savik, ROUND(SUM(mokejimo_mokestis_ct)/100,2) mok_mok, ROUND(SUM(pakuotes_savikaina_ct)/100,2) pakuote, ROUND(SUM(marza_ct)/100,2) marza, ROUND(SUM(kontribucija_ct)/100,2) kontrib, ROUND(AVG(kontribucija_ct)/100,2) kontrib_vid, SUM(klientas_naujas) nauji, SUM(pristatymas_savikaina_ct IS NULL OR pristatymas_savikaina_ct=0) prist_savik_null";
  $t="{$p}ps_fakt_uzsakymai WHERE testinis=0 AND statusas_galutinis NOT IN('cancelled','failed','refunded')";
  $o['viso']=$wpdb->get_row("SELECT $s FROM $t",ARRAY_A);
  $o['ads']=$wpdb->get_row("SELECT $s FROM $t AND (gclid<>'' OR (utm_source='google' AND utm_medium LIKE '%cpc%'))",ARRAY_A);
  $o['statusai']=$wpdb->get_results("SELECT statusas_galutinis s,COUNT(*) n FROM {$p}ps_fakt_uzsakymai WHERE testinis=0 GROUP BY 1",ARRAY_A);
  $o['pagal_vezeja']=$wpdb->get_results("SELECT vezejai,COUNT(*) n,ROUND(AVG(pristatymas_paimta_ct)/100,2) paimta,ROUND(AVG(pristatymas_savikaina_ct)/100,2) savik FROM $t GROUP BY 1",ARRAY_A);
  $o['reklama_dienos']=$wpdb->get_results("SELECT diena,senoji_svetaine sena,SUM(islaidos_ct)/100 isl,SUM(paspaudimai) klik,SUM(konversijos) konv,ROUND(SUM(konv_verte_ct)/100) kv FROM {$p}ps_fakt_reklama GROUP BY 1,2 ORDER BY 1",ARRAY_A);
  $o['reklama_kamp']=$wpdb->get_results("SELECT kampanija,MIN(diena) nuo,MAX(diena) iki,SUM(islaidos_ct)/100 isl,SUM(paspaudimai) klik,SUM(konversijos) konv FROM {$p}ps_fakt_reklama GROUP BY 1",ARRAY_A);
  $o['tarifai']=$wpdb->get_results("SELECT vezejas,tipas,dydis,svoris_nuo_g n,svoris_iki_g i,kaina_ct/100 k,kaina_uz_kg_ct kg,galioja_iki gi FROM {$p}ps_tarifai ORDER BY vezejas,tipas,svoris_nuo_g",ARRAY_A);
  $o['siuntos']=$wpdb->get_results("SELECT vezejas,pristatymo_tipas t,COUNT(*) n,ROUND(AVG(kaina_vezejo_ct)/100,2) k,SUM(kaina_vezejo_ct IS NULL) nul,ROUND(AVG(svoris_deklaruotas_g)) sv FROM {$p}ps_fakt_siuntos WHERE testinis=0 AND statusas<>'atsaukta' GROUP BY 1,2",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
