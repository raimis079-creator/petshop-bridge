<?php
/**
 * Plugin Name: Petshop Anketa Ivykiai
 * Description: Kontrakto §4.1 anketos ivykiai, §2 lauku istorija ir §3 brand susiejimas per REST kabliukus — M8 kodas NELIECIAMAS.
 * Version: 1.0
 *
 * ARCHITEKTURA (savininko procesas 2026-08-16: i M8 lendama tik §5, visa
 * kita — nauji failai):
 *  - Serverio ivykiai kabinami ant REST per `rest_request_before_callbacks`
 *    (momentine ps_pets kopija) ir `rest_request_after_callbacks`
 *    (skirtumas -> ps_pet_field_log + ivykis). M8 marsrutai:
 *      POST  /petshop/v1/pet-profile        -> anketa_completed (saltinis anketa)
 *      PATCH /petshop/v1/pet-profile/{id}   -> profile_updated  (klientas_profilyje)
 *      POST  /petshop/v1/pet-draft          -> anketa_completed (draft:ID)
 *      POST  /petshop/v1/pet-claim-resolve  -> profile_claimed
 *      pet-food-assign / pet-wet-product / pet-food-brand -> field_log (sistema)
 *  - Narsykles ivykiai (anketa_started, step_started/completed,
 *    anketa_abandoned su lauku busena) — atskiras JS stebetojas wp_footer'yje,
 *    siunciantis i musu AJAX `ps_anketa_ivykis` (sendBeacon — veikia pagehide).
 *  - Rasoma per Petshop_Statistika::irasyti() su sritis='anketa' ir user_id
 *    (statistika v2.2). Dvieju sluoksniu privatumas tas pats: be Complianz
 *    statistikos sutikimo — be sesijos, bet ivykis rasomas anonimiskai.
 *
 * SAZININGOS RIBOS (dokumentuota, ne nutylima):
 *  - pet-form.js NETURI step zymiu DOM'e — step numeracija yra euristika:
 *    kiekvienas .pspet-btn paspaudimas, po kurio persipiese turinys, laikomas
 *    zingsnio pabaiga. Tikslus zingsniu zemelapis atsiras, jei M8 prides
 *    data-step (atskiras savininko sprendimas, ne sio modulio darbas);
 *  - lauko "uzpildyta" pill'ams nustatoma pagal aria-pressed/active klase.
 *
 * §1.1 pastaba: 'none' siuntima is UI (DoD #5) turi daryti pati anketa —
 * tai vienintelis likes M8 UI pakeitimas, jam reikia atskiro savininko GO.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Anketa_Ivykiai {

	const VERSIJA = '1.0';
	/** Anketos versija naujiems irasams (is drafts payload_version=1). */
	const QV = 'v1';

	const TIPAI = array(
		'anketa_started', 'step_started', 'step_completed', 'anketa_completed',
		'anketa_abandoned', 'profile_claimed', 'profile_updated',
	);

	/** ps_pets laukai, kuriu pokyciai rasomi i ps_pet_field_log. */
	const LOG_LAUKAI = array(
		'pet_name','species','species_detail','birth_date','life_stage','dog_size',
		'is_sterilised','feeding_type','feeding_type_other','wet_food_g',
		'primary_need','primary_need_other','sensitivities','housing',
		'current_food_brand','current_food_brand_id','current_food_line_raw',
		'current_food_product_id','current_weight_kg','activity_hint',
		'wet_product_id','primary_product_id','questionnaire_version',
	);

	/** Momentines kopijos siai uzklausai: [pet_id => row]. */
	private static $foto = array();

	public static function init() {
		add_action( 'wp_ajax_ps_anketa_ivykis', array( __CLASS__, 'ajax_ivykis' ) );
		add_action( 'wp_ajax_nopriv_ps_anketa_ivykis', array( __CLASS__, 'ajax_ivykis' ) );
		add_filter( 'rest_request_before_callbacks', array( __CLASS__, 'pries' ), 10, 3 );
		add_filter( 'rest_request_after_callbacks', array( __CLASS__, 'po' ), 10, 3 );
		add_action( 'wp_footer', array( __CLASS__, 'js_stebetojas' ), 60 );
	}

	private static function galima() {
		return class_exists( 'Petshop_Statistika' ) && class_exists( 'Petshop_Pet_Kontraktas' );
	}

	private static function ivykis( $tipas, $verte, $user_id = null ) {
		if ( ! self::galima() ) { return false; }
		return Petshop_Statistika::irasyti( $tipas, array(
			'sritis'  => 'anketa',
			'verte'   => $verte,
			'user_id' => ( $user_id === null ) ? get_current_user_id() : (int) $user_id,
		) );
	}

	/* ==================== AJAX (narsykles ivykiai) ==================== */

	public static function ajax_ivykis() {
		if ( ! self::galima() ) { wp_send_json_error( 'moduliu nera' ); }
		$tipas = isset( $_POST['tipas'] ) ? sanitize_key( wp_unslash( $_POST['tipas'] ) ) : '';
		if ( ! in_array( $tipas, self::TIPAI, true ) ) { wp_send_json_error( 'tipas' ); }
		$verte = isset( $_POST['verte'] ) ? substr( sanitize_text_field( wp_unslash( $_POST['verte'] ) ), 0, 190 ) : '';

		$sesija = '';
		if ( Petshop_Statistika::sutikimas() ) {
			$sesija = isset( $_POST['sesija'] ) ? substr( sanitize_key( wp_unslash( $_POST['sesija'] ) ), 0, 32 ) : '';
			if ( strlen( $sesija ) !== 32 ) { $sesija = ''; }
		}
		$ireng = isset( $_POST['irenginys'] ) ? sanitize_key( wp_unslash( $_POST['irenginys'] ) ) : '';

		$ok = Petshop_Statistika::irasyti( $tipas, array(
			'sritis'    => 'anketa',
			'verte'     => $verte,
			'sesija'    => $sesija,
			'irenginys' => $ireng,
			'user_id'   => get_current_user_id(),
		) );
		wp_send_json_success( array( 'irasyta' => (bool) $ok ) );
	}

	/* ==================== REST kabliukai ==================== */

	private static function pet_eilute( $pet_id ) {
		global $wpdb;
		$t = $wpdb->prefix . 'ps_pets';
		return $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $t WHERE id=%d", $pet_id ), ARRAY_A );
	}

	private static function marsruto_pet_id( $route, $request ) {
		if ( preg_match( '#/petshop/v1/pet-profile/(\d+)#', $route, $m ) ) { return (int) $m[1]; }
		$p = $request->get_param( 'pet_id' );
		if ( $p ) { return (int) $p; }
		$p = $request->get_param( 'id' );
		if ( $p && strpos( $route, '/petshop/v1/pet-' ) !== false ) { return (int) $p; }
		return 0;
	}

	public static function pries( $response, $handler, $request ) {
		if ( ! self::galima() ) { return $response; }
		$route = $request->get_route();
		if ( strpos( $route, '/petshop/v1/' ) !== 0 || $request->get_method() === 'GET' ) { return $response; }
		$pid = self::marsruto_pet_id( $route, $request );
		if ( $pid ) { self::$foto[ $pid ] = self::pet_eilute( $pid ); }
		return $response;
	}

	public static function po( $response, $handler, $request ) {
		if ( ! self::galima() ) { return $response; }
		$route  = $request->get_route();
		$method = $request->get_method();
		if ( strpos( $route, '/petshop/v1/' ) !== 0 || $method === 'GET' ) { return $response; }
		if ( is_wp_error( $response ) ) { return $response; }
		$st = ( $response instanceof WP_REST_Response ) ? $response->get_status() : 200;
		if ( $st >= 400 ) { return $response; }
		$data = ( $response instanceof WP_REST_Response ) ? $response->get_data() : null;

		/* --- 1) ANKETA CREATE: POST /pet-profile --- */
		if ( $method === 'POST' && preg_match( '#/petshop/v1/pet-profile$#', $route ) ) {
			$pid = self::rasti_id( $data );
			if ( $pid ) { self::po_kurimo( $pid, 'anketa' ); }
			return $response;
		}
		/* --- 2) PROFILIO REDAGAVIMAS: PATCH/PUT/POST /pet-profile/{id} --- */
		if ( preg_match( '#/petshop/v1/pet-profile/(\d+)$#', $route, $m ) ) {
			self::po_pakeitimo( (int) $m[1], 'klientas_profilyje', true );
			return $response;
		}
		/* --- 3) ANONIMINE ANKETA: POST /pet-draft --- */
		if ( $method === 'POST' && preg_match( '#/petshop/v1/pet-draft$#', $route ) ) {
			$did = '';
			if ( is_array( $data ) ) {
				foreach ( array( 'draft_id', 'id' ) as $k ) { if ( ! empty( $data[ $k ] ) ) { $did = (string) $data[ $k ]; break; } }
			}
			self::ivykis( 'anketa_completed', 'draft:' . substr( $did, 0, 180 ) );
			return $response;
		}
		/* --- 4) DRAFT -> PASKYRA: /pet-claim-resolve --- */
		if ( strpos( $route, '/petshop/v1/pet-claim-resolve' ) === 0 ) {
			$pid = self::rasti_id( $data, array( 'pet_id', 'claimed_pet_id', 'id' ) );
			self::ivykis( 'profile_claimed', $pid ? (string) $pid : '' );
			if ( $pid ) { self::po_kurimo( $pid, 'anketa', false ); } /* laukai i log, be antro ivykio */
			return $response;
		}
		/* --- 5) SISTEMINIAI RASYTOJAI: pet-food-assign / pet-wet-product / pet-food-brand --- */
		if ( preg_match( '#/petshop/v1/(pet-food-assign|pet-wet-product|pet-food-brand)#', $route ) ) {
			$pid = self::marsruto_pet_id( $route, $request );
			if ( $pid ) { self::po_pakeitimo( $pid, 'sistema', false ); }
			return $response;
		}
		return $response;
	}

	private static function rasti_id( $data, $raktai = array( 'pet_id', 'id' ) ) {
		if ( ! is_array( $data ) ) { return 0; }
		foreach ( $raktai as $k ) { if ( isset( $data[ $k ] ) && is_numeric( $data[ $k ] ) ) { return (int) $data[ $k ]; } }
		foreach ( $data as $v ) { if ( is_array( $v ) ) { $r = self::rasti_id( $v, $raktai ); if ( $r ) { return $r; } } }
		return 0;
	}

	/** Po anketos sukurto iraso: pradinis field_log, QV, brand susiejimas, ivykis. */
	private static function po_kurimo( $pet_id, $saltinis, $su_ivykiu = true ) {
		global $wpdb;
		$e = self::pet_eilute( $pet_id );
		if ( ! $e ) { return; }
		$uid = (int) $e['user_id'];
		foreach ( self::LOG_LAUKAI as $L ) {
			if ( ! array_key_exists( $L, $e ) ) { continue; }
			if ( $e[ $L ] === null || $e[ $L ] === '' ) { continue; }
			Petshop_Pet_Kontraktas::log_lauka( $pet_id, $L, null, $e[ $L ], $saltinis, $uid, self::QV );
		}
		/* questionnaire_version — M8 apie stulpeli nezino, pildome mes */
		if ( empty( $e['questionnaire_version'] ) ) {
			$wpdb->update( $wpdb->prefix . 'ps_pets', array( 'questionnaire_version' => self::QV ), array( 'id' => $pet_id ) );
			Petshop_Pet_Kontraktas::log_lauka( $pet_id, 'questionnaire_version', null, self::QV, 'sistema', $uid, self::QV );
		}
		self::brand_susieti( $pet_id, $e, $uid );
		if ( $su_ivykiu ) { self::ivykis( 'anketa_completed', (string) $pet_id, $uid ?: null ); }
	}

	/** Po redagavimo: skirtumas pries/po -> field_log; brand persiejimas; ivykis. */
	private static function po_pakeitimo( $pet_id, $saltinis, $su_ivykiu ) {
		$po = self::pet_eilute( $pet_id );
		if ( ! $po ) { return; }
		$pries = isset( self::$foto[ $pet_id ] ) ? self::$foto[ $pet_id ] : null;
		$uid   = (int) $po['user_id'];
		$pakeisti = array();
		if ( $pries ) {
			foreach ( self::LOG_LAUKAI as $L ) {
				if ( ! array_key_exists( $L, $po ) ) { continue; }
				$b = isset( $pries[ $L ] ) ? $pries[ $L ] : null;
				if ( (string) $b === (string) $po[ $L ] ) { continue; }
				Petshop_Pet_Kontraktas::log_lauka( $pet_id, $L, $b, $po[ $L ], $saltinis, $uid, null );
				$pakeisti[] = $L;
			}
			if ( in_array( 'current_food_brand', $pakeisti, true ) ) { self::brand_susieti( $pet_id, $po, $uid ); }
		}
		if ( $su_ivykiu && $pakeisti ) {
			self::ivykis( 'profile_updated', substr( implode( ',', $pakeisti ), 0, 190 ), $uid ?: null );
		}
	}

	/** §3: raw -> alias -> AUTO atveju current_food_brand_id. */
	private static function brand_susieti( $pet_id, $eilute, $uid ) {
		global $wpdb;
		$raw = isset( $eilute['current_food_brand'] ) ? trim( (string) $eilute['current_food_brand'] ) : '';
		if ( $raw === '' ) { return; }
		$kl = Petshop_Pet_Kontraktas::klasifikuoti( $raw );
		Petshop_Pet_Kontraktas::irasyti_alias( $raw, $kl );
		$naujas_id = ( $kl['busena'] === 'auto' ) ? $kl['canonical_id'] : null;
		$buvo = isset( $eilute['current_food_brand_id'] ) ? $eilute['current_food_brand_id'] : null;
		if ( (string) $buvo === (string) $naujas_id ) { return; }
		$wpdb->update( $wpdb->prefix . 'ps_pets', array( 'current_food_brand_id' => $naujas_id ), array( 'id' => $pet_id ) );
		Petshop_Pet_Kontraktas::log_lauka( $pet_id, 'current_food_brand_id', $buvo, $naujas_id, 'sistema', $uid, null );
	}

	/* ==================== JS STEBETOJAS ==================== */

	public static function js_stebetojas() {
		if ( is_admin() ) { return; }
		$ajax = esc_js( admin_url( 'admin-ajax.php' ) );
		$qv   = esc_js( self::QV );
		?>
<script id="ps-anketa-ivykiai">
(function(){
'use strict';
var AJAX='<?php echo $ajax; ?>',QV='<?php echo $qv; ?>';
var pradeta=false,baigta=false,mesta=false,zingsnis=1;
function sesija(){var m=document.cookie.match(/(?:^|; )ps_stat_s=([a-f0-9]{32})/);return m?m[1]:'';}
function ireng(){return (window.innerWidth<=768)?'mobile':'desktop';}
function siusti(tipas,verte){
 try{
  var fd=new FormData();
  fd.append('action','ps_anketa_ivykis');fd.append('tipas',tipas);
  fd.append('verte',(verte||'').slice(0,190));fd.append('sesija',sesija());fd.append('irenginys',ireng());
  if(navigator.sendBeacon&&navigator.sendBeacon(AJAX,fd))return;
  fetch(AJAX,{method:'POST',body:fd,keepalive:true,credentials:'same-origin'}).catch(function(){});
 }catch(e){}
}
function saknis(){return document.querySelector('#pspet-form-host .pspet-wrap, .pspet-wrap');}
function laukuBusena(r){
 var pilni=[],tusti=[];
 r.querySelectorAll('.pspet-field').forEach(function(f){
  var lb=f.querySelector('.pspet-label');
  var v=(lb?lb.textContent:'').trim().toLowerCase().replace(/[^a-z0-9ąčęėįšųūž]+/g,'_').replace(/^_+|_+$/g,'').slice(0,24)||'laukas';
  var uzp=false;
  f.querySelectorAll('input,select,textarea').forEach(function(i){
   if(i.type==='checkbox'||i.type==='radio'){if(i.checked)uzp=true;}
   else if((i.value||'').trim()!=='')uzp=true;
  });
  if(!uzp&&f.querySelector('.pspet-pill[aria-pressed="true"],.pspet-pill.active,.pspet-pill.is-active,.pspet-pill[data-selected="1"]'))uzp=true;
  (uzp?pilni:tusti).push(v);
 });
 return 's'+zingsnis+'|+'+pilni.join(',')+'|-'+tusti.join(',');
}
function pradzia(){
 if(pradeta)return;pradeta=true;
 siusti('anketa_started',QV);siusti('step_started','1');
 document.addEventListener('click',function(ev){
  var b=ev.target&&ev.target.closest?ev.target.closest('.pspet-btn'):null;
  if(!b)return;var r=saknis();if(!r||!r.contains(b))return;
  /* euristika: mygtukas anketoje = zingsnio riba (dokumentuota modulio antrasteje) */
  siusti('step_completed',String(zingsnis));zingsnis++;
  setTimeout(function(){if(!baigta&&saknis())siusti('step_started',String(zingsnis));},400);
 },true);
}
/* fetch apvyniojimas — tik baigtos anketos zymei (abandoned slopinimui) */
var of=window.fetch;
window.fetch=function(u,o){
 var url=String(u&&u.url?u.url:u);
 var p=of.apply(this,arguments);
 if(/\/petshop\/v1\/(pet-profile|pet-draft)(\/|$|\?)/.test(url)&&(!o||!o.method||o.method.toUpperCase()!=='GET')){
  p=p.then(function(r){if(r&&r.ok)baigta=true;return r;});
 }
 return p;
};
function mesti(){
 if(!pradeta||baigta||mesta)return;mesta=true;
 var r=saknis();
 siusti('anketa_abandoned',r?laukuBusena(r):('s'+zingsnis+'|+|-'));
}
window.addEventListener('pagehide',mesti);
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')mesti();});
if(saknis()){pradzia();}
else{
 var mo=new MutationObserver(function(){if(saknis()){pradzia();mo.disconnect();}});
 if(document.body)mo.observe(document.body,{childList:true,subtree:true});
 setTimeout(function(){try{mo.disconnect();}catch(e){}},30000);
}
})();
</script>
		<?php
	}
}

Petshop_Anketa_Ivykiai::init();
