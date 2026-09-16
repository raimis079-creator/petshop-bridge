<?php
/** TEMP PS S1688 f — read-only: VF cache XML — Exclusion įrašai su Intestinal/Hepatic/Monoprotein/kiaul (product_name), + visų Exclusion sąrašas (sku, name, qty, price) 60 eil. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688f'])) return; $o=array('v'=>'S1688 f'); $u=wp_upload_dir(); $x=simplexml_load_file($u['basedir'].'/petshop-vf-cache.xml'); $n=0;
  foreach($x->row as $it){ $b=(string)$it->brand; $nm=(string)$it->product_name; if(stripos($b,'exclusion')===false && stripos($nm,'exclusion')===false) continue; $n++;
    if(preg_match('/intest|hepat|monoprot|kiaul|pork|maistin/i',$nm)) $o['kand'][]=(string)$it->sku_id.' | '.mb_substr($nm,0,80).' | bc '.(string)$it->barcode.' | qty '.(string)$it->qty.' | '.(string)$it->base_price.'/'.(string)$it->personal_price;
    if(count($o['visi']??array())<60) $o['visi'][]=(string)$it->sku_id.' | '.mb_substr($nm,0,60).' | qty '.(string)$it->qty; }
  $o['excl_n']=$n;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
