<?php
/** Plugin Name: TEMP PS S1703 mc — recon (read-only): weight-filter, analitika beacon, relaunch svoris, feeding-calc REST, calc greitis */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1703mc'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1703 mc'); $f=$_GET['ps_s1703mc'];
  try{
    $core=WP_PLUGIN_DIR.'/petshop-core/';
    if($f==='1'){
      $o['weight_filter']=mb_substr(file_get_contents($core.'includes/class-weight-filter.php'),0,10200);
      $o['calc_handoff']=mb_substr(file_get_contents($core.'assets/calc-handoff.js'),0,3900);
    }
    if($f==='2'){
      $a=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-analitika.php');
      $o['analitika_head']=mb_substr($a,0,1500);
      if(preg_match('/function beacon\b.*?\n  \}\n/s',$a,$m)) $o['beacon']=mb_substr($m[0],0,5000); else { $i=strpos($a,'beacon'); $o['beacon_ctx']=mb_substr($a,max(0,$i-200),5000); }
      $rl=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-relaunch.php');
      foreach(array('svoris','js','rusis','dienos') as $fn){ $i=strpos($rl,'function '.$fn.'('); $o['rl_'.$fn]=$i!==false?mb_substr($rl,$i,2600):'NĖRA'; }
      // REST feeding-calc — kur registruotas
      $routes=rest_get_server()->get_routes(); foreach($routes as $r=>$h){ if(strpos($r,'petshop/v1')!==false) $o['petshop_v1'][]=$r; }
      $o['feeding_ui_head']=mb_substr(file_get_contents($core.'includes/class-feeding-ui.php'),0,3000);
    }
    if($f==='3'){
      // greitis: calc visoms gyvoms šunų prekėms su lentele, 10 kg
      $rows=$wpdb->get_results("SELECT m.product_id pid, t.species FROM {$p}ps_feeding_map m JOIN {$p}ps_feeding_tables t ON t.id=m.feeding_table_id JOIN {$p}posts po ON po.ID=m.product_id JOIN {$p}postmeta ps ON ps.post_id=m.product_id AND ps.meta_key='_stock_status' AND ps.meta_value='instock' WHERE m.is_active=1 AND t.is_active=1 AND po.post_status='publish' AND t.species='dog'",ARRAY_A);
      $t0=microtime(true); $st=array(); $ok=array(); $n=0;
      foreach($rows as $r){ $n++; if($n>400) break; $res=Petshop_Feeding_Service::calc(array('product_id'=>(int)$r['pid'],'weight_kg'=>10,'species_code'=>'dog')); $s=$res['status'].'/'.implode(',',(array)($res['reason_codes']??array())); $st[$s]=($st[$s]??0)+1; if($res['status']==='ok'&&$res['cost_day_min']!==null){ $ok[]=array('pid'=>(int)$r['pid'],'cd'=>$res['cost_day_min'],'cdx'=>$res['cost_day_max'],'d'=>$res['days_min'],'g'=>$res['norm_min_g'],'am'=>$res['activity_mode'],'wm'=>$res['weight_mode']); } }
      $o['n']=$n; $o['sek']=round(microtime(true)-$t0,2); $o['statusai']=$st;
      usort($ok,function($a,$b){return $a['cd']<=>$b['cd'];}); $o['ok_n']=count($ok);
      foreach(array_slice($ok,0,12) as $x){ $pr=wc_get_product($x['pid']); $x['n']=$pr?mb_substr($pr->get_name(),0,60):''; $x['kaina']=$pr?$pr->get_price():null; $o['pigiausi'][]=$x; }
      foreach(array_slice($ok,-5) as $x){ $pr=wc_get_product($x['pid']); $x['n']=$pr?mb_substr($pr->get_name(),0,60):''; $x['kaina']=$pr?$pr->get_price():null; $o['brangiausi'][]=$x; }
      // ne-ok pavyzdžiai
      $n=0; foreach($rows as $r){ $res=Petshop_Feeding_Service::calc(array('product_id'=>(int)$r['pid'],'weight_kg'=>10,'species_code'=>'dog')); if($res['status']!=='ok'){ $o['ne_ok'][]=array('pid'=>(int)$r['pid'],'st'=>$res['status'],'rc'=>$res['reason_codes'],'msg'=>$res['message_lt'],'sp'=>$res['species_required'],'io'=>count((array)$res['interval_options']),'ao'=>$res['activity_options']); if(++$n>=8) break; } }
      // pardavimai 90 d. pagal prekę (faktai) — perkamiausi
      $o['fakt_eilutes_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_eilutes",0);
    }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getFile().':'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
