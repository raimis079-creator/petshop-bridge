<?php
/** Plugin Name: TEMP PS S1716m sausi maistai iki 20 kg: kas blokuoja pastomata read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1716m'])) return;
  @set_time_limit(170); global $wpdb; $r=['v'=>'S1716m'];
  try{
    $sql="SELECT p.ID, LEFT(p.post_title,55) t, CAST(wt.meta_value AS DECIMAL(8,2)) kg, s.meta_value sand, tk.meta_value tik_kurj, l.meta_value l, w.meta_value w, h.meta_value h FROM {$wpdb->posts} p JOIN {$wpdb->term_relationships} tr ON tr.object_id=p.ID JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='product_cat' JOIN {$wpdb->terms} tm ON tm.term_id=tt.term_id AND tm.slug LIKE 'sausas-maistas%' LEFT JOIN {$wpdb->postmeta} wt ON wt.post_id=p.ID AND wt.meta_key='_weight' LEFT JOIN {$wpdb->postmeta} s ON s.post_id=p.ID AND s.meta_key='_ps_sandelis' LEFT JOIN {$wpdb->postmeta} tk ON tk.post_id=p.ID AND tk.meta_key='_ps_tik_kurjeriu' LEFT JOIN {$wpdb->postmeta} l ON l.post_id=p.ID AND l.meta_key='_length' LEFT JOIN {$wpdb->postmeta} w ON w.post_id=p.ID AND w.meta_key='_width' LEFT JOIN {$wpdb->postmeta} h ON h.post_id=p.ID AND h.meta_key='_height' WHERE p.post_type='product' AND p.post_status='publish' GROUP BY p.ID";
    $rows=$wpdb->get_results($sql,ARRAY_A); $r['sausu_n']=count($rows);
    $iki20=array_filter($rows,function($x){return (float)$x['kg']>0&&(float)$x['kg']<=20;}); $r['iki20_n']=count($iki20);
    $r['be_svorio']=count(array_filter($rows,function($x){return (float)$x['kg']<=0;}));
    $r['virs20']=array_values(array_map(function($x){return [$x['ID'],$x['t'],$x['kg']];},array_filter($rows,function($x){return (float)$x['kg']>20;})));
    $r['virs249']=count(array_filter($rows,function($x){return (float)$x['kg']>24.9;}));
    $dims=function($x){ $d=[(float)$x['l'],(float)$x['w'],(float)$x['h']]; sort($d); return $d[0]>39.5||$d[1]>41||$d[2]>61; };
    $r['iki20_blokuoja_matmenys']=count(array_filter($iki20,$dims)); $r['iki20_blokuoja_matmenys_pagal_sandeli']=array_count_values(array_map(function($x){return $x['sand']?:'(nera)';},array_filter($iki20,$dims)));
    $tk=array_filter($iki20,function($x){return $x['tik_kurj']==='yes';}); $r['iki20_tik_kurjeriu_n']=count($tk); $r['iki20_tik_kurjeriu']=array_values(array_map(function($x){return [$x['ID'],$x['t'],$x['kg'],$x['sand']];},$tk));
    $r['iki20_abu']=count(array_filter($iki20,function($x) use($dims){return $x['tik_kurj']==='yes'&&$dims($x);}));
    $r['iki20_ok_dabar']=count(array_filter($iki20,function($x) use($dims){return $x['tik_kurj']!=='yes'&&!$dims($x);}));
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
