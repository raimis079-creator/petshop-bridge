<?php
/** Plugin Name: TEMP PS S1703 ma — skaičiuoklės recon (read-only): Feeding_Service API, lentelių aprėptis, esamas prekės puslapio calc, /skaiciuokle/ */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1703ma'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1703 ma');
  try{
    // 1. Feeding_Service ir kitos calc klasės
    foreach(array('Feeding_Service','Petshop_Feeding_Service','Pet_Profile','Petshop_Relaunch','Plan_Attribution','Petshop_Plan_Attribution') as $c){
      if(class_exists($c)){ $rc=new ReflectionClass($c); $ms=array(); foreach($rc->getMethods(ReflectionMethod::IS_PUBLIC) as $m){ $ps=array(); foreach($m->getParameters() as $pp) $ps[]=($pp->isOptional()?'?':'').'$'.$pp->getName(); $ms[]=($m->isStatic()?'static ':'').$m->getName().'('.implode(',',$ps).')'; } $o['klases'][$c]=array('file'=>str_replace(ABSPATH,'',$rc->getFileName()),'m'=>$ms); }
      else $o['klases'][$c]='NĖRA';
    }
    // 2. core includes failai su 'calc'/'feed'
    $dir=WP_PLUGIN_DIR.'/petshop-core/includes/'; $f=array(); if(is_dir($dir)) foreach(scandir($dir) as $x){ if(substr($x,-4)==='.php') $f[]=$x.' '.filesize($dir.$x); } $o['core_includes']=$f;
    $tdir=WP_PLUGIN_DIR.'/petshop-core/templates/'; $t=array(); if(is_dir($tdir)){ $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($tdir)); foreach($it as $x){ if($x->isFile()) $t[]=str_replace($tdir,'',$x->getPathname()); } } $o['core_templates']=$t;
    $adir=WP_PLUGIN_DIR.'/petshop-core/assets/'; $a=array(); if(is_dir($adir)) foreach(scandir($adir) as $x){ if($x[0]!=='.') $a[]=$x.' '.@filesize($adir.$x); } $o['core_assets']=$a;
    // 3. shortcodes su ps/calc/pet
    global $shortcode_tags; $sc=array(); foreach(array_keys($shortcode_tags) as $s){ if(preg_match('/ps|calc|pet|skaic|feed/i',$s)) $sc[]=$s; } $o['shortcodes']=$sc;
    // 4. REST maršrutai ps
    $routes=array(); foreach(array_keys(rest_get_server()->get_routes()) as $r){ if(preg_match('#^/ps#',$r)) $routes[]=$r; } $o['rest']=$routes;
    // 5. lentelių aprėptis
    $o['lenteles']=array(
      'ps_feeding_tables'=>$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_feeding_tables"),
      'ps_feeding_map'=>$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_feeding_map"),
      'ps_feeding_rows'=>$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_feeding_rows"),
    );
    foreach(array('ps_feeding_tables','ps_feeding_map','ps_feeding_rows') as $tb){ $o['schema'][$tb]=$wpdb->get_col("SHOW COLUMNS FROM {$p}$tb",0); }
    $o['tables_sample']=$wpdb->get_results("SELECT * FROM {$p}ps_feeding_tables LIMIT 3",ARRAY_A);
    $o['map_sample']=$wpdb->get_results("SELECT * FROM {$p}ps_feeding_map LIMIT 3",ARRAY_A);
    $o['rows_sample']=$wpdb->get_results("SELECT * FROM {$p}ps_feeding_rows LIMIT 5",ARRAY_A);
    // 6. prekės su lentele — kiek publish/instock, pagal brendą ir rūšį
    $cols=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_feeding_map",0);
    $pidcol=in_array('product_id',$cols)?'product_id':(in_array('post_id',$cols)?'post_id':$cols[0]); $o['map_pidcol']=$pidcol;
    $sql="SELECT m.$pidcol pid, po.post_status st, ps.meta_value stock, pr.meta_value price FROM {$p}ps_feeding_map m JOIN {$p}posts po ON po.ID=m.$pidcol LEFT JOIN {$p}postmeta ps ON ps.post_id=m.$pidcol AND ps.meta_key='_stock_status' LEFT JOIN {$p}postmeta pr ON pr.post_id=m.$pidcol AND pr.meta_key='_price' GROUP BY m.$pidcol";
    $rows=$wpdb->get_results($sql,ARRAY_A); $o['map_prekiu']=count($rows); $st=array(); $brand=array();
    foreach($rows as $r){ $k=$r['st'].'/'.$r['stock']; $st[$k]=($st[$k]??0)+1; if($r['st']==='publish'&&$r['stock']==='instock'){ $b=get_the_terms((int)$r['pid'],'product_brand'); $bn=$b&&!is_wp_error($b)?$b[0]->name:'-'; $brand[$bn]=($brand[$bn]??0)+1; } }
    arsort($brand); $o['map_statusai']=$st; $o['map_brendai_gyvi']=$brand;
    // 7. /skaiciuokle/ puslapis
    $o['puslapis']=$wpdb->get_results("SELECT ID,post_status,post_type,post_title FROM {$p}posts WHERE post_name IN ('skaiciuokle','skaiciuokles','kiek-kainuoja') AND post_type IN ('page','post')",ARRAY_A);
    $o['veisles']=$wpdb->get_results("SELECT ID,post_name,post_type,post_status FROM {$p}posts WHERE post_type IN ('page','post') AND post_status='publish' AND (post_name LIKE '%taksas%' OR post_name LIKE '%aviganis%' OR post_name LIKE '%labrador%' OR post_name LIKE '%jork%') LIMIT 10",ARRAY_A);
    // 8. kaip calc renderinamas prekės puslapyje — hook'ai su ps/calc
    $hk=array(); foreach(array('woocommerce_single_product_summary','woocommerce_after_single_product_summary','woocommerce_before_add_to_cart_form','woocommerce_after_add_to_cart_form','wp_enqueue_scripts','wp_footer') as $h){ global $wp_filter; if(empty($wp_filter[$h])) continue; foreach($wp_filter[$h]->callbacks as $pr=>$cbs) foreach($cbs as $cb){ $fn=$cb['function']; $n=is_array($fn)?(is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]:(is_string($fn)?$fn:'closure'); if(preg_match('/pet|calc|feed|plan|ps_/i',$n)) $hk[$h][]=$pr.' '.$n; } } $o['hooks']=$hk;
    // 9. calc pavyzdys — Exclusion 7 kg #18587 ir Josera 10 kg, 10 kg šuo
    if(class_exists('Feeding_Service')){
      foreach(array(18587,18054) as $pid){ try{ $o['calc'][$pid]=Feeding_Service::calc(array('product_id'=>$pid,'weight_kg'=>10,'species_code'=>'dog')); }catch(Throwable $e){ $o['calc'][$pid]='ERR '.$e->getMessage(); } }
    }
    // 10. įvykiai calc per 14 d.
    $ev=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_web_ivykiai",0); $o['ivykiai_cols']=$ev;
    $tcol=in_array('tipas',$ev)?'tipas':(in_array('ivykis',$ev)?'ivykis':(in_array('event',$ev)?'event':null));
    if($tcol){ $o['calc_ivykiai']=$wpdb->get_results("SELECT $tcol t,COUNT(*) n FROM {$p}ps_web_ivykiai WHERE $tcol LIKE '%calc%' OR $tcol LIKE '%pet%' OR $tcol LIKE '%plan%' GROUP BY $tcol",ARRAY_A); }
    // 11. plan attribution
    $o['plan_attr']=$wpdb->get_results("SELECT COUNT(*) n, MIN(created_at) nuo, MAX(created_at) iki FROM {$p}ps_plan_attribution",ARRAY_A);
    $o['plan_attr_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_plan_attribution",0);
    // 12. mu-plugins sąrašas su calc/plan/pet
    $mu=array(); foreach(scandir(WPMU_PLUGIN_DIR) as $x){ if(preg_match('/calc|plan|pet|feed|skaic|veisl|breed/i',$x)) $mu[]=$x; } $o['mu']=$mu;
    $o['theme_tpl']=array_values(array_filter(scandir(get_stylesheet_directory()),function($x){return preg_match('/calc|skaic|veisl|breed|page-/i',$x);}));
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getFile().':'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
