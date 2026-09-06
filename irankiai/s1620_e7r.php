<?php
/** TEMP PS S1620 run e7r — 6 etapo recon II (tik skaitymas): AV žurnalas per prekę (pradinis buvo / dabartinis), partijos, tiekimas, ataskaitų dienos sritys, pets/refill sąsajos su testiniais, ivykiai našlaičiai, ps_carts. */
add_action('init', function(){
  if (!isset($_GET['ps_e7r'])) return;
  $o=array('v'=>'S1620 e7r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(200);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  try{
  $o['av_zurnalas_prekes']=$wpdb->get_results("SELECT product_id,laukas,COUNT(*) n,MIN(sukurta) nuo,MAX(sukurta) iki,SUBSTRING_INDEX(GROUP_CONCAT(buvo ORDER BY id),',',1) pirmas_buvo,SUBSTRING_INDEX(GROUP_CONCAT(tapo ORDER BY id DESC),',',1) pask_tapo FROM {$p}ps_av_zurnalas GROUP BY product_id,laukas ORDER BY n DESC LIMIT 25",ARRAY_A);
  $o['av_zurnalas_op']=$wpdb->get_results("SELECT operacija,COUNT(*) n FROM {$p}ps_av_zurnalas GROUP BY operacija",ARRAY_A);
  $o['partijos']=$wpdb->get_results("SELECT id,product_id,gauta,kiekis_gautas,kiekis_liko,savikaina_eur,SUBSTRING(pastaba,1,40) pastaba FROM {$p}ps_partijos ORDER BY id",ARRAY_A);
  $o['tiekimas']=$wpdb->get_results("SELECT id,tiekejas,busena,sukurta,SUBSTRING(pastaba,1,40) pastaba FROM {$p}ps_tiekimas ORDER BY id",ARRAY_A);
  $o['ataskaitu_dienos']=$wpdb->get_results("SELECT sritis,aplinka,COUNT(*) n,MIN(diena) nuo,MAX(diena) iki FROM {$p}ps_ataskaitu_dienos GROUP BY sritis,aplinka",ARRAY_A);
  $o['kontrole_dienos']=$wpdb->get_results("SELECT diena,woo_apmoketi,woo_suma_ct,fakt FROM {$p}ps_kontrole_dienos ORDER BY diena",ARRAY_A);
  $o['fakt_uzs_testinis']=$wpdb->get_results("SELECT testinis,COUNT(*) n FROM {$p}ps_fakt_uzsakymai GROUP BY testinis",ARRAY_A); $o['fakt_eil_testinis']=$wpdb->get_results("SELECT testinis,COUNT(*) n FROM {$p}ps_fakt_eilutes GROUP BY testinis",ARRAY_A);
  $o['fakt_atsargos_testinis']=$wpdb->get_results("SELECT testinis,COUNT(*) n,MIN(data) nuo,MAX(data) iki FROM {$p}ps_fakt_atsargos_d GROUP BY testinis",ARRAY_A); $o['dim_kl_testinis']=$wpdb->get_results("SELECT testinis,COUNT(*) n FROM {$p}ps_dim_klientai GROUP BY testinis",ARRAY_A);
  $o['ivykiai_nasl']=$wpdb->get_results("SELECT MIN(x.uzsakymas) a,MAX(x.uzsakymas) b,COUNT(*) n,COUNT(DISTINCT x.uzsakymas) d FROM {$p}ps_uzsakymu_ivykiai x LEFT JOIN {$p}wc_orders w ON w.id=x.uzsakymas WHERE w.id IS NULL",ARRAY_A);
  $o['ivykiai_tipai']=$wpdb->get_results("SELECT tipas,COUNT(*) n FROM {$p}ps_uzsakymu_ivykiai GROUP BY tipas ORDER BY n DESC LIMIT 15",ARRAY_A);
  $o['carts']=$wpdb->get_results("SELECT status,COUNT(*) n,MIN(created_at) nuo,MAX(created_at) iki FROM {$p}ps_carts GROUP BY status",ARRAY_A);
  $o['pets_users']=$wpdb->get_results("SELECT user_id,COUNT(*) n FROM {$p}ps_pets GROUP BY user_id ORDER BY n DESC LIMIT 12",ARRAY_A); $o['refill']=$wpdb->get_results("SELECT user_id,COUNT(*) n,MAX(last_order_id) lo FROM {$p}ps_refill_tracking GROUP BY user_id",ARRAY_A);
  $o['pet_products_lo']=$wpdb->get_results("SELECT last_order_id,COUNT(*) n FROM {$p}ps_pet_products GROUP BY last_order_id",ARRAY_A);
  $o['email_jobs']=$wpdb->get_results("SELECT flow,status,COUNT(*) n FROM {$p}ps_email_jobs GROUP BY flow,status ORDER BY n DESC LIMIT 12",ARRAY_A); $o['event_log']=$wpdb->get_results("SELECT event_name,status,COUNT(*) n FROM {$p}ps_event_log GROUP BY event_name,status ORDER BY n DESC LIMIT 10",ARRAY_A);
  $o['sargas_klaidos']=$wpdb->get_row("SELECT COUNT(*) n,MIN(laikas) nuo,MAX(laikas) iki FROM {$p}ps_sargas_klaidos",ARRAY_A);
  $o['wc_lookup_nasl']=array('stats'=>$wpdb->get_col("SELECT order_id FROM {$p}wc_order_stats s LEFT JOIN {$p}wc_orders w ON w.id=s.order_id WHERE w.id IS NULL"),'items'=>$wpdb->get_col("SELECT DISTINCT order_id FROM {$p}woocommerce_order_items i LEFT JOIN {$p}wc_orders w ON w.id=i.order_id WHERE w.id IS NULL"));
  $o['customer_lookup']=$wpdb->get_results("SELECT customer_id,user_id,SUBSTRING(email,1,30) email FROM {$p}wc_customer_lookup ORDER BY customer_id",ARRAY_A);
  $o['venipak_manifest']=$wpdb->get_results("SELECT option_name FROM {$p}options WHERE option_name LIKE '%venipak%manifest%' OR option_name LIKE '%venipak_last%' LIMIT 8",ARRAY_A);
  $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'");
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
