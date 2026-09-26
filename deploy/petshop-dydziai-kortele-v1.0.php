<?php
/**
 * Plugin Name: Petshop Dydžių kortelė v1.0 (dydžių juosta katalogo kortelėje)
 * Description: S1721 (2026-09-26, Raimio maketas). Prekėms su šeima (_ps_dydzio_seima, Petshop_Dydziai::eilutes) katalogo kortelė
 *   (Flatsome product-small) po kaina gauna dydžių juostą: čipsai su perjungimu vietoje (nuotrauka, pavadinimas, nuoroda, kaina,
 *   €/kg, „Į krepšelį" prekės ID) ir €/kg prie kainos; žalias taškas — pigiausia už kg; neturimi perbraukti. Kiekviena pakuotė
 *   lieka atskira kortele (be katalogo suspaudimo). Šeimos duomenys — transient 20 min. Išjungti: opcija ps_dydziai_kortele_isjungta=1.
 * Version: 1.0
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Dydziu_Kortele {

	private static $js = false;

	public static function init() {
		add_action( 'woocommerce_after_shop_loop_item_title', array( __CLASS__, 'juosta' ), 11 );
		add_action( 'wp_footer', array( __CLASS__, 'js' ), 30 );
	}

	/** Narių duomenys kortelei (transient 20 min. per šeimą). */
	public static function nariai( $seima, $pid ) {
		$key = 'ps_dk_' . md5( $seima ); $c = get_transient( $key );
		if ( ! is_array( $c ) ) {
			$c = array();
			foreach ( Petshop_Dydziai::eilutes( $seima ) as $x ) {
				$img = wp_get_attachment_image_src( get_post_thumbnail_id( $x['id'] ), 'woocommerce_thumbnail' );
				$srcset = get_post_thumbnail_id( $x['id'] ) ? wp_get_attachment_image_srcset( get_post_thumbnail_id( $x['id'] ), 'woocommerce_thumbnail' ) : '';
				$c[] = array( 'id' => $x['id'], 'u' => $x['uzr'], 'url' => $x['url'], 'yra' => $x['yra'] ? 1 : 0, 'ph' => $x['kaina_html'],
					'kg' => $x['perkg'] > 0 ? number_format( $x['perkg'], 2, ',', ' ' ) . ' €/kg' : '', 'best' => $x['geriausia'] ? 1 : 0,
					'img' => $img ? $img[0] : '', 'ss' => $srcset ?: '', 'pav' => $x['pav'], 'sku' => (string) get_post_meta( $x['id'], '_sku', true ) );
			}
			set_transient( $key, $c, 20 * MINUTE_IN_SECONDS );
		}
		return $c;
	}

	public static function juosta() {
		global $product;
		if ( ! $product instanceof WC_Product || get_option( 'ps_dydziai_kortele_isjungta' ) || ! class_exists( 'Petshop_Dydziai' ) ) { return; }
		$pid = $product->get_id(); $seima = get_post_meta( $pid, Petshop_Dydziai::META, true );
		if ( ! $seima ) { return; }
		$n = self::nariai( $seima, $pid ); if ( count( $n ) < 2 ) { return; }
		$cur = null; foreach ( $n as $x ) { if ( $x['id'] === $pid ) { $cur = $x; } }
		echo '<div class="ps-dk" data-cur="' . (int) $pid . '" data-n="' . esc_attr( wp_json_encode( $n ) ) . '">';
		if ( $cur && $cur['kg'] ) { echo '<span class="ps-dk__kg">' . esc_html( $cur['kg'] ) . '</span>'; } else { echo '<span class="ps-dk__kg"></span>'; }
		echo '<span class="ps-dk__c">';
		foreach ( $n as $x ) {
			$cls = 'ps-dk__ch' . ( $x['id'] === $pid ? ' ps-dk__ch--sel' : '' ) . ( $x['best'] ? ' ps-dk__ch--best' : '' ) . ( $x['yra'] ? '' : ' ps-dk__ch--nera' );
			echo '<button type="button" class="' . esc_attr( $cls ) . '" data-id="' . (int) $x['id'] . '" title="' . esc_attr( $x['kg'] ? $x['kg'] : $x['u'] ) . '">' . esc_html( $x['u'] ) . '</button>';
		}
		echo '</span></div>';
		self::$js = true;
	}

	public static function js() {
		if ( ! self::$js ) { return; }
		echo '<style>
.ps-dk{display:flex;flex-direction:column;gap:5px;margin:4px 0 8px}
.ps-dk__kg{font-size:11.5px;color:#777;min-height:1em}
.ps-dk__c{display:flex;flex-wrap:wrap;gap:5px}
.ps-dk__ch{font-size:12px;line-height:1;font-family:inherit;font-weight:400;padding:6px 8px;border:1px solid #cfd6d2;border-radius:4px;background:#fff;color:#1d2422;cursor:pointer;position:relative;margin:0;box-shadow:none;text-transform:none;letter-spacing:0;min-height:0;line-height:1}
.ps-dk__ch:hover{border-color:#1f7a4d;color:#1f7a4d;background:#fff}
.ps-dk__ch--sel,.ps-dk__ch--sel:hover{border-color:#1f7a4d;background:#1f7a4d;color:#fff;font-weight:600}
.ps-dk__ch--best::after{content:"";position:absolute;top:-4px;right:-4px;width:9px;height:9px;border-radius:50%;background:#48b26b;border:2px solid #fff}
.ps-dk__ch--nera{opacity:.5;text-decoration:line-through}
.ps-dk__ch:focus-visible{outline:2px solid #1f7a4d;outline-offset:2px}
.ps-dk-switched .psc-qty-badge,.ps-dk-switched .psc-eco-band{display:none!important}
</style>
<script>(function(){document.addEventListener("click",function(e){var b=e.target.closest(".ps-dk__ch");if(!b)return;e.preventDefault();var dk=b.closest(".ps-dk"),card=b.closest(".product-small.col")||b.closest(".product-small");if(!dk||!card)return;if(!dk.getAttribute("data-orig"))dk.setAttribute("data-orig",dk.getAttribute("data-cur"));var n;try{n=JSON.parse(dk.getAttribute("data-n"))}catch(x){return}var id=parseInt(b.getAttribute("data-id"),10),m=null;for(var i=0;i<n.length;i++){if(n[i].id===id)m=n[i]}if(!m)return;
dk.querySelectorAll(".ps-dk__ch").forEach(function(c){c.classList.toggle("ps-dk__ch--sel",c===b)});dk.setAttribute("data-cur",String(id));
var kg=dk.querySelector(".ps-dk__kg");if(kg)kg.textContent=m.kg||"";
var img=card.querySelector(".box-image img");if(img&&m.img){img.src=m.img;if(m.ss)img.srcset=m.ss;else img.removeAttribute("srcset");img.alt=m.pav}
card.querySelectorAll(".box-image a[href], .product-title a, .name a").forEach(function(a){a.href=m.url});
var t=card.querySelector(".product-title a, .name a");if(t)t.textContent=m.pav;
var pr=card.querySelector(".price-wrapper .price, .price");if(pr)pr.innerHTML=m.ph;
card.querySelectorAll(".add_to_cart_button, a.button[data-product_id]").forEach(function(a){a.setAttribute("data-product_id",String(id));a.setAttribute("data-product_sku",m.sku||"");a.href=a.href.replace(/add-to-cart=\d+/,"add-to-cart="+id);a.setAttribute("aria-label","Įdėti į krepšelį: "+m.pav);a.classList.remove("added","loading");var v=card.querySelector("a.added_to_cart");if(v)v.remove()});
card.querySelectorAll("[data-prod]").forEach(function(q){q.setAttribute("data-prod",String(id))});
var cl=card.className.replace(/\bpost-\d+\b/,"post-"+id);card.className=cl;card.classList.toggle("ps-dk-switched",String(id)!==dk.getAttribute("data-orig"));
});})();</script>';
	}
}
Petshop_Dydziu_Kortele::init();
