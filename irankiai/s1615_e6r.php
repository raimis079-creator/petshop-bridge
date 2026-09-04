<?php
/** TEMP PS S1615 run e6r — RECON (tik skaitymas): pirkimo taisyklių puslapis (WC terms page + puslapiai su „taisykl“), struktūra (antraštės / numeruoti punktai), pastraipos apie pristatymą/grąžinimą/neatsiėmimą, turinio formatas (blokai / HTML / UX builder). */
add_action('init', function(){
  if (!isset($_GET['ps_e6r'])) return;
  $o=array('v'=>'S1615 e6r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(120);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  try{
  $tid=(int)get_option('woocommerce_terms_page_id'); $o['terms_page_id']=$tid;
  $ids=array(); if($tid) $ids[]=$tid;
  $r=$wpdb->get_results("SELECT ID,post_title,post_name,post_status,post_modified,LENGTH(post_content) len FROM {$p}posts WHERE post_type='page' AND post_status IN ('publish','private','draft') AND (post_name LIKE '%taisykl%' OR post_title LIKE '%taisykl%' OR post_name LIKE '%grazin%' OR post_title LIKE '%grąžin%' OR post_name LIKE '%pristat%' OR post_title LIKE '%pristat%' OR post_name LIKE '%salyg%' OR post_title LIKE '%sąlyg%') ORDER BY ID",ARRAY_A);
  $o['puslapiai']=$r; foreach($r as $x){ $ids[]=(int)$x['ID']; } $ids=array_unique($ids);
  foreach($ids as $id){ $pg=get_post($id); if(!$pg) continue; $c=$pg->post_content; $d=array('title'=>$pg->post_title,'slug'=>$pg->post_name,'status'=>$pg->post_status,'len'=>strlen($c),'url'=>get_permalink($id),'gutenberg'=>strpos($c,'<!-- wp:')!==false,'ux'=>strpos($c,'[ux_')!==false||strpos($c,'[section')!==false,'modified'=>$pg->post_modified);
    preg_match_all('/<h[1-4][^>]*>(.*?)<\/h[1-4]>/su',$c,$m); $d['antrastes']=array_map(function($h){ return mb_substr(trim(wp_strip_all_tags($h)),0,90); },$m[1]);
    preg_match_all('/(?:^|>|\n)\s*(\d{1,2}\.\d{1,2}\.?)\s/u',$c,$m2); $d['numeruoti']=array_slice(array_values(array_unique($m2[1])),0,80);
    $txt=wp_strip_all_tags(str_replace(array('<br>','<br/>','</p>','</li>'),"\n",$c)); $lines=preg_split('/\n+/u',$txt); $hits=array(); foreach($lines as $i=>$l){ $l=trim($l); if($l===''||mb_strlen($l)<20) continue; if(preg_match('/neatsi|neatsiim|grąžin|graz|pristatym|paštomat|pastomat|kurjer|siuntos|atsisak/iu',$l)){ $hits[]=mb_substr($l,0,260); } } $d['pastraipos']=array_slice($hits,0,60);
    $o['turinys'][$id]=$d; }
  $o['checkout_terms']=array('terms_page'=>$tid?get_the_title($tid):null,'checkout_terms_setting'=>get_option('woocommerce_checkout_terms_and_conditions_checkbox_text'));
  $o['pristatymo_tarifai']=array(); foreach(WC_Shipping_Zones::get_zones() as $z){ foreach($z['shipping_methods'] as $m){ $o['pristatymo_tarifai'][]=array($z['zone_name'],$m->id,$m->get_instance_id(),$m->get_title(),$m->get_option('cost'),$m->get_option('min_amount')); } }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $J($o);
},99);
