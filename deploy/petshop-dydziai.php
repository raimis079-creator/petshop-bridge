<?php
/**
 * Plugin Name: Petshop Dydziai
 * Description: Dydzio pasirinkimas prekes puslapyje. Dydis pas mus NERA variacija —
 *              kiekvienas dydis yra atskira preke (taip veikia maistas, kraikai, DP pakai).
 *              Todel pirkejui reikia matomos jungties tarp broliu; be jos jis,
 *              atsidares M, i L nepatenka niekaip.
 * Version: 1.0
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Dydziai {

	const META = '_ps_dydzio_seima';

	/** Rikiavimo tvarka. Nezinomi dydziai keliauja i gala, abeceles tvarka. */
	const EILE = array( 'xs' => 1, 's' => 2, 'm' => 3, 'l' => 4, 'xl' => 5, 'xxl' => 6 );

	public static function start() {
		add_action( 'woocommerce_single_product_summary', array( __CLASS__, 'pieskime' ), 25 );
	}

	/** Seimos nariai: publish arba dabartine preke (kad juodrastyje irgi matytum). */
	public static function nariai( $seima, $dabartinis ) {
		global $wpdb;
		$ids = $wpdb->get_col( $wpdb->prepare(
			"SELECT p.ID FROM {$wpdb->posts} p
			   JOIN {$wpdb->postmeta} m ON m.post_id = p.ID AND m.meta_key = %s
			  WHERE p.post_type = 'product' AND m.meta_value = %s
			    AND ( p.post_status = 'publish' OR p.ID = %d )",
			self::META, $seima, (int) $dabartinis ) );
		return array_map( 'intval', (array) $ids );
	}

	/** Dydzio uzrasas: pirma pa_dydis, po to pa_pakuotes_dydis. */
	public static function uzrasas( $pid ) {
		foreach ( array( 'pa_dydis', 'pa_pakuotes_dydis' ) as $tx ) {
			if ( ! taxonomy_exists( $tx ) ) { continue; }
			$n = wp_get_object_terms( $pid, $tx, array( 'fields' => 'names' ) );
			if ( ! is_wp_error( $n ) && $n ) { return (string) $n[0]; }
		}
		return '';
	}

	public static function svoris( $u ) {
		$k = mb_strtolower( trim( $u ) );
		if ( isset( self::EILE[ $k ] ) ) { return array( 0, self::EILE[ $k ], '' ); }
		/* „10 l", „2,5 kg" — rikiuojam pagal skaiciu, ne pagal teksta */
		if ( preg_match( '/([\d]+(?:[.,][\d]+)?)/u', $k, $m ) ) {
			return array( 1, (float) str_replace( ',', '.', $m[1] ), $k );
		}
		return array( 2, 0, $k );
	}

	public static function pieskime() {
		global $product;
		if ( ! $product instanceof WC_Product ) { return; }
		$pid   = $product->get_id();
		$seima = get_post_meta( $pid, self::META, true );
		if ( ! $seima ) { return; }

		$ids = self::nariai( $seima, $pid );
		if ( count( $ids ) < 2 ) { return; }   /* vienas narys — bloko nereikia */

		$eil = array();
		foreach ( $ids as $id ) {
			$u = self::uzrasas( $id );
			if ( $u === '' ) { continue; }
			$p = wc_get_product( $id );
			$eil[] = array(
				'id'    => $id,
				'uzr'   => $u,
				'url'   => get_permalink( $id ),
				'yra'   => $p ? $p->is_in_stock() : false,
				'sort'  => self::svoris( $u ),
			);
		}
		if ( count( $eil ) < 2 ) { return; }
		usort( $eil, function ( $a, $b ) { return $a['sort'] <=> $b['sort']; } );

		echo '<div class="ps-dydziai"><span class="ps-dydziai__et">Dydis</span><div class="ps-dydziai__sar">';
		foreach ( $eil as $x ) {
			$kl = 'ps-dydis';
			if ( $x['id'] === $pid ) { $kl .= ' ps-dydis--dabar'; }
			if ( ! $x['yra'] ) { $kl .= ' ps-dydis--nera'; }
			if ( $x['id'] === $pid ) {
				echo '<span class="' . esc_attr( $kl ) . '">' . esc_html( $x['uzr'] ) . '</span>';
			} else {
				echo '<a class="' . esc_attr( $kl ) . '" href="' . esc_url( $x['url'] ) . '">'
				   . esc_html( $x['uzr'] ) . '</a>';
			}
		}
		echo '</div></div>';

		echo '<style>
		.ps-dydziai{margin:14px 0 6px}
		.ps-dydziai__et{display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:#333}
		.ps-dydziai__sar{display:flex;flex-wrap:wrap;gap:6px}
		.ps-dydis{display:inline-block;min-width:42px;text-align:center;padding:7px 12px;
			border:1px solid #cfd6d2;border-radius:4px;font-size:14px;line-height:1;
			color:#1d2422;text-decoration:none;background:#fff}
		a.ps-dydis:hover{border-color:#1f7a4d;color:#1f7a4d}
		.ps-dydis--dabar{border-color:#1f7a4d;background:#1f7a4d;color:#fff;font-weight:600}
		.ps-dydis--nera{opacity:.45;text-decoration:line-through}
		</style>';
	}
}
Petshop_Dydziai::start();
