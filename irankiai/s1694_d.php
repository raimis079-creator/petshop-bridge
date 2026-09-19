<?php
/** TEMP PS S1694 d — /my-account/augintinis/ ir /paskyra/augintinis/ kaip svečias; laiskai.php kontekstas; WC myaccount slug + endpoint'ai; refill engine feedback. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1694d'])) return; global $wpdb; $o=array(); $p=$wpdb->prefix;
  foreach (array('/my-account/augintinis/','/paskyra/augintinis/','/paskyra/augintiniai/','/paskyra/') as $u){ $r=wp_remote_get(home_url($u),array('timeout'=>20,'redirection'=>0)); if (is_wp_error($r)){$o['url'][$u]=$r->get_error_message();continue;} $b=wp_remote_retrieve_body($r); preg_match('/<title>(.*?)<\/title>/si',$b,$mt); $t=preg_replace('/\s+/',' ',wp_strip_all_tags(preg_replace('#<(script|style)[^>]*>.*?</\1>#si','',$b))); $o['url'][$u]=array('kodas'=>wp_remote_retrieve_response_code($r),'location'=>wp_remote_retrieve_header($r,'location'),'title'=>$mt[1]??null,'tekstas'=>mb_substr($t,0,400)); }
  $f=WP_CONTENT_DIR.'/mu-plugins/petshop-laiskai.php'; $s=file_get_contents($f); $o['laiskai_md5']=md5($s); $o['laiskai_dydis']=strlen($s);
  $pos=strpos($s,"'feedback_url'    => home_url"); $o['laiskai_kontekstas']=substr($s,max(0,$pos-1500),2200);
  $o['myaccount_page']=get_permalink(wc_get_page_id('myaccount')); $o['endpoints']=array_keys((array)WC()->query->get_query_vars());
  $o['ps_endpointai']=$wpdb->get_col("SELECT option_name FROM {$p}options WHERE option_name LIKE 'woocommerce_myaccount_%endpoint'");
  // kur registruojamas augintinio puslapis
  $hits=array(); foreach (array_merge(glob(WP_CONTENT_DIR.'/mu-plugins/*.php'),glob(WP_CONTENT_DIR.'/mu-plugins/petshop-core/includes/*.php'),glob(WP_CONTENT_DIR.'/mu-plugins/petshop-core/*.php')) as $ff){ $ss=file_get_contents($ff); if (preg_match('/add_rewrite_endpoint\s*\(\s*[\'"]([a-z\-]+)/',$ss,$m)||strpos($ss,'/augintin')!==false){ preg_match_all('/.{0,80}(add_rewrite_endpoint|\/augintin[a-z]*\/?|mano-augintin).{0,120}/',$ss,$mm); $hits[str_replace(WP_CONTENT_DIR,'',$ff)]=array_slice(array_unique($mm[0]),0,5);} }
  $o['augintinio_puslapis_kode']=$hits;
  $o['puslapiai']=$wpdb->get_results("SELECT ID,post_name,post_status FROM {$p}posts WHERE post_type='page' AND (post_name LIKE '%augintin%' OR post_content LIKE '%pet_profile%' OR post_content LIKE '%ps_pet%' OR post_content LIKE '%skaiciuokl%') LIMIT 10",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
