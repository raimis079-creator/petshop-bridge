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
  }catch(e){}
}
async function z(p,fn){ try{ await fn(); out.zingsniai.push(p+' OK'); }catch(e){ out.zingsniai.push(p+' KLAIDA: '+String(e).split('\n')[0].slice(0,120)); } }
let br;
try{
  br=await chromium.launch({args:['--ignore-certificate-errors']});
  const ctx=await br.newContext({viewport:{width:1440,height:1000},ignoreHTTPSErrors:true});
  const pg=await ctx.newPage();
  const kl=[]; pg.on('pageerror',e=>kl.push(String(e).slice(0,110)));
  await z('atidarymas', async()=>{
    await pg.goto(URL,{waitUntil:'domcontentloaded',timeout:60000}); await pg.waitForTimeout(2000);
    out.mygtuku=await pg.locator('.pslk-lbtn').count();
    out.mygtukai=await pg.locator('.pslk-lbtn').allInnerTexts();
    out.aktyvus=(await pg.locator('.pslk-lbtn.on').innerText().catch(()=>'')).trim();
    await put('lk7_juosta.jpg', await pg.screenshot({type:'jpeg',quality:80,clip:{x:0,y:0,width:1440,height:640}}));
  });
  await z('persijungimas i mono', async()=>{
    const nuoroda=pg.locator('.pslk-lbtn', {hasText:'Monoproteinas'});
    await nuoroda.click(); await pg.waitForLoadState('domcontentloaded'); await pg.waitForTimeout(2000);
    out.mono_url=pg.url();
    out.mono_h1=(await pg.locator('.pslk-h1').innerText()).split('\n')[0].trim();
    out.mono_pakopos=(await pg.locator('.pslk-pakopos').innerText()).trim();
    out.mono_korteliu=await pg.locator('.pslk-kort').count();
    out.mono_aktyvus=(await pg.locator('.pslk-lbtn.on').innerText()).trim();
  });
  await z('mono: 6 vnt brangesnes', async()=>{
    const k=pg.locator('.pslk-kort').last();
    await k.locator('.pslk-deti').click(); await pg.waitForTimeout(300);
    for(let i=0;i<3;i++){ await k.locator('.pslk-stp button[data-d="1"]').click(); await pg.waitForTimeout(150); }
    out.mono_dbr=(await pg.locator('#pslk-dbr').innerText()).trim();
    out.mono_kita=(await pg.locator('#pslk-kita').innerText()).trim();
    out.mono_viso=(await pg.locator('#pslk-viso').innerText()).trim();
    await put('lk8_mono.jpg', await pg.screenshot({type:'jpeg',quality:80,fullPage:true}));
  });
  out.js_klaidos=kl.slice(0,5);
}catch(e){ out.fatal=String(e).slice(0,200); }
finally{ if(br) await br.close(); }
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/lk2.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'lk2',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/lk2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
