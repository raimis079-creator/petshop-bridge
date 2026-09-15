<?php
/** TEMP PS S1686 mk — READ-ONLY: petshop_fc_perm (svečias?), Feeding_Service::evaluate pavyzdys 2 prekėms × 3 svoriams (pet_input.current_weight_kg), kalbos/rūšies žymė. */
add_action('init', function(){
  if (!isset($_GET['ps_s1686mk'])) return; $o=array('v'=>'S1686 mk');
  $R=file(WPMU_PLUGIN_DIR.'/petshop-feeding-calc-rest.php'); foreach($R as $i=>$l) if(preg_match('/function petshop_fc_perm/',$l)){ $o['perm']=implode("\n",array_map('trim',array_slice($R,$i,12))); break; }
  foreach(array(18014=>array(10,20,30),12466=>array(10,20,30),18054=>array(3,5,7)) as $pid=>$ws){ $pr=wc_get_product($pid); if(!$pr) continue; $k=$pid.' '.$pr->get_name().' ['.$pr->get_price().' €]'; foreach($ws as $kg){ try{ $r=Petshop_Feeding_Service::evaluate(array('product_id'=>$pid,'quantity'=>1,'pet_input'=>array('current_weight_kg'=>$kg,'conditions'=>array()))); }catch(Throwable $e){ $r=array('ERR'=>$e->getMessage()); } $o['pvz'][$k][$kg]=array_intersect_key($r,array_flip(array('status','tier','portion_g','duration_days','eur_per_day','eur_per_month'))); } }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
