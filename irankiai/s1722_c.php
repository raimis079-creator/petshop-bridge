<?php
/** Plugin Name: TEMP PS S1722c read-only: snippet 572 pilnas kodas (b64) + feeds ids fn + rytas fragmentai + kategoriju slug'ai */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1722c'])) return; $r=['v'=>'S1722c']; global $wpdb; $P=$wpdb->prefix;
  try{
    $c=$wpdb->get_var("SELECT code FROM {$P}snippets WHERE id=572"); $r['s572_len']=strlen($c); $r['s572_md5']=md5($c); $r['s572_b64']=base64_encode($c);
    $r['s572_row']=$wpdb->get_row("SELECT id,name,scope,active,priority,modified FROM {$P}snippets WHERE id=572",ARRAY_A);
    $r['feeds_md5']=md5(file_get_contents(WP_PLUGIN_DIR.'/petshop-feeds/petshop-feeds.php'));
    $r['feeds_ver_line']=preg_match("#define\('PS_FEEDS_VERSIJA'[^\n]*#",file_get_contents(WP_PLUGIN_DIR.'/petshop-feeds/petshop-feeds.php'),$m)?$m[0]:null;
    // kategoriju slug'ai DP baziniu ir seimu nariu
    $r['cats']=$wpdb->get_results("SELECT t.term_id,t.slug,t.name,tt.parent,tt.count FROM {$P}terms t JOIN {$P}term_taxonomy tt ON tt.term_id=t.term_id WHERE tt.taxonomy='product_cat' AND (t.slug LIKE '%sausas%' OR t.slug LIKE '%konserv%' OR t.slug LIKE '%skanest%' OR t.slug LIKE '%kraik%' OR t.slug LIKE '%maistas%' OR t.term_id=91) ORDER BY tt.parent,t.slug",ARRAY_A);
    $r['brand_josera']=$wpdb->get_results("SELECT t.term_id,t.slug,t.name FROM {$P}terms t JOIN {$P}term_taxonomy tt ON tt.term_id=t.term_id WHERE tt.taxonomy='product_brand' AND t.slug LIKE '%josera%'",ARRAY_A);
    $r['ps_dp_opcijos']=$wpdb->get_results("SELECT option_name FROM {$P}options WHERE option_name LIKE 'ps_dp%'",ARRAY_A);
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
