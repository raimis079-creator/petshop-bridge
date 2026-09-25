<?php
/** Plugin Name: TEMP PS S1717o — #1177 (36296) eiluciu kelio zymiu atkurimas po WC eiluciu perkurimo. Fazes: 1 sausas, 2 vykdyti, 3 patikra, 9 atstatyti */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1718o'])) return;
  $f=$_GET['ps_s1718o']; @set_time_limit(170); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1717o','faze'=>$f]; $ID=36296; $BAK='ps_s1718_1177_bak';
  $tz=new DateTimeZone('Europe/Vilnius'); $dabar=current_time('mysql');
  $PLANAS=[ 2579=>['src'=>'av','car'=>'any','pid'=>18468,'q'=>1,'wc_red'=>null,'av'=>1], 2580=>['src'=>'av','car'=>'any','pid'=>15867,'q'=>4,'wc_red'=>null,'av'=>4] ];
  $bukle=function() use($ID,$PLANAS){ $o=wc_get_order($ID); $b=['order'=>['status'=>$o->get_status(),'_ps_av_reduced'=>$o->get_meta('_ps_av_reduced'),'_ps_av_restored'=>$o->get_meta('_ps_av_restored'),'_order_stock_reduced'=>$o->get_data_store()->get_stock_reduced($ID)],'eil'=>[],'stock'=>[]];
    foreach($PLANAS as $iid=>$p){ $it=$o->get_item($iid); $m=[]; if($it){ foreach($it->get_meta_data() as $md){ if(preg_match('#^_(ps_|reduced_stock)#',$md->key)) $m[$md->key]=is_scalar($md->value)?(string)$md->value:json_encode($md->value); } } $b['eil'][$iid]=$m; $pr=wc_get_product($p['pid']); $b['stock'][$p['pid']]=$pr?$pr->get_stock_quantity():null; }
    return $b; };
  $rc=new ReflectionClass('Petshop_Darbalaukis'); $call=function($fn,$args) use($rc){ $m=$rc->getMethod($fn); $m->setAccessible(true); return $m->invokeArgs(null,$args); };
  try{
  if($f==='1'){
    $r['pries']=$bukle(); $r['planas']=$PLANAS;
    $r['tikrinimai']=[]; $o=wc_get_order($ID);
    foreach($PLANAS as $iid=>$p){ $it=$o->get_item($iid); $r['tikrinimai'][$iid]=['yra'=>(bool)$it,'pid_ok'=>$it&&(int)$it->get_product_id()===$p['pid'],'q_ok'=>$it&&(int)$it->get_quantity()===$p['q'],'kelias'=>$it?$it->get_meta('_ps_kelias'):null,'src_tuscias'=>$it&&''===(string)$it->get_meta('_ps_source')]; }
  }
  if($f==='2'){
    if(get_option($BAK)) { $r['klaida']='bak jau yra — jau vykdyta?'; wp_send_json($r); }
    $pries=$bukle(); $o=wc_get_order($ID);
    foreach($PLANAS as $iid=>$p){ $it=$o->get_item($iid); if(!$it||(int)$it->get_product_id()!==$p['pid']||(int)$it->get_quantity()!==$p['q']||''!==(string)$it->get_meta('_ps_source')){ $r['klaida']='eilute '.$iid.' neatitinka plano'; wp_send_json($r); } }
    update_option($BAK,['laikas'=>$dabar,'pries'=>$pries],false);
    $judesiai=[]; $bak_ok=true;
    foreach($PLANAS as $iid=>$p){ $it=$o->get_item($iid);
      $it->update_meta_data('_ps_source',$p['src']); $it->update_meta_data('_ps_carrier',$p['car']); $it->update_meta_data('_ps_source_qty',$p['q']); $it->update_meta_data('_ps_source_at',$dabar);
      $it->update_meta_data('_ps_source_reason','S1717: atkurta — WC perkūrė eilutes po pakartotinio kasos pateikimo 18:00:30 (pirmo pateikimo kelias: '.('av'===$p['src']?'AV':'dropship '.$p['src']).')');
      if(null!==$p['wc_red']) $it->update_meta_data('_reduced_stock',$p['wc_red']);
      if($p['av']>0){ $x=$call('likutis',[$p['pid'],-$p['av'],'S1717 atkūrimas: AV nurašymas, kurio variklis nepadarė (eilutės be kelio), užsakymas #1177']); if(is_wp_error($x)){ $r['klaida']='likutis '.$p['pid'].': '.$x->get_error_message(); $r['judesiai']=$judesiai; wp_send_json($r); } $judesiai[]='#'.$p['pid'].' AV −'.$p['av'].' → '.$x; $it->update_meta_data('_ps_av_reduced_qty',$p['av']); }
      $it->save();
    }
    $o=wc_get_order($ID);
    if(!$o->get_meta('_ps_av_reduced')) $o->update_meta_data('_ps_av_reduced',$dabar);
    $o->delete_meta_data('_ps_av_restored');
    $o->add_order_note('S1717 (Claude, Raimio „ok"): eilučių kelio žymės atkurtos — 18:00:30 WooCommerce perkūrė eilutes po pakartotinio kasos pateikimo, žymės dingo, AV likutis nebuvo nurašytas. Keliai: Ambrosia → klientui tiesiai; trachėjos, ausys → AV. Likutis: '.implode(', ',$judesiai).'.',false,true);
    $o->save();
    foreach($PLANAS as $p){ clean_post_cache($p['pid']); wc_delete_product_transients($p['pid']); }
    wc_delete_shop_order_transients($o);
    if(class_exists('Petshop_Uzsakymu_Ivykiai')) Petshop_Uzsakymu_Ivykiai::irasyti(['uzsakymas'=>$ID,'sritis'=>'desk','veiksmas'=>'kelias','rezultatas'=>'ok','kanalas'=>'bridge','kas'=>0,'kas_vardas'=>'Claude S1717','pries'=>$pries['eil'],'po'=>['zinute'=>'eilučių _ps_source atkurta; '.implode(', ',$judesiai)],'pastaba'=>'S1717: WC eilučių perkūrimas po dvigubo kasos pateikimo']);
    do_action('ps_juosta_isvalyti');
    $r['judesiai']=$judesiai; $r['po']=$bukle();
  }
  if($f==='3'){
    $r['bukle']=$bukle();
    $m=(new ReflectionClass('Petshop_AV_Dropship'))->getMethod('grupuoti'); $m->setAccessible(true); $g=$m->invoke(null,[$ID]); $r['grupuoti']=array_map(function($x){return array_keys($x);},$g);
    $o=wc_get_order($ID); $fk=$call('faktai',[$o]); $r['eiles']=$fk['eiles']; $r['kur_dabar']=wp_strip_all_tags($call('kur_dabar',[$fk])); $r['takelis']=$fk['takelis']; $r['eil_src']=array_map(function($e){return [$e['src'],$e['k'],$e['reduced'],$e['bukle']];},$fk['eil']);
    foreach([18468,15867] as $pid){ $r['partijos'][$pid]=$wpdb->get_var("SELECT SUM(kiekis_liko) FROM {$P}ps_partijos WHERE product_id=$pid AND atsaukta=0"); }
  }
  if($f==='9'){
    $bak=get_option($BAK); if(!$bak){ $r['klaida']='bak nera'; wp_send_json($r); }
    $o=wc_get_order($ID); $pries=$bak['pries'];
    foreach($PLANAS as $iid=>$p){ $it=$o->get_item($iid); if(!$it) continue; foreach(['_ps_source','_ps_carrier','_ps_source_qty','_ps_source_at','_ps_source_reason','_reduced_stock','_ps_av_reduced_qty'] as $k){ if(isset($pries['eil'][$iid][$k])) $it->update_meta_data($k,$pries['eil'][$iid][$k]); else $it->delete_meta_data($k); } $it->save();
      if($p['av']>0){ $x=$call('likutis',[$p['pid'],$p['av'],'S1717 atstatymas (fazė 9), užsakymas #1177']); $r['judesiai'][]='#'.$p['pid'].' AV +'.$p['av'].' → '.(is_wp_error($x)?'KLAIDA '.$x->get_error_message():$x); } }
    $o=wc_get_order($ID); if(''===(string)$pries['order']['_ps_av_reduced']) $o->delete_meta_data('_ps_av_reduced'); else $o->update_meta_data('_ps_av_reduced',$pries['order']['_ps_av_reduced']);
    if(''!==(string)$pries['order']['_ps_av_restored']) $o->update_meta_data('_ps_av_restored',$pries['order']['_ps_av_restored']);
    $o->add_order_note('S1717 atstatymas (fazė 9): eilučių žymės ir AV likutis grąžinti į būklę prieš atkūrimą.',false,true); $o->save();
    foreach($PLANAS as $p){ clean_post_cache($p['pid']); wc_delete_product_transients($p['pid']); } wc_delete_shop_order_transients($o); delete_option($BAK); do_action('ps_juosta_isvalyti');
    $r['po']=$bukle();
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $r['laikas']=(new DateTime('now',$tz))->format('H:i:s');
  wp_send_json($r);
}, 1);
