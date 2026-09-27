<?php
/** Plugin Name: TEMP PS S1724b dropship_sla skaiciavimo recon (petshop-rytas + kur dar kalendorines dienos) read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1724b'])) return;
  $f=$_GET['ps_s1724b']; @set_time_limit(120); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1724b','faze'=>$f]; $tz=new DateTimeZone('Europe/Vilnius');
  try{
  if($f==='1'){
    $p=WPMU_PLUGIN_DIR.'/petshop-rytas.php'; $s=file_get_contents($p); $r['md5']=md5($s); $r['eil']=substr_count($s,"\n");
    // istraukti dropship_sla bloka su kontekstu
    $lines=explode("\n",$s); $out=[];
    foreach($lines as $i=>$l){ if(stripos($l,'dropship_sla')!==false||stripos($l,'dropship')!==false||preg_match('/24\s*\*|HOUR|DAY|valand|dien/i',$l)&&stripos($l,'sla')!==false){ $out[]=$i+1; } }
    $r['eilutes_su_dropship']=$out;
    // pilnas blokas: nuo pirmo iki paskutinio +25 eiluciu
    if($out){ $a=max(0,min($out)-15); $b=min(count($lines),max($out)+30); $r['blokas']=implode("\n",array_map(function($i) use($lines){ return ($i+1).': '.$lines[$i]; },range($a,$b-1))); }
    // funkcijos, kurios turi 'darbo' (darbo dienos) – ar yra helperis
    preg_match_all('/function\s+(\w*(darbo|work|business|savaitg|weekend)\w*)\s*\(/i',$s,$m); $r['darbo_dienu_f_rytas']=$m[1];
    // kituose mu-pluginuose – darbo dienu helperiai
    $r['darbo_helperiai']=[]; foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $fx){ $c=file_get_contents($fx); if(preg_match_all('/function\s+(\w*(darbo_dien|workdays?|business_days?|savaitgal)\w*)\s*\(/i',$c,$mm)){ $r['darbo_helperiai'][basename($fx)]=$mm[1]; } }
    // pristatymo pazadas – kaip skaiciuoja dienas (turi savaitgaliu logika?)
    $pp=WPMU_PLUGIN_DIR.'/petshop-pristatymo-pazadas.php'; if(is_file($pp)){ $c=file_get_contents($pp); preg_match_all('/^.*(savaitg|weekend|\bN\b|isDayOfWeek|format\(\'N\'\)|date\(\'N\'|->format\("N"\)).*$/mi',$c,$mm); $r['pazadas_savaitgalis']=array_slice(array_map('trim',$mm[0]),0,12); }
    // darbalaukis – ar SLA/velavimo zenklai
    $dl=WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'; if(is_file($dl)){ $c=file_get_contents($dl); preg_match_all('/^.*(veluoj|SLA|>\s*24|24\s*\*\s*3600|DAY_IN_SECONDS).*$/mi',$c,$mm); $r['darbalaukis_velavimas']=array_slice(array_map(function($x){return mb_substr(trim($x),0,200);},$mm[0]),0,15); }
    $desk=WPMU_PLUGIN_DIR.'/petshop-desk.php'; if(is_file($desk)){ $c=file_get_contents($desk); preg_match_all('/^.*(veluoj|SLA|>\s*24|DAY_IN_SECONDS).*$/mi',$c,$mm); $r['desk_velavimas']=array_slice(array_map(function($x){return mb_substr(trim($x),0,200);},$mm[0]),0,15); }
    // sargo paskutinis rezultatas – detalus (kurie uzsakymai)
    $rp=get_option('ps_rytas_sargas_pask'); $r['rytas_pask_raw']=is_array($rp)?json_encode($rp,JSON_UNESCAPED_UNICODE):$rp;
  }
  if($f==='2'){
    // kurie 3 uzsakymai: processing, dropship dalis neperduota/neissiusta > 24 val.
    $ords=wc_get_orders(['limit'=>60,'type'=>'shop_order','status'=>['processing'],'orderby'=>'date','order'=>'ASC']);
    foreach($ords as $o){ $d=$o->get_date_created(); $paid=$o->get_date_paid(); $meta=[]; foreach(['_ps_kelias','_ps_dalys','_ps_dalys_issiusta','_ps_tiekimas','_ps_dropship','_ps_source','_ps_dalis_vf','_ps_dalis_zb'] as $k){ $v=$o->get_meta($k); if($v!=='' && $v!==null) $meta[$k]=is_scalar($v)?mb_substr((string)$v,0,120):mb_substr(json_encode($v,JSON_UNESCAPED_UNICODE),0,300); }
      $keys=[]; foreach($o->get_meta_data() as $md){ $k=$md->get_data()['key']; if(strpos($k,'_ps_')===0) $keys[]=$k; }
      $r['uzs'][]=['nr'=>$o->get_order_number(),'sukurta'=>$d?$d->setTimezone($tz)->format('m-d H:i D'):'','apmoketa'=>$paid?$paid->setTimezone($tz)->format('m-d H:i D'):'','meta'=>$meta,'ps_keys'=>array_values(array_unique($keys))]; }
    $r['laikas']=(new DateTime('now',$tz))->format('Y-m-d H:i D');
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
