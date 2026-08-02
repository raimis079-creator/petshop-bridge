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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMzJiIOKAlCBGNCBwYWllc2thICsgRUFOIGxhdWtvIHBhdGlrcmEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2EyYiddKSB8fCAkX0dFVFsncHNfYTJiJ10gIT09ICdBMmI2aycgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGdsb2JhbCAkd3BkYjsgJHIgPSBhcnJheSgnVkVSU0lKQSc9PidhdWRpdDItdjEnKTsKCiAgICAvLyAxKSBLT0tJRSBtZXRhIHJha3RhaSByZWFsaWFpIG5hdWRvamFtaSBFQU4KICAgICRrYW5kID0gYXJyYXkoJ19nbG9iYWxfdW5pcXVlX2lkJywnX2VhbicsJ19iYXJjb2RlJywnX2d0aW4nLCdfdXBjJywnX3dwbV9ndGluX2NvZGUnLCdfYWxnX2VhbicsJ2VhbicpOwogICAgZm9yZWFjaCAoJGthbmQgYXMgJGspIHsKICAgICAgICAkbiA9IChpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR3cGRiLT5wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0lcyBBTkQgbWV0YV92YWx1ZTw+JyciLCAkaykpOwogICAgICAgIGlmICgkbikgJHJbJ2Vhbl9yYWt0YWknXVska10gPSAkbjsKICAgIH0KICAgIC8vIHZpc2kgbWV0YSByYWt0YWkgc3UgJ2VhbicgYXJiYSAnZ3RpbicKICAgICRyWydwYW5hc3VzX3Jha3RhaSddID0gJHdwZGItPmdldF9jb2woIlNFTEVDVCBESVNUSU5DVCBtZXRhX2tleSBGUk9NICR3cGRiLT5wb3N0bWV0YSBXSEVSRSBtZXRhX2tleSBMSUtFICclZWFuJScgT1IgbWV0YV9rZXkgTElLRSAnJWd0aW4lJyBPUiBtZXRhX2tleSBMSUtFICclYmFyY29kZSUnIExJTUlUIDIwIik7CgogICAgLy8gMikgVElLUkEgZnJvbnRlbmQgcGFpZXNrYSBwZXIgSFRUUAogICAgJHNrdSA9ICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcC5tZXRhX3ZhbHVlIEZST00gJHdwZGItPnBvc3RtZXRhIHAgSk9JTiAkd3BkYi0+cG9zdHMgbyBPTiBvLklEPXAucG9zdF9pZCBBTkQgby5wb3N0X3N0YXR1cz0ncHVibGlzaCcgV0hFUkUgcC5tZXRhX2tleT0nX3NrdScgQU5EIHAubWV0YV92YWx1ZTw+JycgTElNSVQgMSIpOwogICAgJHBhdiA9ICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcG9zdF90aXRsZSBGUk9NICR3cGRiLT5wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgTElNSVQgMSIpOwogICAgJHpvZGlzID0gJHBhdiA/IG1iX3N1YnN0cih0cmltKGV4cGxvZGUoJyAnLCAkcGF2KVswXSksIDAsIDEyKSA6ICdtYWlzdGFzJzsKICAgIGZvcmVhY2ggKGFycmF5KCdza3UnPT4kc2t1LCAncGF2YWRpbmltYXMnPT4kem9kaXMsICdlYW4nPT5udWxsKSBhcyAkdGlwYXM9PiRxKSB7CiAgICAgICAgaWYgKCR0aXBhcz09PSdlYW4nKSB7CiAgICAgICAgICAgICRrID0gIWVtcHR5KCRyWydlYW5fcmFrdGFpJ10pID8gYXJyYXlfa2V5cygkclsnZWFuX3Jha3RhaSddKVswXSA6IG51bGw7CiAgICAgICAgICAgICRxID0gJGsgPyAkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHAubWV0YV92YWx1ZSBGUk9NICR3cGRiLT5wb3N0bWV0YSBwIEpPSU4gJHdwZGItPnBvc3RzIG8gT04gby5JRD1wLnBvc3RfaWQgQU5EIG8ucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIFdIRVJFIHAubWV0YV9rZXk9JXMgQU5EIHAubWV0YV92YWx1ZTw+JycgTElNSVQgMSIsICRrKSkgOiBudWxsOwogICAgICAgIH0KICAgICAgICBpZiAoISRxKSB7ICRyWydwYWllc2thJ11bJHRpcGFzXT0nbmVyYSBkdW9tZW51JzsgY29udGludWU7IH0KICAgICAgICAkdXJsID0gaG9tZV91cmwoJy8/cz0nLnJhd3VybGVuY29kZSgkcSkuJyZwb3N0X3R5cGU9cHJvZHVjdCcpOwogICAgICAgICRyZXNwID0gd3BfcmVtb3RlX2dldCgkdXJsLCBhcnJheSgndGltZW91dCc9PjM1LCdzc2x2ZXJpZnknPT5mYWxzZSkpOwogICAgICAgICRoID0gaXNfd3BfZXJyb3IoJHJlc3ApID8gJycgOiB3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcmVzcCk7CiAgICAgICAgcHJlZ19tYXRjaCgnIyhcZCspXHMqKHJlenVsdGF0fHByZWt8cHJvZHVjdHxyZXN1bHQpI2l1Jywgd3Bfc3RyaXBfYWxsX3RhZ3MoJGgpLCAkbSk7CiAgICAgICAgJHJbJ3BhaWVza2EnXVskdGlwYXNdID0gYXJyYXkoCiAgICAgICAgICAgICd1emtsYXVzYSc9PiRxLCAndXJsJz0+JHVybCwKICAgICAgICAgICAgJ2tvZGFzJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHJlc3ApLAogICAgICAgICAgICAnbmlla29fbmVyYXN0YSc9PiAoc3RyaXBvcygkaCwnTmlla28gbmVyYXN0YScpIT09ZmFsc2UgfHwgc3RyaXBvcygkaCwnbm90aGluZycpIT09ZmFsc2UKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHN0cmlwb3MoJGgsJ1JlenVsdGF0xbMgbmVyYXN0YScpIT09ZmFsc2UgfHwgc3RyaXBvcygkaCwnTm8gcHJvZHVjdHMnKSE9PWZhbHNlKSwKICAgICAgICAgICAgJ3Byb2R1a3R1X2tvcnRlbGl1Jz0+IHN1YnN0cl9jb3VudCgkaCwnY2xhc3M9InByb2R1Y3QgJyksCiAgICAgICAgKTsKICAgIH0KICAgIC8vIDMpIGFyIHlyYSBTS1UgcGFpZXNrb3MgcGx1Z2luL2tvZGFzCiAgICAkclsnc2t1X3BhaWVza29zX2tvZGFzJ10gPSBhcnJheSgpOwogICAgZm9yZWFjaCAoYXJyYXkoJ3JlbGV2YW5zc2knLCdzZWFyY2gtYnktc2t1Jywnd29vY29tbWVyY2Utc2t1LXNlYXJjaCcpIGFzICRwKSB7CiAgICAgICAgZm9yZWFjaCAoKGFycmF5KWdldF9vcHRpb24oJ2FjdGl2ZV9wbHVnaW5zJykgYXMgJGEpIHsgaWYgKHN0cmlwb3MoJGEsJHApIT09ZmFsc2UpICRyWydza3VfcGFpZXNrb3Nfa29kYXMnXVtdPSRhOyB9CiAgICB9CiAgICAkY29yZSA9IFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUnOwogICAgaWYgKGlzX2RpcigkY29yZSkpIHsKICAgICAgICAkaXQgPSBuZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGNvcmUsIFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yOjpTS0lQX0RPVFMpKTsKICAgICAgICBmb3JlYWNoICgkaXQgYXMgJGYpIHsKICAgICAgICAgICAgaWYgKCEkZi0+aXNGaWxlKCkgfHwgc3RydG9sb3dlcigkZi0+Z2V0RXh0ZW5zaW9uKCkpIT09J3BocCcpIGNvbnRpbnVlOwogICAgICAgICAgICAkYz1AZmlsZV9nZXRfY29udGVudHMoJGYtPmdldFBhdGhuYW1lKCkpOwogICAgICAgICAgICBpZiAoJGMhPT1mYWxzZSAmJiAoc3RycG9zKCRjLCdwb3N0c19zZWFyY2gnKSE9PWZhbHNlIHx8IHN0cnBvcygkYywncHJlX2dldF9wb3N0cycpIT09ZmFsc2UgJiYgc3RycG9zKCRjLCdfc2t1JykhPT1mYWxzZSkpIHsKICAgICAgICAgICAgICAgICRyWydwYWllc2tvc19rYWJsaXVrYWknXVtdID0gc3RyX3JlcGxhY2UoJGNvcmUuJy8nLCcnLCRmLT5nZXRQYXRobmFtZSgpKTsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgIH0KICAgIC8vIGFrdHl2dXMgc25pcHBldGFpIHN1IHBhaWVza2EKICAgICRyWydzbmlwX3BhaWVza2EnXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBhY3RpdmU9MSBBTkQgKGNvZGUgTElLRSAnJXBvc3RzX3NlYXJjaCUnIE9SIGNvZGUgTElLRSAnJXNlYXJjaF9ieV9za3UlJykiLCBBUlJBWV9BKTsKCiAgICAvLyA0KSBkcmFmdCBwcm9kdWt0dSBwcmllemFzdHlzCiAgICAkclsnZHJhZnRfcGFnYWxfc2FsdGluaSddID0gJHdwZGItPmdldF9yZXN1bHRzKAogICAgICAgICJTRUxFQ1QgbS5tZXRhX3ZhbHVlIHNhbHRpbmlzLCBDT1VOVCgqKSBjIEZST00gJHdwZGItPnBvc3RzIHAKICAgICAgICAgICBMRUZUIEpPSU4gJHdwZGItPnBvc3RtZXRhIG0gT04gbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXk9J19sZWdhY3lfc291cmNlJwogICAgICAgICAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdkcmFmdCcgR1JPVVAgQlkgbS5tZXRhX3ZhbHVlIE9SREVSIEJZIGMgREVTQyBMSU1JVCA4IiwgQVJSQVlfQSk7CiAgICAkclsnZHJhZnRfdmYnXSA9IChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR3cGRiLT5wb3N0cyBwIEpPSU4gJHdwZGItPnBvc3RtZXRhIG0gT04gbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXk9J192Zl9xdHknIFdIRVJFIHAucG9zdF9zdGF0dXM9J2RyYWZ0JyIpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('tzaudit2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_a2b=A2b6k"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.rez=uzk(1);
sh('sleep 4');
function code(u){ return sh('curl -sSkI -m 30 -o /dev/null -w "%{http_code}|%{redirect_url}" "'+u+'"').out.trim(); }
O.t_naujas       = code(SITE+'/paskyra/');
O.t_atsijungti   = code(SITE+'/paskyra/atsijungti/');
O.t_senas_logout = code(SITE+'/my-account/customer-logout/');
O.t_adresai      = code(SITE+'/paskyra/adresai/');
O.t_slaptazodis  = code(SITE+'/paskyra/pamirstas-slaptazodis/');
O.t_augintinis   = code(SITE+'/paskyra/augintinis/');
O.t_uzsakymai    = code(SITE+'/paskyra/uzsakymai/');
O.t_senas        = code(SITE+'/my-account/');
O.t_senas_uzsak  = code(SITE+'/my-account/orders/');
O.t_senas_augint = code(SITE+'/my-account/augintinis/');
O.t_landing      = code(SITE+'/augintinio-profilis/');
O.t_home         = code(SITE+'/');
O.t_shop         = code(SITE+'/parduotuve/');

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('tzaudit2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
