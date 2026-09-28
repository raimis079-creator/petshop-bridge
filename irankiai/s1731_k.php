<?php
/** Plugin Name: TEMP PS S1731k #1208 keitimas: stirnos ausis 5 → kiaules ausis 4 + Bones 1, suma ta pati (1 dry / 2 vykdyti / 3 patikra / 9 atstatyti) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1731k'])) return;
  $f=$_GET['ps_s1731k']; @set_time_limit(150); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1731k','faze'=>$f];
  $OID=36555; $SENA=2742; $SENA_PID=34908; $TOTAL='57.18';
  $NAUJOS=[ [16305,4,5.04,'1.39 → 1.26'], [16273,1,0.86,''] ];  // pid, kiekis, eilutės suma su PVM, kainos pakeitimo žymė
  $BAK='ps_s1731_1208_bak';
  $ft_u=class_exists('Petshop_Faktai')?Petshop_Faktai::t_uzsakymai():''; $ft_e=class_exists('Petshop_Faktai')?Petshop_Faktai::t_eilutes():'';
  $col=function($t) use($wpdb){ $c=$wpdb->get_col("SHOW COLUMNS FROM {$t}"); foreach(['uzsakymas_id','uzsakymo_id','order_id'] as $x) if(in_array($x,$c,true)) return $x; return null; };
  $bus=function() use($OID,$wpdb,$ft_u,$ft_e,$col){ $o=wc_get_order($OID); $x=['st'=>$o->get_status(),'total'=>$o->get_total(),'tax'=>$o->get_total_tax(),'groups'=>$o->get_meta('_ps_groups'),'surinkta'=>$o->get_meta('_ps_surinkta')];
    foreach($o->get_items() as $iid=>$it){ $x['eil'][$iid]=[$it->get_product_id(),$it->get_quantity(),round((float)$it->get_total()+(float)$it->get_total_tax(),2),$it->get_meta('_ps_source'),$it->get_meta('_ps_av_reduced_qty')]; }
    foreach([16305,16273,34908] as $pid) $x['stock'][$pid]=get_post_meta($pid,'_stock',true);
    $cu=$col($ft_u); $ce=$col($ft_e); $x['fakt_u']=$wpdb->get_row($wpdb->prepare("SELECT * FROM {$ft_u} WHERE {$cu}=%d",$OID),ARRAY_A); $x['fakt_e_n']=(int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$ft_e} WHERE {$ce}=%d",$OID));
    return $x; };
  try{
  $o=wc_get_order($OID);
  if($f==='1'){
    $r['dabar']=$bus(); $r['fakt_col']=[$col($ft_u),$col($ft_e)];
    $it=$o->get_item($SENA); $r['sena']=$it?[$it->get_product_id(),$it->get_quantity(),$it->get_meta('_ps_av_reduced_qty')]:null;
    foreach($NAUJOS as $n){ $p=wc_get_product($n[0]); $r['naujos'][$n[0]]=['n'=>$p->get_name(),'stock'=>$p->get_stock_quantity(),'ex'=>wc_get_price_excluding_tax($p,['qty'=>1,'price'=>$n[2]]),'parinkti'=>Petshop_AV_Source::parinkti($n[0],$n[1],false),'part_dry'=>Petshop_Partijos::nurasyti($n[0],$n[1],true)]; }
    $r['meta_irasyta']=(new ReflectionClass('Petshop_Faktai'))->getConstant('META_IRASYTA');
  }
  if($f==='2'){
    if(get_option($BAK)) throw new Exception('jau vykdyta (yra bak)');
    if($o->get_status()!=='processing') throw new Exception('statusas '.$o->get_status());
    if((string)$o->get_total()!==$TOTAL) throw new Exception('suma '.$o->get_total());
    $it=$o->get_item($SENA); if(!$it||(int)$it->get_product_id()!==$SENA_PID||(int)$it->get_quantity()!==5) throw new Exception('senos eilutės nėra');
    foreach($NAUJOS as $n){ $p=wc_get_product($n[0]); if((int)$p->get_stock_quantity()<$n[1]) throw new Exception('#'.$n[0].' likutis '.$p->get_stock_quantity()); }
    $cu=$col($ft_u); $ce=$col($ft_e);
    $bak=['laikas'=>current_time('mysql'),'sena'=>['pid'=>$SENA_PID,'q'=>5,'name'=>$it->get_name(),'sub'=>$it->get_subtotal(),'tot'=>$it->get_total(),'taxes'=>$it->get_taxes(),'meta'=>array_map(function($m){return [$m->key,$m->value];},$it->get_meta_data())],
      'fakt_u'=>$wpdb->get_results($wpdb->prepare("SELECT * FROM {$ft_u} WHERE {$cu}=%d",$OID),ARRAY_A),'fakt_e'=>$wpdb->get_results($wpdb->prepare("SELECT * FROM {$ft_e} WHERE {$ce}=%d",$OID),ARRAY_A),
      'groups'=>$o->get_meta('_ps_groups'),'nauji'=>[]];
    update_option($BAK,$bak,false);
    // 1) sena eilute lauk
    $o->remove_item($SENA); $o->save(); $o=wc_get_order($OID);
    // 2) naujos eilutes
    $mis=method_exists('Petshop_AV_Source','ar_misrus')?Petshop_AV_Source::ar_misrus($o):false; $jud=[]; $isp=[]; $txt=[];
    foreach($NAUJOS as $n){ $p=wc_get_product($n[0]);
      $ni=new WC_Order_Item_Product(); $ni->set_product($p); $ni->set_quantity($n[1]);
      $ex=(float)wc_get_price_excluding_tax($p,['qty'=>1,'price'=>$n[2]]); $ni->set_subtotal($ex); $ni->set_total($ex);
      if($n[3]!=='') $ni->add_meta_data('_ps_kaina_pakeista',$n[3],true);
      $ni->add_meta_data('_ps_keitimas_s1731','#1208: vietoj „Stirnos ausis, 1 vnt.“ ×5 (klientas sutiko, suma ta pati)',true);
      $sav=get_post_meta($n[0],'_cost_price',true); if($sav!=='') { $ni->add_meta_data('_ps_savikaina_vnt',number_format((float)$sav,4,'.',''),true); $ni->add_meta_data('_ps_savikaina_saltinis','cost_price',true); }
      $ni->add_meta_data('_ps_kaina_atskirai_vnt',number_format((float)wc_get_price_including_tax($p),4,'.',''),true);
      $x=Petshop_AV_Source::parinkti($n[0],$n[1],$mis);
      $ni->add_meta_data('_ps_source',$x['source'],true); $ni->add_meta_data('_ps_carrier',$x['carrier'],true); $ni->add_meta_data('_ps_source_qty',$n[1],true); $ni->add_meta_data('_ps_source_at',current_time('mysql'),true); $ni->add_meta_data('_ps_source_reason',$x['reason'],true);
      $o->add_item($ni); $o->save(); $iid=$ni->get_id(); $bak['nauji'][]=$iid;
      // 3) AV nurasymas (kaip Petshop_AV_Reduce::mazinti, grynai AV saka)
      if('av'===$x['source']){
        if(null===Petshop_AV_Stock::qty($n[0])){ $pp=wc_get_product($n[0]); $dab=(int)get_post_meta($n[0],'_stock',true); $nau=max(0,$dab-$n[1]); $pp->set_stock_quantity($nau); if(0===$nau) $pp->set_stock_status('outofstock'); $pp->save(); wc_delete_product_transients($n[0]); $jud[]="#{$n[0]} grynai AV {$dab} -> {$nau}"; }
        else { $rz=Petshop_AV_Stock::decrease($n[0],$n[1],'užsakymas #1208 (keitimas)'); $jud[]=is_wp_error($rz)?"#{$n[0]} KLAIDA ".$rz->get_error_message():"#{$n[0]} AV -> {$rz}"; }
        $ni=$o->get_item($iid); $ni->update_meta_data('_ps_av_reduced_qty',$n[1]); $ni->save();
        // 4) partijos
        $pr=Petshop_Partijos::nurasyti($n[0],$n[1]); if(is_wp_error($pr)) $isp[]='#'.$n[0].': '.$pr->get_error_message(); else { $bak['partijos'][$n[0]]=$pr['planas']; if(!empty($pr['ispejimas'])) $isp[]='#'.$n[0].': '.$pr['ispejimas']; }
      }
      $txt[]=$n[1].'× „'.$p->get_name().'“ '.number_format($n[2],2,',','').' €'.($n[3]!==''?' (kaina '.$n[3].')':'');
      update_option($BAK,$bak,false);
    }
    $o=wc_get_order($OID); $o->update_taxes(); $o->calculate_totals(false);
    if(abs((float)$o->get_total()-(float)$TOTAL)>0.001) $isp[]='SUMA '.$o->get_total().' ≠ '.$TOTAL;
    $rm=new ReflectionMethod('Petshop_Darbalaukis','perskaiciuoti_grupes'); $rm->setAccessible(true); $rm->invoke(null,$o);
    if($o->get_meta('_ps_surinkta')) { $o->delete_meta_data('_ps_surinkta'); $jud[]='surinkimas nuimtas — lapą spausdink iš naujo'; }
    $o->save();
    // 5) faktai perrasomi
    $wpdb->delete($ft_e,[$ce=>$OID]); $wpdb->delete($ft_u,[$cu=>$OID]);
    $mk=(new ReflectionClass('Petshop_Faktai'))->getConstant('META_IRASYTA'); $o=wc_get_order($OID); $o->delete_meta_data($mk); $o->save(); Petshop_Faktai::rasyti($OID);
    $o=wc_get_order($OID);
    $o->add_order_note('Prekių keitimas (S1731, Raimio sprendimu, klientas sutiko): „Stirnos ausis, 1 vnt.“ ×5 (5,90 €, prekės nebuvo) pakeista į '.implode(' + ',$txt).'. Užsakymo suma nepakito: '.number_format((float)$o->get_total(),2,',','').' €. AV nurašymas: '.implode(' · ',$jud).($isp?' | ĮSPĖJIMAI: '.implode(' · ',$isp):'').'. Faktai perrašyti. Klientui laiškas: NESIŲSTAS.',false,true);
    if(class_exists('Petshop_Uzsakymu_Ivykiai')) Petshop_Uzsakymu_Ivykiai::irasyti(['uzsakymas'=>$OID,'sritis'=>'desk','veiksmas'=>'keitimas','rezultatas'=>'ok','kanalas'=>'web','kas'=>0,'kas_vardas'=>'Claude (S1731)','pries'=>['preke'=>$SENA_PID,'q'=>5,'suma'=>5.90],'po'=>['prekes'=>$txt,'suma'=>(float)$o->get_total()],'pastaba'=>'stirnos ausis ×5 → kiaulės ausis ×4 + Bones ×1, suma ta pati']);
    do_action('ps_juosta_isvalyti');
    $r['judesiai']=$jud; $r['ispejimai']=$isp; $r['po']=$bus();
  }
  if($f==='3'){ $r['po']=$bus(); $r['bak']=(bool)get_option($BAK);
    $n=wc_get_order_notes(['order_id'=>$OID,'order'=>'DESC','limit'=>2]); $r['pastabos']=array_map(function($x){return mb_substr(wp_strip_all_tags($x->content),0,500);},$n); }
  if($f==='9'){
    $bak=get_option($BAK); if(!$bak) throw new Exception('bak nėra');
    foreach((array)$bak['nauji'] as $iid){ $it=$o->get_item($iid); if(!$it) continue; $pid=$it->get_product_id(); $q=(int)$it->get_meta('_ps_av_reduced_qty');
      if($q>0){ if(null===Petshop_AV_Stock::qty($pid)){ $pp=wc_get_product($pid); $pp->set_stock_quantity((int)get_post_meta($pid,'_stock',true)+$q); $pp->set_stock_status('instock'); $pp->save(); } else Petshop_AV_Stock::increase($pid,$q,'atstatyta S1731'); }
      foreach((array)($bak['partijos'][$pid]??[]) as $pl) Petshop_Partijos::grazinti_i_partija($pl['partijos_id'],$pl['imam']);
      $o->remove_item($iid); }
    $s=$bak['sena']; $p=wc_get_product($s['pid']); $ni=new WC_Order_Item_Product(); $ni->set_product($p); $ni->set_quantity($s['q']); $ni->set_subtotal($s['sub']); $ni->set_total($s['tot']); $ni->set_taxes($s['taxes']);
    foreach($s['meta'] as $m) $ni->add_meta_data($m[0],$m[1],true); $o->add_item($ni); $o->save();
    $o=wc_get_order($OID); $o->update_taxes(); $o->calculate_totals(false); $o->update_meta_data('_ps_groups',$bak['groups']); $o->save();
    $cu=$col($ft_u); $ce=$col($ft_e); $wpdb->delete($ft_e,[$ce=>$OID]); $wpdb->delete($ft_u,[$cu=>$OID]);
    foreach($bak['fakt_u'] as $row) $wpdb->insert($ft_u,$row); foreach($bak['fakt_e'] as $row) $wpdb->insert($ft_e,$row);
    $o->add_order_note('S1731 keitimas atšauktas — grąžinta stirnos ausis ×5.',false,true); delete_option($BAK); $r['po']=$bus();
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
