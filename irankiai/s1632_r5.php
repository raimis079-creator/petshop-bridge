<?php
/** TEMP PS S1632 run r5 — R: 10546/10586 variacijų žemėlapis (tėvai, vaikai, terminai, _stock). READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1632r5'])) return;
  $o=array('v'=>'S1632 r5'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  foreach(array('10546','10586','10586Jumbo') as $s){
    $pid=(int)$wpdb->get_var($wpdb->prepare("SELECT pm.post_id FROM {$p}postmeta pm JOIN {$p}posts po ON po.ID=pm.post_id AND po.post_type='product' WHERE pm.meta_key='_sku' AND pm.meta_value=%s",$s));
    if(!$pid){ $o[$s]='nera'; continue; }
    $pr=wc_get_product($pid); $vs=array();
    foreach($pr->get_children() as $cid){ $v=wc_get_product($cid); $ats=array();
      foreach($v->get_attributes() as $tax=>$slug){ $t=get_term_by('slug',$slug,$tax); $ats[]=($t?$t->name:$slug); }
      $vs[]=array('vid'=>$cid,'sku'=>$v->get_sku(),'attr'=>implode('|',$ats),'stock'=>(int)get_post_meta($cid,'_stock',true)); }
    $o[$s]=array('pid'=>$pid,'pav'=>mb_substr($pr->get_name(),0,50),'vaikai'=>$vs);
  }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
