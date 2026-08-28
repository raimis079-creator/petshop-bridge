<?php
// Add custom Theme Functions here

// ===============================================================
// product_brand taksonomija YITH filtrams
// ===============================================================
add_filter('yith_wcan_supported_taxonomies', 'petshop_yith_add_product_brand_taxonomy', 99);
function petshop_yith_add_product_brand_taxonomy($taxonomies) {
    $brand_taxonomy = get_taxonomy('product_brand');

    if ( ! $brand_taxonomy ) {
        return $taxonomies;
    }

    if ( empty($brand_taxonomy->labels) ) {
        $brand_taxonomy->labels = get_taxonomy_labels($brand_taxonomy);
    }

    if ( empty($brand_taxonomy->labels->singular_name) ) {
        $brand_taxonomy->labels->singular_name = 'Prekių ženklas';
    }

    if ( empty($brand_taxonomy->label) ) {
        $brand_taxonomy->label = 'Prekių ženklai';
    }

    $taxonomies['product_brand'] = $brand_taxonomy;

    return $taxonomies;
}

// ===============================================================
// Mazo krepselio mokestis + pranesimai
// ===============================================================
add_action( 'woocommerce_cart_calculate_fees', function() {
    if ( is_admin() && ! defined( 'DOING_AJAX' ) ) return;
    $threshold     = 9.00;
    $fee           = 1.00;
    $subtotal_incl = WC()->cart->get_subtotal() + WC()->cart->get_subtotal_tax();
    if ( $subtotal_incl <= $threshold ) {
        WC()->cart->add_fee( 'Mažo krepšelio mokestis', $fee, true );
    }
} );

// Pranešimas krepšelio suvestinėje (dešinėje) po mokesčio eilute
add_action('woocommerce_cart_totals_after_order_total', function() {
    $threshold  = 9.00;
    $cart_total = WC()->cart->get_cart_contents_total() * 1.21;
    if ( $cart_total < $threshold ) {
        $truksta = round($threshold - $cart_total, 2);
        echo '<tr><td colspan="2" style="padding:0 0 8px;">';
        echo '<div style="background:#fff8e1;border-left:3px solid #f9a825;padding:10px 14px;font-size:13px;border-radius:0 4px 4px 0;">';
        echo sprintf(
            '💡 Pridėkite prekių už <strong>€%s</strong> ir mažo krepšelio mokestis nebus taikomas.',
            number_format($truksta, 2, ',', '')
        );
        echo '</div></td></tr>';
    }
});

// Mini krepšelio pranešimas
add_action('woocommerce_widget_shopping_cart_before_buttons', function() {
    $threshold  = 9.00;
    $cart_total = WC()->cart->get_cart_contents_total() * 1.21;
    if ( $cart_total > 0 && $cart_total < $threshold ) {
        $truksta = round($threshold - $cart_total, 2);
        echo '<div style="margin:8px 0;padding:10px 14px;background:#fff8e1;border-left:3px solid #f9a825;font-size:13px;border-radius:0 4px 4px 0;">';
        echo sprintf(
            '💡 Pridėkite už <strong>€%s</strong> ir mažo krepšelio mokestis nebus taikomas.',
            number_format($truksta, 2, ',', '')
        );
        echo '</div>';
    }
});

// ===============================================================
// Pristatymo metodu ribojimas pagal fulfillment source (S75)
// v2 (2026-06-09): per Petshop_Fulfillment_Source resolveri.
// ===============================================================
add_filter( 'woocommerce_package_rates', 'petshop_hide_parcel_if_courier_only', 10, 2 );
function petshop_hide_parcel_if_courier_only( $rates, $package ) {

    $venipak_courier = 'shopup_venipak_shipping_courier_method';
    $venipak_pickup  = 'shopup_venipak_shipping_pickup_method';

    if ( class_exists( 'Petshop_Fulfillment_Source' ) ) {

        $has_venipak_only = false;
        $has_courier_only = false;

        foreach ( $package['contents'] as $item ) {
            $pid = $item['product_id'];
            $res = Petshop_Fulfillment_Source::resolve( (int) $pid );

            if ( ! empty( $res['carrier'] ) && $res['carrier'] === 'venipak' ) {
                $has_venipak_only = true;
            }
            if ( ! empty( $res['courier_only'] ) ) {
                $has_courier_only = true;
            }
            /* DU LAUKAI TAM PACIAM DALYKUI (rasta 2026-08-28).
               `_fulfillment_courier_only` — senasis, sioje bazeje jo turi 0 prekiu.
               `_ps_tik_kurjeriu` — ta, kuria RASO katalogo kortele; ja turi 162 prekes.
               Filtras skaite tik pirmaji, todel varnele kortelėje niekada
               neveike: preke, netelpanti i pastomata, ji vis tiek siule. */
            if ( get_post_meta( $pid, '_fulfillment_courier_only', true ) === 'yes'
                 || get_post_meta( $pid, '_ps_tik_kurjeriu', true ) === 'yes' ) {
                $has_courier_only = true;
            }
        }

        foreach ( $rates as $rate_id => $rate ) {
            $method_id = $rate->get_method_id();

            if ( $has_venipak_only && $method_id !== $venipak_courier && $method_id !== $venipak_pickup ) {
                unset( $rates[ $rate_id ] );
                continue;
            }

            if ( $has_courier_only && $method_id === $venipak_pickup ) {
                unset( $rates[ $rate_id ] );
                continue;
            }
        }

        if ( empty( $rates ) ) {
            return $package['rates'] ?? $rates;
        }

        return $rates;
    }

    $has_courier_only = false;
    $has_zb           = false;

    foreach ( $package['contents'] as $item ) {
        $product_id = $item['product_id'];
        if ( get_post_meta( $product_id, '_fulfillment_courier_only', true ) === 'yes'
             || get_post_meta( $product_id, '_ps_tik_kurjeriu', true ) === 'yes' ) {
            $has_courier_only = true;
        }
        if ( get_post_meta( $product_id, '_zb_enabled', true ) === 'yes' ) {
            $has_zb = true;
        }
    }

    $hide_if_courier = array( $venipak_pickup );
    $hide_if_zb      = array( 'woo_lithuaniapost_lpexpress_terminal' );

    foreach ( $rates as $rate_id => $rate ) {
        $method_id = $rate->get_method_id();

        if ( $has_courier_only && in_array( $method_id, $hide_if_courier ) ) {
            unset( $rates[ $rate_id ] );
            continue;
        }

        if ( $has_zb && in_array( $method_id, $hide_if_zb ) ) {
            unset( $rates[ $rate_id ] );
        }
    }

    return $rates;
}

// ===============================================================
// Nemokamo pristatymo progreso juosta krepšelyje
// ===============================================================
add_action('woocommerce_cart_totals_before_order_total', 'petshop_free_shipping_progress', 5);
function petshop_free_shipping_progress() {
    if ( ! is_cart() ) return;

    $threshold = 30.00;

    $has_courier_only = false;
    $total_weight     = 0;
    foreach ( WC()->cart->get_cart() as $item ) {
        $product_id = $item['product_id'];
        /* Ta pati dviejų laukų problema kaip pristatymo filtre (2026-08-28):
           varnele kortelėje raso `_ps_tik_kurjeriu`, o cia buvo tikrinamas
           tik senasis `_fulfillment_courier_only`. Del to krepselyje
           kurjeriui skirta preke vis tiek matydavo „iki nemokamo pristatymo
           i pastomata" — pazadas, kurio ivykdyti neimanoma. */
        if ( get_post_meta( $product_id, '_fulfillment_courier_only', true ) === 'yes'
             || get_post_meta( $product_id, '_ps_tik_kurjeriu', true ) === 'yes' ) {
            $has_courier_only = true;
            break;
        }
        $weight       = (float) get_post_meta( $product_id, '_weight', true );
        $total_weight += $weight * $item['quantity'];
    }
    if ( $total_weight > 30 ) {
        $has_courier_only = true;
    }

    if ( $has_courier_only ) {
        echo '<tr><td colspan="2" style="padding:0 0 12px;">';
        echo '<div style="background:#f4f4f2;border-left:3px solid #365a51;padding:10px 14px;font-size:13px;border-radius:0 4px 4px 0;color:#555;">';
        echo '🚚 Kai kurios prekės pristatomos tik kurjeriu dėl dydžio arba svorio.';
        echo '</div></td></tr>';
        return;
    }

    $subtotal     = WC()->cart->get_subtotal();
    $subtotal_tax = WC()->cart->get_subtotal_tax();
    $discount     = WC()->cart->get_discount_total() + WC()->cart->get_discount_tax();
    $cart_total   = max( 0, ( $subtotal + $subtotal_tax ) - $discount );

    $percent = min( 100, round( ( $cart_total / $threshold ) * 100 ) );
    $truksta = max( 0, round( $threshold - $cart_total, 2 ) );
    $reached = $cart_total >= $threshold;

    echo '<tr><td colspan="2" style="padding:0 0 12px;">';
    echo '<div style="background:#f4f4f2;border-radius:6px;padding:12px 14px;">';

    if ( $reached ) {
        echo '<div style="font-size:13px;font-weight:600;color:#365a51;margin-bottom:8px;">🎉 Jums priklauso nemokamas pristatymas į paštomatą!</div>';
    } else {
        echo '<div style="font-size:13px;color:#333;margin-bottom:8px;">📦 Dar <strong>€' . number_format( $truksta, 2, ',', '' ) . '</strong> iki nemokamo pristatymo į paštomatą</div>';
    }

    echo '<div style="background:#ddd;border-radius:4px;height:8px;overflow:hidden;">';
    echo '<div style="width:' . $percent . '%;background:#365a51;height:8px;border-radius:4px;"></div>';
    echo '</div>';

    echo '</div>';
    echo '</td></tr>';
}

