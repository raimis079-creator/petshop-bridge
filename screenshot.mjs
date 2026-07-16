import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'r2',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||22} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -H "Accept-Language: lt-LT,lt;q=0.9,en;q=0.8" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
const o={};
const B='https://www.royalcanin.com';
let urls=[];
const rob=get(B+'/robots.txt');
o.robots_head=rob.slice(0,300);
let maps=[...rob.matchAll(/Sitemap:\s*(\S+)/gi)].map(m=>m[1].trim());
o.maps=maps.slice(0,8);
if(!maps.length) maps=[B+'/sitemap.xml',B+'/lt/sitemap.xml'];
const seen=new Set(); const q=maps.filter(m=>/lt|sitemap/i.test(m));
while(q.length && seen.size<26){
  const sm=q.shift(); if(!sm||seen.has(sm))continue; seen.add(sm);
  const xml=get(sm,30); if(!xml||!/<loc>/i.test(xml))continue;
  const locs=[...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]);
  if(/<sitemapindex/i.test(xml)){ for(const l of locs) if(/\/lt\b|\/lt\//i.test(l)) q.push(l); }
  else urls.push(...locs.filter(l=>/\/lt\//i.test(l)));
}
o.lt_urls=urls.length;
const prod=urls.filter(u=>/(product|produkt|katems|sunims|cat|dog)/i.test(u));
o.prod_n=prod.length;
o.sample=prod.slice(0,16);
// musu linijos
const want=/giant-adult|medium-adult|hair.*skin|hairball|indoor|oral-care|sensible|sterilised/i;
const hit=urls.filter(u=>want.test(u));
o.hit_n=hit.length; o.hits=hit.slice(0,20);
pr('r2.json',o); console.log('DONE lt='+o.lt_urls+' hit='+o.hit_n);
