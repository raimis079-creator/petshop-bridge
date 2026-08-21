<?php
/**
 * Plugin Name: Petshop XML Import
 * Plugin URI:  https://petshop.lt
 * Description: ZB ir VF XML importo logika — EAN dedup, kainodara (S70), fulfillment source, initial import vs sync atskyrimas, savikainos/marzos meta box.
 * Version:     1.5.18
 * Author:      petshop.lt
 *
 * v1.5.18 (2026-06-15): KLASES PAVADINIMO FIX — block_zb_create excluded_brand
 *
 *   PROBLEMA: v1.5.17 block_zb_create tikrino class_exists('Petshop_Rules') ir
 *   new Petshop_Rules() — BET tikra klase vadinasi Petshop_Import_Rules. Todel
 *   class_exists() grazindavo FALSE -> visas excluded_brand blokas PRALEIDZIAMAS
 *   prie vartu. Hau&Miau (ir kt. excluded) ZB prekes vis tiek BUVO SUKURIAMOS,
 *   tik po to (initial_import, eil. 879 — teisinga klase) metamos i trash.
 *   Rezultatas: po nakties ZB cron 2 Hau&Miau prekes trash (#34061/62, _zb_cost
 *   yra, _zb_brand=Hau&Miau, abi turi Legacy dublikata draft).
 *
 *   SPRENDIMAS: Petshop_Rules -> Petshop_Import_Rules (eil. 350-351). Dabar
 *   excluded_brand pagaunamas PRIE VARTU (kaip ir buvo planuota v1.5.17), preke
 *   nebesukuriama. is_excluded_brand() logika veike teisingai — tik klase buvo
 *   kvieciama klaidingu pavadinimu.
 *
 * v1.5.17 (2026-06-14): EXCLUDED BRAND BLOKAVIMAS PRIE VARTU (S101)
 *
 *   KONTEKSTAS: tam tikri brandai (Hau&Miau, Bioveterinary ir kt.) pas mus JAU
 *   yra kaip Legacy prekes (su istorija, kaina, SEO). ZB juos irgi siuncia, bet
 *   jie NETURI patekti is ZB.
 *
 *   PROBLEMA: is_excluded_brand() veike tik PO sukurimo (initial_import) -> ZB
 *   preke buvo SUKURIAMA (parsisiunciama nuotrauka), tik po to metama i draft su
 *   reason=excluded_brand. Rezultatas: siuksles draft'uose + ShortPixel kreditai +
 *   dublikatai su Legacy originalais. Diagnostika (Juodrasciu Analize) parode 18+
 *   tokiu draft (Hau&Miau visciukai/skaneszai su likuciu).
 *
 *   SPRENDIMAS: block_zb_create papildytas — excluded_brand tikrinamas PRIE VARTU
 *   (pries konservas/qty/aksesuaras patikras). Jei brandas excluded -> NEKURTI.
 *   Brandas imamas is $data['brand'] (fallback i name). Naudoja Petshop_Rules::
 *   is_excluded_brand(). Analogiska ZB skip-before-create (S97) ir VF (S100).
 *
 *   KO NELIECIA: Legacy originalai (Hau&Miau, Bioveterinary) lieka publish.
 *   Esami ZB excluded_brand draft isvalomi atskirai (vienkartinis snippet).
 *
 * v1.5.16 (2026-06-14): VF DUBLIKATU PREVENCIJA — SKU jau egzistuoja -> nekurti (S100)
 *
 *   KONTEKSTAS: VF prekes (Josera, Exclusion, Churu), kurios YRA Legacy sandelyje
 *   (SEO/istorija), turi buti SUPORUOTOS su VF XML (Legacy duoda pavadinima/
 *   aprasyma/pardavimo kaina; VF duoda savikaina+_vf_qty). Match raktas:
 *   VF sku_id <-> Legacy _vf_supplier_sku.
 *
 *   PROBLEMA: VF Import #5 "Create new" rezime kure DUBLIKATA kas importa, net
 *   kai Legacy originalas suporuotas (turi _vf_supplier_sku + _vf_qty). Dublikatas
 *   buvo atpazintas (_petshop_review_reason=vf_duplicate_of_existing, _vf_duplicate_of)
 *   ir ismestas i trash. Bet kitas importas kure vel -> ciklas (78 dublikatu/importa:
 *   Josera/Exclusion/Churu — visa monoprotein/hipoalergine nisa). block_vf_create
 *   (S92) netikrino, ar SKU jau egzistuoja — tik vf_should_import + kategorija.
 *
 *   SPRENDIMAS: block_vf_create papildytas — jei VF sku_id JAU egzistuoja kaip
 *   kazkurios NE-trash prekes _vf_supplier_sku -> NEKURTI. VF Scenarijus A
 *   atnaujins esama Legacy preke per update (qty+savikaina). Gryna indeksuota
 *   meta uzklausa (greita); fail-safe = testi (jei sku tuscias / nieko nerasta).
 *
 *   Analogiska ZB skip-before-create (S97): uztaisom saltini (dublikatas net
 *   nesukuriamas), ne tik valom. Po deploy: VF nebekurs dublikatu; esami 78
 *   trash isvalomi vienkartiniu snippet "VF Dublikatu Valymas".
 *
 *   KO NELIECIA: VF Scenarijus A (match update, S90), Legacy guard, ZB logika.
 *
 * v1.5.15 (2026-06-14): ZB qty=0 SEO + PAKLAUSOS LOGIKA (S98)
 *
 *   KONTEKSTAS: diskusija del qty=0 prekiu strategijos. Savininko patirtis su
 *   petshop.lt klientais: klientai megsta pasizymeti preke, kai jos nera
 *   ("pranesk kai bus"); atsiradus likuciui, ypac populiaresniu prekiu, pirkimai
 *   vyksta is karto. Tad qty=0 preke nera siukle — tai PAKLAUSOS ASSET. Plius
 *   SEO: buvusi publish preke turi URL/nuorodas (senos platformos SEO persikels
 *   per 301); draft = 404 = SEO praradimas.
 *
 *   APIMTIS: tik ZB/VF dropship prekes. Legacy (_legacy_manufacturer) NELIECIA
 *   (savininkas valdo rankiniu budu, S91). Manual override NELIECIA.
 *
 *   SPRENDIMAS — qty=0 trys keliai:
 *
 *   A. NAUJA preke qty=0 (block_zb_create): -> NEKURTI.
 *      Nera SEO istorijos, nera paklausos (niekas nemate) -> kurti neverta.
 *      Jei ZB veliau atsius SU likuciu -> kuriama tada (publish). Tai
 *      automatinis "blokavimas" (nauja qty=0 nekuriama, grizus su likuciu —
 *      kuriama). Konservai qty=0 — isimtis, LEIDZIAMI (box rinkiniai).
 *
 *   B. ESAMA BUVUSI PUBLISH preke qty=0 (initial_import): -> LIEKA PUBLISH.
 *      _zb_was_published=yes -> preke matoma (SEO saugus + renka paklausa
 *      "pranesk kai bus"). NE draft. WC _stock_status=outofstock (zyma).
 *      _zb_qty_zero_since fiksuoja, nuo kada be likucio.
 *
 *   C. ESAMA GIMUSI DRAFT preke qty=0 (niekada nebuvo publish): -> lieka draft
 *      + _zb_qty_zero_since. 30 d. cleanup (atskiras snippet) -> trash.
 *      Nera SEO, nera paklausos -> galima valyti po 30 d.
 *
 *   ZYMA: kai preke tampa publish IR turi likuti -> _zb_was_published=yes
 *   (islieka visam). Tai skiria "buvusi publish" (B kelias) nuo "gimusi draft"
 *   (C kelias). qty>0 -> isvalom _zb_qty_zero_since.
 *
 *   "PRANESK KAI BUS" funkcija (mygtukas + DB + email + ataskaita "kokiu
 *   prekiu klientai norejo") — MVP, iki 2026-08-06 (atskira sesija). Cia tik
 *   PARUOSIAMA DIRVA: buvusios publish qty=0 prekes lieka matomos.
 *
 *   KARTELE (8 EUR) NEPAKEISTA. Konservu->draft, esamu pigiu update blokavimas
 *   (v1.5.14) — islieka. VF logika, Legacy guard — nepaliesta.
 *
 *   VIENKARTINIS TRASH VALYMAS (atskiras snippet) — esami 618 trash:
 *     konservai -> draft; qty=0 buve-publish -> publish; aksesuarai/pigus -> trinti.
 *
 * v1.5.14 (2026-06-14): ZB ESAMU PIGIU UPDATE BLOKAVIMAS + QTY_ZERO->DRAFT visada (S97)
 *
 *   KONTEKSTAS: po v1.5.13 testo (rankinis Import #2) rasti DU likutiniai
 *   defektai ESAMOMS prekems (is_update=true):
 *     1. qty_zero -> draft veike TIK naujoms (salyga "&& ! $is_update").
 *        ESAMOS prekes su qty=0 (pvz. Monge sausas maistas 8.79 EUR, 12.59 EUR —
 *        savikaina VIRS karteles, normalus maistas) krito i TRASH, ne draft.
 *     2. ESAMOS pigios prekes (< 8 EUR, NE konservas, pvz. Vitapol graužikams
 *        2.59 EUR) krito i TRASH per initial_import. PROBLEMA: trash -> rytinis
 *        cron neranda -> kuria is naujo -> parsisiuncia nuotrauka (ShortPixel
 *        kreditai) -> meta i trash -> CIKLAS (tiksliai VF S92 / ZB problema).
 *        Savininkas (2026-06-14): "jos net neturi patekti i trash, nes paskui
 *        suvalgys nuotrauku suspaudimo kreditus".
 *
 *   SPRENDIMAS — TRYS PAKEITIMAI:
 *
 *   A. NAUJAS petshop_xml_block_zb_cheap_update() ant wp_all_import_is_post_to_update
 *      (tik ZB Import #2,#3). ESAMA preke, kuri < 8 EUR IR NE konservas ->
 *      BLOKUOTI update. Preke NELIECIAMA -> nuotrauka NEPERKRAUNAMA -> 0 kreditu,
 *      0 ciklo. Vienkartinis valymas (snippet "ZB Trash Sutvarkymas") tokias
 *      esamas pigias prekes istrina VISAM (force delete + nuotrauka); po to
 *      cron bando kurti -> block_zb_create (v1.5.13) blokuoja PRIES nuotrauka.
 *      Taigi: istrynimas (vienkartinis) + create filtras + update filtras =
 *      preke dingsta ir nebeatkuriama, nuotrauka niekada neperkraunama.
 *      Savikaina patikra: _zb_cost meta (esama preke jau turi). Fail-safe =
 *      LEISTI (jei _zb_cost tuscias/0 arba konservas -> nestabdom).
 *
 *   B. petshop_xml_initial_import() qty_zero -> draft VISADA (nauja + esama).
 *      Pasalinta salyga "&& ! $is_update". Salyga lieka PO karteles patikros,
 *      tad pasiekiama tik kai savikaina >= 8 EUR (Monge maistas -> draft).
 *      Pigios prekes (< 8 EUR) qty patikros nepasiekia — jas tvarko kartele
 *      (konservas->draft, ne konservas->trash/blokuota).
 *
 *   C. initial_import KARTELE (< 8 EUR) + ne konservas + ESAMA: jau nebepateks
 *      cia normaliu keliu (update blokuotas filtro A). Lieka kaip antras
 *      sluoksnis (jei filtras apeitas) — bet trash vietoj force-delete cia
 *      netinka (ciklas). Todel esamoms (is_update) < 8 EUR ne konservas ->
 *      tiesiog DRAFT su skip reason (laikina busena iki vienkartinio valymo),
 *      NE trash. Naujoms (! is_update) — trash kaip anksciau (bet jas filtras
 *      jau blokavo, tad praktiskai nepasiekia).
 *
 *   KARTELE (8 EUR) NEPAKEISTA. Konservu/qty_zero->draft logika (v1.5.13)
 *   islieka. VF logika (#5,#7), Legacy guard — nepaliesta.
 *
 * v1.5.13 (2026-06-14): ZB SKIP-BEFORE-CREATE + KONSERVAI/QTY_ZERO -> DRAFT (S97)
 *
 *   KONTEKSTAS: ZB Import #2 veikia "Create new" rezimu (kaip VF). Prekes,
 *   kurios neatitinka kriteriju (savikaina < 8 EUR ARBA qty=0), buvo
 *   SUKURIAMOS, tada initial_import() metE jas i TRASH. Rytinis cron 3:02
 *   ju neranda (trash) -> kuria IS NAUJO kas diena -> ~503 trash/diena
 *   (476 cost_below_minimum + 27 qty_zero). Tiksli VF S92 problema, tik ZB
 *   pusej neuztaisyta — ZB neturejo skip-before-create filtro.
 *
 *   SAVININKO SPRENDIMAS (2026-06-14):
 *     1. KARTELE (savikaina < 8 EUR) — SAMONINGAS sprendimas, logistika
 *        (pigios prekes neapsimoka siusti po viena). LIEKA. Ateity gali mazinti.
 *     2. KONSERVAI — net pigus (< 8 EUR) NEISMETAMI, o -> DRAFT su formules
 *        kaina. Priezastis: konservai bus parduodami BOX RINKINIAIS (12-24 vnt),
 *        kurie praeina kartele. 112 ZB konservu (beveik visi monoprotein/
 *        hipoalerginiai — petshop.lt specializacija). Draft = laukia rankinio
 *        publish / box rinkiniu. Kaina (A): formule VIENA karta, po to
 *        _zb_price_initialized=yes -> importas nebeperrasys (apsaugo rankini darba).
 *     3. qty_zero (preke be likucio) — NEISMETAMA, o -> DRAFT. Priezastis:
 *        preke reali, tik laikinai be likucio (pvz. didelE pakuotE 10kg/12kg).
 *        Atsiras likutis -> rankinis publish / kitas importas.
 *     4. AKSESUARAI (pigus, NE konservas, qty>0) -> NEKURTI VISAI (kartele).
 *
 *   SPRENDIMAS — DU PAKEITIMAI:
 *
 *   A. NAUJAS petshop_xml_block_zb_create() ant wp_all_import_is_post_to_create
 *      (tik ZB Import #2). Logika PRIES sukurima (analogiska VF v1.5.12):
 *        - Konservas (is category ARBA name)            -> LEISTI (taps draft)
 *        - qty <= 0                                      -> LEISTI (taps draft)
 *        - savikaina (price) < 8 IR NE konservas IR qty>0 -> NEKURTI (aksesuaras)
 *        - kitaip                                        -> LEISTI (normali preke)
 *      ZB $data raktai patvirtinti diagnostika 2026-06-14 (ZB Data Diagnose v1):
 *        name, code, ean, brand, category, price, rrp, qty, summary, description...
 *      Fail-safe = LEISTI: bet koks neaiskumas grazina $continue (status quo).
 *      Tik gryna logika (jokiu DB uzklausu) -> nestabdo importo.
 *
 *   B. petshop_xml_initial_import() KEITIMAS:
 *        - cost_below_minimum + KONSERVAS -> DRAFT (su formules kaina), NE trash.
 *        - cost_below_minimum + NE konservas -> kaip iki siol (bet sukurimas jau
 *          blokuotas filtro A; lieka kaip antras sluoksnis esamoms/update).
 *        - qty_zero_on_new -> DRAFT, NE trash.
 *      Konservo detekcija: petshop_xml_is_konservas() / _text_is_konservas() —
 *      is kategorijos ARBA pavadinimo (konserv|wet|pate|mousse|pouch|flakes|chunks).
 *
 *   KO NELIECIA: VF logika (#5,#7) nepaliesta. Legacy guard nepaliestas.
 *   Kartele (8 EUR) nepakeista — tik konservams ir qty_zero pakeistas
 *   rezultatas (draft vietoj trash). Aksesuaru kartele veikia kaip anksciau.
 *
 *   VIENKARTINIS VALYMAS (atskiras snippet "ZB Trash Sutvarkymas v1"):
 *     esami 503 trash -> konservai+qty_zero atkurti i draft, aksesuarai istrinti.
 *
 * v1.5.12 (2026-06-12): VF SKIP-BEFORE-CREATE — filtras atmeta PRIES sukurima
 *
 *   VF Import #5 "Create new" rezime jau apdorotos trash prekes WP All Import
 *   neatpazista kaip esamu -> kuria is naujo kas importa. petshop_xml_block_vf_create()
 *   ant wp_all_import_is_post_to_create iskviecia vf_should_import() +
 *   get_wc_category_slug() PRIES sukurima -> netinkamos prekes nesukuriamos.
 *   Fail-safe = LEISTI. ZB (#2,#3) nepaliesta — filtras scope tik #5.
 *
 * v1.5.11 (2026-06-10): LEGACY GUARD — ZB importai neliecia Legacy prekiu (S91)
 *
 *   ZB importai (#2,#3) NIEKADA neliecia prekes su _legacy_manufacturer.
 *   Preventyvus (is_post_to_update) + reaktyvus (after_import) sluoksniai.
 *   VF logika nepaliesta (VF-match Legacy prekems VF importai legalus, S90).
 *
 * v1.5.10 (2026-06-10): VF stock import ID korekcija [6] -> [7]
 * v1.5.9  (2026-06-10): ZB AUTO-REPRICE (pakeite FREEZE)
 * v1.5.8  (2026-06-09): ZB kainodaros PVM fix (v1.3.4) + KAINOS FREEZE
 * v1.5.7  (2026-06-08): Fulfillment Source resolver
 * v1.5.6  (2026-06-08): Savikainos ir marzos meta box + cost resolver
 * v1.5.5  (2026-06-08): _price sync importo metu + placeholder barkodo apsauga
 * v1.5.2  (2026-06-06): VF Import ID pataisymas
 * v1.5.0  (2026-06-05): VF (Vetfarmas) integracija
 * v1.4.0  (2026-06-04): safe_trash VISADA uzdeda reason pries trash
 * v1.3.3-test8 (2026-06-03): DVIEJU SLUOKSNIU APSAUGA (preventyvus + reaktyvus)
 */

