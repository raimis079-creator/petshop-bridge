import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:20e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s424',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:20e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run425-v1'}; let sid=null;
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzQyNSBHU0MgVVJMIE1hdGNoIHYxIOKAlCBhciBzZW5hcyBVUkwgYXRpdGlrdHUgZXNhbWEgdHVyaW5pCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19zNDI1J10pIHx8ICRfR0VUWydwc19zNDI1J10gIT09ICdLNDI1Z3MnICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBAc2V0X3RpbWVfbGltaXQoMjgwKTsKICAgIGdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7CiAgICAkcj1hcnJheSgnVkVSU0lKQSc9PidzNDI1LXYxJyk7CgogICAgLy8gVklTSSBrYXRlZ29yaWp1IHNsdWcnYWkgc3Uga2VsaXUKICAgICR0ZXJtcz1nZXRfdGVybXMoYXJyYXkoJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywnaGlkZV9lbXB0eSc9PmZhbHNlKSk7CiAgICAka2F0PWFycmF5KCk7CiAgICBmb3JlYWNoKCR0ZXJtcyBhcyAkdCl7CiAgICAgICAgJGtlbGlhcz1hcnJheSgkdC0+c2x1Zyk7ICRwPSR0LT5wYXJlbnQ7CiAgICAgICAgJHNhdWdhPTA7CiAgICAgICAgd2hpbGUoJHAgJiYgJHNhdWdhKys8NSl7ICRwdD1nZXRfdGVybSgkcCwncHJvZHVjdF9jYXQnKTsgaWYoISRwdHx8aXNfd3BfZXJyb3IoJHB0KSkgYnJlYWs7IGFycmF5X3Vuc2hpZnQoJGtlbGlhcywkcHQtPnNsdWcpOyAkcD0kcHQtPnBhcmVudDsgfQogICAgICAgICRrYXRbJHQtPnNsdWddPWFycmF5KCdpZCc9PiR0LT50ZXJtX2lkLCdjb3VudCc9PiR0LT5jb3VudCwna2VsaWFzJz0+aW1wbG9kZSgnLycsJGtlbGlhcyksJ2x5Z2lzJz0+Y291bnQoJGtlbGlhcykpOwogICAgfQogICAgJHJbJ2thdGVnb3Jpam9zJ109JGthdDsKICAgICRyWydrYXRlZ29yaWp1X3NrJ109Y291bnQoJGthdCk7CgogICAgLy8gVklTSSBwdXNsYXBpdSBzbHVnJ2FpIChrb25mbGlrdHUgcGF0aWtyYSkKICAgICRyWydwdXNsYXBpdV9zbHVnJ109JHdwZGItPmdldF9jb2woIlNFTEVDVCBwb3N0X25hbWUgRlJPTSB7JHBmfXBvc3RzCiAgICAgICAgV0hFUkUgcG9zdF90eXBlIElOICgncGFnZScsJ3Bvc3QnKSBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwb3N0X25hbWU8PicnIik7CiAgICAvLyBwcm9kdWt0dSBzbHVnCiAgICAkclsncHJvZHVrdHVfc2snXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIpOwogICAgLy8gYnJhbmQgdGVybWluYWkKICAgICRiPWdldF90ZXJtcyhhcnJheSgndGF4b25vbXknPT4ncHJvZHVjdF9icmFuZCcsJ2hpZGVfZW1wdHknPT5mYWxzZSkpOwogICAgJHJbJ2JyZW5kYWknXT1pc193cF9lcnJvcigkYik/J25lcmEnOmFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuICR4LT5zbHVnO30sJGIpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8').replace(/^<\?php\s*/,'');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S425 GSC Match v1',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
const x=sh('curl -sSk --max-time 180 "'+SITE+'/?ps_s425=K425gs&z='+Math.random()+'"');
try{O.rez=JSON.parse(x);}catch(e){O.rez={raw:String(x).slice(0,500)};}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putResult('s425.json', JSON.stringify(O,null,1));
console.log('OK');
