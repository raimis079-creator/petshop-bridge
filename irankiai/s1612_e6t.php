<?php
/** TEMP PS S1612 run e6t — T: v3.11 „paėmė“ kelias per simuliuotą Venipak (#35429 AV, #35419 tiekėjai) → issiusta() pats + laiškas (gaudyklė prior. 4); skydelio Venipak tekstas per ajax kaip testuotojas; Klausimų eilė Playwright */
add_action('init', function(){
  if (!isset($_GET['ps_e6t'])) return;
  $o=array('v'=>'run e6t'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  try{
    $o['versija']=Petshop_Darbalaukis::VERSIJA; $o['dev_zurnalas_pries']=count((array)get_option('ps_dev_pastas_zurnalas',array()));
    update_option('ps_e6_mail',array(),false);
    add_filter('pre_wp_mail',function($r,$a){ $m=get_option('ps_e6_mail',array()); $m[]=array('to'=>is_array($a['to'])?implode(',',$a['to']):$a['to'],'s'=>$a['subject'],'b'=>mb_substr(preg_replace('/\s+/',' ',wp_strip_all_tags((string)$a['message'])),0,420)); update_option('ps_e6_mail',$m,false); return true; },4,2);
    $E=function($k,$e,$t,$d,$pl=null){ return array('shipment_id'=>1,'pack_no'=>'','event'=>$e,'pack_status'=>$k,'pack_status_text'=>$t,'location'=>array('place'=>$pl,'address'=>null,'city'=>$pl,'lat'=>null,'lng'=>null),'date'=>$d,'date_iso'=>$d); };
    $cr=$E(0,'Shipment created','At sender','2026-09-04 09:00:00'); $at=$E(2,'At terminal','At terminal','2026-09-04 11:00:00','KAUNAS'); $rt=$E(1,'On route to terminal','On route to terminal','2026-09-04 10:00:00');
    $SIM=array(); add_filter('ps_venipak_ivykiai',function($ev,$nr) use (&$SIM){ return isset($SIM[$nr])?$SIM[$nr]:array($ev===null?array():$ev); },10,2);
    $bk=function($id){ $x=wc_get_order($id); if(!$x) return null; $reg=array(); foreach(Petshop_Siuntos::sarasas($id) as $s){ $reg[$s['sandelis']]=$s['numeriai']; } return array('st'=>$x->get_status(),'cust'=>$x->get_customer_id(),'iss'=>(string)$x->get_meta('_ps_dalys_issiusta'),'perd'=>(string)$x->get_meta('_ps_dropship_sent'),'reg'=>$reg,'sek'=>array_map(function($z){ return $z['k'].' '.$z['t']; },Petshop_Darbalaukis::sekimas($x)),'kl'=>array_map(function($s){ return $s['dalis'].' '.$s['busena'].' '.implode('/',$s['numeriai']); },Petshop_Darbalaukis::kliento_siuntos($x))); };
    // kandidatai: processing su registru ir dar nepažymėta dalimi
    $o['kandidatai']=Petshop_Darbalaukis::venipak_sekimas(array()); // realus API visiems kandidatams (k=0 visiems dev numeriams) — cron elgsena
    $o['paskutinis']=get_option('ps_venipak_sekimas_paskutinis');
    foreach(array(35429,35419,35427,35430,35437) as $id){ $o['pries'][$id]=$bk($id); }
    // A: #35429 AV (V…031, V…032) → 031 terminale → „Kurjeris paėmė“ pats → completed + laiškas
    $A=35429; $rA=Petshop_Siuntos::sarasas($A); $nrA=array(); foreach($rA as $s){ $nrA[$s['sandelis']]=$s['numeriai']; }
    if(wc_get_order($A)->get_status()==='processing' && !empty($nrA['av'])){ $SIM=array($nrA['av'][0]=>array($cr,$rt,$at)); $o['rA']=Petshop_Darbalaukis::venipak_sekimas(array($A)); $o['rA_po']=$bk($A); $o['rA_mail']=count(get_option('ps_e6_mail',array())); $o['rA_again']=Petshop_Darbalaukis::venipak_sekimas(array($A)); }
    else $o['A_praleista']=wc_get_order($A)->get_status();
    // B: #35419 tiekėjai (vf V…039, ambrosia V…040) → vf terminale → „VF išsiuntė“ pats + laiškas „1 iš 2“; ambrosia terminale → 2 iš 2 → completed
    $B=35419; $rB=Petshop_Siuntos::sarasas($B); $nrB=array(); foreach($rB as $s){ $nrB[$s['sandelis']]=$s['numeriai']; }
    if(wc_get_order($B)->get_status()==='processing' && !empty($nrB['vf'])){ $SIM=array($nrB['vf'][0]=>array($cr,$at)); $o['rB1']=Petshop_Darbalaukis::venipak_sekimas(array($B)); $o['rB1_po']=$bk($B); $o['rB1_mail']=count(get_option('ps_e6_mail',array()));
      if(!empty($nrB['ambrosia'])){ $SIM=array($nrB['vf'][0]=>array($cr,$at),$nrB['ambrosia'][0]=>array($cr,$at)); $o['rB2']=Petshop_Darbalaukis::venipak_sekimas(array($B)); $o['rB2_po']=$bk($B); } }
    else $o['B_praleista']=wc_get_order($B)->get_status();
    $o['laiskai']=array_map(function($m){ return $m['to'].' | '.$m['s'].' | '.$m['b']; },get_option('ps_e6_mail',array())); delete_option('ps_e6_mail'); $o['dev_zurnalas_po']=count((array)get_option('ps_dev_pastas_zurnalas',array()));
    $o['notes_A']=array_map(function($n){ return mb_substr($n->content,0,200); },array_slice(wc_get_order_notes(array('order_id'=>$A,'limit'=>4)),0,4));
    // skydelis per ajax kaip testuotojas (#35440 su Venipak tekstais)
    $tu=get_user_by('login','testuotojas'); $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($tu->ID)->create($exp);
    $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($tu->ID,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($tu->ID,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>wp_generate_auth_cookie($tu->ID,$exp,'logged_in',$tok))));
    wp_set_current_user($tu->ID); $n=wp_create_nonce('ps_dl_zurnalas'); wp_set_current_user(0);
    foreach(array(35440,$A) as $id){ $r=wp_remote_get(admin_url('admin-ajax.php?action=ps_dl_skydelis&id='.$id.'&n='.$n),array('cookies'=>$cs,'timeout'=>60,'sslverify'=>false)); $b=is_wp_error($r)?'':wp_remote_retrieve_body($r); $j=json_decode($b,true);
      $o['skydelis'][$id]=array('code'=>wp_remote_retrieve_response_code($r),'nr'=>$j['data']['nr']??null,'kur'=>$j['data']['kur']??null,'kl'=>$j['data']['klausimas']??null); }
    $o['cookies']=array(); foreach($cs as $c){ $o['cookies'][]=array('name'=>$c->name,'value'=>$c->value); }
    $o['shots']=array(array('n'=>'e6_klausimai','u'=>admin_url('admin.php?page=ps-desk&eile=klausimai'),'full'=>true,'eval'=>"({korteles:[...document.querySelectorAll('.dl-kortele')].map(x=>x.innerText.replace(/\\s+/g,' ').slice(0,160))})"),array('n'=>'e6_skydelis_35440','u'=>admin_url('admin.php?page=ps-desk&eile=klausimai&atidaryti=35440'),'w'=>1400,'full'=>false,'eval'=>"({sk:(document.querySelector('#skydelis,.dl-skydelis,.dl-sk')||document.body).innerText.replace(/\\s+/g,' ').slice(0,700)})"));
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $J($o);
},99);
