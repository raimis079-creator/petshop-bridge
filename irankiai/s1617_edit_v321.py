import re, sys, hashlib
src = open('/home/claude/ps/petshop-darbalaukis.php', encoding='utf-8').read()
assert hashlib.md5(src.encode('utf-8')).hexdigest() == 'f4d32aefb19a27b3db85bb464b6b82e9'
n_edits = 0
def rep(old, new, count=1):
    global src, n_edits
    c = src.count(old)
    assert c == count, ('anchor count', c, old[:90])
    src = src.replace(old, new)
    n_edits += 1

# E1 header
rep(" * Petshop Darbalaukis v3.20 (S1616, 5 etapas: #4 kiekiai + „Siunta grįžta“ sumos; po v3.19.1) — SĄRAŠAS KAIP MAKETE v7 + SKYDELIS SU TRIMIS KELIAIS.",
    " * Petshop Darbalaukis v3.21 (S1617, 5 etapas: „Pakartotinis užsakymas“ — naujas mažas užsakymas + apmokėjimo nuoroda; po v3.20) — SĄRAŠAS KAIP MAKETE v7 + SKYDELIS SU TRIMIS KELIAIS.")
rep(" * v3.20 (S1616, spec §12.5 „Siunta grįžta“ sumos; Raimis 09-05: kortelėje, 3,99 nuo grįžusios dalies ar visos — „skirtumo nėra“, tik suma, pavadinimas",
    """ * v3.21 (S1617, spec §12.5 „Pakartotinis užsakymas“ — Raimio sprendimai 09-05 (a)(b)(c)): Klausimų kortelėje „Siunta grįžta“ vietoj „Siųsti iš naujo“ —
 *   mygtukas „Pakartotinis užsakymas“ → forma kortelėje `Suma [Y] € · Sukurti ir siųsti nuorodą · Be mokesčio · atgal` (Y iš `grizta_sumos()`, taisoma;
 *   POST `admin_post_ps_dl_pakartotinis`, nonce `ps_dl_pakart_{id}`, lock). `pakartotinis_sukurti()`: naujas mažas užsakymas `wc_create_order` — SVEČIO
 *   (customer_id 0 — Claude prielaida: WC „apmokėti užsakymą“ registruoto kliento užsakymui reikalauja prisijungti, svečio — tik nuorodos su raktu;
 *   `_ps_pakartotinis_klientas` = pradinio kliento ID), tas pats adresas / el. paštas, `created_via=darbalaukis`, viena virtuali paslaugos prekė
 *   „Pakartotinis siuntimas“ (`pakartotinis_preke()`: privati, kataloge nematoma, be likučio, `_ps_sandelis=paslauga`; opcija `ps_pakartotinio_preke`),
 *   eilutės pavadinimas „… už užsakymą #N“, suma su PVM = Y (`wc_get_price_excluding_tax` + `calculate_totals`), meta `_ps_pakartotinis` = pradinio ID,
 *   `_ps_uzbaigti_be_siuntu`; laiškas klientui su WC apmokėjimo nuoroda (`get_checkout_payment_url`; tekstas — `pakartotinis_laiskas()`, siūlo Claude);
 *   pradiniame `_ps_pakartotinis_id` + pastaba + įvykis `pakartotinis`. Apmokėjimo puslapyje tik Paysera (`pakartotinis_vartai`; svečio „ačiū“ be el. pašto
 *   patvirtinimo). Paysera callback → `update_status(processing)` (ne `payment_complete`!) → `pakartotinis_apmoketas()` (prior. 110, po variklių):
 *   naujas užsakymas → `completed` be WC laiškų (tema jį rašytų „išsiųstas“), temos kablys išrašo AVPN, darbalaukio laiškas „apmokėjimas gautas“ su PVM
 *   sąskaita; pradiniame pastaba + įvykis `pakart_apmoketa` → kortelėje atsiranda „Siųsti iš naujo“ (`grizta_is_naujo` leidžia tik kai pakartotinis
 *   apmokėtas arba pažymėta „Be mokesčio“ — mūsų / vežėjo kaltė, `_ps_pakartotinis_nemokamai`). Kortelė ir skydelis rodo būseną („laukia apmokėjimo —
 *   nuoroda išsiųsta …“ + „siųsti nuorodą dar kartą“ / „apmokėtas … — galima Siųsti iš naujo“). Naujas užsakymas darbalaukyje NERODOMAS
 *   (`faktu_sarasas` praleidžia `_ps_pakartotinis`; `auto_rusiuoti` grąžina false — į Surinkti / lapus / Venipak neina; `petshop-juosta` v1.6 skaičiuoja be jų).
 *   „Atšaukti — prekės grįžo į AV“ / „Be mokesčio“ atšaukia neapmokėtą pakartotinį užsakymą (be laiškų). Variklis neliestas (AV_Order / AV_Reduce / Partijos /
 *   Faktai ant paslaugos prekės: be likučio, be partijų — praleidžia; faktuose įprasta prekė).
 * v3.20 (S1616, spec §12.5 „Siunta grįžta“ sumos; Raimis 09-05: kortelėje, 3,99 nuo grįžusios dalies ar visos — „skirtumo nėra“, tik suma, pavadinimas""")

# E2 version
rep("\tconst VERSIJA = '3.20';", "\tconst VERSIJA = '3.21';")

# E3 init hooks
rep("\t\tadd_action( 'admin_post_ps_dl_kiekis', array( __CLASS__, 'kiekis_vykdyti' ) ); // v3.19 (5 etapas #4)\n",
    "\t\tadd_action( 'admin_post_ps_dl_kiekis', array( __CLASS__, 'kiekis_vykdyti' ) ); // v3.19 (5 etapas #4)\n"
    "\t\t// v3.21 (5 etapas: „Pakartotinis užsakymas“, spec §12.5): forma kortelėje; apmokėjus (Paysera callback → processing) — įvykdytas + laiškas su AVPN; apmokėjimo puslapyje tik Paysera.\n"
    "\t\tadd_action( 'admin_post_ps_dl_pakartotinis', array( __CLASS__, 'pakartotinis_vykdyti' ) );\n"
    "\t\tadd_action( 'woocommerce_order_status_processing', array( __CLASS__, 'pakartotinis_apmoketas' ), 110, 1 );\n"
    "\t\tadd_action( 'woocommerce_payment_complete', array( __CLASS__, 'pakartotinis_apmoketas' ), 110, 1 );\n"
    "\t\tadd_filter( 'woocommerce_available_payment_gateways', array( __CLASS__, 'pakartotinis_vartai' ), 50, 1 );\n"
    "\t\tadd_filter( 'woocommerce_order_email_verification_required', array( __CLASS__, 'pakartotinis_be_patvirtinimo' ), 20, 3 );\n")