defined( 'ABSPATH' ) || exit;

define( 'PETSHOP_XML_VERSION', '1.5.18' );
define( 'PETSHOP_XML_PATH', plugin_dir_path( __FILE__ ) );
define( 'PETSHOP_XML_BRAND_TAXONOMY', 'product_brand' );

// ZB Import IDs (v1.5.0: atskirta nuo VF)
define( 'PETSHOP_XML_TRASH_IMPORT_IDS', [ 2 ] );        // ZB only (Import #2)
define( 'PETSHOP_XML_ZB_IMPORT_IDS',    [ 2 ] );        // ZB initial
define( 'PETSHOP_XML_ZB_STOCK_IDS',     [ 3 ] );        // ZB stock sync

// v1.5.11: ZB importai, kuriems galioja Legacy guard (initial + stock)
define( 'PETSHOP_XML_ZB_ALL_IMPORT_IDS', [ 2, 3 ] );

// v1.5.13: ZB kartele (savikaina EUR be PVM). Zemiau jos -> aksesuarai nekuriami,
// konservai/qty_zero -> draft. Vienoje vietoje, kad ateity butu lengva keisti.
define( 'PETSHOP_XML_ZB_MIN_COST', 8.0 );

// VF Import IDs (v1.5.2: pataisyta — WP All Import priskyre ID=5, ne 4)
define( 'PETSHOP_XML_VF_TRASH_IMPORT_IDS', [ 5 ] );     // VF trash protection
define( 'PETSHOP_XML_VF_IMPORT_IDS',       [ 5 ] );     // VF initial (Import #5 = VF Products)
define( 'PETSHOP_XML_VF_STOCK_IDS',        [ 7 ] );     // VF stock sync (Import #7)

