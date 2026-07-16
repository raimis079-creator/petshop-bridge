import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'g2',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||22} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -H "Accept-Language: it-IT,it;q=0.9,en;q=0.8" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;|&ndash;/g,'-');}
function allT(html){const res=[];for(const t of (html.match(/<table[\s\S]*?<\/table>/gi)||[])){const rows=[];
 for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());if(c.length)rows.push(c);}
 if(rows.length)res.push(rows);} return res;}
const o={};
// 1. gemon.it dar karta su geru UA
o.gemon_retry=execSync(`curl -sk -m 20 -o /dev/null -w "%{http_code}" -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -L "https://www.gemon.it"`).toString().trim();
// 2. monge.it sitemap -> gemon
let urls=[];
for(const base of ['https://www.monge.it','https://www.gemon.it']){
  try{
    const rob=get(base+'/robots.txt');
    let maps=[...rob.matchAll(/Sitemap:\s*(\S+)/gi)].map(m=>m[1].trim());
    if(!maps.length) maps=[base+'/sitemap.xml',base+'/sitemap_index.xml',base+'/wp-sitemap.xml'];
    const seen=new Set(); const q=[...maps];
    while(q.length && seen.size<26){
      const sm=q.shift(); if(!sm||seen.has(sm))continue; seen.add(sm);
      const xml=get(sm); if(!xml||!/<loc>/i.test(xml))continue;
      const locs=[...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]);
      if(/<sitemapindex/i.test(xml)){ for(const l of locs) q.push(l); }
      else urls.push(...locs);
    }
  }catch(e){}
}
urls=[...new Set(urls)];
o.total=urls.length;
const gem=urls.filter(u=>/gemon/i.test(u));
o.gemon_n=gem.length; o.gemon_sample=gem.slice(0,14);
o.pages={};
for(const u of gem.slice(0,35)){
  const h=get(u); if(!h) continue;
  const tb=allT(h).filter(rr=>{const f=rr.flat().join(' ').toLowerCase();
    return /(peso|kg|weight)/.test(f)&&/(g\/|gr|grammi|razione|dose|day|giorno)/.test(f)&&rr.length>=2;});
  if(!tb.length) continue;
  const title=dec(((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1]).replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim().slice(0,85);
  o.pages[u]={title,tables:tb.slice(0,1)};
}
o.with_tables=Object.keys(o.pages).length;
pr('g2.json',o); console.log('DONE t='+o.total+' g='+o.gemon_n+' tb='+o.with_tables);
