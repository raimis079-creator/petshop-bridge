<?php
/** TEMP PS S1676 run u — snippet 2515 Petshop Sources: av eilutės logika. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676t'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 t');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $s=$wpdb->get_row("SELECT id,name,code,priority FROM {$p}snippets WHERE id=2515",ARRAY_A); $o['name']=$s['name']; $o['md5']=md5($s['code']); $o['ilgis']=strlen($s['code']);
  $L=explode("\n",$s['code']); foreach($L as $i=>$l){ if(preg_match("/'av'|\"av\"|_own_stock_qty|add_action|add_filter|function |stock_qty/",$l)) $o['eil'][]=($i+1).': '.trim(mb_substr($l,0,220)); }
  $o['src_stulp']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_sources",0);
  $o['av_eil_n']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_sources WHERE source='av'"); $o['publish_n']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}posts WHERE post_type='product' AND post_status='publish'");
  $o['pvz_legacy']=$wpdb->get_results("SELECT s.product_id,s.stock_qty,s.is_active,(SELECT meta_value FROM {$p}postmeta WHERE post_id=s.product_id AND meta_key='_stock') st,(SELECT meta_value FROM {$p}postmeta WHERE post_id=s.product_id AND meta_key='_own_stock_qty') own,(SELECT meta_value FROM {$p}postmeta WHERE post_id=s.product_id AND meta_key='_ps_sandelis') sand FROM {$p}ps_sources s WHERE s.source='av' ORDER BY RAND() LIMIT 6",ARRAY_A);
  $o['nesutampa']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_sources s WHERE s.source='av' AND s.is_active=1 AND s.stock_qty <> COALESCE((SELECT meta_value FROM {$p}postmeta WHERE post_id=s.product_id AND meta_key='_own_stock_qty'),(SELECT meta_value FROM {$p}postmeta WHERE post_id=s.product_id AND meta_key='_stock'),0)+0");
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
