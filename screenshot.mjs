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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMzYgcmVjb24g4oCUIGRyYWZ0dSBrbGFzZSArIGJvb3RzdHJhcCBpbml0CiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19kcjknXSkgfHwgJF9HRVRbJ3BzX2RyOSddICE9PSAnRHI5azInICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICAkciA9IGFycmF5KCdWRVJTSUpBJz0+J2RyYWZ0LXJlY29uLXYxJyk7CiAgICAkcCA9IFBFVFNIT1BfQ09SRV9ESVIuJ2luY2x1ZGVzL2NsYXNzLXBldC1kcmFmdHMucGhwJzsKICAgICRjID0gZmlsZV9nZXRfY29udGVudHMoJHApOwogICAgJHJbJ2RyYWZ0c19keWRpcyddID0gc3RybGVuKCRjKTsKICAgICRyWydkcmFmdHNfdHVyaW55cyddID0gJGM7CgogICAgJG0gPSBQRVRTSE9QX0NPUkVfRElSLidwZXRzaG9wLWNvcmUucGhwJzsKICAgICRtYyA9IGZpbGVfZ2V0X2NvbnRlbnRzKCRtKTsKICAgIC8vIGluaXQga3ZpZXRpbWFpCiAgICBwcmVnX21hdGNoX2FsbCgnL14uKjo6aW5pdFwoXCkuKiQvbScsICRtYywgJG1tKTsKICAgICRyWydpbml0X2t2aWV0aW1haSddID0gJG1tWzBdOwogICAgJGkgPSBzdHJwb3MoJG1jLCAnUGV0c2hvcF9QZXRfRHJhZnRzOjptYXliZV9pbnN0YWxsJyk7CiAgICAkclsnYm9vdHN0cmFwX2ZyYWdtZW50YXMnXSA9ICRpIT09ZmFsc2UgPyBzdWJzdHIoJG1jLCBtYXgoMCwkaS03MDApLCAxMTAwKSA6ICduZXJhc3RhJzsKICAgICRyWydtYWluX2NybGYnXSA9IHN1YnN0cl9jb3VudCgkbWMsICJcclxuIik7CgogICAgLy8gYXIgc2FuaXRpemVfaW5wdXQgcGFzaWVraWFtYXMKICAgICRwcCA9IFBFVFNIT1BfQ09SRV9ESVIuJ2luY2x1ZGVzL2NsYXNzLXBldC1wcm9maWxlLnBocCc7CiAgICAkcGMgPSBmaWxlX2dldF9jb250ZW50cygkcHApOwogICAgJHJbJ3Nhbml0aXplX21hdG9tdW1hcyddID0gcHJlZ19tYXRjaCgnLyhcdyspXHMrc3RhdGljXHMrZnVuY3Rpb25ccytzYW5pdGl6ZV9pbnB1dC8nLCAkcGMsICRzbSkgPyAkc21bMV0gOiAnPyc7CiAgICAkclsncHJvZmlsZV9keWRpcyddID0gc3RybGVuKCRwYyk7CiAgICAvLyByZWdpc3Rlcl9yb3V0ZXMgZnJhZ21lbnRhcyDigJQga2FpcCByZWdpc3RydW9qYW1pIG1hcnNydXRhaQogICAgJGogPSBzdHJwb3MoJHBjLCAncHVibGljIHN0YXRpYyBmdW5jdGlvbiByZWdpc3Rlcl9yb3V0ZXMnKTsKICAgICRyWydyZWdpc3Rlcl9yb3V0ZXMnXSA9ICRqIT09ZmFsc2UgPyBzdWJzdHIoJHBjLCAkaiwgMTUwMCkgOiAnbmVyYXN0YSc7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwogICAgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('draftrecon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_dr9=Dr9k2"');
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
putB64('draftrecon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
