process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c4MjQnXSk/JF9HRVRbJ3BzX2c4MjQnXTonJykgIT09ICdHODI0JykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJGY9V1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL2luY2x1ZGVzL2NsYXNzLXZmLWltcG9ydC5waHAnOwogJG89YXJyYXkoJ3YnPT4nRzgyNCcsJ2ZhaWxhcyc9PiRmLCd5cmEnPT5maWxlX2V4aXN0cygkZik/MTowKTsKIGlmKGZpbGVfZXhpc3RzKCRmKSl7CiAgICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICAgJG9bJ2R5ZGlzJ109c3RybGVuKCRzKTsgJG9bJ21kNSddPW1kNSgkcyk7CiAgICRMPWV4cGxvZGUoIlxuIiwkcyk7ICRvWydlaWx1Y2l1J109Y291bnQoJEwpOwogICAkb1snZnJhZ21lbnRhc18xOTBfMjUwJ109aW1wbG9kZSgiXG4iLCBhcnJheV9zbGljZSgkTCwxODksNjEpKTsKICAgJG9bJ2ZyYWdtZW50YXNfMzMwXzQwMCddPWltcGxvZGUoIlxuIiwgYXJyYXlfc2xpY2UoJEwsMzI5LDcxKSk7CiAgICRvWydmcmFnbWVudGFzXzUwMF81NzAnXT1pbXBsb2RlKCJcbiIsIGFycmF5X3NsaWNlKCRMLDQ5OSw3MSkpOwogfQogJG9bJ3BsdWdpbm9fdmVyc2lqYSddPWFycmF5KCk7CiAkcGY9V1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL3BldHNob3AteG1sLnBocCc7CiBpZihmaWxlX2V4aXN0cygkcGYpKXsgJGg9c3Vic3RyKGZpbGVfZ2V0X2NvbnRlbnRzKCRwZiksMCw5MDApOyAkb1sncGx1Z2lub192ZXJzaWphJ11bJ2FudHJhc3RlJ109JGg7IH0KICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'G824'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} out.snip_status=cr.s; return j?j.id:null; }
try{
  const s=await snip('TEMP G824 vf-import kodas',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g824=G824')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,500); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('g824.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g824 vf-import kodas');
