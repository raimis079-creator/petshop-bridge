process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX205MzEnXSk/JF9HRVRbJ3BzX205MzEnXTonJykhPT0nTTkzMScpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgzMDApOwogJG89YXJyYXkoJ3YnPT4nTTkzMScpOwogJGJhc2U9V1BfUExVR0lOX0RJUi4nL3dvb2NvbW1lcmNlLW1peC1hbmQtbWF0Y2gtcHJvZHVjdHMvaW5jbHVkZXMvJzsKICRpbWs9ZnVuY3Rpb24oJHJlbCwkbmVlZGxlcywkcHJpZXM9NiwkcG89MTgpIHVzZSAoJGJhc2UpewogICAkcD0kYmFzZS4kcmVsOyBpZighQGlzX3JlYWRhYmxlKCRwKSkgcmV0dXJuICdORVJBJzsKICAgJGw9ZmlsZSgkcCk7ICRvdXQ9YXJyYXkoKTsKICAgZm9yZWFjaCgkbCBhcyAkaT0+JHJvdyl7CiAgICAgZm9yZWFjaCgkbmVlZGxlcyBhcyAkbmQpewogICAgICAgaWYoc3RyaXBvcygkcm93LCRuZCkhPT1mYWxzZSl7CiAgICAgICAgICRhPW1heCgwLCRpLSRwcmllcyk7ICRiPW1pbihjb3VudCgkbCktMSwkaSskcG8pOwogICAgICAgICAkb3V0W109YXJyYXkoJ2VpbCc9PiRpKzEsJ25kJz0+JG5kLCdrb2Rhcyc9PmltcGxvZGUoJycsYXJyYXlfc2xpY2UoJGwsJGEsJGItJGErMSkpKTsKICAgICAgICAgYnJlYWs7CiAgICAgICB9CiAgICAgfQogICB9CiAgIHJldHVybiAkb3V0OwogfTsKICRvWydjaGlsZF9pdGVtJ109JGltaygnY2xhc3Mtd2MtbW5tLWNoaWxkLWl0ZW0ucGhwJyxhcnJheSgnZnVuY3Rpb24gaXNfdmlzaWJsZScsJ2lzX3Zpc2libGUoKScpLDQsMTQpOwogJG9bJ2FsbG93ZWQnXT0kaW1rKCdjbGFzcy13Yy1wcm9kdWN0LW1peC1hbmQtbWF0Y2gucGhwJyxhcnJheSgnZnVuY3Rpb24gaXNfYWxsb3dlZF9jaGlsZF9wcm9kdWN0JywnZnVuY3Rpb24gZ2V0X2NoaWxkX2l0ZW1zKCcpLDIsMzApOwogJG9bJ3N0b3JlYXBpJ109JGltaygnYXBpL2NsYXNzLXdjLW1ubS1zdG9yZS1hcGkucGhwJyxhcnJheSgnY2F0YWxvZ192aXNpYmlsaXR5JyksNCwxMCk7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'M931'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  const r=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
  return r.status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s=await snip('TEMP M931',B64);
  out.snip=s;
  await new Promise(r=>setTimeout(r,6000));
  const r=await fetch(WP+'/?ps_m931=M931');
  out.http=r.status;
  const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,1200); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('m931.json', Buffer.from(JSON.stringify(out)), 'm931 kodas');
