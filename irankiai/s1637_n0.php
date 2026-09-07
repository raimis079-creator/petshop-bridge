<?php
/** TEMP PS S1637 run n0 — VISIŠKAS AV LIKUČIŲ NULINIMAS (Raimio sprendimas 09-07): kopija → visos partijos trinamos → visi _stock=0, _own_stock_qty šalinami → lookup sync → kontrolė Σ=0. */
add_action('init', function(){
  if (!isset($_GET['ps_s1637n'])) return;
  $o=array('v'=>'S1637 n0'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280); ini_set('memory_limit','768M');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $up=wp_upload_dir(); $bk=trailingslashit($up['basedir']).'ps-backups/likuciai-pries-nulinima-'.date('Y-m-d_Hi'); wp_mkdir_p($bk);
  $meta=$wpdb->get_results("SELECT post_id,meta_key,meta_value FROM {$p}postmeta WHERE meta_key IN('_stock','_own_stock_qty')",ARRAY_A);
  file_put_contents($bk.'/stock_meta.json.gz',gzencode(wp_json_encode($meta)));
  $pt=$wpdb->get_results("SELECT * FROM {$p}ps_partijos",ARRAY_A);
  file_put_contents($bk.'/ps_partijos.json.gz',gzencode(wp_json_encode($pt)));
  $o['kopija']=array('meta_eil'=>count($meta),'partijos'=>count($pt),'dir'=>str_replace($up['basedir'],'',$bk));
  $o['pries']=array('stock_suma'=>(int)$wpdb->get_var("SELECT SUM(meta_value+0) FROM {$p}postmeta WHERE meta_key='_stock'"),
    'own_suma'=>(int)$wpdb->get_var("SELECT SUM(meta_value+0) FROM {$p}postmeta WHERE meta_key='_own_stock_qty'"));
  $o['istrinta_partiju']=(int)$wpdb->query("DELETE FROM {$p}ps_partijos");
  $o['stock_nulinta']=(int)$wpdb->query("UPDATE {$p}postmeta SET meta_value='0' WHERE meta_key='_stock' AND meta_value<>'0'");
  $o['own_istrinta']=(int)$wpdb->query("DELETE FROM {$p}postmeta WHERE meta_key='_own_stock_qty'");
  $wpdb->query("UPDATE {$p}wc_product_meta_lookup SET stock_quantity=0 WHERE stock_quantity IS NOT NULL AND stock_quantity<>0");
  foreach(array('ps_s1637_bak','ps_s1637_seen','ps_s1636x_done') as $k) delete_option($k);
  wp_cache_flush();
  $o['kontrole']=array('stock_suma'=>(int)$wpdb->get_var("SELECT SUM(meta_value+0) FROM {$p}postmeta WHERE meta_key='_stock'"),
    'stock_gt0'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}postmeta WHERE meta_key='_stock' AND meta_value+0>0"),
    'own_eil'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}postmeta WHERE meta_key='_own_stock_qty'"),
    'partijos'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_partijos"),
    'lookup_gt0'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_product_meta_lookup WHERE stock_quantity>0"));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
