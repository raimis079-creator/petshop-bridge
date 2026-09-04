<?php
/** TEMP PS S1612 run e1r — R: 4 etapo #1 recon (tik skaitymas): _ps_siuntos registras, Venipak plugino sekimo API, cron'ai, Petshop_Siuntos/Petshop_Desk::klausimas, LP būsenos, laiko zona */
add_action('init', function(){
  if (!isset($_GET['ps_e1r'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e1r'])); $o=array('v'=>'run e1r','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $src=function($cls,$m,$max=3000){ try{ $r=new ReflectionMethod($cls,$m); $ls=file($r->getFileName()); $c=implode('',array_slice($ls,$r->getStartLine()-1,$r->getEndLine()-$r->getStartLine()+1)); return array('f'=>basename($r->getFileName()),'l'=>$r->getStartLine().'-'.$r->getEndLine(),'kodas'=>mb_substr($c,0,$max)); }catch(Throwable $e){ return 'ERR '.$e->getMessage(); } };
  try{
  if($f==='R'){
    // 1. _ps_siuntos registras (HPOS meta)
    $rows=$wpdb->get_results("SELECT order_id, meta_value FROM {$p}wc_orders_meta WHERE meta_key='_ps_siuntos' ORDER BY order_id DESC LIMIT 60",ARRAY_A);
    $o['reg_kiek']=count($rows); $o['reg']=array(); $i=0; $pirmas=null;
    foreach($rows as $r){ $v=maybe_unserialize($r['meta_value']); if(is_string($v)){ $j=json_decode($v,true); if($j!==null) $v=$j; }
      if($i<2){ $o['reg_raw'][$r['order_id']]=mb_substr(is_string($r['meta_value'])?$r['meta_value']:wp_json_encode($r['meta_value']),0,700); }
      $s=array(); if(is_array($v)){ foreach($v as $k=>$e){ $s[]=$k.':'.implode('/',(array)($e['numeriai']??array())).(isset($e['manifest'])?' m='.$e['manifest']:'').(isset($e['data'])?' '.$e['data']:''); if(!$pirmas && !empty($e['numeriai'])) $pirmas=reset($e['numeriai']); } }
      $o['reg'][$r['order_id']]=$s; $i++; }
    $o['dalys_issiusta']=array(); foreach($wpdb->get_results("SELECT order_id, meta_value FROM {$p}wc_orders_meta WHERE meta_key='_ps_dalys_issiusta' AND meta_value<>'' AND meta_value<>'[]' ORDER BY order_id DESC LIMIT 4",ARRAY_A) as $r){ $o['dalys_issiusta'][$r['order_id']]=mb_substr($r['meta_value'],0,300); }
    $o['shipments']=$wpdb->get_results("SELECT meta_value v, COUNT(*) n FROM {$p}wc_orders_meta WHERE meta_key='_ps_shipments' GROUP BY meta_value",ARRAY_A);
    // 2. Venipak pluginas: katalogas, sekimo URL'ai kode, opcijų vardai, cron
    $o['venipak_dirs']=array_map('basename',array_merge(glob(WP_PLUGIN_DIR.'/*venipak*')?:array(),glob(WP_PLUGIN_DIR.'/*Venipak*')?:array()));
    $o['venipak_urls']=array(); $o['venipak_track_fn']=array();
    foreach($o['venipak_dirs'] as $d){ $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator(WP_PLUGIN_DIR.'/'.$d)); foreach($it as $fi){ if(substr($fi,-4)!=='.php') continue; $c=file_get_contents($fi); if(preg_match_all('~https?://[a-z0-9./_-]*venipak[a-z0-9./_?=&-]*~i',$c,$m)){ foreach(array_unique($m[0]) as $u){ $o['venipak_urls'][$u][]=str_replace(WP_PLUGIN_DIR.'/','',$fi); } }
      if(preg_match_all('/function\s+(\w*(track|status|event)\w*)\s*\(/i',$c,$m2)){ foreach($m2[1] as $fn){ $o['venipak_track_fn'][]=basename($fi).'::'.$fn; } } } }
    $o['venipak_track_fn']=array_values(array_unique($o['venipak_track_fn']));
    $o['venipak_opcijos']=$wpdb->get_results("SELECT option_name n, LENGTH(option_value) len FROM {$p}options WHERE option_name LIKE '%venipak%' ORDER BY option_name",ARRAY_A);
    $o['venipak_mu']=array(); foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $fi){ $c=file_get_contents($fi); if(preg_match_all('~https?://[a-z0-9./_-]*venipak[a-z0-9./_?=&-]*~i',$c,$m)){ $o['venipak_mu'][basename($fi)]=array_values(array_unique($m[0])); } }
    // 3. Venipak sekimo API — bandymas be autentifikacijos su vienu registruotu numeriu
    $nr=$pirmas?:'V07267E1000046'; $o['track_nr']=$nr;
    foreach(array('a'=>'https://tracking.venipak.com/api/v1/events?pack_no='.rawurlencode($nr),'b'=>'https://go.venipak.lt/ws/tracking.php?type=1&code='.rawurlencode($nr)) as $k=>$u){
      $r=wp_remote_get($u,array('timeout'=>25,'headers'=>array('Accept'=>'application/json')));
      $o['track'][$k]=is_wp_error($r)?array('err'=>$r->get_error_message()):array('u'=>$u,'code'=>wp_remote_retrieve_response_code($r),'ct'=>wp_remote_retrieve_header($r,'content-type'),'body'=>mb_substr(wp_remote_retrieve_body($r),0,900));
    }
    // 4. WP cron'ai (mūsų + vežėjų) su tvarkaraščiu
    $cr=_get_cron_array(); $o['cron']=array(); foreach($cr as $ts=>$hooks){ foreach($hooks as $h=>$ev){ if(preg_match('/venipak|lithuaniapost|^lp_|^ps_|petshop|tracking/i',$h)){ foreach($ev as $e){ $o['cron'][]=array('h'=>$h,'kada'=>gmdate('Y-m-d H:i',$ts),'sched'=>$e['schedule']??'once','int'=>$e['interval']??0); } } } }
    $o['schedules']=array_keys(wp_get_schedules()); $o['disable_cron']=defined('DISABLE_WP_CRON')?DISABLE_WP_CRON:null; $o['alt_cron']=defined('ALTERNATE_WP_CRON')?ALTERNATE_WP_CRON:null;
    // 5. Petshop_Siuntos + Petshop_Desk::klausimas + vezejas
    if(class_exists('Petshop_Siuntos')){ $rc=new ReflectionClass('Petshop_Siuntos'); $o['siuntos_klase']=array('f'=>basename($rc->getFileName()),'m'=>array()); foreach($rc->getMethods() as $mm){ $ps=array(); foreach($mm->getParameters() as $pp){ $ps[]='$'.$pp->getName().($pp->isDefaultValueAvailable()?'='.wp_json_encode($pp->getDefaultValue()):''); } $o['siuntos_klase']['m'][]=($mm->isPublic()?'+':'-').$mm->getName().'('.implode(',',$ps).')'; }
      $o['siuntos_sarasas_35421']=Petshop_Siuntos::sarasas(35421); $o['siuntos_src_sarasas']=$src('Petshop_Siuntos','sarasas',1500); }
    $o['desk_klausimas']=$src('Petshop_Desk','klausimas',3500); $o['desk_vezejas']=$src('Petshop_Desk','vezejas',1200);
    $o['desk_klaus_meta']=$wpdb->get_results("SELECT meta_key k, COUNT(*) n FROM {$p}wc_orders_meta WHERE meta_key LIKE '%klaus%' GROUP BY meta_key",ARRAY_A);
    $o['ps_meta_raktai']=$wpdb->get_col("SELECT DISTINCT meta_key FROM {$p}wc_orders_meta WHERE meta_key LIKE '\\_ps\\_%' ORDER BY meta_key");
    // 6. LP būsenos dev'e + plugino cron intervalas
    $o['lp_busenos']=$wpdb->get_results("SELECT meta_value v, COUNT(*) n FROM {$p}wc_orders_meta WHERE meta_key='_woo_lithuaniapost_shipping_status_value' GROUP BY meta_value",ARRAY_A);
    $o['lp_cron_kodas']=array(); foreach(glob(WP_PLUGIN_DIR.'/woo-lithuaniapost*/includes/*/*.php')?:array() as $fi){ $c=file_get_contents($fi); if(preg_match_all('/(wp_schedule_event|sync_tracking_data|cron_schedules)[^\n]{0,160}/',$c,$m)){ $o['lp_cron_kodas'][basename($fi)]=array_values(array_unique($m[0])); } }
    // 7. laiko zona, statusai
    $o['tz']=array('string'=>get_option('timezone_string'),'gmt_offset'=>get_option('gmt_offset'),'wp_tz'=>wp_timezone_string(),'now_local'=>current_time('mysql'),'now_gmt'=>gmdate('Y-m-d H:i:s'));
    $o['statusai']=array_keys(wc_get_order_statuses());
    // 8. Ivykiai + juosta klasės (cron'ui rašyti)
    $o['ivykiai_irasyti']=class_exists('Petshop_Uzsakymu_Ivykiai')?$src('Petshop_Uzsakymu_Ivykiai','irasyti',900):'nera';
  }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $J($o);
},99);
