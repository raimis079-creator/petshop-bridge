<?php
defined( 'ABSPATH' ) || exit;

/**
 * VF (Vetfarmas) Import Logic v1.5.7
 *
 * v1.5.7 (2026-08-17) pakeitimai (G825 — GTIN normalizavimas):
 *   RADINYS: VF XML <barcode> lauke VISOS 2 326 reiksmes yra lygiai 12 simboliu.
 *   Tai nukirstas EAN-13 (trukstamas paskutinis = kontrolinis skaitmuo).
 *   Tiekejo puses apribojimas, mums nepasiekiamas.
 *
 *   PASEKME (iki sio taisymo): sis failas rase zalia 12 simboliu barkoda i
 *   _ean ir _global_unique_id. WooCommerce standartinis GTIN laukas gaudavo
 *   negaliojanti koda -> Google Merchant Center tokias prekes atmeta.
 *
 *   SPRENDIMAS: petshop_xml_gtin_normalize() priskaiciuoja kontrolini skaitmeni
 *   (GS1 mod-10). Empirinis patikrinimas: 27 is 41 atveju, kur salia buvo
 *   zinomas pilnas 13 zenklu EAN is Legacy, atkurta reiksme sutapo tiksliai.
 *
 *   SVARBU: _vf_barcode lieka ZALIAS (nekeiciamas). Jis yra suporavimo raktas
 *   Petshop_EAN_Lookup::find_by_ean() uzklausoje — pakeitus sugriutu VF prekiu
 *   dublikatu aptikimas.
 *
 * v1.5.6 (2026-06-10) pakeitimai (S86 — VF kaina seka savikaina):
 *   KONTEKSTAS: iki siol VF prekiu kainos po pirmo skaiciavimo buvo amzinai
 *   FROZEN (_vf_price_initialized). Savininko sprendimas (2026-06-10, simetrija
 *   su ZB S85): neuzrakintos VF prekes kaina turi automatiskai atitikti
 *   taisykles; pasikeitus savikainai — persiskaiciuoti.
 *
 *   MODELIS (skiriasi nuo ZB S85 'cost changed' detekcijos):
 *     VF naudoja 'kaina = taisykles(savikaina)' patikra KIEKVIENO importo metu:
 *     perskaiciuojama is dabartiniu XML kainu ir rasoma TIK jei rezultatas
 *     skiriasi nuo esamos kainos (churn guard). Priezastis: _vf_cost_xml
 *     perrasomas importo metu PRIES si koda, tad 'pokycio' detekcija praleistu
 *     savikainu drifta tarp importu. Self-healing modelis atitinka principa
 *     'viskas is vieno taisykliu rinkinio'.
 *
 *   TAIKOMA TIK Scenarijui B (VF sukurtos prekes, petshop_xml_vf_create_new).
 *   Scenarijus A (VF match i esama Legacy/ZB/own preke) — kainos NIEKADA
 *   nelieciamos (architekturos taisykle, savininko sprendimas 2026-06-05).
 *
 *   SAUGIKLIAI:
 *     1. Lock: _manual_price_override / _petshop_lock_pricing -> kaina neliesta.
 *     2. Promo guard: jei preke turi aktyvu akciju batch (_petshop_sale_batch
 *        + _sale_price > 0) -> reprice BLOKUOJAMAS + review flag
 *        'vf_reprice_blocked_by_promo' (petshop-promotions sale neperrasoma).
 *     3. Churn guard: jei nauja regular IR sale sutampa su esamomis -> nerasoma.
 *   Logas: VF-REPRICED (atskirai nuo VF-NEW-PRICED).
 *
 * v1.5.5 (2026-06-08) pakeitimai (po S72 sprendimo):
 *   1. _PRICE SINCHRONIZACIJA (S72 prevencija importo metu):
 *      Anksciau: update_post_meta('_price', regular) + jei sale > 0, update_post_meta('_sale_price', sale).
 *        PROBLEMA: _price likdavo = regular, net kai _sale_price < _regular_price. Frontend per
 *        wp_wc_product_meta_lookup rodydavo "regular -> regular" (netikra akcija). 99 prekes 2026-06-08
 *        ranka istaisytos su update_post_meta(_price, sale) — sis fix apsaugo, kad importo metu
 *        bug'as nesikartotu.
 *      Naujai: _price = sale (kai sale > 0 ir sale < regular), kitu atveju _price = regular,
 *        _sale_price istrinamas (svari busena). Po rasymo — wc_delete_product_transients() +
 *        clean_post_cache() + per-product lookup table refresh per WC Data Store.
 *      Logika izoliuota helper'yje: petshop_xml_vf_write_price_and_sync().
 *
 * v1.5.4 (2026-06-06) pakeitimai (savininko sprendimas):
 *   1. SKU: naujoms VF prekems _sku = GRYNAS VF SKU (pvz. JOS0946), ne random hash,
 *      ne 'VF-' prefiksas. Perrasom WP All Import auto-hash. Unikalumo patikra per
 *      wc_get_product_id_by_sku() — jei VF SKU jau uzimtas KITO produkto, nerasom,
 *      zymime 'sku_conflict' (apsauga nuo WC SKU konflikto).
 *   2. APRASYMAS: dekoduojam _vf_description_base64 -> post_content. Anksciau aprasymas
 *      likdavo base64 meta lauke ir (a) nesimatydavo svetaineje, (b) keldavo klaidinga
 *      'missing_description' blocker -> nepagristas DRAFT.
 *   3. IMAGE check: robustiskesnis — has_post_thumbnail ARBA prikabintas image
 *      attachment (apsauga nuo WP All Import eiliskumo, kai featured dar nenustatytas).
 *
 * Pagrindiniai entry point'ai (kvieciami is petshop-xml.php dispatcher'io):
 *   - petshop_xml_vf_initial_import( $post_id, $is_update )
 *   - petshop_xml_vf_stock_sync( $post_id )
 *
 * Architektura (zr. session log 2026-06-05):
 *   - Jei VF preke matchina egzistuojanti WC produkta (EAN/SKU) — KAINA NEPALECIAMA
 *   - Naujoms VF prekems — kaina nustatoma TIK pirmu importu, paskui nelieciama
 *   - VF raso tik i savo namespace (_vf_*), nelietE ZB ar Legacy lauku
 *   - Stock per Petshop_Fulfillment::recalculate() (prioritetai: own > zb > vf)
 *   - Naujos VF prekes: auto-publish, jei turi foto, aprasyma, EAN, likuti ir kaina;
 *                       draft, jei truksta kritiniu duomenu.
 *
 * VF trash protection (preventyvus saugiklis pries dublikatu prikelima):
 *   Implementuotas petshop-xml.php main faile per wp_all_import_is_post_to_update filter'a.
 *   Jei VF trash dublikatas (_vf_duplicate_of != '') — WP All Import jo neatnaujins.
 *
 * Meta laukai (VF namespace):
 *   _vf_enabled                    yes/no
 *   _vf_cost                       base_price po supplier discount (BE PVM)
 *   _vf_personal_cost              personal_price po supplier discount (BE PVM)
 *   _vf_cost_xml                   original base_price is XML
 *   _vf_personal_xml               original personal_price is XML
 *   _vf_supplier_discount          discount % pritaikytas
 *   _vf_qty                        likutis VF
 *   _vf_supplier_sku               VF sku_id (raw)
 *   _vf_wc_sku                     WC SKU (audit) — v1.5.4: grynas VF SKU
 *   _vf_barcode                    VF barcode (EAN)
 *   _vf_brand_raw                  brand is XML
 *   _vf_brand_normalized           konsoliduotas brand
 *   _vf_last_sync                  timestamp
 *   _vf_price_initialized          yes (tik naujoms VF prekems, po pirmos kainos nustatymo)
 *   _vf_price_initialized_at       timestamp
 *   _vf_price_rule_used            pricing rule (BRAND:Josera +DISC:20%)
 *   _vf_sku_conflict_with          v1.5.4: konfliktuojancio produkto ID (jei SKU uzimtas)
 *
 * Ant esamu produktu po VF match:
 *   _vf_attached_to_existing       yes (boolean flag)
 *   _vf_has_supplier               yes (boolean flag)
 *   _vf_match_type                 'ean' | 'sku'
 *   _vf_last_matched_import_post_id  paskutinio import'o post ID
 *
 * Ant trash dublikatu:
 *   _vf_duplicate_of               $matched_id (ID kuriam dublikatas priklauso)
 *   _duplicate_of                  $matched_id (suderinama su ZB esamu lauku)
 *   _vf_match_type                 'ean' | 'sku'
 */

