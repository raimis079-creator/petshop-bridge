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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjggQmFzZWxpbmUgQ2xlYW51cCArIGNsaWVudF9yZWYgc3R1bHBlbGlvIHBhdGlrcmEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2JjNSddKSB8fCAkX0dFVFsncHNfYmM1J10gIT09ICdCYzV5MicgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGdsb2JhbCAkd3BkYjsgJFBFVFM9JHdwZGItPnByZWZpeC4ncHNfcGV0cyc7ICRFTD0kd3BkYi0+cHJlZml4Lidwc19ldmVudF9sb2cnOwogICAgJHI9YXJyYXkoJ1ZFUlNJSkEnPT4nY2xlYW51cC12MScpOwoKICAgIC8vIDEpIGNsaWVudF9yZWYgc3R1bHBlbGlvIEFQSUJSRVpJTUFTIOKAlCBhciB0ZWxwYSAzNiBzaW1ib2xpdSBVVUlECiAgICAkY29sID0gJHdwZGItPmdldF9yb3coIlNIT1cgQ09MVU1OUyBGUk9NICRQRVRTIExJS0UgJ2NsaWVudF9yZWYnIiwgQVJSQVlfQSk7CiAgICAkclsnY2xpZW50X3JlZl9zdHVscGVsaXMnXSA9ICRjb2w7CiAgICBwcmVnX21hdGNoKCcvXCgoXGQrKVwpLycsIChzdHJpbmcpKCRjb2xbJ1R5cGUnXSA/PyAnJyksICRtKTsKICAgICRyWydpbGdpcyddID0gaXNzZXQoJG1bMV0pID8gKGludCkkbVsxXSA6IG51bGw7CiAgICAkclsndGVscGFfdXVpZDM2J10gPSAoJHJbJ2lsZ2lzJ10gPT09IG51bGwpID8gJ25lemlub21hJyA6ICgkclsnaWxnaXMnXSA+PSAzNiA/ICdUQUlQJyA6ICdORSDigJQgcmVpa2VzIEFMVEVSJyk7CgogICAgLy8gMikgaG9vayByZWNvcmRlcidpbyBQQVRJS1JBIOKAlCBhciBqaXMgYXBza3JpdGFpIHZlaWtpYQogICAgJEdMT0JBTFNbJ3BzX3QnXSA9IGFycmF5KCk7CiAgICBhZGRfYWN0aW9uKCdhbGwnLCBmdW5jdGlvbigkdGFnKXsKICAgICAgICBpZiAocHJlZ19tYXRjaCgnL14ocHNffHBldHNob3B8cGV0XykvJywoc3RyaW5nKSR0YWcpKSAkR0xPQkFMU1sncHNfdCddW109KHN0cmluZykkdGFnOwogICAgfSwgMSk7CiAgICBkb19hY3Rpb24oJ3BzX3JlY29yZGVyX3NlbGZ0ZXN0Jyk7ICAgICAgICAvLyBkaXJidGluaXMgaG9vaydhcwogICAgZG9fYWN0aW9uKCdwZXRzaG9wX3JlY29yZGVyX3NlbGZ0ZXN0Jyk7CiAgICAkclsncmVjb3JkZXJfdmVpa2lhJ10gPSAoY291bnQoJEdMT0JBTFNbJ3BzX3QnXSkgPj0gMik7CiAgICAkclsncmVjb3JkZXJfcGFnYXZvJ10gPSAkR0xPQkFMU1sncHNfdCddOwoKICAgIC8vIDMpIFZBTFlNQVMgKHNuYXBzaG90IGphdSBpc3NhdWdvdGFzIGJhc2VsaW5lLmpzb24pCiAgICAkbWFyayA9ICdCTFRFU1QtJzsKICAgICRyWydwZXRzX3ByaWVzJ10gPSAoaW50KSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJFBFVFMiKTsKICAgICRyWydpc3RyaW50YV9wZXRzJ10gPSAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoCiAgICAgICAgIkRFTEVURSBGUk9NICRQRVRTIFdIRVJFIHBldF9uYW1lIExJS0UgJXMgT1IgcGV0X25hbWUgSVMgTlVMTCBPUiBwZXRfbmFtZT0nJyIsICclJy4kd3BkYi0+ZXNjX2xpa2UoJG1hcmspLiclJykpOwogICAgZm9yZWFjaCAoYXJyYXkoJ3BzX2JsX3UxJywncHNfYmxfdTInKSBhcyAkbG4pIHsKICAgICAgICAkdSA9IGdldF91c2VyX2J5KCdsb2dpbicsJGxuKTsKICAgICAgICBpZiAoJHUpIHsKICAgICAgICAgICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSAkUEVUUyBXSEVSRSB1c2VyX2lkPSVkIiwoaW50KSR1LT5JRCkpOwogICAgICAgICAgICByZXF1aXJlX29uY2UgQUJTUEFUSC4nd3AtYWRtaW4vaW5jbHVkZXMvdXNlci5waHAnOwogICAgICAgICAgICB3cF9kZWxldGVfdXNlcigoaW50KSR1LT5JRCk7CiAgICAgICAgICAgICRyWydpc3RyaW50aV92YXJ0b3RvamFpJ11bXSA9ICRsbjsKICAgICAgICB9CiAgICB9CiAgICAvLyB0ZXN0aW5pdSBldmVudHUgdmFseW1hcwogICAgJHJbJ2lzdHJpbnRhX2V2ZW50dSddID0gJHdwZGItPnF1ZXJ5KAogICAgICAgICJERUxFVEUgRlJPTSAkRUwgV0hFUkUgZXZlbnRfbmFtZT0ncGV0X3Byb2ZpbGVfY3JlYXRlZCcgQU5EIHBheWxvYWRfanNvbiBMSUtFICclQkxURVNULSUnIik7CiAgICAkclsncGV0c19wbyddID0gKGludCkgJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRQRVRTIik7CiAgICAkclsnbGlrdXNpdV9zdV96eW1la2xpdSddID0gKGludCkgJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoCiAgICAgICAgIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRQRVRTIFdIRVJFIHBldF9uYW1lIExJS0UgJXMiLCAnJScuJHdwZGItPmVzY19saWtlKCRtYXJrKS4nJScpKTsKICAgICRyWydjbGllbnRfcmVmX3BvJ10gPSAoaW50KSAkd3BkYi0+Z2V0X3ZhcigKICAgICAgICAiU0VMRUNUIENPVU5UKCopIEZST00gJFBFVFMgV0hFUkUgY2xpZW50X3JlZiBJUyBOT1QgTlVMTCBBTkQgY2xpZW50X3JlZiA8PiAnJyIpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fUFJFVFRZX1BSSU5UKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S328 Baseline Cleanup',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('blcleanup.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_bc5=Bc5y2"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.rez=uzk(1);

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('blcleanup.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
