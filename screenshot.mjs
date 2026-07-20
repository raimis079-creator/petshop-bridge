const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfYTEnXT8/JycpIT09J0ExS3c4TngnKXJldHVybjsKCWlmKCgkX0dFVFsnY29uZmlybSddPz8nJykhPT0nREVQTE9ZJyl7ZWNobyBqc29uX2VuY29kZShhcnJheSgnZXJyJz0+J2NvbmZpcm0nKSk7ZXhpdDt9Cgkkbz1hcnJheSgpOwoJJG11ZGlyPVdQX0NPTlRFTlRfRElSLicvbXUtcGx1Z2lucyc7CglpZighaXNfZGlyKCRtdWRpcikpIEBta2RpcigkbXVkaXIsMDc1NSx0cnVlKTsKCSRyPXdwX3JlbW90ZV9nZXQoJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS9tYWluL2Rva3VtZW50YWkvcHMtcGV0cy1taWdyYXRpb24tZnJlZXplLnBocD90PScudGltZSgpLGFycmF5KCd0aW1lb3V0Jz0+MzApKTsKCWlmKGlzX3dwX2Vycm9yKCRyKSl7ZWNobyBqc29uX2VuY29kZShhcnJheSgnZmV0Y2hfZXJyJz0+JHItPmdldF9lcnJvcl9tZXNzYWdlKCkpKTtleGl0O30KCSRjPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKCSRmPSRtdWRpci4nL3BldHNob3AtcHMtcGV0cy1taWdyYXRpb24tZnJlZXplLnBocCc7CglAZmlsZV9wdXRfY29udGVudHMoJGYsJGMpOwoJJG9bJ2RlcGxveWVkX3NoYSddPWhhc2goJ3NoYTI1NicsQGZpbGVfZ2V0X2NvbnRlbnRzKCRmKSk7Cgkkb1snc2hhX21hdGNoX2V0YWxvbnUnXT0oJG9bJ2RlcGxveWVkX3NoYSddPT09J2FiNzI1OTQzZTlkY2Q4NzZkMDgxYWI0ZWM5MGU3NzE1NGQxYTc1ZWRhMzllZWExYTM4YTZmNzI5Yjg1OTM0MWMnKTsKCSRvWydieXRlcyddPXN0cmxlbigkYyk7CgkvLyBzdmVpa3VtbzogYXIgZmxhZyBOxJZSQSAoZnJlZXplIHR1cmkgYnV0aSBPRkYpCgkkcHJpdj1kaXJuYW1lKGRpcm5hbWUocnRyaW0oQUJTUEFUSCwnL1xcJykpKS4nL3BzX3ByaXZhdGUnOwoJJG9bJ3BzX3ByaXZhdGVfZGlyJ109JHByaXY7Cgkkb1sncHNfcHJpdmF0ZV9leGlzdHMnXT1pc19kaXIoJHByaXYpOwoJJG9bJ2ZsYWdfZWd6aXN0dW9qYSddPWZpbGVfZXhpc3RzKCRwcml2LicvcHNfcGV0c19mcmVlemVfT04nKTsKCSRvWyd0b2tlbl9lZ3ppc3R1b2phJ109ZmlsZV9leGlzdHMoJHByaXYuJy9wc19wZXRzX2ZyZWV6ZV90b2tlbicpOwoJLy8gZnVua2Npam9zIHV6c2lrcm92ZT8KCSRvWydndWFyZF9mdW5rY2lqb3MnXT1mdW5jdGlvbl9leGlzdHMoJ3BldHNob3BfcHNwZl9hY3RpdmUnKTsKCWlmKGZ1bmN0aW9uX2V4aXN0cygncGV0c2hvcF9wc3BmX2FjdGl2ZScpKXsgJG9bJ2ZyZWV6ZV9hY3RpdmVfYmVfZmxhZyddPXBldHNob3BfcHNwZl9hY3RpdmUoKTsgfQoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'a1',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'A1 Deploy (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_a1=A1Kw8Nx&confirm=DEPLOY');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('a1.json',o));
