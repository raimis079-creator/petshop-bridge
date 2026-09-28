<?php
/** Plugin Name: TEMP PS S1731l #1208 PVM naujoms eilutėms + faktai + pastaba (1 dry / 2 vykdyti / 3 patikra) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1731l'])) return;
  $f=$_GET['ps_s1731l']; @set_time_limit(120); global $wpdb; $r=['v'=>'S1731l','faze'=>$f];
  $OID=36555; $EIL=[2775=>5.04,2776=>0.86]; $TOTAL=57.18;
  try{
    $o=wc_get_order($OID);
    $rid=null; foreach($o->get_items() as $iid=>$it){ if(isset($EIL[$iid])) continue; $t=$it->get_taxes(); if(!empty($t['total'])){ $rid=array_key_first($t['total']); break; } }
    $r['rate_id']=$rid; if(!$rid) throw new Exception('nėra tarifo id');
    if($f==='2'){
      foreach($EIL as $iid=>$g){ $it=$o->get_item($iid); if(!$it) throw new Exception('nėra eilutės '.$iid); $tax=round($g-(float)$it->get_total(),6); $it->set_taxes(['total'=>[$rid=>$tax],'subtotal'=>[$rid=>$tax]]); $it->save(); }
      $o=wc_get_order($OID); $o->update_taxes(); $o->calculate_totals(false); $o->save();
      if(abs((float)$o->get_total()-$TOTAL)>0.001) throw new Exception('suma po pataisos '.$o->get_total());
      $ft_u=Petshop_Faktai::t_uzsakymai(); $ft_e=Petshop_Faktai::t_eilutes();
      $wpdb->delete($ft_e,['uzsakymas_id'=>$OID]); $wpdb->delete($ft_u,['uzsakymas_id'=>$OID]);
      $o=wc_get_order($OID); $o->delete_meta_data('_ps_faktas_irasytas'); $o->save(); Petshop_Faktai::rasyti($OID);
      foreach(wc_get_order_notes(['order_id'=>$OID]) as $n){ if(strpos($n->content,'Prekių keitimas (S1731')!==false){ $r['sena_pastaba']=mb_substr(wp_strip_all_tags($n->content),0,200); $senas=$n->content; wc_delete_order_note($n->id); } }
      $o=wc_get_order($OID);
      if(!empty($senas)){ $nauj=preg_replace('/Užsakymo suma nepakito: [0-9,]+ €/u','Užsakymo suma nepakito: '.number_format((float)$o->get_total(),2,',','').' €',$senas); $nauj=preg_replace('/ \| ĮSPĖJIMAI: SUMA [^.]*/u','',$nauj); $o->add_order_note($nauj,false,true); }
    }
    $o=wc_get_order($OID); $r['total']=$o->get_total(); $r['tax']=$o->get_total_tax();
    foreach($o->get_items() as $iid=>$it){ $r['eil'][$iid]=[$it->get_name(),$it->get_quantity(),round((float)$it->get_total()+(float)$it->get_total_tax(),2),$it->get_meta('_ps_source'),$it->get_meta('_ps_av_reduced_qty')]; }
    $r['fakt']=$wpdb->get_row($wpdb->prepare("SELECT prekiu_suma_ct,pvm_ct,viso_ct,savikaina_ct,marza_ct,kontribucija_ct,eiluciu_sk FROM ".Petshop_Faktai::t_uzsakymai()." WHERE uzsakymas_id=%d",$OID),ARRAY_A);
    $r['pastabos']=array_map(function($x){return mb_substr(wp_strip_all_tags($x->content),0,600);},wc_get_order_notes(['order_id'=>$OID,'order'=>'DESC','limit'=>3]));
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
