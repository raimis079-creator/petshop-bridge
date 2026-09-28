<?php
/** Plugin Name: TEMP PS S1731r #1208 IAPV PDF perdarymas tuo pačiu numeriu */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1731r'])) return;
  @set_time_limit(120); $r=['v'=>'S1731r']; $id=36555;
  try{
    $o=wc_get_order($id); $r['pries']=['iapv'=>$o->get_meta('_petshop_iapv_number'),'avpn'=>$o->get_meta('_petshop_avpn_number'),'doc_t'=>$o->get_meta('_petshop_invoice_document_type'),'pdf'=>$o->get_meta('_petshop_order_pdf'),'mtime'=>@filemtime($o->get_meta('_petshop_order_pdf')),'iapv_cnt'=>get_option('petshop_iapv_counter'),'avpn_cnt'=>get_option('petshop_avpn_counter')];
    if(!$o->get_meta('_petshop_iapv_number')||$o->get_meta('_petshop_avpn_number')) throw new Exception('netinka');
    $buvo=(string)$o->get_meta('_petshop_invoice_document_type'); $o->update_meta_data('_petshop_invoice_document_type','proforma'); $o->save(); $pdf=false;
    try{ $pdf=petshop_generate_invoice_pdf($id); } finally { $o=wc_get_order($id); $o->update_meta_data('_petshop_invoice_document_type',$buvo); if($pdf) $o->update_meta_data('_petshop_order_pdf',$pdf); $o->save(); }
    $o=wc_get_order($id); clearstatcache(); $r['po']=['pdf'=>$pdf,'mtime'=>@filemtime($pdf),'doc_t'=>$o->get_meta('_petshop_invoice_document_type'),'avpn'=>$o->get_meta('_petshop_avpn_number'),'iapv_cnt'=>get_option('petshop_iapv_counter'),'avpn_cnt'=>get_option('petshop_avpn_counter')];
    if($pdf){ $t=@file_get_contents($pdf); $r['pdf_dydis']=strlen((string)$t); }
    $o->add_order_note('Išankstinė sąskaita '.$o->get_meta('_petshop_iapv_number').' perdaryta su pakeistomis prekėmis (S1731). Klientui nesiųsta.',false,true);
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
