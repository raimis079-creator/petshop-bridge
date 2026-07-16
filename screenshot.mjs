import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function putResult(name,obj){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'q_more',content:Buffer.from(JSON.stringify(obj,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){try{return execSync(`curl -sLk --max-time 25 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;|&ndash;|&#8212;/g,'-').replace(/&quot;/g,'"').replace(/&#039;/g,"'");}
function parseTables(html){const res=[];for(const t of (html.match(/<table[\s\S]*?<\/table>/gi)||[])){const rows=[];
 for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());if(c.length)rows.push(c);}
 if(!rows.length)continue;const flat=rows.flat().join(' ').toLowerCase();
 if(/svor/.test(flat)&&/(norma|kiekis|paros|dienos)/.test(flat))res.push({rows});}return res;}

const o={sites:{}};
const sites=[['pet24','https://pet24.lt'],['zoopro','https://www.zoopro.lt'],['kgshop','https://www.kgshop.eu'],['quattropet','https://quattropet.com']];
for(const [name,base] of sites){
  const r={urls:[],pages:{}};
  try{
    const robots=get(base+'/robots.txt');
    let maps=[...robots.matchAll(/Sitemap:\s*(\S+)/gi)].map(m=>m[1].trim());
    if(!maps.length) maps=[base+'/sitemap.xml',base+'/sitemap_index.xml',base+'/wp-sitemap.xml'];
    r.maps=maps.slice(0,6);
    const seen=new Set(); const q=[...maps];
    while(q.length && seen.size<30){
      const sm=q.shift(); if(!sm||seen.has(sm))continue; seen.add(sm);
      const xml=get(sm); if(!xml)continue;
      const locs=[...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]);
      if(/<sitemapindex/i.test(xml)){ for(const l of locs) if(/produkt|product|preke|prekes|item|p\d/i.test(l)) q.push(l); }
      else { for(const l of locs) if(/quattro|qattro/i.test(l)) r.urls.push(l); }
    }
    r.urls=[...new Set(r.urls)]; r.count=r.urls.length;
    for(const u of r.urls.slice(0,45)){
      const h=get(u); if(!h){r.pages[u]={err:'tuscias'};continue;}
      const tb=parseTables(h);
      const title=dec(((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1]).replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim().slice(0,120);
      if(tb.length) r.pages[u]={title,tables:tb};
    }
    r.with_tables=Object.keys(r.pages).length;
  }catch(e){ r.err=String(e&&e.message?e.message:e).slice(0,200); }
  o.sites[name]=r;
}
putResult('q_more.json',o);
console.log('DONE '+Object.entries(o.sites).map(([k,v])=>k+':'+v.count+'/'+v.with_tables).join(' '));
