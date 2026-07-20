const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfc2VtJ10pfHwkX0dFVFsncHNfc2VtJ10hPT0nU2VtS3c4TngnKXtyZXR1cm47fQoJJG89YXJyYXkoJ3JlYWRvbmx5Jz0+dHJ1ZSk7CgkkZGlyPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMnOwoJLy8gcmVmaWxsLWVuZ2luZSBwcmltYXJ5X3Byb2R1Y3QgcGFuYXVkb2ppbWFzCgkkcmU9QGZpbGVfZ2V0X2NvbnRlbnRzKCRkaXIuJy9jbGFzcy1yZWZpbGwtZW5naW5lLnBocCcpOwoJJG9bJ3JlZmlsbF9ieXRlcyddPXN0cmxlbigkcmUpOwoJJHJsaW5lcz1hcnJheSgpOwoJZm9yZWFjaChleHBsb2RlKCJcbiIsJHJlKSBhcyAkbj0+JGwpeyBpZihzdHJpcG9zKCRsLCdwcmltYXJ5X3Byb2R1Y3QnKSE9PWZhbHNlIHx8IHN0cmlwb3MoJGwsJ2N1cnJlbnRfZm9vZCcpIT09ZmFsc2UpeyAkcmxpbmVzW109KCRuKzEpLic6ICcudHJpbShzdWJzdHIoJGwsMCwxNTApKTsgfSB9Cgkkb1sncmVmaWxsX3ByaW1hcnlfcHJvZHVjdCddPSRybGluZXM7CgkvLyBwZXQtcHJvZmlsZSBzYXZlL3JlYWQgbG9naWthICgyNTAtNDIwKQoJJHBwPUBmaWxlX2dldF9jb250ZW50cygkZGlyLicvY2xhc3MtcGV0LXByb2ZpbGUucGhwJyk7CgkkcHBsaW5lcz1leHBsb2RlKCJcbiIsJHBwKTsKCS8vIGlzdHJhdWtpYW0gc2F2ZSBtZXRvZG8ga29udGVrc3RhIGFwaWUgcHJpbWFyeV9wcm9kdWN0IGlyIGN1cnJlbnRfZm9vZAoJJHNhdmU9YXJyYXkoKTsKCWZvcmVhY2goJHBwbGluZXMgYXMgJG49PiRsKXsKCQlpZihwcmVnX21hdGNoKCcvKGZ1bmN0aW9uXHMrXHcqc2F2ZXxmdW5jdGlvblxzK1x3KmNyZWF0ZXxmdW5jdGlvblxzK1x3KnVwZGF0ZXwtPnVwZGF0ZVwofC0+aW5zZXJ0XCh8Y3VycmVudF9mb29kX2JyYW5kfGN1cnJlbnRfZm9vZF9mcmVlX3RleHR8cHJpbWFyeV9wcm9kdWN0X2lkLio9KS9pJywkbCkpewoJCQkkc2F2ZVtdPSgkbisxKS4nOiAnLnRyaW0oc3Vic3RyKCRsLDAsMTUwKSk7CgkJfQoJfQoJJG9bJ3BldF9wcm9maWxlX3NhdmVfcmVhZCddPWFycmF5X3NsaWNlKCRzYXZlLDAsNDApOwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'sem',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'F2 Semantics (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_sem=SemKw8Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('sem.json',o));
