<?php
/** Plugin Name: TEMP PS S1704o3 psc snippet paieska */
add_action('init', function(){
  $f=(isset($_GET['ps_s1704o'])?$_GET['ps_s1704o']:''); if($f!=='1') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1704o3');
  try{ global $wpdb; $p=$wpdb->prefix;
    $o['lenteles']=$wpdb->get_col("SHOW TABLES LIKE '%snippet%'");
    $t=$o['lenteles'][0]??($p.'snippets');
    $o['aktyvus']=$wpdb->get_results("SELECT id,name,LENGTH(code) ilgis FROM {$t} WHERE active=1 ORDER BY id",ARRAY_A);
    $rows=$wpdb->get_results("SELECT id,name,active FROM {$t} WHERE code LIKE '%akcij%' OR code LIKE '%psc_%' OR code LIKE '%on_sale%'",ARRAY_A);
    $o['kandidatai']=$rows;
    foreach($rows as $r){ if($r['active']){ $c=$wpdb->get_var($wpdb->prepare("SELECT code FROM {$t} WHERE id=%d",$r['id'])); if(stripos($c,'akcij')!==false||stripos($c,'sol-hero')!==false||stripos($c,'on_sale')!==false) $o['kodas'][$r['id']]=$c; } }
    // shortcode registravimas — kur? pabandom Reflection per closure static vars
    global $shortcode_tags; $cb=$shortcode_tags['psc_akcijos']??null;
    if($cb instanceof Closure){ $rf=new ReflectionFunction($cb); $o['closure']=array('failas'=>$rf->getFileName(),'eil'=>$rf->getStartLine().'-'.$rf->getEndLine(),'static'=>array_keys($rf->getStaticVariables())); }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
