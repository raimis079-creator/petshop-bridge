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
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgQm9vdHN0cmFwIENoZWNrIHYxCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19jazQnXSkgfHwgJF9HRVRbJ3BzX2NrNCddICE9PSAnQ2s0bTgnICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBnbG9iYWwgJHdwZGI7CiAgICAvLyBKT0tJTyByZXF1aXJlX29uY2Ug4oCUIHRpa3JpbmFtLCBrYSBtYXRvIFBST0RVS0NJTklTIHJ1bnRpbWUKICAgICRyID0gYXJyYXkoCiAgICAgICAgJ1ZFUlNJSkEnICAgICAgID0+ICdib290LWNoZWNrLXYxJywKICAgICAgICAna2xhc2VfeXJhJyAgICAgPT4gY2xhc3NfZXhpc3RzKCdQZXRzaG9wX1BldF9EcmFmdHMnLCBmYWxzZSksCiAgICAgICAgJ2xlbnRlbGVfeXJhJyAgID0+ICgkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAneyR3cGRiLT5wcmVmaXh9cHNfcGV0X3Byb2ZpbGVfZHJhZnRzJyIpICE9PSBudWxsKSwKICAgICAgICAnZGJfdmVyc2lqYScgICAgPT4gZ2V0X29wdGlvbigncGV0c2hvcF9wZXRfZHJhZnRzX2RiX3ZlcnNpb24nKSwKICAgICAgICAnaGFzaF9yYWt0YXMnICAgPT4gKGJvb2wpIGdldF9vcHRpb24oJ3BldHNob3BfcGV0X2RyYWZ0X2hhc2hfa2V5JyksCiAgICApOwogICAgaWYgKCRyWydrbGFzZV95cmEnXSkgewogICAgICAgICRyWyd0YWJsZV9tZXRvZGFzJ10gPSBQZXRzaG9wX1BldF9EcmFmdHM6OnRhYmxlKCk7CiAgICAgICAgJHJbJ3N0YXRzJ10gICAgICAgICA9IFBldHNob3BfUGV0X0RyYWZ0czo6c3RhdHMoKTsKICAgICAgICAvLyBITUFDIHN0YWJpbHVtYXMgcGVyIHV6a2xhdXNhcyDigJQgcmFrdGFzIG5ldHVyaSBwZXJzaWdlbmVydW90aQogICAgICAgICRyWydoYXNoX3B2eiddICAgICAgPSBzdWJzdHIoUGV0c2hvcF9QZXRfRHJhZnRzOjplbWFpbF9oYXNoKCdzdGFiaWx1bWFzQHRlc3QubHQnKSwgMCwgMTYpOwogICAgfQogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fUFJFVFRZX1BSSU5UKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Bootstrap Check v1',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('bootcheck.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
const a=sh('curl -sSk -m 60 "'+SITE+'/?ps_ck4=Ck4m8"');
let A=null; try{A=JSON.parse(a.out);}catch(e){O.auth_raw=a.out.slice(0,800);}
O.clean = A;

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('bootcheck.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
