const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfY3MnXSl8fCRfR0VUWydwc19jcyddIT09J0NzOUt3M054Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCgyMDApOyBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgncmVhZG9ubHknPT50cnVlKTsKCSRUPSRwZi4ncHNfZmVlZGluZ190YWJsZXMnOyAkUj0kcGYuJ3BzX2ZlZWRpbmdfcm93cyc7ICRNPSRwZi4ncHNfZmVlZGluZ19tYXAnOwoKCS8vIGFyIHN1a3VydGEga2FzIG5vcnMgc3UgczIxMmM/Cgkkb1snczIxMmNfdGFibGVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbGluZSxjYW5vbmljYWxfaGFzaF92ZXJzaW9uIEZST00geyRUfSBXSEVSRSBjYW5vbmljYWxfaGFzaF92ZXJzaW9uPSdjaGFzaF9zMjEyY18yMDI2LTA3LTE4JyIsIEFSUkFZX0EpOwoJJG9bJ29ycGhhbl9yb3dzX3RpZDAnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFJ9IFdIRVJFIGZlZWRpbmdfdGFibGVfaWQ9MCIpOwoJJG9bJ29ycGhhbl9tYXBfdGlkMCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskTX0gV0hFUkUgZmVlZGluZ190YWJsZV9pZD0wIik7Cgkkb1snZXhjbF8yMDI2X3RhYmxlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLGxpbmUgRlJPTSB7JFR9IFdIRVJFIHNvdXJjZV92ZXJzaW9uPSdleGNsdXNpb25fcG9zdF9jb250ZW50XzIwMjYtMDctMTgnIiwgQVJSQVlfQSk7CgoJLy8gTk9UIE5VTEwgc3R1bHBlbGlhaSBiZSBkZWZhdWx0IChrYWQgc3VwcmFzdHVtZSBpbnNlcnQgZmFpbCkKCSRjb2xzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0hPVyBDT0xVTU5TIEZST00geyRUfSIsIEFSUkFZX0EpOwoJJHJlcXVpcmVkPWFycmF5KCk7Cglmb3JlYWNoKCRjb2xzIGFzICRjKXsgaWYoJGNbJ051bGwnXT09PSdOTycgJiYgJGNbJ0RlZmF1bHQnXT09PW51bGwgJiYgJGNbJ0V4dHJhJ10hPT0nYXV0b19pbmNyZW1lbnQnKSAkcmVxdWlyZWRbXT0kY1snRmllbGQnXTsgfQoJJG9bJ3JlcXVpcmVkX25vX2RlZmF1bHQnXT0kcmVxdWlyZWQ7CgoJLy8gcGFza3V0aW5lIGtsYWlkYSBuZWdhbGltIGdhdXQsIGJldCBwYXJvZG9tIGFyIElOUE0xMSB0dXJpIG1hcHBpbmcgZGFiYXIKCWZvcmVhY2goYXJyYXkoJ0lOUE0xMScsJ0lOUFMwNicsJ0hIRk0xMScpIGFzICRza3UpewoJCSRwaWQ9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X2lkIEZST00geyRwZn1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3NrdScgQU5EIG1ldGFfdmFsdWU9JXMiLCRza3UpKTsKCQkkb1snbWFwcGluZ18nLiRza3VdPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskTX0gV0hFUkUgcHJvZHVjdF9pZD0lZCBBTkQgaXNfYWN0aXZlPTEiLCRwaWQpKTsKCX0KCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'cs',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'S212-C Check State (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_cs=Cs9Kw3Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('cs.json',o));
