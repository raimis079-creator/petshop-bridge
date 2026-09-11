<?php
/**
 * Petshop_Product_Calc — šėrimo skaičiuoklė PREKĖS puslapyje.
 *
 * KAM: naujas klientas skuba ir anketos nekurs. Stiprybė nėra anketa —
 * stiprybė yra ATSAKYMAS: „kiek užteks ir kiek kainuos diena".
 * MASTER §3.1: nauda rodoma PRIEŠ prašant el. pašto; profilis atsiranda kaip
 * naudingo veiksmo REZULTATAS, ne kaip išankstinė prievolė.
 *
 * PRINCIPAS (užrakinta): skaičiuoklė NEVERTINA, ar maistas tinka. Ji rodo
 * gamintojo pateiktą normą, lentelės ribas arba skaičiuoja pagal vartotojo
 * faktinę porciją. Pirkti galima, šerti galima — mes tik neapsimetam žinantys
 * porcijos, kurios gamintojas nepateikė.
 *
 * VIETA (hibridas): MAŽAS kabliukas pirkimo bloke prie kainos, PILNAS
 * skaičiuotuvas PO „Į krepšelį". Ne virš CTA (mobiliajame lėtintų pirkimą),
 * ne į tabus (ten funkcija mirtų).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Petshop_Product_Calc {

	public static function init() {
		// Kabliukas pirkimo bloke — po kaina, PRIEŠ „Į krepšelį" formą.
		/* S293: KABLIUKAS NUIMTAS. Jis buvo reikalingas, kai skaičiuoklė buvo
		 * PASLĖPTA — atidarydavo ją. Dabar ji matoma iš karto, tad kabliukas
		 * tik kartojo tą patį klausimą 300 px aukščiau. Vienas įėjimas. */
		// Pilnas skaičiuotuvas — PO pirkimo formos.
		add_action( 'woocommerce_single_product_summary', array( __CLASS__, 'widget' ), 31 );
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue' ) );
	}

	public static function enqueue() {
		if ( ! function_exists( 'is_product' ) || ! is_product() ) { return; }
		$f = PETSHOP_CORE_DIR . 'assets/product-calc.js';
		if ( ! file_exists( $f ) ) { return; }
		/* S282 KLAIDA IŠTAISYTA: buvo plugins_url(..., dirname(__FILE__).'/x'),
		 * kuris duoda .../petshop-core/INCLUDES/assets/... — neegzistuojantį kelią.
		 * Skriptas patekdavo į HTML, bet 404, tad NIEKAD nepasikraudavo, ir joks
		 * skaičiavimas neveikė. Naudojam PETSHOP_CORE_URL — jis apibrėžtas
		 * pagrindiniame plugino faile ir nepalieka vietos klaidai. */
		wp_enqueue_script( 'ps-product-calc',
			PETSHOP_CORE_URL . 'assets/product-calc.js',
			array(), (string) filemtime( $f ), true );
		// REST bazė — kad JS nespėliotų kelio.
		wp_localize_script( 'ps-product-calc', 'PSPetConfig', array(
			'restUrl' => esc_url_raw( get_rest_url( null, 'petshop/v1' ) ),
		) );
	}

	/** Ar produktui apskritai verta rodyti skaičiuoklę. */
	private static function context( $product ) {
		if ( ! $product || ! $product->is_type( array( 'simple', 'variable' ) ) ) { return null; }
		$pid = (int) $product->get_id();

		// Pakuotės dydis BŪTINAS — be jo nei trukmės, nei €/dienai neapskaičiuosim.
		$pkg = class_exists( 'Petshop_Feeding_Package_Provider' )
			? Petshop_Feeding_Package_Provider::for_product( $pid ) : null;
		if ( ! is_array( $pkg ) || empty( $pkg['sellable_unit_food_g'] ) ) { return null; }

		/*
		 * S294 (savininko sprendimas 2026-08-25): skanestams ir kramtalams
		 * skaiciuokle netinka — tai ne racionas, o priedas prie maisto, todel
		 * „kiek uzteks" klausimas klaidina. Rodoma tik maisto kategorijoms.
		 */
		$slugs = wp_get_object_terms( $pid, 'product_cat', array( 'fields' => 'slugs' ) );
		if ( ! is_wp_error( $slugs ) ) {
			foreach ( (array) $slugs as $sl ) {
				if ( 0 === strpos( $sl, 'skanestai' ) || 0 === strpos( $sl, 'kramtal' ) ) { return null; }
			}
		}

		/*
		 * S1670 (Raimis 2026-09-11): ŽUVIMS skaičiuoklė netinka — prekės puslapyje
		 * rodė „Kiek šio maisto užteks jūsų šuniui?". Tikrinama kategorija ir jos tėvai.
		 */
		$kat_ids = wp_get_object_terms( $pid, 'product_cat', array( 'fields' => 'ids' ) );
		if ( ! is_wp_error( $kat_ids ) && $kat_ids ) {
			$zuv = get_term_by( 'slug', 'zuvims', 'product_cat' );
			if ( $zuv ) {
				foreach ( (array) $kat_ids as $tid ) {
					$tid = (int) $tid;
					if ( $tid === (int) $zuv->term_id || in_array( (int) $zuv->term_id, array_map( 'intval', get_ancestors( $tid, 'product_cat' ) ), true ) ) { return null; }
				}
			}
		}

		global $wpdb;
		$map = $wpdb->prefix . 'ps_feeding_map';
		$has_table = (bool) $wpdb->get_var( $wpdb->prepare(
			"SELECT 1 FROM $map WHERE product_id = %d AND is_active = 1 LIMIT 1", $pid ) );

		// Rūšis — kad tekstas būtų „šuniui" ar „katei", ne beasmenis.
		$sp = wp_get_object_terms( $pid, 'pa_gyvuno_rusis', array( 'fields' => 'slugs' ) );
		$species = 'dog';
		if ( ! is_wp_error( $sp ) && $sp ) {
			$species = in_array( 'katems', $sp, true ) ? 'cat' : 'dog';
		}
		/* S288: prisijungęs žmogus su augintiniais NETURI tyliai susikurti antro.
		 * Tokiu atveju vedam į augintinių sąrašą, kur jis pasirenka pats. */
		$pets = 0;
		if ( is_user_logged_in() ) {
			$t = $wpdb->prefix . 'ps_pets';
			if ( $wpdb->get_var( "SHOW TABLES LIKE '$t'" ) ) {
				$pets = (int) $wpdb->get_var( $wpdb->prepare(
					"SELECT COUNT(*) FROM $t WHERE user_id = %d AND deleted_at IS NULL", get_current_user_id() ) );
			}
		}
		return array( 'pid' => $pid, 'has_table' => $has_table, 'species' => $species, 'pets' => $pets );
	}

	/**
	 * Linksniai atskirai — kad sakiniai būtų taisyklingi.
	 *  nom  „Kiek sveria jūsų ŠUO?"        (vardininkas)
	 *  dat  „...užteks jūsų ŠUNIUI?"        (naudininkas)
	 *  gen  „...jūsų ŠUNS aktyvumą"         (kilmininkas)
	 */
	private static function words( $species ) {
		return ( $species === 'cat' )
			? array( 'nom' => 'katė', 'dat' => 'katei',  'gen' => 'katės' )
			: array( 'nom' => 'šuo',  'dat' => 'šuniui', 'gen' => 'šuns' );
	}

	/** S293: nebenaudojama (kabliukas nuimtas). Paliekama, jei prireiktų grąžinti. */
	public static function hook_line() {
		global $product;
		$c = self::context( $product );
		if ( ! $c ) { return; }
		$w = self::words( $c['species'] );

		/* Kabliuko tekstas SKIRIASI pagal produktą — serveris žino, ar yra
		 * lentelė. Kitaip žmogus paspaustų ir nusiviltų „o jie nežino". */
		$txt = $c['has_table']
			? 'Kiek šio maisto užteks jūsų ' . $w['dat'] . '?'
			: 'Kiek šio maisto užteks? Įveskite savo porciją';
		/* S281: TIKRA nuoroda į #ps-calc, ne mygtukas su JS.
		 * Anksčiau atidarymas rėmėsi JS klausytoju — jei jis dėl bet kokios
		 * priežasties nesuveikia, kabliukas tampa negyvas ir žmogus nieko
		 * nesupranta. Nuoroda veikia visada, net JS nepakrovus. */
		echo '<a class="ps-calc-hook" href="#ps-calc">'
			. esc_html( $txt ) . ' <span aria-hidden="true">→</span></a>';
	}

	public static function widget() {
		global $product;
		$c = self::context( $product );
		if ( ! $c ) { return; }
		$w = self::words( $c['species'] );
		self::assets();
		?>
		<div class="ps-calc" id="ps-calc"
			data-pid="<?php echo (int) $c['pid']; ?>"
			data-species="<?php echo esc_attr( $c['species'] ); ?>"
			data-has-table="<?php echo $c['has_table'] ? '1' : '0'; ?>"
			data-gen="<?php echo esc_attr( $w['gen'] ); ?>"
			data-pet="<?php echo esc_attr( $w['dat'] ); ?>"
			<?php /* S287: produkto TAPATYBĖ perduodama į anketą, kad snapshot'as
			         (name+sku+package) būtų užpildytas be papildomos užklausos. */ ?>
			data-pname="<?php echo esc_attr( $product->get_name() ); ?>"
			data-psku="<?php echo esc_attr( (string) $product->get_sku() ); ?>"
			data-ppkg="<?php echo esc_attr( (string) $product->get_attribute( 'pa_pakuotes_dydis' ) ); ?>"
			data-pets="<?php echo (int) $c['pets']; ?>"
			data-account="<?php echo esc_attr( wc_get_account_endpoint_url( 'augintinis' ) ); ?>"
			data-listurl="<?php echo esc_attr( ( class_exists( 'Petshop_Weight_Filter' ) && Petshop_Weight_Filter::enabled() ) ? Petshop_Weight_Filter::target_url( $c['species'] ) : '' ); ?>">
			<?php /* S281: NESLEPIAM. Paslėptas blokas priklauso nuo JS, o dev
			         aplinkoje viskas turi matytis iš karto (Raimio nurodymas). */ ?>

			<div class="ps-calc-head">
				<div class="ps-calc-h1">Kiek šio maisto užteks jūsų <?php echo esc_html( $w['dat'] ); ?>?</div>
				<div class="ps-calc-h2"><?php echo esc_html( $c['has_table']
					? 'Sužinokite pakuotės trukmę ir dienos kainą.'
					: 'Įveskite savo porciją — apskaičiuosime pakuotės trukmę ir dienos kainą.' ); ?></div>
			</div>

			<?php if ( $c['has_table'] ) : ?>
				<div class="ps-calc-row" data-ps-mode="weight">
					<label for="ps-calc-w">Kiek sveria jūsų <?php echo esc_html( $w['nom'] ); ?>?</label>
					<div class="ps-calc-in">
						<span class="ps-calc-unit"><input type="number" id="ps-calc-w" min="0.5" max="120" step="0.1" inputmode="decimal" placeholder="0"><i>kg</i></span>
						<button type="button" class="ps-calc-go">Apskaičiuoti →</button>
					</div>
				</div>
			<?php endif; ?>

			<?php /* S286: AMŽIUS. 104 produktai (šuniukų/kačiukų maistai, 62 lentelės)
			         turi normas PAGAL AMŽIŲ — svoriai jose persidengia (3,0–3,5 kg
			         8 mėn. ir 3,0–5,0 kg 10–12 mėn.), tad vien svoris atsakymo
			         neduoda. Be šio lauko anonimas negaudavo NIEKO — o užrakintas
			         principas sako, kad rezultatą jis turi gauti iš karto.
			         Rodom TIK kai variklis grąžina AGE_REQUIRED. */ ?>
			<div class="ps-calc-row ps-hide" data-ps-mode="age">
				<label for="ps-calc-a">Kiek mėnesių jūsų augintiniui?</label>
				<div class="ps-calc-in">
					<span class="ps-calc-unit"><input type="number" id="ps-calc-a" min="1" max="300" step="1" inputmode="numeric" placeholder="0"><i>mėn.</i></span>
					<button type="button" class="ps-calc-go-age">Apskaičiuoti →</button>
				</div>
				<p class="ps-calc-note">Šio maisto gamintojas normas pateikia pagal amžių.</p>
			</div>

			<div class="ps-calc-row<?php echo $c['has_table'] ? ' ps-hide' : ''; ?>" data-ps-mode="portion">
				<label for="ps-calc-p">Kiek gramų duodate per dieną?</label>
				<div class="ps-calc-in">
					<span class="ps-calc-unit"><input type="number" id="ps-calc-p" min="1" max="5000" step="1" inputmode="numeric" placeholder="0"><i>g</i></span>
					<button type="button" class="ps-calc-go-portion">Apskaičiuoti →</button>
				</div>
				<?php /* S294: paaiškinimas NEBEKARTOJAMAS — nuo S293 jis yra antraštėje.
				         Tas pats sakinys dukart viename bloke atrodo kaip klaida. */ ?>
			</div>

			<div class="ps-calc-out" aria-live="polite"></div>
		</div>
		<?php
	}

	private static function assets() {
		static $done = false;
		if ( $done ) { return; }
		$done = true;
		?>
		<style>
		/* S293: skaičiuoklė — ANTRINIS sluoksnis. „Į krepšelį" lieka vienintelis
		   pilnai užpildytas žalias mygtukas puslapyje.
		   Smėlio tonas #F3EFE5 (ne oranžinis!) — oranžinė meniu jau reiškia
		   „Pasiūlymai", tad skaičiuoklė būtų palaikyta akcija. Smėlis priklauso
		   „Mano augintinis" pasauliui — vizualiai tas pats sluoksnis. */
		.ps-calc{margin:16px 0 6px;background:#F3EFE5;border:1px solid #E5DCCB;
			border-left:3px solid #2F6B4F;border-radius:14px;padding:16px 18px;scroll-margin-top:110px}
		@media (max-width:849px){ .ps-calc{scroll-margin-top:80px} }
		.ps-calc[hidden]{display:none}
		.ps-calc-head{margin-bottom:13px}
		.ps-calc-h1{font-size:15px;font-weight:750;color:#1F2A24;line-height:1.3;letter-spacing:-.01em}
		.ps-calc-h2{font-size:13px;color:#6B7A70;margin-top:4px;line-height:1.45}
		.ps-calc-row+.ps-calc-row{margin-top:12px;padding-top:12px;border-top:1px solid #E5DCCB}
		.ps-calc-row.ps-hide{display:none}
		.ps-calc label{display:block;font-size:13.5px;font-weight:650;color:#2A352E;margin-bottom:7px}
		.ps-calc-in{display:flex;gap:9px;flex-wrap:wrap;align-items:stretch}
		/* S298: laukas ir mygtukas turi VIENODĄ aukštį. Įvyniojus lauką į <span>
		   flex aukščiai išsiderino — dabar fiksuotas 46px abiem, box-sizing
		   border-box, ir Flatsome margin'ai nunulinti. */
		.ps-calc-unit{position:relative;flex:1 1 150px;min-width:130px;display:flex}
		.ps-calc-unit input{width:100%;height:46px;box-sizing:border-box;margin:0;
			border:1px solid #D8D2C6;border-radius:11px;padding:0 44px 0 13px;
			font:inherit;font-size:15px;line-height:44px;background:#fff;box-shadow:none}
		.ps-calc-unit input:focus{border-color:#2F6B4F;outline:none;box-shadow:0 0 0 3px rgba(47,107,79,.12)}
		.ps-calc-unit i{position:absolute;right:0;top:0;bottom:0;width:38px;
			display:flex;align-items:center;justify-content:flex-start;
			font-style:normal;font-size:13.5px;font-weight:650;color:#8A968C;pointer-events:none}
		.ps-calc-in button{flex:0 0 auto;height:46px;box-sizing:border-box;margin:0;
			display:inline-flex;align-items:center;justify-content:center;
			background:#fff;color:#2F6B4F;border:1.5px solid #2F6B4F;
			border-radius:11px;padding:0 20px;font:inherit;font-size:14px;font-weight:650;cursor:pointer;
			text-transform:none;letter-spacing:normal;line-height:1}
		.ps-calc-in button:hover{background:#2F6B4F;color:#fff}
		.ps-calc-note{font-size:12.5px;color:#6B7A70;margin:8px 0 0;line-height:1.45}
		.ps-calc-out{margin-top:2px}
		.ps-calc-res{background:#fff;border-radius:13px;padding:15px 16px;margin-top:12px;text-align:center}
		.ps-calc-res .big{font-size:24px;font-weight:750;color:#1F4E39;letter-spacing:-.02em;line-height:1.15}
		.ps-calc-res .sub{font-size:13px;color:#5A665C;margin-top:5px;line-height:1.5}
		.ps-calc-res .src{font-size:12px;color:#8A968C;margin-top:8px;line-height:1.45}
		.ps-calc-info{background:#fff;border-radius:13px;padding:14px 16px;margin-top:12px;
			font-size:13.5px;color:#5A665C;line-height:1.55}
		.ps-calc-cta{display:inline-block;margin-top:10px;border:1px solid #C9D8CD;background:#fff;
			border-radius:999px;padding:9px 16px;font-size:13px;font-weight:650;color:#2F6B4F;text-decoration:none}
		.ps-calc-cta:hover{background:#F4F8F5;color:#1F4E39}
		.ps-calc-err{font-size:13px;color:#B4553F;margin-top:10px}
		/* S283: ANTRINIS blokas — ramesnis uz rezultata ir uz „I krepseli". */
		.ps-calc-save{margin-top:12px;padding-top:12px;border-top:1px solid #E5DCCB}
		.ps-calc-save-t{font-size:13.5px;font-weight:700;color:#1F2A24}
		.ps-calc-save-p{font-size:12.5px;color:#6B7A70;line-height:1.5;margin-top:4px}
		.ps-calc-save-btn{display:inline-block;margin-top:10px;border:1px solid #C9D8CD;background:#fff;
			border-radius:999px;padding:9px 17px;font-size:13px;font-weight:650;color:#2F6B4F;text-decoration:none}
		.ps-calc-save-btn:hover{background:#F4F8F5;border-color:#B9D3C1;color:#1F4E39}
		/* S288: patvirtinimas grįžus iš anketos. */
		.ps-calc-saved{background:#E8F1EA;border:1px solid #CBE0D2;border-radius:13px;padding:13px 15px;margin-bottom:12px}
		.ps-calc-saved-t{font-size:14px;font-weight:700;color:#1F4E39}
		.ps-calc-saved-p{font-size:12.5px;color:#5A665C;margin-top:3px;line-height:1.45}
		</style>
		<?php
	}
}