// ===============================================================
// Saskaitu numeracija
// Reset pries launcha:
//   update_option('petshop_avpn_counter', 101)
//   update_option('petshop_iapv_counter', 101)
// ===============================================================
function petshop_get_avpn_number( $order_id ) {
    $order    = wc_get_order( $order_id );
    $existing = $order ? $order->get_meta( '_petshop_avpn_number' ) : '';
    if ( $existing ) return $existing;
    $counter = (int) get_option( 'petshop_avpn_counter', 101 );
    $number  = 'AVPN' . str_pad( $counter, 6, '0', STR_PAD_LEFT );
    update_option( 'petshop_avpn_counter', $counter + 1 );
    if ( $order ) {
        $order->update_meta_data( '_petshop_avpn_number', $number );
        $order->save();
    }
    return $number;
}

function petshop_get_iapv_number( $order_id ) {
    $order    = wc_get_order( $order_id );
    $existing = $order ? $order->get_meta( '_petshop_iapv_number' ) : '';
    if ( $existing ) return $existing;
    $counter = (int) get_option( 'petshop_iapv_counter', 101 );
    $number  = 'IAPV' . str_pad( $counter, 6, '0', STR_PAD_LEFT );
    update_option( 'petshop_iapv_counter', $counter + 1 );
    if ( $order ) {
        $order->update_meta_data( '_petshop_iapv_number', $number );
        $order->save();
    }
    return $number;
}

function petshop_get_invoice_document_type( $order ) {
    if ( ! $order instanceof WC_Order ) return 'invoice';
    $payment_method   = $order->get_payment_method();
    $is_bank_transfer = ( $payment_method === 'bacs' );
    if ( $is_bank_transfer && in_array( $order->get_status(), array( 'pending', 'on-hold' ), true ) ) {
        return 'proforma';
    }
    return 'invoice';
}

function petshop_get_invoice_title( $order ) {
    $type     = petshop_get_invoice_document_type( $order );
    $order_id = $order->get_id();
    if ( $type === 'proforma' ) {
        return array(
            'title'  => 'Išankstinisė sąskaita',
            'number' => petshop_get_iapv_number( $order_id ),
        );
    }
    return array(
        'title'  => 'PVM sąskaita faktūra',
        'number' => petshop_get_avpn_number( $order_id ),
    );
}

// ===============================================================
// PDF saskaitos generavimas
// ===============================================================
function petshop_generate_invoice_pdf( $order_id ) {
    $wc_order = wc_get_order( $order_id );
    if ( ! $wc_order ) return false;

    $countries      = WC()->countries ? WC()->countries->get_countries() : array();
    $b_country      = $wc_order->get_billing_country();
    $b_country_name = isset( $countries[ $b_country ] ) ? $countries[ $b_country ] : $b_country;

    $skip_states = array( 'pasirinkite rajona', 'select a region', 'select an option' );
    $b_state     = $wc_order->get_billing_state();
    $b_state_val = ( $b_state && ! in_array( mb_strtolower( $b_state ), $skip_states ) ) ? $b_state : '';

    $city_post = trim( $wc_order->get_billing_city() . ( $wc_order->get_billing_postcode() ? ', ' . $wc_order->get_billing_postcode() : '' ) );

    $billing_lines = array_values( array_filter( array(
        $wc_order->get_billing_address_1(),
        $wc_order->get_billing_address_2(),
        $city_post,
        $b_state_val,
        $b_country_name,
    ) ) );

    $order = array(
        'id'            => $order_id,
        'orderNumber'   => $wc_order->get_order_number(),
        'documentDate'  => date_i18n( 'Y-m-d' ),
        'date'          => $wc_order->get_date_created()
                            ? $wc_order->get_date_created()->format( 'Y-m-d' )
                            : date( 'Y-m-d' ),
        'paymentMethod' => $wc_order->get_payment_method_title(),
        'billing'       => array(
            'name'    => trim( $wc_order->get_billing_first_name() . ' ' . $wc_order->get_billing_last_name() ),
            'address' => $billing_lines,
            'phone'   => $wc_order->get_billing_phone(),
            'email'   => $wc_order->get_billing_email(),
        ),
        'shipping'      => array( 'name' => '', 'address' => array() ),
    );

    $logo_url  = '';
    $logo_path = '';
    $flatsome_logo_id = get_theme_mod( 'site_logo' );
    if ( $flatsome_logo_id ) {
        $logo_url  = wp_get_attachment_image_url( $flatsome_logo_id, 'full' );
        $logo_path = get_attached_file( $flatsome_logo_id );
    }

    $shop     = array( 'logo' => $logo_url, 'logo_path' => $logo_path, 'name' => get_bloginfo( 'name' ) );
    $settings = array( 'displayPriceInProductDetailsTable' => true );
    $document = array();
    $template = 'invoice';
    $type     = 'pdf';
    $items    = array();
    $totals   = array();

    $template_file = get_stylesheet_directory() . '/woocommerce-delivery-notes/base.php';
    if ( ! file_exists( $template_file ) ) return false;

    ob_start();
    include $template_file;
    $body_html = ob_get_clean();

    $full_html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>@page{size:A4;margin:12mm 14mm;}body{margin:0;padding:0;}</style></head><body>' . $body_html . '</body></html>';

    if ( ! class_exists( 'Dompdf\Dompdf' ) ) return false;

    $upload_dir = wp_upload_dir();
    $pdf_dir    = trailingslashit( $upload_dir['basedir'] ) . 'wcdn/invoice/';
    wp_mkdir_p( $pdf_dir );
    // Svarus lietuviskas failo pavadinimas pagal dokumento numeri (base.php nustato $invoice_number ir $doc_title virsuje).
    $doc_num  = isset( $invoice_number ) ? preg_replace( '/[^A-Za-z0-9]/', '', $invoice_number ) : (string) $order_id;
    $name_pfx = ( isset( $doc_title ) && mb_stripos( $doc_title, 'ankstin' ) !== false ) ? 'Isankstine-saskaita' : 'PVM-saskaita';
    $pdf_file = $pdf_dir . $name_pfx . '-' . $doc_num . '.pdf';

    try {
        $options = new \Dompdf\Options();
        $options->set( 'isRemoteEnabled', true );
        $options->set( 'isHtml5ParserEnabled', true );
        $options->set( 'isFontSubsettingEnabled', true );
        $options->set( 'chroot', array( realpath( ABSPATH ), realpath( $upload_dir['basedir'] ) ) );
        $dompdf = new \Dompdf\Dompdf( $options );
        $dompdf->loadHtml( $full_html, 'UTF-8' );
        $dompdf->setPaper( array( 0, 0, 595.28, 841.89 ), 'portrait' );
        $dompdf->render();
        file_put_contents( $pdf_file, $dompdf->output() );
        return file_exists( $pdf_file ) ? $pdf_file : false;
    } catch ( \Throwable $e ) {
        return false;
    }
}

// ===============================================================
// Laiskas #1 - Uzsakymas gautas
// ===============================================================
add_action( 'woocommerce_checkout_order_created', function( $order ) {
    $doc_type = petshop_get_invoice_document_type( $order );
    $order->update_meta_data( '_petshop_invoice_document_type', $doc_type );
    try {
        $order_id = $order->get_id();
        $order->save();
        $pdf_file = petshop_generate_invoice_pdf( $order_id );
        if ( $pdf_file && file_exists( $pdf_file ) ) {
            $order->update_meta_data( '_petshop_order_pdf', $pdf_file );
            $order->save();
        }
    } catch ( \Throwable $e ) {}
    wp_schedule_single_event( time() + 5, 'petshop_send_order_received_email', array( $order->get_id() ) );
}, 20 );

