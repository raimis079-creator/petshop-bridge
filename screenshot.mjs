process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={versija:'H030'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
try{
  const r=await api('/wp-json/code-snippets/v1/snippets/688');
  let j=null; try{j=JSON.parse(r.t);}catch(e){}
  if(j){ out.vardas=j.name; out.aktyvus=j.active; out.scope=j.scope; out.prioritetas=j.priority;
         out.kodo_ilgis=(j.code||'').length; out.kodas=j.code; }
  else out.klaida_snip='HTTP '+r.s+' '+r.t.slice(0,200);
  /* visi aktyvus snippetai su "Kategorij" pavadinime */
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  out.giminingi=(Array.isArray(sar)?sar:[]).filter(s=>/kategorij|landing/i.test(s.name||''))
     .map(s=>({id:s.id,name:s.name,active:s.active}));
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h030.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h030 snippetas 688');
