const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfbXInXSl8fCRfR0VUWydwc19tciddIT09J01yN0t3M054Jyl7cmV0dXJuO30KCWdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCdyZWFkb25seSc9PnRydWUpOwoJJE09JHBmLidwc19mZWVkaW5nX21hcCc7ICRUPSRwZi4ncHNfZmVlZGluZ190YWJsZXMnOwoJJG9bJ21hcF9zY2hlbWEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNIT1cgQ09MVU1OUyBGUk9NIHskTX0iLCBBUlJBWV9BKTsKCSRvWydtYXBfaW5kZXhlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0hPVyBJTkRFWCBGUk9NIHskTX0iLCBBUlJBWV9BKTsKCSRvWyd0YWJsZXNfaW5kZXhlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0hPVyBJTkRFWCBGUk9NIHskVH0gV0hFUkUgS2V5X25hbWUgTElLRSAnJWtleSUnIE9SIEtleV9uYW1lIExJS0UgJyV2ZXJzaW9uJScgT1IgTm9uX3VuaXF1ZT0wIiwgQVJSQVlfQSk7CgkvLyByZWFsdXMgcHZ6OiBhciBwcm9kdWt0YXMgZ2FsaSB0dXJldGkga2VsaXMgbWFwcGluZ3VzPyBraWVrIHByb2R1a3R1IHR1cmkgPjEgbWFwcGluZwoJJG9bJ3Byb2R1a3R1X3N1X2tlbGlhaXNfbWFwJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcHJvZHVjdF9pZCwgQ09VTlQoKikgbiBGUk9NIHskTX0gR1JPVVAgQlkgcHJvZHVjdF9pZCBIQVZJTkcgbj4xIExJTUlUIDUiLCBBUlJBWV9BKTsKCS8vIGthaXAgdmVyc2lqb3Mgc3VzaWV0b3M6IHRhYmxlX2tleSArIHZlcnNpb25fbm8gcHZ6Cgkkb1sndmVyc2lqdV9wdnonXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0YWJsZV9rZXksIENPVU5UKCopIG4sIEdST1VQX0NPTkNBVCh2ZXJzaW9uX25vKSB2ZXJzaWpvcywgR1JPVVBfQ09OQ0FUKHN0YXR1cykgc3RhdHVzYWkgRlJPTSB7JFR9IFdIRVJFIHRhYmxlX2tleSBJUyBOT1QgTlVMTCBHUk9VUCBCWSB0YWJsZV9rZXkgSEFWSU5HIG4+MSBMSU1JVCA1IiwgQVJSQVlfQSk7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'mr',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'S212-C Map Recon (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_mr=Mr7Kw3Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('mr.json',o));
