<?php
/** Plugin Name: TEMP PS S1721t read-only: MnM rinkiniu kompozicijos — attachmentai, failai diske, petshop-rinkiniai funkcijos */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1721t'])) return; $r=['v'=>'S1721t']; @set_time_limit(170); global $wpdb; $up=wp_upload_dir();
  try{
    $ids=$wpdb->get_col("SELECT p.ID FROM {$wpdb->posts} p JOIN {$wpdb->term_relationships} tr ON tr.object_id=p.ID JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id=tr.term_taxonomy_id JOIN {$wpdb->terms} t ON t.term_id=tt.term_id WHERE tt.taxonomy='product_type' AND t.slug='mix-and-match' AND p.post_status IN ('publish','draft','private','trash')");
    foreach($ids as $id){ $id=(int)$id; $row=['st'=>get_post_status($id),'pav'=>mb_substr(get_the_title($id),0,40),'laukas'=>get_post_meta($id,'_ps_laukas',true),'thumb'=>(int)get_post_meta($id,'_thumbnail_id',true),'mod'=>get_post_field('post_modified',$id)];
      $att=$wpdb->get_results($wpdb->prepare("SELECT ID, post_title, post_date FROM {$wpdb->posts} WHERE post_type='attachment' AND (post_parent=%d OR post_title LIKE %s OR guid LIKE %s) ORDER BY ID DESC LIMIT 5",$id,'rink-kompozicija-'.$id.'-%','%rink-kompozicija-'.$id.'-%'),ARRAY_A);
      $row['att']=array_map(fn($a)=>[$a['ID'],$a['post_title'],substr($a['post_date'],0,16),file_exists(get_attached_file($a['ID']))?'failas':'BE FAILO'],$att);
      $disk=glob($up['basedir'].'/*/*/rink-kompozicija-'.$id.'-*.jpg'); $row['diske']=array_map(fn($f)=>basename($f).' '.date('m-d H:i',filemtime($f)),array_slice((array)$disk,0,4));
      $row['parasas']=array_keys(array_filter(get_post_meta($id),fn($v,$k)=>stripos($k,'kompoz')!==false||stripos($k,'composition')!==false||stripos($k,'_ps_rink')!==false,ARRAY_FILTER_USE_BOTH));
      $r['mnm'][$id]=$row; }
    // visos rink-kompozicija attachmentai
    $r['komp_att_viso']=$wpdb->get_results("SELECT post_status st, COUNT(*) n, MIN(post_date) nuo, MAX(post_date) iki FROM {$wpdb->posts} WHERE post_type='attachment' AND post_title LIKE 'rink-kompozicija-%' GROUP BY 1",ARRAY_A);
    $r['komp_diske_viso']=count(glob($up['basedir'].'/*/*/rink-kompozicija-*.jpg'));
    $r['komp_diske_be_thumb_dydzio']=count(glob($up['basedir'].'/*/*/rink-kompozicija-*[0-9].jpg'));
    // petshop-rinkiniai modulis
    foreach(glob(WPMU_PLUGIN_DIR.'/petshop-rinkin*.php') as $f){ $s=file_get_contents($f); preg_match('/Version:\s*([\d.]+)/',$s,$m); preg_match_all('/function\s+(\w*(?:kompoz|piesk|foto|nuotrauk|thumb|pedsak|image)\w*)\s*\(/i',$s,$fn); preg_match_all('/add_(?:action|filter)\(\s*[\'"]([^\'"]+)[\'"]/',$s,$hk);
      $r['moduliai'][basename($f)]=['v'=>$m[1]??'?','kb'=>round(strlen($s)/1024),'fn'=>array_unique($fn[1]),'hooks'=>array_slice(array_unique($hk[1]),0,25),'md5'=>md5($s)];
      foreach(['_thumbnail_id','delete_post_thumbnail','wp_delete_attachment','set_post_thumbnail','imagecropauto'] as $kw){ $r['moduliai'][basename($f)]['kw'][$kw]=substr_count($s,$kw); } }
    // snippet 539 aktyvus?
    $r['snip']=$wpdb->get_results("SELECT id, name, active, modified FROM {$wpdb->prefix}snippets WHERE id IN (539,547,550) OR name LIKE '%rinkin%' OR name LIKE '%kompoz%' LIMIT 12",ARRAY_A);
    // kas galejo trinti attachmentus: media cleaner / shortpixel / neseniai istrinti (be istrintuju lenteles — tik post count pagal data)
    $r['att_per_diena']=$wpdb->get_results("SELECT DATE(post_date) d, COUNT(*) n FROM {$wpdb->posts} WHERE post_type='attachment' AND post_title LIKE 'rink-kompozicija-%' GROUP BY 1 ORDER BY 1 DESC LIMIT 15",ARRAY_A);
    $r['plugins_media']=array_values(array_filter(get_option('active_plugins'),fn($p)=>preg_match('/media|clean|shortpixel|image|thumb|regenerat/i',$p)));
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
