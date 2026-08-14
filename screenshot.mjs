process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const URL='https://dev.avesa.lt/product/skanestu-deze-suniui-be-vistienos/';
const out={zingsniai:[]};
async function put(name,buf){
  try{ let sha=null;
    const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});
    if(g.status===200) sha=(await g.json()).sha;
    const body={message:name,content:buf.toString('base64')}; if(sha) body.sha=sha;
    await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
  }catch(e){ out.put_err=String(e).slice(0,100); }
}
async function zingsnis(pav, fn){
  try{ await fn(); out.zingsniai.push(pav+' OK'); }
  catch(e){ out.zingsniai.push(pav+' KLAIDA: '+String(e).split('\n')[0].slice(0,140)); }
}
let br,pg,ctx;
try{
  br=await chromium.launch({args:['--ignore-certificate-errors']});
  ctx=await br.newContext({viewport:{width:1440,height:1000},ignoreHTTPSErrors:true});
  pg=await ctx.newPage();
  const klaidos=[];
  pg.on('console',m=>{ if(m.type()==='error') klaidos.push(m.text().slice(0,110)); });
  pg.on('pageerror',e=>klaidos.push('PAGEERROR '+String(e).slice(0,110)));

  await zingsnis('atidarymas', async()=>{
    const r=await pg.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});
    out.http=r.status(); await pg.waitForTimeout(2000);
    out.blokas=await pg.locator('.pslk').count();
    out.korteliu=await pg.locator('.pslk-kort').count();
    out.foto=await pg.locator('.pslk-kort img').count();
    out.cta=(await pg.locator('#pslk-cta').innerText()).trim();
    out.cta_disabled=await pg.locator('#pslk-cta').isDisabled();
    await put('lk_1_pradzia.jpg', await pg.screenshot({type:'jpeg',quality:80,fullPage:true}));
  });

  const kort=()=>pg.locator('.pslk-kort').first();
  await zingsnis('1 vnt', async()=>{ await kort().locator('.pslk-deti').click(); await pg.waitForTimeout(400);
    out.po1_cta=(await pg.locator('#pslk-cta').innerText()).trim(); });
  await zingsnis('2 vnt', async()=>{ await kort().locator('.pslk-stp button[data-d="1"]').click(); await pg.waitForTimeout(350);
    out.po2_cta=(await pg.locator('#pslk-cta').innerText()).trim();
    out.po2_disabled=await pg.locator('#pslk-cta').isDisabled(); });
  await zingsnis('3 vnt', async()=>{ await kort().locator('.pslk-stp button[data-d="1"]').click(); await pg.waitForTimeout(350);
    out.po3_cta=(await pg.locator('#pslk-cta').innerText()).trim();
    out.po3_disabled=await pg.locator('#pslk-cta').isDisabled();
    out.po3_deze=await pg.locator('.pslk-el').count();
    out.po3_zenklas=await pg.locator('.pslk-el u').first().innerText().catch(()=>null); });
  await zingsnis('6 vnt', async()=>{
    for(let i=0;i<3;i++){ await kort().locator('.pslk-stp button[data-d="1"]').click(); await pg.waitForTimeout(150); }
    out.po6_dbr=(await pg.locator('#pslk-dbr').innerText()).trim();
    out.po6_kita=(await pg.locator('#pslk-kita').innerText()).trim();
    out.po6_viso=(await pg.locator('#pslk-viso').innerText()).trim();
    out.po6_po=(await pg.locator('#pslk-po').innerText()).trim();
    await put('lk_2_pilna.jpg', await pg.screenshot({type:'jpeg',quality:80,fullPage:true})); });
  await zingsnis('perziura', async()=>{
    await pg.locator('.pslk-apie').nth(2).click(); await pg.waitForTimeout(700);
    out.pz_rodo=await pg.locator('#pslk-pz.rodo').count();
    out.pz_apr=(await pg.locator('#pslk-pz-apr').innerText()).slice(0,90);
    await put('lk_3_perziura.jpg', await pg.screenshot({type:'jpeg',quality:80}));
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(400);
    out.pz_uzsidare=(await pg.locator('#pslk-pz.rodo').count())===0; });
  await zingsnis('i krepseli', async()=>{
    await pg.locator('#pslk-cta').click();
    await pg.waitForTimeout(4000);
    out.url_po=pg.url();
    out.klaidos_puslapyje=await pg.locator('.woocommerce-error').allInnerTexts().catch(()=>[]);
    await put('lk_4_po.jpg', await pg.screenshot({type:'jpeg',quality:80,fullPage:true})); });
  await zingsnis('krepselis', async()=>{
    const c=await ctx.newPage();
    await c.goto('https://dev.avesa.lt/cart/',{waitUntil:'domcontentloaded',timeout:60000});
    await c.waitForTimeout(2000);
    out.krepselio_eiluciu=await c.locator('.cart_item').count();
    out.krepselio_turinys=(await c.locator('.shop_table').first().innerText().catch(()=>'')).slice(0,700);
    out.sumos=(await c.locator('.cart_totals').first().innerText().catch(()=>'')).slice(0,400);
    await put('lk_5_krepselis.jpg', await c.screenshot({type:'jpeg',quality:80,fullPage:true})); });
  await zingsnis('krepselio zymes', async()=>{
    const c2=await ctx.newPage();
    await c2.goto('https://dev.avesa.lt/cart/',{waitUntil:'domcontentloaded',timeout:60000});
    await c2.waitForTimeout(1800);
    out.akcijos_zymes=await c2.locator('.onsale, .badge-container, .cart_item .onsale').allInnerTexts().catch(()=>[]);
    out.krepselis2=(await c2.locator('.shop_table').first().innerText().catch(()=>'')).slice(0,600);
  });
  await zingsnis('mobili', async()=>{
    const m=await br.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,ignoreHTTPSErrors:true});
    const mp=await m.newPage();
    await mp.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});
    await mp.waitForTimeout(2000);
    await mp.locator('.pslk-kort').first().locator('.pslk-deti').click();
    for(let i=0;i<4;i++){ await mp.locator('.pslk-kort').first().locator('.pslk-stp button[data-d="1"]').click(); await mp.waitForTimeout(120); }
    await mp.waitForTimeout(500);
    out.mob_dbr=(await mp.locator('#pslk-dbr').innerText()).trim();
    await put('lk_6_mobili.jpg', await mp.screenshot({type:'jpeg',quality:80,fullPage:true}));
  });
  out.js_klaidos=klaidos.slice(0,8);
}catch(e){ out.fatal=String(e).slice(0,300); }
finally{ if(br) await br.close(); }
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/lk.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'lk',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
const p=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/lk.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put lk.json',p.status);
