<?php
/** TEMP PS S1620 run e6r3 — 6 ETAPO RECON II (tik skaitymas): prekės 35781–35784, faktų/įvykių ne-testinės eilutės, partijos, AV žurnalas 5 prekėms, refill/pet nuorodos, klientų dim, PDF ne testiniai, testuotojas, Raimio 4 užsakymai. */
add_action('init', function(){
  if (!isset($_GET['ps_e6r3'])) return;
  $o=array('v'=>'S1620 e6r3'); global $wpdb; $p=$wpdb->prefix; set_time_limit(250);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $ids=array_merge(range(35414,35444),array(35450),range(35771,35813)); $idl=implode(',',$ids); $r4='35087,35088,35090,35100';
  try{
  foreach(array(35781,35782,35783,35784,35773) as $pid){ $x=get_post($pid); $o['post'][$pid]=$x?array($x->post_type,$x->post_status,mb_substr($x->post_title,0,50),$x->post_date,$x->post_parent,(int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$p}woocommerce_order_items oi JOIN {$p}woocommerce_order_itemmeta om ON om.order_item_id=oi.order_item_id WHERE om.meta_key='_product_id' AND om.meta_value=%d",$pid))):'NĖRA'; }
  $o['fakt_uzs_ne_test']=$wpdb->get_col("SELECT uzsakymas_id FROM {$p}ps_fakt_uzsakymai WHERE uzsakymas_id NOT IN ($idl) ORDER BY uzsakymas_id");
  $o['fakt_eil_ne_test']=$wpdb->get_results("SELECT uzsakymas_id,COUNT(*) n FROM {$p}ps_fakt_eilutes WHERE uzsakymas_id NOT IN ($idl) GROUP BY uzsakymas_id",ARRAY_A);
  $o['fakt_graz_ne_test']=$wpdb->get_col("SELECT uzsakymas_id FROM {$p}ps_fakt_grazinimai WHERE uzsakymas_id NOT IN ($idl)");
  $o['fakt_sandelis']=$wpdb->get_results("SELECT sandelis,COUNT(*) n FROM {$p}ps_fakt_eilutes GROUP BY sandelis",ARRAY_A); $o['fakt_siuntos_sandelis']=$wpdb->get_results("SELECT sandelis,vezejas,COUNT(*) n FROM {$p}ps_fakt_siuntos GROUP BY sandelis,vezejas",ARRAY_A);
  $o['fakt_testinis_reiksme']=$wpdb->get_results("SELECT testinis,COUNT(*) n FROM {$p}ps_fakt_uzsakymai GROUP BY testinis",ARRAY_A); $o['fakt_testinis_emailai']=get_option('ps_fakt_testiniai_emailai');
  $o['ivykiai_ne_test']=$wpdb->get_results("SELECT uzsakymas,COUNT(*) n FROM {$p}ps_uzsakymu_ivykiai WHERE uzsakymas NOT IN ($idl) GROUP BY uzsakymas ORDER BY n DESC LIMIT 15",ARRAY_A);
  $o['stats_ne_test']=$wpdb->get_col("SELECT order_id FROM {$p}wc_order_stats WHERE order_id NOT IN ($idl) ORDER BY order_id");
  $o['partijos']=$wpdb->get_results("SELECT id,product_id,gauta,kiekis_gautas,kiekis_liko,tiekejas FROM {$p}ps_partijos ORDER BY id",ARRAY_A);
  $o['tiekimas']=$wpdb->get_results("SELECT id,tiekejas,busena,sukurta,uzsakyta,gauta FROM {$p}ps_tiekimas ORDER BY id",ARRAY_A); $o['tiekimas_eil']=$wpdb->get_results("SELECT id,partija_id,product_id,order_id,qty,qty_gauta FROM {$p}ps_tiekimas_eil",ARRAY_A);
  foreach(array(19708,19756,16889,16727,35357) as $pid){ $o['av_zurnalas'][$pid]=array('n'=>(int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$p}ps_av_zurnalas WHERE product_id=%d",$pid)),'pirmas'=>$wpdb->get_row($wpdb->prepare("SELECT operacija,laukas,buvo,tapo,priezastis,sukurta FROM {$p}ps_av_zurnalas WHERE product_id=%d ORDER BY id ASC LIMIT 1",$pid),ARRAY_A),'pask'=>$wpdb->get_results($wpdb->prepare("SELECT operacija,laukas,buvo,tapo,LEFT(priezastis,40) pr,sukurta FROM {$p}ps_av_zurnalas WHERE product_id=%d ORDER BY id DESC LIMIT 3",$pid),ARRAY_A)); }
  $o['av_zurnalas_po_0902']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_av_zurnalas WHERE sukurta>='2026-09-02'"); $o['av_zurnalas_po_0902_prekes']=$wpdb->get_results("SELECT product_id,COUNT(*) n,MIN(buvo) minb,MAX(tapo) maxt FROM {$p}ps_av_zurnalas WHERE sukurta>='2026-09-02' GROUP BY product_id",ARRAY_A);
  $o['refill_test']=$wpdb->get_results("SELECT id,user_id,product_id,last_order_id FROM {$p}ps_refill_tracking WHERE last_order_id IN ($idl,$r4)",ARRAY_A); $o['pet_products_test']=$wpdb->get_results("SELECT id,user_id,product_id,last_order_id FROM {$p}ps_pet_products WHERE last_order_id IN ($idl,$r4)",ARRAY_A);
  $o['dim_klientai_test']=$wpdb->get_results("SELECT raktas,klientas_id,uzsakymu_sk FROM {$p}ps_dim_klientai WHERE uzsakymu_sk>0 ORDER BY paskutinis_pirkimas_at DESC LIMIT 12",ARRAY_A);
  $o['customer_lookup']=$wpdb->get_results("SELECT customer_id,user_id,email FROM {$p}wc_customer_lookup ORDER BY customer_id DESC LIMIT 12",ARRAY_A);
  $up=wp_upload_dir(); $fs=array_map('basename',glob($up['basedir'].'/wcdn/invoice/*.pdf')?:array()); $o['pdf_ne_test']=array_values(array_filter($fs,function($f){ if(preg_match('/AVPN0*(\d+)/',$f,$m)) return (int)$m[1]<283; if(preg_match('/IAPV0*(\d+)/',$f,$m)) return (int)$m[1]<160; return true; })); $o['pdf_iapv']=count(array_filter($fs,function($f){return strpos($f,'IAPV')!==false;}));
  $tu=get_user_by('login','testuotojas'); $o['testuotojas']=$tu?array($tu->ID,implode(',',$tu->roles),$tu->user_email,$tu->display_name):null; $o['darbuotojai']=$wpdb->get_results("SELECT u.ID,u.user_login,u.user_email FROM {$p}users u JOIN {$p}usermeta m ON m.user_id=u.ID AND m.meta_key='{$p}capabilities' WHERE m.meta_value LIKE '%ps_darbuotojas%' OR m.meta_value LIKE '%shop_manager%' OR m.meta_value LIKE '%administrator%'",ARRAY_A);
  foreach(explode(',',$r4) as $id){ $x=wc_get_order((int)$id); $o['raimio4'][$id]=$x?array($x->get_status(),$x->get_created_via(),$x->get_meta('_petshop_avpn_number'),$x->get_meta('_petshop_iapv_number'),count($x->get_items()),$x->get_meta('_ps_siuntos')?'siuntos':'',basename((string)$x->get_meta('_petshop_completed_pdf'))):'NĖRA'; }
  $o['audit_ids']=mb_substr((string)json_encode(get_option('ps_audit_ids')),0,270); $o['e3_oid']=array(get_option('ps_e3_oid'),get_option('ps_e3_oid2'),get_option('ps_test_product_id'));
  $o['comments_test']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}comments WHERE comment_post_ID IN ($idl)"); $o['comments_r4']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}comments WHERE comment_post_ID IN ($r4)");
  $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'");
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