/**
 * VF stock sync (Import #6).
 *
 * WP All Import #6 template TURI mapinti VF qty i _vf_qty meta lauka.
 * Sita funkcija po to perskaiciuoja fulfillment + atnaujina last_sync timestamp.
 *
 * Jei _vf_qty meta neatnaujintas iki sio hook'o — fulfillment skaitys sena reiksme.
 * Tai butu Import #6 template konfiguracijos klaida (zr. diegimo instrukcija).
 */
function petshop_xml_vf_stock_sync( int $post_id ): void {

	// _vf_qty turi buti jau irasytas per WP All Import #6 template (qty -> _vf_qty)
	$vf_qty = (int) get_post_meta( $post_id, '_vf_qty', true );
	update_post_meta( $post_id, '_vf_last_sync', current_time( 'mysql' ) );

	// Vienas point of truth: update_vf_qty() simetriskas update_zb_qty()
	$fulfillment = new Petshop_Fulfillment();
	$fulfillment->update_vf_qty( $post_id, $vf_qty );

	petshop_xml_log( "VF STOCK SYNC post {$post_id} | vf_qty={$vf_qty}" );
}

/**
 * VF initial import (Import #5).
 * Pilna logika su filter + match + kainodara.
 */
function petshop_xml_vf_initial_import( int $post_id, bool $is_update ): void {

	// 1. Surinkti VF meta laukus (WP All Import jau idejo per template)
	$vf_brand_raw   = (string) get_post_meta( $post_id, '_vf_brand_raw', true );
	$vf_sku         = (string) get_post_meta( $post_id, '_vf_supplier_sku', true );
	$vf_barcode     = (string) get_post_meta( $post_id, '_vf_barcode', true );
	$vf_cost_xml    = (float)  get_post_meta( $post_id, '_vf_cost_xml', true );
	$vf_personal_xml = (float) get_post_meta( $post_id, '_vf_personal_xml', true );
	$vf_qty         = (int)    get_post_meta( $post_id, '_vf_qty', true );
	$vf_category    = (string) get_post_meta( $post_id, '_vf_category_raw', true );
	$vf_desc_base64 = (string) get_post_meta( $post_id, '_vf_description_base64', true );

	$post = get_post( $post_id );
	$product_name = $post ? $post->post_title : '';

	// 2. Filter check — vf_should_import
	$rules = new Petshop_Import_Rules_VF();
	$decision = $rules->vf_should_import(
		$vf_brand_raw,
		$vf_sku,
		$vf_category,
		$vf_desc_base64,
		$product_name,
		$vf_personal_xml > 0 ? $vf_personal_xml : $vf_cost_xml
	);

	if ( ! $decision['import'] ) {
		// Preke neturetu buti importuojama — i trash (tik jei nauja)
		if ( ! $is_update ) {
			petshop_xml_log_structured( [
				'action'    => 'VF-REJECTED-NEW',
				'post_id'   => $post_id,
				'sku'       => $vf_sku,
				'brand'     => $vf_brand_raw,
				'reason'    => $decision['reason'],
			] );
			update_post_meta( $post_id, '_petshop_review_reason', 'vf_' . $decision['reason'] );
			update_post_meta( $post_id, '_vf_skip_reason', $decision['reason'] );
			wp_trash_post( $post_id );
		} else {
			// Esama preke — paliekam, bet pazymim
			update_post_meta( $post_id, '_vf_skip_reason', $decision['reason'] );
			petshop_xml_log( "VF REJECT (existing) post {$post_id} | reason={$decision['reason']}" );
		}
		return;
	}

	// 3. Category mapping
	$wc_slug = $rules->get_wc_category_slug( $vf_category );
	if ( ! $wc_slug ) {
		// Nera mapping'o -> skip (i trash jei nauja)
		if ( ! $is_update ) {
			petshop_xml_log_structured( [
				'action'    => 'VF-NO-MAPPING-NEW',
				'post_id'   => $post_id,
				'sku'       => $vf_sku,
				'vf_category' => $vf_category,
			] );
			update_post_meta( $post_id, '_petshop_review_reason', 'vf_no_category_mapping' );
			update_post_meta( $post_id, '_vf_skip_reason', 'no_category_mapping' );
			wp_trash_post( $post_id );
		} else {
			update_post_meta( $post_id, '_vf_skip_reason', 'no_category_mapping' );
			petshop_xml_log( "VF NO MAPPING (existing) post {$post_id} | vf_cat={$vf_category}" );
		}
		return;
	}

	// 4. Brand normalize
	$brand_normalized = $rules->normalize_brand( $vf_brand_raw );

	// 5. EAN/SKU lookup — ar preke jau egzistuoja?
	$ean_db = new Petshop_EAN_Lookup();
	$matched_id = null;
	$match_type = null;

	// EAN match (per barcode)
	if ( $vf_barcode ) {
		$matched_id = $ean_db->find_by_ean( $vf_barcode, $post_id );
		if ( $matched_id ) $match_type = 'ean';
	}
	// SKU match (jei nera EAN match)
	if ( ! $matched_id && $vf_sku ) {
		$matched_id = petshop_xml_vf_find_by_sku( $vf_sku, $post_id );
		if ( $matched_id ) $match_type = 'sku';
	}

	// =====================================================================
	// SCENARIJUS A: VF preke atitinka egzistuojanti WC produkta
	// =====================================================================
	if ( $matched_id ) {
		petshop_xml_vf_attach_to_existing(
			$matched_id, $post_id, $match_type,
			$vf_brand_raw, $brand_normalized, $vf_sku, $vf_barcode,
			$vf_cost_xml, $vf_personal_xml, $vf_qty, $wc_slug
		);
		return;
	}

	// =====================================================================
	// SCENARIJUS B: Nauja VF preke
	// =====================================================================
	petshop_xml_vf_create_new(
		$post_id, $is_update,
		$vf_brand_raw, $brand_normalized, $vf_sku, $vf_barcode,
		$vf_cost_xml, $vf_personal_xml, $vf_qty, $wc_slug, $vf_category
	);
}

