<?php
/** TEMP PS S1642 v — DP pakuociu savikainos patikra po v8.7.9. READ-ONLY.
 * Kiekvienai prekei su _dp_base_product_id: ar bazine turi ps_sources eilute,
 * bazines meta kaskada, ir kokia savikaina gauta pagal nauja logika. */
add_action('init', function(){
  if (!isset($_GET['ps_s1642v'])) return;
  $o=array('v'=>'S1642 v'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $dp=$wpdb->get_results("SELECT pm.post_id, pm.meta_value AS baze, COALESCE(pn.meta_value,1) AS n
    FROM {$p}postmeta pm
    JOIN {$p}posts po ON po.ID=pm.post_id AND po.post_type='product' AND po.post_status IN ('publish','draft','private','pending')
    LEFT JOIN {$p}postmeta pn ON pn.post_id=pm.post_id AND pn.meta_key='_dp_pack_qty'
    WHERE pm.meta_key='_dp_base_product_id' AND pm.meta_value<>''", ARRAY_A);
  $st=array('viso'=>count($dp),'reg_paveldi'=>0,'meta_paveldi'=>0,'be_savikainos'=>0);
  $t=$p.'ps_sources'; $reg_ok=($wpdb->get_var("SHOW TABLES LIKE '{$t}'")===$t);
  foreach($dp as $r){ $pid=(int)$r['post_id']; $b=(int)$r['baze']; $n=max(1,(int)$r['n']);
    $regn = $reg_ok ? (int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$t} WHERE product_id=%d AND is_active=1",$b)) : 0;
    $kask=null;
    foreach(array('_cost_price','_vf_cost','_zb_cost') as $ck){ $v=get_post_meta($b,$ck,true); if($v!=='' && (float)$v>0){ $kask=round((float)$v*$n,4); break; } }
    if($regn>0){ $st['reg_paveldi']++; }
    elseif($kask!==null){ $st['meta_paveldi']++; $o['nauji'][]=array('id'=>$pid,'baze'=>$b,'n'=>$n,'sav'=>$kask); }
    else { $st['be_savikainos']++; $o['likusios_be'][]=$pid.'<-'.$b; }
  }
  $o['st']=$st;
  wp_send_json($o);
},1);
