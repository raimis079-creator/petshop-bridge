<?php
/** TEMP PS S1643 M — READ-ONLY: ps_ist_uzsakymai riba (max id, paskutiniai) + fakt/analize sluoksnio perstatymo kabliai. */
add_action('init', function(){
  if (!isset($_GET['ps_s1643m'])) return;
  $o=array('v'=>'S1643 M'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");

  $o['ist_max_id']=(int)$wpdb->get_var("SELECT MAX(id) FROM {$p}ps_ist_uzsakymai");
  $o['ist_min_id']=(int)$wpdb->get_var("SELECT MIN(id) FROM {$p}ps_ist_uzsakymai");
  $o['ist_paskutiniai']=$wpdb->get_results("SELECT id,data,statusas,ivykdytas,suma,eiluciu FROM {$p}ps_ist_uzsakymai ORDER BY id DESC LIMIT 8");
  $o['ist_virs_11990']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_ist_uzsakymai WHERE id>11990");
  $o['ist_uzs_stulpeliai']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_ist_uzsakymai");
  $o['ist_eil_stulpeliai']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_ist_eilutes");
  $o['fakt_uzs_max']=$wpdb->get_var("SELECT MAX(uzsakymas_id) FROM {$p}ps_ist_fakt_uzsakymai");
  $o['fakt_uzs_pvz']=$wpdb->get_results("SELECT uzsakymas_id,sukurta_at,statusas_galutinis FROM {$p}ps_ist_fakt_uzsakymai ORDER BY uzsakymas_id DESC LIMIT 5");
  $o['analize_max']=$wpdb->get_var("SELECT MAX(uzsakymas_id) FROM {$p}ps_v_analize_uzsakymai");

  // ar ps_v_analize_* yra VIEW ar lentele
  $o['v_analize_tipas']=$wpdb->get_var("SELECT TABLE_TYPE FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='{$p}ps_v_analize_uzsakymai'");
  $o['ist_fakt_tipas']=$wpdb->get_var("SELECT TABLE_TYPE FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='{$p}ps_ist_fakt_uzsakymai'");

  // kur kode minima ist_fakt (mu-plugins failu paieska)
  $hits=array();
  foreach(array(WPMU_PLUGIN_DIR,WP_PLUGIN_DIR) as $dir){
    if(!is_dir($dir)) continue;
    $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
    foreach($it as $file){ if(!$file->isFile()||substr($file->getFilename(),-4)!=='.php')continue;
      if($file->getSize()>3000000)continue;
      $c=@file_get_contents($file->getPathname()); if($c===false)continue;
      if(strpos($c,'ps_ist_fakt_uzsakymai')!==false||strpos($c,'ps_v_analize_uzsakymai')!==false||strpos($c,'ps_ist_uzsakymai')!==false){
        $hits[]=str_replace(array(WPMU_PLUGIN_DIR,WP_PLUGIN_DIR),array('MU','PL'),$file->getPathname());
      } }
  }
  $o['kodo_failai']=$hits;
  $o['ping']=wp_remote_retrieve_response_code(wp_remote_get(home_url('/'),array('timeout'=>30,'sslverify'=>false)));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