define( 'PETSHOP_IMPORT_TYPE_INITIAL',    'initial' );
define( 'PETSHOP_IMPORT_TYPE_STOCK',      'stock' );
define( 'PETSHOP_IMPORT_TYPE_COST',       'cost' );
define( 'PETSHOP_IMPORT_TYPE_VF_INITIAL', 'vf_initial' );
define( 'PETSHOP_IMPORT_TYPE_VF_STOCK',   'vf_stock' );

require_once PETSHOP_XML_PATH . 'includes/class-pricing.php';
require_once PETSHOP_XML_PATH . 'includes/class-import-rules.php';
require_once PETSHOP_XML_PATH . 'includes/class-ean-lookup.php';
require_once PETSHOP_XML_PATH . 'includes/class-fulfillment.php';
require_once PETSHOP_XML_PATH . 'includes/class-admin-ui.php';

// VF integracijos failai (v1.5.0)
require_once PETSHOP_XML_PATH . 'includes/class-pricing-vf.php';
require_once PETSHOP_XML_PATH . 'includes/class-import-rules-vf.php';
require_once PETSHOP_XML_PATH . 'includes/class-vf-import.php';

// Savikainos/marzos UI failai (v1.5.6)
require_once PETSHOP_XML_PATH . 'includes/class-product-cost-resolver.php';
require_once PETSHOP_XML_PATH . 'includes/class-product-cost-metabox.php';

// Issiuntimo saltinio resolver (v1.5.7)
require_once PETSHOP_XML_PATH . 'includes/class-fulfillment-source.php';

/**
 * v1.5.11: LEGACY GUARD helper.
 */
function petshop_xml_is_legacy_product( int $post_id ): bool {
    $legacy_manuf = (string) get_post_meta( $post_id, '_legacy_manufacturer', true );
    return $legacy_manuf !== '';
}

/**
 * v1.5.13: KONSERVO DETEKCIJA is teksto (kategorija + pavadinimas).
 * Naudojama PRIES sukurima (block_zb_create, is $data) ir PO (initial_import).
 */
function petshop_xml_text_is_konservas( string $category, string $name ): bool {
    $cat = mb_strtolower( $category );
    if ( mb_strpos( $cat, 'konserv' ) !== false ) {
        return true;
    }
    $title = mb_strtolower( $name );
    if ( preg_match( '/konserv|\bwet\b|pate|paštet|pastet|mousse|pouch|flakes|chunks|gabal.*padaž|drebučiuose|drebuciuose/iu', $title ) ) {
        return true;
    }
    return false;
}

/**
 * v1.5.13: KONSERVO DETEKCIJA pagal post_id (WC kategorija + meta + title).
 */
function petshop_xml_is_konservas( int $post_id ): bool {
    $terms   = wp_get_object_terms( $post_id, 'product_cat', [ 'fields' => 'names' ] );
    $cat_str = ( ! is_wp_error( $terms ) && $terms ) ? implode( ' ', $terms ) : '';
    $zbcat   = (string) get_post_meta( $post_id, '_zb_category', true );
    $title   = (string) get_the_title( $post_id );
    return petshop_xml_text_is_konservas( $cat_str . ' ' . $zbcat, $title );
}

/**
 * v1.5.13: ZB SKIP-BEFORE-CREATE — sprendzia PRIES sukurima (tik ZB Import #2).
 *
 * Hook: wp_all_import_is_post_to_create (analogiska VF v1.5.12).
 *
 * Logika (ZB $data raktai patvirtinti diagnostika 2026-06-14):
 *   - Konservas (category ARBA name)              -> LEISTI (initial_import -> draft)
 *   - qty <= 0                                     -> LEISTI (initial_import -> draft)
 *   - price < MIN_COST IR NE konservas IR qty>0    -> NEKURTI (aksesuaras, kartele)
 *   - kitaip                                       -> LEISTI (normali preke)
 *
 * Fail-safe = LEISTI. Tik gryna logika (jokiu DB uzklausu) -> nestabdo importo.
 * ESME: aksesuarai NET NESUKURIAMI -> nuotrauka neparsisiunciama -> 0 trash.
 */
/**
 * v1.5.18: SAUGUS TEKSTAS IS $data.
 *
 * WP All Import kai kuriuos laukus paduoda MASYVU (kelios kategorijos, keli
 * zenklai viename mazge). Iki v1.5.18 cia stovejo `(string) ( $data[...] )`,
 * o masyvo cast'as i eilute PHP 8.3 duoda warning'a „Array to string
 * conversion" IR reiksme „Array".
 *
 * Tai buvo ne tik triuksmas zurnale: „Array" keliaudavo i
 * `is_excluded_brand()` ir `petshop_xml_text_is_konservas()`, todel vartai
 * TYLIAI praleisdavo preke, kuria turejo sustabdyti — butent ta, del kurios
 * v1.5.17 ir buvo statyti.
 *
 * Skaliarams elgesys NEPAKITES — grazinama ta pati eilute kaip anksciau.
 */
function petshop_xml_tekstas( $reiksme ) {
    if ( is_array( $reiksme ) ) {
        $plokscias = array();
        array_walk_recursive( $reiksme, function( $v ) use ( &$plokscias ) {
            if ( is_scalar( $v ) ) {
                $v = trim( (string) $v );
                if ( $v !== '' ) { $plokscias[] = $v; }
            }
        } );
        return implode( ' ', array_unique( $plokscias ) );
    }
    return is_scalar( $reiksme ) ? (string) $reiksme : '';
}

add_filter( 'wp_all_import_is_post_to_create', 'petshop_xml_block_zb_create', 10, 3 );

