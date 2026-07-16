import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pm',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||55} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;/g,'-').replace(/&#(\d+);/g,(m,d)=>String.fromCharCode(+d)).replace(/&[a-z]+;/g,' ');}
const o={};
const pages=[['dog_cans','https://ontario.pet/en/for-dogs-en/cans/'],
             ['cat_cans','https://ontario.pet/en/for-cats-en/cans/'],
             ['cat_pouches','https://ontario.pet/en/for-cats-en/pouches/'],
             ['cat_treats','https://ontario.pet/en/for-cats-en/treats/']];
for(const [k,u] of pages){
  const cdx=get(`https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(u)}&output=json&limit=8&filter=statuscode:200`,40);
  let ts=null; try{ const j=JSON.parse(cdx||'[]'); if(j.length>1) ts=j[j.length-1][1]; }catch(e){}
  const r={ts};
  if(ts){
    const h=get(`https://web.archive.org/web/${ts}id_/${u}`,60);
    r.bytes=h.length;
    // produkto blokai pagal ONTARIO h2/h3
    const marks=[]; const re=/<h[23][^>]*>([\s\S]{2,90}?)<\/h[23]>/gi; let m;
    while((m=re.exec(h))!==null){
      const t=dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
      if(/ontario/i.test(t)) marks.push({t,i:m.index});
    }
    r.blocks=[];
    for(let i=0;i<marks.length;i++){
      const from=marks[i].i, to=(i+1<marks.length)?marks[i+1].i:h.length;
      const seg=h.slice(from,to);
      const tb=[];
      for(const t of (seg.match(/<table[\s\S]*?<\/table>/gi)||[])){
        const rr=[];
        for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){
          const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(x=>dec(x[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());
          if(c.length) rr.push(c);
        }
        if(rr.length>=2) tb.push(rr.slice(0,10));
      }
      r.blocks.push({name:marks[i].t,n:tb.length,tab:tb.slice(0,2)});
    }
  }
  o[k]=r;
  await sleep(5500);
}
pr('pm.json',o); console.log('DONE');
