<?php
/**
 * Petshop_Refill_Engine — self-calibrating refill tracking (M11).
 *
 * LOGIKA: mokosi is KLIENTO REALAUS pirkimo intervalo, ne is teoriniu normu.
 * - 1-as pirkimas: grubus intervalas pagal pakuotes dydi (14/30/60 d., confidence 0.4)
 * - 2+ pirkimas to paties produkto: kalibruojasi is realaus intervalo (confidence->0.9)
 *
 * NAUDOJA: order_paid event (jau veikia), pet profile (M7, nebutina).
 * GENERUOJA: refill_due event (schema jau yra S185).
 *
 * DB: gaj6_ps_refill_tracking (user_id + product_id + pet_id nullable).
 *
 * Srautas:
 *   1. order_paid -> on_order_paid() -> irasoma/atnaujinama refill_tracking
 *   2. Cron (kasdien) -> check_due() -> fire refill_due event (T-5 dienu)
 *   3. Sender mirror: PS_REFILL_CANDIDATE, PS_NEXT_REFILL_DATE
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Petshop_Refill_Engine {

	// Pakuotes dydzio intervalai (dienos) — MVP default'ai
	const INTERVAL_SMALL  = 14;   // <500g (konservai, skanestai)
	const INTERVAL_MEDIUM = 30;   // 0.5-3 kg
	const INTERVAL_LARGE  = 60;   // 3+ kg (sausi maistai)
	const INTERVAL_DEFAULT = 30;  // jei negalim nustatyti

	const CONFIDENCE_FIRST = 0.4;     // pirmas pirkimas
	const CONFIDENCE_SECOND = 0.7;    // antras (pirmas realus intervalas)
	const CONFIDENCE_CALIBRATED = 0.9; // 3+ pirkim (kalibruotas)

	const DUE_ADVANCE_DAYS = 5;  // fire refill_due X dienu PRIES predicted_empty_date
	const META_REFILL_PROCESSED = '_ps_refill_tracked'; // order meta (idempotencija)

	// Maisto kategoriju slug'ai (tik siems produktams sekam refill)
	const FOOD_CATEGORY_SLUGS = array(
		'sausas-maistas-sunims',
		'sausas-maistas-katems',
		'maistas-sunims',
		'maistas-katems',
		'hipoalerginis-maistas-sunims',
	);

	public static function table_name() {
		global $wpdb;
		return $wpdb->prefix . 'ps_refill_tracking';
	}

	public static function install() {
		global $wpdb;
		$table = self::table_name();
		$charset = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE `$table` (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			user_id BIGINT UNSIGNED NOT NULL,
			product_id BIGINT UNSIGNED NOT NULL,
			pet_id BIGINT UNSIGNED NULL,
			last_order_id BIGINT UNSIGNED NOT NULL,
			last_purchase_date DATE NOT NULL,
			purchase_count INT UNSIGNED NOT NULL DEFAULT 1,
			avg_interval_days INT UNSIGNED NULL,
			predicted_empty_date DATE NULL,
			confidence DECIMAL(3,2) NOT NULL DEFAULT 0.40,
			status VARCHAR(16) NOT NULL DEFAULT 'active',
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			PRIMARY KEY (id),
			UNIQUE KEY uq_user_product (user_id, product_id),
			KEY idx_status_predicted (status, predicted_empty_date),
			KEY idx_user (user_id)
		) $charset";
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	public static function maybe_install() {
		global $wpdb;
		if ( ! $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", self::table_name() ) ) ) {
			self::install();
		}
	}

	public static function init() {
		// Reaguojam i order_paid (per WC hook, ne per musu event — tiesiogiai)
		add_action( 'woocommerce_payment_complete', array( __CLASS__, 'on_order_paid' ), 30, 1 );
		add_action( 'woocommerce_order_status_processing', array( __CLASS__, 'on_order_paid' ), 30, 1 );
		add_action( 'woocommerce_order_status_completed', array( __CLASS__, 'on_order_paid' ), 30, 1 );

		// Cron: kasdienine patikra (Action Scheduler arba wp_cron)
		add_action( 'ps_refill_daily_check', array( __CLASS__, 'check_due' ) );
		if ( ! wp_next_scheduled( 'ps_refill_daily_check' ) ) {
			wp_schedule_event( strtotime( 'tomorrow 08:00' ), 'daily', 'ps_refill_daily_check' );
		}
	}

	/**
	 * order_paid -> tikrinam ar yra maisto produktu -> irasom refill_tracking.
	 */
	public static function on_order_paid( $order_id ) {
		$order = wc_get_order( $order_id );
		if ( ! $order ) {
			return;
		}
		// Idempotencija: jei sis order jau apdorotas
		if ( $order->get_meta( self::META_REFILL_PROCESSED ) === 'yes' ) {
			return;
		}
		$user_id = $order->get_customer_id();
		if ( ! $user_id ) {
			return;  // svecio uzsakymas — negalim tracking
		}
		// Tik jei realiai apmoketas
		if ( ! $order->get_date_paid() ) {
			return;
		}

		$purchase_date = $order->get_date_paid()->format( 'Y-m-d' );
		$tracked_any = false;

		foreach ( $order->get_items() as $item ) {
			$product = $item->get_product();
			if ( ! $product ) {
				continue;
			}
			$product_id = $product->get_id();

			// Tik maisto produktai
			if ( ! self::is_food_product( $product_id ) ) {
				continue;
			}

			self::track_purchase( $user_id, $product_id, $order->get_id(), $purchase_date, $product );
			$tracked_any = true;
		}

		if ( $tracked_any ) {
			// Pazymim order kaip apdorota
			$order->update_meta_data( self::META_REFILL_PROCESSED, 'yes' );
			// Apsauga nuo ciklo (kaip order_shipped)
			remove_action( 'woocommerce_order_status_processing', array( __CLASS__, 'on_order_paid' ), 30 );
			remove_action( 'woocommerce_order_status_completed', array( __CLASS__, 'on_order_paid' ), 30 );
			$order->save();
			add_action( 'woocommerce_order_status_processing', array( __CLASS__, 'on_order_paid' ), 30, 1 );
			add_action( 'woocommerce_order_status_completed', array( __CLASS__, 'on_order_paid' ), 30, 1 );

			// Sender mirror
			self::mirror_to_sender( $user_id );
		}
	}

	/**
	 * Iraso arba atnaujina refill_tracking irasa.
	 */
	private static function track_purchase( $user_id, $product_id, $order_id, $purchase_date, $product ) {
		global $wpdb;
		$table = self::table_name();

		// Ar jau sekam si produkta siam user'iui?
		$existing = $wpdb->get_row( $wpdb->prepare(
			"SELECT * FROM `$table` WHERE user_id = %d AND product_id = %d",
			$user_id, $product_id
		) );

		if ( $existing ) {
			// KALIBRAVIMAS: skaiciuojam realu intervala
			$prev_date = $existing->last_purchase_date;
			$real_interval = max( 1, (int) round( ( strtotime( $purchase_date ) - strtotime( $prev_date ) ) / 86400 ) );
			$new_count = (int) $existing->purchase_count + 1;

			// Svertinis vidurkis: senas vidurkis * 0.3 + naujas intervalas * 0.7
			// (labiau svertam i nauja — adaptyvus)
			$old_avg = $existing->avg_interval_days ?: $real_interval;
			$new_avg = (int) round( $old_avg * 0.3 + $real_interval * 0.7 );
			$new_avg = max( 7, min( 180, $new_avg ) ); // ribos: 7-180 d.

			$confidence = ( $new_count >= 3 ) ? self::CONFIDENCE_CALIBRATED : self::CONFIDENCE_SECOND;

			$predicted = date( 'Y-m-d', strtotime( $purchase_date ) + $new_avg * 86400 );

			$wpdb->update( $table, array(
				'last_order_id'       => $order_id,
				'last_purchase_date'  => $purchase_date,
				'purchase_count'      => $new_count,
				'avg_interval_days'   => $new_avg,
				'predicted_empty_date' => $predicted,
				'confidence'          => $confidence,
				'status'              => 'active',
				'updated_at'          => gmdate( 'Y-m-d H:i:s' ),
			), array( 'id' => $existing->id ) );
		} else {
			// PIRMAS PIRKIMAS: grubus intervalas pagal pakuotes dydi
			$interval = self::estimate_interval( $product );
			$predicted = date( 'Y-m-d', strtotime( $purchase_date ) + $interval * 86400 );

			$wpdb->insert( $table, array(
				'user_id'              => $user_id,
				'product_id'           => $product_id,
				'pet_id'               => null,
				'last_order_id'        => $order_id,
				'last_purchase_date'   => $purchase_date,
				'purchase_count'       => 1,
				'avg_interval_days'    => $interval,
				'predicted_empty_date' => $predicted,
				'confidence'           => self::CONFIDENCE_FIRST,
				'status'               => 'active',
				'created_at'           => gmdate( 'Y-m-d H:i:s' ),
				'updated_at'           => gmdate( 'Y-m-d H:i:s' ),
			), array( '%d','%d','%d','%d','%s','%d','%d','%s','%f','%s','%s','%s' ) );
		}
	}

	/**
	 * Grubus intervalo nustatymas pagal pakuotes dydi (pirmas pirkimas, MVP).
	 */
	private static function estimate_interval( $product ) {
		// Bandom is pa_pakuotes_dydis taksonomijos
		$terms = wp_get_post_terms( $product->get_id(), 'pa_pakuotes_dydis', array( 'fields' => 'names' ) );
		if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
			$size_str = $terms[0];
			$grams = self::parse_weight_grams( $size_str );
			if ( $grams > 0 ) {
				if ( $grams < 500 ) {
					return self::INTERVAL_SMALL;
				}
				if ( $grams <= 3000 ) {
					return self::INTERVAL_MEDIUM;
				}
				return self::INTERVAL_LARGE;
			}
		}
		// Fallback: WC weight
		$weight = (float) $product->get_weight();
		if ( $weight > 0 ) {
			// WC weight vienetai (g arba kg — priklauso nuo nustatymu)
			$unit = get_option( 'woocommerce_weight_unit', 'kg' );
			$g = ( $unit === 'g' ) ? $weight : $weight * 1000;
			if ( $g < 500 ) {
				return self::INTERVAL_SMALL;
			}
			if ( $g <= 3000 ) {
				return self::INTERVAL_MEDIUM;
			}
			return self::INTERVAL_LARGE;
		}
		return self::INTERVAL_DEFAULT;
	}

	/**
	 * Parsina "1,5 kg" / "720 g" / "4,25 kg" i gramus.
	 */
	private static function parse_weight_grams( $str ) {
		$str = strtolower( trim( $str ) );
		// Pavyzdziai: "1,5 kg", "720 g", "4,25 kg", "115 g"
		if ( preg_match( '/^([\d,\.]+)\s*(kg|g)/', $str, $m ) ) {
			$num = (float) str_replace( ',', '.', $m[1] );
			if ( $m[2] === 'kg' ) {
				return (int) round( $num * 1000 );
			}
			return (int) round( $num );
		}
		return 0;
	}

	/**
	 * Ar produktas yra maisto kategorijoje (tik tokiems sekam refill).
	 */
	private static function is_food_product( $product_id ) {
		$terms = wp_get_post_terms( $product_id, 'product_cat', array( 'fields' => 'slugs' ) );
		if ( is_wp_error( $terms ) ) {
			return false;
		}
		foreach ( $terms as $slug ) {
			if ( in_array( $slug, self::FOOD_CATEGORY_SLUGS, true ) ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Cron: kasdienine patikra — fire refill_due event kai arteja predicted_empty_date.
	 */
	public static function check_due() {
		global $wpdb;
		$table = self::table_name();
		$advance = self::DUE_ADVANCE_DAYS;
		$target_date = date( 'Y-m-d', time() + $advance * 86400 );

		// Rasam aktyvius irasys kur predicted_empty_date <= today + advance
		// IR dar nefire'inome refill_due (status = 'active')
		$rows = $wpdb->get_results( $wpdb->prepare(
			"SELECT rt.*, u.user_email
			 FROM `$table` rt
			 JOIN `{$wpdb->users}` u ON u.ID = rt.user_id
			 WHERE rt.status = 'active'
			   AND rt.predicted_empty_date <= %s
			 ORDER BY rt.predicted_empty_date ASC
			 LIMIT 100",
			$target_date
		) );

		foreach ( $rows as $row ) {
			if ( ! $row->user_email || ! class_exists( 'Petshop_Event_Registry' ) ) {
				continue;
			}
			$product = wc_get_product( $row->product_id );
			$product_name = $product ? $product->get_name() : '(produktas #' . $row->product_id . ')';

			Petshop_Event_Registry::emit( 'refill_due', $row->user_email, array(
				'pet_id'               => $row->pet_id ? (int) $row->pet_id : 0,
				'product_id'           => (int) $row->product_id,
				'product_name'         => $product_name,
				'predicted_empty_date' => $row->predicted_empty_date,
				'confidence'           => (float) $row->confidence,
				'last_order_id'        => (int) $row->last_order_id,
				'days_since_last_order' => (int) round( ( time() - strtotime( $row->last_purchase_date ) ) / 86400 ),
			), array(
				'event_id' => 'refill_due_' . $row->user_id . '_' . $row->product_id . '_' . $row->predicted_empty_date,
			) );

			// Pazymim kad fire'inta (status -> notified), kad nekartotume
			$wpdb->update( $table, array(
				'status'     => 'notified',
				'updated_at' => gmdate( 'Y-m-d H:i:s' ),
			), array( 'id' => $row->id ) );
		}
	}

	/**
	 * Sender mirror: PS_REFILL_CANDIDATE + PS_NEXT_REFILL_DATE.
	 */
	private static function mirror_to_sender( $user_id ) {
		if ( ! function_exists( 'ps_esp_adapter' ) ) {
			return;
		}
		$user = get_user_by( 'id', $user_id );
		if ( ! $user ) {
			return;
		}
		global $wpdb;
		// Artimiausia predicted_empty_date (active)
		$nearest = $wpdb->get_var( $wpdb->prepare(
			"SELECT MIN(predicted_empty_date) FROM `" . self::table_name() . "`
			 WHERE user_id = %d AND status = 'active'",
			$user_id
		) );

		$adapter = ps_esp_adapter();
		if ( ! $adapter || ! $adapter->is_configured() ) {
			return;
		}
		$attrs = array(
			'PS_REFILL_CANDIDATE' => $nearest ? 'true' : 'false',
		);
		if ( $nearest ) {
			$attrs['PS_NEXT_REFILL_DATE'] = $nearest;
		}
		$adapter->upsert_contact( $user->user_email, $attrs );
	}
}
