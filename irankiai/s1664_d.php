<?php
/** TEMP PS S1664 d — įdiegia nuolatinį snippetą „Petshop Spastai ReducedStock v1.0": backtrace kai trinama _reduced_stock eilutės meta. */
add_action('init', function(){
  if (!isset($_GET['ps_s1664d'])) return;
  $o=array('v'=>'S1664 d'); global $wpdb; $p=$wpdb->prefix;
  $yra=$wpdb->get_var("SELECT id FROM {$p}snippets WHERE name LIKE 'Petshop Spastai ReducedStock%'");
  if($yra){ $o['jau_yra']=(int)$yra; wp_send_json($o); }
  $code=<<<'CODE'
add_filter('delete_order_item_metadata', function($check,$item_id,$meta_key){
  if($meta_key==='_reduced_stock'){
    $l=get_option('ps_rs_trap',array()); if(!is_array($l)) $l=array();
    $l[]=array('t'=>current_time('mysql'),'item'=>(int)$item_id,
      'uri'=>substr(isset($_SERVER['REQUEST_URI'])?$_SERVER['REQUEST_URI']:'',0,140),
      'ajax'=>defined('DOING_AJAX')&&DOING_AJAX?1:0,'cron'=>defined('DOING_CRON')&&DOING_CRON?1:0,
      'bt'=>substr(wp_debug_backtrace_summary(null,2),0,900));
    if(count($l)>30) $l=array_slice($l,-30);
    update_option('ps_rs_trap',$l,false);
  }
  return $check;
},10,3);
CODE;
  $t=token_get_all('<?php '.$code, TOKEN_PARSE); // sintaksės sargas
  $ok=$wpdb->insert("{$p}snippets",array('name'=>'Petshop Spastai ReducedStock v1.0 (bt i ps_rs_trap)','description'=>'S1664: backtrace kai trinama _reduced_stock. Laikinas iki šaknies radimo.','code'=>$code,'tags'=>'','scope'=>'global','priority'=>9,'active'=>1,'modified'=>current_time('mysql')));
  $o['insert']=$ok?(int)$wpdb->insert_id:'FAIL '.$wpdb->last_error;
  $o['ping']=wp_remote_retrieve_response_code(wp_remote_get(home_url('/'),array('timeout'=>30,'sslverify'=>false)));
  wp_send_json($o);
});
