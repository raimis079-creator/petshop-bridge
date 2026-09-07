<?php
/**
 * Petshop Welcome Modal v1.2 (S1636) — + „Sveiki sugrįžę“ (B) variantas migruotiems klientams.
 * v1.1 (S413) — launch pasisveikinimas seniems klientams.
 *
 * SPRENDIMAS (Raimis 2026-08-04): JOKIOS NUOLAIDOS. Maisto marža 15-20%,
 * maistas = 76% pardavimų — nuolaida atiduotų pusę pelno tiems, kurie pirktų ir
 * taip. Vietoj to du keliai: augintinio anketa (vertingiau abiem) arba tik el. paštas.
 *
 * v1.2 (Raimis 2026-09-07, S1636): prisijungusiam klientui su `_ps_importas`
 * (5 666 importuoti 2026-08-31, magic login be slaptažodžio) — B variantas:
 *   - rodoma 1× per user meta ps_welcome_seen (veikia per įrenginius; cookie — tik svečiams)
 *   - my-account LEIDŽIAMAS (magic login klientą nuveda būtent ten); checkout/cart — ne
 *   - delsa 3 s, be exit intent, be naujienlaiškio bloko (jo paštą jau turim)
 *   - CTA: augintinio anketa; antrinė nuoroda — rinkiniai (kat. 91)
 *   - tekstas — Raimio (galutinis S1636); svečio (A) variantas NEKEISTAS
 *
 * Rodymo taisyklės (A — svečias / neimportuotas):
 *   - TIK kai jungiklis ijungtas (petshop_welcome_modal_enabled)
 *   - po N sekundžių puslapyje ARBA prie išėjimo (exit intent), NE iš karto
 *   - mobiliajame TIK po laiko, be exit intent (Google baudžia agresyvius)
 *   - NE checkout, NE cart, NE my-account
 *   - vienam žmogui vieną kartą; uždarius — 90 d. tyla (cookie)
 *   - prisijungusiam, kuris jau turi augintinį — NErodom
 *
 * Sąmoningai NEBLOKUOJA turinio: fonas pusiau permatomas, ESC ir X uždaro,
 * fokusas grąžinamas.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Welcome_Modal {

	const OPT_ENABLED = 'petshop_welcome_modal_enabled';
	const COOKIE      = 'psw_seen';
	const META_SEEN   = 'ps_welcome_seen';
	const TYLA_DIENOS = 90;
	const DELSA_SEK   = 12;
	const DELSA_B_SEK = 3;

	public static function init() {
		add_action( 'wp_footer', array( __CLASS__, 'render' ), 40 );
	}

	/** '' = nerodom, 'A' = svečio/launch, 'B' = migruoto kliento „Sveiki sugrįžę“. */
	protected static function variantas() {
		if ( is_admin() || wp_doing_ajax() ) return '';
		if ( ! get_option( self::OPT_ENABLED ) ) return '';
		if ( function_exists( 'is_checkout' ) && ( is_checkout() || is_cart() ) ) return '';

		if ( is_user_logged_in() ) {
			$uid = get_current_user_id();
			global $wpdb;
			$n = (int) $wpdb->get_var( $wpdb->prepare(
				"SELECT COUNT(*) FROM {$wpdb->prefix}ps_pets WHERE user_id = %d AND status = 'active'",
				$uid
			) );
			// Migruotas klientas — B: 1× per user meta, my-account leidžiamas.
			if ( get_user_meta( $uid, '_ps_importas', true ) ) {
				if ( get_user_meta( $uid, self::META_SEEN, true ) ) return '';
				if ( $n > 0 ) return '';
				return apply_filters( 'petshop_welcome_modal_show', true ) ? 'B' : '';
			}
			// Prisijungęs, kuris jau turi augintinį — jam naujiena nebe naujiena.
			if ( $n > 0 ) return '';
		}

		if ( function_exists( 'is_account_page' ) && is_account_page() ) return '';
		if ( isset( $_COOKIE[ self::COOKIE ] ) ) return '';
		return apply_filters( 'petshop_welcome_modal_show', true ) ? 'A' : '';
	}

	public static function render() {
		$v = self::variantas();
		if ( '' === $v ) return;
		$anketa = home_url( '/augintinio-profilis/' );
		$b      = ( 'B' === $v );
		if ( $b ) {
			update_user_meta( get_current_user_id(), self::META_SEEN, current_time( 'mysql' ) );
			$rink = get_term_link( 91, 'product_cat' );
			if ( is_wp_error( $rink ) ) { $rink = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/' ); }
		}
		$delsa = $b ? self::DELSA_B_SEK : self::DELSA_SEK;
		?>
		<div class="psw-ov" id="psw" hidden role="dialog" aria-modal="true" aria-labelledby="psw-t">
		  <div class="psw-box">
			<button type="button" class="psw-x" aria-label="Uždaryti">&times;</button>
			<?php if ( $b ) : ?>
			<div class="psw-t" id="psw-t">Sveiki sugrįžę – Petshop.lt atsinaujino</div>
			<div class="psw-p">
			  Smagu jus vėl matyti. Atnaujinome parduotuvę: prekių turime daugiau,
			  jas rasti lengviau.
			</div>
			<div class="psw-p psw-hi">
			  Pridėkite savo augintinį. Pagal jo svorį parodysime rekomenduojamą
			  dienos maisto normą ir kiek maitinimas kainuoja per dieną.
			</div>
			<a class="psw-b1" href="<?php echo esc_url( $anketa ); ?>">Pridėti augintinį</a>
			<a class="psw-b2 psw-b2l" href="<?php echo esc_url( $rink ); ?>">Peržiūrėti rinkinius &rarr;</a>
			<div class="psw-f">Prisijungimas liko paprastas – el. paštu, nereikia prisiminti slaptažodžio.</div>
			<?php else : ?>
			<div class="psw-t" id="psw-t">Petshop.lt atsinaujino</div>
			<div class="psw-p">
			  Ta pati parduotuvė, kurią pažįstate — naujas vaizdas ir keli dalykai,
			  kurių anksčiau nebuvo.
			</div>
			<div class="psw-p psw-hi">
			  Dabar matome, <strong>kiek jūsų augintiniui kainuoja diena</strong> ir
			  kiek maisto jam reikia pagal gamintojo lentelę — ne pagal spėjimą.
			</div>
			<a class="psw-b1" href="<?php echo esc_url( $anketa ); ?>">Susipažinkime su jūsų augintiniu</a>
			<button type="button" class="psw-b2">Tik naujienos el. paštu</button>
			<div class="psw-nl" hidden><?php echo do_shortcode( '[petshop_newsletter title="" text="" button="Prenumeruoti"]' ); ?></div>
			<div class="psw-f">Užtruks minutę. Bet kada galėsite pakeisti ar ištrinti.</div>
			<?php endif; ?>
		  </div>
		</div>
		<style>
		.psw-ov{position:fixed;inset:0;background:rgba(31,42,36,.55);z-index:99990;display:flex;
			align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .25s}
		.psw-ov.on{opacity:1}
		.psw-box{background:#fff;border-radius:14px;max-width:480px;width:100%;padding:32px;position:relative;
			max-height:90vh;overflow:auto;color:#1F2A24;box-shadow:0 8px 40px rgba(0,0,0,.2)}
		.psw-x{position:absolute;top:12px;right:14px;background:none;border:0;font-size:28px;line-height:1;
			color:#7A867C;cursor:pointer;padding:4px 8px}
		.psw-t{font-size:22px;font-weight:700;margin-bottom:12px;padding-right:24px}
		.psw-p{font-size:15px;line-height:1.6;color:#4A554C;margin-bottom:14px}
		.psw-hi{background:#F7F5F0;border-left:4px solid #2d6a35;padding:14px 16px;border-radius:6px;color:#1F2A24}
		.psw-b1{display:block;text-align:center;background:#2d6a35;color:#fff!important;text-decoration:none;
			padding:14px 20px;border-radius:8px;font-weight:600;font-size:15px;margin:20px 0 10px}
		.psw-b2{display:block;width:100%;background:none;border:1px solid #d8d2c6;color:#4A554C;
			padding:13px 20px;border-radius:8px;font-size:14px;cursor:pointer;text-transform:none}
		.psw-b2l{text-align:center;text-decoration:none;color:#4A554C!important;box-sizing:border-box}
		.psw-nl{margin-top:16px}
		.psw-nl .psnl{padding:0;max-width:none}
		.psw-f{font-size:12px;color:#7A867C;margin-top:16px;text-align:center}
		@media(max-width:480px){.psw-box{padding:26px 20px}.psw-t{font-size:20px}}
		</style>
		<script>
		(function(){
		  var ov=document.getElementById('psw'); if(!ov) return;
		  var box=ov.querySelector('.psw-box'), grazinti=null, parodytas=false;
		  function cookie(){var d=new Date();d.setTime(d.getTime()+<?php echo (int) self::TYLA_DIENOS; ?>*864e5);
			document.cookie='<?php echo esc_js( self::COOKIE ); ?>=1;expires='+d.toUTCString()+';path=/;SameSite=Lax';}
		  function rodyk(){ if(parodytas) return; parodytas=true;
			grazinti=document.activeElement; ov.hidden=false;
			requestAnimationFrame(function(){ov.classList.add('on');});
			var f=box.querySelector('.psw-b1'); if(f) f.focus();
			document.removeEventListener('mouseout',exit); }
		  var uzdarytas=false;
		  function uzdaryk(){ if(uzdarytas) return; uzdarytas=true;
			ov.classList.remove('on'); cookie();
			ov.setAttribute('hidden','hidden'); ov.style.display='none';
			if(grazinti&&grazinti.focus) try{grazinti.focus();}catch(e){} }
		  function exit(e){ if(!e.relatedTarget && e.clientY<10) rodyk(); }
		  ov.querySelector('.psw-x').addEventListener('click',uzdaryk);
		  ov.addEventListener('click',function(e){ if(e.target===ov) uzdaryk(); });
		  document.addEventListener('keydown',function(e){
			if((e.key==='Escape'||e.key==='Esc'||e.keyCode===27) && !ov.hidden){
			  e.preventDefault(); e.stopPropagation(); uzdaryk(); }
		  }, true);   // capture — kad laukas viduje neperimtu ESC
		  var b2=ov.querySelector('button.psw-b2');
		  if(b2) b2.addEventListener('click',function(){
			this.hidden=true; ov.querySelector('.psw-nl').hidden=false;
			var i=ov.querySelector('.psnl-email'); if(i) i.focus(); });
		  setTimeout(rodyk, <?php echo (int) $delsa * 1000; ?>);
		  <?php if ( ! $b ) : ?>
		  if(window.matchMedia('(min-width:768px)').matches) document.addEventListener('mouseout',exit);
		  <?php endif; ?>
		})();
		</script>
		<?php
	}
}
Petshop_Welcome_Modal::init();
