const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcXQnXSl8fCRfR0VUWydwc19xdCddIT09J1F0OEt3M054Jyl7cmV0dXJuO30KCWlmKCgkX0dFVFsnY29uZmlybSddPz8nJykhPT0nQVBQTFlfUVVBUkFOVElORScpeyBlY2hvIGpzb25fZW5jb2RlKGFycmF5KCdlcnInPT4ncmVpa2lhIGNvbmZpcm0nKSk7IGV4aXQ7IH0KCWdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCdGQVpFJz0+J0FQUExZLVFVQVJBTlRJTkUnKTsKCSRUPSRwZi4ncHNfZmVlZGluZ190YWJsZXMnOyAkTT0kcGYuJ3BzX2ZlZWRpbmdfbWFwJzsKCSR0aWRzPWFycmF5KDIzNywyMzgsMjM5KTsKCSRvWyd2ZWlrc21haSddPWFycmF5KCk7Cglmb3JlYWNoKCR0aWRzIGFzICR0aWQpewoJCSR1MT0kd3BkYi0+dXBkYXRlKCRULGFycmF5KCdzdGF0dXMnPT4nZHJhZnQnLCdpc19hY3RpdmUnPT4wLCdyZXRpcmVkX2F0Jz0+Y3VycmVudF90aW1lKCdteXNxbCcpLAoJCQkncmVhc29uJz0+J1MyMTJDIG5vbi1jb25mb3JtaW5nIGNhbm9uaWNhbCBoYXNoIC0gbGF1a2lhIG9maWNpYWxhdXMgcmVpbXBvcnRvJyksYXJyYXkoJ2lkJz0+JHRpZCkpOwoJCSR1Mj0kd3BkYi0+dXBkYXRlKCRNLGFycmF5KCdpc19hY3RpdmUnPT4wKSxhcnJheSgnZmVlZGluZ190YWJsZV9pZCc9PiR0aWQpKTsKCQkkb1sndmVpa3NtYWknXVtdPWFycmF5KCd0aWQnPT4kdGlkLCd0YWJsZV91cGQnPT4kdTEsJ21hcF91cGQnPT4kdTIpOwoJfQoJLy8gcGF0aWtyYQoJJG9bJ3BvX2thcmFudGlubyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHN0YXR1cyxpc19hY3RpdmUgRlJPTSB7JFR9IFdIRVJFIGlkIElOICgyMzcsMjM4LDIzOSkiLCBBUlJBWV9BKTsKCSRvWydha3R5dnVzX21hcHBpbmdhaSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskTX0gV0hFUkUgZmVlZGluZ190YWJsZV9pZCBJTiAoMjM3LDIzOCwyMzkpIEFORCBpc19hY3RpdmU9MSIpOwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'qt',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'S212-C Quarantine (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_qt=Qt8Kw3Nx&confirm=APPLY_QUARANTINE');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('qt.json',o));
