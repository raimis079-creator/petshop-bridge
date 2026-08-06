import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s580',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run580'};
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczU4MCddKSB8fCAkX0dFVFsncHNfczU4MCddICE9PSAnSzU4MHRzJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgJHI9YXJyYXkoJ1ZFUlNJSkEnPT4nczU4MCcsJ3JlemltYXMnPT5pc3NldCgkX0dFVFsnYXRnYWwnXSk/J0FUU1RBVFlNQVMnOidURVNUQVMnKTsKICAgICRvPXdjX2dldF9vcmRlcigzNDg4MSk7CiAgICBpZighJG8peyBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdlcnInPT4nbmVyYXN0YXMnKSk7IGV4aXQ7IH0KICAgIGZvcmVhY2goJG8tPmdldF9pdGVtcygpIGFzICRpaWQ9PiRpdCl7CiAgICAgICAgaWYoaXNzZXQoJF9HRVRbJ2F0Z2FsJ10pKXsKICAgICAgICAgICAgJGl0LT51cGRhdGVfbWV0YV9kYXRhKCdfcmVkdWNlZF9zdG9jaycsIChpbnQpJGl0LT5nZXRfcXVhbnRpdHkoKSk7CiAgICAgICAgICAgICRpdC0+c2F2ZSgpOwogICAgICAgICAgICAkclsnZWlsdXRlcyddWyRpaWRdPSdyZXplcnZhY2lqYSBncsSFxb5pbnRhJzsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAkclsncHJpZXMnXVskaWlkXT1hcnJheSgncmVkdWNlZCc9PiRpdC0+Z2V0X21ldGEoJ19yZWR1Y2VkX3N0b2NrJyksCiAgICAgICAgICAgICAgICAnc3JjJz0+JGl0LT5nZXRfbWV0YSgnX3BzX3NvdXJjZScpLCdwaWQnPT4kaXQtPmdldF9wcm9kdWN0X2lkKCkpOwogICAgICAgICAgICAkaXQtPmRlbGV0ZV9tZXRhX2RhdGEoJ19yZWR1Y2VkX3N0b2NrJyk7CiAgICAgICAgICAgICRpdC0+ZGVsZXRlX21ldGFfZGF0YSgnX3BzX2F2X3JlZHVjZWQnKTsKICAgICAgICAgICAgJGl0LT5zYXZlKCk7CiAgICAgICAgICAgICRyWydlaWx1dGVzJ11bJGlpZF09J3JlemVydmFjaWphIG51aW10YSAodGVzdHVpKSc7CiAgICAgICAgfQogICAgfQogICAgJG8tPnNhdmUoKTsKICAgIHVwZGF0ZV9wb3N0X21ldGEoMTcyMzYsJ19vd25fc3RvY2tfcXR5JywwKTsKICAgIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9BVl9TdG9jaycpKXsKICAgICAgICAkclsnbGlrdXRpc18xNzIzNiddPVBldHNob3BfQVZfU3RvY2s6OnF0eSgxNzIzNik7CiAgICAgICAgJHJbJ3Jlc29sdmUnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfQVZfU291cmNlJyk/UGV0c2hvcF9BVl9Tb3VyY2U6OnJlc29sdmUoMTcyMzYsMik6bnVsbDsKICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8').replace(/^<\?php\s*/,'');
let sid=null;
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S580',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 5');
const out=sh('curl -sSk --max-time 200 "'+SITE+'/?ps_s580=K580ts"');
try{O.rez=JSON.parse(out);}catch(e){O.rez={raw:String(out).slice(0,1500)};}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putFile('analize/s580.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
