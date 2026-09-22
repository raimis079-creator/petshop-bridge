<?php
/** Plugin Name: TEMP PS S1703 mg — Rank Math sitemap cache išvalymas + patikra; 2 = 8 straipsnių (post) noindex nuėmimas (bak ta pati opcija) */
add_action('wp_loaded', function(){
  $f=(isset($_GET['ps_s1703mg'])?$_GET['ps_s1703mg']:''); if(!in_array($f,array('1','2'),true)) return;
  header('Content-Type: application/json; charset=utf-8'); global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1703 mg','faze'=>$f);
  try{
    if($f==='2'){
      $rows=$wpdb->get_results("SELECT p.ID,p.post_name,m.meta_value FROM {$p}posts p JOIN {$p}postmeta m ON m.post_id=p.ID AND m.meta_key='rank_math_robots' AND m.meta_value LIKE '%noindex%' WHERE p.post_type='post' AND p.post_status='publish'",ARRAY_A);
      $bak=get_option('ps_s1703_noindex_bak'); if(!is_array($bak)) $bak=array();
      foreach($rows as $r){ $id=(int)$r['ID']; $bak[$id]=array('slug'=>$r['post_name'],'rank_math_robots'=>$r['meta_value'],'yoast'=>get_post_meta($id,'_yoast_wpseo_meta-robots-noindex',true),'tipas'=>'post');
        $v=maybe_unserialize($r['meta_value']); $v=is_array($v)?array_values(array_filter($v,function($x){return $x!=='noindex'&&$x!=='nofollow';})):array(); if(!in_array('index',$v,true)) $v[]='index';
        update_post_meta($id,'rank_math_robots',$v); delete_post_meta($id,'_yoast_wpseo_meta-robots-noindex'); delete_post_meta($id,'_yoast_wpseo_meta-robots-nofollow'); $o['pakeista'][]=$r['post_name']; if(function_exists('wp_cache_post_change')) wp_cache_post_change($id); }
      update_option('ps_s1703_noindex_bak',$bak,false); $o['bak_n']=count($bak);
    }
    // sitemap cache
    $n=0; foreach(array('rank_math_sitemap_cache','rank-math-sitemap-cache') as $g){}
    $del=$wpdb->query("DELETE FROM {$p}options WHERE option_name LIKE '_transient_rank_math_sitemap_%' OR option_name LIKE '_transient_timeout_rank_math_sitemap_%' OR option_name LIKE 'rank_math_sitemap_cache%'"); $o['transient_del']=$del;
    if(class_exists('RankMath\\Sitemap\\Cache')){ try{ RankMath\Sitemap\Cache::invalidate_storage(); $o['rm_cache']='invalidate_storage'; }catch(Throwable $e){ $o['rm_cache']='ERR '.$e->getMessage(); } }
    if(function_exists('rank_math')&&method_exists(rank_math(),'sitemap')){}
    do_action('rank_math/sitemap/invalidate');
    if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache();
    $r=wp_remote_get(home_url('/page-sitemap.xml?x='.time()),array('timeout'=>25)); $h=wp_remote_retrieve_body($r); $o['page_sitemap']=array(wp_remote_retrieve_response_code($r),substr_count($h,'<loc>'),substr_count($h,'/taksas/'),substr_count($h,'/skaiciuokle/'));
    $r=wp_remote_get(home_url('/post-sitemap.xml?x='.time()),array('timeout'=>25)); $h=wp_remote_retrieve_body($r); $o['post_sitemap']=array(wp_remote_retrieve_response_code($r),substr_count($h,'<loc>'));
    $o['noindex_liko']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}posts p JOIN {$p}postmeta m ON m.post_id=p.ID AND m.meta_key='rank_math_robots' AND m.meta_value LIKE '%noindex%' WHERE p.post_status='publish' AND p.post_type IN ('page','post','product')");
    $o['post_publish']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}posts WHERE post_type='post' AND post_status='publish'");
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
