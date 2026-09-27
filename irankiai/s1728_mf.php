<?php
/** Plugin Name: TEMP PS S1728mf read-only: dingusios prekių nuotraukos */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1728mf'])) return; $r=['v'=>'S1728mf']; global $wpdb; $P=$wpdb->prefix; @set_time_limit(170);
  try{
    $up=wp_get_upload_dir();
    $info=function($pid) use($wpdb,$P,$up){ $t=(int)get_post_meta($pid,'_thumbnail_id',true); $a=$t?get_post($t):null; $f=$t?get_post_meta($t,'_wp_attached_file',true):''; $md=$t?wp_get_attachment_metadata($t):null; $th=''; if($md && !empty($md['sizes']['woocommerce_thumbnail']['file'])) $th=dirname($up['basedir'].'/'.$f).'/'.$md['sizes']['woocommerce_thumbnail']['file'];
      return ['pid'=>$pid,'pav'=>html_entity_decode(get_the_title($pid)),'st'=>get_post_status($pid),'mod'=>get_post_field('post_modified',$pid),'thumb'=>$t,'att'=>$a?['st'=>$a->post_status,'parent'=>$a->post_parent,'mod'=>$a->post_modified,'type'=>$a->post_mime_type]:null,'failas'=>$f,'failas_yra'=>$f?file_exists($up['basedir'].'/'.$f):null,'thumb_failas_yra'=>$th?file_exists($th):null,'galerija'=>get_post_meta($pid,'_product_image_gallery',true),'dp_pakai'=>$wpdb->get_col($wpdb->prepare("SELECT post_id FROM {$P}postmeta WHERE meta_key='_dp_base_product_id' AND meta_value=%d",$pid))]; };
    $r['19089']=$info(19089);
    foreach([16295,19098,19092,19095,19104,16305,16311,16317,16302,18655] as $i) $r['kiti'][$i]=$info($i);
    // visos publish prekės be veikiančios nuotraukos
    $ids=$wpdb->get_col("SELECT ID FROM {$P}posts WHERE post_type='product' AND post_status='publish'");
    $be=[]; $cnt=['viso'=>count($ids),'be_thumb_id'=>0,'att_nera'=>0,'failo_nera'=>0];
    foreach($ids as $id){ $t=(int)get_post_meta($id,'_thumbnail_id',true); $why='';
      if(!$t){ $cnt['be_thumb_id']++; $why='nėra _thumbnail_id'; }
      else { $a=get_post($t); if(!$a||$a->post_type!=='attachment'){ $cnt['att_nera']++; $why='attachment #'.$t.' nėra'; } else { $f=get_post_meta($t,'_wp_attached_file',true); if(!$f||!file_exists($up['basedir'].'/'.$f)){ $cnt['failo_nera']++; $why='failo nėra '.$f; } } }
      if($why) $be[]=['id'=>(int)$id,'pav'=>mb_substr(html_entity_decode(get_the_title($id)),0,60),'kodel'=>$why,'mod'=>get_post_field('post_modified',$id),'dp'=>get_post_meta($id,'_dp_base_product_id',true)?:'','gen'=>get_post_meta($id,'_ps_s1725_gen',true)?:''];
    }
    $r['suvestine']=$cnt; usort($be,function($a,$b){return strcmp($b['mod'],$a['mod']);}); $r['be_nuotraukos']=array_slice($be,0,120);
    // šiukšlinėje / neseniai trinti produktai ir attachmentai
    $r['siuksline_produktai']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$P}posts WHERE post_type='product' AND post_status='trash'");
    $r['siuksline_pvz']=$wpdb->get_results("SELECT p.ID,p.post_title,p.post_modified, m.meta_value tr FROM {$P}posts p LEFT JOIN {$P}postmeta m ON m.post_id=p.ID AND m.meta_key='_wp_trash_meta_time' WHERE p.post_type='product' AND p.post_status='trash' ORDER BY p.post_modified DESC LIMIT 15",ARRAY_A);
    $r['attach_publish_statusas']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$P}posts WHERE post_type='attachment' AND post_status NOT IN ('inherit','private')");
    // max attachment ID ir tarpai (ištrinti) aplink 19089 thumb
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE); exit;
}, 1);
