<?php
/** Plugin Name: TEMP PS S1715c instock su likuciu 0 skenas (1 skenas / 2 taisyti / 9 atstatyti) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1715c'])) return;
  $f=$_GET['ps_s1715c']; @set_time_limit(170); global $wpdb; $r=['v'=>'S1715c','faze'=>$f]; $P=$wpdb->prefix;
  $sql="SELECT p.ID, p.post_title, p.post_status, ss.meta_value stock_status, st.meta_value stock, bo.meta_value backorders, sa.meta_value sandelis, own.meta_value own, p.post_modified FROM {$wpdb->posts} p JOIN {$wpdb->postmeta} ms ON ms.post_id=p.ID AND ms.meta_key='_manage_stock' AND ms.meta_value='yes' JOIN {$wpdb->postmeta} ss ON ss.post_id=p.ID AND ss.meta_key='_stock_status' AND ss.meta_value='instock' JOIN {$wpdb->postmeta} st ON st.post_id=p.ID AND st.meta_key='_stock' AND CAST(st.meta_value AS SIGNED)<=0 LEFT JOIN {$wpdb->postmeta} bo ON bo.post_id=p.ID AND bo.meta_key='_backorders' LEFT JOIN {$wpdb->postmeta} sa ON sa.post_id=p.ID AND sa.meta_key='_ps_sandelis' LEFT JOIN {$wpdb->postmeta} own ON own.post_id=p.ID AND own.meta_key='_own_stock_qty' WHERE p.post_type IN ('product','product_variation') AND p.post_status='publish' AND (bo.meta_value IS NULL OR bo.meta_value='no')";
  try{
  if($f==='1'){
    $rows=$wpdb->get_results($sql,ARRAY_A); $r['n']=count($rows);
    $g=[]; foreach($rows as $x){ $k=$x['sandelis']?:'(nera)'; $g[$k]=($g[$k]??0)+1; } $r['pagal_sandeli']=$g;
    $r['pagal_modified']=$wpdb->get_results("SELECT DATE(post_modified) d, COUNT(*) n FROM ($sql) x GROUP BY DATE(post_modified) ORDER BY n DESC LIMIT 10",ARRAY_A);
    // ar realiai WC atmeta: has_enough_stock(1) pavyzdziams
    $r['pvz']=array_map(function($x){ $p=wc_get_product($x['ID']); return [$x['ID'],mb_substr($x['post_title'],0,55),$x['post_status'],$x['stock'],$x['sandelis'],$x['own'],$p?($p->is_in_stock()?'in':'out'):'?',$p?($p->has_enough_stock(1)?'enough':'NOT'):'?',$p?$p->get_type():'?']; },array_slice($rows,0,40));
    // pardavimai 365 d. (istorija) — ar tai perkamos prekes
    $ids=implode(',',array_map(function($x){return (int)$x['ID'];},$rows)?:[0]);
    $r['parduota_365']=$wpdb->get_results("SELECT product_id, SUM(kiekis) k FROM (SELECT product_id, kiekis FROM {$P}ps_fakt_eilutes WHERE product_id IN ($ids) UNION ALL SELECT product_id, kiekis FROM {$P}ps_ist_fakt_eilutes WHERE product_id IN ($ids) AND sukurta_at>=DATE_SUB(NOW(),INTERVAL 365 DAY)) x GROUP BY product_id ORDER BY k DESC LIMIT 25",ARRAY_A);
    $r['funkcijos']=['ps_sources_sync_saugiai'=>function_exists('ps_sources_sync_saugiai'),'wc_update_product_stock_status'=>function_exists('wc_update_product_stock_status')];
  }
  if($f==='2'){
    $rows=$wpdb->get_results($sql,ARRAY_A); $bak=get_option('ps_s1715_instock0_bak',[]); $done=[];
    foreach($rows as $x){ $id=(int)$x['ID']; $bak[$id]=['stock_status'=>$x['stock_status'],'stock'=>$x['stock'],'t'=>current_time('mysql')]; wc_update_product_stock_status($id,'outofstock'); $done[]=$id; }
    update_option('ps_s1715_instock0_bak',$bak,false); $r['pakeista']=count($done); $r['ids']=$done;
    if(function_exists('wc_delete_product_transients')) foreach($done as $id) wc_delete_product_transients($id);
    if(function_exists('wp_cache_clear_cache')){ wp_cache_clear_cache(); $r['cache']='isvalytas'; }
    $r['liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM ($sql) x");
  }
  if($f==='9'){ $bak=get_option('ps_s1715_instock0_bak',[]); $n=0; foreach($bak as $id=>$b){ wc_update_product_stock_status((int)$id,$b['stock_status']); $n++; } $r['atstatyta']=$n; if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache(); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
