import sys
s=open('petshop-darbalaukis-v325.php',encoding='utf-8').read()
funcs=open('/home/claude/ps/v326/funcs.php',encoding='utf-8').read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a)
    if n!=cnt: print('FAIL',n,repr(a[:100])); sys.exit(1)
    s=s.replace(a,b)
rep(" * Petshop Darbalaukis v3.25 (S1617,"," * Petshop Darbalaukis v3.26 (S1617,")
rep("v3.25: KREDITINĖ pusiau automatinė (spec §12.5, Raimis K1–K3) — žr. žemiau; po v3.20)","v3.25: KREDITINĖ pusiau automatinė (spec §12.5, Raimis K1–K3) — žr. žemiau; v3.26: SĄSKAITOS — skydelio blokas „Sąskaitos“ + langas `view=saskaitos` (visi dokumentai, filtrai, PDF); po v3.20)")
rep("\tconst VERSIJA = '3.25';","\tconst VERSIJA = '3.26';")
rep(" *   3,99 € sąskaita AVPN…) · PDF (GET `kr_pdf`) · siųsti klientui (GET `kr_laiskas` — laiškas su PDF, `kreditine_laiskas`)“. „Grąžinta“ dialogas įspėja, jei kreditinė neišrašyta.\n",
    " *   3,99 € sąskaita AVPN…) · PDF (GET `kr_pdf`) · siųsti klientui (GET `kr_laiskas` — laiškas su PDF, `kreditine_laiskas`)“. „Grąžinta“ dialogas įspėja, jei kreditinė neišrašyta.\n"
    " * v3.26 (S1617 — SĄSKAITOS, spec §12.5 „Sąskaita“): (1) skydelyje blokas „Sąskaitos“ (`dokumentai()`: IAPV, AVPN, kreditinės, susietų paslaugų užsakymų AVPN — nr, data, suma, PDF\n"
    " *   per GET `dok_pdf&t=avpn|iapv|kr` (srautas prieš užrakto), AVPN be failo — „sugeneruoti“ (GET `dok_gen` → temos `petshop_generate_invoice_pdf`, tik apmokėtam)); pilkas „Sąskaita“\n"
    " *   mygtukas nuimtas (bloką pakeitė — „mažiau, ne daugiau“; Claude prielaida); (2) langas `view=saskaitos` (`saskaitos()`): visi dokumentai iš meta per HPOS SQL UNION (AVPN `_petshop_avpn_number`\n"
    " *   + `_petshop_completed_pdf`, data — įvykdymo/apmokėjimo; IAPV `_petshop_iapv_number` + `_petshop_order_pdf`, data — užsakymo; KR refund meta `_petshop_kravpn_*`, data — refund\n"
    " *   sukūrimo), filtrai — tipas / nuo–iki / paieška (nr., užsakymas, klientas, el. paštas), 200 psl., suma pagal filtrą (kreditinės minusu), PDF čia; nuoroda „Sąskaitos“ juostoje\n"
    " *   (petshop-juosta v1.7, tik `manage_woocommerce` — darbuotojui nieko nepridėta). Pragma eksportas — atskirai (variklis, klausti).\n")
# skydelis() data
rep("\t\t\t'nesurinkta' => ( ! empty( $f['dalys']['av']['lapas'] ) && empty( $f['dalys']['av']['siunta'] ) && ! $f['uzdarytas'] ) ? self::dl_url( 'nesurinkta', $id ) : '',\n",
    "\t\t\t'nesurinkta' => ( ! empty( $f['dalys']['av']['lapas'] ) && empty( $f['dalys']['av']['siunta'] ) && ! $f['uzdarytas'] ) ? self::dl_url( 'nesurinkta', $id ) : '',\n\t\t\t'dok' => self::dokumentai( $o ), // v3.26\n")
# vykdyti: dok_pdf before lock, dok_gen in dispatcher
rep("\t\tif ( 'kr_pdf' === $v ) { self::kreditine_faila( $o, absint( $_GET['e'] ?? 0 ) ); exit; } // v3.25: PDF srautas, be užrakto\n",
    "\t\tif ( 'kr_pdf' === $v ) { self::kreditine_faila( $o, absint( $_GET['e'] ?? 0 ) ); exit; } // v3.25: PDF srautas, be užrakto\n\t\tif ( 'dok_pdf' === $v ) { self::dok_faila( $o, sanitize_key( $_GET['t'] ?? '' ) ); exit; } // v3.26\n")
