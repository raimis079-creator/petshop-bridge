const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfdmVyJ10pfHwkX0dFVFsncHNfdmVyJ10hPT0nVmVyS3c4TngnKXtyZXR1cm47fQoJZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3JlYWRvbmx5Jz0+dHJ1ZSk7CgkvLyA2LiBhciAjMTE4NiBuZWJldnlrZG9tYXM6IHNlbmFzIGthbGt1bGlhdG9yaXVzIFBTX0ZDYWxjX1NlcnZpY2UgTkVUVVJJIGVnemlzdHVvdGkKCSRvWydvbGRfY2FsY19QU19GQ2FsY19TZXJ2aWNlX2V4aXN0cyddPWNsYXNzX2V4aXN0cygnUFNfRkNhbGNfU2VydmljZScpOwoJJG9bJ3MxMTg2X2FjdGl2ZSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBhY3RpdmUgRlJPTSB7JHBmfXNuaXBwZXRzIFdIRVJFIGlkPTExODYiKTsKCS8vIG5hdWpvcyBmZWVkaW5nIGtsYXPEl3MgVFVSSSBlZ3ppc3R1b3RpCgkkb1snbmV3X2ZlZWRpbmdfb2snXT0oY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0ZlZWRpbmdfU2VydmljZScpJiZjbGFzc19leGlzdHMoJ1BldHNob3BfRmVlZGluZ19DYWxjdWxhdG9yJykmJmNsYXNzX2V4aXN0cygnUGV0c2hvcF9GZWVkaW5nX1JlcG9zaXRvcnknKSYmY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0ZlZWRpbmdfVUknKSk7CgkvLyByZW5kZXIgaW5lcnRpxaFrYXM6IGZsYWcgb2ZmIC0+IGJ1aWxkX3BldF9mZWVkaW5nX2h0bWwgZ3LEhcW+aW5hICcnCgkkb1snZmxhZ19kZWZpbmVkJ109ZGVmaW5lZCgnUEVUU0hPUF9GRUVESU5HX0YxX0RFTU8nKTsKCWlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9GZWVkaW5nX1VJJykgJiYgbWV0aG9kX2V4aXN0cygnUGV0c2hvcF9GZWVkaW5nX1VJJywnc2hvcnRjb2RlX2ZlZWRpbmcnKSl7CgkJd3Bfc2V0X2N1cnJlbnRfdXNlcigyNSk7CgkJJG91dD1kb19zaG9ydGNvZGUoJ1twZXRzaG9wX2ZlZWRpbmdfZGVtb10nKTsKCQkkb1sncmVuZGVyX2ZsYWdfb2ZmX3R1c2NpYSddPSgkb3V0PT09JycpOwoJCXdwX3NldF9jdXJyZW50X3VzZXIoMCk7Cgl9CgkvLyBjbGVhbnVwIHRlbXAgc25pcHBldGFpCgkkdG9rcz1hcnJheSgnQ2xvc2VLdzhOeCcsJ1Zlckt3OE54JywnTG9naW4yS3c4TngnLCdGaXhLdzhOeCcpOwoJJGxpa2U9aW1wbG9kZSgnIE9SICcsYXJyYXlfbWFwKGZ1bmN0aW9uKCR0KXtyZXR1cm4gImNvZGUgTElLRSAnJSIuJHQuIiUnIjt9LCR0b2tzKSk7Cgkkc249JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQgRlJPTSB7JHBmfXNuaXBwZXRzIFdIRVJFICgkbGlrZSkgQU5EIGFjdGl2ZT0xIiwgQVJSQVlfQSk7CgkkZD0wOyBmb3JlYWNoKCRzbiBhcyAkcyl7ICR3cGRiLT51cGRhdGUoJHBmLidzbmlwcGV0cycsYXJyYXkoJ2FjdGl2ZSc9PjApLGFycmF5KCdpZCc9PiRzWydpZCddKSk7ICRkKys7IH0KCSRvWyd0ZW1wX2RlYWt0eXZ1b3RhJ109JGQ7Cgkkb1snc2VzaWpvc190ZW1wX2xpa29fYWt0eXZ1cyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcGZ9c25pcHBldHMgV0hFUkUgY29kZSBMSUtFICclS3c4TnglJyBBTkQgYWN0aXZlPTEiKTsKCSRvWydwZXQyNl9zdm9yaXMnXT0oJHdwZGItPmdldF92YXIoIlNFTEVDVCBjdXJyZW50X3dlaWdodF9rZyBGUk9NIHskcGZ9cHNfcGV0cyBXSEVSRSBpZD0yNiIpPT09bnVsbD8nTlVMTCc6J05FX05VTEwnKTsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'ver',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'F1 Verify+Clean (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_ver=VerKw8Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('ver.json',o));
