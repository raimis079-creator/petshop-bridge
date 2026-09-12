<?php
/** TEMP PS S1676 run o — snippet 570/567 (DP likučiai), AV_Stock qty/decrease/increase, Fulfillment_Source::resolve, #1006 DP pastabos. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676o'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 o');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $o['snip']=$wpdb->get_results("SELECT id,name,active,LENGTH(code) ilgis FROM {$p}snippets WHERE id IN (567,570) OR name LIKE '%DP%pak%' OR name LIKE '%Daugiau%'",ARRAY_A);
  foreach($wpdb->get_results("SELECT id,name,code FROM {$p}snippets WHERE id IN (567,570)",ARRAY_A) as $s){ $o['snip_code'][$s['id']]=mb_substr($s['code'],0,6000); }
  foreach(array('Petshop_AV_Stock'=>array('qty','decrease','increase'),'Petshop_Fulfillment_Source'=>array('resolve')) as $c=>$ms){ if(!class_exists($c)) continue; $rc=new ReflectionClass($c); $L=explode("\n",file_get_contents($rc->getFileName())); $o['f_'.$c]=str_replace(WP_CONTENT_DIR,'',$rc->getFileName()).' md5 '.md5_file($rc->getFileName()); foreach($ms as $mn){ if($rc->hasMethod($mn)){ $m=$rc->getMethod($mn); $o[$c.'::'.$mn]=implode("\n",array_slice($L,$m->getStartLine()-1,min(45,$m->getEndLine()-$m->getStartLine()+1))); } } }
  $notes=wc_get_order_notes(array('order_id'=>35886,'limit'=>60)); foreach($notes as $n){ $c=(string)$n->content; if(preg_match('/DP|pak|17659|Likutis|AV|S1670/u',$c)) $o['n1006'][]=$n->date_created->date('m-d H:i').' '.mb_substr(preg_replace('/\s+/',' ',$c),0,200); }
  $w=wc_get_order(35886); foreach($w->get_items() as $iid=>$it){ $o['i1006'][$iid]=array('pid'=>$it->get_product_id(),'q'=>$it->get_quantity(),'meta'=>array()); foreach($it->get_meta_data() as $m){ if(strpos($m->key,'_ps')===0||strpos($m->key,'_dp')===0||strpos($m->key,'_reduced')===0) $o['i1006'][$iid]['meta'][$m->key]=is_scalar($m->value)?$m->value:json_encode($m->value); } }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
