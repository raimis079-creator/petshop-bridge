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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzNDEg4oCUIDYgcHVua3RvIGJhc2VsaW5lIHZhcnRhaSArIHRpa3NsdXMgYmxva2FpCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19iNnYnXSkgfHwgJF9HRVRbJ3BzX2I2diddICE9PSAnQjZ2M3QnICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICAkciA9IGFycmF5KCdWRVJTSUpBJz0+J2Jhc2VsaW5lNi12MScpOwogICAgJEYgPSBQRVRTSE9QX0NPUkVfRElSLidhc3NldHMvcGV0LWZvcm0uanMnOwogICAgJGpzID0gZmlsZV9nZXRfY29udGVudHMoJEYpOwogICAgJHJbJ3ZhcnRhaSddID0gYXJyYXkoCiAgICAgICAgJ2R5ZGlzJyA9PiBzdHJsZW4oJGpzKSwKICAgICAgICAnZHlkaXNfb2snID0+IChzdHJsZW4oJGpzKSA9PT0gNzI5MzUpLAogICAgICAgICdzaGEyNTYnID0+IGhhc2goJ3NoYTI1NicsJGpzKSwKICAgICAgICAnc2hhX29rJyA9PiAoaGFzaCgnc2hhMjU2JywkanMpID09PSAnODA3ZmVhODBmNDVmY2NmNGY3MmNkNGIxOGU5NTgzOWMyODI2ZTc0Yzg0Y2Q3YWM2OTczZTQ1MmUwNzViMmM4ZScpLAogICAgICAgICdTMzM5JyA9PiBzdWJzdHJfY291bnQoJGpzLCdTMzM5JyksCiAgICAgICAgJ3BldF9kcmFmdCcgPT4gc3Vic3RyX2NvdW50KCRqcywncGV0LWRyYWZ0JyksCiAgICAgICAgJ1NSVl9EUkFGVF9LRVknID0+IHN1YnN0cl9jb3VudCgkanMsJ1NSVl9EUkFGVF9LRVknKSwKICAgICk7CiAgICAkclsndmFydGFpJ11bJ1BSQUVKTyddID0gKCRyWyd2YXJ0YWknXVsnZHlkaXNfb2snXSAmJiAkclsndmFydGFpJ11bJ3NoYV9vayddCiAgICAgICAgJiYgJHJbJ3ZhcnRhaSddWydTMzM5J109PT0wICYmICRyWyd2YXJ0YWknXVsncGV0X2RyYWZ0J109PT0wICYmICRyWyd2YXJ0YWknXVsnU1JWX0RSQUZUX0tFWSddPT09MCk7CgogICAgJGVpbCA9IGV4cGxvZGUoIlxuIiwgJGpzKTsKICAgIC8vIGRyYWZ0IGZ1bmtjaWpvcyA3OC0xMjUKICAgICRyWydiX2RyYWZ0J10gPSBpbXBsb2RlKCJcbiIsIGFycmF5X3NsaWNlKCRlaWwsIDc3LCA1MCkpOwogICAgLy8gQ1RBICsgcmVxdWVzdE1hZ2ljTGluayAxNDI1LTE1MDAKICAgICRyWydiX2N0YSddID0gaW1wbG9kZSgiXG4iLCBhcnJheV9zbGljZSgkZWlsLCAxNDI0LCA3NikpOwogICAgLy8gUkVTVCBiYXplcyBraW50YW1hc2lzCiAgICBmb3JlYWNoICgkZWlsIGFzICRuPT4kbCkgewogICAgICAgIGlmIChwcmVnX21hdGNoKCcvKFJFU1R8QVBJfGFwaVVybHxyZXN0VXJsfHdwQXBpU2V0dGluZ3N8UFNQRVQpLycsICRsKSAmJiAkbiA8IDgwKSB7CiAgICAgICAgICAgICRyWydiX2tvbnN0YW50b3MnXVtdID0gKCRuKzEpLic6ICcudHJpbShzdWJzdHIoJGwsMCwxNTApKTsKICAgICAgICB9CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwogICAgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('baseline6.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_b6v=B6v3t"');
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
putB64('baseline6.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
