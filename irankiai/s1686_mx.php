<?php
/** TEMP PS S1686 mx — RECON (read-only): Petshop_Sender_Adapter metodai + HTTP helperis; Sender API: fields, groups, terra subscriber; ps_relaunch_kontaktai calc eilutės `duomenys` raktai. */
add_action('init', function(){
  if (!isset($_GET['ps_s1686mx'])) return; global $wpdb; $o=array('v'=>'S1686 mx');
  if(class_exists('Petshop_Sender_Adapter')){
    $r=new ReflectionClass('Petshop_Sender_Adapter'); $o['file']=str_replace(ABSPATH,'',$r->getFileName());
    foreach($r->getMethods() as $m){ $p=array(); foreach($m->getParameters() as $pp){$p[]=($pp->isOptional()?'?':'').'$'.$pp->getName();} $o['met'][]=($m->isStatic()?'s ':'').($m->isPrivate()?'- ':($m->isProtected()?'# ':'+ ')).$m->getName().'('.implode(',',$p).')'; }
    $src=file($r->getFileName()); foreach($src as $i=>$l){ if(preg_match('/api\.sender|wp_remote_(get|post|request)|Bearer|base_url|\/v2/',$l)) $o['src'][]=($i+1).': '.trim(substr($l,0,180)); }
    $tok=Petshop_Sender_Adapter::get_stored_token('marketing'); $o['tok_len']=strlen($tok);
    $h=array('Authorization'=>'Bearer '.$tok,'Accept'=>'application/json','Content-Type'=>'application/json');
    foreach(array('fields'=>'https://api.sender.net/v2/fields?limit=100','groups'=>'https://api.sender.net/v2/groups?limit=100','sub'=>'https://api.sender.net/v2/subscribers/terra@gyvunai.lt') as $k=>$u){
      $rs=wp_remote_get($u,array('headers'=>$h,'timeout'=>20)); if(is_wp_error($rs)){$o[$k]=$rs->get_error_message();continue;}
      $j=json_decode(wp_remote_retrieve_body($rs),true); $o[$k.'_st']=wp_remote_retrieve_response_code($rs);
      if($k=='fields'){ $o[$k]=array(); foreach((array)($j['data']??array()) as $f){ $o[$k][]=array_intersect_key($f,array_flip(array('id','title','tag','type'))); } }
      elseif($k=='groups'){ $o[$k]=array(); foreach((array)($j['data']??array()) as $g){ $o[$k][]=($g['id']??'').' '.($g['title']??'').' ('.($g['active_subscribers']??$g['subscribers_count']??'?').')'; } }
      else { $o[$k]=$j; }
    }
  } else $o['adapter']='nera';
  $t=Petshop_Relaunch::t();
  $row=$wpdb->get_row("SELECT segmentas,product_id,rusis,svoriai,duomenys,hero_reason,consent FROM $t WHERE segmentas='calc' AND duomenys IS NOT NULL AND email<>'terra@gyvunai.lt' ORDER BY consent DESC LIMIT 1",ARRAY_A);
  if($row){ $row['duomenys']=json_decode($row['duomenys'],true); } $o['calc_pvz']=$row;
  $o['terra']=$wpdb->get_row($wpdb->prepare("SELECT cid,segmentas,product_id,rusis,svoriai,hero_reason,duomenys IS NOT NULL AS d FROM $t WHERE email=%s",'terra@gyvunai.lt'),ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
});
