import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'br',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const o={};
try{
  const { chromium } = await import('playwright');
  const br = await chromium.launch();
  const ctx = await br.newContext({userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', locale:'lt-LT'});
  const pg = await ctx.newPage();
  const targets=[
   ['faunas_grainfree','https://www.faunas.lt/sausas-maistas-sunims/88-43-prins-procare-grainfree-puppy-junior-begrudis-sausas-maistas-suniukams.html'],
   ['faunas_perfect','https://www.faunas.lt/sausas-maistas-sunims/99-59-prins-procare-puppy-junior-perfect-start-presuotas-sausas-maistas-suniukams.html'],
   ['prins_com_fit','https://prinspetfoods.com/product/procare-standard-fit/'],
  ];
  for(const [k,u] of targets){
    const r={};
    try{
      await pg.goto(u,{waitUntil:'domcontentloaded',timeout:60000});
      await pg.waitForTimeout(7000);
      // atidarom galimus tab'us/accordion
      for(const sel of ['text=Šėrimo','text=Aprašymas','text=Feeding','text=Voedingsadvies','.tab-title','a[href*="tab"]']){
        try{ const el=await pg.$(sel); if(el) { await el.click({timeout:2500}); await pg.waitForTimeout(1500);} }catch(e){}
      }
      r.title=(await pg.title()).slice(0,80);
      const tb=await pg.$$eval('table',ts=>ts.map(t=>[...t.querySelectorAll('tr')].map(tr=>[...tr.querySelectorAll('td,th')].map(c=>c.innerText.replace(/\s+/g,' ').trim()))));
      r.n_tables=tb.length;
      r.tables=tb.filter(x=>x.length).slice(0,3);
      const txt=await pg.evaluate(()=>document.body.innerText);
      r.txt_len=txt.length;
      const kws=['šėrim','Šėrim','norma','paros','Kiekis','feeding','Feeding','voedingsadvies','gram/'];
      r.kw={};
      for(const k2 of kws){ const i=txt.indexOf(k2); if(i>=0) r.kw[k2]=txt.slice(Math.max(0,i-60),i+320).replace(/\s+/g,' '); }
    }catch(e){ r.err=String(e.message).slice(0,120); }
    o[k]=r;
  }
  await br.close();
}catch(e){ o.FATAL=String(e&&e.message?e.message:e).slice(0,300); }
pr('br.json',o); console.log('DONE');
