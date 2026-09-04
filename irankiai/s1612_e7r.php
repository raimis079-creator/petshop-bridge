<?php
/** TEMP PS S1612 run e7r — R: Petshop_AV_Stock::increase/qty kodas (ar kuria _own_stock_qty), variklio atsaukti veiksmas, grazinti (av-reduce) — tik skaitymas */
add_action('init', function(){
  if (!isset($_GET['ps_e7r'])) return;
  $o=array('v'=>'run e7r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(120);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $src=function($cls,$m,$max=2000){ try{ $r=new ReflectionMethod($cls,$m); $ls=file($r->getFileName()); return mb_substr(implode('',array_slice($ls,$r->getStartLine()-1,$r->getEndLine()-$r->getStartLine()+1)),0,$max); }catch(Throwable $e){ return 'ERR '.$e->getMessage(); } };
  try{
    $o['increase']=$src('Petshop_AV_Stock','increase',1600); $o['qty']=$src('Petshop_AV_Stock','qty',900);
    $c=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-av-reduce.php'); if(preg_match('/function grazinti\s*\(.*?\n\t\}\n/s',$c,$m)) $o['grazinti']=mb_substr($m[0],0,2600);
    $c2=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-desk.php'); if(preg_match("/'atsaukti' === \\\$v[^\n]{0,400}/",$c2,$m)) $o['desk_atsaukti']=$m[0]; if(preg_match_all("/(if|elseif) \( 'atsaukti' === \\\$v[^\n]*\n(.{0,900})/s",$c2,$m)) $o['desk_atsaukti_blokas']=mb_substr($m[2][0]??'',0,900);
    $o['turi_siunta']=$src('Petshop_Desk','turi_siunta',700); $o['siuntos_kodas']=$src('Petshop_Desk','siuntos_kodas',900);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
