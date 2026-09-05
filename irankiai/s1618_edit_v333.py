import sys, subprocess, hashlib
s = open('/home/claude/ps/petshop-darbalaukis-v332.php', encoding='utf-8').read()
assert hashlib.md5(s.encode('utf-8')).hexdigest() == '3c126a8cabc21cb2faa393892e723803', 'baseline md5 ne v3.32'
funcs = open('/home/claude/ps/v333_funcs.php', encoding='utf-8').read()
def rep(a, b, cnt=1):
    global s
    n = s.count(a)
    if n != cnt: print('FAIL', n, repr(a[:100])); sys.exit(1)
    s = s.replace(a, b)
rep(" * Petshop Darbalaukis v3.32 (S1617/S1618,", " * Petshop Darbalaukis v3.33.2 (S1617/S1618,")
rep("→ Klausimas „Grąžink klientui pinigus“ (PDF · siųsti klientui · Grąžinta); laiško klientui nėra); po v3.20)",
    "→ Klausimas „Grąžink klientui pinigus“ (PDF · siųsti klientui · Grąžinta); laiško klientui nėra; v3.33 (S1618, Raimis 09-05 B): „+ NAUJAS UŽSAKYMAS“ telefonu — nuoroda eilių juostoje → langas `view=naujas` (`naujas()`): klientas (paieška tarp ankstesnių pirkėjų — AJAX `ps_dl_klientai`: HPOS `wc_order_addresses` + vartotojai; be el. pašto leidžiama), prekės (AJAX `ps_dl_prekes` pavadinimu/SKU — kaina su PVM su akcija, AV/WC likutis, svoris; kiekis ir kaina taisomi), nuolaida € su privaloma pastaba, pristatymas iš WC zonos LT instancijų (`naujas_pristatymas`: Venipak kurjeris pagal svorį / paštomatas / LP paštomatas / LP kurjeris; „Atsiėmimas AV“ tik su opcija `ps_dl_atsiemimas_av` — C) su numatyta kaina ir nemokamo riba (taisoma), paštomatai per `ps_dl_vietos`, apmokėjimas pavedimu (bacs + on-hold — WC/temos srautas kaip kasoje) arba „Apmokėta vietoje“ (cod + processing manual — varikliai kaip po Paysera); POST `ps_dl_naujas` → `naujas_vykdyti`; meta `_ps_telefonu`, `_ps_nuolaida(_pastaba)`, eilutėse `_ps_kaina_pakeista`; įvykis `naujas`; v3.33.1: zona „Lietuva“ (tik šalis LT), LP — el. paštas privalomas, pavedimu + el. paštas → temos `petshop_send_order_received_email` (išankstinė + rekvizitai); v3.33.2: `window.dlgForm/dlEsc` iš dl-js IIFE (naujo užsakymo JS „esc is not defined“)); po v3.20)")
rep("\tconst VERSIJA = '3.32';", "\tconst VERSIJA = '3.33.2';")
rep("\t\tadd_action( 'admin_post_ps_dl_grazinimas', array( __CLASS__, 'grazinimas_vykdyti' ) ); // v3.32 (A)\n",
    "\t\tadd_action( 'admin_post_ps_dl_grazinimas', array( __CLASS__, 'grazinimas_vykdyti' ) ); // v3.32 (A)\n"
    "\t\tadd_action( 'admin_post_ps_dl_naujas', array( __CLASS__, 'naujas_vykdyti' ) ); // v3.33 (B)\n"
    "\t\tadd_action( 'wp_ajax_ps_dl_klientai', array( __CLASS__, 'ajax_klientai' ) ); // v3.33 (B)\n"
    "\t\tadd_action( 'wp_ajax_ps_dl_prekes', array( __CLASS__, 'ajax_prekes' ) ); // v3.33 (B)\n")
# maršrutas puslapis(): prieš saskaitu_langas eilutę
a = "\t\tif ( self::saskaitu_langas() ) { self::stilius(); echo '<div class=\"dl\" id=\"dl\" data-eile=\"saskaitos\""
assert s.count(a) == 1
i = s.index(a)
rep(a, "\t\tif ( self::naujas_langas() ) { self::stilius(); echo '<div class=\"dl\" id=\"dl\" data-eile=\"naujas\" data-atid=\"0\" data-n=\"' . esc_attr( wp_create_nonce( 'ps_dl_zurnalas' ) ) . '\">'; self::pranesimas(); self::naujas(); self::skydelio_html(); self::dialogas(); self::skriptas(); self::naujas_skriptas(); echo '</div>'; return; } // v3.33 (B)\n" + a)
# eilių juosta: nuoroda dešinėje
rep("\t\techo '</div>';\n\t}\n\n\tprotected static function select( $vardas, $opcijos, $reiksme ) {",
    "\t\techo '<a class=\"dl-e dl-e-naujas\" href=\"' . esc_url( admin_url( 'admin.php?page=' . self::SLUG . '&view=naujas' ) ) . '\" title=\"Užsakymas telefonu / vietoje\">+ Naujas užsakymas</a>'; // v3.33 (B)\n\t\techo '</div>';\n\t}\n\n\tprotected static function select( $vardas, $opcijos, $reiksme ) {")
