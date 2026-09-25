<?php
/** Plugin Name: TEMP PS S1717v — kategoriju (hub) ir gamintoju aprasymu ikelimas. Fazes: 1 sausas, 2 vykdyti (term description, bak opcija ps_s1717_tekstai_bak), 3 patikra, 9 atstatyti. Sudaromas per build_v.py is tekstai/*.py */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1717v'])) return;
  $f=$_GET['ps_s1717v']; @set_time_limit(170); global $wpdb; $r=['v'=>'S1717v','faze'=>$f]; $BAK='ps_s1717_tekstai_bak';
  $T=json_decode(base64_decode('__TEKSTAI_B64__'),true); // [ ['tax'=>'product_cat','slug'=>..,'id'=>..,'html'=>..], ... ]
  $cut=function($v,$n=160){ $v=(string)$v; return mb_strlen($v)>$n?mb_substr($v,0,$n).'…':$v; };
  try{
  if(!is_array($T)){ $r['klaida']='tekstai neiskoduoti'; wp_send_json($r); }
  if($f==='1'){ foreach($T as $x){ $t=isset($x['id'])?get_term((int)$x['id'],$x['tax']):get_term_by('slug',$x['slug'],$x['tax']); $r['planas'][]=[$x['tax'],$x['slug'],$t?$t->term_id:null,$t?mb_strlen($t->description):'NERA',mb_strlen($x['html']),$cut(wp_strip_all_tags($x['html']),90)]; } $r['bak_yra']=(bool)get_option($BAK); }
  if($f==='2'){
    if(get_option($BAK)){ $r['klaida']='bak jau yra'; wp_send_json($r); }
    $bak=['laikas'=>current_time('mysql'),'terminai'=>[]]; $rez=[];
    foreach($T as $x){ $t=isset($x['id'])?get_term((int)$x['id'],$x['tax']):get_term_by('slug',$x['slug'],$x['tax']); if(!$t){ $rez[]=[$x['slug'],'NERA']; continue; } $bak['terminai'][]=['tax'=>$x['tax'],'id'=>$t->term_id,'description'=>$t->description]; }
    update_option($BAK,$bak,false);
    foreach($T as $x){ $t=isset($x['id'])?get_term((int)$x['id'],$x['tax']):get_term_by('slug',$x['slug'],$x['tax']); if(!$t) continue; $u=wp_update_term($t->term_id,$x['tax'],['description'=>wp_kses_post($x['html'])]); $rez[]=[$x['slug'],is_wp_error($u)?'KLAIDA '.$u->get_error_message():'ok']; }
    $r['rez']=$rez; if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache();
  }
  if($f==='3'){ foreach($T as $x){ $t=isset($x['id'])?get_term((int)$x['id'],$x['tax']):get_term_by('slug',$x['slug'],$x['tax']); if(!$t) continue; $res=wp_remote_get(get_term_link($t).'?ps_v=1',['timeout'=>25]); $h=wp_remote_retrieve_body($res); $r['patikra'][$x['slug']]=['code'=>wp_remote_retrieve_response_code($res),'desc_len'=>mb_strlen($t->description),'term_desc_html'=>strpos($h,'term-description')!==false,'meta'=>$cut(html_entity_decode(preg_match('#<meta name="description" content="([^"]*)"#i',$h,$m)?$m[1]:''),120)]; } }
  if($f==='9'){ $bak=get_option($BAK); if(!$bak){ $r['klaida']='bak nera'; wp_send_json($r); } foreach($bak['terminai'] as $b){ wp_update_term($b['id'],$b['tax'],['description'=>$b['description']]); } delete_option($BAK); if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache(); $r['atstatyta']=count($bak['terminai']); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
