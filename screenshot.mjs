import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pg',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||30} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const o={};
// CDX: ontario.pet produktu puslapiai
const queries=[
  'https://web.archive.org/cdx/search/cdx?url=ontario.pet*&output=json&limit=600&collapse=urlkey&filter=statuscode:200&filter=original:.*(cat|kock|granul|krmivo|produkt|product).*',
];
let rows=[];
for(const q of queries){
  const r=get(q,45);
  try{ const j=JSON.parse(r||'[]'); rows=rows.concat(j.slice(1)); }catch(e){ o.cdx_err=(r||'').slice(0,120); }
  await sleep(4500);
}
o.n=rows.length;
const uniq=new Map(); for(const r of rows) uniq.set(r[2],r[1]);
o.urls=[...uniq.keys()].slice(0,40);
// bandom istraukti viena kaciu produkto snapshot
const cands=[...uniq.entries()].filter(([u])=>/cat|kock/i.test(u)).slice(0,4);
o.probe={};
for(const [u,ts] of cands){
  const snap=`https://web.archive.org/web/${ts}id_/${u}`;
  const h=get(snap,40);
  const tabs=(h.match(/<table/gi)||[]).length;
  const title=(h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1].replace(/\s+/g,' ').trim().slice(0,50);
  const r={ts,bytes:h.length,tables:tabs,title};
  if(tabs){
    const tb=[];
    for(const t of (h.match(/<table[\s\S]*?<\/table>/gi)||[]).slice(0,3)){
      const rr=[];
      for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){
        const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>m[1].replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim());
        if(c.length) rr.push(c);
      }
      if(rr.length) tb.push(rr.slice(0,8));
    }
    r.tab=tb;
  }
  o.probe[u.slice(-56)]=r;
  await sleep(4500);
}
pr('pg.json',o); console.log('DONE n='+o.n);
