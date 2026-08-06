import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s595',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run595'};
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczU5NSddKSB8fCAkX0dFVFsncHNfczU5NSddICE9PSAnSzU5NXNkJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgQHNldF90aW1lX2xpbWl0KDI4MCk7CiAgICBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OwogICAgJGFwcGx5ID0gaXNzZXQoJF9HRVRbJ2NvbmZpcm0nXSkgJiYgJF9HRVRbJ2NvbmZpcm0nXT09PSdBUFBMWV9TQU5ERUxJQUknOwogICAgJHI9YXJyYXkoJ1ZFUlNJSkEnPT4nczU5NScsJ3JlemltYXMnPT4kYXBwbHk/J0FQUExZJzonU0FVU0FTJyk7CgogICAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIElEIEZST00geyRwZn1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cyBJTiAoJ3B1Ymxpc2gnLCdkcmFmdCcsJ3ByaXZhdGUnKSIpOwogICAgJHNrPWFycmF5KCk7ICRyYXN5dGE9MDsgJGphdT0wOwogICAgZm9yZWFjaCgkaWRzIGFzICRwaWQpewogICAgICAgIGlmKCFjbGFzc19leGlzdHMoJ1BldHNob3BfRnVsZmlsbG1lbnRfU291cmNlJykpIGJyZWFrOwogICAgICAgICR2PVBldHNob3BfRnVsZmlsbG1lbnRfU291cmNlOjpyZXNvbHZlKChpbnQpJHBpZCk7CiAgICAgICAgJHM9aXNfYXJyYXkoJHYpPyR2Wydzb3VyY2UnXTonJzsKICAgICAgICBpZignbGVnYWN5Jz09PSRzKSAkcz0nYXYnOyAgICAgICAgICAgICAgLy8gbGVnYWN5ID0gQVYgc2FuZMSXbGlzIChSYWltaW8gc3ByZW5kaW1hcykKICAgICAgICBpZighJHMpIGNvbnRpbnVlOwogICAgICAgIGlmKCFpc3NldCgkc2tbJHNdKSkgJHNrWyRzXT0wOwogICAgICAgICRza1skc10rKzsKICAgICAgICAkZXNhbWFzPWdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKTsKICAgICAgICBpZigkZXNhbWFzPT09JHMpeyAkamF1Kys7IGNvbnRpbnVlOyB9CiAgICAgICAgaWYoJGFwcGx5KXsgdXBkYXRlX3Bvc3RfbWV0YSgkcGlkLCdfcHNfc2FuZGVsaXMnLCRzKTsgJHJhc3l0YSsrOyB9CiAgICB9CiAgICBhcnNvcnQoJHNrKTsKICAgICRyWydwYXNraXJzdHltYXMnXT0kc2s7CiAgICAkclsncHJla2l1X3Zpc28nXT1jb3VudCgkaWRzKTsKICAgICRyWydqYXVfdGVpc2luZ2FpJ109JGphdTsKICAgICRyWydpcmFzeXRhJ109JHJhc3l0YTsKICAgICRyWydkYl9wYXRpa3JhJ109JHdwZGItPmdldF9yZXN1bHRzKAogICAgICAiU0VMRUNUIG1ldGFfdmFsdWUgcywgQ09VTlQoKikgYyBGUk9NIHskcGZ9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19wc19zYW5kZWxpcycgR1JPVVAgQlkgbWV0YV92YWx1ZSBPUkRFUiBCWSBjIERFU0MiLEFSUkFZX0EpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8').replace(/^<\?php\s*/,'');
let sid=null;
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S595 Sandeliai',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 5');
const out=sh('curl -sSk --max-time 200 "'+SITE+'/?ps_s595=K595sd&confirm=APPLY_SANDELIAI"');
try{O.rez=JSON.parse(out);}catch(e){O.rez={raw:String(out).slice(0,1500)};}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putFile('analize/s595.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
