import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s632',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={RUN:'s632'};
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX293biddKSB8fCAkX0dFVFsncHNfb3duJ10gIT09ICdLNjMybycgKSByZXR1cm47CiAgaWYgKCAhIGhlYWRlcnNfc2VudCgpICkgeyBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgfQogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJHI9YXJyYXkoJ1ZFUlNJSkEnPT4nczYzMicsJ1JFWklNQVMnPT4nVElLIFNLQUlUWU1BUycpOwogICRyWydvd25faXJhc2FpJ109JHdwZGItPmdldF9yZXN1bHRzKAogICAgIlNFTEVDVCBtLm1ldGFfaWQsbS5wb3N0X2lkLG0ubWV0YV92YWx1ZSxwby5wb3N0X3R5cGUscG8ucG9zdF9zdGF0dXMscG8ucG9zdF9wYXJlbnQsCiAgICAgICAgICAgIExFRlQocG8ucG9zdF90aXRsZSw1MCkgcGF2CiAgICAgRlJPTSB7JHB9cG9zdG1ldGEgbSBMRUZUIEpPSU4geyRwfXBvc3RzIHBvIE9OIHBvLklEPW0ucG9zdF9pZAogICAgIFdIRVJFIG0ubWV0YV9rZXk9J19vd25fc3RvY2tfcXR5JyIsIEFSUkFZX0EpOwogICRyWyduZWlnaWFtaV92aXNpJ109JHdwZGItPmdldF9yZXN1bHRzKAogICAgIlNFTEVDVCBtLnBvc3RfaWQsbS5tZXRhX3ZhbHVlLHBvLnBvc3RfdHlwZSxwby5wb3N0X3N0YXR1cyxMRUZUKHBvLnBvc3RfdGl0bGUsNDUpIHBhdgogICAgIEZST00geyRwfXBvc3RtZXRhIG0gSk9JTiB7JHB9cG9zdHMgcG8gT04gcG8uSUQ9bS5wb3N0X2lkCiAgICAgV0hFUkUgbS5tZXRhX2tleT0nX3N0b2NrJyBBTkQgbS5tZXRhX3ZhbHVlKzA8MCIsIEFSUkFZX0EpOwogICRyWydzb3VyY2VzX25laWdpYW1pJ109JHdwZGItPmdldF9yZXN1bHRzKAogICAgIlNFTEVDVCBwcm9kdWN0X2lkLHNvdXJjZSxzdG9ja19xdHkgRlJPTSB7JHB9cHNfc291cmNlcyBXSEVSRSBzdG9ja19xdHk8MCIsIEFSUkFZX0EpOwogICRyWydqb3NlcmFfZGFiYXInXT1hcnJheSgKICAgICdzdG9jayc9PmdldF9wb3N0X21ldGEoMTc5NzgsJ19zdG9jaycsdHJ1ZSksCiAgICAnb3duJz0+Z2V0X3Bvc3RfbWV0YSgxNzk3OCwnX293bl9zdG9ja19xdHknLHRydWUpLAogICAgJ3ZmX3F0eSc9PmdldF9wb3N0X21ldGEoMTc5NzgsJ192Zl9xdHknLHRydWUpKTsKICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LDEpOwo=','base64').toString('utf8').replace(/^<\?php\s*/,'');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S632 Own patikra',code:PHP,scope:'global',active:true}));
let sid=null;
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t);if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 6');
const out=sh('curl -sSk --max-time 120 "'+SITE+'/?ps_own=K632o"');
try{O.rez=JSON.parse(out);}catch(e){O.rez={raw:String(out).slice(0,600)};}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putFile('analize/s632.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
