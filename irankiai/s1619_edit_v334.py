import sys, subprocess, hashlib
s = open('/home/claude/ps/dl.php', encoding='utf-8').read()
assert hashlib.md5(s.encode('utf-8')).hexdigest() == '29c9bede2199f95ad38b0591878a2f8a', 'baseline md5 ne v3.33.2'
funcs = open('/home/claude/ps/v334_funcs.php', encoding='utf-8').read()
def rep(a, b, cnt=1):
    global s
    n = s.count(a)
    if n != cnt: print('FAIL', n, repr(a[:110])); sys.exit(1)
    s = s.replace(a, b)
rep(" * Petshop Darbalaukis v3.33.2 (S1617/S1618,", " * Petshop Darbalaukis v3.34 (S1617/S1618/S1619,")
rep("v3.33.2: `window.dlgForm/dlEsc` iš dl-js IIFE (naujo užsakymo JS „esc is not defined“)); po v3.20)",
    "v3.33.2: `window.dlgForm/dlEsc` iš dl-js IIFE (naujo užsakymo JS „esc is not defined“); v3.34 (S1619, Raimis 09-06 PPK): „Apmokėta vietoje“ → „Apmokėta grynais“ (kortelių nėra — terminalo nėra; `cod` + pavadinimas), PINIGŲ PRIĖMIMO KVITAS — skydelio „Sąskaitos“ bloke grynais apmokėtam užsakymui mygtukas „Suformuoti kvitą“ (darbuotojas spaudžia, kai klientas moka — ne automatiškai; GET `kvitas` → `kvitas_vykdyti`): PPK sava eilė nuo 101 (`petshop_ppk_counter`), meta `_petshop_ppk_number/_date/_suma/_kas/_pdf`, PDF temos base.php v2.12 `$template='receipt'` (UAB Avesa, mokėtojas, suma skaičiais ir žodžiais `suma_zodziais`, paskirtis su užsakymo nr. ir AVPN, „pinigus priėmė“ + parašas ranka) → `uploads/wcdn/receipt/`; TIK spausdinti (el. paštu nesiunčiamas); Sąskaitų lange tipas „Kvitas“ (`t=ppk`, į sumą neskaičiuojamas); B (6): telefoninio pavedimu užsakymo WC likutis nurašomas TIK apmokėjus — `woocommerce_payment_complete_reduce_order_stock` / `woocommerce_can_reduce_order_stock` false on-hold metu (`telefonu_likutis`)); po v3.20)")
rep("\tconst VERSIJA = '3.33.2';", "\tconst VERSIJA = '3.34';")
rep("\tconst KR_COUNTER_OPT = 'petshop_kravpn_counter';     // v3.25: kreditinių KR-AVPN sava eilė — KITAS numeris (kaip `petshop_avpn_counter`; T-0 → 101)\n",
    "\tconst KR_COUNTER_OPT = 'petshop_kravpn_counter';     // v3.25: kreditinių KR-AVPN sava eilė — KITAS numeris (kaip `petshop_avpn_counter`; T-0 → 101)\n"
    "\tconst PPK_COUNTER_OPT = 'petshop_ppk_counter';       // v3.34: pinigų priėmimo kvitų PPK sava eilė — KITAS numeris (Raimis 09-06: nuo 101; T-0 → 101)\n")
rep("\t\tadd_action( 'admin_post_ps_dl_naujas', array( __CLASS__, 'naujas_vykdyti' ) ); // v3.33 (B)\n",
    "\t\tadd_action( 'admin_post_ps_dl_naujas', array( __CLASS__, 'naujas_vykdyti' ) ); // v3.33 (B)\n"
    "\t\tadd_filter( 'woocommerce_payment_complete_reduce_order_stock', array( __CLASS__, 'telefonu_likutis' ), 10, 2 ); // v3.34 (B 6): telefoninio pavedimu — likutis tik apmokėjus\n"
    "\t\tadd_filter( 'woocommerce_can_reduce_order_stock', array( __CLASS__, 'telefonu_likutis_wc' ), 10, 2 ); // v3.34 (B 6)\n")
