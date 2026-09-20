<?php
/** Plugin Name: TEMP PS S1697 feed recon 2 (read-only) */
add_action('wp_loaded', function(){
  $f=(isset($_GET['ps_s1697'])?$_GET['ps_s1697']:''); if($f!=='1'&&$f!=='2') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1697 mb','faze'=>$f);
  global $wpdb; $p=$wpdb->prefix;
  try{
    if($f==='1'){
      $o['src_b64']=base64_encode(file_get_contents(WP_CONTENT_DIR.'/plugins/petshop-feeds/petshop-feeds.php'));
      $up=wp_upload_dir(); $o['kaina24_galva']=substr(file_get_contents($up['basedir'].'/petshop-feeds/kaina24.xml'),0,2500);
      $o['kainos_galva']=substr(file_get_contents($up['basedir'].'/petshop-feeds/kainos.xml'),0,1800);
      $o['paskutinis']=get_option('ps_feeds_paskutinis');
    } else {
      // brendai feed kandidatuose (publish + instock + ne rinkinys)
      $o['brendai']=$wpdb->get_results("SELECT t.name b, COUNT(*) n FROM {$p}posts po JOIN {$p}postmeta s ON s.post_id=po.ID AND s.meta_key='_stock_status' AND s.meta_value='instock'
        JOIN {$p}term_relationships tr ON tr.object_id=po.ID JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='product_brand' JOIN {$p}terms t ON t.term_id=tt.term_id
        WHERE po.post_type='product' AND po.post_status='publish' GROUP BY t.name ORDER BY n DESC",ARRAY_A);
      // kainų palyginimo peržiūros per 30 d. pagal brendą (landing slug → prekė → brendas)
      $cols=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_web_ivykiai");
      $rc=null; foreach($cols as $c) if(preg_match('/ref/i',$c)){$rc=$c;break;}
      $tc=null; foreach($cols as $c) if(preg_match('/laik|time|data|created/i',$c)){$tc=$c;break;}
      $uc=null; foreach($cols as $c) if(preg_match('/url|kelias|path|puslap/i',$c)){$uc=$c;break;}
      $sc=null; foreach($cols as $c) if(preg_match('/ses|sid|vizit/i',$c)){$sc=$c;break;}
      $o['cols']=array($rc,$tc,$uc,$sc);
      $rows=$wpdb->get_results("SELECT `$uc` u, `$rc` r, COUNT(*) n".($sc?", COUNT(DISTINCT `$sc`) s":"")." FROM {$p}ps_web_ivykiai WHERE (`$rc` LIKE '%kaina24%' OR `$rc` LIKE '%kainos.lt%' OR `$rc` LIKE '%kainoteka%') AND `$tc`>=DATE_SUB(NOW(),INTERVAL 30 DAY) AND `$uc` LIKE '/product/%' GROUP BY u,r",ARRAY_A);
      $br=array(); $sku=array();
      foreach($rows as $r){ $slug=explode('?',trim(substr($r['u'],9),'/'))[0]; $host=preg_replace('/^www\./','',parse_url($r['r'],PHP_URL_HOST)?:'?');
        $pid=$wpdb->get_var($wpdb->prepare("SELECT ID FROM {$p}posts WHERE post_name=%s AND post_type='product' LIMIT 1",$slug)); if(!$pid) continue;
        $b=$wpdb->get_var("SELECT t.name FROM {$p}term_relationships tr JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='product_brand' JOIN {$p}terms t ON t.term_id=tt.term_id WHERE tr.object_id=$pid LIMIT 1")?:'?';
        $br[$b][$host]=($br[$b][$host]??0)+(int)($r['s']??$r['n']);
        $k=$pid; if(!isset($sku[$k])) $sku[$k]=array('pid'=>$pid,'b'=>$b,'n'=>0,'slug'=>$slug); $sku[$k]['n']+=(int)($r['s']??$r['n']); }
      uasort($sku,function($a,$b){return $b['n']-$a['n'];});
      $o['perziuros_brendai']=$br; $o['perziuros_sku_top']=array_slice(array_values($sku),0,60);
      // kainų palyginimo užsakymų prekės → brendai (nuo T-0)
      $o['uzs_brendai']=$wpdb->get_results("SELECT t.name b, COUNT(DISTINCT o.id) uzs, SUM(qm.meta_value) vnt FROM {$p}wc_orders o JOIN {$p}wc_orders_meta m ON m.order_id=o.id AND m.meta_key='_wc_order_attribution_referrer' AND (m.meta_value LIKE '%kaina24%' OR m.meta_value LIKE '%kainos.lt%' OR m.meta_value LIKE '%kainoteka%')
        JOIN {$p}woocommerce_order_items oi ON oi.order_id=o.id AND oi.order_item_type='line_item' JOIN {$p}woocommerce_order_itemmeta pm ON pm.order_item_id=oi.order_item_id AND pm.meta_key='_product_id' JOIN {$p}woocommerce_order_itemmeta qm ON qm.order_item_id=oi.order_item_id AND qm.meta_key='_qty'
        LEFT JOIN {$p}term_relationships tr ON tr.object_id=pm.meta_value LEFT JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='product_brand' LEFT JOIN {$p}terms t ON t.term_id=tt.term_id
        WHERE o.type='shop_order' AND o.status IN ('wc-processing','wc-completed','wc-on-hold') AND o.date_created_gmt>='2026-09-08' GROUP BY t.name ORDER BY uzs DESC",ARRAY_A);
    }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
