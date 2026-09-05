<?php
/** TEMP PS S1617 run r8 (recon, tik skaitymas) — WCDN 7.3.0 creditnote šablonas įjungtas? (Templates::get), esami `_wcdn_creditnote_pdf` užsakymai/failai, `wc_create_refund` sumos/eilučių validacija, Fakt_Grazinimai parašas, refund'ų su pristatymu galimybė. */
add_action('init', function(){
  if (!isset($_GET['ps_r8'])) return;
  $o=array('v'=>'S1617 r8'); global $wpdb; $p=$wpdb->prefix; set_time_limit(120);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $cls=array_values(array_filter(get_declared_classes(),function($c){ return stripos($c,'Tyche\\\\WCDN')!==false; })); $o['wcdn_klases']=array_slice($cls,0,60);
  foreach($cls as $c){ if(preg_match('/Templates$/',$c)){ try{ $o['tpl_class']=$c; $rm=new ReflectionMethod($c,'get'); $o['tpl_get_sig']=array_map(function($x){return $x->getName();},$rm->getParameters()); foreach(array('invoice','creditnote','receipt','packingslip','deliverynote') as $t){ $o['tpl_enabled'][$t]=$c::get($t,'enabled'); } $o['creditnote_settings']=$c::get('creditnote'); if(is_array($o['creditnote_settings'])) $o['creditnote_settings']=array_slice(array_filter($o['creditnote_settings'],'is_scalar'),0,40,true); }catch(Throwable $e){ $o['tpl_err']=$e->getMessage(); } } }
  $o['creditnote_meta']=$wpdb->get_results("SELECT order_id,meta_key,LEFT(meta_value,120) v FROM {$p}wc_orders_meta WHERE meta_key IN ('_wcdn_creditnote_pdf','_wcdn_creditnote_date')",ARRAY_A);
  $grep=function($file,$pats,$ctx=1,$max=30,$w=420){ $r=array(); if(!file_exists($file)) return 'NĖRA '.$file; $l=file($file); foreach($l as $i=>$ln){ foreach((array)$pats as $pt){ if(preg_match($pt,$ln)){ $r[]=($i+1).': '.mb_substr(trim(implode(' ⏎ ',array_map('trim',array_slice($l,max(0,$i-$ctx),$ctx*2+1)))),0,$w); break; } } if(count($r)>=$max) break; } return $r; };
  $o['wc_create_refund']=$grep(WP_PLUGIN_DIR.'/woocommerce/includes/wc-order-functions.php',array('/function wc_create_refund/','/max_refund|Invalid refund amount|amount.*>/','/line_items/','/shipping|fee/'),1,25,300);
  if(class_exists('Petshop_Fakt_Grazinimai')){ try{ $rm=new ReflectionMethod('Petshop_Fakt_Grazinimai','rasyti'); $o['fakt_graz_sig']=array_map(function($x){return $x->getName();},$rm->getParameters()); }catch(Throwable $e){} }
  $o['fakt_graz_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_grazinimai");
  $o['refunds_all']=$wpdb->get_results("SELECT id,parent_order_id,status,total_amount,date_created_gmt FROM {$p}wc_orders WHERE type='shop_order_refund' ORDER BY id DESC LIMIT 8",ARRAY_A);
  $o['avpn_counter']=get_option('petshop_avpn_counter'); $o['iapv_counter']=get_option('petshop_iapv_counter'); $o['kr_opcijos']=$wpdb->get_results("SELECT option_name,LEFT(option_value,100) v FROM {$p}options WHERE option_name LIKE '%kr_%counter%' OR option_name LIKE '%kredit%' OR option_name LIKE '%credit%'",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
