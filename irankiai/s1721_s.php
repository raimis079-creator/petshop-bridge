<?php
/** Plugin Name: TEMP PS S1721s read-only: rinkiniu nuotraukos (thumb, failas, URL kodas, kategorijos psl. HTML) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1721s'])) return; $f=$_GET['ps_s1721s']; $r=['v'=>'S1721s','faze'=>$f]; @set_time_limit(170); global $wpdb;
  $ua=['timeout'=>20,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-s1721','cookies'=>['ps_js'=>'1']];
  try{
    $cats=['rinkiniai','konservu-rinkiniai','kramtalu-rinkiniai','skanestu-rinkiniai'];
    $up=wp_upload_dir();
    foreach($cats as $c){ $t=get_term_by('slug',$c,'product_cat'); if(!$t){ $r['kat'][$c]='NERA'; continue; }
      $ids=get_posts(['post_type'=>'product','post_status'=>'publish','numberposts'=>60,'fields'=>'ids','tax_query'=>[['taxonomy'=>'product_cat','field'=>'slug','terms'=>$c]]]);
      $rows=[]; foreach($ids as $id){ $p=wc_get_product($id); $tid=get_post_thumbnail_id($id); $file=$tid?get_attached_file($tid):''; $src=$tid?wp_get_attachment_image_src($tid,'woocommerce_thumbnail'):null; $meta=$tid?wp_get_attachment_metadata($tid):null;
        $row=['id'=>$id,'tipas'=>$p?$p->get_type():'?','thumb'=>(int)$tid,'failas'=>$file?(file_exists($file)?'yra':'NERA '.basename($file)):'-','thumb_url'=>$src?$src[0]:'','thumb_failas'=>'-','gal'=>$p?count($p->get_gallery_image_ids()):0,'mod'=>get_post_field('post_modified',$id)];
        if($src){ $rel=str_replace($up['baseurl'],'',$src[0]); $row['thumb_failas']=file_exists($up['basedir'].$rel)?'yra':'NERA'; }
        if($tid&&!$meta) $row['meta']='NERA';
        $rows[]=$row; }
      $r['kat'][$c]=['viso'=>count($ids),'be_thumb'=>count(array_filter($rows,fn($x)=>!$x['thumb'])),'failo_nera'=>count(array_filter($rows,fn($x)=>strpos($x['failas'],'NERA')===0)),'thumb_failo_nera'=>count(array_filter($rows,fn($x)=>$x['thumb_failas']==='NERA')),'eil'=>array_values(array_filter($rows,fn($x)=>!$x['thumb']||strpos($x['failas'],'NERA')===0||$x['thumb_failas']==='NERA'||isset($x['meta'])))];
      // kategorijos HTML
      $rs=wp_remote_get(get_term_link($t).'?ps_nocache='.time(),$ua); $h=wp_remote_retrieve_body($rs);
      preg_match_all('/<div class="box-image">.*?<img[^>]+>/s',$h,$mm); $imgs=$mm[0]; $pl=0; $nosrc=0; $srcs=[];
      foreach($imgs as $im){ if(strpos($im,'placeholder')!==false) $pl++; if(!preg_match('/\ssrc="([^"]+)"/',$im,$s)||strpos($s[1],'data:')===0){ $nosrc++; } else $srcs[]=$s[1]; }
      $r['html'][$c]=['code'=>wp_remote_retrieve_response_code($rs),'box_image'=>count($imgs),'placeholder'=>$pl,'be_src'=>$nosrc,'pvz'=>array_slice($srcs,0,3),'pirmas_img'=>isset($imgs[0])?mb_substr($imgs[0],0,400):''];
      // ar nuotrauku URL atsako
      $kodai=[]; foreach(array_slice(array_unique($srcs),0,6) as $u){ $x=wp_remote_head($u,$ua); $kodai[basename($u)]=is_wp_error($x)?'ERR':wp_remote_retrieve_response_code($x); } $r['html'][$c]['img_kodai']=$kodai;
    }
    // MnM tipo prekes visur: kiek be thumb
    $r['mnm']=$wpdb->get_results("SELECT p.ID, p.post_title, (SELECT meta_value FROM {$wpdb->postmeta} m WHERE m.post_id=p.ID AND m.meta_key='_thumbnail_id') thumb FROM {$wpdb->posts} p JOIN {$wpdb->term_relationships} tr ON tr.object_id=p.ID JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id=tr.term_taxonomy_id JOIN {$wpdb->terms} t ON t.term_id=tt.term_id WHERE tt.taxonomy='product_type' AND t.slug IN ('mix-and-match','grouped','bundle') AND p.post_status='publish' HAVING thumb IS NULL OR thumb='' OR thumb='0' LIMIT 30",ARRAY_A);
    // neseniai pakeisti attachmentai / istrinti
    $r['attach_trinta_24h']=$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->postmeta} m LEFT JOIN {$wpdb->posts} a ON a.ID=m.meta_value WHERE m.meta_key='_thumbnail_id' AND a.ID IS NULL");
    $r['thumb_be_attach_pvz']=$wpdb->get_col("SELECT m.post_id FROM {$wpdb->postmeta} m JOIN {$wpdb->posts} p ON p.ID=m.post_id AND p.post_type='product' AND p.post_status='publish' LEFT JOIN {$wpdb->posts} a ON a.ID=m.meta_value WHERE m.meta_key='_thumbnail_id' AND a.ID IS NULL LIMIT 20");
    $lf=ini_get('error_log'); if($lf&&is_file($lf)){ $sz=filesize($lf); $h2=fopen($lf,'r'); fseek($h2,max(0,$sz-6000)); $lines=array_filter(explode("\n",stream_get_contents($h2))); $r['log_img']=array_values(array_filter($lines,fn($l)=>stripos($l,'image')!==false||stripos($l,'thumb')!==false||stripos($l,'attach')!==false)); fclose($h2); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
