<?php
/** TEMP PS S1683t q — read-only: partijos lentelė, #23 būklė (dezes, svoris, venipak_pack, pristatymas, busena), eilutės. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683tq'])) return; global $wpdb; $o=array('v'=>'q');
  $r=new ReflectionMethod('Petshop_AV_Tiekimas','t_partijos'); $r->setAccessible(true); $t=$r->invoke(null); $o['t']=$t;
  $o['p23']=$wpdb->get_row("SELECT * FROM $t WHERE id=23",ARRAY_A);
  $o['kaupiamos']=$wpdb->get_results("SELECT id,tiekejas,busena,pristatymas,dezes,svoris,venipak_pack,venipak_manifest,sukurta_at FROM $t WHERE busena='kaupiama' OR id>=20 ORDER BY id DESC LIMIT 6",ARRAY_A);
  $r=new ReflectionMethod('Petshop_AV_Tiekimas','partijos_eilutes'); $r->setAccessible(true); $o['eil23']=array_map(function($e){return (array)$e;},$r->invoke(null,23));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
