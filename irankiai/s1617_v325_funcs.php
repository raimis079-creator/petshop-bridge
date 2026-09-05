	/* ============================ v3.25: KREDITINĖ (spec §12.5; Raimis 09-05 K1 sava eilė, K2 A — 3,99 atskira sąskaita, K3 per WC grąžinimo įrašą, laiškas — darbuotojas) ============================ */

	/** Kai refund'ą kuria darbalaukis (kreditinė), WC statuso į „refunded“ nekeičia — užsakymas lieka atšauktas / įvykdytas (filtras `woocommerce_order_fully_refunded_status`). */
	public static function kr_be_statuso( $status, $order_id = 0, $refund_id = 0 ) { return self::$kr_kuriama ? false : $status; }

	/** Kreditinės juodraštis vienam „Grąžink klientui pinigus“ įrašui: [tipas refund|visas|dalis, refund, eil[{iid,n,q,q_max,vnt,suma,fiks}], pristatymas, pristatymas_gal, mokestis, viso] | null.
	 *  refund>0 (#4 kiekiai) — eilutės iš WC grąžinimo įrašo (fiksuotos); visas atšaukimas — eilutės be `_ps_atsaukta` (ankstesnės dalies) ir be `_ps_kreditine` + pristatymas; dalis — eilutės su `_ps_atsaukta` be `_ps_kreditine`. */
	protected static function kreditine_juodrastis( $o, $idx ) {
		$g = self::grazinti( $o ); if ( ! isset( $g[ $idx ] ) || ! empty( $g[ $idx ]['kr'] ) ) { return null; }
		$e = $g[ $idx ]; $rid = (int) ( $e['refund'] ?? 0 ); $eil = array(); $prist = 0.0; $prist_gal = false; $mok = 0;
		if ( $rid ) {
			$r = wc_get_order( $rid ); if ( ! $r || 'shop_order_refund' !== $r->get_type() ) { return null; } $tipas = 'refund';
			foreach ( $r->get_items( array( 'line_item' ) ) as $it ) { $q = abs( (int) $it->get_quantity() ); $s = abs( (float) $it->get_total() + (float) $it->get_total_tax() ); $eil[] = array( 'iid' => (int) $it->get_meta( '_refunded_item_id' ), 'n' => $it->get_name(), 'q' => $q, 'q_max' => $q, 'vnt' => $q ? $s / $q : $s, 'suma' => $s, 'fiks' => 1 ); }
			foreach ( $r->get_items( array( 'shipping' ) ) as $it ) { $prist += abs( (float) $it->get_total() + (float) $it->get_total_tax() ); }
		} else {
			$visas = in_array( $o->get_status(), Petshop_Desk::STATUSAI['atsaukti'], true ) && false === mb_strpos( (string) ( $e['ka'] ?? '' ), 'dalis' ); $tipas = $visas ? 'visas' : 'dalis';
			foreach ( $o->get_items() as $iid => $it ) {
				if ( $it->get_meta( '_ps_kreditine' ) ) { continue; } $ats = (string) $it->get_meta( '_ps_atsaukta' ); if ( $visas ? '' !== $ats : '' === $ats ) { continue; }
				$q = (int) $it->get_quantity(); if ( $q < 1 ) { continue; } $s = (float) $it->get_total() + (float) $it->get_total_tax();
				$eil[] = array( 'iid' => (int) $iid, 'n' => $it->get_name(), 'q' => $q, 'q_max' => $q, 'vnt' => $s / $q, 'suma' => $s, 'fiks' => 0 );
			}
			if ( $visas ) { foreach ( $o->get_items( 'shipping' ) as $sh ) { $prist += (float) $sh->get_total() + (float) $sh->get_total_tax(); } $prist_gal = $prist > 0.005; }
			$mok = ( false !== mb_strpos( (string) ( $e['ka'] ?? '' ), '3,99' ) ) ? 1 : 0;
		}
		if ( ! $eil ) { return null; }
		$viso = $prist; foreach ( $eil as $x ) { $viso += $x['suma']; }
		return array( 'tipas' => $tipas, 'refund' => $rid, 'eil' => $eil, 'pristatymas' => round( $prist, 2 ), 'pristatymas_gal' => $prist_gal, 'mokestis' => $mok, 'viso' => round( $viso, 2 ), 'suma' => (float) ( $e['suma'] ?? 0 ) );
	}

	/** Klausimų kortelės „Grąžink klientui pinigus“ eilutės (kiekvienas įrašas su kreditinės būsena) + formos (juodraščiai). Grąžina [html_sarasas, formos_html, be_kr (kiek įrašų be kreditinės)]. */
	protected static function kreditine_kortele( $o, $id, $g, $antr ) {
		$eil = array(); $formos = ''; $be_kr = 0;
		foreach ( $g as $idx => $x ) {
			$t = esc_html( substr( (string) ( $x['laikas'] ?? '' ), 5, 11 ) . ' ' . ( $x['kas'] ?? '' ) . ': ' . ( $x['ka'] ?? '' ) . ' (' . self::eur( $x['suma'] ?? 0 ) . ' €)' );
			if ( ! empty( $x['kr'] ) ) {
				$kr = $x['kr'];
				$t .= ' · Kreditinė <b>' . esc_html( $kr['nr'] ) . '</b> (' . esc_html( self::eur( $kr['suma'] ) ) . ' €' . ( ! empty( $kr['mok_avpn'] ) ? '; 3,99 € sąskaita ' . esc_html( $kr['mok_avpn'] ) : '' ) . ')'
					. ( ! empty( $kr['pdf'] ) ? ' <a class="pilkas maz" target="_blank" href="' . esc_url( self::dl_url( 'kr_pdf', $id, array( 'e' => $idx ) ) ) . '">PDF</a>' : ' <span class="raud maz">PDF nesugeneruotas</span>' )
					. ' <a class="pilkas maz" href="' . esc_url( self::dl_url( 'kr_laiskas', $id, array( 'e' => $idx ) ) ) . '" data-d="' . esc_attr( wp_json_encode( array( 'antraste' => $antr, 'tekstas' => 'Išsiųsti klientui (' . $o->get_billing_email() . ') kreditinę ' . $kr['nr'] . ( ! empty( $kr['mok_avpn'] ) ? ' ir 3,99 € sąskaitą ' . $kr['mok_avpn'] : '' ) . ' su PDF? Laiške — grąžinama suma ' . self::eur( $x['suma'] ?? 0 ) . ' € per 14 d.', 'ok' => 'Siųsti' ) ) ) . '">' . ( ! empty( $kr['laiskas'] ) ? 'siųsti klientui dar kartą (išsiųsta ' . esc_html( substr( $kr['laiskas'], 5, 11 ) ) . ')' : 'siųsti klientui' ) . '</a>';
			} else {
				$j = self::kreditine_juodrastis( $o, $idx ); $be_kr++;
				if ( ! $j ) { $t .= ' · <span class="pilkas maz">kreditinė: eilučių nerasta — rankomis</span>'; }
				else {
					$t .= ' <button type="button" class="v t dl-kr-b" data-e="' . (int) $idx . '">Kreditinė</button>';
					$rows = '';
					foreach ( $j['eil'] as $r ) {
						$rows .= '<tr data-vnt="' . esc_attr( number_format( $r['vnt'], 6, '.', '' ) ) . '" data-q="' . (int) $r['q'] . '"><td>' . esc_html( mb_substr( $r['n'], 0, 70 ) ) . '</td><td class="c">' . ( $r['fiks'] ? '−' . (int) $r['q'] : '<input type="number" name="q[' . (int) $r['iid'] . ']" min="0" max="' . (int) $r['q_max'] . '" step="1" value="' . (int) $r['q'] . '"> <span class="pilkas maz">iš ' . (int) $r['q_max'] . '</span>' ) . '</td><td class="r">−<span class="dl-kr-suma">' . esc_html( self::eur( $r['suma'] ) ) . '</span> €</td></tr>';
					}
					if ( 'refund' === $j['tipas'] ) { if ( $j['pristatymas'] > 0 ) { $rows .= '<tr><td>Pristatymas</td><td></td><td class="r">−' . esc_html( self::eur( $j['pristatymas'] ) ) . ' €</td></tr>'; } }
					elseif ( $j['pristatymas_gal'] ) { $rows .= '<tr><td><label><input type="checkbox" name="pristatymas" value="1" checked data-suma="' . esc_attr( number_format( $j['pristatymas'], 2, '.', '' ) ) . '"> Pristatymas (visa siunta grįžo)</label></td><td></td><td class="r">−' . esc_html( self::eur( $j['pristatymas'] ) ) . ' €</td></tr>'; }
					$rows .= '<tr class="viso"><td><b>Kreditinė iš viso</b></td><td></td><td class="r"><b>−<span class="dl-kr-viso">' . esc_html( self::eur( $j['viso'] ) ) . '</span> €</b></td></tr>';
					$mok_html = ( 'refund' !== $j['tipas'] ) ? '<label><input type="checkbox" name="mokestis" value="1"' . ( $j['mokestis'] ? ' checked' : '' ) . '> Siuntos grąžinimo išlaidos 3,99 € — atskira PVM sąskaita (išskaičiuojama iš grąžinamos sumos; nežymėk, kai nepristatyta dėl mūsų / vežėjo kaltės)</label> <span class="pilkas maz">→ klientui grąžinti <b class="dl-kr-graz">' . esc_html( self::eur( $j['viso'] - ( $j['mokestis'] ? self::GRAZINIMO_MOKESTIS : 0 ) ) ) . '</b> €</span>' : '<span class="pilkas maz">Grąžinimo įrašas WC jau yra (kiekio keitimas) — kreditinė išrašoma jam; klientui grąžinti ' . esc_html( self::eur( $j['suma'] ) ) . ' €.</span>';
					$dlg = 'refund' === $j['tipas'] ? 'Išrašoma kreditinė PVM sąskaita faktūra esamam WC grąžinimo įrašui: numeris KR-AVPN iš eilės, PDF čia. Pinigų sistema nejudina — grąžinsi rankomis ir spausi „Grąžinta“. Klientui laiškas — tik mygtuku „siųsti klientui“.' : 'Sukuriamas WC grąžinimo įrašas (pinigų nejudina, likučių neliečia — jie jau sutvarkyti), išrašoma kreditinė PVM sąskaita faktūra KR-AVPN iš eilės (PDF čia)' . ( 'visas' === $j['tipas'] ? '; jei pažymėta — 3,99 € siuntos grąžinimo išlaidų PVM sąskaita (įskaitymas)' : '; jei pažymėta — 3,99 € sąskaita (įskaitymas)' ) . '. Klientui laiškas — tik mygtuku „siųsti klientui“. Pinigus grąžinsi rankomis ir spausi „Grąžinta“.';
					$formos .= '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" class="dl-kr-f" data-e="' . (int) $idx . '" data-dlg="' . esc_attr( $dlg ) . '" style="display:none">' . wp_nonce_field( 'ps_dl_kr_' . $id, '_wpnonce', true, false ) . '<input type="hidden" name="action" value="ps_dl_kreditine"><input type="hidden" name="id" value="' . (int) $id . '"><input type="hidden" name="e" value="' . (int) $idx . '"><input type="hidden" name="g" value="' . esc_attr( self::url( array( 'eile' => 'klausimai', 'view' => null, 'q' => null, 'b' => null, 'atidaryti' => null ) ) ) . '">'
						. '<div class="dl-kr-a">Kreditinė PVM sąskaita faktūra — ' . esc_html( 'refund' === $j['tipas'] ? 'kiekio keitimo grąžinimui' : ( 'visas' === $j['tipas'] ? 'visam atšauktam užsakymui' : 'atšauktai daliai' ) ) . ' <span class="pilkas maz">(peržiūrėk, pataisyk kiekius, patvirtink)</span></div><table>' . $rows . '</table><div class="dl-kr-m">' . $mok_html . '</div><div class="dl-kr-v"><button type="button" class="v p dl-kr-s">Patvirtinti kreditinę</button> <a href="#" class="pilkas maz dl-kr-x">atgal</a></div></form>';
				}
			}
			$eil[] = $t;
		}
		return array( $eil, $formos, $be_kr );
	}

	/** POST `ps_dl_kreditine` — „Patvirtinti kreditinę“: (1) refund 0 → `wc_create_refund` (eilutės pagal kiekius + pristatymas; `refund_payment=false`, `restock_items=false`, statusas nekinta, laiškai off; `_restock_refunded_items` faktui);
	 *  (2) KR-AVPN numeris iš eilės (`petshop_kravpn_counter`) → refund meta; (3) PDF per temos base.php (`$template='creditnote'`, `$order['id']` = refund) → `uploads/wcdn/creditnote/`;
	 *  (4) jei pažymėta — 3,99 € paslaugos sąskaita (naujas mažas užsakymas „Siuntos grąžinimo išlaidos“, įskaitymas, AVPN pati); (5) įrašo `kr`, eilučių `_ps_kreditine`, pastaba, įvykis. Laiško klientui NĖRA (Raimis K3). */
	public static function kreditine_vykdyti() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		$id = absint( $_POST['id'] ?? 0 ); check_admin_referer( 'ps_dl_kr_' . $id );
		$o = wc_get_order( $id ); if ( ! $o ) { wp_die( 'Užsakymas nerastas' ); }
		$atgal = wp_validate_redirect( wp_unslash( $_POST['g'] ?? '' ), admin_url( 'admin.php?page=' . self::SLUG . '&eile=klausimai' ) );
		$u = wp_get_current_user(); $lock = 'ps_dl_lock_' . $id;
		$baigti = function ( $k, $t ) use ( $o, $atgal, $lock ) { self::$kr_kuriama = false; delete_transient( $lock ); wp_safe_redirect( add_query_arg( array( 'pd_ok' => $k, 'pd_nr' => rawurlencode( $o->get_order_number() . '|' . $t ) ), $atgal ) ); exit; };
		if ( get_transient( $lock ) ) { $baigti( 'dl_info', 'veiksmas jau vykdomas — palauk sekundę' ); } set_transient( $lock, 1, 30 );
		try {
			$idx = absint( $_POST['e'] ?? 0 ); $g = self::grazinti( $o ); if ( ! isset( $g[ $idx ] ) ) { $baigti( 'dl_klaida', 'grąžinimo įrašo nėra' ); }
			$e = $g[ $idx ]; if ( ! empty( $e['kr'] ) ) { $baigti( 'dl_info', 'kreditinė jau išrašyta: ' . $e['kr']['nr'] ); }
			$j = self::kreditine_juodrastis( $o, $idx ); if ( ! $j ) { $baigti( 'dl_klaida', 'kreditinės eilučių nerasta — tvarkyk rankomis' ); }
			$rid = (int) $j['refund']; $eil_ids = array(); $suma_kr = 0.0; $mok_zyme = ( 'refund' !== $j['tipas'] && ! empty( $_POST['mokestis'] ) );
			if ( ! $rid ) {
				$qs = (array) ( $_POST['q'] ?? array() ); $prist = ( $j['pristatymas_gal'] && ! empty( $_POST['pristatymas'] ) ) ? (float) $j['pristatymas'] : 0.0; $li = array(); $viso = 0.0;
				foreach ( $j['eil'] as $x ) {
					$q = isset( $qs[ $x['iid'] ] ) ? absint( $qs[ $x['iid'] ] ) : (int) $x['q']; if ( $q > $x['q_max'] ) { $baigti( 'dl_klaida', 'blogas kiekis „' . mb_substr( $x['n'], 0, 40 ) . '“ (daugiausia ' . $x['q_max'] . ')' ); } if ( ! $q ) { continue; }
					$it = $o->get_item( $x['iid'] ); if ( ! $it ) { continue; } $k = $q / max( 1, (int) $it->get_quantity() );
					$tot = round( (float) $it->get_total() * $k, 6 ); $rt = array(); foreach ( (array) ( $it->get_taxes()['total'] ?? array() ) as $trid => $amt ) { $rt[ $trid ] = round( (float) $amt * $k, 6 ); }
					$li[ (int) $x['iid'] ] = array( 'qty' => $q, 'refund_total' => $tot, 'refund_tax' => $rt ); $viso += $tot + array_sum( $rt ); $eil_ids[] = (int) $x['iid'];
				}
				if ( $prist > 0 ) { foreach ( $o->get_items( 'shipping' ) as $sid => $sh ) { $rt = array(); foreach ( (array) ( $sh->get_taxes()['total'] ?? array() ) as $trid => $amt ) { $rt[ $trid ] = (float) $amt; } $li[ (int) $sid ] = array( 'qty' => 0, 'refund_total' => (float) $sh->get_total(), 'refund_tax' => $rt ); $viso += (float) $sh->get_total() + array_sum( $rt ); } }
				if ( ! $li ) { $baigti( 'dl_klaida', 'nė vienos eilutės — kreditinė neišrašyta' ); }
				$viso = round( $viso, 2 ); $rem = (float) $o->get_remaining_refund_amount();
				if ( $viso > $rem + 0.005 ) { $baigti( 'dl_klaida', sprintf( 'WC riba: grąžinti galima iki %s €, kreditinė %s € (užsakymo suma jau buvo mažinta) — kreditinę tvarkyk su Raimiu', self::eur( $rem ), self::eur( $viso ) ) ); }
				$atstatyti = array(); foreach ( $li as $iid => $x ) { $it = $o->get_item( $iid ); if ( $it && 'line_item' === $it->get_type() && $x['qty'] ) { $it->update_meta_data( '_restock_refunded_items', (int) $it->get_meta( '_restock_refunded_items' ) + (int) $x['qty'] ); $it->save(); $atstatyti[ $iid ] = (int) $x['qty']; } }
				self::$kr_kuriama = true; self::d( 'laiskai_off' );
				$refund = wc_create_refund( array( 'order_id' => $id, 'amount' => $viso, 'reason' => 'Darbalaukis: kreditinė — ' . mb_substr( (string) ( $e['ka'] ?? '' ), 0, 120 ) . ' (' . $u->display_name . ')', 'line_items' => $li, 'refund_payment' => false, 'restock_items' => false ) );
				self::d( 'laiskai_on' ); self::$kr_kuriama = false;
				if ( is_wp_error( $refund ) ) { foreach ( $atstatyti as $iid => $q ) { $it = $o->get_item( $iid ); if ( $it ) { $it->update_meta_data( '_restock_refunded_items', max( 0, (int) $it->get_meta( '_restock_refunded_items' ) - $q ) ); $it->save(); } } $baigti( 'dl_klaida', 'WC grąžinimo įrašo sukurti nepavyko: ' . $refund->get_error_message() . ' — niekas nepakeista' ); }
				$refund->update_meta_data( '_ps_kreditine', 1 ); $refund->save(); $rid = $refund->get_id(); $suma_kr = $viso;
			} else {
				$refund = wc_get_order( $rid ); $suma_kr = abs( (float) $refund->get_total() ); foreach ( $j['eil'] as $x ) { $eil_ids[] = (int) $x['iid']; }
			}
			$nr = self::kreditine_numeris( $refund ); $pdf = self::kreditine_pdf( $refund, $o );
			$mok = $mok_zyme ? self::grazinimo_mokestis_sukurti( $o, $u, $nr ) : null;
			$o = wc_get_order( $id ); $g = self::grazinti( $o );
			$g[ $idx ]['kr'] = array( 'nr' => $nr, 'refund' => $rid, 'pdf' => $pdf ? basename( $pdf ) : '', 'suma' => round( $suma_kr, 2 ), 'laikas' => current_time( 'mysql' ), 'kas' => $u->display_name, 'mokestis' => $mok ? (int) $mok['id'] : 0, 'mok_avpn' => $mok ? $mok['avpn'] : '', 'eil' => $eil_ids );
			if ( 'refund' !== $j['tipas'] ) { $g[ $idx ]['suma'] = round( $suma_kr - ( $mok ? self::GRAZINIMO_MOKESTIS : 0 ), 2 ); }
			$o->update_meta_data( self::GRAZINTI_META, wp_json_encode( $g ) );
			foreach ( $eil_ids as $iid ) { $it = $o->get_item( $iid ); if ( $it ) { $it->update_meta_data( '_ps_kreditine', $nr ); $it->save(); } }
			$o->add_order_note( sprintf( 'Darbalaukis: kreditinė %s išrašyta — %s € (%s); WC grąžinimo įrašas #%d%s. %s Klientui grąžinti %s € rankomis (Klausimas primins). Laiškas klientui: NESIŲSTAS — „siųsti klientui“ kortelėje.', $nr, self::eur( $suma_kr ), $u->display_name, $rid, $pdf ? ', PDF ' . basename( $pdf ) : ', PDF NESUGENERUOTAS', $mok ? ( $mok['avpn'] ? 'Siuntos grąžinimo išlaidos 3,99 € — PVM sąskaita ' . $mok['avpn'] . ' (#' . $mok['nr'] . ', įskaitymas).' : 'Siuntos grąžinimo išlaidų sąskaita #' . $mok['nr'] . ' — AVPN NEIŠRAŠYTA (būsena ' . $mok['st'] . ').' ) : ( $mok_zyme ? '3,99 € sąskaitos sukurti NEPAVYKO.' : '' ), self::eur( $g[ $idx ]['suma'] ) ), false, true ); $o->save();
			if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $id, 'sritis' => 'desk', 'veiksmas' => 'kreditine', 'rezultatas' => $pdf ? 'ok' : 'klaida', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'po' => array( 'nr' => $nr, 'refund' => $rid, 'suma' => $suma_kr, 'pdf' => $pdf ? basename( $pdf ) : '', 'mokestis' => $mok ? $mok : null, 'grazinti' => $g[ $idx ]['suma'] ), 'pastaba' => 'kreditinė ' . $nr . ' ' . self::eur( $suma_kr ) . ' €' ) ); }
			do_action( 'ps_juosta_isvalyti' );
			$baigti( $pdf ? 'dl_info' : 'dl_klaida', 'kreditinė ' . $nr . ' (' . self::eur( $suma_kr ) . ' €) išrašyta' . ( $pdf ? '' : ' — PDF NESUGENERUOTAS' ) . ( $mok ? ' · 3,99 € sąskaita ' . ( $mok['avpn'] ? $mok['avpn'] : '#' . $mok['nr'] . ' (AVPN neišrašyta)' ) : '' ) . ' · grąžink klientui ' . self::eur( $g[ $idx ]['suma'] ) . ' € rankomis' );
		} catch ( Throwable $ex ) { $baigti( 'dl_klaida', 'klaida: ' . $ex->getMessage() ); }
	}

	/** KR-AVPN numeris iš savos eilės (`petshop_kravpn_counter` = KITAS numeris, kaip `petshop_avpn_counter`; T-0 → 101). Rašomas į refund meta `_petshop_kravpn_number` + `_petshop_kravpn_date` (temos base.php v2.9 skaito). */
	protected static function kreditine_numeris( $refund ) {
		$nr = (string) $refund->get_meta( '_petshop_kravpn_number' ); if ( $nr ) { return $nr; }
		$n = max( 1, (int) get_option( self::KR_COUNTER_OPT, 101 ) ); update_option( self::KR_COUNTER_OPT, $n + 1, false );
		$nr = 'KR-AVPN' . str_pad( (string) $n, 6, '0', STR_PAD_LEFT );
		$refund->update_meta_data( '_petshop_kravpn_number', $nr ); $refund->update_meta_data( '_petshop_kravpn_date', current_time( 'Y-m-d' ) ); $refund->save();
		return $nr;
	}

	/** Kreditinės PDF — kaip temos `petshop_generate_invoice_pdf` (tas pats `$order` masyvas, logotipas, Dompdf A4), tik `$template='creditnote'` ir `$order['id']` = refund ID (base.php v2.9 → tas grąžinimas, KR numeris, data). Kelias į refund meta `_petshop_kravpn_pdf`. Tema NELIESTA (tik include). */
	protected static function kreditine_pdf( $refund, $o ) {
		$tf = get_stylesheet_directory() . '/woocommerce-delivery-notes/base.php'; if ( ! file_exists( $tf ) || ! class_exists( 'Dompdf\\Dompdf' ) ) { return ''; }
		$countries = WC()->countries ? WC()->countries->get_countries() : array(); $bc = $o->get_billing_country(); $bcn = isset( $countries[ $bc ] ) ? $countries[ $bc ] : $bc;
		$skip = array( 'pasirinkite rajona', 'select a region', 'select an option' ); $bs = $o->get_billing_state(); $bsv = ( $bs && ! in_array( mb_strtolower( $bs ), $skip, true ) ) ? $bs : '';
		$cp = trim( $o->get_billing_city() . ( $o->get_billing_postcode() ? ', ' . $o->get_billing_postcode() : '' ) );
		$order = array( 'id' => $refund->get_id(), 'orderNumber' => $o->get_order_number(), 'documentDate' => date_i18n( 'Y-m-d' ), 'date' => $o->get_date_created() ? $o->get_date_created()->format( 'Y-m-d' ) : date( 'Y-m-d' ), 'paymentMethod' => $o->get_payment_method_title(),
			'billing' => array( 'name' => trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ), 'address' => array_values( array_filter( array( $o->get_billing_address_1(), $o->get_billing_address_2(), $cp, $bsv, $bcn ) ) ), 'phone' => $o->get_billing_phone(), 'email' => $o->get_billing_email() ), 'shipping' => array( 'name' => '', 'address' => array() ) );
		$logo_url = ''; $logo_path = ''; $lid = get_theme_mod( 'site_logo' ); if ( $lid ) { $logo_url = wp_get_attachment_image_url( $lid, 'full' ); $logo_path = get_attached_file( $lid ); }
		$shop = array( 'logo' => $logo_url, 'logo_path' => $logo_path, 'name' => get_bloginfo( 'name' ) ); $settings = array( 'displayPriceInProductDetailsTable' => true ); $document = array(); $template = 'creditnote'; $type = 'pdf'; $items = array(); $totals = array();
		ob_start(); include $tf; $body = ob_get_clean();
		$html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>@page{size:A4;margin:12mm 14mm;}body{margin:0;padding:0;}</style></head><body>' . $body . '</body></html>';
		$up = wp_upload_dir(); $dir = trailingslashit( $up['basedir'] ) . 'wcdn/creditnote/'; wp_mkdir_p( $dir ); $nr = (string) $refund->get_meta( '_petshop_kravpn_number' ); $file = $dir . 'Kreditine-saskaita-' . ( $nr ? $nr : 'refund-' . $refund->get_id() ) . '.pdf';
		try { $opt = new \Dompdf\Options(); $opt->set( 'isRemoteEnabled', true ); $opt->set( 'isHtml5ParserEnabled', true ); $opt->set( 'isFontSubsettingEnabled', true ); $opt->set( 'chroot', array( realpath( ABSPATH ), realpath( $up['basedir'] ) ) ); $d = new \Dompdf\Dompdf( $opt ); $d->loadHtml( $html, 'UTF-8' ); $d->setPaper( array( 0, 0, 595.28, 841.89 ), 'portrait' ); $d->render(); file_put_contents( $file, $d->output() ); }
		catch ( Throwable $ex ) { return ''; }
		if ( ! file_exists( $file ) ) { return ''; }
		$refund->update_meta_data( '_petshop_kravpn_pdf', $file ); $refund->save();
		return $file;
	}

	/** Paslaugos prekė „Siuntos grąžinimo išlaidos“ (3,99 su PVM; privati, be likučio, `_ps_sandelis=paslauga`) — K2 A. */
	protected static function grazinimo_preke() {
		$id = (int) get_option( self::GRAZ_PREKE_OPT ); $p = $id ? wc_get_product( $id ) : null;
		if ( $p && 'trash' !== $p->get_status() ) { return $p; }
		$p = new WC_Product_Simple();
		$p->set_name( 'Siuntos grąžinimo išlaidos' ); $p->set_status( 'private' ); $p->set_catalog_visibility( 'hidden' ); $p->set_virtual( true );
		$p->set_regular_price( number_format( self::GRAZINIMO_MOKESTIS, 2, '.', '' ) ); $p->set_tax_status( 'taxable' ); $p->set_tax_class( '' ); $p->set_manage_stock( false ); $p->set_stock_status( 'instock' ); $p->set_sold_individually( true ); $p->set_reviews_allowed( false );
		$p->set_description( 'Paslauga: neatsiimtos / nepristatytos siuntos grąžinimo išlaidos (pirkimo taisyklių 6.10–6.11 p., 3,99 € su PVM). Naudoja darbalaukis (kreditinė).' );
		$p->update_meta_data( '_ps_paslauga', 'grazinimo_islaidos' ); $p->update_meta_data( '_ps_sandelis', 'paslauga' );
		$pid = $p->save(); if ( ! $pid ) { return null; }
		update_option( self::GRAZ_PREKE_OPT, $pid, false );
		return wc_get_product( $pid );
	}

	/** 3,99 € siuntos grąžinimo išlaidų PVM sąskaita (K2 A): naujas mažas svečio užsakymas tam pačiam klientui, apmokėtas įskaitymu iš grąžinamos sumos → `processing` → `pakartotinis_apmoketas` (šaka `grazinimo_islaidos`) → `completed`, tema išrašo AVPN. Be laiškų, darbalaukyje nerodomas (`_ps_pakartotinis`). Grąžina [id,nr,avpn,pdf,st] | null. */
	protected static function grazinimo_mokestis_sukurti( $o, $u, $kr ) {
		$p = self::grazinimo_preke(); if ( ! $p ) { return null; }
		$n = wc_create_order( array( 'customer_id' => 0, 'created_via' => 'darbalaukis', 'status' => 'pending' ) ); if ( is_wp_error( $n ) || ! $n ) { return null; }
		$n->set_address( $o->get_address( 'billing' ), 'billing' ); $n->set_address( $o->get_address( 'shipping' ), 'shipping' ); $n->set_currency( $o->get_currency() ); $n->set_prices_include_tax( true );
		$it = new WC_Order_Item_Product(); $it->set_product( $p ); $it->set_quantity( 1 ); $it->set_name( 'Siuntos grąžinimo išlaidos už užsakymą #' . $o->get_order_number() );
		$neto = (float) wc_get_price_excluding_tax( $p, array( 'qty' => 1, 'price' => self::GRAZINIMO_MOKESTIS ) ); $it->set_subtotal( $neto ); $it->set_total( $neto ); $n->add_item( $it );
		$n->update_meta_data( self::PAKART_META, (string) $o->get_id() ); $n->update_meta_data( '_ps_paslauga', 'grazinimo_islaidos' ); $n->update_meta_data( '_ps_uzbaigti_be_siuntu', '1' ); $n->update_meta_data( '_ps_kreditine_nr', $kr );
		if ( $o->get_customer_id() ) { $n->update_meta_data( '_ps_pakartotinis_klientas', (string) $o->get_customer_id() ); }
		$n->set_payment_method( '' ); $n->set_payment_method_title( 'Įskaitymas iš grąžinamos sumos' ); $n->calculate_totals( true ); $n->save();
		$n = wc_get_order( $n->get_id() ); $n->add_order_note( sprintf( 'Darbalaukis: siuntos grąžinimo išlaidos %s € už užsakymą #%s (kreditinė %s) — apmokėta įskaitymu iš grąžinamos sumos (%s). Į Surinkti / Venipak neina. Laiškas klientui: NESIŲSTAS.', self::eur( $n->get_total() ), $o->get_order_number(), $kr, $u->display_name ), false, true ); $n->save();
		self::d( 'laiskai_off' ); $n->update_status( 'processing', 'Darbalaukis: įskaitymas (kreditinė ' . $kr . ').', true ); self::d( 'laiskai_on' );
		$n = wc_get_order( $n->get_id() );
		return array( 'id' => $n->get_id(), 'nr' => $n->get_order_number(), 'avpn' => (string) $n->get_meta( '_petshop_avpn_number' ), 'pdf' => (string) $n->get_meta( '_petshop_completed_pdf' ), 'st' => $n->get_status() );
	}

	/** „siųsti klientui“ (GET `kr_laiskas&e=`) — laiškas su kreditinės PDF (+ 3,99 € sąskaitos PDF). Tik darbuotojo ranka (Raimis K3). Tekstas — Claude siūlo, Raimis tvirtina. */
	protected static function kreditine_laiskas( $o, $u, $idx ) {
		$g = self::grazinti( $o ); if ( ! isset( $g[ $idx ] ) || empty( $g[ $idx ]['kr'] ) ) { return array( 'dl_info', 'kreditinės šiam įrašui nėra' ); }
		$kr = $g[ $idx ]['kr']; $el = $o->get_billing_email(); if ( ! is_email( $el ) ) { return array( 'dl_klaida', 'kliento el. pašto nėra' ); }
		$r = wc_get_order( (int) $kr['refund'] ); $pdf = $r ? (string) $r->get_meta( '_petshop_kravpn_pdf' ) : ''; if ( ! $pdf || ! file_exists( $pdf ) ) { return array( 'dl_klaida', 'kreditinės PDF nėra — laiškas nesiųstas' ); }
		$priedai = array( $pdf ); $mok_pdf = ''; if ( ! empty( $kr['mokestis'] ) ) { $m = wc_get_order( (int) $kr['mokestis'] ); $mok_pdf = $m ? (string) $m->get_meta( '_petshop_completed_pdf' ) : ''; if ( $mok_pdf && file_exists( $mok_pdf ) ) { $priedai[] = $mok_pdf; } }
		$vardas = trim( (string) $o->get_billing_first_name() ); $nr = $o->get_order_number(); $graz = self::eur( $g[ $idx ]['suma'] ?? 0 );
		$h  = '<p>' . esc_html( $vardas ? "Sveiki, {$vardas}." : 'Sveiki.' ) . '</p>';
		$h .= '<p>' . esc_html( sprintf( 'Pridedame kreditinę PVM sąskaitą faktūrą Nr. %s (%s €) už užsakymą Nr. %s.', $kr['nr'], self::eur( $kr['suma'] ), $nr ) ) . '</p>';
		if ( ! empty( $kr['mok_avpn'] ) ) { $h .= '<p>' . esc_html( sprintf( 'Siuntos grąžinimo išlaidos — %s € (pirkimo taisyklių 6.10–6.11 p.) — PVM sąskaita faktūra Nr. %s pridėta; jos apmokėjimą įskaitome iš grąžinamos sumos.', self::eur( self::GRAZINIMO_MOKESTIS ), $kr['mok_avpn'] ) ) . '</p>'; }
		$h .= '<p>' . esc_html( sprintf( 'Grąžinama suma — %s €. Pinigus grąžinsime per 14 dienų tuo pačiu būdu, kuriuo mokėjote.', $graz ) ) . '</p>';
		$h .= '<p>' . esc_html( 'Gražios dienos,' ) . '<br>' . esc_html( 'Petshop.lt komanda' ) . '<br>+370 681 87787<br>terra@petshop.lt</p>';
		$tema = sprintf( 'Kreditinė sąskaita Nr. %s už užsakymą Nr. %s', $kr['nr'], $nr );
		$mailer = WC()->mailer(); $ok = (bool) $mailer->send( $el, $tema, $mailer->wrap_message( $tema, $h ), '', $priedai );
		if ( $ok ) { $g[ $idx ]['kr']['laiskas'] = current_time( 'mysql' ); $o->update_meta_data( self::GRAZINTI_META, wp_json_encode( $g ) ); }
		$o->add_order_note( sprintf( 'Darbalaukis: kreditinė %s klientui (%s) %s%s (%s).', $kr['nr'], $el, $ok ? 'išsiųsta' : 'NEIŠSIŲSTA', $mok_pdf && file_exists( $mok_pdf ) ? ' su 3,99 € sąskaita ' . $kr['mok_avpn'] : '', $u->display_name ), false, true ); $o->save();
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'kr_laiskas', 'rezultatas' => $ok ? 'ok' : 'klaida', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'po' => array( 'nr' => $kr['nr'], 'kam' => $el, 'priedai' => count( $priedai ) ), 'pastaba' => 'kreditinė ' . $kr['nr'] . ' klientui' ) ); }
		return array( $ok ? 'dl_info' : 'dl_klaida', $ok ? 'kreditinė ' . $kr['nr'] . ' išsiųsta klientui (' . $el . ')' : 'laiško išsiųsti nepavyko' );
	}

	/** GET `kr_pdf&e=` — kreditinės PDF atsisiuntimas (be WC lango; failas `uploads/wcdn/creditnote/`). */
	protected static function kreditine_faila( $o, $idx ) {
		$g = self::grazinti( $o ); $kr = $g[ $idx ]['kr'] ?? null; $r = $kr ? wc_get_order( (int) $kr['refund'] ) : null; $pdf = $r ? (string) $r->get_meta( '_petshop_kravpn_pdf' ) : '';
		if ( ! $pdf || ! file_exists( $pdf ) ) { wp_die( 'Kreditinės PDF nėra' ); }
		nocache_headers(); header( 'Content-Type: application/pdf' ); header( 'Content-Disposition: inline; filename="' . basename( $pdf ) . '"' ); header( 'Content-Length: ' . filesize( $pdf ) ); readfile( $pdf ); exit;
	}

