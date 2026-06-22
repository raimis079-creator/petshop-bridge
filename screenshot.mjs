import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const isBuf=Buffer.isBuffer(obj);
  const b64=isBuf?obj.toString('base64'):Buffer.from((typeof obj==='string')?obj:JSON.stringify(obj,null,1),'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/pp.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/pp.json "'+url+'"',{encoding:'utf8',maxBuffer:200000000}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS="1782158594";
const PRODS=[
 {n:'06',slug:'sampunas',url:'https://dev.avesa.lt/product/naturalus-sampunas-jorksyro-terjerams-super-beno-york-300-ml/?ps_desc=1'},
 {n:'07',slug:'narvas',url:'https://dev.avesa.lt/product/trixie-metalinis-narvas-xl-116x86x77-cm/?ps_desc=1'},
 {n:'08',slug:'draskykle',url:'https://dev.avesa.lt/product/trixie-baza-draskykle-2-stulpai-su-guoliu-50-cm-sviesi/?ps_desc=1'},
 {n:'09',slug:'tualetas',url:'https://dev.avesa.lt/product/nobleza-atviras-tualetas-katems-44-5x34x18-5cm/?ps_desc=1'},
 {n:'10',slug:'dubenelis',url:'https://dev.avesa.lt/product/dvigubas-chromuotas-dubenelis-sunims/?ps_desc=1'},
];
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
const dctx = await browser.newContext({ viewport:{width:1440,height:1000}, ignoreHTTPSErrors:true, deviceScaleFactor:1 });
const mctx = await browser.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, ignoreHTTPSErrors:true, deviceScaleFactor:1 });
const dpage=await dctx.newPage(); const mpage=await mctx.newPage();
async function autoscroll(page){ await page.evaluate(async()=>{ await new Promise(r=>{ let y=0; const t=setInterval(()=>{ window.scrollBy(0,700); y+=700; if(y>document.body.scrollHeight+1500){clearInterval(t);r();} },120); }); }); await page.evaluate(()=>window.scrollTo(0,0)); await page.waitForTimeout(500); }
async function openDesc(page){ try{ const tl=await page.$('li.description_tab a, a[href="#tab-description"]'); if(tl){ await tl.click(); await page.waitForTimeout(600);} }catch(e){} }
const data=[];
for(const p of PRODS){
  const rec={n:p.n,slug:p.slug,url:p.url};
  try{
    await dpage.goto(p.url,{waitUntil:'domcontentloaded',timeout:70000}); await dpage.waitForTimeout(2200);
    await openDesc(dpage); await autoscroll(dpage);
    rec.html = await dpage.evaluate(()=>{
      const q=s=>document.querySelector(s);
      const t=(q('h1.product-title')||q('h1.product_title')||q('.product-title')||{}); const title=(t.innerText||document.title||'').trim();
      const se=q('.woocommerce-product-details__short-description')||q('.product-short-description')||q('div[itemprop=description]');
      const short_html=se?se.innerHTML.trim():''; const short_text=se?se.innerText:'';
      const te=q('#tab-description')||q('.woocommerce-tabs')||q('.product-tabs');
      let desc_html=te?te.innerHTML:''; const desc_text=te?te.innerText:'';
      if(desc_html.length>9000) desc_html=desc_html.slice(0,9000)+'\n<!-- TRUNCATED -->';
      const acc=q('.ps-desc-acc'); const sections=[...document.querySelectorAll('.ps-desc-acc summary')].map(s=>s.textContent.trim());
      let fbtEl=q('.related.products')||q('.up-sells')||q('.cross-sells')||q('.petshop-fbt')||q('.ps-fbt');
      if(!fbtEl){ const hs=[...document.querySelectorAll('h2,h3,h4,.title-wrapper,section')]; for(const e of hs){ if(/Da\u017Enai perkama kartu|Susij\u0119 prek|Pana\u0161ios prek|perkama kartu/i.test(e.textContent||'')){ fbtEl=e.closest('section')||e.parentElement; break; } } }
      let fbt_html=fbtEl?fbtEl.outerHTML:''; if(fbt_html.length>3500) fbt_html=fbt_html.slice(0,3500)+' <!-- TRUNC -->';
      const has_table=/<table/i.test(desc_html);
      const stray_short=/<\/?(p|strong|span|em|div|ul|li|br)\b|&lt;|&nbsp;|<style|\.b2b-/i.test(short_text);
      const stray_desc=/<\/?(p|strong|span|em|div)\b|&lt;|<style|\.b2b-/i.test(desc_text);
      return {title,short_html,short_text_sample:short_text.slice(0,200),desc_html,has_accordion:!!acc,sections,fallback:!acc,fbt_present:!!fbtEl,fbt_html,has_feeding_table:has_table,stray_short,stray_desc,page_height:document.body.scrollHeight};
    });
    rec.png_desktop=putResult('aud_'+p.n+'_desktop_'+p.slug+'_'+TS+'.png', await dpage.screenshot({fullPage:true}));
    await mpage.goto(p.url,{waitUntil:'domcontentloaded',timeout:70000}); await mpage.waitForTimeout(2200);
    await openDesc(mpage); await autoscroll(mpage);
    rec.png_mobile=putResult('aud_'+p.n+'_mobile_'+p.slug+'_'+TS+'.png', await mpage.screenshot({fullPage:true}));
  }catch(e){ rec.err=e.message.slice(0,90); }
  data.push(rec);
}
await browser.close();
putResult('auddata_B_'+TS+'.json', data);
