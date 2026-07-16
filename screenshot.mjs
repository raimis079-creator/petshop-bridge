import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'g5',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||22} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
const o={};
// pilnas vieno PDF tekstas - parserio projektavimui
try{
  execSync(`curl -sLk -m 40 -A "Mozilla/5.0 Chrome/120" -o /tmp/g.pdf "https://www.monge.it/wp-content/uploads/2023/09/Gemon-maxi-adult-with-chicken-and-rice-ENG.pdf"`);
  execSync('pdftotext -layout /tmp/g.pdf /tmp/g.txt');
  const t=fs.readFileSync('/tmp/g.txt','utf8');
  const i=t.indexOf('Recommended daily feeding');
  o.feeding_block = i>=0 ? t.slice(i, i+1800) : null;
  o.full_len=t.length;
}catch(e){ o.err=String(e.message).slice(0,150); }
// visu gemon puslapiu PDF nuorodos
let urls=[];
for(const base of ['https://www.monge.it']){
  const rob=get(base+'/robots.txt');
  let maps=[...rob.matchAll(/Sitemap:\s*(\S+)/gi)].map(m=>m[1].trim());
  if(!maps.length) maps=[base+'/sitemap_index.xml'];
  const seen=new Set(); const q=[...maps];
  while(q.length && seen.size<26){
    const sm=q.shift(); if(!sm||seen.has(sm))continue; seen.add(sm);
    const xml=get(sm); if(!xml||!/<loc>/i.test(xml))continue;
    const locs=[...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]);
    if(/<sitemapindex/i.test(xml)){ for(const l of locs) q.push(l); }
    else urls.push(...locs);
  }
}
const gem=[...new Set(urls.filter(u=>/gemon/i.test(u) && /\/(prodotto|producto|product|products)\//i.test(u)))];
o.gemon_prod=gem.length;
o.pdfs={};
for(const u of gem.slice(0,60)){
  const h=get(u); if(!h) continue;
  const p=[...h.matchAll(/href="([^"]+Gemon[^"]*\.pdf[^"]*)"/gi)].map(x=>x[1]);
  if(p.length) o.pdfs[u.split('/').filter(Boolean).pop()]=p[0];
}
o.pdf_n=Object.keys(o.pdfs).length;
pr('g5.json',o); console.log('DONE prod='+o.gemon_prod+' pdf='+o.pdf_n);
