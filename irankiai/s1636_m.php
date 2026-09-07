<?php
/** TEMP PS S1636 run m — D: mu-plugins/petshop-katalogas.php v8.7.1→v8.7.2 (virsus() perskaiciavimas scroll'inant, rAF; sargai: md5, count==1, token_get_all, kopija, ping-rollback). Grazina naujo failo b64 repo sinchronizacijai. */
add_action('init', function(){
  if (!isset($_GET['ps_s1636m'])) return;
  $o=array('v'=>'S1636 m'); global $wpdb; $p=$wpdb->prefix; set_time_limit(200);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $ping=function(){ $r=wp_remote_get(admin_url('admin-ajax.php?action=heartbeat'),array('timeout'=>90,'sslverify'=>false)); $b=(string)wp_remote_retrieve_body($r); return array('code'=>wp_remote_retrieve_response_code($r),'fatal'=>(int)(stripos($b,'Fatal error')!==false)); };
  $fp=WPMU_PLUGIN_DIR.'/petshop-katalogas.php'; $up=wp_upload_dir(); $bk=$up['basedir'].'/ps-backups/petshop-katalogas-v871-BACKUP-2026-09-07.php';
  try{
  $live=(string)file_get_contents($fp); $o['md5_pries']=md5($live); $o['dydis_pries']=strlen($live);
  $old="\t\t\tvirsus();\n\t\t\twindow.addEventListener(\"resize\", virsus);\n\t\t\tsetTimeout(virsus, 400); setTimeout(virsus, 1200);";
  $new="\t\t\tvirsus();\n\t\t\twindow.addEventListener(\"resize\", virsus);\n\t\t\t/* v8.7.2 (S1636): breadcrumb nuslenka -> juostos apacia kyla, o thead likdavo\n\t\t\t   ties senu --ps-virsus (plysys virs antrastes). Perskaiciuojam scrollinant. */\n\t\t\tvar vRAF=false; window.addEventListener(\"scroll\", function(){ if(vRAF) return; vRAF=true; requestAnimationFrame(function(){ vRAF=false; virsus(); }); }, {passive:true});\n\t\t\tsetTimeout(virsus, 400); setTimeout(virsus, 1200);";
  if(md5($live)==='__NAUJAS_MD5__' || substr_count($live,'v8.7.2 (S1636)')===1){ $o['jau_v872']=1; $o['b64']=base64_encode($live); $J($o); }
  $n=substr_count($live,$old); $o['old_count']=$n; if($n!==1){ $o['STOP']='old_count!=1'; $J($o); }
  $naujas=str_replace($old,$new,$live);
  $naujas=str_replace(' * Petshop Katalogas v8.7.1 (S903) - STULPELIU ANTRASTE NEJUDA.',' * Petshop Katalogas v8.7.2 (S1636) - sticky antraste seka juosta scrollinant.'."\n".' * v8.7.1 (S903) - STULPELIU ANTRASTE NEJUDA.',$naujas);
  try{ token_get_all($naujas,TOKEN_PARSE); }catch(Throwable $e){ $o['STOP']='token: '.$e->getMessage(); $J($o); }
  $o['kopija']=(int)file_put_contents($bk,$live);
  $o['irasyta']=(int)file_put_contents($fp,$naujas); if(function_exists('opcache_invalidate')) opcache_invalidate($fp,true);
  $o['ping']=$ping(); if($o['ping']['fatal']||$o['ping']['code']>=500){ file_put_contents($fp,$live); $o['ATKURTA']=md5_file($fp); $J($o); }
  $o['md5_po']=md5_file($fp); $o['dydis_po']=filesize($fp); $o['b64']=base64_encode($naujas);
  $J($o);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage(); $J($o); }
},99);
