<?php
/** TEMP PS S1676 run f — bacs on-hold trigerio recon: dunning-1 šablonas, atšaukimo laiško kablys, bacs užsakymai, cron. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676f'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 f');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $d=PETSHOP_CORE_DIR.'templates/emails/'; foreach(array('dunning-1','dunning-2','dunning-3','order-cancelled','bacs-reminder') as $t){ $f=$d.$t.'.php'; if(file_exists($f)){ $s=file_get_contents($f); preg_match_all("/\\\$subject\s*=\s*'([^']*)'/u",$s,$m); preg_match_all("/Layout::p\(\s*'((?:[^'\\\\]|\\\\.)*)'/su",$s,$m2); $o['sabl'][$t]=array('md5'=>md5_file($f),'subj'=>$m[1],'p'=>array_map(function($x){return mb_substr($x,0,300);},$m2[1])); } else $o['sabl'][$t]='NĖRA'; }
  $fl=Petshop_Email_Dispatch::flows(); foreach($fl as $k=>$v) if(preg_match('/dunning|cancel|bacs|payment/',$k.$v['template'])) $o['flows'][$k]=$v;
  // kur siunciamas "atsauktas" laiskas (S1639) — mu-plugins grep
  foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $f){ $s=file_get_contents($f); if(preg_match_all("/[^\n]{0,80}(order_cancelled|atsauk|cancelled)[^\n]{0,120}/i",$s,$m)) { $h=array(); foreach(array_unique($m[0]) as $l){ if(preg_match('/add_action|do_action|Dispatch::|laisk|mail/i',$l)) $h[]=trim($l); } if($h) $o['cancel_kabliai'][basename($f)]=array_slice($h,0,8); } }
  // bacs on-hold uzsakymai dabar
  $o['bacs_onhold']=$wpdb->get_results("SELECT id,date_created_gmt,total_amount,billing_email FROM {$p}wc_orders WHERE type='shop_order' AND status='wc-on-hold' AND payment_method='bacs' ORDER BY id",ARRAY_A);
  foreach($o['bacs_onhold'] as &$r){ $w=wc_get_order($r['id']); $r['nr']=$w->get_order_number(); $r['billing_email']=substr($r['billing_email'],0,2).'***'.strrchr($r['billing_email'],'@'); $r['meta_ps']=array(); foreach($w->get_meta_data() as $m){ if(strpos($m->key,'_ps_')===0||strpos($m->key,'_petshop')===0) $r['meta_ps'][]=$m->key; } }
  // WC bacs email (instructions) + on-hold laiskas
  $o['wc_onhold_email']=get_option('woocommerce_customer_on_hold_order_settings');
  // cron kabliai ps_
  $c=_get_cron_array(); foreach($c as $ts=>$hs) foreach($hs as $h=>$x) if(strpos($h,'ps_')===0||strpos($h,'petshop_')===0) $o['cron'][$h]=date('m-d H:i',$ts);
  // kaip Paysera pending atsaukiamas — hold_stock
  $o['hold_stock']=get_option('woocommerce_hold_stock_minutes');
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
