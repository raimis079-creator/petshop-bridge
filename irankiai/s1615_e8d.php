<?php
/** TEMP PS S1615 run e8d — D: taisyklių papildymas (Raimis 09-04 naktis: grąžinimo išlaidos 3,99 Eur su PVM visada; pakartotinis siuntimas — standartiniai įkainiai be nemokamo pristatymo; atšaukus — grąžinama sumokėta suma minus 3,99). 34524 „Pirkimo sąlygos ir taisyklės“ (WC terms page) — nauji 6.10–6.11 po 6.9; 14894 „Pristatymas“ — pastraipa perrašoma; 34523 „Grąžinimas“ — skyrelis „Neatsiimta siunta“ prieš „Pinigų grąžinimas“. md5 sargai, atsarginės kopijos į ps-backups. T: loopback + Playwright. */
add_action('init', function(){
  if (!isset($_GET['ps_e8d'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e8d'])); $o=array('v'=>'S1615 e8d','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(200);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  try{
  if($f==='D'){
    $up=wp_upload_dir(); $bk=trailingslashit($up['basedir']).'ps-backups'; wp_mkdir_p($bk);
    $guard=array(34524=>'e89ffdf1e1141f44c6782e890b292860',14894=>'6912904c7795812d9fed98addc2e534a',34523=>'b7b01db424ac4ecc9fb9605d11298df0');
    $C=array(); foreach($guard as $id=>$m){ $C[$id]=get_post($id)->post_content; if(md5($C[$id])!==$m){ $o['STOP']="$id md5 pasikeitė"; $J($o); } file_put_contents($bk."/puslapis-$id-".date('Y-m-d').".html",$C[$id]); }
    $t610='<p>6.10. Jeigu Pirkėjas siuntos neatsiima iš paštomato ar atsiėmimo punkto per vežėjo nustatytą saugojimo terminą arba nepriima jos iš kurjerio, vežėjas siuntą grąžina Pardavėjui, o Pardavėjas susisiekia su Pirkėju. Tokiu atveju Pirkėjas atlygina Pardavėjui tiesiogines siuntos grąžinimo išlaidas – 3,99 Eur (su PVM). Pakartotinis siuntimas atliekamas tik Pirkėjui iš anksto apmokėjus pasirinkto pristatymo būdo kainą pagal galiojančius pristatymo įkainius (nemokamo pristatymo sąlyga pakartotiniam siuntimui netaikoma) ir šiame punkte nurodytas siuntos grąžinimo išlaidas.</p>'."\n\n".'<p>6.11. Pirkėjui atsisakius pakartotinio siuntimo arba per 14 (keturiolika) dienų nuo Pardavėjo pranešimo nesusitarus dėl jo, užsakymas atšaukiamas, o Pirkėjui grąžinama už prekes ir pristatymą sumokėta suma, atskaičius 6.10 punkte nurodytas siuntos grąžinimo išlaidas. Pinigai grąžinami tuo pačiu būdu, kuriuo buvo sumokėta, ne vėliau kaip per 14 (keturiolika) dienų nuo siuntos grąžinimo Pardavėjui. Siuntos grąžinimo išlaidos Pirkėjui netaikomos, jei siunta nebuvo pristatyta dėl Pardavėjo ar vežėjo kaltės.</p>';
    $a='susijusių su prekių transportavimu.</p>'; if(substr_count($C[34524],$a)!==1){ $o['STOP']='34524 inkaras '.substr_count($C[34524],$a); $J($o); }
    $N[34524]=str_replace($a,$a."\n\n".$t610,$C[34524]);
    $a2='<p>Jeigu Pirkėjas prekių nepriima ir jos yra grąžinamos Pardavėjui, grąžinimo paslaugas apmoka Pirkėjas. Jei Pirkėjas laiku neatsiima užsakymo iš paštomato, grąžinimo paslaugas apmoka Pirkėjas. Pakartotinis siuntimas kainuoja tiek pat, kiek ir pradinis siuntimas. Nemokamas siuntimas pakartotiniam siuntimui netaikomas.</p>';
    if(substr_count($C[14894],$a2)!==1){ $o['STOP']='14894 inkaras '.substr_count($C[14894],$a2); $J($o); }
    $n2='<p>Jeigu Pirkėjas siuntos neatsiima iš paštomato ar atsiėmimo punkto per vežėjo nustatytą saugojimo terminą arba nepriima jos iš kurjerio, siunta grąžinama Pardavėjui. Tokiu atveju Pirkėjas atlygina siuntos grąžinimo išlaidas – <strong>3,99 Eur</strong> (su PVM). Pakartotinis siuntimas atliekamas tik Pirkėjui iš anksto apmokėjus pasirinkto pristatymo būdo kainą pagal galiojančius įkainius (nemokamas pristatymas pakartotiniam siuntimui netaikomas) ir siuntos grąžinimo išlaidas. Pirkėjui atsisakius pakartotinio siuntimo, užsakymas atšaukiamas ir grąžinama už prekes ir pristatymą sumokėta suma, atskaičius 3,99 Eur siuntos grąžinimo išlaidas (žr. <a href="/taisykles/">Pirkimo taisyklių</a> 6.10–6.11 p.).</p>';
    $N[14894]=str_replace($a2,$n2,$C[14894]);
    $a3='<h2>Pinigų grąžinimas</h2>'; if(substr_count($C[34523],$a3)!==1){ $o['STOP']='34523 inkaras '.substr_count($C[34523],$a3); $J($o); }
    $n3='<h2>Neatsiimta siunta</h2>'."\n".'<p>Jei siuntos neatsiėmėte iš paštomato per vežėjo nustatytą saugojimo terminą arba nepriėmėte iš kurjerio, ji grįžta mums. Susisieksime ir suderinsime: pakartotinį siuntimą (apmokamas pristatymas pagal galiojančius įkainius ir siuntos grąžinimo išlaidos – <strong>3,99 Eur</strong> su PVM) arba užsakymo atšaukimą (grąžinama sumokėta suma, atskaičius 3,99 Eur siuntos grąžinimo išlaidas). Plačiau – <a href="/taisykles/">Pirkimo taisyklių</a> 6.10–6.11 p.</p>'."\n\n".$a3;
    $N[34523]=str_replace($a3,$n3,$C[34523]);
    foreach($N as $id=>$c){ $r=wp_update_post(array('ID'=>$id,'post_content'=>$c),true); $o['rasyta'][$id]=is_wp_error($r)?$r->get_error_message():array('id'=>$r,'len_pries'=>strlen($C[$id]),'len_po'=>strlen(get_post($id)->post_content),'md5_po'=>md5(get_post($id)->post_content)); clean_post_cache($id); }
    if(function_exists('wp_cache_post_change')){ foreach($N as $id=>$c){ wp_cache_post_change($id); } $o['wpsc']='post_change'; }
  }
  if($f==='T'){
    foreach(array(34524=>'6.10.',14894=>'3,99 Eur',34523=>'Neatsiimta siunta') as $id=>$k){ $c=get_post($id)->post_content; $o['db'][$id]=array('md5'=>md5($c),'yra'=>substr_count($c,$k)); $u=get_permalink($id); $r=wp_remote_get($u,array('timeout'=>60,'sslverify'=>false,'headers'=>array('Cache-Control'=>'no-cache'))); $h=(string)wp_remote_retrieve_body($r); $o['front'][$id]=array('code'=>wp_remote_retrieve_response_code($r),'yra'=>substr_count($h,$k),'url'=>$u); }
    $o['shots']=array(
      array('n'=>'s1615_e8_taisykles_610','u'=>get_permalink(34524),'w'=>1200,'eval'=>"(()=>{const ps=[...document.querySelectorAll('p')].filter(p=>/^6\\.1[01]\\./.test(p.innerText.trim())); if(ps[0]) ps[0].scrollIntoView(); return {n:ps.length,t:ps.map(p=>p.innerText.slice(0,120))}; })()"),
      array('n'=>'s1615_e8_pristatymas','u'=>get_permalink(14894),'w'=>1200,'eval'=>"(()=>{const p=[...document.querySelectorAll('p')].find(p=>p.innerText.includes('3,99 Eur') && p.innerText.includes('neatsiima')); if(p) p.scrollIntoView(); return {yra:!!p,t:p?p.innerText.slice(0,160):''}; })()"),
      array('n'=>'s1615_e8_grazinimas','u'=>get_permalink(34523),'w'=>1200,'eval'=>"(()=>{const h=[...document.querySelectorAll('h2')].find(h=>h.innerText.includes('Neatsiimta')); if(h) h.scrollIntoView(); return {yra:!!h}; })()")
    );
  }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $J($o);
},99);
