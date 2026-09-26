<?php
/**
 * Petshop Daugiau=Pigiau Šablono Kūrimo Forma v11
 * v11 (2026-09-26, S1722, R „tinka"): formos apačioje lentelė „Esami pakai" — visų DP pakų % keičiamas vietoje (AJAX petshop_dp_proc →
 *   _dp_nuolaida_proc + Petshop_DP_Kainos::sinchronizuoti), tuščias % = rankinė kaina. Jokio atskiro lango.
 * v10 (2026-09-26, S1722): laukas „Nuolaida %" (numatyta pagal bazinės kategoriją iš petshop-dp-kainos lentelės);
 *   su % pako kaina = kiekis × bazinė × (1 − %), apvalinta iki „…9", laukas tik skaitomas; įrašoma _dp_nuolaida_proc → kaina
 *   seka bazinę automatiškai (petshop-dp-kainos). Tuščias % — kaina rankinė kaip iki šiol (v9 elgesys).
 * Atskiras admin puslapis (submeniu po Produktai): sukurti DP paką iš VIENO bazinio produkto × kiekis.
 * DP pakas = WC_Product_Simple, manage_stock=no; likutis skaičiuojamas iš bazinio (snippet 567).
 * Meta: _dp_base_product_id + _dp_pack_qty. Kategorijos auto per snippet 569.
 * Bazinio produkto pasirinkimas: paieška + Rodyti visus + kategorijos filtras + sandėlis + savikaina/marža.
 *
 * v9 (2026-07-22): €/dienos skaičiuoklės integracija — sukurtam DP pakui automatiškai:
 *   (a) pakuotės svoris = multipack terminas „{kiekis} × {bazės dydis}" (pa_pakuotes_dydis),
 *       priskiriamas per WC_Product_Attribute (registruoja _product_attributes -> patvaru,
 *       priskiria pagal term_id -> be „1,5 kg"/„15 kg" slug kolizijos);
 *   (b) šėrimo lentelės paveldėjimas iš bazės (ps_feeding_map) -> B-kelio €/diena veikia.
 *   Guard: tik jei bazės dydis paprastas kanoninis (N kg|g); kitaip package praleidžiamas (nespėjam).
 */

// ============================================================
// 1. Admin submeniu
// ============================================================
add_action('admin_menu', function() {
    add_submenu_page(
        'edit.php?post_type=product',
        'Sukurti Daugiau=pigiau šabloną',
        '➕ Daugiau=pigiau',
        'manage_woocommerce',
        'petshop-dp-forma',
        'petshop_dp_forma_page'
    );
});

// ============================================================
// 2. Savikainos helper
// ============================================================
if (!function_exists('petshop_dp_get_cost')) {
function petshop_dp_get_cost($pid) {
    $cost = get_post_meta($pid, '_cost_price', true);
    if ($cost === '' || $cost === false || $cost === null) $cost = get_post_meta($pid, '_vf_cost', true);
    if ($cost === '' || $cost === false || $cost === null) $cost = get_post_meta($pid, '_zb_cost', true);
    return ($cost !== '' && $cost !== false && $cost !== null) ? (float) $cost : null;
}
}

// ============================================================
// 3. AJAX: bazinio produkto paieška (browse/source_cat/warehouse)
// ============================================================
add_action('wp_ajax_petshop_dp_search', function() {
    check_ajax_referer('petshop_dp_nonce', 'nonce');
    $term = sanitize_text_field($_GET['term'] ?? '');
    $browse = (($_GET['browse'] ?? '') === '1');
    $source_cat = sanitize_text_field($_GET['source_cat'] ?? '');
    $warehouse = sanitize_text_field($_GET['warehouse'] ?? '');
    if (!$browse && strlen($term) < 2) { wp_send_json([]); return; }

    $tax_query = array('relation'=>'AND',
        array('taxonomy'=>'product_type','field'=>'slug','terms'=>array('simple')),
    );
    if ($source_cat) $tax_query[] = array('taxonomy'=>'product_cat','field'=>'slug','terms'=>$source_cat);

    $meta_query = array();
    if ($warehouse === 'vf') {
        $meta_query[] = array('key'=>'_vf_enabled','value'=>'yes');
    } elseif ($warehouse === 'zb') {
        $meta_query[] = array('key'=>'_zb_enabled','value'=>'yes');
    } elseif ($warehouse === 'av') {
        $meta_query['relation'] = 'AND';
        $meta_query[] = array('relation'=>'OR', array('key'=>'_vf_enabled','compare'=>'NOT EXISTS'), array('key'=>'_vf_enabled','value'=>'yes','compare'=>'!='));
        $meta_query[] = array('relation'=>'OR', array('key'=>'_zb_enabled','compare'=>'NOT EXISTS'), array('key'=>'_zb_enabled','value'=>'yes','compare'=>'!='));
    }

    $by_sku = (!$browse && $term) ? wc_get_product_id_by_sku($term) : 0;
    $args = array(
        'post_type'=>'product', 'post_status'=>'publish',
        'posts_per_page'=>$browse ? 150 : 25,
        'tax_query'=>$tax_query,
    );
    if (!empty($meta_query)) $args['meta_query'] = $meta_query;
    if (strlen($term) >= 2) $args['s'] = $term;
    if ($browse) { $args['orderby']='title'; $args['order']='ASC'; }

    $query = new WP_Query($args);
    $results = array(); $seen = array();

    if ($by_sku) {
        $p = wc_get_product($by_sku);
        if ($p && $p->get_status()==='publish' && $p->is_type('simple')) {
            $img = wp_get_attachment_image_url($p->get_image_id(),'thumbnail') ?: '';
            $results[] = array('id'=>$p->get_id(), 'text'=>$p->get_name().' (SKU: '.$p->get_sku().')',
                'price'=>(float)$p->get_price(), 'cost'=>petshop_dp_get_cost($p->get_id()),
                'stock'=>$p->get_stock_quantity(), 'image'=>$img,
                'proc'=>(class_exists('Petshop_DP_Kainos') ? Petshop_DP_Kainos::numatytoji_proc($p->get_id()) : ''));
            $seen[$by_sku] = true;
        }
    }
    if ($query->have_posts()) {
        while ($query->have_posts()) { $query->the_post();
            $pid = get_the_ID();
            if (isset($seen[$pid])) continue;
            $p = wc_get_product($pid);
            if (!$p) continue;
            $img = wp_get_attachment_image_url($p->get_image_id(),'thumbnail') ?: '';
            $results[] = array('id'=>$pid, 'text'=>$p->get_name().' (SKU: '.$p->get_sku().')',
                'price'=>(float)$p->get_price(), 'cost'=>petshop_dp_get_cost($pid),
                'stock'=>$p->get_stock_quantity(), 'image'=>$img,
                'proc'=>(class_exists('Petshop_DP_Kainos') ? Petshop_DP_Kainos::numatytoji_proc($p->get_id()) : ''));
        }
        wp_reset_postdata();
    }
    wp_send_json($results);
});


