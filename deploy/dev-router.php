<?php
/* R194 dev.avesa.lt marsrutizatorius v1.1 — laikinas iki DNS perjungimo.
   Aptarnauja visa svetaine (statika + PHP) is petshop.lt katalogo. */
$base = '/home/gyvunai2/domains/petshop.lt/public_html';
$uri  = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$uri  = rawurldecode((string)$uri);
if ($uri === '' || $uri[0] !== '/') { $uri = '/'.$uri; }
$kelias = realpath($base . $uri);
if ($kelias !== false && is_dir($kelias)) { $kelias = realpath($kelias . '/index.php'); $uri = rtrim($uri,'/').'/index.php'; }
/* saugikliai */
$blogas = ($kelias === false)
  || strncmp($kelias, $base, strlen($base)) !== 0
  || basename($kelias) === 'wp-config.php'
  || strpos(basename($kelias), '.ht') === 0
  || basename($kelias) === 'perkelti-r186.php';
if ($blogas) {
  /* ne failas — perduodam WordPress front controlleriui (grazus URL, wp-json, 404 psl.) */
  $kelias = $base . '/index.php';
  $_SERVER['SCRIPT_FILENAME'] = $kelias;
  $_SERVER['SCRIPT_NAME'] = '/index.php';
  $_SERVER['PHP_SELF'] = '/index.php';
  chdir($base);
  require $kelias;
  exit;
}

$ext = strtolower(pathinfo($kelias, PATHINFO_EXTENSION));
if ($ext === 'php') {
  $_SERVER['SCRIPT_FILENAME'] = $kelias;
  $_SERVER['SCRIPT_NAME'] = $uri;
  $_SERVER['PHP_SELF'] = $uri;
  chdir(dirname($kelias));
  require $kelias;
  exit;
}
$mime = array(
 'css'=>'text/css','js'=>'application/javascript','mjs'=>'application/javascript',
 'png'=>'image/png','jpg'=>'image/jpeg','jpeg'=>'image/jpeg','gif'=>'image/gif','webp'=>'image/webp','avif'=>'image/avif',
 'svg'=>'image/svg+xml','ico'=>'image/x-icon','woff'=>'font/woff','woff2'=>'font/woff2','ttf'=>'font/ttf','otf'=>'font/otf','eot'=>'application/vnd.ms-fontobject',
 'json'=>'application/json','xml'=>'text/xml','txt'=>'text/plain','html'=>'text/html','htm'=>'text/html','pdf'=>'application/pdf',
 'mp4'=>'video/mp4','webm'=>'video/webm','mp3'=>'audio/mpeg','zip'=>'application/zip','gz'=>'application/gzip','map'=>'application/json',
);
header('Content-Type: '.(isset($mime[$ext]) ? $mime[$ext] : 'application/octet-stream'));
header('Content-Length: '.filesize($kelias));
header('Cache-Control: public, max-age=3600');
$mt = filemtime($kelias);
header('Last-Modified: '.gmdate('D, d M Y H:i:s', $mt).' GMT');
if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) >= $mt) { http_response_code(304); exit; }
readfile($kelias);
exit;
