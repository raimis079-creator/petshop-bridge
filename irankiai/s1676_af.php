<?php
/** TEMP PS S1676 run af — ar Raimio ranka įvesti AV likučiai išliko: 203 prekėms own vs partijų suma + paskutinis rankinis _own pakeitimas. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676af'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 af');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $pids=$wpdb->get_col("SELECT DISTINCT product_id FROM {$p}ps_partijos WHERE pastaba LIKE '%papildymas, S1682%'");
  $sut=0; $nesut=array(); $rank=0;
  foreach($pids as $pid){ $own=get_post_meta($pid,'_own_stock_qty',true); $own=($own===''?null:(int)$own); $suma=(int)$wpdb->get_var($wpdb->prepare("SELECT COALESCE(SUM(kiekis_liko),0) FROM {$p}ps_partijos WHERE product_id=%d AND atsaukta=0",$pid));
    $iv=$wpdb->get_row($wpdb->prepare("SELECT sena,nauja,kas,saltinis,LEFT(laikas,16) t,pastaba FROM {$p}ps_ivykiai WHERE product_id=%d AND laukas='_own_stock_qty' ORDER BY id DESC LIMIT 1",$pid),ARRAY_A);
    if($iv && (int)$iv['kas']>0) $rank++;
    if($own===$suma) $sut++; else $nesut[]=array('pid'=>$pid,'pav'=>mb_substr(get_the_title($pid),0,45),'own'=>$own,'partiju_suma'=>$suma,'pask_ivykis'=>$iv?($iv['t'].' '.$iv['sena'].'→'.$iv['nauja'].' kas='.$iv['kas'].' '.$iv['saltinis']):'-'); }
  $o['prekiu']=count($pids); $o['own_sutampa_su_partijomis']=$sut; $o['nesutampa']=count($nesut); $o['su_rankiniu_ivykiu']=$rank; $o['nesut_sar']=array_slice($nesut,0,40);
  $o['ivykiu_pvz']=$wpdb->get_results("SELECT product_id,sena,nauja,kas,saltinis,LEFT(laikas,16) t,LEFT(pastaba,60) pa FROM {$p}ps_ivykiai WHERE laukas='_own_stock_qty' AND laikas>='2026-09-09' ORDER BY id DESC LIMIT 15",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
});