add_action( 'petshop_send_order_received_email', function( $order_id ) {
    $order = wc_get_order( $order_id );
    if ( ! $order ) return;

    $payment_method_id = $order->get_payment_method();
    $is_bank           = ( $payment_method_id === 'bacs' );

    $items_html  = '<h2 style="font-size:16px;margin:16px 0 8px;">Jūsų užsakymas:</h2>';
    $items_html .= '<table cellpadding="8" style="width:100%;border-collapse:collapse;font-size:14px;">';
    $items_html .= '<tr style="background:#f4f4f2;"><th style="text-align:left;border-bottom:2px solid #ddd;">Prekė</th><th style="text-align:center;border-bottom:2px solid #ddd;">Kiekis</th><th style="text-align:right;border-bottom:2px solid #ddd;">Suma</th></tr>';
    foreach ( $order->get_items() as $item ) {
        $total       = $item->get_total() + $item->get_total_tax();
        $items_html .= '<tr style="border-bottom:1px solid #eee;">';
        $items_html .= '<td>' . esc_html( $item->get_name() ) . '</td>';
        $items_html .= '<td style="text-align:center;">' . $item->get_quantity() . '</td>';
        $items_html .= '<td style="text-align:right;">' . wc_price( $total ) . '</td>';
        $items_html .= '</tr>';
    }
    $items_html .= '</table>';
    $items_html .= '<table style="width:100%;margin-top:8px;font-size:14px;">';
    $items_html .= '<tr><td style="padding:4px 8px;">Pristatymas:</td><td style="text-align:right;padding:4px 8px;">' . wc_price( $order->get_shipping_total() + $order->get_shipping_tax() ) . '</td></tr>';
    $items_html .= '<tr><td style="padding:4px 8px;">PVM:</td><td style="text-align:right;padding:4px 8px;">' . wc_price( $order->get_total_tax() ) . '</td></tr>';
    $items_html .= '<tr><td style="padding:4px 8px;font-weight:bold;">Viso:</td><td style="text-align:right;padding:4px 8px;font-weight:bold;">' . wc_price( $order->get_total() ) . '</td></tr>';
    $items_html .= '</table>';

    $bank_html = '';
    if ( $is_bank ) {
        $bank_html = '<div style="background:#f9f9f9;border:1px solid #e0e0e0;padding:16px;margin:16px 0;font-size:14px;">'
            . '<p style="font-weight:bold;margin-bottom:8px;">Mokėjimo rekvizitai:</p>'
            . '<table style="width:100%;">'
            . '<tr><td style="padding:3px 0;color:#666;width:40%;">Gavėjas:</td><td><strong>UAB Avesa</strong></td></tr>'
            . '<tr><td style="padding:3px 0;color:#666;">Bankas:</td><td>AB Swedbank</td></tr>'
            . '<tr><td style="padding:3px 0;color:#666;">Šąskaita:</td><td><strong>LT127300010124940593</strong></td></tr>'
            . '<tr><td style="padding:3px 0;color:#666;">Suma:</td><td><strong>' . wc_price( $order->get_total() ) . '</strong></td></tr>'
            . '<tr><td style="padding:3px 0;color:#666;">Mokėjimo paskirtis:</td><td><strong>Užsakymas Nr. ' . $order->get_order_number() . '</strong></td></tr>'
            . '</table></div>';
    }

    $pdf_attachment = array();
    try {
        $petshop_pdf = $order->get_meta( '_petshop_order_pdf' );
        if ( $petshop_pdf && file_exists( $petshop_pdf ) ) {
            $pdf_attachment[] = $petshop_pdf;
        }
        if ( empty( $pdf_attachment ) ) {
            $pdf_file = petshop_generate_invoice_pdf( $order_id );
            if ( $pdf_file && file_exists( $pdf_file ) ) {
                $pdf_attachment[] = $pdf_file;
            }
        }
    } catch ( \Throwable $e ) {}

    $to      = $order->get_billing_email();
    $subject = 'Jūsų užsakymas Nr. ' . $order->get_order_number() . ' gautas - Petshop.lt';
    $heading = 'Užsakymas gautas, ačiū!';
    $intro   = $is_bank
        ? 'Gavę apmokėjimą, pradėsime vykdyti užsakymą ir informuosime Jus atskiru pranešimu.'
        : 'Kai tik gausime apmokėjimą, pradėsime vykdyti užsakymą ir informuosime Jus atskiru pranešimu.';

    $message = '<p>Laba diena, ' . esc_html( $order->get_billing_first_name() ) . ',</p>'
        . '<p>Jūsų užsakymas Nr. ' . $order->get_order_number() . ' gautas. Ačiū! :)</p>'
        . $items_html
        . $bank_html
        . '<br><p>' . $intro . '</p>'
        . '<br><p>Gražios dienų,<br>Petshop.lt komanda<br>+370 681 87787<br>terra@petshop.lt</p>';

    $mailer  = WC()->mailer();
    $wrapped = $mailer->wrap_message( $heading, $message );
    if ( ! empty( $pdf_attachment ) ) {
        $mailer->send( $to, $subject, $wrapped, '', $pdf_attachment );
    } else {
        $mailer->send( $to, $subject, $wrapped );
    }
} );

// ===============================================================
// Statuso pakeitimo hook
// ===============================================================
add_action( 'woocommerce_order_status_changed', function( $order_id, $old_status, $new_status, $order ) {
    if ( ! $order instanceof WC_Order ) {
        $order = wc_get_order( $order_id );
    }
    if ( ! $order ) return;
    $doc_type = petshop_get_invoice_document_type( $order );
    $order->update_meta_data( '_petshop_invoice_document_type', $doc_type );
    $order->delete_meta_data( '_wcdn_invoice_pdf' );
    $order->delete_meta_data( '_wcdn_invoice_pdf_token' );
    $order->save();
}, 1, 4 );

// ===============================================================
// Laiskas #3 - Uzsakymas issiustas
// ===============================================================
function petshop_get_shipping_carrier( $order ) {
    foreach ( $order->get_items( 'shipping' ) as $item ) {
        $method_id = strtolower( $item->get_method_id() ? $item->get_method_id() : '' );
        $name      = strtolower( $item->get_name() ? $item->get_name() : '' );
        $combined  = $method_id . ' ' . $name;
        if ( strpos( $combined, 'venipak' ) !== false ) return 'venipak';
        if ( strpos( $combined, 'lpexpress' ) !== false ||
             strpos( $combined, 'lp_express' ) !== false ||
             strpos( $combined, 'lp express' ) !== false ) return 'lpexpress';
        break;
    }
    return 'unknown';
}

add_action( 'woocommerce_order_status_completed', function( $order_id ) {
    $order = wc_get_order( $order_id );
    if ( ! $order ) return;
    $pdf_file = petshop_generate_invoice_pdf( $order_id );
    if ( $pdf_file && file_exists( $pdf_file ) ) {
        $order->update_meta_data( '_petshop_completed_pdf', $pdf_file );
        $order->save();
    }
}, 5 );

add_filter( 'woocommerce_email_attachments', function( $attachments, $email_id, $order, $email ) {
    if ( $email_id === 'customer_completed_order' && $order instanceof WC_Order ) {
        $pdf_file = $order->get_meta( '_petshop_completed_pdf' );
        if ( $pdf_file && file_exists( $pdf_file ) ) {
            $attachments[] = $pdf_file;
        }
    }
    return $attachments;
}, 10, 4 );

add_action( 'woocommerce_before_template_part', function( $template_name ) {
    if ( strpos( $template_name, 'customer-completed-order' ) !== false ) {
        ob_start();
    }
}, 10 );

