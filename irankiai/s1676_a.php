<?php
/** TEMP PS S1676 run a — krepšelio laiškų (cart_abandoned, cart_abandoned_2) peržiūra į terra@. Tik wp_mail į terra@, jobs nekuriami. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676a'])) return; global $wpdb; $p=$wpdb->prefix; $wpdb->suppress_errors(true); $o=array('v'=>'S1676 a');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $cls=array();
  foreach(get_declared_classes() as $c){ if(stripos($c,'laisk')!==false||stripos($c,'cart')!==false||stripos($c,'abandon')!==false||stripos($c,'dispatch')!==false||stripos($c,'email')!==false) $cls[]=$c; }
  $o['klases']=$cls;
  $t='Petshop_Laiskai_Turinys';
  if(class_exists($t)){ $m=array(); foreach(get_class_methods($t) as $mm){ $m[]=$mm; } $o['turinys_metodai']=$m;
    if(method_exists($t,'perziura')){ $r=new ReflectionMethod($t,'perziura'); $ps=array(); foreach($r->getParameters() as $pp) $ps[]=$pp->getName().($pp->isOptional()?'?':''); $o['perziura_params']=$ps; }
  }
  $sent=array(); $err=array();
  foreach(array('cart_abandoned','cart_abandoned_2') as $flow){
    $html=''; $subj='';
    try{
      if(class_exists($t)&&method_exists($t,'perziura')){ $r=call_user_func(array($t,'perziura'),$flow); if(is_array($r)){ $html=isset($r['html'])?$r['html']:(isset($r['body'])?$r['body']:json_encode($r)); $subj=isset($r['subject'])?$r['subject']:(isset($r['tema'])?$r['tema']:''); } else $html=(string)$r; }
    }catch(Throwable $e){ $err[$flow]=$e->getMessage(); }
    if($html===''){ // fallback: paskutinio sent job payload
      $j=$wpdb->get_row($wpdb->prepare("SELECT * FROM {$p}ps_email_jobs WHERE flow=%s AND status='sent' ORDER BY id DESC LIMIT 1",$flow),ARRAY_A);
      $o['job_'.$flow]=$j?array_map(function($x){return is_string($x)?mb_substr($x,0,300):$x;},$j):null;
      if($j){ foreach(array('html','body','rendered_html','payload') as $k){ if(!empty($j[$k])){ $html=$j[$k]; break; } } $subj=isset($j['subject'])?$j['subject']:$flow; }
    }
    if($html!==''){
      $ok=wp_mail('terra@petshop.lt','[PERŽIŪRA S1676] '.$flow.($subj?' — '.$subj:''),$html,array('Content-Type: text/html; charset=UTF-8'));
      $sent[$flow]=array('ok'=>$ok,'subj'=>$subj,'ilgis'=>strlen($html),'istrauka'=>mb_substr(trim(strip_tags($html)),0,400));
    } else $sent[$flow]='NĖRA HTML';
  }
  $o['sent']=$sent; $o['err']=$err;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
});
