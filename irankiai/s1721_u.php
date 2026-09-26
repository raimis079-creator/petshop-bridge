<?php
/** Plugin Name: TEMP PS S1721u read-only: petshop-laukai foto_atsargine + grupiu foto + Petshop_Rinkiniai::kompozicija signatura */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1721u'])) return; $r=['v'=>'S1721u']; @set_time_limit(120); global $wpdb;
  try{
    $f=WPMU_PLUGIN_DIR.'/petshop-laukai.php'; $r['laukai_yra']=is_file($f);
    if(is_file($f)){ $s=file_get_contents($f); preg_match('/Version:\s*([\d.]+)/',$s,$m); $r['laukai_v']=$m[1]??'?'; $r['laukai_md5']=md5($s);
      foreach(['woocommerce_product_get_image_id','foto_atsargine','ps_laukai_grupiu_foto','post_thumbnail_id','wp_get_attachment_image_src'] as $kw) $r['laukai_kw'][$kw]=substr_count($s,$kw);
      if(preg_match('/function\s+foto_atsargine\s*\([^)]*\)\s*\{.{0,900}/s',$s,$mm)) $r['foto_atsargine_src']=$mm[0];
      if(preg_match_all('/add_filter\(\s*[\'"]woocommerce_product_get_image_id[\'"][^;]*;/',$s,$mm2)) $r['image_id_filter']=$mm2[0];
    }
    $g=get_option('ps_laukai_grupiu_foto'); $r['grupiu_foto']=$g;
    foreach((array)$g as $k=>$aid){ $r['grupiu_foto_att'][$k]=[(int)$aid,get_post_status((int)$aid),get_post_type((int)$aid),($fp=get_attached_file((int)$aid))&&file_exists($fp)?'failas':'BE FAILO']; }
    foreach([36154,34942,34938,35782] as $id){ $p=wc_get_product($id); $r['laukas'][$id]=['grupe'=>get_post_meta($id,'_ps_laukas_grupe',true),'image_id_view'=>$p?$p->get_image_id():null,'image_id_edit'=>$p?$p->get_image_id('edit'):null,'img_html'=>$p?mb_substr(strip_tags($p->get_image('woocommerce_thumbnail'),'<img>'),0,160):'']; }
    // Petshop_Rinkiniai kompozicija
    $rf=WPMU_PLUGIN_DIR.'/petshop-rinkiniai.php'; $s2=file_get_contents($rf); preg_match('/^\s*\*\s*Version:.*$/m',$s2,$mv); $r['rink_header']=trim($mv[0]??''); preg_match('/Plugin Name:.*$/m',$s2,$mn); $r['rink_name']=trim($mn[0]??'');
    foreach(['kompozicija','kompozicija_vidine','isvalyti_pedsakus'] as $fn){ if(preg_match('/((?:public|private|protected)?\s*static\s+)?function\s+'.$fn.'\s*\([^)]*\)/',$s2,$mm3)) $r['rink_fn'][$fn]=$mm3[0]; }
    // kur kvieciama kompozicija() ir kur _thumbnail_id
    preg_match_all('/.{0,160}(?:self::|static::|\$this->)kompozicija\(.{0,120}/',$s2,$mc); $r['kompozicija_kvietimai']=array_map(fn($x)=>preg_replace('/\s+/',' ',$x),$mc[0]);
    preg_match_all('/.{0,200}_thumbnail_id.{0,120}/',$s2,$mt); $r['thumb_vietos']=array_map(fn($x)=>preg_replace('/\s+/',' ',$x),$mt[0]);
    preg_match_all('/.{0,200}_ps_rink_komp_hash.{0,160}/',$s2,$mh); $r['hash_vietos']=array_slice(array_map(fn($x)=>preg_replace('/\s+/',' ',$x),$mh[0]),0,6);
    preg_match_all('/.{0,240}wp_delete_attachment.{0,80}/',$s2,$md); $r['delete_att']=array_map(fn($x)=>preg_replace('/\s+/',' ',$x),$md[0]);
    $r['klase']=preg_match('/class\s+(\w+)/',$s2,$mk)?$mk[1]:'?';
    // 5 be thumb bet su attachmentu: attachmentu post_parent
    foreach([35392,35396,35404,35406,35408,35070,35076,35079,35085] as $id){ $r['paruosti'][$id]=['hash'=>get_post_meta($id,'_ps_rink_komp_hash',true),'komp'=>count((array)get_post_meta($id,'_petshop_component_quantities',true)),'mnm_vaikai'=>(int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$wpdb->prefix}wc_mnm_child_items WHERE container_id=%d",$id))]; }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
