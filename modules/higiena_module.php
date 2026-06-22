<?php
/**
 * Petshop Attr Modulis: Higienos Priemones Sunims v1.0 (parseris + dry/apply)
 *
 * Asis: pa_tipas (ESAMA taksonomija, single). Terminai scope per kategorija.
 * Tipai (LT konkurentu logika - higienos/prieziuros skirstymas):
 *   Vienkartines palutes, Demiu ir kvapu valikliai, Dantu prieziura,
 *   Ausu prieziura, Peduciu prieziura, Maiseliai ir semtuveliai,
 *   Atgrasinimo priemones, Tualetai ir kilimeliai
 *
 * NE higienos prekes (vesinamieji kilimeliai, fontanai, baseinas, papildai,
 * sampunai, itvarai, zaizdu tepalai) -> review (perkeliamos atskirai).
 *
 * Endpoint: ?petshop_attr_higiena=dry|apply&confirm=APPLY&k=ps2026
 * REPLACE: pries apply isvalo pa_tipas. ASCII komentarai, hex terminai.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function petshop_attr_higiena_norm( $s ) {
    $s = function_exists( 'mb_strtolower' ) ? mb_strtolower( $s, 'UTF-8' ) : strtolower( $s );
    $s = str_replace( "\xC2\xA0", ' ', $s );
    $lt = array( "\xC4\x85","\xC4\x8D","\xC4\x99","\xC4\x97","\xC4\xAF","\xC5\xA1","\xC5\xB3","\xC5\xAB","\xC5\xBE" );
    $en = array( 'a','c','e','e','i','s','u','u','z' );
    $s = str_replace( $lt, $en, $s );
    return ' ' . preg_replace( '/\s+/u', ' ', $s ) . ' ';
}

function petshop_attr_higiena_tipas( $hay ) {
    /* NE higiena -> review (perkeliama) */
    if ( strpos( $hay, 'vesinam' ) !== false || strpos( $hay, 'vesinant' ) !== false
        || strpos( $hay, 'fontan' ) !== false || strpos( $hay, 'baseinas' ) !== false
        || strpos( $hay, 'papildas' ) !== false || strpos( $hay, 'joints' ) !== false
        || strpos( $hay, 'bones' ) !== false || strpos( $hay, 'kelpa' ) !== false
        || strpos( $hay, 'sampunas' ) !== false || strpos( $hay, 'kondicionierius' ) !== false
        || strpos( $hay, 'itvaras' ) !== false || strpos( $hay, 'zaizdom' ) !== false ) {
        return '';
    }
    /* dantu / burnos */
    if ( strpos( $hay, 'dantu' ) !== false || strpos( $hay, 'dantim' ) !== false
        || strpos( $hay, 'burnos' ) !== false || strpos( $hay, 'dental' ) !== false
        || strpos( $hay, 'antpirst' ) !== false || strpos( $hay, 'apnas' ) !== false
        || strpos( $hay, 'stomatolog' ) !== false || strpos( $hay, 'snukut' ) !== false ) {
        return "Dant\xC5\xB3 prie\xC5\xBEi\xC5\xABra"; /* Dantu prieziura */
    }
    /* ausu */
    if ( strpos( $hay, 'ausu' ) !== false ) {
        return "Aus\xC5\xB3 prie\xC5\xBEi\xC5\xABra"; /* Ausu prieziura */
    }
    /* peduciu / odos */
    if ( strpos( $hay, 'peduc' ) !== false || strpos( $hay, 'soft pad' ) !== false
        || strpos( $hay, 'cortiadapt' ) !== false ) {
        return "P\xC4\x97du\xC4\x8Di\xC5\xB3 prie\xC5\xBEi\xC5\xABra"; /* Peduciu prieziura */
    }
    /* atgrasinimas nuo grauzimo/laizymo */
    if ( strpos( $hay, 'grauzim' ) !== false || strpos( $hay, 'laizym' ) !== false
        || strpos( $hay, 'dogostop' ) !== false || strpos( $hay, 'dogodrops' ) !== false
        || strpos( $hay, 'grauzikam' ) !== false ) {
        return "Atgrasinimo priemon\xC4\x97s"; /* Atgrasinimo priemones */
    }
    /* maiseliai / semtuveliai */
    if ( strpos( $hay, 'maiseli' ) !== false || strpos( $hay, 'semtuv' ) !== false
        || strpos( $hay, 'ekskrement' ) !== false || strpos( $hay, 'pick up' ) !== false ) {
        return "Mai\xC5\xA1eliai ir semtuv\xC4\x97liai"; /* Maiseliai ir semtuveliai */
    }
    /* vienkartines palutes / paklotai */
    if ( strpos( $hay, 'palut' ) !== false || strpos( $hay, 'paklot' ) !== false ) {
        return "Vienkartin\xC4\x97s palut\xC4\x97s"; /* Vienkartines palutes */
    }
    /* tualetai / kilimeliai */
    if ( strpos( $hay, 'tualetas' ) !== false || strpos( $hay, 'purvo' ) !== false
        || strpos( $hay, 'purva sugeri' ) !== false || strpos( $hay, 'sugerianti' ) !== false ) {
        return "Tualetai ir kilim\xC4\x97liai"; /* Tualetai ir kilimeliai */
    }
    /* demiu / kvapu / slapimo valikliai + dezodorantai */
    if ( strpos( $hay, 'demi' ) !== false || strpos( $hay, 'kvap' ) !== false
        || strpos( $hay, 'slapim' ) !== false || strpos( $hay, 'urine' ) !== false
        || strpos( $hay, 'valymo priemone' ) !== false || strpos( $hay, 'neutralizator' ) !== false
        || strpos( $hay, 'dezodorant' ) !== false || strpos( $hay, 'valiklis' ) !== false ) {
        return "D\xC4\x97mi\xC5\xB3 ir kvap\xC5\xB3 valikliai"; /* Demiu ir kvapu valikliai */
    }
    return '';
}