add_action( 'woocommerce_after_template_part', function( $template_name, $template_path, $located, $args ) {
    if ( strpos( $template_name, 'customer-completed-order' ) === false ) return;
    ob_end_clean();
    $order = isset( $args['order'] ) ? $args['order'] : null;
    if ( ! $order ) return;

    $first_name    = esc_html( $order->get_billing_first_name() );
    $order_num     = $order->get_order_number();
    // -----------------------------------------------------------------
    // S313 (2026-07-30): TIKRAS siuntos numeris vietoj bendriniu nuorodu.
    //
    // Buvo: dvi nuorodos i BENDRUS paieskos puslapius be numerio — klientas
    // fiziskai negalejo sekti siuntos (patikrinta empiriskai 2026-07-30).
    // Dabar: numeris + tiesiogine nuoroda is Petshop_Event_Emitters::resolve_tracking().
    // VIENA tracking logikos vieta — antros cia NEKURIAM.
    // Jei numerio nera — bloko NERODOM (geriau nieko, nei imituoti funkcionaluma).
    // -----------------------------------------------------------------
    $tracking_html = '';
    $ps_track = class_exists( 'Petshop_Event_Emitters' )
        ? Petshop_Event_Emitters::resolve_tracking( $order )
        : null;

    if ( is_array( $ps_track ) && ! empty( $ps_track['tracking_numbers'] ) ) {

        // S319: uzsakymas gali buti issiustas KELIOMIS siuntomis (skirtingi sandeliai).
        // Rodom visas; jei daugiau nei viena — paaiskinam, kad taip ir turi buti,
        // kitaip klientas nesupranta, kodel numeriu du.
        $ships = ( ! empty( $ps_track['shipments'] ) && is_array( $ps_track['shipments'] ) )
            ? $ps_track['shipments'] : array();
        if ( ! $ships ) {
            $urls_fb = isset( $ps_track['tracking_urls'] ) && is_array( $ps_track['tracking_urls'] ) ? $ps_track['tracking_urls'] : array();
            foreach ( (array) $ps_track['tracking_numbers'] as $n ) {
                $ships[] = array(
                    'carrier_label' => ! empty( $ps_track['carrier_label'] ) ? $ps_track['carrier_label'] : ucfirst( (string) $ps_track['carrier'] ),
                    'number'        => (string) $n,
                    'url'           => isset( $urls_fb[ $n ] ) ? $urls_fb[ $n ] : ( ! empty( $ps_track['tracking_url'] ) ? $ps_track['tracking_url'] : '' ),
                );
            }
        }
        $total = count( $ships );

        $tracking_html  = '<p style="font-size:15px;margin:18px 0 6px;"><strong>Siuntos sekimas</strong></p>';
        if ( $total > 1 ) {
            $tracking_html .= '<p style="font-size:14px;margin:0 0 12px;color:#555;line-height:1.55;">'
                . 'Jūsų užsakymas pristatomas <strong>' . (int) $total . ' atskiromis siuntomis</strong>. '
                . 'Kiekvieną galite sekti atskirai.</p>';
        }

        $i = 0;
        foreach ( $ships as $sp ) {
            $i++;
            $num   = isset( $sp['number'] ) ? (string) $sp['number'] : '';
            $url   = isset( $sp['url'] ) ? $sp['url'] : '';
            $label = isset( $sp['carrier_label'] ) ? $sp['carrier_label'] : '';
            if ( '' === $num ) { continue; }

            $tracking_html .= '<p style="font-size:14px;margin:0 0 10px;line-height:1.6;">';
            if ( $total > 1 ) {
                $tracking_html .= '<span style="color:#555;">Siunta ' . $i . ' iš ' . (int) $total . '</span>';
                if ( $label ) { $tracking_html .= ' <span style="color:#7A867C;">· ' . esc_html( $label ) . '</span>'; }
                $tracking_html .= '<br>';
            } elseif ( $label ) {
                $tracking_html .= '<span style="color:#555;">' . esc_html( $label ) . '</span><br>';
            }
            $tracking_html .= 'Siuntos numeris: <strong>' . esc_html( $num ) . '</strong>';
            if ( $url ) {
                $tracking_html .= '<br><a href="' . esc_url( $url ) . '" style="color:#2d6a35;">Sekti siuntą</a>';
            }
            $tracking_html .= '</p>';
        }
        $tracking_html .= '<div style="height:8px;"></div>';
    }

    $heading = 'Jūsų užsakymas išsiųstas!';
    $message = '<p>Sveiki ' . $first_name . ',</p>'
        . '<p>Jūsų užsakymas <strong>Nr. ' . $order_num . '</strong> išsiųstas ir jau kelyje pas Jus!</p>'
        . $tracking_html
        . '<p>PVM sąskaita faktūra prisegta prie šio laiško.</p>'
        . '<br><p>Ačiū, kad esate su mumis!<br>Petshop.lt komanda<br>+370 681 87787<br>terra@petshop.lt</p>';

    $mailer  = WC()->mailer();
    $wrapped = $mailer->wrap_message( $heading, $message );
    echo $wrapped;
}, 10, 4 );

// ===============================================================
// Laiskas #2 - Apmokejimas gautas - BE saskaitos
// ===============================================================
add_filter( 'woocommerce_email_attachments', 'petshop_remove_invoice_from_processing_email', 9999, 4 );

function petshop_remove_invoice_from_processing_email( $attachments, $email_id, $order, $email ) {
    if ( $email_id !== 'customer_processing_order' ) return $attachments;
    if ( empty( $attachments ) || ! is_array( $attachments ) ) return array();
    $filtered = array();
    foreach ( $attachments as $attachment ) {
        $path     = is_string( $attachment ) ? $attachment : '';
        $basename = $path ? basename( $path ) : '';
        $is_pdf   = ( strtolower( pathinfo( $basename, PATHINFO_EXTENSION ) ) === 'pdf' );
        $is_inv   = ( stripos( $path, '/wcdn/invoice/' ) !== false || stripos( $basename, 'invoice' ) !== false );
        if ( $is_pdf && $is_inv ) continue;
        $filtered[] = $attachment;
    }
    return $filtered;
}

// ===============================================================
// Template buffering - processing ir cancelled laiskai
// ===============================================================
add_action( 'woocommerce_before_template_part', function( $template_name ) {
    if ( strpos( $template_name, 'customer-processing-order' ) !== false ||
         strpos( $template_name, 'customer-cancelled-order' ) !== false ) {
        ob_start();
    }
}, 10 );

add_action( 'woocommerce_after_template_part', function( $template_name ) {
    if ( strpos( $template_name, 'customer-processing-order' ) !== false ) {
        $html = ob_get_clean();
        $html = preg_replace( '/<p[^>]*>[^<]*Just to let you know[^<]*<\/p>/i', '', $html );
        $html = preg_replace( '/<p[^>]*>[^<]*Primename[^<]*<\/p>/i', '', $html );
        echo $html;
    } elseif ( strpos( $template_name, 'customer-cancelled-order' ) !== false ) {
        $html = ob_get_clean();
        $html = preg_replace( '/<p[^>]*>[^<]*We\'re getting in touch[^<]*<\/p>/i', '', $html );
        $html = preg_replace( '/<p[^>]*>[^<]*getting in touch[^<]*<\/p>/i', '', $html );
        echo $html;
    }
}, 10 );

// ===============================================================
// Grazinimo laiskas - lietuviskas turinys
// ===============================================================
add_action( 'woocommerce_before_template_part', function( $template_name ) {
    if ( strpos( $template_name, 'customer-refunded-order' ) !== false ||
         strpos( $template_name, 'customer-partially-refunded' ) !== false ) {
        ob_start();
    }
}, 10 );

add_action( 'woocommerce_after_template_part', function( $template_name, $template_path, $located, $args ) {
    if ( strpos( $template_name, 'customer-refunded-order' ) === false &&
         strpos( $template_name, 'customer-partially-refunded' ) === false ) return;
    ob_end_clean();
    $order = isset( $args['order'] ) ? $args['order'] : null;
    if ( ! $order ) return;

    $first_name = esc_html( $order->get_billing_first_name() );
    $order_num  = $order->get_order_number();
    $is_partial = strpos( $template_name, 'partial' ) !== false;
    $heading    = $is_partial
        ? 'Dalinis grąžinimas: Užsakymas ' . $order_num
        : 'Grąžinimas: Užsakymas ' . $order_num;

    $message = '<p>Sveiki ' . $first_name . ',</p>'
        . '<p>' . ( $is_partial
            ? 'Jūsų užsakymo <strong>Nr. ' . $order_num . '</strong> dalis buvo grąžinta.'
            : 'Jūsų užsakymas <strong>Nr. ' . $order_num . '</strong> buvo grąžintas.' )
        . '</p>'
        . '<p>Grąžinimo suma bus pervesta per 3–5 darbo dienas.</p>'
        . '<br><p>Jei turite klausimu - susisiekite:<br>terra@petshop.lt | +370 681 87787</p>'
        . '<br><p>Petshop.lt komanda</p>';

    $mailer  = WC()->mailer();
    $wrapped = $mailer->wrap_message( $heading, $message );
    echo $wrapped;
}, 10, 4 );

// ===============================================================
// WCDN nuorodu salinimas is processing ir admin laisku
// ===============================================================
add_action( 'woocommerce_email_before_order_table', function( $order, $sent_to_admin, $plain_text, $email ) {
    if ( in_array( $email->id, array( 'customer_processing_order', 'new_order' ), true ) ) {
        remove_all_actions( 'woocommerce_email_after_order_table' );
        remove_all_actions( 'wcdn_email_document_links' );
    }
}, 1, 4 );

// ===============================================================
// Admin laiskas - pasalinti broken logo
// ===============================================================
add_action( 'woocommerce_email_header', function( $heading, $email ) {
    if ( isset( $email->id ) ) {
        $GLOBALS['wc_current_email_id'] = $email->id;
    }
}, 1, 2 );


// ===============================================================
// S313: laisku logotipas — dinamiskai pagal attachment ID.
// Buvo issaugotas ABSOLIUTUS 'https://petshop.lt/...' URL, kuris
// (a) http:// ir (b) po domeno migracijos nustotu veikti.
// wp_get_attachment_image_url() visada duoda teisinga dabartini domena/schema.
// ===============================================================
if ( ! defined( 'PETSHOP_EMAIL_LOGO_ID' ) ) {
    define( 'PETSHOP_EMAIL_LOGO_ID', 3257 );
}
add_filter( 'option_woocommerce_email_header_image', function( $value ) {
    $dynamic = wp_get_attachment_image_url( PETSHOP_EMAIL_LOGO_ID, 'full' );
    return $dynamic ? $dynamic : $value;
}, 5 );

