import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'r4',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function code(u){try{return execSync(`curl -sk -m 20 -o /dev/null -w "%{http_code}" -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" -L "${u}"`).toString().trim();}catch(e){return '000';}}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||25} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -H "Accept-Language: lt-LT,lt;q=0.9" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const o={probe:{}};
// kur is tikro yra LT sitemap
for(const u of ['https://www.royalcanin.com/lt/sitemap.xml','https://www.royalcanin.com/lt/lt/sitemap.xml',
                'https://www.royalcanin.com/lt','https://www.royalcanin.com/lt/cats','https://www.royalcanin.com/lt/katems']){
  const c=code(u); const r={http:c};
  if(c==='200'){ const h=get(u); r.bytes=h.length; r.title=(h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1].replace(/\s+/g,' ').trim().slice(0,52); r.loc=(h.match(/<loc>/gi)||[]).length; }
  o.probe[u]=r;
}
// LT pagrindinio psl. nuorodos
const h=get('https://www.royalcanin.com/lt');
o.home_bytes=h.length;
const links=[...new Set([...h.matchAll(/href="([^"]+)"/gi)].map(m=>m[1]))]
  .map(u=>u.startsWith('http')?u:(u.startsWith('/')?'https://www.royalcanin.com'+u:null)).filter(Boolean)
  .filter(u=>/royalcanin\.com\/lt/i.test(u));
o.home_links_n=links.length;
o.home_links=links.slice(0,26);
pr('r4.json',o); console.log('DONE');
