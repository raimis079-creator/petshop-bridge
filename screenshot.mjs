import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'ox',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function code(u){try{return execSync(`curl -sk -m 18 -o /dev/null -w "%{http_code}" -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" -L "${u}"`).toString().trim();}catch(e){return '000';}}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||22} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
const o={dom:{}};
for(const u of ['https://www.ontario-pet.com','https://ontario-pet.com','https://www.placek.cz','https://www.dinozoo.lv',
                'https://www.ontariopet.cz','https://www.plackpet.com','https://www.ontario-petfood.com']){
  const c=code(u); const r={http:c};
  if(c==='200'){ const h=get(u); r.bytes=h.length; r.title=(h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1].replace(/\s+/g,' ').trim().slice(0,58); }
  o.dom[u]=r;
}
// dinozoo.lv paieska
for(const q of ['https://www.dinozoo.lv/en/search?q=ontario','https://www.dinozoo.lv/search?q=ontario']){
  const c=code(q); o.dom['SEARCH '+q]={http:c};
}
pr('ox.json',o); console.log('DONE');
