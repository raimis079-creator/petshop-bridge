<?php
/** TEMP PS S1685 mc — DEPLOY petshop-ads-offline.php v1.1 → v1.2: Conversion Time be poslinkio, Europe/Vilnius (Ads atmeta '+03:00'); bak; token_get_all; heartbeat. */
add_action('init', function(){
  if (!isset($_GET['ps_s1685mc'])) return; $o=array('v'=>'S1685 mc'); $f=WPMU_PLUGIN_DIR.'/petshop-ads-offline.php'; $s=file_get_contents($f); $o['md5_pries']=md5($s);
  $old="\t\t\t'laikas'  => \$o->get_date_paid()->format( 'Y-m-d H:i:sP' ),";
  $new="\t\t\t'laikas'  => \$o->get_date_paid()->setTimezone( new DateTimeZone( 'Europe/Vilnius' ) )->format( 'Y-m-d H:i:s' ), // v1.2 (S1685): Ads atmetė 'Y-m-d H:i:sP' (+03:00) — paskyros laiko juosta be poslinkio";
  if(substr_count($s,$old)!==1){ $o['STOP']='old rastas '.substr_count($s,$old); echo json_encode($o); exit; }
  $u=wp_upload_dir(); $bak=$u['basedir'].'/ps-backups/petshop-ads-offline.php.bak_s1685'; if(!file_exists($bak)) file_put_contents($bak,$s); $o['bak']=md5_file($bak)===md5($s);
  $n=str_replace($old,$new,$s); $n=str_replace("'v' => '1.0'","'v' => '1.2'",$n);
  try { token_get_all($n, TOKEN_PARSE); } catch (Throwable $e) { $o['STOP']=$e->getMessage(); echo json_encode($o); exit; }
  file_put_contents($f,$n); if(function_exists('opcache_invalidate')) opcache_invalidate($f,true); $o['md5_po']=md5_file($f);
  $hb=wp_remote_get(home_url('/'),array('timeout'=>20,'sslverify'=>false)); $code=is_wp_error($hb)?0:wp_remote_retrieve_response_code($hb); $o['heartbeat']=$code; if($code>=500||$code===0){ file_put_contents($f,$s); $o['ROLLBACK']=1; echo json_encode($o); exit; }
  $r=get_option('ps_ads_offline_raktas'); $resp=wp_remote_get(home_url('/?ps_ads_offline='.$r.'&dienos=3'),array('timeout'=>30,'sslverify'=>false)); $o['endpoint']=mb_substr(wp_remote_retrieve_body($resp),0,400);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
