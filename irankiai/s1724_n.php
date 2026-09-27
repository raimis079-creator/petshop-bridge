<?php
/** Plugin Name: TEMP PS S1724n snippet 565 VF Sync patch: apply be pokyciu -> praleisti (Super Cache). Fazes: 1 dry (blokas 1x, lint, sargas), 2 patch (bak opcija gz), 3 dryrun statistika + apply 200 testas (skipped_same), 9 atstatyti */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1724n'])) return; $f=(string)$_GET['ps_s1724n']; $r=['v'=>'S1724n','faze'=>$f]; global $wpdb; $P=$wpdb->prefix; @set_time_limit(170);
  $tok=function($code){ try{ token_get_all("<?php\n".$code,TOKEN_PARSE); return 'ok'; }catch(Throwable $e){ return 'KLAIDA '.$e->getMessage(); } };
  $sen="\t\tif ( \$mode === 'apply' ) {\n\t\t\tupdate_post_meta( \$pid, '_vf_qty', \$new_qty );\n\t\t\tupdate_post_meta( \$pid, '_vf_last_sync', current_time( 'mysql' ) );\n\t\t\t\$fulfillment->update_vf_qty( \$pid, \$new_qty );\n\t\t\t\$stats['applied']++;\n\t\t}";
  $nau="\t\tif ( \$mode === 'apply' ) {\n\t\t\tupdate_post_meta( \$pid, '_vf_last_sync', current_time( 'mysql' ) );\n\t\t\t// S1724 (2026-09-27): be pokyčio NERAŠOM — kiekvienas update_vf_qty() → wc_update_product_stock('set') → WC set_stock kabliai → petshop-cache pilnas Super Cache valymas kas valandą (1 239 prekės). Praleidžiam tik kai galutinė būsena jau tokia, kokią įrašytų Petshop_Fulfillment::recalculate().\n\t\t\t\$zb_qty_ = (int) get_post_meta( \$pid, '_zb_qty', true );\n\t\t\t\$exp_qty_ = \$zb_qty_ > 0 ? \$zb_qty_ : \$new_qty;\n\t\t\t\$exp_src_ = \$zb_qty_ > 0 ? 'zb_dropship' : ( \$new_qty > 0 ? 'vf_dropship' : 'out_of_stock' );\n\t\t\tif ( \$reason === 'REFRESH_STAMP_ONLY' && (int) get_post_meta( \$pid, '_stock', true ) === \$exp_qty_ && get_post_meta( \$pid, '_active_fulfillment_source', true ) === \$exp_src_ && get_post_meta( \$pid, '_manage_stock', true ) === 'yes' ) {\n\t\t\t\t\$stats['skipped_same'] = ( \$stats['skipped_same'] ?? 0 ) + 1;\n\t\t\t\tcontinue;\n\t\t\t}\n\t\t\tupdate_post_meta( \$pid, '_vf_qty', \$new_qty );\n\t\t\t\$fulfillment->update_vf_qty( \$pid, \$new_qty );\n\t\t\t\$stats['applied']++;\n\t\t}";
  try{
    $code=$wpdb->get_var("SELECT code FROM {$P}snippets WHERE id=565"); $r['md5_dabar']=md5($code); $r['name']=$wpdb->get_var("SELECT name FROM {$P}snippets WHERE id=565");
    if($f==='1'){ $r['sen_kiek']=substr_count($code,$sen); $r['nau_jau']=substr_count($code,'skipped_same'); $p=str_replace($sen,$nau,$code); $r['lint_po']=$tok($p); $r['lint_dabar']=$tok($code);
      $r['sargas_naudoja']=[]; foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $fx){ $s=file_get_contents($fx); if(strpos($s,'petshop_vf_stock_last_run')!==false||strpos($s,'vf_stock_last')!==false) $r['sargas_naudoja'][]=basename($fx); }
      $r['last_run']=get_option('petshop_vf_stock_last_run');
      if(!$r['sen_kiek']){ $i=strpos($code,"\$fulfillment->update_vf_qty"); $r['aplink']=substr($code,max(0,$i-400),700); } }
    if($f==='2'){ if(substr_count($code,$sen)!==1) throw new Exception('blokas ne 1x'); if(!get_option('ps_s1724_snip565_bak')) update_option('ps_s1724_snip565_bak',['name'=>$r['name'],'code'=>base64_encode(gzcompress($code)),'md5'=>md5($code)],false);
      $p=str_replace($sen,$nau,$code); if($tok($p)!=='ok') throw new Exception('lint '.$tok($p));
      $wpdb->update("{$P}snippets",['code'=>$p,'name'=>'Petshop VF Sync v1.2 (reprice+stock+publish; S1724 stock be pokyčio nerašo)','modified'=>current_time('mysql')],['id'=>565]); wp_cache_flush();
      $r['md5_po']=md5($wpdb->get_var("SELECT code FROM {$P}snippets WHERE id=565")); $x=wp_remote_get(home_url('/?ps_hb='.time()),['timeout'=>25,'sslverify'=>false]); $r['heartbeat']=is_wp_error($x)?$x->get_error_message():wp_remote_retrieve_response_code($x);
      if($r['heartbeat']!==200){ $b=get_option('ps_s1724_snip565_bak'); $wpdb->update("{$P}snippets",['code'=>gzuncompress(base64_decode($b['code'])),'name'=>$b['name']],['id'=>565]); $r['ROLLBACK']=true; } }
    if($f==='3'){ if(!function_exists('petshop_vf_sync_stock')) throw new Exception('f-jos nera (snippet neaktyvus?)');
      $d=petshop_vf_sync_stock('dryrun',200,0,[]); $r['dryrun_0_200']=$d['stats']??$d;
      $cv0=count((array)get_option('ps_cache_valymai')); $a=petshop_vf_sync_stock('apply',200,0,[]); $r['apply_0_200']=$a['stats']??$a; $r['cache_valymai_nauji']=count((array)get_option('ps_cache_valymai'))-$cv0;
      $cv=(array)get_option('ps_cache_valymai'); $r['cache_pask']=array_slice($cv,-2); $r['laikas']=current_time('mysql'); }
    if($f==='9'){ $b=get_option('ps_s1724_snip565_bak'); if($b){ $wpdb->update("{$P}snippets",['code'=>gzuncompress(base64_decode($b['code'])),'name'=>$b['name']],['id'=>565]); wp_cache_flush(); $r['atstatyta']=md5($wpdb->get_var("SELECT code FROM {$P}snippets WHERE id=565"))===$b['md5']; } }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