/**
 * SCENARIJUS A: VF preke atitinka egzistuojanti WC produkta.
 *
 * GALUTINE TAISYKLE (savininko sprendimas 2026-06-05):
 *   Egzistuojanti preke = LEGACY arba OWN arba ZB arba BET KOKIA jau katalogo preke.
 *   Nesvarbu, kuris tiekejas — JEI preke jau yra WooCommerce, VF kainos nekeicia.
 *
 * Veiksmai:
 *   1. Egzistuojantis produktas ($matched_id):
 *      - NEKEICIAM: _price, _regular_price, _sale_price
 *      - NEKEICIAM: post_title, post_name (slug)
 *      - NEKEICIAM: SEO meta, RankMath, kategoriju
 *      - Atnaujinam TIK _vf_* meta laukus (tiekejo sluoksnis)
 *      - Petshop_Fulfillment::recalculate() — stock per prioritetus
 *   2. Naujai importuotas postas ($new_post_id):
 *      - Pazymeti kaip duplicate
 *      - I trash (kad nepersaus egzistuojancios prekes)
 */
function petshop_xml_vf_attach_to_existing(
	int $matched_id,
	int $new_post_id,
	string $match_type,
	string $vf_brand_raw,
	string $brand_normalized,
	string $vf_sku,
	string $vf_barcode,
	float $vf_cost_xml,
	float $vf_personal_xml,
	int $vf_qty,
	string $wc_slug
): void {

	// Apskaiciuojam real costs po supplier discount
	$pricing = new Petshop_Pricing_VF();
	$supplier_discount = $pricing->get_supplier_discount( $brand_normalized );
	$real_cost = $pricing->apply_supplier_discount( $vf_cost_xml, $brand_normalized );
	$real_personal = $pricing->apply_supplier_discount( $vf_personal_xml, $brand_normalized );

	// 1. Atnaujinti VF meta egzistuojanciam produktui (NE kainos!)
	update_post_meta( $matched_id, '_vf_enabled', 'yes' );
	update_post_meta( $matched_id, '_vf_cost', $real_cost );
	update_post_meta( $matched_id, '_vf_personal_cost', $real_personal );
	update_post_meta( $matched_id, '_vf_cost_xml', $vf_cost_xml );
	update_post_meta( $matched_id, '_vf_personal_xml', $vf_personal_xml );
	update_post_meta( $matched_id, '_vf_supplier_discount', $supplier_discount );
	update_post_meta( $matched_id, '_vf_qty', $vf_qty );
	update_post_meta( $matched_id, '_vf_supplier_sku', $vf_sku );
	update_post_meta( $matched_id, '_vf_barcode', $vf_barcode );
	update_post_meta( $matched_id, '_vf_brand_raw', $vf_brand_raw );
	update_post_meta( $matched_id, '_vf_brand_normalized', $brand_normalized );
	update_post_meta( $matched_id, '_vf_last_sync', current_time( 'mysql' ) );

	// 2. Fulfillment recalculate (stock prioritetai own > zb > vf)
	$fulfillment = new Petshop_Fulfillment();
	$fulfillment->recalculate( $matched_id );

	// 3. Naujai importuotas postas — i trash kaip duplicate
	petshop_xml_log_structured( [
		'action'        => 'VF-MATCH-EXISTING',
		'matched_id'    => $matched_id,
		'new_post_id'   => $new_post_id,
		'match_type'    => $match_type,
		'sku'           => $vf_sku,
		'barcode'       => $vf_barcode,
		'brand'         => $brand_normalized,
		'vf_qty'        => $vf_qty,
	] );

	// Trash dublikatas — aiskios meta reiksmes
	update_post_meta( $new_post_id, '_petshop_review_reason', 'vf_duplicate_of_existing' );
	update_post_meta( $new_post_id, '_duplicate_of', $matched_id );
	update_post_meta( $new_post_id, '_vf_duplicate_of', $matched_id );
	update_post_meta( $new_post_id, '_vf_match_type', $match_type );
	wp_trash_post( $new_post_id );

	// Esamas produktas — pazymeti, kad turi VF supplier (BOOLEAN flag, ne ID)
	update_post_meta( $matched_id, '_vf_attached_to_existing', 'yes' );
	update_post_meta( $matched_id, '_vf_has_supplier', 'yes' );
	update_post_meta( $matched_id, '_vf_match_type', $match_type );
	update_post_meta( $matched_id, '_vf_last_matched_import_post_id', $new_post_id );
}

