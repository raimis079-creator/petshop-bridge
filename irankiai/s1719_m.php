<?php
/** Plugin Name: TEMP PS S1719m — po saugumo paketo: nuotraukos/webp/feed/kasa patikra (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1719m'])) return; $r=['v'=>'S1719m']; global $wpdb; $p=$wpdb->prefix;
  $img=$wpdb->get_var("SELECT guid FROM {$p}posts WHERE post_type='attachment' AND post_mime_type IN ('image/jpeg','image/png') AND guid LIKE '%/2026/09/%' ORDER BY ID DESC LIMIT 1");
  $urls=[$img,'https://petshop.lt/feed/kaina24/','https://petshop.lt/feed/kainos/','https://petshop.lt/kasa/','https://petshop.lt/parduotuve/','https://petshop.lt/wp-content/uploads/complianz/css/banner-1-optin.css','https://petshop.lt/wp-content/uploads/wpallimport/files/vf-feed.xml'];
  foreach(array_filter($urls) as $u){ $rs=wp_remote_get($u,['timeout'=>15,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-audit','headers'=>['Accept'=>'image/webp,*/*'],'limit_response_size'=>500]); $r['http'][$u]=is_wp_error($rs)?'ERR':wp_remote_retrieve_response_code($rs).' '.substr((string)wp_remote_retrieve_header($rs,'content-type'),0,20); }
  $r['vf_cache_readable']=is_readable(WP_CONTENT_DIR.'/uploads/petshop-vf-cache.xml'); $r['wpai_file_readable']=is_readable(WP_CONTENT_DIR.'/uploads/wpallimport/files/vf-feed.xml');
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE); exit;
},1);
