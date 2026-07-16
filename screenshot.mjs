import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function putResult(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'jd',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){try{return execSync(`curl -sLk --max-time 25 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;|&ndash;|&#8212;/g,'-').replace(/&quot;/g,'"');}
function tabs(html){const res=[];for(const t of (html.match(/<table[\s\S]*?<\/table>/gi)||[])){const rows=[];
 for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());if(c.length)rows.push(c);}
 if(rows.length){const f=rows.flat().join(' ').toLowerCase();
  if(/(svor|gewicht|kg)/.test(f)&&/(norma|kiekis|paros|dienos|futter|menge|g\/)/.test(f))res.push({rows});}}
 return res;}
const o={disc:{},pages:{}};
// PATAISA: ankstesnis filtras buvo /josera/i -> josidog/josicat puslapiai NEPATEKO
const sites=[['josera_de','https://www.josera.de'],['petmarket','https://petmarket.lt'],['josidog','https://www.josidog.com']];
let all=[];
for(const [n,base] of sites){
  const urls=[];
  try{
    const rob=get(base+'/robots.txt');
    let maps=[...rob.matchAll(/Sitemap:\s*(\S+)/gi)].map(m=>m[1].trim());
    if(!maps.length) maps=[base+'/wp-sitemap.xml',base+'/sitemap_index.xml',base+'/sitemap.xml'];
    const seen=new Set(); const q=[...maps];
    while(q.length && seen.size<28){
      const sm=q.shift(); if(!sm||seen.has(sm))continue; seen.add(sm);
      const xml=get(sm); if(!xml)continue;
      const locs=[...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]);
      if(/<sitemapindex/i.test(xml)){ for(const l of locs) q.push(l); }
      else for(const l of locs) if(/josidog|josicat/i.test(l)) urls.push(l);
    }
  }catch(e){}
  const uu=[...new Set(urls)];
  o.disc[n]={n:uu.length,sample:uu.slice(0,8)};
  all.push(...uu);
}
all=[...new Set(all)];
o.total_urls=all.length;
for(const u of all.slice(0,45)){
  const h=get(u); if(!h) continue;
  const tb=tabs(h);
  if(!tb.length) continue;
  const title=dec(((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1]).replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim().slice(0,110);
  o.pages[u]={title,tables:tb.slice(0,2)};
}
o.with_tables=Object.keys(o.pages).length;
putResult('jd.json',o);
console.log('DONE urls='+o.total_urls+' tables='+o.with_tables);
