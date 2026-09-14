<?php
/** TEMP PS S1681 f — read-only: Ads signalai — ps_fakt_reklama 7 d. (konversijos iš Ads) vs WC užsakymai su gclid/google atribucija. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681f'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1681 f');
  $o['cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_reklama");
  $o['ads']=$wpdb->get_results("SELECT diena,kampanija,islaidos_ct isl,paspaudimai kl,konversijos konv".(in_array('konv_verte_ct',$o['cols'])?',konv_verte_ct kv':'')." FROM {$p}ps_fakt_reklama WHERE kanalas='google_ads' AND diena>='2026-09-07' ORDER BY diena,kampanija",ARRAY_A);
  $o['ads_pask']=get_option('ps_ads_paskutinis');
  $ids=$wpdb->get_col("SELECT id FROM {$p}wc_orders WHERE type='shop_order' AND status IN('wc-processing','wc-completed','wc-on-hold') AND date_created_gmt>='2026-09-06 21:00:00' ORDER BY id");
  foreach($ids as $id){ $w=wc_get_order($id); $g=$w->get_meta('_ps_gclid'); $src=$w->get_meta('_wc_order_attribution_utm_source'); $st=$w->get_meta('_wc_order_attribution_source_type');
    if($g||stripos($src,'google')!==false){ $d=$w->get_date_created(); $d->setTimezone(new DateTimeZone('Europe/Vilnius')); $dd=$d->format('m-d'); $o['wc'][$dd]['n']=($o['wc'][$dd]['n']??0)+1; $o['wc'][$dd]['eur']=round(($o['wc'][$dd]['eur']??0)+$w->get_total(),2); $o['wc'][$dd]['nr'][]=$w->get_order_number().($g?'':'(be gclid)').' '.$src.'/'.$st.' '.$w->get_status(); } }
  $o['e']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
