<?php
/** TEMP PS S1621 run e2p — RECON (tik skaitymas): tiekimo variklio veiksmas() (nauja_sku), laisko_dalis, dropship send su_partija, #35807 pristatymo eilutė, 5787 klientas, Petshop_Siuntos::prideti_is_plugino parašas. */
add_action('init', function(){
  if (!isset($_GET['ps_e2p'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e2p'])); $o=array('v'=>'S1621 e2p','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(250);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $lines=function($file,$a,$b){ $L=explode("\n",(string)file_get_contents($file)); $r=array(); for($i=$a-1;$i<min($b,count($L));$i++){ $r[]=($i+1).': '.mb_substr(rtrim($L[$i]),0,220); } return $r; };
  try{
  if($f==='P'){
    $tf=WPMU_PLUGIN_DIR.'/petshop-av-tiekimas.php'; $o['tiek_veiksmas']=$lines($tf,806,880); $o['tiek_laiskas']=$lines($tf,1099,1135); $o['tiek_ideti']=$lines($tf,290,330);
    $df=WPMU_PLUGIN_DIR.'/petshop-av-dropship.php'; $o['ds_yra']=file_exists($df); if($o['ds_yra']){ $L=explode("\n",(string)file_get_contents($df)); $g=array(); foreach($L as $k=>$l){ if(preg_match('/su_partija|ps_dl_kartu|laisko_dalis|su_lipdukais|be_lipduku|function send|function siusti|admin_post_ps_dropship_send|uzsakymai|wp_mail\(|subject|tema/i',$l)){ $g[]=($k+1).': '.mb_substr(trim($l),0,200); } if(count($g)>90) break; } $o['ds_grep']=$g; }
    $x=wc_get_order(35807); if($x){ foreach($x->get_shipping_methods() as $sid=>$sh){ $o['sh35807']=array('method_id'=>$sh->get_method_id(),'inst'=>$sh->get_instance_id(),'title'=>$sh->get_method_title(),'total'=>$sh->get_total(),'tax'=>$sh->get_total_tax(),'meta'=>$sh->get_meta_data()?array_map(function($m){return $m->key.'='.mb_substr(is_scalar($m->value)?$m->value:json_encode($m->value),0,60);},$sh->get_meta_data()):null); } $o['pm35807']=array($x->get_payment_method(),$x->get_payment_method_title(),$x->get_created_via()); }
    $u=get_userdata(5787); $o['kl5787']=$u?array($u->user_email,$u->display_name,get_user_meta(5787,'billing_first_name',true),get_user_meta(5787,'billing_last_name',true),get_user_meta(5787,'billing_address_1',true),get_user_meta(5787,'billing_city',true),get_user_meta(5787,'billing_postcode',true),get_user_meta(5787,'billing_phone',true)):null;
    foreach(array('Petshop_Siuntos'=>array('prideti_is_plugino','sarasas'),'Petshop_AV_Tiekimas'=>array('ideti_eilute','atvira_partija','laisko_dalis','uzdaryti_po_laisko'),'Petshop_AV_Dropship'=>array('laukiantys_perdavimo')) as $c=>$ms){ foreach($ms as $m){ try{ $rm=new ReflectionMethod($c,$m); $o['sig'][$c.'::'.$m]=implode(',',array_map(function($pp){return ($pp->isOptional()?'?':'').'$'.$pp->getName();},$rm->getParameters())); }catch(Throwable $e){ $o['sig'][$c.'::'.$m]='NĖRA'; } } }
    $o['zurnalas_kabliai']=array_keys((array)($GLOBALS['wp_filter']['admin_post_ps_tiekimas']->callbacks??array()));
    $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'"); $J($o);
  }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
