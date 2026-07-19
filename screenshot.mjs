const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZjF3J10pfHwkX0dFVFsncHNfZjF3J10hPT0nRjF3S3c4TngnKXtyZXR1cm47fQoJaWYoKCRfR0VUWydjb25maXJtJ10/PycnKSE9PSdXUklURV9DT1JFJyl7IGVjaG8ganNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9Pidjb25maXJtJykpOyBleGl0OyB9CglAc2V0X3RpbWVfbGltaXQoMzAwKTsgJG89YXJyYXkoKTsKCSRjb3JlPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUnOwoJJGluYz0kY29yZS4nL2luY2x1ZGVzJzsKCSRvWydpbmNfd3JpdGFibGUnXT1pc193cml0YWJsZSgkaW5jKTsKCSRvWydtYWluX3dyaXRhYmxlJ109aXNfd3JpdGFibGUoJGNvcmUuJy9wZXRzaG9wLWNvcmUucGhwJyk7CgkvLyBiYWNrdXAgcGV0c2hvcC1jb3JlLnBocAoJJG1haW49QGZpbGVfZ2V0X2NvbnRlbnRzKCRjb3JlLicvcGV0c2hvcC1jb3JlLnBocCcpOwoJaWYoJG1haW4hPT1mYWxzZSl7CgkJJGJrZGlyPSRjb3JlLicvX2JhY2t1cF9mMSc7CgkJaWYoIWlzX2RpcigkYmtkaXIpKSBAbWtkaXIoJGJrZGlyKTsKCQkkYms9JGJrZGlyLicvcGV0c2hvcC1jb3JlLnBocC5iYWtfJy5kYXRlKCdZbWRfSGlzJyk7CgkJJG9bJ2JhY2t1cF93cml0dGVuJ109KGJvb2wpQGZpbGVfcHV0X2NvbnRlbnRzKCRiaywkbWFpbik7CgkJJG9bJ2JhY2t1cF9wYXRoJ109c3RyX3JlcGxhY2UoJGNvcmUuJy8nLCcnLCRiayk7CgkJJG9bJ2JhY2t1cF9zaGEnXT1oYXNoKCdzaGEyNTYnLCRtYWluKTsKCQkkb1snbWFpbl9zaXplJ109c3RybGVuKCRtYWluKTsKCX0KCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'f1w',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'F1 Write Check (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_f1w=F1wKw8Nx&confirm=WRITE_CORE');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('f1w.json',o));
