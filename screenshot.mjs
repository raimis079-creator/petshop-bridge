import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pw',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const o={};
try{
  const { chromium } = await import('playwright');
  const br = await chromium.launch();
  const ctx = await br.newContext({userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'});
  const pg = await ctx.newPage();
  const u='https://prinspetfoods.com/product/procare-standard-fit/';
  await pg.goto(u,{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForTimeout(7000);
  o.title=await pg.title();
  // paspaudziam viska, kas panasu i taba/akordeona
  const tabs = await pg.$$('a, button, .elementor-tab-title, [role="tab"], summary');
  let clicked=0;
  for(const t of tabs){
    try{ const txt=((await t.innerText())||'').toLowerCase();
      if(/voeding|feeding|advies|advice|dosering|gebruik|analys/i.test(txt)){ await t.click({timeout:2500}); clicked++; await pg.waitForTimeout(1200);} }catch(e){}
  }
  o.clicked=clicked;
  o.n_tables = await pg.$$eval('table', t=>t.length);
  o.tables = await pg.$$eval('table', ts => ts.map(tb =>
    [...tb.querySelectorAll('tr')].map(tr=>[...tr.querySelectorAll('td,th')].map(c=>c.innerText.replace(/\s+/g,' ').trim()))
  ));
  const body = await pg.evaluate(()=>document.body.innerText);
  o.body_len = body.length;
  o.kw = {};
  for(const k of ['voeding','feeding','advies','gram','kg','dosering']){
    const re=new RegExp('.{80}'+k+'.{200}','gis');
    o.kw[k]=[...body.matchAll(re)].map(m=>m[0].replace(/\s+/g,' ').trim()).slice(0,2);
  }
  // ar yra pdf/atsisiuntimai
  o.pdfs = await pg.$$eval('a[href]', as=>as.map(a=>a.href).filter(h=>/\.pdf|download|datasheet|spec/i.test(h)).slice(0,10));
  await br.close();
}catch(e){ o.FATAL=String(e&&e.message?e.message:e).slice(0,300); }
pr('pw.json',o); console.log('DONE');
