<?php
/**
 * Petshop Attr Modulis: Pasaro Forma v1.0 (parseris + dry/apply)
 *
 * Asis: pa_pasaro_forma (NAUJA taksonomija).
 * Schema: Granules, Vafliai, Lazdeles.
 * Logika: wafers->Vafliai; sticks/vibra/bites->Lazdeles; visa kita (Hikari pellet) -> Granules.
 *
 * Kategorija: akvariumo-zuvyciu-maistas (cat 94).
 * Endpoint: ?petshop_attr_pasforma=dry|apply&confirm=APPLY&k=ps2026
 * REPLACE: pries apply isvalo pa_pasaro_forma. ASCII komentarai, hex terminai.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function petshop_pasforma_norm( $s ) {
    $s = function_exists( 'mb_strtolower' ) ? mb_strtolower( $s, 'UTF-8' ) : strtolower( $s );
    $s = str_replace( "\xC2\xA0", ' ', $s );
    $lt = array( "\xC4\x85","\xC4\x8D","\xC4\x99","\xC4\x97","\xC4\xAF","\xC5\xA1","\xC5\xB3","\xC5\xAB","\xC5\xBE" );
    $en = array( 'a','c','e','e','i','s','u','u','z' );
    $s = str_replace( $lt, $en, $s );
    return ' ' . preg_replace( '/\s+/u', ' ', $s ) . ' ';
}

function petshop_pasforma_value( $hay ) {
    /* $hay - normalizuotas (ASCII). Viena reiksme prekei. */
    if ( strpos( $hay, 'wafers' ) !== false || strpos( $hay, 'vafl' ) !== false ) {
        return "Vafliai"; /* Vafliai */
    }
    if ( strpos( $hay, 'sticks' ) !== false || strpos( $hay, 'stics' ) !== false
        || strpos( $hay, 'lazdel' ) !== false || strpos( $hay, 'vibra' ) !== false
        || strpos( $hay, 'bites' ) !== false ) {
        return "Lazdel\xC4\x97s"; /* Lazdeles */
    }
    /* Hikari numatytasis - granules/pellet */
    return "Granul\xC4\x97s"; /* Granules */
}

function petshop_pasforma_parser( $pid, $ctx ) {
    $hay = petshop_pasforma_norm( get_the_title( $pid ) );
    $val = petshop_pasforma_value( $hay );
    if ( empty( $val ) ) { return 'review'; }
    return array( 'pa_pasaro_forma' => array( $val ) );
}

add_filter( 'petshop_attr_parsers', function ( $p ) {
    $p['akvariumo-zuvyciu-maistas-forma'] = 'petshop_pasforma_parser';
    return $p;
} );

add_action( 'init', function () {
    if ( empty( $_GET['petshop_attr_pasforma'] ) ) { return; }
    $ps_tok_ok = ( isset( $_GET['k'] ) && $_GET['k'] === 'ps2026' );
    if ( ! current_user_can( 'manage_options' ) && ! $ps_tok_ok ) { return; }
    if ( ! function_exists( 'petshop_attr_apply' ) ) { wp_die( 'Engine pluginas neaktyvus.' ); }

    $mode     = sanitize_text_field( wp_unslash( $_GET['petshop_attr_pasforma'] ) );
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
        $res  = petshop_pasforma_parser( $pid, array() );
        if ( $res === 'review' ) { $cnt['review']++; $rows[] = array( $pid, $name, 'REVIEW', '' ); continue; }
        if ( $do_write ) { wp_set_object_terms( $pid, array(), 'pa_pasaro_forma', false ); }
        $applied = petshop_attr_apply( $pid, $res, $dry_run );
        $cnt['parsed']++;
        if ( $do_write ) {
            update_post_meta( $pid, '_petshop_attr_parse_status', 'parsed' );
            update_post_meta( $pid, '_petshop_attr_parser_type', 'akvariumo-forma' );
        }
        $rows[] = array( $pid, $name, 'PARSED', implode( ' | ', $applied ) );
    }

    header( 'Content-Type: text/html; charset=utf-8' );
    echo '<!doctype html><meta charset="utf-8"><style>body{font:13px system-ui,Arial;margin:24px}table{border-collapse:collapse;margin-top:10px;width:100%;max-width:1100px}td,th{border:1px solid #ddd;padding:4px 8px;text-align:left}th{background:#f4f4f2}.p{color:#0f6e56}.r{background:#fff6e5}</style>';
    echo '<h2>Pas_aro Forma v1.0 &mdash; ' . ( $do_write ? 'APPLY' : 'DRY-RUN' ) . '</h2>';
    echo '<p>Viso: <b>' . count( $rows ) . '</b> &middot; PARSED: <b>' . $cnt['parsed'] . '</b> &middot; REVIEW: <b>' . $cnt['review'] . '</b></p>';
    echo '<table><tr><th>ID</th><th>Pavadinimas</th><th>Busena</th><th>Pas_aro forma</th></tr>';
    foreach ( $rows as $r ) {
        $cls = $r[2] === 'PARSED' ? 'p' : 'r';
        echo '<tr><td>' . (int) $r[0] . '</td><td>' . esc_html( $r[1] ) . '</td><td class="' . $cls . '">' . esc_html( $r[2] ) . '</td><td>' . esc_html( $r[3] ) . '</td></tr>';
    }
    echo '</table>';
    exit;
}, 20 );
