<?php
/**
 * Plugin Name: Petshop Dydziai v2.0 (pakuočių lentelė prekės puslapyje)
 * Description: Dydis pas mus NĖRA variacija — kiekvienas dydis yra atskira prekė (maistas, kraikai, DP pakai). Šeima = bendras
 *   _ps_dydzio_seima raktas. v1.0 (S1720) rodė čipsus; v2.0 (S1721, 2026-09-26, Raimio maketas) — lentelė Dydis · Kaina · €/kg ·
 *   Sutaupai (už kg, lyginant su brangiausiu už kg nariu) · Užtenka (tik kai žinomas augintinio svoris: skaičiuoklė šiame ar
 *   ankstesniame puslapyje, localStorage ps_dydziai_svoris; dienos per Petshop_Feeding_Service::calc kiekvienam nariui, GET ?ps_dydziai_dienos=).
 *   Ženkliukai: „perkamiausias" (pardavimai 365 d. iš ps_ist_fakt_eilutes + ps_fakt_eilutes, transient 12 val.), „geriausia kaina už kg",
 *   DP pakas. Rodoma tik prekėms su šeima (≥ 2 nariai). Išjungti: opcija ps_dydziai_isjungta=1.
 * Version: 2.0
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Dydziai {

	const META = '_ps_dydzio_seima';
	const EILE = array( 'xs' => 1, 's' => 2, 'm' => 3, 'l' => 4, 'xl' => 5, 'xxl' => 6 );

	public static function start() {
		add_action( 'woocommerce_single_product_summary', array( __CLASS__, 'pieskime' ), 25 );
		add_action( 'wp_loaded', array( __CLASS__, 'dienos_endpoint' ), 2 );
	}

	/** Šeimos nariai: publish arba dabartinė prekė. */
	public static function nariai( $seima, $dabartinis = 0 ) {
		global $wpdb;
		$ids = $wpdb->get_col( $wpdb->prepare(
			"SELECT p.ID FROM {$wpdb->posts} p JOIN {$wpdb->postmeta} m ON m.post_id = p.ID AND m.meta_key = %s
			  WHERE p.post_type = 'product' AND m.meta_value = %s AND ( p.post_status = 'publish' OR p.ID = %d )",
			self::META, $seima, (int) $dabartinis ) );
		return array_map( 'intval', (array) $ids );
	}

	/** Dydžio užrašas: pa_dydis, po to pa_pakuotes_dydis; DP pakui pridedam „N ×". */
	public static function uzrasas( $pid ) {
		$u = '';
		foreach ( array( 'pa_dydis', 'pa_pakuotes_dydis' ) as $tx ) {
			if ( ! taxonomy_exists( $tx ) ) { continue; }
			$n = wp_get_object_terms( $pid, $tx, array( 'fields' => 'names' ) );
			if ( ! is_wp_error( $n ) && $n ) { $u = (string) $n[0]; break; }
		}
		$qty = (int) get_post_meta( $pid, '_dp_pack_qty', true );
		if ( $qty > 1 && $u !== '' && ! preg_match( '/[×x]\s*\d|\d\s*[×x]/iu', $u ) ) { $u = $qty . ' × ' . $u; }
		return $u;
	}

	/** Svoris kg iš užrašo („7 kg × 2", „2 × 2 kg", „800 g", „15+3 kg", „6 l (2,5 kg)"); 0 jei nėra. Litrai — antras elementas. */
	public static function kg( $u ) {
		$k = mb_strtolower( str_replace( ',', '.', trim( $u ) ) );
		$mult = 1;
		if ( preg_match( '/(\d+)\s*[×x]/u', $k, $m ) || preg_match( '/[×x]\s*(\d+)\s*$/u', $k, $m ) ) { $mult = max( 1, (int) $m[1] ); }
		$kg = 0.0; $l = 0.0;
		if ( preg_match( '/(\d+(?:\.\d+)?)\s*\+\s*(\d+(?:\.\d+)?)\s*(kg|g)\b/u', $k, $m ) ) { $kg = ( (float) $m[1] + (float) $m[2] ) / ( $m[3] === 'g' ? 1000 : 1 ); }
		elseif ( preg_match_all( '/(\d+(?:\.\d+)?)\s*(kg|g|l|ml)\b/u', $k, $mm, PREG_SET_ORDER ) ) {
			foreach ( $mm as $x ) { $v = (float) $x[1];
				if ( $x[2] === 'kg' && ! $kg ) { $kg = $v; } elseif ( $x[2] === 'g' && ! $kg ) { $kg = $v / 1000; }
				elseif ( $x[2] === 'l' && ! $l ) { $l = $v; } elseif ( $x[2] === 'ml' && ! $l ) { $l = $v / 1000; } }
		}
		return array( round( $kg * $mult, 3 ), round( $l * $mult, 3 ) );
	}

	public static function rikiavimas( $u ) {
		$k = mb_strtolower( trim( $u ) );
		if ( isset( self::EILE[ $k ] ) ) { return array( 0, self::EILE[ $k ], '' ); }
		list( $kg, $l ) = self::kg( $k );
		if ( $kg > 0 || $l > 0 ) { return array( 1, $kg > 0 ? $kg : $l, $k ); }
		if ( preg_match( '/([\d]+(?:[.,][\d]+)?)/u', $k, $m ) ) { return array( 1, (float) str_replace( ',', '.', $m[1] ), $k ); }
		return array( 2, 0, $k );
	}

	/** Pardavimai per narį (vnt., 365 d.: istorija + WC), transient 12 val. */
	public static function pardavimai( $seima, $ids ) {
		$key = 'ps_dydz_pard_' . md5( $seima . implode( ',', $ids ) );
		$c = get_transient( $key ); if ( is_array( $c ) ) { return $c; }
		global $wpdb; $out = array_fill_keys( $ids, 0 ); $in = implode( ',', array_map( 'intval', $ids ) );
		try {
			foreach ( array( 'ps_ist_fakt_eilutes', 'ps_fakt_eilutes' ) as $t ) {
				if ( ! $wpdb->get_var( "SHOW TABLES LIKE '{$wpdb->prefix}$t'" ) ) { continue; }
				$rows = $wpdb->get_results( "SELECT preke_id, SUM(kiekis) q FROM {$wpdb->prefix}$t WHERE preke_id IN ($in) AND COALESCE(testinis,0)=0 AND diena >= DATE_SUB(CURDATE(), INTERVAL 365 DAY) GROUP BY preke_id", ARRAY_A );
				foreach ( (array) $rows as $r ) { $out[ (int) $r['preke_id'] ] = ( $out[ (int) $r['preke_id'] ] ?? 0 ) + (int) $r['q']; }
			}
		} catch ( \Throwable $e ) {}
		set_transient( $key, $out, 12 * HOUR_IN_SECONDS );
		return $out;
	}

	/** Šeimos eilutės (bendra kortelei ir lentelei). */
	public static function eilutes( $seima, $pid = 0 ) {
		$ids = self::nariai( $seima, $pid );
		if ( count( $ids ) < 2 ) { return array(); }
		$pard = self::pardavimai( $seima, $ids );
		$eil = array();
		foreach ( $ids as $id ) {
			$u = self::uzrasas( $id ); if ( $u === '' ) { continue; }
			$p = wc_get_product( $id ); if ( ! $p ) { continue; }
			list( $kg, $l ) = self::kg( $u );
			$price = (float) wc_get_price_to_display( $p );
			$eil[] = array( 'id' => $id, 'uzr' => $u, 'url' => get_permalink( $id ), 'yra' => $p->is_in_stock(), 'kaina' => $price,
				'kaina_html' => $p->get_price_html(), 'kg' => $kg, 'l' => $l, 'perkg' => ( $kg > 0 && $price > 0 ) ? $price / $kg : 0,
				'dp' => (int) get_post_meta( $id, '_dp_pack_qty', true ) > 1, 'pard' => (int) ( $pard[ $id ] ?? 0 ), 'sort' => self::rikiavimas( $u ), 'pav' => $p->get_name() );
		}
		if ( count( $eil ) < 2 ) { return array(); }
		usort( $eil, function ( $a, $b ) { return $a['sort'] <=> $b['sort']; } );
		$perkg = array_filter( array_column( $eil, 'perkg' ) );
		$max = $perkg ? max( $perkg ) : 0; $min = $perkg ? min( $perkg ) : 0;
		$top = 0; $topq = 0; foreach ( $eil as $x ) { if ( $x['pard'] > $topq ) { $topq = $x['pard']; $top = $x['id']; } }
		foreach ( $eil as &$x ) {
			$x['sutaupai'] = ( $x['perkg'] > 0 && $max > 0 && $x['perkg'] < $max - 0.001 ) ? (int) round( ( 1 - $x['perkg'] / $max ) * 100 ) : 0;
			$x['geriausia'] = $x['perkg'] > 0 && $min > 0 && abs( $x['perkg'] - $min ) < 0.001 && count( $perkg ) > 1;
			$x['perkamiausias'] = ( $top === $x['id'] && $topq >= 5 );
		} unset( $x );
		return $eil;
	}

	public static function rusis( $pid ) {
		$sp = wp_get_object_terms( $pid, 'pa_gyvuno_rusis', array( 'fields' => 'slugs' ) );
		return ( ! is_wp_error( $sp ) && in_array( 'katems', (array) $sp, true ) ) ? 'cat' : 'dog';
	}

	/** GET ?ps_dydziai_dienos=<pid>&w=<kg> → JSON {id: [days_min, days_max]} kiekvienam šeimos nariui (Feeding_Service::calc). */
	public static function dienos_endpoint() {
		if ( ! isset( $_GET['ps_dydziai_dienos'] ) ) { return; }
		$pid = absint( $_GET['ps_dydziai_dienos'] ); $w = (float) str_replace( ',', '.', (string) ( $_GET['w'] ?? '' ) );
		nocache_headers(); header( 'Content-Type: application/json; charset=utf-8' );
		$out = array( 'w' => $w, 'd' => array() );
		$FS = class_exists( 'Petshop_Feeding_Service' ) ? 'Petshop_Feeding_Service' : ( class_exists( 'Feeding_Service' ) ? 'Feeding_Service' : '' );
		if ( $pid && $w > 0 && $w < 200 && $FS ) {
			$seima = (string) get_post_meta( $pid, self::META, true ); $sp = self::rusis( $pid );
			foreach ( $seima ? self::nariai( $seima, $pid ) : array( $pid ) as $id ) {
				try {
					$base = (int) get_post_meta( $id, '_dp_base_product_id', true ); $qty = max( 1, (int) get_post_meta( $id, '_dp_pack_qty', true ) );
					$c = call_user_func( array( $FS, 'calc' ), array( 'product_id' => $base ?: $id, 'weight_kg' => $w, 'species_code' => $sp ) ); // DP pakui — bazinė prekė × kiekis
					if ( is_array( $c ) && ! empty( $c['days_min'] ) ) { $out['d'][ $id ] = array( (int) round( $c['days_min'] * $qty ), (int) round( ( $c['days_max'] ?: $c['days_min'] ) * $qty ), isset( $c['norm_min_g'] ) ? (int) $c['norm_min_g'] : null, isset( $c['norm_max_g'] ) ? (int) $c['norm_max_g'] : null ); }
				} catch ( \Throwable $e ) {}
			}
		}
		echo wp_json_encode( $out ); exit;
	}

	private static function eur( $v ) { return number_format( (float) $v, 2, ',', ' ' ); }

	public static function pieskime() {
		global $product;
		if ( ! $product instanceof WC_Product || get_option( 'ps_dydziai_isjungta' ) ) { return; }
		$pid = $product->get_id(); $seima = get_post_meta( $pid, self::META, true );
		if ( ! $seima ) { return; }
		$eil = self::eilutes( $seima, $pid ); if ( ! $eil ) { return; }
		$su_kg = count( array_filter( array_column( $eil, 'perkg' ) ) ) >= 2;
		$gyv = self::rusis( $pid ) === 'cat' ? 'katei' : 'šuniui';
		echo '<div class="ps-pak" id="ps-pak" data-pid="' . (int) $pid . '" data-gyv="' . esc_attr( $gyv ) . '">';
		echo '<div class="ps-pak__head"><span class="ps-pak__t">Pakuotė</span><span class="ps-pak__sv"><a href="#ps-calc" class="ps-pak__calc">Kiek užteks jūsų ' . esc_html( $gyv ) . '? → įveskite svorį</a></span></div>';
		echo '<div class="ps-pak__wrap"><table class="ps-pak__t"><thead><tr><th>Dydis</th><th class="n">Kaina</th>' . ( $su_kg ? '<th class="n">€/kg</th><th class="n">Sutaupai</th>' : '' ) . '<th class="n ps-pak__dcol" hidden>Užtenka</th></tr></thead><tbody>';
		foreach ( $eil as $x ) {
			$cur = $x['id'] === $pid; $cls = 'ps-pak__r' . ( $cur ? ' ps-pak__r--cur' : '' ) . ( $x['yra'] ? '' : ' ps-pak__r--nera' );
			$zym = ''; if ( $x['perkamiausias'] ) { $zym .= '<span class="ps-pak__bd ps-pak__bd--pop">perkamiausias</span>'; } if ( $x['geriausia'] ) { $zym .= '<span class="ps-pak__bd ps-pak__bd--best">geriausia kaina už kg</span>'; }
			$dp = $x['dp'] ? '<span class="ps-pak__dp">DP pakas</span>' : '';
			$uz = $cur ? '<span class="ps-pak__sz">' . esc_html( $x['uzr'] ) . '</span>' : '<a class="ps-pak__sz" href="' . esc_url( $x['url'] ) . '">' . esc_html( $x['uzr'] ) . '</a>';
			echo '<tr class="' . esc_attr( $cls ) . '" data-id="' . (int) $x['id'] . '" data-kg="' . esc_attr( $x['kg'] ) . '" data-kaina="' . esc_attr( $x['kaina'] ) . '"><td>' . $uz . $dp . $zym . ( $x['yra'] ? '' : '<span class="ps-pak__nera">neturime</span>' ) . '</td>';
			echo '<td class="n">' . wp_kses_post( $x['kaina_html'] ) . '</td>';
			if ( $su_kg ) { echo '<td class="n ps-pak__kg">' . ( $x['perkg'] > 0 ? self::eur( $x['perkg'] ) : '—' ) . '</td><td class="n ps-pak__sut">' . ( $x['sutaupai'] > 0 ? '−' . $x['sutaupai'] . ' % už kg' : '—' ) . '</td>'; }
			echo '<td class="n ps-pak__d" hidden></td></tr>';
		}
		echo '</tbody></table></div></div>';
		self::css_js();
	}

	private static function css_js() {
		static $done = false; if ( $done ) { return; } $done = true;
		echo '<style>
.ps-pak{margin:12px 0 14px;border:1px solid #d9e1dc;border-radius:6px;overflow:hidden}
.ps-pak__head{display:flex;justify-content:space-between;align-items:baseline;gap:10px;padding:8px 10px;background:#eef4f1;font-size:12.5px}
.ps-pak__t{font-weight:700;color:#1d2422}.ps-pak__sv{font-size:11.5px;color:#5b625f}.ps-pak__sv a{color:#1f7a4d;text-decoration:none}.ps-pak__sv a:hover{text-decoration:underline}
.ps-pak__wrap{overflow-x:auto}.ps-pak table.ps-pak__t{border-collapse:collapse;width:100%;font-size:12.5px;margin:0}
.ps-pak th{text-align:left;font-weight:600;color:#6b7b73;font-size:10.5px;letter-spacing:.05em;text-transform:uppercase;padding:6px 8px;border-bottom:1px solid #e3e7e4;white-space:nowrap;background:#fff}
.ps-pak td{padding:7px 8px;border-bottom:1px solid #eef1ef;vertical-align:top;line-height:1.4}.ps-pak tr:last-child td{border-bottom:0}
.ps-pak .n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}.ps-pak__kg{color:#777}.ps-pak__sut{color:#1f7a4d;font-weight:600}
.ps-pak__r--cur td{background:#f3f8f5}.ps-pak__r--cur .ps-pak__sz{font-weight:700;color:#1f7a4d}.ps-pak__r--nera .ps-pak__sz{opacity:.55;text-decoration:line-through}
.ps-pak__sz{display:inline-block;margin-right:6px;color:#1d2422}a.ps-pak__sz:hover{color:#1f7a4d}
.ps-pak__dp,.ps-pak__nera{font-size:10px;color:#7d8983;text-transform:uppercase;letter-spacing:.04em;margin-right:6px}
.ps-pak__bd{display:inline-block;font-size:10px;line-height:1;padding:3px 6px;border-radius:3px;margin:2px 4px 0 0;font-weight:600;white-space:nowrap}
.ps-pak__bd--pop{background:#fff4dd;color:#9a6a12}.ps-pak__bd--best{background:#e2f0d9;color:#256b3f}
.ps-pak__d small{display:block;font-size:10.5px;color:#777;font-weight:400}
.ps-pak td .amount{font-weight:600}.ps-pak td del .amount{font-weight:400}
@media (max-width:480px){.ps-pak th,.ps-pak td{padding:6px 5px;font-size:12px}}
</style>
<script>(function(){var P=document.getElementById("ps-pak");if(!P)return;var K="ps_dydziai_svoris",pid=P.getAttribute("data-pid"),gyv=P.getAttribute("data-gyv"),sv=P.querySelector(".ps-pak__sv"),lock=null;
function get(){try{var v=parseFloat(localStorage.getItem(K));return v>0?v:null}catch(e){return null}}function set(v){try{localStorage.setItem(K,String(v))}catch(e){}}
function txt(a,b){if(b>=45){var f=function(d){return (d/30.4).toFixed(1).replace(".",",")};return "~"+f(a)+"–"+f(b)+" mėn."}return "~"+a+"–"+b+" d."}
function fill(w){if(lock===w)return;lock=w;fetch("/?ps_dydziai_dienos="+pid+"&w="+encodeURIComponent(w),{credentials:"same-origin"}).then(function(r){return r.json()}).then(function(j){var d=j.d||{},any=false;
P.querySelectorAll("tr.ps-pak__r").forEach(function(tr){var c=tr.querySelector(".ps-pak__d"),x=d[tr.getAttribute("data-id")];if(!c)return;if(x&&x[0]){any=true;var k=parseFloat(tr.getAttribute("data-kaina")),h=txt(x[0],x[1]);if(k>0){h+="<small>"+(k/x[1]).toFixed(2).replace(".",",")+"–"+(k/x[0]).toFixed(2).replace(".",",")+" €/d.</small>"}c.innerHTML=h;c.hidden=false}else{c.innerHTML="—";c.hidden=false}});
var th=P.querySelector(".ps-pak__dcol");if(any){if(th)th.hidden=false;sv.innerHTML="„Užtenka“ — "+String(w).replace(".",",")+" kg "+gyv+" · <a href=\\"#ps-calc\\" class=\\"ps-pak__calc\\">keisti svorį</a>"}else{lock=null}}).catch(function(){lock=null})}
var w0=get();if(w0)fill(w0);
function bind(){var inp=document.getElementById("ps-calc-w"),calc=document.getElementById("ps-calc");if(!inp||!calc)return;var mo=new MutationObserver(function(){var v=parseFloat(String(inp.value).replace(",","."));if(v>0&&calc.querySelector(".ps-calc-res")){set(v);fill(v)}});mo.observe(calc,{childList:true,subtree:true})}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind);else bind();
P.addEventListener("click",function(e){var a=e.target.closest(".ps-pak__calc");if(!a)return;var c=document.getElementById("ps-calc");if(c){e.preventDefault();c.scrollIntoView({behavior:"smooth",block:"center"});var i=document.getElementById("ps-calc-w");if(i)setTimeout(function(){i.focus()},400)}});
})();</script>';
	}
}
Petshop_Dydziai::start();
