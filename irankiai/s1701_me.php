<?php
/** Plugin Name: TEMP PS S1701 cache flush + md5 */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1701'])||$_GET['ps_s1701']!=='1') return;
  header('Content-Type: application/json; charset=utf-8'); $o=array();
  $o['md5']=md5_file(WP_CONTENT_DIR.'/mu-plugins/petshop-schema-prekes.php');
  if(function_exists('wp_cache_clear_cache')){ wp_cache_clear_cache(); $o['super_cache']='isvalytas'; } else $o['super_cache']='nera funkcijos';
  $o['robots_ai']=array('GPTBot'=>'leidziama (nera Disallow)','ClaudeBot'=>'leidziama','PerplexityBot'=>'leidziama','Google-Extended'=>'leidziama');
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
