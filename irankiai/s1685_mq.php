<?php
/** TEMP PS S1685 mq — TESTAS: grupuotas refill_due render (klientas su ≥2 sekamomis to paties užsakymo prekėmis), vartai (laikinas sent job → antra prekė praleidžiama), nuoroda į endpoint'ą; laikini duomenys ištrinami. */
add_action('init', function(){
  if (!isset($_GET['ps_s1685mq'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1685 mq');
  $g=$wpdb->get_row("SELECT user_id,last_order_id,COUNT(*) n FROM {$p}ps_refill_tracking GROUP BY user_id,last_order_id HAVING n>=2 ORDER BY n DESC LIMIT 1",ARRAY_A); $o['grupe']=$g;
  $pids=$wpdb->get_col($wpdb->prepare("SELECT product_id FROM {$p}ps_refill_tracking WHERE user_id=%d AND last_order_id=%d",$g['user_id'],$g['last_order_id'])); $u=get_user_by('id',$g['user_id']); $em=$u->user_email;
  $pr=wc_get_product($pids[0]); $pay=array('product_id'=>(int)$pids[0],'product_name'=>$pr->get_name(),'feedback_url'=>home_url('/?fb=test'));
  $x=Petshop_Email_Dispatch::render('refill_due',$pay,array('flow_class'=>'service','recipient_email'=>$em)); $o['subject']=$x['subject']; $o['tekstas']=trim(preg_replace('/\s+/',' ',wp_strip_all_tags($x['html']))); preg_match_all('/href="([^"]+)"/',$x['html'],$m); $o['nuorodos']=array_map(function($u){return preg_replace('/(z=)[^&"]+/','$1…',$u);},$m[1]);
  $ctx=array('user_id'=>(int)$g['user_id'],'product_id'=>(int)$pids[1]); $o['vartai_pries']=apply_filters('petshop_email_eligibility',array('allowed'=>true,'reason'=>'','terminal'=>true),'refill_due','service',$em,$ctx);
  $wpdb->insert($p.'ps_email_jobs',array('job_key'=>'TEST_s1685mq','flow'=>'refill_due','flow_class'=>'service','recipient_email'=>$em,'recipient_user_id'=>$g['user_id'],'subject'=>'test','payload'=>'{}','status'=>'sent','provider'=>'test','attempts'=>1,'scheduled_at'=>gmdate('Y-m-d H:i:s'),'sent_at'=>gmdate('Y-m-d H:i:s'),'created_at'=>gmdate('Y-m-d H:i:s'),'updated_at'=>gmdate('Y-m-d H:i:s'),'context_json'=>json_encode(array('user_id'=>(int)$g['user_id'],'product_id'=>(int)$pids[0])))); $jid=$wpdb->insert_id;
  $o['vartai_po']=apply_filters('petshop_email_eligibility',array('allowed'=>true,'reason'=>'','terminal'=>true),'refill_due','service',$em,$ctx);
  $wpdb->delete($p.'ps_email_jobs',array('id'=>$jid)); $o['isvalyta']=!$wpdb->get_var("SELECT id FROM {$p}ps_email_jobs WHERE job_key='TEST_s1685mq'");
  $o['endpoint']=Petshop_Pakartoti::url($g['last_order_id']); $o['prekes']=array_map(function($x){return $x['pav'].' ×'.$x['kiekis'];},Petshop_Pakartoti::grupe((int)$g['user_id'],(int)$pids[0])['prekes']);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
