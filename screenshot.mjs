process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const out={versija:'H051'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
const URLS=['jorksyro-terjeras','taksas','rusu-melynoji','kaukazo-aviganis','dzeko-raselo-terjeras','suns-serimo-lentele-gramais'];
function tarpTagu(h, klases){
  for(const k of klases){
    const re=new RegExp('<(div|article|section)[^>]*class="[^"]*'+k+'[^"]*"','i');
    const i=h.search(re);
    if(i<0) continue;
    let g=0, j=i;
    const rr=/<\/?(div|article|section)\b[^>]*>/gi; rr.lastIndex=i;
    let m;
    while((m=rr.exec(h))!==null){
      if(m[0].startsWith('</')) g--; else g++;
      if(g===0){ j=m.index+m[0].length; break; }
      if(rr.lastIndex>i+400000) break;
    }
    if(j>i+300) return h.slice(i,j);
  }
  return '';
}
function tekstas(x){
  return x.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'')
          .replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&')
          .replace(/\s+/g,' ').trim();
}
try{
  out.straipsniai=[];
  for(const s of URLS){
    let h='';
    try{ const r=await fetch('https://dev.avesa.lt/'+s+'/'); h=await r.text(); out.http=r.status; }
    catch(e){ out.straipsniai.push({s,kl:String(e).slice(0,70)}); continue; }
    const blk=tarpTagu(h,['entry-content','post-content','page-content','entry','large-12']) || h;
    const t=tekstas(blk);
    const nuor=[...blk.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
      .map(m=>({h:m[1],t:tekstas(m[2]).slice(0,45)}));
    const vid=nuor.filter(a=>a.h.startsWith('/')||a.h.includes('dev.avesa.lt'));
    const kat=vid.filter(a=>a.h.includes('/kategorija/'));
    const pr =vid.filter(a=>a.h.includes('/product/'));
    const gam=vid.filter(a=>a.h.includes('/gamintojas/'));
    const h2=[...blk.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m=>tekstas(m[1]).slice(0,52));
    const h3=[...blk.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map(m=>tekstas(m[1]).slice(0,40));
    const md=h.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i);
    out.straipsniai.push({s, zodziu:t.split(' ').filter(Boolean).length, zn:t.length,
      h2, h3, img:(blk.match(/<img\b/gi)||[]).length,
      vidiniu:vid.length, isoriniu:nuor.length-vid.length,
      i_kategorijas:kat.map(a=>a.t+' -> '+a.h.replace('https://dev.avesa.lt','')),
      i_prekes:pr.map(a=>a.t+' -> '+a.h.replace('https://dev.avesa.lt','')),
      i_gamintojus:gam.map(a=>a.t),
      susije_prekes:/related|upsell|cross-sell|products/i.test(blk)?1:0,
      meta:md?md[1].slice(0,140):'', pradzia:t.slice(0,220)});
    await new Promise(r=>setTimeout(r,300));
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h051.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h051 veisliu analize');
