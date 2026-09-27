<?php
/**
 * Plugin Name: Petshop Botų sargas v1.2 (add-to-cart ir filtrų GET be JS slapuko; nofollow; užtvaros suvestinė)
 * Description: S1719 (2026-09-25). Access log 09-24: 9 725 `?add-to-cart=` GET/parą iš šimtų Azijos debesų IP (vienas UA) ir 56 081 filtrų (`yith_wcan=`/`filter_`) užklausų/parą — botai, apsimetantys Chrome. Naršyklė vykdo JS ir gauna slapuką `ps_js=1`; užklausa be slapuko: add-to-cart GET → prekė nededama, 302 į prekę (be sesijos, be ps_carts, be GA4); filtrų GET → 302 į URL be filtrų parametrų, X-Robots-Tag noindex. Neliečia: POST, prisijungusių, `/kasa/`, `wc-ajax`, `wp-json`, `wp-admin`, `ps_*` bridge raktų, `ps_pakartoti`/`ps_atkurti`. Google/Bing/GPTBot/ClaudeBot šių URL nespaudžia (robots.txt), tad nepaveikti. Žurnalas: ps-archyvas/botu-sargas/YYYY-MM-DD.log (IP, UA, kelias), valomas po 14 d. Išjungti: opcija ps_botu_sargas_isjungtas=1.
 * Version: 1.2
 * S1721 (2026-09-26): access log 09-26 — botai seka 302, o tikslas be pasvirojo brūkšnio davė dar 301 (WP kanoninis) → 12 046 301/4 val.; v1.1 filtrų 302 tiesiai į kanoninį URL (su „/", be /page/1/), shortlink <link rel=shortlink> ir Link antraštė nuimtos (1 086 /?p=N 301/4 val. iš botų, sekančių shortlink).
 * S1724 (2026-09-27): (a) filtrų nuorodoms (`filter_`/`yith_wcan=`) kataloguose/paieškoje pridedamas `rel="nofollow"` (ob buferis template_redirect, href nekeičiamas — YITH AJAX veikia); (b) `uztvara_suvestine()` Ryto sargui: vakarykštis Apache access log archyvas (logs/*.tar.gz, 00:11) → 403 (`.htaccess` PS Botu uztvara S1723), 500, viso; rezultatas kešuojamas opcijoje pagal archyvo mtime.
 */
if ( ! defined( 'ABSPATH' ) ) exit;

class Petshop_Botu_Sargas {
    const SLAPUKAS = 'ps_js';
    const LOG_DIR  = '/home/gyvunai2/domains/petshop.lt/ps-archyvas/botu-sargas';

    public static function init() {
        add_action( 'wp_head', array( __CLASS__, 'js' ), 0 );
        add_action( 'wp_loaded', array( __CLASS__, 'sargas' ), 1 ); // prieš WC_Form_Handler::add_to_cart_action (wp_loaded 20)
        add_action( 'ps_botu_sargas_valymas', array( __CLASS__, 'valymas' ) );
        add_action( 'template_redirect', array( __CLASS__, 'nofollow_buferis' ), 999 );
        remove_action( 'wp_head', 'wp_shortlink_wp_head', 10 );
        remove_action( 'template_redirect', 'wp_shortlink_header', 11 );
        if ( ! wp_next_scheduled( 'ps_botu_sargas_valymas' ) ) wp_schedule_event( strtotime( 'tomorrow 04:45' ), 'daily', 'ps_botu_sargas_valymas' );
    }

    public static function js() {
        // Techninis slapukas (ne sekimo): žymi, kad užklausas siunčia naršyklė, vykdanti JS. 1 metai, Lax, Secure.
        echo "<script>try{if(document.cookie.indexOf('" . self::SLAPUKAS . "=')<0){document.cookie='" . self::SLAPUKAS . "=1;path=/;max-age=31536000;SameSite=Lax" . ( is_ssl() ? ';Secure' : '' ) . "';}}catch(e){}</script>\n";
    }

    private static function praleisti() {
        if ( get_option( 'ps_botu_sargas_isjungtas' ) ) return true;
        if ( ( $_SERVER['REQUEST_METHOD'] ?? 'GET' ) !== 'GET' ) return true;
        if ( is_admin() || wp_doing_ajax() || wp_doing_cron() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || ( defined( 'WP_CLI' ) && WP_CLI ) ) return true;
        if ( ! empty( $_COOKIE[ self::SLAPUKAS ] ) ) return true;
        if ( is_user_logged_in() ) return true;
        $uri = (string) ( $_SERVER['REQUEST_URI'] ?? '' );
        if ( preg_match( '#^/(wp-json|wp-admin|wp-login\.php|kasa/?(\?|$)|krepselis|paskyra|feed/)#', $uri ) ) return true;
        if ( isset( $_GET['wc-ajax'] ) || isset( $_GET['rest_route'] ) || isset( $_GET['ps_pakartoti'] ) || isset( $_GET['ps_atkurti'] ) ) return true;
        foreach ( array_keys( $_GET ) as $k ) { if ( strpos( (string) $k, 'ps_' ) === 0 ) return true; } // bridge/vidiniai raktai
        return false;
    }

