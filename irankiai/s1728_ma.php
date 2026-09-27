<?php
/** Plugin Name: TEMP PS S1728ma read-only: FBT v1.7 recon */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1728ma'])) return; $r=['v'=>'S1728ma']; global $wpdb; $P=$wpdb->prefix; @set_time_limit(150);
  try{
    $f=WP_PLUGIN_DIR.'/petshop-fbt/petshop-fbt.php';
    $r['fbt']=['md5'=>@md5_file($f),'dydis'=>@filesize($f),'mtime'=>@date('Y-m-d H:i:s',filemtime($f)),'aktyvus'=>is_plugin_active('petshop-fbt/petshop-fbt.php')];
    $r['opt']=['settings'=>get_option('petshop_fbt_settings'),'cat_rules'=>get_option('petshop_fbt_cat_rules'),'pairs'=>get_option('petshop_fbt_pairs'),'copurch_info'=>get_option('ps_fbt_copirkimai_info'),'skanestai'=>get_option('ps_fbt_skanestai',null)];
    $r['manual']=$wpdb->get_results("SELECT post_id, meta_value FROM {$P}postmeta WHERE meta_key='_petshop_fbt_ids' AND meta_value NOT IN ('','a:0:{}') LIMIT 60",ARRAY_A);
    // AV Source
    if(class_exists('Petshop_AV_Source')){
      $rf=new ReflectionMethod('Petshop_AV_Source','resolve'); $file=$rf->getFileName(); $src=file($file);
      $r['av_source']=['file'=>str_replace(ABSPATH,'',$file),'md5'=>md5_file($file),'lines'=>$rf->getStartLine().'-'.$rf->getEndLine(),'kodas'=>implode('',array_slice($src,$rf->getStartLine()-1,min(120,$rf->getEndLine()-$rf->getStartLine()+1)))];
      foreach([18587,18590,17978,18560,16305,23849,17481] as $id){ $r['resolve'][$id]=['r1'=>Petshop_AV_Source::resolve($id,1),'src'=>$wpdb->get_results($wpdb->prepare("SELECT source,stock_qty,is_active FROM {$P}ps_sources WHERE product_id=%d",$id),ARRAY_A)]; }
    }
    // Užsakymo kelio variklis — kaip realiai skirstoma (ieškom Exclusion išimties)
    foreach(['petshop-av-order.php','petshop-av-source.php'] as $mf){ $p=WPMU_PLUGIN_DIR.'/'.$mf; if(file_exists($p)){ $t=file_get_contents($p); preg_match_all('/.{0,120}(exclusion|brand|gamintoj).{0,120}/iu',$t,$m); $r['kelias'][$mf]=['md5'=>md5($t),'exclusion_minimu'=>array_slice($m[0],0,12)]; } }
    // R sąrašų prekės: sandėlių likučiai (ar yra su av ir tiekėju abiem)
    $ids=[16305,16311,19098,15867,16298,19092,16317,19104,18639,18647,18632,19089,16295,18655,18125,16302,19095,17641,17644,17481,17478,17475,17469,19033,19027,19030,19036,19018,19024,34794,34797,23849,23837,23852,21647,23825,23834,22311,23858,19991,22421,26032,24539,21577,21567,21599,24005];
    foreach($ids as $id){ $o=[]; foreach($wpdb->get_results($wpdb->prepare("SELECT source,stock_qty,is_active FROM {$P}ps_sources WHERE product_id=%d",$id),ARRAY_A) as $x) $o[]=$x['source'].':'.$x['stock_qty'].($x['is_active']?'':'(x)'); $p=wc_get_product($id); $r['sarasas'][$id]=['pav'=>$p?html_entity_decode($p->get_name()):'?','st'=>$p?$p->get_status():'','kaina'=>$p?$p->get_price():'','stock'=>$p?$p->get_stock_quantity():'','src'=>implode(' ',$o),'cats'=>$p?wp_get_post_terms($id,'product_cat',['fields'=>'slugs']):[]]; }
    // kategorijų medis maistui
    foreach(['maistas-sunims','maistas-katems','skanestai-sunims','skanestai-katems','zaislai-sunims','zaislai-katems'] as $s){ $t=get_term_by('slug',$s,'product_cat'); $r['kat'][$s]=$t?['id'=>$t->term_id,'parent'=>$t->parent?get_term($t->parent)->slug:'','vaikai'=>wp_list_pluck(get_terms(['taxonomy'=>'product_cat','parent'=>$t->term_id,'hide_empty'=>false]),'slug')]:null; }
    // hook'ai
    global $wp_filter; foreach(['woocommerce_after_add_to_cart_form','woocommerce_after_cart_table','woocommerce_checkout_create_order_line_item','woocommerce_add_to_cart_redirect','wc_add_to_cart_message_html'] as $h){ $o=[]; if(isset($wp_filter[$h])) foreach($wp_filter[$h]->callbacks as $pr=>$cbs) foreach($cbs as $cb){ $f=$cb['function']; $o[]=$pr.':'.(is_array($f)?(is_object($f[0])?get_class($f[0]):$f[0]).'::'.$f[1]:(is_string($f)?$f:'closure')); } $r['hooks'][$h]=$o; }
    $r['dp_pakas_pvz']=$wpdb->get_row("SELECT post_id, meta_value base FROM {$P}postmeta WHERE meta_key='_dp_base_product_id' AND meta_value=18587 LIMIT 1",ARRAY_A);
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PRETTY_PRINT); exit;
}, 1);
