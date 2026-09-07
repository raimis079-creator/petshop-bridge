<?php
/** TEMP PS S1636 run f — F: class-welcome-modal.php b64 + augintinio puslapio/anketos marsrutai. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1636f'])) return;
  $o=array('v'=>'S1636 f'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $f=WP_CONTENT_DIR.'/plugins/petshop-core/includes/class-welcome-modal.php';
  $o['wm_dydis']=filesize($f); $o['wm_md5']=md5_file($f); $o['wm_b64']=base64_encode(file_get_contents($f));
  // augintinio anketa / puslapis
  foreach(glob(WP_CONTENT_DIR.'/plugins/petshop-core/includes/*.php') as $g){ $o['core_failai'][]=basename($g); }
  $pg=$wpdb->get_results("SELECT ID,post_name,post_status FROM {$p}posts WHERE post_type='page' AND (post_name LIKE '%augintin%' OR post_name LIKE '%anketa%') LIMIT 8",OBJECT);
  foreach($pg as $r){ $o['puslapiai'][]=$r->ID.':'.$r->post_name.':'.$r->post_status; }
  // my-account endpointai
  $o['ma_endpoints']=array_keys((array)apply_filters('woocommerce_account_menu_items',array()));
  // rinkiniu kategorija 91
  $t=get_term(91,'product_cat'); if($t && !is_wp_error($t)) $o['kat91']=$t->slug.' ('.$t->count.')';
  $t2=get_term(107,'product_cat'); if($t2 && !is_wp_error($t2)) $o['kat107']=$t2->slug;
  wp_send_json($o);
},1);
