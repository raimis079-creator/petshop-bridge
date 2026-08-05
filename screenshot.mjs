import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s536',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run536'};
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczUzNiddKSB8fCAkX0dFVFsncHNfczUzNiddICE9PSAnSzUzNnZwJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsKICAgICRyPWFycmF5KCdWRVJTSUpBJz0+J3M1MzYnKTsKICAgIGZvcmVhY2goYXJyYXkoMzQ4ODIsMzQ4ODEsMzQ4ODMpIGFzICRpZCl7CiAgICAgICAgJG89d2NfZ2V0X29yZGVyKCRpZCk7IGlmKCEkbykgY29udGludWU7CiAgICAgICAgJG1ldGE9YXJyYXkoKTsKICAgICAgICBmb3JlYWNoKCRvLT5nZXRfbWV0YV9kYXRhKCkgYXMgJG0pewogICAgICAgICAgICAkaz0kbS0+a2V5OwogICAgICAgICAgICBpZihzdHJwb3MoJGssJ3ZlbmlwYWsnKSE9PWZhbHNlfHxzdHJwb3MoJGssJ2xwJyk9PT0wfHxzdHJwb3MoJGssJ19scCcpPT09MHx8c3RycG9zKCRrLCdwc18nKSE9PWZhbHNlKXsKICAgICAgICAgICAgICAgICR2PSRtLT52YWx1ZTsgJG1ldGFbJGtdPWlzX2FycmF5KCR2KT8kdjptYl9zdWJzdHIoKHN0cmluZykkdiwwLDIwMCk7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICAgICAgJG5vdGVzPWFycmF5KCk7CiAgICAgICAgZm9yZWFjaCh3Y19nZXRfb3JkZXJfbm90ZXMoYXJyYXkoJ29yZGVyX2lkJz0+JGlkLCdsaW1pdCc9PjYpKSBhcyAkbil7CiAgICAgICAgICAgICRub3Rlc1tdPXdwX2RhdGUoJ0g6aScsc3RydG90aW1lKCRuLT5kYXRlX2NyZWF0ZWQpKS4nIMK3ICcubWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCRuLT5jb250ZW50KSwwLDE0MCk7CiAgICAgICAgfQogICAgICAgICRyWyd1enNha3ltYWknXVskaWRdPWFycmF5KCdzdGF0dXNhcyc9PiRvLT5nZXRfc3RhdHVzKCksJ21ldGEnPT4kbWV0YSwnaXN0b3JpamEnPT4kbm90ZXMpOwogICAgfQogICAgLy8gYXIgVmVuaXBhayBwbHVnaW5hcyB0dXJpIEFQSSByYWt0dXMKICAgIGZvcmVhY2goJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUgRlJPTSB7JHBmfW9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnJXZlbmlwYWslJyBMSU1JVCAyMCIpIGFzICR4KXsKICAgICAgICAkclsndmVuaXBha19vcGNpam9zJ11bXT0keC0+b3B0aW9uX25hbWU7CiAgICB9CiAgICAkcz1nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9zaG9wdXBfdmVuaXBha19zaGlwcGluZ19jb3VyaWVyX21ldGhvZF9zZXR0aW5ncycpOwogICAgJHJbJ3ZlbmlwYWtfbnVzdGF0eW1haV95cmEnXT0gJHMgPyAnWVJBJyA6ICduZSc7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSwgMSk7Cg==','base64').toString('utf8').replace(/^<\?php\s*/,'');
let sid=null;
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S536 Venipak',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 5');
const out=sh('curl -sSk --max-time 200 "'+SITE+'/?ps_s536=K536vp"');
try{O.rez=JSON.parse(out);}catch(e){O.rez={raw:String(out).slice(0,1500)};}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putFile('analize/s536.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
