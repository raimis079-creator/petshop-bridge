<?php
/** TEMP PS S1614 run e2r — RECON (tik skaitymas) #2 Redaguoti: adresas/paštomatas + V14. Venipak/LP pluginai: kur saugo paštomatą, adresą, klaidą; Petshop_Desk::klausimas/vezejas; Petshop_Siuntos registracijos adreso šaltinis; testinių užsakymų pristatymo meta. */
add_action('init', function(){
  if (!isset($_GET['ps_e2r'])) return;
  $o=array('v'=>'S1614 e2r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $src=function($cls,$m,$max=60){ try{ $r=new ReflectionMethod($cls,$m); $f=file($r->getFileName()); $a=$r->getStartLine()-1; $n=min($max,$r->getEndLine()-$a); return array('f'=>basename($r->getFileName()).':'.$r->getStartLine().'-'.$r->getEndLine(),'src'=>array_map(function($l){ return rtrim(mb_substr($l,0,300)); },array_slice($f,$a,$n))); }catch(Throwable $e){ return 'ERR '.$e->getMessage(); } };
  $grep=function($dir,$re,$max=40){ $out=array(); $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir,FilesystemIterator::SKIP_DOTS)); foreach($it as $f){ if(substr($f,-4)!=='.php') continue; $ls=@file($f); if(!$ls) continue; foreach($ls as $i=>$l){ if(preg_match($re,$l)){ $out[]=str_replace($dir.'/','',$f).':'.($i+1).': '.trim(mb_substr($l,0,220)); if(count($out)>=$max) return $out; } } } return $out; };
  try{
    // pluginai
    if(!function_exists('get_plugins')) require_once ABSPATH.'wp-admin/includes/plugin.php';
    $pl=get_plugins(); $act=get_option('active_plugins'); foreach($pl as $k=>$v){ if(preg_match('/venipak|lithuaniapost|lp express|omniva/i',$k.$v['Name'])) $o['pluginai'][$k]=array($v['Name'],$v['Version'],in_array($k,$act)?'aktyvus':'ne'); }
    $vpdir=null; $lpdir=null; foreach(array_keys($o['pluginai']??array()) as $k){ $d=WP_PLUGIN_DIR.'/'.dirname($k); if(stripos($k,'venipak')!==false) $vpdir=$d; if(stripos($k,'lithuaniapost')!==false) $lpdir=$d; }
    $o['dirs']=array($vpdir,$lpdir);
    // Venipak: paštomato / terminalo meta, adresas, klaida
    if($vpdir){ $o['vp_meta_grep']=$grep($vpdir,'/update_meta_data\(|update_post_meta\(|add_meta_data\(/',60); $o['vp_pickup_grep']=$grep($vpdir,'/pickup_point|terminal_id|venipak_pickup/',40); $o['vp_error_grep']=$grep($vpdir,'/error|klaida/i',25); }
    // LP: terminalas, klaida, adreso šaltinis
    if($lpdir){ $o['lp_meta_grep']=$grep($lpdir,'/update_meta_data\(\s*[\'"]_woo_lithuaniapost|update_post_meta\(.*_woo_lithuaniapost/',60); $o['lp_terminal_grep']=$grep($lpdir,'/terminal|parcel_create_error|parcel-failed/i',50); $o['lp_addr_grep']=$grep($lpdir,'/get_shipping_address_1|get_shipping_city|get_shipping_postcode|get_billing_phone|get_shipping_phone/',30); }
    // variklis
    $o['desk_klausimas']=$src('Petshop_Desk','klausimas',80); $o['desk_vezejas']=$src('Petshop_Desk','vezejas',30); $o['desk_vezejo_vardas']=$src('Petshop_Desk','vezejo_vardas',20);
    foreach(array('turi_siunta','siuntos_kodas','pakuociu','reikia_pakuociu') as $m){ $o['desk_'.$m]=$src('Petshop_Desk',$m,25); }
    $o['siuntos_metodai']=array_map(function($m){ return $m->getName(); },(new ReflectionClass('Petshop_Siuntos'))->getMethods());
    foreach(array('registruoti','zalias','prideti_is_plugino','sarasas','turi') as $m){ if(method_exists('Petshop_Siuntos',$m)) $o['siuntos_'.$m]=$src('Petshop_Siuntos',$m,70); }
    // darbalaukio vp_reg kelias: senas desk veiksmas
    $o['desk_metodai_vp']=array_values(array_filter(array_map(function($m){ return $m->getName(); },(new ReflectionClass('Petshop_Desk'))->getMethods()),function($n){ return preg_match('/vp|reg|siunt|adres|pasto|lp_|venipak/i',$n); }));
    // testiniai užsakymai: pristatymo metodas + vežėjo meta
    $ids=array_merge(range(35414,35444),array(35450),range(35771,35780));
    foreach($ids as $id){ $x=wc_get_order($id); if(!$x) continue; $sm=array(); foreach($x->get_shipping_methods() as $s){ $sm[]=$s->get_method_id().':'.$s->get_instance_id().' '.$s->get_name(); } $mk=array(); foreach($x->get_meta_data() as $m){ if(preg_match('/venipak|lithuaniapost|pickup|terminal|omniva|pastomat|_ps_vez|_ps_kelias|_ps_sandelis|_ps_vp/i',$m->key)) $mk[$m->key]=is_scalar($m->value)?mb_substr((string)$m->value,0,80):json_encode($m->value); }
      $o['uzs'][$id]=array('st'=>$x->get_status(),'sm'=>$sm,'adr'=>mb_substr(str_replace("\n",', ',wp_strip_all_tags(str_replace('<br/>',', ',$x->get_formatted_shipping_address()))),0,120),'tel'=>$x->get_billing_phone().'/'.$x->get_shipping_phone(),'meta'=>$mk); }
    // Zonos/metodai: kokie shipping metodai sistemoje
    $o['metodai']=$wpdb->get_results("SELECT instance_id,method_id,is_enabled FROM {$p}woocommerce_shipping_zone_methods",ARRAY_A);
    // LP lentelė terminalams?
    $o['lp_lenteles']=$wpdb->get_col("SHOW TABLES LIKE '{$p}woo_lithuaniapost%'"); $o['vp_lenteles']=$wpdb->get_col("SHOW TABLES LIKE '{$p}%venipak%'");
    $o['vp_opcijos']=$wpdb->get_col("SELECT option_name FROM {$p}options WHERE option_name LIKE '%venipak%' LIMIT 30"); $o['lp_opcijos']=$wpdb->get_col("SELECT option_name FROM {$p}options WHERE option_name LIKE '%lithuaniapost%' LIMIT 30");
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
