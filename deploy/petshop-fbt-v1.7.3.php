<?php
/**
 * Plugin Name: Petshop FBT (Dažnai perkama kartu)
 * Description: "Frequently Bought Together". Kategorijų porų sistema (auto kompanionai) + rankinis override + co-purchase architektūra. Nuolaida pagal kompaniono kategoriją (margin-safe). v1.6.3: admin langas perkeltas is WooCommerce i 'Petshop prekes' (ps-katalogas) meniu kaip 'Perkame kartu' (nelendam i WC). v1.6.2: vietoj naujo tabo - modalas su nuotrauka/kaina/aprasymu (AJAX petshop_fbt_info; X/fonas/ESC uzdaro; veikia widget'e ir krepselio bloke). v1.6.1: prekes psl. widget UX (Raimis, pirkejo akimis): pavadinimas per visa ploti (3 eil.), kaina po juo, pavadinimas+nuotrauka = nuorodos i preke (naujas tabas), pazymejimas - paspaudus kortele. v1.6.0: E2 admin perziura (ka rodys preke/krepselis, su atmetimo priezastimis) + E3 co-purchase naktinis cron is ps_fakt_eilutes. v1.5.2: gap logika pasalinta (Raimis: 2 nesusije dalykai - pasiulymai VISADA su nuolaida; nemokamo pristatymo indikatorius yra temos reikalas). v1.5.1: pct rodymo fix (10% rodydavo 1%). v1.5.0: krepšelio blokas + gap režimas + AV Source sluoksnis + jautrumo (baltymų) filtras.
 * Version: 1.7.3
 * Author: petshop.lt
 * Requires Plugins: woocommerce
 * Text Domain: petshop-fbt
 *
 * v1.7.3: juostoje zaislo (vietoj skanesto) ne daugiau kaip 2 vnt.
 * v1.7.2 (2026-09-28, S1728, R 01:09): nemokamo pristatymo juostoje krepselyje (temos petshop_free_shipping_progress,
 *   apgaubta, logika nekeista) — jei truksta <= €10 ir krepselyje yra maistas: vienas skanestas is maisto pasiulymu
 *   (tas pats sandelis/taisykles), N vnt. uzpildo truksta suma su maziausiu pertekliumi (N <= 6), "+ Pridėti" (be nuolaidos),
 *   zyme _ps_fbt=juosta.
 *
 * v1.7.1 (2026-09-28, S1728, V2 — R maketas 09-27): blokas iskart po "I krepseli" (virs skaiciuokles; petshop-prekes-tvarka
 *   isjungiama opcija ps_prekes_tvarka_isjungta=1), pagrindine preke eilute nerodoma, prie kiekvieno pasiulymo kiekis
 *   (−/+, 44 px), "Kartu: X €" su formos kiekiu, mygtukas "Pridėti abu / kartu į krepšelį" (antrinis, kontūrinis).
 *   Pagrindine jau krepselyje -> "Pasirinkta" / "Pridėti į krepšelį" (dedami tik pasiulymai).
 *
 * v1.7.0 (2026-09-28, S1728, MARKETINGAS 2.3 — R taisykles 09-27):
 *   MAISTO REZIMAS (preke is maistas-sunims / maistas-katems medzio, DP pakas — per bazine):
 *   1. Sandelis = is kur maistas realiai isvaziuoja: Petshop_AV_Source::parinkti(…, ne misrus)
 *      (dropship pirma). ISIMTIS: Exclusion — AV turi >= kiekis -> AV (tada AV skanestas
 *      padaro uzsakyma misriu ir parinkti() visa siunta veza is AV). Nezinomas -> nieko.
 *   2. Siulom TIK R sarasus (opcija ps_fbt_skanestai: av_dog/av_cat/vf_dog/vf_cat) su
 *      likuciu tame paciame sandelyje; kitiems sandeliams (ZB/Quattro/Prins/Ambrosia) -> zaislas.
 *   3. Vet dieta -> zaislas <= €6; katems hipoalerginis -> zaislas; sunu hipo/mono -> tik
 *      vieno baltymo, tas pats baltymas; mazi (sausas <= 3 kg, mini/small/mazu veisliu,
 *      konservai <= 200 g) -> tik "mazi", minksti pirmiau; jautrus/light/steril. -> be riebiu;
 *      suniukai -> tik "suniuk"; kaciukai -> kaciuku skanestai, suaugusiems kaciuku nerodom.
 *   4. Pirmenybe: tas pats baltymas -> perkamiausi; max 2, skirtingos prekes (ne ruda+balta).
 *   KITA: rankinis sarasas filtruojamas sandeliu (P3/K4); nezinomas sandelis -> nieko (P5);
 *   krepselio blokas BE nuolaidos (K2); "Prideti pasirinktas" nededa pagrindines antra karta,
 *   jei ji jau krepselyje (P16); uzsakymo eiluteje zyme _ps_fbt = preke|krepselis|uzrasas (P17).
 *
 * v1.5.0 (2026-08-28): E1 — krepšelio pasiūlymai pagal sandėlį + jautrumas.
 *
 *   1. AV SOURCE SLUOKSNIS: source_of() naudoja Petshop_AV_Source::resolve()
 *      (jei įkrautas), kuris AV+tiekėjas prekes (Josera tipo) teisingai grąžina
 *      kaip 'av', kai AV likučio užtenka. Fallback — senas
 *      Petshop_Fulfillment_Source. Uždaryta spraga: iki šiol Josera prekė
 *      filtre buvo 'vf', nors realiai siunčiama iš AV.
 *
 *   2. JAUTRUMO FILTRAS (S230 principas — tik deklaruoti faktai):
 *      Jei pagrindinė prekė / bet kuri krepšelio maisto prekė yra hipoalerginė
 *      (pa_speciali_mityba: hipoalerginis) ARBA monoproteinė
 *      (pa_monoprotein: taip) → valgomi kompanionai (kategorijos, prasidedančios
 *      'skanest' arba 'vitaminai-ir-papild') tinka TIK jei jų deklaruoti
 *      pa_baltymu_saltinis terminai yra POAIBIS krepšelio/pagrindinės maisto
 *      baltymų aibės. Be deklaruoto baltymo — praleidžiam (geriau nieko, nei
 *      spėlioti). Žaislai / higiena — visada saugu, filtras netaikomas.
 *      Filtras taikomas ir RANKINIAM override krepšelio bloke (kontekstas —
 *      visas krepšelis, kurio savininkas negalėjo numatyti).
 *
 *   3. KREPŠELIO BLOKAS (woocommerce_after_cart_table):
 *      Kandidatai iš visų krepšelio prekių: rankinis override → co-purchase →
 *      kategorijų poros. HARD filtrai: nėra krepšelyje → source ∈ krepšelio
 *      sources (rankiniam netaikomas) → jautrumas → stock/purchasable.
 *      Jokio fallback: nelieka kandidatų — blokas nerodomas.
 *
 *   4. CO-PURCHASE ARCHITEKTŪRA (E3 paruošimas): copurchase_ids() skaito
 *      option 'ps_fbt_copirkimai' (pid => [cid,...]). Dabar tuščia; naktinis
 *      cron iš ps_fakt_eilutes ją užpildys po launcho. Kandidatai eina per
 *      tuos pačius hard filtrus.
 *
 * v1.4.3 (2026-06-11): KRITINIS FIX — is_valid_companion() vietoj shuffle
 *   priklausomo get_companions() AJAX patikroje.
 * v1.4.2 (2026-06-08): Fulfillment source ribojimas auto kompanionams (S74).
 *   Ambrosia/Prins auto FBT išjungtas. Rankinis override nefiltruojamas
 *   pagal source. JOKIO FALLBACK į kitą sandėlį.
 * v1.4.1: random kompanionai + max 3 vnt. nuolaidos riba.
 * v1.4.0: globalus "Akcija: −X%" label krepšelyje.
 */

if ( ! defined( 'ABSPATH' ) ) exit;

class Petshop_FBT {

    const META_IDS    = '_petshop_fbt_ids';
    const CART_FLAG   = 'petshop_fbt';
    const CART_BASE   = 'petshop_fbt_base';
    const CART_MAIN   = 'petshop_fbt_main';
    const OPT_COPURCH = 'ps_fbt_copirkimai'; // pid => [cid,...] (E3 cron pildo kasnakt)
    const CRON_HOOK   = 'petshop_fbt_copurchase_rebuild'; // v1.6.0
    const COPURCH_DIENOS = 180; // laikotarpis (suderinta su web ivykiu 180 d. saugojimu)
    const COPURCH_MIN    = 3;   // min bendru uzsakymu porai
    const COPURCH_TOP    = 6;   // max kompanionu vienai prekei
    const EDIBLE_RE   = '/^(skanest|vitaminai-ir-papild)/'; // valgomu kompanionu kategoriju slug pradzia
    const OPT_SKAN    = 'ps_fbt_skanestai'; // v1.7.0: R sarasai {av_dog,av_cat,vf_dog,vf_cat}
    const CART_VIETA  = 'petshop_fbt_vieta'; // v1.7.0: preke|krepselis|uzrasas
    const META_VIETA  = '_ps_fbt';           // v1.7.0: uzsakymo eilutes zyme
    const FOOD_MAX    = 2;                   // v1.7.0: maistui max 2 pasiulymai
    const ZAISLO_LUBOS = 6.0;                // v1.7.0: zaislas vietoj skanesto <= €6
    const VET_SM      = [ 'inkstams', 'slapimo-takams', 'kepenims', 'diabetui', 'sirdziai' ];
    const JUOSTA_MAX_EUR = 10.0;           // v1.7.2: siulom, kai iki nemokamo pristatymo truksta <= €10
    const JUOSTA_MAX_VNT = 6;              // v1.7.2: ne daugiau kaip 6 vnt. vieno skanesto
    private $memo = [];

    public function __construct() {
        add_action( 'add_meta_boxes', [ $this, 'add_meta_box' ] );
        add_action( 'save_post_product', [ $this, 'save_meta_box' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'admin_assets' ] );
        add_action( 'admin_menu', [ $this, 'settings_page' ], 20 );

        add_action( 'woocommerce_after_add_to_cart_form', [ $this, 'render_widget' ], 20 );
        add_action( 'woocommerce_after_cart_table', [ $this, 'render_cart_block' ], 15 ); // v1.5.0
        add_action( 'wp_enqueue_scripts', [ $this, 'frontend_assets' ] );

        add_action( 'wp_ajax_petshop_fbt_add', [ $this, 'ajax_add' ] );
        add_action( 'wp_ajax_nopriv_petshop_fbt_add', [ $this, 'ajax_add' ] );
        add_action( 'wp_ajax_petshop_fbt_cart_add', [ $this, 'ajax_cart_add' ] );        // v1.5.0
        add_action( 'wp_ajax_nopriv_petshop_fbt_cart_add', [ $this, 'ajax_cart_add' ] ); // v1.5.0
        add_action( 'wp_ajax_petshop_fbt_info', [ $this, 'ajax_info' ] );                // v1.6.2
        add_action( 'wp_ajax_nopriv_petshop_fbt_info', [ $this, 'ajax_info' ] );         // v1.6.2

        // v1.6.0 (E3): co-purchase naktinis perskaiciavimas
        add_action( self::CRON_HOOK, [ $this, 'copurchase_rebuild' ] );
        add_action( 'init', [ $this, 'copurchase_maybe_schedule' ] );

        add_action( 'woocommerce_before_calculate_totals', [ $this, 'apply_discount' ], 20 );
        add_filter( 'woocommerce_get_item_data', [ $this, 'cart_item_label' ], 10, 2 );
        add_filter( 'woocommerce_get_cart_item_from_session', [ $this, 'restore_cart_item' ], 10, 2 );
        add_action( 'woocommerce_checkout_create_order_line_item', [ $this, 'order_line_mark' ], 15, 4 ); // v1.7.0
        add_action( 'woocommerce_before_cart_totals', [ $this, 'juosta_perimti' ], 1 ); // v1.7.2 (veikia ir wc-ajax perskaiciavime)
    }

    /* ===================== HELPERIAI ===================== */
    private function opt( $key, $default = '' ) {
        $o = get_option( 'petshop_fbt_settings', [] );
        return isset( $o[ $key ] ) && $o[ $key ] !== '' ? $o[ $key ] : $default;
    }
    private function cat_rules() { $r = get_option( 'petshop_fbt_cat_rules', [] ); return is_array($r)?$r:[]; }
    private function pairs()     { $p = get_option( 'petshop_fbt_pairs', [] );     return is_array($p)?$p:[]; }
    private function product_cat_slugs( $pid ) {
        $terms = get_the_terms( $pid, 'product_cat' );
        if ( ! $terms || is_wp_error($terms) ) return [];
        return wp_list_pluck( $terms, 'slug' );
    }

    /**
     * v1.5.0: vieninga sandelio tiesa. AV Source sluoksnis (S473) pirmenybe —
     * jis AV+tiekejas prekes su pakankamu AV likuciu grazina 'av' (reali
     * logistika), o ne dropship tiekeja. Fallback — senas resolveris.
     * @return string|null av|zb|vf|quattro|ambrosia|belcor_tofu|prins|legacy|null
     */
    private function source_of( $pid, $qty = 1 ) {
        $pid = (int) $pid; $qty = max( 1, (int) $qty );
        if ( class_exists( 'Petshop_AV_Source' ) ) {
            $r = Petshop_AV_Source::resolve( $pid, $qty );
            return isset( $r['source'] ) ? $r['source'] : null;
        }
        if ( class_exists( 'Petshop_Fulfillment_Source' ) ) {
            $r = Petshop_Fulfillment_Source::resolve( $pid );
            return isset( $r['source'] ) ? $r['source'] : null;
        }
        return null;
    }

    /* ===================== JAUTRUMAS (v1.5.0) ===================== */

