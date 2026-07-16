import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pd',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){try{return execSync(`curl -sLk --max-time 20 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return '';}}
function code(u){try{return execSync(`curl -sk -m 20 -o /dev/null -w "%{http_code}" -A "Mozilla/5.0 Chrome/120" -L "${u}"`).toString().trim();}catch(e){return '000';}}
const o={probe:{}};
const cands=['https://www.prinspetfoods.com','https://prinspetfoods.com','https://www.prinspetfoods.nl',
             'https://prinspetfoods.nl','https://www.prinspetfood.nl','https://www.prins-petfoods.com',
             'https://www.prinspetfoods.de','https://www.prinspetfoods.eu'];
for(const c of cands){
  const st=code(c);
  const r={http:st};
  if(st!=='000' && st!=='404'){
    const h=get(c);
    r.bytes=h.length;
    r.title=(h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1].replace(/\s+/g,' ').trim().slice(0,90);
    r.procare=/procare/i.test(h);
    const rob=get(c+'/robots.txt');
    r.sitemaps=[...rob.matchAll(/Sitemap:\s*(\S+)/gi)].map(m=>m[1].trim()).slice(0,4);
  }
  o.probe[c]=r;
}
pr('pd.json',o); console.log('DONE');
