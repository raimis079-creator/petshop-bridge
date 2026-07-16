import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'rds',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||22} -A "Mozilla/5.0 Chrome/120" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
function code(u){try{return execSync(`curl -sk -m 15 -o /dev/null -w "%{http_code}" -A "Mozilla/5.0 Chrome/120" -L "${u}"`).toString().trim();}catch(e){return '000';}}
const o={domains:{}};
// 1. galimi Real Dog domenai
for(const c of ['https://realdog.lt','https://www.realdog.lt','https://realdog.pl','https://www.realdog.pl',
                'https://real-dog.eu','https://realdog.eu','https://realdogfood.com','https://www.realdog.de']){
  const st=code(c); const r={http:st};
  if(st==='200'){ const h=get(c); r.title=(h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1].replace(/\s+/g,' ').trim().slice(0,70); r.dogfood=/dog|pasar|karma|futter/i.test(h); }
  o.domains[c]=r;
}
// 2. zoobaze - ZB tiekejo svetaine
for(const c of ['https://zoobaze.lt','https://www.zoobaze.lt','https://b2b.zoobaze.lt']){
  const st=code(c); o.domains[c]={http:st};
}
// 3. LT retaileriai per sitemap
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&');}
function allT(html){const res=[];for(const t of (html.match(/<table[\s\S]*?<\/table>/gi)||[])){const rows=[];
 for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());if(c.length)rows.push(c);}
 if(rows.length)res.push(rows);} return res;}
o.retail={};
for(const [n,base] of [['petmarket','https://petmarket.lt'],['dogsnanny','https://dogsnanny.lt'],
                        ['petirvet','https://petirvet.lt'],['pet24','https://pet24.lt'],['kika','https://www.kika.lt']]){
  const urls=[];
  try{
    const rob=get(base+'/robots.txt');
    let maps=[...rob.matchAll(/Sitemap:\s*(\S+)/gi)].map(m=>m[1].trim());
    if(!maps.length) maps=[base+'/wp-sitemap.xml',base+'/sitemap.xml',base+'/sitemap_index.xml'];
    const seen=new Set(); const q=[...maps];
    while(q.length && seen.size<22){
      const sm=q.shift(); if(!sm||seen.has(sm))continue; seen.add(sm);
      const xml=get(sm); if(!xml)continue;
      const locs=[...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]);
      if(/<sitemapindex/i.test(xml)){ for(const l of locs) q.push(l); }
      else for(const l of locs) if(/real-dog|realdog/i.test(l)) urls.push(l);
    }
  }catch(e){}
  const uu=[...new Set(urls)];
  o.retail[n]={n:uu.length,sample:uu.slice(0,4)};
  // jei yra - istraukiam lentele is pirmu 6
  if(uu.length){
    o.retail[n].pages={};
    for(const u of uu.slice(0,6)){
      const h=get(u); if(!h) continue;
      const tb=allT(h).filter(rr=>{const f=rr.flat().join(' ').toLowerCase(); return /(svor|kg)/.test(f)&&/(norma|kiekis|para|dien|gram)/.test(f);});
      if(tb.length) o.retail[n].pages[u]={tables:tb.slice(0,1)};
    }
  }
}
pr('rds.json',o); console.log('DONE');
