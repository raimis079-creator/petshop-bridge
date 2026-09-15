<?php
/** TEMP PS S1686 mw — READ-ONLY: kraiko pirkėjai (top_kat kraikai) pagal grupę ir paskutinės kraiko prekės būseną; G4 dead_product kategorijos; kraiko prekių gyvumas kataloge. */
add_action('init', function(){
  if (!isset($_GET['ps_s1686mw'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1686 mw'); $t=Petshop_Relaunch::t();
  $o['kraikas_grupes']=$wpdb->get_results("SELECT grupe, COUNT(*) n, MIN(last_any_date) nuo, MAX(last_any_date) iki FROM $t WHERE top_kat LIKE '%Kraik%' GROUP BY grupe ORDER BY n DESC",ARRAY_A);
  $o['g4_kat']=$wpdb->get_results("SELECT last_kat, COUNT(*) n FROM $t WHERE grupe='G4_dead_product' GROUP BY last_kat ORDER BY n DESC LIMIT 8",ARRAY_A);
  $o['g4_prekes']=$wpdb->get_results("SELECT last_any_product_id pid, COUNT(*) n FROM $t WHERE grupe='G4_dead_product' GROUP BY pid ORDER BY n DESC LIMIT 8",ARRAY_A);
  foreach($o['g4_prekes'] as &$r){ $pr=wc_get_product((int)$r['pid']); $r['pav']=$pr?$pr->get_name():'(nėra)'; $r['busena']=$pr?($pr->get_status().'/'.($pr->is_in_stock()?'yra':'nėra')):'-'; } unset($r);
  $o['kraikas_katalogas']=$wpdb->get_results("SELECT pp.post_status s, COUNT(*) n FROM {$p}posts pp JOIN {$p}term_relationships tr ON tr.object_id=pp.ID JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id JOIN {$p}terms te ON te.term_id=tt.term_id WHERE pp.post_type='product' AND te.name LIKE 'Kraikai%' GROUP BY s",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
