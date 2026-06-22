<?php
/**
 * Petshop Attr Modulis: Paukscio Rusis v1.2 (multi-tag parseris + dry/apply)
 *
 * Asis: pa_paukscio_rusis (NAUJA taksonomija, multi-value).
 * Konsoliduota schema (NEskaidyta pagal dydi):
 *   Papugos (visos), Banguotosios papugeles, Kanareles ir amadinai, Visiems pauksciams.
 *
 * Kategorija: lesalas-pauksciams (cat 90).
 * Endpoint: ?petshop_attr_pauksrusis=dry|apply&confirm=APPLY&k=ps2026
 * REPLACE: pries apply isvalo pa_paukscio_rusis. ASCII komentarai, hex terminai.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function petshop_pauksrusis_norm( $s ) {
    $s = function_exists( 'mb_strtolower' ) ? mb_strtolower( $s, 'UTF-8' ) : strtolower( $s );
    $s = str_replace( "\xC2\xA0", ' ', $s );
    $lt = array( "\xC4\x85","\xC4\x8D","\xC4\x99","\xC4\x97","\xC4\xAF","\xC5\xA1","\xC5\xB3","\xC5\xAB","\xC5\xBE" );
    $en = array( 'a','c','e','e','i','s','u','u','z' );
    $s = str_replace( $lt, $en, $s );
    return ' ' . preg_replace( '/\s+/u', ' ', $s ) . ' ';
}

function petshop_pauksrusis_species( $hay ) {
    /* $hay - normalizuotas (ASCII, su tarpais) */
    $out = array();
    $is_bang = ( strpos( $hay, 'bang' ) !== false );
    if ( $is_bang ) { $out[] = "Banguotosios pap\xC5\xABg\xC4\x97l\xC4\x97s"; } /* Banguotosios papugeles */
    /* Papugos: jei papug/nimfa IR ne banguotos kontekstas */
    if ( ! $is_bang && ( strpos( $hay, 'papug' ) !== false || strpos( $hay, 'nimf' ) !== false || strpos( $hay, 'sauleg' ) !== false ) ) {
        $out[] = "Pap\xC5\xABgos"; /* Papugos (+ sauleg - saulegrazos prie papugu) */
    }
    /* Kanareles ir amadinai (+ tropiniai/egzotiniai giesmininkai) */
    if ( strpos( $hay, 'kanarel' ) !== false || strpos( $hay, 'amadin' ) !== false
        || strpos( $hay, 'tropin' ) !== false || strpos( $hay, 'egzotik' ) !== false ) {
        $out[] = "Kanar\xC4\x97l\xC4\x97s ir amadinai"; /* Kanareles ir amadinai */
    }
    $out = array_values( array_unique( $out ) );
    return $out;
}

function petshop_pauksrusis_parser( $pid, $ctx ) {
    $hay     = petshop_pauksrusis_norm( get_the_title( $pid ) );
    $species = petshop_pauksrusis_species( $hay );
    if ( empty( $species ) ) { return 'review'; }
    return array( 'pa_paukscio_rusis' => $species );
}

add_filter( 'petshop_attr_parsers', function ( $p ) {
    $p['lesalas-pauksciams'] = 'petshop_pauksrusis_parser';
    return $p;
} );

add_action( 'init', function () {
    if ( empty( $_GET['petshop_attr_pauksrusis'] ) ) { return; }
    $ps_tok_ok = ( isset( $_GET['k'] ) && $_GET['k'] === 'ps2026' );
    if ( ! current_user_can( 'manage_options' ) && ! $ps_tok_ok ) { return; }
    if ( ! function_exists( 'petshop_attr_apply' ) ) { wp_die( 'Engine pluginas neaktyvus.' ); }

    $mode     = sanitize_text_field( wp_unslash( $_GET['petshop_attr_pauksrusis'] ) );
    $do_write = ( $mode === 'apply' && isset( $_GET['confirm'] ) && $_GET['confirm'] === 'APPLY' );
    $dry_run  = ! $do_write;

    $q = new WP_Query( array(
        'post_type'      => 'product',
        'post_status'    => array( 'publish', 'draft' ),
        'posts_per_page' => -1,
        'fields'         => 'ids',
        'no_found_rows'  => true,
        'tax_query'      => array( array(
            'taxonomy' => 'product_cat', 'field' => 'slug', 'terms' => array( 'lesalas-pauksciams' ),
        ) ),
    ) );

    $rows = array();
    $cnt  = array( 'parsed' => 0, 'review' => 0 );

    foreach ( $q->posts as $pid ) {
        $name = get_the_title( $pid );
        $res  = petshop_pauksrusis_parser( $pid, array() );
        if ( $res === 'review' ) { $cnt['review']++; $rows[] = array( $pid, $name, 'REVIEW', '' ); continue; }
        if ( $do_write ) { wp_set_object_terms( $pid, array(), 'pa_paukscio_rusis', false ); }
        $applied = petshop_attr_apply( $pid, $res, $dry_run );
        $cnt['parsed']++;
        if ( $do_write ) {
            update_post_meta( $pid, '_petshop_attr_parse_status', 'parsed' );
            update_post_meta( $pid, '_petshop_attr_parser_type', 'lesalas-pauksciams' );
        }
        $rows[] = array( $pid, $name, 'PARSED', implode( ' | ', $applied ) );
    }

    header( 'Content-Type: text/html; charset=utf-8' );
    echo '<!doctype html><meta charset="utf-8"><style>body{font:13px system-ui,Arial;margin:24px}table{border-collapse:collapse;margin-top:10px;width:100%;max-width:1100px}td,th{border:1px solid #ddd;padding:4px 8px;text-align:left}th{background:#f4f4f2}.p{color:#0f6e56}.r{background:#fff6e5}</style>';
    echo '<h2>Pau_kscio Rusis v1.2 &mdash; ' . ( $do_write ? 'APPLY' : 'DRY-RUN' ) . '</h2>';
    echo '<p>Viso: <b>' . count( $rows ) . '</b> &middot; PARSED: <b>' . $cnt['parsed'] . '</b> &middot; REVIEW: <b>' . $cnt['review'] . '</b></p>';
    echo '<table><tr><th>ID</th><th>Pavadinimas</th><th>Busena</th><th>Pauks_cio rusis</th></tr>';
    foreach ( $rows as $r ) {
        $cls = $r[2] === 'PARSED' ? 'p' : 'r';
        echo '<tr><td>' . (int) $r[0] . '</td><td>' . esc_html( $r[1] ) . '</td><td class="' . $cls . '">' . esc_html( $r[2] ) . '</td><td>' . esc_html( $r[3] ) . '</td></tr>';
    }
    echo '</table>';
    exit;
}, 20 );
