import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:30*1024*1024});}
const out={};
try{
fs.mkdirSync('/tmp/pl',{recursive:true});
// lygiagretus parsisiuntimas: /x/3-123-N, N=1..240
const ids=[]; for(let n=1;n<=240;n++) ids.push(n);
fs.writeFileSync('/tmp/ids.txt', ids.join('\n'));
execSync(`cat /tmp/ids.txt | xargs -P 12 -I{} curl -sL --max-time 20 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" -o /tmp/pl/{}.html "https://exclusion.pl/x/3-123-{}"`,{maxBuffer:50*1024*1024, timeout:280000});
let ok=0, withT=0;
const found=[]; const noTable=[];
for(const n of ids){
  const f=`/tmp/pl/${n}.html`;
  if(!fs.existsSync(f)) continue;
  const h=fs.readFileSync(f,'utf8');
  if(h.length<5000) continue;
  ok++;
  const title=((h.match(/<title>([^<]+)<\/title>/i)||[])[1]||'').replace(/\s+/g,' ').trim();
  const im=h.match(/razioni\/([a-z]{3,6})_razione/i);
  const code=im?im[1].toLowerCase():null;
  const tables=h.match(/<table[\s\S]*?<\/table>/gi)||[];
  let rows=null;
  for(const t of tables){
    const txt=t.replace(/<[^>]+>/g,'|').replace(/&nbsp;/g,' ').replace(/\|+/g,'|').replace(/\s+/g,' ');
    const p=[...txt.matchAll(/(\d+(?:[.,]\d+)?)\s*kg\s*\|\s*(\d+)\s*[-–]\s*(\d+)\s*gr/gi)];
    if(p.length>=3 && (!rows||p.length>rows.length)) rows=p.map(x=>({kg:parseFloat(x[1].replace(',','.')),from:+x[2],to:+x[3]}));
  }
  if(rows){ withT++; found.push({id:n,code,title:title.slice(0,64),n:rows.length,rows}); }
  else noTable.push({id:n,code,title:title.slice(0,52)});
}
out.fetched=ok; out.with_table=withT;
out.found=found; out.no_table=noTable.slice(0,20);
// kodu suvestine
const byCode={};
for(const f of found){ if(!f.code) continue; if(!byCode[f.code]) byCode[f.code]=f.rows; }
out.codes=Object.keys(byCode).sort();
out.byCode=byCode;
}catch(e){ out.FATAL=String(e&&e.message?e.message:e).slice(0,400); }
ghPut('screenshots/m8_plfull.json',Buffer.from(JSON.stringify(out)),'exclusion.pl full crawl');
console.log('DONE fetched='+out.fetched+' tables='+out.with_table);
