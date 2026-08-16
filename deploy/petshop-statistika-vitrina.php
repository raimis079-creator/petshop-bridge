<?php
/**
 * Plugin Name: Petshop Statistika — Vitrina
 * Description: Elgsenos ivykiu siuntimas is surenkamos dezes puslapio (standartas v2, E2).
 * Version: 1.0
 *
 * KODEL ATSKIRAS MODULIS. `petshop-laukai.php` yra 183 KB veikiancio kodo ir
 * jokio JS ivykiu API neturi. Vietoj to, kad ji perrasyciau (rizika neproporcinga
 * naudai), sis modulis kabinasi ant TU PACIU DOM elementu per delegated
 * listener'ius. Laukai apie statistika nieko nezino ir neturi zinoti; jei
 * vitrina kada persidarys, suges tik matavimas, ne pardavimas.
 *
 * DOM sutartis (patikrinta narsykleje 2026-08-16, produktas 34942):
 *   .pslk-deti[data-cid]        — „I deze" kortelėje ir greitoje perziuroje
 *   .pslk-stp button[data-cid][data-d]  — kiekio +/- (data-d = 1 arba -1)
 *   .pslk-el[data-cid]          — langelis dezeje (paspaudimas nuima VIENA)
 *   .pslk-dovk[data-gid]        — dovanos pasirinkimas
 *   #pslk-dov.atrakinta         — dovanos riba pasiekta
 *   #pslk-cta[disabled]         — „I krepseli"; disabled nukritimas = minimumas
 *   #pslk-kiek                  — „N vnt." arba „tuscia"
 *   .pslk-dbtn                  — dydzio perjungimas (navigacija i broli)
 *   .pslk-kort                  — prekes kortele (rodymui)
 *
 * DU SLUOKSNIAI (kaip serveryje): be statistikos sutikimo ivykiai vis tiek
 * siunciami, bet BE sesijos — irenginyje nesukuriamas joks identifikatorius,
 * slapukas nerasomas. Su sutikimu pridedama sesija ir tik tada imanomas
 * piltuvelis bei kabliukai.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Statistika_Vitrina {

	const VERSIJA = '1.0';

	public static function init() {
		add_action( 'wp_footer', array( __CLASS__, 'skriptas' ), 99 );
	}

	/** Ar dabar rodomas surenkamos dezes puslapis. */
	private static function deze_id() {
		if ( ! is_singular( 'product' ) ) { return 0; }
		$id = (int) get_queried_object_id();
		if ( ! $id ) { return 0; }
		return ( get_post_meta( $id, '_ps_laukas', true ) === 'yes' ) ? $id : 0;
	}

	/**
	 * cid -> product_id. Vitrinos `data-cid` yra MnM VAIKINES EILUTES id
	 * (`wc_mnm_child_items.child_item_id`), o ne produkto ID — patikrinta
	 * narsykleje: `mnm_quantity[19570]` sedi elemente `pslk-in-907`.
	 * Be sio vertimo elgsena ir pardavimai gyventu skirtingais ID ir
	 * „idejimo dalis" niekada nesusiskaiciuotu.
	 */
	public static function cid_zemelapis( $deze ) {
		global $wpdb;
		$t = $wpdb->prefix . 'wc_mnm_child_items';
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$t'" ) !== $t ) { return array(); }
		$r = $wpdb->get_results( $wpdb->prepare( "SELECT child_item_id, product_id FROM $t WHERE container_id=%d", (int) $deze ), ARRAY_A );
		$out = array();
		foreach ( (array) $r as $x ) { $out[ (string) (int) $x['child_item_id'] ] = (int) $x['product_id']; }
		return $out;
	}

	public static function skriptas() {
		$deze = self::deze_id();
		if ( ! $deze ) { return; }

		$cfg = array(
			'url'   => admin_url( 'admin-ajax.php' ),
			'deze'  => $deze,
			'dydis' => class_exists( 'Petshop_Statistika' ) ? Petshop_Statistika::dezes_dydis( $deze ) : '',
			'map'   => self::cid_zemelapis( $deze ),
		);
		?>
<script id="ps-stat-vitrina">
(function(){
	"use strict";
	var C = <?php echo wp_json_encode( $cfg ); ?>;
	if (!document.querySelector('.pslk')) { return; }

	/* ---------- sutikimas ir sesija ---------- */
	/* Be sutikimo NIEKO nerasom i irengini: nei slapuko, nei sessionStorage
	   rakto su ID. Ivykiai vis tiek keliauja, tik anonimiskai. */
	function sutikimas(){
		try {
			if (typeof window.cmplz_has_consent === 'function') { return !!window.cmplz_has_consent('statistics'); }
			return document.cookie.indexOf('cmplz_statistics=allow') > -1;
		} catch(e){ return false; }
	}
	function sesija(){
		if (!sutikimas()) { return ''; }
		var m = document.cookie.match(/(?:^|;\s*)ps_stat_s=([a-z0-9]{32})/);
		if (m) { return m[1]; }
		var s = '';
		try {
			var a = new Uint8Array(16);
			(window.crypto || window.msCrypto).getRandomValues(a);
			for (var i=0;i<16;i++){ s += ('0'+a[i].toString(16)).slice(-2); }
		} catch(e){
			s = (Date.now().toString(16) + Math.random().toString(16).slice(2)).slice(0,32);
			while (s.length < 32) { s += '0'; }
		}
		document.cookie = 'ps_stat_s=' + s + ';path=/;max-age=1800;SameSite=Lax' + (location.protocol==='https:'?';Secure':'');
		return s;
	}
	function irenginys(){
		return (window.matchMedia && window.matchMedia('(max-width:768px)').matches) ? 'mobile' : 'desktop';
	}

	/* ---------- eile ir siuntimas ---------- */
	var eile = [], laikmatis = null;

	function siusk(){
		if (!eile.length) { return; }
		var siuntinys = eile.splice(0, 50);
		var f = new FormData();
		f.append('action', 'ps_stat_ivykis');
		f.append('ivykiai', JSON.stringify(siuntinys));
		f.append('sesija', sesija());
		f.append('irenginys', irenginys());
		try {
			fetch(C.url, { method:'POST', body:f, credentials:'same-origin', keepalive:true }).catch(function(){});
		} catch(e){}
	}

	/* Visur toliau dirbam su cid (taip patogiau DOM'e), o i eile deda jau
	   product_id — kad elgsena ir pardavimai sutaptu vienu raktu. */
	function pid(cid){
		if (!cid) { return 0; }
		var p = C.map ? C.map[String(cid)] : 0;
		return p ? p : 0;
	}
	function ivykis(tipas, cid, verte, kiek){
		eile.push({ tipas:tipas, deze:C.deze, preke:pid(cid), verte:(verte===undefined||verte===null)?'':String(verte), kiek:kiek||0 });
		if (eile.length >= 20) { siusk(); return; }
		if (laikmatis) { clearTimeout(laikmatis); }
		laikmatis = setTimeout(siusk, 5000);
	}

	/* „Pirma karta sesijoje" dedupikuojam cia, o ne serveryje — serveris apie
	   sesijos istorija nieko nezino. Be sutikimo saugom tik puslapio gyvavimo
	   laikui (kintamajame), kad nieko neliktu irenginyje. */
	var atmintis = {};
	function pirmaKarta(raktas){
		if (sutikimas()) {
			try {
				if (sessionStorage.getItem('ps_'+raktas+'_'+C.deze)) { return false; }
				sessionStorage.setItem('ps_'+raktas+'_'+C.deze, '1');
				return true;
			} catch(e){}
		}
		if (atmintis[raktas]) { return false; }
		atmintis[raktas] = 1;
		return true;
	}

	/* ---------- dezes buklė is DOM ---------- */
	/* Kieki skaitom is `#pslk-kiek`, o ne is laukų JS vidiniu kintamuju —
	   jie uzdaryti closure'e ir is isores nepasiekiami. */
	function kiekDezeje(){
		var el = document.getElementById('pslk-kiek');
		if (!el) { return 0; }
		var m = (el.textContent||'').match(/(\d+)/);
		return m ? parseInt(m[1],10) : 0;
	}
	/* Laukų listener'is suveikia pirmas ir perpiesia deze; mes skaitom po jo. */
	function poPiesimo(fn){
		if (window.requestAnimationFrame) { requestAnimationFrame(function(){ requestAnimationFrame(fn); }); }
		else { setTimeout(fn, 30); }
	}

	/* ---------- 1) atidare ---------- */
	ivykis('atidare', 0, '', kiekDezeje());

	/* ---------- 2) rodyta (kortele pateko i ekrana) ---------- */
	/* Be sio skaitliuko „idejimo dalis" neturetu vardiklio ir prekiu lentele
	   negaletu atsakyti „ar preke traukia" — tik „kiek parduota". */
	var rodyti = {};
	function pazymekRodyta(cid){
		if (!cid || rodyti[cid]) { return; }
		rodyti[cid] = 1;
		ivykis('rodyta', cid, '', kiekDezeje());
	}
	function kortelesCid(el){
		if (!el) { return 0; }
		if (el.id && el.id.indexOf('pslk-k-') === 0) { return parseInt(el.id.slice(7),10) || 0; }
		var b = el.querySelector('[data-cid]');
		return b ? (parseInt(b.dataset.cid,10) || 0) : 0;
	}
	try {
		if (window.IntersectionObserver) {
			var stebetojas = new IntersectionObserver(function(irasai){
				irasai.forEach(function(i){ if (i.isIntersecting) { pazymekRodyta(kortelesCid(i.target)); stebetojas.unobserve(i.target); } });
			}, { threshold: 0.35 });
			document.querySelectorAll('.pslk-kort').forEach(function(k){ stebetojas.observe(k); });
		} else {
			document.querySelectorAll('.pslk-kort').forEach(function(k){ pazymekRodyta(kortelesCid(k)); });
		}
	} catch(e){}

	/* ---------- 3) idejo / iseme / dovana / krepselis ---------- */
	document.addEventListener('click', function(e){
		var t = e.target;
		if (!t || !t.closest) { return; }

		/* „I deze" — kortelėje arba greitoje perziuroje */
		var deti = t.closest('.pslk-deti');
		if (deti) {
			var cid = deti.dataset.cid ? parseInt(deti.dataset.cid,10) : 0;
			poPiesimo(function(){
				if (!cid) { cid = paskutinisPz; }
				/* kiek_dezeje: PO pridejimo (pirmoji preke sesijoje = 1 — kabliuko pozymis) */
				ivykis('idejo', cid, 1, kiekDezeje());
				tikrinkBusena();
			});
			return;
		}

		/* Kiekio +/- kortelėje */
		var stp = t.closest('.pslk-stp button');
		if (stp) {
			var cid2 = stp.dataset.cid ? parseInt(stp.dataset.cid,10) : paskutinisPz;
			var d = parseInt(stp.dataset.d,10) || 0;
			poPiesimo(function(){
				var n = kiekDezeje();
				if (d > 0) { ivykis('idejo', cid2, d, n); }
				/* iseme: spec reikalauja skaiciaus PRIES pasalinima, o DOM jau
				   perpiestas — todel gražinam atgal nuimta kieki. */
				else if (d < 0) { ivykis('iseme', cid2, -d, n + (-d)); }
				tikrinkBusena();
			});
			return;
		}

		/* Langelis dezeje — nuima viena vieneta */
		var el2 = t.closest('.pslk-el');
		if (el2 && !el2.classList.contains('dov') && el2.dataset.cid) {
			var cid3 = parseInt(el2.dataset.cid,10) || 0;
			poPiesimo(function(){
				ivykis('iseme', cid3, 1, kiekDezeje() + 1);
				tikrinkBusena();
			});
			return;
		}

		/* Dovanos pasirinkimas */
		var dovk = t.closest('.pslk-dovk');
		if (dovk) {
			var gid = parseInt(dovk.dataset.gid,10) || 0;
			ivykis('dovana_rinko', gid, '', kiekDezeje());
			return;
		}

		/* Dydzio perjungimas — navigacija i broli, todel siunciam is karto
		   (fetch keepalive isgyvena puslapio pakeitima). */
		var dbtn = t.closest('.pslk-dbtn');
		if (dbtn && !dbtn.classList.contains('on')) {
			var naujas = (dbtn.textContent||'').replace(/\D+/g,'');
			ivykis('dydis_perjunge', 0, (C.dydis||'?') + '>' + (naujas||'?'), kiekDezeje());
			siusk();
			return;
		}

		/* I krepseli — tik kai mygtukas aktyvus (t. y. minimumas surinktas) */
		var cta = t.closest('#pslk-cta');
		if (cta && !cta.disabled) {
			var suma = (document.getElementById('pslk-viso') || {}).textContent || '';
			ivykis('krepselis', 0, suma.replace(/[^\d,.]/g,'').replace(',','.'), kiekDezeje());
			siusk();
			return;
		}

		/* Greita perziura — prekes rodymas (ne dezes atidarymas) */
		var kort = t.closest('.pslk-kort');
		if (kort) {
			var cid4 = kortelesCid(kort);
			if (cid4) { paskutinisPz = cid4; pazymekRodyta(cid4); }
		}
	}, false);

	var paskutinisPz = 0;

	/* ---------- 4) min_pasiekta ir dovana_atrakinta ---------- */
	/* Stebim BUSENA, o ne paspaudimus: minimumas gali buti pasiektas ir per
	   kortelės mygtuka, ir per greita perziura, ir per stepper'i. */
	function tikrinkBusena(){
		var cta = document.getElementById('pslk-cta');
		if (cta && !cta.disabled && pirmaKarta('min')) {
			ivykis('min_pasiekta', 0, kiekDezeje(), kiekDezeje());
		}
		var dov = document.getElementById('pslk-dov');
		if (dov && dov.classList.contains('atrakinta') && pirmaKarta('dov')) {
			var riba = (document.getElementById('pslk-dov-bl') || {}).textContent || '';
			ivykis('dovana_atrakinta', 0, riba.replace(/[^\d,.]/g,'').replace(',','.'), kiekDezeje());
		}
	}
	try {
		var taikiniai = [document.getElementById('pslk-cta'), document.getElementById('pslk-dov')].filter(Boolean);
		if (window.MutationObserver && taikiniai.length) {
			var mo = new MutationObserver(function(){ tikrinkBusena(); });
			taikiniai.forEach(function(t){ mo.observe(t, { attributes:true, attributeFilter:['disabled','class'] }); });
		}
	} catch(e){}

	/* ---------- 5) issiuntimas paliekant puslapi ---------- */
	document.addEventListener('visibilitychange', function(){ if (document.visibilityState === 'hidden') { siusk(); } });
	window.addEventListener('pagehide', siusk);
})();
</script>
		<?php
	}
}

add_action( 'plugins_loaded', function() {
	if ( class_exists( 'Petshop_Statistika' ) ) { Petshop_Statistika_Vitrina::init(); }
}, 20 );
