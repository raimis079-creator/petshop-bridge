<?php
/** TEMP PS S1683t t — read-only: VF susiejimo klaidų skenas — prekės, kur _vf_barcode nesutampa su _ean (be kontrolinio skaitmens) arba kaina < 0.5×VF xml kaina; JOS0805 kas tai; 21707 vs 18054. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683tt'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'t');
  $rows=$wpdb->get_results("SELECT pm.post_id id, MAX(CASE WHEN pm.meta_key='_ean' THEN pm.meta_value END) ean, MAX(CASE WHEN pm.meta_key='_vf_barcode' THEN pm.meta_value END) vfb, MAX(CASE WHEN pm.meta_key='_vf_supplier_sku' THEN pm.meta_value END) vfsku, MAX(CASE WHEN pm.meta_key='_vf_cost_xml' THEN pm.meta_value END) vfxml, MAX(CASE WHEN pm.meta_key='_price' THEN pm.meta_value END) price, MAX(CASE WHEN pm.meta_key='_vf_match_type' THEN pm.meta_value END) mt FROM {$p}postmeta pm JOIN {$p}posts po ON po.ID=pm.post_id AND po.post_type='product' WHERE pm.meta_key IN('_ean','_vf_barcode','_vf_supplier_sku','_vf_cost_xml','_price','_vf_match_type') GROUP BY pm.post_id HAVING vfb IS NOT NULL AND vfb<>''",ARRAY_A);
  $o['viso_vf']=count($rows); $ne=array(); $pig=array();
  foreach($rows as $r){ $e=preg_replace('/\D/','',(string)$r['ean']); $b=preg_replace('/\D/','',(string)$r['vfb']); if($e&&$b&&strpos($e,$b)!==0&&$e!==$b&&substr($e,0,-1)!==$b) $ne[]=$r['id'].' '.get_the_title($r['id']).' | ean '.$e.' vf '.$b.' '.$r['vfsku'].' ('.$r['mt'].') kaina '.$r['price'];
    if((float)$r['vfxml']>0&&(float)$r['price']>0&&(float)$r['price']<0.6*(float)$r['vfxml']) $pig[]=$r['id'].' '.get_the_title($r['id']).' | kaina '.$r['price'].' vs VF xml '.$r['vfxml'].' '.$r['vfsku'].' st='.get_post_status($r['id']); }
  $o['ean_nesutampa_n']=count($ne); $o['ean_nesutampa']=array_slice($ne,0,25); $o['pigiau_60proc_n']=count($pig); $o['pigiau_60proc']=array_slice($pig,0,25);
  $o['jos0805']=$wpdb->get_results("SELECT ID,post_title,post_status FROM {$p}posts WHERE ID IN (SELECT post_id FROM {$p}postmeta WHERE meta_key='_vf_supplier_sku' AND meta_value='JOS0805') OR post_title LIKE '%JOS0805%'",ARRAY_A);
  $o['import32975']=array('t'=>get_the_title(32975),'st'=>get_post_status(32975),'type'=>get_post_type(32975),'meta'=>array_slice(array_map(function($k,$v){return $k.'='.substr($v[0],0,50);},array_keys(get_post_meta(32975)),get_post_meta(32975)),0,20));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
