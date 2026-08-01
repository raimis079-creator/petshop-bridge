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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjggQW5vbiBGb3JtIFJlY29uCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19zZjYnXSkgfHwgJF9HRVRbJ3BzX3NmNiddICE9PSAnU2Y2ZDknICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICAkciA9IGFycmF5KCdWRVJTSUpBJz0+J2Fub25mb3JtLXYxJyk7CiAgICAkYmFzZSA9IFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvJzsKCiAgICAvLyAxKSBzaG9ydGNvZGUgZnVua2NpamEg4oCUIGthIHJvZG8gYW5vbmltdWkKICAgICRjID0gZmlsZV9nZXRfY29udGVudHMoJGJhc2UuJ2luY2x1ZGVzL2NsYXNzLXBldC11aS5waHAnKTsKICAgICRpID0gc3RycG9zKCRjLCAicGV0c2hvcF9wZXRfZm9ybSIpOwogICAgJHJbJ3Nob3J0Y29kZV9yZWcnXSA9ICRpIT09ZmFsc2UgPyBzdWJzdHIoJGMsIG1heCgwLCRpLTQwMCksIDcwMCkgOiAnbmVyYXN0YSc7CiAgICBmb3JlYWNoIChhcnJheSgnZnVuY3Rpb24gcmVuZGVyX3Nob3J0Y29kZScsJ2Z1bmN0aW9uIHNob3J0Y29kZScsJ2Z1bmN0aW9uIGZvcm1fc2hvcnRjb2RlJykgYXMgJGZuKSB7CiAgICAgICAgJGogPSBzdHJwb3MoJGMsICRmbik7CiAgICAgICAgaWYgKCRqICE9PSBmYWxzZSkgeyAkclsnZm5fdmFyZGFzJ109JGZuOyAkclsnZm4nXT1zdWJzdHIoJGMsJGosMjQwMCk7IGJyZWFrOyB9CiAgICB9CgogICAgLy8gMikgSlM6IDMgemluZ3NuaW8gKGVsLiBwYXN0bykgdGVrc3RhaSDigJQga2FkIHB1c2xhcHlqZSBuZWR1YmxpdW90dW1lCiAgICAkanMgPSBmaWxlX2dldF9jb250ZW50cygkYmFzZS4nYXNzZXRzL3BldC1mb3JtLmpzJyk7CiAgICAkayA9IHN0cnBvcygkanMsICdtYWdpYy1sb2dpbi9yZXF1ZXN0Jyk7CiAgICAkclsnanNfZW1haWxfemluZ3NuaXMnXSA9ICRrIT09ZmFsc2UgPyBzdWJzdHIoJGpzLCBtYXgoMCwkay0yNDAwKSwgMzAwMCkgOiAnbmVyYXN0YSc7CgogICAgLy8gMykgZXNhbW8gL2Fua2V0YS10ZXN0YXMvIHR1cmlueXMKICAgICRwID0gZ2V0X3BhZ2VfYnlfcGF0aCgnYW5rZXRhLXRlc3RhcycpOwogICAgaWYgKCRwKSB7CiAgICAgICAgJHJbJ2VzYW1hc19pZCddID0gJHAtPklEOwogICAgICAgICRyWydlc2FtYXNfdGl0bGUnXSA9ICRwLT5wb3N0X3RpdGxlOwogICAgICAgICRyWydlc2FtYXNfY29udGVudCddID0gJHAtPnBvc3RfY29udGVudDsKICAgICAgICAkclsnZXNhbWFzX3N0YXR1cyddID0gJHAtPnBvc3Rfc3RhdHVzOwogICAgICAgICRyWydlc2FtYXNfdGVtcGxhdGUnXSA9IGdldF9wb3N0X21ldGEoJHAtPklELCdfd3BfcGFnZV90ZW1wbGF0ZScsdHJ1ZSk7CiAgICB9CiAgICAvLyBhciAvYXVnaW50aW5pby1wcm9maWxpcy8gamF1IGVnemlzdHVvamEKICAgICRuID0gZ2V0X3BhZ2VfYnlfcGF0aCgnYXVnaW50aW5pby1wcm9maWxpcycpOwogICAgJHJbJ25hdWphc19qYXVfeXJhJ10gPSAkbiA/ICRuLT5JRCA6IGZhbHNlOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S328 Anon Form Recon',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('anonform.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_sf6=Sf6d9"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.rez=uzk(1);

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('anonform.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