// ============================================================
// Dydzio istraukimas is bazinio pavadinimo (400 g / 7 kg)
// ============================================================
if (!function_exists('petshop_dp_extract_size')) {
function petshop_dp_extract_size($name) {
    if (preg_match('/(\\d+(?:[.,]\\d+)?)\\s*(kg|g)\\b/iu', $name, $m)) {
        $num = str_replace('.', ',', $m[1]);
        $unit = strtolower($m[2]);
        return $num . ' ' . $unit;
    }
    return '';
}
}


// ============================================================
// v9: €/dienos skaičiuoklės duomenys DP pakui
// Pakuotės svoris (multipack iš bazės × kiekio) + šėrimo lentelės paveldėjimas.
// ============================================================
if (!function_exists('petshop_dp_apply_calculator_data')) {
function petshop_dp_apply_calculator_data($pid, $base_id, $qty) {
    global $wpdb;
    $tax = 'pa_pakuotes_dydis';
    $out = array('package'=>null, 'feeding_inherited'=>false, 'notes'=>array());

    // --- 1) Bazės dydis: iš bazės pa_pakuotes_dydis termino, fallback iš pavadinimo ---
    $base_terms = wp_get_post_terms($base_id, $tax, array('fields'=>'names'));
    $base_size = (!is_wp_error($base_terms) && !empty($base_terms)) ? trim($base_terms[0]) : '';
    if ($base_size === '' && function_exists('petshop_dp_extract_size')) {
        $bp = wc_get_product($base_id);
        if ($bp) $base_size = petshop_dp_extract_size($bp->get_name());
    }

    // --- 2) Multipack terminas (tik jei bazė paprastas kanoninis dydis N kg|g) ---
    if ($base_size === '' || !preg_match('/^\s*\d+(?:[.,]\d+)?\s*(kg|g)\s*$/iu', $base_size)) {
        $out['notes'][] = 'package praleistas: bazės dydis neresolvinamas ("'.$base_size.'")';
    } else {
        $mult = json_decode('"\u00d7"'); // × U+00D7 (single-quote NEinterpretuoja \xC3\x97)
        $mp_name = intval($qty) . ' ' . $mult . ' ' . $base_size;
        // get-or-create pagal EXACT NAME (be slug kolizijos)
        $row = $wpdb->get_row($wpdb->prepare(
            "SELECT te.term_id FROM {$wpdb->terms} te JOIN {$wpdb->term_taxonomy} tt ON te.term_id=tt.term_id WHERE tt.taxonomy=%s AND te.name=%s",
            $tax, $mp_name), ARRAY_A);
        $mp_id = 0;
        if ($row) { $mp_id = (int)$row['term_id']; }
        else { $ins = wp_insert_term($mp_name, $tax); if (!is_wp_error($ins)) $mp_id = (int)$ins['term_id']; }

        if ($mp_id) {
            // --- 3) Priskiriam per WC_Product_Attribute -> registruoja _product_attributes + terminą (patvaru) ---
            $product = wc_get_product($pid);
            if ($product) {
                $attr = new WC_Product_Attribute();
                if (function_exists('wc_attribute_taxonomy_id_by_name')) {
                    $atid = wc_attribute_taxonomy_id_by_name($tax);
                    if ($atid) $attr->set_id($atid);
                }
                $attr->set_name($tax);
                $attr->set_options(array($mp_id));
                $attr->set_visible(true);
                $attr->set_variation(false);
                $attrs = $product->get_attributes();
                $attrs[$tax] = $attr;
                $product->set_attributes($attrs);
                $product->save();
                $out['package'] = $mp_name;
            }
        } else {
            $out['notes'][] = 'package praleistas: nepavyko termino "'.$mp_name.'"';
        }
    }

    // --- 4) Šėrimo lentelės paveldėjimas iš bazės (kad B-kelio €/diena veiktų) ---
    $mapT = $wpdb->prefix . 'ps_feeding_map';
    if ($wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $mapT)) === $mapT) {
        $base_ft = $wpdb->get_var($wpdb->prepare("SELECT feeding_table_id FROM {$mapT} WHERE product_id=%d AND is_active=1 LIMIT 1", $base_id));
        if ($base_ft) {
            $have = (int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$mapT} WHERE product_id=%d AND feeding_table_id=%d", $pid, (int)$base_ft));
            if (!$have) {
                $wpdb->insert($mapT, array('product_id'=>$pid, 'feeding_table_id'=>(int)$base_ft, 'is_active'=>1));
                $out['feeding_inherited'] = true;
            } else {
                $out['feeding_inherited'] = 'jau buvo';
            }
        } else {
            $out['notes'][] = 'feeding: bazė neturi aktyvios lentelės (A-kelias per kainą vis tiek veiks)';
        }
    }
    return $out;
}
}

