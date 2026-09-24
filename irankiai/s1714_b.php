<?php
/** Plugin Name: TEMP PS S1714b anketos ivykiu saltinis read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1714b'])) return;
  $f=$_GET['ps_s1714b']; @set_time_limit(170); global $wpdb; $r=['v'=>'S1714b','faze'=>$f]; $P=$wpdb->prefix; $t=$P.'ps_laukai_ivykiai';
  try{
  if($f==='1'){
    $r['mu_src']=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-anketa-ivykiai.php');
    // started -> abandoned laiko skirtumai pagal sesija
    $r['poros']=$wpdb->get_results("SELECT s.laikas s_laikas, a.laikas a_laikas, TIMESTAMPDIFF(SECOND,s.laikas,a.laikas) sek, s.sesija, s.verte s_verte, a.verte a_verte, s.irenginys, s.user_id FROM $t s JOIN $t a ON a.sesija=s.sesija AND a.tipas='anketa_abandoned' AND a.laikas>=s.laikas AND a.laikas<DATE_ADD(s.laikas,INTERVAL 1 DAY) WHERE s.tipas='anketa_started' AND s.laikas>='2026-09-18' ORDER BY s.laikas DESC LIMIT 25",ARRAY_A);
    $r['sek_pasiskirstymas']=$wpdb->get_results("SELECT CASE WHEN d<5 THEN '<5s' WHEN d<30 THEN '5-30s' WHEN d<120 THEN '30-120s' ELSE '>120s' END b, COUNT(*) n FROM (SELECT MIN(TIMESTAMPDIFF(SECOND,s.laikas,a.laikas)) d FROM $t s JOIN $t a ON a.sesija=s.sesija AND a.tipas='anketa_abandoned' AND a.laikas>=s.laikas WHERE s.tipas='anketa_started' AND s.sesija<>'' GROUP BY s.id) x GROUP BY b",ARRAY_A);
    $r['started_be_sesijos']=(int)$wpdb->get_var("SELECT COUNT(*) FROM $t WHERE tipas='anketa_started' AND sesija=''");
    $r['verte_pvz']=$wpdb->get_results("SELECT tipas, verte, COUNT(*) n FROM $t WHERE tipas IN ('anketa_started','anketa_abandoned','step_started','step_completed','anketa_completed') GROUP BY tipas, verte ORDER BY tipas, n DESC LIMIT 40",ARRAY_A);
    $r['unik_sesijos']=$wpdb->get_results("SELECT tipas, COUNT(DISTINCT sesija) ses, COUNT(*) n FROM $t WHERE tipas IN ('anketa_started','anketa_abandoned','anketa_completed','step_started') AND laikas>='2026-09-09' GROUP BY tipas",ARRAY_A);
    $r['ps_pets_po_T0']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$P}ps_pets WHERE created_at>='2026-09-09'");
    $r['drafts']=$wpdb->get_results("SELECT DATE(created_at) d, COUNT(*) n FROM {$P}ps_pet_profile_drafts WHERE created_at>='2026-09-09' GROUP BY DATE(created_at) ORDER BY d DESC LIMIT 20",ARRAY_A);
  }
  if($f==='2'){
    foreach(glob(WP_PLUGIN_DIR.'/petshop-core/assets/*.js') as $g){ $s=file_get_contents($g); if(strpos($s,'anketa_started')!==false||strpos($s,'started')!==false){ preg_match_all('#.{0,400}(anketa_started|anketa_abandoned|step_started).{0,400}#s',$s,$m); $r['js'][basename($g)]=array_slice($m[0],0,6); } }
    foreach(glob(WP_PLUGIN_DIR.'/petshop-core/includes/*.php') as $g){ $s=file_get_contents($g); if(strpos($s,'anketa_started')!==false||strpos($s,'anketa_abandoned')!==false){ preg_match_all('#.{0,400}(anketa_started|anketa_abandoned).{0,400}#s',$s,$m); $r['php'][basename($g)]=array_slice($m[0],0,6); } }
    $r['modal_src']=file_get_contents(WP_PLUGIN_DIR.'/petshop-core/includes/class-welcome-modal.php');
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
