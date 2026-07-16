import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'r8',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const o={all:[],pages:{}};
try{
  const { chromium } = await import('playwright');
  const br = await chromium.launch();
  const ctx = await br.newContext({userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', locale:'lt-LT'});
  const pg = await ctx.newPage();
  let consent=false;
  const B='https://www.royalcanin.com/lt';
  const cats=[`${B}/cats/products/retail-products?technology=dry`,`${B}/cats/products/retail-products?technology=dry&page=2`,
              `${B}/dogs/products/retail-products?technology=dry`,`${B}/dogs/products/retail-products?technology=dry&page=2`];
  let found=new Set();
  for(const c of cats){
    try{
      await pg.goto(c,{waitUntil:'domcontentloaded',timeout:60000});
      await pg.waitForTimeout(7000);
      if(!consent){ try{ for(const s of ['#onetrust-accept-btn-handler','button:has-text("Sutinku")']){ const e=await pg.$(s); if(e){ await e.click({timeout:2500}); await pg.waitForTimeout(2000); consent=true; break; } } }catch(e){} }
      for(let i=0;i<3;i++){ await pg.evaluate(()=>window.scrollTo(0,document.body.scrollHeight)); await pg.waitForTimeout(2200); }
      const links=await pg.$$eval('a[href]',as=>as.map(a=>a.href));
      for(const u of links) if(/\/lt\/(cats|dogs)\/products\/retail-products\/[^?#]+$/i.test(u)) found.add(u);
    }catch(e){}
  }
  o.all=[...found];
  const want=/giant-adult|hair-skin|hair-and-skin|hairball|indoor|oral-care|sensible-33|sterilised-37|medium-adult/i;
  const mine=[...found].filter(u=>want.test(u));
  o.mine=mine;
  for(const u of mine.slice(0,14)){
    try{
      await pg.goto(u,{waitUntil:'domcontentloaded',timeout:60000});
      await pg.waitForTimeout(5000);
      const tb=await pg.$$eval('table',ts=>ts.map(t=>[...t.querySelectorAll('tr')].map(tr=>[...tr.querySelectorAll('td,th')].map(c=>c.innerText.replace(/\s+/g,' ').trim()))));
      o.pages[decodeURIComponent(u.split('/').pop())]={title:(await pg.title()).slice(0,50),n:tb.length,t:tb.filter(x=>x.length>1).slice(0,3)};
    }catch(e){ o.pages[u.split('/').pop()]={err:String(e.message).slice(0,60)}; }
  }
  await br.close();
}catch(e){ o.FATAL=String(e&&e.message?e.message:e).slice(0,250); }
pr('r8.json',o); console.log('DONE');
