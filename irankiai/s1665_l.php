<?php
/** TEMP PS S1665 l — OPT_RAKTAS reikšmė (jei tuščia — sugeneruoja) + snippetas „Petshop Ads Recon Priemiklis v1.0" (REST ps-web/v1/ads-recon). */
add_action('init', function(){
  if (!isset($_GET['ps_s1665l'])) return;
  $o=array('v'=>'S1665 l'); global $wpdb; $p=$wpdb->prefix;
  $s=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-fakt-reklama.php');
  preg_match("/OPT_RAKTAS\s*=\s*'([^']+)'/",$s,$m);
  $opt=$m[1]??''; $o['opt_vardas']=$opt;
  $v=$opt?get_option($opt,''):'';
  if($opt && $v===''){ $v=bin2hex(random_bytes(16)); update_option($opt,$v,false); $o['sugeneruota']=1; }
  $o['raktas']=$v;
  $yra=$wpdb->get_var("SELECT id FROM {$p}snippets WHERE name LIKE 'Petshop Ads Recon Priemiklis%'");
  if($yra){ $o['jau_yra']=(int)$yra; wp_send_json($o); }
  $code=<<<'CODE'
add_action('rest_api_init', function(){
  register_rest_route('ps-web/v1','/ads-recon',array(
    'methods'=>'POST','permission_callback'=>'__return_true',
    'callback'=>function($req){
      $k=(string)$req->get_header('x-ps-key');
      $opt=''; $s=@file_get_contents(WPMU_PLUGIN_DIR.'/petshop-fakt-reklama.php');
      if($s && preg_match("/OPT_RAKTAS\s*=\s*'([^']+)'/",$s,$m)) $opt=$m[1];
      $tikras=$opt?(string)get_option($opt,''):'';
      if(!$k || !$tikras || !hash_equals($tikras,$k)) return new WP_REST_Response(array('ok'=>0,'klaida'=>'raktas'),403);
      $b=$req->get_body();
      if(strlen($b)>400000) return new WP_REST_Response(array('ok'=>0,'klaida'=>'per_didelis'),413);
      update_option('ps_ads_recon',array('kada'=>current_time('mysql'),'dydis'=>strlen($b),'body'=>$b),false);
      return new WP_REST_Response(array('ok'=>1,'dydis'=>strlen($b)),200);
    }));
});
CODE;
  token_get_all('<?php '.$code, TOKEN_PARSE);
  $ok=$wpdb->insert("{$p}snippets",array('name'=>'Petshop Ads Recon Priemiklis v1.0 (ps-web/v1/ads-recon i ps_ads_recon)','description'=>'S1665: Ads Script recon JSON priemimas. Laikinas iki Ads sutvarkymo.','code'=>$code,'tags'=>'','scope'=>'global','priority'=>9,'active'=>1,'modified'=>current_time('mysql')));
  $o['insert']=$ok?(int)$wpdb->insert_id:'FAIL '.$wpdb->last_error;
  $o['ping']=wp_remote_retrieve_response_code(wp_remote_get(home_url('/'),array('timeout'=>30,'sslverify'=>false)));
  wp_send_json($o);
});
