<?php
/** Plugin Name: TEMP PS S1722b read-only: feed atranka (ps_feeds_ids), pakai feed'uose, GTIN, feed_off meta, Ryto sargo patikru struktura */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1722b'])) return; $r=['v'=>'S1722b']; global $wpdb; $P=$wpdb->prefix; @set_time_limit(120);
  try{
    $ff=WP_PLUGIN_DIR.'/petshop-feeds/petshop-feeds.php'; $s=file_get_contents($ff);
    $i=strpos($s,'function ps_feeds_ids'); $r['ids_fn']=substr($s,$i,2200);
    $i=strpos($s,'function ps_feeds_generuoti'); $r['gen_fn']=substr($s,$i,3200);
    $i=strpos($s,'function ps_feeds_preke'); $r['preke_fn']=substr($s,$i,1800);
    $ids=array_map('intval',$wpdb->get_col("SELECT post_id FROM {$P}postmeta WHERE meta_key='_dp_base_product_id' AND meta_value<>''"));
    if(function_exists('ps_feeds_ids')){ $all=array_map('intval',ps_feeds_ids()); $r['feed_ids_viso']=count($all); $r['pakai_feed_ids']=array_values(array_intersect($ids,$all)); }
    $in=implode(',',$ids);
    $r['paku_gtin']=$wpdb->get_results("SELECT post_id,meta_key,meta_value FROM {$P}postmeta WHERE post_id IN ($in) AND meta_key IN ('_global_unique_id','_ean','_ps_feed_off_google','_ps_feed_off_kaina24','_ps_feed_off_kainos','_weight') AND meta_value<>''",ARRAY_A);
    $r['feed_off_reiksmes']=$wpdb->get_results("SELECT meta_key, meta_value, COUNT(*) n FROM {$P}postmeta WHERE meta_key LIKE '_ps_feed_off_%' GROUP BY 1,2",ARRAY_A);
    $g=file_get_contents(wp_upload_dir()['basedir'].'/petshop-feeds/google.xml'); if(preg_match('#<item>(?:(?!</item>).)*35856(?:(?!</item>).)*</item>#s',$g,$m)) $r['google_35856_item']=mb_substr($m[0],0,1500);
    $r['google_ids_pakai']=[]; foreach($ids as $id){ if(strpos($g,'<g:id>'.$id.'</g:id>')!==false) $r['google_ids_pakai'][]=$id; }
    // g:id formatas
    preg_match_all('#<g:id>([^<]+)</g:id>#',$g,$mm); $r['google_id_pvz']=array_slice($mm[1],0,5); $r['google_id_viso']=count($mm[1]);
    // Ryto sargas: patikros() struktura — kaip pridedama lempute
    $rs=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-rytas.php'); $r['rytas_ver']=preg_match('#Version:\s*([\d.]+)#',$rs,$m2)?$m2[1]:null; $r['rytas_md5']=md5($rs);
    $i=strpos($rs,"/* seimos */"); if($i===false) $i=strpos($rs,"'seimos'"); $r['rytas_seimos_blokas']=$i!==false?substr($rs,max(0,$i-200),1900):null;
    $i=strpos($rs,'function patikros'); $r['rytas_patikros_head']=$i!==false?substr($rs,$i,900):null;
    // baziu kainu pokyciu daznis: kiek publish prekiu _price keitesi? nera istorijos — ps_kainu_zurnalas? tikrinam lenteles
    $r['kainu_lenteles']=$wpdb->get_col("SHOW TABLES LIKE '{$P}ps_%kain%'");
    $r['kat_kainu_log']=$wpdb->get_col("SHOW TABLES LIKE '{$P}ps_katalogo%'");
    // pakai: _regular_price vs qty*base*(1-d) dabartinis d ir 'apvalinimo' pavyzdziai
    foreach($ids as $id){ $b=(int)get_post_meta($id,'_dp_base_product_id',true); $q=(int)get_post_meta($id,'_dp_pack_qty',true); $bp=(float)get_post_meta($b,'_regular_price',true); $pp=(float)get_post_meta($id,'_regular_price',true); $r['pakai'][]=[$id,$q,$b,$bp,$pp,$bp>0?round((1-$pp/($q*$bp))*100,2):null,'mod'=>get_post_field('post_modified',$id),'base_mod'=>get_post_field('post_modified',$b),'base_status'=>get_post_status($b)]; }
    // sausas maistas baziniu kainu galunes (apvalinimo taisyklei)
    $r['kainu_galunes']=$wpdb->get_results("SELECT RIGHT(pm.meta_value,3) g, COUNT(*) n FROM {$P}postmeta pm JOIN {$P}postmeta s ON s.post_id=pm.post_id AND s.meta_key='_ps_dydzio_seima' AND s.meta_value<>'' WHERE pm.meta_key='_regular_price' AND pm.meta_value<>'' GROUP BY 1 ORDER BY n DESC LIMIT 10",ARRAY_A);
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
