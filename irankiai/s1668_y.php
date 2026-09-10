<?php
/** TEMP PS S1668 y — Quattro: AV likutis → Quattro sandėlis (Raimio sprendimas). DRY / A / V.
 *  A: _stock = buvęs _own_stock_qty; _own_stock_qty=0; ps_sources quattro stock_qty=qty, cost_net=_cost_price; av eilutė stock 0 + is_active 0;
 *     T-0 AV partijos (eShoprent „Pradinis likutis T-0") atsaukta=1. Backup → ps_s1668_quattro_sand_bak. */
add_action('init', function(){
  if (!isset($_GET['ps_s1668y'])) return;
  $f=$_GET['ps_s1668y']; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1668 y','faze'=>$f); $S=$p.'ps_sources'; $P=$p.'ps_partijos';
  try{
  $ids=array_map('intval',$wpdb->get_col("SELECT pm.post_id FROM {$p}postmeta pm JOIN {$p}posts x ON x.ID=pm.post_id WHERE pm.meta_key='_ps_sandelis' AND pm.meta_value='quattro' AND x.post_status='publish' AND x.post_type='product'"));
  $bak=get_option('ps_s1668_quattro_sand_bak',array()); $viso=0; $n=0; $skip=array(); $prt=0;
  foreach($ids as $pid){ $pr=wc_get_product($pid); if(!$pr||$pr->get_type()!=='simple'){ $skip[]=array($pid,'tipas'); continue; }
    $own=(int)get_post_meta($pid,'_own_stock_qty',true); $stk=(int)get_post_meta($pid,'_stock',true); $wcq=$pr->get_stock_quantity(); $cost=(string)get_post_meta($pid,'_cost_price',true);
    $qrow=$wpdb->get_row($wpdb->prepare("SELECT * FROM $S WHERE product_id=%d AND source='quattro'",$pid),ARRAY_A);
    $arow=$wpdb->get_row($wpdb->prepare("SELECT * FROM $S WHERE product_id=%d AND source='av'",$pid),ARRAY_A);
    $part=$wpdb->get_results($wpdb->prepare("SELECT id,kiekis_liko FROM $P WHERE product_id=%d AND atsaukta=0",$pid),ARRAY_A);
    $pliko=array_sum(array_column($part,'kiekis_liko'));
    if($own===0 && !$arow && !$part){ continue; }
    if($stk!==0 && $f!=='V'){ $skip[]=array($pid,'_stock jau '.$stk); continue; }
    if($part && $pliko!==$own && $f!=='V'){ $skip[]=array($pid,"partijos $pliko != own $own"); continue; }
    if(!$qrow && $f!=='V'){ $skip[]=array($pid,'nera quattro registro eilutes'); continue; }
    $n++; $viso+=$own; $prt+=count($part);
    if($f==='A'){
      if(!isset($bak[$pid])) $bak[$pid]=array('own'=>$own,'stock'=>$stk,'qrow'=>$qrow,'arow'=>$arow,'partijos'=>array_column($part,'id'));
      // tiesiogiai meta (be WC save — kad stock kabliai nedalintų kiekio tarp AV/tiekėjo)
      update_post_meta($pid,'_stock',wc_stock_amount($own)); update_post_meta($pid,'_own_stock_qty',0);
      $wpdb->update($p.'wc_product_meta_lookup',array('stock_quantity'=>$own),array('product_id'=>$pid));
      if(function_exists('wp_cache_delete')){ wp_cache_delete($pid,'post_meta'); }
      $wpdb->update($S,array('stock_qty'=>$own,'cost_net'=>$cost!==''?$cost:$qrow['cost_net'],'updated_at'=>current_time('mysql')),array('id'=>$qrow['id']));
      if($arow) $wpdb->update($S,array('stock_qty'=>0,'is_active'=>0,'updated_at'=>current_time('mysql')),array('id'=>$arow['id']));
      if($part) $wpdb->query($wpdb->prepare("UPDATE $P SET atsaukta=1, pastaba=CONCAT(IFNULL(pastaba,''),' | S1668: atšaukta — prekė perkelta į Quattro sandėlį (Raimio sprendimas)') WHERE product_id=%d AND atsaukta=0",$pid));
      wc_delete_product_transients($pid);
    }
  }
  if($f==='A') update_option('ps_s1668_quattro_sand_bak',$bak,false);
  $o['prekiu']=$n; $o['vnt']=$viso; $o['partiju']=$prt; $o['skip']=$skip;
  if($f==='V'){ $in=implode(',',$ids);
    $o['po']=array(
      'own_likutis'=>(int)$wpdb->get_var("SELECT SUM(meta_value) FROM {$p}postmeta WHERE meta_key='_own_stock_qty' AND post_id IN ($in)"),
      'stock_suma'=>(int)$wpdb->get_var("SELECT SUM(meta_value) FROM {$p}postmeta WHERE meta_key='_stock' AND post_id IN ($in)"),
      'src_quattro'=>$wpdb->get_row("SELECT COUNT(*) n,SUM(stock_qty) q FROM $S WHERE source='quattro' AND product_id IN ($in)",ARRAY_A),
      'src_av_aktyvios'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM $S WHERE source='av' AND is_active=1 AND product_id IN ($in)"),
      'partijos_aktyvios'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM $P WHERE atsaukta=0 AND product_id IN ($in)"),
      'bak_n'=>count((array)get_option('ps_s1668_quattro_sand_bak',array())));
    foreach(array(16540,16594) as $pid){ $pr=wc_get_product($pid);
      $o['pvz'][$pid]=array('wc_stock'=>$pr->get_stock_quantity(),'_stock'=>get_post_meta($pid,'_stock',true),'status'=>$pr->get_stock_status(),'own'=>get_post_meta($pid,'_own_stock_qty',true),
        'kat_tiekejas'=>class_exists('Petshop_Katalogas')&&method_exists('Petshop_Katalogas','tiekejo_sandelis')?Petshop_Katalogas::tiekejo_sandelis($pid):'?',
        'src'=>$wpdb->get_results($wpdb->prepare("SELECT source,stock_qty,cost_net,is_active FROM $S WHERE product_id=%d",$pid),ARRAY_A)); }
    $r=wp_remote_get(get_permalink(16594),array('timeout'=>20)); $h=is_wp_error($r)?'':wp_remote_retrieve_body($r);
    $o['front']=array('kodas'=>is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r),'in_stock'=>preg_match('/class="stock in-stock"/',$h),'out'=>preg_match('/out-of-stock/',$h));
  }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($o);
});
