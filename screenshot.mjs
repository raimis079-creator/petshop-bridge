import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
// ★ Senu TEMP snippet'u valymas — kitaip senas atsako i ta pati rakta.
try{
  const ls=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"');
  const arr=JSON.parse(ls.out); const off=[];
  for(const s0 of arr){ if(s0.name && s0.name.indexOf('TEMP')===0 && s0.active){
    fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
    sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+s0.id+'"');
    off.push(s0.id+':'+s0.name); } }
  O.deaktyvuota_TEMP=off;
}catch(e){ O.valymo_klaida=String(e).slice(0,200); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgVG9rZW5zIFJlY29uIHYxCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc190azgnXSkgfHwgJF9HRVRbJ3BzX3RrOCddICE9PSAnVGs4cDMnICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICAkciA9IGFycmF5KCdWRVJTSUpBJz0+J3Rva2Vucy1yZWNvbi12MScpOwogICAgJGJhc2UgPSBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlLyc7CgogICAgLy8gMSkga3VyIGFwaWJyZXp0aSB0b2tlbnUgaGVscGVyaWFpCiAgICAkaXQgPSBuZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGJhc2UsIFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yOjpTS0lQX0RPVFMpKTsKICAgIGZvcmVhY2ggKCRpdCBhcyAkZikgewogICAgICAgIGlmICghJGYtPmlzRmlsZSgpIHx8IHN0cnRvbG93ZXIoJGYtPmdldEV4dGVuc2lvbigpKSE9PSdwaHAnKSBjb250aW51ZTsKICAgICAgICAkYyA9IGZpbGVfZ2V0X2NvbnRlbnRzKCRmLT5nZXRQYXRobmFtZSgpKTsKICAgICAgICAkcmVsID0gc3RyX3JlcGxhY2UoJGJhc2UsJycsJGYtPmdldFBhdGhuYW1lKCkpOwogICAgICAgIGlmIChzdHJwb3MoJGMsJ2Z1bmN0aW9uIHBzX2dlbmVyYXRlX3Rva2VuJykhPT1mYWxzZSkgewogICAgICAgICAgICAkaT1zdHJwb3MoJGMsJ2Z1bmN0aW9uIHBzX2dlbmVyYXRlX3Rva2VuJyk7CiAgICAgICAgICAgICRyWyd0b2tlbnNfZmFpbGFzJ109JHJlbDsKICAgICAgICAgICAgJHJbJ3BzX2dlbmVyYXRlX3Rva2VuJ109c3Vic3RyKCRjLCRpLDE4MDApOwogICAgICAgICAgICAkaz1zdHJwb3MoJGMsJ2Z1bmN0aW9uIHBzX3BlZWtfdG9rZW4nKTsgICAkclsncHNfcGVla190b2tlbiddICAgPSAkayE9PWZhbHNlP3N1YnN0cigkYywkayw5MDApOicnOwogICAgICAgICAgICAkbT1zdHJwb3MoJGMsJ2Z1bmN0aW9uIHBzX2NvbnN1bWVfdG9rZW4nKTskclsncHNfY29uc3VtZV90b2tlbiddPSAkbSE9PWZhbHNlP3N1YnN0cigkYywkbSwxNjAwKTonJzsKICAgICAgICB9CiAgICAgICAgaWYgKHN0cnBvcygkYywnZGJEZWx0YScpIT09ZmFsc2UpIHsgJHJbJ2RiRGVsdGFfZmFpbGFpJ11bXT0kcmVsOyB9CiAgICAgICAgaWYgKHByZWdfbWF0Y2goIi9kZWZpbmVcKFxzKidQRVRTSE9QX0NPUkVfKFx3KyknXHMqLFxzKicoW14nXSspJy8iLCAkYywgJG1tKSkgewogICAgICAgICAgICAkclsna29uc3RhbnRvcyddWyRtbVsxXV09JG1tWzJdOwogICAgICAgIH0KICAgIH0KICAgIC8vIDIpIG1pZ3JhY2lqdSBwYXZ5emR5cwogICAgaWYgKCFlbXB0eSgkclsnZGJEZWx0YV9mYWlsYWknXSkpIHsKICAgICAgICAkcCA9ICRiYXNlLiRyWydkYkRlbHRhX2ZhaWxhaSddWzBdOwogICAgICAgICRjID0gZmlsZV9nZXRfY29udGVudHMoJHApOwogICAgICAgICRpID0gc3RycG9zKCRjLCdkYkRlbHRhJyk7CiAgICAgICAgJHJbJ2RiRGVsdGFfcHZ6X2ZhaWxhcyddPSRyWydkYkRlbHRhX2ZhaWxhaSddWzBdOwogICAgICAgICRyWydkYkRlbHRhX3B2eiddPXN1YnN0cigkYywgbWF4KDAsJGktMTgwMCksIDI2MDApOwogICAgfQogICAgLy8gMykgcGV0LWZvcm0uanM6IGVtYWlsIENUQSAoMyB6aW5nc25pcykKICAgICRqcyA9IGZpbGVfZ2V0X2NvbnRlbnRzKCRiYXNlLidhc3NldHMvcGV0LWZvcm0uanMnKTsKICAgICRpID0gc3RycG9zKCRqcywgJ21hZ2ljLWxvZ2luL3JlcXVlc3QnKTsKICAgICRyWydqc19lbWFpbF9jdGEnXSA9ICRpIT09ZmFsc2UgPyBzdWJzdHIoJGpzLCBtYXgoMCwkaS0xNjAwKSwgMjQwMCkgOiAnbmVyYXN0YSc7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwogICAgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Tokens Recon v1',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('tokens_recon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
const a=sh('curl -sSk -m 60 "'+SITE+'/?ps_tk8=Tk8p3"');
let A=null; try{A=JSON.parse(a.out);}catch(e){O.auth_raw=a.out.slice(0,800);}
O.clean = A;

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('tokens_recon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
