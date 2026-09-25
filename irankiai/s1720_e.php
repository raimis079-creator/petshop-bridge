<?php
/** Plugin Name: TEMP PS S1720e — telefonas (1 = kur koks numeris; 2 = įrašyti woocommerce_store_phone + patikra; #18054 būsena) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1720e'])) return; $f=$_GET['ps_s1720e']; $r=['v'=>'S1720e','faze'=>$f];
  global $wpdb; $p=$wpdb->prefix;
  try{
  $r['leger_18054']=['status'=>get_post_status(18054),'title'=>get_the_title(18054)];
  $r['store_phone']=get_option('woocommerce_store_phone');
  foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $fn){ $c=file_get_contents($fn); if(preg_match_all('/\+?370[\s\d\-]{6,14}|8[\s\-]?6\d{2}[\s\-]?\d{5}/',$c,$m)) $r['mu'][basename($fn)]=array_values(array_unique(array_map('trim',$m[0]))); }
  $c=file_get_contents(get_stylesheet_directory().'/functions.php'); if(preg_match_all('/\+?370[\s\d\-]{6,14}/',$c,$m)) $r['child_functions']=array_values(array_unique($m[0]));
  $rs=wp_remote_get(home_url('/'),['timeout'=>20,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-s1720']); $b=wp_remote_retrieve_body($rs);
  if(preg_match_all('/\+?370[\s\d\-]{6,14}/',$b,$m)) $r['home_html']=array_values(array_unique(array_map('trim',$m[0])));
  if(preg_match_all('/"telephone"\s*:\s*"([^"]+)"/',$b,$m)) $r['schema_tel']=array_values(array_unique($m[1]));
  if(preg_match_all('/href="tel:([^"]+)"/',$b,$m)) $r['tel_links']=array_values(array_unique($m[1]));
  $r['opcijos']=$wpdb->get_results("SELECT option_name,LEFT(option_value,60) v FROM {$p}options WHERE option_name LIKE '%phone%' OR option_name LIKE '%telefon%' LIMIT 20",ARRAY_A);
  if($f==='2'){ $tel='+370 681 87787'; update_option('ps_paieska_kontaktas_tel',$tel,false); $r['irasyta']=get_option('ps_paieska_kontaktas_tel');
    $rs=wp_remote_get(home_url('/?s=bravecto&post_type=product'),['timeout'=>20,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-s1720']); $b=wp_remote_retrieve_body($rs); $r['nulinis_tel']=preg_match('/ps-paieska-kontaktas.*?<\/p>/s',$b,$m)?preg_replace('/\s+/',' ',strip_tags($m[0])):'-'; }
  }catch(Throwable $e){ $r['ERR']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE); exit;
});
