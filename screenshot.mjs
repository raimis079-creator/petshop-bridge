import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s575',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run575'};
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczU3NSddKSB8fCAkX0dFVFsncHNfczU3NSddICE9PSAnSzU3NW5sJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgJHI9YXJyYXkoJ1ZFUlNJSkEnPT4nczU3NScpOwogICAgJHBpZD00ODM3NTsKICAgICRyWydwcmllcyddPWdldF9wb3N0X21ldGEoJHBpZCwnX293bl9zdG9ja19xdHknLHRydWUpOwogICAgdXBkYXRlX3Bvc3RfbWV0YSgkcGlkLCdfb3duX3N0b2NrX3F0eScsMCk7CiAgICAkclsncG8nXT1nZXRfcG9zdF9tZXRhKCRwaWQsJ19vd25fc3RvY2tfcXR5Jyx0cnVlKTsKICAgIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9BVl9TdG9jaycpKSAkclsncXR5J109UGV0c2hvcF9BVl9TdG9jazo6cXR5KCRwaWQpOwogICAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FWX1NvdXJjZScpKXsKICAgICAgICAkdj1QZXRzaG9wX0FWX1NvdXJjZTo6cmVzb2x2ZSgkcGlkLDEpOwogICAgICAgICRyWydyZXNvbHZlJ109JHY7CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSwgMSk7Cg==','base64').toString('utf8').replace(/^<\?php\s*/,'');
let sid=null;
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S575 Nulis',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 5');
const out=sh('curl -sSk --max-time 200 "'+SITE+'/?ps_s575=K575nl"');
try{O.rez=JSON.parse(out);}catch(e){O.rez={raw:String(out).slice(0,1500)};}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putFile('analize/s575.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
