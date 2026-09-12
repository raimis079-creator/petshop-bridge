<?php
/**
 * Sablonas: cart_abandoned (stage 1, +2 val.)
 *
 * Tekstas pagal petshop_445_pirmi_sablonai_v1.md (SABLONAS 3), TZ §4.4.5.
 *
 * VIENAS pagrindinis CTA — „Grizti i krepseli". JOKIU antriniu nuorodu,
 * jokio cross-sell: sio srauto tikslas VIENAS (TZ §4.4.3).
 *
 * TEMOS FALLBACK:
 *   1 preke   -> „Dar svarstote del [produkto]?"
 *   kitaip    -> „Krepselyje liko jusu prekes" (S1676)
 *
 * Recovery nuoroda ATEINA IS KONTEKSTO (`recovery_url`), sukurta VIENA KARTA
 * po eligibility. Sablonas jos NEGENERUOJA — kitaip retry sukurtu kelias.
 *
 * Kintamieji: $payload, $flow_class, $recipient. Nustato: $subject.
 *
 * @since S322 (2026-07-31)
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

$items = isset( $payload['cart_items'] ) && is_array( $payload['cart_items'] ) ? $payload['cart_items'] : array();
$cta   = ! empty( $payload['recovery_url'] ) ? $payload['recovery_url'] : '';
$email = isset( $recipient ) ? $recipient : '';
$fc    = isset( $flow_class ) ? $flow_class : 'marketing';

/* --- Tema pagal prekiu skaiciu --- */
$count = count( $items );
if ( 1 === $count ) {
	$n = isset( $items[0]['name'] ) ? trim( (string) $items[0]['name'] ) : '';
	$subject = $n !== ''
		? sprintf( 'Dar svarstote dėl %s?', $n )
		: 'Jūsų krepšelis vis dar laukia';
} else {
	$subject = 'Krepšelyje liko jūsų prekės'; // S1676
}

/* --- Kunas --- */
$body = '';

/* S1676 (2026-09-12, Raimio tekstas): vienas tekstas visiems; tema 1 prekei lieka. */
$body .= Petshop_Email_Layout::p(
	'Sveiki, jūsų krepšelis išsaugotas. '
	. 'Jei norėsite tęsti, prekių ieškoti iš naujo nereikės.'
);

/* Prekiu sarasas — be kainu akcentavimo, be nuolaidos tono */
if ( $items ) {
	$li = '';
	foreach ( $items as $i ) {
		$nm = isset( $i['name'] ) ? (string) $i['name'] : '';
		$q  = isset( $i['quantity'] ) ? (float) $i['quantity'] : 0;
		if ( '' === $nm ) { continue; }
		$li .= '<li style="margin-bottom:6px;">' . esc_html( $nm );
		if ( $q > 0 ) {
			$li .= ' — ' . esc_html( rtrim( rtrim( number_format( $q, 2, ',', '' ), '0' ), ',' ) ) . ' vnt.';
		}
		$li .= '</li>';
	}
	if ( $li ) {
		$body .= '<tr><td style="font-size:14px;line-height:1.6;padding-bottom:18px;">'
			. '<ul style="margin:0;padding-left:18px;">' . $li . '</ul></td></tr>';
	}
}

/* VIENAS CTA */
if ( $cta ) {
	$body .= Petshop_Email_Layout::button( $cta, 'Grįžti į krepšelį' );
} else {
	// Be veikiancios nuorodos mygtuko NERODOM — geriau nieko, nei negyvas CTA.
	$body .= Petshop_Email_Layout::muted( 'Krepšelį rasite prisijungę prie petshop.lt.' );
}

$body .= Petshop_Email_Layout::muted( 'Kainos ir prekių prieinamumas gali būti pasikeitę — krepšelį atnaujinsime pagal dabartinį katalogą.' );

echo Petshop_Email_Layout::wrap( array(
	'subject'    => $subject,
	'preheader'  => 'Krepšelis išsaugotas — galite tęsti bet kada.',
	'body'       => $body,
	'flow_class' => $fc,
	'email'      => $email,
	'reason'     => 'Gavote šį laišką, nes sutikote gauti Petshop.lt pasiūlymus.',
) );
