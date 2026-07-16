import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const out={};
try{
fs.mkdirSync('/tmp/hi',{recursive:true});
const ids=[]; for(let n=241;n<=760;n++) ids.push(n);
fs.writeFileSync('/tmp/hi.txt', ids.join('\n'));
execSync(`cat /tmp/hi.txt | xargs -P 16 -I{} sh -c 'curl -sL --max-time 10 -A "Mozilla/5.0 Chrome/120" -o /tmp/hi/{}.html "https://exclusion.pl/x/3-123-{}"' 2>/dev/null || true`,{maxBuffer:90*1024*1024, timeout:250000});
let ok=0; const titles=[]; const ng=[];
for(const n of ids){
  const f=`/tmp/hi/${n}.html`; if(!fs.existsSync(f)) continue;
  const h=fs.readFileSync(f,'utf8'); if(h.length<5000) continue;
  ok++;
  const title=((h.match(/<title>([^<]+)<\/title>/i)||[])[1]||'').replace(/\s+/g,' ').trim();
  const cat=(h.match(/"ecomm_category":"([^"]*)"/)||[])[1]||'';
  titles.push({n,t:title.slice(0,58),c:cat.slice(0,30)});
  if(!/noble|mediterran|monoprotein/i.test(title+cat)) continue;
  const tabs=h.match(/<table[\s\S]*?<\/table>/gi)||[];
  let rows=null, kind=null, matrix=null;
  for(const t of tabs){
    const txt=t.replace(/<[^>]+>/g,'|').replace(/&nbsp;/g,' ').replace(/\|+/g,'|').replace(/\s+/g,' ');
    if(/mies|wiek/i.test(txt)){ const cells=txt.split('|').map(x=>x.trim()).filter(Boolean); if(cells.length>10){ matrix=cells.slice(0,60); continue; } }
    const r=[...txt.matchAll(/(\d+(?:[.,]\d+)?)\s*kg\s*\|\s*(\d+)\s*[-–]\s*(\d+)\s*gr/gi)];
    if(r.length>=3 && (!rows||r.length>rows.length)){ rows=r.map(x=>({kg:parseFloat(x[1].replace(',','.')),from:+x[2],to:+x[3]})); kind='range'; continue; }
    const s=[...txt.matchAll(/(\d+(?:[.,]\d+)?)\s*kg\s*\|\s*(\d+)\s*gr/gi)];
    if(s.length>=3 && !rows){ rows=s.map(x=>({kg:parseFloat(x[1].replace(',','.')),from:+x[2],to:+x[2]})); kind='single'; }
  }
  if(rows||matrix) ng.push({n,title:title.slice(0,64),cat:cat.slice(0,30),kind,rows,matrix});
}
out.fetched=ok; out.ng_count=ng.length; out.ng=ng;
const cats={}; for(const t of titles){ cats[t.c]=(cats[t.c]||0)+1; }
out.categories=cats;
out.sample_titles=titles.slice(0,10);
}catch(e){ out.FATAL=String(e&&e.message?e.message:e).slice(0,400); }
ghPut('screenshots/m8_hi.json',Buffer.from(JSON.stringify(out)),'high id scan');
console.log('DONE');
