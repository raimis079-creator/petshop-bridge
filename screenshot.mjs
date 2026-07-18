const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcnYnXSl8fCRfR0VUWydwc19ydiddIT09J1J2Nkt3OE54Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCgzMDApOyBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgncmVhZG9ubHknPT50cnVlKTsKCS8vIDEzIG5lZWRzX21hbnVhbF9yZXZpZXcgcHJvZHVrdHUgc3UganUgcGFfcGFrdW90ZXNfZHlkaXMgdGVybWludQoJJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5JRCwgc2subWV0YV92YWx1ZSBza3UsIHQubmFtZSB0ZXJtX3ZhbHVlLCBzdC5tZXRhX3ZhbHVlIHN0YXR1cwoJCUZST00geyRwZn1wb3N0bWV0YSBzdAoJCUpPSU4geyRwZn1wb3N0cyBwIE9OIHAuSUQ9c3QucG9zdF9pZAoJCUxFRlQgSk9JTiB7JHBmfXBvc3RtZXRhIHNrIE9OIHNrLnBvc3RfaWQ9cC5JRCBBTkQgc2subWV0YV9rZXk9J19za3UnCgkJTEVGVCBKT0lOIHskcGZ9dGVybV9yZWxhdGlvbnNoaXBzIHRyIE9OIHRyLm9iamVjdF9pZD1wLklECgkJTEVGVCBKT0lOIHskcGZ9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgQU5EIHR0LnRheG9ub215PSdwYV9wYWt1b3Rlc19keWRpcycKCQlMRUZUIEpPSU4geyRwZn10ZXJtcyB0IE9OIHQudGVybV9pZD10dC50ZXJtX2lkCgkJV0hFUkUgc3QubWV0YV9rZXk9J19wZXRzaG9wX3BrZ19hc3NpZ25tZW50X3N0YXR1cycgQU5EIHN0Lm1ldGFfdmFsdWU9J25lZWRzX21hbnVhbF9yZXZpZXcnIiwgQVJSQVlfQSk7Cgkkb1sncmV2aWV3X3Byb2R1a3RhaSddPWFycmF5X21hcChmdW5jdGlvbigkcil7CgkJcmV0dXJuIGFycmF5KCdza3UnPT4kclsnc2t1J10sJ3Rlcm1fdmFsdWUnPT4kclsndGVybV92YWx1ZSddLCdzdGF0dXMnPT4kclsnc3RhdHVzJ10pOwoJfSwkcm93cyk7CgkvLyBrZWxpIGZpeGVkIHBhdnl6ZHppYWkgKHJlc29sdmVkIGF0dmVqYWkpIHBhbHlnaW5pbXVpCgkkZml4ZWQ9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc2subWV0YV92YWx1ZSBza3UsIHQubmFtZSB0ZXJtX3ZhbHVlLCBzdC5tZXRhX3ZhbHVlIHN0YXR1cwoJCUZST00geyRwZn1wb3N0bWV0YSBzdAoJCUpPSU4geyRwZn1wb3N0cyBwIE9OIHAuSUQ9c3QucG9zdF9pZAoJCUxFRlQgSk9JTiB7JHBmfXBvc3RtZXRhIHNrIE9OIHNrLnBvc3RfaWQ9cC5JRCBBTkQgc2subWV0YV9rZXk9J19za3UnCgkJTEVGVCBKT0lOIHskcGZ9dGVybV9yZWxhdGlvbnNoaXBzIHRyIE9OIHRyLm9iamVjdF9pZD1wLklECgkJTEVGVCBKT0lOIHskcGZ9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgQU5EIHR0LnRheG9ub215PSdwYV9wYWt1b3Rlc19keWRpcycKCQlMRUZUIEpPSU4geyRwZn10ZXJtcyB0IE9OIHQudGVybV9pZD10dC50ZXJtX2lkCgkJV0hFUkUgc3QubWV0YV9rZXk9J19wZXRzaG9wX3BrZ19hc3NpZ25tZW50X3N0YXR1cycgQU5EIHN0Lm1ldGFfdmFsdWU9J2ZpeGVkJyBMSU1JVCA1IiwgQVJSQVlfQSk7Cgkkb1snZml4ZWRfcGF2eXpkemlhaSddPSRmaXhlZDsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'rv',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'S212-C Review Fixture (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_rv=Rv6Kw8Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('rv.json',o));
