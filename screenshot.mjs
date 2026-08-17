process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3N2J10pPyRfR0VUWydwc19zdiddOicnKSE9PSdERVA4NCcpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCg2MDApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidERVA4NCcsJ3RzJz0+ZGF0ZSgnWS1tLWQgSDppOnMnKSk7CiAkdXJsPSdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vcmFpbWlzMDc5LWNyZWF0b3IvcGV0c2hvcC1icmlkZ2UvbWFpbi9kZXBsb3kvcGV0c2hvcC1rYXRhbG9nYXMucGhwJzsKICRyPXdwX3JlbW90ZV9nZXQoJHVybCwgYXJyYXkoJ3RpbWVvdXQnPT42MCkpOwogaWYgKGlzX3dwX2Vycm9yKCRyKSkgeyAkb1snU1RPUCddPSdmZXRjaDogJy4kci0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICROPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKICRvWydnYXV0YSddPXN0cmxlbigkTik7ICRvWydnYXV0YV9tZDUnXT1tZDUoJE4pOwogaWYgKCRvWydnYXV0YV9tZDUnXSE9PSc2ZGUyNzM4MDUzY2EwNjFlZGI4ODRlZjRkMWIyZWI2YicpIHsgJG9bJ1NUT1AnXT0nTUQ1IG5lc3V0YW1wYSc7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiB0cnkgeyBAdG9rZW5fZ2V0X2FsbCgkTiwgVE9LRU5fUEFSU0UpOyB9IGNhdGNoIChcUGFyc2VFcnJvciAkZSkgeyAkb1snU1RPUCddPSdTSU5UQUtTRTogJy4kZS0+Z2V0TWVzc2FnZSgpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogJGY9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJzsgJHNlbmE9ZmlsZV9nZXRfY29udGVudHMoJGYpOwogJG9bJ3NlbmFfbWQ1J109bWQ1KCRzZW5hKTsKIGlmICgkb1snc2VuYV9tZDUnXSE9PSczMTY2OTRmNjg5NjY3ZGUyMTRjZWEwNTgzMGY1MzJjZScpIHsgJG9bJ1NUT1AnXT0nU0VOQVMgZmFpbGFzIG5lIHRhcyc7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiBAd3BfbWtkaXJfcChXUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHMtYmFja3VwcycpOwogQGZpbGVfcHV0X2NvbnRlbnRzKFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzL3BldHNob3Ata2F0YWxvZ2FzLnBocC52ODMuJy5nbWRhdGUoJ1ltZC1IaXMnKS4nLmJhaycsICRzZW5hKTsKIGZpbGVfcHV0X2NvbnRlbnRzKCRmLCAkTik7IGNsZWFyc3RhdGNhY2hlKHRydWUsJGYpOwogJG9bJ2lyYXN5dGEnXT0obWQ1X2ZpbGUoJGYpPT09bWQ1KCROKSk/J0lESUVHVEEnOidORVNVVEFNUEEnOwogZGVsZXRlX3RyYW5zaWVudCgncHNfa2F0X2R1b21lbnlzJyk7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'DEP84'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s=await snip('TEMP DEP84',B64);
  await new Promise(r=>setTimeout(r,6000));
  const t=await (await fetch(WP+'/?ps_sv=DEP84')).text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('dep84.json', Buffer.from(JSON.stringify(out)), 'dep84');
console.log('ok');
