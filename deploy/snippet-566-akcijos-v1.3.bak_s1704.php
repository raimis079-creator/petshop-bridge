/**
 * Petshop Akcijos v1.3 (dinaminis gyvūno filtras)
 * Custom shortcode [psc_akcijos] Akcijų puslapiui.
 * Rodo: Woo sale prekes (SQL query) + prekes su "AKCIJA" pavadinime.
 * v1.3 pridėta: dinaminis filtras pagal gyvūno kategoriją.
 *   - Rodomos tik tos gyvūnų kategorijos, kur yra bent 1 akcijos prekė
 *   - URL param ?gyvunas=sunims filtruoja rezultatus
 *   - Kai kategorija tuščia — mygtukas automatiškai dingsta
 */

add_shortcode('psc_akcijos', function($atts){
  $atts = shortcode_atts(array(
    'per_page' => 30,
    'columns' => 4,
  ), $atts, 'psc_akcijos');
  
  global $wpdb;
  $now = time();
  
  // 1. Sale IDs (tiesioginis SQL, ne cache)
  $sale_ids = $wpdb->get_col($wpdb->prepare("
    SELECT DISTINCT p.ID FROM {$wpdb->posts} p
    INNER JOIN {$wpdb->postmeta} pm_sale ON pm_sale.post_id=p.ID AND pm_sale.meta_key='_sale_price'
    INNER JOIN {$wpdb->postmeta} pm_reg ON pm_reg.post_id=p.ID AND pm_reg.meta_key='_regular_price'
    LEFT JOIN {$wpdb->postmeta} pm_from ON pm_from.post_id=p.ID AND pm_from.meta_key='_sale_price_dates_from'
    LEFT JOIN {$wpdb->postmeta} pm_to ON pm_to.post_id=p.ID AND pm_to.meta_key='_sale_price_dates_to'
    WHERE p.post_type='product' AND p.post_status='publish'
    AND pm_sale.meta_value != '' AND pm_sale.meta_value != '0'
    AND CAST(pm_sale.meta_value AS DECIMAL(10,2)) < CAST(pm_reg.meta_value AS DECIMAL(10,2))
    AND (pm_from.meta_value IS NULL OR pm_from.meta_value = '' OR CAST(pm_from.meta_value AS UNSIGNED) <= %d)
    AND (pm_to.meta_value IS NULL OR pm_to.meta_value = '' OR CAST(pm_to.meta_value AS UNSIGNED) >= %d)
  ", $now, $now));
  
  // 2. AKCIJA pavadinime
  $akcija_ids = $wpdb->get_col("
    SELECT ID FROM {$wpdb->posts}
    WHERE post_type='product' AND post_status='publish'
    AND (post_title LIKE '%AKCIJA%' OR post_title LIKE '%akcija%')");
  
  $all_ids = array_unique(array_merge(
    array_map('intval', $sale_ids),
    array_map('intval', $akcija_ids)
  ));
  
  if (empty($all_ids)) {
    return '<p>Šiuo metu galiojančių akcijų nėra.</p>';
  }
  
  // 3. Gyvūnų kategorijos ir jų akcijos skaičius
  $pet_slugs = array(
    'sunims'     => 'Šunims',
    'katems'     => 'Katėms',
    'grauzikams' => 'Graužikams',
    'pauksciams' => 'Paukščiams',
    'zuvims'     => 'Žuvims',
  );
  
  $filter_counts = array();
  $in_ids_str = implode(',', array_map('intval',$all_ids));
  
  foreach ($pet_slugs as $slug => $label) {
    $t = get_term_by('slug',$slug,'product_cat');
    if (!$t) continue;
    $all_cat_ids = array_merge(array($t->term_id), get_term_children($t->term_id,'product_cat'));
    $placeholders = implode(',', array_map('intval',$all_cat_ids));
    $ids_here = $wpdb->get_col("
      SELECT DISTINCT p.ID FROM {$wpdb->posts} p
      INNER JOIN {$wpdb->term_relationships} tr ON tr.object_id=p.ID
      INNER JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='product_cat'
      WHERE p.ID IN ($in_ids_str) AND tt.term_id IN ($placeholders)");
    if (count($ids_here) > 0) {
      $filter_counts[$slug] = array(
        'label' => $label,
        'count' => count($ids_here),
        'ids' => array_map('intval',$ids_here),
      );
    }
  }
  
  // 4. Aktyvus filtras (is URL)
  $active = isset($_GET['gyvunas']) ? sanitize_key($_GET['gyvunas']) : '';
  if ($active && !isset($filter_counts[$active])) $active = '';
  
  // 5. Filtruoti IDs pagal aktyvu gyvuna
  if ($active && isset($filter_counts[$active])) {
    $filtered_ids = $filter_counts[$active]['ids'];
  } else {
    $filtered_ids = $all_ids;
  }
  
  // 6. Sort by populiarumas
  usort($filtered_ids, function($a,$b){
    $sa = (int) get_post_meta($a,'total_sales',true);
    $sb = (int) get_post_meta($b,'total_sales',true);
    return $sb - $sa;
  });
  
  // 7. Limit
  $per_page = (int) $atts['per_page'];
  if ($per_page > 0) $filtered_ids = array_slice($filtered_ids, 0, $per_page);
  
  // 8. Renderis
  ob_start();
  
  // Filtro mygtukai
  $base_url = strtok($_SERVER['REQUEST_URI'],'?');
  $total_count = count($all_ids);
  
  echo '<div class="psc-akc-filter">';
  echo '<span class="psc-akc-filter-label">Rodyti akcijas:</span>';
  echo '<a href="'.esc_url($base_url).'" class="psc-akc-btn'.($active===''?' is-active':'').'">Visos <span class="psc-akc-count">('.$total_count.')</span></a>';
  foreach ($filter_counts as $slug => $data) {
    $url = esc_url(add_query_arg('gyvunas',$slug,$base_url));
    $is_active = ($active === $slug) ? ' is-active' : '';
    echo '<a href="'.$url.'" class="psc-akc-btn'.$is_active.'">'.esc_html($data['label']).' <span class="psc-akc-count">('.$data['count'].')</span></a>';
  }
  echo '</div>';
  
  // CSS
  echo '<style>
    .psc-akc-filter{margin:0 0 24px;padding:16px 0;border-bottom:1px solid #e5e5e5;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
    .psc-akc-filter-label{font-weight:600;margin-right:8px;color:#333}
    .psc-akc-btn{display:inline-block;padding:8px 16px;background:#f5f5f5;border-radius:20px;color:#333;text-decoration:none;font-size:14px;transition:all .15s ease;line-height:1.4}
    .psc-akc-btn:hover{background:#e5e5e5;color:#000;text-decoration:none}
    .psc-akc-btn.is-active{background:#2f5f46;color:#fff}
    .psc-akc-btn.is-active:hover{background:#264c38;color:#fff}
    .psc-akc-count{opacity:.7;font-size:12px;margin-left:2px}
    @media (max-width:600px){
      .psc-akc-filter-label{width:100%;margin-bottom:4px}
      .psc-akc-btn{padding:6px 12px;font-size:13px}
    }
  </style>';
  
  // Produktu grid
  if (!empty($filtered_ids)) {
    $ids_str = implode(',', $filtered_ids);
    $columns = (int) $atts['columns'];
    echo do_shortcode('[products ids="'.$ids_str.'" columns="'.$columns.'" limit="'.count($filtered_ids).'" orderby="post__in"]');
  } else {
    echo '<p>Šioje kategorijoje šiuo metu akcijų nėra.</p>';
  }
  
  return ob_get_clean();
});