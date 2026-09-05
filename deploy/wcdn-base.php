<?php
/**
 * petshop.lt — PDF/HTML sąskaitos šablonas
 * Plugin: Print Invoices & Delivery Notes (woocommerce-delivery-notes)
 * Versija: 2.10 (S1617) — kreditinėje pristatymo eilutė ir „Pristatymas“ suma (kaip sąskaitoje; e5 testas: be jos sumos nesueina). 2.9 (S1617, Raimis K1) — kreditinė: sava KR eilė iš refund meta `_petshop_kravpn_number`, konkretus grąžinimas (kai $order['id'] = refund),
 *   data iš `_petshop_kravpn_date`, „Originali sąskaita“ = pradinio AVPN. 2.8 — logotipas PDF'e per data URI (dompdf negali per https/URL)
 */

if ( ! isset( $type ) ) { $type = 'html'; }
$is_pdf = ( 'pdf' === $type );

/* LT pinigų formatas: 1 234,56 € (kablelis, tarpas tarp tūkstančių, € gale) */
if ( ! function_exists( 'ps_eur' ) ) {
    function ps_eur( $amount, $neg = false ) {
        return ( $neg ? '-' : '' ) . number_format( abs( (float) $amount ), 2, ',', ' ' ) . '&nbsp;&euro;';
    }
}

$wc_order = isset( $order['id'] ) ? wc_get_order( $order['id'] ) : null;

$doc_title      = 'PVM sąskaita faktūra';
$order_id       = isset( $order['id'] ) ? $order['id'] : 0;
$is_credit_note = ( isset( $template ) && $template === 'creditnote' );

if ( $is_credit_note ) {
    $doc_title = 'Kreditinė PVM sąskaita faktūra';
    $maybe_order  = wc_get_order( $order_id );
    $maybe_parent = $maybe_order ? $maybe_order->get_parent_id() : 0;
    if ( $maybe_parent ) {
        $parent_id    = $maybe_parent;
        $parent_order = wc_get_order( $parent_id );
    } else {
        $parent_id    = $order_id;
        $parent_order = $maybe_order;
    }
    if ( $parent_order ) {
        $original_avpn = $parent_order->get_meta( '_petshop_avpn_number' );
        if ( ! $original_avpn ) {
            $original_avpn = function_exists( 'petshop_get_avpn_number' )
                ? petshop_get_avpn_number( $parent_id )
                : 'AVPN' . str_pad( $parent_order->get_order_number(), 6, '0', STR_PAD_LEFT );
        }
        $invoice_number = ( $maybe_parent && $maybe_order && $maybe_order->get_meta( '_petshop_kravpn_number' ) ) ? $maybe_order->get_meta( '_petshop_kravpn_number' ) : 'KR-' . $original_avpn; // v2.9: sava KR-AVPN eilė (darbalaukis)
    } else {
        $invoice_number = 'KR-AVPN' . ( isset( $order['orderNumber'] ) ? $order['orderNumber'] : '' );
    }
    if ( $parent_order ) {
        $wc_order = $parent_order;
    }
} else {
    $invoice_number = function_exists( 'petshop_get_avpn_number' ) && $order_id
        ? petshop_get_avpn_number( $order_id )
        : 'AVPN' . ( isset( $order['orderNumber'] ) ? $order['orderNumber'] : '' );
    if ( $wc_order ) {
        $payment_method_id = $wc_order->get_payment_method();
        $order_status      = $wc_order->get_status();
        $is_bank_transfer  = ( $payment_method_id === 'bacs' );
        if ( $is_bank_transfer && in_array( $order_status, array( 'pending', 'on-hold' ), true ) ) {
            $doc_title      = 'Išankstinė sąskaita';
            $invoice_number = function_exists( 'petshop_get_iapv_number' ) && $order_id
                ? petshop_get_iapv_number( $order_id )
                : 'IAPV' . $order['orderNumber'];
        }
        $saved_type = $wc_order->get_meta( '_petshop_invoice_document_type' );
        if ( $saved_type === 'proforma' ) {
            $doc_title      = 'Išankstinė sąskaita';
            $invoice_number = function_exists( 'petshop_get_iapv_number' ) && $order_id
                ? petshop_get_iapv_number( $order_id )
                : 'IAPV' . $order['orderNumber'];
        } elseif ( $saved_type === 'invoice' ) {
            $doc_title      = 'PVM sąskaita faktūra';
            $invoice_number = function_exists( 'petshop_get_avpn_number' ) && $order_id
                ? petshop_get_avpn_number( $order_id )
                : 'AVPN' . $order['orderNumber'];
        }
    }
}

