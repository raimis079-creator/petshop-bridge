const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcGsnXSl8fCRfR0VUWydwc19wayddIT09J1BrN1Z3M054Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCg0MDApOyBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgncmVhZG9ubHknPT50cnVlKTsKCgkvLyB2aXNvcyBwYV9wYWt1b3Rlc19keWRpcyB0ZXJtIHJlaWvFoW3El3MgKyBraWVrIHByb2R1a3TFswoJJHRlcm1zPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHQudGVybV9pZCwgdC5uYW1lLCB0LnNsdWcsIENPVU5UKHRyLm9iamVjdF9pZCkgbgoJCUZST00geyRwZn10ZXJtcyB0CgkJSk9JTiB7JHBmfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV9pZD10LnRlcm1faWQgQU5EIHR0LnRheG9ub215PSdwYV9wYWt1b3Rlc19keWRpcycKCQlMRUZUIEpPSU4geyRwZn10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgT04gdHIudGVybV90YXhvbm9teV9pZD10dC50ZXJtX3RheG9ub215X2lkCgkJR1JPVVAgQlkgdC50ZXJtX2lkIE9SREVSIEJZIHQubmFtZSIsIEFSUkFZX0EpOwoJJG9bJ3Zpc29fdGVybWludSddPWNvdW50KCR0ZXJtcyk7Cgkkb1sndGVybWluYWknXT1hcnJheV9tYXAoZnVuY3Rpb24oJHQpeyByZXR1cm4gYXJyYXkoJ25hbWUnPT4kdFsnbmFtZSddLCdzbHVnJz0+JHRbJ3NsdWcnXSwnbic9PihpbnQpJHRbJ24nXSk7IH0sJHRlcm1zKTsKCgkvLyBhciB5cmEgUzIxMi1BIG5vcm1hbGl6dW90byBwYWt1b3TEl3MgZHlkxb5pbyBtZXRhPyB0aWtyaW5hbSBrZWxpcyB2YXJpYW50dXMKCSRtZXRhX2tleXM9YXJyYXkoJ19wc19zZWxsYWJsZV9mb29kX2cnLCdfc2VsbGFibGVfdW5pdF9mb29kX2cnLCdfcHNfcGFja2FnZV9nJywnX3BhY2thZ2VfZm9vZF9nJywnX3BzX3BrZ19zdGF0dXMnKTsKCSRvWydtZXRhX2VnemlzdHVvamEnXT1hcnJheSgpOwoJZm9yZWFjaCgkbWV0YV9rZXlzIGFzICRtayl7CgkJJGM9KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyRwZn1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0lcyIsJG1rKSk7CgkJaWYoJGM+MCkgJG9bJ21ldGFfZWd6aXN0dW9qYSddWyRta109JGM7Cgl9CgkvLyBwYXZ5emR6aWFpIHJlaWtzbWl1IGplaSB5cmEKCWlmKCFlbXB0eSgkb1snbWV0YV9lZ3ppc3R1b2phJ10pKXsKCQkkbWs9YXJyYXlfa2V5X2ZpcnN0KCRvWydtZXRhX2VnemlzdHVvamEnXSk7CgkJJG9bJ21ldGFfcGF2eXpkemlhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG1ldGFfdmFsdWUsIENPVU5UKCopIG4gRlJPTSB7JHBmfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSVzIEdST1VQIEJZIG1ldGFfdmFsdWUgT1JERVIgQlkgbiBERVNDIExJTUlUIDIwIiwkbWspLCBBUlJBWV9BKTsKCX0KCgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pk',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'S212-C Package Data (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_pk=Pk7Vw3Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('pk.json',o));