    public static function sargas() {
        if ( self::praleisti() ) return;
        // 1) add-to-cart GET be slapuko
        if ( isset( $_GET['add-to-cart'] ) ) {
            $pid = absint( $_GET['add-to-cart'] );
            unset( $_GET['add-to-cart'], $_REQUEST['add-to-cart'], $_GET['quantity'], $_REQUEST['quantity'] );
            $to = $pid ? get_permalink( $pid ) : '';
            if ( ! $to ) $to = home_url( '/' );
            self::log( 'atc', $pid );
            nocache_headers();
            header( 'X-Robots-Tag: noindex, nofollow', true );
            wp_redirect( $to, 302, 'Petshop-Botu-Sargas' );
            exit;
        }
        // 2) filtrų GET be slapuko
        $filtrai = false;
        foreach ( array_keys( $_GET ) as $k ) {
            $k = (string) $k;
            if ( $k === 'yith_wcan' || strpos( $k, 'filter_' ) === 0 || strpos( $k, 'query_type_' ) === 0 ) { $filtrai = true; break; }
        }
        if ( $filtrai ) {
            $uri  = (string) ( $_SERVER['REQUEST_URI'] ?? '/' );
            $path = strtok( $uri, '?' );
            $path = preg_replace( '#/page/1(/|$)#', '/', $path );       // /page/1/ → WP vis tiek 301'ina į be page
            $path = user_trailingslashit( rtrim( $path, '/' ) );        // be „/" WP 301'ina į su „/" — iš karto kanoninis
            if ( $path === '' ) $path = '/';
            $lik  = array();
            foreach ( $_GET as $k => $v ) { // paliekam tik nekenksmingus (paged, s, orderby)
                $k = (string) $k;
                if ( in_array( $k, array( 'paged', 's', 'orderby', 'post_type' ), true ) ) $lik[ $k ] = is_scalar( $v ) ? (string) $v : '';
            }
            $to = home_url( $path ) . ( $lik ? '?' . http_build_query( $lik ) : '' );
            self::log( 'filtrai', $uri );
            nocache_headers();
            header( 'X-Robots-Tag: noindex, nofollow', true );
            wp_redirect( $to, 302, 'Petshop-Botu-Sargas' );
            exit;
        }
    }

    private static function log( $tipas, $kas ) {
        try {
            if ( ! is_dir( self::LOG_DIR ) ) @mkdir( self::LOG_DIR, 0700, true );
            $ip = (string) ( $_SERVER['REMOTE_ADDR'] ?? '-' );
            $ua = substr( preg_replace( '/[\r\n\t]/', ' ', (string) ( $_SERVER['HTTP_USER_AGENT'] ?? '-' ) ), 0, 120 );
            $ln = gmdate( 'H:i:s' ) . "\t$tipas\t$ip\t" . substr( (string) $kas, 0, 160 ) . "\t$ua\n";
            @file_put_contents( self::LOG_DIR . '/' . gmdate( 'Y-m-d' ) . '.log', $ln, FILE_APPEND | LOCK_EX );
        } catch ( \Throwable $e ) {}
    }

    public static function valymas() {
        foreach ( glob( self::LOG_DIR . '/*.log' ) ?: array() as $f ) { if ( filemtime( $f ) < time() - 14 * 86400 ) @unlink( $f ); }
    }

    /** S1724: filtrų <a> → rel="nofollow" (tik kataloguose/paieškoje, tik ne-admin GET). */
    public static function nofollow_buferis() {
        if ( is_admin() || wp_doing_ajax() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) return;
        if ( get_option( 'ps_botu_sargas_isjungtas' ) ) return;
        if ( ! function_exists( 'is_product_taxonomy' ) ) return;
        if ( ! ( is_product_taxonomy() || is_shop() || is_search() || is_post_type_archive( 'product' ) ) ) return;
        ob_start( array( __CLASS__, 'nofollow_html' ) );
    }
    public static function nofollow_html( $html ) {
        if ( ! is_string( $html ) || strpos( $html, 'filter_' ) === false && strpos( $html, 'yith_wcan=' ) === false ) return $html;
        $out = preg_replace_callback( '#<a\b([^>]*?)>#i', function ( $m ) {
            $a = $m[1];
            if ( stripos( $a, 'rel=' ) !== false ) return $m[0];
            if ( ! preg_match( '#href="[^"]*(?:filter_|yith_wcan=)[^"]*"#i', $a ) ) return $m[0];
            return '<a' . $a . ' rel="nofollow">';
        }, $html );
        return is_string( $out ) ? $out : $html;
    }

