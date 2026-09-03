<?php
/** TEMP PS S1608 run e3p — trijų sandėlių testo paruošimas: prekių kandidatai + šablono užsakymas */
add_action('init', function(){
  if (!isset($_GET['ps_e3p'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e3p'])); $o=array('v'=>'run e3p','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  try{
    $rm=new ReflectionMethod('Petshop_AV_Source','resolve'); $o['resolve_sig']=array_map(function($x){return $x->getName();},$rm->getParameters());
    foreach(array(35444,35443,35441) as $oid){ $ord=wc_get_order($oid); if(!$ord) continue; $sh=array(); foreach($ord->get_items('shipping') as $si){ $sh[]=array('method_id'=>$si->get_method_id(),'instance'=>$si->get_instance_id(),'title'=>$si->get_method_title(),'total'=>$si->get_total(),'meta'=>$si->get_meta_data()?array_map(function($m){return $m->key.'='.mb_substr(is_scalar($m->value)?$m->value:json_encode($m->value),0,60);},$si->get_meta_data()):array()); }
      $om=array(); foreach($ord->get_meta_data() as $m){ if(strpos($m->key,'venipak')!==false||strpos($m->key,'_ps_')===0) $om[$m->key]=mb_substr(is_scalar($m->value)?$m->value:json_encode($m->value),0,80); }
      $o['sablonas'][$oid]=array('st'=>$ord->get_status(),'pay'=>$ord->get_payment_method(),'bill'=>$ord->get_billing_first_name().' '.$ord->get_billing_last_name().' '.$ord->get_billing_email().' '.$ord->get_billing_phone().' '.$ord->get_billing_address_1().' '.$ord->get_billing_city().' '.$ord->get_billing_postcode(),'ship'=>$sh,'meta'=>$om,'items'=>array_map(function($it){return $it->get_product_id().' '.$it->get_quantity().'x '.mb_substr($it->get_name(),0,30).' src='.$it->get_meta('_ps_source').' k='.$it->get_meta('_ps_kelias');},array_values($ord->get_items()))); }
    $ids=wc_get_products(array('status'=>'publish','limit'=>400,'return'=>'ids','stock_status'=>'instock','type'=>'simple','orderby'=>'ID','order'=>'DESC'));
    $kand=array('zb'=>array(),'vf'=>array(),'av'=>array()); $n=0;
    foreach($ids as $pid){ $v=Petshop_AV_Source::resolve($pid,1); $s=is_array($v)?($v['source']??''):''; $aq=is_array($v)?($v['av_qty']??null):null; if(!isset($kand[$s])) continue; if(count($kand[$s])>=4) continue; $pr=wc_get_product($pid); $kand[$s][]=array('pid'=>$pid,'n'=>mb_substr($pr->get_name(),0,40),'sku'=>$pr->get_sku(),'av_qty'=>$aq,'w'=>$pr->get_weight(),'zb'=>get_post_meta($pid,'_zb_qty',true),'stock'=>$pr->get_stock_quantity(),'own'=>get_post_meta($pid,'_own_stock_qty',true),'kodel'=>mb_substr((string)($v['reason']??json_encode($v)),0,80)); if(++$n>3&&count($kand['zb'])>=4&&count($kand['vf'])>=4&&count($kand['av'])>=4) break; }
    $o['kand']=$kand; $o['pvz_resolve_19708']=Petshop_AV_Source::resolve(19708,1);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
