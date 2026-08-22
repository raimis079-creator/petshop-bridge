<?php
/**
 * Petshop AV Dropship v1.5 (H230) — laisvas tekstas laiške (redaguojamas prierašas, matomas peržiūroje) (v1.4: kiekiai su vnt.).
 *
 * v1.2: ZB kelias užbaigtas (§19.12 uodega). ZB kortelėje: ZB kodas iš
 * ps_sources (fallback SKU), mygtukas „Kopijuoti" (kodas TAB kiekis — įklijavimui
 * į ZB sistemą), lipduko atsisiuntimas po vieną užsakymą (Raimis prikabina ZB
 * sistemoje pats) ir „Pažymėti ZB perduotais" (laiško nėra, todėl žymė rankinė).
 *
 * KAIP DABAR DAROMA RANKOMIS (Raimio laiškas 2026-08-05, FW: užsakymas):
 *   vienas laiškas dienai iš terra@petshop.lt · lentelė Nr · vardas · prekė · kiekis
 *   priedai: lipdukai, KIEKVIENAS pavadintas „772 Simas Šimkus.pdf"
 *   plius manifestas partijai („Sender's shipment bill", A4, kurjerio parašui)
 *   Raimis: „Kiekvieną lipduką išsaugau ranka, dabar pas mus labai daug rankinio darbo."
 *
 * TECHNINIS PAGRINDAS (s501):
 *   AJAX `woocommerce_shopup_venipak_shipping_get_label_pdf` grąžina VIENO užsakymo
 *   lipduką → bendro PDF skaidyti NEREIKIA.
 *   `pack_numbers` yra MASYVAS → daugiapakuotės aptarnaujamos tuo pačiu keliu.
 *   Lipdukas 283×425 pt = 10×15 cm (Raimio etikečių spausdintuvas), laukas „1 \ 1".
 *   Manifestas: `get_manifest_pdf`.
 *
 * KODĖL NE AUTOMATINIS SIUNTIMAS: laiškas tiekėjui = užsakymas su Raimio pinigais.
 * Klaidingas kiekis ar dublikatas paaiškėtų tik atvažiavus siuntai.
 * Prie dešimčių užsakymų peržiūra kainuoja minutę, o saugo nuo realios prekės.
 * SISTEMA PARUOŠIA — RAIMIS PATVIRTINA.
 *
 * KODAI: VF ir Quattro kodai SUTAMPA su mūsų SKU. Prins ir Ambrosia atsirenka
 * pagal pavadinimą ir barkodą → jiems rodom ir EAN.
 *
 * ZB — ATSKIRA TEMA: reikia vesti į jų sistemą prisijungus, laiško nebus.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_AV_Dropship {

	const VEIKSMAS = 'ps_dropship';
	const OPT_EMAIL = 'ps_tiekeju_pastai';

	/** Tiekėjai. El. paštai suvedami nustatymuose (Raimis atsiųs). */
	public static function tiekejai() {
		return [
			'vf'          => [ 'Vetfarmas',      'sku' ],
			'quattro'     => [ 'Quattro / Kauno grūdai', 'sku' ],
			'prins'       => [ 'Prins Petfoods', 'sku_ean' ],
			'ambrosia'    => [ 'Ambrosia',       'sku_ean' ],
			'belcor_tofu' => [ 'Belacor',        'sku_ean' ],
			'zb'          => [ 'Žalioji Banga',  'sku' ],
		];
	}

	public static function init() {
		add_filter( 'bulk_actions-woocommerce_page_wc-orders', [ __CLASS__, 'veiksmas' ], 31 );
		add_filter( 'bulk_actions-edit-shop_order', [ __CLASS__, 'veiksmas' ], 31 );
		add_filter( 'handle_bulk_actions-woocommerce_page_wc-orders', [ __CLASS__, 'vykdyti' ], 10, 3 );
		add_filter( 'handle_bulk_actions-edit-shop_order', [ __CLASS__, 'vykdyti' ], 10, 3 );
		add_action( 'admin_menu', [ __CLASS__, 'meniu' ] );
		add_action( 'admin_footer', [ __CLASS__, 'skriptas' ] );
		add_action( 'admin_post_ps_dropship_send', [ __CLASS__, 'siusti' ] );
		add_action( 'admin_post_ps_dropship_nust', [ __CLASS__, 'saugoti_nustatymus' ] );
		add_action( 'admin_post_ps_dropship_lipdukas', [ __CLASS__, 'lipdukas_atsisiusti' ] );
		add_action( 'admin_post_ps_dropship_zb_done', [ __CLASS__, 'zb_pazymeti' ] );
	}

	public static function veiksmas( $v ) {
		$v[ self::VEIKSMAS ] = 'Petshop: perduoti tiekėjams';
		return $v;
	}

	public static function vykdyti( $redirect, $veiksmas, $ids ) {
		if ( self::VEIKSMAS !== $veiksmas ) { return $redirect; }
		$ids = array_map( 'intval', (array) $ids );
		if ( ! $ids ) { return $redirect; }
		set_transient( 'ps_dropship_' . get_current_user_id(), $ids, 1800 );
		return add_query_arg( [ 'page' => 'ps-dropship' ], admin_url( 'admin.php' ) );
	}

	public static function meniu() {
		add_submenu_page( null, 'Perduoti tiekėjams', 'Perduoti tiekėjams',
			'edit_shop_orders', 'ps-dropship', [ __CLASS__, 'puslapis' ] );
		add_submenu_page( 'woocommerce', 'Tiekėjų el. paštai', 'Tiekėjų el. paštai',
			'manage_woocommerce', 'ps-dropship-nustatymai', [ __CLASS__, 'nustatymai' ] );
	}

	/** Sugrupuoja pažymėtus užsakymus pagal tiekėją. */
	protected static function grupuoti( array $ids ) {
		$g = [];
		foreach ( $ids as $id ) {
			$o = wc_get_order( $id );
			if ( ! $o ) { continue; }
			if ( $o->get_meta( '_ps_dropship_sent' ) ) { continue; }   // jau perduota

			foreach ( $o->get_items() as $item ) {
				$src = $item->get_meta( '_ps_source' );
				if ( ! $src || 'av' === $src ) { continue; }             // AV renkam patys
				$pid = (int) $item->get_product_id();
				$p   = $item->get_product();

				if ( ! isset( $g[ $src ] ) ) { $g[ $src ] = []; }
				if ( ! isset( $g[ $src ][ $id ] ) ) {
					$g[ $src ][ $id ] = [
						'nr'       => $o->get_order_number(),
						'klientas' => trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ),
						'metodas'  => $o->get_shipping_method(),
						'pakuociu' => self::pakuociu( $o ),
						'eilutes'  => [],
					];
				}
				$g[ $src ][ $id ]['eilutes'][] = [
					'pav' => $item->get_name(),
					'qty' => (int) $item->get_quantity(),
					'sku' => $p ? $p->get_sku() : '',
					'ean' => $p ? ( $p->get_meta( '_ean' ) ?: $p->get_global_unique_id() ) : '',
					'zb'  => 'zb' === $src ? self::zb_kodas( $pid, $p ? $p->get_sku() : '' ) : '',
				];
			}
		}
		return $g;
	}

	/** Kiek lipdukų šiam užsakymui (pack_numbers ilgis). */
	protected static function pakuociu( $order ) {
		$d = json_decode( (string) $order->get_meta( 'venipak_shipping_order_data' ), true );
		if ( is_array( $d ) && ! empty( $d['pack_numbers'] ) ) { return count( (array) $d['pack_numbers'] ); }
		return 0;
	}

	/** ZB kodas iš ps_sources (supplier_sku); atsargai — produkto SKU. */
	protected static function zb_kodas( $product_id, $fallback_sku ) {
		global $wpdb;
		static $cols = null;
		$t = $wpdb->prefix . 'ps_sources';
		if ( null === $cols ) {
			$cols = (array) $wpdb->get_col( "SHOW COLUMNS FROM {$t}" );
		}
		if ( in_array( 'product_id', $cols, true ) && in_array( 'supplier_sku', $cols, true ) ) {
			$stulp = in_array( 'source', $cols, true ) ? 'source' : ( in_array( 'supplier', $cols, true ) ? 'supplier' : ( in_array( 'saltinis', $cols, true ) ? 'saltinis' : '' ) );
			if ( $stulp ) {
				$k = $wpdb->get_var( $wpdb->prepare(
					"SELECT supplier_sku FROM {$t} WHERE product_id=%d AND {$stulp}='zb' LIMIT 1", $product_id ) );
				if ( $k ) { return (string) $k; }
			}
		}
		return (string) $fallback_sku;
	}

	/** Lipduko failo vardas — TAS PATS formatas kaip Raimio: „772 Simas Šimkus.pdf" */
	public static function lipduko_vardas( $order ) {
		$nr  = $order->get_order_number();
		$kl  = trim( $order->get_billing_first_name() . ' ' . $order->get_billing_last_name() );
		$kl  = preg_replace( '/[\/\\\\:*?"<>|]/', '', $kl );
		return trim( $nr . ' ' . $kl ) . '.pdf';
	}

	public static function puslapis() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		$ids = get_transient( 'ps_dropship_' . get_current_user_id() );
		if ( ! $ids ) {
			echo '<div class="wrap"><h1>Perduoti tiekėjams</h1><p>Nėra pasirinktų užsakymų. '
			   . 'Grįžkite į <a href="' . esc_url( admin_url( 'admin.php?page=ps-desk' ) ) . '">darbalaukį</a>.</p></div>';
			return;
		}
		$g = self::grupuoti( (array) $ids );
		$t = self::tiekejai();
		$pastai = (array) get_option( self::OPT_EMAIL, [] );
		?>
		<div class="wrap">
			<h1>Perduoti tiekėjams</h1>
			<p><a class="button" href="<?php echo esc_url( admin_url( 'admin.php?page=ps-desk' ) ); ?>">Atgal į darbalaukį</a></p>
			<p class="description">Sistema paruošė laiškus. Peržiūrėkite ir siųskite.
			Siunčiama iš <code>terra@petshop.lt</code>. AV prekės į laiškus nepatenka.</p>

			<?php if ( ! $g ) : ?>
				<div class="notice notice-info"><p>Pažymėtuose užsakymuose dropship prekių nėra
				(arba jie jau perduoti).</p></div>
			<?php endif; ?>

			<?php foreach ( $g as $src => $uzsakymai ) :
				$vardas = $t[ $src ][0] ?? strtoupper( $src );
				$rodyti_ean = ( ( $t[ $src ][1] ?? 'sku' ) === 'sku_ean' );
				$pastas = $pastai[ $src ] ?? '';
				$vnt = 0; $lip = 0;
				foreach ( $uzsakymai as $u ) { $lip += $u['pakuociu']; foreach ( $u['eilutes'] as $e ) { $vnt += $e['qty']; } }
			?>
			<div class="ps-tiek">
				<div class="ps-tiek-h">
					<h2><?php echo esc_html( $vardas ); ?></h2>
					<span><?php echo count( $uzsakymai ); ?> užsak. · <?php echo (int) $vnt; ?> vnt.
						<?php if ( $lip ) : ?> · <?php echo (int) $lip; ?> lipdukų<?php endif; ?></span>
				</div>

				<?php if ( 'zb' === $src ) : ?>
					<div class="notice notice-warning inline"><p><b>ZB — laiškas nesiunčiamas.</b>
					Kiekvieną užsakymą suveskite į ZB sistemą („Kopijuoti" — kodas ir kiekis),
					lipduką prikabinkite iš mygtuko „Lipdukas". Pabaigoje — „Pažymėti ZB perduotais".</p></div>
				<?php elseif ( ! $pastas ) : ?>
					<div class="notice notice-error inline"><p>Nenurodytas el. paštas.
					Įrašykite <a href="<?php echo esc_url( admin_url( 'admin.php?page=ps-dropship-nustatymai' ) ); ?>">nustatymuose</a>.</p></div>
				<?php endif; ?>

				<table class="widefat striped ps-tbl">
					<thead><tr><th>Nr.</th><th>Klientas</th><th>Prekė</th><th class="ps-c">Kiek.</th></tr></thead>
					<tbody>
					<?php foreach ( $uzsakymai as $oid_r => $u ) :
						$pirma = true;
						if ( 'zb' === $src ) {
							$tsv = '';
							foreach ( $u['eilutes'] as $e ) { $tsv .= ( $e['zb'] ?: $e['sku'] ) . "\t" . $e['qty'] . "\n"; }
						}
						foreach ( $u['eilutes'] as $e ) : ?>
						<tr>
							<td><?php echo $pirma ? '<b>' . esc_html( $u['nr'] ) . '</b>' : ''; ?></td>
							<td><?php if ( $pirma ) { echo esc_html( $u['klientas'] );
								if ( 'zb' === $src ) {
									printf( ' <button type="button" class="button button-small ps-kopijuoti" data-tsv="%s">Kopijuoti</button>',
										esc_attr( $tsv ) );
									$lnk = wp_nonce_url( admin_url( 'admin-post.php?action=ps_dropship_lipdukas&id=' . $oid_r ), 'ps_dropship_lipdukas' );
									if ( $u['pakuociu'] > 0 ) {
										printf( ' <a class="button button-small" href="%s">Lipdukas</a>', esc_url( $lnk ) );
									} else {
										echo ' <span class="ps-lip">siunta neregistruota</span>';
									}
								} } ?></td>
							<td><?php echo esc_html( $e['pav'] ); ?>
								<?php if ( 'zb' === $src && $e['zb'] ) : ?><span class="ps-kodas"><b>ZB <?php echo esc_html( $e['zb'] ); ?></b></span>
								<?php elseif ( $e['sku'] ) : ?><span class="ps-kodas"><?php echo esc_html( $e['sku'] ); ?></span><?php endif; ?>
								<?php if ( $rodyti_ean && $e['ean'] ) : ?><span class="ps-kodas">EAN <?php echo esc_html( $e['ean'] ); ?></span><?php endif; ?>
							</td>
							<td class="ps-c"><?php echo (int) $e['qty']; ?> vnt.</td>
						</tr>
						<?php $pirma = false; endforeach;
						if ( $u['pakuociu'] > 1 ) : ?>
						<tr><td></td><td></td><td class="ps-lip"><?php echo (int) $u['pakuociu']; ?> lipdukai</td><td></td></tr>
						<?php endif;
					endforeach; ?>
					</tbody>
				</table>

				<?php if ( 'zb' === $src ) : ?>
				<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ps-siusti"
					onsubmit="return confirm('Pažymėti visus ZB užsakymus perduotais? Jie dings iš perdavimo sąrašo.');">
					<?php wp_nonce_field( 'ps_dropship_zb_done' ); ?>
					<input type="hidden" name="action" value="ps_dropship_zb_done">
					<input type="hidden" name="uzsakymai" value="<?php echo esc_attr( implode( ',', array_keys( $uzsakymai ) ) ); ?>">
					<button class="button button-primary">Pažymėti ZB perduotais (<?php echo count( $uzsakymai ); ?>)</button>
					<label>tik kai visi suvesti į ZB sistemą ir lipdukai prikabinti</label>
				</form>
				<?php endif; ?>

				<?php if ( 'zb' !== $src ) :
					$perziura = isset( $_GET['perziura'] ) && $_GET['perziura'] === $src; ?>
					<p style="margin:10px 0 0">
						<a class="button" href="<?php echo esc_url( add_query_arg( array( 'page' => 'ps-dropship', 'perziura' => $perziura ? null : $src ) , admin_url( 'admin.php' ) ) ); ?>">
							<?php echo $perziura ? 'Slėpti laiško peržiūrą' : 'Peržiūrėti laišką'; ?></a>
					</p>
					<?php if ( $perziura ) : ?>
						<div style="margin-top:10px;border:1px dashed #98262A;background:#fff;padding:14px 16px">
							<p style="margin:0 0 8px;font-size:11px;color:#98262A;text-transform:uppercase;letter-spacing:.06em">
								Laiško peržiūra — tema: „užsakymas <?php echo esc_html( date_i18n( 'Y-m-d' ) ); ?>" · gavėjas: <?php echo esc_html( $pastas ?: '—' ); ?></p>
							<?php echo wp_kses_post( self::laisko_html( $src, $uzsakymai ) ); ?>
							<p class="ps-gyva" data-src="<?php echo esc_attr( $src ); ?>"
								style="display:none;margin:14px 0;padding:8px 10px;background:#FBF2DE;border-left:3px solid #96660C"></p>
						</div>
					<?php endif; ?>
				<?php endif; ?>

				<?php if ( 'zb' !== $src && $pastas ) : ?>
				<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ps-siusti">
					<?php wp_nonce_field( 'ps_dropship_send' ); ?>
					<input type="hidden" name="action" value="ps_dropship_send">
					<input type="hidden" name="tiekejas" value="<?php echo esc_attr( $src ); ?>">
					<input type="hidden" name="uzsakymai" value="<?php echo esc_attr( implode( ',', array_keys( $uzsakymai ) ) ); ?>">
					<p style="margin:0 0 8px">
						<label style="display:block;font-weight:600;margin-bottom:3px">Prierašas laiške (nebūtina)</label>
						<textarea name="pastaba" rows="3" style="width:100%;max-width:620px"
							data-src="<?php echo esc_attr( $src ); ?>"
							placeholder="Pvz.: prašome pristatyti iki penktadienio; prie 35048 pridėkite dovanėlę…"></textarea>
					</p>
					<button class="button button-primary">Siųsti <?php echo esc_html( $vardas ); ?> (<?php echo esc_html( $pastas ); ?>)</button>
					<label><input type="checkbox" name="su_lipdukais" value="1" checked> pridėti lipdukus</label>
					<label><input type="checkbox" name="su_manifestu" value="1" checked> pridėti manifestą</label>
				</form>
				<?php endif; ?>
			</div>
			<?php endforeach; ?>
		</div>
		<script>
		document.addEventListener('click', function(ev){
			var b = ev.target.closest('.ps-kopijuoti');
			if (!b) { return; }
			var t = b.getAttribute('data-tsv') || '';
			function ok(){ b.textContent = 'Nukopijuota'; setTimeout(function(){ b.textContent='Kopijuoti'; }, 1500); }
			if (navigator.clipboard && window.isSecureContext) {
				navigator.clipboard.writeText(t).then(ok, function(){ senas(); });
			} else { senas(); }
			function senas(){
				var ta = document.createElement('textarea');
				ta.value = t; document.body.appendChild(ta); ta.select();
				try { document.execCommand('copy'); ok(); } catch(e) {}
				document.body.removeChild(ta);
			}
		});
		</script>
		<style>
		.ps-tiek { background:#fff; border:1px solid #dcdcdc; padding:16px 20px; margin:0 0 18px; }
		.ps-tiek-h { display:flex; justify-content:space-between; align-items:baseline;
			border-bottom:2px solid #222; padding-bottom:6px; margin-bottom:12px; }
		.ps-tiek-h h2 { margin:0; font-size:16px; }
		.ps-tiek-h span { font-size:12px; color:#555; }
		.ps-tbl td, .ps-tbl th { font-size:13px; }
		.ps-c { width:60px; text-align:center; }
		.ps-kodas { color:#888; font-size:11px; margin-left:8px; }
		.ps-lip { color:#a05a00; font-size:12px; font-style:italic; }
		.ps-siusti { margin-top:12px; }
		.ps-siusti label { margin-left:14px; font-size:12px; }
		.notice.inline { margin:8px 0; }
		</style>
		<?php
	}

	/** Vieno užsakymo lipduko atsisiuntimas (ZB keliui — prikabinimui į jų sistemą). */
	public static function lipdukas_atsisiusti() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		check_admin_referer( 'ps_dropship_lipdukas' );
		$id = isset( $_GET['id'] ) ? absint( $_GET['id'] ) : 0;
		$o  = $id ? wc_get_order( $id ) : false;
		if ( ! $o ) { wp_die( 'Užsakymas nerastas' ); }
		$kelias = self::lipdukas( $id );
		if ( ! $kelias || ! file_exists( $kelias ) ) {
			wp_die( 'Lipduko gauti nepavyko — ar siunta registruota Venipak (3 žingsnis)?' );
		}
		nocache_headers();
		header( 'Content-Type: application/pdf' );
		header( 'Content-Disposition: attachment; filename="' . rawurlencode( basename( $kelias ) ) . '"' );
		header( 'Content-Length: ' . filesize( $kelias ) );
		readfile( $kelias );
		exit;
	}

	/** ZB užsakymų žymėjimas perduotais (laiško nėra — žymė rankinė). */
	public static function zb_pazymeti() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		check_admin_referer( 'ps_dropship_zb_done' );
		$ids = isset( $_POST['uzsakymai'] ) ? array_filter( array_map( 'absint', explode( ',', sanitize_text_field( wp_unslash( $_POST['uzsakymai'] ) ) ) ) ) : [];
		$k = 0;
		foreach ( $ids as $oid ) {
			$o = wc_get_order( $oid );
			if ( ! $o || $o->get_meta( '_ps_dropship_sent' ) ) { continue; }
			$o->update_meta_data( '_ps_dropship_sent', current_time( 'mysql' ) );
			$o->add_order_note( 'Perduota ZB — suvesta į jų sistemą ranka, lipdukas prikabintas (darbalaukio žymė).', false, true );
			$o->save();
			$k++;
		}
		wp_safe_redirect( add_query_arg( [ 'page' => 'ps-dropship', 'ps_zb' => $k ], admin_url( 'admin.php' ) ) );
		exit;
	}

	/** Nustatymų puslapis — tiekėjų el. paštai. */
	public static function nustatymai() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_die( 'Nepakanka teisių' ); }
		$p = (array) get_option( self::OPT_EMAIL, [] );
		?>
		<div class="wrap">
			<h1>Tiekėjų el. paštai</h1>
			<p class="description">Adresai, kuriais siunčiami dropship užsakymai.
			Kelis adresus atskirkite kableliu. Siunčiama iš <code>terra@petshop.lt</code>.</p>
			<?php if ( isset( $_GET['ps_ok'] ) ) : ?>
				<div class="notice notice-success"><p>Išsaugota.</p></div>
			<?php endif; ?>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<?php wp_nonce_field( 'ps_dropship_nust' ); ?>
				<input type="hidden" name="action" value="ps_dropship_nust">
				<table class="form-table">
				<?php foreach ( self::tiekejai() as $k => $t ) : ?>
					<tr>
						<th scope="row"><?php echo esc_html( $t[0] ); ?></th>
						<td>
							<input type="text" name="pastai[<?php echo esc_attr( $k ); ?>]" class="regular-text"
								value="<?php echo esc_attr( $p[ $k ] ?? '' ); ?>"
								<?php echo 'zb' === $k ? 'disabled placeholder="ZB — laiškai nesiunčiami"' : ''; ?>>
							<?php if ( 'sku_ean' === $t[1] ) : ?>
								<p class="description">Laiške rodomas ir EAN (atsirenka pagal pavadinimą ir barkodą).</p>
							<?php endif; ?>
						</td>
					</tr>
				<?php endforeach; ?>
				</table>
				<?php submit_button( 'Išsaugoti' ); ?>
			</form>
		</div>
		<?php
	}

	public static function saugoti_nustatymus() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_die( 'Nepakanka teisių' ); }
		check_admin_referer( 'ps_dropship_nust' );
		$in = (array) ( $_POST['pastai'] ?? [] );
		$out = [];
		foreach ( $in as $k => $v ) {
			$k = sanitize_key( $k );
			$adresai = array_filter( array_map( 'trim', explode( ',', (string) wp_unslash( $v ) ) ) );
			$geri = [];
			foreach ( $adresai as $a ) { if ( is_email( $a ) ) { $geri[] = sanitize_email( $a ); } }
			if ( $geri ) { $out[ $k ] = implode( ',', $geri ); }
		}
		update_option( self::OPT_EMAIL, $out );
		wp_safe_redirect( admin_url( 'admin.php?page=ps-dropship-nustatymai&ps_ok=1' ) );
		exit;
	}

	/** Išsiunčia laišką vienam tiekėjui. */
	/** Gyvas prierašo atspindys peržiūroje. */
	public static function skriptas() {
		if ( ! isset( $_GET['page'] ) || 'ps-dropship' !== $_GET['page'] ) { return; }
		?>
		<script>
		document.addEventListener('input', function (ev) {
			var t = ev.target;
			if (t.tagName !== 'TEXTAREA' || !t.name || t.name !== 'pastaba') { return; }
			var p = document.querySelector('.ps-gyva[data-src="' + t.dataset.src + '"]');
			if (!p) { return; }
			p.textContent = t.value;
			p.style.display = t.value.trim() ? 'block' : 'none';
		});
		</script>
		<?php
	}

	/** Laiško tiekėjui HTML — VIENA tiesos vieta siuntimui ir peržiūrai. */
	public static function laisko_html( $src, $uzsakymai, $pastaba = '' ) {
		$t = self::tiekejai();
		$rodyti_ean = ( ( $t[ $src ][1] ?? 'sku' ) === 'sku_ean' );

		// LENTELĖ — tokia pat struktūra kaip Raimio rankiniuose laiškuose
		$h  = '<p>Laba diena,</p><p>šiandienai</p>';
		$h .= '<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:Arial;font-size:13px;">';
		foreach ( $uzsakymai as $u ) {
			$n = count( $u['eilutes'] ) + ( $u['pakuociu'] > 1 ? 1 : 0 );
			$pirma = true;
			foreach ( $u['eilutes'] as $e ) {
				$h .= '<tr>';
				if ( $pirma ) {
					$h .= '<td rowspan="' . $n . '" valign="top"><b>' . esc_html( $u['nr'] ) . '</b></td>';
					$h .= '<td rowspan="' . $n . '" valign="top">' . esc_html( $u['klientas'] ) . '</td>';
				}
				$h .= '<td>' . esc_html( $e['pav'] );
				if ( $e['sku'] ) { $h .= ' <span style="color:#666">' . esc_html( $e['sku'] ) . '</span>'; }
				if ( $rodyti_ean && $e['ean'] ) { $h .= '<br><span style="color:#666;font-size:11px">EAN ' . esc_html( $e['ean'] ) . '</span>'; }
				$h .= '</td><td align="center" style="white-space:nowrap">' . (int) $e['qty'] . ' vnt.</td></tr>';
				$pirma = false;
			}
			if ( $u['pakuociu'] > 1 ) {
				$h .= '<tr><td colspan="2"><i>' . (int) $u['pakuociu'] . ' lipdukai</i></td></tr>';
			}
		}
		$h .= '</table>';
		$pastaba = trim( (string) $pastaba );
		if ( '' !== $pastaba ) {
			$h .= '<p style="margin:14px 0">' . nl2br( esc_html( $pastaba ) ) . '</p>';
		}
		$h .= '<p>Linkėjimai,<br>UAB Avesa<br>terra@petshop.lt</p>';
		return $h;
	}

	public static function siusti() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		check_admin_referer( 'ps_dropship_send' );

		$src = sanitize_key( $_POST['tiekejas'] ?? '' );
		$ids = array_filter( array_map( 'intval', explode( ',', (string) ( $_POST['uzsakymai'] ?? '' ) ) ) );
		if ( ! $src || ! $ids ) { wp_safe_redirect( admin_url( 'admin.php?page=ps-dropship' ) ); exit; }

		$t      = self::tiekejai();
		$vardas = $t[ $src ][0] ?? strtoupper( $src );
		$pastai = (array) get_option( self::OPT_EMAIL, [] );
		$pastas = $pastai[ $src ] ?? '';
		if ( ! $pastas ) { wp_die( 'Nenurodytas tiekėjo el. paštas' ); }

		$g = self::grupuoti( $ids );
		$uzsakymai = $g[ $src ] ?? [];
		if ( ! $uzsakymai ) { wp_die( 'Nėra ką siųsti' ); }

		$pastaba = isset( $_POST['pastaba'] ) ? sanitize_textarea_field( wp_unslash( $_POST['pastaba'] ) ) : '';
		$h = self::laisko_html( $src, $uzsakymai, $pastaba );
		$data = date_i18n( 'Y-m-d' );

		// PRIEDAI
		$priedai = [];
		if ( ! empty( $_POST['su_lipdukais'] ) ) {
			foreach ( array_keys( $uzsakymai ) as $oid ) {
				$f = self::lipdukas( $oid );
				if ( $f ) { $priedai[] = $f; }
			}
		}
		if ( ! empty( $_POST['su_manifestu'] ) ) {
			$m = self::manifestas( array_keys( $uzsakymai ) );
			if ( $m ) { $priedai[] = $m; }
		}

		$antraste = [
			'Content-Type: text/html; charset=UTF-8',
			'From: UAB Avesa <terra@petshop.lt>',
			'Reply-To: terra@petshop.lt',
		];
		$ok = wp_mail( $pastas, 'užsakymas ' . $data, $h, $antraste, $priedai );

		if ( $ok ) {
			foreach ( array_keys( $uzsakymai ) as $oid ) {
				$o = wc_get_order( $oid );
				if ( ! $o ) { continue; }
				$o->update_meta_data( '_ps_dropship_sent', current_time( 'mysql' ) );
				$o->update_meta_data( '_ps_dropship_to', $src );
				$o->save();
				$o->add_order_note( 'Perduota tiekėjui ' . $vardas . ' (' . $pastas . ')' );
			}
		}
		foreach ( $priedai as $f ) { @unlink( $f ); }

		wp_safe_redirect( add_query_arg( [ 'page' => 'ps-dropship', 'ps_sent' => $ok ? 1 : 0 ], admin_url( 'admin.php' ) ) );
		exit;
	}

	/** Paima Venipak lipduką ir išsaugo laikinai teisingu vardu. */
	protected static function lipdukas( $order_id ) {
		$o = wc_get_order( $order_id );
		if ( ! $o ) { return null; }
		$d = json_decode( (string) $o->get_meta( 'venipak_shipping_order_data' ), true );
		if ( empty( $d['pack_numbers'] ) ) { return null; }

		$n = get_option( 'shopup_venipak_shipping_settings', [] );
		$u = $n['shopup_venipak_shipping_field_username'] ?? '';
		$p = $n['shopup_venipak_shipping_field_password'] ?? '';
		$f = $n['shopup_venipak_shipping_field_labelformat'] ?? 'sticker';
		if ( ! $u ) { return null; }

		$atsakymas = wp_remote_post( 'https://go.venipak.lt/ws/print_label', [
			'timeout' => 45,
			'body'    => [ 'user' => $u, 'pass' => $p, 'pack_no' => implode( ',', (array) $d['pack_numbers'] ), 'format' => $f ],
		] );
		if ( is_wp_error( $atsakymas ) ) { return null; }
		$turinys = wp_remote_retrieve_body( $atsakymas );
		if ( strlen( $turinys ) < 500 || 0 !== strpos( $turinys, '%PDF' ) ) { return null; }

		$dir = get_temp_dir() . 'ps-dropship/';
		if ( ! is_dir( $dir ) ) { wp_mkdir_p( $dir ); }
		$kelias = $dir . self::lipduko_vardas( $o );
		file_put_contents( $kelias, $turinys );
		return $kelias;
	}

	/** Manifestas partijai. */
	protected static function manifestas( array $order_ids ) {
		$packs = [];
		foreach ( $order_ids as $id ) {
			$o = wc_get_order( $id );
			if ( ! $o ) { continue; }
			$d = json_decode( (string) $o->get_meta( 'venipak_shipping_order_data' ), true );
			if ( ! empty( $d['pack_numbers'] ) ) { $packs = array_merge( $packs, (array) $d['pack_numbers'] ); }
		}
		if ( ! $packs ) { return null; }
		$n = get_option( 'shopup_venipak_shipping_settings', [] );
		$u = $n['shopup_venipak_shipping_field_username'] ?? '';
		$p = $n['shopup_venipak_shipping_field_password'] ?? '';
		if ( ! $u ) { return null; }

		$a = wp_remote_post( 'https://go.venipak.lt/ws/print_manifest', [
			'timeout' => 45,
			'body'    => [ 'user' => $u, 'pass' => $p, 'pack_no' => implode( ',', $packs ) ],
		] );
		if ( is_wp_error( $a ) ) { return null; }
		$c = wp_remote_retrieve_body( $a );
		if ( strlen( $c ) < 500 || 0 !== strpos( $c, '%PDF' ) ) { return null; }
		$dir = get_temp_dir() . 'ps-dropship/';
		if ( ! is_dir( $dir ) ) { wp_mkdir_p( $dir ); }
		$kelias = $dir . 'manifestas-' . date_i18n( 'Y-m-d' ) . '.pdf';
		file_put_contents( $kelias, $c );
		return $kelias;
	}
}
Petshop_AV_Dropship::init();
