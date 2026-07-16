import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pi',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||40} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;/g,'-').replace(/&#(\d+);/g,(m,d)=>String.fromCharCode(+d)).replace(/&[a-z]+;/g,' ');}
function tables(h){const res=[];
 for(const t of (h.match(/<table[\s\S]*?<\/table>/gi)||[])){
   const rows=[];
   for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){
     const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());
     if(c.length) rows.push(c);
   }
   if(rows.length) res.push(rows);
 }
 return res;}
const o={};
const pages=[
  ['adult','https://ontario.pet/en/for-cats-en/food-adult/'],
  ['castrate','https://ontario.pet/en/for-cats-en/food-castrate/'],
  ['kitten','https://ontario.pet/en/for-cats-en/food-kitten/'],
];
for(const [k,u] of pages){
  const cdx=get(`https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(u)}&output=json&limit=8&filter=statuscode:200`,35);
  let ts=null; try{ const j=JSON.parse(cdx||'[]'); if(j.length>1) ts=j[j.length-1][1]; }catch(e){}
  const r={ts};
  if(ts){
    const h=get(`https://web.archive.org/web/${ts}id_/${u}`,50);
    r.bytes=h.length;
    const tb=tables(h);
    r.n=tb.length;
    // tik tos, kur yra svoris+gramai
    r.feed=tb.filter(t=>{const f=t.flat().join(' ').toLowerCase(); return /kg/.test(f)&&/\bg\b|g\/|gram/.test(f)&&t.length>=2;}).slice(0,8);
    // produktu pavadinimai
    let b=(h.match(/<body[\s\S]*<\/body>/i)||[h])[0].replace(/<script[\s\S]*?<\/script>/gi,' ');
    const names=[...new Set([...b.matchAll(/<h[23][^>]*>([\s\S]{3,70}?)<\/h[23]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim()))];
    r.h=names.filter(n=>n.length>3).slice(0,20);
  }
  o[k]=r;
  await sleep(5000);
}
pr('pi.json',o); console.log('DONE');
