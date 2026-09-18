<?php
/** TEMP PS S1691 d — kur rašoma ps_dim_klientai / ps_web_dienos; petshop-klientai.php 115–135; lentelių būklė. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1691d'])) return; global $wpdb; $p=$wpdb->prefix; $o=array(); $wpdb->suppress_errors(true);
  $dirs=array(WPMU_PLUGIN_DIR, WP_PLUGIN_DIR.'/petshop-core');
  foreach ($dirs as $d){ $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($d)); foreach ($it as $f){ if (substr($f,-4)!=='.php') continue; $c=@file_get_contents($f); if ($c===false) continue;
    foreach (array('ps_dim_klientai','ps_web_dienos') as $t){ if (strpos($c,$t)!==false){ $lines=explode("\n",$c); foreach ($lines as $i=>$l){ if (strpos($l,$t)!==false && preg_match('/insert|replace|INSERT|REPLACE|DUPLICATE/i',$l)) $o['kur'][$t][basename($f)][]=($i+1).': '.trim(mb_substr($l,0,200)); } if (!isset($o['kur'][$t][basename($f)])) $o['kur'][$t][basename($f)]='(tik paminėta)'; } } } }
  // ps_dim_klientai rašymo kontekstas: rasti failą su INSERT ir parodyti ±25 eil.
  foreach ((array)($o['kur']['ps_dim_klientai']??array()) as $fn=>$v){ if (!is_array($v)) continue; foreach ($dirs as $d){ $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($d)); foreach ($it as $f){ if (basename($f)!==$fn) continue; $lines=file($f); $o['dim_failas']=array('kelias'=>str_replace(ABSPATH,'',$f),'md5'=>md5_file($f),'dydis'=>filesize($f)); preg_match('/Version:\s*([\d\.]+)/',implode('',array_slice($lines,0,20)),$m); $o['dim_failas']['versija']=$m[1]??null;
      foreach ($v as $ln){ $n=(int)$ln; for($i=max(0,$n-30);$i<min(count($lines),$n+15);$i++) $o['dim_ctx'][$i+1]=rtrim($lines[$i]); } } } }
  $kf=WPMU_PLUGIN_DIR.'/petshop-klientai.php'; if (file_exists($kf)){ $l=file($kf); for($i=112;$i<135;$i++) if(isset($l[$i])) $o['klientai_113_135'][$i+1]=rtrim($l[$i]); $o['klientai_md5']=md5_file($kf); }
  $o['dim_lentele']=$wpdb->get_row("SELECT COUNT(*) n, MIN(perskaiciuota_at) min_p, MAX(perskaiciuota_at) max_p, SUM(perskaiciuota_at>=CURDATE()-INTERVAL 1 DAY) siandien FROM {$p}ps_dim_klientai",ARRAY_A);
  $o['dim_indeksai']=$wpdb->get_results("SHOW INDEX FROM {$p}ps_dim_klientai",ARRAY_A);
  $o['dim_pask_cron']=get_option('ps_dim_klientu_pask');
  $o['web_dienos_pask']=$wpdb->get_row("SELECT MAX(data) max_d, COUNT(*) n FROM {$p}ps_web_dienos",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