    /** Deklaruoti baltymu saltiniai (pa_baltymu_saltinis slugs). */
    private function protein_terms( $pid ) {
        $t = get_the_terms( (int) $pid, 'pa_baltymu_saltinis' );
        if ( ! $t || is_wp_error( $t ) ) return [];
        return wp_list_pluck( $t, 'slug' );
    }
    /** Ar preke deklaruota kaip hipoalergine ARBA monoproteine. */
    private function is_strict_food( $pid ) {
        $pid = (int) $pid;
        return has_term( 'hipoalerginis', 'pa_speciali_mityba', $pid )
            || has_term( 'taip', 'pa_monoprotein', $pid );
    }
    /** Ar kandidatas valgomas kompanionas (skanestai / vitaminai-papildai). */
    private function is_edible( $pid ) {
        foreach ( $this->product_cat_slugs( $pid ) as $s ) {
            if ( preg_match( self::EDIBLE_RE, $s ) ) return true;
        }
        return false;
    }
    /** Kontekstas pagal viena pagrindine preke (prekes puslapio widget). */
    private function ctx_for_main( $main_id ) {
        return [ 'strict' => $this->is_strict_food( $main_id ), 'proteins' => $this->protein_terms( $main_id ) ];
    }
    /** Kontekstas pagal VISA krepseli: strict jei bent viena maisto preke strict; baltymu aibe — sajunga. */
    private function ctx_for_cart( $cart = null ) {
        $cart = $cart ?: ( function_exists('WC') && WC()->cart ? WC()->cart : null );
        $ctx = [ 'strict' => false, 'proteins' => [] ];
        if ( ! $cart ) return $ctx;
        foreach ( $cart->get_cart() as $i ) {
            $pid = (int) ( $i['product_id'] ?? 0 );
            if ( ! $pid ) continue;
            $pr = $this->protein_terms( $pid );
            $st = $this->is_strict_food( $pid );
            if ( $st ) $ctx['strict'] = true;
            if ( $pr ) $ctx['proteins'] = array_merge( $ctx['proteins'], $pr );
        }
        $ctx['proteins'] = array_values( array_unique( $ctx['proteins'] ) );
        return $ctx;
    }
    /**
     * HARD jautrumo patikra. strict kontekste valgomas kandidatas tinka TIK
     * jei jo deklaruoti baltymai yra POAIBIS konteksto baltymu. Be deklaruoto
     * baltymo — praleidziam (S230: tikrinam tik ka gamintojas deklaravo;
     * nezinom = nesiulom). Ne-valgomi (zaislai/higiena) — visada OK.
     */
    private function sensitivity_ok( $ctx, $cid ) {
        if ( empty( $ctx['strict'] ) ) return true;
        if ( ! $this->is_edible( $cid ) ) return true;
        $pr = $this->protein_terms( $cid );
        if ( empty( $pr ) ) return false;
        return ! array_diff( $pr, (array) $ctx['proteins'] );
    }

    /* ===================== MAISTO REZIMAS (v1.7.0) ===================== */

    /** R sarasai (opcija). Struktura: {av_dog:[{id,prot,mono,mazi,riebus,kietas,suniuk,ist}],av_cat:[{id,kitten,rodyti,ist}],vf_dog:[…],vf_cat:[…]} */
    private function skan_sarasai() {
        if ( isset( $this->memo['sar'] ) ) return $this->memo['sar'];
        $o = get_option( self::OPT_SKAN, [] );
        if ( is_string( $o ) ) $o = json_decode( $o, true );
        return $this->memo['sar'] = is_array( $o ) ? $o : [];
    }
    /** Maisto sandeliui ir rusiai — sarasas arba null (sandelis be skanestu). */
    private function list_for( $wh, $sp ) {
        $L = $this->skan_sarasai();
        $k = null;
        if ( $wh === 'av' ) $k = ( $sp === 'S' ) ? 'av_dog' : 'av_cat';
        elseif ( $wh === 'vf' ) $k = ( $sp === 'S' ) ? 'vf_dog' : 'vf_cat';
        if ( $k === null || ! isset( $L[ $k ] ) || ! is_array( $L[ $k ] ) ) return null;
        return $L[ $k ];
    }
    /** R saraso irasas prekei (bet kuriame sarase tai rusiai) arba null. */
    private function list_entry( $cid, $sp ) {
        foreach ( ( $sp === 'S' ? [ 'av_dog', 'vf_dog' ] : [ 'av_cat', 'vf_cat' ] ) as $k ) {
            $L = $this->skan_sarasai();
            foreach ( (array) ( $L[ $k ] ?? [] ) as $t ) if ( (int) ( $t['id'] ?? 0 ) === (int) $cid ) return $t;
        }
        return null;
    }
    /** Aktyvus saltiniai su likuciu: ['av'=>n,'vf'=>n,…]; tiekejo nezinomas likutis = laikom, kad turi. */
    private function stk( $id ) {
        $id = (int) $id; $k = 'stk' . $id;
        if ( isset( $this->memo[ $k ] ) ) return $this->memo[ $k ];
        global $wpdb; $o = [];
        $rows = $wpdb->get_results( $wpdb->prepare( "SELECT source, stock_qty, is_active FROM {$wpdb->prefix}ps_sources WHERE product_id=%d", $id ), ARRAY_A );
        foreach ( (array) $rows as $x ) {
            if ( ! (int) $x['is_active'] ) continue;
            $q = $x['stock_qty'];
            if ( $x['source'] === 'av' ) {
                if ( $q === null || $q === '' ) { $p = wc_get_product( $id ); $q = $p ? (int) $p->get_stock_quantity() : 0; }
                $o['av'] = (int) $q;
            } else {
                $o[ $x['source'] ] = ( $q === null || $q === '' ) ? PHP_INT_MAX : (int) $q;
            }
        }
        return $this->memo[ $k ] = $o;
    }
    private function has_in( $id, $wh ) {
        $o = $this->stk( $id );
        return isset( $o[ $wh ] ) && $o[ $wh ] > 0;
    }
    /** DP pakas -> [bazine, kiekis pake]; kitaip [pid, 1]. */
    private function dp_base( $pid ) {
        $b = (int) get_post_meta( (int) $pid, '_dp_base_product_id', true );
        if ( $b <= 0 ) return [ (int) $pid, 1 ];
        return [ $b, max( 1, (int) get_post_meta( (int) $pid, '_dp_pack_qty', true ) ) ];
    }
    /** Kategoriju slug'ai kartu su proteviais. */
    private function cat_tree_slugs( $pid ) {
        $k = 'ct' . (int) $pid;
        if ( isset( $this->memo[ $k ] ) ) return $this->memo[ $k ];
        $o = [];
        $terms = get_the_terms( (int) $pid, 'product_cat' );
        if ( $terms && ! is_wp_error( $terms ) ) {
            foreach ( $terms as $t ) {
                $o[] = $t->slug;
                foreach ( get_ancestors( $t->term_id, 'product_cat' ) as $a ) { $at = get_term( $a, 'product_cat' ); if ( $at && ! is_wp_error( $at ) ) $o[] = $at->slug; }
            }
        }
        return $this->memo[ $k ] = array_values( array_unique( $o ) );
    }
    private function pa_slugs( $pid, $n ) {
        $t = wp_get_post_terms( (int) $pid, 'pa_' . $n, [ 'fields' => 'slugs' ] );
        return is_wp_error( $t ) ? [] : (array) $t;
    }
    private function is_exclusion( $pid ) {
        $b = wp_get_post_terms( (int) $pid, 'product_brand', [ 'fields' => 'names' ] );
        $b = is_wp_error( $b ) ? '' : implode( ' ', (array) $b );
        return (bool) preg_match( '/exclusion/i', $b . ' ' . get_the_title( (int) $pid ) );
    }
    /** 'S' | 'K' | null — ar preke yra maistas (sunims/katems, su konservais). */
    public function food_species( $pid ) {
        $f = $this->food_flags( $pid );
        return $f['sp'];
    }
    /** Maisto zymos (is atributu ir pavadinimo; DP pakas — per bazine). */
    private function food_flags( $pid ) {
        list( $b ) = $this->dp_base( $pid );
        $k = 'ff' . $b;
        if ( isset( $this->memo[ $k ] ) ) return $this->memo[ $k ];
        $cs = $this->cat_tree_slugs( $b );
        $sp = in_array( 'maistas-katems', $cs, true ) ? 'K' : ( in_array( 'maistas-sunims', $cs, true ) ? 'S' : null );
        $f = [ 'sp' => $sp, 'base' => $b ];
        if ( $sp === null ) return $this->memo[ $k ] = $f;
        $n    = html_entity_decode( get_the_title( $b ) );
        $kons = (bool) preg_grep( '/konserv/', $cs );
        $sm   = $this->pa_slugs( $b, 'speciali_mityba' );
        $mono = in_array( 'taip', $this->pa_slugs( $b, 'monoprotein' ), true );
        $am   = $this->pa_slugs( $b, 'amzius' );
        $kg = null;
        if ( preg_match( '/(\d+(?:[.,]\d+)?)\s*(kg|g)\b/iu', $n, $m ) ) { $kg = (float) str_replace( ',', '.', $m[1] ); if ( strtolower( $m[2] ) === 'g' ) $kg /= 1000; }
        $f['prot']  = $this->pa_slugs( $b, 'baltymu_saltinis' );
        $f['kons']  = $kons;
        $f['kg']    = $kg;
        $f['vet']   = (bool) array_intersect( $sm, self::VET_SM ) || (bool) preg_match( '/veterin|\bvet\b|\bVD\b|renal|urinary|gastro|hepatic|diabetic|intestinal|convalescence/iu', $n );
        $f['hypo']  = in_array( 'hipoalerginis', $sm, true ) || $mono || (bool) preg_match( '/hypoaller|hipoaler|anallerg/iu', $n );
        $f['sens']  = (bool) array_intersect( $sm, [ 'jautriam-virskinimui', 'svorio-kontrolei', 'sterilizuotiems' ] ) || (bool) preg_match( '/light|sterili|sensitiv|jautr|weight|\bfit\b/iu', $n );
        $f['young'] = in_array( 'jauniems', $am, true ) || (bool) preg_match( '/puppy|junior|šuniuk|kitten|kačiuk|starter/iu', $n );
        $f['small'] = $sp === 'S' && ( (bool) preg_match( '/\bmini\b|small|mažų veisl|\btoy\b|x-?small/iu', $n ) || ( ! $kons && $kg !== null && $kg <= 3 ) || ( $kons && $kg !== null && $kg <= 0.2 ) );
        $z = [];
        if ( $f['vet'] ) $z[] = 'vet dieta'; if ( $f['hypo'] ) $z[] = 'hipoaler./mono'; if ( $f['sens'] ) $z[] = 'jautrus/light/steril.';
        if ( $f['young'] ) $z[] = 'jauniems'; if ( $f['small'] ) $z[] = 'mažiems';
        $f['zymos'] = $z;
        return $this->memo[ $k ] = $f;
    }
    /**
     * Sandelis, is kurio maistas realiai isvaziuos (S1676 kelias: dropship pirma, ne misrus).
     * Isimtis (R 09-27): Exclusion — AV turi >= kiekis -> 'av'. Nezinomas -> null.
     */
    public function food_wh( $pid, $qty = 1 ) {
        list( $b, $n ) = $this->dp_base( $pid );
        $q = max( 1, (int) $qty ) * $n;
        $k = 'wh' . $b . '_' . $q;
        if ( array_key_exists( $k, $this->memo ) ) return $this->memo[ $k ];
        $wh = null;
        if ( class_exists( 'Petshop_AV_Source' ) ) {
            $r = Petshop_AV_Source::resolve( $b, $q );
            if ( ! empty( $r['av_uztenka'] ) && $this->is_exclusion( $b ) ) {
                $wh = 'av';
            } else {
                $x = method_exists( 'Petshop_AV_Source', 'parinkti' ) ? Petshop_AV_Source::parinkti( $b, $q, false ) : $r;
                $wh = ( isset( $x['source'] ) && $x['source'] !== '' ) ? (string) $x['source'] : null;
                if ( $wh === 'legacy' ) $wh = 'av';
            }
        }
        return $this->memo[ $k ] = $wh;
    }
    /** Pigus zaislas (<= €6) is to paties sandelio, perkamiausi pirmiau (sarasas kesuojamas 6 val.). */
    private function toys( $wh, $sp, $small, array $exclude = [] ) {
        $tk = 'ps_fbt_zaisl_' . sanitize_key( $wh ) . '_' . $sp;
        $pool = get_transient( $tk );
        if ( ! is_array( $pool ) ) {
            global $wpdb; $pool = [];
            $ids = get_posts( [ 'post_type' => 'product', 'post_status' => 'publish', 'numberposts' => -1, 'fields' => 'ids',
                'tax_query' => [ [ 'taxonomy' => 'product_cat', 'field' => 'slug', 'terms' => [ $sp === 'S' ? 'zaislai-sunims' : 'zaislai-katems' ], 'include_children' => true ] ] ] );
            $nuo = gmdate( 'Y-m-d', time() - 365 * DAY_IN_SECONDS );
            foreach ( $ids as $i ) {
                $p = wc_get_product( $i );
                if ( ! $p || ! $p->is_in_stock() ) continue;
                $pr = (float) $p->get_price();
                if ( $pr <= 0 || $pr > self::ZAISLO_LUBOS ) continue;
                if ( ! $this->has_in( $i, $wh ) ) continue;
                $pool[ (int) $i ] = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COALESCE(SUM(kiekis),0) FROM {$wpdb->prefix}ps_ist_fakt_eilutes WHERE preke_id=%d AND apmoketa_at>=%s", $i, $nuo ) );
            }
            arsort( $pool );
            set_transient( $tk, $pool, 6 * HOUR_IN_SECONDS );
        }
        $o = [];
        foreach ( $pool as $i => $q ) {
            $i = (int) $i;
            if ( in_array( $i, $exclude, true ) ) continue;
            $p = wc_get_product( $i );
            if ( ! $p || $p->get_status() !== 'publish' || ! $p->is_in_stock() || ! $p->is_purchasable() ) continue;
            if ( (float) $p->get_price() > self::ZAISLO_LUBOS || ! $this->has_in( $i, $wh ) ) continue;
            if ( $small && ! preg_match( '/\b(S|XS|mini|mažas|maža|small)\b|,\s*S\b|\bS dyd/iu', html_entity_decode( get_the_title( $i ) ) ) ) continue;
            $o[] = $i;
            if ( count( $o ) >= self::FOOD_MAX ) break;
        }
        return $o;
    }
    /**
     * Ka siulom prie maisto. @return ['ids'=>[], 'wh'=>?string, 'zaislas'=>bool, 'kodel'=>string, 'zymos'=>[]]
     */
    public function food_offer( $pid, $qty = 1, array $exclude = [] ) {
        $f   = $this->food_flags( $pid );
        $res = [ 'ids' => [], 'wh' => null, 'zaislas' => false, 'kodel' => '', 'zymos' => $f['zymos'] ?? [] ];
        if ( empty( $f['sp'] ) ) { $res['kodel'] = 'ne maistas'; return $res; }
        $wh = $this->food_wh( $pid, $qty ); $res['wh'] = $wh;
        if ( $wh === null ) { $res['kodel'] = 'sandėlis nežinomas — nerodom'; return $res; }
        $exclude = array_map( 'intval', $exclude ); $exclude[] = (int) $pid; $exclude[] = (int) $f['base'];
        $list = $this->list_for( $wh, $f['sp'] );
        $out = [];
        if ( $list === null )                  $res['kodel'] = 'sandėlis ' . $wh . ' — skanėstų sąrašo nėra';
        elseif ( $f['vet'] )                   $res['kodel'] = 'vet dieta';
        elseif ( $f['sp'] === 'K' && $f['hypo'] ) $res['kodel'] = 'katėms hipoalerginis';
        else {
            $c = [];
            foreach ( $list as $t ) {
                $tid = (int) ( $t['id'] ?? 0 );
                if ( ! $tid || in_array( $tid, $exclude, true ) ) continue;
                $tp = wc_get_product( $tid );
                if ( ! $tp || $tp->get_status() !== 'publish' || ! $tp->is_in_stock() || ! $tp->is_purchasable() ) continue;
                if ( ! $this->has_in( $tid, $wh ) ) continue;
                $tt = html_entity_decode( get_the_title( $tid ) );
                if ( $f['sp'] === 'S' ) {
                    if ( $f['hypo'] && ! ( ! empty( $t['mono'] ) && in_array( (string) ( $t['prot'] ?? '' ), $f['prot'], true ) ) ) continue;
                    if ( $f['small'] && empty( $t['mazi'] ) ) continue;
                    if ( $f['sens'] && ! empty( $t['riebus'] ) ) continue;
                    if ( $f['young'] && empty( $t['suniuk'] ) ) continue;
                    if ( ! $f['small'] && preg_match( '/mažų veisl/iu', $tt ) ) continue;
                } else {
                    if ( empty( $t['rodyti'] ) ) continue;
                    if ( $f['young'] && empty( $t['kitten'] ) ) continue;
                    if ( ! $f['young'] && preg_match( '/kitten|kačiuk/iu', $tt ) ) continue;
                }
                $score = (int) ( $t['ist'] ?? 0 );
                if ( $f['sp'] === 'S' && ! empty( $t['prot'] ) && in_array( $t['prot'], $f['prot'], true ) ) $score += 1000;
                if ( $f['sp'] === 'S' && $f['small'] && empty( $t['kietas'] ) ) $score += 500;
                $c[ $tid ] = $score;
            }
            arsort( $c );
            $lines = [];
            foreach ( array_keys( $c ) as $tid ) {
                $ln = mb_strtolower( implode( ' ', array_slice( preg_split( '/[\s,]+/u', trim( preg_replace( '/\b(ruda|rudos|balta|baltos|natūralios|\(natūralios\))\s*/iu', '', html_entity_decode( get_the_title( $tid ) ) ) ) ), 0, 2 ) ) );
                if ( isset( $lines[ $ln ] ) ) continue;
                $lines[ $ln ] = 1; $out[] = (int) $tid;
                if ( count( $out ) >= self::FOOD_MAX ) break;
            }
            if ( ! $out ) $res['kodel'] = 'nė vienas skanėstas netinka pagal taisykles';
        }
        if ( ! $out ) {
            $out = $this->toys( $wh, $f['sp'], ! empty( $f['small'] ), $exclude );
            if ( $out ) $res['zaislas'] = true;
            else $res['kodel'] .= ' — tinkamo žaislo ≤ €6 nėra, nerodom';
        }
        $res['ids'] = $out;
        return $res;
    }
    /** Ar skanestas tinka KITAM krepselio maistui (tik griezti atvejai: vet / hipo / mono). */
    private function treat_ok_for_food( $cid, $food_pid ) {
        $f = $this->food_flags( $food_pid );
        if ( empty( $f['sp'] ) || ! $this->is_edible( $cid ) ) return true;
        if ( ! $f['vet'] && ! $f['hypo'] ) return true;
        $cs = $this->cat_tree_slugs( $cid );
        $csp = in_array( 'katems', $cs, true ) ? 'K' : ( in_array( 'sunims', $cs, true ) ? 'S' : null );
        if ( $csp !== null && $csp !== $f['sp'] ) return true; // kitam gyvunui
        if ( $f['vet'] || $f['sp'] === 'K' ) return false;
        $t = $this->list_entry( $cid, 'S' );
        return $t && ! empty( $t['mono'] ) && in_array( (string) ( $t['prot'] ?? '' ), $f['prot'], true );
    }

