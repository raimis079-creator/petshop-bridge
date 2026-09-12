<?php
/**
 * Petshop AV Source v1.2 (S1676) — AV kaip realus tiekimo šaltinis.
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