rep("\t\t\telseif ( 'dok_gen' === $v ) { $rez = self::dok_gen( $o, $u ); } // v3.26\n",
    "\t\t\telseif ( 'dok_gen' === $v ) { $rez = self::dok_gen( $o, $u ); } // v3.26\n"
    "\t\t\telseif ( 'kvitas' === $v ) { $rez = self::kvitas_vykdyti( $o, $u ); } // v3.34 (PPK)\n")
rep("\t\t$raktai = array( 'avpn' => '_petshop_completed_pdf', 'iapv' => '_petshop_order_pdf', 'kr' => '_petshop_kravpn_pdf' );",
    "\t\t$raktai = array( 'avpn' => '_petshop_completed_pdf', 'iapv' => '_petshop_order_pdf', 'kr' => '_petshop_kravpn_pdf', 'ppk' => '_petshop_ppk_pdf' ); // v3.34: kvitas")
# dokumentai(): PPK įrašas / mygtukas prieš return
rep("\t\tforeach ( $pasl as $pid ) { $n = wc_get_order( (int) $pid ); if ( ! $n || ! $n->get_meta( '_petshop_avpn_number' ) ) { continue; } $p = (string) $n->get_meta( '_petshop_completed_pdf' ); $z = 'grazinimo_islaidos' === (string) $n->get_meta( '_ps_paslauga' ) ? 'Siuntos grąžinimo išlaidos (#' . $n->get_order_number() . ')' : 'Pakartotinis siuntimas (#' . $n->get_order_number() . ')'; $d[] = array( 't' => 'avpn', 'z' => $z, 'nr' => (string) $n->get_meta( '_petshop_avpn_number' ), 'd' => $data( $n->get_date_completed() ), 's' => self::eur( $n->get_total() ), 'u' => $p && file_exists( $p ) ? $pdf_u( 'avpn', (int) $pid ) : '', 'gen' => '' ); }\n\t\treturn $d;\n",
    "\t\tforeach ( $pasl as $pid ) { $n = wc_get_order( (int) $pid ); if ( ! $n || ! $n->get_meta( '_petshop_avpn_number' ) ) { continue; } $p = (string) $n->get_meta( '_petshop_completed_pdf' ); $z = 'grazinimo_islaidos' === (string) $n->get_meta( '_ps_paslauga' ) ? 'Siuntos grąžinimo išlaidos (#' . $n->get_order_number() . ')' : 'Pakartotinis siuntimas (#' . $n->get_order_number() . ')'; $d[] = array( 't' => 'avpn', 'z' => $z, 'nr' => (string) $n->get_meta( '_petshop_avpn_number' ), 'd' => $data( $n->get_date_completed() ), 's' => self::eur( $n->get_total() ), 'u' => $p && file_exists( $p ) ? $pdf_u( 'avpn', (int) $pid ) : '', 'gen' => '' ); }\n"
    "\t\tif ( self::grynais( $o ) ) { // v3.34 (PPK): grynais apmokėtam — kvitas (jei yra) arba mygtukas „Suformuoti kvitą“ (darbuotojas spaudžia, kai klientas moka)\n"
    "\t\t\t$nr = (string) $o->get_meta( '_petshop_ppk_number' );\n"
    "\t\t\tif ( $nr ) { $p = (string) $o->get_meta( '_petshop_ppk_pdf' ); $d[] = array( 't' => 'ppk', 'z' => 'Pinigų priėmimo kvitas', 'nr' => $nr, 'd' => (string) $o->get_meta( '_petshop_ppk_date' ), 's' => self::eur( (float) $o->get_meta( '_petshop_ppk_suma' ) ), 'u' => $p && file_exists( $p ) ? $pdf_u( 'ppk', $id ) : '', 'gen' => '', 'kas' => (string) $o->get_meta( '_petshop_ppk_kas' ) ); }\n"
    "\t\t\telse { $cu = wp_get_current_user(); $d[] = array( 't' => 'ppk', 'z' => 'Pinigų priėmimo kvitas', 'nr' => '', 'd' => '', 's' => self::eur( $o->get_total() ), 'u' => '', 'gen' => '', 'btn' => self::dl_url( 'kvitas', $id ), 'bt' => 'Suformuoti kvitą', 'dlg' => array( 'antraste' => 'Pinigų priėmimo kvitas · #' . $o->get_order_number(), 'tekstas' => 'Klientas sumokėjo ' . self::eur( $o->get_total() ) . ' € grynais? Suformuojamas kvitas PPK (kitas numeris), „pinigus priėmė“ — ' . $cu->display_name . '. Kvitą atspausdink ir pasirašyk ranka; klientui el. paštu nesiunčiamas.', 'ok' => 'Suformuoti kvitą' ) ); }\n"
    "\t\t}\n"
    "\t\treturn $d;\n")
