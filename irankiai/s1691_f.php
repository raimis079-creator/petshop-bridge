<?php
/** TEMP PS S1691 f — petshop-dim-klientai.php 100–140 ir 230–280, aplinka lentelėje ir gyvai. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1691f'])) return; global $wpdb; $p=$wpdb->prefix; $o=array(); $wpdb->suppress_errors(true);
  $f=WPMU_PLUGIN_DIR.'/petshop-dim-klientai.php'; $l=file($f);
  foreach ($l as $i=>$ln){ if (($i>=100 && $i<140) || ($i>=228 && $i<280) || preg_match('/aplinka/',$ln)) $o['kodas'][$i+1]=rtrim($ln); }
  $o['aplinka_lenteleje']=$wpdb->get_results("SELECT aplinka, COUNT(*) n FROM {$p}ps_dim_klientai GROUP BY aplinka",ARRAY_A);
  $o['aplinka_fakt']=$wpdb->get_results("SELECT aplinka, COUNT(*) n FROM {$p}ps_fakt_uzsakymai GROUP BY aplinka",ARRAY_A);
  $o['opcija']=get_option('ps_dim_klientu_paskutinis'); $o['ps_aplinka_opt']=get_option('ps_aplinka'); $o['home']=home_url();
  if (class_exists('Petshop_Faktai') && method_exists('Petshop_Faktai','aplinka')) $o['faktai_aplinka']=Petshop_Faktai::aplinka();
  foreach (get_declared_classes() as $c){ if (stripos($c,'petshop')===0 && method_exists($c,'aplinka')) { try { $rm=new ReflectionMethod($c,'aplinka'); if ($rm->isStatic()&&$rm->isPublic()&&$rm->getNumberOfRequiredParameters()==0) $o['aplinka_metodai'][$c]=$c::aplinka(); } catch (Throwable $e) {} } }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
