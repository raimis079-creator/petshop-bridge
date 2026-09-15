<?php
/** TEMP PS S1683 b — read-only: #35400 prekės tipas/rinkinio meta, #1053 eilučių meta (rinkinys tėvas/vaikai), partijų nurašymo kodo vieta rinkiniams. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683b'])) return; global $wpdb; $o=array('v'=>'S1683 b'); $pr=wc_get_product(35400);
  $o['preke']=array('tipas'=>$pr->get_type(),'sku'=>$pr->get_sku(),'stock_mng'=>$pr->get_manage_stock(),'stock'=>$pr->get_stock_quantity(),'meta'=>array_filter(array_map(function($m){return preg_match('/rink|bundle|_ps_/i',$m->key)?$m->key.'='.substr(json_encode($m->value,JSON_UNESCAPED_UNICODE),0,120):null;},$pr->get_meta_data())));
  $w=wc_get_order(35951); foreach($w->get_items() as $iid=>$it){ $mm=array(); foreach($it->get_meta_data() as $m) if(!preg_match('/^_reduced|^_qty/',$m->key)) $mm[]=$m->key.'='.substr(json_encode($m->value,JSON_UNESCAPED_UNICODE),0,80); $o['eil'][$iid]=$it->get_product_id().' '.substr($it->get_name(),0,30).' | '.implode(' ; ',$mm); }
  foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $f){ $s=file_get_contents($f); if(strpos($s,'Partijose trūksta')!==false){ $n=basename($f); preg_match('/Version:\s*([\d.]+)/i',$s,$mv); $o['partiju_failas']=$n.' v'.($mv[1]??''); preg_match_all('/^.*(rinkin|bundle|Partijose trūksta|foreach \( \$o(rder)?->get_items\(\)).*$/mi',$s,$m); $o['partiju_eil']=array_slice(array_map(function($x){return substr(trim($x),0,220);},$m[0]),0,15); } }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
