<?php
/**
 * Šablonas: refill_due — „Pakartoti tą patį" (S1685, Q4 planas lifecycle etapas 1).
 * Pakeičia core refill.php per petshop_email_template_path (Petshop_Pakartoti). Kintamieji: $payload, $flow_class, $recipient. Nustato $subject.
 * Principas: konkreti prekė + paskutinis kiekis + kaina + vienas paspaudimas į kasą; be augintinio vardo (linksniai); be automatinio papildymo pažadų (M10 nėra).
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$email = isset( $recipient ) ? $recipient : ''; $fc = isset( $flow_class ) ? $flow_class : 'service';
$d = class_exists( 'Petshop_Pakartoti' ) ? Petshop_Pakartoti::duomenys( $payload, $email ) : array();
$fb_url = isset( $payload['feedback_url'] ) ? $payload['feedback_url'] : '';
$pav = isset( $d['pavadinimas'] ) ? $d['pavadinimas'] : ( isset( $payload['product_name'] ) ? $payload['product_name'] : 'maisto' );
$kiek = isset( $d['kiekis'] ) ? (int) $d['kiekis'] : 1;

$subject = 'Laikas pakartoti: ' . $pav;

$body = Petshop_Email_Layout::p( 'Pagal ankstesnį pirkimą ši prekė' . ( ! empty( $d['data'] ) ? ' gali baigtis apie ' . esc_html( $d['data'] ) : ' gali netrukus baigtis.' ) );
$body .= Petshop_Email_Layout::p( 'Tas pats užsakymas vienu paspaudimu — ' . $kiek . ' vnt.' . ( ! empty( $d['kaina'] ) ? ', ' . esc_html( $d['kaina'] ) . ' €' : '' ) . ' — pristatysime taip pat greitai, kaip praeitą kartą.' );
if ( ! empty( $d['kasa'] ) ) $body .= Petshop_Email_Layout::button( $d['kasa'], 'Pakartoti tą patį' );
$antr = array();
if ( ! empty( $d['preke'] ) ) $antr['Peržiūrėti prekę'] = $d['preke'];
if ( $fb_url ) $antr['Patikslinti priminimą'] = $fb_url;
if ( ! empty( $d['optout'] ) ) $antr['Nenoriu tokių priminimų'] = $d['optout'];
if ( $antr ) $body .= Petshop_Email_Layout::secondary( $antr );

echo Petshop_Email_Layout::wrap( array(
	'subject'    => $subject,
	'preheader'  => 'Tas pats užsakymas vienu paspaudimu.',
	'body'       => $body,
	'flow_class' => $fc,
	'email'      => $email,
	'reason'     => 'Gavote šį laišką, nes pirkote šią prekę petshop.lt. Priminimų galite atsisakyti nuoroda aukščiau.',
) );