$is_proforma = ( $doc_title === 'Išankstinė sąskaita' );

$payment_method = '';
if ( $wc_order ) {
    $pm = $wc_order->get_payment_method();
    if ( $pm === 'bacs' ) {
        $payment_method = 'Bankinis pavedimas';
    } elseif ( $pm === 'paysera' || strpos( $pm, 'paysera' ) !== false ) {
        $payment_method = 'Mokėjimas internetu';
    } else {
        $payment_method = $wc_order->get_payment_method_title();
    }
}

$shipping_method_label = '';
$pickup_point          = '';
if ( $wc_order ) {
    foreach ( $wc_order->get_items( 'shipping' ) as $s ) {
        $raw     = $s->get_name();
        $raw_low = mb_strtolower( trim( $raw ) );
        if ( str_contains( $raw_low, 'free' ) && str_contains( $raw_low, 'shipping' ) ) {
            $shipping_method_label = 'Nemokamas pristatymas';
        } elseif ( str_contains( $raw_low, 'flat rate' ) ) {
            $shipping_method_label = 'Pristatymas';
        } elseif ( str_contains( $raw_low, 'local pickup' ) ) {
            $shipping_method_label = 'Atsiėmimas vietoje';
        } else {
            $shipping_method_label = $raw;
        }
        $pickup_point = $s->get_meta( 'Pickup point' )
            ?: $s->get_meta( 'terminal_name' )
            ?: $s->get_meta( 'pickup_point' );
        break;
    }
}

$billing_lines = [];
if ( $wc_order ) {
    $countries      = WC()->countries ? WC()->countries->get_countries() : [];
    $b_country      = $wc_order->get_billing_country();
    $b_country_name = isset( $countries[ $b_country ] ) ? $countries[ $b_country ] : $b_country;
    $skip_states    = [ 'pasirinkite rajoną', 'select a region', 'select an option' ];
    $b_state        = $wc_order->get_billing_state();
    $b_state_val    = ( $b_state && ! in_array( mb_strtolower( $b_state ), $skip_states ) ) ? $b_state : '';
    $city_post      = trim(
        $wc_order->get_billing_city() .
        ( $wc_order->get_billing_postcode() ? ', ' . $wc_order->get_billing_postcode() : '' )
    );
    $billing_lines = array_values( array_filter( [
        $wc_order->get_billing_address_1(),
        $wc_order->get_billing_address_2(),
        $city_post,
        $b_state_val,
        $b_country_name,
    ] ) );
}

/* LOGOTIPAS
 * PDF (dompdf) NEGALI paimti logotipo per URL: dev.avesa.lt sertifikatas
 * nevalidus (cURL 60), o file_get_contents per https grazina false. Todel
 * PDF'ui logotipas idedamas kaip data URI is VIETINIO failo — nepriklauso
 * nei nuo SSL, nei nuo domeno (veiks ir po perjungimo i petshop.lt).
 * HTML lieka iprastas URL.
 */
$logo_url  = ! empty( $shop['logo'] ) ? $shop['logo'] : '';
if ( ! $logo_url ) {
    $ps_wcdn_opts = get_option( 'wcdn_settings' );
    if ( is_array( $ps_wcdn_opts ) && ! empty( $ps_wcdn_opts['storeLogo'] ) ) {
        $logo_url = $ps_wcdn_opts['storeLogo'];
    }
}
$logo_path = ( ! empty( $shop['logo_path'] ) && file_exists( $shop['logo_path'] ) )
    ? $shop['logo_path']
    : '';
