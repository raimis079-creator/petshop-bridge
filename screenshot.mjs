process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2Y5MjEnXSk/JF9HRVRbJ3BzX2Y5MjEnXTonJykhPT0nRjkyMScpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCg2MDApOwogJG89YXJyYXkoJ3YnPT4nRjkyMScpOwogZm9yZWFjaChhcnJheSgKICAgJ2ZmJz0+J3dwLWNvbnRlbnQvcGx1Z2lucy9wZXRzaG9wLXhtbC9pbmNsdWRlcy9jbGFzcy1mdWxmaWxsbWVudC1zb3VyY2UucGhwJywKICAgJ2ZmYic9Pid3cC1jb250ZW50L3BsdWdpbnMvcGV0c2hvcC14bWwvaW5jbHVkZXMvY2xhc3MtZnVsZmlsbG1lbnQucGhwJywKICAgJ2F2Jz0+J3dwLWNvbnRlbnQvbXUtcGx1Z2lucy9wZXRzaG9wLWF2LXNvdXJjZS5waHAnLAogICAnYXZsJz0+J3dwLWNvbnRlbnQvbXUtcGx1Z2lucy9wZXRzaG9wLWF2LWxpbWl0LnBocCcsCiApIGFzICRrPT4kcmVsKXsKICAgJHA9QUJTUEFUSC4kcmVsOwogICAkb1ska109IEBpc19yZWFkYWJsZSgkcCkgPyBiYXNlNjRfZW5jb2RlKGZpbGVfZ2V0X2NvbnRlbnRzKCRwKSkgOiAnTkVSQSc7CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'F921'};
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
  const s=await snip('TEMP F921',B64);
  await new Promise(r=>setTimeout(r,6000));
  const t=await (await fetch(WP+'/?ps_f921=F921')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,900); }
  await off(s);
  await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('f921.json', Buffer.from(JSON.stringify(out)), 'f921 saltiniai');
