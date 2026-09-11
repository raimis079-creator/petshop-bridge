<?php
/** Plugin Name: TEMP PS S1671 ekonomika A2 istorija */
add_action('init', function(){
  if (!isset($_GET['ps_s1671e']) || $_GET['ps_s1671e']!=='E2') return;
  header('Content-Type: application/json; charset=utf-8'); $o=array('v'=>'S1671e2'); global $wpdb; $p=$wpdb->prefix;
  try {
    $o['ist_span']=$wpdb->get_row("SELECT MIN(data) nuo, MAX(data) iki, COUNT(*) n, ROUND(SUM(suma)) suma FROM {$p}ps_ist_uzsakymai", ARRAY_A);
    $o['statusai']=$wpdb->get_results("SELECT statusas, ivykdytas, COUNT(*) n FROM {$p}ps_ist_uzsakymai GROUP BY statusas, ivykdytas ORDER BY n DESC LIMIT 10", ARRAY_A);
    $W="u.ivykdytas=1 AND u.data >= DATE_SUB('2026-09-08', INTERVAL 12 MONTH)";
    $o['12m']=$wpdb->get_row("SELECT COUNT(*) n, ROUND(SUM(suma)) suma, ROUND(AVG(suma),2) vid, COUNT(DISTINCT email) klientai FROM {$p}ps_ist_uzsakymai u WHERE $W", ARRAY_A);
    $o['12m_menesiai']=$wpdb->get_results("SELECT DATE_FORMAT(data,'%Y-%m') m, COUNT(*) n, ROUND(SUM(suma)) suma FROM {$p}ps_ist_uzsakymai u WHERE $W GROUP BY m ORDER BY m", ARRAY_A);
    $o['pakartotinumas']=$wpdb->get_row("SELECT COUNT(*) klientai, SUM(k>1) grize, ROUND(AVG(k),2) vid_uzs FROM (SELECT email, COUNT(*) k FROM {$p}ps_ist_uzsakymai u WHERE $W GROUP BY email) x", ARRAY_A);
    // eilutės su WP prekėmis → kategorija/brendas/savikaina
    $sql="SELECT e.wc_product_id pid, SUM(e.kiekis) vnt, ROUND(SUM(e.suma)) suma, COUNT(DISTINCT e.uzsakymo_id) uzs FROM {$p}ps_ist_eilutes e JOIN {$p}ps_ist_uzsakymai u ON u.id=e.uzsakymo_id WHERE $W AND e.wc_product_id>0 GROUP BY pid";
    $rows=$wpdb->get_results($sql, ARRAY_A); $o['susietu_prekiu']=count($rows);
    $o['nesusieta']=$wpdb->get_row("SELECT COUNT(*) eil, ROUND(SUM(e.suma)) suma FROM {$p}ps_ist_eilutes e JOIN {$p}ps_ist_uzsakymai u ON u.id=e.uzsakymo_id WHERE $W AND (e.wc_product_id IS NULL OR e.wc_product_id=0)", ARRAY_A);
    $ek=json_decode(file_get_contents(wp_upload_dir()['basedir'].'/ps-backups/s1671_prekes_ekonomika.json'),true); $map=array(); foreach($ek as $x){ $map[$x[0]]=$x; } // id,kaina,sav,marza%,gyv,sub,brand,sand
    $agg=array(); $top=array();
    foreach($rows as $r){ $x=$map[(int)$r['pid']]??null; $g=$x?$x[4]:'?'; $sub=$x?$x[5]:'?'; $b=$x?($x[6]?:'?'):'?'; $sand=$x?$x[7]:'?'; $m=$x?$x[3]:null; $suma=(float)$r['suma'];
      foreach(array('gyv|'.$g,'sub|'.$g.'|'.$sub,'brand|'.$b,'sand|'.$sand) as $k){ if(!isset($agg[$k]))$agg[$k]=array('suma'=>0,'vnt'=>0,'uzs'=>0,'prekiu'=>0,'marza_eur'=>0,'su_m'=>0); $a=&$agg[$k]; $a['suma']+=$suma; $a['vnt']+=(int)$r['vnt']; $a['uzs']+=(int)$r['uzs']; $a['prekiu']++; if($m!==null){$a['marza_eur']+=$suma/1.21*$m/100; $a['su_m']+=$suma;} unset($a); }
      $top[]=array((int)$r['pid'],$suma,(int)$r['vnt'],(int)$r['uzs'],$m,$g,$sub,$b,$sand);
    }
    foreach($agg as $k=>&$a){ $a['suma']=round($a['suma']); $a['marza_pct']=$a['su_m']>0?round(100*$a['marza_eur']/($a['su_m']/1.21),1):null; $a['marza_eur']=round($a['marza_eur']); unset($a['su_m']); } unset($a);
    uasort($agg,function($x,$y){return $y['suma']-$x['suma'];}); $o['agg']=$agg;
    usort($top,function($x,$y){return $y[1]<=>$x[1];}); $o['top40']=array_slice($top,0,40);
    foreach($o['top40'] as &$t){ $t[]=mb_substr(get_the_title($t[0]),0,50); } unset($t);
    file_put_contents(wp_upload_dir()['basedir'].'/ps-backups/s1671_istorija_prekes.json', json_encode($top));
    // pristatymo/vidutinis krepšelis
    $o['krepselis']=$wpdb->get_results("SELECT CASE WHEN suma<30 THEN '<30' WHEN suma<50 THEN '30-50' WHEN suma<80 THEN '50-80' WHEN suma<120 THEN '80-120' ELSE '120+' END g, COUNT(*) n, ROUND(SUM(suma)) suma FROM {$p}ps_ist_uzsakymai u WHERE $W GROUP BY g ORDER BY MIN(suma)", ARRAY_A);
    $o['siuntimas']=$wpdb->get_results("SELECT LEFT(siuntimas,40) s, COUNT(*) n FROM {$p}ps_ist_uzsakymai u WHERE $W GROUP BY s ORDER BY n DESC LIMIT 8", ARRAY_A);
  } catch (Throwable $e) { $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o, JSON_UNESCAPED_UNICODE); exit;
});
