const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZjUnXSl8fCRfR0VUWydwc19mNSddIT09J0Y1S3c4TngnKXtyZXR1cm47fQoJZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsKCS8vICMxMDk1IGlyICMxMDk2IC0gaWVza29tIGNoZWNrc3VtIGZvcm11bGVzCgkkb3V0PWFycmF5KCk7Cglmb3JlYWNoKGFycmF5KDEwOTUsMTA5NikgYXMgJHNpZCl7CgkJJGNvZGU9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBjb2RlIEZST00geyRwZn1zbmlwcGV0cyBXSEVSRSBpZD0lZCIsJHNpZCkpOwoJCWlmKCEkY29kZSkgY29udGludWU7CgkJLy8gdmlzb3MgZWlsdXRlcyBzdSAnY2hlY2tzdW0nPT4KCQlpZihwcmVnX21hdGNoX2FsbCgiL2NoZWNrc3VtJ1xccyo9PlxccypoYXNoXFwoW14pXSpcXCkvIiwkY29kZSwkbSkpewoJCQkkb3V0WydzJy4kc2lkLidfY2hlY2tzdW1faW5zZXJ0J109JG1bMF07CgkJfQoJCS8vICRjaD0gYXJiYSAkY2hlY2tzdW09IGFwaWJyZXppbWFpCgkJaWYocHJlZ19tYXRjaF9hbGwoJy9cXCQoPzpjaHxjaGVja3N1bXxmaWxlX2hhc2h8ZmgpXFxzKj1cXHMqaGFzaFxcKFteO117MCwxMjB9Oy8nLCRjb2RlLCRtMikpewoJCQkkb3V0WydzJy4kc2lkLidfaGFzaF9kZWZzJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gbWJfc3Vic3RyKCR4LDAsMTUwKTt9LCRtMlswXSk7CgkJfQoJfQoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgncmVhZG9ubHknPT50cnVlLCdvdXQnPT4kb3V0KSk7IGV4aXQ7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'f5',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'S212-C Full 1095 (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_f5=F5Kw8Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('f5.json',o));
