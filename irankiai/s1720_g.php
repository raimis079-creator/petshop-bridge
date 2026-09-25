<?php
/** Plugin Name: TEMP PS S1720g — kur klientui rodoma „kasa" (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1720g'])) return; $r=['v'=>'S1720g'];
  global $wpdb; $p=$wpdb->prefix; @set_time_limit(280);
  try{
  $pg=get_page_by_path('kasa'); $r['psl_kasa']=$pg?['id'=>$pg->ID,'title'=>$pg->post_title,'slug'=>$pg->post_name,'wc_checkout_page_id'=>get_option('woocommerce_checkout_page_id'),'rm_title'=>get_post_meta($pg->ID,'rank_math_title',true)]:'-';
  $r['endpoints']=['checkout'=>get_option('woocommerce_checkout_pay_endpoint'),'received'=>get_option('woocommerce_checkout_order_received_endpoint')];
  // mu-plugins + child: klientui matomos frazės su „kas"
  $hits=[]; foreach(array_merge(glob(WPMU_PLUGIN_DIR.'/*.php'),[get_stylesheet_directory().'/functions.php'],glob(WPMU_PLUGIN_DIR.'/ps-sablonai/*.php'),glob(WPMU_PLUGIN_DIR.'/petshop-core/templates/emails/*/*.php')) as $fn){ $c=file_get_contents($fn); if(preg_match_all('/[\'">][^\'"<>]{0,60}\b(kas[aąoęą]|Kas[aąoę]|į kasą|kasoje|Kasoje)\b[^\'"<>]{0,60}[\'"<]/u',$c,$m)){ $u=array_values(array_unique(array_map('trim',$m[0]))); $u=array_filter($u,function($x){return !preg_match('/\/kasa\/|kasa\?|is_checkout|kasa_|_kasa|ps_kasa|kasa\.php|kasoje\(\)|\bkasoje\(/',$x);}); if($u) $hits[str_replace(ABSPATH,'',$fn)]=array_slice(array_values($u),0,8);} } $r['kodas']=$hits;
  // snippets aktyvūs
  $r['snippets']=$wpdb->get_results("SELECT id,name FROM {$p}snippets WHERE active=1 AND (code LIKE '%į kasą%' OR code LIKE '%Kasa%' OR code LIKE '%kasoje%')",ARRAY_A);
  // WC/Flatsome vertimai (gettext) — ką rodo frontend
  foreach(['Checkout','Proceed to checkout','Proceed to Checkout','Cart','View cart','Go to checkout','Place order','Return to cart','Continue shopping','Your order','Billing details','Ship to a different address?','Have a coupon?','Update cart','Cart totals'] as $s){ $r['gettext_wc'][$s]=__($s,'woocommerce'); $f=__($s,'flatsome'); if($f!==$s) $r['gettext_fl'][$s]=$f; }
  // gyvi HTML: krepšelis, mini (footer), kasa
  foreach(['/krepselis/','/kasa/','/'] as $u){ $rs=wp_remote_get(home_url($u),['timeout'=>20,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-s1720']); $b=wp_remote_retrieve_body($rs); preg_match_all('/>([^<>]{0,50}\b[Kk]as(?:a|ą|os|oje|ai)\b[^<>]{0,50})</u',$b,$m); $r['html'][$u]=['http'=>wp_remote_retrieve_response_code($rs),'frazes'=>array_values(array_unique(array_map('trim',$m[1])))]; if(preg_match('/<title>([^<]+)</',$b,$t)) $r['html'][$u]['title']=$t[1]; }
  // menu
  $r['menu']=$wpdb->get_results("SELECT p.ID,p.post_title,pm.meta_value url FROM {$p}posts p LEFT JOIN {$p}postmeta pm ON pm.post_id=p.ID AND pm.meta_key='_menu_item_url' WHERE p.post_type='nav_menu_item' AND (p.post_title LIKE '%kas%' OR pm.meta_value LIKE '%kasa%')",ARRAY_A);
  // laiškų šablonai DB (ps email drafts) su kasa
  $r['laiskai']=$wpdb->get_results("SELECT ID,post_title FROM {$p}posts WHERE post_type IN ('ps_email','ps_email_template','ps_laiskas') AND post_content LIKE '%kas%' LIMIT 10",ARRAY_A);
  // legacy nuorodos į /kasa/ kode (kiek failų) — kad žinotume slug keitimo kainą
  $n=0; foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $fn){ if(strpos(file_get_contents($fn),'/kasa/')!==false) $n++; } $r['failu_su_kasa_slug']=$n;
  $r['snippets_su_slug']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE active=1 AND code LIKE '%/kasa/%'");
  }catch(Throwable $e){ $r['ERR']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
