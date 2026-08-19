process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const out={versija:'H050'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
const URLS=['jorksyro-terjeras','taksas','rusu-melynoji','kaukazo-aviganis','dzeko-raselo-terjeras'];
try{
  const {chromium}=await import('playwright');
  const br=await chromium.launch();
  out.straipsniai=[];
  for(const s of URLS){
    const ctx=await br.newContext({viewport:{width:1400,height:1000},ignoreHTTPSErrors:true});
    const pg=await ctx.newPage();
    let r;
    try{ r=await pg.goto('https://dev.avesa.lt/'+s+'/',{waitUntil:'domcontentloaded',timeout:60000}); }
    catch(e){ out.straipsniai.push({s,kl:String(e).slice(0,80)}); await ctx.close(); continue; }
    await pg.waitForTimeout(2000);
    try{ await pg.evaluate(()=>{document.querySelectorAll('#cmplz-cookiebanner-container,.cmplz-cookiebanner').forEach(e=>e.remove());}); }catch(e){}
    const d=await pg.evaluate(()=>{
      const turinys = document.querySelector('.entry-content')||document.querySelector('article')||document.body;
      const t=turinys.innerText||'';
      const nuor=[...turinys.querySelectorAll('a')].map(a=>({h:a.getAttribute('href')||'',t:(a.innerText||'').trim().slice(0,40)}));
      const vidines=nuor.filter(a=>a.h.startsWith('/')||a.h.includes('dev.avesa.lt'));
      const kat=vidines.filter(a=>a.h.includes('/kategorija/'));
      const pr=vidines.filter(a=>a.h.includes('/product/'));
      const gam=vidines.filter(a=>a.h.includes('/gamintojas/'));
      const h2=[...turinys.querySelectorAll('h2')].map(e=>e.innerText.trim().slice(0,50));
      const h3=[...turinys.querySelectorAll('h3')].map(e=>e.innerText.trim().slice(0,40));
      const img=turinys.querySelectorAll('img').length;
      // ar yra prekiu blokas
      const prekiuBlokas = !!(document.querySelector('.products')||document.querySelector('ul.products'));
      const mygtukai=[...turinys.querySelectorAll('a.button,.btn,button')].map(e=>(e.innerText||'').trim().slice(0,30)).filter(Boolean);
      const md=document.querySelector('meta[name="description"]');
      return {zodziu:t.split(/\s+/).filter(Boolean).length, zn:t.length,
              h2, h3, img, nuoru:nuor.length, vidiniu:vidines.length,
              i_kategorijas:kat.map(a=>a.t+' -> '+a.h.replace('https://dev.avesa.lt','')),
              i_prekes:pr.map(a=>a.t+' -> '+a.h.replace('https://dev.avesa.lt','')),
              i_gamintojus:gam.map(a=>a.t),
              prekiu_blokas:prekiuBlokas, mygtukai,
              title:document.title.slice(0,80), meta:md?md.content.slice(0,150):'',
              psl_aukstis:document.body.scrollHeight};
    });
    d.s=s; d.http=r?r.status():0;
    out.straipsniai.push(d);
    await put('screenshots/h050_'+s+'.png', await pg.screenshot({fullPage:false}), 'h050 '+s);
    await ctx.close();
  }
  await br.close();
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h050.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h050 veisliu straipsniai');
