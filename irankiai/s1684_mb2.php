<?php
/** TEMP PS S1684 mb2 — READ-ONLY: savikainos reikšmės tikrinimas (PVM), ist kaina/pvm sample, gyvų ps_fakt_eilutes marža pagal brendą. */
add_action('init', function(){
  if (!isset($_GET['ps_s1684mb2'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1684 mb2'); $wpdb->suppress_errors(true);
  $E="{$p}ps_ist_fakt_eilutes"; $U="{$p}ps_ist_fakt_uzsakymai"; $F="{$p}ps_fakt_eilutes";
  $o['ist_sample']=$wpdb->get_results("SELECT e.sku,e.kiekis,e.kaina_ct,e.pvm_ct,e.kaina_vnt_ct,e.kaina_reguliari_ct,e.nuolaida_ct FROM $E e JOIN $U u ON u.uzsakymas_id=e.uzsakymas_id WHERE u.apmoketa_at>'2026-06-01' AND e.brendas_slug IN('josera','exclusion') ORDER BY RAND() LIMIT 6",ARRAY_A);
  $o['ist_pvm_fill']=$wpdb->get_row("SELECT COUNT(*) n, SUM(pvm_ct>0) su_pvm, ROUND(AVG(pvm_ct/kaina_ct),3) pvm_dalis FROM $E WHERE kaina_ct>0",ARRAY_A);
  $o['cp_source']=$wpdb->get_results("SELECT meta_value s, COUNT(*) n FROM {$p}postmeta WHERE meta_key='_cost_price_source' GROUP BY meta_value",ARRAY_A);
  foreach(array(18587=>'HYPS06 Exclusion',17978=>'JOS0008 Josera',18560=>'HYPM11') as $id=>$l){ $r=array('l'=>$l); foreach(array('_cost_price','_price','_regular_price','_vf_cost','_zb_cost','_cost_price_source','_sku') as $k) $r[$k]=get_post_meta($id,$k,true); $r['sources']=$wpdb->get_results("SELECT source,cost_net,stock_qty,is_active FROM {$p}ps_sources WHERE product_id=$id",ARRAY_A); $r['partijos']=$wpdb->get_results("SELECT gauta,kiekis_gautas,savikaina_eur,tiekejas FROM {$p}ps_partijos WHERE product_id=$id ORDER BY id DESC LIMIT 3",ARRAY_A); $o['pav'][$id]=$r; }
  $o['fakt_live']=$wpdb->get_results("SELECT brendas_slug b, COUNT(*) n, ROUND(SUM(kaina_ct)/100) eur, ROUND(SUM(pvm_ct)/100) pvm, ROUND(SUM(savikaina_ct)/100) sav, GROUP_CONCAT(DISTINCT savikainos_saltinis) salt, ROUND((1-SUM(savikaina_ct)/NULLIF(SUM(kaina_ct),0))*100,1) marza_net FROM $F GROUP BY b ORDER BY eur DESC LIMIT 12",ARRAY_A);
  $o['fakt_live_sample']=$wpdb->get_results("SELECT sku,kiekis,kaina_ct,pvm_ct,savikaina_vnt_ct,savikaina_ct,savikainos_saltinis FROM $F ORDER BY id DESC LIMIT 5",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
