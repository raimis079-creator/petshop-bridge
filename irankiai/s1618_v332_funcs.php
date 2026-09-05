
	/* ============================ v3.32: GRĄŽINIMAS ne dėl grįžusios siuntos (Raimis 09-05 A) ============================ */

	/** Grąžinimui tinkamos eilutės: kiekis > 0, be `_ps_atsaukta` / `_ps_kreditine`, dar negrąžintas likutis (`_ps_grazinta_q`). [eil[], pristatymas, prist_dalinis] — `prist_dalinis` = ar jau buvo dalinis grąžinimas (pristatymas nebegrąžinamas atsisakymo atveju). */
	protected static function grazinimo_eilutes( $o ) {
		$eil = array(); $buvo = false;
		foreach ( $o->get_items() as $iid => $it ) {
			if ( $it->get_meta( '_ps_kreditine' ) || '' !== (string) $it->get_meta( '_ps_atsaukta' ) ) { continue; }
			$q = (int) $it->get_quantity(); $gq = (int) $it->get_meta( self::GRAZINTA_Q_META ); if ( $gq > 0 ) { $buvo = true; }
			$mx = $q - $gq; if ( $q < 1 || $mx < 1 ) { continue; }
			$s = (float) $it->get_total() + (float) $it->get_total_tax();
			$eil[] = array( 'iid' => (int) $iid, 'n' => $it->get_name(), 'q_max' => $mx, 'vnt' => $s / $q, 'suma' => $s / $q * $mx );
		}
		$prist = 0.0; foreach ( $o->get_items( 'shipping' ) as $sh ) { $prist += (float) $sh->get_total() + (float) $sh->get_total_tax(); }
		foreach ( (array) $o->get_refunds() as $rf ) { foreach ( $rf->get_items( array( 'shipping' ) ) as $it ) { $prist -= abs( (float) $it->get_total() + (float) $it->get_total_tax() ); } }
		return array( $eil, round( max( 0.0, $prist ), 2 ), $buvo );
	}

	/** Forma „Grąžinimas“ (Klausimo „Klientas atsisako“ kortelėje ir įvykdyto skydelyje): prekės/kiekiai, priežastis, pristatymas, „tinkama prekybai“ → POST `ps_dl_grazinimas`. `$kur` — kur grįžti po veiksmo. Tuščia eilutė = formos nėra. */
	protected static function grazinimo_forma( $o, $id, $kur, $skydelis = false ) {
		list( $eil, $prist, $buvo ) = self::grazinimo_eilutes( $o ); if ( ! $eil ) { return ''; }
		$rows = '';
		foreach ( $eil as $r ) {
			$rows .= '<tr data-vnt="' . esc_attr( number_format( $r['vnt'], 6, '.', '' ) ) . '" data-q="' . (int) $r['q_max'] . '"><td>' . esc_html( mb_substr( $r['n'], 0, 70 ) ) . '</td><td class="c"><input type="number" name="q[' . (int) $r['iid'] . ']" min="0" max="' . (int) $r['q_max'] . '" step="1" value="' . (int) $r['q_max'] . '"> <span class="pilkas maz">iš ' . (int) $r['q_max'] . '</span></td><td class="r">−<span class="dl-kr-suma">' . esc_html( self::eur( $r['suma'] ) ) . '</span> €</td></tr>';
		}
		$viso = $prist; foreach ( $eil as $r ) { $viso += $r['suma']; }
		if ( $prist > 0.005 ) { $rows .= '<tr><td><label><input type="checkbox" class="dl-gr-pr" name="pristatymas" value="1"' . ( $buvo ? '' : ' checked' ) . ' data-suma="' . esc_attr( number_format( $prist, 2, '.', '' ) ) . '"> Pristatymas <span class="pilkas maz dl-gr-prt">(atsisakymas — tik grąžinant visą užsakymą)</span></label></td><td></td><td class="r">−' . esc_html( self::eur( $prist ) ) . ' €</td></tr>'; }
		$rows .= '<tr class="viso"><td><b>Kreditinė iš viso</b></td><td></td><td class="r"><b>−<span class="dl-kr-viso">' . esc_html( self::eur( $viso ) ) . '</span> €</b></td></tr>';
		$dlg = 'Klientas grąžina prekes (ne vežėjo grąžinta siunta). Sukuriamas WC grąžinimo įrašas (pinigų nejudina), išrašoma kreditinė PVM sąskaita faktūra KR-AVPN iš eilės (PDF Klausime „Grąžink klientui pinigus“); jei pažymėta „tinkama prekybai“ — prekės grįžta į AV likutį. 3,99 € netaikoma (klientas siunčia pats). Klientui laiškas — tik mygtuku „siųsti klientui“. Pinigus grąžinsi rankomis ir spausi „Grąžinta“.';
		return '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" class="dl-kr-f dl-gr-f' . ( $skydelis ? ' dl-gr-sk' : '' ) . '" data-dlg="' . esc_attr( $dlg ) . '"' . ( $skydelis ? '' : ' style="display:none"' ) . '>' . wp_nonce_field( 'ps_dl_graz_' . $id, '_wpnonce', true, false ) . '<input type="hidden" name="action" value="ps_dl_grazinimas"><input type="hidden" name="id" value="' . (int) $id . '"><input type="hidden" name="g" value="' . esc_attr( $kur ) . '">'
			. '<div class="dl-kr-a">Grąžinimas — klientas grąžina prekes <span class="pilkas maz">(pažymėk kiekius, priežastį; patvirtink — kreditinė išsirašo)</span></div>'
			. '<div class="dl-kr-m"><label>Priežastis <select name="priezastis" class="dl-gr-pz"><option value="atsisakymas">Klientas atsisako (14 d.)</option><option value="brokas">Brokas / sugadinta</option><option value="klaida">Mūsų klaida (ne ta prekė, trūko)</option></select></label></div>'
			. '<table>' . $rows . '</table>'
			. '<div class="dl-kr-m"><label><input type="checkbox" class="dl-gr-tk" name="tinkama" value="1" checked> Prekės tinkamos prekybai — grįžta į AV likutį <span class="pilkas maz">(brokas — nežymėk)</span></label></div>'
			. '<div class="dl-kr-v"><button type="button" class="v p dl-kr-s">Patvirtinti grąžinimą</button> <a href="#" class="pilkas maz dl-gr-x">atgal</a></div></form>';
	}

	/** POST `ps_dl_grazinimas` — „Patvirtinti grąžinimą“ (Raimis 09-05 A): (1) kiekiai pagal formą (≤ likutis be grąžintų), priežastis atsisakymas / brokas / klaida;
	 *  pristatymas — atsisakymas tik kai grąžinamas VISAS užsakymas (visi kiekiai, be ankstesnio dalinio), brokas / klaida — pagal varnelę; 3,99 € niekada;
	 *  (2) „tinkama prekybai“ → likutis grįžta kaip #4 kiekiuose (`_ps_av_reduced_qty` → AV, `_reduced_stock` → WC veidrodis; tiekėjo prekė be nurašymo — nekeičiama);
	 *  (3) `wc_create_refund` (be pinigų, `restock_items=false`, statusas nekinta, laiškai off) → KR-AVPN numeris + PDF tuo pačiu `kreditine_*` mechanizmu;
	 *  (4) eilutėse `_ps_grazinta_q` += q (pilnai grąžinta → `_ps_kreditine`=nr), įrašas `_ps_grazinti_rankomis` su `kr` → Klausimas „Grąžink klientui pinigus“ (PDF · siųsti klientui · Grąžinta). Laiško klientui NĖRA. */
	public static function grazinimas_vykdyti() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		$id = absint( $_POST['id'] ?? 0 ); check_admin_referer( 'ps_dl_graz_' . $id );
		$o = wc_get_order( $id ); if ( ! $o ) { wp_die( 'Užsakymas nerastas' ); }
		$atgal = wp_validate_redirect( wp_unslash( $_POST['g'] ?? '' ), admin_url( 'admin.php?page=' . self::SLUG . '&eile=klausimai' ) );
		$u = wp_get_current_user(); $lock = 'ps_dl_lock_' . $id;
		$baigti = function ( $k, $t ) use ( $o, $atgal, $lock ) { self::$kr_kuriama = false; delete_transient( $lock ); wp_safe_redirect( add_query_arg( array( 'pd_ok' => $k, 'pd_nr' => rawurlencode( $o->get_order_number() . '|' . $t ) ), $atgal ) ); exit; };
		if ( get_transient( $lock ) ) { $baigti( 'dl_info', 'veiksmas jau vykdomas — palauk sekundę' ); } set_transient( $lock, 1, 30 );
		try {
			$pz = sanitize_key( wp_unslash( $_POST['priezastis'] ?? '' ) ); $pz_t = array( 'atsisakymas' => 'klientas atsisakė', 'brokas' => 'brokas', 'klaida' => 'mūsų klaida' ); if ( ! isset( $pz_t[ $pz ] ) ) { $baigti( 'dl_klaida', 'nenurodyta priežastis' ); }
			$tinkama = ! empty( $_POST['tinkama'] ); $nr_u = $o->get_order_number();
			list( $eil, $prist_v, $buvo ) = self::grazinimo_eilutes( $o ); if ( ! $eil ) { $baigti( 'dl_klaida', 'grąžinti nėra ko — eilučių nerasta' ); }
			$qs = (array) ( $_POST['q'] ?? array() ); $li = array(); $viso = 0.0; $imta = array(); $visas = ! $buvo; $ka = array();
			foreach ( $eil as $x ) {
				$q = isset( $qs[ $x['iid'] ] ) ? absint( $qs[ $x['iid'] ] ) : 0; if ( $q > $x['q_max'] ) { $baigti( 'dl_klaida', 'blogas kiekis „' . mb_substr( $x['n'], 0, 40 ) . '“ (daugiausia ' . $x['q_max'] . ')' ); }
				if ( $q < $x['q_max'] ) { $visas = false; } if ( ! $q ) { continue; }
				$it = $o->get_item( $x['iid'] ); if ( ! $it ) { continue; } $k = $q / max( 1, (int) $it->get_quantity() );
				$tot = round( (float) $it->get_total() * $k, 6 ); $rt = array(); foreach ( (array) ( $it->get_taxes()['total'] ?? array() ) as $trid => $amt ) { $rt[ $trid ] = round( (float) $amt * $k, 6 ); }
				$li[ (int) $x['iid'] ] = array( 'qty' => $q, 'refund_total' => $tot, 'refund_tax' => $rt ); $viso += $tot + array_sum( $rt ); $imta[ (int) $x['iid'] ] = array( 'q' => $q, 'q_max' => (int) $x['q_max'], 'pid' => (int) $it->get_product_id() ); $ka[] = $q . '× ' . mb_substr( $x['n'], 0, 40 );
			}
			if ( ! $li ) { $baigti( 'dl_klaida', 'nė vienos prekės — grąžinimas neįrašytas' ); }
			$prist_gal = $prist_v > 0.005 && ! empty( $_POST['pristatymas'] ) && ( 'atsisakymas' !== $pz || $visas ); $prist = $prist_gal ? $prist_v : 0.0;
			if ( $prist > 0 ) { foreach ( $o->get_items( 'shipping' ) as $sid => $sh ) { $rt = array(); foreach ( (array) ( $sh->get_taxes()['total'] ?? array() ) as $trid => $amt ) { $rt[ $trid ] = (float) $amt; } $li[ (int) $sid ] = array( 'qty' => 1, 'refund_total' => (float) $sh->get_total(), 'refund_tax' => $rt ); } $viso += $prist; }
			$viso = round( $viso, 2 ); $rem = (float) $o->get_remaining_refund_amount();
			if ( $viso > $rem + 0.005 ) { $baigti( 'dl_klaida', sprintf( 'WC riba: grąžinti galima iki %s €, kreditinė %s € (užsakymo suma jau buvo mažinta) — tvarkyk su Raimiu', self::eur( $rem ), self::eur( $viso ) ) ); }
			// (2) likutis + žymės (atstatoma, jei WC įrašas nepavyks)
			$judesiai = array(); $atstatyti = array(); $metos = array();
			foreach ( $imta as $iid => $x ) {
				$it = $o->get_item( $iid ); if ( ! $it ) { continue; } $q = $x['q']; $pid = $x['pid'];
				$metos[ $iid ] = array( 'rq' => (int) $it->get_meta( '_ps_av_reduced_qty' ), 'rd' => (string) $it->get_meta( '_ps_av_reduced' ), 'wr' => (int) $it->get_meta( '_reduced_stock' ), 'rr' => (int) $it->get_meta( '_restock_refunded_items' ) );
				if ( $tinkama ) {
					$rq = $metos[ $iid ]['rq']; if ( ! $rq && $metos[ $iid ]['rd'] ) { $rq = (int) $it->get_quantity(); }
					if ( $rq > 0 ) { $m = min( $q, $rq ); $xr = self::likutis( $pid, $m, 'grąžinimas (' . $pz_t[ $pz ] . '), užsakymas #' . $nr_u ); if ( is_wp_error( $xr ) ) { foreach ( $atstatyti as $a ) { if ( 'av' === $a[0] ) { self::likutis( $a[1], -$a[2], 'grąžinimas nepavyko — atstatyta #' . $nr_u ); } else { $p = wc_get_product( $a[1] ); if ( $p ) { wc_update_product_stock( $p, $a[2], 'decrease' ); } } } $baigti( 'dl_klaida', 'likučio grąžinti nepavyko: ' . $xr->get_error_message() ); }
						$judesiai[] = 'AV +' . $m . ' → ' . $xr; $atstatyti[] = array( 'av', $pid, $m ); $liko = $rq - $m; if ( $liko > 0 ) { $it->update_meta_data( '_ps_av_reduced_qty', $liko ); } else { $it->delete_meta_data( '_ps_av_reduced_qty' ); $it->delete_meta_data( '_ps_av_reduced' ); } }
					$wr = $metos[ $iid ]['wr'];
					if ( $wr > 0 ) { $p = wc_get_product( $pid ); $m = min( $q, $wr ); if ( $p && $p->managing_stock() ) { $xw = wc_update_product_stock( $p, $m, 'increase' ); $judesiai[] = 'WC veidrodis +' . $m . ' → ' . ( null === $xw ? '?' : (int) $xw ); $atstatyti[] = array( 'wc', $pid, $m ); } $liko = $wr - $m; if ( $liko > 0 ) { $it->update_meta_data( '_reduced_stock', $liko ); } else { $it->delete_meta_data( '_reduced_stock' ); } }
					if ( ! $rq && ! $wr ) { $judesiai[] = mb_substr( $it->get_name(), 0, 30 ) . ': likutis nenurašytas (tiekėjo prekė) — AV nekeista'; }
				}
				$it->update_meta_data( '_restock_refunded_items', $metos[ $iid ]['rr'] + $q ); $it->save();
			}
			// (3) WC grąžinimo įrašas → kreditinė
			self::$kr_kuriama = true; self::d( 'laiskai_off' );
			$refund = wc_create_refund( array( 'order_id' => $id, 'amount' => $viso, 'reason' => 'Darbalaukis: grąžinimas (' . $pz_t[ $pz ] . ') — ' . mb_substr( implode( ', ', $ka ), 0, 100 ) . ' (' . $u->display_name . ')', 'line_items' => $li, 'refund_payment' => false, 'restock_items' => false ) );
			self::d( 'laiskai_on' ); self::$kr_kuriama = false;
			if ( is_wp_error( $refund ) ) {
				foreach ( $atstatyti as $a ) { if ( 'av' === $a[0] ) { self::likutis( $a[1], -$a[2], 'grąžinimas nepavyko — atstatyta #' . $nr_u ); } else { $p = wc_get_product( $a[1] ); if ( $p ) { wc_update_product_stock( $p, $a[2], 'decrease' ); } } }
				foreach ( $metos as $iid => $m_ ) { $it = $o->get_item( $iid ); if ( ! $it ) { continue; } if ( $m_['rq'] ) { $it->update_meta_data( '_ps_av_reduced_qty', $m_['rq'] ); } if ( $m_['rd'] ) { $it->update_meta_data( '_ps_av_reduced', $m_['rd'] ); } if ( $m_['wr'] ) { $it->update_meta_data( '_reduced_stock', $m_['wr'] ); } $it->update_meta_data( '_restock_refunded_items', $m_['rr'] ); $it->save(); }
				$baigti( 'dl_klaida', 'WC grąžinimo įrašo sukurti nepavyko: ' . $refund->get_error_message() . ' — niekas nepakeista' );
			}
			$refund->update_meta_data( '_ps_kreditine', 1 ); $refund->update_meta_data( '_ps_grazinimas', $pz ); $refund->save(); $rid = $refund->get_id();
			$nr = self::kreditine_numeris( $refund ); $pdf = self::kreditine_pdf( $refund, $o );
			// (4) žymės, įrašas, Klausimas
			$o = wc_get_order( $id );
			foreach ( $imta as $iid => $x ) { $it = $o->get_item( $iid ); if ( ! $it ) { continue; } $gq = (int) $it->get_meta( self::GRAZINTA_Q_META ) + $x['q']; $it->update_meta_data( self::GRAZINTA_Q_META, $gq ); if ( $x['q'] >= $x['q_max'] ) { $it->update_meta_data( '_ps_kreditine', $nr ); } $it->save(); }
			$g = self::grazinti( $o ); $ka_t = 'Grąžinimas (' . $pz_t[ $pz ] . '): ' . implode( ', ', $ka ) . ( $prist > 0 ? ' + pristatymas' : '' ) . ( $tinkama ? '' : ' — netinkama prekybai, į likutį negrįžo' );
			$g[] = array( 'laikas' => current_time( 'mysql' ), 'kas' => $u->display_name, 'suma' => $viso, 'refund' => $rid, 'ka' => $ka_t, 'graz' => array( 'priezastis' => $pz, 'tinkama' => $tinkama ? 1 : 0, 'visas' => $visas ? 1 : 0 ),
				'kr' => array( 'nr' => $nr, 'refund' => $rid, 'pdf' => $pdf ? basename( $pdf ) : '', 'suma' => $viso, 'laikas' => current_time( 'mysql' ), 'kas' => $u->display_name, 'mokestis' => 0, 'mok_avpn' => '', 'eil' => array_keys( $imta ), 'laiskas' => '' ) );
			$o->update_meta_data( self::GRAZINTI_META, wp_json_encode( $g ) );
			$o->add_order_note( sprintf( 'Darbalaukis: grąžinimas (%s) — %s%s; kreditinė %s išrašyta — %s € (%s); WC grąžinimo įrašas #%d%s. Likutis: %s. Klientui grąžinti %s € rankomis (Klausimas primins). Laiškas klientui: NESIŲSTAS — „siųsti klientui“ kortelėje.', $pz_t[ $pz ], implode( ', ', $ka ), $prist > 0 ? ' + pristatymas ' . self::eur( $prist ) . ' €' : '', $nr, self::eur( $viso ), $u->display_name, $rid, $pdf ? ', PDF ' . basename( $pdf ) : ', PDF NESUGENERUOTAS', $tinkama ? ( $judesiai ? implode( '; ', $judesiai ) : 'nekeista' ) : 'nekeista (netinkama prekybai)', self::eur( $viso ) ), false, true );
			$o->save();
			if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $id, 'sritis' => 'desk', 'veiksmas' => 'grazinimas', 'rezultatas' => $pdf ? 'ok' : 'klaida', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'po' => array( 'priezastis' => $pz, 'tinkama' => $tinkama ? 1 : 0, 'visas' => $visas ? 1 : 0, 'prekes' => $imta, 'pristatymas' => $prist, 'nr' => $nr, 'refund' => $rid, 'suma' => $viso, 'pdf' => $pdf ? basename( $pdf ) : '', 'likutis' => $judesiai ), 'pastaba' => 'grąžinimas (' . $pz_t[ $pz ] . ') · kreditinė ' . $nr . ' ' . self::eur( $viso ) . ' €' ) ); }
			do_action( 'ps_juosta_isvalyti' );
			$baigti( $pdf ? 'dl_info' : 'dl_klaida', 'grąžinimas įrašytas: kreditinė ' . $nr . ' (' . self::eur( $viso ) . ' €)' . ( $pdf ? '' : ' — PDF NESUGENERUOTAS' ) . ( $tinkama && $judesiai ? ' · likutis: ' . implode( '; ', $judesiai ) : '' ) . ' · grąžink klientui rankomis (Klausimas)' );
		} catch ( Throwable $ex ) { $baigti( 'dl_klaida', 'klaida: ' . $ex->getMessage() ); }
	}
