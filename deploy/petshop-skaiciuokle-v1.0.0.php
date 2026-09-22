<?php
/**
 * Plugin Name: Petshop Skaičiuoklė — puslapis /skaiciuokle/
 * Description: Atskiras skaičiuoklės puslapis be prekės konteksto: rūšis + svoris → maistai su dienos kaina (S1703, veiksmų plano 1.7).
 * Version: 1.0.0
 *
 * KAM: landing'as organikai („kiek kainuoja šerti šunį per dieną"), AI botams,
 * kainų palyginimui, laiškams ir veislių puslapiams. Prekės puslapio skaičiuoklė
 * atsako apie VIENĄ maistą; šis puslapis atsako apie VISUS, kuriems gamintojas
 * pateikia normą tam svoriui.
 *
 * PRINCIPAI (paveldėti iš Petshop_Product_Calc, užrakinti):
 *  - skaičiuoklė NEVERTINA tinkamumo — rodo gamintojo normą ir iš jos išvestą dienos kainą;
 *  - MASTER §6.7: NErūšiuojam pagal pigumą — sąrašas rikiuojamas pagal perkamumą
 *    (apmokėtų užsakymų skaičius per 180 d., WC + eShoprent istorija), €/d tik rodomas;
 *  - skanėstai/kramtalai/žuvys/konservai į sąrašą neįtraukiami (dienos kaina nepalyginama).
 *
 * MATAVIMAS: įvykis `skaiciuokle` (ps_web_ivykiai: raktas=rūšis, raktas2=puslapis, reiksme=kg),
 * užsakymo meta `_ps_skaiciuokle_puslapis` iš slapuko (7 d.).
 *
 * Išjungimas: opcija `ps_skaiciuokle_isjungta` = 1 (puslapis lieka, shortcode rodo trumpą tekstą).
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Skaiciuokle {

	const VERSIJA   = '1.0.0';
	const SLUG      = 'skaiciuokle';
	const NS        = 'ps-skaiciuokle/v1';
	const SLAPUKAS  = 'ps_skaiciuokle';
	const CRON      = 'ps_skaiciuokle_naktinis';
	const KANON     = array( 'dog' => array( 5, 10, 20, 30 ), 'cat' => array( 4 ) );

	public static function init() {
		add_shortcode( 'petshop_skaiciuokle', array( __CLASS__, 'shortcode' ) );
		add_action( 'rest_api_init', array( __CLASS__, 'rest' ) );
		add_action( 'wp_head', array( __CLASS__, 'head' ), 5 );
		add_action( 'woocommerce_checkout_create_order', array( __CLASS__, 'atribucija' ), 30, 2 );
		add_action( self::CRON, array( __CLASS__, 'naktinis' ) );
		if ( ! wp_next_scheduled( self::CRON ) ) {
			wp_schedule_event( strtotime( 'tomorrow 05:10' ) - ( (int) get_option( 'gmt_offset' ) * HOUR_IN_SECONDS ), 'daily', self::CRON );
		}
	}

	public static function isjungta() { return (bool) get_option( 'ps_skaiciuokle_isjungta' ); }

	/* ================================================================ */
	/* SKAIČIAVIMAS                                                     */
	/* ================================================================ */

	/** Svorio suapvalinimas — kad transient'ų nebūtų begalybė ir rezultatas būtų stabilus. */
	public static function kg_norm( $kg, $sp ) {
		$kg = (float) str_replace( ',', '.', (string) $kg );
		if ( $kg <= 0 ) { return null; }
		$max = ( 'cat' === $sp ) ? 20 : 100;
		$kg  = min( $max, max( 0.5, $kg ) );
		return ( $kg < 10 ) ? round( $kg * 2 ) / 2 : round( $kg );
	}

	/** Prekių sąrašas rūšiai: publish, instock, aktyvi lentelė, maisto kategorija. */
	private static function kandidatai( $sp ) {
		global $wpdb; $p = $wpdb->prefix;
		$pids = $wpdb->get_col( $wpdb->prepare(
			"SELECT DISTINCT m.product_id FROM {$p}ps_feeding_map m
			 JOIN {$p}ps_feeding_tables t ON t.id=m.feeding_table_id AND t.is_active=1 AND t.species=%s
			 JOIN {$p}posts po ON po.ID=m.product_id AND po.post_status='publish' AND po.post_type='product'
			 JOIN {$p}postmeta ps ON ps.post_id=m.product_id AND ps.meta_key='_stock_status' AND ps.meta_value='instock'
			 WHERE m.is_active=1", $sp ) );
		$out = array();
		foreach ( $pids as $pid ) {
			$pid = (int) $pid;
			$sl  = wp_get_object_terms( $pid, 'product_cat', array( 'fields' => 'slugs' ) );
			$blogas = false;
			foreach ( (array) $sl as $s ) {
				if ( preg_match( '/^(skanestai|kramtal)|konserv|zuvims|paštet|pastet/u', $s ) ) { $blogas = true; break; }
			}
			if ( ! $blogas ) { $out[] = $pid; }
		}
		return $out;
	}

	/** Perkamumas: apmokėtų užsakymų skaičius per 180 d. (WC faktai + eShoprent istorija). */
	private static function perkamumas( array $pids ) {
		global $wpdb; $p = $wpdb->prefix; $r = array();
		if ( ! $pids ) { return $r; }
		$in = implode( ',', array_map( 'intval', $pids ) );
		foreach ( array( 'ps_fakt_eilutes' => ' AND testinis=0', 'ps_ist_fakt_eilutes' => '' ) as $t => $extra ) {
			$rows = $wpdb->get_results( "SELECT preke_id pid, COUNT(DISTINCT uzsakymas_id) u FROM {$p}$t WHERE preke_id IN ($in) AND apmoketa_at>=NOW()-INTERVAL 180 DAY$extra GROUP BY preke_id", ARRAY_A );
			foreach ( (array) $rows as $x ) { $r[ (int) $x['pid'] ] = ( $r[ (int) $x['pid'] ] ?? 0 ) + (int) $x['u']; }
		}
		return $r;
	}

	/**
	 * Rezultatai rūšiai ir svoriui. Transient 6 val.
	 * Grąžina: items (rikiuota pagal perkamumą, po to €/d), skaičiai, min/max €/d.
	 */
	public static function rezultatai( $sp, $kg ) {
		$sp = ( 'cat' === $sp ) ? 'cat' : 'dog';
		$kg = self::kg_norm( $kg, $sp );
		if ( null === $kg ) { return array( 'ok' => 0, 'klaida' => 'svoris' ); }
		if ( ! class_exists( 'Petshop_Feeding_Service' ) || ! Petshop_Feeding_Service::calc_enabled() ) { return array( 'ok' => 0, 'klaida' => 'isjungta' ); }
		$ck  = 'ps_sk_' . $sp . '_' . str_replace( '.', '_', (string) $kg );
		$out = get_transient( $ck );
		if ( is_array( $out ) && isset( $out['items'] ) ) { return $out; }

		$pids = self::kandidatai( $sp );
		$perk = self::perkamumas( $pids );
		$items = array(); $amzius = 0; $uz_ribu = 0; $kita = 0;
		foreach ( $pids as $pid ) {
			$r = Petshop_Feeding_Service::calc( array( 'product_id' => $pid, 'weight_kg' => $kg, 'species_code' => $sp ) );
			if ( ! is_array( $r ) || 'ok' !== ( $r['status'] ?? '' ) || ! isset( $r['cost_day_min'] ) || null === $r['cost_day_min'] ) {
				$rc = implode( ',', (array) ( $r['reason_codes'] ?? array() ) );
				if ( false !== strpos( $rc, 'AGE_REQUIRED' ) ) { $amzius++; }
				elseif ( false !== strpos( $rc, 'WEIGHT_OUT_OF_RANGE' ) ) { $uz_ribu++; }
				else { $kita++; }
				continue;
			}
			$pr = wc_get_product( $pid );
			if ( ! $pr || ! $pr->is_purchasable() ) { continue; }
			$b  = get_the_terms( $pid, 'product_brand' );
			$items[] = array(
				'pid'   => $pid,
				'pav'   => $pr->get_name(),
				'url'   => add_query_arg( 'svoris', $kg, get_permalink( $pid ) ),
				'img'   => $pr->get_image_id() ? wp_get_attachment_image_url( $pr->get_image_id(), 'woocommerce_thumbnail' ) : '',
				'brend' => ( $b && ! is_wp_error( $b ) ) ? $b[0]->name : '',
				'pak'   => (string) $pr->get_attribute( 'pa_pakuotes_dydis' ),
				'kaina' => (float) $pr->get_price(),
				'akc'   => $pr->is_on_sale() ? 1 : 0,
				'cd'    => array( (float) $r['cost_day_min'], (float) $r['cost_day_max'] ),
				'cm'    => array( (float) $r['cost_30d_min'], (float) $r['cost_30d_max'] ),
				'd'     => array( (int) $r['days_min'], (int) $r['days_max'] ),
				'g'     => array( (int) $r['norm_min_g'], (int) $r['norm_max_g'] ),
				'perk'  => (int) ( $perk[ $pid ] ?? 0 ),
			);
		}
		usort( $items, function ( $a, $b ) {
			if ( $a['perk'] !== $b['perk'] ) { return $b['perk'] <=> $a['perk']; }
			return $a['cd'][0] <=> $b['cd'][0];
		} );
		$min = null; $max = null;
		foreach ( $items as $it ) { $min = ( null === $min ) ? $it['cd'][0] : min( $min, $it['cd'][0] ); $max = ( null === $max ) ? $it['cd'][1] : max( $max, $it['cd'][1] ); }
		$out = array(
			'ok' => 1, 'rusis' => $sp, 'kg' => $kg, 'n' => count( $items ), 'amzius' => $amzius, 'uz_ribu' => $uz_ribu, 'kita' => $kita,
			'min' => $min, 'max' => $max, 'items' => $items,
			'kategorija' => self::kategorijos_url( $sp, $kg ),
			'laikas' => current_time( 'mysql' ),
		);
		set_transient( $ck, $out, 6 * HOUR_IN_SECONDS );
		return $out;
	}

	private static function kategorijos_url( $sp, $kg ) {
		$u = get_term_link( ( 'cat' === $sp ) ? 'sausas-maistas-katems' : 'sausas-maistas-sunims', 'product_cat' );
		if ( is_wp_error( $u ) ) { return ''; }
		return add_query_arg( array( 'ps_weight' => $kg, 'ps_species' => $sp ), $u );
	}

	/** Naktinis: sušildo kanoninius svorius (SEO lentelei) ir išvalo puslapio cache. */
	public static function naktinis() {
		foreach ( self::KANON as $sp => $kgs ) {
			foreach ( $kgs as $kg ) { delete_transient( 'ps_sk_' . $sp . '_' . $kg ); self::rezultatai( $sp, $kg ); }
		}
		update_option( 'ps_skaiciuokle_pask', current_time( 'mysql' ), false );
		$pg = get_page_by_path( self::SLUG );
		if ( $pg && function_exists( 'wp_cache_post_change' ) ) { wp_cache_post_change( $pg->ID ); }
	}

	/* ================================================================ */
	/* REST                                                             */
	/* ================================================================ */

	public static function rest() {
		register_rest_route( self::NS, '/rezultatai', array(
			'methods' => 'GET', 'permission_callback' => '__return_true',
			'callback' => function ( $req ) {
				if ( self::isjungta() ) { return new WP_REST_Response( array( 'ok' => 0, 'klaida' => 'isjungta' ), 200 ); }
				$r = self::rezultatai( (string) $req->get_param( 'rusis' ), (string) $req->get_param( 'kg' ) );
				$resp = new WP_REST_Response( $r, 200 );
				$resp->header( 'Cache-Control', 'public, max-age=1800' );
				return $resp;
			},
			'args' => array( 'rusis' => array( 'default' => 'dog' ), 'kg' => array( 'default' => '' ) ),
		) );
	}

	/* ================================================================ */
	/* ATRIBUCIJA                                                       */
	/* ================================================================ */

	public static function atribucija( $order, $data ) {
		if ( empty( $_COOKIE[ self::SLAPUKAS ] ) ) { return; }
		$v = preg_replace( '/[^a-z0-9_.:-]/', '', (string) wp_unslash( $_COOKIE[ self::SLAPUKAS ] ) );
		if ( '' !== $v ) { $order->update_meta_data( '_ps_skaiciuokle_puslapis', mb_substr( $v, 0, 40 ) ); }
	}

	/* ================================================================ */
	/* SEO: title/description + FAQ schema tik šiame puslapyje          */
	/* ================================================================ */

	private static function cia() { return is_page( self::SLUG ); }

	public static function head() {
		if ( ! self::cia() ) { return; }
		$faq = array();
		foreach ( self::duk() as $q ) { $faq[] = array( '@type' => 'Question', 'name' => $q[0], 'acceptedAnswer' => array( '@type' => 'Answer', 'text' => wp_strip_all_tags( $q[1] ) ) ); }
		$ld = array(
			array( '@context' => 'https://schema.org', '@type' => 'WebApplication', 'name' => 'Šėrimo kainos skaičiuoklė', 'url' => get_permalink(), 'applicationCategory' => 'UtilitiesApplication', 'operatingSystem' => 'Web', 'offers' => array( '@type' => 'Offer', 'price' => '0', 'priceCurrency' => 'EUR' ), 'provider' => array( '@type' => 'Organization', 'name' => 'Petshop.lt', 'url' => home_url( '/' ) ) ),
			array( '@context' => 'https://schema.org', '@type' => 'FAQPage', 'mainEntity' => $faq ),
		);
		foreach ( $ld as $x ) { echo '<script type="application/ld+json">' . wp_json_encode( $x, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n"; }
	}

	/** DUK — tekstai su realiais skaičiais iš kanoninių transient'ų (jei sušildyti). */
	private static function duk() {
		$d10 = get_transient( 'ps_sk_dog_10' ); $c4 = get_transient( 'ps_sk_cat_4' ); $d30 = get_transient( 'ps_sk_dog_30' );
		$eur = function ( $v ) { return number_format( (float) $v, 2, ',', '' ) . ' €'; };
		$rez = function ( $t, $kas ) use ( $eur ) {
			if ( ! is_array( $t ) || empty( $t['n'] ) ) { return 'Įveskite svorį skaičiuoklėje — parodysime kiekvieno maisto dienos ir mėnesio kainą.'; }
			return 'Pagal gamintojų šėrimo lenteles ' . $kas . ' sausas maistas kainuoja nuo ' . $eur( $t['min'] ) . ' iki ' . $eur( $t['max'] ) . ' per dieną, t. y. maždaug nuo ' . $eur( $t['min'] * 30 ) . ' iki ' . $eur( $t['max'] * 30 ) . ' per mėnesį (' . (int) $t['n'] . ' maistai su gamintojo norma šiam svoriui). Skirtumą lemia pakuotės dydis ir maisto kaloringumas: didesnė pakuotė ir kaloringesnis maistas duoda pigesnę dieną.';
		};
		return array(
			array( 'Kiek kainuoja šerti 10 kg šunį per dieną?', $rez( $d10, '10 kg šuniui' ) ),
			array( 'Kiek kainuoja šerti katę per mėnesį?', $rez( $c4, '4 kg katei' ) ),
			array( 'Kiek maisto per dieną reikia 30 kg šuniui?', is_array( $d30 ) && ! empty( $d30['n'] ) ? 'Priklauso nuo maisto kaloringumo: gamintojų lentelėse 30 kg šuniui nurodoma nuo ' . (int) min( array_map( function ( $i ) { return $i['g'][0]; }, $d30['items'] ) ) . ' iki ' . (int) max( array_map( function ( $i ) { return $i['g'][1]; }, $d30['items'] ) ) . ' g per dieną. Skaičiuoklė rodo konkretaus maisto normą ir kiek dienų užteks pakuotės.' : 'Skaičiuoklė rodo konkretaus maisto gamintojo normą ir kiek dienų užteks pakuotės.' ),
			array( 'Kaip skaičiuojama dienos kaina?', 'Imame gamintojo šėrimo lentelę (gramai per dieną pagal svorį), pakuotės dydį ir dabartinę kainą petshop.lt: dienos kaina = pakuotės kaina ÷ (pakuotės gramai ÷ dienos norma). Kai gamintojas nurodo intervalą (pvz. pagal aktyvumą), rodome intervalą. Tinkamumo maistas jūsų augintiniui nevertiname — tai gamintojo norma, ne rekomendacija.' ),
			array( 'Kodėl kai kurių maistų sąraše nėra?', 'Rodome tik tuos maistus, kuriems gamintojas pateikia normą įvestam svoriui. Šuniukų ir kačiukų maistų normos dažnai pateikiamos pagal amžių — jas rasite prekės puslapyje įvedę amžių. Skanėstų, kramtalų ir konservų dienos kaina nelyginama.' ),
		);
	}

	/* ================================================================ */
	/* SHORTCODE                                                        */
	/* ================================================================ */

	public static function shortcode( $atts ) {
		if ( self::isjungta() ) { return '<p>Skaičiuoklė laikinai neveikia. Dienos kainą rasite kiekvieno maisto puslapyje.</p>'; }
		$rest = esc_url( rest_url( self::NS . '/rezultatai' ) );
		$cfg  = wp_json_encode( array( 'rest' => $rest, 'kat' => array( 'dog' => self::kategorijos_url( 'dog', 10 ), 'cat' => self::kategorijos_url( 'cat', 4 ) ) ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
		ob_start();
		?>
<div class="ps-sk" id="ps-sk" data-cfg='<?php echo esc_attr( $cfg ); ?>'>
	<div class="ps-sk-form">
		<div class="ps-sk-lbl">Kam skaičiuojame?</div>
		<div class="ps-sk-rusis" role="radiogroup">
			<button type="button" class="ps-sk-r on" data-r="dog">🐕 Šuniui</button>
			<button type="button" class="ps-sk-r" data-r="cat">🐈 Katei</button>
		</div>
		<label class="ps-sk-lbl" for="ps-sk-kg">Kiek sveria jūsų <span data-nom>šuo</span>?</label>
		<div class="ps-sk-in">
			<span class="ps-sk-unit"><input type="number" id="ps-sk-kg" min="0.5" max="100" step="0.1" inputmode="decimal" placeholder="pvz. 10"><i>kg</i></span>
			<button type="button" class="ps-sk-go">Skaičiuoti →</button>
		</div>
		<p class="ps-sk-note">Rodome gamintojo šėrimo normą ir iš jos išvestą dienos kainą pagal petshop.lt kainą. Šuniukams ir kačiukams — prekės puslapyje, įvedus amžių.</p>
	</div>
	<div class="ps-sk-out" aria-live="polite"></div>
</div>
<style>
.ps-sk{max-width:960px;margin:0 auto}
.ps-sk-form{background:#F3EFE5;border:1px solid #E5DCCB;border-left:3px solid #2F6B4F;border-radius:14px;padding:18px 20px;margin:0 0 18px}
.ps-sk-lbl{display:block;font-size:14px;font-weight:700;color:#1F2A24;margin:0 0 8px}
.ps-sk-rusis{display:flex;gap:8px;margin:0 0 14px}
.ps-sk-r{flex:0 0 auto;height:42px;padding:0 18px;border:1.5px solid #D8D2C6;border-radius:999px;background:#fff;color:#2A352E;font:inherit;font-size:14px;font-weight:650;cursor:pointer;text-transform:none;letter-spacing:normal;margin:0}
.ps-sk-r.on{border-color:#2F6B4F;background:#2F6B4F;color:#fff}
.ps-sk-in{display:flex;gap:9px;flex-wrap:wrap;align-items:stretch}
.ps-sk-unit{position:relative;flex:1 1 150px;max-width:220px;display:flex}
.ps-sk-unit input{width:100%;height:46px;box-sizing:border-box;margin:0;border:1px solid #D8D2C6;border-radius:11px;padding:0 44px 0 13px;font:inherit;font-size:16px;background:#fff;box-shadow:none}
.ps-sk-unit input:focus{border-color:#2F6B4F;outline:none;box-shadow:0 0 0 3px rgba(47,107,79,.12)}
.ps-sk-unit i{position:absolute;right:0;top:0;bottom:0;width:38px;display:flex;align-items:center;font-style:normal;font-size:13.5px;font-weight:650;color:#8A968C;pointer-events:none}
.ps-sk-go{height:46px;box-sizing:border-box;margin:0;background:#2F6B4F;color:#fff;border:1.5px solid #2F6B4F;border-radius:11px;padding:0 22px;font:inherit;font-size:15px;font-weight:700;cursor:pointer;text-transform:none;letter-spacing:normal}
.ps-sk-go:hover{background:#1F4E39}
.ps-sk-note{font-size:12.5px;color:#6B7A70;margin:10px 0 0;line-height:1.5}
.ps-sk-h{font-size:20px;font-weight:750;color:#1F2A24;margin:0 0 4px;letter-spacing:-.01em}
.ps-sk-sub{font-size:13.5px;color:#5A665C;margin:0 0 14px;line-height:1.5}
.ps-sk-top{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0 0 18px}
@media(max-width:700px){.ps-sk-top{grid-template-columns:1fr}}
.ps-sk-card{display:block;background:#fff;border:1px solid #E5DCCB;border-radius:14px;padding:14px;text-decoration:none;color:#1F2A24;position:relative}
.ps-sk-card:hover{border-color:#2F6B4F;color:#1F2A24}
.ps-sk-card img{width:100%;height:150px;object-fit:contain;display:block;margin:0 0 8px}
.ps-sk-card .b{font-size:11px;font-weight:700;color:#2F6B4F;text-transform:uppercase;letter-spacing:.04em}
.ps-sk-card .n{font-size:14px;font-weight:650;line-height:1.35;margin:2px 0 8px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ps-sk-card .eur{font-size:22px;font-weight:750;color:#1F4E39;letter-spacing:-.02em}
.ps-sk-card .eur small{font-size:13px;font-weight:600;color:#5A665C}
.ps-sk-card .d{font-size:12.5px;color:#5A665C;margin-top:4px;line-height:1.45}
.ps-sk-badge{position:absolute;top:10px;left:10px;background:#F3EFE5;border:1px solid #E5DCCB;border-radius:999px;padding:3px 9px;font-size:11px;font-weight:700;color:#2F6B4F}
.ps-sk-filt{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px}
.ps-sk-f{border:1px solid #D8D2C6;background:#fff;border-radius:999px;padding:5px 12px;font:inherit;font-size:12.5px;font-weight:600;color:#2A352E;cursor:pointer;margin:0;text-transform:none;letter-spacing:normal}
.ps-sk-f.on{border-color:#2F6B4F;background:#E8F1EA;color:#1F4E39}
.ps-sk-tbl{width:100%;border-collapse:collapse;font-size:13.5px}
.ps-sk-tbl th{text-align:left;font-size:11.5px;text-transform:uppercase;letter-spacing:.04em;color:#8A968C;font-weight:700;padding:6px 8px;border-bottom:1px solid #E5DCCB}
.ps-sk-tbl td{padding:9px 8px;border-bottom:1px solid #EFEBE2;vertical-align:middle}
.ps-sk-tbl td.r{text-align:right;white-space:nowrap}
.ps-sk-tbl a{color:#1F2A24;text-decoration:none;font-weight:600}
.ps-sk-tbl a:hover{color:#2F6B4F}
.ps-sk-tbl .eur{font-weight:750;color:#1F4E39}
.ps-sk-tbl img{width:44px;height:44px;object-fit:contain;vertical-align:middle;margin-right:8px;border-radius:6px;background:#fff}
.ps-sk-tbl .p{font-size:12px;color:#8A968C}
@media(max-width:700px){.ps-sk-tbl .hide-m{display:none}.ps-sk-tbl img{width:36px;height:36px}}
.ps-sk-more{display:inline-block;margin:12px 0 0;border:1px solid #C9D8CD;background:#fff;border-radius:999px;padding:9px 18px;font:inherit;font-size:13px;font-weight:650;color:#2F6B4F;cursor:pointer;text-decoration:none;text-transform:none;letter-spacing:normal}
.ps-sk-more:hover{background:#F4F8F5;color:#1F4E39}
.ps-sk-info{background:#fff;border:1px solid #E5DCCB;border-radius:13px;padding:12px 16px;margin:14px 0 0;font-size:13px;color:#5A665C;line-height:1.55}
.ps-sk-err{color:#B4553F;font-size:13.5px;margin:8px 0}
</style>
<script>
(function(){
"use strict";
var root=document.getElementById('ps-sk');if(!root)return;
var CFG=JSON.parse(root.getAttribute('data-cfg')||'{}'),out=root.querySelector('.ps-sk-out'),kgEl=document.getElementById('ps-sk-kg'),go=root.querySelector('.ps-sk-go');
var sp='dog',data=null,filt='',rodytiVisus=false;
var W={dog:{nom:'šuo',dat:'šuniui'},cat:{nom:'katė',dat:'katei'}};
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function eur(v){return Number(v).toFixed(2).replace('.',',')+' €';}
function rng(a,b,f){f=f||function(x){return x;};return (a===b)?f(a):(f(a)+'–'+f(b));}
function dienos(n){var w=Math.round(n),d=w%10,dd=w%100;if(dd>=11&&dd<=19)return 'dienų';if(d===1)return 'diena';if(d>=2&&d<=9)return 'dienos';return 'dienų';}
function setSp(s){sp=s;root.querySelectorAll('.ps-sk-r').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-r')===s);});root.querySelector('[data-nom]').textContent=W[s].nom;kgEl.max=(s==='cat')?20:100;}
root.querySelectorAll('.ps-sk-r').forEach(function(b){b.addEventListener('click',function(){setSp(b.getAttribute('data-r'));if(kgEl.value)skaiciuoti();});});
function card(it,i){
 return '<a class="ps-sk-card" href="'+esc(it.url)+'">'+(it.perk>0?'<span class="ps-sk-badge">Perkamiausi #'+(i+1)+'</span>':'')+(it.img?'<img src="'+esc(it.img)+'" alt="" loading="lazy">':'')+'<div class="b">'+esc(it.brend)+'</div><div class="n">'+esc(it.pav)+'</div><div class="eur">'+esc(rng(it.cd[0],it.cd[1],eur))+' <small>/ dieną</small></div><div class="d">'+esc(it.pak||'')+(it.pak?' · ':'')+esc(eur(it.kaina))+'<br>užteks ~'+esc(rng(it.d[0],it.d[1]))+' '+dienos(it.d[1])+' · '+esc(rng(it.g[0],it.g[1]))+' g/d.</div></a>';
}
function row(it){
 return '<tr><td><a href="'+esc(it.url)+'">'+(it.img?'<img src="'+esc(it.img)+'" alt="" loading="lazy">':'')+esc(it.pav)+'</a></td><td class="r"><span class="eur">'+esc(rng(it.cd[0],it.cd[1],eur))+'</span></td><td class="r hide-m">'+esc(rng(it.cm[0],it.cm[1],eur))+'</td><td class="r hide-m">'+esc(rng(it.g[0],it.g[1]))+' g</td><td class="r"><span class="p">'+esc(it.pak||'')+'</span><br>'+esc(eur(it.kaina))+'<br><span class="p">~'+esc(rng(it.d[0],it.d[1]))+' d.</span></td></tr>';
}
function piesti(){
 if(!data||!data.ok){out.innerHTML='<p class="ps-sk-err">Nepavyko apskaičiuoti. Pabandykite dar kartą.</p>';return;}
 var w=W[data.rusis],h='';
 if(!data.n){out.innerHTML='<div class="ps-sk-info">Šiam svoriui ('+esc(data.kg)+' kg) gamintojų lentelėse normos nėra. '+(data.amzius?'Šuniukų/kačiukų maistų ('+data.amzius+') normos pateikiamos pagal amžių — įveskite jį prekės puslapyje. ':'')+'</div>';return;}
 h+='<div class="ps-sk-h">'+esc(data.kg)+' kg '+w.dat+': nuo '+esc(eur(data.min))+' iki '+esc(eur(data.max))+' per dieną</div>';
 h+='<div class="ps-sk-sub">'+data.n+' maistai su gamintojo norma šiam svoriui · apie '+esc(eur(data.min*30))+'–'+esc(eur(data.max*30))+' per mėnesį. Rikiuojame pagal perkamumą per 180 d.</div>';
 var top=data.items.slice(0,3);
 h+='<div class="ps-sk-top">'+top.map(card).join('')+'</div>';
 var brands={};data.items.forEach(function(it){if(it.brend)brands[it.brend]=(brands[it.brend]||0)+1;});
 var bk=Object.keys(brands).sort(function(a,b){return brands[b]-brands[a];});
 h+='<div class="ps-sk-filt"><button type="button" class="ps-sk-f'+(filt===''?' on':'')+'" data-b="">Visi ('+data.n+')</button>'+bk.map(function(b){return '<button type="button" class="ps-sk-f'+(filt===b?' on':'')+'" data-b="'+esc(b)+'">'+esc(b)+' ('+brands[b]+')</button>';}).join('')+'</div>';
 var list=data.items.filter(function(it){return !filt||it.brend===filt;});
 var lim=(rodytiVisus||filt)?list.length:Math.min(12,list.length);
 h+='<table class="ps-sk-tbl"><thead><tr><th>Maistas</th><th class="r">€ / dieną</th><th class="r hide-m">€ / mėn.</th><th class="r hide-m">Norma</th><th class="r">Pakuotė</th></tr></thead><tbody>'+list.slice(0,lim).map(row).join('')+'</tbody></table>';
 if(lim<list.length)h+='<button type="button" class="ps-sk-more" data-more="1">Rodyti visus ('+list.length+')</button> ';
 if(data.kategorija)h+='<a class="ps-sk-more" href="'+esc(data.kategorija)+'">Žiūrėti kategorijoje su dienos kaina →</a>';
 var inf=[];if(data.amzius)inf.push('Dar '+data.amzius+' šuniukų/kačiukų maistų normos pateikiamos pagal amžių — dienos kainą rasite prekės puslapyje įvedę amžių.');if(data.uz_ribu)inf.push(data.uz_ribu+' maistų gamintojas normos '+esc(data.kg)+' kg nepateikia.');
 inf.push('Dienos kaina = pakuotės kaina ÷ dienų skaičius pagal gamintojo normą. Tai gamintojo norma, ne mūsų rekomendacija — tinkamumo nevertiname.');
 h+='<div class="ps-sk-info">'+inf.join(' ')+'</div>';
 out.innerHTML=h;
 out.querySelectorAll('.ps-sk-f').forEach(function(b){b.addEventListener('click',function(){filt=b.getAttribute('data-b');piesti();});});
 var m=out.querySelector('[data-more]');if(m)m.addEventListener('click',function(){rodytiVisus=true;piesti();});
}
function skaiciuoti(){
 var kg=parseFloat(String(kgEl.value).replace(',','.'));
 if(!kg||kg<=0){out.innerHTML='<p class="ps-sk-err">Įveskite svorį kilogramais.</p>';kgEl.focus();return;}
 go.disabled=true;go.textContent='…';filt='';rodytiVisus=false;
 fetch(CFG.rest+'?rusis='+sp+'&kg='+encodeURIComponent(kg),{credentials:'same-origin'}).then(function(r){return r.json();}).then(function(d){
  data=d;piesti();
  try{history.replaceState(null,'','?rusis='+sp+'&kg='+encodeURIComponent(kg));}catch(e){}
  try{document.cookie='<?php echo self::SLAPUKAS; ?>='+sp+':'+kg+';path=/;max-age=604800;SameSite=Lax';}catch(e){}
  try{if(window.psWeb)window.psWeb({tipas:'skaiciuokle',raktas:sp,raktas2:'puslapis',reiksme:Math.round(kg)});}catch(e){}
  if(d&&d.ok){try{out.scrollIntoView({behavior:'smooth',block:'start'});}catch(e){}}
 }).catch(function(){out.innerHTML='<p class="ps-sk-err">Nepavyko susisiekti su serveriu. Pabandykite dar kartą.</p>';}).then(function(){go.disabled=false;go.textContent='Skaičiuoti →';});
}
go.addEventListener('click',skaiciuoti);
kgEl.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();skaiciuoti();}});
/* ?rusis=dog&kg=10 — iš laiškų, veislių puslapių, nuorodų */
try{var q=new URLSearchParams(location.search),qs=q.get('rusis'),qk=q.get('kg')||q.get('svoris');if(qs==='cat'||qs==='dog')setSp(qs);if(qk){kgEl.value=qk;skaiciuoti();}}catch(e){}
})();
</script>
<?php
		$html = ob_get_clean();
		// SEO tekstas po skaičiuokle
		$html .= self::tekstas();
		return $html;
	}

	/** Statinis tekstas: kaip skaičiuojame, orientacinė lentelė (iš naktinio cache), DUK. */
	private static function tekstas() {
		$eur = function ( $v ) { return number_format( (float) $v, 2, ',', '' ) . ' €'; };
		$h = '<div class="ps-sk-txt" style="max-width:960px;margin:28px auto 0;font-size:15px;line-height:1.6;color:#2A352E">';
		$h .= '<h2>Kaip skaičiuojame dienos kainą</h2><p>Kiekvienam maistui turime gamintojo šėrimo lentelę — kiek gramų per dieną duoti pagal augintinio svorį (kai kur ir aktyvumą ar amžių). Dienos kaina = pakuotės kaina petshop.lt ÷ dienų skaičius, kuriam pakuotės užtenka. Todėl 12,5 kg maišas beveik visada duoda pigesnę dieną nei 3 kg pakuotė to paties maisto, o kaloringesnio maisto reikia mažiau gramų.</p>';
		$rows = array();
		foreach ( self::KANON as $sp => $kgs ) {
			foreach ( $kgs as $kg ) {
				$t = get_transient( 'ps_sk_' . $sp . '_' . $kg );
				if ( ! is_array( $t ) || empty( $t['n'] ) ) { continue; }
				$rows[] = '<tr><td>' . (int) $kg . ' kg ' . ( 'cat' === $sp ? 'katė' : 'šuo' ) . '</td><td style="text-align:right">' . esc_html( $eur( $t['min'] ) . ' – ' . $eur( $t['max'] ) ) . '</td><td style="text-align:right">' . esc_html( $eur( $t['min'] * 30 ) . ' – ' . $eur( $t['max'] * 30 ) ) . '</td><td style="text-align:right">' . (int) $t['n'] . '</td></tr>';
			}
		}
		if ( $rows ) {
			$h .= '<h2>Kiek kainuoja šerti šunį ar katę — orientaciniai skaičiai</h2><table class="ps-sk-tbl" style="max-width:640px"><thead><tr><th>Augintinis</th><th style="text-align:right">€ / dieną</th><th style="text-align:right">€ / mėn.</th><th style="text-align:right">Maistų</th></tr></thead><tbody>' . implode( '', $rows ) . '</tbody></table><p style="font-size:13px;color:#6B7A70">Sausas maistas, gamintojų normos, petshop.lt kainos. Atnaujinama kasdien.</p>';
		}
		$h .= '<h2>Dažni klausimai</h2>';
		foreach ( self::duk() as $q ) { $h .= '<h3 style="font-size:16px;margin:16px 0 4px">' . esc_html( $q[0] ) . '</h3><p>' . esc_html( $q[1] ) . '</p>'; }
		$h .= '</div>';
		return $h;
	}
}
Petshop_Skaiciuokle::init();
