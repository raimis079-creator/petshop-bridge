<?php
/** Plugin Name: TEMP PS S1728mi nuotraukų susiejimas atgal (19089, 19092, 34913). Fazės: 1 dry, 2 daryti, 9 atstatyti */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1728mi'])) return; $f=(string)$_GET['ps_s1728mi']; $r=['v'=>'S1728mi','faze'=>$f]; @set_time_limit(120);
  $plan=[19089=>[19090,'19091'],19092=>[19093,'19094'],34913=>[34915,'34916']];
  try{
    $up=wp_get_upload_dir();
    foreach($plan as $pid=>$x){ list($thumb,$gal)=$x; $a=get_post($thumb); $file=$a?get_post_meta($thumb,'_wp_attached_file',true):'';
      $ok=$a && $a->post_type==='attachment' && $file && file_exists($up['basedir'].'/'.$file);
      $o=['pav'=>html_entity_decode(get_the_title($pid)),'buvo_thumb'=>get_post_meta($pid,'_thumbnail_id',true),'buvo_gal'=>get_post_meta($pid,'_product_image_gallery',true),'naujas_thumb'=>$thumb,'failas'=>$file,'tinka'=>$ok,'gal_att'=>array_map(function($g) use($up){ $f=get_post_meta((int)$g,'_wp_attached_file',true); return $g.':'.($f && file_exists($up['basedir'].'/'.$f)?'yra':'NĖRA'); },array_filter(explode(',',$gal)))];
      if($f==='2' && $ok){ if(get_option('ps_s1728_foto_bak')===false) update_option('ps_s1728_foto_bak',[],false); $b=get_option('ps_s1728_foto_bak'); if(!isset($b[$pid])) { $b[$pid]=['t'=>$o['buvo_thumb'],'g'=>$o['buvo_gal']]; update_option('ps_s1728_foto_bak',$b,false); }
        set_post_thumbnail($pid,$thumb); if($o['buvo_gal']==='' ) update_post_meta($pid,'_product_image_gallery',$gal); wc_delete_product_transients($pid); clean_post_cache($pid);
        $p=wc_get_product($pid); $o['dabar_img']=$p?$p->get_image_id():0; $o['dabar_gal']=get_post_meta($pid,'_product_image_gallery',true);
        if(function_exists('wpsc_delete_post_cache')) wpsc_delete_post_cache($pid); }
      if($f==='9'){ $b=get_option('ps_s1728_foto_bak',[]); if(isset($b[$pid])){ if($b[$pid]['t']==='') delete_post_meta($pid,'_thumbnail_id'); else update_post_meta($pid,'_thumbnail_id',$b[$pid]['t']); update_post_meta($pid,'_product_image_gallery',$b[$pid]['g']); clean_post_cache($pid); $o['atstatyta']=true; } }
      $r['p'][$pid]=$o; }
  }catch(Throwable $e){ $r['KLAIDA']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE); exit;
}, 1);
