<?php
/** TEMP PS S1613 run e1r — R: 4 etapo #2 LP recon (tik skaitymas): LP plugino opcijos, kur pluginas keičia užsakymo statusą į lp-*, kaip rašo _woo_lithuaniapost_shipping_status_value, cron callback'as, dev LP meta, darbalaukio vezejas */
add_action('init', function(){
  if (!isset($_GET['ps_e1r'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e1r'])); $o=array('v'=>'S1613 e1r','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $src=function($cls,$m,$max=3000){ try{ $r=new ReflectionMethod($cls,$m); $ls=file($r->getFileName()); $c=implode('',array_slice($ls,$r->getStartLine()-1,$r->getEndLine()-$r->getStartLine()+1)); return array('f'=>basename($r->getFileName()),'l'=>$r->getStartLine().'-'.$r->getEndLine(),'kodas'=>mb_substr($c,0,$max)); }catch(Throwable $e){ return 'ERR '.$e->getMessage(); } };
  // grep su kontekstu per plugino failus
  $grep=function($dir,$re,$ctx=5,$max=40,$maxlen=260){ $out=array(); $n=0; $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir)); foreach($it as $fi){ if(substr($fi,-4)!=='.php') continue; $ls=file($fi); foreach($ls as $i=>$l){ if(preg_match($re,$l)){ $a=max(0,$i-$ctx); $b=min(count($ls)-1,$i+$ctx); $blk=array(); for($j=$a;$j<=$b;$j++){ $blk[]=($j+1).($j===$i?'>':':').' '.mb_substr(rtrim($ls[$j]),0,$maxlen); } $out[]=array('f'=>str_replace($dir.'/','',$fi).':'.($i+1),'k'=>$blk); if(++$n>=$max) return $out; } } } return $out; };
  try{
  if($f==='R'){
    $dirs=array_map('basename',glob(WP_PLUGIN_DIR.'/woo-lithuaniapost*')?:array()); $o['lp_dirs']=$dirs; $D=WP_PLUGIN_DIR.'/'.($dirs[0]??'woo-lithuaniapost-main');
    $o['lp_active']=is_plugin_active(($dirs[0]??'x').'/woo-lithuaniapost.php'); $o['lp_ver']=null; foreach(glob($D.'/*.php') as $fi){ if(preg_match('/Version:\s*([0-9.]+)/',file_get_contents($fi),$m)){ $o['lp_ver']=$m[1]; break; } }
    // 1. opcijos lpsettings_* (slaptažodžius maskuojam)
    $o['opcijos']=array(); foreach($wpdb->get_results("SELECT option_name n, option_value v FROM {$p}options WHERE option_name LIKE 'lpsettings%' OR option_name LIKE '%lithuaniapost%' ORDER BY option_name",ARRAY_A) as $r){ $v=$r['v']; if(preg_match('/pass|secret|token|key/i',$r['n'])) $v='***'.strlen($v); $o['opcijos'][$r['n']]=mb_substr(is_serialized($v)?wp_json_encode(maybe_unserialize($v)):$v,0,300); }
    // 2. kur pluginas keičia užsakymo statusą
    $o['update_status']=$grep($D,'/->(update_status|set_status)\s*\(/',6,40);
    // 3. kur rašo shipping_status_value ir kaip nusprendžia reikšmę
    $o['status_value_rasymas']=$grep($D,'/_woo_lithuaniapost_shipping_status_value/',6,25);
    // 4. cron callback'as
    $o['cron_hook']=$grep($D,'/woo_lithuaniapost_update_tracking_status|sync_tracking_data/',4,20);
    // 5. nustatymų „Never“ naudojimas
    $o['event_opcijos']=$grep($D,'/event_to_send_tracking_email|event_to_change_status_to_completed/',6,20);
    // 6. lp-* statusų registracija + įvykių žemėlapis
    $o['statusai_reg']=$grep($D,'/register_post_status|wc-lp-/',2,30,200);
    $o['lp_on_the_way']=$grep($D,'/lp-on-the-way|lp-delivered|lp-courier-called|lp-parcel-created/',3,30,200);
    // 7. WC statusai gyvi
    $o['wc_statusai']=array_keys(wc_get_order_statuses());
    // 8. dev LP meta
    $o['lp_meta']=$wpdb->get_results("SELECT meta_key k, COUNT(*) n FROM {$p}wc_orders_meta WHERE meta_key LIKE '%lithuaniapost%' GROUP BY meta_key",ARRAY_A);
    $o['lp_uzs']=$wpdb->get_results("SELECT m.order_id id, o.status, m.meta_key k, LEFT(m.meta_value,120) v FROM {$p}wc_orders_meta m JOIN {$p}wc_orders o ON o.id=m.order_id WHERE m.meta_key IN ('_woo_lithuaniapost_barcode','_woo_lithuaniapost_shipping_status_value','_woo_lithuaniapost_lpexpress_terminal_id','_woo_lithuaniapost_shipping_method') ORDER BY m.order_id DESC LIMIT 40",ARRAY_A);
    $o['lp_status_uzs']=$wpdb->get_results("SELECT id, status, date_created_gmt FROM {$p}wc_orders WHERE status LIKE 'wc-lp-%' ORDER BY id DESC LIMIT 20",ARRAY_A);
    // 9. darbalaukio vezejas + desk vezejas
    $o['desk_vezejas']=$src('Petshop_Desk','vezejas',1500);
    $o['dl_d_src']=$src('Petshop_Darbalaukis','d',1200);
    // 10. LP siuntimo metodai
    $o['ship_methods']=$wpdb->get_col("SELECT DISTINCT method_id FROM {$p}woocommerce_shipping_zone_methods");
    $o['lp_metodai_uzs']=$wpdb->get_results("SELECT oi.order_id id, oi.order_item_name n, om.meta_value mid FROM {$p}woocommerce_order_items oi JOIN {$p}woocommerce_order_itemmeta om ON om.order_item_id=oi.order_item_id AND om.meta_key='method_id' WHERE oi.order_item_type='shipping' AND om.meta_value LIKE '%lithuania%' ORDER BY oi.order_id DESC LIMIT 10",ARRAY_A);
    $o['ship_method_ids_visi']=$wpdb->get_results("SELECT om.meta_value mid, COUNT(*) n FROM {$p}woocommerce_order_items oi JOIN {$p}woocommerce_order_itemmeta om ON om.order_item_id=oi.order_item_id AND om.meta_key='method_id' WHERE oi.order_item_type='shipping' GROUP BY om.meta_value",ARRAY_A);
    // 11. cron eilė LP
    $cr=_get_cron_array(); $o['cron']=array(); foreach($cr as $ts=>$hooks){ foreach($hooks as $h=>$ev){ if(preg_match('/lithuaniapost|^ps_venipak|ps_velav/i',$h)){ foreach($ev as $e){ $o['cron'][]=array('h'=>$h,'kada'=>gmdate('Y-m-d H:i',$ts),'sched'=>$e['schedule']??'once'); } } } }
    $o['tz']=array('wp_tz'=>wp_timezone_string(),'now_local'=>current_time('mysql'));
    $o['lp_klases']=array(); foreach(get_declared_classes() as $c){ if(stripos($c,'lithuaniapost')!==false) $o['lp_klases'][]=$c; }
  }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $J($o);
},99);
