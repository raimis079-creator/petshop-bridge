<?php
/** Plugin Name: TEMP PS S1703 mf — noindex nuėmimas 26 puslapiams (1 = daryti su bak opcija, 2 = patikra HTML, 9 = atstatyti iš bak) */
add_action('wp_loaded', function(){
  $f=(isset($_GET['ps_s1703mf'])?$_GET['ps_s1703mf']:''); if(!in_array($f,array('1','2','9'),true)) return;
  header('Content-Type: application/json; charset=utf-8'); global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1703 mf','faze'=>$f);
  try{
    if($f==='1'){
      $rows=$wpdb->get_results("SELECT p.ID,p.post_name,m.meta_value FROM {$p}posts p JOIN {$p}postmeta m ON m.post_id=p.ID AND m.meta_key='rank_math_robots' AND m.meta_value LIKE '%noindex%' WHERE p.post_type='page' AND p.post_status='publish'",ARRAY_A);
      $bak=get_option('ps_s1703_noindex_bak'); if(!is_array($bak)) $bak=array();
      foreach($rows as $r){
        $id=(int)$r['ID']; $bak[$id]=array('slug'=>$r['post_name'],'rank_math_robots'=>$r['meta_value'],'yoast'=>get_post_meta($id,'_yoast_wpseo_meta-robots-noindex',true),'yoast_nf'=>get_post_meta($id,'_yoast_wpseo_meta-robots-nofollow',true));
        $v=maybe_unserialize($r['meta_value']); $v=is_array($v)?array_values(array_filter($v,function($x){return $x!=='noindex'&&$x!=='nofollow';})):array();
        if(!in_array('index',$v,true)) $v[]='index';
        update_post_meta($id,'rank_math_robots',$v);
        delete_post_meta($id,'_yoast_wpseo_meta-robots-noindex'); delete_post_meta($id,'_yoast_wpseo_meta-robots-nofollow');
        $o['pakeista'][]=$r['post_name'].' → '.implode(',',$v);
        if(function_exists('wp_cache_post_change')) wp_cache_post_change($id);
      }
      update_option('ps_s1703_noindex_bak',$bak,false); $o['bak_n']=count($bak);
      if(function_exists('wp_cache_clear_cache')) { wp_cache_clear_cache(); $o['super_cache']='isvalytas'; }
      $o['liko_noindex']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}posts p JOIN {$p}postmeta m ON m.post_id=p.ID AND m.meta_key='rank_math_robots' AND m.meta_value LIKE '%noindex%' WHERE p.post_type='page' AND p.post_status='publish'");
      $o['yoast_liko']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}postmeta WHERE meta_key='_yoast_wpseo_meta-robots-noindex' AND meta_value='1'");
    } elseif($f==='9'){
      $bak=get_option('ps_s1703_noindex_bak'); $n=0; foreach((array)$bak as $id=>$b){ update_post_meta((int)$id,'rank_math_robots',maybe_unserialize($b['rank_math_robots'])); if($b['yoast']!=='') update_post_meta((int)$id,'_yoast_wpseo_meta-robots-noindex',$b['yoast']); $n++; } $o['atstatyta']=$n;
    } else {
      foreach(array('/taksas/','/rusu-melynoji/','/suo-nuolat-kasosi-7-priezastys-ir-3-minuciu-planas-ka-daryti-siandien/','/josera-sunu-maistas/','/pristatymas/','/skaiciuokle/') as $u){
        $r=wp_remote_get(home_url($u.'?nocache='.time()),array('timeout'=>25,'user-agent'=>'Mozilla/5.0 ps-s1703')); $h=wp_remote_retrieve_body($r);
        $o['html'][$u]=array(wp_remote_retrieve_response_code($r),preg_match('#<meta name="robots" content="([^"]*)"#',$h,$m)?$m[1]:'NĖRA robots meta',substr_count($h,'noindex'));
      }
      // Rank Math sitemap — ar puslapiai yra page-sitemap
      $r=wp_remote_get(home_url('/page-sitemap.xml?x='.time()),array('timeout'=>25)); $h=wp_remote_retrieve_body($r); $o['page_sitemap']=array(wp_remote_retrieve_response_code($r),substr_count($h,'<loc>'),substr_count($h,'/taksas/'),substr_count($h,'/skaiciuokle/'));
      $o['noindex_liko']=$wpdb->get_results("SELECT p.post_name FROM {$p}posts p JOIN {$p}postmeta m ON m.post_id=p.ID AND m.meta_key='rank_math_robots' AND m.meta_value LIKE '%noindex%' WHERE p.post_status='publish' AND p.post_type IN ('page','post','product') LIMIT 20",ARRAY_A);
    }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
