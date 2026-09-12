<?php
/** TEMP PS S1676 run m — VF siuntos: ar uždarytos, ar laiškai klientams išėjo. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676m'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 m');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $ids=$wpdb->get_col("SELECT id FROM {$p}wc_orders WHERE type='shop_order' AND date_created_gmt>='2026-09-09' AND status NOT IN ('wc-cancelled','wc-checkout-draft','trash') ORDER BY id");
  foreach($ids as $id){ $w=wc_get_order($id); if(!$w) continue; $sh=$w->get_meta('_ps_shipments'); $shs=is_array($sh)?$sh:(is_string($sh)?json_decode($sh,true):null);
    $r=array('nr'=>$w->get_order_number(),'st'=>$w->get_status(),'sukurta'=>$w->get_date_created()->date('m-d H:i'),'siuntos'=>array());
    if(is_array($shs)) foreach($shs as $k=>$s){ if(!is_array($s)) continue; $r['siuntos'][]=array_intersect_key($s,array_flip(array('sandelis','vezejas','tracking','siuntos_nr','busena','status','issiusta','issiusta_at','pristatyta','pristatyta_at','uzdaryta','kodas','venipak_kodas','paskutinis_kodas'))); }
    $notes=wc_get_order_notes(array('order_id'=>$id,'limit'=>40)); $r['pastabos']=array(); foreach($notes as $n){ $c=(string)$n->content; if(preg_match('/laišk|Venipak|LP |išsiųst|uždar|pristat|VF|tiekėj/iu',$c)) $r['pastabos'][]=$n->date_created->date('m-d H:i').' '.mb_substr(preg_replace('/\s+/',' ',$c),0,140); }
    $r['pastabos']=array_slice($r['pastabos'],0,8);
    $o['uzs'][$id]=$r; }
  $o['fakt_siuntos']=$wpdb->get_results("SELECT uzsakymas_id,sandelis,vezejas,siuntos_nr,statusas,isvezta_at,pristatyta_at,atsiimta_at FROM {$p}ps_fakt_siuntos WHERE sukurta_at>='2026-09-09' ORDER BY uzsakymas_id",ARRAY_A);
  $o['wc_shipped_emails']=$wpdb->get_results("SELECT id,flow,status,skip_reason,sent_at FROM {$p}ps_email_jobs WHERE flow IN ('order_shipped') AND created_at>='2026-09-09' ORDER BY id",ARRAY_A);
  $o['cron_venipak']=wp_next_scheduled('ps_venipak_sekimas')?date('m-d H:i',wp_next_scheduled('ps_venipak_sekimas')):'NĖRA';
  $o['sekimo_log']=$wpdb->get_results("SELECT option_name n, LEFT(option_value,600) v FROM {$p}options WHERE option_name LIKE 'ps_venipak_sek%' OR option_name LIKE 'ps_siuntu_sek%' LIMIT 5",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
