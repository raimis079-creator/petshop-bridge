<?php
/**
 * Petshop Attr Modulis: Grauziko Rusis v1.0 (multi-tag parseris + dry/apply)
 *
 * Asis: pa_grauziko_rusis (NAUJA taksonomija, multi-value).
 * Rusys is pavadinimo (Zoomalia schema): Triusis, Juru kiaulyte, Sinsila,
 * Ziurkenas, Ziurke ir pele, Smiltpele, Vovere; bendri -> Visiems grauzikams.
 *
 * Kategorija: pasaras-grauzikams (cat 88).
 * Endpoint: ?petshop_attr_grauzrusis=dry|apply&confirm=APPLY&k=ps2026
 * REPLACE: pries apply isvalo pa_grauziko_rusis. ASCII komentarai, hex terminai.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function petshop_grauzrusis_norm( $s ) {
    $s = function_exists( 'mb_strtolower' ) ? mb_strtolower( $s, 'UTF-8' ) : strtolower( $s );
    $s = str_replace( "\xC2\xA0", ' ', $s );
    $lt = array( "\xC4\x85","\xC4\x8D","\xC4\x99","\xC4\x97","\xC4\xAF","\xC5\xA1","\xC5\xB3","\xC5\xAB","\xC5\xBE" );
    $en = array( 'a','c','e','e','i','s','u','u','z' );
    $s = str_replace( $lt, $en, $s );
    return ' ' . preg_replace( '/\s+/u', ' ', $s ) . ' ';
}

function petshop_grauzrusis_species( $hay ) {
    /* $hay - normalizuotas (ASCII, su tarpais pradzioj/gale) */
    $out = array();
    if ( strpos( $hay, 'kiaulyt' ) !== false ) { $out[] = "J\xC5\xABr\xC5\xB3 kiaulyt\xC4\x97"; } /* Juru kiaulyte */
    if ( strpos( $hay, 'sinsil' ) !== false ) { $out[] = "\xC5\xA0in\xC5\xA1ila"; }            /* Sinsila */
    if ( strpos( $hay, 'trius' ) !== false ) { $out[] = "Triu\xC5\xA1is"; }                    /* Triusis */
    if ( strpos( $hay, 'ziurken' ) !== false ) { $out[] = "\xC5\xBDiurk\xC4\x97nas"; }          /* Ziurkenas */
    if ( strpos( $hay, 'smiltpel' ) !== false ) { $out[] = "Smiltpel\xC4\x97"; }               /* Smiltpele */
    if ( strpos( $hay, 'vover' ) !== false ) { $out[] = "Vover\xC4\x97"; }                      /* Vovere */
    /* zurke (rat) / pele (mouse): tik su tarpu pries, kad nepagautu "smiltpelems" ar "ziurkenams" */
    if ( strpos( $hay, ' ziurkem' ) !== false || strpos( $hay, ' ziurkei' ) !== false
        || strpos( $hay, ' ziurkes ' ) !== false || strpos( $hay, ' pelem' ) !== false
        || strpos( $hay, ' pelei' ) !== false || strpos( $hay, ' peles ' ) !== false ) {
        $out[] = "\xC5\xBDiurk\xC4\x97 ir pel\xC4\x97"; /* Ziurke ir pele */
    }
    $out = array_values( array_unique( $out ) );
    if ( empty( $out ) ) {
        if ( strpos( $hay, 'grauzik' ) !== false || strpos( $hay, 'rodent' ) !== false ) {
            $out[] = "Visiems grau\xC5\xBEikams"; /* Visiems grauzikams */
        }
    }
    return $out;
}

function petshop_grauzrusis_parser( $pid, $ctx ) {
    $hay     = petshop_grauzrusis_norm( get_the_title( $pid ) );
    $species = petshop_grauzrusis_species( $hay );
    if ( empty( $species ) ) { return 'review'; }
    return array( 'pa_grauziko_rusis' => $species );
}

add_filter( 'petshop_attr_parsers', function ( $p ) {
    $p['pasaras-grauzikams'] = 'petshop_grauzrusis_parser';
    return $p;
} );

add_action( 'init', function () {
    if ( empty( $_GET['petshop_attr_grauzrusis'] ) ) { return; }
    $ps_tok_ok = ( isset( $_GET['k'] ) && $_GET['k'] === 'ps2026' );
    if ( ! current_user_can( 'manage_options' ) && ! $ps_tok_ok ) { return; }
    if ( ! function_exists( 'petshop_attr_apply' ) ) { wp_die( 'Engine pluginas neaktyvus.' ); }

    $mode     = sanitize_text_field( wp_unslash( $_GET['petshop_attr_grauzrusis'] ) );
    $do_write = ( $mode === 'apply' && isset( $_GET['confirm'] ) && $_GET['confirm'] === 'APPLY' );
    $dry_run  = ! $do_write;

    $q = new WP_Query( array(
        'post_type'      => 'product',
        'post_status'    => array( 'publish', 'draft' ),
        'posts_per_page' => -1,
        'fields'         => 'ids',
        'no_found_rows'  => true,
        'tax_query'      => array( array(
            'taxonomy' => 'product_cat', 'field' => 'slug', 'terms' => array( 'pasaras-grauzikams' ),
        ) ),
    ) );

    $rows = array();
    $cnt  = array( 'parsed' => 0, 'review' => 0 );

    foreach ( $q->posts as $pid ) {
        $name = get_the_title( $pid );
        $res  = petshop_grauzrusis_parser( $pid, array() );
        if ( $res === 'review' ) { $cnt['review']++; $rows[] = array( $pid, $name, 'REVIEW', '' ); continue; }
        if ( $do_write ) { wp_set_object_terms( $pid, array(), 'pa_grauziko_rusis', false ); }
        $applied = petshop_attr_apply( $pid, $res, $dry_run );
        $cnt['parsed']++;
        if ( $do_write ) {
            update_post_meta( $pid, '_petshop_attr_parse_status', 'parsed' );
            update_post_meta( $pid, '_petshop_attr_parser_type', 'pasaras-grauzikams' );
        }
        $rows[] = array( $pid, $name, 'PARSED', implode( ' | ', $applied ) );
    }

    header( 'Content-Type: text/html; charset=utf-8' );
    echo '<!doctype html><meta charset="utf-8"><style>body{font:13px system-ui,Arial;margin:24px}table{border-collapse:collapse;margin-top:10px;width:100%;max-width:1100px}td,th{border:1px solid #ddd;padding:4px 8px;text-align:left}th{background:#f4f4f2}.p{color:#0f6e56}.r{background:#fff6e5}</style>';
    echo '<h2>Grauziko Rusis v1.0 &mdash; ' . ( $do_write ? 'APPLY' : 'DRY-RUN' ) . '</h2>';
    echo '<p>Viso: <b>' . count( $rows ) . '</b> &middot; PARSED: <b>' . $cnt['parsed'] . '</b> &middot; REVIEW: <b>' . $cnt['review'] . '</b></p>';
    echo '<table><tr><th>ID</th><th>Pavadinimas</th><th>Busena</th><th>Grauziko rusis</th></tr>';
    foreach ( $rows as $r ) {
        $cls = $r[2] === 'PARSED' ? 'p' : 'r';
        echo '<tr><td>' . (int) $r[0] . '</td><td>' . esc_html( $r[1] ) . '</td><td class="' . $cls . '">' . esc_html( $r[2] ) . '</td><td>' . esc_html( $r[3] ) . '</td></tr>';
    }
    echo '</table>';
    exit;
}, 20 );
