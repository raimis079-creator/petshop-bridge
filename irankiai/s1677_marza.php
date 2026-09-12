<?php
/** TEMP PS S1677 marža — read-only: prekių marža iš savikainos + 30 d. užsakymų ekonomika (viso ir iš Ads). */
add_action('init', function(){
  if (!isset($_GET['ps_s1677m'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1677 marža');
  $sav=function($pid){ if(class_exists('Petshop_Pardavimai')&&method_exists('Petshop_Pardavimai','savikaina')){ $s=Petshop_Pardavimai::savikaina($pid); if($s!==null&&$s!==''&&(float)$s>0) return (float)$s; }
    foreach(array('_ps_savikaina','_wc_cog_cost','_alg_wc_cog_cost') as $k){ $s=get_post_meta($pid,$k,true); if($s!==''&&(float)$s>0) return (float)$s; } return null; };
  // 1. katalogas
  $ids=$wpdb->get_col("SELECT ID FROM {$p}posts WHERE post_type IN('product','product_variation') AND post_status='publish'");
  $b=array('be_sav'=>0,'sav_gt_kaina'=>0,'<0'=>0,'0-10'=>0,'10-20'=>0,'20-30'=>0,'30-40'=>0,'40+'=>0); $n=0; $sumM=0; $pig=0;
  foreach($ids as $pid){ $pr=(float)get_post_meta($pid,'_price',true); if($pr<=0) continue; $n++; $c=$sav($pid);
    if($c===null){ $b['be_sav']++; continue; } if($c>$pr) $b['sav_gt_kaina']++; if($pr<10) $pig++;
    $net=$pr/1.21; $m=($net-$c)/$net*100; $sumM+=$m;
    $b[$m<0?'<0':($m<10?'0-10':($m<20?'10-20':($m<30?'20-30':($m<40?'30-40':'40+'))))]++; }
  $o['katalogas']=array('su_kaina'=>$n,'kaina_lt10'=>$pig,'marza_prielaida'=>'savikaina be PVM, kaina su PVM 21%','juostos'=>$b,'vid_marza_paprasta'=>round($sumM/max(1,$n-$b['be_sav']),1));
  // 2. 30 d. užsakymai
  $ords=wc_get_orders(array('limit'=>-1,'status'=>array('processing','completed'),'date_created'=>'>'.(time()-30*86400),'return'=>'objects'));
  $agg=function(){ return array('uzs'=>0,'pajamos_su_pvm'=>0,'prekes_net'=>0,'savikaina'=>0,'siunt_surinkta'=>0,'be_sav_eil'=>0,'nemok_siuntimas'=>0); };
  $t=array('viso'=>$agg(),'ads'=>$agg()); $kat=array();
  foreach($ords as $od){ $ads=($od->get_meta('_wc_order_attribution_utm_source')==='google'&&stripos((string)$od->get_meta('_wc_order_attribution_utm_medium'),'cpc')!==false)||$od->get_meta('_wc_order_attribution_source_type')==='utm'&&$od->get_meta('_wc_order_attribution_utm_source')==='google';
    $keys=$ads?array('viso','ads'):array('viso');
    foreach($keys as $k){ $t[$k]['uzs']++; $t[$k]['pajamos_su_pvm']+=(float)$od->get_total(); $sh=(float)$od->get_shipping_total(); $t[$k]['siunt_surinkta']+=$sh; if($sh<=0) $t[$k]['nemok_siuntimas']++; }
    foreach($od->get_items() as $it){ $pid=$it->get_variation_id()?:$it->get_product_id(); $q=$it->get_quantity(); $net=(float)$it->get_total(); $c=$sav($pid);
      $cats=wp_get_post_terms($it->get_product_id(),'product_cat',array('fields'=>'names')); $cn=$cats&&!is_wp_error($cats)?$cats[0]:'?';
      if(!isset($kat[$cn])) $kat[$cn]=array('net'=>0,'sav'=>0,'vnt'=>0); $kat[$cn]['net']+=$net; $kat[$cn]['vnt']+=$q;
      foreach($keys as $k){ $t[$k]['prekes_net']+=$net; if($c===null){ $t[$k]['be_sav_eil']++; } else { $t[$k]['savikaina']+=$c*$q; } }
      if($c!==null) $kat[$cn]['sav']+=$c*$q; } }
  foreach($t as $k=>&$v){ $v['marza_pct']=$v['prekes_net']>0?round(($v['prekes_net']-$v['savikaina'])/$v['prekes_net']*100,1):null; $v['aov_su_pvm']=$v['uzs']?round($v['pajamos_su_pvm']/$v['uzs'],2):null; $v['bruto_marza_uzs']=$v['uzs']?round(($v['prekes_net']-$v['savikaina'])/$v['uzs'],2):null; foreach($v as $kk=>$vv) if(is_float($vv)) $v[$kk]=round($vv,2); } unset($v);
  uasort($kat,function($a,$b){return $b['net']<=>$a['net'];}); $kt=array(); foreach(array_slice($kat,0,12,true) as $cn=>$v){ $kt[$cn]=array('net'=>round($v['net']),'marza_pct'=>$v['net']>0?round(($v['net']-$v['sav'])/$v['net']*100,1):null,'vnt'=>$v['vnt']); }
  $o['uzsakymai_30d']=$t; $o['top_kategorijos']=$kt;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
});
