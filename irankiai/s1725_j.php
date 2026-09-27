<?php
/** Plugin Name: TEMP PS S1725j read-only: po publikavimo — dydžių lentelės tekstas bazės ir pako puslapyje, filtras „Pakuotės dydis", katalogo veidai */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1725j'])) return; $r=['v'=>'S1725j']; @set_time_limit(170);
  $get=function($u){ $x=wp_remote_get($u,['timeout'=>35,'sslverify'=>false,'cookies'=>['ps_js'=>'1']]); return is_wp_error($x)?'ERR '.$x->get_error_message():wp_remote_retrieve_body($x); };
  $lent=function($h){ if(!preg_match('#<table[^>]*ps-dydz[^>]*>.*?</table>#s',$h,$m) && !preg_match('#<table[^>]*>(?:(?!</table>).)*Rinktis.*?</table>#s',$h,$m)) return 'NERA'; $t=preg_replace('#<(tr)[^>]*>#',"\n",$m[0]); $t=preg_replace('#<[^>]+>#',' ',$t); return array_values(array_filter(array_map(function($l){return trim(preg_replace('/\s+/',' ',$l));},explode("\n",html_entity_decode($t))))); };
  $cips=function($h,$pid){ if(preg_match_all('#data-product_id="'.$pid.'".{0,50}#s',$h,$m)) return count($m[0]); return 0; };
  try{
    foreach([16460,36334,16555,16591] as $pid){ $h=$get(get_permalink($pid).'?ps_nc='.time()); $r['psl'][$pid]=['pav'=>get_the_title($pid),'lentele'=>$lent($h)]; }
    // filtras: sausas maistas katėms, pakuotės dydis 2 kg
    $t=get_term_by('slug','2-kg','pa_pakuotes_dydis'); $r['terminas_2kg']=$t?$t->slug:null;
    $cats=wp_get_post_terms(16460,'product_cat'); $cl=null; foreach($cats as $c){ if(stripos($c->name,'Sausas')!==false){$cl=get_term_link($c);} }
    if($cl && $t){ $u=add_query_arg(['filter_pakuotes_dydis'=>$t->slug,'ps_nc'=>time()],$cl); $h=$get($u); preg_match_all('#<p class="name product-title[^"]*"><a[^>]*>([^<]+)</a>#',$h,$m); $r['filtras_url']=$u; $r['filtras_2kg_korteles']=array_slice($m[1],0,40); $r['filtras_2vnt']=count(array_filter($m[1],function($x){return stripos($x,'2 vnt.')!==false;})); }
    if($cl){ $h=$get(add_query_arg('ps_nc',time(),$cl)); preg_match_all('#<p class="name product-title[^"]*"><a[^>]*>([^<]+)</a>#',$h,$m); $r['kategorija_2vnt_veidai']=array_values(array_filter($m[1],function($x){return stripos($x,'2 vnt.')!==false;})); $r['kategorija_korteliu']=count($m[1]); }
    // Quattro gamintojo puslapis
    $b=wp_get_post_terms(16555,'product_brand'); if($b){ $h=$get(add_query_arg('ps_nc',time(),get_term_link($b[0]))); preg_match_all('#<p class="name product-title[^"]*"><a[^>]*>([^<]+)</a>#',$h,$m); $r['quattro_korteliu']=count($m[1]); $r['quattro_2vnt_veidai']=array_values(array_filter($m[1],function($x){return stripos($x,'2 vnt.')!==false;})); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE); exit;
}, 1);
