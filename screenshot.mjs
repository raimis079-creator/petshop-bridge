import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pl',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const o={};
try{
  const { chromium } = await import('playwright');
  const br = await chromium.launch();
  const ctx = await br.newContext({userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'});
  const pg = await ctx.newPage();
  // 1. ar Cloudflare praleidzia
  await pg.goto('https://www.prinspetfoods.nl/', {waitUntil:'domcontentloaded', timeout:60000});
  await pg.waitForTimeout(6000);
  o.home_title = await pg.title();
  o.cf = /just a moment|checking your browser/i.test(await pg.content());
  // 2. procare nuorodos
  const links = await pg.$$eval('a[href]', as => as.map(a=>a.href));
  o.links = links.length;
  const cand = [...new Set(links.filter(u=>/procare|standard-fit|super-active|protection|grainfree/i.test(u)))].slice(0,10);
  o.cand = cand;
  o.pages = {};
  for(const u of cand.slice(0,5)){
    try{
      await pg.goto(u, {waitUntil:'domcontentloaded', timeout:60000});
      await pg.waitForTimeout(4000);
      const t = await pg.title();
      const tabs = await pg.$$eval('table', ts => ts.map(tb =>
        [...tb.querySelectorAll('tr')].map(tr => [...tr.querySelectorAll('td,th')].map(c=>c.innerText.replace(/\s+/g,' ').trim()))
      ));
      o.pages[u] = {title:t.slice(0,80), n:tabs.length, tables:tabs.filter(x=>x.length).slice(0,2)};
    }catch(e){ o.pages[u]={err:String(e.message).slice(0,90)}; }
  }
  await br.close();
}catch(e){ o.FATAL=String(e && e.message ? e.message : e).slice(0,300); }
pr('pl.json',o); console.log('DONE');
