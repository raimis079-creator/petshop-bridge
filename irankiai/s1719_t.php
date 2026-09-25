<?php
/** Plugin Name: TEMP PS S1719t — DB higiena: 1 sausas, 2 vykdyti (neaktyvūs snippetai → gz + DELETE; snippets_bak_s636 → gz + DROP; shortpixel_* → postmeta gz + DROP; pasibaigę transientai), 9 snippetų atstatymas iš gz */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1719t'])) return; $f=$_GET['ps_s1719t']; $r=['v'=>'S1719t','faze'=>$f]; @set_time_limit(250); @ini_set('memory_limit','768M'); global $wpdb; $p=$wpdb->prefix;
  $arch='/home/gyvunai2/domains/petshop.lt/ps-archyvas/s1719-db'; $q=function($s) use($wpdb){ $x=$wpdb->get_results($s,ARRAY_A); return $wpdb->last_error?['SQL_ERR'=>$wpdb->last_error]:$x; };
  $dump=function($sql,$file) use($wpdb,$arch){ $rows=$wpdb->get_results($sql,ARRAY_A); if($wpdb->last_error) throw new Exception($wpdb->last_error); $gz=gzencode(json_encode($rows,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE),6); if(!$gz) throw new Exception('gz '.$file); if(file_put_contents($arch.'/'.$file,$gz)===false) throw new Exception('rašymas '.$file); $chk=json_decode(gzdecode(file_get_contents($arch.'/'.$file)),true); if(!is_array($chk)||count($chk)!==count($rows)) throw new Exception('patikra '.$file); return [count($rows),round(strlen($gz)/1024).'kb']; };
  $size=function($t) use($wpdb){ return $wpdb->get_row($wpdb->prepare("SELECT TABLE_ROWS r,ROUND((DATA_LENGTH+INDEX_LENGTH)/1048576,1) mb FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=%s",$t),ARRAY_A); };
  try{
    $sp=$wpdb->get_col("SHOW TABLES LIKE '{$p}shortpixel%'"); $bk=$wpdb->get_col("SHOW TABLES LIKE '{$p}snippets_bak%'");
    $r['pries']=['snippets_neaktyvus'=>$q("SELECT COUNT(*) n,ROUND(SUM(LENGTH(code))/1048576,1) mb,SUM(name LIKE 'TEMP%') temp FROM {$p}snippets WHERE active=0"),'snippets_aktyvus'=>$q("SELECT COUNT(*) n FROM {$p}snippets WHERE active=1"),'snippets_bak'=>array_map(function($t) use($size){return [$t,$size($t)];},$bk),'shortpixel'=>array_map(function($t) use($size){return [$t,$size($t)];},$sp),'shortpixel_aktyvus'=>in_array('shortpixel-image-optimiser/wp-shortpixel.php',(array)get_option('active_plugins')),'transientai_pasibaige'=>$q("SELECT COUNT(*) n FROM {$p}options WHERE option_name LIKE '_transient_timeout_%' AND option_value+0<UNIX_TIMESTAMP()"),'db_mb'=>$q("SELECT ROUND(SUM(DATA_LENGTH+INDEX_LENGTH)/1048576,1) mb FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE()")];
    if($f==='2'){ if(!is_dir($arch)) mkdir($arch,0700,true);
      $r['gz']['snippets-inactive']=$dump("SELECT * FROM {$p}snippets WHERE active=0",'snippets-inactive-s1719.json.gz');
      $del=$wpdb->query("DELETE FROM {$p}snippets WHERE active=0"); $r['snippets_istrinta']=$del;
      foreach($bk as $t){ $r['gz'][$t]=$dump("SELECT * FROM `$t`",$t.'-s1719.json.gz'); $wpdb->query("DROP TABLE `$t`"); $r['drop'][]=$t; }
      if(!$r['pries']['shortpixel_aktyvus']){ foreach($sp as $t){ if(strpos($t,'postmeta')!==false||strpos($t,'meta')!==false||strpos($t,'folders')!==false) $r['gz'][$t]=$dump("SELECT * FROM `$t`",$t.'-s1719.json.gz'); $wpdb->query("DROP TABLE `$t`"); $r['drop'][]=$t; } } else $r['shortpixel']='aktyvus — neliesta';
      $r['transientai']=delete_expired_transients(true);
      $wpdb->query("OPTIMIZE TABLE {$p}snippets"); wp_cache_flush();
      $r['po']=['snippets'=>$q("SELECT active,COUNT(*) n,ROUND(SUM(LENGTH(code))/1024) kb FROM {$p}snippets GROUP BY active"),'lenteles_liko'=>array_merge($wpdb->get_col("SHOW TABLES LIKE '{$p}shortpixel%'"),$wpdb->get_col("SHOW TABLES LIKE '{$p}snippets_bak%'")),'db_mb'=>$q("SELECT ROUND(SUM(DATA_LENGTH+INDEX_LENGTH)/1048576,1) mb FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE()"),'archyvas'=>array_map(function($x){return [basename($x),round(filesize($x)/1024).'kb'];},glob($arch.'/*'))];
      $hb=wp_remote_get('https://petshop.lt/?ps_hb='.time(),['timeout'=>25,'sslverify'=>false]); $r['hb']=is_wp_error($hb)?'ERR':wp_remote_retrieve_response_code($hb); }
    if($f==='9'){ $rows=json_decode(gzdecode(file_get_contents($arch.'/snippets-inactive-s1719.json.gz')),true); $n=0; foreach($rows as $row){ if($wpdb->get_var($wpdb->prepare("SELECT id FROM {$p}snippets WHERE id=%d",$row['id']))) continue; $wpdb->insert("{$p}snippets",$row); $n++; } $r['atstatyta']=$n; }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},1);
