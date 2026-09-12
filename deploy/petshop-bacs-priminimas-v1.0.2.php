<?php
/**
 * Petshop Bacs Priminimas v1.0.2 (S1676, 2026-09-12)
 *   v1.0.2: Raimio tekstas (S1676): trumpesnis, data lietuviškai, IBAN+bankas viena eilute.
 *   v1.0.1: rekvizitai iš Petshop_Darbalaukis::PAKART_BANKAS (WC bacs sąskaitų nėra); suma be HTML entity.
 *
 * 1) Bacs (pavedimu) on-hold užsakymai:
 *    - ≥48 val. nuo sukūrimo, dar nepriminta → laiškas klientui „laukia apmokėjimo" (rekvizitai, terminas),
 *      pastaba užsakyme, meta _ps_bacs_priminta.
 *    - ≥72 val., vis dar on-hold → cancelled (WC „atšauktas" laiškas klientui). Likutį grąžina AV variklis.
 * 2) Po BET KOKIO neapmokėto užsakymo atšaukimo (Paysera 90 min., bacs 72 val., rankinis) —
 *    krepšelio priminimai +2 val. (cart_abandoned) ir +24 val. (cart_abandoned_2) per Petshop_Email_Dispatch
 *    (marketingas — consent tikrina dispatch), su nuoroda atkurti krepšelį iš užsakymo prekių.
 * SARGAS (Raimio pastebėjimas: klientai daro kelis užsakymus iš eilės):
 *    - jei tas pats el. paštas turi NAUJESNĮ užsakymą (pending/on-hold/processing/completed) — priminimai NESIUNČIAMI;
 *    - jei naujesnis APMOKĖTAS — senas bacs atšaukiamas TYLIAI (be WC laiško).
 * Rankinis stabdis: užsakymo pastaba, kurioje yra žodis „LAUKTI" (didžiosiomis) — nieko nedaroma.
 * Testiniai (_petshop_test) praleidžiami. Valandinis cron ps_bacs_priminimas.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

final class Petshop_Bacs_Priminimas {
	const VER      = '1.0.2';
	const PRIM_PO  = 48 * HOUR_IN_SECONDS;
	const ATSAUK_PO = 72 * HOUR_IN_SECONDS;
	const KREP_1   = 2 * HOUR_IN_SECONDS;
	const KREP_2   = 24 * HOUR_IN_SECONDS;
	const CRON     = 'ps_bacs_priminimas';
	const KREP_HOOK = 'ps_atsaukto_krepselio_priminimas';

	public static function init() {
		add_action( 'init', array( __CLASS__, 'cron_registruoti' ) );
		add_action( self::CRON, array( __CLASS__, 'cron_run' ) );
		add_action( self::KREP_HOOK, array( __CLASS__, 'krepselio_priminimas' ), 10, 2 );
		add_action( 'woocommerce_order_status_cancelled', array( __CLASS__, 'po_atsaukimo' ), 30, 1 );
		add_action( 'template_redirect', array( __CLASS__, 'atkurti_krepseli' ) );
	}

	public static function cron_registruoti() {
		if ( ! wp_next_scheduled( self::CRON ) ) { wp_schedule_event( time() + 300, 'hourly', self::CRON ); }
	}

	/* ---------- Sargai ---------- */

	public static function naujesnis( $order ) {
		global $wpdb;
		$email = strtolower( trim( (string) $order->get_billing_email() ) );
		if ( '' === $email ) { return array( 'yra' => false, 'apmoketas' => false ); }
		$r = $wpdb->get_results( $wpdb->prepare(
			"SELECT id,status FROM {$wpdb->prefix}wc_orders WHERE type='shop_order' AND id>%d AND LOWER(billing_email)=%s AND status IN ('wc-pending','wc-on-hold','wc-processing','wc-completed')",
			(int) $order->get_id(), $email ), ARRAY_A );
		$apm = false; foreach ( (array) $r as $x ) { if ( in_array( $x['status'], array( 'wc-processing', 'wc-completed' ), true ) ) { $apm = true; } }
		return array( 'yra' => ! empty( $r ), 'apmoketas' => $apm, 'ids' => wp_list_pluck( (array) $r, 'id' ) );
	}

	public static function laukti( $order ) {
		foreach ( wc_get_order_notes( array( 'order_id' => $order->get_id(), 'type' => 'internal' ) ) as $n ) {
			if ( false !== strpos( (string) $n->content, 'LAUKTI' ) ) { return true; }
		}
		return false;
	}

	/* ---------- Bacs cron ---------- */

	public static function cron_run( $dry = false ) {
		$out = array( 'v' => self::VER, 'dry' => (bool) $dry, 'dabar' => gmdate( 'Y-m-d H:i:s' ) );
		$ids = wc_get_orders( array( 'status' => 'on-hold', 'payment_method' => 'bacs', 'limit' => 100, 'return' => 'ids', 'orderby' => 'ID', 'order' => 'ASC' ) );
		$now = time();
		foreach ( $ids as $id ) {
			$o = wc_get_order( $id ); if ( ! $o ) { continue; }
			$nr = $o->get_order_number(); $row = array( 'id' => $id, 'nr' => $nr );
			if ( $o->get_meta( '_petshop_test' ) || 'bacs' !== $o->get_payment_method() ) { $row['veiksmas'] = 'praleista'; $out['eil'][] = $row; continue; }
			if ( self::laukti( $o ) ) { $row['veiksmas'] = 'LAUKTI'; $out['eil'][] = $row; continue; }
			$sukurta = $o->get_date_created() ? $o->get_date_created()->getTimestamp() : $now;
			$amz = $now - $sukurta; $row['val'] = round( $amz / 3600, 1 );
			$n = self::naujesnis( $o ); $row['naujesnis'] = $n;
			$priminta = (bool) $o->get_meta( '_ps_bacs_priminta' );
			if ( $amz >= self::ATSAUK_PO ) {
				$tyliai = $n['apmoketas'];
				$row['veiksmas'] = $tyliai ? 'atsaukti_tyliai' : 'atsaukti';
				if ( ! $dry ) { self::atsaukti( $o, $tyliai, $n ); }
			} elseif ( $amz >= self::PRIM_PO && ! $priminta ) {
				if ( $n['yra'] ) { $row['veiksmas'] = 'priminimas_praleistas_naujesnis'; if ( ! $dry ) { $o->update_meta_data( '_ps_bacs_priminta', 'praleista_naujesnis_' . gmdate( 'Y-m-d H:i' ) ); $o->add_order_note( 'Bacs priminimas nesiųstas — klientas turi naujesnį užsakymą #' . implode( ',#', $n['ids'] ) . ' (S1676).' ); $o->save(); } }
				else { $row['veiksmas'] = 'priminimas'; if ( ! $dry ) { $row['siusta'] = self::priminti( $o ); } }
			} else { $row['veiksmas'] = $priminta ? 'laukia_72' : 'laukia_48'; }
			$out['eil'][] = $row;
		}
		update_option( 'ps_bacs_priminimas_pask', $out, false );
		return $out;
	}

	public static function rekvizitai() {
		// Tas pats šaltinis kaip darbalaukio „ačiū" puslapio / pakartotinio laiško (v3.23): PAKART_BANKAS.
		$acc = get_option( 'woocommerce_bacs_accounts', array() );
		$a = is_array( $acc ) && ! empty( $acc[0] ) ? $acc[0] : array();
		$iban = ! empty( $a['iban'] ) ? $a['iban'] : ''; $gav = ! empty( $a['account_name'] ) ? $a['account_name'] : ''; $bank = ! empty( $a['bank_name'] ) ? $a['bank_name'] : '';
		if ( '' === $iban && class_exists( 'Petshop_Darbalaukis' ) && defined( 'Petshop_Darbalaukis::PAKART_BANKAS' ) ) {
			$d = array_map( 'trim', explode( '·', Petshop_Darbalaukis::PAKART_BANKAS ) );
			$gav = isset( $d[0] ) ? $d[0] : $gav; $bank = isset( $d[1] ) ? $d[1] : $bank; $iban = isset( $d[2] ) ? $d[2] : '';
		}
		return array( 'gavejas' => $gav ? $gav : 'UAB Avesa', 'iban' => $iban, 'bankas' => $bank );
	}

	public static function priminimo_html( $order ) {
		$nr  = $order->get_order_number();
		$rk  = self::rekvizitai();
		$sukurta = $order->get_date_created() ? $order->get_date_created()->getTimestamp() : time();
		$iki = self::data_lt( $sukurta + self::ATSAUK_PO );
		$suma = html_entity_decode( wp_strip_all_tags( wc_price( $order->get_total(), array( 'currency' => $order->get_currency() ) ) ), ENT_QUOTES, 'UTF-8' );
		$vardas = trim( (string) $order->get_billing_first_name() );
		$greet = function_exists( 'ps_sveiki' ) ? ps_sveiki( $vardas ) : ( $vardas !== '' ? sprintf( 'Sveiki, %s,', esc_html( $vardas ) ) : 'Sveiki,' );
		$body  = Petshop_Email_Layout::p( $greet . ' jūsų užsakymą Nr. ' . esc_html( $nr ) . ' gavome, tačiau mokėjimo dar negavome.' );
		$body .= '<tr><td style="font-size:14px;line-height:1.7;padding-bottom:18px;">'
			. '<strong>Suma:</strong> ' . esc_html( $suma ) . '<br>'
			. '<strong>Gavėjas:</strong> ' . esc_html( $rk['gavejas'] ) . '<br>'
			. ( $rk['iban'] ? '<strong>Sąskaita:</strong> ' . esc_html( $rk['iban'] ) . ( $rk['bankas'] ? ' (' . esc_html( $rk['bankas'] ) . ')' : '' ) . '<br>' : '' )
			. '<strong>Mokėjimo paskirtis:</strong> ' . esc_html( $nr ) . '</td></tr>';
		$body .= Petshop_Email_Layout::p( 'Jei jau apmokėjote, nieko daryti nereikia. Jei mokėjimo negausime iki ' . esc_html( $iki ) . ', užsakymą atšauksime.' );
		$body .= Petshop_Email_Layout::muted( 'Kilus klausimų, atsakykite į šį laišką.' );
		return array( 'subject' => 'Užsakymas Nr. ' . $nr . ' laukia apmokėjimo', 'html' => Petshop_Email_Layout::wrap( array(
			'subject' => 'Užsakymas Nr. ' . $nr . ' laukia apmokėjimo', 'preheader' => 'Mokėjimo dar negavome — prekes laikome jums.',
			'body' => $body, 'flow_class' => 'transactional', 'email' => $order->get_billing_email(),
			'reason' => 'Gavote šį laišką, nes pateikėte užsakymą petshop.lt.' ) ) );
	}

	public static function data_lt( $ts ) {
		$m = array( 1 => 'sausio', 'vasario', 'kovo', 'balandžio', 'gegužės', 'birželio', 'liepos', 'rugpjūčio', 'rugsėjo', 'spalio', 'lapkričio', 'gruodžio' );
		return $m[ (int) wp_date( 'n', $ts ) ] . ' ' . wp_date( 'j', $ts ) . ' d. ' . wp_date( 'H:i', $ts );
	}

	public static function priminti( $order ) {
		$email = $order->get_billing_email(); if ( ! is_email( $email ) ) { return false; }
		$m = self::priminimo_html( $order );
		$ok = wp_mail( $email, $m['subject'], $m['html'], array( 'Content-Type: text/html; charset=UTF-8' ) );
		$order->update_meta_data( '_ps_bacs_priminta', gmdate( 'Y-m-d H:i:s' ) );
		$order->add_order_note( 'Bacs priminimas (+48 val.) klientui ' . ( $ok ? 'išsiųstas' : 'NEPAVYKO' ) . ' (S1676).' );
		$order->save();
		return $ok;
	}

	public static function atsaukti( $order, $tyliai, $n ) {
		$off = function() { return false; };
		if ( $tyliai ) { add_filter( 'woocommerce_email_enabled_customer_cancelled_order', $off, 99 ); }
		$order->update_status( 'cancelled', 'Bacs: neapmokėta per 72 val. — atšaukta automatiškai' . ( $tyliai ? ' tyliai (klientas apmokėjo naujesnį #' . implode( ',#', $n['ids'] ) . ')' : ', klientui išsiųstas WC pranešimas' ) . ' (S1676).' );
		if ( $tyliai ) { remove_filter( 'woocommerce_email_enabled_customer_cancelled_order', $off, 99 ); }
	}

	/* ---------- Po atšaukimo: krepšelio priminimai (b) ---------- */

	public static function po_atsaukimo( $order_id ) {
		$o = wc_get_order( $order_id ); if ( ! $o || $o->get_meta( '_petshop_test' ) ) { return; }
		if ( $o->get_date_paid() ) { return; } // apmokėtas ir atšauktas (grąžinimas) — ne šis kelias
		if ( ! is_email( $o->get_billing_email() ) || ! $o->get_item_count() ) { return; }
		if ( $o->get_meta( '_ps_krep_prim_planuota' ) ) { return; }
		$o->update_meta_data( '_ps_krep_prim_planuota', gmdate( 'Y-m-d H:i:s' ) ); $o->save();
		wp_schedule_single_event( time() + self::KREP_1, self::KREP_HOOK, array( (int) $order_id, 1 ) );
		wp_schedule_single_event( time() + self::KREP_2, self::KREP_HOOK, array( (int) $order_id, 2 ) );
	}

	public static function krepselio_priminimas( $order_id, $etapas ) {
		$o = wc_get_order( $order_id ); if ( ! $o || 'cancelled' !== $o->get_status() ) { return; }
		$n = self::naujesnis( $o );
		if ( $n['yra'] ) { $o->add_order_note( 'Krepšelio priminimas ' . $etapas . ' nesiųstas — naujesnis užsakymas #' . implode( ',#', $n['ids'] ) . ' (S1676).' ); $o->save(); return; }
		if ( ! class_exists( 'Petshop_Email_Dispatch' ) ) { return; }
		$items = array();
		foreach ( $o->get_items() as $it ) { $items[] = array( 'name' => $it->get_name(), 'quantity' => (float) $it->get_quantity() ); }
		$url = add_query_arg( array( 'ps_atkurti' => (int) $order_id, 'k' => self::raktas( $order_id ) ), home_url( '/' ) );
		$flow = 1 === (int) $etapas ? 'cart_abandoned' : 'cart_abandoned_2';
		$job = Petshop_Email_Dispatch::enqueue( $flow, $o->get_billing_email(), array( 'cart_items' => $items, 'recovery_url' => $url, 'order_id' => (int) $order_id ), array( 'source' => 'bacs_priminimas_s1676' ) );
		$o->add_order_note( 'Krepšelio priminimas ' . $etapas . ' (' . $flow . ') po atšaukimo — dispatch: ' . wp_json_encode( is_array( $job ) ? array_intersect_key( $job, array_flip( array( 'id', 'status', 'skip_reason', 'ok' ) ) ) : $job ) . ' (S1676).' );
		$o->save();
	}

	public static function raktas( $order_id ) { return substr( hash_hmac( 'sha256', 'ps_atkurti_' . (int) $order_id, wp_salt( 'auth' ) ), 0, 16 ); }

	public static function atkurti_krepseli() {
		if ( empty( $_GET['ps_atkurti'] ) || empty( $_GET['k'] ) || ! function_exists( 'WC' ) ) { return; }
		$id = (int) $_GET['ps_atkurti'];
		if ( ! hash_equals( self::raktas( $id ), (string) $_GET['k'] ) ) { return; }
		$o = wc_get_order( $id ); if ( ! $o ) { return; }
		if ( null === WC()->cart ) { wc_load_cart(); }
		$deta = 0;
		foreach ( $o->get_items() as $it ) {
			$pid = $it->get_variation_id() ? $it->get_variation_id() : $it->get_product_id();
			$pr = wc_get_product( $pid ); if ( ! $pr || ! $pr->is_purchasable() || ! $pr->is_in_stock() ) { continue; }
			try { if ( WC()->cart->add_to_cart( $it->get_product_id(), max( 1, (int) $it->get_quantity() ), $it->get_variation_id() ) ) { $deta++; } } catch ( Throwable $e ) {}
		}
		$o->add_order_note( 'Klientas atkūrė krepšelį iš laiško nuorodos — įdėta ' . $deta . ' prekių (S1676).' ); $o->save();
		wp_safe_redirect( wc_get_cart_url() ); exit;
	}
}
Petshop_Bacs_Priminimas::init();