/**
 * SCENARIJUS B: Nauja VF preke (be EAN/SKU match'o).
 *
 * Veiksmai:
 *   1. Nustatyti VF meta laukus
 *   2. _sku = grynas VF SKU (su unikalumo patikra)
 *   3. Dekoduoti aprasyma is base64 -> post_content
 *   4. Apskaiciuoti kaina (pirmas kartas)
 *   5. Set _vf_price_initialized = yes (kad ateities sync'ai nelietE kainos)
 *   6. Set status pagal review reasons
 */
function petshop_xml_vf_create_new(
	int $post_id,
	bool $is_update,
	string $vf_brand_raw,
	string $brand_normalized,
	string $vf_sku,
	string $vf_barcode,
	float $vf_cost_xml,
	float $vf_personal_xml,
	int $vf_qty,
	string $wc_slug,
	string $vf_category
): void {

	$pricing = new Petshop_Pricing_VF();
	$supplier_discount = $pricing->get_supplier_discount( $brand_normalized );
	$real_cost = $pricing->apply_supplier_discount( $vf_cost_xml, $brand_normalized );
	$real_personal = $pricing->apply_supplier_discount( $vf_personal_xml, $brand_normalized );

	// 1. VF meta
	update_post_meta( $post_id, '_vf_enabled', 'yes' );
	update_post_meta( $post_id, '_vf_cost', $real_cost );
	update_post_meta( $post_id, '_vf_personal_cost', $real_personal );
	update_post_meta( $post_id, '_vf_cost_xml', $vf_cost_xml );
	update_post_meta( $post_id, '_vf_personal_xml', $vf_personal_xml );
	update_post_meta( $post_id, '_vf_supplier_discount', $supplier_discount );
	update_post_meta( $post_id, '_vf_qty', $vf_qty );
	update_post_meta( $post_id, '_vf_supplier_sku', $vf_sku );
	update_post_meta( $post_id, '_vf_barcode', $vf_barcode );
	update_post_meta( $post_id, '_vf_brand_raw', $vf_brand_raw );
	update_post_meta( $post_id, '_vf_brand_normalized', $brand_normalized );
	update_post_meta( $post_id, '_vf_last_sync', current_time( 'mysql' ) );

	// 2. Bendri laukai (EAN) — v1.5.7: VF siuncia 12 simboliu (nukirstas
	//    kontrolinis skaitmuo). _vf_barcode lieka ZALIAS (suporavimo raktas),
	//    o i bendrus laukus rasomas pilnas GTIN-13.
	if ( $vf_barcode ) {
		$gtin = petshop_xml_gtin_normalize( $vf_barcode );
		update_post_meta( $post_id, '_ean', $gtin );
		update_post_meta( $post_id, '_global_unique_id', $gtin );
	}

	// 2b. SKU — v1.5.4: naujoms VF prekems _sku = GRYNAS VF SKU (pvz. JOS0946).
	//
	// Anksciau: tikrino `if ( ! $existing_sku )` ir dejo 'VF-' prefiksa.
	//   PROBLEMA: WP All Import postui jau priskiria random hash kaip _sku
	//   (pvz. aaae45a5a49e), todel `! $existing_sku` buvo FALSE -> neperraso ->
	//   liko bjaurus hash. Ir net jei perrasytu — su 'VF-' prefiksu.
	//
	// Dabar: PERRASOM WP All Import hash i gryna VF SKU. Unikalumo patikra BUTINA
	//   (WC reikalauja unikalaus _sku). Jei VF SKU jau uzimtas KITO produkto —
	//   nerasom, zymime 'sku_conflict' rankinei perziurai.
	if ( ! $is_update && $vf_sku ) {
		$sku_owner = wc_get_product_id_by_sku( $vf_sku );
		if ( $sku_owner && (int) $sku_owner !== $post_id ) {
			// VF SKU jau priklauso kitam produktui — konfliktas
			update_post_meta( $post_id, '_vf_sku_conflict_with', (int) $sku_owner );
			$rr = (string) get_post_meta( $post_id, '_petshop_review_reason', true );
			update_post_meta( $post_id, '_petshop_review_reason', $rr ? $rr . ', sku_conflict' : 'sku_conflict' );
			petshop_xml_log_structured( [
				'action'      => 'VF-SKU-CONFLICT',
				'post_id'     => $post_id,
				'vf_sku'      => $vf_sku,
				'conflict_id' => (int) $sku_owner,
			] );
		} else {
			// Saugu — perrasom hash i gryna VF SKU
			update_post_meta( $post_id, '_sku', $vf_sku );
			update_post_meta( $post_id, '_vf_wc_sku', $vf_sku );
		}
	}

	// 2c. APRASYMAS — v1.5.4: dekoduojam _vf_description_base64 -> post_content.
	//
	// VF tiekia aprasyma kaip base64 (custom field _vf_description_base64).
	// Be sito dekodavimo: (a) aprasymas nesimato svetaineje, (b) post_content
	// tuscias -> klaidingas 'missing_description' blocker -> nepagristas DRAFT.
	//
	// Idempotentas: jei post_content jau uzpildytas (pvz. template dekodavo),
	// perrasom tuo paciu turiniu — jokios zalos.
	$vf_desc_base64 = (string) get_post_meta( $post_id, '_vf_description_base64', true );
	if ( $vf_desc_base64 !== '' ) {
		$decoded = base64_decode( $vf_desc_base64, true );
		if ( $decoded !== false && trim( wp_strip_all_tags( $decoded ) ) !== '' ) {
			wp_update_post( [ 'ID' => $post_id, 'post_content' => $decoded ] );
		}
	}

	// 3. WC kategorija
	$cat_term = get_term_by( 'slug', $wc_slug, 'product_cat' );
	if ( $cat_term && ! is_wp_error( $cat_term ) ) {
		wp_set_object_terms( $post_id, [ (int) $cat_term->term_id ], 'product_cat' );
	}

	// 4. Brand taksonomija
	if ( $brand_normalized ) {
		wp_set_object_terms( $post_id, $brand_normalized, PETSHOP_XML_BRAND_TAXONOMY );
	}

	// 5. Kainodara (v1.5.6, S86 — kaina seka savikaina, self-healing)
	//
	//   - NAUJA preke (be _vf_price_initialized) -> kaina skaiciuojama (kaip iki siol).
	//   - ESAMA VF preke BE lock -> kaina perskaiciuojama is dabartiniu XML kainu
	//     ir rasoma TIK jei skiriasi (churn guard). Promo batch -> blokuojama.
	//   - Lock (_manual_price_override / _petshop_lock_pricing) -> nelieciama.
	$price_initialized = ( get_post_meta( $post_id, '_vf_price_initialized', true ) === 'yes' );
	$price_locked      = petshop_xml_vf_is_price_locked( $post_id );

	if ( ! $price_locked ) {

		// Promo guard: aktyvi petshop-promotions akcija -> reprice neliecia sale.
		$promo_batch   = (string) get_post_meta( $post_id, '_petshop_sale_batch', true );
		$existing_sale = get_post_meta( $post_id, '_sale_price', true );
		$has_promo     = ( $price_initialized && $promo_batch !== '' && $existing_sale !== '' && (float) $existing_sale > 0 );

		if ( $has_promo ) {
			$rr = (string) get_post_meta( $post_id, '_petshop_price_review_reason', true );
			if ( strpos( $rr, 'vf_reprice_blocked_by_promo' ) === false ) {
				update_post_meta( $post_id, '_petshop_needs_price_review', 'yes' );
				update_post_meta( $post_id, '_petshop_price_review_reason', $rr ? $rr . ', vf_reprice_blocked_by_promo' : 'vf_reprice_blocked_by_promo' );
			}
			petshop_xml_log( "VF REPRICE BLOCKED (promo batch '{$promo_batch}') post {$post_id} | sku={$vf_sku}" );

		} else {

			$cat_slugs = petshop_xml_get_cat_slugs( $post_id );

			// SVARBU: calculate_final_price_from_xml PATI taiko supplier discount viduje.
			// Perduodame XML kainas (be discount), klase pati paskaiciuoja real_cost.
			$price_result = $pricing->calculate_final_price_from_xml(
				$vf_cost_xml, $vf_personal_xml, $brand_normalized, $cat_slugs
			);

			$new_regular = (float) $price_result['regular'];
			$new_sale    = (float) $price_result['sale'];
			$old_regular = (float) get_post_meta( $post_id, '_regular_price', true );
			$old_sale    = (float) ( $existing_sale !== '' ? $existing_sale : 0 );

			$price_differs = ( abs( $new_regular - $old_regular ) > 0.001 || abs( $new_sale - $old_sale ) > 0.001 );

			if ( ! $price_initialized || $price_differs ) {
				// v1.5.5: _price sinchronizacija per helper'i.
				// Helper raso _regular_price, _sale_price, _price (S72 prevencija) +
				// transients + lookup table refresh. Grazina faktini final_price.
				$final_price = petshop_xml_vf_write_price_and_sync(
					$post_id, $new_regular, $new_sale
				);

				if ( ! $price_initialized ) {
					update_post_meta( $post_id, '_vf_price_initialized', 'yes' );
					update_post_meta( $post_id, '_vf_price_initialized_at', current_time( 'mysql' ) );
				}
				update_post_meta( $post_id, '_vf_price_rule_used', $price_result['rule'] );

				// Review flags
				if ( ! empty( $price_result['review_reasons'] ) ) {
					update_post_meta( $post_id, '_petshop_needs_price_review', 'yes' );
					update_post_meta( $post_id, '_petshop_price_review_reason', implode( ', ', $price_result['review_reasons'] ) );
				}

				petshop_xml_log_structured( [
					'action'        => $price_initialized ? 'VF-REPRICED' : 'VF-NEW-PRICED',
					'post_id'       => $post_id,
					'sku'           => $vf_sku,
					'brand'         => $brand_normalized,
					'old_regular'   => $price_initialized ? $old_regular : null,
					'regular_price' => $price_result['regular'],
					'sale_price'    => $price_result['sale'],
					'final_price'   => $final_price,        // v1.5.5: kas ejo i _price (sale arba regular)
					'margin_pct'    => $price_result['margin_pct'],
					'rule'          => $price_result['rule'],
					'reasons'       => implode( ',', $price_result['review_reasons'] ),
				] );
			}
			// else: kaina jau atitinka taisykles (churn guard) — nieko nerasom.
		}
	}
	// else: locked -> kaina nelieciama, atnaujinta tik savikaina (_vf_cost auksciau).

	// 6. Svoris (jei XML pateikia — TODO: galima prideti veliau)
	// 7. Fulfillment
	$fulfillment = new Petshop_Fulfillment();
	$fulfillment->recalculate( $post_id );

	// 8. Status: AUTO-PUBLISH saugiems, DRAFT tik trukstamiems duomenims.
	//
	// Savininko sprendimas 2026-06-05:
	//   Nereikia visu 1000 prekiu deti i DRAFT. Naujos saugios prekes eina i publish.
	//   DRAFT tik jei truksta turinio (nuotrauka, aprasymas, kaina, EAN, likutis).
	//
	// Tikrinami blokeriai (bent vienas -> DRAFT):
	//   - missing_image (nera _thumbnail_id IR nera prikabinto image attachment)
	//   - missing_description (post_content tuscias)
	//   - missing_price (kaina = 0 arba neapskaiciuota)
	//   - missing_ean (nera barcode)
	//   - qty_zero (likutis = 0)
	$auto_publish_blockers = [];

	// v1.5.4: image check robustiskesnis — featured ARBA prikabintas image attachment.
	// Apsauga nuo WP All Import eiliskumo (kartais featured nustatomas veliau nei
	// kvieciamas sis hook'as, bet attachment'ai jau prikabinti).
	$has_image = has_post_thumbnail( $post_id );
	if ( ! $has_image ) {
		$img_att = get_attached_media( 'image', $post_id );
		$has_image = ! empty( $img_att );
	}
	if ( ! $has_image ) {
		$auto_publish_blockers[] = 'missing_image';
	}

	$post_obj = get_post( $post_id );
	$content  = $post_obj ? trim( wp_strip_all_tags( $post_obj->post_content ) ) : '';
	if ( empty( $content ) ) {
		$auto_publish_blockers[] = 'missing_description';
	}

	// Kainos patikra — TIESIOGIAI is meta (ne is $price_result, kuris gali buti nedefinuotas
	// jei kainodaros blokas del kokios nors priezasties nesuveike arba preke buvo locked)
	$current_price = (float) get_post_meta( $post_id, '_price', true );
	if ( $current_price <= 0 ) {
		$auto_publish_blockers[] = 'missing_price';
	}

	if ( empty( $vf_barcode ) ) {
		$auto_publish_blockers[] = 'missing_ean';
	}

	if ( $vf_qty <= 0 ) {
		$auto_publish_blockers[] = 'qty_zero';
	}

	if ( empty( $auto_publish_blockers ) ) {
		// Visi kriterijai OK -> AUTO PUBLISH
		wp_update_post( [ 'ID' => $post_id, 'post_status' => 'publish' ] );
		petshop_xml_log_structured( [
			'action'  => 'VF-AUTO-PUBLISH',
			'post_id' => $post_id,
			'sku'     => $vf_sku,
			'brand'   => $brand_normalized,
			'price'   => $current_price,
		] );
	} else {
		// Truksta turinio -> DRAFT
		wp_update_post( [ 'ID' => $post_id, 'post_status' => 'draft' ] );

		$existing_reason = (string) get_post_meta( $post_id, '_petshop_review_reason', true );
		$all_reasons = $existing_reason
			? $existing_reason . ', ' . implode( ', ', $auto_publish_blockers )
			: implode( ', ', $auto_publish_blockers );
		update_post_meta( $post_id, '_petshop_review_reason', $all_reasons );

		petshop_xml_log_structured( [
			'action'  => 'VF-DRAFT',
			'post_id' => $post_id,
			'sku'     => $vf_sku,
			'price'   => $current_price,
			'reasons' => implode( ',', $auto_publish_blockers ),
		] );
	}
}

