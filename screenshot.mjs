import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pb',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||25} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
function code(u){try{return execSync(`curl -sk -m 18 -o /dev/null -w "%{http_code}" -A "Mozilla/5.0 Chrome/120" -L "${u}"`).toString().trim();}catch(e){return '000';}}
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#(\d+);/g,(m,d)=>String.fromCharCode(+d));}
const o={};
o.home=code('https://www.ontario.pet');
const h=get('https://www.ontario.pet');
o.bytes=h.length;
o.title=dec((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1]).replace(/\s+/g,' ').trim().slice(0,60);
o.langs=[...new Set([...h.matchAll(/href="([^"]*\/(en|cs|lt|lv|de|pl)\/?[^"]*)"/gi)].map(m=>m[1]))].slice(0,12);
// sitemap
let urls=[];
const rob=get('https://www.ontario.pet/robots.txt');
o.robots=rob.slice(0,200);
let maps=[...rob.matchAll(/Sitemap:\s*(\S+)/gi)].map(m=>m[1].trim());
if(!maps.length) maps=['https://www.ontario.pet/sitemap.xml'];
const seen=new Set(); const q=[...maps];
while(q.length && seen.size<14){
  const sm=q.shift(); if(!sm||seen.has(sm))continue; seen.add(sm);
  const xml=get(sm,30); if(!xml||!/<loc>/i.test(xml)){ o['sm_fail_'+sm.slice(-20)]=xml.slice(0,60); continue; }
  const locs=[...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]);
  if(/<sitemapindex/i.test(xml)){ for(const l of locs) q.push(l); }
  else urls.push(...locs);
}
o.n=urls.length;
o.sample=urls.slice(0,14);
const cat=urls.filter(u=>/cat|kock|kaci/i.test(u));
o.cat_n=cat.length;
o.cat_sample=cat.slice(0,14);
pr('pb.json',o); console.log('DONE n='+o.n);
