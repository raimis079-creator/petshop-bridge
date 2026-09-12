<?php
/**
 * Sablonas: cart_abandoned_2 (stage 2, +24 val.)
 *
 * TEKSTAS PAGAL SALTINI: petshop_445_pirmi_sablonai_v1.md, SABLONAS 3.
 *   „+24 val., jei neuzbaigta: Krepselis vis dar laukia.
 *    Jei kilo klausimu del pasirinkimo — mielai padesime."
 *
 * Tema — saltinio fallback: „Jusu krepselis vis dar laukia".
 * Antriniu linku NERA (saltinis: „vienas kelias, be antriniu").
 *
 * NUKRYPIMAS NUO SALTINIO (dokumentuotas): saltinis rase, kad consent
 * netikrinamas. Raimio sprendimas 2026-07-31: `cart_abandoned` = MARKETING,
 * consent PRIVALOMAS. Saltinis yra 2026-07-06, veliau uzrakinti sprendimai
 * yra virsesni.
 *
 * Kintamieji: $payload, $flow_class, $recipient. Nustato: $subject.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

$items = isset( $payload['cart_items'] ) && is_array( $payload['cart_items'] ) ? $payload['cart_items'] : array();
$cta   = ! empty( $payload['recovery_url'] ) ? $payload['recovery_url'] : '';
$email = isset( $recipient ) ? $recipient : '';
$fc    = isset( $flow_class ) ? $flow_class : 'marketing';

$subject = 'Jūsų krepšelis dar laukia'; // S1676

/* S1676 (2026-09-12, Raimio tekstas). Atsakymai krenta i From (uzsakymai@) — Raimis skaito. */
$body = Petshop_Email_Layout::p(
	'Sveiki, jūsų pasirinktos prekės vis dar krepšelyje. '
	. 'Jei kyla klausimų ar norite pasitarti dėl pasirinkimo, atsakykite į šį laišką — padėsime.'
);

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

// VIENAS kelias, be antriniu (saltinis).
if ( $cta ) {
	$body .= Petshop_Email_Layout::button( $cta, 'Grįžti į krepšelį' );
} else {
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