/**
 * v1.5.5 (S72 prevencija):
 * Sinchroniskai rasom _regular_price, _sale_price, _price + atnaujinam cache/lookup.
 *
 * KONTEKSTAS (S72 bug'as, istaisytas 2026-06-08):
 *   99 VF prekems _sale_price < _regular_price, BET _price likdavo = regular.
 *   WC vidine wp_wc_product_meta_lookup lentele skaito _price -> frontend
 *   rodydavo "10,99 -> 10,99" (netikra akcija). Priezastis: WC_Product->save()
 *   neperraso _price, kai set_regular/set_sale gauna tas pacias reiksmes
 *   (props nepasikeitia). Sprendimas — TIESIOGINIS update_post_meta(_price, ...).
 *
 * LOGIKA:
 *   - $sale > 0 IR $sale < $regular  -> _price = $sale,    _sale_price = $sale
 *   - kitu atveju                    -> _price = $regular, _sale_price IRASOMAS (svari busena)
 *
 * Po rasymo:
 *   - wc_delete_product_transients()  — Woo cache (related, layered nav, kt.)
 *   - clean_post_cache()              — WP post cache
 *   - data store update_lookup_table  — wp_wc_product_meta_lookup (min/max_price, onsale)
 *
 * Grazina: float — faktine kaina, kuri irasyta i _price (audit / log).
 */
