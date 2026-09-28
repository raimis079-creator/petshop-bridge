<?php
/** Plugin Name: TEMP PS S1731b be likučio valdymo — užsakymai ir mastas (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1731b'])) return;
  $f=$_GET['ps_s1731b']; @set_time_limit(200); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1731b','faze'=>$f];
  try{
  if($f==='1'){ // šiandienos užsakymas su stirnos ausimi
    $rows=$wpdb->get_results("SELECT i.order_id,i.order_item_id,i.order_item_name,o.status,o.date_created_gmt,o.payment_method FROM {$P}woocommerce_order_items i JOIN {$P}wc_orders o ON o.id=i.order_id WHERE i.order_item_type='line_item' AND i.order_item_name LIKE '%tirn%aus%' ORDER BY i.order_id DESC LIMIT 15",ARRAY_A);
    $r['eil']=$rows;
    foreach(array_slice($rows,0,4) as $row){ $oid=(int)$row['order_id']; $o=wc_get_order($oid); if(!$o) continue;
      $x=['nr'=>$o->get_order_number(),'st'=>$o->get_status(),'via'=>$o->get_created_via(),'sukurta'=>$o->get_date_created()?$o->get_date_created()->date('Y-m-d H:i'):null,'apm'=>$o->get_date_paid()?$o->get_date_paid()->date('Y-m-d H:i'):null];
      foreach($o->get_items() as $iid=>$it){ $im=[]; foreach($it->get_meta_data() as $md){ $im[$md->key]=is_scalar($md->value)?$md->value:json_encode($md->value); } $x['eil'][$iid]=['pid'=>$it->get_product_id(),'n'=>$it->get_name(),'q'=>$it->get_quantity(),'meta'=>$im]; }
      $x['past']=array_map(function($n){ return [$n->date_created->date('m-d H:i'),$n->added_by,mb_substr(wp_strip_all_tags($n->content),0,250)]; }, wc_get_order_notes(['order_id'=>$oid,'order'=>'ASC']));
      $r['uzs'][$oid]=$x; }
  }
  if($f==='2'){ // mastas: publikuotos prekės be likučio valdymo
    $q="SELECT p.ID,p.post_type,p.post_parent,p.post_title,
      MAX(CASE WHEN m.meta_key='_stock_status' THEN m.meta_value END) ss,
      MAX(CASE WHEN m.meta_key='_ps_sandelis' THEN m.meta_value END) sand,
      MAX(CASE WHEN m.meta_key='_dp_base_product_id' THEN m.meta_value END) dp,
      MAX(CASE WHEN m.meta_key='_mnm_config' THEN 1 END) mnm,
      MAX(CASE WHEN m.meta_key='_own_stock_qty' THEN m.meta_value END) av,
      MAX(CASE WHEN m.meta_key='_vf_supplier_sku' THEN 1 END) vf,
      MAX(CASE WHEN m.meta_key='_zb_ean' THEN 1 END) zb
      FROM {$P}posts p JOIN {$P}postmeta mm ON mm.post_id=p.ID AND mm.meta_key='_manage_stock' AND mm.meta_value='no'
      LEFT JOIN {$P}postmeta m ON m.post_id=p.ID
      WHERE p.post_type IN('product','product_variation') AND p.post_status='publish'
      GROUP BY p.ID";
    $rows=$wpdb->get_results($q,ARRAY_A);
    $sum=[]; $list=[];
    foreach($rows as $x){
      if($x['post_type']==='product'){ $pr=wc_get_product($x['ID']); if($pr && $pr->is_type('variable')) { $sum['variable_tevai']=($sum['variable_tevai']??0)+1; continue; } if($pr && !$pr->is_type('simple') && !$pr->is_type('variation')){ $sum['tipas_'.$pr->get_type()]=($sum['tipas_'.$pr->get_type()]??0)+1; continue; } }
      if($x['dp']){ $sum['dp_pakai']=($sum['dp_pakai']??0)+1; continue; }
      if($x['mnm']){ $sum['mnm']=($sum['mnm']??0)+1; continue; }
      $src=$wpdb->get_col($wpdb->prepare("SELECT CONCAT(source,':',IFNULL(stock_qty,'null')) FROM {$P}ps_sources WHERE product_id=%d AND is_active=1",$x['ID']));
      $k=($x['sand']?:'-').'|'.($x['ss']?:'-');
      $sum['paprastos'][$k]=($sum['paprastos'][$k]??0)+1;
      $pard=(int)$wpdb->get_var($wpdb->prepare("SELECT COALESCE(SUM(product_qty),0) FROM {$P}wc_order_product_lookup WHERE (product_id=%d OR variation_id=%d) AND date_created>='2026-09-08'",$x['ID'],$x['ID']));
      $list[]=['id'=>(int)$x['ID'],'t'=>mb_substr($x['post_title'],0,55),'sand'=>$x['sand'],'ss'=>$x['ss'],'av'=>$x['av'],'src'=>implode(',',$src),'pard_nuo_T0'=>$pard];
    }
    usort($list,function($a,$b){return $b['pard_nuo_T0']<=>$a['pard_nuo_T0'];});
    $r['suvestine']=$sum; $r['viso_paprastu']=count($list); $r['su_pardavimais']=count(array_filter($list,function($x){return $x['pard_nuo_T0']>0;}));
    $bys=[]; foreach($list as $x){ foreach(explode(',',$x['src']?:'nera') as $s){ $s=explode(':',$s)[0]; $bys[$s]=($bys[$s]??0)+1; } } $r['pagal_saltini']=$bys;
    $r['sarasas']=array_slice($list,0,60);
  }
  if($f==='3'){ // snippet'as ant woocommerce_product_is_in_stock ir kas nustato manage_stock=no
    $sn=$wpdb->get_results("SELECT id,name,active,LEFT(code,60) c FROM {$P}snippets WHERE code LIKE '%woocommerce_product_is_in_stock%' OR code LIKE '%set_manage_stock%' OR code LIKE '%_manage_stock%'",ARRAY_A);
    $r['snippets']=$sn;
    $hits=[]; foreach(glob(WP_CONTENT_DIR.'/mu-plugins/*.php') as $fp){ $t=file_get_contents($fp); if(preg_match_all("#.{0,80}(set_manage_stock\s*\(\s*(false|0|'no')|'_manage_stock'\s*,\s*'no').{0,60}#",$t,$m)) $hits[basename($fp)]=array_slice($m[0],0,4); } $r['mu_manage_no']=$hits;
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
