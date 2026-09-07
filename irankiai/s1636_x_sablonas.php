<?php
/** TEMP PS S1636 run x — Tiekėjų fizinių likučių įkėlimas iš Raimio Excel (VF/ZB). R: DRY (atitikimas, Σ) · A: APPLY per Petshop_Partijos::priimti (kelia _own_stock_qty pats). CSV: sku;kiekis;savikaina;geriausia_iki;lapas. Idempotencija: ps_s1636x_done. */
add_action('init', function(){
  if (!isset($_GET['ps_s1636x'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_s1636x'])); $o=array('v'=>'S1636 x','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(200);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  try{
  $csv=gzdecode(base64_decode('__CSV__')); if($csv===false){ $o['STOP']='csv gz'; $J($o); }
  $eil=array_filter(array_map('trim',explode("\n",$csv)));
  $sk=$wpdb->get_results("SELECT pm.meta_value sku, pm.post_id FROM {$p}postmeta pm JOIN {$p}posts po ON po.ID=pm.post_id AND po.post_type IN('product','product_variation') AND po.post_status='publish' WHERE pm.meta_key='_sku' AND pm.meta_value<>''",OBJECT);
  $map=array(); foreach($sk as $r){ $map[(string)$r->sku]=(int)$r->post_id; }
  $done=(array)get_option('ps_s1636x_done',array());
  $plan=array(); $nerasta=array(); $be_sav=array(); $q=0;
  foreach($eil as $l){ $c=explode(';',$l); if(count($c)<5) continue; list($sku,$k,$sav,$gi,$lp)=array_map('trim',$c);
    $k=(int)$k; if($k<=0) continue;
    if(!isset($map[$sku])){ $nerasta[]=$sku; continue; }
    $sav=(float)str_replace(',','.',$sav); if($sav<=0){ $be_sav[]=$sku; continue; }
    $plan[]=array('pid'=>$map[$sku],'sku'=>$sku,'k'=>$k,'sav'=>$sav,'gi'=>$gi,'lp'=>strtoupper($lp)); $q+=$k;
  }
  $o['eiluciu']=count($eil); $o['plane']=count($plan); $o['q_suma']=$q; $o['nerasta']=$nerasta; $o['be_savikainos']=$be_sav; $o['jau_padaryta']=count($done);
  if($f==='R'){ $o['pvz']=array_slice($plan,0,8); $J($o); }
  if($f==='A'){
    $res=array('ok'=>0,'praleista_done'=>0,'klaidos'=>array());
    foreach($plan as $x){ if(in_array($x['pid'],$done,true)){ $res['praleista_done']++; continue; }
      $r=Petshop_Partijos::priimti($x['pid'],array('kiekis'=>$x['k'],'savikaina'=>(string)$x['sav'],'valiuta'=>'EUR','kursas'=>1,'geriausia_iki'=>$x['gi'],'tiekejas'=>$x['lp'],'gauta'=>current_time('Y-m-d'),'pastaba'=>'Fizinis likutis (Raimio Excel, S1636)'));
      if(is_wp_error($r)){ $res['klaidos'][]=$x['sku'].': '.$r->get_error_message(); if(count($res['klaidos'])>9) break; continue; }
      $done[]=$x['pid']; $res['ok']++;
      if($res['ok']%50===0) update_option('ps_s1636x_done',$done,false);
    }
    update_option('ps_s1636x_done',$done,false);
    $o['apply']=$res;
    $o['own_stock_suma']=(int)$wpdb->get_var("SELECT SUM(meta_value+0) FROM {$p}postmeta WHERE meta_key='_own_stock_qty' AND post_id IN (SELECT post_id FROM {$p}postmeta WHERE meta_key='_sku')");
    $J($o);
  }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
