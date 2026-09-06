import sys, subprocess, hashlib
s = open('/home/claude/ps/petshop-darbalaukis-v334.php', encoding='utf-8').read()
assert hashlib.md5(s.encode('utf-8')).hexdigest() == '94d92bcc20882428622e5b1792782566', 'baseline md5 ne v3.34'
funcs = open('/home/claude/ps/v335_funcs.php', encoding='utf-8').read()
def rep(a, b, cnt=1):
    global s
    n = s.count(a)
    if n != cnt: print('FAIL', n, repr(a[:110])); sys.exit(1)
    s = s.replace(a, b)
rep(" * Petshop Darbalaukis v3.34 (S1617/S1618/S1619,", " * Petshop Darbalaukis v3.35 (S1617/S1618/S1619,")
rep("false on-hold metu (`telefonu_likutis`)); po v3.20)",
    "false on-hold metu (`telefonu_likutis`); v3.35 (S1619, Raimis C — VISAS, bet IŠJUNGTAS): „ATSIĖMIMAS AV“ — WC zonos „Lietuva“ `local_pickup` instancija (sukurta IŠJUNGTA; Raimis įjungia WC → kasoje ir „+ Naujas užsakymas“ formoje `naujas_pristatymas`; opcija `ps_dl_atsiemimas_av` nebenaudojama); užsakymas su `local_pickup` (`atsiemimas()`): visos prekės per AV (`eilutes_kelias` tiesiai → i_av, `galimi.tiesiai=false`), takelis surinkti → „Paruošta atsiimti“ (GET `ats_paruosta`, laiškas klientui pagal taisomą šabloną `ps_dl_ats_laiskas` — adresas Liucionių g. 46, darbo laikas iš svetainės; varnelė „nesiųsti“) → „Klientas atsiėmė“ (GET `atsieme` → `_ps_dalys_issiusta.av` kanalas `atsiemimas`, `_ps_uzbaigti_be_siuntu`, completed — tema AVPN, WC „įvykdytas“ laiškas su sąskaita); neapmokėtam atsiėmimo užsakymui skydelyje „Apmokėta grynais“ (GET `grynais` → cod + processing; kvitas PPK atskirai); eilės: Surinkti → Paruošta; „Redaguoti“ atsiėmimui nėra; Sąskaitų lange kvito data iš `_petshop_ppk_date`; filtras „Pristatymas“ + „Atsiėmimas AV / kita“); po v3.20)")
rep("\tconst VERSIJA = '3.34';", "\tconst VERSIJA = '3.35';")
rep("\t\tadd_action( 'admin_post_ps_dl_kr_sablonas', array( __CLASS__, 'kr_sablonas_vykdyti' ) ); // v3.31\n",
    "\t\tadd_action( 'admin_post_ps_dl_kr_sablonas', array( __CLASS__, 'kr_sablonas_vykdyti' ) ); // v3.31\n"
    "\t\tadd_action( 'admin_post_ps_dl_ats_sablonas', array( __CLASS__, 'ats_sablonas_vykdyti' ) ); // v3.35 (C)\n")
rep("\t\t\telseif ( 'kvitas' === $v ) { $rez = self::kvitas_vykdyti( $o, $u ); } // v3.34 (PPK)\n",
    "\t\t\telseif ( 'kvitas' === $v ) { $rez = self::kvitas_vykdyti( $o, $u ); } // v3.34 (PPK)\n"
    "\t\t\telseif ( 'ats_paruosta' === $v ) { $rez = self::atsiemimas_paruosta( $o, $u, ! empty( $_GET['be_laisko'] ) ); } // v3.35 (C)\n"
    "\t\t\telseif ( 'atsieme' === $v ) { $rez = self::atsiemimas_atsieme( $o, $u ); } // v3.35 (C)\n"
    "\t\t\telseif ( 'grynais' === $v ) { $rez = self::apmoketa_grynais( $o, $u ); } // v3.35 (C)\n")
# naujas_pristatymas: local_pickup iš zonos
rep("'lp_kurjeris' => array( 't' => 'LP Express kurjeris', 'tipas' => 'lp_kurjeris', 'inst' => array() ) );\n\t\t$zonos = WC_Shipping_Zones::get_zones();",
    "'lp_kurjeris' => array( 't' => 'LP Express kurjeris', 'tipas' => 'lp_kurjeris', 'inst' => array() ), 'av' => array( 't' => 'Atsiėmimas AV', 'tipas' => 'av', 'inst' => array() ) ); // v3.35 (C): 'av' — iš zonos `local_pickup`\n\t\t$zonos = WC_Shipping_Zones::get_zones();")