// ============================================================
// GD badge generatorius (Pillow recepto atkartojimas, 2x supersample)
// Grazina JPEG binary arba false
// ============================================================
if (!function_exists('petshop_dp_gd_badge')) {
function petshop_dp_gd_badge($base_img_path, $qty, $size_str) {
  $font = wp_upload_dir()['basedir'].'/petshop-fonts/DejaVuSans-Bold.ttf';
  if (!file_exists($font) || !$base_img_path || !file_exists($base_img_path)) return false;
  if (!function_exists('imagettftext') || !function_exists('imagecreatetruecolor')) return false;

  $SS = 2; $W = 1000*$SS; $H = 1000*$SS; $GREEN = array(47,95,70);
  $src = @imagecreatefromstring(file_get_contents($base_img_path));
  if (!$src) return false;
  $sw = imagesx($src); $sh = imagesy($src);

  $canvas = imagecreatetruecolor($W, $H);
  imagealphablending($canvas, true); imagesavealpha($canvas, true);
  imagefilledrectangle($canvas, 0,0,$W,$H, imagecolorallocate($canvas,255,255,255));

  $box = 640*$SS;
  $cx0 = intval(($W-$box)/2); $cy0 = intval(($H-$box)/2) - 20*$SS;
  $scale = min($box/$sw, $box/$sh);
  $dw = intval($sw*$scale); $dh = intval($sh*$scale);
  $dx = $cx0 + intval(($box-$dw)/2); $dy = $cy0 + intval(($box-$dh)/2);

  // sesselis po produktu
  $shadow = imagecreatetruecolor($W,$H);
  imagealphablending($shadow,false); imagesavealpha($shadow,true);
  imagefilledrectangle($shadow,0,0,$W,$H, imagecolorallocatealpha($shadow,0,0,0,127));
  imagealphablending($shadow,true);
  imagefilledellipse($shadow, intval($W/2), intval($cy0+$box-50*$SS+20*$SS), intval($box-180*$SS), intval(80*$SS), imagecolorallocatealpha($shadow,0,0,0,95));
  for($i=0;$i<14;$i++) imagefilter($shadow, IMG_FILTER_GAUSSIAN_BLUR);
  imagecopy($canvas,$shadow,0,0,0,0,$W,$H); imagedestroy($shadow);

  imagecopyresampled($canvas, $src, $dx,$dy, 0,0, $dw,$dh, $sw,$sh);
  imagedestroy($src);

  // badge
  $badge_d = 200*$SS; $bx = $W-$badge_d-45*$SS; $by = 45*$SS;
  $bcx = $bx+intval($badge_d/2); $bcy = $by+intval($badge_d/2);
  $bsh = imagecreatetruecolor($W,$H);
  imagealphablending($bsh,false); imagesavealpha($bsh,true);
  imagefilledrectangle($bsh,0,0,$W,$H, imagecolorallocatealpha($bsh,0,0,0,127));
  imagealphablending($bsh,true);
  imagefilledellipse($bsh, $bcx+4*$SS, $bcy+7*$SS, $badge_d, $badge_d, imagecolorallocatealpha($bsh,0,0,0,100));
  for($i=0;$i<8;$i++) imagefilter($bsh, IMG_FILTER_GAUSSIAN_BLUR);
  imagecopy($canvas,$bsh,0,0,0,0,$W,$H); imagedestroy($bsh);
  $gcol = imagecolorallocate($canvas, $GREEN[0],$GREEN[1],$GREEN[2]);
  imagefilledellipse($canvas, $bcx, $bcy, $badge_d, $badge_d, $gcol);
  imagesetthickness($canvas, 3*$SS);
  imageellipse($canvas, $bcx, $bcy, $badge_d-22*$SS, $badge_d-22*$SS, imagecolorallocatealpha($canvas,255,255,255,15));
  imagesetthickness($canvas, 1);

  $wtxt = imagecolorallocate($canvas, 255,255,255);
  $x_txt = "\xc3\x97"; $n_txt = (string)$qty;
  // Etaloniniai dydziai (kaip Exclusion 7kg×2): × 52, N 88, VNT 30.
  // Vieno skaitmens numeris lieka 88 (identiskas etalonui); 2+ skaitmenys automatiskai
  // sumazinami kol grupe telpa i ~58% badge ploto (kad neisliptu is rutuliuko).
  $s_x = 52*$SS; $s_n = 88*$SS; $s_vnt = 30*$SS;
  $bb_x = imagettfbbox($s_x,0,$font,$x_txt); $bb_n = imagettfbbox($s_n,0,$font,$n_txt);
  $xw = $bb_x[2]-$bb_x[0]; $nw = $bb_n[2]-$bb_n[0];
  for ($g=0; $g<14; $g++) {
    $bb_x = imagettfbbox($s_x,0,$font,$x_txt); $bb_n = imagettfbbox($s_n,0,$font,$n_txt);
    $xw = $bb_x[2]-$bb_x[0]; $nw = $bb_n[2]-$bb_n[0];
    if (($xw + 6*$SS + $nw) <= $badge_d*0.58) break;
    $s_n -= 6*$SS; $s_x -= 3*$SS;
    if ($s_n <= 48*$SS) break;
  }
  $total_w = $xw + 6*$SS + $nw;
  $start_x = $bcx - intval($total_w/2);
  // Skaiciaus INK vertikaliai centruotas ties bcy-8 (kaip Pillow realiai isveda)
  $num_cy = $bcy - intval(8*$SS);
  $baseline = $num_cy - intval(($bb_n[7]+$bb_n[1])/2);
  imagettftext($canvas, $s_x,0, $start_x-$bb_x[0], $baseline, $wtxt, $font, $x_txt);
  imagettftext($canvas, $s_n,0, $start_x+$xw+6*$SS-$bb_n[0], $baseline, $wtxt, $font, $n_txt);
  // VNT. ink centruota ties bcy+50
  $vtxt = "VNT."; $bb_v = imagettfbbox($s_vnt,0,$font,$vtxt); $vw = $bb_v[2]-$bb_v[0];
  $v_base = ($bcy + intval(50*$SS)) - intval(($bb_v[7]+$bb_v[1])/2);
  imagettftext($canvas, $s_vnt,0, $bcx-intval($vw/2)-$bb_v[0], $v_base, $wtxt, $font, $vtxt);

  // juosta
  $band_h = 82*$SS;
  imagefilledrectangle($canvas, 0, $H-$band_h, $W, $H, $gcol);
  $s_band = 38*$SS;
  $btxt = $size_str !== ''
      ? "EKONOMI\xc5\xa0KA PAKUOT\xc4\x96 \xc2\xb7 ".$qty." \xc3\x97 ".$size_str
      : "EKONOMI\xc5\xa0KA PAKUOT\xc4\x96 \xc2\xb7 ".$qty." vnt.";
  // jei per platus - mazinam srift0
  $bb_b = imagettfbbox($s_band,0,$font,$btxt);
  while (($bb_b[2]-$bb_b[0]) > ($W - 60*$SS) && $s_band > 20*$SS) { $s_band -= 2*$SS; $bb_b = imagettfbbox($s_band,0,$font,$btxt); }
  $wb = $bb_b[2]-$bb_b[0];
  $bx_t = intval($W/2) - intval($wb/2) - $bb_b[0];
  $by_t = ($H - intval($band_h/2)) - intval(($bb_b[7]+$bb_b[1])/2);
  imagettftext($canvas, $s_band,0, $bx_t, $by_t, $wtxt, $font, $btxt);

  $final = imagecreatetruecolor(1000,1000);
  imagecopyresampled($final, $canvas, 0,0,0,0, 1000,1000, $W,$H);
  imagedestroy($canvas);
  ob_start(); imagejpeg($final, null, 90); $data = ob_get_clean();
  imagedestroy($final);
  return $data;
}
}

// ============================================================
// GD ŠVARI KVADRATINĖ nuotrauka: produktas centruotas 1000×1000 baltame,
// tas pats mastas kaip etalone (box 640, -20 shift, minkštas šešėlis),
// BE ženkliuko ir BE juostos (tie — CSS overlay). Normalizuoja skirtingų dydžių bazines.
// ============================================================
if (!function_exists('petshop_dp_gd_clean')) {
function petshop_dp_gd_clean($base_img_path) {
  if (!$base_img_path || !file_exists($base_img_path)) return false;
  if (!function_exists('imagecreatetruecolor')) return false;
  $SS = 2; $W = 1000*$SS; $H = 1000*$SS;
  $src = @imagecreatefromstring(file_get_contents($base_img_path));
  if (!$src) return false;
  $sw = imagesx($src); $sh = imagesy($src);
  $canvas = imagecreatetruecolor($W, $H);
  imagealphablending($canvas, true); imagesavealpha($canvas, true);
  imagefilledrectangle($canvas, 0,0,$W,$H, imagecolorallocate($canvas,255,255,255));
  $box = 640*$SS;
  $cx0 = intval(($W-$box)/2); $cy0 = intval(($H-$box)/2) - 20*$SS;
  $scale = min($box/$sw, $box/$sh);
  $dw = intval($sw*$scale); $dh = intval($sh*$scale);
  $dx = $cx0 + intval(($box-$dw)/2); $dy = $cy0 + intval(($box-$dh)/2);
  // minkstas seselis
  $shadow = imagecreatetruecolor($W,$H);
  imagealphablending($shadow,false); imagesavealpha($shadow,true);
  imagefilledrectangle($shadow,0,0,$W,$H, imagecolorallocatealpha($shadow,0,0,0,127));
  imagealphablending($shadow,true);
  imagefilledellipse($shadow, intval($W/2), intval($cy0+$box-50*$SS+20*$SS), intval($box-180*$SS), intval(80*$SS), imagecolorallocatealpha($shadow,0,0,0,95));
  for($i=0;$i<14;$i++) imagefilter($shadow, IMG_FILTER_GAUSSIAN_BLUR);
  imagecopy($canvas,$shadow,0,0,0,0,$W,$H); imagedestroy($shadow);
  imagecopyresampled($canvas, $src, $dx,$dy, 0,0, $dw,$dh, $sw,$sh);
  imagedestroy($src);
  $final = imagecreatetruecolor(1000,1000);
  imagecopyresampled($final, $canvas, 0,0,0,0, 1000,1000, $W,$H);
  imagedestroy($canvas);
  ob_start(); imagejpeg($final, null, 90); $data = ob_get_clean();
  imagedestroy($final);
  return $data;
}
}

