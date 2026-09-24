<?php
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1711b'])) return;
  global $wpdb; $r=[];
  $r['legacy_blog']=$wpdb->get_results("SELECT p.ID,p.post_type,p.post_status,p.post_name,m.meta_key,m.meta_value FROM {$wpdb->postmeta} m JOIN {$wpdb->posts} p ON p.ID=m.post_id WHERE m.meta_key IN ('_petshop_legacy_url','_petshop_legacy_slug') AND p.post_type IN ('post','page') LIMIT 80",ARRAY_A);
  $r['posts']=$wpdb->get_results("SELECT ID,post_name,post_status,post_date FROM {$wpdb->posts} WHERE post_type='post' ORDER BY ID",ARRAY_A);
  $r['blog_legacy_any']=$wpdb->get_results("SELECT post_id,meta_key,meta_value FROM {$wpdb->postmeta} WHERE meta_value LIKE '%blogid%' LIMIT 20",ARRAY_A);
  $map=json_decode(file_get_contents(WPMU_PLUGIN_DIR.'/petshop-legacy-301-map.json'),true);
  $r['map_sample']=array_slice($map,0,5,true);
  $r['map_blogish']=array_slice(array_filter($map,function($v,$k){return preg_match('/straips|blog|patar|mastif|taks/',$k.' '.(is_string($v)?$v:json_encode($v)));},ARRAY_FILTER_USE_BOTH),0,40,true);
  $paths=['trixie-kilimelis-purvui-surinkti-120-80-cm','kiaules-snipas-baltas','automatine-serykla-kateisuniui','kraikas-katems-tofu-belocat-original-bekvapis-6-l-2-5-kg-2-mm-granules','sterilizuotu-kaciu-maistas','saturn-petcare-gmbh-athena','finnern-gmbh-and-co','saldziosios-bulves-apvyniotos-antiena-500-g-naturalus-skanestai-sunims-hau-and-miau'];
  foreach($paths as $p){
    $w=array_filter(explode('-',$p),function($x){return strlen($x)>=5;}); $w=array_slice(array_values($w),0,3);
    $like=implode(' AND ',array_map(function($x)use($wpdb){return $wpdb->prepare('post_name LIKE %s','%'.$wpdb->esc_like(substr($x,0,6)).'%');},$w));
    $r['cand'][$p]=$like?$wpdb->get_results("SELECT ID,post_name,post_status,post_type FROM {$wpdb->posts} WHERE post_type IN ('product','post','page') AND ($like) ORDER BY post_status='publish' DESC LIMIT 6",ARRAY_A):[];
    $r['legacy'][$p]=$wpdb->get_results($wpdb->prepare("SELECT post_id,meta_key FROM {$wpdb->postmeta} WHERE meta_key IN ('_petshop_legacy_slug','_petshop_legacy_url') AND meta_value LIKE %s LIMIT 3",'%'.$p.'%'),ARRAY_A);
  }
  foreach(['saturn-petcare','finnern','athena','hau-and-miau','hau-miau'] as $b){ $t=get_term_by('slug',$b,'product_brand'); $r['brand'][$b]=$t?$t->term_id:null; }
  $r['brands_like']=$wpdb->get_results("SELECT t.slug,t.name FROM {$wpdb->terms} t JOIN {$wpdb->term_taxonomy} x ON x.term_id=t.term_id WHERE x.taxonomy='product_brand' AND (t.slug LIKE '%saturn%' OR t.slug LIKE '%athena%' OR t.slug LIKE '%finnern%' OR t.slug LIKE '%hau%' OR t.slug LIKE '%belocat%' OR t.slug LIKE '%trixie%')",ARRAY_A);
  $r['cats_like']=$wpdb->get_results("SELECT t.slug,t.term_id FROM {$wpdb->terms} t JOIN {$wpdb->term_taxonomy} x ON x.term_id=t.term_id WHERE x.taxonomy='product_cat' AND (t.slug LIKE '%steril%' OR t.slug LIKE '%serykl%' OR t.slug LIKE '%snip%' OR t.slug LIKE '%kilimel%' OR t.slug LIKE '%kraik%')",ARRAY_A);
  wp_send_json($r);
}, 1);
