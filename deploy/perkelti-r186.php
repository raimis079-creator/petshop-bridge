<?php
/* R186 perkelimo skriptas — atskiras, be WordPress. Trina NIEKO, tik rename. */
error_reporting(E_ALL); ini_set('display_errors','0');
header('Content-Type: application/json; charset=utf-8');
$KEY = '82e6f068b8e8b3fbbbecbaa230a2be67';
if(!isset($_GET['raktas']) || $_GET['raktas'] !== $KEY){ http_response_code(404); echo '{}'; exit; }
$veiksmas = isset($_GET['veiksmas']) ? $_GET['veiksmas'] : '';

$dom = '/home/gyvunai2/domains';
$src = $dom.'/avesa.lt/public_html/dev';
$dst = $dom.'/petshop.lt/public_html';
$old = $dom.'/petshop.lt/public_html-senas2019';
$o = array('v'=>'R186','laikas'=>date('Y-m-d H:i:s'));

$stubai = array(
 'wp-load.php'    => "<?php require '/home/gyvunai2/domains/petshop.lt/public_html/wp-load.php';\n",
 'backup-run.php' => "<?php require '/home/gyvunai2/domains/petshop.lt/public_html/backup-run.php';\n",
 'watch-run.php'  => "<?php require '/home/gyvunai2/domains/petshop.lt/public_html/watch-run.php';\n",
 'index.php'      => "<?php define('WP_USE_THEMES', true); require '/home/gyvunai2/domains/petshop.lt/public_html/wp-blog-header.php';\n",
 '.htaccess'      => "# BEGIN WordPress\n<IfModule mod_rewrite.c>\nRewriteEngine On\nRewriteBase /\nRewriteRule ^index\\.php$ - [L]\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule . /index.php [L]\n</IfModule>\n# END WordPress\n",
);

if($veiksmas === 'BUKLE'){
  $o['src_yra_wp'] = is_file($src.'/wp-config.php') ? 'TAIP' : 'NE';
  $o['dst_yra']    = is_dir($dst) ? 'TAIP' : 'NE';
  $o['dst_yra_wp'] = is_file($dst.'/wp-config.php') ? 'TAIP' : 'NE';
  $o['old_yra']    = is_dir($old) ? 'TAIP' : 'NE';
  echo json_encode($o); exit;
}

if($veiksmas === 'PIRMYN'){
  $z = array();
  /* saugikliai */
  if(!is_dir($src) || !is_file($src.'/wp-config.php')){ $z['STOP']='src nera arba be wp-config'; echo json_encode($z); exit; }
  if(is_file($dst.'/wp-config.php')){ $z['STOP']='dst jau turi wp-config — perkelta anksciau?'; echo json_encode($z); exit; }
  if(is_dir($old)){ $z['STOP']='old jau egzistuoja'; echo json_encode($z); exit; }
  /* 1. sena public_html i sona */
  if(!@rename($dst,$old)){ $z['STOP']='1 zingsnis nepavyko: '.json_encode(error_get_last()); echo json_encode($z); exit; }
  $z['z1_sena_i_sona'] = 'OK';
  /* 2. dev -> public_html */
  if(!@rename($src,$dst)){
    $z['z2'] = 'NEPAVYKO: '.json_encode(error_get_last());
    $z['atstatymas'] = @rename($old,$dst) ? 'OK — sena grazinta' : 'KRITINE — sena liko '.$old;
    echo json_encode($z); exit;
  }
  $z['z2_dev_i_dst'] = 'OK';
  /* 3. atkurti dev/ su stubais */
  @mkdir($src, 0755);
  foreach($GLOBALS['stubai'] as $vardas=>$turinys){
    $z['stub_'.$vardas] = (@file_put_contents($src.'/'.$vardas, $turinys) !== false) ? 'OK' : 'NEPAVYKO';
  }
  /* 4. patikra */
  $z['patikra_dst_wpconfig'] = is_file($dst.'/wp-config.php') ? 'TAIP' : 'NE';
  $z['patikra_dst_wpcontent'] = is_dir($dst.'/wp-content') ? 'TAIP' : 'NE';
  $z['patikra_src_stub'] = is_file($src.'/wp-load.php') ? 'TAIP' : 'NE';
  echo json_encode($z); exit;
}

if($veiksmas === 'ATGAL'){
  $z = array();
  if(!is_file($dst.'/wp-config.php')){ $z['STOP']='dst neturi wp-config — nera ko grazinti'; echo json_encode($z); exit; }
  /* stubu katalogo pasalinimas */
  if(is_dir($src)){
    foreach($GLOBALS['stubai'] as $vardas=>$t){ @unlink($src.'/'.$vardas); }
    $z['stub_katalogas'] = @rmdir($src) ? 'PASALINTAS' : 'NEPAVYKO (netuscias?)';
    if(is_dir($src)){ echo json_encode($z); exit; }
  }
  if(!@rename($dst,$src)){ $z['STOP']='grazinimas nepavyko: '.json_encode(error_get_last()); echo json_encode($z); exit; }
  $z['dst_i_dev'] = 'OK';
  if(is_dir($old)){ $z['sena_atgal'] = @rename($old,$dst) ? 'OK' : 'NEPAVYKO'; }
  echo json_encode($z); exit;
}

$o['veiksmai'] = 'BUKLE | PIRMYN | ATGAL';
echo json_encode($o);
