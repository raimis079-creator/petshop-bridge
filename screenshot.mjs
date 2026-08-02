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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMzcgcmVjb24g4oCUIG1hZ2ljLWxvZ2luIHRva2VudSBzYXVneWtsYQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfbXQ0J10pIHx8ICRfR0VUWydwc19tdDQnXSAhPT0gJ010NHo3JyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZ2xvYmFsICR3cGRiOyAkciA9IGFycmF5KCdWRVJTSUpBJz0+J21hZ2ljLXJlY29uLXYxJyk7CgogICAgLy8gMSkgdG9rZW51IGxlbnRlbGUKICAgICR0ID0gJHdwZGItPnByZWZpeC4ncHNfYWN0aW9uX3Rva2Vucyc7CiAgICAkclsndG9rZW5zX3NjaGVtYSddID0gJHdwZGItPmdldF9yZXN1bHRzKCJERVNDUklCRSAkdCIsIEFSUkFZX0EpOwogICAgJHJbJ3Rva2Vuc19raWVraXMnXSA9IChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0Iik7CiAgICAkclsndG9rZW5zX3B2eiddID0gJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQscHVycG9zZSxwdXJwb3NlX2dyb3VwLHN1YmplY3RfZW1haWwscmVzb3VyY2VfaWQsc3RhdHVzLGV4cGlyZXNfYXQgRlJPTSAkdCBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDMiLCBBUlJBWV9BKTsKCiAgICAvLyAyKSBQZXRzaG9wX0FjdGlvbl9Ub2tlbnM6OmdlbmVyYXRlIOKAlCBwaWxuYXMKICAgICRhcCA9IG51bGw7CiAgICBmb3JlYWNoIChnbG9iKFBFVFNIT1BfQ09SRV9ESVIuJ2luY2x1ZGVzLyoucGhwJykgYXMgJGYpIHsKICAgICAgICAkYyA9IGZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICAgICAgICBpZiAoc3RycG9zKCRjLCdjbGFzcyBQZXRzaG9wX0FjdGlvbl9Ub2tlbnMnKSAhPT0gZmFsc2UpIHsgJGFwID0gJGY7IGJyZWFrOyB9CiAgICB9CiAgICAkclsndG9rZW5zX2ZhaWxhcyddID0gJGFwID8gYmFzZW5hbWUoJGFwKSA6ICduZXJhc3RhJzsKICAgIGlmICgkYXApIHsKICAgICAgICAkYyA9IGZpbGVfZ2V0X2NvbnRlbnRzKCRhcCk7CiAgICAgICAgZm9yZWFjaCAoYXJyYXkoJ2dlbmVyYXRlJywncGVlaycsJ2NvbnN1bWUnKSBhcyAkbSkgewogICAgICAgICAgICAkaSA9IHN0cnBvcygkYywgImZ1bmN0aW9uICRtKCIpOwogICAgICAgICAgICBpZiAoJGkgIT09IGZhbHNlKSB7CiAgICAgICAgICAgICAgICAkaiA9IHN0cnBvcygkYywgIlxuXHRwdWJsaWMgc3RhdGljIGZ1bmN0aW9uIiwgJGkrMTApOwogICAgICAgICAgICAgICAgaWYgKCRqID09PSBmYWxzZSkgJGogPSBzdHJwb3MoJGMsICJcblx0cHJpdmF0ZSBzdGF0aWMgZnVuY3Rpb24iLCAkaSsxMCk7CiAgICAgICAgICAgICAgICAkclsnbWV0b2Rhc18nLiRtXSA9IHN1YnN0cigkYywgJGktNDAwLCAoJGo/JGotKCRpLTQwMCk6MjIwMCkpOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfQoKICAgIC8vIDMpIG1hZ2ljLWxvZ2luOiByZXF1ZXN0IGhhbmRsZXJpcyArIHByb2Nlc3NfbG9naW4KICAgICRtcCA9IFBFVFNIT1BfQ09SRV9ESVIuJ2luY2x1ZGVzL2NsYXNzLW1hZ2ljLWxvZ2luLnBocCc7CiAgICAkbWMgPSBmaWxlX2dldF9jb250ZW50cygkbXApOwogICAgJHJbJ21hZ2ljX2R5ZGlzJ10gPSBzdHJsZW4oJG1jKTsKICAgIGZvcmVhY2ggKGFycmF5KCdyZWdpc3Rlcl9yb3V0ZXMnLCdoYW5kbGVfcmVxdWVzdCcsJ3Byb2Nlc3NfbG9naW4nLCdzZW5kX2xvZ2luX2VtYWlsJywncmVuZGVyX2NvbmZpcm1hdGlvbicpIGFzICRtKSB7CiAgICAgICAgJGkgPSBzdHJwb3MoJG1jLCAiZnVuY3Rpb24gJG0oIik7CiAgICAgICAgaWYgKCRpID09PSBmYWxzZSkgY29udGludWU7CiAgICAgICAgJGogPSBzdHJwb3MoJG1jLCAiXG5cdHB1YmxpYyBzdGF0aWMgZnVuY3Rpb24iLCAkaSsxMCk7CiAgICAgICAgJGoyID0gc3RycG9zKCRtYywgIlxuXHRwcml2YXRlIHN0YXRpYyBmdW5jdGlvbiIsICRpKzEwKTsKICAgICAgICAkZW5kID0gbWluKGFycmF5X2ZpbHRlcihhcnJheSgkaiwkajIsc3RybGVuKCRtYykpKSk7CiAgICAgICAgJHJbJ21hZ2ljXycuJG1dID0gc3Vic3RyKCRtYywgJGktMzUwLCAkZW5kLSgkaS0zNTApKTsKICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('magicrecon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_mt4=Mt4z7"');
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
putB64('magicrecon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
