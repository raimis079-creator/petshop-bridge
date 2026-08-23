<?php
/**
 * Petshop AV Tiekimas v1.3 (H236) — kaupimo veiksmai iškelti į PROGRAMINĮ API:
 * `ideti_eilute()` / `isimti_eilute()`. Iki šiol įdėti eilutę galėjai tik per
 * mygtuko nuorodą (admin-post + nonce + redirect). Mišrių užsakymų sprendimo
 * kortelė turi tą patį padaryti keliom eilutėm iš karto, todėl logika perkelta
 * į vieną vietą, o `eilutes_veiksmas()` dabar tik apvalkalas su teisėmis.
 *
 * v1.2 (S567) — prekių parsivežimas iš tiekėjų sandėlių.
 *
 * KODĖL (Raimio aprašytas procesas 2026-08-06):
 * Ateina mišrus užsakymas — dalis prekių AV, dalis VF. Vietoj to, kad klientas
 * gautų dvi siuntas, VF eilutė įkrenta į TIEKIMO LENTELĘ. Per dieną tokių
 * smulkmenų susikaupia; 13:00 jos vienu užsakymu parsivežamos į AV, o iš ten
 * keliauja klientui viena tvarkinga siunta.
 *
 * KELIAS:
 *   1. mišrus užsakymas apmokamas  → tiekėjo eilutės į atvirą partiją,
 *                                     užsakymas pažymimas „laukia prekių“
 *   2. lentelė kaupiasi visą dieną → kiekius gali keisti, prekes pridėti/trinti
 *   3. „Užsakyti“                  → laiškas tiekėjui, partija UŽSAKYTA
 *   4. „Prekės gautos“             → suvedi FAKTINIUS kiekius (ne užsakytus),
 *                                     jie krinta į AV likutį su žurnalo įrašu
 *   5. užsakymai, kuriems užteko   → tampa paprasti AV
 *      kuriems neužteko            → į KLAUSIMUS, trūkumas keliauja į naują partiją
 *
 * PRINCIPAS: sistema nespėja, ką gavai. Ji siūlo užsakytą kiekį, o įrašo tik tai,
 * ką patvirtinai. Galiojimas — išskleidžiamas laukelis, kad neerzintų;
 * atsidaro pats, jei tai prekei data jau kada nors buvo įvesta.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_AV_Tiekimas {

	const SLUG      = 'ps-tiekimas';
	const DB_VER    = '1.0';
	const OPT_DB    = 'ps_tiekimas_db';
	const META_LAUK = '_ps_tiekimas_laukia';
	const META_PART = '_ps_tiekimas_partijos';

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'meniu' ), 20 );
		add_action( 'admin_init', array( __CLASS__, 'lenteles' ) );
		add_action( 'admin_post_ps_tiekimas', array( __CLASS__, 'veiksmas' ) );

		add_action( 'admin_post_ps_tiekimas_eilute', array( __CLASS__, 'eilutes_veiksmas' ) );
	}

	/* ============================ LENTELĖS ============================ */

	public static function t_partijos() { global $wpdb; return $wpdb->prefix . 'ps_tiekimas'; }
	public static function t_eilutes()  { global $wpdb; return $wpdb->prefix . 'ps_tiekimas_eil'; }

	public static function lenteles() {
		if ( get_option( self::OPT_DB ) === self::DB_VER ) { return; }
		global $wpdb;
		$c = $wpdb->get_charset_collate();
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		dbDelta( "CREATE TABLE " . self::t_partijos() . " (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			tiekejas VARCHAR(32) NOT NULL,
			busena VARCHAR(16) NOT NULL DEFAULT 'kaupiama',
			sukurta DATETIME NOT NULL,
			uzsakyta DATETIME NULL,
			gauta DATETIME NULL,
			siuntos_kodas VARCHAR(64) NULL,
			pastaba TEXT NULL,
			PRIMARY KEY (id),
			KEY tiekejas_busena (tiekejas, busena)
		) $c;" );

		dbDelta( "CREATE TABLE " . self::t_eilutes() . " (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			partija_id BIGINT UNSIGNED NOT NULL,
			product_id BIGINT UNSIGNED NOT NULL,
			order_id BIGINT UNSIGNED NULL,
			qty INT NOT NULL DEFAULT 0,
			qty_gauta INT NULL,
			galiojimas VARCHAR(10) NULL,
			pastaba VARCHAR(190) NULL,
			PRIMARY KEY (id),
			KEY partija (partija_id),
			KEY preke (product_id),
			KEY uzsakymas (order_id)
		) $c;" );

		update_option( self::OPT_DB, self::DB_VER );
	}

	/* ============================ KAUPIMAS ============================ */

	/** Atvira (kaupiama) tiekėjo partija; jei nėra — sukuriama. */
	public static function atvira_partija( $tiekejas ) {
		global $wpdb;
		$id = $wpdb->get_var( $wpdb->prepare(
			'SELECT id FROM ' . self::t_partijos() . " WHERE tiekejas=%s AND busena='kaupiama' ORDER BY id DESC LIMIT 1",
			$tiekejas ) );
		if ( $id ) { return (int) $id; }
		$wpdb->insert( self::t_partijos(), array(
			'tiekejas' => $tiekejas,
			'busena'   => 'kaupiama',
			'sukurta'  => current_time( 'mysql' ),
		) );
		return (int) $wpdb->insert_id;
	}

	/**
	 * PUSIAU AUTOMATINIS KAUPIMAS (Raimio sprendimas 2026-08-06).
	 * Sistema NIEKO nesprendžia už tave: mišrus užsakymas guli „Naujuose“ kaip
	 * visi kiti, o šalia kiekvienos tiekėjo eilutės yra mygtukas
	 * „Į tiekimo lentelę“. Nepaspaudei — eilutė lieka dropshipu.
	 * Sprendimas EILUTĖS lygmens, todėl „VF siunčia pats, ZB parsivežam“
	 * gaunasi savaime, be jokių atskirų ekranų.
	 */
	public static function eilutes_veiksmas() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }

		$oid = isset( $_GET['oid'] ) ? absint( $_GET['oid'] ) : 0;
		$iid = isset( $_GET['iid'] ) ? absint( $_GET['iid'] ) : 0;
		$ka  = isset( $_GET['ka'] ) ? sanitize_key( $_GET['ka'] ) : 'ideti';
		check_admin_referer( 'ps_tiek_eil_' . $oid . '_' . $iid );

		$atgal = isset( $_GET['g'] )
			? wp_validate_redirect( wp_unslash( $_GET['g'] ), admin_url( 'admin.php?page=ps-desk' ) )
			: admin_url( 'admin.php?page=ps-desk' );

		$o = $oid ? wc_get_order( $oid ) : false;
		if ( ! $o ) { wp_die( 'Užsakymas nerastas' ); }

		global $wpdb;
		$zinute = 'klaida';

		if ( 'istrinti' === $ka ) {
			$zinute = self::isimti_eilute( $o, $iid ) ? 'eilute_isimta' : 'klaida';
		} else {
			if ( ! $o->get_item( $iid ) ) { wp_die( 'Eilutė nerasta' ); }
			$p = self::ideti_eilute( $o, $iid );
			if ( ! $p ) { wp_die( 'Ši eilutė nėra tiekėjo prekė' ); }
			$zinute = 'eilute_ideta';
		}

		wp_safe_redirect( add_query_arg( array( 'pd_ok' => $zinute ), $atgal ) );
		exit;
	}

	/**
	 * Įdeda užsakymo eilutę į kaupiamą tiekėjo partiją (parsivežam į AV).
	 *
	 * Viena tiesos vieta: naudoja ir mygtukas skydelyje, ir mišrių užsakymų
	 * sprendimo kortelė (H236). Grąžina partijos ID arba 0, jei eilutė netinka.
	 * Jei eilutė jau kaupiamoje partijoje — nieko nedaro ir grąžina tą partiją,
	 * kad pakartotinis sprendimo patvirtinimas nedubliuotų užsakymo tiekėjui.
	 */
	public static function ideti_eilute( $o, $iid, $src = '' ) {
		global $wpdb;
		$item = $o->get_item( $iid );
		if ( ! $item ) { return 0; }

		if ( ! $src ) {
			$src = $item->get_meta( '_ps_source' );
			if ( ! is_string( $src ) || '' === $src ) {
				$v = class_exists( 'Petshop_AV_Source' )
					? Petshop_AV_Source::resolve( $item->get_product_id(), $item->get_quantity() ) : array();
				$src = ( is_array( $v ) && ! empty( $v['source'] ) ) ? $v['source'] : '';
			}
		}
		if ( ! $src || 'av' === $src ) { return 0; }

		$jau = self::eilutes_bukle( $o->get_id(), (int) $iid );
		if ( $jau ) { return (int) $jau->partija_id; }

		$partija = self::atvira_partija( $src );
		$wpdb->insert( self::t_eilutes(), array(
			'partija_id' => $partija,
			'product_id' => $item->get_product_id(),
			'order_id'   => $o->get_id(),
			'qty'        => (int) $item->get_quantity(),
			'pastaba'    => 'eilutė ' . (int) $iid,
		) );

		$o->update_meta_data( self::META_LAUK, 1 );
		$o->add_order_note( sprintf( 'Tiekimas: „%s“ (%d vnt) įtraukta į %s partiją #%d — parsivežam į AV.',
			$item->get_name(), (int) $item->get_quantity(),
			self::tiekejo_vardas( $src ), $partija ), false, true );
		$o->save();

		return (int) $partija;
	}

	/**
	 * Išima eilutę iš KAUPIAMOS partijos (grįžta į dropshipą).
	 * Jau užsakytos ar gautos partijos neliečiamos — prekė tiekėjui jau užsakyta.
	 */
	public static function isimti_eilute( $o, $iid ) {
		global $wpdb;
		$n = $wpdb->query( $wpdb->prepare(
			'DELETE e FROM ' . self::t_eilutes() . ' e
			 INNER JOIN ' . self::t_partijos() . " p ON p.id=e.partija_id
			 WHERE e.order_id=%d AND e.pastaba=%s AND p.busena='kaupiama'",
			$o->get_id(), 'eilutė ' . (int) $iid ) );

		if ( $n ) {
			$o->add_order_note( 'Tiekimas: prekė išimta iš tiekimo lentelės — grįžta į dropshipą.', false, true );
		}
		self::perziuret_laukima( $o );
		return (int) $n;
	}

	/** Ar užsakymas dar ko nors laukia; jei ne — vėliavėlė nuimama. */
	protected static function perziuret_laukima( $o ) {
		global $wpdb;
		$liko = (int) $wpdb->get_var( $wpdb->prepare(
			'SELECT COUNT(*) FROM ' . self::t_eilutes() . ' e
			 INNER JOIN ' . self::t_partijos() . " p ON p.id=e.partija_id
			 WHERE e.order_id=%d AND p.busena<>'gauta'", $o->get_id() ) );
		if ( ! $liko ) { $o->delete_meta_data( self::META_LAUK ); }
		$o->save();
	}

	/**
	 * Ar ŠI užsakymo eilutė jau tiekimo lentelėje.
	 * Grąžina objektą su partija/busena/tiekeju arba null.
	 */
	public static function eilutes_bukle( $order_id, $item_id ) {
		global $wpdb;
		return $wpdb->get_row( $wpdb->prepare(
			'SELECT e.id, e.partija_id, e.qty, e.qty_gauta, p.busena, p.tiekejas
			 FROM ' . self::t_eilutes() . ' e
			 INNER JOIN ' . self::t_partijos() . ' p ON p.id=e.partija_id
			 WHERE e.order_id=%d AND e.pastaba=%s ORDER BY e.id DESC LIMIT 1',
			$order_id, 'eilutė ' . $item_id ) );
	}

	/** Nuoroda mygtukui darbalaukio skydelyje. */
	public static function eilutes_url( $order_id, $item_id, $ka = 'ideti', $grazinti = '' ) {
		return wp_nonce_url(
			admin_url( 'admin-post.php?action=ps_tiekimas_eilute&oid=' . (int) $order_id
				. '&iid=' . (int) $item_id . '&ka=' . rawurlencode( $ka )
				. ( $grazinti ? '&g=' . rawurlencode( $grazinti ) : '' ) ),
			'ps_tiek_eil_' . (int) $order_id . '_' . (int) $item_id );
	}

	/* ============================ MENIU ============================ */

	public static function meniu() {
		add_submenu_page( 'ps-desk', 'Tiekimas', 'Tiekimas', 'edit_shop_orders',
			self::SLUG, array( __CLASS__, 'puslapis' ) );
	}

	protected static function tiekejo_vardas( $k ) {
		$v = array(
			'vf' => 'Vetfarmas', 'zb' => 'Žalioji Banga', 'quattro' => 'Quattro / Kauno grūdai',
			'prins' => 'Prins / Faunas', 'ambrosia' => 'Ambrosia', 'belcor_tofu' => 'Belacor',
		);
		return $v[ $k ] ?? mb_strtoupper( $k );
	}

	protected static function partijos( $busena ) {
		global $wpdb;
		return $wpdb->get_results( $wpdb->prepare(
			'SELECT * FROM ' . self::t_partijos() . ' WHERE busena=%s ORDER BY tiekejas ASC', $busena ) );
	}

	public static function partijos_eilutes( $partija_id ) {
		global $wpdb;
		return $wpdb->get_results( $wpdb->prepare(
			'SELECT * FROM ' . self::t_eilutes() . ' WHERE partija_id=%d ORDER BY id ASC', $partija_id ) );
	}

	/* ============================ PUSLAPIS ============================ */

	public static function puslapis() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		$rodyti = isset( $_GET['b'] ) ? sanitize_key( $_GET['b'] ) : 'kaupiama';
		self::stilius();
		echo '<div class="wrap ps-tk"><h1>Tiekimas</h1>';
		self::pranesimas();

		printf( '<p><a class="button" href="%s">← Petshop užsakymai</a></p>',
			esc_url( admin_url( 'admin.php?page=ps-desk' ) ) );

		echo '<h2 class="nav-tab-wrapper">';
		$sk = self::laukianciu_skaiciai();
		$tabai = array(
			'kaupiama' => 'Kaupiama',
			'uzsakyta' => 'Užsakyta · laukiam',
			'laukia'   => 'Laukia prekių' . ( $sk['viso'] ? ' (' . $sk['viso'] . ')' : '' ),
			'gauta'    => 'Gautos partijos',
		);
		foreach ( $tabai as $k => $t ) {
			printf( '<a class="nav-tab%s" href="%s">%s</a>',
				$k === $rodyti ? ' nav-tab-active' : '',
				esc_url( admin_url( 'admin.php?page=' . self::SLUG . '&b=' . $k ) ), esc_html( $t ) );
		}
		echo '</h2>';

		if ( 'laukia' === $rodyti ) { self::skiltis_laukia(); echo '</div>'; return; }

		$p = self::partijos( $rodyti );
		if ( ! $p ) {
			$t = array(
				'kaupiama' => 'Nieko nesikaupia. Mišrūs užsakymai čia atsiras patys.',
				'uzsakyta' => 'Nėra išsiųstų užsakymų tiekėjams.',
				'gauta'    => 'Dar nepriimta nė viena partija.',
			);
			echo '<div class="ps-tk-tuscia">' . esc_html( $t[ $rodyti ] ) . '</div></div>';
			return;
		}

		foreach ( $p as $part ) {
			if ( 'gauta' === $rodyti ) { self::kortele_gauta( $part ); }
			elseif ( 'uzsakyta' === $rodyti ) { self::kortele_priemimas( $part ); }
			else { self::kortele_kaupiama( $part ); }
		}
		echo '</div>';
	}

	/* ---------- 1. KAUPIAMA ---------- */

	protected static function kortele_kaupiama( $part ) {
		$eil = self::partijos_eilutes( $part->id );
		$riba = class_exists( 'Petshop_Desk' ) ? Petshop_Desk::RIBOS[ $part->tiekejas ] ?? '' : '';
		?>
		<div class="ps-tk-k">
			<div class="ps-tk-h">
				<b><?php echo esc_html( self::tiekejo_vardas( $part->tiekejas ) ); ?></b>
				<span class="ps-tk-sub">partija #<?php echo (int) $part->id; ?> · atidaryta
					<?php echo esc_html( mysql2date( 'm-d H:i', $part->sukurta ) ); ?></span>
				<?php if ( $riba ) : ?><span class="ps-tk-riba">užsakyti iki <?php echo esc_html( $riba ); ?></span><?php endif; ?>
			</div>

			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="ps_tiekimas">
				<input type="hidden" name="partija" value="<?php echo (int) $part->id; ?>">
				<?php wp_nonce_field( 'ps_tiekimas_' . $part->id ); ?>

				<table class="widefat striped ps-tk-t">
					<thead><tr><th>Prekė</th><th>SKU</th><th class="r">Kiekis</th><th>Kam</th><th></th></tr></thead>
					<tbody>
					<?php if ( ! $eil ) : ?>
						<tr><td colspan="5" class="ps-tk-tuscia2">Tuščia — pridėk prekę žemiau.</td></tr>
					<?php endif; ?>
					<?php foreach ( $eil as $e ) :
						$pr = wc_get_product( $e->product_id ); ?>
						<tr>
							<td><b><?php echo esc_html( $pr ? $pr->get_name() : '#' . $e->product_id ); ?></b></td>
							<td class="mono"><?php echo esc_html( $pr ? $pr->get_sku() : '' ); ?></td>
							<td class="r"><input type="number" min="0" name="qty[<?php echo (int) $e->id; ?>]"
								value="<?php echo (int) $e->qty; ?>" class="ps-tk-q"></td>
							<td><?php
								if ( $e->order_id ) {
									$oo = wc_get_order( $e->order_id );
									printf( '<a href="%s">#%s</a>', esc_url( $oo ? $oo->get_edit_order_url() : '#' ),
										esc_html( $oo ? $oo->get_order_number() : $e->order_id ) );
								} else { echo '<span class="ps-tk-atsargai">į atsargas</span>'; }
							?></td>
							<td><label class="ps-tk-del"><input type="checkbox" name="trinti[]" value="<?php echo (int) $e->id; ?>"> trinti</label></td>
						</tr>
					<?php endforeach; ?>
					</tbody>
				</table>

				<div class="ps-tk-pridek">
					<label>Pridėti prekę:</label>
					<input type="text" name="nauja_sku" placeholder="SKU arba prekės ID" class="ps-tk-sku">
					<input type="number" name="nauja_qty" placeholder="kiekis" min="1" value="1" class="ps-tk-q">
					<button class="button" name="ka" value="pridėti">Pridėti</button>
				</div>

				<div class="ps-tk-f">
					<button class="button" name="ka" value="issaugoti">Išsaugoti kiekius</button>
					<?php if ( $eil ) : ?>
						<button class="button button-primary" name="ka" value="uzsakyti"
							onclick="return confirm('Išsiųsti užsakymą tiekėjui <?php echo esc_js( self::tiekejo_vardas( $part->tiekejas ) ); ?>?\n\nLaiškas keliaus el. paštu, partija bus uždaryta ir atsidarys nauja.');">
							Užsakyti iš tiekėjo →</button>
					<?php endif; ?>
				</div>
			</form>
		</div>
		<?php
	}

	/** Laukiantys užsakymai + „Atnaujinti likučius“. */
	protected static function skiltis_laukia() {
		list( $eil, $gali, $laukia ) = self::likuciu_perziura( false );
		if ( ! $eil ) {
			echo '<div class="ps-tk-tuscia">Nė vienas užsakymas nelaukia prekių.</div>';
			return;
		}
		?>
		<div class="ps-tk-k">
			<div class="ps-tk-h">
				<b>Laukia prekių</b>
				<span class="ps-tk-sub"><?php echo (int) count( $eil ); ?> užsakymai · <?php echo (int) $gali; ?> jau gali judėti</span>
			</div>
			<p class="ps-tk-pad">Kai tiekėjas atveža pats ir suvedi sąskaitą, prekės jau yra AV likutyje.
				Šis mygtukas jas paskiria laukiantiems užsakymams. <b>Kas laukia ilgiau — gauna pirmas.</b></p>

			<table class="widefat striped ps-tk-t">
				<thead><tr><th>Užsakymas</th><th>Klientas</th><th>Prekės</th><th>Būklė</th></tr></thead>
				<tbody>
				<?php foreach ( $eil as $u ) : ?>
					<tr>
						<td><b>#<?php echo esc_html( $u['nr'] ); ?></b><div class="ps-tk-sku2"><?php echo esc_html( $u['data'] ); ?></div></td>
						<td><?php echo esc_html( $u['kl'] ); ?></td>
						<td>
							<?php foreach ( $u['prekes'] as $p ) : ?>
								<div class="ps-tk-pr<?php echo $p['ok'] ? '' : ' ps-tk-truksta'; ?>">
									<?php echo esc_html( $p['preke'] ); ?>
									<span class="mono">reikia <?php echo (int) $p['reikia']; ?> · yra <?php echo (int) max( 0, $p['yra'] ); ?></span>
								</div>
							<?php endforeach; ?>
						</td>
						<td><?php
							echo $u['uztenka']
								? '<span class="ps-tk-ok">→ atlaisvinti</span>'
								: '<span class="ps-tk-lauk">trūksta — lieka laukti</span>';
						?></td>
					</tr>
				<?php endforeach; ?>
				</tbody>
			</table>

			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ps-tk-f">
				<input type="hidden" name="action" value="ps_tiekimas">
				<input type="hidden" name="partija" value="0">
				<?php wp_nonce_field( 'ps_tiekimas_0' ); ?>
				<button class="button button-primary" name="ka" value="likuciai" <?php disabled( 0, $gali ); ?>
					onclick="return confirm('Atlaisvinti <?php echo (int) $gali; ?> užsakymus?\n\nPrekės bus nurašytos iš AV likučio ir priskirtos šiems užsakymams.');">
					Vykdyti — atlaisvinti <?php echo (int) $gali; ?></button>
				<?php if ( ! $gali ) : ?>
					<span class="ps-tk-pad" style="margin:0">Nė vienam užsakymui prekių dar neužtenka.</span>
				<?php endif; ?>
			</form>
		</div>
		<?php
	}

	/* ---------- 2. PRIĖMIMAS ---------- */

	protected static function kortele_priemimas( $part ) {
		$eil = self::partijos_eilutes( $part->id );
		?>
		<div class="ps-tk-k">
			<div class="ps-tk-h">
				<b><?php echo esc_html( self::tiekejo_vardas( $part->tiekejas ) ); ?></b>
				<span class="ps-tk-sub">partija #<?php echo (int) $part->id; ?> · užsakyta
					<?php echo esc_html( mysql2date( 'm-d H:i', $part->uzsakyta ) ); ?></span>
			</div>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="ps_tiekimas">
				<input type="hidden" name="partija" value="<?php echo (int) $part->id; ?>">
				<?php wp_nonce_field( 'ps_tiekimas_' . $part->id ); ?>

				<p class="ps-tk-pad">Suvesk <b>faktinius</b> kiekius. Numatyta tai, kas užsakyta — kur sutampa, nieko keisti nereikia.</p>

				<table class="widefat striped ps-tk-t">
					<thead><tr><th>Prekė</th><th class="r">Užsakyta</th><th class="r">Gauta</th><th>Galiojimas</th><th>Kam</th></tr></thead>
					<tbody>
					<?php foreach ( $eil as $e ) :
						$pr  = wc_get_product( $e->product_id );
						$sen = class_exists( 'Petshop_AV_Expiry' ) ? Petshop_AV_Expiry::data( $e->product_id ) : '';
						?>
						<tr>
							<td><b><?php echo esc_html( $pr ? $pr->get_name() : '#' . $e->product_id ); ?></b>
								<div class="ps-tk-sku2"><?php echo esc_html( $pr ? $pr->get_sku() : '' ); ?></div></td>
							<td class="r mono"><?php echo (int) $e->qty; ?></td>
							<td class="r"><input type="number" min="0" name="gauta[<?php echo (int) $e->id; ?>]"
								value="<?php echo (int) $e->qty; ?>" class="ps-tk-q"></td>
							<td>
								<?php if ( $sen ) : ?>
									<input type="text" name="galioja[<?php echo (int) $e->id; ?>]" value=""
										placeholder="<?php echo esc_attr( $sen ); ?>" class="ps-tk-data">
									<div class="ps-tk-sena">sandėlyje: <?php echo esc_html( $sen ); ?></div>
								<?php else : ?>
									<a href="#" class="ps-tk-atid">+ galiojimas</a>
									<input type="text" name="galioja[<?php echo (int) $e->id; ?>]" value=""
										placeholder="YYYY-MM" class="ps-tk-data ps-slept">
								<?php endif; ?>
							</td>
							<td><?php
								if ( $e->order_id ) {
									$oo = wc_get_order( $e->order_id );
									printf( '<a href="%s">#%s</a>', esc_url( $oo ? $oo->get_edit_order_url() : '#' ),
										esc_html( $oo ? $oo->get_order_number() : $e->order_id ) );
								} else { echo '<span class="ps-tk-atsargai">į atsargas</span>'; }
							?></td>
						</tr>
					<?php endforeach; ?>
					</tbody>
				</table>

				<div class="ps-tk-f">
					<button class="button button-primary" name="ka" value="priimti"
						onclick="return confirm('Priimti partiją?\n\nĮvesti kiekiai bus pridėti prie AV likučių, o užsakymai, kuriems prekių užteko, keliaus į rytinę eigą.');">
						Prekės gautos — priimti →</button>
				</div>
			</form>
		</div>
		<?php
	}

	/* ---------- 3. GAUTOS ---------- */

	protected static function kortele_gauta( $part ) {
		$eil = self::partijos_eilutes( $part->id );
		echo '<div class="ps-tk-k ps-tk-gauta"><div class="ps-tk-h"><b>' .
			esc_html( self::tiekejo_vardas( $part->tiekejas ) ) . '</b><span class="ps-tk-sub">partija #' .
			(int) $part->id . ' · gauta ' . esc_html( mysql2date( 'Y-m-d H:i', $part->gauta ) ) . '</span></div>';
		echo '<table class="widefat striped ps-tk-t"><thead><tr><th>Prekė</th><th class="r">Užsakyta</th><th class="r">Gauta</th><th>Galiojimas</th></tr></thead><tbody>';
		foreach ( $eil as $e ) {
			$pr = wc_get_product( $e->product_id );
			printf( '<tr><td>%s</td><td class="r mono">%d</td><td class="r mono%s">%d</td><td>%s</td></tr>',
				esc_html( $pr ? $pr->get_name() : '#' . $e->product_id ),
				(int) $e->qty,
				( (int) $e->qty_gauta < (int) $e->qty ) ? ' ps-tk-mazai' : '',
				(int) $e->qty_gauta,
				esc_html( $e->galiojimas ? $e->galiojimas : '—' ) );
		}
		echo '</tbody></table></div>';
	}

	/* ============================ VEIKSMAI ============================ */

	public static function veiksmas() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		$pid = isset( $_POST['partija'] ) ? absint( $_POST['partija'] ) : 0;
		check_admin_referer( 'ps_tiekimas_' . $pid );
		$ka = isset( $_POST['ka'] ) ? sanitize_text_field( wp_unslash( $_POST['ka'] ) ) : '';

		global $wpdb;
		$zinute = '';

		if ( 'issaugoti' === $ka || 'pridėti' === $ka || 'uzsakyti' === $ka ) {
			if ( ! empty( $_POST['qty'] ) && is_array( $_POST['qty'] ) ) {
				foreach ( $_POST['qty'] as $eid => $q ) {
					$wpdb->update( self::t_eilutes(), array( 'qty' => max( 0, (int) $q ) ), array( 'id' => (int) $eid ) );
				}
			}
			if ( ! empty( $_POST['trinti'] ) && is_array( $_POST['trinti'] ) ) {
				foreach ( $_POST['trinti'] as $eid ) {
					$wpdb->delete( self::t_eilutes(), array( 'id' => (int) $eid ) );
				}
			}
			$zinute = 'issaugota';
		}

		if ( 'pridėti' === $ka ) {
			$sku = isset( $_POST['nauja_sku'] ) ? sanitize_text_field( wp_unslash( $_POST['nauja_sku'] ) ) : '';
			$q   = isset( $_POST['nauja_qty'] ) ? max( 1, absint( $_POST['nauja_qty'] ) ) : 1;
			$prod = is_numeric( $sku ) ? wc_get_product( (int) $sku ) : false;
			if ( ! $prod && $sku ) {
				$id = wc_get_product_id_by_sku( $sku );
				if ( $id ) { $prod = wc_get_product( $id ); }
			}
			if ( $prod ) {
				$wpdb->insert( self::t_eilutes(), array(
					'partija_id' => $pid, 'product_id' => $prod->get_id(), 'order_id' => null, 'qty' => $q ) );
				$zinute = 'prideta';
			} else {
				$zinute = 'nerasta';
			}
		}

		if ( 'likuciai' === $ka ) {
			list( , $gali ) = self::likuciu_perziura( true );
			wp_safe_redirect( add_query_arg( array( 'page' => self::SLUG, 'b' => 'laukia', 'tk' => 'likuciai', 'n' => $gali ), admin_url( 'admin.php' ) ) );
			exit;
		}
		if ( 'uzsakyti' === $ka ) { $zinute = self::uzsakyti( $pid ); }
		if ( 'priimti' === $ka )  { $zinute = self::priimti( $pid ); }

		wp_safe_redirect( add_query_arg( array(
			'page' => self::SLUG,
			'b'    => ( 'uzsakyti' === $ka ) ? 'uzsakyta' : ( ( 'priimti' === $ka ) ? 'gauta' : 'kaupiama' ),
			'tk'   => $zinute,
		), admin_url( 'admin.php' ) ) );
		exit;
	}

	/** Laiškas tiekėjui + partija uždaroma. */
	protected static function uzsakyti( $pid ) {
		global $wpdb;
		$part = $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . self::t_partijos() . ' WHERE id=%d', $pid ) );
		if ( ! $part || 'kaupiama' !== $part->busena ) { return 'klaida'; }
		$eil = self::partijos_eilutes( $pid );
		if ( ! $eil ) { return 'tuscia'; }

		$pastai = (array) get_option( 'ps_tiekeju_pastai', array() );
		$adr    = isset( $pastai[ $part->tiekejas ] ) ? $pastai[ $part->tiekejas ] : '';

		$eil_html = '';
		foreach ( $eil as $e ) {
			$pr = wc_get_product( $e->product_id );
			$eil_html .= sprintf(
				'<tr><td style="padding:6px 10px;border-bottom:1px solid #eee">%s</td>
				 <td style="padding:6px 10px;border-bottom:1px solid #eee;font-family:monospace">%s</td>
				 <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right"><b>%d</b></td></tr>',
				esc_html( $pr ? $pr->get_name() : '#' . $e->product_id ),
				esc_html( $pr ? $pr->get_sku() : '' ),
				(int) $e->qty );
		}

		$tema = sprintf( 'UAB Avesa · prekių užsakymas %s', wp_date( 'Y-m-d' ) );
		$body = '<p>Laba diena,</p><p>prašome paruošti šias prekes. Prekes atsiimsime kurjeriu į savo sandėlį
			(UAB Avesa, Liucionių g. 46, Liucionys, LT-15166).</p>
			<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
			<thead><tr><th style="text-align:left;padding:6px 10px;border-bottom:2px solid #333">Prekė</th>
			<th style="text-align:left;padding:6px 10px;border-bottom:2px solid #333">SKU</th>
			<th style="text-align:right;padding:6px 10px;border-bottom:2px solid #333">Kiekis</th></tr></thead>
			<tbody>' . $eil_html . '</tbody></table>
			<p>Ačiū,<br>UAB Avesa · petshop.lt<br>terra@petshop.lt</p>';

		$ok = false;
		if ( $adr ) {
			$ok = wp_mail( array_map( 'trim', explode( ',', $adr ) ), $tema, $body, array(
				'Content-Type: text/html; charset=UTF-8',
				'From: UAB Avesa <terra@petshop.lt>',
			) );
		}

		$wpdb->update( self::t_partijos(),
			array( 'busena' => 'uzsakyta', 'uzsakyta' => current_time( 'mysql' ) ),
			array( 'id' => $pid ) );

		foreach ( $eil as $e ) {
			if ( ! $e->order_id ) { continue; }
			$oo = wc_get_order( $e->order_id );
			if ( $oo ) {
				$oo->add_order_note( sprintf( 'Tiekimas: prekės užsakytos iš %s (partija #%d). Laukiam atvežimo į AV.',
					self::tiekejo_vardas( $part->tiekejas ), $pid ), false, true );
			}
		}

		return $ok ? 'uzsakyta' : ( $adr ? 'laiskas_nepavyko' : 'nera_pasto' );
	}

	/**
	 * Priėmimas: faktiniai kiekiai → AV likutis, užsakymų sprendimas.
	 * Trūkumas automatiškai keliauja į naują tos pačios tiekėjo partiją.
	 */
	protected static function priimti( $pid ) {
		global $wpdb;
		$part = $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . self::t_partijos() . ' WHERE id=%d', $pid ) );
		if ( ! $part || 'uzsakyta' !== $part->busena ) { return 'klaida'; }

		$gauta   = isset( $_POST['gauta'] ) && is_array( $_POST['gauta'] ) ? $_POST['gauta'] : array();
		$galioja = isset( $_POST['galioja'] ) && is_array( $_POST['galioja'] ) ? $_POST['galioja'] : array();

		$eil      = self::partijos_eilutes( $pid );
		$trukumas = array();
		$paliesti = array();

		foreach ( $eil as $e ) {
			$g = isset( $gauta[ $e->id ] ) ? max( 0, (int) $gauta[ $e->id ] ) : 0;
			$d = isset( $galioja[ $e->id ] ) ? sanitize_text_field( wp_unslash( $galioja[ $e->id ] ) ) : '';

			$wpdb->update( self::t_eilutes(),
				array( 'qty_gauta' => $g, 'galiojimas' => $d ? $d : null ),
				array( 'id' => $e->id ) );

			if ( $g > 0 && class_exists( 'Petshop_AV_Stock' ) ) {
				Petshop_AV_Stock::increase( $e->product_id, $g,
					sprintf( 'Tiekimas: %s partija #%d', mb_strtoupper( $part->tiekejas ), $pid ) );
			}
			if ( $d && class_exists( 'Petshop_AV_Expiry' ) ) {
				update_post_meta( $e->product_id, Petshop_AV_Expiry::META, $d );
			}
			if ( $g < (int) $e->qty ) {
				$trukumas[] = array( 'pid' => $e->product_id, 'qty' => (int) $e->qty - $g,
					'oid' => $e->order_id, 'pastaba' => $e->pastaba );
			}
			if ( $e->order_id ) { $paliesti[ $e->order_id ] = true; }
		}

		$wpdb->update( self::t_partijos(),
			array( 'busena' => 'gauta', 'gauta' => current_time( 'mysql' ) ),
			array( 'id' => $pid ) );

		// Trūkumas — į naują tos pačios tiekėjo partiją.
		if ( $trukumas ) {
			$nauja = self::atvira_partija( $part->tiekejas );
			foreach ( $trukumas as $t ) {
				$wpdb->insert( self::t_eilutes(), array(
					'partija_id' => $nauja, 'product_id' => $t['pid'],
					'order_id' => $t['oid'], 'qty' => $t['qty'],
					'pastaba' => $t['pastaba'] ) );
			}
		}

		// Užsakymai: kuriems prekių užteko — laisvi; kuriems ne — lieka laukti.
		foreach ( array_keys( $paliesti ) as $oid ) {
			$oo = wc_get_order( $oid );
			if ( ! $oo ) { continue; }
			$liko = (int) $wpdb->get_var( $wpdb->prepare(
				'SELECT COUNT(*) FROM ' . self::t_eilutes() . ' e
				 INNER JOIN ' . self::t_partijos() . " p ON p.id=e.partija_id
				 WHERE e.order_id=%d AND p.busena<>'gauta'", $oid ) );
			if ( $liko ) {
				$oo->add_order_note( sprintf( 'Tiekimas: partija #%d priimta, bet dalies prekių dar trūksta — užsakymas laukia toliau.', $pid ), false, true );
				$oo->save();
				continue;
			}
			$oo->delete_meta_data( self::META_LAUK );
			$oo->add_order_note( sprintf( 'Tiekimas: visos prekės gautos (partija #%d). Užsakymas paruoštas surinkimui iš AV.', $pid ), false, true );
			$oo->save();
		}

		return 'priimta';
	}

	/* ==================== LIKUČIŲ ATNAUJINIMAS ====================
	 * Antras kelias (Raimio sprendimas 2026-08-06): tiekėjas atveža pats,
	 * Raimis suveda sąskaitą — likučiai AV sandėlyje jau yra. Belieka
	 * susieti juos su laukiančiais užsakymais.
	 *
	 * TAISYKLĖ: kas laukia ILGIAU, tas gauna pirmas. Kitaip vienas gautų
	 * dalį, kitas dalį, ir nė vienas neišvažiuotų.
	 * ============================================================== */

	/**
	 * Ką duotų atnaujinimas. $vykdyti=false — tik peržiūra.
	 * Grąžina [eilutės[], atlaisvinta, laukia].
	 */
	public static function likuciu_perziura( $vykdyti = false ) {
		global $wpdb;

		$uzsakymai = wc_get_orders( array(
			'limit'      => 100,
			'type'       => 'shop_order',
			'status'     => array( 'processing', 'on-hold' ),
			'orderby'    => 'date',
			'order'      => 'ASC',                       // seniausi pirma
			'meta_key'   => self::META_LAUK,
			'meta_value' => 1,
		) );

		$rezervuota  = array();                          // pid => kiek jau paskirta
		$eil         = array();
		$atlaisvinti = array();

		foreach ( (array) $uzsakymai as $o ) {
			if ( ! is_a( $o, 'WC_Order' ) ) { continue; }
			$oid    = $o->get_id();
			$uztenka = true;
			$mano    = array();

			$laukia = $wpdb->get_results( $wpdb->prepare(
				'SELECT e.* FROM ' . self::t_eilutes() . ' e
				 INNER JOIN ' . self::t_partijos() . " p ON p.id=e.partija_id
				 WHERE e.order_id=%d AND p.busena<>'gauta'", $oid ) );

			// jei tiekimo lentelėje eilučių nėra, žiūrim pačias užsakymo eilutes
			if ( ! $laukia ) {
				foreach ( $o->get_items() as $iid => $it ) {
					$src = $it->get_meta( '_ps_source' );
					if ( 'av' === $src ) { continue; }
					$laukia[] = (object) array(
						'id' => 0, 'product_id' => $it->get_product_id(),
						'qty' => (int) $it->get_quantity(), 'partija_id' => 0,
					);
				}
			}

			foreach ( $laukia as $l ) {
				$pid  = (int) $l->product_id;
				$turi = class_exists( 'Petshop_AV_Stock' ) ? (int) Petshop_AV_Stock::qty( $pid ) : 0;
				$jau  = isset( $rezervuota[ $pid ] ) ? $rezervuota[ $pid ] : 0;
				$lieka = $turi - $jau;
				$reikia = (int) $l->qty;

				$ok = ( $lieka >= $reikia );
				if ( $ok ) { $rezervuota[ $pid ] = $jau + $reikia; } else { $uztenka = false; }

				$pr = wc_get_product( $pid );
				$mano[] = array(
					'preke'  => $pr ? $pr->get_name() : '#' . $pid,
					'pid'    => $pid,
					'reikia' => $reikia,
					'yra'    => $lieka,
					'ok'     => $ok,
					'eid'    => (int) $l->id,
				);
			}

			$eil[] = array(
				'oid'     => $oid,
				'nr'      => $o->get_order_number(),
				'kl'      => trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ),
				'data'    => $o->get_date_created() ? wp_date( 'm-d H:i', $o->get_date_created()->getTimestamp() ) : '',
				'prekes'  => $mano,
				'uztenka' => $uztenka,
			);
			if ( $uztenka && $mano ) { $atlaisvinti[] = $oid; }
		}

		if ( ! $vykdyti ) {
			return array( $eil, count( $atlaisvinti ), count( $eil ) - count( $atlaisvinti ) );
		}

		// VYKDOM: nurašom iš likučio ir atlaisvinam
		foreach ( $eil as $u ) {
			if ( ! $u['uztenka'] || ! $u['prekes'] ) { continue; }
			$o = wc_get_order( $u['oid'] );
			if ( ! $o ) { continue; }

			foreach ( $u['prekes'] as $p ) {
				if ( class_exists( 'Petshop_AV_Stock' ) ) {
					Petshop_AV_Stock::decrease( $p['pid'], $p['reikia'],
						sprintf( 'Tiekimas: paskirta užsakymui #%s', $u['nr'] ) );
				}
				if ( $p['eid'] ) {
					$wpdb->update( self::t_eilutes(),
						array( 'qty_gauta' => $p['reikia'] ), array( 'id' => $p['eid'] ) );
				}
			}

			// eilutes pažymim gautomis — partijos uždaromos atskirai
			$wpdb->query( $wpdb->prepare(
				'UPDATE ' . self::t_eilutes() . ' SET qty_gauta = qty WHERE order_id=%d AND qty_gauta IS NULL', $u['oid'] ) );

			$o->delete_meta_data( self::META_LAUK );
			$o->add_order_note( 'Tiekimas: prekės rastos AV likutyje ir paskirtos šiam užsakymui. Paruošta surinkimui.', false, true );
			$o->save();
		}

		return array( $eil, count( $atlaisvinti ), count( $eil ) - count( $atlaisvinti ) );
	}

	/** Kiek užsakymų laukia ir kiek jau galėtų judėti — darbalaukio skaitikliui. */
	public static function laukianciu_skaiciai() {
		list( $eil, $gali, $laukia ) = self::likuciu_perziura( false );
		return array( 'viso' => count( $eil ), 'gali' => $gali, 'laukia' => $laukia );
	}

	/* ============================ SMULKMENOS ============================ */

	protected static function pranesimas() {
		if ( empty( $_GET['tk'] ) ) { return; }
		$k = sanitize_key( wp_unslash( $_GET['tk'] ) );
		$t = array(
			'issaugota'        => array( 'success', 'Kiekiai išsaugoti.' ),
			'prideta'          => array( 'success', 'Prekė pridėta į partiją.' ),
			'nerasta'          => array( 'warning', 'Tokios prekės nerasta — patikrink SKU arba ID.' ),
			'uzsakyta'         => array( 'success', 'Užsakymas išsiųstas tiekėjui. Partija uždaryta, atsidarė nauja.' ),
			'laiskas_nepavyko' => array( 'error', 'Partija uždaryta, BET laiško išsiųsti nepavyko — užsakyk rankomis.' ),
			'nera_pasto'       => array( 'warning', 'Partija uždaryta, bet tiekėjo el. pašto nėra — užsakyk rankomis.' ),
			'priimta'          => array( 'success', 'Partija priimta. Kiekiai pridėti prie AV likučių.' ),
			'tuscia'           => array( 'warning', 'Partija tuščia — nėra ko užsakyti.' ),
			'eilute_ideta'     => array( 'success', 'Prekė įtraukta į tiekimo lentelę.' ),
			'eilute_isimta'    => array( 'success', 'Prekė išimta iš tiekimo lentelės.' ),
			'likuciai'         => array( 'success', 'Likučiai peržiūrėti. Užsakymai, kuriems prekių užteko, atlaisvinti ir keliauja į rytinę eigą.' ),
			'klaida'           => array( 'error', 'Veiksmas neįvykdytas — partijos būsena netinkama.' ),
		);
		if ( ! isset( $t[ $k ] ) ) { return; }
		printf( '<div class="notice notice-%s is-dismissible"><p>%s</p></div>',
			esc_attr( $t[ $k ][0] ), esc_html( $t[ $k ][1] ) );
	}

	protected static function stilius() {
		?>
<style>
.ps-tk h1{margin-bottom:6px}
.ps-tk-k{background:#fff;border:1px solid #dcdcd6;border-radius:8px;margin:16px 0;overflow:hidden}
.ps-tk-h{display:flex;align-items:center;gap:12px;padding:11px 14px;background:#f5f5f1;border-bottom:1px solid #dcdcd6}
.ps-tk-h b{font-size:15px}
.ps-tk-sub{color:#787c78;font-size:12.5px}
.ps-tk-riba{margin-left:auto;background:#FBF2DE;color:#96660C;padding:3px 10px;border-radius:99px;font-size:12.5px;font-weight:600}
.ps-tk-t{border:0;border-radius:0}
.ps-tk-t th,.ps-tk-t td{padding:8px 12px}
.ps-tk-t .r{text-align:right}
.ps-tk-t .mono,.ps-tk .mono{font-family:Menlo,Consolas,monospace;font-size:12.5px}
.ps-tk-q{width:74px;text-align:right}
.ps-tk-data{width:110px}
.ps-slept{display:none}
.ps-tk-sena{font-size:11.5px;color:#96660C;margin-top:3px}
.ps-tk-sku2{font-family:Menlo,monospace;font-size:11.5px;color:#8a918c}
.ps-tk-atsargai{color:#787c78;font-style:italic}
.ps-tk-del{font-size:12px;color:#98262A}
.ps-tk-pridek{display:flex;gap:8px;align-items:center;padding:12px 14px;border-top:1px solid #eee;background:#fafaf8}
.ps-tk-pridek label{font-size:13px;color:#5e6661}
.ps-tk-sku{width:190px}
.ps-tk-f{display:flex;gap:8px;padding:12px 14px;border-top:1px solid #eee}
.ps-tk-pad{margin:12px 14px 0;color:#5e6661}
.ps-tk-tuscia{background:#fff;border:1px solid #dcdcd6;border-radius:8px;padding:40px;text-align:center;color:#8a918c;margin-top:16px}
.ps-tk-tuscia2{text-align:center;color:#8a918c;padding:18px}
.ps-tk-mazai{color:#98262A;font-weight:700}
.ps-tk-gauta{opacity:.9}
.ps-tk-pr{padding:2px 0}
.ps-tk-pr .mono{color:#787c78;margin-left:8px}
.ps-tk-truksta{color:#98262A}
.ps-tk-ok{color:#2D5F3F;font-weight:600}
.ps-tk-lauk{color:#96660C}
</style>
<script>
document.addEventListener('click',function(e){
  var a=e.target.closest('.ps-tk-atid');
  if(!a) return;
  e.preventDefault();
  var inp=a.parentNode.querySelector('.ps-tk-data');
  if(inp){ inp.classList.remove('ps-slept'); inp.focus(); a.style.display='none'; }
});
</script>
		<?php
	}
}
Petshop_AV_Tiekimas::init();
