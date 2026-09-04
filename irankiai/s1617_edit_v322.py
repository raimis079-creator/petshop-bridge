import re,sys
s=open('petshop-darbalaukis-v321.php',encoding='utf-8').read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a)
    if n!=cnt: print('FAIL',n,repr(a[:80])); sys.exit(1)
    s=s.replace(a,b)
rep(" * Petshop Darbalaukis v3.21 (S1617, 5 etapas: „Pakartotinis užsakymas“ — naujas mažas užsakymas + apmokėjimo nuoroda; po v3.20)",
    " * Petshop Darbalaukis v3.22 (S1617, 5 etapas: „Pakartotinis užsakymas“ — naujas mažas užsakymas + apmokėjimo nuoroda; v3.22: WC laiškai pakartotiniam užsakymui išjungti per `woocommerce_email_enabled_*`; po v3.20)")
rep("\tconst VERSIJA = '3.21';","\tconst VERSIJA = '3.22';")
rep(" *   naujas užsakymas → `completed` be WC laiškų (tema jį rašytų „išsiųstas“), temos kablys išrašo AVPN, darbalaukio laiškas „apmokėjimas gautas“ su PVM\n",
    " *   naujas užsakymas → `completed` be WC laiškų (tema jį rašytų „išsiųstas“), temos kablys išrašo AVPN, darbalaukio laiškas „apmokėjimas gautas“ su PVM\n *   (v3.22: VISI WC laiškai pakartotiniam užsakymui — klientui „vykdomas“ / „įvykdytas“ / „laukiama“ ir administratoriui „naujas užsakymas“ — išjungti per\n *   `woocommerce_email_enabled_{id}` (`pakartotinis_wc_laiskai`), nes WC „vykdomas“ šaudo prior. 10, prieš `pakartotinis_apmoketas` (110); e1d testas rado 2 perteklinius)\n")
rep("\t\tadd_filter( 'woocommerce_order_email_verification_required', array( __CLASS__, 'pakartotinis_be_patvirtinimo' ), 20, 3 );\n",
    "\t\tadd_filter( 'woocommerce_order_email_verification_required', array( __CLASS__, 'pakartotinis_be_patvirtinimo' ), 20, 3 );\n\t\tforeach ( array( 'new_order', 'customer_processing_order', 'customer_completed_order', 'customer_on_hold_order', 'customer_invoice', 'customer_pending_order' ) as $wc_l ) { add_filter( 'woocommerce_email_enabled_' . $wc_l, array( __CLASS__, 'pakartotinis_wc_laiskai' ), 20, 2 ); } // v3.22\n")
rep("\t/** „Siųsti iš naujo“ — TIK grįžusią dalį (log S1611 spr. 5",
    "\t/** v3.22: pakartotiniam užsakymui — jokių WC laiškų (klientui „vykdomas“/„įvykdytas“/„laukiama“, administratoriui „naujas užsakymas“): vienintelis laiškas —\n\t *  darbalaukio „apmokėjimas gautas“ su PVM sąskaita (`pakartotinis_apmoketas`); administratoriui — pradinio užsakymo kortelė / pastaba (Claude prielaida). */\n\tpublic static function pakartotinis_wc_laiskai( $enabled, $object = null ) {\n\t\tif ( $enabled && $object instanceof WC_Order && $object->get_meta( self::PAKART_META ) ) { return false; }\n\t\treturn $enabled;\n\t}\n\n\t/** „Siųsti iš naujo“ — TIK grįžusią dalį (log S1611 spr. 5")
open('petshop-darbalaukis-v322.php','w',encoding='utf-8').write(s)
print('ok',len(s.encode()))
