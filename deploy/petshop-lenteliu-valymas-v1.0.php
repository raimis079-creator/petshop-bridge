<?php
/**
 * Plugin Name: Petshop Lentelių valymas v1.0 (ps_carts, ps_web_ivykiai, ps_sargas_klaidos, botų sargo žurnalas)
 * Description: S1719 (2026-09-25). Auditas: `ps_carts` +6 000 eil./d (botai), `ps_web_ivykiai` +2 500/d, `ps_sargas_klaidos` 6 000 — valymo niekur nebuvo. Naktinis cron 03:50: ps_carts — neapmokėti (converted_order_id NULL) senesni nei 90 d.; ps_web_ivykiai — senesni nei 180 d. (agregatai ps_web_dienos lieka); ps_sargas_klaidos — senesni nei 60 d.; woocommerce_sessions — pasibaigusios (WC tai daro pats, čia atsarga). Trina porcijomis po 5 000, kad neužrakintų lentelių. Žurnalas opcija ps_lenteliu_valymas_pask. Terminai keičiami filtru `ps_lenteliu_valymas_dienos`. Išjungti: opcija ps_lenteliu_valymas_isjungtas=1.
 * Version: 1.0
 */
if ( ! defined( 'ABSPATH' ) ) exit;

class Petshop_Lenteliu_Valymas {
    const CRON = 'ps_lenteliu_valymas';
    public static function init() {
        add_action( self::CRON, array( __CLASS__, 'vykdyti' ) );
        if ( ! wp_next_scheduled( self::CRON ) ) wp_schedule_event( strtotime( 'tomorrow 03:50' ), 'daily', self::CRON );
    }
    public static function dienos() {
        return apply_filters( 'ps_lenteliu_valymas_dienos', array( 'ps_carts' => 90, 'ps_web_ivykiai' => 180, 'ps_sargas_klaidos' => 60 ) );
    }
    private static function porcijomis( $sql_delete_with_limit, $max_loops = 40 ) {
        global $wpdb; $viso = 0;
        for ( $i = 0; $i < $max_loops; $i++ ) { $n = (int) $wpdb->query( $sql_delete_with_limit ); if ( $wpdb->last_error ) return array( $viso, $wpdb->last_error ); $viso += $n; if ( $n < 5000 ) break; }
        return array( $viso, null );
    }
    public static function vykdyti( $dry = false ) {
        global $wpdb; $p = $wpdb->prefix; $d = self::dienos(); $rez = array( 'laikas' => current_time( 'mysql' ), 'dry' => (bool) $dry );
        if ( get_option( 'ps_lenteliu_valymas_isjungtas' ) ) { $rez['isjungta'] = true; update_option( 'ps_lenteliu_valymas_pask', $rez, false ); return $rez; }
        $uzd = array(
            'ps_carts'          => array( "FROM {$p}ps_carts WHERE converted_order_id IS NULL AND created_at < NOW() - INTERVAL {$d['ps_carts']} DAY", 'id' ),
            'ps_web_ivykiai'    => array( "FROM {$p}ps_web_ivykiai WHERE laikas < NOW() - INTERVAL {$d['ps_web_ivykiai']} DAY", 'id' ),
            'ps_sargas_klaidos' => array( "FROM {$p}ps_sargas_klaidos WHERE laikas < NOW() - INTERVAL {$d['ps_sargas_klaidos']} DAY", 'id' ),
            'woocommerce_sessions' => array( "FROM {$p}woocommerce_sessions WHERE session_expiry < UNIX_TIMESTAMP()", 'session_id' ),
        );
        foreach ( $uzd as $k => $u ) {
            if ( ! $wpdb->get_var( "SHOW TABLES LIKE '{$p}" . ( $k === 'woocommerce_sessions' ? 'woocommerce_sessions' : $k ) . "'" ) ) { $rez[ $k ] = 'lentelės nėra'; continue; }
            $kiek = (int) $wpdb->get_var( "SELECT COUNT(*) {$u[0]}" );
            if ( $dry ) { $rez[ $k ] = array( 'kandidatai' => $kiek ); continue; }
            list( $n, $err ) = self::porcijomis( "DELETE {$u[0]} ORDER BY {$u[1]} LIMIT 5000" );
            $rez[ $k ] = array( 'kandidatai' => $kiek, 'istrinta' => $n, 'klaida' => $err );
        }
        update_option( 'ps_lenteliu_valymas_pask', $rez, false );
        return $rez;
    }
}
Petshop_Lenteliu_Valymas::init();
