import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r346',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run347-v1'}; let sid=null;
// TEMP valymas
try{
  const ls=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"');
  const arr=JSON.parse(ls.out); const off=[];
  for(const s0 of arr){ if(s0.name && s0.name.indexOf('TEMP')===0 && s0.active){
    fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
    sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+s0.id+'"');
    off.push(s0.id+':'+s0.name); } }
  O.deaktyvuota_TEMP=off;
}catch(e){ O.valymo_klaida=String(e).slice(0,200); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzM0NyByZWNvbiDigJQgZmVlZGluZy1wZXQtd2VpZ2h0IGVuZHBvaW50YXMgaXIgam8ga3ZpZXRlamFpCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19yMzQ3J10pIHx8ICRfR0VUWydwc19yMzQ3J10gIT09ICdSMzQ3azInICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICAkciA9IGFycmF5KCdWRVJTSUpBJz0+J3MzNDctcmVjb24tdjEnKTsKCiAgICAkZiA9IFdQTVVfUExVR0lOX0RJUiAuICcvcGV0c2hvcC1mZWVkaW5nLWNhbGMtcmVzdC5waHAnOwogICAgJGMgPSBmaWxlX2dldF9jb250ZW50cygkZik7CiAgICAkbGluZXMgPSBleHBsb2RlKCJcbiIsICRjKTsKICAgICRyWydtdV9mYWlsYXMnXSA9IGFycmF5KCdkeWRpcyc9PnN0cmxlbigkYyksICdzaGEyNTYnPT5zdWJzdHIoaGFzaCgnc2hhMjU2JywkYyksMCwxNiksICdlaWx1Y2l1Jz0+Y291bnQoJGxpbmVzKSk7CiAgICAkclsnbXVfMTUwXzI0MCddID0gYXJyYXkoKTsKICAgIGZvciAoJGk9MTQ5OyAkaTwyNDAgJiYgJGk8Y291bnQoJGxpbmVzKTsgJGkrKykgewogICAgICAgICRyWydtdV8xNTBfMjQwJ11bXSA9ICgkaSsxKSAuICc6ICcgLiBydHJpbSgkbGluZXNbJGldKTsKICAgIH0KCiAgICAvLyBLYXMga3ZpZWNpYSBmZWVkaW5nLXBldC13ZWlnaHQgLyBraXR1cyBzdm9yaW8gZW5kcG9pbnR1cwogICAgJGllc2tvbSA9IGFycmF5KCdmZWVkaW5nLXBldC13ZWlnaHQnLCdmZWVkaW5nLXBldC1hY3Rpdml0eScsJ3BldC1wcm9maWxlJywncGV0LWRyYWZ0Jyk7CiAgICAkZGlycyA9IGFycmF5KCdwbHVnaW5zLyc9PldQX1BMVUdJTl9ESVIuJy8nLCAnbXUtcGx1Z2lucy8nPT5XUE1VX1BMVUdJTl9ESVIuJy8nLCAndGhlbWVzLyc9PmdldF90aGVtZV9yb290KCkuJy8nKTsKICAgICRrdml0ZWp1ID0gYXJyYXkoKTsKICAgIGZvcmVhY2ggKCRkaXJzIGFzICR6PT4kYmFzZSkgewogICAgICAgIGlmICghaXNfZGlyKCRiYXNlKSkgY29udGludWU7CiAgICAgICAgdHJ5IHsgJGl0ID0gbmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRiYXNlLCBGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOyB9CiAgICAgICAgY2F0Y2ggKEV4Y2VwdGlvbiAkZSkgeyBjb250aW51ZTsgfQogICAgICAgIGZvcmVhY2ggKCRpdCBhcyAkZmYpIHsKICAgICAgICAgICAgaWYgKCEkZmYtPmlzRmlsZSgpKSBjb250aW51ZTsKICAgICAgICAgICAgJHAgPSAkZmYtPmdldFBhdGhuYW1lKCk7CiAgICAgICAgICAgIGlmICghcHJlZ19tYXRjaCgnL1wuKHBocHxqcykkLycsJHApKSBjb250aW51ZTsKICAgICAgICAgICAgaWYgKHN0cnBvcygkcCwnLmJhaycpIT09ZmFsc2UgfHwgc3RycG9zKCRwLCdxdWFyYW50aW5lJykhPT1mYWxzZSkgY29udGludWU7CiAgICAgICAgICAgICRjYyA9IEBmaWxlX2dldF9jb250ZW50cygkcCk7IGlmICgkY2M9PT1mYWxzZSkgY29udGludWU7CiAgICAgICAgICAgIGZvcmVhY2ggKCRpZXNrb20gYXMgJGspIHsKICAgICAgICAgICAgICAgIGlmIChzdHJwb3MoJGNjLCRrKT09PWZhbHNlKSBjb250aW51ZTsKICAgICAgICAgICAgICAgICRscyA9IGV4cGxvZGUoIlxuIiwkY2MpOwogICAgICAgICAgICAgICAgZm9yZWFjaCAoJGxzIGFzICRpPT4kbCkgewogICAgICAgICAgICAgICAgICAgIGlmIChzdHJwb3MoJGwsJGspIT09ZmFsc2UpIHsKICAgICAgICAgICAgICAgICAgICAgICAgJGt2aXRlanVbXSA9IGFycmF5KCdyYWt0YXMnPT4kaywnZic9PiR6LnN0cl9yZXBsYWNlKCRiYXNlLCcnLCRwKSwnbCc9PiRpKzEsJ3R4dCc9PnRyaW0oc3Vic3RyKCRsLDAsMTgwKSkpOwogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQogICAgICAgIH0KICAgIH0KICAgICRyWydudW9yb2RvcyddID0gJGt2aXRlanU7CiAgICAkclsnbnVvcm9kdV92aXNvJ10gPSBjb3VudCgka3ZpdGVqdSk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S347 recon',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 5');
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_r347=R347k2"');
  try{ O.rez=JSON.parse(x.out); }catch(e){ O.raw=x.out.slice(0,1500); }
  fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');
}
putB64('r347.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done sid='+sid);
