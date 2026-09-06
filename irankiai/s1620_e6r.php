<?php
/** TEMP PS S1620 run e6r — 6 ETAPO RECON (tik skaitymas): užsakymai dev'e, susijusios lentelės (order_id + našlaičiai), PDF katalogai, opcijos/skaitikliai, likučiai, vartotojai, faktų sandeliai. */
add_action('init', function(){
  if (!isset($_GET['ps_e6r'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e6r'])); $o=array('v'=>'S1620 e6r','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(250);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  try{
  if($f==='U'){
    $o['hpos']=class_exists('Automattic\WooCommerce\Utilities\OrderUtil')&&\Automattic\WooCommerce\Utilities\OrderUtil::custom_orders_table_usage_is_enabled();
    $o['wc_orders_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_orders"); $o['pagal_tipa']=$wpdb->get_results("SELECT type,status,COUNT(*) n FROM {$p}wc_orders GROUP BY type,status",ARRAY_A);
    $o['posts_shop_order']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}posts WHERE post_type IN ('shop_order','shop_order_refund','shop_order_placehold')");
    $ids=wc_get_orders(array('type'=>'shop_order','limit'=>-1,'orderby'=>'ID','order'=>'ASC','return'=>'ids')); $o['n']=count($ids); $r=array();
    foreach($ids as $id){ $x=wc_get_order($id); if(!$x) continue; $rf=$x->get_refunds(); $s=$x->get_meta('_ps_siuntos'); $sn=is_array($s)?count($s):(is_string($s)&&$s!==''?count((array)json_decode($s,true)):0);
      $fl=array(); foreach(array('_ps_pakartotinis'=>'pak','_ps_pakartotinis_id'=>'pakid','_ps_siunta_grizta'=>'grizta','_ps_telefonu'=>'tel','_ps_atsiemimas'=>'ats','_ps_kreditine'=>'kr','_ps_grazinti_rankomis'=>'grazink','_ps_dalys_issiusta'=>'iss','_ps_matyta'=>'mat','_ps_rusiuota'=>'rus','_ps_surinkta'=>'sur') as $k=>$l){ if($x->get_meta($k)!=='' && $x->get_meta($k)!==null && $x->get_meta($k)!==array()) $fl[]=$l; }
      $r[]=implode('|',array($id,$x->get_status(),$x->get_date_created()?$x->get_date_created()->date('m-d'):'',(int)$x->get_customer_id(),mb_substr($x->get_billing_email(),0,28),$x->get_total(),$x->get_created_via(),$x->get_meta('_petshop_avpn_number'),$x->get_meta('_petshop_order_pdf')?'iapv':'',$x->get_meta('_petshop_ppk_number'),count($rf),$sn,implode(',',$fl))); }
    $o['uzs']='id|st|data|kl|el|suma|via|avpn|iapv|ppk|ref|siuntos|zymes'; $o['eil']=$r;
    $o['refundai']=$wpdb->get_results("SELECT id,parent_order_id pid,status,total_amount FROM {$p}wc_orders WHERE type='shop_order_refund' ORDER BY id",ARRAY_A);
    $J($o);
  }
  if($f==='L'){
    $db=DB_NAME; $tabs=$wpdb->get_col("SELECT table_name FROM information_schema.tables WHERE table_schema='$db' AND (table_name LIKE '{$p}ps\\_%' OR table_name LIKE '%venipak%' OR table_name LIKE '%lithuania%' OR table_name LIKE '%lp\\_%' OR table_name LIKE '{$p}wc\\_order%' OR table_name LIKE '{$p}woocommerce_order%' OR table_name LIKE '{$p}wcdn%' OR table_name LIKE '{$p}petshop%')");
    $res=array(); foreach($tabs as $t){ $n=(int)$wpdb->get_var("SELECT COUNT(*) FROM `$t`"); $cols=$wpdb->get_col("SELECT column_name FROM information_schema.columns WHERE table_schema='$db' AND table_name='$t'"); $oc=null; foreach($cols as $c){ if(preg_match('/^(order_id|uzsakymo_id|uzsakymas_id|uzsakymas|order|wc_order_id|parent_order_id|converted_order_id)$/i',$c)){ $oc=$c; break; } }
      $row=array('n'=>$n); if($oc&&$n){ $row['oc']=$oc; $row['dist']=(int)$wpdb->get_var("SELECT COUNT(DISTINCT `$oc`) FROM `$t` WHERE `$oc`>0"); $row['nasl']=(int)$wpdb->get_var("SELECT COUNT(*) FROM `$t` x LEFT JOIN {$p}wc_orders w ON w.id=x.`$oc` WHERE x.`$oc`>0 AND w.id IS NULL"); $row['min_max']=$wpdb->get_row("SELECT MIN(`$oc`) a,MAX(`$oc`) b FROM `$t` WHERE `$oc`>0",ARRAY_N); }
      if($n&&in_array($t,array($p.'ps_fakt_eilutes'),true)){ $row['sandelis']=$wpdb->get_results("SELECT sandelis,COUNT(*) n FROM `$t` GROUP BY sandelis",ARRAY_A); if(in_array('testinis',$cols,true)) $row['testinis']=$wpdb->get_results("SELECT testinis,COUNT(*) n FROM `$t` GROUP BY testinis",ARRAY_A); }
      if($n&&!$oc){ $row['cols']=implode(',',array_slice($cols,0,10)); }
      $res[str_replace($p,'',$t)]=$row; }
    $o['lenteles']=$res;
    $o['fakt_testinis_cols']=$wpdb->get_results("SELECT table_name t,column_name c FROM information_schema.columns WHERE table_schema='$db' AND column_name='testinis'",ARRAY_A);
    $J($o);
  }
  if($f==='K'){
    $up=wp_upload_dir(); foreach(array('invoice','creditnote','receipt') as $d){ $g=glob($up['basedir'].'/wcdn/'.$d.'/*.pdf')?:array(); $o['pdf_'.$d]=array('n'=>count($g),'MB'=>round(array_sum(array_map('filesize',$g))/1048576,2),'pirmas'=>$g?basename($g[0]):null,'paskutinis'=>$g?basename(end($g)):null); }
    $g=glob($up['basedir'].'/ps-backups/*')?:array(); $o['ps_backups']=array('n'=>count($g),'MB'=>round(array_sum(array_map('filesize',$g))/1048576,1));
    foreach(array('petshop_avpn_counter','petshop_iapv_counter','petshop_kravpn_counter','petshop_ppk_counter','ps_s1617_test','ps_dev_pastas_leisti') as $k){ $o['opt'][$k]=get_option($k); }
    $o['opt']['ps_dev_pastas_zurnalas_n']=count((array)get_option('ps_dev_pastas_zurnalas',array())); $o['opt']['ps_audit_mail_n']=count((array)get_option('ps_audit_mail',array()));
    $o['opt_ps_kitos']=$wpdb->get_col("SELECT option_name FROM {$p}options WHERE (option_name LIKE 'ps\\_%' OR option_name LIKE 'petshop\\_%') AND option_name NOT LIKE '%counter%' ORDER BY option_name");
    $o['transients_ps']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}options WHERE option_name LIKE '\\_transient\\_ps\\_%'");
    foreach(array(19708,19756,16889,16727,35357,35790,35796) as $pid){ $x=wc_get_product($pid); $o['prekes'][$pid]=$x?array('n'=>mb_substr($x->get_name(),0,40),'st'=>$x->get_status(),'stock'=>$x->get_stock_quantity(),'ms'=>$x->get_manage_stock(),'av'=>class_exists('Petshop_AV_Stock')?Petshop_AV_Stock::qty($pid):null,'vf'=>$x->get_meta('_vf_qty'),'own'=>$x->get_meta('_own_stock')):'NĖRA'; }
    $o['av_stock_meta']=$wpdb->get_results("SELECT meta_key,COUNT(*) n FROM {$p}postmeta WHERE meta_key IN ('_own_stock','_ps_av_stock','_av_stock','_vf_qty') GROUP BY meta_key",ARRAY_A);
    $o['users']=$wpdb->get_results("SELECT u.ID,u.user_login,u.user_email,SUBSTRING(m.meta_value,1,60) roles FROM {$p}users u LEFT JOIN {$p}usermeta m ON m.user_id=u.ID AND m.meta_key='{$p}capabilities' WHERE u.user_email LIKE '%dev.avesa%' OR u.user_email LIKE '%avesa.lt' OR u.user_login LIKE 'test%' OR m.meta_value LIKE '%ps_darbuotojas%' OR m.meta_value LIKE '%administrator%' OR m.meta_value LIKE '%shop_manager%' ORDER BY u.ID",ARRAY_A);
    $o['users_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}users"); $o['customers_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_customer_lookup");
    $o['cron_ps']=array_values(array_unique(array_filter(array_map(function($h){ return implode(',',array_filter(array_keys((array)$h),function($k){return strpos($k,'ps_')===0||strpos($k,'petshop')===0;})); },(array)_get_cron_array()))));
    $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'"); $J($o);
  }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
