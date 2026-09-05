import sys
s=open('petshop-darbalaukis-v324.php',encoding='utf-8').read()
funcs=open('/home/claude/ps/v325/funcs.php',encoding='utf-8').read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a)
    if n!=cnt: print('FAIL',n,repr(a[:100])); sys.exit(1)
    s=s.replace(a,b)
# 1. antraštė + versija
rep(" * Petshop Darbalaukis v3.24 (S1617,"," * Petshop Darbalaukis v3.25 (S1617,")
rep("kortelėje „Apmokėta pavedimu“ — darbuotojas patvirtina gavęs pinigus; v3.24: pasirinkus pavedimą (`on-hold`) nuoroda toliau veikia — Paysera vis dar galima; po v3.20)",
    "kortelėje „Apmokėta pavedimu“ — darbuotojas patvirtina gavęs pinigus; v3.24: pasirinkus pavedimą (`on-hold`) nuoroda toliau veikia — Paysera vis dar galima; v3.25: KREDITINĖ pusiau automatinė (spec §12.5, Raimis K1–K3) — žr. žemiau; po v3.20)")
rep("\tconst VERSIJA = '3.24';","\tconst VERSIJA = '3.25';")
rep(" *   (`pakartotinis_moketini_statusai`): klientas, pasirinkęs pavedimą, vis dar gali apmokėti Paysera per tą pačią nuorodą, kol darbuotojas nepažymėjo „Apmokėta pavedimu“.\n",
    " *   (`pakartotinis_moketini_statusai`): klientas, pasirinkęs pavedimą, vis dar gali apmokėti Paysera per tą pačią nuorodą, kol darbuotojas nepažymėjo „Apmokėta pavedimu“.\n"
    " * v3.25 (S1617 — KREDITINĖ pusiau automatinė; Raimis 09-05: K1 sava KR-AVPN eilė (temos base.php v2.9 — 5 eil.), K2 A — 3,99 € atskira paslaugos sąskaita, K3 per WC grąžinimo\n"
    " *   įrašą, laiškas klientui tik darbuotojo ranka). Klausimų kortelėje „Grąžink klientui pinigus“ kiekvienas `_ps_grazinti_rankomis` įrašas gauna mygtuką „Kreditinė“ →\n"
    " *   juodraštis kortelėje (`kreditine_juodrastis`: refund>0 (#4 kiekiai) — eilutės iš WC grąžinimo įrašo, fiksuotos; visas atšaukimas — eilutės be `_ps_atsaukta`/`_ps_kreditine`\n"
    " *   + pristatymas (varnelė); dalis — eilutės su `_ps_atsaukta` be `_ps_kreditine`; kiekiai taisomi; varnelė „3,99 € — atskira sąskaita“ pagal `ka` „− 3,99“) → „Patvirtinti\n"
    " *   kreditinę“ (POST `ps_dl_kreditine`, nonce `ps_dl_kr_{id}`): `wc_create_refund` (`refund_payment=false`, `restock_items=false`, statusas nekinta — `kr_be_statuso`, laiškai off,\n"
    " *   `_restock_refunded_items` faktui, WC riba `get_remaining_refund_amount` — klaida su paaiškinimu), KR numeris iš `petshop_kravpn_counter` (KITAS, kaip AVPN; T-0 → 101) į refund\n"
    " *   meta `_petshop_kravpn_number/_date`, PDF per temos base.php (`$template='creditnote'`, `$order['id']`=refund; Dompdf kaip `petshop_generate_invoice_pdf`) → `uploads/wcdn/creditnote/`\n"
    " *   (`_petshop_kravpn_pdf`), 3,99 € — `grazinimo_mokestis_sukurti` (paslaugos prekė „Siuntos grąžinimo išlaidos“, `ps_grazinimo_preke`; svečio užsakymas su `_ps_pakartotinis` +\n"
    " *   `_ps_paslauga=grazinimo_islaidos`, „Įskaitymas iš grąžinamos sumos“, processing → `pakartotinis_apmoketas` šaka → completed, AVPN pati, be laiškų); įraše `kr{nr,refund,pdf,suma,\n"
    " *   laikas,kas,mokestis,mok_avpn,eil,laiskas}`, eilutėse `_ps_kreditine`=nr, įrašo `suma` = KR − 3,99 (jei mokestis); pastaba, įvykis `kreditine`. Kortelėje: „Kreditinė KR… (X €;\n"
    " *   3,99 € sąskaita AVPN…) · PDF (GET `kr_pdf`) · siųsti klientui (GET `kr_laiskas` — laiškas su PDF, `kreditine_laiskas`)“. „Grąžinta“ dialogas įspėja, jei kreditinė neišrašyta.\n")
