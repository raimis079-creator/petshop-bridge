<?php
/** TEMP PS S1676 run ad — ar daugiau T-0 „papildymas“ partijų, kurių kiekis sutampa su ZB/VF feed likučiu (fantominis AV). READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676ad'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 ad');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $rows=$wpdb->get_results("SELECT pa.id,pa.product_id pid,pa.kiekis_gautas k,pa.pastaba,(SELECT meta_value FROM {$p}postmeta WHERE post_id=pa.product_id AND meta_key='_zb_qty') zb,(SELECT meta_value FROM {$p}postmeta WHERE post_id=pa.product_id AND meta_key='_vf_qty') vf,(SELECT meta_value FROM {$p}postmeta WHERE post_id=pa.product_id AND meta_key='_own_stock_qty') own,(SELECT meta_value FROM {$p}postmeta WHERE post_id=pa.product_id AND meta_key='_ps_sandelis') sand FROM {$p}ps_partijos pa WHERE pa.atsaukta=0 AND pa.pastaba LIKE 'Pradinis likutis T-0%' AND pa.kiekis_gautas>=50 ORDER BY pa.kiekis_gautas DESC LIMIT 40",ARRAY_A);
  foreach($rows as &$r){ $r['pav']=mb_substr(get_the_title($r['pid']),0,60); $r['itartina']=((int)$r['k']>=100 && (abs((int)$r['k']-(int)$r['zb'])<=20 || abs((int)$r['k']-(int)$r['vf'])<=20))?'ZB/VF kopija?':''; }
  $o['n_papild']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_partijos WHERE pastaba LIKE '%papildymas, S1682%' AND atsaukta=0");
  $o['rows']=$rows;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
});
