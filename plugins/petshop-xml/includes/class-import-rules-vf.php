<?php
defined( 'ABSPATH' ) || exit;

/**
 * Petshop_Import_Rules_VF v1.1
 *
 * VF (Vetfarmas) importo taisyklės. ATSKIRA NUO ZB.
 *
 * v1.1 (2026-09-02, S1591): atidarytos VET hipoalerginių KONSERVŲ kategorijos
 *   ('VET kons. hipoalerginis maistas šunims' → konservai-sunims,
 *    'VET kons. hipoalerginis maistas katėms' → konservai-katems).
 *   Iki šiol sąmoningai nemapintos (2026-05: Exclusion Hypo konservai laikyti
 *   tik AV sandėlyje, kad nesidubliuotų). Dabar modelis „viena prekė — du
 *   sandėliai" (AV `_own_stock_qty` + VF `_vf_qty`), tad VF gali suporuoti
 *   esamas AV prekes per EAN (Scenarijus A) ir kurti trūkstamas pakuotes.
 *   Taip pat category_groups_map 'konservai' += 'kons.' — kitaip grupė krito
 *   į 'aksesuarai' ir 2,5 € konservas atmestas (aksesuarai_below_6eur).
 *   Savininko sprendimas 2026-09-02.
 *
 * Funkcijos:
 *   - vf_should_import() — pilna filter logika (blocked/medication/kainos ribos/etc)
 *   - normalize_brand() — JOSERA EXCLU → Josera, EXCL MEDITER → Exclusion, etc.
 *   - get_wc_category_slug() — VF kategorija → WC slug per vf_category_map[]
 */
class Petshop_Import_Rules_VF {

	/**
	 * Blocked brand'ai — nei vienas vf_should_import nepraeina.
	 * Medikamentai, akvariumo chemija, veterinariniai.
	 */
	private array $blocked_now_brands = [
		'AQUAEL', 'ARISTA LATIN', 'BAVARO', 'BIOWET DRWAL', 'BIOWET-PULAW',
		'CLASSEUR', 'COSYFLOCK', 'CP-PHARMA', 'ELANCO',
		'HUVEPHARMA', 'KRKA', 'MED. EQUIOM.', 'MSD',
		'MSSCHIPPER', 'PERFECTO', 'RICHTER', 'RIO', 'VETFARMAS',
		'VETVIVA RICH', 'ZOETIS',
	];

	/**
	 * Review later — atmesti dabar, peržiūrėti po launch'o.
	 */
	private array $review_later_brands = [ 'EXCL VETDIET', 'JOSERA HELP' ];

	/**
	 * Specifiniai SKU, kurių neimportuojam.
	 */
	private array $excluded_skus = [ 'VET1400' ];

	/**
	 * Medikamentų raktažodžiai — jei VF kategorijoje randamas, atmetama.
	 */
	private array $medication_keywords = [
		'antimikrob', 'endoparaz', 'ektoparaz', 'vakcin', 'nvnu',
		'hormon', 'insektici', 'akarici', 'gydomi', 'oraliai naudoj',
		'injekcin', 'infuzin', 'apsauginiai žaizd', 'antibakterini',
		'priešgrybeli', 'tepalai turintys antimikrob',
		'kontaktiniai insekticidai', 'priemonės nuo dumblių',
		'kateteriai', 'šlapimo pūslės kateteri', 'kita instrumentika',
		'kartūs bintai', 'nekartūs bintai', 'vienkartinės pirštinės',
	];

	/**
	 * VF kategorijos → grupė (kainų ribų patikrai).
	 */
	private array $category_groups_map = [
		'sausas'     => [ 'sausas' ],
		'konservai'  => [ 'konserv', 'drėgn', 'kons.' ], // v1.1: 'kons.' — VF sutrumpinimas („VET kons. hipoalerginis…")
		'skanestai'  => [ 'skanėst', 'skaneast', 'lazdel', 'pagalvel', 'subprodukt' ],
		'kraikai'    => [ 'kraikas', 'kraik' ],
		'higiena'    => [ 'šampūn', 'sampun', 'priežiūr', 'prieziur', 'pokail', 'šuk', 'epec', 'higien', 'dezinfek', 'kvap', 'dėmi' ],
		'vitaminai'  => [ 'vitamin', 'papild', 'mineral' ],
		'aksesuarai' => [ 'žaisl', 'zaisl', 'pavadž', 'pavad', 'antkakl', 'guoli', 'krepš', 'transport', 'narvas', 'narv', 'inda', 'dubenel', 'draskykl', 'apyka', 'pala', 'petneš', 'meškr', 'apranga', 'akvariu', 'filtra', 'grunt' ],
	];

