<?php
/** Plugin Name: TEMP PS S1724o snippet 565 patch 2: praleisti kai new_qty===old_qty (ir DROPPED su 0). Fazes: 1 patch+lint, 3 apply testas visoms (offset ciklas kaip cron), 9 atstatyti is ps_s1724_snip565_bak */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1724o'])) return; $f=(string)$_GET['ps_s1724o']; $r=['v'=>'S1724o','faze'=>$f]; global $wpdb; $P=$wpdb->prefix; @set_time_limit(170);
  $tok=function($code){ try{ token_get_all("<?php\n".$code,TOKEN_PARSE); return 'ok'; }catch(Throwable $e){ return 'KLAIDA '.$e->getMessage(); } };
  $sen="if ( \$reason === 'REFRESH_STAMP_ONLY' && (int) get_post_meta( \$pid, '_stock', true ) === \$exp_qty_";
  $nau="if ( \$new_qty === \$old_qty && (int) get_post_meta( \$pid, '_stock', true ) === \$exp_qty_";
  try{
    $code=$wpdb->get_var("SELECT code FROM {$P}snippets WHERE id=565"); $r['md5_dabar']=md5($code);
    if($f==='1'){ $n=substr_count($code,$sen); $r['sen_kiek']=$n; if($n!==1) throw new Exception('blokas ne 1x'); $p=str_replace($sen,$nau,$code); if($tok($p)!=='ok') throw new Exception('lint'); $wpdb->update("{$P}snippets",['code'=>$p,'modified'=>current_time('mysql')],['id'=>565]); wp_cache_flush(); $r['md5_po']=md5($wpdb->get_var("SELECT code FROM {$P}snippets WHERE id=565")); $x=wp_remote_get(home_url('/?ps_hb='.time()),['timeout'=>25,'sslverify'=>false]); $r['heartbeat']=is_wp_error($x)?$x->get_error_message():wp_remote_retrieve_response_code($x); }
    if($f==='3'){ $cv0=count((array)get_option('ps_cache_valymai')); $offset=0; $tot=['scanned'=>0,'applied'=>0,'skipped_same'=>0,'change'=>0,'zero'=>0]; $safe=20; while($safe-->0){ $a=petshop_vf_sync_stock('apply',200,$offset,[]); if(isset($a['error'])){ $r['error']=$a['error']; break; } $s=$a['stats']; $tot['scanned']+=$s['products_scanned']; $tot['applied']+=$s['applied']; $tot['skipped_same']+=($s['skipped_same']??0); $tot['change']+=$s['would_change_qty']; $tot['zero']+=$s['would_zero_out']; if($s['products_scanned']<200) break; $offset+=200; } $r['viso']=$tot; $r['cache_valymai_nauji']=count((array)get_option('ps_cache_valymai'))-$cv0; $cv=(array)get_option('ps_cache_valymai'); $r['cache_pask']=array_slice($cv,-1); $r['mod_5min']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type='product' AND post_modified>=NOW()-INTERVAL 5 MINUTE"); $r['laikas']=current_time('mysql'); }
    if($f==='9'){ $b=get_option('ps_s1724_snip565_bak'); if($b){ $wpdb->update("{$P}snippets",['code'=>gzuncompress(base64_decode($b['code'])),'name'=>$b['name']],['id'=>565]); wp_cache_flush(); $r['atstatyta']=md5($wpdb->get_var("SELECT code FROM {$P}snippets WHERE id=565"))===$b['md5']; } }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
