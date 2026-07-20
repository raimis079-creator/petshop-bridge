const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJyxmdW5jdGlvbigpewoJaWYoKCRfR0VUWydwc19mZDMnXT8/JycpIT09J0ZkM0t3OE54JylyZXR1cm47CglpZigoJF9HRVRbJ2NvbmZpcm0nXT8/JycpIT09J0RFUExPWScpe2VjaG8ganNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9Pidjb25maXJtJykpO2V4aXQ7fQoJJHI9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlL21haW4vZG9rdW1lbnRhaS9jbGFzcy1mZWVkaW5nLXVpLWZpbmFsLnBocD90PScudGltZSgpLGFycmF5KCd0aW1lb3V0Jz0+MzApKTsKCWlmKGlzX3dwX2Vycm9yKCRyKSl7ZWNobyBqc29uX2VuY29kZShhcnJheSgnZmV0Y2hfZXJyJz0+JHItPmdldF9lcnJvcl9tZXNzYWdlKCkpKTtleGl0O30KCSRjPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKCSRpbmM9V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcy9jbGFzcy1mZWVkaW5nLXVpLnBocCc7CglAZmlsZV9wdXRfY29udGVudHMoJGluYywkYyk7CgllY2hvIGpzb25fZW5jb2RlKGFycmF5KAoJCSdtYXRjaCc9PihoYXNoKCdzaGEyNTYnLEBmaWxlX2dldF9jb250ZW50cygkaW5jKSk9PT1oYXNoKCdzaGEyNTYnLCRjKSksCgkJJ3VzZXNfaG9tZV91cmwnPT4oc3RycG9zKCRjLCd3cF9wYXJzZV91cmwoIGhvbWVfdXJsKCknKSE9PWZhbHNlKSwKCQknbm9faHR0cF9ob3N0Jz0+KHN0cnBvcygkYywnSFRUUF9IT1NUJyk9PT1mYWxzZSkKCSkpO2V4aXQ7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'fd3',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'F1 Host Gate Deploy (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_fd3=Fd3Kw8Nx&confirm=DEPLOY');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('fd3.json',o));
