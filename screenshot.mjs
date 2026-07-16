import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pj',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||45} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;/g,'-').replace(/&#(\d+);/g,(m,d)=>String.fromCharCode(+d)).replace(/&[a-z]+;/g,' ');}
function parseT(t){const rows=[];
  for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){
    const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());
    if(c.length) rows.push(c);
  }
  return rows;}
const o={};
for(const [key,u] of [['adult','https://ontario.pet/en/for-cats-en/food-adult/'],
                      ['castrate','https://ontario.pet/en/for-cats-en/food-castrate/']]){
  const cdx=get(`https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(u)}&output=json&limit=8&filter=statuscode:200`,35);
  let ts=null; try{ const j=JSON.parse(cdx||'[]'); if(j.length>1) ts=j[j.length-1][1]; }catch(e){}
  const r={ts,blocks:[]};
  if(ts){
    const h=get(`https://web.archive.org/web/${ts}id_/${u}`,55);
    r.bytes=h.length;
    // dalinam pagal produkto antrastes (h2/h3 su "ONTARIO")
    const re=/<h[23][^>]*>([\s\S]{3,80}?)<\/h[23]>/gi;
    const marks=[]; let m;
    while((m=re.exec(h))!==null){
      const name=dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
      if(/ontario/i.test(name)) marks.push({name,idx:m.index});
    }
    for(let i=0;i<marks.length;i++){
      const from=marks[i].idx, to=(i+1<marks.length)?marks[i+1].idx:h.length;
      const seg=h.slice(from,to);
      const tb=(seg.match(/<table[\s\S]*?<\/table>/gi)||[]).map(parseT)
        .filter(t=>{const f=t.flat().join(' ').toLowerCase(); return /cat weight|kg/.test(f) && t.length>=3;});
      // aprasymas
      const txt=dec(seg.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
      r.blocks.push({name:marks[i].name, seg_len:seg.length, n_tab:tb.length, tab:tb.slice(0,2), desc:txt.slice(0,300)});
    }
  }
  o[key]=r;
  await sleep(5000);
}
pr('pj.json',o); console.log('DONE');