    /* ===================== ADMIN ===================== */

    public function settings_page() {
        // v1.6.3: po "Petshop prekės" (ps-katalogas), ne po WooCommerce.
        // Prioritetas 20 — kad top-level meniu (petshop-katalogas) jau butu registruotas.
        add_submenu_page( 'ps-katalogas', 'Perkame kartu', 'Perkame kartu',
            'manage_woocommerce', 'petshop-fbt', [ $this, 'settings_html' ] );
    }

    public function settings_html() {
        if ( isset( $_POST['petshop_fbt_save'] ) && check_admin_referer( 'petshop_fbt_settings' ) ) {
            update_option( 'petshop_fbt_settings', [
                'enabled'       => isset($_POST['enabled']) ? '1':'0',
                'discount'      => isset($_POST['discount']) ? max(0,min(90,(float)$_POST['discount'])) : 0,
                'maxc'          => isset($_POST['maxc']) ? max(1,min(6,(int)$_POST['maxc'])) : 3,
                'heading'       => sanitize_text_field($_POST['heading'] ?? ''),
                'note'          => sanitize_text_field($_POST['note'] ?? ''),
                'precheck'      => isset($_POST['precheck']) ? '1':'0',
                // v1.5.0 — krepselio blokas + gap
                'cart_enabled'  => isset($_POST['cart_enabled']) ? '1':'0',
                'cart_heading'  => sanitize_text_field($_POST['cart_heading'] ?? ''),
                'cart_maxc'     => isset($_POST['cart_maxc']) ? max(1,min(6,(int)$_POST['cart_maxc'])) : 4,
            ] );

            // Kategorijų nuolaidos
            $rules = [];
            if ( ! empty($_POST['rule_slug']) && is_array($_POST['rule_slug']) ) {
                foreach ( $_POST['rule_slug'] as $i => $slug ) {
                    $slug = sanitize_title($slug);
                    if ( ! $slug || isset($_POST['rule_remove'][$i]) ) continue;
                    $rules[$slug] = max(0,min(90,(float)($_POST['rule_pct'][$i] ?? 0)));
                }
            }
            if ( ! empty($_POST['new_slug']) ) {
                $ns = sanitize_title($_POST['new_slug']);
                if ( $ns ) $rules[$ns] = max(0,min(90,(float)($_POST['new_pct'] ?? 0)));
            }
            update_option( 'petshop_fbt_cat_rules', $rules );

            // Kategorijų poros
            $pairs = [];
            if ( ! empty($_POST['pair_main']) && is_array($_POST['pair_main']) ) {
                foreach ( $_POST['pair_main'] as $i => $main ) {
                    $main = sanitize_title($main);
                    if ( ! $main || isset($_POST['pair_remove'][$i]) ) continue;
                    $comps = array_filter(array_map('sanitize_title', preg_split('/[\s,]+/', $_POST['pair_comps'][$i] ?? '')));
                    if ( $comps ) $pairs[$main] = array_values(array_unique($comps));
                }
            }
            if ( ! empty($_POST['new_pair_main']) && ! empty($_POST['new_pair_comps']) ) {
                $nm = sanitize_title($_POST['new_pair_main']);
                $nc = array_filter(array_map('sanitize_title',(array)$_POST['new_pair_comps']));
                if ( $nm && $nc ) {
                    $existing = isset($pairs[$nm]) ? $pairs[$nm] : [];
                    $pairs[$nm] = array_values(array_unique(array_merge($existing,$nc)));
                }
            }
            update_option( 'petshop_fbt_pairs', $pairs );

            echo '<div class="notice notice-success"><p>Išsaugota.</p></div>';
        }

        $enabled       = $this->opt('enabled','1');
        $discount      = $this->opt('discount','0');
        $maxc          = $this->opt('maxc','3');
        $heading       = $this->opt('heading','Dažnai perkama kartu');
        $note          = $this->opt('note','Perkant kartu – papildomoms prekėms taikoma nuolaida!');
        $precheck      = $this->opt('precheck','1');
        $cart_enabled  = $this->opt('cart_enabled','1');
        $cart_heading  = $this->opt('cart_heading','Papildykite krepšelį');
        $cart_maxc     = $this->opt('cart_maxc','4');
        $rules    = $this->cat_rules();
        $pairs    = $this->pairs();
        $cats     = get_terms(['taxonomy'=>'product_cat','hide_empty'=>false,'orderby'=>'name']);
        $cat_opts = function( $selected = '' ) use ( $cats ) {
            $h = '';
            foreach ( $cats as $c ) $h .= '<option value="'.esc_attr($c->slug).'" '.selected($selected,$c->slug,false).'>'.esc_html($c->name).' ('.esc_html($c->slug).')</option>';
            return $h;
        };
        ?>
        <div class="wrap">
            <h1>Dažnai perkama kartu</h1>
            <form method="post">
                <?php wp_nonce_field('petshop_fbt_settings'); ?>
                <input type="hidden" name="petshop_fbt_save" value="1">

                <table class="form-table">
                    <tr><th>Įjungta (prekės puslapis)</th><td><label><input type="checkbox" name="enabled" value="1" <?php checked($enabled,'1'); ?>> Rodyti bloką prekės puslapyje</label></td></tr>
                    <tr><th>Antraštė</th><td><input type="text" class="regular-text" name="heading" value="<?php echo esc_attr($heading); ?>"></td></tr>
                    <tr><th>Pastaba</th><td><input type="text" class="regular-text" name="note" value="<?php echo esc_attr($note); ?>"></td></tr>
                    <tr><th>Kiek kompanionų rodyti</th><td><input type="number" min="1" max="6" name="maxc" value="<?php echo esc_attr($maxc); ?>"></td></tr>
                    <tr><th>Pažymėti iš anksto</th><td><label><input type="checkbox" name="precheck" value="1" <?php checked($precheck,'1'); ?>> Kompanionai pažymėti automatiškai</label></td></tr>
                    <tr><th>Default nuolaida (%)</th><td><input type="number" min="0" max="90" name="discount" value="<?php echo esc_attr($discount); ?>"> % <p class="description">Kai kompaniono kategorija nėra žemiau esančiame sąraše.</p></td></tr>
                </table>

                <hr>
                <h2>Krepšelio blokas (v1.5.0)</h2>
                <table class="form-table">
                    <tr><th>Įjungtas</th><td><label><input type="checkbox" name="cart_enabled" value="1" <?php checked($cart_enabled,'1'); ?>> Rodyti pasiūlymus krepšelio puslapyje</label></td></tr>
                    <tr><th>Antraštė</th><td><input type="text" class="regular-text" name="cart_heading" value="<?php echo esc_attr($cart_heading); ?>"></td></tr>
                    <tr><th>Kiek prekių rodyti</th><td><input type="number" min="1" max="6" name="cart_maxc" value="<?php echo esc_attr($cart_maxc); ?>"></td></tr>
                </table>

                <hr>
                <h2>1. Kategorijų poros (auto kompanionai)</h2>
                <p class="description">Kai prekė priklauso <b>pagrindinei</b> kategorijai — kompanionai siūlomi iš <b>kompanionų</b> kategorijų. Pvz.: <code>sausas-maistas-sunims</code> → <code>skanestai-sunims, zaislai-sunims</code>.</p>
                <table class="widefat" style="max-width:760px;margin:10px 0">
                    <thead><tr><th>Pagrindinė (slug)</th><th>Kompanionų kategorijos (slug, kableliais)</th><th style="width:80px">Šalinti</th></tr></thead>
                    <tbody>
                    <?php if ( empty($pairs) ) : ?>
                        <tr><td colspan="3"><em>Porų nėra.</em></td></tr>
                    <?php else : $i=0; foreach ( $pairs as $main=>$comps ) : ?>
                        <tr>
                            <td><input type="text" name="pair_main[<?php echo $i; ?>]" value="<?php echo esc_attr($main); ?>" class="regular-text"></td>
                            <td><input type="text" name="pair_comps[<?php echo $i; ?>]" value="<?php echo esc_attr(implode(', ',$comps)); ?>" class="large-text"></td>
                            <td><label><input type="checkbox" name="pair_remove[<?php echo $i; ?>]" value="1"> Šalinti</label></td>
                        </tr>
                    <?php $i++; endforeach; endif; ?>
                    </tbody>
                </table>
                <h4>Pridėti porą</h4>
                <p>
                    Pagrindinė: <select name="new_pair_main"><option value="">—</option><?php echo $cat_opts(); ?></select><br><br>
                    Kompanionų kategorijos (laikyk Ctrl/Cmd keliom):<br>
                    <select name="new_pair_comps[]" multiple size="6" style="min-width:360px"><?php echo $cat_opts(); ?></select>
                </p>

                <hr>
                <h2>2. Nuolaida pagal kompaniono kategoriją</h2>
                <p class="description">Kiekvienas kompanionas gauna savo kategorijos nuolaidą. Kelios kategorijos → taikoma <b>mažiausia</b>.</p>
                <table class="widefat" style="max-width:560px;margin:10px 0">
                    <thead><tr><th>Kategorija (slug)</th><th style="width:110px">Nuolaida %</th><th style="width:80px">Šalinti</th></tr></thead>
                    <tbody>
                    <?php if ( empty($rules) ) : ?>
                        <tr><td colspan="3"><em>Taisyklių nėra.</em></td></tr>
                    <?php else : $i=0; foreach ( $rules as $slug=>$pct ) : ?>
                        <tr>
                            <td><input type="text" name="rule_slug[<?php echo $i; ?>]" value="<?php echo esc_attr($slug); ?>" class="regular-text"></td>
                            <td><input type="number" min="0" max="90" name="rule_pct[<?php echo $i; ?>]" value="<?php echo esc_attr($pct); ?>"></td>
                            <td><label><input type="checkbox" name="rule_remove[<?php echo $i; ?>]" value="1"> Šalinti</label></td>
                        </tr>
                    <?php $i++; endforeach; endif; ?>
                    </tbody>
                </table>
                <h4>Pridėti nuolaidos taisyklę</h4>
                <p><select name="new_slug"><option value="">—</option><?php echo $cat_opts(); ?></select>
                   <input type="number" min="0" max="90" name="new_pct" placeholder="%" style="width:80px"></p>

                <?php submit_button('Išsaugoti'); ?>
            </form>

            <hr>
            <h2>Peržiūra — ką rodys sistema</h2>
            <p class="description">Įvesk prekės ID (vienas = prekės puslapio logika; keli kableliais = krepšelio simuliacija). Matysi pasiūlymus IR atmestus kandidatus su priežastimis.</p>
            <form method="post">
                <?php wp_nonce_field('petshop_fbt_preview','petshop_fbt_preview_nonce'); ?>
                <input type="text" id="fbt-preview-ids" name="fbt_preview_ids" class="regular-text" placeholder="pvz. 26391 arba 26391, 35027"
                       value="<?php echo isset($_POST['fbt_preview_ids'])?esc_attr(sanitize_text_field($_POST['fbt_preview_ids'])):''; ?>">
                <?php submit_button('Peržiūrėti','secondary','fbt_preview_go',false); ?>
            </form>
            <?php $this->preview_html(); ?>
        </div>
        <?php
    }