	/**
	 * Brand normalization: VF XML brand → konsoliduotas brand (taksonomija).
	 */
	private array $brand_normalize = [
		'JOSERA'        => 'Josera',
		'JOSERA JOSI'   => 'Josera',
		'JOSERA EXCLU'  => 'Josera',
		'EXCL MEDITER'  => 'Exclusion',
		'EXCL HYPO'     => 'Exclusion',
		'GREENPETFOOD'  => 'GreenPetFood',
		// Kiti VF brand'ai → naudoja XML pavadinimą kaip yra (per fallback)
	];

	/**
	 * VF → WC kategorijų mapping (galutinis, iš v3 audit).
	 * 132 įrašai. NEMAPINTI VF cat'ai (medication, terariumai, chemija) → skip importo.
	 */
	private array $vf_category_map = [
		// ŠUNIMS / MAISTAS
		'Reguliarus sausas suaugusių šunų maista'  => 'sausas-maistas-sunims',
		'Reguliarus sausas šuniukų maistas'        => 'sausas-maistas-sunims',
		'Reguliarus sausas jaunų šunų maistas'     => 'sausas-maistas-sunims',
		'Reguliarus sausas pagyven. šunų maistas'  => 'sausas-maistas-sunims',
		'VET sausas hipoalerginis maistas šunims'  => 'sausas-maistas-sunims',
		'VET kons. hipoalerginis maistas šunims'   => 'konservai-sunims',        // v1.1
		'Reg. konservuotas suaugusių šunų maistas' => 'konservai-sunims',
		'Reg. konservuotas jaunų šunų maistas'     => 'konservai-sunims',
		'Reguliarus konservuotas šuniukų maistas'  => 'konservai-sunims',
		// ŠUNIMS / SKANĖSTAI
		'Grynos mėsos skanėstai šunims'      => 'skanestai-sunims',
		'Kiti skanėstai šunims'              => 'skanestai-sunims',
		'Lazdelės skanėstai šunims'          => 'skanestai-sunims',
		'Džiovinti subproduktai šunims'      => 'skanestai-sunims',
		'Skysti skanėstai šunims'            => 'skanestai-sunims',
		'Sausainiai skanėstai šunims'        => 'skanestai-sunims',
		'Skanėstų dėklai šunims'             => 'skanestai-sunims',
		'Funkciniai dantų skanėstai šunims'  => 'skanestai-sunims',
		'Žaislai skanėstams šunims'          => 'skanestai-sunims',
		// ŠUNIMS / AKSESUARAI
		'Automatiniai pavadžiai šunims'         => 'antkakliai-pavadeliai-sunims',
		'Apsauginė apykaklė'                    => 'antkakliai-pavadeliai-sunims',
		'Šviesą atspindintys pakabukai'         => 'antkakliai-pavadeliai-sunims',
		'Medžiaginiai guoliai su borteliais'    => 'guoliai-boksai-sunims',
		'Medžiaginiai guoliai būdelės'          => 'guoliai-boksai-sunims',
		'Kiti guoliai'                          => 'guoliai-boksai-sunims',
		'Medžiaginiai kilimėliai, pledai'       => 'guoliai-boksai-sunims',
		'Pernešimo krepšiai'                    => 'transportavimo-dezes-sunims',
		'Transportavimo boksai'                 => 'transportavimo-dezes-sunims',
		'Kita transportavimo įranga ir priedai' => 'transportavimo-dezes-sunims',
		'Lavinantys žaislai šunims'             => 'zaislai-sunims',
		'Medžiaginiai žaislai šunims'           => 'zaislai-sunims',
		'Guminiai žaislai šunims'               => 'zaislai-sunims',
		'Indai su stovais šunims'               => 'dubeneliai-sunims',
		'Kiti indai šunims'                     => 'dubeneliai-sunims',
		'Plastikiniai indai šunims'             => 'dubeneliai-sunims',
		'Lėto valgymo indai šunims'             => 'dubeneliai-sunims',
		'Maisto talpyklos'                      => 'dubeneliai-sunims',
		'Nailoninės petnešos šunims'            => 'apranga-sunims',
		'Šviesą atspindinčios petnešos šunims'  => 'apranga-sunims',
		'Paltukai ir striukės šunims'           => 'apranga-sunims',
		'Kita apranga ir pagalbinės priemonės'  => 'apranga-sunims',
		'Džemperiai, megztiniai šunims'         => 'apranga-sunims',
		'Kondicionieriai šunims kasdieniai'        => 'higienos-priemones-sunims',
		'Vėsinantys kilimėliai ir kitos priemonės' => 'higienos-priemones-sunims',
		// ŠUNIMS / HIGIENA
		'Šampūnai šunims kasdieniniai'         => 'sampunai-sunims',
		'Šampūnai jauniems šunims'             => 'sampunai-sunims',
		'Šampūnai baltakailiams šunims'        => 'sampunai-sunims',
		'Šukos šunims naminiams gyvūnams'      => 'sukos-sepeciai-zirkles-sunims',
		'Pokailio išėmėjai (furminatoriai)'    => 'sukos-sepeciai-zirkles-sunims',
		'Šepečiai naminiams gyvūnams'          => 'sukos-sepeciai-zirkles-sunims',
		'Dantų priežiūros rinkiniai'           => 'sukos-sepeciai-zirkles-sunims',
		'Žirklės nagams naminiams gyvūnams'    => 'sukos-sepeciai-zirkles-sunims',
		'Kirpimo mašinėlės naminiams gyvūnams' => 'sukos-sepeciai-zirkles-sunims',
		'Dildės, nagų šlifuokliai gyvūnams'    => 'sukos-sepeciai-zirkles-sunims',
		'Dantų pastos'                         => 'higienos-priemones-sunims',
		'Ausų valikliai ir losjonai'           => 'higienos-priemones-sunims',
		'Nasrų valymo  ir skalavimo skysčiai'  => 'higienos-priemones-sunims',
		'Miltelių pavidalo nasrų higiena'      => 'higienos-priemones-sunims',
		'Tepalai nuo uždegimo'                 => 'higienos-priemones-sunims',
		'Tepalai odos apsauginiam sluoksniui'  => 'higienos-priemones-sunims',
		'Kvapų ir dėmių šalinimo priemonės'    => 'higienos-priemones-sunims',
		'Vienkartinės palos'                   => 'higienos-priemones-sunims',
		// ŠUNIMS / VITAMINAI
		'Kiti papildai šunims ir katėms'           => 'vitaminai-ir-papildai-sunims',
		'Papildai žarnyno veiklai pastos pavidalu' => 'vitaminai-ir-papildai-sunims',
		'Papildai žarnyno veiklai milteliniai'     => 'vitaminai-ir-papildai-sunims',
		'Papildai dermatologijai pastos pavidalu'  => 'vitaminai-ir-papildai-sunims',
		'Papildai dermatologijai tabletėmis'       => 'vitaminai-ir-papildai-sunims',
		'Papildai streso mažinimui tabletėmis'     => 'vitaminai-ir-papildai-sunims',
		'Papildai streso mažinimui pastos pavid.'  => 'vitaminai-ir-papildai-sunims',
		'Papildai imuniteto stiprinimui milteliai' => 'vitaminai-ir-papildai-sunims',
		'Papildai imuniteto stiprinimui pasta'     => 'vitaminai-ir-papildai-sunims',
		'Papildai sąnariams skysčio pavidalo'      => 'vitaminai-ir-papildai-sunims',
		'Kitos formos papildai sąnariams'          => 'vitaminai-ir-papildai-sunims',
		'Papildai inkstams milteliais'             => 'vitaminai-ir-papildai-sunims',
		'Papildai inkstams pastos pavidalo'        => 'vitaminai-ir-papildai-sunims',
		'Papildai šlapimo takams tabletėmis'       => 'vitaminai-ir-papildai-sunims',
		'Papildai šlapimo takams pastos pavidalu'  => 'vitaminai-ir-papildai-sunims',
		'Kitos formos papildai šlapimo takams'     => 'vitaminai-ir-papildai-sunims',
		'pieno pakaitalai milteliais'              => 'vitaminai-ir-papildai-sunims',
		// KATĖMS / MAISTAS
		'Reg. konservuotas suaugusių kačių maista' => 'konservai-katems',
		'Reg. konservuotas kačiukų maistas'        => 'konservai-katems',
		'Reg. konservuotas pagyven.kačių maistas'  => 'konservai-katems',
		'Reg. sausas suaugusių kačių maistas'      => 'sausas-maistas-katems',
		'Reg. sausas kačiukų maistas'              => 'sausas-maistas-katems',
		'Reg. sausas pagyvenusių kačių maistas'    => 'sausas-maistas-katems',
		'Reg. sausas sterilizuotų kačių maistas'   => 'sausas-maistas-katems',
		'VET sausas hipoalerginis maistas katėms'  => 'sausas-maistas-katems',
		'VET kons. hipoalerginis maistas katėms'   => 'konservai-katems',        // v1.1
		// KATĖMS / SKANĖSTAI
		'Skysti skanėstai katėms'       => 'skanestai-katems',
		'Kiti skanėstai katėms'         => 'skanestai-katems',
		'Funkciniai skanėstai katėms'   => 'skanestai-katems',
		'Pagalvėlės skanėstai katėms'   => 'skanestai-katems',
		'Grynos mėsos skanėstai katėms' => 'skanestai-katems',
		'Lazdelės skanėstai katėms'     => 'skanestai-katems',
		// KATĖMS / KRAIKAI
		'Medžio drožlių granulių kraikas katėms' => 'kraikai-kaciu-tualetams',
		'Bentonitinis kraikas katėms'            => 'kraikai-kaciu-tualetams',
		'Tofu kraikas katėms'                    => 'kraikai-kaciu-tualetams',
		'Silikoninis kraikas katėms'             => 'kraikai-kaciu-tualetams',
		'Kitų rūšių kraikas katėms'              => 'kraikai-kaciu-tualetams',
		'Kitų rūšių kraikas gyvūnams'            => 'kraikai-kaciu-tualetams',
		// KATĖMS / TUALETAI
		'Uždari tualetai katėms' => 'tualetai-kraikai-semtuveliai',
		'Atviri tualetai katėms' => 'tualetai-kraikai-semtuveliai',
		'Kilimėliai tualetams'   => 'tualetai-kraikai-semtuveliai',
		// KATĖMS / AKSESUARAI
		'Draskyklės iki 80 cm katėms'           => 'draskykles-katems',
		'Draskyklės virš 80 cm katėms'          => 'draskykles-katems',
		'Kartoninės draskyklės katėms'          => 'draskykles-katems',
		'Draskyklės lentelės/kilimėliai katėms' => 'draskykles-katems',
		'Lavinantys žaislai katėms'             => 'zaislai-katems',
		'Automatiniai indai katėms'             => 'dubeneliai-katems',
		'Plastikiniai indai katėms'             => 'dubeneliai-katems',
		// KATĖMS / PRIEŽIŪRA
		'Kačių šampūnai kasdieniniai' => 'prieziuros-priemones-katems',
		// GRAUŽIKAMS
		'Visų graužikų skanėstai'   => 'skanestai-grauzikams',
		'Triušių pašaras'           => 'pasaras-grauzikams',
		'Šinšilų pašaras'           => 'pasaras-grauzikams',
		'Jūros kiaulyčių pašaras'   => 'pasaras-grauzikams',
		'Žiurkėnų narvai'           => 'narvai-grauzikams',
		'Triušių narvai'            => 'narvai-grauzikams',
		'Narvai'                    => 'narvai-grauzikams',
		'Nameliai graužikų narvams' => 'narvai-grauzikams',
		// ŽUVIMS
		'Akvariumai be įrangos'               => 'akvariumai-iranga',
		'Akvariumų filtrai ir filtrų priedai' => 'akvariumai-iranga',
		'Akvariumų šildytuvai'                => 'akvariumai-iranga',
		'Akvariumų pompos'                    => 'akvariumai-iranga',
		'Akvariumų dekoracijos'               => 'akvariumai-iranga',
		// SKIP (intentionally unmapped):
		// 'Terariumai' — ropliai scope ne launch'ui
		// 'Inj.pirmuonis veik.spec.paskirties prep.' — medication-adjacent
		// 'Produktai, naudojami medžiagoms ir paviršiams...' — chemija
		// 'Produktai, naudojami veterinarinės higienai...' — klinikinė chemija
	];

