<?php
/** TEMP PS S1688 e — read-only: VF cache XML — Exclusion Intestinal / Hepatic įrašai (sku, pavadinimas, barcode, kaina, likutis); XML struktūra. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688e'])) return; $o=array('v'=>'S1688 e'); $u=wp_upload_dir(); $f=$u['basedir'].'/petshop-vf-cache.xml';
  $x=simplexml_load_file($f); if(!$x){ $o['err']='xml'; echo json_encode($o); exit; } $o['root']=$x->getName(); $first=null; foreach($x->children() as $c){ $first=$c; break; } if($first){ $o['item_tag']=$first->getName(); $o['item_fields']=array_keys((array)$first); }
  $n=0; foreach($x->children() as $it){ $a=(array)$it; $t=''; foreach($a as $k=>$v) if(preg_match('/name|title|pavad/i',$k)) $t.=' '.(string)$v; if(preg_match('/Intestinal|Hepatic/i',$t) && preg_match('/Exclusion/i',$t)){ $row=array(); foreach($a as $k=>$v) if(preg_match('/sku|code|kod|name|title|ean|barcode|price|kain|stock|qty|kiek|weight|svor/i',$k)) $row[$k]=mb_substr((string)$v,0,70); $o['rasta'][]=$row; if(++$n>25) break; } }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
