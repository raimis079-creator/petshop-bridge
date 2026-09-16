<?php
/** TEMP PS S1688 me — E2E: f=nars (browser=1) — svečias atidaro 12466 ?svoris=20&cid=terra, laukia bloko #ps-primink, įveda terra@gyvunai.lt, spaudžia „Taip, priminkite", grąžina bloko tekstą; f=po — randa transient'ą, kviečia patvirtinimo nuorodą (wp_remote_get be redirect), tikrina refill/consent/weight/relaunch eilutes. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688me'])) return; global $wpdb; $o=array('v'=>'S1688 me'); $f=$_GET['ps_s1688me']; $t=Petshop_Relaunch::t();
  $cid=$wpdb->get_var("SELECT cid FROM $t WHERE email='terra@gyvunai.lt'");
  if($f==='nars'){
    $u=add_query_arg(array('svoris'=>20,'cid'=>$cid,'utm_source'=>'sender','utm_medium'=>'email','utm_campaign'=>'relaunch','utm_content'=>'calc'),get_permalink(12466));
    $o['shots']=array(array('n'=>'s1688_primink','u'=>$u,'full'=>0,'eval'=>"new Promise(function(r){setTimeout(function(){var b=document.getElementById('ps-primink');if(!b){return r({blokas:null,out:(document.querySelector('.ps-calc-out')||{}).innerText});}var e=document.getElementById('ps-primink-e');if(e){e.value='terra@gyvunai.lt';}document.getElementById('ps-primink-go').click();setTimeout(function(){r({blokas:b.innerText.slice(0,500),err:(document.getElementById('ps-primink-err')||{}).textContent});},5000);},6000);})"));
  } else {
    $rows=$wpdb->get_results("SELECT option_name,option_value FROM {$wpdb->options} WHERE option_name LIKE '_transient_ps_primink_%' AND option_name NOT LIKE '_transient_ps_primink_rl_%' ORDER BY option_id DESC LIMIT 3",ARRAY_A);
    $o['transientai']=count($rows); $tok='';
    foreach($rows as $r){ $v=maybe_unserialize($r['option_value']); if(is_array($v)&&($v['email']??'')==='terra@gyvunai.lt'){ $tok=str_replace('_transient_ps_primink_','',$r['option_name']); $o['payload']=$v; break; } }
    if($tok){ $url=add_query_arg(array('ps_primink'=>$tok,'z'=>Petshop_Relaunch::zenklas($tok)),home_url('/')); $o['url']=$url;
      $r=wp_remote_get($url,array('timeout'=>25,'redirection'=>0,'sslverify'=>false)); $o['http']=is_wp_error($r)?$r->get_error_message():wp_remote_retrieve_response_code($r).' → '.wp_remote_retrieve_header($r,'location'); }
    $u=get_user_by('email','terra@gyvunai.lt'); $uid=$u?(int)$u->ID:0; $o['uid']=$uid;
    $o['refill']=$wpdb->get_row($wpdb->prepare("SELECT product_id,last_order_id,last_purchase_date,purchase_count,avg_interval_days,predicted_empty_date,confidence,status,feedback_cycle FROM {$wpdb->prefix}ps_refill_tracking WHERE user_id=%d AND product_id=12466",$uid),ARRAY_A);
    $o['consent']=$wpdb->get_results($wpdb->prepare("SELECT field,from_value,to_value,source,changed_at FROM {$wpdb->prefix}ps_consent_log WHERE email=%s ORDER BY id DESC LIMIT 2",'terra@gyvunai.lt'),ARRAY_A);
    $o['usermeta']=array('eligible'=>get_user_meta($uid,'ps_soft_optin_eligible',true),'optout'=>get_user_meta($uid,'ps_similar_optout',true),'weight'=>array_slice((array)get_user_meta($uid,'ps_weight_signal',true),-2));
    $o['relaunch']=$wpdb->get_row("SELECT klik_n,pask_svoris,primink_at,primink_kg,primink_busena FROM $t WHERE email='terra@gyvunai.lt'",ARRAY_A);
    $o['ivykiai']=$wpdb->get_results("SELECT laikas,tipas,raktas,raktas2,reiksme,kampanija FROM {$wpdb->prefix}ps_web_ivykiai WHERE tipas IN ('reminder_optin','email_calc_click') ORDER BY id DESC LIMIT 3",ARRAY_A);
  }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
});
