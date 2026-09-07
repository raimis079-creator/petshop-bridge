<?php
/** TEMP PS S1637 run z — eksporto TUŠČIO kiekio eilutės (589) → AV _stock=0. Z: DRY (kiek matchina, kiek dabar ne-0, pvz). ZA: APPLY per WC CRUD, sena reikšmė → ps_s1637_bak (bendras rollback). ZB/VF, variantinės, ne-publish — praleidžiamos. */
add_action('init', function(){
  if (!isset($_GET['ps_s1637z'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_s1637z'])); $o=array('v'=>'S1637 z','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $sk=$wpdb->get_results("SELECT pm.meta_value sku, pm.post_id, po.post_type, po.post_status FROM {$p}postmeta pm JOIN {$p}posts po ON po.ID=pm.post_id AND po.post_type='product' WHERE pm.meta_key='_sku' AND pm.meta_value<>''");
  $map=array(); foreach($sk as $r){ $map[trim((string)$r->sku)]=array((int)$r->post_id,$r->post_status); }
  $gid=$wpdb->get_results("SELECT pm.meta_value g, pm.post_id FROM {$p}postmeta pm JOIN {$p}posts po ON po.ID=pm.post_id AND po.post_type='product' AND po.post_status='publish' WHERE pm.meta_key='_global_unique_id' AND pm.meta_value<>''");
  $gmap=array(); foreach($gid as $r){ $gmap[trim((string)$r->g)]=array((int)$r->post_id,'publish'); }
  $st=array('eiluciu'=>0,'nerasta'=>0,'ne_publish'=>0,'variantine'=>0,'tiekejo'=>0,'jau0'=>0,'nulinti'=>0); $plan=array(); $pvz=array();
  foreach(array_filter(explode("\n",gzdecode(base64_decode('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')))) as $l){ $c=explode(';',$l); $s=trim($c[0]); $e=trim($c[1]??''); $st['eiluciu']++;
    if(strpos($s,'gift-coupon')===0 || preg_match('/-dp\d*$/i',$s)) continue;
    $hit=$map[$s] ?? ('PET'===substr($s,0,3)?($map[substr($s,3)]??null):null); if(!$hit && $e!=='') $hit=$gmap[$e]??null;
    if(!$hit){ $st['nerasta']++; continue; }
    if($hit[1]!=='publish'){ $st['ne_publish']++; continue; }
    $pid=$hit[0]; $pr=wc_get_product($pid); if(!$pr) { $st['nerasta']++; continue; }
    if($pr->is_type('variable')){ $st['variantine']++; continue; }
    if(get_post_meta($pid,'_vf_qty',true)!=='' || get_post_meta($pid,'_zb_qty',true)!==''){ $st['tiekejo']++; continue; }
    $dab=(int)get_post_meta($pid,'_stock',true);
    if($dab===0){ $st['jau0']++; continue; }
    $st['nulinti']++; $plan[$pid]=array($s,$dab);
    if(count($pvz)<15)$pvz[]=$s.' #'.$pid.' dabar '.$dab;
  }
  $o['st']=$st; $o['pvz']=$pvz;
  if($f==='ZA'){
    $bak=get_option('ps_s1637_bak',array()); $ok=0;
    foreach($plan as $pid=>$x){ if(!isset($bak[$pid])) $bak[$pid]=array('s'=>get_post_meta($pid,'_stock',true),'o'=>get_post_meta($pid,'_own_stock_qty',true));
      $pr=wc_get_product($pid); $pr->set_manage_stock(true); $pr->set_stock_quantity(0); $pr->save(); $ok++; }
    update_option('ps_s1637_bak',$bak,false);
    $o['nulinta']=$ok; $o['bak_n']=count($bak);
    $o['apollo']=array(19234=>get_post_meta(19234,'_stock',true),19228=>get_post_meta(19228,'_stock',true),19231=>get_post_meta(19231,'_stock',true));
  }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
