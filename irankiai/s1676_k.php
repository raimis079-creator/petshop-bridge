<?php
/** TEMP PS S1676 run k — schemos analitikos langui. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676k'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 k');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  foreach(array('ps_carts','ps_email_jobs','ps_fakt_uzsakymai','ps_fakt_uzsakymu_eilutes','ps_fakt_reklama','ps_fakt_siuntos','ps_web_ivykiai','ps_klientai') as $t){ $T=$p.$t; if($wpdb->get_var("SHOW TABLES LIKE '$T'")!==$T){ $o['t'][$t]='NĖRA'; continue; } $o['t'][$t]=array('stulp'=>$wpdb->get_col("SHOW COLUMNS FROM $T",0),'n'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM $T")); }
  $o['fakt_lenteles']=$wpdb->get_col("SHOW TABLES LIKE '{$p}ps_fakt%'");
  $o['carts_pvz']=$wpdb->get_row("SELECT * FROM {$p}ps_carts WHERE status='abandoned' ORDER BY updated_at DESC LIMIT 1",ARRAY_A); if($o['carts_pvz']) foreach($o['carts_pvz'] as $k=>&$v){ if(is_string($v)) $v=mb_substr($v,0,400); if(preg_match('/email|vardas|name|ip/',$k)) $v='***'; }
  $o['jobs_pvz']=$wpdb->get_row("SELECT * FROM {$p}ps_email_jobs WHERE flow='cart_abandoned' AND status='sent' ORDER BY id DESC LIMIT 1",ARRAY_A); if($o['jobs_pvz']) foreach($o['jobs_pvz'] as $k=>&$v){ if(is_string($v)) $v=mb_substr($v,0,200); if(preg_match('/email|recipient/',$k)) $v='***'; }
  $o['fu_pvz']=$wpdb->get_row("SELECT * FROM {$p}ps_fakt_uzsakymai ORDER BY 1 DESC LIMIT 1",ARRAY_A); if($o['fu_pvz']) foreach($o['fu_pvz'] as $k=>&$v){ if(preg_match('/email|vardas|pavard|tel|adres|miest/',$k)) $v='***'; }
  $o['rekl_pvz']=$wpdb->get_row("SELECT * FROM {$p}ps_fakt_reklama ORDER BY 1 DESC LIMIT 1",ARRAY_A);
  $o['lank_menu']=array(); foreach(glob(WPMU_PLUGIN_DIR.'/petshop-ataskaita-lankomumas.php') as $f){ $s=file_get_contents($f); preg_match_all("/add_submenu_page\([^;]{0,200}/",$s,$m); $o['lank_menu']=$m[0]; preg_match("/class\s+(\w+)/",$s,$c); $o['lank_class']=$c[1]??''; preg_match_all("/function\s+(\w+)\s*\(/",$s,$fn); $o['lank_fn']=array_slice($fn[1],0,30); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
