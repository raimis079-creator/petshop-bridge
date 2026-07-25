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
const CODE=`<?php
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_dv3']) || $_GET['ps_dv3']!=='Dv325x') return;
  global $wpdb; $pf=$wpdb->prefix; $t=$pf.'ps_pets';
  $row=$wpdb->get_row("SELECT * FROM $t WHERE species='rodent' AND (deleted_at IS NULL OR deleted_at='0000-00-00 00:00:00') ORDER BY id DESC LIMIT 1");
  $out=array();
  if(!$row){ $out['found']=false; }
  else {
    $out['found']=true;
    $out['name']=$row->pet_name; $out['detail']=$row->species_detail; $out['bd']=$row->birth_date;
    // Iskvieciam reflection metodu get_completeness (private)
    if(class_exists('Petshop_Pet_Dashboard')){
      $ref=new ReflectionMethod('Petshop_Pet_Dashboard','get_completeness');
      $ref->setAccessible(true);
      $out['completeness']=$ref->invoke(null,$row);
    } else { $out['completeness']='NO_CLASS'; }
  }
  header('Content-Type: application/json');
  echo '###DS###'.json_encode($out).'###DE###'; exit;
});`;
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'DV3 (temp)',code:CODE,scope:'front-end',active:true,priority:5});
let sid=null; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,120);}
execSync('sleep 4');
try{
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_dv3=Dv325x"',{maxBuffer:5e6,timeout:60000}).toString();
  const s=r.indexOf('###DS###'), e=r.indexOf('###DE###');
  o.result = (s>=0&&e>s) ? r.slice(s+8,e) : ('NF:'+r.slice(0,250));
}catch(e){o.result='ERR '+String(e).slice(0,120);}
if(sid!==null){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('dashver3.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
