const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfYTgnXSl8fCRfR0VUWydwc19hOCddIT09J0E4RncyWHI2Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCgzMDApOyBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCk7CgkkYz0oc3RyaW5nKWdldF9wb3N0X2ZpZWxkKCdwb3N0X2NvbnRlbnQnLDE5Nzc1KTsKCWlmKHByZWdfbWF0Y2hfYWxsKCcjPHRhYmxlLio/PC90YWJsZT4jaXMnLCRjLCRtKSl7CgkJJG9bJ24nXT1jb3VudCgkbVswXSk7CgkJZm9yZWFjaCgkbVswXSBhcyAkaT0+JHRiKXsKCQkJJHQ9cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLCR0Yik7CgkJCSRvWydyYXcnXVskaV09bWJfc3Vic3RyKCR0LDAsMzAwMCk7CgkJCS8vIHN0cnVrdHVyaXp1b3RhaQoJCQkkcm93cz1hcnJheSgpOwoJCQlpZihwcmVnX21hdGNoX2FsbCgnIzx0ci4qPzwvdHI+I2lzJywkdGIsJHJtKSl7CgkJCQlmb3JlYWNoKCRybVswXSBhcyAkdHIpewoJCQkJCSRjZWxscz1hcnJheSgpOwoJCQkJCWlmKHByZWdfbWF0Y2hfYWxsKCcjPHRbaGRdW14+XSo+KC4qPyk8L3RbaGRdPiNpcycsJHRyLCRjbSkpewoJCQkJCQlmb3JlYWNoKCRjbVsxXSBhcyAkY2MpeyAkY2VsbHNbXT10cmltKHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyxodG1sX2VudGl0eV9kZWNvZGUod3Bfc3RyaXBfYWxsX3RhZ3MoJGNjKSxFTlRfUVVPVEVTfEVOVF9IVE1MNSwnVVRGLTgnKSkpOyB9CgkJCQkJfQoJCQkJCWlmKCRjZWxscykgJHJvd3NbXT0kY2VsbHM7CgkJCQl9CgkJCX0KCQkJJG9bJ3BhcnNlZCddWyRpXT0kcm93czsKCQl9Cgl9IGVsc2UgeyAkb1snbiddPTA7IH0KCS8vIEp1bmlvciBwcm9kdWt0dSBiYXNlNjQgaW1nIC0gYXIgdGFpIGxlbnRlbGUKCSRjMj0oc3RyaW5nKWdldF9wb3N0X2ZpZWxkKCdwb3N0X2NvbnRlbnQnLDE5Nzg1KTsKCWlmKHByZWdfbWF0Y2hfYWxsKCcjPGltZ1tePl0rc3JjPSIoZGF0YTppbWFnZS9bXiJdezEwMCx9KSIjaScsJGMyLCRtMikpewoJCSRvWydqdW5pb3JfYjY0X2NvdW50J109Y291bnQoJG0yWzFdKTsKCQkkb1snanVuaW9yX2I2NF9zaXplcyddPWFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIHN0cmxlbigkeCk7fSwkbTJbMV0pOwoJfQoJaWYocHJlZ19tYXRjaF9hbGwoJyM8aW1nW14+XStzcmM9IihodHRwcz86Ly9bXiJdKykiI2knLCRjMiwkbTMpKXsKCQkkb1snanVuaW9yX2h0dHBfaW1ncyddPWFycmF5X3NsaWNlKCRtM1sxXSwwLDgpOwoJfQoJLy8gdmlzYXMganVuaW9yIHRla3N0YXMgYmUgdGFndSwgaWVza29tIHNrYWljaXUgc3UgZwoJJHR4dD1wcmVnX3JlcGxhY2UoJy9ccysvJywnICcsaHRtbF9lbnRpdHlfZGVjb2RlKHdwX3N0cmlwX2FsbF90YWdzKCRjMiksRU5UX1FVT1RFU3xFTlRfSFRNTDUsJ1VURi04JykpOwoJJG9bJ2p1bmlvcl90eHRfbGVuJ109bWJfc3RybGVuKCR0eHQpOwoJJGk9bWJfc3RyaXBvcygkdHh0LCdrZycpOwoJJG9bJ2p1bmlvcl90eHQnXT1tYl9zdWJzdHIoJHR4dCxtYXgoMCwkaS0zMDApLDEyMDApOwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'a8',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'S212-B Ambrosia Table Dump v1 (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_a8=A8Fw2Xr6');
  if(r.trim().startsWith('{')){ try{o.d=JSON.parse(r);}catch(e){o.perr=e.message.slice(0,90);} } else o.raw=r.slice(0,250);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('a8.json',o));
