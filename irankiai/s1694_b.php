<?php
/** TEMP PS S1694 b — ps_pets suvestinė: kiek realių anketų (ne test, po T-0), pasiskirstymai, svoriai, maistas, pet_products, field_log, drafts, weight_signal. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1694b'])) return; global $wpdb; $o=array(); $p=$wpdb->prefix; $T="{$p}ps_pets";
  $g=function($col,$where) use($wpdb,$T){ return $wpdb->get_results("SELECT IFNULL(NULLIF($col,''),'-') k,COUNT(*) n FROM $T WHERE $where GROUP BY k ORDER BY n DESC LIMIT 15",ARRAY_A); };
  $o['viso']=(int)$wpdb->get_var("SELECT COUNT(*) FROM $T");
  $o['pagal_status_test']=$wpdb->get_results("SELECT status,is_test,deleted_at IS NOT NULL istrinta,COUNT(*) n FROM $T GROUP BY 1,2,3",ARRAY_A);
  $o['pagal_men']=$wpdb->get_results("SELECT DATE_FORMAT(created_at,'%Y-%m') m,COUNT(*) n,SUM(is_test=1) test,SUM(created_at>='2026-09-07 22:00:00') po_t0 FROM $T GROUP BY m",ARRAY_A);
  $W="is_test=0 AND deleted_at IS NULL"; $o['realios']=(int)$wpdb->get_var("SELECT COUNT(*) FROM $T WHERE $W");
  $o['realios_po_t0']=(int)$wpdb->get_var("SELECT COUNT(*) FROM $T WHERE $W AND created_at>='2026-09-07 22:00:00'");
  $o['unik_vartotoju']=(int)$wpdb->get_var("SELECT COUNT(DISTINCT user_id) FROM $T WHERE $W AND user_id>0");
  $o['po_t0_sarasas']=$wpdb->get_results("SELECT id,user_id,species,species_detail,life_stage,dog_size,current_weight_kg w,activity_hint,feeding_type,primary_need,current_food_brand,primary_product_name,questionnaire_version qv,DATE_FORMAT(created_at,'%m-%d %H:%i') sukurta FROM $T WHERE $W AND created_at>='2026-09-07 22:00:00' ORDER BY created_at DESC",ARRAY_A);
  foreach (array('species','species_detail','life_stage','dog_size','is_sterilised','feeding_type','primary_need','sensitivities','housing','activity_hint','current_food_brand','questionnaire_version','source_draft_id IS NOT NULL') as $c) $o['pask'][$c]=$g($c,$W);
  $o['svoris']=$wpdb->get_results("SELECT species,COUNT(*) n,SUM(current_weight_kg IS NOT NULL) su_svoriu,ROUND(AVG(current_weight_kg),1) vid,MIN(current_weight_kg) mn,MAX(current_weight_kg) mx,SUM(birth_date IS NOT NULL) su_gimimo FROM $T WHERE $W GROUP BY species",ARRAY_A);
  $o['maistas_top']=$wpdb->get_results("SELECT IFNULL(primary_product_name,current_food_free_text) k,current_food_brand b,COUNT(*) n FROM $T WHERE $W GROUP BY 1,2 ORDER BY n DESC LIMIT 15",ARRAY_A);
  $o['pet_products']=$wpdb->get_results("SELECT relationship_type,source,COUNT(*) n,COUNT(DISTINCT pet_id) pets FROM {$p}ps_pet_products GROUP BY 1,2",ARRAY_A);
  $o['field_log']=$wpdb->get_results("SELECT laukas,saltinis,COUNT(*) n,MAX(laikas) pask FROM {$p}ps_pet_field_log GROUP BY 1,2 ORDER BY n DESC",ARRAY_A);
  $o['drafts']=$wpdb->get_results("SELECT status,COUNT(*) n,MAX(created_at) pask FROM {$p}ps_pet_profile_drafts GROUP BY status",ARRAY_A);
  $o['notes']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_pet_notes");
  $o['weight_signal']=$wpdb->get_results("SELECT COUNT(*) n FROM {$p}usermeta WHERE meta_key='ps_weight_signal'",ARRAY_A);
  $o['weight_signal_pvz']=$wpdb->get_col("SELECT meta_value FROM {$p}usermeta WHERE meta_key='ps_weight_signal' ORDER BY umeta_id DESC LIMIT 3");
  // ar anketą turintys pirko?
  $o['pirko']=$wpdb->get_results("SELECT (SELECT COUNT(*) FROM {$p}ps_fakt_uzsakymai f WHERE f.user_id=t.user_id) n_uzs,COUNT(*) pets FROM (SELECT DISTINCT user_id FROM $T WHERE $W AND user_id>0) t GROUP BY 1 ORDER BY 1",ARRAY_A);
  // web įvykiai apie anketą / skaičiuoklę
  $o['ivykiai']=$wpdb->get_results("SELECT ivykis,COUNT(*) n,MIN(DATE(laikas)) nuo FROM {$p}ps_web_ivykiai WHERE ivykis LIKE '%calc%' OR ivykis LIKE '%pet%' OR ivykis LIKE '%anket%' OR ivykis LIKE '%feed%' GROUP BY ivykis ORDER BY n DESC LIMIT 20",ARRAY_A);
  if ($wpdb->last_error) $o['err']=$wpdb->last_error;
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