function petshop_attr_higiena_parser( $pid, $ctx ) {
    $hay   = petshop_attr_higiena_norm( get_the_title( $pid ) );
    $tipas = petshop_attr_higiena_tipas( $hay );
    if ( $tipas === '' ) { return 'review'; }
    return array( 'pa_tipas' => array( $tipas ) );
}

add_filter( 'petshop_attr_parsers', function ( $p ) {
    $p['higienos-priemones-sunims'] = 'petshop_attr_higiena_parser';
    return $p;
} );

add_action( 'init', function () {
    if ( empty( $_GET['petshop_attr_higiena'] ) ) { return; }
    $ps_tok_ok = ( isset( $_GET['k'] ) && $_GET['k'] === 'ps2026' );
    if ( ! current_user_can( 'manage_options' ) && ! $ps_tok_ok ) { return; }
    if ( ! function_exists( 'petshop_attr_apply' ) ) { wp_die( 'Engine pluginas neaktyvus.' ); }

    $mode     = sanitize_text_field( wp_unslash( $_GET['petshop_attr_higiena'] ) );
    $do_write = ( $mode === 'apply' && isset( $_GET['confirm'] ) && $_GET['confirm'] === 'APPLY' );
    $dry_run  = ! $do_write;

    $q = new WP_Query( array(
        'post_type'      => 'product',
        'post_status'    => array( 'publish', 'draft' ),
        'posts_per_page' => -1,
        'fields'         => 'ids',
        'no_found_rows'  => true,
        'tax_query'      => array( array(
            'taxonomy' => 'product_cat', 'field' => 'slug', 'terms' => array( 'higienos-priemones-sunims' ),
        ) ),
    ) );

    $rows = array();
    $cnt  = array( 'parsed' => 0, 'review' => 0 );

    foreach ( $q->posts as $pid ) {
        $name = get_the_title( $pid );
        $res  = petshop_attr_higiena_parser( $pid, array() );
        if ( $res === 'review' ) { $cnt['review']++; $rows[] = array( $pid, $name, 'REVIEW', '' ); continue; }
        if ( $do_write ) { wp_set_object_terms( $pid, array(), 'pa_tipas', false ); }
        $applied = petshop_attr_apply( $pid, $res, $dry_run );
        $cnt['parsed']++;
        if ( $do_write ) {
            update_post_meta( $pid, '_petshop_attr_parse_status', 'parsed' );
            update_post_meta( $pid, '_petshop_attr_parser_type', 'higienos-priemones-sunims' );
        }
        $rows[] = array( $pid, $name, 'PARSED', implode( ' | ', $applied ) );
    }

    header( 'Content-Type: text/html; charset=utf-8' );
    echo '<!doctype html><meta charset="utf-8"><style>body{font:13px system-ui,Arial;margin:24px}table{border-collapse:collapse;margin-top:10px;width:100%;max-width:1100px}td,th{border:1px solid #ddd;padding:4px 8px;text-align:left}th{background:#f4f4f2}.p{color:#0f6e56}.r{background:#fff6e5}</style>';
    echo '<h2>Higienos Priemones v1.0 &mdash; ' . ( $do_write ? 'APPLY' : 'DRY-RUN' ) . '</h2>';
    echo '<p>Viso: <b>' . count( $rows ) . '</b> &middot; PARSED: <b>' . $cnt['parsed'] . '</b> &middot; REVIEW: <b>' . $cnt['review'] . '</b></p>';
    echo '<table><tr><th>ID</th><th>Pavadinimas</th><th>Busena</th><th>Tipas</th></tr>';
    foreach ( $rows as $r ) {
        $cls = $r[2] === 'PARSED' ? 'p' : 'r';
        echo '<tr><td>' . (int) $r[0] . '</td><td>' . esc_html( $r[1] ) . '</td><td class="' . $cls . '">' . esc_html( $r[2] ) . '</td><td>' . esc_html( $r[3] ) . '</td></tr>';
    }
    echo '</table>';
    exit;
}, 20 );
