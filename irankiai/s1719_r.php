<?php
/** Plugin Name: TEMP PS S1719r — sargas 5323 v1.1 (pagal eilučių meta, ne pastabos tekstą) + Rytas v1.4 AVPN patikra: 1 sausas, 2 deploy, 3 patikra, 9 atstatymas */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1719r'])) return; $f=$_GET['ps_s1719r']; $r=['v'=>'S1719r','faze'=>$f]; @set_time_limit(150); global $wpdb; $p=$wpdb->prefix;
  $fp=WP_CONTENT_DIR.'/mu-plugins/petshop-rytas.php'; $bak='/home/gyvunai2/domains/petshop.lt/ps-archyvas/petshop-rytas.php.bak_s1719';
  $SNIP = <<<'PHP'
/**
 * Petshop Sargas Likucio grazinimas v1.1 (atsaukimo patikra pagal eiluciu meta)
 *
 * v1.0 (S1662) tikrino WC pastabos teksta "Likutis sumazintas" — nuo S1704 kelio-fiksavimo WC raso
 * pastaba net kai nurase 0 (10→10), todel neapmoketu bacs atsaukimai gaudavo klaidinga ispejima
 * (S1719: #1128, #1144, 36145, 36250). v1.1 ziuri i faktus: eilutes _reduced_stock > 0 (WC dar negrazino)
 * arba _ps_av_reduced_qty > 0 be uzsakymo _ps_av_restored (AV variklis negrazino). Nieko nekeicia.
 */
add_action('woocommerce_order_status_cancelled', function($oid){
	$o = wc_get_order($oid); if (!$o) return;
	$wc_liko = 0; $av_liko = 0;
	foreach ($o->get_items() as $it) {
		$wc_liko += max(0, (int)$it->get_meta('_reduced_stock'));
		$av_liko += max(0, (int)$it->get_meta('_ps_av_reduced_qty'));
	}
	if ($av_liko && $o->get_meta('_ps_av_restored')) $av_liko = 0;
	if (!$wc_liko && !$av_liko) return;
	$o->add_order_note('⚠ SARGAS: atšaukiant likutis NEGRĮŽO — WC eilučių _reduced_stock: '.$wc_liko.' vnt., AV _ps_av_reduced_qty be grąžinimo: '.$av_liko.' vnt. Patikrink prekių likučius ir grąžink rankiniu. (Petshop Sargas v1.1)');
}, 99);
PHP;
  $ANCH="\t\t/* neišsiųsti */";
  $INS = <<<'PHP'
		/* AVPN numeracija (S1719): dublikatai — raudona, spragos (be 011016) — geltona */
		try {
			$db_ = $GLOBALS['wpdb'];
			$av_ = $db_->get_col( "SELECT meta_value FROM {$db_->prefix}wc_orders_meta WHERE meta_key='_petshop_avpn_number' AND meta_value LIKE 'AVPN%'" );
			$cnt_ = array_count_values( $av_ ); $dubl_ = array_keys( array_filter( $cnt_, function( $n ) { return $n > 1; } ) );
			$nums_ = array(); foreach ( $av_ as $x_ ) { $nums_[] = (int) substr( $x_, 4 ); } $nums_ = array_values( array_unique( $nums_ ) ); sort( $nums_ ); $gaps_ = array();
			for ( $i_ = 1; $i_ < count( $nums_ ); $i_++ ) { for ( $k_ = $nums_[ $i_ - 1 ] + 1; $k_ < $nums_[ $i_ ]; $k_++ ) { if ( 11016 !== $k_ ) { $gaps_[] = $k_; } } }
			$add( 'avpn', $dubl_ ? 'raudona' : ( $gaps_ ? 'geltona' : 'zalia' ), 'AVPN numeracija: ' . ( $dubl_ ? 'DUBLIKATAI ' . implode( ', ', $dubl_ ) : 'be dublikatų (' . count( $av_ ) . ')' ) . ( $gaps_ ? '; spragos ' . implode( ', ', array_slice( $gaps_, 0, 10 ) ) : '' ) );
		} catch ( \Throwable $e_ ) { $add( 'avpn', 'pilka', 'AVPN patikra nepavyko: ' . $e_->getMessage() ); }

