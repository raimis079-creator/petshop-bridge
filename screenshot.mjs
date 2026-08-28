process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const VER='SENAS-OPCIJOS-v1.0'; const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const UA={'User-Agent':'Mozilla/5.0 Chrome/126','Cache-Control':'no-cache'};

const sm=await (await fetch('https://petshop.lt/cache/xml/feed_google_sitemap_product1.xml',{headers:UA})).text();
const URLS=[...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
out.url_viso=URLS.length;

const nuvalyk=s=>s.replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();

async function preke(u){
  let t='';
  for(let i=0;i<3;i++){ try{ const r=await fetch(u,{headers:UA,redirect:'follow'}); if(r.status!==200) return {url:u,http:r.status}; t=await r.text(); break; }catch(e){ await miegok(3000);} }
  if(!t) return {url:u,http:0};
  const o={url:u,http:200};
  const sk=t.match(/"sku"\s*:\s*"([^"]{1,40})"/); o.sku=sk?sk[1]:'';
  const h1=t.match(/<h1[^>]*>([\s\S]*?)<\/h1>/); o.pav=h1?nuvalyk(h1[1]).slice(0,140):'';
  const pr=t.match(/"price"\s*:\s*"?([\d.]+)/); o.kaina=pr?pr[1]:'';
  o.yra = /InStock/.test(t) ? 1 : 0;
  o.grupes=[];
  for(const m of t.matchAll(/<select[^>]*name="option\[(\d+)\][^>]*>([\s\S]*?)<\/select>/g)){
    const vals=[];
    for(const om of m[2].matchAll(/<option[^>]*value="(\d+)"([\s\S]*?)>([\s\S]*?)<\/option>/g)){
      const atrib=om[2]||''; const lbl=nuvalyk(om[3]);
      if(!lbl || /Prašome pasirinkti/i.test(lbl)) continue;
      const ds=atrib.match(/data-sku="([^"]*)"/);
      const kn=lbl.match(/\(\s*=\s*€\s*([\d.,]+)\s*\)/) || lbl.match(/\(\s*\+\s*€\s*([\d.,]+)\s*\)/);
      vals.push({ reiksme: lbl.replace(/\([^)]*€[^)]*\)/,'').trim(), sku: ds?ds[1]:'', kaina: kn?kn[1]:'' });
    }
    if(vals.length) o.grupes.push({ grupe:m[1], reiksmiu:vals.length, su_kaina: vals.filter(v=>v.kaina).length, vals });
  }
  return o;
}

const rez=[]; const LYG=5;
for(let i=0;i<URLS.length;i+=LYG){
  const dalis=URLS.slice(i,i+LYG);
  const r=await Promise.all(dalis.map(preke));
  rez.push(...r);
  if(i%250===0) console.log('...',i,'/',URLS.length);
  await miegok(150);
}
out.apdorota=rez.length;
out.su_opcijomis=rez.filter(r=>r.grupes&&r.grupes.length).length;
out.su_kainos_opcijomis=rez.filter(r=>r.grupes&&r.grupes.some(g=>g.su_kaina>0)).length;
out.klaidos=rez.filter(r=>r.http!==200).length;
await put('analize/senas/opcijos.json', Buffer.from(JSON.stringify(rez)), VER);
await put('analize/senas_opcijos_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log(JSON.stringify(out).slice(0,900));
