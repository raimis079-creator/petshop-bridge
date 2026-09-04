<?php
/** TEMP PS S1615 run e3r — RECON (tik skaitymas) #4: petshop-pragma (AVPN/IAPV — kada, kaip, ar yra kreditinė), av-dropship perduota/laiško eilutės, tiekimas ideti_eilute, WC adjust f-ja, av-reduce wc_kiekis, pragma meta testiniuose. */
add_action('init', function(){
  if (!isset($_GET['ps_e3r'])) return;
  $o=array('v'=>'S1615 e3r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $src=function($c,$pat,$len=1800){ $i=strpos($c,$pat); if($i===false) return 'pattern nerastas'; return substr($c,max(0,$i-100),$len); };
  try{
  $mu=WPMU_PLUGIN_DIR;
  // pragma
  $dir=WP_PLUGIN_DIR.'/petshop-pragma'; $o['pragma_files']=array(); foreach(glob($dir.'/*.php') as $ff){ $o['pragma_files'][basename($ff)]=filesize($ff); } foreach(glob($dir.'/*/*.php') as $ff){ $o['pragma_files'][str_replace($dir.'/','',$ff)]=filesize($ff); }
  $c=(string)file_get_contents($dir.'/petshop-pragma.php'); $o['pragma_head']=substr($c,0,1500);
  preg_match_all('/add_(action|filter)\(\s*[\'"]([^\'"]+)[\'"]\s*,\s*([^,\)]+)/',$c,$m); $o['pragma_hooks']=array_map(null,$m[2],$m[3]);
  preg_match_all('/function\s+(\w+)\s*\(([^)]*)\)/',$c,$m); $o['pragma_fns']=array_map(null,$m[1],$m[2]);
  $o['pragma_kredit']=preg_match_all('/kredit|credit|storno|anuliuo/i',$c,$mm); $o['pragma_kredit_ctx']=$src($c,'kredit',600);
  $o['pragma_avpn_ctx']=$src($c,'petshop_avpn_counter',1400);
  $o['pragma_iapv_ctx']=$src($c,'petshop_iapv_counter',900);
  $o['pragma_doc_type_ctx']=$src($c,'_petshop_invoice_document_type',900);
  $o['pragma_completed_pdf_ctx']=$src($c,'_petshop_completed_pdf',900);
  $o['pragma_options']=$wpdb->get_results("SELECT option_name, LEFT(option_value,160) v FROM {$p}options WHERE option_name LIKE 'petshop_pragma%' OR option_name LIKE 'petshop_%sask%' OR option_name LIKE 'petshop_%pdf%' LIMIT 20",ARRAY_A);
  $o['wcdn_plugin']=array_values(array_filter((array)get_option('active_plugins'),function($x){ return preg_match('/wcdn|print|wpo|pdf/i',$x); }));
  foreach(array(35438,35442,35421) as $id){ $x=wc_get_order($id); $mm=array(); foreach($x->get_meta_data() as $md){ if(preg_match('/^_petshop_(avpn|iapv|invoice|completed|order)/',$md->key)) $mm[$md->key]=is_string($md->value)?mb_substr($md->value,0,160):$md->value; } $o['pragma_meta'][$id]=$mm; $o['notes_pdf'][$id]=array_map(function($n){ return mb_substr($n->content,0,140); },array_filter(wc_get_order_notes(array('order_id'=>$id,'limit'=>40)),function($n){ return preg_match('/AVPN|IAPV|sąskait|PDF/i',$n->content); })); }
  // dropship
  $c=(string)file_get_contents($mu.'/petshop-av-dropship.php'); $o['ds_perduota']=$src($c,'function perduota(',900); $o['ds_zymeti']=$src($c,'function zymeti_perduota',900); $o['ds_laisko_html_items']=$src($c,'function laisko_html',2400);
  // tiekimas
  $c=(string)file_get_contents($mu.'/petshop-av-tiekimas.php'); $o['tk_ideti']=$src($c,'function ideti_eilute',1600); $o['tk_bukle']=$src($c,'function eilutes_bukle',900);
  // av-reduce wc_kiekis
  $c=(string)file_get_contents($mu.'/petshop-av-reduce.php'); $o['reduce_init']=$src($c,'function init',900);
  // WC
  $o['wc_ver']=WC()->version; $o['wc_adjust']=function_exists('wc_maybe_adjust_line_item_product_stock'); $o['wc_update_stock']=function_exists('wc_update_product_stock'); $o['wc_adjust_grep']=array(); foreach(glob(WP_PLUGIN_DIR.'/woocommerce/includes/wc-*stock*.php') as $ff){ $cc=(string)file_get_contents($ff); preg_match_all('/function\s+(wc_\w*stock\w*)\s*\(/',$cc,$mm); $o['wc_adjust_grep'][basename($ff)]=$mm[1]; }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $J($o);
},99);
