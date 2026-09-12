<?php
/**
 * Plugin Name: Petshop Faktai — Siuntos
 * Description: Siuntu faktu lentele (ps_fakt_siuntos) + pristatymo tarifai (ps_tarifai) + naktinis ps_shipments sutikrinimas. Master planas v1.4 §4.3/§4.9, etapas E1b.
 * Version: 1.7
 *
 * VIENA MINTIS (planas §0): fakto, kurio niekas neuzfiksavo, nebus niekada.
 *
 * KO SIS MODULIS NEDARO:
 *  - neliecia `petshop-desk.php` (Q-E0-1) — visas darbalaukis NELIECIAMAS;
 *  - neliecia `petshop-core/includes/class-shipments.php` — `ps_shipments`
 *    lieka svetima lentele, is jos tik SKAITOM;
 *  - nespeja sandelio. `ps_shipments` sandelio SAMONINGAI nesaugo
 *    (class-shipments.php antraste: „ju patikimo saltinio NETURIME... inferred
 *    reiksmes veliau taptu melagingais duomenimis"). Todel siunta, registruota
 *    aplenkiant darbalauki, gauna `sandelis=NULL`, o ne atspeta reiksme.
 *
 * TRYS SALTINIAI, IS KURIU ATSIRANDA FAKTAS:
 *   1) `petshop_siunta_sukurta` — Desk registracija per Venipak
 *      (`petshop-siuntu-laiskai.php:78`). Zinom SANDELI. `saltinis='desk'`.
 *   2) naktinis cron 00:05 UTC — sutikrina `ps_shipments` su faktais.
 *      Siunta, registruota aplenkiant darbalauki (atvejis aprasytas
 *      siuntu-laiskai:92-93) arba per LP Express, gauna `sandelis=NULL`.
 *      `saltinis='cron'`.
 *   3) `Petshop_Fakt_Siuntos::sutikrinti_uzsakyma()` — rankinis to paties
 *      cron'o kvietimas vienam uzsakymui (DoD patikroms).
 *
 * 🔴 LP EXPRESS (E1b recon R3): `Petshop_Siuntos::prideti_is_plugino()` yra
 * VENIPAK-ONLY (ji skaito `venipak_shipping_order_data`), o Desk ja kviecia tik
 * is dvieju Venipak keliu (desk:694, desk:783). Vadinasi LP Express siunta i
 * kabliuka NIEKADA nepateks ir faktas jai visada ateis is cron'o.
 *
 * Q-E1B-1 UZDARYTAS (Raimis, 2026-08-26): **LP Express siunciama TIK is AV
 * sandelio.** Todel cron LP siuntai raso `sandelis='av'`.
 *
 * KAIP TAI NEPRIESTARAUJA `class-shipments.php` principui („inferred reiksmes
 * veliau taptu melagingais duomenimis"): ten kalbama apie SPEJIMA IS DUOMENU —
 * Venipak `pack_numbers` rasomi visam uzsakymui, is ju sandelio isvesti
 * neimanoma. Cia ne spejimas, o UZRAKINTA VERSLO TAISYKLE. Skirtumas vis delto
 * ISSAUGOMAS lenteleje: naujas stulpelis `sandelio_saltinis`
 *   `desk`     — sandelis STEBETAS registracijos momentu (patikimiausia);
 *   `taisykle` — isvestas is verslo taisykles (LP -> AV);
 *   NULL       — nezinomas.
 * Po dvieju metu niekas neklaus, ar tas „av" buvo pamatytas, ar isvestas.
 * Taisyklei pasikeitus — filtras `petshop_fakt_lp_sandelis`, ir
 * `nakties_sutikrinimas()` persuka atgaline data (jis idempotentiskas).
 *
 * STEBEJIMAS NUGALI TAISYKLE: jei ta pati siunta veliau ateina is Desk su
 * tikru sandeliu, `taisykle` reiksme PERRASOMA; `desk` — niekada.
 *
 * GRANULIARUMAS: **1 fakto eilute = 1 sekimo numeris**. Taip reikalauja pats
 * kontraktas — `shipment_id` yra VIENAS FK i `ps_shipments`, o ten UNIQUE yra
 * `(order_id, carrier, tracking_number)`, t.y. viena eilute vienam numeriui.
 * `paketu_sk` rodo, kiek numeriu buvo TOJE PACIOJE registracijoje (konteksto
 * laukas), o ne kiek fakto eiluciu.
 *
 * `shipment_id` NULL, kol `ps_shipments` dar nesinchronizuota — taip parasyta
 * kontrakte (§4.3). Ju `shp_` rakto algoritmo CIA NEKARTOJAM (butu paslepta
 * priklausomybe): ieskom lenteleje, o ko neradom — palieka NULL ir uzpildo
 * naktinis cron.
 *
 * LAIKO ZONA (planas §3 taisykle 11): visi `*_at` — UTC. Naudojama
 * `Petshop_Faktai::dabar()` / `::verslo_diena()`, kad butu VIENAS saltinis.
 *
 * 🔴 SANDELIU KODU SUVIENODINIMAS (v1.2, rasta uzdarant Q-E1B-1).
 * Projekte gyvena DU skirtingi sandelio kodu rinkiniai:
 *   `_ps_sandelis` meta / Desk : av · zb · vf · quattro · prins · belcor_tofu · ambrosia
 *   `Fulfillment_Source::resolve()` -> `ps_fakt_eilutes.sandelis`
 *      : zb · vf · quattro · ambrosia · belcor_tofu · prins · **legacy**
 * `legacy` ten reiskia butent AV (deployment_log, sandeliu modelis 2026-08-06:
 * „Legacy NERA sandelis — laikinas maisas"; visos 959 legacy publish prekes -> AV).
 *
 * Butu buve: `ps_fakt_siuntos.sandelis='av'` ir `ps_fakt_eilutes.sandelis='legacy'`
 * NIEKADA nesusijungtu JOIN'e — logistikos ataskaita (§5.7) rodytu 0 AV siuntu
 * salia realiu AV eiluciu. Ta pati klaidu seima kaip radiniai #22/#23, tik ne
 * vienetuose, o KODUOSE. Empiriskai matyta rune #4970: uzsakymo 35087 fakto
 * eilutes turi `sandelis='legacy'`, o Desk tam paciam sandeliui sako `av`.
 *
 * Sprendimas: `ps_fakt_siuntos` laiko UZRAKINTA 7 sandeliu modeli;
 * `sandelio_kodas()` verca `legacy` -> `av`; `svoris_g()` sandeliui `av` ima
 * eilutes `sandelis IN ('av','legacy')`. Nezinomas kodas -> NULL, ne spejimas.
 *
 * v1.4 (2026-08-26) — LP EXPRESS KAINODARA. LP saskaitu S-2023/363 analize
 * parode du dalykus, kuriu ankstesne schema nemokejo:
 *   1) PASTOMATU kaina priklauso nuo DYDZIO (XS/S/M/L/XL), ne nuo svorio.
 *      Dydi pries lipduka **parenka Raimis ranka**, ir butent ta reiksme
 *      nukeliauja i LP API bei i `_woo_lithuaniapost_shipping_item_size`.
 *      -> `ps_tarifai.dydis`, `ps_fakt_siuntos.dydis`, `self::dydis()`.
 *   2) LP „Krovos darbai" — EUR/kg dedamoji sunkioms siuntoms.
 *      -> `kaina_uz_kg_ct` + `uz_kg_nuo_g`.
 * Riba (30 kg) ISSKAICIUOTA is saskaitos, ne atspeta: krovos darbu buvo 42 kg;
 * jei riba butu 20 kg, patektu ir 20-30 kg siunta, tad maziausias galimas
 * svoris butu 20+30=50 kg > 42; jei 15 kg — 95 kg. Telpa tik viena versija:
 * riba 30 kg ir viena 42 kg siunta.
 * Kuro priemoka krovos darbams NETAIKOMA (170,22 x 5,48 % = 9,33 EUR).
 * Kaina = baze x (1 + kintamas %) + svoris_kg x (ct/kg).
 *
 * v1.7 (2026-09-12, S1676) — SIUNTOS GYVAVIMAS. Iki v1.7 faktas buvo rasomas TIK sukurimo momentu:
 *   `isvezta_at`/`pristatyta_at`/`statusas`/`dienos_iki_pristatymo` niekada nesikeite (19/19 siuntu po T-0 „processing").
 *   Dabar `gyvavimas($order_id)` uzpildo is darbalaukio meta: `_ps_dalys_issiusta[dalis].laikas` -> isvezta_at,
 *   `_ps_venipak_sekimas[nr]` (k=6 pastomate / k=9 pristatyta, `d` ivykio laikas) -> pristatyta_at (+atsiimta_at, kai k=9 pastomatui),
 *   `_ps_siunta_grizta` -> statusas 'grizta'. Laikai LT -> UTC (`get_gmt_from_date`). dienos_iki_pristatymo = kalendorines dienos
 *   nuo isvezimo iki pristatymo (suapvalinta i virsu). Kablys: po `ps_venipak_sekimas` (prio 20), `woocommerce_order_status_completed`,
 *   naktinis sutikrinimas (visos atviros per 60 d.). Idempotentiska — perraso tik jei reiksme pasikeite.
 * v1.6 (2026-08-26) — EKRANO PATAISA. Stulpelis „Su priedu" po v1.5 rode
 * BAZINE kaina ir vadino ja galutine: jis skaiciavo tik is `kintamas_pct`,
 * kuris v1.5 tapo 0 (priemokos persikele i atskira lentele). Venipak eilute
 * 2,10 EUR butu rodziusi „2,10", nors tikroji kaina 3,01. Rasta VIZUALIOS
 * patikros metu (runas #4993) — serverio testai butu praleide, nes jie
 * tikrino `kaina_is_tarifo()`, o ne ekrana.
 * PAMOKA: kai skaiciavimas persikelia i kita vieta, reikia surasti VISAS
 * vietas, kurios ta pati skaiciavo savarankiskai. Ekranas — irgi vartotojas.
 *
 * v1.5 (2026-08-26) — VEZEJO PRIEMOKOS ATSKIRAI (`ps_tarifu_priemokos`).
 * Venipak saskaita parode, kad vieno `kintamas_pct` nepakanka: yra TRYS
 * kintami dydziai (kuras, atlyginimas, apyvartos nuolaida), keiciantys su
 * skirtingu ritmu. Laikant juos tarifo eilutese, pasikeitus kurui reiketu
 * perrasyti visas 14 eiluciu. Dabar — vienas irasas vezejui.
 * Kaina = baze x (1 + priemokos − nuolaida + kintamas_pct) + svoris_kg x ct/kg.
 *
 * PAMOKA (v1.4): sis failas tuo paciu metu buvo redaguojamas DVIEJUOSE
 * pokalbiu languose. Antras langas idiege v1.2 ir v1.3, o pirmas, pasitikejes
 * ISIMINTU md5, uzklojo juos savo versija. Klaida sugauta tik todel, kad
 * deploy'as grazina `md5_pries` — jis nesutapo su laukiamu. Atstatyta is
 * `ps-backups/petshop-fakt-siuntos.php.bak_lp_20260826_101258`.
 * **TAISYKLE: pries rasant i faila — PERSKAITYTI dabartini md5 is serverio,
 * niekada nepasitiketi tuo, kuris isimintas anksciau sesijoje.**
 *
 * PAMOKA (v1.3): `$t` sitame faile reiskia LENTELES VARDA. Laikinam
 * rezultatui NIEKADA nenaudoti to paties vardo — v1.2 dvi vietos perrase `$t`
 * sandelio reiksme ir `$wpdb->insert()` ejo i `INSERT INTO \`av\``.
 * Klaida praejo pro sintakses sarga (kodas teisingas), pro dry-run (jo nera
 * rasymui) ir bute nepastebeta, nes `irasyti()` grazino tik „failed" be
 * priezasties. Todel v1.3: klaida grazinama SU TEKSTU.
 *
 * KONTRAKTO PAPILDYMAI (deklaruojami atvirai, planas §7 taisykle 5 — i v1.5):
 *   + `diena` DATE  — §3 taisykle 11 reikalauja dienos pjuvio be CONVERT_TZ;
 *   + `saltinis`    — desk|cron|rankinis; be jo neimanoma empiriskai patikrinti
 *                     DoD (a) ir DoD (b) skirtumo;
 *   + `tarifo_id`   — kuris `ps_tarifai` irasas dave `kaina_vezejo_ct` (audito
 *                     seka; be jo kaina butu nepatikrinama);
 *   + `ps_tarifai.pastaba` + `sukurta_at` — Raimis pildo ranka, reikia zymos;
 *   + `sandelio_saltinis` (v1.2) — desk|taisykle|NULL; be jo neimanoma atskirti
 *     STEBETO sandelio nuo ISVESTO.
 *
 * @package Petshop
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Fakt_Siuntos {

	const VERSIJA        = '1.6';
	const FAKT_VERSIJA   = 2;
	const SCHEMOS_RAKTAS = 'ps_fakt_siuntos_schema';
	const SCHEMOS_VER    = 4;

	const CRON     = 'ps_fakt_siuntu_sutikrinimas';
	const PUSLAPIS = 'ps-tarifai';
	const TEVAS    = 'petshop-reports';

	/** Uzrakintos `vezejas` reiksmes (planas §4.3, §15 keitimas 21). */
	const VEZEJAI = array( 'venipak', 'lp_express' );

	/** Uzrakintas 7 sandeliu modelis (Raimio sprendimas 2026-08-06). */
	const SANDELIAI = array( 'av', 'zb', 'vf', 'prins', 'ambrosia', 'quattro', 'belcor_tofu' );

	/** Q-E1B-1 (Raimis 2026-08-26): LP Express siunciama TIK is AV. */
	const LP_SANDELIS = 'av';

	public static function init() {
		add_action( 'petshop_siunta_sukurta', array( __CLASS__, 'is_desko' ), 10, 4 );
		add_action( self::CRON, array( __CLASS__, 'nakties_sutikrinimas' ) );
		/* v1.7 — siuntos gyvavimas */
		add_action( 'ps_venipak_sekimas', array( __CLASS__, 'gyvavimas_atviros' ), 20 );
		add_action( 'woocommerce_order_status_completed', array( __CLASS__, 'gyvavimas' ), 40, 1 );
		add_action( self::CRON, array( __CLASS__, 'gyvavimas_atviros' ), 20 );
		add_action( 'admin_menu', array( __CLASS__, 'meniu' ), 20 );
		add_action( 'admin_post_ps_tarifai_irasyti', array( __CLASS__, 'issaugoti' ) );
		add_action( 'admin_post_ps_tarifai_uzdaryti', array( __CLASS__, 'uzdaryti' ) );
		add_action( 'admin_post_ps_priemoka_irasyti', array( __CLASS__, 'priemoka_irasyti' ) );
		add_action( 'admin_post_ps_priemoka_uzdaryti', array( __CLASS__, 'priemoka_uzdaryti' ) );
		self::planuoti_cron();
	}

	/**
	 * Cron 00:05 UTC = 03:05 Vilniaus. SVARBU: turi eiti PRIES agregavima
	 * (`ps_ataskaitu_agregavimas` 00:15 UTC), kad tos dienos siuntu faktai
	 * jau butu vietoje.
	 */
	public static function planuoti_cron() {
		if ( ! wp_next_scheduled( self::CRON ) ) {
			$rytoj = strtotime( gmdate( 'Y-m-d', time() + DAY_IN_SECONDS ) . ' 00:05:00 UTC' );
			wp_schedule_event( $rytoj, 'daily', self::CRON );
		}
	}

	/* ================================================================== */
	/* LENTELES                                                           */
	/* ================================================================== */

	public static function t_siuntos() { global $wpdb; return $wpdb->prefix . 'ps_fakt_siuntos'; }
	public static function t_tarifai() { global $wpdb; return $wpdb->prefix . 'ps_tarifai'; }
	public static function t_priemokos() { global $wpdb; return $wpdb->prefix . 'ps_tarifu_priemokos'; }

	public static function uztikrinti_lenteles( $priverstinai = false ) {
		if ( ! $priverstinai && (int) get_option( self::SCHEMOS_RAKTAS ) === self::SCHEMOS_VER ) { return; }
		global $wpdb;
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		$cs = $wpdb->get_charset_collate();
		$s  = self::t_siuntos();
		$t  = self::t_tarifai();

		/* ENGINE=InnoDB rasomas aiskumui; `petshop-innodb.php` ji ir taip
		   priverstinai prideda (planas §3 taisykle 5), bet praleidzia, jei
		   autorius jau nurode. */
		dbDelta( "CREATE TABLE $s (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			uzsakymas_id BIGINT UNSIGNED NOT NULL,
			shipment_id VARCHAR(64) NULL DEFAULT NULL,
			sandelis VARCHAR(20) NULL DEFAULT NULL,
			sandelio_saltinis VARCHAR(12) NULL DEFAULT NULL,
			vezejas VARCHAR(20) NOT NULL DEFAULT '',
			siuntos_nr VARCHAR(64) NOT NULL DEFAULT '',
			paketu_sk SMALLINT UNSIGNED NOT NULL DEFAULT 1,
			pristatymo_tipas VARCHAR(20) NULL DEFAULT NULL,
			dydis VARCHAR(4) NULL DEFAULT NULL,
			sukurta_at DATETIME NULL DEFAULT NULL,
			diena DATE NULL DEFAULT NULL,
			tiekejui_issiusta_at DATETIME NULL DEFAULT NULL,
			registruota_at DATETIME NULL DEFAULT NULL,
			isvezta_at DATETIME NULL DEFAULT NULL,
			pristatyta_at DATETIME NULL DEFAULT NULL,
			atsiimta_at DATETIME NULL DEFAULT NULL,
			svoris_deklaruotas_g INT UNSIGNED NULL DEFAULT NULL,
			kaina_vezejo_ct INT NULL DEFAULT NULL,
			tarifo_id BIGINT UNSIGNED NULL DEFAULT NULL,
			statusas VARCHAR(32) NULL DEFAULT NULL,
			problema_kodas VARCHAR(20) NULL DEFAULT NULL,
			dienos_iki_pristatymo SMALLINT NULL DEFAULT NULL,
			saltinis VARCHAR(12) NOT NULL DEFAULT 'cron',
			testinis TINYINT(1) NOT NULL DEFAULT 0,
			saltinis_aplinka VARCHAR(10) NOT NULL DEFAULT 'dev',
			fakt_versija SMALLINT UNSIGNED NOT NULL DEFAULT 1,
			PRIMARY KEY  (id),
			UNIQUE KEY uzs_vez_nr (uzsakymas_id, vezejas, siuntos_nr),
			KEY ship (shipment_id),
			KEY uzs (uzsakymas_id),
			KEY d (diena),
			KEY sand (sandelis)
		) ENGINE=InnoDB ROW_FORMAT=DYNAMIC $cs;" );

		dbDelta( "CREATE TABLE $t (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			vezejas VARCHAR(20) NOT NULL DEFAULT '',
			tipas VARCHAR(20) NOT NULL DEFAULT '',
			svoris_nuo_g INT UNSIGNED NOT NULL DEFAULT 0,
			svoris_iki_g INT UNSIGNED NULL DEFAULT NULL,
			dydis VARCHAR(4) NOT NULL DEFAULT '',
			kaina_ct INT NOT NULL DEFAULT 0,
			kintamas_pct DECIMAL(6,3) NOT NULL DEFAULT 0.000,
			kaina_uz_kg_ct DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
			uz_kg_nuo_g INT UNSIGNED NULL DEFAULT NULL,
			galioja_nuo DATE NOT NULL,
			galioja_iki DATE NULL DEFAULT NULL,
			pastaba VARCHAR(190) NULL DEFAULT NULL,
			sukurta_at DATETIME NULL DEFAULT NULL,
			PRIMARY KEY  (id),
			KEY vez (vezejas, tipas, dydis, galioja_nuo),
			KEY sv (svoris_nuo_g, svoris_iki_g)
		) ENGINE=InnoDB ROW_FORMAT=DYNAMIC $cs;" );

		$pr = self::t_priemokos();
		dbDelta( "CREATE TABLE $pr (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			vezejas VARCHAR(20) NOT NULL DEFAULT '',
			tipas VARCHAR(20) NOT NULL DEFAULT '',
			procentas DECIMAL(7,4) NOT NULL DEFAULT 0.0000,
			galioja_nuo DATE NOT NULL,
			galioja_iki DATE NULL DEFAULT NULL,
			pastaba VARCHAR(190) NULL DEFAULT NULL,
			sukurta_at DATETIME NULL DEFAULT NULL,
			PRIMARY KEY  (id),
			KEY vez (vezejas, galioja_nuo)
		) ENGINE=InnoDB ROW_FORMAT=DYNAMIC $cs;" );

		update_option( self::SCHEMOS_RAKTAS, self::SCHEMOS_VER );
	}

	/* ================================================================== */
	/* PAGALBININKAI — VIENAS saltinis, be savo kopiju                    */
	/* ================================================================== */

	public static function dabar() {
		return class_exists( 'Petshop_Faktai' ) ? Petshop_Faktai::dabar() : current_time( 'mysql', true );
	}

	public static function verslo_diena( $utc ) {
		if ( class_exists( 'Petshop_Faktai' ) ) { return Petshop_Faktai::verslo_diena( $utc ); }
		if ( ! $utc ) { return null; }
		$ts = strtotime( $utc . ' UTC' );
		return $ts ? wp_date( 'Y-m-d', $ts ) : null;
	}

	public static function aplinka() {
		return class_exists( 'Petshop_Faktai' ) ? Petshop_Faktai::aplinka() : 'dev';
	}

	public static function ar_testinis( $order ) {
		return class_exists( 'Petshop_Faktai' ) ? (int) Petshop_Faktai::ar_testinis( $order ) : 1;
	}

	/**
	 * Sandelio svoris gramais IS FAKTU (ne is Woo) — `ps_fakt_eilutes` jau
	 * turi uzsaldyta `svoris_g` ir `sandelis`. Jei sandelis nezinomas (cron),
	 * imamas VISAS uzsakymas.
	 *
	 * @return int|null NULL, jei fakto eiluciu nera arba svoriu nera visai.
	 */
	public static function svoris_g( $uzsakymas_id, $sandelis = null ) {
		global $wpdb;
		if ( ! class_exists( 'Petshop_Faktai' ) ) { return null; }
		$e = Petshop_Faktai::t_eilutes();
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$e'" ) !== $e ) { return null; }

		if ( 'av' === $sandelis ) {
			/* v1.2: `ps_fakt_eilutes` AV prekes vadina `legacy`
			   (Fulfillment_Source), Desk — `av`. Be sios eilutes AV siuntu
			   svoris visada butu NULL, o tarifas — pagal 0 g. */
			$r = $wpdb->get_row( $wpdb->prepare(
				"SELECT COUNT(*) n, SUM(COALESCE(svoris_g,0) * kiekis) sv
				 FROM $e WHERE uzsakymas_id=%d AND sandelis IN ('av','legacy')", (int) $uzsakymas_id ), ARRAY_A );
		} elseif ( $sandelis ) {
			$r = $wpdb->get_row( $wpdb->prepare(
				"SELECT COUNT(*) n, SUM(COALESCE(svoris_g,0) * kiekis) sv
				 FROM $e WHERE uzsakymas_id=%d AND sandelis=%s", (int) $uzsakymas_id, $sandelis ), ARRAY_A );
		} else {
			$r = $wpdb->get_row( $wpdb->prepare(
				"SELECT COUNT(*) n, SUM(COALESCE(svoris_g,0) * kiekis) sv
				 FROM $e WHERE uzsakymas_id=%d", (int) $uzsakymas_id ), ARRAY_A );
		}
		if ( ! $r || ! (int) $r['n'] ) { return null; }
		$sv = (int) $r['sv'];
		return $sv > 0 ? $sv : null;
	}

	/**
	 * Sandelio kodas UZRAKINTAME 7 sandeliu modelyje.
	 * `legacy` (Fulfillment_Source) -> `av` (Desk / `_ps_sandelis`) — zr. antraste.
	 * Nezinomas kodas -> NULL: geriau spraga nei melagingas sandelis.
	 */
	public static function sandelio_kodas( $s ) {
		$s = sanitize_key( (string) $s );
		if ( '' === $s ) { return null; }
		if ( 'legacy' === $s ) { $s = 'av'; }
		return in_array( $s, self::SANDELIAI, true ) ? $s : null;
	}

	/**
	 * Sandelis, isvestas is VERSLO TAISYKLES (ne is duomenu).
	 * Siandien viena taisykle: LP Express siunciama tik is AV (Q-E1B-1).
	 * Grazina NULL, jei taisykles nera — Venipak sandelio isvesti NEIMANOMA.
	 */
	public static function sandelis_pagal_taisykle( $vezejas ) {
		if ( 'lp_express' !== $vezejas ) { return null; }
		return self::sandelio_kodas( apply_filters( 'petshop_fakt_lp_sandelis', self::LP_SANDELIS ) );
	}

	/**
	 * Pristatymo tipas is uzsakymo pristatymo budo.
	 *
	 * NIEKO NESPEJAM. Zemelapis sudarytas is REALIU `method_id`, nuskaitytu is
	 * `woocommerce_shipping_zone_methods` (E1b deploy runas #4968) — visi trys
	 * ijungti metodai parduotuveje:
	 *   shopup_venipak_shipping_courier_method  -> kurjeris
	 *   shopup_venipak_shipping_pickup_method   -> pastomatas  (plugino pav.
	 *       „VENIPAK pastomatai/atsiemimo punktai" — vienas metodas dengia abu;
	 *       Venipak tarifas jiems taip pat vienas)
	 *   woo_lithuaniapost_lpexpress_terminal    -> terminalas
	 *
	 * Pirma tikslus ID, tik po to atsarginis substring'as. Neatpazinta -> NULL,
	 * ir tai matosi ataskaitoje kaip spraga, o ne kaip atspeta reiksme.
	 * Naujam pristatymo metodui — pridedama eilute CIA, ne spejimas.
	 */
	public static function pristatymo_tipas( $order ) {
		if ( ! is_object( $order ) ) { return null; }
		$zem = array(
			'shopup_venipak_shipping_courier_method' => 'kurjeris',
			'shopup_venipak_shipping_pickup_method'  => 'pastomatas',
			'woo_lithuaniapost_lpexpress_terminal'   => 'terminalas',
		);
		$zem = apply_filters( 'petshop_fakt_pristatymo_tipai', $zem );

		foreach ( (array) $order->get_shipping_methods() as $m ) {
			$mid = (string) $m->get_method_id();
			if ( isset( $zem[ $mid ] ) ) { return $zem[ $mid ]; }
		}
		/* Atsarginis kelias — tik jei ID nezinomas. */
		foreach ( (array) $order->get_shipping_methods() as $m ) {
			$id = strtolower( (string) $m->get_method_id() );
			if ( strpos( $id, 'courier' ) !== false ) { return 'kurjeris'; }
			if ( strpos( $id, 'pickup' ) !== false )  { return 'pastomatas'; }
			if ( strpos( $id, 'terminal' ) !== false ) { return 'terminalas'; }
		}
		return null;
	}

	/* ================================================================== */
	/* TARIFAI (planas §4.9, Q5)                                          */
	/* ================================================================== */

	/**
	 * Tarifas, GALIOJES nurodyta diena. Sugriezteja is placiausio i
	 * siauriausia: tikslus tipas nugali tuscia (`tipas=''` = „bet koks").
	 *
	 * @return array|null tarifo eilute
	 */
	/**
	 * LP Express siuntos DYDIS (XS|S|M|L|XL).
	 *
	 * SALTINIS — order meta `_woo_lithuaniapost_shipping_item_size`, kuria
	 * pluginas iraso siuntos sukurimo momentu (order-service.php:829) is to
	 * paties objekto, kuri siunte i LP API.
	 *
	 * KODEL NESKAICIUOJAM PATYS (Raimis, 2026-08-26): pries spausdinant
	 * lipduka dydi **parenka Raimis ranka**. Pluginas turi ir automatini
	 * skaiciavima (`Woo_Lithuaniapost_Admin_Size_Service::resolve_order_size()`,
	 * box-packer per prekiu matmenis su atsargine 10x10x10 cm reiksme), bet
	 * rankinis pasirinkimas ji nugali — o LP apmokestina butent ta, kas
	 * nukeliavo i API. Todel faktas ima REALIA reiksme.
	 *
	 * Venipak dydzio savokos neturi -> NULL.
	 *
	 * @return string|null XS|S|M|L|XL arba NULL
	 */
	public static function dydis( $order, $vezejas ) {
		if ( 'lp_express' !== $vezejas || ! is_object( $order ) ) { return null; }
		$d = $order->get_meta( '_woo_lithuaniapost_shipping_item_size' );
		if ( is_array( $d ) ) { $d = reset( $d ); }
		$d = strtoupper( trim( (string) $d ) );
		return in_array( $d, array( 'XS', 'S', 'M', 'L', 'XL' ), true ) ? $d : null;
	}

	public static function tarifas( $vezejas, $tipas, $svoris_g, $diena, $dydis = null ) {
		global $wpdb;
		$t = self::t_tarifai();
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$t'" ) !== $t ) { return null; }
		$diena = $diena ? $diena : gmdate( 'Y-m-d' );
		$sv    = (int) $svoris_g;
		$dy    = $dydis ? strtoupper( (string) $dydis ) : '';

		$r = $wpdb->get_row( $wpdb->prepare(
			"SELECT * FROM $t
			 WHERE vezejas=%s
			   AND (tipas=%s OR tipas='')
			   AND (dydis=%s OR dydis='')
			   AND svoris_nuo_g <= %d
			   AND (svoris_iki_g IS NULL OR svoris_iki_g >= %d)
			   AND galioja_nuo <= %s
			   AND (galioja_iki IS NULL OR galioja_iki >= %s)
			 ORDER BY (dydis<>'') DESC, (tipas<>'') DESC, galioja_nuo DESC, svoris_nuo_g DESC
			 LIMIT 1",
			(string) $vezejas, (string) $tipas, $dy, $sv, $sv, $diena, $diena ), ARRAY_A );

		return $r ? $r : null;
	}

	/**
	 * Siuntos savikaina centais IS TARIFO, uzsaldoma siuntos momentu
	 * (planas §4.9: „tarifui pasikeitus — nauja eilute; senos siuntos
	 * nesikeicia").
	 *
	 * @return array{0:int|null,1:int|null} [kaina_ct, tarifo_id]
	 */
	/**
	 * Vezejo lygio PRIEMOKOS, galiojusios nurodyta diena (v1.5).
	 *
	 * KODEL ATSKIRA LENTELE, o ne `kintamas_pct` kiekvienoje tarifo eiluteje:
	 * Venipak turi TRIS kintamus dydzius, ir jie keiciasi skirtingu ritmu —
	 * kuro priemoka kas menesi, atlyginimo priemoka kas ketvirti, apyvartos
	 * nuolaida pagal menesio apyvarta. Laikant juos eilutese, pasikeitus kurui
	 * reiketu perrasyti VISAS 14 tarifo eiluciu. Cia — vienas irasas.
	 *
	 * SASKAITOS S-2026-07 STRUKTURA (patikrinta iki cento):
	 *   baze 353,95
	 *   + baze x 25,76 % (kuras)       =  91,17
	 *   + baze x 32,73 % (atlyginimas) = 115,86
	 *   − baze x 15,00 % (apyvartos nuolaida) = −53,09
	 *   = 507,89
	 * Priemokos skaiciuojamos NUO BAZES, ne viena nuo kitos (nuo bazes+kuro
	 * atlyginimo priemoka butu 145,68, o ne 115,86).
	 *
	 * Patys procentai Venipak isvedami vienodai — su 1/3 koeficientu:
	 *   kuras:       (1,95 − 1,10) / 1,10 = 77,27 % ; x 1/3 = 25,76 %
	 *   atlyginimas: (1982 − 1000) / 1000 = 98,20 % ; x 1/3 = 32,73 %
	 *
	 * `nuolaida` saugoma TEIGIAMU skaiciumi ir ATIMAMA.
	 *
	 * @return array{suma_pct: float, eilutes: array}
	 */
	public static function priemokos( $vezejas, $diena ) {
		global $wpdb;
		$t = self::t_priemokos();
		$out = array( 'suma_pct' => 0.0, 'eilutes' => array() );
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$t'" ) !== $t ) { return $out; }
		$diena = $diena ? $diena : gmdate( 'Y-m-d' );

		$eil = $wpdb->get_results( $wpdb->prepare(
			"SELECT * FROM $t
			 WHERE vezejas=%s AND galioja_nuo <= %s
			   AND (galioja_iki IS NULL OR galioja_iki >= %s)
			 ORDER BY tipas, galioja_nuo DESC", (string) $vezejas, $diena, $diena ), ARRAY_A );

		/* Vienam tipui — tik NAUJAUSIA galiojanti eilute. */
		$pagal_tipa = array();
		foreach ( (array) $eil as $r ) {
			if ( isset( $pagal_tipa[ $r['tipas'] ] ) ) { continue; }
			$pagal_tipa[ $r['tipas'] ] = $r;
		}
		$suma = 0.0;
		foreach ( $pagal_tipa as $tipas => $r ) {
			$p = (float) $r['procentas'];
			$suma += ( 'nuolaida' === $tipas ) ? -$p : $p;
			$out['eilutes'][ $tipas ] = $p;
		}
		$out['suma_pct'] = $suma;
		return $out;
	}

	public static function kaina_is_tarifo( $vezejas, $tipas, $svoris_g, $diena, $dydis = null ) {
		$tr = self::tarifas( $vezejas, (string) $tipas, $svoris_g, $diena, $dydis );
		if ( ! $tr ) { return array( null, null ); }
		/* 1) baze + vezejo priemokos + eilutes `kintamas_pct` (isimtims).
		   Visos procentines dedamosios skaiciuojamos NUO BAZES ir sudedamos,
		   ne taikomos viena po kitos — taip skaiciuoja ir Venipak saskaita. */
		$baze  = (int) $tr['kaina_ct'];
		$pr    = self::priemokos( $vezejas, $diena );
		$pct   = (float) $tr['kintamas_pct'] + (float) $pr['suma_pct'];
		$kaina = (int) round( $baze * ( 1 + $pct / 100 ) );

		/* 2) EUR/kg dedamoji (LP „Krovos darbai"), jei siunta pasiekia riba.
		   SVARBU: kuro priemoka jai NETAIKOMA — patikrinta LP saskaitoje
		   S-2023/363: 170,22 x 5,48 % = 9,33 (nuo 172,76 butu 9,47).
		   Todel pridedama PO procento, ne pries. */
		$uz_kg = (float) $tr['kaina_uz_kg_ct'];
		if ( $uz_kg > 0 ) {
			$riba = ( null === $tr['uz_kg_nuo_g'] ) ? 0 : (int) $tr['uz_kg_nuo_g'];
			if ( (int) $svoris_g >= $riba ) {
				$kaina += (int) round( ( (int) $svoris_g / 1000 ) * $uz_kg );
			}
		}
		return array( $kaina, (int) $tr['id'] );
	}

	/* ================================================================== */
	/* RASYTOJAS                                                          */
	/* ================================================================== */

	/**
	 * Kabliukas is `petshop-siuntu-laiskai.php:78` (Q-E0-1).
	 * Desk registruoja PER SANDELI, todel cia — vienintele vieta, kur
	 * sandelis zinomas patikimai.
	 *
	 * @param int    $order_id
	 * @param string $sandelis av|zb|vf|prins|ambrosia|quattro|belcor_tofu
	 * @param string $vezejas  venipak|lp_express
	 * @param array  $numeriai sekimo numeriai, atejusiu su ta registracija
	 */
	public static function is_desko( $order_id, $sandelis, $vezejas, $numeriai ) {
		$numeriai = array_values( array_unique( array_filter( array_map( 'strval', (array) $numeriai ) ) ) );
		if ( ! $numeriai ) { return; }
		$paketu = count( $numeriai );
		foreach ( $numeriai as $nr ) {
			self::irasyti( array(
				'uzsakymas_id' => (int) $order_id,
				'sandelis'          => self::sandelio_kodas( $sandelis ),
				'sandelio_saltinis' => 'desk',
				'vezejas'           => sanitize_key( $vezejas ),
				'siuntos_nr'   => $nr,
				'paketu_sk'    => $paketu,
				'saltinis'     => 'desk',
			) );
		}
	}

	/**
	 * Vienintelis rasymo kelias. Idempotentiskas trimis sluoksniais
	 * (ta pati S1276 schema):
	 *   1) SELECT pries INSERT;
	 *   2) UNIQUE (uzsakymas_id, vezejas, siuntos_nr);
	 *   3) „Duplicate entry" tyliai praleidziamas.
	 * Jei eilute jau yra — PAPILDOM tik tuscius laukus (sandelis is Desk,
	 * shipment_id is cron), pinigu ir laiko NEPERRASOM.
	 *
	 * @return string added|updated|exists|invalid
	 */
	public static function irasyti( $a ) {
		global $wpdb;
		self::uztikrinti_lenteles();
		$t = self::t_siuntos();

		$oid = isset( $a['uzsakymas_id'] ) ? (int) $a['uzsakymas_id'] : 0;
		$vez = isset( $a['vezejas'] ) ? substr( (string) $a['vezejas'], 0, 20 ) : '';
		$nr  = isset( $a['siuntos_nr'] ) ? substr( trim( (string) $a['siuntos_nr'] ), 0, 64 ) : '';
		if ( ! $oid || '' === $vez || '' === $nr ) { return 'invalid'; }

		$order = wc_get_order( $oid );
		if ( ! $order ) { return 'invalid'; }

		$esama = $wpdb->get_row( $wpdb->prepare(
			"SELECT * FROM $t WHERE uzsakymas_id=%d AND vezejas=%s AND siuntos_nr=%s LIMIT 1",
			$oid, $vez, $nr ), ARRAY_A );

		/* --- jau yra: papildom tik tuscius laukus --- */
		if ( $esama ) {
			$upd = array(); $fmt = array();
			$naujas_sand = ! empty( $a['sandelis'] ) ? self::sandelio_kodas( $a['sandelis'] ) : null;
			$naujo_salt  = ! empty( $a['sandelio_saltinis'] ) ? $a['sandelio_saltinis'] : 'desk';

			/* STEBEJIMAS NUGALI TAISYKLE (v1.2): `desk` perraso `taisykle`
			   reiksme, bet `desk` niekada neperrasomas. */
			$galima = empty( $esama['sandelis'] )
				|| ( 'desk' === $naujo_salt && 'taisykle' === $esama['sandelio_saltinis'] );

			if ( $galima && $naujas_sand ) {
				$upd['sandelis']          = $naujas_sand; $fmt[] = '%s';
				$upd['sandelio_saltinis'] = $naujo_salt;  $fmt[] = '%s';
				if ( 'desk' === $naujo_salt ) { $upd['saltinis'] = 'desk'; $fmt[] = '%s'; }
			} elseif ( empty( $esama['sandelis'] ) ) {
				/* v1.2 atgaline data: iki v1.2 irasytos LP eilutes sandelio
				   neturi — uzpildom is taisykles kito sutikrinimo metu. */
				$is_taisykles = self::sandelis_pagal_taisykle( $vez );
				if ( $is_taisykles ) {
					$upd['sandelis']          = $is_taisykles; $fmt[] = '%s';
					$upd['sandelio_saltinis'] = 'taisykle';    $fmt[] = '%s';
				}
			}
			if ( empty( $esama['shipment_id'] ) ) {
				$sid = self::rasti_shipment_id( $oid, $vez, $nr );
				if ( $sid ) { $upd['shipment_id'] = $sid; $fmt[] = '%s'; }
			}
			if ( $upd ) {
				$wpdb->update( $t, $upd, array( 'id' => (int) $esama['id'] ), $fmt, array( '%d' ) );
				return 'updated';
			}
			return 'exists';
		}

		/* --- naujas faktas --- */
		$sukurta  = ! empty( $a['sukurta_at'] ) ? $a['sukurta_at'] : self::dabar();
		$sandelis  = ! empty( $a['sandelis'] ) ? self::sandelio_kodas( $a['sandelis'] ) : null;
		$sand_salt = $sandelis ? ( ! empty( $a['sandelio_saltinis'] ) ? $a['sandelio_saltinis'] : 'desk' ) : null;

		/* Sandelis is Desk = STEBETAS. Jo nesant — verslo taisykle (LP -> AV). */
		if ( ! $sandelis ) {
			$is_taisykles = self::sandelis_pagal_taisykle( $vez );
			if ( $is_taisykles ) { $sandelis = $is_taisykles; $sand_salt = 'taisykle'; }
		}

		/* SVORIUI naudojam TIK stebeta sandeli. Is taisykles isvestas `av`
		   reiskia „visas uzsakymas isejo viena LP siunta", todel svoris —
		   viso uzsakymo, ne vieno sandelio pjuvio. */
		$sand_svoriui = ( 'desk' === $sand_salt ) ? $sandelis : null;

		$tipas    = self::pristatymo_tipas( $order );
		$svoris   = self::svoris_g( $oid, $sand_svoriui );
		$diena    = self::verslo_diena( $sukurta );
		$dydis    = self::dydis( $order, $vez );

		list( $kaina_ct, $tarifo_id ) = self::kaina_is_tarifo( $vez, $tipas, (int) $svoris, $diena, $dydis );

		$eil = array(
			'uzsakymas_id'         => $oid,
			'shipment_id'          => self::rasti_shipment_id( $oid, $vez, $nr ),
			'sandelis'             => $sandelis,
			'sandelio_saltinis'    => $sand_salt,
			'vezejas'              => $vez,
			'siuntos_nr'           => $nr,
			'paketu_sk'            => isset( $a['paketu_sk'] ) ? max( 1, (int) $a['paketu_sk'] ) : 1,
			'pristatymo_tipas'     => $tipas,
			'dydis'                => $dydis,
			'sukurta_at'           => $sukurta,
			'diena'                => $diena,
			'registruota_at'       => ! empty( $a['registruota_at'] ) ? $a['registruota_at'] : $sukurta,
			'svoris_deklaruotas_g' => $svoris,
			'kaina_vezejo_ct'      => $kaina_ct,
			'tarifo_id'            => $tarifo_id,
			'statusas'             => $order->get_status(),
			'saltinis'             => ! empty( $a['saltinis'] ) ? substr( (string) $a['saltinis'], 0, 12 ) : 'cron',
			'testinis'             => self::ar_testinis( $order ),
			'saltinis_aplinka'     => self::aplinka(),
			'fakt_versija'         => self::FAKT_VERSIJA,
		);

		$wpdb->suppress_errors( true );
		$ok = $wpdb->insert( $t, $eil );
		$wpdb->suppress_errors( false );

		if ( ! $ok ) {
			/* Lygiagretus request'as jau iraso — tai NE klaida (S1276). */
			if ( stripos( (string) $wpdb->last_error, 'Duplicate entry' ) !== false ) { return 'exists'; }
			/* v1.3: KLAIDA GRAZINAMA SU TEKSTU. Tylus „failed" v1.2 slepe
			   kintamojo vardo kolizija ($t buvo perrasytas sandelio reiksme ->
			   `INSERT INTO \`av\``); testai rode „failed" ir nieko daugiau.
			   Faktu rasytojas niekada neturi tyleti apie DB klaida. */
			return 'failed: ' . mb_substr( (string) $wpdb->last_error, 0, 160 );
		}
		return 'added';
	}

	/** `ps_shipments.shipment_id` — SKAITOM, algoritmo nekartojam. */
	public static function rasti_shipment_id( $order_id, $vezejas, $nr ) {
		global $wpdb;
		$t = $wpdb->prefix . 'ps_shipments';
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$t'" ) !== $t ) { return null; }
		$v = $wpdb->get_var( $wpdb->prepare(
			"SELECT shipment_id FROM $t WHERE order_id=%d AND carrier=%s AND tracking_number=%s LIMIT 1",
			(int) $order_id, (string) $vezejas, (string) $nr ) );
		return $v ? $v : null;
	}

	/* ================================================================== */
	/* NAKTINIS SUTIKRINIMAS (Q-E0-1)                                     */
	/* ================================================================== */

	/**
	 * `ps_shipments` -> faktai. Idempotentiskas. Uzsakymai, kuriu `wc_orders`
	 * nebera (dev'e 23 nasliaciai), PRALEIDZIAMI — apie tai grazinama zyma,
	 * ne tyla.
	 *
	 * @param bool $dry TRUE — nieko nerasoma, grazinamas planas.
	 */
	public static function nakties_sutikrinimas( $dry = false ) {
		global $wpdb;
		self::uztikrinti_lenteles();
		$sh = $wpdb->prefix . 'ps_shipments';
		$rez = array(
			'dry' => (bool) $dry, 'ts' => self::dabar(),
			'eiluciu' => 0, 'prideta' => 0, 'atnaujinta' => 0, 'buvo' => 0,
			'nasliaciai' => 0, 'nezinomas_vezejas' => 0, 'detales' => array(),
		);
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$sh'" ) !== $sh ) { $rez['klaida'] = 'nera ps_shipments'; return $rez; }

		$eil = $wpdb->get_results( "SELECT * FROM $sh ORDER BY id ASC", ARRAY_A );
		$rez['eiluciu'] = count( $eil );

		foreach ( (array) $eil as $r ) {
			$oid = (int) $r['order_id'];
			$vez = (string) $r['carrier'];
			$nr  = (string) $r['tracking_number'];

			if ( ! in_array( $vez, self::VEZEJAI, true ) ) {
				$rez['nezinomas_vezejas']++;
				$rez['detales'][] = array( $oid, $vez, $nr, 'nezinomas vezejas' );
				continue;
			}
			if ( ! wc_get_order( $oid ) ) {
				$rez['nasliaciai']++;
				continue;
			}
			if ( $dry ) {
				$yra = (int) $wpdb->get_var( $wpdb->prepare(
					"SELECT COUNT(*) FROM " . self::t_siuntos() . " WHERE uzsakymas_id=%d AND vezejas=%s AND siuntos_nr=%s",
					$oid, $vez, $nr ) );
				$rez[ $yra ? 'buvo' : 'prideta' ]++;
				$rez['detales'][] = array( $oid, $vez, $nr, $yra ? 'butu praleista' : ( 'butu prideta, sandelis=' . ( self::sandelis_pagal_taisykle( $vez ) ? self::sandelis_pagal_taisykle( $vez ) . ' (taisykle)' : 'NULL' ) ) );
				continue;
			}

			$st = self::irasyti( array(
				'uzsakymas_id'   => $oid,
				/* Venipak — SAMONINGAI nespejam. LP — verslo taisykle (Q-E1B-1)
				   pritaikoma `irasyti()` viduje, su zyma `sandelio_saltinis='taisykle'`. */
				'sandelis'       => null,
				'vezejas'        => $vez,
				'siuntos_nr'     => $nr,
				'paketu_sk'      => 1,
				'sukurta_at'     => $r['created_at'],
				'registruota_at' => $r['created_at'],
				'saltinis'       => 'cron',
			) );
			if ( 'added' === $st )       { $rez['prideta']++; }
			elseif ( 'updated' === $st ) { $rez['atnaujinta']++; }
			elseif ( 'exists' === $st )  { $rez['buvo']++; }
			else { $rez['klaidu'] = isset( $rez['klaidu'] ) ? $rez['klaidu'] + 1 : 1;
			       $rez['detales'][] = array( $oid, $vez, $nr, $st ); }
		}
		return $rez;
	}


	/* ================================================================== */
	/* v1.7 — SIUNTOS GYVAVIMAS (isvezta / pristatyta / statusas)         */
	/* ================================================================== */

	protected static function lt_i_utc( $laikas ) {
		$laikas = trim( (string) $laikas );
		if ( '' === $laikas || strtotime( $laikas ) === false ) { return null; }
		return get_gmt_from_date( $laikas, 'Y-m-d H:i:s' );
	}

	/** Vienam uzsakymui: faktu eilutes papildomos is darbalaukio meta. Grazina pakeistu eiluciu sarasa. */
	public static function gyvavimas( $order_id, $dry = false ) {
		global $wpdb;
		$order = wc_get_order( (int) $order_id );
		if ( ! $order ) { return array(); }
		$t   = self::t_siuntos();
		$eil = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $t WHERE uzsakymas_id=%d", (int) $order_id ), ARRAY_A );
		if ( ! $eil ) { return array(); }
		$iss = json_decode( (string) $order->get_meta( '_ps_dalys_issiusta' ), true ); if ( ! is_array( $iss ) ) { $iss = array(); }
		$sek = json_decode( (string) $order->get_meta( '_ps_venipak_sekimas' ), true ); if ( ! is_array( $sek ) ) { $sek = array(); }
		$grizta = (string) $order->get_meta( '_ps_siunta_grizta' );
		$out = array();
		foreach ( $eil as $r ) {
			$nr  = (string) $r['siuntos_nr'];
			$s   = isset( $sek[ $nr ] ) && is_array( $sek[ $nr ] ) ? $sek[ $nr ] : array();
			$dalis = ! empty( $s['dalis'] ) ? (string) $s['dalis'] : (string) $r['sandelis'];
			if ( ! isset( $iss[ $dalis ] ) && 1 === count( $iss ) ) { $dalis = (string) array_key_first( $iss ); }
			$isvezta = ( isset( $iss[ $dalis ]['laikas'] ) ) ? self::lt_i_utc( $iss[ $dalis ]['laikas'] ) : null;
			$k = isset( $s['k'] ) ? (int) $s['k'] : null;
			$ivykis = ! empty( $s['d'] ) ? self::lt_i_utc( $s['d'] ) : ( ! empty( $s['tikr'] ) ? self::lt_i_utc( $s['tikr'] ) : null );
			$pristatyta = null; $atsiimta = null;
			if ( 9 === $k ) { $pristatyta = $ivykis; if ( 'pastomatas' === (string) $r['pristatymo_tipas'] || 'terminalas' === (string) $r['pristatymo_tipas'] ) { $atsiimta = $ivykis; } }
			elseif ( 6 === $k ) { $pristatyta = $ivykis; }
			$statusas = (string) $order->get_status();
			if ( $grizta !== '' ) { $statusas = 'grizta'; }
			elseif ( $pristatyta ) { $statusas = ( 9 === $k && $atsiimta ) ? 'atsiimta' : 'pristatyta'; }
			elseif ( $isvezta ) { $statusas = 'issiusta'; }
			$dienos = ( $isvezta && $pristatyta ) ? max( 0, (int) ceil( ( strtotime( $pristatyta ) - strtotime( $isvezta ) ) / DAY_IN_SECONDS ) ) : null;
			$upd = array(); $fmt = array();
			foreach ( array( 'isvezta_at' => array( $isvezta, '%s' ), 'pristatyta_at' => array( $pristatyta, '%s' ), 'atsiimta_at' => array( $atsiimta, '%s' ), 'statusas' => array( $statusas, '%s' ), 'dienos_iki_pristatymo' => array( $dienos, '%d' ) ) as $lauk => $x ) {
				if ( null === $x[0] ) { continue; } // niekada netrinam jau turimos reiksmes
				if ( (string) $r[ $lauk ] !== (string) $x[0] ) { $upd[ $lauk ] = $x[0]; $fmt[] = $x[1]; }
			}
			if ( $upd ) {
				if ( ! $dry ) { $wpdb->update( $t, $upd, array( 'id' => (int) $r['id'] ), $fmt, array( '%d' ) ); }
				$out[] = array( 'id' => (int) $r['id'], 'nr' => $nr, 'upd' => $upd );
			}
		}
		return $out;
	}

	/** Visos atviros (be pristatyta_at) per 60 d. — po sekimo cron ir naktinio sutikrinimo. */
	public static function gyvavimas_atviros( $dry = false ) {
		global $wpdb;
		$t = self::t_siuntos();
		$ids = $wpdb->get_col( $wpdb->prepare( "SELECT DISTINCT uzsakymas_id FROM $t WHERE pristatyta_at IS NULL AND sukurta_at>=%s AND testinis=0", gmdate( 'Y-m-d H:i:s', time() - 60 * DAY_IN_SECONDS ) ) );
		$rez = array( 'uzsakymu' => count( $ids ), 'pakeista' => 0, 'det' => array() );
		foreach ( $ids as $oid ) { $x = self::gyvavimas( (int) $oid, $dry ); if ( $x ) { $rez['pakeista'] += count( $x ); $rez['det'][ $oid ] = $x; } }
		update_option( 'ps_fakt_siuntu_gyvavimas_pask', array( 'ts' => self::dabar(), 'dry' => (bool) $dry, 'uzsakymu' => $rez['uzsakymu'], 'pakeista' => $rez['pakeista'] ), false );
		return $rez;
	}

	/** Tas pats sutikrinimas vienam uzsakymui — DoD patikroms. */
	public static function sutikrinti_uzsakyma( $order_id, $dry = false ) {
		global $wpdb;
		$sh = $wpdb->prefix . 'ps_shipments';
		$out = array( 'uzsakymas' => (int) $order_id, 'dry' => (bool) $dry, 'veiksmai' => array() );
		foreach ( (array) $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $sh WHERE order_id=%d ORDER BY id", (int) $order_id ), ARRAY_A ) as $r ) {
			if ( $dry ) { $out['veiksmai'][] = array( $r['carrier'], $r['tracking_number'], 'dry' ); continue; }
			$out['veiksmai'][] = array( $r['carrier'], $r['tracking_number'], self::irasyti( array(
				'uzsakymas_id' => (int) $order_id, 'sandelis' => null,
				'vezejas' => $r['carrier'], 'siuntos_nr' => $r['tracking_number'],
				'sukurta_at' => $r['created_at'], 'registruota_at' => $r['created_at'], 'saltinis' => 'cron',
			) ) );
		}
		return $out;
	}

	/* ================================================================== */
	/* KONTROLE (DoD)                                                     */
	/* ================================================================== */

	public static function kontrole( $order_id ) {
		global $wpdb;
		$sh = $wpdb->prefix . 'ps_shipments';
		return array(
			'faktai'       => $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . self::t_siuntos() . ' WHERE uzsakymas_id=%d ORDER BY id', (int) $order_id ), ARRAY_A ),
			'ps_shipments' => $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $sh WHERE order_id=%d ORDER BY id", (int) $order_id ), ARRAY_A ),
			'_ps_siuntos'  => get_post_meta( (int) $order_id, '_ps_siuntos', true ),
		);
	}

	/* ================================================================== */
	/* EKRANAS „Pristatymo tarifai" (Raimis pildo pats — Q5)              */
	/* ================================================================== */

	public static function meniu() {
		add_submenu_page( self::TEVAS, 'Pristatymo tarifai', 'Pristatymo tarifai',
			'manage_woocommerce', self::PUSLAPIS, array( __CLASS__, 'puslapis' ) );
	}

	public static function puslapis() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_die( 'Neturite teisiu.' ); }
		global $wpdb;
		self::uztikrinti_lenteles();
		$eil = $wpdb->get_results( 'SELECT * FROM ' . self::t_tarifai() . ' ORDER BY vezejas, tipas, svoris_nuo_g, galioja_nuo DESC', ARRAY_A );
		$url = admin_url( 'admin-post.php' );
		$pr_cache = array();
		$tipai = array( '' => 'bet koks', 'kurjeris' => 'kurjeris', 'pastomatas' => 'pastomatas', 'terminalas' => 'terminalas', 'kurjeris_did' => 'kurjeris (didelis)' );
		?>
		<div class="wrap">
			<h1>Pristatymo tarifai</h1>
			<p class="description">
				Siuntos savikaina uzsaldoma siuntos sukurimo momentu is tarifo, galiojusio TA diena.
				Tarifui pasikeitus — <strong>nauja eilute</strong> su nauja „galioja nuo"; senos siuntos nesikeicia.
				Kainos — <strong>be PVM</strong>, centais (planas §3 taisykle 3).
			</p>

			<h2>Vežėjo priemokos</h2>
			<p class="description">
				Procentai skaičiuojami <strong>nuo bazinės kainos</strong> ir sudedami (ne vienas nuo kito).
				<code>nuolaida</code> įrašoma teigiamu skaičiumi ir atimama.
				Venipak: kuras keičiasi kas mėnesį, atlyginimo priemoka kas ketvirtį, apyvartos nuolaida pagal mėnesio apyvartą.
				Pasikeitus — uždaryk seną eilutę ir įrašyk naują; senos siuntos nesikeičia.
			</p>
			<table class="widefat striped" style="max-width:900px;margin-bottom:12px">
				<thead><tr><th>ID</th><th>Vežėjas</th><th>Tipas</th><th>%</th><th>Galioja</th><th>Pastaba</th><th></th></tr></thead>
				<tbody>
				<?php
				$pr_eil = $wpdb->get_results( 'SELECT * FROM ' . self::t_priemokos() . ' ORDER BY vezejas, tipas, galioja_nuo DESC', ARRAY_A );
				if ( ! $pr_eil ) { echo '<tr><td colspan="7">Priemokų nėra — kaina bus lygi bazei.</td></tr>'; }
				foreach ( (array) $pr_eil as $r ) :
					$akt = ( null === $r['galioja_iki'] || $r['galioja_iki'] >= wp_date( 'Y-m-d' ) ); ?>
					<tr<?php echo $akt ? '' : ' style="opacity:.55"'; ?>>
						<td><?php echo (int) $r['id']; ?></td>
						<td><?php echo esc_html( $r['vezejas'] ); ?></td>
						<td><?php echo esc_html( $r['tipas'] ); ?></td>
						<td><strong><?php echo esc_html( ( 'nuolaida' === $r['tipas'] ? '−' : '+' ) . rtrim( rtrim( (string) $r['procentas'], '0' ), '.' ) ); ?> %</strong></td>
						<td><?php echo esc_html( $r['galioja_nuo'] . ' → ' . ( $r['galioja_iki'] ? $r['galioja_iki'] : '…' ) ); ?></td>
						<td><?php echo esc_html( (string) $r['pastaba'] ); ?></td>
						<td><?php if ( ! $r['galioja_iki'] ) : ?>
							<form method="post" action="<?php echo esc_url( $url ); ?>" style="display:inline">
								<?php wp_nonce_field( 'ps_tarifai' ); ?>
								<input type="hidden" name="action" value="ps_priemoka_uzdaryti">
								<input type="hidden" name="id" value="<?php echo (int) $r['id']; ?>">
								<input type="date" name="galioja_iki" value="<?php echo esc_attr( wp_date( 'Y-m-d' ) ); ?>">
								<button class="button button-small">Uždaryti</button>
							</form>
						<?php endif; ?></td>
					</tr>
				<?php endforeach; ?>
				</tbody>
			</table>
			<form method="post" action="<?php echo esc_url( $url ); ?>" style="margin-bottom:24px">
				<?php wp_nonce_field( 'ps_tarifai' ); ?>
				<input type="hidden" name="action" value="ps_priemoka_irasyti">
				<select name="vezejas"><option value="venipak">Venipak</option><option value="lp_express">LP Express</option></select>
				<select name="tipas">
					<option value="kuras">kuras</option>
					<option value="atlyginimas">atlyginimas</option>
					<option value="nuolaida">nuolaida (atimama)</option>
					<option value="kita">kita</option>
				</select>
				<input type="text" name="procentas" placeholder="pvz. 25,76" required style="width:90px">
				<input type="date" name="galioja_nuo" value="<?php echo esc_attr( wp_date( 'Y-m-d' ) ); ?>" required>
				<input type="text" name="pastaba" placeholder="pastaba" class="regular-text">
				<button class="button button-primary">Įrašyti priemoką</button>
			</form>

			<h2>Naujas tarifas</h2>
			<form method="post" action="<?php echo esc_url( $url ); ?>">
				<?php wp_nonce_field( 'ps_tarifai' ); ?>
				<input type="hidden" name="action" value="ps_tarifai_irasyti">
				<table class="form-table">
					<tr><th>Vezejas</th><td>
						<select name="vezejas" required>
							<option value="venipak">Venipak</option>
							<option value="lp_express">LP Express</option>
						</select></td></tr>
					<tr><th>Tipas</th><td><select name="tipas">
						<?php foreach ( $tipai as $k => $v ) { echo '<option value="' . esc_attr( $k ) . '">' . esc_html( $v ) . '</option>'; } ?>
					</select></td></tr>
					<tr><th>Dydis</th><td><select name="dydis">
						<option value="">— nesvarbu (kaina pagal svori) —</option>
						<?php foreach ( array( 'XS', 'S', 'M', 'L', 'XL' ) as $dd ) { echo '<option value="' . esc_attr( $dd ) . '">' . esc_html( $dd ) . '</option>'; } ?>
					</select> <span class="description">LP pastomatai kainuoja pagal DYDI, ne svori</span></td></tr>
					<tr><th>Svoris nuo (g)</th><td><input type="number" name="svoris_nuo_g" value="0" min="0" step="1"></td></tr>
					<tr><th>Svoris iki (g)</th><td><input type="number" name="svoris_iki_g" value="" min="0" step="1" placeholder="tuscia = be virsutines ribos"></td></tr>
					<tr><th>Kaina be PVM (EUR)</th><td><input type="text" name="kaina_eur" value="" required placeholder="pvz. 2,90"> <span class="description">taskas arba kablelis</span></td></tr>
					<tr><th>Kintamas %</th><td><input type="text" name="kintamas_pct" value="0" placeholder="pvz. 5,48"> <span class="description">kuro priemoka; taikoma TIK bazinei kainai</span></td></tr>
					<tr><th>Papildomai uz kg (ct)</th><td><input type="text" name="kaina_uz_kg_ct" value="0" placeholder="pvz. 6,0476"> <span class="description">LP „Krovos darbai"; kuro priemoka jai NETAIKOMA</span></td></tr>
					<tr><th>… nuo svorio (g)</th><td><input type="number" name="uz_kg_nuo_g" value="" min="0" step="1" placeholder="pvz. 30000"> <span class="description">nuo kada uz kg pradedama skaiciuoti</span></td></tr>
					<tr><th>Galioja nuo</th><td><input type="date" name="galioja_nuo" value="<?php echo esc_attr( wp_date( 'Y-m-d' ) ); ?>" required></td></tr>
					<tr><th>Pastaba</th><td><input type="text" name="pastaba" class="regular-text" value=""></td></tr>
				</table>
				<?php submit_button( 'Irasyti tarifa' ); ?>
			</form>

			<p class="description"><strong>Kaina = bazė × (1 + priemokos − nuolaida + kintamas %) + svoris_kg × (ct/kg).</strong> Stulpelis „Su priemokomis“ rodo pirmąją dalį šiandienos priemokomis; €/kg dedamoji priklauso nuo konkrečios siuntos svorio.
				Kuro priemoka taikoma tik bazei — taip skaičiuoja ir LP (patikrinta sąskaitoje S-2023/363).</p>
			<h2>Galiojantys ir istoriniai</h2>
			<table class="widefat striped">
				<thead><tr>
					<th>ID</th><th>Vezejas</th><th>Tipas</th><th>Dydis</th><th>Svoris g</th>
					<th>Kaina be PVM</th><th>Kint. %</th><th>Uz kg</th><th>Su priemokomis</th>
					<th>Galioja</th><th>Pastaba</th><th></th>
				</tr></thead>
				<tbody>
				<?php if ( ! $eil ) { echo '<tr><td colspan="12">Tarifu dar nera. Kol ju nera, <code>kaina_vezejo_ct</code> siuntu faktuose lieka NULL.</td></tr>'; } ?>
				<?php foreach ( (array) $eil as $r ) :
					/* v1.6: „Su priemokomis" TURI itraukti vezejo lygio priemokas.
					   v1.5 jos buvo perkeltos i `ps_tarifu_priemokos`, o sis stulpelis
					   liko skaiciuoti tik is `kintamas_pct` — ekranas rode BAZE ir
					   vadino ja galutine kaina. Dabar naudojam ta pati skaiciavima,
					   kuri naudoja ir faktu rasytojas. */
					if ( ! isset( $pr_cache[ $r['vezejas'] ] ) ) {
						$pr_cache[ $r['vezejas'] ] = (float) self::priemokos( $r['vezejas'], wp_date( 'Y-m-d' ) )['suma_pct'];
					}
					$pct_viso = (float) $r['kintamas_pct'] + $pr_cache[ $r['vezejas'] ];
					$su = (int) round( (int) $r['kaina_ct'] * ( 1 + $pct_viso / 100 ) );
					$akt = ( null === $r['galioja_iki'] || $r['galioja_iki'] >= wp_date( 'Y-m-d' ) );
					?>
					<tr<?php echo $akt ? '' : ' style="opacity:.55"'; ?>>
						<td><?php echo (int) $r['id']; ?></td>
						<td><?php echo esc_html( $r['vezejas'] ); ?></td>
						<td><?php echo esc_html( '' === $r['tipas'] ? 'bet koks' : $r['tipas'] ); ?></td>
						<td><?php echo esc_html( '' === $r['dydis'] ? '—' : $r['dydis'] ); ?></td>
						<td><?php echo (int) $r['svoris_nuo_g'] . ' – ' . ( null === $r['svoris_iki_g'] ? '∞' : (int) $r['svoris_iki_g'] ); ?></td>
						<td><?php echo esc_html( number_format( (int) $r['kaina_ct'] / 100, 2, ',', ' ' ) ); ?> €</td>
						<td><?php echo esc_html( rtrim( rtrim( (string) $r['kintamas_pct'], '0' ), '.' ) ); ?></td>
						<td><?php
							$uk = (float) $r['kaina_uz_kg_ct'];
							echo $uk > 0
								? esc_html( rtrim( rtrim( number_format( $uk, 4, ',', '' ), '0' ), ',' ) . ' ct/kg nuo ' . ( (int) $r['uz_kg_nuo_g'] / 1000 ) . ' kg' )
								: '—';
						?></td>
						<td><strong><?php echo esc_html( number_format( $su / 100, 2, ',', ' ' ) ); ?> €</strong></td>
						<td><?php echo esc_html( $r['galioja_nuo'] . ' → ' . ( $r['galioja_iki'] ? $r['galioja_iki'] : '…' ) ); ?></td>
						<td><?php echo esc_html( (string) $r['pastaba'] ); ?></td>
						<td><?php if ( ! $r['galioja_iki'] ) : ?>
							<form method="post" action="<?php echo esc_url( $url ); ?>" style="display:inline">
								<?php wp_nonce_field( 'ps_tarifai' ); ?>
								<input type="hidden" name="action" value="ps_tarifai_uzdaryti">
								<input type="hidden" name="id" value="<?php echo (int) $r['id']; ?>">
								<input type="date" name="galioja_iki" value="<?php echo esc_attr( wp_date( 'Y-m-d' ) ); ?>">
								<button class="button button-small">Uzdaryti</button>
							</form>
						<?php endif; ?></td>
					</tr>
				<?php endforeach; ?>
				</tbody>
			</table>
		</div>
		<?php
	}

	private static function eur_ct( $s ) {
		$s = str_replace( array( ' ', ' ' ), '', (string) $s );
		$s = str_replace( ',', '.', $s );
		return (int) round( ( (float) $s ) * 100 );
	}

	public static function issaugoti() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_die( 'Neturite teisiu.' ); }
		check_admin_referer( 'ps_tarifai' );
		global $wpdb;
		self::uztikrinti_lenteles();

		$vez = isset( $_POST['vezejas'] ) ? sanitize_key( wp_unslash( $_POST['vezejas'] ) ) : '';
		if ( ! in_array( $vez, self::VEZEJAI, true ) ) { wp_safe_redirect( add_query_arg( 'ps_klaida', 'vezejas', wp_get_referer() ) ); exit; }

		$iki = isset( $_POST['svoris_iki_g'] ) ? trim( (string) wp_unslash( $_POST['svoris_iki_g'] ) ) : '';
		$wpdb->insert( self::t_tarifai(), array(
			'vezejas'      => $vez,
			'tipas'        => isset( $_POST['tipas'] ) ? sanitize_key( wp_unslash( $_POST['tipas'] ) ) : '',
			'svoris_nuo_g' => isset( $_POST['svoris_nuo_g'] ) ? max( 0, (int) $_POST['svoris_nuo_g'] ) : 0,
			'svoris_iki_g' => ( '' === $iki ? null : max( 0, (int) $iki ) ),
			'dydis'        => isset( $_POST['dydis'] ) ? strtoupper( sanitize_text_field( wp_unslash( $_POST['dydis'] ) ) ) : '',
			'kaina_ct'     => self::eur_ct( isset( $_POST['kaina_eur'] ) ? wp_unslash( $_POST['kaina_eur'] ) : '0' ),
			'kintamas_pct' => (float) str_replace( ',', '.', (string) ( isset( $_POST['kintamas_pct'] ) ? wp_unslash( $_POST['kintamas_pct'] ) : '0' ) ),
			'kaina_uz_kg_ct' => (float) str_replace( ',', '.', (string) ( isset( $_POST['kaina_uz_kg_ct'] ) ? wp_unslash( $_POST['kaina_uz_kg_ct'] ) : '0' ) ),
			'uz_kg_nuo_g'  => ( ! isset( $_POST['uz_kg_nuo_g'] ) || '' === trim( (string) $_POST['uz_kg_nuo_g'] ) ) ? null : max( 0, (int) $_POST['uz_kg_nuo_g'] ),
			'galioja_nuo'  => isset( $_POST['galioja_nuo'] ) ? sanitize_text_field( wp_unslash( $_POST['galioja_nuo'] ) ) : wp_date( 'Y-m-d' ),
			'galioja_iki'  => null,
			'pastaba'      => isset( $_POST['pastaba'] ) ? sanitize_text_field( wp_unslash( $_POST['pastaba'] ) ) : '',
			'sukurta_at'   => self::dabar(),
		) );
		wp_safe_redirect( admin_url( 'admin.php?page=' . self::PUSLAPIS . '&ps_ok=1' ) );
		exit;
	}

	public static function priemoka_irasyti() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_die( 'Neturite teisiu.' ); }
		check_admin_referer( 'ps_tarifai' );
		global $wpdb;
		self::uztikrinti_lenteles();
		$vez = isset( $_POST['vezejas'] ) ? sanitize_key( wp_unslash( $_POST['vezejas'] ) ) : '';
		if ( ! in_array( $vez, self::VEZEJAI, true ) ) { wp_safe_redirect( admin_url( 'admin.php?page=' . self::PUSLAPIS ) ); exit; }
		$wpdb->insert( self::t_priemokos(), array(
			'vezejas'     => $vez,
			'tipas'       => isset( $_POST['tipas'] ) ? sanitize_key( wp_unslash( $_POST['tipas'] ) ) : 'kita',
			'procentas'   => abs( (float) str_replace( ',', '.', (string) ( isset( $_POST['procentas'] ) ? wp_unslash( $_POST['procentas'] ) : '0' ) ) ),
			'galioja_nuo' => isset( $_POST['galioja_nuo'] ) ? sanitize_text_field( wp_unslash( $_POST['galioja_nuo'] ) ) : wp_date( 'Y-m-d' ),
			'galioja_iki' => null,
			'pastaba'     => isset( $_POST['pastaba'] ) ? sanitize_text_field( wp_unslash( $_POST['pastaba'] ) ) : '',
			'sukurta_at'  => self::dabar(),
		) );
		wp_safe_redirect( admin_url( 'admin.php?page=' . self::PUSLAPIS . '&ps_ok=3' ) );
		exit;
	}

	public static function priemoka_uzdaryti() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_die( 'Neturite teisiu.' ); }
		check_admin_referer( 'ps_tarifai' );
		global $wpdb;
		$id  = isset( $_POST['id'] ) ? (int) $_POST['id'] : 0;
		$iki = isset( $_POST['galioja_iki'] ) ? sanitize_text_field( wp_unslash( $_POST['galioja_iki'] ) ) : '';
		if ( $id && $iki ) {
			$wpdb->update( self::t_priemokos(), array( 'galioja_iki' => $iki ), array( 'id' => $id ), array( '%s' ), array( '%d' ) );
		}
		wp_safe_redirect( admin_url( 'admin.php?page=' . self::PUSLAPIS . '&ps_ok=4' ) );
		exit;
	}

	public static function uzdaryti() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_die( 'Neturite teisiu.' ); }
		check_admin_referer( 'ps_tarifai' );
		global $wpdb;
		$id  = isset( $_POST['id'] ) ? (int) $_POST['id'] : 0;
		$iki = isset( $_POST['galioja_iki'] ) ? sanitize_text_field( wp_unslash( $_POST['galioja_iki'] ) ) : '';
		if ( $id && $iki ) {
			$wpdb->update( self::t_tarifai(), array( 'galioja_iki' => $iki ), array( 'id' => $id ), array( '%s' ), array( '%d' ) );
		}
		wp_safe_redirect( admin_url( 'admin.php?page=' . self::PUSLAPIS . '&ps_ok=2' ) );
		exit;
	}
}

Petshop_Fakt_Siuntos::init();
