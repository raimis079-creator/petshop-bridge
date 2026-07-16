import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'g6',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||22} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
const o={};
// poppler BUTINA diegti kiekviename rune (runneris svarus)
try{ execSync('sudo apt-get update -qq >/dev/null 2>&1; sudo apt-get install -y -qq poppler-utils >/dev/null 2>&1',{stdio:'ignore'}); }catch(e){}
o.pdftotext=(()=>{try{return execSync('which pdftotext || echo NONE').toString().trim();}catch(e){return 'NONE';}})();
// sitemap -> gemon produktai -> PDF
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
const pdfset=new Map();
for(const u of gem.slice(0,70)){
  const h=get(u); if(!h) continue;
  const p=[...h.matchAll(/href="([^"]+[Gg]emon[^"]*\.pdf[^"]*)"/gi)].map(x=>x[1]);
  for(const x of p){ if(!pdfset.has(x)) pdfset.set(x,u); }
}
o.pdf_total=pdfset.size;
// SAUSAS tik: iskiriam pate/chunkies/wet/natvoer
const dry=[...pdfset.keys()].filter(u=>!/pate|chunk|wet|mousse|jelly|sauce|bocadit/i.test(u));
o.dry_n=dry.length;
o.blocks={};
if(o.pdftotext!=='NONE'){
  let i=0;
  for(const p of dry.slice(0,26)){
    i++;
    const name=decodeURIComponent(p.split('/').pop());
    try{
      execSync(`curl -sLk -m 35 -A "Mozilla/5.0 Chrome/120" -o /tmp/x${i}.pdf "${p}"`);
      const sz=parseInt(execSync(`stat -c%s /tmp/x${i}.pdf || echo 0`).toString().trim());
      if(sz<2000){ o.blocks[name]={err:'mazas failas '+sz}; continue; }
      execSync(`pdftotext -layout /tmp/x${i}.pdf /tmp/x${i}.txt`);
      const t=fs.readFileSync(`/tmp/x${i}.txt`,'utf8');
      const j=t.search(/Recommended daily feeding|Razione giornaliera|daily feeding intake/i);
      o.blocks[name]= j>=0 ? {block:t.slice(j, j+1300)} : {err:'serimo bloko nera', len:t.length};
    }catch(e){ o.blocks[name]={err:String(e.message).slice(0,70)}; }
  }
}
o.ok=Object.values(o.blocks).filter(x=>x.block).length;
pr('g6.json',o); console.log('DONE pdf='+o.pdf_total+' dry='+o.dry_n+' ok='+o.ok);
