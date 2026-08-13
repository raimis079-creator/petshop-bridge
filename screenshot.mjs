process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { chromium } from 'playwright';
const B='https://dev.avesa.lt';
const TOK=process.env.GH_TOKEN||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'FRONT MNM STRUKTURA'};
try{
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1500,height:1200}});
  const pg=await ctx.newPage();
  await pg.goto(B+'/?post_type=product&p=34918&preview=true',{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForTimeout(5000);
  out.info=await pg.evaluate(()=>{
    const n=s=>(s||'').replace(/\s+/g,' ').trim();
    const f=document.querySelector('form.cart, .mnm_form, form.mnm_form');
    const el=[];
    if(f){
      f.querySelectorAll('*').forEach(x=>{
        const t=n(x.textContent);
        if(!t || t.length>90) return;
        if(x.children.length>2) return;
        el.push({tag:x.tagName.toLowerCase(),cls:(x.className||'').toString().slice(0,60),txt:t.slice(0,80)});
      });
    }
    return {
      yraForma:!!f,
      formaKlases:f?(f.className||'').toString():'',
      elementai:el.slice(0,40),
      angliski:[...document.querySelectorAll('body *')].map(x=>n(x.textContent))
        .filter(t=>t.length<120 && /You have selected|Clear selection|PRODUCT|QUANTITY|items|Add to cart to continue/i.test(t))
        .slice(0,10),
      kaina:n((document.querySelector('.price')||{}).textContent),
      statusas:n((document.querySelector('.mnm_price, .mnm-container-status, .mnm_message, .woocommerce-mnm-status')||{}).textContent),
      klases:[...new Set([...document.querySelectorAll('[class*="mnm"]')].map(x=>(x.className||'').toString().split(' ').filter(c=>c.includes('mnm')).join(' ')))].slice(0,20)
    };
  });
  await pg.screenshot({path:'screenshots/front_mnm.png',fullPage:false});
  await br.close();
}catch(e){ out.err=String(e).slice(0,300); }
async function put(p,buf,m){const r=await fetch('https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/'+p,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify({message:m,content:buf.toString('base64')})});return r.status}
if(fs.existsSync('screenshots/front_mnm.png')) await put('screenshots/front_mnm.png',fs.readFileSync('screenshots/front_mnm.png'),'front mnm shot');
console.log(await put('screenshots/front_mnm.json',Buffer.from(JSON.stringify(out,null,1)),'front mnm rez'));
