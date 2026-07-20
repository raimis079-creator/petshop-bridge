const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfYXVkJ10pfHwkX0dFVFsncHNfYXVkJ10hPT0nQXVkS3c4TngnKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDIwMCk7ICRvPWFycmF5KCdyZWFkb25seSc9PnRydWUpOwoJJGZpZWxkcz1hcnJheSgncHJpbWFyeV9wcm9kdWN0X2lkJywncHJpbWFyeV9wcm9kdWN0X3NrdScsJ3ByaW1hcnlfcHJvZHVjdF9uYW1lJywncHJpbWFyeV9wcm9kdWN0X3BhY2thZ2UnKTsKCSRyb290cz1hcnJheShXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlJyk7CgkkaGl0cz1hcnJheSgpOwoJJHJpaT1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJHJvb3RzWzBdLCBGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOwoJZm9yZWFjaCgkcmlpIGFzICRmKXsKCQkkcGF0aD0kZi0+Z2V0UGF0aG5hbWUoKTsKCQlpZighcHJlZ19tYXRjaCgnL1wuKHBocHxqcykkLycsJHBhdGgpKSBjb250aW51ZTsKCQkkcmVsPXN0cl9yZXBsYWNlKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvJywnJywkcGF0aCk7CgkJJGxpbmVzPWZpbGUoJHBhdGgpOwoJCWZvcmVhY2goJGxpbmVzIGFzICRuPT4kbGluZSl7CgkJCWZvcmVhY2goJGZpZWxkcyBhcyAkZmxkKXsKCQkJCWlmKHN0cnBvcygkbGluZSwkZmxkKSE9PWZhbHNlKXsKCQkJCQkkdD10cmltKCRsaW5lKTsKCQkJCQkvLyBrbGFzaWZpa2FjaWphCgkJCQkJJHdyaXRlPShib29sKXByZWdfbWF0Y2goJy8oVVBEQVRFfElOU0VSVHwtPnVwZGF0ZXwtPmluc2VydHwtPnJlcGxhY2V8U0VUXHN8c2F2ZXw9XHMqXCR8XCd2YWx1ZVwnfHVwZGF0ZV8pL2knLCR0KTsKCQkJCQkkcmVhZD0oYm9vbClwcmVnX21hdGNoKCcvKFNFTEVDVHwtPmdldHxnZXRfdmFyfGdldF9yb3d8Z2V0X3Jlc3VsdHN8ZWNob3xyZXR1cm58U0VMRUNUfHJlYWR8XCRwZXRcWykvaScsJHQpOwoJCQkJCSRoaXRzW109YXJyYXkoJ2YnPT4kcmVsLCdsJz0+JG4rMSwnZmxkJz0+JGZsZCwndyc9PiR3cml0ZT8xOjAsJ3InPT4kcmVhZD8xOjAsJ3R4dCc9PnN1YnN0cigkdCwwLDE0MCkpOwoJCQkJfQoJCQl9CgkJfQoJfQoJJG9bJ3RvdGFsX2hpdHMnXT1jb3VudCgkaGl0cyk7Cgkkb1snaGl0cyddPSRoaXRzOwoJLy8gYXRza2lyYXM6IHJlZmlsbC9yZWNvbW1lbmRhdGlvbi9sYXN0LXB1cmNoYXNlIGtvbnRla3N0YXMKCSRjdHg9YXJyYXkoKTsKCWZvcmVhY2goYXJyYXkoJ3JlZmlsbCcsJ2xhc3Rfb3JkZXInLCdsYXN0X3B1cmNoYXNlJywncmVjb21tZW5kJywncmVrb21lbmQnLCdjdXJyZW50X2Zvb2QnLCdkYWJhcnRpbmlzJykgYXMgJGt3KXsKCQkkYz0wOwoJCSRyaWkyPW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkcm9vdHNbMF0sIEZpbGVzeXN0ZW1JdGVyYXRvcjo6U0tJUF9ET1RTKSk7CgkJZm9yZWFjaCgkcmlpMiBhcyAkZil7ICRwPSRmLT5nZXRQYXRobmFtZSgpOyBpZighcHJlZ19tYXRjaCgnL1wuKHBocHxqcykkLycsJHApKWNvbnRpbnVlOwoJCQkkY29udGVudD1maWxlX2dldF9jb250ZW50cygkcCk7CgkJCWlmKHN0cmlwb3MoJGNvbnRlbnQsJGt3KSE9PWZhbHNlICYmIChzdHJwb3MoJGNvbnRlbnQsJ3ByaW1hcnlfcHJvZHVjdCcpIT09ZmFsc2UpKXsgJGMrKzsgfQoJCX0KCQkkY3R4WyRrd109JGM7Cgl9Cgkkb1snZmllbGRfc3Vfa29udGVrc3R1X2ZhaWxhaSddPSRjdHg7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'aud',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'F2 Audit primary_product (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_aud=AudKw8Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('aud.json',o));
