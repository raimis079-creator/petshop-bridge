<?php
/** Plugin Name: TEMP PS S1719f — B2 backup būklė (state failai), read-only (k) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1719f'])) return; $r=['v'=>'S1719f','t'=>date('Y-m-d H:i:s')];
  $b='/home/gyvunai2/backups/'; $mask=function($s){ return preg_replace('/(key|Key|secret|token|enc)[^"]*"\s*:\s*"[^"]{4,}"/i','$1":"***"',$s); };
  foreach(['.ps-backup-state.json','.ps-watch-state.json','.b2creds.php'] as $f){ $fp=$b.$f; $r[$f]=file_exists($fp)?['bytes'=>filesize($fp),'mtime'=>date('Y-m-d H:i',filemtime($fp)),'perm'=>substr(sprintf('%o',fileperms($fp)),-4),'turinys'=>$f==='.b2creds.php'?'(neskaitomas)':substr($mask(file_get_contents($fp)),0,2500)]:'nėra'; }
  $all=array_map(function($x){return [basename($x),round(filesize($x)/1024).'kb',date('m-d H:i',filemtime($x))];},glob($b.'{,.}*',GLOB_BRACE)?:[]); $r['backups_dir']=$all;
  $c=file_get_contents($b.'ps-backup.php'); preg_match_all('/[^\n]{0,70}(uploads|mu-plugins|themes|files|tar|database\.sql|FILES|DIRS)[^\n]{0,70}/',$c,$m); $r['skripto_apimtis']=array_slice(array_unique(array_map('trim',$m[0])),0,25); $r['skripto_v']=preg_match('/v\d+\.\d+/',substr($c,0,600),$mv)?$mv[0]:null;
  foreach(glob($b.'*.log')?:[] as $l){ $r['log_'.basename($l)]=array_slice(array_filter(explode("\n",substr(file_get_contents($l),-3000))),-12); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},1);
