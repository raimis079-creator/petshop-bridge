<?php
/** Plugin Name: TEMP PS S1725o read-only: po 2 partijos — gamintojų puslapių veidai (ar pakų nėra kortelėmis), lentelės pavyzdžiai */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1725o'])) return; $r=['v'=>'S1725o']; global $wpdb; $P=$wpdb->prefix; @set_time_limit(170);
  $get=function($u){ $x=wp_remote_get($u,['timeout'=>35,'sslverify'=>false,'cookies'=>['ps_js'=>'1']]); return is_wp_error($x)?'':wp_remote_retrieve_body($x); };
  $kort=function($h){ preg_match_all('#<p class="name product-title[^"]*"><a[^>]*>([^<]+)</a>#',$h,$m); return $m[1]; };
  $lent=function($h){ if(!preg_match('#<table[^>]*>(?:(?!</table>).)*Rinktis.*?</table>#s',$h,$m)) return 'NERA'; $t=preg_replace('#<tr[^>]*>#',"\n",$m[0]); $t=preg_replace('#<[^>]+>#',' ',$t); return array_values(array_filter(array_map(function($l){return trim(preg_replace('/\s+/',' ',$l));},explode("\n",html_entity_decode($t))))); };
  try{
    foreach(['Josera','Farmina','Monge','Exclusion'] as $bn){ $t=get_term_by('name',$bn,'product_brand'); if(!$t) continue; $k=$kort($get(add_query_arg('ps_nc',time(),get_term_link($t)))); $r['gamintojas'][$bn]=['korteliu'=>count($k),'pakai_kortelese'=>array_values(array_filter($k,function($x){return stripos($x,'2 vnt.')!==false;}))]; }
    $pk=$wpdb->get_col("SELECT m.post_id FROM {$P}postmeta m WHERE m.meta_key='_ps_s1725_gen' AND m.meta_value='2' ORDER BY m.post_id");
    $pv=[]; foreach($pk as $id){ $b=(int)get_post_meta($id,'_dp_base_product_id',true); $bn=wp_get_post_terms($b,'product_brand',['fields'=>'names']); $bn=$bn?$bn[0]:'?'; if(!isset($pv[$bn])) $pv[$bn]=$b; }
    foreach(array_slice($pv,0,4,true) as $bn=>$b){ $r['lentele'][$bn.' #'.$b]=$lent($get(get_permalink($b).'?ps_nc='.time())); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE); exit;
}, 1);
