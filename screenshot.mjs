import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pd',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||22} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -H "Accept-Language: cs-CZ,cs;q=0.9" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const o={sites:{}};
for(const base of ['https://www.zoohit.cz','https://www.superzoo.cz','https://www.pet-shop.cz']){
  const r={};
  try{
    const rob=get(base+'/robots.txt',20);
    let maps=[...rob.matchAll(/Sitemap:\s*(\S+)/gi)].map(m=>m[1].trim());
    if(!maps.length) maps=[base+'/sitemap.xml'];
    r.maps=maps.slice(0,4);
    let urls=[]; const seen=new Set(); const q=[...maps];
    while(q.length && seen.size<10){
      const sm=q.shift(); if(!sm||seen.has(sm))continue; seen.add(sm);
      const xml=get(sm,30); if(!xml||!/<loc>/i.test(xml))continue;
      const locs=[...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]);
      if(/<sitemapindex/i.test(xml)){ for(const l of locs) if(/product|produkt|sitemap/i.test(l)) q.push(l); }
      else urls.push(...locs);
    }
    r.total=urls.length;
    const ont=urls.filter(u=>/ontario/i.test(u));
    r.ontario=ont.length;
    r.sample=ont.slice(0,10);
  }catch(e){ r.err=String(e.message).slice(0,60); }
  o.sites[base]=r;
}
pr('pd.json',o); console.log('DONE');
