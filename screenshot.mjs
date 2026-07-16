import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){ try{ return execSync(`curl -sL --max-time 20 -A "Mozilla/5.0 Chrome/120" "${u.replace(/ /g,'%20')}"`,{maxBuffer:20*1024*1024}).toString(); }catch(e){ return ''; } }
const out={};
try{
// 1) LT svetaines meniu -> visi produktu URL
const seeds=['https://www.quattropet.com/lt','https://www.quattropet.com/en'];
const prods=new Set();
for(const s of seeds){
  const h=get(s);
  for(const m of h.matchAll(/href="(https:\/\/www\.quattropet\.com\/(?:lt|en)\/products\/[^"#?]+)"/gi)) prods.add(m[1]);
}
// pridedam is kategorijos puslapiu
for(const c of ['https://www.quattropet.com/lt/sunu-maistas','https://www.quattropet.com/lt/kaciu-maistas',
                'https://www.quattropet.com/en/dog-food','https://www.quattropet.com/en/cat-food']){
  const h=get(c);
  for(const m of h.matchAll(/href="(https:\/\/www\.quattropet\.com\/(?:lt|en)\/products\/[^"#?]+)"/gi)) prods.add(m[1]);
}
out.product_urls=prods.size;
// 2) kiekvienam: pavadinimas + feeding guide img
const items=[]; fs.mkdirSync('/tmp/qg',{recursive:true});
for(const u of [...prods]){
  const h=get(u); if(!h) continue;
  const title=((h.match(/<h1[^>]*>([^<]+)<\/h1>/i)||h.match(/<title>([^<]+)<\/title>/i)||[])[1]||'').replace(/\s+/g,' ').trim();
  const sub=(h.match(/<h1[^>]*>[^<]+<\/h1>\s*<[^>]+>([^<]{3,60})</i)||[])[1]||'';
  const imgs=[...h.matchAll(/(\/storage\/app\/media\/Feeding[^"']*?DESKTOP[^"']*?\.png)/gi)].map(m=>m[1]);
  const img=imgs[0]||null;
  items.push({url:u.split('/').pop(), lang:u.includes('/lt/')?'lt':'en', title:title.slice(0,80), sub:sub.trim().slice(0,50), img});
}
out.items=items;
out.with_guide=items.filter(x=>x.img).length;
// 3) parsisiunciam unikalius feeding guide PNG i repo
const uniq=new Map();
for(const it of items){ if(it.img && !uniq.has(it.img)) uniq.set(it.img, it); }
out.unique_guides=uniq.size;
let dl=0;
for(const [img] of uniq){
  const fn=decodeURIComponent(img.split('/').pop()).replace(/[^A-Za-z0-9_.\-]/g,'_');
  const p=`/tmp/qg/${fn}`;
  execSync(`curl -sL --max-time 25 -o "${p}" "https://www.quattropet.com${img.replace(/ /g,'%20')}"`);
  if(fs.existsSync(p) && fs.statSync(p).size>2000){ ghPut(`quattro/${fn}`, fs.readFileSync(p), 'quattro guide'); dl++; }
}
out.downloaded=dl;
}catch(e){ out.FATAL=String(e&&e.message?e.message:e).slice(0,400); }
ghPut('screenshots/m8_qg.json',Buffer.from(JSON.stringify(out)),'quattro guides');
console.log('DONE');
