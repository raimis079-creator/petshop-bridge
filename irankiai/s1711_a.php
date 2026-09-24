<?php
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1711a'])) return;
  $r=[];
  $rf=ABSPATH.'robots.txt'; $r['robots_file']=file_exists($rf)?file_get_contents($rf):null;
  $rm=get_option('rank-math-options-general'); $r['rm_robots']=is_array($rm)&&isset($rm['robots_txt_content'])?$rm['robots_txt_content']:'(nera)';
  $r['rm_modules']=get_option('rank_math_modules');
  // 404 plugin
  $f=WPMU_PLUGIN_DIR.'/petshop-404-atitikmuo.php'; $c=file_exists($f)?file_get_contents($f):''; $r['404_md5']=md5($c); $r['404_len']=strlen($c);
  preg_match_all('/(const [A-Z_]+|function [a-z_]+)/',$c,$m); $r['404_struct']=$m[0];
  $i=strpos($c,'ALIAS'); $r['404_alias_snip']=$i!==false?substr($c,$i,1500):substr($c,0,1500);
  // legacy map
  $lm=glob(WPMU_PLUGIN_DIR.'/*legacy*'); $r['legacy_files']=$lm;
  foreach($lm as $x){ if(substr($x,-5)==='.json'){ $j=json_decode(file_get_contents($x),true); $r['legacy_n'][$x]=is_array($j)?count($j):0; $ks=array_filter(array_keys((array)$j),function($k){return stripos($k,'blog')!==false||stripos($k,'route')!==false;}); $r['legacy_blog'][$x]=array_slice(array_map(function($k)use($j){return [$k,$j[$k]];},array_values($ks)),0,15);} }
  // blog print -> how handled now
  foreach(['/index.php?route=blog/article/prints&blogid=21&view=print','/index.php?route=blog/article&blogid=21','/?route=blog/article&blogid=21'] as $u){ $h=wp_remote_get(home_url($u),['timeout'=>20,'sslverify'=>false,'redirection'=>0]); $r['blog'][$u]=wp_remote_retrieve_response_code($h).' '.wp_remote_retrieve_header($h,'location').' '.wp_remote_retrieve_header($h,'x-redirect-by'); }
  // posts
  $r['posts']=array_map(function($p){return [$p->ID,$p->post_name,$p->post_type];}, get_posts(['post_type'=>['post','page'],'posts_per_page'=>200,'post_status'=>'publish','meta_key'=>'_legacy_blogid']));
  global $wpdb; $r['meta_keys_legacy']=$wpdb->get_col("SELECT DISTINCT meta_key FROM {$wpdb->postmeta} WHERE meta_key LIKE '%legacy%' OR meta_key LIKE '%blog%' LIMIT 30");
  // brand archive schema source
  $r['wc_sd_hooks']=[]; global $wp_filter; foreach(['woocommerce_shop_loop','rank_math/json_ld','wp_footer'] as $hk){ if(isset($wp_filter[$hk])) foreach($wp_filter[$hk]->callbacks as $pr=>$cbs) foreach($cbs as $k=>$cb){ $fn=$cb['function']; $n=is_array($fn)?(is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]:(is_string($fn)?$fn:'closure'); $r['wc_sd_hooks'][$hk][]=$pr.' '.$n; } }
  $b=wp_remote_retrieve_body(wp_remote_get(home_url('/gamintojas/exclusion/?nc='.time()),['timeout'=>30,'sslverify'=>false]));
  preg_match_all('#<script[^>]*ld\+json[^>]*>(.*?)</script>#s',$b,$mm); $r['brand_ld']=array_map(function($x){return substr($x,0,300).' ... '.substr($x,-600);},$mm[1]);
  wp_send_json($r);
}, 1);
