	/* ============================ v3.26: SĄSKAITOS (spec §12.5 „Sąskaita“ — visų dokumentų sąrašas + skydelio blokas; PDF be WC lango) ============================ */

	/** Užsakymo dokumentai skydeliui: IAPV, AVPN, kreditinės (refund meta), susietų paslaugų užsakymų (`_ps_pakartotinis`) AVPN. [{t,z,nr,d,s,u,gen}] */
	protected static function dokumentai( $o ) {
		global $wpdb; $d = array(); $id = $o->get_id();
		$pdf_u = function ( $t, $oid ) { return self::dl_url( 'dok_pdf', $oid, array( 't' => $t ) ); };
		$data = function ( $dt ) { return $dt ? $dt->date_i18n( 'Y-m-d' ) : ''; };
		if ( $o->get_meta( '_petshop_iapv_number' ) ) { $p = (string) $o->get_meta( '_petshop_order_pdf' ); $d[] = array( 't' => 'iapv', 'z' => 'Išankstinė sąskaita', 'nr' => (string) $o->get_meta( '_petshop_iapv_number' ), 'd' => $data( $o->get_date_created() ), 's' => self::eur( $o->get_total() ), 'u' => $p && file_exists( $p ) ? $pdf_u( 'iapv', $id ) : '', 'gen' => '' ); }
		if ( $o->get_meta( '_petshop_avpn_number' ) ) { $p = (string) $o->get_meta( '_petshop_completed_pdf' ); $d[] = array( 't' => 'avpn', 'z' => 'PVM sąskaita faktūra', 'nr' => (string) $o->get_meta( '_petshop_avpn_number' ), 'd' => $data( $o->get_date_completed() ? $o->get_date_completed() : $o->get_date_paid() ), 's' => self::eur( $o->get_total() ), 'u' => $p && file_exists( $p ) ? $pdf_u( 'avpn', $id ) : '', 'gen' => ( $p && file_exists( $p ) ) ? '' : ( $o->is_paid() ? self::dl_url( 'dok_gen', $id ) : '' ) ); }
		foreach ( $o->get_refunds() as $r ) { $nr = (string) $r->get_meta( '_petshop_kravpn_number' ); if ( ! $nr ) { continue; } $p = (string) $r->get_meta( '_petshop_kravpn_pdf' ); $d[] = array( 't' => 'kr', 'z' => 'Kreditinė', 'nr' => $nr, 'd' => (string) $r->get_meta( '_petshop_kravpn_date' ), 's' => '−' . self::eur( abs( (float) $r->get_total() ) ), 'u' => $p && file_exists( $p ) ? $pdf_u( 'kr', $r->get_id() ) : '', 'gen' => '' ); }
		$pasl = $wpdb->get_col( $wpdb->prepare( "SELECT m.order_id FROM {$wpdb->prefix}wc_orders_meta m JOIN {$wpdb->prefix}wc_orders o ON o.id=m.order_id AND o.type='shop_order' WHERE m.meta_key='_ps_pakartotinis' AND m.meta_value=%s ORDER BY m.order_id", (string) $id ) );
		foreach ( $pasl as $pid ) { $n = wc_get_order( (int) $pid ); if ( ! $n || ! $n->get_meta( '_petshop_avpn_number' ) ) { continue; } $p = (string) $n->get_meta( '_petshop_completed_pdf' ); $z = 'grazinimo_islaidos' === (string) $n->get_meta( '_ps_paslauga' ) ? 'Siuntos grąžinimo išlaidos (#' . $n->get_order_number() . ')' : 'Pakartotinis siuntimas (#' . $n->get_order_number() . ')'; $d[] = array( 't' => 'avpn', 'z' => $z, 'nr' => (string) $n->get_meta( '_petshop_avpn_number' ), 'd' => $data( $n->get_date_completed() ), 's' => self::eur( $n->get_total() ), 'u' => $p && file_exists( $p ) ? $pdf_u( 'avpn', (int) $pid ) : '', 'gen' => '' ); }
		return $d;
	}

	/** GET `dok_pdf&t=avpn|iapv|kr` — dokumento PDF srautas (užsakymo arba refund'o meta; be WC lango). */
	protected static function dok_faila( $o, $t ) {
		$raktai = array( 'avpn' => '_petshop_completed_pdf', 'iapv' => '_petshop_order_pdf', 'kr' => '_petshop_kravpn_pdf' );
		$pdf = ( $o && isset( $raktai[ $t ] ) ) ? (string) $o->get_meta( $raktai[ $t ] ) : '';
		if ( ! $pdf || ! file_exists( $pdf ) ) { wp_die( 'PDF nėra' ); }
		nocache_headers(); header( 'Content-Type: application/pdf' ); header( 'Content-Disposition: inline; filename="' . basename( $pdf ) . '"' ); header( 'Content-Length: ' . filesize( $pdf ) ); readfile( $pdf ); exit;
	}

	/** GET `dok_gen` — AVPN PDF sugeneruoti iš naujo temos f-ja `petshop_generate_invoice_pdf` (tik apmokėtam su AVPN numeriu; senesni užsakymai turi numerį be failo). Tema neliesta. */
	protected static function dok_gen( $o, $u ) {
		if ( ! function_exists( 'petshop_generate_invoice_pdf' ) ) { return array( 'dl_klaida', 'temos PDF generatoriaus nėra' ); }
		if ( ! $o->get_meta( '_petshop_avpn_number' ) || ! $o->is_paid() ) { return array( 'dl_info', 'AVPN PDF generuojamas tik apmokėtam užsakymui su AVPN numeriu' ); }
		$pdf = petshop_generate_invoice_pdf( $o->get_id() );
		if ( ! $pdf || ! file_exists( $pdf ) ) { return array( 'dl_klaida', 'PDF sugeneruoti nepavyko' ); }
		$o->update_meta_data( '_petshop_completed_pdf', $pdf ); $o->add_order_note( 'Darbalaukis: PVM sąskaitos ' . $o->get_meta( '_petshop_avpn_number' ) . ' PDF sugeneruotas iš naujo (' . $u->display_name . ').', false, true ); $o->save();
		return array( 'dl_info', 'PDF ' . basename( $pdf ) . ' sugeneruotas' );
	}

	protected static function saskaitu_langas() { return isset( $_GET['view'] ) && 'saskaitos' === $_GET['view'] && ! self::senas(); }

	/** „Sąskaitos“ langas (`view=saskaitos`): visos AVPN / IAPV / KR-AVPN iš meta (HPOS SQL), filtrai — tipas, nuo/iki, paieška (nr., užsakymas, klientas, el. paštas); PDF čia; suma ir skaičius apačioje. */
	protected static function saskaitos() {
		global $wpdb; $p = $wpdb->prefix;
		$t = isset( $_GET['t'] ) ? sanitize_key( $_GET['t'] ) : ''; if ( ! in_array( $t, array( 'avpn', 'iapv', 'kr' ), true ) ) { $t = ''; }
		$q = isset( $_GET['q'] ) ? trim( sanitize_text_field( wp_unslash( $_GET['q'] ) ) ) : '';
		$nuo = isset( $_GET['nuo'] ) && preg_match( '/^\d{4}-\d{2}-\d{2}$/', $_GET['nuo'] ) ? $_GET['nuo'] : ''; $iki = isset( $_GET['iki'] ) && preg_match( '/^\d{4}-\d{2}-\d{2}$/', $_GET['iki'] ) ? $_GET['iki'] : '';
		$psl = max( 1, absint( $_GET['psl'] ?? 1 ) ); $per = 200;
		$sel = function ( $tipas, $meta_nr, $meta_pdf, $is_refund ) use ( $p ) {
			if ( $is_refund ) { return "SELECT 'kr' t, r.id did, o.id oid, m.meta_value nr, r.date_created_gmt d, r.total_amount s, o.status st, o.billing_email em, CONCAT(COALESCE(a.first_name,''),' ',COALESCE(a.last_name,'')) kl, p.meta_value pdf FROM {$p}wc_orders_meta m JOIN {$p}wc_orders r ON r.id=m.order_id AND r.type='shop_order_refund' JOIN {$p}wc_orders o ON o.id=r.parent_order_id LEFT JOIN {$p}wc_order_addresses a ON a.order_id=o.id AND a.address_type='billing' LEFT JOIN {$p}wc_orders_meta p ON p.order_id=r.id AND p.meta_key='{$meta_pdf}' WHERE m.meta_key='{$meta_nr}'"; }
			$dt = 'avpn' === $tipas ? 'COALESCE(o.date_completed_gmt,o.date_paid_gmt,o.date_created_gmt)' : 'o.date_created_gmt';
			return "SELECT '{$tipas}' t, o.id did, o.id oid, m.meta_value nr, {$dt} d, o.total_amount s, o.status st, o.billing_email em, CONCAT(COALESCE(a.first_name,''),' ',COALESCE(a.last_name,'')) kl, p.meta_value pdf FROM {$p}wc_orders_meta m JOIN {$p}wc_orders o ON o.id=m.order_id AND o.type='shop_order' LEFT JOIN {$p}wc_order_addresses a ON a.order_id=o.id AND a.address_type='billing' LEFT JOIN {$p}wc_orders_meta p ON p.order_id=o.id AND p.meta_key='{$meta_pdf}' WHERE m.meta_key='{$meta_nr}'";
		};
		$dalys = array(); if ( ! $t || 'avpn' === $t ) { $dalys[] = $sel( 'avpn', '_petshop_avpn_number', '_petshop_completed_pdf', false ); } if ( ! $t || 'iapv' === $t ) { $dalys[] = $sel( 'iapv', '_petshop_iapv_number', '_petshop_order_pdf', false ); } if ( ! $t || 'kr' === $t ) { $dalys[] = $sel( 'kr', '_petshop_kravpn_number', '_petshop_kravpn_pdf', true ); }
		$w = array( '1=1' ); $args = array();
		if ( $nuo ) { $w[] = 'x.d >= %s'; $args[] = get_gmt_from_date( $nuo . ' 00:00:00' ); } if ( $iki ) { $w[] = 'x.d <= %s'; $args[] = get_gmt_from_date( $iki . ' 23:59:59' ); }
		if ( '' !== $q ) { $like = '%' . $wpdb->esc_like( $q ) . '%'; $w[] = '(x.nr LIKE %s OR x.oid LIKE %s OR x.em LIKE %s OR x.kl LIKE %s)'; array_push( $args, $like, $like, $like, $like ); }
		$sql = 'SELECT DISTINCT x.* FROM (' . implode( ' UNION ALL ', $dalys ) . ') x WHERE ' . implode( ' AND ', $w ) . ' ORDER BY x.d DESC, x.nr DESC';
		$viso = $wpdb->get_results( $args ? $wpdb->prepare( $sql, $args ) : $sql, ARRAY_A ); $n = count( $viso ); $suma = 0.0; foreach ( $viso as $r ) { $suma += (float) $r['s']; }
		$rows = array_slice( $viso, ( $psl - 1 ) * $per, $per ); $psl_n = max( 1, (int) ceil( $n / $per ) );
		$base = array( 'page' => self::SLUG, 'view' => 'saskaitos' ); $url = function ( $x ) use ( $base, $t, $q, $nuo, $iki ) { return admin_url( 'admin.php?' . http_build_query( array_filter( array_merge( $base, array( 't' => $t, 'q' => $q, 'nuo' => $nuo, 'iki' => $iki ), $x ), function ( $v ) { return '' !== $v && null !== $v; } ) ) ); };
		$tip = array( 'avpn' => 'PVM sąskaita', 'iapv' => 'Išankstinė', 'kr' => 'Kreditinė' ); $stat = wc_get_order_statuses();
		echo '<main class="dl-main"><h1 class="dl-h1">Sąskaitos <small>visos PVM sąskaitos, išankstinės ir kreditinės — PDF čia, WC lango nereikia · ' . (int) $n . ' dok.</small></h1>';
		echo '<form class="dl-sask-f" method="get" action="' . esc_url( admin_url( 'admin.php' ) ) . '"><input type="hidden" name="page" value="' . esc_attr( self::SLUG ) . '"><input type="hidden" name="view" value="saskaitos">'
			. '<select name="t"><option value="">Visi tipai</option>' . implode( '', array_map( function ( $k ) use ( $tip, $t ) { return '<option value="' . $k . '"' . selected( $t, $k, false ) . '>' . esc_html( $tip[ $k ] ) . '</option>'; }, array_keys( $tip ) ) ) . '</select>'
			. '<label>nuo <input type="date" name="nuo" value="' . esc_attr( $nuo ) . '"></label><label>iki <input type="date" name="iki" value="' . esc_attr( $iki ) . '"></label>'
			. '<input type="search" name="q" placeholder="Nr., užsakymas, klientas, el. paštas" value="' . esc_attr( $q ) . '">'
			. '<button class="v p" type="submit">Rodyti</button>' . ( $t || $q || $nuo || $iki ? ' <a class="pilkas maz" href="' . esc_url( admin_url( 'admin.php?page=' . self::SLUG . '&view=saskaitos' ) ) . '">išvalyti</a>' : '' ) . '</form>';
		if ( ! $rows ) { echo '<p class="dl-paaisk">Dokumentų pagal šiuos filtrus nėra.</p></main>'; return; }
		echo '<table class="dl-sask"><thead><tr><th>Data</th><th>Nr.</th><th>Tipas</th><th>Užsakymas</th><th>Klientas</th><th class="r">Suma</th><th>PDF</th></tr></thead><tbody>';
		foreach ( $rows as $r ) {
			$did = (int) $r['did']; $oid = (int) $r['oid']; $s = (float) $r['s']; $yra = $r['pdf'] && file_exists( $r['pdf'] );
			$pdf = $yra ? '<a href="' . esc_url( self::dl_url( 'dok_pdf', $did, array( 't' => $r['t'] ) ) ) . '" target="_blank">PDF</a>' : ( 'avpn' === $r['t'] && in_array( $r['st'], array( 'wc-completed', 'wc-processing' ), true ) ? '<a class="pilkas maz" href="' . esc_url( self::dl_url( 'dok_gen', $did, array( 'g' => $url( array( 'psl' => $psl ) ) ) ) ) . '" title="Failo nėra — sugeneruoti iš užsakymo duomenų">nėra — sugeneruoti</a>' : '<span class="pilkas maz">nėra</span>' );
			printf( '<tr><td>%s</td><td><b>%s</b></td><td>%s</td><td><a href="%s">#%d</a> <span class="pilkas maz">%s</span></td><td>%s <span class="pilkas maz">%s</span></td><td class="r">%s €</td><td>%s</td></tr>',
				esc_html( get_date_from_gmt( $r['d'], 'Y-m-d' ) ), esc_html( $r['nr'] ), esc_html( $tip[ $r['t'] ] ?? $r['t'] ), esc_url( self::url( array( 'atidaryti' => $oid, 'view' => null, 'q' => null, 'nuo' => null, 'iki' => null, 'psl' => null, 'eile' => 'visi' ) ) ), $oid, esc_html( $stat[ $r['st'] ] ?? $r['st'] ), esc_html( trim( $r['kl'] ) ), esc_html( $r['em'] ), esc_html( ( $s < 0 ? '−' : '' ) . self::eur( abs( $s ) ) ), $pdf );
		}
		echo '</tbody><tfoot><tr><td colspan="5">' . esc_html( $n . ' dok.' . ( $psl_n > 1 ? ' · psl. ' . $psl . ' iš ' . $psl_n : '' ) ) . '</td><td class="r"><b>' . esc_html( ( $suma < 0 ? '−' : '' ) . self::eur( abs( $suma ) ) ) . ' €</b></td><td></td></tr></tfoot></table>';
		if ( $psl_n > 1 ) { echo '<p class="dl-paaisk">' . ( $psl > 1 ? '<a href="' . esc_url( $url( array( 'psl' => $psl - 1 ) ) ) . '">← ankstesni</a> ' : '' ) . ( $psl < $psl_n ? '<a href="' . esc_url( $url( array( 'psl' => $psl + 1 ) ) ) . '">kiti →</a>' : '' ) . '</p>'; }
		echo '<p class="dl-paaisk">Suma — pagal filtrą (kreditinės minusu). Kreditinės data — išrašymo diena; PVM sąskaitos — įvykdymo (apmokėjimo) diena; išankstinės — užsakymo diena.</p></main>';
	}

