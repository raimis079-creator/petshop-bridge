<?php
/** Plugin Name: TEMP PS S1720l — tarpinė patikra (WPAI #3, botų sargas, Super Cache) + 2.17 II recon (skaičiuoklė/FBT vieta, pakuočių šeimos) — read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1720l'])) return; $f=$_GET['ps_s1720l']; $r=['v'=>'S1720l','faze'=>$f,'t'=>date('Y-m-d H:i:s')];
  global $wpdb; $p=$wpdb->prefix; @set_time_limit(280); $mu=WPMU_PLUGIN_DIR;
  try{
  if($f==='a'){
    $r['wpai3']=$wpdb->get_results("SELECT import_id,type,time_run,summary,date FROM {$p}pmxi_history WHERE import_id=3 ORDER BY id DESC LIMIT 5",ARRAY_A);
    $r['wpai3_opt']=$wpdb->get_row("SELECT id,name,processing,executing,last_activity,imported,skipped,updated FROM {$p}pmxi_imports WHERE id=3",ARRAY_A);
    if(class_exists('Petshop_Botu_Sargas')&&method_exists('Petshop_Botu_Sargas','suvestine')) $r['botai']=Petshop_Botu_Sargas::suvestine(1);
    $d=dirname(ABSPATH).'/ps-archyvas/botu-sargas/'; foreach(glob($d.'*.log') as $fn){ $n=0;$atc=0;$ip=[]; $h=fopen($fn,'r'); while(($l=fgets($h))!==false){ $n++; if(strpos($l,' atc ')!==false||strpos($l,"\tatc\t")!==false) $atc++; if(preg_match('/(\d+\.\d+\.\d+\.\d+)/',$l,$m)) $ip[$m[1]]=1; } fclose($h); $r['log'][basename($fn)]=['eil'=>$n,'atc'=>$atc,'ip'=>count($ip)]; }
    $r['sesijos']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}woocommerce_sessions");
    $r['ps_carts_siandien']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_carts WHERE created_at>=CURDATE()"); $r['ps_carts_vakar']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_carts WHERE created_at>=CURDATE()-INTERVAL 1 DAY AND created_at<CURDATE()");
    $r['uzs_siandien']=$wpdb->get_results("SELECT status,COUNT(*) n FROM {$p}wc_orders WHERE type='shop_order' AND date_created_gmt>=UTC_DATE() GROUP BY status",ARRAY_A);
    $cd=WP_CONTENT_DIR.'/cache/supercache/petshop.lt/'; $n=0; if(is_dir($cd)){ $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($cd,FilesystemIterator::SKIP_DOTS)); foreach($it as $fi){ if($fi->isFile()&&preg_match('/index.*html/',$fi->getFilename())) $n++; if($n>20000) break; } } $r['supercache_psl']=$n;
    $r['pazadas_klaidos']=substr(file_get_contents(dirname(ABSPATH).'/logs/php_error.log'),-600);
  }
  if($f==='b'){
    // prekės puslapio elementų tvarka gyvai: h2/sections/ps-calc/FBT
    $rs=wp_remote_get(get_permalink(18560).'?ps_nocache='.time(),['timeout'=>25,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-s1720']); $b=wp_remote_retrieve_body($rs);
    preg_match_all('/<(section|div)[^>]*class="([^"]*(product-footer|ps-calc\b|ps-fbt|related|upsells|woocommerce-tabs|ps-desc-acc|ps-dydziai|ps-pakuot|product-section|ps-veisl|ps-laukai)[^"]*)"[^>]*>|<h2[^>]*>([^<]{2,60})<\/h2>/',$b,$m,PREG_OFFSET_CAPTURE);
    foreach($m[0] as $i=>$x){ $r['tvarka'][]=[$x[1],substr(preg_replace('/\s+/',' ',$x[0]),0,110)]; }
    foreach(['Dažnai perkama kartu','class="ps-calc"','product-footer','related related-products','Panašūs produktai','ps-dydziai','product-info summary','product-gallery','ps-pazadas'] as $k){ $r['ofs'][$k]=strpos($b,$k); }
    if(($i=strpos($b,'Dažnai perkama kartu'))!==false) $r['fbt_ctx']=preg_replace('/\s+/',' ',substr($b,max(0,$i-700),900));
    foreach(array_merge(glob($mu.'/*.php'),glob($mu.'/petshop-core/*.php'),glob($mu.'/petshop-core/includes/*.php')) as $fn){ $c=file_get_contents($fn); if(strpos($c,'Dažnai perkama kartu')!==false||strpos($c,'perkama kartu')!==false){ $r['fbt_failai'][]=str_replace($mu,'',$fn); if(preg_match_all('/add_action\(\s*[\'"](woocommerce_[a-z_]+)[\'"]\s*,[^;]{0,100}/',$c,$mm)) $r['fbt_hooks'][basename($fn)]=array_slice($mm[0],0,6); } }
    $sn=$wpdb->get_results("SELECT id,name FROM {$p}snippets WHERE active=1 AND (code LIKE '%perkama kartu%' OR code LIKE '%ps-calc%')",ARRAY_A); $r['fbt_snippets']=$sn;
    foreach(glob($mu.'/*.php') as $fn){ $c=file_get_contents($fn); if(preg_match('/ps-calc-head|Petshop_Calc|class-feeding|ps_calc/',$c)&&preg_match('/add_action\(\s*[\'"](woocommerce_after_single_product_summary|woocommerce_single_product_summary|woocommerce_after_single_product)[\'"]\s*,[^;]{0,120}/',$c,$mm)) $r['calc_hooks'][basename($fn)]=$mm[0]; }
    foreach(glob($mu.'/petshop-core/*.php') as $fn){ $c=file_get_contents($fn); if(preg_match_all('/add_action\(\s*[\'"](woocommerce_after_single_product_summary|woocommerce_single_product_summary|woocommerce_after_single_product)[\'"]\s*,[^;]{0,120}/',$c,$mm)) $r['core_hooks'][basename($fn)]=$mm[0]; }
    $r['dydziai']=substr(file_get_contents($mu.'/petshop-dydziai.php'),0,2500);
  }
  if($f==='c'){
    // pakuočių šeimos: top 30 parduodamų maisto prekių ir jų „broliai" (tas pats pavadinimas be svorio)
    $top=$wpdb->get_results("SELECT e.preke_id pid, SUM(e.kiekis) n, COUNT(DISTINCT e.uzsakymas_id) uzs FROM {$p}ps_fakt_eilutes e WHERE e.apmoketa_at>=NOW()-INTERVAL 90 DAY AND (e.kategoriju_kelias LIKE '%maist%' OR e.kategoriju_kelias LIKE '%kraik%') AND COALESCE(e.testinis,0)=0 GROUP BY e.preke_id ORDER BY n DESC LIMIT 30",ARRAY_A);
    $ist=$wpdb->get_results("SELECT e.wc_product_id pid, SUM(e.kiekis) n FROM {$p}ps_ist_eilutes e JOIN {$p}ps_ist_uzsakymai u ON u.id=e.uzsakymo_id WHERE u.ivykdytas=1 AND u.data>=NOW()-INTERVAL 365 DAY AND e.wc_product_id>0 GROUP BY e.wc_product_id ORDER BY n DESC LIMIT 40",ARRAY_A); $r['ist_top']=array_map(function($x){return $x['pid'].':'.$x['n'].' '.mb_substr(get_the_title((int)$x['pid']),0,50);},(array)$ist);
    if(!$top||isset($top['SQL_ERR'])){ $r['cols_eil']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_eilutes"); $r['cols_uzs']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_uzsakymai"); }
    foreach((array)$top as $t){ $pid=(int)$t['pid']; $pav=get_the_title($pid); $base=trim(preg_replace('/\b\d+(?:[.,]\d+)?(?:\s*\+\s*\d+(?:[.,]\d+)?)?\s*(kg|g)\b.*$/iu','',$pav)); $base=preg_replace('/[,\-–]\s*$/','',$base);
      $sib=$base?$wpdb->get_results($wpdb->prepare("SELECT ID,post_title FROM {$p}posts WHERE post_type='product' AND post_status='publish' AND post_title LIKE %s AND ID<>%d LIMIT 6",$wpdb->esc_like(mb_substr($base,0,28)).'%',$pid),ARRAY_A):[];
      $r['top'][]=['pid'=>$pid,'n'=>(int)$t['n'],'pav'=>mb_substr($pav,0,70),'seima'=>get_post_meta($pid,'_ps_seima',true)?:get_post_meta($pid,'_ps_dydziu_seima',true),'broliai'=>array_map(function($s){return $s['ID'].' '.mb_substr($s['post_title'],0,55);},$sib)]; }
    $r['seimos_meta']=$wpdb->get_results("SELECT meta_key,COUNT(*) n FROM {$p}postmeta WHERE meta_key LIKE '%seim%' OR meta_key LIKE '%dydz%' OR meta_key LIKE '%family%' GROUP BY meta_key",ARRAY_A);
  }
  }catch(Throwable $e){ $r['ERR']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