	/**
	 * Normalizuoja brand pavadinimą.
	 * JOSERA EXCLU → Josera, EXCL MEDITER → Exclusion, etc.
	 */
	public function normalize_brand( string $vf_brand ): string {
		$trimmed = trim( $vf_brand );
		return $this->brand_normalize[ $trimmed ] ?? $trimmed;
	}

	/**
	 * Grąžina WC kategorijos slug pagal VF kategoriją.
	 * NULL jei nėra mapping (prekė bus skip'inama).
	 */
	public function get_wc_category_slug( string $vf_category ): ?string {
		return $this->vf_category_map[ trim( $vf_category ) ] ?? null;
	}

	/**
	 * Pilna VF filter logika.
	 *
	 * @return array{import: bool, reason?: string, group?: string}
	 */
	public function vf_should_import( string $brand, string $sku, string $category, string $description, string $name, float $personal_price ): array {

		$brand_trimmed = trim( $brand );
		$cat_lower = mb_strtolower( $category, 'UTF-8' );

		// 1. Blocked brands
		if ( in_array( $brand_trimmed, $this->blocked_now_brands, true ) ) {
			return [ 'import' => false, 'reason' => 'brand_blocked_now' ];
		}
		if ( in_array( $brand_trimmed, $this->review_later_brands, true ) ) {
			return [ 'import' => false, 'reason' => 'brand_review_later' ];
		}

		// 2. Brand + description empty
		$desc_decoded = trim( base64_decode( $description ) );
		if ( empty( $brand_trimmed ) && empty( $desc_decoded ) ) {
			return [ 'import' => false, 'reason' => 'brand_missing_no_description' ];
		}

		// 3. Excluded SKU
		if ( in_array( $sku, $this->excluded_skus, true ) ) {
			return [ 'import' => false, 'reason' => 'excluded_sku' ];
		}

		// 4. Medication keywords
		foreach ( $this->medication_keywords as $kw ) {
			if ( mb_strpos( $cat_lower, $kw ) !== false ) {
				return [ 'import' => false, 'reason' => 'medication_blocked' ];
			}
		}

		// 5. Paukš/žirg blocked
		if ( mb_strpos( $cat_lower, 'paukš' ) !== false
		     || mb_strpos( $cat_lower, 'papūg' ) !== false
		     || mb_strpos( $cat_lower, 'lesalas' ) !== false ) {
			return [ 'import' => false, 'reason' => 'pauks_blocked' ];
		}
		if ( mb_strpos( $cat_lower, 'žirg' ) !== false ) {
			return [ 'import' => false, 'reason' => 'zirg_blocked' ];
		}

		// 6. Determine group
		$group = null;
		foreach ( $this->category_groups_map as $g => $keywords ) {
			foreach ( $keywords as $kw ) {
				if ( mb_strpos( $cat_lower, $kw ) !== false ) {
					$group = $g;
					break 2;
				}
			}
		}
		if ( ! $group ) $group = 'aksesuarai';

		// 7. Per-group price rules
		$price = (float) $personal_price;
		switch ( $group ) {
			case 'sausas':
			case 'konservai':
			case 'vitaminai':
				return [ 'import' => true, 'group' => $group ];

			case 'skanestai':
				if ( $brand_trimmed === 'CHURU' ) return [ 'import' => true, 'group' => 'skanestai' ];
				if ( $price >= 2.0 ) return [ 'import' => true, 'group' => 'skanestai' ];
				return [ 'import' => false, 'reason' => 'skanestai_below_2eur' ];

			case 'kraikai':
				if ( in_array( $brand_trimmed, [ "CAT'S_BEST", "JOE'S_CAT" ], true ) ) return [ 'import' => true, 'group' => 'kraikai' ];
				if ( $brand_trimmed === 'EXPERTUS' && mb_stripos( $name, 'tofu' ) !== false ) return [ 'import' => true, 'group' => 'kraikai' ];
				if ( $price >= 5.0 ) return [ 'import' => true, 'group' => 'kraikai' ];
				return [ 'import' => false, 'reason' => 'kraikai_below_5eur' ];

			case 'higiena':
				if ( $brand_trimmed === 'VETOCANIS' ) return [ 'import' => true, 'group' => 'higiena' ];
				if ( $price >= 2.0 ) return [ 'import' => true, 'group' => 'higiena' ];
				return [ 'import' => false, 'reason' => 'higiena_below_2eur' ];

			case 'aksesuarai':
			default:
				if ( $price >= 6.0 ) return [ 'import' => true, 'group' => 'aksesuarai' ];
				return [ 'import' => false, 'reason' => 'aksesuarai_below_6eur' ];
		}
	}

	public function get_vf_category_map(): array  { return $this->vf_category_map; }
	public function get_brand_normalize(): array  { return $this->brand_normalize; }
}
