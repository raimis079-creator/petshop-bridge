<?php
/** Plugin Name: TEMP PS S1736i DP kategorija — kiek pakų paslepia dydžių katalogas (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1736i'])) return;
  $f=$_GET['ps_s1736i']; @set_time_limit(200); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1736i','faze'=>$f];
  try{
  if($f==='1'){
    $T=91; $s=Petshop_Dydziu_Katalogas::seimos(); $rodo=[];$slepia=[];$be_seimos=0;
    $dp=array_map('intval',$wpdb->get_col("SELECT object_id FROM {$P}term_relationships tr JOIN {$P}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id WHERE tt.term_id=$T"));
    $seimoje=[];
    foreach($s as $sk=>$nariai){ $kand=[]; foreach($nariai as $n){ $seimoje[$n[0]]=$sk; if(!empty($n[6])) continue; if(!in_array($T,$n[5]??[])) continue; $kand[]=$n; }
      if(!$kand) $kand=$nariai; $np=array_values(array_filter($kand,function($n){return empty($n[7]);})); if($np) $kand=$np;
      usort($kand,function($a,$b){return ($b[1]<=>$a[1])?:($b[4]<=>$a[4]);}); $v=$kand[0][0];
      foreach($nariai as $n){ if(!in_array($n[0],$dp)) continue; if($n[0]===$v) $rodo[]=$n[0]; else $slepia[]=[$n[0],get_the_title($n[0]),$sk,'veidas='.$v.' '.get_the_title($v)]; } }
    foreach($dp as $id){ if(!isset($seimoje[$id])) $be_seimos++; }
    $r['dp_kategorijoje']=count($dp); $r['rodoma_seimose']=count($rodo); $r['be_seimos_rodoma']=$be_seimos; $r['paslepta']=count($slepia); $r['pvz']=array_slice($slepia,0,15);
    $r['visos_paslepta_seimos']=count(array_unique(array_column($slepia,2)));
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
