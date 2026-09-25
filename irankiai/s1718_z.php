<?php
/** Plugin Name: TEMP PS S1718z — 2.10 ModSecurity AI botų taisyklių išjungimas .htaccess (serveriai.lt atsakymas 09-25). Fazės: 1 būklė + UA testas, 2 įrašyti (bak ps-archyvas/.htaccess.bak_s1718), 3 UA testas po, 9 atstatyti */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1718z'])) return;
  $f=$_GET['ps_s1718z']; @set_time_limit(170); $r=['v'=>'S1718z','faze'=>$f];
  $ht=ABSPATH.'.htaccess'; $bakdir=dirname(ABSPATH).'/ps-archyvas/'; $bak=$bakdir.'.htaccess.bak_s1718';
  $BLOKAS="# BEGIN PS ModSecurity AI botai (S1718, serveriai.lt 2026-09-25): praleisti ChatGPT-User/GPTBot/ClaudeBot\n<IfModule mod_security2.c>\nSecRuleRemoveById 999015\nSecRuleRemoveById 999016\nSecRuleRemoveById 999017\n</IfModule>\n# END PS ModSecurity AI botai\n";
  $ua=function() { $out=[]; foreach(['ChatGPT-User'=>'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot','GPTBot'=>'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot','ClaudeBot'=>'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)','OAI-SearchBot'=>'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot','Chrome'=>'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36'] as $k=>$u){
      foreach(['/','/kategorija/sunims/','/product/josera-optiness-sausas-pasaras-sunims-12-5-kg/'] as $p){ $res=wp_remote_get(home_url($p.'?ps_ua='.time()),['timeout'=>25,'redirection'=>0,'user-agent'=>$u,'sslverify'=>false]); $out[$k][$p]=is_wp_error($res)?'ERR '.mb_substr($res->get_error_message(),0,60):wp_remote_retrieve_response_code($res); } } return $out; };
  try{
  if($f==='1'){ $c=file_get_contents($ht); $r['dydis']=strlen($c); $r['rasomas']=is_writable($ht); $r['bak_yra']=is_file($bak); $r['bakdir_yra']=is_dir($bakdir); $r['jau_yra']=strpos($c,'SecRuleRemoveById')!==false; $r['modsec_blokai']=preg_match_all('#<IfModule mod_security2.c>#',$c); $r['pradzia']=mb_substr($c,0,600); $r['ua_pries']=$ua();
    $log=dirname(ABSPATH).'/logs/'; $r['logs_dir']=is_dir($log)?array_slice(scandir($log),0,20):'nera'; }
  if($f==='2'){ $c=file_get_contents($ht); if(strpos($c,'SecRuleRemoveById 999016')!==false){ $r['klaida']='jau yra'; wp_send_json($r); }
    if(!is_dir($bakdir)) @mkdir($bakdir,0750,true); if(!is_file($bak)) copy($ht,$bak); $r['bak']=is_file($bak)&&md5_file($bak)===md5($c);
    if(!$r['bak']){ $r['klaida']='bak nepavyko'; wp_send_json($r); }
    $naujas=$BLOKAS.$c; $r['irasyta']=(bool)file_put_contents($ht,$naujas); $r['md5_po']=md5_file($ht);
    $hb=[]; foreach(['/?ps_hb='.time(),'/parduotuve/?ps_hb=1','/kasa/?ps_hb=1'] as $u){ $res=wp_remote_get(home_url($u),['timeout'=>30,'redirection'=>2]); $hb[$u]=is_wp_error($res)?'ERR '.$res->get_error_message():wp_remote_retrieve_response_code($res); } $r['heartbeat']=$hb;
    $blogas=false; foreach($hb as $c2){ if(!is_int($c2)||$c2>=500) $blogas=true; } if($blogas){ copy($bak,$ht); $r['ATSTATYTA']='heartbeat 5xx'; }
    $r['ua_po']=$ua(); }
  if($f==='3'){ $r['ua']=$ua(); $c=file_get_contents($ht); $r['blokas_yra']=strpos($c,'SecRuleRemoveById 999016')!==false; $r['pradzia']=mb_substr($c,0,400); }
  if($f==='9'){ if(!is_file($bak)){ $r['klaida']='bak nera'; wp_send_json($r); } copy($bak,$ht); $r['atstatyta']=md5_file($ht); $r['ua']=$ua(); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