PHP;
  try{
    $c=file_get_contents($fp); $nA=substr_count($c,$ANCH); $nV=substr_count($c,"const VERSIJA = '1.3';"); $nH=substr_count($c," * Version: 1.3");
    if($f==='1'){ $r['anchor']=$nA; $r['versija']=$nV; $r['header']=$nH; $r['md5']=md5($c); $r['snip5323']=$wpdb->get_row("SELECT id,name,active,LENGTH(code) len FROM {$p}snippets WHERE id=5323",ARRAY_A); $r['bak_yra']=file_exists($bak); $r['add_sig']=preg_match('/\$add\s*=\s*function\s*\([^)]*\)/',$c,$m)?$m[0]:null; }
    if($f==='2'){ if($nA!==1||$nV!==1) throw new Exception("anchor=$nA versija=$nV");
      if(!file_exists($bak)) copy($fp,$bak); $c2=str_replace($ANCH,$INS.$ANCH,$c); $c2=str_replace("const VERSIJA = '1.3';","const VERSIJA = '1.4';",$c2); if($nH===1) $c2=str_replace(" * Version: 1.3"," * Version: 1.4",$c2);
      token_get_all($c2,TOKEN_PARSE); file_put_contents($fp,$c2); $r['rytas_md5']=md5_file($fp);
      $hb=wp_remote_get('https://petshop.lt/?ps_hb='.time(),['timeout'=>25,'sslverify'=>false]); $r['hb']=is_wp_error($hb)?'ERR':wp_remote_retrieve_response_code($hb); if($r['hb']!=200){ copy($bak,$fp); throw new Exception('ROLLBACK rytas'); }
      $old=$wpdb->get_var("SELECT code FROM {$p}snippets WHERE id=5323"); update_option('ps_s1719_snip5323_bak',$old,false); token_get_all("<?php\n".$SNIP,TOKEN_PARSE);
      $wpdb->update("{$p}snippets",['code'=>$SNIP,'name'=>'Petshop Sargas Likucio grazinimas v1.1 (atsaukimo patikra pagal eiluciu meta)'],['id'=>5323]); wp_cache_flush(); $r['snip']=$wpdb->get_row("SELECT id,name,active,LENGTH(code) len FROM {$p}snippets WHERE id=5323",ARRAY_A);
      $hb=wp_remote_get('https://petshop.lt/?ps_hb2='.time(),['timeout'=>25,'sslverify'=>false]); $r['hb2']=is_wp_error($hb)?'ERR':wp_remote_retrieve_response_code($hb); if($r['hb2']!=200){ $wpdb->update("{$p}snippets",['code'=>$old],['id'=>5323]); $r['ROLLBACK_snip']=true; } }
    if($f==='3'){ $rm=new ReflectionMethod('Petshop_Rytas','patikros'); $rm->setAccessible(true); $pat=$rm->invoke(null); $r['patikros']=array_map(function($x){return implode(' | ',array_map('strval',(array)$x));},(array)$pat); $r['versija']=Petshop_Rytas::VERSIJA;
      $r['snip_kodas_pradzia']=substr($wpdb->get_var("SELECT code FROM {$p}snippets WHERE id=5323"),0,120); $r['snip_hook_uzregistruotas']=has_action('woocommerce_order_status_cancelled'); }
    if($f==='9'){ if(file_exists($bak)){ copy($bak,$fp); $r['rytas']=md5_file($fp); } $old=get_option('ps_s1719_snip5323_bak'); if($old){ $wpdb->update("{$p}snippets",['code'=>$old,'name'=>'Petshop Sargas Likucio grazinimas v1.0 (atsaukimo patikra)'],['id'=>5323]); $r['snip']='atstatytas'; } }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},1);
