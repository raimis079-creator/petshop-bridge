const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZWMnXSl8fCRfR0VUWydwc19lYyddIT09J0VjOEt3M054Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCgzMDApOyBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgncmVhZG9ubHknPT50cnVlKTsKCSRUPSRwZi4ncHNfZmVlZGluZ190YWJsZXMnOwoJLy8gZXNhbW9zIDIxOSAodGFibGVfa2V5IE5VTEwpOiBrb2tpYSBqdSBjaGVja3N1bSBmb3JtdWxlPwoJJHRhYnM9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsdGFibGVfa2V5LHZlcnNpb25fbm8sY2Fub25pY2FsX3RhYmxlX2hhc2gsY2hlY2tzdW0sYnJhbmQsbGluZSxzcGVjaWVzLHdlaWdodF9iYXNpcyxpbXBvcnRfYmF0Y2hfaWQKCQlGUk9NIHskVH0gV0hFUkUgY2Fub25pY2FsX2hhc2hfdmVyc2lvbj0nY2hhc2hfdjEnIEFORCAodGFibGVfa2V5IElTIE5VTEwgT1IgdGFibGVfa2V5PScnKSBMSU1JVCAyNTAiLCBBUlJBWV9BKTsKCSRvWydlc2FtdV9iZV9rZXknXT1jb3VudCgkdGFicyk7CgkvLyBiYW5kb20ga2VsaWFzIGZvcm11bGVzCgkkZj1hcnJheSgnY2hlY2tzdW09PWNhbm9uaWNhbCc9PjAsJ2hhc2goTlVMTHx2bm98Y2Fub24pJz0+MCwnaGFzaCh8dm5vfGNhbm9uKSc9PjAsJ2hhc2goaWR8dm5vfGNhbm9uKSc9PjAsJ2hhc2goY2Fub24pJz0+MCwnbmV6aW5vbWEnPT4wKTsKCSRwdno9YXJyYXkoKTsKCWZvcmVhY2goJHRhYnMgYXMgJHQpewoJCSRjaD0kdFsnY2Fub25pY2FsX3RhYmxlX2hhc2gnXTsgJHZubz0kdFsndmVyc2lvbl9ubyddOyAkY3M9JHRbJ2NoZWNrc3VtJ107CgkJaWYoJGNzPT09JGNoKSAkZlsnY2hlY2tzdW09PWNhbm9uaWNhbCddKys7CgkJZWxzZWlmKCRjcz09PWhhc2goJ3NoYTI1NicsJ3wnLiR2bm8uJ3wnLiRjaCkpICRmWydoYXNoKHx2bm98Y2Fub24pJ10rKzsKCQllbHNlaWYoJGNzPT09aGFzaCgnc2hhMjU2JywkdFsnaWQnXS4nfCcuJHZuby4nfCcuJGNoKSkgJGZbJ2hhc2goaWR8dm5vfGNhbm9uKSddKys7CgkJZWxzZWlmKCRjcz09PWhhc2goJ3NoYTI1NicsJGNoKSkgJGZbJ2hhc2goY2Fub24pJ10rKzsKCQllbHNlIHsgJGZbJ25lemlub21hJ10rKzsgaWYoY291bnQoJHB2eik8NSkgJHB2eltdPWFycmF5KCdpZCc9PiR0WydpZCddLCdjcyc9PnN1YnN0cigkY3MsMCwxNiksJ2Nhbm9uJz0+c3Vic3RyKCRjaCwwLDE2KSwnYmF0Y2gnPT4kdFsnaW1wb3J0X2JhdGNoX2lkJ10pOyB9Cgl9Cgkkb1snZm9ybXVsZSddPSRmOyAkb1snbmV6aW5vbWFfcHZ6J109JHB2ejsKCS8vIGdhbCBjaGVja3N1bSA9IHNvdXJjZV9oYXNoPyBhciBjaGVja3N1bSBzdXNpamVzIHN1IHNvdXJjZQoJJHNhbXBsZT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIGlkLGNoZWNrc3VtLHNvdXJjZV9oYXNoLGNhbm9uaWNhbF90YWJsZV9oYXNoIEZST00geyRUfSBXSEVSRSBjYW5vbmljYWxfaGFzaF92ZXJzaW9uPSdjaGFzaF92MScgQU5EICh0YWJsZV9rZXkgSVMgTlVMTCBPUiB0YWJsZV9rZXk9JycpIExJTUlUIDEiLCBBUlJBWV9BKTsKCSRvWydzYW1wbGUnXT1hcnJheSgnY2hlY2tzdW0nPT5zdWJzdHIoJHNhbXBsZVsnY2hlY2tzdW0nXSwwLDIwKSwnc291cmNlX2hhc2gnPT5zdWJzdHIoJHNhbXBsZVsnc291cmNlX2hhc2gnXSwwLDIwKSwnY2Fub25pY2FsJz0+c3Vic3RyKCRzYW1wbGVbJ2Nhbm9uaWNhbF90YWJsZV9oYXNoJ10sMCwyMCksCgkJJ2NoZWNrc3VtPT1zb3VyY2VfaGFzaD8nPT4oJHNhbXBsZVsnY2hlY2tzdW0nXT09PSRzYW1wbGVbJ3NvdXJjZV9oYXNoJ10pKTsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'ec',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'S212-C Exist Checksum (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_ec=Ec8Kw3Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('ec.json',o));
