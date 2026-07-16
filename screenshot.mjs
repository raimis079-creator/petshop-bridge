import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){ try{ return execSync(`curl -sL --max-time 20 -A "Mozilla/5.0 Chrome/120" "${u}"`,{maxBuffer:20*1024*1024}).toString(); }catch(e){ return ''; } }
const out={};
try{
const cats=['https://exclusion.lt/hypoallergenic/','https://exclusion.lt/hydrolyzed-hypoallergenic/','https://exclusion.lt/intestinal/',
 'https://exclusion.lt/exclusion-mediterraneo-monoprotein/','https://exclusion.lt/metabolic-mobility/','https://exclusion.lt/mobility/',
 'https://exclusion.lt/urinary/','https://exclusion.lt/renal/','https://exclusion.lt/diabetic/','https://exclusion.lt/hepatic/',
 'https://exclusion.lt/hypoallergenic-katems/','https://exclusion.lt/intestinal-katems/','https://exclusion.lt/urinary-katems/',
 'https://exclusion.lt/renal-katems/','https://exclusion.lt/exclusion-mediterraneo/'];
const prods=new Set();
for(const c of cats){ const h=get(c); for(const m of h.matchAll(/href="(https:\/\/exclusion\.lt\/product\/[^"#?]+)"/gi)) prods.add(m[1]); }
fs.mkdirSync('/tmp/ser',{recursive:true});
const map=[];
for(const u of [...prods]){
  const h=get(u); if(!h) continue;
  const title=((h.match(/<title>([^<]+)<\/title>/i)||[])[1]||'').replace(/ - exclusion\.lt/,'').replace(/\s+/g,' ').trim();
  const ser=[...h.matchAll(/(https:\/\/exclusion\.lt\/wp-content\/uploads\/[^"']*?SERIMAS[^"']*?\.png)/gi)].map(m=>m[1]);
  if(!ser.length) continue;
  const img=ser[0];
  const fn=decodeURIComponent(img.split('/').pop()).replace(/-\d+x\d+(?=\.png$)/,'');
  map.push({url:u,title,img,fn});
}
out.total=map.length;
// parsisiunciam
fs.writeFileSync('/tmp/dl.txt', map.map(m=>m.img).join('\n'));
let n=0;
for(const m of map){
  const safe = m.fn.replace(/[^A-Za-z0-9_.\-]/g,'_');
  const p=`/tmp/ser/${safe}`;
  if(!fs.existsSync(p)) execSync(`curl -sL --max-time 25 -o "${p}" "${m.img.replace(/ /g,'%20')}"`);
  if(fs.existsSync(p) && fs.statSync(p).size>2000){ ghPut(`serimas/${safe}`, fs.readFileSync(p), 'lt serimas'); n++; m.file=safe; m.size=fs.statSync(p).size; }
}
out.downloaded=n;
out.map=map;
}catch(e){ out.FATAL=String(e&&e.message?e.message:e).slice(0,400); }
ghPut('screenshots/m8_ser.json',Buffer.from(JSON.stringify(out)),'lt serimas map');
console.log('DONE '+out.downloaded);
