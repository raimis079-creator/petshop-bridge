<?php
/** TEMP PS S1643 P — READ-ONLY: istorijos lauku konvencijos (imone, saskaita, variantas, wc_product_id). */
add_action('init', function(){
  if (!isset($_GET['ps_s1643p'])) return;
  $o=array('v'=>'S1643 P'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $o['imone']=$wpdb->get_results("SELECT imone,COUNT(*) n FROM {$p}ps_ist_uzsakymai GROUP BY imone ORDER BY n DESC LIMIT 6", ARRAY_A);
  $o['saskaita']=$wpdb->get_results("SELECT saskaita,COUNT(*) n FROM {$p}ps_ist_uzsakymai GROUP BY saskaita ORDER BY n DESC LIMIT 6", ARRAY_A);
  $o['variantas']=$wpdb->get_results("SELECT variantas,COUNT(*) n FROM {$p}ps_ist_eilutes WHERE variantas<>'' GROUP BY variantas ORDER BY n DESC LIMIT 8", ARRAY_A);
  $o['wcpid_null']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_ist_eilutes WHERE wc_product_id IS NULL");
  $o['wcpid_0']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_ist_eilutes WHERE wc_product_id=0");
  $o['susiejimas']=$wpdb->get_results("SELECT susiejimas,COUNT(*) n FROM {$p}ps_ist_eilutes GROUP BY susiejimas ORDER BY n DESC LIMIT 6", ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
