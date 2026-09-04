import sys
s=open('petshop-darbalaukis-v323.php',encoding='utf-8').read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a)
    if n!=cnt: print('FAIL',n,repr(a[:90])); sys.exit(1)
    s=s.replace(a,b)
rep(" * Petshop Darbalaukis v3.23 (S1617,"," * Petshop Darbalaukis v3.24 (S1617,")
rep("kortelėje „Apmokėta pavedimu“ — darbuotojas patvirtina gavęs pinigus; po v3.20)","kortelėje „Apmokėta pavedimu“ — darbuotojas patvirtina gavęs pinigus; v3.24: pasirinkus pavedimą (`on-hold`) nuoroda toliau veikia — Paysera vis dar galima; po v3.20)")
rep("\tconst VERSIJA = '3.23';","\tconst VERSIJA = '3.24';")
rep(" *   (GET `pakart_apmoketa` → `pakartotinis_pavedimas`: `payment_method=bacs`, `update_status(processing)` kaip Paysera callback → tas pats `pakartotinis_apmoketas` kelias).\n",
    " *   (GET `pakart_apmoketa` → `pakartotinis_pavedimas`: `payment_method=bacs`, `update_status(processing)` kaip Paysera callback → tas pats `pakartotinis_apmoketas` kelias).\n *   v3.24: WC apmokėjimo puslapis `on-hold` užsakymui sako „apmokėjimas negalimas“ (e3 W1B) — pakartotiniam `woocommerce_valid_order_statuses_for_payment` += on-hold\n *   (`pakartotinis_moketini_statusai`): klientas, pasirinkęs pavedimą, vis dar gali apmokėti Paysera per tą pačią nuorodą, kol darbuotojas nepažymėjo „Apmokėta pavedimu“.\n")
rep("\t\tadd_action( 'woocommerce_thankyou_bacs', array( __CLASS__, 'pakartotinis_aciu_bankas' ), 20, 1 ); // v3.23\n",
    "\t\tadd_action( 'woocommerce_thankyou_bacs', array( __CLASS__, 'pakartotinis_aciu_bankas' ), 20, 1 ); // v3.23\n\t\tadd_filter( 'woocommerce_valid_order_statuses_for_payment', array( __CLASS__, 'pakartotinis_moketini_statusai' ), 20, 2 ); // v3.24\n")
rep("\t/** v3.23: klientui pasirinkus pavedimą („ačiū“ puslapis,",
    "\t/** v3.24: pakartotinis užsakymas `on-hold` (klientas pasirinko pavedimą) lieka apmokamas per nuorodą — Paysera vis dar galima. */\n\tpublic static function pakartotinis_moketini_statusai( $statusai, $order = null ) {\n\t\tif ( $order instanceof WC_Order && $order->get_meta( self::PAKART_META ) && ! in_array( 'on-hold', (array) $statusai, true ) ) { $statusai[] = 'on-hold'; }\n\t\treturn $statusai;\n\t}\n\n\t/** v3.23: klientui pasirinkus pavedimą („ačiū“ puslapis,")
open('petshop-darbalaukis-v324.php','w',encoding='utf-8').write(s); print('ok',len(s.encode()))
