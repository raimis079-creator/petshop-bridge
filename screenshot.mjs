import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s571',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run571'};
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczU3MSddKSB8fCAkX0dFVFsncHNfczU3MSddICE9PSAnSzU3MWxwJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgQHNldF90aW1lX2xpbWl0KDI0MCk7CiAgICAkcj1hcnJheSgnVkVSU0lKQSc9PidzNTcxJyk7CiAgICAkZj1XUF9QTFVHSU5fRElSLicvd29vLWxpdGh1YW5pYXBvc3QtbWFpbi9pbmNsdWRlcy9jbGFzcy13b28tbGl0aHVhbmlhcG9zdC1hZG1pbi1vcmRlci1zZXJ2aWNlLnBocCc7CiAgICBpZighZmlsZV9leGlzdHMoJGYpKXsKICAgICAgICBmb3JlYWNoKG5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcihXUF9QTFVHSU5fRElSLicvd29vLWxpdGh1YW5pYXBvc3QtbWFpbicsRmlsZXN5c3RlbUl0ZXJhdG9yOjpTS0lQX0RPVFMpKSBhcyAkeCl7CiAgICAgICAgICAgIGlmKGJhc2VuYW1lKCR4KT09PSdjbGFzcy13b28tbGl0aHVhbmlhcG9zdC1hZG1pbi1vcmRlci1zZXJ2aWNlLnBocCcpeyAkZj0oc3RyaW5nKSR4OyBicmVhazsgfQogICAgICAgIH0KICAgIH0KICAgICRyWydmYWlsYXMnXT1zdHJfcmVwbGFjZShXUF9QTFVHSU5fRElSLCcnLCRmKTsKICAgICRsPWZpbGUoJGYpOwogICAgJHJbJ2VpbHV0ZXNfdmlzbyddPWNvdW50KCRsKTsKICAgIC8vIHBhcmNlbF9yZXF1ZXN0IHN0cnVrdMWrcmEKICAgICRyWydibG9rYXNfNzAwXzc2MCddPWltcGxvZGUoJycsYXJyYXlfc2xpY2UoJGwsNjk1LDcwKSk7CiAgICAkclsnYmxva2FzXzEwMjBfMTA3NSddPWltcGxvZGUoJycsYXJyYXlfc2xpY2UoJGwsMTAxNSw2MCkpOwogICAgLy8gaWXFoWtvbSDigJ5wYXJ04oCcIHJha3TFswogICAgJGM9aW1wbG9kZSgnJywkbCk7CiAgICAkcmFzdGE9YXJyYXkoKTsKICAgIGZvcmVhY2goZXhwbG9kZSgiXG4iLCRjKSBhcyAkaT0+JGxpbmUpewogICAgICAgIGlmKHByZWdfbWF0Y2goJy9wYXJ0fHBpZWNlfG11bHRpfGJveGVzfGRlenxjb3VudC9pJywkbGluZSkpewogICAgICAgICAgICAkcmFzdGFbXT0oJGkrMSkuJzogJy50cmltKG1iX3N1YnN0cigkbGluZSwwLDE1MCkpOwogICAgICAgIH0KICAgIH0KICAgICRyWydwYXJ0X2VpbHV0ZXMnXT1hcnJheV9zbGljZSgkcmFzdGEsMCw0MCk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSwgMSk7Cg==','base64').toString('utf8').replace(/^<\?php\s*/,'');
let sid=null;
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S571 LP3',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 5');
const out=sh('curl -sSk --max-time 200 "'+SITE+'/?ps_s571=K571lp"');
try{O.rez=JSON.parse(out);}catch(e){O.rez={raw:String(out).slice(0,1500)};}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putFile('analize/s571.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
