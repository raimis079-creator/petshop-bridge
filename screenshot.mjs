import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s354',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run354-v1'}; let sid=null;
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzM1NCBEdXBsaWNhdGUgU2NyZWVuIFJlY29uIHYxCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19zMzU0J10pIHx8ICRfR0VUWydwc19zMzU0J10gIT09ICdLMzU0cjInICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICAkcj1hcnJheSgnVkVSU0lKQSc9PidzMzU0LXYxJyk7CiAgICAkZmFpbGFpID0gYXJyYXkoCiAgICAgICAgJ2RyYWZ0cycgPT4gV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcy9jbGFzcy1wZXQtZHJhZnRzLnBocCcsCiAgICAgICAgJ3Byb2ZpbGUnPT4gV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcy9jbGFzcy1wZXQtcHJvZmlsZS5waHAnLAogICAgICAgICdwcm9qcycgID0+IFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvYXNzZXRzL3BldC1wcm9maWxlLmpzJywKICAgICk7CiAgICAkenltID0gYXJyYXkoJ2NsYWltX3BlbmRpbmcnLCdkdXBsaWNhdGVfY2FuZGlkYXRlJywncGV0X2NsYWltJywnY29tcGxldGVfY2xhaW0nLCdjcmVhdGVfcGV0X3Jlc3VsdCcsJ2NhbmRpZGF0ZV9pZHMnLCdyZWdpc3Rlcl9yZXN0X3JvdXRlJyk7CiAgICBmb3JlYWNoKCRmYWlsYWkgYXMgJGs9PiRmKXsKICAgICAgICAkYz1AZmlsZV9nZXRfY29udGVudHMoJGYpOyBpZigkYz09PWZhbHNlKXsgJHJbJGtdPSdORVJBJzsgY29udGludWU7IH0KICAgICAgICAkbGluZXM9ZXhwbG9kZSgiXG4iLCRjKTsKICAgICAgICAkaGl0cz1hcnJheSgpOwogICAgICAgIGZvcmVhY2goJGxpbmVzIGFzICRpPT4kbG4pewogICAgICAgICAgICBmb3JlYWNoKCR6eW0gYXMgJHopeyBpZihzdHJwb3MoJGxuLCR6KSE9PWZhbHNlKXsgJGhpdHNbXT0kaTsgYnJlYWs7IH0gfQogICAgICAgIH0KICAgICAgICAvLyBsYW5nYWkgKy02IGVpbC4sIHN1anVuZ3RpCiAgICAgICAgJHJvd3M9YXJyYXkoKTsgJHNlZW49YXJyYXkoKTsKICAgICAgICBmb3JlYWNoKCRoaXRzIGFzICRoKXsKICAgICAgICAgICAgZm9yKCRpPW1heCgwLCRoLTYpOyRpPD1taW4oY291bnQoJGxpbmVzKS0xLCRoKzYpOyRpKyspewogICAgICAgICAgICAgICAgaWYoaXNzZXQoJHNlZW5bJGldKSkgY29udGludWU7ICRzZWVuWyRpXT0xOwogICAgICAgICAgICAgICAgJHJvd3NbXT0oJGkrMSkuJzogJy5ydHJpbShzdWJzdHIoJGxpbmVzWyRpXSwwLDE4MCkpOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgICRyWyRrXT1hcnJheSgnQic9PnN0cmxlbigkYyksJ3NoYSc9PnN1YnN0cihoYXNoKCdzaGEyNTYnLCRjKSwwLDE2KSwnZWlsJz0+Y291bnQoJGxpbmVzKSwnZnJhZyc9PmFycmF5X3NsaWNlKCRyb3dzLDAsMzIwKSk7CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwgMSk7Cg==','base64').toString('utf8').replace(/^<\?php\s*/,'');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S354 Dup Recon v1',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const r=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(r.out); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
const g=sh('curl -sSk --max-time 90 "'+SITE+'/?ps_s354=K354r2&z='+Math.random()+'"');
try{O.rez=JSON.parse(g.out);}catch(e){O.raw=g.out.slice(0,800);}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putResult('s354.json', JSON.stringify(O,null,1));
console.log('OK');
