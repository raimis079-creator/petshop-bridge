import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s548',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run548'};
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczU0OCddKSB8fCAkX0dFVFsncHNfczU0OCddICE9PSAnSzU0OG1sJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgQHNldF90aW1lX2xpbWl0KDI4MCk7CiAgICAkcj1hcnJheSgnVkVSU0lKQSc9PidzNTQ4Jyk7CiAgICAkcz1nZXRfb3B0aW9uKCdzaG9wdXBfdmVuaXBha19zaGlwcGluZ19zZXR0aW5ncycpOwogICAgJHVzZXI9JHNbJ3Nob3B1cF92ZW5pcGFrX3NoaXBwaW5nX2ZpZWxkX3VzZXJuYW1lJ107CiAgICAkcGFzcz0kc1snc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfZmllbGRfcGFzc3dvcmQnXTsKICAgICRtYW4gPScwNzI2NzI2MDgwNTAwMSc7CgogICAgJHJha3RhaT1hcnJheSgnbWFuaWZlc3Rfbm8nLCdtYW5pZmVzdF9jb2RlJywnbWFuaWZlc3RfbnVtYmVyJywnbWFuaWZlc3RfbnInLCdtYW5pZmVzdGFzJywKICAgICAgICAgICAgICAgICAgJ2tvZGFzJywnY29kZScsJ2xpc3Rfbm8nLCdsaXN0JywnbWFuaWZlc3RfdGl0bGVfbm8nLCdkb2Nfbm8nLCdtYW5pZmVzdF9uYW1lJywndGl0bGUnKTsKICAgIGZvcmVhY2goJHJha3RhaSBhcyAkayl7CiAgICAgICAgJGJvZHk9YXJyYXkoJ3VzZXInPT4kdXNlciwncGFzcyc9PiRwYXNzLCRrPT4kbWFuKTsKICAgICAgICAkcmVzcD13cF9yZW1vdGVfcG9zdCgnaHR0cHM6Ly9nby52ZW5pcGFrLmx0L3dzL3ByaW50X2xpc3QnLCBhcnJheSgKICAgICAgICAgICdib2R5Jz0+JGJvZHksJ3RpbWVvdXQnPT4zNSwnaGVhZGVycyc9PmFycmF5KCdSZWZlcmVyJz0+J2h0dHBzOi8vd29vY29tbWVyY2UuY29tLycpKSk7CiAgICAgICAgaWYoaXNfd3BfZXJyb3IoJHJlc3ApKXsgJHJbJ1BPU1QnXVska109J1dQX0VSUk9SJzsgY29udGludWU7IH0KICAgICAgICAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcmVzcCk7CiAgICAgICAgJHJbJ1BPU1QnXVska109IChzdWJzdHIoJGIsMCw0KT09PSclUERGJykKICAgICAgICAgICAgPyAnUERGISAnLnN0cmxlbigkYikuJyBCJwogICAgICAgICAgICA6IG1iX3N1YnN0cihwcmVnX3JlcGxhY2UoJy9bXlx4MjAtXHg3RVx4QzAtXHhGRl0vJywnLicsc3Vic3RyKCRiLDAsOTApKSwwLDkwKS4nIFsnLnN0cmxlbigkYikuJyBCXSc7CiAgICB9CiAgICAvLyBHRVQgdmFyaWFudGFzCiAgICBmb3JlYWNoKGFycmF5KCdtYW5pZmVzdF9ubycsJ21hbmlmZXN0X2lkJywnY29kZScpIGFzICRrKXsKICAgICAgICAkdT1hZGRfcXVlcnlfYXJnKGFycmF5KCd1c2VyJz0+JHVzZXIsJ3Bhc3MnPT4kcGFzcywkaz0+JG1hbiksJ2h0dHBzOi8vZ28udmVuaXBhay5sdC93cy9wcmludF9saXN0Jyk7CiAgICAgICAgJHJlc3A9d3BfcmVtb3RlX2dldCgkdSwgYXJyYXkoJ3RpbWVvdXQnPT4zNSwnaGVhZGVycyc9PmFycmF5KCdSZWZlcmVyJz0+J2h0dHBzOi8vd29vY29tbWVyY2UuY29tLycpKSk7CiAgICAgICAgaWYoaXNfd3BfZXJyb3IoJHJlc3ApKXsgJHJbJ0dFVCddWyRrXT0nV1BfRVJST1InOyBjb250aW51ZTsgfQogICAgICAgICRiPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyZXNwKTsKICAgICAgICAkclsnR0VUJ11bJGtdPSAoc3Vic3RyKCRiLDAsNCk9PT0nJVBERicpID8gJ1BERiEgJy5zdHJsZW4oJGIpLicgQicKICAgICAgICAgICAgOiBtYl9zdWJzdHIocHJlZ19yZXBsYWNlKCcvW15ceDIwLVx4N0VceEMwLVx4RkZdLycsJy4nLHN1YnN0cigkYiwwLDkwKSksMCw5MCkuJyBbJy5zdHJsZW4oJGIpLicgQl0nOwogICAgfQogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8').replace(/^<\?php\s*/,'');
let sid=null;
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S548 Manifest PDF2',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 5');
const out=sh('curl -sSk --max-time 200 "'+SITE+'/?ps_s548=K548ml"');
try{O.rez=JSON.parse(out);}catch(e){O.rez={raw:String(out).slice(0,1500)};}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putFile('analize/s548.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