# E4 auto_rusiuoti skip
rep("\t\tif ( ! $o || ! $o->is_paid() || $o->get_meta( '_ps_rusiuota' ) || ! class_exists( 'Petshop_Desk' ) || self::d( 'misrus_sprendimas', $o ) ) { return false; }\n",
    "\t\tif ( ! $o || ! $o->is_paid() || $o->get_meta( '_ps_rusiuota' ) || ! class_exists( 'Petshop_Desk' ) || self::d( 'misrus_sprendimas', $o ) ) { return false; }\n"
    "\t\tif ( $o->get_meta( self::PAKART_META ) ) { return false; } // v3.21: pakartotinis užsakymas — tik pinigams, į Surinkti neina\n")

# E5 faktu_sarasas skip
rep("\t\t$orders = array_filter( (array) $orders, function ( $o ) { return is_a( $o, 'WC_Order' ); } );\n\t\t$z = self::zurnalas(",
    "\t\t$orders = array_filter( (array) $orders, function ( $o ) { return is_a( $o, 'WC_Order' ) && ! $o->get_meta( self::PAKART_META ); } ); // v3.21: pakartotiniai užsakymai darbalaukyje nerodomi (būseną rodo pradinio kortelė / skydelis)\n\t\t$z = self::zurnalas(")

# E6 constants
rep("\tconst GRAZINTI_META = '_ps_grazinti_rankomis'; // v3.19: [{laikas,kas,suma,refund,ka}] — Klausimas „Grąžink klientui pinigus“, kol nepažymėta „Grąžinta“\n",
    "\tconst GRAZINTI_META = '_ps_grazinti_rankomis'; // v3.19: [{laikas,kas,suma,refund,ka}] — Klausimas „Grąžink klientui pinigus“, kol nepažymėta „Grąžinta“\n"
    "\tconst PAKART_META = '_ps_pakartotinis';              // v3.21: naujame (pakartotiniame) užsakyme — pradinio ID; darbalaukis ir auto jį praleidžia\n"
    "\tconst PAKART_ID_META = '_ps_pakartotinis_id';        // v3.21: pradiniame — pakartotinio užsakymo ID\n"
    "\tconst PAKART_NEMOK_META = '_ps_pakartotinis_nemokamai'; // v3.21: pradiniame — „be mokesčio“ (mūsų / vežėjo kaltė): laikas|kas\n"
    "\tconst PAKART_PREKE_OPT = 'ps_pakartotinio_preke';    // v3.21: paslaugos prekės „Pakartotinis siuntimas“ ID\n")

# E7 dispatcher: resend link
rep("\t\t\telseif ( 'grazinta' === $v ) { $rez = self::grazinta( $o, $u ); } // v3.19\n",
    "\t\t\telseif ( 'grazinta' === $v ) { $rez = self::grazinta( $o, $u ); } // v3.19\n"
    "\t\t\telseif ( 'pakart_nuoroda' === $v ) { $rez = self::pakartotinis_nuoroda( $o, $u ); } // v3.21\n")

# E8 grizta_is_naujo gating + cleanup
rep("\t\t$g = self::grizta( $o ); if ( ! $g ) { return array( 'dl_info', 'grįžtančios siuntos nėra' ); }\n\t\tif ( ! $o->is_paid() ) { return array( 'dl_klaida', 'užsakymas neapmokėtas' ); }\n\t\tif ( in_array( $o->get_status(), Petshop_Desk::STATUSAI['atsaukti'], true ) ) { return array( 'dl_klaida', 'užsakymas atšauktas' ); }\n",
    "\t\t$g = self::grizta( $o ); if ( ! $g ) { return array( 'dl_info', 'grįžtančios siuntos nėra' ); }\n\t\tif ( ! $o->is_paid() ) { return array( 'dl_klaida', 'užsakymas neapmokėtas' ); }\n\t\tif ( in_array( $o->get_status(), Petshop_Desk::STATUSAI['atsaukti'], true ) ) { return array( 'dl_klaida', 'užsakymas atšauktas' ); }\n"
    "\t\t// v3.21 (Raimis 09-05 c): siųsti iš naujo tik apmokėjus pakartotinį užsakymą arba pažymėjus „Be mokesčio“ (mūsų / vežėjo kaltė).\n"
    "\t\t$pk = self::pakartotinis_bukle( $o );\n"
    "\t\tif ( ! $pk || ! in_array( $pk['b'], array( 'apmoketa', 'nemokamai' ), true ) ) { return array( 'dl_klaida', $pk && 'laukia' === $pk['b'] ? 'pakartotinis užsakymas #' . $pk['nr'] . ' dar neapmokėtas — siųsti tik apmokėjus' : 'pirma „Pakartotinis užsakymas“ (apmokėjimo nuoroda klientui) arba „Be mokesčio“' ); }\n")
rep("\t\t$o->delete_meta_data( '_ps_klaus_laukti' ); $o->delete_meta_data( '_ps_uzbaigti_be_siuntu' );\n",
    "\t\t$o->delete_meta_data( '_ps_klaus_laukti' ); $o->delete_meta_data( '_ps_uzbaigti_be_siuntu' );\n"
    "\t\tself::pakartotinis_panaudotas( $o, $pk ); // v3.21: žymė sunaudota — kitam grįžimui reikės naujo pakartotinio užsakymo\n")

# E9 grizta_atsaukti: cancel pending repeat order
rep("\t\t$judesiai = array(); $nrai = array(); $dabar = current_time( 'mysql' ); $buvo = $o->get_status();\n",
    "\t\t$judesiai = array(); $nrai = array(); $dabar = current_time( 'mysql' ); $buvo = $o->get_status();\n"
    "\t\t$pk_ats = self::pakartotinis_atsaukti_nauja( $o, 'grįžusi siunta atšaukta — pakartotinis siuntimas nebereikalingas' ); // v3.21: neapmokėtas pakartotinis užsakymas atšaukiamas (be laiškų)\n"
    "\t\tif ( $pk_ats ) { $o->delete_meta_data( self::PAKART_ID_META ); }\n")

