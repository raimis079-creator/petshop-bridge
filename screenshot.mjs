process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function api(path){ const r=await fetch(WP+path,{headers:{Authorization:AUTH,'Content-Type':'application/json'}}); return {s:r.status,t:await r.text()}; }
for (const id of [559]) {
  try{ const r=await api('/wp-json/code-snippets/v1/snippets/'+id);
    const j=JSON.parse(r.t);
    out['s'+id]={pav:j.name,ilgis:(j.code||'').length,kodas:j.code||''};
  }catch(e){ out['e'+id]=String(e).slice(0,150); }
}
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/s559.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/s559.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
