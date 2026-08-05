import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s538',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run538'};
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczUzOCddKSB8fCAkX0dFVFsncHNfczUzOCddICE9PSAnSzUzOHZwJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgJHI9YXJyYXkoJ1ZFUlNJSkEnPT4nczUzOCcpOwogICAgJGltaz1mdW5jdGlvbigkY2xzLCRtKXsKICAgICAgICBpZighY2xhc3NfZXhpc3RzKCRjbHMpKSByZXR1cm4gJ0tMQVPEllMgTsSWUkEnOwogICAgICAgIHRyeXsgJHJtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCRjbHMsJG0pOyB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgcmV0dXJuICdNRVRPRE8gTsSWUkEnOyB9CiAgICAgICAgJGY9ZmlsZSgkcm0tPmdldEZpbGVOYW1lKCkpOwogICAgICAgIHJldHVybiBhcnJheSgnZmFpbGFzJz0+YmFzZW5hbWUoJHJtLT5nZXRGaWxlTmFtZSgpKSwKICAgICAgICAgICdrb2Rhcyc9PmltcGxvZGUoJycsIGFycmF5X3NsaWNlKCRmLCRybS0+Z2V0U3RhcnRMaW5lKCktMSxtaW4oODAsJHJtLT5nZXRFbmRMaW5lKCktJHJtLT5nZXRTdGFydExpbmUoKSsxKSkpKTsKICAgIH07CiAgICAkclsnZGlzcGF0Y2gnXT0kaW1rKCdXb29jb21tZXJjZV9TaG9wdXBfVmVuaXBha19TaGlwcGluZ19BZG1pbl9EaXNwYXRjaCcsJ2FkZF92ZW5pcGFrX3NoaXBwaW5nX2J1bGtfYWN0aW9uX3Byb2Nlc3MnKTsKICAgICRyWydsYWJlbCddPSRpbWsoJ1dvb2NvbW1lcmNlX1Nob3B1cF9WZW5pcGFrX1NoaXBwaW5nX0FkbWluX0xhYmVsJywnYWRkX3ZlbmlwYWtfc2hpcHBpbmdfYnVsa19hY3Rpb25fcHJvY2VzcycpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8').replace(/^<\?php\s*/,'');
let sid=null;
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S538 VP metodai',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 5');
const out=sh('curl -sSk --max-time 200 "'+SITE+'/?ps_s538=K538vp"');
try{O.rez=JSON.parse(out);}catch(e){O.rez={raw:String(out).slice(0,1500)};}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putFile('analize/s538.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