add_filter( 'option_woocommerce_email_header_image', function( $value ) {
    if ( isset( $GLOBALS['wc_current_email_id'] ) && $GLOBALS['wc_current_email_id'] === 'new_order' ) {
        return '';
    }
    return $value;
} );

// ===============================================================
// Nr. vietoj simbolio visuose laiskulse
// ===============================================================
add_filter( 'woocommerce_email_subject_new_order',                 'petshop_fix_order_nr_in_subject', 10 );
add_filter( 'woocommerce_email_subject_customer_processing_order', 'petshop_fix_order_nr_in_subject', 10 );
add_filter( 'woocommerce_email_subject_customer_completed_order',  'petshop_fix_order_nr_in_subject', 10 );
add_filter( 'woocommerce_email_subject_customer_on_hold_order',    'petshop_fix_order_nr_in_subject', 10 );
add_filter( 'woocommerce_email_subject_customer_invoice',          'petshop_fix_order_nr_in_subject', 10 );

function petshop_fix_order_nr_in_subject( $subject ) {
    return str_replace( "\xE2\x84\x96", 'Nr.', $subject );
}

// ===============================================================
// Checkout laukų konfiguracija
// ===============================================================
add_filter( 'woocommerce_checkout_fields', function( $fields ) {
    if ( isset( $fields['billing']['billing_state'] ) ) {
        $fields['billing']['billing_state']['label']       = 'Savivaldyb' . "\xC4\x97" . ' / Rajonas';
        $fields['billing']['billing_state']['placeholder'] = 'U' . "\xC5\xBE" . 'pildoma automatiskai';
        $fields['billing']['billing_state']['required']    = false;
    }
    if ( isset( $fields['shipping']['shipping_state'] ) ) {
        $fields['shipping']['shipping_state']['label']       = 'Savivaldyb' . "\xC4\x97" . ' / Rajonas';
        $fields['shipping']['shipping_state']['placeholder'] = 'U' . "\xC5\xBE" . 'pildoma automatiskai';
        $fields['shipping']['shipping_state']['required']    = false;
    }
    if ( isset( $fields['billing']['billing_phone'] ) ) {
        $fields['billing']['billing_phone']['placeholder'] = '+370 6XX XXXXX';
    }
    if ( isset( $fields['billing']['billing_address_2'] ) ) {
        $fields['billing']['billing_address_2']['placeholder'] = 'Butas, korpusas (nebutinas)';
        $fields['billing']['billing_address_2']['required']    = false;
    }
    return $fields;
} );

add_filter( 'woocommerce_order_formatted_billing_address', function( $address ) {
    if ( isset( $address['state'] ) ) {
        $skip = array( 'pasirinkite rajona', 'select a region', 'select an option', '' );
        if ( in_array( mb_strtolower( trim( $address['state'] ) ), $skip, true ) ) {
            unset( $address['state'] );
        }
    }
    return $address;
} );

add_filter( 'woocommerce_order_formatted_shipping_address', function( $address ) {
    if ( isset( $address['state'] ) ) {
        $skip = array( 'pasirinkite rajona', 'select a region', 'select an option', '' );
        if ( in_array( mb_strtolower( trim( $address['state'] ) ), $skip, true ) ) {
            unset( $address['state'] );
        }
    }
    return $address;
} );

add_filter( 'woocommerce_localisation_address_formats', function( $formats ) {
    $formats['LT'] = "{name}\n{company}\n{address_1}\n{address_2}\n{city}\n{state}\n{postcode}\n{country}";
    return $formats;
} );

// ===============================================================
// Telefono validacija
// ===============================================================
add_action( 'woocommerce_checkout_process', function() {
    $phone = isset( $_POST['billing_phone'] ) ? sanitize_text_field( $_POST['billing_phone'] ) : '';
    if ( empty( $phone ) ) return;
    $clean = preg_replace( '/[\s\-\(\)\.]+/', '', $phone );
    $valid = preg_match( '/^(\+3706\d{7}|86\d{7}|06\d{7})$/', $clean );
    if ( ! $valid ) {
        wc_add_notice( 'Iveskite teisingą Lietuvos telefono numeri (pvz., +370 612 34567 arba 861234567).', 'error' );
    }
} );

add_filter( 'woocommerce_process_checkout_field_billing_phone', function( $phone ) {
    $clean = preg_replace( '/[\s\-\(\)\.]+/', '', $phone );
    if ( preg_match( '/^86(\d{7})$/', $clean, $m ) ) return '+3706' . $m[1];
    if ( preg_match( '/^06(\d{7})$/', $clean, $m ) ) return '+3706' . $m[1];
    return $clean;
} );


// ===============================================================
// Checkout: pastomatas - slept adreso laukus + terminal blokai
// ===============================================================

function petshop_is_parcel_terminal( $value ) {
    if ( empty( $value ) ) return false;
    $value    = strtolower( (string) $value );
    $patterns = array(
        'woo_lithuaniapost_lpexpress_terminal',
        'lpexpress_terminal',
        'lp_express_terminal',
        'shopup_venipak_shipping_pickup_method',
        'venipak_pickup',
        'venipak_terminal',
        'omniva_terminal',
        'dpd_pudo',
    );
    foreach ( $patterns as $p ) {
        if ( strpos( $value, strtolower( $p ) ) !== false ) return true;
    }
    return false;
}

function petshop_post_has_parcel_terminal() {
    if ( empty( $_POST['shipping_method'] ) ) return false;
    $methods = wc_clean( wp_unslash( $_POST['shipping_method'] ) );
    if ( is_array( $methods ) ) {
        foreach ( $methods as $m ) {
            if ( petshop_is_parcel_terminal( $m ) ) return true;
        }
    }
    if ( is_string( $methods ) && petshop_is_parcel_terminal( $methods ) ) return true;
    return false;
}

// PHP: adreso laukai neprivalomi kai pastomatas
add_filter( 'woocommerce_checkout_fields', 'petshop_address_optional_for_parcel', 20 );
function petshop_address_optional_for_parcel( $fields ) {
    if ( ! petshop_post_has_parcel_terminal() ) return $fields;
    $skip = array( 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_postcode', 'billing_state',
                   'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_postcode', 'shipping_state' );
    foreach ( $skip as $key ) {
        if ( isset( $fields['billing'][ $key ] ) )  $fields['billing'][ $key ]['required']  = false;
        if ( isset( $fields['shipping'][ $key ] ) ) $fields['shipping'][ $key ]['required'] = false;
    }
    return $fields;
}

// CSS
add_action( 'wp_head', 'petshop_checkout_shipping_fix_css' );
function petshop_checkout_shipping_fix_css() {
    if ( ! is_checkout() ) return;
    ?>
    <style>
    body.petshop-parcel-terminal-selected #ship-to-different-address,
    body.petshop-parcel-terminal-selected .shipping_address,
    body.petshop-parcel-terminal-selected #billing_address_1_field,
    body.petshop-parcel-terminal-selected #billing_address_2_field,
    body.petshop-parcel-terminal-selected #billing_city_field,
    body.petshop-parcel-terminal-selected #billing_postcode_field,
    body.petshop-parcel-terminal-selected #billing_state_field {
        display: none !important;
    }

    .woocommerce-checkout #shipping_method li {
        position: relative !important;
        display: block !important;
        margin: 0 0 10px 0 !important;
        padding: 12px 0 12px 36px !important;
        border-bottom: 1px solid #f1f1f1 !important;
        clear: both !important;
        min-height: 36px;
    }
    .woocommerce-checkout #shipping_method li > input[type="radio"],
    .woocommerce-checkout #shipping_method li input[type="radio"] {
        position: absolute !important;
        left: 0 !important;
        top: 16px !important;
        margin: 0 !important;
    }
    .woocommerce-checkout #shipping_method li > label,
    .woocommerce-checkout #shipping_method li label {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        line-height: 1.35 !important;
        float: none !important;
    }

    .woocommerce-checkout #shipping_method li.petshop-selected-shipping label select,
    .woocommerce-checkout #shipping_method li.petshop-selected-shipping label .select2-container {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 10px 0 0 0 !important;
        clear: both !important;
        float: none !important;
    }

    .woocommerce-checkout #shipping_method li.petshop-selected-shipping > select,
    .woocommerce-checkout #shipping_method li.petshop-selected-shipping > .select2-container,
    .woocommerce-checkout #shipping_method li.petshop-selected-shipping .petshop-terminal-wrapper select,
    .woocommerce-checkout #shipping_method li.petshop-selected-shipping .petshop-terminal-wrapper .select2-container {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 10px 0 0 0 !important;
        clear: both !important;
        float: none !important;
    }

    .woocommerce-checkout #shipping_method li.petshop-selected-shipping .wc-venipak-shipping-terminals,
    .woocommerce-checkout #shipping_method li.petshop-selected-shipping .petshop-terminal-wrapper {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 12px 0 0 0 !important;
        padding: 0 !important;
        clear: both !important;
        float: none !important;
    }
    .woocommerce-checkout .wc-venipak-shipping-terminals label {
        display: block !important;
        width: 100% !important;
        margin: 0 0 8px 0 !important;
        padding: 0 !important;
    }
    .woocommerce-checkout .wc-venipak-shipping-terminals select {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
    }

    .woocommerce-checkout .wc-venipak-shipping-terminals iframe,
    .woocommerce-checkout .wc-venipak-shipping-terminals .gm-style,
    .woocommerce-checkout .wc-venipak-shipping-terminals [id*="map"],
    .woocommerce-checkout .wc-venipak-shipping-terminals [class*="map"],
    .woocommerce-checkout .wc-venipak-shipping-terminals .venipak-map,
    .woocommerce-checkout .wc-venipak-shipping-terminals .venipak-terminals-map,
    .woocommerce-checkout .wc-venipak-shipping-terminals .terminal-map {
        display: none !important;
        height: 0 !important;
        overflow: hidden !important;
    }
    .woocommerce-checkout .wc-venipak-shipping-terminals > div:empty {
        display: none !important;
    }
    </style>
    <?php
}

