import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pc',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const o={};
try{
  const { chromium } = await import('playwright');
  const br = await chromium.launch({args:['--disable-blink-features=AutomationControlled']});
  const ctx = await br.newContext({userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', locale:'en-US', viewport:{width:1366,height:900}});
  await ctx.addInitScript(()=>{ Object.defineProperty(navigator,'webdriver',{get:()=>undefined}); });
  const pg = await ctx.newPage();
  await pg.goto('https://www.ontario.pet',{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForTimeout(12000);   // Cloudflare challenge
  o.title=await pg.title();
  o.url=pg.url();
  const txt=await pg.evaluate(()=>document.body.innerText);
  o.txt_len=txt.length;
  o.txt_head=txt.slice(0,300);
  if(!/just a moment|checking your browser/i.test(o.title)){
    try{ for(const s of ['#onetrust-accept-btn-handler','button:has-text("Accept")','button:has-text("Souhlas")','button:has-text("Rozumím")']){ const e=await pg.$(s); if(e){ await e.click({timeout:2500}); await pg.waitForTimeout(1800); break; } } }catch(e){}
    const links=await pg.$$eval('a[href]',as=>as.map(a=>a.href));
    o.links_n=links.length;
    o.links=[...new Set(links)].slice(0,30);
    // kaciu produktai
    o.cat_links=[...new Set(links.filter(u=>/cat|kock|produkt|product/i.test(u)))].slice(0,24);
  }
  await br.close();
}catch(e){ o.FATAL=String(e&&e.message?e.message:e).slice(0,250); }
pr('pc.json',o); console.log('DONE');
