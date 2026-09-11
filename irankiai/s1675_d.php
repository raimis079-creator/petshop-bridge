<?php
/** TEMP PS S1675 run d — 1 pataisa: publish prekės su _stock_status=instock, bet likutis (_stock+_own) ≤0, be backorders, be kito aktyvaus šaltinio su likučiu → outofstock per WC API. DRY/APPLY. Backup option ps_s1675_stock_bak. */
add_action('init', function(){
  if (!isset($_GET['ps_d5'])) return; $f=$_GET['ps_d5'];
  global $wpdb; $p=$wpdb->prefix; $wpdb->suppress_errors(true); $o=array('v'=>'S1675 d','faze'=>$f);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $rows=$wpdb->get_results("SELECT s.post_id id,s.meta_value st,IFNULL(ow.meta_value,0) own,IFNULL(sd.meta_value,'') sand FROM {$p}postmeta s JOIN {$p}postmeta st ON st.post_id=s.post_id AND st.meta_key='_stock_status' AND st.meta_value='instock' JOIN {$p}posts po ON po.ID=s.post_id AND po.post_status='publish' AND po.post_type='product' JOIN {$p}postmeta ms ON ms.post_id=s.post_id AND ms.meta_key='_manage_stock' AND ms.meta_value='yes' LEFT JOIN {$p}postmeta ow ON ow.post_id=s.post_id AND ow.meta_key='_own_stock_qty' LEFT JOIN {$p}postmeta sd ON sd.post_id=s.post_id AND sd.meta_key='_ps_sandelis' LEFT JOIN {$p}postmeta bo ON bo.post_id=s.post_id AND bo.meta_key='_backorders' WHERE s.meta_key='_stock' AND (s.meta_value+0+IFNULL(ow.meta_value,0))<=0 AND IFNULL(bo.meta_value,'no')='no'",ARRAY_A);
  $kand=array(); $pral=array();
  foreach($rows as $r){ $id=(int)$r['id'];
    $kitas=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_sources WHERE product_id=$id AND is_active=1 AND stock_qty>0");
    $pr=wc_get_product($id); if(!$pr){ $pral[$id]='wc null'; continue; }
    if($pr->get_type()!=='simple'){ $pral[$id]='tipas '.$pr->get_type(); continue; }
    if($kitas>0){ $pral[$id]='kitas šaltinis su likučiu'; continue; }
    if($pr->get_stock_quantity()>0){ $pral[$id]='WC qty '.$pr->get_stock_quantity(); continue; }
    $kand[$id]=array('sand'=>$r['sand'],'st'=>$r['st'],'own'=>$r['own'],'t'=>mb_substr($pr->get_name(),0,50));
  }
  $o['kandidatai']=count($kand); $o['praleista']=$pral; $o['pagal_sandeli']=array_count_values(array_column($kand,'sand')); $o['pvz']=array_slice($kand,0,5,true);
  if($f==='APPLY' && $kand){
    $bak=get_option('ps_s1675_stock_bak',array()); $ok=0; $kl=array();
    foreach($kand as $id=>$k){ $pr=wc_get_product($id); $bak[$id]=array('status'=>'instock','laikas'=>current_time('mysql')); $pr->set_stock_status('outofstock'); $pr->save(); $pr2=wc_get_product($id); if($pr2->get_stock_status()==='outofstock') $ok++; else $kl[]=$id; }
    update_option('ps_s1675_stock_bak',$bak,false); $o['apply']=array('ok'=>$ok,'klaidos'=>$kl);
    if(function_exists('wc_delete_product_transients')) foreach(array_keys($kand) as $id) wc_delete_product_transients($id);
    $o['po']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}postmeta s JOIN {$p}postmeta st ON st.post_id=s.post_id AND st.meta_key='_stock_status' AND st.meta_value='instock' JOIN {$p}posts po ON po.ID=s.post_id AND po.post_status='publish' AND po.post_type='product' JOIN {$p}postmeta ms ON ms.post_id=s.post_id AND ms.meta_key='_manage_stock' AND ms.meta_value='yes' LEFT JOIN {$p}postmeta ow ON ow.post_id=s.post_id AND ow.meta_key='_own_stock_qty' WHERE s.meta_key='_stock' AND (s.meta_value+0+IFNULL(ow.meta_value,0))<=0");
    $ids=array_slice(array_keys($kand),0,2); foreach($ids as $id){ $r=wp_remote_get(get_permalink($id),array('timeout'=>30,'sslverify'=>false)); $b=(string)wp_remote_retrieve_body($r); $o['front'][$id]=array('code'=>wp_remote_retrieve_response_code($r),'out_of_stock_html'=>(int)(strpos($b,'out-of-stock')!==false||strpos($b,'outofstock')!==false),'add_to_cart_btn'=>(int)(strpos($b,'single_add_to_cart_button')!==false)); }
  }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
