const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfd3MnXSl8fCRfR0VUWydwc193cyddIT09J1dzNEt3OE54Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCgzMDApOyBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgncmVhZG9ubHknPT50cnVlKTsKCSRvWyd3ZWlnaHRfc291cmNlX3JlaWtzbWVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbWV0YV92YWx1ZSB2YWwsIENPVU5UKCopIG4gRlJPTSB7JHBmfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfd2VpZ2h0X3NvdXJjZScgR1JPVVAgQlkgbWV0YV92YWx1ZSBPUkRFUiBCWSBuIERFU0MiLCBBUlJBWV9BKTsKCS8vIF96Yl93ZWlnaHQgZm9ybWF0byBwYXZ5emR6aWFpCgkkb1snemJfd2VpZ2h0X3B2eiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG1ldGFfdmFsdWUgdmFsLCBDT1VOVCgqKSBuIEZST00geyRwZn1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3piX3dlaWdodCcgQU5EIG1ldGFfdmFsdWU8PicnIEdST1VQIEJZIG1ldGFfdmFsdWUgT1JERVIgQlkgbiBERVNDIExJTUlUIDEyIiwgQVJSQVlfQSk7Cgkkb1snbGVnYWN5X3dlaWdodF9yYXdfcHZ6J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbWV0YV92YWx1ZSB2YWwsIENPVU5UKCopIG4gRlJPTSB7JHBmfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfbGVnYWN5X3dlaWdodF9yYXcnIEFORCBtZXRhX3ZhbHVlPD4nJyBHUk9VUCBCWSBtZXRhX3ZhbHVlIE9SREVSIEJZIG4gREVTQyBMSU1JVCAxMiIsIEFSUkFZX0EpOwoJJG9bJ3dlaWdodF9ub3JtYWxpemVkX3B2eiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG1ldGFfdmFsdWUgdmFsLCBDT1VOVCgqKSBuIEZST00geyRwZn1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3dlaWdodF9ub3JtYWxpemVkJyBBTkQgbWV0YV92YWx1ZTw+JycgR1JPVVAgQlkgbWV0YV92YWx1ZSBPUkRFUiBCWSBuIERFU0MgTElNSVQgOCIsIEFSUkFZX0EpOwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'ws',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'S212-C Weight Source (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_ws=Ws4Kw8Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('ws.json',o));