function petshop_xml_block_zb_create( $continue_import, $data, $import_id ) {

    // Saugiklis: tik ZB importas #2
    if ( ! in_array( (int) $import_id, PETSHOP_XML_ZB_IMPORT_IDS, true ) ) {
        return $continue_import;
    }
    // Saugiklis: $data turi buti masyvas
    if ( ! is_array( $data ) ) {
        return $continue_import;
    }

    $name     = petshop_xml_tekstas( $data['name'] ?? '' );
    $category = petshop_xml_tekstas( $data['category'] ?? '' );
    $brand    = petshop_xml_tekstas( $data['brand'] ?? '' );
    $price    = isset( $data['price'] ) ? (float) str_replace( ',', '.', (string) $data['price'] ) : 0.0;
    $qty      = isset( $data['qty'] )   ? (int) $data['qty'] : 0;

    // Fail-safe: jei tuscia esmine info -> leisti (neblokuojam aklai)
    if ( $name === '' && $category === '' ) {
        return $continue_import;
    }

    // v1.5.17: EXCLUDED BRAND -> NEKURTI (prie vartu).
    //
    //   Tokie brandai (Hau&Miau, Bioveterinary ir kt.) pas mus JAU egzistuoja
    //   kaip Legacy prekes (su istorija, kaina, SEO). ZB juos irgi siuncia, bet
    //   jie NETURI patekti is ZB — turi but blokuojami "prie vartu", o ne
    //   sukuriami ir tik po to metami i draft (excluded_brand). Anksciau
    //   is_excluded_brand() veike tik PO sukurimo (initial_import) -> preke buvo
    //   sukuriama, parsisiusta nuotrauka, tik po to draft -> siuksles + kreditai.
    //   Dabar blokuojam PRIES sukurima (kaip konservas/qty/aksesuaras patikros).
    //
    //   Brandas tikrinamas is $data['brand']; jei tuscias -> is name (fallback),
    //   nes is_excluded_brand() moka atpazinti pagal pavadinima.
    if ( class_exists( 'Petshop_Import_Rules' ) ) {
        $rules_gate   = new Petshop_Import_Rules();
        $brand_check  = $brand !== '' ? $brand : $name;
        $brand_check  = trim( html_entity_decode( $brand_check, ENT_QUOTES | ENT_HTML5, 'UTF-8' ) );
        if ( $brand_check !== '' && $rules_gate->is_excluded_brand( $brand_check ) ) {
            petshop_xml_log_structured( [
                'action'    => 'ZB-BLOCK-CREATE',
                'name'      => mb_substr( $name, 0, 60 ),
                'brand'     => mb_substr( $brand_check, 0, 40 ),
                'reason'    => 'excluded_brand',
                'import_id' => $import_id,
                'note'      => 'ZB create prevented (excluded brand, exists as Legacy) at the gate (v1.5.17)',
            ] );
            return false; // BLOKUOTI kurima
        }
    }

    // Konservas -> LEISTI (taps draft per initial_import, box rinkiniams)
    if ( petshop_xml_text_is_konservas( $category, $name ) ) {
        return $continue_import;
    }

    // v1.5.15: NAUJA preke qty <= 0 -> NEKURTI.
    //
    //   Priezastis (savininko sprendimas 2026-06-14): nauja preke be likucio
    //   neturi SEO istorijos ir nera paklausos (niekas jos nemate). Jos kurti
    //   neverta — tik kauptu siuksles. Jei ZB veliau atsius ja SU likuciu
    //   (qty>0), ji bus sukurta tada (publish). Tai automatinis "blokavimas":
    //   nauja qty=0 nekuriama, bet grizus su likuciu — kuriama.
    //
    //   ESAMOS prekes qty=0 tvarkomos initial_import() (buvusi publish ->
    //   lieka matoma SEO+paklausai; gimusi draft -> 30 d. cleanup).
    if ( $qty <= 0 ) {
        petshop_xml_log_structured( [
            'action'    => 'ZB-BLOCK-CREATE',
            'name'      => mb_substr( $name, 0, 60 ),
            'category'  => mb_substr( $category, 0, 60 ),
            'price'     => $price,
            'qty'       => $qty,
            'reason'    => 'qty_zero_new_no_history',
            'import_id' => $import_id,
            'note'      => 'ZB create prevented (new qty=0, no SEO/demand) before image download (v1.5.15)',
        ] );
        return false; // BLOKUOTI kurima
    }

    // Aksesuaras: pigus (< kartele) IR NE konservas IR turi likuti -> NEKURTI
    if ( $price > 0 && $price < PETSHOP_XML_ZB_MIN_COST ) {
        petshop_xml_log_structured( [
            'action'    => 'ZB-BLOCK-CREATE',
            'name'      => mb_substr( $name, 0, 60 ),
            'category'  => mb_substr( $category, 0, 60 ),
            'price'     => $price,
            'qty'       => $qty,
            'reason'    => 'cost_below_minimum_accessory',
            'import_id' => $import_id,
            'note'      => 'ZB create prevented (accessory below min cost) before image download (v1.5.13)',
        ] );
        return false; // BLOKUOTI kurima
    }

    // Praeina -> leisti kurti normaliai
    return $continue_import;
}

/**
 * v1.5.14: ZB ESAMU PIGIU PREKIU UPDATE BLOKAVIMAS (tik ZB Import #2,#3).
 *
 * Hook: wp_all_import_is_post_to_update.
 *
 * ESAMA preke, kuri < PETSHOP_XML_ZB_MIN_COST IR NE konservas -> BLOKUOTI update.
 * Priezastis: tokia preke neturi buti kataloge (kartele), bet jei ja LEIDZIAM
 * update'inti, importas perkrauna nuotrauka (ShortPixel kreditai) ir gali mesti
 * i trash -> cron ciklas. Blokuojant update preke NELIECIAMA -> nuotrauka
 * neperkraunama. Vienkartinis valymas (snippet) ja istrina VISAM; po to cron
 * bando kurti -> block_zb_create blokuoja PRIES nuotrauka.
 *
 * Fail-safe = LEISTI: jei _zb_cost tuscias/0 (nezinom savikainos) arba preke
 * konservas -> NEBLOKUOJAM (status quo). Tik gryni atvejai blokuojami.
 *
 * Pastaba: sis filtras eina PO block_legacy_update (prioritetas 9 vs 10),
 * tad Legacy prekes jau atfiltruotos anksciau (ju neliecia).
 */
add_filter( 'wp_all_import_is_post_to_update', 'petshop_xml_block_zb_cheap_update', 11, 4 );

function petshop_xml_block_zb_cheap_update( $continue_import, $post_id, $data, $import_id ) {

    if ( get_post_type( $post_id ) !== 'product' ) {
        return $continue_import;
    }

    // Tik ZB importai (#2 initial, #3 stock)
    if ( ! in_array( (int) $import_id, PETSHOP_XML_ZB_ALL_IMPORT_IDS, true ) ) {
        return $continue_import;
    }

    // Legacy prekes — jau blokuotos block_legacy_update (prioritetas 9). Saugiklis.
    if ( petshop_xml_is_legacy_product( $post_id ) ) {
        return $continue_import;
    }

    // Manual override — neliesti
    if ( get_post_meta( $post_id, '_manual_price_override', true ) === 'yes' ) {
        return $continue_import;
    }

    $zb_cost = (float) get_post_meta( $post_id, '_zb_cost', true );

    // Fail-safe: jei savikainos nezinom -> leisti (neblokuojam aklai)
    if ( $zb_cost <= 0 ) {
        return $continue_import;
    }

    // Konservas -> NEBLOKUOJAM (konservai leidziami net pigus, box rinkiniai)
    if ( petshop_xml_is_konservas( $post_id ) ) {
        return $continue_import;
    }

    // Pigi (< kartele) IR ne konservas IR esama -> BLOKUOTI update
    if ( $zb_cost < PETSHOP_XML_ZB_MIN_COST ) {
        petshop_xml_log_structured( [
            'action'    => 'ZB-BLOCK-CHEAP-UPDATE',
            'post_id'   => $post_id,
            'sku'       => (string) get_post_meta( $post_id, '_sku', true ),
            'zb_cost'   => $zb_cost,
            'import_id' => $import_id,
            'note'      => 'ZB update prevented for existing cheap non-konservas (no image reload, v1.5.14)',
        ] );
        return false;
    }

    return $continue_import;
}
add_filter( 'wp_all_import_is_post_to_create', 'petshop_xml_block_vf_create', 10, 3 );

function petshop_xml_block_vf_create( $continue_import, $data, $import_id ) {

    if ( ! in_array( (int) $import_id, PETSHOP_XML_VF_IMPORT_IDS, true ) ) {
        return $continue_import;
    }
    if ( ! is_array( $data ) ) {
        return $continue_import;
    }
    if ( ! class_exists( 'Petshop_Import_Rules_VF' ) ) {
        return $continue_import;
    }

    $sku         = petshop_xml_tekstas( $data['sku_id'] ?? '' );
    $brand       = petshop_xml_tekstas( $data['brand'] ?? '' );
    $category    = petshop_xml_tekstas( $data['category'] ?? '' );
    $name        = petshop_xml_tekstas( $data['product_name'] ?? '' );
    $description = petshop_xml_tekstas( $data['description'] ?? '' );
    $base_price  = (float)  ( $data['base_price'] ?? 0 );
    $personal    = (float)  ( $data['personal_price'] ?? 0 );

    if ( $sku === '' && $brand === '' && $category === '' ) {
        return $continue_import;
    }

    // v1.5.16: VF DUBLIKATU PREVENCIJA — jei VF sku_id JAU egzistuoja kaip
    // kazkurios NE-trash prekes _vf_supplier_sku (Legacy originalas suporuotas),
    // NEKURTI dublikato. VF Scenarijus A atnaujins esama preke per update
    // (qty+savikaina). Be sios patikros VF "Create new" rezimas kure dublikata
    // kas importa -> atpazindavo (vf_duplicate_of_existing) -> trash -> ciklas.
    //
    // Tik gryna indeksuota meta uzklausa (greita). Fail-safe: jei sku tuscias
    // arba uzklausa nieko negrazina -> testi normalia logika.
    if ( $sku !== '' ) {
        global $wpdb;
        $existing_id = $wpdb->get_var( $wpdb->prepare(
            "SELECT m.post_id FROM {$wpdb->postmeta} m
             INNER JOIN {$wpdb->posts} p ON p.ID = m.post_id
             WHERE m.meta_key = '_vf_supplier_sku' AND m.meta_value = %s
               AND p.post_type = 'product' AND p.post_status != 'trash'
             LIMIT 1",
            $sku
        ) );
        if ( $existing_id ) {
            petshop_xml_log_structured( [
                'action'      => 'VF-BLOCK-CREATE',
                'sku'         => $sku,
                'brand'       => $brand,
                'existing_id' => (int) $existing_id,
                'reason'      => 'vf_sku_already_exists',
                'import_id'   => $import_id,
                'note'        => 'VF create prevented (SKU already paired with existing product) (v1.5.16)',
            ] );
            return false; // BLOKUOTI kurima — esama preke suporuos per update
        }
    }

    $price = $personal > 0 ? $personal : $base_price;

    $rules = new Petshop_Import_Rules_VF();

    $decision = $rules->vf_should_import( $brand, $sku, $category, $description, $name, $price );

    if ( empty( $decision['import'] ) ) {
        petshop_xml_log_structured( [
            'action'    => 'VF-BLOCK-CREATE',
            'sku'       => $sku,
            'brand'     => $brand,
            'category'  => $category,
            'reason'    => (string) ( $decision['reason'] ?? 'unknown' ),
            'import_id' => $import_id,
            'note'      => 'VF create prevented (filter) before image download (v1.5.12)',
        ] );
        return false;
    }

    $slug = $rules->get_wc_category_slug( $category );
    if ( ! $slug ) {
        petshop_xml_log_structured( [
            'action'    => 'VF-BLOCK-CREATE',
            'sku'       => $sku,
            'brand'     => $brand,
            'category'  => $category,
            'reason'    => 'no_category_mapping',
            'import_id' => $import_id,
            'note'      => 'VF create prevented (no mapping) before image download (v1.5.12)',
        ] );
        return false;
    }

    return $continue_import;
}

