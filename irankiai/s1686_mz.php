<?php
/** TEMP PS S1686 mz — 3 ETAPAS: f=laukai — Sender laukai PS_HERO_* (POST /fields, praleidžia esamus); f=terra — terra@gyvunai.lt eilutės duomenys (12466, šuo 10/20/30) + Sender kontaktas (POST /subscribers į PS_TEST, reaktyvavimas, PATCH fields); f=busena — Sender terra būsena. */
add_action('init', function(){
  if (!isset($_GET['ps_s1686mz'])) return; global $wpdb; $o=array('v'=>'S1686 mz'); $f=$_GET['ps_s1686mz']; $t=Petshop_Relaunch::t();
  $tok=Petshop_Sender_Adapter::get_stored_token('marketing');
  $api=function($m,$p,$b=null) use($tok){ $a=array('method'=>$m,'timeout'=>25,'headers'=>array('Authorization'=>'Bearer '.$tok,'Accept'=>'application/json','Content-Type'=>'application/json')); if($b!==null) $a['body']=wp_json_encode($b);
    $r=wp_remote_request('https://api.sender.net/v2'.$p,$a); if(is_wp_error($r)) return array('code'=>0,'err'=>$r->get_error_message()); return array('code'=>wp_remote_retrieve_response_code($r),'body'=>json_decode(wp_remote_retrieve_body($r),true)); };
  $LAUKAI=array('PS_HERO_SEG','PS_HERO_PAV','PS_HERO_KAINA','PS_HERO_IMG','PS_HERO_URL','PS_HERO_KG1','PS_HERO_EUR1','PS_HERO_INFO1','PS_HERO_U1','PS_HERO_KG2','PS_HERO_EUR2','PS_HERO_INFO2','PS_HERO_U2','PS_HERO_KG3','PS_HERO_EUR3','PS_HERO_INFO3','PS_HERO_U3');
  if($f==='laukai'){
    $r=$api('GET','/fields?limit=100'); $yra=array(); foreach((array)($r['body']['data']??array()) as $x) $yra[$x['title']]=$x['id']??null; $o['buvo']=array_values(array_intersect(array_keys($yra),$LAUKAI));
    foreach($LAUKAI as $l){ if(isset($yra[$l])) continue; $c=$api('POST','/fields',array('title'=>$l,'type'=>'text')); $o['sukurta'][$l]=$c['code'].' '.wp_json_encode($c['body']['data']['id']??($c['body']['message']??$c['body']??''),JSON_UNESCAPED_UNICODE); }
    $r=$api('GET','/fields?limit=100'); $o['dabar']=array(); foreach((array)($r['body']['data']??array()) as $x) if(strpos($x['title'],'PS_HERO_')===0) $o['dabar'][]=$x['title'].'='.($x['id']??'?');
  } elseif($f==='terra'){
    $email='terra@gyvunai.lt'; $pid=12466; $pr=wc_get_product($pid); $svor=array(10,20,30); $cid=$wpdb->get_var($wpdb->prepare("SELECT cid FROM $t WHERE email=%s",$email));
    $utm=array('utm_source'=>'sender','utm_medium'=>'email','utm_campaign'=>'relaunch','utm_content'=>'calc','cid'=>$cid); $iid=$pr->get_image_id();
    $duom=array('pav'=>$pr->get_name(),'kaina'=>null,'img'=>$iid?wp_get_attachment_image_url($iid,'medium'):'','url'=>add_query_arg($utm,$pr->get_permalink()),'eilutes'=>array());
    foreach($svor as $kg){ $r=Petshop_Feeding_Service::calc(array('product_id'=>$pid,'weight_kg'=>$kg,'species_code'=>'dog')); if(($r['status']??'')!=='ok'){ $o['calc_klaida'][$kg]=$r; continue; }
      if($duom['kaina']===null && !empty($r['price_used'])) $duom['kaina']=(float)$r['price_used'];
      $duom['eilutes'][]=array('kg'=>$kg,'g'=>$r['norm_min_g'].'–'.$r['norm_max_g'],'eur_nuo'=>number_format($r['cost_day_min'],2,',',''),'d'=>$r['days_min'].'–'.$r['days_max'],'url'=>add_query_arg($utm+array('utm_term'=>$kg.'kg','svoris'=>$kg),$pr->get_permalink())); }
    $wpdb->update($t,array('duomenys'=>wp_json_encode($duom,JSON_UNESCAPED_UNICODE),'hero_reason'=>'test','consent'=>1),array('email'=>$email)); $o['duomenys']=$duom; $o['db_err']=$wpdb->last_error;
    // Sender laukai
    $fl=array('PS_HERO_SEG'=>'calc','PS_HERO_PAV'=>$duom['pav'],'PS_HERO_KAINA'=>number_format((float)$duom['kaina'],2,',','').' €','PS_HERO_IMG'=>$duom['img'],'PS_HERO_URL'=>$duom['url']);
    foreach($duom['eilutes'] as $i=>$e){ $n=$i+1; $fl["PS_HERO_KG$n"]=$e['kg'].' kg'; $fl["PS_HERO_EUR$n"]='nuo '.$e['eur_nuo'].' €'; $fl["PS_HERO_INFO$n"]=$e['g'].' g/d · maišo užtenka '.$e['d'].' d.'; $fl["PS_HERO_U$n"]=$e['url']; }
    $o['s1_post']=$api('POST','/subscribers',array('email'=>$email,'groups'=>array('bDxp2q'),'trigger_automation'=>false)); $o['s1_post']=array('code'=>$o['s1_post']['code'],'st'=>$o['s1_post']['body']['data']['status']??null,'msg'=>$o['s1_post']['body']['message']??null);
    $g=$api('GET','/subscribers/'.rawurlencode($email)); $st=$g['body']['data']['status']['email']??'?'; $o['po_post']=$st;
    if($st!=='active'){ foreach(array(array('subscriber_status'=>'ACTIVE'),array('status'=>'active'),array('resubscribe'=>true)) as $k=>$b){ $p=$api('PATCH','/subscribers/'.rawurlencode($email),$b); $g=$api('GET','/subscribers/'.rawurlencode($email)); $st=$g['body']['data']['status']['email']??'?'; $o['reakt'][$k]=wp_json_encode($b).' → '.$p['code'].' '.($p['body']['message']??'').' / '.$st; if($st==='active') break; } }
    $p=$api('PATCH','/subscribers/'.rawurlencode($email),array('fields'=>$fl)); $o['fields_patch']=array('code'=>$p['code'],'msg'=>$p['body']['message']??null);
    $g=$api('GET','/subscribers/'.rawurlencode($email)); $o['galutine']=array('status'=>$g['body']['data']['status']??null,'grupes'=>array_map(function($x){return $x['title'];},$g['body']['data']['subscriber_tags']??array()),'cols'=>array()); foreach($g['body']['data']['columns']??array() as $c) $o['galutine']['cols'][$c['title']]=mb_substr((string)$c['value'],0,60);
    $gr=$api('GET','/groups/bDxp2q'); $o['ps_test_grupe']=$gr['body']['data']??$gr;
  } else {
    $g=$api('GET','/subscribers/terra%40gyvunai.lt'); $o['terra']=$g['body']['data']??$g;
  }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
});
