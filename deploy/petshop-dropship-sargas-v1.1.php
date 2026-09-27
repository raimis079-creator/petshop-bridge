<?php
/**
 * Plugin Name: Petshop Dropship Sargas v1.1 (H210) — tiekėjo vėlavimo (SLA) stebėjimas darbo dienomis
 * Version: 1.1
 *
 * PROBLEMA: perdavus užsakymą tiekėjui (`_ps_dropship_sent`) niekas neseka,
 * ar tiekėjas realiai išsiuntė. Užsakymas gali tyliai kaboti „vykdomas" dienomis.
 *
 * SPRENDIMAS: valandinis cron. Jei nuo perdavimo praėjo daugiau nei SLA
 * (v1.1: 2 DARBO DIENOS = 48 darbo val.; keičiama filtru `ps_dropship_sla_valandos`),
 * o užsakymas vis dar processing/on-hold — uždedama žymė `_ps_sla_velavimas`
 * + pastaba istorijoje. Darbalaukio `klausimas()` žymę paverčia kortele „Klausimuose".
 *
 * v1.1 (2026-09-27, S1724, Raimis: „užsakymuose viskas eina kalendorinėmis dienomis,
 * o mes dirbame darbo — savaitgaliais niekas nedirba, o skaitiklis skaičiuoja viską";
 * sprendimas „per 2 darbo dienas"): terminas skaičiuojamas DARBO laiku —
 *   • jei perduota ne darbo dieną (Šš/Sk/šventė) → atskaita nuo kitos darbo dienos 09:00;
 *   • prie atskaitos pridedama po 24 val. tiek kartų, kiek SLA/24, praleidžiant ne darbo dienas;
 *   • darbo diena = `Petshop_Darbalaukis::darbo_diena()` (Pr–Pn, LT šventės, Velykų pirmadienis),
 *     jei klasės nėra — Pr–Pn.
 *   Pvz.: Pn 11:13 → Pr 11:13 → An 11:13 (terminas). Kt 14:22 → Pn 14:22 → Pr 14:22.
 *   Šš 12:00 → Pr 09:00 → An 09:00 → Tr 09:00.
 *   v1.0 skaičiavo 24 kalendorines val. → kas savaitgalį klaidingi aliarmai (09-15: 13 užs., 09-26: 3 užs.).
 *
 * SAUGUMO RIBA: sargas gali TIK uždėti žymę ir pastabą. Jokių statusų,
 * likučių, laiškų. Žymė dedama VIENĄ kartą (idempotencija per žymės buvimą).
 */

defined( 'ABSPATH' ) || exit;

class Petshop_Dropship_Sargas {

	const ZYME   = '_ps_sla_velavimas';
	const CRON   = 'ps_dropship_sargas';
	const RIBA_H = 48;   /* 2 darbo dienos */
	const DARBO_PRADZIA = '09:00:00';

	public static function init() {
		add_action( 'init', array( __CLASS__, 'planuoti' ) );
		add_action( self::CRON, array( __CLASS__, 'tikrinti' ) );
	}

	public static function planuoti() {
		if ( ! wp_next_scheduled( self::CRON ) ) {
			wp_schedule_event( time() + 300, 'hourly', self::CRON );
		}
	}

	/** SLA valandomis (darbo). */
	public static function valandu() {
		return max( 24, (int) apply_filters( 'ps_dropship_sla_valandos', self::RIBA_H ) );
	}

	/** Ar darbo diena ('Y-m-d' Vilniaus laiku). Darbalaukio helperis (šventės, Velykos) arba Pr–Pn. */
	public static function darbo_diena( $ymd ) {
		if ( class_exists( 'Petshop_Darbalaukis' ) && method_exists( 'Petshop_Darbalaukis', 'darbo_diena' ) ) {
			return (bool) Petshop_Darbalaukis::darbo_diena( $ymd );
		}
		$dt = new DateTime( $ymd . ' 12:00:00', wp_timezone() );
		return (int) $dt->format( 'N' ) < 6;
	}

