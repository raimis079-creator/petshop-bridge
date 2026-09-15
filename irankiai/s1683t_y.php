<?php
/** TEMP PS S1683t y — read-only: kodėl #18054 grąžinama į draft — vf_block_log, wp_insert_post_data filtrai, pilnumas meta. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683ty'])) return; global $wpdb,$wp_filter; $p=$wpdb->prefix; $o=array('v'=>'y');
  $o['block']=$wpdb->get_results("SELECT * FROM {$p}vf_block_log WHERE post_id=18054 ORDER BY id DESC LIMIT 4",ARRAY_A);
  $o['block_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}vf_block_log");
  foreach(array('wp_insert_post_data','save_post_product','woocommerce_before_product_object_save','transition_post_status','publish_product') as $h){ if(empty($wp_filter[$h])) continue; foreach($wp_filter[$h]->callbacks as $pr=>$cbs) foreach($cbs as $cb){ $fn=$cb['function']; $n=is_string($fn)?$fn:(is_array($fn)?(is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]:'closure'); if(preg_match('/petshop|ps_|vf|Petshop|VF/i',$n)||$n==='closure'){ $ref=null; try{ $ref=is_array($fn)?new ReflectionMethod($fn[0],$fn[1]):new ReflectionFunction($fn);}catch(Throwable $e){} $o['hooks'][$h][]=$n.' @'.($ref?basename($ref->getFileName()).':'.$ref->getStartLine():''); } } }
  $o['meta']=array('pilnumas'=>get_post_meta(18054,'_ps_pilnumas',true),'truksta'=>get_post_meta(18054,'_ps_pilnumas_truksta',true),'draft_reason'=>get_post_meta(18054,'_ps_draft_reason',true),'vf_blocked'=>get_post_meta(18054,'_vf_blocked',true),'vf_stock'=>get_post_meta(18054,'_vf_stock',true),'vf_status'=>get_post_meta(18054,'_vf_status',true));
  $all=get_post_meta(18054); $o['meta_keys_vf_ps']=array_values(array_filter(array_keys($all),function($k){return preg_match('/block|draft|hide|paslep|review|publish/i',$k);}));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