# 2. konstantos + static
rep("\tconst PAKART_BANKAS = 'UAB Avesa · AB Swedbank · LT127300010124940593'; // v3.23: pavedimo rekvizitai (kaip temos functions.php / IAPV — Claude prielaida: tie patys)\n",
    "\tconst PAKART_BANKAS = 'UAB Avesa · AB Swedbank · LT127300010124940593'; // v3.23: pavedimo rekvizitai (kaip temos functions.php / IAPV — Claude prielaida: tie patys)\n"
    "\tconst KR_COUNTER_OPT = 'petshop_kravpn_counter';     // v3.25: kreditinių KR-AVPN sava eilė — KITAS numeris (kaip `petshop_avpn_counter`; T-0 → 101)\n"
    "\tconst GRAZ_PREKE_OPT = 'ps_grazinimo_preke';         // v3.25: paslaugos prekė „Siuntos grąžinimo išlaidos“ (3,99 su PVM, K2 A)\n"
    "\tprotected static $kr_kuriama = false;               // v3.25: kol darbalaukis kuria kreditinės refund'ą — WC statuso į „refunded“ nekeičia\n")
# 3. init kabliai
rep("\t\tadd_filter( 'woocommerce_valid_order_statuses_for_payment', array( __CLASS__, 'pakartotinis_moketini_statusai' ), 20, 2 ); // v3.24\n",
    "\t\tadd_filter( 'woocommerce_valid_order_statuses_for_payment', array( __CLASS__, 'pakartotinis_moketini_statusai' ), 20, 2 ); // v3.24\n"
    "\t\tadd_action( 'admin_post_ps_dl_kreditine', array( __CLASS__, 'kreditine_vykdyti' ) ); // v3.25\n"
    "\t\tadd_filter( 'woocommerce_order_fully_refunded_status', array( __CLASS__, 'kr_be_statuso' ), 20, 3 ); // v3.25\n")
# 4. dispatcher
rep("\t\t\telseif ( 'pakart_apmoketa' === $v ) { $rez = self::pakartotinis_pavedimas( $o, $u ); } // v3.23\n",
    "\t\t\telseif ( 'pakart_apmoketa' === $v ) { $rez = self::pakartotinis_pavedimas( $o, $u ); } // v3.23\n"
    "\t\t\telseif ( 'kr_laiskas' === $v ) { $rez = self::kreditine_laiskas( $o, $u, absint( $_GET['e'] ?? 0 ) ); } // v3.25\n")
rep("\t\t$u = wp_get_current_user();\n\t\t$rez = array( 'dl_klaida', 'nežinomas veiksmas' );\n",
    "\t\t$u = wp_get_current_user();\n\t\tif ( 'kr_pdf' === $v ) { self::kreditine_faila( $o, absint( $_GET['e'] ?? 0 ) ); exit; } // v3.25: PDF srautas, be užrakto\n\t\t$rez = array( 'dl_klaida', 'nežinomas veiksmas' );\n")
# 5. pakartotinis_apmoketas šaka (mokesčio užsakymas)
rep("\t\t$el = $n->get_billing_email(); list( $tema, $h ) = self::pakartotinis_laiskas_apmoketa( $n, $o );\n",
    "\t\tif ( 'grazinimo_islaidos' === (string) $n->get_meta( '_ps_paslauga' ) ) { // v3.25: 3,99 € siuntos grąžinimo išlaidų sąskaita (įskaitymas) — be laiško, pradinio pastaba rašo `kreditine_vykdyti`\n"
    "\t\t\t$n->add_order_note( 'Darbalaukis: PVM sąskaita ' . ( $n->get_meta( '_petshop_avpn_number' ) ? $n->get_meta( '_petshop_avpn_number' ) : '(AVPN NEIŠRAŠYTA)' ) . ' už siuntos grąžinimo išlaidas išrašyta — įskaitymas iš grąžinamos sumos. Laiškas klientui: NESIŲSTAS (siunčia darbuotojas su kreditine).', false, true ); $n->save();\n"
    "\t\t\treturn;\n\t\t}\n"
    "\t\t$el = $n->get_billing_email(); list( $tema, $h ) = self::pakartotinis_laiskas_apmoketa( $n, $o );\n")