// Priskiria svaria-kvadratine nuotrauka pakui (attachment -> thumbnail)
if (!function_exists('petshop_dp_apply_clean_image')) {
function petshop_dp_apply_clean_image($pid, $base) {
  $bp = $base->get_image_id() ? get_attached_file($base->get_image_id()) : '';
  $data = $bp ? petshop_dp_gd_clean($bp) : false;
  if ($data) {
    $fname = 'dp-clean-'.$pid.'.jpg';
    $upload = wp_upload_bits($fname, null, $data);
    if (empty($upload['error'])) {
      require_once ABSPATH.'wp-admin/includes/image.php';
      $ft = wp_check_filetype($upload['file'], null);
      $att = array('post_mime_type'=>$ft['type'], 'post_title'=>sanitize_file_name($base->get_name().' pack'), 'post_content'=>'', 'post_status'=>'inherit');
      $att_id = wp_insert_attachment($att, $upload['file'], $pid);
      wp_update_attachment_metadata($att_id, wp_generate_attachment_metadata($att_id, $upload['file']));
      set_post_thumbnail($pid, $att_id);
      return $att_id;
    }
  }
  $bt = get_post_thumbnail_id($base->get_id());
  if ($bt) set_post_thumbnail($pid, $bt);
  return false;
}
}

// ============================================================
// DP pako badge nuotraukos priskyrimas (GD -> attachment -> thumbnail)
// ============================================================
if (!function_exists('petshop_dp_apply_badge_image')) {
function petshop_dp_apply_badge_image($pid, $base, $qty) {
  $base_img_path = $base->get_image_id() ? get_attached_file($base->get_image_id()) : '';
  $size_str = petshop_dp_extract_size($base->get_name());
  $data = $base_img_path ? petshop_dp_gd_badge($base_img_path, $qty, $size_str) : false;
  if ($data) {
    $fname = 'dp-pack-'.$pid.'-x'.$qty.'.jpg';
    $upload = wp_upload_bits($fname, null, $data);
    if (empty($upload['error'])) {
      require_once ABSPATH.'wp-admin/includes/image.php';
      $ft = wp_check_filetype($upload['file'], null);
      $att = array('post_mime_type'=>$ft['type'], 'post_title'=>sanitize_file_name($base->get_name().' x'.$qty), 'post_content'=>'', 'post_status'=>'inherit');
      $att_id = wp_insert_attachment($att, $upload['file'], $pid);
      wp_update_attachment_metadata($att_id, wp_generate_attachment_metadata($att_id, $upload['file']));
      set_post_thumbnail($pid, $att_id);
      return $att_id;
    }
  }
  // fallback: bazinio nuotrauka
  $base_thumb = get_post_thumbnail_id($base->get_id());
  if ($base_thumb) set_post_thumbnail($pid, $base_thumb);
  return false;
}
}

// ============================================================
// 4. AJAX: DP pako sukūrimas
// ============================================================
add_action('wp_ajax_petshop_dp_create', function() {
    check_ajax_referer('petshop_dp_nonce', 'nonce');
    if (!current_user_can('manage_woocommerce')) { wp_send_json_error('Neturite teisių.'); return; }

    $data = json_decode(stripslashes($_POST['dp_data'] ?? ''), true);
    if (!$data) { wp_send_json_error('Neteisingi duomenys.'); return; }

    $base_id = intval($data['base_id'] ?? 0);
    $qty = intval($data['qty'] ?? 0);
    $title = sanitize_text_field($data['title'] ?? '');
    $sku = sanitize_text_field($data['sku'] ?? '');
    $price = floatval($data['price'] ?? 0);
    $proc = isset($data['proc']) ? trim((string)$data['proc']) : '';
    if ($proc !== '' && !is_numeric($proc)) $proc = '';
    $short_desc = sanitize_textarea_field($data['short_description'] ?? '');

    $errors = array();
    if ($base_id <= 0) $errors[] = 'Nepasirinktas bazinis produktas.';
    if ($qty < 2) $errors[] = 'Kiekis turi būti bent 2.';
    if (empty($title)) $errors[] = 'Trūksta pavadinimo.';
    if (empty($sku)) $errors[] = 'Trūksta SKU.';
    if ($price <= 0) $errors[] = 'Kaina turi būti teigiama.';
    if ($sku && wc_get_product_id_by_sku($sku)) $errors[] = 'SKU "'.$sku.'" jau egzistuoja.';
    $base = $base_id ? wc_get_product($base_id) : null;
    if (!$base) $errors[] = 'Bazinis produktas nerastas.';
    if (!empty($errors)) { wp_send_json_error(implode(' ', $errors)); return; }
    // v10: su % kaina skaičiuojama serveryje (petshop-dp-kainos formulė), ne iš formos
    if ($proc !== '' && class_exists('Petshop_DP_Kainos')) {
        $price = (float) Petshop_DP_Kainos::kaina((float)$base->get_regular_price('edit'), $qty, (float)$proc);
    }

    // Aprašymas: pako intro + bazinio pilnas aprašymas (su sudėtimi) — S143
    $base_desc = $base->get_description();
    $intro = '<p><strong>Ekonomiška pakuotė:</strong> ' . $qty . ' vnt. „' . esc_html($base->get_name()) . '".</p>';
    $desc_html = $intro . ($base_desc ? "\n<hr />\n" . $base_desc : '');

    try {
        $product = new WC_Product_Simple();
        $product->set_name($title);
        $product->set_sku($sku);
        $product->set_status('publish');
        $product->set_catalog_visibility('visible');
        $product->set_price($price);
        $product->set_regular_price($price);
        if ($short_desc) $product->set_short_description($short_desc);
        $product->set_description($desc_html);
        $product->set_manage_stock(false);
        $product->set_stock_status('instock');
        $product->update_meta_data('_dp_base_product_id', $base_id);
        $product->update_meta_data('_dp_pack_qty', $qty);
        if ($proc !== '') $product->update_meta_data('_dp_nuolaida_proc', (string)(float)$proc);
        $product->save();
        $pid = $product->get_id();
        if (!$pid) { wp_send_json_error('Nepavyko sukurti produkto.'); return; }

        // Kategorijos: leidžiam snippet 569 auto-priskirti (paveldi bazinio + 91),
        // bet dar kartą triggerinam save kad hook'as tikrai suveiktų
        do_action('woocommerce_update_product', $pid, $product);
        if ($proc !== '' && class_exists('Petshop_DP_Kainos')) Petshop_DP_Kainos::sinchronizuoti($pid, false, 'forma');

        // Belt&suspenders: pašalinam "Kita" (16) jei liko
        $cats = wp_get_object_terms($pid, 'product_cat', array('fields'=>'ids'));
        if (in_array(16, $cats)) {
            $cats = array_diff($cats, array(16));
            if (!empty($cats)) wp_set_object_terms($pid, array_values($cats), 'product_cat');
        }
        // Nuotrauka = ŠVARI KVADRATINĖ (produktas centruotas 1000×1000, normalizuota).
        // ×N VNT badge + EKONOMIŠKA PAKUOTĖ juosta pridedami CSS overlay (snippet 573) — NEbekepama į nuotrauką.
        $badge_att = petshop_dp_apply_clean_image($pid, $base);

        // v9: €/dienos skaičiuoklės duomenys — pakuotės svoris (multipack) + šėrimo paveldėjimas
        $dp_calc = petshop_dp_apply_calculator_data($pid, $base_id, $qty);

        wc_delete_product_transients($pid);

        wp_send_json_success(array(
            'badge_generated' => (bool)$badge_att,
            'dp_calc' => $dp_calc,
            'product_id' => $pid,
            'edit_url' => admin_url('post.php?post='.$pid.'&action=edit'),
            'view_url' => get_permalink($pid),
            'categories' => wp_get_object_terms($pid, 'product_cat', array('fields'=>'names')),
        ));
    } catch (Throwable $e) {
        wp_send_json_error('Klaida: ' . $e->getMessage());
    }
});

