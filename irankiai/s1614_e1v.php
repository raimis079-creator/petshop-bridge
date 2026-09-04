<?php
/** TEMP PS S1614 run e1v — V (naujas procesas, tik skaitymas): #35435 po rankinio vėlavimo mygtuko — žymė, paskutinė pastaba, įvykis; `ps_dev_pastas_zurnalas` paskutinis įrašas (ar laiškas sugautas dev-pastas). */
add_action('init', function(){
  if (!isset($_GET['ps_e1v'])) return;
  $o=array('v'=>'S1614 e1v'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  try{
    $x=wc_get_order(35435); $o['st']=$x->get_status(); $o['vel']=(string)$x->get_meta('_ps_velavimo_laiskas');
    $nt=wc_get_order_notes(array('order_id'=>35435,'limit'=>2)); $o['pastabos']=array_map(function($n){ return mb_substr($n->content,0,260); },$nt);
    $o['ivykiai']=$wpdb->get_results($wpdb->prepare('SELECT veiksmas,rezultatas,kanalas,kas_vardas,laikas,pastaba FROM '.Petshop_Uzsakymu_Ivykiai::t().' WHERE uzsakymas=%d ORDER BY id DESC LIMIT 2',35435),ARRAY_A);
    $z=(array)get_option('ps_dev_pastas_zurnalas',array()); $o['dev_zurnalas']=count($z); $o['dev_paskutiniai']=array_map(function($e){ return is_array($e)?array_map(function($v){ return is_string($v)?mb_substr($v,0,160):$v; },$e):$e; },array_slice($z,-2));
    $o['velavimo_opcija']=get_option('ps_velavimo_laiskai_paskutinis'); $o['cron_kitas']=wp_next_scheduled('ps_velavimo_laiskai')?wp_date('Y-m-d H:i',wp_next_scheduled('ps_velavimo_laiskai')):null;
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
