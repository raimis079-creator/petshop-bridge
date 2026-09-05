<?php
/** TEMP PS S1617 run r7 (recon, tik skaitymas) — kreditinė: temos base.php segmentai (antraštė 1–80, kreditinės eilutės 370–470), temos functions.php `petshop_generate_invoice_pdf` (292–360), WCDN renderer `$order['refund']` šaltinis, WCDN template `creditnote` enabled/registracija, seno desk creditnote. */
add_action('init', function(){
  if (!isset($_GET['ps_r7'])) return;
  $o=array('v'=>'S1617 r7'); global $wpdb; $p=$wpdb->prefix; set_time_limit(200);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $seg=function($file,$a,$b){ if(!file_exists($file)) return 'NĖRA'; $l=file($file); $r=array(); for($i=$a-1;$i<min($b,count($l));$i++){ $r[]=($i+1).': '.rtrim($l[$i]); } return implode("\n",$r); };
  $th=get_stylesheet_directory(); $pd=WP_PLUGIN_DIR.'/woocommerce-delivery-notes';
  $o['base_1_80']=$seg($th.'/woocommerce-delivery-notes/base.php',1,80);
  $o['base_370_470']=$seg($th.'/woocommerce-delivery-notes/base.php',370,470);
  $o['fn_292_360']=$seg($th.'/functions.php',292,360);
  $o['renderer_225_265']=$seg($pd.'/includes/services/template/class-template-renderer.php',225,265);
  $grep=function($file,$pats,$ctx=1,$max=30,$w=420){ $r=array(); if(!file_exists($file)) return 'NĖRA '.$file; $l=file($file); foreach($l as $i=>$ln){ foreach((array)$pats as $pt){ if(preg_match($pt,$ln)){ $r[]=($i+1).': '.mb_substr(trim(implode(' ⏎ ',array_map('trim',array_slice($l,max(0,$i-$ctx),$ctx*2+1)))),0,$w); break; } } if(count($r)>=$max) break; } return $r; };
  foreach(glob($pd.'/includes/**/*.php') as $f){ $c=file_get_contents($f); if(preg_match("/'refund'\s*=>|\[\s*'refund'\s*\]\s*=/",$c)){ $o['refund_src'][basename($f)]=$grep($f,array("/'refund'/","/get_refunds/"),2,12,500); } }
  foreach(glob($pd.'/includes/*/*.php') as $f){ $c=file_get_contents($f); if(preg_match("/'refund'\s*=>|\[\s*'refund'\s*\]\s*=/",$c)){ $o['refund_src'][basename($f)]=$grep($f,array("/'refund'/","/get_refunds/"),2,12,500); } }
  $o['tpl_enabled']=array(); if(class_exists('WooCommerce_Delivery_Notes\\Templates')||class_exists('\\WCDN\\Templates')){ }
  foreach(array('invoice','creditnote') as $t){ $o['tpl_enabled'][$t]=null; }
  $o['classes']=array_values(array_filter(get_declared_classes(),function($c){ return stripos($c,'wcdn')!==false||stripos($c,'delivery_notes')!==false; }));
  $o['desk_grep']=$grep(WPMU_PLUGIN_DIR.'/petshop-desk.php',array('/creditnote|kredit/i'),2,10,500);
  $o['atsisak_grep']=$grep(WPMU_PLUGIN_DIR.'/petshop-atsisakymas.php',array('/creditnote|kredit|Kreditin/i'),2,10,500);
  $o['base_invoice_number']=$grep($th.'/woocommerce-delivery-notes/base.php',array('/\$invoice_number\s*=/','/KR-/','/petshop_get_(avpn|iapv|invoice)/'),1,20,400);
  $o['migration_creditnote']=$grep($pd.'/includes/core/class-migration.php',array('/creditnote/i'),3,6,600);
  $o['settings_api_creditnote']=$grep($pd.'/includes/api/class-settings.php',array('/creditnote/i'),3,6,600);
  $o['engine_2680_2700']=$seg($pd.'/includes/services/template/class-template-engine.php',2685,2700);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
