import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s570',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run570'};
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczU3MCddKSB8fCAkX0dFVFsncHNfczU3MCddICE9PSAnSzU3MGxwJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgQHNldF90aW1lX2xpbWl0KDI0MCk7CiAgICAkcj1hcnJheSgnVkVSU0lKQSc9PidzNTcwJyk7CiAgICAkZGlyPVdQX1BMVUdJTl9ESVIuJy93b28tbGl0aHVhbmlhcG9zdC1tYWluJzsKICAgICRpdD1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGRpcixGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICAgJGZhaWxhaT1hcnJheSgpOyAkc3o9YXJyYXkoKTsgJHBpZWNlcz1hcnJheSgpOyAkY3JlYXRlPWFycmF5KCk7CiAgICBmb3JlYWNoKCRpdCBhcyAkZil7CiAgICAgICAgJHA9KHN0cmluZykkZjsKICAgICAgICBpZihzdWJzdHIoJHAsLTQpIT09Jy5waHAnKSBjb250aW51ZTsKICAgICAgICBpZihzdHJwb3MoJHAsJy92ZW5kb3IvJykhPT1mYWxzZSkgY29udGludWU7CiAgICAgICAgJGM9QGZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsgaWYoJGM9PT1mYWxzZSkgY29udGludWU7CiAgICAgICAgJGI9YmFzZW5hbWUoJHApOyAkZmFpbGFpWyRiXT1zdHJsZW4oJGMpOwogICAgICAgIGZvcmVhY2goZXhwbG9kZSgiXG4iLCRjKSBhcyAkaT0+JGwpewogICAgICAgICAgICBpZihwcmVnX21hdGNoKCcvc2hpcHBpbmdfaXRlbV9zaXplfFxic2l6ZVxiXHMqPT58XCdzaXplXCd8InNpemUiLycsJGwpICYmIGNvdW50KCRzeik8MjUpewogICAgICAgICAgICAgICAgJHN6W109JGIuJzonLigkaSsxKS4nICcudHJpbShtYl9zdWJzdHIoJGwsMCwxNDApKTsKICAgICAgICAgICAgfQogICAgICAgICAgICBpZihwcmVnX21hdGNoKCcvcGllY2VzfHBhcmNlbENvdW50fHF1YW50aXR5fGFtb3VudHx3ZWlnaHQvaScsJGwpICYmIHByZWdfbWF0Y2goJy89Pnw9LycsJGwpICYmIGNvdW50KCRwaWVjZXMpPDI1KXsKICAgICAgICAgICAgICAgICRwaWVjZXNbXT0kYi4nOicuKCRpKzEpLicgJy50cmltKG1iX3N1YnN0cigkbCwwLDE0MCkpOwogICAgICAgICAgICB9CiAgICAgICAgICAgIGlmKHByZWdfbWF0Y2goJy9mdW5jdGlvbi4qKGNyZWF0ZXxyZWdpc3RlcikuKihwYXJjZWx8c2hpcG1lbnR8aXRlbSkvaScsJGwpICYmIGNvdW50KCRjcmVhdGUpPDE1KXsKICAgICAgICAgICAgICAgICRjcmVhdGVbXT0kYi4nOicuKCRpKzEpLicgJy50cmltKG1iX3N1YnN0cigkbCwwLDE0MCkpOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfQogICAgYXJzb3J0KCRmYWlsYWkpOwogICAgJHJbJ2ZhaWxhaSddPWFycmF5X3NsaWNlKCRmYWlsYWksMCwxOCx0cnVlKTsKICAgICRyWydkeWRpcyddPSRzejsKICAgICRyWydraWVraWFpJ109JHBpZWNlczsKICAgICRyWydmdW5rY2lqb3MnXT0kY3JlYXRlOwogICAgLy8gc2l1bnRvcyBkeWR6aW8gcmVpa3NtZXMgdXpzYWt5bXVvc2UKICAgIGdsb2JhbCAkd3BkYjsKICAgICRyWydkeWR6aWFpX2RiJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbWV0YV92YWx1ZSxDT1VOVCgqKSBjIEZST00geyR3cGRiLT5wcmVmaXh9d2Nfb3JkZXJzX21ldGEKICAgICAgV0hFUkUgbWV0YV9rZXk9J193b29fbGl0aHVhbmlhcG9zdF9zaGlwcGluZ19pdGVtX3NpemUnIEdST1VQIEJZIG1ldGFfdmFsdWUiLEFSUkFZX0EpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8').replace(/^<\?php\s*/,'');
let sid=null;
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S570 LP2',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 5');
const out=sh('curl -sSk --max-time 200 "'+SITE+'/?ps_s570=K570lp"');
try{O.rez=JSON.parse(out);}catch(e){O.rez={raw:String(out).slice(0,1500)};}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putFile('analize/s570.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
