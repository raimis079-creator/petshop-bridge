<?php
/** TEMP PS S1685 ms — TESTAS naršyklėje: render (tekstas) + endpoint /?ps_pakartoti → kasa su prekėmis (užsakymas 35948, MnM rinkiniai). */
add_action('wp_loaded', function(){
  if (!isset($_GET['ps_s1685ms'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1685 ms'); $uid=2530; $oid=35948;
  $pid=(int)$wpdb->get_var($wpdb->prepare("SELECT product_id FROM {$p}ps_refill_tracking WHERE user_id=%d AND last_order_id=%d LIMIT 1",$uid,$oid)); $em=get_user_by('id',$uid)->user_email;
  $x=Petshop_Email_Dispatch::render('refill_due',array('product_id'=>$pid,'product_name'=>'x'),array('flow_class'=>'service','recipient_email'=>$em)); $o['tekstas']=trim(preg_replace('/\s+/',' ',wp_strip_all_tags($x['html'])));
  $g=Petshop_Pakartoti::grupe($uid,$pid); $o['prekes']=array_map(function($x){return ($x['rinkinys']?'[R] ':'').$x['pav'].' ×'.$x['kiekis'].' '.$x['kaina'];},$g['prekes']); $o['nera']=$g['nera'];
  $ev="(()=>{const rows=[...document.querySelectorAll('.woocommerce-checkout-review-order-table .cart_item')].map(r=>r.innerText.replace(/\\s+/g,' ').trim().slice(0,90));const tot=document.querySelector('.order-total')?.innerText.replace(/\\s+/g,' ');const err=[...document.querySelectorAll('.woocommerce-error li,.woocommerce-notice,.woocommerce-info')].map(e=>e.innerText.slice(0,120));return {url:location.pathname,rows,tot,err}})()";
  $o['shots']=array(array('n'=>'s1685_pak_kasa','u'=>Petshop_Pakartoti::url($oid),'w'=>1440,'eval'=>$ev,'full'=>true));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
