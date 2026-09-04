<?php
/** TEMP PS S1612 run e4r — R: variklio konstantos ir registro rašymo semantika (STATUSAI, Petshop_Siuntos::zalias/prideti_is_plugino, atšaukimo kabliukai) — tik skaitymas */
add_action('init', function(){
  if (!isset($_GET['ps_e4r'])) return;
  $o=array('v'=>'run e4r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(120);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $src=function($cls,$m,$max=2000){ try{ $r=new ReflectionMethod($cls,$m); $ls=file($r->getFileName()); return mb_substr(implode('',array_slice($ls,$r->getStartLine()-1,$r->getEndLine()-$r->getStartLine()+1)),0,$max); }catch(Throwable $e){ return 'ERR '.$e->getMessage(); } };
  try{
    $o['STATUSAI']=Petshop_Desk::STATUSAI; $o['META_PAK']=Petshop_Desk::META_PAK;
    $o['zalias']=$src('Petshop_Siuntos','zalias',1200); $o['prideti']=$src('Petshop_Siuntos','prideti_is_plugino',2200); $o['registruota_grupiu']=$src('Petshop_Siuntos','registruota_grupiu',900);
    foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $fi){ $c=file_get_contents($fi); if(preg_match_all("/add_action\(\s*'woocommerce_order_status_(cancelled|completed_to_cancelled|processing_to_cancelled|[a-z_-]*cancel[a-z_-]*)'[^\n]{0,140}/",$c,$m)){ $o['cancel_hookai'][basename($fi)]=array_values(array_unique($m[0])); } if(preg_match_all("/AV grąžinimas[^\n]{0,120}/u",$c,$m)){ $o['av_grazinimas'][basename($fi)]=array_slice(array_values(array_unique($m[0])),0,3); } }
    $o['av_stock']=class_exists('Petshop_AV_Stock')?array_map(function($m){return $m->getName();},(new ReflectionClass('Petshop_AV_Stock'))->getMethods()):'nera';
    $o['likutis_dl']=$src('Petshop_Darbalaukis','likutis',1500);
    $o['siuntos_35440']=Petshop_Siuntos::sarasas(35440); $o['siuntos_35438']=Petshop_Siuntos::sarasas(35438);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
