<?php
/** TEMP PS S1684 mm — DEPLOY petshop-faktai.php: kliento_eile() skaito ir ps_ist_fakt_uzsakymai (klientas_naujas, uzsakymo_nr, dienos_nuo_ankstesnio); backfill esamu fakt eiluciu; bak ps-backups/petshop-faktai.php.bak_s1684; token_get_all; heartbeat. Raimio leidimas 09-14. */
add_action('init', function(){
  if (!isset($_GET['ps_s1684mm'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1684 mm'); $f=WPMU_PLUGIN_DIR.'/petshop-faktai.php'; $s=file_get_contents($f); $o['md5_pries']=md5($s);
  if(md5($s)!=='a0587d1fac6273083516816a62467105'){ $o['STOP']='md5 nesutampa'; echo json_encode($o); exit; }
  $u=wp_upload_dir(); $bak=$u['basedir'].'/ps-backups/petshop-faktai.php.bak_s1684'; if(!file_exists($bak)) file_put_contents($bak,$s); $o['bak']=file_exists($bak)&&md5_file($bak)===md5($s);
  $old=<<<'PSX'
	private static function kliento_eile( $hash, $apmoketa ) {
		if ( $hash === '' ) { return array( 1, 1, null ); }
		global $wpdb;
		$t = self::t_uzsakymai();
		$n = (int) $wpdb->get_var( $wpdb->prepare(
			"SELECT COUNT(*) FROM $t WHERE klientas_email_hash=%s AND apmoketa_at<=%s", $hash, $apmoketa ) );
		$pask = $wpdb->get_var( $wpdb->prepare(
			"SELECT MAX(apmoketa_at) FROM $t WHERE klientas_email_hash=%s AND apmoketa_at<=%s", $hash, $apmoketa ) );
		$dienos = null;
		if ( $pask ) {
			$dienos = (int) floor( ( strtotime( $apmoketa ) - strtotime( $pask ) ) / DAY_IN_SECONDS );
		}
		return array( $n + 1, $n === 0 ? 1 : 0, $dienos );
	}
PSX;
  $new=<<<'PSX'
	private static function kliento_eile( $hash, $apmoketa ) {
		if ( $hash === '' ) { return array( 1, 1, null ); }
		global $wpdb;
		$t = self::t_uzsakymai();
		$n = (int) $wpdb->get_var( $wpdb->prepare(
			"SELECT COUNT(*) FROM $t WHERE klientas_email_hash=%s AND apmoketa_at<=%s", $hash, $apmoketa ) );
		$pask = $wpdb->get_var( $wpdb->prepare(
			"SELECT MAX(apmoketa_at) FROM $t WHERE klientas_email_hash=%s AND apmoketa_at<=%s", $hash, $apmoketa ) );
		// S1684: eShoprent istorija (ps_ist_fakt_uzsakymai, tas pats sha256 hash) — klientas, pirkes senoje svetaineje, NERA naujas.
		$ti = $wpdb->prefix . 'ps_ist_fakt_uzsakymai';
		if ( $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $ti ) ) === $ti ) {
			$ni = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $ti WHERE klientas_email_hash=%s AND apmoketa_at IS NOT NULL AND apmoketa_at<=%s", $hash, $apmoketa ) );
			if ( $ni > 0 ) {
				$n += $ni;
				$paski = $wpdb->get_var( $wpdb->prepare( "SELECT MAX(apmoketa_at) FROM $ti WHERE klientas_email_hash=%s AND apmoketa_at<=%s", $hash, $apmoketa ) );
				if ( $paski && ( ! $pask || $paski > $pask ) ) { $pask = $paski; }
			}
		}
		$dienos = null;
		if ( $pask ) {
			$dienos = (int) floor( ( strtotime( $apmoketa ) - strtotime( $pask ) ) / DAY_IN_SECONDS );
		}
		return array( $n + 1, $n === 0 ? 1 : 0, $dienos );
	}
PSX;
  if(substr_count($s,$old)!==1){ $o['STOP']='old rastas '.substr_count($s,$old).' k.'; echo json_encode($o); exit; }
  $n=str_replace($old,$new,$s);
  try { token_get_all($n, TOKEN_PARSE); } catch (Throwable $e) { $o['STOP']='ParseError: '.$e->getMessage(); echo json_encode($o); exit; }
  file_put_contents($f,$n); if(function_exists('opcache_invalidate')) opcache_invalidate($f,true); $o['md5_po']=md5_file($f); $o['dydis']=filesize($f);
  $hb=wp_remote_get(home_url('/'),array('timeout'=>20,'sslverify'=>false)); $code=is_wp_error($hb)?0:wp_remote_retrieve_response_code($hb); $o['heartbeat']=$code; if($code>=500||$code===0){ file_put_contents($f,$s); if(function_exists('opcache_invalidate')) opcache_invalidate($f,true); $o['ROLLBACK']='grąžinta'; echo json_encode($o); exit; }
  // backfill: esamos fakt eilutės su istorija
  $U="{$p}ps_fakt_uzsakymai"; $E="{$p}ps_fakt_eilutes"; $I="{$p}ps_ist_fakt_uzsakymai";
  $rows=$wpdb->get_results("SELECT u.uzsakymas_id id, u.klientas_email_hash h, u.apmoketa_at a, u.uzsakymo_nr nr, u.klientas_naujas kn, (SELECT COUNT(*) FROM $I i WHERE i.klientas_email_hash=u.klientas_email_hash AND i.apmoketa_at IS NOT NULL AND i.apmoketa_at<=u.apmoketa_at) ni, (SELECT MAX(i.apmoketa_at) FROM $I i WHERE i.klientas_email_hash=u.klientas_email_hash AND i.apmoketa_at<=u.apmoketa_at) pi, (SELECT MAX(x.apmoketa_at) FROM $U x WHERE x.klientas_email_hash=u.klientas_email_hash AND x.apmoketa_at<u.apmoketa_at AND x.testinis=0) pw FROM $U u WHERE u.klientas_email_hash<>'' AND u.apmoketa_at IS NOT NULL",ARRAY_A);
  $o['backfill']=array('tikrinta'=>count($rows),'keista'=>0);
  foreach($rows as $r){ if((int)$r['ni']<=0) continue; $pask=$r['pw']; if($r['pi']&&(!$pask||$r['pi']>$pask)) $pask=$r['pi']; $dienos=$pask?(int)floor((strtotime($r['a'])-strtotime($pask))/DAY_IN_SECONDS):null;
    $nr=(int)$r['nr']+(int)$r['ni']; $wpdb->update($U,array('klientas_naujas'=>0,'uzsakymo_nr'=>$nr,'dienos_nuo_ankstesnio'=>$dienos),array('uzsakymas_id'=>$r['id'])); $wpdb->update($E,array('klientas_naujas'=>0),array('uzsakymas_id'=>$r['id'])); $o['backfill']['keista']++; }
  $o['po']=$wpdb->get_row("SELECT COUNT(*) n, SUM(klientas_naujas=1) nauji, SUM(klientas_naujas=0) grizt, ROUND(AVG(CASE WHEN klientas_naujas=0 THEN dienos_nuo_ankstesnio END)) vid_d FROM $U WHERE testinis=0 AND apmoketa_at IS NOT NULL",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
