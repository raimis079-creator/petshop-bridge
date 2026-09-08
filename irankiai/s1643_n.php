<?php
/** TEMP PS S1643 — parduotų DELTA (eShoprent 12099–12106). N=dry-run READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1643'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_s1643'])); $o=array('v'=>'S1643','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");

  $D="5414365260569;;1
AMLE12;;1
341850-dp;;1
HYPS02;;3
WWSOG5035;;2
83722;;3
83721;;3
83967;;3
82700121;;1
704001;;1
G378;;1
82767;;2
82765;;2
82764;;2
82741;;2
82804;;2
HYPS06;;1
G377;;1
5904181400848;S;1";

  $sk=$wpdb->get_results("SELECT pm.meta_value sku, pm.post_id, po.post_type, po.post_parent, po.post_status FROM {$p}postmeta pm JOIN {$p}posts po ON po.ID=pm.post_id AND po.post_type IN('product','product_variation') WHERE pm.meta_key='_sku' AND pm.meta_value<>''");
  $map=array(); foreach($sk as $r){ $map[trim((string)$r->sku)]=array((int)$r->post_id,$r->post_type,(int)$r->post_parent,$r->post_status); }

  $eil=array(); $sum_av=0;
  foreach(array_filter(explode("\n",$D)) as $l){
    $c=explode(';',$l); $s=trim($c[0]); $vv=trim($c[1]); $q=(int)$c[2];
    $row=array('sku'=>$s,'var'=>$vv,'kiekis'=>$q);
    if(!isset($map[$s])){ $row['busena']='NERASTA'; $eil[]=$row; continue; }
    list($pid,$ptype,$parent,$pst)=$map[$s];
    // variacija pagal atributo reiksme
    if($vv!=='' && $ptype==='product'){
      $vs=$wpdb->get_results($wpdb->prepare("SELECT ID FROM {$p}posts WHERE post_parent=%d AND post_type='product_variation'",$pid));
      $hit=0;
      foreach($vs as $v){ foreach($wpdb->get_results($wpdb->prepare("SELECT meta_key,meta_value FROM {$p}postmeta WHERE post_id=%d AND meta_key LIKE 'attribute_%%'",$v->ID)) as $m){
        if(mb_strtolower(trim($m->meta_value))===mb_strtolower($vv)){ $hit=(int)$v->ID; break 2; } } }
      if($hit){ $parent=$pid; $pid=$hit; $ptype='product_variation'; }
      else $row['pastaba']='variacija pagal "'.$vv.'" NERASTA — imama bazine';
    }
    $baz = ($ptype==='product_variation' && $parent) ? $parent : $pid;
    $row['pid']=$pid; $row['tipas']=$ptype; $row['bazine']=$baz; $row['statusas']=$pst;
    $row['pav']=mb_substr((string)get_the_title($baz),0,40);
    $vf=get_post_meta($baz,'_vf_qty',true); $zb=get_post_meta($baz,'_zb_qty',true);
    $row['vf']=($vf===''?null:$vf); $row['zb']=($zb===''?null:$zb);
    $row['ps_sandelis']=get_post_meta($baz,'_ps_sandelis',true);
    $row['av'] = ($vf===''||$vf===null) && ($zb===''||$zb===null);
    $row['stock']=get_post_meta($pid,'_stock',true);
    $row['own']=get_post_meta($baz,'_own_stock_qty',true);
    $row['manage']=get_post_meta($pid,'_manage_stock',true);
    if($row['av']){ $row['naujas_stock']=(int)$row['stock']-$q; $sum_av+=$q; }
    if(strpos($s,'-dp')!==false){
      $dp=array(); foreach($wpdb->get_results($wpdb->prepare("SELECT meta_key,meta_value FROM {$p}postmeta WHERE post_id=%d AND (meta_key LIKE '%%dp%%' OR meta_key LIKE '%%pakuot%%' OR meta_key='_ps_bazine' OR meta_key LIKE '_ps_%%')",$pid)) as $m) $dp[$m->meta_key]=mb_substr((string)$m->meta_value,0,40);
      $row['dp_meta']=$dp;
    }
    $eil[]=$row;
  }
  $o['eilutes']=$eil; $o['av_vnt_viso']=$sum_av;
  $o['db_stock_suma']=(int)$wpdb->get_var("SELECT SUM(meta_value+0) FROM {$p}postmeta WHERE meta_key='_stock'");
  $o['ping']=wp_remote_retrieve_response_code(wp_remote_get(home_url('/'),array('timeout'=>30,'sslverify'=>false)));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
