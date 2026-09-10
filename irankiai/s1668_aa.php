<?php
/** TEMP PS S1668 aa — ištrinti Quattro prekių AV registro eilutes (tik tas, kurias S1668 y išjungė; id iš backup). DRY/A. */
add_action('init', function(){
  if (!isset($_GET['ps_s1668aa'])) return;
  $f=$_GET['ps_s1668aa']; global $wpdb; $S=$wpdb->prefix.'ps_sources'; $o=array('v'=>'S1668 aa','faze'=>$f);
  $bak=(array)get_option('ps_s1668_quattro_sand_bak',array()); $ids=array();
  foreach($bak as $pid=>$b) if(!empty($b['arow']['id'])) $ids[]=(int)$b['arow']['id'];
  $in=$ids?implode(',',$ids):'0';
  $o['kandidatai']=count($ids);
  $o['atitinka']=(int)$wpdb->get_var("SELECT COUNT(*) FROM $S WHERE id IN ($in) AND source='av' AND is_active=0 AND stock_qty=0");
  if($f==='A' && $o['atitinka']===count($ids)){ $o['istrinta']=$wpdb->query("DELETE FROM $S WHERE id IN ($in) AND source='av' AND is_active=0 AND stock_qty=0"); }
  $o['liko_av_quattro_prekems']=(int)$wpdb->get_var("SELECT COUNT(*) FROM $S s JOIN {$wpdb->prefix}postmeta pm ON pm.post_id=s.product_id AND pm.meta_key='_ps_sandelis' AND pm.meta_value='quattro' WHERE s.source='av'");
  wp_send_json($o);
});