// JS
add_action( 'wp_footer', 'petshop_checkout_shipping_fix_js', 99 );
function petshop_checkout_shipping_fix_js() {
    if ( ! is_checkout() ) return;
    ?>
    <script>
    jQuery(function($) {
        var PASTOMATAS_PATTERNS = [
            'woo_lithuaniapost_lpexpress_terminal',
            'lpexpress_terminal',
            'lp_express_terminal',
            'shopup_venipak_shipping_pickup_method',
            'venipak_pickup',
            'venipak_terminal',
            'omniva_terminal',
            'dpd_pudo'
        ];

        var HIDE_FIELDS = [
            '#ship-to-different-address',
            '.shipping_address',
            '#billing_address_1_field',
            '#billing_address_2_field',
            '#billing_city_field',
            '#billing_postcode_field',
            '#billing_state_field'
        ];

        function isPastomatas(value) {
            if (!value) return false;
            value = value.toString().toLowerCase();
            for (var i = 0; i < PASTOMATAS_PATTERNS.length; i++) {
                if (value.indexOf(PASTOMATAS_PATTERNS[i]) !== -1) return true;
            }
            return false;
        }

        function isVenipakPickup(value) {
            if (!value) return false;
            value = value.toString().toLowerCase();
            return value.indexOf('shopup_venipak_shipping_pickup_method') !== -1 ||
                   value.indexOf('venipak_pickup') !== -1 ||
                   value.indexOf('venipak_terminal') !== -1;
        }

        function getSelectedShippingMethod() {
            var s = $('input[name^="shipping_method"]:checked').val();
            if (!s) s = $('select[name^="shipping_method"]').val();
            return s || '';
        }

        function markSelectedShippingLi() {
            $('#shipping_method li').removeClass('petshop-selected-shipping');
            var $li = $('input[name^="shipping_method"]:checked').closest('li');
            if ($li.length) $li.addClass('petshop-selected-shipping');
            return $li;
        }

        function moveTerminalBlocks() {
            var selected = getSelectedShippingMethod();
            var $selectedLi = markSelectedShippingLi();
            if (!$selectedLi.length) return;

            var $venipak = $('.wc-venipak-shipping-terminals').first();
            if ($venipak.length && isVenipakPickup(selected)) {
                if (!$venipak.parent().is($selectedLi)) {
                    $selectedLi.append($venipak);
                }
                $venipak.addClass('petshop-terminal-wrapper').show();
            }
        }

        function applyShippingUI() {
            var selected = getSelectedShippingMethod();
            var isParcel = isPastomatas(selected);

            $('body').toggleClass('petshop-parcel-terminal-selected', isParcel);
            $('body').toggleClass('pastomatas-selected', isParcel);

            var $fields = $(HIDE_FIELDS.join(','));

            if (isParcel) {
                var $cb = $('#ship-to-different-address-checkbox');
                if ($cb.length && $cb.prop('checked')) {
                    $cb.prop('checked', false).trigger('change');
                }
                $fields.hide();
                $('#billing_address_1, #billing_address_2, #billing_city, #billing_postcode, #billing_state')
                    .prop('required', false).removeAttr('required')
                    .closest('.form-row')
                    .removeClass('validate-required woocommerce-invalid woocommerce-invalid-required-field');
            } else {
                $fields.show();
                $('#billing_address_1, #billing_city, #billing_postcode').prop('required', true);
            }
        }

        function runCheckoutFixes() {
            applyShippingUI();
            moveTerminalBlocks();
        }

        function scheduleUpdate() {
            runCheckoutFixes();
            setTimeout(runCheckoutFixes, 50);
            setTimeout(runCheckoutFixes, 150);
            setTimeout(runCheckoutFixes, 400);
            setTimeout(runCheckoutFixes, 800);
        }

        $(document).on('change', 'input[name^="shipping_method"], select[name^="shipping_method"]', scheduleUpdate);
        $(document.body).on('init_checkout updated_checkout updated_shipping_method wc_fragments_refreshed', scheduleUpdate);
        scheduleUpdate();

        if (window.MutationObserver) {
            var checkout = document.querySelector('form.checkout');
            if (checkout) {
                var busy = false;
                new MutationObserver(function() {
                    if (busy) return;
                    busy = true;
                    setTimeout(function() { runCheckoutFixes(); busy = false; }, 80);
                }).observe(checkout, { childList: true, subtree: true });
            }
        }
    });
    </script>
    <?php
}

// ===============================================================
// [PASALINTA 2026-08-28] "Papildykite krepšelį" (petshop_cart_crosssell v1.2
// + petshop_crosssell_css) perkelta i petshop-fbt v1.5.2 krepselio bloka:
// AV Source sluoksnis + jautrumo (baltymu) filtras + -10% nuolaida.
// Backup: uploads/ps-backups/functions.php.bak_*
// ===============================================================

// ===============================================================
// Krepselis: slept pristatymo metodus, rodyti zinute
// Pristatymo kaina nerodyti krepselyje
// ===============================================================

add_action( 'woocommerce_before_cart', function() {
    if ( ! is_cart() ) return;
    WC()->session->set( 'chosen_shipping_methods', array() );
    WC()->cart->calculate_totals();
} );

add_action( 'wp_head', 'petshop_cart_shipping_css' );
function petshop_cart_shipping_css() {
    if ( ! is_cart() ) return;
    ?>
    <style>
    .cart-collaterals .shipping-calculator-form,
    .cart-collaterals .woocommerce-shipping-methods,
    .cart-collaterals .woocommerce-shipping-calculator,
    .cart-collaterals .woocommerce-shipping-destination,
    .cart-totals .woocommerce-shipping-totals,
    tr.shipping,
    tr.order-total {
        display: none !important;
    }
    tr.cart-subtotal td .amount {
        font-weight: bold;
        font-size: 1em;
    }
    .petshop-shipping-notice {
        display: block;
        margin: 8px 0 4px;
        color: #666;
        font-size: 14px;
        font-style: italic;
    }
    </style>
    <?php
}

add_action( 'woocommerce_cart_totals_before_shipping', 'petshop_cart_shipping_notice' );
function petshop_cart_shipping_notice() {
    if ( ! is_cart() ) return;
    echo '<span class="petshop-shipping-notice">Pristatymo būdą pasirinksite kitame žingsnyje.</span>';
}

// ===============================================================
// Checkout: aiski sumu suvestine
// ===============================================================

add_action( 'wp_head', 'petshop_checkout_totals_css' );
function petshop_checkout_totals_css() {
    if ( ! is_checkout() ) return;
    ?>
    <style>
    .woocommerce-checkout-review-order-table tfoot tr.cart-subtotal,
    .woocommerce-checkout-review-order-table tfoot tr.cart-discount,
    .woocommerce-checkout-review-order-table tfoot tr.tax-rate,
    .woocommerce-checkout-review-order-table tfoot tr.tax-total,
    .woocommerce-checkout-review-order-table tfoot tr.fee {
        display: none !important;
    }
    .woocommerce-checkout-review-order-table tfoot tr.order-total .includes_tax {
        display: none !important;
    }
    .woocommerce-checkout-review-order-table tfoot tr.petshop-total-row th,
    .woocommerce-checkout-review-order-table tfoot tr.petshop-total-row td {
        padding: 6px 0 !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        border-top: 1px solid #eee !important;
    }
    .woocommerce-checkout-review-order-table tfoot tr.petshop-total-row td {
        text-align: right !important;
    }
    .woocommerce-checkout-review-order-table tfoot tr.petshop-total-row.petshop-products-ex-vat th,
    .woocommerce-checkout-review-order-table tfoot tr.petshop-total-row.petshop-products-ex-vat td {
        padding-top: 12px !important;
        border-top: 2px solid #333 !important;
    }
    .woocommerce-checkout-review-order-table tfoot tr.petshop-total-row.petshop-discount th,
    .woocommerce-checkout-review-order-table tfoot tr.petshop-total-row.petshop-discount td {
        color: #2d6a35 !important;
    }
    .woocommerce-checkout-review-order-table tfoot tr.petshop-total-row.petshop-vat-row th,
    .woocommerce-checkout-review-order-table tfoot tr.petshop-total-row.petshop-vat-row td {
        color: #555 !important;
    }
    .woocommerce-checkout-review-order-table tfoot tr.order-total th,
    .woocommerce-checkout-review-order-table tfoot tr.order-total td {
        padding-top: 10px !important;
        border-top: 2px solid #333 !important;
        font-size: 18px !important;
        font-weight: 700 !important;
    }
    /* v2 (2026-06-11): fee eilute VIRSUJE prie produktu */
    .woocommerce-checkout-review-order-table .petshop-fee-top-row td {
        font-size: 14px !important;
        border-bottom: 1px solid #eee !important;
    }
    </style>
    <?php
}

