<?php
/** TEMP PS S1614 run e4v — V (naujas procesas, tik skaitymas): #35431/#35434 po „Redaguoti“ — pastaba, įvykis prieš/po, shipping laukai; dev-pastas žurnalas (laiškas #35431); Playwright: Klausimai → „Taisyti adresą“ ant #35439 (sim klaida) → skydelis su forma. */
add_action('init', function(){
  if (!isset($_GET['ps_e4v'])) return;
  $o=array('v'=>'S1614 e4v'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  try{
    foreach(array(35431,35434) as $id){ $x=wc_get_order($id); $nt=wc_get_order_notes(array('order_id'=>$id,'limit'=>1)); $ev=$wpdb->get_row($wpdb->prepare('SELECT veiksmas,rezultatas,kanalas,kas_vardas,laikas,pastaba,pries,po FROM '.Petshop_Uzsakymu_Ivykiai::t().' WHERE uzsakymas=%d ORDER BY id DESC LIMIT 1',$id),ARRAY_A);
      $o[$id]=array('sh'=>array($x->get_shipping_address_1(),$x->get_shipping_postcode()),'tel'=>$x->get_billing_phone().'/'.$x->get_shipping_phone(),'vsod'=>(string)$x->get_meta('venipak_shipping_order_data'),'pastaba'=>$nt?mb_substr($nt[0]->content,0,400):null,'ivykis'=>$ev); }
    $z=(array)get_option('ps_dev_pastas_zurnalas',array()); $o['dev_zurnalas']=count($z); $o['dev_paskutinis']=end($z);
    $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
    $o['cookies']=array(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok)),array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok)),array('name'=>LOGGED_IN_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'logged_in',$tok)));
    $evf="(async()=>{await new Promise(r=>setTimeout(r,2500)); return {forma:!!document.getElementById('skRedF'),laukai:[...document.querySelectorAll('#skRedF input:not([type=hidden])')].map(x=>x.name+'='+x.value),klaus:(document.getElementById('skKlaus')||{innerText:''}).innerText,v:(document.getElementById('skV')||{innerText:''}).innerText.replace(/\\s+/g,' ')}; })()";
    $o['shots']=array(array('n'=>'s1614_e4_taisyti_35439','u'=>admin_url('admin.php?page=ps-desk&eile=klausimai'),'w'=>1400,'click'=>'.dl-kortele[data-id="35439"] button[data-redaguoti]','eval'=>$evf));
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
