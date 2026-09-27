<?php
/** Plugin Name: TEMP PS S1725r read-only: WPAI #2 būklė (ZB products) — imports eilutė, istorija, šaltinis, kiti importai palyginimui */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1725r'])) return; $r=['v'=>'S1725r','dabar_utc'=>gmdate('Y-m-d H:i:s')]; global $wpdb; $P=$wpdb->prefix;
  try{
    foreach($wpdb->get_results("SELECT * FROM {$P}pmxi_imports ORDER BY id",ARRAY_A) as $im){ $o=@unserialize($im['options']);
      $r['imports'][$im['id']]=['name'=>$im['name'],'friendly'=>$im['friendly_name']??null,'type'=>$im['type'],'path'=>mb_substr((string)$im['path'],0,150),'triggered'=>$im['triggered'],'processing'=>$im['processing'],'executing'=>$im['executing'],'canceled'=>$im['canceled'],'failed'=>$im['failed']??null,'queue_chunk'=>$im['queue_chunk_number'],'count'=>$im['count'],'imported'=>$im['imported'],'created'=>$im['created'],'updated'=>$im['updated'],'skipped'=>$im['skipped'],'deleted'=>$im['deleted'],'last_activity'=>$im['last_activity'],'registered_on'=>$im['registered_on'],'iteration'=>$im['iteration']??null,'selective_hashing'=>$o['is_selective_hashing']??null,'records_per_request'=>$o['records_per_request']??null,'update_all'=>$o['update_all_data']??null,'is_update_price'=>$o['is_update_price']??null,'is_update_custom_fields'=>$o['is_update_custom_fields']??null,'create_new'=>$o['create_new_records']??null];
    }
    $r['hist2']=$wpdb->get_results("SELECT id,type,time_run,date,LEFT(summary,160) s FROM {$P}pmxi_history WHERE import_id=2 ORDER BY id DESC LIMIT 25",ARRAY_A);
    $r['hist2_dienos']=$wpdb->get_results("SELECT DATE(date) d, COUNT(*) n, SUM(summary LIKE '%finished%') baigta, MAX(time_run) max_s FROM {$P}pmxi_history WHERE import_id=2 AND date>=UTC_TIMESTAMP()-INTERVAL 10 DAY GROUP BY DATE(date) ORDER BY d DESC",ARRAY_A);
    $up=wp_upload_dir()['basedir']; foreach(glob($up.'/wpallimport/files/*')?:[] as $f) $r['failai'][]=basename($f).' '.filesize($f).' '.date('Y-m-d H:i',filemtime($f));
    $r['zb_prekiu']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$P}postmeta WHERE meta_key='_zb_enabled' AND meta_value='yes'");
    $r['zb_atnaujinta_24h']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$P}postmeta m JOIN {$P}posts p ON p.ID=m.post_id WHERE m.meta_key='_zb_enabled' AND m.meta_value='yes' AND p.post_modified_gmt>=UTC_TIMESTAMP()-INTERVAL 24 HOUR");
    $r['pmxi_posts_2']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$P}pmxi_posts WHERE import_id=2");
    $r['pmxi_posts_2_iter']=$wpdb->get_results("SELECT iteration, COUNT(*) n FROM {$P}pmxi_posts WHERE import_id=2 GROUP BY iteration ORDER BY iteration DESC LIMIT 5",ARRAY_A);
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
