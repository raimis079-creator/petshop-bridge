<?php
/** Plugin Name: TEMP PS S1720m — 2.17 II recon: FBT/calc kabliai visame wp-content; top sausas maistas 90 d. + šeimos (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1720m'])) return; $f=$_GET['ps_s1720m']; $r=['v'=>'S1720m','faze'=>$f];
  global $wpdb; $p=$wpdb->prefix; @set_time_limit(280);
  try{
  if($f==='d'){
    $roots=[WP_CONTENT_DIR.'/mu-plugins',WP_CONTENT_DIR.'/plugins/petshop-core',get_stylesheet_directory(),WP_CONTENT_DIR.'/plugins'];
    $n=0; foreach($roots as $root){ if(!is_dir($root)) continue; $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root,FilesystemIterator::SKIP_DOTS)); foreach($it as $fi){ if($fi->getExtension()!=='php') continue; if(strpos($fi->getPathname(),'/woocommerce/')!==false||strpos($fi->getPathname(),'/flatsome/')!==false) continue; $n++; if($n>4000) break 2; $c=@file_get_contents($fi->getPathname()); if(!$c) continue;
      foreach(['petshop-fbt__heading'=>'fbt','ps-calc-head'=>'calc','ps-calc"'=>'calc2','Petshop_Dydziai'=>'dydziai'] as $needle=>$tag){ if(strpos($c,$needle)!==false){ $rel=str_replace(WP_CONTENT_DIR,'',$fi->getPathname()); $r['failai'][$tag][]=$rel; if(preg_match_all('/add_action\(\s*[\'"](woocommerce_[a-z_]+|wp_footer|the_content)[\'"]\s*,\s*([^;]{0,110})/',$c,$mm,PREG_SET_ORDER)) foreach($mm as $x) $r['hooks'][$rel][]=$x[1].' , '.preg_replace('/\s+/',' ',$x[2]); } } } }
    $r['skenuota']=$n;
    $sn=$wpdb->get_results("SELECT id,name,priority FROM {$p}snippets WHERE active=1 AND (code LIKE '%petshop-fbt__heading%' OR code LIKE '%ps-calc-head%' OR code LIKE '%ps-calc%')",ARRAY_A); $r['snippetai']=$sn;
    foreach((array)$sn as $s){ $c=$wpdb->get_var($wpdb->prepare("SELECT code FROM {$p}snippets WHERE id=%d",$s['id'])); if(preg_match_all('/add_action\(\s*[\'"](woocommerce_[a-z_]+)[\'"]\s*,\s*([^;]{0,110})/',$c,$mm,PREG_SET_ORDER)) foreach($mm as $x) $r['snippet_hooks'][$s['id']][]=$x[1].' , '.preg_replace('/\s+/',' ',$x[2]); }
    // faktinės prioritetų reikšmės gyvai: kas registruota woocommerce_single_product_summary / after_add_to_cart_form
    global $wp_filter; foreach(['woocommerce_single_product_summary','woocommerce_after_add_to_cart_form','woocommerce_after_add_to_cart_button','woocommerce_after_single_product_summary','woocommerce_product_meta_end','woocommerce_before_add_to_cart_form'] as $h){ if(empty($wp_filter[$h])) continue; foreach($wp_filter[$h]->callbacks as $prio=>$cbs){ foreach($cbs as $cb){ $fn=$cb['function']; $name=is_string($fn)?$fn:(is_array($fn)?(is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]:'closure'); $r['registruota'][$h][]=$prio.' '.$name; } } }
  }
  if($f==='e'){
    $top=$wpdb->get_results("SELECT e.preke_id pid, SUM(e.kiekis) n, SUM(e.kaina_ct)/100 eur, COUNT(DISTINCT e.uzsakymas_id) uzs FROM {$p}ps_fakt_eilutes e WHERE e.apmoketa_at>=NOW()-INTERVAL 90 DAY AND e.kategoriju_kelias LIKE '%saus%' AND COALESCE(e.testinis,0)=0 GROUP BY e.preke_id ORDER BY eur DESC LIMIT 40",ARRAY_A);
    $ist=$wpdb->get_results("SELECT e.wc_product_id pid, SUM(e.kiekis) n FROM {$p}ps_ist_eilutes e JOIN {$p}ps_ist_uzsakymai u ON u.id=e.uzsakymo_id JOIN {$p}posts p ON p.ID=e.wc_product_id AND p.post_status='publish' JOIN {$p}term_relationships tr ON tr.object_id=p.ID JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='product_cat' JOIN {$p}terms t ON t.term_id=tt.term_id AND t.slug LIKE 'sausas%' WHERE u.ivykdytas=1 AND u.data>=NOW()-INTERVAL 365 DAY GROUP BY e.wc_product_id ORDER BY n DESC LIMIT 40",ARRAY_A);
    $seen=[]; foreach(array_merge((array)$top,(array)$ist) as $t){ $pid=(int)$t['pid']; if(isset($seen[$pid])) continue; $seen[$pid]=1; $pav=html_entity_decode(get_the_title($pid),ENT_QUOTES,'UTF-8');
      $base=trim(preg_replace('/\s*[,–\-]?\s*\d+(?:[.,]\d+)?(?:\s*\+\s*\d+(?:[.,]\d+)?)?\s*(kg|g)\b.*$/iu','',$pav)); $base=preg_replace('/\s*(sausas|sausas pašaras|sausas maistas).*$/iu','',$base);
      $sib=[]; if(mb_strlen($base)>=10){ $sib=$wpdb->get_results($wpdb->prepare("SELECT ID,post_title FROM {$p}posts WHERE post_type='product' AND post_status='publish' AND post_title LIKE %s AND ID<>%d AND post_title NOT LIKE '%vnt.%' LIMIT 8",$wpdb->esc_like(mb_substr($base,0,30)).'%',$pid),ARRAY_A); }
      $r['top'][]=['pid'=>$pid,'n'=>(int)($t['n']??0),'eur'=>isset($t['eur'])?round($t['eur']):null,'pav'=>mb_substr($pav,0,64),'seima'=>get_post_meta($pid,'_ps_dydzio_seima',true)?:'-','pakuote'=>implode('/',(array)wp_get_object_terms($pid,'pa_pakuotes_dydis',['fields'=>'names'])),'broliai'=>array_map(function($s){return $s['ID'].' '.mb_substr(html_entity_decode($s['post_title']),-22);},$sib)]; if(count($r['top'])>=45) break; }
    $r['seimos_dabar']=$wpdb->get_results("SELECT meta_value seima,COUNT(*) n FROM {$p}postmeta WHERE meta_key='_ps_dydzio_seima' GROUP BY meta_value",ARRAY_A);
    $r['pa_pakuotes']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}term_taxonomy WHERE taxonomy='pa_pakuotes_dydis'"); $r['pa_pakuotes_prekes']=$wpdb->get_var("SELECT COUNT(DISTINCT tr.object_id) FROM {$p}term_relationships tr JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id WHERE tt.taxonomy='pa_pakuotes_dydis'");
  }
  }catch(Throwable $e){ $r['ERR']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
