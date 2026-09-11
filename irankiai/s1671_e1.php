<?php
/** Plugin Name: TEMP PS S1671 ekonomika A1 */
add_action('init', function(){
  if (!isset($_GET['ps_s1671e']) || $_GET['ps_s1671e']!=='E1') return;
  header('Content-Type: application/json; charset=utf-8'); $o=array('v'=>'S1671e1'); global $wpdb; $p=$wpdb->prefix;
  try {
    $o['ist_uzs_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_ist_uzsakymai");
    $o['ist_eil_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_ist_eilutes");
    // Katalogo ekonomika: publish, kaina>0, savikaina su fallback
    $rows=$wpdb->get_results("SELECT p.ID, p.post_title,
      (SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_price' LIMIT 1) kaina,
      (SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_regular_price' LIMIT 1) reg,
      COALESCE(NULLIF((SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_cost_price' LIMIT 1),''),NULLIF((SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_vf_cost' LIMIT 1),''),NULLIF((SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_zb_cost' LIMIT 1),'')) sav,
      (SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_ps_sandelis' LIMIT 1) sand,
      (SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_stock_status' LIMIT 1) ss,
      (SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_weight' LIMIT 1) svoris,
      (SELECT t.name FROM {$p}term_relationships tr JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='product_brand' JOIN {$p}terms t ON t.term_id=tt.term_id WHERE tr.object_id=p.ID LIMIT 1) brand,
      (SELECT GROUP_CONCAT(t.slug ORDER BY tt.parent) FROM {$p}term_relationships tr JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='product_cat' JOIN {$p}terms t ON t.term_id=tt.term_id WHERE tr.object_id=p.ID) kat
      FROM {$p}posts p WHERE p.post_type='product' AND p.post_status='publish'", ARRAY_A);
    $o['n']=count($rows); $agg=array(); $be_sav=0; $be_kainos=0; $dist=array('<0'=>0,'0-10'=>0,'10-20'=>0,'20-30'=>0,'30-40'=>0,'40+'=>0); $prekes=array();
    $gyv=function($kat){ foreach(array('sunims','katems','zuvims','grauzikams','paukscius','paukščiams','ropliams') as $g){ if(strpos($kat,$g)!==false) return $g; } return 'kita'; };
    foreach($rows as $r){ $k=(float)$r['kaina']; if($k<=0){$be_kainos++;continue;} $s=(float)$r['sav']; if($s<=0){$be_sav++;} $g=$gyv((string)$r['kat']); $kats=explode(',',(string)$r['kat']); $sub='';
      foreach($kats as $c){ if(in_array($c,array('sunims','katems','zuvims','grauzikams','paukscius','paukščiams','ropliams'))) continue; if(preg_match('/^(maistas|sausas|konservai|skanestai|papildai|aksesuarai|priezi|kraikas|zaislai|higien|antipar)/u',$c)){ $sub=$c; break; } }
      if(!$sub && $kats){ $sub=$kats[count($kats)-1]; }
      $kbe=$k/1.21; $m = $s>0 ? ($kbe-$s)/$kbe : null; // marža nuo kainos be PVM
      if($m!==null){ $b = $m<0?'<0':($m<0.10?'0-10':($m<0.20?'10-20':($m<0.30?'20-30':($m<0.40?'30-40':'40+')))); $dist[$b]++; }
      foreach(array('gyv|'.$g, 'sub|'.$g.'|'.$sub, 'brand|'.($r['brand']?:'?'), 'sand|'.($r['sand']?:'?')) as $key){ if(!isset($agg[$key])) $agg[$key]=array('n'=>0,'su_sav'=>0,'kaina_sum'=>0,'kbe_sum'=>0,'sav_sum'=>0,'instock'=>0); $a=&$agg[$key]; $a['n']++; $a['kaina_sum']+=$k; if($r['ss']==='instock')$a['instock']++; if($s>0){$a['su_sav']++;$a['kbe_sum']+=$kbe;$a['sav_sum']+=$s;} unset($a); }
      $prekes[]=array((int)$r['ID'],round($k,2),$s>0?round($s,2):null,$m!==null?round($m*100,1):null,$g,$sub,$r['brand'],$r['sand']);
    }
    foreach($agg as $k=>&$a){ $a['vid_kaina']=round($a['kaina_sum']/max(1,$a['n']),2); $a['marza_sv']=$a['kbe_sum']>0?round(100*($a['kbe_sum']-$a['sav_sum'])/$a['kbe_sum'],1):null; unset($a['kaina_sum'],$a['kbe_sum'],$a['sav_sum']); } unset($a);
    uasort($agg,function($x,$y){return $y['n']-$x['n'];});
    $o['be_kainos']=$be_kainos; $o['be_savikainos']=$be_sav; $o['marzos_pasiskirstymas']=$dist; $o['agg']=$agg;
    file_put_contents(wp_upload_dir()['basedir'].'/ps-backups/s1671_prekes_ekonomika.json', json_encode($prekes)); $o['prekes_failas']=count($prekes);
    // Fakt po T-0: pardavimai pagal gyvūną/kategoriją/kanalą
    $o['fakt_uzs']=$wpdb->get_results("SELECT COUNT(*) n, ROUND(SUM(viso_ct)/100) viso, ROUND(SUM(marza_ct)/100) marza, ROUND(SUM(kontribucija_ct)/100) kontrib, ROUND(SUM(pristatymas_savikaina_ct)/100) prist_sav, ROUND(SUM(pristatymas_paimta_ct)/100) prist_paimta, ROUND(SUM(mokejimo_mokestis_ct)/100) mok_mok, ROUND(SUM(pakuotes_savikaina_ct)/100) pak_sav, SUM(klientas_naujas) nauji FROM {$p}ps_fakt_uzsakymai WHERE testinis=0 AND apmoketa_at IS NOT NULL", ARRAY_A);
    $o['fakt_kanalai']=$wpdb->get_results("SELECT kanalas_paskutinis k, COUNT(*) n, ROUND(SUM(viso_ct)/100) viso, ROUND(SUM(marza_ct)/100) marza FROM {$p}ps_fakt_uzsakymai WHERE testinis=0 AND apmoketa_at IS NOT NULL GROUP BY k ORDER BY n DESC", ARRAY_A);
    $o['fakt_eil_gyv']=$wpdb->get_results("SELECT gyvunas, sandelis, COUNT(*) eil, SUM(kiekis) vnt, ROUND(SUM(kaina_ct)/100) suma, ROUND(SUM(kaina_ct-pvm_ct-savikaina_ct)/100) marza FROM {$p}ps_fakt_eilutes WHERE testinis=0 GROUP BY gyvunas, sandelis ORDER BY suma DESC", ARRAY_A);
  } catch (Throwable $e) { $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o, JSON_UNESCAPED_UNICODE); exit;
});
