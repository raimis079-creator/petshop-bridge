const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcG0nXSl8fCRfR0VUWydwc19wbSddIT09J1BtM053OUt4Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCg0MDApOyBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgncmVhZG9ubHknPT50cnVlKTsKCgkvLyBhc3NpZ25tZW50X3N0YXR1cyByZWlrxaFtxJdzCgkkb1snYXNzaWdubWVudF9zdGF0dXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX3ZhbHVlIHZhbCwgQ09VTlQoKikgbiBGUk9NIHskcGZ9cG9zdG1ldGEKCQlXSEVSRSBtZXRhX2tleT0nX3BldHNob3BfcGtnX2Fzc2lnbm1lbnRfc3RhdHVzJyBHUk9VUCBCWSBtZXRhX3ZhbHVlIE9SREVSIEJZIG4gREVTQyIsIEFSUkFZX0EpOwoJLy8gcmV2aWV3X3JlYXNvbiByZWlrxaFtxJdzICgxMykKCSRvWydyZXZpZXdfcmVhc29uJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5wb3N0X3RpdGxlLCBwbS5tZXRhX3ZhbHVlIHJlYXNvbiwgc2subWV0YV92YWx1ZSBza3UKCQlGUk9NIHskcGZ9cG9zdG1ldGEgcG0KCQlKT0lOIHskcGZ9cG9zdHMgcCBPTiBwLklEPXBtLnBvc3RfaWQKCQlMRUZUIEpPSU4geyRwZn1wb3N0bWV0YSBzayBPTiBzay5wb3N0X2lkPXAuSUQgQU5EIHNrLm1ldGFfa2V5PSdfc2t1JwoJCVdIRVJFIHBtLm1ldGFfa2V5PSdfcGV0c2hvcF9wa2dfcmV2aWV3X3JlYXNvbiciLCBBUlJBWV9BKTsKCgkvLyBmaXggcGF2eXpkxb5pYWkgKGZyb20tPnRvKSAtIGthaXAgUzIxMi1BIHRhaXPElyB0ZXJtaW51cwoJJG9bJ2ZpeF9wYXZ5emR6aWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QKCQlmZi5tZXRhX3ZhbHVlIGZpeF9mcm9tLCBmdC5tZXRhX3ZhbHVlIGZpeF90bywgc2subWV0YV92YWx1ZSBza3UKCQlGUk9NIHskcGZ9cG9zdG1ldGEgZmYKCQlKT0lOIHskcGZ9cG9zdG1ldGEgZnQgT04gZnQucG9zdF9pZD1mZi5wb3N0X2lkIEFORCBmdC5tZXRhX2tleT0nX3BldHNob3BfcGtnX2ZpeF90bycKCQlMRUZUIEpPSU4geyRwZn1wb3N0bWV0YSBzayBPTiBzay5wb3N0X2lkPWZmLnBvc3RfaWQgQU5EIHNrLm1ldGFfa2V5PSdfc2t1JwoJCVdIRVJFIGZmLm1ldGFfa2V5PSdfcGV0c2hvcF9wa2dfZml4X2Zyb20nIExJTUlUIDE1IiwgQVJSQVlfQSk7CgoJLy8gYXIgeXJhIGt1ciBsYWlrb21hIHNlbGxhYmxlIGZvb2QgZyByZWlrc21lIChib251cy9tdWx0aXBhY2sgaXNzcHJlc3RhKQoJLy8gdGlrcmluYW0gYXIgYXNzaWdubWVudF9zdGF0dXMgdHVyaSAnYm9udXMnIGFyICdtdWx0aXBhY2snIHJlaWtzbWl1Cgkkb1snc3RhdHVzX3N1X2JvbnVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5wb3N0X3RpdGxlLCBwbS5tZXRhX3ZhbHVlIHN0YXR1cywgc2subWV0YV92YWx1ZSBza3UKCQlGUk9NIHskcGZ9cG9zdG1ldGEgcG0KCQlKT0lOIHskcGZ9cG9zdHMgcCBPTiBwLklEPXBtLnBvc3RfaWQKCQlMRUZUIEpPSU4geyRwZn1wb3N0bWV0YSBzayBPTiBzay5wb3N0X2lkPXAuSUQgQU5EIHNrLm1ldGFfa2V5PSdfc2t1JwoJCVdIRVJFIHBtLm1ldGFfa2V5PSdfcGV0c2hvcF9wa2dfYXNzaWdubWVudF9zdGF0dXMnCgkJQU5EIChwbS5tZXRhX3ZhbHVlIExJS0UgJyVib251cyUnIE9SIHBtLm1ldGFfdmFsdWUgTElLRSAnJW11bHRpJScgT1IgcG0ubWV0YV92YWx1ZSBMSUtFICclcGFjayUnKSIsIEFSUkFZX0EpOwoKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pm',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'S212-C Package Meta (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_pm=Pm3Nw9Kx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('pm.json',o));
