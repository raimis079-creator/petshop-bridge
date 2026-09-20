<?php
/** Plugin Name: TEMP PS S1699 paieskos recon (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1699'])||$_GET['ps_s1699']!=='1') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1699 ma'); global $wpdb; $p=$wpdb->prefix; $W="{$p}ps_web_ivykiai";
  try{
    $o['pvz']=$wpdb->get_results("SELECT id, laikas, url_kelias, raktas, raktas2, reiksme, sesija, kanalas FROM $W WHERE tipas='search' ORDER BY id DESC LIMIT 5",ARRAY_A);
    $o['n']=$wpdb->get_var("SELECT COUNT(*) FROM $W WHERE tipas='search' AND laikas>='2026-09-07'");
    $o['ses']=$wpdb->get_var("SELECT COUNT(DISTINCT sesija) FROM $W WHERE tipas='search' AND laikas>='2026-09-07'");
    $o['ses_visos']=$wpdb->get_var("SELECT COUNT(DISTINCT sesija) FROM $W WHERE laikas>='2026-09-07'");
    // frazės: raktas = užklausa? reiksme = rezultatų sk.?
    $rows=$wpdb->get_results("SELECT id, sesija, laikas, raktas, raktas2, reiksme, url_kelias FROM $W WHERE tipas='search' AND laikas>='2026-09-07' ORDER BY id",ARRAY_A);
    $fr=array();
    foreach($rows as $r){
      $q=trim(mb_strtolower($r['raktas']!==null?$r['raktas']:'')); if($q===''){ parse_str((string)parse_url($r['url_kelias'],PHP_URL_QUERY),$qs); $q=trim(mb_strtolower($qs['s']??'')); }
      if($q==='') continue;
      if(!isset($fr[$q])) $fr[$q]=array('n'=>0,'ses'=>array(),'rez'=>array(),'po_view'=>0,'po_cart'=>0,'po_order'=>0);
      $fr[$q]['n']++; $fr[$q]['ses'][$r['sesija']]=1; if($r['reiksme']!==null&&$r['reiksme']!=='') $fr[$q]['rez'][]=(int)$r['reiksme'];
      // kas vyko per 10 min toje pačioje sesijoje po paieškos
      $po=$wpdb->get_results($wpdb->prepare("SELECT tipas FROM $W WHERE sesija=%s AND id>%d AND laikas<=DATE_ADD(%s, INTERVAL 10 MINUTE) AND tipas IN ('view_item','add_to_cart','begin_checkout')",$r['sesija'],$r['id'],$r['laikas']),ARRAY_A);
      foreach($po as $x){ if($x['tipas']==='view_item') $fr[$q]['po_view']=1; if($x['tipas']==='add_to_cart') $fr[$q]['po_cart']=1; if($x['tipas']==='begin_checkout') $fr[$q]['po_order']=1; }
    }
    $out=array(); foreach($fr as $q=>$a){ $out[]=array('q'=>$q,'n'=>$a['n'],'ses'=>count($a['ses']),'rez'=>count($a['rez'])?min($a['rez']):null,'view'=>$a['po_view'],'cart'=>$a['po_cart'],'chk'=>$a['po_order']); }
    usort($out,function($a,$b){return $b['n']-$a['n'];}); $o['frazes']=$out; $o['unik']=count($out);
    $o['reiksme_pvz']=$wpdb->get_results("SELECT reiksme, COUNT(*) n FROM $W WHERE tipas='search' AND laikas>='2026-09-07' GROUP BY reiksme ORDER BY n DESC LIMIT 12",ARRAY_A);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
