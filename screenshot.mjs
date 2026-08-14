process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const F={"23810": "https://dev.avesa.lt/wp-content/uploads/2026/06/85decf39-94a7-4157-8b38-6fa24a759bd8-280x280.png", "21908": "https://dev.avesa.lt/wp-content/uploads/2026/06/23b2530c-e785-4558-bf40-33f005c8c00f-280x280.png", "21259": "https://dev.avesa.lt/wp-content/uploads/2026/06/798dac73-0307-4b27-a30c-9bd56272bbf8-280x280.png"};
const IDS='21259,21908,22304,23810'.split(',');
const out={foto:{},apr:{}};
for (const [id,u] of Object.entries(F)){
  try{ const r=await fetch(u); if(r.status!==200){ out.foto[id]={err:r.status}; continue; }
    out.foto[id]={b64:Buffer.from(await r.arrayBuffer()).toString('base64')};
  }catch(e){ out.foto[id]={err:String(e).slice(0,60)}; }
}
const r=await fetch('https://dev.avesa.lt/wp-json/wc/v3/products?include='+IDS.join(',')+'&per_page=20&_fields=id,short_description,description',{headers:{Authorization:AUTH}});
out.apr_status=r.status;
if(r.status===200){ for(const p of await r.json()){ out.apr[p.id]={s:(p.short_description||'').slice(0,4000),d:(p.description||'').slice(0,4000)}; } }
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/nauji9.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'nauji9',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
const p=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/nauji9.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',p.status,Object.keys(out.foto).length,Object.keys(out.apr).length);
