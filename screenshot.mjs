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
const php=Buffer.from('PD9waHAKLyoqCiAqIFVJIExvY2FsaXphdGlvbiBSdW50aW1lIEF1ZGl0IOKAlCBmb3Jtb3MgbWFya3VwCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19mbTknXSkgfHwgJF9HRVRbJ3BzX2ZtOSddICE9PSAnRm05azYnICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICAkciA9IGFycmF5KCdWRVJTSUpBJz0+J2Zvcm0tbWFya3VwLXYxJyk7CiAgICAkcmVzcCA9IHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy9rb250YWt0YWkvJyksIGFycmF5KCd0aW1lb3V0Jz0+MzUsJ3NzbHZlcmlmeSc9PmZhbHNlLAogICAgICAgICdoZWFkZXJzJz0+YXJyYXkoJ0NhY2hlLUNvbnRyb2wnPT4nbm8tY2FjaGUnKSkpOwogICAgJGggPSBpc193cF9lcnJvcigkcmVzcCkgPyAnJyA6IHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyZXNwKTsKCiAgICAvLyBzdWJtaXQgbXlndHVrYXMKICAgIGlmIChwcmVnX21hdGNoKCcjPGJ1dHRvbltePl0qd3Bmb3Jtcy1zdWJtaXRbXj5dKj4uKj88L2J1dHRvbj4jcycsICRoLCAkbSkpIHsKICAgICAgICAkclsnbXlndHVrYXMnXSA9ICRtWzBdOwogICAgfSBlbHNlaWYgKHByZWdfbWF0Y2goJyM8KGJ1dHRvbnxpbnB1dClbXj5dKnR5cGU9WyJcJ11zdWJtaXRbIlwnXVtePl0qPiguKj88L2J1dHRvbj4pPyNzJywgJGgsICRtKSkgewogICAgICAgICRyWydteWd0dWthcyddID0gJG1bMF07CiAgICB9IGVsc2UgeyAkclsnbXlndHVrYXMnXSA9ICduZXJhc3RhJzsgfQoKICAgIC8vIGxhdWthaSBzdSByZXF1aXJlZAogICAgcHJlZ19tYXRjaF9hbGwoJyM8bGFiZWxbXj5dKj4oLio/KTwvbGFiZWw+I3MnLCAkaCwgJGxtKTsKICAgICRyWydldGlrZXRlcyddID0gYXJyYXlfc2xpY2UoYXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXsgcmV0dXJuIHRyaW0od3Bfc3RyaXBfYWxsX3RhZ3MoJHgpKTsgfSwgJGxtWzFdKSwgMCwgMTUpOwoKICAgIC8vIHdwZm9ybXMgSlMgbG9rYWxpemFjaWpvcyBvYmpla3RhcyDigJQgY2lhIGd5dmVuYSBrbGFpZHUgdGVrc3RhaQogICAgaWYgKHByZWdfbWF0Y2goJyN3cGZvcm1zX3NldHRpbmdzXHMqPVxzKihcey4qP1x9KTsjcycsICRoLCAkbSkpIHsKICAgICAgICAkaiA9IGpzb25fZGVjb2RlKCRtWzFdLCB0cnVlKTsKICAgICAgICBpZiAoaXNfYXJyYXkoJGopKSB7CiAgICAgICAgICAgIGZvcmVhY2ggKCRqIGFzICRrPT4kdikgewogICAgICAgICAgICAgICAgaWYgKGlzX3N0cmluZygkdikgJiYgcHJlZ19tYXRjaCgnL15bQS1aXVthLXpdLycsICR2KSAmJiAhcHJlZ19tYXRjaCgnL1vEhcSNxJnEl8SvxaHFs8Wrxb5dL3UnLCAkdikpIHsKICAgICAgICAgICAgICAgICAgICAkclsnd3Bmb3Jtc19KU19hbmdsaXNraSddWyRrXSA9ICR2OwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgICAgICRyWyd3cGZvcm1zX0pTX3Zpc28nXSA9IGNvdW50KCRqKTsKICAgICAgICB9CiAgICB9CiAgICAvLyBmb3Jtb3MgSUQKICAgIGlmIChwcmVnX21hdGNoKCcjaWQ9IndwZm9ybXMtZm9ybS0oXGQrKSIjJywgJGgsICRtKSkgeyAkclsnZm9ybW9zX2lkJ10gPSAkbVsxXTsgfQogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('formmarkup.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_fm9=Fm9k6"');
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
putB64('formmarkup.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
