<?php
/**
 * Petshop InnoDB sargas v1.0 (S912)
 *
 * KAM: serverio `default_storage_engine` yra MyISAM. Vadinasi kiekviena NAUJA
 * lentele - musu, WP branduolio ar bet kurio plugino - gimtu MyISAM, ir
 * 2026-08-17 atlikta 177 lenteliu konversija po keliu menesiu vel issitryptu.
 *
 * KAIP: WordPress kiekviena SQL uzklausa leidzia per `query` filtra. Cia
 * pagaunam TIK `CREATE TABLE` ir pridedam `ENGINE=InnoDB`. Jokiu papildomu
 * DB uzklausu - todel pasirinktas sis kelias, o ne `SET SESSION
 * default_storage_engine`, kuris kainuotu po viena uzklausa KIEKVIENAM
 * puslapio atidarymui.
 *
 * KAINA: viena `$q[0]` raides patikra kiekvienai uzklausai. Sunkiausias
 * atvejis atmetamas pirmu simboliu, be jokiu funkciju kvietimo.
 *
 * KO NELIECIA (butinos isimtys):
 *   - `CREATE TABLE ... LIKE ...` - `LIKE x ENGINE=InnoDB` yra sintakses
 *     klaida; tokios lenteles paveldi originalo varikli, o originalai jau
 *     visi InnoDB;
 *   - uzklausos, kuriose `ENGINE=` jau nurodytas - autoriaus valia virsesne;
 *   - viskas, kas nera CREATE TABLE.
 *
 * LAIKINAS: tai apeitis. Tikrasis sprendimas - serveriai.lt pakeistas
 * `default_storage_engine` paskyros lygmeniu. Ji pakeitus si faila galima
 * tiesiog istrinti.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

add_filter( 'query', function ( $q ) {

	/* Pigiausia imanoma atmetimo salyga - pirmas simbolis.
	   99,9 % uzklausu (SELECT, INSERT, UPDATE) issikrenta cia. */
	if ( ! isset( $q[0] ) || ( $q[0] !== 'C' && $q[0] !== 'c' ) ) {
		return $q;
	}

	if ( 0 !== stripos( $q, 'CREATE TABLE' ) ) {
		return $q;
	}

	/* Autorius jau nurode varikli - neliecziam. */
	if ( false !== stripos( $q, 'ENGINE=' ) || false !== stripos( $q, 'ENGINE ' ) ) {
		return $q;
	}

	/* CREATE TABLE ... LIKE ... - variklis paveldimas, priedas = klaida. */
	if ( preg_match( '/\bLIKE\b/i', $q ) && ! preg_match( '/\(/', $q ) ) {
		return $q;
	}

	/* Lenteles parametrai po uzdarancio skliausto gali eiti bet kokia tvarka,
	   todel uztenka pridurti gale. Kabliataskis, jei buvo, nuimamas. */
	$sw = rtrim( $q );
	$sw = rtrim( $sw, ';' );

	return $sw . ' ENGINE=InnoDB';

}, 1 );