function petshop_xml_vf_write_price_and_sync( int $post_id, float $regular, float $sale ): float {

	// Apsauga: jei regular netinkamas — nieko nedarom, grazinam 0 (blocker'is paims '_price <= 0')
	if ( $regular <= 0 ) {
		return 0.0;
	}

	update_post_meta( $post_id, '_regular_price', $regular );

	$final_price = $regular;
	if ( $sale > 0 && $sale < $regular ) {
		update_post_meta( $post_id, '_sale_price', $sale );
		update_post_meta( $post_id, '_price', $sale );
		$final_price = $sale;
	} else {
		// Sale tuscias arba netinkamas (>=regular) -> istrinam _sale_price meta,
		// kad nelikta sena reiksme. _price = regular.
		delete_post_meta( $post_id, '_sale_price' );
		update_post_meta( $post_id, '_price', $regular );
	}

	// Cache invalidacija (butina, kad frontend pamatytu naujas reiksmes)
	if ( function_exists( 'wc_delete_product_transients' ) ) {
		wc_delete_product_transients( $post_id );
	}
	clean_post_cache( $post_id );


	/* ================================================================
	 * DĖMESIO (2026-08-08, S709): ŠIS BLOKAS NEVEIKIA IR NIEKADA NEVEIKĖ.
	 * method_exists($data_store,'update_lookup_table') VISADA grąžina false,
	 * nes WC_Data_Store yra apvalkalas su __call(). Net ir praėjus tą patikrą,
	 * pats metodas yra PROTECTED, tad kvietimas nepavyktų.
	 * Lookup lentelę dabar tvarko mu-plugins/petshop-wc-sync.php — jis gaudo
	 * meta pakeitimą ir atnaujina lookup per Reflection užklausos pabaigoje.
	 * Šio bloko šalinti nebūtina, bet juo REMTIS NEGALIMA.
	 * ================================================================ */
	// Per-product lookup table refresh (wp_wc_product_meta_lookup: min/max_price, onsale).
	// Be sito: net jei _price teisingas, kataloge gali rodyti sena kaina is lookup lenteles.
	if ( class_exists( 'WC_Data_Store' ) ) {
		try {
			$data_store = WC_Data_Store::load( 'product' );
			if ( method_exists( $data_store, 'update_lookup_table' ) ) {
				$data_store->update_lookup_table( $post_id, 'wc_product_meta_lookup' );
			}
		} catch ( \Exception $e ) {
			// Lookup table neatnaujinta — ne katastrofa, kaina pati teisinga, lookup atsigaus
			// per kita save'a arba per global wc_update_product_lookup_tables().
			petshop_xml_log( "VF PRICE SYNC: lookup update fail post {$post_id} | " . $e->getMessage() );
		}
	}

	return $final_price;
}

