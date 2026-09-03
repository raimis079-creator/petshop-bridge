<?php
/** TEMP PS S1608 run e3q — v3.9 patikra: neapmokėtas ne Klausimuose; keliai be tiekėjo; variklio pranešimas */
add_action('init', function(){
  if (!isset($_GET['ps_e3q'])) return;
  $o=array('v'=>'run e3q'); global $wpdb; $p=$wpdb->prefix; set_time_limit(200);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $u=get_user_by('login','testuotojas'); wp_set_current_user($u->ID); $o['versija']=Petshop_Darbalaukis::VERSIJA;
  try{
    $fk=new ReflectionMethod('Petshop_Darbalaukis','faktai'); $fk->setAccessible(true); $sk=new ReflectionMethod('Petshop_Darbalaukis','skydelis'); $sk->setAccessible(true);
    // neapmokėtas: pending su AV preke
    $ord=wc_create_order(array('customer_id'=>0)); $ord->set_address(array('first_name'=>'AUDITAS','last_name'=>'Testas 34','email'=>'terra@petshop.lt','country'=>'LT'),'billing'); $ord->add_product(wc_get_product(19708),1); $ord->set_payment_method('bacs'); $ord->calculate_totals(); $ord->update_status('pending'); $ord->save(); $oid=$ord->get_id();
    $f=$fk->invoke(null,wc_get_order($oid),array()); $o['neapmoketas']=array('id'=>$oid,'kl'=>$f['kl'],'eiles'=>$f['eiles'],'naujas'=>$f['naujas']);
    $ord->update_status('failed'); $f=$fk->invoke(null,wc_get_order($oid),array()); $o['failed']=array('kl'=>$f['kl'],'eiles'=>$f['eiles']);
    wc_get_order($oid)->delete(true);
    // keliai be tiekėjo — grynai AV prekė 19708 (#35444 arba #35450)
    $f=$fk->invoke(null,wc_get_order(35450),array()); $s=$sk->invoke(null,$f); foreach($s['eil'] as $e){ $o['keliai'][]=$e['n'].' → '.implode(' | ',array_map(function($k){return $k['t'].($k['on']?'*':'');},$e['keliai'])); }
    // variklio pranešimo vertimas
    $_GET['pd_ok']='kons_ok'; $_GET['pd_nr']='35450|2'; $pr=new ReflectionMethod('Petshop_Darbalaukis','pranesimas'); $pr->setAccessible(true); ob_start(); $pr->invoke(null); $o['pran_kons']=wp_strip_all_tags(ob_get_clean());
    $_GET['pd_ok']='vp_ok'; $_GET['pd_nr']='1 · AV'; ob_start(); $pr->invoke(null); $o['pran_vp']=wp_strip_all_tags(ob_get_clean());
    $_GET['pd_ok']='pakuotes'; $_GET['pd_nr']='3'; ob_start(); $pr->invoke(null); $o['pran_pak']=wp_strip_all_tags(ob_get_clean());
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
