<?php
/** TEMP PS S1676 run b — krepšelio šablonų struktūra + From/Reply-To. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676b'])) return; global $wpdb; $p=$wpdb->prefix; $wpdb->suppress_errors(true); $o=array('v'=>'S1676 b');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $t='Petshop_Laiskai_Turinys';
  foreach(array('lentele','paskelbtas','juodrastis','versijos','issaugoti','paskelbti','kintamieji','renderinti') as $m){ if(method_exists($t,$m)){ $r=new ReflectionMethod($t,$m); $ps=array(); foreach($r->getParameters() as $pp) $ps[]=($pp->isOptional()?'?':'').$pp->getName(); $o['sig'][$m]=($r->isStatic()?'static ':'').implode(',',$ps); } }
  try{ $o['lentele']=call_user_func(array($t,'lentele')); }catch(Throwable $e){ $o['lentele_err']=$e->getMessage(); }
  $tb=is_string($o['lentele'])?$o['lentele']:'';
  if($tb){ $o['stulp']=$wpdb->get_col("SHOW COLUMNS FROM $tb",0);
    $o['eil']=$wpdb->get_results("SELECT * FROM $tb WHERE flow IN ('cart_abandoned','cart_abandoned_2') ORDER BY flow, id",ARRAY_A);
    foreach($o['eil'] as &$e){ foreach($e as $k=>&$v){ if(is_string($v)&&strlen($v)>1500) $v=mb_substr($v,0,1500).'…'; } } }
  foreach(array('cart_abandoned','cart_abandoned_2') as $f){ try{ $o['pask'][$f]=call_user_func(array($t,'paskelbtas'),$f); }catch(Throwable $e){ $o['pask_err'][$f]=$e->getMessage(); } }
  $o['from']=array('wp_mail_from'=>apply_filters('wp_mail_from','x@x'),'from_name'=>apply_filters('wp_mail_from_name','x'),'smtp_from'=>get_option('wp_mail_smtp'),'wc_from'=>get_option('woocommerce_email_from_address'));
  $o['dispatch_cls']=array(); foreach(get_declared_classes() as $c){ if(stripos($c,'Petshop_Laisk')!==false||stripos($c,'Dispatch')!==false) $o['dispatch_cls'][]=$c; }
  // kur dedami headers krepšelio laiškams
  foreach(array(WP_PLUGIN_DIR.'/petshop-core/includes',WPMU_PLUGIN_DIR) as $d){ foreach(glob($d.'/*laisk*.php') as $f){ $s=file_get_contents($f); if(preg_match_all('/Reply-To[^\n]{0,120}/i',$s,$m)) $o['replyto'][basename($f)]=$m[0]; } }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
