<?php
/** TEMP PS S1665 p — READ-ONLY: Ads skelbimu final URL likimas naujame saite (301/404/200). */
add_action('init', function(){
  if (!isset($_GET['ps_s1665p'])) return;
  $o=array('v'=>'S1665 p');
  $urls=array(
    '/pagrindinis-meniu/sunims-2',
    '/pagrindinis-meniu/katems-2',
    '/pagrindinis-meniu/zuvims-2',
    '/index.php?route=product/search&filter_name=animoda&page=1',
    '/sunims/maistas-sunims?filters=151-prekes-zenklas[GranCarno]',
    '/index.php?route=product/search&filter_name=prins%20pup',
    '/',
  );
  foreach($urls as $u){
    $r=wp_remote_get(home_url($u),array('timeout'=>15,'redirection'=>0));
    $c=is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r);
    $loc=is_wp_error($r)?'':(string)wp_remote_retrieve_header($r,'location');
    if($loc){ $r2=wp_remote_get($loc,array('timeout'=>15,'redirection'=>0)); $c.=' -> '.substr($loc,strlen(home_url())).' ['.(is_wp_error($r2)?'ERR':wp_remote_retrieve_response_code($r2)).']'; }
    $o['url'][$u]=$c;
  }
  wp_send_json($o);
});
