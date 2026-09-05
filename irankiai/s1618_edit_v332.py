import sys, subprocess, hashlib
s = open('/home/claude/ps/dl.php', encoding='utf-8').read()
assert hashlib.md5(s.encode('utf-8')).hexdigest() == 'cc5b9d53208b590e15022ee13b06d6a6', 'baseline md5 ne v3.31'
funcs = open('/home/claude/ps/v332_funcs.php', encoding='utf-8').read()
def rep(a, b, cnt=1):
    global s
    n = s.count(a)
    if n != cnt: print('FAIL', n, repr(a[:100])); sys.exit(1)
    s = s.replace(a, b)
# 1. antraštė + versija
rep(" * Petshop Darbalaukis v3.31 (S1617,", " * Petshop Darbalaukis v3.32 (S1617/S1618,")
rep("v3.31 (Raimis #10): kreditinės laiško ŠABLONAS taisomas Sąskaitų lange (opcija `ps_dl_kr_laiskas`, vietaženkliai), siunčia tik darbuotojas); po v3.20)",
    "v3.31 (Raimis #10): kreditinės laiško ŠABLONAS taisomas Sąskaitų lange (opcija `ps_dl_kr_laiskas`, vietaženkliai), siunčia tik darbuotojas; v3.32 (S1618, Raimis 09-05 A): GRĄŽINIMAS ne dėl grįžusios siuntos — mygtukas „Grąžinimas“ Klausimo „Klientas atsisako“ kortelėje ir įvykdyto skydelyje → forma (prekės/kiekiai, priežastis atsisakymas / brokas / mūsų klaida, pristatymas — atsisakymas tik visam, varnelė „tinkama prekybai“ → AV likutis) → POST `ps_dl_grazinimas` (`grazinimas_vykdyti`): WC grąžinimo įrašas be pinigų + kreditinė KR-AVPN tuo pačiu `kreditine_*` mechanizmu, 3,99 € niekada, eilutėse `_ps_grazinta_q`, įrašas `_ps_grazinti_rankomis` su `kr` → Klausimas „Grąžink klientui pinigus“ (PDF · siųsti klientui · Grąžinta); laiško klientui nėra); po v3.20)")
rep("\tconst VERSIJA = '3.31';", "\tconst VERSIJA = '3.32';")
# 2. konstanta
rep("\tconst GRAZ_PREKE_OPT = 'ps_grazinimo_preke';         // v3.25: paslaugos prekė „Siuntos grąžinimo išlaidos“ (3,99 su PVM, K2 A)\n",
    "\tconst GRAZ_PREKE_OPT = 'ps_grazinimo_preke';         // v3.25: paslaugos prekė „Siuntos grąžinimo išlaidos“ (3,99 su PVM, K2 A)\n"
    "\tconst GRAZINTA_Q_META = '_ps_grazinta_q';            // v3.32: eilutėje — kiek vnt. jau grąžinta per „Grąžinimas“ (dalinis); pilnai grąžinta eilutė gauna `_ps_kreditine`\n")
# 3. kablys
rep("\t\tadd_action( 'admin_post_ps_dl_kr_sablonas', array( __CLASS__, 'kr_sablonas_vykdyti' ) ); // v3.31\n",
    "\t\tadd_action( 'admin_post_ps_dl_kr_sablonas', array( __CLASS__, 'kr_sablonas_vykdyti' ) ); // v3.31\n"
    "\t\tadd_action( 'admin_post_ps_dl_grazinimas', array( __CLASS__, 'grazinimas_vykdyti' ) ); // v3.32 (A)\n")
# 4. skydelis: forma įvykdytam / „Klientas atsisako“
rep("\t\t\t'klientas_url' => $o->get_checkout_order_received_url(), // v3.30: „Kaip mato klientas“ — kliento užsakymo puslapis (svečio nuoroda su raktu)\n",
    "\t\t\t'klientas_url' => $o->get_checkout_order_received_url(), // v3.30: „Kaip mato klientas“ — kliento užsakymo puslapis (svečio nuoroda su raktu)\n"
    "\t\t\t'graz' => ( $f['paid'] && ( 'completed' === $f['st'] || 0 === strpos( (string) $f['kl'], 'Klientas atsisako' ) ) ) ? self::grazinimo_forma( $o, $id, $g, true ) : '', // v3.32 (A): „Grąžinimas“ — įvykdytam / klientui atsisakant\n")
