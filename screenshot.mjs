const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfbTgnXSl8fCRfR0VUWydwc19tOCddIT09J004S3c4TngnKXtyZXR1cm47fQoJJG89YXJyYXkoJ3JlYWRvbmx5Jz0+dHJ1ZSk7CgkkZGlyPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUnOwoJLy8gZmFpbHUgc2FyYXNhcwoJJGZpbGVzPWFycmF5KCk7Cglmb3JlYWNoKGdsb2IoJGRpci4nL2luY2x1ZGVzL2NsYXNzLXBldC0qLnBocCcpIGFzICRmKXsgJGZpbGVzW2Jhc2VuYW1lKCRmKV09ZmlsZXNpemUoJGYpOyB9Cgkkb1sncGV0X2ZpbGVzJ109JGZpbGVzOwoJLy8gcGV0LXVpIHR1cmlueXMgKGVtcHR5IHN0YXRlICsgbXlndHVrYXMpCgkkdWk9QGZpbGVfZ2V0X2NvbnRlbnRzKCRkaXIuJy9pbmNsdWRlcy9jbGFzcy1wZXQtdWkucGhwJyk7Cgkkb1sncGV0X3VpX2J5dGVzJ109c3RybGVuKCR1aSk7CgkvLyBpc3RyYXVraWFtICJTdWt1cnRpIHByb2ZpbCIga29udGVrc3RhCglmb3JlYWNoKGFycmF5KCdTdWt1cnRpIHByb2ZpbCcsJ2VtcHR5JywnUFNQZXRGb3JtSW5pdCcsJ1BldHNob3BQZXRGb3JtJywnYWN0aW9uPWNyZWF0ZScsJ3BldC1mb3JtLmpzJywnd3BfZW5xdWV1ZV9zY3JpcHQnLCdyb290LmlkJywnbW91bnQnKSBhcyAkbmVlZGxlKXsKCQkkcG9zPXN0cmlwb3MoJHVpLCRuZWVkbGUpOwoJCSRvWyd1aV8nLnN0cl9yZXBsYWNlKGFycmF5KCcgJywnPScsJy4nLCctJyksJ18nLCRuZWVkbGUpXT0oJHBvcyE9PWZhbHNlKT9zdWJzdHIoJHVpLG1heCgwLCRwb3MtNjApLDE4MCk6J07EllJBJzsKCX0KCS8vIGFyIHBldC1mb3JtLmpzIGVnemlzdHVvamEgKyBrdXIgZW5xdWV1ZQoJJGFzc2V0cz1hcnJheSgpOwoJZm9yZWFjaChnbG9iKCRkaXIuJy9hc3NldHMvKi5qcycpIGFzICRmKXsgJGFzc2V0c1tiYXNlbmFtZSgkZildPWZpbGVzaXplKCRmKTsgfQoJZm9yZWFjaChnbG9iKCRkaXIuJy9hc3NldHMvanMvKi5qcycpIGFzICRmKXsgJGFzc2V0c1snanMvJy5iYXNlbmFtZSgkZildPWZpbGVzaXplKCRmKTsgfQoJJG9bJ2pzX2Fzc2V0cyddPSRhc3NldHM7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'m8',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'F2 M8 Recon (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_m8=M8Kw8Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('m8.json',o));
