const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcnQnXSl8fCRfR0VUWydwc19ydCddIT09J1J0S3c4TngnKXtyZXR1cm47fQoJJG89YXJyYXkoJ3JlYWRvbmx5Jz0+dHJ1ZSk7Cgkkcm91dGVzPXJlc3RfZ2V0X3NlcnZlcigpLT5nZXRfcm91dGVzKCk7CgkkcGV0dz1hcnJheSgpOwoJZm9yZWFjaCgkcm91dGVzIGFzICRyPT4kaGFuZGxlcnMpewoJCWlmKHN0cmlwb3MoJHIsJ3BldCcpPT09ZmFsc2UgJiYgc3RyaXBvcygkciwncGV0c2hvcCcpPT09ZmFsc2UpIGNvbnRpbnVlOwoJCWZvcmVhY2goJGhhbmRsZXJzIGFzICRoKXsKCQkJJG1ldGhvZHM9aXNfYXJyYXkoJGhbJ21ldGhvZHMnXSk/aW1wbG9kZSgnLCcsYXJyYXlfa2V5cyhhcnJheV9maWx0ZXIoJGhbJ21ldGhvZHMnXSkpKTokaFsnbWV0aG9kcyddOwoJCQkvLyB0aWsgcmFzeW1vIG1ldG9kYWkKCQkJaWYocHJlZ19tYXRjaCgnL1BPU1R8UFVUfFBBVENIfERFTEVURS9pJywoc3RyaW5nKSRtZXRob2RzKSl7CgkJCQkkY2I9JGhbJ2NhbGxiYWNrJ10/P251bGw7ICRjYm5hbWU9Jyc7CgkJCQlpZihpc19hcnJheSgkY2IpKXsgJGNibmFtZT0oaXNfb2JqZWN0KCRjYlswXSk/Z2V0X2NsYXNzKCRjYlswXSk6JGNiWzBdKS4nOjonLiRjYlsxXTsgfQoJCQkJJHBldHdbXT1hcnJheSgncm91dGUnPT4kciwnbWV0aG9kcyc9PiRtZXRob2RzLCdjYic9PiRjYm5hbWUpOwoJCQl9CgkJfQoJfQoJJG9bJ3BldF93cml0ZV9yb3V0ZXMnXT0kcGV0dzsKCS8vIHBldC1wcm9maWxlIHdyaXRlIG1ldG9kYWkgKHBhdGlrcmluYW0ga3VyaXMgc2VsZjo6dGFibGVfbmFtZSgpPXBzX3BldHMpCgkkb1sncGV0X3Byb2ZpbGVfdGFibGUnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfUGV0X1Byb2ZpbGUnKT9QZXRzaG9wX1BldF9Qcm9maWxlOjp0YWJsZV9uYW1lKCk6J24vYSc7CgkvLyBhciB5cmEgdmVpa2lhbnRpIGZyZWV6ZSBvcHRpb24gamF1Cgkkb1snZnJlZXplX2ZsYWdfZGFiYXInXT1nZXRfb3B0aW9uKCdwZXRzaG9wX3BzX3BldHNfd3JpdGVfZnJlZXplJywnTkVERUZJTkVEJyk7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'rt',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'F2 Routes Recon (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_rt=RtKw8Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('rt.json',o));
