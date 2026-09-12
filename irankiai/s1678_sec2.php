<?php
/** TEMP PS S1678 sec2 — read-only: neįprasti webroot failai, root ps-backups, .bak pasiekiamumas per HTTP. */
add_action('init', function(){
  if (!isset($_GET['ps_sec8b'])) return; $o=array('v'=>'S1678 sec2'); $r=ABSPATH;
  foreach(array('backup-run.php','watch-run.php','index.html.backup.5a6defd0b6c8b4cd418a970086e2c0b4') as $f){ $o['fail'][$f]=file_exists($r.$f)?array('dydis'=>filesize($r.$f),'mtime'=>date('Y-m-d H:i',filemtime($r.$f)),'turinys'=>substr(file_get_contents($r.$f),0,300)):'nera'; }
  $o['root_ps_backups']=array(); foreach(glob($r.'ps-backups/*') as $f) $o['root_ps_backups'][]=basename($f).' '.round(filesize($f)/1024).'KB '.date('m-d',filemtime($f));
  $u=wp_upload_dir()['basedir'].'/ps-backups'; $o['upl_ps_backups_n']=count(glob($u.'/*')); $o['upl_ps_backups_pvz']=array_slice(array_map('basename',glob($u.'/*.bak_s167*')),0,5);
  $ua=array('timeout'=>10,'redirection'=>0,'sslverify'=>false);
  foreach(array('/wp-content/uploads/ps-backups/petshop-feeds.php.bak_s1677','/wp-content/uploads/ps-backups/petshop-darbalaukis.php.bak_s1676','/wp-content/uploads/pmax-s1672/manifest.json','/wp-content/mu-plugins/petshop-darbalaukis.php','/wp-content/debug.log','/.git/HEAD','/wp-content/uploads/wpallimport/logs/','/.env') as $pth){ $x=wp_remote_get('https://petshop.lt'.$pth,$ua); $o['http'][$pth]=is_wp_error($x)?'ERR':wp_remote_retrieve_response_code($x).' '.substr((string)wp_remote_retrieve_header($x,'content-type'),0,25).' '.strlen(wp_remote_retrieve_body($x)); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