# funkcijos prieš v3.31 bloką
rep("\t/* ============================ v3.31: KREDITINĖS LAIŠKO ŠABLONAS (Raimis 09-05 #10: tekstas taisomas, siunčia TIK darbuotojas) ============",
    funcs.strip('\n') + "\n\n\t/* ============================ v3.31: KREDITINĖS LAIŠKO ŠABLONAS (Raimis 09-05 #10: tekstas taisomas, siunčia TIK darbuotojas) ============")
# JS: dlgForm/esc į window (dl-js yra IIFE)
rep("\tdocument.addEventListener('click',function(e){\n\t\tvar x=e.target.closest('.dl-kk-x');",
    "\twindow.dlgForm=dlgForm; window.dlEsc=esc; // v3.33.2: naujo užsakymo langui (atskiras <script>)\n\tdocument.addEventListener('click',function(e){\n\t\tvar x=e.target.closest('.dl-kk-x');")
# CSS
rep(".dl-gr-f select{font:inherit;font-size:13px;color:var(--rasalas);border:1px solid var(--linija);border-radius:5px;padding:3px 6px;background:var(--popierius)}.dl-gr-f .dl-kr-m label{align-items:center}#skPr .dl-gr-f{max-width:none;margin:0}.dl-veiksmai .dl-gr-b{margin-right:4px}\n",
    ".dl-gr-f select{font:inherit;font-size:13px;color:var(--rasalas);border:1px solid var(--linija);border-radius:5px;padding:3px 6px;background:var(--popierius)}.dl-gr-f .dl-kr-m label{align-items:center}#skPr .dl-gr-f{max-width:none;margin:0}.dl-veiksmai .dl-gr-b{margin-right:4px}\n"
    ".dl-e-naujas{margin-left:auto;background:var(--zalia,#2d6a35);color:#fff;border-color:transparent}.dl-e-naujas:hover{opacity:.9}\n"
    ".dl-nu{max-width:960px}.dl-nu .dl-kortele{margin-bottom:12px}.dl-nu label{display:block;font-size:12px;color:var(--pilka);margin:6px 0 0}.dl-nu input:not([type=checkbox]):not([type=radio]),.dl-nu select{display:block;width:100%;box-sizing:border-box;font:inherit;font-size:13px;color:var(--rasalas);border:1px solid var(--linija);border-radius:5px;padding:6px 8px;background:var(--popierius);margin-top:2px}.dl-nu .e2{display:grid;grid-template-columns:1fr 1fr;gap:8px}.dl-nu-p{position:relative;margin-bottom:6px}.dl-nu-r{position:absolute;left:0;right:0;top:100%;z-index:5;background:var(--popierius);border:1px solid var(--linija);border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.08);max-height:320px;overflow:auto}.dl-nu-r:empty{display:none}.dl-nu-r .dl-nu-k{display:block;padding:8px 12px;border-bottom:1px solid var(--linija);color:var(--rasalas);text-decoration:none;font-size:13px}.dl-nu-r .dl-nu-k:hover{background:var(--fonas,#f6f6f4)}.dl-nu-r>div{padding:8px 12px;font-size:13px}.dl-nu-t{margin-top:6px}.dl-nu-t input[type=number]{width:80px;display:inline-block;margin:0}.dl-nu-t td.c,.dl-nu-t th.c{text-align:center}.dl-nu-t td.r,.dl-nu-t th.r{text-align:right;white-space:nowrap}.dl-nu-nuol{display:flex;gap:12px;align-items:flex-end;margin-top:8px}.dl-nu-nuol input{display:inline-block!important;width:110px!important}.dl-nu-nuolp{flex:1}.dl-nu-nuolp input{width:100%!important}.dl-nu-mok label{display:flex;gap:8px;align-items:flex-start;font-size:13px;color:var(--rasalas);margin:6px 0}.dl-nu-mok input{margin-top:3px}.dl-nu-viso{display:flex;gap:18px;flex-wrap:wrap;margin:12px 0;font-size:13px;color:var(--pilka)}.dl-nu-viso b{color:var(--rasalas)}.dl-nu-total{font-size:15px}.dl-nu-total b{font-size:17px}#nuPristN{font-weight:400}\n")
out = '/home/claude/ps/petshop-darbalaukis-v333.php'
open(out, 'w', encoding='utf-8').write(s)
r = subprocess.run(['php', '-l', out], capture_output=True, text=True)
print(r.stdout.strip(), r.stderr.strip())
if r.returncode != 0 or 'No syntax errors' not in r.stdout: print('LINT FAIL — STOP'); sys.exit(1)
print('bytes', len(s.encode('utf-8')), 'md5', hashlib.md5(s.encode('utf-8')).hexdigest())