# 5. Klausimo „Klientas atsisako“ kortelė
rep("\t\t\t} elseif ( 0 === strpos( $kl, 'Klientas atsisako' ) ) {\n"
    "\t\t\t\t$pastaba = 'Klientas pateikė sutarties atsisakymą (14 d.). Atšauk užsakymą; pinigų grąžinimą ir kreditinę tvarkysi atskirai.';\n"
    "\t\t\t\t$veiksmai = $atsaukti . ' ' . $rasyti;\n",
    "\t\t\t} elseif ( 0 === strpos( $kl, 'Klientas atsisako' ) ) {\n"
    "\t\t\t\t// v3.32 (Raimis 09-05 A): „Grąžinimas“ — klientas grąžina prekes: forma kortelėje → kreditinė; jei prekės dar neišsiųstos — „Atšaukti“. Ankstesni grąžinimo įrašai (su KR) rodomi čia pat.\n"
    "\t\t\t\t$antr = sprintf( 'Užsakymas #%s · %s', $o->get_order_number(), $sk['suma'] ); $gr_forma = $sk['apmok'] && 0 === strpos( $sk['apmok'], 'apmokėta' ) ? self::grazinimo_forma( $o, $id, self::url( array( 'eile' => 'klausimai', 'view' => null, 'q' => null, 'b' => null, 'atidaryti' => null ) ) ) : '';\n"
    "\t\t\t\t$g = (array) ( $r['grazinti'] ?? array() ); if ( $g ) { list( $kr_eil, $kr_formos, $be_kr ) = self::kreditine_kortele( $o, $id, $g, $antr ); $sumos_html = '<p class=\"dl-sumos dl-kr-l\">' . implode( '<br>', $kr_eil ) . '</p>'; $gr_forma .= $kr_formos; }\n"
    "\t\t\t\t$pastaba = 'Klientas pateikė sutarties atsisakymą (14 d.). Prekės dar pas mus — „Atšaukti“. Klientas prekes grąžina — „Grąžinimas“: pažymėk prekes, kiekius, priežastį; kreditinė išsirašo, likutis grįžta (jei tinkama prekybai), pinigus grąžinsi rankomis (Klausimas „Grąžink klientui pinigus“ primins).';\n"
    "\t\t\t\t$veiksmai = ( $gr_forma ? '<button type=\"button\" class=\"v p dl-gr-b\">Grąžinimas</button> ' : '' ) . ( $g ? '<a class=\"v t\" href=\"' . esc_url( self::dl_url( 'grazinta', $id ) ) . '\" data-d=\"' . esc_attr( wp_json_encode( array( 'antraste' => $antr, 'tekstas' => 'Pinigai klientui jau grąžinti? Grąžinimo įrašai nusiims; sistema pinigų nejudina.', 'ok' => 'Grąžinta' ) ) ) . '\">Grąžinta</a> ' : '' ) . $atsaukti . ' ' . $rasyti; $papild = $gr_forma;\n")
# 6. funkcijos prieš v3.31 bloką
rep("\t/* ============================ v3.31: KREDITINĖS LAIŠKO ŠABLONAS (Raimis 09-05 #10: tekstas taisomas, siunčia TIK darbuotojas) ============",
    funcs.strip('\n') + "\n\n\t/* ============================ v3.31: KREDITINĖS LAIŠKO ŠABLONAS (Raimis 09-05 #10: tekstas taisomas, siunčia TIK darbuotojas) ============")
# 7. CSS
rep(".dl-kk-f input[type=number]{width:58px;font:inherit;font-size:13px;color:var(--rasalas);border:1px solid var(--linija);border-radius:5px;padding:4px 6px;background:var(--popierius)}\n",
    ".dl-kk-f input[type=number]{width:58px;font:inherit;font-size:13px;color:var(--rasalas);border:1px solid var(--linija);border-radius:5px;padding:4px 6px;background:var(--popierius)}\n"
    ".dl-gr-f select{font:inherit;font-size:13px;color:var(--rasalas);border:1px solid var(--linija);border-radius:5px;padding:3px 6px;background:var(--popierius)}.dl-gr-f .dl-kr-m label{align-items:center}#skPr .dl-gr-f{max-width:none;margin:0}.dl-veiksmai .dl-gr-b{margin-right:4px}\n")
