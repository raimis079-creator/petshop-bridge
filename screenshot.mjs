import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'fa2',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){try{return execSync(`curl -sLk --max-time 22 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;|&ndash;|&#8212;/g,'-');}
function allT(html){const res=[];for(const t of (html.match(/<table[\s\S]*?<\/table>/gi)||[])){const rows=[];
 for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());if(c.length)rows.push(c);}
 if(rows.length)res.push({rows});} return res;}
const B='https://www.faunas.lt';
const o={};
// PrestaShop gamintoju sarasas
const cands=[B+'/gamintojai',B+'/brands',B+'/manufacturers',B+'/prekiu-zenklai',B+'/index.php?controller=manufacturer'];
let brandUrl=null;
for(const c of cands){
  const h=get(c);
  if(h && /prins/i.test(h)){
    const m=[...h.matchAll(/href="([^"]*)"[^>]*>\s*(?:<[^>]+>\s*)*Prins/gi)].map(x=>x[1]);
    o.brand_page=c; o.brand_links=[...new Set(m)].slice(0,5);
    if(m.length){ brandUrl=m[0].startsWith('http')?m[0]:B+m[0]; }
    break;
  }
}
o.brandUrl=brandUrl;
// surenkam produktus: is brand psl. + paieskos variantu + kategoriju
let prod=new Set();
const pages=[];
if(brandUrl){ for(let p=1;p<=6;p++) pages.push(brandUrl+(brandUrl.includes('?')?'&':'?')+'p='+p); }
pages.push(B+'/paieska?q=procare', B+'/paieska?q=prins+procare', B+'/paieska?controller=search&s=prins');
for(const pg of pages){
  const h=get(pg); if(!h) continue;
  for(const m of h.matchAll(/href="([^"]*\/\d+-[^"]*prins[^"]*)"/gi)){ let x=m[1]; prod.add(x.startsWith('http')?x:B+x); }
  for(const m of h.matchAll(/href="([^"]*\/\d+-[^"]*procare[^"]*)"/gi)){ let x=m[1]; prod.add(x.startsWith('http')?x:B+x); }
}
const P=[...prod];
o.prod_n=P.length; o.prod_sample=P.slice(0,16);
o.pages={};
for(const u of P.slice(0,45)){
  const h=get(u); if(!h) continue;
  const tb=allT(h).filter(t=>{const f=t.rows.flat().join(' ').toLowerCase(); return /(svor|kg)/.test(f)&&/(norma|kiekis|para|dien|gram)/.test(f);});
  if(!tb.length) continue;
  const title=dec(((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1]).replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim().slice(0,95);
  o.pages[u]={title,tables:tb.slice(0,1)};
}
o.with_tables=Object.keys(o.pages).length;
pr('fa2.json',o); console.log('DONE n='+o.prod_n+' tb='+o.with_tables);