# JS skDok: mygtukas + „priėmė“
rep("$('skDokT').innerHTML=o.dok.map(function(x){ return '<div class=\"dl-dok\"><b>'+esc(x.nr)+'</b> · '+esc(x.z)+(x.d?' · '+esc(x.d):'')+' · '+esc(x.s)+' € · '+(x.u?'<a href=\"'+esc(x.u)+'\" target=\"_blank\">PDF</a>':(x.gen?'<a class=\"pilkas maz\" href=\"'+esc(x.gen)+'\">PDF nėra — sugeneruoti</a>':'<span class=\"pilkas maz\">PDF nėra</span>'))+'</div>'; }).join('');",
    "$('skDokT').innerHTML=o.dok.map(function(x){ if(x.btn){ return '<div class=\"dl-dok\">'+esc(x.z)+' · '+esc(x.s)+' € · <a class=\"v p maz\" href=\"'+esc(x.btn)+'\" data-d=\"'+esc(JSON.stringify(x.dlg||{}))+'\">'+esc(x.bt)+'</a></div>'; } return '<div class=\"dl-dok\"><b>'+esc(x.nr)+'</b> · '+esc(x.z)+(x.d?' · '+esc(x.d):'')+' · '+esc(x.s)+' € · '+(x.u?'<a href=\"'+esc(x.u)+'\" target=\"_blank\">PDF</a>':(x.gen?'<a class=\"pilkas maz\" href=\"'+esc(x.gen)+'\">PDF nėra — sugeneruoti</a>':'<span class=\"pilkas maz\">PDF nėra</span>'))+(x.kas?' <span class=\"pilkas maz\">priėmė '+esc(x.kas)+'</span>':'')+'</div>'; }).join(''); /* v3.34: PPK mygtukas / kvitas */")
# Sąskaitų langas: tipas „Kvitas“
rep("\t\t$t = isset( $_GET['t'] ) ? sanitize_key( $_GET['t'] ) : ''; if ( ! in_array( $t, array( 'avpn', 'iapv', 'kr' ), true ) ) { $t = ''; }",
    "\t\t$t = isset( $_GET['t'] ) ? sanitize_key( $_GET['t'] ) : ''; if ( ! in_array( $t, array( 'avpn', 'iapv', 'kr', 'ppk' ), true ) ) { $t = ''; } // v3.34: + ppk (kvitas)")
rep("\t\t\t$dt = 'avpn' === $tipas ? 'COALESCE(od.date_completed_gmt,od.date_paid_gmt,o.date_created_gmt)' : 'o.date_created_gmt'; // v3.27: HPOS datos — `wc_order_operational_data`",
    "\t\t\t$dt = 'avpn' === $tipas ? 'COALESCE(od.date_completed_gmt,od.date_paid_gmt,o.date_created_gmt)' : ( 'ppk' === $tipas ? 'COALESCE(od.date_paid_gmt,o.date_created_gmt)' : 'o.date_created_gmt' ); // v3.27: HPOS datos — `wc_order_operational_data`; v3.34: kvitas — apmokėjimo diena")
