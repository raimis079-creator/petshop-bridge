process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={versija:'H026'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
function bloke(h, klase){
  const i=h.search(new RegExp('<div[^>]*class="[^"]*'+klase+'[^"]*"','i'));
  if(i<0) return '';
  let gylis=0, j=i;
  const re=/<\/?div\b[^>]*>/gi; re.lastIndex=i;
  let m;
  while((m=re.exec(h))!==null){
    if(m[0].startsWith('</')) gylis--; else gylis++;
    if(gylis===0){ j=m.index+m[0].length; break; }
    if(re.lastIndex>i+60000) break;
  }
  return h.slice(i,j);
}
function tekstas(x){
  return x.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'')
          .replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ')
          .replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#039;/g,"'")
          .replace(/\s+/g,' ').trim();
}
function meta(h,vardas,tipas){
  const re=new RegExp('<meta[^>]+'+tipas+'=["\']'+vardas+'["\'][^>]+content=["\']([^"\']*)["\']','i');
  const m=h.match(re); return m?m[1]:'';
}
try{
  const r=await fetch('https://petshop.lt/system/cache/feed_google_sitemap_category.xml');
  const x=await r.text();
  const urls=[...x.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  out.rasta_url=urls.length;
  out.kategorijos=[];
  for(const u of urls){
    try{
      const p=await fetch(u); const h=await p.text();
      const blk=bloke(h,'categoryDescription');
      const t=tekstas(blk);
      const tit=(h.match(/<title>([\s\S]*?)<\/title>/i)||['',''])[1].trim();
      const md=meta(h,'description','name');
      const ogd=meta(h,'og:description','property');
      const h1=(h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||['',''])[1].replace(/<[^>]+>/g,'').trim();
      const kiek=(h.match(/Rodoma nuo \d+ iki \d+ iš (\d+)/)||['',''])[1];
      out.kategorijos.push({
        url:u, h1:h1.slice(0,70), title:tit.slice(0,140), title_ilg:tit.length,
        meta_desc:md.slice(0,260), md_ilg:md.length,
        og_desc:ogd.slice(0,160),
        tekstas:t.slice(0,2500), teksto_ilg:t.length,
        zodziu: t? t.split(' ').length:0,
        paantrastes:(blk.match(/<h[23]\b/gi)||[]).length,
        sarasai:(blk.match(/<li\b/gi)||[]).length,
        spam:/[✓➤✔🔹★]|ATNAUJINTA/.test(t+tit+md)?1:0,
        prekiu:kiek?parseInt(kiek):null
      });
      await new Promise(s=>setTimeout(s,250));
    }catch(e){ out.kategorijos.push({url:u,klaida:String(e).slice(0,90)}); }
  }
  /* naujos svetaines kategorijos */
  const nk=[];
  for(let pg=1;pg<=3;pg++){
    const q=await fetch(WP+'/wp-json/wc/v3/products/categories?per_page=100&page='+pg,{headers:{Authorization:AUTH}});
    if(q.status!==200) break;
    const j=await q.json(); if(!Array.isArray(j)||!j.length) break;
    for(const t of j) nk.push({id:t.id,name:t.name,slug:t.slug,parent:t.parent,count:t.count,
                               aprasymas_ilg:(t.description||'').length});
    if(j.length<100) break;
  }
  out.naujos_kategorijos=nk;
  out.naujos_kiekis=nk.length;
  out.naujos_su_aprasymu=nk.filter(t=>t.aprasymas_ilg>0).length;
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h026.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h026 senu kategoriju derlius');