# 6. kortelė „Grąžink klientui“
old_card_start="\t\t\t} elseif ( 0 === strpos( $kl, 'Grąžink klientui' ) ) {\n"
i=s.index(old_card_start); j=s.index("\t\t\t} elseif ( 0 === strpos( $kl, 'Klientas atsisako' ) ) {\n")
new_card=old_card_start+"""\t\t\t\t// v3.19 (5 etapas #4): kiekis sumažintas / prekė išimta — pinigus grąžina darbuotojas rankomis; „Grąžinta“ nuima žymę. Galioja ir įvykdytam / atšauktam.
\t\t\t\t// v3.25: kreditinė — kiekvienam įrašui juodraštis kortelėje → „Patvirtinti kreditinę“; PDF; „siųsti klientui“ — darbuotojas (Raimis K3).
\t\t\t\t$g = (array) ( $r['grazinti'] ?? array() ); $viso = 0.0; foreach ( $g as $x ) { $viso += (float) ( $x['suma'] ?? 0 ); }
\t\t\t\t$antr = sprintf( 'Užsakymas #%s · %s', $o->get_order_number(), $sk['suma'] );
\t\t\t\tlist( $kr_eil, $kr_formos, $be_kr ) = self::kreditine_kortele( $o, $id, $g, $antr );
\t\t\t\t$tekstas = 'Grąžink klientui ' . self::eur( $viso ) . ' € rankomis (Paysera / pavedimu).';
\t\t\t\t$sumos_html = '<p class="dl-sumos dl-kr-l">' . implode( '<br>', $kr_eil ) . '</p>';
\t\t\t\t$pastaba = 'Pinigų sistema negrąžina. Eiga: „Kreditinė“ — peržiūrėk, pataisyk, patvirtink (PDF čia; klientui — „siųsti klientui“); grąžink per Paysera arba pavedimu; spausk „Grąžinta“ — Klausimas nusiims.';
\t\t\t\t$veiksmai = '<a class="v p" href="' . esc_url( self::dl_url( 'grazinta', $id ) ) . '" data-d="' . esc_attr( wp_json_encode( array( 'antraste' => $antr, 'tekstas' => 'Pinigai (' . self::eur( $viso ) . ' €) klientui jau grąžinti? Klausimas nusiims; sistema pinigų nejudina.' . ( $be_kr ? ' DĖMESIO: ' . $be_kr . ' įrašui(-ams) kreditinė NEIŠRAŠYTA — po „Grąžinta“ čia jos nebeišrašysi.' : '' ), 'ok' => 'Grąžinta' ) ) ) . '">Grąžinta</a> <button class="v t" data-atidaryti="1">Atidaryti</button> ' . $rasyti . ' ' . $atsaukti; $papild = $kr_formos;
"""
s=s[:i]+new_card+s[j:]
# 7. grazinta() pastaba
rep("\t\t$o->add_order_note( sprintf( 'Darbalaukis: pinigai klientui grąžinti rankomis — %s € (%s). Sąskaita / kreditinė — rankomis.', number_format( $viso, 2, ',', '' ), $u->display_name ), false, true ); $o->save();\n",
    "\t\t$krs = array(); foreach ( $g as $x ) { if ( ! empty( $x['kr']['nr'] ) ) { $krs[] = $x['kr']['nr']; } }\n\t\t$o->add_order_note( sprintf( 'Darbalaukis: pinigai klientui grąžinti rankomis — %s € (%s). Kreditinės: %s.', number_format( $viso, 2, ',', '' ), $u->display_name, $krs ? implode( ', ', $krs ) : 'NEIŠRAŠYTOS' ), false, true ); $o->save();\n")
