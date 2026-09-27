<?php
/** Plugin Name: TEMP PS S1725g read-only: DP generatoriaus kandidatai 2–10 kg — pjūviai (sandėlis, gyvūnas, brendas, %, likutis, pardavimai), esamų pakų SEO */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1725g'])) return; $r=['v'=>'S1725g']; global $wpdb; $P=$wpdb->prefix; @set_time_limit(150);
  try{
    $ids=$wpdb->get_col("SELECT p.ID FROM {$P}posts p JOIN {$P}postmeta s ON s.post_id=p.ID AND s.meta_key='_ps_dydzio_seima' AND s.meta_value<>'' WHERE p.post_status='publish' AND p.post_type='product' AND p.post_title REGEXP '(^|[^0-9,.])([2-9]|10)([,.][0-9]+)? ?kg' AND NOT EXISTS (SELECT 1 FROM {$P}postmeta dp WHERE dp.post_id=p.ID AND dp.meta_key='_dp_base_product_id') AND NOT EXISTS (SELECT 1 FROM {$P}postmeta b2 WHERE b2.meta_key='_dp_base_product_id' AND b2.meta_value=p.ID)");
    $r['kandidatu']=count($ids);
    $pard=[]; foreach($wpdb->get_results("SELECT m.meta_value pid, SUM(q.meta_value) vnt FROM {$P}woocommerce_order_itemmeta m JOIN {$P}woocommerce_order_itemmeta q ON q.order_item_id=m.order_item_id AND q.meta_key='_qty' JOIN {$P}woocommerce_order_items i ON i.order_item_id=m.order_item_id JOIN {$P}wc_orders o ON o.id=i.order_id WHERE m.meta_key='_product_id' AND o.status IN ('wc-completed','wc-processing') GROUP BY m.meta_value",ARRAY_A) as $x) $pard[(int)$x['pid']]=(int)$x['vnt'];
    $cnt=['sandelis'=>[],'gyvunas'=>[],'grupe'=>[],'proc'=>[],'likutis'=>[],'pard_wc'=>[],'brendas'=>[],'kaina'=>[],'dydis_kg'=>[]]; $pvz=[];
    foreach($ids as $pid){ $p=wc_get_product($pid); if(!$p) continue;
      $sd=class_exists('Petshop_Rinkiniai')?Petshop_Rinkiniai::sandelis($pid):'?'; $cnt['sandelis'][$sd]=($cnt['sandelis'][$sd]??0)+1;
      $sl=implode(' ',wp_get_post_terms($pid,'product_cat',['fields'=>'slugs'])); $g=(strpos($sl,'kat')!==false&&strpos($sl,'sun')===false)?'katems':((strpos($sl,'sun')!==false&&strpos($sl,'kat')===false)?'sunims':'abu/?'); $cnt['gyvunas'][$g]=($cnt['gyvunas'][$g]??0)+1;
      $gr=class_exists('Petshop_DP_Kainos')?Petshop_DP_Kainos::grupe($pid):'?'; $cnt['grupe'][$gr?:'(nezinoma)']=($cnt['grupe'][$gr?:'(nezinoma)']??0)+1;
      $pr=class_exists('Petshop_DP_Kainos')?Petshop_DP_Kainos::numatytoji_proc($pid):''; $cnt['proc'][$pr===''?'(nera)':$pr]=($cnt['proc'][$pr===''?'(nera)':$pr]??0)+1;
      $st=$p->get_stock_status(); $q=$p->get_stock_quantity(); $lk=$st!=='instock'?'nera':(($q===null)?'be_skaiciaus':($q<2?'1 vnt':($q<6?'2-5':'6+'))); $cnt['likutis'][$lk]=($cnt['likutis'][$lk]??0)+1;
      $ps=$pard[$pid]??0; $pk=$ps==0?'0':($ps<3?'1-2':($ps<10?'3-9':'10+')); $cnt['pard_wc'][$pk]=($cnt['pard_wc'][$pk]??0)+1;
      $b=wp_get_post_terms($pid,'product_brand',['fields'=>'names']); $bn=$b?$b[0]:'?'; $cnt['brendas'][$bn]=($cnt['brendas'][$bn]??0)+1;
      $kn=(float)$p->get_regular_price('edit'); $kk=$kn<20?'<20':($kn<40?'20-40':($kn<60?'40-60':'60+')); $cnt['kaina'][$kk]=($cnt['kaina'][$kk]??0)+1;
      if(preg_match('/(^|[^0-9,.])((?:[2-9]|10)(?:[,.][0-9]+)?) ?kg/u',$p->get_name(),$m)){ $kg=str_replace(',','.',$m[2]); $cnt['dydis_kg'][$kg]=($cnt['dydis_kg'][$kg]??0)+1; }
      if(count($pvz)<12 && $ps>=3) $pvz[]=['id'=>$pid,'pav'=>mb_substr($p->get_name(),0,60),'kaina'=>$kn,'sand'=>$sd,'pard'=>$ps,'proc'=>$pr,'pako_kaina'=>($pr!==''&&$kn>0&&class_exists('Petshop_DP_Kainos'))?Petshop_DP_Kainos::kaina($kn,2,$pr):null];
    }
    foreach($cnt as $k=>$v){ arsort($v); $cnt[$k]=($k==='brendas')?array_slice($v,0,15,true):$v; }
    $r['pjuviai']=$cnt; $r['pavyzdziai']=$pvz;
    // esamų pakų SEO / matomumas
    $pk=$wpdb->get_col("SELECT post_id FROM {$P}postmeta WHERE meta_key='_dp_base_product_id' AND meta_value<>''");
    $rob=[]; foreach($pk as $x){ $v=get_post_meta($x,'rank_math_robots',true); $k=is_array($v)?implode(',',$v):(string)$v; $rob[$k?:'(numatyta)']=($rob[$k?:'(numatyta)']??0)+1; } $r['paku_robots']=$rob;
    $r['paku_seima']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$P}postmeta s JOIN {$P}postmeta b ON b.post_id=s.post_id AND b.meta_key='_dp_base_product_id' WHERE s.meta_key='_ps_dydzio_seima' AND s.meta_value<>''");
    $r['rm_sitemap_product']=get_option('rank-math-options-sitemap')['pt_product_sitemap']??null;
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE); exit;
}, 1);
