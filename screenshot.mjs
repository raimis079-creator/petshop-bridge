import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){ try{ return execSync(`curl -sL --max-time 20 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:20*1024*1024}).toString(); }catch(e){ return ''; } }
const out={};
try{
// ============ A) exclusion.pl : visos kategorijos, PATAISYTAS regex ============
fs.mkdirSync('/tmp/pl',{recursive:true});
// kategoriju puslapiai -> produktu ID
const catPages=['https://exclusion.pl/produkty/psy/2-121','https://exclusion.pl/produkty/psy/karma-bytowa/2-235','https://exclusion.pl/produkty/koty/2-136'];
const pids=new Set();
for(const cp of catPages){
  for(const pg of ['','?p=2','?p=3','?p=4']){
    const h=get(cp+pg); if(!h) continue;
    for(const m of h.matchAll(/exclusion\.pl\/[^"']*?\/(\d+)-(\d+)-(\d+)/g)) pids.add(`${m[1]}-${m[2]}-${m[3]}`);
  }
}
out.pids_from_cats=pids.size;
// + zinomas diapazonas 3-123-N
for(let n=1;n<=240;n++) pids.add(`3-123-${n}`);
const all=[...pids];
fs.writeFileSync('/tmp/pl_ids.txt', all.join('\n'));
execSync(`cat /tmp/pl_ids.txt | xargs -P 14 -I{} sh -c 'curl -sL --max-time 15 -A "Mozilla/5.0 Chrome/120" -o /tmp/pl/$(echo {} | tr / _).html "https://exclusion.pl/x/{}"'`,{maxBuffer:80*1024*1024, timeout:250000});

const RANGE=/(\d+(?:[.,]\d+)?)\s*kg\s*\|\s*(\d+)\s*[-–]\s*(\d+)\s*gr/gi;
const SINGLE=/(\d+(?:[.,]\d+)?)\s*kg\s*\|\s*(\d+)\s*gr/gi;
const plFound=[];
for(const id of all){
  const f=`/tmp/pl/${id.replace(/\//g,'_')}.html`;
  if(!fs.existsSync(f)) continue;
  const h=fs.readFileSync(f,'utf8'); if(h.length<5000) continue;
  const title=((h.match(/<title>([^<]+)<\/title>/i)||[])[1]||'').replace(/\s+/g,' ').trim();
  const cat=(h.match(/"ecomm_category":"([^"]*)"/)||[])[1]||'';
  const tabs=h.match(/<table[\s\S]*?<\/table>/gi)||[];
  let rows=null, kind=null;
  for(const t of tabs){
    const txt=t.replace(/<[^>]+>/g,'|').replace(/&nbsp;/g,' ').replace(/\|+/g,'|').replace(/\s+/g,' ');
    const r=[...txt.matchAll(RANGE)];
    if(r.length>=3 && (!rows||r.length>rows.length)){ rows=r.map(x=>({kg:parseFloat(x[1].replace(',','.')),from:+x[2],to:+x[3]})); kind='range'; continue; }
    const s=[...txt.matchAll(SINGLE)];
    if(s.length>=3 && !rows){ rows=s.map(x=>({kg:parseFloat(x[1].replace(',','.')),from:+x[2],to:+x[2]})); kind='single'; }
  }
  if(rows) plFound.push({id,title:title.slice(0,72),cat:cat.slice(0,40),kind,rows});
}
out.pl_scanned=all.length; out.pl_with_table=plFound.length; out.pl=plFound;

// ============ B) exclusion.lt : SERIMAS paveiksliukai ============
const ltCats=['https://exclusion.lt/hypoallergenic/','https://exclusion.lt/hydrolyzed-hypoallergenic/','https://exclusion.lt/intestinal/',
 'https://exclusion.lt/exclusion-mediterraneo-monoprotein/','https://exclusion.lt/metabolic-mobility/','https://exclusion.lt/mobility/',
 'https://exclusion.lt/urinary/','https://exclusion.lt/renal/','https://exclusion.lt/diabetic/','https://exclusion.lt/hepatic/',
 'https://exclusion.lt/hypoallergenic-katems/','https://exclusion.lt/intestinal-katems/','https://exclusion.lt/urinary-katems/',
 'https://exclusion.lt/renal-katems/','https://exclusion.lt/exclusion-mediterraneo/'];
const ltProd=new Set();
for(const c of ltCats){ const h=get(c); if(!h) continue;
  for(const m of h.matchAll(/href="(https:\/\/exclusion\.lt\/product\/[^"#?]+)"/gi)) ltProd.add(m[1]); }
out.lt_products=ltProd.size;
const ltList=[...ltProd];
const ltRes=[];
for(const u of ltList){
  const h=get(u); if(!h) continue;
  const title=((h.match(/<title>([^<]+)<\/title>/i)||[])[1]||'').replace(/ - exclusion\.lt/,'').replace(/\s+/g,' ').trim();
  // pagrindinio produkto paveiksliukas -> kodas (hyps.png)
  const code=(h.match(/uploads\/\d{4}\/\d{2}\/([a-z]{3,6})(?:-\d+x\d+)?\.png"/i)||[])[1]||null;
  // SERIMAS paveiksliukas
  const ser=[...h.matchAll(/(https:\/\/exclusion\.lt\/wp-content\/uploads\/[^"']*?SERIMAS[^"']*?\.png)/gi)].map(m=>m[1]);
  ltRes.push({url:u,title:title.slice(0,72),code,serimas:[...new Set(ser)].slice(0,1)});
}
out.lt=ltRes;
out.lt_with_serimas=ltRes.filter(x=>x.serimas.length).length;
}catch(e){ out.FATAL=String(e&&e.message?e.message:e).slice(0,400); }
ghPut('screenshots/m8_both.json',Buffer.from(JSON.stringify(out)),'pl full + lt serimas');
console.log('DONE');
