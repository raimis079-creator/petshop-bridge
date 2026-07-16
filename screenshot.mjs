import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'sp',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||22} -A "Mozilla/5.0 Chrome/120" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;|&ndash;/g,'-');}
function allT(html){const res=[];for(const t of (html.match(/<table[\s\S]*?<\/table>/gi)||[])){const rows=[];
 for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());if(c.length)rows.push(c);}
 if(rows.length)res.push(rows);} return res;}
const B='https://www.spokojenypes.cz';
const o={};
// sitemap pilnas ontario sarasas
let urls=[];
const rob=get(B+'/robots.txt');
let maps=[...rob.matchAll(/Sitemap:\s*(\S+)/gi)].map(m=>m[1].trim());
if(!maps.length) maps=[B+'/sitemap.xml',B+'/sitemap_index.xml'];
const seen=new Set(); const q=[...maps];
while(q.length && seen.size<20){
  const sm=q.shift(); if(!sm||seen.has(sm))continue; seen.add(sm);
  const xml=get(sm); if(!xml)continue;
  const locs=[...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]);
  if(/<sitemapindex/i.test(xml)){ for(const l of locs) q.push(l); }
  else for(const l of locs) if(/ontario/i.test(l)) urls.push(l);
}
urls=[...new Set(urls)];
// MUSU linijos: adult/puppy mini/medium/large + lamb/beef/chicken/fish + monoprotein konservai
const dry=urls.filter(u=>/(adult|puppy)-(mini|medium|large)|adult-large|adult-medium|adult-mini|puppy-mini|lamb-and|beef-and|chicken-and|fish-and/i.test(u));
o.dry_n=dry.length; o.dry=dry.slice(0,20);
o.pages={};
for(const u of dry.slice(0,25)){
  const h=get(u); if(!h) continue;
  const title=dec(((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1]).replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim().slice(0,90);
  const tb=allT(h).filter(rr=>{const f=rr.flat().join(' ').toLowerCase();
    return /(váha|hmotnost|kg)/.test(f)&&/(g\/|gram|den|krmn|dávk)/.test(f)&&rr.length>=2;});
  if(tb.length){ o.pages[u]={title,tables:tb.slice(0,2)}; continue; }
  // tekstu?
  let b=(h.match(/<body[\s\S]*<\/body>/i)||[h])[0].replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
  const txt=b.replace(/<[^>]+>/g,'\n').replace(/&nbsp;/g,' ').split('\n').map(x=>x.trim()).filter(Boolean).join(' | ');
  const i=txt.search(/krmn|dávkov|doporučen/i);
  if(i>=0) o.pages[u]={title,text:txt.slice(Math.max(0,i-80),i+800)};
}
o.hits=Object.keys(o.pages).length;
pr('sp.json',o); console.log('DONE dry='+o.dry_n+' hits='+o.hits);
