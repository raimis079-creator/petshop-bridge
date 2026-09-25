<?php
/**
 * Plugin Name: Petshop Botų sargas v1.0 (add-to-cart ir filtrų GET be JS slapuko)
 * Description: S1719 (2026-09-25). Access log 09-24: 9 725 `?add-to-cart=` GET/parą iš šimtų Azijos debesų IP (vienas UA) ir 56 081 filtrų (`yith_wcan=`/`filter_`) užklausų/parą — botai, apsimetantys Chrome. Naršyklė vykdo JS ir gauna slapuką `ps_js=1`; užklausa be slapuko: add-to-cart GET → prekė nededama, 302 į prekę (be sesijos, be ps_carts, be GA4); filtrų GET → 302 į URL be filtrų parametrų, X-Robots-Tag noindex. Neliečia: POST, prisijungusių, `/kasa/`, `wc-ajax`, `wp-json`, `wp-admin`, `ps_*` bridge raktų, `ps_pakartoti`/`ps_atkurti`. Google/Bing/GPTBot/ClaudeBot šių URL nespaudžia (robots.txt), tad nepaveikti. Žurnalas: ps-archyvas/botu-sargas/YYYY-MM-DD.log (IP, UA, kelias), valomas po 14 d. Išjungti: opcija ps_botu_sargas_isjungtas=1.
 * Version: 1.0
 */
if ( ! defined( 'ABSPATH' ) ) exit;

class Petshop_Botu_Sargas {
    const SLAPUKAS = 'ps_js';
    const LOG_DIR  = '/home/gyvunai2/domains/petshop.lt/ps-archyvas/botu-sargas';

    public static function init() {
        add_action( 'wp_head', array( __CLASS__, 'js' ), 0 );
        add_action( 'wp_loaded', array( __CLASS__, 'sargas' ), 1 ); // prieš WC_Form_Handler::add_to_cart_action (wp_loaded 20)
        add_action( 'ps_botu_sargas_valymas', array( __CLASS__, 'valymas' ) );
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
