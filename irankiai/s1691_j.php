<?php
/** TEMP PS S1691 j — 508 publikuotų „nėra sandėlyje" prekių pjūvis pagal šaltinį (ps_sources / _ps_sandelis / VF-ZB meta), pardavimai 365 d., dropship qty=0 laikymo logika petshop-xml. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1691j'])) return; global $wpdb; $p=$wpdb->prefix; $o=array(); $wpdb->suppress_errors(true);
  $o['sources_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_sources");
  $o['sources_tipai']=$wpdb->get_results("SELECT source, COUNT(*) n FROM {$p}ps_sources GROUP BY source",ARRAY_A);
  $sql="SELECT ps.ID, ps.post_title, ps.post_date,
      (SELECT meta_value FROM {$p}postmeta WHERE post_id=ps.ID AND meta_key='_ps_sandelis' LIMIT 1) sandelis,
      (SELECT meta_value FROM {$p}postmeta WHERE post_id=ps.ID AND meta_key='_stock' LIMIT 1) stock,
      (SELECT meta_value FROM {$p}postmeta WHERE post_id=ps.ID AND meta_key='_own_stock_qty' LIMIT 1) av,
      (SELECT meta_value FROM {$p}postmeta WHERE post_id=ps.ID AND meta_key='_manage_stock' LIMIT 1) ms,
      (SELECT COUNT(*) FROM {$p}postmeta WHERE post_id=ps.ID AND meta_key='_vf_supplier_sku') vf,
      (SELECT COUNT(*) FROM {$p}postmeta WHERE post_id=ps.ID AND meta_key IN ('_zb_cost','_zb_sku','_zb_supplier_sku')) zb,
      (SELECT GROUP_CONCAT(DISTINCT source) FROM {$p}ps_sources s WHERE s.product_id=ps.ID) src,
      (SELECT COUNT(*) FROM {$p}ps_ist_eilutes e JOIN {$p}ps_ist_uzsakymai u ON u.id=e.uzsakymo_id WHERE e.wc_product_id=ps.ID AND u.ivykdytas=1 AND u.data>=NOW()-INTERVAL 365 DAY) ist365,
      (SELECT COUNT(*) FROM {$p}wc_order_product_lookup l JOIN {$p}wc_orders wo ON wo.id=l.order_id WHERE l.product_id=ps.ID AND wo.status IN ('wc-processing','wc-completed')) wc_uzs
    FROM {$p}posts ps JOIN {$p}postmeta st ON st.post_id=ps.ID AND st.meta_key='_stock_status' AND st.meta_value='outofstock'
    WHERE ps.post_type='product' AND ps.post_status='publish'";
  $r=$wpdb->get_results($sql,ARRAY_A); $o['viso']=count($r); $o['db_err']=$wpdb->last_error;
  $grp=array(); $pvz=array();
  foreach ($r as $x){ $k=($x['vf']?'VF':'').($x['zb']?'ZB':'').(!$x['vf']&&!$x['zb']?'be-xml':'').' | sandelis='.($x['sandelis']?:'-').' | src='.($x['src']?:'-');
    if (!isset($grp[$k])) $grp[$k]=array('n'=>0,'pard365'=>0,'wc_uzs'=>0,'av>0'=>0); $grp[$k]['n']++; if ((int)$x['ist365']>0) $grp[$k]['pard365']++; if ((int)$x['wc_uzs']>0) $grp[$k]['wc_uzs']++; if ((int)$x['av']>0) $grp[$k]['av>0']++;
    if (count($pvz[$k]??array())<3) $pvz[$k][]=$x['ID'].' '.mb_substr($x['post_title'],0,45).' stock='.$x['stock'].' av='.$x['av'].' ms='.$x['ms'].' ist365='.$x['ist365'];
  }
  arsort($grp); $o['grupes']=$grp; $o['pvz']=$pvz;
  // petshop-xml logika: qty=0 esamos publish prekės
  $f=WP_PLUGIN_DIR.'/petshop-xml/petshop-xml.php'; $l=file($f); foreach ($l as $i=>$ln){ if (preg_match('/qty\s*<=\s*0|qty_zero|outofstock|buvusi publish|lieka matoma|30 d|cleanup/i',$ln)) $o['xml_qty0'][$i+1]=trim(mb_substr($ln,0,170)); }
  foreach ((array)glob(WP_PLUGIN_DIR.'/petshop-xml/includes/*.php') as $inc){ $l=file($inc); foreach ($l as $i=>$ln){ if (preg_match('/outofstock|qty_zero|lieka matoma|draft.*qty|qty.*draft/i',$ln)) $o['inc_qty0'][basename($inc)][$i+1]=trim(mb_substr($ln,0,170)); } }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
