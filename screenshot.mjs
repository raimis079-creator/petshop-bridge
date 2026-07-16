import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'rr',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const o={found:{},pages:{}};
const WANT=/giant-adult|hairball|indoor|oral-care|medium-adult/i;
try{
  const { chromium } = await import('playwright');
  const br = await chromium.launch();
  const ctx = await br.newContext({userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'});
  const pg = await ctx.newPage();
  let consent=false;
  async function grab(url){
    try{
      await pg.goto(url,{waitUntil:'domcontentloaded',timeout:55000});
      await pg.waitForTimeout(6000);
      if(!consent){ try{ for(const s of ['#onetrust-accept-btn-handler','button:has-text("Accept")','button:has-text("Akzeptieren")','button:has-text("Akceptuj")']){ const e=await pg.$(s); if(e){ await e.click({timeout:2500}); await pg.waitForTimeout(1800); consent=true; break; } } }catch(e){} }
      for(let i=0;i<3;i++){ await pg.evaluate(()=>window.scrollTo(0,document.body.scrollHeight)); await pg.waitForTimeout(2000); }
      const links=await pg.$$eval('a[href]',as=>as.map(a=>a.href));
      return links.filter(u=>/\/(cats|dogs)\/products\/retail-products\/[^?#]+$/i.test(u));
    }catch(e){ return []; }
  }
  for(const cc of ['uk','pl']){
    let set=new Set();
    for(const sp of ['cats','dogs']){
      for(const p of ['','&page=2']){
        for(const u of await grab(`https://www.royalcanin.com/${cc}/${sp}/products/retail-products?technology=dry${p}`)) set.add(u);
      }
    }
    const hits=[...set].filter(u=>WANT.test(u));
    o.found[cc]={total:set.size,hits};
  }
  // istraukiam lenteles is rastu
  const all=[];
  for(const cc of Object.keys(o.found)) for(const u of o.found[cc].hits) all.push(u);
  for(const u of all.slice(0,12)){
    try{
      await pg.goto(u,{waitUntil:'domcontentloaded',timeout:55000});
      await pg.waitForTimeout(5000);
      const tb=await pg.$$eval('table',ts=>ts.map(t=>[...t.querySelectorAll('tr')].map(tr=>[...tr.querySelectorAll('td,th')].map(c=>c.innerText.replace(/\s+/g,' ').trim()))));
      o.pages[u]={title:(await pg.title()).slice(0,44),n:tb.length,t:tb.filter(x=>x.length>1).slice(0,3)};
    }catch(e){ o.pages[u]={err:String(e.message).slice(0,50)}; }
  }
  await br.close();
}catch(e){ o.FATAL=String(e&&e.message?e.message:e).slice(0,250); }
pr('rr.json',o); console.log('DONE');
