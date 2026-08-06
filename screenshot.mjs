import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s561',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run561'};
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczU2MSddKSB8fCAkX0dFVFsncHNfczU2MSddICE9PSAnSzU2MXRrJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsKICAgICRyPWFycmF5KCdWRVJTSUpBJz0+J3M1NjEnKTsKICAgIGZvcmVhY2goYXJyYXkoJ1BldHNob3BfQVZfU3RvY2snLCdQZXRzaG9wX0FWX0V4cGlyeScsJ1BldHNob3BfQVZfUmVkdWNlJywnUGV0c2hvcF9BVl9Tb3VyY2UnLCdQZXRzaG9wX0FWX0Ryb3BzaGlwJykgYXMgJGMpewogICAgICAgIGlmKCFjbGFzc19leGlzdHMoJGMpKXsgJHJbJ2tsYXNlcyddWyRjXT0nTsSWUkEnOyBjb250aW51ZTsgfQogICAgICAgICRyYz1uZXcgUmVmbGVjdGlvbkNsYXNzKCRjKTsgJG09YXJyYXkoKTsKICAgICAgICBmb3JlYWNoKCRyYy0+Z2V0TWV0aG9kcygpIGFzICRtbSl7CiAgICAgICAgICAgIGlmKCRtbS0+Y2xhc3MhPT0kYykgY29udGludWU7CiAgICAgICAgICAgICRwPWFycmF5KCk7IGZvcmVhY2goJG1tLT5nZXRQYXJhbWV0ZXJzKCkgYXMgJHBwKXsgJHBbXT0nJCcuJHBwLT5nZXROYW1lKCkuKCRwcC0+aXNEZWZhdWx0VmFsdWVBdmFpbGFibGUoKT8nPeKApic6JycpOyB9CiAgICAgICAgICAgICRtW109KCRtbS0+aXNTdGF0aWMoKT8nOjonOictPicpLiRtbS0+Z2V0TmFtZSgpLicoJy5pbXBsb2RlKCcsJywkcCkuJyknOwogICAgICAgIH0KICAgICAgICAkclsna2xhc2VzJ11bJGNdPWFycmF5KCdtZXRvZGFpJz0+JG0sJ2tvbnN0Jz0+JHJjLT5nZXRDb25zdGFudHMoKSk7CiAgICB9CiAgICAvLyBtZXRhIHJha3RhaQogICAgJHJbJ21ldGEnXT1hcnJheSgKICAgICAgJ293bl9zdG9jayc9PiR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfb3duX3N0b2NrX3F0eSciKSwKICAgICAgJ2V4cGlyeV9yYWt0YWknPT4kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIERJU1RJTkNUIG1ldGFfa2V5IEZST00geyRwZn1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleSBMSUtFICclZXhwaXJ5JScgT1IgbWV0YV9rZXkgTElLRSAnJWdhbGlvaiUnIExJTUlUIDEwIiksCiAgICApOwogICAgLy8gZXNhbW9zIHBzXyBsZW50ZWzEl3MKICAgICRyWydsZW50ZWxlcyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICd7JHBmfXBzXF8lJyIpOwogICAgJHJbJ3RpZWtlanVfcGFzdGFpJ109Z2V0X29wdGlvbigncHNfdGlla2VqdV9wYXN0YWknKTsKICAgIC8vIGRyb3BzaGlwIGxhacWha28gc2l1bnRpbW8gbWV0b2RhcwogICAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FWX0Ryb3BzaGlwJykpewogICAgICAgIHRyeXsgJHJtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0FWX0Ryb3BzaGlwJywnc2l1c3RpJyk7CiAgICAgICAgICAgICRmPWZpbGUoJHJtLT5nZXRGaWxlTmFtZSgpKTsKICAgICAgICAgICAgJHJbJ2Ryb3BzaGlwX3NpdXN0aSddPWltcGxvZGUoJycsYXJyYXlfc2xpY2UoJGYsJHJtLT5nZXRTdGFydExpbmUoKS0xLG1pbig3MCwkcm0tPmdldEVuZExpbmUoKS0kcm0tPmdldFN0YXJ0TGluZSgpKzEpKSk7CiAgICAgICAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydkcm9wc2hpcF9zaXVzdGknXT0nTsSWUkEnOyB9CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSwgMSk7Cg==','base64').toString('utf8').replace(/^<\?php\s*/,'');
let sid=null;
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S561 Tiekimas',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 5');
const out=sh('curl -sSk --max-time 200 "'+SITE+'/?ps_s561=K561tk"');
try{O.rez=JSON.parse(out);}catch(e){O.rez={raw:String(out).slice(0,1500)};}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putFile('analize/s561.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