rep("if ( ! $t || 'kr' === $t ) { $dalys[] = $sel( 'kr', '_petshop_kravpn_number', '_petshop_kravpn_pdf', true ); }\n",
    "if ( ! $t || 'kr' === $t ) { $dalys[] = $sel( 'kr', '_petshop_kravpn_number', '_petshop_kravpn_pdf', true ); } if ( ! $t || 'ppk' === $t ) { $dalys[] = $sel( 'ppk', '_petshop_ppk_number', '_petshop_ppk_pdf', false ); } // v3.34\n")
rep("$n = count( $viso ); $suma = 0.0; foreach ( $viso as $r ) { $suma += (float) $r['s']; }",
    "$n = count( $viso ); $suma = 0.0; foreach ( $viso as $r ) { if ( 'ppk' === $r['t'] ) { continue; } $suma += (float) $r['s']; } // v3.34: kvitai (grynų priėmimas) į sąskaitų sumą neskaičiuojami")
rep("\t\t$tip = array( 'avpn' => 'PVM sąskaita', 'iapv' => 'Išankstinė', 'kr' => 'Kreditinė' ); $stat = wc_get_order_statuses();",
    "\t\t$tip = array( 'avpn' => 'PVM sąskaita', 'iapv' => 'Išankstinė', 'kr' => 'Kreditinė', 'ppk' => 'Kvitas' ); $stat = wc_get_order_statuses(); // v3.34: + Kvitas (PPK)")
rep("visos PVM sąskaitos, išankstinės ir kreditinės — PDF čia, WC lango nereikia · ",
    "visos PVM sąskaitos, išankstinės, kreditinės ir kvitai — PDF čia, WC lango nereikia · ")
rep("Suma — pagal filtrą (kreditinės minusu). Kreditinės data — išrašymo diena; PVM sąskaitos — įvykdymo (apmokėjimo) diena; išankstinės — užsakymo diena.",
    "Suma — pagal filtrą (kreditinės minusu; kvitai — pinigų priėmimas grynais — į sumą neskaičiuojami). Kreditinės data — išrašymo diena; PVM sąskaitos — įvykdymo (apmokėjimo) diena; išankstinės — užsakymo diena; kvito — apmokėjimo diena.")
# Naujas užsakymas: „Apmokėta vietoje“ → „Apmokėta grynais“
rep("<label><input type=\"radio\" name=\"mok\" value=\"vietoje\"> Apmokėta vietoje (grynais / kortele) — užsakymas iškart į darbą</label>",
    "<label><input type=\"radio\" name=\"mok\" value=\"grynais\"> Apmokėta grynais — užsakymas iškart į darbą; pinigų priėmimo kvitą (PPK) suformuok skydelio „Sąskaitos“ bloke, kai klientas sumoka</label>")
rep("tekstas:(mok==='vietoje'?'Užsakymas sukuriamas kaip APMOKĖTAS (vietoje) ir iškart eina į darbą: Gauti → rūšiavimas → Surinkti → lipdukas. Likučiai nurašomi, PVM sąskaita — įvykdžius, kaip visada.'",
    "tekstas:(mok==='grynais'?'Užsakymas sukuriamas kaip APMOKĖTAS (grynais) ir iškart eina į darbą: Gauti → rūšiavimas → Surinkti → lipdukas. Likučiai nurašomi, PVM sąskaita — įvykdžius, kaip visada. Kvitą (PPK) suformuok skydelyje, kai klientas sumoka.'")
rep("Apmokėjimas: `pavedimu` → bacs + on-hold (WC / temos srautas kaip kasoje: laiškas su išankstine); `vietoje` → „Apmokėta vietoje“ + processing (varikliai kaip po Paysera). */",
    "Apmokėjimas: `pavedimu` → bacs + on-hold (WC / temos srautas kaip kasoje: laiškas su išankstine; v3.34: WC likutis nurašomas tik apmokėjus — `telefonu_likutis`); `grynais` (v3.34, buvo `vietoje`) → „Apmokėta grynais“ (`cod`) + processing (varikliai kaip po Paysera); kvitas PPK — atskirai skydelyje. */")
