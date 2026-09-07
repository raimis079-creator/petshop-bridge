<?php
/** TEMP PS S1636 run x — Tiekėjų fizinių likučių įkėlimas iš Raimio Excel (VF/ZB). R: DRY (atitikimas, Σ) · A: APPLY per Petshop_Partijos::priimti (kelia _own_stock_qty pats). CSV: sku;kiekis;savikaina;geriausia_iki;lapas. Idempotencija: ps_s1636x_done. */
add_action('init', function(){
  if (!isset($_GET['ps_s1636x'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_s1636x'])); $o=array('v'=>'S1636 x','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(200);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  try{
  $csv=gzdecode(base64_decode('H4sIAAb+nmoC/22XyXIkKQxA7/MxhDa24FR2212zeOxxtR3RfXHE3Of/ryMBmUBm3YonIbQhsgQkCRF6JChYCFwo5fP5t8uLrikVqqvH6883wKIa7Hys6JspYCzocl+zLqiQ41TB0weCFETVEN6JLygrCQVhJWrHryQfCfazuzNPHyH6QstZIeNy+vX6/IIWgyfXdl2PLl9/Pt9A1xYmbuhqu7B4RX5DpsWL1u/NdgDHm9bbpR0HY+NbsyXZ8UbMlF9MKQpqnaWv30+b3o9e/vF6AwDW0yi6nHeGQQMszC77nZHWAAoHR2OvYNfzg4XKiF13pDIiO4McDhapnouOeLDAFlTvpUZ8iStJWWOg7PK0L1sTMjiZ9KyOhXH2N2YqUqJLcUIKjsirFwcU1NkDiprt5PzshjZc2ZfJutY8DSPqhHDyKmmd7LwwI7KtuLJzwpImFMwcholZoWRFVpPkmAZiaxYtSZ7UJJo1cHnSk2ynskujFXINgpJDmhi1si961eM0u5LVY7F2wzgx83jpjoyxBRZHsJlqsKo3EPci46QmvaGnaLOIeRccTJ6oaW0HnsuTo7QLkiZ7ySLjOGcl135QV/zOEKC656dolXmNdrC/v18eLqLZ0x52wBv7qzJY2IexsKBPQzpzJvZ4eWgDVgfwYI9n9v0O+7Mz3AaZstsde7cf9xhSq1C/E2/L5H+rMzKPGflPBXGAzyMAvOATCDD0NCr+9dCxv4PlotresEDtkx37M34B1OnPbQxNlJRSNx1oxwwbTk4mvGuzi3HHAtBtB+dlxrRNV1gwQ82oXo3EK+/qlCfcHRdxgjOmDafhoWweSr0nO6Wdpslv5B5OqDdox9L8U9OQFlxrnl2cokF/l4ZK9XpRmGjc6aybGtUXbwqboNHFY/veqL0Y5/yHLRXRSZooNwszfUCrIbaCAw8sA+cwsN9wGJ2nON3HuWPRrtlCedWYI/SmIVxobYJcr9VEuU3hsAX4evuwZ/pqcSeXZcFSsSYfFxyha69GkmH9WvMd/3hHpi9KKeUWu/erwCZnNSSLgAP57iZOAv/FOlb10+y4owqkVs7vrg4BnQ9vglrV4GI4CuzFSH45I8GXFjfmdoNOkvYN0kbxLkATMJ5DTGTG+ouLRwGxnENpEmkjJo8tAupx/drRByMdufR7duQWYMSzHXt4wmqflUv0x4MJohaQQji6SpBqBVM4ZkQlaiy1YbtkhBDUmOfYvktGRoj5C7PQKSGbwB9zuAnOp3dBPFZQ060Cz6dINIgvEakzbNnRBF76rOjZJRs/2vn9t73/22/Zfj9QVh9KaqsX1H85+oz5sVQvyD7+qV3af4XtGwmbwn9IQf+IxLGy/y3TkuzP0ljq22eDty01Eix5rPSrelpF2lT/B8lEp/N9DQAA')); if($csv===false){ $o['STOP']='csv gz'; $J($o); }
  $eil=array_filter(array_map('trim',explode("\n",$csv)));
  $sk=$wpdb->get_results("SELECT pm.meta_value sku, pm.post_id FROM {$p}postmeta pm JOIN {$p}posts po ON po.ID=pm.post_id AND po.post_type IN('product','product_variation') AND po.post_status='publish' WHERE pm.meta_key='_sku' AND pm.meta_value<>''",OBJECT);
  $map=array(); foreach($sk as $r){ $map[(string)$r->sku]=(int)$r->post_id; }
  $done=(array)get_option('ps_s1636x_done',array());
  $plan=array(); $nerasta=array(); $be_sav=array(); $q=0;
  foreach($eil as $l){ $c=explode(';',$l); if(count($c)<5) continue; list($sku,$k,$sav,$gi,$lp)=array_map('trim',$c);
    $k=(int)$k; if($k<=0) continue;
    if(!isset($map[$sku])){ $nerasta[]=$sku; continue; }
    $sav=(float)str_replace(',','.',$sav);
    if($sav<=0){ foreach(array('_cost_price','_vf_cost','_zb_cost') as $mk){ $sav=(float)get_post_meta($map[$sku],$mk,true); if($sav>0) break; } } // Raimis 09-07: tuščia savikaina → iš VF/ZB kortelės
    if($sav<=0){ $be_sav[]=$sku; continue; }
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
