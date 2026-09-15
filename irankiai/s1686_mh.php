<?php
/** TEMP PS S1686 mh — READ-ONLY: šėrimo lentelių aprėptis pagal maisto kategorijas; istorinių klientų paskutinė maisto prekė — egzistuoja/publish/turi lentelę. */
add_action('init', function(){
  if (!isset($_GET['ps_s1686mh'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1686 mh');
  foreach(array('ps_feeding_map','ps_feeding_rows','ps_feeding_tables') as $t){ $o['cols'][$t]=$wpdb->get_col("SHOW COLUMNS FROM {$p}$t"); $o['n'][$t]=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}$t"); }
  $o['map_pvz']=$wpdb->get_results("SELECT * FROM {$p}ps_feeding_map LIMIT 3",ARRAY_A);
  // maisto prekės pagal kategoriją (top-level po 'maistas'): publish, turi map
  $o['kat']=$wpdb->get_results("SELECT t.name kat, COUNT(DISTINCT pp.ID) prekes, COUNT(DISTINCT fm.product_id) su_lentele FROM {$p}posts pp JOIN {$p}term_relationships tr ON tr.object_id=pp.ID JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='product_cat' JOIN {$p}terms t ON t.term_id=tt.term_id LEFT JOIN {$p}ps_feeding_map fm ON fm.product_id=pp.ID WHERE pp.post_type='product' AND pp.post_status='publish' AND (t.slug LIKE '%maist%' OR t.slug LIKE '%konserv%' OR t.slug LIKE '%sausas%') GROUP BY t.term_id ORDER BY prekes DESC LIMIT 25",ARRAY_A);
  // istoriniai: paskutinė maisto eilutė pagal klientą
  $o['ist_eil_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_ist_fakt_eilutes");
  $o['ist_uz_maist']=$wpdb->get_results("SELECT CASE WHEN pp.ID IS NULL THEN 'nera_wp' WHEN pp.post_status<>'publish' THEN 'ne_publish' WHEN fm.product_id IS NULL THEN 'publish_be_lenteles' ELSE 'publish_su_lentele' END b, COUNT(*) klientai FROM (SELECT u.klientas_email_hash h, e.product_id pid FROM {$p}ps_ist_fakt_eilutes e JOIN {$p}ps_ist_fakt_uzsakymai u ON u.uzsakymas_id=e.uzsakymas_id JOIN (SELECT u2.klientas_email_hash h2, MAX(u2.apmoketa_at) m FROM {$p}ps_ist_fakt_uzsakymai u2 JOIN {$p}ps_ist_fakt_eilutes e2 ON e2.uzsakymas_id=u2.uzsakymas_id WHERE e2.kategoriju_kelias LIKE '%maist%' GROUP BY h2) last ON last.h2=u.klientas_email_hash AND last.m=u.apmoketa_at WHERE e.kategoriju_kelias LIKE '%maist%' GROUP BY h) x LEFT JOIN {$p}posts pp ON pp.ID=x.pid LEFT JOIN {$p}ps_feeding_map fm ON fm.product_id=x.pid GROUP BY b",ARRAY_A);
  $o['ist_be_maisto']=(int)$wpdb->get_var("SELECT COUNT(DISTINCT klientas_email_hash) FROM {$p}ps_ist_fakt_uzsakymai u WHERE NOT EXISTS (SELECT 1 FROM {$p}ps_ist_fakt_eilutes e WHERE e.uzsakymas_id=u.uzsakymas_id AND e.kategoriju_kelias LIKE '%maist%')");
  $o['ist_viso']=(int)$wpdb->get_var("SELECT COUNT(DISTINCT klientas_email_hash) FROM {$p}ps_ist_fakt_uzsakymai");
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
