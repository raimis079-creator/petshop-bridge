import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s513',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run513'};
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczUxMyddKSB8fCAkX0dFVFsncHNfczUxMyddICE9PSAnSzUxM3JzJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgQHNldF90aW1lX2xpbWl0KDE4MCk7CiAgICBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OwogICAgJHI9YXJyYXkoJ1ZFUlNJSkEnPT4nczUxMy12MScpOwogICAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIElEIEZST00geyRwZn1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgT1JERVIgQlkgSUQgREVTQyBMSU1JVCA0Iik7CiAgICAkYXY9JHdwZGItPmdldF92YXIoIlNFTEVDVCBwb3N0X2lkIEZST00geyRwZn1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX293bl9zdG9ja19xdHknIEFORCBtZXRhX3ZhbHVlPjAgTElNSVQgMSIpOwogICAgaWYoJGF2KSAkaWRzW109JGF2OwogICAgJHJbJ3B2eiddPWFycmF5KCk7CiAgICBmb3JlYWNoKCRpZHMgYXMgJHBpZCl7CiAgICAgICAgJHg9YXJyYXkoJ3BpZCc9PihpbnQpJHBpZCwncGF2Jz0+bWJfc3Vic3RyKGdldF90aGVfdGl0bGUoJHBpZCksMCwzNCkpOwogICAgICAgIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9GdWxmaWxsbWVudF9Tb3VyY2UnKSl7CiAgICAgICAgICAgICR2PVBldHNob3BfRnVsZmlsbG1lbnRfU291cmNlOjpyZXNvbHZlKCRwaWQpOwogICAgICAgICAgICAkeFsnRlNfcmVzb2x2ZSddPWFycmF5KCd0aXBhcyc9PmdldHR5cGUoJHYpLCdyZWlrc21lJz0+JHYpOwogICAgICAgIH0KICAgICAgICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfQVZfU291cmNlJykpewogICAgICAgICAgICAkdjI9UGV0c2hvcF9BVl9Tb3VyY2U6OnJlc29sdmUoJHBpZCwxKTsKICAgICAgICAgICAgJHhbJ0FWX3Jlc29sdmUnXT1hcnJheSgndGlwYXMnPT5nZXR0eXBlKCR2MiksJ3JlaWtzbWUnPT4kdjIpOwogICAgICAgICAgICAkeFsnQVZfaXNfYXYnXT1QZXRzaG9wX0FWX1NvdXJjZTo6aXNfYXYoJHBpZCwxKTsKICAgICAgICB9CiAgICAgICAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FWX1N0b2NrJykpICR4WydBVl9xdHknXT1QZXRzaG9wX0FWX1N0b2NrOjpxdHkoJHBpZCk7CiAgICAgICAgJHJbJ3B2eiddW109JHg7CiAgICB9CiAgICAvLyBncm91cF9vcmRlciBwYXZ5emR5cwogICAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FWX1NvdXJjZScpKXsKICAgICAgICAkb2lkPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgaWQgRlJPTSB7JHBmfXdjX29yZGVycyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDEiKTsKICAgICAgICAkbz13Y19nZXRfb3JkZXIoJG9pZCk7CiAgICAgICAgaWYoJG8peyAkZz1QZXRzaG9wX0FWX1NvdXJjZTo6Z3JvdXBfb3JkZXIoJG8pOwogICAgICAgICAgICAkclsnZ3JvdXBfb3JkZXInXT1hcnJheSgnb2lkJz0+KGludCkkb2lkLCd0aXBhcyc9PmdldHR5cGUoJGcpLCdyZWlrc21lJz0+JGcpOwogICAgICAgICAgICBpZihpc19hcnJheSgkZykpICRyWydvcmRlcl90eXBlJ109UGV0c2hvcF9BVl9Tb3VyY2U6Om9yZGVyX3R5cGUoJGcpOwogICAgICAgIH0KICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8').replace(/^<\?php\s*/,'');
let sid=null;
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S513 Resolve',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 5');
const out=sh('curl -sSk --max-time 200 "'+SITE+'/?ps_s513=K513rs"');
try{O.rez=JSON.parse(out);}catch(e){O.rez={raw:String(out).slice(0,1500)};}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putFile('analize/s513.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
