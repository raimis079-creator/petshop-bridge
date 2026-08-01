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
const php=Buffer.from('PD9waHAKLyoqCiAqIFVJIExvY2FsaXphdGlvbiBSdW50aW1lIEF1ZGl0IOKAlCBrYWJ1Y2l1IHBhdGlrcmEgc2VydmVyeWplCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19xdDcnXSkgfHwgJF9HRVRbJ3BzX3F0NyddICE9PSAnUXQ3ejQnICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBnbG9iYWwgJHdwZGI7ICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4ncXVvdGUtY2hlY2stdjEnKTsKCiAgICAvLyAxKSBzbmlwcGV0J28ga29kYXMgU0VSVkVSWUpFCiAgICAka29kYXMgPSAkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgKICAgICAgICAiU0VMRUNUIGNvZGUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBuYW1lPSVzIiwgJ1BldHNob3AgVUkgTG9rYWxpemFjaWphIHYxIChMSVZFKScpKTsKICAgICRpID0gc3RycG9zKCRrb2RhcywgJ8SuZMSXdGkgxK8ga3JlcMWhZWzErycpOwogICAgJGZyYWcgPSAkaSAhPT0gZmFsc2UgPyBzdWJzdHIoJGtvZGFzLCAkaSwgNDApIDogJyc7CiAgICAkclsnc25pcHBldF9mcmFnbWVudGFzJ10gPSAkZnJhZzsKICAgICRyWydzbmlwcGV0X2JhaXRhaSddID0gYXJyYXkoKTsKICAgIGZvcmVhY2ggKHByZWdfc3BsaXQoJy8vdScsICRmcmFnLCAtMSwgUFJFR19TUExJVF9OT19FTVBUWSkgYXMgJGNoKSB7CiAgICAgICAgJGNwID0gbWJfb3JkKCRjaCwgJ1VURi04Jyk7CiAgICAgICAgaWYgKGluX2FycmF5KCRjcCwgYXJyYXkoMHgyMDFFLCAweDIwMUMsIDB4MDAyMiksIHRydWUpKSB7CiAgICAgICAgICAgICRyWydzbmlwcGV0X2JhaXRhaSddW10gPSBzcHJpbnRmKCclcyBVKyUwNFggJXMnLCAkY2gsICRjcCwKICAgICAgICAgICAgICAgICRjcD09PTB4MjAxRSA/ICdMVCBhdGlkYXJhbnRpJyA6ICgkY3A9PT0weDIwMUMgPyAnTFQgdXpkYXJhbnRpJyA6ICdBU0NJSSAiIEtMQUlEQScpKTsKICAgICAgICB9CiAgICB9CgogICAgLy8gMikgVElLUkFTIGFyaWEtbGFiZWwgc3VnZW5lcnVvdGFtZSBIVE1MCiAgICAkcmVzcCA9IHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy9wYXJkdW90dXZlLycpLCBhcnJheSgndGltZW91dCc9PjM1LCdzc2x2ZXJpZnknPT5mYWxzZSwKICAgICAgICAnaGVhZGVycyc9PmFycmF5KCdDYWNoZS1Db250cm9sJz0+J25vLWNhY2hlJykpKTsKICAgICRoID0gaXNfd3BfZXJyb3IoJHJlc3ApID8gJycgOiB3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcmVzcCk7CiAgICBpZiAocHJlZ19tYXRjaCgnL2FyaWEtbGFiZWw9IsSuZMSXdGkgxK8ga3JlcMWhZWzErzpbXiJdezAsODB9Ii91JywgJGgsICRtKSkgewogICAgICAgICRyWyd0aWtyYXNfYXJpYSddID0gJG1bMF07CiAgICAgICAgJHJbJ2FyaWFfYmFpdGFpJ10gPSBhcnJheSgpOwogICAgICAgIGZvcmVhY2ggKHByZWdfc3BsaXQoJy8vdScsICRtWzBdLCAtMSwgUFJFR19TUExJVF9OT19FTVBUWSkgYXMgJGNoKSB7CiAgICAgICAgICAgICRjcCA9IG1iX29yZCgkY2gsICdVVEYtOCcpOwogICAgICAgICAgICBpZiAoaW5fYXJyYXkoJGNwLCBhcnJheSgweDIwMUUsIDB4MjAxQyksIHRydWUpKSB7CiAgICAgICAgICAgICAgICAkclsnYXJpYV9iYWl0YWknXVtdID0gc3ByaW50ZignJXMgVSslMDRYJywgJGNoLCAkY3ApOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfSBlbHNlIHsgJHJbJ3Rpa3Jhc19hcmlhJ10gPSAnbmVyYXN0YSc7IH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('quotecheck.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_qt7=Qt7z4"');
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
putB64('quotecheck.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