    /** S1724: Ryto sargui — vakarykštis access log archyvas (naujausias logs/*.tar.gz* su mtime 00:00–01:00). Grąžina [lygis, tekstas]. */
    public static function uztvara_suvestine() {
        $dom = dirname( ABSPATH ); $f = null; $fm = 0;
        foreach ( glob( $dom . '/logs/*.tar.gz*' ) ?: array() as $fx ) { $m = filemtime( $fx ); if ( (int) wp_date( 'G', $m ) <= 1 && $m > $fm ) { $fm = $m; $f = $fx; } }
        if ( ! $f ) return array( 'pilka', 'Botų užtvara: access log archyvo nėra' );
        $k = 'ps_uztvara_suvestine'; $c = get_option( $k ); if ( is_array( $c ) && ( $c['mtime'] ?? 0 ) === $fm ) return $c['rez'];
        $t0 = microtime( true ); $h = @gzopen( $f, 'rb' ); if ( ! $h ) return array( 'pilka', 'Botų užtvara: archyvo neatidaro' );
        gzread( $h, 512 ); $n = 0; $s403 = 0; $s403f = 0; $s500 = 0; $s302 = 0; $ip = array(); $nutr = false;
        while ( ( $ln = gzgets( $h, 8192 ) ) !== false ) {
            if ( ! preg_match( '/^(\S+) \S+ \S+ \[[^\]]*\] "(\S+) (\S+)[^"]*" (\d{3}) /', $ln, $m ) ) continue;
            $n++; $st = $m[4];
            if ( $st === '403' ) { $s403++; if ( strpos( $m[3], 'filter_' ) !== false || strpos( $m[3], 'yith_wcan' ) !== false || strpos( $m[3], 'add-to-cart' ) !== false ) { $s403f++; $ip[ $m[1] ] = 1; } }
            elseif ( $st === '500' ) $s500++;
            elseif ( $st === '302' ) $s302++;
            if ( ( $n & 4095 ) === 0 && microtime( true ) - $t0 > 60 ) { $nutr = true; break; }
        }
        gzclose( $h );
        $lyg = $s500 >= 50 ? 'raudona' : ( ( $s500 >= 10 || $s403f >= 150000 ) ? 'geltona' : 'zalia' );
        $tx = sprintf( 'Botų užtvara (log %s): 403 %s (filtrai/atc %s, IP %s), 500 %s, 302 %s, viso %s užkl.%s', wp_date( 'm-d', $fm - 6 * 3600 ), number_format( $s403, 0, ',', ' ' ), number_format( $s403f, 0, ',', ' ' ), number_format( count( $ip ), 0, ',', ' ' ), $s500, number_format( $s302, 0, ',', ' ' ), number_format( $n, 0, ',', ' ' ), $nutr ? ' (nutraukta po 60 s)' : '' );
        $rez = array( $lyg, $tx ); update_option( $k, array( 'mtime' => $fm, 'rez' => $rez, 'kada' => current_time( 'mysql' ) ), false );
        return $rez;
    }

    /** Suvestinė žurnalui/sargams: [diena => [atc => n, filtrai => n, ip_unik => n]] */
    public static function suvestine( $dienos = 3 ) {
        $out = array();
        for ( $i = 0; $i < $dienos; $i++ ) {
            $d = gmdate( 'Y-m-d', time() - $i * 86400 ); $f = self::LOG_DIR . "/$d.log";
            if ( ! file_exists( $f ) ) continue;
            $atc = 0; $fl = 0; $ips = array();
            $h = fopen( $f, 'r' ); while ( ( $ln = fgets( $h ) ) !== false ) { $p = explode( "\t", $ln ); if ( count( $p ) < 3 ) continue; if ( $p[1] === 'atc' ) $atc++; else $fl++; $ips[ $p[2] ] = 1; } fclose( $h );
            $out[ $d ] = array( 'atc' => $atc, 'filtrai' => $fl, 'ip_unik' => count( $ips ) );
        }
        return $out;
    }
}
Petshop_Botu_Sargas::init();
