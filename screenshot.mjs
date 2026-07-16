import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){ try{ return execSync(`curl -sL --max-time 20 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:20*1024*1024}).toString(); }catch(e){ return ''; } }
const out={};
try{
const targets=[
 ['kgshop small salmon','https://www.kgshop.eu/quattro-small-breed-adult-sausas-begrudis-hipoalerginis-maistas-su-lasisa-ir-kriliu-1-5-kg'],
 ['kgshop eriena mono','https://www.kgshop.eu/products/quattro-paaras-su-riena-monoproteinas-12kg'],
 ['petirvet extra salmon','https://petirvet.lt/produktai/quattro-adult-extra-salmon-sunu-maistas/'],
 ['pet24 small salmon','https://pet24.lt/p/quattro-small-breed-adult-sausas-pasaras-su-lasisa-ir-kriliu-mazu-veislems-sunims'],
 ['pet24 small salmon2','https://pet24.lt/p/quattro-small-breed-adult-sausas-pasaras-su-lasisa-ir-kriliu-mazu-veisliu-sunims'],
 ['zoopro small lamb','https://www.zoopro.lt/quattro-small-breed-adult-lamb-sausas-begrudis-maistas-su-eriena-7-kg'],
 ['dogsnanny small duck','https://dogsnanny.lt/prekes/begrudis-sunu-maistas-qattro-small-breed-adult-su-antiena/'],
];
for(const [name,u] of targets){
  const h=get(u);
  if(!h){ out[name]={err:'tuščias'}; continue; }
  const tabs=h.match(/<table[\s\S]*?<\/table>/gi)||[];
  let best=null;
  for(const t of tabs){
    const txt=t.replace(/<[^>]+>/g,'|').replace(/&nbsp;/g,' ').replace(/\|+/g,'|').replace(/\s+/g,' ').trim();
    const nums=(txt.match(/\d+/g)||[]).length;
    if(nums>=8 && /kg|svor|g\b|gram/i.test(txt)){ if(!best||nums>best.n) best={n:nums,txt:txt.slice(0,420)}; }
  }
  // gal img lentele
  const imgs=[...h.matchAll(/(https?:\/\/[^"']*?(?:feeding|serimo|serim|lentel)[^"']*?\.(?:png|jpg|webp))/gi)].map(m=>m[1]).slice(0,2);
  out[name]={tables:tabs.length, best: best?best.txt:null, imgs, bytes:h.length};
}
}catch(e){ out.FATAL=String(e&&e.message?e.message:e).slice(0,400); }
ghPut('screenshots/m8_qret.json',Buffer.from(JSON.stringify(out)),'quattro retailers');
console.log('DONE');
