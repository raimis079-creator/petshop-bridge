<?php
/** TEMP PS S1685 md — RECON read-only: soft opt-out laukui — lentelės ps_consent_log/ps_kontaktai/ps_email_suppression, kasos tipas, mu-plugin vardai, usermeta ps_soft_optin_eligible kiekiai. */
add_action('init', function(){
  if (!isset($_GET['ps_s1685md'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1685 md');
  foreach(array('ps_consent_log','ps_kontaktai','ps_email_suppression','ps_email_jobs') as $t){ $tt=$p.$t; $ex=$wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s',$tt)); $o['t'][$t]=$ex?array('cols'=>$wpdb->get_col("SHOW COLUMNS FROM $tt"),'n'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM $tt")):null; }
  if($o['t']['ps_consent_log']) $o['log_pvz']=$wpdb->get_results("SELECT * FROM {$p}ps_consent_log ORDER BY id DESC LIMIT 2",ARRAY_A);
  $o['mu']=array_map('basename',glob(WPMU_PLUGIN_DIR.'/petshop-sut*')); $o['cls']=class_exists('Petshop_Sutikimai');
  $pg=get_option('woocommerce_checkout_page_id'); $c=get_post($pg); $o['kasa']=array('id'=>$pg,'blocks'=>has_block('woocommerce/checkout',$c),'shortcode'=>strpos($c->post_content,'woocommerce_checkout')!==false);
  $o['elig_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}usermeta WHERE meta_key='ps_soft_optin_eligible'");
  $o['optout_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}usermeta WHERE meta_key='ps_similar_optout'");
  $o['consent_cls']=array_values(array_filter(get_declared_classes(),function($c){return stripos($c,'consent')!==false||stripos($c,'contact_policy')!==false;}));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
