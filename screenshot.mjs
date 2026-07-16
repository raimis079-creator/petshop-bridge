import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){ try{ return execSync(`curl -sL --max-time 18 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:20*1024*1024}).toString(); }catch(e){ return ''; } }
const out={};
try{
// 1) karma-bytowa kategorija -> produktu ID
const seen=new Set();
for(const pg of ['','?p=2','?p=3','?p=4','?p=5']){
  const h=get('https://exclusion.pl/produkty/psy/karma-bytowa/2-235'+pg);
  if(!h) continue;
  for(const m of h.matchAll(/exclusion\.pl\/[^"']*?\/(\d+-\d+-\d+)/g)) seen.add(m[1]);
}
out.from_cat=[...seen].length;
// 2) + skenuojam kitas kategorijas ID diapazonu
const ids=new Set([...seen]);
for(const cat of ['3-235','3-236','2-235']) for(let n=1;n<=200;n++) ids.add(`${cat}-${n}`);
const all=[...ids];
out.to_scan=all.length;
fs.mkdirSync('/tmp/ng',{recursive:true});
fs.writeFileSync('/tmp/ng_ids.txt', all.join('\n'));
execSync(`cat /tmp/ng_ids.txt | xargs -P 14 -I{} sh -c 'curl -sL --max-time 12 -A "Mozilla/5.0 Chrome/120" -o /tmp/ng/{}.html "https://exclusion.pl/x/{}"' 2>/dev/null || true`,{maxBuffer:80*1024*1024, timeout:240000});
const RANGE=/(\d+(?:[.,]\d+)?)\s*kg\s*\|\s*(\d+)\s*[-–]\s*(\d+)\s*gr/gi;
const SINGLE=/(\d+(?:[.,]\d+)?)\s*kg\s*\|\s*(\d+)\s*gr/gi;
const found=[];
for(const id of all){
  const f=`/tmp/ng/${id}.html`;
  if(!fs.existsSync(f)) continue;
  const h=fs.readFileSync(f,'utf8'); if(h.length<5000) continue;
  const title=((h.match(/<title>([^<]+)<\/title>/i)||[])[1]||'').replace(/\s+/g,' ').trim();
  const cat=(h.match(/"ecomm_category":"([^"]*)"/)||[])[1]||'';
  if(!/noble|mediterran|monoprotein|bytowa/i.test(title+cat)) continue;
  const tabs=h.match(/<table[\s\S]*?<\/table>/gi)||[];
  let rows=null, kind=null, matrix=null;
  for(const t of tabs){
    const txt=t.replace(/<[^>]+>/g,'|').replace(/&nbsp;/g,' ').replace(/\|+/g,'|').replace(/\s+/g,' ');
    const r=[...txt.matchAll(RANGE)];
    if(r.length>=3 && (!rows||r.length>rows.length)){ rows=r.map(x=>({kg:parseFloat(x[1].replace(',','.')),from:+x[2],to:+x[3]})); kind='range'; continue; }
    const s=[...txt.matchAll(SINGLE)];
    if(s.length>=3 && !rows){ rows=s.map(x=>({kg:parseFloat(x[1].replace(',','.')),from:+x[2],to:+x[2]})); kind='single'; }
    // matrica: eilutes su 3+ skaiciais
    if(!matrix){
      const cells=txt.split('|').map(x=>x.trim()).filter(Boolean);
      if(cells.length>12 && /mies|wiek|miesi/i.test(txt)) matrix=cells.slice(0,44);
    }
  }
  if(rows||matrix) found.push({id,title:title.slice(0,68),cat:cat.slice(0,34),kind,rows,matrix});
}
out.found=found; out.n=found.length;
}catch(e){ out.FATAL=String(e&&e.message?e.message:e).slice(0,400); }
ghPut('screenshots/m8_ng.json',Buffer.from(JSON.stringify(out)),'noble grain crawl');
console.log('DONE');
