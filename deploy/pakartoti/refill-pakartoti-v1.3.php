<?php
/**
 * Šablonas: refill_due — „Pakartoti tą patį" v1.3 (S1685; miniatiūros align=left; be įdėtos lentelės — Outlook ją išmeta už paraščių): visos paskutinio užsakymo sekamos maisto prekės, kiekiai, kainos, suma; vienas mygtukas į kasą (Petshop_Pakartoti::url).
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
	foreach ( $d['prekes'] as $pr ) {
		$img = ''; $po = wc_get_product( $pr['pid'] ); $iid = $po ? $po->get_image_id() : 0; $iu = $iid ? wp_get_attachment_image_url( $iid, 'thumbnail' ) : '';
		if ( $iu ) $img = '<a href="' . esc_url( $pr['url'] ) . '"><img src="' . esc_url( $iu ) . '" width="64" height="64" alt="" align="left" style="width:64px;height:64px;border:0;border-radius:6px;margin:0 12px 0 0;display:block;"></a>';
		$eil .= '<div style="padding:8px 0;border-bottom:1px solid #EEEEEE;overflow:hidden;">' . $img . '<div style="min-height:64px;line-height:1.45;"><a href="' . esc_url( $pr['url'] ) . '" style="color:#1F2A24;text-decoration:none;">' . esc_html( $pr['pav'] ) . '</a><br><span style="color:#7A867C;">' . (int) $pr['kiekis'] . ' vnt. · ' . esc_html( $eur( $pr['kaina'] ) ) . '</span></div><div style="clear:both;"></div></div>';
	}
	if ( $n > 1 ) $eil .= '<div style="padding:9px 0 0;font-weight:700;">Iš viso: ' . esc_html( $eur( $d['suma'] ) ) . '</div>';
	$body .= Petshop_Email_Layout::p( $eil, 14 );
}
if ( $d['nera'] ) { $nera = array_map( function( $x ) { return preg_replace( '/ \(trūksta:.*\)$/u', '', $x ); }, $d['nera'] ); $body .= Petshop_Email_Layout::muted( 'Šiuo metu nėra sandėlyje, todėl neįtraukta: ' . esc_html( implode( '; ', array_unique( $nera ) ) ) . '.', 13 ); }
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
