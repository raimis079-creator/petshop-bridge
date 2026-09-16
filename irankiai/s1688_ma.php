<?php
/** TEMP PS S1688 ma — RECON (read-only) priminimo registracijai prekės puslapyje: refill variklio API + ps_refill_tracking stulpeliai; skaičiuoklės front-end (kur .ps-calc-out, JS įvykiai, REST); magic login REST + redirect; Petshop_Sutikimai/Lifecycle_Vartai/Pet_Profile viešos funkcijos. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688ma'])) return; global $wpdb; $o=array('v'=>'S1688 ma');
  $met=function($cls){ if(!class_exists($cls)) return 'nera'; $r=new ReflectionClass($cls); $out=array('file'=>str_replace(ABSPATH,'',$r->getFileName())); foreach($r->getMethods() as $m){ if(!$m->isPublic()) continue; $p=array(); foreach($m->getParameters() as $pp){$p[]=($pp->isOptional()?'?':'').'$'.$pp->getName();} $out['m'][]=($m->isStatic()?'s ':'').$m->getName().'('.implode(',',$p).')'; } return $out; };
  foreach(array('Petshop_Refill_Engine','Refill_Engine','Petshop_Feeding_Service','Feeding_Service','Petshop_Magic_Login','Magic_Login','Petshop_Sutikimai','Petshop_Lifecycle_Vartai','Petshop_Pet_Profile','Pet_Profile','Petshop_Pakartoti') as $c) $o['cls'][$c]=$met($c);
  $o['refill_cols']=$wpdb->get_results("SHOW COLUMNS FROM {$wpdb->prefix}ps_refill_tracking",ARRAY_A); $o['refill_cols']=array_map(function($c){return $c['Field'].' '.$c['Type'];},$o['refill_cols']);
  $o['refill_pvz']=$wpdb->get_row("SELECT * FROM {$wpdb->prefix}ps_refill_tracking ORDER BY id DESC LIMIT 1",ARRAY_A);
  $o['refill_status']=$wpdb->get_results("SELECT status,COUNT(*) n FROM {$wpdb->prefix}ps_refill_tracking GROUP BY status",ARRAY_A);
  // skaičiuoklės front-end: kur renderinama, REST kelias, JS failai
  $core=WP_CONTENT_DIR.'/plugins/petshop-core'; $o['core_files']=array_map('basename',array_merge(glob($core.'/includes/*.php'),glob($core.'/assets/*.js')));
  foreach(glob($core.'/includes/*.php') as $f){ $s=file_get_contents($f); if(strpos($s,'ps-calc')!==false){ $o['calc_php'][]=basename($f); foreach(file($f) as $i=>$l){ if(preg_match('/ps-calc-out|ps-calc-go|register_rest_route|do_action|apply_filters|wp_enqueue_script|wp_localize/',$l)) $o['calc_php_l'][basename($f)][]=($i+1).': '.trim(mb_substr($l,0,170)); } } }
  foreach(glob($core.'/assets/*.js') as $f){ $s=file_get_contents($f); if(strpos($s,'ps-calc')!==false){ $o['calc_js'][]=basename($f).' '.strlen($s); foreach(preg_split('/\n/',$s) as $i=>$l){ if(preg_match('/ps-calc-out|fetch\(|dispatchEvent|CustomEvent|innerHTML|days|cost_day/',$l)) $o['calc_js_l'][basename($f)][]=($i+1).': '.trim(mb_substr($l,0,170)); } } }
  // magic login: REST route, redirect palaikymas
  foreach(glob($core.'/includes/class-magic-login.php') as $f){ foreach(file($f) as $i=>$l) if(preg_match('/register_rest_route|redirect|\$_GET\[|\$_REQUEST\[|get_param|user_meta|transient/',$l)) $o['magic'][]=($i+1).': '.trim(mb_substr($l,0,170)); }
  // refill engine: kaip sukuriama eilutė
  foreach(glob($core.'/includes/class-refill-engine.php') as $f){ foreach(file($f) as $i=>$l) if(preg_match('/function |INSERT|insert\(|predicted_empty|confidence|do_action|apply_filters/',$l)) $o['refill_l'][]=($i+1).': '.trim(mb_substr($l,0,170)); }
  $o['optin_meta_pvz']=$wpdb->get_results("SELECT meta_key,COUNT(*) n FROM {$wpdb->usermeta} WHERE meta_key IN ('ps_soft_optin_eligible','ps_similar_optout','ps_weight_signal','_ps_email_verified') GROUP BY meta_key",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
});
