<?php
/**
 * Sablonas: post_purchase_2d — „Ar su uzsakymu viskas gerai?"
 *
 * TEKSTAS PATVIRTINTAS 2026-07-31 (Raimis):
 *   „Ar su uzsakymu viskas gerai?
 *    Jei siunta dar neatvyko arba kazkas negerai, atsakykite i si laiska —
 *    padesime isspresti."
 *
 * ★ +2 d. skaiciuojama nuo ISSIUNTIMO (`_ps_completed_at`), NE nuo pristatymo.
 *   Laiskas NEGALI teigti, kad siunta jau gauta. Todel „issiuntem", ne „gavote",
 *   ir klausiama atvirai, o ne teigiama, kad viskas pristatyta.
 *
 * ★ REPLY-TO IRODYTAS EMPIRISKAI 2026-07-31 is realaus Sender laisko antrasciu:
 *   `Reply-To: "Petshop.lt" <uzsakymai@petshop.lt>`.
 *   Sprendimas B („atsakykite i si laiska") veikia BE naujos support sistemos.
 *   Adresas rodomas IR tekste — dalis pasto klientu Reply-To nepaiso.
 *
 * ★ VARDAS SAMONINGAI NENAUDOJAMAS. Lietuviu kalba reikalauja sauksmininko
 *   („Sveiki, Raimondai"), automatinis linksniavimas nepatikimas — ta pati
 *   taisykle kaip augintinio vardui (zr. refill.php). `first_name` payload'e
 *   YRA, bet netraukiamas i teksta.
 *
 * ★ M10: jokiu prenumeratos ar automatinio papildymo pazadu (produkto nera).
 *
 * ★ VIENAS KELIAS: pagrindinis veiksmas — ATSAKYTI. Didelio mygtuko NERA
 *   samoningai, kad nekonkuruotu su atsakymu. „Perziureti uzsakyma" — antrinis.
 *
 * Kintamieji: $payload, $flow_class, $recipient. Nustato: $subject.
 *
 * @package petshop-core
 * @since 0.24.1 (S327, 2026-07-31)
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

$nr        = isset( $payload['order_number'] ) ? (string) $payload['order_number'] : '';
$order_url = isset( $payload['order_url'] ) ? (string) $payload['order_url'] : '';
$items     = isset( $payload['items'] ) && is_array( $payload['items'] ) ? $payload['items'] : array();
$email     = isset( $recipient ) ? $recipient : '';
$fc        = isset( $flow_class ) ? $flow_class : 'service';

$subject = 'Ar su užsakymu viskas gerai?';

// Uzsakymo numeris — atpazinimui. Jei numerio nera, sakinys lieka be jo.
$body = Petshop_Email_Layout::p(
	$nr
		? 'Neseniai išsiuntėme jūsų užsakymą Nr. ' . esc_html( $nr ) . '.'
		: 'Neseniai išsiuntėme jūsų užsakymą.'
);

// Prekiu sarasas — kad zmogus is karto atpazintu, apie kuri uzsakyma kalbama.
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

// PAGRINDINE ZINUTE — Raimio patvirtinto teksto ANTRA eilute.
// ★ Pirma eilute („Ar su uzsakymu viskas gerai?") yra ANTRASTE (subject),
//   todel CIA jos NEKARTOJAM. S327 pirmoje versijoje ji buvo abiejose
//   vietose — antraste ir tekstas skambejo identiskai.
$body .= Petshop_Email_Layout::p(
	'Jei siunta dar neatvyko arba kažkas negerai, '
	. 'atsakykite į šį laišką — padėsime išspręsti.'
);

// Adresas rodomas ir tekste (dalis pasto klientu Reply-To nepaiso).
$body .= Petshop_Email_Layout::muted(
	'Taip pat galite rašyti adresu uzsakymai@petshop.lt.'
);

// Antrinis, TEKSTINIS veiksmas — kad nekonkuruotu su atsakymu.
if ( $order_url ) {
	$body .= Petshop_Email_Layout::secondary( array( 'Peržiūrėti užsakymą' => $order_url ) );
}

echo Petshop_Email_Layout::wrap( array(
	'subject'    => $subject,
	'preheader'  => 'Jei kas nors negerai — atsakykite į šį laišką, padėsime išspręsti.',
	'body'       => $body,
	'flow_class' => $fc,
	'email'      => $email,
	'reason'     => 'Gavote šį laišką, nes neseniai pirkote petshop.lt.',
) );
