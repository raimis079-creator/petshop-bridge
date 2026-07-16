import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pa',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||22} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#(\d+);/g,(m,d)=>String.fromCharCode(+d));}
const o={};
// 1. dinozoo pilnas tekstas - ieskom dozes
const h=get('https://www.dinozoo.lv/bariba-kakiem-ontario-castrate-2-kg',30);
let b=(h.match(/<body[\s\S]*<\/body>/i)||[h])[0].replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
const txt=dec(b.replace(/<[^>]+>/g,'\n')).split('\n').map(x=>x.trim()).filter(Boolean).join(' | ');
o.dz_hits={};
for(const kw of ['deva','Deva','dienā','g dienā','Ieteicam','ieteicam','barošanas deva','Kaķa svars','svars kg','Barības deva']){
  const idx=[];
  let i=txt.indexOf(kw);
  while(i>=0 && idx.length<3){ idx.push(txt.slice(Math.max(0,i-90),i+260)); i=txt.indexOf(kw,i+1); }
  if(idx.length) o.dz_hits[kw]=idx;
}
o.dz_numeric=txt.split(' | ').filter(l=>/\d+\s*(kg|g)\b/i.test(l) && /\d{2,}/.test(l)).slice(0,16);
// 2. placek.cz brendai
const p=get('https://www.placek.cz/en/brand',25);
o.placek_bytes=p.length;
o.placek_ontario=[...new Set([...p.matchAll(/href="([^"]*ontario[^"]*)"/gi)].map(m=>m[1]))].slice(0,10);
const names=[...p.matchAll(/>([A-Z][A-Za-z0-9 &.\-]{2,30})</g)].map(m=>m[1].trim());
o.placek_brands=[...new Set(names.filter(n=>/ontario|brit|sam|rasco/i.test(n)))].slice(0,10);
// 3. cekiskos parduotuves
o.cz={};
for(const u of ['https://www.zoohit.cz','https://www.pet-shop.cz','https://www.superzoo.cz','https://www.chovatelskepotreby.cz']){
  try{ o.cz[u]=execSync(`curl -sk -m 15 -o /dev/null -w "%{http_code}" -A "Mozilla/5.0 Chrome/120" -L "${u}"`).toString().trim(); }catch(e){ o.cz[u]='000'; }
}
pr('pa.json',o); console.log('DONE');