rep("if ( ! in_array( $mok, array( 'pavedimu', 'vietoje' ), true ) ) { $klaida( 'nežinomas apmokėjimo būdas' ); }",
    "if ( ! in_array( $mok, array( 'pavedimu', 'grynais' ), true ) ) { $klaida( 'nežinomas apmokėjimo būdas' ); } // v3.34: `vietoje` → `grynais`")
rep("'vietoje' === $mok ? 'apmokėta vietoje' : 'pavedimu — laukiam' ), false, true );",
    "'grynais' === $mok ? 'apmokėta grynais (kvitas PPK — skydelyje, kai klientas moka)' : 'pavedimu — laukiam' ), false, true );")
rep("\t\t\tif ( 'vietoje' === $mok ) { $n->set_payment_method( 'cod' ); $n->set_payment_method_title( 'Apmokėta vietoje' ); $n->set_date_paid( time() ); $n->save(); $n->update_status( 'processing', 'Darbalaukis: apmokėta vietoje (' . $u->display_name . ').', true ); }",
    "\t\t\tif ( 'grynais' === $mok ) { $n->set_payment_method( 'cod' ); $n->set_payment_method_title( 'Apmokėta grynais' ); $n->set_date_paid( time() ); $n->save(); $n->update_status( 'processing', 'Darbalaukis: apmokėta grynais (' . $u->display_name . ').', true ); } // v3.34: „Apmokėta grynais“ (Raimis 09-06)")
rep("'pastaba' => 'telefoninis užsakymas ' . self::eur( $n->get_total() ) . ' € (' . ( 'vietoje' === $mok ? 'apmokėta vietoje' : 'pavedimu' ) . ')' ) ); }",
    "'pastaba' => 'telefoninis užsakymas ' . self::eur( $n->get_total() ) . ' € (' . ( 'grynais' === $mok ? 'apmokėta grynais' : 'pavedimu' ) . ')' ) ); }")
rep("( 'vietoje' === $mok ? ', apmokėta vietoje — eina į darbą' : ', laukiam pavedimo (' . self::PAKART_BANKAS",
    "( 'grynais' === $mok ? ', apmokėta grynais — eina į darbą; kvitą (PPK) suformuok skydelio „Sąskaitos“ bloke, kai klientas sumoka' : ', laukiam pavedimo (' . self::PAKART_BANKAS")
rep("'&eile=' . ( 'vietoje' === $mok ? 'siandien' : 'neapmoketi' ) . '&atidaryti=' . $id ) ) ); exit;",
    "'&eile=' . ( 'grynais' === $mok ? 'siandien' : 'neapmoketi' ) . '&atidaryti=' . $id ) ) ); exit;")
assert "'vietoje'" not in s.replace("'vietoje' => $vietoje", ""), 'liko vietoje raktų'
# funkcijos prieš v3.31 bloką
rep("\t/* ============================ v3.31: KREDITINĖS LAIŠKO ŠABLONAS (Raimis 09-05 #10: tekstas taisomas, siunčia TIK darbuotojas) ============",
    funcs.strip('\n') + "\n\n\t/* ============================ v3.31: KREDITINĖS LAIŠKO ŠABLONAS (Raimis 09-05 #10: tekstas taisomas, siunčia TIK darbuotojas) ============")
out = '/home/claude/ps/petshop-darbalaukis-v334.php'
open(out, 'w', encoding='utf-8').write(s)
r = subprocess.run(['php', '-l', out], capture_output=True, text=True)
print(r.stdout.strip(), r.stderr.strip())
if r.returncode != 0 or 'No syntax errors' not in r.stdout: print('LINT FAIL — STOP'); sys.exit(1)
print('bytes', len(s.encode('utf-8')), 'md5', hashlib.md5(s.encode('utf-8')).hexdigest())
