import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'r6',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const o={};
try{
  const { chromium } = await import('playwright');
  const br = await chromium.launch();
  const ctx = await br.newContext({userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', locale:'lt-LT'});
  const pg = await ctx.newPage();
  // 1. kategorija -> produktai
  await pg.goto('https://www.royalcanin.com/lt/cats/products/retail-products',{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForTimeout(8000);
  try{ for(const s of ['button:has-text("Sutinku")','button:has-text("Accept")','#onetrust-accept-btn-handler']){ const e=await pg.$(s); if(e){ await e.click({timeout:2500}); await pg.waitForTimeout(2000); break; } } }catch(e){}
  await pg.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
  await pg.waitForTimeout(4000);
  o.cat_title=await pg.title();
  const links=await pg.$$eval('a[href]',as=>as.map(a=>a.href));
  const prod=[...new Set(links.filter(u=>/royalcanin\.com\/lt\/cats\/products\//i.test(u) && !/retail-products$|adult-cat-food$|kitten-food$|senior|vet-products$/i.test(u)))];
  o.prod_n=prod.length; o.prod=prod.slice(0,26);
  // 2. anatomija
  const want=/hair|hairball|indoor|oral|sensible|sterilised/i;
  const t=prod.find(u=>want.test(u))||prod[0];
  o.target=t;
  if(t){
    await pg.goto(t,{waitUntil:'domcontentloaded',timeout:60000});
    await pg.waitForTimeout(7000);
    for(const s of ['text=Šėrimo','text=šėrimo rekomendacijos','text=Feeding','[data-tab*="feed"]','button:has-text("Šėrimo")']){
      try{ const e=await pg.$(s); if(e){ await e.click({timeout:2500}); await pg.waitForTimeout(2500); break; } }catch(e){}
    }
    o.p_title=await pg.title();
    const tb=await pg.$$eval('table',ts=>ts.map(t=>[...t.querySelectorAll('tr')].map(tr=>[...tr.querySelectorAll('td,th')].map(c=>c.innerText.replace(/\s+/g,' ').trim()))));
    o.n_tables=tb.length;
    o.tables=tb.filter(x=>x.length).slice(0,3);
    const txt=await pg.evaluate(()=>document.body.innerText);
    o.txt_len=txt.length;
    for(const kw of ['Šėrim','šėrim','Katės svoris','norma','Rekomenduojam','g/d']){
      const i=txt.indexOf(kw);
      if(i>=0){ o['kw_'+kw]=txt.slice(Math.max(0,i-120),i+500); break; }
    }
  }
  await br.close();
}catch(e){ o.FATAL=String(e&&e.message?e.message:e).slice(0,250); }
pr('r6.json',o); console.log('DONE');
