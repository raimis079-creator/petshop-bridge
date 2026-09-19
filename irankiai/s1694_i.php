<?php
/** TEMP PS S1694 i — refill engine: S323 feedback_url sąlyga (kontekstas ±40 eil.), feedback REST/puslapis visame petshop-core. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1694i'])) return; $o=array(); $C=WP_CONTENT_DIR; $d="$C/plugins/petshop-core";
  $f="$d/includes/class-refill-engine.php"; $L=file($f); $o['eil']=count($L); $o['md5']=md5(implode('',$L));
  foreach ($L as $i=>$l){ if (strpos($l,'S323')!==false){ $o['s323_kontekstas']=implode('',array_slice($L,max(0,$i-30),60)); break; } }
  $hits=array(); $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($d,FilesystemIterator::SKIP_DOTS));
  foreach ($it as $ff){ if (!$ff->isFile()||substr($ff->getFilename(),-4)!=='.php') continue; $s=file_get_contents($ff->getPathname()); if (stripos($s,'feedback')===false) continue; preg_match_all('/[^\n]{0,110}feedback[^\n]{0,150}/i',$s,$m); $hits[str_replace($d,'',$ff->getPathname())]=array_slice(array_values(array_unique($m[0])),0,25); }
  $o['feedback_visur']=$hits;
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
