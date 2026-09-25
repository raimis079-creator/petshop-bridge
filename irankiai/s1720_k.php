<?php
/** Plugin Name: TEMP PS S1720k — krepšelio pažado ekrano nuotraukos (browser=1): vienas šaltinis → mišrus */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1720k'])) return; $h=home_url();
  $ev='(()=>{const e=[...document.querySelectorAll(".ps-pazadas-krepselis")].map(x=>x.className+" | "+x.textContent.trim());const lp=[...document.querySelectorAll("#shipping_method li, .woocommerce-shipping-methods li")].map(x=>x.textContent.trim().replace(/\s+/g," ").slice(0,60));return {pazadas:e,siuntimas:lp}})()';
  $r=['v'=>'S1720k','shots'=>[
    ['n'=>'s1720k_0','u'=>$h.'/product/exclusion-hypoallergenic-sausas-sunu-maistas-su-kiauliena-ir-zirneliais-m-l-12-kg/','w'=>1280,'h'=>900,'eval'=>'(()=>{const a=document.querySelector(".ps-pazadas");const k=document.querySelector(".ps-kg");return {pazadas:a?a.textContent.trim():null,kg:k?k.textContent:null}})()'],
    ['n'=>'s1720k_1','u'=>$h.'/?add-to-cart=18560','w'=>1280,'h'=>900],
    ['n'=>'s1720k_krepselis1','u'=>$h.'/krepselis/','w'=>1280,'h'=>900,'eval'=>$ev],
    ['n'=>'s1720k_apmok1','u'=>$h.'/kasa/','w'=>1280,'h'=>1100,'eval'=>$ev],
    ['n'=>'s1720k_2','u'=>$h.'/?add-to-cart=14804','w'=>1280,'h'=>900],
    ['n'=>'s1720k_krepselis2','u'=>$h.'/krepselis/','w'=>1280,'h'=>900,'eval'=>$ev],
    ['n'=>'s1720k_apmok2','u'=>$h.'/kasa/','w'=>1280,'h'=>1100,'eval'=>$ev],
    ['n'=>'s1720k_mini','u'=>$h.'/','w'=>1280,'h'=>800,'eval'=>'(()=>{const m=document.querySelector(".widget_shopping_cart_content, .cart-popup-inner, .header-cart-link + .nav-dropdown");return m?m.innerText.replace(/\s+/g," ").slice(0,400):"nera"})()'],
    ['n'=>'s1720k_krepselis_m','u'=>$h.'/krepselis/','w'=>390,'h'=>900,'full'=>1],
  ]];
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE); exit;
});
