<?php
/** TEMP PS S1616 run e6r — RECON (tik skaitymas) „Siunta grįžta“ sumoms: WC pristatymo zonos/metodai su įkainiais (instance settings, svorio lentelės), nemokamo pristatymo slenksčiai, testinių užsakymų shipping eilutės (method_id/instance_id/cost/tax), darbalaukio `vezejas()` reikšmės, grįžusių testinių (#35438/#35421/#35439) sumos. */
add_action('init', function(){
  if (!isset($_GET['ps_e6r'])) return;
  $o=array('v'=>'S1616 e6r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  try{
    // 1. Zonos ir metodai
    $zones=WC_Shipping_Zones::get_zones(); $zones[0]=array('id'=>0,'zone_name'=>'Rest of world','shipping_methods'=>WC_Shipping_Zones::get_zone(0)->get_shipping_methods());
    foreach($zones as $z){ $zm=array(); $ms=isset($z['shipping_methods'])?$z['shipping_methods']:array(); foreach($ms as $m){ $inst=$m->instance_settings??array(); $keep=array(); foreach((array)$inst as $k=>$v){ $keep[$k]=is_scalar($v)?mb_substr((string)$v,0,160):json_encode($v); } $zm[]=array('id'=>$m->id,'inst'=>$m->get_instance_id(),'title'=>$m->get_title(),'enabled'=>$m->enabled,'settings'=>$keep); } $o['zones'][]=array('name'=>$z['zone_name'],'id'=>$z['id'],'methods'=>$zm); }
    // 2. Svorio lentelės — ar yra plugino (weight based) lentelės options
    $o['ship_options']=$wpdb->get_results("SELECT option_name, LEFT(option_value,400) v FROM {$p}options WHERE option_name LIKE 'woocommerce_%_settings' AND (option_name LIKE '%venipak%' OR option_name LIKE '%lithuania%' OR option_name LIKE '%flat_rate%' OR option_name LIKE '%free_shipping%' OR option_name LIKE '%weight%') LIMIT 40",ARRAY_A);
    $o['ship_plugins']=array_values(array_filter((array)get_option('active_plugins'),function($x){ return preg_match('/ship|venipak|lithuania|weight|table/i',$x); }));
    // 3. Darbalaukio vezejas() logika
    $mu=WPMU_PLUGIN_DIR; $c=(string)file_get_contents($mu.'/petshop-desk.php'); $i=strpos($c,'function vezejas'); $o['desk_vezejas']=$i!==false?substr($c,$i,1800):'nerasta';
    $i=strpos($c,'function vezejo_vardas'); $o['desk_vezejo_vardas']=$i!==false?substr($c,$i,900):'nerasta';
    // 4. Testiniai — shipping eilutės ir grįžusios siuntos
    foreach(array(35438,35421,35439,35414,35420,35435,35441,35442,35450) as $id){ $x=wc_get_order($id); if(!$x) continue; $sh=array(); foreach($x->get_items('shipping') as $s){ $sh[]=array('m'=>$s->get_method_id(),'inst'=>$s->get_instance_id(),'name'=>$s->get_name(),'cost'=>$s->get_total(),'tax'=>$s->get_total_tax(),'meta'=>array_slice(array_map(function($m){ return $m->key.'='.mb_substr(is_scalar($m->value)?$m->value:json_encode($m->value),0,60); },$s->get_meta_data()),0,8)); }
      $o['uzs'][$id]=array('st'=>$x->get_status(),'total'=>$x->get_total(),'ship'=>$x->get_shipping_total(),'ship_tax'=>$x->get_shipping_tax(),'sh'=>$sh,'vez'=>class_exists('Petshop_Desk')?(new ReflectionMethod('Petshop_Desk','vezejas'))->isPublic():null,'grizta'=>(string)$x->get_meta('_ps_siunta_grizta'),'weight'=>0); $w=0; foreach($x->get_items() as $it){ $pr=$it->get_product(); if($pr) $w+=(float)$pr->get_weight()*$it->get_quantity(); } $o['uzs'][$id]['weight']=$w; }
    // 5. Pristatymo puslapis 14894 — įkainių pastraipa
    $pg=get_post(14894); $t=wp_strip_all_tags((string)($pg?$pg->post_content:'')); $i=mb_stripos($t,'2,15'); $o['pristatymas_14894']=$i!==false?preg_replace('/\s+/',' ',mb_substr($t,max(0,$i-600),1500)):mb_substr(preg_replace('/\s+/',' ',$t),0,1500);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $J($o);
},99);
