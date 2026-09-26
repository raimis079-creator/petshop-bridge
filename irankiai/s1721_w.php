<?php
/** Plugin Name: TEMP PS S1721w: paruostu rinkiniu nuotraukos. 1 dry (kompozicija() logika + planas), 2 atstatyti thumb (5) + perpiesti (4), 9 atstatyti (nuimti thumb tik 4 naujiems) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1721w'])) return; $f=$_GET['ps_s1721w']; $r=['v'=>'S1721w','faze'=>$f]; @set_time_limit(170); global $wpdb;
  $SU_ATT=[35392=>35393,35396=>35397,35404=>35405,35406=>35407,35408=>35409]; $BE_ATT=[35070,35076,35079,35085]; $BAK='ps_s1721_rink_foto_bak';
  try{
    if($f==='1'){
      $s=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-rinkiniai.php');
      $p=strpos($s,'private static function kompozicija('); $r['kompozicija_head']=preg_replace('/\s+/',' ',substr($s,$p,1500));
      preg_match_all('/.{0,220}(?:set_image_id|set_post_thumbnail|delete_post_meta\([^)]*thumbnail|image_id)\b.{0,160}/',$s,$m); $r['image_vietos']=array_slice(array_map(fn($x)=>preg_replace('/\s+/',' ',$x),$m[0]),0,12);
      $p2=strpos($s,'private static function isvalyti_pedsakus('); $r['isvalyti_head']=preg_replace('/\s+/',' ',substr($s,$p2,900));
      preg_match_all('/.{0,300}isvalyti_pedsakus\(.{0,100}/',$s,$m2); $r['isvalyti_kvietimai']=array_map(fn($x)=>preg_replace('/\s+/',' ',$x),$m2[0]);
      $r['mnm_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$wpdb->prefix}wc_mnm_child_items");
      foreach($SU_ATT as $pid=>$att){ $r['su_att'][$pid]=['st'=>get_post_status($pid),'thumb'=>(int)get_post_thumbnail_id($pid),'att_st'=>get_post_status($att),'att_parent'=>(int)get_post_field('post_parent',$att),'failas'=>file_exists(get_attached_file($att))?'yra':'NERA']; }
      foreach($BE_ATT as $pid){ $r['be_att'][$pid]=['st'=>get_post_status($pid),'thumb'=>(int)get_post_thumbnail_id($pid),'hash'=>get_post_meta($pid,'_ps_rink_komp_hash',true),'vaikai'=>$wpdb->get_col($wpdb->prepare("SELECT product_id FROM {$wpdb->prefix}wc_mnm_child_items WHERE container_id=%d",$pid)),'kiekiai'=>get_post_meta($pid,'_petshop_component_quantities',true)]; }
    }
    if($f==='2'){
      $bak=get_option($BAK); if(!is_array($bak)) $bak=[];
      foreach($SU_ATT as $pid=>$att){ if(get_post_thumbnail_id($pid)) { $r['su_att'][$pid]='jau turi'; continue; } if(!in_array(get_post_status($att),['inherit','publish'])||!file_exists(get_attached_file($att))){ $r['su_att'][$pid]='att blogas'; continue; }
        $bak[(string)$pid]=0; $ok=set_post_thumbnail($pid,$att); $r['su_att'][$pid]=$ok?'thumb='.$att:'NEPAVYKO'; }
      $rm=new ReflectionMethod('Petshop_Rinkiniai','kompozicija'); $rm->setAccessible(true);
      foreach($BE_ATT as $pid){ if(get_post_thumbnail_id($pid)){ $r['be_att'][$pid]='jau turi'; continue; } $vaikai=array_map('intval',$wpdb->get_col($wpdb->prepare("SELECT product_id FROM {$wpdb->prefix}wc_mnm_child_items WHERE container_id=%d",$pid))); if(!$vaikai){ $r['be_att'][$pid]='be vaiku'; continue; }
        $bak[(string)$pid]=0; $t0=microtime(true); $res=$rm->invoke(null,$pid,$vaikai,true); $r['be_att'][$pid]=['rez'=>is_scalar($res)?$res:json_encode($res,JSON_UNESCAPED_UNICODE),'thumb'=>(int)get_post_thumbnail_id($pid),'sek'=>round(microtime(true)-$t0,1)]; }
      update_option($BAK,$bak,false);
      if(class_exists('Petshop_Cache')){ foreach(array_merge(array_keys($SU_ATT),$BE_ATT) as $pid) Petshop_Cache::preke_id($pid); }
      if(function_exists('wp_cache_clear_cache')){ wp_cache_clear_cache(); $r['supercache']='isvalytas'; }
    }
    if($f==='3'){ $ua=['timeout'=>25,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-s1721','cookies'=>['ps_js'=>'1']]; $t=get_term_by('slug','rinkiniai','product_cat'); $rs=wp_remote_get(get_term_link($t).'?ps_w='.time(),$ua); $h=wp_remote_retrieve_body($rs);
      preg_match_all('/class="product-small col[^"]*\bpost-(\d+)\b.*?<div class="box-image">.*?<img[^>]*\ssrc="([^"]+)"/s',$h,$m,PREG_SET_ORDER); foreach($m as $x){ $r['cards'][(int)$x[1]]=basename($x[2]); } $r['placeholder']=count(array_filter($r['cards']??[],fn($v)=>strpos($v,'placeholder')!==false)); }
    if($f==='9'){ $bak=get_option($BAK); foreach((array)$bak as $pid=>$v){ delete_post_thumbnail((int)$pid); } $r['nuimta']=count((array)$bak); if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache(); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
