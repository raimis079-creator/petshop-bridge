<?php
/** TEMP PS S1685 mm — TESTAS (atskira užklausa): refill_due render per Petshop_Email_Dispatch::render su realia ps_refill_tracking eilute (nesiunčiama), eligibility filtro sandėlio patikra. */
add_action('init', function(){
  if (!isset($_GET['ps_s1685mm'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1685 mm');
  $r=$wpdb->get_row("SELECT rt.*,u.user_email FROM {$p}ps_refill_tracking rt JOIN {$wpdb->users} u ON u.ID=rt.user_id WHERE rt.status='active' ORDER BY rt.predicted_empty_date ASC LIMIT 1",ARRAY_A);
  $pr=wc_get_product($r['product_id']); $pay=array('product_id'=>(int)$r['product_id'],'product_name'=>$pr?$pr->get_name():'','product_url'=>$pr?$pr->get_permalink():'','reorder_url'=>'x','feedback_url'=>home_url('/?fb=test'));
  $o['eilute']=array('pid'=>$r['product_id'],'pred'=>$r['predicted_empty_date'],'stock'=>$pr?$pr->get_stock_status():null);
  $o['path']=apply_filters('petshop_email_template_path',PETSHOP_CORE_DIR.'templates/emails/refill.php','refill_due','refill');
  $x=Petshop_Email_Dispatch::render('refill_due',$pay,array('flow_class'=>'service','recipient_email'=>$r['user_email']));
  $o['subject']=$x['subject']; $h=$x['html']; $o['len']=strlen($h); $o['tekstas']=trim(preg_replace('/\s+/',' ',wp_strip_all_tags($h))); preg_match_all('/href="([^"]+)"/',$h,$m); $o['nuorodos']=array_map(function($u){return preg_replace('/(z=)[^&]+/','$1…',$u);},$m[1]);
  $o['elig']=apply_filters('petshop_email_eligibility',array('allowed'=>true,'reason'=>'','terminal'=>true),'refill_due','service',$r['user_email'],array('user_id'=>(int)$r['user_id'],'product_id'=>(int)$r['product_id']));
  $o['elig_nera']=apply_filters('petshop_email_eligibility',array('allowed'=>true,'reason'=>'','terminal'=>true),'refill_due','service',$r['user_email'],array('user_id'=>(int)$r['user_id'],'product_id'=>999999999));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