/**
 * GTIN normalizavimas (v1.5.7).
 *
 * VF (Vetfarmas) XML <barcode> lauke visos reiksmes yra 12 simboliu — tai
 * EAN-13 be paskutinio (kontrolinio) skaitmens. Si funkcija ji atstato.
 *
 * Taisykles:
 *   - 12 skaitmenu  -> priskaiciuojamas GS1 mod-10 kontrolinis skaitmuo (13)
 *   - 13 skaitmenu ir kontrolinis teisingas -> grazinama nepakeista
 *   - visa kita (tuscia, ne skaiciai, kitas ilgis) -> grazinama nepakeista,
 *     kad nesugadintume duomenu, kuriu nesuprantame
 *
 * @param string $kodas Zalias barkodas is tiekejo.
 * @return string Normalizuotas GTIN arba originalas.
 */
function petshop_xml_gtin_normalize( string $kodas ): string {
	$k = trim( $kodas );
	if ( $k === '' || ! ctype_digit( $k ) ) {
		return $kodas;
	}

	if ( strlen( $k ) === 12 ) {
		return $k . petshop_xml_gtin_check_digit( $k );
	}

	return $kodas;
}

/**
 * GS1 mod-10 kontrolinis skaitmuo is 12 skaitmenu (v1.5.7).
 *
 * Svoriai nuo kaires: 1,3,1,3,... Suma dauginama iki artimiausio desimtuko.
 *
 * @param string $d12 Lygiai 12 skaitmenu.
 * @return string Vienas skaitmuo.
 */