// v11: esamo pako nuolaidos % keitimas (lentelė formos apačioje)
add_action('wp_ajax_petshop_dp_proc', function() {
    check_ajax_referer('petshop_dp_nonce', 'nonce');
    if (!current_user_can('manage_woocommerce')) { wp_send_json_error('Neturite teisių.'); return; }
    $pid = intval($_POST['pid'] ?? 0); $proc = str_replace(',', '.', trim((string)($_POST['proc'] ?? '')));
    if ($pid <= 0 || !get_post_meta($pid, '_dp_base_product_id', true)) { wp_send_json_error('Ne DP pakas.'); return; }
    if ($proc !== '' && (!is_numeric($proc) || (float)$proc < 0 || (float)$proc > 60)) { wp_send_json_error('Procentas 0–60 arba tuščias.'); return; }
    if (!class_exists('Petshop_DP_Kainos')) { wp_send_json_error('petshop-dp-kainos neaktyvus.'); return; }
    if ($proc === '') delete_post_meta($pid, '_dp_nuolaida_proc'); else update_post_meta($pid, '_dp_nuolaida_proc', (string)(float)$proc);
    $r = Petshop_DP_Kainos::sinchronizuoti($pid, false, 'forma');
    $pk = wc_get_product($pid);
    wp_send_json_success(array('proc'=>get_post_meta($pid, '_dp_nuolaida_proc', true), 'reg'=>$pk ? $pk->get_regular_price('edit') : '', 'sale'=>$pk ? $pk->get_sale_price('edit') : '', 'klaida'=>$r['klaida'] ?? ''));
});

