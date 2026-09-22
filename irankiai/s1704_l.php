<?php
/** Plugin Name: TEMP PS S1704l likuciu pataisa */
add_action('init', function(){
  $f=(isset($_GET['ps_s1704l'])?$_GET['ps_s1704l']:''); if(!in_array($f,array('1','2','9'),true)) return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1704l','faze'=>$f);
  try{
    global $wpdb; $p=$wpdb->prefix;
    if($f==='9'){
      $bak=get_option('ps_s1704_likuciai_bak'); if(!$bak) throw new Exception('bak nera');
      foreach($bak['eilutes'] as $r){ $pr=wc_get_product($r['pid']); if(!$pr) continue; $pr->set_stock_quantity($r['buvo']); $pr->set_stock_status($r['buvo']>0?'instock':'outofstock'); $pr->save(); if(function_exists('ps_sources_sync_saugiai')) ps_sources_sync_saugiai($r['pid']); wc_delete_product_transients($r['pid']); $o['atstatyta'][]=$r['pid'].' -> '.$r['buvo']; }
      echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
    }
    // dvigubai nurasytos eilutes
    $rows=$wpdb->get_results("SELECT oi.order_id, oi.order_item_id,
        MAX(CASE WHEN m.meta_key='_product_id' THEN m.meta_value END) pid,
        MAX(CASE WHEN m.meta_key='_reduced_stock' THEN m.meta_value END) wc_red,
        MAX(CASE WHEN m.meta_key='_ps_av_reduced_qty' THEN m.meta_value END) av_red,
        MAX(CASE WHEN m.meta_key='_ps_av_reduced_pid' THEN m.meta_value END) av_pid
      FROM {$p}woocommerce_order_items oi JOIN {$p}woocommerce_order_itemmeta m ON m.order_item_id=oi.order_item_id
      WHERE oi.order_item_type='line_item' GROUP BY oi.order_item_id HAVING wc_red>0 AND av_red>0",ARRAY_A);
    $dvig=array();
    foreach($rows as $r){ $pid=(int)($r['av_pid']?:$r['pid']); $own=get_post_meta($pid,'_own_stock_qty',true); if($own!==''&&$own!==null) continue;
      $dvig[$pid]=(isset($dvig[$pid])?$dvig[$pid]:0)+min((int)$r['wc_red'],(int)$r['av_red']); }
    $part=$wpdb->get_results("SELECT product_id, SUM(kiekis_liko) liko FROM {$p}ps_partijos WHERE atsaukta=0 GROUP BY product_id",ARRAY_A);
    $pmap=array(); foreach($part as $r) $pmap[(int)$r['product_id']]=(int)$r['liko'];
    $planas=array(); $kiti=array();
    foreach($dvig as $pid=>$q){
      $stock=(int)get_post_meta($pid,'_stock',true); $liko=isset($pmap[$pid])?$pmap[$pid]:null;
      $e=array('pid'=>$pid,'sku'=>get_post_meta($pid,'_sku',true),'pav'=>html_entity_decode(get_the_title($pid)),'dvigubai'=>$q,'buvo'=>$stock,'partijos'=>$liko);
      if($liko!==null && $stock<$liko){ $e['prideti']=min($q,$liko-$stock); $e['bus']=$stock+$e['prideti']; $planas[]=$e; }
      else { $e['skirtumas']=($liko===null?null:$stock-$liko); $kiti[]=$e; }
    }
    usort($planas,function($a,$b){return $b['prideti']<=>$a['prideti'];});
    $o['planas_n']=count($planas); $o['planas_vnt']=array_sum(array_column($planas,'prideti')); $o['kiti_n']=count($kiti);
    $o['iki_0_buvo']=count(array_filter($planas,function($x){return $x['buvo']===0;}));
    if($f==='1'){ $o['planas']=$planas; $o['kiti']=$kiti; echo json_encode($o,JSON_UNESCAPED_UNICODE); exit; }
    // 2 — vykdyti
    if(get_option('ps_s1704_likuciai_bak')) throw new Exception('bak jau yra — jau vykdyta');
    update_option('ps_s1704_likuciai_bak',array('laikas'=>current_time('mysql'),'eilutes'=>$planas),false);
    $pad=array();
    foreach($planas as $e){ $pr=wc_get_product($e['pid']); if(!$pr){ $o['klaidos'][]=$e['pid']; continue; }
      $pr->set_stock_quantity($e['bus']); $pr->set_stock_status('instock'); $pr->save();
      if(function_exists('ps_sources_sync_saugiai')) ps_sources_sync_saugiai($e['pid']);
      wc_delete_product_transients($e['pid']);
      $pad[]=array('pid'=>$e['pid'],'dabar'=>(int)get_post_meta($e['pid'],'_stock',true),'partijos'=>$e['partijos'],'ok'=>((int)get_post_meta($e['pid'],'_stock',true)===$e['bus'])); }
    $o['padaryta']=$pad; $o['ok_n']=count(array_filter($pad,function($x){return $x['ok'];}));
    if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache();
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
