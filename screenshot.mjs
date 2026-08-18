process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const out={versija:'H023'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
const TESTAI=[
  {id:13610, url:'https://dev.avesa.lt/?p=13610'},
  {id:13048, url:'https://dev.avesa.lt/?p=13048'},
  {id:34969, url:'https://dev.avesa.lt/?p=34969'}
];
try{
  const {chromium}=await import('playwright');
  const br=await chromium.launch();
  const ctx=await br.newContext({viewport:{width:1400,height:1000},ignoreHTTPSErrors:true});
  out.rezultatai=[];
  for(const t of TESTAI){
    const pg=await ctx.newPage();
    const klaidos=[];
    pg.on('pageerror',e=>klaidos.push(String(e).slice(0,120)));
    const resp=await pg.goto(t.url,{waitUntil:'domcontentloaded',timeout:60000});
    await pg.waitForTimeout(2500);
    /* trumpo aprasymo blokas — ka MATO klientas (innerText, ne HTML) */
    const sel=['.product-short-description','.woocommerce-product-details__short-description','.product-summary .description'];
    let matoma=null, rastas=null;
    for(const s of sel){
      const el=await pg.$(s);
      if(el){ matoma=(await el.innerText()).trim(); rastas=s; break; }
    }
    const h1=await pg.$eval('h1',e=>e.innerText).catch(()=>'');
    out.rezultatai.push({
      id:t.id, http:resp?resp.status():0, url:pg.url(),
      h1:h1.slice(0,60),
      selektorius:rastas,
      matomas_tekstas:matoma?matoma.slice(0,200):null,
      TAGAI_MATOMI: matoma? (/<\/?p>/i.test(matoma)?1:0) : null,
      js_klaidos:klaidos.length
    });
    const png=await pg.screenshot({fullPage:false});
    await put('screenshots/h023_'+t.id+'.png', png, 'h023 vizualas '+t.id);
    await pg.close();
  }
  await br.close();
}catch(e){ out.klaida=String(e).slice(0,500); }
const zlib=await import('zlib');
await put('screenshots/h023.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h023 vizuali patikra');
