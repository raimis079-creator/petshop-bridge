import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:20e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s467',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:20e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run467-v1'}; let sid=null;
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzQ2NyBtZXRhYm94IGZhaWxvIHNrYWl0eW1hcyDigJQga3VyIGlkxJd0aSBBViBsYXVrYQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczQ2NyddKSB8fCAkX0dFVFsncHNfczQ2NyddICE9PSAnSzQ2N21iJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgQHNldF90aW1lX2xpbWl0KDE1MCk7CiAgICAkcj1hcnJheSgnVkVSU0lKQSc9PidzNDY3LXYxJyk7CiAgICAkZj1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwvaW5jbHVkZXMvY2xhc3MtcHJvZHVjdC1jb3N0LW1ldGFib3gucGhwJzsKICAgIGlmKCFpc19maWxlKCRmKSl7ICRyWydLTEFJREEnXT0nbmVyYSAnLiRmOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRyKTsgZXhpdDsgfQogICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJGYpOwogICAgJHJbJ0InXT1zdHJsZW4oJGMpOyAkclsnc2hhJ109c3Vic3RyKGhhc2goJ3NoYTI1NicsJGMpLDAsMTYpOwogICAgJHJbJ3R1cmlueXMnXT0kYzsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8').replace(/^<\?php\s*/,'');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S467 Metabox read',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
function q(a){const x=sh('curl -sSk --max-time 270 "'+SITE+'/?ps_s467=K467mb&act='+a+'&z='+Math.random()+'"');
 try{return JSON.parse(x);}catch(e){return {raw:String(x).slice(0,500)};}}
O.rez=q('x');
O.svetaine=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 30 "'+SITE+'/"').trim();
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putResult('s467.json', JSON.stringify(O,null,1));
console.log('OK');
