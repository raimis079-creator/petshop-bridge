import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:70000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const o={};
// PHP snippet: DB delete visu temp (id>=611, pavadinimas (temp)/tmp), su before/deleted/remaining
// SAUGIKLIS: NElieciam savęs (sio snippet) + NElieciam jei pavadinime nera aiskaus temp zymejimo
const CODE=`<?php
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_tmpdel']) || $_GET['ps_tmpdel']!=='TmpDel25x') return;
  global $wpdb; $pf=$wpdb->prefix; $t=$pf.'snippets';
  $self_marker='ps_tmpdel'; // sitas snippet turi si teksta - NEtriname savęs
  // before
  $before_total = (int)$wpdb->get_var("SELECT COUNT(*) FROM `$t`");
  // temp kandidatai: id>=611 IR (name LIKE '%(temp)%' OR name LIKE '%(TEMP)%' OR name LIKE '% tmp%' OR name LIKE '%tmp%') IR code NOT LIKE self
  $rows = $wpdb->get_results("SELECT id,name,active FROM `$t` WHERE id>=611 AND (name LIKE '%(temp)%' OR name LIKE '%(TEMP)%' OR name LIKE '%tmp%') AND code NOT LIKE '%$self_marker%'", ARRAY_A);
  $before_temp = count($rows);
  $deleted=array(); $failed=array();
  foreach($rows as $r){
    $id=(int)$r['id'];
    // 1. deaktyvuoti jei aktyvus
    $wpdb->update($t, array('active'=>0), array('id'=>$id));
    // 2. istrinti
    $d = $wpdb->delete($t, array('id'=>$id));
    if($d) $deleted[]=$id; else $failed[]=$id;
  }
  // after
  $after_total = (int)$wpdb->get_var("SELECT COUNT(*) FROM `$t`");
  $remaining_temp = (int)$wpdb->get_var("SELECT COUNT(*) FROM `$t` WHERE id>=611 AND (name LIKE '%(temp)%' OR name LIKE '%tmp%') AND code NOT LIKE '%$self_marker%'");
  $active_remaining = $wpdb->get_results("SELECT id,name FROM `$t` WHERE active=1 AND (name LIKE '%(temp)%' OR name LIKE '%tmp%')", ARRAY_A);
  header('Content-Type: application/json');
  echo '###R###'.json_encode(array(
    'before_total'=>$before_total,'before_temp'=>$before_temp,
    'deleted_count'=>count($deleted),'failed_count'=>count($failed),
    'after_total'=>$after_total,'remaining_temp'=>$remaining_temp,
    'active_remaining'=>$active_remaining,
    'failed_ids'=>array_slice($failed,0,20)
  )).'###E###'; exit;
});`;
try{
  const mk=wj('POST','code-snippets/v1/snippets',{name:'TmpDel (temp-self)',code:CODE,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,120);}
  o.sid=sid;
  execSync('sleep 4');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_tmpdel=TmpDel25x"',{maxBuffer:10e6,timeout:120000}).toString();
  const a=r.indexOf('###R###'),b=r.indexOf('###E###');
  o.result = (a>=0&&b>a) ? JSON.parse(r.slice(a+7,b)) : ('NF:'+r.slice(0,200));
  // istrinu save
  if(sid!=null){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){}
    try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){}
    // jei REST DELETE nepavyko, DB delete per antra snippet nebutina - liks vienas
  }
}catch(e){o.err=String(e).slice(0,200);}
putB64('tmpapply.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
