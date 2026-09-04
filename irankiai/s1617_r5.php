<?php
/** TEMP PS S1617 run r5 (recon, tik skaitymas): banko rekvizitai (tema base.php/functions.php, WCDN opcijos, WC opcijos) pavedimo paragrafui laiške; dispatcher'io pavyzdys */
add_action('init', function(){
  if (!isset($_GET['ps_r5'])) return;
  $o=array('v'=>'S1617 r5'); global $wpdb; $p=$wpdb->prefix; set_time_limit(120);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $grep=function($file,$pats,$ctx=1,$max=30){ $r=array(); if(!file_exists($file)) return 'NĖRA '.$file; $l=file($file); foreach($l as $i=>$ln){ foreach((array)$pats as $pt){ if(preg_match($pt,$ln)){ $r[]=($i+1).': '.mb_substr(trim(implode(' ⏎ ',array_map('trim',array_slice($l,max(0,$i-$ctx),$ctx*2+1)))),0,400); break; } } if(count($r)>=$max) break; } return $r; };
  $td=get_stylesheet_directory(); $o['tema_failai']=array(); foreach(array('functions.php','woocommerce/woocommerce-delivery-notes/base.php','woocommerce-delivery-notes/base.php','woocommerce/woocommerce-delivery-notes/print-content.php') as $f){ if(file_exists($td.'/'.$f)) $o['tema_failai'][]=$f; }
  $pats=array('/LT\d{2}\s?\d{4}/','/IBAN/i','/\bBIC\b|SWIFT/i','/Swedbank|SEB|Luminor|Revolut|Citadele|Šiaulių|Siauliu/i','/Į(mon|mon)ės kodas|PVM mok/i');
  foreach($o['tema_failai'] as $f){ $o['grep'][$f]=$grep($td.'/'.$f,$pats,1,25); }
  foreach(glob($td.'/woocommerce/woocommerce-delivery-notes/*.php') as $f){ $o['wcdn_tema'][]=basename($f); }
  $o['opcijos']=$wpdb->get_results("SELECT option_name,LEFT(option_value,600) v FROM {$p}options WHERE option_name LIKE 'wcdn%' OR option_name LIKE '%invoice%company%' OR option_name LIKE 'petshop_%rekviz%' OR option_name LIKE 'ps_bank%' OR option_name LIKE 'petshop_bank%' OR option_name LIKE 'woocommerce_bacs%'",ARRAY_A);
  $o['opcijos_iban']=$wpdb->get_results("SELECT option_name,LEFT(option_value,300) v FROM {$p}options WHERE option_value REGEXP 'LT[0-9]{2}[ ]?[0-9]{4}' AND LENGTH(option_value)<20000 LIMIT 10",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
