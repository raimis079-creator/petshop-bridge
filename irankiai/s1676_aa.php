<?php
/** TEMP PS S1676 run aa — #35886 faktuose V…73–76 (kartotos registracijos) → statusas atsaukta (Raimis: Venipak sutvarkė rankomis). */
add_action('init', function(){
  if (!isset($_GET['ps_s1676aa'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 aa'); $t=$p.'ps_fakt_siuntos';
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $nr=array('V07267E1000073','V07267E1000074','V07267E1000075','V07267E1000076');
  $o['pries']=$wpdb->get_results("SELECT id,siuntos_nr,statusas FROM $t WHERE uzsakymas_id=35886 ORDER BY siuntos_nr",ARRAY_A);
  $in="'".implode("','",$nr)."'";
  $o['pakeista']=$wpdb->query("UPDATE $t SET statusas='atsaukta', isvezta_at=NULL, dienos_iki_pristatymo=NULL WHERE uzsakymas_id=35886 AND siuntos_nr IN ($in)");
  $o['po']=$wpdb->get_results("SELECT id,siuntos_nr,statusas,isvezta_at FROM $t WHERE uzsakymas_id=35886 ORDER BY siuntos_nr",ARRAY_A);
  $w=wc_get_order(35886); $w->add_order_note('Faktai: siuntos V…73–76 (kartotos Venipak registracijos, Raimis atšaukė rankomis) pažymėtos „atsaukta“ (S1676).',false,true); $w->save();
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
});
