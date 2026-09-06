<?php
/** TEMP PS S1621 run e4p — RECON (tik skaitymas): dropship variklio siusti() (lipdukų sargas, su_partija), tiekimo atvira_su_eilutemis/paruosti/uzsakyti, archyvo struktūra „šiandien siųsta“. */
add_action('init', function(){
  if (!isset($_GET['ps_e4p'])) return;
  $o=array('v'=>'S1621 e4p'); global $wpdb; $p=$wpdb->prefix; set_time_limit(200);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $lines=function($file,$a,$b){ $L=explode("\n",(string)file_get_contents($file)); $r=array(); for($i=$a-1;$i<min($b,count($L));$i++){ $r[]=($i+1).': '.mb_substr(rtrim($L[$i]),0,230); } return $r; };
  try{
    $df=WPMU_PLUGIN_DIR.'/petshop-av-dropship.php'; $o['siusti']=$lines($df,1005,1110); $o['archyvuoti']=$lines($df,348,372); $o['grupuoti_grep']=array(); $L=explode("\n",(string)file_get_contents($df)); foreach($L as $k=>$l){ if(preg_match('/function grupuoti|function laukiantys_perdavimo|ps_dropship_archyvas|ARCHYVAS|get_option\(\s*[\'"]ps_dropship/i',$l)) $o['grupuoti_grep'][]=($k+1).': '.mb_substr(trim($l),0,200); }
    $tf=WPMU_PLUGIN_DIR.'/petshop-av-tiekimas.php'; $o['atvira']=$lines($tf,229,250); $o['atvira_su_eil']=$lines($tf,1046,1098); $o['uzsakyti_grep']=array(); $L=explode("\n",(string)file_get_contents($tf)); foreach($L as $k=>$l){ if(preg_match('/function uzsakyti\(|function priimti\(|const PRISTATYMAI|const META_LAUK|uzsakyta_be_laisko|function laisko_nust/i',$l)) $o['uzsakyti_grep'][]=($k+1).': '.mb_substr(trim($l),0,200); }
    $o['siusta_siandien']=$wpdb->get_results("SELECT id,tiekejas,uzsakyta FROM {$p}ps_tiekimas WHERE DATE(uzsakyta)=CURDATE()",ARRAY_A);
    $o['sent_src_meta']=$wpdb->get_results("SELECT order_id,meta_value FROM {$p}wc_orders_meta WHERE meta_key='_ps_dropship_sent_src' ORDER BY order_id DESC LIMIT 3",ARRAY_A);
    $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'");
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
