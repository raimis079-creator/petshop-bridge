<?php
/** Plugin Name: TEMP PS S1721l read-only: DP paku (daugiau=pigiau) mechanizmas — kas kuria, kaina, nuotraukos, likuciai, feed */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1721l'])) return; $r=['v'=>'S1721l']; global $wpdb; $P=$wpdb->prefix;
  $grep=function($s,$pat,$ctx=170,$max=18){ preg_match_all('#[^\n]{0,'.$ctx.'}('.$pat.')[^\n]{0,'.$ctx.'}#',$s,$m); return array_slice(array_map('trim',$m[0]),0,$max); };
  try{
    // 1. kur kodas
    foreach(array_merge(glob(WPMU_PLUGIN_DIR.'/*.php'),glob(WP_PLUGIN_DIR.'/petshop-*/*.php'),glob(WP_PLUGIN_DIR.'/petshop-*/includes/*.php'),glob(get_stylesheet_directory().'/*.php')) as $f){ $s=file_get_contents($f); if(preg_match('/_dp_pack_qty|_dp_base_product_id|psc-eco-band|daugiau-pigiau|daugiau=pigiau/i',$s)){ $r['failai'][str_replace(ABSPATH,'',$f)]=$grep($s,'Plugin Name|_dp_pack_qty|_dp_base_product_id|psc-eco-band|psc-qty|daugiau-pigiau|_regular_price|_price|set_regular_price|set_price|nuolaid|procent|discount|wp_insert_post|wc_get_product_object|set_image_id|_thumbnail_id|feed|manage_stock|get_stock',150,24); } }
    $sn=$wpdb->get_results("SELECT id,name,active FROM {$P}snippets WHERE code LIKE '%_dp_pack_qty%' OR code LIKE '%_dp_base_product_id%' OR code LIKE '%psc-eco-band%' OR code LIKE '%daugiau-pigiau%'",ARRAY_A); $r['snippetai']=$sn;
    foreach((array)$sn as $x){ $code=$wpdb->get_var($wpdb->prepare("SELECT code FROM {$P}snippets WHERE id=%d",$x['id'])); $r['snip_'.$x['id']]=$grep($code,'Plugin Name|\*\s*S\d{3,4}|_dp_pack_qty|_dp_base_product_id|psc-eco-band|_regular_price|_price|set_regular_price|set_price|nuolaid|procent|discount|wp_insert_post|set_image_id|_thumbnail_id|manage_stock|get_stock|add_action|add_filter',150,30); }
    // 2. visi DP pakai: baze, kiekis, kaina vs 2x baze, nuotrauka, statusas, seima
    $ids=$wpdb->get_col("SELECT post_id FROM {$P}postmeta WHERE meta_key='_dp_base_product_id' AND meta_value<>''");
    foreach($ids as $id){ $p=wc_get_product($id); if(!$p) continue; $b=(int)get_post_meta($id,'_dp_base_product_id',true); $bp=wc_get_product($b); $qty=(int)get_post_meta($id,'_dp_pack_qty',true);
      $r['pakai'][]=[$id,$p->get_status(),$p->get_type(),mb_substr($p->get_name(),0,60),'base'=>$b,'qty'=>$qty,'kaina'=>$p->get_regular_price().'/'.$p->get_price(),'baze_kaina'=>$bp?$bp->get_regular_price().'/'.$bp->get_price():'?','nuol_%'=>($bp&&$qty&&(float)$bp->get_price()>0)?round((1-(float)$p->get_price()/($qty*(float)$bp->get_price()))*100,1):null,'img'=>get_post_thumbnail_id($id).'/'.($bp?get_post_thumbnail_id($b):'?'),'stock'=>$p->get_manage_stock().'/'.$p->get_stock_status(),'sku'=>$p->get_sku(),'cats'=>implode(',',wp_get_object_terms($id,'product_cat',['fields'=>'slugs'])),'sandelis'=>get_post_meta($id,'_ps_sandelis',true),'src'=>$wpdb->get_var($wpdb->prepare("SELECT GROUP_CONCAT(CONCAT(source,':',stock_qty)) FROM {$P}ps_sources WHERE product_id=%d",$id)),'sukurta'=>get_post_field('post_date',$id),'meta_dp'=>$wpdb->get_results($wpdb->prepare("SELECT meta_key,LEFT(meta_value,40) v FROM {$P}postmeta WHERE post_id=%d AND (meta_key LIKE '_dp%%' OR meta_key LIKE '_ps_dp%%' OR meta_key LIKE '%%pack%%')",$id),ARRAY_A)]; }
    $r['dp_viso']=count($ids);
    // 3. MnM rinkiniai su DP?
    $r['mnm']=$wpdb->get_var("SELECT COUNT(*) FROM {$P}term_relationships tr JOIN {$P}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id JOIN {$P}terms t ON t.term_id=tt.term_id WHERE tt.taxonomy='product_type' AND t.slug='mix-and-match'");
    // 4. feed: ar DP pakai google feede
    $ff=WP_PLUGIN_DIR.'/petshop-feeds/petshop-feeds.php'; if(is_file($ff)) $r['feeds_dp']=$grep(file_get_contents($ff),'_dp_|daugiau|pack|pakas|ne_reklamai|custom_label',150,12);
    // 5. katalogo irankio ajax_pakuote
    $k=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-katalogas.php'); if(($i=strpos($k,'function ajax_pakuote'))!==false) $r['ajax_pakuote']=mb_substr($k,$i,2600);
    // 6. pardavimai: DP paku uzsakymai ir 2+ vnt to paties maiso uzsakymai (365 d istorija + WC)
    $r['dp_pard']=$wpdb->get_results("SELECT preke_id, SUM(kiekis) q, COUNT(DISTINCT uzsakymas_id) o FROM {$P}ps_ist_fakt_eilutes WHERE preke_id IN (".implode(',',array_map('intval',$ids?:[0])).") AND diena>='2025-09-26' GROUP BY preke_id",ARRAY_A);
    $r['dp_pard_wc']=$wpdb->get_results("SELECT preke_id, SUM(kiekis) q, COUNT(DISTINCT uzsakymas_id) o FROM {$P}ps_fakt_eilutes WHERE preke_id IN (".implode(',',array_map('intval',$ids?:[0])).") GROUP BY preke_id",ARRAY_A);
    $r['dvigubi_ist']=$wpdb->get_results("SELECT COUNT(*) eil, COUNT(DISTINCT uzsakymas_id) uzs, SUM(kiekis) vnt FROM {$P}ps_ist_fakt_eilutes WHERE kiekis>=2 AND diena>='2025-09-26' AND kategoriju_kelias LIKE '%sausas%' AND svoris_g>=2000",ARRAY_A);
    $r['dvigubi_ist_pvz']=$wpdb->get_results("SELECT LEFT(pavadinimas_tuo_metu,55) p, kiekis, COUNT(*) n FROM {$P}ps_ist_fakt_eilutes WHERE kiekis>=2 AND diena>='2025-09-26' AND kategoriju_kelias LIKE '%sausas%' AND svoris_g>=2000 GROUP BY 1,2 ORDER BY n DESC LIMIT 12",ARRAY_A);
    $r['sausas_viso_ist']=$wpdb->get_var("SELECT COUNT(DISTINCT uzsakymas_id) FROM {$P}ps_ist_fakt_eilutes WHERE diena>='2025-09-26' AND kategoriju_kelias LIKE '%sausas%' AND svoris_g>=2000");
    $r['svoris_g_pvz']=$wpdb->get_var("SELECT COUNT(*) FROM {$P}ps_ist_fakt_eilutes WHERE svoris_g>0 AND diena>='2025-09-26'");
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
