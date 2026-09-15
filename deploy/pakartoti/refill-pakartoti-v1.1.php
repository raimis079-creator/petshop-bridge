<?php
/**
 * Šablonas: refill_due — „Pakartoti tą patį" v1.1 (S1685): visos paskutinio užsakymo sekamos maisto prekės, kiekiai, kainos, suma; vienas mygtukas į kasą (Petshop_Pakartoti::url).
 * Kintamieji: $payload, $flow_class, $recipient. Nustato $subject. Be augintinio vardo (linksniai), be automatinio papildymo pažadų (M10 nėra).
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$email = isset( $recipient ) ? $recipient : ''; $fc = isset( $flow_class ) ? $flow_class : 'service';
$d = class_exists( 'Petshop_Pakartoti' ) ? Petshop_Pakartoti::duomenys( $payload, $email ) : array( 'prekes' => array(), 'nera' => array(), 'suma' => 0, 'data' => '', 'kasa' => '', 'optout' => '' );
$fb_url = isset( $payload['feedback_url'] ) ? $payload['feedback_url'] : '';
$n = count( $d['prekes'] ); $eur = function( $v ) { return number_format( (float) $v, 2, ',', ' ' ) . ' €'; };

$subject = $n > 1 ? 'Laikas pakartoti užsakymą' : 'Laikas pakartoti: ' . ( $n ? $d['prekes'][0]['pav'] : ( isset( $payload['product_name'] ) ? $payload['product_name'] : 'maistą' ) );

$body = Petshop_Email_Layout::p( 'Pagal ankstesnį pirkimą ' . ( $n > 1 ? 'šios prekės' : 'ši prekė' ) . ( $d['data'] ? ' gali baigtis apie ' . esc_html( $d['data'] ) : ' gali netrukus baigtis.' ) );
if ( $n ) {
	$eil = '';
	foreach ( $d['prekes'] as $pr ) { $eil .= '<tr><td style="padding:6px 0;border-bottom:1px solid #EEE;font-size:14px;"><a href="' . esc_url( $pr['url'] ) . '" style="color:#222;text-decoration:none;">' . esc_html( $pr['pav'] ) . '</a></td><td style="padding:6px 8px;border-bottom:1px solid #EEE;font-size:14px;white-space:nowrap;text-align:right;">' . (int) $pr['kiekis'] . ' vnt.</td><td style="padding:6px 0;border-bottom:1px solid #EEE;font-size:14px;white-space:nowrap;text-align:right;">' . esc_html( $eur( $pr['kaina'] ) ) . '</td></tr>'; }
	if ( $n > 1 ) $eil .= '<tr><td colspan="2" style="padding:8px 0;font-size:14px;font-weight:600;">Iš viso</td><td style="padding:8px 0;font-size:14px;font-weight:600;text-align:right;white-space:nowrap;">' . esc_html( $eur( $d['suma'] ) ) . '</td></tr>';
	$body .= '<tr><td style="padding:4px 0 14px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">' . $eil . '</table></td></tr>';
}
if ( $d['nera'] ) $body .= Petshop_Email_Layout::p( 'Šiuo metu nėra: ' . esc_html( implode( ', ', $d['nera'] ) ) . '.' );
$body .= Petshop_Email_Layout::p( ( $n > 1 ? 'Tas pats užsakymas' : 'Ta pati prekė' ) . ' vienu paspaudimu — pristatysime taip pat greitai, kaip praeitą kartą. Kasoje kiekius galėsite pakeisti.' );
if ( $d['kasa'] && $n ) $body .= Petshop_Email_Layout::button( $d['kasa'], $n > 1 ? 'Pakartoti užsakymą' : 'Pakartoti tą patį' );
$antr = array();
if ( $fb_url ) $antr['Patikslinti priminimą'] = $fb_url;
if ( ! empty( $d['optout'] ) ) $antr['Nenoriu tokių priminimų'] = $d['optout'];
if ( $antr ) $body .= Petshop_Email_Layout::secondary( $antr );

echo Petshop_Email_Layout::wrap( array(
	'subject'    => $subject,
	'preheader'  => 'Tas pats užsakymas vienu paspaudimu.',
	'body'       => $body,
	'flow_class' => $fc,
	'email'      => $email,
	'reason'     => 'Gavote šį laišką, nes pirkote šias prekes petshop.lt. Priminimų galite atsisakyti nuoroda aukščiau.',
) );
