<?php
/**
 * Petshop Juosta v1.7 (S1617) — dešinėje, prie „Žurnalas“, nuoroda „Sąskaitos“ (darbalaukis `view=saskaitos`, v3.26) — tik `manage_woocommerce` (Raimis / buhalterė); darbuotojui nieko nepridėta.
 *
 * Petshop Juosta v1.6 (S1617) — „Užsakymai“ / „Neapmokėti“ skaičiai be pakartotinių užsakymų (meta `_ps_pakartotinis`, darbalaukis v3.21 — jie darbalaukyje nerodomi).
 *
 * Petshop Juosta v1.5 (S1607) — Prekių kortelė (`.pskat-kort`, sticky top:0) lįsdavo po juosta (44+26 px + admin bar 32):
 * top:102px, max-height pagal tai. Raimio pastaba 2026-09-03 17:02.
 *
 * Petshop Juosta v1.4 (S1606) — patikra parodė, kad katalogo kešas `ps_kat_duomenys` NĖRA saugomas
 * (masyvas > 4 MB, surinkti() skaičiuoja kas kartą). Todėl „reikia užsakyti“ skaičiuojamas cron'u
 * kas valandą (`ps_juosta_reikia_cron` → Petshop_Katalogas::surinkti() + eiles()) į opciją
 * `ps_juosta_reikia`; juosta ją tik skaito. Pirmas skaičiavimas — deploy metu.
 *
 * Petshop Juosta v1.3 (S1606) — katalogo kešas gyvena 300 s, todėl „reikia užsakyti“ skaičius įsimenamas
 * opcijoje `ps_juosta_reikia` (n, laikas) ir rodomas iš jos, kol katalogas neperskaičiuos.
 *
 * Petshop Juosta v1.2 (S1606) — „Prekės [reikia užsakyti]“: iš katalogo kešo `ps_kat_duomenys` per
 * Petshop_Katalogas::eiles($prekes,'prekyboje')['uzsakyti'] (tas pats skaičius, kaip katalogo eilėje
 * „Reikia užsakyti“). Kešo nėra — skaičiaus nėra; surinkti() nekviečiama (sunkus).
 *
 * Petshop Juosta v1.1 (S1606) — WP kairysis meniu paslepiamas visur, kur juosta (desk/katalogas jau slėpė;
 * Tiekimas/Laiškai/Žurnalas turėjo dvi navigacijas). Desk `.pd` (position:fixed) nustumiamas žemiau juostos.
 * Riba trumpesnė, siaurame lange slepiama; kelio pavadinimas — tik h1 tekstas be <small>.
 *
 * Petshop Juosta v1.0 (S1606, spec R3/R4, §7) — VIENA VIRŠUTINĖ JUOSTA VISUOSE PETSHOP LANGUOSE.
 *
 * KODĖL (auditas 2026-09-02, `analize/audit_m2.json`): prekių pusė turėjo savo
 * juostą (Katalogas·Akcijos·Gavimas·Tiekimas·Rinkiniai·Užsakymai — `.pskat-bar`,
 * `.psgav-bar`), užsakymų pusė — savą (`.pd-top`), Tiekimas/Laiškai/Lapai/
 * Perdavimas — jokios; 12 skirtingų „Atgal“ variantų. Darbuotojas klaidžiojo.
 *
 * SPRENDIMAS (Raimis R3): viena juosta, vienoda visur, su gyvais skaičiais:
 *   ⌂ · Užsakymai [n] · Rytinė eiga · Prekės [reikia užsakyti] · Gavimas ·
 *   Tiekimas [kaupiama/laukiam] · Rinkiniai · Akcijos · Laiškai [laukia] · riba ·
 *   paieška · Žurnalas · vartotojas.
 *   Po juosta — KELIAS (iš kur atėjai, sessionStorage, iki 4 žingsnių) ir vienas
 *   „← Atgal“. Namukas kairėje = svetainė kliento akimis (nauja kortelė).
 *
 * KAS PASLEPIAMA (tik CSS, failai neliečiami — R4): senos juostos nav dalys
 * (`.pskat-nav`, `.pskat-logo`, `.psgav-bar` nuorodos), desk `.pd-top`, ir
 * `<p><a class="button">← Petshop užsakymai</a></p>` Tiekime/Laiškuose. Katalogo
 * paieška ir „Duomenys … atnaujinti“ lieka — jie apie prekes, ne apie navigaciją.
 *
 * SKAIČIAI: transientas 60 s (`ps_juosta_sk`), skaičiuojama pigiai:
 *   Užsakymai = processing + on-hold (wc_orders, HPOS); Tiekimas = partijos
 *   kaupiama / uzsakyta; Laiškai = užsakymai, laukiantys perdavimo
 *   (Petshop_AV_Dropship::laukiantys_perdavimo); Prekės „reikia užsakyti“ — iš
 *   Petshop_Katalogas::kruvu_skaiciai(), jei toks metodas be parametrų egzistuoja
 *   (ReflectionMethod), kitaip be skaičiaus. Riba — Petshop_Desk::riba() per
 *   ReflectionMethod (protected), artimiausia dar nepraėjusi.
 *
 * Kur rodoma: admin.php?page=ps-* ir petshop-* (išskyrus ataskaitas — Raimio
 * langai, kita juosta). Teisė: edit_shop_orders arba manage_woocommerce.
 *
 * @package Petshop
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Juosta {

	const VERSIJA = '1.7';
	const TR      = 'ps_juosta_sk';

	/** Puslapiai, kur juosta NErodoma (Raimio analitika turi savą UI). */
	const BE = array( 'petshop-reports', 'petshop-langai', 'petshop-naujienlaiskiai', 'petshop-rezultatai', 'ps-ataskaitos', 'ps-prognoze', 'petshop-fbt', 'petshop-pragma', 'petshop-promotions' );

	public static function init() {
		add_action( 'in_admin_header', array( __CLASS__, 'juosta' ), 5 );
		add_action( 'admin_head', array( __CLASS__, 'stilius' ), 99 );
		add_action( 'admin_footer', array( __CLASS__, 'skriptas' ) );
		add_action( 'ps_juosta_isvalyti', array( __CLASS__, 'isvalyti' ) );
		add_filter( 'admin_title', array( __CLASS__, 'pavadinimas' ), 10, 2 );
		add_action( 'ps_juosta_reikia_cron', array( __CLASS__, 'reikia_perskaiciuoti' ) );
		if ( ! wp_next_scheduled( 'ps_juosta_reikia_cron' ) ) { wp_schedule_event( time() + 120, 'hourly', 'ps_juosta_reikia_cron' ); }
		foreach ( array( 'woocommerce_order_status_changed', 'woocommerce_payment_complete', 'ps_uzs_ivykis' ) as $h ) { add_action( $h, array( __CLASS__, 'isvalyti' ) ); }
	}

	public static function isvalyti() { delete_transient( self::TR ); }

	/** Cron kas valandą: kiek prekių „reikia užsakyti“ (tas pats skaičius, kaip katalogo eilėje). */
	public static function reikia_perskaiciuoti() {
		if ( ! class_exists( 'Petshop_Katalogas' ) || ! method_exists( 'Petshop_Katalogas', 'surinkti' ) || ! method_exists( 'Petshop_Katalogas', 'eiles' ) ) { return null; }
		try {
			$k = Petshop_Katalogas::surinkti();
			if ( ! is_array( $k ) || empty( $k['prekes'] ) ) { return null; }
			$e = Petshop_Katalogas::eiles( $k['prekes'], 'prekyboje' );
			if ( ! isset( $e['uzsakyti'] ) ) { return null; }
			update_option( 'ps_juosta_reikia', array( (int) $e['uzsakyti'], time() ), false );
			delete_transient( self::TR );
			return (int) $e['uzsakyti'];
		} catch ( Throwable $ex ) { return null; }
	}

	/** Paslėpti (parent '') langai neturi antraštės — duodam. */
	public static function pavadinimas( $t, $title ) {
		if ( '' === trim( (string) $title ) && 'ps-ivykiai' === self::puslapis() ) { return 'Užsakymų žurnalas ' . $t; }
		return $t;
	}

	public static function puslapis() {
		if ( ! is_admin() || empty( $_GET['page'] ) ) { return ''; }
		$p = sanitize_key( $_GET['page'] );
		if ( in_array( $p, self::BE, true ) ) { return ''; }
		if ( 0 === strpos( $p, 'ps-' ) || 0 === strpos( $p, 'petshop-' ) ) { return $p; }
		return '';
	}

	protected static function gali() {
		return current_user_can( 'edit_shop_orders' ) || current_user_can( 'manage_woocommerce' );
	}

	/* ============================ SKAIČIAI ============================ */

	public static function skaiciai() {
		$s = get_transient( self::TR );
		if ( is_array( $s ) ) { return $s; }
		global $wpdb;
		$p = $wpdb->prefix;
		$s = array( 'uzs' => 0, 'neapm' => 0, 'kaup' => 0, 'lauk' => 0, 'laiskai' => 0, 'reikia' => null, 'riba' => null, 'gavimas' => null );
		try {
			if ( $wpdb->get_var( "SHOW TABLES LIKE '{$p}wc_orders'" ) ) {
				$be = "AND id NOT IN (SELECT order_id FROM {$p}wc_orders_meta WHERE meta_key='_ps_pakartotinis')"; // v1.6
				$s['uzs']   = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$p}wc_orders WHERE type='shop_order' AND status IN ('wc-processing','wc-on-hold') {$be}" );
				$s['neapm'] = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$p}wc_orders WHERE type='shop_order' AND status IN ('wc-pending','wc-failed') {$be}" );
			}
			if ( $wpdb->get_var( "SHOW TABLES LIKE '{$p}ps_tiekimas'" ) ) {
				$s['kaup'] = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$p}ps_tiekimas WHERE busena='kaupiama'" );
				$s['lauk'] = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$p}ps_tiekimas WHERE busena='uzsakyta'" );
			}
			if ( class_exists( 'Petshop_AV_Dropship' ) && method_exists( 'Petshop_AV_Dropship', 'laukiantys_perdavimo' ) ) {
				$g = Petshop_AV_Dropship::laukiantys_perdavimo();
				$n = 0; foreach ( (array) $g as $ids ) { $n += count( (array) $ids ); }
				$s['laiskai'] = $n;
			}
			$r = get_option( 'ps_juosta_reikia' );
			if ( is_array( $r ) && isset( $r[0] ) ) { $s['reikia'] = (int) $r[0]; $s['reikia_laikas'] = (int) $r[1]; }
			if ( class_exists( 'Petshop_Desk' ) && defined( 'Petshop_Desk::RIBOS' ) ) {
				$r = new ReflectionMethod( 'Petshop_Desk', 'riba' ); $r->setAccessible( true );
				$art = null;
				foreach ( Petshop_Desk::RIBOS as $sk => $lk ) {
					$rz = $r->invoke( null, $sk );
					if ( is_array( $rz ) && 'praejo' !== $rz[0] && ( ! $art || $lk < $art[1] ) ) {
						$vardas = defined( 'Petshop_Desk::SALTINIAI' ) && isset( Petshop_Desk::SALTINIAI[ $sk ][2] ) ? Petshop_Desk::SALTINIAI[ $sk ][2] : strtoupper( $sk );
						$art = array( $sk, $lk, $rz[0], $vardas . ' ' . str_replace( array( ' · liko ', ' · ' ), array( ' · ', ' · ' ), $rz[1] ) );
					}
				}
				$s['riba'] = $art ? array( 'k' => $art[2], 't' => $art[3] ) : array( 'k' => 'praejo', 't' => 'ribos šiandien praėjo' );
			}
		} catch ( Throwable $e ) { $s['klaida'] = $e->getMessage(); }
		set_transient( self::TR, $s, 60 );
		return $s;
	}

	/* ============================ JUOSTA ============================ */

	public static function juosta() {
		$pg = self::puslapis();
		if ( ! $pg || ! self::gali() ) { return; }
		$s = self::skaiciai();
		$u = wp_get_current_user();
		$eile = isset( $_GET['eile'] ) ? sanitize_key( $_GET['eile'] ) : '';
		$view = isset( $_GET['view'] ) ? sanitize_key( $_GET['view'] ) : '';
		$b    = isset( $_GET['b'] ) ? sanitize_key( $_GET['b'] ) : '';
		$a = function ( $slug, $tekstas, $sk = null, $on = false, $extra = '', $title = '' ) {
			$url = admin_url( 'admin.php?page=' . $slug . $extra );
			$z = '';
			if ( is_array( $sk ) ) { foreach ( $sk as $x ) { if ( $x[0] > 0 ) { $z .= '<span class="psj-sk psj-sk-' . esc_attr( $x[2] ) . '" title="' . esc_attr( $x[1] ) . '">' . (int) $x[0] . '</span>'; } } }
			elseif ( null !== $sk && $sk > 0 ) { $z = '<span class="psj-sk">' . (int) $sk . '</span>'; }
			return '<a class="psj-a' . ( $on ? ' on' : '' ) . '" href="' . esc_url( $url ) . '"' . ( $title ? ' title="' . esc_attr( $title ) . '"' : '' ) . '>' . esc_html( $tekstas ) . $z . '</a>';
		};
		$riba = '';
		if ( ! empty( $s['riba'] ) ) { $riba = '<span class="psj-riba psj-riba-' . esc_attr( $s['riba']['k'] ) . '" title="Artimiausia sandėlio riba">' . esc_html( $s['riba']['t'] ) . '</span>'; }
		?>
		<div class="psj" id="psj" data-page="<?php echo esc_attr( $pg ); ?>">
			<div class="psj-1">
				<a class="psj-home" href="<?php echo esc_url( home_url( '/' ) ); ?>" target="_blank" rel="noopener" title="Svetainė kliento akimis (nauja kortelė)">⌂</a>
				<nav class="psj-nav">
					<?php
					echo $a( 'ps-desk', 'Užsakymai', array( array( $s['uzs'], 'reikia veiksmo', 'a' ), array( $s['neapm'], 'neapmokėti', 'n' ) ), 'ps-desk' === $pg && ! in_array( $view, array( 'rytas', 'saskaitos' ), true ) );
					echo $a( 'ps-desk', 'Rytinė eiga', null, 'ps-desk' === $pg && 'rytas' === $view, '&view=rytas' );
					echo $a( 'ps-katalogas', 'Prekės', $s['reikia'], 'ps-katalogas' === $pg, '', null === $s['reikia'] ? '' : 'reikia užsakyti: ' . (int) $s['reikia'] . ( empty( $s['reikia_laikas'] ) ? '' : ' (katalogo duomenys ' . wp_date( 'H:i', $s['reikia_laikas'] ) . ')' ) );
					echo $a( 'ps-gavimas', 'Gavimas', null, 'ps-gavimas' === $pg );
					echo $a( 'ps-tiekimas', 'Tiekimas', array( array( $s['kaup'], 'kaupiama', 'k' ), array( $s['lauk'], 'užsakyta, laukiam', 'l' ) ), 'ps-tiekimas' === $pg );
					echo $a( 'ps-rinkiniai', 'Rinkiniai', null, in_array( $pg, array( 'ps-rinkiniai', 'ps-laukai' ), true ) );
					echo $a( 'ps-akcijos', 'Akcijos', null, 'ps-akcijos' === $pg );
					echo $a( 'ps-laiskai', 'Laiškai', $s['laiskai'], in_array( $pg, array( 'ps-laiskai', 'ps-dropship' ), true ), '&b=laukia', 'laukia išsiuntimo tiekėjams' );
					?>
				</nav>
				<?php echo $riba; ?>
				<form method="get" class="psj-q" action="<?php echo esc_url( admin_url( 'admin.php' ) ); ?>">
					<input type="hidden" name="page" value="ps-desk"><input type="hidden" name="eile" value="visi">
					<input type="search" name="q" id="psjQ" placeholder="Užsakymas, klientas, el. paštas, telefonas, adresas, prekė, SKU" autocomplete="off" value="<?php echo 'ps-desk' === $pg && isset( $_GET['q'] ) ? esc_attr( sanitize_text_field( wp_unslash( $_GET['q'] ) ) ) : ''; ?>">
				</form>
				<div class="psj-r">
					<?php if ( current_user_can( 'manage_woocommerce' ) ) { echo $a( 'ps-desk', 'Sąskaitos', null, 'ps-desk' === $pg && 'saskaitos' === $view, '&view=saskaitos', 'Visos sąskaitos — PVM, išankstinės, kreditinės (PDF)' ); } // v1.7 ?>
					<?php echo $a( 'ps-ivykiai', 'Žurnalas', null, 'ps-ivykiai' === $pg, '', 'Užsakymų žurnalas — kas, ką, kada' ); ?>
					<span class="psj-user" title="<?php echo esc_attr( $u->user_login ); ?>"><?php echo esc_html( $u->display_name ); ?></span>
					<a class="psj-out" href="<?php echo esc_url( wp_logout_url( wp_login_url() ) ); ?>" title="Atsijungti">⏻</a>
				</div>
			</div>
			<div class="psj-2">
				<a class="psj-atgal" id="psjAtgal" href="<?php echo esc_url( admin_url( 'admin.php?page=ps-desk' ) ); ?>">← Atgal</a>
				<span class="psj-kelias" id="psjKelias"></span>
			</div>
		</div>
		<?php
	}

	public static function stilius() {
		if ( ! self::puslapis() || ! self::gali() ) { return; }
		?>
		<style id="psj-css">
		.psj{position:sticky;top:32px;z-index:9990;background:#1f2a24;color:#e8efe9;font:13px/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-shadow:0 1px 0 rgba(0,0,0,.25)}
		@media screen and (max-width:782px){.psj{top:46px}}
		.psj-1{display:flex;align-items:center;gap:6px;height:44px;padding:0 10px 0 6px}
		.psj-home{color:#e8efe9;text-decoration:none;font-size:18px;line-height:1;padding:6px 8px;border-radius:6px;opacity:.85}.psj-home:hover{background:rgba(255,255,255,.12);color:#fff;opacity:1}
		.psj-nav{display:flex;align-items:center;gap:2px;flex-wrap:nowrap;flex-shrink:0}
		.psj-a{color:#d5e0d8;text-decoration:none;padding:7px 10px;border-radius:6px;white-space:nowrap;display:inline-flex;align-items:center;gap:5px}
		.psj-a:hover{background:rgba(255,255,255,.1);color:#fff}.psj-a.on{background:#2d5f3f;color:#fff;font-weight:600}
		.psj-sk{display:inline-block;min-width:16px;padding:1px 6px;border-radius:10px;background:#f4b942;color:#1f2a24;font-size:11px;font-weight:700;text-align:center;line-height:1.5}
		.psj-sk-n{background:#b32d2e;color:#fff}.psj-sk-l{background:#6d8fb5;color:#fff}.psj-sk-k{background:#f4b942}
		.psj-riba{margin-left:4px;padding:4px 9px;border-radius:6px;font-size:12px;white-space:nowrap;background:rgba(255,255,255,.08);color:#cfd9d2}
		.psj-riba-skuba{background:#b32d2e;color:#fff;font-weight:600}.psj-riba-praejo{opacity:.6}
		.psj-q{margin-left:auto;display:flex;align-items:center;min-width:110px;max-width:420px;flex:1 1 110px}
		@media screen and (max-width:1250px){.psj-riba{display:none}}@media screen and (max-width:1100px){.psj-user{display:none}}@media screen and (max-width:960px){.psj-1{height:auto;flex-wrap:wrap;padding:4px 8px}.psj-q{min-width:100%;order:9}}
		.psj-q input{width:100%;height:30px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);color:#fff;border-radius:6px;padding:0 10px;font-size:12px;box-shadow:none}
		.psj-q input::placeholder{color:#9fb0a5}.psj-q input:focus{outline:none;border-color:#f4b942;background:rgba(255,255,255,.14)}
		.psj-r{display:flex;align-items:center;gap:4px;margin-left:4px}
		.psj-user{padding:0 6px;color:#9fb0a5;white-space:nowrap;max-width:140px;overflow:hidden;text-overflow:ellipsis}
		.psj-out{color:#9fb0a5;text-decoration:none;padding:4px 6px;border-radius:6px}.psj-out:hover{background:rgba(255,255,255,.12);color:#fff}
		.psj-2{display:flex;align-items:center;gap:10px;height:26px;padding:0 12px;background:#f3f6f4;color:#4b5a51;font-size:12px;border-bottom:1px solid #d9e2dc}
		.psj-atgal{color:#2d5f3f;text-decoration:none;font-weight:600;white-space:nowrap}.psj-atgal:hover{text-decoration:underline}
		.psj-kelias{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.psj-kelias a{color:#4b5a51;text-decoration:none}.psj-kelias a:hover{text-decoration:underline}.psj-kelias b{color:#1f2a24;font-weight:600}.psj-kelias i{font-style:normal;opacity:.5;margin:0 5px}
		/* Senos juostos — tik navigacinės dalys (R4: langai lieka) */
		.pskat-bar .pskat-logo,.pskat-bar .pskat-nav,.psgav-bar>a,.psgav-bar>.logo,.pd .pd-top{display:none!important}
		.pskat-kort{top:102px!important;max-height:calc(100vh - 102px)!important}
		.wrap>p:has(>a.button[href*="page=ps-desk"]:only-child){display:none!important}
		#wpbody-content>.wrap>p>a.button[href$="page=ps-desk"]{display:none!important}
		/* Vienas meniu — juosta (R3): WP kairysis meniu slepiamas, kaip desk/katalogas jau darė */
		#adminmenumain,#adminmenuback,#adminmenuwrap{display:none!important}#wpcontent,#wpfooter{margin-left:0!important}
		/* Desk yra position:fixed nuo 32px — nustumiam po juosta (32+44+26) */
		.pd{top:102px!important}
		</style>
		<?php
	}

	public static function skriptas() {
		if ( ! self::puslapis() || ! self::gali() ) { return; }
		?>
		<script id="psj-js">
		(function(){
			var K='psj_kelias', bar=document.getElementById('psj'); if(!bar) return;
			try{ var wc=document.getElementById('wpcontent'), pl=parseInt(getComputedStyle(wc).paddingLeft,10)||0; if(pl){ bar.style.marginLeft=(-pl)+'px'; } }catch(e){}
			var h1=document.querySelector('#wpbody-content h1, #wpbody-content .pd-h1, #wpbody-content .pskat-kruvos .on, #wpbody-content .psr-skirtukai .on');
			var on=bar.querySelector('.psj-nav .on');
			var h1t=''; if(h1){ h1.childNodes.forEach(function(n){ if(n.nodeType===3) h1t+=n.textContent; }); h1t=h1t.replace(/\s+/g,' ').trim()||h1.textContent.replace(/\s+/g,' ').trim(); }
			var t=(on?on.childNodes[0].textContent:'').trim()||h1t||document.title.replace(/\s*[‹|].*$/,'').trim();
			var q=new URLSearchParams(location.search), sub=[];
			['eile','view','b','kortele','akcija','partija','uzs','kruva'].forEach(function(k){ if(q.get(k)) sub.push(k==='uzs'?'#'+q.get(k):q.get(k)); });
			var name=(t+(sub.length?' · '+sub.join(' · '):'')).slice(0,48), url=location.pathname+location.search;
			var st=[]; try{ st=JSON.parse(sessionStorage.getItem(K)||'[]'); }catch(e){}
			if(!(st.length&&st[st.length-1].u===url)){
				st=st.filter(function(x){return x.u!==url;}); st.push({n:name,u:url}); if(st.length>6) st=st.slice(-6);
				try{ sessionStorage.setItem(K,JSON.stringify(st)); }catch(e){}
			}
			var el=document.getElementById('psjKelias'), at=document.getElementById('psjAtgal');
			var show=st.slice(-4), html='';
			show.forEach(function(x,i){ html+=(i?'<i>›</i>':'')+(i===show.length-1?'<b>'+esc(x.n)+'</b>':'<a href="'+esc(x.u)+'">'+esc(x.n)+'</a>'); });
			el.innerHTML=html;
			if(st.length>1){ var p=st[st.length-2]; at.href=p.u; at.textContent='← '+p.n; }
			at.addEventListener('click',function(){ try{ var s=JSON.parse(sessionStorage.getItem(K)||'[]'); s.pop(); sessionStorage.setItem(K,JSON.stringify(s)); }catch(e){} });
			document.addEventListener('keydown',function(e){
				if(e.key==='/'&&!/input|textarea|select/i.test(document.activeElement.tagName)){ var i=document.getElementById('psjQ'); if(i){ e.preventDefault(); i.focus(); } }
				if(e.key==='Escape'&&document.activeElement&&document.activeElement.id==='psjQ'){ document.activeElement.blur(); }
			});
			function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
		})();
		</script>
		<?php
	}
}

Petshop_Juosta::init();