/**
 * v1.5.11: PREVENTYVUS LEGACY GUARD — ZB importai (#2, #3) neliecia Legacy prekiu.
 */
add_filter( 'wp_all_import_is_post_to_update', 'petshop_xml_block_legacy_update', 9, 4 );

function petshop_xml_block_legacy_update( $continue_import, $post_id, $data, $import_id ) {

    if ( get_post_type( $post_id ) !== 'product' ) {
        return $continue_import;
    }

    if ( ! in_array( (int) $import_id, PETSHOP_XML_ZB_ALL_IMPORT_IDS, true ) ) {
        return $continue_import;
    }

    if ( petshop_xml_is_legacy_product( $post_id ) ) {
        petshop_xml_log_structured( [
            'action'    => 'LEGACY-BLOCK-UPDATE',
            'post_id'   => $post_id,
            'sku'       => (string) get_post_meta( $post_id, '_sku', true ),
            'legacy'    => (string) get_post_meta( $post_id, '_legacy_manufacturer', true ),
            'import_id' => $import_id,
            'note'      => 'ZB import update prevented for Legacy product (v1.5.11 guard)',
        ] );
        return false;
    }

    return $continue_import;
}

/**
 * v1.3.3-test8: PREVENTYVUS SAUGIKLIS pries WP All Import perrasymus
 */
add_filter( 'wp_all_import_is_post_to_update', 'petshop_xml_block_junk_update', 10, 4 );

function petshop_xml_block_junk_update( $continue_import, $post_id, $data, $import_id ) {

    if ( get_post_type( $post_id ) !== 'product' ) {
        return $continue_import;
    }

    if ( ! in_array( (int) $import_id, PETSHOP_XML_TRASH_IMPORT_IDS, true ) ) {
        return $continue_import;
    }

    $current_status = get_post_status( $post_id );

    if ( in_array( $current_status, [ 'trash', 'draft' ], true ) ) {

        if ( petshop_xml_is_existing_zb_junk( $post_id ) ) {

            $reason = (string) get_post_meta( $post_id, '_petshop_review_reason', true );
            $protected_reasons = [ 'cost_below_minimum', 'excluded_brand', 'qty_zero_on_new', 'duplicate_ean', 'konservas_below_minimum' ];

            if ( in_array( $reason, $protected_reasons, true ) ) {
                petshop_xml_log_structured( [
                    'action'     => 'BLOCK-UPDATE',
                    'post_id'    => $post_id,
                    'status'     => $current_status,
                    'reason'     => $reason,
                    'import_id'  => $import_id,
                    'note'       => 'WP All Import update prevented for ZB junk',
                ] );
                return false;
            }
        }
    }

    return $continue_import;
}

add_action( 'pmxi_saved_post', 'petshop_xml_after_import', 10, 3 );


function petshop_xml_after_import( $post_id, $data, $is_update ) {

    if ( get_post_type( $post_id ) !== 'product' ) {
        return;
    }

    global $wpdb;
    $current_import_id = (int) $wpdb->get_var( $wpdb->prepare(
        "SELECT import_id FROM {$wpdb->prefix}pmxi_posts 
         WHERE post_id = %d ORDER BY id DESC LIMIT 1",
        $post_id
    ) );

    // v1.5.11: REAKTYVUS LEGACY GUARD
    $is_zb_import = in_array( $current_import_id, PETSHOP_XML_ZB_ALL_IMPORT_IDS, true );
    if ( $is_zb_import && petshop_xml_is_legacy_product( $post_id ) ) {
        petshop_xml_log_structured( [
            'action'    => 'LEGACY-SKIP',
            'post_id'   => $post_id,
            'sku'       => (string) get_post_meta( $post_id, '_sku', true ),
            'legacy'    => (string) get_post_meta( $post_id, '_legacy_manufacturer', true ),
            'import_id' => $current_import_id,
            'note'      => 'ZB dispatch skipped for Legacy product (v1.5.11 guard)',
        ] );
        return;
    }

    if ( $current_import_id === 3 ) {
        petshop_xml_log( "Import #3 (STOCK) for post {$post_id}" );
        petshop_xml_sync_only( $post_id, PETSHOP_IMPORT_TYPE_STOCK );
        return;
    }

    if ( in_array( $current_import_id, PETSHOP_XML_VF_STOCK_IDS, true ) ) {
        petshop_xml_log( "Import #{$current_import_id} (VF STOCK) for post {$post_id}" );
        petshop_xml_vf_stock_sync( $post_id );
        return;
    }

    if ( in_array( $current_import_id, PETSHOP_XML_VF_IMPORT_IDS, true ) ) {
        petshop_xml_log( "Import #{$current_import_id} (VF INITIAL) for post {$post_id}" );
        petshop_xml_vf_initial_import( $post_id, $is_update );
        return;
    }

    if ( in_array( $current_import_id, PETSHOP_XML_ZB_IMPORT_IDS, true ) ) {
        petshop_xml_log( "Import #{$current_import_id} (ZB INITIAL) for post {$post_id}" );
        petshop_xml_initial_import( $post_id, $is_update );
        return;
    }

    petshop_xml_log( "SKIP: unknown import_id={$current_import_id} for post {$post_id}" );
    return;
}

function petshop_xml_safe_trash( int $post_id, bool $is_update, string $reason, array $context = [], bool $allow_existing_zb_junk = false ): bool {

    if ( $is_update && ! $allow_existing_zb_junk ) {
        return false;
    }

    $current_import_id = petshop_xml_get_current_import_id( $post_id );

    if ( $current_import_id !== null && ! in_array( $current_import_id, PETSHOP_XML_TRASH_IMPORT_IDS, true ) ) {
        petshop_xml_log_structured( [
            'action'     => 'SKIP-NOT-TARGET',
            'post_id'    => $post_id,
            'reason'     => $reason,
            'import_id'  => $current_import_id,
            'note'       => 'Not in allowed list: ' . implode( ',', PETSHOP_XML_TRASH_IMPORT_IDS ),
        ] );
        return false;
    }

    $sku   = (string) get_post_meta( $post_id, '_sku', true );
    $ean   = (string) get_post_meta( $post_id, '_zb_ean', true ) 
             ?: (string) get_post_meta( $post_id, '_global_unique_id', true );
    $price = (string) get_post_meta( $post_id, '_zb_cost', true );

    update_post_meta( $post_id, '_petshop_review_reason', $reason );
    update_post_meta( $post_id, '_zb_skip_reason', $reason );

    $result = wp_trash_post( $post_id );

    petshop_xml_log_structured( array_merge( [
        'action'     => $result ? 'TRASHED' : 'TRASH-FAILED',
        'post_id'    => $post_id,
        'sku'        => $sku,
        'ean'        => $ean,
        'price'      => $price,
        'reason'     => $reason,
        'is_update'  => $is_update ? 'yes' : 'no',
        'import_id'  => $current_import_id,
    ], $context ) );

    return $result !== false;
}

/**
 * v1.5.13: KONSERVAS/QTY_ZERO -> DRAFT (vietoj trash).
 *
 * Konservams (su $set_konservas_price=true) papildomai skaiciuoja formules
 * kaina VIENA karta (A variantas) + _zb_price_initialized=yes -> importas
 * nebeperrasys (apsaugo rankini darba).
 */