// ============================================================
// 5. Formos puslapis
// ============================================================
function petshop_dp_forma_page() {
    $nonce = wp_create_nonce('petshop_dp_nonce');
    // Visos realios pet-branch subkategorijos (be Kita/specialiu) — "Rodyti visas"
    $all_cat_groups = array();
    $pet_slugs = array('sunims','katems','grauzikams','pauksciams','zuvims');
    $skip_ids = array(91,679,682,683,684,681,680,689,16);
    foreach ($pet_slugs as $ps) {
        $top = get_term_by('slug', $ps, 'product_cat');
        if (!$top) continue;
        $children = get_term_children($top->term_id, 'product_cat');
        $items = array();
        foreach ($children as $cid) {
            $c = get_term($cid, 'product_cat');
            if (!$c || is_wp_error($c)) continue;
            if ($c->count <= 0) continue;
            if (mb_stripos($c->name, 'kita') !== false) continue;
            if (in_array($cid, $skip_ids)) continue;
            $items[] = array('slug'=>$c->slug, 'name'=>$c->name);
        }
        usort($items, function($a,$b){ return strcmp($a['name'],$b['name']); });
        if (!empty($items)) $all_cat_groups[] = array('label'=>$top->name, 'items'=>$items);
    }
    ?>
    <div class="wrap">
        <h1>➕ Sukurti „Daugiau = pigiau" šabloną</h1>
        <p class="description">DP pakas = vienas bazinis produktas × kiekis. Likutis ir „Sutaupote" skaičiuojami automatiškai. Kategorijos priskiriamos automatiškai (paveldi bazinio + DAUGIAU=PIGIAU).</p>

        <div id="dpf" style="max-width:900px;margin-top:20px;">

            <!-- 1. Bazinio produkto pasirinkimas -->
            <h2>1. Bazinis produktas</h2>
            <div id="dpf-base-card" style="margin-bottom:12px;"></div>

            <div style="margin-bottom:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <label style="font-size:12px;color:#666;">Kategorijos filtras:</label>
                <select id="dpf-cat-filter" style="min-width:240px;">
                    <option value="">— Visos kategorijos (be ribojimo) —</option>
                </select>
                <label style="font-size:12px;color:#666;margin-left:8px;"><input type="checkbox" id="dpf-show-all-cats"> Rodyti visas kategorijas</label>
            </div>

            <div style="margin-bottom:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <label style="font-size:12px;color:#666;">Sandėlis:</label>
                <span id="dpf-warehouse" style="display:inline-flex;gap:6px;flex-wrap:wrap;">
                    <button type="button" class="button dpf-wh button-primary" data-wh="">Visi</button>
                    <button type="button" class="button dpf-wh" data-wh="vf">VF</button>
                    <button type="button" class="button dpf-wh" data-wh="zb">ZB</button>
                    <button type="button" class="button dpf-wh" data-wh="av">AV (nuosava)</button>
                </span>
            </div>

            <div style="margin-bottom:20px;position:relative;">
                <input type="text" id="dpf-search" class="regular-text" placeholder="🔍 Ieškoti bazinio produkto (pavadinimas arba SKU)..." autocomplete="off" style="width:400px;">
                <button type="button" id="dpf-browse" class="button" style="margin-left:6px;">📋 Rodyti visus tinkamus</button>
                <div id="dpf-search-results" style="position:absolute;z-index:1000;background:#fff;border:1px solid #ccc;max-height:360px;overflow-y:auto;width:560px;display:none;box-shadow:0 4px 12px rgba(0,0,0,.12);"></div>
            </div>

            <!-- 2. Pako duomenys -->
            <h2>2. Pako duomenys</h2>
            <table class="form-table">
                <tr><th><label>Kiekis pakuotėje *</label></th>
                    <td><input type="number" id="dpf-qty" min="2" max="99" value="6" style="width:80px;"> vnt.
                    <p class="description">Kiek bazinio produkto vienetų sudaro paką.</p></td></tr>
                <tr><th><label>Pako pavadinimas *</label></th>
                    <td><input type="text" id="dpf-title" class="large-text" placeholder="Sugeneruojamas iš bazinio + kiekio">
                    <p class="description">Automatiškai siūlomas, galite keisti.</p></td></tr>
                <tr><th><label>Pako SKU *</label></th>
                    <td><input type="text" id="dpf-sku" class="regular-text" placeholder="DP-...">
                    <p class="description">Automatiškai siūlomas, galite keisti.</p></td></tr>
                <tr><th><label>Pako kaina (€) *</label></th>
                    <td><input type="number" id="dpf-price" min="0" step="0.01" style="width:120px;"> €
                    <p class="description">Pako pardavimo kaina. Su nuolaidos % skaičiuojama automatiškai (tik skaitoma).</p></td></tr>
                <tr><th><label>Nuolaida (%)</label></th>
                    <td><input type="number" id="dpf-proc" min="0" max="50" step="0.5" style="width:80px;"> %
                    <p class="description">Numatyta pagal bazinės kategoriją (sausas 3, Josera 2,5, konservai 3,5, skanėstai 10, kraikas 10). Su % pako kaina seka bazinę automatiškai (petshop-dp-kainos). Ištrinkite % — kaina rankinė, nesinchronizuojama.</p></td></tr>
                <tr><th><label>Trumpas aprašymas</label></th>
                    <td><textarea id="dpf-short-desc" class="large-text" rows="2" placeholder="Nebūtina — rodomas po kaina."></textarea></td></tr>
            </table>

            <!-- 3. Skaičiavimai -->
            <div id="dpf-calc" style="display:none;margin:16px 0;"></div>

            <div style="margin-top:20px;">
                <button type="button" id="dpf-create" class="button button-primary button-large" disabled>Sukurti DP paką</button>
                <span id="dpf-status" style="margin-left:12px;font-style:italic;"></span>
            </div>
            <div id="dpf-result" style="margin-top:20px;display:none;background:#e8f5e9;border:1px solid #4caf50;border-radius:6px;padding:16px;"></div>
        </div>
    </div>

    <script>
    (function(){
        var base = null; // pasirinktas bazinis {id,text,price,cost,stock,image}
        var nonce = '<?php echo esc_js($nonce); ?>';
        var ajaxurl = '<?php echo esc_js(admin_url('admin-ajax.php')); ?>';
        var currentWarehouse = '';
        var searchTimer = null;

        // Kategorijos: primary 8 (kaip rinkiniai) + visos (grupuota) po checkbox
        var poolCats = [
            {slug:'sausas-maistas-sunims', name:'Sausas maistas šunims'},
            {slug:'sausas-maistas-katems', name:'Sausas maistas katėms'},
            {slug:'konservai-sunims',      name:'Konservai šunims'},
            {slug:'konservai-katems',      name:'Konservai katėms'},
            {slug:'skanestai-sunims',      name:'Skanėstai šunims'},
            {slug:'skanestai-katems',      name:'Skanėstai katėms'},
            {slug:'skanestai-grauzikams',  name:'Skanėstai graužikams'},
            {slug:'skanestai-pauksciams',  name:'Skanėstai paukščiams'}
        ];
        var allCatGroups = <?php echo wp_json_encode($all_cat_groups); ?>;

        var searchInput = document.getElementById('dpf-search');
        var searchResults = document.getElementById('dpf-search-results');
        var browseBtn = document.getElementById('dpf-browse');
        var catFilter = document.getElementById('dpf-cat-filter');
        var showAllCats = document.getElementById('dpf-show-all-cats');
        var baseCard = document.getElementById('dpf-base-card');
        var calcEl = document.getElementById('dpf-calc');
        var createBtn = document.getElementById('dpf-create');
        var statusEl = document.getElementById('dpf-status');
        var resultEl = document.getElementById('dpf-result');

        // Kategoriju dropdown uzpildymas
        function fillCats(showAll) {
            catFilter.innerHTML = '<option value="">— Visos kategorijos (be ribojimo) —</option>';
            if (!showAll) {
                poolCats.forEach(function(c){
                    var o=document.createElement('option'); o.value=c.slug; o.textContent=c.name; catFilter.appendChild(o);
                });
            } else {
                allCatGroups.forEach(function(g){
                    var og=document.createElement('optgroup'); og.label=g.label;
                    g.items.forEach(function(c){ var o=document.createElement('option'); o.value=c.slug; o.textContent=c.name; og.appendChild(o); });
                    catFilter.appendChild(og);
                });
            }
        }
        fillCats(false);
        showAllCats.addEventListener('change', function(){ fillCats(this.checked); });

        // Sandelio mygtukai
        document.querySelectorAll('.dpf-wh').forEach(function(b){
            b.addEventListener('click', function(){
                currentWarehouse = this.dataset.wh || '';
                document.querySelectorAll('.dpf-wh').forEach(function(x){ x.classList.remove('button-primary'); });
                this.classList.add('button-primary');
            });
        });

        // Paieska/browse
        function runSearch(term, browse) {
            var sourceCat = catFilter ? catFilter.value : '';
            var url = ajaxurl + '?action=petshop_dp_search&nonce=' + nonce
                + '&term=' + encodeURIComponent(term)
                + '&source_cat=' + encodeURIComponent(sourceCat)
                + '&warehouse=' + encodeURIComponent(currentWarehouse)
                + (browse ? '&browse=1' : '');
            searchResults.innerHTML = '<div style="padding:10px;color:#999;">Kraunama…</div>';
            searchResults.style.display = 'block';
            fetch(url).then(function(r){ return r.json(); }).then(function(data){
                searchResults.innerHTML = '';
                if (!data.length) { searchResults.innerHTML = '<div style="padding:8px;color:#999;">Nerasta</div>'; return; }
                data.forEach(function(p){
                    var div = document.createElement('div');
                    div.style.cssText = 'padding:8px 12px;border-bottom:1px solid #eee;display:flex;align-items:center;gap:8px;cursor:pointer;';
                    div.innerHTML = (p.image ? '<img src="'+p.image+'" style="width:32px;height:32px;object-fit:contain;border-radius:4px;">' : '<span style="width:32px;"></span>')
                        + '<div style="flex:1;"><div style="font-size:13px;">'+p.text+'</div>'
                        + '<div style="font-size:11px;color:#666;">Pard.: '+p.price.toFixed(2)+' € | Savikaina: '+(p.cost!==null?p.cost.toFixed(2)+' €':'nėra')+' | Likutis: '+(p.stock!==null?p.stock:'∞')+'</div></div>';
                    div.addEventListener('click', function(){ selectBase(p); searchResults.style.display='none'; searchInput.value=''; });
                    div.addEventListener('mouseenter', function(){ this.style.background='#f5f5f5'; });
                    div.addEventListener('mouseleave', function(){ this.style.background=''; });
                    searchResults.appendChild(div);
                });
            });
        }
        searchInput.addEventListener('input', function(){
            clearTimeout(searchTimer);
            var v = this.value.trim();
            if (v.length < 2) { searchResults.style.display='none'; return; }
            searchTimer = setTimeout(function(){ runSearch(v, false); }, 300);
        });
        browseBtn.addEventListener('click', function(){ runSearch('', true); });
        document.addEventListener('click', function(e){
            if (!searchResults.contains(e.target) && e.target!==searchInput && e.target!==browseBtn) searchResults.style.display='none';
        });

        // Pasirenkam bazini
        function selectBase(p) {
            base = p;
            baseCard.innerHTML = '<div style="display:flex;align-items:center;gap:12px;background:#f6f8f7;border:1px solid #cfe0d8;border-radius:8px;padding:12px;">'
                + (p.image ? '<img src="'+p.image+'" style="width:56px;height:56px;object-fit:contain;">' : '')
                + '<div style="flex:1;"><strong>'+p.text+'</strong><br>'
                + '<span style="font-size:12px;color:#666;">Bazinė kaina: '+p.price.toFixed(2)+' € | Savikaina: '+(p.cost!==null?p.cost.toFixed(2)+' €':'nėra')+' | Likutis: '+(p.stock!==null?p.stock:'∞')+'</span></div>'
                + '<button type="button" class="button" id="dpf-clear-base" style="color:#c00;">✕ Keisti</button></div>';
            document.getElementById('dpf-clear-base').addEventListener('click', function(){ base=null; baseCard.innerHTML=''; recalc(); });
            autofill();
            recalc();
        }

        // Auto pavadinimas + SKU
        function autofill() {
            if (!base) return;
            var qty = parseInt(document.getElementById('dpf-qty').value) || 0;
            var titleEl = document.getElementById('dpf-title');
            var skuEl = document.getElementById('dpf-sku');
            // Pavadinimas: bazinio vardas be "(SKU: ...)" + " × N vnt."
            var baseName = base.text.replace(/\s*\(SKU:.*\)$/,'');
            if (!titleEl.dataset.touched) titleEl.value = baseName + ' × ' + qty + ' vnt.';
            // SKU
            if (!skuEl.dataset.touched) {
                var baseSku = (base.text.match(/\(SKU:\s*([^)]+)\)/)||[])[1] || base.id;
                skuEl.value = 'DP-' + String(baseSku).toUpperCase().replace(/[^A-Z0-9]/g,'') + '-' + qty;
            }
            // v10: nuolaida % (numatyta pagal kategorija) -> kaina = bazine × qty × (1-%), apvalinta iki "...9"; be % — sena logika ×0.95
            var priceEl = document.getElementById('dpf-price');
            var procEl = document.getElementById('dpf-proc');
            if (!procEl.dataset.touched && base.proc !== undefined && base.proc !== '' && base.proc !== null) procEl.value = base.proc;
            var proc = parseFloat(procEl.value);
            if (procEl.value !== '' && !isNaN(proc)) {
                var x = base.price * qty * (1 - proc/100);
                var r = Math.round(x*10)/10 - 0.01; if (r < 0.09) r = 0.09;
                priceEl.value = r.toFixed(2); priceEl.readOnly = true; priceEl.style.background = '#f0f0f0';
            } else {
                priceEl.readOnly = false; priceEl.style.background = '';
                if (!priceEl.dataset.touched && !priceEl.value) priceEl.value = (base.price * qty * 0.95).toFixed(2);
            }
        }
        ['dpf-title','dpf-sku','dpf-price'].forEach(function(id){
            document.getElementById(id).addEventListener('input', function(){ this.dataset.touched='1'; recalc(); });
        });
        document.getElementById('dpf-qty').addEventListener('input', function(){ autofill(); recalc(); });
        document.getElementById('dpf-proc').addEventListener('input', function(){ this.dataset.touched='1'; autofill(); recalc(); });
        document.getElementById('dpf-short-desc').addEventListener('input', recalc);

        // Skaiciavimai (Sutaupote + marza)
        function recalc() {
            var qty = parseInt(document.getElementById('dpf-qty').value) || 0;
            var price = parseFloat(document.getElementById('dpf-price').value) || 0;
            var title = document.getElementById('dpf-title').value.trim();
            var sku = document.getElementById('dpf-sku').value.trim();

            if (!base || qty < 2) { calcEl.style.display='none'; createBtn.disabled=true; return; }

            var normalTotal = base.price * qty;          // iprastai perkant po viena
            var savings = normalTotal - price;
            var savingsPct = normalTotal > 0 ? Math.round((savings/normalTotal)*100) : 0;
            var hasCost = (base.cost !== null && base.cost !== undefined);
            var costTotal = hasCost ? base.cost * qty : null;
            var margin = (hasCost && price>0) ? (price - costTotal) : null;
            var marginPct = (margin!==null && price>0) ? Math.round((margin/price)*100) : null;

            var h = '<div style="background:#eef5fb;border:1px solid #cfe2f3;border-radius:8px;padding:14px;">';
            h += '<strong style="font-size:14px;">📊 Pako skaičiavimai (' + qty + ' vnt.)</strong>';
            h += '<div style="display:flex;gap:24px;flex-wrap:wrap;margin-top:10px;font-size:13px;">';
            h += '<div>Bazinė kaina/vnt:<br><strong>' + base.price.toFixed(2) + ' €</strong></div>';
            h += '<div>Įprastai (' + qty + '×):<br><strong>' + normalTotal.toFixed(2) + ' €</strong></div>';
            h += '<div>Pako kaina:<br><strong style="font-size:16px;">' + (price>0?price.toFixed(2)+' €':'—') + '</strong></div>';
            h += '<div>Klientas sutaupo:<br><strong style="color:' + (savings>0?'#2a8':'#c00') + ';">' + (price>0 ? savings.toFixed(2)+' € ('+savingsPct+'%)' : '—') + '</strong></div>';
            h += '</div>';
            // Marza
            h += '<div style="margin-top:12px;border-top:1px solid #cfe2f3;padding-top:10px;font-size:13px;">';
            if (hasCost) {
                h += '<div style="display:flex;gap:24px;flex-wrap:wrap;">';
                h += '<div>Savikaina/vnt:<br><strong>' + base.cost.toFixed(2) + ' €</strong></div>';
                h += '<div>Savikainų suma (' + qty + '×):<br><strong>' + costTotal.toFixed(2) + ' €</strong></div>';
                if (margin!==null) {
                    var mColor = margin<0?'#c00':'#2a8'; var mIcon = margin<0?'❌':'✅';
                    h += '<div>Pako marža:<br><strong style="color:'+mColor+';font-size:16px;">' + margin.toFixed(2) + ' € (' + marginPct + '%) ' + mIcon + '</strong></div>';
                }
                h += '</div>';
            } else {
                h += '<span style="color:#999;">Bazinis be savikainos — marža neskaičiuojama.</span>';
            }
            h += '</div></div>';
            calcEl.innerHTML = h;
            calcEl.style.display = 'block';

            createBtn.disabled = !(base && qty>=2 && title && sku && price>0);
        }

        // Sukurimas
        createBtn.addEventListener('click', function(){
            createBtn.disabled = true;
            statusEl.textContent = 'Kuriama...'; statusEl.style.color='#666';
            resultEl.style.display='none';
            var payload = {
                base_id: base.id,
                qty: parseInt(document.getElementById('dpf-qty').value) || 0,
                title: document.getElementById('dpf-title').value.trim(),
                sku: document.getElementById('dpf-sku').value.trim(),
                price: parseFloat(document.getElementById('dpf-price').value) || 0,
                proc: document.getElementById('dpf-proc').value.trim(),
                short_description: document.getElementById('dpf-short-desc').value.trim()
            };
            var fd = new FormData();
            fd.append('action','petshop_dp_create'); fd.append('nonce',nonce);
            fd.append('dp_data', JSON.stringify(payload));
            fetch(ajaxurl, {method:'POST', body:fd}).then(function(r){ return r.json(); }).then(function(res){
                if (res.success) {
                    var d = res.data;
                    resultEl.innerHTML = '<strong>✅ DP pakas sukurtas!</strong><br>'
                        + 'Kategorijos: ' + (d.categories||[]).join(', ') + '<br>'
                        + '<a href="'+d.edit_url+'" class="button" style="margin-top:8px;">Redaguoti</a> '
                        + '<a href="'+d.view_url+'" class="button" target="_blank" style="margin-top:8px;">Peržiūrėti</a>'
                        + '<p class="description" style="margin-top:8px;">✅ Nuotrauka švari; ×N VNT ženkliukas ir juosta pridedami automatiškai (CSS).</p>';
                    resultEl.style.display='block';
                    statusEl.textContent='';
                    // reset formos daliai
                } else {
                    statusEl.textContent = '❌ ' + (res.data || 'Klaida'); statusEl.style.color='#c00';
                    createBtn.disabled = false;
                }
            }).catch(function(err){
                statusEl.textContent = '❌ Tinklo klaida'; statusEl.style.color='#c00';
                createBtn.disabled = false;
            });
        });
    })();
    </script>
    <?php
    // v11: esami pakai — % vietoje
    if (class_exists('Petshop_DP_Kainos')) {
        $grupes = array('sausas'=>'Sausas maistas', 'konservai'=>'Konservai', 'skanestai'=>'Natūralūs skanėstai', 'kraikas'=>'Kraikas', ''=>'Kita');
        $eil = array();
        foreach (Petshop_DP_Kainos::visi_pakai() as $pid) {
            $pk = wc_get_product($pid); if (!$pk) continue;
            $b = intval(get_post_meta($pid, '_dp_base_product_id', true)); $bp = wc_get_product($b); $q = intval(get_post_meta($pid, '_dp_pack_qty', true));
            $eil[Petshop_DP_Kainos::grupe($b)][] = array('pid'=>$pid, 'pav'=>$pk->get_name(), 'b'=>$b, 'bpav'=>$bp ? $bp->get_name() : '(bazinė nerasta)', 'q'=>$q, 'breg'=>$bp ? $bp->get_regular_price('edit') : '', 'proc'=>get_post_meta($pid, '_dp_nuolaida_proc', true), 'reg'=>$pk->get_regular_price('edit'), 'sale'=>$pk->get_sale_price('edit'));
        }
        echo '<div class="wrap">'; echo '<h2 style="margin-top:36px;">Esami pakai — nuolaida %</h2><p class="description">Yra % → kaina = kiekis × bazinė × (1 − %), seka bazinę automatiškai. Tuščias % → kaina rankinė (keičiama prekės kortelėje). Pakeitus išsaugoma iš karto.</p>';
        foreach ($grupes as $g => $gl) {
            if (empty($eil[$g])) continue;
            echo '<h3>' . esc_html($gl) . ' (' . count($eil[$g]) . ')</h3><table class="widefat striped" style="max-width:1100px;"><thead><tr><th>Pakas</th><th>Bazinė</th><th style="text-align:right">Kiekis</th><th style="text-align:right">Bazinė kaina</th><th>Nuolaida %</th><th style="text-align:right">Pako kaina</th><th style="text-align:right">Sutaupo</th></tr></thead><tbody>';
            foreach ($eil[$g] as $e) {
                $viso = (float)$e['breg'] * $e['q']; $sut = $viso - (float)$e['reg'];
                echo '<tr data-pid="' . intval($e['pid']) . '" data-viso="' . esc_attr(number_format($viso, 2, '.', '')) . '"><td><a href="' . esc_url(get_edit_post_link($e['pid'])) . '">' . esc_html($e['pav']) . '</a></td><td><a href="' . esc_url(get_edit_post_link($e['b'])) . '">' . esc_html($e['bpav']) . '</a></td><td style="text-align:right">' . intval($e['q']) . '</td><td style="text-align:right">' . esc_html($e['breg']) . '</td>';
                echo '<td><input type="number" class="dpf-esamas-proc" step="0.5" min="0" max="60" value="' . esc_attr($e['proc']) . '" placeholder="rankinė" style="width:70px;"> % <span class="dpf-st" style="font-size:11px;color:#666;"></span></td>';
                echo '<td style="text-align:right"><strong class="dpf-kaina">' . esc_html($e['reg']) . '</strong>' . ($e['sale'] !== '' ? ' <span style="color:#c00">akc. ' . esc_html($e['sale']) . '</span>' : '') . '</td><td style="text-align:right" class="dpf-sut">' . number_format($sut, 2, ',', '') . ' € (' . ($viso > 0 ? round($sut / $viso * 100, 1) : 0) . ' %)</td></tr>';
            }
            echo '</tbody></table>';
        }
        echo '</div>';
        ?>
        <script>
        (function(){
            var nonce = '<?php echo esc_js($nonce); ?>';
            document.querySelectorAll('.dpf-esamas-proc').forEach(function(inp){
                inp.addEventListener('change', function(){
                    var tr = inp.closest('tr'), st = tr.querySelector('.dpf-st'); st.textContent = 'saugoma…'; st.style.color = '#666';
                    var fd = new FormData(); fd.append('action','petshop_dp_proc'); fd.append('nonce',nonce); fd.append('pid',tr.dataset.pid); fd.append('proc',inp.value);
                    fetch(ajaxurl, {method:'POST', credentials:'same-origin', body:fd}).then(function(r){ return r.json(); }).then(function(res){
                        if (!res.success) { st.textContent = '✗ ' + res.data; st.style.color = '#c00'; return; }
                        var d = res.data, viso = parseFloat(tr.dataset.viso) || 0, sut = viso - parseFloat(d.reg || 0);
                        tr.querySelector('.dpf-kaina').textContent = d.reg;
                        tr.querySelector('.dpf-sut').textContent = sut.toFixed(2).replace('.', ',') + ' € (' + (viso > 0 ? (sut / viso * 100).toFixed(1) : 0) + ' %)';
                        st.textContent = d.klaida ? '✗ ' + d.klaida : (d.proc === '' ? '✓ rankinė' : '✓ ' + d.reg); st.style.color = d.klaida ? '#c00' : '#2a8';
                        setTimeout(function(){ st.textContent = ''; }, 4000);
                    }).catch(function(){ st.textContent = '✗ tinklo klaida'; st.style.color = '#c00'; });
                });
            });
        })();
        </script>
        <?php
    }
}
