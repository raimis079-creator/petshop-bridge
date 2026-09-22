<?php
/** Plugin Name: TEMP PS S1704n akciju puslapis */
add_action('init', function(){
  $f=(isset($_GET['ps_s1704n'])?$_GET['ps_s1704n']:''); if($f!=='1'&&$f!=='2') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1704n','faze'=>$f);
  try{
    global $wpdb; $p=$wpdb->prefix;
    if($f==='1'){
      // puslapis
      $pg=$wpdb->get_results("SELECT ID,post_name,post_status FROM {$wpdb->posts} WHERE post_type='page' AND (post_name LIKE '%akcij%' OR post_title LIKE '%akcij%')",ARRAY_A);
      $o['puslapiai']=$pg;
      foreach($pg as $r){ $c=get_post_field('post_content',$r['ID']); $o['turinys'][$r['ID']]=mb_substr($c,0,600); }
      // kas generuoja "Rodyti akcijas"
      $rad=array();
      foreach(array(WPMU_PLUGIN_DIR,WP_PLUGIN_DIR.'/petshop-core',get_stylesheet_directory()) as $dir){
        if(!is_dir($dir)) continue;
        $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir,FilesystemIterator::SKIP_DOTS));
        foreach($it as $file){ if($file->getExtension()!=='php') continue; $c=@file_get_contents($file->getPathname()); if($c===false) continue;
          if(strpos($c,'Rodyti akcijas')!==false||strpos($c,'Graužikams')!==false) $rad[]=str_replace(WP_CONTENT_DIR,'',$file->getPathname()); }
      }
      $o['failai']=$rad;
      foreach($rad as $fn){ $c=file_get_contents(WP_CONTENT_DIR.$fn); $o['kodas'][$fn]=array('dydis'=>strlen($c),'md5'=>md5($c)); $i=strpos($c,'Rodyti akcijas'); $o['gabalas'][$fn]=substr($c,max(0,$i-6000),9000); }
    } else {
      // kiek akciju is tikruju
      $ids=wc_get_product_ids_on_sale(); $o['wc_on_sale_n']=count($ids);
      $st=array(); $vis=array(); $stock=array(); $tip=array();
      foreach($ids as $id){ $pr=wc_get_product($id); if(!$pr) continue;
        $s=$pr->get_status(); $st[$s]=($st[$s]??0)+1;
        $v=$pr->get_catalog_visibility(); $vis[$v]=($vis[$v]??0)+1;
        $ss=$pr->get_stock_status(); $stock[$ss]=($stock[$ss]??0)+1;
        $t=$pr->get_type(); $tip[$t]=($tip[$t]??0)+1; }
      $o['pagal_status']=$st; $o['pagal_matomuma']=$vis; $o['pagal_likuti']=$stock; $o['pagal_tipa']=$tip;
      // publish + visible + instock
      $ok=0; $pasl=array();
      foreach($ids as $id){ $pr=wc_get_product($id); if(!$pr||$pr->get_status()!=='publish') continue;
        if($pr->get_catalog_visibility()==='visible'&&$pr->is_in_stock()) $ok++; else $pasl[]=array('id'=>$id,'pav'=>mb_substr($pr->get_name(),0,50),'vis'=>$pr->get_catalog_visibility(),'stock'=>$pr->get_stock_status(),'dropship_paslepta'=>get_post_meta($id,'_ps_dropship_paslepta',true),'sandelis'=>get_post_meta($id,'_ps_sandelis',true)); }
      $o['publish_visible_instock']=$ok; $o['nerodomu_n']=count($pasl); $o['nerodomos']=array_slice($pasl,0,60);
      // tiesiogiai is DB: _sale_price nustatyta
      $o['db_sale_price_publish']=(int)$wpdb->get_var("SELECT COUNT(DISTINCT pm.post_id) FROM {$wpdb->postmeta} pm JOIN {$wpdb->posts} po ON po.ID=pm.post_id WHERE pm.meta_key='_sale_price' AND pm.meta_value<>'' AND po.post_status='publish' AND po.post_type IN ('product','product_variation')");
      $o['lookup_onsale']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_product_meta_lookup WHERE onsale=1");
    }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
