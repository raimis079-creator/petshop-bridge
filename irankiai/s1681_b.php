<?php
/** TEMP PS S1681 b — read-only: ryto sargo raudonos, neissiusti taisyklė, ps_sargas_klaidos 36 val., snippetas su "$a→". */
add_action('init', function(){
  if (!isset($_GET['ps_s1681b'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1681 b');
  $o['rytas']=get_option('ps_rytas_sargas_pask');
  foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $f){ $s=file_get_contents($f); if(strpos($s,'neissiusti')!==false){ $n=basename($f); preg_match('/Version:\s*([\d.]+)/i',$s,$mv); $o['rytas_failas'][$n]=$mv[1]??'';
    if(preg_match_all('/^.*neissiusti.*$/m',$s,$m)) $o['neiss_eil'][$n]=array_map(function($x){return substr(trim($x),0,400);},$m[0]); } }
  $o['klaidos_36h']=$wpdb->get_results("SELECT laikas,lygis,LEFT(zinute,200) z,failas,eilute,kiek FROM {$p}ps_sargas_klaidos WHERE laikas>=DATE_SUB(NOW(),INTERVAL 36 HOUR) ORDER BY id DESC LIMIT 30",ARRAY_A);
  $o['snip_a']=$wpdb->get_results("SELECT id,name,active,LEFT(code,500) c FROM {$p}snippets WHERE code LIKE '%\$a→%' OR (code LIKE '%a→%' AND active=1) LIMIT 5",ARRAY_A);
  $o['temp_snips']=$wpdb->get_results("SELECT id,name,active,modified FROM {$p}snippets WHERE name LIKE 'TEMP%' OR name LIKE 'dep-%' ORDER BY id DESC LIMIT 10",ARRAY_A);
  $ids=$wpdb->get_col("SELECT o.id FROM {$p}wc_orders o WHERE o.type='shop_order' AND o.status='wc-processing' ORDER BY o.id");
  foreach($ids as $id){ $w=wc_get_order($id); $o['processing'][]=array('nr'=>$w->get_order_number(),'sukurta'=>$w->get_date_created()->date('m-d H:i'),'apmok'=>$w->get_payment_method(),'sm'=>implode('|',array_map(function($s){return $s->get_name();},$w->get_shipping_methods())),'issiusta'=>$w->get_meta('_ps_dalys_issiusta')?'taip':'ne','venipak'=>$w->get_meta('_ps_venipak_sekimas')?'yra':'','pastabos'=>array_map(function($n){return substr($n->date_created->date('m-d H:i').' '.$n->content,0,120);},array_slice(wc_get_order_notes(array('order_id'=>$id,'limit'=>3)),0,3))); }
  $o['e']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