function petshop_xml_zb_to_draft( int $post_id, string $reason, bool $set_konservas_price = false ): void {

    wp_update_post( [ 'ID' => $post_id, 'post_status' => 'draft' ] );
    update_post_meta( $post_id, '_petshop_review_reason', $reason );
    update_post_meta( $post_id, '_zb_skip_reason', $reason );
    update_post_meta( $post_id, '_zb_draft_reason', $reason );

    if ( $set_konservas_price ) {
        $zb_cost   = (float) get_post_meta( $post_id, '_zb_cost', true );
        $already   = ( get_post_meta( $post_id, '_zb_price_initialized', true ) === 'yes' );
        $price     = get_post_meta( $post_id, '_price', true );
        $has_price = ( $price !== '' && $price !== null && (float) $price > 0 );

        if ( $zb_cost > 0 && ! $already && ! $has_price && class_exists( 'Petshop_Pricing' ) ) {
            $pricing   = new Petshop_Pricing();
            $cat_slugs = petshop_xml_get_cat_slugs( $post_id );
            $result    = $pricing->calculate_final_price( $zb_cost, $cat_slugs );
            $final     = $result['price'];

			/* DĖMESIO (2026-08-08, S709): čia kaina rašoma TIESIAI į meta,
			 * apeinant WooCommerce CRUD — wc_product_meta_lookup NEATSINAUJINA.
			 * Dabar tai padengia mu-plugins/petshop-wc-sync.php (sargas gaudo
			 * meta pakeitimą). Be jo parduotuvės filtrai rodytų seną kainą. */
            update_post_meta( $post_id, '_price', $final );
            update_post_meta( $post_id, '_regular_price', $final );
            // A variantas: kaina fiksuojama, importas nebeperrasys
            update_post_meta( $post_id, '_zb_price_initialized', 'yes' );
            petshop_xml_log( "ZB KONSERVAS->DRAFT post {$post_id} | formule kaina={$final} (initialized, A)" );
        }
    }
}

function petshop_xml_get_current_import_id( int $post_id ): ?int {

    global $pmxi_import;
    if ( isset( $pmxi_import ) && is_object( $pmxi_import ) && ! empty( $pmxi_import->id ) ) {
        return (int) $pmxi_import->id;
    }

    if ( function_exists( 'wp_all_import_get_import_id' ) ) {
        $id = wp_all_import_get_import_id();
        if ( $id ) return (int) $id;
    }

    global $wpdb;
    $pmxi_posts = $wpdb->prefix . 'pmxi_posts';
    if ( $wpdb->get_var( "SHOW TABLES LIKE '$pmxi_posts'" ) ) {
        $import_id = $wpdb->get_var( $wpdb->prepare(
            "SELECT import_id FROM $pmxi_posts WHERE post_id = %d ORDER BY id DESC LIMIT 1",
            $post_id
        ) );
        if ( $import_id ) return (int) $import_id;
    }

    return null;
}

function petshop_xml_is_existing_zb_junk( int $post_id ): bool {

    $post = get_post( $post_id );
    if ( ! $post ) return false;

    $post_date_ts = strtotime( $post->post_date );
    $zb_era_start = strtotime( '2026-05-27 00:00:00' );

    if ( $post_date_ts < $zb_era_start ) {
        return false;
    }

    $zb_enabled = get_post_meta( $post_id, '_zb_enabled', true );
    if ( $zb_enabled !== 'yes' ) {
        return false;
    }

    $manual_price = get_post_meta( $post_id, '_manual_price_override', true );
    if ( $manual_price === 'yes' ) {
        return false;
    }

    return true;
}

function petshop_xml_sync_only( int $post_id, string $import_type ): void {

    $fulfillment = new Petshop_Fulfillment();

    $zb_qty  = (int)   get_post_meta( $post_id, '_zb_qty', true );
    $zb_cost = (float) get_post_meta( $post_id, '_zb_cost', true );
    $zb_sku  = (string)get_post_meta( $post_id, '_zb_supplier_sku', true );

    update_post_meta( $post_id, '_zb_last_sync', current_time( 'mysql' ) );

    if ( $import_type === PETSHOP_IMPORT_TYPE_STOCK ) {
        update_post_meta( $post_id, '_zb_qty', $zb_qty );
        $fulfillment->recalculate( $post_id );
        petshop_xml_log( "STOCK SYNC post {$post_id} | zb_qty={$zb_qty}" );
    }

    if ( $import_type === PETSHOP_IMPORT_TYPE_COST ) {
        $old_cost = (float) get_post_meta( $post_id, '_zb_cost_prev', true );

        update_post_meta( $post_id, '_zb_cost', $zb_cost );
        update_post_meta( $post_id, '_zb_cost_prev', $zb_cost );

        if ( $old_cost > 0 && abs( $zb_cost - $old_cost ) / $old_cost > 0.15 ) {
            $existing = get_post_meta( $post_id, '_petshop_review_reason', true );
            $reasons  = $existing ? $existing . ', cost_change_over_15pct' : 'cost_change_over_15pct';
            update_post_meta( $post_id, '_petshop_review_reason', $reasons );
            petshop_xml_log( "COST SYNC: cost change >15% post {$post_id} | review flag" );
        }

        petshop_xml_log( "COST SYNC post {$post_id} | zb_cost={$zb_cost} (cost only; reprice = initial_import path)" );
    }
}

