<?php
/** Plugin Name: TEMP PS S1736e archyvo eilutės DP užsakymams (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1736e'])) return;
  $f=$_GET['ps_s1736e']; @set_time_limit(200); $r=['v'=>'S1736e','faze'=>$f];
  try{
  if($f==='1'){
    $a=(array)get_option('ps_laisku_archyvas',[]);
    foreach($a as $l){ $h=(string)$l['html']; foreach(['1130','1181'] as $nr){ if(preg_match('~<b>'.$nr.'</b>.*?(?=<tr><td rowspan|</table>)~s',$h,$m)){ $r['eil'][$nr][]=[$l['laikas'],wp_strip_all_tags(str_replace(['</td>','</tr>'],[' | ',"\n"],$m[0]))]; } } }
    foreach([36002,36003] as $id){ $r['pak'][$id]=['sku'=>get_post_meta($id,'_sku',true),'base_sku'=>get_post_meta(get_post_meta($id,'_dp_base_product_id',true),'_sku',true)]; }
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
