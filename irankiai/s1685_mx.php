<?php
/** TEMP PS S1685 mx — TESTAS naršyklėje: endpoint → kasa rodo „Apmokėjimas kol kas negalimas"; žiūrim krepšelio klaidas ir eilutes. */
add_action('wp_loaded', function(){
  if (!isset($_GET['ps_s1685mx'])) return; $o=array('v'=>'S1685 mx'); $oid=35948;
  $ev="(()=>{const err=[...document.querySelectorAll('.woocommerce-error li, .woocommerce-error, .message-container')].map(e=>e.innerText.replace(/\\s+/g,' ').trim().slice(0,200));const rows=[...document.querySelectorAll('tr.cart_item, .cart_item')].map(r=>r.innerText.replace(/\\s+/g,' ').trim().slice(0,80));return {url:location.pathname,err,rows,body:document.querySelector('.woocommerce')?.innerText.replace(/\\s+/g,' ').slice(0,600)}})()";
  $o['shots']=array(array('n'=>'s1685_pak_kasa2','u'=>Petshop_Pakartoti::url($oid),'w'=>1440,'eval'=>$ev),array('n'=>'s1685_pak_krepselis','u'=>wc_get_cart_url(),'w'=>1440,'eval'=>$ev,'full'=>true));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
