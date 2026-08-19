process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const out={versija:'H063'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
function blokas(h, klase){
  const re=new RegExp('<(div|article|section)[^>]*class="[^"]*'+klase+'[^"]*"','i');
  const i=h.search(re); if(i<0) return '';
  let g=0,j=-1; const rr=/<\/?(div|article|section)\b[^>]*>/gi; rr.lastIndex=i; let m;
  while((m=rr.exec(h))!==null){ if(m[0].startsWith('</')) g--; else g++;
    if(g===0){ j=m.index+m[0].length; break; } if(rr.lastIndex>i+500000) break; }
  return j>i ? h.slice(i,j) : '';
}
function tekstas(x){ return x.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'')
  .replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim(); }
const SLUGS=['jorksyro-terjeras','biglis','senbernaras'];
const KAND=['blogDescription','blog-description','article__content','articleDescription',
            'blog__content','post-content','entry-content','content__text','description'];
try{
  out.r=[];
  for(const s of SLUGS){
    const x=await fetch('https://petshop.lt/'+s);
    const h=await x.text();
    const rasta=[];
    for(const k of KAND){
      const b=blokas(h,k);
      if(b.length>500) rasta.push({klase:k,zn:b.length,zodziu:tekstas(b).split(' ').length});
    }
    /* visos klases, kuriose yra zinomas teksto fragmentas */
    const zyme = s==='biglis' ? 'išlavinta uosle' : (s==='senbernaras'?'Šveicarijos':'ilgais');
    const idx=h.indexOf(zyme);
    let apl='';
    if(idx>0){
      const pre=h.slice(Math.max(0,idx-2000),idx);
      const kl=[...pre.matchAll(/class="([^"]+)"/g)].map(m=>m[1]).slice(-6);
      apl=kl.join(' | ');
    }
    out.r.push({s,http:x.status,psl_zn:h.length,rasta,zymes_poz:idx,klases_pries_zyme:apl,
      mojibake:/Å¡|Å¾|Ä…|Ä¯/.test(h)?1:0});
    await new Promise(r=>setTimeout(r,400));
  }
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/h063.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h063 seno turinio recon');