# 8. naujos funkcijos prieš „Siųsti iš naujo“ komentarą
rep("\t/** „Siųsti iš naujo“ — TIK grįžusią dalį (log S1611 spr. 5", funcs+"\t/** „Siųsti iš naujo“ — TIK grįžusią dalį (log S1611 spr. 5")
# 9. JS: click handler šakos po .dl-pk-n; krSum + input listener po dlgForm; eilutės click išimtis
rep("\t\tvar n=e.target.closest('.dl-pk-n'); if(n){ e.preventDefault(); e.stopPropagation(); var f3=n.closest('.dl-pk-f'); f3.querySelector('[name=ka]').value='nemokamai'; dlgForm({antraste:'Siųsti iš naujo be mokesčio',tekstas:'Tik kai nepristatyta dėl mūsų ar vežėjo kaltės: klientui nieko nemokėti, laiškas nesiunčiamas, čia atsiras „Siųsti iš naujo“.',ok:'Be mokesčio'},f3); return; }\n",
    "\t\tvar n=e.target.closest('.dl-pk-n'); if(n){ e.preventDefault(); e.stopPropagation(); var f3=n.closest('.dl-pk-f'); f3.querySelector('[name=ka]').value='nemokamai'; dlgForm({antraste:'Siųsti iš naujo be mokesčio',tekstas:'Tik kai nepristatyta dėl mūsų ar vežėjo kaltės: klientui nieko nemokėti, laiškas nesiunčiamas, čia atsiras „Siųsti iš naujo“.',ok:'Be mokesčio'},f3); return; }\n"
    "\t\tvar kb=e.target.closest('.dl-kr-b'); if(kb){ e.preventDefault(); e.stopPropagation(); var kk=kb.closest('.dl-kortele'), kf=kk&&kk.querySelector('.dl-kr-f[data-e=\"'+kb.getAttribute('data-e')+'\"]'); if(!kf) return; kk.querySelectorAll('.dl-kr-f').forEach(function(x){ x.style.display='none'; }); kf.style.display='block'; krSum(kf); return; }\n"
    "\t\tvar kx=e.target.closest('.dl-kr-x'); if(kx){ e.preventDefault(); e.stopPropagation(); var kfx=kx.closest('.dl-kr-f'); if(kfx) kfx.style.display='none'; return; }\n"
    "\t\tvar ks=e.target.closest('.dl-kr-s'); if(ks){ e.preventDefault(); e.stopPropagation(); var kfs=ks.closest('.dl-kr-f'); krSum(kfs); var kv=kfs.querySelector('.dl-kr-viso').textContent; if(!(parseFloat(kv.replace(',','.'))>0)){ return; } dlgForm({antraste:'Kreditinė sąskaita · '+kv+' €',tekstas:kfs.getAttribute('data-dlg')||'',ok:'Patvirtinti kreditinę'},kfs); return; }\n")
rep("\t\tif(e.target.closest('a,button,input,select,label,.dl-pk-f')) return;\n","\t\tif(e.target.closest('a,button,input,select,label,.dl-pk-f,.dl-kr-f')) return;\n")
rep("\tfunction dlgForm(d,f){","\tfunction krSum(f){ var s=0; f.querySelectorAll('tr[data-vnt]').forEach(function(tr){ var q=tr.querySelector('input[type=number]'); var n=q?parseInt(q.value||'0',10):parseInt(tr.getAttribute('data-q')||'0',10); if(q){ var mx=parseInt(q.max,10); if(isNaN(n)||n<0) n=0; if(n>mx) n=mx; q.value=n; } var v=parseFloat(tr.getAttribute('data-vnt'))*n; var sp=tr.querySelector('.dl-kr-suma'); if(sp) sp.textContent=v.toFixed(2).replace('.',','); s+=v; }); var p=f.querySelector('[name=pristatymas]'); if(p&&p.checked) s+=parseFloat(p.getAttribute('data-suma')||'0'); var vs=f.querySelector('.dl-kr-viso'); if(vs) vs.textContent=s.toFixed(2).replace('.',','); var m=f.querySelector('[name=mokestis]'), g=f.querySelector('.dl-kr-graz'); if(g) g.textContent=Math.max(0,s-(m&&m.checked?3.99:0)).toFixed(2).replace('.',','); }\n\tdocument.addEventListener('input',function(e){ var f=e.target&&e.target.closest?e.target.closest('.dl-kr-f'):null; if(f) krSum(f); });\n\tfunction dlgForm(d,f){")
# 10. CSS
rep(".dl-kortele .dl-pk{color:var(--rasalas)}",
    ".dl-kortele .dl-pk{color:var(--rasalas)}.dl-kortele .dl-kr-l{color:var(--rasalas);line-height:1.7}.dl-kr-l .dl-kr-b{margin-left:4px;padding:1px 8px;font-size:12px}.dl-kr-f{margin:8px 0 2px;font-size:13px;background:var(--popierius);border:1px solid var(--linija);border-radius:8px;padding:8px 12px;max-width:760px}.dl-kr-f .dl-kr-a{font-weight:600;margin-bottom:4px}.dl-kr-f table{border-collapse:collapse;margin:2px 0 6px}.dl-kr-f td{padding:3px 10px 3px 0;vertical-align:middle;border-bottom:1px solid var(--linija)}.dl-kr-f tr.viso td{border-bottom:0}.dl-kr-f td.c{text-align:center;white-space:nowrap}.dl-kr-f td.r{text-align:right;white-space:nowrap}.dl-kr-f input[type=number]{width:58px;font:inherit;font-size:13px;color:var(--rasalas);border:1px solid var(--linija);border-radius:5px;padding:3px 6px}.dl-kr-f .dl-kr-m{margin:4px 0 8px;color:var(--pilka)}.dl-kr-f .dl-kr-m label{display:inline-flex;gap:6px;align-items:flex-start}.dl-kr-f .dl-kr-v{display:flex;gap:10px;align-items:center}")
open('petshop-darbalaukis-v325.php','w',encoding='utf-8').write(s)
print('ok',len(s.encode()))
