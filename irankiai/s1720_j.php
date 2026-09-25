<?php
/** Plugin Name: TEMP PS S1720j — 2.17 deploy: 1 = plugin (DATA) + schema handlingTime 1–2 + heartbeat; 2 = /pristatymas/ sausas (rodo atitikmenis); 4 = /pristatymas/ rašyti; 3 = testai; 9 = atstatyti viską */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1720j'])) return; $f=$_GET['ps_s1720j']; $r=['v'=>'S1720j','faze'=>$f,'t'=>date('Y-m-d H:i:s')];
  global $wpdb; $p=$wpdb->prefix; @set_time_limit(280);
  $ar=dirname(ABSPATH).'/ps-archyvas'; $mu=WPMU_PLUGIN_DIR;
  $pl=$mu.'/petshop-pristatymo-pazadas.php'; $sch=$mu.'/petshop-schema-prekes.php'; $schbak=$ar.'/petshop-schema-prekes.php.bak_s1720';
  $PG=14894; $PGBAK='ps_s1720_pristatymas_bak';
  $hb=function($u='/?ps_hb=1'){ $rs=wp_remote_get(home_url($u),['timeout'=>25,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-s1720']); return is_wp_error($rs)?'ERR '.$rs->get_error_message():wp_remote_retrieve_response_code($rs); };
  $parse=function($k){ try{ token_get_all($k,TOKEN_PARSE); return true; }catch(Throwable $e){ return 'PARSE: '.$e->getMessage().' @'.$e->getLine(); } };
  try{
  if($f==='1'){
    if(!is_dir($ar)) throw new Exception('nėra ps-archyvas');
    if(!isset($_GET['d_petshop_pristatymo_pazadas_v1_0_php_txt'])) throw new Exception('nėra DATA media id');
    $mid=(int)$_GET['d_petshop_pristatymo_pazadas_v1_0_php_txt']; $path=get_attached_file($mid); if(!$path||!file_exists($path)) throw new Exception('media nerastas');
    $kodas=gzdecode(base64_decode(trim(file_get_contents($path)))); if(!$kodas||strpos($kodas,'Petshop_Pristatymo_Pazadas')===false) throw new Exception('blogas turinys');
    if(true!==($e=$parse($kodas))) throw new Exception($e);
    $r['plugin_buvo']=file_exists($pl)?md5_file($pl):'(nebuvo)'; if(file_exists($pl)&&!file_exists($ar.'/petshop-pristatymo-pazadas.php.bak_s1720')) copy($pl,$ar.'/petshop-pristatymo-pazadas.php.bak_s1720');
    file_put_contents($pl,$kodas); $r['plugin_md5']=md5_file($pl); $r['plugin_bytes']=strlen($kodas); wp_delete_attachment($mid,true);
    // schema handlingTime 0–2 → 1–2
    $c=file_get_contents($sch); $r['schema_pries']=md5($c);
    $old="'handlingTime' => array( '@type' => 'QuantitativeValue', 'minValue' => 0, 'maxValue' => 2, 'unitCode' => 'DAY' )";
    $new="'handlingTime' => array( '@type' => 'QuantitativeValue', 'minValue' => 1, 'maxValue' => 2, 'unitCode' => 'DAY' )";
    $n=substr_count($c,$old); $r['schema_atitikmenu']=$n;
    if($n===1){ $c2=str_replace($old,$new,$c); $c2=str_replace('Plugin Name: Petshop schema — prekės v1.1 (S1701 → S1717)','Plugin Name: Petshop schema — prekės v1.2 (S1701 → S1720: handlingTime 1–2 d.)',$c2); if(true!==($e=$parse($c2))) throw new Exception('schema '.$e); if(!file_exists($schbak)) copy($sch,$schbak); file_put_contents($sch,$c2); $r['schema_po']=md5_file($sch); }
    $r['heartbeat']=$hb();
    if($r['heartbeat']!==200){ @unlink($pl); if(file_exists($schbak)) copy($schbak,$sch); $r['ATSTATYTA']='heartbeat '.$r['heartbeat']; }
  }
  if($f==='2'||$f==='4'){
    $c=$wpdb->get_var($wpdb->prepare("SELECT post_content FROM {$p}posts WHERE ID=%d",$PG)); $r['bytes']=strlen($c); $r['md5']=md5($c);
    preg_match_all('/.{0,80}per 1[–\-]3 darbo dien.{0,120}/u',$c,$m); $r['atitikmenys']=$m[0];
    $c2=preg_replace('/(Prekes išsiunčiame per 1)[–\-](3 darbo dienas\.)/u','$1–2 darbo dienas. Jei užsakyme yra prekių iš skirtingų tiekėjų – per 3 darbo dienas.',$c,1,$n1);
    $c2=preg_replace('/(Prekės išsiunčiamos per 1)[–\-]3 darbo dienas(, o pristatomos)/u','$1–2 darbo dienas (užsakymai su prekėmis iš skirtingų tiekėjų – per 3 darbo dienas)$2',$c2,1,$n2);
    $r['pakeitimai']=[$n1,$n2]; preg_match_all('/.{0,60}per 1–2 darbo dien.{0,140}/u',$c2,$m2); $r['po']=$m2[0];
    if($f==='4'){ if($n1!==1||$n2!==1) throw new Exception('tikėtasi 1+1 pakeitimo, gauta '.$n1.'+'.$n2);
      if(!get_option($PGBAK)) update_option($PGBAK,['id'=>$PG,'md5'=>md5($c),'content'=>$c,'t'=>current_time('mysql')],false);
      $wpdb->update($p.'posts',['post_content'=>$c2],['ID'=>$PG]); clean_post_cache($PG); if(function_exists('wp_cache_post_change')) wp_cache_post_change($PG);
      $r['irasyta_md5']=md5($wpdb->get_var($wpdb->prepare("SELECT post_content FROM {$p}posts WHERE ID=%d",$PG)));
      $rs=wp_remote_get(get_permalink($PG).'?ps_nocache='.time(),['timeout'=>25,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-s1720']); $b=wp_remote_retrieve_body($rs); preg_match_all('/[^<>]{0,60}per 1–2 darbo dien[^<>]{0,140}/u',strip_tags($b),$m3); $r['gyvai']=$m3[0]; }
  }
  if($f==='3'){
    $r['klase']=class_exists('Petshop_Pristatymo_Pazadas')?'yra':'nera'; $r['plugin_md5']=file_exists($pl)?md5_file($pl):'-'; $r['schema_md5']=md5_file($sch);
    foreach([18560=>'AV Exclusion 12kg',26340=>'VF Flexi',14805=>'ZB Monge 12kg',35316=>'konservai 400g',18054=>'Leger 10kg',15938=>'variable outofstock'] as $pid=>$k){
      $rs=wp_remote_get(get_permalink($pid).'?ps_nocache='.time(),['timeout'=>25,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-s1720']); $b=wp_remote_retrieve_body($rs);
      $x=['http'=>wp_remote_retrieve_response_code($rs),'stock'=>preg_match('/<p class="stock[^"]*">([^<]+)</',$b,$mm)?trim($mm[1]):'-'];
      if(preg_match('/<div class="ps-pazadas">(.*?)<\/div>/s',$b,$mm)) $x['pazadas']=preg_replace('/\s+/',' ',strip_tags($mm[1])); else $x['pazadas']='-';
      if(preg_match('/<p class="ps-kg">([^<]+)</',$b,$mm)) $x['kg']=$mm[1]; else $x['kg']='-';
      if(preg_match('/"handlingTime":\{[^}]+\}/',$b,$mm)) $x['schema']=$mm[0];
      $r['prekes'][$pid.' '.$k]=$x; }
    $r['svoriai']=[]; foreach(['Josera Kitten sausas pašaras kačiukams 10+1kg AKCIJA','Exclusion Hypoallergenic … M/L 12 kg','2 vnt. Exclusion Hypoallergenic mažų veislių šunų maistas su kiauliena ir žirneliais 2 kg','Kraikas katėms TOFU BeloCat, 6 l','Josera Leger 10 kg – sausas maistas katėms','Exclusion diet hypo konservai 400g','Pašaras JosiCat Sterilised Classic, 15+3kg AKCIJA','Royal Canin Sensible 33, 10 + 2 kg'] as $t) $r['svoriai'][$t]=Petshop_Pristatymo_Pazadas::svoris_is_pavadinimo($t);
    $r['kg_kat']=[18560=>Petshop_Pristatymo_Pazadas::kg_kategorija(18560),35316=>Petshop_Pristatymo_Pazadas::kg_kategorija(35316),26340=>Petshop_Pristatymo_Pazadas::kg_kategorija(26340)];
    $r['krepselis_tuscias']=Petshop_Pristatymo_Pazadas::krepselio_pazadas();
    $r['php_error_tail']=file_exists(dirname(ABSPATH).'/logs/php_error.log')?substr(file_get_contents(dirname(ABSPATH).'/logs/php_error.log'),-900):'-';
    $r['heartbeat']=$hb();
  }
  if($f==='9'){
    if(file_exists($pl)) rename($pl,$ar.'/petshop-pristatymo-pazadas.php.off_s1720'); $r['plugin']='pašalintas';
    if(file_exists($schbak)){ copy($schbak,$sch); $r['schema']=md5_file($sch); }
    $b=get_option($PGBAK); if($b&&!empty($b['content'])){ $wpdb->update($p.'posts',['post_content'=>$b['content']],['ID'=>$PG]); clean_post_cache($PG); $r['pristatymas']='atstatytas '.md5($b['content']); }
    $r['heartbeat']=$hb();
  }
  }catch(Throwable $e){ $r['ERR']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
