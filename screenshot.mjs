const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfYmEnXSl8fCRfR0VUWydwc19iYSddIT09J0JhOEt3M054Jyl7cmV0dXJuO30KCWdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCdyZWFkb25seSc9PnRydWUpOwoJJFQ9JHBmLidwc19mZWVkaW5nX3RhYmxlcyc7ICRSPSRwZi4ncHNfZmVlZGluZ19yb3dzJzsgJE09JHBmLidwc19mZWVkaW5nX21hcCc7Cgkkb1sncG8nXT1hcnJheSgKCQkndGFibGVzX2NvdW50Jz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRUfSIpLAoJCSdyb3dzX2NvdW50Jz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRSfSIpLAoJCSdtYXBfY291bnQnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JE19IiksCgkJJ3RhYmxlc19oYXNoJz0+c3Vic3RyKCR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgU0hBMihHUk9VUF9DT05DQVQoQ09OQ0FUKGlkLCc6JyxJRk5VTEwoY2Fub25pY2FsX3RhYmxlX2hhc2gsJ04nKSwnOicsc3RhdHVzLCc6Jyxpc19hY3RpdmUpIE9SREVSIEJZIGlkIFNFUEFSQVRPUiAnfCcpLDI1NikgRlJPTSB7JFR9IiksMCwzMiksCgkJJ21hcF9oYXNoJz0+c3Vic3RyKCR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgU0hBMihHUk9VUF9DT05DQVQoQ09OQ0FUKGZlZWRpbmdfdGFibGVfaWQsJzonLHByb2R1Y3RfaWQsJzonLGlzX2FjdGl2ZSkgT1JERVIgQlkgZmVlZGluZ190YWJsZV9pZCxwcm9kdWN0X2lkIFNFUEFSQVRPUiAnfCcpLDI1NikgRlJPTSB7JE19IiksMCwzMiksCgkpOwoJLy8gUEhQIHdhcm5pbmdzIGNoZWNrOiBwdXNsYXBpbyBIVE1MIHN2YXJ1bWFzIGphdSBtYXR5dGFzIHNjcmVlbnNob3QnZTsgY2lhIHRpayBlcnJvcl9sb2cgcGFza3V0aW5pYWkKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'ba',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'M-CALC Baseline After (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_ba=Ba8Kw3Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('ba.json',o));