    /* ===================== PERZIURA (v1.6.0, E2) ===================== */
    private function preview_html() {
        if ( ! isset( $_POST['fbt_preview_go'] ) ) return;
        if ( ! isset( $_POST['petshop_fbt_preview_nonce'] ) || ! wp_verify_nonce( $_POST['petshop_fbt_preview_nonce'], 'petshop_fbt_preview' ) ) return;
        $ids = array_values( array_filter( array_map( 'absint', preg_split( '/[\s,]+/', (string) ( $_POST['fbt_preview_ids'] ?? '' ) ) ) ) );
        if ( empty( $ids ) ) { echo '<p><em>Nėra ID.</em></p>'; return; }

        echo '<h3>Įvestos prekės</h3><table class="widefat" style="max-width:1100px"><thead><tr><th>ID</th><th>Prekė</th><th>Sandėlis (bendras)</th><th>Hipo/Mono</th><th>Baltymai</th><th>Maistas: išvažiuoja iš</th><th>Maisto žymos</th><th>Pastaba</th></tr></thead><tbody>';
        foreach ( $ids as $pid ) {
            $p = wc_get_product( $pid );
            $fo = $this->food_species( $pid ) ? $this->food_offer( $pid, 1 ) : null;
            echo '<tr><td>' . (int) $pid . '</td><td>' . ( $p ? esc_html( $p->get_name() ) : '<em>nerasta</em>' ) . '</td>'
               . '<td>' . esc_html( (string) $this->source_of( $pid, 1 ) ) . '</td>'
               . '<td>' . ( $this->is_strict_food( $pid ) ? '<b>TAIP</b>' : 'ne' ) . '</td>'
               . '<td>' . esc_html( implode( ', ', $this->protein_terms( $pid ) ) ) . '</td>'
               . '<td>' . ( $fo ? '<b>' . esc_html( strtoupper( (string) $fo['wh'] ) ) . '</b>' : '—' ) . '</td>'
               . '<td>' . ( $fo ? esc_html( implode( '; ', $fo['zymos'] ) ) : '—' ) . '</td>'
               . '<td>' . ( $fo ? esc_html( trim( ( $fo['zaislas'] ? 'žaislas vietoj skanėsto. ' : '' ) . $fo['kodel'] ) ) : '' ) . '</td></tr>';
        }
        echo '</tbody></table>';

        $lines = array_map( function( $id ) { return [ 'id' => $id, 'qty' => 1 ]; }, $ids );
        if ( count( $ids ) === 1 ) {
            // v1.7.0: viena preke = prekes puslapio logika (su prekes puslapio nuolaida)
            echo '<p><b>Režimas:</b> prekės puslapis</p>';
            $items = [];
            foreach ( $this->get_companions( $ids[0] ) as $cid ) {
                $cp = wc_get_product( $cid ); if ( ! $cp ) continue;
                if ( $cp->is_on_sale() ) { $full = (float) $cp->get_regular_price(); $charge = (float) $cp->get_price(); $pct = ( $full > 0 && $charge < $full ) ? round( ( 1 - $charge / $full ) * 100 ) : 0; }
                else { $full = (float) $cp->get_price(); $pct = $this->discount_for( $cp ); $charge = round( $full * ( 1 - $pct / 100 ), 2 ); }
                $items[] = [ 'id' => $cid, 'name' => $cp->get_name(), 'price' => $full, 'charge' => $charge, 'pct' => $pct, 'anchor' => $ids[0] ];
            }
            $res = [ 'items' => $items, 'debug' => [ 'sources' => [ (string) $this->source_of( $ids[0], 1 ) ], 'ctx' => $this->ctx_for_main( $ids[0] ), 'atmesta' => [] ] ];
        } else {
            echo '<p><b>Režimas:</b> krepšelis (be nuolaidos)</p>';
            $res = $this->suggest_core( $lines, (int) $this->opt( 'cart_maxc', 4 ), true );
        }
        $dbg = $res['debug'];

        echo '<p><b>Krepšelio sandėliai:</b> ' . esc_html( implode( ', ', $dbg['sources'] ) ?: '—' )
           . ' &nbsp; <b>Jautrumo režimas:</b> ' . ( $dbg['ctx']['strict'] ? '<b>GRIEŽTAS</b> (leidžiami baltymai: ' . esc_html( implode( ', ', $dbg['ctx']['proteins'] ) ?: 'jokių' ) . ')' : 'įprastas' ) . '</p>';

        echo '<h3>Pasiūlymai (' . count( $res['items'] ) . ')</h3>';
        if ( $res['items'] ) {
            echo '<table class="widefat" style="max-width:900px"><thead><tr><th>ID</th><th>Prekė</th><th>Sandėlis</th><th>Kaina</th><th>Su nuolaida</th><th>%</th><th>Inkaras</th></tr></thead><tbody>';
            foreach ( $res['items'] as $r ) {
                echo '<tr><td>' . (int) $r['id'] . '</td><td>' . esc_html( $r['name'] ) . '</td>'
                   . '<td>' . esc_html( (string) $this->source_of( $r['id'], 1 ) ) . '</td>'
                   . '<td>' . wc_price( $r['price'] ) . '</td><td>' . wc_price( $r['charge'] ) . '</td>'
                   . '<td>' . ( $r['pct'] > 0 ? '−' . esc_html( $this->fmt_pct( $r['pct'] ) ) . '%' : '—' ) . '</td>'
                   . '<td>' . (int) $r['anchor'] . '</td></tr>';
            }
            echo '</tbody></table>';
        } else {
            echo '<p><em>Nieko nesiūloma (nėra tinkamų kandidatų — jokio fallback).</em></p>';
        }

        echo '<h3>Atmesti kandidatai (' . count( $dbg['atmesta'] ) . ', rodoma iki 40)</h3>';
        if ( $dbg['atmesta'] ) {
            echo '<table class="widefat" style="max-width:900px"><thead><tr><th>ID</th><th>Prekė</th><th>Priežastis</th></tr></thead><tbody>';
            foreach ( $dbg['atmesta'] as $a ) {
                $p = wc_get_product( $a['id'] );
                echo '<tr><td>' . (int) $a['id'] . '</td><td>' . ( $p ? esc_html( $p->get_name() ) : '—' ) . '</td><td>' . esc_html( $a['kodel'] ) . '</td></tr>';
            }
            echo '</tbody></table>';
        } else {
            echo '<p><em>Atmestų nėra.</em></p>';
        }
    }

    /* ===================== META BOX (override) ===================== */
    public function add_meta_box() {
        add_meta_box('petshop_fbt_box','Dažnai perkama kartu (override)',[$this,'meta_box_html'],'product','side','default');
    }
    public function meta_box_html( $post ) {
        wp_nonce_field('petshop_fbt_save','petshop_fbt_nonce');
        $ids = (array) get_post_meta($post->ID,self::META_IDS,true);
        ?>
        <p class="description">Tuščia = auto pagal kategorijų poras (tik to paties sandėlio prekės). Pasirink prekes, jei nori perrašyti auto — rankinis pasirinkimas NEFILTRUOJAMAS pagal sandėlį (jautrumo filtras krepšelyje galioja visiems).</p>
        <select class="wc-product-search" multiple="multiple" style="width:100%;"
                name="petshop_fbt_ids[]" data-placeholder="Ieškoti prekių…"
                data-action="woocommerce_json_search_products_and_variations"
                data-exclude="<?php echo esc_attr($post->ID); ?>">
            <?php foreach ( $ids as $id ) { $p=wc_get_product($id);
                if ($p) echo '<option value="'.esc_attr($id).'" selected>'.esc_html($p->get_formatted_name()).'</option>'; } ?>
        </select>
        <?php
    }
    public function save_meta_box( $post_id ) {
        if ( ! isset($_POST['petshop_fbt_nonce']) || ! wp_verify_nonce($_POST['petshop_fbt_nonce'],'petshop_fbt_save') ) return;
        if ( defined('DOING_AUTOSAVE') && DOING_AUTOSAVE ) return;
        if ( ! current_user_can('edit_post',$post_id) ) return;
        $ids = isset($_POST['petshop_fbt_ids']) ? array_map('absint',(array)$_POST['petshop_fbt_ids']) : [];
        $ids = array_values(array_filter($ids,function($id)use($post_id){return $id && $id!=$post_id;}));
        update_post_meta($post_id,self::META_IDS,$ids);
    }
    public function admin_assets( $hook ) {
        global $post;
        if ( ($hook==='post.php'||$hook==='post-new.php') && $post && $post->post_type==='product' ) {
            wp_enqueue_script('wc-enhanced-select');
            wp_enqueue_style('woocommerce_admin_styles', WC()->plugin_url().'/assets/css/admin.css');
        }
    }

    /* ===================== KOMPANIONAI ===================== */

    // v1.4.3: bendras helperis — ar preke naudoja RANKINI override?
    private function manual_companion_ids( $product_id ) {
        $manual = array_values(array_filter(array_map('absint',(array)get_post_meta($product_id,self::META_IDS,true))));
        if ( empty($manual) ) return [];
        $ids=[]; foreach ($manual as $id){ $p=wc_get_product($id);
            if ($p && $p->is_in_stock() && $p->is_purchasable() && $p->get_status()==='publish') $ids[]=$id; }
        return $ids;
    }

    // Co-purchase kandidatai (E3 cron pildo kasnakt is ps_fakt_eilutes)
    private function copurchase_ids( $product_id ) {
        $map = get_option( self::OPT_COPURCH, [] );
        if ( ! is_array($map) || empty($map[$product_id]) ) return [];
        return array_values( array_filter( array_map( 'absint', (array) $map[$product_id] ) ) );
    }

    /* ===================== CO-PURCHASE CRON (v1.6.0, E3) ===================== */

    public function copurchase_maybe_schedule() {
        if ( ! wp_next_scheduled( self::CRON_HOOK ) ) {
            // Kasnakt 01:10 UTC (Vilnius ~04:10 vasara / 03:10 ziema) — po faktu agregavimo.
            $kada = strtotime( gmdate( 'Y-m-d' ) . ' 01:10:00 UTC' );
            if ( $kada <= time() ) $kada += DAY_IN_SECONDS;
            wp_schedule_event( $kada, 'daily', self::CRON_HOOK );
        }
    }

