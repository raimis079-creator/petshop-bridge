<?php
/** TEMP PS S1680 i — read-only: naršyklės testas — checkout su lengva AV preke, pasirinkti LP Express, ar matomas paštomatų select (ekrano nuotrauka + JS klaidos). */
add_action('wp_loaded', function(){
  if (!isset($_GET['ps_s1680i'])) return; $o=array('v'=>'S1680 i');
  wc_load_cart(); WC()->session->set_customer_session_cookie(true); WC()->cart->empty_cart(); WC()->cart->add_to_cart(16298,1);
  WC()->customer->set_shipping_country('LT'); WC()->customer->set_billing_country('LT'); WC()->customer->save(); WC()->cart->calculate_totals(); WC()->session->save_data();
  $cookies=array(); foreach(headers_list() as $h){ if(stripos($h,'Set-Cookie: wp_woocommerce_session_')===0){ $kv=explode('=',substr($h,12),2); $cookies[]=array('name'=>$kv[0],'value'=>urldecode(explode(';',$kv[1])[0])); } }
  $o['cookies']=$cookies; $u=wc_get_checkout_url(); $o['checkout_url']=$u;
  $ev="(()=>{const r=[...document.querySelectorAll('#shipping_method input[type=radio]')].map(i=>i.value+':'+i.checked);const s=document.querySelector('select.woo_lithuaniapost_lpexpress_terminal_id');const s2=document.querySelector('.select2-container');const cs=s?getComputedStyle(s):null;return {radios:r,select:!!s,opts:s?s.options.length:0,disp:cs?cs.display:null,vis:s?(s.offsetWidth>0&&s.offsetHeight>0):null,select2:!!s2,s2vis:s2?(s2.offsetWidth>0):null,jq:typeof jQuery,sel2fn:(typeof jQuery!=='undefined'&&jQuery.fn&&typeof jQuery.fn.select2),li:(()=>{const l=document.querySelector('#shipping_method li.petshop-selected-shipping');return l?l.innerText.slice(0,200):null})()}})()";
  $o['shots']=array(
    array('n'=>'s1680_lp_add','u'=>home_url('/?add-to-cart=16298'),'w'=>1440),
    array('n'=>'s1680_lp_pries','u'=>$u,'w'=>1440,'eval'=>$ev),
    array('n'=>'s1680_lp_po','u'=>$u,'w'=>1440,'click'=>'input[value="woo_lithuaniapost_lpexpress_terminal:12"]','eval'=>$ev),
    array('n'=>'s1680_lp_po2','u'=>$u,'w'=>1440,'eval'=>$ev),
    array('n'=>'s1680_lp_mob','u'=>$u,'w'=>390,'h'=>844,'click'=>'input[value="woo_lithuaniapost_lpexpress_terminal:12"]','eval'=>$ev,'full'=>true),
  );
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
