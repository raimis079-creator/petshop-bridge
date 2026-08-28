<?php
/**
 * Plugin Name: Petshop Vertimai
 * Description: Flatsome temos tekstai, kuriems nera lietuvisko vertimo. Tema
 *              tiekia ~14 kalbu (es, de, pl, it, tr, zh...), lietuviu tarp ju
 *              NERA, todel dalis matomu uzrasu lieka angliski. Cia — zodynas,
 *              einantis per `gettext` filtra.
 *
 *              KODEL NE .mo FAILAS: temos atnaujinimas ji istrintu. Filtras
 *              islieka.
 * Version: 1.0
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Vertimai {

	/** Tik tie tekstai, kuriuos MATEME ekrane arba radome sablone. */
	const ZODYNAS = array(
		'flatsome' => array(
			'Posts found'      => 'Rasti straipsniai',
			'Products found'   => 'Rastos prekės',
			'Pages found'      => 'Rasti puslapiai',
			'No results found' => 'Nieko nerasta',
			'Read more'        => 'Skaityti plačiau',
			'Load more'        => 'Rodyti daugiau',
			'Search'           => 'Ieškoti',
			'Continue reading' => 'Skaityti toliau',
			'Older Comments'   => 'Senesni komentarai',
			'Newer Comments'   => 'Naujesni komentarai',
			'Comment navigation' => 'Komentarų naršymas',
		),
	);

	public static function start() {
		add_filter( 'gettext', array( __CLASS__, 'versti' ), 20, 3 );
		add_filter( 'gettext_with_context', array( __CLASS__, 'versti_su_kontekstu' ), 20, 4 );
	}

	public static function versti( $isverstas, $originalas, $domenas ) {
		/* Keiciam TIK tada, kai vertimo sluoksnis nieko nepadare — kitaip
		   uzkloti butume ir tikra vertima, jei jis kada atsirastu. */
		if ( $isverstas !== $originalas ) { return $isverstas; }
		if ( ! isset( self::ZODYNAS[ $domenas ][ $originalas ] ) ) { return $isverstas; }
		return self::ZODYNAS[ $domenas ][ $originalas ];
	}

	public static function versti_su_kontekstu( $isverstas, $originalas, $kontekstas, $domenas ) {
		return self::versti( $isverstas, $originalas, $domenas );
	}

	/** Diagnostikai: ka zodynas apima. */
	public static function apimtis() {
		$n = 0;
		foreach ( self::ZODYNAS as $d => $z ) { $n += count( $z ); }
		return $n;
	}
}
Petshop_Vertimai::start();
