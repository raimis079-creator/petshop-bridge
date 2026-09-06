<?php
/** TEMP PS S1620 run e6r — 6 ETAPO RECON (tik skaitymas, jokio trynimo): testiniai užsakymai, refund'ai, faktai, PDF, likučiai, skaitikliai, vartotojai, opcijos, kiti užsakymai DB. */
add_action('init', function(){
  if (!isset($_GET['ps_e6r'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e6r'])); $o=array('v'=>'S1620 e6r','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(250);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $ids=array_merge(range(35414,35444),array(35450),range(35771,35813)); $idl=implode(',',$ids);
  try{
  if($f==='R1'){
    $o['hpos']=get_option('woocommerce_custom_orders_table_enabled'); $o['hpos_sync']=get_option('woocommerce_custom_orders_table_data_sync_enabled');
    $o['db_uzs']=$wpdb->get_results("SELECT status,COUNT(*) n FROM {$p}wc_orders WHERE type='shop_order' GROUP BY status",ARRAY_A);
    $o['db_refund']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_orders WHERE type='shop_order_refund'");
    $o['posts_shop_order']=$wpdb->get_results("SELECT post_type,post_status,COUNT(*) n FROM {$p}posts WHERE post_type IN ('shop_order','shop_order_placehold','shop_order_refund') GROUP BY post_type,post_status",ARRAY_A);
    $o['ne_testiniai']=$wpdb->get_results("SELECT id,status,DATE(date_created_gmt) d,total_amount t,customer_id c,billing_email e FROM {$p}wc_orders WHERE type='shop_order' AND id NOT IN ($idl) ORDER BY id DESC LIMIT 40",ARRAY_A);
    $o['ne_testiniai_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_orders WHERE type='shop_order' AND id NOT IN ($idl)");
    $r=array(); foreach($ids as $id){ $x=wc_get_order($id); if(!$x){ $pt=get_post_type($id); $r[]=array($id,$pt?:'NĖRA'); continue; }
      if($x instanceof WC_Order_Refund){ $r[]=array($id,'refund',$x->get_parent_id(),$x->get_amount(),$x->get_meta('_ps_kiekis')?'kiekis':''); continue; }
      $m=array(); foreach(array('_petshop_avpn_number'=>'avpn','_petshop_iapv_number'=>'iapv','_petshop_order_number'=>'ordnr','_petshop_ppk_number'=>'ppk','_ps_telefonu'=>'tel','_ps_pakartotinis'=>'pak','_ps_uzsakymo_id'=>'uzs_id','_ps_atsiemimas'=>'ats','_ps_siuntos'=>'siuntos','_ps_partija'=>'part','_ps_grazinti_rankomis'=>'graz','_ps_matyta'=>'mat') as $k=>$s){ $v=$x->get_meta($k); if($v!=='' && $v!==null && $v!==array()){ $m[]=$s.(is_scalar($v)?':'.mb_substr((string)$v,0,14):'+'); } }
      $refs=array_map(function($rf){return $rf->get_id();},$x->get_refunds()); $pdf=$x->get_meta('_petshop_completed_pdf'); $pdf2=$x->get_meta('_petshop_order_pdf'); $kr=array(); foreach($x->get_refunds() as $rf){ $k=$rf->get_meta('_petshop_kravpn_number'); if($k) $kr[]=$k; }
      $r[]=array($id,$x->get_status(),$x->get_created_via(),(int)$x->get_customer_id(),mb_substr($x->get_billing_email(),0,28),$x->get_total(),count($x->get_items()),implode(' ',$m),$refs?implode('/',$refs):'',$kr?implode('/',$kr):'',($pdf&&file_exists($pdf))?'pdf':(($pdf)?'pdf?':''),($pdf2&&file_exists($pdf2))?'iapv_pdf':'',(int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$p}comments WHERE comment_post_ID=%d",$id))); }
    $o['uzs']=$r; $J($o);
  }
  if($f==='R2'){
    $t=$wpdb->get_col("SHOW TABLES LIKE '{$p}%ps%'"); $t=array_merge($t,$wpdb->get_col("SHOW TABLES LIKE '{$p}petshop%'")); $t=array_values(array_unique($t)); $lent=array();
    foreach($t as $tb){ $cols=$wpdb->get_col("SHOW COLUMNS FROM `$tb`",0); $n=(int)$wpdb->get_var("SELECT COUNT(*) FROM `$tb`"); $oc=null; foreach(array('order_id','uzsakymas_id','uzsakymo_id','uzsakymas','uzs_id','post_id','wc_order_id','parent_order_id') as $c){ if(in_array($c,$cols,true)){ $oc=$c; break; } }
      $tn=$oc?(int)$wpdb->get_var("SELECT COUNT(*) FROM `$tb` WHERE `$oc` IN ($idl)"):null; $tst=in_array('testinis',$cols,true)?(int)$wpdb->get_var("SELECT COUNT(*) FROM `$tb` WHERE testinis=1"):null;
      $lent[]=array(str_replace($p,'',$tb),$n,$oc,$tn,$tst,mb_substr(implode(',',$cols),0,120)); }
    $o['lenteles']=$lent;
    $lk=array(); foreach(array('wc_order_product_lookup','wc_order_stats','wc_order_tax_lookup','wc_order_coupon_lookup','wc_orders_meta','wc_order_addresses','wc_order_operational_data','woocommerce_order_items') as $tb){ $lk[$tb]=array((int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}$tb"),(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}$tb WHERE order_id IN ($idl)")); } $lk['wc_customer_lookup']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_customer_lookup"); $o['wc_lookup']=$lk;
    $up=wp_upload_dir(); $b=$up['basedir'].'/wcdn'; $pdf=array(); foreach(array('invoice','creditnote','receipt') as $d){ $fs=glob("$b/$d/*.pdf")?:array(); $pdf[$d]=array(count($fs),array_map('basename',array_slice($fs,-8))); } $o['pdf']=$pdf;
    $o['skaitikliai']=$wpdb->get_results("SELECT option_name,option_value FROM {$p}options WHERE option_name LIKE '%counter%' OR option_name LIKE 'petshop_%numer%' OR option_name LIKE '%_nr_%' ORDER BY option_name",ARRAY_A);
    $o['ps_opcijos']=$wpdb->get_results("SELECT option_name,LENGTH(option_value) l,autoload FROM {$p}options WHERE option_name LIKE 'ps_%' OR option_name LIKE 'petshop_%' ORDER BY option_name",ARRAY_A);
    $o['likuciai']=array(); foreach(array(19708,19756,16889,16727,35357,35790,35796) as $pid){ $x=wc_get_product($pid); $o['likuciai'][$pid]=$x?array('n'=>mb_substr($x->get_name(),0,40),'st'=>$x->get_status(),'stock'=>$x->get_stock_quantity(),'ms'=>$x->get_manage_stock(),'av'=>class_exists('Petshop_AV_Stock')?Petshop_AV_Stock::qty($pid):'-','vf'=>$x->get_meta('_vf_qty'),'own'=>$x->get_meta('_ps_own_qty'),'type'=>$x->get_type()):'NĖRA'; }
    $o['vartotojai']=$wpdb->get_results("SELECT ID,user_login,user_email,user_registered FROM {$p}users WHERE user_email LIKE '%avesa.lt%' OR user_login IN ('testuotojas') OR user_registered>'2026-08-25' ORDER BY ID DESC LIMIT 30",ARRAY_A);
    foreach($o['vartotojai'] as &$u){ $uu=get_user_by('id',$u['ID']); $u['roles']=implode(',',(array)$uu->roles); $u['uzs']=(int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$p}wc_orders WHERE customer_id=%d",$u['ID'])); } unset($u);
    $o['dev_pastas']=count((array)get_option('ps_dev_pastas_zurnalas',array())); $o['audit_mail']=count((array)get_option('ps_audit_mail',array())); $o['s1617_test']=get_option('ps_s1617_test');
    $o['cron_ps']=array(); foreach((array)_get_cron_array() as $ts=>$h){ foreach(array_keys((array)$h) as $k){ if(strpos($k,'ps_')===0||strpos($k,'petshop')===0) $o['cron_ps'][$k]=date('m-d H:i',$ts); } }
    $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'"); $J($o);
  }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
