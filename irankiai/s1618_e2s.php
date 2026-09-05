<?php
/** TEMP PS S1618 run e2s — S: `_ps_withdrawal` ant #35450 (TEST) + Playwright kadrai: Klausimų kortelė #35450 su atverta „Grąžinimas“ forma; skydelis #35777 su atverta forma; eilių skaičiai. C: meta nuimta, eilės po. */
add_action('init', function(){
  if (!isset($_GET['ps_e2s'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e2s'])); $o=array('v'=>'S1618 e2s','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp); $li=wp_generate_auth_cookie($uid,$exp,'logged_in',$tok);
  $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>$li)));
  $eiles=function() use($cs){ $r=wp_remote_get(admin_url('admin.php?page=ps-desk&eile=klausimai'),array('cookies'=>$cs,'timeout'=>90,'sslverify'=>false)); $h=(string)wp_remote_retrieve_body($r);
    return array('code'=>wp_remote_retrieve_response_code($r),'eiles'=>preg_match_all('/<a class="dl-eile[^"]*"[^>]*>(.*?)<\/a>/su',$h,$ea)?array_map(function($x){return trim(preg_replace('/\s+/',' ',wp_strip_all_tags($x)));},$ea[1]):null,'kort'=>preg_match_all('/<div class="dl-kortele eil" data-id="(\d+)"/su',$h,$kk)?$kk[1]:array()); };
  try{
  if($f==='S'){
    $ox=wc_get_order(35450); $ox->update_meta_data('_ps_withdrawal',current_time('mysql')); $ox->update_meta_data('_ps_withdrawal_reason','TEST S1618'); $ox->save();
    $o['eiles']=$eiles();
    $o['cookies']=array(); foreach($cs as $c){ $o['cookies'][]=array('name'=>$c->name,'value'=>$c->value); }
    $o['shots']=array(
      array('n'=>'s1618_e2_kortele_35450_forma','u'=>admin_url('admin.php?page=ps-desk&eile=klausimai'),'w'=>1440,'h'=>1100,'click'=>'.dl-kortele[data-id="35450"] .dl-gr-b','eval'=>'(function(){var f=document.querySelector(".dl-kortele[data-id=\'35450\'] .dl-gr-f"); if(!f) return "formos nėra"; f.scrollIntoView(); var s=f.querySelector(".dl-gr-pz"); s.value="brokas"; s.dispatchEvent(new Event("change",{bubbles:true})); var q=f.querySelector("input[type=number]"); q.value="0"; q.dispatchEvent(new Event("input",{bubbles:true})); var pr=f.querySelector(".dl-gr-pr"); return {rodoma:f.style.display,viso:f.querySelector(".dl-kr-viso").textContent,tinkama:f.querySelector(".dl-gr-tk").checked,prist_disabled:pr?pr.disabled:null,prist_checked:pr?pr.checked:null,top:f.getBoundingClientRect().top}; })()','full'=>true),
      array('n'=>'s1618_e2_kortele_35450_atsisakymas_dalinis','u'=>admin_url('admin.php?page=ps-desk&eile=klausimai'),'w'=>1440,'h'=>1100,'click'=>'.dl-kortele[data-id="35450"] .dl-gr-b','eval'=>'(function(){var f=document.querySelector(".dl-kortele[data-id=\'35450\'] .dl-gr-f"); if(!f) return "formos nėra"; f.scrollIntoView(); var q=f.querySelector("input[type=number]"); q.value="0"; q.dispatchEvent(new Event("input",{bubbles:true})); var pr=f.querySelector(".dl-gr-pr"); return {viso:f.querySelector(".dl-kr-viso").textContent,tinkama:f.querySelector(".dl-gr-tk").checked,prist_disabled:pr?pr.disabled:null,prist_checked:pr?pr.checked:null}; })()','full'=>true),
      array('n'=>'s1618_e2_skydelis_35777_forma','u'=>admin_url('admin.php?page=ps-desk&eile=visi&atidaryti=35777'),'w'=>1440,'h'=>1000,'click'=>'#skGraz','eval'=>'(function(){var f=document.querySelector("#skPr .dl-gr-f"); if(!f) return "formos nėra"; return {viso:f.querySelector(".dl-kr-viso").textContent,q:Array.from(f.querySelectorAll("input[type=number]")).map(function(i){return i.name+"="+i.value+"/"+i.max;}),prist:!!f.querySelector(".dl-gr-pr"),dabar:document.getElementById("skPastaba").textContent.slice(0,80)}; })()'),
      array('n'=>'s1618_e2_klausimai_35777','u'=>admin_url('admin.php?page=ps-desk&eile=klausimai'),'w'=>1440,'h'=>900,'eval'=>'(function(){var k=document.querySelector(".dl-kortele[data-id=\'35777\']"); if(!k) return "kortelės nėra"; k.scrollIntoView(); return k.innerText.slice(0,400); })()','full'=>true),
    );
    $J($o);
  }
  if($f==='C'){ $ox=wc_get_order(35450); $ox->delete_meta_data('_ps_withdrawal'); $ox->delete_meta_data('_ps_withdrawal_reason'); $ox->save(); wp_cache_flush(); $o['meta_nuimta']=(string)wc_get_order(35450)->get_meta('_ps_withdrawal')===''?1:0; $h=(string)wp_remote_retrieve_body(wp_remote_get(admin_url('admin.php?page=ps-desk&eile=klausimai'),array('cookies'=>$cs,'timeout'=>90,'sslverify'=>false))); $o['nav_raw']=mb_substr(trim(preg_replace('/\s+/',' ',wp_strip_all_tags(preg_match('/<main class="dl-main">(.*?)<div class="dl-kortele/su',$h,$mm)?$mm[1]:''))),0,400); $o['eiles']=$eiles(); $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'"); $J($o); }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
