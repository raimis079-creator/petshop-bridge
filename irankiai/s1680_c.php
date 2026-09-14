<?php
/** TEMP PS S1680 c — read-only: LP plugino (woo-lithuaniapost) API funkcijos lipdukui: failai, klasės, metodai. */
add_action('init', function(){
  if (!isset($_GET['ps_s1680c'])) return; $o=array('v'=>'S1680 c'); $dir=WP_PLUGIN_DIR.'/woo-lithuaniapost-main';
  $rii=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir)); $files=array();
  foreach($rii as $f){ if($f->isFile()&&substr($f,-4)==='.php'){ $files[]=str_replace($dir.'/','',$f->getPathname()); } }
  $o['files']=$files;
  $pat='/(function\s+\w*(initiat|barcode|sticker|label|parcel|shipping_item|call_courier|courier|create_parcel|create_shipping|print)\w*\s*\([^)]*\))/i';
  foreach($files as $rel){ $c=file_get_contents($dir.'/'.$rel); if(preg_match_all($pat,$c,$m)){ $o['fn'][$rel]=array_slice(array_unique(array_map(function($x){return preg_replace('/\s+/',' ',$x);},$m[1])),0,25); } if(preg_match_all('/class\s+(\w+)/',$c,$m2)) $o['cls'][$rel]=array_slice($m2[1],0,6); }
  foreach($files as $rel){ $c=file_get_contents($dir.'/'.$rel); if(preg_match_all('/(https?:\/\/[\w.\-]*(post\.lt|unisend)[^\'"\s]*)/i',$c,$m)) $o['urls'][$rel]=array_slice(array_unique($m[1]),0,8); }
  foreach($files as $rel){ $c=file_get_contents($dir.'/'.$rel); if(preg_match_all('/(?:add_action|add_filter)\s*\(\s*[\'"]([^\'"]*(ajax|bulk|initiat|sticker|label|parcel)[^\'"]*)[\'"]/i',$c,$m)) $o['hooks'][$rel]=array_slice(array_unique($m[1]),0,15); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
