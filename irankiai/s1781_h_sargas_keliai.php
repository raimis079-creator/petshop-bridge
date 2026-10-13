<?php
/** Plugin Name: TEMP PS S1781h keliu sargas + rodymo pokycio simuliacija (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1781h'])) return; @set_time_limit(160); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1781h'];
  $rm=function($n){ $m=new ReflectionMethod('Petshop_Darbalaukis',$n); $m->setAccessible(true); return $m; };
  try{
    $r['md5']=md5_file(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'); $r['ver']=Petshop_Darbalaukis::VERSIJA;
    $ap=$rm('atvira_partija');
    $ids=$wpdb->get_col("SELECT id FROM {$P}wc_orders WHERE type='shop_order' AND (status IN('wc-processing','wc-on-hold') OR (status='wc-completed' AND date_created_gmt>=DATE_SUB(UTC_TIMESTAMP(),INTERVAL 4 DAY)))");
    $r['tikrinta']=count($ids); $sk=[]; $nesur=[]; $sA=[]; $sB=[];
    foreach($ids as $id){ $o=wc_get_order($id); if(!$o||!$o->is_paid()) continue; $nr=$o->get_order_number(); $st=$o->get_status();
      $spr=json_decode((string)$o->get_meta('_ps_misrus_sprendimas'),true); if(!is_array($spr)) $spr=[]; $rus=(string)$o->get_meta('_ps_rusiuota'); $sprestas=(string)$o->get_meta('_ps_misrus_sprestas');
      $perd=json_decode((string)$o->get_meta('_ps_dropship_sent_src'),true); if(!is_array($perd)) $perd=[]; $av=false; $srcs=[];
      foreach($o->get_items() as $it){ $s=(string)$it->get_meta('_ps_source'); if($s==='av') $av=true; if($s) $srcs[$s]=1; }
      if($st!=='completed' && !$rus && !$spr && count($srcs)>1) $nesur[]=$nr.' ('.implode('+',array_keys($srcs)).')';
      // SARGAS A: planas yra, bet „Surūšiuota“ nespausta
      if($spr && !$rus && !$sprestas) $sA[]=$nr.' '.$st.' planas '.json_encode($spr);
      foreach($o->get_items() as $iid=>$it){ $s=(string)$it->get_meta('_ps_source'); if(!$s||$s==='av') continue; $k=(string)$it->get_meta('_ps_kelias');
        // SARGAS B: misrus (yra AV eilute), tiekejo preke eina klientui (planas tiesiai arba perduota tiekejui), o zmogaus sprendimo eiluteje nera
        if($av && $k==='' && !$it->get_meta('_ps_konsolidacija') && ('tiesiai'===($spr[$s]??'') || !empty($perd[$s]))) $sB[]=$nr.' '.$st.' ['.$s.'] '.mb_substr($it->get_name(),0,34).(!empty($perd[$s])?' — PERDUOTA '.$perd[$s]:' — planas tiesiai');
        if($st==='completed'||$k!=='') continue;
        $b=class_exists('Petshop_AV_Tiekimas')?Petshop_AV_Tiekimas::eilutes_bukle($o->get_id(),(int)$iid):null; $base=$it->get_meta('_ps_konsolidacija')||'av'===($spr[$s]??'')||$b;
        $old=($base||(!$rus&&$ap->invoke(null,$s)&&$av))?'i_av':'tiesiai'; $new=($base||(!$rus&&!isset($spr[$s])&&$av))?'i_av':'tiesiai';
        if($old!==$new) $sk[]=$nr.' ['.$s.'] '.mb_substr($it->get_name(),0,30).' '.$old.' → '.$new.' (planas '.json_encode($spr).')'; } }
    $r['sargas_A_planas_be_surusiuota']=$sA; $r['sargas_B_klientui_be_sprendimo']=$sB; $r['po_pataisos_rodymas_keistusi']=$sk; $r['nesurusiuoti_misrus_dabar']=$nesur;
    $oid=(int)$wpdb->get_var("SELECT order_id FROM {$P}wc_orders_meta WHERE meta_key='_ps_order_number' AND meta_value='1394' LIMIT 1"); $o=wc_get_order($oid);
    $x=['spr'=>$o->get_meta('_ps_misrus_sprendimas'),'eil'=>[],'pastabos'=>[]]; foreach($o->get_items() as $it){ $x['eil'][]=mb_substr($it->get_name(),0,26).' | src='.$it->get_meta('_ps_source').' kelias='.$it->get_meta('_ps_kelias').' kons='.$it->get_meta('_ps_konsolidacija'); }
    foreach(wc_get_order_notes(['order_id'=>$oid,'order_by'=>'date_created','order'=>'DESC','limit'=>5]) as $n){ $x['pastabos'][]=$n->date_created->date('m-d H:i:s').' ['.$n->added_by.'] '.mb_substr(wp_strip_all_tags($n->content),0,200); } $r['u1394']=$x;
  }catch(Throwable $e){ $r['err']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