rep("$out[ 'HANDS' === ( $s['plan'] ?? '' ) ? 'lp_kurjeris' : 'lp' ]['inst'][] = $row; }\n\t\t\t}\n",
    "$out[ 'HANDS' === ( $s['plan'] ?? '' ) ? 'lp_kurjeris' : 'lp' ]['inst'][] = $row; }\n"
    "\t\t\t\telseif ( 'local_pickup' === $m->id ) { $row['fee'] = (float) str_replace( ',', '.', (string) ( $s['cost'] ?? 0 ) ); $out['av']['inst'][] = $row; } // v3.35 (C): WC zonos instancija — Raimis įjungia WC → atsiranda ir kasoje, ir čia (vienas jungiklis)\n\t\t\t}\n")
rep("\t\tif ( get_option( 'ps_dl_atsiemimas_av' ) ) { $out['av'] = array( 't' => 'Atsiėmimas AV', 'tipas' => 'av', 'inst' => array( array( 'id' => 'local_pickup', 'inst' => 0, 'title' => 'Atsiėmimas AV', 'fee' => 0.0, 'nuo' => 0.0, 'iki' => 0.0, 'nemok' => 0.0 ) ) ); } // C (išjungta, kol Raimis neįjungė)\n",
    "\t\t// v3.35 (C): opcija `ps_dl_atsiemimas_av` nebenaudojama — jungiklis vienas: WC zonos „Lietuva“ `local_pickup` instancija (išjungta, kol Raimis neįjungė).\n")
# eilutes_kelias: atsiėmimas → per AV
rep("\t\t\telse { $k = ''; }\n\t\t}\n\t\t// K1 (auditas 09-03): rodomas kelias = f(_ps_source, partija).",
    "\t\t\telse { $k = ''; }\n\t\t}\n\t\tif ( 'tiesiai' === $k && self::atsiemimas( $o ) ) { $k = 'i_av'; } // v3.35 (C): atsiėmimas AV — tiekėjo prekės TIK per AV (tiesiai klientui nėra kam siųsti)\n\t\t// K1 (auditas 09-03): rodomas kelias = f(_ps_source, partija).")
# faktai(): ats žymė
rep("'kl' => self::d( 'klausimas', $o ), 'vez' => self::d( 'vezejas', $o ),\n",
    "'kl' => self::d( 'klausimas', $o ), 'vez' => self::d( 'vezejas', $o ), 'ats' => self::atsiemimas( $o ), /* v3.35 (C) */\n")
rep("'galimi' => array( 'av' => 'av' === $k || '' === $k || ( null !== $av_qty && $av_qty >= $q ), 'tiesiai' => (bool) $tiek && 'lp' !== $f['vez'], 'i_av' => (bool) $tiek )",
    "'galimi' => array( 'av' => 'av' === $k || '' === $k || ( null !== $av_qty && $av_qty >= $q ), 'tiesiai' => (bool) $tiek && 'lp' !== $f['vez'] && ! $f['ats'], 'i_av' => (bool) $tiek )")
rep("\t\t$lapas     = (bool) $o->get_meta( '_ps_surinkta' ) || ( ! empty( $zz['lapai'] ) && ! isset( $zz['nesurinkta'] ) );\n",
    "\t\t$lapas     = (bool) $o->get_meta( '_ps_surinkta' ) || ( ! empty( $zz['lapai'] ) && ! isset( $zz['nesurinkta'] ) );\n"
    "\t\t$ats_z     = $f['ats'] ? self::ats_zymes( $o ) : array( 'paruosta' => '', 'laiskas' => '', 'atsieme' => '' ); $f['ats_z'] = $ats_z; // v3.35 (C)\n")
rep("\t\t\t\t$zg = array( array( 'Surinkti', $lapas || $av_siunta ), array( 'Lipdukas', $av_siunta ), array( 'Kurjeris paėmė', $baigta ) );\n",
    "\t\t\t\t$zg = $f['ats'] ? array( array( 'Surinkti', $lapas ), array( 'Paruošta atsiimti', (bool) $ats_z['paruosta'] || $baigta ), array( 'Klientas atsiėmė', $baigta ) ) : array( array( 'Surinkti', $lapas || $av_siunta ), array( 'Lipdukas', $av_siunta ), array( 'Kurjeris paėmė', $baigta ) ); // v3.35 (C)\n")
