const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZmgnXSl8fCRfR0VUWydwc19maCddIT09J0ZoOEt3M054Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCgxMjApOyBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgncmVhZG9ubHknPT50cnVlKTsKCS8vIHRpa3NsaW7ElyBwYWllxaFrYTogdGlrIGZlZWRpbmcgZmFpbGFpIHBhZ2FsIHBhdmFkaW5pbcSFCgkkY2FuZD1hcnJheSgpOwoJZm9yZWFjaChhcnJheSgncGV0c2hvcC14bWwnLCdwZXRzaG9wLWNvcmUnLCdwZXRzaG9wLXByYWdtYScpIGFzICRwbHVnKXsKCQkkYmFzZT1XUF9QTFVHSU5fRElSLicvJy4kcGx1ZzsKCQlpZighaXNfZGlyKCRiYXNlKSkgY29udGludWU7CgkJJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkYmFzZSxGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOwoJCWZvcmVhY2goJGl0IGFzICRmaWxlKXsKCQkJaWYoJGZpbGUtPmdldEV4dGVuc2lvbigpIT09J3BocCcpIGNvbnRpbnVlOwoJCQkkZm49JGZpbGUtPmdldEZpbGVuYW1lKCk7CgkJCWlmKHN0cmlwb3MoJGZuLCdmZWVkJykhPT1mYWxzZXx8c3RyaXBvcygkZm4sJ2Nhbm9uaWNhbCcpIT09ZmFsc2V8fHN0cmlwb3MoJGZuLCdoYXNoJykhPT1mYWxzZXx8c3RyaXBvcygkZm4sJ2ltcG9ydCcpIT09ZmFsc2UpewoJCQkJJGNhbmRbXT0kZmlsZS0+Z2V0UGF0aG5hbWUoKTsKCQkJfQoJCX0KCX0KCSRvWydrYW5kaWRhdGFpJ109YXJyYXlfbWFwKCdiYXNlbmFtZScsJGNhbmQpOwoJLy8gaWVza29tIGNhbm9uaWNhbCBoYXNoIGZ1bmtjaWpvcwoJJGhpdHM9YXJyYXkoKTsKCWZvcmVhY2goJGNhbmQgYXMgJGYpewoJCSRjPUBmaWxlX2dldF9jb250ZW50cygkZik7IGlmKCEkYykgY29udGludWU7CgkJaWYoc3RycG9zKCRjLCdjYW5vbmljYWwnKSE9PWZhbHNlKXsKCQkJLy8gaXN0cmF1a2lhbSBmdW5rY2lqYSBhcGllIGNhbm9uaWNhbCBoYXNoCgkJCWlmKHByZWdfbWF0Y2hfYWxsKCcvZnVuY3Rpb25ccytcdypjYW5vbmljYWxcdypbXntdKlx7L2knLCRjLCRmbSkpewoJCQkJZm9yZWFjaCgkZm1bMF0gYXMgJGZuKSAkaGl0c1tdPWFycmF5KCdmJz0+YmFzZW5hbWUoJGYpLCdmdW5jJz0+dHJpbSgkZm4pKTsKCQkJfQoJCQkvLyBlaWx1dGVzIHN1IGhhc2goIGlyIGNhbm9uaWNhbAoJCQkkbGluZXM9ZXhwbG9kZSgiXG4iLCRjKTsKCQkJZm9yZWFjaCgkbGluZXMgYXMgJGk9PiRsKXsKCQkJCWlmKHN0cmlwb3MoJGwsJ2Nhbm9uaWNhbF90YWJsZV9oYXNoJykhPT1mYWxzZSB8fCAoc3RyaXBvcygkbCwnaGFzaCcpIT09ZmFsc2UgJiYgKHN0cmlwb3MoJGwsJ3NoYTI1NicpIT09ZmFsc2V8fHN0cmlwb3MoJGwsJ2pzb25fZW5jb2RlJykhPT1mYWxzZXx8c3RyaXBvcygkbCwnaW1wbG9kZScpIT09ZmFsc2UpKSl7CgkJCQkJJGhpdHNbXT1hcnJheSgnZic9PmJhc2VuYW1lKCRmKSwnZWlsJz0+JGkrMSwnayc9PnRyaW0obWJfc3Vic3RyKCRsLDAsMTUwKSkpOwoJCQkJfQoJCQl9CgkJfQoJfQoJJG9bJ2hpdHMnXT1hcnJheV9zbGljZSgkaGl0cywwLDQwKTsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'fh',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'S212-C Find Hash (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_fh=Fh8Kw3Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('fh.json',o));
