const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcHMnXSl8fCRfR0VUWydwc19wcyddIT09J1BzOUt3NFZuJyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCg0MDApOyBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgncmVhZG9ubHknPT50cnVlKTsKCgkvLyBWSVNJIG1ldGEgcmFrdGFpIHN1ICdwYWt1b3QnLCdwa2cnLCdwYWNrYWdlJywnZm9vZF9nJywnc2VsbGFibGUnLCdib251cycsJ211bHRpcGFjaycKCSRrZXlzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG1ldGFfa2V5LCBDT1VOVCgqKSBuIEZST00geyRwZn1wb3N0bWV0YQoJCVdIRVJFIG1ldGFfa2V5IExJS0UgJyVwa2clJyBPUiBtZXRhX2tleSBMSUtFICclcGFja2FnZSUnIE9SIG1ldGFfa2V5IExJS0UgJyVwYWt1b3QlJwoJCU9SIG1ldGFfa2V5IExJS0UgJyVmb29kX2clJyBPUiBtZXRhX2tleSBMSUtFICclc2VsbGFibGUlJyBPUiBtZXRhX2tleSBMSUtFICclYm9udXMlJwoJCU9SIG1ldGFfa2V5IExJS0UgJyVtdWx0aXBhY2slJyBPUiBtZXRhX2tleSBMSUtFICclX3BzXyUnCgkJR1JPVVAgQlkgbWV0YV9rZXkgT1JERVIgQlkgbiBERVNDIExJTUlUIDYwIiwgQVJSQVlfQSk7Cgkkb1sncHNfbWV0YV9yYWt0YWknXT0ka2V5czsKCgkvLyBTMjEyLUEgZG9rdW1lbnRhaSAtIGFyIFNUQVRFIGFyIGt1ciBtaW5ldGEgNiBib251cyArIDEgbXVsdGlwYWNrCgkvLyB0aWtyaW5hbSBhciB5cmEga29raWEgcGFrdW90ZXMgbm9ybWFsaXphdmltbyBsZW50ZWxlCgkkdGFibGVzPSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICd7JHBmfXBzXyUnIik7Cgkkb1sncHNfbGVudGVsZXMnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHQpIHVzZSAoJHBmKXsgcmV0dXJuIHN0cl9yZXBsYWNlKCRwZiwnJywkdCk7IH0sJHRhYmxlcyk7CgoJLy8gYm9udXMvbXVsdGlwYWNrIHByb2R1a3R1IHBhaWVza2EgcGF2YWRpbmltZSAoVElLIGRpYWdub3N0aWthaSwgbmUgcnVudGltZSkKCSRib251cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELCBwbS5tZXRhX3ZhbHVlIHNrdSwgcC5wb3N0X3RpdGxlIEZST00geyRwZn1wb3N0cyBwCgkJTEVGVCBKT0lOIHskcGZ9cG9zdG1ldGEgcG0gT04gcG0ucG9zdF9pZD1wLklEIEFORCBwbS5tZXRhX2tleT0nX3NrdScKCQlXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnCgkJQU5EIChwLnBvc3RfdGl0bGUgTElLRSAnJSsla2clJyBPUiBwLnBvc3RfdGl0bGUgTElLRSAnJXggJWtnJScgT1IgcC5wb3N0X3RpdGxlIExJS0UgJyXDlyUnCgkJICAgICBPUiBwLnBvc3RfdGl0bGUgTElLRSAnJWJvbnVzJScgT1IgcC5wb3N0X3RpdGxlIFJFR0VYUCAnWzAtOV0rWyBdKlt4WMOXXVsgXSpbMC05XSsnKQoJCUxJTUlUIDIwIiwgQVJSQVlfQSk7Cgkkb1snYm9udXNfbXVsdGlwYWNrX3BhdmFkaW5pbWUnXT1hcnJheV9tYXAoZnVuY3Rpb24oJGIpewoJCXJldHVybiBhcnJheSgnaWQnPT4oaW50KSRiWydJRCddLCdza3UnPT4kYlsnc2t1J10sJ3RpdGxlJz0+bWJfc3Vic3RyKGh0bWxfZW50aXR5X2RlY29kZSgkYlsncG9zdF90aXRsZSddKSwwLDU1KSk7Cgl9LCRib251cyk7Cgkkb1snYm9udXNfbXVsdGlwYWNrX24nXT1jb3VudCgkYm9udXMpOwoKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'ps',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'S212-C Package State (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_ps=Ps9Kw4Vn');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('ps.json',o));
