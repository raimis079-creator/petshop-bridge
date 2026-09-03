<?php
/** TEMP PS S1609 run e5r2 — Venipak sekimo formos parametras */
add_action('init', function(){
  if (!isset($_GET['ps_e5r2'])) return;
  $o=array('v'=>'run e5r2'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $r=wp_remote_get('https://venipak.com/lt/siuntos-sekimas/',array('timeout'=>20,'user-agent'=>'Mozilla/5.0'));
  if(is_wp_error($r)){ $o['err']=$r->get_error_message(); } else { $h=wp_remote_retrieve_body($r); $o['bytes']=strlen($h);
    preg_match_all('/<form[^>]*>/i',$h,$m); $o['forms']=array_slice($m[0],0,6);
    preg_match_all('/<input[^>]*>/i',$h,$m); $o['inputs']=array_values(array_filter(array_slice($m[0],0,40),function($x){return stripos($x,'track')!==false||stripos($x,'siunt')!==false||stripos($x,'pack')!==false||stripos($x,'number')!==false;}));
    preg_match_all('/[?&](tracking[a-z_]*|pack[a-z_]*|code|nr|number|siunt[a-z_]*)=/i',$h,$m); $o['params']=array_values(array_unique($m[0]));
    preg_match_all('/https?:\/\/[^\s\'"]*(track|sekim)[^\s\'"]*/i',$h,$m); $o['urls']=array_slice(array_values(array_unique($m[0])),0,12);
    if(preg_match_all('/(track[a-zA-Z_]*|pack_no|packNo)["\']?\s*[:=]/',$h,$m)) $o['js_keys']=array_slice(array_values(array_unique($m[0])),0,15);
  }
  $s=$wpdb->get_row("SELECT order_id,meta_value FROM {$p}wc_orders_meta WHERE meta_key='_ps_dalys_issiusta' LIMIT 1",ARRAY_A); $o['dalys_iss']=$s;
  $o['ivykiai']=class_exists('Petshop_Uzsakymu_Ivykiai')?get_class_methods('Petshop_Uzsakymu_Ivykiai'):'nėra';
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
