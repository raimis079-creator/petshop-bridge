import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s366',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run381-v1'}; let sid=null;
try{const ls=sh('curl -sSk --max-time 40 '+AUTH+' "'+API+'?per_page=100"');const arr=JSON.parse(ls.out);const off=[];
 for(const s0 of arr){ if(s0.name&&s0.name.indexOf('TEMP')===0&&s0.active){
   fs.writeFileSync('/tmp/o.json',JSON.stringify({active:false}));
   sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/o.json "'+API+'/'+s0.id+'"'); off.push(s0.id);} }
 O.deakt=off;}catch(e){}
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzM4MSBMb2NrICYgQ2hhcnNldCBDaGVjayB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczM4MSddKSB8fCAkX0dFVFsncHNfczM4MSddICE9PSAnSzM4MWxrJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgQHNldF90aW1lX2xpbWl0KDEyMCk7CiAgICBnbG9iYWwgJHdwZGI7CiAgICAkcj1hcnJheSgnVkVSU0lKQSc9PidzMzgxLXYxJyk7CgogICAgLy8gMSkgVEVJU0VTCiAgICAkZz0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBHUkFOVFMgRk9SIENVUlJFTlRfVVNFUigpIik7CiAgICAkclsnZ3JhbnRzJ109JGc7CiAgICAkdmlzPXN0cnRvdXBwZXIoaW1wbG9kZSgnIHwgJywkZykpOwogICAgJHJbJ0xPQ0tfVEFCTEVTX3RlaXNlJ109IChzdHJwb3MoJHZpcywnQUxMIFBSSVZJTEVHRVMnKSE9PWZhbHNlIHx8IHN0cnBvcygkdmlzLCdMT0NLIFRBQkxFUycpIT09ZmFsc2UpID8gJ1RBSVAnIDogJ05FUkFTVEEnOwogICAgJHJbJ3ZhcnRvdG9qYXMnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENVUlJFTlRfVVNFUigpIik7CgogICAgLy8gMikgS09EVU9URVMganVuZ3R5amUKICAgIGZvcmVhY2goYXJyYXkoJ2NoYXJhY3Rlcl9zZXRfY2xpZW50JywnY2hhcmFjdGVyX3NldF9jb25uZWN0aW9uJywnY2hhcmFjdGVyX3NldF9yZXN1bHRzJywnY2hhcmFjdGVyX3NldF9kYXRhYmFzZScsJ2NvbGxhdGlvbl9jb25uZWN0aW9uJykgYXMgJHYpCiAgICAgICAgJHJbJ2NoYXJzZXQnXVskdl09JHdwZGItPmdldF92YXIoIlNFTEVDVCBAQCR2Iik7CiAgICAkclsnd3BkYl9jaGFyc2V0J109JHdwZGItPmNoYXJzZXQ7CiAgICAkclsnd3BkYl9jb2xsYXRlJ109JHdwZGItPmNvbGxhdGU7CgogICAgLy8gMykgUkVBTFVTIExPQ0sgVEFCTEVTIFRFU1RBUyDigJQgdmlzb3MgbGVudGVsZXMsIG1hdHVvamFtCiAgICAkbGVudD0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMiKTsKICAgICRyWydsZW50ZWxpdSddPWNvdW50KCRsZW50KTsKICAgICRzcWw9J0xPQ0sgVEFCTEVTICcuaW1wbG9kZSgnLCAnLCBhcnJheV9tYXAoZnVuY3Rpb24oJHQpeyByZXR1cm4gImAkdGAgUkVBRCI7IH0sICRsZW50KSk7CiAgICAkclsnc2FraW5pb19pbGdpcyddPXN0cmxlbigkc3FsKTsKICAgICRyWydtYXhfYWxsb3dlZF9wYWNrZXQnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIEBAbWF4X2FsbG93ZWRfcGFja2V0Iik7CgogICAgJHdwZGItPnN1cHByZXNzX2Vycm9ycyh0cnVlKTsKICAgICR0MD1taWNyb3RpbWUodHJ1ZSk7CiAgICAkb2s9JHdwZGItPnF1ZXJ5KCdTRVQgYXV0b2NvbW1pdCA9IDAnKTsKICAgICRsb2NrUmVzPSR3cGRiLT5xdWVyeSgkc3FsKTsKICAgICRsb2NrTXM9cm91bmQoKG1pY3JvdGltZSh0cnVlKS0kdDApKjEwMDAsMSk7CiAgICAkZXJyMT0kd3BkYi0+bGFzdF9lcnJvcjsKICAgIC8vIHBlciB1enJha3RhIHBhYmFuZG9tIHNrYWl0eXRpICh0dXJpIHZlaWt0aSkKICAgICRza2FpdD0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wcmVmaXh9cG9zdHMiKTsKICAgICRlcnIyPSR3cGRiLT5sYXN0X2Vycm9yOwogICAgJHVubG9jaz0kd3BkYi0+cXVlcnkoJ1VOTE9DSyBUQUJMRVMnKTsKICAgICR3cGRiLT5xdWVyeSgnU0VUIGF1dG9jb21taXQgPSAxJyk7CiAgICAkd3BkYi0+c3VwcHJlc3NfZXJyb3JzKGZhbHNlKTsKCiAgICAkclsnbG9jayddPWFycmF5KCdyZXp1bHRhdGFzJz0+JGxvY2tSZXMsJ21zJz0+JGxvY2tNcywna2xhaWRhJz0+JGVycjE/Om51bGwpOwogICAgJHJbJ3NrYWl0eW1hc19wZXJfdXpyYWt0YSddPWFycmF5KCdwb3N0cyc9PiRza2FpdCwna2xhaWRhJz0+JGVycjI/Om51bGwpOwogICAgJHJbJ3VubG9jayddPSR1bmxvY2s7CiAgICAkclsnYXV0b2NvbW1pdF9wbyddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQEBhdXRvY29tbWl0Iik7CgogICAgLy8gNCkgYXIgdXpyYWt0dSBuZWxpa28gcGFraWJ1c2l1CiAgICAkclsnb3Blbl90YWJsZXMnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gaW5mb3JtYXRpb25fc2NoZW1hLlBST0NFU1NMSVNUIFdIRVJFIFNUQVRFIExJS0UgJyVsb2NrJSciKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8').replace(/^<\?php\s*/,'');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S381 Lock Check v1',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const r=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(r.out); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
function q(a,extra){const x=sh('curl -sSk --max-time 45 '+(extra||'')+' "'+SITE+'/?ps_s381=K381lk&t='+a+'&z='+Math.random()+'"');
 try{return JSON.parse(x.out);}catch(e){return {raw:x.out.slice(0,700)};}}
O.rez=q('x');
O.svetaine=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 25 "'+SITE+'/"').out.trim();
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putResult('s381.json', JSON.stringify(O,null,1));
console.log('OK');
