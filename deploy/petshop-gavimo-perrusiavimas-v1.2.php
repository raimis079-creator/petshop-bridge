<?php
/**
 * Petshop Gavimo Perrūšiavimas v1.2 (S1676, 2026-09-12, Raimis: „prekės atvažiavo, suvedžiau per Gavimą, turiu iš karto rinkti užsakymus“)
 *
 * PRINCIPAS: gavimas = AV papildymas → atviri apmokėti užsakymai, kurių eilutės šiai prekei (ar jos DP pakams)
 * laukia tiekėjo ir dar NEPERDUOTOS tiekėjui, IŠ KARTO perkeliamos į AV kelią — per darbalaukio `keisti_kelia()`
 * (ta pati logika kaip rankinis „→ Avesa sandėlis“: AV nurašomas, žymos, pastaba, įvykis, eilės perskaičiuojamos).
 * Užrakintos eilutės (perduota tiekėjui / išsiųsta / uždaryta) neliečiamos — keisti_kelia atsisako.
 * Kablys: `ps_partija_priimta` (petshop-partijos v1.4). Vykdoma `shutdown` metu (po visų to paties gavimo eilučių), žurnalas
 * `ps_gavimo_perrus_pask` opcijoje; rankinis DRY: Petshop_Gavimo_Perrusiavimas::perrusiuoti($pid, true).
 * v1.2: seka Raimio taisyklę (av-source v1.3 `parinkti`): į AV perkeliama TIK jei tiekėjas neturi arba užsakymas mišrus.
 * v1.1: REGISTRAS IŠ KARTO — po gavimo ir po kiekvieno `_own_stock_qty` pakeitimo (added/updated_post_meta) kviečiamas
 *   `ps_sources_sync_saugiai()` (snippet 2515), kad ps_sources AV eilutė atsirastų / įsijungtų tą pačią minutę, ne naktį 04:20.
 *   Katalogo AV stulpelis kiekį ima gyvai iš meta, bet tik jei AV eilutė registre yra (S1668 atviras punktas — uždarytas).
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

final class Petshop_Gavimo_Perrusiavimas {
	const VER = '1.2';
	protected static $laukia = array();

	public static function init() {
		add_action( 'ps_partija_priimta', array( __CLASS__, 'gauta' ), 10, 3 );
		add_action( 'ps_partija_priimta', array( __CLASS__, 'registras' ), 5, 1 );
		add_action( 'updated_post_meta', array( __CLASS__, 'meta_own' ), 20, 3 );
		add_action( 'added_post_meta', array( __CLASS__, 'meta_own' ), 20, 3 );
	}

	/** v1.1: `_own_stock_qty` pasikeitė → registro AV eilutė iš karto. */
	public static function meta_own( $mid, $pid, $key ) {
		if ( '_own_stock_qty' === $key ) { self::registras( $pid ); }
	}

	public static function registras( $pid ) {
		static $daryta = array();
		$pid = (int) $pid; if ( $pid <= 0 || isset( $daryta[ $pid ] ) ) { return; }
		$daryta[ $pid ] = 1;
		if ( function_exists( 'ps_sources_sync_saugiai' ) ) { ps_sources_sync_saugiai( $pid ); }
		elseif ( class_exists( 'Petshop_Sources' ) ) { Petshop_Sources::sinchronizuoti( $pid, false ); }
	}

	public static function gauta( $pid, $kiekis, $likutis ) {
		if ( (int) $pid <= 0 ) { return; }
		if ( ! self::$laukia ) { add_action( 'shutdown', array( __CLASS__, 'vykdyti' ), 5 ); }
		self::$laukia[ (int) $pid ] = 1;
	}

	public static function vykdyti() {
		$visi = array();
		foreach ( array_keys( self::$laukia ) as $pid ) { $visi[ $pid ] = self::perrusiuoti( $pid, false ); }
		self::$laukia = array();
		update_option( 'ps_gavimo_perrus_pask', array( 'laikas' => current_time( 'mysql' ), 'rez' => $visi ), false );
	}

	/** Prekės ID + jos DP pakai. */
	public static function prekes_ir_pakai( $pid ) {
		global $wpdb;
		$ids = array( (int) $pid );
		$pakai = $wpdb->get_col( $wpdb->prepare( "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key='_dp_base_product_id' AND meta_value=%s", (string) (int) $pid ) );
		foreach ( $pakai as $x ) { $ids[] = (int) $x; }
		return array_unique( $ids );
	}

	/** Atviri apmokėti užsakymai su šios prekės (ar pako) eilutėmis, kurių šaltinis ne AV. */
	public static function kandidatai( $pid ) {
		global $wpdb; $p = $wpdb->prefix;
		$ids = self::prekes_ir_pakai( $pid );
		$in = implode( ',', array_map( 'intval', $ids ) );
		$rows = $wpdb->get_results( "SELECT l.order_id, l.order_item_id, l.product_id FROM {$p}wc_order_product_lookup l JOIN {$p}wc_orders o ON o.id=l.order_id WHERE l.product_id IN ($in) AND o.type='shop_order' AND o.status IN ('wc-processing') ORDER BY l.order_id", ARRAY_A );
		$out = array();
		foreach ( $rows as $r ) {
			$o = wc_get_order( $r['order_id'] ); if ( ! $o || $o->get_meta( '_petshop_test' ) ) { continue; }
			$it = $o->get_item( $r['order_item_id'] ); if ( ! $it ) { continue; }
			$src = (string) $it->get_meta( '_ps_source' );
			if ( 'av' === $src || '' === $src ) { continue; } // AV jau; be šaltinio — dar nerūšiuota, rūšiavimas pats paims AV
			$out[] = array( 'order' => $o, 'iid' => (int) $r['order_item_id'], 'pid' => (int) $r['product_id'], 'q' => (int) $it->get_quantity(), 'src' => $src, 'nr' => $o->get_order_number() );
		}
		return $out;
	}

	public static function perrusiuoti( $pid, $dry = false ) {
		$rez = array( 'pid' => (int) $pid, 'eil' => array() );
		if ( ! class_exists( 'Petshop_Darbalaukis' ) ) { $rez['klaida'] = 'darbalaukio nėra'; return $rez; }
		$kand = self::kandidatai( $pid );
		if ( ! $kand ) { return $rez; }
		$rc = new ReflectionClass( 'Petshop_Darbalaukis' ); $m = $rc->getMethod( 'keisti_kelia' ); $m->setAccessible( true );
		$u = (object) array( 'display_name' => 'Gavimas (automatas)', 'ID' => 0 );
		foreach ( $kand as $k ) {
			$e = array( 'nr' => $k['nr'], 'iid' => $k['iid'], 'pid' => $k['pid'], 'q' => $k['q'], 'buvo' => $k['src'] );
			if ( $dry ) { $mi = method_exists( 'Petshop_AV_Source', 'ar_misrus' ) ? Petshop_AV_Source::ar_misrus( $k['order'] ) : false; $rr = method_exists( 'Petshop_AV_Source', 'parinkti' ) ? Petshop_AV_Source::parinkti( $k['pid'], $k['q'], $mi ) : null; $e['dry'] = $rr ? ( $rr['source'] . ' — ' . $rr['reason'] ) : 'kandidatas'; $rez['eil'][] = $e; continue; }
			// Prieš keičiant — ar AV dar užtenka (ankstesnės eilutės galėjo nurašyti)?
			$misrus = method_exists( 'Petshop_AV_Source', 'ar_misrus' ) ? Petshop_AV_Source::ar_misrus( $k['order'] ) : false;
			$r = class_exists( 'Petshop_AV_Source' ) ? ( method_exists( 'Petshop_AV_Source', 'parinkti' ) ? Petshop_AV_Source::parinkti( $k['pid'], $k['q'], $misrus ) : Petshop_AV_Source::resolve( $k['pid'], $k['q'] ) ) : null;
			if ( ! $r || 'av' !== $r['source'] ) { $e['praleista'] = $r ? $r['reason'] : 'resolverio nėra'; $rez['eil'][] = $e; continue; }
			try {
				$o = wc_get_order( $k['order']->get_id() );
				$x = $m->invoke( null, $o, $k['iid'], 'av', $u );
				$e['rez'] = is_array( $x ) ? implode( ': ', $x ) : (string) $x;
				if ( is_array( $x ) && 'dl_kelias' === $x[0] ) { $o = wc_get_order( $o->get_id() ); $o->add_order_note( 'Gavimas: prekė atvyko į AV — eilutė perkelta į Avesa sandėlį automatiškai (S1676).', false, true ); $o->save(); }
			} catch ( Throwable $ex ) { $e['klaida'] = $ex->getMessage(); }
			$rez['eil'][] = $e;
		}
		return $rez;
	}
}
Petshop_Gavimo_Perrusiavimas::init();
