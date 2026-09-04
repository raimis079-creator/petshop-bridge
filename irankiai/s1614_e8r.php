<?php
/** TEMP PS S1614 run e8r — RECON (tik skaitymas): variklio surinkimo lapas — kurios eilutės spausdinamos (Petshop_Desk lapai / lapas), `eilutes_saltinis`, Venipak dispatch prekių/svorio šaltinis (visos eilutės ar tik AV). Raimio atsakymui 5 (grįžusi tiekėjo dalis → AV standartinė procedūra, kai AV siunta jau išsiųsta). */
add_action('init', function(){
  if (!isset($_GET['ps_e8r'])) return;
  $o=array('v'=>'S1614 e8r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $src=function($cls,$m,$max=80){ try{ $r=new ReflectionMethod($cls,$m); $f=file($r->getFileName()); return array('f'=>basename($r->getFileName()).':'.$r->getStartLine().'-'.$r->getEndLine(),'src'=>array_map(function($l){ return rtrim(mb_substr($l,0,220)); },array_slice($f,$r->getStartLine()-1,min($max,$r->getEndLine()-$r->getStartLine()+1)))); }catch(Throwable $e){ return 'ERR '.$e->getMessage(); } };
  try{
    $ms=array_map(function($m){ return $m->getName(); },(new ReflectionClass('Petshop_Desk'))->getMethods());
    $o['desk_lap_metodai']=array_values(array_filter($ms,function($n){ return preg_match('/lap|surink|eilutes_saltinis|eilutes_kelias|prekes_av|av_eilutes/i',$n); }));
    foreach($o['desk_lap_metodai'] as $m){ $o['src_'.$m]=$src('Petshop_Desk',$m,70); }
    // Venipak dispatch svoris/prekės — visos eilutės?
    $vp=WP_PLUGIN_DIR.'/wc-venipak-shipping/admin/class-woocommerce-shopup-venipak-shipping-admin-dispatch.php'; $ls=file($vp); $out=array(); foreach($ls as $i=>$l){ if(preg_match('/weight|get_items|order_products|products_count|_ps_source|_ps_kelias/',$l)){ $out[]=($i+1).': '.trim(mb_substr($l,0,180)); } } $o['vp_dispatch_grep']=array_slice($out,0,40);
    // ar variklyje kur nors filtruojama pagal _ps_source rašant lipduką / svorį
    $o['desk_svoris']=method_exists('Petshop_Desk','uzsakymo_svoris')?$src('Petshop_Desk','uzsakymo_svoris',40):'nėra';
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