// ===============================================================
// Checkout: mazo krepselio mokestis VIRSUJE (prie produktu, su PVM)
// v2 (2026-06-11): fee rodomas dviejose vietose su aiskia logika:
//   - VIRSUJE (po produktu, pries pristatyma): SU PVM (pvz. 1,21) —
//     klientas iskart mato realia kaina, kaip ir produktai.
//   - APACIOJE (suvestineje): BE PVM (pvz. 1,00) — nuoseklu su
//     "Suma be PVM" ir "Pristatymo mokestis"; fee PVM (0,21)
//     iskaiciuotas i "PVM 21%" eilute.
// ===============================================================
add_action( 'woocommerce_review_order_after_cart_contents', 'petshop_checkout_fee_top_row', 10 );
function petshop_checkout_fee_top_row() {
    if ( ! is_checkout() || ! WC()->cart ) return;
    foreach ( WC()->cart->get_fees() as $fee ) {
        $fee_incl_vat = (float) $fee->total + (float) $fee->tax; // su PVM
        ?>
        <tr class="petshop-fee-top-row">
            <td><?php echo esc_html( $fee->name ); ?></td>
            <td style="text-align:right;"><?php echo wp_kses_post( wc_price( $fee_incl_vat ) ); ?></td>
        </tr>
        <?php
    }
}

add_action( 'woocommerce_review_order_before_order_total', 'petshop_checkout_custom_totals_rows', 20 );
function petshop_checkout_custom_totals_rows() {
    if ( ! is_checkout() || ! WC()->cart ) return;

    $cart = WC()->cart;

    $products_ex_vat = 0;
    foreach ( $cart->get_cart() as $cart_item ) {
        if ( isset( $cart_item['line_total'] ) ) {
            $products_ex_vat += (float) $cart_item['line_total'];
        }
    }

    $discount_ex_vat  = (float) $cart->get_discount_total();
    $discount_tax     = (float) $cart->get_discount_tax();
    $discount_inc_vat = $discount_ex_vat + $discount_tax;

    $shipping_ex_vat = (float) $cart->get_shipping_total();

    $vat_total = (float) $cart->get_cart_contents_tax()
               + (float) $cart->get_shipping_tax()
               + (float) $cart->get_fee_tax();
    ?>
    <tr class="petshop-total-row petshop-products-ex-vat">
        <th>Suma be PVM</th>
        <td><?php echo wp_kses_post( wc_price( $products_ex_vat ) ); ?></td>
    </tr>
    <?php if ( $discount_inc_vat > 0 ) : ?>
    <tr class="petshop-total-row petshop-discount">
        <th>Nuolaida</th>
        <td>-<?php echo wp_kses_post( wc_price( $discount_inc_vat ) ); ?></td>
    </tr>
    <?php endif; ?>
    <?php foreach ( $cart->get_fees() as $fee ) :
        // v2 (2026-06-11): suvestineje fee rodomas BE PVM (buvo: total + tax).
        // Nuoseklu su "Suma be PVM" ir "Pristatymo mokestis" eilutemis;
        // fee PVM iskaiciuotas zemiau i "PVM 21%".
        $fee_amount = (float) $fee->total; ?>
    <tr class="petshop-total-row petshop-fees">
        <th><?php echo esc_html( $fee->name ); ?></th>
        <td><?php echo wp_kses_post( wc_price( $fee_amount ) ); ?></td>
    </tr>
    <?php endforeach; ?>
    <tr class="petshop-total-row petshop-shipping-row">
        <th>Pristatymo mokestis</th>
        <td><?php echo $shipping_ex_vat > 0 ? wp_kses_post( wc_price( $shipping_ex_vat ) ) : '0,00 &euro;'; ?></td>
    </tr>
    <tr class="petshop-total-row petshop-vat-row">
        <th>PVM 21%</th>
        <td><?php echo wp_kses_post( wc_price( $vat_total ) ); ?></td>
    </tr>
    <?php
}

// ===============================================================
// Checkout: "Perku kaip imone" + imones laukai
// ===============================================================

add_filter( 'woocommerce_checkout_fields', 'petshop_add_company_fields', 30 );
function petshop_add_company_fields( $fields ) {
    $fields['billing']['billing_is_company'] = array(
        'type'     => 'hidden',
        'required' => false,
        'default'  => '0',
        'priority' => 34,
    );
    $fields['billing']['billing_company'] = array(
        'label'    => 'Įmonės pavadinimas',
        'required' => false,
        'class'    => array( 'form-row-wide', 'petshop-company-field' ),
        'priority' => 35,
    );
    if ( isset( $fields['shipping']['shipping_company'] ) ) {
        unset( $fields['shipping']['shipping_company'] );
    }
    $fields['billing']['billing_vat_code'] = array(
        'label'       => 'PVM mokėtojo kodas (nebūtinas)',
        'placeholder' => 'LT123456789',
        'required'    => false,
        'class'       => array( 'form-row-first', 'petshop-company-field' ),
        'priority'    => 36,
    );
    $fields['billing']['billing_company_code'] = array(
        'label'       => 'Įmonės kodas',
        'placeholder' => '123456789',
        'required'    => false,
        'class'       => array( 'form-row-last', 'petshop-company-field' ),
        'priority'    => 37,
    );
    $fields['billing']['billing_company_address'] = array(
        'label'       => 'Įmonės registracijos adresas',
        'placeholder' => 'Gatvė, miestas, pašto kodas',
        'required'    => false,
        'class'       => array( 'form-row-wide', 'petshop-company-field' ),
        'priority'    => 38,
    );
    return $fields;
}

add_action( 'woocommerce_checkout_create_order', 'petshop_save_company_fields_to_order', 20, 2 );
function petshop_save_company_fields_to_order( $order, $data ) {
    $is_company = isset( $_POST['billing_is_company'] )
        && wc_clean( wp_unslash( $_POST['billing_is_company'] ) ) === '1';

    if ( $is_company ) {
        $order->update_meta_data( '_billing_is_company', '1' );
    } else {
        $order->delete_meta_data( '_billing_is_company' );
    }

    $custom_fields = array( 'billing_vat_code', 'billing_company_code', 'billing_company_address' );
    foreach ( $custom_fields as $field ) {
        if ( isset( $_POST[ $field ] ) && $_POST[ $field ] !== '' ) {
            $order->update_meta_data( '_' . $field, sanitize_text_field( wp_unslash( $_POST[ $field ] ) ) );
        } else {
            $order->delete_meta_data( '_' . $field );
        }
    }
}

add_action( 'woocommerce_admin_order_data_after_billing_address', 'petshop_display_company_fields_admin' );
function petshop_display_company_fields_admin( $order ) {
    $vat     = $order->get_meta( '_billing_vat_code' );
    $code    = $order->get_meta( '_billing_company_code' );
    $address = $order->get_meta( '_billing_company_address' );
    if ( $vat )     echo '<p><strong>PVM kodas:</strong> ' . esc_html( $vat ) . '</p>';
    if ( $code )    echo '<p><strong>Įmonės kodas:</strong> ' . esc_html( $code ) . '</p>';
    if ( $address ) echo '<p><strong>Įmonės adresas:</strong> ' . esc_html( $address ) . '</p>';
}

add_action( 'woocommerce_checkout_process', 'petshop_validate_company_fields' );
function petshop_validate_company_fields() {
    $is_company = isset( $_POST['billing_is_company'] )
        && wc_clean( wp_unslash( $_POST['billing_is_company'] ) ) === '1';
    if ( ! $is_company ) return;

    $required = array(
        'billing_company'         => 'Įmonės pavadinimas',
        'billing_company_code'    => 'Įmonės kodas',
        'billing_company_address' => 'Įmonės registracijos adresas',
    );
    foreach ( $required as $field => $label ) {
        if ( empty( $_POST[ $field ] ) ) {
            wc_add_notice( $label . ' yra privalomas perkantiems kaip įmonę.', 'error' );
        }
    }
}