# E10 skydelis pastaba
rep("\t\tif ( $o->get_meta( self::VEL_META ) ) { $pastaba .= ' Klientui pranešta apie vėlavimą (' . substr( (string) $o->get_meta( self::VEL_META ), 5, 11 ) . ').'; } // v3.13\n",
    "\t\tif ( $o->get_meta( self::VEL_META ) ) { $pastaba .= ' Klientui pranešta apie vėlavimą (' . substr( (string) $o->get_meta( self::VEL_META ), 5, 11 ) . ').'; } // v3.13\n"
    "\t\tif ( $f['grizta'] || $o->get_meta( self::PAKART_ID_META ) ) { $pk_sk = self::pakartotinis_bukle( $o ); if ( $pk_sk ) { $pastaba .= ' ' . $pk_sk['t']; } } // v3.21: pakartotinio užsakymo būsena skydelyje\n")

# E11 card: buttons + form
rep("\t\t\t\t$veiksmai = $b1 . $b2 . '<button class=\"v t\" data-atidaryti=\"1\">Atidaryti</button> ' . $rasyti;\n",
    "\t\t\t\t// v3.21 (Raimis 09-05): „Siųsti iš naujo“ — tik apmokėjus pakartotinį užsakymą (arba „Be mokesčio“); kitaip — „Pakartotinis užsakymas“ (forma kortelėje) / būsena „laukia apmokėjimo“.\n"
    "\t\t\t\t$pk = self::pakartotinis_bukle( $o ); $pk_html = ''; $pk_forma = ''; $bp = '';\n"
    "\t\t\t\tif ( $pk ) { $pk_html = '<p class=\"dl-sumos dl-pk\">' . esc_html( $pk['t'] ) . ( 'laukia' === $pk['b'] ? ' <a class=\"pilkas maz\" href=\"' . esc_url( self::dl_url( 'pakart_nuoroda', $id ) ) . '\" data-d=\"' . esc_attr( wp_json_encode( array( 'antraste' => $antr, 'tekstas' => 'Išsiųsti klientui (' . $o->get_billing_email() . ') apmokėjimo nuorodą dar kartą? Užsakymas #' . $pk['nr'] . ', ' . $pk['suma'] . ' €.', 'ok' => 'Siųsti' ) ) ) . '\">siųsti nuorodą dar kartą</a>' : '' ) . '</p>'; }\n"
    "\t\t\t\t$gal_is_naujo = $pk && in_array( $pk['b'], array( 'apmoketa', 'nemokamai' ), true );\n"
    "\t\t\t\tif ( ! $pk && ! $sk['uzdarytas'] ) {\n"
    "\t\t\t\t\t$bp = '<button type=\"button\" class=\"v p dl-pk-b\">Pakartotinis užsakymas</button> ';\n"
    "\t\t\t\t\t$pk_forma = '<form method=\"post\" action=\"' . esc_url( admin_url( 'admin-post.php' ) ) . '\" class=\"dl-pk-f\" style=\"display:none\">' . wp_nonce_field( 'ps_dl_pakart_' . $id, '_wpnonce', true, false ) . '<input type=\"hidden\" name=\"action\" value=\"ps_dl_pakartotinis\"><input type=\"hidden\" name=\"id\" value=\"' . (int) $id . '\"><input type=\"hidden\" name=\"g\" value=\"' . esc_attr( self::url( array( 'eile' => 'klausimai', 'view' => null, 'q' => null, 'b' => null, 'atidaryti' => null ) ) ) . '\"><input type=\"hidden\" name=\"ka\" value=\"\">'\n"
    "\t\t\t\t\t\t. '<label>Suma <input type=\"number\" name=\"suma\" step=\"0.01\" min=\"0.5\" max=\"200\" value=\"' . esc_attr( $sm && null !== $sm['pakart'] ? number_format( (float) $sm['pakart'], 2, '.', '' ) : '' ) . '\"> €</label> <label class=\"pilkas maz\">' . esc_html( $sm && null !== $sm['pakart'] ? self::eur( $sm['ikainis'] ) . ' + 3,99 — taisyk, jei reikia' : 'įkainis + 3,99 — įrašyk' ) . '</label> <button type=\"button\" class=\"v p dl-pk-s\">Sukurti ir siųsti nuorodą</button> <button type=\"button\" class=\"v t dl-pk-n\" title=\"Tik kai nepristatyta dėl mūsų ar vežėjo kaltės\">Be mokesčio</button> <a href=\"#\" class=\"pilkas maz dl-pk-x\">atgal</a></form>';\n"
    "\t\t\t\t}\n"
    "\t\t\t\t$sumos_html .= $pk_html;\n"
    "\t\t\t\t$veiksmai = ( $gal_is_naujo ? $b1 : $bp ) . $b2 . '<button class=\"v t\" data-atidaryti=\"1\">Atidaryti</button> ' . $rasyti; $papild = $pk_forma;\n")
# E11b: kortelės kintamųjų init + printf su papildomu bloku (forma po veiksmų)
rep("\t\t\t$tekstas = $kl; $pastaba = ''; $veiksmai = ''; $zyme = mb_strtolower( $kl ); $sumos_html = ''; // v3.20: sumos „Siunta grįžta“ kortelėje\n",
    "\t\t\t$tekstas = $kl; $pastaba = ''; $veiksmai = ''; $zyme = mb_strtolower( $kl ); $sumos_html = ''; $papild = ''; // v3.20: sumos „Siunta grįžta“ kortelėje; v3.21: $papild — forma po veiksmų\n")
rep("\t\t\tprintf( '<div class=\"dl-kortele eil\" data-id=\"%d\" data-sk=\"1\"><h2>#%s · %s · %s <span class=\"kel klaus\"><i></i>%s</span></h2><p>%s</p>%s%s<p class=\"dl-veiksmai\">%s</p>%s</div>',\n",
    "\t\t\tprintf( '<div class=\"dl-kortele eil\" data-id=\"%d\" data-sk=\"1\"><h2>#%s · %s · %s <span class=\"kel klaus\"><i></i>%s</span></h2><p>%s</p>%s%s<p class=\"dl-veiksmai\">%s</p>%s%s</div>',\n")
