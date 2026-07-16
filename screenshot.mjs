import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'oy',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||22} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
function code(u){try{return execSync(`curl -sk -m 18 -o /dev/null -w "%{http_code}" -A "Mozilla/5.0 Chrome/120" -L "${u}"`).toString().trim();}catch(e){return '000';}}
const o={};
// 1. placek.cz -> nuorodos i brendus
const h=get('https://www.placek.cz');
o.placek_links=[...new Set([...h.matchAll(/href="([^"]+)"/gi)].map(m=>m[1]))].filter(u=>/ontario|brand|znack|produkt/i.test(u)).slice(0,20);
// 2. galimi Ontario brendo domenai
o.dom={};
for(const u of ['https://www.ontario-petfood.cz','https://ontario.placek.cz','https://www.ontariopetfood.com',
                'https://www.ontario-pet.cz','https://www.ontariopet.com','https://www.ontariopetfood.cz']){
  const c=code(u); const r={http:c};
  if(c==='200'){ const x=get(u); r.title=(x.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1].replace(/\s+/g,' ').trim().slice(0,50); }
  o.dom[u]=r;
}
// 3. dinozoo.lv sitemap
let urls=[];
const rob=get('https://www.dinozoo.lv/robots.txt');
o.dz_robots=rob.slice(0,220);
let maps=[...rob.matchAll(/Sitemap:\s*(\S+)/gi)].map(m=>m[1].trim());
if(!maps.length) maps=['https://www.dinozoo.lv/sitemap.xml'];
const seen=new Set(); const q=[...maps];
while(q.length && seen.size<14){
  const sm=q.shift(); if(!sm||seen.has(sm))continue; seen.add(sm);
  const xml=get(sm,30); if(!xml||!/<loc>/i.test(xml))continue;
  const locs=[...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]);
  if(/<sitemapindex/i.test(xml)){ for(const l of locs) q.push(l); }
  else urls.push(...locs);
}
o.dz_total=urls.length;
const ont=urls.filter(u=>/ontario/i.test(u));
o.dz_ontario=ont.length;
o.dz_sample=ont.slice(0,16);
pr('oy.json',o); console.log('DONE dz='+o.dz_total+' ont='+o.dz_ontario);