function petshop_xml_gtin_check_digit( string $d12 ): string {
	$suma = 0;
	for ( $i = 0; $i < 12; $i++ ) {
		$suma += ( (int) $d12[ $i ] ) * ( ( $i % 2 ) ? 3 : 1 );
	}
	return (string) ( ( 10 - $suma % 10 ) % 10 );
}

/**
 * Helper: VF SKU lookup egzistuojantiems produktams.
 * Iesko per _sku ir _vf_supplier_sku.
 */
function petshop_xml_vf_find_by_sku( string $sku, int $skip_id = 0 ): ?int {
	if ( empty( $sku ) ) return null;
	global $wpdb;

	// 1. _vf_supplier_sku match
	$result = $wpdb->get_var( $wpdb->prepare(
		"SELECT post_id FROM {$wpdb->postmeta}
		 WHERE meta_key = '_vf_supplier_sku'
		 AND meta_value = %s AND post_id != %d LIMIT 1",
		$sku, $skip_id
	) );
	if ( $result ) return (int) $result;

	// 2. Standart _sku match (su VF- prefix arba be)
	$result = $wpdb->get_var( $wpdb->prepare(
		"SELECT post_id FROM {$wpdb->postmeta}
		 WHERE meta_key = '_sku'
		 AND meta_value IN (%s, %s) AND post_id != %d LIMIT 1",
		$sku, 'VF-' . $sku, $skip_id
	) );
	return $result ? (int) $result : null;
}

/**
 * Universal kainos lock check (VF kontekstui).
 * Tinka ir Legacy, ir ZB, ir manualiems lock'ams.
 */
function petshop_xml_vf_is_price_locked( int $post_id ): bool {
	$manual = get_post_meta( $post_id, '_manual_price_override', true );
	$lock   = get_post_meta( $post_id, '_petshop_lock_pricing', true );
	return ( $manual === 'yes' || $lock === 'yes' );
}