rep("\t\t\t\t$pastaba ? '<p class=\"pastaba\">' . esc_html( $pastaba ) . '</p>' : '', $veiksmai, $o->get_meta( '_ps_klaus_laukti' ) ? '<p class=\"pilkas maz\">Pažymėta laukti ' . esc_html( $o->get_meta( '_ps_klaus_laukti' ) ) . '</p>' : '' );\n",
    "\t\t\t\t$pastaba ? '<p class=\"pastaba\">' . esc_html( $pastaba ) . '</p>' : '', $veiksmai, $o->get_meta( '_ps_klaus_laukti' ) ? '<p class=\"pilkas maz\">Pažymėta laukti ' . esc_html( $o->get_meta( '_ps_klaus_laukti' ) ) . '</p>' : '', $papild );\n")

# E12 JS + CSS + row-click exclusion
rep("\t/* --- skydas --- */\n",
    "\t/* --- v3.21: pakartotinis užsakymas (Klausimų kortelės forma, dialogas prieš POST) --- */\n"
    "\tdocument.addEventListener('click',function(e){\n"
    "\t\tvar b=e.target.closest('.dl-pk-b'); if(b){ e.preventDefault(); e.stopPropagation(); var k=b.closest('.dl-kortele'), f=k&&k.querySelector('.dl-pk-f'); if(!f) return; f.style.display='flex'; b.style.display='none'; var s=f.querySelector('[name=suma]'); if(s){ s.focus(); s.select(); } return; }\n"
    "\t\tvar x=e.target.closest('.dl-pk-x'); if(x){ e.preventDefault(); e.stopPropagation(); var fx=x.closest('.dl-pk-f'), kx=fx&&fx.closest('.dl-kortele'); if(fx){ fx.style.display='none'; var bb=kx&&kx.querySelector('.dl-pk-b'); if(bb) bb.style.display=''; } return; }\n"
    "\t\tvar s2=e.target.closest('.dl-pk-s'); if(s2){ e.preventDefault(); e.stopPropagation(); var f2=s2.closest('.dl-pk-f'), si=f2.querySelector('[name=suma]'), v=parseFloat(String(si.value).replace(',','.')); if(!(v>=0.5&&v<=200)){ si.focus(); return; } si.value=v.toFixed(2); f2.querySelector('[name=ka]').value='sukurti'; dlgForm({antraste:'Pakartotinis užsakymas · '+v.toFixed(2).replace('.',',')+' €',tekstas:'Sukuriamas naujas mažas užsakymas (tik pakartotinio siuntimo mokestis) tam pačiam klientui ir adresui; klientui išeina laiškas su apmokėjimo nuoroda (Paysera). Apmokėjus — PVM sąskaita išsirašo pati, čia atsiras „Siųsti iš naujo“. Pradinis užsakymas ir jo sąskaita neliečiami.',ok:'Sukurti ir siųsti'},f2); return; }\n"
    "\t\tvar n=e.target.closest('.dl-pk-n'); if(n){ e.preventDefault(); e.stopPropagation(); var f3=n.closest('.dl-pk-f'); f3.querySelector('[name=ka]').value='nemokamai'; dlgForm({antraste:'Siųsti iš naujo be mokesčio',tekstas:'Tik kai nepristatyta dėl mūsų ar vežėjo kaltės: klientui nieko nemokėti, laiškas nesiunčiamas, čia atsiras „Siųsti iš naujo“.',ok:'Be mokesčio'},f3); return; }\n"
    "\t});\n"
    "\t/* --- skydas --- */\n")
rep("\t\tif(e.target.closest('a,button,input,select,label')) return;\n",
    "\t\tif(e.target.closest('a,button,input,select,label,.dl-pk-f')) return;\n")
rep("a.dl-kk{color:var(--melyna);",
    ".dl-pk-f{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:8px 0 2px;font-size:13px}.dl-pk-f label{display:inline-flex;gap:6px;align-items:center;color:var(--pilka)}.dl-pk-f input[type=number]{width:74px;font:inherit;font-size:13px;color:var(--rasalas);border:1px solid var(--linija);border-radius:6px;padding:3px 6px}.dl-kortele .dl-pk{color:var(--rasalas)}"
    "a.dl-kk{color:var(--melyna);")

