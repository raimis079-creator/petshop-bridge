process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const out={versija:'H092'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
function schema(html){
  const ld=[...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
  const tipai=[]; let bc=null;
  for(const b of ld){ try{ const j=JSON.parse(b); const g=j['@graph']||[j];
    for(const x of g){ const t=x['@type']; if(!t) continue;
      const tn=Array.isArray(t)?t.join('/'):t; tipai.push(tn);
      if(/BreadcrumbList/.test(tn) && x.itemListElement) bc=x.itemListElement.map(i=>(i.name||(i.item&&i.item.name)||'?'));
    } }catch(e){ tipai.push('NEPARSINTA'); } }
  return {blokai:ld.length, tipai, breadcrumb_elementai:bc};
}
async function tirk(vardas,u){
  try{ const r=await fetch(u); const h=await r.text(); const s=schema(h);
    out[vardas]={url:String(u).replace(WP,''), http:r.status, ...s,
      breadcrumb_html: /woocommerce-breadcrumb|rank-math-breadcrumb|class="[^"]*breadcrumb/i.test(h)?'yra':'nera',
      canonical:(h.match(/<link rel="canonical"[^>]*href="([^"]+)"/i)||[null,'NERA'])[1],
      og_image:(h.match(/<meta property="og:image"[^>]*content="([^"]+)"/i)||[null,'nera'])[1]};
  }catch(e){ out[vardas]={klaida:String(e).slice(0,120)}; }
}
try{
  const idx=await (await fetch(WP+'/sitemap_index.xml')).text();
  const failai=[...idx.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(m=>m[1]);
  out.sitemap_failai=failai.map(f=>f.replace(WP,''));
  const imk=async(zym)=>{ const f=failai.find(x=>x.includes(zym)); if(!f) return null;
    const x=await (await fetch(f)).text(); const u=[...x.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(m=>m[1]); return u[Math.min(1,u.length-1)]||null; };
  const preke=await imk('product-sitemap') || 'https://dev.avesa.lt/product/sampunas-neutralizuojantis-nemalonius-kvapus-frexin-220-g/';
  const kat  =await imk('product_cat-sitemap');
  const str  =await imk('post-sitemap');
  const psl  =await imk('page-sitemap');
  await tirk('PRADINIS', WP+'/');
  await tirk('PREKE', preke);
  if(kat) await tirk('KATEGORIJA', kat);
  if(str) await tirk('STRAIPSNIS', str);
  if(psl) await tirk('PUSLAPIS', psl);
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h092.json', Buffer.from(JSON.stringify(out,null,1)), 'h092 schema penkiuose puslapiu tipuose');
