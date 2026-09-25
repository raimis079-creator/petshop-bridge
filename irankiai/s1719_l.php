<?php
/** Plugin Name: TEMP PS S1719l — patikslintų PVM sąskaitų PDF + laiškai: 1 PDF regen + testas į terra@, 2 siųsti klientams */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1719l'])) return; $f=$_GET['ps_s1719l']; $r=['v'=>'S1719l','faze'=>$f]; @set_time_limit(200); global $wpdb;
  $ORD=[36112,36118,36141,36144,36281];
  try{
    foreach($ORD as $oid){ $o=wc_get_order($oid); if(!$o){ $r['pdf'][$oid]='nėra'; continue; }
      $avpn=$o->get_meta('_petshop_avpn_number'); $old=$o->get_meta('_petshop_completed_pdf');
      $pdf=function_exists('petshop_generate_invoice_pdf')?petshop_generate_invoice_pdf($oid):false;
      if($pdf&&file_exists($pdf)){ $o->update_meta_data('_petshop_completed_pdf',$pdf); $o->save(); }
      $txt=''; if($pdf&&file_exists($pdf)){ $raw=file_get_contents($pdf); $txt=(strpos($raw,$avpn)!==false)?'AVPN PDF viduje ✓':'AVPN PDF tekste nerastas (gali būti suspausta)'; }
      $r['pdf'][$oid]=['nr'=>$o->get_order_number(),'avpn'=>$avpn,'pdf'=>$pdf?basename($pdf):false,'bytes'=>$pdf&&file_exists($pdf)?filesize($pdf):0,'buvo'=>$old?basename($old):null,'tikr'=>$txt]; }
    $siusti=function($oid,$to) use(&$r){ $o=wc_get_order($oid); $nr=$o->get_order_number(); $avpn=$o->get_meta('_petshop_avpn_number'); $pdf=$o->get_meta('_petshop_completed_pdf');
      $subject='Patikslinta PVM sąskaita faktūra '.$avpn.' – užsakymas Nr. '.$nr;
      $body='<p>Sveiki,</p><p>dėl techninės klaidos Jūsų užsakymo Nr. '.$nr.' PVM sąskaitos faktūros numeris sutapo su kito užsakymo numeriu. Pridedame patikslintą sąskaitą faktūrą <strong>'.$avpn.'</strong> – ji pakeičia anksčiau atsiųstą. Užsakymo turinys, sumos ir apmokėjimas nesikeičia.</p><p>Atsiprašome už nepatogumus.</p><p>Petshop.lt komanda<br>uzsakymai@petshop.lt</p>';
      $mailer=WC()->mailer(); $html=$mailer->wrap_message('Patikslinta PVM sąskaita faktūra',$body); $ok=$mailer->send($to,$subject,$html,'',$pdf&&file_exists($pdf)?[$pdf]:[]);
      if($ok&&$to===$o->get_billing_email()) $o->add_order_note('S1719: klientui išsiųsta patikslinta PVM sąskaita '.$avpn.' ('.$to.').');
      return [$nr,$avpn,$to,$ok?'išsiųsta':'KLAIDA',basename((string)$pdf)]; };
    if($f==='1'){ $r['testas']=$siusti(36112,'terra@gyvunai.lt'); }
    if($f==='2'){ foreach($ORD as $oid){ $o=wc_get_order($oid); $r['issiusta'][$oid]=$siusti($oid,$o->get_billing_email()); } }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE); exit;
},1);
