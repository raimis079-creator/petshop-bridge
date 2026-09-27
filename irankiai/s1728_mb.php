<?php
/** Plugin Name: TEMP PS S1728mb read-only: užsakymo kelio taisyklė (AV pirma ar tiekėjas pirma?) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1728mb'])) return; $r=['v'=>'S1728mb']; global $wpdb; $P=$wpdb->prefix; @set_time_limit(150);
  try{
    $f=WPMU_PLUGIN_DIR.'/petshop-av-order.php'; $t=file($f); $r['av_order']=['md5'=>md5_file($f),'eil'=>count($t)];
    // eilutės su sprendimu apie kelią
    $o=[]; foreach($t as $i=>$l){ if(preg_match('/resolve|dropship|tiekej|pirma|_ps_source|av_uztenka|Petshop_AV_Stock/iu',$l)) $o[]=($i+1).': '.rtrim($l); } $r['av_order']['eilutes']=array_slice($o,0,80);
    // Kas dar kviečia keliui: ieškom mu-plugins, kur rašoma _ps_source
    $kas=[]; foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $mf){ $c=file_get_contents($mf); if(preg_match_all("/(update_meta_data|add_meta_data|wc_update_order_item_meta)\\(\\s*[^,]*,?\\s*'_ps_source'/",$c,$m)) $kas[basename($mf)]=count($m[0]); } $r['rasytojai_ps_source']=$kas;
    // Realūs užsakymai po T-0: eilutės, kurių prekė turi ir AV, ir tiekėjo šaltinį
    $rows=$wpdb->get_results("SELECT oi.order_id, oi.order_item_id, om.meta_value pid, oim.meta_value src, o.date_created_gmt d
      FROM {$P}woocommerce_order_items oi
      JOIN {$P}woocommerce_order_itemmeta om ON om.order_item_id=oi.order_item_id AND om.meta_key='_product_id'
      LEFT JOIN {$P}woocommerce_order_itemmeta oim ON oim.order_item_id=oi.order_item_id AND oim.meta_key='_ps_source'
      JOIN {$P}wc_orders o ON o.id=oi.order_id
      WHERE oi.order_item_type='line_item' AND o.date_created_gmt>='2026-09-08' AND o.status IN ('wc-processing','wc-completed')
        AND om.meta_value IN (SELECT product_id FROM {$P}ps_sources WHERE source='av' AND is_active=1) AND om.meta_value IN (SELECT product_id FROM {$P}ps_sources WHERE source<>'av' AND is_active=1)
      ORDER BY o.id DESC LIMIT 40",ARRAY_A);
    foreach($rows as &$x){ $x['pav']=mb_substr(html_entity_decode(get_the_title($x['pid'])),0,45); $x['im']=[]; foreach($wpdb->get_results($wpdb->prepare("SELECT meta_key,meta_value FROM {$P}woocommerce_order_itemmeta WHERE order_item_id=%d AND meta_key LIKE '\\_ps%%'",$x['order_item_id']),ARRAY_A) as $m) $x['im'][$m['meta_key']]=mb_substr($m['meta_value'],0,40); }
    $r['mix_eilutes']=$rows;
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE); exit;
}, 1);
