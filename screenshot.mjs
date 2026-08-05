import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s547',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run547'};
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczU0NyddKSB8fCAkX0dFVFsncHNfczU0NyddICE9PSAnSzU0N21sJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgQHNldF90aW1lX2xpbWl0KDI0MCk7CiAgICAkcj1hcnJheSgnVkVSU0lKQSc9PidzNTQ3Jyk7CiAgICAkcz1nZXRfb3B0aW9uKCdzaG9wdXBfdmVuaXBha19zaGlwcGluZ19zZXR0aW5ncycpOwogICAgJHVzZXI9JHNbJ3Nob3B1cF92ZW5pcGFrX3NoaXBwaW5nX2ZpZWxkX3VzZXJuYW1lJ107CiAgICAkcGFzcz0kc1snc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfZmllbGRfcGFzc3dvcmQnXTsKICAgICRtYW4gPScwNzI2NzI2MDgwNTAwMSc7CiAgICAkcGFjaz0nVjA3MjY3RTEwMDAwMDInOwoKICAgICRiYW5keW1haT1hcnJheSgKICAgICAgJ21hbmlmZXN0X2lkJyAgID0+IGFycmF5KCd1c2VyJz0+JHVzZXIsJ3Bhc3MnPT4kcGFzcywnbWFuaWZlc3RfaWQnPT4kbWFuKSwKICAgICAgJ21hbmlmZXN0JyAgICAgID0+IGFycmF5KCd1c2VyJz0+JHVzZXIsJ3Bhc3MnPT4kcGFzcywnbWFuaWZlc3QnPT4kbWFuKSwKICAgICAgJ21hbmlmZXN0X3RpdGxlJz0+IGFycmF5KCd1c2VyJz0+JHVzZXIsJ3Bhc3MnPT4kcGFzcywnbWFuaWZlc3RfdGl0bGUnPT4kbWFuKSwKICAgICAgJ3BhY2tfbm8nICAgICAgID0+IGFycmF5KCd1c2VyJz0+JHVzZXIsJ3Bhc3MnPT4kcGFzcywncGFja19ubyc9PmFycmF5KCRwYWNrKSksCiAgICAgICdpZCcgICAgICAgICAgICA9PiBhcnJheSgndXNlcic9PiR1c2VyLCdwYXNzJz0+JHBhc3MsJ2lkJz0+JG1hbiksCiAgICApOwogICAgZm9yZWFjaCgkYmFuZHltYWkgYXMgJHZhcmRhcz0+JGJvZHkpewogICAgICAgICRyZXNwPXdwX3JlbW90ZV9wb3N0KCdodHRwczovL2dvLnZlbmlwYWsubHQvd3MvcHJpbnRfbGlzdCcsIGFycmF5KAogICAgICAgICAgJ2JvZHknPT4kYm9keSwndGltZW91dCc9PjQwLCdoZWFkZXJzJz0+YXJyYXkoJ1JlZmVyZXInPT4naHR0cHM6Ly93b29jb21tZXJjZS5jb20vJykpKTsKICAgICAgICBpZihpc193cF9lcnJvcigkcmVzcCkpeyAkclsnYmFuZHltYWknXVskdmFyZGFzXT1hcnJheSgna2xhaWRhJz0+JHJlc3AtPmdldF9lcnJvcl9tZXNzYWdlKCkpOyBjb250aW51ZTsgfQogICAgICAgICRiPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyZXNwKTsKICAgICAgICAkclsnYmFuZHltYWknXVskdmFyZGFzXT1hcnJheSgKICAgICAgICAgICdodHRwJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHJlc3ApLAogICAgICAgICAgJ3RpcGFzJz0+d3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcigkcmVzcCwnY29udGVudC10eXBlJyksCiAgICAgICAgICAnZHlkaXMnPT5zdHJsZW4oJGIpLAogICAgICAgICAgJ3ByYWR6aWEnPT5tYl9zdWJzdHIocHJlZ19yZXBsYWNlKCcvW15ceDIwLVx4N0VdLycsJy4nLHN1YnN0cigkYiwwLDEyMCkpLDAsMTIwKSwKICAgICAgICAgICdhcl9wZGYnPT4oc3Vic3RyKCRiLDAsNCk9PT0nJVBERicpPydUQUlQJzonbmUnLAogICAgICAgICk7CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSwgMSk7Cg==','base64').toString('utf8').replace(/^<\?php\s*/,'');
let sid=null;
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S547 Manifest PDF',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 5');
const out=sh('curl -sSk --max-time 200 "'+SITE+'/?ps_s547=K547ml"');
try{O.rez=JSON.parse(out);}catch(e){O.rez={raw:String(out).slice(0,1500)};}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putFile('analize/s547.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
