<?php
/** TEMP PS S1685 mf — read-only naršyklės testas: kasoje matomas soft opt-out laukas (po billing formos), tekstas, nepažymėtas. */
add_action('wp_loaded', function(){
  if (!isset($_GET['ps_s1685mf'])) return; $o=array('v'=>'S1685 mf'); $u=wc_get_checkout_url();
  $ev="(()=>{const c=document.querySelector('#ps_similar_optout');const l=c?c.closest('p,label,.form-row'):null;const p=document.querySelector('.ps-sutikimai-paaisk');const e=document.querySelector('#billing_email');return {cb:!!c,checked:c?c.checked:null,label:l?l.innerText.trim().slice(0,120):null,paaisk:p?p.innerText.trim():null,vis:c?(c.offsetWidth>0||l.offsetHeight>0):null,poEmail:(c&&e)?((e.compareDocumentPosition(c)&Node.DOCUMENT_POSITION_FOLLOWING)>0):null}})()";
  $o['shots']=array(
    array('n'=>'s1685_so2_add','u'=>home_url('/?add-to-cart=16298'),'w'=>1440),
    array('n'=>'s1685_so2_kasa','u'=>$u,'w'=>1440,'eval'=>$ev),
    array('n'=>'s1685_so2_mob','u'=>$u,'w'=>390,'h'=>844,'eval'=>$ev,'full'=>true),
  );
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