function petshop_xml_initial_import( int $post_id, bool $is_update ): void {

    $zb_cost   = (float)  get_post_meta( $post_id, '_zb_cost', true );
    $zb_qty    = (int)    get_post_meta( $post_id, '_zb_qty', true );
    $zb_sku    = (string) get_post_meta( $post_id, '_zb_supplier_sku', true );
    $zb_ean    = (string) get_post_meta( $post_id, '_zb_ean', true );
    $zb_brand  = (string) get_post_meta( $post_id, '_zb_brand', true );
    $zb_rrp    = (float)  get_post_meta( $post_id, '_zb_rrp', true );
    $zb_weight = (float)  get_post_meta( $post_id, '_zb_weight', true );
    $zb_length = (float)  get_post_meta( $post_id, '_zb_length', true );
    $zb_width  = (float)  get_post_meta( $post_id, '_zb_width', true );
    $zb_height = (float)  get_post_meta( $post_id, '_zb_height', true );

    $rules       = new Petshop_Import_Rules();
    $pricing     = new Petshop_Pricing();
    $ean_db      = new Petshop_EAN_Lookup();
    $fulfillment = new Petshop_Fulfillment();

    $post        = get_post( $post_id );
    $clean_title = $rules->clean_title( $post ? $post->post_title : '' );

    $check_brand = $zb_brand ?: $clean_title;
    $check_brand = trim( html_entity_decode( $check_brand, ENT_QUOTES | ENT_HTML5, 'UTF-8' ) );

    if ( $rules->is_excluded_brand( $check_brand ) ) {
        if ( ! $is_update ) {
            $trashed = petshop_xml_safe_trash( $post_id, $is_update, 'excluded_brand', [
                'brand' => $check_brand,
            ] );
            if ( ! $trashed ) {
                wp_update_post( [ 'ID' => $post_id, 'post_status' => 'draft' ] );
                update_post_meta( $post_id, '_petshop_review_reason', 'excluded_brand' );
                update_post_meta( $post_id, '_zb_skip_reason', 'excluded_brand' );
            }
            return;
        }
        if ( petshop_xml_is_existing_zb_junk( $post_id ) ) {
            $trashed = petshop_xml_safe_trash( $post_id, true, 'excluded_brand', [
                'brand' => $check_brand,
                'note'  => 'existing_zb_junk',
            ], true );
            if ( ! $trashed ) {
                wp_update_post( [ 'ID' => $post_id, 'post_status' => 'draft' ] );
                update_post_meta( $post_id, '_petshop_review_reason', 'excluded_brand' );
                update_post_meta( $post_id, '_zb_skip_reason', 'excluded_brand' );
                petshop_xml_log( "FALLBACK DRAFT: excluded_brand existing zb junk post {$post_id} (safe_trash failed)" );
            }
            return;
        }
        wp_update_post( [ 'ID' => $post_id, 'post_status' => 'draft' ] );
        update_post_meta( $post_id, '_petshop_review_reason', 'excluded_brand' );
        update_post_meta( $post_id, '_zb_skip_reason', 'excluded_brand' );
        petshop_xml_log( "EXCLUDED BRAND non-zb-junk post {$post_id} → draft" );
        return;
    }

    // -----------------------------------------------------------------
    // v1.5.13: KARTELE (savikaina < PETSHOP_XML_ZB_MIN_COST)
    //
    //   - KONSERVAS -> DRAFT su formules kaina (NE trash). Box rinkiniai (S97).
    //   - NE konservas (aksesuaras) -> kaip iki siol (draft/trash). Naujo
    //     sukurimo kelyje filtras (block_zb_create) jau neleido sukurti, tad
    //     cia daugiausia ateis esamos / update prekes.
    // -----------------------------------------------------------------
    if ( $zb_cost < PETSHOP_XML_ZB_MIN_COST ) {

        if ( petshop_xml_is_konservas( $post_id ) ) {
            // KONSERVAS -> DRAFT su formules kaina (A: viena karta)
            update_post_meta( $post_id, '_zb_cost', $zb_cost );
            update_post_meta( $post_id, '_zb_enabled', 'yes' );
            update_post_meta( $post_id, '_zb_qty', $zb_qty );
            update_post_meta( $post_id, '_zb_supplier_sku', $zb_sku );
            petshop_xml_zb_to_draft( $post_id, 'konservas_below_minimum', true );
            petshop_xml_log( "KONSERVAS DRAFT post {$post_id} | zb_cost={$zb_cost} (box rinkiniams, S97)" );
            return;
        }

        // NE konservas (aksesuaras)
        //
        // v1.5.14: ESAMA preke (is_update) — NE i trash, o DRAFT su skip reason.
        // Priezastis: trash -> cron neranda -> kuria is naujo -> nuotrauka ->
        // ciklas. Update filtras (block_zb_cheap_update) sias esamas prekes
        // jau blokuoja anksciau, tad cia praktiskai nepasieks; bet jei pasiektu
        // (filtras apeitas), draft yra saugu (ne ciklas). Vienkartinis valymas
        // (snippet) jas istrina VISAM.
        if ( $is_update ) {
            wp_update_post( [ 'ID' => $post_id, 'post_status' => 'draft' ] );
            update_post_meta( $post_id, '_petshop_review_reason', 'cost_below_minimum' );
            update_post_meta( $post_id, '_zb_skip_reason', 'cost_below_minimum' );
            petshop_xml_log( "DRAFT (existing): cost_below_minimum non-konservas post {$post_id} | zb_cost={$zb_cost} (no trash, v1.5.14)" );
            return;
        }

        // NAUJA preke — trash kaip anksciau (bet block_zb_create jau blokavo,
        // tad praktiskai nepasiekia).
        $trashed = petshop_xml_safe_trash( $post_id, $is_update, 'cost_below_minimum', [
            'zb_cost' => $zb_cost,
        ] );
        if ( ! $trashed ) {
            wp_update_post( [ 'ID' => $post_id, 'post_status' => 'draft' ] );
            update_post_meta( $post_id, '_petshop_review_reason', 'cost_below_minimum' );
        }
        return;
    }

    // -----------------------------------------------------------------
    // v1.5.15: qty_zero ESAMAI prekei — SEO + paklausos logika (S98).
    //
    //   Savininko patirtis (2026-06-14): klientai megsta pasizymeti preke, kai
    //   jos nera ("pranesk kai bus"); atsiradus likuciui, ypac populiariu prekiu,
    //   pirkimai vyksta is karto. Tad qty=0 preke = paklausos ASSET, ne siukle.
    //   Plius SEO: buvusi publish preke turi URL/nuorodas — draft = 404 = SEO
    //   praradimas. Todel:
    //
    //   - BUVUSI PUBLISH (_zb_was_published=yes) qty=0 -> LIEKA PUBLISH (matoma,
    //     SEO saugus, renka paklausa). NE draft. Importas qty=0 nepaslepia.
    //   - GIMUSI DRAFT (niekada nebuvo publish) qty=0 -> lieka draft +
    //     _zb_qty_zero_since data (30 d. cleanup atskiru snippet).
    //   - NAUJA preke qty=0 cia nepasiekia — block_zb_create ja jau blokavo.
    //
    //   Pasiekiama tik kai savikaina >= kartele (pigios aptvarkytos auksciau).
    // -----------------------------------------------------------------
    if ( $zb_qty <= 0 ) {
        update_post_meta( $post_id, '_zb_cost', $zb_cost );
        update_post_meta( $post_id, '_zb_enabled', 'yes' );
        update_post_meta( $post_id, '_zb_qty', $zb_qty );
        update_post_meta( $post_id, '_zb_supplier_sku', $zb_sku );

        $was_published = ( get_post_meta( $post_id, '_zb_was_published', true ) === 'yes' );
        $cur_status    = get_post_status( $post_id );

        if ( $was_published || $cur_status === 'publish' ) {
            // BUVUSI PUBLISH -> LIEKA PUBLISH (SEO + paklausa "pranesk kai bus").
            // Pazymim was_published (jei dar nebuvo) ir qty_zero pradzios data.
            update_post_meta( $post_id, '_zb_was_published', 'yes' );
            if ( ! get_post_meta( $post_id, '_zb_qty_zero_since', true ) ) {
                update_post_meta( $post_id, '_zb_qty_zero_since', current_time( 'mysql' ) );
            }
            // Statusas lieka publish; WC stock status -> outofstock (zyma)
            update_post_meta( $post_id, '_stock_status', 'outofstock' );
            $fulfillment->recalculate( $post_id );
            if ( $cur_status !== 'publish' ) {
                wp_update_post( [ 'ID' => $post_id, 'post_status' => 'publish' ] );
            }
            petshop_xml_log( "QTY_ZERO PUBLISH-KEPT post {$post_id} | was_published, SEO+demand (S98)" );
            return;
        }

        // GIMUSI DRAFT (niekada nebuvo publish) -> draft + qty_zero_since
        if ( ! get_post_meta( $post_id, '_zb_qty_zero_since', true ) ) {
            update_post_meta( $post_id, '_zb_qty_zero_since', current_time( 'mysql' ) );
        }
        petshop_xml_zb_to_draft( $post_id, 'qty_zero_never_published', false );
        petshop_xml_log( "QTY_ZERO DRAFT post {$post_id} | zb_qty={$zb_qty} | never published (30d cleanup, S98)" );
        return;
    }

    if ( $zb_ean ) {
        $existing_id = $ean_db->find_by_ean( $zb_ean, $post_id );
        if ( $existing_id ) {
            if ( petshop_xml_is_legacy_product( $existing_id ) ) {
                petshop_xml_log_structured( [
                    'action'      => 'LEGACY-ATTACH-SKIP',
                    'post_id'     => $post_id,
                    'existing_id' => $existing_id,
                    'ean'         => $zb_ean,
                    'note'        => 'EAN matches Legacy product; ZB fields NOT attached (v1.5.11 guard)',
                ] );
            } else {
                $ean_db->update_zb_fields( $existing_id, $zb_cost, $zb_qty, $zb_sku, $zb_ean );
                $fulfillment->recalculate( $existing_id );
            }

            if ( ! $is_update ) {
                $trashed = petshop_xml_safe_trash( $post_id, $is_update, 'duplicate_ean', [
                    'original_id' => $existing_id,
                    'ean'         => $zb_ean,
                ] );
                if ( ! $trashed ) {
                    wp_update_post( [ 'ID' => $post_id, 'post_status' => 'draft' ] );
                    update_post_meta( $post_id, '_petshop_review_reason', 'duplicate_ean' );
                    update_post_meta( $post_id, '_duplicate_of', $existing_id );
                }
                return;
            }
            wp_update_post( [ 'ID' => $post_id, 'post_status' => 'draft' ] );
            update_post_meta( $post_id, '_petshop_review_reason', 'duplicate_ean' );
            update_post_meta( $post_id, '_duplicate_of', $existing_id );
            petshop_xml_log( "DUPLICATE EAN existing post {$post_id} → draft | original={$existing_id}" );
            return;
        }
        update_post_meta( $post_id, '_ean', $zb_ean );
        update_post_meta( $post_id, '_zb_ean', $zb_ean );
    }

    update_post_meta( $post_id, '_zb_enabled', 'yes' );
    update_post_meta( $post_id, '_zb_last_sync', current_time( 'mysql' ) );
    update_post_meta( $post_id, '_zb_qty', $zb_qty );
    update_post_meta( $post_id, '_zb_cost', $zb_cost );
    update_post_meta( $post_id, '_zb_supplier_sku', $zb_sku );
    update_post_meta( $post_id, '_fulfillment_carrier', 'venipak' );

    $manual_price  = get_post_meta( $post_id, '_manual_price_override', true );
    $lock_pricing  = get_post_meta( $post_id, '_petshop_lock_pricing', true );
    $review_reason = [];
    $cat_slugs     = petshop_xml_get_cat_slugs( $post_id );

    $old_cost     = (float) get_post_meta( $post_id, '_zb_cost_prev', true );
    $cost_changed = ( $old_cost > 0 && abs( $zb_cost - $old_cost ) > 0.001 );
    if ( $old_cost > 0 && abs( $zb_cost - $old_cost ) / $old_cost > 0.15 ) {
        $review_reason[] = 'cost_change_over_15pct';
    }
    update_post_meta( $post_id, '_zb_cost_prev', $zb_cost );

    $price_locked      = ( $manual_price === 'yes' || $lock_pricing === 'yes' );
    $price_initialized = ( get_post_meta( $post_id, '_zb_price_initialized', true ) === 'yes' );
    $existing_price    = get_post_meta( $post_id, '_price', true );
    $has_valid_price   = ( $existing_price !== '' && $existing_price !== null && (float) $existing_price > 0 );

    $price_action = 'none';

    if ( ! $price_locked && ! $price_initialized && ! $has_valid_price ) {
        $price_result  = $pricing->calculate_final_price( $zb_cost, $cat_slugs );
        $final_price   = $price_result['price'];
        $review_reason = array_merge( $review_reason, $price_result['review_reasons'] );


			/* DĖMESIO (2026-08-08, S709): čia kaina rašoma TIESIAI į meta,
			 * apeinant WooCommerce CRUD — wc_product_meta_lookup NEATSINAUJINA.
			 * Dabar tai padengia mu-plugins/petshop-wc-sync.php (sargas gaudo
			 * meta pakeitimą). Be jo parduotuvės filtrai rodytų seną kainą. */
        update_post_meta( $post_id, '_price', $final_price );
        update_post_meta( $post_id, '_regular_price', $final_price );
        update_post_meta( $post_id, '_zb_price_initialized', 'yes' );
        $price_action = 'new';

    } elseif ( ! $price_locked && $cost_changed ) {
        $price_result = $pricing->calculate_final_price( $zb_cost, $cat_slugs );
        $new_regular  = $price_result['price'];

        $old_regular = (float) get_post_meta( $post_id, '_regular_price', true );
        $sale_price  = get_post_meta( $post_id, '_sale_price', true );
        $has_sale    = ( $sale_price !== '' && $sale_price !== null && (float) $sale_price > 0 );

        $sale_active = false;
        if ( $has_sale ) {
            $now       = current_time( 'timestamp' );
            $sale_from = (int) get_post_meta( $post_id, '_sale_price_dates_from', true );
            $sale_to   = (int) get_post_meta( $post_id, '_sale_price_dates_to', true );
            $sale_active = ( ( ! $sale_from || $sale_from <= $now ) && ( ! $sale_to || $sale_to >= $now ) );
        }

        if ( $sale_active && $new_regular <= (float) $sale_price ) {
            $review_reason[] = 'reprice_blocked_by_sale';
            $price_action    = 'blocked_by_sale';
            petshop_xml_log( "AUTO-REPRICE BLOCKED post {$post_id} | new_regular={$new_regular} <= sale={$sale_price}" );

        } elseif ( abs( $new_regular - $old_regular ) > 0.001 ) {
            $review_reason = array_merge( $review_reason, $price_result['review_reasons'] );

            update_post_meta( $post_id, '_regular_price', $new_regular );
            if ( $sale_active ) {

			/* DĖMESIO (2026-08-08, S709): čia kaina rašoma TIESIAI į meta,
			 * apeinant WooCommerce CRUD — wc_product_meta_lookup NEATSINAUJINA.
			 * Dabar tai padengia mu-plugins/petshop-wc-sync.php (sargas gaudo
			 * meta pakeitimą). Be jo parduotuvės filtrai rodytų seną kainą. */
                update_post_meta( $post_id, '_price', $sale_price );
            } else {

			/* DĖMESIO (2026-08-08, S709): čia kaina rašoma TIESIAI į meta,
			 * apeinant WooCommerce CRUD — wc_product_meta_lookup NEATSINAUJINA.
			 * Dabar tai padengia mu-plugins/petshop-wc-sync.php (sargas gaudo
			 * meta pakeitimą). Be jo parduotuvės filtrai rodytų seną kainą. */
                update_post_meta( $post_id, '_price', $new_regular );
            }
            if ( ! $price_initialized ) {
                update_post_meta( $post_id, '_zb_price_initialized', 'yes' );
            }
            if ( function_exists( 'wc_delete_product_transients' ) ) {
                wc_delete_product_transients( $post_id );
            }
            $final_price  = $new_regular;
            $price_action = 'repriced';
            petshop_xml_log( "AUTO-REPRICE post {$post_id} | cost {$old_cost}->{$zb_cost} | regular {$old_regular}->{$new_regular}" . ( $sale_active ? ' | sale kept=' . $sale_price : '' ) );

        } else {
            $price_action = 'unchanged_after_rounding';
        }
    }

    if ( $zb_weight > 0 ) update_post_meta( $post_id, '_weight', $zb_weight );
    if ( $zb_length > 0 ) update_post_meta( $post_id, '_length', $zb_length );
    if ( $zb_width  > 0 ) update_post_meta( $post_id, '_width', $zb_width );
    if ( $zb_height > 0 ) update_post_meta( $post_id, '_height', $zb_height );

    if ( $rules->is_oversize( $zb_weight, $zb_length, $zb_width, $zb_height ) ) {
        $review_reason[] = 'logistics_oversize';
        update_post_meta( $post_id, '_fulfillment_courier_only', 'yes' );
    }

    $fulfillment->recalculate( $post_id );

    if ( ! $is_update && $post ) {
        $clean = $rules->strip_inline_styles( $post->post_content );
        if ( $clean !== $post->post_content ) {
            wp_update_post( [ 'ID' => $post_id, 'post_content' => $clean ] );
        }
    }

    if ( ! $is_update && $post && $clean_title !== $post->post_title ) {
        wp_update_post( [ 'ID' => $post_id, 'post_title' => $clean_title ] );
    }

    $has_brand    = ! empty( wp_get_object_terms( $post_id, PETSHOP_XML_BRAND_TAXONOMY, [ 'fields' => 'ids' ] ) );
    $manual_brand = get_post_meta( $post_id, '_manual_brand_override', true );
    if ( ! $is_update || ( ! $has_brand && $manual_brand !== 'yes' ) ) {
        $normalized = $rules->normalize_brand( $zb_brand, $clean_title );
        if ( $normalized ) {
            wp_set_object_terms( $post_id, $normalized, PETSHOP_XML_BRAND_TAXONOMY );
        } else {
            $review_reason[] = 'missing_brand';
        }
    }

    $status = $rules->determine_status( $post_id, $zb_ean, $zb_cost, $zb_qty, $cat_slugs, $review_reason );
    wp_update_post( [ 'ID' => $post_id, 'post_status' => $status ] );

    // v1.5.15: pazymeti, kad preke buvo publish (qty=0 SEO+paklausos logikai).
    // Kai preke publish IR turi likuti -> _zb_was_published=yes; isvalom
    // qty_zero_since (nes vel turi likuti). Sis flagas islieka visam — jei
    // veliau qty=0, preke liks publish (matoma, SEO, "pranesk kai bus").
    if ( $status === 'publish' ) {
        update_post_meta( $post_id, '_zb_was_published', 'yes' );
        if ( $zb_qty > 0 ) {
            delete_post_meta( $post_id, '_zb_qty_zero_since' );
        }
    }

    if ( ! empty( $review_reason ) ) {
        update_post_meta( $post_id, '_petshop_review_reason', implode( ', ', $review_reason ) );
    } else {
        delete_post_meta( $post_id, '_petshop_review_reason' );
    }

    petshop_xml_log(
        "INITIAL post {$post_id} | " . ($is_update?'update':'new') .
        " | status={$status} | price_action={$price_action}" .
        " | price=" . (isset($final_price)?$final_price:'untouched') .
        " | zb_qty={$zb_qty}" .
        (!empty($review_reason)?' | review:'.implode(',',$review_reason):'')
    );
}

