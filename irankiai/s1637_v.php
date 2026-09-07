<?php
/** TEMP PS S1637 valymas — T-0 pakartojimas (S1622 A + S1632 revert + S1634/S1635 opcijos; #35834 ir #35840-56 saugomi) — 6 ETAPAS testinių trynimas (planas v1.2 §1–2, Raimis 09-06 „išvalyk senus“). D: dry-run (sąrašai + skaičiai, LP kabliai). A: apply — kopija (JSON.gz į ps-backups/valymas-DATA/) → refund'ai → užsakymai po vieną `delete(true)` (LP/Venipak trynimo kabliai nuimti šioje užklausoje) → mūsų lentelės pagal sargus → WC našlaičiai → failai (perkelti į ps-backups) → opcijos. NELIESTI: vartotojai (B), ps_partijos (C), augintiniai (D), ps_ist_*, ps_dim_*, feeding, likučiai (F), skaitikliai (T-0). Q: skaičiai po. */
add_action('init', function(){
  if (!isset($_GET['ps_val37'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_val37'])); $o=array('v'=>'S1637 valymas','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(290); ini_set('memory_limit','768M');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $n=function($sql) use($wpdb){ return (int)$wpdb->get_var($sql); };
  // sargai: lentelė => [WHERE]
  $T=array(
    'ps_shipments'=>"1=1",'ps_fakt_siuntos'=>"testinis=1",'ps_fakt_uzsakymai'=>"testinis=1",'ps_fakt_eilutes'=>"testinis=1",'ps_fakt_grazinimai'=>"testinis=1",'ps_fakt_atsargos_d'=>"testinis=1",
    'ps_uzsakymu_ivykiai'=>"1=1",'ps_tiekimas_eil'=>"1=1",'ps_tiekimas'=>"1=1",'ps_plan_events'=>"1=1",'ps_carts'=>"1=1",'ps_refill_tracking'=>"1=1",'ps_email_jobs'=>"1=1",'ps_event_log'=>"1=1",'ps_action_tokens'=>"1=1",
    'ps_ataskaitu_dienos'=>"aplinka='dev'",'ps_kontrole_dienos'=>"1=1",'ps_web_ivykiai'=>"testinis=1",'ps_web_dienos'=>"testinis=1",'ps_sargas_klaidos'=>"1=1");
  $opt=array('ps_s1617_test','ps_audit_ids','ps_e3_oid','ps_e3_oid2','ps_s1621_oid','ps_s1621b_oid','ps_audit_mail','ps_dev_pastas_zurnalas','ps_e2e_ids','ps_e17_ids','ps_e2f_ids','ps_e2f_fe_id','ps_laisku_archyvas','ps_s1634_smtp_bak','ps_s1634_wc_bak','ps_s1632_seen','ps_s1636x_done');
  $exists=function($t) use($wpdb,$p){ return (bool)$wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s",$p.$t)); };
  $orders=function() use($wpdb,$p){ return array_map('intval',$wpdb->get_col("SELECT id FROM {$p}wc_orders WHERE type='shop_order' ORDER BY id")); };
  $refunds=function() use($wpdb,$p){ return array_map('intval',$wpdb->get_col("SELECT id FROM {$p}wc_orders WHERE type='shop_order_refund' ORDER BY id")); };
  try{
  if($f==='D'){
    $o['uzsakymai']=$orders(); $o['refundai']=$refunds(); $o['uzs_n']=count($o['uzsakymai']); $o['ref_n']=count($o['refundai']);
    $o['lp_uzs']=array_map('intval',$wpdb->get_col("SELECT DISTINCT order_id FROM {$p}wc_orders_meta WHERE meta_key LIKE '%lithuaniapost%' OR meta_key LIKE '%lp_%parcel%'"));
    $o['lp_meta_raktai']=$wpdb->get_col("SELECT DISTINCT meta_key FROM {$p}wc_orders_meta WHERE meta_key LIKE '%lithuaniapost%' OR meta_key LIKE '%lp_%' LIMIT 20");
    $o['vp_uzs_n']=$n("SELECT COUNT(DISTINCT order_id) FROM {$p}wc_orders_meta WHERE meta_key='_ps_siuntos'");
    // LP / Venipak kabliai trynimui
    $hooks=array(); foreach(array('woocommerce_before_delete_order','woocommerce_delete_order','before_delete_post','delete_post','woocommerce_trash_order','wp_trash_post','woocommerce_order_status_cancelled','woocommerce_cancelled_order','woocommerce_order_status_changed','woocommerce_new_order','woocommerce_checkout_order_processed','woocommerce_order_status_processing','woocommerce_payment_complete','woocommerce_thankyou') as $h){ if(empty($GLOBALS['wp_filter'][$h])) continue; foreach($GLOBALS['wp_filter'][$h]->callbacks as $pr=>$cbs){ foreach($cbs as $k=>$cb){ $fn=$cb['function']; $nm=is_array($fn)?(is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]:(is_string($fn)?$fn:'closure'); if(preg_match('/lithuania|lpexpress|lp_|venipak|shopup/i',$nm.$k)) $hooks[]=$h.' @'.$pr.' '.$nm; } } } $o['lp_vp_kabliai']=$hooks;
    $o['lp_plugin']=array_values(array_filter((array)get_option('active_plugins'),function($x){return stripos($x,'lithuania')!==false||stripos($x,'lp-')!==false||stripos($x,'venipak')!==false;}));
    foreach($T as $t=>$w){ $o['lenteles'][$t]=$exists($t)?array('viso'=>$n("SELECT COUNT(*) FROM {$p}$t"),'trinti'=>$n("SELECT COUNT(*) FROM {$p}$t WHERE $w")):'NĖRA'; }
    foreach(array('wc_orders_meta','wc_order_addresses','wc_order_operational_data','woocommerce_order_items','woocommerce_order_itemmeta','wc_order_stats','wc_order_product_lookup','wc_order_tax_lookup','wc_order_coupon_lookup','wc_customer_lookup') as $t){ $o['wc'][$t]=$exists($t)?$n("SELECT COUNT(*) FROM {$p}$t"):'NĖRA'; }
    $o['wc_nasl']=array('order_stats'=>$n("SELECT COUNT(*) FROM {$p}wc_order_stats s LEFT JOIN {$p}wc_orders w ON w.id=s.order_id WHERE w.id IS NULL"),'order_items'=>$n("SELECT COUNT(*) FROM {$p}woocommerce_order_items i LEFT JOIN {$p}wc_orders w ON w.id=i.order_id WHERE w.id IS NULL"),'product_lookup'=>$n("SELECT COUNT(*) FROM {$p}wc_order_product_lookup l LEFT JOIN {$p}wc_orders w ON w.id=l.order_id WHERE w.id IS NULL"),'tax_lookup'=>$n("SELECT COUNT(*) FROM {$p}wc_order_tax_lookup l LEFT JOIN {$p}wc_orders w ON w.id=l.order_id WHERE w.id IS NULL"));
    $up=wp_upload_dir(); foreach(array('invoice','creditnote','receipt') as $d){ $g=glob($up['basedir'].'/wcdn/'.$d.'/*.pdf')?:array(); $o['pdf'][$d]=count($g); }
    foreach($opt as $k){ $v=get_option($k); $o['opcijos'][$k]=is_array($v)?'array('.count($v).')':(is_null($v)||$v===false?'-':mb_substr((string)$v,0,30)); }
    $o['skait']=array('avpn'=>get_option('petshop_avpn_counter'),'iapv'=>get_option('petshop_iapv_counter'),'kr'=>get_option('petshop_kravpn_counter'),'ppk'=>get_option('petshop_ppk_counter'));
    $o['s1632']=array('bak_n'=>count((array)get_option('ps_s1632_bak',array())),'partijos'=>$n("SELECT COUNT(*) FROM {$p}ps_partijos WHERE pastaba LIKE 'Pradinis likutis (testas S1632)%'"));
    $o['posts_35834_rinkiniai']=$wpdb->get_results("SELECT ID,post_type,post_status FROM {$p}posts WHERE ID IN (35834) OR ID BETWEEN 35840 AND 35856",ARRAY_A);
    $o['uzs_saugomi']=array_values(array_intersect($o['uzsakymai'],array_merge(array(35834),range(35840,35856))));
    $o['posts_products_35790_35796']=$wpdb->get_results("SELECT ID,post_type,post_status FROM {$p}posts WHERE ID IN (35790,35796,35781,35782,35783,35784)",ARRAY_A);
    $J($o);
  }
  if($f==='A'){
    $ids=$orders(); $ref=$refunds(); $keep=array_merge(array(35834),range(35840,35856)); $o['saugomi_rasti']=array_values(array_intersect($ids,$keep)); $ids=array_values(array_diff($ids,$keep)); $o['pries']=array('uzs'=>count($ids),'ref'=>count($ref));
    $o['lp_barkodai']=$wpdb->get_results("SELECT order_id,meta_key,LEFT(meta_value,60) v FROM {$p}wc_orders_meta WHERE meta_key IN ('_woo_lithuaniapost_barcode','_woo_lithuaniapost_shipping_status_value','_woo_lithuaniapost_parcel_create_error')",ARRAY_A);
    $o['vp_numeriai']=$wpdb->get_results("SELECT order_id,LEFT(meta_value,200) v FROM {$p}wc_orders_meta WHERE meta_key='_ps_siuntos'",ARRAY_A);
    if(count($ids)>80){ $o['STOP']='daugiau nei 80 užsakymų — sargas'; $J($o); }
    $up=wp_upload_dir(); $bk=trailingslashit($up['basedir']).'ps-backups/valymas-'.date('Y-m-d'); wp_mkdir_p($bk);
    // 1. kopija: užsakymai (WC eksportas per get_data) + lentelės (eilutės, kurios bus trinamos)
    $dump=array(); foreach(array_merge($ref,$ids) as $id){ $x=wc_get_order($id); if($x){ $d=$x->get_data(); $d['meta']=array_map(function($m){return array($m->key,$m->value);},$x->get_meta_data()); $d['items']=array(); foreach($x->get_items(array('line_item','shipping','fee','coupon')) as $iid=>$it){ $d['items'][$iid]=array_merge($it->get_data(),array('meta'=>array_map(function($m){return array($m->key,$m->value);},$it->get_meta_data()))); } $dump[$id]=$d; } }
    $o['kopija_uzs']=file_put_contents($bk.'/wc_orders.json.gz',gzencode(wp_json_encode($dump)));
    foreach($T as $t=>$w){ if(!$exists($t)) continue; $rows=$wpdb->get_results("SELECT * FROM {$p}$t WHERE $w",ARRAY_A); if($rows){ file_put_contents($bk.'/'.$t.'.json.gz',gzencode(wp_json_encode($rows))); } $o['kopija'][$t]=count($rows); }
    foreach($opt as $k){ $v=get_option($k); if($v!==false) $ov[$k]=$v; } file_put_contents($bk.'/opcijos.json.gz',gzencode(wp_json_encode($ov??array())));
    // 2. LP / Venipak / mūsų varikliai — trynimo kabliai nuimti ŠIOJE užklausoje (jokių API kvietimų, jokių faktų/likučių judesių)
    $nuimta=array(); foreach(array('woocommerce_before_delete_order','woocommerce_delete_order','before_delete_post','delete_post','woocommerce_trash_order','wp_trash_post','woocommerce_order_status_changed','woocommerce_order_status_cancelled','woocommerce_cancelled_order','woocommerce_order_status_trash') as $h){ if(empty($GLOBALS['wp_filter'][$h])) continue; foreach($GLOBALS['wp_filter'][$h]->callbacks as $pr=>$cbs){ foreach($cbs as $k=>$cb){ $fn=$cb['function']; $nm=is_array($fn)?(is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]:(is_string($fn)?$fn:'closure'); if(preg_match('/lithuania|lpexpress|lp_|venipak|shopup|petshop|ps_|Petshop/i',$nm.$k)){ remove_filter($h,$fn,$pr); $nuimta[]=$h.' '.$nm; } } } } $o['kabliai_nuimti']=$nuimta;
    add_filter('pre_wp_mail',function(){ return false; },1); // jokių laiškų
    // 3. refund'ai → užsakymai po vieną
    $o['trinta']=array('ref'=>0,'uzs'=>0,'klaidos'=>array()); foreach($ref as $id){ try{ $x=wc_get_order($id); if($x&&$x->delete(true)) $o['trinta']['ref']++; }catch(Throwable $e){ $o['trinta']['klaidos'][]=$id.': '.$e->getMessage(); } }
    foreach($ids as $id){ try{ $x=wc_get_order($id); if($x&&$x->delete(true)) $o['trinta']['uzs']++; else $o['trinta']['klaidos'][]=$id.': delete false'; }catch(Throwable $e){ $o['trinta']['klaidos'][]=$id.': '.mb_substr($e->getMessage(),0,120); } }
    $o['liko_wc_orders']=$n("SELECT COUNT(*) FROM {$p}wc_orders");
    // 4. mūsų lentelės pagal sargus
    foreach($T as $t=>$w){ if(!$exists($t)) continue; $o['lenteles'][$t]=$wpdb->query("DELETE FROM {$p}$t WHERE $w"); }
    // 5. WC našlaičiai + customer_lookup be užsakymų (tik testiniai el. paštai; vartotojai neliečiami — B)
    $o['nasl']=array('order_stats'=>$wpdb->query("DELETE s FROM {$p}wc_order_stats s LEFT JOIN {$p}wc_orders w ON w.id=s.order_id WHERE w.id IS NULL"),'order_items'=>$wpdb->query("DELETE i FROM {$p}woocommerce_order_items i LEFT JOIN {$p}wc_orders w ON w.id=i.order_id WHERE w.id IS NULL"),'itemmeta'=>$wpdb->query("DELETE m FROM {$p}woocommerce_order_itemmeta m LEFT JOIN {$p}woocommerce_order_items i ON i.order_item_id=m.order_item_id WHERE i.order_item_id IS NULL"),'product_lookup'=>$wpdb->query("DELETE l FROM {$p}wc_order_product_lookup l LEFT JOIN {$p}wc_orders w ON w.id=l.order_id WHERE w.id IS NULL"),'tax_lookup'=>$wpdb->query("DELETE l FROM {$p}wc_order_tax_lookup l LEFT JOIN {$p}wc_orders w ON w.id=l.order_id WHERE w.id IS NULL"),'coupon_lookup'=>$exists('wc_order_coupon_lookup')?$wpdb->query("DELETE l FROM {$p}wc_order_coupon_lookup l LEFT JOIN {$p}wc_orders w ON w.id=l.order_id WHERE w.id IS NULL"):0,'orders_meta'=>$wpdb->query("DELETE m FROM {$p}wc_orders_meta m LEFT JOIN {$p}wc_orders w ON w.id=m.order_id WHERE w.id IS NULL"),'addresses'=>$wpdb->query("DELETE a FROM {$p}wc_order_addresses a LEFT JOIN {$p}wc_orders w ON w.id=a.order_id WHERE w.id IS NULL"),'opdata'=>$wpdb->query("DELETE a FROM {$p}wc_order_operational_data a LEFT JOIN {$p}wc_orders w ON w.id=a.order_id WHERE w.id IS NULL"));
    $o['customer_lookup']=$wpdb->query("DELETE c FROM {$p}wc_customer_lookup c LEFT JOIN {$p}wc_order_stats s ON s.customer_id=c.customer_id WHERE s.order_id IS NULL AND (c.email LIKE '%avesa.lt' OR c.email LIKE '%example.com' OR c.email LIKE '%gyvunai.lt' OR c.email LIKE '%test%' OR c.user_id IS NULL)");
    // 6. failai — perkelti (ne trinti)
    foreach(array('invoice','creditnote','receipt') as $d){ $g=glob($up['basedir'].'/wcdn/'.$d.'/*.pdf')?:array(); wp_mkdir_p($bk.'/wcdn/'.$d); $m=0; foreach($g as $fp){ if(rename($fp,$bk.'/wcdn/'.$d.'/'.basename($fp))) $m++; } $o['pdf'][$d]=$m; }
    // 7. opcijos
    foreach($opt as $k){ $o['opcijos'][$k]=(int)delete_option($k); }
    // 8. S1632 revert (visas bak) + partijos + lookup sync
    $bak32=get_option('ps_s1632_bak',array()); $s32=array('bak_n'=>count($bak32),'stock'=>0,'del_s'=>0,'own'=>0,'del_o'=>0);
    $pids32=array_map('intval',$wpdb->get_col("SELECT DISTINCT product_id FROM {$p}ps_partijos WHERE pastaba LIKE 'Pradinis likutis (testas S1632)%'"));
    foreach($bak32 as $pid=>$b){ $pid=(int)$pid;
      if(array_key_exists('s',$b)){ if($b['s']===''||$b['s']===false){ delete_post_meta($pid,'_stock'); $s32['del_s']++; } else { update_post_meta($pid,'_stock',$b['s']); $s32['stock']++; } }
      if(array_key_exists('o',$b)){ if($b['o']===''||$b['o']===false){ delete_post_meta($pid,'_own_stock_qty'); $s32['del_o']++; } else { update_post_meta($pid,'_own_stock_qty',(int)$b['o']); $s32['own']++; } }
    }
    $s32['partijos']=(int)$wpdb->query("DELETE FROM {$p}ps_partijos WHERE pastaba LIKE 'Pradinis likutis (testas S1632)%'");
    foreach($pids32 as $pid){ if(class_exists('Petshop_Partijos')) Petshop_Partijos::perskaiciuoti_savikaina($pid); }
    if($bak32){ $in=implode(',',array_map('intval',array_keys($bak32)));
      $wpdb->query("UPDATE {$p}wc_product_meta_lookup l LEFT JOIN {$p}postmeta m ON m.post_id=l.product_id AND m.meta_key='_stock' SET l.stock_quantity=IF(m.meta_value IS NULL OR m.meta_value='',NULL,m.meta_value) WHERE l.product_id IN ($in)"); }
    delete_option('ps_s1632_bak'); $o['s1632']=$s32;
    delete_transient('ps_juosta_skaiciai'); do_action('ps_juosta_isvalyti'); wp_cache_flush();
    $o['kopija_dir']=str_replace($up['basedir'],'',$bk); $o['kopija_failai']=count(glob($bk.'/*')); $J($o);
  }
  if($f==='Q'){
    $o['wc_orders']=$n("SELECT COUNT(*) FROM {$p}wc_orders"); foreach($T as $t=>$w){ if($exists($t)) $o['lenteles'][$t]=array($n("SELECT COUNT(*) FROM {$p}$t"),$n("SELECT COUNT(*) FROM {$p}$t WHERE $w")); }
    foreach(array('wc_orders_meta','wc_order_addresses','woocommerce_order_items','wc_order_stats','wc_customer_lookup') as $t){ $o['wc'][$t]=$n("SELECT COUNT(*) FROM {$p}$t"); }
    $up=wp_upload_dir(); foreach(array('invoice','creditnote','receipt') as $d){ $o['pdf'][$d]=count(glob($up['basedir'].'/wcdn/'.$d.'/*.pdf')?:array()); }
    $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp=time()+600; $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
    $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'logged_in',$tok))));
    $r=wp_remote_get(admin_url('admin.php?page=ps-desk&eile=klausimai'),array('cookies'=>$cs,'timeout'=>90,'sslverify'=>false)); $h=(string)wp_remote_retrieve_body($r); $o['eiles']=array('code'=>wp_remote_retrieve_response_code($r),'nav'=>mb_substr(trim(preg_replace('/\s+/',' ',wp_strip_all_tags(preg_match('/<main class="dl-main">(.*?)<div class="dl-kortele/su',$h,$mm)?$mm[1]:''))),0,140),'warning'=>substr_count($h,'<b>Warning</b>'));
    $r=wp_remote_get(admin_url('admin-ajax.php?action=heartbeat'),array('timeout'=>60,'sslverify'=>false)); $o['ping']=wp_remote_retrieve_response_code($r);
    $o['likuciai']=array(19475=>wc_get_product(19475)->get_stock_quantity(),19708=>wc_get_product(19708)->get_stock_quantity(),35357=>wc_get_product(35357)->get_stock_quantity(),'18154_av'=>Petshop_AV_Stock::qty(18154),'18599_av'=>Petshop_AV_Stock::qty(18599),'19756_av'=>Petshop_AV_Stock::qty(19756),'16889_av'=>Petshop_AV_Stock::qty(16889),'16727_av'=>Petshop_AV_Stock::qty(16727));
    $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'"); $J($o);
  }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
