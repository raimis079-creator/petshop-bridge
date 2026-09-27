<?php
/** Plugin Name: TEMP PS S1725a read-only: S1722 patikra — DP paku kainos, naktinis, zurnalas, feed'ai, snippet 572, klaidos */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1725a'])) return; $f=(string)$_GET['ps_s1725a']; $r=['v'=>'S1725a','faze'=>$f,'laikas'=>current_time('mysql')]; global $wpdb; $P=$wpdb->prefix; @set_time_limit(150);
  $q=function($sql) use($wpdb,&$r){ $x=$wpdb->get_results($sql,ARRAY_A); if($wpdb->last_error) $r['SQL_ERR'][]=mb_substr($wpdb->last_error,0,200); return $x; };
  try{
    if($f==='1'){
      // A. pluginas
      $fp=WPMU_PLUGIN_DIR.'/petshop-dp-kainos.php';
      $r['plugin']=['yra'=>is_file($fp),'md5'=>is_file($fp)?md5_file($fp):null,'ver'=>(is_file($fp)&&preg_match('#Version:\s*([\d.]+)#',file_get_contents($fp),$m))?$m[1]:null,'klase'=>class_exists('Petshop_DP_Kainos'),'isjungta'=>get_option('ps_dp_kainos_isjungta')];
      $nx=wp_next_scheduled('ps_dp_kainos_naktinis'); $r['cron_kitas']=$nx?wp_date('Y-m-d H:i',$nx):null;
      $r['pask']=get_option('ps_dp_kainos_pask');
      $z=get_option('ps_dp_kainos_zurnalas',[]); $r['zurnalas_n']=count((array)$z); $r['zurnalas_10']=array_slice((array)$z,0,10);
      $r['nuolaidos']=get_option('ps_dp_nuolaidos');
      $r['kabliai']=['updated_post_meta'=>has_action('updated_post_meta',['Petshop_DP_Kainos','meta_pokytis']),'added_post_meta'=>has_action('added_post_meta',['Petshop_DP_Kainos','meta_pokytis']),'cron'=>has_action('ps_dp_kainos_naktinis'),'ajax_572'=>has_action('wp_ajax_petshop_dp_proc')];
      // B. visi pakai
      $pakai=$q("SELECT p.ID, p.post_title t, p.post_status st, b.meta_value baze, k.meta_value qty, (SELECT meta_value FROM {$P}postmeta WHERE post_id=p.ID AND meta_key='_dp_nuolaida_proc' LIMIT 1) proc FROM {$P}posts p JOIN {$P}postmeta b ON b.post_id=p.ID AND b.meta_key='_dp_base_product_id' AND b.meta_value<>'' LEFT JOIN {$P}postmeta k ON k.post_id=p.ID AND k.meta_key='_dp_pack_qty' WHERE p.post_type='product' ORDER BY p.ID");
      $eil=[]; $sum=['viso'=>0,'su_proc'=>0,'be_proc'=>0,'atitinka'=>0,'neatitinka'=>0,'klaidos'=>0,'lookup_neatitinka'=>0];
      foreach($pakai as $x){
        $sum['viso']++; $pak=wc_get_product($x['ID']); $base=wc_get_product((int)$x['baze']);
        $e=['id'=>(int)$x['ID'],'t'=>mb_substr($x['t'],0,55),'st'=>$x['st'],'baze'=>(int)$x['baze'],'baze_st'=>$base?$base->get_status():'NERA','qty'=>(int)$x['qty'],'proc'=>$x['proc'],
            'b_reg'=>$base?$base->get_regular_price('edit'):null,'b_sale'=>$base?$base->get_sale_price('edit'):null,
            'p_reg'=>$pak?$pak->get_regular_price('edit'):null,'p_sale'=>$pak?$pak->get_sale_price('edit'):null,'p_price'=>$pak?$pak->get_price('edit'):null];
        $lk=$wpdb->get_row($wpdb->prepare("SELECT min_price,max_price,onsale FROM {$P}wc_product_meta_lookup WHERE product_id=%d",$x['ID']),ARRAY_A); $e['lookup']=$lk?$lk['min_price']:null;
        if($lk && $e['p_price']!==null && abs((float)$lk['min_price']-(float)$e['p_price'])>0.005){ $e['LOOKUP_NESUTAMPA']=1; $sum['lookup_neatitinka']++; }
        if(class_exists('Petshop_DP_Kainos')){ $d=Petshop_DP_Kainos::sinchronizuoti($x['ID'],true,'s1725'); if(isset($d['praleista'])){$sum['be_proc']++; $e['dry']='rankine';} else { $sum['su_proc']++; if(!empty($d['klaida'])){$sum['klaidos']++; $e['dry']='KLAIDA '.$d['klaida'];} elseif(!empty($d['pakeista'])){$sum['neatitinka']++; $e['dry']='NEATITINKA '.implode('/',array_filter($d['buvo'])).' → '.implode('/',array_filter($d['nauja']));} else {$sum['atitinka']++; $e['dry']='ok';} } }
        $eil[]=$e;
      }
      $r['suvestine']=$sum; $r['pakai']=$eil;
      if(class_exists('Petshop_DP_Kainos')) $r['rytas_lempute']=Petshop_DP_Kainos::suvestine();
      // C. feed'ai
      $ff=WP_PLUGIN_DIR.'/petshop-feeds/petshop-feeds.php'; $r['feeds_plugin']=['md5'=>is_file($ff)?md5_file($ff):null,'ver'=>(is_file($ff)&&preg_match('#Version:\s*([\d.]+)#',file_get_contents($ff),$m))?$m[1]:null];
      $ids=array_map('intval',array_column($pakai,'ID'));
      if(function_exists('ps_feeds_ids')){ $all=array_map('intval',ps_feeds_ids()); $r['feed_ids']=count($all); $r['pakai_feed_ids']=array_values(array_intersect($ids,$all)); }
      $up=wp_upload_dir()['basedir'];
      foreach(array_unique(array_merge(glob($up.'/*.xml')?:[],glob($up.'/feeds/*.xml')?:[],glob($up.'/petshop-feeds/*.xml')?:[])) as $fx){ if(!is_file($fx)||filesize($fx)>60000000) continue; $s=file_get_contents($fx); $hit=[]; foreach($ids as $pid){ if(preg_match('#<g:id>'.$pid.'</g:id>|<id>'.$pid.'</id>|[?&]p='.$pid.'\b|<product_id>'.$pid.'<#',$s)) $hit[]=$pid; }
        $r['feed_failai'][str_replace($up,'',$fx)]=['mtime'=>wp_date('Y-m-d H:i',filemtime($fx)),'item'=>substr_count($s,'<item>')+substr_count($s,'<product>')+substr_count($s,'<entry>'),'pakai'=>$hit]; }
      // D. snippet 572
      $sn=$wpdb->get_row("SELECT id,name,active,LENGTH(code) len,MD5(code) md5 FROM {$P}snippets WHERE id=572",ARRAY_A); $r['snip572']=$sn;
      $c=$wpdb->get_var("SELECT code FROM {$P}snippets WHERE id=572"); $r['snip572_turi']=['petshop_dp_proc'=>substr_count((string)$c,'petshop_dp_proc'),'Esami pakai'=>substr_count((string)$c,'Esami pakai'),'Nuolaida %'=>substr_count((string)$c,'Nuolaida %')];
      $r['bak_opcijos']=$wpdb->get_col("SELECT option_name FROM {$P}options WHERE option_name IN ('ps_s1722_dp_bak','ps_s1722_snip572_bak','ps_s1722_snip572_v10_bak')");
    }
    if($f==='2'){
      // E. klaidos po deploy (09-26 21:00 LT)
      $cands=[ini_get('error_log'),WP_CONTENT_DIR.'/debug.log',ABSPATH.'error_log',dirname(ABSPATH).'/logs/php_error.log',ABSPATH.'php_error.log',dirname(ABSPATH).'/php_error.log'];
      foreach(array_unique(array_filter($cands)) as $lf){ if(!is_file($lf)) continue; $sz=filesize($lf); $h=fopen($lf,'r'); fseek($h,max(0,$sz-3000000)); $s=stream_get_contents($h); fclose($h);
        $L=explode("\n",$s); $hit=[]; foreach($L as $ln){ if(preg_match('#dp-kainos|DP_Kainos|snippet.*572|petshop_dp_proc|petshop-feeds#i',$ln)) $hit[]=mb_substr($ln,0,260); }
        $fat=[]; foreach($L as $ln){ if(stripos($ln,'Fatal')!==false) $fat[]=mb_substr($ln,0,220); }
        $r['log'][$lf]=['dydis'=>$sz,'mtime'=>wp_date('Y-m-d H:i',filemtime($lf)),'dp_eil'=>count($hit),'dp_pask'=>array_slice($hit,-12),'fatal_pask'=>array_slice($fat,-8)]; }
      // F. užsakymai su DP pakais nuo 09-26 20:50
      $r['uzs_su_pakais']=$q("SELECT i.order_id, i.order_item_name nm, (SELECT meta_value FROM {$P}woocommerce_order_itemmeta WHERE order_item_id=i.order_item_id AND meta_key='_line_total') suma, (SELECT meta_value FROM {$P}woocommerce_order_itemmeta WHERE order_item_id=i.order_item_id AND meta_key='_qty') q, o.date_created_gmt FROM {$P}woocommerce_order_items i JOIN {$P}wc_orders o ON o.id=i.order_id JOIN {$P}woocommerce_order_itemmeta pm ON pm.order_item_id=i.order_item_id AND pm.meta_key='_product_id' JOIN {$P}postmeta b ON b.post_id=pm.meta_value AND b.meta_key='_dp_base_product_id' WHERE o.date_created_gmt>='2026-09-26 17:50:00' ORDER BY i.order_id DESC LIMIT 20");
    }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
