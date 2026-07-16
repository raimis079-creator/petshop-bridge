import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'ph',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||35} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#(\d+);/g,(m,d)=>String.fromCharCode(+d)).replace(/&#8211;/g,'-');}
const o={};
const targets=['https://ontario.pet/en/cat-food/','https://ontario.pet/en/for-cats-en/food-adult/'];
for(const t of targets){
  // paskutinis snapshot
  const cdx=get(`https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(t)}&output=json&limit=5&filter=statuscode:200`,35);
  let ts=null; try{ const j=JSON.parse(cdx||'[]'); if(j.length>1) ts=j[j.length-1][1]; }catch(e){}
  const r={ts};
  if(ts){
    const h=get(`https://web.archive.org/web/${ts}id_/${t}`,45);
    r.bytes=h.length;
    r.title=dec((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1]).replace(/\s+/g,' ').trim().slice(0,50);
    r.tables=(h.match(/<table/gi)||[]).length;
    // produktu nuorodos
    const links=[...new Set([...h.matchAll(/href="([^"]+)"/gi)].map(m=>m[1]))]
      .map(u=>u.replace(/^https?:\/\/web\.archive\.org\/web\/\d+\w*\//,''))
      .filter(u=>/ontario\.pet/i.test(u) && /(product|produkt|granul|food|cat)/i.test(u));
    r.links=[...new Set(links)].slice(0,26);
    let b=(h.match(/<body[\s\S]*<\/body>/i)||[h])[0].replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
    const txt=dec(b.replace(/<[^>]+>/g,'\n')).split('\n').map(x=>x.trim()).filter(Boolean).join(' | ');
    r.txt_len=txt.length;
    for(const kw of ['Feeding','feeding','Dávk','dávk','Daily','ration','Weight of']){
      const i=txt.indexOf(kw);
      if(i>=0){ r['kw_'+kw]=txt.slice(Math.max(0,i-120),i+380); break; }
    }
    r.pdfs=[...new Set([...h.matchAll(/href="([^"]+\.pdf[^"]*)"/gi)].map(x=>x[1]))].slice(0,6);
  }
  o[t.slice(-30)]=r;
  await sleep(5000);
}
pr('ph.json',o); console.log('DONE');
