<?php
/** Plugin Name: TEMP PS S1720h — krepšelio/apmokėjimo ekrano nuotraukos (browser=1) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1720h'])) return; $r=['v'=>'S1720h'];
  $h=home_url();
  $r['shots']=[
    ['n'=>'s1720_p1','u'=>$h.'/product/exclusion-hypoallergenic-sausas-sunu-maistas-su-kiauliena-ir-zirneliais-m-l-12-kg/','w'=>1280,'h'=>900],
    ['n'=>'s1720_p2','u'=>$h.'/?add-to-cart=18560','w'=>1280,'h'=>900],
    ['n'=>'s1720_p3','u'=>$h.'/?add-to-cart=14804','w'=>1280,'h'=>900],
    ['n'=>'s1720_krepselis','u'=>$h.'/krepselis/','w'=>1280,'h'=>1000,'full'=>1],
    ['n'=>'s1720_apmokejimas','u'=>$h.'/kasa/','w'=>1280,'h'=>1400,'full'=>1],
    ['n'=>'s1720_mini','u'=>$h.'/','w'=>1280,'h'=>800,'click'=>'.header-cart-link, a.cart-link, .header-cart-icon a','eval'=>'(()=>{const a=document.querySelector(".header-cart-link,a.cart-link");return a?a.outerHTML.slice(0,200):"nera"})()'],
    ['n'=>'s1720_krepselis_m','u'=>$h.'/krepselis/','w'=>390,'h'=>844,'full'=>1],
  ];
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE); exit;
});