rep("\t\t\t\t$zg = array( array( 'Užsakyti iš ' . $t . ' į AV', $uz ), array( 'Gauta į AV', $ga ), array( 'Surinkti', $lapas || $av_siunta ), array( 'Lipdukas', $av_siunta ), array( 'Kurjeris paėmė', $baigta ) );\n",
    "\t\t\t\t$zg = $f['ats'] ? array( array( 'Užsakyti iš ' . $t . ' į AV', $uz ), array( 'Gauta į AV', $ga ), array( 'Surinkti', $lapas ), array( 'Paruošta atsiimti', (bool) $ats_z['paruosta'] || $baigta ), array( 'Klientas atsiėmė', $baigta ) ) : array( array( 'Užsakyti iš ' . $t . ' į AV', $uz ), array( 'Gauta į AV', $ga ), array( 'Surinkti', $lapas || $av_siunta ), array( 'Lipdukas', $av_siunta ), array( 'Kurjeris paėmė', $baigta ) ); // v3.35 (C)\n")
rep("\t\t\t\t$T[] = array( 'lipdukas', 'lp' === $f['vez'] ? 'lipdukas LP' : 'lipdukas', $av_siunta ? 'done' : ( $lapas && $rus ? 'now' : 'todo' ), 'lp' === $f['vez'] ? 'lp' : 'av', $av_siunta ? null : 'lipdukas' );\n"
    "\t\t\t\tif ( $rus && $vietoje && ! $av_siunta && ! $f['kl'] && ! $baigta ) { $eiles['surinkti'] = 1; }\n"
    "\t\t\t\t$av_iss = $f['dalys']['av']['issiusta'];\n"
    "\t\t\t\t$T[] = array( 'issiusta', 'kurjeris paėmė', $av_iss ? 'done' : ( $av_siunta ? 'now' : 'todo' ), 'av', $av_iss ? null : 'issiusta' );\n"
    "\t\t\t\tif ( $av_siunta && ! $av_iss ) { $eiles['paruosta'] = 1; }\n",
    "\t\t\t\tif ( $f['ats'] ) { // v3.35 (C): atsiėmimas AV — lipduko nėra: surinkta → „paruošta atsiimti“ (laiškas) → „klientas atsiėmė“ (completed)\n"
    "\t\t\t\t\t$par = (bool) $ats_z['paruosta'];\n"
    "\t\t\t\t\t$T[] = array( 'ats_par', 'paruošta atsiimti', $par || $baigta ? 'done' : ( $lapas && $rus ? 'now' : 'todo' ), 'av', $par || $baigta ? null : 'ats_paruosta' );\n"
    "\t\t\t\t\tif ( $rus && $vietoje && ! $lapas && ! $f['kl'] && ! $baigta ) { $eiles['surinkti'] = 1; }\n"
    "\t\t\t\t\t$T[] = array( 'atsieme', 'klientas atsiėmė', $baigta ? 'done' : ( $par ? 'now' : 'todo' ), 'av', $baigta ? null : 'atsieme' );\n"
    "\t\t\t\t\tif ( $lapas && ! $baigta ) { $eiles['paruosta'] = 1; }\n"
    "\t\t\t\t} else {\n"
    "\t\t\t\t$T[] = array( 'lipdukas', 'lp' === $f['vez'] ? 'lipdukas LP' : 'lipdukas', $av_siunta ? 'done' : ( $lapas && $rus ? 'now' : 'todo' ), 'lp' === $f['vez'] ? 'lp' : 'av', $av_siunta ? null : 'lipdukas' );\n"
    "\t\t\t\tif ( $rus && $vietoje && ! $av_siunta && ! $f['kl'] && ! $baigta ) { $eiles['surinkti'] = 1; }\n"
    "\t\t\t\t$av_iss = $f['dalys']['av']['issiusta'];\n"
    "\t\t\t\t$T[] = array( 'issiusta', 'kurjeris paėmė', $av_iss ? 'done' : ( $av_siunta ? 'now' : 'todo' ), 'av', $av_iss ? null : 'issiusta' );\n"
    "\t\t\t\tif ( $av_siunta && ! $av_iss ) { $eiles['paruosta'] = 1; }\n"
    "\t\t\t\t}\n")
