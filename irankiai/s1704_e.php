<?php
/** Plugin Name: TEMP PS S1704e invarianto skenas */
add_action('init', function(){
  $f=(isset($_GET['ps_s1704e'])?$_GET['ps_s1704e']:''); if($f!=='1') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1704e');
  try{
    global $wpdb; $p=$wpdb->prefix;
    // partiju likuciai
    $part=$wpdb->get_results("SELECT product_id, SUM(kiekis_liko) liko FROM {$p}ps_partijos WHERE atsaukta=0 GROUP BY product_id",ARRAY_A);
    $o['prekiu_su_partijomis']=count($part);
    $blog=array(); $sut=0;
    foreach($part as $r){
      $pid=(int)$r['product_id']; $liko=(int)$r['liko'];
      $own=get_post_meta($pid,'_own_stock_qty',true);
      $stock=get_post_meta($pid,'_stock',true);
      $av=($own===''||$own===null)?(int)$stock:(int)$own;
      $laukas=($own===''||$own===null)?'_stock':'_own_stock_qty';
      if($av===$liko){ $sut++; continue; }
      $blog[]=array('pid'=>$pid,'pav'=>get_the_title($pid),'sku'=>get_post_meta($pid,'_sku',true),
        'partijos'=>$liko,'av'=>$av,'laukas'=>$laukas,'skirtumas'=>$av-$liko,
        'sandelis'=>get_post_meta($pid,'_ps_sandelis',true),'manage'=>get_post_meta($pid,'_manage_stock',true),
        'status'=>get_post_status($pid));
    }
    usort($blog,function($a,$b){return $a['skirtumas']<=>$b['skirtumas'];});
    $o['sutampa']=$sut; $o['nesutampa']=count($blog);
    $o['viso_trukumas']=array_sum(array_map(function($x){return $x['skirtumas']<0?$x['skirtumas']:0;},$blog));
    $o['viso_perteklius']=array_sum(array_map(function($x){return $x['skirtumas']>0?$x['skirtumas']:0;},$blog));
    $o['eilutes']=$blog;
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
