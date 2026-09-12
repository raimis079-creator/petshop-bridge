<?php
/**
 * Petshop AV Source v1.3 (S1676) — AV kaip realus tiekimo šaltinis.
 *
 * v1.3 (S1676, Raimio taisyklė 09-12): „dropship prekės eina iš dropship sandėlių PIRMIAUSIA; jei jie neturi
 *   arba užsakymas mišrus (yra ir grynai AV prekių) — tada AV.“ resolve() lieka kaip buvo (AV pirma — jį naudoja
 *   katalogas/darbalaukis kaip faktą „ar AV turi“); UŽSAKYMO sprendimą priima parinkti($pid,$qty,$misrus):
 *   tiekėjas turi ≥ qty (Petshop_Sources::gyvi) ir užsakymas ne mišrus → tiekėjas; kitaip → AV, jei užtenka; kitaip → tiekėjas.
 *
 * v1.2 (S1676, Raimis: „bendras principas, ne tik Tofu“): DP pakas („Daugiau=pigiau“,
 *   `_dp_base_product_id` + `_dp_pack_qty`, manage_stock=no) NIEKADA neturi savo likučio —
 *   resolve() sprendžia per BAZINĘ prekę × pako kiekį ir grąžina AV likutį PAKAIS.
 *   Galioja visoms bazinėms rūšims (grynai AV / AV+tiekėjas / dropship).
 *
 * ANTRAS SLUOKSNIS (REGISTRAS §17.7, §19).
 *
 * TAISYKLĖ (Raimis, §17.2):
 *   „VF, ZB prekės važiuoja dropshipingu. Bet jei pasitaiko mix užsakymas ir prekė
 *    yra iš AV sandėlio, tada pirmenybė AV; jei tik VF ar ZB, tada tik iš ten."
 *
 * EILUTEI:  AV turi VISĄ kiekį → AV;  kitaip → dropship tiekėjas.
 *
 * KODĖL NELIEČIU class-fulfillment-source.php:
 *   Tas failas (6 711 B) yra VIENINTELĖ sandėlio tiesos vieta, ir juo remiasi TRYS
 *   veikiantys dalykai: S77 cart cross-sell, S77 pristatymo ribojimas, S74 FBT.
 *   Vietoj perrašymo — ATSKIRA klasė, kuri resolve() rezultatą PAPILDO.
 *
 * VEŽĖJAS (Raimio pataisa §18.1):
 *   AV  → venipak ARBA lp_express   (carrier = 'any')
 *   visi dropship → tik venipak
 *
 * DVI AV RŪŠYS (išmatuota s472):
 *   1. GRYNAI AV — 959 publish, _legacy_source=excel_v2_20260604, likutis `_stock`.
 *      Resolveris grąžina `legacy`; mes verčiam į `av`. `_own_stock_qty` NEREIKIA.
 *   2. AV + TIEKĖJAS — Josera tipo. Prekė yra ir pas VF/ZB, ir pas Raimį.
 *      Likutis `_own_stock_qty`; `_stock` perrašo sync.
 *
 * SVARBU: šis sluoksnis NIEKO NERAŠO ir NEMAŽINA. Tik ATSAKO, iš kur siųsti.
 * Fiksavimas užsakymo eilutėje — 4 sluoksnis. Mažinimas — 5.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_AV_Source {

	/**
	 * Iš kur siųsti šią prekę šiuo kiekiu.
	 *
	 * @return array{
	 *   source: string,        av|zb|vf|quattro|ambrosia|belcor_tofu|prins|legacy
	 *   carrier: string,       any|venipak
	 *   courier_only: bool,
	 *   av_qty: int|null,      AV likutis (null = AV neturi)
	 *   av_uztenka: bool,      ar AV užtenka prašomam kiekiui
	 *   tiekejas: string,      koks tiekėjas BŪTŲ be AV
	 *   reason: string
	 * }
	 */
	public static function resolve( $product_id, $qty = 1 ) {
		$product_id = (int) $product_id;
		$qty        = max( 1, (int) $qty );

		// v1.2: DP pakas → bazinė prekė × pako kiekis; likutis grąžinamas pakais.
		$dp = self::dp( $product_id );
		if ( $dp ) {
			$r = self::resolve( $dp['base'], $qty * $dp['n'] );
			$r['av_qty'] = ( null === $r['av_qty'] ) ? null : intdiv( (int) $r['av_qty'], $dp['n'] );
			$r['dp']     = $dp;
			$r['reason'] = 'DP pakas ×' . $dp['n'] . ' (bazinė #' . $dp['base'] . '): ' . $r['reason'];
			return $r;
		}

		$baze = class_exists( 'Petshop_Fulfillment_Source' )
			? Petshop_Fulfillment_Source::resolve( $product_id )
			: [ 'source' => 'legacy', 'carrier' => 'any', 'courier_only' => false, 'reason' => 'resolverio nėra' ];

		// `legacy` = AV sandėlis (resolverio komentaras: „tikras savas sandelis").
		// 959 publish prekės iš _legacy_source=excel_v2_20260604 su REALIAIS likučiais
		// WooCommerce `_stock` lauke (niekas jų neperrašo — sinchronizacijos nėra).
		// Joms `_own_stock_qty` NEREIKIA — jos ir taip AV.
		if ( 'legacy' === $baze['source'] ) {
			return [
				'source'       => 'av',
				'carrier'      => 'any',
				'courier_only' => ! empty( $baze['courier_only'] ),
				'av_qty'       => (int) get_post_meta( $product_id, '_stock', true ),
				'av_uztenka'   => true,
				'tiekejas'     => 'av',
				'reason'       => 'grynai AV prekė (be tiekėjo)',
			];
		}

		$av        = class_exists( 'Petshop_AV_Stock' ) ? Petshop_AV_Stock::qty( $product_id ) : null;
		$uztenka   = ( null !== $av && $av >= $qty );
		$tiekejas  = $baze['source'];

		if ( $uztenka ) {
			return [
				'source'       => 'av',
				'carrier'      => 'any',          // AV gali ir Venipak, ir LP
				'courier_only' => ! empty( $baze['courier_only'] ),
				'av_qty'       => $av,
				'av_uztenka'   => true,
				'tiekejas'     => $tiekejas,
				'reason'       => "AV turi $av, reikia $qty",
			];
		}

		// SAUGIKLIS: LP Express galimas TIK iš AV (Raimis §18.1).
		// Bet kuris dropship šaltinis → venipak, nesvarbu ką grąžino bazinis resolveris.
		return [
			'source'       => $tiekejas,
			'carrier'      => 'venipak',
			'courier_only' => ! empty( $baze['courier_only'] ),
			'av_qty'       => $av,
			'av_uztenka'   => false,
			'tiekejas'     => $tiekejas,
			'reason'       => ( null === $av )
				? 'AV šios prekės neturi'
				: "AV turi $av, reikia $qty — neužtenka",
		];
	}

	/** Ar prekė šiuo kiekiu eitų iš AV. */
	/** v1.3: tiekėjo likutis šiai prekei (DP pakui — bazinės). null = nežinomas. */
	public static function tiekejo_likutis( $product_id, $tiekejas ) {
		$dp = self::dp( $product_id ); $pid = $dp ? $dp['base'] : (int) $product_id;
		if ( ! $tiekejas || 'av' === $tiekejas || 'legacy' === $tiekejas ) { return null; }
		if ( class_exists( 'Petshop_Sources' ) && method_exists( 'Petshop_Sources', 'gyvi' ) ) {
			$g = Petshop_Sources::gyvi( $pid, $tiekejas );
			return ( isset( $g['stock_qty'] ) && null !== $g['stock_qty'] ) ? (int) $g['stock_qty'] : null;
		}
		$m = array( 'vf' => '_vf_qty', 'zb' => '_zb_qty' );
		$v = get_post_meta( $pid, isset( $m[ $tiekejas ] ) ? $m[ $tiekejas ] : '_stock', true );
		return ( '' === $v || null === $v ) ? null : (int) $v;
	}

	/**
	 * v1.3: UŽSAKYMO eilutės šaltinis pagal Raimio taisyklę. $misrus — ar užsakyme yra grynai AV prekių.
	 * Grąžina tą pačią struktūrą kaip resolve() + 'tiekejo_qty', 'taisykle'.
	 */
	public static function parinkti( $product_id, $qty = 1, $misrus = false ) {
		$qty = max( 1, (int) $qty );
		$r = self::resolve( $product_id, $qty );
		$tiek = isset( $r['tiekejas'] ) ? $r['tiekejas'] : 'av';
		$r['tiekejo_qty'] = null; $r['taisykle'] = 'grynai AV';
		if ( 'av' === $tiek || 'legacy' === $tiek ) { return $r; } // be tiekėjo — tik AV
		$dp = self::dp( $product_id ); $n = $dp ? $dp['n'] : 1;
		$tq = self::tiekejo_likutis( $product_id, $tiek ); $r['tiekejo_qty'] = $tq;
		$tiekejas_turi = ( null === $tq ) ? true : ( $tq >= $qty * $n ); // nežinomas likutis = laikom, kad turi (feed'o nėra → senas elgesys)
		$av_turi = ! empty( $r['av_uztenka'] ) && null !== $r['av_qty'];
		if ( $tiekejas_turi && ! $misrus ) {
			$r['source'] = $tiek; $r['carrier'] = 'venipak'; $r['av_uztenka'] = false;
			$r['taisykle'] = 'dropship pirma' . ( $av_turi ? ' (AV turi ' . $r['av_qty'] . ', bet užsakymas ne mišrus)' : '' );
			$r['reason']   = $r['taisykle'] . ': tiekėjas ' . $tiek . ( null === $tq ? '' : ' turi ' . $tq ) . '; ' . $r['reason'];
			return $r;
		}
		if ( $av_turi ) {
			$r['source'] = 'av'; $r['carrier'] = 'any'; $r['av_uztenka'] = true;
			$r['taisykle'] = $misrus ? 'mišrus užsakymas → AV' : 'tiekėjas neturi → AV';
			$r['reason']   = $r['taisykle'] . ': ' . $r['reason'];
			return $r;
		}
		$r['source'] = $tiek; $r['carrier'] = 'venipak'; $r['av_uztenka'] = false;
		$r['taisykle'] = 'AV neužtenka → tiekėjas'; $r['reason'] = $r['taisykle'] . ': ' . $r['reason'];
		return $r;
	}

	/** v1.3: ar užsakymas mišrus — turi bent vieną grynai AV eilutę IR bent vieną tiekėjo prekę. */
	public static function ar_misrus( $order ) {
		$av = false; $tiek = false;
		foreach ( $order->get_items() as $it ) {
			$pid = (int) $it->get_product_id(); if ( ! $pid ) { continue; }
			$r = self::resolve( $pid, max( 1, (int) $it->get_quantity() ) );
			$t = isset( $r['tiekejas'] ) ? $r['tiekejas'] : 'av';
			if ( 'av' === $t || 'legacy' === $t ) { $av = true; } else { $tiek = true; }
		}
		return $av && $tiek;
	}

	/** v1.2: DP pakas? → ['base'=>bazinės ID,'n'=>pako kiekis] arba null. */
	public static function dp( $product_id ) {
		$base = (int) get_post_meta( (int) $product_id, '_dp_base_product_id', true );
		$n    = (int) get_post_meta( (int) $product_id, '_dp_pack_qty', true );
		return ( $base > 0 && $n > 0 && $base !== (int) $product_id ) ? array( 'base' => $base, 'n' => $n ) : null;
	}

	public static function is_av( $product_id, $qty = 1 ) {
		$x = self::resolve( $product_id, $qty );
		return 'av' === $x['source'];
	}

	/**
	 * Krepšelio arba užsakymo eilučių sugrupavimas pagal šaltinį.
	 *
	 * @param array $eilutes [ ['product_id'=>int, 'qty'=>int, 'raktas'=>mixed], ... ]
	 * @return array [ 'av' => ['eilutes'=>[...], 'carrier'=>'any'], 'vf' => [...], ... ]
	 */
	public static function group( array $eilutes ) {
		$grupes = [];
		foreach ( $eilutes as $e ) {
			$pid = (int) ( $e['product_id'] ?? 0 );
			if ( ! $pid ) { continue; }
			$qty = max( 1, (int) ( $e['qty'] ?? 1 ) );
			$x   = self::resolve( $pid, $qty );
			$s   = $x['source'];
			if ( ! isset( $grupes[ $s ] ) ) {
				$grupes[ $s ] = [ 'eilutes' => [], 'carrier' => $x['carrier'], 'courier_only' => false ];
			}
			$grupes[ $s ]['eilutes'][] = [
				'product_id' => $pid,
				'qty'        => $qty,
				'raktas'     => $e['raktas'] ?? null,
				'reason'     => $x['reason'],
			];
			if ( $x['courier_only'] ) { $grupes[ $s ]['courier_only'] = true; }
		}
		return $grupes;
	}

	/** Užsakymo tipas pagal grupes: MAIN / DS / MIXED. */
	public static function order_type( array $grupes ) {
		$n = count( $grupes );
		if ( 0 === $n ) { return 'REVIEW'; }
		if ( 1 === $n ) { return isset( $grupes['av'] ) ? 'MAIN' : 'DS'; }
		return 'MIXED';
	}

	/** Patogumui: sugrupuoja WooCommerce užsakymą. */
	public static function group_order( $order ) {
		$order = is_numeric( $order ) ? wc_get_order( $order ) : $order;
		if ( ! $order ) { return []; }
		$eil = [];
		foreach ( $order->get_items() as $item_id => $item ) {
			$pid = $item->get_variation_id() ? $item->get_product_id() : $item->get_product_id();
			$eil[] = [ 'product_id' => $pid, 'qty' => $item->get_quantity(), 'raktas' => $item_id ];
		}
		return self::group( $eil );
	}
}
