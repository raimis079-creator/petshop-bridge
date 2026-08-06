import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s594',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run594'};
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczU5NCddKSB8fCAkX0dFVFsncHNfczU5NCddICE9PSAnSzU5NGZzJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgJHI9YXJyYXkoJ1ZFUlNJSkEnPT4nczU5NCcpOwogICAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0Z1bGZpbGxtZW50X1NvdXJjZScpKXsKICAgICAgICAkcmM9bmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9GdWxmaWxsbWVudF9Tb3VyY2UnKTsKICAgICAgICAkZj0kcmMtPmdldEZpbGVOYW1lKCk7CiAgICAgICAgJHJbJ2ZhaWxhcyddPXN0cl9yZXBsYWNlKGFycmF5KFdQTVVfUExVR0lOX0RJUixXUF9QTFVHSU5fRElSLFdQX0NPTlRFTlRfRElSKSwnJywkZik7CiAgICAgICAgJHJbJ0InXT1maWxlc2l6ZSgkZik7CiAgICAgICAgJHJbJ3NoYSddPXN1YnN0cihoYXNoX2ZpbGUoJ3NoYTI1NicsJGYpLDAsMTYpOwogICAgICAgICRyWydiNjQnXT1iYXNlNjRfZW5jb2RlKGZpbGVfZ2V0X2NvbnRlbnRzKCRmKSk7CiAgICAgICAgJG09YXJyYXkoKTsKICAgICAgICBmb3JlYWNoKCRyYy0+Z2V0TWV0aG9kcygpIGFzICRtbSl7IGlmKCRtbS0+Y2xhc3M9PT0nUGV0c2hvcF9GdWxmaWxsbWVudF9Tb3VyY2UnKSAkbVtdPSRtbS0+Z2V0TmFtZSgpOyB9CiAgICAgICAgJHJbJ21ldG9kYWknXT0kbTsKICAgIH0gZWxzZSB7ICRyWydlcnInXT0na2xhc8SXcyBuxJdyYSc7IH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8').replace(/^<\?php\s*/,'');
let sid=null;
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S594 FS',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 5');
const out=sh('curl -sSk --max-time 200 "'+SITE+'/?ps_s594=K594fs"');
try{O.rez=JSON.parse(out);}catch(e){O.rez={raw:String(out).slice(0,1500)};}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putFile('analize/s594.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
