import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'r3',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||25} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -H "Accept-Language: lt-LT,lt;q=0.9" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const o={};
let urls=[];
const q=['https://www.royalcanin.com/lt/sitemap.xml'];
const seen=new Set();
while(q.length && seen.size<20){
  const sm=q.shift(); if(!sm||seen.has(sm))continue; seen.add(sm);
  const xml=get(sm,35); if(!xml||!/<loc>/i.test(xml)){ o['fail_'+sm.slice(-24)]=xml.slice(0,80); continue; }
  const locs=[...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]);
  if(/<sitemapindex/i.test(xml)){ for(const l of locs) q.push(l); }
  else urls.push(...locs);
}
urls=[...new Set(urls)];
o.n=urls.length;
o.sample=urls.slice(0,12);
const want=/giant-adult|medium-adult|hair-skin|hair-and-skin|hairball|indoor|oral-care|sensible|sterilised|sterilizuot/i;
const hit=urls.filter(u=>want.test(u));
o.hit_n=hit.length; o.hits=hit.slice(0,24);
pr('r3.json',o); console.log('DONE n='+o.n+' hit='+o.hit_n);
