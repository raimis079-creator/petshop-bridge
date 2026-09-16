<?php
/** TEMP PS S1688 a — read-only: INPS06 (Exclusion 7 kg) — kodėl AV 34: meta, pastabos, likučių judėjimai, kiek prekių šiandien tapo AV. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688a'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1688 a');
  $id=$wpdb->get_var("SELECT post_id FROM {$p}postmeta WHERE meta_key='_sku' AND meta_value='INPS06' LIMIT 1"); $pr=wc_get_product($id); $o['id']=$id;
  $o['p']=array('n'=>$pr->get_name(),'st'=>$pr->get_status(),'stock'=>$pr->get_stock_quantity(),'mng'=>$pr->get_manage_stock(),'mod'=>$pr->get_date_modified()->date('m-d H:i'));
  $m=array(); foreach($pr->get_meta_data() as $md) if(preg_match('/^_ps_|^_vf_|_own_|tiek|sandel|stock/i',$md->key)&&!preg_match('/_ps_ga|desc|pilnum/i',$md->key)) $m[$md->key]=substr(json_encode($md->value,JSON_UNESCAPED_UNICODE),0,70); $o['meta']=$m;
  $o['notes']=array_map(function($c){return $c->comment_date.' '.substr($c->comment_content,0,160);},get_comments(array('post_id'=>$id,'type'=>'note','number'=>8,'status'=>'approve')));
  foreach($wpdb->get_results("SHOW TABLES LIKE '{$p}ps_%'",ARRAY_N) as $t) if(preg_match('/likut|stock|judej|gavim|atsarg/i',$t[0])) $o['lent'][]=$t[0];
  foreach($o['lent']??array() as $t){ $c=$wpdb->get_col("SHOW COLUMNS FROM $t"); $pc=null; foreach($c as $cc) if(preg_match('/^(product_id|preke_id|prekes_id)$/',$cc)){ $pc=$cc; break; } if($pc) $o['jud'][$t]=$wpdb->get_results("SELECT * FROM $t WHERE $pc=$id ORDER BY 1 DESC LIMIT 5",ARRAY_A); }
  $o['av_siandien']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}postmeta pm JOIN {$p}posts po ON po.ID=pm.post_id WHERE pm.meta_key='_ps_sandelis' AND pm.meta_value='av' AND po.post_modified>='2026-09-16'");
  $o['av_viso']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}postmeta WHERE meta_key='_ps_sandelis' AND meta_value='av'");
  $o['excl_av']=$wpdb->get_results("SELECT po.ID,po.post_title,po.post_modified,(SELECT meta_value FROM {$p}postmeta WHERE post_id=po.ID AND meta_key='_stock') st FROM {$p}posts po JOIN {$p}postmeta pm ON pm.post_id=po.ID AND pm.meta_key='_ps_sandelis' AND pm.meta_value='av' WHERE po.post_title LIKE 'Exclusion%' AND po.post_type='product' LIMIT 15",ARRAY_A);
  $o['e']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
