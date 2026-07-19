const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZjByJ10pfHwkX0dFVFsncHNfZjByJ10hPT0nRjByS3c4TngnKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDMwMCk7IGdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCdyZWFkb25seSc9PnRydWUpOwoJLy8gZGVzY2VuZGFudHMgNzIgaXIgODEgYXRza2lyYWkKCSRkb2c9YXJyYXkoNzIpOyAkY2g9Z2V0X3Rlcm1fY2hpbGRyZW4oNzIsJ3Byb2R1Y3RfY2F0Jyk7IGlmKCFpc193cF9lcnJvcigkY2gpKSAkZG9nPWFycmF5X21lcmdlKCRkb2csYXJyYXlfbWFwKCdpbnR2YWwnLCRjaCkpOwoJJGNhdD1hcnJheSg4MSk7ICRjaDI9Z2V0X3Rlcm1fY2hpbGRyZW4oODEsJ3Byb2R1Y3RfY2F0Jyk7IGlmKCFpc193cF9lcnJvcigkY2gyKSkgJGNhdD1hcnJheV9tZXJnZSgkY2F0LGFycmF5X21hcCgnaW50dmFsJywkY2gyKSk7CgkkZG9nPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJGRvZykpOyAkY2F0PWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJGNhdCkpOwoJJG9bJ2RvZ190cmVlJ109JGRvZzsgJG9bJ2NhdF90cmVlJ109JGNhdDsKCSRvWydkb2dfdHJlZV9uJ109Y291bnQoJGRvZyk7ICRvWydjYXRfdHJlZV9uJ109Y291bnQoJGNhdCk7CgkkYWxsPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoYXJyYXlfbWVyZ2UoJGRvZywkY2F0KSkpOwoJJGluPWltcGxvZGUoJywnLGFycmF5X21hcCgnaW50dmFsJywkYWxsKSk7CgkvLyBwYXJlbnQgcHJvZHVjdHMgcHVibGlzaCBzaW9qZSBhcGltdHlqZQoJJG9bJ3BhcmVudF9wcm9kdWN0c19wdWJsaXNoJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIHAuSUQpIEZST00geyRwZn1wb3N0cyBwCgkJSk9JTiB7JHBmfXRlcm1fcmVsYXRpb25zaGlwcyB0ciBPTiB0ci5vYmplY3RfaWQ9cC5JRAoJCUpPSU4geyRwZn10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZAoJCVdIRVJFIHR0LnRheG9ub215PSdwcm9kdWN0X2NhdCcgQU5EIHR0LnRlcm1faWQgSU4gKCRpbikKCQlBTkQgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIpOwoJLy8gdmFyaWFjaWpvcyAoY2hpbGQgcG9zdHMga3VyaXUgcGFyZW50YWkgeXJhIHNpZSBwcm9kdWt0YWkpIC0gYXRza2lyYXMgc2thaWNpdXMKCSRvWyd2YXJpYXRpb25zX24nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXBvc3RzIHYKCQlXSEVSRSB2LnBvc3RfdHlwZT0ncHJvZHVjdF92YXJpYXRpb24nIEFORCB2LnBvc3RfcGFyZW50IElOICgKCQkJU0VMRUNUIERJU1RJTkNUIHAuSUQgRlJPTSB7JHBmfXBvc3RzIHAKCQkJSk9JTiB7JHBmfXRlcm1fcmVsYXRpb25zaGlwcyB0ciBPTiB0ci5vYmplY3RfaWQ9cC5JRAoJCQlKT0lOIHskcGZ9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQKCQkJV0hFUkUgdHQudGF4b25vbXk9J3Byb2R1Y3RfY2F0JyBBTkQgdHQudGVybV9pZCBJTiAoJGluKQoJCQlBTkQgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJykiKTsKCS8vIHBpbG5pIGJhc2VsaW5lIGhhc2ggKDY0IHNpbWJvbGlhaSkKCSRUPSRwZi4ncHNfZmVlZGluZ190YWJsZXMnOyAkUj0kcGYuJ3BzX2ZlZWRpbmdfcm93cyc7ICRNPSRwZi4ncHNfZmVlZGluZ19tYXAnOwoJJG9bJ2Jhc2VsaW5lJ109YXJyYXkoCgkJJ3RhYmxlc19jb3VudCc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskVH0iKSwKCQkncm93c19jb3VudCc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUn0iKSwKCQknbWFwX2NvdW50Jz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRNfSIpLAoJKTsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'f0r',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'F0 Recon (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_f0r=F0rKw8Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('f0r.json',o));
