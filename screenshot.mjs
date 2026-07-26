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
const CODE='<?php add_action("wp_loaded",function(){ if(!isset($_GET["ps_sc9"])||$_GET["ps_sc9"]!=="Sc9x") return; $d=WP_PLUGIN_DIR."/petshop-core/"; header("Content-Type: application/json"); echo json_encode(array("profile"=>substr(hash_file("sha256",$d."includes/class-pet-profile.php"),0,16),"dashboard"=>substr(hash_file("sha256",$d."includes/class-pet-dashboard.php"),0,16),"pet_form"=>substr(hash_file("sha256",$d."assets/pet-form.js"),0,16),"pet_profile"=>substr(hash_file("sha256",$d."assets/pet-profile.js"),0,16))); exit; });';
try{
  const mk=wj('POST','code-snippets/v1/snippets',{name:'SC9 (temp)',code:CODE,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 4');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_sc9=Sc9x"',{maxBuffer:5e6,timeout:60000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}'); o.sha=(a>=0&&b>a)?JSON.parse(r.slice(a,b+1)):r.slice(0,200);
  if(sid!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){o.err=String(e).slice(0,200);}
putB64('shacheck.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
