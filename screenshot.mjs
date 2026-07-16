import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'fa',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){try{return execSync(`curl -sLk --max-time 22 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;|&ndash;|&#8212;/g,'-').replace(/&scaron;/g,'š').replace(/&#0?39;|&quot;/g,"'");}
function allT(html){const res=[];for(const t of (html.match(/<table[\s\S]*?<\/table>/gi)||[])){const rows=[];
 for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());if(c.length)rows.push(c);}
 if(rows.length)res.push({rows});} return res;}
const B='https://www.faunas.lt';
const o={};
// 1. sitemap
let urls=[];
const rob=get(B+'/robots.txt');
let maps=[...rob.matchAll(/Sitemap:\s*(\S+)/gi)].map(m=>m[1].trim());
if(!maps.length) maps=[B+'/sitemap.xml',B+'/sitemap_index.xml',B+'/wp-sitemap.xml'];
o.maps=maps.slice(0,5);
const seen=new Set(); const q=[...maps];
while(q.length && seen.size<30){
  const sm=q.shift(); if(!sm||seen.has(sm))continue; seen.add(sm);
  const xml=get(sm); if(!xml)continue;
  const locs=[...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]);
  if(/<sitemapindex/i.test(xml)){ for(const l of locs) q.push(l); }
  else urls.push(...locs);
}
o.sitemap_total=urls.length;
let prins=[...new Set(urls.filter(u=>/prins|procare/i.test(u)))];
o.prins_n=prins.length; o.prins_sample=prins.slice(0,14);
// 2. jei sitemap tuscias - paieska
if(!prins.length){
  for(const p of ['/paieska?q=prins','/search?q=prins','/?s=prins','/paieska/?search=prins']){
    const h=get(B+p);
    const hr=[...h.matchAll(/href="([^"]+)"/gi)].map(m=>m[1]).map(x=>x.startsWith('http')?x:B+x);
    const f=[...new Set(hr.filter(u=>/prins|procare/i.test(u)))];
    if(f.length){ prins=f; o.via='search:'+p; break; }
  }
  o.prins_n=prins.length; o.prins_sample=prins.slice(0,14);
}
// 3. lenteles
o.pages={};
for(const u of prins.slice(0,45)){
  const h=get(u); if(!h) continue;
  const tb=allT(h);
  const good=tb.filter(t=>{const f=t.rows.flat().join(' ').toLowerCase(); return /(svor|kg)/.test(f)&&/(norma|kiekis|para|dien|gram|g\b)/.test(f);});
  if(!good.length) continue;
  const title=dec(((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1]).replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim().slice(0,95);
  o.pages[u]={title,tables:good.slice(0,2)};
}
o.with_tables=Object.keys(o.pages).length;
pr('fa.json',o); console.log('DONE prins='+o.prins_n+' tb='+o.with_tables);
