import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'op',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||22} -A "Mozilla/5.0 Chrome/120" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;|&ndash;/g,'-');}
function allT(html){const res=[];for(const t of (html.match(/<table[\s\S]*?<\/table>/gi)||[])){const rows=[];
 for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());if(c.length)rows.push(c);}
 if(rows.length)res.push(rows);} return res;}
const B='https://www.ontariopet.com';
const o={};
let urls=[];
const rob=get(B+'/robots.txt');
let maps=[...rob.matchAll(/Sitemap:\s*(\S+)/gi)].map(m=>m[1].trim());
if(!maps.length) maps=[B+'/sitemap.xml',B+'/wp-sitemap.xml',B+'/sitemap_index.xml'];
o.maps=maps.slice(0,4);
const seen=new Set(); const q=[...maps];
while(q.length && seen.size<28){
  const sm=q.shift(); if(!sm||seen.has(sm))continue; seen.add(sm);
  const xml=get(sm); if(!xml||!/<loc>/i.test(xml))continue;
  const locs=[...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]);
  if(/<sitemapindex/i.test(xml)){ for(const l of locs) q.push(l); }
  else urls.push(...locs);
}
urls=[...new Set(urls)];
o.n=urls.length;
// atrenkam produktus - musu linijos
const cand=urls.filter(u=>/adult|puppy|mini|medium|large|lamb|beef|chicken|fish|product|dog/i.test(u));
o.cand=cand.length; o.sample=cand.slice(0,14);
o.pages={};
for(const u of cand.slice(0,40)){
  const h=get(u); if(!h) continue;
  const tb=allT(h).filter(rr=>{const f=rr.flat().join(' ').toLowerCase();
    return /(weight|váha|hmotnost|kg|svor)/.test(f)&&/(g\/|gram|day|den|norma|daily)/.test(f)&&rr.length>=2;});
  if(!tb.length) continue;
  const title=dec(((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1]).replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim().slice(0,90);
  o.pages[u]={title,tables:tb.slice(0,2)};
}
o.with_tables=Object.keys(o.pages).length;
pr('op.json',o); console.log('DONE n='+o.n+' tb='+o.with_tables);
