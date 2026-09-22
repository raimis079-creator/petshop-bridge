<?php
/** Plugin Name: TEMP PS S1704i dvigubo nurasymo suskaiciavimas */
add_action('init', function(){
  $f=(isset($_GET['ps_s1704i'])?$_GET['ps_s1704i']:''); if($f!=='1') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1704i');
  try{
    global $wpdb; $p=$wpdb->prefix;
    // eilutes kur WC nurase IR AV nurase ta pati kieki
    $rows=$wpdb->get_results("SELECT oi.order_id, oi.order_item_id,
        MAX(CASE WHEN m.meta_key='_product_id' THEN m.meta_value END) pid,
        MAX(CASE WHEN m.meta_key='_reduced_stock' THEN m.meta_value END) wc_red,
        MAX(CASE WHEN m.meta_key='_ps_av_reduced_qty' THEN m.meta_value END) av_red,
        MAX(CASE WHEN m.meta_key='_ps_av_reduced_pid' THEN m.meta_value END) av_pid
      FROM {$p}woocommerce_order_items oi
      JOIN {$p}woocommerce_order_itemmeta m ON m.order_item_id=oi.order_item_id
      WHERE oi.order_item_type='line_item'
      GROUP BY oi.order_item_id
      HAVING wc_red>0 AND av_red>0",ARRAY_A);
    $dvig=array(); $pav=array();
    foreach($rows as $r){
      $pid=(int)($r['av_pid']?:$r['pid']);
      $own=get_post_meta($pid,'_own_stock_qty',true);
      if($own!==''&&$own!==null) continue; // ne grynai AV — AV mazino kita lauka
      $q=min((int)$r['wc_red'],(int)$r['av_red']);
      if(!isset($dvig[$pid])) $dvig[$pid]=0;
      $dvig[$pid]+=$q;
    }
    // palyginam su invariantu
    $part=$wpdb->get_results("SELECT product_id, SUM(kiekis_liko) liko FROM {$p}ps_partijos WHERE atsaukta=0 GROUP BY product_id",ARRAY_A);
    $pmap=array(); foreach($part as $r) $pmap[(int)$r['product_id']]=(int)$r['liko'];
    $ats=array(); $paaisk=0; $nepaaisk=0;
    foreach($dvig as $pid=>$q){
      $stock=(int)get_post_meta($pid,'_stock',true);
      $liko=isset($pmap[$pid])?$pmap[$pid]:null;
      $skirt=($liko===null)?null:($stock-$liko);
      $ats[]=array('pid'=>$pid,'pav'=>html_entity_decode(get_the_title($pid)),'sku'=>get_post_meta($pid,'_sku',true),
        'dvigubai'=>$q,'stock'=>$stock,'partijos'=>$liko,'skirtumas'=>$skirt,
        'sutampa'=>($skirt!==null && $skirt===-$q)?'TAIP':'NE');
    }
    usort($ats,function($a,$b){return $b['dvigubai']<=>$a['dvigubai'];});
    foreach($ats as $x){ if($x['sutampa']==='TAIP') $paaisk++; else $nepaaisk++; }
    $o['prekiu_paliesta']=count($ats);
    $o['viso_dvigubai_vnt']=array_sum($dvig);
    $o['paaiskina_visiskai']=$paaisk; $o['nepaaiskina']=$nepaaisk;
    $o['eilutes']=$ats;
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
