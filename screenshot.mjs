const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcmVjJ10pfHwkX0dFVFsncHNfcmVjJ10hPT0nUmVjS3c4TngnKXtyZXR1cm47fQoJJG89YXJyYXkoJ3JlYWRvbmx5Jz0+dHJ1ZSk7Cgkkb1snZW52X3R5cGUnXT1mdW5jdGlvbl9leGlzdHMoJ3dwX2dldF9lbnZpcm9ubWVudF90eXBlJyk/d3BfZ2V0X2Vudmlyb25tZW50X3R5cGUoKTonbi9hJzsKCSRvWydXUF9FTlZJUk9OTUVOVF9UWVBFX2NvbnN0J109ZGVmaW5lZCgnV1BfRU5WSVJPTk1FTlRfVFlQRScpP1dQX0VOVklST05NRU5UX1RZUEU6J05FREVGSU5FRCc7Cgkkb1snaHR0cF9ob3N0J109JF9TRVJWRVJbJ0hUVFBfSE9TVCddPz9udWxsOwoJJG9bJ2hvbWVfdXJsJ109aG9tZV91cmwoKTsKCSRvWydzaXRlX3VybCddPXNpdGVfdXJsKCk7CgkvLyBhciAkX0dFVCBtYXRvbWFzIChwZXJkdW9kYW0gdGVzdCBwYXJhbSkKCSRvWyd0ZXN0X2dldF9tYXRvbWFzJ109JF9HRVRbJ3Byb2JlJ10/PyduZXJhJzsKCS8vIGFyIDE4NTgxIHZhbGlkdXMgZmVlZGluZy1zY29wZSBwcm9kdWt0YXMKCWlmKGZ1bmN0aW9uX2V4aXN0cygnd2NfZ2V0X3Byb2R1Y3QnKSl7CgkJJHA9d2NfZ2V0X3Byb2R1Y3QoMTg1ODEpOwoJCSRvWydwMTg1ODEnXT0kcD9hcnJheSgnbmFtZSc9PiRwLT5nZXRfbmFtZSgpLCdzdGF0dXMnPT4kcC0+Z2V0X3N0YXR1cygpLCd0eXBlJz0+JHAtPmdldF90eXBlKCkpOiduZXJhJzsKCQkvLyBrYXRlZ29yaWpvcyAoZG9nPTcyL2NhdD04MSBzY29wZSkKCQkkY2F0cz13cF9nZXRfcG9zdF90ZXJtcygxODU4MSwncHJvZHVjdF9jYXQnLGFycmF5KCdmaWVsZHMnPT4naWRzJykpOwoJCSRvWydwMTg1ODFfY2F0cyddPSRjYXRzOwoJfQoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'rec',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'F2 Recon (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_rec=RecKw8Nx&probe=XYZ');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('rec.json',o));
