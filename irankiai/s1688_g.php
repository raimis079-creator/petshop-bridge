<?php
/** TEMP PS S1688 g — read-only: VF cache XML — sku_id INP/HEP arba pavadinime virškin/intestin/hepat/kepen/žarn, visi Exclusion be „Hypo/Mono". */
add_action('init', function(){
  if (!isset($_GET['ps_s1688g'])) return; $o=array('v'=>'S1688 g'); $u=wp_upload_dir(); $x=simplexml_load_file($u['basedir'].'/petshop-vf-cache.xml');
  foreach($x->row as $it){ $s=(string)$it->sku_id; $nm=(string)$it->product_name; $b=(string)$it->brand;
    if(preg_match('/^(INP|HEP)/i',$s) || preg_match('/virškin|virskin|intestin|hepat|kepen|žarn|zarn/iu',$nm)) $o['rasta'][]=$s.' | '.$b.' | '.mb_substr($nm,0,90).' | bc '.(string)$it->barcode.' | qty '.(string)$it->qty.' | '.(string)$it->base_price;
    if((stripos($b,'exclusion')!==false||stripos($nm,'exclusion')!==false) && !preg_match('/hypo|mono/i',$nm)) $o['excl_kiti'][]=$s.' | '.mb_substr($nm,0,80).' | qty '.(string)$it->qty; }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