if ( ! $logo_path && $logo_url ) {
    $ps_wc_pos = strpos( $logo_url, '/wp-content/' );
    if ( false !== $ps_wc_pos ) {
        $ps_cand = WP_CONTENT_DIR . substr( $logo_url, $ps_wc_pos + strlen( '/wp-content' ) );
        $ps_cand = strtok( $ps_cand, '?' );
        if ( $ps_cand && file_exists( $ps_cand ) && is_readable( $ps_cand ) ) {
            $logo_path = $ps_cand;
        }
    }
}

$logo_src = '';
if ( $is_pdf ) {
    if ( $logo_path ) {
        $ps_ext  = strtolower( pathinfo( $logo_path, PATHINFO_EXTENSION ) );
        $ps_mime = [ 'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'gif' => 'image/gif' ];
        if ( isset( $ps_mime[ $ps_ext ] ) ) {
            $ps_bin = @file_get_contents( $logo_path );
            if ( false !== $ps_bin && '' !== $ps_bin ) {
                $logo_src = 'data:' . $ps_mime[ $ps_ext ] . ';base64,' . base64_encode( $ps_bin );
            }
        }
        if ( ! $logo_src ) {
            $logo_src = $logo_path;
        }
    } elseif ( $logo_url ) {
        $logo_src = $logo_url;
    }
} else {
    if ( $logo_url ) {
        $logo_src = $logo_url;
    } elseif ( $logo_path ) {
        $logo_src = str_replace( ABSPATH, site_url( '/' ), $logo_path );
    }
}

$subtotal_excl  = 0;
$shipping_total = 0;
$total_tax      = 0;
$order_total    = 0;
if ( $wc_order ) {
    $subtotal_excl  = $wc_order->get_subtotal();
    $shipping_total = (float) $wc_order->get_shipping_total();
    $total_tax      = (float) $wc_order->get_total_tax();
    $order_total    = (float) $wc_order->get_total();
}
$shipping_is_free = ( $shipping_total == 0 );

$doc_date_raw  = isset( $order['documentDate'] ) ? $order['documentDate'] : date( 'Y-m-d' );
$order_no_disp = isset( $order['orderNumber'] ) ? $order['orderNumber'] : '';

$sz_logo  = $is_pdf ? '190px' : '130px';
$sz_title = $is_pdf ? '17px'  : '15px';
$sz_date  = $is_pdf ? '16px'  : '12px';
$sz_rcon  = $is_pdf ? '15px'  : '11px';
$sz_rekvz = $is_pdf ? '15px'  : '12px';
$sz_bttl  = $is_pdf ? '17px'  : '14px';
$sz_items = $is_pdf ? '14px'  : '12px';
$sz_totl  = $is_pdf ? '15px'  : '13px';
$sz_grand = $is_pdf ? '17px'  : '14px';
$sz_pay   = $is_pdf ? '14px'  : '12px';
$sz_foot  = $is_pdf ? '11px'  : '10px';
?>
<div class="wcdn-document">
<?php do_action( 'wcdn_before_document', $order, $template ); ?>

<style>
@page { margin: 18mm 18mm 22mm 18mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
.wcdn-document {
    font-family: DejaVu Sans, Arial, sans-serif;
    font-size: <?php echo $sz_rekvz; ?>;
    color: #222;
    line-height: 1.45;
    padding: 5mm 4mm 0;
}
.ps-hdr { width: 100%; border-collapse: collapse; table-layout: fixed; border-bottom: 2px solid #2D5F3F; margin-bottom: 18px; }
.ps-hdr td { vertical-align: middle; padding-bottom: 10px; }
.ps-hdr .col-logo    { width: 22%; text-align: left; }
.ps-hdr .col-content { width: 78%; }
.ps-hdr-inner { width: 100%; border-collapse: collapse; table-layout: fixed; }
.ps-hdr-inner td { vertical-align: middle; padding: 0; }
.ps-hdr-inner .col-title    { width: 66%; text-align: left; padding-left: 8px; padding-right: 14px; }
.ps-hdr-inner .col-contacts { width: 34%; text-align: right; font-size: <?php echo $sz_rcon; ?>; line-height: 1.5; vertical-align: middle; }
.ps-title { font-size: <?php echo $sz_title; ?>; font-weight: 700; margin-bottom: 5px; color: #2D5F3F; }
.ps-date  { font-size: <?php echo $sz_date; ?>; color: #444; }
.ps-parties { width: 100%; border-collapse: collapse; margin-top: 24px; margin-bottom: 32px; }
.ps-parties td { vertical-align: top; }
.ps-col-seller { width: 54%; text-align: left; font-size: <?php echo $sz_rekvz; ?>; line-height: 1.35; padding-right: 16px; }
.ps-col-buyer  { width: 46%; text-align: left; font-size: <?php echo $sz_rekvz; ?>; line-height: 1.35; padding-left: 10px; }
.ps-block-title { font-size: <?php echo $sz_bttl; ?>; font-weight: 700; margin-bottom: 6px; color: #2D5F3F; }
.ps-items { width: 100%; border-collapse: collapse; }
.ps-items thead tr { background: #eef3ea; }
.ps-items th { padding: 11px 7px; font-weight: 700; font-size: <?php echo $sz_items; ?>; border-bottom: 1px solid #c7d3bf; text-align: left; white-space: nowrap; }
.ps-items td { padding: 11px 7px; border-bottom: 1px solid #e5e7e0; vertical-align: top; font-size: <?php echo $sz_items; ?>; line-height: 1.3; }
.ps-items tbody tr:nth-child(even) { background: #fafafa; }
.col-name  { width: 46%; }
.col-code  { width: 14%; }
.col-qty   { width: 10%; text-align: center; }
.col-price { width: 15%; text-align: right; }
.col-total { width: 15%; text-align: right; }
.r { text-align: right; }
.c { text-align: center; }
.ps-footer { width: 100%; border-collapse: collapse; margin-top: 32px; }
.ps-footer td { vertical-align: top; }
.ps-col-info   { width: 54%; font-size: <?php echo $sz_rekvz; ?>; line-height: 1.8; padding-right: 16px; }
.ps-col-totals { width: 46%; }
.ps-totals { width: 100%; border-collapse: collapse; }
.ps-totals td { padding: 6px 2px; font-size: <?php echo $sz_totl; ?>; border-bottom: 1px solid #eee; }
.ps-totals .lbl { text-align: left; color: #444; }
.ps-totals .val { text-align: right; white-space: nowrap; }
.ps-totals tr.grand td { font-weight: 700; font-size: <?php echo $sz_grand; ?>; border-top: 2px solid #2D5F3F; border-bottom: none; padding-top: 8px; }
.ps-paybox { width: 100%; border-collapse: collapse; margin-top: 22px; }
.ps-paybox td { border: 1px solid #c7d3bf; background: #f4f8f1; padding: 11px 13px; font-size: <?php echo $sz_pay; ?>; line-height: 1.6; }
.ps-paybox-title { font-weight: 700; color: #2D5F3F; margin-bottom: 4px; }
.ps-paybox-note { color: #555; }
.ps-doc-footer {
    <?php echo $is_pdf ? 'position: fixed; left: 0; right: 0; bottom: 6mm;' : 'margin-top: 28px;'; ?>
    border-top: 1px solid #ccc; padding-top: 6px; text-align: center;
    color: #888; font-size: <?php echo $sz_foot; ?>; line-height: 1.4;
}
</style>

<!-- HEADER -->
<table class="ps-hdr">
    <tr>
        <td class="col-logo">
            <?php if ( $logo_src ) : ?>
            <img src="<?php echo esc_attr( $logo_src ); ?>" width="<?php echo esc_attr( $sz_logo ); ?>" style="width:<?php echo esc_attr( $sz_logo ); ?>;height:auto;display:block;" alt="logo">
            <?php endif; ?>
        </td>
        <td class="col-content">
            <table class="ps-hdr-inner">
                <tr>
                    <td class="col-title">
                        <div class="ps-title"><?php echo esc_html( $doc_title ); ?> &ndash; <?php echo esc_html( $invoice_number ); ?></div>
                        <div class="ps-date">Sąskaitos išrašymo data: <strong><?php echo esc_html( $doc_date_raw ); ?></strong></div>
                    </td>
                    <td class="col-contacts">
                        Tel. +370 681 87787<br>
                        El. p. terra@petshop.lt
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<!-- PARDAVĖJAS / PIRKĖJAS -->
<table class="ps-parties">
    <tr>
        <td class="ps-col-seller">
            <div class="ps-block-title">Pardavėjas:</div>
            UAB Avesa<br>
            Įmonės kodas: 302568442<br>
            PVM kodas: LT100005768519<br>
            Bankas: AB Swedbank<br>
            Banko sąskaita: LT127300010124940593<br>
            Reg. adresas: Liucionių g. 46, Liucionys,<br>
            Nemenčinės sen., Vilniaus r., LT-15166<br>
            Tel.: +370 681 87787<br>
            El. p.: terra@petshop.lt
        </td>
        <td class="ps-col-buyer">
            <div class="ps-block-title">Pirkėjas:</div>
            <?php if ( $wc_order ) :
                $is_company_order = (bool) $wc_order->get_meta( '_billing_is_company' );
                // Fallback: jei meta nera, bet imones pavadinimas uzpildytas
                if ( ! $is_company_order && $wc_order->get_billing_company() ) {
                    $is_company_order = true;
                }
                $company_name     = $wc_order->get_billing_company();
                $company_code     = $wc_order->get_meta( '_billing_company_code' );
                $vat_code         = $wc_order->get_meta( '_billing_vat_code' );
                $company_address  = $wc_order->get_meta( '_billing_company_address' );
                $contact_name     = trim( $wc_order->get_billing_first_name() . ' ' . $wc_order->get_billing_last_name() );
            ?>
            <?php if ( $is_company_order && $company_name ) : ?>
                <strong><?php echo esc_html( $company_name ); ?></strong><br>
                <?php if ( $company_code ) : ?>
                Įmonės kodas: <?php echo esc_html( $company_code ); ?><br>
                <?php endif; ?>
                <?php if ( $vat_code ) : ?>
                PVM kodas: <?php echo esc_html( $vat_code ); ?><br>
                <?php endif; ?>
                <?php if ( $company_address ) : ?>
                Reg. adresas: <?php echo esc_html( $company_address ); ?><br>
                <?php endif; ?>
                Kontaktinis asmuo: <?php echo esc_html( $contact_name ); ?><br>
                <?php if ( $wc_order->get_billing_phone() ) : ?>
                Tel.: <?php echo esc_html( $wc_order->get_billing_phone() ); ?><br>
                <?php endif; ?>
                <?php if ( $wc_order->get_billing_email() ) : ?>
                El. p.: <?php echo esc_html( $wc_order->get_billing_email() ); ?>
                <?php endif; ?>
            <?php else : ?>
                <?php echo esc_html( $contact_name ); ?><br>
                <?php foreach ( $billing_lines as $line ) : ?>
                <?php echo esc_html( $line ); ?><br>
                <?php endforeach; ?>
                <?php if ( $wc_order->get_billing_phone() ) : ?>
                Tel.: <?php echo esc_html( $wc_order->get_billing_phone() ); ?><br>
                <?php endif; ?>
                <?php if ( $wc_order->get_billing_email() ) : ?>
                El. p.: <?php echo esc_html( $wc_order->get_billing_email() ); ?>
                <?php endif; ?>
            <?php endif; ?>
            <?php endif; ?>
        </td>
    </tr>
</table>

<!-- PREKIŲ LENTELĖ -->
<table class="ps-items">
    <thead>
        <tr>
            <th class="col-name">Pavadinimas</th>
            <th class="col-code">Kodas</th>
            <th class="col-qty c">Kiekis</th>
            <th class="col-price r">Vnt. kaina</th>
            <th class="col-total r">Suma</th>
        </tr>
    </thead>
    <tbody>
        <?php if ( $is_credit_note ) :
            $cn_parent  = wc_get_order( $parent_id );
            $cn_refunds = $cn_parent ? $cn_parent->get_refunds() : [];
            $refund_obj = ( $maybe_parent && $maybe_order ) ? $maybe_order : ( ! empty( $cn_refunds ) ? $cn_refunds[0] : null ); // v2.9: konkretus grąžinimas, ne paskutinis
            if ( $refund_obj ) :
                foreach ( $refund_obj->get_items() as $item ) :
                    if ( abs( $item->get_quantity() ) == 0 ) continue;
                    $product    = $item->get_product();
                    $sku        = $product ? $product->get_sku() : '';
                    $qty        = abs( $item->get_quantity() );
                    $line_tot   = abs( (float) $item->get_total() );
                    $unit_price = ( $qty > 0 ) ? $line_tot / $qty : 0;
        ?>
        <tr>
            <td class="col-name"><?php echo esc_html( $item->get_name() ); ?></td>
            <td class="col-code"><?php echo esc_html( $sku ); ?></td>
            <td class="col-qty c">-<?php echo intval( $qty ); ?></td>
            <td class="col-price r"><?php echo ps_eur( $unit_price ); ?></td>
            <td class="col-total r"><?php echo ps_eur( $line_tot, true ); ?></td>
        </tr>
        <?php   endforeach;
                foreach ( $refund_obj->get_items( 'shipping' ) as $sh_item ) : // v2.10: pristatymo eilutė kreditinėje
                    $sh_tot = abs( (float) $sh_item->get_total() ); if ( $sh_tot <= 0 ) continue;
        ?>
        <tr>
            <td class="col-name">Pristatymas (<?php echo esc_html( $sh_item->get_name() ); ?>)</td>
            <td class="col-code"></td>
            <td class="col-qty c">-1</td>
            <td class="col-price r"><?php echo ps_eur( $sh_tot ); ?></td>
            <td class="col-total r"><?php echo ps_eur( $sh_tot, true ); ?></td>
        </tr>
        <?php   endforeach;
            endif;
        else :
            if ( $wc_order ) :
                foreach ( $wc_order->get_items() as $item ) :
                    $product    = $item->get_product();
                    $sku        = $product ? $product->get_sku() : '';
                    $qty        = $item->get_quantity();
                    $line_tot   = (float) $item->get_total();
                    $unit_price = ( $qty > 0 ) ? $line_tot / $qty : 0;
        ?>
        <tr>
            <td class="col-name"><?php echo esc_html( $item->get_name() ); ?></td>
            <td class="col-code"><?php echo esc_html( $sku ); ?></td>
            <td class="col-qty c"><?php echo intval( $qty ); ?></td>
            <td class="col-price r"><?php echo ps_eur( $unit_price ); ?></td>
            <td class="col-total r"><?php echo ps_eur( $line_tot ); ?></td>
        </tr>
        <?php   endforeach;
            endif;
        endif; ?>
    </tbody>
</table>

<!-- APAČIA: info + sumos -->
<table class="ps-footer">
    <tr>
        <td class="ps-col-info">
            <?php if ( $is_credit_note ) : ?>
            <strong>Kreditinė data:</strong> <?php echo esc_html( ( $maybe_parent && $maybe_order && $maybe_order->get_meta( '_petshop_kravpn_date' ) ) ? $maybe_order->get_meta( '_petshop_kravpn_date' ) : date( 'Y-m-d' ) ); ?><br>
            <strong>Originali sąskaita:</strong> <?php echo esc_html( ! empty( $original_avpn ) ? $original_avpn : str_replace( 'KR-', '', $invoice_number ) ); ?><br>
            <strong>Užsakymo nr.:</strong> <?php echo esc_html( $order_no_disp ); ?><br>
            <?php else : ?>
            <strong>Užsakymo data:</strong> <?php
                $raw_date = isset( $order['date'] ) ? $order['date'] : '';
                echo esc_html( $raw_date ? substr( $raw_date, 0, 10 ) : '' );
            ?><br>
            <strong>Užsakymo nr.:</strong> <?php echo esc_html( $order_no_disp ); ?><br>
            <strong>Apmokėjimo būdas:</strong> <?php echo esc_html( $payment_method ); ?><br>
            <?php if ( $shipping_method_label ) : ?>
            <strong>Pristatymas:</strong> <?php echo esc_html( $shipping_method_label ); ?><br>
            <?php endif; ?>
            <?php if ( $pickup_point ) : ?>
            <strong>Atsiimti:</strong> <?php echo esc_html( $pickup_point ); ?><br>
            <?php endif; ?>
            <?php endif; ?>
        </td>
        <td class="ps-col-totals">
            <table class="ps-totals">
                <?php if ( $is_credit_note ) :
                    $cn_parent2    = wc_get_order( $parent_id );
                    $cn_refunds2   = $cn_parent2 ? $cn_parent2->get_refunds() : [];
                    $latest_refund = ( $maybe_parent && $maybe_order ) ? $maybe_order : ( ! empty( $cn_refunds2 ) ? $cn_refunds2[0] : null ); // v2.9
                    $ref_subtotal  = $latest_refund ? abs( (float) $latest_refund->get_subtotal() ) : 0;
                    $ref_tax       = $latest_refund ? abs( (float) $latest_refund->get_total_tax() ) : 0;
                    $ref_total     = $latest_refund ? abs( (float) $latest_refund->get_total() ) : 0;
                    $ref_ship      = $latest_refund ? abs( (float) $latest_refund->get_shipping_total() ) : 0; // v2.10
                ?>
                <tr><td class="lbl">Suma be PVM:</td><td class="val"><?php echo ps_eur( $ref_subtotal, true ); ?></td></tr>
                <?php if ( $ref_ship > 0 ) : ?>
                <tr><td class="lbl">Pristatymas:</td><td class="val"><?php echo ps_eur( $ref_ship, true ); ?></td></tr>
                <?php endif; ?>
                <tr><td class="lbl">PVM (21%):</td><td class="val"><?php echo ps_eur( $ref_tax, true ); ?></td></tr>
                <tr class="grand"><td class="lbl">Grąžinama suma:</td><td class="val"><?php echo ps_eur( $ref_total, true ); ?></td></tr>
                <?php else : ?>
                <tr><td class="lbl">Suma be PVM:</td><td class="val"><?php echo ps_eur( $subtotal_excl ); ?></td></tr>
                <?php if ( $shipping_is_free ) : ?>
                <tr><td class="lbl">Pristatymas:</td><td class="val">Nemokamas</td></tr>
                <?php else : ?>
                <tr><td class="lbl">Pristatymas:</td><td class="val"><?php echo ps_eur( $shipping_total ); ?></td></tr>
                <?php endif; ?>
                <tr><td class="lbl">PVM (21%):</td><td class="val"><?php echo ps_eur( $total_tax ); ?></td></tr>
                <tr class="grand"><td class="lbl">Mokėtina suma:</td><td class="val"><?php echo ps_eur( $order_total ); ?></td></tr>
                <?php endif; ?>
            </table>
        </td>
    </tr>
</table>

<?php if ( $is_proforma && ! $is_credit_note ) : ?>
<!-- MOKĖJIMO INSTRUKCIJA (proformai) -->
<table class="ps-paybox">
    <tr>
        <td>
            <div class="ps-paybox-title">Apmokėjimo informacija</div>
            <strong>Apmokėti iki:</strong> <?php echo esc_html( $doc_date_raw ); ?><br>
            <strong>Mokėjimo paskirtis:</strong> Išankstinės sąskaitos Nr. <?php echo esc_html( $invoice_number ); ?><br>
            <strong>Gavėjas:</strong> UAB Avesa&nbsp;&nbsp;|&nbsp;&nbsp;<strong>Sąskaita:</strong> LT127300010124940593 (AB Swedbank)<br>
            <span class="ps-paybox-note">Užsakymas paruošiamas išsiuntimui gavus apmokėjimą.</span>
        </td>
    </tr>
</table>
<?php endif; ?>

<!-- APAČIOS JUOSTA -->
<div class="ps-doc-footer">
    UAB Avesa &middot; Įmonės kodas 302568442 &middot; PVM LT100005768519 &middot; Liucionių g. 46, Vilniaus r., LT-15166 &middot; terra@petshop.lt &middot; +370 681 87787
</div>

<?php do_action( 'wcdn_after_document', $order, $template ); ?>
</div>
