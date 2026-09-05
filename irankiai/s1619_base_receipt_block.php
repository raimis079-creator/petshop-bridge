/* v2.12 (S1619, Raimis 09-06 PPK): PINIGŲ PRIĖMIMO KVITAS — `$template='receipt'` (darbalaukis `kvitas_pdf`: `$order['receipt']` = nr/data/suma/žodžiais/paskirtis/priėmė/mokėtojas; atsarga — užsakymo meta `_petshop_ppk_*`).
 * Atskira šaka: išveda kvitą ir baigia — sąskaitų / išankstinių / kreditinės šakos NELIESTOS. Tik spausdinti (parašas ranka, be antspaudo). */
if ( isset( $template ) && 'receipt' === $template && $wc_order ) {
    $rc = ( isset( $order['receipt'] ) && is_array( $order['receipt'] ) ) ? $order['receipt'] : array();
    $rc_nr     = ! empty( $rc['nr'] ) ? $rc['nr'] : (string) $wc_order->get_meta( '_petshop_ppk_number' );
    $rc_data   = ! empty( $rc['data'] ) ? $rc['data'] : ( (string) $wc_order->get_meta( '_petshop_ppk_date' ) ? (string) $wc_order->get_meta( '_petshop_ppk_date' ) : $doc_date_raw );
    $rc_suma   = isset( $rc['suma'] ) ? (float) $rc['suma'] : ( (float) $wc_order->get_meta( '_petshop_ppk_suma' ) > 0 ? (float) $wc_order->get_meta( '_petshop_ppk_suma' ) : $order_total );
    $rc_zodz   = ! empty( $rc['zodziais'] ) ? $rc['zodziais'] : '';
    $rc_pask   = ! empty( $rc['paskirtis'] ) ? $rc['paskirtis'] : 'Už prekes pagal užsakymą Nr. ' . $order_no_disp;
    $rc_prieme = ! empty( $rc['prieme'] ) ? $rc['prieme'] : (string) $wc_order->get_meta( '_petshop_ppk_kas' );
    $rc_mok    = ! empty( $rc['moketojas'] ) ? $rc['moketojas'] : trim( $wc_order->get_billing_first_name() . ' ' . $wc_order->get_billing_last_name() );
    $rc_kont   = ! empty( $rc['kontaktas'] ) ? $rc['kontaktas'] : trim( $wc_order->get_billing_phone() );
    $rc_fs     = $is_pdf ? '15px' : '12px';
?>
<div class="wcdn-document ps-receipt">
<?php do_action( 'wcdn_before_document', $order, $template ); ?>
<style>
@page { margin: 18mm 18mm 22mm 18mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
.ps-receipt { font-family: DejaVu Sans, Arial, sans-serif; font-size: <?php echo $rc_fs; ?>; color: #222; line-height: 1.45; padding: 5mm 4mm 0; }
.ps-receipt table { width: 100%; border-collapse: collapse; }
.ps-receipt .ps-hdr { border-bottom: 2px solid #2D5F3F; margin-bottom: 22px; }
.ps-receipt .ps-hdr td { vertical-align: middle; padding-bottom: 10px; }
.ps-receipt .col-logo { width: 22%; }
.ps-receipt .col-title { width: 50%; padding-left: 8px; }
.ps-receipt .col-contacts { width: 28%; text-align: right; font-size: <?php echo $is_pdf ? '14px' : '11px'; ?>; line-height: 1.5; }
.ps-receipt .ps-title { font-size: <?php echo $is_pdf ? '19px' : '15px'; ?>; font-weight: 700; color: #2D5F3F; margin-bottom: 5px; }
.ps-receipt .ps-date { font-size: <?php echo $is_pdf ? '15px' : '12px'; ?>; color: #444; }
.ps-receipt .ps-parties td { vertical-align: top; width: 50%; padding: 0 12px 24px 0; line-height: 1.4; }
.ps-receipt .ps-block-title { font-weight: 700; color: #2D5F3F; margin-bottom: 6px; font-size: <?php echo $is_pdf ? '16px' : '13px'; ?>; }
.ps-receipt .ps-rows td { padding: 11px 8px; border-bottom: 1px solid #e5e7e0; vertical-align: top; }
.ps-receipt .ps-rows td.lbl { width: 34%; color: #444; background: #eef3ea; font-weight: 700; }
.ps-receipt .ps-rows td.suma { font-size: <?php echo $is_pdf ? '21px' : '16px'; ?>; font-weight: 700; color: #2D5F3F; }
.ps-receipt .ps-sign { margin-top: 44px; }
.ps-receipt .ps-sign td { width: 50%; vertical-align: bottom; padding: 0 16px 0 0; }
.ps-receipt .ps-line { border-bottom: 1px solid #222; height: 30px; }
.ps-receipt .ps-under { color: #777; font-size: <?php echo $is_pdf ? '12px' : '10px'; ?>; padding-top: 4px; }
.ps-receipt .ps-note { margin-top: 26px; color: #666; font-size: <?php echo $is_pdf ? '12px' : '10px'; ?>; line-height: 1.5; }
.ps-receipt .ps-doc-footer { <?php echo $is_pdf ? 'position: fixed; left: 0; right: 0; bottom: 6mm;' : 'margin-top: 28px;'; ?> border-top: 1px solid #ccc; padding-top: 6px; text-align: center; color: #888; font-size: <?php echo $is_pdf ? '11px' : '10px'; ?>; line-height: 1.4; }
</style>
<table class="ps-hdr">
    <tr>
        <td class="col-logo"><?php if ( $logo_src ) : ?><img src="<?php echo esc_attr( $logo_src ); ?>" width="<?php echo esc_attr( $sz_logo ); ?>" style="width:<?php echo esc_attr( $sz_logo ); ?>;height:auto;display:block;" alt="logo"><?php endif; ?></td>
        <td class="col-title">
            <div class="ps-title">Pinigų priėmimo kvitas &ndash; <?php echo esc_html( $rc_nr ); ?></div>
            <div class="ps-date">Data: <strong><?php echo esc_html( $rc_data ); ?></strong></div>
        </td>
        <td class="col-contacts">Tel. +370 681 87787<br>El. p. terra@petshop.lt</td>
    </tr>
</table>
<table class="ps-parties">
    <tr>
        <td>
            <div class="ps-block-title">Pinigus gavo:</div>
            UAB Avesa<br>
            Įmonės kodas: 302568442<br>
            PVM kodas: LT100005768519<br>
            Liucionių g. 46, Liucionys, Nemenčinės sen., Vilniaus r., LT-15166
        </td>
        <td>
            <div class="ps-block-title">Mokėtojas:</div>
            <strong><?php echo esc_html( $rc_mok ); ?></strong><br>
            <?php if ( $rc_kont ) : ?><?php echo esc_html( $rc_kont ); ?><br><?php endif; ?>
        </td>
    </tr>
</table>
<table class="ps-rows">
    <tr><td class="lbl">Mokėjimo paskirtis</td><td><?php echo esc_html( $rc_pask ); ?></td></tr>
    <tr><td class="lbl">Suma</td><td class="suma"><?php echo ps_eur( $rc_suma ); ?></td></tr>
    <tr><td class="lbl">Suma žodžiais</td><td><?php echo esc_html( $rc_zodz ); ?></td></tr>
    <tr><td class="lbl">Apmokėjimo būdas</td><td>Grynaisiais</td></tr>
</table>
<table class="ps-sign">
    <tr>
        <td>
            Pinigus priėmė: <strong><?php echo esc_html( $rc_prieme ); ?></strong>
            <div class="ps-line"></div>
            <div class="ps-under">(parašas)</div>
        </td>
        <td>
            Pinigus įmokėjo: <strong><?php echo esc_html( $rc_mok ); ?></strong>
            <div class="ps-line"></div>
            <div class="ps-under">(parašas)</div>
        </td>
    </tr>
</table>
<div class="ps-note">Kvitas patvirtina grynųjų pinigų priėmimą už nurodytą užsakymą. PVM sąskaita faktūra išrašoma atskirai.</div>
<div class="ps-doc-footer">UAB Avesa &middot; Įmonės kodas 302568442 &middot; PVM LT100005768519 &middot; Liucionių g. 46, Vilniaus r., LT-15166 &middot; terra@petshop.lt &middot; +370 681 87787</div>
<?php do_action( 'wcdn_after_document', $order, $template ); ?>
</div>
<?php
    return;
}