# mygtukas(): nauji atvejai
rep("\t\t\tcase 'issiusta':\n\t\t\t\t$dalis = $s ? $s : 'av'; $tekstas = 'av' === $dalis ? 'Kurjeris paėmė' : self::vardas( $dalis ) . ' išsiuntė';",
    "\t\t\tcase 'ats_paruosta': // v3.35 (C)\n"
    "\t\t\t\t$el = $o->get_billing_email(); $sa = self::ats_laisko_sablonas();\n"
    "\t\t\t\treturn array( 'Paruošta atsiimti', self::dl_url( 'ats_paruosta', $id ), array( 'antraste' => $antraste, 'tekstas' => 'Užsakymas surinktas — pranešti klientui, kad galima atsiimti (' . $sa['adresas'] . '; ' . $sa['valandos'] . ')? ' . ( is_email( $el ) ? 'Laiškas išeis į ' . $el . '.' : 'El. pašto nėra — paskambink ' . $o->get_billing_phone() . '.' ), 'ok' => 'Paruošta atsiimti', 'opt' => is_email( $el ) ? array( 'vardas' => 'be_laisko', 'tekstas' => 'Nesiųsti laiško klientui', 'def' => 0 ) : null ), 'p', 0 );\n"
    "\t\t\tcase 'atsieme': // v3.35 (C)\n"
    "\t\t\t\treturn array( 'Klientas atsiėmė', self::dl_url( 'atsieme', $id ), array( 'antraste' => $antraste, 'tekstas' => 'Klientas atsiėmė prekes? Užsakymas įvykdytas; PVM sąskaita klientui — el. paštu (kaip visada).' . ( ! $f['paid'] ? ' DĖMESIO: užsakymas NEAPMOKĖTAS — pirma „Apmokėta grynais“.' : '' ), 'ok' => 'Klientas atsiėmė' ), 'p', 0 );\n"
    "\t\t\tcase 'issiusta':\n\t\t\t\t$dalis = $s ? $s : 'av'; $tekstas = 'av' === $dalis ? 'Kurjeris paėmė' : self::vardas( $dalis ) . ' išsiuntė';")
# skydelis(): vežėjas, grynais, pastaba
rep("\t\t\t'vezejas' => self::d( 'vezejo_vardas', $o ), 'vieta' => (string) $o->get_meta( 'venipak_pickup_point' ), 'pastaba_kl' => $o->get_customer_note(),\n",
    "\t\t\t'vezejas' => $f['ats'] ? 'Atsiėmimas AV' : self::d( 'vezejo_vardas', $o ), 'vieta' => (string) $o->get_meta( 'venipak_pickup_point' ), 'pastaba_kl' => $o->get_customer_note(), /* v3.35 (C) */\n")
rep("\t\t\t'dok' => self::dokumentai( $o ), // v3.26\n",
    "\t\t\t'dok' => self::dokumentai( $o ), // v3.26\n"
    "\t\t\t'grynais' => ( $f['ats'] && ! $f['paid'] && ! $f['uzdarytas'] ) ? self::dl_url( 'grynais', $id ) : '', // v3.35 (C): neapmokėtas atsiėmimo užsakymas — klientas moka atvykęs\n")
rep("\t\t\t: 'Surūšiuota. Kelią dar gali keisti, kol prekei nepadarytas pirmas žingsnis.' ) ); }\n",
    "\t\t\t: 'Surūšiuota. Kelią dar gali keisti, kol prekei nepadarytas pirmas žingsnis.' ) ); }\n"
    "\t\tif ( $f['ats'] && ! $f['uzdarytas'] ) { $pastaba = 'ATSIĖMIMAS AV (lipduko nėra): surinkti → „Paruošta atsiimti“ (laiškas klientui) → „Klientas atsiėmė“ (įvykdytas, PVM sąskaita). ' . ( ! $f['paid'] ? 'Neapmokėtas — klientas moka atvykęs → „Apmokėta grynais“; pavedimas gautas → „Pažymėti apmokėtu“. ' : '' ) . $pastaba; } // v3.35 (C)\n")
rep("\tprotected static function redagavimas( $f ) {\n\t\t$o = $f['o']; $id = $f['id'];\n\t\tif ( $f['uzdarytas'] ) { return null; }",
    "\tprotected static function redagavimas( $f ) {\n\t\t$o = $f['o']; $id = $f['id'];\n\t\tif ( $f['uzdarytas'] || $f['ats'] ) { return null; } // v3.35 (C): atsiėmimui pristatymo redaguoti nėra ko")
# JS: „Apmokėta grynais“ footer'yje
rep("else f+='<a class=\"v p\" href=\"'+esc(o.btn.u)+'\"'+(o.btn.d?' data-d=\"'+esc(JSON.stringify(o.btn.d))+'\"':'')+'>'+esc(o.btn.t)+'</a>'; }\n",
    "else f+='<a class=\"v p\" href=\"'+esc(o.btn.u)+'\"'+(o.btn.d?' data-d=\"'+esc(JSON.stringify(o.btn.d))+'\"':'')+'>'+esc(o.btn.t)+'</a>'; }\n"
    "\t\tif(o.grynais) f+='<a class=\"v t\" href=\"'+esc(o.grynais)+'\" data-d=\"'+esc(JSON.stringify({antraste:'Apmokėta grynais · #'+o.nr,tekstas:'Klientas atvyko ir sumokėjo grynais? Užsakymas pažymimas apmokėtu (grynais) ir eina į darbą; kvitą (PPK) suformuok „Sąskaitos“ bloke.',ok:'Apmokėta grynais'}))+'\">Apmokėta grynais</a>'; /* v3.35 (C) */\n")
