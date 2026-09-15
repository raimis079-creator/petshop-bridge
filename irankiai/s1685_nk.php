<?php
/** TEMP PS S1685 nk — RECON read-only: petshop-analitika-langas.php struktūra (metodai, blokai, SLENKSCIAI, hook'ai), ps_fakt_uzsakymai stulpeliai, klientas_naujas/kanalas reikšmės nuo T-0. */
add_action('init', function(){
  if (!isset($_GET['ps_s1685nk'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1685 nk');
  $f=WPMU_PLUGIN_DIR.'/petshop-analitika-langas.php'; $s=file_get_contents($f); $o['md5']=md5($s); $o['len']=strlen($s);
  preg_match_all('/function\s+(\w+)\s*\(/',$s,$m); $o['fn']=$m[1]; preg_match_all('/(apply_filters|do_action)\(\s*\'([^\']+)\'/',$s,$m2); $o['hooks']=array_unique($m2[2]);
  $i=strpos($s,'SLENKSCIAI'); $o['slenksciai']=substr($s,$i,900); $j=strpos($s,'function blokas'); $o['blokas_ctx']=$j!==false?substr($s,$j,1500):null;
  $k=strpos($s,'function render'); $o['render_ctx']=$k!==false?substr($s,$k,1800):null;
  $o['fakt_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_uzsakymai");
  $o['kanalai']=$wpdb->get_results("SELECT kanalas, klientas_naujas, COUNT(*) n FROM {$p}ps_fakt_uzsakymai WHERE sukurta_at>='2026-09-09' GROUP BY 1,2",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
