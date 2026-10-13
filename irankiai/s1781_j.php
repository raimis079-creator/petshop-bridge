<?php
/** Plugin Name: TEMP PS S1781j #1394 VF eilutes: siuncia klientui → veza i AV (partija 45) — 1 dry · 2 vykdo · 3 patikra · 9 atstato */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1781j'])) return; $F=(string)$_GET['ps_s1781j']; @set_time_limit(120); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1781j','f'=>$F];
  $OID=36828; $IIDS=[3639,3641]; $PART=45; $NR='V07267E1000419'; $BAK='ps_s1781_1394_bak'; $TE=$P.'ps_tiekimas_eil'; $TP=$P.'ps_tiekimas';
  $OM=['_ps_misrus_sprendimas','_ps_dropship_sent','_ps_dropship_sent_src','_ps_dropship_to','_ps_siuntos','_ps_siuntos_senos','_ps_venipak_sekimas','venipak_shipping_order_data','_ps_venipak_sena','_ps_tiekimas_laukia','_ps_groups','_ps_order_type','_ps_shipments'];
  $IM=['_ps_kelias','_ps_konsolidacija','_ps_source','_ps_source_at','_ps_source_reason','_ps_carrier'];
  $rm=function($n){ $m=new ReflectionMethod('Petshop_Darbalaukis',$n); $m->setAccessible(true); return $m; };
  $fk=function($o) use($rm){ $f=$rm('faktai')->invoke(null,$o,$rm('zurnalas')->invoke(null,[$o->get_id()])); return ['rus'=>$f['rus'],'eiles'=>$f['eiles'],'tiesiai'=>$f['tiesiai'],'dalys'=>array_map(fn($d)=>$d?array_intersect_key($d,['siunta'=>1,'nr'=>1,'perduota'=>1,'vietoje'=>1,'issiusta'=>1]):null,$f['dalys']),'eil'=>array_values(array_map(fn($e)=>mb_substr($e['n'],0,22).' | '.$e['src'].' → '.$e['k'].' | '.($e['lock']??''),$f['eil']))]; };
  $bukle=function() use($wpdb,$OID,$OM,$IM,$IIDS,$TE,$TP,$PART){ $o=wc_get_order($OID); $x=['status'=>$o->get_status(),'om'=>[],'im'=>[]]; foreach($OM as $k){ $v=$o->get_meta($k); $x['om'][$k]=is_scalar($v)?(string)$v:json_encode($v); } foreach($IIDS as $i){ $it=$o->get_item($i); foreach($IM as $k) $x['im'][$i][$k]=(string)$it->get_meta($k); $x['im'][$i]['pid']=$it->get_product_id(); $x['im'][$i]['q']=$it->get_quantity(); }
    $x['partija']=$wpdb->get_row($wpdb->prepare("SELECT id,tiekejas,busena,uzsakyta,pristatymas FROM $TP WHERE id=%d",$PART),ARRAY_A); $x['partijos_eil']=$wpdb->get_results($wpdb->prepare("SELECT id,product_id,order_id,qty,qty_gauta,pastaba FROM $TE WHERE partija_id=%d",$PART),ARRAY_A); $x['musu_eil']=$wpdb->get_results($wpdb->prepare("SELECT id,partija_id,pastaba FROM $TE WHERE order_id=%d",$OID),ARRAY_A); return $x; };
  try{
    $r['ver']=Petshop_Darbalaukis::VERSIJA; $o=wc_get_order($OID);
    if($F==='1'){ $r['bukle']=$bukle(); $r['f']=$fk($o); $r['siuntu_registras']=class_exists('Petshop_Siuntos')?Petshop_Siuntos::sarasas($OID):'nera klases'; $r['bak_yra']=(bool)get_option($BAK);
      $h=[]; foreach(array_merge(glob(WPMU_PLUGIN_DIR.'/petshop-*.php'),glob(WP_PLUGIN_DIR.'/petshop-core/includes/*.php')) as $fl){ foreach(file($fl) as $i=>$l){ if(strpos($l,'_ps_order_shipped_emitted')!==false) $h[]=basename($fl).':'.($i+1).' '.trim(mb_substr($l,0,200)); } } $r['shipped_emitted']=array_slice($h,0,8); }
    if($F==='2'){
      $b=$bukle(); $p=$b['partija'];
      if(get_option($BAK)) $r['err']='jau vykdyta';
      elseif(!$p||$p['tiekejas']!=='vf'||$p['busena']!=='uzsakyta') $r['err']='partija 45 ne VF/uzsakyta: '.json_encode($p);
      elseif($o->get_status()!=='processing') $r['err']='statusas '.$o->get_status();
      else { foreach($IIDS as $i){ $it=$o->get_item($i); if(!$it||$it->get_meta('_ps_source')!=='vf'||$it->get_meta('_ps_kelias')!==''||Petshop_AV_Tiekimas::eilutes_bukle($OID,$i)) $r['err']='eilutė '.$i.' ne tokia, kokios tikėtasi'; } }
      if(empty($r['err'])){
        update_option($BAK,['laikas'=>current_time('mysql'),'om'=>$b['om'],'im'=>$b['im'],'eil_ids'=>[]],false); $ids=[]; $dabar=current_time('mysql');
        foreach($IIDS as $i){ $it=$o->get_item($i);
          $wpdb->insert($TE,['partija_id'=>$PART,'product_id'=>$it->get_product_id(),'order_id'=>$OID,'qty'=>(int)$it->get_quantity(),'pastaba'=>'eilutė '.$i]); $ids[]=(int)$wpdb->insert_id;
          $it->update_meta_data('_ps_kelias','i_av'); $it->update_meta_data('_ps_konsolidacija',1); $it->update_meta_data('_ps_source_at',$dabar);
          $it->update_meta_data('_ps_source_reason','S1781: VF siunčia klientui → VF veža į AV (Raimis suderino su VF, partija #'.$PART.')'); $it->save(); }
        $bk=get_option($BAK); $bk['eil_ids']=$ids; update_option($BAK,$bk,false);
        $o=wc_get_order($OID);
        foreach(['_ps_dropship_sent','_ps_dropship_sent_src','_ps_dropship_to'] as $k) $o->delete_meta_data($k);
        $s=json_decode((string)$o->get_meta('_ps_siuntos'),true); if(is_array($s)){ unset($s['vf']); if($s) $o->update_meta_data('_ps_siuntos',wp_json_encode($s)); else $o->delete_meta_data('_ps_siuntos'); }
        $sek=json_decode((string)$o->get_meta('_ps_venipak_sekimas'),true); if(is_array($sek)){ unset($sek[$NR]); if($sek) $o->update_meta_data('_ps_venipak_sekimas',wp_json_encode($sek)); else $o->delete_meta_data('_ps_venipak_sekimas'); }
        $sen=Petshop_Darbalaukis::senos($o); $sen[]=$NR; $o->update_meta_data('_ps_siuntos_senos',wp_json_encode(array_values(array_unique($sen))));
        $vd=json_decode((string)$o->get_meta('venipak_shipping_order_data'),true); if(is_array($vd)){ $o->update_meta_data('_ps_venipak_sena',wp_json_encode($vd)); $vd['status']=''; $vd['pack_numbers']=[]; $o->update_meta_data('venipak_shipping_order_data',wp_json_encode($vd)); }
        $o->update_meta_data('_ps_tiekimas_laukia',1);
        $r['planas']=$rm('planas_is_eiluciu')->invoke(null,$o); $rm('perskaiciuoti_grupes')->invoke(null,$o);
        $o->add_order_note('S1781 (Raimio sprendimas): VF prekės (Truly elnienos juostelės, SmartBones Beef) NESIUNČIAMOS klientui — VF veža į AV, įtrauktos į Vetfarmas partiją #'.$PART.'. Lipdukas '.$NR.' nebenaudojamas. Užsakymas išeis viena siunta iš AV.',false,true);
        $o->save();
        if(class_exists('Petshop_Uzsakymu_Ivykiai')) Petshop_Uzsakymu_Ivykiai::irasyti(['uzsakymas'=>$OID,'sritis'=>'desk','veiksmas'=>'kelias','rezultatas'=>'ok','kanalas'=>'auto','kas'=>0,'kas_vardas'=>'S1781','pries'=>['kelias'=>'tiesiai','src'=>'vf'],'po'=>['kelias'=>'i_av','src'=>'vf','partija'=>$PART],'pastaba'=>'VF 2 eilutės: siunčia klientui → veža į AV (Raimis suderino su VF)']);
        do_action('ps_juosta_isvalyti'); $r['ok']=1; $r['eil_ids']=$ids;
      }
    }
    if($F==='3'){ $r['bukle']=$bukle(); $r['f']=$fk(wc_get_order($OID)); $r['neperduotos']=Petshop_AV_Dropship::neperduotos(wc_get_order($OID)); $r['siuntu_registras']=class_exists('Petshop_Siuntos')?Petshop_Siuntos::sarasas($OID):null; }
    if($F==='9'){ $bk=get_option($BAK); if(!$bk) $r['err']='bak nėra'; else { foreach((array)$bk['eil_ids'] as $id) $wpdb->delete($TE,['id'=>(int)$id]);
        foreach($IIDS as $i){ $it=$o->get_item($i); foreach($IM as $k){ $v=$bk['im'][$i][$k]??''; if($v==='') $it->delete_meta_data($k); else $it->update_meta_data($k,$v); } $it->save(); }
        $o=wc_get_order($OID); foreach($OM as $k){ $v=$bk['om'][$k]??''; if($v===''||$v==='""') $o->delete_meta_data($k); else $o->update_meta_data($k,$v); } $o->add_order_note('S1781: #1394 VF eilučių pakeitimas atstatytas.',false,true); $o->save(); delete_option($BAK); $r['atstatyta']=1; } }
  }catch(Throwable $e){ $r['err']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
