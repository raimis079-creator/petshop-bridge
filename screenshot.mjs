import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:30*1024*1024});}
function get(u){ try{ return execSync(`curl -sL --max-time 25 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36" "${u}"`,{maxBuffer:20*1024*1024}).toString(); }catch(e){ return ''; } }
const out={};
try{
// 1) sitemap -> visi produktu URL
let urls=new Set();
for(const sm of ['https://exclusion.pl/1_pl_0_sitemap.xml','https://exclusion.pl/sitemap.xml','https://exclusion.pl/pl/sitemap.xml']){
  const x=get(sm);
  if(!x) continue;
  for(const m of x.matchAll(/<loc>([^<]+)<\/loc>/gi)){ const u=m[1];
    if(/\/\d+-\d+-\d+$|\/3-123-\d+|\/\d+-\d+-\d+\.html/.test(u) || /karma|pork|hypoallergenic|noble|intestinal|mediterr/i.test(u)) urls.add(u); }
  if(urls.size) { out.sitemap_used=sm; break; }
}
out.urls_from_sitemap = urls.size;
// 2) fallback: kategoriju puslapiai
if(urls.size < 5){
  for(const cat of ['https://exclusion.pl/pl/123-hypoallergenic','https://exclusion.pl/pl/3-diety','https://exclusion.pl/']){
    const h=get(cat); if(!h) continue;
    for(const m of h.matchAll(/href="(https:\/\/exclusion\.pl\/[^"]*\/\d+-\d+-\d+[^"]*)"/gi)) urls.add(m[1].split('#')[0]);
  }
  out.urls_after_fallback = urls.size;
}
// 3) fetch kiekviena, iskirti serimo lentele
const list=[...urls].slice(0,120);
const found=[]; const empty=[];
for(const u of list){
  const h=get(u); if(!h) continue;
  const tables = h.match(/<table[\s\S]*?<\/table>/gi) || [];
  let best=null;
  for(const t of tables){
    const txt=t.replace(/<[^>]+>/g,'|').replace(/\|+/g,'|').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
    const pairs=[...txt.matchAll(/(\d+(?:[.,]\d+)?)\s*kg\s*\|\s*(\d+)\s*[-–]\s*(\d+)\s*gr/gi)];
    if(pairs.length>=3 && (!best||pairs.length>best.length)) best=pairs.map(p=>({kg:parseFloat(p[1].replace(',','.')),from:+p[2],to:+p[3]}));
  }
  // kodas is paveiksliuko
  const im = h.match(/razioni\/([a-z]{3,6})_razione/i);
  const code = im ? im[1].toLowerCase() : null;
  const title = (h.match(/<title>([^<]+)<\/title>/i)||[])[1] || '';
  if(best) found.push({url:u, code, title:title.slice(0,70), rows:best});
  else empty.push({url:u, code, title:title.slice(0,60), tables:tables.length});
}
out.scanned=list.length; out.with_table=found.length; out.without=empty.length;
out.found=found; out.empty_sample=empty.slice(0,12);
}catch(e){ out.FATAL=String(e&&e.message?e.message:e).slice(0,400); }
ghPut('screenshots/m8_pl.json',Buffer.from(JSON.stringify(out)),'exclusion.pl crawl');
console.log('DONE');
