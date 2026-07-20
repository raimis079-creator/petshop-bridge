const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZXgnXSl8fCRfR0VUWydwc19leCddIT09J0V4S3c4TngnKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDEyMCk7ICRvPWFycmF5KCdyZWFkb25seSc9PnRydWUpOwoJLy8gMS4gYXIgZXhlYy9zaGVsbCBnYWxpbWkKCSRvWydleGVjX2Rpc2FibGVkJ109aW5fYXJyYXkoJ2V4ZWMnLGFycmF5X21hcCgndHJpbScsZXhwbG9kZSgnLCcsKHN0cmluZylpbmlfZ2V0KCdkaXNhYmxlX2Z1bmN0aW9ucycpKSkpOwoJJG9bJ3NoZWxsX2V4ZWNfZGlzYWJsZWQnXT1pbl9hcnJheSgnc2hlbGxfZXhlYycsYXJyYXlfbWFwKCd0cmltJyxleHBsb2RlKCcsJywoc3RyaW5nKWluaV9nZXQoJ2Rpc2FibGVfZnVuY3Rpb25zJykpKSk7Cgkkb1snZnVuY3Rpb25zJ109YXJyYXkoJ2V4ZWMnPT5mdW5jdGlvbl9leGlzdHMoJ2V4ZWMnKSwnc2hlbGxfZXhlYyc9PmZ1bmN0aW9uX2V4aXN0cygnc2hlbGxfZXhlYycpLCdwcm9jX29wZW4nPT5mdW5jdGlvbl9leGlzdHMoJ3Byb2Nfb3BlbicpKTsKCS8vIDIuIGtlbGlhaQoJJG9bJ0FCU1BBVEgnXT1BQlNQQVRIOwoJJG9bJ1dQX0NPTlRFTlRfRElSJ109V1BfQ09OVEVOVF9ESVI7Cgkkb1sndXBsb2FkcyddPXdwX3VwbG9hZF9kaXIoKVsnYmFzZWRpciddOwoJJG9bJ2RvY19yb290J109JF9TRVJWRVJbJ0RPQ1VNRU5UX1JPT1QnXT8/bnVsbDsKCS8vIDMuIGFyIGdhbGltIHJhc3l0aSB2aXJzIHdlYnJvb3QgKHV6IHB1YmxpY19odG1sKQoJJGNhbmRpZGF0ZXM9YXJyYXkoCgkJZGlybmFtZShBQlNQQVRIKSwgICAgICAgICAgICAgICAgICAgICAgLy8gdmlycyBXUCByb290CgkJZGlybmFtZSgkX1NFUlZFUlsnRE9DVU1FTlRfUk9PVCddPz9BQlNQQVRIKSwKCQlBQlNQQVRILicuLicuRElSRUNUT1JZX1NFUEFSQVRPUi4ncHNfcHJpdmF0ZScsCgkJV1BfQ09OVEVOVF9ESVIuJy9wcy1wcml2YXRlJywKCSk7Cgkkd3JpdGFibGU9YXJyYXkoKTsKCWZvcmVhY2goJGNhbmRpZGF0ZXMgYXMgJGMpewoJCSRycD1AcmVhbHBhdGgoJGMpOwoJCSR3cml0YWJsZVtdPWFycmF5KCdwYXRoJz0+JGMsJ3JlYWxwYXRoJz0+JHJwLCdleGlzdHMnPT4oJHJwJiZpc19kaXIoJHJwKSksJ3dyaXRhYmxlJz0+KCRycCYmaXNfd3JpdGFibGUoJHJwKSkpOwoJfQoJJG9bJ2Rpcl9jYW5kaWRhdGVzJ109JHdyaXRhYmxlOwoJLy8gNC4gYXIgbXlzcWxkdW1wIGJpbmFyYXMgeXJhIChqZWkgZXhlYyB2ZWlrdHUpCglpZihmdW5jdGlvbl9leGlzdHMoJ2V4ZWMnKSAmJiAhJG9bJ2V4ZWNfZGlzYWJsZWQnXSl7CgkJJG91dD1hcnJheSgpO0BleGVjKCd3aGljaCBteXNxbGR1bXAgMj4vZGV2L251bGwnLCRvdXQpOyAkb1snbXlzcWxkdW1wX3doaWNoJ109JG91dDsKCX0gZWxzZSB7ICRvWydteXNxbGR1bXBfd2hpY2gnXT0nZXhlY19kaXNhYmxlZCc7IH0KCS8vIDUuIFdQIG1haW50ZW5hbmNlL3dyaXRlLWZyZWV6ZSBnYWxpbXliZTogYXIgZ2FsaW0gcmFzeXRpIC5tYWludGVuYW5jZSBmYWlsYQoJJG9bJ21haW50ZW5hbmNlX2ZpbGVfd3JpdGFibGUnXT1pc193cml0YWJsZShBQlNQQVRIKTsKCS8vIDYuIERCIHRlaXNpdSBwYXRpa3JhOiBhciBnYWxpbSBDUkVBVEUgVEFCTEUgLyBSRU5BTUUgLyBBTFRFUiAodGlrIGluZm9ybWFjaWphLCBuZXZ5a2RvbSkKCWdsb2JhbCAkd3BkYjsKCSRncmFudHM9JHdwZGItPmdldF9jb2woIlNIT1cgR1JBTlRTIEZPUiBDVVJSRU5UX1VTRVIoKSIpOwoJJG9bJ2RiX2dyYW50cyddPWFycmF5X21hcChmdW5jdGlvbigkZyl7cmV0dXJuIHN1YnN0cigkZywwLDkwKTt9LCRncmFudHM/OmFycmF5KCkpOwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'ex',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'F2 Exec Recon (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_ex=ExKw8Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('ex.json',o));
