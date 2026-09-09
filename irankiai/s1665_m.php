<?php
/** TEMP PS S1665 m — E2E: POST i ads-recon su raktu, patikra ps_ads_recon. */
add_action('init', function(){
  if (!isset($_GET['ps_s1665m'])) return;
  $o=array('v'=>'S1665 m');
  $k=get_option('ps_ads_raktas','');
  $r=wp_remote_post(home_url('/?rest_route=/ps-web/v1/ads-recon'),array('timeout'=>20,'body'=>json_encode(array('test'=>'s1665m')),'headers'=>array('Content-Type'=>'application/json','x-ps-key'=>$k)));
  $o['atsakas']=is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r).' '.wp_remote_retrieve_body($r);
  wp_cache_delete('ps_ads_recon','options');
  $rec=get_option('ps_ads_recon');
  $o['irasyta']=is_array($rec)?$rec['kada'].' '.$rec['dydis'].'B':'NERA';
  // be rakto — 403?
  $r2=wp_remote_post(home_url('/?rest_route=/ps-web/v1/ads-recon'),array('timeout'=>15,'body'=>'{}'));
  $o['be_rakto']=is_wp_error($r2)?'ERR':wp_remote_retrieve_response_code($r2);
  wp_send_json($o);
});
