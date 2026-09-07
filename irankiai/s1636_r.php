<?php
/** TEMP PS S1636 run r — R: migruotu klientu recon (WP users, importo zymos, welcome modalas). READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1636r'])) return;
  $o=array('v'=>'S1636 r'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $o['users_viso']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}users");
  $roles=$wpdb->get_results("SELECT meta_value v, COUNT(*) n FROM {$p}usermeta WHERE meta_key='{$p}capabilities' GROUP BY meta_value ORDER BY n DESC LIMIT 8",OBJECT);
  $rr=array(); foreach($roles as $r){ $rr[substr($r->v,0,60)]=(int)$r->n; } $o['roles']=$rr;
  // vartotojai su uzsakymais (HPOS + legacy)
  $hpos=(int)$wpdb->get_var("SELECT COUNT(DISTINCT customer_id) FROM {$p}wc_orders WHERE customer_id>0");
  $o['users_su_uzsakymais_hpos']=$hpos;
  // importo pedsakai usermeta
  $keys=$wpdb->get_results("SELECT meta_key k, COUNT(*) n FROM {$p}usermeta WHERE meta_key LIKE '%import%' OR meta_key LIKE '%eshop%' OR meta_key LIKE '%migr%' OR meta_key LIKE '%ps_%' GROUP BY meta_key ORDER BY n DESC LIMIT 15",OBJECT);
  $kk=array(); foreach($keys as $r){ $kk[$r->k]=(int)$r->n; } $o['usermeta_zymos']=$kk;
  // registracijos datu pasiskirstymas (importas = viena diena, daug)
  $reg=$wpdb->get_results("SELECT DATE(user_registered) d, COUNT(*) n FROM {$p}users GROUP BY d ORDER BY n DESC LIMIT 6",OBJECT);
  $rd=array(); foreach($reg as $r){ $rd[$r->d]=(int)$r->n; } $o['registracijos_top']=$rd;
  // welcome modalas
  $o['welcome_modal_enabled']=get_option('petshop_welcome_modal_enabled','(nera)');
  $o['welcome_modal_failas']=file_exists(WP_CONTENT_DIR.'/plugins/petshop-core/includes/class-welcome-modal.php')?'plugins/petshop-core/includes':'kitur/nerasta';
  if($o['welcome_modal_failas']==='kitur/nerasta'){
    foreach(glob(WP_CONTENT_DIR.'/*/petshop-core/*/class-welcome-modal.php') as $f){ $o['welcome_modal_failas']=str_replace(WP_CONTENT_DIR,'',$f); }
  }
  // magic link klase
  $o['magic_login']=class_exists('Petshop_Magic_Login')?'yra':'klases nera (tikrinti faila)';
  foreach(glob(WP_CONTENT_DIR.'/{plugins,mu-plugins}/{,*/,*/*/}*magic*.php',GLOB_BRACE) as $f){ $o['magic_failai'][]=str_replace(WP_CONTENT_DIR,'',$f); }
  // Sender prenumeratoriai lokaliai?
  $o['sender_lenteles']=$wpdb->get_col("SHOW TABLES LIKE '{$p}%sender%'");
  wp_send_json($o);
},1);