# E13 new functions before grizta_is_naujo docblock
NEW = r'''	/* ============================ v3.21: PAKARTOTINIS UŽSAKYMAS (spec §12.5; Raimis 09-05 a/b/c) ============================ */

	/** Paslaugos prekė „Pakartotinis siuntimas“ — virtuali, be likučio, privati (kataloge nematoma, klientui nepirktina); kuriama vieną kartą, ID opcijoje. */
	protected static function pakartotinis_preke() {
		$id = (int) get_option( self::PAKART_PREKE_OPT ); $p = $id ? wc_get_product( $id ) : null;
		if ( $p && 'trash' !== $p->get_status() ) { return $p; }
		$p = new WC_Product_Simple();
		$p->set_name( 'Pakartotinis siuntimas' ); $p->set_status( 'private' ); $p->set_catalog_visibility( 'hidden' ); $p->set_virtual( true );
		$p->set_regular_price( '3.99' ); $p->set_tax_status( 'taxable' ); $p->set_tax_class( '' ); $p->set_manage_stock( false ); $p->set_stock_status( 'instock' ); $p->set_sold_individually( true ); $p->set_reviews_allowed( false );
		$p->set_description( 'Paslauga: grįžusios neatsiimtos / nepristatytos siuntos pakartotinis siuntimas (pristatymo įkainis + siuntos grąžinimo išlaidos 3,99 €). Naudoja darbalaukis („Pakartotinis užsakymas“).' );
		$p->update_meta_data( '_ps_paslauga', 'pakartotinis' ); $p->update_meta_data( '_ps_sandelis', 'paslauga' );
		$pid = $p->save(); if ( ! $pid ) { return null; }
		update_option( self::PAKART_PREKE_OPT, $pid, false );
		return wc_get_product( $pid );
	}

	/** Pakartotinio užsakymo būsena pradiniam užsakymui: null | [b: laukia|apmoketa|nemokamai, id, nr, suma, laikas, t (tekstas darbuotojui)]. */
	public static function pakartotinis_bukle( $o ) {
		$nid = (int) $o->get_meta( self::PAKART_ID_META ); $n = $nid ? wc_get_order( $nid ) : null;
		if ( $n && 'shop_order' === $n->get_type() ) {
			$suma = self::eur( $n->get_total() ); $nr = $n->get_order_number();
			if ( $n->is_paid() ) { $dp = $n->get_date_paid() ? $n->get_date_paid() : $n->get_date_modified(); $k = $dp ? wp_date( 'm-d H:i', $dp->getTimestamp() ) : ''; return array( 'b' => 'apmoketa', 'id' => $nid, 'nr' => $nr, 'suma' => $suma, 'laikas' => $k, 't' => 'Pakartotinis užsakymas #' . $nr . ' (' . $suma . ' €) apmokėtas ' . $k . ' — galima „Siųsti iš naujo“.' ); }
			if ( in_array( $n->get_status(), array( 'pending', 'on-hold', 'failed' ), true ) ) { $s = (string) $n->get_meta( '_ps_pakart_nuoroda' ); return array( 'b' => 'laukia', 'id' => $nid, 'nr' => $nr, 'suma' => $suma, 'laikas' => $s, 't' => 'Pakartotinis užsakymas #' . $nr . ' (' . $suma . ' €): laukia kliento apmokėjimo' . ( $s ? ' — nuoroda išsiųsta ' . substr( $s, 5, 11 ) : ' — nuoroda NEIŠSIŲSTA' ) . '.' ); }
		}
		$nm = (string) $o->get_meta( self::PAKART_NEMOK_META );
		if ( $nm ) { return array( 'b' => 'nemokamai', 'id' => 0, 'nr' => '', 'suma' => '0,00', 'laikas' => $nm, 't' => 'Pakartotinis siuntimas be mokesčio — mūsų / vežėjo kaltė (' . str_replace( '|', ', ', substr( $nm, 5, 11 ) . substr( $nm, 19 ) ) . ') — galima „Siųsti iš naujo“.' ); }
		return null;
	}

	/** Po „Siųsti iš naujo“: žymės nuimamos, istorija — `_ps_pakartotiniai` (kitam grįžimui reikės naujo pakartotinio užsakymo). */
	protected static function pakartotinis_panaudotas( $o, $pk ) {
		if ( ! $pk ) { return; }
		$h = json_decode( (string) $o->get_meta( '_ps_pakartotiniai' ), true ); $h = is_array( $h ) ? $h : array();
		$h[] = array( 'id' => (int) $pk['id'], 'b' => $pk['b'], 'suma' => $pk['suma'], 'laikas' => current_time( 'mysql' ) );
		$o->update_meta_data( '_ps_pakartotiniai', wp_json_encode( $h ) ); $o->delete_meta_data( self::PAKART_ID_META ); $o->delete_meta_data( self::PAKART_NEMOK_META );
	}

	/** Neapmokėtas pakartotinis užsakymas → cancelled be laiškų. Grąžina true, jei atšauktas. */
	protected static function pakartotinis_atsaukti_nauja( $o, $kodel ) {
		$nid = (int) $o->get_meta( self::PAKART_ID_META ); $n = $nid ? wc_get_order( $nid ) : null;
		if ( ! $n || $n->is_paid() || in_array( $n->get_status(), array( 'cancelled', 'refunded', 'completed' ), true ) ) { return false; }
		self::d( 'laiskai_off' ); $n->update_status( 'cancelled', 'Darbalaukis: ' . $kodel . ' (pradinis užsakymas #' . $o->get_order_number() . '). Laiškas klientui nesiunčiamas.' ); self::d( 'laiskai_on' );
		return true;
	}

	/** POST `ps_dl_pakartotinis` (Klausimų kortelės forma): ka=sukurti — naujas mažas užsakymas + laiškas su apmokėjimo nuoroda; ka=nemokamai — žymė „be mokesčio“. */
	public static function pakartotinis_vykdyti() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		$id = absint( $_POST['id'] ?? 0 ); check_admin_referer( 'ps_dl_pakart_' . $id );
		$o = wc_get_order( $id ); if ( ! $o ) { wp_die( 'Užsakymas nerastas' ); }
		$atgal = wp_validate_redirect( wp_unslash( $_POST['g'] ?? '' ), admin_url( 'admin.php?page=' . self::SLUG . '&eile=klausimai' ) );
		$u = wp_get_current_user(); $lock = 'ps_dl_lock_' . $id;
		$baigti = function ( $k, $t ) use ( $o, $atgal, $lock ) { delete_transient( $lock ); wp_safe_redirect( add_query_arg( array( 'pd_ok' => $k, 'pd_nr' => rawurlencode( $o->get_order_number() . '|' . $t ) ), $atgal ) ); exit; };
		if ( get_transient( $lock ) ) { $baigti( 'dl_info', 'veiksmas jau vykdomas — palauk sekundę' ); } set_transient( $lock, 1, 20 );
		$r = array( 'dl_klaida', 'nežinomas veiksmas' );
		try {
			$ka = sanitize_key( wp_unslash( $_POST['ka'] ?? '' ) );
			if ( 'nemokamai' === $ka ) { $r = self::pakartotinis_nemokamai( $o, $u ); }
			elseif ( 'sukurti' === $ka ) { $r = self::pakartotinis_sukurti( $o, $u, (float) str_replace( ',', '.', sanitize_text_field( wp_unslash( $_POST['suma'] ?? '' ) ) ) ); }
		} catch ( Throwable $e ) { $r = array( 'dl_klaida', 'klaida: ' . $e->getMessage() ); }
		$baigti( $r[0], $r[1] );
	}

	/** „Be mokesčio“ — nepristatyta dėl mūsų / vežėjo kaltės (spec §12.5: 3,99 netaikoma, darbuotojas nuima rankomis): žymė, neapmokėtas pakartotinis atšaukiamas. */
	protected static function pakartotinis_nemokamai( $o, $u ) {
		if ( ! self::grizta( $o ) ) { return array( 'dl_info', 'grįžtančios siuntos nėra' ); }
		$pk = self::pakartotinis_bukle( $o ); if ( $pk && 'apmoketa' === $pk['b'] ) { return array( 'dl_info', 'pakartotinis užsakymas #' . $pk['nr'] . ' jau apmokėtas — spausk „Siųsti iš naujo“' ); }
		$ats = self::pakartotinis_atsaukti_nauja( $o, 'pakartotinis siuntimas be mokesčio (mūsų / vežėjo kaltė)' ); if ( $ats ) { $o->delete_meta_data( self::PAKART_ID_META ); }
		$o->update_meta_data( self::PAKART_NEMOK_META, current_time( 'mysql' ) . '|' . $u->display_name );
		$o->add_order_note( 'Darbalaukis: pakartotinis siuntimas BE MOKESČIO — nepristatyta dėl mūsų / vežėjo kaltės (' . $u->display_name . ').' . ( $ats && $pk ? ' Neapmokėtas pakartotinis užsakymas #' . $pk['nr'] . ' atšauktas.' : '' ) . ' Galima „Siųsti iš naujo“.', false, true ); $o->save();
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'pakart_nemokamai', 'rezultatas' => 'ok', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'po' => array( 'atsauktas' => $ats && $pk ? (int) $pk['id'] : 0 ), 'pastaba' => 'pakartotinis siuntimas be mokesčio' ) ); }
		return array( 'dl_info', 'pažymėta: siunčiama be mokesčio' . ( $ats && $pk ? ' — pakartotinis užsakymas #' . $pk['nr'] . ' atšauktas' : '' ) . ' — dabar „Siųsti iš naujo“' );
	}

	/** Naujas mažas užsakymas (Raimis 09-05 a): svečio, tas pats adresas / el. paštas, viena virtuali paslaugos prekė „Pakartotinis siuntimas už užsakymą #N“, suma su PVM = $suma;
	 *  meta `_ps_pakartotinis` = pradinio ID (darbalaukis jį praleidžia); klientui laiškas su WC apmokėjimo nuoroda. Pradinis užsakymas ir sąskaita neliečiami. */
	protected static function pakartotinis_sukurti( $o, $u, $suma ) {
		if ( ! self::grizta( $o ) ) { return array( 'dl_info', 'grįžtančios siuntos nėra' ); }
		if ( ! $o->is_paid() ) { return array( 'dl_klaida', 'pradinis užsakymas neapmokėtas' ); }
		$pk = self::pakartotinis_bukle( $o );
		if ( $pk && 'laukia' === $pk['b'] ) { return array( 'dl_klaida', 'pakartotinis užsakymas #' . $pk['nr'] . ' jau sukurtas ir laukia apmokėjimo („siųsti nuorodą dar kartą“ kortelėje)' ); }
		if ( $pk && 'apmoketa' === $pk['b'] ) { return array( 'dl_klaida', 'pakartotinis užsakymas #' . $pk['nr'] . ' jau apmokėtas — spausk „Siųsti iš naujo“' ); }
		$suma = round( (float) $suma, 2 ); if ( $suma < 0.5 || $suma > 200 ) { return array( 'dl_klaida', 'bloga suma ' . self::eur( $suma ) . ' € — įrašyk 0,50…200,00' ); }
		$el = $o->get_billing_email(); if ( ! is_email( $el ) ) { return array( 'dl_klaida', 'kliento el. pašto nėra — parašyk klientui rankomis' ); }
		$p = self::pakartotinis_preke(); if ( ! $p ) { return array( 'dl_klaida', 'paslaugos prekės sukurti nepavyko' ); }
		$f = self::faktai( $o, self::zurnalas( array( $o->get_id() ) ) ); $sm = self::grizta_sumos( $f ); $ik = ( $sm && null !== $sm['ikainis'] ) ? (float) $sm['ikainis'] : null;
		$n = wc_create_order( array( 'customer_id' => 0, 'created_via' => 'darbalaukis', 'status' => 'pending' ) );
		if ( is_wp_error( $n ) || ! $n ) { return array( 'dl_klaida', 'užsakymo sukurti nepavyko' . ( is_wp_error( $n ) ? ': ' . $n->get_error_message() : '' ) ); }
		$n->set_address( $o->get_address( 'billing' ), 'billing' ); $n->set_address( $o->get_address( 'shipping' ), 'shipping' );
		$n->set_currency( $o->get_currency() ); $n->set_prices_include_tax( true );
		$it = new WC_Order_Item_Product(); $it->set_product( $p ); $it->set_quantity( 1 ); $it->set_name( 'Pakartotinis siuntimas už užsakymą #' . $o->get_order_number() );
		$neto = (float) wc_get_price_excluding_tax( $p, array( 'qty' => 1, 'price' => $suma ) ); $it->set_subtotal( $neto ); $it->set_total( $neto );
		$it->add_meta_data( '_ps_pakartotinis', (string) $o->get_id(), true ); $n->add_item( $it );
		$n->update_meta_data( self::PAKART_META, (string) $o->get_id() ); $n->update_meta_data( '_ps_uzbaigti_be_siuntu', '1' ); $n->update_meta_data( '_ps_pakart_ikainis', null === $ik ? '' : (string) $ik );
		if ( $o->get_customer_id() ) { $n->update_meta_data( '_ps_pakartotinis_klientas', (string) $o->get_customer_id() ); }
		$n->calculate_totals( true ); $n->save();
		$n = wc_get_order( $n->get_id() ); $viso = (float) $n->get_total();
		if ( abs( $viso - $suma ) > 0.011 ) { $n->update_status( 'cancelled', 'Darbalaukis: sumos klaida (' . self::eur( $viso ) . ' ≠ ' . self::eur( $suma ) . ') — užsakymas atšauktas.' ); return array( 'dl_klaida', 'sumos klaida: gauta ' . self::eur( $viso ) . ' €, turėjo būti ' . self::eur( $suma ) . ' € — užsakymas #' . $n->get_order_number() . ' atšauktas' ); }
		list( $tema, $h ) = self::pakartotinis_laiskas( $n, $o, $ik );
		$mailer = WC()->mailer(); $ok = (bool) $mailer->send( $el, $tema, $mailer->wrap_message( $tema, $h ) );
		$dabar = current_time( 'mysql' );
		if ( $ok ) { $n->update_meta_data( '_ps_pakart_nuoroda', $dabar ); }
		$n->add_order_note( sprintf( 'Darbalaukis: pakartotinis siuntimas už užsakymą #%s — %s € (%s). Apmokėjimo nuoroda klientui (%s) %s. Apmokėjus — įvykdomas pats (į Surinkti / Venipak neina).', $o->get_order_number(), self::eur( $viso ), $u->display_name, $el, $ok ? 'išsiųsta' : 'NEIŠSIŲSTA' ), false, true ); $n->save();
		$o->update_meta_data( self::PAKART_ID_META, (string) $n->get_id() ); $o->delete_meta_data( self::PAKART_NEMOK_META );
		$o->add_order_note( sprintf( 'Darbalaukis: sukurtas pakartotinis užsakymas #%s — %s € (%s). Klientui apmokėjimo nuoroda %s. „Siųsti iš naujo“ — tik apmokėjus.', $n->get_order_number(), self::eur( $viso ), $u->display_name, $ok ? 'išsiųsta' : 'NEIŠSIŲSTA — siųsk dar kartą' ), false, true ); $o->save();
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'pakartotinis', 'rezultatas' => $ok ? 'ok' : 'klaida', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'po' => array( 'naujas' => $n->get_id(), 'suma' => $viso, 'ikainis' => $ik, 'laiskas' => $ok ? 1 : 0, 'kam' => $el ), 'pastaba' => 'pakartotinis užsakymas #' . $n->get_order_number() . ' ' . self::eur( $viso ) . ' €' ) ); }
		do_action( 'ps_juosta_isvalyti' );
		return array( $ok ? 'dl_info' : 'dl_klaida', 'pakartotinis užsakymas #' . $n->get_order_number() . ' (' . self::eur( $viso ) . ' €) sukurtas — ' . ( $ok ? 'apmokėjimo nuoroda klientui išsiųsta (' . $el . ')' : 'laiško išsiųsti NEPAVYKO — „siųsti nuorodą dar kartą“' ) );
	}

	/** „siųsti nuorodą dar kartą“ (GET `pakart_nuoroda`). */
	protected static function pakartotinis_nuoroda( $o, $u ) {
		$pk = self::pakartotinis_bukle( $o ); if ( ! $pk || 'laukia' !== $pk['b'] ) { return array( 'dl_info', 'neapmokėto pakartotinio užsakymo nėra' ); }
		$n = wc_get_order( $pk['id'] ); $el = $o->get_billing_email(); if ( ! $n || ! is_email( $el ) ) { return array( 'dl_klaida', 'užsakymo arba el. pašto nėra' ); }
		$ik = (string) $n->get_meta( '_ps_pakart_ikainis' ); list( $tema, $h ) = self::pakartotinis_laiskas( $n, $o, '' === $ik ? null : (float) $ik );
		$mailer = WC()->mailer(); $ok = (bool) $mailer->send( $el, $tema, $mailer->wrap_message( $tema, $h ) );
		if ( $ok ) { $n->update_meta_data( '_ps_pakart_nuoroda', current_time( 'mysql' ) ); $n->add_order_note( 'Darbalaukis: apmokėjimo nuoroda klientui išsiųsta dar kartą (' . $u->display_name . ').', false, true ); $n->save(); }
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'pakart_nuoroda', 'rezultatas' => $ok ? 'ok' : 'klaida', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'po' => array( 'naujas' => $n->get_id(), 'kam' => $el ), 'pastaba' => 'apmokėjimo nuoroda dar kartą' ) ); }
		return array( $ok ? 'dl_info' : 'dl_klaida', $ok ? 'apmokėjimo nuoroda išsiųsta dar kartą (' . $el . ')' : 'laiško išsiųsti nepavyko' );
	}

	/** Laiškas su apmokėjimo nuoroda — [tema, html]. Tekstas: Claude siūlo, Raimis tvirtina (spec §12.5). */
	protected static function pakartotinis_laiskas( $n, $o, $ik ) {
		$nr = $o->get_order_number(); $vardas = trim( (string) $o->get_billing_first_name() ); $suma = self::eur( $n->get_total() ); $url = $n->get_checkout_payment_url();
		$kaina = null === $ik ? $suma . ' € (pristatymas + 3,99 € siuntos grąžinimo išlaidos)' : $suma . ' € (' . self::eur( $ik ) . ' € pristatymas + 3,99 € siuntos grąžinimo išlaidos)';
		$h  = '<p>' . esc_html( $vardas ? "Sveiki, {$vardas}." : 'Sveiki.' ) . '</p>';
		$h .= '<p>' . esc_html( sprintf( 'Jūsų užsakymo Nr. %s siunta grįžo mums neatsiimta / nepristatyta.', $nr ) ) . '</p>';
		$h .= '<p>' . esc_html( 'Galime išsiųsti ją iš naujo tuo pačiu adresu. Pakartotinio siuntimo kaina — ' . $kaina . ', pagal pirkimo taisyklių 6.10–6.11 p.' ) . '</p>';
		$h .= '<p style="margin:18px 0"><a href="' . esc_url( $url ) . '" style="display:inline-block;background:#2d6a35;color:#fff;text-decoration:none;padding:12px 22px;border-radius:6px;font-weight:bold">' . esc_html( 'Apmokėti ' . $suma . ' €' ) . '</a><br><span style="font-size:12px;color:#777">' . esc_html( 'Jei mygtukas neveikia, atidarykite nuorodą: ' ) . '<a href="' . esc_url( $url ) . '">' . esc_html( $url ) . '</a></span></p>';
		$h .= '<p>' . esc_html( 'Gavę apmokėjimą, siuntą išsiųsime iš naujo ir atsiųsime sekimo numerį. Jei norite kito adreso ar paštomato — parašykite atsakydami į šį laišką prieš apmokėdami.' ) . '</p>';
		$h .= '<p>' . esc_html( 'Jei siųsti iš naujo nenorite — parašykite: užsakymą atšauksime ir grąžinsime už prekes ir pristatymą sumokėtą sumą, atskaičius 3,99 € siuntos grąžinimo išlaidas.' ) . '</p>';
		$h .= '<p>' . esc_html( 'Gražios dienos,' ) . '<br>' . esc_html( 'Petshop.lt komanda' ) . '<br>+370 681 87787<br>terra@petshop.lt</p>';
		return array( sprintf( 'Jūsų užsakymo Nr. %s siunta grįžo — pakartotinis siuntimas %s €', $nr, $suma ), $h );
	}

	/** Laiškas po apmokėjimo (su PVM sąskaita) — [tema, html]. */
	protected static function pakartotinis_laiskas_apmoketa( $n, $o ) {
		$nr = $o ? $o->get_order_number() : (string) $n->get_meta( self::PAKART_META ); $vardas = trim( (string) $n->get_billing_first_name() ); $suma = self::eur( $n->get_total() );
		$h  = '<p>' . esc_html( $vardas ? "Sveiki, {$vardas}." : 'Sveiki.' ) . '</p>';
		$h .= '<p>' . esc_html( sprintf( 'Ačiū — apmokėjimą už pakartotinį siuntimą (%s €) gavome. Užsakymo Nr. %s siuntą išsiųsime iš naujo tuo pačiu adresu ir atsiųsime sekimo numerį atskiru laišku.', $suma, $nr ) ) . '</p>';
		$h .= '<p>' . esc_html( 'PVM sąskaita faktūra už pakartotinį siuntimą prisegta prie šio laiško.' ) . '</p>';
		$h .= '<p>' . esc_html( 'Gražios dienos,' ) . '<br>' . esc_html( 'Petshop.lt komanda' ) . '<br>+370 681 87787<br>terra@petshop.lt</p>';
		return array( sprintf( 'Apmokėjimas gautas — užsakymo Nr. %s siuntą išsiųsime iš naujo', $nr ), $h );
	}

	/** Paysera callback → `update_status(processing)` (ne `payment_complete`) → čia (prior. 110, po variklių): pakartotinis užsakymas → `completed` be WC laiškų
	 *  (tema rašytų „išsiųstas“), temos kablys (prior. 5) išrašo AVPN, darbalaukio laiškas su PVM sąskaita; pradiniame pastaba + įvykis → „Siųsti iš naujo“. */
	public static function pakartotinis_apmoketas( $order_id ) {
		$n = is_numeric( $order_id ) ? wc_get_order( $order_id ) : $order_id; if ( ! $n || ! ( $n instanceof WC_Order ) ) { return; }
		$oid = (int) $n->get_meta( self::PAKART_META ); if ( ! $oid || ! $n->is_paid() || $n->has_status( 'completed' ) || $n->get_meta( '_ps_pakart_ivykdyta' ) ) { return; }
		$id = $n->get_id(); $o = wc_get_order( $oid );
		$n->update_meta_data( '_ps_pakart_ivykdyta', current_time( 'mysql' ) ); $n->save();
		self::d( 'laiskai_off' ); $n->update_status( 'completed', 'Darbalaukis: pakartotinis siuntimas apmokėtas — užsakymas įvykdytas automatiškai (tik pinigams; į Surinkti / lapus / Venipak neina). WC laiškas klientui: NESIŲSTAS — darbalaukio laiškas su PVM sąskaita.' ); self::d( 'laiskai_on' );
		$n = wc_get_order( $id ); $pdf = (string) $n->get_meta( '_petshop_completed_pdf' );
		if ( ( ! $pdf || ! file_exists( $pdf ) ) && function_exists( 'petshop_generate_invoice_pdf' ) ) { try { $pdf = (string) petshop_generate_invoice_pdf( $id ); if ( $pdf && file_exists( $pdf ) ) { $n->update_meta_data( '_petshop_completed_pdf', $pdf ); $n->save(); } } catch ( Throwable $e ) { $pdf = ''; } }
		$el = $n->get_billing_email(); list( $tema, $h ) = self::pakartotinis_laiskas_apmoketa( $n, $o );
		$mailer = WC()->mailer(); $ok = is_email( $el ) ? (bool) $mailer->send( $el, $tema, $mailer->wrap_message( $tema, $h ), '', ( $pdf && file_exists( $pdf ) ) ? array( $pdf ) : array() ) : false;
		$avpn = (string) $n->get_meta( '_petshop_avpn_number' );
		$n->add_order_note( 'Darbalaukis: laiškas klientui „apmokėjimas gautas“ ' . ( $ok ? 'išsiųstas' : 'NEIŠSIŲSTAS' ) . ( $pdf && file_exists( $pdf ) ? ' su PVM sąskaita ' . $avpn : ' BE sąskaitos (PDF nesugeneruotas)' ) . '.', false, true ); $n->save();
		if ( $o ) {
			$o->add_order_note( sprintf( 'Pakartotinis užsakymas #%s apmokėtas (%s €, %s) — galima „Siųsti iš naujo“.', $n->get_order_number(), self::eur( $n->get_total() ), $avpn ? $avpn : 'sąskaita ' . ( $pdf ? 'yra' : 'nėra' ) ), false, true ); $o->save();
			if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $oid, 'sritis' => 'desk', 'veiksmas' => 'pakart_apmoketa', 'rezultatas' => 'ok', 'kanalas' => 'paysera', 'po' => array( 'naujas' => $id, 'suma' => (float) $n->get_total(), 'avpn' => $avpn, 'laiskas' => $ok ? 1 : 0 ), 'pastaba' => 'pakartotinis užsakymas #' . $n->get_order_number() . ' apmokėtas' ) ); }
		}
		do_action( 'ps_juosta_isvalyti' );
	}

	/** Apmokėjimo puslapyje (`order-pay`) pakartotiniam užsakymui — tik Paysera (Claude prielaida: pavedimo patvirtinimui reiktų atskiro mygtuko; Paysera turi visus LT bankus). */
	public static function pakartotinis_vartai( $gws ) {
		if ( is_admin() || ! function_exists( 'is_wc_endpoint_url' ) || ! is_wc_endpoint_url( 'order-pay' ) ) { return $gws; }
		global $wp; $oid = absint( $wp->query_vars['order-pay'] ?? 0 ); $o = $oid ? wc_get_order( $oid ) : null;
		if ( ! $o || ! $o->get_meta( self::PAKART_META ) ) { return $gws; }
		return isset( $gws['paysera'] ) ? array( 'paysera' => $gws['paysera'] ) : $gws;
	}

	/** Svečio užsakymo „ačiū“ puslapis (grįžus iš Paysera) — be WC el. pašto patvirtinimo formos (užsakymas sukurtas anksčiau nei WC „malonės“ langas). */
	public static function pakartotinis_be_patvirtinimo( $reikia, $order = null, $context = '' ) {
		if ( $reikia && $order instanceof WC_Order && $order->get_meta( self::PAKART_META ) ) { return false; }
		return $reikia;
	}

'''
rep("\t/** „Siųsti iš naujo“ — TIK grįžusią dalį (log S1611 spr. 5 + Raimis 09-04 vakaras: grįžusi tiekėjo dalis VISADA → AV, standartinė procedūra).",
    NEW + "\t/** „Siųsti iš naujo“ — TIK grįžusią dalį (log S1611 spr. 5 + Raimis 09-04 vakaras: grįžusi tiekėjo dalis VISADA → AV, standartinė procedūra).")

open('/home/claude/ps/petshop-darbalaukis-v321.php', 'w', encoding='utf-8').write(src)
print('edits', n_edits, 'bytes', len(src.encode('utf-8')), 'md5', hashlib.md5(src.encode('utf-8')).hexdigest())
