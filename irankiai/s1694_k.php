<?php
/** TEMP PS S1694 k — petshop-xml v1.5.19 → v1.5.20 (žurnalo dieta: STOCK SYNC tik pasikeitus, be „Import #3" eilutės, rotacija >20 MB → gz); fazė 2: 191 MB zb-import.log → ps-archyvas gz; fazė 3: patikra. */
add_action('init', function(){
  if (!isset($_GET['ps_s1694k'])) return; global $wpdb; $o=array(); $f=$_GET['ps_s1694k'];
  $u=wp_upload_dir(); $bakdir=$u['basedir'].'/ps-backups'; if (!is_dir($bakdir)) @mkdir($bakdir,0755,true);
  $path=WP_PLUGIN_DIR.'/petshop-xml/petshop-xml.php';
  if ($f==='1'){
    $c=file_get_contents($path); $o['md5_pries']=md5($c); if ($o['md5_pries']!=='20c67db8aa86226b9b25af59a6bf8e27'){ $o['STOP']='md5 ne v1.5.19'; goto out; }
    $pairs=array(
      " * Version:     1.5.19\n" => " * Version:     1.5.20\n",
      " * Author:      petshop.lt\n *\n * v1.5.18 (2026-06-15)" => " * Author:      petshop.lt\n *\n * v1.5.20 (2026-09-19, S1694): ŽURNALO DIETA — zb-import.log augo ~22 tūkst. eil./d. (191 MB):\n *   „Import #3 (STOCK) for post\" eilutė nebe rašoma; „STOCK SYNC\" rašoma tik pasikeitus\n *   likučiui (meta _zb_qty_log_prev, formatas zb_qty=buvo→dabar); petshop_xml_log()\n *   rotuoja failą >20 MB į zb-import.log.<data>.gz tame pačiame kataloge, saugo 6.\n *\n * v1.5.18 (2026-06-15)",
      "    if ( \$current_import_id === 3 ) {\n        petshop_xml_log( \"Import #3 (STOCK) for post {\$post_id}\" );\n        petshop_xml_sync_only" => "    if ( \$current_import_id === 3 ) {\n        // v1.5.20: „Import #3\" eilutė nebe rašoma — STOCK SYNC (tik pasikeitus) pakanka.\n        petshop_xml_sync_only",
      "        \$fulfillment->recalculate( \$post_id );\n        petshop_xml_log( \"STOCK SYNC post {\$post_id} | zb_qty={\$zb_qty}\" );\n" => "        \$fulfillment->recalculate( \$post_id );\n        // v1.5.20 (S1694): STOCK SYNC eilutė tik pasikeitus likučiui.\n        \$prev_log = get_post_meta( \$post_id, '_zb_qty_log_prev', true );\n        if ( \$prev_log === '' || (int) \$prev_log !== \$zb_qty ) {\n            petshop_xml_log( \"STOCK SYNC post {\$post_id} | zb_qty=\" . ( \$prev_log === '' ? '?' : (int) \$prev_log ) . \"→{\$zb_qty}\" );\n            update_post_meta( \$post_id, '_zb_qty_log_prev', \$zb_qty );\n        }\n",
      "    file_put_contents( \$file, '['.date('Y-m-d H:i:s').'] '.\$msg.PHP_EOL, FILE_APPEND | LOCK_EX );\n}\n" => "    // v1.5.20 (S1694): rotacija >20 MB → .gz tame pačiame (deny from all) kataloge.\n    if ( file_exists( \$file ) && filesize( \$file ) > 20 * 1048576 ) {\n        petshop_xml_log_rotuoti( \$file );\n    }\n    file_put_contents( \$file, '['.date('Y-m-d H:i:s').'] '.\$msg.PHP_EOL, FILE_APPEND | LOCK_EX );\n}\n\n/** v1.5.20 (S1694): žurnalo rotacija — gzip į <failas>.<data>.gz, failas ištuštinamas, saugomi 6 paskutiniai archyvai. */\nfunction petshop_xml_log_rotuoti( string \$file ): void {\n    \$gz  = \$file . '.' . date( 'Y-m-d_His' ) . '.gz';\n    \$in  = @fopen( \$file, 'rb' );\n    if ( ! \$in ) { return; }\n    \$out = @gzopen( \$gz, 'wb6' );\n    if ( ! \$out ) { fclose( \$in ); return; }\n    while ( ! feof( \$in ) ) { gzwrite( \$out, (string) fread( \$in, 1048576 ) ); }\n    fclose( \$in ); gzclose( \$out );\n    if ( filesize( \$gz ) > 0 ) { file_put_contents( \$file, '', LOCK_EX ); }\n    \$seni = glob( dirname( \$file ) . '/' . basename( \$file ) . '.*.gz' );\n    if ( \$seni && count( \$seni ) > 6 ) { sort( \$seni ); foreach ( array_slice( \$seni, 0, count( \$seni ) - 6 ) as \$s ) { @unlink( \$s ); } }\n}\n",
    );
    $crlf=strpos($c,"\r\n")!==false; $o['crlf']=$crlf; if ($crlf){ $pp=array(); foreach ($pairs as $a=>$b) $pp[str_replace("\n","\r\n",$a)]=str_replace("\n","\r\n",$b); $pairs=$pp; }
    $n=0; foreach ($pairs as $a=>$b){ $cnt=substr_count($c,$a); if ($cnt!==1){ $o['STOP']="pakeitimas nerastas vieną kartą ($cnt): ".mb_substr($a,0,70); goto out; } $c=str_replace($a,$b,$c); $n++; }
    try { token_get_all($c, TOKEN_PARSE); } catch (Throwable $e) { $o['STOP']='PARSE KLAIDA: '.$e->getMessage(); goto out; }
    $bak=$bakdir.'/petshop-xml.php.bak_s1694'; if (!copy($path,$bak)){ $o['STOP']='bak nepavyko'; goto out; }
    if (file_put_contents($path,$c)===false){ copy($bak,$path); $o['STOP']='rašymas nepavyko'; goto out; }
    $o['pakeitimu']=$n; $o['md5_po']=md5_file($path); $o['bak']=str_replace($u['basedir'],'',$bak);
    $r=wp_remote_get(home_url('/'),array('timeout'=>25,'sslverify'=>false)); $code=is_wp_error($r)?0:wp_remote_retrieve_response_code($r); $o['heartbeat']=$code;
    if ($code>=500 || $code===0){ copy($bak,$path); $o['ROLLBACK']=true; $o['md5_po_rollback']=md5_file($path); }
  }
  if ($f==='2'){
    @set_time_limit(280); $pl=WP_CONTENT_DIR.'/uploads/petshop-private-logs/zb-import.log'; $arch=dirname(ABSPATH).'/ps-archyvas'; if (!is_dir($arch)) @mkdir($arch,0755,true);
    $gz=$arch.'/zb-import.log.iki_2026-09-19.s1694.gz'; $o['pries_dydis']=filesize($pl); $t0=microtime(true);
    $in=fopen($pl,'rb'); $out=gzopen($gz,'wb6'); $n=0; while(!feof($in)){ $b=fread($in,1048576); gzwrite($out,$b); $n+=strlen($b); } fclose($in); gzclose($out);
    $o['gz']=array('kelias'=>$gz,'dydis'=>filesize($gz),'perrasyta_baitu'=>$n,'sek'=>round(microtime(true)-$t0,1));
    if ($n===$o['pries_dydis'] && filesize($gz)>1000){ $o['istustinta']=file_put_contents($pl,'',LOCK_EX)!==false; } else $o['istustinta']='NE — dydis nesutapo';
    $o['po_dydis']=filesize($pl);
  }
  if ($f==='3'){
    $o['md5']=md5_file($path); $o['versija']=preg_match('/Version:\s+([\d.]+)/',file_get_contents($path),$m)?$m[1]:null; $o['funkcija_rotuoti']=function_exists('petshop_xml_log_rotuoti');
    $pl=WP_CONTENT_DIR.'/uploads/petshop-private-logs/zb-import.log'; $o['log_dydis']=file_exists($pl)?filesize($pl):null;
    $o['log_gz']=array_map('basename',glob(WP_CONTENT_DIR.'/uploads/petshop-private-logs/zb-import.log.*.gz')?:array());
    $o['archyvas']=array_map(function($x){return basename($x).' '.filesize($x);},glob(dirname(ABSPATH).'/ps-archyvas/zb-import*')?:array());
    $o['prev_meta_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->postmeta} WHERE meta_key='_zb_qty_log_prev'");
    $o['zb_cron_kitas']=wp_next_scheduled('wp_all_import_cron')?:null;
    $el=dirname(ABSPATH).'/logs/php_error.log'; $o['php_error_log_dydis']=file_exists($el)?filesize($el):null; $o['php_error_uodega']=file_exists($el)?array_slice(file($el),-3):null;
  }
  out:
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