add_action( 'wp_head', 'petshop_company_fields_css' );
function petshop_company_fields_css() {
    if ( ! is_checkout() ) return;
    ?>
    <style>
    .petshop-company-toggle {
        margin: 16px 0 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 15px;
    }
    .petshop-company-toggle input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
    }
    #billing_company_field .optional,
    #billing_vat_code_field .optional,
    #billing_company_code_field .optional,
    #billing_company_address_field .optional {
        display: none !important;
    }
    #shipping_company_field {
        display: none !important;
    }
    #billing_company_field label::after,
    #billing_company_code_field label::after,
    #billing_company_address_field label::after {
        content: ' *';
        color: red;
    }
    .petshop-company-field {
        display: none !important;
    }
    .petshop-company-fields-active .petshop-company-field {
        display: block !important;
    }
    .petshop-company-wrapper {
        background: #f9f9f9;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        padding: 16px 16px 4px;
        margin-bottom: 16px;
        display: none;
    }
    .petshop-company-fields-active .petshop-company-wrapper {
        display: block;
    }
    </style>
    <?php
}

add_action( 'wp_footer', 'petshop_company_fields_js', 99 );
function petshop_company_fields_js() {
    if ( ! is_checkout() ) return;
    ?>
    <script>
    jQuery(function($) {
        function initCompanyFields() {
            var $companyName = $('#billing_company_field');
            var $vatField    = $('#billing_vat_code_field');
            var $codeField   = $('#billing_company_code_field');
            var $addrField   = $('#billing_company_address_field');
            var $hidden      = $('#billing_is_company');

            if ( ! $companyName.length || ! $hidden.length ) return;

            if ( ! $('.petshop-company-toggle').length ) {
                var $toggle = $('<label class="petshop-company-toggle"><input type="checkbox" id="billing_is_company_check"> Perkate kaip įmonė?</label>');
                $companyName.before($toggle);
            }

            if ( ! $companyName.parent().hasClass('petshop-company-wrapper') ) {
                var $wrapper = $('<div class="petshop-company-wrapper"></div>');
                $companyName.wrap($wrapper);
                var $w = $companyName.parent();
                $w.append($vatField).append($codeField).append($addrField);
            }

            function toggleCompany(show) {
                var $w = $('#billing_company_field').parent('.petshop-company-wrapper');
                if ( show ) {
                    $('body').addClass('petshop-company-fields-active');
                    $w.show();
                    $hidden.val('1');
                } else {
                    $('body').removeClass('petshop-company-fields-active');
                    $w.hide();
                    $hidden.val('0');
                    $('#billing_company, #billing_vat_code, #billing_company_code, #billing_company_address').val('');
                }
            }

            var checked = $hidden.val() === '1' || $('#billing_company').val().length > 0;

            $('#billing_is_company_check')
                .prop('checked', checked)
                .off('change.petshopCompany')
                .on('change.petshopCompany', function() {
                    toggleCompany($(this).is(':checked'));
                });

            toggleCompany(checked);
        }

        initCompanyFields();

        $(document.body).on('updated_checkout init_checkout', function() {
            setTimeout(initCompanyFields, 50);
            setTimeout(initCompanyFields, 250);
        });
    });
    </script>
    <?php
}

// ===============================================================
// Krepšelio ikona header'yje — vežimėlis 2.5 stilius
// ===============================================================
add_action( 'wp_head', 'petshop_cart_icon_css' );
function petshop_cart_icon_css() {
    ?>
    <style>
    /* Krepšelio link'as — ikona kairėje, tekstas dešinėje */
    a.header-cart-link {
        display: inline-flex !important;
        flex-direction: row-reverse !important;
        align-items: center !important;
        gap: 10px !important;
        text-decoration: none !important;
    }

    /* Ikona — vežimėlis SVG */
    .cart-icon.image-icon {
        position: relative !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 28px !important;
        height: 28px !important;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 24 24' fill='none' stroke='%23365a51' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='9' cy='21' r='1'/%3E%3Ccircle cx='20' cy='21' r='1'/%3E%3Cpath d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'/%3E%3C/svg%3E") !important;
        background-repeat: no-repeat !important;
        background-size: 24px 24px !important;
        background-position: center !important;
        border: none !important;
        background-color: transparent !important;
    }

    /* Slėpti visus vaikinus elementus išskyrus strong */
    .cart-icon.image-icon > *:not(strong) {
        display: none !important;
    }

    /* Badge — žalias */
    .cart-icon.image-icon strong {
        position: absolute !important;
        top: -6px !important;
        right: -8px !important;
        background: #365a51 !important;
        color: #fff !important;
        font-size: 10px !important;
        font-weight: 500 !important;
        min-width: 17px !important;
        height: 17px !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        line-height: 1 !important;
        padding: 0 2px !important;
        border: none !important;
        box-shadow: none !important;
    }

    /* Teksto blokas */
    span.header-cart-title {
        display: flex !important;
        flex-direction: column !important;
        line-height: 1.25 !important;
        text-align: left !important;
    }
    </style>
    <?php
}
// ===============================================================
// Teksto pataisymai — checkout prisijungimo forma
// ===============================================================
add_filter( 'gettext', 'petshop_fix_checkout_texts', 20, 3 );
function petshop_fix_checkout_texts( $translated, $text, $domain ) {
    if ( ! is_checkout() ) return $translated;

    $replacements = array(
        'If you have shopped with us before, please enter your details below. If you are a new customer, please proceed to the Billing section.'
            => 'Jei jau esate pirkęs pas mus, įveskite savo duomenis žemiau. Jei esate naujas pirkėjas, eikite į skiltį „Pirkėjo duomenys".',
        'Returning customer? Click here to login'
            => 'Registruotas pirkėjas? Prisijunkite čia',
        'Lost your password?'
            => 'Pamiršote slaptažodį?',
    );

    if ( isset( $replacements[ $text ] ) ) {
        return $replacements[ $text ];
    }

    return $translated;
}

// ===============================================================
add_action( 'wp_head', 'petshop_font_fix', 1 );
function petshop_font_fix() {
    ?>
    <style>
    html, body, input, textarea, select, button,
    .woocommerce, .woocommerce-page, p, h1, h2, h3, h4, span, label, td, th {
        font-family: "Open Sans", Arial, "Helvetica Neue", sans-serif !important;
    }
    </style>
    <?php
}

// ===============================================================
// Checkout: "Sukurti paskyrą?" checkbox pažymėtas pagal nutylėjimą
// ===============================================================
add_action( 'wp_footer', 'petshop_account_checkbox_default', 99 );
function petshop_account_checkbox_default() {
    if ( ! is_checkout() ) return;
    if ( is_user_logged_in() ) return;
    ?>
    <script>
    jQuery(function($) {
        function checkAccountBox() {
            var $cb = $('#createaccount');
            if ( $cb.length && ! $cb.prop('checked') ) {
                $cb.prop('checked', true).trigger('change');
            }
        }
        checkAccountBox();
        $(document.body).on('updated_checkout', checkAccountBox);
    });
    </script>
    <?php
}

// ===============================================================
// Checkout: slept shipping laukus kai "Siusti kitu adresu?" nepazymeta
// ===============================================================
add_action( 'wp_head', 'petshop_hide_shipping_when_not_needed_css' );
function petshop_hide_shipping_when_not_needed_css() {
    if ( ! is_checkout() ) return;
    ?>
    <style>
    body:not(.petshop-ship-to-different-selected) .shipping_address,
    body:not(.petshop-ship-to-different-selected) #shipping_first_name_field,
    body:not(.petshop-ship-to-different-selected) #shipping_last_name_field,
    body:not(.petshop-ship-to-different-selected) #shipping_company_field {
        display: none !important;
    }
    </style>
    <?php
}

add_action( 'wp_footer', 'petshop_ship_to_different_toggle_js', 100 );
function petshop_ship_to_different_toggle_js() {
    if ( ! is_checkout() ) return;
    ?>
    <script>
    jQuery(function($) {
        function updateShipToDifferent() {
            var checked = $('#ship-to-different-address-checkbox').is(':checked');
            $('body').toggleClass('petshop-ship-to-different-selected', checked);
            if ( ! checked ) {
                $('.shipping_address').hide();
            } else {
                $('.shipping_address').show();
            }
        }

        $(document).on('change', '#ship-to-different-address-checkbox', updateShipToDifferent);
        $(document.body).on('init_checkout updated_checkout', function() {
            setTimeout(updateShipToDifferent, 50);
            setTimeout(updateShipToDifferent, 250);
        });
        updateShipToDifferent();
    });
    </script>
    <?php
}


/* Petshop Homepage Populiarios prekes modulis */
require_once get_stylesheet_directory() . '/inc/home-popular-products.php';
