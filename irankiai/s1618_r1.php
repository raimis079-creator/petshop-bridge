<?php
/** TEMP PS S1618 run r1 — RECON (tik skaitymas) B „Naujas užsakymas“: pristatymo zonos/metodai/kainos, užsakymų shipping eilutės (Venipak kurjeris / paštomatas / LP), paštomatų sąrašų šaltiniai (Venipak, LP), variklio vezejas(), temos IAPV kabliai, mokėjimai, klientų paieškos lentelės, prekių paieška + likučiai. */
add_action('init', function(){
  if (!isset($_GET['ps_r1'])) return;
  $o=array('v'=>'S1618 r1'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  try{
  // 1. zonos
  foreach(WC_Shipping_Zones::get_zones() as $z){ $zz=array('id'=>$z['id'],'name'=>$z['zone_name'],'loc'=>array_map(function($l){return $l->code;},$z['zone_locations']),'m'=>array());
    foreach($z['shipping_methods'] as $m){ $zz['m'][]=array('id'=>$m->id,'inst'=>$m->instance_id,'title'=>$m->title,'on'=>$m->enabled,'set'=>array_intersect_key((array)$m->instance_settings,array_flip(array('cost','min_amount','requires','tax_status','free_shipping','free_shipping_amount','price','pickup_price','courier_price','type')))); }
    $o['zonos'][]=$zz; }
  $rz=new WC_Shipping_Zone(0); foreach($rz->get_shipping_methods() as $m){ $o['zona0'][]=array('id'=>$m->id,'inst'=>$m->instance_id,'title'=>$m->title,'on'=>$m->enabled); }
  // 2. užsakymų shipping eilutės pavyzdžiai
  $ids=$wpdb->get_col("SELECT id FROM {$p}wc_orders WHERE type='shop_order' AND status IN ('wc-processing','wc-completed') ORDER BY id DESC LIMIT 60");
  $seen=array(); foreach($ids as $id){ $x=wc_get_order($id); if(!$x) continue; foreach($x->get_items('shipping') as $sh){ $k=$sh->get_method_id().':'.$sh->get_instance_id(); if(isset($seen[$k])) continue; $seen[$k]=1;
      $meta=array(); foreach($sh->get_meta_data() as $md){ $meta[$md->key]=mb_substr(is_scalar($md->value)?(string)$md->value:json_encode($md->value),0,80); }
      $o['ship_pvz'][]=array('order'=>$id,'method'=>$sh->get_method_id(),'inst'=>$sh->get_instance_id(),'name'=>$sh->get_name(),'total'=>$sh->get_total(),'tax'=>$sh->get_total_tax(),'meta'=>$meta,'order_meta'=>array('vp'=>$x->get_meta('venipak_pickup_point'),'lp_t'=>$x->get_meta('_woo_lithuaniapost_lpexpress_terminal_id'),'lp_t2'=>mb_substr((string)$x->get_meta('_woo_lithuaniapost_lpexpress_terminal'),0,60),'vez'=>class_exists('Petshop_Desk')?'':'' ),'pm'=>$x->get_payment_method(),'pmt'=>$x->get_payment_method_title(),'via'=>$x->get_created_via()); } if(count($seen)>=6) break; }
  // 3. Venipak paštomatai — plugino šaltinis
  $vp_dir=WP_PLUGIN_DIR.'/'; $found=array(); foreach(glob($vp_dir.'*venipak*',GLOB_ONLYDIR) as $d){ $o['venipak_dir']=basename($d); foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($d)) as $fl){ if(substr($fl,-4)!=='.php') continue; $c=file_get_contents($fl); if(preg_match_all("/(get_option|get_transient|update_option|set_transient)\\(\\s*['\"]([a-z_\\-0-9]*(pickup|terminal|point)[a-z_\\-0-9]*)['\"]/i",$c,$mm,PREG_SET_ORDER)){ foreach($mm as $m){ $found[$m[2]]=basename($fl); } } if(preg_match_all("/\\\$wpdb->prefix\\s*\\.\\s*['\"]([a-z_]+)['\"]/",$c,$tt)){ foreach($tt[1] as $t){ $found['TABLE:'.$t]=basename($fl); } } if(preg_match('/function venipak_resolve_order_pickup/',$c)){ $o['venipak_resolve_file']=basename($fl); } } }
  $o['venipak_saltiniai']=$found;
  if(function_exists('venipak_resolve_order_pickup')){ $rf=new ReflectionFunction('venipak_resolve_order_pickup'); $o['venipak_resolve_src']=implode("\n",array_slice(file($rf->getFileName()),$rf->getStartLine()-1,min(40,$rf->getEndLine()-$rf->getStartLine()+1))); }
  $o['tables_like']=$wpdb->get_col("SHOW TABLES LIKE '{$p}%lithuania%'"); $o['tables_venipak']=$wpdb->get_col("SHOW TABLES LIKE '{$p}%venipak%'");
  $o['opt_pickup']=$wpdb->get_col("SELECT option_name FROM {$p}options WHERE option_name LIKE '%venipak%' OR option_name LIKE '%pickup%' OR option_name LIKE '%terminal%' OR option_name LIKE '%lithuaniapost%' LIMIT 40");
  foreach((array)$o['tables_like'] as $t){ $o['lp_tbl'][$t]=array('n'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM `$t`"),'cols'=>$wpdb->get_col("SHOW COLUMNS FROM `$t`"),'pvz'=>$wpdb->get_row("SELECT * FROM `$t` LIMIT 1",ARRAY_A)); }
  // 4. variklio vezejas
  foreach(array('vezejo_vardas','vezejas','pristatymo_tipas') as $mn){ if(method_exists('Petshop_Desk',$mn)){ $rm=new ReflectionMethod('Petshop_Desk',$mn); $o['desk_'.$mn]=implode("\n",array_slice(file($rm->getFileName()),$rm->getStartLine()-1,min(30,$rm->getEndLine()-$rm->getStartLine()+1))); } }
  $o['desk_methods_vez']=array_values(array_filter(array_map(function($m){return $m->name;},(new ReflectionClass('Petshop_Desk'))->getMethods()),function($n){return stripos($n,'vez')!==false||stripos($n,'prist')!==false||stripos($n,'lp')!==false||stripos($n,'pasto')!==false;}));
  // 5. tema IAPV / proforma
  $tf=get_stylesheet_directory().'/functions.php'; $lines=file($tf); foreach($lines as $i=>$l){ if(preg_match('/iapv|proforma|isankstin|bacs/i',$l) && preg_match('/add_action|add_filter|function /',$l)){ $o['tema_iapv'][]=($i+1).': '.mb_substr(trim($l),0,200); } }
  // 6. mokėjimai
  foreach(WC()->payment_gateways()->payment_gateways() as $g){ $o['gw'][]=array('id'=>$g->id,'on'=>$g->enabled,'title'=>$g->title,'instr'=>mb_substr((string)($g->settings['instructions']??''),0,120)); }
  $o['bacs_accounts']=get_option('woocommerce_bacs_accounts');
  // 7. klientai
  $o['klientai']=array('users'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}users"),'lookup'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_customer_lookup"),'addr_cols'=>$wpdb->get_col("SHOW COLUMNS FROM {$p}wc_order_addresses"),'addr_n'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_order_addresses WHERE address_type='billing'"),'phone_meta'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}usermeta WHERE meta_key='billing_phone' AND meta_value<>''"));
  // 8. prekių paieška
  $q='%royal%'; $o['prekes_pvz']=$wpdb->get_results($wpdb->prepare("SELECT p.ID,p.post_title,l.sku,l.min_price,l.max_price,l.stock_quantity,l.stock_status,p.post_type FROM {$p}posts p JOIN {$p}wc_product_meta_lookup l ON l.product_id=p.ID WHERE p.post_status='publish' AND p.post_type IN ('product','product_variation') AND (p.post_title LIKE %s OR l.sku LIKE %s) LIMIT 4",$q,$q),ARRAY_A);
  $o['prekiu_n']=array('product'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}posts WHERE post_type='product' AND post_status='publish'"),'variation'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}posts WHERE post_type='product_variation' AND post_status='publish'"));
  if($o['prekes_pvz']){ $pid=(int)$o['prekes_pvz'][0]['ID']; $pr=wc_get_product($pid); $o['preke1']=array('id'=>$pid,'type'=>$pr->get_type(),'price'=>$pr->get_price(),'regular'=>$pr->get_regular_price(),'sale'=>$pr->get_sale_price(),'incl'=>wc_get_price_including_tax($pr),'tax_class'=>$pr->get_tax_class(),'stock'=>$pr->get_stock_quantity(),'manage'=>$pr->managing_stock(),'av'=>class_exists('Petshop_AV_Stock')?Petshop_AV_Stock::qty($pid):'-','meta'=>array_values(array_filter(array_keys(get_post_meta($pid)),function($k){return preg_match('/^_(vf|zb|qu|am|pr|be|ps_|ambr|prins|quattro|belac)/i',$k);}))); }
  $o['fs_class']=class_exists('Petshop_Fulfillment_Source')?array_values(array_filter(array_map(function($m){return $m->name;},(new ReflectionClass('Petshop_Fulfillment_Source'))->getMethods()),function($n){return true;})):'nėra';
  $o['prices_incl_tax']=get_option('woocommerce_prices_include_tax'); $o['tax_based']=get_option('woocommerce_tax_based_on'); $o['calc_taxes']=get_option('woocommerce_calc_taxes');
  $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'");
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
