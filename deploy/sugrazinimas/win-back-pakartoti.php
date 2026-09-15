<?php
/**
 * Šablonas: win_back — „Pakartoti ankstesnį užsakymą?" v1.0 (S1686, Raimio galutinis tekstas 09-16): paprastesnis už refill — be „turėjo/galėjo baigtis" (nežinom, ką klientas darė per mėnesį), be spaudimo, ankstesnio pirkimo tęsinys, ne reklama.
 * Prekės/kainos/suma/mygtukas — Petshop_Pakartoti::duomenys (to paties užsakymo sekamos prekės). Be įdėtų 100 % lentelių (Outlook); be nuolaidų; be augintinio vardo.
 * Kintamieji: $payload, $flow_class, $recipient. Nustato $subject.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$email = isset( $recipient ) ? $recipient : ''; $fc = 'service'; // Layout footeris: nuoroda atsisakyti yra antrinėse nuorodose
$d = class_exists( 'Petshop_Pakartoti' ) ? Petshop_Pakartoti::duomenys( $payload, $email ) : array( 'prekes' => array(), 'nera' => array(), 'suma' => 0, 'kasa' => '', 'optout' => '' );
$fb_url = isset( $payload['feedback_url'] ) ? $payload['feedback_url'] : '';
$n = count( $d['prekes'] ); $eur = function( $v ) { return number_format( (float) $v, 2, ',', ' ' ) . ' €'; };

$subject = 'Gal norite pakartoti ankstesnį užsakymą?';

$body = Petshop_Email_Layout::h1( 'Pakartoti ankstesnį užsakymą?' );
$body .= Petshop_Email_Layout::p( 'Praėjo šiek tiek laiko nuo ankstesnio pirkimo. Jei augintiniui vis dar tinka tos pačios prekės, jas galite užsisakyti dar kartą vienu paspaudimu. Kiekius prieš apmokėdami galėsite pakeisti.' );
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
if ( $d['nera'] ) {
	$nera = array_values( array_unique( array_map( function( $x ) { return preg_replace( '/ \(trūksta:.*\)$/u', '', $x ); }, $d['nera'] ) ) ); $kn = count( $nera );
	$body .= Petshop_Email_Layout::p( ( $kn > 1 ? 'Kelių ankstesnio užsakymo prekių šiuo metu neturime, todėl jų neįtraukėme: ' : 'Vienos ankstesnio užsakymo prekės šiuo metu neturime, todėl jos neįtraukėme: ' ) . esc_html( implode( '; ', $nera ) ) . '.', 14 );
}
if ( $d['kasa'] && $n ) {
	$body .= '<tr><td style="padding:4px 0 26px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;"><tr><td align="center" bgcolor="#2d6a35" style="background:#2d6a35;border-radius:8px;">'
		. '<a href="' . esc_url( $d['kasa'] ) . '" style="display:inline-block;padding:14px 44px;font-size:16px;line-height:16px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:8px;">Pakartoti užsakymą</a>'
		. '</td></tr></table></td></tr>';
}
$antr = array();
if ( $fb_url ) $antr['Keisti priminimą'] = $fb_url;
if ( ! empty( $d['optout'] ) ) $antr['Nenoriu tokių priminimų'] = $d['optout'];
if ( $antr ) $body .= Petshop_Email_Layout::secondary( $antr );

echo Petshop_Email_Layout::wrap( array(
	'subject'    => $subject,
	'preheader'  => 'Ankstesnio užsakymo prekes galite pakartoti vienu paspaudimu.',
	'body'       => $body,
	'flow_class' => $fc,
	'email'      => $email,
	'reason'     => 'Gavote šį laišką, nes pirkote šias prekes petshop.lt. Priminimų galite atsisakyti – nuoroda aukščiau.',
) );
