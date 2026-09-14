<?php
/** TEMP PS S1681 ab — petshop-av-sheets.php: surinkimo lapų šriftas didesnis (min 12px → 14/12/18); tik CSS; bak ps-backups/petshop-av-sheets.php.bak_s1681; token_get_all prieš rašant. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681ab'])) return; $o=array('v'=>'S1681 ab'); $f=WPMU_PLUGIN_DIR.'/petshop-av-sheets.php'; $s=file_get_contents($f);
  if(md5($s)!=='13c793bd57974337373d332db160f3d7'){ $o['STOP']='md5'; echo json_encode($o); exit; }
  $u=wp_upload_dir(); $bak=$u['basedir'].'/ps-backups/petshop-av-sheets.php.bak_s1681'; if(!file_exists($bak)) file_put_contents($bak,$s); $o['bak']=md5_file($bak)===md5($s);
  $map=array(
    '.ps-antraste b { font-size:15px;'=>'.ps-antraste b { font-size:17px;',
    '.ps-antraste span { font-size:12px;'=>'.ps-antraste span { font-size:13px;',
    '.ps-tbl td { padding:5px 4px; border-bottom:1px dotted #ccc; vertical-align:top; font-size:13px; }'=>'.ps-tbl td { padding:7px 4px; border-bottom:1px dotted #bbb; vertical-align:top; font-size:15px; }',
    '.ps-qty { width:42px; font-weight:700; font-size:16px;'=>'.ps-qty { width:46px; font-weight:700; font-size:19px;',
    '.ps-check { width:28px; text-align:center; font-size:16px;'=>'.ps-check { width:30px; text-align:center; font-size:18px;',
    '.ps-sku { color:#888; font-size:11px;'=>'.ps-sku { color:#777; font-size:12.5px;',
    '.ps-pastaba { color:#a05a00; font-size:11px;'=>'.ps-pastaba { color:#a05a00; font-size:12.5px;',
    '.ps-pastaba-i { color:#a05a00; font-size:11px;'=>'.ps-pastaba-i { color:#a05a00; font-size:12.5px;',
    '.ps-uzs-h b { font-size:14px; }'=>'.ps-uzs-h b { font-size:16px; }',
    '.ps-kl { margin-left:10px; font-size:13px; }'=>'.ps-kl { margin-left:10px; font-size:14.5px; }',
    '.ps-met { margin-left:10px; font-size:11px;'=>'.ps-met { margin-left:10px; font-size:12.5px;',
    '.ps-dalis { margin-left:10px; font-size:11px;'=>'.ps-dalis { margin-left:10px; font-size:12.5px;',
    '.ps-eil { font-size:13px; padding:1px 0 1px 14px; }'=>'.ps-eil { font-size:14.5px; padding:2px 0 2px 14px; }',
  );
  foreach($map as $a=>$b) if(substr_count($s,$a)!==1){ $o['STOP']='nerasta: '.$a; echo json_encode($o); exit; }
  $n=str_replace(array_keys($map),array_values($map),$s);
  try { token_get_all($n, TOKEN_PARSE); } catch (Throwable $e) { $o['STOP']=$e->getMessage(); echo json_encode($o); exit; }
  file_put_contents($f,$n); if(function_exists('opcache_invalidate')) opcache_invalidate($f,true); $o['md5_po']=md5_file($f); $o['dydis']=filesize($f); $o['pakeista']=count($map);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