function petshop_xml_get_cat_slugs( int $post_id ): array {
    $slugs = [];
    foreach ( wc_get_product_term_ids( $post_id, 'product_cat' ) as $tid ) {
        $term = get_term( $tid, 'product_cat' );
        if ( $term && ! is_wp_error( $term ) ) $slugs[] = $term->slug;
    }
    return $slugs;
}

function petshop_xml_log( string $msg ): void {
    $dir  = WP_CONTENT_DIR . '/uploads/petshop-private-logs/';
    $file = $dir . 'zb-import.log';
    if ( ! is_dir( $dir ) ) {
        wp_mkdir_p( $dir );
        file_put_contents( $dir . '.htaccess', "deny from all\n" );
    }
    file_put_contents( $file, '['.date('Y-m-d H:i:s').'] '.$msg.PHP_EOL, FILE_APPEND | LOCK_EX );
}

function petshop_xml_log_structured( array $data ): void {
    $parts = [];
    foreach ( $data as $key => $val ) {
        $parts[] = $key . '=' . (string) $val;
    }
    $msg = '[STRUCT] ' . implode( ' | ', $parts );
    petshop_xml_log( $msg );
}

add_action( 'admin_post_petshop_download_log', function() {
    if ( ! current_user_can('manage_woocommerce') ) wp_die('Prieiga draudžiama');
    check_admin_referer('petshop_download_log');
    $f = WP_CONTENT_DIR.'/uploads/petshop-private-logs/zb-import.log';
    if ( ! file_exists($f) ) wp_die('Log neegzistuoja');
    header('Content-Type: text/plain');
    header('Content-Disposition: attachment; filename="zb-import.log"');
    readfile($f); exit;
});

/**
 * v1.5.0: VF TRASH PROTECTION (update kelias)
 */
add_filter( 'wp_all_import_is_post_to_update', 'petshop_xml_block_vf_trash_update', 10, 4 );

function petshop_xml_block_vf_trash_update( $continue_import, $post_id, $data, $import_id ) {

    if ( get_post_type( $post_id ) !== 'product' ) {
        return $continue_import;
    }

    if ( ! in_array( (int) $import_id, PETSHOP_XML_VF_TRASH_IMPORT_IDS, true ) ) {
        return $continue_import;
    }

    $current_status = get_post_status( $post_id );
    if ( ! in_array( $current_status, [ 'trash', 'draft' ], true ) ) {
        return $continue_import;
    }

    $vf_duplicate_of = get_post_meta( $post_id, '_vf_duplicate_of', true );
    $vf_skip_reason  = get_post_meta( $post_id, '_vf_skip_reason', true );

    if ( ! empty( $vf_duplicate_of ) || ! empty( $vf_skip_reason ) ) {
        petshop_xml_log_structured( [
            'action'           => 'VF-BLOCK-UPDATE',
            'post_id'          => $post_id,
            'status'           => $current_status,
            'vf_duplicate_of'  => $vf_duplicate_of,
            'vf_skip_reason'   => $vf_skip_reason,
            'import_id'        => $import_id,
            'note'             => 'WP All Import update prevented for VF trash/skipped',
        ] );
        return false;
    }

    return $continue_import;
}
