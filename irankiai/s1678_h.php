<?php
/** TEMP PS S1678 h — READ-ONLY: Hikari/tvenkinių žuvų maisto kainos, savikainos, maržos, likučiai, pardavimai (istorija + WC). */
add_action('init', function(){
  if (!isset($_GET['ps_sec8h'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1678 h'); $wpdb->suppress_errors(true);
  $o['ist_lenteles']=$wpdb->get_col("SHOW TABLES LIKE '{$p}ps_ist%'"); $o['fakt_lenteles']=$wpdb->get_col("SHOW TABLES LIKE '{$p}ps_fakt%'");
  $ids=$wpdb->get_col("SELECT DISTINCT p.ID FROM {$p}posts p LEFT JOIN {$p}term_relationships tr ON tr.object_id=p.ID LEFT JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id LEFT JOIN {$p}terms t ON t.term_id=tt.term_id WHERE p.post_type='product' AND p.post_status IN('publish','draft') AND (p.post_title LIKE '%Hikari%' OR p.post_title LIKE '%Katrinex%' OR p.post_title LIKE '%koi%' OR t.slug LIKE '%tvenkin%' OR (tt.taxonomy='pa_gamintojas' AND t.name LIKE '%Hikari%')) ORDER BY p.ID");
  $o['n']=count($ids); $o['prekes']=array();
  // istorija: rasti lentelę su sku
  $ist=null; foreach($o['ist_lenteles'] as $t){ $c=$wpdb->get_col("SHOW COLUMNS FROM $t"); if(in_array('sku',$c)||in_array('product_id',$c)) { $ist=$t; $o['ist_cols_'.$t]=$c; } }
  foreach($ids as $id){ $m=function($k) use($wpdb,$p,$id){ return $wpdb->get_var($wpdb->prepare("SELECT meta_value FROM {$p}postmeta WHERE post_id=%d AND meta_key=%s",$id,$k)); };
    $pr=(float)$m('_price'); $rp=(float)$m('_regular_price'); $cost=(float)($m('_cost_price')?:($m('_vf_cost')?:$m('_zb_cost'))); $net=$pr/1.21; $mz=$net>0&&$cost>0?round(($net-$cost)/$net*100):null;
    $sku=$m('_sku'); $st=$m('_stock'); $own=$m('_own_stock_qty'); $san=$m('_ps_sandelis'); $stat=get_post_status($id);
    $s90=$wpdb->get_var($wpdb->prepare("SELECT SUM(l.product_qty) FROM {$p}wc_order_product_lookup l JOIN {$p}wc_orders w ON w.id=l.order_id WHERE l.product_id=%d AND w.status IN('wc-processing','wc-completed') AND w.date_created_gmt>'2026-09-09'",$id));
    $s12=null; if($ist && $sku){ $s12=$wpdb->get_var($wpdb->prepare("SELECT SUM(kiekis) FROM $ist WHERE sku=%s",$sku)); }
    $o['prekes'][]=array('id'=>$id,'p'=>mb_substr(get_the_title($id),0,50),'sku'=>$sku,'kaina'=>$pr,'reg'=>$rp,'sav'=>$cost,'marza'=>$mz,'san'=>$san,'stock'=>$st,'own'=>$own,'st'=>$stat,'poT0'=>$s90,'ist'=>$s12);
  }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
