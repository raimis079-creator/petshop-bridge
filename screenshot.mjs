const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfc3AnXSl8fCRfR0VUWydwc19zcCddIT09J1NwOVF6NE10Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCg0MDApOyBAaW5pX3NldCgnbWVtb3J5X2xpbWl0JywnMTAyNE0nKTsKCWdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7CgkkdHg9YXJyYXkoJ3BhX2d5dnVub19ydXNpcycsJ3BhX2JlX2dydWR1JywncGFfc3BlY2lhbGlfbWl0eWJhJyk7Cglmb3JlYWNoKCR0eCBhcyAkdCl7CgkJJHRlcm1zPWdldF90ZXJtcyhhcnJheSgndGF4b25vbXknPT4kdCwnaGlkZV9lbXB0eSc9PmZhbHNlKSk7CgkJJG9bJ3RheCddWyR0XT1pc193cF9lcnJvcigkdGVybXMpPygnRVJSOiAnLiR0ZXJtcy0+Z2V0X2Vycm9yX21lc3NhZ2UoKSkKCQkJOmFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIGFycmF5KCdpZCc9PiR4LT50ZXJtX2lkLCduYW1lJz0+JHgtPm5hbWUsJ3NsdWcnPT4keC0+c2x1ZywnY291bnQnPT4oaW50KSR4LT5jb3VudCk7fSwkdGVybXMpOwoJfQoJJGlkcz1nZXRfcG9zdHMoYXJyYXkoJ3Bvc3RfdHlwZSc9Pidwcm9kdWN0JywncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcsJ3Bvc3RzX3Blcl9wYWdlJz0+LTEsJ2ZpZWxkcyc9PidpZHMnKSk7CgkkbWFwPWFycmF5KCk7Cglmb3JlYWNoKCRpZHMgYXMgJHBpZCl7CgkJJHM9d3BfZ2V0X29iamVjdF90ZXJtcygkcGlkLCdwYV9neXZ1bm9fcnVzaXMnLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSk7CgkJaWYoaXNfd3BfZXJyb3IoJHMpKSAkcz1hcnJheSgpOwoJCSRtYXBbJHBpZF09JHM7Cgl9Cgkkb1snc3BlY2llc19tYXAnXT0kbWFwOwoJJG9bJ24nXT1jb3VudCgkbWFwKTsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'sp',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 400 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'Species Map Recon v1 (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{id=JSON.parse(mk).id;}catch(e){o.mk=mk.slice(0,200);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_sp=Sp9Qz4Mt');
  if(r.trim().startsWith('{')){ try{o.d=JSON.parse(r);}catch(e){o.perr=e.message.slice(0,80);} } else o.raw=r.slice(0,200);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('sp.json',o));
