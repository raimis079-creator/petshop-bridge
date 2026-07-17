const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcHAnXSl8fCRfR0VUWydwc19wcCddIT09J1BwNEhzOUx6Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCg0MDApOyBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCdyZWFkb25seSc9PnRydWUpOwoJLy8gMS4gcGV0c2hvcC1jb3JlIHBsdWdpbmFzCgkkZGlyPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUnOwoJJG9bJ3BldHNob3BfY29yZV95cmEnXT1pc19kaXIoJGRpcik/J1RBSVAnOidORSc7CglpZihpc19kaXIoJGRpcikpewoJCSRmaWxlcz1hcnJheSgpOwoJCSRpdD1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGRpcikpOwoJCWZvcmVhY2goJGl0IGFzICRmKXsgaWYocHJlZ19tYXRjaCgnL1wucGhwJC9pJywkZi0+Z2V0RmlsZW5hbWUoKSkpICRmaWxlc1tdPXN0cl9yZXBsYWNlKCRkaXIuJy8nLCcnLCRmLT5nZXRQYXRobmFtZSgpKTsgfQoJCXNvcnQoJGZpbGVzKTsgJG9bJ3BldHNob3BfY29yZV9mYWlsYWknXT0kZmlsZXM7CgkJLy8gcGx1Z2luYXMgYWt0eXZ1cz8KCQkkb1snYWt0eXZ1c19wbHVnaW5haSddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnLGFycmF5KCkpLGZ1bmN0aW9uKCRwKXsgcmV0dXJuIHN0cnBvcygkcCwncGV0c2hvcCcpIT09ZmFsc2U7IH0pKTsKCX0KCS8vIDIuIGNsYXNzLXBldC1wcm9maWxlLnBocCAtIHBzX2ZlZWRpbmcga29udGVrc3RhcwoJJHBmMj0kZGlyLicvaW5jbHVkZXMvY2xhc3MtcGV0LXByb2ZpbGUucGhwJzsKCWlmKGZpbGVfZXhpc3RzKCRwZjIpKXsKCQkkYz1maWxlX2dldF9jb250ZW50cygkcGYyKTsKCQkkb1sncGV0X3Byb2ZpbGVfZHlkaXMnXT1zdHJsZW4oJGMpOwoJCSRsaW5lcz1leHBsb2RlKCJcbiIsJGMpOwoJCSRvWydwZXRfcHJvZmlsZV9laWx1Y2l1J109Y291bnQoJGxpbmVzKTsKCQkvLyB2aXNvcyBwc19mZWVkaW5nIHZpZXRvcwoJCWZvcmVhY2goJGxpbmVzIGFzICRpPT4kbCl7CgkJCWlmKHN0cmlwb3MoJGwsJ3BzX2ZlZWRpbmcnKSE9PWZhbHNlKXsKCQkJCSRmcm9tPW1heCgwLCRpLTYpOyAkdG89bWluKGNvdW50KCRsaW5lcyktMSwkaSs4KTsKCQkJCSRvWydwc19mZWVkaW5nX3ZpZXRvcyddW109YXJyYXkoJ2VpbHV0ZSc9PiRpKzEsCgkJCQkJJ2tvbnRla3N0YXMnPT5pbXBsb2RlKCJcbiIsYXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gcnRyaW0oJHgpO30sYXJyYXlfc2xpY2UoJGxpbmVzLCRmcm9tLCR0by0kZnJvbSsxKSkpKTsKCQkJfQoJCX0KCQkvLyBhciBSQVNPIGFyIHRpayBTS0FJVE8KCQkkb1sncmFzeW1vX3BvenltaWFpJ109YXJyYXkoKTsKCQlmb3JlYWNoKGFycmF5KCdJTlNFUlQgSU5UTycsJ1VQREFURSAnLCdERUxFVEUgRlJPTScsJy0+aW5zZXJ0KCcsJy0+dXBkYXRlKCcsJy0+ZGVsZXRlKCcpIGFzICR3KXsKCQkJaWYoc3RyaXBvcygkYywkdykhPT1mYWxzZSkgJG9bJ3Jhc3ltb19wb3p5bWlhaSddW109JHc7CgkJfQoJCS8vIGZ1bmtjaWp1IHNhcmFzYXMKCQlpZihwcmVnX21hdGNoX2FsbCgnL2Z1bmN0aW9uXHMrKFx3KylccypcKC9pJywkYywkbSkpICRvWydwZXRfcHJvZmlsZV9mdW5rY2lqb3MnXT1hcnJheV9zbGljZSgkbVsxXSwwLDQwKTsKCX0gZWxzZSB7ICRvWydwZXRfcHJvZmlsZSddPSdGQUlMQVMgTkVSQVNUQVMnOyB9CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pp',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'S212-B petshop-core Pet Profile Recon (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_pp=Pp4Hs9Lz');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('pp.json',o));
