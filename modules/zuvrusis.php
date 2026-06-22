<?php
/**
 * Petshop Attr Modulis: Zuvies Rusis v1.0 (multi-tag parseris + dry/apply)
 *
 * Asis: pa_zuvies_rusis (NAUJA taksonomija, multi-value).
 * Schema: Ciklidines, Diskusines, Auksines, Tropines, Dugnines zuvys, Vezliai.
 *
 * Kategorija: akvariumo-zuvyciu-maistas (cat 94).
 * Endpoint: ?petshop_attr_zuvrusis=dry|apply&confirm=APPLY&k=ps2026
 * REPLACE: pries apply isvalo pa_zuvies_rusis. ASCII komentarai, hex terminai.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function petshop_zuvrusis_norm( $s ) {
    $s = function_exists( 'mb_strtolower' ) ? mb_strtolower( $s, 'UTF-8' ) : strtolower( $s );
    $s = str_replace( "\xC2\xA0", ' ', $s );
    $lt = array( "\xC4\x85","\xC4\x8D","\xC4\x99","\xC4\x97","\xC4\xAF","\xC5\xA1","\xC5\xB3","\xC5\xAB","\xC5\xBE" );
    $en = array( 'a','c','e','e','i','s','u','u','z' );
    $s = str_replace( $lt, $en, $s );
    return ' ' . preg_replace( '/\s+/u', ' ', $s ) . ' ';
}

function petshop_zuvrusis_species( $hay ) {
    /* $hay - normalizuotas (ASCII, su tarpais). Prioritetai svarbus (algae pries tropical). */
    $out = array();
    /* 1) Vezliai (turtle) - isskirtinai */
    if ( strpos( $hay, 'turtle' ) !== false || strpos( $hay, 'vezl' ) !== false ) {
        $out[] = "V\xC4\x97\xC5\xBEliai"; /* Vezliai */
        return $out;
    }
    /* 2) Dugnines (algae wafers, plekostomai) - pries tropical, nes "Tropical Algae" = dugnine */
    if ( strpos( $hay, 'algae' ) !== false || strpos( $hay, 'plecostomus' ) !== false || strpos( $hay, 'dugnin' ) !== false ) {
        $out[] = "Dugnin\xC4\x97s \xC5\xBEuvys"; /* Dugnines zuvys */
        return $out;
    }
    /* 3) Diskusines */
    if ( strpos( $hay, 'discus' ) !== false || strpos( $hay, 'diskus' ) !== false ) {
        $out[] = "Diskusin\xC4\x97s \xC5\xBEuvys"; /* Diskusines zuvys */
    }
    /* 4) Ciklidines (cichlid + blood-red parrot) */
    if ( strpos( $hay, 'cichlid' ) !== false || strpos( $hay, 'ciklid' ) !== false || strpos( $hay, 'blood-red parrot' ) !== false ) {
        $out[] = "Ciklidin\xC4\x97s \xC5\xBEuvys"; /* Ciklidines zuvys */
    }
    /* 5) Auksines (goldfish, oranda) */
    if ( strpos( $hay, 'goldfish' ) !== false || strpos( $hay, 'oranda' ) !== false || strpos( $hay, 'auksin' ) !== false ) {
        $out[] = "Auksin\xC4\x97s \xC5\xBEuvys"; /* Auksines zuvys */
    }
    /* 6) Tropines (tropical, betta, guppy, vibra, micro) - jei dar nieko nepriskirta */
    if ( empty( $out ) ) {
        if ( strpos( $hay, 'tropical' ) !== false || strpos( $hay, 'tropin' ) !== false
            || strpos( $hay, 'betta' ) !== false || strpos( $hay, 'guppy' ) !== false
            || strpos( $hay, 'vibra' ) !== false || strpos( $hay, 'micro' ) !== false ) {
            $out[] = "Tropin\xC4\x97s \xC5\xBEuvys"; /* Tropines zuvys */
        }
    }
    return array_values( array_unique( $out ) );
}

