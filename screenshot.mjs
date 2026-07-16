import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'g7',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||22} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
const o={};
try{ execSync('sudo apt-get update -qq >/dev/null 2>&1; sudo apt-get install -y -qq poppler-utils >/dev/null 2>&1',{stdio:'ignore'}); }catch(e){}
let urls=[];
const rob=get('https://www.monge.it/robots.txt');
let maps=[...rob.matchAll(/Sitemap:\s*(\S+)/gi)].map(m=>m[1].trim());
if(!maps.length) maps=['https://www.monge.it/sitemap_index.xml'];
const seen=new Set(); const q=[...maps];
while(q.length && seen.size<26){
  const sm=q.shift(); if(!sm||seen.has(sm))continue; seen.add(sm);
  const xml=get(sm); if(!xml||!/<loc>/i.test(xml))continue;
  const locs=[...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]);
  if(/<sitemapindex/i.test(xml)){ for(const l of locs) q.push(l); }
  else urls.push(...locs);
}
const gem=[...new Set(urls.filter(u=>/gemon/i.test(u) && /\/(prodotto|producto|product|products)\//i.test(u)))];
const pdfset=new Set();
for(const u of gem.slice(0,70)){
  const h=get(u); if(!h) continue;
  for(const x of [...h.matchAll(/href="([^"]+[Gg]emon[^"]*\.pdf[^"]*)"/gi)].map(x=>x[1])) pdfset.add(x);
}
const dry=[...pdfset].filter(u=>!/pate|chunk|wet|mousse|jelly|sauce|bocadit/i.test(u));
o.dry_n=dry.length;
o.t={};
let i=0;
for(const p of dry.slice(0,30)){
  i++;
  const name=decodeURIComponent(p.split('/').pop()).replace(/\.pdf.*$/i,'');
  try{
    execSync(`curl -sLk -m 35 -A "Mozilla/5.0 Chrome/120" -o /tmp/y${i}.pdf "${p}"`);
    const sz=parseInt(execSync(`stat -c%s /tmp/y${i}.pdf || echo 0`).toString().trim());
    if(sz<2000){ o.t[name]={err:'mazas '+sz}; continue; }
    execSync(`pdftotext -layout /tmp/y${i}.pdf /tmp/y${i}.txt`);
    const t=fs.readFileSync(`/tmp/y${i}.txt`,'utf8');
    // TIKROJI lentele - nuo "(grams/day)"
    const m=/Recommended daily feeding intakes\s*\(grams\/day\)/i.exec(t);
    if(!m){ o.t[name]={err:'grams/day nerasta'}; continue; }
    const seg=t.slice(m.index, m.index+1100);
    o.t[name]={lines:seg.split('\n').map(x=>x.replace(/\s+$/,'')).filter(x=>x.trim()).slice(0,10)};
  }catch(e){ o.t[name]={err:String(e.message).slice(0,60)}; }
}
o.ok=Object.values(o.t).filter(x=>x.lines).length;
pr('g7.json',o); console.log('DONE dry='+o.dry_n+' ok='+o.ok);
