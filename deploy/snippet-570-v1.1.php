/**
 * Petshop Daugiau=Pigiau puslapio shortcode v1.1
 * v1.1 (S1736, 2026-09-29): rodė tik 48 pirmus pakus (array_slice, be puslapių), nors „Visos (235)" —
 *   dabar visi, po 48 puslapyje su puslapiavimu (WC [products paginate], ?product-page=N).
 * [psc_daugiau_pigiau] - rodo visus "Daugiau=pigiau" pack'us (turi _dp_base_product_id).
 * Dinaminis gyvūno filtras: mygtukas rodomas TIK jei toje rūšyje yra bent 1 pack.
 * Ta pati logika ir stilius kaip Akcijų puslapyje (snippet 566).
 */

add_shortcode('psc_daugiau_pigiau', function($atts){
  $atts = shortcode_atts(array(
    'per_page' => 48,
    'columns'  => 4,
  ), $atts, 'psc_daugiau_pigiau');
  
  global $wpdb;
  
  // 1. Visi DP pack'ai (turi _dp_base_product_id)
  $all_ids = $wpdb->get_col("
    SELECT DISTINCT p.ID FROM {$wpdb->posts} p
    INNER JOIN {$wpdb->postmeta} pm ON pm.post_id=p.ID AND pm.meta_key='_dp_base_product_id'
    WHERE p.post_type='product' AND p.post_status='publish'");
  $all_ids = array_map('intval', $all_ids);
  
  if (empty($all_ids)) {
    return '<p>Šiuo metu „Daugiau = pigiau" pasiūlymų nėra.</p>';
  }
  
  // 2. Gyvūnų kategorijos ir jų DP pack skaičius (dinamiskai - VISOS rusys)
  $pet_slugs = array(
    'sunims'     => 'Šunims',
    'katems'     => 'Katėms',
    'grauzikams' => 'Graužikams',
    'pauksciams' => 'Paukščiams',
    'zuvims'     => 'Žuvims',
  );
  
  $filter_counts = array();
  $in_ids_str = implode(',', $all_ids);
  
  foreach ($pet_slugs as $slug => $label) {
    $t = get_term_by('slug', $slug, 'product_cat');
    if (!$t) continue;
    $all_cat_ids = array_merge(array($t->term_id), get_term_children($t->term_id, 'product_cat'));
    $placeholders = implode(',', array_map('intval', $all_cat_ids));
    $ids_here = $wpdb->get_col("
      SELECT DISTINCT p.ID FROM {$wpdb->posts} p
      INNER JOIN {$wpdb->term_relationships} tr ON tr.object_id=p.ID
      INNER JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='product_cat'
      WHERE p.ID IN ($in_ids_str) AND tt.term_id IN ($placeholders)");
    // Mygtukas rodomas TIK jei yra bent 1 preke; kitaip slepiamas
    if (count($ids_here) > 0) {
      $filter_counts[$slug] = array(
        'label' => $label,
        'count' => count($ids_here),
        'ids'   => array_map('intval', $ids_here),
      );
    }
  }
  
  // 3. Aktyvus filtras
  $active = isset($_GET['gyvunas']) ? sanitize_key($_GET['gyvunas']) : '';
  if ($active && !isset($filter_counts[$active])) $active = '';
  
  // 4. Filtruoti IDs
  if ($active && isset($filter_counts[$active])) {
    $filtered_ids = $filter_counts[$active]['ids'];
  } else {
    $filtered_ids = $all_ids;
  }
  
  // 5. Sort by populiarumas
  usort($filtered_ids, function($a,$b){
    $sa = (int) get_post_meta($a,'total_sales',true);
    $sb = (int) get_post_meta($b,'total_sales',true);
    return $sb - $sa;
  });
  
  // 6. Limit
  $per_page = (int) $atts['per_page']; // v1.1: nebekarpoma — puslapiuoja [products paginate]
  
  // 7. Renderis
  ob_start();
  $base_url = strtok($_SERVER['REQUEST_URI'], '?');
  $total_count = count($all_ids);
  
  echo '<div class="psc-dp-filter">';
  echo '<span class="psc-dp-filter-label">Rodyti:</span>';
  echo '<a href="'.esc_url($base_url).'" class="psc-dp-btn'.($active===''?' is-active':'').'">Visos <span class="psc-dp-count">('.$total_count.')</span></a>';
  foreach ($filter_counts as $slug => $data) {
    $url = esc_url(add_query_arg('gyvunas',$slug,$base_url));
    $is_active = ($active === $slug) ? ' is-active' : '';
    echo '<a href="'.$url.'" class="psc-dp-btn'.$is_active.'">'.esc_html($data['label']).' <span class="psc-dp-count">('.$data['count'].')</span></a>';
  }
  echo '</div>';
  
  echo '<style>
    .psc-dp-filter{margin:0 0 24px;padding:16px 0;border-bottom:1px solid #e5e5e5;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
    .psc-dp-filter-label{font-weight:600;margin-right:8px;color:#333}
    .psc-dp-btn{display:inline-block;padding:8px 16px;background:#f5f5f5;border-radius:20px;color:#333;text-decoration:none;font-size:14px;transition:all .15s ease;line-height:1.4}
    .psc-dp-btn:hover{background:#e5e5e5;color:#000;text-decoration:none}
    .psc-dp-btn.is-active{background:#2f5f46;color:#fff}
    .psc-dp-btn.is-active:hover{background:#264c38;color:#fff}
    .psc-dp-count{opacity:.7;font-size:12px;margin-left:2px}
    @media (max-width:600px){
      .psc-dp-filter-label{width:100%;margin-bottom:4px}
      .psc-dp-btn{padding:6px 12px;font-size:13px}
    }
  </style>';
  
  if (!empty($filtered_ids)) {
    $ids_str = implode(',', $filtered_ids);
    $columns = (int) $atts['columns'];
    $limit = $per_page > 0 ? $per_page : count($filtered_ids);
    echo do_shortcode('[products ids="'.$ids_str.'" columns="'.$columns.'" limit="'.$limit.'" paginate="true" orderby="post__in"]');
  } else {
    echo '<p>Šioje kategorijoje „Daugiau = pigiau" pasiūlymų nėra.</p>';
  }
  
  return ob_get_clean();
});