<?php
/** TEMP PS S1684 mg — READ-ONLY: kaip petshop-faktai skaičiuoja marza_ct/kontribucija_ct; ps_fakt_uzsakymai sumos nuo T-0 (kaina/pvm/sav/marža/pristatymas); reklama × nauji. */
add_action('init', function(){
  if (!isset($_GET['ps_s1684mg'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1684 mg'); $wpdb->suppress_errors(true);
  $f=WPMU_PLUGIN_DIR.'/petshop-faktai.php'; $s=file_get_contents($f); $o['faktai_md5']=md5($s); $L=explode("\n",$s);
  foreach($L as $i=>$l) if(preg_match('/marza_ct|kontribucija_ct|savikaina_ct\s*[=+]|pristatymas_paimta|pristatymas_savikaina|pvm_ct\s*[=+]|viso_ct\s*=|prekiu_ct/i',$l)) $o['faktai_eil'][]=($i+1).': '.trim(mb_substr($l,0,240));
  $o['u_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_uzsakymai");
  $o['sumos']=$wpdb->get_row("SELECT COUNT(*) n, SUM(viso_ct) viso, SUM(prekiu_ct) prekiu, SUM(pvm_ct) pvm, SUM(savikaina_ct) sav, SUM(marza_ct) marza, SUM(kontribucija_ct) kontr, SUM(pristatymas_paimta_ct) pr_paimta, SUM(pristatymas_savikaina_ct) pr_sav, SUM(klientas_naujas=1) nauji FROM {$p}ps_fakt_uzsakymai WHERE testinis=0 AND apmoketa_at IS NOT NULL",ARRAY_A);
  $o['pvz']=$wpdb->get_results("SELECT uzsakymas_id, viso_ct, prekiu_ct, pvm_ct, savikaina_ct, marza_ct, kontribucija_ct, pristatymas_paimta_ct, kanalas_pirmas, klientas_naujas FROM {$p}ps_fakt_uzsakymai WHERE testinis=0 AND apmoketa_at IS NOT NULL ORDER BY uzsakymas_id DESC LIMIT 4",ARRAY_A);
  $o['e_pvz']=$wpdb->get_results("SELECT uzsakymas_id, sku, kiekis, kaina_ct, pvm_ct, savikaina_ct FROM {$p}ps_fakt_eilutes ORDER BY id DESC LIMIT 4",ARRAY_A);
  $o['mokamas_nauji']=$wpdb->get_row("SELECT COUNT(*) n, SUM(klientas_naujas=1) nauji, SUM(viso_ct) viso, SUM(marza_ct) marza FROM {$p}ps_fakt_uzsakymai WHERE testinis=0 AND apmoketa_at IS NOT NULL AND kanalas_pirmas='mokamas'",ARRAY_A);
  $o['spend_nuo_t0']=$wpdb->get_var("SELECT SUM(islaidos_ct) FROM {$p}ps_fakt_reklama WHERE diena>='2026-09-09' AND kanalas='google_ads'");
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
