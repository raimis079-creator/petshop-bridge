<?php
/**
 * Petshop Atsisakymas v1.0 (H212) — ES 14 d. sutarties atsisakymas kliento paskyroje.
 *
 * GRANDINĖ: klientas užsakymo puslapyje (paskyra ARBA svečio nuoroda su order key)
 * spaudžia „Atsisakyti sutarties" → `_ps_withdrawal` + priežastis + pastaba
 * istorijoje → darbalaukio „Klausimai" kortelė (desk `klausimas()` žymę mato
 * nuo v3.9) → Raimis sprendžia. Klientui iškart išsiunčiamas GAVIMO
 * PATVIRTINIMAS (ES reikalavimas — patvirtinti patvariojoje laikmenoje),
 * parduotuvei — pranešimas.
 *
 * KO MODULIS NEDARO (užrakinti sprendimai): pinigų negrąžina (Paysera refund
 * rankinis), statuso nekeičia, kreditinės nekuria — ji spausdinama esamu wcdn
 * („Spausdinti kreditinę sąskaitą") užsakymo lange.
 *
 * LANGAS: mygtukas rodomas apmokėtiems, neuždarytiems užsakymams iki 30 d.
 * nuo sukūrimo. Teisinį 14 d. nuo PRISTATYMO vertinimą daro žmogus kortelėje —
 * pristatymo datos sistema patikimai nežino, todėl kodas jos neprievartauja.
 */

defined( 'ABSPATH' ) || exit;

class Petshop_Atsisakymas {

	const META    = '_ps_withdrawal';
	const REASON  = '_ps_withdrawal_reason';
	const LANGO_D = 30;

	public static function init() {
		add_action( 'woocommerce_order_details_after_order_table', array( __CLASS__, 'mygtukas' ), 20 );
		add_action( 'wp_loaded', array( __CLASS__, 'apdoroti' ), 20 );
	}

	/** Ar užsakymui rodyti atsisakymo formą. */
	public static function galima( $o ) {
		if ( ! $o instanceof WC_Order ) { return false; }
		if ( $o->get_meta( self::META ) ) { return false; }
		if ( ! $o->is_paid() ) { return false; }
		if ( in_array( $o->get_status(), array( 'cancelled', 'refunded', 'failed', 'lp-cancelled', 'checkout-draft' ), true ) ) { return false; }
		$sukurta = $o->get_date_created();
		if ( ! $sukurta ) { return false; }
		return ( time() - $sukurta->getTimestamp() ) <= self::LANGO_D * DAY_IN_SECONDS;
	}

	/** Forma užsakymo puslapyje (paskyroje ir svečio peržiūroje). */
	public static function mygtukas( $o ) {
		if ( ! self::galima( $o ) ) {
			if ( $o instanceof WC_Order && $o->get_meta( self::META ) ) {
				echo '<p class="ps-atsisakymas-info">Sutarties atsisakymas gautas '
					. esc_html( mysql2date( 'Y-m-d H:i', $o->get_meta( self::META ) ) )
					. '. Susisieksime dėl grąžinimo tvarkos.</p>';
			}
			return;
		}
		?>
		<section class="ps-atsisakymas" style="margin-top:1.5em">
			<details>
				<summary style="cursor:pointer">Atsisakyti sutarties (ES 14 d. teisė)</summary>
				<form method="post" style="margin-top:.8em"
					onsubmit="return confirm('Ar tikrai pranešti apie sutarties atsisakymą šiam užsakymui?');">
					<?php wp_nonce_field( 'ps_atsisakymas_' . $o->get_id() ); ?>
					<input type="hidden" name="ps_atsisakymas" value="<?php echo (int) $o->get_id(); ?>">
					<input type="hidden" name="ps_raktas" value="<?php echo esc_attr( $o->get_order_key() ); ?>">
					<p><label>Priežastis (neprivaloma)<br>
						<textarea name="ps_priezastis" rows="3" style="width:100%;max-width:480px" maxlength="600"></textarea>
					</label></p>
					<button type="submit" class="button">Pranešti apie atsisakymą</button>
					<p><small>Per 14 dienų nuo prekių gavimo turite teisę atsisakyti sutarties
					be priežasties. Gavę pranešimą, susisieksime dėl prekių ir pinigų
					grąžinimo tvarkos (žr. pirkimo taisykles).</small></p>
				</form>
			</details>
		</section>
		<?php
	}

