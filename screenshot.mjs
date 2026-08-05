import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s524',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run524'};
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczUyNCddKSB8fCAkX0dFVFsncHNfczUyNCddICE9PSAnSzUyNHNyJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgQHNldF90aW1lX2xpbWl0KDE4MCk7CiAgICAkcj1hcnJheSgnVkVSU0lKQSc9PidzNTI0LXYxJyk7CiAgICAkaW1rPWZ1bmN0aW9uKCRjbHMsJG0pIHsKICAgICAgICBpZighY2xhc3NfZXhpc3RzKCRjbHMpKSByZXR1cm4gJ0tMQVPEllMgTsSWUkEnOwogICAgICAgIHRyeXsgJHJtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCRjbHMsJG0pOyB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgcmV0dXJuICdOxJZSQTogJy4kbTsgfQogICAgICAgICRmPWZpbGUoJHJtLT5nZXRGaWxlTmFtZSgpKTsKICAgICAgICByZXR1cm4gaW1wbG9kZSgnJywgYXJyYXlfc2xpY2UoJGYsJHJtLT5nZXRTdGFydExpbmUoKS0xLCRybS0+Z2V0RW5kTGluZSgpLSRybS0+Z2V0U3RhcnRMaW5lKCkrMSkpOwogICAgfTsKICAgICRyWydzaGVldHNfdnlrZHl0aSddICAgPSAkaW1rKCdQZXRzaG9wX0FWX1NoZWV0cycsJ3Z5a2R5dGknKTsKICAgICRyWydzaGVldHNfdmVpa3NtYXMnXSAgPSAkaW1rKCdQZXRzaG9wX0FWX1NoZWV0cycsJ3ZlaWtzbWFzJyk7CiAgICAkclsnc2hlZXRzX3V6c192ZWlrc21hcyddPSRpbWsoJ1BldHNob3BfQVZfU2hlZXRzJywndXpzYWt5bW9fdmVpa3NtYXMnKTsKICAgICRyWydzaGVldHNfdmllbm8nXSAgICAgPSAkaW1rKCdQZXRzaG9wX0FWX1NoZWV0cycsJ3ZpZW5vX3V6c2FreW1vJyk7CiAgICAkclsnc2hlZXRzX21lbml1J10gICAgID0gJGltaygnUGV0c2hvcF9BVl9TaGVldHMnLCdtZW5pdScpOwogICAgJHJbJ3NoZWV0c19pbml0J10gICAgICA9ICRpbWsoJ1BldHNob3BfQVZfU2hlZXRzJywnaW5pdCcpOwogICAgJHJbJ2RzX3Z5a2R5dGknXSAgICAgICA9ICRpbWsoJ1BldHNob3BfQVZfRHJvcHNoaXAnLCd2eWtkeXRpJyk7CiAgICAkclsnZHNfdmVpa3NtYXMnXSAgICAgID0gJGltaygnUGV0c2hvcF9BVl9Ecm9wc2hpcCcsJ3ZlaWtzbWFzJyk7CiAgICAkclsnZHNfbWVuaXUnXSAgICAgICAgID0gJGltaygnUGV0c2hvcF9BVl9Ecm9wc2hpcCcsJ21lbml1Jyk7CiAgICAkclsnZHNfaW5pdCddICAgICAgICAgID0gJGltaygnUGV0c2hvcF9BVl9Ecm9wc2hpcCcsJ2luaXQnKTsKICAgICRyWydkc19ncnVwdW90aSddICAgICAgPSAkaW1rKCdQZXRzaG9wX0FWX0Ryb3BzaGlwJywnZ3J1cHVvdGknKTsKICAgIC8vIHRyYW5zaWVudGFpIGlyIG9wY2lqb3MKICAgIGZvcmVhY2goYXJyYXkoJ3BldHNob3AtYXYtc2hlZXRzLnBocCcsJ3BldHNob3AtYXYtZHJvcHNoaXAucGhwJykgYXMgJGZuKXsKICAgICAgICAkYz1AZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvJy4kZm4pOwogICAgICAgIGlmKCRjPT09ZmFsc2UpIGNvbnRpbnVlOwogICAgICAgIHByZWdfbWF0Y2hfYWxsKCIvKHNldF90cmFuc2llbnR8Z2V0X3RyYW5zaWVudHxkZWxldGVfdHJhbnNpZW50KVxzKlwoXHMqWydcIl0oW14nXCJdKykvIiwkYywkbSk7CiAgICAgICAgJHJbJ3RyYW5zaWVudGFpJ11bJGZuXT1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtWzJdKSk7CiAgICAgICAgcHJlZ19tYXRjaF9hbGwoIi9hZGRfKHN1Ym1lbnV8bWVudSlfcGFnZVxzKlwoW147XXswLDI0MH07L3MiLCRjLCRtMik7CiAgICAgICAgJHJbJ21lbml1X3JlZ2lzdHJhY2lqYSddWyRmbl09JG0yWzBdOwogICAgfQogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8').replace(/^<\?php\s*/,'');
let sid=null;
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S524 Kodas',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 5');
const out=sh('curl -sSk --max-time 200 "'+SITE+'/?ps_s524=K524sr"');
try{O.rez=JSON.parse(out);}catch(e){O.rez={raw:String(out).slice(0,1500)};}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putFile('analize/s524.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
