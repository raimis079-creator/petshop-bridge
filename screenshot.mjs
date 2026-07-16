import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'nl2',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){try{return execSync(`curl -sLk --max-time 18 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;|&ndash;/g,'-');}
function allT(html){const res=[];for(const t of (html.match(/<table[\s\S]*?<\/table>/gi)||[])){const rows=[];
 for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());if(c.length)rows.push(c);}
 if(rows.length)res.push({rows});} return res;}
const o={pages:{}};
let all=[];
for(const base of ['https://dierenwinkelxl.nl','https://www.medpets.nl']){
  const urls=[];
  try{
    const rob=get(base+'/robots.txt');
    let maps=[...rob.matchAll(/Sitemap:\s*(\S+)/gi)].map(m=>m[1].trim());
    if(!maps.length) maps=[base+'/sitemap.xml',base+'/sitemap_index.xml'];
    const seen=new Set(); const q=[...maps];
    while(q.length && seen.size<22){
      const sm=q.shift(); if(!sm||seen.has(sm))continue; seen.add(sm);
      const xml=get(sm); if(!xml)continue;
      const locs=[...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]);
      if(/<sitemapindex/i.test(xml)){ for(const l of locs) if(/produ|artik|item/i.test(l)) q.push(l); }
      else for(const l of locs) if(/\/prins-|\/prins_|prins-procare|prins-fit|prins-opti/i.test(l)) urls.push(l);
    }
  }catch(e){}
  all.push(...new Set(urls));
}
all=[...new Set(all)];
o.total=all.length;
// tik SUNU sausas: isskiriam kates/konservus
const dogs=all.filter(u=>!/kat|cat|blik|vers|natvoer|snack|kauw/i.test(u));
o.dogs=dogs.length; o.sample=dogs.slice(0,20);
for(const u of dogs.slice(0,55)){
  const h=get(u); if(!h) continue;
  const tb=allT(h).filter(t=>{const f=t.rows.flat().join(' ').toLowerCase();
    return /(lichaamsgewicht|gewicht)/.test(f)&&/(hoeveelheid|gram|per dag)/.test(f);});
  if(!tb.length) continue;
  const title=dec(((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1]).replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim().slice(0,95);
  o.pages[u]={title,tables:tb.slice(0,1)};
}
o.with_tables=Object.keys(o.pages).length;
pr('nl2.json',o); console.log('DONE '+o.total+'/'+o.dogs+' tb='+o.with_tables);
