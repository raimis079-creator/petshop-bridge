<?php
/** Plugin Name: TEMP PS S1722a read-only: DP paku kainu sinchronizacijos recon — kas raso kainas, sale kainos, feed'ai, 572 kurimo kodas */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1722a'])) return; $r=['v'=>'S1722a']; global $wpdb; $P=$wpdb->prefix; @set_time_limit(120);
  $grep=function($s,$pat,$ctx=150,$max=16){ preg_match_all('#[^\n]{0,'.$ctx.'}('.$pat.')[^\n]{0,'.$ctx.'}#',$s,$m); return array_slice(array_map('trim',$m[0]),0,$max); };
  try{
    // A. kas raso kainas (mu-plugins, plugins/petshop-*, tema, aktyvus snippetai)
    $files=array_merge(glob(WPMU_PLUGIN_DIR.'/*.php'),glob(WP_PLUGIN_DIR.'/petshop-*/*.php'),glob(WP_PLUGIN_DIR.'/petshop-*/includes/*.php'),glob(get_stylesheet_directory().'/*.php'));
    foreach($files as $f){ $s=file_get_contents($f); if(preg_match("/set_regular_price\(|set_sale_price\(|set_price\(|update_post_meta\([^)]*'_(regular_)?price'/",$s)){ $r['kainas_raso'][str_replace(ABSPATH,'',$f)]=$grep($s,"Plugin Name|set_regular_price\(|set_sale_price\(|set_price\(|update_post_meta\([^)]*'_(regular_)?price'|_manual_price_override",130,10); } }
    $sn=$wpdb->get_results("SELECT id,name FROM {$P}snippets WHERE active=1 AND (code LIKE '%set_regular_price%' OR code LIKE '%_regular_price%' OR code LIKE '%set_price(%')",ARRAY_A);
    foreach((array)$sn as $x){ $code=$wpdb->get_var($wpdb->prepare("SELECT code FROM {$P}snippets WHERE id=%d",$x['id'])); $r['snip_kainos'][$x['id'].' '.$x['name']]=$grep($code,"set_regular_price\(|set_sale_price\(|set_price\(|update_post_meta\([^)]*'_(regular_)?price'|add_action\(|add_filter\(",120,10); }
    // WPAI importu kainu laukai
    foreach($wpdb->get_results("SELECT id,name,options FROM {$P}pmxi_imports",ARRAY_A) as $im){ $o=@unserialize($im['options']); $r['wpai'][$im['id'].' '.$im['name']]=['single_product_regular_price'=>$o['single_product_regular_price']??null,'single_product_sale_price'=>$o['single_product_sale_price']??null,'is_update_price'=>$o['is_update_product_price']??null,'update_all'=>$o['update_all_data']??null,'is_update_custom_fields'=>$o['is_update_custom_fields']??null,'custom_fields'=>array_slice((array)($o['custom_name']??[]),0,20)]; }
    // B. sale kainos ir override
    $ids=$wpdb->get_col("SELECT post_id FROM {$P}postmeta WHERE meta_key='_dp_base_product_id' AND meta_value<>''");
    $bases=$wpdb->get_col("SELECT DISTINCT meta_value FROM {$P}postmeta WHERE meta_key='_dp_base_product_id' AND meta_value<>''");
    $in=implode(',',array_map('intval',$bases));
    $r['baziu_sale']=$wpdb->get_results("SELECT post_id, meta_value FROM {$P}postmeta WHERE post_id IN ($in) AND meta_key='_sale_price' AND meta_value<>''",ARRAY_A);
    $r['baziu_override']=$wpdb->get_var("SELECT COUNT(*) FROM {$P}postmeta WHERE post_id IN ($in) AND meta_key='_manual_price_override' AND meta_value='yes'");
    $inp=implode(',',array_map('intval',$ids));
    $r['paku_override']=$wpdb->get_var("SELECT COUNT(*) FROM {$P}postmeta WHERE post_id IN ($inp) AND meta_key='_manual_price_override' AND meta_value='yes'");
    $r['paku_nuolaida_meta']=$wpdb->get_var("SELECT COUNT(*) FROM {$P}postmeta WHERE meta_key='_dp_nuolaida_proc'");
    $r['paku_sale']=$wpdb->get_results("SELECT post_id, meta_value FROM {$P}postmeta WHERE post_id IN ($inp) AND meta_key IN ('_sale_price','_sku','_ps_dydzio_seima','_ps_sandelis') AND meta_value<>''",ARRAY_A);
    $r['paku_pak_dydis']=$wpdb->get_results("SELECT tr.object_id pid, t.name FROM {$P}term_relationships tr JOIN {$P}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id JOIN {$P}terms t ON t.term_id=tt.term_id WHERE tt.taxonomy='pa_pakuotes_dydis' AND tr.object_id IN ($inp)",ARRAY_A);
    // sausas maistas: kiek prekiu su sale kaina (ar sale kainos apskritai naudojamos)
    $r['sale_viso_publish']=$wpdb->get_var("SELECT COUNT(*) FROM {$P}postmeta pm JOIN {$P}posts p ON p.ID=pm.post_id WHERE pm.meta_key='_sale_price' AND pm.meta_value<>'' AND p.post_status='publish' AND p.post_type='product'");
    $r['sale_pvz']=$wpdb->get_results("SELECT pm.post_id, LEFT(p.post_title,50) t, pm.meta_value sale, (SELECT meta_value FROM {$P}postmeta WHERE post_id=pm.post_id AND meta_key='_regular_price') reg FROM {$P}postmeta pm JOIN {$P}posts p ON p.ID=pm.post_id WHERE pm.meta_key='_sale_price' AND pm.meta_value<>'' AND p.post_status='publish' AND p.post_type='product' LIMIT 8",ARRAY_A);
    // lookup lenteles atitikimas pakams
    $r['paku_lookup']=$wpdb->get_results("SELECT l.product_id, l.min_price, l.max_price, l.onsale, l.stock_status, (SELECT meta_value FROM {$P}postmeta WHERE post_id=l.product_id AND meta_key='_price') pr FROM {$P}wc_product_meta_lookup l WHERE l.product_id IN ($inp)",ARRAY_A);
    // C. feed'ai: pluginas — prekiu atranka; ar pakai feed'uose
    $ff=WP_PLUGIN_DIR.'/petshop-feeds/petshop-feeds.php';
    if(is_file($ff)){ $s=file_get_contents($ff); $r['feeds_head']=mb_substr($s,0,3500); $r['feeds_atranka']=$grep($s,"post_status|WP_Query|SELECT |exclude|praleis|skip|continue;|_dp_|visibility|catalog_visibility|exclude-from|file_put_contents|uploads|\.xml'|feed_url|home_url",170,40); $r['feeds_funcs']=$grep($s,"function \w+\(",60,60); }
    foreach(glob(WP_PLUGIN_DIR.'/petshop-feeds/*') as $f) $r['feeds_dir'][]=basename($f).' '.filesize($f);
    $up=wp_upload_dir()['basedir'];
    foreach(array_merge(glob($up.'/*feed*'),glob($up.'/feeds/*'),glob($up.'/petshop-feeds/*'),glob($up.'/*.xml')) as $f){ if(is_file($f)){ $s=file_get_contents($f); $hit=[]; foreach([36002,36003,35096,35856,36301] as $pid){ if(preg_match('#<g:id>'.$pid.'</g:id>|<id>'.$pid.'</id>|/\?p='.$pid.'|>'.$pid.'<#',$s)) $hit[]=$pid; } $r['feed_failai'][str_replace($up,'',$f)]=['dydis'=>filesize($f),'mtime'=>date('Y-m-d H:i',filemtime($f)),'items'=>substr_count($s,'<item>'),'pakai_rasti'=>$hit,'pirmas_id'=>preg_match('#<g:id>([^<]+)#',$s,$m)?$m[1]:null]; } }
    $r['feed_opcijos']=$wpdb->get_results("SELECT option_name, LEFT(option_value,200) v FROM {$P}options WHERE option_name LIKE '%feed%' AND option_name NOT LIKE '_transient%' LIMIT 20",ARRAY_A);
    // D. 572 kurimo kodas (pavadinimas, slug, sku, kaina, nuotrauka, kategorijos)
    $c=$wpdb->get_var("SELECT code FROM {$P}snippets WHERE id=572"); $i=strpos($c,"wp_ajax_petshop_dp_create"); $r['s572_create']=$i!==false?mb_substr($c,$i,4200):null;
    $c7=$wpdb->get_var("SELECT code FROM {$P}snippets WHERE id=567"); $r['s567_head']=mb_substr($c7,0,1800);
    $c3=$wpdb->get_var("SELECT code FROM {$P}snippets WHERE id=573"); $r['s573_grep']=$grep($c3,"add_action|add_filter|function|_dp_pack_qty|thumbnail|image",120,14);
    // E. kainodara: VF/ZB kainu taisykles
    foreach($files as $f){ $s=file_get_contents($f); if(preg_match('/antkain|kainodar|price_rule|marza_proc|markup/i',$s) && preg_match('/set_regular_price|_regular_price/',$s)) $r['kainodara'][str_replace(ABSPATH,'',$f)]=$grep($s,"Plugin Name|Version|antkain|kainodar|markup|add_action\(|add_filter\(|pmxi_",130,14); }
    $r['dp_sausas_kandidatai']=$wpdb->get_var("SELECT COUNT(*) FROM {$P}postmeta WHERE meta_key='_ps_dydzio_seima' AND meta_value<>''");
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
