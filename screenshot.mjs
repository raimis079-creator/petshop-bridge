const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfaDEnXSl8fCRfR0VUWydwc19oMSddIT09J0gxS3c4TngnKXtyZXR1cm47fQoJJG89YXJyYXkoJ3JlYWRvbmx5Jz0+dHJ1ZSk7CgkvLyAxLiBndWFyZCBmdW5rY2lqb3MgdXpzaWtyb3ZlIChkYWJhciwga2l0YW1lIHJlcXVlc3QnZSk/Cgkkb1snZ3VhcmRfdXpzaWtyb3ZlJ109ZnVuY3Rpb25fZXhpc3RzKCdwZXRzaG9wX3BzcGZfYWN0aXZlJyk7Cgkkb1sndG9rZW5fZm4nXT1mdW5jdGlvbl9leGlzdHMoJ3BldHNob3BfcHNwZl90b2tlbicpOwoJJG9bJ3Nob3VsZF9ibG9ja19mbiddPWZ1bmN0aW9uX2V4aXN0cygncGV0c2hvcF9wc3BmX3Nob3VsZF9ibG9jaycpOwoJLy8gMi4gZnJlZXplIE9GRiBiZSBmbGFnPwoJaWYoZnVuY3Rpb25fZXhpc3RzKCdwZXRzaG9wX3BzcGZfYWN0aXZlJykpeyAkb1snZnJlZXplX2FjdGl2ZSddPXBldHNob3BfcHNwZl9hY3RpdmUoKTsgfQoJLy8gMy4gZmxhZy90b2tlbiBrZWxpYWkKCSRwcml2PWRpcm5hbWUoZGlybmFtZShydHJpbShBQlNQQVRILCcvXFwnKSkpLicvcHNfcHJpdmF0ZSc7Cgkkb1snZmxhZ19lZ3ppc3R1b2phJ109ZmlsZV9leGlzdHMoJHByaXYuJy9wc19wZXRzX2ZyZWV6ZV9PTicpOwoJJG9bJ3Rva2VuX2VnemlzdHVvamEnXT1maWxlX2V4aXN0cygkcHJpdi4nL3BzX3BldHNfZnJlZXplX3Rva2VuJyk7CgkvLyA0LiBxdWVyeSBob29rIGNhbGxiYWNrIHR2YXJrYTogYXIgeXJhIGNhbGxiYWNrIFBPIG11c3UgKFBIUF9JTlRfTUFYKT8KCWdsb2JhbCAkd3BfZmlsdGVyOwoJJGFmdGVyX3VzPWFycmF5KCk7ICRvdXJfcHJpb19mb3VuZD1mYWxzZTsKCWlmKGlzc2V0KCR3cF9maWx0ZXJbJ3F1ZXJ5J10pKXsKCQkkY2JzPSR3cF9maWx0ZXJbJ3F1ZXJ5J10tPmNhbGxiYWNrczsKCQlrc29ydCgkY2JzKTsKCQkkbWF4cHJpbz1QSFBfSU5UX01BWDsKCQlmb3JlYWNoKCRjYnMgYXMgJHByaW89PiRsaXN0KXsKCQkJJG9bJ3F1ZXJ5X3ByaW9yaXR5XycuJHByaW9dPWNvdW50KCRsaXN0KTsKCQkJaWYoJHByaW8+JG1heHByaW8peyAkYWZ0ZXJfdXNbXT0kcHJpbzsgfQoJCX0KCQkkb1sneXJhX2NhbGxiYWNrX3BvX1BIUF9JTlRfTUFYJ109KGNvdW50KCRhZnRlcl91cyk+MCk7CgkJJG9bJ2F1a2NpYXVzaWFzX3F1ZXJ5X3ByaW8nXT1tYXgoYXJyYXlfa2V5cygkY2JzKSk7CgkJJG9bJ1BIUF9JTlRfTUFYJ109UEhQX0lOVF9NQVg7CgkJJG9bJ211c3VfcHJpb195cmFfYXVrY2lhdXNpYXMnXT0obWF4KGFycmF5X2tleXMoJGNicykpPT09UEhQX0lOVF9NQVgpOwoJfQoJLy8gNS4gcHNfcGV0cyBzdmVpa2F0YSAoYmFzZWxpbmUgbmVwYWtpdG8pCglnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OwoJJG9bJ3BzX3BldHNfY291bnQnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXBzX3BldHMiKTsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'h1',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'A1 Health (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_h1=H1Kw8Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('h1.json',o));