	/**
	 * Terminas (DateTime Vilniaus laiku), iki kurio tiekėjas turi išsiųsti.
	 * $sent — `_ps_dropship_sent` ('Y-m-d H:i:s', svetainės laiku, kaip rašo current_time('mysql')).
	 */
	public static function terminas( $sent, $valandu = null ) {
		$tz = wp_timezone();
		$d  = DateTime::createFromFormat( 'Y-m-d H:i:s', $sent, $tz );
		if ( ! $d ) { return null; }
		$valandu = null === $valandu ? self::valandu() : (int) $valandu;
		/* atskaita: ne darbo dieną perduota → kita darbo diena 09:00 */
		$guard = 0;
		while ( ! self::darbo_diena( $d->format( 'Y-m-d' ) ) && $guard++ < 30 ) {
			$d->modify( '+1 day' );
			$d->setTime( (int) substr( self::DARBO_PRADZIA, 0, 2 ), (int) substr( self::DARBO_PRADZIA, 3, 2 ), 0 );
		}
		/* po 24 val. žingsniais, praleidžiant ne darbo dienas */
		$zingsniu = (int) ceil( $valandu / 24 );
		for ( $i = 0; $i < $zingsniu; $i++ ) {
			$d->modify( '+1 day' );
			$guard = 0;
			while ( ! self::darbo_diena( $d->format( 'Y-m-d' ) ) && $guard++ < 30 ) { $d->modify( '+1 day' ); }
		}
		return $d;
	}

	/** Ar terminas praėjęs ($dabar — timestamp UTC, numatyta now). */
	public static function veluoja( $sent, $dabar = null ) {
		$t = self::terminas( $sent );
		if ( ! $t ) { return false; }
		return $t->getTimestamp() < ( null === $dabar ? time() : (int) $dabar );
	}

	/** Valandinis patikrinimas. $dry — tik sąrašas (testams). Grąžina pažymėtų skaičių arba dry masyvą. */
	public static function tikrinti( $dry = false ) {
		global $wpdb;
		$valandu = self::valandu();
		/* grubus SQL filtras: bent SLA kalendorinių val. praėjo (darbo terminas visada ≥ kalendorinio) */
		$riba = gmdate( 'Y-m-d H:i:s', current_time( 'timestamp' ) - $valandu * HOUR_IN_SECONDS );
		$t  = $wpdb->prefix . 'wc_orders';
		$mt = $wpdb->prefix . 'wc_orders_meta';

		$ids = $wpdb->get_col( $wpdb->prepare(
			"SELECT o.id
			 FROM {$t} o
			 JOIN {$mt} m ON m.order_id = o.id AND m.meta_key = '_ps_dropship_sent'
			 LEFT JOIN {$mt} f ON f.order_id = o.id AND f.meta_key = %s
			 WHERE o.status IN ('wc-processing','wc-on-hold')
			   AND f.order_id IS NULL
			   AND m.meta_value <> '' AND m.meta_value < %s
			 LIMIT 50", self::ZYME, $riba ) );

		$k = 0; $out = array();
		foreach ( $ids as $oid ) {
			$o = wc_get_order( $oid );
			if ( ! $o || $o->get_meta( self::ZYME ) ) { continue; }
			$sent = (string) $o->get_meta( '_ps_dropship_sent' );
			if ( ! $sent ) { continue; }
			$term = self::terminas( $sent );
			if ( ! $term ) { continue; }
			$veluoja = $term->getTimestamp() < time();
			if ( $dry ) { $out[] = array( 'id' => $oid, 'nr' => $o->get_order_number(), 'sent' => $sent, 'terminas' => $term->format( 'Y-m-d H:i D' ), 'veluoja' => $veluoja ); continue; }
			if ( ! $veluoja ) { continue; }

			$o->update_meta_data( self::ZYME, current_time( 'mysql' ) );
			$o->add_order_note( sprintf(
				'Dropship sargas: tiekėjui perduota %s, terminas %s (%d darbo d.) praėjo, užsakymas vis dar vykdomas. Įkelta į „Klausimus" — patikrink pas tiekėją.',
				$sent, $term->format( 'm-d H:i' ), (int) ceil( $valandu / 24 ) ), false, true );
			$o->save();
			$k++;
		}
		return $dry ? $out : $k;
	}
}
Petshop_Dropship_Sargas::init();
