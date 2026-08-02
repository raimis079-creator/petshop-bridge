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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMzkg4oCUIHBldC1mb3JtLmpzIGVrc3BlcnRpemUKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2Z4NSddKSB8fCAkX0dFVFsncHNfZng1J10gIT09ICdGeDVtMycgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nZm9yZW5zaWNzLXYxJywgJ2RhYmFyJz0+Z21kYXRlKCdZLW0tZCBIOmk6cycpKTsKICAgICRkaXIgPSBQRVRTSE9QX0NPUkVfRElSLidhc3NldHMvJzsKCiAgICAvLyAxKSBWSVNJIGZhaWxhaSBhc3NldHMga2F0YWxvZ2Ugc3UgbGFpa28genltb21pcwogICAgZm9yZWFjaCAoKGFycmF5KSBnbG9iKCRkaXIuJyonKSBhcyAkZikgewogICAgICAgICRyWydhc3NldHMnXVtiYXNlbmFtZSgkZildID0gYXJyYXkoCiAgICAgICAgICAgICdkeWRpcyc9PmZpbGVzaXplKCRmKSwKICAgICAgICAgICAgJ3Bha2Vpc3RhJz0+Z21kYXRlKCdZLW0tZCBIOmk6cycsIGZpbGVtdGltZSgkZikpLAogICAgICAgICAgICAnc3VrdXJ0YSc9PmdtZGF0ZSgnWS1tLWQgSDppOnMnLCBmaWxlY3RpbWUoJGYpKSwKICAgICAgICApOwogICAgfQogICAgLy8gMikgcGV0LWZvcm0uanMgdHVyaW55cyDigJQgUzMzOSB6eW1vcwogICAgJHAgPSAkZGlyLidwZXQtZm9ybS5qcyc7CiAgICAkanMgPSBmaWxlX2dldF9jb250ZW50cygkcCk7CiAgICAkclsncGV0X2Zvcm0nXSA9IGFycmF5KAogICAgICAgICdkeWRpcyc9PnN0cmxlbigkanMpLCAnc2hhMjU2Jz0+aGFzaCgnc2hhMjU2JywkanMpLAogICAgICAgICdtdGltZSc9PmdtZGF0ZSgnWS1tLWQgSDppOnMnLCBmaWxlbXRpbWUoJHApKSwKICAgICAgICAnY3RpbWUnPT5nbWRhdGUoJ1ktbS1kIEg6aTpzJywgZmlsZWN0aW1lKCRwKSksCiAgICApOwogICAgZm9yZWFjaCAoYXJyYXkoJ1MzMzknLCdzcnZEcmFmdE1hcmtEaXJ0eScsJ1NSVl9EUkFGVF9LRVknLCdwZXQtZHJhZnQnLCdzaW5nbGUtZmxpZ2h0JywKICAgICAgICAgICAgICAgICAgICdhcmlhLWxpdmUnLCdyb2xlPSJhbGVydCInLCdhbGVydCgnKSBhcyAkeikgewogICAgICAgICRyWyd6eW1vcyddWyR6XSA9IHN1YnN0cl9jb3VudCgkanMsICR6KTsKICAgIH0KICAgIC8vIDMpIFZJU09TIFMtenltb3MgZmFpbGUgKGthcyBqaSBsaWV0byBpciBrYWRhKQogICAgcHJlZ19tYXRjaF9hbGwoJy9TKFxkezIsM30pWzpcc10vJywgJGpzLCAkc20pOwogICAgJHJbJ1Nfenltb3MnXSA9IGFycmF5X3NsaWNlKGFycmF5X2NvdW50X3ZhbHVlcygkc21bMV0pLCAwLCA0MCk7CiAgICAvLyA0KSBhciB5cmEgLmJhayBmYWlsdQogICAgZm9yZWFjaCAoKGFycmF5KSBnbG9iKFBFVFNIT1BfQ09SRV9ESVIuJ2Fzc2V0cy8qLmJhayonKSBhcyAkZikgewogICAgICAgICRyWydiYWNrdXBfYXNzZXRzJ11bYmFzZW5hbWUoJGYpXSA9IGFycmF5KCdkeWRpcyc9PmZpbGVzaXplKCRmKSwncGFrZWlzdGEnPT5nbWRhdGUoJ1ktbS1kIEg6aTpzJywgZmlsZW10aW1lKCRmKSkpOwogICAgfQogICAgLy8gNSkgcGx1Z2luIGthdGFsb2dvIG5hdWphdXNpIHBha2VpdGltYWkKICAgICRuYXVqYXVzaSA9IGFycmF5KCk7CiAgICAkaXQgPSBuZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoUEVUU0hPUF9DT1JFX0RJUiwgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICAgZm9yZWFjaCAoJGl0IGFzICRmKSB7CiAgICAgICAgaWYgKCEkZi0+aXNGaWxlKCkpIGNvbnRpbnVlOwogICAgICAgICRuYXVqYXVzaVtdID0gYXJyYXkoJ2ZhaWxhcyc9PnN0cl9yZXBsYWNlKFBFVFNIT1BfQ09SRV9ESVIsJycsJGYtPmdldFBhdGhuYW1lKCkpLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgJ210aW1lJz0+ZmlsZW10aW1lKCRmKSwgJ2R5ZGlzJz0+JGYtPmdldFNpemUoKSk7CiAgICB9CiAgICB1c29ydCgkbmF1amF1c2ksIGZ1bmN0aW9uKCRhLCRiKXsgcmV0dXJuICRiWydtdGltZSddIC0gJGFbJ210aW1lJ107IH0pOwogICAgZm9yZWFjaCAoYXJyYXlfc2xpY2UoJG5hdWphdXNpLDAsMTgpIGFzICR4KSB7CiAgICAgICAgJHJbJ25hdWphdXNpX2ZhaWxhaSddW10gPSBnbWRhdGUoJ1ktbS1kIEg6aTpzJywkeFsnbXRpbWUnXSkuJyAgJy4keFsnZHlkaXMnXS4nICAnLiR4WydmYWlsYXMnXTsKICAgIH0KICAgIC8vIDYpIHNydkRyYWZ0IGZ1bmtjaWp1IGJsb2thcwogICAgJGkgPSBzdHJwb3MoJGpzLCAnU1JWX0RSQUZUX0tFWScpOwogICAgJHJbJ3Nydl9ibG9rYXMnXSA9ICRpIT09ZmFsc2UgPyBzdWJzdHIoJGpzLCBtYXgoMCwkaS02MDApLCAyNDAwKSA6ICduZXJhc3RhJzsKICAgIC8vIDcpIGFyIGZhaWxhcyBzaW50YWtzaXNrYWkgcGlsbmFzIChza2xpYXVzdHUgYmFsYW5zYXMpCiAgICAkclsnc2tsaWF1c3RhaSddID0gYXJyYXkoJ3snPT5zdWJzdHJfY291bnQoJGpzLCd7JyksICd9Jz0+c3Vic3RyX2NvdW50KCRqcywnfScpLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICcoJz0+c3Vic3RyX2NvdW50KCRqcywnKCcpLCAnKSc9PnN1YnN0cl9jb3VudCgkanMsJyknKSk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwogICAgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('forensics.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_fx5=Fx5m3"');
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
putB64('forensics.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
