<?php
/**
 * Plugin Name: Petshop Atributai
 * Description: VIENINTELE vieta, kur kuriamos ir tvarkomos atributu reiksmes.
 *              Priezastis paprasta: kol reiksme galima irasyti bet kur, po
 *              pusmecio kataloge gyvena XXL, xxl ir Xxl, o filtras rodo tris
 *              eilutes to paties dydzio. Cia reiksme praeina normalizavima,
 *              dublikatu patikra ir slug sargyba PRIES atsirasdama.
 * Version: 1.0
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Atributai {

	/** Dydziu taksonomijos rasomos DIDZIOSIOMIS, visos kitos — pirma didzioji. */
	const DIDZIOSIOS = array( 'pa_dydis', 'pa_veisles_dydis' );

	public static function start() {
		add_action( 'admin_menu', array( __CLASS__, 'meniu' ), 30 );
		add_action( 'wp_ajax_ps_atr', array( __CLASS__, 'ajax' ) );
	}

	public static function meniu() {
		add_submenu_page( 'ps-katalogas', 'Atributai', 'Atributai',
			'manage_woocommerce', 'ps-atributai', array( __CLASS__, 'langas' ) );
	}

	/* ---------------- NORMALIZAVIMAS ---------------- */

	/**
	 * Viena funkcija visoms vietoms. Jei atsiras antra — turesim dvi tiesas
	 * apie ta pacia reiksme, ir tai bus blogiau nei dabartine padetis.
	 */
	public static function normalizuoti( $reiksme, $tax ) {
		$s = trim( preg_replace( '/\s+/u', ' ', (string) $reiksme ) );
		if ( $s === '' ) { return ''; }
		/* skaicius ir vienetas visada atskirti tarpu: „10l" -> „10 l" */
		$s = preg_replace( '/(\d)\s*(kg|g|l|ml|cm|mm|vnt)\b/iu', '$1 $2', $s );
		if ( in_array( $tax, self::DIDZIOSIOS, true ) && preg_match( '/^[a-zA-Z]{1,3}$/', $s ) ) {
			return mb_strtoupper( $s );
		}
		/* pirma raide didzioji, likusios nekeiciamos — „Jūros vandens", ne „Jūros Vandens" */
		return mb_strtoupper( mb_substr( $s, 0, 1 ) ) . mb_substr( $s, 1 );
	}

	/** Palyginimo forma — pagal ja gaudom dublikatus, ne pagal rasyba. */
	public static function raktas( $reiksme ) {
		$s = mb_strtolower( trim( preg_replace( '/\s+/u', ' ', (string) $reiksme ) ) );
		return str_replace( ',', '.', $s );
	}

	/** Taksonomijos, kurias valdom. */
	public static function taksonomijos() {
		global $wpdb;
		$t = $wpdb->get_col( "SELECT DISTINCT taxonomy FROM {$wpdb->term_taxonomy}
			WHERE taxonomy LIKE 'pa\\_%' ORDER BY taxonomy" );
		return array_values( (array) $t );
	}

	/* ---------------- HIGIENA ---------------- */

	public static function higiena( $tax ) {
		$t = get_terms( array( 'taxonomy' => $tax, 'hide_empty' => false ) );
		if ( is_wp_error( $t ) ) { return array(); }
		$pagal = array(); $slugai = array(); $didz = 0; $maz = 0;
		foreach ( $t as $x ) {
			$pagal[ self::raktas( $x->name ) ][] = $x->name;
			$slugai[ sanitize_title( $x->name ) ][] = $x->name;
			$p = mb_substr( trim( $x->name ), 0, 1 );
			if ( preg_match( '/\p{L}/u', $p ) ) {
				if ( mb_strtoupper( $p ) === $p ) { $didz++; } else { $maz++; }
			}
		}
		$dub = array(); foreach ( $pagal as $g ) { if ( count( $g ) > 1 ) { $dub[] = $g; } }
		$kol = array(); foreach ( $slugai as $s => $g ) { if ( count( $g ) > 1 ) { $kol[ $s ] = $g; } }
		return array(
			'terminu'   => count( $t ),
			'dublikatai'=> $dub,
			'kolizijos' => $kol,
			'marguma'   => ( $didz > 0 && $maz > 0 ) ? array( 'didz' => $didz, 'maz' => $maz ) : null,
		);
	}

	/* ---------------- KURIMAS ---------------- */

	/**
	 * Grazina array su „ok" arba „klaida". NIEKADA nekuria tyliai su
	 * galune „-2": jei slug'as uzimtas KITO pavadinimo, sustojam ir
	 * praSom aiskaus. Butent tai 2026-06 kainavo „1,5 kg" ir „15 kg".
	 */
	public static function kurti( $tax, $reiksme, $slug = '', $hex = '' ) {
		if ( ! taxonomy_exists( $tax ) ) { return array( 'klaida' => 'Tokios taksonomijos nėra.' ); }
		$vardas = self::normalizuoti( $reiksme, $tax );
		if ( $vardas === '' ) { return array( 'klaida' => 'Tuščia reikšmė.' ); }

		/* 1) dublikatas pagal palyginimo forma */
		$raktas = self::raktas( $vardas );
		foreach ( (array) get_terms( array( 'taxonomy' => $tax, 'hide_empty' => false ) ) as $x ) {
			if ( self::raktas( $x->name ) === $raktas ) {
				return array( 'klaida' => 'Tokia reikšmė jau yra: „' . $x->name . '" (#' . $x->term_id . '). '
					. 'Naudok ją, o ne kurk naują.' );
			}
		}
		/* 2) slug sargyba */
		$sl = $slug !== '' ? sanitize_title( $slug ) : sanitize_title( $vardas );
		$uzimtas = get_term_by( 'slug', $sl, $tax );
		if ( $uzimtas ) {
			return array( 'klaida' => 'Nuorodos vardas „' . $sl . '" jau priklauso reikšmei „'
				. $uzimtas->name . '". Įrašyk kitą nuorodos vardą — automatiškai su galūne nekuriame, '
				. 'nes tada dvi skirtingos reikšmės atrodytų vienodai.' );
		}
		$n = wp_insert_term( $vardas, $tax, array( 'slug' => $sl ) );
		if ( is_wp_error( $n ) ) { return array( 'klaida' => $n->get_error_message() ); }
		$id = (int) $n['term_id'];
		if ( $tax === 'pa_spalva' && $hex !== '' && preg_match( '/^#[0-9a-fA-F]{6}$/', $hex ) ) {
			foreach ( array( 'product_attribute_color', '_variation_swatch_color', 'color' ) as $mk ) {
				update_term_meta( $id, $mk, $hex );
			}
		}
		return array( 'ok' => true, 'id' => $id, 'vardas' => $vardas, 'slug' => $sl );
	}

	/** Pervadinimas. Slug NEKEICIAMAS — jis indeksuotas ir gyvena nuorodose. */
	public static function pervadinti( $id, $vardas ) {
		$t = get_term( (int) $id );
		if ( ! $t || is_wp_error( $t ) ) { return array( 'klaida' => 'Nėra tokios reikšmės.' ); }
		$naujas = self::normalizuoti( $vardas, $t->taxonomy );
		if ( $naujas === '' ) { return array( 'klaida' => 'Tuščia reikšmė.' ); }
		$raktas = self::raktas( $naujas );
		foreach ( (array) get_terms( array( 'taxonomy' => $t->taxonomy, 'hide_empty' => false ) ) as $x ) {
			if ( (int) $x->term_id !== (int) $id && self::raktas( $x->name ) === $raktas ) {
				return array( 'klaida' => 'Tokia reikšmė jau yra: „' . $x->name . '".' );
			}
		}
		$u = wp_update_term( (int) $id, $t->taxonomy, array( 'name' => $naujas ) );
		if ( is_wp_error( $u ) ) { return array( 'klaida' => $u->get_error_message() ); }
		return array( 'ok' => true, 'vardas' => $naujas );
	}

	/* ---------------- AJAX ---------------- */

	public static function ajax() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'Neturi teisių.' ); }
		check_ajax_referer( 'ps_atr' );
		$v = isset( $_POST['v'] ) ? sanitize_text_field( wp_unslash( $_POST['v'] ) ) : '';
		$tax = isset( $_POST['tax'] ) ? sanitize_text_field( wp_unslash( $_POST['tax'] ) ) : '';
		if ( $v === 'kurti' ) {
			$r = self::kurti( $tax,
				wp_unslash( $_POST['reiksme'] ?? '' ),
				sanitize_text_field( wp_unslash( $_POST['slug'] ?? '' ) ),
				sanitize_text_field( wp_unslash( $_POST['hex'] ?? '' ) ) );
		} elseif ( $v === 'pervadinti' ) {
			$r = self::pervadinti( (int) ( $_POST['id'] ?? 0 ), wp_unslash( $_POST['reiksme'] ?? '' ) );
		} elseif ( $v === 'perziura' ) {
			$r = array( 'ok' => true,
				'vardas' => self::normalizuoti( wp_unslash( $_POST['reiksme'] ?? '' ), $tax ),
				'slug'   => sanitize_title( self::normalizuoti( wp_unslash( $_POST['reiksme'] ?? '' ), $tax ) ) );
		} else { $r = array( 'klaida' => 'Nežinomas veiksmas.' ); }
		if ( isset( $r['klaida'] ) ) { wp_send_json_error( $r['klaida'] ); }
		wp_send_json_success( $r );
	}

	/* ---------------- LANGAS ---------------- */

	public static function langas() {
		$tax = isset( $_GET['tax'] ) ? sanitize_text_field( wp_unslash( $_GET['tax'] ) ) : '';
		$visos = self::taksonomijos();
		if ( ! $tax || ! in_array( $tax, $visos, true ) ) { $tax = $visos ? $visos[0] : ''; }

		echo '<div class="wrap ps-atr"><h1>Atributai</h1>';
		echo '<p class="ps-atr-x">Reikšmės kuriamos <b>tik čia</b>. Prieš atsirasdama reikšmė '
			. 'sutvarkoma, patikrinama, ar tokios dar nėra, ir tikrinamas nuorodos vardas.</p>';

		echo '<div class="ps-atr-tax">';
		foreach ( $visos as $t ) {
			$h = self::higiena( $t );
			$zyme = ( $h['dublikatai'] || $h['kolizijos'] ) ? ' ●' : '';
			echo '<a class="' . ( $t === $tax ? 'on' : '' ) . '" href="'
				. esc_url( admin_url( 'admin.php?page=ps-atributai&tax=' . $t ) ) . '">'
				. esc_html( str_replace( 'pa_', '', $t ) )
				. ' <i>' . (int) $h['terminu'] . '</i>' . $zyme . '</a>';
		}
		echo '</div>';

		if ( ! $tax ) { echo '<p>Atributų nėra.</p></div>'; return; }
		$h = self::higiena( $tax );

		if ( $h['dublikatai'] || $h['kolizijos'] || $h['marguma'] ) {
			echo '<div class="ps-atr-persp"><b>Higiena</b><ul>';
			foreach ( $h['dublikatai'] as $g ) {
				echo '<li>Ta pati reikšmė kelis kartus: ' . esc_html( implode( ' · ', $g ) ) . '</li>';
			}
			foreach ( $h['kolizijos'] as $s => $g ) {
				echo '<li>Kurtos šiandien, „' . esc_html( implode( '" ir „', $g ) )
					. '" gautų tą patį nuorodos vardą <code>' . esc_html( $s ) . '</code></li>';
			}
			if ( $h['marguma'] ) {
				echo '<li>Raidžių marguma: ' . (int) $h['marguma']['didz'] . ' didžiąja, '
					. (int) $h['marguma']['maz'] . ' mažąja</li>';
			}
			echo '</ul></div>';
		}

		echo '<table class="widefat ps-atr-lent"><thead><tr><th>Reikšmė</th><th>Nuorodos vardas</th>'
			. '<th>Prekių</th><th>Nr.</th><th></th></tr></thead><tbody>';
		foreach ( (array) get_terms( array( 'taxonomy' => $tax, 'hide_empty' => false ) ) as $x ) {
			$hex = get_term_meta( $x->term_id, 'product_attribute_color', true );
			echo '<tr data-id="' . (int) $x->term_id . '"><td>'
				. ( $hex ? '<span class="ps-atr-sp" style="background:' . esc_attr( $hex ) . '"></span>' : '' )
				. '<span class="ps-atr-v">' . esc_html( $x->name ) . '</span></td>'
				. '<td><code>' . esc_html( $x->slug ) . '</code></td>'
				. '<td>' . (int) $x->count . '</td><td>' . (int) $x->term_id . '</td>'
				. '<td><button type="button" class="button-link ps-atr-red">pervadinti</button></td></tr>';
		}
		echo '</tbody></table>';

		echo '<div class="ps-atr-nauja"><h2>Nauja reikšmė</h2>'
			. '<input type="text" id="ps-atr-in" placeholder="pvz. XXL arba 20 kg" autocomplete="off">'
			. ( $tax === 'pa_spalva' ? '<input type="color" id="ps-atr-hex" value="#888888">' : '' )
			. '<button type="button" class="button button-primary" id="ps-atr-kurti">Sukurti</button>'
			. '<div id="ps-atr-perz" class="ps-atr-perz"></div>'
			. '<div id="ps-atr-stat" class="ps-atr-stat"></div></div>';

		$n = wp_create_nonce( 'ps_atr' );
		echo '<style>
		.ps-atr-x{max-width:760px;color:#50594f}
		.ps-atr-tax{display:flex;flex-wrap:wrap;gap:4px;margin:14px 0}
		.ps-atr-tax a{padding:6px 10px;border:1px solid #dfe3dd;border-radius:4px;background:#fff;
			text-decoration:none;color:#1d2422;font-size:13px}
		.ps-atr-tax a.on{background:#1f7a4d;border-color:#1f7a4d;color:#fff}
		.ps-atr-tax a i{opacity:.6;font-style:normal}
		.ps-atr-persp{background:#fff8e5;border-left:4px solid #d4ac0d;padding:8px 14px;margin:10px 0;max-width:860px}
		.ps-atr-persp ul{margin:6px 0 0 16px;list-style:disc}
		.ps-atr-lent{max-width:860px;margin-top:10px}
		.ps-atr-sp{display:inline-block;width:13px;height:13px;border-radius:50%;
			border:1px solid rgba(0,0,0,.2);margin-right:7px;vertical-align:-2px}
		.ps-atr-nauja{margin-top:22px;max-width:860px}
		.ps-atr-nauja input[type=text]{width:260px}
		.ps-atr-perz{color:#50594f;font-size:13px;margin-top:6px;min-height:18px}
		.ps-atr-stat{margin-top:8px;font-size:13px}
		.ps-atr-stat.kl{color:#b3261e}
		.ps-atr-stat.ok{color:#1f7a4d}
		</style>';
		echo '<script>
		(function(){
		 var TAX=' . wp_json_encode( $tax ) . ', N=' . wp_json_encode( $n ) . ',
		     U=' . wp_json_encode( admin_url( "admin-ajax.php" ) ) . ';
		 function siusti(d,cb){ d.action="ps_atr"; d._ajax_nonce=N;
		   fetch(U,{method:"POST",credentials:"same-origin",
		     headers:{"Content-Type":"application/x-www-form-urlencoded"},
		     body:new URLSearchParams(d)}).then(function(r){return r.json();}).then(cb); }
		 var inp=document.getElementById("ps-atr-in"), perz=document.getElementById("ps-atr-perz"),
		     stat=document.getElementById("ps-atr-stat");
		 if(inp) inp.addEventListener("input",function(){
		   if(!inp.value.trim()){ perz.textContent=""; return; }
		   siusti({v:"perziura",tax:TAX,reiksme:inp.value},function(r){
		     if(r.success) perz.textContent="Bus įrašyta: „"+r.data.vardas+"\\u201C  ·  nuoroda: "+r.data.slug;
		   });
		 });
		 var kb=document.getElementById("ps-atr-kurti");
		 if(kb) kb.addEventListener("click",function(){
		   var hx=document.getElementById("ps-atr-hex");
		   stat.className="ps-atr-stat"; stat.textContent="Kuriama…";
		   siusti({v:"kurti",tax:TAX,reiksme:inp.value,hex:hx?hx.value:""},function(r){
		     if(r.success){ stat.className="ps-atr-stat ok";
		       stat.textContent="Sukurta: „"+r.data.vardas+"\\u201C"; setTimeout(function(){location.reload();},700); }
		     else { stat.className="ps-atr-stat kl"; stat.textContent=r.data; }
		   });
		 });
		 document.querySelectorAll(".ps-atr-red").forEach(function(b){
		   b.addEventListener("click",function(){
		     var tr=b.closest("tr"), sp=tr.querySelector(".ps-atr-v"),
		         nauja=prompt("Nauja reikšmė:",sp.textContent);
		     if(nauja===null) return;
		     siusti({v:"pervadinti",id:tr.dataset.id,reiksme:nauja},function(r){
		       if(r.success) sp.textContent=r.data.vardas; else alert(r.data);
		     });
		   });
		 });
		})();
		</script>';
		echo '</div>';
	}
}
Petshop_Atributai::start();
