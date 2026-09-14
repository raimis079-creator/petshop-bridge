<?php
/** TEMP PS S1684 mi — DEPLOY petshop-analitika-langas.php v1.0.1 → v1.1.0: Reklamos verdiktas pagal CAC naujam klientui (ne ROAS), naujas = nėra ps_ist, antkainis vietoj maržos %; bak ps-backups/petshop-analitika-langas.php.bak_s1684; token_get_all; heartbeat. */
add_action('init', function(){
  if (!isset($_GET['ps_s1684mi'])) return; $o=array('v'=>'S1684 mi'); $f=WPMU_PLUGIN_DIR.'/petshop-analitika-langas.php'; $s=file_get_contents($f); $o['md5_pries']=md5($s);
  if(md5($s)!=='f170d2c234ed607123899640e45d1435'){ $o['STOP']='md5 nesutampa'; echo json_encode($o); exit; }
  $u=wp_upload_dir(); $bak=$u['basedir'].'/ps-backups/petshop-analitika-langas.php.bak_s1684'; if(!file_exists($bak)) file_put_contents($bak,$s); $o['bak']=file_exists($bak)&&md5_file($bak)===md5($s);
  $P=array();
  $P[0]=array(<<<'PSX'
	const VER = '1.0.1';
PSX,<<<'PSX'
	const VER = '1.1.0';
PSX);
  $P[1]=array(<<<'PSX'
		'ads_min_spend_ct' => 5000,
PSX,<<<'PSX'
		'ads_min_spend_ct' => 5000,
		'ads_cac_ok_ct' => 1200,     // S1684: blended new-food CAC lubos €12 (brendo CM guardrail: Exclusion/Josera €5–7, Animonda/AV €10–12)
		'ads_cac_stop_ct' => 3500,   // S1684: avarinė CAC ≤ 30 % V12 → €35
PSX);
  $P[2]=array(<<<'PSX'
		$u = $wpdb->get_row( $wpdb->prepare( "SELECT COUNT(*) n, SUM(viso_ct) viso, SUM(marza_ct) marza, SUM(kontribucija_ct) kontr FROM {$p}ps_fakt_uzsakymai WHERE diena>=%s AND testinis=0 AND apmoketa_at IS NOT NULL AND (kanalas_pirmas='mokamas' OR kanalas_paskutinis='mokamas' OR gclid=1)", $nuo ), ARRAY_A );
		$isl = (int) $r['isl']; $viso = (int) $u['viso']; $marza = (int) $u['marza']; $n = (int) $u['n'];
		$roas = $isl ? $viso / $isl : null; $pelnas = $marza - $isl;
		$kamp = $wpdb->get_results( $wpdb->prepare( "SELECT kampanija, SUM(islaidos_ct) isl, SUM(paspaudimai) kl, SUM(konversijos) konv FROM {$p}ps_fakt_reklama WHERE diena>=%s AND kanalas='google_ads' GROUP BY kampanija HAVING isl>0 ORDER BY isl DESC", $nuo ), ARRAY_A );
		if ( $isl < $S['ads_min_spend_ct'] ) { $v = array( 'pilka', 'Išlaidų per mažai (' . self::eur( $isl ) . ') vertinti.', '' ); }
		elseif ( $pelnas < 0 ) { $v = array( 'raudona', 'Reklama NUOSTOLINGA: marža iš Ads užsakymų ' . self::eur( $marza ) . ' < išlaidos ' . self::eur( $isl ) . ' (' . self::eur( $pelnas ) . ').', 'Mažinti biudžetą arba siaurinti į pelningas grupes (PMax D). Tikrinti, ar konversijos apskritai matomos Ads (S1668 301 pamoka).' ); }
		elseif ( null !== $roas && $roas < $S['ads_roas_lūžis'] ) { $v = array( 'geltona', 'ROAS ' . number_format( $roas, 1, ',', '' ) . ' — ties lūžiu (' . $S['ads_roas_lūžis'] . '), marža dengia išlaidas, bet pelno beveik nėra.', 'Biudžeto nekelti. Ratchet tROAS.' ); }
		else { $v = array( 'zalia', 'Reklama pelninga: ROAS ' . number_format( $roas, 1, ',', '' ) . ', pelnas po išlaidų ' . self::eur( $pelnas ) . '.', 'Galima svarstyti biudžeto kėlimą pelningoms grupėms.' ); }
		return array( 'kpi' => array( 'Išlaidos' => self::eur( $isl ), 'Užsakymai iš Ads (apmokėti)' => $n, 'Pajamos iš Ads' => self::eur( $viso ), 'ROAS' => null === $roas ? '—' : number_format( $roas, 2, ',', '' ) . ' (lūžis ' . $S['ads_roas_lūžis'] . ')', 'Marža iš Ads − išlaidos' => self::eur( $pelnas ), 'Paspaudimai / Ads konversijos' => (int) $r['kl'] . ' / ' . (float) $r['konv'] ), 'verdiktas' => $v, 'papildomai' => array( 'Skaičiuojama nuo ' . $nuo . ' (naujos svetainės pradžia).', 'Kanalas nustatomas iš pirmo/paskutinio prisilietimo arba gclid (48 val. WC sesija — dalis Ads pirkėjų tampa „organic“).' ), 'kamp' => $kamp );
PSX,<<<'PSX'
		$u = $wpdb->get_row( $wpdb->prepare( "SELECT COUNT(*) n, SUM(viso_ct) viso, SUM(marza_ct) marza, SUM(kontribucija_ct) kontr, SUM(savikaina_ct) sav, SUM(klientas_naujas=1 AND NOT EXISTS (SELECT 1 FROM {$p}ps_ist_fakt_uzsakymai i WHERE i.klientas_email_hash=u.klientas_email_hash)) nauji FROM {$p}ps_fakt_uzsakymai u WHERE diena>=%s AND testinis=0 AND apmoketa_at IS NOT NULL AND (kanalas_pirmas='mokamas' OR kanalas_paskutinis='mokamas' OR gclid=1)", $nuo ), ARRAY_A );
		$isl = (int) $r['isl']; $viso = (int) $u['viso']; $marza = (int) $u['marza']; $n = (int) $u['n']; $sav = (int) $u['sav']; $nauji = (int) $u['nauji'];
		$roas = $isl ? $viso / $isl : null; $pelnas = $marza - $isl; $antk = $sav ? $marza / $sav : null; $cac = $nauji ? (int) round( $isl / $nauji ) : null; $cac_uzs = $n ? (int) round( $isl / $n ) : null;
		$kamp = $wpdb->get_results( $wpdb->prepare( "SELECT kampanija, SUM(islaidos_ct) isl, SUM(paspaudimai) kl, SUM(konversijos) konv FROM {$p}ps_fakt_reklama WHERE diena>=%s AND kanalas='google_ads' GROUP BY kampanija HAVING isl>0 ORDER BY isl DESC", $nuo ), ARRAY_A );
		// S1684: verdiktas pagal CAC naujam klientui (Q4 planas, vartai B), ne pagal ROAS. Naujas = nėra ps_ist istorijoje.
		if ( $isl < $S['ads_min_spend_ct'] ) { $v = array( 'pilka', 'Išlaidų per mažai (' . self::eur( $isl ) . ') vertinti.', '' ); }
		elseif ( null === $cac ) { $v = array( 'raudona', 'Išleista ' . self::eur( $isl ) . ', naujų klientų iš Ads — 0.', 'Tikrinti, ar konversijos matomos Ads (offline įkėlimas) ir ar kanalas fiksuojamas.' ); }
		elseif ( $cac > $S['ads_cac_stop_ct'] ) { $v = array( 'raudona', 'CAC ' . self::eur( $cac ) . ' už naują klientą — virš avarinės ribos ' . self::eur( $S['ads_cac_stop_ct'] ) . ' (30 % V12).', 'Trys savaitės iš eilės → PMax pauzė, lieka brand Search + exact testas.' ); }
		elseif ( $cac > $S['ads_cac_ok_ct'] ) { $v = array( 'geltona', 'CAC ' . self::eur( $cac ) . ' už naują klientą — virš mastelio ribos ' . self::eur( $S['ads_cac_ok_ct'] ) . ' (Exclusion/Josera klientui riba €5–7).', 'Biudžeto nekelti. Mažinti CAC: feed-only PMax, teisingas konversijų signalas, šunų/AV/50 %+ antkainio brendai.' ); }
		else { $v = array( 'zalia', 'CAC ' . self::eur( $cac ) . ' — mastelio ribose (≤ ' . self::eur( $S['ads_cac_ok_ct'] ) . ').', 'Dvi savaitės iš eilės + Ads konv. ≈ WC → biudžetas +20–30 % žingsniu (ne +50 %).' ); }
		return array( 'kpi' => array( 'Išlaidos' => self::eur( $isl ), 'Užsakymai iš Ads (apmokėti)' => $n, 'Nauji klientai iš Ads (be ps_ist istorijos)' => $nauji, 'CAC už naują klientą / už užsakymą' => ( null === $cac ? '—' : self::eur( $cac ) ) . ' / ' . ( null === $cac_uzs ? '—' : self::eur( $cac_uzs ) ), 'Pajamos iš Ads (be PVM)' => self::eur( $viso ), 'Antkainis Ads užsakymuose' => null === $antk ? '—' : round( 100 * $antk ) . ' % (marža ' . ( $viso ? round( 100 * $marza / $viso ) : 0 ) . ' % nuo pajamų)', 'ROAS' => null === $roas ? '—' : number_format( $roas, 2, ',', '' ), 'Marža iš Ads − išlaidos' => self::eur( $pelnas ), 'Paspaudimai / Ads konversijos' => (int) $r['kl'] . ' / ' . (float) $r['konv'] ), 'verdiktas' => $v, 'papildomai' => array( 'Skaičiuojama nuo ' . $nuo . ' (naujos svetainės pradžia). Kainos be PVM; antkainis = marža / savikaina.', 'Kanalas nustatomas iš pirmo/paskutinio prisilietimo arba gclid (48 val. WC sesija — dalis Ads pirkėjų tampa „organic“).' ), 'kamp' => $kamp );
PSX);
  $P[3]=array(<<<'PSX'
		$r = $wpdb->get_row( $wpdb->prepare( "SELECT COUNT(*) n, SUM(klientas_naujas=1) nauji, SUM(klientas_naujas=0) grizt, AVG(viso_ct) vid, AVG(CASE WHEN klientas_naujas=0 THEN dienos_nuo_ankstesnio END) dienos, SUM(marza_ct) marza, SUM(viso_ct) viso FROM {$p}ps_fakt_uzsakymai WHERE diena>=%s AND testinis=0 AND apmoketa_at IS NOT NULL", $nuo ), ARRAY_A );
PSX,<<<'PSX'
		$r = $wpdb->get_row( $wpdb->prepare( "SELECT COUNT(*) n, SUM(klientas_naujas=1 AND NOT EXISTS (SELECT 1 FROM {$p}ps_ist_fakt_uzsakymai i WHERE i.klientas_email_hash=u.klientas_email_hash)) nauji, SUM(NOT (klientas_naujas=1 AND NOT EXISTS (SELECT 1 FROM {$p}ps_ist_fakt_uzsakymai i WHERE i.klientas_email_hash=u.klientas_email_hash))) grizt, AVG(viso_ct) vid, AVG(CASE WHEN klientas_naujas=0 THEN dienos_nuo_ankstesnio END) dienos, SUM(marza_ct) marza, SUM(viso_ct) viso, SUM(savikaina_ct) sav FROM {$p}ps_fakt_uzsakymai u WHERE diena>=%s AND testinis=0 AND apmoketa_at IS NOT NULL", $nuo ), ARRAY_A ); // S1684: naujas = nėra ps_ist istorijoje (klientas_naujas WC pusėje istorijos nemato)
PSX);
  $P[4]=array(<<<'PSX'
		return array( 'kpi' => array( 'Apmokėtų užsakymų' => $n, 'Nauji / grįžtantys' => (int) $r['nauji'] . ' / ' . $g, 'Vidutinis krepšelis' => self::eur( (int) $r['vid'] ), 'Vid. dienų tarp grįžtančio pirkimų' => $r['dienos'] ? round( $r['dienos'] ) : '—', 'Marža (bendra)' => self::eur( (int) $r['marza'] ) . ( $r['viso'] ? ' (' . round( 100 * $r['marza'] / $r['viso'] ) . ' % nuo pajamų)' : '' ) ), 'verdiktas' => $v, 'papildomai' => array() );
PSX,<<<'PSX'
		return array( 'kpi' => array( 'Apmokėtų užsakymų' => $n, 'Nauji / grįžtantys' => (int) $r['nauji'] . ' / ' . $g, 'Vidutinis krepšelis' => self::eur( (int) $r['vid'] ), 'Vid. dienų tarp grįžtančio pirkimų' => $r['dienos'] ? round( $r['dienos'] ) : '—', 'Antkainis (bendras)' => ( (int) $r['sav'] ? round( 100 * $r['marza'] / $r['sav'] ) . ' %' : '—' ) . ' · marža ' . self::eur( (int) $r['marza'] ) . ( $r['viso'] ? ' (' . round( 100 * $r['marza'] / $r['viso'] ) . ' % nuo pajamų be PVM)' : '' ) ), 'verdiktas' => $v, 'papildomai' => array() );
PSX);
  $n=$s; foreach($P as $i=>$pr){ if(substr_count($n,$pr[0])!==1){ $o['STOP']='old '.$i.' rastas '.substr_count($n,$pr[0]).' k.'; echo json_encode($o); exit; } $n=str_replace($pr[0],$pr[1],$n); }
  try { token_get_all($n, TOKEN_PARSE); } catch (Throwable $e) { $o['STOP']='ParseError: '.$e->getMessage(); echo json_encode($o); exit; }
  file_put_contents($f,$n); if(function_exists('opcache_invalidate')) opcache_invalidate($f,true); $o['md5_po']=md5_file($f); $o['dydis']=filesize($f);
  $hb=wp_remote_get(home_url('/'),array('timeout'=>20,'sslverify'=>false)); $code=is_wp_error($hb)?0:wp_remote_retrieve_response_code($hb); $o['heartbeat']=$code; if($code>=500||$code===0){ file_put_contents($f,$s); if(function_exists('opcache_invalidate')) opcache_invalidate($f,true); $o['ROLLBACK']='grąžinta'; }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