function petshop_zuvrusis_parser( $pid, $ctx ) {
    $hay     = petshop_zuvrusis_norm( get_the_title( $pid ) );
    $species = petshop_zuvrusis_species( $hay );
    if ( empty( $species ) ) { return 'review'; }
    return array( 'pa_zuvies_rusis' => $species );
}

add_filter( 'petshop_attr_parsers', function ( $p ) {
    $p['akvariumo-zuvyciu-maistas'] = 'petshop_zuvrusis_parser';
    return $p;
} );

add_action( 'init', function () {
    if ( empty( $_GET['petshop_attr_zuvrusis'] ) ) { return; }
    $ps_tok_ok = ( isset( $_GET['k'] ) && $_GET['k'] === 'ps2026' );
    if ( ! current_user_can( 'manage_options' ) && ! $ps_tok_ok ) { return; }
    if ( ! function_exists( 'petshop_attr_apply' ) ) { wp_die( 'Engine pluginas neaktyvus.' ); }

    $mode     = sanitize_text_field( wp_unslash( $_GET['petshop_attr_zuvrusis'] ) );
    $do_write = ( $mode === 'apply' && isset( $_GET['confirm'] ) && $_GET['confirm'] === 'APPLY' );
    $dry_run  = ! $do_write;

    $q = new WP_Query( array(
        'post_type'      => 'product',
        'post_status'    => array( 'publish', 'draft' ),
        'posts_per_page' => -1,
        'fields'         => 'ids',
        'no_found_rows'  => true,
        'tax_query'      => array( array(
            'taxonomy' => 'product_cat', 'field' => 'slug', 'terms' => array( 'akvariumo-zuvyciu-maistas' ),
        ) ),
    ) );

    $rows = array();
    $cnt  = array( 'parsed' => 0, 'review' => 0 );

    foreach ( $q->posts as $pid ) {
        $name = get_the_title( $pid );
        $res  = petshop_zuvrusis_parser( $pid, array() );
        if ( $res === 'review' ) { $cnt['review']++; $rows[] = array( $pid, $name, 'REVIEW', '' ); continue; }
        if ( $do_write ) { wp_set_object_terms( $pid, array(), 'pa_zuvies_rusis', false ); }
        $applied = petshop_attr_apply( $pid, $res, $dry_run );
        $cnt['parsed']++;
        if ( $do_write ) {
            update_post_meta( $pid, '_petshop_attr_parse_status', 'parsed' );
            update_post_meta( $pid, '_petshop_attr_parser_type', 'akvariumo-zuvyciu-maistas' );
        }
        $rows[] = array( $pid, $name, 'PARSED', implode( ' | ', $applied ) );
    }

    header( 'Content-Type: text/html; charset=utf-8' );
    echo '<!doctype html><meta charset="utf-8"><style>body{font:13px system-ui,Arial;margin:24px}table{border-collapse:collapse;margin-top:10px;width:100%;max-width:1100px}td,th{border:1px solid #ddd;padding:4px 8px;text-align:left}th{background:#f4f4f2}.p{color:#0f6e56}.r{background:#fff6e5}</style>';
    echo '<h2>Zuv_ies Rusis v1.0 &mdash; ' . ( $do_write ? 'APPLY' : 'DRY-RUN' ) . '</h2>';
    echo '<p>Viso: <b>' . count( $rows ) . '</b> &middot; PARSED: <b>' . $cnt['parsed'] . '</b> &middot; REVIEW: <b>' . $cnt['review'] . '</b></p>';
    echo '<table><tr><th>ID</th><th>Pavadinimas</th><th>Busena</th><th>Zuv_ies rusis</th></tr>';
    foreach ( $rows as $r ) {
        $cls = $r[2] === 'PARSED' ? 'p' : 'r';
        echo '<tr><td>' . (int) $r[0] . '</td><td>' . esc_html( $r[1] ) . '</td><td class="' . $cls . '">' . esc_html( $r[2] ) . '</td><td>' . esc_html( $r[3] ) . '</td></tr>';
    }
    echo '</table>';
    exit;
}, 20 );
