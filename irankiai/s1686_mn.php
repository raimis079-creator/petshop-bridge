<?php
/** TEMP PS S1686 mn — PATIKRA (atskira užklausa): lentelė sukurta; testinis cid terra@gyvunai.lt (user pagal el. paštą), prekė 12466; grąžina test URL. */
add_action('init', function(){
  if (!isset($_GET['ps_s1686mn'])) return; global $wpdb; $o=array('v'=>'S1686 mn'); $t=Petshop_Relaunch::t();
  $o['lentele']=$wpdb->get_var("SHOW TABLES LIKE '$t'"); $o['cols']=$wpdb->get_col("SHOW COLUMNS FROM $t");
  $u=get_user_by('email','terra@gyvunai.lt'); $cid=$wpdb->get_var($wpdb->prepare("SELECT cid FROM $t WHERE email=%s",'terra@gyvunai.lt'));
  if(!$cid){ $cid=Petshop_Relaunch::cid(); $wpdb->insert($t,array('cid'=>$cid,'email'=>'terra@gyvunai.lt','user_id'=>$u?$u->ID:null,'segmentas'=>'calc','product_id'=>12466,'rusis'=>'dog','svoriai'=>'10,20,30','sukurta_at'=>current_time('mysql',true))); }
  $o['test_url']=add_query_arg(array('svoris'=>20,'utm_source'=>'sender','utm_medium'=>'email','utm_campaign'=>'relaunch','utm_content'=>'calc','utm_term'=>'20kg','cid'=>$cid),get_permalink(12466));
  $o['eilute']=$wpdb->get_row($wpdb->prepare("SELECT * FROM $t WHERE cid=%s",$cid),ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
