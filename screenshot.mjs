import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function putResult(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pm',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){try{return execSync(`curl -sLk --max-time 25 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;|&ndash;|&#8212;/g,'-').replace(/&quot;/g,'"');}
function parse(html){const res=[];for(const t of (html.match(/<table[\s\S]*?<\/table>/gi)||[])){const rows=[];
 for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());if(c.length)rows.push(c);}
 if(rows.length){const flat=rows.flat().join(' ').toLowerCase();
  if((/svor|waga|kg/.test(flat))&&/(norma|kiekis|paros|dienos|g\/)/.test(flat))res.push({rows});}}
 return res;}
const o={};
// visas petmarket exclusion sitemap
const xml=get('https://petmarket.lt/wp-sitemap.xml');
let maps=[...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]).filter(u=>/produkt|product/i.test(u));
let urls=[];
for(const m of maps.slice(0,12)){ const x=get(m);
  urls.push(...[...x.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(z=>z[1]).filter(u=>/exclusion/i.test(u))); }
urls=[...new Set(urls)];
o.n_urls=urls.length;
o.pages={};
for(const u of urls.slice(0,40)){
  const h=get(u); if(!h){o.pages[u]={err:'tuscias'};continue;}
  const tb=parse(h);
  const title=dec(((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1]).replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim().slice(0,110);
  const sku=(h.match(/SKU[:\s<]*([A-Z0-9\-]{4,12})/i)||[,''])[1];
  if(tb.length) o.pages[u]={title,sku,tables:tb};
}
o.with_tables=Object.keys(o.pages).length;
putResult('pm.json',o);
console.log('DONE urls='+o.n_urls+' tables='+o.with_tables);
