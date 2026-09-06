import re,sys
s=open('dl_v3352.php',encoding='utf-8').read()
def rep(old,new,cnt=1):
    global s
    assert s.count(old)==cnt,(s.count(old),old[:80])
    s=s.replace(old,new)
# 0. header + versija
rep(" * Petshop Darbalaukis v3.35.2 (S1620, Raimis 09-06:"," * Petshop Darbalaukis v3.36 (S1620, Raimis 09-06 „2 – ok, 3 – a ir b“): FILTRAI „Visi“ lange — Data „Nuo–iki“ (variklio `datos_riba('intervalas')`), Apmokėjimas (pavedimu / Paysera / grynais / neapmokėtas), Būsena (vykdomas / sustabdytas / įvykdytas / atšauktas / grąžintas / neapmokėtas), Suma nuo–iki, Rikiuoti „seniausi pirmi“; bet kuris filtras → variklio `gauti('visi')` (naujausi 200, ne puslapis) + `filtruoti()` (chips `b` veikia ir čia). ATŠAUKTŲ TRYNIMAS: (a) skydelyje „Ištrinti“ + filtre „Atšaukti“ „Ištrinti neapmokėtus atšauktus (N)“ (POST `ps_dl_istrinti_atsauktus`), (b) cron `ps_dl_atsauktu_valymas` kasdien 03:20 — atšauktas neapmokėtas > 30 d. → WC šiukšlinė, šiukšlinėje neapmokėtas > 30 d. → galutinai. Sargas `istrinamas()`: cancelled/lp-cancelled, ne apmokėtas, be `date_paid`, be refund'ų, be AVPN PDF, be siuntų — apmokėti atšaukti (AVPN + KR-AVPN) NIEKADA. v3.35.2 (S1620, Raimis 09-06:")
rep("\tconst VERSIJA = '3.35.2';","\tconst VERSIJA = '3.36';\n\tconst ATSAUKTU_DIENOS = 30; // v3.36: po kiek dienų atšauktas neapmokėtas → šiukšlinė (ir šiukšlinėje → galutinai)")
# 1. filtrai(): nauji raktai
rep("\t\treturn array( 'q' => $g( 'q', 't' ), 'data' => $g( 'data' ), 'nuo' => $g( 'nuo', 't' ), 'iki' => $g( 'iki', 't' ), 'vykdymas' => $g( 'vykdymas' ), 'vezejas' => $g( 'vezejas' ),\n\t\t\t'busena' => '', 'mokejimas' => '', 'amzius' => '', 'nr' => '', 'klientas' => '', 'tel' => '', 'adresas' => '', 'zvilgsnis' => '', 'b' => $g( 'b' ), 'r' => $g( 'r' ), 'psl' => max( 1, (int) ( $_GET['psl'] ?? 1 ) ) );",
"\t\t$data = $g( 'data' ); $nuo = preg_match( '/^\\d{4}-\\d{2}-\\d{2}$/', $g( 'nuo', 't' ) ) ? $g( 'nuo', 't' ) : ''; $iki = preg_match( '/^\\d{4}-\\d{2}-\\d{2}$/', $g( 'iki', 't' ) ) ? $g( 'iki', 't' ) : ''; if ( $nuo || $iki ) { $data = 'intervalas'; } elseif ( 'intervalas' === $data ) { $data = ''; } // v3.36: nuo–iki\n\t\t$sn = $g( 'suma_nuo', 't' ); $si = $g( 'suma_iki', 't' ); $sn = is_numeric( str_replace( ',', '.', $sn ) ) ? (string) (float) str_replace( ',', '.', $sn ) : ''; $si = is_numeric( str_replace( ',', '.', $si ) ) ? (string) (float) str_replace( ',', '.', $si ) : '';\n\t\treturn array( 'q' => $g( 'q', 't' ), 'data' => $data, 'nuo' => $nuo, 'iki' => $iki, 'vykdymas' => $g( 'vykdymas' ), 'vezejas' => $g( 'vezejas' ),\n\t\t\t'busena' => '', 'mokejimas' => '', 'amzius' => '', 'nr' => '', 'klientas' => '', 'tel' => '', 'adresas' => '', 'zvilgsnis' => '', 'b' => $g( 'b' ), 'r' => $g( 'r' ), 'psl' => max( 1, (int) ( $_GET['psl'] ?? 1 ) ),\n\t\t\t'mok' => $g( 'mok' ), 'st' => $g( 'st' ), 'suma_nuo' => $sn, 'suma_iki' => $si ); // v3.36")
# 2. visi(): bet kuris filtras → variklis
rep("\t\tif ( '' !== $f['q'] || $f['data'] ) { return self::faktu_sarasas( array_map( function ( $r ) { return $r['o']; }, (array) self::d( 'gauti', 'visi', $f ) ) ); }",
"\t\tif ( '' !== $f['q'] || self::filtras_aktyvus( $f ) ) { $rw = self::faktu_sarasas( array_map( function ( $r ) { return $r['o']; }, (array) self::d( 'gauti', 'visi', $f ) ) ); self::$visi_riba = count( $rw ) >= 200; return $rw; } // v3.36: bet kuris filtras — variklio sąrašas (naujausi 200), ne puslapis")
rep("\tconst PSL = 50;\n\tprotected static $visi_iš_viso = 0;","\tconst PSL = 50;\n\tprotected static $visi_iš_viso = 0;\n\tprotected static $visi_riba = false; // v3.36: variklio 200 riba pasiekta\n\t/** v3.36: ar įjungtas bent vienas filtras (be paieškos ir chips). */\n\tprotected static function filtras_aktyvus( $f ) { return (bool) ( $f['data'] || $f['vykdymas'] || $f['vezejas'] || $f['mok'] || $f['st'] || '' !== $f['suma_nuo'] || '' !== $f['suma_iki'] ); }")
# 3. filtruoti(): mok / st / suma / b
rep("\t\t\tif ( $f['vezejas'] && $r['vez'] !== $f['vezejas'] ) { return false; }",
"\t\t\tif ( $f['vezejas'] && $r['vez'] !== $f['vezejas'] ) { return false; }\n\t\t\t// v3.36: apmokėjimas / būsena / suma / chips (variklio sąraše chips kitaip nepritaikomi)\n\t\t\tif ( $f['mok'] ) { $o = $r['o']; $pm = (string) $o->get_payment_method(); $paid = $o->is_paid() || (bool) $o->get_date_paid();\n\t\t\t\tif ( 'neapmoketa' === $f['mok'] && $paid ) { return false; }\n\t\t\t\tif ( 'pavedimu' === $f['mok'] && 'bacs' !== $pm ) { return false; }\n\t\t\t\tif ( 'paysera' === $f['mok'] && false === strpos( $pm, 'paysera' ) ) { return false; }\n\t\t\t\tif ( 'grynais' === $f['mok'] && 'cod' !== $pm ) { return false; } }\n\t\t\tif ( $f['st'] ) { $st = $r['o']->get_status(); $zem = array( 'vykdomas' => array( 'processing' ), 'sustabdytas' => array( 'on-hold' ), 'ivykdytas' => Petshop_Desk::STATUSAI['ivykdyti'], 'atsauktas' => array( 'cancelled', 'lp-cancelled' ), 'grazintas' => array( 'refunded' ), 'neapmoketas' => array( 'pending', 'failed' ) ); if ( isset( $zem[ $f['st'] ] ) && ! in_array( $st, $zem[ $f['st'] ], true ) ) { return false; } }\n\t\t\tif ( '' !== $f['suma_nuo'] && (float) $r['o']->get_total() < (float) $f['suma_nuo'] ) { return false; }\n\t\t\tif ( '' !== $f['suma_iki'] && (float) $r['o']->get_total() > (float) $f['suma_iki'] ) { return false; }\n\t\t\tif ( $f['b'] && '' !== $f['q'] ) { /* paieškoje chips nepritaikomi — kaip anksčiau */ } elseif ( $f['b'] && self::filtras_aktyvus( $f ) ) { $st = $r['o']->get_status();\n\t\t\t\tif ( in_array( $f['b'], array( 'kelyje', 'ivykdyti', 'atsaukti' ), true ) && ! in_array( $st, Petshop_Desk::STATUSAI[ $f['b'] ], true ) ) { return false; }\n\t\t\t\tif ( 'siandien' === $f['b'] ) { $dn = wp_date( 'Y-m-d' ); $dc = $r['o']->get_date_completed(); $iss = (string) $r['o']->get_meta( '_ps_dalys_issiusta' ); if ( ! ( ( $dc && wp_date( 'Y-m-d', $dc->getTimestamp() ) === $dn ) || false !== strpos( $iss, '\"laikas\":\"' . $dn ) ) ) { return false; } } }")
# 4. rikiuoti(): seniausi
rep("\t\t\t\tcase 'laikas':   return $laikas( $b ) <=> $laikas( $a );","\t\t\t\tcase 'laikas':   return $laikas( $b ) <=> $laikas( $a );\n\t\t\t\tcase 'seniausi': return $laikas( $a ) <=> $laikas( $b ); // v3.36")
# 5. filtru_juosta(): akt, chips bulk, inputs
rep("\t\t$akt = $f['vykdymas'] || $f['vezejas'] || $f['data'] || $f['r'];","\t\t$akt = $f['vykdymas'] || $f['vezejas'] || $f['data'] || $f['r'] || $f['mok'] || $f['st'] || '' !== $f['suma_nuo'] || '' !== $f['suma_iki']; // v3.36")
rep("\t\t\techo '</div>';\n\t\t}\n\t\techo '<form method=\"get\" class=\"dl-f\"",
"\t\t\tif ( 'atsaukti' === $f['b'] ) { $kand = self::atsauktu_kandidatai( 0 ); $nk = count( $kand ); echo '<a class=\"v t maz\" href=\"' . esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=ps_dl_istrinti_atsauktus&g=' . rawurlencode( self::url( array( 'atidaryti' => null, 'psl' => null ) ) ) ), 'ps_dl_istrinti_atsauktus' ) ) . '\" data-d=\"' . esc_attr( wp_json_encode( array( 'antraste' => 'Ištrinti neapmokėtus atšauktus užsakymus (' . $nk . ')', 'tekstas' => 'Į WooCommerce šiukšlinę perkeliami TIK neapmokėti atšaukti užsakymai be sąskaitos ir siuntų (' . $nk . '). Apmokėti atšaukti (su PVM sąskaita ir kreditine) lieka. Šiukšlinėje 30 d. galima atstatyti, po to trinami galutinai.', 'ok' => 'Ištrinti (' . $nk . ')' ) ) ) . '\"' . ( $nk ? '' : ' style=\"opacity:.5;pointer-events:none\"' ) . '>Ištrinti neapmokėtus atšauktus (' . $nk . ')</a>'; } // v3.36 (3a)\n\t\t\techo '</div>';\n\t\t}\n\t\techo '<form method=\"get\" class=\"dl-f\"")
rep("\t\techo self::select( 'data', array( '' => 'Data: visos', 'siandien' => 'Šiandien', 'vakar' => 'Vakar', 'savaite' => 'Ši savaitė', 'menuo' => 'Šis mėnuo', 'praeitas' => 'Praeitas mėnuo' ), $f['data'] );\n\t\techo '<span class=\"pilkas maz\">Rikiuoti:</span>' . self::select( 'r', array( '' => 'skubiausi pirmi', 'laikas' => 'naujausi pirmi', 'suma' => 'suma', 'tiekejas' => 'tiekėjas', 'klientas' => 'klientas' ), $f['r'] );\n\t\tif ( $akt ) { echo '<a class=\"dl-x\" href=\"' . esc_url( self::url( array( 'vykdymas' => null, 'vezejas' => null, 'data' => null, 'r' => null ) ) ) . '\">išvalyti</a>'; }\n\t\techo '</form></div></div>';",
"\t\techo self::select( 'mok', array( '' => 'Apmokėjimas: visi', 'pavedimu' => 'Pavedimu', 'paysera' => 'Paysera', 'grynais' => 'Grynais', 'neapmoketa' => 'Neapmokėtas' ), $f['mok'] ); // v3.36\n\t\techo self::select( 'st', array( '' => 'Būsena: visos', 'vykdomas' => 'Vykdomas', 'sustabdytas' => 'Sustabdytas (laukia apmokėjimo)', 'ivykdytas' => 'Įvykdytas', 'atsauktas' => 'Atšauktas', 'grazintas' => 'Grąžintas', 'neapmoketas' => 'Neapmokėtas / nepavykęs' ), $f['st'] ); // v3.36\n\t\techo self::select( 'data', array( '' => 'Data: visos', 'siandien' => 'Šiandien', 'vakar' => 'Vakar', 'savaite' => 'Ši savaitė', 'menuo' => 'Šis mėnuo', 'praeitas' => 'Praeitas mėnuo', 'intervalas' => 'Nuo–iki' ), $f['data'] );\n\t\techo '<span class=\"dl-f-nuoiki\"><input type=\"date\" name=\"nuo\" value=\"' . esc_attr( $f['nuo'] ) . '\" title=\"Data nuo\" onchange=\"this.form.submit()\"> – <input type=\"date\" name=\"iki\" value=\"' . esc_attr( $f['iki'] ) . '\" title=\"Data iki\" onchange=\"this.form.submit()\"></span>'; // v3.36\n\t\techo '<span class=\"dl-f-nuoiki\"><span class=\"pilkas maz\">Suma €</span> <input type=\"number\" name=\"suma_nuo\" step=\"0.01\" min=\"0\" placeholder=\"nuo\" value=\"' . esc_attr( $f['suma_nuo'] ) . '\" onchange=\"this.form.submit()\"> – <input type=\"number\" name=\"suma_iki\" step=\"0.01\" min=\"0\" placeholder=\"iki\" value=\"' . esc_attr( $f['suma_iki'] ) . '\" onchange=\"this.form.submit()\"></span>'; // v3.36\n\t\techo '<span class=\"pilkas maz\">Rikiuoti:</span>' . self::select( 'r', array( '' => 'skubiausi pirmi', 'laikas' => 'naujausi pirmi', 'seniausi' => 'seniausi pirmi', 'suma' => 'suma', 'tiekejas' => 'tiekėjas', 'klientas' => 'klientas' ), $f['r'] );\n\t\techo '<button type=\"submit\" class=\"v t maz\">Rodyti</button>';\n\t\tif ( $akt ) { echo '<a class=\"dl-x\" href=\"' . esc_url( self::url( array( 'vykdymas' => null, 'vezejas' => null, 'data' => null, 'nuo' => null, 'iki' => null, 'r' => null, 'mok' => null, 'st' => null, 'suma_nuo' => null, 'suma_iki' => null ) ) ) . '\">išvalyti</a>'; }\n\t\techo '</form>' . ( self::$visi_riba ? '<p class=\"pilkas maz\" style=\"margin:4px 0 0\">Rodomi 200 naujausių — siaurink datą.</p>' : '' ) . '</div></div>';")
rep("\t\tforeach ( array( 'eile', 'q', 'data', 'nuo', 'iki', 'vykdymas', 'vezejas', 'b', 'r', 'psl' ) as $k )","\t\tforeach ( array( 'eile', 'q', 'data', 'nuo', 'iki', 'vykdymas', 'vezejas', 'b', 'r', 'psl', 'mok', 'st', 'suma_nuo', 'suma_iki' ) as $k )")
rep("\t\telse { self::lentele( $rows, $eile ); if ( 'visi' === $eile && '' === $f['q'] && ! $f['data'] ) { self::puslapiai( $f ); } }","\t\telse { self::lentele( $rows, $eile ); if ( 'visi' === $eile && '' === $f['q'] && ! self::filtras_aktyvus( $f ) ) { self::puslapiai( $f ); } }")
# CSS for inputs
rep(".dl-f{display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:12px}",".dl-f{display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:12px}.dl-f input[type=date],.dl-f input[type=number]{font:inherit;font-size:12px;border:1px solid var(--linija);border-radius:5px;padding:2px 6px;background:#fff;width:auto;min-height:0;line-height:1.4}.dl-f input[type=number]{width:72px}.dl-f-nuoiki{display:inline-flex;gap:4px;align-items:center}")
# 6. skydelio JSON: istrinti
rep("\t\t\t'grynais' => ( $f['ats'] && ! $f['paid'] && ! $f['uzdarytas'] ) ? self::dl_url( 'grynais', $id ) : '', // v3.35 (C): neapmokėtas atsiėmimo užsakymas — klientas moka atvykęs",
"\t\t\t'grynais' => ( $f['ats'] && ! $f['paid'] && ! $f['uzdarytas'] ) ? self::dl_url( 'grynais', $id ) : '', // v3.35 (C): neapmokėtas atsiėmimo užsakymas — klientas moka atvykęs\n\t\t\t'istrinti' => self::istrinamas( $o ) ? self::dl_url( 'istrinti', $id ) : '', // v3.36 (3a): atšauktas neapmokėtas → šiukšlinė")
# 7. JS footer
rep("\">Apmokėta grynais</a>'; /* v3.35 (C) */","\">Apmokėta grynais</a>'; /* v3.35 (C) */\n\t\tif(o.istrinti) f+='<a class=\"v t\" href=\"'+esc(o.istrinti)+'\" data-d=\"'+esc(JSON.stringify({antraste:'Ištrinti · #'+o.nr,tekstas:'Atšauktas neapmokėtas užsakymas be sąskaitos ir siuntų. Perkeliamas į WooCommerce šiukšlinę (30 d. galima atstatyti), iš darbalaukio dingsta.',ok:'Ištrinti'}))+'\">Ištrinti</a>'; /* v3.36 (3a) */")
# 8. vykdyti(): veiksmas + redirect be atidaryti
rep("\t\t\telseif ( 'grynais' === $v ) { $rez = self::apmoketa_grynais( $o, $u ); } // v3.35 (C)","\t\t\telseif ( 'grynais' === $v ) { $rez = self::apmoketa_grynais( $o, $u ); } // v3.35 (C)\n\t\t\telseif ( 'istrinti' === $v ) { $rez = self::istrinti_vykdyti( $o, $u ); if ( 'dl_info' === $rez[0] ) { $atgal = remove_query_arg( 'atidaryti', $atgal ); } } // v3.36 (3a)")
# 9. init(): admin_post + cron
rep("\t\tadd_action( 'ps_velavimo_laiskai', array( __CLASS__, 'velavimo_laiskai' ) ); // v3.13\n\t}","\t\tadd_action( 'ps_velavimo_laiskai', array( __CLASS__, 'velavimo_laiskai' ) ); // v3.13\n\t\tadd_action( 'admin_post_ps_dl_istrinti_atsauktus', array( __CLASS__, 'istrinti_atsauktus_vykdyti' ) ); // v3.36 (3a)\n\t\tadd_action( 'ps_dl_atsauktu_valymas', array( __CLASS__, 'atsauktu_valymas' ) ); // v3.36 (3b)\n\t}")
rep("\t\tif ( ! wp_next_scheduled( 'ps_velavimo_laiskai' ) ) { wp_schedule_single_event( self::kitas_1400(), 'ps_velavimo_laiskai' ); } // v3.13: vienkartinis, perplanuojamas kas run'ą\n\t}",
"\t\tif ( ! wp_next_scheduled( 'ps_velavimo_laiskai' ) ) { wp_schedule_single_event( self::kitas_1400(), 'ps_velavimo_laiskai' ); } // v3.13: vienkartinis, perplanuojamas kas run'ą\n\t\tif ( ! wp_next_scheduled( 'ps_dl_atsauktu_valymas' ) ) { $d = new DateTime( 'tomorrow 03:20', wp_timezone() ); wp_schedule_event( $d->getTimestamp(), 'daily', 'ps_dl_atsauktu_valymas' ); } // v3.36 (3b): kasdien 03:20 Vilnius\n\t}")
# 10. nauji metodai prieš apmoketa_grynais
rep("\tprotected static function apmoketa_grynais( $o, $u ) {",
"""\t/** v3.36 (3): ar atšauktą užsakymą galima trinti — TIK neapmokėtas, be apmokėjimo datos, be refund'ų, be PVM sąskaitos PDF, be siuntų. Apmokėti atšaukti (AVPN + KR-AVPN) — niekada. */
\tpublic static function istrinamas( $o ) {
\t\tif ( ! $o instanceof WC_Order ) { return false; }
\t\tif ( ! in_array( $o->get_status(), array( 'cancelled', 'lp-cancelled' ), true ) ) { return false; }
\t\tif ( $o->is_paid() || $o->get_date_paid() ) { return false; }
\t\tif ( $o->get_refunds() ) { return false; }
\t\tif ( (string) $o->get_meta( '_petshop_completed_pdf' ) !== '' ) { return false; }
\t\tif ( (string) $o->get_meta( '_ps_siuntos' ) !== '' || (string) $o->get_meta( '_ps_dalys_issiusta' ) !== '' ) { return false; }
\t\treturn true;
\t}

\t/** v3.36 (3): atšauktų neapmokėtų kandidatai; $senumas_d > 0 — tik modifikuoti anksčiau nei prieš N dienų (cron). */
\tprotected static function atsauktu_kandidatai( $senumas_d = 0, $riba = 500 ) {
\t\t$args = array( 'limit' => $riba, 'type' => 'shop_order', 'status' => array( 'cancelled', 'lp-cancelled' ), 'orderby' => 'date', 'order' => 'ASC', 'return' => 'objects' );
\t\tif ( $senumas_d > 0 ) { $args['date_modified'] = '<' . ( time() - $senumas_d * DAY_IN_SECONDS ); }
\t\t$out = array(); foreach ( (array) wc_get_orders( $args ) as $o ) { if ( self::istrinamas( $o ) ) { $out[] = $o; } } return $out;
\t}

\t/** v3.36 (3): vienas užsakymas → WC šiukšlinė (`delete(false)`; HPOS — būsena trash). */
\tprotected static function i_siuksline( $o, $kas, $kaip ) {
\t\t$id = $o->get_id(); $o->add_order_note( 'Darbalaukis: ' . $kaip . ' — atšauktas neapmokėtas užsakymas perkeltas į šiukšlinę (' . $kas . ').', false, true ); $o->save();
\t\tif ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $id, 'sritis' => 'desk', 'veiksmas' => 'istrinti', 'rezultatas' => 'ok', 'kanalas' => 'cron' === $kaip ? 'cron' : 'web', 'kas_vardas' => $kas, 'pastaba' => $kaip . ' → šiukšlinė' ) ); }
\t\tself::d( 'laiskai_off' ); $ok = (bool) $o->delete( false ); self::d( 'laiskai_on' ); return $ok;
\t}

\t/** v3.36 (3a): skydelio „Ištrinti“. */
\tprotected static function istrinti_vykdyti( $o, $u ) {
\t\tif ( ! self::istrinamas( $o ) ) { return array( 'dl_klaida', 'trinti negalima — tik atšauktas NEAPMOKĖTAS užsakymas be sąskaitos ir siuntų' ); }
\t\t$nr = $o->get_order_number(); $ok = self::i_siuksline( $o, $u->display_name, 'darbuotojas' ); do_action( 'ps_juosta_isvalyti' );
\t\treturn $ok ? array( 'dl_info', 'užsakymas #' . $nr . ' perkeltas į šiukšlinę (30 d. galima atstatyti WooCommerce → Užsakymai → Šiukšlinė)' ) : array( 'dl_klaida', 'perkelti į šiukšlinę nepavyko' );
\t}

\t/** v3.36 (3a): filtro „Atšaukti“ mygtukas — visi neapmokėti atšaukti → šiukšlinė. */
\tpublic static function istrinti_atsauktus_vykdyti() {
\t\tif ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
\t\tcheck_admin_referer( 'ps_dl_istrinti_atsauktus' );
\t\t$atgal = wp_validate_redirect( isset( $_GET['g'] ) ? wp_unslash( $_GET['g'] ) : '', admin_url( 'admin.php?page=' . self::SLUG . '&eile=visi&b=atsaukti' ) );
\t\t$u = wp_get_current_user(); $n = 0; $kl = 0; set_time_limit( 280 );
\t\tforeach ( self::atsauktu_kandidatai( 0 ) as $o ) { try { if ( self::i_siuksline( $o, $u->display_name, 'darbuotojas (visi)' ) ) { $n++; } else { $kl++; } } catch ( Throwable $e ) { $kl++; } }
\t\tdo_action( 'ps_juosta_isvalyti' );
\t\twp_safe_redirect( add_query_arg( array( 'pd_ok' => $kl ? 'dl_klaida' : 'dl_info', 'pd_nr' => rawurlencode( '|į šiukšlinę perkelta neapmokėtų atšauktų užsakymų: ' . $n . ( $kl ? ', nepavyko: ' . $kl : '' ) ) ), $atgal ) ); exit;
\t}

\t/** v3.36 (3b): CRON `ps_dl_atsauktu_valymas` kasdien 03:20 — atšauktas neapmokėtas, nemodifikuotas > ATSAUKTU_DIENOS → šiukšlinė; šiukšlinėje neapmokėtas > ATSAUKTU_DIENOS → galutinai. Grąžina ataskaitą (testams). */
\tpublic static function atsauktu_valymas() {
\t\t$r = array( 'laikas' => current_time( 'mysql' ), 'i_siuksline' => 0, 'galutinai' => 0, 'klaidos' => 0 ); set_time_limit( 280 );
\t\tforeach ( self::atsauktu_kandidatai( self::ATSAUKTU_DIENOS, 200 ) as $o ) { try { if ( self::i_siuksline( $o, 'automatiškai', 'cron' ) ) { $r['i_siuksline']++; } } catch ( Throwable $e ) { $r['klaidos']++; } }
\t\t$tr = wc_get_orders( array( 'limit' => 200, 'type' => 'shop_order', 'status' => 'trash', 'date_modified' => '<' . ( time() - self::ATSAUKTU_DIENOS * DAY_IN_SECONDS ), 'return' => 'objects' ) );
\t\tforeach ( (array) $tr as $o ) { if ( ! $o instanceof WC_Order ) { continue; } if ( $o->is_paid() || $o->get_date_paid() || $o->get_refunds() || (string) $o->get_meta( '_petshop_completed_pdf' ) !== '' ) { continue; } try { if ( $o->delete( true ) ) { $r['galutinai']++; } } catch ( Throwable $e ) { $r['klaidos']++; } }
\t\tupdate_option( 'ps_dl_atsauktu_valymas_paskutinis', $r, false ); return $r;
\t}

\tprotected static function apmoketa_grynais( $o, $u ) {""")
open('dl_v336.php','w',encoding='utf-8').write(s); print('ok',len(s.encode()))
