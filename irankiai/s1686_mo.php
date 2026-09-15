<?php
/** TEMP PS S1686 mo — NARŠYKLĖS TESTAS: prekės 12466 puslapis su ?svoris=20&cid=... (svečias) — ar skaičiuoklė užsipildė ir suskaičiavo; po to serveryje: klik_n, usermeta ps_weight_signal, ps_web_ivykiai eilutė. */
add_action('init', function(){
  if (!isset($_GET['ps_s1686mo'])) return; global $wpdb; $o=array('v'=>'S1686 mo'); $t=Petshop_Relaunch::t();
  $cid=$wpdb->get_var($wpdb->prepare("SELECT cid FROM $t WHERE email=%s",'terra@gyvunai.lt'));
  $u=add_query_arg(array('svoris'=>20,'utm_source'=>'sender','utm_medium'=>'email','utm_campaign'=>'relaunch','utm_content'=>'calc','utm_term'=>'20kg','cid'=>$cid),get_permalink(12466));
  if(isset($_GET['po'])){
    $o['eilute']=$wpdb->get_row($wpdb->prepare("SELECT klik_n,pask_klik_at,pask_svoris FROM $t WHERE cid=%s",$cid),ARRAY_A);
    $o['usermeta']=get_user_meta(44,'ps_weight_signal',true);
    $o['ivykis']=$wpdb->get_results("SELECT laikas,tipas,raktas,raktas2,reiksme,kampanija,kanalas,prisijunges FROM {$wpdb->prefix}ps_web_ivykiai WHERE tipas='email_calc_click' ORDER BY id DESC LIMIT 3",ARRAY_A);
  } else {
    $o['shots']=array(array('n'=>'s1686_calc20','u'=>$u,'eval'=>"new Promise(function(r){setTimeout(function(){var w=document.getElementById('ps-calc-w'),o=document.querySelector('.ps-calc-out');r({w:w?w.value:null,out:o?o.innerText.slice(0,500):null,scrollY:window.scrollY});},4000);})",'full'=>0));
  }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
