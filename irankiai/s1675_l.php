<?php
/** TEMP PS S1675 run l — krepšelio priminimų/atšaukimo terminai iš gyvo kodo. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_l5'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1675 l');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $dirs=array(WP_PLUGIN_DIR.'/petshop-esp',WP_PLUGIN_DIR.'/petshop-core',WPMU_PLUGIN_DIR);
  foreach($dirs as $d){ foreach(glob($d.'/{*,*/*}.php',GLOB_BRACE) as $f){ $c=file_get_contents($f); if(strpos($c,'cart_abandon')===false && strpos($c,'ps_carts')===false) continue; $ls=explode("\n",$c); foreach($ls as $i=>$l){ if(preg_match('/(HOUR|MINUTE|DAY_IN_SECONDS|\*\s*60|INTERVAL|abandon|expire|cancel|delay|_min|_val|hours|minutes)/i',$l) && preg_match('/cart|krep|abandon|expire/i',$l) && preg_match('/\d/',$l)) $o['kodas'][str_replace(ABSPATH,'',$f)][$i+1]=mb_substr(trim($l),0,150); } } }
  $o['opc']=$wpdb->get_results("SELECT option_name n,LEFT(option_value,300) v FROM {$p}options WHERE option_name LIKE 'ps_esp%' OR option_name LIKE 'petshop_esp%' OR option_name LIKE 'ps_email%' OR option_name LIKE 'ps_flow%' LIMIT 25",ARRAY_A);
  $o['as_hooks']=$wpdb->get_results("SELECT hook,COUNT(*) c FROM {$p}actionscheduler_actions WHERE hook LIKE '%cart%' OR hook LIKE '%krep%' GROUP BY hook",ARRAY_A);
  $o['cron_cart']=array(); foreach(_get_cron_array() as $ts=>$h){ foreach($h as $hk=>$x){ if(stripos($hk,'cart')!==false||stripos($hk,'krep')!==false||stripos($hk,'abandon')!==false){ $o['cron_cart'][$hk]=array('kada'=>date('m-d H:i',$ts),'sched'=>array_values($x)[0]['schedule']??''); } } }
  $o['carts_pvz']=$wpdb->get_results("SELECT status,last_cart_activity_at,status_changed_at,TIMESTAMPDIFF(MINUTE,last_cart_activity_at,status_changed_at) min FROM {$p}ps_carts WHERE status IN ('abandoned','expired') ORDER BY id DESC LIMIT 8",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
