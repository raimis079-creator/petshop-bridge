<?php
/**
 * Petshop Partijos v1.4 (S1676) — po gavimo `do_action('ps_partija_priimta', $pid, $kiekis, $likutis)` (atvirų užsakymų perrūšiavimas į AV — petshop-gavimo-perrusiavimas).
 * Petshop Partijos v1.3 (S1668) — av_laukas(): tiekėjo prekėms be XML AV likutis → _own_stock_qty.
 *
 * Petshop Partijos v1.2 (S697) — PAKUOCIU SARASAI IR TRYNIMAS.
 *   Savininkas: „nera jokio redagavimo, mes kazka dareme, bet nieko neliko.
 *   As net negaliu susivesti duomenu".
 *   Buvo tiesa: `irasyti_pakuote()` egzistavo nuo pirmos dienos, bet jokia
 *   sasaja jo nekviete — duomenis buvo galima iraSyti tik kodu. Cia pridedama
 *   tai, ko truko sasajai: medziagu ir tipu sarasai VIENOJE vietoje (kad
 *   GPAIS deklaracijoje nesusidarytu „Plastikas", „plastikas" ir „PET" kaip
 *   trys skirtingos medziagos) bei eilutes trynimas.
 *
 * Petshop Partijos v1.0 (S734) — AV PARTIJOS, SAVIKAINA, PAKUOTES
 *
 * KAM: `_cost_price` yra VIENAS skaicius prekei, o realybeje savikaina yra
 * PARTIJOS savybe. Gavai partija uz 30 €, po menesio kita uz 34 € — antrasis
 * irasymas uztrindavo pirmaji, ir marza buvo rodoma nuo paskutines, nors
 * lentynoje dar guli pigiosios. Akcines partijos atvejis (nusipirkai su ZB
 * akcija, o kita menesi akcijos nebera) sistemoje isvis nesimatydavo.
 *
 * APIMTIS — TIK AV (savininko sprendimas 2026-08-10): "savikaina aktualu tik
 * AV turimoms prekems. Dropshipingas cia man neaktualu — ten ateina saskaitos
 * pagal fakta." VF/ZB savikaina lieka is `_vf_cost` / `_zb_cost`.
 *
 * VALIUTOS TAISYKLE: kursas irasomas pirkimo diena ir NIEKADA
 * neperskaiciuojamas. Tai jau ivykusi operacija — veliau kurso svyravimai
 * atsargu vertes nekeicia.
 *
 * SAVIKAINA = svertinis vidurkis is partiju, kuriose DAR YRA likucio.
 * Atsako i vienintelį kasdien svarbu klausima: kiek uzdirbu is to, kas guli
 * lentynoje dabar. Rezultatas rasomas i `_cost_price` kaip greitoji kopija —
 * katalogas skaito ja, ne agregacija, kad 200 eiluciu puslapis neskaiciuotu
 * 200 sumu.
 *
 * NURASYMAS — FEFO (first expired, first out): pirma ta partija, kurios
 * "geriausia iki" arciausiai. Maisto prekyboje tai teisingiau uz FIFO —
 * apsaugo nuo nurasymu del pasibaigusio galiojimo ir sutampa su tuo, kaip
 * realiai imama nuo lentynos.
 *
 * UZSAKYMU KELIAS (nuo v1.1): partijos nurasomos automatiskai, BET likucio
 * sis modulis neliecia — ji mazina `Petshop_AV_Reduce`. Zr. `kabinti_uzsakymus()`.
 *
 * PAKUOTES (GPAIS): importuojant i LT rinka pakuotes deklaruojamos. Liecia
 * TIK partijas su `importuota=1` — VF/ZB prekes yra is LT tiekeju, kurie
 * deklaruoja patys. `vienetu_pakuoteje` yra kritinis laukas: ivezus 60
 * konservu desimtyje dezuciu po 6, pirmine pakuote dauginama is 60, o grupine
 * is 10. Be jo sistema padaugintu dezute is visu vienetu — sesis kartus per
 * daug.
 *
 * v1.1 (S737): partiju nurasymas uzsakymo metu. Kabinamasi prie tu paciu
 *   hook'u kaip `Petshop_AV_Reduce` (payment_complete · status_processing),
 *   bet velesniu prioritetu (25) ir rasoma TIK i `ps_partijos.kiekis_liko`.
 *   Likucio (`_stock`, `_own_stock_qty`) sis modulis NELIECIA — ten jau yra
 *   rasytojas, ir antras tame paciame lauke yra tiksliai ta schema, kuri
 *   sukele S468/S478/S499/S503 incidentus.
 *   Idempotentiskumas per uzsakymo meta `_ps_partijos_nurasyta`.
 *
 * @version 1.1
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! class_exists( 'Petshop_Partijos' ) ) :

class Petshop_Partijos {

	const VERSIJA         = '1.2';
	const SCHEMOS_RAKTAS  = 'ps_partijos_schema';
	const SCHEMOS_VERSIJA = 1;

	/* ============================================================
	 *  LENTELES
	 * ============================================================ */

	public static function lentele()          { global $wpdb; return $wpdb->prefix . 'ps_partijos'; }
	public static function pakuociu_lentele() { global $wpdb; return $wpdb->prefix . 'ps_pakuotes'; }

	public static function uztikrinti_lenteles() {
		global $wpdb;
		if ( (int) get_option( self::SCHEMOS_RAKTAS ) === self::SCHEMOS_VERSIJA ) { return true; }

		$p = self::lentele(); $pk = self::pakuociu_lentele();
		$collate = $wpdb->get_charset_collate();

		$sql1 = "CREATE TABLE {$p} (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			product_id BIGINT UNSIGNED NOT NULL,
			gauta DATE NOT NULL,
			kiekis_gautas INT NOT NULL DEFAULT 0,
			kiekis_liko INT NOT NULL DEFAULT 0,
			savikaina_eur DECIMAL(12,4) NOT NULL DEFAULT 0,
			savikaina_orig DECIMAL(12,4) NULL,
			valiuta VARCHAR(3) NOT NULL DEFAULT 'EUR',
			kursas DECIMAL(12,6) NOT NULL DEFAULT 1,
			geriausia_iki DATE NULL,
			tiekejas VARCHAR(96) NOT NULL DEFAULT '',
			importuota TINYINT(1) NOT NULL DEFAULT 0,
			tiekimas_id BIGINT UNSIGNED NULL,
			pastaba VARCHAR(255) NOT NULL DEFAULT '',
			sukurta DATETIME NOT NULL,
			user_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
			atsaukta TINYINT(1) NOT NULL DEFAULT 0,
			PRIMARY KEY (id),
			KEY preke (product_id),
			KEY likutis (product_id, kiekis_liko),
			KEY galiojimas (geriausia_iki),
			KEY importas (importuota, gauta)
		) {$collate};";

		$sql2 = "CREATE TABLE {$pk} (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			product_id BIGINT UNSIGNED NOT NULL,
			pavadinimas VARCHAR(96) NOT NULL DEFAULT '',
			tipas VARCHAR(24) NOT NULL DEFAULT 'pirmine',
			medziaga VARCHAR(32) NOT NULL DEFAULT '',
			svoris_g DECIMAL(10,2) NOT NULL DEFAULT 0,
			sudetis_json TEXT NULL,
			vienetu_pakuoteje INT NOT NULL DEFAULT 1,
			tiekiama_su_preke TINYINT(1) NOT NULL DEFAULT 1,
			sukurta DATETIME NOT NULL,
			PRIMARY KEY (id),
			KEY preke (product_id)
		) {$collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql1 );
		dbDelta( $sql2 );

		$ok = ( $wpdb->get_var( "SHOW TABLES LIKE '{$p}'" ) === $p )
		   && ( $wpdb->get_var( "SHOW TABLES LIKE '{$pk}'" ) === $pk );
		if ( $ok ) { update_option( self::SCHEMOS_RAKTAS, self::SCHEMOS_VERSIJA, false ); }
		return $ok;
	}

	private static function lentele_yra( $t ) {
		global $wpdb;
		return $wpdb->get_var( "SHOW TABLES LIKE '{$t}'" ) === $t;
	}

	/** Ar sios prekes savikaina valdo partijos (AV), ar tiekejas. */
	public static function av_preke( $pid ) {
		$s = get_post_meta( $pid, '_ps_sandelis', true );
		if ( $s === 'av' ) { return true; }
		if ( $s === '' ) {
			/* Be sandelio zymes: AV, jei nera tiekejo savikainos. */
			foreach ( array( '_vf_cost', '_zb_cost' ) as $k ) {
				$v = get_post_meta( $pid, $k, true );
				if ( $v !== '' && (float) $v > 0 ) { return false; }
			}
			return true;
		}
		return false;
	}

	/* ============================================================
	 *  PARTIJOS IRASYMAS
	 * ============================================================ */

	/**
	 * Naujas gavimas. Sukuria partija IR pakelia AV likuti tiek pat.
	 *
	 * @param array $a kiekis · savikaina · valiuta · kursas · geriausia_iki ·
	 *                 tiekejas · importuota · gauta · pastaba
	 * @return array|WP_Error
	 */
	public static function priimti( $pid, $a ) {
		global $wpdb;
		$pid = (int) $pid;
		if ( ! $pid || get_post_type( $pid ) !== 'product' ) {
			return new WP_Error( 'nera_prekes', 'Prekė nerasta' );
		}
		if ( ! self::uztikrinti_lenteles() ) {
			return new WP_Error( 'nera_lenteles', 'Nepavyko paruošti partijų lentelės' );
		}

		$kiekis = isset( $a['kiekis'] ) ? (int) $a['kiekis'] : 0;
		if ( $kiekis <= 0 ) { return new WP_Error( 'kiekis', 'Kiekis turi būti didesnis už nulį' ); }

		$valiuta = isset( $a['valiuta'] ) ? strtoupper( substr( (string) $a['valiuta'], 0, 3 ) ) : 'EUR';
		$kursas  = isset( $a['kursas'] ) ? (float) str_replace( ',', '.', $a['kursas'] ) : 1.0;
		$sav_iv  = isset( $a['savikaina'] ) ? (float) str_replace( ',', '.', $a['savikaina'] ) : 0;
		if ( $sav_iv <= 0 ) { return new WP_Error( 'savikaina', 'Savikaina turi būti didesnė už nulį' ); }

		if ( $valiuta !== 'EUR' ) {
			if ( $kursas <= 0 ) { return new WP_Error( 'kursas', 'Nurodykite kursą' ); }
			$sav_eur  = round( $sav_iv / $kursas, 4 );
			$sav_orig = $sav_iv;
		} else {
			$sav_eur  = round( $sav_iv, 4 );
			$sav_orig = null;
			$kursas   = 1.0;
		}

		$gal = isset( $a['geriausia_iki'] ) ? trim( (string) $a['geriausia_iki'] ) : '';
		if ( $gal !== '' && ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $gal ) ) {
			return new WP_Error( 'data', 'Galiojimo data turi būti formatu 2027-09-30' );
		}

		$gauta = isset( $a['gauta'] ) && preg_match( '/^\d{4}-\d{2}-\d{2}$/', (string) $a['gauta'] )
			? $a['gauta'] : current_time( 'Y-m-d' );

		$ok = $wpdb->insert( self::lentele(), array(
			'product_id'     => $pid,
			'gauta'          => $gauta,
			'kiekis_gautas'  => $kiekis,
			'kiekis_liko'    => $kiekis,
			'savikaina_eur'  => $sav_eur,
			'savikaina_orig' => $sav_orig,
			'valiuta'        => $valiuta,
			'kursas'         => $kursas,
			'geriausia_iki'  => ( $gal !== '' ? $gal : null ),
			'tiekejas'       => isset( $a['tiekejas'] ) ? substr( (string) $a['tiekejas'], 0, 96 ) : '',
			'importuota'     => ! empty( $a['importuota'] ) ? 1 : 0,
			'tiekimas_id'    => isset( $a['tiekimas_id'] ) ? (int) $a['tiekimas_id'] : null,
			'pastaba'        => isset( $a['pastaba'] ) ? substr( (string) $a['pastaba'], 0, 255 ) : '',
			'sukurta'        => current_time( 'mysql' ),
			'user_id'        => get_current_user_id(),
		) );
		if ( ! $ok ) { return new WP_Error( 'irasymas', 'Nepavyko įrašyti partijos' ); }
		$partijos_id = (int) $wpdb->insert_id;

		/* --- AV likutis pakyla tiek pat --- */
		$buvo = self::av_likutis( $pid );
		self::rasyti_av_likuti( $pid, $buvo + $kiekis );

		/* --- prekes savikaina perskaiciuojama --- */
		$nauja_sav = self::perskaiciuoti_savikaina( $pid );

		/* --- i ivykiu juosta --- */
		if ( class_exists( 'Petshop_Ivykiai' ) ) {
			Petshop_Ivykiai::irasyti( $pid, 'likutis', array(
				'laukas'  => 'partija',
				'sena'    => (string) $buvo,
				'nauja'   => (string) ( $buvo + $kiekis ),
				'op_nr'   => 'PART' . $partijos_id,
				'pastaba' => 'Gavimas: +' . $kiekis . ' vnt. po ' . number_format( $sav_eur, 2, ',', '' ) . ' €'
					. ( $gal !== '' ? ' · iki ' . $gal : '' ),
			) );
		}

		/* v1.4 (S1676): kiti moduliai reaguoja į gavimą (atvirų užsakymų kelias → AV). */
		do_action( 'ps_partija_priimta', $pid, (int) $kiekis, (int) ( $buvo + $kiekis ) );

		return array(
			'partijos_id' => $partijos_id,
			'kiekis'      => $kiekis,
			'savikaina'   => $sav_eur,
			'likutis'     => $buvo + $kiekis,
			'savikaina_prekes' => $nauja_sav,
		);
	}

	/* ============================================================
	 *  AV LIKUTIS — kur rasyti
	 * ============================================================ */

	/**
	 * S590 taisykle: preke be tiekejo -> `_stock`; su tiekeju -> `_own_stock_qty`.
	 * Sis modulis ta pacia taisykle ir taiko, kad neatsirastu antro kelio.
	 */
	public static function av_laukas( $pid ) {
		foreach ( array( '_vf_qty', '_zb_qty' ) as $k ) {
			if ( get_post_meta( $pid, $k, true ) !== '' ) { return '_own_stock_qty'; }
		}
		/* S1668: tiekėjo prekės be XML (Quattro, Prins, Ambrosia, Belacor) — AV likutis
		   yra `_own_stock_qty`, tiekėjo — `_stock` (katalogo v8.0 taisyklė). Iki šiol
		   čia tikrinti tik _vf/_zb laukai, todėl AV gavimas tokioms prekėms keldavo
		   TIEKĖJO likutį (S1637 T1 radinys, #16612 atvejis 2026-09-10). */
		$sand = strtolower( trim( (string) get_post_meta( $pid, '_ps_sandelis', true ) ) );
		if ( $sand !== '' && $sand !== 'av' && $sand !== 'paslauga' ) { return '_own_stock_qty'; }
		return '_stock';
	}

	public static function av_likutis( $pid ) {
		$v = get_post_meta( $pid, self::av_laukas( $pid ), true );
		return ( $v === '' || $v === null ) ? 0 : (int) $v;
	}

	private static function rasyti_av_likuti( $pid, $kiekis ) {
		$kiekis = max( 0, (int) $kiekis );
		$laukas = self::av_laukas( $pid );

		if ( $laukas === '_stock' ) {
			/* Per WC CRUD, kad atsinaujintu lookup lentele ir transientai.
			   `update_post_meta` cia paliktu parduotuve rodancia sena likuti. */
			$prod = wc_get_product( $pid );
			if ( $prod ) {
				$prod->set_manage_stock( true );
				$prod->set_stock_quantity( $kiekis );
				$prod->save();
				return;
			}
		}
		update_post_meta( $pid, $laukas, $kiekis );
	}

	/* ============================================================
	 *  SAVIKAINA
	 * ============================================================ */

	/** Svertinis vidurkis is partiju, kuriose dar yra likucio. NULL — nera. */
	public static function svertine_savikaina( $pid ) {
		global $wpdb;
		if ( ! self::lentele_yra( self::lentele() ) ) { return null; }
		$t = self::lentele();
		$r = $wpdb->get_row( $wpdb->prepare(
			"SELECT SUM(kiekis_liko) k, SUM(kiekis_liko * savikaina_eur) s
			   FROM {$t} WHERE product_id=%d AND atsaukta=0 AND kiekis_liko > 0", $pid ), ARRAY_A );
		if ( ! $r || (int) $r['k'] <= 0 ) { return null; }
		return round( ( (float) $r['s'] ) / ( (int) $r['k'] ), 4 );
	}

	/** Paskutines partijos savikaina — "kiek kainavo paskutinis pirkimas". */
	public static function paskutine_savikaina( $pid ) {
		global $wpdb;
		if ( ! self::lentele_yra( self::lentele() ) ) { return null; }
		$t = self::lentele();
		$v = $wpdb->get_var( $wpdb->prepare(
			"SELECT savikaina_eur FROM {$t} WHERE product_id=%d AND atsaukta=0
			  ORDER BY gauta DESC, id DESC LIMIT 1", $pid ) );
		return $v === null ? null : (float) $v;
	}

	/**
	 * Irasо svertine savikaina i `_cost_price` kaip greitaja kopija.
	 * NELIECIA prekiu, kuriu savikaina valdo tiekejas — ten irasymas nieko
	 * nepakeistu, nes resolveris ima `_vf_cost` / `_zb_cost`.
	 */
	public static function perskaiciuoti_savikaina( $pid ) {
		if ( ! self::av_preke( $pid ) ) { return null; }
		$s = self::svertine_savikaina( $pid );
		if ( $s === null ) { return null; }
		update_post_meta( $pid, '_cost_price', number_format( $s, 2, '.', '' ) );
		return $s;
	}

	/* ============================================================
	 *  NURASYMAS — FEFO
	 * ============================================================ */

	/**
	 * Nurasо kieki is partiju: pirma ta, kurios galiojimas arciausiai;
	 * be galiojimo — seniausia gauta.
	 *
	 * NEKABINAMA prie uzsakymu automatiskai (zr. failo antraste).
	 *
	 * @param bool $dry tik parodyti, is kuriu partiju butu nurasyta
	 */
	public static function nurasyti( $pid, $kiekis, $dry = false ) {
		global $wpdb;
		$pid = (int) $pid; $kiekis = (int) $kiekis;
		if ( $kiekis <= 0 ) { return new WP_Error( 'kiekis', 'Kiekis turi būti teigiamas' ); }
		if ( ! self::lentele_yra( self::lentele() ) ) { return new WP_Error( 'nera_lenteles', 'Nėra partijų lentelės' ); }

		$t = self::lentele();
		/* FEFO: NULL galiojimas i gala (ISNULL pirmiau), tada pagal data, tada seniausia. */
		$partijos = $wpdb->get_results( $wpdb->prepare(
			"SELECT id, kiekis_liko, geriausia_iki, savikaina_eur, gauta
			   FROM {$t} WHERE product_id=%d AND atsaukta=0 AND kiekis_liko > 0
			  ORDER BY ISNULL(geriausia_iki) ASC, geriausia_iki ASC, gauta ASC, id ASC", $pid ), ARRAY_A );

		$liko = $kiekis; $planas = array();
		foreach ( $partijos as $p ) {
			if ( $liko <= 0 ) { break; }
			$imam = min( $liko, (int) $p['kiekis_liko'] );
			$planas[] = array(
				'partijos_id' => (int) $p['id'],
				'imam'        => $imam,
				'buvo'        => (int) $p['kiekis_liko'],
				'geriausia_iki' => $p['geriausia_iki'],
				'savikaina'   => (float) $p['savikaina_eur'],
			);
			$liko -= $imam;
		}

		$rez = array(
			'prasyta'   => $kiekis,
			'padengta'  => $kiekis - $liko,
			'nepadengta'=> $liko,
			'planas'    => $planas,
			'dry'       => (bool) $dry,
		);

		/* Sazininga: jei partijose nepakanka, PARASOMA, o ne tyliai praleidziama. */
		if ( $liko > 0 ) {
			$rez['ispejimas'] = 'Partijose trūksta ' . $liko . ' vnt. — likutis ir partijos nesutampa';
		}
		if ( $dry ) { return $rez; }

		foreach ( $planas as $x ) {
			$wpdb->query( $wpdb->prepare(
				"UPDATE {$t} SET kiekis_liko = kiekis_liko - %d WHERE id=%d AND kiekis_liko >= %d",
				$x['imam'], $x['partijos_id'], $x['imam'] ) );
		}
		self::perskaiciuoti_savikaina( $pid );
		return $rez;
	}

	/* ============================================================
	 *  SKAITYMAS KORTELEI
	 * ============================================================ */

	public static function partijos( $pid, $tik_su_likuciu = false ) {
		global $wpdb;
		if ( ! self::lentele_yra( self::lentele() ) ) { return array(); }
		$t = self::lentele();
		$kur = $wpdb->prepare( 'product_id=%d AND atsaukta=0', $pid );
		if ( $tik_su_likuciu ) { $kur .= ' AND kiekis_liko > 0'; }
		return $wpdb->get_results(
			"SELECT * FROM {$t} WHERE {$kur} ORDER BY gauta DESC, id DESC LIMIT 60", ARRAY_A );
	}

	/** Artimiausias galiojimas is partiju su likuciu. */
	public static function artimiausias_galiojimas( $pid ) {
		global $wpdb;
		if ( ! self::lentele_yra( self::lentele() ) ) { return null; }
		$t = self::lentele();
		return $wpdb->get_var( $wpdb->prepare(
			"SELECT MIN(geriausia_iki) FROM {$t}
			  WHERE product_id=%d AND atsaukta=0 AND kiekis_liko > 0 AND geriausia_iki IS NOT NULL", $pid ) );
	}

	public static function santrauka( $pid ) {
		$sv = self::svertine_savikaina( $pid );
		return array(
			'partiju'         => count( self::partijos( $pid ) ),
			'su_likuciu'      => count( self::partijos( $pid, true ) ),
			'savikaina'       => $sv,
			'paskutine'       => self::paskutine_savikaina( $pid ),
			'av_likutis'      => self::av_likutis( $pid ),
			'artimiausias'    => self::artimiausias_galiojimas( $pid ),
			'valdo_partijos'  => self::av_preke( $pid ),
		);
	}

	/* ============================================================
	 *  PAKUOTES (GPAIS)
	 * ============================================================ */

	public static function pakuotes( $pid ) {
		global $wpdb;
		if ( ! self::lentele_yra( self::pakuociu_lentele() ) ) { return array(); }
		$t = self::pakuociu_lentele();
		return $wpdb->get_results( $wpdb->prepare(
			"SELECT * FROM {$t} WHERE product_id=%d ORDER BY tipas ASC, id ASC", $pid ), ARRAY_A );
	}

	/**
	 * GPAIS medziagos. Sarasas FIKSUOTAS samoningai: deklaracija sumuojama
	 * pagal medziagos pavadinima, todel laisvai rasomas laukas anksciau ar
	 * veliau duotu „Popierius", „popierius" ir „Kartonas" kaip tris eilutes.
	 */
	public static function medziagos() {
		return array(
			'Plastikas'          => 'Plastikas (PET, PE, PP)',
			'Popierius/kartonas' => 'Popierius ir kartonas',
			'Stiklas'            => 'Stiklas',
			'Metalas'            => 'Metalas (juodieji)',
			'Aliuminis'          => 'Aliuminis',
			'Medis'              => 'Medis',
			'Kombinuota'         => 'Kombinuota (kelios medžiagos sluoksniais)',
			'Kita'               => 'Kita',
		);
	}

	/** Pakuotes tipas GPAIS prasme. */
	public static function tipai() {
		return array(
			'pirmine'   => 'Pirminė — ta, kurioje prekė parduodama',
			'grupine'   => 'Grupinė — dėžutė ar plėvelė, apimanti kelis vienetus',
			'transporto'=> 'Transporto — paletė, gaubtas, didelė dėžė',
		);
	}

	/** Eilutes trynimas. Tikrinama, kad eilute priklausytu TAI prekei. */
	public static function trinti_pakuote( $id, $pid ) {
		global $wpdb;
		if ( ! self::lentele_yra( self::pakuociu_lentele() ) ) { return new WP_Error( 'lentele', 'Nėra lentelės' ); }
		$id = (int) $id; $pid = (int) $pid;
		$t = self::pakuociu_lentele();
		$savas = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$t} WHERE id=%d AND product_id=%d", $id, $pid ) );
		if ( ! $savas ) { return new WP_Error( 'nerasta', 'Tokios pakuotės eilutės ties šia preke nėra' ); }
		$wpdb->delete( $t, array( 'id' => $id ), array( '%d' ) );
		return true;
	}

	public static function irasyti_pakuote( $pid, $a ) {
		global $wpdb;
		if ( ! self::uztikrinti_lenteles() ) { return new WP_Error( 'lentele', 'Nėra lentelės' ); }
		$svoris = isset( $a['svoris_g'] ) ? (float) str_replace( ',', '.', $a['svoris_g'] ) : 0;
		if ( $svoris <= 0 ) { return new WP_Error( 'svoris', 'Svoris turi būti didesnis už nulį' ); }
		$vnt = isset( $a['vienetu_pakuoteje'] ) ? max( 1, (int) $a['vienetu_pakuoteje'] ) : 1;

		$duom = array(
			'product_id'        => (int) $pid,
			'pavadinimas'       => isset( $a['pavadinimas'] ) ? substr( (string) $a['pavadinimas'], 0, 96 ) : '',
			'tipas'             => isset( $a['tipas'] ) ? substr( (string) $a['tipas'], 0, 24 ) : 'pirmine',
			'medziaga'          => isset( $a['medziaga'] ) ? substr( (string) $a['medziaga'], 0, 32 ) : '',
			'svoris_g'          => $svoris,
			'sudetis_json'      => isset( $a['sudetis'] ) ? wp_json_encode( $a['sudetis'] ) : null,
			'vienetu_pakuoteje' => $vnt,
			'tiekiama_su_preke' => ! empty( $a['tiekiama_su_preke'] ) ? 1 : 0,
			'sukurta'           => current_time( 'mysql' ),
		);
		if ( ! empty( $a['id'] ) ) {
			$wpdb->update( self::pakuociu_lentele(), $duom, array( 'id' => (int) $a['id'] ) );
			return (int) $a['id'];
		}
		$wpdb->insert( self::pakuociu_lentele(), $duom );
		return (int) $wpdb->insert_id;
	}

	/**
	 * Kiek kilogramu pakuociu susidaro is nurodyto vienetu kiekio.
	 * Grupine pakuote dalijama is `vienetu_pakuoteje` — be to dezute butu
	 * padauginta is visu vienetu.
	 */
	public static function pakuociu_svoris( $pid, $vienetu ) {
		$vienetu = (int) $vienetu;
		$rez = array( 'viso_kg' => 0, 'pagal_medziaga' => array(), 'eilutes' => array() );
		if ( $vienetu <= 0 ) { return $rez; }

		foreach ( self::pakuotes( $pid ) as $p ) {
			$vnt = max( 1, (int) $p['vienetu_pakuoteje'] );
			$pakuociu = $vienetu / $vnt;
			$kg = ( (float) $p['svoris_g'] * $pakuociu ) / 1000;
			$rez['viso_kg'] += $kg;

			$m = $p['medziaga'] !== '' ? $p['medziaga'] : 'Kita';
			if ( ! isset( $rez['pagal_medziaga'][ $m ] ) ) { $rez['pagal_medziaga'][ $m ] = 0; }
			$rez['pagal_medziaga'][ $m ] += $kg;

			$rez['eilutes'][] = array(
				'pavadinimas' => $p['pavadinimas'] !== '' ? $p['pavadinimas'] : $p['tipas'],
				'tipas'       => $p['tipas'],
				'medziaga'    => $m,
				'pakuociu'    => $pakuociu,
				'kg'          => round( $kg, 4 ),
			);
		}
		$rez['viso_kg'] = round( $rez['viso_kg'], 4 );
		foreach ( $rez['pagal_medziaga'] as $m => $kg ) {
			$rez['pagal_medziaga'][ $m ] = round( $kg, 4 );
		}
		return $rez;
	}

	/** Prekes inasas i deklaracija pagal metus — TIK importuotos partijos. */
	public static function gpais_pagal_metus( $pid ) {
		global $wpdb;
		if ( ! self::lentele_yra( self::lentele() ) ) { return array(); }
		$t = self::lentele();
		$eil = $wpdb->get_results( $wpdb->prepare(
			"SELECT YEAR(gauta) metai, SUM(kiekis_gautas) vnt
			   FROM {$t} WHERE product_id=%d AND atsaukta=0 AND importuota=1
			  GROUP BY YEAR(gauta) ORDER BY metai DESC", $pid ), ARRAY_A );

		$out = array();
		foreach ( $eil as $e ) {
			$sv = self::pakuociu_svoris( $pid, (int) $e['vnt'] );
			$out[] = array(
				'metai'          => (int) $e['metai'],
				'vienetu'        => (int) $e['vnt'],
				'viso_kg'        => $sv['viso_kg'],
				'pagal_medziaga' => $sv['pagal_medziaga'],
			);
		}
		return $out;
	}

	/* ============================================================
	 *  UZSAKYMU KELIAS — partiju nurasymas
	 * ============================================================ */

	/**
	 * KABINIMO LOGIKA — sitas modulis LIKUCIO NELIECIA.
	 *
	 * AV likuti jau mazina `Petshop_AV_Reduce::mazinti` (prioritetas 15 prie
	 * `woocommerce_payment_complete` ir `woocommerce_order_status_processing`).
	 * Cia kabinamasi prie TU PACIU hook'u vėlesniu prioritetu (25) ir rasoma
	 * TIK i `ps_partijos.kiekis_liko`. Jokio `_stock`, jokio `_own_stock_qty` —
	 * ten jau buvo keturi gadinimo incidentai (S468, S478, S499, S503), ir
	 * antras rasytojas tame paciame lauke yra tiksliai ta schema, kuri juos
	 * sukele.
	 *
	 * IDEMPOTENTISKUMAS: uzsakymas pazymimas `_ps_partijos_nurasyta`. Abu
	 * hook'ai daznai iššaukiami tam paciam uzsakymui (payment_complete ir
	 * status_processing), todel be zymes partijos nusirasytu dukart.
	 */
	public static function kabinti_uzsakymus() {
		add_action( 'woocommerce_payment_complete', array( __CLASS__, 'uzsakymo_nurasymas' ), 25, 1 );
		add_action( 'woocommerce_order_status_processing', array( __CLASS__, 'uzsakymo_nurasymas' ), 25, 1 );
		add_action( 'woocommerce_order_status_completed', array( __CLASS__, 'uzsakymo_nurasymas' ), 25, 1 );
	}

	public static function uzsakymo_nurasymas( $order_id ) {
		$order_id = (int) $order_id;
		if ( ! $order_id || ! function_exists( 'wc_get_order' ) ) { return; }
		$order = wc_get_order( $order_id );
		if ( ! $order ) { return; }

		/* Jau nurasyta — antras hook'as to paties uzsakymo neliecia. */
		if ( $order->get_meta( '_ps_partijos_nurasyta' ) ) { return; }

		if ( ! self::lentele_yra( self::lentele() ) ) { return; }

		$rez = array( 'nurasyta' => array(), 'praleista' => array(), 'ispejimai' => array() );

		foreach ( $order->get_items() as $item ) {
			if ( ! method_exists( $item, 'get_product_id' ) ) { continue; }
			$pid  = (int) $item->get_product_id();
			$vpid = method_exists( $item, 'get_variation_id' ) ? (int) $item->get_variation_id() : 0;
			$tikras = $vpid ? $vpid : $pid;
			$kiekis = (int) $item->get_quantity();
			if ( ! $tikras || $kiekis <= 0 ) { continue; }

			/* Partijos yra TIK AV prekems. Dropship prekiu partiju nera —
			   ju likutis ir savikaina gyvena tiekejo pusėje. */
			if ( ! self::av_preke( $tikras ) ) {
				$rez['praleista'][] = $tikras . ' (ne AV)';
				continue;
			}

			$n = self::nurasyti( $tikras, $kiekis );
			if ( is_wp_error( $n ) ) {
				$rez['ispejimai'][] = '#' . $tikras . ': ' . $n->get_error_message();
				continue;
			}
			$rez['nurasyta'][] = array(
				'pid'      => $tikras,
				'kiekis'   => $kiekis,
				'padengta' => $n['padengta'],
				'partiju'  => count( $n['planas'] ),
			);
			if ( ! empty( $n['ispejimas'] ) ) {
				$rez['ispejimai'][] = '#' . $tikras . ': ' . $n['ispejimas'];
			}
		}

		$order->update_meta_data( '_ps_partijos_nurasyta', current_time( 'mysql' ) );
		$order->save();

		/* Pastaba uzsakyme — kad veliau matytusi, is kuriu partiju paimta. */
		if ( $rez['nurasyta'] || $rez['ispejimai'] ) {
			$t = array();
			foreach ( $rez['nurasyta'] as $x ) {
				$t[] = '#' . $x['pid'] . ' −' . $x['padengta'] . ' vnt. (' . $x['partiju'] . ' partijos)';
			}
			$zinute = 'Partijos nurašytos: ' . ( $t ? implode( ' · ', $t ) : 'nėra' );
            if ( $rez['ispejimai'] ) {
				$zinute .= "\nĮSPĖJIMAI: " . implode( ' · ', $rez['ispejimai'] );
			}
			$order->add_order_note( $zinute );
		}
	}

	/** Grazinimas i partijas — kviečiamas RANKINIU budu, ne automatiskai. */
	public static function grazinti_i_partija( $partijos_id, $kiekis ) {
		global $wpdb;
		$partijos_id = (int) $partijos_id; $kiekis = (int) $kiekis;
		if ( $partijos_id <= 0 || $kiekis <= 0 ) { return new WP_Error( 'ivestis', 'Netinkami duomenys' ); }
		$t = self::lentele();
		$p = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$t} WHERE id=%d", $partijos_id ), ARRAY_A );
		if ( ! $p ) { return new WP_Error( 'nera', 'Partija nerasta' ); }
		if ( (int) $p['kiekis_liko'] + $kiekis > (int) $p['kiekis_gautas'] ) {
			return new WP_Error( 'per_daug', 'Grąžinus viršytų partijoje gautą kiekį' );
		}
		$wpdb->query( $wpdb->prepare(
			"UPDATE {$t} SET kiekis_liko = kiekis_liko + %d WHERE id=%d", $kiekis, $partijos_id ) );
		self::perskaiciuoti_savikaina( (int) $p['product_id'] );
		return true;
	}

	/** Ar partiju likutis sutampa su AV likuciu — nesutapimai matomi anksti. */
	public static function sutapimo_patikra( $pid ) {
		$partijose = 0;
		foreach ( self::partijos( $pid, true ) as $p ) { $partijose += (int) $p['kiekis_liko']; }
		$av = self::av_likutis( $pid );
		return array(
			'partijose' => $partijose,
			'av'        => $av,
			'skirtumas' => $av - $partijose,
			'sutampa'   => ( $av === $partijose ),
		);
	}

	/* ============================================================
	 *  DIAGNOSTIKA
	 * ============================================================ */

	public static function statistika() {
		global $wpdb;
		if ( ! self::lentele_yra( self::lentele() ) ) { return array( 'lentele' => 'nėra' ); }
		$t = self::lentele(); $pk = self::pakuociu_lentele();
		return array(
			'versija'        => self::VERSIJA,
			'partiju'        => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t}" ),
			'preku'          => (int) $wpdb->get_var( "SELECT COUNT(DISTINCT product_id) FROM {$t}" ),
			'su_likuciu'     => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t} WHERE kiekis_liko > 0" ),
			'importuotu'     => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t} WHERE importuota=1" ),
			'pakuociu_eil'   => self::lentele_yra( $pk ) ? (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$pk}" ) : 'nėra',
			'valiutos'       => $wpdb->get_results( "SELECT valiuta, COUNT(*) c FROM {$t} GROUP BY valiuta", ARRAY_A ),
		);
	}
}

Petshop_Partijos::kabinti_uzsakymus();

endif;
