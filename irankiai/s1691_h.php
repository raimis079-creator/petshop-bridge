<?php
/** TEMP PS S1691 h — deploy: (1) dim-klientai v1.1.1 replace + klientai v1.1.1 strtolower + petshop-xml v1.5.19 array→string; (2) dim perskaičiavimas + patikra; (3) php_error.log rotacija. */
add_action('init', function(){
  if (!isset($_GET['ps_s1691h'])) return; global $wpdb; $p=$wpdb->prefix; $o=array(); $wpdb->suppress_errors(true); $f=$_GET['ps_s1691h'];
  $u=wp_upload_dir(); $bakdir=$u['basedir'].'/ps-backups'; if (!is_dir($bakdir)) @mkdir($bakdir,0755,true); $o['bakdir']=is_dir($bakdir);
  $patch=function($path,$pairs,$verOld,$verNew) use ($bakdir,&$o){ $k=basename($path); $c=file_get_contents($path); if ($c===false) return $o[$k]='neperskaityta';
    $crlf=strpos($c,"\r\n")!==false; $o[$k.'_crlf']=$crlf; if ($crlf){ $pp=array(); foreach ($pairs as $a=>$b) $pp[str_replace("\n","\r\n",$a)]=str_replace("\n","\r\n",$b); $pairs=$pp; $verOld=$verOld===null?null:str_replace("\n","\r\n",$verOld); $verNew=str_replace("\n","\r\n",$verNew); }
    $md5_pries=md5($c); $n=0; foreach ($pairs as $a=>$b){ $cnt=substr_count($c,$a); if ($cnt!==1) return $o[$k]="pakeitimas nerastas vieną kartą ($cnt): ".mb_substr($a,0,60); $c=str_replace($a,$b,$c); $n++; }
    if ($verOld!==null){ $cnt=substr_count($c,$verOld); if ($cnt!==1) return $o[$k]="versija nerasta ($cnt)"; $c=str_replace($verOld,$verNew,$c); }
    try { token_get_all($c, TOKEN_PARSE); } catch (Throwable $e) { return $o[$k]='PARSE KLAIDA: '.$e->getMessage(); }
    $bak=$bakdir.'/'.$k.'.bak_s1691'; if (!copy($path,$bak)) return $o[$k]='bak nepavyko';
    if (file_put_contents($path,$c)===false){ copy($bak,$path); return $o[$k]='rašymas nepavyko'; }
    $o[$k]=array('pakeitimu'=>$n,'md5_pries'=>$md5_pries,'md5_po'=>md5_file($path),'bak'=>str_replace($u['basedir'],'',$bak)); return true; };
  if ($f==='1'){
    // A) dim-klientai: insert → replace (raktas PRIMARY; lentelė išvestinė)
    $patch(WPMU_PLUGIN_DIR.'/petshop-dim-klientai.php', array(
      "foreach ( \$duom as \$d ) { if ( \$wpdb->insert( \$t, \$d ) ) { \$rez['irasyta']++; } }" =>
      "/* S1691: replace vietoj insert — 09-08 eilutės liko su aplinka='dev', DELETE WHERE aplinka='prod' jų nelietė ir kas naktį visi 5 431 INSERT krito Duplicate PRIMARY (43 MB php_error.log, dim nesikeitė nuo 09-08). */\n\t\tforeach ( \$duom as \$d ) { if ( \$wpdb->replace( \$t, \$d ) ) { \$rez['irasyta']++; } }"
    ), " * Version: 1.1\n", " * Version: 1.1.1\n");
    // B) klientai: el. pašto raktas lowercase
    $patch(WPMU_PLUGIN_DIR.'/petshop-klientai.php', array(
      "foreach ( \$eil as \$r ) { \$uid = \$emails[ \$r['email'] ]; \$pid" =>
      "foreach ( \$eil as \$r ) { \$uid = \$emails[ strtolower( \$r['email'] ) ] ?? 0; if ( ! \$uid ) continue; \$pid"
    ), " * Version: 1.1\n", " * Version: 1.1.1\n");
    // C) petshop-xml: masyvas → tekstas (ZB $data['category']/['brand'] ateina masyvu → „Array" → excluded_brand vartai nesuveikdavo)
    $patch(WP_PLUGIN_DIR.'/petshop-xml/petshop-xml.php', array(
      "    \$name     = (string) ( \$data['name'] ?? '' );\n    \$category = (string) ( \$data['category'] ?? '' );\n    \$brand    = (string) ( \$data['brand'] ?? '' );" =>
      "    \$name     = petshop_xml_tekstas( \$data['name'] ?? '' );\n    \$category = petshop_xml_tekstas( \$data['category'] ?? '' ); // S1691: masyvas → tekstas\n    \$brand    = petshop_xml_tekstas( \$data['brand'] ?? '' );",
      "\$brand       = (string) ( \$data['brand'] ?? '' );\n" => "\$brand       = petshop_xml_tekstas( \$data['brand'] ?? '' );\n",
      "\$category    = (string) ( \$data['category'] ?? '' );\n" => "\$category    = petshop_xml_tekstas( \$data['category'] ?? '' );\n",
      "function petshop_xml_block_zb_create( \$continue_import, \$data, \$import_id ) {" =>
      "/** S1691 (v1.5.19): WP All Import lauką gali paduoti masyvu (kategorijų kelias, keli brand'ai) — (string) davė „Array“ + warning. Masyvas suplojamas į tekstą. */\nfunction petshop_xml_tekstas( \$v ) {\n    if ( is_array( \$v ) ) { \$plok = array(); array_walk_recursive( \$v, function( \$x ) use ( &\$plok ) { \$x = trim( (string) \$x ); if ( \$x !== '' ) \$plok[] = \$x; } ); return implode( ' ', \$plok ); }\n    return (string) \$v;\n}\n\nfunction petshop_xml_block_zb_create( \$continue_import, \$data, \$import_id ) {"
    ), " * Version:     1.5.18\n", " * Version:     1.5.19\n");
    // heartbeat
    $r=wp_remote_get(home_url('/'),array('timeout'=>25,'sslverify'=>false)); $code=is_wp_error($r)?0:wp_remote_retrieve_response_code($r); $o['heartbeat']=$code;
    if ($code>=500 || $code===0){ foreach (array(WPMU_PLUGIN_DIR.'/petshop-dim-klientai.php',WPMU_PLUGIN_DIR.'/petshop-klientai.php',WP_PLUGIN_DIR.'/petshop-xml/petshop-xml.php') as $path){ $bak=$bakdir.'/'.basename($path).'.bak_s1691'; if (file_exists($bak)) copy($bak,$path); } $o['ROLLBACK']=true; }
  }
  if ($f==='2'){
    $o['pries']=$wpdb->get_row("SELECT COUNT(*) n, MAX(perskaiciuota_at) max_p, SUM(aplinka='dev') dev, SUM(aplinka='prod') prod FROM {$p}ps_dim_klientai",ARRAY_A);
    $o['dev_istrinta']=$wpdb->query("DELETE FROM {$p}ps_dim_klientai WHERE aplinka='dev'"); // išvestinė lentelė, senos 09-08 eilutės
    $t0=microtime(true); @set_time_limit(280); do_action('ps_dim_klientu_perskaiciavimas'); $o['hook_kabliai']=has_action('ps_dim_klientu_perskaiciavimas'); $o['sek']=round(microtime(true)-$t0,1);
    $o['po']=$wpdb->get_row("SELECT COUNT(*) n, MAX(perskaiciuota_at) max_p, SUM(aplinka='dev') dev, SUM(aplinka='prod') prod, SUM(segmentas IS NOT NULL) seg FROM {$p}ps_dim_klientai",ARRAY_A);
    $o['segmentai']=$wpdb->get_results("SELECT segmentas, COUNT(*) n FROM {$p}ps_dim_klientai GROUP BY segmentas ORDER BY n DESC",ARRAY_A);
    $o['db_err']=$wpdb->last_error; $o['opcija']=get_option('ps_dim_klientu_paskutinis');
  }
  if ($f==='3'){
    $pl=dirname(ABSPATH).'/logs/php_error.log'; $arch=dirname(ABSPATH).'/ps-archyvas'; if (!is_dir($arch)) @mkdir($arch,0755,true);
    $gz=$arch.'/php_error.log.2026-09-11_18.s1691.gz'; $o['pries_dydis']=filesize($pl);
    $in=fopen($pl,'rb'); $out=gzopen($gz,'wb6'); $n=0; while(!feof($in)){ $b=fread($in,1048576); gzwrite($out,$b); $n+=strlen($b); } fclose($in); gzclose($out);
    $o['gz']=array('dydis'=>filesize($gz),'perrasyta_baitu'=>$n);
    if ($n===$o['pries_dydis'] && filesize($gz)>1000){ $o['istustinta']=file_put_contents($pl,'')!==false; } else $o['istustinta']='NE — dydis nesutapo';
    $o['po_dydis']=filesize($pl);
  }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
