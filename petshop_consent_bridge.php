/**
 * Petshop Consent Bridge v1.1 (Complianz -> GTM)
 *
 * Vienas inline blokas wp_head'e, PRIES GTM snippet'a (prio 0 < prio 1):
 *   1. Google Consent Mode v2 DEFAULT (visi denied)
 *   2. Jei Complianz cookies jau yra (pakartotinis lankytojas) -> consent UPDATE
 *   3. Listener'iai cmplz_status_change / cmplz_fire_categories -> consent UPDATE + dataLayer event
 *   4. v1.1: po sutikimo pakartoja ecommerce event'a (view_item ir pan.), kuris ivyko pries sutikima
 *
 * KODEL cia, o ne GTM tag'e:
 *   consent default privalo buti dataLayer'yje PRIES consent update.
 *   GTM Consent Initialization tag'as fire'ina tik po gtm.js uzsikrovimo,
 *   o sis snippet'as vykdomas sinchroniskai anksciau. Tvarka garantuota tik cia.
 *
 * SVARBU: GTM tag'as "00 — Consent Mode v2 Default" turi buti ISTRINTAS/PAUZUOTAS,
 *         kitaip default perrasys update.
 *
 * Kategoriju atitikmenys:
 *   cmplz statistics -> analytics_storage
 *   cmplz marketing  -> ad_storage, ad_user_data, ad_personalization
 *
 * Scope: front-end only
 */

if ( ! defined( 'ABSPATH' ) ) { return; }

if ( ! function_exists( 'petshop_consent_bridge' ) ) {
	function petshop_consent_bridge() {
		if ( is_admin() ) { return; }

		$js = <<<'PETSHOPCONSENT'
<script data-petshop-consent-bridge="1">
(function () {
	window.dataLayer = window.dataLayer || [];
	function gtag() { window.dataLayer.push(arguments); }

	/* ---- 1. CONSENT MODE v2 DEFAULT (privalo buti pirmas) ---- */
	gtag('consent', 'default', {
		'ad_storage': 'denied',
		'ad_user_data': 'denied',
		'ad_personalization': 'denied',
		'analytics_storage': 'denied',
		'functionality_storage': 'granted',
		'personalization_storage': 'granted',
		'security_storage': 'granted',
		'wait_for_update': 500
	});
	gtag('set', 'ads_data_redaction', true);
	gtag('set', 'url_passthrough', true);

	/* ---- 2. Pagalbines ---- */
	function cookieVal(name) {
		var m = document.cookie.match(new RegExp('(?:^|;\\s*)' + name.replace(/[-]/g, '\\-') + '=([^;]*)'));
		return m ? decodeURIComponent(m[1]) : null;
	}

	function hasConsent(cat) {
		if (typeof window.cmplz_has_consent === 'function') {
			try { return !!window.cmplz_has_consent(cat); } catch (e) {}
		}
		return cookieVal('cmplz_' + cat) === 'allow';
	}

	function sendConsentUpdate(source) {
		var stats = hasConsent('statistics');
		var mkt   = hasConsent('marketing');

		gtag('consent', 'update', {
			'analytics_storage':  stats ? 'granted' : 'denied',
			'ad_storage':         mkt   ? 'granted' : 'denied',
			'ad_user_data':       mkt   ? 'granted' : 'denied',
			'ad_personalization': mkt   ? 'granted' : 'denied'
		});

		window.dataLayer.push({
			event: 'cmplz_consent_update',
			cmplz_statistics: stats ? 'granted' : 'denied',
			cmplz_marketing:  mkt   ? 'granted' : 'denied',
			cmplz_source: source || 'unknown'
		});
	}

	/* ---- 3. Pakartotinis lankytojas: sutikimas jau issaugotas ---- */
	var hasConsentSnapshot = hasConsent('statistics');
	if (cookieVal('cmplz_banner-status') !== null) {
		sendConsentUpdate('cookie');
	}

	/* ---- 4. Naujas sutikimas arba pakeitimas ---- */
	var timer = null;
	function schedule() {
		if (timer) { clearTimeout(timer); }
		timer = setTimeout(function () {
			var wasDenied = !hasConsentSnapshot;
			sendConsentUpdate('event');
			if (hasConsent('statistics')) { replayEcommerce(); }
		}, 60);
	}
	document.addEventListener('cmplz_status_change', schedule);
	document.addEventListener('cmplz_fire_categories', schedule);

	/* ---- 5. Ecommerce replay ----
	 * view_item / view_cart ivyksta puslapio uzkrovime, pries sutikima.
	 * Po sutikimo GA4 tag'as jau nebefire'ins, nes trigger'is praejo.
	 * Todel paskutini ecommerce event'a pakartojam VIENA karta. */
	var replayed = false;
	function replayEcommerce() {
		if (replayed) { return; }
		var dl = window.dataLayer || [];
		var last = null;
		for (var i = dl.length - 1; i >= 0; i--) {
			var x = dl[i];
			if (x && x.event && x.ecommerce && x.event !== 'cmplz_consent_update') { last = x; break; }
		}
		if (!last) { return; }
		replayed = true;
		var copy = JSON.parse(JSON.stringify(last));
		copy.cmplz_replay = true;
		window.dataLayer.push({ ecommerce: null });
		window.dataLayer.push(copy);
	}
})();
</script>
PETSHOPCONSENT;

		echo "\n" . $js . "\n";
	}
}
add_action( 'wp_head', 'petshop_consent_bridge', 0 );