	/** Formos apdorojimas. Tinka ir svečiui — tapatybė per order key + nonce. */
	public static function apdoroti() {
		if ( empty( $_POST['ps_atsisakymas'] ) ) { return; }
		$id = absint( $_POST['ps_atsisakymas'] );
		if ( ! $id || ! check_admin_referer( 'ps_atsisakymas_' . $id ) ) { return; }
		$o = wc_get_order( $id );
		if ( ! $o ) { return; }
		$raktas = isset( $_POST['ps_raktas'] ) ? sanitize_text_field( wp_unslash( $_POST['ps_raktas'] ) ) : '';
		if ( ! hash_equals( $o->get_order_key(), $raktas ) ) { return; }
		if ( is_user_logged_in() && $o->get_customer_id()
			&& (int) $o->get_customer_id() !== get_current_user_id() ) { return; }
		if ( ! self::galima( $o ) ) { return; }

		$priezastis = isset( $_POST['ps_priezastis'] )
			? sanitize_textarea_field( wp_unslash( $_POST['ps_priezastis'] ) ) : '';

		self::pazymeti( $o, $priezastis, 'klientas (užsakymo puslapis)' );

		wp_safe_redirect( add_query_arg( 'ps_atsisakyta', '1', $o->get_view_order_url() ) );
		exit;
	}

	/** Žymė + pastaba + laiškai. Atskirai, kad būtų testuojama ir kviestina iš admin. */
	public static function pazymeti( $o, $priezastis = '', $kas = '' ) {
		$o->update_meta_data( self::META, current_time( 'mysql' ) );
		if ( $priezastis ) { $o->update_meta_data( self::REASON, $priezastis ); }
		$o->add_order_note( 'ES sutarties atsisakymas gautas' . ( $kas ? ' — ' . $kas : '' )
			. ( $priezastis ? '. Priežastis: „' . $priezastis . '"' : '' )
			. '. Užsakymas darbalaukio „Klausimuose". Pinigų grąžinimas rankinis; kreditinė — wcdn mygtuku.', false, true );
		$o->save();

		$mailer = WC()->mailer();

		/* Klientui — gavimo patvirtinimas (patvarioji laikmena). */
		if ( $o->get_billing_email() ) {
			$t = '<p>Sveiki' . ( $o->get_billing_first_name() ? ', ' . esc_html( $o->get_billing_first_name() ) : '' ) . ',</p>'
				. '<p>gavome Jūsų pranešimą apie sutarties atsisakymą (užsakymas Nr. '
				. esc_html( $o->get_order_number() ) . ', ' . esc_html( current_time( 'Y-m-d H:i' ) ) . ').</p>'
				. '<p>Artimiausiu metu susisieksime dėl prekių grąžinimo ir pinigų grąžinimo tvarkos.</p>';
			$mailer->send( $o->get_billing_email(),
				'Gavome Jūsų sutarties atsisakymą — užsakymas Nr. ' . $o->get_order_number(),
				$mailer->wrap_message( 'Sutarties atsisakymas gautas', $t ) );
		}

		/* Parduotuvei — pranešimas tuo pačiu adresu kaip nauji užsakymai. */
		$gavejas = '';
		$em = $mailer->get_emails();
		if ( isset( $em['WC_Email_New_Order'] ) ) { $gavejas = $em['WC_Email_New_Order']->get_recipient(); }
		if ( ! $gavejas ) { $gavejas = get_option( 'admin_email' ); }
		wp_mail( $gavejas,
			'ES atsisakymas: užsakymas #' . $o->get_order_number(),
			"Klientas pranešė apie sutarties atsisakymą.\nUžsakymas: #" . $o->get_order_number()
			. "\nKlientas: " . $o->get_formatted_billing_full_name()
			. ( $priezastis ? "\nPriežastis: " . $priezastis : '' )
			. "\n\nUžsakymas darbalaukio Klausimuose: "
			. admin_url( 'admin.php?page=ps-desk&eile=klausimai' ) );

		return true;
	}
}
Petshop_Atsisakymas::init();

/** Pranešimas klientui po sėkmingo pateikimo. */
add_action( 'woocommerce_before_account_orders', function () {
	if ( isset( $_GET['ps_atsisakyta'] ) ) {
		wc_print_notice( 'Pranešimą apie sutarties atsisakymą gavome — patvirtinimą išsiuntėme el. paštu.', 'success' );
	}
} );
add_action( 'woocommerce_order_details_before_order_table', function () {
	if ( isset( $_GET['ps_atsisakyta'] ) ) {
		wc_print_notice( 'Pranešimą apie sutarties atsisakymą gavome — patvirtinimą išsiuntėme el. paštu.', 'success' );
	}
} );
