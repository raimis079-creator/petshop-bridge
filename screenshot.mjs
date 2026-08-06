import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s563',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run563'};
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczU2MyddKSB8fCAkX0dFVFsncHNfczU2MyddICE9PSAnSzU2M3RrJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsKICAgICRyPWFycmF5KCdWRVJTSUpBJz0+J3M1NjMnKTsKICAgIGlmKCFjbGFzc19leGlzdHMoJ1BldHNob3BfQVZfVGlla2ltYXMnKSl7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9PidrbGFzxJdzIG7El3JhJykpOyBleGl0OyB9CgogICAgJHJbJ2xlbnRlbGVzJ109YXJyYXkoCiAgICAgICdwYXJ0aWpvcyc9PiR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICd7JHBmfXBzX3RpZWtpbWFzJyIpLAogICAgICAnZWlsdXRlcyc9PiR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICd7JHBmfXBzX3RpZWtpbWFzX2VpbCciKSwKICAgICk7CiAgICAvLyBwYWxlaWTFvmlhbSBrYXVwaW3EhSBtacWhcmllbXMgdcW+c2FreW1hbXMKICAgIGZvcmVhY2goYXJyYXkoMzQ4ODIsMzQ4ODMsMzQ4ODEpIGFzICRpZCl7CiAgICAgICAgJG89d2NfZ2V0X29yZGVyKCRpZCk7IGlmKCEkbykgY29udGludWU7CiAgICAgICAgJHByaWVzPSRvLT5nZXRfbWV0YSgnX3BzX3RpZWtpbWFzX2xhdWtpYScpOwogICAgICAgIFBldHNob3BfQVZfVGlla2ltYXM6OmlzX3V6c2FreW1vKCRpZCk7CiAgICAgICAgJG8yPXdjX2dldF9vcmRlcigkaWQpOwogICAgICAgICRyWyd1enNha3ltYWknXVskaWRdPWFycmF5KCdwcmllcyc9PiRwcmllcz86J+KAlCcsJ3BvJz0+JG8yLT5nZXRfbWV0YSgnX3BzX3RpZWtpbWFzX2xhdWtpYScpPzon4oCUJywKICAgICAgICAgICdwYXJ0aWpvcyc9PiRvMi0+Z2V0X21ldGEoJ19wc190aWVraW1hc19wYXJ0aWpvcycpPzon4oCUJyk7CiAgICB9CiAgICAkclsncGFydGlqb3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRwZn1wc190aWVraW1hcyBPUkRFUiBCWSBpZCIsQVJSQVlfQSk7CiAgICAkZWlsPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JHBmfXBzX3RpZWtpbWFzX2VpbCBPUkRFUiBCWSBpZCIsQVJSQVlfQSk7CiAgICBmb3JlYWNoKCRlaWwgYXMgJiRlKXsgJHA9d2NfZ2V0X3Byb2R1Y3QoJGVbJ3Byb2R1Y3RfaWQnXSk7ICRlWydwcmVrZSddPSRwP21iX3N1YnN0cigkcC0+Z2V0X25hbWUoKSwwLDQwKTonPyc7IH0KICAgICRyWydlaWx1dGVzJ109JGVpbDsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8').replace(/^<\?php\s*/,'');
let sid=null;
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S563 Kaupimas',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 5');
const out=sh('curl -sSk --max-time 200 "'+SITE+'/?ps_s563=K563tk"');
try{O.rez=JSON.parse(out);}catch(e){O.rez={raw:String(out).slice(0,1500)};}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putFile('analize/s563.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
