<?php
/** Plugin Name: TEMP PS S1731a stirnos ausis — pardavimas su likučiu 0 (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1731a'])) return;
  $f=$_GET['ps_s1731a']; @set_time_limit(200); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1731a','faze'=>$f];
  try{
  $mk=['_manage_stock','_stock','_stock_status','_backorders','_own_stock_qty','_ps_sandelis','_dp_base_product_id','_dp_pack_qty','_dp_nuolaida_proc','_ps_ranka_isimta','_sku','_ps_s1725_gen','_mnm_config','_price','_ps_dydzio_seima'];
  $meta=function($id) use($mk){ $o=[]; foreach($mk as $k){ $v=get_post_meta($id,$k,true); if($v!==''&&$v!==null) $o[$k]=is_string($v)?mb_substr($v,0,200):$v; } return $o; };
  if($f==='1'){
    $ids=$wpdb->get_col("SELECT ID FROM {$P}posts WHERE post_type IN('product','product_variation') AND (post_title LIKE '%stirn%aus%' OR post_title LIKE '%aus%stirn%') ORDER BY ID");
    $pk=$wpdb->get_col("SELECT post_id FROM {$P}postmeta WHERE meta_key='_dp_base_product_id' AND meta_value IN(".($ids?implode(',',array_map('intval',$ids)):'0').")");
    $ids=array_values(array_unique(array_merge($ids,$pk)));
    foreach($ids as $id){ $p=get_post($id); $pr=wc_get_product($id);
      $x=['t'=>$p->post_title,'st'=>$p->post_status,'type'=>$pr?$pr->get_type():null,'mod'=>$p->post_modified,'meta'=>$meta($id)];
      if($pr){ $x['wc_stock_qty']=$pr->get_stock_quantity(); $x['wc_status']=$pr->get_stock_status(); $x['is_in_stock']=$pr->is_in_stock(); $x['managing']=$pr->managing_stock(); $x['enough1']=$pr->has_enough_stock(1); }
      $x['log']=get_post_meta($id,'_own_stock_log',true); if(is_array($x['log'])) $x['log']=array_slice($x['log'],-12);
      $x['sources']=$wpdb->get_results($wpdb->prepare("SELECT * FROM {$P}ps_sources WHERE product_id=%d",$id),ARRAY_A);
      $x['partijos']=$wpdb->get_results($wpdb->prepare("SELECT * FROM {$P}ps_partijos WHERE product_id=%d ORDER BY id DESC LIMIT 12",$id),ARRAY_A);
      $x['uzs']=$wpdb->get_results($wpdb->prepare("SELECT l.order_id,l.product_qty,l.date_created,o.status,o.payment_method FROM {$P}wc_order_product_lookup l JOIN {$P}wc_orders o ON o.id=l.order_id WHERE l.product_id=%d AND l.date_created>'2026-09-01' ORDER BY l.order_id DESC LIMIT 20",$id),ARRAY_A);
      $r['prekes'][$id]=$x; }
  }
  if($f==='2'){
    $oids=array_map('intval',explode(',',$_GET['o']??''));
    foreach($oids as $oid){ $o=wc_get_order($oid); if(!$o) continue; $x=['nr'=>$o->get_order_number(),'st'=>$o->get_status(),'pm'=>$o->get_payment_method(),'sukurta'=>$o->get_date_created()?$o->get_date_created()->date('Y-m-d H:i:s'):null,'apmoketa'=>$o->get_date_paid()?$o->get_date_paid()->date('Y-m-d H:i:s'):null,'created_via'=>$o->get_created_via()];
      foreach(['_ps_telefonu','_ps_av_reduced','_order_stock_reduced','_ps_kelias','_ps_misrus'] as $k){ $v=$o->get_meta($k); if($v!=='') $x['m'][$k]=$v; }
      foreach($o->get_items() as $iid=>$it){ $im=[]; foreach($it->get_meta_data() as $md){ $im[$md->key]=is_scalar($md->value)?$md->value:json_encode($md->value); } $x['eil'][$iid]=['pid'=>$it->get_product_id(),'vid'=>$it->get_variation_id(),'n'=>$it->get_name(),'q'=>$it->get_quantity(),'meta'=>$im]; }
      $x['pastabos']=array_map(function($n){ return [$n->date_created->date('m-d H:i:s'),$n->added_by,mb_substr(wp_strip_all_tags($n->content),0,300)]; }, wc_get_order_notes(['order_id'=>$oid,'order'=>'ASC']));
      $r['uzs'][$oid]=$x; }
  }
  if($f==='3'){
    foreach(['Petshop_AV_Limit','Petshop_AV_Stock','Petshop_AV_Source'] as $c){ if(!class_exists($c)){ $r['kl'][$c]='nera'; continue; } $rc=new ReflectionClass($c); $fn=$rc->getFileName(); $r['kl'][$c]=['f'=>str_replace(WP_CONTENT_DIR,'',$fn),'md5'=>substr(md5_file($fn),0,8),'eil'=>count(file($fn))]; }
    $rc=new ReflectionClass('Petshop_AV_Limit'); $src=file($rc->getFileName()); $r['av_limit_src']=implode('',$src);
    global $wp_filter; foreach(['woocommerce_product_get_stock_quantity','woocommerce_product_get_stock_status','woocommerce_product_is_in_stock','woocommerce_product_backorders_allowed','woocommerce_product_get_manage_stock'] as $h){ $o=[]; if(isset($wp_filter[$h])) foreach($wp_filter[$h]->callbacks as $pr=>$cbs) foreach($cbs as $cb){ $fx=$cb['function']; if(is_array($fx)) $o[]=$pr.':'.(is_object($fx[0])?get_class($fx[0]):$fx[0]).'::'.$fx[1]; elseif($fx instanceof Closure){ $rf=new ReflectionFunction($fx); $o[]=$pr.':closure '.str_replace(WP_CONTENT_DIR,'',$rf->getFileName()).':'.$rf->getStartLine(); } else $o[]=$pr.':'.$fx; } $r['hooks'][$h]=$o; }
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