# filtras Pristatymas
rep("echo self::select( 'vezejas', array( '' => 'Pristatymas: visi', 'venipak_kurjeris' => 'Venipak kurjeris', 'venipak_pastomatas' => 'Venipak paštomatas', 'lp' => 'LP Express' ), $f['vezejas'] );",
    "echo self::select( 'vezejas', array( '' => 'Pristatymas: visi', 'venipak_kurjeris' => 'Venipak kurjeris', 'venipak_pastomatas' => 'Venipak paštomatas', 'lp' => 'LP Express', 'kita' => 'Atsiėmimas AV / kita' ), $f['vezejas'] ); // v3.35 (C): variklio `vezejas()` atsiėmimui = kita")
# Sąskaitų langas: ats šablono forma (2 vietos) + PPK data iš meta
rep("if ( ! $rows ) { echo '<p class=\"dl-paaisk\">Dokumentų pagal šiuos filtrus nėra.</p>'; self::kr_sablono_forma(); echo '</main>'; return; }",
    "if ( ! $rows ) { echo '<p class=\"dl-paaisk\">Dokumentų pagal šiuos filtrus nėra.</p>'; self::kr_sablono_forma(); self::ats_sablono_forma(); echo '</main>'; return; }")
rep("\t\tself::kr_sablono_forma(); // v3.31\n\t\techo '</main>';\n",
    "\t\tself::kr_sablono_forma(); // v3.31\n\t\tself::ats_sablono_forma(); // v3.35 (C)\n\t\techo '</main>';\n")
rep("( 'ppk' === $tipas ? 'COALESCE(od.date_paid_gmt,o.date_created_gmt)' : 'o.date_created_gmt' ); // v3.27: HPOS datos — `wc_order_operational_data`; v3.34: kvitas — apmokėjimo diena",
    "( 'ppk' === $tipas ? \"COALESCE(TIMESTAMP(dd.meta_value,'12:00:00'),od.date_paid_gmt,o.date_created_gmt)\" : 'o.date_created_gmt' ); // v3.27: HPOS datos — `wc_order_operational_data`; v3.35: kvitas — kvito diena `_petshop_ppk_date` (v3.34 ėmė apmokėjimo)\n\t\t\t$dj = 'ppk' === $tipas ? \" LEFT JOIN {$p}wc_orders_meta dd ON dd.order_id=o.id AND dd.meta_key='_petshop_ppk_date'\" : '';")
rep("LEFT JOIN {$p}wc_orders_meta p ON p.order_id=o.id AND p.meta_key='{$meta_pdf}' WHERE m.meta_key='{$meta_nr}'\";\n\t\t};",
    "LEFT JOIN {$p}wc_orders_meta p ON p.order_id=o.id AND p.meta_key='{$meta_pdf}'{$dj} WHERE m.meta_key='{$meta_nr}'\";\n\t\t};")
rep("Kreditinės data — išrašymo diena; PVM sąskaitos — įvykdymo (apmokėjimo) diena; išankstinės — užsakymo diena; kvito — apmokėjimo diena.",
    "Kreditinės data — išrašymo diena; PVM sąskaitos — įvykdymo (apmokėjimo) diena; išankstinės — užsakymo diena; kvito — kvito suformavimo diena.")
# funkcijos prieš v3.34 bloką
rep("\t/* ============================ v3.34: PINIGŲ PRIĖMIMO KVITAS (PPK) + telefoninio pavedimo likutis (Raimis 09-06: PPK 1–6, B 6) ============================ */",
    funcs.strip('\n') + "\n\n\t/* ============================ v3.34: PINIGŲ PRIĖMIMO KVITAS (PPK) + telefoninio pavedimo likutis (Raimis 09-06: PPK 1–6, B 6) ============================ */")
out = '/home/claude/ps/petshop-darbalaukis-v335.php'
open(out, 'w', encoding='utf-8').write(s)
r = subprocess.run(['php', '-l', out], capture_output=True, text=True)
print(r.stdout.strip(), r.stderr.strip())
if r.returncode != 0 or 'No syntax errors' not in r.stdout: print('LINT FAIL — STOP'); sys.exit(1)
print('bytes', len(s.encode('utf-8')), 'md5', hashlib.md5(s.encode('utf-8')).hexdigest())
