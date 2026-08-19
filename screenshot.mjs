process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const out={versija:'H052'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
function blokas(h){
  for(const k of ['entry-content','post-content','page-content']){
    const re=new RegExp('<(div|article|section)[^>]*class="[^"]*'+k+'[^"]*"','i');
    const i=h.search(re); if(i<0) continue;
    let g=0,j=i; const rr=/<\/?(div|article|section)\b[^>]*>/gi; rr.lastIndex=i; let m;
    while((m=rr.exec(h))!==null){ if(m[0].startsWith('</')) g--; else g++;
      if(g===0){ j=m.index+m[0].length; break; } if(rr.lastIndex>i+400000) break; }
    if(j>i+300) return h.slice(i,j);
  }
  return '';
}
try{
  out.r=[];
  for(const s of ['jorksyro-terjeras','taksas','dzeko-raselo-terjeras','rusu-melynoji']){
    const r=await fetch('https://dev.avesa.lt/'+s+'/');
    const ct=r.headers.get('content-type')||'';
    const buf=Buffer.from(await r.arrayBuffer());
    const h=buf.toString('utf8');
    const blk=blokas(h)||'';
    const nuor=[...blk.matchAll(/<a[^>]+href="([^"]+)"/gi)].map(m=>m[1]);
    const grupes={};
    for(const u of nuor){
      let k='kita';
      if(u.includes('petshop.lt')) k='petshop.lt (absoliuti)';
      else if(u.startsWith('/')) k='santykine';
      else if(u.startsWith('#')) k='inkaras';
      else if(u.startsWith('mailto')||u.startsWith('tel')) k='kontaktas';
      else if(/facebook|instagram|youtube/i.test(u)) k='soc';
      else if(u.startsWith('http')) k='isorine';
      grupes[k]=(grupes[k]||0)+1;
    }
    out.r.push({s, content_type:ct, blk_zn:blk.length,
      nuoru:nuor.length, grupes, pvz:nuor.slice(0,10),
      mojibake:/Ã|Å¡|Å¾|Ä/.test(h)?1:0,
      charset:(h.match(/<meta[^>]+charset=["']?([\w-]+)/i)||['',''])[1]});
    await new Promise(x=>setTimeout(x,300));
  }
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/h052.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h052 nuorodu tipai');
