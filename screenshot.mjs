import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s546',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run546'};
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczU0NiddKSB8fCAkX0dFVFsncHNfczU0NiddICE9PSAnSzU0NmtqJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgQHNldF90aW1lX2xpbWl0KDIwMCk7CiAgICAkcj1hcnJheSgnVkVSU0lKQSc9PidzNTQ2Jyk7CiAgICAkZGlyPVdQX1BMVUdJTl9ESVIuJy93Yy12ZW5pcGFrLXNoaXBwaW5nJzsKICAgIGlmKCFpc19kaXIoJGRpcikpeyBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdlcnInPT4nbsSXcmEga2F0YWxvZ28nKSk7IGV4aXQ7IH0KICAgICRpdD1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGRpcixGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICAgJHVybHM9YXJyYXkoKTsgJGZhaWxhaT1hcnJheSgpOyAka3ZpZXQ9YXJyYXkoKTsKICAgIGZvcmVhY2goJGl0IGFzICRmKXsKICAgICAgICBpZihzdWJzdHIoJGYsLTQpIT09Jy5waHAnKSBjb250aW51ZTsKICAgICAgICAkYz1AZmlsZV9nZXRfY29udGVudHMoJGYpOyBpZigkYz09PWZhbHNlKSBjb250aW51ZTsKICAgICAgICAkYj1iYXNlbmFtZSgkZik7ICRmYWlsYWlbJGJdPXN0cmxlbigkYyk7CiAgICAgICAgaWYocHJlZ19tYXRjaF9hbGwoJyNodHRwczovL2dvXC52ZW5pcGFrXC5sdC9bYS16MC05Xy9cLl0rI2knLCRjLCRtKSl7CiAgICAgICAgICAgIGZvcmVhY2goJG1bMF0gYXMgJHUpICR1cmxzWyR1XT0oJHVybHNbJHVdPz8wKSsxOwogICAgICAgIH0KICAgICAgICBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkYykgYXMgJGk9PiRsKXsKICAgICAgICAgICAgaWYocHJlZ19tYXRjaCgnL2NvdXJpZXJ8Y2FsbF8/Y2FycmllcnxwaWNrdXBfP3JlcXVlc3R8bWFuaWZlc3RfcHJpbnR8cHJpbnRfbWFuaWZlc3QvaScsJGwpKXsKICAgICAgICAgICAgICAgICRrdmlldFtdPSRiLic6Jy4oJGkrMSkuJyAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMTUwKSk7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICB9CiAgICAkclsnZmFpbGFpJ109JGZhaWxhaTsKICAgICRyWydhcGlfdXJsJ109YXJyYXlfa2V5cygkdXJscyk7CiAgICAkclsna3VyamVyaW9fZWlsdXRlcyddPWFycmF5X3NsaWNlKCRrdmlldCwwLDQwKTsKICAgIC8vIGtsYXPEl3MKICAgIGZvcmVhY2goZ2V0X2RlY2xhcmVkX2NsYXNzZXMoKSBhcyAkYyl7CiAgICAgICAgaWYoc3RyaXBvcygkYywndmVuaXBhaycpIT09ZmFsc2UpICRyWydrbGFzZXMnXVtdPSRjOwogICAgfQogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8').replace(/^<\?php\s*/,'');
let sid=null;
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S546 Kurjeris',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 5');
const out=sh('curl -sSk --max-time 200 "'+SITE+'/?ps_s546=K546kj"');
try{O.rez=JSON.parse(out);}catch(e){O.rez={raw:String(out).slice(0,1500)};}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putFile('analize/s546.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
