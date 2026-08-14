process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const URL='https://dev.avesa.lt/product/skanestu-deze-suniui-be-vistienos/';
const out={};
async function put(name,buf){
  let sha=null;
  try{const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:name,content:buf.toString('base64')}; if(sha) body.sha=sha;
  const p=await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
  console.log('put',name,p.status);
}
const br=await chromium.launch({args:['--ignore-certificate-errors']});
const ctx=await br.newContext({viewport:{width:1440,height:1000},ignoreHTTPSErrors:true});
const pg=await ctx.newPage();
const klaidos=[]; pg.on('console',m=>{ if(m.type()==='error') klaidos.push(m.text().slice(0,120)); });
pg.on('pageerror',e=>klaidos.push('PAGEERROR '+String(e).slice(0,120)));
const r=await pg.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});
out.http=r.status();
await pg.waitForTimeout(1800);
out.blokas = await pg.locator('.pslk').count();
out.korteliu = await pg.locator('.pslk-kort').count();
out.foto = await pg.locator('.pslk-kort img').count();
out.cta_pradzia = (await pg.locator('#pslk-cta').textContent().catch(()=>'')).trim();
out.cta_disabled = await pg.locator('#pslk-cta').isDisabled().catch(()=>null);
await put('lk_1_pradzia.jpg', await pg.screenshot({type:'jpeg',quality:80,fullPage:true}));

/* 2 vnt — CTA turi likti uzrakintas */
await pg.locator('.pslk-kort').first().locator('.pslk-deti').click();
await pg.locator('#pslk-k-'+ (await pg.locator('.pslk-kort').first().getAttribute('id')).replace('pslk-k-','') + ' .pslk-stp button[data-d="1"]').click();
await pg.waitForTimeout(400);
out.po2_cta=(await pg.locator('#pslk-cta').textContent()).trim();
out.po2_disabled=await pg.locator('#pslk-cta').isDisabled();

/* 3 vnt */
await pg.locator('.pslk-kort').first().locator('.pslk-stp button[data-d="1"]').click();
await pg.waitForTimeout(300);
out.po3_cta=(await pg.locator('#pslk-cta').textContent()).trim();
out.po3_disabled=await pg.locator('#pslk-cta').isDisabled();
out.po3_deze=await pg.locator('.pslk-el').count();
out.po3_zenkl=await pg.locator('.pslk-el u').first().textContent().catch(()=>null);

/* iki -2 %: dar 3 vnt */
for(let i=0;i<3;i++){ await pg.locator('.pslk-kort').first().locator('.pslk-stp button[data-d="1"]').click(); await pg.waitForTimeout(120); }
out.po6_dbr=(await pg.locator('#pslk-dbr').textContent()).trim();
out.po6_viso=(await pg.locator('#pslk-viso').textContent()).trim();
out.po6_po=(await pg.locator('#pslk-po').textContent()).trim();
await put('lk_2_pilna.jpg', await pg.screenshot({type:'jpeg',quality:80,fullPage:true}));

/* greita perziura */
await pg.locator('.pslk-apie').nth(2).click();
await pg.waitForTimeout(600);
out.pz_rodo=await pg.locator('#pslk-pz.rodo').count();
out.pz_apr_ilgis=(await pg.locator('#pslk-pz-apr').textContent()).length;
await put('lk_3_perziura.jpg', await pg.screenshot({type:'jpeg',quality:80}));
await pg.keyboard.press('Escape'); await pg.waitForTimeout(300);
out.pz_uzsidare=(await pg.locator('#pslk-pz.rodo').count())===0;

/* ADD TO CART — tikras kelias */
await pg.locator('#pslk-cta').click();
await pg.waitForTimeout(3500);
out.po_krepselio_url=pg.url();
out.klaidu_zinutes=await pg.locator('.woocommerce-error, .message-container .woocommerce-error li').allTextContents().catch(()=>[]);
await put('lk_4_po_krepselio.jpg', await pg.screenshot({type:'jpeg',quality:80,fullPage:true}));
const cart=await ctx.newPage();
await cart.goto('https://dev.avesa.lt/cart/',{waitUntil:'domcontentloaded'});
await cart.waitForTimeout(1500);
out.krepselio_eilutes=await cart.locator('.cart_item').count();
out.krepselio_tekstas=(await cart.locator('.cart-collaterals, .cart_totals').first().innerText().catch(()=>'')).slice(0,300);
await put('lk_5_krepselis.jpg', await cart.screenshot({type:'jpeg',quality:80,fullPage:true}));
out.js_klaidos=klaidos.slice(0,6);
await br.close();
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/lk.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'lk',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/lk.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log(JSON.stringify(out));
