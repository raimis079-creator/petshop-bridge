import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pc',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){try{return execSync(`curl -sLk --max-time 25 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;|&ndash;|&#8212;/g,'-');}
function allT(html){const res=[];for(const t of (html.match(/<table[\s\S]*?<\/table>/gi)||[])){const rows=[];
 for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());if(c.length)rows.push(c);}
 if(rows.length)res.push({rows});} return res;}
const B='https://www.prinspetfoods.com';
const o={};
// 1. sitemap bandymai
const smTry=[B+'/sitemap.xml',B+'/sitemap_index.xml',B+'/wp-sitemap.xml',B+'/page-sitemap.xml',B+'/product-sitemap.xml'];
let urls=[];
for(const sm of smTry){ const x=get(sm);
  if(/<loc>/i.test(x)){ const locs=[...x.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]);
    if(/<sitemapindex/i.test(x)){ for(const l of locs){ const y=get(l); urls.push(...[...y.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1])); } }
    else urls.push(...locs); } }
o.sitemap_urls=urls.length;
// 2. jei tuscia - crawl is homepage
if(urls.length<5){
  const h=get(B);
  const hrefs=[...h.matchAll(/href="([^"]+)"/gi)].map(m=>m[1]).map(u=>u.startsWith('http')?u:(u.startsWith('/')?B+u:null)).filter(Boolean);
  const seen=new Set(hrefs);
  for(const u of [...seen].filter(u=>/procare|product|voer|food|assortiment|range/i.test(u)).slice(0,12)){
    const p=get(u);
    for(const m of p.matchAll(/href="([^"]+)"/gi)){ let x=m[1]; if(!x.startsWith('http')) x=x.startsWith('/')?B+x:null; if(x) seen.add(x); }
  }
  urls=[...seen];
}
urls=[...new Set(urls)].filter(u=>u.includes('prinspetfoods'));
o.total=urls.length;
const cand=urls.filter(u=>/procare|protection|grainfree|fit|active|puppy|junior|senior|lamb|herring|mini|diet|sensible|skin/i.test(u));
o.cand=cand.length; o.cand_sample=cand.slice(0,14);
o.pages={};
for(const u of cand.slice(0,40)){
  const h=get(u); if(!h) continue;
  const tb=allT(h);
  const good=tb.filter(t=>{const f=t.rows.flat().join(' ').toLowerCase(); return /(kg|gewicht|weight|svor)/.test(f)&&/(gram|g\/|dag|day|per dag|voeding|amount)/.test(f);});
  if(!good.length) continue;
  const title=dec(((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1]).replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim().slice(0,90);
  o.pages[u]={title,tables:good.slice(0,2)};
}
o.with_tables=Object.keys(o.pages).length;
pr('pc.json',o); console.log('DONE t='+o.total+' c='+o.cand+' tb='+o.with_tables);