rep("\t\t\telseif ( 'kr_laiskas' === $v ) { $rez = self::kreditine_laiskas( $o, $u, absint( $_GET['e'] ?? 0 ) ); } // v3.25\n",
    "\t\t\telseif ( 'kr_laiskas' === $v ) { $rez = self::kreditine_laiskas( $o, $u, absint( $_GET['e'] ?? 0 ) ); } // v3.25\n\t\t\telseif ( 'dok_gen' === $v ) { $rez = self::dok_gen( $o, $u ); } // v3.26\n")
# puslapis: saskaitos langas
rep("\t\tif ( self::rytas_langas() ) { self::stilius();",
    "\t\tif ( self::saskaitu_langas() ) { self::stilius(); echo '<div class=\"dl\" id=\"dl\" data-eile=\"saskaitos\" data-atid=\"0\" data-n=\"' . esc_attr( wp_create_nonce( 'ps_dl_zurnalas' ) ) . '\">'; self::pranesimas(); self::saskaitos(); self::skydelio_html(); self::dialogas(); self::skriptas(); echo '</div>'; return; } // v3.26\n\t\tif ( self::rytas_langas() ) { self::stilius();")
# panel HTML block
rep("\t\t\t\t<div class=\"blokas\" id=\"skSiunta\" style=\"display:none\"><b>AV siunta</b><div id=\"skSiuntaT\"></div></div>\n",
    "\t\t\t\t<div class=\"blokas\" id=\"skSiunta\" style=\"display:none\"><b>AV siunta</b><div id=\"skSiuntaT\"></div></div>\n\t\t\t\t<div class=\"blokas\" id=\"skDok\" style=\"display:none\"><b>Sąskaitos</b><div id=\"skDokT\"></div></div>\n")
# JS render block + remove disabled button
rep("\t\tvar P=$('skPast'); if(o.pastaba_kl){ P.style.display='block'; $('skPastT').textContent=o.pastaba_kl; } else P.style.display='none';\n",
    "\t\tvar P=$('skPast'); if(o.pastaba_kl){ P.style.display='block'; $('skPastT').textContent=o.pastaba_kl; } else P.style.display='none';\n\t\tvar D=$('skDok'); if(o.dok&&o.dok.length){ D.style.display='block'; $('skDokT').innerHTML=o.dok.map(function(x){ return '<div class=\"dl-dok\"><b>'+esc(x.nr)+'</b> · '+esc(x.z)+(x.d?' · '+esc(x.d):'')+' · '+esc(x.s)+' € · '+(x.u?'<a href=\"'+esc(x.u)+'\" target=\"_blank\">PDF</a>':(x.gen?'<a class=\"pilkas maz\" href=\"'+esc(x.gen)+'\">PDF nėra — sugeneruoti</a>':'<span class=\"pilkas maz\">PDF nėra</span>'))+'</div>'; }).join(''); } else D.style.display='none';\n")
rep("+'<button class=\"v t\" disabled title=\"dar nepadaryta\">Sąskaita</button>'","")
# CSS
rep(".dl-kortele .dl-kr-l{color:var(--rasalas);line-height:1.7}",
    ".dl-kortele .dl-kr-l{color:var(--rasalas);line-height:1.7}.dl-dok{font-size:13px;padding:3px 0;border-bottom:1px solid var(--linija)}.dl-dok:last-child{border-bottom:0}.dl-sask-f{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:0 0 12px;font-size:13px}.dl-sask-f label{display:inline-flex;gap:6px;align-items:center;color:var(--pilka)}.dl-sask-f select,.dl-sask-f input{font:inherit;font-size:13px;color:var(--rasalas);border:1px solid var(--linija);border-radius:6px;padding:5px 8px;background:var(--popierius)}.dl-sask-f input[type=search]{width:280px}.dl-sask{border-collapse:collapse;width:100%;max-width:1100px;background:var(--popierius);border:1px solid var(--linija);border-radius:8px;font-size:13px}.dl-sask th,.dl-sask td{padding:7px 10px;text-align:left;border-bottom:1px solid var(--linija);vertical-align:top}.dl-sask th{font-weight:600;color:var(--pilka);font-size:12px}.dl-sask .r{text-align:right;white-space:nowrap}.dl-sask tfoot td{border-bottom:0;font-weight:500}")
# functions
rep("\t/** „Siųsti iš naujo“ — TIK grįžusią dalį (log S1611 spr. 5", funcs+"\t/** „Siųsti iš naujo“ — TIK grįžusią dalį (log S1611 spr. 5")
open('petshop-darbalaukis-v326.php','w',encoding='utf-8').write(s); print('ok',len(s.encode()))