# 8. JS: grSync + kortelės/skydelio mygtukai
rep("\t});\n\t/* --- skydas --- */\n",
    "\t});\n"
    "\t/* --- v3.32 (A): grąžinimas — priežastis ↔ „tinkama prekybai“, pristatymas tik visam (atsisakymas), forma kortelėje / skydelyje --- */\n"
    "\tfunction grSync(f){ var pz=f.querySelector('.dl-gr-pz'), pr=f.querySelector('.dl-gr-pr'); var visas=true; f.querySelectorAll('tr[data-vnt] input[type=number]').forEach(function(q){ if(parseInt(q.value||'0',10)!==parseInt(q.max,10)) visas=false; }); if(pr){ var ats=pz&&pz.value==='atsisakymas'; if(ats&&!visas){ pr.checked=false; pr.disabled=true; } else { pr.disabled=false; } var pt=f.querySelector('.dl-gr-prt'); if(pt) pt.style.display=(ats&&!visas)?'':'none'; } krSum(f); }\n"
    "\tdocument.addEventListener('change',function(e){ var pz=e.target&&e.target.classList&&e.target.classList.contains('dl-gr-pz')?e.target:null; if(pz){ var f=pz.closest('.dl-gr-f'), tk=f&&f.querySelector('.dl-gr-tk'); if(tk) tk.checked=(pz.value!=='brokas'); if(f) grSync(f); return; } var f2=e.target&&e.target.closest?e.target.closest('.dl-gr-f'):null; if(f2) grSync(f2); });\n"
    "\tdocument.addEventListener('input',function(e){ var f=e.target&&e.target.closest?e.target.closest('.dl-gr-f'):null; if(f) grSync(f); });\n"
    "\tdocument.addEventListener('click',function(e){\n"
    "\t\tvar b=e.target.closest('.dl-gr-b'); if(b){ e.preventDefault(); e.stopPropagation(); var k=b.closest('.dl-kortele'), f=k&&k.querySelector('.dl-gr-f'); if(!f) return; k.querySelectorAll('.dl-kr-f').forEach(function(x){ x.style.display='none'; }); f.style.display='block'; grSync(f); return; }\n"
    "\t\tvar x=e.target.closest('.dl-gr-x'); if(x){ e.preventDefault(); e.stopPropagation(); var fx=x.closest('.dl-gr-f'); if(!fx) return; if(fx.classList.contains('dl-gr-sk')&&skO){ $('skPr').innerHTML=prist(skO); } else { fx.style.display='none'; } return; }\n"
    "\t});\n"
    "\t/* --- skydas --- */\n")
rep("(o.klientas_url?'<a class=\"v t\" target=\"_blank\" rel=\"noopener\" href=\"'+esc(o.klientas_url)+'\" title=\"Kliento užsakymo puslapis — kaip jį mato klientas (siuntos, sąskaita)\">Kaip mato klientas</a>':'')",
    "(o.klientas_url?'<a class=\"v t\" target=\"_blank\" rel=\"noopener\" href=\"'+esc(o.klientas_url)+'\" title=\"Kliento užsakymo puslapis — kaip jį mato klientas (siuntos, sąskaita)\">Kaip mato klientas</a>':'')+(o.graz?'<button class=\"v t\" id=\"skGraz\" title=\"Klientas grąžina prekes — kreditinė, likutis\">Grąžinimas</button>':'')")
rep("\t\tvar rb=$('skRed'); if(rb){ rb.onclick=function(){ redaguoti(o); }; }",
    "\t\tvar gb=$('skGraz'); if(gb){ gb.onclick=function(){ $('skPr').innerHTML=o.graz; var gf=$('skPr').querySelector('.dl-gr-f'); if(gf) grSync(gf); }; } // v3.32\n"
    "\t\tvar rb=$('skRed'); if(rb){ rb.onclick=function(){ redaguoti(o); }; }")
out = '/home/claude/ps/petshop-darbalaukis-v332.php'
open(out, 'w', encoding='utf-8').write(s)
r = subprocess.run(['php', '-l', out], capture_output=True, text=True)
print(r.stdout.strip(), r.stderr.strip())
if r.returncode != 0 or 'No syntax errors' not in r.stdout: print('LINT FAIL — STOP'); sys.exit(1)
print('bytes', len(s.encode('utf-8')), 'md5', hashlib.md5(s.encode('utf-8')).hexdigest())
