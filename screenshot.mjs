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
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgVmVyaWZ5IHY5CiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc192ZjMnXSkgfHwgJF9HRVRbJ3BzX3ZmMyddICE9PSAnVmYzcTknICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBnbG9iYWwgJHdwZGI7ICR0ID0gJHdwZGItPnByZWZpeC4nc25pcHBldHMnOwogICAgJHIgPSBhcnJheSgnVkVSU0lKQSc9Pid2ZXJpZnktdjknKTsKICAgICRyWydURU1QX3Zpc28nXSAgICAgPSAoaW50KSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKICAgICRyWydURU1QX2FrdHl2dXMnXSAgPSAoaW50KSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0xIik7CiAgICAkclsnYWt0eXZ1c19zYXJhc2FzJ10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lIEZST00gJHQgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0xIiwgQVJSQVlfQSk7CiAgICAkclsna2V0dXJpJ10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSBGUk9NICR0IFdIRVJFIGlkIElOICgxODg1LDE5MzcsMTk5OSwyMDAzKSIsIEFSUkFZX0EpOwogICAgJHJbJ2lkX3JpYm9zJ10gPSAkd3BkYi0+Z2V0X3JvdygiU0VMRUNUIE1JTihpZCkgbW4sIE1BWChpZCkgbXggRlJPTSAkdCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIsIEFSUkFZX0EpOwogICAgLy8gQXIgdmFydG90b2phcyB0aWtyYWkgaXN0cmludGFzIGlyIDM0NzIwIG1ldGEgcGFzYWxpbnRhCiAgICAkclsndXNlcl95cmEnXSA9IGdldF91c2VyX2J5KCdsb2dpbicsJ3BzX204X2UyZScpID8gdHJ1ZSA6IGZhbHNlOwogICAgJG8gPSB3Y19nZXRfb3JkZXIoMzQ3MjApOwogICAgJHJbJ3N0YW1wXzM0NzIwJ10gPSAkbyA/ICRvLT5nZXRfbWV0YSgnX3BzX2NvbXBsZXRlZF9hdCcsIHRydWUpIDogJ25lcmEgdXpzYWt5bW8nOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fUFJFVFRZX1BSSU5UKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Verify v9',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('verify.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
const a=sh('curl -sSk -m 60 "'+SITE+'/?ps_vf3=Vf3q9"');
let A=null; try{A=JSON.parse(a.out);}catch(e){O.auth_raw=a.out.slice(0,800);}
O.clean = A;

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('verify.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