    /**
     * Perskaiciuoja co-purchase zemelapi is faktu sluoksnio (TIK skaito, S6).
     * Pora = dvi skirtingos prekes tame paciame uzsakyme per COPURCH_DIENOS d.
     * testinis=1 ir dovana=1 eilutes ignoruojamos.
     */
    public function copurchase_rebuild() {
        global $wpdb;
        $t = $wpdb->prefix . 'ps_fakt_eilutes';
        if ( $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $t ) ) !== $t ) return;
        $nuo = gmdate( 'Y-m-d', time() - self::COPURCH_DIENOS * DAY_IN_SECONDS );
        $rows = $wpdb->get_results( $wpdb->prepare(
            "SELECT a.preke_id p1, b.preke_id p2, COUNT(DISTINCT a.uzsakymas_id) n
             FROM {$t} a
             JOIN {$t} b ON a.uzsakymas_id = b.uzsakymas_id AND a.preke_id <> b.preke_id
             WHERE a.diena >= %s AND b.diena >= %s
               AND a.testinis = 0 AND b.testinis = 0
               AND a.dovana = 0 AND b.dovana = 0
               AND a.preke_id > 0 AND b.preke_id > 0
             GROUP BY a.preke_id, b.preke_id
             HAVING n >= %d",
            $nuo, $nuo, self::COPURCH_MIN
        ), ARRAY_A );
        $map = $this->copurchase_build_from_rows( is_array( $rows ) ? $rows : [] );
        // autoload=no (zemelapis gali buti didelis; reikalingas tik FBT kontekste)
        delete_option( self::OPT_COPURCH );
        add_option( self::OPT_COPURCH, $map, '', 'no' );
        $poru = 0; foreach ( $map as $v ) $poru += count( $v );
        delete_option( self::OPT_COPURCH . '_info' );
        add_option( self::OPT_COPURCH . '_info', [
            'atnaujinta' => gmdate( 'Y-m-d H:i:s' ), 'prekiu' => count( $map ), 'poru' => $poru,
            'laikotarpis_nuo' => $nuo, 'min' => self::COPURCH_MIN, 'top' => self::COPURCH_TOP,
        ], '', 'no' );
    }

    /**
     * Grynoji logika (testuojama dirbtinemis eilutemis, be DB):
     * [ ['p1'=>,'p2'=>,'n'=>], ... ] -> [ p1 => [p2 pagal n desc, max TOP], ... ]
     * Lygiosios -> mazesnis id pirmiau (determinizmas).
     */
    private function copurchase_build_from_rows( array $rows ) {
        $g = [];
        foreach ( $rows as $r ) {
            $p1 = (int) ( $r['p1'] ?? 0 ); $p2 = (int) ( $r['p2'] ?? 0 ); $n = (int) ( $r['n'] ?? 0 );
            if ( $p1 <= 0 || $p2 <= 0 || $p1 === $p2 || $n < self::COPURCH_MIN ) continue;
            $g[ $p1 ][ $p2 ] = max( $n, $g[ $p1 ][ $p2 ] ?? 0 );
        }
        $map = [];
        foreach ( $g as $p1 => $cands ) {
            uksort( $cands, function( $a, $b ) use ( $cands ) {
                if ( $cands[ $a ] === $cands[ $b ] ) return $a <=> $b;
                return $cands[ $b ] <=> $cands[ $a ];
            } );
            $map[ $p1 ] = array_slice( array_keys( $cands ), 0, self::COPURCH_TOP );
        }
        return $map;
    }

    // v1.5.0: pagrindines prekes fulfillment source per AV Source sluoksni.
    //   Grazina ['source'=>..., 'auto_off'=>bool, 'filter'=>bool]
    private function main_source_info( $product_id ) {
        $source = $this->source_of( $product_id, 1 );
        return [
            'source'   => $source,
            'filter'   => ( $source !== null ),
            // Ambrosia/Prins dropship — auto FBT israijungtas (mazas pasirinkimas).
            // Jei AV Source grazino 'av' (AV turi likuti) — auto veikia.
            'auto_off' => in_array( $source, [ 'ambrosia', 'prins' ], true ),
        ];
    }

    // Kategorijos, kurios yra leidziami AUTO kompanionai pagrindinei prekei
    private function companion_cat_slugs( $product_id ) {
        $pairs = $this->pairs();
        if ( empty($pairs) ) return [];
        $my_cats = $this->product_cat_slugs($product_id);
        $comp_cats = [];
        foreach ( $pairs as $main=>$comps ) {
            if ( in_array($main,$my_cats,true) ) $comp_cats = array_merge($comp_cats,$comps);
        }
        return array_values(array_unique($comp_cats));
    }

    /**
     * v1.4.3/v1.5.0: PATIKRA (ne random) — ar $cid yra leidziamas kompanionas
     * $main prekei. Naudojama ajax_add() metu. BE shuffle, BE limito.
     *
     *   1. Rankinis override -> $cid tarp override ID (source NEfiltruojamas,
     *      jautrumas pagal pagrindine — TAIKOMAS, v1.5.0).
     *   2. Co-purchase -> source + jautrumas (v1.5.0).
     *   3. Auto -> kategorija tarp companion_cat_slugs IR source sutampa IR
     *      jautrumas OK. Ambrosia/prins pagrindine -> auto OFF.
     */
    private function is_valid_companion( $main_id, $cid ) {
        $cid = (int) $cid;
        if ( $cid <= 0 || $cid === (int) $main_id ) return false;

        $cp = wc_get_product( $cid );
        if ( ! $cp || ! $cp->is_purchasable() || ! $cp->is_in_stock() ) return false;
        if ( $cp->get_status() !== 'publish' ) return false;

        // v1.7.0: maistas — tik tai, ka rodo maisto logika (R sarasai / zaislas)
        if ( $this->food_species( $main_id ) ) {
            return in_array( $cid, $this->food_offer( $main_id, 1 )['ids'], true );
        }

        $ctx = $this->ctx_for_main( $main_id );
        $src = $this->main_source_info( $main_id );
        if ( ! $src['filter'] ) return false; // v1.7.0 (P5): nezinomas sandelis — nieko

        // 1) Rankinis override — v1.7.0: filtruojamas sandeliu (P3), jautrumas taikomas.
        $manual = $this->manual_companion_ids( $main_id );
        if ( ! empty($manual) ) {
            return in_array( $cid, $manual, true ) && $this->source_of( $cid, 1 ) === $src['source'] && $this->sensitivity_ok( $ctx, $cid );
        }

        // 2) Co-purchase (v1.5.0)
        if ( in_array( $cid, $this->copurchase_ids( $main_id ), true ) ) {
            if ( $src['filter'] ) {
                $cand_source = $this->source_of( $cid, 1 );
                if ( $cand_source !== $src['source'] ) return false;
            }
            return $this->sensitivity_ok( $ctx, $cid );
        }

        // 3) Auto pagal kategoriju poras
        if ( $src['auto_off'] ) return false;

        $comp_cats = $this->companion_cat_slugs( $main_id );
        if ( empty($comp_cats) ) return false;

        $cid_cats = $this->product_cat_slugs( $cid );
        if ( ! array_intersect( $cid_cats, $comp_cats ) ) return false;

        // Source filtras (S74): kompaniono source turi sutapti su pagrindines
        if ( $src['filter'] ) {
            $cand_source = $this->source_of( $cid, 1 );
            if ( $cand_source !== $src['source'] ) return false;
        }

        return $this->sensitivity_ok( $ctx, $cid );
    }

    private function get_companions( $product_id ) {
        // v1.7.0: maistas — R sarasai pagal realu sandeli ir taisykles (max 2)
        if ( $this->food_species( $product_id ) ) {
            $o = $this->food_offer( $product_id, 1 );
            return array_slice( $o['ids'], 0, min( self::FOOD_MAX, max( 1, (int) $this->opt( 'maxc', 3 ) ) ) );
        }

        $ctx = $this->ctx_for_main( $product_id );
        $src = $this->main_source_info( $product_id );
        if ( ! $src['filter'] ) return []; // v1.7.0 (P5): nezinomas sandelis — nieko

        // 1) Rankinis override — v1.7.0: filtruojamas sandeliu (P3); jautrumas taikomas.
        $manual = $this->manual_companion_ids( $product_id );
        if ( ! empty($manual) ) {
            $ids = [];
            foreach ( $manual as $cid ) {
                if ( $this->source_of( $cid, 1 ) === $src['source'] && $this->sensitivity_ok( $ctx, $cid ) ) $ids[] = $cid;
            }
            return $ids;
        }

        $max = (int)$this->opt('maxc',3);
        $ids = [];

        // 2) Co-purchase (v1.5.0) — pirmumas pries kategoriju poras.
        foreach ( $this->copurchase_ids( $product_id ) as $cid ) {
            $cp = wc_get_product( $cid );
            if ( ! $cp || ! $cp->is_purchasable() || ! $cp->is_in_stock() || $cp->get_status()!=='publish' ) continue;
            if ( $src['filter'] && $this->source_of( $cid, 1 ) !== $src['source'] ) continue;
            if ( ! $this->sensitivity_ok( $ctx, $cid ) ) continue;
            $ids[] = (int) $cid;
            if ( count($ids) >= $max ) return $ids;
        }

        // 3) Auto pagal kategorijų poras (v1.4.2: source filtras, v1.5.0: + jautrumas)
        if ( $src['auto_off'] ) return $ids;

        $comp_cats = $this->companion_cat_slugs( $product_id );
        if ( empty($comp_cats) ) return $ids;

        $candidate_ids = wc_get_products([
            'status'       => 'publish',
            'limit'        => -1,
            'exclude'      => array_merge( [ $product_id ], $ids ),
            'stock_status' => 'instock',
            'category'     => $comp_cats,
            'return'       => 'ids',
        ]);
        if ( empty($candidate_ids) ) return $ids;

        shuffle( $candidate_ids );
        // Saugiklis: ribojam resolve kvietimu skaiciu (jei kategorija labai didele)
        if ( count($candidate_ids) > 150 ) {
            $candidate_ids = array_slice( $candidate_ids, 0, 150 );
        }

        foreach ( $candidate_ids as $cid ) {
            $p = wc_get_product( $cid );
            if ( ! $p || ! $p->is_purchasable() ) continue;

            // HARD FILTER: tik tas pats fulfillment source. Jokio fallback.
            if ( $src['filter'] ) {
                if ( $this->source_of( (int) $cid, 1 ) !== $src['source'] ) continue;
            }
            // HARD FILTER: jautrumas (v1.5.0). Jokio fallback.
            if ( ! $this->sensitivity_ok( $ctx, (int) $cid ) ) continue;

            $ids[] = (int) $cid;
            if ( count($ids) >= $max ) break;
        }
        return $ids;
    }

    private function discount_for( $product ) {
        // Jau akcijoje? FBT nuolaida netaikoma (be dvigubos nuolaidos).
        if ( $product->is_on_sale() ) return 0;
        $default=(float)$this->opt('discount',0); $rules=$this->cat_rules();
        if ( empty($rules) ) return $default;
        $m=[]; foreach ($this->product_cat_slugs($product->get_id()) as $s) if (isset($rules[$s])) $m[]=(float)$rules[$s];
        return ! empty($m) ? min($m) : $default;
    }


    /** v1.5.1: procento formatavimas be sveiku skaiciu darkymo (10 -> "10", 12.5 -> "12,5"; senas rtrim "10" paversdavo "1"). */
    private function fmt_pct( $pct ) {
        $s = (string) (float) $pct;
        if ( strpos( $s, '.' ) !== false ) $s = rtrim( rtrim( $s, '0' ), '.' );
        return str_replace( '.', ',', $s );
    }

    /* ===================== FRONTEND: PREKES PUSLAPIS ===================== */
    public function render_widget() {
        if ( $this->opt('enabled','1')!=='1' ) return;
        global $product;
        if ( ! $product instanceof WC_Product ) return;
        if ( ! $product->is_purchasable() || ! $product->is_in_stock() ) return;

        $companions = $this->get_companions( $product->get_id() );
        if ( empty($companions) ) return;

        $precheck = $this->opt('precheck','1')==='1';
        $heading  = $this->opt('heading','Dažnai perkama kartu');
        // v1.7.1 (V2, R maketas 09-27): pagrindine preke eilute nerodoma (ji ka tik virs bloko), kiekis is formos
        $in_cart  = $this->main_in_cart( $product->get_id() );

        $rows=[];
        foreach ( $companions as $cid ) {
            $cp=wc_get_product($cid); if(!$cp) continue;
            if ( $cp->is_on_sale() ) {
                $full   = (float)$cp->get_regular_price();
                $charge = (float)$cp->get_price();
                $pct    = ( $full>0 && $charge<$full ) ? round((1-$charge/$full)*100) : 0;
            } else {
                $full   = (float)$cp->get_price();
                $pct    = $this->discount_for($cp);
                $charge = round($full*(1-$pct/100),2);
            }
            $rows[]=['id'=>$cid,'name'=>$cp->get_name(),'img'=>$cp->get_image('thumbnail'),'price'=>$full,'charge'=>$charge,'pct'=>$pct];
        }
        if ( ! $rows ) return;
        $nonce = wp_create_nonce('petshop_fbt_add');
        ?>
        <div class="petshop-fbt" data-nonce="<?php echo esc_attr($nonce); ?>" data-main="<?php echo esc_attr($product->get_id()); ?>" data-mainprice="<?php echo esc_attr( (float) $product->get_price() ); ?>" data-incart="<?php echo $in_cart ? '1' : '0'; ?>">
            <div class="petshop-fbt__heading"><?php echo esc_html($heading); ?></div>
            <div class="petshop-fbt__items">
                <?php foreach ( $rows as $r ) : $url=get_permalink($r['id']); ?>
                    <div class="petshop-fbt__row">
                        <input type="checkbox" class="petshop-fbt__cb" value="<?php echo esc_attr($r['id']); ?>"
                               data-charge="<?php echo esc_attr($r['charge']); ?>" data-full="<?php echo esc_attr($r['price']); ?>"
                               aria-label="<?php echo esc_attr('Pridėti: '.$r['name']); ?>" <?php echo $precheck?'checked':''; ?>>
                        <a class="petshop-fbt__thumb petshop-fbt-info" data-pid="<?php echo esc_attr($r['id']); ?>" href="<?php echo esc_url($url); ?>" tabindex="-1"><?php echo $r['img']; ?></a>
                        <div class="petshop-fbt__mid">
                            <a class="petshop-fbt__name petshop-fbt-info" data-pid="<?php echo esc_attr($r['id']); ?>" href="<?php echo esc_url($url); ?>"><?php echo esc_html($r['name']); ?></a>
                            <div class="petshop-fbt__price">
                                <?php if ( $r['charge']<$r['price'] ) : ?>
                                    <del><?php echo wc_price($r['price']); ?></del> <ins><?php echo wc_price($r['charge']); ?></ins>
                                    <span class="petshop-fbt__badge">−<?php echo esc_html($this->fmt_pct($r['pct'])); ?>%</span>
                                <?php else : ?>
                                    <span class="petshop-fbt__full"><?php echo wc_price($r['charge']); ?></span>
                                <?php endif; ?>
                            </div>
                            <div class="petshop-fbt__step">
                                <button type="button" class="petshop-fbt__minus" aria-label="Mažinti kiekį">−</button>
                                <span class="petshop-fbt__q" aria-live="polite">1</span>
                                <button type="button" class="petshop-fbt__plus" aria-label="Didinti kiekį">+</button>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
            <div class="petshop-fbt__footer">
                <div class="petshop-fbt__total"><?php echo $in_cart ? 'Pasirinkta' : 'Kartu'; ?>: <b class="petshop-fbt__total-val"></b></div>
                <button type="button" class="petshop-fbt__add"><?php echo $in_cart ? 'Pridėti į krepšelį' : ( count( $rows ) > 1 ? 'Pridėti kartu į krepšelį' : 'Pridėti abu į krepšelį' ); ?></button>
            </div>
        </div>
        <?php
    }

    /* ===================== FRONTEND: KREPSELIO BLOKAS (v1.5.0) ===================== */

    /** Krepselio sandeliu aibe (per AV Source sluoksni, su realiais kiekiais). */
    private function cart_sources( $cart ) {
        $s = [];
        foreach ( $cart->get_cart() as $i ) {
            $pid = (int) ( $i['product_id'] ?? 0 );
            if ( ! $pid ) continue;
            $src = $this->source_of( $pid, (int) ( $i['quantity'] ?? 1 ) );
            if ( $src !== null ) $s[ $src ] = true;
        }
        return $s;
    }

    /**
     * Krepselio pasiulymu rinkinys.
     * Kandidatai: rankinis override (source nefiltruojamas) → co-purchase →
     * kategoriju poros. HARD: nera krepselyje, source ∈ krepselio sources,
     * jautrumas, stock. Jokio fallback.
     * @return array ['items'=>[], 'gap'=>float, 'thr'=>float]
     */
    private function cart_suggestions() {
        $cart = WC()->cart;
        $lines = [];
        foreach ( $cart->get_cart() as $i ) {
            $pid = (int) ( $i['product_id'] ?? 0 );
            if ( $pid ) $lines[] = [ 'id' => $pid, 'qty' => max( 1, (int) ( $i['quantity'] ?? 1 ) ) ];
        }
        return $this->suggest_core( $lines, (int) $this->opt( 'cart_maxc', 4 ), false );
    }

    /**
     * v1.6.0: bendras variklis krepseliui IR admin perziurai.
     * $lines = [ ['id'=>int,'qty'=>int], ... ] — krepselio (ar simuliuojamo) turinys.
     * $debug=true — renka atmetimo priezastis (tik perziurai; fronte nerenkam).
     * @return array ['items'=>[], 'debug'=>?['sources'=>[],'ctx'=>[],'atmesta'=>[]]]
     */
    private function suggest_core( array $lines, $max, $debug = false ) {
        $dbg = [ 'sources' => [], 'ctx' => [], 'atmesta' => [], 'maistas' => [] ];
        $atmesk = function( $cid, $kodel ) use ( &$dbg, $debug ) {
            if ( $debug && count( $dbg['atmesta'] ) < 40 ) $dbg['atmesta'][] = [ 'id' => (int) $cid, 'kodel' => $kodel ];
        };

        // Sandeliai (per AV Source sluoksni, su kiekiais)
        $sources = [];
        foreach ( $lines as $l ) {
            $src = $this->source_of( (int) $l['id'], (int) $l['qty'] );
            if ( $src !== null ) $sources[ $src ] = true;
        }
        $dbg['sources'] = array_keys( $sources );
        // Negalim nustatyti sandeliu — nesiulom (galetume sukurti nauja siunta).
        if ( empty( $sources ) ) return [ 'items' => [], 'debug' => $debug ? $dbg : null ];

        // Jautrumo kontekstas
        $ctx = [ 'strict' => false, 'proteins' => [] ];
        foreach ( $lines as $l ) {
            $pid = (int) $l['id'];
            if ( $this->is_strict_food( $pid ) ) $ctx['strict'] = true;
            $ctx['proteins'] = array_merge( $ctx['proteins'], $this->protein_terms( $pid ) );
        }
        $ctx['proteins'] = array_values( array_unique( $ctx['proteins'] ) );
        $dbg['ctx'] = $ctx;

        $in_cart = [];
        foreach ( $lines as $l ) $in_cart[ (int) $l['id'] ] = true;

        // Kandidatai: cid => ['anchor'=>pid, 'manual'=>bool, 'food'=>bool]
        $cand = [];
        $cat_anchor = []; $all_comp_cats = [];
        // v1.7.0: maisto eilutes pirmos — R sarasai pagal realu sandeli (su realiu kiekiu)
        $food_lines = [];
        foreach ( $lines as $l ) {
            $pid = (int) $l['id'];
            if ( ! $this->food_species( $pid ) ) continue;
            $food_lines[] = $pid;
            $fo = $this->food_offer( $pid, (int) $l['qty'], array_keys( $in_cart ) );
            if ( $debug ) $dbg['maistas'][ $pid ] = [ 'sandelis' => $fo['wh'], 'zymos' => $fo['zymos'], 'zaislas' => $fo['zaislas'], 'kodel' => $fo['kodel'] ];
            foreach ( $fo['ids'] as $cid ) {
                if ( ! isset( $cand[ $cid ] ) ) $cand[ $cid ] = [ 'anchor' => $pid, 'manual' => false, 'food' => true ];
            }
        }
        foreach ( $lines as $l ) {
            $pid = (int) $l['id'];
            if ( in_array( $pid, $food_lines, true ) ) continue; // v1.7.0: maistui porų / co-purchase nenaudojam
            foreach ( $this->manual_companion_ids( $pid ) as $cid ) {
                if ( ! isset( $cand[ $cid ] ) ) $cand[ $cid ] = [ 'anchor' => $pid, 'manual' => true ];
            }
            foreach ( $this->copurchase_ids( $pid ) as $cid ) {
                if ( ! isset( $cand[ $cid ] ) ) $cand[ $cid ] = [ 'anchor' => $pid, 'manual' => false ];
            }
            foreach ( $this->companion_cat_slugs( $pid ) as $cs ) {
                if ( ! isset( $cat_anchor[ $cs ] ) ) $cat_anchor[ $cs ] = $pid;
                $all_comp_cats[ $cs ] = true;
            }
        }
        if ( $all_comp_cats ) {
            $pool = wc_get_products([
                'status'       => 'publish',
                'limit'        => -1,
                'stock_status' => 'instock',
                'category'     => array_keys( $all_comp_cats ),
                'return'       => 'ids',
            ]);
            shuffle( $pool );
            if ( count( $pool ) > 150 ) $pool = array_slice( $pool, 0, 150 );
            foreach ( $pool as $cid ) {
                $cid = (int) $cid;
                if ( isset( $cand[ $cid ] ) ) continue;
                $an = null;
                foreach ( $this->product_cat_slugs( $cid ) as $slg ) {
                    if ( isset( $cat_anchor[ $slg ] ) ) { $an = $cat_anchor[ $slg ]; break; }
                }
                if ( $an ) $cand[ $cid ] = [ 'anchor' => $an, 'manual' => false ];
            }
        }

        $items = [];
        foreach ( $cand as $cid => $meta ) {
            $cid = (int) $cid;
            if ( isset( $in_cart[ $cid ] ) ) { $atmesk( $cid, 'jau krepšelyje' ); continue; }
            $cp = wc_get_product( $cid );
            if ( ! $cp || ! $cp->is_purchasable() || ! $cp->is_in_stock() || $cp->get_status() !== 'publish' ) { $atmesk( $cid, 'neprieinama' ); continue; }
            if ( ! empty( $meta['food'] ) ) {
                // v1.7.0: sandelis ir taisykles jau patikrinti maisto logikoje; tikrinam tik KITUS krepselio maistus (vet/hipo)
                $blok = null;
                foreach ( $food_lines as $fp ) {
                    if ( $fp === (int) $meta['anchor'] ) continue;
                    if ( ! $this->treat_ok_for_food( $cid, $fp ) ) { $blok = $fp; break; }
                }
                if ( $blok ) { $atmesk( $cid, 'netinka kitam krepšelio maistui #' . $blok ); continue; }
            } else {
                // Source — v1.7.0: filtruojamas ir rankiniam sarasui (K4)
                $src = $this->source_of( $cid, 1 );
                if ( $src === null || ! isset( $sources[ $src ] ) ) { $atmesk( $cid, 'kitas sandėlis: ' . ( $src ?: '?' ) ); continue; }
                // Jautrumas: taikomas VISIEMS (kontekstas — visas krepselis)
                if ( ! $this->sensitivity_ok( $ctx, $cid ) ) {
                    $pr = $this->protein_terms( $cid );
                    $atmesk( $cid, $pr ? ( 'baltymai: ' . implode( ',', $pr ) ) : 'baltymai nedeklaruoti' );
                    continue;
                }
                $blok = null;
                foreach ( $food_lines as $fp ) { if ( ! $this->treat_ok_for_food( $cid, $fp ) ) { $blok = $fp; break; } }
                if ( $blok ) { $atmesk( $cid, 'netinka krepšelio maistui #' . $blok ); continue; }
            }

            // v1.7.0 (K2): krepselyje BE FBT nuolaidos — rodoma tik prekes pacios akcija
            if ( $cp->is_on_sale() ) {
                $full = (float) $cp->get_regular_price();
                $charge = (float) $cp->get_price();
                $pct = ( $full > 0 && $charge < $full ) ? round( ( 1 - $charge / $full ) * 100 ) : 0;
            } else {
                $full = (float) $cp->get_price();
                $pct = 0;
                $charge = $full;
            }
            $items[] = [
                'id' => $cid, 'anchor' => (int) $meta['anchor'], 'name' => $cp->get_name(),
                'img' => $cp->get_image( 'thumbnail' ), 'price' => $full, 'charge' => $charge,
                'pct' => $pct, 'url' => get_permalink( $cid ),
            ];
            if ( count( $items ) >= $max ) break;
        }
        return [ 'items' => $items, 'debug' => $debug ? $dbg : null ];
    }

    public function render_cart_block() {
        if ( $this->opt( 'cart_enabled', '1' ) !== '1' ) return;
        if ( ! function_exists( 'WC' ) || ! WC()->cart || WC()->cart->is_empty() ) return;

        $sug = $this->cart_suggestions();
        if ( empty( $sug['items'] ) ) return;

        $heading = $this->opt( 'cart_heading', 'Papildykite krepšelį' );
        $note    = ''; // v1.7.0 (K2): krepselyje nuolaidos nera
        $nonce = wp_create_nonce( 'petshop_fbt_cart' );
        ?>
        <div class="petshop-fbt-cart" data-nonce="<?php echo esc_attr( $nonce ); ?>">
            <div class="petshop-fbt-cart__head">
                <h3 class="petshop-fbt-cart__heading"><?php echo esc_html( $heading ); ?></h3>
                <?php if ( $note ) : ?><p class="petshop-fbt-cart__note"><?php echo esc_html( $note ); ?></p><?php endif; ?>
            </div>
            <div class="petshop-fbt-cart__items">
                <?php foreach ( $sug['items'] as $r ) : ?>
                    <div class="petshop-fbt-cart__item">
                        <a class="petshop-fbt-cart__thumb petshop-fbt-info" data-pid="<?php echo esc_attr( $r['id'] ); ?>" href="<?php echo esc_url( $r['url'] ); ?>"><?php echo $r['img']; ?></a>
                        <a class="petshop-fbt-cart__name petshop-fbt-info" data-pid="<?php echo esc_attr( $r['id'] ); ?>" href="<?php echo esc_url( $r['url'] ); ?>"><?php echo esc_html( $r['name'] ); ?></a>
                        <span class="petshop-fbt-cart__price">
                            <?php if ( $r['charge'] < $r['price'] ) : ?>
                                <del><?php echo wc_price( $r['price'] ); ?></del>
                                <ins><?php echo wc_price( $r['charge'] ); ?></ins>
                                <?php if ( $r['pct'] > 0 ) : ?><span class="petshop-fbt-cart__badge">−<?php echo esc_html($this->fmt_pct($r['pct'])); ?>%</span><?php endif; ?>
                            <?php else : ?>
                                <span><?php echo wc_price( $r['charge'] ); ?></span>
                            <?php endif; ?>
                        </span>
                        <button type="button" class="button petshop-fbt-cart__add" data-cid="<?php echo esc_attr( $r['id'] ); ?>" data-anchor="<?php echo esc_attr( $r['anchor'] ); ?>">Pridėti</button>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php
    }

    /* ===================== NEMOKAMO PRISTATYMO JUOSTA + SKANESTAS (v1.7.2) ===================== */

    /** Temos juosta (functions.php petshop_free_shipping_progress, prio 5) apgaubiama: jos logika ir tekstas nekeiciami. */
    public function juosta_perimti() {
        if ( ! function_exists( 'petshop_free_shipping_progress' ) ) return;
        if ( has_action( 'woocommerce_cart_totals_before_order_total', 'petshop_free_shipping_progress' ) !== 5 ) return;
        remove_action( 'woocommerce_cart_totals_before_order_total', 'petshop_free_shipping_progress', 5 );
        add_action( 'woocommerce_cart_totals_before_order_total', [ $this, 'juosta' ], 5 );
    }
    public function juosta() {
        ob_start(); petshop_free_shipping_progress(); $h = (string) ob_get_clean();
        if ( $h !== '' && preg_match( '~Dar <strong>€(\d+,\d{2})</strong>~u', $h, $m ) ) {
            $extra = '';
            try { $extra = $this->juosta_pasiulymas( (float) str_replace( ',', '.', $m[1] ) ); } catch ( Throwable $e ) { $extra = ''; }
            $pos = strrpos( $h, '</div>' );
            if ( $extra !== '' && $pos !== false ) $h = substr_replace( $h, $extra, $pos, 0 );
        }
        echo $h;
    }
    /** Vienas skanestas (to paties sandelio kaip krepselio maistas), kurio N vnt. uzpildo truksta suma su maziausiu pertekliumi. */
    private function juosta_pasiulymas( $gap ) {
        if ( $gap <= 0 || $gap > self::JUOSTA_MAX_EUR || ! function_exists( 'WC' ) || ! WC()->cart ) return '';
        $in_cart = []; $food = [];
        foreach ( WC()->cart->get_cart() as $i ) {
            $pid = (int) ( $i['product_id'] ?? 0 ); if ( ! $pid ) continue;
            $in_cart[] = $pid;
            if ( $this->food_species( $pid ) ) $food[ $pid ] = max( 1, (int) ( $i['quantity'] ?? 1 ) );
        }
        if ( ! $food ) return '';
        $best = null;
        foreach ( $food as $fp => $fq ) {
            $fo = $this->food_offer( $fp, $fq, $in_cart );
            if ( empty( $fo['wh'] ) ) continue;
            foreach ( $fo['ids'] as $cid ) {
                $ok = true;
                foreach ( array_keys( $food ) as $kitas ) { if ( $kitas !== $fp && ! $this->treat_ok_for_food( $cid, $kitas ) ) { $ok = false; break; } }
                if ( ! $ok ) continue;
                $cp = wc_get_product( $cid ); if ( ! $cp ) continue;
                $p = (float) $cp->get_price(); if ( $p <= 0 ) continue;
                $n = (int) ceil( $gap / $p - 1e-9 );
                if ( $n < 1 || $n > ( $fo['zaislas'] ? 2 : self::JUOSTA_MAX_VNT ) ) continue; // v1.7.3: zaislu ne daugiau 2 vnt.
                $st = $this->stk( $cid ); if ( ( $st[ $fo['wh'] ] ?? 0 ) < $n ) continue;
                $over = $n * $p - $gap;
                if ( $best === null || $over < $best['over'] - 0.001 ) $best = [ 'cid' => (int) $cid, 'anchor' => $fp, 'n' => $n, 'p' => $p, 'over' => $over, 'cp' => $cp ];
            }
        }
        if ( ! $best ) return '';
        $cp = $best['cp'];
        $pav = trim( preg_replace( '/,\s*1\s*vnt\.?$/u', '', html_entity_decode( $cp->get_name() ) ) );
        $suma = wc_price( $best['n'] * $best['p'] );
        return '<div class="petshop-fbt-juosta" data-nonce="' . esc_attr( wp_create_nonce( 'petshop_fbt_cart' ) ) . '">'
            . '<div class="petshop-fbt-juosta__item">'
            . '<a class="petshop-fbt-juosta__img petshop-fbt-info" data-pid="' . (int) $best['cid'] . '" href="' . esc_url( get_permalink( $best['cid'] ) ) . '">' . $cp->get_image( 'thumbnail' ) . '</a>'
            . '<div class="petshop-fbt-juosta__txt">' . (int) $best['n'] . ' × ' . esc_html( $pav ) . '<br><b>' . $suma . '</b> — ir pristatymas nemokamas</div>'
            . '<button type="button" class="petshop-fbt-juosta__add" data-cid="' . (int) $best['cid'] . '" data-anchor="' . (int) $best['anchor'] . '" data-qty="' . (int) $best['n'] . '" data-vieta="juosta">+ Pridėti</button>'
            . '</div></div>';
    }

    /* ===================== ASSETS ===================== */
    public function frontend_assets() {
        $is_product = function_exists('is_product') && is_product();
        $is_cart    = function_exists('is_cart') && is_cart();
        if ( ! $is_product && ! $is_cart ) return;

        $css = '';
        if ( $is_product ) {
            $css .= '
        .petshop-fbt{--fbt-accent:#2F6B4F;--fbt-sale:#B0361F;margin:14px 0 6px;padding:14px;border:1px solid #D9DED9;border-radius:10px;background:#FBFBF9;display:flex;flex-direction:column;gap:12px}
        .petshop-fbt__heading{font-size:16px;font-weight:700;line-height:1.3;color:#1F2A24}
        .petshop-fbt__items{display:flex;flex-direction:column;gap:12px}
        .petshop-fbt__row{display:grid;grid-template-columns:24px 56px 1fr;align-items:start;gap:10px}
        .petshop-fbt__cb{width:22px;height:22px;margin:17px 0 0!important;accent-color:var(--fbt-accent);cursor:pointer}
        .petshop-fbt__thumb{width:56px;height:56px;display:flex;align-items:center;justify-content:center;background:#fff;border-radius:6px;overflow:hidden}
        .petshop-fbt__thumb img{max-width:56px;max-height:56px;width:auto;height:auto;object-fit:contain;display:block;margin:0}
        .petshop-fbt__mid{min-width:0;display:flex;flex-direction:column;gap:3px}
        .petshop-fbt__name{font-size:14px;font-weight:600;line-height:1.3;color:inherit;text-decoration:none;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .petshop-fbt__name:hover{color:var(--fbt-accent);text-decoration:underline}
        .petshop-fbt__price{font-size:13px;color:#6B716E;white-space:nowrap}
        .petshop-fbt__price del{color:#8A908C;margin-right:3px}
        .petshop-fbt__price ins{color:var(--fbt-sale);font-weight:700;text-decoration:none}
        .petshop-fbt__badge{display:inline-block;margin-left:5px;font-size:11px;font-weight:700;background:var(--fbt-sale);color:#fff;border-radius:3px;padding:1px 5px;vertical-align:1px}
        .petshop-fbt__full{font-weight:600;color:#1F2A24}
        .petshop-fbt__step{display:inline-flex;align-items:center;align-self:flex-start;border:1px solid #CFD3CF;border-radius:6px;background:#fff;height:44px;margin-top:4px}
        .petshop-fbt__step button{width:44px;height:44px;margin:0!important;padding:0;border:0;background:transparent;font-size:18px;line-height:1;color:#1F2A24;cursor:pointer;min-height:0}
        .petshop-fbt__q{min-width:26px;text-align:center;font-weight:600;font-size:15px}
        .petshop-fbt__footer{display:flex;flex-direction:column;gap:10px}
        .petshop-fbt__total{font-size:14px}
        .petshop-fbt__total-val{font-size:16px}
        .petshop-fbt__add{height:48px;margin:0!important;border:2px solid var(--fbt-accent);border-radius:6px;background:#fff;color:var(--fbt-accent);font-size:15px;font-weight:700;text-transform:none;letter-spacing:normal;cursor:pointer;width:100%}
        .petshop-fbt__add:hover{background:var(--fbt-accent);color:#fff}
        .petshop-fbt__add[disabled]{opacity:.45;cursor:default}
        .petshop-fbt.is-loading{opacity:.55;pointer-events:none}
        @media(min-width:850px){.petshop-fbt__footer{flex-direction:row;align-items:center;justify-content:space-between}.petshop-fbt__add{width:auto;padding:0 22px}}
        ';
        }
        if ( $is_cart ) {
            $css .= '
        .petshop-fbt-cart{--fbt-accent:#5e8c2e;margin:22px 0;padding:18px;border:1px solid #e3e8dc;border-radius:12px;background:#fbfcf9}
        .petshop-fbt-cart__head{margin-bottom:12px}
        .petshop-fbt-cart__heading{margin:0 0 6px;font-size:1.1em;font-weight:700}
        .petshop-fbt-cart__heading .woocommerce-Price-amount{color:var(--fbt-accent)}
        .petshop-fbt-cart__note{margin:0;color:var(--fbt-accent);font-weight:600;font-size:.9em}
        .petshop-fbt-cart__items{display:flex;flex-direction:column;gap:8px}
        .petshop-fbt-cart__item{display:grid;grid-template-columns:52px 1fr auto auto;align-items:center;gap:12px;padding:10px;border-radius:9px;background:#fff;border:1px solid #ededed}
        .petshop-fbt-cart__thumb{width:52px;height:52px;display:flex;align-items:center;justify-content:center}
        .petshop-fbt-cart__thumb img{max-width:52px;max-height:52px;width:auto;height:auto;object-fit:contain;display:block;margin:0;border-radius:4px}
        .petshop-fbt-cart__name{font-size:.9em;line-height:1.35;color:inherit;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .petshop-fbt-cart__price{text-align:right;white-space:nowrap;font-size:.92em}
        .petshop-fbt-cart__price del{color:#aaa;font-size:.82em;margin-right:5px}
        .petshop-fbt-cart__price ins{color:var(--fbt-accent);font-weight:700;text-decoration:none}
        .petshop-fbt-cart__badge{display:inline-block;margin-left:6px;font-size:.72em;font-weight:700;background:var(--fbt-accent);color:#fff;border-radius:4px;padding:1px 5px;vertical-align:middle}
        .petshop-fbt-cart__add{margin:0!important;white-space:nowrap}
        .petshop-fbt-cart__item.is-loading{opacity:.55;pointer-events:none}
        .petshop-fbt-juosta{margin-top:10px}
        .petshop-fbt-juosta__item{display:flex;gap:10px;align-items:center;background:#fff;border-radius:8px;padding:8px 10px}
        .petshop-fbt-juosta__img{flex:0 0 44px;width:44px;height:44px;display:flex;align-items:center;justify-content:center}
        .petshop-fbt-juosta__img img{max-width:44px;max-height:44px;width:auto;height:auto;object-fit:contain;margin:0;display:block;border-radius:4px}
        .petshop-fbt-juosta__txt{flex:1 1 auto;min-width:0;font-size:13px;line-height:1.35;color:#1f2a27;text-align:left}
        .petshop-fbt-juosta__add{flex:0 0 auto;height:44px;margin:0!important;padding:0 14px;border:2px solid #365a51;border-radius:6px;background:#fff;color:#365a51;font-size:14px;font-weight:700;white-space:nowrap;text-transform:none;letter-spacing:normal;line-height:1;cursor:pointer}
        .petshop-fbt-juosta__add:hover{background:#365a51;color:#fff}
        .petshop-fbt-juosta__item.is-loading{opacity:.55;pointer-events:none}
        @media(max-width:560px){.petshop-fbt-cart__item{grid-template-columns:44px 1fr auto}.petshop-fbt-cart__price{grid-column:2;text-align:left}.petshop-fbt-cart__add{grid-column:3;grid-row:1/span 2}}
        ';
        }
        // v1.6.2: modalas (bendras widget'ui ir krepseliui)
        $css .= '
        .pfbt-modal{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px}
        .pfbt-modal__fonas{position:absolute;inset:0;background:rgba(20,26,17,.55)}
        .pfbt-modal__langas{position:relative;background:#fff;border-radius:14px;max-width:560px;width:100%;max-height:88vh;overflow:auto;padding:22px;box-shadow:0 18px 50px rgba(0,0,0,.28)}
        .pfbt-modal__uzdaryti{position:absolute;top:10px;right:10px;width:34px;height:34px;border:0;border-radius:50%;background:#f0f2ec;font-size:18px;line-height:1;cursor:pointer}
        .pfbt-modal__uzdaryti:hover{background:#e2e6da}
        .pfbt-modal__img{display:block;max-width:100%;max-height:260px;width:auto;height:auto;margin:0 auto 14px;object-fit:contain}
        .pfbt-modal__pav{margin:0 0 6px;font-size:1.12em;font-weight:700;line-height:1.35;padding-right:30px}
        .pfbt-modal__kaina{margin:0 0 12px;font-size:1.05em;font-weight:700;color:var(--fbt-accent,#5e8c2e)}
        .pfbt-modal__apras{font-size:.92em;line-height:1.55;color:#3a3f36}
        .pfbt-modal__apras p{margin:0 0 .7em}
        .pfbt-modal.is-kraunasi .pfbt-modal__langas::after{content:"Kraunama…";display:block;text-align:center;color:#888;padding:30px 0}
        ';
        wp_register_style('petshop-fbt',false); wp_enqueue_style('petshop-fbt');
        wp_add_inline_style('petshop-fbt',$css);

        $js = '';
        if ( $is_product ) {
            $js .= '
        jQuery(function($){
          function fmt(n){return n.toFixed(2).replace(".",",")+" €";}
          function mainQty(){var q=parseInt($("form.cart input.qty").first().val(),10);return q>0?q:1;}
          function line(ch,full,q){var d=Math.min(q,3);return ch*d+full*(q-d);}
          function recalc($w){
            var inc=String($w.data("incart"))==="1",total=inc?0:(parseFloat($w.data("mainprice"))||0)*mainQty(),n=0;
            $w.find(".petshop-fbt__row").each(function(){var $r=$(this),cb=$r.find(".petshop-fbt__cb");if(!cb.prop("checked"))return;n++;var q=parseInt($r.find(".petshop-fbt__q").text(),10)||1;total+=line(parseFloat(cb.data("charge"))||0,parseFloat(cb.data("full"))||0,q);});
            $w.find(".petshop-fbt__total-val").text(fmt(total));
            var b=$w.find(".petshop-fbt__add");b.prop("disabled",n===0);
            if(!inc)b.text(n>1?"Pridėti kartu į krepšelį":"Pridėti abu į krepšelį");
          }
          $(document).on("change",".petshop-fbt__cb",function(){recalc($(this).closest(".petshop-fbt"));});
          $(document).on("click",".petshop-fbt__minus,.petshop-fbt__plus",function(){
            var $r=$(this).closest(".petshop-fbt__row"),s=$r.find(".petshop-fbt__q"),q=parseInt(s.text(),10)||1;
            q=$(this).hasClass("petshop-fbt__plus")?Math.min(20,q+1):Math.max(1,q-1);s.text(q);
            $r.find(".petshop-fbt__cb").prop("checked",true);recalc($(this).closest(".petshop-fbt"));
          });
          $(document).on("change input","form.cart input.qty",function(){$(".petshop-fbt").each(function(){recalc($(this));});});
          $(document).on("click","form.cart .ux-quantity__button",function(){setTimeout(function(){$(".petshop-fbt").each(function(){recalc($(this));});},50);});
          $(".petshop-fbt").each(function(){recalc($(this));});
          $(document).on("click",".petshop-fbt__add",function(){
            var $w=$(this).closest(".petshop-fbt"),comps=[],qty={};
            $w.find(".petshop-fbt__row").each(function(){var cb=$(this).find(".petshop-fbt__cb");if(!cb.prop("checked"))return;comps.push(cb.val());qty[cb.val()]=parseInt($(this).find(".petshop-fbt__q").text(),10)||1;});
            if(!comps.length)return;
            $w.addClass("is-loading");
            $.post("'. esc_js(admin_url('admin-ajax.php')) .'",{action:"petshop_fbt_add",nonce:$w.data("nonce"),main:$w.data("main"),main_qty:mainQty(),companions:comps,qty:qty})
             .done(function(res){if(res&&res.success){window.location.href=res.data.cart_url;}else{alert((res&&res.data&&res.data.msg)||"Klaida.");$w.removeClass("is-loading");}})
             .fail(function(){alert("Klaida pridedant prekes.");$w.removeClass("is-loading");});
          });
        });
        ';
        }
        if ( $is_cart ) {
            $js .= '
        jQuery(function($){
          $(document).on("click",".petshop-fbt-cart__add,.petshop-fbt-juosta__add",function(){
            var $b=$(this),$w=$b.closest("[data-nonce]"),$it=$b.closest(".petshop-fbt-cart__item,.petshop-fbt-juosta__item");
            $it.addClass("is-loading");
            $.post("'. esc_js(admin_url('admin-ajax.php')) .'",{action:"petshop_fbt_cart_add",nonce:$w.data("nonce"),cid:$b.data("cid"),anchor:$b.data("anchor"),qty:$b.data("qty")||1,vieta:$b.data("vieta")||"krepselis"})
             .done(function(res){if(res&&res.success){window.location.reload();}else{alert((res&&res.data&&res.data.msg)||"Klaida.");$it.removeClass("is-loading");}})
             .fail(function(){alert("Klaida pridedant prekę.");$it.removeClass("is-loading");});
          });
        });
        ';
        }
        // v1.6.2: modalo JS (bendras)
        $js .= '
        jQuery(function($){
          function pfbtModal(){
            var $m=$("#pfbt-modal");
            if(!$m.length){
              $m=$(\'<div id="pfbt-modal" class="pfbt-modal" style="display:none"><div class="pfbt-modal__fonas"></div><div class="pfbt-modal__langas"><button type="button" class="pfbt-modal__uzdaryti" aria-label="Uždaryti">✕</button><div class="pfbt-modal__turinys"></div></div></div>\');
              $("body").append($m);
              $m.on("click",".pfbt-modal__fonas,.pfbt-modal__uzdaryti",function(){$m.hide();});
              $(document).on("keydown",function(e){if(e.key==="Escape")$m.hide();});
            }
            return $m;
          }
          $(document).on("click",".petshop-fbt-info",function(e){
            e.preventDefault(); e.stopPropagation();
            var pid=$(this).data("pid"),$m=pfbtModal();
            $m.addClass("is-kraunasi").show(); $m.find(".pfbt-modal__turinys").empty();
            $.post("'. esc_js(admin_url('admin-ajax.php')) .'",{action:"petshop_fbt_info",pid:pid})
             .done(function(res){
               $m.removeClass("is-kraunasi");
               if(res&&res.success){
                 var d=res.data,h="";
                 h+=\'<img class="pfbt-modal__img" src="\'+d.img+\'" alt="">\';
                 h+=\'<h3 class="pfbt-modal__pav"></h3>\';
                 h+=\'<div class="pfbt-modal__kaina">\'+d.price+\'</div>\';
                 h+=\'<div class="pfbt-modal__apras">\'+d.desc+\'</div>\';
                 var $t=$m.find(".pfbt-modal__turinys").html(h);
                 $t.find(".pfbt-modal__pav").text(d.name);
               } else { $m.hide(); }
             })
             .fail(function(){ $m.removeClass("is-kraunasi").hide(); });
          });
        });
        ';
        wp_add_inline_script('jquery',$js);
    }

    /* ===================== AJAX ===================== */
    public function ajax_add() {
        check_ajax_referer('petshop_fbt_add','nonce');
        $main=isset($_POST['main'])?absint($_POST['main']):0;
        $comps=isset($_POST['companions'])?array_map('absint',(array)$_POST['companions']):[];
        if ( ! $main ) wp_send_json_error(['msg'=>'Nėra pagrindinės prekės.']);
        // v1.7.0 (P16): jei pagrindine jau krepselyje (klientas paspaude "I krepseli") — antra karta nededam
        $main_qty = isset($_POST['main_qty']) ? max( 1, min( 99, absint($_POST['main_qty']) ) ) : 1; // v1.7.1: kiekis is formos
        $qmap = ( isset($_POST['qty']) && is_array($_POST['qty']) ) ? $_POST['qty'] : [];
        if ( ! $this->main_in_cart( $main ) ) {
            if ( ! WC()->cart->add_to_cart($main,$main_qty) ) wp_send_json_error(['msg'=>'Nepavyko pridėti pagrindinės prekės.']);
        }

        // v1.4.3: patikra per is_valid_companion() — STABILI (be shuffle).
        foreach ( $comps as $cid ) {
            if ( ! $this->is_valid_companion( $main, $cid ) ) continue;
            $cp=wc_get_product($cid); if(!$cp||!$cp->is_purchasable()||!$cp->is_in_stock()) continue;
            $is_sub=class_exists('WC_Subscriptions_Product')&&WC_Subscriptions_Product::is_subscription($cp);
            $pct=$is_sub?0:$this->discount_for($cp);
            $data=[ self::CART_VIETA => 'preke' ]; // v1.7.0 (P17)
            if($pct>0){$data[self::CART_FLAG]=$pct;$data[self::CART_BASE]=(float)$cp->get_price();$data[self::CART_MAIN]=$main;}
            $q = isset($qmap[$cid]) ? max( 1, min( 20, absint($qmap[$cid]) ) ) : 1; // v1.7.1
            WC()->cart->add_to_cart($cid,$q,0,[],$data);
        }
        wp_send_json_success(['cart_url'=>wc_get_cart_url()]);
    }

    /**
     * v1.5.0: krepselio bloko "Prideti". Pilna revalidacija serverio puseje —
     * frontend'as tik siulo, sprendzia serveris (source + jautrumas + poros).
     * v1.7.0: maisto anchor — tik tai, ka rodo maisto logika; kitiems — rankinis irgi filtruojamas
     * sandeliu (K4); nuolaidos krepselyje NERA (K2); eilute pazymima vieta=krepselis (P17).
     */
    public function ajax_cart_add() {
        check_ajax_referer('petshop_fbt_cart','nonce');
        $cid    = isset($_POST['cid'])    ? absint($_POST['cid'])    : 0;
        $anchor = isset($_POST['anchor']) ? absint($_POST['anchor']) : 0;
        if ( ! $cid || ! $anchor || ! function_exists('WC') || ! WC()->cart ) wp_send_json_error(['msg'=>'Klaida.']);
        $cart = WC()->cart;
        if ( $cart->is_empty() ) wp_send_json_error(['msg'=>'Krepšelis tuščias.']);
        if ( ! $this->main_in_cart($anchor,$cart) ) wp_send_json_error(['msg'=>'Susijusi prekė nebe krepšelyje.']);

        $in_cart = []; $anchor_qty = 1; $food_lines = [];
        foreach ( $cart->get_cart() as $i ) {
            $pid = (int) ( $i['product_id'] ?? 0 ); if ( ! $pid ) continue;
            $in_cart[] = $pid;
            if ( $pid === $anchor ) $anchor_qty = max( $anchor_qty, (int) ( $i['quantity'] ?? 1 ) );
            if ( $this->food_species( $pid ) ) $food_lines[] = $pid;
        }

        if ( $this->food_species( $anchor ) ) {
            $fo = $this->food_offer( $anchor, $anchor_qty, $in_cart );
            if ( ! in_array( $cid, $fo['ids'], true ) ) wp_send_json_error(['msg'=>'Pasiūlymas nebegalioja.']);
        } else {
            // Rysys: rankinis / co-purchase / kategoriju pora nuo anchor prekes
            $manual = in_array( $cid, $this->manual_companion_ids($anchor), true );
            $copur  = in_array( $cid, $this->copurchase_ids($anchor), true );
            $catok  = (bool) array_intersect( $this->product_cat_slugs($cid), $this->companion_cat_slugs($anchor) );
            if ( ! $manual && ! $copur && ! $catok ) wp_send_json_error(['msg'=>'Netinkama prekė.']);
            // Source: ∈ krepselio sources (v1.7.0: ir rankiniam)
            $sources = $this->cart_sources( $cart );
            $src = $this->source_of( $cid, 1 );
            if ( empty($sources) || $src === null || ! isset( $sources[ $src ] ) ) {
                wp_send_json_error(['msg'=>'Prekė iš kito sandėlio — pasiūlymas nebegalioja.']);
            }
            if ( ! $this->sensitivity_ok( $this->ctx_for_cart( $cart ), $cid ) ) {
                wp_send_json_error(['msg'=>'Prekė netinka prie krepšelio maisto.']);
            }
        }
        foreach ( $food_lines as $fp ) {
            if ( $fp === $anchor ) continue;
            if ( ! $this->treat_ok_for_food( $cid, $fp ) ) wp_send_json_error(['msg'=>'Prekė netinka prie krepšelio maisto.']);
        }

        $cp = wc_get_product( $cid );
        if ( ! $cp || ! $cp->is_purchasable() || ! $cp->is_in_stock() ) wp_send_json_error(['msg'=>'Prekės nebėra.']);

        $vieta = ( isset($_POST['vieta']) && $_POST['vieta'] === 'juosta' ) ? 'juosta' : 'krepselis'; // v1.7.2
        $qty   = isset($_POST['qty']) ? max( 1, min( self::JUOSTA_MAX_VNT, absint($_POST['qty']) ) ) : 1;
        $data = [ self::CART_VIETA => $vieta ]; // v1.7.0: be nuolaidos (K2), zyme (P17)
        if ( ! $cart->add_to_cart( $cid, $qty, 0, [], $data ) ) wp_send_json_error(['msg'=>'Nepavyko pridėti.']);
        wp_send_json_success(['reload'=>1]);
    }

    /**
     * v1.6.2: prekes info modalui (vieša produkto informacija, be nonce).
     */
    public function ajax_info() {
        $pid = isset($_POST['pid']) ? absint($_POST['pid']) : 0;
        $p = $pid ? wc_get_product( $pid ) : null;
        if ( ! $p || $p->get_status() !== 'publish' ) wp_send_json_error(['msg'=>'Prekė nerasta.']);
        $img = $p->get_image_id() ? wp_get_attachment_image_url( $p->get_image_id(), 'large' ) : wc_placeholder_img_src( 'large' );
        $desc = $p->get_short_description();
        if ( ! $desc ) $desc = wp_trim_words( wp_strip_all_tags( $p->get_description() ), 70 );
        wp_send_json_success([
            'name'  => $p->get_name(),
            'img'   => $img,
            'price' => $p->get_price_html(),
            'desc'  => wp_kses_post( wpautop( $desc ) ),
            'url'   => get_permalink( $pid ),
        ]);
    }

    /* ===================== KREPŠELIS: NUOLAIDA ===================== */
    private function main_in_cart( $main_id, $cart = null ) {
        $cart = $cart ?: ( WC()->cart ?? null );
        if ( ! $cart ) return false;
        foreach ( $cart->get_cart() as $i ) {
            if ( (int)$i['product_id']===(int)$main_id || (int)$i['variation_id']===(int)$main_id ) return true;
        }
        return false;
    }

    public function apply_discount( $cart ) {
        if ( is_admin() && ! defined('DOING_AJAX') ) return;
        foreach ( $cart->get_cart() as $item ) {
            if ( empty($item[self::CART_FLAG]) ) continue;
            // Nuolaida galioja tik kol krepšelyje yra pagrindinė prekė
            $main = isset($item[self::CART_MAIN]) ? (int)$item[self::CART_MAIN] : 0;
            if ( $main && ! $this->main_in_cart($main,$cart) ) continue; // pašalinta -> normali kaina
            $pct=(float)$item[self::CART_FLAG];
            $base=isset($item[self::CART_BASE])?(float)$item[self::CART_BASE]:(float)$item['data']->get_price();
            if ( $pct<=0||$base<=0 ) continue;

            // v1.4.1: nuolaida taikoma max 3 vnt. vienam kompanionui.
            $qty = (int) $item['quantity'];
            $max_discounted_qty = 3;
            if ( $qty <= $max_discounted_qty ) {
                $item['data']->set_price( round( $base * ( 1 - $pct / 100 ), 2 ) );
            } else {
                $discounted_total = $max_discounted_qty * $base * ( 1 - $pct / 100 );
                $full_total       = ( $qty - $max_discounted_qty ) * $base;
                $effective        = ( $discounted_total + $full_total ) / $qty;
                $item['data']->set_price( round( $effective, 2 ) );
            }
        }
    }
    public function cart_item_label( $data, $item ) {
        // 1) FBT pridėtos prekės su FBT nuolaida → "Perkant kartu: −X% nuolaida"
        if ( ! empty($item[self::CART_FLAG]) ) {
            $main = isset($item[self::CART_MAIN]) ? (int)$item[self::CART_MAIN] : 0;
            if ( $main && ! $this->main_in_cart($main) ) return $data; // nerodom nuolaidos, jei pagrindinės nebėra
            $pct=$this->fmt_pct($item[self::CART_FLAG]);
            // v1.4.1: jei qty > 3, parodom kad nuolaida taikoma tik 3 vnt.
            $qty = (int) $item['quantity'];
            if ( $qty > 3 ) {
                $data[]=['name'=>'Perkant kartu','value'=>'−'.$pct.'% (taikoma 3 iš '.$qty.' vnt.)'];
            } else {
                $data[]=['name'=>'Perkant kartu','value'=>'−'.$pct.'% nuolaida'];
            }
            return $data;
        }
        // 2) v1.4.0 — Akcijinės prekės (ne per FBT) → "Akcija: −X%"
        $product = isset($item['data']) ? $item['data'] : null;
        if ( $product && is_a($product, 'WC_Product') && $product->is_on_sale() ) {
            $regular = (float) $product->get_regular_price();
            $sale    = (float) $product->get_price();
            if ( $regular > 0 && $sale < $regular ) {
                $pct = (int) round( ( $regular - $sale ) / $regular * 100 );
                if ( $pct > 0 ) {
                    $data[] = ['name' => 'Akcija', 'value' => '−' . $pct . '%'];
                }
            }
        }
        return $data;
    }
    /** v1.7.0 (P17): uzsakymo eilutes zyme _ps_fbt = preke|krepselis|uzrasas. */
    public function order_line_mark( $item, $cart_item_key, $values, $order ) {
        $v = '';
        if ( ! empty( $values[ self::CART_VIETA ] ) ) $v = sanitize_key( $values[ self::CART_VIETA ] );
        elseif ( ! empty( $values[ self::CART_FLAG ] ) ) $v = 'preke'; // senos (iki v1.7) FBT eilutes krepselyje
        if ( in_array( $v, [ 'preke', 'krepselis', 'uzrasas', 'juosta' ], true ) ) $item->add_meta_data( self::META_VIETA, $v, true );
    }

    public function restore_cart_item( $item, $values ) {
        if ( isset($values[self::CART_VIETA]) ) $item[self::CART_VIETA]=$values[self::CART_VIETA]; // v1.7.0
        if ( isset($values[self::CART_FLAG]) ) $item[self::CART_FLAG]=$values[self::CART_FLAG];
        if ( isset($values[self::CART_BASE]) ) $item[self::CART_BASE]=$values[self::CART_BASE];
        if ( isset($values[self::CART_MAIN]) ) $item[self::CART_MAIN]=$values[self::CART_MAIN];
        return $item;
    }
}
new Petshop_FBT();
