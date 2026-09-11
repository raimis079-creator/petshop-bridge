<?php
/** Plugin Name: TEMP PS S1671 VF sekimo recon */
add_action('init', function(){
  $f = isset($_GET['ps_s1671r']) ? $_GET['ps_s1671r'] : ''; if ($f !== 'R') return;
  header('Content-Type: application/json; charset=utf-8');
  $o = array('v'=>'S1671r');
  try {
    global $wpdb; $p=$wpdb->prefix;
    $o['cron_next'] = wp_next_scheduled('ps_venipak_sekimas') ? gmdate('Y-m-d H:i:s', wp_next_scheduled('ps_venipak_sekimas')).' UTC' : 'NĖRA';
    $o['now_utc'] = gmdate('Y-m-d H:i:s');
    $o['paskutinis'] = get_option('ps_venipak_sekimas_paskutinis');
    $nrs = array('1000','1001','1007','1013','1014','1017');
    $ids = $wpdb->get_col("SELECT order_id FROM {$p}wc_orders_meta WHERE meta_key='_ps_order_number' AND meta_value IN ('".implode("','",$nrs)."')");
    $kand = array();
    if (class_exists('Petshop_Darbalaukis')) { $rc = new ReflectionClass('Petshop_Darbalaukis'); if ($rc->hasMethod('sekimo_kandidatai')) { $m=$rc->getMethod('sekimo_kandidatai'); $m->setAccessible(true); $kand=$m->invoke(null); } }
    $o['kandidatai_n'] = count($kand);
    foreach ($ids as $id) {
      $ord = wc_get_order($id); if(!$ord) continue;
      $r = array('id'=>$id,'nr'=>$ord->get_meta('_ps_order_number'),'status'=>$ord->get_status(),'kandidatas'=>in_array((int)$id,$kand,true));
      foreach (array('_ps_siuntos','_ps_venipak_sekimas','_ps_dalys_issiusta','_ps_vf_siunta','_ps_dropship','_ps_vf_sekimo') as $k) { $v=$ord->get_meta($k); if($v!=='' && $v!==null) $r[$k]= is_string($v)? mb_substr($v,0,600) : $v; }
      $meta = $wpdb->get_results($wpdb->prepare("SELECT meta_key, LEFT(meta_value,120) v FROM {$p}wc_orders_meta WHERE order_id=%d AND (meta_key LIKE '%%siunt%%' OR meta_key LIKE '%%venipak%%' OR meta_key LIKE '%%vf%%' OR meta_key LIKE '%%drop%%' OR meta_key LIKE '%%sekim%%' OR meta_key LIKE '%%track%%')", $id), ARRAY_A);
      $r['meta_raktai'] = $meta;
      if (class_exists('Petshop_Siuntos')) { $r['reg'] = Petshop_Siuntos::sarasas($id); }
      $notes = wc_get_order_notes(array('order_id'=>$id,'limit'=>6)); $r['pastabos']=array(); foreach($notes as $n){ $r['pastabos'][]=$n->date_created->date('m-d H:i').' '.mb_substr($n->content,0,140); }
      $o['uzs'][] = $r;
    }
    // Tiesioginis Venipak API testas vienam VF numeriui
    $t='V07267E1000065';
    $rr = wp_remote_get('https://tracking.venipak.com/api/v1/events?pack_no='.$t, array('timeout'=>15,'headers'=>array('Accept'=>'application/json')));
    $o['api_test'] = is_wp_error($rr) ? $rr->get_error_message() : array('code'=>wp_remote_retrieve_response_code($rr),'body'=>mb_substr(wp_remote_retrieve_body($rr),0,1200));
    // Cron žurnalas: paskutiniai ps įvykiai su venipak
    $o['ivykiai'] = $wpdb->get_results("SELECT uzsakymas, veiksmas, rezultatas, LEFT(pastaba,80) p, laikas FROM {$p}ps_uzsakymu_ivykiai WHERE kanalas='venipak' ORDER BY id DESC LIMIT 8", ARRAY_A);
  } catch (Throwable $e) { $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o, JSON_UNESCAPED_UNICODE); exit;
});
