<?php
/** Petshop Aprasymu Accordion PROTO v4 (test gate ps_desc) */
if (!defined('ABSPATH')) return;

/* Pasalina <style>/<script> siuksles ir "Trumpas prekes aprasymas" etikete */
if (!function_exists('psdp_clean')) {
function psdp_clean($html){
    if (!is_string($html)) return '';
    $html = html_entity_decode($html, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $html = preg_replace('#<style[^>]*>.*?</style>#is', ' ', $html);
    $html = preg_replace('#<script[^>]*>.*?</script>#is', ' ', $html);
    $html = preg_replace('/Trumpas\s+prek\x{0117}s\s+apra\x{0161}ymas/iu', ' ', $html);
    return $html;
}
}

/* Transliteruoja LT -> ascii lowercase (markeriu atpazinimui) */
if (!function_exists('psdp_ascii')) {
function psdp_ascii($s){
    $s = wp_strip_all_tags($s);
    $map = array(
        "\xC4\x85"=>'a',"\xC4\x8D"=>'c',"\xC4\x99"=>'e',"\xC4\x97"=>'e',"\xC4\xAF"=>'i',
        "\xC5\xA1"=>'s',"\xC5\xB3"=>'u',"\xC5\xAB"=>'u',"\xC5\xBE"=>'z',
        "\xC4\x84"=>'a',"\xC4\x8C"=>'c',"\xC4\x98"=>'e',"\xC4\x96"=>'e',"\xC4\xAE"=>'i',
        "\xC5\xA0"=>'s',"\xC5\xB2"=>'u',"\xC5\xAA"=>'u',"\xC5\xBD"=>'z'
    );
    return strtolower(strtr($s, $map));
}
}

/* Markerio -> svari sekcijos antraste */
if (!function_exists('psdp_title')) {
function psdp_title($m){
    $t = psdp_ascii($m);
    if (strpos($t,'sud')===0) return "Sud\xC4\x97tis";
    if (strpos($t,'analitin')===0) return "Analitin\xC4\x97s sudedamosios dalys";
    if (strpos($t,'pried')!==false) return "Priedai";
    if (strpos($t,'serim')===0 || strpos($t,'serim')!==false) return "\xC5\xA0\xC4\x97rimo instrukcija";
    if (strpos($t,'ispejim')!==false) return "\xC4\xAEsp\xC4\x97jimai";
    if (strpos($t,'pagaminta')!==false) return "Pagaminta";
    if (strpos($t,'medziag')!==false) return "Med\xC5\xBEiagos";
    if (strpos($t,'naudojim')!==false) return "Naudojimo instrukcija";
    return trim(wp_strip_all_tags($m));
}
}

/* Skaido post_content i [ [antraste, html], ... ] pagal markerius */
if (!function_exists('psdp_split')) {
function psdp_split($html){
    if (!is_string($html) || $html === '') return array();
    $html = psdp_clean($html);

    // markeris = (galimai tag'uose) zodis + dvitaskis
    $pat = '/(?:<(?:strong|b|h[1-6]|span|em|p)[^>]*>\s*)*\s*' .
           '(Sud\x{0117}tis|Analitin\x{0117}s(?:\s+sudedamosios)?(?:\s+(?:dalys|med\x{017E}iagos))?|' .
           'Maisto\s+priedai|Priedai|' .
           '\x{0160}\x{0117}rim(?:o|as)?(?:\s+(?:instrukcija|norma|rekomendacijos))?|' .
           '\x{012E}sp\x{0117}jim(?:ai|as)?|Pagaminta|Med\x{017E}iagos|' .
           'Naudojim(?:o)?(?:\s+instrukcija)?)' .
           '\s*(?:<[^>]+>\s*)*\s*:/iu';

    $parts = preg_split($pat, $html, -1, PREG_SPLIT_DELIM_CAPTURE);
    if (!is_array($parts) || count($parts) < 2) return array(); // markeriu nerasta -> fallback

    $sections = array();
    $intro = isset($parts[0]) ? trim($parts[0]) : '';
    if (strlen(trim(wp_strip_all_tags($intro))) > 15) {
        $sections[] = array("Apra\xC5\xA1ymas", $intro);
    }
    for ($i = 1; $i < count($parts); $i += 2) {
        $marker = $parts[$i];
        $body   = isset($parts[$i+1]) ? trim($parts[$i+1]) : '';
        if (strlen(trim(wp_strip_all_tags($body))) < 2) continue; // tuscia -> nerodom
        $sections[] = array(psdp_title($marker), $body);
    }
    // sujungti gretimas vienodo pavadinimo sekcijas (pvz. keli Priedai)
    $merged = array();
    foreach ($sections as $sec) {
        $n = count($merged);
        if ($n > 0 && $merged[$n-1][0] === $sec[0]) { $merged[$n-1][1] .= ' ' . $sec[1]; }
        else { $merged[] = $sec; }
    }
    return $merged;
}
}

/* Aprasymo tab'o renderis */
if (!function_exists('psdp_render')) {
function psdp_render($key = '', $tab = array()){
    global $post;
    $content = ($post && isset($post->post_content)) ? $post->post_content : '';
    $sections = psdp_split($content);

    // fallback: nera markeriu -> paprastas tekstas (kaip buvo)
    if (count($sections) < 2) {
        echo apply_filters('the_content', psdp_clean($content));
        return;
    }

    echo '<style>'
        . '.ps-desc-acc details{border-top:1px solid #4a8a3f;padding:15px 2px;}'
        . '.ps-desc-acc details:last-child{border-bottom:1px solid #4a8a3f;}'
        . '.ps-desc-acc summary{list-style:none;cursor:pointer;font-weight:700;font-size:19px;'
        . 'color:#1d5e1d;display:flex;align-items:center;}'
        . '.ps-desc-acc summary::-webkit-details-marker{display:none;}'
        . '.ps-desc-acc summary::after{content:"";margin-left:auto;border:5px solid transparent;'
        . 'border-left-color:#4a8a3f;transition:transform .2s;}'
        . '.ps-desc-acc details[open] summary::after{transform:rotate(90deg);}'
        . '.ps-desc-acc .ps-desc-body{padding-top:10px;color:#333;font-size:15px;line-height:1.6;}'
        . '</style>';

    echo '<div class="ps-desc-acc">';
    foreach ($sections as $s) {
        // PROTO: visi atidaryti, kad matytusi turinys per patikra
        echo '<details open><summary>' . esc_html($s[0]) . '</summary>'
           . '<div class="ps-desc-body">' . wpautop(force_balance_tags(trim($s[1]))) . '</div></details>';
    }
    echo '</div>';
}
}

/* Pakeicia aprasymo tab'a TIK kai ?ps_desc=1 (testas) */
add_filter('woocommerce_product_tabs', function($tabs){
    if (empty($_GET['ps_desc'])) return $tabs;
    if (isset($tabs['description'])) {
        $tabs['description']['callback'] = 'psdp_render';
    }
    return $tabs;
}, 98);
